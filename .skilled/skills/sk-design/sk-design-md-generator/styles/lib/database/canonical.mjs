// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Shared Canonical Serialization                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Single source of truth for stable-key JSON and length-framed SHA-256 digests.
// The indexer, retrieval, and the differential oracle all serialize identity
// through these primitives so a golden byte reference can never drift from the
// bytes production actually emits.

import { createHash } from 'node:crypto';

export const HASH_PREFIX = 'sha256:';

/**
 * Order strings by raw code-unit comparison so serialization stays locale-free.
 *
 * @param {*} left - Left comparand.
 * @param {*} right - Right comparand.
 * @returns {number} -1, 0, or 1.
 */
export function compareRawStrings(left, right) {
  return String(left) < String(right) ? -1 : String(left) > String(right) ? 1 : 0;
}

/**
 * Serialize a value with lexicographically sorted object keys.
 *
 * @param {*} value - Any JSON-compatible value.
 * @returns {string} Canonical, key-sorted JSON string.
 */
export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.keys(value).sort(compareRawStrings)
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * Prefix a value's bytes with an unsigned 64-bit big-endian length frame.
 *
 * Length framing makes concatenated hash inputs unambiguous: no crafted value
 * can span a field boundary and collide with a different field layout.
 *
 * @param {string|Buffer} value - Value to frame.
 * @returns {[Buffer, Buffer]} The length prefix followed by the value bytes.
 */
export function lengthFrame(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf8');
  const length = Buffer.allocUnsafe(8);
  length.writeBigUInt64BE(BigInt(buffer.byteLength));
  return [length, buffer];
}

/**
 * Hash one value or an ordered list of framed parts into a prefixed hex digest.
 *
 * A single string/Buffer hashes its own bytes; an array hashes each element in
 * order, matching the framed-parts convention used across the module.
 *
 * @param {string|Buffer|Array<string|Buffer>} parts - Hash input.
 * @returns {string} `sha256:`-prefixed lowercase hex digest.
 */
export function digest(parts) {
  const hash = createHash('sha256');
  for (const part of Array.isArray(parts) ? parts : [parts]) hash.update(part);
  return `${HASH_PREFIX}${hash.digest('hex')}`;
}
