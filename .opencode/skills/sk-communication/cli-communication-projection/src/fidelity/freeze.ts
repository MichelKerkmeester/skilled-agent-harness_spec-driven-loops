// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity Immutability Helpers
// ───────────────────────────────────────────────────────────────────

import type { ExactOriginalRecord } from '../contracts/exact-original.js';

/** Deep-freeze records while treating detached byte views as leaf values. */
export function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }
  if (ArrayBuffer.isView(value)) {
    return value;
  }
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}

/** Retain a caller-independent exact original. */
export function freezeExactOriginal(
  record: ExactOriginalRecord,
): ExactOriginalRecord {
  if (Object.isFrozen(record) && Object.isFrozen(record.provenance)) {
    return record;
  }
  return deepFreeze(structuredClone(record));
}
