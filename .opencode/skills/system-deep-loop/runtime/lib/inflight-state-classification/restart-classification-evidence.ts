// ───────────────────────────────────────────────────────────────────
// MODULE: Restart Classification Evidence Derivation
// ───────────────────────────────────────────────────────────────────
//
// The single home for deriving a ClassificationEvidence record from
// observed restart facts. It lives outside the fixture package on
// purpose: production classification code can call this same derivation
// rather than growing a second copy of the logic. That placement is the
// point. Two copies of the derivation would let the fixture oracle keep
// hashing one shape while production hashed another, and the fixture
// tests would stay green the whole time — at which point they stop being
// evidence about the system and start being evidence about a parallel
// implementation that nothing checks. Today only the fixture oracle and
// the package barrel import this; the design intent is that production
// classification routes through here too, so there is one derivation to
// drift, not two.

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { FROZEN_CENSUS_CONTRACT } from './frozen-census-policy.js';

import type { ClassificationEvidence } from './inflight-state-types.js';

/** One observed restart lease; only fencing state and token feed the derivation. */
export interface RestartLeaseObservation {
  // Narrowed to the exact literals the derivation compares against. A wider
  // string would let a caller synthesising this from another source (an
  // expiry timestamp, say) emit a near-miss like 'expired', which compiles
  // and then silently counts as quiescent — the observer would report no
  // active leases while leases are held. The union turns that into a
  // compile error.
  readonly state: 'quiescent' | 'active' | 'uncertain';
  readonly fencingToken: number;
}

/** One observed restart receipt; only effectId feeds the derivation. */
export interface RestartReceiptObservation {
  readonly effectId: string;
}

/**
 * Observed restart facts. Declared structurally (not by importing the
 * fixture restart type) so this module has no dependency on the fixtures
 * package and production code can supply an equivalent shape directly.
 */
export interface RestartFacts {
  readonly stopSequence: number | null;
  readonly pendingEffects: readonly string[];
  readonly receipts: readonly RestartReceiptObservation[];
  readonly leases: readonly RestartLeaseObservation[];
  readonly continuityId: string | null;
}

/** Census-resolved row metadata paired with the observed restart facts. */
export interface DeriveRestartClassificationEvidenceInput {
  readonly rowId: string;
  readonly lifecycle: string;
  readonly mutability: string;
  readonly restart: RestartFacts;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

/**
 * Build a ClassificationEvidence record from observed restart state.
 * The caller's restart object is passed through unchanged so the digests
 * cover exactly the keys the caller supplied; do not reshape it here,
 * because the canonical encoder sorts keys and any dropped or added key
 * would alter the pinned digests.
 */
export function deriveRestartClassificationEvidence(
  input: DeriveRestartClassificationEvidenceInput,
): ClassificationEvidence {
  const activeLeaseCount = input.restart.leases.filter((lease) => lease.state === 'active').length;
  const leaseState = input.restart.leases.length === 0
    ? 'none'
    : input.restart.leases.some((lease) => lease.state === 'uncertain')
      ? 'uncertain'
      : activeLeaseCount > 0
        ? 'active'
        : 'quiescent';
  const receiptCoverage = input.restart.pendingEffects.every((effectId) => (
    input.restart.receipts.some((receipt) => receipt.effectId === effectId)
  ));
  const rollbackReady = input.restart.stopSequence !== null && input.restart.continuityId !== null;
  const pendingEffectsState = input.restart.pendingEffects.length === 0
    ? 'none'
    : receiptCoverage
      ? 'active-legacy'
      : 'uncertain';
  return {
    rowId: input.rowId,
    isPresent: true,
    stateDigest: digest(input.restart),
    shapeVersion: '1',
    shapeStatus: 'registered',
    schemaDigest: digest(Object.keys(input.restart).sort()),
    lifecyclePoint: `${input.lifecycle}:restart-${input.restart.stopSequence ?? 'unknown'}`,
    authorityState: 'legacy_authoritative',
    authorityEpoch: Math.max(0, ...input.restart.leases.map((lease) => lease.fencingToken)),
    mutability: input.mutability,
    leaseState,
    activeLeaseCount,
    leaseSetDigest: digest(input.restart.leases),
    pendingEffectsState,
    pendingEffectSetDigest: digest(input.restart.pendingEffects),
    identityCoverage: input.restart.continuityId !== null,
    orderCoverage: input.restart.stopSequence !== null,
    idempotencyCoverage: receiptCoverage,
    // Restart facts contain no budget dimension, so this observation cannot
    // honestly attest budget coverage.
    budgetCoverage: false,
    receiptCoverage,
    // Successful derivation means the effect dimension was observed; the
    // restart reader rejects empty effect ledgers before evidence is built.
    pendingWorkCoverage: true,
    isCorrupt: false,
    rollbackAnchor: {
      anchorId: input.restart.continuityId ?? 'missing-continuity-anchor',
      digest: digest({
        continuityId: input.restart.continuityId,
        stopSequence: input.restart.stopSequence,
      }),
      retained: rollbackReady,
      restorable: rollbackReady,
      minimumRetentionDays: FROZEN_CENSUS_CONTRACT.rollbackMinimumDays,
      minimumSuccessfulRuns: FROZEN_CENSUS_CONTRACT.rollbackMinimumSuccessfulRuns,
    },
    verifier: {
      verified: rollbackReady && receiptCoverage && leaseState !== 'uncertain',
      receiptDigest: digest(input.restart.receipts),
      replayFingerprintDigest: null,
      rollbackScenarioDigest: digest({
        leaseState,
        pendingEffectsState,
        stopSequence: input.restart.stopSequence,
      }),
      parityCaseDigest: null,
    },
    proof: {
      kind: 'pin',
      legacyWriterSoleAuthority: true,
      legacyCompletionAvailable: input.restart.pendingEffects.length > 0 && receiptCoverage,
      boundedCompletion: rollbackReady && leaseState !== 'uncertain',
      timedOut: leaseState === 'uncertain',
      terminalBoundary: input.restart.continuityId ?? 'missing-continuity-boundary',
      terminalReceiptRequired: input.restart.pendingEffects.length > 0,
    },
  };
}
