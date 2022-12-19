/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */
import { ENCRYPTION_ALGORITHM, IV_LENGTH, SECRET_LENGTH } from "./constants";
import { EncoderOptions } from "./interfaces";
import { stringToByteArray } from "./str-to-byte-array.helper";

/**
 * Encodes a data stream or byte array for transmission or storage. This is okay for general use,
 * but it's intent is to encode streamed audio data. As such its functionality is limited.
 * 
 * Pass it a Uint8Array of encoded audio, or the ReadableStream.
 * 
 * Provide a `secretKey` and optionally an `iv`. These should be configured on your application and infrastructure level.
 */
export async function encode(data: Uint8Array | ReadableStream, options: EncoderOptions): Promise<Uint8Array | ReadableStream> {
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
    ['encrypt']
  );

  if (data instanceof Uint8Array) {
    const encryptedData = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv, },
      key,
      data
    );

    return new Uint8Array(encryptedData);
  } else if (data instanceof ReadableStream) {
    return new ReadableStream({
      async start(controller) {
        const reader = data.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }

          const encryptedData = await crypto.subtle.encrypt(
            { name: ENCRYPTION_ALGORITHM, iv, },
            key,
            value
          );
          controller.enqueue(new Uint8Array(encryptedData));
        }
      }
    });
  }

  throw new TypeError(`Invalid data type: ${typeof data}`);
}

/**
 * Encode from a string input rather than a byte array or stream.
 */
export async function encodeFromString(data: string, options: EncoderOptions): Promise<Uint8Array | ReadableStream> {
  return encode(
    stringToByteArray(data, { type: 'Uint8Array' }) as Uint8Array,
    options
  );
}
