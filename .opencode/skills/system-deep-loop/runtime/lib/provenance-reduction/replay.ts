// ───────────────────────────────────────────────────────────────────
// MODULE: Provenance Reduction Replay Verification
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';
import { stableDigest } from './identity.js';

import type {
  AdjudicationAudit,
  CandidateDisposition,
  FleetScopeReceipt,
  ProvenanceReductionResult,
  ProvenanceReplayProjection,
  ProvenanceReplayResult,
  ReductionLedgerEvent,
  SourceBucketSchedule,
} from './types.js';

function eventDigest(event: ReductionLedgerEvent): string {
  return stableDigest({
    eventType: event.eventType,
    eventVersion: event.eventVersion,
    payload: event.payload,
  });
}

function recordOf(value: unknown): Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new TypeError('Provenance replay event payload must be an object');
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`Provenance replay requires ${field}`);
  }
  return value;
}

function requiredStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new TypeError(`Provenance replay requires string array ${field}`);
  }
  return [...value] as string[];
}

/** Reconstruct the reduction evidence projection from deterministic ledger events alone. */
export function replayProvenanceLedger(
  ledger: readonly ReductionLedgerEvent[],
): ProvenanceReplayProjection {
  const acceptedCandidateIds: string[] = [];
  const adjudications: AdjudicationAudit[] = [];
  const conflictIds: string[] = [];
  const dedupGroupIds: string[] = [];
  const dispositions: CandidateDisposition[] = [];
  const registrations: Record<string, unknown>[] = [];
  const schedules: SourceBucketSchedule[] = [];
  let completed: Record<string, unknown> | null = null;
  let fleet: FleetScopeReceipt | null = null;
  let policy: Record<string, unknown> | null = null;

  for (let index = 0; index < ledger.length; index += 1) {
    const event = ledger[index];
    const digest = eventDigest(event);
    if (
      event.sequence !== index
      || event.eventDigest !== digest
      || event.eventId !== `reduction-event-${digest}`
    ) {
      throw new TypeError('Provenance reduction ledger event failed replay verification');
    }
    const payload = recordOf(event.payload);
    switch (event.eventType) {
      case 'candidate.accepted':
        acceptedCandidateIds.push(requiredString(payload.candidateId, 'candidateId'));
        break;
      case 'adjudication.resolved':
        adjudications.push(payload as unknown as AdjudicationAudit);
        break;
      case 'candidate.dispositioned':
        dispositions.push(payload as unknown as CandidateDisposition);
        break;
      case 'conflict.formed':
        conflictIds.push(requiredString(payload.conflictId, 'conflictId'));
        break;
      case 'dedup.grouped':
        dedupGroupIds.push(requiredString(payload.canonicalItemId, 'canonicalItemId'));
        break;
      case 'fleet.scoped':
        if (fleet !== null) throw new TypeError('Provenance replay found duplicate fleet evidence');
        fleet = payload as unknown as FleetScopeReceipt;
        break;
      case 'policy.bound':
        if (policy !== null) throw new TypeError('Provenance replay found duplicate policy evidence');
        policy = payload;
        break;
      case 'reduction.completed':
        if (completed !== null) throw new TypeError('Provenance replay found duplicate completion evidence');
        completed = payload;
        break;
      case 'source.registered':
        registrations.push(payload);
        break;
      case 'bucket.scheduled':
        schedules.push(payload as unknown as SourceBucketSchedule);
        break;
      default:
        break;
    }
  }
  if (completed === null || fleet === null || policy === null) {
    throw new TypeError('Provenance replay evidence is incomplete');
  }
  const policyRecord = recordOf(policy.policy);
  const orderedDispositions = dispositions.sort((left, right) => (
    left.candidateId.localeCompare(right.candidateId)
  ));
  const orderedRegistrations = registrations.sort((left, right) => (
    requiredString(left.resultEnvelopeId, 'resultEnvelopeId')
      .localeCompare(requiredString(right.resultEnvelopeId, 'resultEnvelopeId'))
  ));
  return Object.freeze({
    acceptedCandidateIds: Object.freeze(acceptedCandidateIds.sort()),
    adjudications: Object.freeze(adjudications.sort((left, right) => (
      left.semanticEquivalenceKey.localeCompare(right.semanticEquivalenceKey)
    ))),
    conflictIds: Object.freeze(conflictIds.sort()),
    dedupGroupIds: Object.freeze(dedupGroupIds.sort()),
    dispositionDigest: stableDigest(orderedDispositions),
    fleet,
    outputDigest: requiredString(completed.outputDigest, 'outputDigest'),
    outputOrder: Object.freeze(requiredStringArray(completed.outputOrder, 'outputOrder')),
    policyDigest: requiredString(policy.policyDigest, 'policyDigest'),
    policyId: requiredString(policyRecord.policyId, 'policyId'),
    policyVersion: Number(policyRecord.policyVersion),
    schedules: Object.freeze(schedules.sort((left, right) => (
      left.sourceBucketId.localeCompare(right.sourceBucketId)
    ))),
    sourceRegistrationDigest: stableDigest(orderedRegistrations),
  });
}

/** Verify ledger identities and all output, receipt, and replay digests. */
export function replayProvenanceReduction(
  result: ProvenanceReductionResult,
): ProvenanceReplayResult {
  const projection = replayProvenanceLedger(result.ledger);
  const ledgerDigests = result.ledger.map((event) => event.eventDigest);
  const ledgerHeadDigest = stableDigest(ledgerDigests);
  if (
    ledgerHeadDigest !== result.receipt.ledgerHeadDigest
    || ledgerDigests.join('|') !== result.receipt.ledgerEventDigests.join('|')
    || canonicalJson(result.output) !== result.outputBytes
    || stableDigest(projection.acceptedCandidateIds)
      !== stableDigest(result.receipt.acceptedCandidateIds)
    || stableDigest(projection.adjudications) !== stableDigest(result.receipt.adjudications)
    || stableDigest(projection.conflictIds) !== stableDigest(result.receipt.conflictIds)
    || projection.dispositionDigest !== result.receipt.dispositionDigest
    || stableDigest(projection.fleet) !== stableDigest(result.receipt.fleet)
    || projection.outputDigest !== result.receipt.outputDigest
    || stableDigest(projection.outputOrder) !== stableDigest(result.receipt.outputOrder)
    || projection.policyDigest !== result.receipt.policyDigest
    || projection.policyId !== result.receipt.policyId
    || projection.policyVersion !== result.receipt.policyVersion
    || stableDigest(projection.schedules) !== stableDigest(result.receipt.schedules)
    || projection.sourceRegistrationDigest !== result.receipt.sourceRegistrationDigest
  ) {
    throw new TypeError('Provenance reduction artifact differs from its replay receipt');
  }
  const { outputDigest: ignoredOutputDigest, ...outputCore } = result.output;
  void ignoredOutputDigest;
  if (stableDigest(outputCore) !== result.output.outputDigest) {
    throw new TypeError('Provenance reduction output digest failed replay verification');
  }
  const { receiptDigest: ignoredReceiptDigest, ...receiptCore } = result.receipt;
  void ignoredReceiptDigest;
  if (stableDigest(receiptCore) !== result.receipt.receiptDigest) {
    throw new TypeError('Provenance reduction receipt digest failed replay verification');
  }
  const replayFingerprint = stableDigest({
    conditionalReducerInputDigest: result.receipt.conditionalReducerInputDigest,
    ledgerHeadDigest,
    outputDigest: result.output.outputDigest,
    partialFailureReplayFingerprint: result.receipt.partialFailureReplayFingerprint,
    policyDigest: result.receipt.policyDigest,
    sourceRegistrationDigest: result.receipt.sourceRegistrationDigest,
  });
  if (replayFingerprint !== result.receipt.replayFingerprint) {
    throw new TypeError('Provenance reduction replay fingerprint differs from evidence');
  }
  return Object.freeze({
    ledgerHeadDigest,
    outputDigest: result.output.outputDigest,
    receiptDigest: result.receipt.receiptDigest,
    replayFingerprint,
  });
}
