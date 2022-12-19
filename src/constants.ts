/**
 * © 2022-2022 Burns Recording Company
 * Created: 18/12/2022
 */

export const ENCRYPTION_ALGORITHM = 'AES-CBC';
export const VALID_ENCODINGS = ['utf8', 'hex', 'base64'] as const;
export const SECRET_LENGTH = 32;
export const IV_LENGTH = 16;
