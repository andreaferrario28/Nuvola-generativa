    (function () {
      'use strict';

      /* ======================================================================
         1. DEFINITIONS: 12 EFFECTS, CATEGORIES, SPATIAL LOGICS, FORMATS
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

      // The 12 micro-geometries with exact palette colors and default behaviors
      const EFFECTS_CONFIG = [
        // ECONOMIA
        {
          id: 'valore-immobiliare',
          name: 'Valore immobiliare',
          category: 'economia',
          color: '#4D7CFE',
          shape: 'bar',
          defaultLogic: 'urban-blocks',
          assetPath: 'valore immobiliare.svg',
          active: true,
          intensity: 62,
          iconSvg: '<rect x="2" y="6" width="2.5" height="8" fill="#4D7CFE"/><rect x="6.5" y="2" width="2.5" height="12" fill="#4D7CFE"/><rect x="11" y="4.5" width="2.5" height="9.5" fill="#4D7CFE"/>'
        },
        {
          id: 'posti-di-lavoro',
          name: 'Posti di lavoro',
          category: 'economia',
          color: '#0095B6',
          shape: 'capsule',
          defaultLogic: 'modular-grid',
          assetPath: 'posti di lavoro.svg',
          active: false,
          intensity: 55,
          iconSvg: '<circle cx="8" cy="8" r="5" fill="none" stroke="#0095B6" stroke-width="2"/>'
        },
        {
          id: 'traffico',
          name: 'Traffico',
          category: 'economia',
          color: '#004E64',
          shape: 'triangle',
          defaultLogic: 'flow-paths',
          assetPath: 'traffico.svg',
          active: true,
          intensity: 65,
          iconSvg: '<polygon points="8,2 14,13.5 2,13.5" fill="#004E64"/>'
        },

        // AMBIENTE
        {
          id: 'greenfield',
          name: 'Greenfield',
          category: 'ambiente',
          color: '#62C37B',
          shape: 'cross-dot',
          defaultLogic: 'tessellation',
          assetPath: 'campi.svg',
          active: false,
          intensity: 60,
          iconSvg: '<path d="M4 2V6M2 4H6M12 2V6M10 4H14M4 10V14M2 12H6M12 10V14M10 12H14" stroke="#62C37B" stroke-width="1.6"/>'
        },
        {
          id: 'flora-fauna',
          name: 'Flora e fauna',
          category: 'ambiente',
          color: '#008A4E',
          shape: 'hollow-circle',
          defaultLogic: 'organic-scatter',
          assetPath: 'fauna.svg',
          active: false,
          intensity: 55,
          iconSvg: '<circle cx="8" cy="8" r="5" fill="none" stroke="#008A4E" stroke-width="2"/>'
        },
        {
          id: 'brownfield',
          name: 'Brownfield',
          category: 'ambiente',
          color: '#634142',
          shape: 'cross-dot',
          defaultLogic: 'tessellation',
          assetPath: 'brownfield.svg',
          active: false,
          intensity: 60,
          iconSvg: '<polygon points="8,1.5 14.5,8 8,14.5 1.5,8" fill="#634142"/>'
        },

        // ENERGIA E SERVIZI
        {
          id: 'tralicci',
          name: 'Tralicci',
          category: 'energia',
          color: '#E3FF1A',
          shape: 'plus',
          defaultLogic: 'network-lines',
          assetPath: 'elettricità.svg',
          active: true,
          intensity: 68,
          iconSvg: '<line x1="2" y1="8" x2="14" y2="8" stroke="#161616" stroke-width="1" stroke-opacity="0.35"/><path d="M8 2.5V13.5M2.5 8H13.5" stroke="#B7CE00" stroke-width="2.4"/>'
        },
        {
          id: 'pressione-rete',
          name: 'Pressione sulle case',
          category: 'energia',
          color: '#F2D62B',
          shape: 'zigzag',
          defaultLogic: 'tension-arcs',
          assetPath: 'pressione sulle case.svg',
          mapAsset: true,
          randomExcluded: true,
          active: true,
          intensity: 60,
          iconSvg: '<polyline points="1.5,11 5.5,4.5 9.5,11 14,4.5" fill="none" stroke="#D9BA00" stroke-width="2" stroke-linecap="square"/>'
        },
        {
          id: 'bollette',
          name: 'Bollette',
          category: 'energia',
          color: '#D9A700',
          shape: 'hollow-rect',
          defaultLogic: 'accumulation',
          assetPath: 'bollette.svg',
          mapAsset: true,
          randomExcluded: true,
          active: true,
          intensity: 58,
          iconSvg: '<rect x="3.5" y="2" width="9" height="12" fill="none" stroke="#D9A700" stroke-width="2"/>'
        },

        // SALUTE E VIVIBILITÀ
        {
          id: 'emissioni',
          name: 'Emissioni',
          category: 'salute',
          color: '#FFA6EA',
          shape: 'square',
          defaultLogic: 'plume',
          assetPath: 'emissioni.svg',
          active: true,
          intensity: 72,
          iconSvg: '<rect x="2.5" y="2.5" width="11" height="11" fill="#FFA6EA"/>'
        },
        {
          id: 'calore',
          name: 'Calore',
          category: 'salute',
          color: '#FF5D38',
          shape: 'halftone',
          defaultLogic: 'heat-island',
          assetPath: 'calore.svg',
          active: true,
          intensity: 76,
          iconSvg: '<circle cx="5" cy="5" r="2.2" fill="#FF5D38"/><circle cx="11" cy="5" r="1.6" fill="#FF5D38"/><circle cx="5" cy="11" r="1.6" fill="#FF5D38"/><circle cx="11" cy="11" r="2.2" fill="#FF5D38"/>'
        },
        {
          id: 'rumore',
          name: 'Rumore',
          category: 'salute',
          color: '#9B236E',
          shape: 'wave',
          defaultLogic: 'isophones',
          assetPath: 'rumore.svg',
          active: false,
          intensity: 62,
          iconSvg: '<line x1="2" y1="4" x2="14" y2="4" stroke="#9B236E" stroke-width="1.8"/><line x1="2" y1="8" x2="11" y2="8" stroke="#9B236E" stroke-width="1.8"/><line x1="2" y1="12" x2="14" y2="12" stroke="#9B236E" stroke-width="1.8"/>'
        }
      ];

      const FORMATS = {
        a4:     { width: 900,  height: 1200, label: '900 × 1200 px (3:4)' },
        square: { width: 1080, height: 1080, label: '1080 × 1080 px (1:1)' },
        story:  { width: 720,  height: 1280, label: '720 × 1280 px (9:16)' },
        banner: { width: 1280, height: 720,  label: '1280 × 720 px (16:9)' }
      };

      const BACKGROUNDS = {
        paper:       { hex: '#F1F1EF', ink: '#161616', subInk: '#555550' },
        white:       { hex: '#FFFFFF', ink: '#161616', subInk: '#555550' },
        dark:        { hex: '#0E0E10', ink: '#F1F1EF', subInk: '#A0A09A' },
        transparent: { hex: null,      ink: '#161616', subInk: '#555550' }
      };

      const ZONE_DESCRIPTIONS = {
        free:      'Diffusione libera su tutta la superficie del foglio secondo le logiche di ciascun parametro.',
        epicenter: 'Ancora pennacchi, calore e onde attorno all\'epicentro (clicca sul foglio per spostarlo).',
        frame:     'Mantiene libera un\'area centrale pulita per ospitare titoli, testi o elementi grafici.',
        diagonal:  'Concentra le micro-geometrie lungo un asse dinamico diagonale attraverso il foglio.'
      };

      /* ======================================================================
         2. APPLICATION STATE
         ====================================================================== */

      const state = {
        seed: 48291,
        format: 'a4',
        background: 'paper',
        zoneMode: 'epicenter',
        epicenter: { x: 0.46, y: 0.48 }, // normalized 0..1
        globalScale: 1.0,
        typography: {
          enabled: true,
          title: 'THE CLOUDED ISSUE',
          subtitle: 'EDIZIONE 0 /// LACCHIARELLA',
          position: 'bottom-left'
        },
        effects: EFFECTS_CONFIG.map(e => ({ ...e, logic: e.defaultLogic })),
        // Generated layers: Map<effectId, { items: [], lines: [] }>
        layers: new Map(),
        fixedAssets: [],
        totalPrimitives: 0,
        // Motion engine
        anim: {
          mode: 'static',     // 'static' | 'in' | 'out' | 'loop'
          style: 'param-logic',
          speed: 1.0,
          progress: 1.0,      // 0..1
          phase: 'hold',      // for loop: 'in' | 'hold' | 'out' | 'pause'
          phaseTimer: 0,
          lastTime: 0,
          isRecording: false
        }
      };

      const effectAssetCache = new Map();

      function preloadEffectAssets() {
        EFFECTS_CONFIG.forEach(effect => {
          if (!effect.assetPath) return;
          const src = `Assets/Effetti/${encodeURI(effect.assetPath)}`;
          const image = new Image();
          image.decoding = 'async';
          image.onload = () => {
            effectAssetCache.set(effect.assetPath, image);
            renderCanvas(state.anim.progress);
          };
          image.onerror = () => console.error(`Effetto SVG non trovato: ${effect.assetPath}`);
          image.src = src;
        });
      }

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
        return nx > 0.22 && nx < 0.78 && ny > 0.25 && ny < 0.75;
      }

      function diagonalWeight(nx, ny) {
        // Distance to diagonal from bottom-left (0,1) to top-right (1,0)
        const dist = Math.abs((nx + ny) - 1.0) / Math.SQRT2;
        return Math.max(0, 1 - dist * 2.4);
      }

      function passesZoneFilter(nx, ny, rng, allowSoft = true) {
        if (nx < 0.02 || nx > 0.98 || ny < 0.02 || ny > 0.98) return false;
        if (state.zoneMode === 'frame') {
          if (isInsideSafeFrame(nx, ny)) return false;
        } else if (state.zoneMode === 'diagonal') {
          const w = diagonalWeight(nx, ny);
          if (allowSoft ? rng() > (w * 0.95 + 0.08) : w < 0.32) return false;
        }
        return true;
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
        return {
          x: 0.18 + rng() * 0.64,
          y: 0.18 + rng() * 0.64
        };
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      /* ======================================================================
         5. SPATIAL GENERATORS (12 DISTINCT ALGORITHMIC LOGICS)
         ====================================================================== */

      function generateEffectLayer(effect, W, H, effectIndex) {
        const items = [];
        const lines = [];
        if (effect.mapAsset) {
          return { items, lines };
        }
        const intensity = effect.intensity / 100; // 0..1
        if (!effect.active || intensity <= 0.01) {
          if (effect.assetPath) {
            items.forEach(item => {
              item.shape = 'asset';
              item.assetPath = effect.assetPath;
            });
          }

          return { items, lines };
        }

        const subSeed = (state.seed * 31 + (effectIndex + 1) * 7919) >>> 0;
        const rng = createRNG(subSeed);
        const minDim = Math.min(W, H);
        const baseUnit = (minDim / 90) * state.globalScale;
        const logic = effect.logic;

        // ------------------------------------------------------------------
        // 1. URBAN-BLOCKS (Valore immobiliare: clustered vertical bars)
        // ------------------------------------------------------------------
        if (logic === 'urban-blocks') {
          const numClusters = Math.max(1, Math.round(1 + intensity * 3.5));
          for (let c = 0; c < numClusters; c++) {
            const center = getFocalPoint(rng, 0.45);
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
                const lx = (k - cols / 2) * spacingX;
                const ly = (r - rows / 2) * spacingY;
                const x = center.x * W + lx * cosR - ly * sinR;
                const y = center.y * H + lx * sinR + ly * cosR;
                const nx = x / W, ny = y / H;
                if (!passesZoneFilter(nx, ny, rng, false)) continue;

                const barH = baseUnit * (1.2 + fbm2D(k * 0.35, r * 0.8, subSeed + c) * 3.6);
                const barW = baseUnit * 0.62;
                const order = clamp((c / numClusters) * 0.4 + (k / cols) * 0.45 + (r / rows) * 0.15, 0, 1);

                items.push({
                  shape: effect.shape,
                  x, y,
                  size: baseUnit,
                  w: barW,
                  h: barH,
                  rot: rotBlock,
                  color: effect.color,
                  order
                });
              }
            }
          }
        }

        // ------------------------------------------------------------------
        // 2. MODULAR-GRID (Posti di lavoro: structured modular capsules)
        // ------------------------------------------------------------------
        else if (logic === 'modular-grid') {
          const stepX = baseUnit * 3.1;
          const stepY = baseUnit * 1.9;
          const numZones = Math.max(1, Math.round(1 + intensity * 2.5));
          const anchors = Array.from({ length: numZones }, () => getFocalPoint(rng, 0.5));

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
                color: effect.color,
                order
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 3. FLOW-PATHS (Traffico: triangles aligned along curved trajectories)
        // ------------------------------------------------------------------
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
            for (let i = 0; i < steps; i++) {
              const t = i / (steps - 1);
              const pt = cubicBezier(p0, p1, p2, p3, t);
              const tang = cubicBezierTangent(p0, p1, p2, p3, t);
              const nx = pt.x / W, ny = pt.y / H;
              if (state.zoneMode === 'frame' && isInsideSafeFrame(nx, ny)) continue;
              if (nx < 0.02 || nx > 0.98 || ny < 0.02 || ny > 0.98) continue;

              const angle = Math.atan2(tang.y, tang.x) + Math.PI / 2;
              items.push({
                shape: effect.shape,
                x: pt.x,
                y: pt.y,
                size: baseUnit * (0.82 + rng() * 0.25),
                w: baseUnit,
                h: baseUnit,
                rot: angle,
                color: effect.color,
                order: t
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 4. TESSELLATION (Greenfield: organic polygon filled with ortho grid)
        // ------------------------------------------------------------------
        else if (logic === 'tessellation') {
          const anchor = getFocalPoint(rng, 0.35);
          const isCrossGrid = effect.assetPath === 'campi.svg' || effect.assetPath === 'brownfield.svg';
          const step = isCrossGrid ? baseUnit * 1.15 : baseUnit * 1.45;
          const radX = (0.16 + intensity * 0.24) * W;
          const radY = (0.16 + intensity * 0.24) * H;
          const cx = anchor.x * W;
          const cy = anchor.y * H;

          const startX = Math.max(step, Math.floor((cx - radX * 1.3) / step) * step);
          const endX   = Math.min(W - step, cx + radX * 1.3);
          const startY = Math.max(step, Math.floor((cy - radY * 1.3) / step) * step);
          const endY   = Math.min(H - step, cy + radY * 1.3);

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;
              if (!passesZoneFilter(nx, ny, rng, false)) continue;

              const dx = (x - cx) / radX;
              const dy = (y - cy) / radY;
              const nVal = fbm2D(nx * 5.5, ny * 5.5, subSeed);
              const dist = Math.hypot(dx, dy) + (nVal - 0.5) * 0.75;
              if (dist > 0.95) continue;

              const order = clamp(((x - startX) / (endX - startX + 1)) * 0.5 + ((y - startY) / (endY - startY + 1)) * 0.5, 0, 1);
              items.push({
                shape: effect.shape,
                x, y,
                size: isCrossGrid ? step : baseUnit * 0.72,
                w: isCrossGrid ? step : baseUnit * 0.72,
                h: isCrossGrid ? step : baseUnit * 0.72,
                rot: 0,
                color: effect.color,
                order
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 5. ORGANIC-SCATTER (Flora e fauna: avoids epicenter, clusters near edges)
        // ------------------------------------------------------------------
        else if (logic === 'organic-scatter') {
          const count = Math.round(25 + intensity * 130);
          const ex = state.epicenter.x;
          const ey = state.epicenter.y;
          let attempts = 0;

          while (items.length < count && attempts < count * 8) {
            attempts++;
            const nx = 0.04 + rng() * 0.92;
            const ny = 0.04 + rng() * 0.92;
            if (!passesZoneFilter(nx, ny, rng, true)) continue;

            // Repulsion from epicenter
            const dCenter = Math.hypot(nx - ex, ny - ey);
            if (dCenter < 0.22 && rng() < 0.88) continue;

            // Prefer clustered organic patches via fbm
            const cluster = fbm2D(nx * 4.5, ny * 4.5, subSeed);
            if (cluster < 0.42 && rng() < 0.75) continue;

            const order = clamp(1 - dCenter * 1.15, 0, 1);
            items.push({
              shape: effect.shape,
              x: nx * W,
              y: ny * H,
              size: baseUnit * (0.65 + rng() * 0.65),
              w: baseUnit,
              h: baseUnit,
              rot: 0,
              color: effect.color,
              order
            });
          }
        }

        // ------------------------------------------------------------------
        // 6. DENSE-PATCH (Brownfield: compact irregular high-density patch)
        // ------------------------------------------------------------------
        else if (logic === 'dense-patch') {
          const anchor = getFocalPoint(rng, 0.4);
          const step = baseUnit * 1.15;
          const rad = (0.13 + intensity * 0.19) * minDim;
          const cx = anchor.x * W;
          const cy = anchor.y * H;

          const startX = Math.max(step, Math.floor((cx - rad * 1.35) / step) * step);
          const endX   = Math.min(W - step, cx + rad * 1.35);
          const startY = Math.max(step, Math.floor((cy - rad * 1.35) / step) * step);
          const endY   = Math.min(H - step, cy + rad * 1.35);

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
                color: effect.color,
                order
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 7. NETWORK-LINES (Tralicci: straight transmission lines + sharp '+' nodes)
        // ------------------------------------------------------------------
        else if (logic === 'network-lines') {
          const numLines = Math.max(1, Math.round(1 + intensity * 4));
          for (let l = 0; l < numLines; l++) {
            let x1, y1, x2, y2;
            if (state.zoneMode === 'diagonal') {
              const off = (rng() - 0.5) * 0.35;
              x1 = (0.03 + off) * W; y1 = (0.97 + off) * H;
              x2 = (0.97 + off) * W; y2 = (0.03 + off) * H;
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
            let prev = null;
            for (let i = 0; i <= nodes; i++) {
              const t = i / nodes;
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
                  color: effect.color,
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
                color: effect.color,
                order: t
              });
              prev = { x, y };
            }
          }
        }

        // ------------------------------------------------------------------
        // 8. TENSION-ARCS (Pressione sulla rete: radiating/bridging zig-zag bands)
        // ------------------------------------------------------------------
        else if (logic === 'tension-arcs') {
          const anchor = getFocalPoint(rng, 0.2);
          const numArcs = Math.max(2, Math.round(2 + intensity * 6));
          for (let a = 0; a < numArcs; a++) {
            const target = getFocalPoint(rng, 0.75);
            const x1 = anchor.x * W, y1 = anchor.y * H;
            const x2 = target.x * W, y2 = target.y * H;
            const mx = (x1 + x2) / 2 + (rng() - 0.5) * minDim * 0.25;
            const my = (y1 + y2) / 2 + (rng() - 0.5) * minDim * 0.25;

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
                color: effect.color,
                order: t
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 9. ACCUMULATION (Bollette: hollow rectangles growing toward a corner/zone)
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
              color: effect.color,
              order: 1 - distNorm
            });
          }
        }

        // ------------------------------------------------------------------
        // 10. PLUME (Emissioni: pixelated cloud dispersing downwind from epicenter)
        // ------------------------------------------------------------------
        else if (logic === 'plume') {
          const origin = state.zoneMode === 'epicenter'
            ? { x: state.epicenter.x, y: state.epicenter.y }
            : getFocalPoint(rng, 0.25);

          // Wind direction angle
          const windAngle = state.zoneMode === 'diagonal'
            ? -Math.PI / 4
            : (-Math.PI * 0.75 + rng() * Math.PI * 1.5);
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
                color: effect.color,
                order: progressU
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 11. HEAT-ISLAND (Calore: dense halftone radial thermal patch)
        // ------------------------------------------------------------------
        else if (logic === 'heat-island') {
          const origin = state.zoneMode === 'epicenter'
            ? { x: state.epicenter.x, y: state.epicenter.y }
            : getFocalPoint(rng, 0.3);

          const step = Math.max(8, baseUnit * 1.18);
          const maxR = (0.18 + intensity * 0.30) * minDim;
          const cx = origin.x * W;
          const cy = origin.y * H;

          const startX = Math.max(step, Math.floor((cx - maxR * 1.2) / step) * step);
          const endX   = Math.min(W - step, cx + maxR * 1.2);
          const startY = Math.max(step, Math.floor((cy - maxR * 1.2) / step) * step);
          const endY   = Math.min(H - step, cy + maxR * 1.2);

          for (let y = startY; y <= endY; y += step) {
            for (let x = startX; x <= endX; x += step) {
              const nx = x / W, ny = y / H;
              if (state.zoneMode === 'frame' && isInsideSafeFrame(nx, ny)) continue;

              const nVal = fbm2D(nx * 4.5, ny * 4.5, subSeed);
              const d = Math.hypot(x - cx, y - cy) / maxR;
              const effD = d + (nVal - 0.5) * 0.38;
              if (effD > 1.0) continue;

              // Halftone radius fades outward
              const dotScale = clamp(1.15 - effD * 0.88, 0.25, 1.15);
              items.push({
                shape: effect.shape,
                x, y,
                size: step * 0.72 * dotScale,
                w: step * 0.72 * dotScale,
                h: step * 0.72 * dotScale,
                rot: 0,
                color: effect.color,
                order: clamp(d, 0, 1)
              });
            }
          }
        }

        // ------------------------------------------------------------------
        // 12. ISOPHONES (Rumore: concentric acoustic rings / vibrating wave bands)
        // ------------------------------------------------------------------
        else if (logic === 'isophones') {
          const origin = state.zoneMode === 'epicenter'
            ? { x: state.epicenter.x, y: state.epicenter.y }
            : getFocalPoint(rng, 0.3);

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
                color: effect.color,
                order: clamp(d, 0, 1)
              });
            }
          }
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

      function rebuildGeometry() {
        const { width: W, height: H } = FORMATS[state.format];
        state.layers.clear();
        state.fixedAssets = state.effects
          .filter(effect => effect.mapAsset && effect.active)
          .map(effect => ({ effectId: effect.id, assetPath: effect.assetPath }));
        let total = 0;

        // Render order: background patches first, then plumes, heat, bars, lines, crisp icons on top
        const renderOrderIds = [
          'greenfield', 'brownfield', 'calore', 'rumore',
          'emissioni', 'valore-immobiliare', 'posti-di-lavoro',
          'flora-fauna', 'bollette', 'pressione-rete', 'traffico', 'tralicci'
        ];

        renderOrderIds.forEach((id, idx) => {
          const eff = state.effects.find(e => e.id === id);
          if (!eff) return;
          const layer = generateEffectLayer(eff, W, H, idx);
          state.layers.set(id, layer);
          total += layer.items.length + layer.lines.length;
        });

        state.totalPrimitives = total;
        document.getElementById('particleCountBadge').textContent = `${total} geometrie`;
        renderCanvas(state.anim.progress);
      }

      /* ======================================================================
         7. ANIMATION EASING & VISIBILITY EVALUATION
         ====================================================================== */

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      }

      function computeItemAnim(item, globalProgress, W, H) {
        if (globalProgress >= 0.999) return { alpha: 1, scale: 1, dx: 0, dy: 0 };
        if (globalProgress <= 0.001) return { alpha: 0, scale: 0, dx: 0, dy: 0 };

        const style = state.anim.style;
        let delay = item.order;

        if (style === 'wave') {
          delay = clamp((item.x / W) * 0.65 + (item.y / H) * 0.35, 0, 1);
        } else if (style === 'pop-scale') {
          delay = item.order * 0.7;
        }

        const windowSize = style === 'plotter-glitch' ? 0.06 : 0.28;
        const localT = clamp((globalProgress * (1 + windowSize) - delay) / windowSize, 0, 1);

        if (localT <= 0) return { alpha: 0, scale: 0, dx: 0, dy: 0 };

        if (style === 'plotter-glitch') {
          // Discrete crisp step like pen-plotter head
          if (localT < 0.35) return { alpha: 0, scale: 0, dx: 0, dy: 0 };
          const jitter = localT < 0.75 ? ((Math.sin(item.x * 13.7 + item.y) > 0 ? 3 : -3)) : 0;
          return { alpha: 1, scale: 1, dx: jitter, dy: 0 };
        }

        if (style === 'pop-scale') {
          return {
            alpha: Math.min(1, localT * 1.8),
            scale: Math.max(0, easeOutBack(localT)),
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
      const ctx = canvas.getContext('2d');

      function drawAssetContained(ctx, image, item) {
        if (!image || !image.complete) return;

        const iw = image.naturalWidth || 1;
        const ih = image.naturalHeight || 1;
        let boxW = item.w || item.size;
        let boxH = item.h || item.size;

        if (!item.w && !item.h) {
          boxW = item.size;
          boxH = item.size;
        }

        const scale = Math.min(boxW / iw, boxH / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(image, -dw / 2, -dh / 2, dw, dh);
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

        switch (item.shape) {
          case 'asset': {
            const image = effectAssetCache.get(item.assetPath);
            drawAssetContained(ctx, image, item);
            break;
          }
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
            ctx.lineWidth = Math.max(1.4, s * 0.24);
            ctx.beginPath();
            ctx.moveTo(-arm, 0); ctx.lineTo(arm, 0);
            ctx.moveTo(0, -arm); ctx.lineTo(0, arm);
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
          case 'diamond': {
            const r = s * 0.55;
            ctx.beginPath();
            ctx.moveTo(0, -r);
            ctx.lineTo(r, 0);
            ctx.lineTo(0, r);
            ctx.lineTo(-r, 0);
            ctx.closePath();
            ctx.fill();
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
            ctx.arc(0, 0, s * 0.52, 0, Math.PI * 2);
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

      function drawTypographyCanvas(ctx, W, H, progress) {
        if (!state.typography.enabled) return;
        const bgInfo = BACKGROUNDS[state.background];
        const alpha = clamp(progress * 1.4, 0, 1);
        if (alpha <= 0.01) return;

        ctx.save();
        ctx.globalAlpha = alpha;

        const title = state.typography.title || '';
        const subtitle = state.typography.subtitle || '';
        const pos = state.typography.position;
        const pad = Math.min(W, H) * 0.065;
        const titleSize = Math.round(Math.min(W, H) * 0.058);
        const subSize = Math.round(Math.min(W, H) * 0.016);

        let tx, ty, align;
        if (pos === 'center') {
          tx = W / 2;
          ty = H / 2;
          align = 'center';
        } else if (pos === 'top-left') {
          tx = pad;
          ty = pad + titleSize;
          align = 'left';
        } else {
          tx = pad;
          ty = H - pad - subSize * 2.2;
          align = 'left';
        }

        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';

        // Crisp subtle plate behind typography for legibility on dense areas
        ctx.font = `700 ${titleSize}px 'Eiffel', 'Inter', sans-serif`;
        ctx.fillStyle = bgInfo.ink;
        ctx.fillText(title, tx, ty);

        ctx.font = `500 ${subSize}px 'IBM Plex Mono', monospace`;
        ctx.fillStyle = bgInfo.subInk;
        ctx.fillText(subtitle, tx, ty + subSize * 1.85);

        ctx.restore();
      }

      function renderCanvas(progress) {
        const { width: W, height: H } = FORMATS[state.format];
        if (canvas.width !== W || canvas.height !== H) {
          canvas.width = W;
          canvas.height = H;
        }

        ctx.clearRect(0, 0, W, H);

        const bgInfo = BACKGROUNDS[state.background];
        if (bgInfo.hex) {
          ctx.fillStyle = bgInfo.hex;
          ctx.fillRect(0, 0, W, H);
        }

        // Draw all active layers
        state.layers.forEach((layer) => {
          // 1. Connector lines (e.g. Tralicci vectors)
          for (let i = 0; i < layer.lines.length; i++) {
            const ln = layer.lines[i];
            const mid = { x: (ln.x1 + ln.x2) / 2, y: (ln.y1 + ln.y2) / 2, order: ln.order };
            const anim = computeItemAnim(mid, progress, W, H);
            if (anim.alpha <= 0.01) continue;

            ctx.save();
            ctx.globalAlpha = anim.alpha * 0.85;
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
            const anim = computeItemAnim(item, progress, W, H);
            drawShapeCanvas(ctx, item, anim);
          }
        });

        // 3. Fixed map assets (Bollette and Pressione sulle case)
        state.fixedAssets.forEach(asset => {
          const image = effectAssetCache.get(asset.assetPath);
          if (!image || !image.complete) return;

          ctx.save();
          ctx.globalAlpha = clamp(progress * 1.4, 0, 1);
          const iw = image.naturalWidth || 1;
          const ih = image.naturalHeight || 1;
          const scale = Math.min(W / iw, H / ih);
          const dw = iw * scale;
          const dh = ih * scale;
          ctx.drawImage(image, (W - dw) / 2, (H - dh) / 2, dw, dh);
          ctx.restore();
        });

        // 4. Optional Typography Overlay
        drawTypographyCanvas(ctx, W, H, progress);
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

        let parts = [];
        parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
        parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`);
        parts.push(`  <!-- The Clouded Issue — Generative Identity Studio | Seed: ${state.seed} -->`);

        if (bgInfo.hex) {
          parts.push(`  <g id="background"><rect width="${W}" height="${H}" fill="${bgInfo.hex}"/></g>`);
        }

        state.layers.forEach((layer, effectId) => {
          if (layer.items.length === 0 && layer.lines.length === 0) return;
          const eff = state.effects.find(e => e.id === effectId);
          parts.push(`  <g id="${effectId}" data-name="${eff ? eff.name : effectId}">`);

          // Connector lines
          for (const ln of layer.lines) {
            parts.push(`    <line x1="${r(ln.x1)}" y1="${r(ln.y1)}" x2="${r(ln.x2)}" y2="${r(ln.y2)}" stroke="${ln.color}" stroke-width="${r(ln.strokeWidth)}" stroke-opacity="0.85"/>`);
          }

          // Micro-geometries
          for (const item of layer.items) {
            const s = item.size;
            const rotDeg = item.rot ? r(item.rot * 180 / Math.PI) : 0;
            const tf = rotDeg ? ` transform="translate(${r(item.x)},${r(item.y)}) rotate(${rotDeg})"` : ` transform="translate(${r(item.x)},${r(item.y)})"`;

            switch (item.shape) {
              case 'asset': {
                const eff = state.effects.find(e => e.assetPath === item.assetPath);
                const iw = eff ? eff.assetPath : item.assetPath;
                const boxW = r(item.w || item.size);
                const boxH = r(item.h || item.size);
                parts.push(`    <image href="Assets/Effetti/${encodeURI(iw)}" x="${r(item.x - boxW/2)}" y="${r(item.y - boxH/2)}" width="${boxW}" height="${boxH}" preserveAspectRatio="xMidYMid meet" transform="rotate(${rotDeg} ${r(item.x)} ${r(item.y)})"/>`);
                break;
              }
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
                const arm = r(s * 0.46);
                const sw = r(Math.max(1.4, s * 0.24));
                parts.push(`    <path${tf} d="M${-arm},0 H${arm} M0,${-arm} V${arm}" stroke="${item.color}" stroke-width="${sw}" fill="none"/>`);
                break;
              }
              case 'hollow-circle': {
                const sw = r(Math.max(1.6, s * 0.22));
                parts.push(`    <circle cx="${r(item.x)}" cy="${r(item.y)}" r="${r(s*0.45)}" fill="none" stroke="${item.color}" stroke-width="${sw}"/>`);
                break;
              }
              case 'diamond': {
                const dr = r(s * 0.55);
                parts.push(`    <polygon${tf} points="0,${-dr} ${dr},0 0,${dr} ${-dr},0" fill="${item.color}"/>`);
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
                parts.push(`    <circle cx="${r(item.x)}" cy="${r(item.y)}" r="${r(s*0.52)}" fill="${item.color}"/>`);
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

        state.fixedAssets.forEach(asset => {
          parts.push(`  <g id="${asset.effectId}" data-name="Mappa fissa"><image href="Assets/Effetti/${encodeURI(asset.assetPath)}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet"/></g>`);
        });

        // Optional Typography Overlay in SVG
        if (state.typography.enabled) {
          const pad = Math.min(W, H) * 0.065;
          const titleSize = Math.round(Math.min(W, H) * 0.058);
          const subSize = Math.round(Math.min(W, H) * 0.016);
          const pos = state.typography.position;
          let tx, ty, anchor;
          if (pos === 'center') { tx = W / 2; ty = H / 2; anchor = 'middle'; }
          else if (pos === 'top-left') { tx = pad; ty = pad + titleSize; anchor = 'start'; }
          else { tx = pad; ty = H - pad - subSize * 2.2; anchor = 'start'; }

          const esc = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          parts.push(`  <g id="typography-overlay">`);
          parts.push(`    <text x="${r(tx)}" y="${r(ty)}" text-anchor="${anchor}" font-family="Eiffel, Inter, sans-serif" font-weight="700" font-size="${titleSize}" fill="${bgInfo.ink}">${esc(state.typography.title)}</text>`);
          parts.push(`    <text x="${r(tx)}" y="${r(ty + subSize * 1.85)}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-weight="500" font-size="${subSize}" fill="${bgInfo.subInk}">${esc(state.typography.subtitle)}</text>`);
          parts.push(`  </g>`);
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
          renderCanvas(state.anim.progress);
          canvas.toBlob(blob => {
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

            const logicOptions = SPATIAL_LOGICS.map(l =>
              `<option value="${l.id}" ${l.id === eff.logic ? 'selected' : ''}>${l.label}</option>`
            ).join('');

            card.innerHTML = `
              <div class="p-2.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-5 h-5 rounded-sm border border-black/10 bg-[#F8F8F6] flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 16 16">${eff.iconSvg}</svg>
                  </span>
                  <span class="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15" style="background:${eff.color}"></span>
                  <span class="text-xs font-semibold text-[#161616] truncate">${eff.name}${eff.mapAsset ? '<span class="ml-1 font-mono-tech text-[8px] uppercase text-[#666662]">Mappa</span>' : ''}</span>
                </div>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only eff-toggle" data-id="${eff.id}" ${eff.active ? 'checked' : ''} />
                  <span class="toggle-pill"></span>
                </label>
              </div>
              <div class="${eff.active ? 'block' : 'hidden'} px-2.5 pb-2.5 pt-1 border-t border-[#ECECE8] space-y-2">
                <div class="flex items-center gap-2">
                  <span class="font-mono-tech text-[9px] uppercase text-[#666662] w-12 shrink-0">Intensità</span>
                  <input type="range" min="10" max="100" value="${eff.intensity}" data-id="${eff.id}" class="tech-slider eff-intensity flex-1" />
                  <span class="font-mono-tech text-[10px] text-[#161616] w-7 text-right eff-int-val">${eff.intensity}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono-tech text-[9px] uppercase text-[#666662] w-12 shrink-0">Logica</span>
                  <select data-id="${eff.id}" class="eff-logic flex-1 bg-[#F8F8F6] border border-[#D6D6D2] rounded px-1.5 py-1 text-[10px] font-mono-tech text-[#161616] focus:outline-none focus:border-[#161616]">
                    ${logicOptions}
                  </select>
                </div>
              </div>
            `;

            section.appendChild(card);
          });

          container.appendChild(section);
        });

        // Update active counter
        const activeCount = state.effects.filter(e => e.active).length;
        document.getElementById('activeCountLabel').textContent = `${activeCount} / 12 effetti attivi`;

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

        container.querySelectorAll('.eff-intensity').forEach(el => {
          el.addEventListener('input', (e) => {
            const eff = state.effects.find(x => x.id === e.target.dataset.id);
            if (!eff) return;
            eff.intensity = Number(e.target.value);
            e.target.nextElementSibling.textContent = eff.intensity;
            rebuildGeometry();
          });
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
        const indices = state.effects
          .map((effect, i) => ({ effect, i }))
          .filter(entry => !entry.effect.randomExcluded)
          .map(entry => entry.i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        const chosen = new Set(indices.slice(0, targetCount));

        state.effects.forEach((eff, idx) => {
          if (eff.randomExcluded) return;
          eff.active = chosen.has(idx);
          eff.logic = eff.defaultLogic;
          if (eff.active) {
            eff.intensity = 45 + Math.floor(Math.random() * 45);
          }
        });

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

      function bindEvents() {
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
          state.zoneMode = e.target.value;
          document.getElementById('zoneModeDesc').textContent = ZONE_DESCRIPTIONS[state.zoneMode];
          rebuildGeometry();
        });

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
        const typoToggle = document.getElementById('typoToggle');
        const typoControls = document.getElementById('typoControls');
        typoToggle.addEventListener('change', (e) => {
          state.typography.enabled = e.target.checked;
          typoControls.classList.toggle('opacity-40', !state.typography.enabled);
          typoControls.classList.toggle('pointer-events-none', !state.typography.enabled);
          renderCanvas(state.anim.progress);
        });

        document.getElementById('typoTitleInput').addEventListener('input', (e) => {
          state.typography.title = e.target.value;
          renderCanvas(state.anim.progress);
        });
        document.getElementById('typoSubInput').addEventListener('input', (e) => {
          state.typography.subtitle = e.target.value;
          renderCanvas(state.anim.progress);
        });
        document.querySelectorAll('.typo-pos-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            state.typography.position = btn.dataset.typoPos;
            document.querySelectorAll('.typo-pos-btn').forEach(b => {
              const active = b.dataset.typoPos === state.typography.position;
              b.className = active
                ? 'typo-pos-btn py-1 text-[10px] font-mono-tech uppercase rounded border border-[#161616] bg-[#161616] text-white cursor-pointer'
                : 'typo-pos-btn py-1 text-[10px] font-mono-tech uppercase rounded border border-[#D6D6D2] bg-white text-[#161616] hover:border-[#161616] cursor-pointer';
            });
            renderCanvas(state.anim.progress);
          });
        });

        // Interactive Epicenter Click on Sheet
        let markerTimer = null;
        document.getElementById('sheetFrame').addEventListener('click', (e) => {
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

          if (state.zoneMode !== 'epicenter') {
            state.zoneMode = 'epicenter';
            document.getElementById('zoneModeSelect').value = 'epicenter';
            document.getElementById('zoneModeDesc').textContent = ZONE_DESCRIPTIONS.epicenter;
          }
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
      }

      /* ======================================================================
         13. INITIALIZATION
         ====================================================================== */

      window.addEventListener('load', () => {
        preloadEffectAssets();
        renderEffectsPanel();
        bindEvents();
        updateSeedDisplays();
        fitSheetToStage();
        rebuildGeometry();
        requestAnimationFrame(animTick);
      });
    })();
