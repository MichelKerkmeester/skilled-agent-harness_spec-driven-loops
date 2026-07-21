// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Identity Service
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  DarkLedgerAdapter,
  TransitionAuthorizationGateway,
  rebuildProjection,
} from '../../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../event-envelope/index.js';
import {
  CONTINUITY_ALIAS_BOUND_EVENT,
  CONTINUITY_ATTEMPT_RECORDED_EVENT,
  CONTINUITY_CROSS_MODE_REFERENCED_EVENT,
  CONTINUITY_IDENTITY_MINTED_EVENT,
  CONTINUITY_REDUCER_VERSION,
  CONTINUITY_RELATIONSHIP_BOUND_EVENT,
  createContinuityIdentityEventRegistry,
  createContinuityIdentityPolicyRegistry,
  createContinuityIdentityReducerRegistry,
  continuityInitialState,
} from './continuity-identity-events.js';
import {
  ContinuityIdentityError,
  ContinuityIdentityErrorCodes,
  ContinuityIdentityKinds,
} from './continuity-identity-types.js';
import {
  aliasKey,
  continuityDigest,
  identityRefFromTokenDigest,
  legacyAliasDigest,
  mintRequestTokenDigest,
  provenanceDigest,
  requireBoundedId,
  requireRegisteredIdentity,
  validateAliasNamespace,
  validateContinuityMode,
  validateIdentityRef,
} from './continuity-identity-schema.js';

import type {
  AuthorizedLedgerOptions,
  DarkLedgerTelemetryEvent,
  DurableAppendReceipt,
  LegacyDarkBoundaryId,
  PolicyReference,
  RebuiltProjection,
  TransitionAuthorizationRequest,
} from '../../authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../../event-envelope/index.js';
import type {
  BindAliasInput,
  ContinuityAttemptRecord,
  ContinuityCrossModeRecord,
  ContinuityIdentityRef,
  ContinuityIdentityState,
  ContinuityRelationshipRecord,
  ContinuityWriteContext,
  ContinuityWriteResult,
  LinkIdentitiesInput,
  MintIdentityInput,
  RecordAttemptInput,
  RecordCrossModeReferenceInput,
} from './continuity-identity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

interface PreparedContinuityWrite<TValue> {
  readonly status: 'prepared';
  readonly event: EventWritePreflight;
  readonly request: TransitionAuthorizationRequest;
  readonly value: TValue;
}

interface IdempotentContinuityWrite<TValue> {
  readonly status: 'idempotent';
  readonly value: TValue;
}

type ContinuityWritePreparation<TValue> =
  | PreparedContinuityWrite<TValue>
  | IdempotentContinuityWrite<TValue>;

export interface ContinuityIdentityRuntimeOptions {
  readonly rootDirectory: string;
  readonly ledgerId?: string;
  readonly auditLedgerId?: string;
  readonly authorityProvider: AuthorizedLedgerOptions['authorityProvider'];
  readonly now?: () => Date;
  readonly faultInjection?: AuthorizedLedgerOptions['faultInjection'];
}

export interface ContinuityIdentityRuntime {
  readonly eventRegistry: EventTypeRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly darkAdapter: DarkLedgerAdapter;
  readonly service: ContinuityIdentityService;
  readonly darkObserver: DarkContinuityIdentityObserver;
  readonly policy: PolicyReference;
}

export interface DarkContinuityIdentityTelemetry {
  readonly boundaryId: LegacyDarkBoundaryId;
  readonly status: 'appended' | 'idempotent' | 'denied' | 'failed' | 'rejected';
  readonly aliasNamespace: string;
  readonly subjectId: string;
  readonly errorCode: string | null;
  readonly adapterEvent: DarkLedgerTelemetryEvent | null;
  readonly observedAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. PROJECTION
// ───────────────────────────────────────────────────────────────────

/** Rebuild the complete registry from the verified hash-linked ledger prefix. */
export async function readContinuityIdentityProjection(
  ledger: AppendOnlyLedger,
  eventRegistry: EventTypeRegistry,
): Promise<RebuiltProjection<ContinuityIdentityState>> {
  if (ledger.registryDigest !== eventRegistry.digest) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.REGISTRY_MISMATCH,
      'Ledger and continuity event registry digests do not match',
      { ledgerId: ledger.ledgerId },
    );
  }
  const events = await ledger.readVerifiedEvents();
  const head = await ledger.getVerifiedHead();
  if (events.length !== head.sequence) {
    throw new ContinuityIdentityError(
      ContinuityIdentityErrorCodes.STALE_FRONTIER,
      'Ledger advanced while the continuity projection was being read',
      { ledgerId: ledger.ledgerId },
    );
  }
  return rebuildProjection(
    events,
    continuityInitialState(),
    CONTINUITY_REDUCER_VERSION,
    head,
    createContinuityIdentityReducerRegistry(),
  );
}

function semanticEventId(kind: string, value: JsonObject): string {
  return `continuity-${kind}-${continuityDigest(value)}`;
}

function relationshipMatch(
  state: Readonly<ContinuityIdentityState>,
  subjectId: string,
  relatedId: string,
  relationshipKind: string,
): ContinuityRelationshipRecord | undefined {
  return state.relationships.find((record) => (
    record.subject_ref.id === subjectId
    && record.related_ref.id === relatedId
    && record.relationship_kind === relationshipKind
  ));
}

function lifecycleParent(
  state: Readonly<ContinuityIdentityState>,
  subjectId: string,
): ContinuityRelationshipRecord | undefined {
  return state.relationships.find((record) => record.subject_ref.id === subjectId);
}

function wouldCreateLifecycleCycle(
  state: Readonly<ContinuityIdentityState>,
  subjectId: string,
  relatedId: string,
): boolean {
  let cursor: string | null = relatedId;
  const visited = new Set<string>();
  while (cursor !== null) {
    if (cursor === subjectId || visited.has(cursor)) return true;
    visited.add(cursor);
    cursor = lifecycleParent(state, cursor)?.related_ref.id ?? null;
  }
  return false;
}

function crossModeMatch(
  state: Readonly<ContinuityIdentityState>,
  subjectId: string,
  sourceId: string,
  targetId: string,
  sourceMode: string,
  targetMode: string,
): ContinuityCrossModeRecord | undefined {
  return state.cross_mode_references.find((record) => (
    record.subject_ref.id === subjectId
    && record.source_mode_session_ref.id === sourceId
    && record.target_mode_session_ref.id === targetId
    && record.source_mode === sourceMode
    && record.target_mode === targetMode
  ));
}

// ───────────────────────────────────────────────────────────────────
// 3. SERVICE
// ───────────────────────────────────────────────────────────────────

/** Dark, non-authoritative service whose only durable writes traverse the gateway. */
export class ContinuityIdentityService {
  readonly #ledger: AppendOnlyLedger;
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #eventRegistry: EventTypeRegistry;
  readonly #policy: PolicyReference;

  public constructor(
    ledger: AppendOnlyLedger,
    gateway: TransitionAuthorizationGateway,
    eventRegistry: EventTypeRegistry,
    policy: PolicyReference,
  ) {
    if (ledger.registryDigest !== eventRegistry.digest) {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.REGISTRY_MISMATCH,
        'Continuity service requires the ledger registry used at construction',
      );
    }
    this.#ledger = ledger;
    this.#gateway = gateway;
    this.#eventRegistry = eventRegistry;
    this.#policy = policy;
  }

  public get ledger(): AppendOnlyLedger {
    return this.#ledger;
  }

  public get eventRegistry(): EventTypeRegistry {
    return this.#eventRegistry;
  }

  /** Read the current verified state without consulting or changing legacy authority. */
  public async readState(): Promise<Readonly<ContinuityIdentityState>> {
    return (await readContinuityIdentityProjection(this.#ledger, this.#eventRegistry)).state;
  }

  /** Mint one logical identity, returning the recorded ID on every exact retry. */
  public async mintIdentity(
    input: MintIdentityInput,
  ): Promise<ContinuityWriteResult<ContinuityIdentityRef>> {
    const tokenDigest = mintRequestTokenDigest(input.mintRequestToken);
    const ref = identityRefFromTokenDigest(input.kind, tokenDigest);
    const provenance = provenanceDigest(input.provenance);
    const projection = await readContinuityIdentityProjection(this.#ledger, this.#eventRegistry);
    const parent = input.parent
      ? {
        ref: requireRegisteredIdentity(projection.state, input.parent.ref, ref.kind),
        relationshipKind: input.parent.relationshipKind,
      }
      : undefined;
    const existingId = projection.state.mint_requests[tokenDigest];
    if (existingId !== undefined) {
      const existing = projection.state.identities[existingId];
      if (
        !existing
        || existing.ref.kind !== ref.kind
        || existing.provenance_digest !== provenance
        || existing.parent_ref?.id !== parent?.ref.id
        || existing.mint_relationship_kind !== (parent?.relationshipKind ?? null)
      ) {
        throw new ContinuityIdentityError(
          ContinuityIdentityErrorCodes.TOKEN_CONFLICT,
          'Mint request token is already bound to different identity provenance',
        );
      }
      return { status: 'idempotent', value: existing.ref, receipt: null };
    }

    const payload: JsonObject = {
      identity_ref: ref,
      mint_request_token_digest: tokenDigest,
      provenance_digest: provenance,
    };
    if (parent) {
      payload.parent_ref = parent.ref;
      payload.relationship_kind = parent.relationshipKind;
    }
    const eventId = `continuity-mint-${tokenDigest}`;
    try {
      const receipt = await this.#authorizeAndAppend(
        projection,
        CONTINUITY_IDENTITY_MINTED_EVENT,
        eventId,
        eventId,
        payload,
        input.context,
      );
      return { status: 'appended', value: ref, receipt };
    } catch (error: unknown) {
      const current = await this.readState();
      const acceptedId = current.mint_requests[tokenDigest];
      const accepted = acceptedId ? current.identities[acceptedId] : undefined;
      if (
        accepted
        && accepted.ref.kind === ref.kind
        && accepted.provenance_digest === provenance
        && accepted.parent_ref?.id === parent?.ref.id
        && accepted.mint_relationship_kind === (parent?.relationshipKind ?? null)
      ) {
        return { status: 'idempotent', value: accepted.ref, receipt: null };
      }
      throw error;
    }
  }

  /** Prepare a namespaced alias event for either strict append or the dark adapter. */
  public async prepareAliasBinding(
    input: BindAliasInput,
  ): Promise<ContinuityWritePreparation<ContinuityIdentityRef>> {
    const projection = await readContinuityIdentityProjection(this.#ledger, this.#eventRegistry);
    const subject = requireRegisteredIdentity(projection.state, input.subjectRef);
    const namespace = validateAliasNamespace(input.namespace);
    const digest = legacyAliasDigest(namespace, input.legacyId);
    const existingId = projection.state.aliases[aliasKey(namespace, digest)];
    if (existingId !== undefined) {
      if (existingId !== subject.id) {
        throw new ContinuityIdentityError(
          ContinuityIdentityErrorCodes.ALIAS_AMBIGUOUS,
          'Legacy alias is already bound to another logical identity',
        );
      }
      return { status: 'idempotent', value: subject };
    }
    const identity = { alias_namespace: namespace, alias_digest: digest };
    const eventId = semanticEventId('alias', identity);
    return this.#prepareWrite(
      projection,
      CONTINUITY_ALIAS_BOUND_EVENT,
      eventId,
      eventId,
      { ...identity, subject_ref: subject },
      input.context,
      subject,
    );
  }

  /** Bind a legacy coordinate through the authorized ledger gateway. */
  public async bindAlias(
    input: BindAliasInput,
  ): Promise<ContinuityWriteResult<ContinuityIdentityRef>> {
    const prepared = await this.prepareAliasBinding(input);
    if (prepared.status === 'idempotent') {
      return { status: 'idempotent', value: prepared.value, receipt: null };
    }
    try {
      const receipt = await this.#appendPrepared(prepared);
      return { status: 'appended', value: prepared.value, receipt };
    } catch (error: unknown) {
      const current = await this.readState();
      const digest = legacyAliasDigest(input.namespace, input.legacyId);
      const existingId = current.aliases[aliasKey(input.namespace, digest)];
      if (existingId === prepared.value.id) {
        return { status: 'idempotent', value: prepared.value, receipt: null };
      }
      throw error;
    }
  }

  /** Record an explicit continuation or fork edge without reminting either endpoint. */
  public async linkIdentities(
    input: LinkIdentitiesInput,
  ): Promise<ContinuityWriteResult<ContinuityRelationshipRecord>> {
    const projection = await readContinuityIdentityProjection(this.#ledger, this.#eventRegistry);
    const subject = requireRegisteredIdentity(projection.state, input.subjectRef);
    const related = requireRegisteredIdentity(projection.state, input.relatedRef, subject.kind);
    const existing = relationshipMatch(
      projection.state,
      subject.id,
      related.id,
      input.relationshipKind,
    );
    if (existing) return { status: 'idempotent', value: existing, receipt: null };
    const existingParent = lifecycleParent(projection.state, subject.id);
    if (existingParent || wouldCreateLifecycleCycle(projection.state, subject.id, related.id)) {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.RELATIONSHIP_CONFLICT,
        'Lifecycle identity already has a parent or the requested edge creates a cycle',
        { identityId: subject.id },
      );
    }
    const identity = {
      relationship_kind: input.relationshipKind,
      subject_ref: subject,
      related_ref: related,
    };
    const eventId = semanticEventId('relationship', identity);
    const record: ContinuityRelationshipRecord = {
      ...identity,
      event_id: eventId,
    };
    const receipt = await this.#authorizeAndAppend(
      projection,
      CONTINUITY_RELATIONSHIP_BOUND_EVENT,
      eventId,
      eventId,
      identity,
      input.context,
    );
    return { status: 'appended', value: record, receipt };
  }

  /** Add one contiguous attempt while retaining the original logical mode session. */
  public async recordAttempt(
    input: RecordAttemptInput,
  ): Promise<ContinuityWriteResult<ContinuityAttemptRecord>> {
    const projection = await readContinuityIdentityProjection(this.#ledger, this.#eventRegistry);
    const ref = requireRegisteredIdentity(
      projection.state,
      input.modeSessionRef,
      ContinuityIdentityKinds.MODE_SESSION,
    );
    const attemptId = requireBoundedId(input.attemptId, 'attemptId');
    const attempts = projection.state.attempts[ref.id] ?? [];
    const existing = attempts.find((attempt) => attempt.attempt_id === attemptId);
    if (existing) {
      if (
        existing.attempt_number !== input.attemptNumber
        || existing.transition !== input.transition
      ) {
        throw new ContinuityIdentityError(
          ContinuityIdentityErrorCodes.ATTEMPT_CONFLICT,
          'Attempt ID is already bound to different execution metadata',
          { identityId: ref.id },
        );
      }
      return { status: 'idempotent', value: existing, receipt: null };
    }
    if (
      input.attemptNumber !== attempts.length + 1
      || (input.attemptNumber === 1) !== (input.transition === 'new')
    ) {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.ATTEMPT_CONFLICT,
        'Attempt sequence or lifecycle transition is not contiguous',
        { identityId: ref.id, attemptNumber: input.attemptNumber },
      );
    }
    const identity = {
      mode_session_ref: ref,
      attempt_id: attemptId,
      attempt_number: input.attemptNumber,
      transition: input.transition,
    };
    const eventId = semanticEventId('attempt', identity);
    const record: ContinuityAttemptRecord = { ...identity, event_id: eventId };
    const receipt = await this.#authorizeAndAppend(
      projection,
      CONTINUITY_ATTEMPT_RECORDED_EVENT,
      eventId,
      eventId,
      identity,
      input.context,
    );
    return { status: 'appended', value: record, receipt };
  }

  /** Preserve one typed subject while recording its source and target mode sessions. */
  public async recordCrossModeReference(
    input: RecordCrossModeReferenceInput,
  ): Promise<ContinuityWriteResult<ContinuityCrossModeRecord>> {
    const projection = await readContinuityIdentityProjection(this.#ledger, this.#eventRegistry);
    const subject = requireRegisteredIdentity(projection.state, input.subjectRef);
    const source = requireRegisteredIdentity(
      projection.state,
      input.sourceModeSessionRef,
      ContinuityIdentityKinds.MODE_SESSION,
    );
    const target = requireRegisteredIdentity(
      projection.state,
      input.targetModeSessionRef,
      ContinuityIdentityKinds.MODE_SESSION,
    );
    const sourceMode = validateContinuityMode(input.sourceMode);
    const targetMode = validateContinuityMode(input.targetMode);
    if (source.id === target.id || sourceMode === targetMode) {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.CROSS_MODE_CONFLICT,
        'Cross-mode reference requires distinct source and target boundaries',
      );
    }
    const existing = crossModeMatch(
      projection.state,
      subject.id,
      source.id,
      target.id,
      sourceMode,
      targetMode,
    );
    if (existing) return { status: 'idempotent', value: existing, receipt: null };
    const identity = {
      subject_ref: subject,
      source_mode_session_ref: source,
      target_mode_session_ref: target,
      source_mode: sourceMode,
      target_mode: targetMode,
    };
    const eventId = semanticEventId('cross-mode', identity);
    const record: ContinuityCrossModeRecord = { ...identity, event_id: eventId };
    const receipt = await this.#authorizeAndAppend(
      projection,
      CONTINUITY_CROSS_MODE_REFERENCED_EVENT,
      eventId,
      eventId,
      identity,
      input.context,
    );
    return { status: 'appended', value: record, receipt };
  }

  async #authorizeAndAppend<TValue extends JsonObject>(
    projection: RebuiltProjection<ContinuityIdentityState>,
    eventType: string,
    eventId: string,
    idempotencyKey: string,
    payload: JsonObject,
    context: ContinuityWriteContext,
    value?: TValue,
  ): Promise<DurableAppendReceipt> {
    const prepared = this.#prepareWrite(
      projection,
      eventType,
      eventId,
      idempotencyKey,
      payload,
      context,
      value ?? (payload as TValue),
    );
    return this.#appendPrepared(prepared);
  }

  #prepareWrite<TValue>(
    projection: RebuiltProjection<ContinuityIdentityState>,
    eventType: string,
    eventId: string,
    idempotencyKey: string,
    payload: JsonObject,
    context: ContinuityWriteContext,
    value: TValue,
  ): PreparedContinuityWrite<TValue> {
    if (
      context.policy.policyId !== this.#policy.policyId
      || context.policy.policyVersion !== this.#policy.policyVersion
      || context.policy.policyDigest !== this.#policy.policyDigest
    ) {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.AUTHORIZATION_DENIED,
        'Continuity write context does not reference the runtime policy',
      );
    }
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: eventId,
      event_type: eventType,
      event_version: 1,
      stream_id: this.#ledger.ledgerId,
      stream_sequence: projection.ledgerHead.sequence + 1,
      occurred_at: context.timestamp,
      recorded_at: context.timestamp,
      producer: context.producer,
      authority_epoch: context.authorityEpoch,
      correlation_id: context.correlationId,
      causation_id: context.causationId,
      idempotency_key: idempotencyKey,
      payload,
    }, this.#eventRegistry);
    const request: TransitionAuthorizationRequest = {
      requestId: `${eventId}-authorization`,
      mode: validateContinuityMode(context.mode),
      event,
      priorHead: projection.ledgerHead,
      priorStateVersion: CONTINUITY_REDUCER_VERSION,
      priorStateFingerprint: projection.digest,
      actorId: requireBoundedId(context.actorId, 'actorId'),
      capabilityId: requireBoundedId(context.capabilityId, 'capabilityId'),
      authorityEpoch: context.authorityEpoch,
      policy: context.policy,
      evidenceDigest: context.evidenceDigest,
    };
    return { status: 'prepared', event, request, value };
  }

  async #appendPrepared<TValue>(
    prepared: PreparedContinuityWrite<TValue>,
  ): Promise<DurableAppendReceipt> {
    const authorization = await this.#gateway.authorize(prepared.request);
    if (authorization.verdict !== 'allow') {
      throw new ContinuityIdentityError(
        ContinuityIdentityErrorCodes.AUTHORIZATION_DENIED,
        'Continuity write was denied by the transition authorization gateway',
        { reasonCode: authorization.reasonCode },
      );
    }
    return this.#ledger.appendAuthorized(prepared.event, authorization.proof);
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. DARK LEGACY OBSERVER
// ───────────────────────────────────────────────────────────────────

/** Observe aliases after legacy completion while preserving the exact legacy result. */
export class DarkContinuityIdentityObserver {
  readonly #service: ContinuityIdentityService;
  readonly #adapter: DarkLedgerAdapter;
  readonly #now: () => Date;
  readonly #telemetry: DarkContinuityIdentityTelemetry[] = [];

  public constructor(
    service: ContinuityIdentityService,
    adapter: DarkLedgerAdapter,
    now: () => Date = () => new Date(),
  ) {
    this.#service = service;
    this.#adapter = adapter;
    this.#now = now;
  }

  public async recordAliasAfterLegacy<T>(
    boundaryId: LegacyDarkBoundaryId,
    legacyResult: T,
    input: BindAliasInput,
  ): Promise<T> {
    const namespace = typeof input.namespace === 'string' ? input.namespace : 'invalid';
    const subjectId = typeof input.subjectRef?.id === 'string' ? input.subjectRef.id : 'invalid';
    try {
      const prepared = await this.#service.prepareAliasBinding(input);
      if (prepared.status === 'idempotent') {
        this.#record({
          boundaryId,
          status: 'idempotent',
          aliasNamespace: namespace,
          subjectId,
          errorCode: null,
          adapterEvent: null,
        });
        return legacyResult;
      }
      await this.#adapter.recordAfterLegacy(
        boundaryId,
        legacyResult,
        prepared.event,
        prepared.request,
      );
      const adapterEvent = [...this.#adapter.readTelemetry()]
        .reverse()
        .find((event) => event.requestId === prepared.request.requestId) ?? null;
      this.#record({
        boundaryId,
        status: adapterEvent?.status ?? 'failed',
        aliasNamespace: namespace,
        subjectId,
        errorCode: adapterEvent?.errorCode ?? null,
        adapterEvent,
      });
    } catch (error: unknown) {
      this.#record({
        boundaryId,
        status: 'rejected',
        aliasNamespace: namespace,
        subjectId,
        errorCode: error instanceof ContinuityIdentityError ? error.code : 'UNEXPECTED_FAILURE',
        adapterEvent: null,
      });
    }
    return legacyResult;
  }

  public readTelemetry(): readonly DarkContinuityIdentityTelemetry[] {
    return Object.freeze(this.#telemetry.map((entry) => Object.freeze({ ...entry })));
  }

  #record(event: Omit<DarkContinuityIdentityTelemetry, 'observedAt'>): void {
    this.#telemetry.push(Object.freeze({
      ...event,
      observedAt: this.#now().toISOString(),
    }));
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. FACTORY
// ───────────────────────────────────────────────────────────────────

/** Assemble a standalone dark runtime without wiring any shipped legacy writer. */
export function createContinuityIdentityRuntime(
  options: ContinuityIdentityRuntimeOptions,
): ContinuityIdentityRuntime {
  const eventRegistry = createContinuityIdentityEventRegistry();
  const policy = createContinuityIdentityPolicyRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory: options.rootDirectory,
    ledgerId: options.ledgerId ?? 'continuity-identities',
    auditLedgerId: options.auditLedgerId ?? 'continuity-identity-authorization-audit',
    authorityProvider: options.authorityProvider,
    now: options.now,
    faultInjection: options.faultInjection,
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: options.rootDirectory,
    auditLedgerId: options.auditLedgerId ?? 'continuity-identity-authorization-audit',
    authorityProvider: options.authorityProvider,
    now: options.now,
  }, ledger, policy.registry);
  const darkAdapter = new DarkLedgerAdapter(gateway, ledger, { now: options.now });
  const service = new ContinuityIdentityService(
    ledger,
    gateway,
    eventRegistry,
    policy.reference,
  );
  return Object.freeze({
    eventRegistry,
    ledger,
    gateway,
    darkAdapter,
    service,
    darkObserver: new DarkContinuityIdentityObserver(service, darkAdapter, options.now),
    policy: policy.reference,
  });
}

/** Produce a stable evidence digest for callers that have canonical evidence metadata. */
export function continuityEvidenceDigest(evidence: Readonly<JsonObject>): string {
  return sha256Bytes(canonicalBytes(evidence));
}
