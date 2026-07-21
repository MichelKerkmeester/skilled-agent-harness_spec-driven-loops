// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Projection
// ───────────────────────────────────────────────────────────────────

import {
  canonicalJson,
} from '../event-envelope/index.js';
import {
  ClaimRelationshipError,
  ClaimRelationshipErrorCodes,
} from './errors.js';
import {
  CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
  RelationshipEventTypes,
  contradictionRelationshipId,
  supersessionRelationshipId,
} from './event-registry.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  EventEnvelope,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  ActiveRelationshipProjection,
  ClaimRelationshipProjection,
  ClaimRelationshipStatusProjection,
  ContradictionEventPayload,
  RelationshipEvidenceRef,
  RelationshipEvidenceState,
  RelationshipHistoryRecord,
  RelationshipReferenceSnapshot,
  SupersessionEventPayload,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. INITIAL STATE
// ───────────────────────────────────────────────────────────────────

function compareText(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

/** Create the empty disposable status projection. */
export function createEmptyClaimRelationshipProjection(
  snapshot?: RelationshipReferenceSnapshot,
): ClaimRelationshipProjection {
  if (snapshot !== undefined) return materialize([], snapshot);
  return Object.freeze({
    projection_schema_version: CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
    authority_mode: 'additive-dark',
    history: [],
    active_relationships: [],
    claims: {},
    canonical_active_contradiction_count: 0,
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. DOMAIN VALIDATION
// ───────────────────────────────────────────────────────────────────

function requireClaimReference(
  claimId: string,
  snapshot: RelationshipReferenceSnapshot,
): void {
  if (!snapshot.claim_ids.includes(claimId)) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.REFERENCE_MISSING,
      'Relationship event references an unknown claim',
      { claimId },
    );
  }
}

function requireEvidenceReferences(
  evidenceRefs: readonly RelationshipEvidenceRef[],
  snapshot: RelationshipReferenceSnapshot,
): void {
  for (const reference of evidenceRefs) {
    const catalog = snapshot.evidence_records.find(
      (entry) => entry.evidence_id === reference.evidence_id,
    );
    if (
      !catalog
      || catalog.locator !== reference.locator
      || catalog.digest !== reference.digest
    ) {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.REFERENCE_MISSING,
        'Relationship event evidence does not resolve to the immutable reference snapshot',
        { evidenceId: reference.evidence_id },
      );
    }
  }
}

function requireSnapshotBinding(
  payload: ContradictionEventPayload | SupersessionEventPayload,
  snapshot: RelationshipReferenceSnapshot,
): void {
  if (payload.evidence_snapshot_ref !== snapshot.snapshot_ref) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.REFERENCE_MISSING,
      'Relationship event is bound to a different evidence snapshot',
      {
        expectedSnapshotRef: snapshot.snapshot_ref,
        actualSnapshotRef: payload.evidence_snapshot_ref,
      },
    );
  }
  requireEvidenceReferences(payload.evidence_refs, snapshot);
}

function asContradictionPayload(payload: Readonly<JsonObject>): ContradictionEventPayload {
  return payload as unknown as ContradictionEventPayload;
}

function asSupersessionPayload(payload: Readonly<JsonObject>): SupersessionEventPayload {
  return payload as unknown as SupersessionEventPayload;
}

function assertContradiction(
  payload: ContradictionEventPayload,
  snapshot: RelationshipReferenceSnapshot,
): void {
  if (payload.left_claim_id === payload.right_claim_id) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.SELF_RELATION,
      'A claim cannot contradict itself',
      { claimId: payload.left_claim_id },
    );
  }
  if (payload.left_claim_id >= payload.right_claim_id) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.NON_CANONICAL_PAIR,
      'Contradiction endpoints must use canonical lexical order',
      {
        leftClaimId: payload.left_claim_id,
        rightClaimId: payload.right_claim_id,
      },
    );
  }
  const expectedId = contradictionRelationshipId(
    payload.left_claim_id,
    payload.right_claim_id,
    payload.incompatibility_scope,
  );
  if (payload.relationship_id !== expectedId) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.RELATIONSHIP_ID_MISMATCH,
      'Contradiction identity does not match its canonical endpoints and scope',
      { expectedId, actualId: payload.relationship_id },
    );
  }
  requireClaimReference(payload.left_claim_id, snapshot);
  requireClaimReference(payload.right_claim_id, snapshot);
  requireSnapshotBinding(payload, snapshot);
}

function assertSupersession(
  payload: SupersessionEventPayload,
  snapshot: RelationshipReferenceSnapshot,
): void {
  if (payload.predecessor_claim_id === payload.successor_claim_id) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.SELF_RELATION,
      'A claim cannot supersede itself',
      { claimId: payload.predecessor_claim_id },
    );
  }
  const expectedId = supersessionRelationshipId(
    payload.predecessor_claim_id,
    payload.successor_claim_id,
    payload.replacement_scope,
  );
  if (payload.relationship_id !== expectedId) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.RELATIONSHIP_ID_MISMATCH,
      'Supersession identity does not match its directed endpoints and scope',
      { expectedId, actualId: payload.relationship_id },
    );
  }
  requireClaimReference(payload.predecessor_claim_id, snapshot);
  requireClaimReference(payload.successor_claim_id, snapshot);
  requireSnapshotBinding(payload, snapshot);
}

function activeHistory(
  history: readonly RelationshipHistoryRecord[],
): readonly RelationshipHistoryRecord[] {
  return history.filter((record) => record.withdrawal_event_id === null);
}

function assertNoActiveDuplicate(
  history: readonly RelationshipHistoryRecord[],
  relationshipId: string,
): void {
  if (activeHistory(history).some((record) => record.relationship_id === relationshipId)) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.DUPLICATE_ACTIVE_RELATION,
      'A canonical relationship already has an active assertion',
      { relationshipId },
    );
  }
}

function assertNoCompetingSuccessor(
  history: readonly RelationshipHistoryRecord[],
  predecessorClaimId: string,
  successorClaimId: string,
): void {
  const competing = activeHistory(history).find(
    (record) => record.kind === 'SUPERSESSION'
      && record.source_claim_id === predecessorClaimId
      && record.counterpart_claim_id !== successorClaimId,
  );
  if (competing) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.COMPETING_SUCCESSOR,
      'A predecessor cannot have two active replacement claims',
      {
        predecessorClaimId,
        activeSuccessorClaimId: competing.counterpart_claim_id,
        proposedSuccessorClaimId: successorClaimId,
      },
    );
  }
}

function assertNoSupersessionCycle(
  history: readonly RelationshipHistoryRecord[],
  predecessorClaimId: string,
  successorClaimId: string,
): void {
  const successorByPredecessor = new Map<string, string>();
  for (const record of activeHistory(history)) {
    if (record.kind === 'SUPERSESSION') {
      successorByPredecessor.set(record.source_claim_id, record.counterpart_claim_id);
    }
  }
  successorByPredecessor.set(predecessorClaimId, successorClaimId);
  const visited = new Set<string>();
  let current: string | undefined = predecessorClaimId;
  while (current !== undefined) {
    if (visited.has(current)) {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.SUPERSESSION_CYCLE,
        'Supersession relations must remain acyclic',
        { claimId: current },
      );
    }
    visited.add(current);
    current = successorByPredecessor.get(current);
  }
}

function relationCoreMatches(
  target: RelationshipHistoryRecord,
  kind: 'CONTRADICTION' | 'SUPERSESSION',
  sourceClaimId: string,
  counterpartClaimId: string,
  relationshipId: string,
  scope: string,
): boolean {
  return target.kind === kind
    && target.source_claim_id === sourceClaimId
    && target.counterpart_claim_id === counterpartClaimId
    && target.relationship_id === relationshipId
    && target.scope === scope;
}

function withdrawalTarget(
  history: readonly RelationshipHistoryRecord[],
  retractsEventId: string | undefined,
): RelationshipHistoryRecord {
  if (retractsEventId === undefined) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.AMBIGUOUS_WITHDRAWAL,
      'A withdrawal must identify the assertion event it counteracts',
    );
  }
  const matches = history.filter((record) => record.assertion_event_id === retractsEventId);
  if (matches.length !== 1 || matches[0].withdrawal_event_id !== null) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.AMBIGUOUS_WITHDRAWAL,
      'Withdrawal target is absent, ambiguous, or already withdrawn',
      { retractsEventId },
    );
  }
  return matches[0];
}

// ───────────────────────────────────────────────────────────────────
// 3. PROJECTION MATERIALIZATION
// ───────────────────────────────────────────────────────────────────

function evidenceState(record: RelationshipHistoryRecord): RelationshipEvidenceState {
  return Object.freeze({
    assertion_event_id: record.assertion_event_id,
    withdrawal_event_id: record.withdrawal_event_id,
    evidence_refs: record.evidence_state.evidence_refs.map((reference) => ({ ...reference })),
    assertion_evidence_refs: record.evidence_state.assertion_evidence_refs.map(
      (reference) => ({ ...reference }),
    ),
    withdrawal_evidence_refs: record.evidence_state.withdrawal_evidence_refs.map(
      (reference) => ({ ...reference }),
    ),
    evidence_snapshot_ref: record.evidence_state.evidence_snapshot_ref,
  });
}

function activeRelationship(record: RelationshipHistoryRecord): ActiveRelationshipProjection {
  return Object.freeze({
    relationship_id: record.relationship_id,
    kind: record.kind,
    source_claim_id: record.source_claim_id,
    counterpart_claim_id: record.counterpart_claim_id,
    scope: record.scope,
    assertion_event_id: record.assertion_event_id,
    detector_version: record.detector_version,
    semantic_community_ids: [...record.semantic_community_ids],
    evidence_state: evidenceState(record),
  });
}

function sorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort(compareText);
}

function claimProjection(
  claimId: string,
  active: readonly RelationshipHistoryRecord[],
): ClaimRelationshipStatusProjection {
  const contradictions = active.filter(
    (record) => record.kind === 'CONTRADICTION'
      && (record.source_claim_id === claimId || record.counterpart_claim_id === claimId),
  );
  const supersededBy = active.filter(
    (record) => record.kind === 'SUPERSESSION' && record.source_claim_id === claimId,
  );
  const supersedes = active.filter(
    (record) => record.kind === 'SUPERSESSION' && record.counterpart_claim_id === claimId,
  );
  const incident = active.filter(
    (record) => record.source_claim_id === claimId || record.counterpart_claim_id === claimId,
  );
  const successorByPredecessor = new Map<string, string>();
  for (const record of active) {
    if (record.kind === 'SUPERSESSION') {
      successorByPredecessor.set(record.source_claim_id, record.counterpart_claim_id);
    }
  }
  let terminalSuccessorClaimId: string | null = null;
  let current = successorByPredecessor.get(claimId);
  while (current !== undefined) {
    terminalSuccessorClaimId = current;
    current = successorByPredecessor.get(current);
  }
  return Object.freeze({
    claim_id: claimId,
    status: supersededBy.length > 0
      ? 'superseded'
      : contradictions.length > 0
        ? 'contested'
        : 'active',
    active_contradiction_relation_ids: sorted(
      contradictions.map((record) => record.relationship_id),
    ),
    active_incoming_supersession_relation_ids: sorted(
      supersededBy.map((record) => record.relationship_id),
    ),
    active_outgoing_supersession_relation_ids: sorted(
      supersedes.map((record) => record.relationship_id),
    ),
    contradiction_counterpart_claim_ids: sorted(contradictions.map(
      (record) => record.source_claim_id === claimId
        ? record.counterpart_claim_id
        : record.source_claim_id,
    )),
    predecessor_claim_ids: sorted(supersedes.map((record) => record.source_claim_id)),
    successor_claim_ids: sorted(supersededBy.map((record) => record.counterpart_claim_id)),
    terminal_successor_claim_id: terminalSuccessorClaimId,
    evidence_state: incident
      .sort((left, right) => compareText(left.relationship_id, right.relationship_id))
      .map(evidenceState),
  });
}

function materialize(
  historyInput: readonly RelationshipHistoryRecord[],
  snapshot: RelationshipReferenceSnapshot,
): ClaimRelationshipProjection {
  const history = [...historyInput].sort(
    (left, right) => left.assertion_sequence - right.assertion_sequence,
  );
  const active = [...activeHistory(history)].sort(
    (left, right) => compareText(left.relationship_id, right.relationship_id),
  );
  const claims: Record<string, ClaimRelationshipStatusProjection> = Object.create(null);
  for (const claimId of snapshot.claim_ids) {
    claims[claimId] = claimProjection(claimId, active);
  }
  return Object.freeze({
    projection_schema_version: CLAIM_RELATIONSHIP_PROJECTION_SCHEMA_VERSION,
    authority_mode: 'additive-dark',
    history: history.map((record) => Object.freeze({ ...record })),
    active_relationships: active.map(activeRelationship),
    claims: Object.freeze(claims),
    canonical_active_contradiction_count: active.filter(
      (record) => record.kind === 'CONTRADICTION',
    ).length,
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. DETERMINISTIC FOLD
// ───────────────────────────────────────────────────────────────────

function assertionRecord(
  envelope: Readonly<EventEnvelope>,
  sequence: number,
): RelationshipHistoryRecord {
  if (envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED) {
    const payload = asContradictionPayload(envelope.payload);
    return Object.freeze({
      relationship_id: payload.relationship_id,
      kind: 'CONTRADICTION',
      source_claim_id: payload.left_claim_id,
      counterpart_claim_id: payload.right_claim_id,
      scope: payload.incompatibility_scope,
      assertion_event_id: envelope.event_id,
      assertion_sequence: sequence,
      withdrawal_event_id: null,
      withdrawal_sequence: null,
      detector_version: payload.detector_version,
      semantic_community_ids: [...payload.semantic_community_ids],
      provenance_refs: [...payload.provenance_refs],
      independence_refs: [...payload.independence_refs],
      evidence_state: Object.freeze({
        assertion_event_id: envelope.event_id,
        withdrawal_event_id: null,
        evidence_refs: payload.evidence_refs.map((reference) => ({ ...reference })),
        assertion_evidence_refs: payload.evidence_refs.map((reference) => ({ ...reference })),
        withdrawal_evidence_refs: [],
        evidence_snapshot_ref: payload.evidence_snapshot_ref,
      }),
    });
  }
  const payload = asSupersessionPayload(envelope.payload);
  return Object.freeze({
    relationship_id: payload.relationship_id,
    kind: 'SUPERSESSION',
    source_claim_id: payload.predecessor_claim_id,
    counterpart_claim_id: payload.successor_claim_id,
    scope: payload.replacement_scope,
    assertion_event_id: envelope.event_id,
    assertion_sequence: sequence,
    withdrawal_event_id: null,
    withdrawal_sequence: null,
    detector_version: payload.detector_version,
    semantic_community_ids: [...payload.semantic_community_ids],
    provenance_refs: [...payload.provenance_refs],
    independence_refs: [...payload.independence_refs],
    evidence_state: Object.freeze({
      assertion_event_id: envelope.event_id,
      withdrawal_event_id: null,
      evidence_refs: payload.evidence_refs.map((reference) => ({ ...reference })),
      assertion_evidence_refs: payload.evidence_refs.map((reference) => ({ ...reference })),
      withdrawal_evidence_refs: [],
      evidence_snapshot_ref: payload.evidence_snapshot_ref,
    }),
  });
}

function validateAssertion(
  history: readonly RelationshipHistoryRecord[],
  envelope: Readonly<EventEnvelope>,
  snapshot: RelationshipReferenceSnapshot,
): void {
  if (envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED) {
    const payload = asContradictionPayload(envelope.payload);
    assertContradiction(payload, snapshot);
    assertNoActiveDuplicate(history, payload.relationship_id);
    return;
  }
  if (envelope.event_type === RelationshipEventTypes.SUPERSESSION_RECORDED) {
    const payload = asSupersessionPayload(envelope.payload);
    assertSupersession(payload, snapshot);
    assertNoActiveDuplicate(history, payload.relationship_id);
    assertNoCompetingSuccessor(
      history,
      payload.predecessor_claim_id,
      payload.successor_claim_id,
    );
    assertNoSupersessionCycle(
      history,
      payload.predecessor_claim_id,
      payload.successor_claim_id,
    );
    return;
  }
  throw new ClaimRelationshipError(
    ClaimRelationshipErrorCodes.REPLAY_INVALID,
    'Relationship fold encountered an unregistered event type',
    { eventType: envelope.event_type },
  );
}

function applyWithdrawal(
  history: readonly RelationshipHistoryRecord[],
  envelope: Readonly<EventEnvelope>,
  sequence: number,
  snapshot: RelationshipReferenceSnapshot,
): RelationshipHistoryRecord[] {
  const payload = envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED
    ? asContradictionPayload(envelope.payload)
    : asSupersessionPayload(envelope.payload);
  if (envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED) {
    assertContradiction(payload as ContradictionEventPayload, snapshot);
  } else if (envelope.event_type === RelationshipEventTypes.SUPERSESSION_RECORDED) {
    assertSupersession(payload as SupersessionEventPayload, snapshot);
  } else {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.REPLAY_INVALID,
      'Relationship fold encountered an unregistered withdrawal event type',
      { eventType: envelope.event_type },
    );
  }
  const target = withdrawalTarget(history, payload.retracts_event_id);
  const sourceClaimId = envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED
    ? (payload as ContradictionEventPayload).left_claim_id
    : (payload as SupersessionEventPayload).predecessor_claim_id;
  const counterpartClaimId = envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED
    ? (payload as ContradictionEventPayload).right_claim_id
    : (payload as SupersessionEventPayload).successor_claim_id;
  const scope = envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED
    ? (payload as ContradictionEventPayload).incompatibility_scope
    : (payload as SupersessionEventPayload).replacement_scope;
  const kind = envelope.event_type === RelationshipEventTypes.CONTRADICTION_RECORDED
    ? 'CONTRADICTION'
    : 'SUPERSESSION';
  if (!relationCoreMatches(
    target,
    kind,
    sourceClaimId,
    counterpartClaimId,
    payload.relationship_id,
    scope,
  )) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.AMBIGUOUS_WITHDRAWAL,
      'Withdrawal payload does not identify the same canonical relationship as its target',
      { retractsEventId: payload.retracts_event_id ?? null },
    );
  }
  return history.map((record) => record.assertion_event_id === target.assertion_event_id
    ? Object.freeze({
      ...record,
      withdrawal_event_id: envelope.event_id,
      withdrawal_sequence: sequence,
      evidence_state: Object.freeze({
        ...record.evidence_state,
        withdrawal_event_id: envelope.event_id,
        evidence_refs: [
          ...record.evidence_state.assertion_evidence_refs,
          ...payload.evidence_refs,
        ],
        withdrawal_evidence_refs: payload.evidence_refs.map((reference) => ({ ...reference })),
      }),
    })
    : record);
}

/** Apply one validated envelope without mutating prior history. */
export function reduceClaimRelationshipEnvelope(
  state: Readonly<ClaimRelationshipProjection>,
  envelope: Readonly<EventEnvelope>,
  sequence: number,
  snapshot: RelationshipReferenceSnapshot,
): ClaimRelationshipProjection {
  if (state.history.some((record) =>
    record.assertion_event_id === envelope.event_id
    || record.withdrawal_event_id === envelope.event_id
  )) {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.EVENT_ID_CONFLICT,
      'Relationship fold encountered a repeated event identity',
      { eventId: envelope.event_id },
    );
  }
  const action = envelope.payload.relation_action;
  let history: readonly RelationshipHistoryRecord[];
  if (action === 'assert') {
    validateAssertion(state.history, envelope, snapshot);
    history = [...state.history, assertionRecord(envelope, sequence)];
  } else if (action === 'withdraw') {
    history = applyWithdrawal(state.history, envelope, sequence, snapshot);
  } else {
    throw new ClaimRelationshipError(
      ClaimRelationshipErrorCodes.INVALID_INPUT,
      'Relationship event action is not registered',
      { eventId: envelope.event_id },
    );
  }
  return materialize(history, snapshot);
}

/** Rebuild typed status from fully verified ledger events in stored order. */
export function foldVerifiedClaimRelationships(
  events: readonly VerifiedLedgerEvent[],
  snapshot: RelationshipReferenceSnapshot,
): ClaimRelationshipProjection {
  let state = createEmptyClaimRelationshipProjection(snapshot);
  for (const verified of events) {
    if (verified.event.effective.envelope.stream_sequence !== verified.frame.sequence) {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.REPLAY_INVALID,
        'Relationship stream sequence diverges from durable ledger order',
        {
          eventId: verified.event.effective.envelope.event_id,
          streamSequence: verified.event.effective.envelope.stream_sequence,
          ledgerSequence: verified.frame.sequence,
        },
      );
    }
    state = reduceClaimRelationshipEnvelope(
      state,
      verified.event.effective.envelope,
      verified.frame.sequence,
      snapshot,
    );
  }
  return state;
}

/** Compare two projections by their canonical content. */
export function sameClaimRelationshipProjection(
  left: Readonly<ClaimRelationshipProjection>,
  right: Readonly<ClaimRelationshipProjection>,
): boolean {
  return canonicalJson(left) === canonicalJson(right);
}
