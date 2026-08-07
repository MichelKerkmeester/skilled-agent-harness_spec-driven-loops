// ───────────────────────────────────────────────────────────────────
// MODULE: Durable Branch Leases and Waves Contract Tests
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  BranchMutationKinds,
  BranchOrchestrationErrorCodes,
  DurableBranchOrchestrator,
  canonicalBranchLeaseResource,
  compileBranchRun,
  compileLogicalBranches,
  deriveLogicalBranchId,
  validateImmutableWavePlan,
} from '../../lib/branch-leases-waves/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  FencedLeaseCoordinator,
  LocksAndFencingErrorCodes,
} from '../../lib/locks-and-fencing/index.js';

import type {
  BranchLeaseGrant,
  BranchManifestEntry,
  DurablePoolWorkerContext,
} from '../../lib/branch-leases-waves/index.js';
import type { FencedLease } from '../../lib/locks-and-fencing/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

interface TestClock {
  readonly now: () => Date;
  advance(durationMs: number): void;
}

interface PoolItem {
  readonly source: string;
}

interface ChildProcessResult {
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

interface ProcessAcquireResult {
  readonly status: 'granted' | 'rejected';
  readonly fenceToken?: number;
  readonly errorCode?: string;
}

const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `branch-leases-waves-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function manifest(count = 4): readonly BranchManifestEntry<PoolItem>[] {
  return Array.from({ length: count }, (_, index) => ({
    modelId: index % 2 === 0 ? 'model-a' : 'model-b',
    branchId: `branch-${String(Math.floor(index / 2) + 1)}`,
    replicaOrdinal: 1,
    invocationFingerprint: digest({ invocation: index + 1 }),
    poolItem: { source: `source-${index + 1}` },
  }));
}

function createClock(): TestClock {
  let currentMs = Date.parse('2026-01-01T00:00:00.000Z');
  return {
    now: () => new Date(currentMs),
    advance(durationMs: number): void {
      currentMs += durationMs;
    },
  };
}

function createOrchestrator(
  rootDirectory: string,
  clock?: TestClock,
): DurableBranchOrchestrator {
  return new DurableBranchOrchestrator({
    rootDirectory,
    ledgerId: 'branch-orchestration-ledger',
    packetId: 'packet-1',
    ...(clock ? { now: clock.now } : {}),
  });
}

async function initializeAndAdmit(
  orchestrator: DurableBranchOrchestrator,
  entries: readonly BranchManifestEntry<PoolItem>[] = manifest(),
  maxBranchesPerWave = 2,
) {
  const compiled = await orchestrator.initializeRun(
    'run-1',
    entries,
    { policyVersion: 1, maxBranchesPerWave },
  );
  const firstWave = compiled.wavePlan.waves[0];
  await orchestrator.admitWave('run-1', firstWave.waveId, 'authorize-wave-0');
  return { compiled, firstWave };
}

async function waitForFiles(paths: readonly string[], timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!paths.every((path) => existsSync(path))) {
    if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${paths.join(', ')}`);
    await new Promise((resolveWait) => setTimeout(resolveWait, 5));
  }
}

function runAcquireProcess(
  rootDirectory: string,
  workerId: string,
  logicalBranchId: string,
  readyPath: string,
  startPath: string,
  resultPath: string,
  peerResultPath: string,
): Promise<ChildProcessResult> {
  const testPath = fileURLToPath(import.meta.url);
  const testDirectory = dirname(testPath);
  const mcpServerDirectory = resolve(testDirectory, '../../../../system-spec-kit/mcp-server');
  const vitestCli = join(mcpServerDirectory, 'node_modules/vitest/vitest.mjs');
  return new Promise((resolveProcess, rejectProcess) => {
    const child = spawn(process.execPath, [
      vitestCli,
      'run',
      '--no-coverage',
      testPath,
      '-t',
      'independent process acquisition worker',
    ], {
      cwd: mcpServerDirectory,
      env: {
        ...process.env,
        BRANCH_WAVE_PROCESS_ROOT: rootDirectory,
        BRANCH_WAVE_PROCESS_WORKER: workerId,
        BRANCH_WAVE_PROCESS_BRANCH: logicalBranchId,
        BRANCH_WAVE_PROCESS_READY: readyPath,
        BRANCH_WAVE_PROCESS_START: startPath,
        BRANCH_WAVE_PROCESS_RESULT: resultPath,
        BRANCH_WAVE_PROCESS_PEER_RESULT: peerResultPath,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => { stdout += chunk; });
    child.stderr.on('data', (chunk: string) => { stderr += chunk; });
    child.once('error', rejectProcess);
    child.once('close', (exitCode) => resolveProcess({ exitCode, stdout, stderr }));
  });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

if (process.env.BRANCH_WAVE_PROCESS_ROOT) {
  describe('independent process helper', () => {
    it('independent process acquisition worker', async () => {
      const rootDirectory = process.env.BRANCH_WAVE_PROCESS_ROOT as string;
      const workerId = process.env.BRANCH_WAVE_PROCESS_WORKER as string;
      const logicalBranchId = process.env.BRANCH_WAVE_PROCESS_BRANCH as string;
      const readyPath = process.env.BRANCH_WAVE_PROCESS_READY as string;
      const startPath = process.env.BRANCH_WAVE_PROCESS_START as string;
      const resultPath = process.env.BRANCH_WAVE_PROCESS_RESULT as string;
      const peerResultPath = process.env.BRANCH_WAVE_PROCESS_PEER_RESULT as string;
      const coordinator = new FencedLeaseCoordinator({
        rootDirectory,
        retryIntervalMs: 1,
        operationTimeoutMs: 100,
      });
      writeFileSync(readyPath, workerId, 'utf8');
      await waitForFiles([startPath]);
      let result: ProcessAcquireResult;
      let lease: FencedLease | undefined;
      try {
        lease = await coordinator.acquire({
          resource: canonicalBranchLeaseResource('packet-1', 'run-1', logicalBranchId),
          ownerId: `worker-${workerId}`,
          correlationId: 'process-race',
          ttlMs: 5_000,
          acquireTimeoutMs: 100,
        });
        result = { status: 'granted', fenceToken: lease.fenceToken };
      } catch (error: unknown) {
        result = {
          status: 'rejected',
          errorCode: error && typeof error === 'object' && 'code' in error
            ? String(error.code)
            : 'UNEXPECTED_FAILURE',
        };
      }
      writeFileSync(resultPath, JSON.stringify(result), 'utf8');
      await waitForFiles([peerResultPath]);
      if (lease) await coordinator.release(lease);
    });
  });
}

// ───────────────────────────────────────────────────────────────────
// 2. IDENTITY AND RESOURCE CONTRACTS
// ───────────────────────────────────────────────────────────────────

describe('logical branch identity and canonical ownership', () => {
  it('derives stable coordinate IDs and identical immutable plans across reorder', () => {
    const entries = manifest(4);
    const policy = { policyVersion: 1, maxBranchesPerWave: 2 } as const;
    const first = compileBranchRun(entries, policy);
    const reordered = compileBranchRun([...entries].reverse(), policy);

    expect(reordered.manifestFingerprint).toBe(first.manifestFingerprint);
    expect(validateImmutableWavePlan(first.wavePlan)).toBe(first.wavePlan);
    expect(reordered.branches.map((branch) => branch.logicalBranchId)).toEqual(
      first.branches.map((branch) => branch.logicalBranchId),
    );
    expect(reordered.wavePlan).toEqual(first.wavePlan);
    expect(Object.isFrozen(first.wavePlan)).toBe(true);
    expect(Object.isFrozen(first.wavePlan.waves)).toBe(true);
    expect(Object.isFrozen(first.wavePlan.waves[0].memberBranchIds)).toBe(true);
    expect(() => first.wavePlan.waves[0].memberBranchIds.push(
      first.branches[0].logicalBranchId,
    )).toThrow();

    const coordinates = first.branches[0].coordinates;
    expect(deriveLogicalBranchId(coordinates)).toBe(first.branches[0].logicalBranchId);
    expect(first.branches[0].logicalBranchId).toMatch(/^lb-v1-[a-f0-9]{32}$/u);
  });

  it(
    'rejects unsafe coordinates, unknown versions, duplicates, and digest collisions before registration',
    async () => {
      const root = temporaryRoot('invalid-manifest');
      const orchestrator = createOrchestrator(root);
      const duplicate = [manifest(1)[0], { ...manifest(1)[0], poolItem: { source: 'other' } }];
      await expect(orchestrator.initializeRun(
        'run-1',
        duplicate,
        { policyVersion: 1, maxBranchesPerWave: 1 },
      )).rejects.toMatchObject({ code: BranchOrchestrationErrorCodes.DUPLICATE_COORDINATES });
      expect((await orchestrator.replay()).ledgerHead.sequence).toBe(0);

      expect(() => compileLogicalBranches([{ ...manifest(1)[0], modelId: '../model' }]))
        .toThrow(expect.objectContaining({
          code: BranchOrchestrationErrorCodes.INVALID_COORDINATES,
        }));
      expect(() => compileLogicalBranches([{ ...manifest(1)[0], derivationVersion: 2 }]))
        .toThrow(expect.objectContaining({
          code: BranchOrchestrationErrorCodes.UNKNOWN_DERIVATION_VERSION,
        }));
      expect(() => compileLogicalBranches(manifest(2), {
        digestCoordinates: () => 'a'.repeat(64),
      })).toThrow(expect.objectContaining({
        code: BranchOrchestrationErrorCodes.BRANCH_ID_COLLISION,
      }));
    },
  );

  it('maps one exact branch ID to one fenced resource key and rejects aliases', () => {
    const branch = compileLogicalBranches(manifest(1)).branches[0];
    const first = canonicalBranchLeaseResource('packet-1', 'run-1', branch.logicalBranchId);
    const second = canonicalBranchLeaseResource('packet-1', 'run-1', branch.logicalBranchId);
    expect(second.resourceKey).toBe(first.resourceKey);
    expect(second.resourceDigest).toBe(first.resourceDigest);
    expect(second.components).toEqual({
      packetId: 'packet-1',
      runId: 'run-1',
      lineageId: branch.logicalBranchId,
    });
    expect(() => canonicalBranchLeaseResource(
      'packet-1',
      'run-1',
      branch.logicalBranchId.toUpperCase(),
    )).toThrow(expect.objectContaining({ code: BranchOrchestrationErrorCodes.INVALID_COORDINATES }));
    expect(() => canonicalBranchLeaseResource('packet-1', 'run-1', '../branch'))
      .toThrow(expect.objectContaining({ code: BranchOrchestrationErrorCodes.INVALID_COORDINATES }));
  });

  it('allows one independent-process holder and preserves monotonic reclaim', async () => {
    const root = temporaryRoot('process-race');
    const logicalBranchId = compileLogicalBranches(manifest(1)).branches[0].logicalBranchId;
    const readyA = join(root, 'worker-a.ready');
    const readyB = join(root, 'worker-b.ready');
    const startPath = join(root, 'start');
    const resultA = join(root, 'worker-a.json');
    const resultB = join(root, 'worker-b.json');
    const first = runAcquireProcess(
      root, 'a', logicalBranchId, readyA, startPath, resultA, resultB,
    );
    const second = runAcquireProcess(
      root, 'b', logicalBranchId, readyB, startPath, resultB, resultA,
    );
    await waitForFiles([readyA, readyB]);
    writeFileSync(startPath, 'start', 'utf8');
    const processes = await Promise.all([first, second]);
    const results = [resultA, resultB].map((path) => (
      JSON.parse(readFileSync(path, 'utf8')) as ProcessAcquireResult
    ));
    const evidence = JSON.stringify({ processes, results });
    expect(processes.every((process) => process.exitCode === 0), evidence).toBe(true);
    expect(results.filter((result) => result.status === 'granted'), evidence).toEqual([{
      status: 'granted',
      fenceToken: 1,
    }]);
    expect(results.filter((result) => result.status === 'rejected'), evidence).toEqual([
      expect.objectContaining({
        status: 'rejected',
        errorCode: LocksAndFencingErrorCodes.LOCK_TIMEOUT,
      }),
    ]);

    const coordinator = new FencedLeaseCoordinator({ rootDirectory: root });
    const successor = await coordinator.acquire({
      resource: canonicalBranchLeaseResource('packet-1', 'run-1', logicalBranchId),
      ownerId: 'worker-successor',
      correlationId: 'process-race-successor',
      ttlMs: 1_000,
    });
    expect(successor.fenceToken).toBe(2);
  }, 20_000);
});

// ───────────────────────────────────────────────────────────────────
// 3. FENCED MUTATION AND WAVE CONTRACTS
// ───────────────────────────────────────────────────────────────────

describe('fenced mutation and deterministic wave scheduling', () => {
  it('rejects every stale protected mutation at commit without changing the accepted fold', async () => {
    const root = temporaryRoot('stale-commit');
    const clock = createClock();
    const first = createOrchestrator(root, clock);
    const { firstWave } = await initializeAndAdmit(first, manifest(1), 1);
    const logicalBranchId = firstWave.memberBranchIds[0];
    const oldGrant = await first.acquireBranchLease({
      runId: 'run-1',
      logicalBranchId,
      ownerId: 'worker-old',
      attemptId: 'attempt-old',
      ttlMs: 10,
    });
    clock.advance(11);
    const successorOrchestrator = createOrchestrator(root, clock);
    const successor = await successorOrchestrator.acquireBranchLease({
      runId: 'run-1',
      logicalBranchId,
      ownerId: 'worker-successor',
      attemptId: 'attempt-successor',
      ttlMs: 1_000,
    });
    expect(successor.lease.fenceToken).toBeGreaterThan(oldGrant.lease.fenceToken);

    const attempts = [
      [BranchMutationKinds.DISPATCH, { attempt: 1 }],
      [BranchMutationKinds.STATUS, { status: 'running' }],
      [BranchMutationKinds.RETRY, { attempt: 2 }],
      [BranchMutationKinds.RESULT, { result_digest: 'a'.repeat(64) }],
      [BranchMutationKinds.SALVAGE, { salvage_digest: 'b'.repeat(64) }],
      [BranchMutationKinds.TERMINAL, { outcome: 'failed' }],
    ] as const;
    for (const [mutationKind, data] of attempts) {
      await expect(first.commitBranchMutation({
        runId: 'run-1',
        transitionId: `stale-${mutationKind}`,
        grant: oldGrant,
        mutationKind,
        data,
      })).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.STALE_FENCE });
    }
    await expect(first.renewBranchLease('run-1', oldGrant, 1_000)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.STALE_FENCE,
    });
    await expect(first.releaseBranchLease('run-1', oldGrant)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.STALE_FENCE,
    });

    const fold = await successorOrchestrator.replay();
    expect(fold.state.branches[logicalBranchId]).toMatchObject({
      lifecycle: 'leased',
      acceptedResultDigest: null,
      acceptedSalvageDigest: null,
      terminalOutcome: null,
    });
    expect(fold.state.leases[logicalBranchId]).toMatchObject({
      leaseId: successor.lease.leaseId,
      fenceToken: successor.lease.fenceToken,
      ownerId: 'worker-successor',
      status: 'active',
    });
  });

  it('admits only the current wave, uses the full cap, and preserves pool settlement order', async () => {
    const root = temporaryRoot('pool-wave');
    const orchestrator = createOrchestrator(root);
    const entries = manifest(4);
    const { compiled, firstWave } = await initializeAndAdmit(orchestrator, entries, 2);
    const sourceByBranch = new Map(
      compiled.branches.map((branch) => [branch.logicalBranchId, branch.poolItem.source]),
    );
    let active = 0;
    let maxActive = 0;
    let releaseWorkers: () => void = () => undefined;
    let bothEntered: () => void = () => undefined;
    const releaseGate = new Promise<void>((resolveRelease) => { releaseWorkers = resolveRelease; });
    const enteredGate = new Promise<void>((resolveEntered) => { bothEntered = resolveEntered; });
    const called: string[] = [];
    const run = orchestrator.runAuthorizedWave({
      runId: 'run-1',
      workerOwnerId: 'pool-worker',
      leaseTtlMs: 10_000,
      concurrency: 2,
      worker: async (item: PoolItem, context: DurablePoolWorkerContext) => {
        called.push(context.logicalBranchId);
        active += 1;
        maxActive = Math.max(maxActive, active);
        if (active === 2) bothEntered();
        await releaseGate;
        active -= 1;
        return { source: item.source, completedBranch: context.logicalBranchId };
      },
    });
    await Promise.race([
      enteredGate,
      new Promise<never>((_, reject) => setTimeout(
        () => reject(new Error('Pool did not fill the authorized wave capacity')),
        5_000,
      )),
    ]);
    expect(maxActive).toBe(2);
    expect([...called].sort()).toEqual([...firstWave.memberBranchIds].sort());
    releaseWorkers();
    const result = await run;
    expect(result.results.map((settlement) => settlement.label)).toEqual(
      firstWave.memberBranchIds,
    );
    expect(result.results.map((settlement) => settlement.output)).toEqual(
      firstWave.memberBranchIds.map((logicalBranchId) => ({
        source: sourceByBranch.get(logicalBranchId),
        completedBranch: logicalBranchId,
      })),
    );
    const secondWave = compiled.wavePlan.waves[1];
    expect(called).not.toEqual(expect.arrayContaining(secondWave.memberBranchIds));

    await orchestrator.closeWave('run-1', firstWave.waveId, {
      authorizationId: 'close-wave-0',
      policyId: 'partial-failure-budget-policy',
      decision: 'advance',
    });
    await orchestrator.admitWave('run-1', secondWave.waveId, 'authorize-wave-1');
    const secondCalled: string[] = [];
    await orchestrator.runAuthorizedWave({
      runId: 'run-1',
      workerOwnerId: 'pool-worker',
      leaseTtlMs: 10_000,
      concurrency: 2,
      worker: async (_item: PoolItem, context: DurablePoolWorkerContext) => {
        secondCalled.push(context.logicalBranchId);
        return context.logicalBranchId;
      },
    });
    expect(secondCalled.sort()).toEqual([...secondWave.memberBranchIds].sort());
  }, 60_000);

  it('requires durable close-and-advance authorization before a later wave opens', async () => {
    const root = temporaryRoot('wave-order');
    const orchestrator = createOrchestrator(root);
    const { compiled, firstWave } = await initializeAndAdmit(orchestrator, manifest(3), 1);
    const secondWave = compiled.wavePlan.waves[1];
    await expect(orchestrator.admitWave(
      'run-1',
      secondWave.waveId,
      'early-wave-1',
    )).rejects.toMatchObject({ code: BranchOrchestrationErrorCodes.WAVE_NOT_AUTHORIZED });
    const resume = await orchestrator.getResumeState('run-1');
    expect(resume.currentWave?.waveId).toBe(firstWave.waveId);
    expect(resume.nextWave).toBeNull();
  });

  it('retains the shipped pool retry classification and retry ownership semantics', async () => {
    const root = temporaryRoot('pool-retry');
    const orchestrator = createOrchestrator(root);
    const { firstWave } = await initializeAndAdmit(orchestrator, manifest(1), 1);
    const attempts: number[] = [];
    const result = await orchestrator.runAuthorizedWave({
      runId: 'run-1',
      workerOwnerId: 'retry-worker',
      leaseTtlMs: 10_000,
      concurrency: 1,
      maxRetries: 1,
      worker: async (_item: PoolItem, context: DurablePoolWorkerContext) => {
        attempts.push(context.attempt);
        if (context.attempt === 1) {
          throw Object.assign(new Error('transient timeout'), {
            timedOut: true,
            exitCode: null,
          });
        }
        return { attempt: context.attempt };
      },
    });
    expect(attempts).toEqual([1, 2]);
    expect(result.results[0]).toMatchObject({
      label: firstWave.memberBranchIds[0],
      status: 'fulfilled',
      attempt: 2,
      output: { attempt: 2 },
    });
    const branch = (await orchestrator.replay()).state.branches[firstWave.memberBranchIds[0]];
    expect(branch).toMatchObject({
      lifecycle: 'terminal',
      lastStatus: 'succeeded',
      terminalOutcome: 'succeeded',
    });
  });

  it('fails closed instead of collapsing non-canonical results onto a fallback digest', async () => {
    const root = temporaryRoot('noncanonical-result');
    const orchestrator = createOrchestrator(root);
    const { firstWave } = await initializeAndAdmit(orchestrator, manifest(1), 1);
    const circular: { self?: unknown } = {};
    circular.self = circular;
    const result = await orchestrator.runAuthorizedWave({
      runId: 'run-1',
      workerOwnerId: 'noncanonical-worker',
      leaseTtlMs: 10_000,
      concurrency: 1,
      worker: async () => circular,
    });
    expect(result.results[0]).toMatchObject({
      label: firstWave.memberBranchIds[0],
      status: 'rejected',
      error: expect.objectContaining({
        message: 'Durable result acceptance requires a canonical JSON value',
      }),
    });
    expect((await orchestrator.replay()).state.branches[firstWave.memberBranchIds[0]])
      .toMatchObject({
        acceptedResultDigest: null,
        terminalOutcome: null,
      });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. LEDGER-ONLY RESUME CONTRACTS
// ───────────────────────────────────────────────────────────────────

describe('ledger-only reconstruction', () => {
  async function acceptResult(
    orchestrator: DurableBranchOrchestrator,
    logicalBranchId: string,
    transitionPrefix: string,
  ): Promise<BranchLeaseGrant> {
    const grant = await orchestrator.acquireBranchLease({
      runId: 'run-1',
      logicalBranchId,
      ownerId: `${transitionPrefix}-worker`,
      attemptId: `${transitionPrefix}-attempt`,
      ttlMs: 10_000,
    });
    await orchestrator.commitBranchMutation({
      runId: 'run-1',
      transitionId: `${transitionPrefix}-result`,
      grant,
      mutationKind: BranchMutationKinds.RESULT,
      data: { result_digest: digest({ logicalBranchId, transitionPrefix }) },
    });
    return grant;
  }

  it('reconstructs a partial wave and dispatches only its unsatisfied member after restart', async () => {
    const root = temporaryRoot('partial-wave-resume');
    const entries = manifest(2);
    const first = createOrchestrator(root);
    const { compiled, firstWave } = await initializeAndAdmit(first, entries, 2);
    const completedBranchId = firstWave.memberBranchIds[0];
    const grant = await acceptResult(first, completedBranchId, 'partial');
    await first.releaseBranchLease('run-1', grant);

    const restarted = createOrchestrator(root);
    await restarted.initializeRun(
      'run-1',
      [...entries].reverse(),
      { policyVersion: 1, maxBranchesPerWave: 2 },
    );
    const resume = await restarted.getResumeState('run-1');
    expect(resume.registeredBranchIds).toEqual(
      compiled.branches.map((branch) => branch.logicalBranchId),
    );
    expect(resume.satisfiedBranchIds).toEqual([completedBranchId]);
    expect(resume.currentWave?.waveId).toBe(firstWave.waveId);
    const dispatched: string[] = [];
    const result = await restarted.runAuthorizedWave({
      runId: 'run-1',
      workerOwnerId: 'resume-worker',
      leaseTtlMs: 10_000,
      concurrency: 2,
      worker: async (_item: PoolItem, context: DurablePoolWorkerContext) => {
        dispatched.push(context.logicalBranchId);
        return context.logicalBranchId;
      },
    });
    expect(dispatched).toEqual([firstWave.memberBranchIds[1]]);
    expect(result.results).toHaveLength(1);
  });

  it('reconstructs ownership and wave authority after every durable boundary', async () => {
    const root = temporaryRoot('boundary-restarts');
    const clock = createClock();
    const entries = manifest(2);
    const initial = createOrchestrator(root, clock);
    const compiled = await initial.initializeRun(
      'run-1',
      entries,
      { policyVersion: 1, maxBranchesPerWave: 1 },
    );
    const firstWave = compiled.wavePlan.waves[0];
    const secondWave = compiled.wavePlan.waves[1];
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).nextWave?.waveId)
      .toBe(firstWave.waveId);

    await initial.admitWave('run-1', firstWave.waveId, 'boundary-admit-0');
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).currentWave?.waveId)
      .toBe(firstWave.waveId);
    const logicalBranchId = firstWave.memberBranchIds[0];
    const grant = await initial.acquireBranchLease({
      runId: 'run-1',
      logicalBranchId,
      ownerId: 'boundary-worker',
      attemptId: 'boundary-attempt',
      ttlMs: 1_000,
    });
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).activeLeases[0])
      .toMatchObject({ fenceToken: grant.lease.fenceToken, isExpired: false });

    clock.advance(100);
    const renewed = await initial.renewBranchLease('run-1', grant, 2_000);
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).activeLeases[0])
      .toMatchObject({ expiresAt: renewed.lease.expiresAt, isExpired: false });
    await initial.commitBranchMutation({
      runId: 'run-1',
      transitionId: 'boundary-dispatch',
      grant: renewed,
      mutationKind: BranchMutationKinds.DISPATCH,
      data: { attempt: 1 },
    });
    expect((await createOrchestrator(root, clock).replay()).state.branches[logicalBranchId].lifecycle)
      .toBe('dispatched');
    await initial.commitBranchMutation({
      runId: 'run-1',
      transitionId: 'boundary-result',
      grant: renewed,
      mutationKind: BranchMutationKinds.RESULT,
      data: { result_digest: digest({ boundary: 'result' }) },
    });
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).satisfiedBranchIds)
      .toEqual([logicalBranchId]);
    await initial.commitBranchMutation({
      runId: 'run-1',
      transitionId: 'boundary-terminal',
      grant: renewed,
      mutationKind: BranchMutationKinds.TERMINAL,
      data: { outcome: 'succeeded' },
    });
    expect((await createOrchestrator(root, clock).replay()).state.branches[logicalBranchId])
      .toMatchObject({ lifecycle: 'terminal', terminalOutcome: 'succeeded' });
    await initial.releaseBranchLease('run-1', renewed);
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).activeLeases)
      .toEqual([]);

    await initial.closeWave('run-1', firstWave.waveId, {
      authorizationId: 'boundary-close-0',
      policyId: 'boundary-policy',
      decision: 'advance',
    });
    const afterClose = await createOrchestrator(root, clock).getResumeState('run-1');
    expect(afterClose.currentWave).toBeNull();
    expect(afterClose.nextWave?.waveId).toBe(secondWave.waveId);
    await createOrchestrator(root, clock).admitWave(
      'run-1',
      secondWave.waveId,
      'boundary-admit-1',
    );
    expect((await createOrchestrator(root, clock).getResumeState('run-1')).currentWave?.waveId)
      .toBe(secondWave.waveId);
  }, 60_000);

  it('treats an accepted result as resume-complete after a crash before terminal transition', async () => {
    const root = temporaryRoot('crash-resume');
    const entries = manifest(1);
    const first = createOrchestrator(root);
    const { firstWave } = await initializeAndAdmit(first, entries, 1);
    await acceptResult(first, firstWave.memberBranchIds[0], 'crash');

    const restarted = createOrchestrator(root);
    await restarted.initializeRun(
      'run-1',
      entries,
      { policyVersion: 1, maxBranchesPerWave: 1 },
    );
    const resume = await restarted.recordResume('run-1', 'resume-after-crash');
    expect(resume.satisfiedBranchIds).toEqual(firstWave.memberBranchIds);
    expect(resume.activeLeases).toEqual([
      expect.objectContaining({
        logicalBranchId: firstWave.memberBranchIds[0],
        isExpired: false,
      }),
    ]);
    let workerCalls = 0;
    const result = await restarted.runAuthorizedWave({
      runId: 'run-1',
      workerOwnerId: 'resume-worker',
      leaseTtlMs: 10_000,
      concurrency: 1,
      worker: async () => {
        workerCalls += 1;
        return 'unexpected';
      },
    });
    expect(workerCalls).toBe(0);
    expect(result.results).toEqual([]);
  });

  it('fails closed on manifest and wave-plan drift during restart', async () => {
    const root = temporaryRoot('drift');
    const entries = manifest(3);
    const first = createOrchestrator(root);
    await first.initializeRun(
      'run-1',
      entries,
      { policyVersion: 1, maxBranchesPerWave: 2 },
    );
    const restarted = createOrchestrator(root);
    await expect(restarted.initializeRun(
      'run-1',
      entries.map((entry, index) => index === 0
        ? { ...entry, invocationFingerprint: digest({ changed: true }) }
        : entry),
      { policyVersion: 1, maxBranchesPerWave: 2 },
    )).rejects.toMatchObject({ code: BranchOrchestrationErrorCodes.MANIFEST_DRIFT });
    await expect(restarted.initializeRun(
      'run-1',
      entries,
      { policyVersion: 1, maxBranchesPerWave: 1 },
    )).rejects.toMatchObject({ code: BranchOrchestrationErrorCodes.WAVE_PLAN_DRIFT });
  });
});
