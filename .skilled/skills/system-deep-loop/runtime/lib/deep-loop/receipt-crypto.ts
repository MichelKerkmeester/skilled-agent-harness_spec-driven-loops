// MODULE: Dispatch Receipt Cryptography
//
// Pure HMAC primitives for deep-loop dispatch receipts. The per-dispatch
// signing key is derived deterministically from a run-master secret + dispatchId
// so a receipt re-verifies on resume without persisting any per-dispatch key.
//
// These functions are pure: they take inputs, return outputs, and never touch
// process.env, the filesystem, or a child process. They hold no secret material
// themselves; the run-master secret is owned exclusively by the engine process
// (executor-audit.ts) and is never imported or referenced here. Keeping the key
// material out of this module is what lets the containment guarantee hold by
// construction — there is simply no path from these primitives to a child.

import { createHmac, timingSafeEqual } from 'node:crypto';

// ───── KEY DERIVATION ─────

/**
 * Derive a per-dispatch signing key from the run-master secret and dispatchId.
 *
 * Deterministic by construction: the same (runMasterSecret, dispatchId) pair
 * always yields the same 64-char hex key, so a verifier that recovers the
 * run-master secret can re-derive the exact key on resume. The secret is never
 * persisted per-dispatch — only this derivation is repeated.
 *
 * @param runMasterSecret - Engine-owned run-master secret (hex or opaque string).
 * @param dispatchId - Stable, unique id for the dispatch whose receipts this key signs.
 * @returns HMAC-SHA256(runMasterSecret, dispatchId) as hex.
 */
export function deriveReceiptKey(runMasterSecret: string, dispatchId: string): string {
  const hmac = createHmac('sha256', runMasterSecret);
  hmac.update(dispatchId);
  return hmac.digest('hex');
}

// ───── CANONICAL SERIALIZATION ─────

/**
 * Serialize a value to canonical JSON: object keys sorted recursively, arrays
 * preserve order, no incidental whitespace. Stable byte-for-byte across
 * platforms so a signature reproduces wherever the bytes are re-read.
 */
export function canonicalReceiptJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = canonicalize(record[key]);
    }
    return sorted;
  }
  return value;
}

// The MAC covers every receipt field EXCEPT the mac itself, so sign and verify
// are symmetric and re-signing an already-attached record is idempotent.
function receiptPayload(record: object): Record<string, unknown> {
  const { mac: _mac, ...rest } = record as Record<string, unknown>;
  return rest;
}

// ───── SIGN / VERIFY ─────

/**
 * Sign a receipt record, returning the hex HMAC-SHA256 over its canonical JSON.
 *
 * @param record - Receipt record (with or without an existing mac field; mac is excluded from the signed payload).
 * @param key - Per-dispatch key from {@link deriveReceiptKey}.
 * @returns Hex HMAC-SHA256 digest over the canonical JSON of the payload.
 */
export function signReceipt(record: object, key: string): string {
  const hmac = createHmac('sha256', key);
  hmac.update(canonicalReceiptJson(receiptPayload(record)));
  return hmac.digest('hex');
}

/**
 * Verify a receipt MAC against the provided key using a constant-time compare.
 *
 * @param record - Receipt record exactly as stored (mac field ignored when recomputing).
 * @param mac - Hex MAC claimed for the record.
 * @param key - Per-dispatch key from {@link deriveReceiptKey}.
 * @returns True if the MAC is valid for the record under the key.
 */
export function verifyReceipt(record: object, mac: string, key: string): boolean {
  const expected = signReceipt(record, key);
  return constantTimeHexEqual(expected, mac);
}

function constantTimeHexEqual(expected: string, candidate: string): boolean {
  const expectedBuf = Buffer.from(expected, 'utf8');
  const candidateBuf = Buffer.from(candidate, 'utf8');
  // Hex SHA-256 digests are a fixed 64 chars; a length mismatch means the
  // candidate is truncated or forged. timingSafeEqual requires equal lengths,
  // so this length gate is mandatory, not a timing shortcut.
  if (expectedBuf.length !== candidateBuf.length) {
    return false;
  }
  return timingSafeEqual(expectedBuf, candidateBuf);
}
