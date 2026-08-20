// ───────────────────────────────────────────────────────────────────
// MODULE: Classification → Rollback Drill Adapter
// ───────────────────────────────────────────────────────────────────
//
// The in-flight state classifier and the rollback drill were built to
// different contracts and never shared one type. The classifier emits a
// sanitized decision record — it deliberately strips live operational
// detail down to the evidence needed to commit a disposition. The drill
// rehearses a rollback and needs exactly that live operational detail:
// which leases are still open, which effects are still pending, who
// verified. An adapter bridges the two because collapsing them into one
// shared type would either leak decision-only fields into the rehearsal
// or force the classifier to retain ids it was designed to forget.
//
// Three fields cannot be bridged and must not be papered over with a
// placeholder. The classifier records only a lease COUNT and a lease-set
// DIGEST, never the ids; the drill needs the ids to detect a live lease
// crossing the cutover. Emitting an empty array when leases are actually
// live would erase exactly the hazard the drill exists to catch, so the
// adapter throws instead. The same shape of problem applies to pending
// effects. And a row the caller expects but that has no evidence or no
// classified disposition must surface as a failure, never as a silently
// passing placeholder row.

import type {
  ClassificationEvidence,
  ClassifiedInflightStateRow,
} from '../inflight-state-classification/index.js';
import type { InflightDisposition } from './rollback-drill-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. DRILL ROW SHAPE
// ───────────────────────────────────────────────────────────────────

/** The sixteen-key classification row the rollback drill validates. */
export interface DrillClassificationRow {
  readonly rowId: string;
  readonly stateDigest: string;
  readonly shapeVersion: string;
  readonly lifecyclePoint: string;
  readonly authorityEpoch: number;
  readonly mutability: string;
  readonly activeLeaseIds: readonly string[];
  readonly pendingEffectIds: readonly string[];
  readonly identityCoverageComplete: boolean;
  readonly orderCoverageComplete: boolean;
  readonly rollbackAnchorDigest: string;
  readonly disposition: InflightDisposition;
  readonly reasonCode: string;
  readonly verifier: string;
  readonly terminalReceiptId: string | null;
  readonly isQuiescent: boolean;
}

/** Inputs the caller assembles from a built manifest plus its verifier identity. */
export interface AdaptClassificationInput {
  readonly evidence: readonly ClassificationEvidence[];
  readonly classified: readonly ClassifiedInflightStateRow[];
  readonly expectedRowIds: readonly string[];
  readonly verifierIdentity: string;
  /**
   * Map of rowId -> terminal completion receipt digest for rows that reached
   * their terminal boundary while pinned. Optional; a missing or empty value
   * for a row yields a null terminalReceiptId and lets the drill's veto fire.
   */
  readonly terminalPinReceipts?: Readonly<Record<string, string>>;
}

// ───────────────────────────────────────────────────────────────────
// 2. GRAMMAR GUARDS
// ───────────────────────────────────────────────────────────────────

// The drill's own validators reject anything outside these shapes. Fail
// here with a precise message rather than deep inside the drill.
const IDENTITY_PATTERN = /^[a-z0-9][a-z0-9-]{0,127}$/u;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;

function assertIdentity(value: string, label: string): void {
  if (!IDENTITY_PATTERN.test(value)) {
    throw new TypeError(
      `${label} must match the drill identity grammar /^[a-z0-9][a-z0-9-]{0,127}$/ (got "${value}")`,
    );
  }
}

function assertDigest(value: string, label: string): void {
  if (!DIGEST_PATTERN.test(value)) {
    throw new TypeError(
      `${label} must match the drill digest grammar /^[a-f0-9]{64}$/ (got "${value}")`,
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. ADAPTER
// ───────────────────────────────────────────────────────────────────

/**
 * Translate classifier evidence and dispositions into the row shape the
 * rollback drill validates. Rows are emitted only for ids in
 * `expectedRowIds`, in that order. Three categories of input are refused
 * with a `TypeError` rather than invented: live lease ids that cannot be
 * recovered from a count, pending effect ids that cannot be recovered
 * from a non-quiescent state, and expected rows missing their evidence or
 * disposition.
 */
export function adaptClassificationForDrill(
  input: AdaptClassificationInput,
): { expectedRowIds: readonly string[]; rows: readonly DrillClassificationRow[] } {
  if (input.verifierIdentity.trim() === '') {
    throw new TypeError(
      'verifierIdentity must be a non-empty string; the drill requires an identity, not the verifier attestation object',
    );
  }

  const expectedRowIds = input.expectedRowIds;
  const seenExpected = new Set<string>();
  for (const id of expectedRowIds) {
    if (seenExpected.has(id)) {
      throw new TypeError(`Duplicate expected row id: "${id}"`);
    }
    seenExpected.add(id);
  }

  const evidenceById = new Map<string, ClassificationEvidence>();
  for (const row of input.evidence) {
    evidenceById.set(row.rowId, row);
  }
  const classifiedById = new Map<string, ClassifiedInflightStateRow>();
  for (const row of input.classified) {
    classifiedById.set(row.rowId, row);
  }

  const rows: DrillClassificationRow[] = [];
  for (const rowId of expectedRowIds) {
    const evidence = evidenceById.get(rowId);
    if (!evidence) {
      throw new TypeError(
        `No classification evidence for expected row id "${rowId}"; a missing row must not become a passing one`,
      );
    }
    const classified = classifiedById.get(rowId);
    if (!classified) {
      throw new TypeError(
        `No classified inflight state row for expected row id "${rowId}"; a missing disposition must not become a passing one`,
      );
    }

    // Live lease ids are not recoverable from a count plus a set digest.
    // An empty array is truthful only when nothing is live.
    let activeLeaseIds: readonly string[];
    if (evidence.activeLeaseCount === 0) {
      activeLeaseIds = [];
    } else {
      throw new TypeError(
        `Cannot recover active lease ids for row "${rowId}": activeLeaseCount is ${evidence.activeLeaseCount} but evidence carries only a count and leaseSetDigest, not the ids; emitting [] would erase the live lease the drill exists to detect`,
      );
    }

    // Pending effect ids are not recoverable from a non-quiescent state.
    let pendingEffectIds: readonly string[];
    if (
      evidence.pendingEffectsState === 'none'
      || evidence.pendingEffectsState === 'reconciled'
    ) {
      pendingEffectIds = [];
    } else {
      throw new TypeError(
        `Cannot recover pending effect ids for row "${rowId}": pendingEffectsState is "${evidence.pendingEffectsState}", which is not quiescent; emitting [] would erase live effects the drill exists to detect`,
      );
    }

    const leaseQuiescent =
      evidence.leaseState === 'none' || evidence.leaseState === 'quiescent';
    const effectsQuiescent =
      evidence.pendingEffectsState === 'none'
      || evidence.pendingEffectsState === 'reconciled';
    const isQuiescent = leaseQuiescent && effectsQuiescent;

    // The terminal receipt is the record that a pinned row reached its
    // terminal boundary. The verifier's receiptDigest is a different claim:
    // it attests that the verifier ran and checked the classification. The
    // two are about different things, and substituting the verifier's
    // attestation for the terminal receipt would stamp a non-null id onto
    // essentially every row, disarming the drill's veto on unterminated PIN
    // rows. Look the receipt up by rowId; a missing or empty value is
    // reported truthfully as null and the drill decides what to do with it.
    const terminalPinReceipts = input.terminalPinReceipts;
    const lookedUpReceipt =
      terminalPinReceipts !== undefined ? terminalPinReceipts[rowId] : undefined;
    const terminalReceiptId =
      typeof lookedUpReceipt === 'string' && lookedUpReceipt.length > 0
        ? lookedUpReceipt
        : null;

    // Fail fast on grammar the drill would reject, with a clearer message.
    assertIdentity(rowId, `rowId for row "${rowId}"`);
    assertDigest(evidence.stateDigest, `stateDigest for row "${rowId}"`);
    assertDigest(
      evidence.rollbackAnchor.digest,
      `rollbackAnchorDigest for row "${rowId}"`,
    );
    if (terminalReceiptId !== null) {
      assertDigest(
        terminalReceiptId,
        `terminalReceiptId for row "${rowId}"`,
      );
    }

    rows.push({
      rowId,
      stateDigest: evidence.stateDigest,
      shapeVersion: evidence.shapeVersion,
      lifecyclePoint: evidence.lifecyclePoint,
      authorityEpoch: evidence.authorityEpoch,
      mutability: evidence.mutability,
      activeLeaseIds,
      pendingEffectIds,
      identityCoverageComplete: evidence.identityCoverage,
      orderCoverageComplete: evidence.orderCoverage,
      rollbackAnchorDigest: evidence.rollbackAnchor.digest,
      disposition: classified.disposition,
      reasonCode: classified.reasonCode,
      verifier: input.verifierIdentity,
      terminalReceiptId,
      isQuiescent,
    });
  }

  return { expectedRowIds, rows };
}
