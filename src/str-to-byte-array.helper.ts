/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */

export interface StringToByteArrayOptions {
  type: 'Array' | 'Uint8Array' | 'ArrayBuffer';
  length?: number;
  padChar?: number | string;
}

export type ByteArray = Array<number> | ArrayBuffer | Uint8Array;

export const stringToByteArray = (str: string, options: StringToByteArrayOptions = { type: 'Array' }) => {
  if (options.length && options.length < str.length) {
    throw new Error(`The specified output length is shorter than the input string. The length should be at least the length of the input string.`)
  }

  const converted = str.split('').map(char => char.charCodeAt(0));
  const padChar = typeof options.padChar === 'string' ? options.padChar.charCodeAt(0) : options.padChar ?? 0;
  const length = typeof options.length === 'number' ? options.length : converted.length;
  const data = [...converted, ...new Array(length - converted.length).fill(padChar)];

  const output = (arr: ByteArray) => arr.slice(0, length);
  
  let buf: ArrayBuffer;
  switch(options.type) {
    case 'ArrayBuffer':
      buf = new ArrayBuffer(converted.length);
      for (let i = 0; i < length; i++) {
        buf[i] = converted[i] ?? padChar;
      }
      return output(buf);
    case 'Uint8Array':
      return output(new Uint8Array(data));
    case 'Array':
    default:
      return output(data);
  }
};
