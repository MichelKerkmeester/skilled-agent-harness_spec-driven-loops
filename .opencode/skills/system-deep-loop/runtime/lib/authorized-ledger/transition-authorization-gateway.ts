// ───────────────────────────────────────────────────────────────────
// MODULE: Transition Authorization Gateway
// ───────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';

import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AUTHORIZATION_DECISION_EVENT_TYPE,
  asAuthorizationDecisionRecord,
  createAuthorizationDecisionRegistry,
} from './authorization-decision-event.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';
import {
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  GENESIS_RECORD_HASH,
} from './authorized-ledger-types.js';
import { ImmutableFrameStore } from './immutable-frame-store.js';
import { TransitionPolicyRegistry } from './transition-policy-registry.js';

import type {
  AuthorizationAuditFrame,
  AuthorizationAuditReceipt,
  AuthorizationDecisionRecord,
  AuthorizationGatewayOptions,
  AuthorizationLedgerView,
  AuthorizationReasonCode,
  AuthoritySnapshot,
  GatewayAllowProof,
  GatewayAuthorizationResult,
  LedgerHead,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
} from './authorized-ledger-types.js';
import type { EventReadResult, EventWritePreflight, JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface AuthorizationAuditEntry {
  readonly frame: AuthorizationAuditFrame;
  readonly event: EventReadResult;
  readonly decision: AuthorizationDecisionRecord;
  readonly receipt: AuthorizationAuditReceipt;
}

export interface VerifiedAuthorizationAudit {
  readonly head: LedgerHead;
  readonly entries: readonly AuthorizationAuditEntry[];
}

interface DecisionContext {
  readonly request: TransitionAuthorizationRequest | null;
  readonly evaluationInput: PolicyEvaluationInput;
  readonly requestId: string;
  readonly requestDigest: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly policyDigest: string;
  readonly evaluatorVersion: string;
  readonly authority: AuthoritySnapshot;
  readonly authorityAvailable: boolean;
}

interface DecisionOutcome {
  readonly verdict: 'allow' | 'deny';
  readonly reasonCode: AuthorizationReasonCode;
  readonly matchedRuleIds: readonly string[];
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const AUDIT_FRAME_VERSION = 1;
const PROOF_VERSION = 1;
const DEFAULT_AUDIT_LEDGER_ID = 'authorization-audit';
const DEFAULT_DECISION_FRESHNESS_MS = 60_000;
const DEFAULT_EVALUATOR_TIMEOUT_MS = 1_000;
const PLACEHOLDER_DIGEST = sha256Bytes(canonicalBytes({ unavailable: true }));
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 3. DECISION HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '' && value.length <= 4_096;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isValidHead(value: unknown): value is LedgerHead {
  return isRecord(value)
    && isNonEmptyString(value.ledgerId)
    && Number.isSafeInteger(value.sequence)
    && (value.sequence as number) >= 0
    && typeof value.recordHash === 'string'
    && HASH_PATTERN.test(value.recordHash);
}

function isEventPreflight(value: unknown): value is EventWritePreflight {
  if (!isRecord(value) || !isRecord(value.envelope) || !isRecord(value.identity)) return false;
  if (
    !isNonEmptyString(value.canonicalDigest)
    || !Array.isArray(value.canonicalBytes)
    || !isNonEmptyString(value.registryDigest)
  ) {
    return false;
  }
  const canonical = canonicalBytes(value.envelope);
  return canonicalJson(canonical) === canonicalJson(value.canonicalBytes)
    && sha256Bytes(canonical) === value.canonicalDigest
    && value.identity.eventId === value.envelope.event_id
    && value.identity.eventType === value.envelope.event_type
    && value.identity.eventVersion === value.envelope.event_version
    && value.identity.streamId === value.envelope.stream_id
    && value.identity.streamSequence === value.envelope.stream_sequence
    && value.identity.authorityEpoch === value.envelope.authority_epoch
    && value.identity.idempotencyKey === value.envelope.idempotency_key;
}

function isTransitionRequest(value: unknown): value is TransitionAuthorizationRequest {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.requestId)
    && isNonEmptyString(value.mode)
    && isEventPreflight(value.event)
    && isValidHead(value.priorHead)
    && isNonEmptyString(value.priorStateVersion)
    && isNonEmptyString(value.priorStateFingerprint)
    && isNonEmptyString(value.actorId)
    && isNonEmptyString(value.capabilityId)
    && isPositiveInteger(value.authorityEpoch)
    && isRecord(value.policy)
    && isNonEmptyString(value.policy.policyId)
    && isPositiveInteger(value.policy.policyVersion)
    && typeof value.policy.policyDigest === 'string'
    && HASH_PATTERN.test(value.policy.policyDigest)
    && typeof value.evidenceDigest === 'string'
    && HASH_PATTERN.test(value.evidenceDigest);
}

function requestEvaluationInput(
  request: TransitionAuthorizationRequest,
  authority: AuthoritySnapshot,
): PolicyEvaluationInput {
  return Object.freeze({
    mode: request.mode,
    streamId: request.event.identity.streamId,
    priorHeadSequence: request.priorHead.sequence,
    priorHeadHash: request.priorHead.recordHash,
    priorStateVersion: request.priorStateVersion,
    priorStateFingerprint: request.priorStateFingerprint,
    requestedEventId: request.event.identity.eventId,
    requestedEventType: request.event.identity.eventType,
    requestedEventVersion: request.event.identity.eventVersion,
    requestedEventDigest: request.event.canonicalDigest,
    actorId: request.actorId,
    capabilityId: request.capabilityId,
    authorityState: authority.state,
    authorityEpoch: request.authorityEpoch,
    evidenceDigest: request.evidenceDigest,
    correlationId: request.event.envelope.correlation_id,
    causationId: request.event.envelope.causation_id,
    idempotencyKeyDigest: sha256Bytes(canonicalBytes(request.event.identity.idempotencyKey)),
  });
}

function invalidEvaluationInput(): PolicyEvaluationInput {
  return Object.freeze({
    mode: 'unknown',
    streamId: 'unknown',
    priorHeadSequence: 0,
    priorHeadHash: GENESIS_RECORD_HASH,
    priorStateVersion: 'unknown',
    priorStateFingerprint: PLACEHOLDER_DIGEST,
    requestedEventId: `invalid-${randomUUID()}`,
    requestedEventType: 'invalid.request.rejected',
    requestedEventVersion: 1,
    requestedEventDigest: PLACEHOLDER_DIGEST,
    actorId: 'unknown',
    capabilityId: 'unknown',
    authorityState: 'legacy_authoritative',
    authorityEpoch: 1,
    evidenceDigest: PLACEHOLDER_DIGEST,
    correlationId: `invalid-${randomUUID()}`,
    causationId: null,
    idempotencyKeyDigest: PLACEHOLDER_DIGEST,
  });
}

function requestDigest(
  requestId: string,
  ledgerId: string,
  registryDigest: string,
  input: PolicyEvaluationInput,
  policyId: string,
  policyVersion: number,
  policyDigest: string,
): string {
  return sha256Bytes(canonicalBytes({
    requestId,
    ledgerId,
    registryDigest,
    input,
    policyId,
    policyVersion,
    policyDigest,
  }));
}

function withoutDecisionDigest(
  decision: AuthorizationDecisionRecord,
): Omit<AuthorizationDecisionRecord, 'decision_digest'> {
  const { decision_digest: ignored, ...hashInput } = decision;
  void ignored;
  return hashInput;
}

function calculateDecisionDigest(decision: AuthorizationDecisionRecord): string {
  return sha256Bytes(canonicalBytes(withoutDecisionDigest(decision)));
}

function withoutAuditRecordHash(
  frame: AuthorizationAuditFrame,
): Omit<AuthorizationAuditFrame, 'record_hash'> {
  const { record_hash: ignored, ...hashInput } = frame;
  void ignored;
  return hashInput;
}

function auditFrameHash(frame: AuthorizationAuditFrame): string {
  return sha256Bytes(canonicalBytes(withoutAuditRecordHash(frame)));
}

function decodeCanonicalEventBytes(encoded: string): Buffer {
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length === 0 || bytes.toString('base64') !== encoded) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Ledger frame contains malformed canonical event bytes',
    );
  }
  return bytes;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error('POLICY_EVALUATION_TIMEOUT')), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}

function normalizePolicyResult(
  result: PolicyEvaluationResult,
  allowedRules: ReadonlySet<string>,
): DecisionOutcome {
  if (
    !isRecord(result)
    || (result.verdict !== AuthorizationVerdicts.ALLOW
      && result.verdict !== AuthorizationVerdicts.DENY)
    || !Array.isArray(result.matchedRuleIds)
    || result.matchedRuleIds.some((ruleId) => !isNonEmptyString(ruleId))
  ) {
    return {
      verdict: AuthorizationVerdicts.DENY,
      reasonCode: AuthorizationReasonCodes.EVALUATOR_AMBIGUOUS,
      matchedRuleIds: [],
    };
  }
  const matchedRuleIds = [...result.matchedRuleIds].sort();
  if (matchedRuleIds.some((ruleId) => !allowedRules.has(ruleId))) {
    return {
      verdict: AuthorizationVerdicts.DENY,
      reasonCode: AuthorizationReasonCodes.UNKNOWN_RULE,
      matchedRuleIds,
    };
  }
  if (
    result.verdict === AuthorizationVerdicts.ALLOW
    && result.reasonCode !== AuthorizationReasonCodes.ALLOWED
  ) {
    return {
      verdict: AuthorizationVerdicts.DENY,
      reasonCode: AuthorizationReasonCodes.EVALUATOR_AMBIGUOUS,
      matchedRuleIds,
    };
  }
  return {
    verdict: result.verdict,
    reasonCode: result.verdict === AuthorizationVerdicts.ALLOW
      ? AuthorizationReasonCodes.ALLOWED
      : AuthorizationReasonCodes.POLICY_DENIED,
    matchedRuleIds,
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. AUDIT LEDGER
// ───────────────────────────────────────────────────────────────────

function verifyAuditUnlocked(store: ImmutableFrameStore): VerifiedAuthorizationAudit {
  const registry = createAuthorizationDecisionRegistry();
  const frames = store.readFrameFilesUnlocked();
  const recoveries = store.readRecoveryEvidenceUnlocked();
  const consumedRecoveries = new Set<number>();
  const entries: AuthorizationAuditEntry[] = [];
  let priorHash = GENESIS_RECORD_HASH;
  let priorSequence = 0;

  for (const stored of frames) {
    const recovery = recoveries.get(stored.sequence);
    if (recovery) {
      if (
        recovery.record.prior_sequence !== priorSequence
        || recovery.record.prior_record_hash !== priorHash
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_HASH_MISMATCH,
          'integrity',
          'Audit recovery marker is not linked to the verified prior head',
          { sequence: stored.sequence },
        );
      }
      consumedRecoveries.add(stored.sequence);
    }
    if (!stored.isTerminated) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.TORN_TAIL,
        'integrity',
        'Authorization audit ledger ends with a torn frame',
        { sequence: stored.sequence },
      );
    }
    if (stored.sequence !== priorSequence + 1) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.FRAME_SEQUENCE_MISMATCH,
        'integrity',
        'Authorization audit sequence is not contiguous',
        { expected: priorSequence + 1, actual: stored.sequence },
      );
    }
    let frame: AuthorizationAuditFrame;
    try {
      frame = JSON.parse(stored.bytes.subarray(0, -1).toString('utf8')) as AuthorizationAuditFrame;
    } catch {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
        'integrity',
        'Authorization audit frame is not valid JSON',
        { sequence: stored.sequence },
      );
    }
    if (
      frame.frame_version !== AUDIT_FRAME_VERSION
      || frame.ledger_id !== store.ledgerId
      || frame.sequence !== stored.sequence
      || frame.prev_record_hash !== priorHash
      || frame.record_hash !== auditFrameHash(frame)
    ) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.FRAME_HASH_MISMATCH,
        'integrity',
        'Authorization audit frame identity or hash chain is invalid',
        { sequence: stored.sequence },
      );
    }
    const eventBytes = decodeCanonicalEventBytes(frame.canonical_event_bytes);
    const event = readEvent(eventBytes, registry);
    const decision = asAuthorizationDecisionRecord(event.effective.envelope.payload);
    if (
      event.stored.digest !== frame.canonical_event_hash
      || event.effective.envelope.event_type !== AUTHORIZATION_DECISION_EVENT_TYPE
      || event.effective.envelope.stream_id !== store.ledgerId
      || event.effective.envelope.stream_sequence !== stored.sequence
      || event.effective.envelope.event_id !== decision.decision_id
      || decision.decision_digest !== frame.decision_digest
      || calculateDecisionDigest(decision) !== decision.decision_digest
    ) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.AUDIT_EVENT_INVALID,
        'integrity',
        'Authorization audit event does not match its immutable decision frame',
        { sequence: stored.sequence },
      );
    }
    const receipt: AuthorizationAuditReceipt = Object.freeze({
      auditLedgerId: store.ledgerId,
      sequence: stored.sequence,
      recordHash: frame.record_hash,
      canonicalEventHash: frame.canonical_event_hash,
    });
    entries.push(Object.freeze({ frame, event, decision, receipt }));
    priorHash = frame.record_hash;
    priorSequence = frame.sequence;
  }

  for (const [sequence, recovery] of recoveries) {
    if (consumedRecoveries.has(sequence)) continue;
    if (
      sequence !== priorSequence + 1
      || recovery.record.prior_sequence !== priorSequence
      || recovery.record.prior_record_hash !== priorHash
    ) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.FRAME_SEQUENCE_MISMATCH,
        'integrity',
        'Authorization audit recovery evidence creates an invalid gap',
        { sequence },
      );
    }
  }
  return Object.freeze({
    head: Object.freeze({ ledgerId: store.ledgerId, sequence: priorSequence, recordHash: priorHash }),
    entries: Object.freeze(entries),
  });
}

/** Read the dedicated decision stream without exposing its append capability. */
export async function readAuthorizationAudit(
  rootDirectory: string,
  auditLedgerId = DEFAULT_AUDIT_LEDGER_ID,
): Promise<VerifiedAuthorizationAudit> {
  const store = new ImmutableFrameStore({ rootDirectory, ledgerId: auditLedgerId });
  return store.withExclusiveLock(() => verifyAuditUnlocked(store));
}

class DecisionAuditLog {
  readonly #store: ImmutableFrameStore;
  readonly #now: () => Date;

  public constructor(rootDirectory: string, auditLedgerId: string, now: () => Date) {
    this.#store = new ImmutableFrameStore({ rootDirectory, ledgerId: auditLedgerId });
    this.#now = now;
  }

  public async read(): Promise<VerifiedAuthorizationAudit> {
    return this.#store.withExclusiveLock(() => verifyAuditUnlocked(this.#store));
  }

  public async append(decision: AuthorizationDecisionRecord): Promise<AuthorizationAuditReceipt> {
    return this.#store.withExclusiveLock(() => {
      const verified = verifyAuditUnlocked(this.#store);
      const exactRetry = verified.entries.find(
        (entry) => entry.decision.request_id === decision.request_id
          && entry.decision.request_digest === decision.request_digest,
      );
      if (exactRetry) return exactRetry.receipt;
      const sequence = verified.head.sequence + 1;
      const timestamp = this.#now().toISOString();
      const registry = createAuthorizationDecisionRegistry();
      const event = prepareEventWrite({
        envelope_version: CURRENT_ENVELOPE_VERSION,
        event_id: decision.decision_id,
        event_type: AUTHORIZATION_DECISION_EVENT_TYPE,
        event_version: 1,
        stream_id: this.#store.ledgerId,
        stream_sequence: sequence,
        occurred_at: decision.decided_at,
        recorded_at: timestamp,
        producer: { name: 'transition-authorization-gateway', version: '1' },
        authority_epoch: decision.authority_epoch,
        correlation_id: decision.correlation_id,
        causation_id: decision.causation_id,
        idempotency_key: `authorization-decision:${decision.request_id}`,
        payload: decision,
      }, registry);
      const hashInput: Omit<AuthorizationAuditFrame, 'record_hash'> = {
        frame_version: AUDIT_FRAME_VERSION,
        ledger_id: this.#store.ledgerId,
        sequence,
        prev_record_hash: verified.head.recordHash,
        canonical_event_hash: event.canonicalDigest,
        decision_digest: decision.decision_digest,
        canonical_event_bytes: Buffer.from(event.canonicalBytes).toString('base64'),
      };
      const frame: AuthorizationAuditFrame = Object.freeze({
        ...hashInput,
        record_hash: sha256Bytes(canonicalBytes(hashInput)),
      });
      this.#store.commitFrameUnlocked(sequence, canonicalBytes(frame));
      return Object.freeze({
        auditLedgerId: this.#store.ledgerId,
        sequence,
        recordHash: frame.record_hash,
        canonicalEventHash: frame.canonical_event_hash,
      });
    });
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. GATEWAY
// ───────────────────────────────────────────────────────────────────

/** Default-deny boundary between validated envelope bytes and domain append. */
export class TransitionAuthorizationGateway {
  readonly #options: Required<Pick<
    AuthorizationGatewayOptions,
    'decisionFreshnessMs' | 'evaluatorTimeoutMs' | 'now'
  >> & AuthorizationGatewayOptions;
  readonly #ledger: AuthorizationLedgerView;
  readonly #policies: TransitionPolicyRegistry;
  readonly #audit: DecisionAuditLog;

  public constructor(
    options: AuthorizationGatewayOptions,
    ledger: AuthorizationLedgerView,
    policies: TransitionPolicyRegistry,
  ) {
    this.#options = Object.freeze({
      ...options,
      decisionFreshnessMs: options.decisionFreshnessMs ?? DEFAULT_DECISION_FRESHNESS_MS,
      evaluatorTimeoutMs: options.evaluatorTimeoutMs ?? DEFAULT_EVALUATOR_TIMEOUT_MS,
      now: options.now ?? (() => new Date()),
    });
    this.#ledger = ledger;
    this.#policies = policies;
    this.#audit = new DecisionAuditLog(
      options.rootDirectory,
      options.auditLedgerId ?? DEFAULT_AUDIT_LEDGER_ID,
      this.#options.now,
    );
  }

  /** Evaluate, normalize, and durably record exactly one allow or deny decision. */
  public async authorize(input: unknown): Promise<GatewayAuthorizationResult> {
    const prepared = await this.#prepareContext(input);
    let prior: VerifiedAuthorizationAudit;
    try {
      prior = await this.#audit.read();
    } catch {
      return Object.freeze({
        verdict: AuthorizationVerdicts.DENY,
        reasonCode: AuthorizationReasonCodes.AUDIT_STORAGE_FAILURE,
        decision: null,
        auditReceipt: null,
      });
    }
    const existing = prior.entries.find(
      (entry) => entry.decision.request_id === prepared.requestId,
    );
    if (existing?.decision.request_digest === prepared.requestDigest) {
      return this.#resultFromExisting(existing);
    }

    let outcome: DecisionOutcome;
    if (existing) {
      outcome = {
        verdict: AuthorizationVerdicts.DENY,
        reasonCode: AuthorizationReasonCodes.IDEMPOTENCY_CONFLICT,
        matchedRuleIds: [],
      };
    } else {
      outcome = await this.#evaluate(prepared);
    }
    const decision = this.#buildDecision(prepared, outcome);
    try {
      const auditReceipt = await this.#audit.append(decision);
      if (decision.decision === AuthorizationVerdicts.DENY) {
        return Object.freeze({
          verdict: AuthorizationVerdicts.DENY,
          reasonCode: decision.reason_code,
          decision,
          auditReceipt,
        });
      }
      const proof: GatewayAllowProof = Object.freeze({
        proofVersion: PROOF_VERSION,
        decision,
        auditReceipt,
      });
      return Object.freeze({ verdict: AuthorizationVerdicts.ALLOW, decision, proof });
    } catch {
      return Object.freeze({
        verdict: AuthorizationVerdicts.DENY,
        reasonCode: AuthorizationReasonCodes.AUDIT_STORAGE_FAILURE,
        decision: null,
        auditReceipt: null,
      });
    }
  }

  async #prepareContext(input: unknown): Promise<DecisionContext> {
    if (!isTransitionRequest(input)) {
      const evaluationInput = invalidEvaluationInput();
      const requestId = `invalid-request-${randomUUID()}`;
      return Object.freeze({
        request: null,
        evaluationInput,
        requestId,
        requestDigest: requestDigest(
          requestId,
          this.#ledger.ledgerId,
          this.#ledger.registryDigest,
          evaluationInput,
          'unknown',
          1,
          PLACEHOLDER_DIGEST,
        ),
        policyId: 'unknown',
        policyVersion: 1,
        policyDigest: PLACEHOLDER_DIGEST,
        evaluatorVersion: 'unknown',
        authority: Object.freeze({ state: 'legacy_authoritative', epoch: 1 }),
        authorityAvailable: false,
      });
    }

    let authority: AuthoritySnapshot;
    let authorityAvailable = true;
    try {
      authority = await this.#options.authorityProvider(input.mode);
    } catch {
      authority = Object.freeze({ state: 'legacy_authoritative', epoch: 1 });
      authorityAvailable = false;
    }
    const evaluationInput = requestEvaluationInput(input, authority);
    let evaluatorVersion = 'unknown';
    try {
      evaluatorVersion = this.#policies.resolve(
        input.policy.policyId,
        input.policy.policyVersion,
      ).evaluatorVersion;
    } catch {
      // Unknown policy identity is recorded as a denial below.
    }
    return Object.freeze({
      request: input,
      evaluationInput,
      requestId: input.requestId,
      requestDigest: requestDigest(
        input.requestId,
        this.#ledger.ledgerId,
        this.#ledger.registryDigest,
        evaluationInput,
        input.policy.policyId,
        input.policy.policyVersion,
        input.policy.policyDigest,
      ),
      policyId: input.policy.policyId,
      policyVersion: input.policy.policyVersion,
      policyDigest: input.policy.policyDigest,
      evaluatorVersion,
      authority,
      authorityAvailable,
    });
  }

  async #evaluate(context: DecisionContext): Promise<DecisionOutcome> {
    const request = context.request;
    if (!request) {
      return { verdict: 'deny', reasonCode: AuthorizationReasonCodes.INVALID_INPUT, matchedRuleIds: [] };
    }
    if (!context.authorityAvailable) {
      return { verdict: 'deny', reasonCode: AuthorizationReasonCodes.GATEWAY_FAILURE, matchedRuleIds: [] };
    }
    if (request.event.identity.eventType === AUTHORIZATION_DECISION_EVENT_TYPE) {
      return {
        verdict: 'deny',
        reasonCode: AuthorizationReasonCodes.AUDIT_EVENT_RECURSION,
        matchedRuleIds: [],
      };
    }
    if (request.event.registryDigest !== this.#ledger.registryDigest) {
      return {
        verdict: 'deny',
        reasonCode: AuthorizationReasonCodes.UNSUPPORTED_EVENT,
        matchedRuleIds: [],
      };
    }
    let currentHead: LedgerHead;
    try {
      currentHead = await this.#ledger.getVerifiedHead();
    } catch {
      return {
        verdict: 'deny',
        reasonCode: AuthorizationReasonCodes.GATEWAY_FAILURE,
        matchedRuleIds: [],
      };
    }
    if (
      request.priorHead.ledgerId !== this.#ledger.ledgerId
      || request.priorHead.sequence !== currentHead.sequence
      || request.priorHead.recordHash !== currentHead.recordHash
    ) {
      return { verdict: 'deny', reasonCode: AuthorizationReasonCodes.STALE_HEAD, matchedRuleIds: [] };
    }
    if (
      request.authorityEpoch !== context.authority.epoch
      || request.event.identity.authorityEpoch !== context.authority.epoch
    ) {
      return {
        verdict: 'deny',
        reasonCode: AuthorizationReasonCodes.STALE_AUTHORITY_EPOCH,
        matchedRuleIds: [],
      };
    }

    let policy;
    try {
      policy = this.#policies.resolve(context.policyId, context.policyVersion);
    } catch {
      return { verdict: 'deny', reasonCode: AuthorizationReasonCodes.UNKNOWN_POLICY, matchedRuleIds: [] };
    }
    if (policy.digest !== context.policyDigest) {
      return { verdict: 'deny', reasonCode: AuthorizationReasonCodes.UNKNOWN_POLICY, matchedRuleIds: [] };
    }
    try {
      const result = await withTimeout(
        Promise.resolve(policy.evaluate(context.evaluationInput)),
        this.#options.evaluatorTimeoutMs,
      );
      return normalizePolicyResult(result, new Set(policy.ruleIds));
    } catch (error: unknown) {
      return {
        verdict: 'deny',
        reasonCode: error instanceof Error && error.message === 'POLICY_EVALUATION_TIMEOUT'
          ? AuthorizationReasonCodes.EVALUATOR_TIMEOUT
          : AuthorizationReasonCodes.EVALUATOR_EXCEPTION,
        matchedRuleIds: [],
      };
    }
  }

  #buildDecision(context: DecisionContext, outcome: DecisionOutcome): AuthorizationDecisionRecord {
    const decidedAt = this.#options.now();
    const expiresAt = new Date(decidedAt.getTime() + this.#options.decisionFreshnessMs);
    const input = context.evaluationInput;
    const hashInput: Omit<AuthorizationDecisionRecord, 'decision_digest'> = {
      decision_id: `decision-${randomUUID()}`,
      request_id: context.requestId,
      decision: outcome.verdict,
      reason_code: outcome.reasonCode,
      mode: input.mode,
      domain_ledger_id: this.#ledger.ledgerId,
      stream_id: input.streamId,
      prior_head_sequence: input.priorHeadSequence,
      prior_head_hash: input.priorHeadHash,
      prior_state_version: input.priorStateVersion,
      prior_state_fingerprint: input.priorStateFingerprint,
      requested_event_id: input.requestedEventId,
      requested_event_type: input.requestedEventType,
      requested_event_version: input.requestedEventVersion,
      requested_event_digest: input.requestedEventDigest,
      event_registry_digest: this.#ledger.registryDigest,
      actor_id: input.actorId,
      capability_id: input.capabilityId,
      authority_state: input.authorityState,
      authority_epoch: input.authorityEpoch,
      policy_id: context.policyId,
      policy_version: context.policyVersion,
      policy_digest: context.policyDigest,
      evaluator_version: context.evaluatorVersion,
      matched_rule_ids: [...outcome.matchedRuleIds],
      request_digest: context.requestDigest,
      evidence_digest: input.evidenceDigest,
      correlation_id: input.correlationId,
      causation_id: input.causationId,
      idempotency_key_digest: input.idempotencyKeyDigest,
      decided_at: decidedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    };
    const decision = {
      ...hashInput,
      decision_digest: sha256Bytes(canonicalBytes(hashInput)),
    } as AuthorizationDecisionRecord;
    return Object.freeze(decision);
  }

  #resultFromExisting(entry: AuthorizationAuditEntry): GatewayAuthorizationResult {
    if (entry.decision.decision === AuthorizationVerdicts.DENY) {
      return Object.freeze({
        verdict: AuthorizationVerdicts.DENY,
        reasonCode: entry.decision.reason_code,
        decision: entry.decision,
        auditReceipt: entry.receipt,
      });
    }
    return Object.freeze({
      verdict: AuthorizationVerdicts.ALLOW,
      decision: entry.decision,
      proof: Object.freeze({
        proofVersion: PROOF_VERSION,
        decision: entry.decision,
        auditReceipt: entry.receipt,
      }),
    });
  }
}

/** Recompute the immutable digest used by proof and replay verification. */
export function authorizationDecisionDigest(decision: AuthorizationDecisionRecord): string {
  return calculateDecisionDigest(decision);
}
