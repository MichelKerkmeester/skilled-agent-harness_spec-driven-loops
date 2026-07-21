// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced Replay Identity
// ───────────────────────────────────────────────────────────────────

import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  ReplayFingerprintSource,
  ReplayIdentity,
} from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REPLAY BINDING
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;

/** Derive the opaque resume identity only from a verified or freshly derived fingerprint. */
export function replayIdentityFromFingerprint<TState extends JsonObject>(
  fingerprint: ReplayFingerprintSource<TState>,
): ReplayIdentity {
  const descriptor = fingerprint?.descriptor;
  if (
    !descriptor
    || !Number.isSafeInteger(descriptor.fingerprint_version)
    || descriptor.fingerprint_version <= 0
    || typeof descriptor.ledger_id !== 'string'
    || descriptor.ledger_id.length === 0
    || typeof descriptor.run_id !== 'string'
    || descriptor.run_id.length === 0
    || !Number.isSafeInteger(descriptor.range_start_sequence)
    || descriptor.range_start_sequence <= 0
    || !Number.isSafeInteger(descriptor.range_end_sequence)
    || descriptor.range_end_sequence < descriptor.range_start_sequence
    || !DIGEST_PATTERN.test(descriptor.final_digest)
  ) {
    throw new LocksAndFencingError(
      LocksAndFencingErrorCodes.IDENTITY_CONFLICT,
      'guard',
      'Resume requires a valid deterministic replay fingerprint identity',
      {},
    );
  }
  return Object.freeze({
    fingerprintVersion: descriptor.fingerprint_version,
    ledgerId: descriptor.ledger_id,
    runId: descriptor.run_id,
    rangeStartSequence: descriptor.range_start_sequence,
    rangeEndSequence: descriptor.range_end_sequence,
    finalDigest: descriptor.final_digest,
  });
}

