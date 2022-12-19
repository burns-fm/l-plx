/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */
import { ENCRYPTION_ALGORITHM } from "./constants";
import { EncoderOptions, StringEncoderOptions } from "./interfaces";

export async function decode(data: Uint8Array | ReadableStream, options: EncoderOptions): Promise<Uint8Array | ReadableStream> {
  
  const key = await crypto.subtle.importKey(
    'raw',
    options.secretKey,
    { name: ENCRYPTION_ALGORITHM },
    false,
    ['decrypt']
  );

  if (data instanceof Uint8Array) {
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv: options.iv },
      key,
      data
    );

    return new Uint8Array(decryptedData);
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
          
          const decryptedData = await crypto.subtle.decrypt(
            { name: ENCRYPTION_ALGORITHM, iv: options.iv },
            key,
            value
          );
          controller.enqueue(new Uint8Array(decryptedData));
        }
      }
    });
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
