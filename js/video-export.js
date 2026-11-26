// QuickTime PNG conserva il canale alpha di ogni fotogramma del canvas.
const createAlphaMovie = (() => {
  const ascii = value => Uint8Array.from(value, char => char.charCodeAt(0));
  const zeros = length => new Uint8Array(length);
  const u16 = value => Uint8Array.of(value >>> 8, value);
  const u32 = value => Uint8Array.of(value >>> 24, value >>> 16, value >>> 8, value);
  const concat = (...parts) => {
    const bytes = zeros(parts.reduce((total, part) => total + part.length, 0));
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.length;
    }
    return bytes;
  };
  const header = (type, size) => concat(u32(size + 8), ascii(type));
  const atom = (type, ...parts) => concat(header(type, parts.reduce((total, part) => total + part.length, 0)), ...parts);
  const full = (type, flags, ...parts) => atom(type, u32(flags), ...parts);
  const matrix = concat(u32(65536), zeros(12), u32(65536), zeros(12), u32(0x40000000));

  return function createAlphaMovie(frames, width, height, fps) {
    const duration = frames.length;
    const frameSizes = frames.map(frame => u32(frame.size));
    const dataSize = frames.reduce((total, frame) => total + frame.size, 0);
    if (!duration || dataSize > 0xffffffff - 32) throw new Error('Dimensione MOV non supportata');

    const fileType = atom('ftyp', ascii('qt  '), u32(0), ascii('qt  '));
    const movieHeader = full('mvhd', 0, zeros(8), u32(fps), u32(duration), u32(65536), u16(256),
      zeros(10), matrix, zeros(24), u32(2));
    const trackHeader = full('tkhd', 7, zeros(8), u32(1), u32(0), u32(duration), zeros(16),
      matrix, u32(width * 65536), u32(height * 65536));
    const mediaHeader = full('mdhd', 0, zeros(8), u32(fps), u32(duration), zeros(4));
    const handler = full('hdlr', 0, ascii('mhlr'), ascii('vide'), zeros(12), Uint8Array.of(5), ascii('Video'));
    const dataInfo = atom('dinf', full('dref', 0, u32(1), full('url ', 1)));

    const png = atom('png ', zeros(6), u16(1), zeros(16), u16(width), u16(height),
      u32(72 * 65536), u32(72 * 65536), u32(0), u16(1),
      Uint8Array.of(3), ascii('PNG'), zeros(28), u16(32), u16(0xffff));
    // I campioni PNG sono indipendenti e occupano un unico chunk contiguo.
    const framesTable = atom('stbl',
      full('stsd', 0, u32(1), png),
      full('stts', 0, u32(1), u32(duration), u32(1)),
      full('stsc', 0, u32(1), u32(1), u32(duration), u32(1)),
      full('stsz', 0, u32(0), u32(duration), ...frameSizes),
      full('stco', 0, u32(1), u32(fileType.length + 8)));
    const mediaInfo = atom('minf', full('vmhd', 1, zeros(8)), dataInfo, framesTable);
    const movie = atom('moov', movieHeader, atom('trak', trackHeader, atom('mdia', mediaHeader, handler, mediaInfo)));
    return new Blob([fileType, header('mdat', dataSize), ...frames, movie], { type: 'video/quicktime' });
  };
})();

function encodeCanvasPng(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Fotogramma PNG non disponibile'));
    }, 'image/png');
  });
}
