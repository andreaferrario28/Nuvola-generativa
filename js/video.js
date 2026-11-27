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
  const underlay = $('video-underlay');
  const canvas = $('video-canvas');
  const ctx = canvas.getContext('2d');
  const house = new Path2D('M2 3h6v2h6v7h-4v2H2z');
  const play = $('video-play');
  const download = $('video-download');
  const downloadMp4 = $('video-download-mp4');
  const downloadMp4Black = $('video-download-mp4-black');
  const status = $('video-status');
  const controls = [format, speed, size, source, downloadMp4, downloadMp4Black];
  const fps = 30;
  const blackoutStart = .88;
  const darkeningStart = .73;
  const glitchClusters = [
    { x: .23, y: .31, radiusX: .21, radiusY: .17, weight: 1 },
    { x: .72, y: .67, radiusX: .22, radiusY: .19, weight: .92 },
    { x: .83, y: .20, radiusX: .11, radiusY: .10, weight: .62 }
  ];
  let particles = [];
  let animation;
  let previewUrl;

  function hash(index, salt) {
    const noise = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return noise - Math.floor(noise);
  }

  function makeBlackMotif(image) {
    const mask = document.createElement('canvas');
    const scale = 256 / Math.max(image.naturalWidth, image.naturalHeight);
    mask.width = Math.max(1, Math.round(image.naturalWidth * scale));
    mask.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = mask.getContext('2d');
    context.drawImage(image, 0, 0, mask.width, mask.height);
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = '#000';
    context.fillRect(0, 0, mask.width, mask.height);
    return mask;
  }

  function drawMotif(effect, x, y, diameter, black) {
    if (effect.image) {
      const { naturalWidth, naturalHeight } = effect.image;
      const scale = diameter / Math.max(naturalWidth, naturalHeight);
      const w = naturalWidth * scale;
      const h = naturalHeight * scale;
      ctx.drawImage(black ? effect.blackImage : effect.image, x - w / 2, y - h / 2, w, h);
      return;
    }

    ctx.save();
    ctx.translate(x - diameter / 2, y - diameter / 2);
    ctx.scale(diameter / 16, diameter / 16);
    const color = black ? '#000' : effect.color;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    if (effect.outline) ctx.stroke(house);
    else ctx.fill(house);
    ctx.restore();
  }

  function glitchDensity(x, y) {
    const density = glitchClusters.reduce((total, cluster) => {
      const distance = ((x - cluster.x) / cluster.radiusX) ** 2 +
        ((y - cluster.y) / cluster.radiusY) ** 2;
      return total + cluster.weight * Math.exp(-distance);
    }, 0);
    return Math.min(1, density);
  }

  function buildPattern() {
    cancelAnimationFrame(animation);
    underlay.pause();
    const [width, height] = format.value.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;
    $('video-frame').style.setProperty('--ratio', width / height);
    $('video-dimensions').textContent = width + ' × ' + height + ' px · Disturbo di segnale';

    const chosen = effects.filter(effect => effect.selected);
    const diameter = Number(size.value);
    // Limita l'area occupata dal disturbo di base.
    const capacity = Math.min(140, Math.floor(width * height * .16 / diameter ** 2));
    const rows = Math.max(1, Math.round(Math.sqrt(capacity * height / width)));
    const columns = Math.max(1, Math.ceil(capacity / rows));
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    particles = Array.from({ length: rows * columns }, (_, index) => ({
      x: (index % columns + .2 + hash(index, 1) * .6) * cellWidth,
      y: (Math.floor(index / columns) + .2 + hash(index, 2) * .6) * cellHeight,
      diameter: diameter * (.6 + hash(index, 3) * .4),
      delay: hash(index, 4)
    })).sort((a, b) => a.delay - b.delay).slice(0, capacity);

    for (const [index, particle] of particles.entries()) {
      particle.effect = chosen[Math.floor(hash(index, 5) * chosen.length)];
      particle.density = glitchDensity(particle.x / width, particle.y / height);
    }

    const lateMotifsPerCluster = 6;
    const lateParticles = particles.flatMap((particle, index) => {
      if (particle.density < .5) return [];
      return Array.from({ length: lateMotifsPerCluster }, (_, offset) => {
        const seed = index * lateMotifsPerCluster + offset;
        const angle = 2 * Math.PI * (offset + hash(seed, 61)) / lateMotifsPerCluster;
        const distance = .15 + hash(seed, 62) * .23;
        const x = particle.x + Math.cos(angle) * cellWidth * distance;
        const y = particle.y + Math.sin(angle) * cellHeight * distance;
        return {
          x, y,
          diameter: diameter * (.53 + hash(seed, 63) * .28),
          delay: hash(seed, 64),
          effect: chosen[Math.floor(hash(seed, 65) * chosen.length)],
          density: glitchDensity(x / width, y / height),
          late: true
        };
      }).filter(particle => particle.density >= .48);
    });
    particles.push(...lateParticles);

    render(0);
  }

  function render(progress) {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    if (progress <= 0) return;
    if (progress >= blackoutStart) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    const intensity = progress / blackoutStart;
    const darkening = Math.max(0, (progress - darkeningStart) / (blackoutStart - darkeningStart));
    const tick = Math.floor(progress * Number(speed.value) * 19);
    const surge = Math.max(0, (intensity - .72) / .28);
    for (const [index, particle] of particles.entries()) {
      const appearance = particle.late ? surge ** 1.6 : intensity ** 1.5 * (.65 + particle.density * .35);
      if (plotterGlitchProgress(appearance, particle.delay) <= 0) continue;
      const density = particle.density;
      const activity = .34 + intensity * (.08 + density * .42);
      const contrast = surge * (density * .23 - (1 - density) ** 2 * .36);
      const visibility = Math.max(.1, Math.min(.84, activity + contrast));
      if (hash(index, tick + 11) > visibility) continue;
      const black = hash(index, 59) < darkening * (.24 + particle.density * .27);
      drawMotif(particle.effect, particle.x, particle.y, particle.diameter, black);
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
      link.download = 'clouded-issue-disturbo-' + format.value + '.mov';
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

  function drawComposite(composite, progress, blackBackground) {
    const { width, height } = canvas;
    composite.fillStyle = blackBackground ? '#000' : STUDIO_BACKGROUNDS.white.hex;
    composite.fillRect(0, 0, width, height);
    if (!blackBackground && !underlay.hidden && underlay.readyState >= 2) {
      const scale = Math.max(width / underlay.videoWidth, height / underlay.videoHeight);
      const videoWidth = underlay.videoWidth * scale;
      const videoHeight = underlay.videoHeight * scale;
      composite.drawImage(underlay, (width - videoWidth) / 2, (height - videoHeight) / 2, videoWidth, videoHeight);
    }
    render(progress);
    composite.drawImage(canvas, 0, 0);
  }

  async function exportMp4(blackBackground) {
    const mimeType = getVideoRecordingType('mp4');
    const output = document.createElement('canvas');
    if (!output.captureStream || !mimeType) {
      status.textContent = 'Esportazione MP4 non disponibile in questo browser.';
      return;
    }

    cancelAnimationFrame(animation);
    underlay.pause();
    updateControls(true);
    status.textContent = 'Registrazione MP4 in corso…';
    let stream;
    try {
      output.width = canvas.width;
      output.height = canvas.height;
      const composite = output.getContext('2d', { alpha: false });
      const duration = Number(speed.value) * 1000;
      if (!blackBackground && !underlay.hidden) {
        underlay.currentTime = 0;
        await underlay.play();
      }
      drawComposite(composite, 0, blackBackground);

      stream = output.captureStream(fps);
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
      const chunks = [];
      const movie = await new Promise((resolve, reject) => {
        recorder.ondataavailable = event => {
          if (event.data.size) chunks.push(event.data);
        };
        recorder.onerror = () => reject(new Error('Registrazione MP4 interrotta'));
        recorder.onstop = () => {
          if (chunks.length) resolve(new Blob(chunks, { type: recorder.mimeType || mimeType }));
          else reject(new Error('Registrazione MP4 vuota'));
        };
        recorder.start();
        const start = performance.now();
        function frame(now) {
          const progress = Math.min(1, (now - start) / duration);
          drawComposite(composite, progress, blackBackground);
          if (progress < 1) animation = requestAnimationFrame(frame);
          else recorder.stop();
        }
        animation = requestAnimationFrame(frame);
      });

      const url = URL.createObjectURL(movie);
      const link = document.createElement('a');
      link.href = url;
      const suffix = blackBackground ? '-sfondo-nero' : '';
      link.download = 'clouded-issue-disturbo-' + format.value + suffix + '.mp4';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      status.textContent = 'MP4 esportato.';
    } catch {
      status.textContent = 'Esportazione MP4 non riuscita.';
    } finally {
      cancelAnimationFrame(animation);
      stream?.getTracks().forEach(track => track.stop());
      underlay.pause();
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
        effect.blackImage = makeBlackMotif(image);
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
    downloadMp4.addEventListener('click', () => exportMp4(false));
    downloadMp4Black.addEventListener('click', () => exportMp4(true));

    buildPattern();
    updateControls(false);
    status.textContent = '';
  }

  initialize();
})();
