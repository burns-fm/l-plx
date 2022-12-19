/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */
import { ENCRYPTION_ALGORITHM, IV_LENGTH, SECRET_LENGTH } from "./constants";
import { EncoderOptions, StringEncoderOptions } from "./interfaces";
import { stringToByteArray } from "./str-to-byte-array.helper";

export async function decode(data: Uint8Array, options: EncoderOptions): Promise<Uint8Array> {
  const secretKey = typeof options.secretKey === 'string'
    ? stringToByteArray(options.secretKey, { type: 'Uint8Array', length: SECRET_LENGTH }) as Uint8Array
    : options.secretKey.slice(0,SECRET_LENGTH);

  const iv = typeof options.iv === 'string'
    ? stringToByteArray(options.iv, { type: 'Uint8Array', length: IV_LENGTH }) as Uint8Array
    : options.iv?.slice(0,IV_LENGTH);
  
  const key = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: ENCRYPTION_ALGORITHM },
    false,
    ['decrypt']
  );

  if (data instanceof Uint8Array) {
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv, },
      key,
      data
    );

    return new Uint8Array(decryptedData);
  }

  throw new TypeError(`Invalid data type: ${typeof data}`);
}

export async function decodeFromString(data: string, options: StringEncoderOptions): Promise<Uint8Array | ReadableStream> {
  let decodedData: Uint8Array;

  if (options.encoding === 'utf8') {
    decodedData = new TextEncoder().encode(data);
  } else if (options.encoding === 'hex') {
    decodedData = new Uint8Array(data.match(/[\da-f]{2}/gi)!.map(h => parseInt(h, 16)));
  } else if (options.encoding === 'base64') {
    decodedData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  } else {
    throw new Error(`Invalid encoding: ${options.encoding}`);
  }

  return decode(decodedData, options);
}

export async function decodeToString(data: Uint8Array, options: EncoderOptions): Promise<string> {
  return [...(await decode(data as Uint8Array, options))].map(v => String.fromCharCode(v)).join('');
}
