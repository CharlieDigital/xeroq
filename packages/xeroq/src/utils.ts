import { nolookalikesSafe } from 'nanoid-dictionary';
import { customAlphabet } from 'nanoid';

const idFn = customAlphabet(nolookalikesSafe);

/**
 * Uses nanoid to generate a random length identifier with a default of length 8.
 * @param length The length of the random ID to generate; it omitted, defaults to 8
 * @returns A "safe" random ID with no lookalikes with the length specified.
 */
export function makeId(length?: number) {
  return idFn(length ?? 8)
}
