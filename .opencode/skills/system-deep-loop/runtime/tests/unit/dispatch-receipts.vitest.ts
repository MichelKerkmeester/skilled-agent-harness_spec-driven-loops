// ───────────────────────────────────────────────────────────────────
// TEST: Canonical Dispatch Receipts
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  canonicalBytes,
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
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  DispatchReceiptErrorCodes,
  LINEAGE_DISPATCH_RESOLVED_EVENT_NAME,
  LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
  LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
  canonicalDispatchReceiptMacInput,
  createDispatchReceiptEventRegistry,
  createProcessLocalDispatchReceiptMacProvider,
  deriveDispatchReceiptId,
  dispatchWithDurableReceipt,
  resumeDispatchFromVerifiedLedger,
  verifyAdapterInvocationFingerprint,
} from '../../lib/dispatch-receipts/index.js';
import {
  canonicalReceiptJson,
  deriveReceiptKey,
} from '../../lib/deep-loop/receipt-crypto.js';

import type {
  AuthoritySnapshot,
  LedgerRecordFrame,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  EventTypeRegistry,
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type { FencedLease } from '../../lib/locks-and-fencing/index.js';
import type {
  DispatchReceiptEnvelopeInput,
  DispatchReceiptMacProvider,
  DispatchResolutionPipeline,
  ResolvedAdapterInvocation,
  VerifiedDispatchResultEvidence,
} from '../../lib/dispatch-receipts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const OCCURRED_AT = '2026-07-21T10:00:00.000Z';
const RECORDED_AT = '2026-07-21T10:00:01.000Z';
const STATE_FINGERPRINT = sha256Bytes(canonicalBytes({ state: 'dark' }));
const EVIDENCE_DIGEST = sha256Bytes(canonicalBytes({ evidence: 'dispatch' }));
const RESULT_DIGEST = sha256Bytes(canonicalBytes({ result: 'verified' }));
const roots: string[] = [];

interface Harness {
  readonly ledger: AppendOnlyLedger;
  readonly registry: EventTypeRegistry;
  readonly rootDirectory: string;
  readonly writer: AuthorizedEvidenceWriter;
}

interface PipelineState {
  readonly branch: string;
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `dispatch-receipts-${label}-`));
  roots.push(root);
  return root;
}

function allowPolicy(_input: Readonly<PolicyEvaluationInput>): PolicyEvaluationResult {
  return { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['dispatch-dark'] };
}

function createHarness(
  label: string,
  faultInjection: Readonly<{
    beforeDomainCommit?: () => void;
    afterFrameFsyncBeforeCommit?: () => void;
  }> = {},
  evaluate: (input: Readonly<PolicyEvaluationInput>) => PolicyEvaluationResult = allowPolicy,
): Harness {
  const rootDirectory = temporaryRoot(label);
  const registry = createDispatchReceiptEventRegistry();
  const policies = new TransitionPolicyRegistry([{
    policyId: 'dispatch-dark-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['dispatch-dark'],
    evaluate,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'dispatch-receipts',
    auditLedgerId: 'dispatch-receipts-authorization',
    authorityProvider: () => AUTHORITY,
    faultInjection,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'dispatch-receipts-authorization',
    authorityProvider: () => AUTHORITY,
  }, ledger, policies);
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory,
    operationTimeoutMs: 5_000,
  });
  const lease: Promise<FencedLease> = coordinator.acquire({
    resource: {
      kind: ProtectedResourceKinds.LEDGER,
      components: { ledgerId: ledger.ledgerId },
      atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    },
    ownerId: `dispatch-writer-${label}`,
    correlationId: `dispatch-${label}`,
    ttlMs: 300_000,
    acquireTimeoutMs: 5_000,
  });
  const writer = new AuthorizedEvidenceWriter({
    ledger,
    ledgerFence: {
      writer: new FencedLedgerWriter(coordinator),
      currentLease: () => lease,
    },
    gateway,
    policies,
    registry,
    authorizationContext: (event) => ({
      mode: 'research',
      priorStateVersion: 'dispatch-dark-state@1',
      priorStateFingerprint: STATE_FINGERPRINT,
      actorId: 'dispatch-receipt-service',
      capabilityId: 'dispatch-dark-write',
      authorityEpoch: event.identity.authorityEpoch,
      policyId: 'dispatch-dark-policy',
      policyVersion: 1,
      evidenceDigest: EVIDENCE_DIGEST,
    }),
  });
  return { ledger, registry, rootDirectory, writer };
}

function fingerprintFor(
  prompt: string,
  args: readonly string[],
  effectiveConfig: ResolvedAdapterInvocation['effectiveConfig'],
  promptArgIndexes: readonly number[],
): string {
  const promptDigest = createHash('sha256').update(prompt).digest('hex');
  const promptIndexes = new Set(promptArgIndexes);
  const payload = {
    kind: effectiveConfig.kind,
    executable: effectiveConfig.executable,
    executableVersion: effectiveConfig.executableVersion,
    model: effectiveConfig.model,
    effort: effectiveConfig.reasoningEffort,
    tier: effectiveConfig.serviceTier,
    sandboxPosture: {
      sandboxMode: effectiveConfig.sandboxMode,
      permissionMode: effectiveConfig.permissionMode,
    },
    webSearch: effectiveConfig.webSearch,
    argv: args.map((argument, index) => (
      promptIndexes.has(index) ? `<prompt:${promptDigest}>` : argument
    )),
    promptDigest,
  };
  return `inv:${createHash('sha256').update(JSON.stringify(payload)).digest('hex')}`;
}

function resolvedInvocation(
  overrides: Readonly<{
    fingerprint?: string;
    model?: string;
    prompt?: string;
    unsafeExtras?: Record<string, unknown>;
  }> = {},
): ResolvedAdapterInvocation {
  const prompt = overrides.prompt ?? 'bounded dispatch prompt';
  const model = overrides.model ?? 'opencode-go/glm-5.1';
  const effectiveConfig = {
    kind: 'cli-opencode',
    executable: 'opencode',
    executableVersion: 'sha256:fixture-executable',
    model,
    reasoningEffort: 'high',
    serviceTier: null,
    sandboxMode: 'workspace-write',
    permissionMode: 'acceptEdits',
    webSearch: 'inherit',
  } as const;
  const args = ['run', '--model', model, prompt];
  const promptArgIndexes = [3];
  return {
    adapterIdentity: 'fanout-run-cli-opencode',
    adapterVersion: '1',
    args,
    command: 'opencode',
    effectiveConfig,
    input: '',
    invocationFingerprint: overrides.fingerprint
      ?? fingerprintFor(prompt, args, effectiveConfig, promptArgIndexes),
    prompt,
    promptArgIndexes,
    ...(overrides.unsafeExtras ?? {}),
  } as ResolvedAdapterInvocation;
}

function resolvedInvocationForKind(
  kind: 'cli-claude-code' | 'cli-codex' | 'cli-opencode' | 'native',
): ResolvedAdapterInvocation {
  const prompt = `bounded ${kind} prompt`;
  const shared = {
    executableVersion: `sha256:${kind}-fixture-executable`,
    permissionMode: 'acceptEdits',
    sandboxMode: 'workspace-write',
    serviceTier: null,
    webSearch: 'inherit',
  } as const;
  const shape = kind === 'cli-codex'
    ? {
        adapterIdentity: 'fanout-run-cli-codex',
        args: ['exec', '--model', 'gpt-5.4', '-'],
        command: 'codex',
        input: prompt,
        model: 'gpt-5.4',
        promptArgIndexes: [],
        reasoningEffort: 'high',
      }
    : kind === 'cli-claude-code'
      ? {
          adapterIdentity: 'fanout-run-cli-claude-code',
          args: ['-p', prompt, '--model', 'claude-opus-4-8'],
          command: 'claude',
          input: undefined,
          model: 'claude-opus-4-8',
          promptArgIndexes: [1],
          reasoningEffort: 'high',
        }
      : kind === 'native'
        ? {
            adapterIdentity: 'fanout-run-native',
            args: ['run', '--command', 'deep/review', prompt],
            command: 'opencode',
            input: '',
            model: null,
            promptArgIndexes: [3],
            reasoningEffort: null,
          }
        : {
            adapterIdentity: 'fanout-run-cli-opencode',
            args: ['run', '--model', 'opencode-go/glm-5.1', prompt],
            command: 'opencode',
            input: '',
            model: 'opencode-go/glm-5.1',
            promptArgIndexes: [3],
            reasoningEffort: 'high',
          };
  const effectiveConfig = {
    ...shared,
    kind,
    executable: shape.command,
    model: shape.model,
    reasoningEffort: shape.reasoningEffort,
  };
  return {
    adapterIdentity: shape.adapterIdentity,
    adapterVersion: '1',
    args: shape.args,
    command: shape.command,
    effectiveConfig,
    input: shape.input,
    invocationFingerprint: fingerprintFor(
      prompt,
      shape.args,
      effectiveConfig,
      shape.promptArgIndexes,
    ),
    prompt,
    promptArgIndexes: shape.promptArgIndexes,
  };
}

function envelope(
  dispatchId = 'dispatch-run-1-leaf-1',
): DispatchReceiptEnvelopeInput {
  return {
    attemptId: 'attempt-1',
    authorityEpoch: 1,
    capabilityRowId: 'capability-cli-opencode-inherit',
    causationId: 'manifest-expansion-1',
    correlationId: 'fanout-run-1',
    dispatchId,
    leafId: 'leaf-1',
    logicalBranchId: 'branch-analysis',
    occurredAt: OCCURRED_AT,
    producer: { name: 'dispatch-receipts-tests', version: '1' },
    recordedAt: RECORDED_AT,
    runId: 'run-1',
    streamId: 'run-1',
    streamSequence: 1,
  };
}

function pipeline(
  invocation: ResolvedAdapterInvocation,
  order: string[] = [],
  failures: Readonly<Partial<Record<'capabilities' | 'config' | 'manifest' | 'adapter', Error>>> = {},
): DispatchResolutionPipeline<PipelineState, PipelineState, PipelineState> {
  return {
    expandConfiguration: () => {
      order.push('config');
      if (failures.config) throw failures.config;
      return { branch: 'config' };
    },
    validateCapabilities: () => {
      order.push('capabilities');
      if (failures.capabilities) throw failures.capabilities;
      return { branch: 'capabilities' };
    },
    expandManifest: () => {
      order.push('manifest');
      if (failures.manifest) throw failures.manifest;
      return { branch: 'manifest' };
    },
    resolveAdapter: () => {
      order.push('adapter');
      if (failures.adapter) throw failures.adapter;
      return invocation;
    },
  };
}

function dispatchInput<TResult>(
  harness: Harness,
  invocation: ResolvedAdapterInvocation,
  spawn: () => TResult | Promise<TResult>,
  overrides: Readonly<{
    dispatchEnvelope?: DispatchReceiptEnvelopeInput;
    faultAfterAppend?: () => void;
    macProvider?: DispatchReceiptMacProvider;
    order?: string[];
    routeUnresolved?: (handoff: unknown) => void;
  }> = {},
) {
  return {
    envelope: overrides.dispatchEnvelope ?? envelope(),
    faultInjection: overrides.faultAfterAppend
      ? { afterDurableAppendBeforeSpawn: overrides.faultAfterAppend }
      : undefined,
    macProvider: overrides.macProvider,
    pipeline: pipeline(invocation, overrides.order),
    registry: harness.registry,
    routeUnresolved: overrides.routeUnresolved,
    spawn,
    writer: harness.writer,
  };
}

function framePath(harness: Harness): string {
  return join(harness.rootDirectory, 'dispatch-receipts', 'frames', '0000000000000001.frame');
}

function readFrame(harness: Harness): LedgerRecordFrame {
  return JSON.parse(readFileSync(framePath(harness), 'utf8')) as LedgerRecordFrame;
}

function writeFrame(harness: Harness, frame: LedgerRecordFrame): void {
  writeFileSync(framePath(harness), `${JSON.stringify(frame)}\n`, { encoding: 'utf8', mode: 0o600 });
  chmodSync(framePath(harness), 0o600);
}

function withRecordHash(
  frame: Omit<LedgerRecordFrame, 'record_hash'>,
): LedgerRecordFrame {
  return { ...frame, record_hash: sha256Bytes(canonicalBytes(frame)) };
}

function verifiedResult(invocation: ResolvedAdapterInvocation): VerifiedDispatchResultEvidence {
  return {
    dispatchId: envelope().dispatchId,
    invocationFingerprint: invocation.invocationFingerprint,
    receiptId: deriveDispatchReceiptId(envelope().dispatchId),
    resultDigest: RESULT_DIGEST,
    resultId: 'result-1',
    verified: true,
  };
}

afterEach(() => {
  while (roots.length > 0) {
    const root = roots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. EVENT AND FINGERPRINT CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('canonical dispatch receipt contract', () => {
  it('registers one closed versioned wire event for the canonical logical name', () => {
    const registry = createDispatchReceiptEventRegistry();
    expect(registry.resolve(LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE)).toMatchObject({
      currentVersion: LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
      supportedVersions: [1],
    });
    expect(LINEAGE_DISPATCH_RESOLVED_EVENT_NAME).toBe('lineage_dispatch_resolved');
    expect(LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE).toBe('lineage.dispatch.resolved');
  });

  it('uses canonical receipt JSON that sorts object keys without reordering arrays', () => {
    expect(canonicalReceiptJson({ z: 1, a: { y: 2, x: 3 }, order: ['a', 'b'] }))
      .toBe(canonicalReceiptJson({ order: ['a', 'b'], a: { x: 3, y: 2 }, z: 1 }));
    expect(canonicalReceiptJson({ order: ['a', 'b'] }))
      .not.toBe(canonicalReceiptJson({ order: ['b', 'a'] }));
  });

  it('promotes the adapter fingerprint byte-for-byte after independent normalization', () => {
    const invocation = resolvedInvocation();
    const verified = verifyAdapterInvocationFingerprint(invocation);
    expect(verified.invocationFingerprint).toBe(invocation.invocationFingerprint);
    expect(verified.promptDigest).toBe(
      createHash('sha256').update(invocation.prompt).digest('hex'),
    );

    const changedPrompt = resolvedInvocation({ prompt: 'changed prompt' });
    expect(changedPrompt.invocationFingerprint).not.toBe(invocation.invocationFingerprint);
    expect(() => verifyAdapterInvocationFingerprint({
      ...changedPrompt,
      invocationFingerprint: invocation.invocationFingerprint,
    })).toThrow(expect.objectContaining({
      code: DispatchReceiptErrorCodes.INVOCATION_FINGERPRINT_CONFLICT,
    }));
  });

  it('conflicts when any version-one fingerprint input changes under the promoted bytes', () => {
    const baseline = resolvedInvocation();
    const changedInvocations: ResolvedAdapterInvocation[] = [
      {
        ...baseline,
        args: ['inspect', ...baseline.args.slice(1)],
      },
      {
        ...baseline,
        command: 'opencode-next',
        effectiveConfig: { ...baseline.effectiveConfig, executable: 'opencode-next' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, executableVersion: 'sha256:changed' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, kind: 'native' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, model: 'opencode-go/changed' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, reasoningEffort: 'low' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, serviceTier: 'priority' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, sandboxMode: 'read-only' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, permissionMode: 'plan' },
      },
      {
        ...baseline,
        effectiveConfig: { ...baseline.effectiveConfig, webSearch: 'live' },
      },
      {
        ...baseline,
        args: [...baseline.args.slice(0, -1), 'changed prompt'],
        prompt: 'changed prompt',
      },
    ];

    for (const changed of changedInvocations) {
      expect(() => verifyAdapterInvocationFingerprint(changed)).toThrow(
        expect.objectContaining({
          code: DispatchReceiptErrorCodes.INVOCATION_FINGERPRINT_CONFLICT,
        }),
      );
    }
  });

  it('fails a mismatched adapter fingerprint before append or spawn', async () => {
    const harness = createHarness('fingerprint-conflict');
    let spawnCalls = 0;
    const invocation = resolvedInvocation({ fingerprint: `inv:${'a'.repeat(64)}` });
    await expect(dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => { spawnCalls += 1; },
    ))).rejects.toMatchObject({
      code: DispatchReceiptErrorCodes.INVOCATION_FINGERPRINT_CONFLICT,
    });
    expect(spawnCalls).toBe(0);
    expect((await harness.ledger.getVerifiedHead()).sequence).toBe(0);
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. DURABLE BARRIER AND IDEMPOTENCY
// ───────────────────────────────────────────────────────────────────

describe('durable pre-spawn barrier', () => {
  it.each(['native', 'cli-codex', 'cli-claude-code', 'cli-opencode'] as const)(
    'persists a verified %s receipt before its spawn sentinel',
    async (kind) => {
      const harness = createHarness(`executor-kind-${kind}`);
      const invocation = resolvedInvocationForKind(kind);
      let durableEventsAtSpawn = 0;
      const result = await dispatchWithDurableReceipt(dispatchInput(
        harness,
        invocation,
        async () => {
          durableEventsAtSpawn = (await harness.ledger.readVerifiedEvents()).length;
          return kind;
        },
      ));

      expect(durableEventsAtSpawn).toBe(1);
      expect(result.event.envelope.payload).toMatchObject({
        executor_kind: kind,
        invocation_fingerprint: invocation.invocationFingerprint,
      });
    },
  );

  it('runs every resolution stage before a verified durable append and only then spawns', async () => {
    const harness = createHarness('ordered');
    const order: string[] = [];
    const invocation = resolvedInvocation();
    const result = await dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      async () => {
        const events = await harness.ledger.readVerifiedEvents();
        expect(events).toHaveLength(1);
        expect(events[0].frame.sequence).toBe(1);
        order.push('spawn');
        return 'legacy-result';
      },
      { order },
    ));

    expect(order).toEqual(['config', 'capabilities', 'manifest', 'adapter', 'spawn']);
    expect(result).toMatchObject({
      authority: 'legacy-authoritative',
      status: 'spawned',
      spawnResult: 'legacy-result',
      receipt: { sequence: 1 },
    });
    expect(result.evidence).toMatchObject({
      dispatchId: envelope().dispatchId,
      invocationFingerprint: invocation.invocationFingerprint,
      leafId: envelope().leafId,
      ledgerId: 'dispatch-receipts',
      ledgerSequence: 1,
      logicalBranchId: envelope().logicalBranchId,
      receiptId: deriveDispatchReceiptId(envelope().dispatchId),
      unresolvedClassification: 'dispatch-resolved',
    });
    expect(result.evidence.canonicalEventHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.evidence.recordHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it.each(['config', 'capabilities', 'manifest', 'adapter'] as const)(
    'never appends or spawns when %s resolution fails',
    async (stage) => {
      const harness = createHarness(`resolution-${stage}`);
      let spawnCalls = 0;
      const input = dispatchInput(harness, resolvedInvocation(), () => { spawnCalls += 1; });
      input.pipeline = pipeline(resolvedInvocation(), [], { [stage]: new Error('stage failed') });
      await expect(dispatchWithDurableReceipt(input)).rejects.toThrow('stage failed');
      expect(spawnCalls).toBe(0);
      expect((await harness.ledger.getVerifiedHead()).sequence).toBe(0);
    },
  );

  it('returns the original append receipt on exact retry and rejects changed facts before spawn', async () => {
    const harness = createHarness('idempotency');
    const baseline = resolvedInvocation();
    let spawnCalls = 0;
    const first = await dispatchWithDurableReceipt(dispatchInput(
      harness,
      baseline,
      () => { spawnCalls += 1; return 'first'; },
    ));
    const routed: unknown[] = [];
    const retry = await dispatchWithDurableReceipt(dispatchInput(
      harness,
      baseline,
      () => { spawnCalls += 1; return 'duplicate'; },
      { routeUnresolved: (handoff) => { routed.push(handoff); } },
    ));

    expect(first.status).toBe('spawned');
    expect(retry.status).toBe('unresolved');
    expect(retry.receipt).toEqual(first.receipt);
    expect(spawnCalls).toBe(1);
    expect(routed).toHaveLength(1);
    expect((await harness.ledger.readVerifiedEvents())).toHaveLength(1);

    const changed = resolvedInvocation({ model: 'opencode-go/changed-model' });
    await expect(dispatchWithDurableReceipt(dispatchInput(
      harness,
      changed,
      () => { spawnCalls += 1; },
    ))).rejects.toMatchObject({ code: DispatchReceiptErrorCodes.DISPATCH_ID_CONFLICT });
    expect(spawnCalls).toBe(1);
    expect((await harness.ledger.readVerifiedEvents())).toHaveLength(1);
  });

  it('converges concurrent exact retries on one original ledger append receipt', async () => {
    const harness = createHarness('concurrent-idempotency');
    const invocation = resolvedInvocation();
    let spawnCalls = 0;
    const [left, right] = await Promise.all([
      dispatchWithDurableReceipt(dispatchInput(
        harness,
        invocation,
        () => { spawnCalls += 1; return 'left'; },
      )),
      dispatchWithDurableReceipt(dispatchInput(
        harness,
        invocation,
        () => { spawnCalls += 1; return 'right'; },
      )),
    ]);

    expect([left.status, right.status].sort()).toEqual(['spawned', 'unresolved']);
    expect(left.receipt).toEqual(right.receipt);
    expect(spawnCalls).toBe(1);
    expect((await harness.ledger.readVerifiedEvents())).toHaveLength(1);
  });

  it('does not spawn when authorization or durable storage fails', async () => {
    const deniedHarness = createHarness('authorization-denied', {}, () => ({
      verdict: 'deny',
      reasonCode: 'dispatch-not-authorized',
      matchedRuleIds: ['dispatch-dark'],
    }));
    let deniedSpawnCalls = 0;
    await expect(dispatchWithDurableReceipt(dispatchInput(
      deniedHarness,
      resolvedInvocation(),
      () => { deniedSpawnCalls += 1; },
    ))).rejects.toMatchObject({ code: DispatchReceiptErrorCodes.DURABLE_APPEND_FAILED });
    expect(deniedSpawnCalls).toBe(0);
    expect((await deniedHarness.ledger.getVerifiedHead()).sequence).toBe(0);

    for (const [label, faultInjection] of [
      ['before-commit', { beforeDomainCommit: () => { throw new Error('commit crash'); } }],
      ['after-fsync', { afterFrameFsyncBeforeCommit: () => { throw new Error('publish crash'); } }],
    ] as const) {
      const harness = createHarness(label, faultInjection);
      let spawnCalls = 0;
      await expect(dispatchWithDurableReceipt(dispatchInput(
        harness,
        resolvedInvocation(),
        () => { spawnCalls += 1; },
      ))).rejects.toMatchObject({ code: DispatchReceiptErrorCodes.DURABLE_APPEND_FAILED });
      expect(spawnCalls).toBe(0);
      expect((await harness.ledger.getVerifiedHead()).sequence).toBe(0);
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. SECRET AND CRYPTO BOUNDARIES
// ───────────────────────────────────────────────────────────────────

describe('secret exclusion and verifier honesty', () => {
  it('persists only safe digests even when raw prompt, environment, credential, and key canaries exist', async () => {
    const harness = createHarness('secret-exclusion');
    const runMasterSecret = 'RUN_MASTER_SECRET_CANARY_0123456789';
    const prompt = 'RAW_PROMPT_BODY_CANARY';
    const invocation = resolvedInvocation({
      prompt,
      unsafeExtras: {
        credentials: 'CREDENTIAL_CANARY',
        environment: { OPENAI_API_KEY: 'ENV_SECRET_CANARY' },
      },
    });
    const provider = createProcessLocalDispatchReceiptMacProvider(
      runMasterSecret,
      'ephemeral-test-provider',
    );
    const result = await dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => 'legacy-result',
      { macProvider: provider },
    ));
    const serialized = Buffer.from(result.event.canonicalBytes).toString('utf8');
    const macInput = canonicalDispatchReceiptMacInput(
      result.event.envelope.payload as never,
    );
    for (const canary of [
      prompt,
      'CREDENTIAL_CANARY',
      'ENV_SECRET_CANARY',
      runMasterSecret,
    ]) {
      expect(serialized).not.toContain(canary);
      expect(macInput).not.toContain(canary);
    }
    expect(result.event.envelope.payload).toMatchObject({
      prompt_digest: createHash('sha256').update(prompt).digest('hex'),
      mac_trust_scope: 'process-local-advisory',
    });
  });

  it('keeps process-local HMAC advisory but verifies a reconstructable durable provider after restart', async () => {
    const advisoryHarness = createHarness('advisory');
    const invocation = resolvedInvocation();
    const advisory = createProcessLocalDispatchReceiptMacProvider(
      'advisory-secret-material-0001',
      'advisory-provider',
    );
    await dispatchWithDurableReceipt(dispatchInput(
      advisoryHarness,
      invocation,
      () => 'legacy-result',
      { macProvider: advisory },
    ));
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: advisoryHarness.ledger,
    })).resolves.toMatchObject({
      classification: 'unresolved',
      macVerification: 'process-local-advisory-unavailable',
    });

    const durableHarness = createHarness('durable-provider');
    const durableProvider = (): DispatchReceiptMacProvider => ({
      profile: {
        keyId: 'stable-key-1',
        providerId: 'durable-provider',
        scheme: 'hmac-sha256',
        trustScope: 'durable-cross-resume',
        verifierVersion: '1',
      },
      canVerifyAfterRestart: () => true,
      deriveKey: (dispatchId) => deriveReceiptKey(
        'durable-provider-secret-material-0001',
        dispatchId,
      ),
    });
    await dispatchWithDurableReceipt(dispatchInput(
      durableHarness,
      invocation,
      () => 'legacy-result',
      { macProvider: durableProvider() },
    ));
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: durableHarness.ledger,
      macProviders: [durableProvider()],
    })).resolves.toMatchObject({
      classification: 'unresolved',
      macVerification: 'durable-verified',
    });
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: durableHarness.ledger,
      macProviders: [{
        ...durableProvider(),
        deriveKey: (dispatchId) => deriveReceiptKey(
          'wrong-durable-provider-secret-0001',
          dispatchId,
        ),
      }],
    })).resolves.toMatchObject({
      classification: 'corrupt',
      eligibleForFirstDispatch: false,
      reasonCode: DispatchReceiptErrorCodes.MAC_VERIFICATION_FAILED,
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. THREE-VALUED RESUME AND CRASH CUTS
// ───────────────────────────────────────────────────────────────────

describe('verified three-valued resume', () => {
  it('classifies no receipt, receipt-only, exact result, and desired-fingerprint conflict', async () => {
    const harness = createHarness('resume-states');
    const invocation = resolvedInvocation();
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toEqual({
      authority: 'ledger',
      classification: 'not_dispatched',
      eligibleForFirstDispatch: true,
    });

    await dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => 'legacy-result-without-successor-envelope',
    ));
    const routed: unknown[] = [];
    const unresolved = await resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
      routeUnresolved: (handoff) => { routed.push(handoff); },
    });
    expect(unresolved).toMatchObject({
      classification: 'unresolved',
      eligibleForFirstDispatch: false,
      handoff: {
        effectRecovery: { action: 'reconcile' },
        successorSalvage: { action: 'inspect-and-salvage' },
      },
    });
    expect(routed).toHaveLength(1);

    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
      result: verifiedResult(invocation),
    })).resolves.toMatchObject({
      classification: 'result_recorded',
      eligibleForFirstDispatch: false,
      result: { resultId: 'result-1', verified: true },
    });

    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: `inv:${'b'.repeat(64)}`,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toMatchObject({
      classification: 'conflict',
      eligibleForFirstDispatch: false,
      needsNewAuthorizedDispatchIdentity: true,
      reasonCode: 'DESIRED_FINGERPRINT_MISMATCH',
    });
  });

  it('leaves a durable unresolved receipt after the post-append crash cut and never auto-spawns on retry', async () => {
    const harness = createHarness('after-append-crash');
    const invocation = resolvedInvocation();
    let spawnCalls = 0;
    await expect(dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => { spawnCalls += 1; },
      { faultAfterAppend: () => { throw new Error('crash after append'); } },
    ))).rejects.toThrow('crash after append');
    expect(spawnCalls).toBe(0);
    const original = (await harness.ledger.readVerifiedEvents())[0];

    const retry = await dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => { spawnCalls += 1; },
    ));
    expect(retry).toMatchObject({
      status: 'unresolved',
      receipt: {
        sequence: original.frame.sequence,
        canonicalEventHash: original.frame.canonical_event_hash,
        recordHash: original.frame.record_hash,
      },
    });
    expect(spawnCalls).toBe(0);
    expect((await harness.ledger.readVerifiedEvents())).toHaveLength(1);
  });

  it('does not blindly re-execute after a spawn crash or a missing successor result', async () => {
    const harness = createHarness('spawn-crash');
    const invocation = resolvedInvocation();
    let spawnCalls = 0;
    await expect(dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => {
        spawnCalls += 1;
        throw new Error('spawn interrupted');
      },
    ))).rejects.toThrow('spawn interrupted');
    expect(spawnCalls).toBe(1);

    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toMatchObject({ classification: 'unresolved' });
    const retry = await dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => { spawnCalls += 1; },
    ));
    expect(retry.status).toBe('unresolved');
    expect(spawnCalls).toBe(1);
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. CORRUPT EVIDENCE
// ───────────────────────────────────────────────────────────────────

describe('resume fails closed on invalid durable evidence', () => {
  async function committed(label: string): Promise<{
    readonly harness: Harness;
    readonly invocation: ResolvedAdapterInvocation;
  }> {
    const harness = createHarness(label);
    const invocation = resolvedInvocation();
    await dispatchWithDurableReceipt(dispatchInput(
      harness,
      invocation,
      () => 'legacy-result',
    ));
    return { harness, invocation };
  }

  it('rejects hash-invalid evidence', async () => {
    const { harness, invocation } = await committed('hash-invalid');
    writeFrame(harness, { ...readFrame(harness), record_hash: 'f'.repeat(64) });
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toMatchObject({ classification: 'corrupt', eligibleForFirstDispatch: false });
  });

  it('rejects unauthorized evidence even when the frame hash is internally consistent', async () => {
    const { harness, invocation } = await committed('authorization-invalid');
    const frame = readFrame(harness);
    const { record_hash: ignored, ...hashInput } = frame;
    void ignored;
    writeFrame(harness, withRecordHash({
      ...hashInput,
      authorization_ref: {
        ...hashInput.authorization_ref,
        audit_record_hash: 'a'.repeat(64),
      },
    }));
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toMatchObject({ classification: 'corrupt', eligibleForFirstDispatch: false });
  });

  it('rejects an unknown event version before trusting its payload', async () => {
    const { harness, invocation } = await committed('unknown-version');
    const frame = readFrame(harness);
    const event = JSON.parse(
      Buffer.from(frame.canonical_event_bytes, 'base64').toString('utf8'),
    ) as Record<string, unknown>;
    event.event_version = 99;
    const eventBytes = Uint8Array.from(canonicalBytes(event as JsonObject));
    const { record_hash: ignored, ...hashInput } = frame;
    void ignored;
    writeFrame(harness, withRecordHash({
      ...hashInput,
      canonical_event_hash: sha256Bytes(eventBytes),
      canonical_event_bytes: Buffer.from(eventBytes).toString('base64'),
      receipt: { ...hashInput.receipt, event_version: 99 },
    }));
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toMatchObject({ classification: 'corrupt', eligibleForFirstDispatch: false });
  });

  it('rejects malformed frame bytes without minting a replacement receipt', async () => {
    const { harness, invocation } = await committed('malformed');
    writeFileSync(framePath(harness), '{malformed\n', { encoding: 'utf8', mode: 0o600 });
    chmodSync(framePath(harness), 0o600);
    await expect(resumeDispatchFromVerifiedLedger({
      desiredInvocationFingerprint: invocation.invocationFingerprint,
      dispatchId: envelope().dispatchId,
      ledger: harness.ledger,
    })).resolves.toMatchObject({ classification: 'corrupt', eligibleForFirstDispatch: false });
  });
});
