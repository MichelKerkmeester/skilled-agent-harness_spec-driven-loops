// ───────────────────────────────────────────────────────────────────
// MODULE: Receipt and Effect Event Contracts
// ───────────────────────────────────────────────────────────────────

import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
} from './errors.js';

import type {
  EventTypeDefinition,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  BoundaryDefinition,
  BoundaryKind,
  CertificationTrustScope,
  EffectRetryDecision,
  EffectType,
  RecoveryVerdict,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. EVENT IDENTITIES
// ───────────────────────────────────────────────────────────────────

export const BOUNDARY_RECEIPT_EVENT_TYPE = 'deep-loop.receipt.boundary-certified';
export const EFFECT_INTENT_EVENT_TYPE = 'deep-loop.effect.intent-recorded';
export const EFFECT_CONFIRMATION_EVENT_TYPE = 'deep-loop.effect.confirmed';
export const EFFECT_RECOVERY_STARTED_EVENT_TYPE = 'deep-loop.effect.recovery-started';
export const EFFECT_RECONCILED_EVENT_TYPE = 'deep-loop.effect.reconciled';
export const EFFECT_CONFLICT_EVENT_TYPE = 'deep-loop.effect.conflict-detected';
export const EFFECT_OPERATOR_RESOLVED_EVENT_TYPE = 'deep-loop.effect.operator-resolved';

export const RECEIPT_EFFECT_EVENT_TYPES = Object.freeze([
  BOUNDARY_RECEIPT_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_RECOVERY_STARTED_EVENT_TYPE,
  EFFECT_RECONCILED_EVENT_TYPE,
  EFFECT_CONFLICT_EVENT_TYPE,
  EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
]);

// ───────────────────────────────────────────────────────────────────
// 2. BOUNDARY MANIFEST
// ───────────────────────────────────────────────────────────────────

const BOUNDARY_ACTIONS = Object.freeze([
  {
    action: 'enter',
    event: 'entered',
    from: ['inactive'],
    to: 'active',
    result: 'entered',
  },
  {
    action: 'pause',
    event: 'paused',
    from: ['active'],
    to: 'paused',
    result: 'paused',
  },
  {
    action: 'resume',
    event: 'resumed',
    from: ['paused'],
    to: 'active',
    result: 'resumed',
  },
  {
    action: 'completion',
    event: 'completed',
    from: ['active'],
    to: 'completed',
    result: 'completed',
  },
  {
    action: 'abort',
    event: 'aborted',
    from: ['active', 'paused'],
    to: 'aborted',
    result: 'aborted',
  },
  {
    action: 'handoff',
    event: 'handed-off',
    from: ['completed'],
    to: 'handed-off',
    result: 'handed_off',
  },
] as const);

function defaultBoundaryDefinitions(): readonly BoundaryDefinition[] {
  return Object.freeze(
    (['phase', 'mode'] as const).flatMap((scope) => BOUNDARY_ACTIONS.map((entry) =>
      Object.freeze({
        boundaryKind: `${scope}-${entry.action}` as BoundaryKind,
        scope,
        action: entry.action,
        resultEventType: `deep-loop.${scope}.${entry.event}`,
        allowedFromStates: Object.freeze([...entry.from]),
        toState: entry.to,
        resultCode: entry.result,
      }))),
  );
}

export const DEFAULT_BOUNDARY_DEFINITIONS = defaultBoundaryDefinitions();
export const DEFAULT_BOUNDARY_MANIFEST_DIGEST = sha256Bytes(canonicalBytes(
  DEFAULT_BOUNDARY_DEFINITIONS.map((definition) => ({
    boundary_kind: definition.boundaryKind,
    scope: definition.scope,
    action: definition.action,
    result_event_type: definition.resultEventType,
    allowed_from_states: [...definition.allowedFromStates],
    to_state: definition.toState,
    result_code: definition.resultCode,
  })),
));

/** Closed lookup for certifiable boundaries and their exact result contracts. */
export class BoundaryRegistry {
  readonly #definitions: ReadonlyMap<BoundaryKind, BoundaryDefinition>;
  public readonly digest: string;

  public constructor(definitions: readonly BoundaryDefinition[]) {
    const registered = new Map<BoundaryKind, BoundaryDefinition>();
    for (const definition of definitions) {
      if (registered.has(definition.boundaryKind)) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.INVALID_INPUT,
          'input',
          'Boundary registry contains a duplicate kind',
          { boundaryKind: definition.boundaryKind },
        );
      }
      registered.set(definition.boundaryKind, Object.freeze({
        ...definition,
        allowedFromStates: Object.freeze([...definition.allowedFromStates]),
      }));
    }
    this.#definitions = registered;
    this.digest = sha256Bytes(canonicalBytes(this.inspect()));
    Object.freeze(this);
  }

  /** Resolve one registered boundary or reject intermediate and unknown events. */
  public resolve(boundaryKind: BoundaryKind): BoundaryDefinition {
    const definition = this.#definitions.get(boundaryKind);
    if (!definition) {
      throw new ReceiptEffectError(
        ReceiptEffectErrorCodes.UNREGISTERED_BOUNDARY,
        'receipt',
        'Boundary kind is not certifiable',
        { boundaryKind },
      );
    }
    return definition;
  }

  /** Return a stable function-free boundary manifest. */
  public inspect(): readonly JsonObject[] {
    return Object.freeze(
      Array.from(this.#definitions.values())
        .sort((left, right) => left.boundaryKind.localeCompare(right.boundaryKind))
        .map((definition) => Object.freeze({
          boundary_kind: definition.boundaryKind,
          scope: definition.scope,
          action: definition.action,
          result_event_type: definition.resultEventType,
          allowed_from_states: [...definition.allowedFromStates],
          to_state: definition.toState,
          result_code: definition.resultCode,
        })),
    );
  }
}

export function createBoundaryRegistry(): BoundaryRegistry {
  return new BoundaryRegistry(DEFAULT_BOUNDARY_DEFINITIONS);
}

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function isBoundedString(value: unknown, maxLength = 1_024): value is string {
  return typeof value === 'string' && value.trim() !== '' && value.length <= maxLength;
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/u.test(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(value)
    && !Number.isNaN(Date.parse(value));
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isStringArray(value: unknown, predicate = isBoundedString): value is string[] {
  return Array.isArray(value) && value.every((entry) => predicate(entry));
}

function isLedgerHead(value: unknown): boolean {
  return hasExactKeys(value, ['ledger_id', 'sequence', 'record_hash'])
    && isBoundedString(value.ledger_id)
    && isNonNegativeInteger(value.sequence)
    && isDigest(value.record_hash);
}

function isTrustScope(value: unknown): value is CertificationTrustScope {
  return value === 'durable-cross-resume' || value === 'process-local-advisory';
}

function isCertificationEnvelope(value: unknown): boolean {
  return hasExactKeys(value, [
    'scheme',
    'provider_id',
    'key_id',
    'verifier_version',
    'trust_scope',
    'signed_digest',
    'signature_base64',
  ])
    && isBoundedString(value.scheme, 128)
    && isBoundedString(value.provider_id, 256)
    && isBoundedString(value.key_id, 256)
    && isBoundedString(value.verifier_version, 128)
    && isTrustScope(value.trust_scope)
    && isDigest(value.signed_digest)
    && isBoundedString(value.signature_base64, 8_192);
}

function isEffectType(value: unknown): value is EffectType {
  return value === 'api' || value === 'file' || value === 'subprocess';
}

function isAdapter(value: unknown): boolean {
  return hasExactKeys(value, [
    'adapter_id',
    'adapter_version',
    'effect_type',
    'replay_safe',
    'idempotency_mode',
    'reconciliation',
  ])
    && isBoundedString(value.adapter_id, 256)
    && isBoundedString(value.adapter_version, 128)
    && isEffectType(value.effect_type)
    && typeof value.replay_safe === 'boolean'
    && (value.idempotency_mode === 'postcondition' || value.idempotency_mode === 'target-key')
    && (value.reconciliation === 'conclusive' || value.reconciliation === 'none');
}

function isClaim(value: unknown): boolean {
  return hasExactKeys(value, ['claim_id', 'claimant_id', 'fence_token', 'acquired_at'])
    && isBoundedString(value.claim_id)
    && isBoundedString(value.claimant_id)
    && isBoundedString(value.fence_token)
    && isTimestamp(value.acquired_at);
}

// ───────────────────────────────────────────────────────────────────
// 4. PAYLOAD VALIDATORS
// ───────────────────────────────────────────────────────────────────

const BOUNDARY_RESULT_FIELDS = [
  'boundary_id',
  'scope_id',
  'from_state',
  'to_state',
  'result_code',
  'evidence_digest',
  'artifact_digests',
  'replay_fingerprint',
] as const;

function validateBoundaryResult(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.boundary_id)
    && isBoundedString(payload.scope_id)
    && isBoundedString(payload.from_state)
    && isBoundedString(payload.to_state)
    && isBoundedString(payload.result_code)
    && isDigest(payload.evidence_digest)
    && isStringArray(payload.artifact_digests, isDigest)
    && isDigest(payload.replay_fingerprint);
}

const BOUNDARY_RECEIPT_FIELDS = [
  'receipt_id',
  'boundary_id',
  'boundary_kind',
  'scope',
  'scope_id',
  'from_state',
  'to_state',
  'from_head',
  'result_head',
  'result_event_id',
  'result_event_type',
  'result_event_digest',
  'result_code',
  'evidence_digest',
  'artifact_digests',
  'replay_fingerprint',
  'authority_epoch',
  'correlation_id',
  'causation_id',
  'issuer',
  'issued_at',
  'idempotency_key',
  'certification',
] as const;

function validateBoundaryReceipt(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.receipt_id)
    && isBoundedString(payload.boundary_id)
    && DEFAULT_BOUNDARY_DEFINITIONS.some(
      (definition) => definition.boundaryKind === payload.boundary_kind,
    )
    && (payload.scope === 'mode' || payload.scope === 'phase')
    && isBoundedString(payload.scope_id)
    && isBoundedString(payload.from_state)
    && isBoundedString(payload.to_state)
    && isLedgerHead(payload.from_head)
    && isLedgerHead(payload.result_head)
    && isBoundedString(payload.result_event_id)
    && isBoundedString(payload.result_event_type)
    && isDigest(payload.result_event_digest)
    && isBoundedString(payload.result_code)
    && isDigest(payload.evidence_digest)
    && isStringArray(payload.artifact_digests, isDigest)
    && isDigest(payload.replay_fingerprint)
    && isPositiveInteger(payload.authority_epoch)
    && isBoundedString(payload.correlation_id)
    && isBoundedString(payload.causation_id)
    && isBoundedString(payload.issuer)
    && isTimestamp(payload.issued_at)
    && isBoundedString(payload.idempotency_key)
    && isCertificationEnvelope(payload.certification);
}

const EFFECT_INTENT_FIELDS = [
  'effect_id',
  'run_id',
  'logical_effect_id',
  'effect_type',
  'operation',
  'target_identity',
  'input_digest',
  'safe_metadata',
  'secret_references',
  'adapter',
  'idempotency_key',
  'recovery_policy',
  'expected_postcondition_digest',
  'replay_fingerprint',
  'requested_at',
] as const;

function validateEffectIntent(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.effect_id)
    && isBoundedString(payload.run_id)
    && isBoundedString(payload.logical_effect_id)
    && isEffectType(payload.effect_type)
    && isBoundedString(payload.operation)
    && isBoundedString(payload.target_identity)
    && isDigest(payload.input_digest)
    && isRecord(payload.safe_metadata)
    && isStringArray(payload.secret_references)
    && isAdapter(payload.adapter)
    && isBoundedString(payload.idempotency_key)
    && isBoundedString(payload.recovery_policy)
    && isDigest(payload.expected_postcondition_digest)
    && isDigest(payload.replay_fingerprint)
    && isTimestamp(payload.requested_at);
}

const EFFECT_CONFIRMATION_FIELDS = [
  'confirmation_id',
  'effect_id',
  'intent_event_id',
  'intent_event_digest',
  'idempotency_key',
  'adapter',
  'external_receipt_digest',
  'postcondition_digest',
  'output_digest',
  'completion_class',
  'observed_at',
  'safe_result_metadata',
] as const;

function validateEffectConfirmation(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.confirmation_id)
    && isBoundedString(payload.effect_id)
    && isBoundedString(payload.intent_event_id)
    && isDigest(payload.intent_event_digest)
    && isBoundedString(payload.idempotency_key)
    && isAdapter(payload.adapter)
    && isDigest(payload.external_receipt_digest)
    && isDigest(payload.postcondition_digest)
    && isDigest(payload.output_digest)
    && (payload.completion_class === 'executed' || payload.completion_class === 'reconciled')
    && isTimestamp(payload.observed_at)
    && isRecord(payload.safe_result_metadata);
}

const EFFECT_RECOVERY_STARTED_FIELDS = [
  'recovery_id',
  'intent_event_id',
  'intent_event_digest',
  'intent_head',
  'attempt',
  'reason_code',
  'claim',
  'started_at',
] as const;

function validateRecoveryStarted(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.recovery_id)
    && isBoundedString(payload.intent_event_id)
    && isDigest(payload.intent_event_digest)
    && isLedgerHead(payload.intent_head)
    && isPositiveInteger(payload.attempt)
    && isBoundedString(payload.reason_code)
    && isClaim(payload.claim)
    && isTimestamp(payload.started_at);
}

function isRecoveryVerdict(value: unknown): value is RecoveryVerdict {
  return value === 'applied'
    || value === 'conflict'
    || value === 'in_doubt'
    || value === 'not_applied';
}

function isRetryDecision(value: unknown): value is EffectRetryDecision {
  return value === 'execute_once'
    || value === 'operator_required'
    || value === 'reject'
    || value === 'synthesize_confirmation';
}

const EFFECT_RECONCILED_FIELDS = [
  'recovery_id',
  'intent_event_id',
  'verdict',
  'reason_code',
  'evidence_digest',
  'attempt',
  'claim',
  'retry_decision',
  'terminal_status',
  'observed_at',
] as const;

function validateReconciled(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.recovery_id)
    && isBoundedString(payload.intent_event_id)
    && isRecoveryVerdict(payload.verdict)
    && isBoundedString(payload.reason_code)
    && isDigest(payload.evidence_digest)
    && isPositiveInteger(payload.attempt)
    && isClaim(payload.claim)
    && isRetryDecision(payload.retry_decision)
    && (
      payload.terminal_status === 'confirmed'
      || payload.terminal_status === 'conflict'
      || payload.terminal_status === 'operator_required'
      || payload.terminal_status === 'retrying'
    )
    && isTimestamp(payload.observed_at);
}

const EFFECT_CONFLICT_FIELDS = [
  'conflict_id',
  'existing_intent_event_id',
  'run_id',
  'logical_effect_id',
  'existing_idempotency_key_digest',
  'presented_idempotency_key_digest',
  'reason_code',
  'detected_at',
] as const;

function validateConflict(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.conflict_id)
    && isBoundedString(payload.existing_intent_event_id)
    && isBoundedString(payload.run_id)
    && isBoundedString(payload.logical_effect_id)
    && isDigest(payload.existing_idempotency_key_digest)
    && isDigest(payload.presented_idempotency_key_digest)
    && isBoundedString(payload.reason_code)
    && isTimestamp(payload.detected_at);
}

const OPERATOR_RESOLUTION_FIELDS = [
  'resolution_id',
  'intent_event_id',
  'recovery_id',
  'operator_id',
  'resolution',
  'evidence_digest',
  'resolved_at',
] as const;

function validateOperatorResolution(payload: Readonly<JsonObject>): boolean {
  return isBoundedString(payload.resolution_id)
    && isBoundedString(payload.intent_event_id)
    && isBoundedString(payload.recovery_id)
    && isBoundedString(payload.operator_id)
    && (
      payload.resolution === 'confirmed_applied'
      || payload.resolution === 'confirmed_not_applied'
      || payload.resolution === 'terminal_failed'
    )
    && isDigest(payload.evidence_digest)
    && isTimestamp(payload.resolved_at);
}

// ───────────────────────────────────────────────────────────────────
// 5. REGISTRY DEFINITIONS
// ───────────────────────────────────────────────────────────────────

function definition(
  eventType: string,
  requiredFields: readonly string[],
  validate: (payload: Readonly<JsonObject>) => boolean,
): EventTypeDefinition {
  return {
    eventType,
    currentVersion: 1,
    versions: [{
      version: 1,
      payload: { requiredFields, validate },
    }],
    upcasters: [],
  };
}

/** Event definitions for all registered boundary outcomes. */
export function boundaryResultEventDefinitions(
  boundaries: BoundaryRegistry = createBoundaryRegistry(),
): readonly EventTypeDefinition[] {
  return Object.freeze(boundaries.inspect().map((entry) => definition(
    String(entry.result_event_type),
    BOUNDARY_RESULT_FIELDS,
    validateBoundaryResult,
  )));
}

/** Event definitions owned by the receipt and effect-recovery service. */
export function receiptEffectEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    definition(BOUNDARY_RECEIPT_EVENT_TYPE, BOUNDARY_RECEIPT_FIELDS, validateBoundaryReceipt),
    definition(EFFECT_INTENT_EVENT_TYPE, EFFECT_INTENT_FIELDS, validateEffectIntent),
    definition(
      EFFECT_CONFIRMATION_EVENT_TYPE,
      EFFECT_CONFIRMATION_FIELDS,
      validateEffectConfirmation,
    ),
    definition(
      EFFECT_RECOVERY_STARTED_EVENT_TYPE,
      EFFECT_RECOVERY_STARTED_FIELDS,
      validateRecoveryStarted,
    ),
    definition(EFFECT_RECONCILED_EVENT_TYPE, EFFECT_RECONCILED_FIELDS, validateReconciled),
    definition(EFFECT_CONFLICT_EVENT_TYPE, EFFECT_CONFLICT_FIELDS, validateConflict),
    definition(
      EFFECT_OPERATOR_RESOLVED_EVENT_TYPE,
      OPERATOR_RESOLUTION_FIELDS,
      validateOperatorResolution,
    ),
  ]);
}

/** Build one immutable validator-bound registry without mutating the substrate. */
export function createEvidenceControlEventRegistry(
  additionalDefinitions: readonly EventTypeDefinition[] = [],
  boundaries: BoundaryRegistry = createBoundaryRegistry(),
): EventTypeRegistry {
  return new EventTypeRegistry([
    ...additionalDefinitions,
    ...boundaryResultEventDefinitions(boundaries),
    ...receiptEffectEventDefinitions(),
  ]);
}
