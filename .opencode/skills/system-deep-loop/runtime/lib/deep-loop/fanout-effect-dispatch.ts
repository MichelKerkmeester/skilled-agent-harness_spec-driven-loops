// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Executor Effect Dispatch
// ───────────────────────────────────────────────────────────────────
//
// Routes the live fan-out executor spawn through the shipped effect
// recovery gateway so a fail-closed intent is durably recorded before the
// subprocess runs and a confirmation is recorded after it returns. The
// effect ledger this writes is the one the enablement step reads, keyed by
// the canonical mode name (deep-research / deep-review), not the raw
// loopType.

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  appendAuthorizedThroughFence,
} from '../locks-and-fencing/index.js';
import {
  createEvidenceControlEventRegistry,
  createSubprocessEffectAdapter,
  EffectRecoveryGateway,
} from '../receipts-and-effect-recovery/index.js';
import { resolveAuthorityRoot } from '../authority-root/index.js';
import { AuthorityRegistry } from '../per-mode-authority-flip/index.js';

import type {
  AuthoritySnapshot,
  DurableAppendReceipt,
  GatewayAuthorizationResult,
  LedgerRecordFrame,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  TransitionAuthorizationRequest,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type {
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  EffectAdapter,
  EffectExecutionInput,
  EffectObservation,
  EffectReconciliationObservation,
} from '../receipts-and-effect-recovery/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export type CanonicalFanoutMode = 'deep-research' | 'deep-review';

/** Shape returned by the lineage subprocess runner, preserved verbatim for the caller. */
export interface ExecutorSpawnResult {
  readonly status: number | null;
  readonly signal: string | null;
  readonly stdout: string;
  readonly error?: Error;
}

/**
 * Dispatch options forwarded unchanged to the subprocess runner. Typed
 * loosely because the runner owns the live callback shape (liveness,
 * abort, streaming); this module never inspects them, it only passes them
 * through so liveness tracking stays intact.
 */
export interface ExecutorDispatchOptions {
  readonly cwd: string;
  readonly timeoutMs: number;
  readonly env?: NodeJS.ProcessEnv;
  readonly maxBuffer?: number;
  readonly abortSignal?: AbortSignal;
  readonly input?: string;
  readonly onOutput?: () => void;
  readonly onSpawn?: (info: { pid: number }) => void;
  readonly onExit?: (info: { pid: number; status: number | null; signal: string | null; exitedAtMs: number }) => void;
  [key: string]: unknown;
}

/** The subprocess runner seam, supplied by the launcher (runLineageProcess). */
export type ExecutorDispatch = (
  command: string,
  cmdArgs: readonly string[],
  dispatchOpts: ExecutorDispatchOptions,
) => Promise<ExecutorSpawnResult>;

export interface DispatchExecutorEffectOptions {
  /** Per-lineage run directory; the effect ledger is created below it. */
  readonly lineageDir: string;
  /** Canonical mode name; becomes the effect ledger id suffix. */
  readonly canonicalMode: CanonicalFanoutMode;
  /** Unique per lineage+run; recorded as the effect run id. */
  readonly sessionId: string;
  readonly lineageLabel: string;
  readonly attempt: number;
  readonly command: string;
  readonly cmdArgs: readonly string[];
  /** Forwarded verbatim to dispatch so liveness/abort callbacks stay live. */
  readonly dispatchOpts: ExecutorDispatchOptions;
  /** The launcher's subprocess runner (runLineageProcess). */
  readonly dispatch: ExecutorDispatch;
  /** Override the authority source for hermetic tests. */
  readonly authorityProvider?: (mode: string) => AuthoritySnapshot | Promise<AuthoritySnapshot>;
  /**
   * Test seam: replace the internally-built authorized writer to prove
   * fail-closed behavior when the durable intent append throws. Production
   * leaves this unset so the real authorized append path is exercised.
   */
  readonly writer?: EffectGatewayWriter;
  readonly now?: () => Date;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const EFFECT_POLICY_ID = 'fanout-effect-transition-policy';
const EFFECT_POLICY_VERSION = 1;
const EFFECT_POLICY_RULE = 'fanout-effect-writer-only';
const EFFECT_CAPABILITY = 'fanout-effect-write';
const EFFECT_ACTOR = 'fanout-effect-writer';
const ADAPTER_ID = 'fanout-executor-subprocess';
const ADAPTER_VERSION = '1';
const PRODUCER = Object.freeze({ name: 'fanout-effect-dispatch', version: '1' });

// Authority states under which a fan-out executor may durably record its
// effect. These are the runtime write states: a mode that is mid-cutover,
// newly authoritative (reversible or final), rolled back, or still on the
// legacy writer all remain legitimate dispatch targets.
const ALLOWED_AUTHORITY_STATES = new Set<AuthoritySnapshot['state']>([
  'cutover_ready',
  'new_authoritative_reversible',
  'new_authoritative_final',
  'rollback_pending',
  'legacy_authoritative',
]);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function receiptFromFrame(frame: LedgerRecordFrame): DurableAppendReceipt {
  return Object.freeze({
    ...frame.receipt,
    canonicalEventHash: frame.canonical_event_hash,
    recordHash: frame.record_hash,
    authorizationRef: frame.authorization_ref,
  });
}

function pinRequestIdentity(context: Readonly<{ evaluationInput: PolicyEvaluationInput }>): {
  actorId: string;
  capabilityId: string;
  evidenceDigest: string;
} {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function evaluateEffectPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  const allowed = input.capabilityId === EFFECT_CAPABILITY
    && ALLOWED_AUTHORITY_STATES.has(input.authorityState);
  return allowed
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: [EFFECT_POLICY_RULE] }
    : { verdict: 'deny', reasonCode: 'policy_denied', matchedRuleIds: [EFFECT_POLICY_RULE] };
}

/**
 * Build the canonical, ledger-safe dispatch request. It carries only the
 * durable, secret-free facts that identify the dispatch; the live env and
 * liveness callbacks travel through the dispatch closure instead, so no
 * credential or function ever reaches the durable intent.
 */
function canonicalDispatchInput(
  command: string,
  cmdArgs: readonly string[],
  dispatchOpts: ExecutorDispatchOptions,
): JsonObject {
  return Object.freeze({
    command,
    cmd_args: [...cmdArgs],
    cwd: dispatchOpts.cwd,
    timeout_ms: dispatchOpts.timeoutMs,
  });
}

function dispatchObservation(
  canonicalInput: JsonObject,
  result: ExecutorSpawnResult,
  observedAt: string,
): EffectObservation {
  const postconditionDigest = sha256Bytes(canonicalBytes(canonicalInput));
  const outputDigest = sha256Bytes(Buffer.from(result.stdout ?? '', 'utf8'));
  return Object.freeze({
    // Bind the idempotency-stable postcondition to the actual captured
    // output so the confirmation is tied to what the subprocess produced.
    external_receipt_digest: sha256Bytes(canonicalBytes({
      postcondition: postconditionDigest,
      output: outputDigest,
    })),
    postcondition_digest: postconditionDigest,
    output_digest: outputDigest,
    observed_at: observedAt,
    safe_result_metadata: Object.freeze({
      status: result.status,
      signal: result.signal,
      stdout_bytes: Buffer.byteLength(result.stdout ?? '', 'utf8'),
    }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. AUTHORIZED WRITER
// ───────────────────────────────────────────────────────────────────
//
// Mirrors the rollback-drill effect writer: each append authorizes through
// the transition gateway and commits through a one-shot fence. A one-shot
// fence per append (rather than a long-lived lease) is required because the
// dispatch can run for hours; the intent append and the confirmation append
// must each take their own short-lived lease rather than sharing one that
// would expire mid-dispatch.

export interface EffectGatewayWriter {
  append(event: EventWritePreflight): Promise<{
    status: 'appended' | 'idempotent';
    receipt: DurableAppendReceipt;
    verified: VerifiedLedgerEvent;
  }>;
  findEvent(eventId: string): Promise<VerifiedLedgerEvent | null>;
  readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]>;
}

function createEffectGatewayWriter(
  ledger: AppendOnlyLedger,
  authGateway: TransitionAuthorizationGateway,
  policies: TransitionPolicyRegistry,
  authorityProvider: (mode: string) => AuthoritySnapshot | Promise<AuthoritySnapshot>,
  canonicalMode: CanonicalFanoutMode,
): EffectGatewayWriter {
  async function authorize(
    event: EventWritePreflight,
    authority: AuthoritySnapshot,
  ): Promise<GatewayAuthorizationResult> {
    const policy = policies.resolve(EFFECT_POLICY_ID, EFFECT_POLICY_VERSION);
    const priorHead = await ledger.getVerifiedHead();
    const request: TransitionAuthorizationRequest = {
      requestId: `${event.identity.eventId}-request`,
      mode: canonicalMode,
      event,
      priorHead,
      priorStateVersion: `${canonicalMode}-effect@1`,
      priorStateFingerprint: sha256Bytes(canonicalBytes({
        state: authority.state,
        epoch: authority.epoch,
      })),
      actorId: EFFECT_ACTOR,
      capabilityId: EFFECT_CAPABILITY,
      authorityEpoch: authority.epoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: event.canonicalDigest,
    };
    return authGateway.authorize(request);
  }

  return {
    async append(event) {
      const existing = (await ledger.readVerifiedEvents()).find((entry) =>
        entry.event.effective.envelope.event_id === event.identity.eventId);
      if (existing) {
        if (existing.event.stored.digest !== event.canonicalDigest) {
          throw new Error(
            `Effect event identity is already bound to different canonical bytes: ${event.identity.eventId}`,
          );
        }
        return Object.freeze({
          status: 'idempotent',
          receipt: receiptFromFrame(existing.frame),
          verified: existing,
        });
      }
      const authority = await authorityProvider(canonicalMode);
      const authorization = await authorize(event, authority);
      if (authorization.verdict !== 'allow') {
        throw new Error(
          `Effect evidence append was denied by the transition gateway: ${authorization.reasonCode}`,
        );
      }
      const receipt = await appendAuthorizedThroughFence(ledger, event, authorization.proof!);
      const verified = (await ledger.readVerifiedEvents()).find((entry) =>
        entry.event.effective.envelope.event_id === event.identity.eventId);
      if (!verified) {
        throw new Error('Effect evidence was not durably readable after append');
      }
      return Object.freeze({ status: 'appended', receipt, verified });
    },
    async findEvent(eventId) {
      const events = await ledger.readVerifiedEvents();
      return events.find((entry) =>
        entry.event.effective.envelope.event_id === eventId) ?? null;
    },
    readVerifiedEvents() {
      return ledger.readVerifiedEvents();
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. PUBLIC ENTRY POINT
// ───────────────────────────────────────────────────────────────────

function defaultAuthorityProvider(canonicalMode: CanonicalFanoutMode): (mode: string) => AuthoritySnapshot {
  const root = resolveAuthorityRoot();
  const registry = new AuthorityRegistry(root);
  return () => {
    const record = registry.read(canonicalMode);
    return Object.freeze({ state: record.state, epoch: record.epoch });
  };
}

/**
 * Dispatch the executor subprocess through the effect recovery gateway.
 *
 * Records a durable intent before the spawn and a confirmation after, into
 * `${lineageDir}/${canonicalMode}-effect-ledger`. If the intent cannot be
 * durably recorded the spawn never runs and a failure result is returned
 * (fail-closed). Returns the same result shape the direct subprocess runner
 * returns, so the launcher's salvage, containment, and logging downstream
 * are unchanged.
 */
export async function dispatchExecutorEffect(
  options: DispatchExecutorEffectOptions,
): Promise<ExecutorSpawnResult> {
  const {
    lineageDir,
    canonicalMode,
    sessionId,
    lineageLabel,
    attempt,
    command,
    cmdArgs,
    dispatchOpts,
    dispatch,
  } = options;
  const now = options.now ?? (() => new Date());
  const authorityProvider = options.authorityProvider ?? defaultAuthorityProvider(canonicalMode);

  const registry = createEvidenceControlEventRegistry();

  // When a test injects a writer (to make the durable append fail), skip the
  // real ledger construction so the failure is observed at the append seam
  // rather than during directory creation. Production never sets this.
  const writer: EffectGatewayWriter = options.writer ?? (() => {
    const policies = new TransitionPolicyRegistry([{
      policyId: EFFECT_POLICY_ID,
      policyVersion: EFFECT_POLICY_VERSION,
      evaluatorVersion: '1',
      ruleIds: [EFFECT_POLICY_RULE],
      evaluate: evaluateEffectPolicy,
    }]);
    const effectLedgerId = `${canonicalMode}-effect-ledger`;
    const auditLedgerId = `${canonicalMode}-audit-ledger`;
    // Each per-lineage effect ledger has exactly one owning process for its
    // run directory, so the single-writer read cache is safe here and removes
    // the lock round-trip that serialized the fan-out read path.
    const ledger = new AppendOnlyLedger({
      rootDirectory: lineageDir,
      ledgerId: effectLedgerId,
      auditLedgerId,
      authorityProvider,
      now,
      singleWriterReadCache: true,
    }, registry);
    const authGateway = new TransitionAuthorizationGateway({
      rootDirectory: lineageDir,
      auditLedgerId,
      authorityProvider,
      now,
      identityResolver: pinRequestIdentity,
    }, ledger, policies);
    return createEffectGatewayWriter(ledger, authGateway, policies, authorityProvider, canonicalMode);
  })();

  const effectGateway = new EffectRecoveryGateway({
    writer,
    registry,
    producer: PRODUCER,
    now,
    // The live dispatch path only executes; recovery is a documented
    // follow-on, so no recovery claim is accepted here.
    validateRecoveryClaim: () => false,
    maxRecoveryAttempts: 1,
    intentRaceWaitMs: 1,
    intentRacePollMs: 1,
  });

  const canonicalInput = canonicalDispatchInput(command, cmdArgs, dispatchOpts);
  const targetIdentity = `subprocess:fanout:${canonicalMode}:${lineageLabel}`;
  const authority = await authorityProvider(canonicalMode);

  // The postcondition is a digest of the durable dispatch facts, derivable
  // both before the spawn (for the intent) and after it (for the
  // confirmation), so the gateway's postcondition check binds the
  // confirmation to the same dispatch the intent committed.
  const expectedPostconditionDigest = sha256Bytes(canonicalBytes(canonicalInput));
  const replayFingerprint = sha256Bytes(canonicalBytes({
    replay_scope: canonicalMode,
    lineage_label: lineageLabel,
    attempt,
  }));

  const executionInput: EffectExecutionInput<JsonObject> = {
    runId: sessionId,
    logicalEffectId: `fanout-dispatch:${lineageLabel}:attempt-${attempt}`,
    operation: 'dispatch-executor',
    targetIdentity,
    request: canonicalInput,
    canonicalInput: canonicalInput as unknown as JsonValue,
    safeMetadata: Object.freeze({
      canonical_mode: canonicalMode,
      lineage_label: lineageLabel,
      attempt,
    }),
    secretReferences: [],
    recoveryPolicy: 'reconcile-before-replay',
    expectedPostconditionDigest,
    replayFingerprint,
    requestedAt: now().toISOString(),
    authorityEpoch: authority.epoch,
    correlationId: sessionId,
    causationId: null,
  };

  // The spawn result is captured by the adapter closure; the gateway's own
  // return value carries the intent/confirmation, not the subprocess result.
  let spawnResult: ExecutorSpawnResult | null = null;
  const captureAndObserve = async (): Promise<EffectObservation> => {
    spawnResult = await dispatch(command, cmdArgs, dispatchOpts);
    return dispatchObservation(canonicalInput, spawnResult, now().toISOString());
  };

  const adapter: EffectAdapter<JsonObject> = createSubprocessEffectAdapter<JsonObject>({
    adapterId: ADAPTER_ID,
    adapterVersion: ADAPTER_VERSION,
    hasDurableOutcomeQuery: true,
    async dispatch(): Promise<EffectObservation> {
      return captureAndObserve();
    },
    async queryOutcome(): Promise<EffectReconciliationObservation> {
      // For the live dispatch the spawn and the confirmation query run in the
      // same process with no crash between, so the captured result is the
      // conclusive external outcome. A null result means the spawn never
      // ran, which the gateway treats as not-applied.
      if (!spawnResult) {
        return Object.freeze({
          verdict: 'not_applied',
          reason_code: 'dispatch_not_observed',
          evidence_digest: sha256Bytes(canonicalBytes({ observed: false })),
          observed_at: now().toISOString(),
          observation: null,
        });
      }
      const observation = dispatchObservation(canonicalInput, spawnResult, now().toISOString());
      return Object.freeze({
        verdict: 'applied',
        reason_code: 'dispatch_completed',
        evidence_digest: observation.external_receipt_digest,
        observed_at: observation.observed_at,
        observation,
      });
    },
  });

  try {
    await effectGateway.execute(executionInput, adapter);
  } catch (error) {
    // Fail-closed: if the durable intent could not be recorded, the spawn
    // never ran. Surface a failure result so the launcher settles this
    // lineage as rejected. If the spawn did run, a post-spawn failure
    // (e.g. confirmation append) must propagate, not be masked.
    if (spawnResult === null) {
      return Object.freeze({
        status: null,
        signal: null,
        stdout: '',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
    throw error;
  }

  if (!spawnResult) {
    return Object.freeze({
      status: null,
      signal: null,
      stdout: '',
      error: new Error('effect gateway returned without dispatching the executor'),
    });
  }
  return spawnResult;
}
