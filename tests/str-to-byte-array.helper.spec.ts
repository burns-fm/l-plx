/**
 * © 2022-2022 Burns Recording Company
 * Created: 22/12/2022
 */

import { stringToByteArray } from "../src/str-to-byte-array.helper";

describe('stringToByteArray', () => {
  const input = 'Test String';
  const expectedNumberArray = [
    84, 101, 115, 116,
    32,  83, 116, 114,
   105, 110, 103
 ];
 const expectedUint8Array = new Uint8Array(expectedNumberArray);

  it('should return an Array by default', () => {
    const result = stringToByteArray(input);
    expect(Array.isArray(result)).toBe(true);
    expect(typeof result[0]).toBe('number');
    expect(result).toStrictEqual(expectedNumberArray);
  });

  it('should return a Uint8Array when the option is passed', () => {
    const result = stringToByteArray(input, { type: 'Uint8Array' });
    expect(result instanceof Uint8Array).toBe(true);
    expect(result).toStrictEqual(expectedUint8Array);
  });

  it('should throw if the requested length is shorter than the provided string', () => {
    expect(() => stringToByteArray('four', { length: 3 })).toThrow();
  });

  it('should pad the output to match the length provided', () => {
    const length = input.length + 10;
    const result = stringToByteArray(input, { length }) as number[];
    expect(result.length).toEqual(length);
    expect(result[length - 1]).toBe(0);
  });

  it('should pad the output to match the length provided and use the provided character', () => {
    const length = input.length + 10;
    const padChar = 'X';
    const result = stringToByteArray(input, { length, padChar }) as number[];
    expect(result.length).toEqual(length);
    expect(result[length - 1]).toBe(padChar.charCodeAt(0));
  });
});
