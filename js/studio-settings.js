// Palette e temporizzazione Plotter / Glitch condivise dai generatori.
const STUDIO_BACKGROUNDS = {
  paper:       { hex: '#EDEEE9', ink: '#555555', subInk: '#555555' },
  white:       { hex: '#FFFFFF', ink: '#161616', subInk: '#555550' },
  dark:        { hex: '#555555', ink: '#EDEEE9', subInk: '#EDEEE9' },
  transparent: { hex: null,      ink: '#161616', subInk: '#555550' }
};

function plotterGlitchProgress(progress, delay) {
  const noise = Math.sin(delay * 12.9898 + 78.233) * 43758.5453;
  const windowSize = 0.07 + (noise - Math.floor(noise)) * 0.17;
  return Math.max(0, Math.min(1, (progress * (1 + windowSize) - delay) / windowSize));
}
