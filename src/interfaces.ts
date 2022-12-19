/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */
import { VALID_ENCODINGS } from "./constants";

export type StringEncoding = typeof VALID_ENCODINGS[number];

export interface EncoderOptions {
  secretKey: Uint8Array;
  iv?: Uint8Array;
}

export interface StringEncoderOptions extends EncoderOptions {
  encoding?: StringEncoding;
}
