// ───────────────────────────────────────────────────────────────────
// MODULE: Exact Original Contract
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import type { ContractHeader, FixtureProvenance } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Immutable encoded bytes used as the universal fallback source. */
export interface ExactOriginalRecord extends ContractHeader {
  readonly contractKind: 'exact-original';
  readonly originalId: string;
  readonly contentType: string;
  readonly encoding: 'base64';
  readonly bytesBase64: string;
  readonly byteLength: number;
  readonly sha256: string;
  readonly provenance: FixtureProvenance;
}

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Build an immutable original record from caller-owned bytes. */
export function createExactOriginalRecord(
  originalId: string,
  bytes: Uint8Array,
  contentType: string,
  provenance: FixtureProvenance,
): ExactOriginalRecord {
  const copiedBytes = Uint8Array.from(bytes);
  return Object.freeze({
    contractKind: 'exact-original',
    schemaVersion: '1.0.0',
    originalId,
    contentType,
    encoding: 'base64',
    bytesBase64: Buffer.from(copiedBytes).toString('base64'),
    byteLength: copiedBytes.byteLength,
    sha256: createSha256Digest(copiedBytes),
    provenance: Object.freeze({ ...provenance }),
  });
}

/** Decode a stored original without normalizing its bytes. */
export function decodeExactOriginal(record: ExactOriginalRecord): Uint8Array {
  return Uint8Array.from(Buffer.from(record.bytesBase64, 'base64'));
}

/** Calculate the canonical digest representation for exact bytes. */
export function createSha256Digest(bytes: Uint8Array): string {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}

/** Confirm byte length and digest without reconstructing text. */
export function verifyExactOriginal(record: ExactOriginalRecord): boolean {
  const bytes = decodeExactOriginal(record);
  return bytes.byteLength === record.byteLength
    && createSha256Digest(bytes) === record.sha256;
}
