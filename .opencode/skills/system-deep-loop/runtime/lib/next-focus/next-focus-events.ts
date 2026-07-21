// ──────────────────────────────────────────────────────────────────
// MODULE: Next Focus Events
// ─────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  EventTypeRegistry,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from '../authorized-ledger/index.js';
import { validateNextFocusCandidate } from './next-focus-candidates.js';
import { NextFocusError, NextFocusErrorCodes } from './next-focus-errors.js';
import {
  NEXT_FOCUS_SCORING_POLICY_VERSION,
  canonicalizeNextFocusRejectedCandidates,
  compareScoredNextFocusCandidates,
} from './next-focus-selection.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeDefinition,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  NextFocusCandidate,
  NextFocusComparatorTier,
  NextFocusDecision,
  NextFocusRecordResult,
  ScoredNextFocusCandidate,
} from './next-focus-types.js';

export const NEXT_FOCUS_SELECTED_EVENT_TYPE = 'deep-loop.next-focus.selected';
export const NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE = 'deep-loop.next-focus.unavailable';
export const NEXT_FOCUS_EVENT_VERSION = 1;

const COMMON_PAYLOAD_FIELDS = [
  'decision_id',
  'decision_identity',
  'outcome',
  'policy_version',
  'source_projection_watermark',
  'source_projection_version',
  'source_evidence_ids',
  'source_fingerprint',
  'candidate_set_fingerprint',
  'previous_focus',
  'ranked_frontier',
  'rejected_candidates',
  'comparator_trace',
] as const;

export interface NextFocusEventInput {
  readonly decision: NextFocusDecision;
  readonly streamId: string;
  readonly streamSequence: number;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateCommonPayload(payload: Readonly<JsonObject>): boolean {
  return typeof payload.decision_id === 'string'
    && isRecord(payload.decision_identity)
    && typeof payload.policy_version === 'string'
    && typeof payload.source_projection_watermark === 'string'
    && typeof payload.source_projection_version === 'string'
    && Array.isArray(payload.source_evidence_ids)
    && typeof payload.source_fingerprint === 'string'
    && typeof payload.candidate_set_fingerprint === 'string'
    && (typeof payload.previous_focus === 'string' || payload.previous_focus === null)
    && Array.isArray(payload.ranked_frontier)
    && Array.isArray(payload.rejected_candidates)
    && Array.isArray(payload.comparator_trace);
}

function sameCanonical(left: unknown, right: unknown): boolean {
  return sha256Bytes(canonicalBytes(left)) === sha256Bytes(canonicalBytes(right));
}

function validInteger(value: unknown, minimum = 0): value is number {
  return Number.isSafeInteger(value) && (value as number) >= minimum;
}

function decisiveTier(
  winner: ScoredNextFocusCandidate,
  compared: ScoredNextFocusCandidate,
): NextFocusComparatorTier {
  if (winner.scoreBps !== compared.scoreBps) return 'score';
  if (winner.contradictionUrgencyBps !== compared.contradictionUrgencyBps) {
    return 'contradiction_urgency';
  }
  if (winner.coverageGapBps !== compared.coverageGapBps) return 'coverage_gap';
  if (winner.noveltyDecayBps !== compared.noveltyDecayBps) return 'novelty_decay';
  return 'candidate_id';
}

function validatedCandidate(
  value: unknown,
  payload: Readonly<JsonObject>,
): NextFocusCandidate | null {
  const validation = validateNextFocusCandidate(value);
  if (!validation.valid) return null;
  const candidate = validation.candidate;
  return candidate.projectionWatermark === payload.source_projection_watermark
    && candidate.projectionVersion === payload.source_projection_version
    && candidate.sourceFingerprint === payload.source_fingerprint
    && sameCanonical(candidate.evidenceRefs, payload.source_evidence_ids)
    && sameCanonical(candidate.snapshotEvidenceIds, payload.source_evidence_ids)
    ? candidate
    : null;
}

function validatedFrontier(
  payload: Readonly<JsonObject>,
): readonly ScoredNextFocusCandidate[] | null {
  if (!Array.isArray(payload.ranked_frontier)) return null;
  const frontier: ScoredNextFocusCandidate[] = [];
  for (const [index, value] of payload.ranked_frontier.entries()) {
    if (!isRecord(value)) return null;
    const candidate = validatedCandidate(value.candidate, payload);
    if (
      candidate === null
      || value.rank !== index + 1
      || !validInteger(value.coverageGapBps)
      || !validInteger(value.contradictionUrgencyBps)
      || !validInteger(value.noveltyDecayBps)
      || !validInteger(value.scoreBps)
      || value.coverageGapBps !== candidate.signals.coverageGap.bps
      || value.contradictionUrgencyBps !== candidate.signals.contradictionUrgency.bps
      || value.noveltyDecayBps !== candidate.signals.noveltyDecay.bps
      || value.scoreBps !== value.coverageGapBps
        + value.contradictionUrgencyBps
        + (10_000 - value.noveltyDecayBps)
    ) {
      return null;
    }
    frontier.push(Object.freeze({
      rank: value.rank,
      candidate,
      coverageGapBps: value.coverageGapBps,
      contradictionUrgencyBps: value.contradictionUrgencyBps,
      noveltyDecayBps: value.noveltyDecayBps,
      scoreBps: value.scoreBps,
    }));
  }
  const sorted = [...frontier].sort(compareScoredNextFocusCandidates);
  return sameCanonical(frontier, sorted) ? Object.freeze(frontier) : null;
}

function frontierFingerprint(frontier: readonly ScoredNextFocusCandidate[]): string {
  return sha256Bytes(canonicalBytes(frontier.map((entry) => ({
    rank: entry.rank,
    candidate: entry.candidate,
    coverageGapBps: entry.coverageGapBps,
    contradictionUrgencyBps: entry.contradictionUrgencyBps,
    noveltyDecayBps: entry.noveltyDecayBps,
    scoreBps: entry.scoreBps,
  }))));
}

function semanticPayloadValid(payload: Readonly<JsonObject>): boolean {
  if (!validateCommonPayload(payload) || !isRecord(payload.decision_identity)) return false;
  const identity = payload.decision_identity;
  if (
    typeof identity.runId !== 'string'
    || identity.runId.trim() === ''
    || !validInteger(identity.sourceIteration)
    || identity.projectionWatermark !== payload.source_projection_watermark
    || identity.policyVersion !== NEXT_FOCUS_SCORING_POLICY_VERSION
    || payload.policy_version !== NEXT_FOCUS_SCORING_POLICY_VERSION
    || payload.decision_id !== `next-focus-${sha256Bytes(canonicalBytes(identity))}`
  ) {
    return false;
  }
  const expectedSourceFingerprint = sha256Bytes(canonicalBytes({
    projectionWatermark: payload.source_projection_watermark,
    projectionVersion: payload.source_projection_version,
    evidenceIds: payload.source_evidence_ids,
  }));
  if (payload.source_fingerprint !== expectedSourceFingerprint) return false;
  const frontier = validatedFrontier(payload);
  if (
    frontier === null
    || payload.candidate_set_fingerprint !== frontierFingerprint(frontier)
    || !Array.isArray(payload.comparator_trace)
  ) {
    return false;
  }
  const expectedTrace = frontier.length === 0 ? [] : frontier.slice(1).map((compared) => ({
    winnerCandidateId: frontier[0].candidate.id,
    comparedCandidateId: compared.candidate.id,
    decisiveTier: decisiveTier(frontier[0], compared),
  }));
  return sameCanonical(payload.comparator_trace, expectedTrace);
}

function validateSelectedPayload(payload: Readonly<JsonObject>): boolean {
  const frontier = validatedFrontier(payload);
  return semanticPayloadValid(payload)
    && payload.outcome === 'next_focus_selected'
    && frontier !== null
    && frontier.length > 0
    && validatedCandidate(payload.selected_candidate, payload) !== null
    && sameCanonical(payload.selected_candidate, frontier[0].candidate);
}

function validateUnavailablePayload(payload: Readonly<JsonObject>): boolean {
  return semanticPayloadValid(payload)
    && payload.outcome === 'next_focus_unavailable'
    && payload.unavailable_reason === 'empty_accepted_frontier'
    && Array.isArray(payload.ranked_frontier)
    && payload.ranked_frontier.length === 0;
}

function payloadFor(decision: NextFocusDecision): JsonObject {
  const common = {
    decision_id: decision.decisionId,
    decision_identity: decision.identity,
    outcome: decision.outcome,
    policy_version: decision.policyVersion,
    source_projection_watermark: decision.sourceSnapshot.projectionWatermark,
    source_projection_version: decision.sourceSnapshot.projectionVersion,
    source_evidence_ids: decision.sourceSnapshot.evidenceIds,
    source_fingerprint: decision.sourceSnapshot.sourceFingerprint,
    candidate_set_fingerprint: decision.candidateSetFingerprint,
    previous_focus: decision.previousFocus,
    ranked_frontier: decision.rankedFrontier,
    rejected_candidates: canonicalizeNextFocusRejectedCandidates(decision.rejectedCandidates),
    comparator_trace: decision.comparatorTrace,
  };
  return decision.outcome === 'next_focus_selected'
    ? { ...common, selected_candidate: decision.selectedCandidate } as unknown as JsonObject
    : { ...common, unavailable_reason: decision.unavailableReason } as unknown as JsonObject;
}

function receiptFor(event: VerifiedLedgerEvent): DurableAppendReceipt {
  return Object.freeze({
    ...event.frame.receipt,
    canonicalEventHash: event.frame.canonical_event_hash,
    recordHash: event.frame.record_hash,
    authorizationRef: event.frame.authorization_ref,
  });
}

function eventPayloadDigest(event: VerifiedLedgerEvent): string {
  return sha256Bytes(canonicalBytes(event.event.effective.envelope.payload));
}

function expectedEventType(decision: NextFocusDecision): string {
  return decision.outcome === 'next_focus_selected'
    ? NEXT_FOCUS_SELECTED_EVENT_TYPE
    : NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE;
}

function conflict(decisionId: string): NextFocusError {
  return new NextFocusError(
    NextFocusErrorCodes.CONFLICTING_REPLAY,
    `Decision identity "${decisionId}" is already bound to a different semantic payload.`,
    { decisionId },
  );
}

async function findExisting(
  ledger: AppendOnlyLedger,
  decisionId: string,
): Promise<VerifiedLedgerEvent | null> {
  const matches = (await ledger.readVerifiedEvents()).filter(
    (entry) => entry.event.effective.envelope.event_id === decisionId,
  );
  if (matches.length > 1) throw conflict(decisionId);
  return matches[0] ?? null;
}

/** Return the two closed event definitions used by shadow next-focus recording. */
export function nextFocusEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    {
      eventType: NEXT_FOCUS_SELECTED_EVENT_TYPE,
      currentVersion: NEXT_FOCUS_EVENT_VERSION,
      versions: [{
        version: NEXT_FOCUS_EVENT_VERSION,
        payload: {
          requiredFields: [...COMMON_PAYLOAD_FIELDS, 'selected_candidate'],
          validate: validateSelectedPayload,
        },
      }],
      upcasters: [],
    },
    {
      eventType: NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE,
      currentVersion: NEXT_FOCUS_EVENT_VERSION,
      versions: [{
        version: NEXT_FOCUS_EVENT_VERSION,
        payload: {
          requiredFields: [...COMMON_PAYLOAD_FIELDS, 'unavailable_reason'],
          validate: validateUnavailablePayload,
        },
      }],
      upcasters: [],
    },
  ]);
}

/** Create a standalone registry for next-focus events. */
export function createNextFocusEventRegistry(): EventTypeRegistry {
  return new EventTypeRegistry(nextFocusEventDefinitions());
}

/** Build canonical event bytes whose identity is the deterministic decision identity. */
export function prepareNextFocusEvent(
  input: NextFocusEventInput,
  registry: EventTypeRegistry,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.decision.decisionId,
    event_type: expectedEventType(input.decision),
    event_version: NEXT_FOCUS_EVENT_VERSION,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: input.decision.decisionId,
    payload: payloadFor(input.decision),
  }, registry);
}

/** Append once, accept semantic retries, and reject conflicting identity reuse. */
export async function recordNextFocusDecision(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<NextFocusRecordResult> {
  const decisionId = event.envelope.payload.decision_id;
  if (
    typeof decisionId !== 'string'
    || event.envelope.event_id !== decisionId
    || (
      event.envelope.event_type !== NEXT_FOCUS_SELECTED_EVENT_TYPE
      && event.envelope.event_type !== NEXT_FOCUS_UNAVAILABLE_EVENT_TYPE
    )
  ) {
    throw new NextFocusError(
      NextFocusErrorCodes.INVALID_INPUT,
      'Next-focus event identity, payload, and event type are inconsistent.',
    );
  }

  const semanticDigest = sha256Bytes(canonicalBytes(event.envelope.payload));
  const existing = await findExisting(ledger, decisionId);
  if (existing !== null) {
    if (
      existing.event.effective.envelope.event_type !== event.envelope.event_type
      || eventPayloadDigest(existing) !== semanticDigest
    ) {
      throw conflict(decisionId);
    }
    return Object.freeze({ receipt: receiptFor(existing), idempotent: true });
  }

  try {
    const receipt = await ledger.appendAuthorized(event, proof);
    return Object.freeze({ receipt, idempotent: false });
  } catch (error: unknown) {
    if (
      !(error instanceof AuthorizedLedgerError)
      || error.code !== AuthorizedLedgerErrorCodes.EVENT_ID_CONFLICT
    ) {
      throw error;
    }
    const concurrent = await findExisting(ledger, decisionId);
    if (
      concurrent === null
      || concurrent.event.effective.envelope.event_type !== event.envelope.event_type
      || eventPayloadDigest(concurrent) !== semanticDigest
    ) {
      throw conflict(decisionId);
    }
    return Object.freeze({ receipt: receiptFor(concurrent), idempotent: true });
  }
}
