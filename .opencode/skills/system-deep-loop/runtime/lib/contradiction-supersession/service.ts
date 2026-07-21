// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Service
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  readAuthorizationAudit,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ClaimRelationshipError,
  ClaimRelationshipErrorCodes,
} from './errors.js';
import {
  CLAIM_RELATIONSHIP_EVENT_VERSION,
  CLAIM_RELATIONSHIP_REDUCER_VERSION,
  RelationshipEventTypes,
  createClaimRelationshipEventRegistry,
  normalizeReferenceSnapshot,
  relationshipPayload,
} from './event-registry.js';
import {
  createEmptyClaimRelationshipProjection,
  foldVerifiedClaimRelationships,
  reduceClaimRelationshipEnvelope,
} from './projection.js';

import type {
  AppendOnlyLedger as AppendOnlyLedgerType,
  AuthoritySnapshot,
  GatewayAllowProof,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  ClaimRelationshipProjection,
  ContradictionSupersessionServiceOptions,
  RecordedRelationship,
  RelationshipRecordInput,
  RelationshipReferenceSnapshot,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS AND POLICY
// ───────────────────────────────────────────────────────────────────

export const CLAIM_RELATIONSHIP_MODE = 'claim-relationships-additive-dark';
export const CLAIM_RELATIONSHIP_CAPABILITY = 'record-claim-relationship';
export const CLAIM_RELATIONSHIP_POLICY_ID = 'claim-relationship-shadow-policy';
export const CLAIM_RELATIONSHIP_POLICY_VERSION = 1;

const DEFAULT_LEDGER_ID = 'claim-relationships-shadow';
const DEFAULT_AUDIT_LEDGER_ID = 'claim-relationships-authorization-audit';
const DEFAULT_STREAM_ID = 'claim-relationships';

function evaluateClaimRelationshipPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  const supportedEvent = input.requestedEventType
    === RelationshipEventTypes.CONTRADICTION_RECORDED
    || input.requestedEventType === RelationshipEventTypes.SUPERSESSION_RECORDED;
  const allowed = input.mode === CLAIM_RELATIONSHIP_MODE
    && input.capabilityId === CLAIM_RELATIONSHIP_CAPABILITY
    && supportedEvent;
  return allowed
    ? {
      verdict: 'allow',
      reasonCode: 'allowed',
      matchedRuleIds: ['additive-dark-relationship-write'],
    }
    : {
      verdict: 'deny',
      reasonCode: 'policy_denied',
      matchedRuleIds: ['additive-dark-relationship-write'],
    };
}

/** Create the closed allow policy used after all relationship-domain checks pass. */
export function createClaimRelationshipPolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: CLAIM_RELATIONSHIP_POLICY_ID,
    policyVersion: CLAIM_RELATIONSHIP_POLICY_VERSION,
    evaluatorVersion: '1',
    ruleIds: ['additive-dark-relationship-write'],
    evaluate: evaluateClaimRelationshipPolicy,
  }]);
}

// ───────────────────────────────────────────────────────────────────
// 2. SERVICE
// ───────────────────────────────────────────────────────────────────

/** Isolated shadow ledger for authorized contradiction and supersession history. */
export class ContradictionSupersessionService {
  public readonly eventRegistry: EventTypeRegistry;
  public readonly ledger: AppendOnlyLedgerType;
  public readonly referenceSnapshot: RelationshipReferenceSnapshot;

  readonly #gateway: TransitionAuthorizationGateway;
  readonly #policies: TransitionPolicyRegistry;
  readonly #rootDirectory: string;
  readonly #auditLedgerId: string;
  readonly #streamId: string;
  readonly #producer: EventProducer;
  readonly #authorityProvider: ContradictionSupersessionServiceOptions['authorityProvider'];

  public constructor(options: ContradictionSupersessionServiceOptions) {
    this.eventRegistry = createClaimRelationshipEventRegistry();
    this.referenceSnapshot = normalizeReferenceSnapshot(options.referenceSnapshot);
    this.#rootDirectory = options.rootDirectory;
    this.#auditLedgerId = options.auditLedgerId ?? DEFAULT_AUDIT_LEDGER_ID;
    this.#streamId = options.streamId ?? DEFAULT_STREAM_ID;
    this.#producer = Object.freeze(options.producer ?? {
      name: 'contradiction-supersession-service',
      version: '1',
    });
    this.#authorityProvider = options.authorityProvider;
    this.#policies = createClaimRelationshipPolicyRegistry();
    this.ledger = new AppendOnlyLedger({
      rootDirectory: options.rootDirectory,
      ledgerId: options.ledgerId ?? DEFAULT_LEDGER_ID,
      auditLedgerId: this.#auditLedgerId,
      authorityProvider: options.authorityProvider,
      now: options.now,
    }, this.eventRegistry);
    this.#gateway = new TransitionAuthorizationGateway({
      rootDirectory: options.rootDirectory,
      auditLedgerId: this.#auditLedgerId,
      authorityProvider: options.authorityProvider,
      now: options.now,
    }, this.ledger, this.#policies);
  }

  /** Read current status only from authorized and durably verified events. */
  public async projection(): Promise<ClaimRelationshipProjection> {
    const events = await this.ledger.readVerifiedEvents();
    return foldVerifiedClaimRelationships(events, this.referenceSnapshot);
  }

  /** Validate, authorize, and durably append one relationship assertion or withdrawal. */
  public async record(input: RelationshipRecordInput): Promise<RecordedRelationship> {
    const events = await this.ledger.readVerifiedEvents();
    const existing = events.find(
      (verified) => verified.event.stored.envelope.event_id === input.eventId,
    );
    if (existing) return this.#retryExisting(input, existing);

    const authority = await this.#authoritySnapshot();
    const event = this.#prepareEvent(
      input,
      events.length + 1,
      authority.epoch,
    );
    const priorProjection = foldVerifiedClaimRelationships(
      events,
      this.referenceSnapshot,
    );

    // Domain simulation deliberately precedes the gateway so invalid graphs cannot consume a sequence.
    reduceClaimRelationshipEnvelope(
      priorProjection,
      event.envelope,
      events.length + 1,
      this.referenceSnapshot,
    );

    const priorHead = await this.ledger.getVerifiedHead();
    if (priorHead.sequence !== events.length) {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.AUTHORIZATION_DENIED,
        'Relationship head changed during pre-append validation; retry from verified state',
        { priorSequence: events.length, currentSequence: priorHead.sequence },
      );
    }
    const policy = this.#policies.resolve(
      CLAIM_RELATIONSHIP_POLICY_ID,
      CLAIM_RELATIONSHIP_POLICY_VERSION,
    );
    const request: TransitionAuthorizationRequest = {
      requestId: input.requestId,
      mode: CLAIM_RELATIONSHIP_MODE,
      event,
      priorHead,
      priorStateVersion: CLAIM_RELATIONSHIP_REDUCER_VERSION,
      priorStateFingerprint: sha256Bytes(canonicalBytes(priorProjection)),
      actorId: input.actorId,
      capabilityId: CLAIM_RELATIONSHIP_CAPABILITY,
      authorityEpoch: authority.epoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: sha256Bytes(canonicalBytes({
        evidence_refs: event.envelope.payload.evidence_refs,
        evidence_snapshot_ref: event.envelope.payload.evidence_snapshot_ref,
      })),
    };
    const authorization = await this.#gateway.authorize(request);
    if (authorization.verdict !== 'allow') {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.AUTHORIZATION_DENIED,
        'Relationship transition did not receive a durable allow decision',
        { reasonCode: authorization.reasonCode },
      );
    }
    const receipt = await this.ledger.appendAuthorized(event, authorization.proof);
    return Object.freeze({ receipt, projection: await this.projection() });
  }

  async #authoritySnapshot(): Promise<AuthoritySnapshot> {
    const authority = await this.#authorityProvider(CLAIM_RELATIONSHIP_MODE);
    if (!authority || !Number.isSafeInteger(authority.epoch) || authority.epoch <= 0) {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.AUTHORIZATION_DENIED,
        'Relationship authority source did not provide a valid epoch',
      );
    }
    return authority;
  }

  #prepareEvent(
    input: RelationshipRecordInput,
    streamSequence: number,
    authorityEpoch: number,
  ): EventWritePreflight {
    const payload = relationshipPayload(
      input.candidate,
      input.action,
      input.retractsEventId,
    );
    const eventType = input.candidate.kind === 'CONTRADICTION'
      ? RelationshipEventTypes.CONTRADICTION_RECORDED
      : RelationshipEventTypes.SUPERSESSION_RECORDED;
    return prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: input.eventId,
      event_type: eventType,
      event_version: CLAIM_RELATIONSHIP_EVENT_VERSION,
      stream_id: this.#streamId,
      stream_sequence: streamSequence,
      occurred_at: input.occurredAt,
      recorded_at: input.recordedAt,
      producer: this.#producer,
      authority_epoch: authorityEpoch,
      correlation_id: input.correlationId,
      causation_id: input.causationId,
      idempotency_key: input.idempotencyKey,
      payload: payload as unknown as JsonObject,
    }, this.eventRegistry);
  }

  async #retryExisting(
    input: RelationshipRecordInput,
    existing: VerifiedLedgerEvent,
  ): Promise<RecordedRelationship> {
    const storedEnvelope = existing.event.stored.envelope;
    const proposed = this.#prepareEvent(
      input,
      storedEnvelope.stream_sequence,
      storedEnvelope.authority_epoch,
    );
    if (proposed.canonicalDigest !== existing.event.stored.digest) {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.EVENT_ID_CONFLICT,
        'Event identity is already bound to different canonical relationship content',
        { eventId: input.eventId, sequence: existing.frame.sequence },
      );
    }
    const proof = await this.#recoverOriginalProof(existing);
    const receipt = await this.ledger.appendAuthorized(proposed, proof);
    return Object.freeze({ receipt, projection: await this.projection() });
  }

  async #recoverOriginalProof(existing: VerifiedLedgerEvent): Promise<GatewayAllowProof> {
    const audit = await readAuthorizationAudit(this.#rootDirectory, this.#auditLedgerId);
    const entry = audit.entries.find(
      (candidate) => candidate.decision.decision_id
        === existing.frame.authorization_ref.decision_id,
    );
    if (!entry || entry.decision.decision !== 'allow') {
      throw new ClaimRelationshipError(
        ClaimRelationshipErrorCodes.AUTHORIZATION_DENIED,
        'Original durable allow proof is unavailable for an exact event retry',
        { eventId: existing.event.stored.envelope.event_id },
      );
    }
    return Object.freeze({
      proofVersion: 1,
      decision: entry.decision,
      auditReceipt: entry.receipt,
    });
  }
}
