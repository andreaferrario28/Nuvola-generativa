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
        {
          id: 'traffico',
          name: 'Traffico',
          category: 'economia',
          color: '#004E64',
          shape: 'triangle',
          defaultLogic: 'flow-paths',
          active: true,
          intensity: 65,
          iconSvg: '<polygon points="8,2 14,13.5 2,13.5" fill="#004E64"/>'
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

      const BACKGROUNDS = {
        paper:       { hex: '#EDEEE9', ink: '#555555', subInk: '#555555' },
        white:       { hex: '#FFFFFF', ink: '#161616', subInk: '#555550' },
        dark:        { hex: '#555555', ink: '#EDEEE9', subInk: '#EDEEE9' },
        transparent: { hex: null,      ink: '#161616', subInk: '#555550' }
      };

      const ZONE_DESCRIPTIONS = {
        free:      'Ogni effetto parte da una zona scelta dal seed. La composizione si estende fino ai margini.',
        epicenter: 'Ancora pennacchi, calore e onde attorno all\'epicentro (clicca sul foglio per spostarlo).',
        frame:     'Mantiene libera un\'area centrale pulita per ospitare titoli, testi o elementi grafici.',
        diagonal:  'Concentra le micro-geometrie lungo un asse dinamico diagonale attraverso il foglio.',
        poster:    'Distribuisce gruppi e segni isolati in modo asimmetrico, lasciando spazio al logo.'
      };

      const LOGO_PATHS = CLOUD_EDITION_LOGO.paths.map(path => new Path2D(path));
      const HALFTONE_RADIUS_RATIO = 0.52;
      const TITLE_FONT = 'Eiffel, Inter, sans-serif';
      const SUBTITLE_FONT = 'IBM Plex Mono, monospace';
      const DEFAULT_DISTRIBUTION = 50;
      const HOUSE_LAYER_ID = 'pressione-rete';
      const SAFE_FRAME = { left: 0.22, right: 0.78, top: 0.25, bottom: 0.75 };

      /* ======================================================================
         2. APPLICATION STATE
         ====================================================================== */

      const state = {
        seed: 48291,
        format: 'a4',
        background: 'paper',
        zoneMode: 'free',
        epicenter: { x: 0.46, y: 0.48 }, // normalized 0..1
        globalScale: 1.0,
        typography: {
          enabled: true,
          mode: 'logo',
          logoColor: CLOUD_EDITION_LOGO.color,
          title: 'THE CLOUDED ISSUE',
          subtitle: 'EDIZIONE 0 /// LACCHIARELLA',
          position: 'bottom-left'
        },
        effects: EFFECTS_CONFIG.map(e => ({
          ...e, logic: e.defaultLogic, distribution: DEFAULT_DISTRIBUTION
        })),
        layers: new Map(),
        brush: { enabled: false, effectId: 'calore', strokes: [] },
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
         4. COMPOSITION ZONE MASKING & HELPERS
         ====================================================================== */

      function isInsideSafeFrame(nx, ny) {
        // Keeps a clean central box when zoneMode === 'frame'
        return nx > SAFE_FRAME.left && nx < SAFE_FRAME.right &&
          ny > SAFE_FRAME.top && ny < SAFE_FRAME.bottom;
      }

      function diagonalWeight(nx, ny) {
        // Distance to diagonal from bottom-left (0,1) to top-right (1,0)
        const dist = Math.abs((nx + ny) - 1.0) / Math.SQRT2;
        return Math.max(0, 1 - dist * 2.4);
      }

      function passesZoneFilter(nx, ny, rng, allowSoft = true) {
        const margin = state.zoneMode === 'free' ? 0 : 0.02;
        if (nx < margin || nx > 1 - margin || ny < margin || ny > 1 - margin) return false;
        if (state.zoneMode === 'frame') {
          if (isInsideSafeFrame(nx, ny)) return false;
        } else if (state.zoneMode === 'diagonal') {
          const w = diagonalWeight(nx, ny);
          if (allowSoft ? rng() > (w * 0.95 + 0.08) : w < 0.32) return false;
        }
        return true;
      }

      function getFreeAnchor(effectIndex) {
        // Strati sfalsati e ripetibili coprono zone diverse anche con lo stesso seed.
        const offset = Math.floor(hash2D(12, 91, state.seed) * 12);
        const zone = (effectIndex * 5 + offset) % 12;
        return {
          x: (zone % 3 + 0.10 + hash2D(effectIndex, 53, state.seed) * 0.80) / 3,
          y: (Math.floor(zone / 3) + 0.10 + hash2D(effectIndex, 79, state.seed) * 0.80) / 4
        };
      }

      function getFocalPoint(rng, offsetSpread = 0.14) {
        if (state.zoneMode === 'epicenter') {
          return {
            x: clamp(state.epicenter.x + (rng() - 0.5) * offsetSpread, 0.15, 0.85),
            y: clamp(state.epicenter.y + (rng() - 0.5) * offsetSpread, 0.15, 0.85)
          };
        }
        if (state.zoneMode === 'diagonal') {
          const t = 0.2 + rng() * 0.6;
          return {
            x: clamp(t + (rng() - 0.5) * 0.12, 0.15, 0.85),
            y: clamp((1 - t) + (rng() - 0.5) * 0.12, 0.15, 0.85)
          };
        }
        if (state.zoneMode === 'frame') {
          // Pick an edge anchor
          const side = Math.floor(rng() * 4);
          if (side === 0) return { x: 0.1 + rng() * 0.8, y: 0.12 };
          if (side === 1) return { x: 0.1 + rng() * 0.8, y: 0.88 };
          if (side === 2) return { x: 0.12, y: 0.15 + rng() * 0.7 };
          return { x: 0.88, y: 0.15 + rng() * 0.7 };
        }
        if (state.zoneMode === 'poster') {
          return { x: 0.14 + rng() * 0.72, y: 0.10 + rng() * 0.70 };
        }
        return {
          x: 0.18 + rng() * 0.64,
          y: 0.18 + rng() * 0.64
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
          if (state.zoneMode === 'frame') {
            const side = i % 4;
            const along = clamp(0.5 + Math.sin(angle) * 0.34 + jitter, 0.10, 0.90);
            return [
              { x: along, y: 0.14 }, { x: 0.87, y: along },
              { x: along, y: 0.86 }, { x: 0.13, y: along }
            ][side];
          }
          if (state.zoneMode === 'diagonal') {
            const x = 0.15 + i * 0.70 / (count - 1) + jitter;
            return { x, y: 1 - x + Math.sin(angle) * 0.09 };
          }
          if (state.zoneMode === 'free') {
            // Il bordo riflette le posizioni eccedenti senza accumularle sulla stessa riga.
            const reflect = value => value < 0.018 ? 0.036 - value : value > 0.982 ? 1.964 - value : value;
            const distance = (spread + jitter) * 1.42;
            return { x: reflect(focal.x + Math.cos(angle) * distance), y: reflect(focal.y + Math.sin(angle) * distance) };
          }
          return {
            x: clamp(focal.x, 0.34, 0.66) + Math.cos(angle) * (spread + jitter),
            y: clamp(focal.y, 0.34, 0.66) + Math.sin(angle) * (spread + jitter)
          };
        });
      }

      /* ======================================================================
         5. SPATIAL GENERATORS (12 DISTINCT ALGORITHMIC LOGICS)
         ====================================================================== */

      function generateEffectLayer(effect, W, H, effectIndex) {
        const items = [];
        const lines = [];
        const strength = effect.intensity / 100;
        if (!effect.active || strength <= 0.01) {
          return { items, lines };
        }

        // Per i pallini, la distribuzione di base è indipendente dal cursore.
        const intensity = effect.maxDots ? 0.55 : strength;
        const subSeed = (state.seed * 31 + (effectIndex + 1) * 7919) >>> 0;
        const rng = createRNG(subSeed);
        const minDim = Math.min(W, H);
        const baseUnit = (minDim / 90) * state.globalScale;
        const logic = effect.logic;
        const color = effect.color;
        const free = state.zoneMode === 'free';
        const freeAnchor = free ? getFreeAnchor(effectIndex) : null;
        const focalPoint = (spread = 0.14) => free ? {
          x: clamp(freeAnchor.x + (rng() - 0.5) * spread, 0.018, 0.982),
          y: clamp(freeAnchor.y + (rng() - 0.5) * spread, 0.018, 0.982)
        } : getFocalPoint(rng, spread);
        const poster = state.zoneMode === 'poster';

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
                const nx = x / W, ny = y / H;
                if (!passesZoneFilter(nx, ny, rng, false)) continue;

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

          const cols = Math.floor(W / stepX);
          const rows = Math.floor(H / stepY);
          for (let r = 1; r < rows; r++) {
            for (let c = 1; c < cols; c++) {
              const x = c * stepX;
              const y = r * stepY;
              const nx = x / W, ny = y / H;
              if (!passesZoneFilter(nx, ny, rng, true)) continue;

              // Check proximity to any modular cluster anchor
              let minD = 99;
              for (const a of anchors) {
                const d = Math.hypot(nx - a.x, ny - a.y);
                if (d < minD) minD = d;
              }
              const radius = 0.12 + intensity * 0.22;
              if (minD > radius) continue;
              if (rng() > (1 - minD / radius) * 0.9 + 0.15) continue;

              const w = baseUnit * (1.5 + Math.floor(rng() * 2) * 0.9);
              const h = baseUnit * 0.65;
              const order = clamp((c / cols) * 0.6 + (r / rows) * 0.4, 0, 1);

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
          for (let i = 0; items.length < effect.maxDots && i < effect.maxDots * 32; i++) {
            const center = centers[i % centers.length];
            const angle = rng() * Math.PI * 2;
            const distance = Math.sqrt(rng()) * radius * 0.6;
            const x = center.x + Math.cos(angle) * distance;
            const y = center.y + Math.sin(angle) * distance;
            if (!passesZoneFilter(x / W, y / H, rng, false)) continue;
            if (items.some(dot => Math.hypot(x - dot.x, y - dot.y) < baseUnit * 1.08)) continue;
            items.push({ shape: effect.shape, x, y, color, order: distance / radius });
          }
        }

        else if (logic === 'water-traces') {
          const frame = state.zoneMode === 'frame';
          const anchor = focalPoint(0.18);
          const direction = frame ? 0 : state.zoneMode === 'diagonal'
            ? -Math.PI / 4 : (rng() - 0.5) * 1.68 - 0.27;
          const dx = Math.cos(direction);
          const dy = Math.sin(direction);
          const travel = Math.min(W / Math.max(0.01, Math.abs(dx)), H / Math.max(0.01, Math.abs(dy)));
          const span = travel * (0.52 + intensity * 0.39);
          const width = Math.min(minDim * 0.071, Math.max(20, baseUnit * 4.15));
          const separation = Math.max(width * 1.90, minDim * 0.195);
          const phase = rng() * Math.PI * 2;
          const segments = Math.max(40, Math.ceil(span / 9));
          const meander = frame ? 0.48 : 1;
          const traces = [];

          for (let trace = 0; trace < 2; trace++) {
            const length = span * (0.95 + rng() * 0.05);
            const bend = rng() * Math.PI * 2;
            const bankSeed = subSeed + trace * 281;
            const upper = [];
            const lower = [];
            for (let i = 0; i <= segments; i++) {
              const t = i / segments;
              const along = (t - 0.5) * length;
              const common = Math.sin(t * 7.1 + phase) * minDim * 0.071
                + Math.sin(t * 13.8 + phase * 1.3) * minDim * 0.023;
              const local = Math.sin(t * 10.5 + bend) * minDim * 0.032
                + (noise2D(t * 6.5, 2, bankSeed) - 0.5) * width * 0.26
                + (noise2D(t * 21, 4, bankSeed) - 0.5) * width * 0.34;
              const across = (frame ? 0 : (trace - 0.5) * separation) + (common + local) * meander;
              const taper = 0.47 + 0.53 * Math.sin(t * Math.PI) ** 0.48;
              // Sponde frastagliate: rumore ad alta frequenza, diverso per ciascun lato.
              const rough = seed => (noise2D(t * 27, seed, bankSeed) - 0.5) * 0.34
                + (noise2D(t * 67, seed + 1, bankSeed) - 0.5) * 0.22;
              const left = across - width * taper * Math.max(0.12, 0.30 + noise2D(t * 5.1, 3, bankSeed) * 0.23 + rough(11));
              const right = across + width * taper * Math.max(0.12, 0.30 + noise2D(t * 5.1, 7, bankSeed) * 0.23 + rough(13));
              upper.push({ x: along * dx - left * dy, y: along * dy + left * dx });
              lower.push({ x: along * dx - right * dy, y: along * dy + right * dx });
            }
            traces.push({ points: upper.concat(lower.reverse()), bankSeed });
          }

          const margin = free ? 0 : 0.027;
          const envelope = getPointBounds(traces.flatMap(trace => trace.points));
          const fit = Math.min(1, W * (1 - margin * 2) / (envelope.right - envelope.left),
            H * (1 - margin * 2) / (envelope.bottom - envelope.top));
          for (const [i, trace] of traces.entries()) {
            const points = trace.points.map(({ x, y }) => ({ x: x * fit, y: y * fit }));
            const bounds = getPointBounds(points);
            const x = clamp((frame ? 0.5 : anchor.x) * W,
              W * margin - (frame ? bounds.left : envelope.left * fit),
              W * (1 - margin) - (frame ? bounds.right : envelope.right * fit));
            const y = clamp((frame ? (i === 0 ? 0.133 : 0.867) : anchor.y) * H,
              H * margin - (frame ? bounds.top : envelope.top * fit),
              H * (1 - margin) - (frame ? bounds.bottom : envelope.bottom * fit));
            const ribbon = createAquiferRibbon(points, bounds, width * fit / 4.8, effect.contamination, trace.bankSeed);
            items.push({ shape: effect.shape, x, y, color, size: width * fit, order: i * 0.26, ribbon });
          }
        }

        // 3. FLOW-PATHS (Traffico: triangles aligned along curved trajectories)
        else if (logic === 'flow-paths') {
          const numPaths = Math.max(1, Math.round(1 + intensity * 4.5));
          for (let p = 0; p < numPaths; p++) {
            let p0, p1, p2, p3;
            if (state.zoneMode === 'diagonal') {
              const off = (rng() - 0.5) * 0.24;
              p0 = { x: (0.04 + off) * W, y: (0.96 + off) * H };
              p3 = { x: (0.96 + off) * W, y: (0.04 + off) * H };
              p1 = { x: (0.35 + (rng() - 0.5) * 0.25) * W, y: (0.65 + (rng() - 0.5) * 0.25) * H };
              p2 = { x: (0.65 + (rng() - 0.5) * 0.25) * W, y: (0.35 + (rng() - 0.5) * 0.25) * H };
            } else if (free) {
              const horizontal = rng() > 0.48;
              const anchor = focalPoint(0.53);
              const end = clamp((horizontal ? anchor.y : anchor.x) + (rng() - 0.5) * 0.54, 0.006, 0.994);
              const start = clamp((horizontal ? anchor.y : anchor.x) + (rng() - 0.5) * 0.44, 0.006, 0.994);
              p0 = horizontal ? { x: 0, y: start * H } : { x: start * W, y: 0 };
              p3 = horizontal ? { x: W, y: end * H } : { x: end * W, y: H };
              p1 = { x: anchor.x * W, y: clamp(anchor.y + (rng() - 0.5) * 0.35, 0, 1) * H };
              p2 = { x: clamp(anchor.x + (rng() - 0.5) * 0.35, 0, 1) * W, y: anchor.y * H };
            } else {
              const horizontal = rng() > 0.45;
              if (horizontal) {
                p0 = { x: 0.03 * W, y: (0.15 + rng() * 0.7) * H };
                p3 = { x: 0.97 * W, y: (0.15 + rng() * 0.7) * H };
              } else {
                p0 = { x: (0.15 + rng() * 0.7) * W, y: 0.03 * H };
                p3 = { x: (0.15 + rng() * 0.7) * W, y: 0.97 * H };
              }
              const cx = (state.zoneMode === 'epicenter' ? state.epicenter.x : (0.3 + rng() * 0.4)) * W;
              const cy = (state.zoneMode === 'epicenter' ? state.epicenter.y : (0.3 + rng() * 0.4)) * H;
              p1 = { x: cx + (rng() - 0.5) * W * 0.35, y: cy + (rng() - 0.5) * H * 0.35 };
              p2 = { x: cx + (rng() - 0.5) * W * 0.35, y: cy + (rng() - 0.5) * H * 0.35 };
            }

            const steps = Math.round(18 + intensity * 38);
            const reach = free ? 0.57 + intensity * 0.43 : 0.29 + intensity * 0.71;
            const startT = free && rng() > 0.5 ? 1 - reach : free ? 0 : (1 - reach) / 2;
            if (state.zoneMode === 'frame') {
              const side = Math.floor(rng() * 4);
              const alongHorizontalEdge = side % 2 === 0;
              const margin = side < 2 ? 0.03 : 0.78;
              for (const point of [p0, p1, p2, p3]) {
                if (alongHorizontalEdge) point.y = margin * H + point.y * 0.19;
                else point.x = margin * W + point.x * 0.19;
              }
            }
            for (let i = 0; i < steps; i++) {
              const t = i / (steps - 1);
              const along = startT + t * reach;
              const pt = cubicBezier(p0, p1, p2, p3, along);
              const tang = cubicBezierTangent(p0, p1, p2, p3, along);
              const nx = pt.x / W, ny = pt.y / H;
              if (state.zoneMode === 'frame' && isInsideSafeFrame(nx, ny)) continue;
              const margin = free ? 0 : 0.02;
              if (nx < margin || nx > 1 - margin || ny < margin || ny > 1 - margin) continue;

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

          const startX = Math.max(free ? 0 : step, Math.floor((cx - radX * 1.3) / step) * step);
          const endX   = Math.min(free ? W : W - step, cx + radX * 1.3);
          const startY = Math.max(free ? 0 : step, Math.floor((cy - radY * 1.3) / step) * step);
          const endY   = Math.min(free ? H : H - step, cy + radY * 1.3);

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;
              if (!passesZoneFilter(nx, ny, rng, false)) continue;

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
          const focal = state.zoneMode === 'epicenter' ? state.epicenter : free ? freeAnchor : { x: 0.50, y: 0.50 };
          const spacing = baseUnit * (poster ? 1.95 : 1);
          for (let attempt = 0; items.length < effect.maxDots && attempt < effect.maxDots * 32; attempt++) {
            const margin = free ? 0.004 : 0.025;
            const nx = margin + rng() * (1 - margin * 2);
            const ny = margin + rng() * (1 - margin * 2);
            if (!passesZoneFilter(nx, ny, rng, true)) continue;
            const distance = Math.hypot(nx - focal.x, ny - focal.y);
            const radial = clamp(distance / (poster ? 0.62 : 0.51), 0, 1);
            const grain = fbm2D(nx * 7, ny * 7, subSeed);
            const border = poster ? 0.40 + 0.60 * Math.abs(nx - 0.5) * 2 : 1;
            if (rng() > (0.12 + radial ** 1.35 * 0.88) * (0.25 + grain * 0.75) * border) continue;
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
        // 5. ORGANIC-SCATTER (Flora e fauna: avoids epicenter, clusters near edges)
        // ------------------------------------------------------------------
        else if (logic === 'organic-scatter') {
          const count = effect.maxDots || Math.round(25 + intensity * 130);
          const ex = state.epicenter.x;
          const ey = state.epicenter.y;
          const radius = 0.19 + intensity * 0.47;
          const center = state.zoneMode === 'epicenter'
            ? pointOnEdge(Math.floor(rng() * 4), rng, 1, 1)
            : focalPoint();
          let attempts = 0;

          const maxAttempts = count * (effect.maxDots ? 24 : 8);
          while (items.length < count && attempts < maxAttempts) {
            attempts++;
            const angle = rng() * Math.PI * 2;
            const distance = Math.sqrt(rng()) * radius;
            const nx = center.x + Math.cos(angle) * distance;
            const ny = center.y + Math.sin(angle) * distance;
            if (!passesZoneFilter(nx, ny, rng, true)) continue;

            // Repulsion from epicenter
            const dCenter = Math.hypot(nx - ex, ny - ey);
            if (state.zoneMode === 'epicenter' && dCenter < 0.22 && rng() < 0.88) continue;

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

          const startX = Math.max(free ? 0 : step, Math.floor((cx - rad * 1.35) / step) * step);
          const endX   = Math.min(free ? W : W - step, cx + rad * 1.35);
          const startY = Math.max(free ? 0 : step, Math.floor((cy - rad * 1.35) / step) * step);
          const endY   = Math.min(free ? H : H - step, cy + rad * 1.35);

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;
              if (!passesZoneFilter(nx, ny, rng, false)) continue;

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
            let x1, y1, x2, y2;
            if (state.zoneMode === 'diagonal') {
              const off = (rng() - 0.5) * 0.35;
              x1 = (0.03 + off) * W; y1 = (0.97 + off) * H;
              x2 = (0.97 + off) * W; y2 = (0.03 + off) * H;
            } else if (state.zoneMode === 'frame') {
              const side = Math.floor(rng() * 4);
              const inset = () => (side < 2 ? 0.04 + rng() * 0.12 : 0.84 + rng() * 0.12);
              const start = 0.05 + rng() * 0.13;
              const end = 0.82 + rng() * 0.13;
              if (side % 2 === 0) {
                x1 = start * W; y1 = inset() * H;
                x2 = end * W; y2 = inset() * H;
              } else {
                x1 = inset() * W; y1 = start * H;
                x2 = inset() * W; y2 = end * H;
              }
            } else if (state.zoneMode === 'epicenter' && l === 0) {
              const ang = (rng() * Math.PI);
              const cx = state.epicenter.x * W;
              const cy = state.epicenter.y * H;
              const span = Math.max(W, H) * 0.8;
              x1 = cx - Math.cos(ang) * span; y1 = cy - Math.sin(ang) * span;
              x2 = cx + Math.cos(ang) * span; y2 = cy + Math.sin(ang) * span;
            } else {
              const edgeA = Math.floor(rng() * 4);
              const edgeB = (edgeA + 2) % 4;
              const ptA = pointOnEdge(edgeA, rng, W, H);
              const ptB = pointOnEdge(edgeB, rng, W, H);
              x1 = ptA.x; y1 = ptA.y; x2 = ptB.x; y2 = ptB.y;
            }

            // Clip endpoints softly inside sheet
            const nodes = Math.round(5 + intensity * 9);
            const reach = 0.30 + intensity * 0.70;
            let prev = null;
            for (let i = 0; i <= nodes; i++) {
              const t = 0.5 + (i / nodes - 0.5) * reach;
              const x = x1 + (x2 - x1) * t;
              const y = y1 + (y2 - y1) * t;
              const nx = x / W, ny = y / H;
              if (nx < 0.02 || nx > 0.98 || ny < 0.02 || ny > 0.98) {
                prev = null;
                continue;
              }
              if (state.zoneMode === 'frame' && isInsideSafeFrame(nx, ny)) {
                prev = null;
                continue;
              }

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
          const frame = state.zoneMode === 'frame';
          const layoutAngle = frame ? 0 : state.zoneMode === 'diagonal' ? -Math.PI / 5 : (rng() - 0.5) * Math.PI * 0.68;
          const cos = Math.cos(layoutAngle);
          const sin = Math.sin(layoutAngle);
          const anchor = focalPoint(0.12);
          const centerX = frame ? 0.5 : clamp(anchor.x, free ? 0.35 : 0.44, free ? 0.65 : 0.56);
          const centerY = frame ? 0.5 : clamp(anchor.y, free ? 0.35 : 0.44, free ? 0.65 : 0.56);
          const fit = frame ? 1 : free ? 0.72 : 0.86;
          const edgeInset = free ? 0.012 : 0.045;
          const nodeSize = Math.min(baseUnit * 1.15, minDim * 0.022);
          const strokeWidth = Math.max(1.5, baseUnit * 0.18);
          const trunks = [[], []];
          const edges = [];

          function addEdge(a, b) {
            a.degree++;
            b.degree++;
            edges.push({ a, b });
            lines.push({
              x1: a.x, y1: a.y, x2: b.x, y2: b.y, color, strokeWidth, opacity: 1, order: b.order
            });
          }

          trunks.forEach((nodes, tree) => {
            const band = (tree === 0 ? -1 : 1) * (frame ? 0.35 : 0.18);
            const drift = (rng() - 0.5) * 0.14;
            const count = 6 + Math.floor(rng() * 3);
            for (let i = 0; i < count; i++) {
              const t = i / (count - 1);
              const along = (t - 0.5) * (0.65 + rng() * 0.10);
              const across = band + (rng() - 0.5) * (frame ? 0.080 : 0.145) + (t - 0.5) * drift;
              const node = {
                x: W * (centerX + fit * (along * cos - across * sin)),
                y: H * (centerY + fit * (along * sin + across * cos)),
                degree: 0, order: 0.08 + t * 0.46, trunk: true
              };
              if (i) addEdge(nodes[i - 1], node);
              nodes.push(node);
            }
          });

          // I rami possono partire dalla dorsale o da un nodo già cresciuto.
          // Ogni nuovo segmento deve avere spazio libero in entrambe le reti.
          const target = 7 + Math.floor(intensity * 57);
          let added = 0;
          for (let attempt = 0; attempt < target * 36 && added < target; attempt++) {
            const tree = attempt % 2;
            const network = trunks[tree];
            const root = network[Math.floor(rng() * network.length)];
            if (root.degree >= 3) continue;
            const angle = rng() * Math.PI * 2;
            const length = minDim * (0.042 + rng() * 0.14);
            const tip = {
              x: root.x + Math.cos(angle) * length,
              y: root.y + Math.sin(angle) * length,
              degree: 0, order: 0.43 + rng() * 0.52
            };
            if (tip.x < W * edgeInset || tip.x > W * (1 - edgeInset) || tip.y < H * edgeInset || tip.y > H * (1 - edgeInset)) continue;
            if (frame && (tree === 0 ? tip.y > H * 0.232 : tip.y < H * 0.768)) continue;
            if (trunks.some(nodes => nodes.some(node => Math.hypot(tip.x - node.x, tip.y - node.y) < nodeSize * 1.7))) continue;
            if (edges.some(({a, b}) => segmentsCross(root, tip, a, b))) continue;
            addEdge(root, tip);
            network.push(tip);
            added++;
          }

          for (const network of trunks) {
            for (const point of network) {
              if (!point.trunk && point.degree === 2) continue;
              items.push({
                shape: effect.shape, x: point.x, y: point.y, size: nodeSize,
                w: nodeSize, h: nodeSize, rot: 0, color, order: point.order
              });
            }
          }
        }

        else if (logic === 'settlements') {
          const count = 3 + Math.round(intensity * 3);
          const centers = poster ? [
            [0.15, 0.195], [0.245, 0.105], [0.10, 0.255], [0.19, 0.143], [0.29, 0.085], [0.22, 0.28]
          ].slice(0, count).map(([x, y]) => ({
            x: x + (rng() - 0.5) * 0.10, y: y + (rng() - 0.5) * 0.075
          })) : getClusterCenters(rng, count, 0.16 + intensity * 0.13, focalPoint(0.12));
          const step = baseUnit * (poster ? 0.77 : 1.60);
          const villageRadius = Math.min(minDim * (0.064 + intensity * 0.054), step * (poster ? 5.65 : 7));
          centers.forEach((center, village) => {
            const angle = (rng() - 0.5) * 1.25;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const cells = Math.ceil(villageRadius / step);
            for (let row = -cells; row <= cells; row++) {
              for (let col = -cells; col <= cells; col++) {
                const distance = Math.hypot(row * 1.16, col) * step / villageRadius;
                if (distance > 1 || rng() > 0.98 - distance * 0.39) continue;
                // Le fasce vuote fungono da strade tra gli isolati.
                const lx = (col + Math.sign(col) * 0.25 + (rng() - 0.5) * 0.23) * step;
                const ly = (row + (rng() - 0.5) * 0.30) * step;
                const x = center.x * W + lx * cos - ly * sin;
                const y = center.y * H + lx * sin + ly * cos;
                if (!passesZoneFilter(x / W, y / H, rng, false)) continue;
                const houseSize = baseUnit * (poster ? 0.48 : 1);
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
              const nx = x / W, ny = y / H;
              if (!passesZoneFilter(nx, ny, rng, false)) continue;

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
          const target = state.zoneMode === 'free' ? [
            { x: 0.82, y: 0.82 },
            { x: 0.18, y: 0.82 },
            { x: 0.82, y: 0.18 },
            { x: 0.18, y: 0.18 }
          ][cornerIdx] : focalPoint(0.31);

          const count = Math.round(20 + intensity * 110);
          let tries = 0;
          while (items.length < count && tries < count * 6) {
            tries++;
            // Power distribution pulls points tightly toward target
            const r = Math.pow(rng(), 1.8) * (0.35 + intensity * 0.35);
            const ang = rng() * Math.PI * 2;
            const nx = target.x + Math.cos(ang) * r;
            const ny = target.y + Math.sin(ang) * r;
            if (!passesZoneFilter(nx, ny, rng, true)) continue;

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
        // 10. PLUME (Emissioni: pixelated cloud dispersing downwind from epicenter)
        // ------------------------------------------------------------------
        else if (logic === 'emission-scatter') {
          const cell = poster ? minDim * 0.023 * Math.sqrt(state.globalScale) : Math.max(7, baseUnit * 1.16);
          const side = cell * (poster ? 0.82 : 0.74);
          const firstX = cell * (0.4 + rng() * 0.25);
          const firstY = cell * (0.4 + rng() * 0.25);
          const range = minDim * (0.055 + intensity * 0.11);
          const sources = poster ? [
            [0.075, 0.145, 0.103, 0.062, 0.58],
            [0.375, 0.158, 0.132, 0.118, 0.90],
            [0.645, 0.283, 0.133, 0.088, 0.76],
            [0.312, 0.312, 0.102, 0.066, 0.62],
            [0.561, 0.408, 0.078, 0.070, 0.58],
            [0.771, 0.103, 0.083, 0.063, 0.53],
            [0.465, 0.553, 0.098, 0.092, 0.48],
            [0.825, 0.684, 0.103, 0.060, 0.40],
            [0.706, 0.829, 0.135, 0.098, 0.44],
            [0.158, 0.640, 0.069, 0.065, 0.40]
          ].map(([x, y, rx, ry, weight]) => ({
            x: x + (rng() - 0.5) * 0.115, y: y + (rng() - 0.5) * 0.105,
            rx: rx * (0.54 + intensity * 0.65), ry: ry * (0.52 + intensity * 0.71), weight
          })) : getClusterCenters(rng, 5, 0.13 + intensity * 0.12, focalPoint(0.12)).map(center => ({
            ...center, rx: range / W * (0.75 + rng() * 0.68), ry: range / H * (0.72 + rng() * 0.77),
            weight: 0.62 + rng() * 0.38
          }));
          const jitter = cell * (poster ? 0.045 : 0.11);

          // La probabilità cala gradualmente attorno a ogni sorgente; una trama
          // irregolare lascia vuoti anche nelle zone con più quadratini.
          for (let row = 0, y = firstY; y < H; row++, y += cell) {
            for (let col = 0, x = firstX; x < W; col++, x += cell) {
              const px = x + (hash2D(col, row, subSeed + 11) * 2 - 1) * jitter;
              const py = y + (hash2D(col, row, subSeed + 23) * 2 - 1) * jitter;
              const nx = px / W;
              const ny = py / H;
              if (!passesZoneFilter(nx, ny, rng, false)) continue;
              let density = 0;
              for (const source of sources) {
                const distance = ((nx - source.x) / source.rx) ** 2 + ((ny - source.y) / source.ry) ** 2;
                density = Math.max(density, source.weight / (1 + distance ** 2.4));
              }
              const grain = fbm2D(nx * 26, ny * 30, subSeed);
              const variation = 0.15 + 0.93 * grain ** 1.25;
              const probability = Math.min(0.48, density ** 1.18 * variation * (0.41 + intensity * 0.82));
              if (hash2D(col, row, subSeed + 37) >= probability) continue;
              items.push({
                shape: 'square', x: px, y: py, size: side, w: side, h: side, color,
                order: clamp(ny * 0.72 + nx * 0.22, 0, 1)
              });
            }
          }
        }

        else if (logic === 'plume') {
          const origin = state.zoneMode === 'epicenter'
            ? { x: state.epicenter.x, y: state.epicenter.y }
            : focalPoint(0.25);

          // Wind direction angle
          let windAngle = state.zoneMode === 'diagonal'
            ? -Math.PI / 4
            : (-Math.PI * 0.75 + rng() * Math.PI * 1.5);
          if (state.zoneMode === 'frame') {
            const horizontal = origin.y < 0.15 || origin.y > 0.85;
            const edgeDirection = horizontal
              ? (origin.x < 0.5 ? 0 : Math.PI)
              : (origin.y < 0.5 ? Math.PI / 2 : -Math.PI / 2);
            windAngle = edgeDirection + (rng() - 0.5) * 0.32;
          }
          const wx = Math.cos(windAngle);
          const wy = Math.sin(windAngle);
          const px = -wy;
          const py = wx;

          const cell = Math.max(7, baseUnit * 1.05);
          const maxLen = (0.32 + intensity * 0.48) * minDim;
          const maxSpread = (0.14 + intensity * 0.22) * minDim;

          const ox = origin.x * W;
          const oy = origin.y * H;

          for (let y = cell; y < H - cell; y += cell) {
            for (let x = cell; x < W - cell; x += cell) {
              const nx = x / W, ny = y / H;
              if (state.zoneMode === 'frame' && isInsideSafeFrame(nx, ny)) continue;

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
          const step = Math.max(property ? 7 : 8, baseUnit * (property ? 1.08 : 1.18));
          const maxR = (0.10 + intensity * 0.43) * minDim;
          const merging = effect.mergeDots ? clamp((intensity - 0.32) / 0.68, 0, 1) : 0;
          const maxDiameterRatio = property ? 0.92 : 0.97 + merging * 0.25;
          const feathered = property || effect.shape === 'halftone';
          const radiusRatio = property ? 0.50 : HALFTONE_RADIUS_RATIO;
          const fieldAngle = property ? (rng() - 0.5) * 1.3 : 0;
          const cos = Math.cos(fieldAngle);
          const sin = Math.sin(fieldAngle);
          const parcelAt = property ? createParcelMap(subSeed, intensity) : null;
          const featherWidth = Math.max(step * 3, maxR * (property ? 0.105 : 0.14));
          const cx = origin.x * W;
          const cy = origin.y * H;

          const span = maxR * (feathered ? 1.25 : 1.2);
          const startX = Math.max(free ? 0 : step, Math.floor((cx - span) / step) * step);
          const endX = Math.min(free ? W : W - step, cx + span);
          const startY = Math.max(free ? 0 : step, Math.floor((cy - span) / step) * step);
          const endY = Math.min(free ? H : H - step, cy + span);
          const smooth = value => {
            const t = clamp(value, 0, 1);
            return t * t * (3 - 2 * t);
          };

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;
              if (!passesZoneFilter(nx, ny, rng, false)) continue;

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
                let clearance = Math.min(x - W * 0.02, W * 0.98 - x, y - H * 0.02, H * 0.98 - y);
                if (state.zoneMode === 'frame') {
                  const dx = Math.max(SAFE_FRAME.left * W - x, x - SAFE_FRAME.right * W, 0);
                  const dy = Math.max(SAFE_FRAME.top * H - y, y - SAFE_FRAME.bottom * H, 0);
                  clearance = Math.min(clearance, Math.hypot(dx, dy));
                }
                const fringe = smooth(heat / (property ? 0.16 : 0.30)) * (free ? 1 : smooth(clearance / featherWidth));
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
          const gap = Math.max(5, baseUnit * 1.02);
          const segment = Math.min(gap * 2.50, reach * 0.34);
          const inset = free ? reach * 0.58 : 0;
          const cx = clamp(focal.x * W, inset, W - inset);
          const cy = clamp(focal.y * H, inset, H - inset);
          const valid = (x, y) => passesZoneFilter(x / W, y / H, rng, false);
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
              const x1 = cx + start * dx - v * dy;
              const y1 = cy + start * dy + v * dx;
              const x2 = cx + end * dx - v * dy;
              const y2 = cy + end * dy + v * dx;
              if (!valid(x1, y1) || !valid(x2, y2)) continue;
              const width = gap * (0.036 + Math.round(level * 6) / 6 * 0.92);
              lines.push({
                x1, y1, x2, y2, color, strokeWidth: width, opacity: 1, order: 1 - level
              });
            }
          }
        }

        else if (logic === 'isophones') {
          const origin = state.zoneMode === 'epicenter'
            ? { x: state.epicenter.x, y: state.epicenter.y }
            : focalPoint(0.3);

          const cx = origin.x * W;
          const cy = origin.y * H;
          const maxR = (0.20 + intensity * 0.36) * minDim;
          const stepY = Math.max(6, baseUnit * 0.75);
          const stepX = Math.max(18, baseUnit * 2.4);

          const startY = Math.max(stepY, Math.floor((cy - maxR) / stepY) * stepY);
          const endY   = Math.min(H - stepY, cy + maxR);
          const startX = Math.max(stepX, Math.floor((cx - maxR * 1.15) / stepX) * stepX);
          const endX   = Math.min(W - stepX, cx + maxR * 1.15);

          for (let y = startY; y <= endY; y += stepY) {
            for (let x = startX; x <= endX; x += stepX) {
              const nx = x / W, ny = y / H;
              if (state.zoneMode === 'frame' && isInsideSafeFrame(nx, ny)) continue;

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
          const available = Math.min(items.length, effect.maxDots);
          const count = Math.round(available * strength);
          const size = baseUnit * (effect.shape === 'job-circle' ? 1.23
            : poster && effect.id === 'flora-fauna' ? 1.86 : 1);
          // L'ordine dipende dal seed, quindi aumentare la quantità aggiunge
          // punti alla selezione esistente conservandone posizione e misura.
          const ranked = items.map((item, index) => ({ item, rank: hash2D(index, 0, subSeed) }));
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

      function ribbonIntersectsStrip(points, x, y, width, height) {
        const midX = x + width / 2;
        const midY = y + height / 2;
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
          const a = points[j];
          const b = points[i];
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

      function pointInPolygon(points, px, py) {
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
          const a = points[j];
          const b = points[i];
          if ((a.y > py) !== (b.y > py) &&
            a.x + (b.x - a.x) * (py - a.y) / (b.y - a.y) > px) inside = !inside;
        }
        return inside;
      }

      function createAquiferRibbon(points, bounds, pitch, contamination, seed) {
        const f = value => Number(value.toFixed(2));
        const outline = points.map((point, i) => `${i ? 'L' : 'M'}${f(point.x)} ${f(point.y)}`).join('') + 'Z';
        const block = pitch * 5.25;
        const strips = [];
        for (let row = Math.floor(bounds.top / pitch); row * pitch < bounds.bottom; row++) {
          // Mattoni orizzontali sfalsati, ritagliati dalla sagoma del tracciato.
          const shift = (((row % 4) + 4) % 4) * block * 0.24;
          const y = row * pitch + pitch * 0.10;
          for (let col = Math.floor((bounds.left - shift) / block); col * block + shift < bounds.right; col++) {
            const x = col * block + shift;
            const width = block * (0.63 + hash2D(col, row, seed + 5) * 0.29);
            const height = pitch * (0.72 + hash2D(col, row, seed + 11) * 0.14);
            if (!ribbonIntersectsStrip(points, x, y, width, height)) continue;
            // Ogni mattone è diviso in pixel: restano solo quelli con il centro
            // dentro il tracciato, così il bordo segue la linea a gradini.
            const rank = hash2D(col, row, seed + 23);
            const cells = Math.max(1, Math.round(width / pitch));
            const cell = width / cells;
            let run = null;
            const flush = () => {
              if (!run) return;
              const rx = x + run.from * cell;
              const rw = (run.to - run.from) * cell;
              strips.push({
                rank, x: rx, y, width: rw, height,
                d: `M${f(rx)} ${f(y)}H${f(rx + rw)}V${f(y + height)}H${f(rx)}Z`
              });
              run = null;
            };
            for (let c = 0; c < cells; c++) {
              if (pointInPolygon(points, x + (c + 0.5) * cell, y + height / 2)) {
                if (run) run.to = c + 1;
                else run = { from: c, to: c + 1 };
              } else {
                flush();
              }
            }
            flush();
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
        return { outline, bounds, clip: new Path2D(outline), bands };
      }

      function createAquiferBand(color, strips) {
        const d = strips.map(strip => strip.d).join('');
        return { color, strips, d, path: new Path2D(d) };
      }

      let logoOccupancy;
      function getLogoInkTest(logo, pad) {
        const resolution = 2;
        if (logoOccupancy?.scale !== logo.scale) {
          const surface = document.createElement('canvas');
          const w = Math.ceil(logo.width * resolution);
          const h = Math.ceil(logo.height * resolution);
          surface.width = w;
          surface.height = h;
          const ctx = surface.getContext('2d', { willReadFrequently: true });
          const scale = logo.scale * resolution;
          ctx.scale(scale, scale);
          for (const path of LOGO_PATHS) ctx.fill(path);

          // La somma cumulativa permette di verificare l'ingombro di un modulo
          // rispetto al disegno delle lettere con una sola lettura per angolo.
          const alpha = ctx.getImageData(0, 0, w, h).data;
          const stride = w + 1;
          const integral = new Uint32Array(stride * (h + 1));
          for (let y = 1; y <= h; y++) {
            let row = 0;
            for (let x = 1; x <= w; x++) {
              row += alpha[((y - 1) * w + x - 1) * 4 + 3] > 0 ? 1 : 0;
              integral[y * stride + x] = integral[(y - 1) * stride + x] + row;
            }
          }
          logoOccupancy = { scale: logo.scale, w, h, stride, integral };
        }
        const { w, h, stride, integral } = logoOccupancy;
        return (left, top, right, bottom) => {
          const x1 = Math.max(0, Math.floor((left - logo.x - pad) * resolution));
          const y1 = Math.max(0, Math.floor((top - logo.y - pad) * resolution));
          const x2 = Math.min(w, Math.ceil((right - logo.x + pad) * resolution));
          const y2 = Math.min(h, Math.ceil((bottom - logo.y + pad) * resolution));
          if (x1 >= x2 || y1 >= y2) return false;
          return integral[y2 * stride + x2] - integral[y1 * stride + x2]
            - integral[y2 * stride + x1] + integral[y1 * stride + x1] > 0;
        };
      }

      function clearLayerAroundLogo(layer, hitsLogo, keepWholeLines) {
        layer.items = layer.items.filter(item => {
          const { x, y, ribbon } = item;
          if (!ribbon) {
            const radius = Math.max(item.size, item.w || 0, item.h || 0) * 0.75;
            return !hitsLogo(x - radius, y - radius, x + radius, y + radius);
          }
          const bounds = ribbon.bounds;
          if (!hitsLogo(x + bounds.left, y + bounds.top, x + bounds.right, y + bounds.bottom)) return true;

          // Le falde mantengono il motivo e la sagoma. Si escludono le
          // singole bande che entrerebbero in contatto con una lettera.
          ribbon.bands = ribbon.bands.map(band => createAquiferBand(band.color,
            band.strips.filter(strip => !hitsLogo(x + strip.x, y + strip.y,
              x + strip.x + strip.width, y + strip.y + strip.height))
          )).filter(band => band.d);
          return ribbon.bands.length > 0;
        });

        layer.lines = layer.lines.flatMap(line => {
          const radius = line.strokeWidth / 2;
          const hits = (x1, y1, x2, y2) => hitsLogo(
            Math.min(x1, x2) - radius, Math.min(y1, y2) - radius,
            Math.max(x1, x2) + radius, Math.max(y1, y2) + radius
          );
          if (!hits(line.x1, line.y1, line.x2, line.y2)) return [line];
          const dx = line.x2 - line.x1, dy = line.y2 - line.y1;
          const count = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4));
          const fragments = [];
          let start = null;
          let interrupted = false;
          for (let i = 0; i < count; i++) {
            const x1 = line.x1 + dx * i / count;
            const y1 = line.y1 + dy * i / count;
            const x2 = line.x1 + dx * (i + 1) / count;
            const y2 = line.y1 + dy * (i + 1) / count;
            if (hits(x1, y1, x2, y2)) {
              if (keepWholeLines) return [];
              interrupted = true;
              if (start) fragments.push({ ...line, ...start, x2: x1, y2: y1 });
              start = null;
            } else if (!start) {
              start = { x1, y1 };
            }
          }
          if (!interrupted) return [line];
          if (start) fragments.push({ ...line, ...start });
          return fragments;
        });
      }

      function redistributeLayer(layer, effect, W, H) {
        const amount = (effect.distribution - DEFAULT_DISTRIBUTION) / DEFAULT_DISTRIBUTION;
        if (!amount || (!layer.items.length && !layer.lines.length)) return;

        // Sposta l'intero livello come un blocco, conservando misure e angoli.
        let left = W, right = 0, top = H, bottom = 0;
        function include(x, y, padding) {
          left = Math.min(left, x - padding);
          right = Math.max(right, x + padding);
          top = Math.min(top, y - padding);
          bottom = Math.max(bottom, y + padding);
        }
        for (const item of layer.items) {
          if (item.ribbon) {
            const bounds = item.ribbon.bounds;
            include(item.x + bounds.left, item.y + bounds.top, 0);
            include(item.x + bounds.right, item.y + bounds.bottom, 0);
          } else {
            include(item.x, item.y, Math.max(item.size, item.w || 0, item.h || 0) * 0.75);
          }
        }
        for (const line of layer.lines) {
          const padding = line.strokeWidth / 2;
          include(line.x1, line.y1, padding);
          include(line.x2, line.y2, padding);
        }
        const vertical = state.zoneMode === 'diagonal' ? -amount : amount;
        const dx = amount * Math.min(W * 0.218, Math.max(0, amount < 0 ? left : W - right));
        const dy = vertical * Math.min(H * 0.18, Math.max(0, vertical < 0 ? top : H - bottom));
        for (const item of layer.items) {
          item.x += dx;
          item.y += dy;
        }
        for (const line of layer.lines) {
          line.x1 += dx;
          line.y1 += dy;
          line.x2 += dx;
          line.y2 += dy;
        }
      }

      function usesHouseLayout(effect) {
        return effect.logic === 'settlements';
      }

      function applyBrushStrokes(layer, effect, W, H) {
        const key = usesHouseLayout(effect) ? HOUSE_LAYER_ID : effect.id;
        if (!state.brush.strokes.some(stroke => stroke.effectId === key)) return;
        const items = layer.items.slice();
        const lines = layer.lines.slice();
        const baseUnit = Math.min(W, H) / 90 * state.globalScale;

        state.brush.strokes.forEach((stroke, strokeIndex) => {
          if (stroke.effectId !== key) return;
          const rng = createRNG((strokeIndex + 1) * 4129);
          stroke.points.forEach((point, index) => {
            const x = point.x * W;
            const y = point.y * H;
            const order = index / Math.max(1, stroke.points.length) * 0.85;
            if (effect.id === 'rumore') {
              const sample = lines[Math.floor(rng() * lines.length)];
              const dx = sample ? (sample.x2 - sample.x1) / 2 : baseUnit;
              const dy = sample ? (sample.y2 - sample.y1) / 2 : -baseUnit * 0.60;
              layer.lines.push({
                x1: x - dx, y1: y - dy, x2: x + dx, y2: y + dy, color: effect.color,
                strokeWidth: sample?.strokeWidth || baseUnit * 0.26, opacity: 1, order
              });
              return;
            }

            if (effect.id === 'falda') {
              const before = stroke.points[Math.max(0, index - 1)];
              const after = stroke.points[Math.min(stroke.points.length - 1, index + 1)];
              const angle = Math.atan2((after.y - before.y) * H, (after.x - before.x) * W);
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              const w = baseUnit * 1.65;
              const h = baseUnit * 0.82;
              const points = [[-w, -h], [w, -h], [w, h], [-w, h]].map(([u, v]) => ({
                x: u * cos - v * sin, y: u * sin + v * cos
              }));
              const ribbon = createAquiferRibbon(points, getPointBounds(points), baseUnit * 0.42,
                effect.contamination, (strokeIndex + 1) * 2539 + index);
              layer.items.push({ shape: effect.shape, x, y, color: effect.color, size: w, order, ribbon });
              return;
            }
            const template = items[Math.floor(rng() * items.length)];
            const size = template?.size || baseUnit;
            const item = {
              shape: effect.shape, color: effect.color, w: size, h: size, rot: 0,
              ...template, x, y, size, order, crossArms: undefined
            };
            if ((effect.shape === 'house-fill' || effect.shape === 'house-outline') && item.house === undefined) {
              item.house = Math.floor(rng() * HOUSE_FOOTPRINTS.length);
            }
            if (effect.id === 'traffico') {
              const before = stroke.points[Math.max(0, index - 1)];
              const after = stroke.points[Math.min(stroke.points.length - 1, index + 1)];
              const tangent = Math.atan2((after.y - before.y) * H, (after.x - before.x) * W);
              item.rot = tangent + Math.PI / 2;
            }
            layer.items.push(item);
          });
        });
      }

      function rebuildGeometry() {
        const { width: W, height: H } = FORMATS[state.format];
        state.layers.clear();
        let total = 0;

        const renderOrderIds = [
          'calore', 'consumo-suolo', 'falda', 'rumore',
          'emissioni', 'valore-immobiliare', 'posti-di-lavoro',
          'flora-fauna', 'pressione-rete', 'bollette', 'traffico', 'tralicci'
        ];

        const logo = state.typography.enabled ? getTypographyLayout(W, H).logo : null;
        const hitsLogo = logo ? getLogoInkTest(logo, 3 + Math.min(W, H) * 0.0014) : null;
        const houses = state.effects.find(effect => effect.id === HOUSE_LAYER_ID);
        let houseLayout;
        renderOrderIds.forEach((id, idx) => {
          const eff = state.effects.find(e => e.id === id);
          if (!eff?.active) return;
          let layer;
          if (usesHouseLayout(eff)) {
            if (!houseLayout) {
              houseLayout = generateEffectLayer({ ...houses, active: true }, W, H, renderOrderIds.indexOf(HOUSE_LAYER_ID));
              redistributeLayer(houseLayout, houses, W, H);
            }
            layer = { items: houseLayout.items.map(item => ({ ...item, shape: eff.shape, color: eff.color })), lines: [] };
          } else {
            layer = generateEffectLayer(eff, W, H, idx);
            redistributeLayer(layer, eff, W, H);
          }
          applyBrushStrokes(layer, eff, W, H);
          if (hitsLogo) clearLayerAroundLogo(layer, hitsLogo, id === 'rumore');
          const glitchOrder = createRNG(hash2D(idx, 738, state.seed) * 0x100000000);
          for (const item of layer.items) item.glitchDelay = glitchOrder();
          for (const line of layer.lines) line.glitchDelay = glitchOrder();
          state.layers.set(id, layer);
          total += layer.items.length + layer.lines.length;
        });

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

        // Variazione propria di ogni elemento, stabile da un fotogramma all'altro.
        const vary = (k) => {
          const v = Math.sin((item.glitchDelay ?? item.order ?? 0) * 12.9898 * k + k * 78.233) * 43758.5453;
          return v - Math.floor(v);
        };

        const windowSize = style === 'plotter-glitch' ? 0.07 + vary(1) * 0.17 : 0.28;
        const localT = clamp((globalProgress * (1 + windowSize) - delay) / windowSize, 0, 1);

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

      function getTypographyLayout(W, H) {
        const { mode, position, subtitle } = state.typography;
        const unit = Math.min(W, H);
        const poster = state.zoneMode === 'poster';
        const pad = unit * (poster ? 0.042 : 0.065);
        const centered = position === 'center';
        const atTop = position === 'top-left';
        const tx = centered ? W / 2 : pad;
        const titleSize = Math.round(unit * 0.058);
        const subSize = Math.round(unit * (poster && mode === 'logo' ? 0.032 : 0.016));
        const anchor = centered ? 'middle' : 'start';
        const ty = centered ? H / 2 : atTop ? pad + titleSize : H - pad - subSize * 2.2;
        if (mode === 'text') {
          return {
            logo: null, title: { x: tx, y: ty, size: titleSize, anchor },
            subtitle: { x: tx, y: ty + subSize * 1.85, size: subSize, anchor }
          };
        }

        const ratio = CLOUD_EDITION_LOGO.width / CLOUD_EDITION_LOGO.height;
        const width = Math.min(W * (poster ? 0.62 : 0.47), H * 0.48 * ratio);
        const height = width / ratio;
        const aboveLogo = poster && !centered && !atTop;
        const subSpace = subtitle && !aboveLogo ? subSize * 1.9 : 0;
        const x = centered ? (W - width) / 2 : pad;
        const y = centered ? (H - height - subSpace) / 2
          : atTop ? pad : H - pad - height - subSpace;

        return {
          logo: { x, y, width, height, scale: width / CLOUD_EDITION_LOGO.width }, title: null,
          subtitle: aboveLogo
            ? { x: W * 0.40, y: y - unit * 0.058, size: subSize, anchor: 'start' }
            : { x: tx, y: y + height + subSize * 1.5, size: subSize, anchor }
        };
      }

      function getTypographyArtwork(ctx, W, H, bgInfo) {
        const typography = state.typography;
        if (!typography.enabled) return { logo: null, lines: [], reserved: [], effectClip: '' };

        const layout = getTypographyLayout(W, H);
        const lines = [];
        if (layout.title && typography.title.trim()) {
          lines.push({ ...layout.title, text: typography.title, font: TITLE_FONT, weight: 700, color: bgInfo.ink });
        }
        if (typography.subtitle.trim()) {
          const posterLogo = layout.logo && state.zoneMode === 'poster';
          lines.push({
            ...layout.subtitle, text: typography.subtitle,
            font: posterLogo ? TITLE_FONT : SUBTITLE_FONT,
            weight: posterLogo ? 700 : 500, color: posterLogo ? typography.logoColor : bgInfo.subInk
          });
        }

        const pad = Math.max(7, Math.min(W, H) * 0.014);
        const reserved = [];
        function reserve(left, top, right, bottom) {
          const box = {
            left: clamp(Math.floor(left - pad), 0, W), top: clamp(Math.floor(top - pad), 0, H),
            right: clamp(Math.ceil(right + pad), 0, W), bottom: clamp(Math.ceil(bottom + pad), 0, H)
          };
          if (box.left < box.right && box.top < box.bottom) reserved.push(box);
        }

        ctx.save();
        ctx.textBaseline = 'alphabetic';
        for (const line of lines) {
          const { x, y, size, anchor, font, weight, text } = line;
          ctx.textAlign = anchor === 'middle' ? 'center' : 'left';
          let left = x, right = x, ascent = size * 0.85, descent = size * 0.24;
          // L'export può usare il font di ripiego su un altro computer.
          const fallback = font === TITLE_FONT ? 'sans-serif' : 'monospace';
          for (const family of [font, fallback]) {
            ctx.font = `${weight} ${size}px ${family}`;
            const metrics = ctx.measureText(text);
            const offset = anchor === 'middle' ? metrics.width / 2 : 0;
            left = Math.min(left, x - Math.max(offset, metrics.actualBoundingBoxLeft || 0));
            right = Math.max(right, x + Math.max(metrics.width - offset, metrics.actualBoundingBoxRight || 0));
            ascent = Math.max(ascent, metrics.actualBoundingBoxAscent || 0);
            descent = Math.max(descent, metrics.actualBoundingBoxDescent || 0);
          }
          reserve(left, y - ascent, right, y + descent);
        }
        ctx.restore();

        // Un unico contorno di rispetto quando titolo e sottotitolo si toccano.
        if (reserved.length === 2) {
          const [a, b] = reserved;
          if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) {
            reserved.splice(0, 2, {
              left: Math.min(a.left, b.left), top: Math.min(a.top, b.top),
              right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom)
            });
          }
        }
        const effectClip = reserved.length ? `M0 0H${W}V${H}H0Z` +
          reserved.map(({ left, top, right, bottom }) => `M${left} ${top}H${right}V${bottom}H${left}Z`).join('') : '';
        return { logo: layout.logo, lines, reserved, effectClip };
      }

      function isMarkOutsideTypography(item, reserved) {
        if (!reserved.length || item.ribbon) return true;
        const radius = Math.max(item.size, item.w || 0, item.h || 0) * 0.75;
        return !reserved.some(box => item.x + radius > box.left && item.x - radius < box.right &&
          item.y + radius > box.top && item.y - radius < box.bottom);
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
          ctx.fillStyle = state.typography.logoColor;
          for (const path of LOGO_PATHS) ctx.fill(path);
          ctx.restore();
        }
        for (const line of artwork.lines) {
          ctx.textAlign = line.anchor === 'middle' ? 'center' : 'left';
          ctx.font = `${line.weight} ${line.size}px ${line.font}`;
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

        const bgInfo = BACKGROUNDS[state.background];
        if (bgInfo.hex) {
          ctx.fillStyle = bgInfo.hex;
          ctx.fillRect(0, 0, W, H);
        }

        const artwork = getTypographyArtwork(ctx, W, H, bgInfo);
        if (artwork.effectClip) {
          ctx.save();
          ctx.clip(new Path2D(artwork.effectClip), 'evenodd');
        }

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
            if (!isMarkOutsideTypography(item, artwork.reserved)) continue;
            if (item.ribbon) {
              drawRibbonCanvas(ctx, item, progress, W, H);
              continue;
            }
            const anim = computeItemAnim(item, progress, W, H);
            drawShapeCanvas(ctx, item, anim);
          }
        });

        // 3. Optional Typography Overlay
        if (artwork.effectClip) ctx.restore();
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
        const bgInfo = BACKGROUNDS[state.background];
        const r = n => Number(n.toFixed(2));
        const artwork = getTypographyArtwork(canvas.getContext('2d'), W, H, bgInfo);
        const clipAttribute = artwork.effectClip ? ' clip-path="url(#typography-clearance)"' : '';

        let parts = [];
        parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
        parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="hidden">`);
        parts.push(`  <!-- The Clouded Issue — Generative Identity Studio | Seed: ${state.seed} -->`);

        if (bgInfo.hex) {
          parts.push(`  <g id="background"><rect width="${W}" height="${H}" fill="${bgInfo.hex}"/></g>`);
        }

        if (artwork.effectClip) {
          parts.push(`  <defs><clipPath id="typography-clearance"><path clip-rule="evenodd" d="${artwork.effectClip}"/></clipPath></defs>`);
        }

        state.layers.forEach((layer, effectId) => {
          const eff = state.effects.find(e => e.id === effectId);
          if (layer.items.length === 0 && layer.lines.length === 0) return;
          parts.push(`  <g id="${effectId}" data-name="${eff.name}"${clipAttribute}>`);

          // Connector lines
          for (const ln of layer.lines) {
            parts.push(`    <line x1="${r(ln.x1)}" y1="${r(ln.y1)}" x2="${r(ln.x2)}" y2="${r(ln.y2)}" stroke="${ln.color}" stroke-width="${r(ln.strokeWidth)}" stroke-opacity="${ln.opacity ?? 0.85}"/>`);
          }

          // Micro-geometries
          for (const [itemIndex, item] of layer.items.entries()) {
            if (!isMarkOutsideTypography(item, artwork.reserved)) continue;
            const s = item.size;
            const rotDeg = item.rot ? r(item.rot * 180 / Math.PI) : 0;
            const transform = `translate(${r(item.x)},${r(item.y)})${rotDeg ? ` rotate(${rotDeg})` : ''}`;
            const tf = ` transform="${transform}"`;
            if (item.ribbon) {
              const ribbon = item.ribbon;
              parts.push(`    <g${tf}>`);
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
          const esc = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          parts.push('  <g id="typography-overlay">');
          if (artwork.logo) {
            const { x, y, scale } = artwork.logo;
            parts.push(`    <g id="poster-logo" role="img" aria-label="The Clouded Issue" fill="${state.typography.logoColor}" transform="translate(${r(x)} ${r(y)}) scale(${scale.toFixed(6)})">`);
            for (const path of CLOUD_EDITION_LOGO.paths) parts.push(`      <path d="${path}"/>`);
            parts.push('    </g>');
          }
          for (const {x, y, anchor, font, weight, size, color, text} of artwork.lines) {
            parts.push(`    <text x="${r(x)}" y="${r(y)}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${color}">${esc(text)}</text>`);
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

      function exportSVG() {
        try {
          const svgStr = buildSVGString();
          const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
          downloadBlob(blob, `the-clouded-issue-seed-${state.seed}.svg`);
          showToast('SVG a livelli esportato con successo');
        } catch (err) {
          showToast('Errore durante l\'esportazione SVG');
        }
      }

      function exportPNG() {
        try {
          const exportCanvas = document.createElement('canvas');
          renderCanvas(state.anim.progress, exportCanvas);
          exportCanvas.toBlob(blob => {
            if (!blob) return showToast('Errore esportazione PNG');
            downloadBlob(blob, `the-clouded-issue-seed-${state.seed}.png`);
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
            downloadBlob(blob, `the-clouded-issue-motion-seed-${state.seed}.webm`);
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
                  <input type="range" min="10" max="100" value="${eff.intensity}" data-id="${eff.id}" data-parameter="intensity" title="${usesHouseLayout(eff) ? 'Condivisa da Pressione sulle case e Bollette' : intensityHint}" class="tech-slider eff-intensity flex-1 min-w-0" />
                  <span class="font-mono-tech text-[10px] text-[#161616] w-7 text-right eff-int-val">${eff.intensity}</span>
                </label>
                <label class="flex items-center gap-2">
                  <span class="font-mono-tech text-[9px] uppercase text-[#666662] w-20 shrink-0">Distribuzione</span>
                  <input type="range" min="0" max="100" value="${eff.distribution}" data-id="${eff.id}" data-parameter="distribution" aria-label="Distribuzione di ${eff.name}" title="${usesHouseLayout(eff) ? 'Condivisa da Pressione sulle case e Bollette. ' : ''}Sposta l’effetto sul foglio. 50 ripristina la distribuzione di partenza." class="tech-slider eff-distribution flex-1 min-w-0" />
                  <span class="font-mono-tech text-[10px] text-[#161616] w-7 text-right">${eff.distribution}</span>
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
            rebuildGeometry();
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

      function updateSeedDisplays() {
        document.getElementById('headerSeedDisplay').textContent = state.seed;
        document.getElementById('seedInput').value = state.seed;
      }

      function rollRandomSeed() {
        state.seed = Math.floor(10000 + Math.random() * 89999);
        updateSeedDisplays();
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

        state.seed = Math.floor(10000 + Math.random() * 89999);
        updateSeedDisplays();
        renderEffectsPanel();
        rebuildGeometry();
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

      function bindBrushEvents() {
        const frame = document.getElementById('sheetFrame');
        const toggle = document.getElementById('brushToggle');
        const controls = document.getElementById('brushControls');
        const select = document.getElementById('brushEffect');
        const undo = document.getElementById('brushUndo');
        const brush = state.brush;
        let pointerId = null;
        let stroke;
        let pendingFrame = 0;

        for (const effect of state.effects) {
          select.add(new Option(effect.name, effect.id));
        }
        select.value = brush.effectId;

        function flushStroke() {
          if (pendingFrame) cancelAnimationFrame(pendingFrame);
          pendingFrame = 0;
          rebuildGeometry();
        }

        function schedulePreview() {
          if (pendingFrame) return;
          pendingFrame = requestAnimationFrame(() => {
            pendingFrame = 0;
            rebuildGeometry();
          });
        }

        function pointAt(event) {
          const rect = frame.getBoundingClientRect();
          return {
            x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
            y: clamp((event.clientY - rect.top) / rect.height, 0, 1)
          };
        }

        function extendStroke(event, done = false) {
          const point = pointAt(event);
          const last = stroke.points[stroke.points.length - 1];
          const { width, height } = FORMATS[state.format];
          const dx = point.x - last.x;
          const dy = point.y - last.y;
          const distance = Math.hypot(dx * width, dy * height);
          if (!distance) return;
          const spacing = Math.max(5, Math.min(width, height) / 85 * state.globalScale);
          for (let step = spacing; step <= distance; step += spacing) {
            stroke.points.push({ x: last.x + dx * step / distance, y: last.y + dy * step / distance });
          }
          if (done && distance % spacing > spacing * 0.48) stroke.points.push(point);
          if (stroke.points[stroke.points.length - 1] !== last) schedulePreview();
        }

        toggle.addEventListener('click', () => {
          brush.enabled = !brush.enabled;
          toggle.setAttribute('aria-pressed', String(brush.enabled));
          controls.hidden = !brush.enabled;
          frame.style.touchAction = brush.enabled ? 'none' : '';
          updateStageHint();
        });

        select.addEventListener('change', () => { brush.effectId = select.value; });
        undo.addEventListener('click', () => {
          brush.strokes.pop();
          undo.disabled = brush.strokes.length === 0;
          flushStroke();
        });

        frame.addEventListener('pointerdown', event => {
          if (!brush.enabled || pointerId !== null || event.button !== 0) return;
          event.preventDefault();
          pointerId = event.pointerId;
          frame.setPointerCapture(pointerId);
          const effect = state.effects.find(effect => effect.id === brush.effectId);
          if (!effect.active) {
            effect.active = true;
            renderEffectsPanel();
          }
          stroke = { effectId: usesHouseLayout(effect) ? HOUSE_LAYER_ID : effect.id, points: [pointAt(event)] };
          brush.strokes.push(stroke);
          undo.disabled = false;
          state.anim.mode = 'static';
          state.anim.progress = 1;
          updateAnimStatusUI('MANUALE');
          syncTimelineUI();
          schedulePreview();
        });
        frame.addEventListener('pointermove', event => {
          if (event.pointerId === pointerId) extendStroke(event);
        });
        function finishStroke(event) {
          if (event.pointerId !== pointerId) return;
          if (event.type === 'pointerup') extendStroke(event, true);
          pointerId = null;
          flushStroke();
        }
        frame.addEventListener('pointerup', finishStroke);
        frame.addEventListener('pointercancel', finishStroke);
        frame.addEventListener('lostpointercapture', finishStroke);
      }

      function updateStageHint() {
        const hint = document.getElementById('epicenterHint');
        hint.textContent = state.brush.enabled ? 'Trascina sul foglio per disegnare'
          : state.zoneMode === 'epicenter' ? "Clicca sul foglio per spostare l'epicentro"
          : state.zoneMode === 'poster' ? 'Composizione poster'
          : '';
      }

      function setZoneMode(mode) {
        state.zoneMode = mode;
        document.getElementById('zoneModeSelect').value = mode;
        document.getElementById('zoneModeDesc').textContent = ZONE_DESCRIPTIONS[mode];
        updateStageHint();
      }

      function updateTypographyControls() {
        const { enabled, mode, position, logoColor } = state.typography;
        document.getElementById('typoToggle').checked = enabled;
        document.getElementById('typoModeSelect').value = mode;
        document.getElementById('logoColorInput').value = logoColor;
        document.getElementById('typoControls').classList.toggle('opacity-40', !enabled);
        document.getElementById('logoColorControls').hidden = mode !== 'logo';
        document.getElementById('typoTitleControls').hidden = mode !== 'text';
        document.getElementById('typoControls').toggleAttribute('inert', !enabled);
        document.querySelectorAll('.typo-pos-btn').forEach(btn => {
          const active = btn.dataset.typoPos === position;
          btn.setAttribute('aria-pressed', String(active));
          btn.className = active
            ? 'typo-pos-btn py-1 text-[10px] font-mono-tech uppercase rounded border border-[#161616] bg-[#161616] text-white cursor-pointer'
            : 'typo-pos-btn py-1 text-[10px] font-mono-tech uppercase rounded border border-[#D6D6D2] bg-white text-[#161616] hover:border-[#161616] cursor-pointer';
        });
      }

      function applyPosterPreset() {
        const values = new Map([['emissioni', 82], ['flora-fauna', 42], ['bollette', 49]]);
        for (const effect of state.effects) {
          effect.active = values.has(effect.id);
          if (effect.active) {
            effect.logic = effect.defaultLogic;
            effect.intensity = values.get(effect.id);
            effect.distribution = DEFAULT_DISTRIBUTION;
          }
          if (usesHouseLayout(effect)) {
            effect.intensity = values.get('bollette');
            effect.distribution = DEFAULT_DISTRIBUTION;
          }
        }
        state.typography.enabled = true;
        state.typography.mode = 'logo';
        state.typography.position = 'bottom-left';
        setZoneMode('poster');
        updateTypographyControls();
        renderEffectsPanel();
        rebuildGeometry();
      }


      function bindEvents() {
        bindBrushEvents();
        // Top randomize & mix
        document.getElementById('btnRandomizeTop').addEventListener('click', () => {
          rollRandomSeed();
          showToast(`Nuova distribuzione generata (Seed ${state.seed})`);
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

        // Composition Zone Mode
        document.getElementById('zoneModeSelect').addEventListener('change', (e) => {
          setZoneMode(e.target.value);
          rebuildGeometry();
        });
        document.getElementById('btnPosterPreset').addEventListener('click', applyPosterPreset);

        // Global Scale
        document.getElementById('globalScaleSlider').addEventListener('input', (e) => {
          state.globalScale = Number(e.target.value);
          document.getElementById('globalScaleVal').textContent = `${state.globalScale.toFixed(2)}×`;
          rebuildGeometry();
        });

        // Seed manual apply
        document.getElementById('btnApplySeed').addEventListener('click', () => {
          const val = parseInt(document.getElementById('seedInput').value, 10);
          if (!isNaN(val)) {
            state.seed = Math.abs(val) % 999999;
            updateSeedDisplays();
            rebuildGeometry();
          }
        });

        // Typography Overlay controls
        document.getElementById('typoToggle').addEventListener('change', (e) => {
          state.typography.enabled = e.target.checked;
          updateTypographyControls();
          rebuildGeometry();
        });
        document.getElementById('typoModeSelect').addEventListener('change', (e) => {
          state.typography.mode = e.target.value;
          updateTypographyControls();
          rebuildGeometry();
        });
        document.getElementById('logoColorInput').addEventListener('input', (e) => {
          state.typography.logoColor = e.target.value;
          renderCanvas(state.anim.progress);
        });

        document.getElementById('typoTitleInput').addEventListener('input', (e) => {
          state.typography.title = e.target.value;
          renderCanvas(state.anim.progress);
        });
        document.getElementById('typoSubInput').addEventListener('input', (e) => {
          state.typography.subtitle = e.target.value;
          rebuildGeometry();
        });
        document.querySelectorAll('.typo-pos-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            state.typography.position = btn.dataset.typoPos;
            updateTypographyControls();
            rebuildGeometry();
          });
        });

        // Interactive Epicenter Click on Sheet
        let markerTimer = null;
        document.getElementById('sheetFrame').addEventListener('click', (e) => {
          if (state.brush.enabled || state.zoneMode !== 'epicenter') return;
          const rect = e.currentTarget.getBoundingClientRect();
          const nx = clamp((e.clientX - rect.left) / rect.width, 0.08, 0.92);
          const ny = clamp((e.clientY - rect.top) / rect.height, 0.08, 0.92);
          state.epicenter = { x: nx, y: ny };

          const marker = document.getElementById('epicenterMarker');
          marker.style.left = `${nx * 100}%`;
          marker.style.top = `${ny * 100}%`;
          marker.classList.remove('opacity-0');
          clearTimeout(markerTimer);
          markerTimer = setTimeout(() => marker.classList.add('opacity-0'), 1100);

          rebuildGeometry();
        });

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
        updateTypographyControls();
        updateSeedDisplays();
        setZoneMode(state.zoneMode);
        fitSheetToStage();
        rebuildGeometry();
        requestAnimationFrame(animTick);
      });
    })();
