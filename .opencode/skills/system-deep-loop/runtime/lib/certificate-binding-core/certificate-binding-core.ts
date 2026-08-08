// ───────────────────────────────────────────────────────────────────
// MODULE: Certificate Field Binding Core
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/**
 * One semantic field a certificate emits, paired with the value a verifier
 * independently re-derives from verified typed payload material. The
 * field-to-material mapping is per-emitter data; only the compare loop
 * below is shared.
 */
export interface BoundFieldComparison {
  readonly field: string;
  readonly emitted: unknown;
  readonly rederived: unknown;
}

export interface BoundFieldMismatch {
  readonly field: string;
  readonly emittedDigest: string;
  readonly rederivedDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. COMPARE LOOP
// ───────────────────────────────────────────────────────────────────

function comparableDigest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

/**
 * Compares every named field an issuer emitted against the value a
 * verifier independently re-derived from verified material, returning
 * the first mismatch found by canonical-byte equality, or null when every
 * field agrees. A caller that finds a mismatch is responsible for raising
 * its own typed, emitter-specific rejection.
 */
export function firstBoundFieldMismatch(
  comparisons: readonly BoundFieldComparison[],
): BoundFieldMismatch | null {
  for (const comparison of comparisons) {
    const emittedDigest = comparableDigest(comparison.emitted);
    const rederivedDigest = comparableDigest(comparison.rederived);
    if (emittedDigest !== rederivedDigest) {
      return Object.freeze({ field: comparison.field, emittedDigest, rederivedDigest });
    }
  }
  return null;
}
