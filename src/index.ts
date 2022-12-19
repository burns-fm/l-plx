/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */

import { ENCRYPTION_ALGORITHM, VALID_ENCODINGS } from './constants';
import { decode, decodeFromString, decodeToString } from './decode';
import { encode, encodeFromString } from './encode';
import { stringToByteArray } from './str-to-byte-array.helper';

export * from './constants';
export * from './interfaces'
export * from './encode';
export * from './decode';
export * from './str-to-byte-array.helper';

export class Plx {
  static VALID_ENCODINGS = VALID_ENCODINGS;
  static ENCRYPTION_ALGORITHM = ENCRYPTION_ALGORITHM;
  static encode = encode;
  static decode = decode;
  static encodeFromString = encodeFromString;
  static decodeFromString = decodeFromString;
  static decodeToString = decodeToString;
  static helper = {
    stringToByteArray,
  } as const;
}
export default Plx;
