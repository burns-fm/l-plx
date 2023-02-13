/**
 * © 2022-2023 Burns Recording Company
 * Created: 22/12/2022
 */
import { encode, encodeFromString } from '../src/encode';
import { IV_LENGTH, SECRET_LENGTH } from '../src/constants';

describe('encoder', () => {
  const secretKey = new Uint8Array(SECRET_LENGTH);
  const iv = new Uint8Array(IV_LENGTH);
  const options = { secretKey, iv };

  describe('encode', () => {
    it('encrypts a Uint8Array', async () => {
      const data = new Uint8Array([1, 2, 3, 4, 5]);
      const encryptedData = await encode(data, options);

      expect(encryptedData).toBeInstanceOf(Uint8Array);
    });

    it('encrypts a ReadableStream', async () => {
      const data = new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array([1, 2, 3, 4, 5]));
          controller.close();
        }
      });
      const encryptedData = await encode(data, options);

      expect(encryptedData).toBeInstanceOf(ReadableStream);
    });

    it('throws an error when passed an invalid data type', () => {
      expect(async () => await encode({} as any, options)).rejects.toThrowError(TypeError);
    });
  });

  describe('encodeFromString', () => {
    it('encodes from a string input', async () => {
      const data = 'hello world';
      const encryptedData = await encodeFromString(data, options);

      expect(encryptedData).toBeInstanceOf(Uint8Array);
    });
  });
});
