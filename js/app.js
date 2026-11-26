    (function () {
      'use strict';

      /* ======================================================================
         1. DEFINITIONS: EFFECTS, CATEGORIES, SPATIAL LOGICS, FORMATS
         ====================================================================== */

      const SPATIAL_LOGICS = [
        { id: 'urban-blocks',    label: 'Isolati Urbani (Barre)' },
        { id: 'modular-grid',    label: 'Griglia Modulare' },
        { id: 'flow-paths',      label: 'Traiettorie / Flussi' },
        { id: 'tessellation',    label: 'Tassellatura Ortogonale' },
        { id: 'organic-scatter', label: 'Dispersione Periferica' },
        { id: 'dense-patch',     label: 'Macchia Compatta' },
        { id: 'network-lines',   label: 'Rete & Vettori (+)' },
        { id: 'tension-arcs',    label: 'Archi di Tensione' },
        { id: 'accumulation',    label: 'Accumulo Progressivo' },
        { id: 'plume',           label: 'Pennacchio Sottovento' },
        { id: 'heat-island',     label: 'Isola di Calore (Halftone)' },
        { id: 'isophones',       label: 'Isofone / Bande Onda' }
      ];

      const CATEGORIES = [
        { id: 'economia', label: '01 / Economia' },
        { id: 'ambiente', label: '02 / Ambiente' },
        { id: 'energia',  label: '03 / Energia e Servizi' },
        { id: 'salute',   label: '04 / Salute e Vivibilità' }
      ];

      const EFFECTS_CONFIG = [
        // ECONOMIA
        {
          id: 'valore-immobiliare',
          name: 'Valore immobiliare',
          category: 'economia',
          color: '#3371E2',
          shape: 'house-fill',
          defaultLogic: 'property-grid',
          fixedLogic: true,
          active: true,
          intensity: 62,
          iconSvg: '<path d="M2 3h6v2h6v7h-4v2H2z" fill="#3371E2"/>'
        },
        {
          id: 'posti-di-lavoro',
          name: 'Posti di lavoro',
          category: 'economia',
          color: '#0099BC',
          shape: 'job-circle',
          defaultLogic: 'cluster-scatter',
          fixedLogic: true,
          maxDots: 81,
          active: false,
          intensity: 55,
          iconSvg: '<circle cx="8" cy="8" r="5" fill="#fff" stroke="#0099BC" stroke-width="2.6"/>'
        },

        // AMBIENTE
        {
          id: 'consumo-suolo',
          name: 'Consumo di suolo',
          category: 'ambiente',
          shape: 'cross-dot',
          defaultLogic: 'tessellation',
          fixedLogic: true,
          color: '#61C883',
          brownfield: 0,
          active: false,
          intensity: 60,
          iconSvg: '<path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="3.8"/>'
        },
        {
          id: 'flora-fauna',
          name: 'Flora e fauna',
          category: 'ambiente',
          color: '#008A4E',
          shape: 'hollow-circle',
          defaultLogic: 'flora-scatter',
          maxDots: 155,
          active: false,
          intensity: 55,
          iconSvg: '<circle cx="8" cy="8" r="5" fill="none" stroke="#008A4E" stroke-width="2"/>'
        },
        {
          id: 'falda',
          name: 'Falda',
          category: 'ambiente',
          color: '#2CC6C6',
          contamination: 50,
          shape: 'aquifer-ribbon',
          defaultLogic: 'water-traces',
          fixedLogic: true,
          active: false,
          intensity: 60,
          iconSvg: '<rect x="1" y="4.5" width="12" height="2" fill="#2CC6C6"/><rect x="3" y="8" width="12" height="2" fill="#740"/>'
        },

        // ENERGIA E SERVIZI
        {
          id: 'tralicci',
          name: 'Tralicci',
          category: 'energia',
          color: '#FFEC3E',
          shape: 'pylon',
          defaultLogic: 'branching-pylons',
          fixedLogic: true,
          active: true,
          intensity: 68
        },
        {
          id: 'pressione-rete',
          name: 'Pressione sulle case',
          category: 'energia',
          color: '#FFEC3E',
          shape: 'house-fill',
          defaultLogic: 'settlements',
          fixedLogic: true,
          active: true,
          intensity: 60,
          iconSvg: '<path d="M2 3h6v2h6v7h-4v2H2z" fill="#FFEC3E"/>'
        },
        {
          id: 'bollette',
          name: 'Bollette',
          category: 'energia',
          color: '#E0B500',
          shape: 'house-outline',
          defaultLogic: 'settlements',
          fixedLogic: true,
          active: true,
          intensity: 60,
          iconSvg: '<path d="M2 3h6v2h6v7h-4v2H2z" fill="none" stroke="#E0B500" stroke-width="1.5"/>'
        },

        // SALUTE E VIVIBILITÀ
        {
          id: 'emissioni',
          name: 'Emissioni',
          category: 'salute',
          color: '#FFA4E3',
          shape: 'square',
          defaultLogic: 'emission-scatter',
          fixedLogic: true,
          active: true,
          intensity: 72,
          iconSvg: '<rect x="2.5" y="2.5" width="11" height="11" fill="#FFA4E3"/>'
        },
        {
          id: 'calore',
          name: 'Calore',
          category: 'salute',
          color: '#FF5F40',
          shape: 'halftone',
          defaultLogic: 'heat-island',
          fixedLogic: true,
          mergeDots: false,
          active: true,
          intensity: 76,
          iconSvg: '<circle cx="4.5" cy="4.5" r="2.5" fill="#FF5F40"/><circle cx="11.5" cy="4.5" r="2.5" fill="#FF5F40"/><circle cx="4.5" cy="11.5" r="2.5" fill="#FF5F40"/><circle cx="11.5" cy="11.5" r="2.5" fill="#FF5F40"/>'
        },
        {
          id: 'rumore',
          name: 'Rumore',
          category: 'salute',
          color: '#9E1D6C',
          defaultLogic: 'diagonal-bands',
          fixedLogic: true,
          active: false,
          intensity: 62,
          iconSvg: '<path d="M1 8L11 2M2 12L14 5M5 14L15 8" stroke="#9E1D6C"/><path d="M4 11L10 7M8 13L15 8.8" stroke="#9E1D6C" stroke-width="2.4"/>'
        }
      ];

      // Motivi vettoriali nello spazio locale del modulo, condivisi da Canvas e SVG.
      const HOUSE_FOOTPRINTS = [
        'M-.5 -.45H-.04V-.24H.5V.31H.16V.46H-.5Z',
        'M-.48 -.43H.18V-.16H.47V.44H-.48Z',
        'M-.46 -.37H.46V.36H-.46Z',
        'M-.5 -.48H.5V.43H.11V.07H-.11V.43H-.5Z',
        'M-.51 -.27L-.17 -.27V-.47H.34V-.12H.49V.45H-.51Z',
        'M-.46 -.25L-.08 -.48L.45 -.30V.42H-.46Z'
      ].map(d => [{ d, path: new Path2D(d) }]);

      // I cinque rettangoli di elettricità.svg, normalizzati al viewBox originale.
      const PYLON_MOTIF = [
        { d: 'M-0.165862 -0.222574L-0.125535 -0.500369L0.262886 -0.443981L0.222558 -0.166187Z', fill: '#FFEC3E' },
        { d: 'M-0.262594 0.443731L-0.222266 0.165936L0.166155 0.222324L0.125827 0.500119Z', fill: '#FFEC3E' },
        { d: 'M-0.499981 0.125712L-0.443593 -0.262709L-0.165798 -0.222381L-0.222186 0.166040Z', fill: '#FFEC3E' },
        { d: 'M0.166048 0.222444L0.222436 -0.165977L0.500231 -0.125649L0.443843 0.262771Z', fill: '#FFEC3E' },
        { d: 'M-0.222121 0.165911L-0.165734 -0.222509L0.222687 -0.166122L0.166299 0.222299Z', fill: '#E3FF15' }
      ];
      const VECTOR_MOTIFS = {
        pylon: PYLON_MOTIF
      };
      for (const motif of Object.values(VECTOR_MOTIFS)) {
        for (const stroke of motif) stroke.path = new Path2D(stroke.d);
      }

      function getVectorMotif(item) {
        if (item.house !== undefined) return HOUSE_FOOTPRINTS[item.house];
        return VECTOR_MOTIFS[item.shape];
      }

      const FORMATS = {
        a4:     { width: 900,  height: 1200, label: '900 × 1200 px (3:4)' },
        square: { width: 1080, height: 1080, label: '1080 × 1080 px (1:1)' },
        story:  { width: 720,  height: 1280, label: '720 × 1280 px (9:16)' },
        banner: { width: 1280, height: 720,  label: '1280 × 720 px (16:9)' }
      };

      const TEXT_FONTS = {
        'Regular': 'Regular',
        'Italic': 'Italic',
        'Light': 'Light',
        'LightItalic': 'Light Italic',
        'Medium': 'Medium',
        'MediumItalic': 'Medium Italic',
        'Bold': 'Bold',
        'BoldItalic': 'Bold Italic',
        'Level-02': 'Level −02',
        'Level-01': 'Level −01',
        'Level01': 'Level 01',
        'Level02': 'Level 02',
        'Level03': 'Level 03',
        'LevelAir': 'Level Air'
      };
      const LOGO_PATHS = CLOUD_EDITION_LOGO.paths.map(path => new Path2D(path));
      const HALFTONE_RADIUS_RATIO = 0.52;
      const HOUSE_LAYER_ID = 'pressione-rete';

      /* ======================================================================
         2. APPLICATION STATE
         ====================================================================== */

      const state = {
        variation: Math.floor(Math.random() * 0x100000000),
        format: 'a4',
        background: 'paper',
        categoryScales: Object.fromEntries(CATEGORIES.map(({ id }) => [id, 1])),
        grid: { visible: false, columns: 5, rows: 5, gap: 1.25, margin: 3 },
        typography: {
          enabled: true,
          color: CLOUD_EDITION_LOGO.color,
          position: 'bottom-left',
          blocks: [{ text: 'EDIZIONE 0 /// LACCHIARELLA', font: 'Regular', size: 14,
            column: 1, row: 5, vertical: 'bottom' }]
        },
        effects: EFFECTS_CONFIG.map(e => ({
          ...e, logic: e.defaultLogic
        })),
        layers: new Map(),
        move: { enabled: false, positions: new Map() },
        // Motion engine
        anim: {
          mode: 'static',     // 'static' | 'in' | 'out' | 'loop'
          style: 'plotter-glitch',
          speed: 1.0,
          progress: 1.0,      // 0..1
          phase: 'hold',      // for loop: 'in' | 'hold' | 'out' | 'pause'
          phaseTimer: 0,
          lastTime: 0,
          isRecording: false
        }
      };

      /* ======================================================================
         3. DETERMINISTIC PRNG & 2D VALUE NOISE
         ====================================================================== */

      function createRNG(seed) {
        let a = seed >>> 0;
        return function () {
          a |= 0;
          a = (a + 0x6D2B79F5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      // Smooth deterministic 2D noise for organic zones & plumes
      function hash2D(ix, iy, seed) {
        let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
        n = (n ^ (n >>> 13)) >>> 0;
        n = Math.imul(n, 1274126177) >>> 0;
        return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
      }

      function noise2D(x, y, seed) {
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const fx = x - ix;
        const fy = y - iy;
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);
        const a = hash2D(ix, iy, seed);
        const b = hash2D(ix + 1, iy, seed);
        const c = hash2D(ix, iy + 1, seed);
        const d = hash2D(ix + 1, iy + 1, seed);
        return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
      }

      function fbm2D(x, y, seed) {
        return noise2D(x, y, seed) * 0.65 + noise2D(x * 2.1, y * 2.1, seed + 17) * 0.35;
      }

      /* ======================================================================
         4. COMPOSITION HELPERS
         ====================================================================== */

      function getFreeAnchor(effectIndex) {
        // Gli strati partono da zone diverse e conservano la posizione durante le modifiche.
        const offset = Math.floor(hash2D(12, 91, state.variation) * 12);
        const zone = (effectIndex * 5 + offset) % 12;
        return {
          x: (zone % 3 + 0.10 + hash2D(effectIndex, 53, state.variation) * 0.80) / 3,
          y: (Math.floor(zone / 3) + 0.10 + hash2D(effectIndex, 79, state.variation) * 0.80) / 4
        };
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      function createParcelMap(seed, intensity) {
        const spacing = 0.33 - intensity * 0.079;
        const sites = [];
        for (let row = -6; row <= 6; row++) {
          for (let col = -6; col <= 6; col++) {
            sites.push({
              x: (col + (hash2D(col, row, seed) - 0.5) * 0.94) * spacing * 1.14,
              y: (row + (hash2D(col, row, seed + 11) - 0.5) * 0.94) * spacing,
              weight: (hash2D(col, row, seed + 23) - 0.5) * spacing ** 2 * 0.52,
              lane: spacing * (0.055 + hash2D(col, row, seed + 41) * 0.075)
            });
          }
        }

        return (u, v) => {
          // Piega i confini senza spostare o deformare i moduli del retino.
          const x = u + (fbm2D(u * 4.8 + 8, v * 4.4 + 5, seed + 83) - 0.5) * 0.22;
          const y = v + (fbm2D(u * 4.6 + 3, v * 4.9 + 9, seed + 97) - 0.5) * 0.20;
          let nearest = -1;
          let minDistance = Infinity;
          for (let i = 0; i < sites.length; i++) {
            const site = sites[i];
            const distance = (x - site.x) ** 2 + (y - site.y) ** 2 - site.weight;
            if (distance < minDistance) {
              nearest = i;
              minDistance = distance;
            }
          }
          const winner = sites[nearest];
          for (let i = 0; i < sites.length; i++) {
            if (i === nearest) continue;
            const site = sites[i];
            const difference = (x - site.x) ** 2 + (y - site.y) ** 2 - site.weight - minDistance;
            const siteDistanceSquared = (winner.x - site.x) ** 2 + (winner.y - site.y) ** 2;
            if (difference ** 2 < (winner.lane + site.lane) ** 2 * siteDistanceSquared) return null;
          }
          return nearest;
        };
      }

      function getClusterCenters(rng, count, spread, focal) {
        const phase = rng() * Math.PI * 2;
        return Array.from({ length: count }, (_, i) => {
          const angle = phase + i * Math.PI * 2 / count;
          const jitter = (rng() - 0.5) * 0.09;
          const reflect = value => value < 0.018 ? 0.036 - value : value > 0.982 ? 1.964 - value : value;
          const distance = (spread + jitter) * 1.42;
          return { x: reflect(focal.x + Math.cos(angle) * distance), y: reflect(focal.y + Math.sin(angle) * distance) };
        });
      }

      /* ======================================================================
         5. SPATIAL GENERATORS (12 DISTINCT ALGORITHMIC LOGICS)
         ====================================================================== */

      function generateEffectLayer(effect, W, H, effectIndex) {
        const items = [];
        const lines = [];
        const strength = effect.intensity / 100;
        if (!effect.active || strength === 0) {
          return { items, lines };
        }

        // Per i pallini, la distribuzione di base è indipendente dal cursore.
        const intensity = effect.maxDots ? 0.55 : strength;
        const dotCapacity = (effect.maxDots ?? 0) * 2;
        const subSeed = (state.variation * 31 + (effectIndex + 1) * 7919) >>> 0;
        const rng = createRNG(subSeed);
        const minDim = Math.min(W, H);
        const baseUnit = (minDim / 90) * state.categoryScales[effect.category];
        const logic = effect.logic;
        const color = effect.color;
        const freeAnchor = getFreeAnchor(effectIndex);
        const focalPoint = (spread = 0.14) => ({
          x: clamp(freeAnchor.x + (rng() - 0.5) * spread, 0.018, 0.982),
          y: clamp(freeAnchor.y + (rng() - 0.5) * spread, 0.018, 0.982)
        });

        // ------------------------------------------------------------------
        // 1. URBAN-BLOCKS (clustered vertical bars)
        // ------------------------------------------------------------------
        if (logic === 'urban-blocks') {
          const numClusters = Math.max(1, Math.round(1 + intensity * 3.5));
          for (let c = 0; c < numClusters; c++) {
            const center = focalPoint(0.45);
            const cols = Math.round(7 + intensity * 12);
            const rows = Math.round(2 + intensity * 3);
            const spacingX = baseUnit * 1.15;
            const spacingY = baseUnit * 3.2;
            const rotBlock = (rng() - 0.5) * 0.25;
            const cosR = Math.cos(rotBlock);
            const sinR = Math.sin(rotBlock);

            for (let r = 0; r < rows; r++) {
              for (let k = 0; k < cols; k++) {
                if (rng() < 0.12) continue;
                const lx = (k - (cols - 1) / 2 + (r % 2 ? 0.5 : 0)) * spacingX;
                const ly = (r - rows / 2) * spacingY;
                const x = center.x * W + lx * cosR - ly * sinR;
                const y = center.y * H + lx * sinR + ly * cosR;

                const barH = baseUnit * (1.2 + fbm2D(k * 0.35, r * 0.8, subSeed + c) * 3.6);
                const barW = barH * (6.54 / 34.74);
                const order = clamp((c / numClusters) * 0.4 + (k / cols) * 0.45 + (r / rows) * 0.15, 0, 1);

                items.push({
                  shape: effect.shape,
                  x, y,
                  size: baseUnit,
                  w: barW,
                  h: barH,
                  rot: rotBlock,
                  color,
                  order
                });
              }
            }
          }
        }

        // ------------------------------------------------------------------
        // 2. MODULAR-GRID (structured modular placement)
        // ------------------------------------------------------------------
        else if (logic === 'modular-grid') {
          const stepX = baseUnit * 3.1;
          const stepY = baseUnit * 1.9;
          const numZones = Math.max(1, Math.round(1 + intensity * 2.5));
          const anchors = Array.from({ length: numZones }, () => focalPoint(0.5));

          const radius = 0.12 + intensity * 0.22;
          const startCol = Math.floor((Math.min(...anchors.map(a => a.x)) - radius) * W / stepX);
          const endCol = Math.ceil((Math.max(...anchors.map(a => a.x)) + radius) * W / stepX);
          const startRow = Math.floor((Math.min(...anchors.map(a => a.y)) - radius) * H / stepY);
          const endRow = Math.ceil((Math.max(...anchors.map(a => a.y)) + radius) * H / stepY);
          for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
              const x = c * stepX;
              const y = r * stepY;
              const nx = x / W, ny = y / H;

              // Check proximity to any modular cluster anchor
              let minD = 99;
              for (const a of anchors) {
                const d = Math.hypot(nx - a.x, ny - a.y);
                if (d < minD) minD = d;
              }
              if (minD > radius) continue;
              if (rng() > (1 - minD / radius) * 0.9 + 0.15) continue;

              const w = baseUnit * (1.5 + Math.floor(rng() * 2) * 0.9);
              const h = baseUnit * 0.65;
              const order = clamp(nx * 0.6 + ny * 0.4, 0, 1);

              items.push({
                shape: effect.shape,
                x, y,
                size: baseUnit * 0.9,
                w, h,
                rot: 0,
                color,
                order
              });
            }
          }
        }

        else if (logic === 'cluster-scatter') {
          const origin = focalPoint(0.35);
          const radius = minDim * 0.245;
          const direction = rng() * Math.PI * 2;
          const centers = Array.from({ length: 3 }, (_, cluster) => {
            const axis = direction + cluster * Math.PI * 2 / 3;
            return {
              x: origin.x * W + Math.cos(axis) * radius * 0.72,
              y: origin.y * H + Math.sin(axis) * radius * 0.72
            };
          });
          for (let i = 0; items.length < dotCapacity && i < dotCapacity * 32; i++) {
            const center = centers[i % centers.length];
            const angle = rng() * Math.PI * 2;
            const distance = Math.sqrt(rng()) * radius * 0.6;
            const x = center.x + Math.cos(angle) * distance;
            const y = center.y + Math.sin(angle) * distance;
            if (items.some(dot => Math.hypot(x - dot.x, y - dot.y) < baseUnit * 1.08)) continue;
            items.push({ shape: effect.shape, x, y, color, order: distance / radius });
          }
        }

        else if (logic === 'water-traces') {
          // I due tracciati attraversano il foglio e proseguono oltre i bordi.
          const courses = [
            [[-0.28, 0.34], [-0.06, 0.376], [0.17, 0.39], [0.28, 0.51],
              [0.33, 0.60], [0.46, 0.75], [0.58, 0.77], [0.75, 0.83],
              [0.87, 0.79], [1.07, 0.81], [1.28, 0.87]],
            [[0.48, -0.25], [0.54, -0.07], [0.60, 0.09], [0.68, 0.19],
              [0.76, 0.24], [0.80, 0.38], [0.81, 0.53], [0.85, 0.61],
              [0.96, 0.70], [1.13, 0.82], [1.29, 0.87]]
          ];
          const pitch = baseUnit * 0.42;
          const width = minDim * (0.010 + intensity * 0.015);
          for (const [trace, course] of courses.entries()) {
            const bankSeed = subSeed + trace * 281;
            const phase = rng() * Math.PI * 2;
            const nodes = course.map(([x, y]) => ({
              x: (x - 0.5) * W,
              y: (y - 0.5) * H
            }));
            const upper = [];
            const lower = [];
            for (let i = 0; i < nodes.length - 1; i++) {
              const a = nodes[i], b = nodes[i + 1];
              const before = nodes[i - 1] ?? a;
              const after = nodes[i + 2] ?? b;
              const c1 = { x: a.x + (b.x - before.x) / 6, y: a.y + (b.y - before.y) / 6 };
              const c2 = { x: b.x - (after.x - a.x) / 6, y: b.y - (after.y - a.y) / 6 };
              const steps = Math.max(3, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (pitch * 0.7)));
              for (let j = 0; j < steps + (i === nodes.length - 2 ? 1 : 0); j++) {
                const t = j / steps;
                const point = cubicBezier(a, c1, c2, b, t);
                const tangent = cubicBezierTangent(a, c1, c2, b, t);
                const length = Math.hypot(tangent.x, tangent.y);
                const normalX = -tangent.y / length;
                const normalY = tangent.x / length;
                const progress = (i + t) / (nodes.length - 1);
                const meander = Math.sin(progress * 85 + phase) * width * 0.74
                  + Math.sin(progress * 160 + phase) * width * 0.33;
                const taper = Math.min(1, progress * 9, (1 - progress) * 9);
                const left = meander - width * taper * (0.39 + noise2D(progress * 31, 3, bankSeed) * 0.25);
                const right = meander + width * taper * (0.39 + noise2D(progress * 31, 7, bankSeed) * 0.25);
                upper.push({ x: point.x + normalX * left, y: point.y + normalY * left });
                lower.push({ x: point.x + normalX * right, y: point.y + normalY * right });
              }
            }
            const points = upper.concat(lower.reverse());
            const bounds = getPointBounds(points);
            const ribbon = createAquiferRibbon(points, bounds, pitch, effect.contamination, bankSeed);
            items.push({
              shape: effect.shape, x: W / 2, y: H / 2, color, size: width,
              order: trace * 0.26, ribbon
            });
          }
        }

        // 3. FLOW-PATHS (marks aligned along curved trajectories)
        else if (logic === 'flow-paths') {
          const numPaths = Math.max(1, Math.round(1 + intensity * 4.5));
          for (let p = 0; p < numPaths; p++) {
            const horizontal = rng() > 0.48;
            const anchor = focalPoint(0.53);
            const end = clamp((horizontal ? anchor.y : anchor.x) + (rng() - 0.5) * 0.54, 0.006, 0.994);
            const start = clamp((horizontal ? anchor.y : anchor.x) + (rng() - 0.5) * 0.44, 0.006, 0.994);
            const p0 = horizontal ? { x: 0, y: start * H } : { x: start * W, y: 0 };
            const p3 = horizontal ? { x: W, y: end * H } : { x: end * W, y: H };
            const p1 = { x: anchor.x * W, y: clamp(anchor.y + (rng() - 0.5) * 0.35, 0, 1) * H };
            const p2 = { x: clamp(anchor.x + (rng() - 0.5) * 0.35, 0, 1) * W, y: anchor.y * H };

            const steps = Math.round(18 + intensity * 38);
            const reach = Math.min(1.22, 0.57 + intensity * 0.43);
            const startT = rng() > 0.5 ? 1 - reach : 0;
            for (let i = 0; i < steps; i++) {
              const t = i / (steps - 1);
              const along = startT + t * reach;
              const pt = cubicBezier(p0, p1, p2, p3, along);
              const tang = cubicBezierTangent(p0, p1, p2, p3, along);

              const angle = Math.atan2(tang.y, tang.x) + Math.PI / 2;
              items.push({
                shape: effect.shape,
                x: pt.x,
                y: pt.y,
                size: baseUnit * (0.82 + rng() * 0.25),
                w: baseUnit,
                h: baseUnit,
                rot: angle,
                color,
                order: t
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 4. TESSELLATION (organic polygon filled with an orthogonal grid)
        // ------------------------------------------------------------------
        else if (logic === 'tessellation') {
          const anchor = focalPoint(0.35);
          const soil = effect.brownfield !== undefined;
          const step = baseUnit * (soil ? 1.06 : 1.45);
          const fields = new Map();
          const parcelAt = soil ? createParcelMap(subSeed, intensity) : null;
          const radX = (0.10 + intensity * 0.30) * W;
          const radY = (0.10 + intensity * 0.28) * H;
          const cx = anchor.x * W;
          const cy = anchor.y * H;
          const axis = (rng() - 0.5) * 1.3;
          const cos = Math.cos(axis);
          const sin = Math.sin(axis);

          const startX = Math.floor((cx - radX * 1.3) / step) * step;
          const endX   = cx + radX * 1.3;
          const startY = Math.floor((cy - radY * 1.3) / step) * step;
          const endY   = cy + radY * 1.3;

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;

              const dx = (x - cx) / radX;
              const dy = (y - cy) / radY;
              const nVal = fbm2D(nx * 5.5, ny * 5.5, subSeed);
              const u = dx * cos - dy * sin;
              const v = dx * sin + dy * cos;
              const dist = Math.max(Math.abs(u), Math.abs(v)) + (nVal - 0.5) * 0.55;
              const boundary = soil ? 0.92 + (fbm2D(u * 3.1 + 9, v * 3.3 + 7, subSeed + 53) - 0.5) * 0.55 : 0.95;
              if (dist > boundary) continue;
              const field = parcelAt?.(u, v);
              if (soil && field === null) continue;

              const order = clamp(((x - startX) / (endX - startX + 1)) * 0.5 + ((y - startY) / (endY - startY + 1)) * 0.5, 0, 1);
              const item = {
                shape: effect.shape, x, y,
                size: soil ? step * 0.83 : baseUnit * 0.72,
                w: baseUnit * 0.72, h: baseUnit * 0.72, rot: 0, color, order
              };
              if (soil) {
                if (!fields.has(field)) fields.set(field, { rank: hash2D(field, 37, subSeed), items: [] });
                fields.get(field).items.push(item);
              }
              items.push(item);
            }
          }
          if (soil) {
            // Ogni crocino raggiunge metà della maglia soltanto verso un
            // vicino della stessa parcella. I passaggi restano aperti.
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const field of fields.values()) {
              const grid = new Set(field.items.map(item => `${Math.round(item.x / step)},${Math.round(item.y / step)}`));
              for (const item of field.items) {
                const col = Math.round(item.x / step);
                const row = Math.round(item.y / step);
                item.crossArms = directions.map(([dx, dy]) =>
                  grid.has(`${col + dx},${row + dy}`) ? step / 2 + 0.02 : item.size * 0.46
                );
              }
            }
            const brownCount = Math.round(fields.size * effect.brownfield / 100);
            const ranked = [...fields.values()].sort((a, b) => a.rank - b.rank);
            for (const field of ranked.slice(0, brownCount)) {
              for (const item of field.items) item.color = '#634142';
            }
          }
        }

        else if (logic === 'flora-scatter') {
          const focal = freeAnchor;
          const spacing = baseUnit;
          for (let attempt = 0; items.length < dotCapacity && attempt < dotCapacity * 32; attempt++) {
            const margin = 0.004;
            const nx = margin + rng() * (1 - margin * 2);
            const ny = margin + rng() * (1 - margin * 2);
            const distance = Math.hypot(nx - focal.x, ny - focal.y);
            const radial = clamp(distance / 0.51, 0, 1);
            const grain = fbm2D(nx * 7, ny * 7, subSeed);
            if (rng() > (0.12 + radial ** 1.35 * 0.88) * (0.25 + grain * 0.75)) continue;
            const x = nx * W;
            const y = ny * H;
            if (items.some(dot => Math.hypot(x - dot.x, y - dot.y) < spacing)) continue;
            items.push({
              shape: effect.shape, x, y, color, order: radial,
              size: baseUnit, w: baseUnit, h: baseUnit, rot: 0
            });
          }
        }

        // ------------------------------------------------------------------
        // 5. ORGANIC-SCATTER (Flora e fauna)
        // ------------------------------------------------------------------
        else if (logic === 'organic-scatter') {
          const count = dotCapacity || Math.round(25 + intensity * 130);
          const radius = 0.19 + intensity * 0.47;
          const center = focalPoint();
          let attempts = 0;

          const maxAttempts = count * (effect.maxDots ? 24 : 8);
          while (items.length < count && attempts < maxAttempts) {
            attempts++;
            const angle = rng() * Math.PI * 2;
            const distance = Math.sqrt(rng()) * radius;
            const nx = center.x + Math.cos(angle) * distance;
            const ny = center.y + Math.sin(angle) * distance;

            // Prefer clustered organic patches via fbm
            const cluster = fbm2D(nx * 4.5, ny * 4.5, subSeed);
            if (cluster < 0.42 && rng() < 0.75) continue;

            const x = nx * W;
            const y = ny * H;
            if (effect.maxDots && items.some(dot => Math.hypot(x - dot.x, y - dot.y) < baseUnit)) continue;
            const order = clamp(1 - dCenter * 1.15, 0, 1);
            items.push({
              shape: effect.shape,
              x,
              y,
              size: baseUnit * (0.65 + rng() * 0.65),
              w: baseUnit,
              h: baseUnit,
              rot: 0,
              color,
              order
            });
          }
        }

        // ------------------------------------------------------------------
        // 6. DENSE-PATCH (Brownfield: compact irregular high-density patch)
        // ------------------------------------------------------------------
        else if (logic === 'dense-patch') {
          const anchor = focalPoint(0.4);
          const step = baseUnit * 1.15;
          const rad = (0.13 + intensity * 0.19) * minDim;
          const cx = anchor.x * W;
          const cy = anchor.y * H;

          const startX = Math.floor((cx - rad * 1.35) / step) * step;
          const endX   = cx + rad * 1.35;
          const startY = Math.floor((cy - rad * 1.35) / step) * step;
          const endY   = cy + rad * 1.35;

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;

              const nVal = fbm2D(nx * 6.5, ny * 6.5, subSeed);
              const dist = Math.hypot(x - cx, y - cy) / rad + (nVal - 0.5) * 0.72;
              // Crisp angular/industrial cutout
              if (dist > 0.88) continue;
              // Occasional internal road slit
              if (Math.abs((x - cx) * 0.7 + (y - cy) * 0.4) < baseUnit * 0.55) continue;

              const order = clamp(dist / 0.9, 0, 1);
              items.push({
                shape: effect.shape,
                x, y,
                size: baseUnit * 0.76,
                w: baseUnit * 0.76,
                h: baseUnit * 0.76,
                rot: 0,
                color,
                order
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 7. NETWORK-LINES
        // ------------------------------------------------------------------
        else if (logic === 'network-lines') {
          const numLines = Math.max(1, Math.round(1 + intensity * 4));
          for (let l = 0; l < numLines; l++) {
            const edgeA = Math.floor(rng() * 4);
            const ptA = pointOnEdge(edgeA, rng, W, H);
            const ptB = pointOnEdge((edgeA + 2) % 4, rng, W, H);
            const nodes = Math.round(5 + intensity * 9);
            const reach = 0.30 + intensity * 0.70;
            let prev = null;
            for (let i = 0; i <= nodes; i++) {
              const t = 0.5 + (i / nodes - 0.5) * reach;
              const x = ptA.x + (ptB.x - ptA.x) * t;
              const y = ptA.y + (ptB.y - ptA.y) * t;

              if (prev) {
                lines.push({
                  x1: prev.x, y1: prev.y,
                  x2: x, y2: y,
                  color,
                  strokeWidth: Math.max(1.1, baseUnit * 0.14),
                  order: t
                });
              }

              items.push({
                shape: effect.shape,
                x, y,
                size: baseUnit * 1.15,
                w: baseUnit * 1.15,
                h: baseUnit * 1.15,
                rot: 0,
                color,
                order: t
              });
              prev = { x, y };
            }
          }
        }

        else if (logic === 'branching-pylons') {
          const paths = [
            [[0.189, 0.675, false], [0.191, 0.637], [0.194, 0.593], [0.196, 0.564],
              [0.200, 0.524], [0.205, 0.487], [0.209, 0.448], [0.209, 0.410],
              [0.203, 0.377], [0.200, 0.341], [0.228, 0.319], [0.255, 0.299],
              [0.279, 0.279], [0.298, 0.264]],
            [[0.298, 0.264], [0.306, 0.268], [0.320, 0.278], [0.349, 0.301],
              [0.383, 0.331], [0.414, 0.362], [0.441, 0.394], [0.469, 0.425],
              [0.587, 0.539, false], [0.634, 0.608, false], [0.788, 0.696, false],
              [0.811, 0.727, false], [0.862, 0.846, false], [0.907, 0.900, false]]
          ];
          const scale = Math.min(W / 0.78, H / 0.69) * 1.85;
          // Mantiene visibili la dorsale sinistra e il raccordo superiore.
          const anchor = {
            x: Math.max(W / 2, (0.55 - 0.189) * scale + W * 0.045),
            y: Math.max(H / 2, (0.58 - 0.264) * scale + H * 0.045)
          };
          const nodeSize = baseUnit * 2.65;
          const strokeWidth = Math.max(1.5, baseUnit * 0.57);
          const edges = [];
          const junction = { x: (0.298 - 0.55) * scale + anchor.x,
            y: (0.264 - 0.58) * scale + anchor.y, order: 0.1 };

          function addEdge(a, b) {
            edges.push({ a, b });
            lines.push({
              x1: a.x, y1: a.y, x2: b.x, y2: b.y,
              color, strokeWidth, opacity: 1, order: Math.max(a.order, b.order)
            });
          }

          function addNode(point) {
            items.push({
              shape: effect.shape, x: point.x, y: point.y, size: nodeSize,
              w: nodeSize, h: nodeSize, rot: 0, color, order: point.order
            });
          }

          const roots = [];
          for (const [index, path] of paths.entries()) {
            const nodes = path.map(([u, v, marked = true], i) => {
              if (index === 0 ? i === path.length - 1 : i === 0) return junction;
              const point = {
                x: (u - 0.55) * scale + anchor.x,
                y: (v - 0.58) * scale + anchor.y,
                order: 0.12 + (index === 0 ? path.length - 1 - i : i) / path.length * 0.38
              };
              if (marked) {
                addNode(point);
                roots.push(point);
              }
              return point;
            });
            for (let i = 1; i < nodes.length; i++) addEdge(nodes[i - 1], nodes[i]);
          }
          addNode(junction);

          const target = Math.min(8, 1 + Math.floor(intensity * 3.5));
          const usedRoots = new Set();
          for (let attempt = 0; attempt < target * 24 && usedRoots.size < target; attempt++) {
            const root = roots[Math.floor(rng() * roots.length)];
            if (usedRoots.has(root)) continue;
            const angle = rng() * Math.PI * 2;
            const length = scale * (0.035 + rng() * 0.12);
            const tip = {
              x: root.x + Math.cos(angle) * length,
              y: root.y + Math.sin(angle) * length,
              order: 0.57 + rng() * 0.37
            };
            if (edges.some(({ a, b }) => segmentsCross(root, tip, a, b))) continue;
            if (items.some(node => Math.hypot(tip.x - node.x, tip.y - node.y) < nodeSize * 2)) continue;
            addEdge(root, tip);
            addNode(tip);
            usedRoots.add(root);
          }
        }

        else if (logic === 'settlements') {
          const count = 3 + Math.round(intensity * 3);
          const centers = getClusterCenters(rng, count, 0.16 + intensity * 0.13, focalPoint(0.12));
          const step = baseUnit * 1.60;
          const villageRadius = Math.min(minDim * (0.064 + intensity * 0.054), step * 9);
          centers.forEach((center, village) => {
            const angle = (rng() - 0.5) * 1.25;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const cells = Math.ceil(villageRadius / step * 1.55);
            const bend = (rng() - 0.5) * 1.1;
            const phase = rng() * Math.PI * 2;
            for (let row = -cells; row <= cells; row++) {
              for (let col = -cells; col <= cells; col++) {
                const u = col * step / villageRadius;
                const v = row * step / villageRadius;
                const theta = Math.atan2(v, u);
                const edge = 0.94 + Math.sin(theta * 3 + phase) * 0.24
                  + Math.cos(theta * 5 - phase) * 0.14;
                const distance = Math.hypot(u * 0.82, (v - bend * u * u) * 1.52) / edge;
                if (distance > 1 || rng() > 0.98 - distance * 0.39) continue;
                // Le fasce vuote fungono da strade tra gli isolati.
                const lx = (col + Math.sign(col) * 0.25 + (rng() - 0.5) * 0.23) * step;
                const ly = (row + (rng() - 0.5) * 0.30) * step;
                const x = center.x * W + lx * cos - ly * sin;
                const y = center.y * H + lx * sin + ly * cos;
                const houseSize = baseUnit;
                const w = houseSize * (0.64 + rng() * 0.59);
                const h = houseSize * (0.55 + rng() * 0.66);
                const house = Math.floor(rng() * HOUSE_FOOTPRINTS.length);
                const rot = angle + (rng() < 0.22 ? Math.PI / 2 : 0);
                items.push({
                  shape: effect.shape, house, x, y, w, h, size: Math.max(w, h), rot, color,
                  order: clamp((village + distance) / centers.length, 0, 1)
                });
              }
            }
          });
        }

        else if (logic === 'tension-arcs') {
          const anchor = focalPoint(0.2);
          const numArcs = Math.max(2, Math.round(2 + intensity * 6));
          for (let a = 0; a < numArcs; a++) {
            const target = focalPoint(0.75);
            const x1 = anchor.x * W, y1 = anchor.y * H;
            const reach = 0.35 + intensity * 0.65;
            const x2 = x1 + (target.x * W - x1) * reach;
            const y2 = y1 + (target.y * H - y1) * reach;
            const mx = (x1 + x2) / 2 + (rng() - 0.5) * minDim * reach * 0.25;
            const my = (y1 + y2) / 2 + (rng() - 0.5) * minDim * reach * 0.25;

            const steps = Math.round(10 + intensity * 18);
            for (let i = 0; i < steps; i++) {
              const t = i / (steps - 1);
              const inv = 1 - t;
              const x = inv * inv * x1 + 2 * inv * t * mx + t * t * x2;
              const y = inv * inv * y1 + 2 * inv * t * my + t * t * y2;

              const dx = 2 * inv * (mx - x1) + 2 * t * (x2 - mx);
              const dy = 2 * inv * (my - y1) + 2 * t * (y2 - my);
              const rot = Math.atan2(dy, dx);

              items.push({
                shape: effect.shape,
                x, y,
                size: baseUnit * 1.1,
                w: baseUnit * 1.5,
                h: baseUnit * 0.75,
                rot,
                color,
                order: t
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 9. ACCUMULATION (Bollette: outlines clustered toward a corner or zone)
        // ------------------------------------------------------------------
        else if (logic === 'accumulation') {
          const cornerIdx = Math.floor(rng() * 4);
          const target = [
            { x: 0.82, y: 0.82 },
            { x: 0.18, y: 0.82 },
            { x: 0.82, y: 0.18 },
            { x: 0.18, y: 0.18 }
          ][cornerIdx];

          const count = Math.round(20 + intensity * 110);
          let tries = 0;
          while (items.length < count && tries < count * 6) {
            tries++;
            // Power distribution pulls points tightly toward target
            const r = Math.pow(rng(), 1.8) * (0.35 + intensity * 0.35);
            const ang = rng() * Math.PI * 2;
            const nx = target.x + Math.cos(ang) * r;
            const ny = target.y + Math.sin(ang) * r;

            const distNorm = clamp(r / 0.65, 0, 1);
            const rectScale = 0.7 + (1 - distNorm) * 0.85;
            items.push({
              shape: effect.shape,
              x: nx * W,
              y: ny * H,
              size: baseUnit * rectScale,
              w: baseUnit * 0.9 * rectScale,
              h: baseUnit * 1.35 * rectScale,
              rot: (rng() > 0.75 ? Math.PI / 2 : 0),
              color,
              order: 1 - distNorm
            });
          }
        }

        // ------------------------------------------------------------------
        // 10. PLUME (a pixelated cloud dispersing downwind)
        // ------------------------------------------------------------------
        else if (logic === 'emission-scatter') {
          const cell = Math.max(4, baseUnit * 1.16);
          const side = cell * 0.74;
          const firstX = cell * (0.4 + rng() * 0.25);
          const firstY = cell * (0.4 + rng() * 0.25);
          const range = minDim * (0.055 + intensity * 0.11);
          const sources = getClusterCenters(rng, 5, 0.13 + intensity * 0.12, focalPoint(0.12)).map(center => ({
            ...center, rx: range / W * (0.75 + rng() * 0.68), ry: range / H * (0.72 + rng() * 0.77),
            weight: 0.62 + rng() * 0.38
          }));
          const left = Math.min(...sources.map(source => (source.x - source.rx * 4) * W));
          const right = Math.max(...sources.map(source => (source.x + source.rx * 4) * W));
          const top = Math.min(...sources.map(source => (source.y - source.ry * 4) * H));
          const bottom = Math.max(...sources.map(source => (source.y + source.ry * 4) * H));
          const startCol = Math.floor((left - firstX) / cell);
          const startRow = Math.floor((top - firstY) / cell);
          const occupied = new Map();

          // La probabilità cala gradualmente attorno a ogni sorgente; una trama
          // irregolare lascia vuoti anche nelle zone con più quadratini.
          for (let row = startRow; firstY + row * cell < bottom; row++) {
            for (let col = startCol; firstX + col * cell < right; col++) {
              const px = firstX + col * cell;
              const py = firstY + row * cell;
              const nx = px / W;
              const ny = py / H;
              let density = 0;
              for (const source of sources) {
                const distance = ((nx - source.x) / source.rx) ** 2 + ((ny - source.y) / source.ry) ** 2;
                density = Math.max(density, source.weight / (1 + distance ** 2.4));
              }
              const chance = hash2D(col, row, subSeed + 37);
              const weight = density ** 1.18 * (0.41 + intensity * 0.82);
              if (chance >= Math.min(0.48, weight * 1.08)) continue;
              const grain = fbm2D(nx * 26, ny * 30, subSeed);
              if (chance >= weight * (0.15 + 0.93 * grain ** 1.25)) continue;
              const item = {
                shape: 'square', x: px, y: py, size: side, w: side, h: side, color,
                order: clamp(ny * 0.72 + nx * 0.22, 0, 1)
              };
              items.push(item);
              occupied.set(`${col},${row}`, item);
              const neighbor = occupied.get(`${col - 1},${row}`) ?? occupied.get(`${col},${row - 1}`);
              if (neighbor && hash2D(col, row, subSeed + 59) < 0.48) {
                for (const square of [item, neighbor]) square.size = square.w = square.h = cell;
              }
            }
          }
        }

        else if (logic === 'plume') {
          const origin = focalPoint(0.25);
          const windAngle = -Math.PI * 0.75 + rng() * Math.PI * 1.5;
          const wx = Math.cos(windAngle);
          const wy = Math.sin(windAngle);
          const px = -wy;
          const py = wx;

          const cell = Math.max(7, baseUnit * 1.05);
          const maxLen = (0.32 + intensity * 0.48) * minDim;
          const maxSpread = (0.14 + intensity * 0.22) * minDim;

          const ox = origin.x * W;
          const oy = origin.y * H;

          const reach = maxLen + (baseUnit * 2.2 + maxSpread) * 1.35 + cell * 3;
          for (let y = Math.floor((oy - reach) / cell) * cell; y <= oy + reach; y += cell) {
            for (let x = Math.floor((ox - reach) / cell) * cell; x <= ox + reach; x += cell) {
              const nx = x / W, ny = y / H;

              const dx = x - ox;
              const dy = y - oy;
              // Project along wind axis (u) and perpendicular axis (v)
              const u = dx * wx + dy * wy;
              const v = dx * px + dy * py;

              if (u < -cell * 2.5 || u > maxLen) continue;
              const progressU = clamp((u + cell * 2.5) / (maxLen + cell * 2.5), 0, 1);

              // Gaussian plume width widens downwind
              const localWidth = baseUnit * 2.2 + Math.pow(progressU, 0.8) * maxSpread;
              const distV = Math.abs(v) / localWidth;
              if (distV > 1.35) continue;

              const turb = fbm2D(nx * 7.0, ny * 7.0, subSeed);
              const densityProb = (1 - distV * 0.85) * (1 - progressU * 0.55) * (0.45 + turb * 0.85);
              if (rng() > densityProb) continue;

              items.push({
                shape: effect.shape,
                x, y,
                size: cell * 0.86,
                w: cell * 0.86,
                h: cell * 0.86,
                rot: 0,
                color,
                order: progressU
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 11. Radial reticules for Calore and Valore immobiliare
        // ------------------------------------------------------------------
        else if (logic === 'heat-island' || logic === 'property-grid') {
          const property = logic === 'property-grid';
          const origin = focalPoint(0.10);
          const step = baseUnit * (property ? 1.08 : 1.18);
          const maxR = (0.10 + intensity * 0.43) * minDim;
          const merging = effect.mergeDots ? clamp((intensity - 0.32) / 0.68, 0, 1) : 0;
          const maxDiameterRatio = property ? 0.92 : 0.97 + merging * 0.25;
          const feathered = property || effect.shape === 'halftone';
          const radiusRatio = property ? 0.50 : HALFTONE_RADIUS_RATIO;
          const fieldAngle = property ? (rng() - 0.5) * 1.3 : 0;
          const cos = Math.cos(fieldAngle);
          const sin = Math.sin(fieldAngle);
          const parcelAt = property ? createParcelMap(subSeed, intensity) : null;
          const cx = origin.x * W;
          const cy = origin.y * H;

          const span = maxR * (feathered ? 1.25 : 1.2);
          const startX = Math.floor((cx - span) / step) * step;
          const endX = cx + span;
          const startY = Math.floor((cy - span) / step) * step;
          const endY = cy + span;
          const smooth = value => {
            const t = clamp(value, 0, 1);
            return t * t * (3 - 2 * t);
          };

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;

              const nVal = fbm2D(nx * 4.5, ny * 4.5, subSeed);
              const dx = (x - cx) / maxR;
              const dy = (y - cy) / maxR;
              const d = Math.hypot(dx, dy);
              const effD = d + (nVal - 0.5) * 0.38;
              const edge = property ? 1.085 : feathered ? 1.06 : 1;
              if (effD >= edge) continue;
              if (property) {
                const u = dx * cos - dy * sin;
                const v = (dx * sin + dy * cos) * 0.84;
                if (parcelAt(u, v) === null) continue;
              }

              const heat = clamp(1 - effD / edge, 0, 1);
              let size = step * (0.21 + smooth(heat) * 0.70);
              if (feathered) {
                const fringe = smooth(heat / (property ? 0.16 : 0.30));
                const core = smooth(heat / 0.73);
                const grain = fbm2D(nx * 7.2 + 4, ny * 7.2 + 9, subSeed + 17);
                const pocket = smooth((grain - 0.40) / 0.32);
                const dot = property ? 0.46 + core * (0.49 + (grain - 0.5) * 0.26)
                  : 0.28 + core * (0.62 + (grain - 0.5) * 0.28);
                // A maglia quadrata gli interstizi restano leggibili anche al massimo.
                const diameterRatio = Math.min(maxDiameterRatio, (dot + merging * core * pocket * 0.54) * fringe);
                size = step * diameterRatio / (2 * radiusRatio);
                if (size < 0.42) continue;
              }
              const item = { shape: effect.shape, x, y, size, w: size, h: size, rot: 0, color, order: clamp(d, 0, 1) };
              if (property) {
                const col = Math.round(x / step), row = Math.round(y / step);
                item.house = Math.floor(hash2D(col, row, subSeed + 31) * HOUSE_FOOTPRINTS.length);
                item.w *= 0.87 + hash2D(col, row, subSeed + 47) * 0.13;
                item.h *= 0.67 + hash2D(col, row, subSeed + 61) * 0.33;
                item.rot = hash2D(col, row, subSeed + 89) < 0.31 ? Math.PI / 2 : 0;
              }
              items.push(item);
            }
          }
        }

        // ------------------------------------------------------------------
        // 12. ISOPHONES (Rumore: concentric acoustic rings / vibrating wave bands)
        // ------------------------------------------------------------------
        else if (logic === 'diagonal-bands') {
          const focal = focalPoint(0.10);
          const angle = -Math.PI * 0.17;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);
          const reach = minDim * (0.145 + intensity * 0.178);
          const gap = Math.max(3, baseUnit * 1.02);
          const segment = Math.min(gap * 2.50, reach * 0.34);
          const inset = reach * 0.58;
          const cx = clamp(focal.x * W, inset, W - inset);
          const cy = clamp(focal.y * H, inset, H - inset);
          const direction = rng() * Math.PI * 2;
          const along = Math.cos(direction);
          const across = Math.sin(direction);
          const strength2 = 0.69 + rng() * 0.16;
          const limitU = reach * (1.06 + Math.abs(along) * 0.57);
          const limitV = reach * (0.76 + Math.abs(across) * 0.57);

          // I due nuclei hanno contorni asimmetrici e una fascia debole condivisa.
          const levelAt = (u, v) => {
            const localU = u / reach;
            const localV = v / reach;
            const a = localU * along + localV * across;
            const b = -localU * across + localV * along;
            const primary = Math.max(0, 1 - ((a + 0.24) / 0.94) ** 2 - ((b + a * 0.18) / 0.59) ** 2);
            const secondary = Math.max(0, 1 - ((a - 0.58) / 0.63) ** 2 - ((b - 0.07 - a * 0.29) / 0.45) ** 2) * strength2;
            const base = primary ** 1.42;
            const combined = base + secondary ** 1.48 * (1 - base);
            const grain = fbm2D(u / minDim * 14 + 8, v / minDim * 16 + 3, subSeed);
            return clamp(combined * (0.91 + grain * 0.28), 0, 1);
          };
          const cutoff = 0.035;

          const rows = Math.floor(limitV / gap);
          for (let row = -rows; row <= rows; row++) {
            const v = row * gap;
            const rowShift = (hash2D(row, 0, subSeed) - 0.5) * segment;
            const first = Math.floor((-limitU - rowShift) / segment) * segment + rowShift;
            for (let u = first; u < limitU; u += segment) {
              const next = Math.min(u + segment, limitU);
              const mid = (u + next) / 2;
              const level = levelAt(mid, v);
              if (level <= cutoff) continue;
              const left = levelAt(u, v);
              const right = levelAt(next, v);
              const start = left < cutoff ? u + (mid - u) * (cutoff - left) / (level - left) : u;
              const end = right < cutoff ? next - (next - mid) * (cutoff - right) / (level - right) : next;
              if (end - start < 0.6) continue;
              const seam = Math.min((end - start) * 0.12, gap * 0.025);
              const x1 = cx + (start + seam) * dx - v * dy;
              const y1 = cy + (start + seam) * dy + v * dx;
              const x2 = cx + (end - seam) * dx - v * dy;
              const y2 = cy + (end - seam) * dy + v * dx;
              const width = gap * (0.055 + level * 0.63);
              lines.push({
                x1, y1, x2, y2, color, strokeWidth: width, opacity: 1, order: 1 - level
              });
            }
          }
        }

        else if (logic === 'isophones') {
          const origin = focalPoint(0.3);

          const cx = origin.x * W;
          const cy = origin.y * H;
          const maxR = (0.20 + intensity * 0.36) * minDim;
          const stepY = Math.max(6, baseUnit * 0.75);
          const stepX = Math.max(18, baseUnit * 2.4);

          const startY = Math.floor((cy - maxR * 1.18) / stepY) * stepY;
          const endY = cy + maxR * 1.18;
          const startX = Math.floor((cx - maxR * 1.18) / stepX) * stepX;
          const endX = cx + maxR * 1.18;

          for (let y = startY; y <= endY; y += stepY) {
            for (let x = startX; x <= endX; x += stepX) {
              const nx = x / W, ny = y / H;

              const d = Math.hypot(x - cx, y - cy) / maxR;
              const nVal = fbm2D(nx * 5.0, ny * 5.0, subSeed);
              if (d + (nVal - 0.5) * 0.35 > 1.0) continue;

              // Create ring bands (isophone gaps)
              const ringWave = Math.sin(d * Math.PI * (4 + intensity * 5));
              if (ringWave < -0.25) continue;

              items.push({
                shape: effect.shape,
                x, y,
                size: baseUnit,
                w: stepX * (0.72 + (1 - d) * 0.22),
                h: Math.max(1.6, baseUnit * 0.22),
                rot: 0,
                color,
                order: clamp(d, 0, 1)
              });
            }
          }
        }

        if (effect.maxDots) {
          const count = Math.min(items.length, Math.round(effect.maxDots * strength));
          const size = baseUnit * (effect.shape === 'job-circle' ? 1.23 : 1);
          const ranked = items.map((item, index) => ({
            item, rank: Math.floor(index / effect.maxDots) + hash2D(index, 0, subSeed)
          }));
          ranked.sort((a, b) => a.rank - b.rank);
          const dots = ranked.slice(0, count).map(({ item }) => ({ ...item, size }));
          return { items: dots, lines };
        }

        return { items, lines };
      }

      function cubicBezier(p0, p1, p2, p3, t) {
        const u = 1 - t;
        const tt = t * t, uu = u * u;
        const uuu = uu * u, ttt = tt * t;
        return {
          x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
          y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
        };
      }

      function cubicBezierTangent(p0, p1, p2, p3, t) {
        const u = 1 - t;
        return {
          x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
          y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y)
        };
      }

      function segmentsCross(a, b, c, d) {
        if (a === c || a === d) {
          const other = a === c ? d : c;
          const angle = Math.atan2(b.y - a.y, b.x - a.x);
          const otherAngle = Math.atan2(other.y - a.y, other.x - a.x);
          return Math.cos(angle - otherAngle) > 0.91;
        }
        const turn = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
        return Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x)) <= Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) &&
          Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y)) <= Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) &&
          turn(a, b, c) * turn(a, b, d) <= 0 && turn(c, d, a) * turn(c, d, b) <= 0;
      }

      function pointOnEdge(edge, rng, W, H) {
        const p = 0.08 + rng() * 0.84;
        if (edge === 0) return { x: p * W, y: 0.03 * H };
        if (edge === 1) return { x: 0.97 * W, y: p * H };
        if (edge === 2) return { x: p * W, y: 0.97 * H };
        return { x: 0.03 * W, y: p * H };
      }

      /* ======================================================================
         6. REBUILD ALL GEOMETRY LAYERS
         ====================================================================== */

      function getPointBounds(points) {
        return {
          left: Math.min(...points.map(point => point.x)),
          right: Math.max(...points.map(point => point.x)),
          top: Math.min(...points.map(point => point.y)),
          bottom: Math.max(...points.map(point => point.y))
        };
      }

      function ribbonIntersectsStrip(edges, x, y, width, height) {
        const midX = x + width / 2;
        const midY = y + height / 2;
        let inside = false;
        for (const [a, b] of edges) {
          if ((a.y > midY) !== (b.y > midY) &&
            a.x + (b.x - a.x) * (midY - a.y) / (b.y - a.y) > midX) inside = !inside;
          if (Math.max(a.x, b.x) < x || Math.min(a.x, b.x) > x + width ||
            Math.max(a.y, b.y) < y || Math.min(a.y, b.y) > y + height) continue;
          if (a.x === b.x) return true;
          const t1 = (x - a.x) / (b.x - a.x);
          const t2 = (x + width - a.x) / (b.x - a.x);
          const y1 = a.y + (b.y - a.y) * Math.max(0, Math.min(t1, t2));
          const y2 = a.y + (b.y - a.y) * Math.min(1, Math.max(t1, t2));
          if (Math.max(y1, y2) >= y && Math.min(y1, y2) <= y + height) return true;
        }
        return inside;
      }

      function createAquiferRibbon(points, bounds, pitch, contamination, seed) {
        const f = value => Number(value.toFixed(2));
        const outline = points.map((point, i) => `${i ? 'L' : 'M'}${f(point.x)} ${f(point.y)}`).join('') + 'Z';
        const block = pitch * 5.1;
        const strips = [];
        const edges = points.map((point, i) => [point, points[(i + 1) % points.length]]);
        const height = pitch * 0.72;
        for (let row = Math.floor(bounds.top / pitch); row * pitch < bounds.bottom; row++) {
          const shift = ((row % 2 + 2) % 2) * block * 0.5;
          const y = row * pitch;
          const rowEdges = edges.filter(([a, b]) => Math.max(a.y, b.y) >= y && Math.min(a.y, b.y) <= y + height);
          if (!rowEdges.length) continue;
          const left = Math.min(...rowEdges.map(([a, b]) => Math.min(a.x, b.x)));
          const right = Math.max(...rowEdges.map(([a, b]) => Math.max(a.x, b.x)));
          for (let col = Math.floor((left - shift) / block); col * block + shift < right; col++) {
            const x = col * block + shift;
            const width = block * 0.88;
            if (!ribbonIntersectsStrip(rowEdges, x, y, width, height)) continue;
            strips.push({
              rank: hash2D(col, row, seed + 23), x, y, width, height,
              d: `M${f(x)} ${f(y)}H${f(x + width)}V${f(y + height)}H${f(x)}Z`
            });
          }
        }
        // Sequenza di comparsa: i mattoncini entrano uno alla volta lungo il percorso.
        const horizontal = bounds.right - bounds.left >= bounds.bottom - bounds.top;
        const start = horizontal ? bounds.left : bounds.top;
        const span = Math.max(1, horizontal ? bounds.right - bounds.left : bounds.bottom - bounds.top);
        for (const strip of strips) {
          const along = horizontal ? strip.x + strip.width / 2 : strip.y + strip.height / 2;
          strip.seq = clamp((along - start) / span * 0.88 + hash2D(Math.round(strip.x * 10), Math.round(strip.y * 10), seed + 31) * 0.12, 0, 1);
        }
        strips.sort((a, b) => a.rank - b.rank);
        const cutoff = Math.round(strips.length * contamination / 100);
        const bands = [
          createAquiferBand('#774400', strips.slice(0, cutoff)),
          createAquiferBand('#2CC6C6', strips.slice(cutoff))
        ].filter(band => band.d);
        return { outline, clip: new Path2D(outline), bands };
      }

      function createAquiferBand(color, strips) {
        const d = strips.map(strip => strip.d).join('');
        return { color, strips, d, path: new Path2D(d) };
      }

      function positionLayer(source, position, W, H) {
        const dx = (position?.x ?? 0) * W;
        const dy = (position?.y ?? 0) * H;
        return {
          items: source.items.map(item => ({ ...item, x: item.x + dx, y: item.y + dy })),
          lines: source.lines.map(line => ({
            ...line, x1: line.x1 + dx, y1: line.y1 + dy, x2: line.x2 + dx, y2: line.y2 + dy
          }))
        };
      }

      function usesHouseLayout(effect) {
        return effect.logic === 'settlements';
      }

      const generatedLayers = new Map();

      function rebuildGeometry(category) {
        const { width: W, height: H } = FORMATS[state.format];
        if (!category) generatedLayers.clear();

        const renderOrderIds = [
          'calore', 'consumo-suolo', 'falda', 'rumore',
          'emissioni', 'valore-immobiliare', 'posti-di-lavoro',
          'flora-fauna', 'pressione-rete', 'bollette', 'tralicci'
        ];

        const houses = state.effects.find(effect => effect.id === HOUSE_LAYER_ID);
        let houseLayout;
        renderOrderIds.forEach((id, idx) => {
          const eff = state.effects.find(e => e.id === id);
          if (!eff?.active || (category && eff.category !== category)) return;
          let layer;
          if (usesHouseLayout(eff)) {
            if (!houseLayout) {
              houseLayout = generateEffectLayer({ ...houses, active: true }, W, H, renderOrderIds.indexOf(HOUSE_LAYER_ID));
            }
            layer = { items: houseLayout.items.map(item => ({ ...item, shape: eff.shape, color: eff.color })), lines: [] };
          } else {
            layer = generateEffectLayer(eff, W, H, idx);
          }
          const glitchOrder = createRNG(hash2D(idx, 738, state.variation) * 0x100000000);
          for (const item of layer.items) item.glitchDelay = glitchOrder();
          for (const line of layer.lines) line.glitchDelay = glitchOrder();
          generatedLayers.set(id, layer);
        });
        if (!category) updateMoveControls();
        renderPositionedLayers();
      }

      function renderPositionedLayers() {
        const { width: W, height: H } = FORMATS[state.format];
        state.layers.clear();
        let total = 0;
        for (const [id, source] of generatedLayers) {
          const layer = positionLayer(source, state.move.positions.get(id), W, H);
          state.layers.set(id, layer);
          total += layer.items.length + layer.lines.length;
        }

        document.getElementById('particleCountBadge').textContent = `${total} geometrie`;
        renderCanvas(state.anim.progress);
      }

      /* ======================================================================
         7. ANIMATION EASING & VISIBILITY EVALUATION
         ====================================================================== */

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      // true = gli elementi compaiono di colpo; false = crescita morbida (versione precedente).
      const DIRECT_APPEAR = true;

      function computeItemAnim(item, globalProgress, W, H) {
        if (globalProgress >= 0.999) return { alpha: 1, scale: 1, dx: 0, dy: 0 };
        if (globalProgress <= 0.001) return { alpha: 0, scale: 0, dx: 0, dy: 0 };

        const style = state.anim.style;
        let delay = item.order;

        if (style === 'plotter-glitch') {
          delay = item.glitchDelay;
        } else if (style === 'wave') {
          delay = clamp((item.x / W) * 0.65 + (item.y / H) * 0.35, 0, 1);
        } else if (style === 'pop-scale') {
          delay = item.order * 0.7;
        }

        const windowSize = 0.28;
        const localT = style === 'plotter-glitch'
          ? plotterGlitchProgress(globalProgress, delay)
          : clamp((globalProgress * (1 + windowSize) - delay) / windowSize, 0, 1);

        if (localT <= 0) return { alpha: 0, scale: 0, dx: 0, dy: 0 };

        // Comparsa diretta: ogni elemento appare di colpo, intero, senza easing.
        if (DIRECT_APPEAR) return { alpha: 1, scale: 1, dx: 0, dy: 0 };

        if (style === 'plotter-glitch') {
          // Comparsa a scala pulita, senza rimbalzo: ordine casuale e
          // durata diversa per ogni elemento.
          return {
            alpha: Math.min(1, localT * 3),
            scale: easeOutCubic(localT),
            dx: 0, dy: 0
          };
        }

        if (style === 'pop-scale') {
          return {
            alpha: Math.min(1, localT * 1.8),
            scale: easeOutCubic(localT),
            dx: 0, dy: 0
          };
        }

        if (style === 'wave') {
          const e = easeOutCubic(localT);
          return {
            alpha: e,
            scale: 0.4 + 0.6 * e,
            dx: (1 - e) * -12,
            dy: 0
          };
        }

        // Default: 'param-logic'
        const e = easeOutCubic(localT);
        return {
          alpha: e,
          scale: 0.25 + 0.75 * e,
          dx: 0,
          dy: 0
        };
      }

      /* ======================================================================
         8. CANVAS RENDERER (60FPS)
         ====================================================================== */

      const canvas = document.getElementById('identityCanvas');

      // La falda si anima mattoncino per mattoncino invece che come un blocco unico.
      function drawRibbonCanvas(ctx, item, progress, W, H) {
        const ribbon = item.ribbon;
        ctx.save();
        ctx.translate(item.x, item.y);
        if (item.rot) ctx.rotate(item.rot);
        ctx.clip(ribbon.clip);
        if (progress >= 0.999) {
          for (const band of ribbon.bands) {
            ctx.fillStyle = band.color;
            ctx.fill(band.path);
          }
          ctx.restore();
          return;
        }
        for (const band of ribbon.bands) {
          ctx.fillStyle = band.color;
          for (const strip of band.strips) {
            const cx = strip.x + strip.width / 2;
            const cy = strip.y + strip.height / 2;
            const anim = computeItemAnim({
              x: item.x + cx, y: item.y + cy,
              order: clamp(item.order * 0.35 + strip.seq * 0.65, 0, 1),
              glitchDelay: strip.rank
            }, progress, W, H);
            if (anim.alpha <= 0.01 || anim.scale <= 0.01) continue;
            ctx.globalAlpha = anim.alpha;
            const w = strip.width * anim.scale;
            const h = strip.height * anim.scale;
            ctx.fillRect(cx - w / 2 + anim.dx, cy - h / 2 + anim.dy, w, h);
          }
        }
        ctx.restore();
      }

      function drawShapeCanvas(ctx, item, anim) {
        if (anim.alpha <= 0.01 || anim.scale <= 0.01) return;

        ctx.save();
        ctx.globalAlpha = anim.alpha;
        ctx.translate(item.x + anim.dx, item.y + anim.dy);
        if (item.rot) ctx.rotate(item.rot);
        ctx.scale(anim.scale, anim.scale);

        const s = item.size;
        ctx.fillStyle = item.color;
        ctx.strokeStyle = item.color;

        if (item.ribbon) {
          for (const band of item.ribbon.bands) {
            ctx.fillStyle = band.color;
            ctx.fill(band.path);
          }
          ctx.restore();
          return;
        }

        const motif = getVectorMotif(item);
        if (motif) {
          ctx.scale(item.w, item.h);
          for (const stroke of motif) {
            if (item.shape === 'house-outline') {
              ctx.lineWidth = 0.12;
              ctx.stroke(stroke.path);
            } else {
              ctx.fillStyle = stroke.fill || item.color;
              ctx.fill(stroke.path);
            }
          }
          ctx.restore();
          return;
        }

        switch (item.shape) {
          case 'bar': {
            ctx.fillRect(-item.w / 2, -item.h / 2, item.w, item.h);
            break;
          }
          case 'capsule': {
            const w = item.w, h = item.h, r = h / 2;
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, r);
            ctx.fill();
            break;
          }
          case 'triangle': {
            const r = s * 0.62;
            ctx.beginPath();
            ctx.moveTo(0, -r);
            ctx.lineTo(r * 0.86, r * 0.7);
            ctx.lineTo(-r * 0.86, r * 0.7);
            ctx.closePath();
            ctx.fill();
            break;
          }
          case 'cross-dot': {
            const arm = s * 0.46;
            const [left, right, top, bottom] = item.crossArms || [arm, arm, arm, arm];
            ctx.lineWidth = Math.max(1.4, s * 0.32);
            ctx.beginPath();
            ctx.moveTo(-left, 0); ctx.lineTo(right, 0);
            ctx.moveTo(0, -top); ctx.lineTo(0, bottom);
            ctx.stroke();
            break;
          }
          case 'job-circle': {
            ctx.lineWidth = s * 0.204;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.398, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
          }
          case 'hollow-circle': {
            ctx.lineWidth = Math.max(1.6, s * 0.22);
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2);
            ctx.stroke();
            break;
          }
          case 'plus': {
            const arm = s * 0.56;
            ctx.lineWidth = Math.max(2.2, s * 0.28);
            ctx.beginPath();
            ctx.moveTo(-arm, 0); ctx.lineTo(arm, 0);
            ctx.moveTo(0, -arm); ctx.lineTo(0, arm);
            ctx.stroke();
            break;
          }
          case 'zigzag': {
            const w = item.w * 0.5, h = item.h * 0.45;
            ctx.lineWidth = Math.max(1.8, s * 0.2);
            ctx.lineJoin = 'miter';
            ctx.beginPath();
            ctx.moveTo(-w, h);
            ctx.lineTo(-w * 0.33, -h);
            ctx.lineTo(w * 0.33, h);
            ctx.lineTo(w, -h);
            ctx.stroke();
            break;
          }
          case 'hollow-rect': {
            ctx.lineWidth = Math.max(1.6, s * 0.18);
            ctx.strokeRect(-item.w / 2, -item.h / 2, item.w, item.h);
            break;
          }
          case 'square': {
            ctx.fillRect(-s / 2, -s / 2, s, s);
            break;
          }
          case 'halftone': {
            ctx.beginPath();
            ctx.arc(0, 0, s * HALFTONE_RADIUS_RATIO, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'wave': {
            ctx.lineWidth = Math.max(1.6, item.h);
            ctx.beginPath();
            const hw = item.w / 2;
            ctx.moveTo(-hw, 0);
            ctx.quadraticCurveTo(-hw * 0.5, -item.h * 1.1, 0, 0);
            ctx.quadraticCurveTo(hw * 0.5, item.h * 1.1, hw, 0);
            ctx.stroke();
            break;
          }
        }
        ctx.restore();
      }

      function getGridMetrics(W, H) {
        const { columns, rows, gap, margin } = state.grid;
        const unit = Math.min(W, H) / 100;
        const inset = margin * unit;
        const gutter = gap * unit;
        return {
          inset, gutter,
          cellWidth: (W - 2 * inset - (columns - 1) * gutter) / columns,
          cellHeight: (H - 2 * inset - (rows - 1) * gutter) / rows
        };
      }

      function updateGridPreview() {
        const { width: W, height: H } = FORMATS[state.format];
        const { inset, gutter } = getGridMetrics(W, H);
        const { visible, columns, rows } = state.grid;
        const grid = document.getElementById('layoutGrid');
        grid.hidden = !visible;
        if (!visible) return;
        grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
        grid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
        grid.style.columnGap = `${gutter / (W - 2 * inset) * 100}%`;
        grid.style.rowGap = `${gutter / (H - 2 * inset) * 100}%`;
        grid.style.inset = `${inset / H * 100}% ${inset / W * 100}%`;
        if (grid.childElementCount !== rows * columns) {
          grid.replaceChildren(...Array.from({ length: rows * columns }, () => document.createElement('span')));
        }
      }

      function textFont(block) {
        return `${block.size}px "Eiffel-${block.font}", sans-serif`;
      }

      function textOrigin(block, grid, lineCount, column, row) {
        const { inset, gutter, cellWidth, cellHeight } = grid;
        const height = block.size + (lineCount - 1) * block.size * 1.1;
        const offset = block.vertical === 'bottom' ? Math.max(0, cellHeight - height) : 0;
        return {
          x: inset + (column - 1) * (cellWidth + gutter),
          y: inset + (row - 1) * (cellHeight + gutter) + offset + block.size * 0.84
        };
      }

      function getTypographyArtwork(W, H) {
        const { enabled, position, blocks, color } = state.typography;
        const grid = getGridMetrics(W, H);
        const ratio = CLOUD_EDITION_LOGO.width / CLOUD_EDITION_LOGO.height;
        const width = Math.min(W * (state.format === 'a4' ? 0.52 : 0.47), H * 0.48 * ratio);
        const height = width / ratio;
        const x = position === 'center' ? (W - width) / 2 : grid.inset;
        const y = position === 'center' ? (H - height) / 2
          : position === 'top-left' ? grid.inset : H - grid.inset - height - Math.min(W, H) * 0.045;
        const logo = enabled ? { x, y, width, height, scale: width / CLOUD_EDITION_LOGO.width } : null;

        const lines = blocks.flatMap(block => {
          if (!block.text.trim()) return [];
          const textLines = block.text.split('\n');
          const col = Math.min(block.column, state.grid.columns);
          const row = Math.min(block.row, state.grid.rows);
          const origin = textOrigin(block, grid, textLines.length, col, row);
          return textLines.map((text, i) => ({
            text, x: origin.x, y: origin.y + i * block.size * 1.1,
            font: block.font, size: block.size, color
          }));
        });
        return { logo, lines };
      }

      function measureTextBlock(ctx, block, lines) {
        ctx.save();
        ctx.font = textFont(block);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        const bounds = { left: 0, right: 0, top: 0, bottom: 0 };
        lines.forEach((line, index) => {
          if (!line.trim()) return;
          const metrics = ctx.measureText(line);
          const baseline = index * block.size * 1.1;
          bounds.left = Math.min(bounds.left, -metrics.actualBoundingBoxLeft);
          bounds.right = Math.max(bounds.right, metrics.width, metrics.actualBoundingBoxRight);
          bounds.top = Math.min(bounds.top, baseline - metrics.actualBoundingBoxAscent);
          bounds.bottom = Math.max(bounds.bottom, baseline + metrics.actualBoundingBoxDescent);
        });
        ctx.restore();
        return bounds;
      }

      function placeTextBounds(bounds, origin) {
        return {
          left: bounds.left + origin.x, right: bounds.right + origin.x,
          top: bounds.top + origin.y, bottom: bounds.bottom + origin.y
        };
      }

      function intersects(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }

      function randomizeTextPositions() {
        const { width: W, height: H } = FORMATS[state.format];
        const grid = getGridMetrics(W, H);
        const { columns, rows } = state.grid;
        const { logo } = getTypographyArtwork(W, H);
        const ctx = canvas.getContext('2d');
        const occupied = logo ? [{
          left: logo.x, right: logo.x + logo.width, top: logo.y, bottom: logo.y + logo.height
        }] : [];

        const placements = state.typography.blocks.filter(block => block.text.trim()).map(block => {
          const lines = block.text.split('\n');
          const bounds = measureTextBlock(ctx, block, lines);
          const candidates = [];
          const currentRow = Math.min(block.row, rows);
          const currentCol = Math.min(block.column, columns);
          for (let row = 1; row <= rows; row++) {
            for (let column = 1; column <= columns; column++) {
              const box = placeTextBounds(bounds, textOrigin(block, grid, lines.length, column, row));
              if (box.left < 0 || box.top < 0 || box.right > W || box.bottom > H) continue;
              if (occupied.some(other => intersects(box, other))) continue;
              candidates.push({ row, column, box, unchanged: row === currentRow && column === currentCol, order: Math.random() });
            }
          }
          candidates.sort((a, b) => Number(a.unchanged) - Number(b.unchanged) || a.order - b.order);
          return { block, candidates };
        }).sort((a, b) => a.candidates.length - b.candidates.length);

        const chosen = [];
        let remaining = 12000;
        function assign(index, allowSameCell) {
          if (index === placements.length) return true;
          for (const candidate of placements[index].candidates) {
            if (--remaining < 0) return false;
            if ((!allowSameCell && candidate.unchanged) || occupied.some(box => intersects(candidate.box, box))) continue;
            occupied.push(candidate.box);
            chosen[index] = candidate;
            if (assign(index + 1, allowSameCell)) return true;
            occupied.pop();
          }
          return false;
        }

        if (!assign(0, false)) {
          remaining = 12000;
          if (!assign(0, true)) return false;
        }
        placements.forEach(({ block }, index) => {
          block.row = chosen[index].row;
          block.column = chosen[index].column;
        });
        return true;
      }

      function drawTypographyCanvas(ctx, artwork, progress) {
        const alpha = clamp(progress * 1.4, 0, 1);
        if (alpha <= 0.01 || (!artwork.logo && !artwork.lines.length)) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textBaseline = 'alphabetic';

        if (artwork.logo) {
          const { x, y, scale } = artwork.logo;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          ctx.fillStyle = state.typography.color;
          for (const path of LOGO_PATHS) ctx.fill(path);
          ctx.restore();
        }
        for (const line of artwork.lines) {
          ctx.textAlign = 'left';
          ctx.font = textFont(line);
          ctx.fillStyle = line.color;
          ctx.fillText(line.text, line.x, line.y);
        }
        ctx.restore();
      }

      function renderCanvas(progress, targetCanvas = canvas) {
        const { width: W, height: H } = FORMATS[state.format];
        if (targetCanvas.width !== W || targetCanvas.height !== H) {
          targetCanvas.width = W;
          targetCanvas.height = H;
        }

        const ctx = targetCanvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);

        const bgInfo = STUDIO_BACKGROUNDS[state.background];
        if (bgInfo.hex) {
          ctx.fillStyle = bgInfo.hex;
          ctx.fillRect(0, 0, W, H);
        }

        const artwork = getTypographyArtwork(W, H);
        // Draw all active layers
        state.layers.forEach((layer) => {
          // 1. Connector lines (e.g. Tralicci vectors)
          for (let i = 0; i < layer.lines.length; i++) {
            const ln = layer.lines[i];
            const mid = {
              x: (ln.x1 + ln.x2) / 2, y: (ln.y1 + ln.y2) / 2,
              order: ln.order, glitchDelay: ln.glitchDelay
            };
            const anim = computeItemAnim(mid, progress, W, H);
            if (anim.alpha <= 0.01) continue;

            ctx.save();
            ctx.globalAlpha = anim.alpha * (ln.opacity ?? 0.85);
            ctx.strokeStyle = ln.color;
            ctx.lineWidth = ln.strokeWidth;
            ctx.beginPath();
            ctx.moveTo(ln.x1, ln.y1);
            const ex = ln.x1 + (ln.x2 - ln.x1) * Math.min(1, anim.scale);
            const ey = ln.y1 + (ln.y2 - ln.y1) * Math.min(1, anim.scale);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.restore();
          }

          // 2. Micro-geometry items
          for (let i = 0; i < layer.items.length; i++) {
            const item = layer.items[i];
            if (item.ribbon) {
              drawRibbonCanvas(ctx, item, progress, W, H);
              continue;
            }
            const anim = computeItemAnim(item, progress, W, H);
            drawShapeCanvas(ctx, item, anim);
          }
        });

        // 3. Optional Typography Overlay
        drawTypographyCanvas(ctx, artwork, progress);
      }

      /* ======================================================================
         9. MOTION LOOP (60FPS RAF)
         ====================================================================== */

      function animTick(now) {
        if (!state.anim.lastTime) state.anim.lastTime = now;
        const dt = Math.min(0.05, (now - state.anim.lastTime) / 1000);
        state.anim.lastTime = now;

        const speed = state.anim.speed;
        const inDur = 1.8 / speed;
        const outDur = 1.5 / speed;
        const holdDur = 1.2 / speed;
        const pauseDur = 0.45 / speed;

        let needsRender = false;

        if (state.anim.mode === 'in') {
          state.anim.progress = Math.min(1, state.anim.progress + dt / inDur);
          needsRender = true;
          if (state.anim.progress >= 1) {
            state.anim.mode = 'static';
            updateAnimStatusUI('COMPLETO');
          }
        } else if (state.anim.mode === 'out') {
          state.anim.progress = Math.max(0, state.anim.progress - dt / outDur);
          needsRender = true;
          if (state.anim.progress <= 0) {
            state.anim.mode = 'static';
            updateAnimStatusUI('USCITO');
          }
        } else if (state.anim.mode === 'loop') {
          if (state.anim.phase === 'in') {
            state.anim.progress = Math.min(1, state.anim.progress + dt / inDur);
            needsRender = true;
            if (state.anim.progress >= 1) {
              state.anim.phase = 'hold';
              state.anim.phaseTimer = 0;
              updateAnimStatusUI('SOSTA');
            }
          } else if (state.anim.phase === 'hold') {
            state.anim.phaseTimer += dt;
            if (state.anim.phaseTimer >= holdDur) {
              state.anim.phase = 'out';
              updateAnimStatusUI('USCITA');
            }
          } else if (state.anim.phase === 'out') {
            state.anim.progress = Math.max(0, state.anim.progress - dt / outDur);
            needsRender = true;
            if (state.anim.progress <= 0) {
              if (state.anim.isRecording) {
                finishWebMRecording();
              } else {
                state.anim.phase = 'pause';
                state.anim.phaseTimer = 0;
                updateAnimStatusUI('PAUSA');
              }
            }
          } else if (state.anim.phase === 'pause') {
            state.anim.phaseTimer += dt;
            if (state.anim.phaseTimer >= pauseDur) {
              state.anim.phase = 'in';
              updateAnimStatusUI('INGRESSO');
            }
          }
        }

        if (needsRender) {
          renderCanvas(state.anim.progress);
          syncTimelineUI();
        }

        requestAnimationFrame(animTick);
      }

      function syncTimelineUI() {
        const scrubber = document.getElementById('timelineScrubber');
        const pct = document.getElementById('timelinePercent');
        scrubber.value = state.anim.progress.toFixed(3);
        pct.textContent = `${Math.round(state.anim.progress * 100)}%`;
      }

      function updateAnimStatusUI(label) {
        document.getElementById('animStatusLabel').textContent = label;
      }

      /* ======================================================================
         10. EXPORT ENGINE: LAYERED SVG, HIGH-RES PNG, WEBM VIDEO
         ====================================================================== */

      function buildSVGString() {
        const { width: W, height: H } = FORMATS[state.format];
        const bgInfo = STUDIO_BACKGROUNDS[state.background];
        const r = n => Number(n.toFixed(2));
        const artwork = getTypographyArtwork(W, H);

        let parts = [];
        parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
        parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="hidden">`);

        if (bgInfo.hex) {
          parts.push(`  <g id="background"><rect width="${W}" height="${H}" fill="${bgInfo.hex}"/></g>`);
        }

        state.layers.forEach((layer, effectId) => {
          const eff = state.effects.find(e => e.id === effectId);
          if (layer.items.length === 0 && layer.lines.length === 0) return;
          parts.push(`  <g id="${effectId}" data-name="${eff.name}">`);

          // Connector lines
          for (const ln of layer.lines) {
            parts.push(`    <line x1="${r(ln.x1)}" y1="${r(ln.y1)}" x2="${r(ln.x2)}" y2="${r(ln.y2)}" stroke="${ln.color}" stroke-width="${r(ln.strokeWidth)}" stroke-opacity="${ln.opacity ?? 0.85}"/>`);
          }

          // Micro-geometries
          for (const [itemIndex, item] of layer.items.entries()) {
            const s = item.size;
            const rotDeg = item.rot ? r(item.rot * 180 / Math.PI) : 0;
            const transform = `translate(${r(item.x)},${r(item.y)})${rotDeg ? ` rotate(${rotDeg})` : ''}`;
            const tf = ` transform="${transform}"`;
            if (item.ribbon) {
              const ribbon = item.ribbon;
              const clipId = `${effectId}-ribbon-${itemIndex}`;
              parts.push(`    <defs><clipPath id="${clipId}"><path d="${ribbon.outline}"/></clipPath></defs>`);
              parts.push(`    <g${tf} clip-path="url(#${clipId})">`);
              for (const band of ribbon.bands) parts.push(`      <path d="${band.d}" fill="${band.color}"/>`);
              parts.push('    </g>');
              continue;
            }
            const motif = getVectorMotif(item);
            if (motif) {
              const scaled = `${transform} scale(${r(item.w)},${r(item.h)})`;
              for (const stroke of motif) {
                const paint = item.shape === 'house-outline'
                  ? `fill="none" stroke="${item.color}" stroke-width="0.12"`
                  : `fill="${stroke.fill || item.color}"`;
                parts.push(`    <path transform="${scaled}" d="${stroke.d}" ${paint}/>`);
              }
              continue;
            }

            switch (item.shape) {
              case 'bar':
                parts.push(`    <rect${tf} x="${r(-item.w/2)}" y="${r(-item.h/2)}" width="${r(item.w)}" height="${r(item.h)}" fill="${item.color}"/>`);
                break;
              case 'capsule':
                parts.push(`    <rect${tf} x="${r(-item.w/2)}" y="${r(-item.h/2)}" width="${r(item.w)}" height="${r(item.h)}" rx="${r(item.h/2)}" fill="${item.color}"/>`);
                break;
              case 'triangle': {
                const tr = s * 0.62;
                const pts = `0,${r(-tr)} ${r(tr*0.86)},${r(tr*0.7)} ${r(-tr*0.86)},${r(tr*0.7)}`;
                parts.push(`    <polygon${tf} points="${pts}" fill="${item.color}"/>`);
                break;
              }
              case 'cross-dot': {
                const arm = s * 0.46;
                const [left, right, top, bottom] = item.crossArms || [arm, arm, arm, arm];
                const sw = r(Math.max(1.4, s * 0.32));
                parts.push(`    <path${tf} d="M${r(-left)},0 H${r(right)} M0,${r(-top)} V${r(bottom)}" stroke="${item.color}" stroke-width="${sw}" fill="none"/>`);
                break;
              }
              case 'job-circle':
                parts.push(`    <circle cx="${r(item.x)}" cy="${r(item.y)}" r="${r(s * 0.398)}" fill="#FFFFFF" stroke="${item.color}" stroke-width="${r(s * 0.204)}"/>`);
                break;
              case 'hollow-circle': {
                const sw = r(Math.max(1.6, s * 0.22));
                parts.push(`    <circle cx="${r(item.x)}" cy="${r(item.y)}" r="${r(s*0.45)}" fill="none" stroke="${item.color}" stroke-width="${sw}"/>`);
                break;
              }
              case 'plus': {
                const arm = r(s * 0.56);
                const sw = r(Math.max(2.2, s * 0.28));
                parts.push(`    <path${tf} d="M${-arm},0 H${arm} M0,${-arm} V${arm}" stroke="${item.color}" stroke-width="${sw}" fill="none"/>`);
                break;
              }
              case 'zigzag': {
                const w = item.w * 0.5, h = item.h * 0.45;
                const sw = r(Math.max(1.8, s * 0.2));
                const pts = `${r(-w)},${r(h)} ${r(-w*0.33)},${r(-h)} ${r(w*0.33)},${r(h)} ${r(w)},${r(-h)}`;
                parts.push(`    <polyline${tf} points="${pts}" fill="none" stroke="${item.color}" stroke-width="${sw}"/>`);
                break;
              }
              case 'hollow-rect': {
                const sw = r(Math.max(1.6, s * 0.18));
                parts.push(`    <rect${tf} x="${r(-item.w/2)}" y="${r(-item.h/2)}" width="${r(item.w)}" height="${r(item.h)}" fill="none" stroke="${item.color}" stroke-width="${sw}"/>`);
                break;
              }
              case 'square':
                parts.push(`    <rect x="${r(item.x - s/2)}" y="${r(item.y - s/2)}" width="${r(s)}" height="${r(s)}" fill="${item.color}"/>`);
                break;
              case 'halftone':
                parts.push(`    <circle cx="${r(item.x)}" cy="${r(item.y)}" r="${r(s * HALFTONE_RADIUS_RATIO)}" fill="${item.color}"/>`);
                break;
              case 'wave': {
                const hw = item.w / 2;
                const sw = r(Math.max(1.6, item.h));
                const d = `M${r(-hw)},0 Q${r(-hw*0.5)},${r(-item.h*1.1)} 0,0 Q${r(hw*0.5)},${r(item.h*1.1)} ${r(hw)},0`;
                parts.push(`    <path${tf} d="${d}" fill="none" stroke="${item.color}" stroke-width="${sw}"/>`);
                break;
              }
            }
          }
          parts.push(`  </g>`);
        });

        if (artwork.logo || artwork.lines.length) {
          const esc = str => str.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          parts.push('  <g id="typography-overlay">');
          if (artwork.logo) {
            const { x, y, scale } = artwork.logo;
            parts.push(`    <g id="poster-logo" role="img" aria-label="The Clouded Issue" fill="${state.typography.color}" transform="translate(${r(x)} ${r(y)}) scale(${scale.toFixed(6)})">`);
            for (const path of CLOUD_EDITION_LOGO.paths) parts.push(`      <path d="${path}"/>`);
            parts.push('    </g>');
          }
          for (const {x, y, font, size, color, text} of artwork.lines) {
            parts.push(`    <text x="${r(x)}" y="${r(y)}" xml:space="preserve" font-family="Eiffel-${font}, sans-serif" font-size="${size}" fill="${color}">${esc(text)}</text>`);
          }
          parts.push('  </g>');
        }

        parts.push(`</svg>`);
        return parts.join('\n');
      }

      function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }

      const fontData = new Map();

      function getSVGFont(font) {
        if (!fontData.has(font)) {
          const data = fetch(`Assets/fonts/BVHEiffelTrial-${font}.otf`).then(response => {
            if (!response.ok) throw new Error(`Font Eiffel ${font}`);
            return response.blob();
          }).then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          })).catch(error => {
            fontData.delete(font);
            throw error;
          });
          fontData.set(font, data);
        }
        return fontData.get(font);
      }

      async function exportSVG() {
        try {
          const svg = buildSVGString();
          const fonts = [...new Set(state.typography.blocks.filter(block => block.text.trim()).map(block => block.font))];
          const sources = await Promise.allSettled(fonts.map(getSVGFont));
          const rules = sources.flatMap((source, index) => source.status === 'fulfilled' ? [
            `@font-face { font-family: 'Eiffel-${fonts[index]}'; src: url('${source.value}') format('opentype'); }`
          ] : []);
          const artwork = svg.replace('</svg>', `<defs><style>${rules.join('\n')}</style></defs>\n</svg>`);
          downloadBlob(new Blob([artwork], { type: 'image/svg+xml;charset=utf-8' }), 'the-clouded-issue.svg');
          showToast(rules.length === fonts.length ? 'SVG a livelli esportato' : 'SVG esportato. Alcuni font non sono stati incorporati.');
        } catch (err) {
          showToast("Errore durante l'esportazione SVG");
        }
      }

      async function exportPNG() {
        try {
          await document.fonts.ready;
          const exportCanvas = document.createElement('canvas');
          renderCanvas(state.anim.progress, exportCanvas);
          exportCanvas.toBlob(blob => {
            if (!blob) return showToast('Errore esportazione PNG');
            downloadBlob(blob, `the-clouded-issue.png`);
            showToast('PNG ad alta risoluzione scaricato');
          }, 'image/png');
        } catch (err) {
          showToast('Errore durante l\'esportazione PNG');
        }
      }

      // WebM Recorder
      let mediaRecorder = null;
      let recordedChunks = [];

      function startWebMRecording() {
        if (state.anim.isRecording) return;
        if (typeof MediaRecorder === 'undefined' || !canvas.captureStream) {
          showToast('Registrazione WebM non supportata da questo browser');
          return;
        }

        try {
          const stream = canvas.captureStream(60);
          const mimeCandidates = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
          ];
          const mimeType = mimeCandidates.find(m => MediaRecorder.isTypeSupported(m)) || '';

          recordedChunks = [];
          mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 6000000 } : undefined);

          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
            downloadBlob(blob, `the-clouded-issue-motion.webm`);
            showToast('Video WebM (IN → Sosta → OUT) esportato');
          };

          state.anim.isRecording = true;
          state.anim.mode = 'loop';
          state.anim.phase = 'in';
          state.anim.progress = 0;
          state.anim.phaseTimer = 0;

          document.getElementById('recordingBadge').classList.remove('hidden');
          document.getElementById('recordingBadge').classList.add('inline-flex');
          updateAnimStatusUI('REC IN');
          renderCanvas(0);

          mediaRecorder.start();
          showToast('Registrazione avviata: ciclo completo IN → OUT...');
        } catch (err) {
          state.anim.isRecording = false;
          showToast('Impossibile avviare la registrazione video');
        }
      }

      function finishWebMRecording() {
        state.anim.isRecording = false;
        state.anim.mode = 'static';
        state.anim.progress = 1;
        renderCanvas(1);
        syncTimelineUI();
        updateAnimStatusUI('COMPLETO');
        document.getElementById('recordingBadge').classList.add('hidden');
        document.getElementById('recordingBadge').classList.remove('inline-flex');
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }

      /* ======================================================================
         11. RESPONSIVE SHEET SCALING
         ====================================================================== */

      function fitSheetToStage() {
        const stage = document.getElementById('stageContainer');
        const frame = document.getElementById('sheetFrame');
        const { width: W, height: H } = FORMATS[state.format];

        const availW = Math.max(220, stage.clientWidth - 40);
        const availH = Math.max(220, stage.clientHeight - 40);
        const scale = Math.min(availW / W, availH / H);

        frame.style.width = `${Math.floor(W * scale)}px`;
        frame.style.height = `${Math.floor(H * scale)}px`;

        // Checkerboard preview if transparent
        if (state.background === 'transparent') {
          frame.classList.add('checkerboard-bg');
        } else {
          frame.classList.remove('checkerboard-bg');
        }
      }

      /* ======================================================================
         12. UI RENDERING & EVENT BINDINGS
         ====================================================================== */

      function renderEffectsPanel() {
        const container = document.getElementById('effectsContainer');
        container.innerHTML = '';

        CATEGORIES.forEach(cat => {
          const groupEffects = state.effects.filter(e => e.category === cat.id);
          const section = document.createElement('div');
          section.className = 'space-y-1.5';

          const header = document.createElement('div');
          header.className = 'font-mono-tech text-[10px] font-bold uppercase tracking-wider text-[#666662] px-1 pt-1 flex items-center justify-between';
          header.innerHTML = `<span>${cat.label}</span><span>${groupEffects.filter(e => e.active).length}/${groupEffects.length}</span>`;
          section.appendChild(header);

          const scale = state.categoryScales[cat.id];
          const scaleControl = document.createElement('label');
          scaleControl.className = 'flex items-center gap-2 px-1 pb-1 font-mono-tech text-[10px]';
          scaleControl.innerHTML = `<span>Scala</span><input type="range" min="0.5" max="2.2" step="0.05"
            aria-label="Scala micro-geometrie, ${cat.label}" value="${scale}" class="tech-slider flex-1 min-w-0" />
            <output class="w-10 text-right">${scale.toFixed(2)}×</output>`;
          const scaleValue = scaleControl.querySelector('output');
          scaleControl.querySelector('input').addEventListener('input', event => {
            const value = Number(event.target.value);
            state.categoryScales[cat.id] = value;
            scaleValue.textContent = `${value.toFixed(2)}×`;
            rebuildGeometry(cat.id);
          });
          section.appendChild(scaleControl);

          groupEffects.forEach(eff => {
            const card = document.createElement('div');
            card.className = `rounded border transition-colors ${eff.active ? 'bg-white border-[#161616]' : 'bg-[#F1F1EF] border-[#D6D6D2] opacity-80'}`;

            const color = eff.color;
            const intensityHint = eff.maxDots
              ? 'Numero di pallini'
              : eff.id === 'tralicci' ? 'Numero di ramificazioni' : 'Ampiezza e dispersione sul foglio';
            let optionsControl = '';
            const selectClasses = 'flex-1 bg-[#F8F8F6] border border-[#D6D6D2] rounded px-1.5 py-1 text-[10px] font-mono-tech text-[#161616] focus:outline-none focus:border-[#161616]';

            if (!eff.fixedLogic) {
              const options = eff.defaultLogic === 'flora-scatter'
                ? [{ id: 'flora-scatter', label: 'Dispersione dal centro' }, ...SPATIAL_LOGICS]
                : SPATIAL_LOGICS;
              optionsControl = `
                <label class="flex items-center gap-2">
                  <span class="font-mono-tech text-[9px] uppercase text-[#666662] w-12 shrink-0">Logica</span>
                  <select data-id="${eff.id}" class="eff-logic ${selectClasses}">
                    ${options.map(option => `<option value="${option.id}" ${option.id === eff.logic ? 'selected' : ''}>${option.label}</option>`).join('')}
                  </select>
                </label>`;
            }
            const mixParameter = eff.brownfield !== undefined ? 'brownfield'
              : eff.contamination !== undefined ? 'contamination' : null;
            const mixControl = mixParameter ? `
              <label class="block">
                <input type="range" min="0" max="100" value="${eff[mixParameter]}" data-id="${eff.id}" data-parameter="${mixParameter}"
                  aria-label="${mixParameter === 'brownfield' ? 'Percentuale di brownfield' : 'Percentuale di falda sporca'}" class="tech-slider w-full" />
                <span class="block font-mono-tech text-[10px] text-[#666662]">${parameterReadout(mixParameter, eff[mixParameter])}</span>
              </label>` : '';

            card.innerHTML = `
              <div class="p-2.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-5 h-5 rounded-sm border border-black/10 bg-[#F8F8F6] flex items-center justify-center shrink-0" style="color:${color}">
                    <svg width="14" height="14" viewBox="0 0 16 16">${eff.shape === 'pylon'
                      ? `<g transform="translate(8 8) scale(14)">${PYLON_MOTIF.map(part => `<path d="${part.d}" fill="${part.fill}"/>`).join('')}</g>`
                      : eff.iconSvg}</svg>
                  </span>
                  <span class="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15" style="background:${color}"></span>
                  <span class="text-xs font-semibold text-[#161616] truncate">${eff.name}</span>
                </div>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only eff-toggle" data-id="${eff.id}" aria-label="${eff.name}" ${eff.active ? 'checked' : ''} />
                  <span class="toggle-pill"></span>
                </label>
              </div>
              <div class="${eff.active ? 'block' : 'hidden'} px-2.5 pb-2.5 pt-1 border-t border-[#ECECE8] space-y-2">
                <label class="flex items-center gap-2">
                  <span class="font-mono-tech text-[9px] uppercase text-[#666662] w-20 shrink-0">Intensità</span>
                  <input type="range" min="0" max="200" value="${eff.intensity}" data-id="${eff.id}" data-parameter="intensity" title="${usesHouseLayout(eff) ? 'Condivisa da Pressione sulle case e Bollette' : intensityHint}" class="tech-slider eff-intensity flex-1 min-w-0" />
                  <span class="font-mono-tech text-[10px] text-[#161616] w-7 text-right eff-int-val">${eff.intensity}</span>
                </label>
                ${optionsControl}
                ${mixControl}
                ${eff.mergeDots !== undefined ? `
                  <label class="flex items-center gap-2 text-[11px] text-[#161616] cursor-pointer">
                    <input type="checkbox" class="heat-merge" data-id="${eff.id}" ${eff.mergeDots ? 'checked' : ''} />
                    Forma macchie ad alta intensità
                  </label>` : ''}
              </div>
            `;

            section.appendChild(card);
          });

          container.appendChild(section);
        });

        // Update active counter
        const activeCount = state.effects.filter(e => e.active).length;
        document.getElementById('activeCountLabel').textContent = `${activeCount} / ${state.effects.length} effetti attivi`;

        // Attach listeners
        container.querySelectorAll('.eff-toggle').forEach(el => {
          el.addEventListener('change', (e) => {
            const eff = state.effects.find(x => x.id === e.target.dataset.id);
            if (!eff) return;
            eff.active = e.target.checked;
            renderEffectsPanel();
            rebuildGeometry();
          });
        });

        container.querySelectorAll('input[data-parameter]').forEach(el => {
          el.addEventListener('input', (e) => {
            const { id, parameter } = e.target.dataset;
            const eff = state.effects.find(x => x.id === id);
            if (!eff) return;
            eff[parameter] = Number(e.target.value);
            e.target.nextElementSibling.textContent = parameterReadout(parameter, eff[parameter]);
            if (usesHouseLayout(eff)) {
              const other = state.effects.find(effect => usesHouseLayout(effect) && effect !== eff);
              other[parameter] = eff[parameter];
              const linkedInput = container.querySelector(`[data-id="${other.id}"][data-parameter="${parameter}"]`);
              linkedInput.value = eff[parameter];
              linkedInput.nextElementSibling.textContent = eff[parameter];
            }
            rebuildGeometry(eff.category);
          });
        });

        container.querySelector('.heat-merge').addEventListener('change', (e) => {
          const effect = state.effects.find(effect => effect.id === e.target.dataset.id);
          effect.mergeDots = e.target.checked;
          rebuildGeometry();
        });

        container.querySelectorAll('.eff-logic').forEach(el => {
          el.addEventListener('change', (e) => {
            const eff = state.effects.find(x => x.id === e.target.dataset.id);
            if (!eff) return;
            eff.logic = e.target.value;
            rebuildGeometry();
          });
        });

      }

      function parameterReadout(parameter, value) {
        if (parameter === 'brownfield') return `Greenfield ${100 - value}% / Brownfield ${value}%`;
        if (parameter === 'contamination') return `Pulita ${100 - value}% / Sporca ${value}%`;
        return value;
      }

      function regenerateComposition() {
        state.variation = Math.floor(Math.random() * 0x100000000);
        rebuildGeometry();
      }

      function mixRandomEffects() {
        // Randomly select 3 to 5 effects with balanced intensities
        const targetCount = 3 + Math.floor(Math.random() * 3);
        const indices = state.effects.map((_, index) => index);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        const chosen = new Set(indices.slice(0, targetCount));

        state.effects.forEach((eff, idx) => {
          eff.active = chosen.has(idx);
          eff.logic = eff.defaultLogic;
          if (eff.active) {
            eff.intensity = 45 + Math.floor(Math.random() * 45);
          }
        });
        const activeHouse = state.effects.find(effect => usesHouseLayout(effect) && effect.active);
        if (activeHouse) {
          state.effects.filter(usesHouseLayout).forEach(effect => { effect.intensity = activeHouse.intensity; });
        }

        renderEffectsPanel();
        regenerateComposition();
        showToast(`Mix generato: ${targetCount} effetti combinati`);
      }

      let toastTimer = null;
      function showToast(msg) {
        const box = document.getElementById('toastBox');
        document.getElementById('toastMessage').textContent = msg;
        box.classList.remove('opacity-0', 'translate-y-2');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          box.classList.add('opacity-0', 'translate-y-2');
        }, 2800);
      }

      function bindMoveEvents() {
        const frame = document.getElementById('sheetFrame');
        const toggle = document.getElementById('moveToggle');
        const controls = document.getElementById('moveControls');
        const select = document.getElementById('moveEffect');
        const reset = document.getElementById('moveReset');
        let drag = null;
        let pendingFrame = 0;

        function schedulePreview() {
          if (pendingFrame) return;
          pendingFrame = requestAnimationFrame(() => {
            pendingFrame = 0;
            renderPositionedLayers();
          });
        }

        toggle.addEventListener('click', () => {
          state.move.enabled = !state.move.enabled;
          toggle.setAttribute('aria-pressed', String(state.move.enabled));
          controls.hidden = !state.move.enabled;
          frame.classList.toggle('moving-layer', state.move.enabled);
          updateStageHint();
        });

        reset.addEventListener('click', () => {
          state.move.positions.delete(select.value);
          reset.disabled = true;
          renderPositionedLayers();
        });
        select.addEventListener('change', () => {
          reset.disabled = !state.move.positions.has(select.value);
        });

        frame.addEventListener('pointerdown', event => {
          const id = select.value;
          if (!state.move.enabled || drag || event.button !== 0 || !generatedLayers.has(id) || state.anim.isRecording) return;
          event.preventDefault();
          frame.setPointerCapture(event.pointerId);
          drag = {
            id, pointerId: event.pointerId, rect: frame.getBoundingClientRect(),
            clientX: event.clientX, clientY: event.clientY,
            position: state.move.positions.get(id) ?? { x: 0, y: 0 }
          };
          frame.classList.add('dragging-layer');
          state.anim.mode = 'static';
          state.anim.progress = 1;
          updateAnimStatusUI('MANUALE');
          syncTimelineUI();
          schedulePreview();
        });

        function move(event) {
          if (event.pointerId !== drag?.pointerId) return;
          const dx = (event.clientX - drag.clientX) / drag.rect.width;
          const dy = (event.clientY - drag.clientY) / drag.rect.height;
          if (!dx && !dy && !state.move.positions.has(drag.id)) return;
          state.move.positions.set(drag.id, { x: drag.position.x + dx, y: drag.position.y + dy });
          reset.disabled = !state.move.positions.has(select.value);
          schedulePreview();
        }

        function finish(event) {
          if (event.pointerId !== drag?.pointerId) return;
          if (event.type === 'pointerup') move(event);
          drag = null;
          frame.classList.remove('dragging-layer');
          if (pendingFrame) cancelAnimationFrame(pendingFrame);
          pendingFrame = 0;
          renderPositionedLayers();
        }

        frame.addEventListener('pointermove', move);
        frame.addEventListener('pointerup', finish);
        frame.addEventListener('pointercancel', finish);
        frame.addEventListener('lostpointercapture', finish);
      }

      function updateMoveControls() {
        const select = document.getElementById('moveEffect');
        const previous = select.value;
        select.replaceChildren(...state.effects.filter(effect => effect.active)
          .map(effect => new Option(effect.name, effect.id)));
        if (generatedLayers.has(previous)) select.value = previous;
        select.disabled = !select.options.length;
        document.getElementById('moveReset').disabled = !state.move.positions.has(select.value);
      }

      function updateStageHint() {
        document.getElementById('moveHint').textContent = state.move.enabled
          ? 'Seleziona un parametro e trascina sul foglio' : 'Trascina i testi sulla griglia';
      }

      function renderTextBlocks(focusIndex = -1) {
        const container = document.getElementById('textBlocks');
        const fontOptions = Object.entries(TEXT_FONTS).map(([value, label]) =>
          `<option value="${value}">Eiffel ${label}</option>`).join('');
        const cells = count => Array.from({ length: count }, (_, i) =>
          `<option value="${i + 1}">${i + 1}</option>`).join('');
        container.replaceChildren(...state.typography.blocks.map((block, index) => {
          const card = document.createElement('div');
          card.className = 'text-block-editor';
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <label class="settings-label" for="blockText-${index}">Testo ${index + 1}</label>
              <button class="layout-button" type="button" data-remove>Elimina</button>
            </div>
            <textarea id="blockText-${index}" data-field="text" rows="2" placeholder="Scrivi qui"></textarea>
            <label class="layout-field">Font <select data-field="font">${fontOptions}</select></label>
            <div class="grid grid-cols-2 gap-2">
              <label class="layout-field">Corpo (px) <input type="number" data-field="size" min="6" max="500" /></label>
              <label class="layout-field">Colonna <select data-field="column">${cells(state.grid.columns)}</select></label>
              <label class="layout-field">Riga <select data-field="row">${cells(state.grid.rows)}</select></label>
            </div>
            <label class="layout-field">Allineamento nella riga
              <select data-field="vertical"><option value="top">In alto</option><option value="bottom">In basso</option></select>
            </label>`;
          for (const control of card.querySelectorAll('[data-field]')) {
            const field = control.dataset.field;
            const limit = field === 'column' ? state.grid.columns : field === 'row' ? state.grid.rows : Infinity;
            control.value = typeof block[field] === 'number' ? Math.min(block[field], limit) : block[field];
            control.addEventListener(field === 'size' ? 'change' : 'input', () => {
              if (field === 'size') control.value = clamp(Number(control.value) || block.size, 6, 500);
              block[field] = typeof block[field] === 'number' ? Number(control.value) : control.value;
              renderCanvas(state.anim.progress);
            });
          }
          card.querySelector('[data-remove]').addEventListener('click', () => {
            state.typography.blocks.splice(index, 1);
            renderTextBlocks(Math.min(index, state.typography.blocks.length - 1));
            if (!state.typography.blocks.length) document.getElementById('addTextBlock').focus();
            renderCanvas(state.anim.progress);
          });
          return card;
        }));
        if (focusIndex >= 0) container.children[focusIndex].querySelector('textarea').focus();
      }

      function bindTextDrag() {
        const frame = document.getElementById('sheetFrame');
        let drag = null;

        function textUnderPointer(event) {
          const { width: W, height: H } = FORMATS[state.format];
          const rect = canvas.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width * W;
          const y = (event.clientY - rect.top) / rect.height * H;
          const grid = getGridMetrics(W, H);
          const ctx = canvas.getContext('2d');
          return state.typography.blocks.findLast(block => {
            if (!block.text.trim()) return false;
            const lines = block.text.split('\n');
            const origin = textOrigin(block, grid, lines.length,
              Math.min(block.column, state.grid.columns), Math.min(block.row, state.grid.rows));
            const box = placeTextBounds(measureTextBlock(ctx, block, lines), origin);
            return x >= box.left - 5 && x <= box.right + 5 && y >= box.top - 5 && y <= box.bottom + 5;
          });
        }

        frame.addEventListener('pointerdown', event => {
          if (state.move.enabled || state.anim.isRecording || drag || event.button !== 0 || state.anim.progress <= 0.01) return;
          const block = textUnderPointer(event);
          if (!block) return;
          event.preventDefault();
          const { width: W, height: H } = FORMATS[state.format];
          const { gutter, cellWidth, cellHeight } = getGridMetrics(W, H);
          const rect = canvas.getBoundingClientRect();
          drag = {
            block, pointerId: event.pointerId, x: event.clientX, y: event.clientY,
            column: Math.min(block.column, state.grid.columns), row: Math.min(block.row, state.grid.rows),
            columnStep: (cellWidth + gutter) / W * rect.width,
            rowStep: (cellHeight + gutter) / H * rect.height
          };
          frame.setPointerCapture(event.pointerId);
          frame.classList.add('dragging-text');
        });

        function move(event) {
          if (!drag) {
            frame.classList.toggle('text-grab', !state.move.enabled && !state.anim.isRecording &&
              state.anim.progress > 0.01 && Boolean(textUnderPointer(event)));
            return;
          }
          if (event.pointerId !== drag.pointerId) return;
          const { block } = drag;
          const column = clamp(drag.column + Math.round((event.clientX - drag.x) / drag.columnStep), 1, state.grid.columns);
          const row = clamp(drag.row + Math.round((event.clientY - drag.y) / drag.rowStep), 1, state.grid.rows);
          if (column === block.column && row === block.row) return;
          block.column = column;
          block.row = row;
          renderCanvas(state.anim.progress);
        }

        function finish(event) {
          if (event.pointerId !== drag?.pointerId) return;
          if (event.type === 'pointerup') move(event);
          drag = null;
          frame.classList.remove('dragging-text', 'text-grab');
          renderTextBlocks();
        }

        frame.addEventListener('pointermove', move);
        frame.addEventListener('pointerup', finish);
        frame.addEventListener('pointercancel', finish);
        frame.addEventListener('lostpointercapture', finish);
        frame.addEventListener('pointerleave', () => frame.classList.remove('text-grab'));
      }

      function bindTypographyEvents() {
        document.getElementById('gridVisible').addEventListener('change', event => {
          state.grid.visible = event.target.checked;
          updateGridPreview();
        });
        for (const [id, key] of [
          ['gridColumns', 'columns'], ['gridRows', 'rows'], ['gridGap', 'gap'], ['gridMargin', 'margin']
        ]) {
          document.getElementById(id).addEventListener('change', event => {
            const field = event.target;
            const number = field.valueAsNumber;
            let value = Number.isFinite(number) ? clamp(number, Number(field.min), Number(field.max)) : state.grid[key];
            if (key === 'columns' || key === 'rows') value = Math.round(value);
            field.value = value;
            state.grid[key] = value;
            updateGridPreview();
            if (key === 'columns' || key === 'rows') renderTextBlocks();
            renderCanvas(state.anim.progress);
          });
        }

        for (const [id, eventName, field, property] of [
          ['typoToggle', 'change', 'checked', 'enabled'],
          ['logoPosition', 'change', 'value', 'position'],
          ['typographyColorInput', 'input', 'value', 'color']
        ]) {
          document.getElementById(id).addEventListener(eventName, event => {
            state.typography[property] = event.target[field];
            renderCanvas(state.anim.progress);
          });
        }
        document.getElementById('addTextBlock').addEventListener('click', () => {
          const blocks = state.typography.blocks;
          const row = (blocks.length - 1 + state.grid.rows) % state.grid.rows + 1;
          blocks.push({ text: '', font: 'Regular', size: 36,
            column: 1, row, vertical: 'top' });
          renderTextBlocks(blocks.length - 1);
        });
      }

      function bindEvents() {
        bindMoveEvents();
        bindTextDrag();
        updateStageHint();
        // Top randomize & mix
        document.getElementById('btnRandomizeTop').addEventListener('click', async event => {
          const button = event.currentTarget;
          button.disabled = true;
          try {
            await document.fonts.ready;
            const fits = randomizeTextPositions();
            regenerateComposition();
            if (fits) renderTextBlocks();
            showToast(fits ? 'Nuova composizione generata' : 'Effetti rigenerati. La griglia non ha spazio per tutti i testi.');
          } finally {
            button.disabled = false;
          }
        });
        document.getElementById('btnMixTop').addEventListener('click', mixRandomEffects);

        // Reset / All On
        document.getElementById('btnAllOff').addEventListener('click', () => {
          state.effects.forEach(e => { e.active = false; });
          renderEffectsPanel();
          rebuildGeometry();
        });
        document.getElementById('btnAllOn').addEventListener('click', () => {
          state.effects.forEach(e => { e.active = true; });
          renderEffectsPanel();
          rebuildGeometry();
        });

        // Format presets
        document.querySelectorAll('.format-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            state.format = btn.dataset.format;
            document.querySelectorAll('.format-btn').forEach(b => {
              const active = b.dataset.format === state.format;
              b.className = active
                ? 'format-btn px-2.5 py-2 rounded border border-[#161616] bg-[#161616] text-white text-left transition-colors cursor-pointer'
                : 'format-btn px-2.5 py-2 rounded border border-[#D6D6D2] bg-white text-[#161616] hover:border-[#161616] text-left transition-colors cursor-pointer';
              b.querySelector('div:last-child').className = active
                ? 'font-mono-tech text-[10px] opacity-75'
                : 'font-mono-tech text-[10px] text-[#666662]';
            });
            document.getElementById('sheetDimBadge').textContent = FORMATS[state.format].label;
            fitSheetToStage();
            updateGridPreview();
            rebuildGeometry();
          });
        });

        // Background presets
        document.querySelectorAll('.bg-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            state.background = btn.dataset.bg;
            document.querySelectorAll('.bg-btn').forEach(b => {
              b.classList.toggle('border-[#161616]', b.dataset.bg === state.background);
              b.classList.toggle('border-[#D6D6D2]', b.dataset.bg !== state.background);
            });
            fitSheetToStage();
            renderCanvas(state.anim.progress);
          });
        });

        bindTypographyEvents();

        // Motion Playback Controls
        document.getElementById('btnAnimIn').addEventListener('click', () => {
          state.anim.mode = 'in';
          state.anim.progress = 0;
          updateAnimStatusUI('INGRESSO');
          renderCanvas(0);
        });

        document.getElementById('btnAnimOut').addEventListener('click', () => {
          state.anim.mode = 'out';
          state.anim.progress = 1;
          updateAnimStatusUI('USCITA');
          renderCanvas(1);
        });

        document.getElementById('btnAnimLoop').addEventListener('click', () => {
          if (state.anim.mode === 'loop') {
            state.anim.mode = 'static';
            updateAnimStatusUI('PAUSA');
          } else {
            state.anim.mode = 'loop';
            state.anim.phase = 'in';
            state.anim.progress = 0;
            updateAnimStatusUI('INGRESSO');
          }
        });

        document.getElementById('animStyleSelect').addEventListener('change', (e) => {
          state.anim.style = e.target.value;
          if (state.anim.mode === 'static') {
            state.anim.mode = 'in';
            state.anim.progress = 0;
            updateAnimStatusUI('INGRESSO');
          }
        });

        document.getElementById('animSpeedSlider').addEventListener('input', (e) => {
          state.anim.speed = Number(e.target.value);
          document.getElementById('animSpeedVal').textContent = `${state.anim.speed.toFixed(1)}×`;
        });

        document.getElementById('timelineScrubber').addEventListener('input', (e) => {
          state.anim.mode = 'static';
          state.anim.progress = Number(e.target.value);
          updateAnimStatusUI('MANUALE');
          renderCanvas(state.anim.progress);
          syncTimelineUI();
        });

        // Export Buttons
        document.getElementById('btnExportSVG').addEventListener('click', exportSVG);
        document.getElementById('btnExportPNG').addEventListener('click', exportPNG);
        document.getElementById('btnRecordWebM').addEventListener('click', startWebMRecording);

        // Mobile Tab Switching
        document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const tab = btn.dataset.mobileTab;
            document.querySelectorAll('.mobile-tab-btn').forEach(b => {
              const active = b.dataset.mobileTab === tab;
              b.classList.toggle('border-[#FF5D38]', active);
              b.classList.toggle('text-[#161616]', active);
              b.classList.toggle('font-semibold', active);
              b.classList.toggle('border-transparent', !active);
              b.classList.toggle('text-[#666662]', !active);
            });

            const pEffects = document.getElementById('panelEffects');
            const pCanvas = document.getElementById('panelCanvas');
            const pSettings = document.getElementById('panelSettings');

            pEffects.classList.toggle('hidden', tab !== 'effects');
            pEffects.classList.toggle('flex', tab === 'effects');
            pCanvas.classList.toggle('hidden', tab !== 'canvas');
            pCanvas.classList.toggle('flex', tab === 'canvas');
            pSettings.classList.toggle('hidden', tab !== 'settings');
            pSettings.classList.toggle('flex', tab === 'settings');

            if (tab === 'canvas') {
              setTimeout(fitSheetToStage, 30);
            }
          });
        });

        window.addEventListener('resize', fitSheetToStage);
        document.fonts?.addEventListener('loadingdone', () => renderCanvas(state.anim.progress));
      }

      /* ======================================================================
         13. INITIALIZATION
         ====================================================================== */

      window.addEventListener('load', () => {
        renderEffectsPanel();
        bindEvents();
        renderTextBlocks();
        updateGridPreview();
        fitSheetToStage();
        rebuildGeometry();
        requestAnimationFrame(animTick);
      });
    })();
