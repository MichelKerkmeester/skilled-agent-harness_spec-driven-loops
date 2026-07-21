// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Service
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ContinuityIdentityKinds,
  ContinuityIdentityService,
  mintRequestTokenDigest,
  provenanceDigest,
  readContinuityIdentityProjection,
  validateContinuityMode,
  validateIdentityRef,
} from '../deep-loop/continuity-identity/index.js';
import {
  CLAIM_ADJUDICATION_RECORDED_EVENT,
  CLAIM_CONTINUITY_REDUCER_VERSION,
  CLAIM_CORRECTION_RECORDED_EVENT,
  CLAIM_EVIDENCE_ATTACHED_EVENT,
  CLAIM_LIFECYCLE_RECORDED_EVENT,
  CLAIM_MATCH_RECORDED_EVENT,
  CLAIM_OBSERVATION_ATTACHED_EVENT,
  CLAIM_REGISTERED_EVENT,
  CLAIM_CONTINUITY_WRITE_CAPABILITY,
  createClaimContinuityEventRegistry,
  createClaimContinuityPolicyRegistry,
} from './claim-continuity-events.js';
import { evaluateClaimMatch, normalizeClaimAlias } from './claim-matching.js';
import {
  applyClaimContinuityEvent,
  readClaimContinuityProjection,
} from './claim-reducer.js';
import {
  ClaimContinuityError,
  ClaimContinuityErrorCodes,
  ClaimMatchDecisions,
} from './claim-continuity-types.js';

import type {
  AuthorizedLedgerOptions,
  DurableAppendReceipt,
  PolicyReference,
  RebuiltProjection,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  ContinuityIdentityRuntime,
  ContinuityIdentityState,
  ContinuityIdentityRef,
} from '../deep-loop/continuity-identity/index.js';
import type {
  AttachClaimEvidenceInput,
  AttachClaimObservationInput,
  ClaimContinuityRecord,
  ClaimContinuityState,
  ClaimContinuityWriteContext,
  ClaimContinuityWriteResult,
  ClaimEvidenceRecord,
  ClaimMatchRecord,
  ClaimObservationRecord,
  MintClaimInput,
  MintClaimResult,
  RecordClaimAdjudicationInput,
  RecordClaimCorrectionInput,
  RecordClaimLifecycleInput,
  RecordClaimMatchInput,
} from './claim-continuity-types.js';

export interface ClaimContinuityRuntimeOptions {
  readonly rootDirectory: string;
  readonly ledgerId?: string;
  readonly auditLedgerId?: string;
  readonly authorityProvider: AuthorizedLedgerOptions['authorityProvider'];
  readonly now?: () => Date;
  readonly faultInjection?: AuthorizedLedgerOptions['faultInjection'];
}

export interface ClaimContinuityRuntime {
  readonly eventRegistry: EventTypeRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly service: ClaimContinuityService;
  readonly policy: PolicyReference;
  readonly authority: 'legacy';
}

function semanticEventId(kind: string, value: JsonObject): string {
  return `claim-${kind}-${sha256Bytes(canonicalBytes(value))}`;
}

function bounded(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 512) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      `${field} must be a non-empty bounded string`,
      { field },
    );
  }
  return value;
}

function assertSamePolicy(
  actual: PolicyReference,
  expected: PolicyReference,
): void {
  if (
    actual.policyId !== expected.policyId
    || actual.policyVersion !== expected.policyVersion
    || actual.policyDigest !== expected.policyDigest
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.AUTHORIZATION_DENIED,
      'Claim write context does not reference the runtime policy',
    );
  }
}

function withoutEventMetadata(record: ClaimMatchRecord): JsonObject {
  const copy = { ...record } as Record<string, unknown>;
  delete copy.event_id;
  delete copy.ledger_sequence;
  return copy as JsonObject;
}

/** Authorized dark service; legacy readers and writers remain outside this boundary. */
export class ClaimContinuityService {
  readonly #ledger: AppendOnlyLedger;
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #eventRegistry: EventTypeRegistry;
  readonly #policy: PolicyReference;
  readonly #identityService: ContinuityIdentityService;

  public constructor(
    ledger: AppendOnlyLedger,
    gateway: TransitionAuthorizationGateway,
    eventRegistry: EventTypeRegistry,
    policy: PolicyReference,
    identityService: ContinuityIdentityService,
  ) {
    if (ledger.registryDigest !== eventRegistry.digest) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.REGISTRY_MISMATCH,
        'Claim service requires the event registry used by its ledger',
      );
    }
    this.#ledger = ledger;
    this.#gateway = gateway;
    this.#eventRegistry = eventRegistry;
    this.#policy = policy;
    this.#identityService = identityService;
  }

  public get ledger(): AppendOnlyLedger {
    return this.#ledger;
  }

  public get eventRegistry(): EventTypeRegistry {
    return this.#eventRegistry;
  }

  public get identityService(): ContinuityIdentityService {
    return this.#identityService;
  }

  async #identityProjection(): Promise<RebuiltProjection<ContinuityIdentityState>> {
    return readContinuityIdentityProjection(
      this.#identityService.ledger,
      this.#identityService.eventRegistry,
    );
  }

  async #projection(): Promise<{
    identity: RebuiltProjection<ContinuityIdentityState>;
    claims: RebuiltProjection<ClaimContinuityState>;
  }> {
    const identity = await this.#identityProjection();
    const claims = await readClaimContinuityProjection(
      this.#ledger,
      this.#eventRegistry,
      identity.state,
      identity.digest,
    );
    return { identity, claims };
  }

  /** Read the current verified state against the current typed identity registry. */
  public async readState(): Promise<Readonly<ClaimContinuityState>> {
    return (await this.#projection()).claims.state;
  }

  /** Persist the exact candidate set and closed match decision before mutation. */
  public async recordMatch(
    input: RecordClaimMatchInput,
  ): Promise<ClaimContinuityWriteResult<ClaimMatchRecord>> {
    const projection = await this.#projection();
    const evaluated = evaluateClaimMatch(projection.claims.state, projection.identity.state, input);
    const resolved = evaluated.resolvedClaimId === null
      ? null
      : validateIdentityRef(
        projection.identity.state.identities[evaluated.resolvedClaimId]?.ref,
        ContinuityIdentityKinds.CLAIM,
      );
    const body: Omit<ClaimMatchRecord, 'event_id' | 'ledger_sequence'> = {
      match_record_id: evaluated.matchRecordId,
      observation_id: input.observationId,
      namespace: input.namespace,
      aliases: evaluated.aliases,
      normalized_fingerprint: input.normalizedFingerprint,
      policy_version: input.policy.policy_version,
      policy_digest: evaluated.policyDigest,
      candidate_set: evaluated.candidates,
      decision: evaluated.decision,
      reason: evaluated.reason,
      resolved_claim_ref: resolved,
      provenance_digest: input.provenanceDigest,
    };
    const eventId = evaluated.matchRecordId;
    const record = {
      ...body,
      event_id: eventId,
      ledger_sequence: projection.claims.ledgerHead.sequence + 1,
    } as unknown as ClaimMatchRecord;
    const existing = projection.claims.state.match_records[evaluated.matchRecordId];
    if (existing) {
      if (canonicalJson(withoutEventMetadata(existing)) !== canonicalJson(body)) {
        throw new ClaimContinuityError(
          ClaimContinuityErrorCodes.MATCH_CONFLICT,
          'Match record identity is already bound to another decision',
          { matchRecordId: evaluated.matchRecordId },
        );
      }
      return { status: 'idempotent', value: existing, receipt: null };
    }
    const receipt = await this.#appendWithRecovery(
      projection,
      CLAIM_MATCH_RECORDED_EVENT,
      eventId,
      { match_record: body as unknown as JsonObject },
      input.context,
      (state) => state.match_records[evaluated.matchRecordId],
      (accepted) => canonicalJson(withoutEventMetadata(accepted)) === canonicalJson(body),
    );
    return receipt;
  }

  /** Mint through the frozen identity service and bind the accepted identity once. */
  public async mintClaim(
    input: MintClaimInput,
  ): Promise<ClaimContinuityWriteResult<MintClaimResult>> {
    const before = await this.#projection();
    const match = before.claims.state.match_records[input.matchRecordId];
    if (!match || match.decision !== ClaimMatchDecisions.MINT) {
      throw new ClaimContinuityError(
        match?.decision === ClaimMatchDecisions.UNRESOLVED
          ? ClaimContinuityErrorCodes.UNRESOLVED_MATCH
          : ClaimContinuityErrorCodes.MATCH_CONFLICT,
        'Only a recorded unambiguous mint decision may create a claim identity',
        { matchRecordId: input.matchRecordId },
      );
    }
    const earlierEquivalent = Object.values(before.claims.state.match_records).find((candidate) => (
      candidate.ledger_sequence < match.ledger_sequence
      && candidate.decision === ClaimMatchDecisions.MINT
      && candidate.namespace === match.namespace
      && candidate.normalized_fingerprint === match.normalized_fingerprint
    ));
    if (earlierEquivalent) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.IDENTITY_CONFLICT,
        'An earlier equivalent mint decision owns this fingerprint',
        { matchRecordId: earlierEquivalent.match_record_id },
      );
    }
    if (input.identityMint.kind !== undefined && input.identityMint.kind !== 'claim') {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.WRONG_KIND,
        'Claim mint cannot override the frozen claim identity kind',
      );
    }
    if (provenanceDigest(input.identityMint.provenance) !== match.provenance_digest) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.IDENTITY_CONFLICT,
        'Identity provenance must equal the recorded match provenance',
      );
    }
    const identityResult = await this.#identityService.mintIdentity({
      ...input.identityMint,
      kind: ContinuityIdentityKinds.CLAIM,
    });
    const afterIdentity = await this.#identityProjection();
    const identity = afterIdentity.state.identities[identityResult.value.id];
    if (!identity) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.IDENTITY_CONFLICT,
        'Accepted identity mint is absent from its verified projection',
      );
    }
    const currentClaims = await readClaimContinuityProjection(
      this.#ledger,
      this.#eventRegistry,
      afterIdentity.state,
      afterIdentity.digest,
    );
    const existing = currentClaims.state.records[identity.ref.id];
    const result: MintClaimResult = {
      claim_ref: identity.ref,
      identity_status: identityResult.status,
      claim_status: existing ? 'idempotent' : 'appended',
    };
    if (existing) {
      if (existing.mint_match_record_id !== match.match_record_id) {
        throw new ClaimContinuityError(
          ClaimContinuityErrorCodes.IDENTITY_CONFLICT,
          'Accepted claim identity is already bound to another match decision',
          { claimId: identity.ref.id },
        );
      }
      return { status: 'idempotent', value: { ...result, claim_status: 'idempotent' }, receipt: null };
    }
    const payload: JsonObject = {
      claim_ref: identity.ref,
      match_record_id: match.match_record_id,
      mint_identity_event_id: identity.minted_event_id,
      mint_request_token_digest: identity.mint_request_token_digest,
      namespace: match.namespace,
      provenance_digest: identity.provenance_digest,
    };
    const eventId = `claim-register-${identity.ref.id}`;
    const write = await this.#appendWithRecovery(
      { identity: afterIdentity, claims: currentClaims },
      CLAIM_REGISTERED_EVENT,
      eventId,
      payload,
      input.context,
      (state) => state.records[identity.ref.id],
      (accepted) => accepted.mint_match_record_id === match.match_record_id,
    );
    return {
      status: write.status,
      value: {
        ...result,
        claim_status: write.status,
      },
      receipt: write.receipt,
    };
  }

  /** Attach wording only after a recorded match resolves to this durable ID. */
  public async attachObservation(
    input: AttachClaimObservationInput,
  ): Promise<ClaimContinuityWriteResult<ClaimObservationRecord>> {
    const projection = await this.#projection();
    const ref = validateIdentityRef(input.claimRef, ContinuityIdentityKinds.CLAIM);
    const claim = projection.claims.state.records[ref.id];
    const match = projection.claims.state.match_records[input.matchRecordId];
    if (!claim || !match) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.UNKNOWN_CLAIM,
        'Observation requires a registered claim and match decision',
      );
    }
    const allowed = match.decision === ClaimMatchDecisions.REUSE
      ? match.resolved_claim_ref?.id === ref.id
      : match.decision === ClaimMatchDecisions.MINT
        && claim.mint_match_record_id === match.match_record_id;
    if (!allowed || match.decision === ClaimMatchDecisions.UNRESOLVED) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.UNRESOLVED_MATCH,
        'Unresolved or mismatched decisions cannot attach observations',
        { matchRecordId: match.match_record_id },
      );
    }
    if (
      match.observation_id !== input.observationId
      || match.normalized_fingerprint !== input.normalizedFingerprint
    ) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.MATCH_CONFLICT,
        'Observation does not match the immutable decision input',
      );
    }
    const aliases = [...new Set(input.aliases.map(normalizeClaimAlias))].sort();
    if (canonicalJson(aliases) !== canonicalJson(match.aliases)) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.MATCH_CONFLICT,
        'Observation aliases differ from the recorded match decision',
      );
    }
    const payload: JsonObject = {
      claim_ref: ref,
      match_record_id: match.match_record_id,
      observation_id: input.observationId,
      raw_text: bounded(input.rawText, 'rawText'),
      normalized_fingerprint: input.normalizedFingerprint,
      aliases,
      source_event_id: bounded(input.sourceEventId, 'sourceEventId'),
      provenance_digest: input.provenanceDigest,
    };
    const eventId = semanticEventId('observation', {
      claim_ref: ref,
      observation_id: input.observationId,
      source_event_id: input.sourceEventId,
    });
    const value: ClaimObservationRecord = {
      observation_id: input.observationId,
      match_record_id: match.match_record_id,
      raw_text: input.rawText,
      normalized_fingerprint: input.normalizedFingerprint,
      aliases,
      source_event_id: input.sourceEventId,
      provenance_digest: input.provenanceDigest,
      event_id: eventId,
      ledger_sequence: projection.claims.ledgerHead.sequence + 1,
      effective: true,
    };
    return this.#appendWithRecovery(
      projection,
      CLAIM_OBSERVATION_ATTACHED_EVENT,
      eventId,
      payload,
      input.context,
      (state) => state.records[ref.id]?.observations.find((item) => item.event_id === eventId),
      (accepted) => accepted.observation_id === value.observation_id
        && accepted.match_record_id === value.match_record_id
        && accepted.raw_text === value.raw_text
        && accepted.normalized_fingerprint === value.normalized_fingerprint
        && canonicalJson(accepted.aliases) === canonicalJson(value.aliases)
        && accepted.source_event_id === value.source_event_id
        && accepted.provenance_digest === value.provenance_digest,
    );
  }

  /** Attach source evidence to one existing identity without reminting it. */
  public async attachEvidence(
    input: AttachClaimEvidenceInput,
  ): Promise<ClaimContinuityWriteResult<ClaimEvidenceRecord>> {
    const projection = await this.#projection();
    const ref = validateIdentityRef(input.claimRef, ContinuityIdentityKinds.CLAIM);
    if (!projection.claims.state.records[ref.id]) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.UNKNOWN_CLAIM,
        'Evidence requires a registered claim identity',
        { claimId: ref.id },
      );
    }
    const existingEvidence = projection.claims.state.records[ref.id].evidence;
    const payload: JsonObject = {
      claim_ref: ref,
      evidence_ref: bounded(input.evidenceRef, 'evidenceRef'),
      source_ref: bounded(input.sourceRef, 'sourceRef'),
      stance: input.stance,
      independence_key: bounded(input.independenceKey, 'independenceKey'),
      is_duplicate: input.isDuplicate,
      provenance_digest: input.provenanceDigest,
    };
    const eventId = semanticEventId('evidence', payload);
    const existingEvent = existingEvidence.find((evidence) => evidence.event_id === eventId);
    if (existingEvent) {
      return { status: 'idempotent', value: existingEvent, receipt: null };
    }
    const expectedDuplicate = existingEvidence.some((evidence) => (
      evidence.effective
      && (
        evidence.source_ref === input.sourceRef
        || evidence.independence_key === input.independenceKey
      )
    ));
    if (input.isDuplicate !== expectedDuplicate) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Duplicate-source marker disagrees with the current evidence history',
        { claimId: ref.id },
      );
    }
    const value: ClaimEvidenceRecord = {
      evidence_ref: input.evidenceRef,
      source_ref: input.sourceRef,
      stance: input.stance,
      independence_key: input.independenceKey,
      is_duplicate: input.isDuplicate,
      provenance_digest: input.provenanceDigest,
      event_id: eventId,
      ledger_sequence: projection.claims.ledgerHead.sequence + 1,
      effective: true,
    };
    return this.#appendWithRecovery(
      projection,
      CLAIM_EVIDENCE_ATTACHED_EVENT,
      eventId,
      payload,
      input.context,
      (state) => state.records[ref.id]?.evidence.find((item) => item.event_id === eventId),
      (accepted) => accepted.evidence_ref === input.evidenceRef
        && accepted.provenance_digest === input.provenanceDigest,
    );
  }

  /** Record an allowed explicit lifecycle transition; derived status remains separate. */
  public async recordLifecycle(
    input: RecordClaimLifecycleInput,
  ): Promise<ClaimContinuityWriteResult<ClaimContinuityRecord>> {
    const projection = await this.#projection();
    const ref = validateIdentityRef(input.claimRef, ContinuityIdentityKinds.CLAIM);
    const record = projection.claims.state.records[ref.id];
    const payload: JsonObject = {
      claim_ref: ref,
      transition: input.transition,
      rationale_ref: bounded(input.rationaleRef, 'rationaleRef'),
    };
    const eventId = semanticEventId('lifecycle', payload);
    if (record?.contributing_event_ids.includes(eventId)) {
      return { status: 'idempotent', value: record, receipt: null };
    }
    const valid = input.transition === 'admit'
      ? record?.lifecycle === 'proposed'
      : record?.lifecycle === 'active';
    if (!valid) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.TRANSITION_CONFLICT,
        'Lifecycle transition is not allowed from the current folded state',
        { claimId: ref.id, lifecycle: record?.lifecycle ?? null },
      );
    }
    return this.#appendWithRecovery(
      projection,
      CLAIM_LIFECYCLE_RECORDED_EVENT,
      eventId,
      payload,
      input.context,
      (state) => {
        const accepted = state.records[ref.id];
        return accepted?.contributing_event_ids.includes(eventId) ? accepted : undefined;
      },
      (accepted) => accepted.lifecycle === (input.transition === 'admit' ? 'active' : 'retracted'),
    );
  }

  /** Append one adjudication input; the reducer owns epistemic precedence. */
  public async recordAdjudication(
    input: RecordClaimAdjudicationInput,
  ): Promise<ClaimContinuityWriteResult<ClaimContinuityRecord>> {
    const projection = await this.#projection();
    const ref = validateIdentityRef(input.claimRef, ContinuityIdentityKinds.CLAIM);
    if (!projection.claims.state.records[ref.id]) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.UNKNOWN_CLAIM,
        'Adjudication requires a registered claim identity',
      );
    }
    const payload: JsonObject = {
      claim_ref: ref,
      outcome: input.outcome,
      evidence_refs: [...input.evidenceRefs].sort(),
      rationale_ref: bounded(input.rationaleRef, 'rationaleRef'),
    };
    const eventId = semanticEventId('adjudication', payload);
    return this.#appendWithRecovery(
      projection,
      CLAIM_ADJUDICATION_RECORDED_EVENT,
      eventId,
      payload,
      input.context,
      (state) => {
        const accepted = state.records[ref.id];
        return accepted?.contributing_event_ids.includes(eventId) ? accepted : undefined;
      },
      (accepted) => accepted.contributing_event_ids.includes(eventId),
    );
  }

  /** Append a compensating event; retained history is recomputed, never overwritten. */
  public async recordCorrection(
    input: RecordClaimCorrectionInput,
  ): Promise<ClaimContinuityWriteResult<ClaimContinuityRecord>> {
    const projection = await this.#projection();
    const ref = validateIdentityRef(input.claimRef, ContinuityIdentityKinds.CLAIM);
    const target = projection.claims.state.event_journal.find(
      (entry) => entry.event_id === input.targetEventId,
    );
    if (!target || [
      CLAIM_MATCH_RECORDED_EVENT,
      CLAIM_REGISTERED_EVENT,
      CLAIM_CORRECTION_RECORDED_EVENT,
    ].includes(target.event_type)) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Correction target is missing or identity-defining',
        { targetEventId: input.targetEventId },
      );
    }
    const targetClaimIds = target.event_type === 'deep-loop.claim.contradiction-recorded'
      ? [target.payload.left_claim_id, target.payload.right_claim_id]
        .map((value) => validateIdentityRef(value, ContinuityIdentityKinds.CLAIM).id)
      : target.event_type === 'deep-loop.claim.supersession-recorded'
        ? [target.payload.predecessor_claim_id, target.payload.successor_claim_id]
          .map((value) => validateIdentityRef(value, ContinuityIdentityKinds.CLAIM).id)
        : [validateIdentityRef(target.payload.claim_ref, ContinuityIdentityKinds.CLAIM).id];
    if (!targetClaimIds.includes(ref.id)) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.EVENT_CONFLICT,
        'Correction claim does not own the target event',
        { claimId: ref.id, targetEventId: input.targetEventId },
      );
    }
    const payload: JsonObject = {
      claim_ref: ref,
      target_event_id: input.targetEventId,
      rationale_ref: bounded(input.rationaleRef, 'rationaleRef'),
    };
    const eventId = semanticEventId('correction', payload);
    return this.#appendWithRecovery(
      projection,
      CLAIM_CORRECTION_RECORDED_EVENT,
      eventId,
      payload,
      input.context,
      (state) => {
        const accepted = state.records[ref.id];
        return accepted?.contributing_event_ids.includes(eventId) ? accepted : undefined;
      },
      (accepted) => accepted.corrected_event_ids.includes(input.targetEventId),
    );
  }

  async #appendWithRecovery<TValue>(
    projection: {
      identity: RebuiltProjection<ContinuityIdentityState>;
      claims: RebuiltProjection<ClaimContinuityState>;
    },
    eventType: string,
    eventId: string,
    payload: JsonObject,
    context: ClaimContinuityWriteContext,
    resolve: (state: Readonly<ClaimContinuityState>) => TValue | undefined,
    equivalent: (value: TValue) => boolean,
  ): Promise<ClaimContinuityWriteResult<TValue>> {
    const existing = resolve(projection.claims.state);
    if (existing !== undefined) {
      if (!equivalent(existing)) {
        throw new ClaimContinuityError(
          ClaimContinuityErrorCodes.EVENT_CONFLICT,
          'Semantic event identity is bound to different content',
          { eventId },
        );
      }
      return { status: 'idempotent', value: existing, receipt: null };
    }
    try {
      const receipt = await this.#authorizeAndAppend(
        projection,
        eventType,
        eventId,
        payload,
        context,
      );
      const accepted = resolve(await this.readState());
      if (accepted === undefined || !equivalent(accepted)) {
        throw new ClaimContinuityError(
          ClaimContinuityErrorCodes.EVENT_CONFLICT,
          'Durable append did not produce the expected claim projection',
          { eventId },
        );
      }
      return { status: 'appended', value: accepted, receipt };
    } catch (error: unknown) {
      const accepted = resolve(await this.readState());
      if (accepted !== undefined && equivalent(accepted)) {
        return { status: 'idempotent', value: accepted, receipt: null };
      }
      throw error;
    }
  }

  async #authorizeAndAppend(
    projection: {
      identity: RebuiltProjection<ContinuityIdentityState>;
      claims: RebuiltProjection<ClaimContinuityState>;
    },
    eventType: string,
    eventId: string,
    payload: JsonObject,
    context: ClaimContinuityWriteContext,
  ): Promise<DurableAppendReceipt> {
    assertSamePolicy(context.policy, this.#policy);
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: eventId,
      event_type: eventType,
      event_version: 1,
      stream_id: this.#ledger.ledgerId,
      stream_sequence: projection.claims.ledgerHead.sequence + 1,
      occurred_at: context.timestamp,
      recorded_at: context.timestamp,
      producer: context.producer,
      authority_epoch: context.authorityEpoch,
      correlation_id: context.correlationId,
      causation_id: context.causationId,
      idempotency_key: eventId,
      payload,
    }, this.#eventRegistry);
    // Reject events that replay cannot fold before the append-only ledger makes them irreversible.
    applyClaimContinuityEvent(
      projection.claims.state,
      readEvent(event.canonicalBytes, this.#eventRegistry),
      projection.identity.state,
    );
    const request: TransitionAuthorizationRequest = {
      requestId: `${eventId}-authorization`,
      mode: validateContinuityMode(context.mode),
      event,
      priorHead: projection.claims.ledgerHead,
      priorStateVersion: CLAIM_CONTINUITY_REDUCER_VERSION,
      priorStateFingerprint: projection.claims.digest,
      actorId: bounded(context.actorId, 'actorId'),
      capabilityId: bounded(context.capabilityId, 'capabilityId'),
      authorityEpoch: context.authorityEpoch,
      policy: context.policy,
      evidenceDigest: context.evidenceDigest,
    };
    const authorization = await this.#gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.AUTHORIZATION_DENIED,
        'Claim write was denied by the transition authorization gateway',
        { reasonCode: authorization.reasonCode },
      );
    }
    return this.#ledger.appendAuthorized(event, authorization.proof);
  }
}

/** Assemble an isolated dark runtime alongside, never inside, the identity runtime. */
export function createClaimContinuityRuntime(
  options: ClaimContinuityRuntimeOptions,
  identityRuntime: Pick<ContinuityIdentityRuntime, 'service'>,
): ClaimContinuityRuntime {
  const eventRegistry = createClaimContinuityEventRegistry();
  const policy = createClaimContinuityPolicyRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory: options.rootDirectory,
    ledgerId: options.ledgerId ?? 'claim-continuity',
    auditLedgerId: options.auditLedgerId ?? 'claim-continuity-authorization-audit',
    authorityProvider: options.authorityProvider,
    now: options.now,
    faultInjection: options.faultInjection,
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: options.rootDirectory,
    auditLedgerId: options.auditLedgerId ?? 'claim-continuity-authorization-audit',
    authorityProvider: options.authorityProvider,
    now: options.now,
  }, ledger, policy.registry);
  return Object.freeze({
    eventRegistry,
    ledger,
    gateway,
    service: new ClaimContinuityService(
      ledger,
      gateway,
      eventRegistry,
      policy.reference,
      identityRuntime.service,
    ),
    policy: policy.reference,
    authority: 'legacy',
  });
}

/** Content address evidence metadata without copying raw evidence into telemetry. */
export function claimContinuityEvidenceDigest(evidence: Readonly<JsonObject>): string {
  return sha256Bytes(canonicalBytes(evidence));
}

export { CLAIM_CONTINUITY_WRITE_CAPABILITY };
