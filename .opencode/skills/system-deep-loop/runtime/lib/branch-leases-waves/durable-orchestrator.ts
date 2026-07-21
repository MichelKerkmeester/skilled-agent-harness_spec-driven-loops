// ───────────────────────────────────────────────────────────────────
// MODULE: Durable Branch Orchestrator
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

import {
  AppendOnlyLedger,
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../locks-and-fencing/index.js';
import {
  BranchOrchestrationError,
  BranchOrchestrationErrorCodes,
} from './errors.js';
import {
  BRANCH_ORCHESTRATION_EVENT_TYPE,
  BRANCH_ORCHESTRATION_EVENT_VERSION,
  branchRecordDigest,
  createBranchOrchestrationEventRegistry,
} from './event-contract.js';
import {
  buildLedgerResumeState,
  foldBranchOrchestrationLedger,
  isProjectedBranchSatisfied,
  previewBranchOrchestrationRecord,
} from './ledger-fold.js';
import {
  compileBranchRun,
  validateLogicalBranchId,
} from './logical-branch-registry.js';
import {
  BranchMutationKinds,
  BranchRecordTypes,
} from './types.js';

import type {
  GatewayAllowProof,
  LedgerHead,
  PolicyEvaluationInput,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  CanonicalProtectedResource,
  FencedLease,
} from '../locks-and-fencing/index.js';
import type {
  AcquireBranchLeaseInput,
  BranchLeaseGrant,
  BranchManifestEntry,
  BranchMutatedBody,
  BranchMutationKind,
  BranchOrchestrationProjection,
  BranchOrchestrationRecord,
  BranchRegisteredBody,
  CommitBranchMutationInput,
  CompileBranchRunOptions,
  CompiledBranchRun,
  DurableBranchOrchestratorOptions,
  DurablePoolWorkerContext,
  ImmutableWave,
  LedgerResumeState,
  LeaseAcquiredBody,
  LeaseBody,
  LeaseRejectedBody,
  PoolRunResult,
  PoolWorkerContext,
  ResumeReconstructedBody,
  RunAuthorizedWaveOptions,
  WaveAdmittedBody,
  WaveClosedBody,
  WavePlannedBody,
  WavePolicy,
} from './types.js';
import type { BranchOrchestrationFold } from './ledger-fold.js';

// ───────────────────────────────────────────────────────────────────
// 1. POOL AND POLICY BOUNDARY
// ───────────────────────────────────────────────────────────────────

interface FailureClassification {
  readonly failure_class: string;
  readonly retry_verdict: string;
  readonly retryable: boolean;
}

interface PoolModule {
  readonly runCappedPool: (
    options: Readonly<Record<string, unknown>>,
  ) => Promise<PoolRunResult>;
  readonly classifyLineageFailure: (error: unknown) => FailureClassification;
}

interface WrappedPoolItem<TItem> {
  readonly label: string;
  readonly logicalBranchId: string;
  readonly poolItem: TItem;
}

const require = createRequire(import.meta.url);
const poolModule = require('../../scripts/fanout-pool.cjs') as PoolModule;

const ORCHESTRATION_POLICY_ID = 'branch-orchestration-dark-write';
const ORCHESTRATION_POLICY_VERSION = 1;
const ORCHESTRATION_RULE_ID = 'allow-registered-dark-orchestration-event';
const DEFAULT_AUTHORITY_EPOCH = 1;
const LEDGER_LEASE_TTL_MS = 30_000;
const LEDGER_LEASE_TIMEOUT_MS = 5_000;

function evaluateOrchestrationPolicy(
  input: Readonly<PolicyEvaluationInput>,
): Readonly<{
  verdict: 'allow' | 'deny';
  reasonCode: typeof AuthorizationReasonCodes[keyof typeof AuthorizationReasonCodes];
  matchedRuleIds: readonly string[];
}> {
  if (input.requestedEventType !== BRANCH_ORCHESTRATION_EVENT_TYPE) {
    return {
      verdict: AuthorizationVerdicts.DENY,
      reasonCode: AuthorizationReasonCodes.UNSUPPORTED_EVENT,
      matchedRuleIds: [],
    };
  }
  return {
    verdict: AuthorizationVerdicts.ALLOW,
    reasonCode: AuthorizationReasonCodes.ALLOWED,
    matchedRuleIds: [ORCHESTRATION_RULE_ID],
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function mutationDigest(mutationKind: BranchMutationKind, data: JsonObject): string {
  return sha256Bytes(canonicalBytes({ mutationKind, data }));
}

function jsonValueDigest(value: unknown): string {
  try {
    return sha256Bytes(canonicalBytes(value));
  } catch (error: unknown) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.INVALID_MUTATION,
      'mutation',
      'Durable result acceptance requires a canonical JSON value',
      { cause: errorCode(error) },
    );
  }
}

function errorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) return String(error.code);
  return error instanceof Error ? error.name : 'UNEXPECTED_FAILURE';
}

function ensureRunId(value: unknown): string {
  if (
    typeof value !== 'string'
    || value !== value.trim()
    || !/^[A-Za-z0-9][A-Za-z0-9._:@-]{0,255}$/u.test(value)
  ) {
    throw new BranchOrchestrationError(
      BranchOrchestrationErrorCodes.RUN_ID_CONFLICT,
      'identity',
      'Run identity must use the canonical opaque-identity grammar',
      { runId: value },
    );
  }
  return value;
}

function leaseBody(grant: BranchLeaseGrant): LeaseBody {
  return {
    logical_branch_id: grant.lease.resource.components.lineageId,
    wave_id: grant.waveId,
    lease_id: grant.lease.leaseId,
    owner_id: grant.lease.ownerId,
    attempt_id: grant.attemptId,
    fence_token: grant.lease.fenceToken,
    acquired_at: grant.lease.acquiredAt,
    renewed_at: grant.lease.renewedAt,
    expires_at: grant.lease.expiresAt,
  };
}

function sortLeases(leases: readonly FencedLease[]): readonly FencedLease[] {
  return [...leases].sort((left, right) =>
    left.resource.orderKey.localeCompare(right.resource.orderKey));
}

/** Resolve every valid branch identity through one canonical protected-resource registry. */
export function canonicalBranchLeaseResource(
  packetId: string,
  runId: string,
  logicalBranchId: string,
): CanonicalProtectedResource {
  return canonicalizeProtectedResource({
    kind: ProtectedResourceKinds.LINEAGE_STATE,
    components: {
      packetId,
      runId: ensureRunId(runId),
      lineageId: validateLogicalBranchId(logicalBranchId),
    },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. ORCHESTRATOR
// ───────────────────────────────────────────────────────────────────

/** Add durable admission and fenced ownership around the shipped capped pool. */
export class DurableBranchOrchestrator {
  readonly #options: Required<Pick<
  DurableBranchOrchestratorOptions,
  'authorityEpoch' | 'now'
  >> & DurableBranchOrchestratorOptions;
  readonly #registry: EventTypeRegistry;
  readonly #policies: TransitionPolicyRegistry;
  readonly #ledger: AppendOnlyLedger;
  readonly #gateway: TransitionAuthorizationGateway;
  readonly #coordinator: FencedLeaseCoordinator;
  readonly #ledgerResource: CanonicalProtectedResource;
  readonly #compiledRuns = new Map<string, CompiledBranchRun<unknown>>();

  public constructor(options: DurableBranchOrchestratorOptions) {
    this.#options = Object.freeze({
      ...options,
      authorityEpoch: options.authorityEpoch ?? DEFAULT_AUTHORITY_EPOCH,
      now: options.now ?? (() => new Date()),
    });
    ensureRunId(options.ledgerId);
    ensureRunId(options.packetId);
    this.#registry = createBranchOrchestrationEventRegistry();
    this.#policies = new TransitionPolicyRegistry([{
      policyId: ORCHESTRATION_POLICY_ID,
      policyVersion: ORCHESTRATION_POLICY_VERSION,
      evaluatorVersion: 'branch-orchestration-policy-v1',
      ruleIds: [ORCHESTRATION_RULE_ID],
      evaluate: evaluateOrchestrationPolicy,
    }]);
    const authorityProvider = () => Object.freeze({
      state: 'legacy_authoritative' as const,
      epoch: this.#options.authorityEpoch,
    });
    const auditLedgerId = `${options.ledgerId}-authorization`;
    this.#ledger = new AppendOnlyLedger({
      rootDirectory: options.rootDirectory,
      ledgerId: options.ledgerId,
      auditLedgerId,
      authorityProvider,
      now: this.#options.now,
    }, this.#registry);
    this.#gateway = new TransitionAuthorizationGateway({
      rootDirectory: options.rootDirectory,
      auditLedgerId,
      authorityProvider,
      now: this.#options.now,
    }, this.#ledger, this.#policies);
    this.#coordinator = new FencedLeaseCoordinator({
      rootDirectory: options.rootDirectory,
      now: this.#options.now,
    });
    this.#ledgerResource = canonicalizeProtectedResource({
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: options.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    });
  }

  /** Verify and fold every ledger frame without consulting worker directories or PIDs. */
  public async replay(): Promise<BranchOrchestrationFold> {
    const [events, head] = await Promise.all([
      this.#ledger.readVerifiedEvents(),
      this.#ledger.getVerifiedHead(),
    ]);
    return foldBranchOrchestrationLedger(events, head);
  }

  /** Register an entire manifest and immutable plan before any branch can dispatch. */
  public async initializeRun<TItem>(
    runIdInput: string,
    entries: readonly BranchManifestEntry<TItem>[],
    wavePolicy: WavePolicy,
    compileOptions: CompileBranchRunOptions = {},
  ): Promise<CompiledBranchRun<TItem>> {
    const runId = ensureRunId(runIdInput);
    const compiled = compileBranchRun(entries, wavePolicy, compileOptions);
    let fold = await this.replay();
    this.#assertCompatibleRun(fold.state, runId, compiled);

    for (const branch of compiled.branches) {
      const existing = fold.state.branches[branch.logicalBranchId];
      if (existing) {
        if (existing.registration.registration_key !== branch.registrationKey) {
          throw new BranchOrchestrationError(
            BranchOrchestrationErrorCodes.BRANCH_REGISTRATION_CONFLICT,
            'manifest',
            'Existing branch registration differs from the normalized manifest',
            { logicalBranchId: branch.logicalBranchId },
          );
        }
        continue;
      }
      const body: BranchRegisteredBody = {
        logical_branch_id: branch.logicalBranchId,
        coordinate_key: branch.coordinateKey,
        model_id: branch.coordinates.modelId,
        branch_id: branch.coordinates.branchId,
        replica_ordinal: branch.coordinates.replicaOrdinal,
        derivation_version: branch.coordinates.derivationVersion,
        manifest_fingerprint: branch.manifestFingerprint,
        invocation_fingerprint: branch.invocationFingerprint,
        registration_key: branch.registrationKey,
        wave_id: branch.waveId,
        wave_ordinal: branch.waveOrdinal,
        wave_plan_fingerprint: branch.wavePlanFingerprint,
      };
      await this.#appendRecord({
        record_type: BranchRecordTypes.BRANCH_REGISTERED,
        run_id: runId,
        transition_id: `register-${branch.logicalBranchId}`,
        body,
      });
      fold = await this.replay();
    }

    if (fold.state.wavePlan === null) {
      const body: WavePlannedBody = { plan: compiled.wavePlan };
      await this.#appendRecord({
        record_type: BranchRecordTypes.WAVE_PLANNED,
        run_id: runId,
        transition_id: `plan-${compiled.wavePlan.planFingerprint}`,
        body,
      });
      fold = await this.replay();
    }
    this.#assertCompatibleRun(fold.state, runId, compiled);
    this.#compiledRuns.set(runId, compiled as CompiledBranchRun<unknown>);
    return compiled;
  }

  /** Admit exactly the ledger-derived next wave; future ordinals fail closed. */
  public async admitWave(
    runIdInput: string,
    waveId: string,
    authorizationId: string,
  ): Promise<void> {
    const runId = ensureRunId(runIdInput);
    const fold = await this.#requireInitializedRun(runId);
    const wavePlan = fold.state.wavePlan;
    const wave = wavePlan?.waves.find((candidate) => candidate.waveId === waveId);
    if (!wavePlan || !wave) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.WAVE_STATE_CONFLICT,
        'wave',
        'Wave admission references an unknown immutable wave',
        { waveId },
      );
    }
    const body: WaveAdmittedBody = {
      wave_id: wave.waveId,
      wave_ordinal: wave.ordinal,
      plan_fingerprint: wavePlan.planFingerprint,
      authorization_id: ensureRunId(authorizationId),
    };
    await this.#appendRecord({
      record_type: BranchRecordTypes.WAVE_ADMITTED,
      run_id: runId,
      transition_id: `admit-${authorizationId}-${wave.waveId}`,
      body,
    });
  }

  /** Persist the only policy-neutral close/advance boundary accepted by later waves. */
  public async closeWave(
    runIdInput: string,
    waveId: string,
    input: Readonly<{
      authorizationId: string;
      policyId: string;
      decision: 'advance' | 'stop';
    }>,
  ): Promise<void> {
    const runId = ensureRunId(runIdInput);
    const fold = await this.#requireInitializedRun(runId);
    const wavePlan = fold.state.wavePlan;
    const wave = wavePlan?.waves.find((candidate) => candidate.waveId === waveId);
    if (!wavePlan || !wave) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.WAVE_STATE_CONFLICT,
        'wave',
        'Wave close references an unknown immutable wave',
        { waveId },
      );
    }
    const body: WaveClosedBody = {
      wave_id: wave.waveId,
      wave_ordinal: wave.ordinal,
      plan_fingerprint: wavePlan.planFingerprint,
      authorization_id: ensureRunId(input.authorizationId),
      policy_id: ensureRunId(input.policyId),
      decision: input.decision,
    };
    await this.#appendRecord({
      record_type: BranchRecordTypes.WAVE_CLOSED,
      run_id: runId,
      transition_id: `close-${input.authorizationId}-${wave.waveId}`,
      body,
    });
  }

  /** Claim one branch through the shared monotonic fencing coordinator. */
  public async acquireBranchLease(
    input: AcquireBranchLeaseInput,
  ): Promise<BranchLeaseGrant> {
    const runId = ensureRunId(input.runId);
    const fold = await this.#requireInitializedRun(runId);
    const logicalBranchId = validateLogicalBranchId(input.logicalBranchId);
    const branch = fold.state.branches[logicalBranchId];
    if (!branch || isProjectedBranchSatisfied(branch)) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.BRANCH_NOT_FOUND,
        'lease',
        'Only an unsatisfied registered branch can be leased',
        { logicalBranchId },
      );
    }
    const wave = fold.state.waves[branch.registration.wave_id];
    if (!wave || wave.status !== 'admitted' || fold.state.currentWaveOrdinal !== wave.wave.ordinal) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.WAVE_NOT_AUTHORIZED,
        'lease',
        'Branch does not belong to the single admitted current wave',
        { logicalBranchId },
      );
    }

    const attemptId = ensureRunId(input.attemptId);
    const lease = await this.#coordinator.acquire({
      resource: canonicalBranchLeaseResource(
        this.#options.packetId,
        runId,
        logicalBranchId,
      ),
      ownerId: ensureRunId(input.ownerId),
      correlationId: runId,
      ttlMs: input.ttlMs,
      acquireTimeoutMs: input.acquireTimeoutMs,
      restoredFenceToken: fold.state.leases[logicalBranchId]?.fenceToken,
    });
    const grant: BranchLeaseGrant = Object.freeze({
      lease,
      attemptId,
      waveId: branch.registration.wave_id,
    });
    const body: LeaseAcquiredBody = {
      ...leaseBody(grant),
      acquisition: lease.acquisition,
    };
    try {
      await this.#appendRecord({
        record_type: BranchRecordTypes.LEASE_ACQUIRED,
        run_id: runId,
        transition_id: `lease-${lease.leaseId}`,
        body,
      }, grant, 'dispatch');
      return grant;
    } catch (error: unknown) {
      try {
        await this.#coordinator.release(lease);
      } catch {
        // A failed registration cannot authorize cleanup against a successor.
      }
      throw error;
    }
  }

  /** Extend an exact accepted lease, then make the longer liveness window ledger-visible. */
  public async renewBranchLease(
    runIdInput: string,
    grant: BranchLeaseGrant,
    ttlMs: number,
  ): Promise<BranchLeaseGrant> {
    const runId = ensureRunId(runIdInput);
    const renewed = await this.#coordinator.renew(grant.lease, ttlMs);
    const nextGrant = Object.freeze({ ...grant, lease: renewed });
    await this.#appendRecord({
      record_type: BranchRecordTypes.LEASE_RENEWED,
      run_id: runId,
      transition_id: `renew-${renewed.leaseId}-${renewed.renewedAt}`,
      body: leaseBody(nextGrant),
    }, nextGrant, 'lease_renew');
    return nextGrant;
  }

  /** Record logical release before clearing the physical liveness claim. */
  public async releaseBranchLease(
    runIdInput: string,
    grant: BranchLeaseGrant,
  ): Promise<void> {
    const runId = ensureRunId(runIdInput);
    await this.#appendRecord({
      record_type: BranchRecordTypes.LEASE_RELEASED,
      run_id: runId,
      transition_id: `release-${grant.lease.leaseId}-${grant.lease.fenceToken}`,
      body: leaseBody(grant),
    }, grant, 'lease_release');
    await this.#coordinator.release(grant.lease);
  }

  /** Commit one accepted branch transition under the current branch and ledger fences. */
  public async commitBranchMutation(input: CommitBranchMutationInput): Promise<void> {
    const data = Object.freeze(JSON.parse(canonicalJson(input.data)) as JsonObject);
    const body: BranchMutatedBody = {
      logical_branch_id: input.grant.lease.resource.components.lineageId,
      wave_id: input.grant.waveId,
      lease_id: input.grant.lease.leaseId,
      owner_id: input.grant.lease.ownerId,
      attempt_id: input.grant.attemptId,
      fence_token: input.grant.lease.fenceToken,
      mutation_kind: input.mutationKind,
      mutation_digest: mutationDigest(input.mutationKind, data),
      data,
    };
    await this.#appendRecord({
      record_type: BranchRecordTypes.BRANCH_MUTATED,
      run_id: ensureRunId(input.runId),
      transition_id: ensureRunId(input.transitionId),
      body,
    }, input.grant, input.mutationKind);
  }

  /** Return the complete ledger-only reconstruction used for restart admission. */
  public async getResumeState(runIdInput: string): Promise<LedgerResumeState> {
    const runId = ensureRunId(runIdInput);
    const fold = await this.#requireInitializedRun(runId);
    return buildLedgerResumeState(fold.state, this.#options.now());
  }

  /** Persist an auditable assertion that resume used only the canonical fold. */
  public async recordResume(runIdInput: string, transitionId: string): Promise<LedgerResumeState> {
    const runId = ensureRunId(runIdInput);
    const resume = await this.getResumeState(runId);
    const body: ResumeReconstructedBody = {
      manifest_fingerprint: resume.manifestFingerprint,
      plan_fingerprint: resume.wavePlanFingerprint,
      registered_branches: resume.registeredBranchIds.length,
      satisfied_branches: resume.satisfiedBranchIds.length,
      current_wave_ordinal: resume.currentWave?.ordinal ?? null,
      next_wave_ordinal: resume.nextWave?.ordinal ?? null,
    };
    await this.#appendRecord({
      record_type: BranchRecordTypes.RESUME_RECONSTRUCTED,
      run_id: runId,
      transition_id: ensureRunId(transitionId),
      body,
    });
    return this.getResumeState(runId);
  }

  /** Feed only the current wave into the shipped pool while preserving all pool options. */
  public async runAuthorizedWave<TItem, TResult>(
    options: RunAuthorizedWaveOptions<TItem, TResult>,
  ): Promise<PoolRunResult<TResult>> {
    const runId = ensureRunId(options.runId);
    const fold = await this.#requireInitializedRun(runId);
    const compiled = this.#compiledRuns.get(runId) as CompiledBranchRun<TItem> | undefined;
    if (!compiled) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.MANIFEST_DRIFT,
        'manifest',
        'Run manifest must be re-expanded and validated before pool admission',
        { runId },
      );
    }
    const wave = this.#currentAdmittedWave(fold.state);
    const branchesById = new Map(compiled.branches.map((branch) => [branch.logicalBranchId, branch]));
    const items: WrappedPoolItem<TItem>[] = wave.memberBranchIds
      .filter((logicalBranchId) => {
        const branch = fold.state.branches[logicalBranchId];
        return branch !== undefined && !isProjectedBranchSatisfied(branch);
      })
      .map((logicalBranchId) => {
        const branch = branchesById.get(logicalBranchId);
        if (!branch) {
          throw new BranchOrchestrationError(
            BranchOrchestrationErrorCodes.MANIFEST_DRIFT,
            'manifest',
            'Validated manifest cache does not cover an admitted branch',
            { logicalBranchId },
          );
        }
        return Object.freeze({
          label: logicalBranchId,
          logicalBranchId,
          poolItem: branch.poolItem,
        });
      });

    const maxRetries = options.maxRetries ?? 0;
    const worker = async (
      wrapped: WrappedPoolItem<TItem>,
      context: PoolWorkerContext,
    ): Promise<TResult> => {
      const attemptId = `${wrapped.logicalBranchId}-attempt-${context.attempt}`;
      const workerOwnerId = ensureRunId(options.workerOwnerId);
      const grant = await this.acquireBranchLease({
        runId,
        logicalBranchId: wrapped.logicalBranchId,
        ownerId: `worker-${sha256Bytes(canonicalBytes({
          attempt: context.attempt,
          logicalBranchId: wrapped.logicalBranchId,
          workerOwnerId,
        })).slice(0, 32)}`,
        attemptId,
        ttlMs: options.leaseTtlMs,
        acquireTimeoutMs: options.leaseAcquireTimeoutMs,
      });
      let operationError: unknown;
      try {
        if (context.attempt > 1) {
          await this.commitBranchMutation({
            runId,
            transitionId: `${attemptId}-retry`,
            grant,
            mutationKind: BranchMutationKinds.RETRY,
            data: { attempt: context.attempt },
          });
        }
        await this.commitBranchMutation({
          runId,
          transitionId: `${attemptId}-dispatch`,
          grant,
          mutationKind: BranchMutationKinds.DISPATCH,
          data: { attempt: context.attempt },
        });
        await this.commitBranchMutation({
          runId,
          transitionId: `${attemptId}-running`,
          grant,
          mutationKind: BranchMutationKinds.STATUS,
          data: { status: 'running' },
        });
        const workerContext: DurablePoolWorkerContext = Object.freeze({
          ...context,
          logicalBranchId: wrapped.logicalBranchId,
          lease: grant.lease,
        });
        let result: TResult;
        try {
          result = await options.worker(wrapped.poolItem, workerContext);
        } catch (error: unknown) {
          const classification = poolModule.classifyLineageFailure(error);
          await this.commitBranchMutation({
            runId,
            transitionId: `${attemptId}-failed-status`,
            grant,
            mutationKind: BranchMutationKinds.STATUS,
            data: {
              status: 'failed',
              error_code: errorCode(error),
              failure_class: classification.failure_class,
              retry_verdict: classification.retry_verdict,
            },
          });
          if (!classification.retryable || context.attempt > maxRetries) {
            await this.commitBranchMutation({
              runId,
              transitionId: `${attemptId}-failed-terminal`,
              grant,
              mutationKind: BranchMutationKinds.TERMINAL,
              data: { outcome: 'failed' },
            });
          }
          throw error;
        }
        await this.commitBranchMutation({
          runId,
          transitionId: `${attemptId}-result`,
          grant,
          mutationKind: BranchMutationKinds.RESULT,
          data: { result_digest: jsonValueDigest(result) },
        });
        await this.commitBranchMutation({
          runId,
          transitionId: `${attemptId}-succeeded-terminal`,
          grant,
          mutationKind: BranchMutationKinds.TERMINAL,
          data: { outcome: 'succeeded' },
        });
        return result;
      } catch (error: unknown) {
        operationError = error;
        throw error;
      } finally {
        try {
          await this.releaseBranchLease(runId, grant);
        } catch (releaseError: unknown) {
          if (operationError === undefined) throw releaseError;
        }
      }
    };

    return poolModule.runCappedPool({
      items,
      concurrency: options.concurrency,
      maxRetries,
      initialRetryCounts: options.initialRetryCounts,
      lagCeilingMs: options.lagCeilingMs,
      lagCeilingAction: options.lagCeilingAction,
      postExitGraceMs: options.postExitGraceMs,
      postExitPollMs: options.postExitPollMs,
      getAttemptLiveness: options.getAttemptLiveness,
      now: options.now,
      onEvent: options.onEvent,
      worker,
    }) as Promise<PoolRunResult<TResult>>;
  }

  #assertCompatibleRun<TItem>(
    state: Readonly<BranchOrchestrationProjection>,
    runId: string,
    compiled: CompiledBranchRun<TItem>,
  ): void {
    if (state.runId !== null && state.runId !== runId) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.RUN_ID_CONFLICT,
        'manifest',
        'Ledger is already bound to another run identity',
        { actualRunId: state.runId, expectedRunId: runId },
      );
    }
    if (
      state.manifestFingerprint !== null
      && state.manifestFingerprint !== compiled.manifestFingerprint
    ) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.MANIFEST_DRIFT,
        'manifest',
        'Normalized manifest changed for an existing durable run',
      );
    }
    if (
      state.wavePlan !== null
      && state.wavePlan.planFingerprint !== compiled.wavePlan.planFingerprint
    ) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT,
        'wave',
        'Wave policy or membership changed for an existing durable run',
      );
    }
  }

  async #requireInitializedRun(runId: string): Promise<BranchOrchestrationFold> {
    const fold = await this.replay();
    if (
      fold.state.runId !== runId
      || fold.state.manifestFingerprint === null
      || fold.state.wavePlan === null
    ) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.RUN_ID_CONFLICT,
        'replay',
        'Requested run is not fully registered in the canonical ledger',
        { runId },
      );
    }
    return fold;
  }

  #currentAdmittedWave(state: Readonly<BranchOrchestrationProjection>): ImmutableWave {
    const ordinal = state.currentWaveOrdinal;
    const wave = ordinal === null
      ? null
      : state.wavePlan?.waves.find((candidate) => candidate.ordinal === ordinal) ?? null;
    if (!wave || state.waves[wave.waveId]?.status !== 'admitted') {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.WAVE_NOT_AUTHORIZED,
        'wave',
        'No single current wave has durable admission authorization',
      );
    }
    return wave;
  }

  async #authorize(
    event: EventWritePreflight,
    head: LedgerHead,
    stateFingerprint: string,
  ): Promise<GatewayAllowProof> {
    const policy = this.#policies.resolve(
      ORCHESTRATION_POLICY_ID,
      ORCHESTRATION_POLICY_VERSION,
    );
    const request: TransitionAuthorizationRequest = {
      requestId: `authorize-${event.identity.eventId}`,
      mode: 'durable-fanout-dark',
      event,
      priorHead: head,
      priorStateVersion: `branch-fold-v1-${head.sequence}`,
      priorStateFingerprint: stateFingerprint,
      actorId: 'durable-branch-orchestrator',
      capabilityId: 'additive-dark-orchestration',
      authorityEpoch: this.#options.authorityEpoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: sha256Bytes(event.canonicalBytes),
    };
    const authorization = await this.#gateway.authorize(request);
    if (authorization.verdict !== AuthorizationVerdicts.ALLOW) {
      throw new BranchOrchestrationError(
        BranchOrchestrationErrorCodes.LEDGER_HEAD_CONFLICT,
        'ledger',
        'Transition authorization denied the durable orchestration event',
        { reasonCode: authorization.reasonCode },
      );
    }
    return authorization.proof;
  }

  #prepareEvent(
    record: BranchOrchestrationRecord,
    head: LedgerHead,
    occurredAt: string,
  ): EventWritePreflight {
    const eventDigest = sha256Bytes(canonicalBytes(record));
    return prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: `branch-event-${eventDigest}`,
      event_type: BRANCH_ORCHESTRATION_EVENT_TYPE,
      event_version: BRANCH_ORCHESTRATION_EVENT_VERSION,
      stream_id: record.run_id,
      stream_sequence: head.sequence + 1,
      occurred_at: occurredAt,
      recorded_at: occurredAt,
      producer: { name: 'branch-leases-waves', version: '1' },
      authority_epoch: this.#options.authorityEpoch,
      correlation_id: record.run_id,
      causation_id: null,
      idempotency_key: `branch-transition-${record.transition_id}`,
      payload: record,
    }, this.#registry);
  }

  async #acquireLedgerLease(transitionId: string): Promise<FencedLease> {
    return this.#coordinator.acquire({
      resource: this.#ledgerResource,
      ownerId: 'durable-branch-ledger-writer',
      correlationId: transitionId,
      ttlMs: LEDGER_LEASE_TTL_MS,
      acquireTimeoutMs: LEDGER_LEASE_TIMEOUT_MS,
    });
  }

  async #appendRecord(
    record: BranchOrchestrationRecord,
    branchGrant?: BranchLeaseGrant,
    rejectedMutationKind?: BranchMutationKind | 'lease_renew' | 'lease_release',
  ): Promise<void> {
    const occurredAt = this.#options.now().toISOString();
    const ledgerLease = await this.#acquireLedgerLease(record.transition_id);
    let caught = false;
    let operationError: unknown;
    try {
      const fold = await this.replay();
      const priorTransitionDigest = fold.state.transitionDigests[record.transition_id];
      if (priorTransitionDigest === branchRecordDigest(record)) return;
      const event = this.#prepareEvent(record, fold.ledgerHead, occurredAt);
      const proof = await this.#authorize(event, fold.ledgerHead, fold.digest);
      await this.#coordinator.withFences(
        sortLeases(branchGrant ? [ledgerLease, branchGrant.lease] : [ledgerLease]),
        () => async () => {
          const currentHead = await this.#ledger.getVerifiedHead();
          if (
            currentHead.sequence !== fold.ledgerHead.sequence
            || currentHead.recordHash !== fold.ledgerHead.recordHash
          ) {
            throw new LocksAndFencingError(
              LocksAndFencingErrorCodes.HEAD_CONFLICT,
              'mutation',
              'Ledger head changed before the fenced branch mutation committed',
              {
                actualSequence: currentHead.sequence,
                expectedSequence: fold.ledgerHead.sequence,
              },
            );
          }
          previewBranchOrchestrationRecord(fold.state, record, occurredAt);
          await this.#ledger.appendAuthorized(event, proof);
        },
      );
    } catch (error: unknown) {
      caught = true;
      operationError = error;
    } finally {
      try {
        await this.#coordinator.release(ledgerLease);
      } catch {
        // Ledger mutation outcome remains authoritative; successor leases are never cleared.
      }
    }
    if (!caught) return;
    if (
      branchGrant
      && rejectedMutationKind
      && operationError instanceof LocksAndFencingError
      && (
        operationError.code === LocksAndFencingErrorCodes.STALE_FENCE
        || operationError.code === LocksAndFencingErrorCodes.LEASE_LOST
      )
    ) {
      try {
        await this.#recordLeaseRejection(
          record.run_id,
          branchGrant,
          rejectedMutationKind,
          operationError.code,
          record.transition_id,
        );
      } catch {
        // Rejection evidence is diagnostic; it cannot replace the typed fence failure.
      }
    }
    throw operationError;
  }

  async #recordLeaseRejection(
    runId: string,
    grant: BranchLeaseGrant,
    mutationKind: BranchMutationKind | 'lease_renew' | 'lease_release',
    rejectionCode: string,
    causationTransitionId: string,
  ): Promise<void> {
    const body: LeaseRejectedBody = {
      logical_branch_id: grant.lease.resource.components.lineageId,
      lease_id: grant.lease.leaseId,
      owner_id: grant.lease.ownerId,
      attempt_id: grant.attemptId,
      fence_token: grant.lease.fenceToken,
      mutation_kind: mutationKind,
      rejection_code: rejectionCode,
    };
    await this.#appendRecord({
      record_type: BranchRecordTypes.LEASE_REJECTED,
      run_id: runId,
      transition_id: `reject-${causationTransitionId}-${grant.lease.fenceToken}`,
      body,
    });
  }
}
