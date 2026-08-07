// ───────────────────────────────────────────────────────────────────
// MODULE: Rollback Drill Ledger Harness
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  prepareEventWrite,
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
  prepareReplayFingerprintAttestation,
  recordReplayFingerprintAttestation,
  replayFingerprintAttestationEventDefinition,
  verifyReplayFingerprint,
} from '../replay-fingerprint/index.js';
import {
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EffectRecoveryGateway,
  RECEIPT_EFFECT_EVENT_TYPES,
  createEvidenceControlEventRegistry,
} from '../receipts-and-effect-recovery/index.js';
import {
  RollbackDrillError,
} from './rollback-drill-contract.js';
import {
  RollbackDrillReasonCodes,
} from './rollback-drill-types.js';

import type {
  AuthoritySnapshot,
  GatewayAuthorizationResult,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventTypeDefinition,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  DerivedReplayFingerprint,
  ReplayExecutionInput,
  ReplayFingerprintVerificationResult,
} from '../replay-fingerprint/index.js';
import type { ReplayRangeCoverage } from './rollback-drill-types.js';
import type {
  AuthorizedEvidenceAppendResult,
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectGatewayFaultInjection,
  EffectIntentPayload,
  EffectReconciledPayload,
  EffectRecoveryGatewayOptions,
} from '../receipts-and-effect-recovery/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const ROLLBACK_DRILL_EVENT_TYPE = 'deep-loop.rollback-drill.fact-recorded';

const DRILL_POLICY_ID = 'rollback-drill-transition-policy';
const DRILL_POLICY_VERSION = 1;
const DRILL_POLICY_RULE = 'test-lane-writer-only';
const DRILL_CAPABILITY = 'rollback-drill-write';
const DRILL_LEDGER_ID = 'rollback-drill-domain';
const DRILL_AUDIT_LEDGER_ID = 'rollback-drill-authorization-audit';
const DRILL_REDUCER_ID = 'rollback-drill-state';
const DRILL_REDUCER_VERSION = '1';
const DRILL_PROJECTION_VERSION = '1';
const DRILL_STREAM_ID = 'rollback-drill-state';

interface RollbackProjection extends JsonObject {
  readonly facts: string[];
}

interface RollbackFactPayload extends JsonObject {
  readonly fact_id: string;
  readonly value: string;
  readonly writer_id: string;
}

export interface EffectIntegritySummary {
  readonly intentCount: number;
  readonly confirmationCount: number;
  readonly conflictCount: number;
  readonly operatorRequiredCount: number;
  readonly unresolvedIntentCount: number;
  readonly terminalExactlyOnce: boolean;
}

interface HarnessOptions {
  readonly rootDirectory: string;
  readonly mode: string;
  readonly evidenceDigest: string;
  readonly authorityProvider: () => AuthoritySnapshot;
  readonly now: () => Date;
}

// ───────────────────────────────────────────────────────────────────
// 2. REGISTRIES
// ───────────────────────────────────────────────────────────────────

function validateRollbackFact(payload: Readonly<JsonObject>): boolean {
  return typeof payload.fact_id === 'string'
    && payload.fact_id.length > 0
    && typeof payload.value === 'string'
    && typeof payload.writer_id === 'string'
    && payload.writer_id.length > 0;
}

function rollbackFactDefinition(): EventTypeDefinition {
  return {
    eventType: ROLLBACK_DRILL_EVENT_TYPE,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: {
        requiredFields: ['fact_id', 'value', 'writer_id'],
        validate: validateRollbackFact,
      },
    }],
    upcasters: [],
  };
}

function evaluateDrillPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  const allowedStates = new Set([
    'cutover_ready',
    'new_authoritative_reversible',
    'rollback_pending',
    'legacy_authoritative',
  ]);
  const isAllowed = input.capabilityId === DRILL_CAPABILITY
    && allowedStates.has(input.authorityState);
  return isAllowed
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: [DRILL_POLICY_RULE] }
    : {
        verdict: 'deny',
        reasonCode: 'policy_denied',
        matchedRuleIds: [DRILL_POLICY_RULE],
      };
}

function createDrillPolicyRegistry(): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: DRILL_POLICY_ID,
    policyVersion: DRILL_POLICY_VERSION,
    evaluatorVersion: '1',
    ruleIds: [DRILL_POLICY_RULE],
    evaluate: evaluateDrillPolicy,
  }]);
}

function createDrillEventRegistry(): EventTypeRegistry {
  return createEvidenceControlEventRegistry([
    rollbackFactDefinition(),
    replayFingerprintAttestationEventDefinition(),
  ]);
}

function createReplayComponents(): ReplayComponentRegistry<RollbackProjection> {
  const replayedEventTypes = [
    ROLLBACK_DRILL_EVENT_TYPE,
    REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE,
    ...RECEIPT_EFFECT_EVENT_TYPES,
  ];
  const reducerRegistry = new TypedReducerRegistry<RollbackProjection>(
    replayedEventTypes.map((eventType) => ({
      eventType,
      reducerVersion: DRILL_REDUCER_VERSION,
      reduce: (state, event) => ({
        facts: [
          ...state.facts,
          sha256Bytes(canonicalBytes(event.effective.envelope)),
        ],
      }),
    })),
  );
  return new ReplayComponentRegistry([{
    reducerId: DRILL_REDUCER_ID,
    reducerVersion: DRILL_REDUCER_VERSION,
    projectionSchemaVersion: DRILL_PROJECTION_VERSION,
    requiredReplayInputKeys: ['initial_state'],
    reducerRegistry,
  }]);
}

function replayInput(): ReplayExecutionInput<RollbackProjection> {
  const initialState: RollbackProjection = { facts: [] };
  return {
    reducerId: DRILL_REDUCER_ID,
    reducerVersion: DRILL_REDUCER_VERSION,
    projectionSchemaVersion: DRILL_PROJECTION_VERSION,
    initialState,
    replayInputDigests: {
      initial_state: sha256Bytes(canonicalBytes(initialState)),
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. HARNESS
// ───────────────────────────────────────────────────────────────────

/** Production-shaped gateway and ledger bound exclusively to one isolated lane. */
export class RollbackDrillLedgerHarness {
  public readonly registry: EventTypeRegistry;
  public readonly ledger: AppendOnlyLedger;
  public readonly gateway: TransitionAuthorizationGateway;
  public readonly policies: TransitionPolicyRegistry;
  readonly #options: HarnessOptions;
  readonly #components: ReplayComponentRegistry<RollbackProjection>;
  readonly #versions = createReplayFingerprintVersionRegistry();

  public constructor(options: HarnessOptions) {
    this.#options = options;
    this.registry = createDrillEventRegistry();
    this.policies = createDrillPolicyRegistry();
    this.#components = createReplayComponents();
    this.ledger = new AppendOnlyLedger({
      rootDirectory: options.rootDirectory,
      ledgerId: DRILL_LEDGER_ID,
      auditLedgerId: DRILL_AUDIT_LEDGER_ID,
      authorityProvider: options.authorityProvider,
      now: options.now,
    }, this.registry);
    this.gateway = new TransitionAuthorizationGateway({
      rootDirectory: options.rootDirectory,
      auditLedgerId: DRILL_AUDIT_LEDGER_ID,
      authorityProvider: options.authorityProvider,
      now: options.now,
    }, this.ledger, this.policies);
  }

  /** Append one fact through the same gateway and immutable ledger used by runtime writers. */
  public async appendFact(
    factId: string,
    value: string,
    writerId: string,
    authorityEpoch: number,
  ): Promise<VerifiedLedgerEvent> {
    const events = await this.ledger.readVerifiedEvents();
    const streamSequence = events.filter((entry) =>
      entry.event.effective.envelope.stream_id === DRILL_STREAM_ID).length + 1;
    const occurredAt = this.#options.now().toISOString();
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: `${this.#options.mode}-${factId}-${streamSequence}`,
      event_type: ROLLBACK_DRILL_EVENT_TYPE,
      event_version: 1,
      stream_id: DRILL_STREAM_ID,
      stream_sequence: streamSequence,
      occurred_at: occurredAt,
      recorded_at: occurredAt,
      producer: { name: 'rollback-drill-runner', version: '1' },
      authority_epoch: authorityEpoch,
      correlation_id: `${this.#options.mode}-rollback-drill`,
      causation_id: streamSequence === 1
        ? null
        : `${this.#options.mode}-${factId}-${streamSequence - 1}`,
      idempotency_key: `${this.#options.mode}:${factId}:${streamSequence}`,
      payload: {
        fact_id: factId,
        value,
        writer_id: writerId,
      },
    }, this.registry);
    const result = await this.#authorize(event, writerId, authorityEpoch);
    if (result.verdict !== 'allow') {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
        'Drill fact append was denied by the transition gateway',
        { reasonCode: result.reasonCode },
      );
    }
    await this.ledger.appendAuthorized(event, result.proof);
    const appended = (await this.ledger.readVerifiedEvents()).find((entry) =>
      entry.event.effective.envelope.event_id === event.identity.eventId);
    if (!appended) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
        'Authorized drill fact was not durably readable after append',
      );
    }
    return appended;
  }

  /** Exercise a stale token without appending a domain event. */
  public async tryAuthorizeFact(
    factId: string,
    writerId: string,
    authorityEpoch: number,
  ): Promise<GatewayAuthorizationResult> {
    const events = await this.ledger.readVerifiedEvents();
    const streamSequence = events.filter((entry) =>
      entry.event.effective.envelope.stream_id === DRILL_STREAM_ID).length + 1;
    const occurredAt = this.#options.now().toISOString();
    const event = prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: `${this.#options.mode}-${factId}-${streamSequence}`,
      event_type: ROLLBACK_DRILL_EVENT_TYPE,
      event_version: 1,
      stream_id: DRILL_STREAM_ID,
      stream_sequence: streamSequence,
      occurred_at: occurredAt,
      recorded_at: occurredAt,
      producer: { name: 'rollback-drill-runner', version: '1' },
      authority_epoch: authorityEpoch,
      correlation_id: `${this.#options.mode}-rollback-drill`,
      causation_id: null,
      idempotency_key: `${this.#options.mode}:${factId}:${streamSequence}`,
      payload: { fact_id: factId, value: 'stale-write', writer_id: writerId },
    }, this.registry);
    return this.#authorize(event, writerId, authorityEpoch);
  }

  /** Derive one exact range without inserting an attestation into that range. */
  public deriveFingerprint(
    runId: string,
    rangeEndSequence: number,
  ): Promise<DerivedReplayFingerprint<RollbackProjection>> {
    return deriveReplayFingerprint({
      ledger: this.ledger,
      eventRegistry: this.registry,
      versionRegistry: this.#versions,
      componentRegistry: this.#components,
      runId,
      rangeStartSequence: 1,
      rangeEndSequence,
      replay: replayInput(),
    });
  }

  /** Derive and durably attest one exact closed ledger range. */
  public async deriveAndRecordFingerprint(
    runId: string,
    rangeEndSequence: number,
    authorityEpoch: number,
  ): Promise<DerivedReplayFingerprint<RollbackProjection>> {
    const derived = await this.deriveFingerprint(runId, rangeEndSequence);
    const instant = this.#options.now().toISOString();
    const attestationStreamSequence = (await this.ledger.readVerifiedEvents())
      .filter((entry) => (
        entry.event.effective.envelope.event_type
          === REPLAY_FINGERPRINT_ATTESTATION_EVENT_TYPE
      )).length + 1;
    const attestation = prepareReplayFingerprintAttestation(
      derived,
      this.registry,
      this.#versions,
      {
        eventId: `${this.#options.mode}-${runId}-fingerprint`,
        streamId: 'rollback-drill-fingerprints',
        streamSequence: attestationStreamSequence,
        occurredAt: instant,
        recordedAt: instant,
        producer: { name: 'rollback-drill-runner', version: '1' },
        authorityEpoch,
        correlationId: `${this.#options.mode}-rollback-drill`,
        causationId: null,
        idempotencyKey: `${this.#options.mode}:${runId}:rollback-fingerprint`,
      },
    );
    const authorization = await this.#authorize(
      attestation,
      'rollback-drill-verifier',
      authorityEpoch,
    );
    if (authorization.verdict !== 'allow') {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.REPLAY_INTEGRITY_FAILED,
        'Replay fingerprint attestation was denied',
        { reasonCode: authorization.reasonCode },
      );
    }
    await recordReplayFingerprintAttestation(
      this.ledger,
      attestation,
      authorization.proof,
      derived,
      this.#versions,
    );
    return derived;
  }

  /** Recompute the closed range and accept projection data only from the verified branch. */
  public verifyFingerprint(
    runId: string,
    rangeEndSequence: number,
  ): Promise<ReplayFingerprintVerificationResult<RollbackProjection>> {
    return verifyReplayFingerprint({
      ledger: this.ledger,
      eventRegistry: this.registry,
      versionRegistry: this.#versions,
      componentRegistry: this.#components,
      consumer: 'shadow-parity',
      fingerprintVersion: this.#versions.currentVersion,
      runId,
      rangeStartSequence: 1,
      rangeEndSequence,
      replay: replayInput(),
    });
  }

  /** Prove the verified range includes every post-divergence evidence class. */
  public async inspectRangeCoverage(
    sealedHeadSequence: number,
    rangeEndSequence: number,
  ): Promise<ReplayRangeCoverage> {
    const events = (await this.ledger.readVerifiedEvents())
      .filter((entry) => entry.frame.sequence <= rangeEndSequence);
    const factIds = new Set(events
      .filter((entry) => (
        entry.event.effective.envelope.event_type === ROLLBACK_DRILL_EVENT_TYPE
      ))
      .map((entry) => String(entry.event.effective.envelope.payload.fact_id)));
    const terminalEffectTypes = new Set([
      EFFECT_CONFIRMATION_EVENT_TYPE,
      EFFECT_CONFLICT_EVENT_TYPE,
      EFFECT_RECONCILED_EVENT_TYPE,
    ]);
    return Object.freeze({
      rangeStartSequence: 1,
      rangeEndSequence,
      sealedHeadSequence,
      postDivergenceEventCount: Math.max(0, rangeEndSequence - sealedHeadSequence),
      boundedSpineWorkCovered: factIds.has('bounded-spine-work'),
      effectEventsCovered: events.some((entry) => (
        entry.event.effective.envelope.event_type === EFFECT_INTENT_EVENT_TYPE
      )) && events.some((entry) => (
        terminalEffectTypes.has(entry.event.effective.envelope.event_type)
      )),
      forwardCutoverCovered: factIds.has('forward-cutover'),
      rollbackTransitionCovered: factIds.has('rollback-pending')
        && factIds.has('legacy-restored'),
      restoredStateCovered: factIds.has('restored-state'),
    });
  }

  /** Construct the receipt/effect service over the same authorized sandbox ledger. */
  public createEffectGateway(
    faultInjection: EffectGatewayFaultInjection,
    validateRecoveryClaim: EffectRecoveryGatewayOptions['validateRecoveryClaim'],
  ): EffectRecoveryGateway {
    return new EffectRecoveryGateway({
      writer: {
        append: (event) => this.#appendEvidenceEvent(event),
        findEvent: async (eventId) => (await this.ledger.readVerifiedEvents())
          .find((entry) => entry.event.effective.envelope.event_id === eventId) ?? null,
        readVerifiedEvents: () => this.ledger.readVerifiedEvents(),
      },
      registry: this.registry,
      producer: { name: 'rollback-drill-effect-gateway', version: '1' },
      now: this.#options.now,
      validateRecoveryClaim,
      faultInjection,
      maxRecoveryAttempts: 2,
      intentRaceWaitMs: 1,
      intentRacePollMs: 1,
    });
  }

  /** Summarize lifecycle closure from verified receipt-service events only. */
  public async summarizeEffects(): Promise<EffectIntegritySummary> {
    const events = await this.ledger.readVerifiedEvents();
    const intents = events.filter((entry) =>
      entry.event.effective.envelope.event_type === EFFECT_INTENT_EVENT_TYPE);
    const confirmations = events.filter((entry) =>
      entry.event.effective.envelope.event_type === EFFECT_CONFIRMATION_EVENT_TYPE);
    const conflicts = events.filter((entry) =>
      entry.event.effective.envelope.event_type === EFFECT_CONFLICT_EVENT_TYPE);
    const reconciliations = events.filter((entry) =>
      entry.event.effective.envelope.event_type === EFFECT_RECONCILED_EVENT_TYPE);
    const confirmationCounts = new Map<string, number>();
    for (const entry of confirmations) {
      const payload = entry.event.effective.envelope.payload as EffectConfirmationPayload;
      confirmationCounts.set(
        payload.intent_event_id,
        (confirmationCounts.get(payload.intent_event_id) ?? 0) + 1,
      );
    }
    const conflictIntentIds = new Set(conflicts.map((entry) => {
      const payload = entry.event.effective.envelope.payload as EffectConflictPayload;
      return payload.existing_intent_event_id;
    }));
    const operatorRequiredIntentIds = new Set(reconciliations
      .filter((entry) => {
        const payload = entry.event.effective.envelope.payload as EffectReconciledPayload;
        return payload.terminal_status === 'operator_required';
      })
      .map((entry) => {
        const payload = entry.event.effective.envelope.payload as EffectReconciledPayload;
        return payload.intent_event_id;
      }));
    let unresolvedIntentCount = 0;
    for (const entry of intents) {
      const eventId = entry.event.effective.envelope.event_id;
      if ((confirmationCounts.get(eventId) ?? 0) !== 1) unresolvedIntentCount += 1;
    }
    const terminalExactlyOnce = intents.length > 0
      && unresolvedIntentCount === 0
      && [...confirmationCounts.values()].every((count) => count === 1)
      && conflictIntentIds.size === 0
      && operatorRequiredIntentIds.size === 0;
    return Object.freeze({
      intentCount: intents.length,
      confirmationCount: confirmations.length,
      conflictCount: conflicts.length,
      operatorRequiredCount: operatorRequiredIntentIds.size,
      unresolvedIntentCount,
      terminalExactlyOnce,
    });
  }

  async #appendEvidenceEvent(
    event: EventWritePreflight,
  ): Promise<AuthorizedEvidenceAppendResult> {
    const existing = (await this.ledger.readVerifiedEvents()).find((entry) =>
      entry.event.effective.envelope.event_id === event.identity.eventId);
    if (existing) {
      if (existing.event.stored.digest !== event.canonicalDigest) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.EFFECT_CONFLICT,
          'Effect event identity is already bound to different canonical bytes',
        );
      }
      return Object.freeze({
        status: 'idempotent',
        receipt: Object.freeze({
          ...existing.frame.receipt,
          canonicalEventHash: existing.frame.canonical_event_hash,
          recordHash: existing.frame.record_hash,
          authorizationRef: existing.frame.authorization_ref,
        }),
        verified: existing,
      });
    }
    const authorization = await this.#authorize(
      event,
      'rollback-drill-effect-writer',
      event.identity.authorityEpoch,
    );
    if (authorization.verdict !== 'allow') {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
        'Effect evidence append was denied by the transition gateway',
        { reasonCode: authorization.reasonCode },
      );
    }
    const receipt = await this.ledger.appendAuthorized(event, authorization.proof);
    const verified = (await this.ledger.readVerifiedEvents()).find((entry) =>
      entry.event.effective.envelope.event_id === event.identity.eventId);
    if (!verified) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
        'Effect evidence was not durably readable after append',
      );
    }
    return Object.freeze({ status: 'appended', receipt, verified });
  }

  async #authorize(
    event: EventWritePreflight,
    actorId: string,
    authorityEpoch: number,
  ): Promise<GatewayAuthorizationResult> {
    const policy = this.policies.resolve(DRILL_POLICY_ID, DRILL_POLICY_VERSION);
    const authority = this.#options.authorityProvider();
    const request: TransitionAuthorizationRequest = {
      requestId: `${event.identity.eventId}-request`,
      mode: this.#options.mode,
      event,
      priorHead: await this.ledger.getVerifiedHead(),
      priorStateVersion: 'rollback-drill-state@1',
      priorStateFingerprint: sha256Bytes(canonicalBytes({
        state: authority.state,
        epoch: authority.epoch,
      })),
      actorId,
      capabilityId: DRILL_CAPABILITY,
      authorityEpoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: this.#options.evidenceDigest,
    };
    return this.gateway.authorize(request);
  }
}
