// ──────────────────────────────────────────────────────────────────
// MODULE: Verified-Ledger Result Resume Reducer
// ──────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  GENESIS_RECORD_HASH,
} from '../authorized-ledger/index.js';
import {
  LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
  asDispatchReceiptPayload,
  deriveDispatchReceiptId,
} from '../dispatch-receipts/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  LEAF_RECOVERY_RECORDED_EVENT_TYPE,
  LEAF_RESULT_RECORDED_EVENT_TYPE,
  LEAF_SALVAGE_RECORDED_EVENT_TYPE,
  RESULT_REDUCER_VERSION,
  asLeafRecoveryPayload,
  asLeafResultPayload,
  asSalvageFragmentPayload,
} from './event-contracts.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DigestReference,
  FoldResumeInput,
  FoldResumeResult,
  LeafProgressState,
  LeafRecoveryPayload,
  LeafResultPayload,
  ResumeProgressSnapshot,
  SalvageFragmentPayload,
} from './types.js';

export interface CompletionVerification {
  readonly complete: boolean;
  readonly reasonCode: string;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

async function resolves(
  reference: Readonly<DigestReference>,
  resolver: FoldResumeInput['resolver'],
): Promise<boolean> {
  const resolution = await resolver(reference);
  return resolution !== null
    && resolution.digest === reference.digest
    && Number.isSafeInteger(resolution.byteLength)
    && resolution.byteLength >= 0;
}

/** A recorded success becomes complete only after all immutable evidence resolves. */
export async function verifyLeafCompletion(
  payload: LeafResultPayload,
  resolver: FoldResumeInput['resolver'],
): Promise<CompletionVerification> {
  if (payload.result_status !== 'succeeded') {
    return { complete: false, reasonCode: 'TERMINAL_STATUS_NOT_SUCCEEDED' };
  }
  if (payload.cost.provenance === 'unknown') {
    return { complete: false, reasonCode: 'UNKNOWN_COST_PROVENANCE' };
  }
  if (payload.parsed_result === null) {
    if (payload.parsed_result_reference === null) {
      return { complete: false, reasonCode: 'PARSED_RESULT_MISSING' };
    }
    if (!(await resolves(payload.parsed_result_reference, resolver))) {
      return { complete: false, reasonCode: 'PARSED_RESULT_DIGEST_UNRESOLVED' };
    }
  } else if (sha256Bytes(canonicalBytes(payload.parsed_result)) !== payload.parsed_result_digest) {
    return { complete: false, reasonCode: 'PARSED_RESULT_DIGEST_MISMATCH' };
  }
  // Optional references enrich provenance without blocking semantic completion when unavailable.
  for (const reference of [...payload.evidence, ...payload.artifacts]) {
    if (reference.required && !(await resolves(reference, resolver))) {
      return { complete: false, reasonCode: 'REQUIRED_DIGEST_UNRESOLVED' };
    }
  }
  return { complete: true, reasonCode: 'EVIDENCE_COMPLETE' };
}

function eventsOfType(
  events: readonly VerifiedLedgerEvent[],
  eventType: string,
): readonly VerifiedLedgerEvent[] {
  return events.filter((event) => event.event.effective.envelope.event_type === eventType);
}

function resultEventsFor(
  events: readonly VerifiedLedgerEvent[],
  receiptId: string,
): readonly VerifiedLedgerEvent[] {
  return eventsOfType(events, LEAF_RESULT_RECORDED_EVENT_TYPE).filter((event) =>
    event.event.effective.envelope.payload.dispatch_receipt_id === receiptId);
}

function salvageEventsFor(
  events: readonly VerifiedLedgerEvent[],
  receiptId: string,
): readonly VerifiedLedgerEvent[] {
  return eventsOfType(events, LEAF_SALVAGE_RECORDED_EVENT_TYPE).filter((event) =>
    event.event.effective.envelope.payload.dispatch_receipt_id === receiptId);
}

function recoveryEventsFor(
  events: readonly VerifiedLedgerEvent[],
  receiptId: string,
): readonly VerifiedLedgerEvent[] {
  return eventsOfType(events, LEAF_RECOVERY_RECORDED_EVENT_TYPE).filter((event) =>
    event.event.effective.envelope.payload.dispatch_receipt_id === receiptId);
}

function leafState(input: Readonly<{
  classification: LeafProgressState['classification'];
  dispatchId: string;
  eligible: boolean;
  leafId: string;
  reasonCode: string;
  receiptId: string;
  recovery: LeafRecoveryPayload | null;
  result: LeafResultPayload | null;
}>): LeafProgressState {
  return Object.freeze({
    classification: input.classification,
    dispatch_id: input.dispatchId,
    dispatch_receipt_id: input.receiptId,
    eligible_for_dispatch: input.eligible,
    leaf_id: input.leafId,
    reason_code: input.reasonCode,
    recovery_verdict: input.recovery?.verdict ?? null,
    result_envelope_id: input.result?.result_envelope_id ?? null,
    terminal_status: input.result?.result_status ?? null,
  });
}

function unreadableLeaves(input: FoldResumeInput, reasonCode: string): LeafProgressState[] {
  return [...input.expectedLeaves]
    .sort((a, b) => compareCodeUnits(a.leafId, b.leafId)
      || compareCodeUnits(a.dispatchId, b.dispatchId))
    .map((leaf) => leafState({
      classification: 'unreadable',
      dispatchId: leaf.dispatchId,
      eligible: false,
      leafId: leaf.leafId,
      reasonCode,
      receiptId: deriveDispatchReceiptId(leaf.dispatchId),
      recovery: null,
      result: null,
    }));
}

function buildSnapshot(input: Readonly<{
  expectedLeafDigest: string;
  integrity: ResumeProgressSnapshot['integrity'];
  leaves: LeafProgressState[];
  recordHash: string;
  registryDigest: string;
  registryVersion: string;
  sequence: number;
}>): ResumeProgressSnapshot {
  const completed = input.leaves
    .filter((leaf) => leaf.classification === 'succeeded')
    .map((leaf) => leaf.leaf_id)
    .sort(compareCodeUnits);
  const eligible = input.leaves
    .filter((leaf) => leaf.eligible_for_dispatch)
    .map((leaf) => leaf.dispatch_id)
    .sort(compareCodeUnits);
  const exclusions = input.leaves
    .filter((leaf) => !leaf.eligible_for_dispatch)
    .map((leaf) => leaf.dispatch_id)
    .sort(compareCodeUnits);
  return Object.freeze({
    authority: 'shadow',
    completed_leaf_ids: completed,
    eligible_dispatch_ids: eligible,
    expected_leaf_digest: input.expectedLeafDigest,
    integrity: input.integrity,
    leaves: input.leaves,
    ledger_head_hash: input.recordHash,
    ledger_head_sequence: input.sequence,
    reducer_version: RESULT_REDUCER_VERSION,
    registry_digest: input.registryDigest,
    registry_version: input.registryVersion,
    scheduling_exclusions: exclusions,
  });
}

function resultFromSnapshot(snapshot: ResumeProgressSnapshot): FoldResumeResult {
  const bytes = canonicalJson(snapshot);
  return Object.freeze({
    canonicalBytes: bytes,
    canonicalDigest: sha256Bytes(Buffer.from(bytes, 'utf8')),
    snapshot,
  });
}

function effectiveSalvage(
  events: readonly VerifiedLedgerEvent[],
): readonly SalvageFragmentPayload[] {
  return events.map((event) => asSalvageFragmentPayload(event.event.effective.envelope.payload));
}

async function reduceLeaf(
  leaf: FoldResumeInput['expectedLeaves'][number],
  events: readonly VerifiedLedgerEvent[],
  resolver: FoldResumeInput['resolver'],
): Promise<LeafProgressState> {
  const receiptId = deriveDispatchReceiptId(leaf.dispatchId);
  const receipts = eventsOfType(events, LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE).filter((event) =>
    event.event.effective.envelope.event_id === receiptId);
  const results = resultEventsFor(events, receiptId);
  const recoveries = recoveryEventsFor(events, receiptId);
  const salvages = effectiveSalvage(salvageEventsFor(events, receiptId));
  if (receipts.length === 0) {
    const dangling = results.length + recoveries.length + salvages.length;
    return leafState({
      classification: dangling === 0 ? 'not_dispatched' : 'conflicted',
      dispatchId: leaf.dispatchId,
      eligible: dangling === 0,
      leafId: leaf.leafId,
      reasonCode: dangling === 0 ? 'NO_DISPATCH_RECEIPT' : 'DANGLING_SUCCESSOR_EVENT',
      receiptId,
      recovery: null,
      result: null,
    });
  }
  if (receipts.length !== 1) {
    return leafState({
      classification: 'conflicted', dispatchId: leaf.dispatchId, eligible: false,
      leafId: leaf.leafId, reasonCode: 'MULTIPLE_DISPATCH_RECEIPTS', receiptId,
      recovery: null, result: null,
    });
  }
  const dispatch = asDispatchReceiptPayload(receipts[0]!.event.effective.envelope.payload);
  if (dispatch.dispatch_id !== leaf.dispatchId || dispatch.leaf_id !== leaf.leafId) {
    return leafState({
      classification: 'conflicted', dispatchId: leaf.dispatchId, eligible: false,
      leafId: leaf.leafId, reasonCode: 'EXPECTED_LEAF_BINDING_MISMATCH', receiptId,
      recovery: null, result: null,
    });
  }
  // Multiple successor candidates stay blocking because the fold cannot choose a canonical write.
  if (results.length > 1 || recoveries.length > 1) {
    return leafState({
      classification: 'conflicted', dispatchId: leaf.dispatchId, eligible: false,
      leafId: leaf.leafId, reasonCode: 'CONFLICTING_SUCCESSOR_EVENTS', receiptId,
      recovery: null, result: null,
    });
  }
  const recovery = recoveries.length === 1
    ? asLeafRecoveryPayload(recoveries[0]!.event.effective.envelope.payload)
    : null;
  if (results.length === 0) {
    if (recovery?.verdict === 'in_doubt' || recovery?.verdict === 'conflict') {
      return leafState({
        classification: 'conflicted', dispatchId: leaf.dispatchId, eligible: false,
        leafId: leaf.leafId, reasonCode: `RECOVERY_${recovery.verdict.toUpperCase()}`,
        receiptId, recovery, result: null,
      });
    }
    const retryEligible = recovery?.verdict === 'not_applied'
      && recovery.retry_decision === 'execute_once'
      && recovery.terminal_status === 'retrying'
      && leaf.retryPolicyEligible;
    if (salvages.some((fragment) => fragment.verdict === 'recovered')) {
      return leafState({
        classification: 'salvaged', dispatchId: leaf.dispatchId, eligible: false,
        leafId: leaf.leafId, reasonCode: 'SALVAGED_WITHOUT_TERMINAL_RESULT', receiptId,
        recovery, result: null,
      });
    }
    return leafState({
      classification: 'dispatched_in_flight',
      dispatchId: leaf.dispatchId,
      eligible: retryEligible,
      leafId: leaf.leafId,
      reasonCode: retryEligible
        ? 'PROVED_NOT_APPLIED_AND_RETRY_ELIGIBLE'
        : recovery?.verdict === 'applied'
          ? 'APPLIED_RESULT_RECONCILIATION_REQUIRED'
          : 'EFFECT_RECONCILIATION_REQUIRED',
      receiptId,
      recovery,
      result: null,
    });
  }
  const resultEvent = results[0]!;
  const result = asLeafResultPayload(resultEvent.event.effective.envelope.payload);
  if (
    result.dispatch_receipt_id !== receiptId
    || result.dispatch_id !== dispatch.dispatch_id
    || result.leaf_id !== dispatch.leaf_id
    || result.attempt_id !== dispatch.attempt_id
    || result.invocation_fingerprint !== dispatch.invocation_fingerprint
    || resultEvent.event.effective.envelope.event_id !== result.result_envelope_id
    || resultEvent.event.effective.envelope.authority_epoch !== result.authority_epoch
    || resultEvent.event.effective.envelope.causation_id !== receiptId
  ) {
    return leafState({
      classification: 'conflicted', dispatchId: leaf.dispatchId, eligible: false,
      leafId: leaf.leafId, reasonCode: 'RESULT_RECEIPT_BINDING_MISMATCH', receiptId,
      recovery, result,
    });
  }
  const completion = await verifyLeafCompletion(result, resolver);
  if (result.result_status === 'succeeded') {
    return leafState({
      classification: completion.complete ? 'succeeded' : 'unreadable',
      dispatchId: leaf.dispatchId,
      eligible: false,
      leafId: leaf.leafId,
      reasonCode: completion.reasonCode,
      receiptId,
      recovery,
      result,
    });
  }
  const recovered = salvages.some((fragment) => fragment.verdict === 'recovered');
  return leafState({
    classification: recovered ? 'salvaged' : result.result_status,
    dispatchId: leaf.dispatchId,
    eligible: false,
    leafId: leaf.leafId,
    reasonCode: recovered ? 'PARTIAL_SALVAGE_RECORDED' : 'TERMINAL_RESULT_RECORDED',
    receiptId,
    recovery,
    result,
  });
}

/** Rebuild progress from verified immutable events; no checkpoint is accepted as input. */
export async function foldResumeProgress(input: FoldResumeInput): Promise<FoldResumeResult> {
  const expected = [...input.expectedLeaves]
    .sort((a, b) => compareCodeUnits(a.leafId, b.leafId)
      || compareCodeUnits(a.dispatchId, b.dispatchId));
  const expectedLeafDigest = sha256Bytes(canonicalBytes(expected.map((leaf) => ({
    dispatch_id: leaf.dispatchId,
    leaf_id: leaf.leafId,
    retry_policy_eligible: leaf.retryPolicyEligible,
  }))));
  const uniqueLeaves = new Set(expected.map((leaf) => leaf.leafId));
  const uniqueDispatches = new Set(expected.map((leaf) => leaf.dispatchId));
  if (
    !(input.ledger instanceof AppendOnlyLedger)
    || uniqueLeaves.size !== expected.length
    || uniqueDispatches.size !== expected.length
  ) {
    return resultFromSnapshot(buildSnapshot({
      expectedLeafDigest,
      integrity: 'unreadable',
      leaves: unreadableLeaves(input, 'INVALID_REDUCER_INPUT'),
      recordHash: GENESIS_RECORD_HASH,
      registryDigest: 'unavailable',
      registryVersion: input.registryVersion,
      sequence: 0,
    }));
  }
  try {
    const events = await input.ledger.readVerifiedEvents();
    const registryDigests = new Set(events.map((event) => event.event.registryDigest));
    if (registryDigests.size > 1) throw new Error('verified events disagree on registry digest');
    const leaves: LeafProgressState[] = [];
    for (const leaf of expected) leaves.push(await reduceLeaf(leaf, events, input.resolver));
    const head = events.at(-1)?.frame;
    return resultFromSnapshot(buildSnapshot({
      expectedLeafDigest,
      integrity: 'trusted',
      leaves,
      recordHash: head?.record_hash ?? GENESIS_RECORD_HASH,
      registryDigest: events[0]?.event.registryDigest ?? 'unobserved',
      registryVersion: input.registryVersion,
      sequence: head?.sequence ?? 0,
    }));
  } catch {
    return resultFromSnapshot(buildSnapshot({
      expectedLeafDigest,
      integrity: 'unreadable',
      leaves: unreadableLeaves(input, 'LEDGER_VERIFICATION_FAILED'),
      recordHash: GENESIS_RECORD_HASH,
      registryDigest: 'unavailable',
      registryVersion: input.registryVersion,
      sequence: 0,
    }));
  }
}
