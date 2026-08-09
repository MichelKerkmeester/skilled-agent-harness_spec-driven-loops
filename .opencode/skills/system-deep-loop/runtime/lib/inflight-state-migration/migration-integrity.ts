// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Integrity Boundary
// ───────────────────────────────────────────────────────────────────
//
// Thin hard-fail wrapper around the existing atomic-state primitives.
// `verifyIntegrity` is warning-only by design for ordinary snapshot reads,
// but a migration commit must never proceed on unverified state — so this
// module reuses the same digest algorithm and promotes a mismatch to a
// thrown error instead of a console warning.

import { computeIntegrityHash, stampIntegrity, verifyIntegrity } from '../deep-loop/atomic-state.js';
import { InflightMigrationError, InflightMigrationErrorCodes } from './migration-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. SNAPSHOT DIGEST
// ───────────────────────────────────────────────────────────────────

/** Deterministic digest for one integrity-relevant fact bundle. */
export function snapshotDigest(bundle: Record<string, unknown>): string {
  return computeIntegrityHash(bundle);
}

/** Hard-fail recheck of a bundle against a previously recorded digest. */
export function assertBundleMatchesDigest(
  storedDigest: string,
  bundle: Record<string, unknown>,
  details: Readonly<Record<string, boolean | number | string>>,
): void {
  const recomputed = computeIntegrityHash(bundle);
  if (recomputed !== storedDigest) {
    throw new InflightMigrationError(
      InflightMigrationErrorCodes.INTEGRITY_FAILED,
      'Migration bundle integrity digest does not match the recorded snapshot',
      { ...details, storedDigest, recomputedDigest: recomputed },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. STAMPED READBACK VERIFICATION
// ───────────────────────────────────────────────────────────────────

/** Stamp a bundle for durable storage; the stamp is the readback-verification anchor. */
export function stampForStorage<T extends object>(bundle: T): T & { _integrity: string } {
  return stampIntegrity(bundle);
}

/**
 * Reuse `verifyIntegrity`'s stamped-object contract but promote its
 * warning-only false result into a hard migration failure: a persisted
 * receipt or artifact that fails this check can never resume or commit.
 */
export function assertStampedIntegrity(
  stamped: unknown,
  details: Readonly<Record<string, boolean | number | string>>,
): void {
  if (!verifyIntegrity(stamped)) {
    throw new InflightMigrationError(
      InflightMigrationErrorCodes.INTEGRITY_FAILED,
      'Persisted migration state failed the atomic-state integrity check',
      details,
    );
  }
}
