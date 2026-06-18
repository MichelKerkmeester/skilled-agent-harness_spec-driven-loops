// ───────────────────────────────────────────────────────────────
// MODULE: Content Identity
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';

/** Normalizes an input while preserving the caller's hash identity semantics. */
export type JsonHashNormalizer = (value: unknown) => unknown;

function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf-8').digest('hex');
}

/** Hash a raw content body without adding a namespace or prefix. */
export function hashContentBody(content: string): string {
  return sha256Hex(content);
}

/** Hash a normalized JSON value without changing the caller's identity rules. */
export function hashCanonicalJson(value: unknown, normalize: JsonHashNormalizer): string {
  const serialized = JSON.stringify(normalize(value));
  if (serialized === undefined) {
    throw new TypeError('Cannot hash a value without a JSON representation');
  }
  return sha256Hex(serialized);
}
