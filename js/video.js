(() => {
  'use strict';

  const effects = [
    { label: 'Emissioni', file: 'emissioni', selected: true },
    { label: 'Falda', file: 'falde', selected: true },
    { label: 'Calore', file: 'calore' },
    { label: 'Rumore', file: 'rumore' },
    { label: 'Traffico', file: 'traffico' },
    { label: 'Consumo di suolo', file: 'campi' },
    { label: 'Flora e fauna', file: 'fauna' },
    { label: 'Tralicci', file: 'elettricità' },
    { label: 'Valore immobiliare', file: 'valore immobiliare' },
    { label: 'Posti di lavoro', file: 'posti di lavoro' },
    { label: 'Pressione sulle case', color: '#FFEC3E' },
    { label: 'Bollette', color: '#E0B500', outline: true }
  ];
  const $ = id => document.getElementById(id);
  const format = $('video-format');
  const speed = $('video-speed');
  const size = $('video-size');
  const source = $('video-source');
  const transparent = $('video-transparent');
  const underlay = $('video-underlay');
  const canvas = $('video-canvas');
  const ctx = canvas.getContext('2d');
  const pattern = document.createElement('canvas');
  const patternCtx = pattern.getContext('2d');
  const house = new Path2D('M2 3h6v2h6v7h-4v2H2z');
  const play = $('video-play');
  const download = $('video-download');
  const status = $('video-status');
  const controls = [format, speed, size, source, transparent];
  const fps = 30;
  let tiles = [];
  let animation;
  let previewUrl;

  function hash(index, salt) {
    const noise = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return noise - Math.floor(noise);
  }

  function drawMotif(effect, x, y, diameter) {
    if (effect.image) {
      const { naturalWidth, naturalHeight } = effect.image;
      const scale = diameter / Math.max(naturalWidth, naturalHeight);
      const w = naturalWidth * scale;
      const h = naturalHeight * scale;
      patternCtx.drawImage(effect.image, x - w / 2, y - h / 2, w, h);
      return;
    }

    patternCtx.save();
    patternCtx.translate(x - diameter / 2, y - diameter / 2);
    patternCtx.scale(diameter / 16, diameter / 16);
    patternCtx.fillStyle = effect.color;
    patternCtx.strokeStyle = effect.color;
    patternCtx.lineWidth = 1.5;
    if (effect.outline) patternCtx.stroke(house);
    else patternCtx.fill(house);
    patternCtx.restore();
  }

  function buildPattern() {
    cancelAnimationFrame(animation);
    underlay.pause();
    const [width, height] = format.value.split('x').map(Number);
    canvas.width = pattern.width = width;
    canvas.height = pattern.height = height;
    $('video-frame').style.setProperty('--ratio', width / height);
    $('video-dimensions').textContent = width + ' × ' + height + ' px · Plotter / Glitch';

    const chosen = effects.filter(effect => effect.selected);
    const diameter = Number(size.value);
    const columns = Math.max(1, Math.floor(width / (diameter * 1.22)));
    const rows = Math.max(1, Math.floor(height / (diameter * 1.22)));
    if (!transparent.checked) {
      patternCtx.fillStyle = STUDIO_BACKGROUNDS.paper.hex;
      patternCtx.fillRect(0, 0, width, height);
    }
    tiles = [];

    for (let row = 0; row < rows; row++) {
      const y = Math.round(row * height / rows);
      const bottom = Math.round((row + 1) * height / rows);
      for (let col = 0; col < columns; col++) {
        const x = Math.round(col * width / columns);
        const right = Math.round((col + 1) * width / columns);
        const index = row * columns + col;
        const tile = { x, y, w: right - x, h: bottom - y, delay: hash(index, 2) };
        const effect = chosen[Math.floor(hash(index, 3) * chosen.length)];
        drawMotif(effect, (x + right) / 2, (y + bottom) / 2, diameter);
        tiles.push(tile);
      }
    }

    render(0);
  }

  function render(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (progress >= 1) return;
    ctx.drawImage(pattern, 0, 0);
    if (progress <= 0) return;

    for (const tile of tiles) {
      // Plotter / Glitch al contrario: il tassello sparisce intero quando scatta il suo ritardo.
      if (plotterGlitchProgress(1 - progress, tile.delay) <= 0) {
        ctx.clearRect(tile.x, tile.y, tile.w, tile.h);
      }
    }
  }

  function preview() {
    cancelAnimationFrame(animation);
    const duration = Number(speed.value) * 1000;
    if (!underlay.hidden) {
      underlay.currentTime = 0;
      underlay.play().catch(() => {});
    }
    const start = performance.now();
    render(0);

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      render(progress);
      if (progress < 1) animation = requestAnimationFrame(frame);
    }
    animation = requestAnimationFrame(frame);
  }

  function updateControls(busy) {
    for (const control of [play, download, ...controls, ...effects.map(effect => effect.input)]) {
      control.disabled = busy;
    }
  }

  async function exportVideo() {
    cancelAnimationFrame(animation);
    underlay.pause();
    updateControls(true);
    try {
      const frameCount = Math.max(2, Math.round(Number(speed.value) * fps));
      const frames = [];
      for (let index = 0; index < frameCount; index++) {
        render(index / (frameCount - 1));
        status.textContent = 'Esportazione MOV · ' + (index + 1) + ' / ' + frameCount;
        frames.push(await encodeCanvasPng(canvas));
      }

      const movie = createAlphaMovie(frames, canvas.width, canvas.height, fps);
      const url = URL.createObjectURL(movie);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'clouded-issue-transizione-' + format.value + '.mov';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      status.textContent = 'MOV con trasparenza esportato · 30 fps.';
    } catch {
      status.textContent = 'Esportazione non riuscita. Riprova.';
    } finally {
      render(0);
      updateControls(false);
    }
  }

  function setPreviewVideo() {
    cancelAnimationFrame(animation);
    underlay.pause();
    underlay.removeAttribute('src');
    underlay.hidden = true;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = source.files[0] ? URL.createObjectURL(source.files[0]) : undefined;
    if (previewUrl) {
      underlay.src = previewUrl;
      underlay.hidden = false;
    }
    underlay.load();
    render(0);
    status.textContent = '';
  }

  async function initialize() {
    try {
      await Promise.all(effects.filter(effect => effect.file).map(async effect => {
        const image = new Image();
        image.src = 'Assets/Effetti/' + encodeURIComponent(effect.file) + '.svg';
        await image.decode();
        effect.image = image;
      }));
    } catch {
      status.textContent = 'Caricamento delle microgeometrie non riuscito.';
      return;
    }

    for (const effect of effects) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = Boolean(effect.selected);
      effect.input = input;
      input.addEventListener('change', () => {
        if (!effects.some(option => option.input.checked)) {
          input.checked = true;
          status.textContent = 'Mantieni selezionata almeno una microgeometria.';
          return;
        }
        effect.selected = input.checked;
        status.textContent = '';
        buildPattern();
      });
      label.append(input, effect.label);
      $('video-effects').append(label);
    }

    format.addEventListener('change', buildPattern);
    transparent.addEventListener('change', buildPattern);
    speed.addEventListener('input', () => {
      $('speed-value').value = Number(speed.value).toLocaleString('it-IT', { minimumFractionDigits: 2 }) + ' s';
    });
    size.addEventListener('input', () => {
      $('size-value').value = size.value + ' px';
      buildPattern();
    });
    source.addEventListener('change', setPreviewVideo);
    underlay.addEventListener('error', () => {
      if (previewUrl) {
        underlay.hidden = true;
        status.textContent = 'Questo video di prova non può essere riprodotto nel browser.';
      }
    });
    play.addEventListener('click', preview);
    download.addEventListener('click', exportVideo);

    buildPattern();
    updateControls(false);
    status.textContent = '';
  }

  initialize();
})();
