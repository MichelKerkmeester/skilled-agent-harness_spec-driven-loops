// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Reducer
// ───────────────────────────────────────────────────────────────────

import {
  TypedReducerRegistry,
  rebuildProjection,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ContinuityIdentityKinds,
  requireRegisteredIdentity,
} from '../deep-loop/continuity-identity/index.js';
import {
  CLAIM_ADJUDICATION_RECORDED_EVENT,
  CLAIM_CONTINUITY_EVENT_TYPES,
  CLAIM_CONTINUITY_REDUCER_VERSION,
  CLAIM_CONTRADICTION_RECORDED_EVENT,
  CLAIM_CORRECTION_RECORDED_EVENT,
  CLAIM_EVIDENCE_ATTACHED_EVENT,
  CLAIM_LIFECYCLE_RECORDED_EVENT,
  CLAIM_MATCH_RECORDED_EVENT,
  CLAIM_OBSERVATION_ATTACHED_EVENT,
  CLAIM_REGISTERED_EVENT,
  CLAIM_SUPERSESSION_RECORDED_EVENT,
} from './claim-continuity-events.js';
import {
  CLAIM_CONTINUITY_SCHEMA_VERSION,
  ClaimContinuityError,
  ClaimContinuityErrorCodes,
  ClaimEpistemicStatuses,
  ClaimLifecycleStates,
} from './claim-continuity-types.js';

import type {
  AppendOnlyLedger,
  RebuiltProjection,
  TypedReducerDefinition,
} from '../authorized-ledger/index.js';
import type {
  EventReadResult,
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  ContinuityIdentityRef,
  ContinuityIdentityState,
} from '../deep-loop/continuity-identity/index.js';
import type {
  ClaimContinuityRecord,
  ClaimContinuityState,
  ClaimEvidenceRecord,
  ClaimEventJournalEntry,
  ClaimMatchRecord,
  ClaimObservationRecord,
  ClaimRelationshipRecord,
} from './claim-continuity-types.js';

const NON_CORRECTABLE_EVENTS = new Set([
  CLAIM_MATCH_RECORDED_EVENT,
  CLAIM_REGISTERED_EVENT,
  CLAIM_CORRECTION_RECORDED_EVENT,
]);

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function fail(
  code: typeof ClaimContinuityErrorCodes[keyof typeof ClaimContinuityErrorCodes],
  message: string,
  details: Record<string, string | number | boolean | null> = {},
): never {
  throw new ClaimContinuityError(code, message, details);
}

function clone<T>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function eventJournalEntry(event: Readonly<EventReadResult>): ClaimEventJournalEntry {
  const envelope = event.effective.envelope;
  return {
    event_id: envelope.event_id,
    event_type: envelope.event_type,
    ledger_sequence: envelope.stream_sequence,
    payload: clone(envelope.payload),
  };
}

function claimRef(
  identityState: Readonly<ContinuityIdentityState>,
  value: unknown,
): ContinuityIdentityRef {
  return requireRegisteredIdentity(identityState, value, ContinuityIdentityKinds.CLAIM);
}

function emptyRecord(
  ref: ContinuityIdentityRef,
  payload: Readonly<JsonObject>,
  sequence: number,
): ClaimContinuityRecord {
  return {
    claim_ref: ref,
    namespace: String(payload.namespace),
    mint_match_record_id: String(payload.match_record_id),
    mint_identity_event_id: String(payload.mint_identity_event_id),
    mint_request_token_digest: String(payload.mint_request_token_digest),
    provenance_digest: String(payload.provenance_digest),
    lifecycle: ClaimLifecycleStates.PROPOSED,
    epistemic_status: ClaimEpistemicStatuses.UNASSESSED,
    aliases: [],
    normalized_fingerprints: [],
    observations: [],
    evidence: [],
    active_relationship_ids: [],
    historical_relationship_ids: [],
    contributing_event_ids: [],
    corrected_event_ids: [],
    last_applied_ledger_sequence: sequence,
  };
}

function requiredRecord(
  records: Record<string, ClaimContinuityRecord>,
  ref: ContinuityIdentityRef,
): ClaimContinuityRecord {
  const record = records[ref.id];
  if (!record) {
    return fail(
      ClaimContinuityErrorCodes.UNKNOWN_CLAIM,
      'Claim event references an identity without a prior claim registration event',
      { claimId: ref.id },
    );
  }
  return record;
}

function correctedEvents(
  journal: readonly ClaimEventJournalEntry[],
  identityState: Readonly<ContinuityIdentityState>,
): Map<string, ClaimEventJournalEntry> {
  const byId = new Map(journal.map((entry) => [entry.event_id, entry]));
  const corrected = new Map<string, ClaimEventJournalEntry>();
  for (const correction of journal) {
    if (correction.event_type !== CLAIM_CORRECTION_RECORDED_EVENT) continue;
    const ref = claimRef(identityState, correction.payload.claim_ref);
    const targetId = String(correction.payload.target_event_id);
    const target = byId.get(targetId);
    if (!target || target.ledger_sequence >= correction.ledger_sequence) {
      fail(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Correction must reference one earlier event in the verified prefix',
        { eventId: correction.event_id, targetEventId: targetId },
      );
    }
    if (NON_CORRECTABLE_EVENTS.has(target.event_type) || corrected.has(targetId)) {
      fail(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Identity, match, correction, and already-corrected events cannot be voided',
        { targetEventId: targetId },
      );
    }
    const targetRefs = claimRefsFor(target, identityState).map((item) => item.id);
    if (!targetRefs.includes(ref.id)) {
      fail(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Correction claim does not own the target event',
        { claimId: ref.id, targetEventId: targetId },
      );
    }
    corrected.set(targetId, correction);
  }
  return corrected;
}

function claimRefsFor(
  entry: ClaimEventJournalEntry,
  identityState: Readonly<ContinuityIdentityState>,
): ContinuityIdentityRef[] {
  if (entry.event_type === CLAIM_MATCH_RECORDED_EVENT) {
    const match = entry.payload.match_record as Readonly<JsonObject>;
    return match.resolved_claim_ref === null
      ? []
      : [claimRef(identityState, match.resolved_claim_ref)];
  }
  if (entry.event_type === CLAIM_CONTRADICTION_RECORDED_EVENT) {
    return [
      claimRef(identityState, entry.payload.left_claim_id),
      claimRef(identityState, entry.payload.right_claim_id),
    ];
  }
  if (entry.event_type === CLAIM_SUPERSESSION_RECORDED_EVENT) {
    return [
      claimRef(identityState, entry.payload.predecessor_claim_id),
      claimRef(identityState, entry.payload.successor_claim_id),
    ];
  }
  return [claimRef(identityState, entry.payload.claim_ref)];
}

function recordMatch(entry: ClaimEventJournalEntry): ClaimMatchRecord {
  const value = entry.payload.match_record as unknown as ClaimMatchRecord;
  return {
    ...clone(value),
    event_id: entry.event_id,
    ledger_sequence: entry.ledger_sequence,
  } as ClaimMatchRecord;
}

function validateMatchIntegrity(
  match: ClaimMatchRecord,
  identityState: Readonly<ContinuityIdentityState>,
): void {
  for (const candidate of match.candidate_set) {
    claimRef(identityState, candidate.claim_ref);
  }
  const resolvedId = match.resolved_claim_ref === null
    ? null
    : claimRef(identityState, match.resolved_claim_ref).id;
  const body = {
    observation_id: match.observation_id,
    namespace: match.namespace,
    aliases: match.aliases,
    normalized_fingerprint: match.normalized_fingerprint,
    policy_version: match.policy_version,
    policy_digest: match.policy_digest,
    candidate_set: match.candidate_set,
    decision: match.decision,
    reason: match.reason,
    resolved_claim_id: resolvedId,
    provenance_digest: match.provenance_digest,
  };
  const expected = `claim-match-${sha256Bytes(canonicalBytes(body))}`;
  if (match.match_record_id !== expected || match.event_id !== expected) {
    fail(
      ClaimContinuityErrorCodes.MATCH_CONFLICT,
      'Match identity does not content-address its complete decision evidence',
      { matchRecordId: match.match_record_id },
    );
  }
}

function addUnique(values: string[], value: string): void {
  if (!values.includes(value)) values.push(value);
}

function relationshipEndpoints(
  entry: ClaimEventJournalEntry,
  identityState: Readonly<ContinuityIdentityState>,
): {
  kind: 'contradiction' | 'supersession';
  source: ContinuityIdentityRef;
  target: ContinuityIdentityRef;
} {
  if (entry.event_type === CLAIM_CONTRADICTION_RECORDED_EVENT) {
    return {
      kind: 'contradiction',
      source: claimRef(identityState, entry.payload.left_claim_id),
      target: claimRef(identityState, entry.payload.right_claim_id),
    };
  }
  return {
    kind: 'supersession',
    source: claimRef(identityState, entry.payload.predecessor_claim_id),
    target: claimRef(identityState, entry.payload.successor_claim_id),
  };
}

function explicitLifecycleBefore(
  journal: readonly ClaimEventJournalEntry[],
  corrected: ReadonlyMap<string, ClaimEventJournalEntry>,
  identityState: Readonly<ContinuityIdentityState>,
  claimId: string,
  beforeSequence: number,
): 'proposed' | 'active' | 'retracted' {
  let lifecycle: 'proposed' | 'active' | 'retracted' = 'proposed';
  for (const entry of journal) {
    if (
      entry.ledger_sequence >= beforeSequence
      || entry.event_type !== CLAIM_LIFECYCLE_RECORDED_EVENT
      || corrected.has(entry.event_id)
      || claimRef(identityState, entry.payload.claim_ref).id !== claimId
    ) continue;
    const transition = String(entry.payload.transition);
    if (transition === 'admit' && lifecycle === 'proposed') lifecycle = 'active';
    else if (transition === 'retract' && lifecycle === 'active') lifecycle = 'retracted';
    else {
      fail(
        ClaimContinuityErrorCodes.TRANSITION_CONFLICT,
        'Lifecycle history contains a forbidden transition',
        { claimId },
      );
    }
  }
  return lifecycle;
}

function foldRelationships(
  journal: readonly ClaimEventJournalEntry[],
  corrected: ReadonlyMap<string, ClaimEventJournalEntry>,
  identityState: Readonly<ContinuityIdentityState>,
  records: Record<string, ClaimContinuityRecord>,
): Record<string, ClaimRelationshipRecord> {
  const relationships: Record<string, ClaimRelationshipRecord> = {};
  for (const entry of journal) {
    if (
      corrected.has(entry.event_id)
      || ![
        CLAIM_CONTRADICTION_RECORDED_EVENT,
        CLAIM_SUPERSESSION_RECORDED_EVENT,
      ].includes(entry.event_type)
    ) continue;
    const relationshipId = String(entry.payload.relationship_id);
    const action = String(entry.payload.relation_action);
    const endpoints = relationshipEndpoints(entry, identityState);
    requiredRecord(records, endpoints.source);
    requiredRecord(records, endpoints.target);
    if (endpoints.source.id === endpoints.target.id) {
      fail(
        ClaimContinuityErrorCodes.RELATIONSHIP_CONFLICT,
        'Claim relationship cannot reference one identity twice',
        { relationshipId },
      );
    }
    const existing = relationships[relationshipId];
    if (action === 'assert') {
      if (existing) {
        fail(
          ClaimContinuityErrorCodes.RELATIONSHIP_CONFLICT,
          'Relationship identity already has an assertion',
          { relationshipId },
        );
      }
      if (
        endpoints.kind === 'supersession'
        && explicitLifecycleBefore(
          journal,
          corrected,
          identityState,
          endpoints.source.id,
          entry.ledger_sequence,
        ) !== 'active'
      ) {
        fail(
          ClaimContinuityErrorCodes.TRANSITION_CONFLICT,
          'Supersession requires an active predecessor at assertion time',
          { claimId: endpoints.source.id },
        );
      }
      relationships[relationshipId] = {
        relationship_id: relationshipId,
        relationship_kind: endpoints.kind,
        source_claim_ref: endpoints.source,
        target_claim_ref: endpoints.target,
        assertion_event_id: entry.event_id,
        withdrawal_event_id: null,
        evidence_refs: clone(entry.payload.evidence_refs as string[]),
        active: true,
      };
      continue;
    }
    if (
      !existing
      || !existing.active
      || existing.assertion_event_id !== entry.payload.retracts_event_id
      || existing.relationship_kind !== endpoints.kind
      || existing.source_claim_ref.id !== endpoints.source.id
      || existing.target_claim_ref.id !== endpoints.target.id
    ) {
      fail(
        ClaimContinuityErrorCodes.RELATIONSHIP_CONFLICT,
        'Withdrawal must counteract exactly one active assertion',
        { relationshipId },
      );
    }
    relationships[relationshipId] = {
      ...existing,
      withdrawal_event_id: entry.event_id,
      active: false,
    };
  }
  assertSupersessionGraph(relationships);
  return relationships;
}

function assertSupersessionGraph(
  relationships: Readonly<Record<string, ClaimRelationshipRecord>>,
): void {
  const successorByPredecessor = new Map<string, string>();
  for (const relationship of Object.values(relationships)) {
    if (!relationship.active || relationship.relationship_kind !== 'supersession') continue;
    const existing = successorByPredecessor.get(relationship.source_claim_ref.id);
    if (existing && existing !== relationship.target_claim_ref.id) {
      fail(
        ClaimContinuityErrorCodes.RELATIONSHIP_CONFLICT,
        'Claim has competing active successors',
        { claimId: relationship.source_claim_ref.id },
      );
    }
    successorByPredecessor.set(
      relationship.source_claim_ref.id,
      relationship.target_claim_ref.id,
    );
  }
  for (const start of successorByPredecessor.keys()) {
    const visited = new Set<string>();
    let cursor: string | undefined = start;
    while (cursor !== undefined) {
      if (visited.has(cursor)) {
        fail(
          ClaimContinuityErrorCodes.RELATIONSHIP_CONFLICT,
          'Supersession graph contains a cycle',
          { claimId: start },
        );
      }
      visited.add(cursor);
      cursor = successorByPredecessor.get(cursor);
    }
  }
}

function appendObservation(
  record: ClaimContinuityRecord,
  entry: ClaimEventJournalEntry,
  effective: boolean,
): void {
  const observation: ClaimObservationRecord = {
    observation_id: String(entry.payload.observation_id),
    match_record_id: String(entry.payload.match_record_id),
    raw_text: String(entry.payload.raw_text),
    normalized_fingerprint: String(entry.payload.normalized_fingerprint),
    aliases: clone(entry.payload.aliases as string[]),
    source_event_id: String(entry.payload.source_event_id),
    provenance_digest: String(entry.payload.provenance_digest),
    event_id: entry.event_id,
    ledger_sequence: entry.ledger_sequence,
    effective,
  };
  record.observations.push(observation);
  if (effective) {
    for (const alias of observation.aliases) addUnique(record.aliases, alias);
    addUnique(record.normalized_fingerprints, observation.normalized_fingerprint);
  }
}

function appendEvidence(
  record: ClaimContinuityRecord,
  entry: ClaimEventJournalEntry,
  effective: boolean,
): void {
  const evidence: ClaimEvidenceRecord = {
    evidence_ref: String(entry.payload.evidence_ref),
    source_ref: String(entry.payload.source_ref),
    stance: entry.payload.stance as ClaimEvidenceRecord['stance'],
    independence_key: String(entry.payload.independence_key),
    is_duplicate: Boolean(entry.payload.is_duplicate),
    provenance_digest: String(entry.payload.provenance_digest),
    event_id: entry.event_id,
    ledger_sequence: entry.ledger_sequence,
    effective,
  };
  record.evidence.push(evidence);
}

function foldLifecycleAndEvidence(
  journal: readonly ClaimEventJournalEntry[],
  corrected: ReadonlyMap<string, ClaimEventJournalEntry>,
  identityState: Readonly<ContinuityIdentityState>,
  records: Record<string, ClaimContinuityRecord>,
  matchRecords: Readonly<Record<string, ClaimMatchRecord>>,
  relationships: Readonly<Record<string, ClaimRelationshipRecord>>,
): void {
  const admitted = new Set<string>();
  const retracted = new Set<string>();
  const adjudications = new Map<string, string[]>();
  for (const entry of journal) {
    if ([CLAIM_MATCH_RECORDED_EVENT, CLAIM_REGISTERED_EVENT].includes(entry.event_type)) continue;
    const refs = claimRefsFor(entry, identityState);
    const isCorrected = corrected.has(entry.event_id);
    for (const ref of refs) {
      const record = requiredRecord(records, ref);
      record.last_applied_ledger_sequence = entry.ledger_sequence;
      if (isCorrected) addUnique(record.corrected_event_ids, entry.event_id);
      else addUnique(record.contributing_event_ids, entry.event_id);
    }
    if (entry.event_type === CLAIM_OBSERVATION_ATTACHED_EVENT) {
      const record = requiredRecord(records, refs[0]);
      const match = matchRecords[String(entry.payload.match_record_id)];
      const allowed = match?.decision === 'reuse'
        ? match.resolved_claim_ref?.id === refs[0].id
        : match?.decision === 'mint'
          && record.mint_match_record_id === match.match_record_id;
      if (
        !match
        || !allowed
        || match.decision === 'unresolved'
        || match.observation_id !== entry.payload.observation_id
        || match.normalized_fingerprint !== entry.payload.normalized_fingerprint
        || canonicalJson(match.aliases) !== canonicalJson(entry.payload.aliases)
      ) {
        fail(
          ClaimContinuityErrorCodes.MATCH_CONFLICT,
          'Observation attachment is not authorized by its immutable match record',
          { eventId: entry.event_id },
        );
      }
      appendObservation(record, entry, !isCorrected);
    } else if (entry.event_type === CLAIM_EVIDENCE_ATTACHED_EVENT) {
      appendEvidence(requiredRecord(records, refs[0]), entry, !isCorrected);
    } else if (!isCorrected && entry.event_type === CLAIM_LIFECYCLE_RECORDED_EVENT) {
      const id = refs[0].id;
      const transition = String(entry.payload.transition);
      if (transition === 'admit') {
        if (admitted.has(id) || retracted.has(id)) {
          fail(
            ClaimContinuityErrorCodes.TRANSITION_CONFLICT,
            'Admission is only valid from proposed lifecycle state',
            { claimId: id },
          );
        }
        admitted.add(id);
      } else {
        if (!admitted.has(id) || retracted.has(id)) {
          fail(
            ClaimContinuityErrorCodes.TRANSITION_CONFLICT,
            'Retraction is only valid from active lifecycle state',
            { claimId: id },
          );
        }
        retracted.add(id);
      }
    } else if (!isCorrected && entry.event_type === CLAIM_ADJUDICATION_RECORDED_EVENT) {
      const outcomes = adjudications.get(refs[0].id) ?? [];
      outcomes.push(String(entry.payload.outcome));
      adjudications.set(refs[0].id, outcomes);
    }
  }

  for (const relationship of Object.values(relationships)) {
    for (const ref of [relationship.source_claim_ref, relationship.target_claim_ref]) {
      const record = requiredRecord(records, ref);
      addUnique(record.historical_relationship_ids, relationship.relationship_id);
      if (relationship.active) addUnique(record.active_relationship_ids, relationship.relationship_id);
      addUnique(record.contributing_event_ids, relationship.assertion_event_id);
      if (relationship.withdrawal_event_id) {
        addUnique(record.contributing_event_ids, relationship.withdrawal_event_id);
      }
    }
  }

  for (const record of Object.values(records)) {
    const superseded = Object.values(relationships).some((relationship) => (
      relationship.active
      && relationship.relationship_kind === 'supersession'
      && relationship.source_claim_ref.id === record.claim_ref.id
    ));
    record.lifecycle = retracted.has(record.claim_ref.id)
      ? ClaimLifecycleStates.RETRACTED
      : superseded
        ? ClaimLifecycleStates.SUPERSEDED
        : admitted.has(record.claim_ref.id)
          ? ClaimLifecycleStates.ACTIVE
          : ClaimLifecycleStates.PROPOSED;

    const outcomes = adjudications.get(record.claim_ref.id) ?? [];
    const contradicted = Object.values(relationships).some((relationship) => (
      relationship.active
      && relationship.relationship_kind === 'contradiction'
      && (
        relationship.source_claim_ref.id === record.claim_ref.id
        || relationship.target_claim_ref.id === record.claim_ref.id
      )
    ));
    const supported = record.evidence.some((evidence) => (
      evidence.effective && !evidence.is_duplicate && evidence.stance === 'support'
    )) || outcomes.includes('supported');
    record.epistemic_status = outcomes.includes('refuted')
      ? ClaimEpistemicStatuses.REFUTED
      : contradicted
        ? ClaimEpistemicStatuses.CONTESTED
        : supported
          ? ClaimEpistemicStatuses.SUPPORTED
          : ClaimEpistemicStatuses.UNASSESSED;
    record.aliases.sort(compareCodeUnits);
    record.normalized_fingerprints.sort(compareCodeUnits);
    record.active_relationship_ids.sort(compareCodeUnits);
    record.historical_relationship_ids.sort(compareCodeUnits);
    record.contributing_event_ids.sort(compareCodeUnits);
    record.corrected_event_ids.sort(compareCodeUnits);
  }
}

/** Recompute the complete disposable projection from the retained event journal. */
export function recomputeClaimContinuityState(
  journal: readonly ClaimEventJournalEntry[],
  identityState: Readonly<ContinuityIdentityState>,
  identityProjectionDigest: string,
): ClaimContinuityState {
  const records: Record<string, ClaimContinuityRecord> = {};
  const matchRecords: Record<string, ClaimMatchRecord> = {};
  const ordered = [...journal].sort((left, right) => left.ledger_sequence - right.ledger_sequence);
  for (let index = 0; index < ordered.length; index += 1) {
    const entry = ordered[index];
    if (entry.ledger_sequence !== index + 1) {
      fail(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Claim event journal must be one contiguous ledger prefix',
        { sequence: entry.ledger_sequence },
      );
    }
    if (entry.event_type === CLAIM_MATCH_RECORDED_EVENT) {
      const match = recordMatch(entry);
      validateMatchIntegrity(match, identityState);
      const existing = matchRecords[match.match_record_id];
      if (existing && canonicalJson(existing) !== canonicalJson(match)) {
        fail(
          ClaimContinuityErrorCodes.MATCH_CONFLICT,
          'Match record identity is bound to conflicting decisions',
          { matchRecordId: match.match_record_id },
        );
      }
      matchRecords[match.match_record_id] = match;
    } else if (entry.event_type === CLAIM_REGISTERED_EVENT) {
      const ref = claimRef(identityState, entry.payload.claim_ref);
      const identity = identityState.identities[ref.id];
      const match = matchRecords[String(entry.payload.match_record_id)];
      if (
        !match
        || match.decision !== 'mint'
        || identity.minted_event_id !== entry.payload.mint_identity_event_id
        || identity.mint_request_token_digest !== entry.payload.mint_request_token_digest
        || identity.provenance_digest !== entry.payload.provenance_digest
      ) {
        fail(
          ClaimContinuityErrorCodes.IDENTITY_CONFLICT,
          'Claim registration does not match its prior decision and identity mint evidence',
          { claimId: ref.id },
        );
      }
      const existing = records[ref.id];
      if (existing) {
        fail(
          ClaimContinuityErrorCodes.IDENTITY_CONFLICT,
          'One durable claim identity cannot be registered twice',
          { claimId: ref.id },
        );
      }
      records[ref.id] = emptyRecord(ref, entry.payload, entry.ledger_sequence);
      records[ref.id].contributing_event_ids.push(entry.event_id);
    }
  }

  for (const match of Object.values(matchRecords)) {
    if (match.decision === 'reuse') {
      const ref = claimRef(identityState, match.resolved_claim_ref);
      requiredRecord(records, ref);
    }
  }
  const corrected = correctedEvents(ordered, identityState);
  const relationships = foldRelationships(ordered, corrected, identityState, records);
  foldLifecycleAndEvidence(
    ordered,
    corrected,
    identityState,
    records,
    matchRecords,
    relationships,
  );
  const unresolved = Object.values(matchRecords)
    .filter((match) => match.decision === 'unresolved')
    .map((match) => match.match_record_id)
    .sort(compareCodeUnits);
  return {
    schema_version: CLAIM_CONTINUITY_SCHEMA_VERSION,
    reducer_version: CLAIM_CONTINUITY_REDUCER_VERSION,
    identity_projection_digest: identityProjectionDigest,
    records,
    match_records: matchRecords,
    relationships,
    unresolved_match_ids: unresolved,
    event_journal: clone(ordered),
    last_applied_ledger_sequence: ordered.length,
  };
}

/** Create an empty state bound to the exact identity projection used for validation. */
export function claimContinuityInitialState(
  identityProjectionDigest: string,
): ClaimContinuityState {
  if (!/^[a-f0-9]{64}$/.test(identityProjectionDigest)) {
    return fail(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Identity projection digest must be a SHA-256 digest',
    );
  }
  return recomputeClaimContinuityState([], {
    schema_version: 1,
    identities: {},
    mint_requests: {},
    aliases: {},
    relationships: [],
    attempts: {},
    cross_mode_references: [],
  }, identityProjectionDigest);
}

/** Incrementally append one verified event, then recompute from retained history. */
export function applyClaimContinuityEvent(
  state: Readonly<ClaimContinuityState>,
  event: Readonly<EventReadResult>,
  identityState: Readonly<ContinuityIdentityState>,
): ClaimContinuityState {
  const nextEntry = eventJournalEntry(event);
  if (
    nextEntry.ledger_sequence !== state.event_journal.length + 1
    || state.identity_projection_digest.length !== 64
  ) {
    return fail(
      ClaimContinuityErrorCodes.EVENT_CONFLICT,
      'Incremental claim fold requires the next contiguous ledger event',
      { sequence: nextEntry.ledger_sequence },
    );
  }
  return recomputeClaimContinuityState(
    [...state.event_journal, nextEntry],
    identityState,
    state.identity_projection_digest,
  );
}

/** Bind the versioned reducer to one immutable identity projection. */
export function createClaimContinuityReducerRegistry(
  identityState: Readonly<ContinuityIdentityState>,
): TypedReducerRegistry<ClaimContinuityState> {
  const definitions: TypedReducerDefinition<ClaimContinuityState>[] =
    CLAIM_CONTINUITY_EVENT_TYPES.map((eventType) => ({
      eventType,
      reducerVersion: CLAIM_CONTINUITY_REDUCER_VERSION,
      reduce: (state, event) => applyClaimContinuityEvent(state, event, identityState),
    }));
  return new TypedReducerRegistry(definitions);
}

/** Read a stable ledger head and rebuild its projection from verified events. */
export async function readClaimContinuityProjection(
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
  identityState: Readonly<ContinuityIdentityState>,
  identityProjectionDigest: string,
): Promise<RebuiltProjection<ClaimContinuityState>> {
  if (ledger.registryDigest !== eventRegistry.digest) {
    return fail(
      ClaimContinuityErrorCodes.REGISTRY_MISMATCH,
      'Claim ledger and event registry digests do not match',
    );
  }
  const events = await ledger.readVerifiedEvents();
  const head = await ledger.getVerifiedHead();
  if (events.length !== head.sequence) {
    return fail(
      ClaimContinuityErrorCodes.STALE_FRONTIER,
      'Claim ledger advanced while its projection was being read',
    );
  }
  return rebuildProjection(
    events,
    claimContinuityInitialState(identityProjectionDigest),
    CLAIM_CONTINUITY_REDUCER_VERSION,
    head,
    createClaimContinuityReducerRegistry(identityState),
  );
}

/** Stable projection hash helper used by replay and resume checks. */
export function claimProjectionDigest(state: Readonly<ClaimContinuityState>): string {
  return sha256Bytes(canonicalBytes(state));
}
