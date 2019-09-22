import { encode } from '.';
import { rs2Buf } from './helper';
import { TransformAlgorithm } from './transform';
import { GrayscaleAlgorithm } from './grayscale';

async function start() {
  const imageBuf = await encode(await rs2Buf(process.stdin), {
    text: '',
    clip: 0,
    size: 8,
    pass: '',
    copies: 5,
    grayscaleAlgorithm: GrayscaleAlgorithm.AVERAGE,
    transformAlgorithm: TransformAlgorithm.FFT1D,
  });

  process.stdout.write(imageBuf);
}

start();