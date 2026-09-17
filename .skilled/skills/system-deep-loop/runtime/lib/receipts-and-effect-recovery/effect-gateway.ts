// ───────────────────────────────────────────────────────────────────
// MODULE: Effect Recovery Gateway
// ───────────────────────────────────────────────────────────────────

import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EFFECT_RECOVERY_STARTED_EVENT_TYPE,
  effectConfirmationBindsIntent,
} from './event-contracts.js';
import {
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
} from './errors.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  EffectAdapter,
  EffectConfirmationPayload,
  EffectConflictPayload,
  EffectExecutionInput,
  EffectExecutionResult,
  EffectGatewayFaultInjection,
  EffectIntentPayload,
  EffectObservation,
  EffectRecoveryGatewayOptions,
  EffectRecoveryInput,
  EffectRecoveryResult,
  EffectRecoveryStartedPayload,
  EffectReconciliationObservation,
  EffectReconciledPayload,
  EffectRetryDecision,
  OperatorResolutionPayload,
  RecoveryVerdict,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

export interface OperatorResolutionInput<TRequest> {
  readonly execution: EffectExecutionInput<TRequest>;
  readonly adapter: EffectAdapter<TRequest>;
  readonly recoveryId: string;
  readonly operatorId: string;
  readonly resolution: 'confirmed_applied' | 'confirmed_not_applied' | 'terminal_failed';
  readonly evidenceDigest: string;
  readonly resolvedAt: string;
}

const DEFAULT_MAX_RECOVERY_ATTEMPTS = 3;
const DEFAULT_INTENT_RACE_WAIT_MS = 2_000;
const DEFAULT_INTENT_RACE_POLL_MS = 10;
const DIGEST_PATTERN = /^[a-f0-9]{64}$/u;
const SECRET_KEY_PATTERN = /(authorization|credential|password|private[-_]?key|secret|token|api[-_]?key)/iu;
const SECRET_VALUE_PATTERNS = [
  /^bearer\s+/iu,
  /^sk-[a-z0-9_-]{12,}$/iu,
  /^gh[pousr]_[a-z0-9]{20,}$/iu,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/u,
] as const;
const SECRET_REFERENCE_PATTERN = /^(env|keychain|provider|vault):[A-Za-z0-9_./:@-]+$/u;

// ───────────────────────────────────────────────────────────────────
// 2. DERIVATION AND SECURITY
// ───────────────────────────────────────────────────────────────────

function inputDigest(input: JsonValue): string {
  return sha256Bytes(canonicalBytes(input));
}

/** Derive one replay-stable key without attempt, process, or transport identities. */
export function deriveEffectIdempotencyKey(
  input: Readonly<Pick<
    EffectExecutionInput,
    'canonicalInput' | 'logicalEffectId' | 'operation' | 'runId' | 'targetIdentity'
  >>,
): string {
  const digest = sha256Bytes(canonicalBytes({
    namespace: 'recoverable-effect-v1',
    run_id: input.runId,
    logical_effect_id: input.logicalEffectId,
    operation: input.operation,
    target_identity: input.targetIdentity,
    input_digest: inputDigest(input.canonicalInput),
  }));
  return `recoverable-effect:v1:${digest}`;
}

function eventId(prefix: string, value: JsonValue): string {
  return `${prefix}-${sha256Bytes(canonicalBytes(value))}`;
}

function assertDigest(value: string, field: string): void {
  if (!DIGEST_PATTERN.test(value)) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'Effect evidence requires lowercase SHA-256 digests',
      { field },
    );
  }
}

function assertSafeEvidence(value: JsonValue, path = 'safe_metadata'): void {
  if (typeof value === 'string') {
    if (SECRET_VALUE_PATTERNS.some((pattern) => pattern.test(value))) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.SECRET_MATERIAL_FORBIDDEN,
        'security',
        'Ledger-safe effect metadata contains secret-shaped material',
        { field: path },
      );
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertSafeEvidence(entry, `${path}[${index}]`));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (SECRET_KEY_PATTERN.test(key)) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.SECRET_MATERIAL_FORBIDDEN,
          'security',
          'Ledger-safe effect metadata contains a secret-bearing field',
          { field: `${path}.${key}` },
        );
      }
      assertSafeEvidence(entry, `${path}.${key}`);
    }
  }
}

function assertSecretReferences(references: readonly string[]): void {
  for (const reference of references) {
    if (!SECRET_REFERENCE_PATTERN.test(reference)) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.SECRET_MATERIAL_FORBIDDEN,
        'security',
        'Secret material must be represented by a bounded provider reference',
        { field: 'secret_references' },
      );
    }
  }
}

function assertAdapter<TRequest>(
  adapter: EffectAdapter<TRequest>,
): void {
  const descriptor = adapter.descriptor;
  if (
    !descriptor.replay_safe
    || descriptor.reconciliation !== 'conclusive'
    || typeof adapter.execute !== 'function'
    || typeof adapter.reconcile !== 'function'
  ) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.ADAPTER_UNSUPPORTED,
      'effect',
      'Recoverable effects require explicit idempotency and conclusive reconciliation',
      { adapterId: descriptor.adapter_id },
    );
  }
}

function validateExecutionInput<TRequest>(
  input: EffectExecutionInput<TRequest>,
  adapter: EffectAdapter<TRequest>,
): void {
  assertAdapter(adapter);
  assertDigest(input.expectedPostconditionDigest, 'expectedPostconditionDigest');
  assertDigest(input.replayFingerprint, 'replayFingerprint');
  assertSafeEvidence(input.safeMetadata);
  assertSecretReferences(input.secretReferences);
  try {
    if (canonicalJson(input.request as unknown as JsonValue) !== canonicalJson(input.canonicalInput)) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.INVALID_INPUT,
        'input',
        'Adapter request must equal the canonical input committed by the durable intent',
      );
    }
  } catch (error: unknown) {
    if (error instanceof ReceiptEffectError) throw error;
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'Adapter request must be representable by the canonical event encoding',
    );
  }
  if (
    input.runId.trim() === ''
    || input.logicalEffectId.trim() === ''
    || input.operation.trim() === ''
    || input.targetIdentity.trim() === ''
  ) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'Effect scope, operation, and target identities must be non-empty',
    );
  }
}

function validateObservation(
  intent: Readonly<EffectIntentPayload>,
  observation: Readonly<EffectObservation>,
): void {
  assertDigest(observation.external_receipt_digest, 'external_receipt_digest');
  assertDigest(observation.postcondition_digest, 'postcondition_digest');
  assertDigest(observation.output_digest, 'output_digest');
  assertSafeEvidence(observation.safe_result_metadata, 'safe_result_metadata');
  if (observation.postcondition_digest !== intent.expected_postcondition_digest) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
      'effect',
      'Observed postcondition does not match the durable intent',
      { effectId: intent.effect_id },
    );
  }
}

function committedRequest<TRequest>(input: Readonly<EffectExecutionInput<TRequest>>): TRequest {
  return input.canonicalInput as unknown as TRequest;
}

function sameAdapterObservation(
  observation: Readonly<EffectObservation>,
  confirmation: Readonly<EffectConfirmationPayload>,
): boolean {
  return observation.external_receipt_digest === confirmation.external_receipt_digest
    && observation.postcondition_digest === confirmation.postcondition_digest
    && observation.output_digest === confirmation.output_digest
    && canonicalJson(observation.safe_result_metadata)
      === canonicalJson(confirmation.safe_result_metadata);
}

// ───────────────────────────────────────────────────────────────────
// 3. EVENT HELPERS
// ───────────────────────────────────────────────────────────────────

function payloadOf<TPayload extends JsonObject>(event: VerifiedLedgerEvent): TPayload {
  return event.event.effective.envelope.payload as TPayload;
}

function streamId(intent: Readonly<EffectIntentPayload>): string {
  return `recoverable-effect:${intent.run_id}:${intent.logical_effect_id}`;
}

function envelopeEvent(
  options: EffectRecoveryGatewayOptions,
  input: Readonly<EffectExecutionInput>,
  eventType: string,
  eventIdentity: string,
  streamIdentity: string,
  streamSequence: number,
  occurredAt: string,
  causationId: string | null,
  idempotencyKey: string,
  payload: JsonObject,
): EventWritePreflight {
  return prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventIdentity,
    event_type: eventType,
    event_version: 1,
    stream_id: streamIdentity,
    stream_sequence: streamSequence,
    occurred_at: occurredAt,
    recorded_at: occurredAt,
    producer: options.producer,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: causationId,
    idempotency_key: idempotencyKey,
    payload,
  }, options.registry);
}

function intentCore(payload: Readonly<EffectIntentPayload>): JsonObject {
  return {
    effect_id: payload.effect_id,
    run_id: payload.run_id,
    logical_effect_id: payload.logical_effect_id,
    effect_type: payload.effect_type,
    operation: payload.operation,
    target_identity: payload.target_identity,
    input_digest: payload.input_digest,
    safe_metadata: payload.safe_metadata,
    secret_references: [...payload.secret_references],
    adapter: payload.adapter,
    idempotency_key: payload.idempotency_key,
    recovery_policy: payload.recovery_policy,
    expected_postcondition_digest: payload.expected_postcondition_digest,
    replay_fingerprint: payload.replay_fingerprint,
  };
}

function expectedIntentCore<TRequest>(
  input: EffectExecutionInput<TRequest>,
  adapter: EffectAdapter<TRequest>,
  idempotencyKey: string,
): JsonObject {
  const effectId = eventId('effect', idempotencyKey);
  return {
    effect_id: effectId,
    run_id: input.runId,
    logical_effect_id: input.logicalEffectId,
    effect_type: adapter.descriptor.effect_type,
    operation: input.operation,
    target_identity: input.targetIdentity,
    input_digest: inputDigest(input.canonicalInput),
    safe_metadata: input.safeMetadata,
    secret_references: [...input.secretReferences].sort(),
    adapter: adapter.descriptor,
    idempotency_key: idempotencyKey,
    recovery_policy: input.recoveryPolicy,
    expected_postcondition_digest: input.expectedPostconditionDigest,
    replay_fingerprint: input.replayFingerprint,
  };
}

function retryDecision(verdict: RecoveryVerdict): EffectRetryDecision {
  switch (verdict) {
    case 'not_applied': return 'execute_once';
    case 'applied': return 'synthesize_confirmation';
    case 'in_doubt': return 'operator_required';
    case 'conflict': return 'reject';
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. GATEWAY
// ───────────────────────────────────────────────────────────────────

/** Exclusive recoverable-effect entry point with durable intent and reconciliation. */
export class EffectRecoveryGateway {
  readonly #options: EffectRecoveryGatewayOptions;
  readonly #now: () => Date;
  readonly #maxRecoveryAttempts: number;
  readonly #intentRaceWaitMs: number;
  readonly #intentRacePollMs: number;
  readonly #faults: EffectGatewayFaultInjection;
  readonly #locks = new Map<string, Promise<void>>();

  public constructor(options: EffectRecoveryGatewayOptions) {
    this.#options = options;
    this.#now = options.now ?? (() => new Date());
    this.#maxRecoveryAttempts = options.maxRecoveryAttempts ?? DEFAULT_MAX_RECOVERY_ATTEMPTS;
    this.#intentRaceWaitMs = options.intentRaceWaitMs ?? DEFAULT_INTENT_RACE_WAIT_MS;
    this.#intentRacePollMs = options.intentRacePollMs ?? DEFAULT_INTENT_RACE_POLL_MS;
    this.#faults = options.faultInjection ?? {};
    if (!Number.isSafeInteger(this.#maxRecoveryAttempts) || this.#maxRecoveryAttempts <= 0) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.INVALID_INPUT,
        'input',
        'Recovery attempt limit must be a positive safe integer',
        { maxRecoveryAttempts: this.#maxRecoveryAttempts },
      );
    }
    if (
      !Number.isSafeInteger(this.#intentRaceWaitMs)
      || this.#intentRaceWaitMs < 0
      || !Number.isSafeInteger(this.#intentRacePollMs)
      || this.#intentRacePollMs <= 0
    ) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.INVALID_INPUT,
        'input',
        'Intent-race wait and poll durations must be bounded safe integers',
      );
    }
  }

  /** Record intent, execute once, verify the target, and record confirmation. */
  public async execute<TRequest>(
    input: EffectExecutionInput<TRequest>,
    adapter: EffectAdapter<TRequest>,
  ): Promise<EffectExecutionResult> {
    validateExecutionInput(input, adapter);
    const key = deriveEffectIdempotencyKey(input);
    const logicalLock = `${input.runId}\u0000${input.logicalEffectId}`;
    return this.#withLock(logicalLock, () => this.#executeLocked(input, adapter, key));
  }

  async #executeLocked<TRequest>(
    input: EffectExecutionInput<TRequest>,
    adapter: EffectAdapter<TRequest>,
    key: string,
  ): Promise<EffectExecutionResult> {
    const events = await this.#options.writer.readVerifiedEvents();
    const confirmations = this.#confirmationIndex(events);
    const logicalIntent = events.find((event) => {
      if (event.event.effective.envelope.event_type !== EFFECT_INTENT_EVENT_TYPE) return false;
      const payload = payloadOf<EffectIntentPayload>(event);
      return payload.run_id === input.runId && payload.logical_effect_id === input.logicalEffectId;
    });
    if (logicalIntent) {
      const existingIntent = payloadOf<EffectIntentPayload>(logicalIntent);
      const expected = expectedIntentCore(input, adapter, key);
      if (canonicalJson(intentCore(existingIntent)) !== canonicalJson(expected)) {
        await this.#recordConflict(logicalIntent, input, key);
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.EFFECT_CONFLICT,
          'effect',
          'Logical effect identity is already bound to different canonical inputs',
          { logicalEffectId: input.logicalEffectId },
        );
      }
      const confirmation = confirmations.get(logicalIntent.event.effective.envelope.event_id);
      if (confirmation) {
        const payload = payloadOf<EffectConfirmationPayload>(confirmation);
        await this.#verifyConfirmationExternalTruth(
          existingIntent,
          payload,
          adapter,
          committedRequest(input),
        );
        return Object.freeze({
          status: 'idempotent',
          idempotencyKey: key,
          intent: existingIntent,
          confirmation: payload,
        });
      }
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.EFFECT_INTENT_UNRESOLVED,
        'effect',
        'Durable effect intent requires reconciliation before any replay',
        { logicalEffectId: input.logicalEffectId },
      );
    }

    this.#faults.beforeIntent?.();
    const intent = this.#buildIntent(input, adapter, key);
    const intentEventId = eventId('effect-intent', key);
    const intentEvent = envelopeEvent(
      this.#options,
      input,
      EFFECT_INTENT_EVENT_TYPE,
      intentEventId,
      streamId(intent),
      1,
      intent.requested_at,
      input.causationId,
      key,
      intent,
    );
    const appendedIntent = await this.#options.writer.append(intentEvent);
    if (appendedIntent.verified.frame.sequence <= 0) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.AUTHORIZED_APPEND_FAILED,
        'authorization',
        'Effect intent is not durable',
        { effectId: intent.effect_id },
      );
    }
    if (appendedIntent.status === 'idempotent') {
      return this.#waitForIntentWinner(
        appendedIntent.verified,
        input,
        adapter,
        key,
      );
    }
    this.#faults.afterIntent?.();

    await this.#executeAdapter(intent, adapter, committedRequest(input), key);
    const observation = await this.#requireAppliedExternalObservation(
      intent,
      adapter,
      committedRequest(input),
    );
    this.#faults.afterEffectBeforeConfirmation?.();
    const confirmation = await this.#appendConfirmation(
      input,
      appendedIntent.verified,
      intent,
      observation,
      'executed',
      2,
    );
    this.#faults.afterConfirmationBeforeResponse?.();
    return Object.freeze({
      status: 'confirmed',
      idempotencyKey: key,
      intent,
      confirmation,
    });
  }

  /** Reconcile one unresolved intent before any retry decision. */
  public async recover<TRequest>(
    input: EffectRecoveryInput<TRequest>,
    adapter: EffectAdapter<TRequest>,
  ): Promise<EffectRecoveryResult> {
    validateExecutionInput(input.execution, adapter);
    const key = deriveEffectIdempotencyKey(input.execution);
    const logicalLock = `${input.execution.runId}\u0000${input.execution.logicalEffectId}`;
    return this.#withLock(logicalLock, () => this.#recoverLocked(input, adapter, key));
  }

  async #recoverLocked<TRequest>(
    input: EffectRecoveryInput<TRequest>,
    adapter: EffectAdapter<TRequest>,
    key: string,
  ): Promise<EffectRecoveryResult> {
    const events = await this.#options.writer.readVerifiedEvents();
    const confirmations = this.#confirmationIndex(events);
    const intentEvent = this.#findIntent(events, input.execution.runId, input.execution.logicalEffectId);
    if (!intentEvent) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
        'recovery',
        'Recovery requires one verified durable intent',
        { logicalEffectId: input.execution.logicalEffectId },
      );
    }
    const intent = payloadOf<EffectIntentPayload>(intentEvent);
    if (canonicalJson(intentCore(intent)) !== canonicalJson(expectedIntentCore(input.execution, adapter, key))) {
      await this.#recordConflict(intentEvent, input.execution, key);
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.EFFECT_CONFLICT,
        'recovery',
        'Recovery request does not reproduce the durable intent',
        { logicalEffectId: input.execution.logicalEffectId },
      );
    }
    const existingConfirmation = confirmations.get(intentEvent.event.effective.envelope.event_id);
    if (existingConfirmation) {
      await this.#verifyConfirmationExternalTruth(
        intent,
        payloadOf<EffectConfirmationPayload>(existingConfirmation),
        adapter,
        committedRequest(input.execution),
      );
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
        'recovery',
        'Confirmed effects do not permit another recovery attempt',
        { effectId: intent.effect_id },
      );
    }
    const isClaimValid = await this.#options.validateRecoveryClaim(input.claim, intent);
    if (!isClaimValid) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.RECOVERY_CLAIM_REJECTED,
        'recovery',
        'Recovery claim or fence is not current for the unresolved intent',
        { effectId: intent.effect_id, claimId: input.claim.claim_id },
      );
    }
    const priorAttempts = events.filter((event) =>
      event.event.effective.envelope.event_type === EFFECT_RECOVERY_STARTED_EVENT_TYPE
      && payloadOf<EffectRecoveryStartedPayload>(event).intent_event_id
        === intentEvent.event.effective.envelope.event_id).length;
    if (priorAttempts >= this.#maxRecoveryAttempts) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.RECOVERY_EXHAUSTED,
        'recovery',
        'Recovery retry budget is exhausted without converting uncertainty into success',
        { effectId: intent.effect_id, attempts: priorAttempts },
      );
    }
    const attempt = priorAttempts + 1;
    const recoveryId = eventId('effect-recovery', {
      intent_event_id: intentEvent.event.effective.envelope.event_id,
      attempt,
      claim_id: input.claim.claim_id,
    });
    const startPayload: EffectRecoveryStartedPayload = Object.freeze({
      recovery_id: recoveryId,
      intent_event_id: intentEvent.event.effective.envelope.event_id,
      intent_event_digest: intentEvent.event.stored.digest,
      intent_head: Object.freeze({
        ledger_id: intentEvent.frame.ledger_id,
        sequence: intentEvent.frame.sequence,
        record_hash: intentEvent.frame.record_hash,
      }),
      attempt,
      reason_code: input.reasonCode,
      claim: input.claim,
      started_at: input.startedAt,
    });
    const sequence = this.#nextStreamSequence(events, streamId(intent));
    const startedEvent = envelopeEvent(
      this.#options,
      input.execution,
      EFFECT_RECOVERY_STARTED_EVENT_TYPE,
      `${recoveryId}-started`,
      streamId(intent),
      sequence,
      startPayload.started_at,
      intentEvent.event.effective.envelope.event_id,
      `${key}:recovery:${attempt}:started`,
      startPayload,
    );
    await this.#options.writer.append(startedEvent);

    const reconciliation = await this.#queryExternalOutcome(
      intent,
      adapter,
      committedRequest(input.execution),
    );
    this.#validateReconciliation(intent, reconciliation);

    if (reconciliation.verdict === 'in_doubt' || reconciliation.verdict === 'conflict') {
      const reconciled = this.#reconciledPayload(
        startPayload,
        reconciliation,
        retryDecision(reconciliation.verdict),
        reconciliation.verdict === 'in_doubt' ? 'operator_required' : 'conflict',
      );
      await this.#appendReconciled(
        input.execution,
        intent,
        reconciled,
        startedEvent.identity.eventId,
        key,
        sequence + 1,
      );
      return Object.freeze({
        status: reconciliation.verdict === 'in_doubt' ? 'operator_required' : 'conflict',
        verdict: reconciliation.verdict,
        idempotencyKey: key,
        confirmation: null,
        recovery: reconciled,
      });
    }

    let observation: EffectObservation;
    if (reconciliation.verdict === 'applied') {
      observation = reconciliation.observation as EffectObservation;
    } else {
      await this.#executeAdapter(intent, adapter, committedRequest(input.execution), key);
      observation = await this.#requireAppliedExternalObservation(
        intent,
        adapter,
        committedRequest(input.execution),
      );
    }
    this.#faults.afterEffectBeforeConfirmation?.();
    const reconciled = this.#reconciledPayload(
      startPayload,
      reconciliation,
      retryDecision(reconciliation.verdict),
      'confirmed',
    );
    await this.#appendReconciled(
      input.execution,
      intent,
      reconciled,
      startedEvent.identity.eventId,
      key,
      sequence + 1,
    );
    const confirmation = await this.#appendConfirmation(
      input.execution,
      intentEvent,
      intent,
      observation,
      'reconciled',
      sequence + 2,
    );
    return Object.freeze({
      status: 'confirmed',
      verdict: reconciliation.verdict,
      idempotencyKey: key,
      confirmation,
      recovery: reconciled,
    });
  }

  /** Record an operator decision and require evidence before confirmation or replay. */
  public async resolveOperatorDecision<TRequest>(
    input: OperatorResolutionInput<TRequest>,
  ): Promise<EffectConfirmationPayload | null> {
    validateExecutionInput(input.execution, input.adapter);
    assertDigest(input.evidenceDigest, 'evidenceDigest');
    const key = deriveEffectIdempotencyKey(input.execution);
    const logicalLock = `${input.execution.runId}\u0000${input.execution.logicalEffectId}`;
    return this.#withLock(logicalLock, async () => {
      const events = await this.#options.writer.readVerifiedEvents();
      const confirmations = this.#confirmationIndex(events);
      const intentEvent = this.#findIntent(
        events,
        input.execution.runId,
        input.execution.logicalEffectId,
      );
      if (!intentEvent) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
          'recovery',
          'Operator resolution requires one unresolved verified intent',
        );
      }
      const intent = payloadOf<EffectIntentPayload>(intentEvent);
      if (
        canonicalJson(intentCore(intent))
        !== canonicalJson(expectedIntentCore(input.execution, input.adapter, key))
      ) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.EFFECT_CONFLICT,
          'recovery',
          'Operator resolution request does not reproduce the durable intent',
          { recoveryId: input.recoveryId },
        );
      }
      const existingConfirmation = confirmations.get(
        intentEvent.event.effective.envelope.event_id,
      );
      if (existingConfirmation) {
        if (input.resolution === 'terminal_failed') {
          throw new ReceiptEffectError(
            ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
            'recovery',
            'A confirmed effect cannot be resolved as terminal failure',
          );
        }
        const payload = payloadOf<EffectConfirmationPayload>(existingConfirmation);
        await this.#verifyConfirmationExternalTruth(
          intent,
          payload,
          input.adapter,
          committedRequest(input.execution),
        );
        return payload;
      }
      const inDoubt = events.find((event) =>
        event.event.effective.envelope.event_type === EFFECT_RECONCILED_EVENT_TYPE
        && payloadOf<EffectReconciledPayload>(event).recovery_id === input.recoveryId
        && payloadOf<EffectReconciledPayload>(event).intent_event_id
          === intentEvent.event.effective.envelope.event_id
        && payloadOf<EffectReconciledPayload>(event).verdict === 'in_doubt');
      if (!inDoubt) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
          'recovery',
          'Operator resolution is limited to a recorded in-doubt recovery',
          { recoveryId: input.recoveryId },
        );
      }
      const resolution: OperatorResolutionPayload = Object.freeze({
        resolution_id: eventId('operator-resolution', {
          recovery_id: input.recoveryId,
          resolution: input.resolution,
          evidence_digest: input.evidenceDigest,
        }),
        intent_event_id: intentEvent.event.effective.envelope.event_id,
        recovery_id: input.recoveryId,
        operator_id: input.operatorId,
        resolution: input.resolution,
        evidence_digest: input.evidenceDigest,
        resolved_at: input.resolvedAt,
      });
      const priorResolutions = events.filter((event) =>
        event.event.effective.envelope.event_type === EFFECT_OPERATOR_RESOLVED_EVENT_TYPE
        && payloadOf<OperatorResolutionPayload>(event).recovery_id === input.recoveryId);
      if (priorResolutions.length > 1) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
          'recovery',
          'Recovery contains duplicate operator resolutions',
          { recoveryId: input.recoveryId },
        );
      }
      let resolutionWon = false;
      const priorResolution = priorResolutions[0];
      if (priorResolution) {
        if (
          canonicalJson(payloadOf<OperatorResolutionPayload>(priorResolution))
          !== canonicalJson(resolution)
        ) {
          throw new ReceiptEffectError(
            ReceiptEffectErrorCodes.EFFECT_CONFLICT,
            'recovery',
            'Recovery is already bound to different operator-resolution facts',
            { recoveryId: input.recoveryId },
          );
        }
      } else {
        const sequence = this.#nextStreamSequence(events, streamId(intent));
        const resolutionEvent = envelopeEvent(
          this.#options,
          input.execution,
          EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
          resolution.resolution_id,
          streamId(intent),
          sequence,
          resolution.resolved_at,
          inDoubt.event.effective.envelope.event_id,
          `${key}:operator:${input.recoveryId}`,
          resolution,
        );
        resolutionWon = (await this.#options.writer.append(resolutionEvent)).status === 'appended';
      }
      if (input.resolution === 'terminal_failed') return null;

      if (!resolutionWon) {
        const winner = await this.#waitForBoundConfirmation(
          intentEvent,
          intent,
          input.adapter,
          committedRequest(input.execution),
        );
        if (winner) return winner;
      }

      const reconciliation = await this.#queryExternalOutcome(
        intent,
        input.adapter,
        committedRequest(input.execution),
      );
      this.#validateReconciliation(intent, reconciliation);
      let observation: EffectObservation;
      if (reconciliation.verdict === 'applied') {
        observation = reconciliation.observation as EffectObservation;
      } else if (
        input.resolution === 'confirmed_not_applied'
        && reconciliation.verdict === 'not_applied'
      ) {
        await this.#executeAdapter(
          intent,
          input.adapter,
          committedRequest(input.execution),
          key,
        );
        observation = await this.#requireAppliedExternalObservation(
          intent,
          input.adapter,
          committedRequest(input.execution),
        );
      } else {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
          'recovery',
          'Operator resolution requires a conclusive external postcondition',
          { recoveryId: input.recoveryId },
        );
      }
      this.#faults.afterEffectBeforeConfirmation?.();
      const currentEvents = await this.#options.writer.readVerifiedEvents();
      this.#confirmationIndex(currentEvents);
      return this.#appendConfirmation(
        input.execution,
        intentEvent,
        intent,
        observation,
        'reconciled',
        this.#nextStreamSequence(currentEvents, streamId(intent)),
      );
    });
  }

  #buildIntent<TRequest>(
    input: EffectExecutionInput<TRequest>,
    adapter: EffectAdapter<TRequest>,
    key: string,
  ): EffectIntentPayload {
    return Object.freeze({
      effect_id: eventId('effect', key),
      run_id: input.runId,
      logical_effect_id: input.logicalEffectId,
      effect_type: adapter.descriptor.effect_type,
      operation: input.operation,
      target_identity: input.targetIdentity,
      input_digest: inputDigest(input.canonicalInput),
      safe_metadata: input.safeMetadata,
      secret_references: [...input.secretReferences].sort(),
      adapter: adapter.descriptor,
      idempotency_key: key,
      recovery_policy: input.recoveryPolicy,
      expected_postcondition_digest: input.expectedPostconditionDigest,
      replay_fingerprint: input.replayFingerprint,
      requested_at: input.requestedAt,
    });
  }

  async #appendConfirmation(
    input: EffectExecutionInput,
    intentEvent: VerifiedLedgerEvent,
    intent: EffectIntentPayload,
    observation: EffectObservation,
    completionClass: 'executed' | 'reconciled',
    streamSequence: number,
  ): Promise<EffectConfirmationPayload> {
    validateObservation(intent, observation);
    const confirmationId = eventId('effect-confirmation', intent.idempotency_key);
    const payload: EffectConfirmationPayload = Object.freeze({
      confirmation_id: confirmationId,
      effect_id: intent.effect_id,
      intent_event_id: intentEvent.event.effective.envelope.event_id,
      intent_event_digest: intentEvent.event.stored.digest,
      idempotency_key: intent.idempotency_key,
      adapter: intent.adapter,
      external_receipt_digest: observation.external_receipt_digest,
      postcondition_digest: observation.postcondition_digest,
      output_digest: observation.output_digest,
      completion_class: completionClass,
      observed_at: observation.observed_at,
      safe_result_metadata: observation.safe_result_metadata,
    });
    if (!effectConfirmationBindsIntent(
      payload,
      intent,
      intentEvent.event.effective.envelope.event_id,
      intentEvent.event.stored.digest,
    )) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
        'effect',
        'Confirmation facts do not bind to the durable intent',
        { effectId: intent.effect_id },
      );
    }
    const event = envelopeEvent(
      this.#options,
      input,
      EFFECT_CONFIRMATION_EVENT_TYPE,
      confirmationId,
      streamId(intent),
      streamSequence,
      payload.observed_at,
      payload.intent_event_id,
      `${intent.idempotency_key}:confirmation`,
      payload,
    );
    const appended = await this.#options.writer.append(event);
    const durablePayload = payloadOf<EffectConfirmationPayload>(appended.verified);
    if (!effectConfirmationBindsIntent(
      durablePayload,
      intent,
      intentEvent.event.effective.envelope.event_id,
      intentEvent.event.stored.digest,
    )) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
        'effect',
        'Durable confirmation does not bind to the executed intent',
        { effectId: intent.effect_id },
      );
    }
    return durablePayload;
  }

  async #executeAdapter<TRequest>(
    intent: Readonly<EffectIntentPayload>,
    adapter: EffectAdapter<TRequest>,
    request: TRequest,
    key: string,
  ): Promise<void> {
    try {
      await adapter.execute(intent, request, key);
    } catch (error: unknown) {
      if (error instanceof ReceiptEffectError) throw error;
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.EFFECT_EXECUTION_FAILED,
        'effect',
        'Adapter execution failed after durable intent',
        { effectId: intent.effect_id, adapterId: adapter.descriptor.adapter_id },
      );
    }
  }

  async #queryExternalOutcome<TRequest>(
    intent: Readonly<EffectIntentPayload>,
    adapter: EffectAdapter<TRequest>,
    request: TRequest,
  ): Promise<EffectReconciliationObservation> {
    try {
      return await adapter.reconcile(intent, request);
    } catch {
      return Object.freeze({
        verdict: 'in_doubt',
        reason_code: 'reconciliation_unavailable',
        evidence_digest: sha256Bytes(canonicalBytes({ available: false })),
        observed_at: this.#now().toISOString(),
        observation: null,
      });
    }
  }

  #validateReconciliation(
    intent: Readonly<EffectIntentPayload>,
    reconciliation: Readonly<EffectReconciliationObservation>,
  ): void {
    assertDigest(reconciliation.evidence_digest, 'reconciliation.evidence_digest');
    if (!['not_applied', 'applied', 'in_doubt', 'conflict'].includes(reconciliation.verdict)) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.RECOVERY_STATE_INVALID,
        'recovery',
        'Adapter returned an unknown reconciliation verdict',
        { effectId: intent.effect_id },
      );
    }
    if (reconciliation.verdict === 'applied') {
      if (reconciliation.observation === null) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
          'recovery',
          'Applied reconciliation requires an external target observation',
          { effectId: intent.effect_id },
        );
      }
      validateObservation(intent, reconciliation.observation);
      return;
    }
    if (reconciliation.observation !== null) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
        'recovery',
        'Non-applied reconciliation cannot carry applied-outcome evidence',
        { effectId: intent.effect_id },
      );
    }
  }

  async #requireAppliedExternalObservation<TRequest>(
    intent: Readonly<EffectIntentPayload>,
    adapter: EffectAdapter<TRequest>,
    request: TRequest,
  ): Promise<EffectObservation> {
    const reconciliation = await this.#queryExternalOutcome(intent, adapter, request);
    this.#validateReconciliation(intent, reconciliation);
    if (reconciliation.verdict !== 'applied' || reconciliation.observation === null) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
        'effect',
        'Effect confirmation requires a conclusive external postcondition query',
        { effectId: intent.effect_id },
      );
    }
    return reconciliation.observation;
  }

  async #verifyConfirmationExternalTruth<TRequest>(
    intent: Readonly<EffectIntentPayload>,
    confirmation: Readonly<EffectConfirmationPayload>,
    adapter: EffectAdapter<TRequest>,
    request: TRequest,
  ): Promise<void> {
    const observation = await this.#requireAppliedExternalObservation(intent, adapter, request);
    if (!sameAdapterObservation(observation, confirmation)) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
        'effect',
        'External target facts do not match the durable confirmation',
        { effectId: intent.effect_id },
      );
    }
  }

  #confirmationIndex(
    events: readonly VerifiedLedgerEvent[],
  ): ReadonlyMap<string, VerifiedLedgerEvent> {
    const intents = new Map<string, VerifiedLedgerEvent>();
    for (const event of events) {
      if (event.event.effective.envelope.event_type === EFFECT_INTENT_EVENT_TYPE) {
        intents.set(event.event.effective.envelope.event_id, event);
      }
    }

    const confirmations = new Map<string, VerifiedLedgerEvent>();
    for (const event of events) {
      if (event.event.effective.envelope.event_type !== EFFECT_CONFIRMATION_EVENT_TYPE) continue;
      const payload = payloadOf<EffectConfirmationPayload>(event);
      const intentEvent = intents.get(payload.intent_event_id);
      if (!intentEvent) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
          'effect',
          'Confirmation is orphaned from its durable intent',
          { confirmationId: payload.confirmation_id },
        );
      }
      const intent = payloadOf<EffectIntentPayload>(intentEvent);
      if (
        event.event.effective.envelope.event_id !== payload.confirmation_id
        || event.event.effective.envelope.causation_id !== payload.intent_event_id
        || event.event.effective.envelope.stream_id
          !== intentEvent.event.effective.envelope.stream_id
        || !effectConfirmationBindsIntent(
          payload,
          intent,
          intentEvent.event.effective.envelope.event_id,
          intentEvent.event.stored.digest,
        )
      ) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
          'effect',
          'Confirmation facts do not match the referenced durable intent',
          { confirmationId: payload.confirmation_id },
        );
      }
      if (confirmations.has(payload.intent_event_id)) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
          'effect',
          'Durable intent has duplicate confirmations',
          { effectId: intent.effect_id },
        );
      }
      confirmations.set(payload.intent_event_id, event);
    }
    return confirmations;
  }

  async #waitForBoundConfirmation<TRequest>(
    intentEvent: VerifiedLedgerEvent,
    intent: Readonly<EffectIntentPayload>,
    adapter: EffectAdapter<TRequest>,
    request: TRequest,
  ): Promise<EffectConfirmationPayload | null> {
    const deadline = Date.now() + this.#intentRaceWaitMs;
    while (true) {
      const events = await this.#options.writer.readVerifiedEvents();
      const confirmation = this.#confirmationIndex(events).get(
        intentEvent.event.effective.envelope.event_id,
      );
      if (confirmation) {
        const payload = payloadOf<EffectConfirmationPayload>(confirmation);
        await this.#verifyConfirmationExternalTruth(intent, payload, adapter, request);
        return payload;
      }
      if (Date.now() >= deadline) return null;
      await new Promise<void>((resolve) => {
        setTimeout(resolve, this.#intentRacePollMs);
      });
    }
  }

  async #waitForIntentWinner<TRequest>(
    intentEvent: VerifiedLedgerEvent,
    input: EffectExecutionInput<TRequest>,
    adapter: EffectAdapter<TRequest>,
    key: string,
  ): Promise<EffectExecutionResult> {
    const intent = payloadOf<EffectIntentPayload>(intentEvent);
    if (canonicalJson(intentCore(intent)) !== canonicalJson(expectedIntentCore(input, adapter, key))) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.EFFECT_CONFLICT,
        'effect',
        'Winning durable intent does not match the presented logical effect',
        { logicalEffectId: input.logicalEffectId },
      );
    }
    const confirmation = await this.#waitForBoundConfirmation(
      intentEvent,
      intent,
      adapter,
      committedRequest(input),
    );
    if (!confirmation) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.EFFECT_INTENT_UNRESOLVED,
        'effect',
        'Another process owns execution and has not durably confirmed it',
        { logicalEffectId: input.logicalEffectId },
      );
    }
    return Object.freeze({
      status: 'idempotent',
      idempotencyKey: key,
      intent,
      confirmation,
    });
  }

  #reconciledPayload(
    started: Readonly<EffectRecoveryStartedPayload>,
    reconciliation: Readonly<EffectReconciliationObservation>,
    retryDecisionValue: EffectRetryDecision,
    terminalStatus: EffectReconciledPayload['terminal_status'],
  ): EffectReconciledPayload {
    return Object.freeze({
      recovery_id: started.recovery_id,
      intent_event_id: started.intent_event_id,
      verdict: reconciliation.verdict,
      reason_code: reconciliation.reason_code,
      evidence_digest: reconciliation.evidence_digest,
      attempt: started.attempt,
      claim: started.claim,
      retry_decision: retryDecisionValue,
      terminal_status: terminalStatus,
      observed_at: reconciliation.observed_at,
    });
  }

  async #appendReconciled(
    input: EffectExecutionInput,
    intent: Readonly<EffectIntentPayload>,
    reconciled: EffectReconciledPayload,
    causationId: string,
    key: string,
    streamSequence: number,
  ): Promise<void> {
    const event = envelopeEvent(
      this.#options,
      input,
      EFFECT_RECONCILED_EVENT_TYPE,
      `${reconciled.recovery_id}-reconciled`,
      streamId(intent),
      streamSequence,
      reconciled.observed_at,
      causationId,
      `${key}:recovery:${reconciled.attempt}:reconciled`,
      reconciled,
    );
    await this.#options.writer.append(event);
  }

  async #recordConflict<TRequest>(
    existingIntent: VerifiedLedgerEvent,
    input: EffectExecutionInput<TRequest>,
    presentedKey: string,
  ): Promise<void> {
    const existing = payloadOf<EffectIntentPayload>(existingIntent);
    const detectedAt = this.#now().toISOString();
    const conflictId = eventId('effect-conflict', {
      existing_intent_event_id: existingIntent.event.effective.envelope.event_id,
      presented_idempotency_key: presentedKey,
    });
    const payload: EffectConflictPayload = Object.freeze({
      conflict_id: conflictId,
      existing_intent_event_id: existingIntent.event.effective.envelope.event_id,
      run_id: input.runId,
      logical_effect_id: input.logicalEffectId,
      existing_idempotency_key_digest: sha256Bytes(canonicalBytes(existing.idempotency_key)),
      presented_idempotency_key_digest: sha256Bytes(canonicalBytes(presentedKey)),
      reason_code: 'logical_effect_facts_changed',
      detected_at: detectedAt,
    });
    const events = await this.#options.writer.readVerifiedEvents();
    const event = envelopeEvent(
      this.#options,
      input,
      EFFECT_CONFLICT_EVENT_TYPE,
      conflictId,
      streamId(existing),
      this.#nextStreamSequence(events, streamId(existing)),
      detectedAt,
      existingIntent.event.effective.envelope.event_id,
      `${existing.idempotency_key}:conflict:${payload.presented_idempotency_key_digest}`,
      payload,
    );
    await this.#options.writer.append(event);
  }

  #findIntent(
    events: readonly VerifiedLedgerEvent[],
    runId: string,
    logicalEffectId: string,
  ): VerifiedLedgerEvent | null {
    return events.find((event) => {
      if (event.event.effective.envelope.event_type !== EFFECT_INTENT_EVENT_TYPE) return false;
      const payload = payloadOf<EffectIntentPayload>(event);
      return payload.run_id === runId && payload.logical_effect_id === logicalEffectId;
    }) ?? null;
  }

  #nextStreamSequence(events: readonly VerifiedLedgerEvent[], identity: string): number {
    return events.filter(
      (event) => event.event.effective.envelope.stream_id === identity,
    ).length + 1;
  }

  async #withLock<TResult>(key: string, operation: () => Promise<TResult>): Promise<TResult> {
    const prior = this.#locks.get(key) ?? Promise.resolve();
    let release: () => void = () => undefined;
    const current = new Promise<void>((resolve) => { release = resolve; });
    const chained = prior.then(() => current);
    this.#locks.set(key, chained);
    await prior;
    try {
      return await operation();
    } finally {
      release();
      if (this.#locks.get(key) === chained) this.#locks.delete(key);
    }
  }
}
