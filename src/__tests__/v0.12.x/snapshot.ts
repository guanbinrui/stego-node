import { readFile } from 'fs/promises'
import { toMatchFile } from 'jest-file-snapshot'
import { join } from 'path'
import { encode, decode, TransformAlgorithm, GrayscaleAlgorithm, AlgorithmVersion } from '../../node'
// @ts-expect-error
import { webcrypto as crypto } from 'crypto'
expect.extend({ toMatchFile })

const original = readFile(join(__dirname, './original.png'))
const mask = readFile(join(__dirname, './mask.png'))
const snapshot1 = join(__dirname, './__file__snapshot__/v1-snapshot-0.png')
const snapshot2 = join(__dirname, './__file__snapshot__/v2-snapshot-0.png')
const text =
  'Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications.'

test('v1', async () => {
  const outImage = await encode(await original, await mask, {
    size: 8,
    narrow: 0,
    copies: 3,
    tolerance: 128,
    exhaustPixels: true,
    cropEdgePixels: false,
    fakeMaskPixels: false,
    grayscaleAlgorithm: GrayscaleAlgorithm.NONE,
    transformAlgorithm: TransformAlgorithm.FFT1D,
    pass: 'Hello World',
    text: text,
    version: AlgorithmVersion.V1,
    randomSource: crypto.getRandomValues.bind(crypto),
  })
  expect(outImage).toMatchFile(snapshot1)

  const decodedText = await decode(outImage, await mask, {
    size: 8,
    copies: 3,
    tolerance: 128,
    transformAlgorithm: TransformAlgorithm.FFT1D,
    pass: 'Hello World',
    version: AlgorithmVersion.V1,
  })
  expect(decodedText).toBe(text)
})

test('v2', async () => {
  const outImage = await encode(await original, await mask, {
    size: 8,
    narrow: 0,
    copies: 3,
    tolerance: 3,
    exhaustPixels: true,
    cropEdgePixels: false,
    fakeMaskPixels: false,
    grayscaleAlgorithm: GrayscaleAlgorithm.NONE,
    transformAlgorithm: TransformAlgorithm.FFT1D,
    pass: 'Hello World',
    text: text,
    version: AlgorithmVersion.V2,
    randomSource: crypto.getRandomValues.bind(crypto),
  })
  expect(outImage).toMatchFile(snapshot2)

  const decodedText = await decode(outImage, await mask, {
    size: 8,
    copies: 3,
    tolerance: 128,
    transformAlgorithm: TransformAlgorithm.FFT1D,
    pass: 'Hello World',
    version: AlgorithmVersion.V2,
  })
  expect(decodedText).toBe(text)
})
