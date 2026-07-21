import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  prepareLineageDispatchResolvedEvent,
} from '../../lib/dispatch-receipts/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
} from '../../lib/locks-and-fencing/index.js';
import {
  AuthorizedEvidenceWriter,
  EFFECT_RECONCILED_EVENT_TYPE,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  ResultEnvelopeError,
  ResultEnvelopeErrorCodes,
  classifyLegacyFailureShadow,
  createResultEnvelopeEventRegistry,
  deriveResultEnvelopeId,
  extractLegacyShadowText,
  foldResumeProgress,
  projectLegacyAttribution,
  projectLegacySalvageShadow,
  recordLeafRecovery,
  recordLeafResult,
  recordSalvageFragment,
  reconstructLegacyRegistryShadow,
  verifyLeafCompletion,
} from '../../lib/result-envelopes/index.js';

import type {
  AuthoritySnapshot,
  LedgerFaultInjection,
  LedgerRecordFrame,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  DispatchReceiptPayload,
  VerifiedLaunchFacts,
} from '../../lib/dispatch-receipts/index.js';
import type {
  EventTypeRegistry,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type { FencedLease } from '../../lib/locks-and-fencing/index.js';
import type {
  DigestReference,
  LeafResultFacts,
  ResultEventContext,
  SalvageFragmentFacts,
} from '../../lib/result-envelopes/index.js';

const require = createRequire(import.meta.url);
const legacySalvage = require('../../scripts/fanout-salvage.cjs') as {
  extractTextFromOpencodeJson(stdout: string | null): string | null;
  runSalvageSweep(directory: string, loopType: 'research' | 'review', stdout: string): {
    failed: number;
    salvaged: number;
  };
};
const legacyMerge = require('../../scripts/fanout-merge.cjs') as {
  buildAttributionMd(data: unknown[], loopType: string): string;
  reconstructResearchRegistryFromState(records: unknown[], label: string): JsonObject | null;
  reconstructReviewRegistryFromState(records: unknown[], label: string): JsonObject | null;
};
const legacyPool = require('../../scripts/fanout-pool.cjs') as {
  classifyLineageFailure(error: unknown): unknown;
};

const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const T0 = '2026-07-21T10:00:00.000Z';
const T1 = '2026-07-21T10:01:00.000Z';
const HASH_A = sha256Bytes(canonicalBytes({ value: 'a' }));
const HASH_B = sha256Bytes(canonicalBytes({ value: 'b' }));
const REPLAY = sha256Bytes(canonicalBytes({ replay: 'result-envelope-fixture' }));
const INVOCATION = `inv:${createHash('sha256').update('invocation').digest('hex')}`;
const roots: string[] = [];

interface Harness {
  readonly ledger: AppendOnlyLedger;
  readonly registry: EventTypeRegistry;
  readonly root: string;
  readonly writer: AuthorizedEvidenceWriter;
}

function allow(_input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['shadow-write'] };
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `result-envelopes-${label}-`));
  roots.push(root);
  return root;
}

function harness(label: string, faultInjection?: LedgerFaultInjection): Harness {
  const root = temporaryRoot(label);
  const registry = createResultEnvelopeEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'shadow-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['shadow-write'],
    evaluate: allow,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: root,
    ledgerId: 'result-envelopes',
    auditLedgerId: 'result-envelopes-authorization',
    authorityProvider: () => AUTHORITY,
    faultInjection,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: root,
    auditLedgerId: 'result-envelopes-authorization',
    authorityProvider: () => AUTHORITY,
  }, ledger, policies);
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: root, operationTimeoutMs: 5_000 });
  const lease: Promise<FencedLease> = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: `result-writer-${label}`,
    correlationId: `result-${label}`,
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    ledgerFence: { writer: new FencedLedgerWriter(coordinator), currentLease: () => lease },
    gateway,
    policies,
    registry,
    authorizationContext: (event) => ({
      mode: 'research',
      priorStateVersion: 'result-shadow@1',
      priorStateFingerprint: HASH_A,
      actorId: 'result-envelope-service',
      capabilityId: 'shadow-write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'shadow-policy',
      policyVersion: 1,
      evidenceDigest: event.canonicalDigest,
    }),
  });
  return { ledger, registry, root, writer };
}

const launch: VerifiedLaunchFacts = Object.freeze({
  adapterIdentity: 'fanout-run-cli-opencode',
  adapterVersion: '1',
  effectiveConfig: {
    executable: 'opencode',
    executableVersion: 'sha256:fixture',
    kind: 'cli-opencode',
    model: 'opencode-go/glm-5.1',
    permissionMode: 'acceptEdits',
    reasoningEffort: 'high',
    sandboxMode: 'workspace-write',
    serviceTier: null,
    webSearch: 'inherit',
  },
  effectiveConfigDigest: HASH_A,
  inputDigest: HASH_A,
  invocationFingerprint: INVOCATION,
  promptDigest: HASH_B,
});

function context(sequence: number): ResultEventContext {
  return {
    authorityEpoch: 1,
    producer: { name: 'result-envelope-tests', version: '1' },
    streamId: 'leaf-stream',
    streamSequence: sequence,
  };
}

async function appendDispatch(target: Harness, suffix = 'a'): Promise<DispatchReceiptPayload> {
  const dispatchId = `dispatch-${suffix}`;
  const event = prepareLineageDispatchResolvedEvent({
    attemptId: `attempt-${suffix}`,
    authorityEpoch: 1,
    capabilityRowId: 'capability-dark',
    causationId: null,
    correlationId: `run-${suffix}`,
    dispatchId,
    leafId: `leaf-${suffix}`,
    logicalBranchId: `branch-${suffix}`,
    occurredAt: T0,
    producer: { name: 'dispatch-tests', version: '1' },
    recordedAt: T0,
    runId: `run-${suffix}`,
    streamId: `dispatch-stream-${suffix}`,
    streamSequence: 1,
  }, launch, target.registry);
  const appended = await target.writer.append(event);
  return appended.verified.event.effective.envelope.payload as DispatchReceiptPayload;
}

function reference(kind: string, name: string, digest = HASH_A): DigestReference {
  return { digest, kind, reference: `artifact://${name}/${digest}`, required: true };
}

function facts(overrides: Partial<LeafResultFacts> = {}): LeafResultFacts {
  const parsedResult = { summary: 'verified result' };
  return {
    artifacts: [reference('iteration', 'iteration-001')],
    completedAt: T1,
    cost: { amount: 0.125, currency: 'USD', provenance: 'measured' },
    durationMs: 60_000,
    errorClassification: null,
    errorDigest: null,
    evidence: [reference('registry', 'findings-registry')],
    parsedResult,
    parsedResultDigest: sha256Bytes(canonicalBytes(parsedResult)),
    parsedResultReference: null,
    replayFingerprint: REPLAY,
    resultSchemaVersion: 1,
    salvageSummary: { disposition: 'none', fragment_count: 0 },
    startedAt: T0,
    status: 'succeeded',
    usage: { input_tokens: 10, output_tokens: 5, provenance: 'measured', total_tokens: 15 },
    ...overrides,
  };
}

function resolverFor(digests: readonly string[]) {
  const allowed = new Set(digests);
  return async (value: Readonly<DigestReference>) => allowed.has(value.digest)
    ? { byteLength: 64, digest: value.digest }
    : null;
}

function salvageFacts(overrides: Partial<SalvageFragmentFacts> = {}): SalvageFragmentFacts {
  return {
    byteIdenticalOriginal: false,
    byteLength: 120,
    completeness: 'partial',
    confidence: 'medium',
    contentDigest: HASH_B,
    effectiveStatus: 'partial',
    failureReason: null,
    observedAt: T1,
    parserName: 'legacy-opencode-json-text',
    parserVersion: '1',
    reconstructed: true,
    recoveredScope: { iteration: 1 },
    replayFingerprint: REPLAY,
    resultEnvelopeId: null,
    schemaVersion: 1,
    sourceDigest: HASH_A,
    sourceKind: 'captured_stdout',
    sourceReference: `artifact://fanout-lineage.out/${HASH_A}`,
    verdict: 'recovered',
    ...overrides,
  };
}

async function appendRecoverySource(
  target: Harness,
  verdict: 'applied' | 'conflict' | 'in_doubt' | 'not_applied',
  retryDecision: 'execute_once' | 'operator_required' | 'reject' | 'synthesize_confirmation',
  terminalStatus: 'confirmed' | 'conflict' | 'operator_required' | 'retrying',
  suffix = 'a',
): Promise<VerifiedLedgerEvent> {
  const event = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: `effect-reconciled-${suffix}-${verdict}`,
    event_type: EFFECT_RECONCILED_EVENT_TYPE,
    event_version: 1,
    stream_id: 'effect-stream',
    stream_sequence: 2,
    occurred_at: T1,
    recorded_at: T1,
    producer: { name: 'effect-recovery-tests', version: '1' },
    authority_epoch: 1,
    correlation_id: `run-${suffix}`,
    causation_id: 'effect-recovery-started',
    idempotency_key: `effect-reconciled-${suffix}-${verdict}`,
    payload: {
      recovery_id: `recovery-${suffix}-${verdict}`,
      intent_event_id: `effect-intent-${suffix}`,
      verdict,
      reason_code: `observed-${verdict}`,
      evidence_digest: HASH_A,
      attempt: 1,
      claim: {
        claim_id: `claim-${verdict}`,
        claimant_id: 'recovery-worker',
        fence_token: 'fence-1',
        acquired_at: T0,
      },
      retry_decision: retryDecision,
      terminal_status: terminalStatus,
      observed_at: T1,
    },
  }, target.registry);
  return (await target.writer.append(event)).verified;
}

afterEach(() => {
  while (roots.length > 0) {
    const root = roots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe('canonical result recording', () => {
  it('rejects a result without a verified dispatch receipt', async () => {
    const target = harness('missing-receipt');
    await expect(recordLeafResult({
      context: context(2),
      dispatchReceiptId: 'dispatch-receipt:'.concat('a'.repeat(64)),
      facts: facts(),
      registry: target.registry,
      writer: target.writer,
    })).rejects.toMatchObject({ code: ResultEnvelopeErrorCodes.MISSING_DISPATCH_RECEIPT });
  });

  it('pairs one terminal result to the receipt and returns the original append receipt on repeat', async () => {
    const target = harness('idempotent-result');
    const dispatch = await appendDispatch(target);
    const input = {
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts(), registry: target.registry, writer: target.writer,
    };
    const first = await recordLeafResult(input);
    const repeat = await recordLeafResult(input);
    expect(first.status).toBe('appended');
    expect(repeat.status).toBe('idempotent');
    expect(repeat.receipt).toEqual(first.receipt);
    expect(repeat.event.identity.eventId).toBe(deriveResultEnvelopeId(dispatch.receipt_id));
    expect((await target.ledger.readVerifiedEvents())).toHaveLength(2);
  });

  it.each([
    ['status', () => facts({ status: 'partial' })],
    ['result', () => {
      const parsedResult = { summary: 'changed result' };
      return facts({ parsedResult, parsedResultDigest: sha256Bytes(canonicalBytes(parsedResult)) });
    }],
    ['evidence', () => facts({ evidence: [reference('registry', 'other', HASH_B)] })],
    ['cost', () => facts({ cost: { amount: 0.25, currency: 'USD', provenance: 'estimated' } })],
  ])('rejects changed %s facts before append', async (_dimension, changed) => {
    const target = harness(`conflict-${_dimension}`);
    const dispatch = await appendDispatch(target);
    await recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts(), registry: target.registry, writer: target.writer,
    });
    await expect(recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: changed(), registry: target.registry, writer: target.writer,
    })).rejects.toBeInstanceOf(ResultEnvelopeError);
    expect((await target.ledger.readVerifiedEvents())).toHaveLength(2);
  });

  it('excludes raw output, credentials, and invented unknown cost zeros', async () => {
    const target = harness('payload-safety');
    const dispatch = await appendDispatch(target);
    await expect(recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts({
        parsedResult: { raw_output: 'Bearer secret-value' },
        parsedResultDigest: HASH_A,
      }),
      registry: target.registry,
      writer: target.writer,
    })).rejects.toThrow();
    await expect(recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts({ cost: { amount: 0, currency: null, provenance: 'unknown' } }),
      registry: target.registry,
      writer: target.writer,
    })).rejects.toThrow();
  });
});

describe('evidence completion and deterministic resume', () => {
  it('does not accept recorded success when required evidence is missing or stale', async () => {
    const payload = facts();
    const target = harness('completion-gate');
    const dispatch = await appendDispatch(target);
    const result = await recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: payload, registry: target.registry, writer: target.writer,
    });
    const stored = result.verified.event.effective.envelope.payload;
    await expect(verifyLeafCompletion(stored as never, resolverFor([])))
      .resolves.toMatchObject({ complete: false, reasonCode: 'REQUIRED_DIGEST_UNRESOLVED' });
    const folded = await foldResumeProgress({
      expectedLeaves: [{ dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: true }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([]),
    });
    expect(folded.snapshot.leaves[0]).toMatchObject({
      classification: 'unreadable', eligible_for_dispatch: false,
    });
  });

  it('fails closed when required evidence resolves to a different digest', async () => {
    const target = harness('mismatched-evidence-digest');
    const dispatch = await appendDispatch(target);
    await recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts(), registry: target.registry, writer: target.writer,
    });
    const folded = await foldResumeProgress({
      expectedLeaves: [{
        dispatchId: dispatch.dispatch_id,
        leafId: dispatch.leaf_id,
        retryPolicyEligible: true,
      }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: async () => ({ byteLength: 64, digest: HASH_B }),
    });
    expect(folded.snapshot.leaves[0]).toMatchObject({
      classification: 'unreadable',
      eligible_for_dispatch: false,
      reason_code: 'REQUIRED_DIGEST_UNRESOLVED',
    });
  });

  it('does not accept unknown cost provenance as complete', async () => {
    const target = harness('unknown-cost');
    const dispatch = await appendDispatch(target);
    await recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts({ cost: { amount: null, currency: null, provenance: 'unknown' } }),
      registry: target.registry,
      writer: target.writer,
    });
    const folded = await foldResumeProgress({
      expectedLeaves: [{ dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: true }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot.leaves[0]).toMatchObject({
      classification: 'unreadable', reason_code: 'UNKNOWN_COST_PROVENANCE',
    });
  });

  it('produces byte-identical folds and never re-enables a durably completed leaf', async () => {
    const target = harness('deterministic-no-rerun');
    const dispatch = await appendDispatch(target);
    await recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts(), registry: target.registry, writer: target.writer,
    });
    const input = {
      expectedLeaves: [
        { dispatchId: 'dispatch-b', leafId: 'leaf-b', retryPolicyEligible: true },
        { dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: true },
      ],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    };
    const first = await foldResumeProgress(input);
    const restarted = await foldResumeProgress(input);
    expect(restarted.canonicalBytes).toBe(first.canonicalBytes);
    expect(restarted.canonicalDigest).toBe(first.canonicalDigest);
    expect(first.snapshot.completed_leaf_ids).toEqual(['leaf-a']);
    expect(first.snapshot.eligible_dispatch_ids).toEqual(['dispatch-b']);
    expect(first.snapshot.scheduling_exclusions).toContain('dispatch-a');
  });

  it('fails closed when the ledger hash chain cannot be verified', async () => {
    const target = harness('corrupt-ledger');
    const dispatch = await appendDispatch(target);
    const framePath = join(target.root, 'result-envelopes', 'frames', '0000000000000001.frame');
    const frame = JSON.parse(readFileSync(framePath, 'utf8')) as LedgerRecordFrame;
    writeFileSync(framePath, `${JSON.stringify({ ...frame, record_hash: 'f'.repeat(64) })}\n`, {
      encoding: 'utf8', mode: 0o600,
    });
    chmodSync(framePath, 0o600);
    const folded = await foldResumeProgress({
      expectedLeaves: [{ dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: true }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot).toMatchObject({ integrity: 'unreadable', eligible_dispatch_ids: [] });
    expect(folded.snapshot.leaves[0]).toMatchObject({ classification: 'unreadable' });
  });

  it('recovers an injected torn append and reconstructs the committed prefix deterministically', async () => {
    let crashArmed = false;
    let target: Harness | null = null;
    const faultInjection: LedgerFaultInjection = {
      afterFrameFsyncBeforeCommit: () => {
        if (!crashArmed || target === null) return;
        const pendingDirectory = join(target.root, 'result-envelopes', 'pending');
        const pendingFile = readdirSync(pendingDirectory).at(-1);
        if (!pendingFile) throw new Error('Expected a durable pending frame before publication');
        const pendingBytes = readFileSync(join(pendingDirectory, pendingFile));
        const tornPath = join(
          target.root,
          'result-envelopes',
          'frames',
          '0000000000000002.frame',
        );
        writeFileSync(tornPath, pendingBytes.subarray(0, Math.floor(pendingBytes.length / 2)), {
          mode: 0o600,
        });
        chmodSync(tornPath, 0o600);
        throw new Error('simulated crash after frame fsync');
      },
    };
    target = harness('crash-torn-tail', faultInjection);
    const dispatch = await appendDispatch(target);
    crashArmed = true;
    await expect(recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts(), registry: target.registry, writer: target.writer,
    })).rejects.toThrow('simulated crash after frame fsync');

    const beforeRecovery = await foldResumeProgress({
      expectedLeaves: [{
        dispatchId: dispatch.dispatch_id,
        leafId: dispatch.leaf_id,
        retryPolicyEligible: true,
      }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(beforeRecovery.snapshot).toMatchObject({
      integrity: 'unreadable',
      eligible_dispatch_ids: [],
    });
    expect(beforeRecovery.snapshot.leaves[0]).toMatchObject({
      classification: 'unreadable',
      eligible_for_dispatch: false,
    });

    crashArmed = false;
    await expect(target.ledger.recoverTornTail()).resolves.toMatchObject({ sequence: 1 });
    const input = {
      expectedLeaves: [{
        dispatchId: dispatch.dispatch_id,
        leafId: dispatch.leaf_id,
        retryPolicyEligible: true,
      }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    };
    const recovered = await foldResumeProgress(input);
    const restarted = await foldResumeProgress(input);
    expect(restarted.canonicalBytes).toBe(recovered.canonicalBytes);
    expect(restarted.canonicalDigest).toBe(recovered.canonicalDigest);
    expect(recovered.snapshot).toMatchObject({ integrity: 'trusted' });
    expect(recovered.snapshot.leaves[0]).toMatchObject({
      classification: 'dispatched_in_flight',
      eligible_for_dispatch: false,
      reason_code: 'EFFECT_RECONCILIATION_REQUIRED',
    });
    expect(readdirSync(join(target.root, 'result-envelopes', 'quarantine'))).toHaveLength(1);
  });
});

describe('reconcile before retry', () => {
  it('keeps a dispatched leaf ineligible until effect reconciliation is recorded', async () => {
    const target = harness('dispatch-in-flight');
    const dispatch = await appendDispatch(target);
    const folded = await foldResumeProgress({
      expectedLeaves: [{
        dispatchId: dispatch.dispatch_id,
        leafId: dispatch.leaf_id,
        retryPolicyEligible: true,
      }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot.leaves[0]).toMatchObject({
      classification: 'dispatched_in_flight',
      eligible_for_dispatch: false,
      reason_code: 'EFFECT_RECONCILIATION_REQUIRED',
    });
    expect(folded.snapshot.eligible_dispatch_ids).toEqual([]);
  });

  it.each([
    ['not_applied', 'execute_once', 'retrying', true],
    ['applied', 'synthesize_confirmation', 'confirmed', false],
    ['in_doubt', 'operator_required', 'operator_required', false],
    ['conflict', 'reject', 'conflict', false],
  ] as const)('%s recovery yields expected retry eligibility', async (
    verdict, retryDecision, terminalStatus, eligible,
  ) => {
    const target = harness(`recovery-${verdict}`);
    const dispatch = await appendDispatch(target);
    const source = await appendRecoverySource(target, verdict, retryDecision, terminalStatus);
    await recordLeafRecovery({
      context: context(3),
      dispatchReceiptId: dispatch.receipt_id,
      expectedCorrelationId: 'run-a',
      registry: target.registry,
      replayFingerprint: REPLAY,
      source,
      writer: target.writer,
    });
    const folded = await foldResumeProgress({
      expectedLeaves: [{ dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: true }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot.leaves[0]?.eligible_for_dispatch).toBe(eligible);
    if (verdict === 'in_doubt' || verdict === 'conflict') {
      expect(folded.snapshot.leaves[0]?.classification).toBe('conflicted');
    }
  });

  it('does not retry a not-applied attempt when retry policy rejects it', async () => {
    const target = harness('recovery-policy-denied');
    const dispatch = await appendDispatch(target);
    const source = await appendRecoverySource(target, 'not_applied', 'execute_once', 'retrying');
    await recordLeafRecovery({
      context: context(3), dispatchReceiptId: dispatch.receipt_id, registry: target.registry,
      expectedCorrelationId: 'run-a',
      replayFingerprint: REPLAY, source, writer: target.writer,
    });
    const folded = await foldResumeProgress({
      expectedLeaves: [{ dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: false }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot.eligible_dispatch_ids).toEqual([]);
  });

  it('rejects recovery evidence correlated to a different dispatched leaf', async () => {
    const target = harness('recovery-source-binding');
    const dispatchA = await appendDispatch(target, 'a');
    await appendDispatch(target, 'b');
    const sourceB = await appendRecoverySource(
      target,
      'not_applied',
      'execute_once',
      'retrying',
      'b',
    );
    await expect(recordLeafRecovery({
      context: context(4),
      dispatchReceiptId: dispatchA.receipt_id,
      expectedCorrelationId: 'run-b',
      registry: target.registry,
      replayFingerprint: REPLAY,
      source: sourceB,
      writer: target.writer,
    })).rejects.toMatchObject({ code: ResultEnvelopeErrorCodes.RECOVERY_EVIDENCE_INVALID });

    const folded = await foldResumeProgress({
      expectedLeaves: [{
        dispatchId: dispatchA.dispatch_id,
        leafId: dispatchA.leaf_id,
        retryPolicyEligible: true,
      }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot.leaves[0]).toMatchObject({
      classification: 'dispatched_in_flight',
      eligible_for_dispatch: false,
      reason_code: 'EFFECT_RECONCILIATION_REQUIRED',
      recovery_verdict: null,
    });
  });
});

describe('append-only salvage provenance', () => {
  it('records complete provenance, deduplicates exact repeats, and conflicts on changed content', async () => {
    const target = harness('salvage-provenance');
    const dispatch = await appendDispatch(target);
    const input = {
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: salvageFacts(), registry: target.registry, writer: target.writer,
    };
    const first = await recordSalvageFragment(input);
    const repeat = await recordSalvageFragment(input);
    expect(repeat.receipt).toEqual(first.receipt);
    expect(first.verified.event.effective.envelope.payload).toMatchObject({
      source_kind: 'captured_stdout', source_digest: HASH_A, content_digest: HASH_B,
      parser_version: '1', recovered_scope: { iteration: 1 }, completeness: 'partial',
      confidence: 'medium', verdict: 'recovered', effective_status: 'partial',
      byte_identical_original: false,
    });
    await expect(recordSalvageFragment({
      ...input, facts: salvageFacts({ contentDigest: HASH_A }),
    })).rejects.toMatchObject({ code: ResultEnvelopeErrorCodes.CONFLICT });
    expect((await target.ledger.readVerifiedEvents())).toHaveLength(2);
  });

  it('never promotes a failed result to success after recovered salvage', async () => {
    const target = harness('salvage-stays-partial');
    const dispatch = await appendDispatch(target);
    await recordLeafResult({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: facts({ status: 'failed', errorClassification: 'artifact_miss', errorDigest: HASH_B }),
      registry: target.registry, writer: target.writer,
    });
    await recordSalvageFragment({
      context: context(3), dispatchReceiptId: dispatch.receipt_id,
      facts: salvageFacts({ resultEnvelopeId: deriveResultEnvelopeId(dispatch.receipt_id) }),
      registry: target.registry, writer: target.writer,
    });
    const folded = await foldResumeProgress({
      expectedLeaves: [{ dispatchId: dispatch.dispatch_id, leafId: dispatch.leaf_id, retryPolicyEligible: true }],
      ledger: target.ledger,
      registryVersion: 'result-envelope-registry@1',
      resolver: resolverFor([HASH_A]),
    });
    expect(folded.snapshot.leaves[0]).toMatchObject({
      classification: 'salvaged', terminal_status: 'failed', eligible_for_dispatch: false,
    });
    expect(folded.snapshot.completed_leaf_ids).toEqual([]);
  });

  it.each([
    'captured_stdout',
    'future_typed_fragment',
    'iteration_artifact',
    'registry',
    'state_event',
  ] as const)('rejects reconstructed %s claiming byte identity with original evidence', async (
    sourceKind,
  ) => {
    const target = harness(`salvage-honesty-${sourceKind}`);
    const dispatch = await appendDispatch(target);
    await expect(recordSalvageFragment({
      context: context(2), dispatchReceiptId: dispatch.receipt_id,
      facts: salvageFacts({ byteIdenticalOriginal: true, sourceKind }),
      registry: target.registry, writer: target.writer,
    })).rejects.toThrow();
  });
});

describe('legacy shadow parity', () => {
  it('matches stdout parsing plus recovered-iteration and failed-marker semantics', () => {
    const stdout = JSON.stringify({ type: 'text', part: { text: 'recovered iteration evidence' } });
    expect(extractLegacyShadowText(stdout)).toBe(legacySalvage.extractTextFromOpencodeJson(stdout));
    const recovered = projectLegacySalvageShadow({
      capturedStdout: stdout,
      existingIterations: [1],
      stateRecords: [{ type: 'iteration', iteration: 1 }, { type: 'iteration', iteration: 2 }],
      stdoutReference: `artifact://fanout-lineage.out/${HASH_A}`,
    });
    expect(recovered).toMatchObject({ salvaged: 1, failed: 0 });
    expect(recovered.fragments[0]).toMatchObject({
      iteration: 2, marker: 'salvaged_from_stdout', byteIdenticalOriginal: false,
    });
    const failed = projectLegacySalvageShadow({
      capturedStdout: 'short', existingIterations: [],
      stateRecords: [{ type: 'iteration', iteration: 1 }], stdoutReference: 'artifact://stdout/missing',
    });
    expect(failed.fragments[0]?.marker).toBe('fanout_salvage_failed');
  });

  it('matches the shipped salvage sweep on recovered and failed fixtures', () => {
    for (const fixture of [
      { label: 'recovered', stdout: 'x'.repeat(60), expected: { salvaged: 1, failed: 0 } },
      { label: 'failed', stdout: 'short', expected: { salvaged: 0, failed: 1 } },
    ]) {
      const directory = temporaryRoot(`legacy-${fixture.label}`);
      mkdirSync(join(directory, 'iterations'), { recursive: true });
      writeFileSync(join(directory, 'deep-research-state.jsonl'), `${JSON.stringify({ type: 'iteration', iteration: 1 })}\n`);
      const actual = legacySalvage.runSalvageSweep(directory, 'research', fixture.stdout);
      const shadow = projectLegacySalvageShadow({
        capturedStdout: fixture.stdout, existingIterations: [],
        stateRecords: [{ type: 'iteration', iteration: 1 }], stdoutReference: 'artifact://stdout/fixture',
      });
      expect(actual).toEqual(fixture.expected);
      expect({ salvaged: shadow.salvaged, failed: shadow.failed }).toEqual(actual);
      const artifact = readFileSync(join(directory, 'iterations', 'iteration-001.md'), 'utf8');
      expect(artifact.includes('fanout_salvage_failed')).toBe(fixture.label === 'failed');
    }
  });

  it('matches registry reconstruction, attribution, and failure classification', () => {
    const reviewState: JsonObject[] = [{
      type: 'iteration', iteration: 1,
      findingDetails: [{ id: 'P1-1', severity: 'P1', title: 'gap', disposition: 'active' }],
    }];
    expect(reconstructLegacyRegistryShadow('review', reviewState, 'glm'))
      .toEqual(legacyMerge.reconstructReviewRegistryFromState(reviewState, 'glm'));
    const researchState: JsonObject[] = [{
      type: 'iteration', run: 2, newInfoRatio: 0.8,
      findings: ['cache TTL is never refreshed'],
    }];
    expect(reconstructLegacyRegistryShadow('research', researchState, 'glm'))
      .toEqual(legacyMerge.reconstructResearchRegistryFromState(researchState, 'glm'));

    const registry = reconstructLegacyRegistryShadow('research', researchState, 'glm');
    const stateWithSalvage = [...researchState, { type: 'event', event: 'salvaged_from_stdout' }];
    const attribution = projectLegacyAttribution({
      kind: 'cli-opencode', label: 'glm', model: 'glm-5.1', registry, stateRecords: stateWithSalvage,
    });
    const markdown = legacyMerge.buildAttributionMd([{
      kind: 'cli-opencode', label: 'glm', model: 'glm-5.1', registry, stateRecords: stateWithSalvage,
    }], 'research');
    expect(attribution).toMatchObject({ label: 'glm', iterations: 1, salvaged: 1, convergence: 0.8 });
    expect(markdown).toContain('| glm | cli-opencode | glm-5.1 | 1 | 0.8 | 1 | n/a |');

    for (const failure of [
      { exitCode: null, timedOut: true, salvage: { salvaged: 0, failed: 0 } },
      { exitCode: 0, timedOut: false, salvage: { salvaged: 0, failed: 1 } },
      { exitCode: 0, timedOut: false, salvage: { salvaged: 1, failed: 1 } },
      { exitCode: 2, timedOut: false, salvage: null },
    ]) {
      expect(classifyLegacyFailureShadow(failure)).toEqual(legacyPool.classifyLineageFailure({
        exitCode: failure.exitCode,
        timedOut: failure.timedOut,
        salvage: failure.salvage,
      }));
    }
  });
});
