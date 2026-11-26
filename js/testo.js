(() => {
  'use strict';

  const effects = [
    { id: 'emissioni', name: 'Emissioni', file: 'emissioni', terms: String.raw`inquinamento atmosferico|gas di scarico|particolato|anidride carbonica|fuliggine|ossidi di azoto|fumo|atmosferic\p{L}*|inquin\p{L}*|aria|emission\p{L}*|smog|co[₂2]|gas serra|fumi|polveri sottili` },
    { id: 'falda', name: 'Falda', terms: String.raw`inquinamento (?:idrico|dell[’\x27]acqua|delle falde)|(?:contamin|inquin)\p{L}* (?:l[’\x27]acqua|le falde|dell[’\x27]acqua|delle falde)|risorse idriche|prosciug\p{L}*|irrig\p{L}*|potabil\p{L}*|sorgent[ei]|fium[ei]|fognatur\p{L}*|acqu\p{L}*|idric\p{L}*|fald[ae]|siccità|pozzi?|raffreddamento ad acqua` },
    { id: 'suolo', name: 'Consumo di suolo', file: 'campi', terms: String.raw`perdita di terreno agricolo|terreno agricolo|are[ae] agricol[ae]|impermeabilizz\p{L}*|asfalt\p{L}*|edificabil\p{L}*|brownfield|urbanizz\p{L}*|suolo|cementific\p{L}*|terren\p{L}*|campi|consumo di territorio` },
    { id: 'fauna', name: 'Flora e fauna', file: 'fauna', terms: String.raw`specie (?:protette|selvatiche)|ecosistem\p{L}*|uccell[oi]|insett[oi]|impollinator\p{L}*|nidific\p{L}*|deforest\p{L}*|albero|bosch[io]|forest[ae]|flora|fauna|biodiversità|habitat|animali|vegetazione|alberi` },
    { id: 'energia', name: 'Tralicci', file: 'elettricità', terms: String.raw`consumo di corrente|alta tensione|rete elettrica|cavi elettrici|cabina elettrica|sottostazion\p{L}*|chilowat\p{L}*|kilowat\p{L}*|megawat\p{L}*|gigawat\p{L}*|kwh|mwh|energia|elettric\p{L}*|energetic\p{L}*|tralicc\p{L}*|megawatt|elettrodott\p{L}*` },
    { id: 'case', name: 'Pressione sulle case', terms: String.raw`salta la corrente|manca la corrente|rete (?:al collasso|satura)|servizi (?:saturi|sotto pressione)|disserviz\p{L}*|cal[oi] di tensione|interruzion\p{L}* del servizio|blackout|pressione sulle case|pressione sulla rete|sovraccaric\p{L}*|interruzion\p{L}* di corrente` },
    { id: 'bollette', name: 'Bollette', terms: String.raw`(?:costo|prezzo) (?:dell[’\x27](?:energia|elettricità)|della (?:luce|corrente))|costi energetici|spese per la luce|caro[- ]?(?:bollett\p{L}*|energia)|bollett\p{L}*|tariff\p{L}*|costo dell[’\x27]energia|rincar\p{L}*` },
    { id: 'immobili', name: 'Valore immobiliare', file: 'valore immobiliare', terms: String.raw`valore degli immobili|prezz[oi] degli immobili|mercato immobiliare|affitt\p{L}*|svalut\p{L}*|quotazion\p{L}* immobiliari|immobiliar\p{L}*|affitti?|mutui?|valore delle case|prezzi? delle case` },
    { id: 'lavoro', name: 'Posti di lavoro', file: 'posti di lavoro', terms: String.raw`assum\p{L}*|impieg\p{L}*|disoccup\p{L}*|licenzi\p{L}*|manodopera|opportunità professional\p{L}*|lavor\p{L}*|occupazion\p{L}*|assunzion\p{L}*|impiegh\p{L}*` },
    { id: 'calore', name: 'Calore', file: 'calore', terms: String.raw`ondate? di caldo|cald[oaie]|scald\p{L}*|riscald\p{L}*|rovent[ei]|bollent[ei]|afa|afos\p{L}*|termic\p{L}*|arrovent\p{L}*|canicol[ae]|calore|surriscald\p{L}*|temperatur\p{L}*|caldo|isole? di calore` },
    { id: 'rumore', name: 'Rumore', file: 'rumore', terms: String.raw`inquinamento acustico|disturbo acustico|ronz\p{L}*|frastuon\p{L}*|vibran[ot]\p{L}*|baccano|fracass\p{L}*|assord\p{L}*|fischi\p{L}*|insonorizz\p{L}*|rumor\p{L}*|acustic\p{L}*|decibel|ronzi\p{L}*|ventol\p{L}*|vibrazion\p{L}*` }
  ];

  const byId = new Map(effects.map(effect => [effect.id, effect]));
  const effectPatterns = effects.map(({ id, terms }) => ({
    id,
    pattern: new RegExp('(?<![\\p{L}\\p{N}])(?:' + terms + ')(?![\\p{L}\\p{N}])', 'giu')
  }));
  const boundaryPattern = /[.!?;,:\n]+[ \t]*|\s+(?=(?:e|ma|mentre|inoltre|oppure|però|poi|anche)\s)/giu;
  const segmenter = new Intl.Segmenter('it', { granularity: 'grapheme' });
  const wordSegmenter = new Intl.Segmenter('it', { granularity: 'word' });
  const wordGlitchDuration = 2400;
  const wordGlitchStepDuration = 50;
  const wordGlitchPattern = [true, false, true, true, false, true, false, false, true, true, true, false, true];
  const house = new Path2D('M2 3h6v2h6v7h-4v2H2z');
  const cursorParticles = [
    { x: 0, y: .55, size: 1 },
    { x: .45, y: -.55, size: 1 },
    { x: 1.15, y: .25, size: 1 }
  ];
  const heatParticleScales = [.84, 1, .92];
  const cursorIndices = cursorParticles.map((_, index) => index);
  const cursorStepDuration = 130;
  const cursorTop = Math.min(...cursorParticles.map(particle => particle.y - particle.size / 2));
  const cursorBottom = Math.max(...cursorParticles.map(particle => particle.y + particle.size / 2));
  const cursorLeft = Math.min(...cursorParticles.map(particle => particle.x));
  const cursorRight = Math.max(...cursorParticles.map(particle => particle.x + particle.size));
  const $ = id => document.getElementById(id);
  const comment = $('comment');
  const canvas = $('preview');
  const ctx = canvas.getContext('2d');
  const dimensions = $('dimensions');
  const status = $('status');
  const playbackControls = [$('play'), $('download')];
  const background = $('background');
  const settings = [comment, $('format'), $('speed'), background];
  const split = $('split');
  const markWords = $('markWords');
  const markedWordsList = $('markedWords');
  const wordFeedback = $('wordFeedback');
  const markedWords = new Map();
  let runs = [];
  let layout;
  let animation;
  let recording = false;
  let ready = false;

  function detectEffects(text) {
    if (!text.trim()) return [];
    const candidates = effectPatterns.flatMap(({ id, pattern }) =>
      Array.from(text.matchAll(pattern), match => ({
        start: match.index,
        end: match.index + match[0].length,
        id
      }))
    ).sort((a, b) => a.start - b.start || b.end - a.end);
    const matches = [];
    for (const candidate of candidates) {
      if (candidate.start >= (matches.at(-1)?.end ?? 0)) matches.push(candidate);
    }
    const boundaries = Array.from(text.matchAll(boundaryPattern), match => match.index + match[0].length);
    const detected = [{ start: 0, id: matches[0]?.id || '' }];
    let previous = matches[0];

    for (const current of matches.slice(1)) {
      if (current.id !== previous.id) {
        const start = boundaries.find(index => index >= previous.end && index <= current.start) ?? current.start;
        detected.push({ start, id: current.id });
      }
      previous = current;
    }

    return detected.map((run, index) => ({ ...run, end: detected[index + 1]?.start ?? text.length }));
  }

  function splitPassage() {
    const position = Array.from(segmenter.segment(comment.value)).find(glyph => glyph.index >= comment.selectionStart)?.index;
    const index = runs.findIndex(run => run.start < position && position < run.end);
    if (index < 0) return;
    const run = runs[index];
    runs.splice(index + 1, 0, { start: position, end: run.end, id: run.id });
    run.end = position;
    updateEffectControls();
    $('effects').querySelectorAll('select')[index + 1].focus();
  }

  function updateEffectControls() {
    const container = $('effects');
    container.replaceChildren();
    if (!runs.length) {
      container.append(Object.assign(document.createElement('p'), { textContent: 'Inserisci un commento per impostare il cursore.' }));
    }

    for (const run of runs) {
      const label = document.createElement('label');
      const excerpt = document.createElement('span');
      excerpt.textContent = comment.value.slice(run.start, run.end).trim();
      const select = document.createElement('select');
      select.add(new Option('Sciame neutro', ''));
      for (const effect of effects) select.add(new Option(effect.name, effect.id));
      select.value = run.id;
      select.addEventListener('change', () => {
        run.id = select.value;
        play();
      });
      label.append(excerpt, select);
      container.append(label);
    }
  }

  function updateMarkedWords() {
    markedWordsList.replaceChildren();
    const ordered = [...markedWords.values()].sort((a, b) => a.index - b.index);
    for (const word of ordered) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = word.segment + ' ×';
      button.setAttribute('aria-label', 'Rimuovi glitch da ' + word.segment);
      button.addEventListener('click', () => {
        markedWords.delete(word.index);
        updateMarkedWords();
        markWords.focus();
        play();
      });
      markedWordsList.append(button);
    }
  }

  function toggleSelectedWords() {
    const { selectionStart, selectionEnd, value } = comment;
    const words = [...wordSegmenter.segment(value)].filter(word => word.isWordLike &&
      word.index < selectionEnd && word.index + word.segment.length > selectionStart);
    if (selectionStart === selectionEnd || !words.length) {
      wordFeedback.textContent = 'Seleziona almeno una parola nel commento.';
      return;
    }

    const remove = words.every(word => markedWords.has(word.index));
    for (const word of words) {
      if (remove) markedWords.delete(word.index);
      else markedWords.set(word.index, word);
    }
    wordFeedback.textContent = '';
    updateMarkedWords();
    play();
  }

  function wrap(glyphs, width) {
    const lines = [];
    let line = { start: 0, text: '', length: 0 };
    function next(start) {
      lines.push(line);
      line = { start, text: '', length: 0 };
    }

    for (let index = 0; index < glyphs.length;) {
      const char = glyphs[index].segment;
      if (char === '\n' || char === '\r\n') {
        next(++index);
        continue;
      }
      let end = index + 1;
      if (!/\s/u.test(char)) {
        while (end < glyphs.length && !/\s/u.test(glyphs[end].segment)) end++;
      }
      const word = glyphs.slice(index, end).map(glyph => glyph.segment).join('');
      if (line.text && ctx.measureText(line.text + word).width > width) next(index);

      while (index < end) {
        const piece = glyphs[index].segment;
        if (line.text && ctx.measureText(line.text + piece).width > width) next(index);
        line.text += piece;
        line.length++;
        index++;
      }
    }

    return [...lines, line];
  }

  function buildLayout() {
    const [width, height] = $('format').value.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;
    $('screen').style.setProperty('--ratio', width / height);
    dimensions.textContent = `${width} × ${height} px · Eiffel Medium`;

    const text = comment.value;
    const glyphs = Array.from(segmenter.segment(text));
    const margin = Math.round(width * .1);
    let low = 0;
    let high = Math.round(Math.min(width, height) * .105) + 1;
    let fitted;

    while (high - low > 1) {
      const size = Math.floor((high + low) / 2);
      ctx.font = `500 ${size}px Eiffel`;
      const cap = ctx.measureText('H');
      const cursorAscent = cap.actualBoundingBoxAscent || size * .7;
      const cursorHeight = cursorAscent + (cap.actualBoundingBoxDescent || 0);
      const cursorScale = cursorHeight / (cursorBottom - cursorTop);
      const cursorWidth = (cursorRight - cursorLeft) * cursorScale;
      const lines = wrap(glyphs, width - 2 * margin - size * .12 - cursorWidth);
      if (lines.length * size * 1.16 > height * .78) {
        high = size;
      } else {
        low = size;
        fitted = { lines, size, cursorAscent, cursorScale };
      }
    }

    const lastVisibleCount = glyphs.findLastIndex(glyph => /\S/u.test(glyph.segment)) + 1;
    layout = fitted && { ...fitted, glyphs, margin, width, height, lastVisibleCount };
    canvas.setAttribute('aria-label', text.trim() ? `Anteprima del commento: ${text}` : 'Anteprima vuota');
  }

  function drawParticle(id, x, y, size) {
    const effect = byId.get(id);
    if (id === 'falda') {
      const barWidth = size * .21;
      const barHeight = size * .84;
      ctx.fillStyle = '#2CC6C6';
      ctx.fillRect(x + size * .19, y - size * .34, barWidth, barHeight);
      ctx.fillStyle = '#740';
      ctx.fillRect(x + size * .47, y - size * .5, barWidth, barHeight);
    } else if (effect?.image) {
      const { naturalWidth, naturalHeight } = effect.image;
      const scale = size / Math.max(naturalWidth, naturalHeight);
      ctx.drawImage(effect.image, x, y - naturalHeight * scale / 2, naturalWidth * scale, naturalHeight * scale);
    } else if (id === 'case' || id === 'bollette') {
      ctx.save();
      ctx.translate(x, y - size / 2);
      ctx.scale(size / 16, size / 16);
      ctx.fillStyle = '#FFEC3E';
      ctx.strokeStyle = '#E0B500';
      ctx.lineWidth = 1.5;
      if (id === 'case') ctx.fill(house);
      else ctx.stroke(house);
      ctx.restore();
    } else {
      ctx.fillStyle = '#969691';
      ctx.fillRect(x, y - size / 2, size, size);
    }
  }

  function createCursorSequence(random = Math.random) {
    const visible = new Set();
    const pick = choices => choices[Math.floor(random() * choices.length)];
    let turningOn = true;
    let keepLit;

    return () => {
      if (turningOn) {
        visible.add(pick(cursorIndices.filter(index => !visible.has(index))));
        if (visible.size === cursorIndices.length) {
          turningOn = false;
          keepLit = random() < .25 ? pick(cursorIndices) : undefined;
        }
      } else {
        visible.delete(pick([...visible].filter(index => index !== keepLit)));
        if (visible.size === (keepLit === undefined ? 0 : 1)) turningOn = true;
      }
      return [...visible];
    };
  }

  function drawCursor(id, x, y, scale, visible) {
    for (const index of visible) {
      const particle = cursorParticles[index];
      const size = particle.size * scale;
      const particleSize = id === 'calore' ? size * heatParticleScales[index] : size;
      drawParticle(id, x + (particle.x - cursorLeft) * scale + (size - particleSize) / 2,
        y + (particle.y - cursorTop) * scale, particleSize);
    }
  }

  function effectAt(count) {
    const nextIndex = layout.glyphs[count]?.index ?? comment.value.length;
    return runs.findLast(run => run.start <= nextIndex)?.id;
  }

  function drawGlitchedLine(text, start, x, y, font, size, wordsVisible, words) {
    const end = start + text.length;
    let offset = 0;

    for (const word of words) {
      const wordEnd = word.index + word.segment.length;
      if (wordEnd <= start) continue;
      if (word.index >= end) break;

      const left = Math.max(start, word.index) - start;
      const right = Math.min(end, wordEnd) - start;
      const runX = x + ctx.measureText(text.slice(0, offset)).width;
      const wordX = x + ctx.measureText(text.slice(0, left)).width;
      const wordWidth = x + ctx.measureText(text.slice(0, right)).width - wordX;
      ctx.fillText(text.slice(offset, left), runX, y);

      if (wordWidth > 0 && wordsVisible) {
        ctx.font = size + 'px "Eiffel Level 02"';
        ctx.fillText(text.slice(left, right), wordX, y, wordWidth);
        ctx.font = font;
      }
      offset = right;
    }

    ctx.fillText(text.slice(offset), x + ctx.measureText(text.slice(0, offset)).width, y);
  }

  function wordGlitchVisible(elapsed) {
    const step = Math.floor(elapsed / wordGlitchStepDuration);
    return elapsed >= wordGlitchDuration || wordGlitchPattern[step % wordGlitchPattern.length];
  }

  function render(count, visible = cursorIndices, glitchElapsed, words = []) {
    const colors = STUDIO_BACKGROUNDS[background.value];
    ctx.fillStyle = colors.hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!layout || !runs.length) return;

    const { glyphs, lines, size, margin, height, cursorAscent, cursorScale, lastVisibleCount } = layout;
    const finished = count === glyphs.length;
    const lineHeight = size * 1.16;
    const top = (height - lines.length * lineHeight) / 2;
    const font = `500 ${size}px Eiffel`;
    ctx.font = font;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = colors.ink;
    const wordsVisible = glitchElapsed !== undefined && wordGlitchVisible(glitchElapsed);
    let cursorX = margin;
    let cursorY = top;

    for (const [index, line] of lines.entries()) {
      if (line.start > count) break;
      const length = Math.min(count - line.start, line.length);
      const prefixEnd = length === line.length ? line.text.length :
        glyphs[line.start + length].index - glyphs[line.start].index;
      const prefix = line.text.slice(0, prefixEnd);
      const baseline = top + index * lineHeight + size * .89;
      if (glitchElapsed !== undefined && words.length && prefix.length) {
        drawGlitchedLine(prefix, glyphs[line.start].index, margin, baseline, font, size, wordsVisible, words);
      } else {
        ctx.fillText(prefix, margin, baseline);
      }
      if (!finished || line.start < lastVisibleCount) {
        const cursorText = finished ? prefix.trimEnd() : prefix;
        cursorX = margin + ctx.measureText(cursorText).width;
        cursorY = baseline - cursorAscent;
      }
    }

    drawCursor(effectAt(count), cursorX + size * .12, cursorY, cursorScale, visible);
  }

  function setControls() {
    for (const control of playbackControls) control.disabled = !ready || recording || !layout || !runs.length;
    split.disabled = !ready || recording || !runs.length;
    markWords.disabled = !ready || recording;
    for (const button of markedWordsList.querySelectorAll('button')) button.disabled = recording;
    for (const control of [...settings, ...$('effects').querySelectorAll('select')]) control.disabled = recording;
  }

  function animate(onComplete) {
    cancelAnimationFrame(animation);
    const speed = Number($('speed').value);
    const length = layout.glyphs.length;
    let count = 0;
    const start = performance.now();
    let nextCharacter = start + 350 + speed;
    let typingEnd;
    const words = [...markedWords.values()].sort((a, b) => a.index - b.index);
    const hold = words.length ? wordGlitchDuration : 1500;
    const advanceCursor = createCursorSequence();
    let visible = [];
    let nextCursorStep = start;
    render(0, visible);

    function frame(now) {
      if (count < length && now >= nextCharacter) {
        count++;
        nextCharacter = Math.max(nextCharacter + speed, now + 34);
        if (count === length) typingEnd = now;
      }

      if (now >= nextCursorStep) {
        visible = advanceCursor();
        nextCursorStep = now + cursorStepDuration * (visible.length === cursorParticles.length ? 2 : 1);
      }

      const exportFinished = onComplete && typingEnd !== undefined &&
        now >= typingEnd + hold && visible.length === cursorParticles.length;
      const elapsed = typingEnd === undefined ? undefined : now - typingEnd;
      render(count, visible, elapsed, words);
      if (exportFinished) {
        onComplete();
      } else {
        animation = requestAnimationFrame(frame);
      }
    }

    animation = requestAnimationFrame(frame);
  }

  function play() {
    if (ready && layout && runs.length) animate();
  }

  function refresh() {
    cancelAnimationFrame(animation);
    buildLayout();
    setControls();
    status.textContent = runs.length && !layout ? 'Il commento è troppo lungo per il formato selezionato.' : '';
    if (layout && runs.length) play();
    else render(0);
  }

  function exportVideo() {
    if (!canvas.captureStream || typeof MediaRecorder === 'undefined') {
      status.textContent = 'L’esportazione video non è disponibile in questo browser.';
      return;
    }

    const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/mp4', 'video/webm']
      .find(type => MediaRecorder.isTypeSupported(type));
    let stream;
    try {
      stream = canvas.captureStream(30);
      const options = { videoBitsPerSecond: 8000000 };
      if (mimeType) options.mimeType = mimeType;
      const recorder = new MediaRecorder(stream, options);
      const chunks = [];
      let failed = false;
      recorder.ondataavailable = event => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => {
        failed = true;
        cancelAnimationFrame(animation);
        status.textContent = 'Registrazione interrotta.';
      };
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        recording = false;
        setControls();
        if (failed || !chunks.length) {
          status.textContent = 'Impossibile creare il video.';
          return;
        }

        const type = recorder.mimeType || mimeType || chunks[0].type;
        const url = URL.createObjectURL(new Blob(chunks, { type }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `clouded-issue-commento-${$('format').value}.${type.includes('mp4') ? 'mp4' : 'webm'}`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = 'Video esportato.';
      };

      render(0);
      recorder.start();
      recording = true;
      setControls();
      status.textContent = 'Registrazione in corso…';
      animate(() => {
        if (recorder.state !== 'inactive') recorder.stop();
      });
    } catch {
      stream?.getTracks().forEach(track => track.stop());
      recording = false;
      setControls();
      status.textContent = 'Impossibile avviare l’esportazione video.';
    }
  }

  async function initialize() {
    try {
      const [fonts, level02] = await Promise.all([
        document.fonts.load('500 40px Eiffel'),
        document.fonts.load('40px "Eiffel Level 02"'),
        ...effects.filter(effect => effect.file).map(async effect => {
          const image = new Image();
          image.src = `Assets/Effetti/${encodeURIComponent(effect.file)}.svg`;
          await image.decode();
          effect.image = image;
        })
      ]);
      if (!fonts.length || !level02.length) throw new Error('Eiffel');
    } catch {
      status.textContent = 'Impossibile caricare il font o le micro-geometrie.';
      return;
    }

    ready = true;
    function loadComment() {
      runs = detectEffects(comment.value);
      updateEffectControls();
      refresh();
    }

    comment.addEventListener('input', () => {
      const hadMarks = markedWords.size > 0;
      markedWords.clear();
      updateMarkedWords();
      wordFeedback.textContent = hadMarks ? 'Testo modificato. Seleziona di nuovo le parole da marcare.' : '';
      loadComment();
    });
    markWords.addEventListener('click', toggleSelectedWords);
    $('format').addEventListener('change', refresh);
    background.addEventListener('change', refresh);
    $('speed').addEventListener('change', play);
    $('play').addEventListener('click', play);
    $('download').addEventListener('click', exportVideo);
    split.addEventListener('click', splitPassage);
    loadComment();
  }

  initialize();
})();
