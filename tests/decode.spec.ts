/**
 * © 2022-2023 Burns Recording Company
 * Created: 22/12/2022
 */

import { IV_LENGTH, SECRET_LENGTH } from '../src/constants';
import { decode, decodeFromString } from '../src/decode';
import { encode } from '../src/encode';

describe('decoder', () => {
  const data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const secretKey = new Uint8Array(SECRET_LENGTH);
  const iv = new Uint8Array(IV_LENGTH);
  let encodedArray: Uint8Array;

  beforeAll(async () => {
    encodedArray = await encode(data, { secretKey, iv }) as Uint8Array;
  });

  describe('decode', () => {
  
    it('decodes a Uint8Array to a Uint8Array', async () => {
      const decodedData = await decode(encodedArray, { secretKey, iv });
      expect(decodedData).toEqual(data);
    });
  
    it('throws an error for invalid data type', async () => {
      const data = 'invalid data type';
      const secretKey = new Uint8Array(SECRET_LENGTH);
      const iv = new Uint8Array(IV_LENGTH);
  
      await expect(decode(data as any, { secretKey, iv })).rejects.toThrow(TypeError);
    });
  });
  
  describe('decodeFromString', () => {
    it('decodes a base64 encoded string to a Uint8Array', async () => {
      const encoding = 'base64';
      const data = Buffer.from(encodedArray).toString(encoding);
      const decodedData = await decodeFromString(data, { secretKey, iv, encoding });
      expect(decodedData).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
    });
  
    it('decodes a hex encoded string to a Uint8Array', async () => {
      const encoding = 'hex';
      const data = Buffer.from(encodedArray).toString(encoding);
      const decodedData = await decodeFromString(data, { secretKey, iv, encoding });
      expect(decodedData).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
    });
  
    it('throws an error for invalid encoding', async () => {
      const data = 'invalid encoding';
      const secretKey = new Uint8Array(SECRET_LENGTH);
      const iv = new Uint8Array(IV_LENGTH);
  
      await expect(decodeFromString(data, { secretKey, iv, encoding: 'invalid' as any })).rejects.toThrow();
    });
  });
});
