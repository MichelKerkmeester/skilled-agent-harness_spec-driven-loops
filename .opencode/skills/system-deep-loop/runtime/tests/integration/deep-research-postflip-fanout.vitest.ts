// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Post-Flip Fan-Out Integration Tests
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  AuthorizationReasonCodes,
  AuthorizationVerdicts,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import { writeCanonicalJsonAtomic } from '../../lib/locks-and-fencing/durable-file.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
} from '../../lib/deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../../lib/legacy-projections/index.js';
import { appendModeEvent } from '../../lib/mode-append-gateway/index.js';
import { AuthorityRegistry } from '../../lib/per-mode-authority-flip/index.js';

import type { EventTypeRegistry, EventWritePreflight } from '../../lib/event-envelope/index.js';
import type { ModeAppendReceipt } from '../../lib/mode-append-gateway/index.js';
import type { AuthorityRecord } from '../../lib/per-mode-authority-flip/index.js';
import type { ResolvedCutoverBinding } from '../../lib/cutover-binding/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const RUNTIME_DIRECTORY = resolve(TEST_DIRECTORY, '../..');
const GUARD_SCRIPT = join(RUNTIME_DIRECTORY, 'scripts/check-direct-append.cjs');
const MODE = 'deep-research' as const;
const LEDGER_ID = 'deep-research-postflip-fanout-ledger';
const AUDIT_LEDGER_ID = `${LEDGER_ID}-audit`;
const LEAF_COUNT = 3;
const CONCURRENCY = 2;
const ZERO_DIGEST = '0'.repeat(64);
const CANDIDATE_SHA = 'a'.repeat(40);
const TIMESTAMP = '2026-08-22T12:00:00.000Z';

interface Leaf {
  readonly label: string;
  readonly index: number;
}

interface LeafOutput {
  readonly label: string;
  readonly receipts: readonly ModeAppendReceipt[];
}

interface PoolResult {
  readonly results: readonly {
    readonly label: string;
    readonly status: string;
    readonly output?: unknown;
  }[];
  readonly summary: {
    readonly total: number;
    readonly succeeded: number;
    readonly failed: number;
    readonly all_failed: boolean;
  };
}

interface PoolApi {
  readonly runCappedPool: (options: {
    readonly items: readonly Leaf[];
    readonly concurrency: number;
    readonly worker: (item: Leaf, context: { readonly index: number }) => Promise<LeafOutput>;
  }) => Promise<PoolResult>;
}

interface FanoutRunApi {
  readonly findMaxIterationsPolicyViolation: (input: {
    readonly loopType: 'research';
    readonly stateRead: StateRead;
    readonly lineage: { readonly iterations: number };
    readonly stopPolicy: 'max-iterations';
    readonly lineageDir: string;
  }) => string | null;
}

interface StateRead {
  readonly statePath: string;
  readonly records: readonly Record<string, unknown>[];
  readonly missing: boolean;
  readonly parseError: string | null;
}

interface GuardRun {
  readonly stdout: string;
  readonly payload: Record<string, unknown>;
  readonly exitCode: number;
}

interface FanoutFixture {
  readonly rootDirectory: string;
  readonly authorityRoot: string;
  readonly legacyFile: string;
  readonly artifactId: string;
  readonly flippedRecord: AuthorityRecord;
  readonly ledger: AppendOnlyLedger;
  readonly pool: PoolResult;
}

const runtimeRequire = createRequire(import.meta.url);
const { runCappedPool } = runtimeRequire('../../scripts/fanout-pool.cjs') as PoolApi;
const { findMaxIterationsPolicyViolation } = runtimeRequire('../../scripts/fanout-run.cjs') as FanoutRunApi;

const temporaryRoots: string[] = [];
let fixture: FanoutFixture;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function digest(seed: string): string {
  return sha256Bytes(canonicalBytes({ seed }));
}

function fixedNow(): Date {
  return new Date(TIMESTAMP);
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-research-postflip-${label}-`));
  temporaryRoots.push(root);
  return root;
}

async function flipAuthority(authorityRoot: string): Promise<AuthorityRecord> {
  // Seed the post-flip authority record directly. The forward-flip CAS mutators
  // that once produced it are gone now that every mode is finalized, so this
  // test writes the durable new_authoritative_reversible/dark record it needs
  // before its fan-out assertions run — using the same integrity digest the
  // registry itself computes over the record core — and reads it back.
  const registry = new AuthorityRegistry(authorityRoot, fixedNow);
  const core = {
    schemaVersion: 1 as const,
    mode: MODE,
    state: 'new_authoritative_reversible' as const,
    epoch: 2,
    selectedWriter: 'dark' as const,
    candidateSha: CANDIDATE_SHA,
    policyVersion: 1,
    cutoverCertificateDigest: digest('postflip-certificate'),
    lastTransitionDigest: digest('postflip-transition'),
    updatedAt: TIMESTAMP,
  };
  const record: AuthorityRecord = { ...core, recordDigest: sha256Bytes(canonicalBytes(core as never)) };
  writeCanonicalJsonAtomic(join(authorityRoot, `authority-${MODE}.json`), record as never);
  return registry.read(MODE);
}

function createPolicyRegistry(flippedRecord: AuthorityRecord): TransitionPolicyRegistry {
  return new TransitionPolicyRegistry([{
    policyId: 'deep-research-postflip-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['allow-all'],
    capturedAuthorizationState: {
      state: flippedRecord.state,
      epoch: flippedRecord.epoch,
    },
    evaluate: () => ({
      verdict: AuthorizationVerdicts.ALLOW,
      reasonCode: AuthorizationReasonCodes.ALLOWED,
      matchedRuleIds: ['allow-all'],
    }),
  }]);
}

function createBinding(): ResolvedCutoverBinding {
  return {
    actorId: 'deep-research-postflip-fanout-tests',
    capabilityId: 'write',
    candidateSha: CANDIDATE_SHA,
    baseSha: '0'.repeat(40),
    requestId: 'deep-research-postflip-fanout-binding',
    correlationId: 'deep-research-postflip-fanout-correlation',
    streamId: LEDGER_ID,
    decidedAt: TIMESTAMP,
  };
}

function createRunInitializedEvent(
  registry: EventTypeRegistry,
  leaf: Leaf,
  epoch: number,
): EventWritePreflight {
  return prepareDeepResearchEvent({
    stem: 'deep_research.run_initialized',
    scope: {
      runId: 'deep-research-postflip-run',
      lineageId: 'deep-research-postflip-lineage',
    },
    prevEventHash: ZERO_DIGEST,
    replay: {
      fingerprint_version: 1,
      final_digest: ZERO_DIGEST,
      replay_input_digests: {},
    },
    data: {
      generation: 1,
      charterDigest: digest(`charter-${leaf.index}`),
      configDigest: digest(`config-${leaf.index}`),
      executorFingerprint: digest(`executor-${leaf.index}`),
      replayFingerprint: digest(`replay-${leaf.index}`),
      maxIterations: LEAF_COUNT,
      convergencePolicyVersion: '1.0.0',
    },
    eventId: `postflip-run-initialized-${leaf.index}`,
    streamId: LEDGER_ID,
    streamSequence: leaf.index * 2 + 1,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'postflip-fanout-test', version: '1' },
    authorityEpoch: epoch,
    correlationId: `postflip-correlation-${leaf.index}`,
    causationId: null,
    idempotencyKey: `postflip-run-initialized-${leaf.index}`,
  }, registry);
}

function createIterationCompletedEvent(
  registry: EventTypeRegistry,
  leaf: Leaf,
  epoch: number,
): EventWritePreflight {
  return prepareDeepResearchEvent({
    stem: 'deep_research.iteration_completed',
    scope: {
      runId: 'deep-research-postflip-run',
      lineageId: 'deep-research-postflip-lineage',
      iteration: leaf.index + 1,
    },
    prevEventHash: ZERO_DIGEST,
    replay: {
      fingerprint_version: 1,
      final_digest: ZERO_DIGEST,
      replay_input_digests: {},
    },
    data: {
      status: 'complete',
      rawNewInfoRatio: 1,
      trustedEvidenceYield: 1,
      outputDigest: digest(`output-${leaf.index}`),
      ruledOutApproachRefs: [],
      nextFocusCausationId: `postflip-next-focus-${leaf.index}`,
    },
    eventId: `postflip-iteration-completed-${leaf.index}`,
    streamId: LEDGER_ID,
    streamSequence: leaf.index * 2 + 2,
    occurredAt: TIMESTAMP,
    recordedAt: TIMESTAMP,
    producer: { name: 'postflip-fanout-test', version: '1' },
    authorityEpoch: epoch,
    correlationId: `postflip-correlation-${leaf.index}`,
    causationId: `postflip-run-initialized-${leaf.index}`,
    idempotencyKey: `postflip-iteration-completed-${leaf.index}`,
  }, registry);
}

async function appendLeafEvent(
  options: Parameters<typeof appendModeEvent>[0],
): Promise<ModeAppendReceipt> {
  const outcome = await appendModeEvent(options);
  if (!outcome.ok) {
    throw new Error(`${outcome.phase}:${outcome.code}:${outcome.reason}`);
  }
  return outcome.receipt;
}

function readProjectedState(statePath: string): StateRead {
  if (!existsSync(statePath)) {
    return { statePath, records: [], missing: true, parseError: null };
  }
  try {
    const records = readFileSync(statePath, 'utf8')
      .split(/\r?\n/u)
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    return { statePath, records, missing: false, parseError: null };
  } catch (error: unknown) {
    return {
      statePath,
      records: [],
      missing: false,
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/gu, "'\\''")}'`;
}

function guardArguments(
  authorityRoot: string,
  legacyFile: string,
  artifactRoot: string,
  artifactId: string,
): string[] {
  return [
    '--mode', MODE,
    '--legacy-file', legacyFile,
    '--artifact-root', artifactRoot,
    '--artifact-id', artifactId,
    '--authority-root', authorityRoot,
  ];
}

function parseGuardOutput(stdout: string, exitCode: number): GuardRun {
  const trimmed = stdout.trim();
  return {
    stdout: trimmed,
    payload: JSON.parse(trimmed) as Record<string, unknown>,
    exitCode,
  };
}

function runGuard(
  authorityRoot: string,
  legacyFile: string,
  artifactRoot: string,
  artifactId: string,
): GuardRun {
  const args = guardArguments(authorityRoot, legacyFile, artifactRoot, artifactId);
  try {
    const stdout = execFileSync(process.execPath, [GUARD_SCRIPT, ...args], {
      cwd: RUNTIME_DIRECTORY,
      encoding: 'utf8',
    });
    return parseGuardOutput(stdout, 0);
  } catch (error: unknown) {
    const processError = error as { readonly status?: number | null; readonly stdout?: Buffer | string };
    if (typeof processError.status !== 'number') throw error;
    return parseGuardOutput(String(processError.stdout ?? ''), processError.status);
  }
}

function runPerturbedGuard(
  authorityRoot: string,
  legacyFile: string,
  artifactRoot: string,
  artifactId: string,
): GuardRun {
  const args = guardArguments(authorityRoot, legacyFile, artifactRoot, artifactId)
    .map(shellQuote)
    .join(' ');
  const command = [
    'set -u',
    `legacy_file=${shellQuote(legacyFile)}`,
    `guard_script=${shellQuote(GUARD_SCRIPT)}`,
    `backup_file=$(mktemp ${shellQuote(`${legacyFile}.backup.XXXXXX`)})`,
    'cp "$legacy_file" "$backup_file"',
    'restore_projection() { cp "$backup_file" "$legacy_file"; rm -f "$backup_file"; }',
    'trap restore_projection EXIT INT TERM',
    'printf \'\\n\' >> "$legacy_file"',
    'set +e',
    `guard_output=$(node "$guard_script" ${args} 2>/dev/null)`,
    'guard_status=$?',
    'set -e',
    'printf \'%s\\n\' "$guard_output"',
    'printf \'__EXIT_CODE__=%s\\n\' "$guard_status"',
  ].join('\n');
  const stdout = execFileSync('sh', ['-c', command], {
    cwd: RUNTIME_DIRECTORY,
    encoding: 'utf8',
  });
  const lines = stdout.trim().split(/\r?\n/u);
  const exitLine = lines.pop();
  if (!exitLine?.startsWith('__EXIT_CODE__=')) {
    throw new Error(`Perturbed guard did not report an exit code: ${stdout}`);
  }
  const jsonLine = lines.find((line) => line.trim().startsWith('{'));
  if (!jsonLine) throw new Error(`Perturbed guard did not report JSON: ${stdout}`);
  return parseGuardOutput(`${jsonLine}\n`, Number(exitLine.slice('__EXIT_CODE__='.length)));
}

async function buildFixture(): Promise<FanoutFixture> {
  const rootDirectory = temporaryRoot('fixture');
  const authorityRoot = join(rootDirectory, 'authority');
  const flippedRecord = await flipAuthority(authorityRoot);
  const eventRegistry = createDeepResearchEventRegistry();
  const projectionContract = createDeepResearchProjectionContract({
    ledgerId: LEDGER_ID,
    streamIds: Object.freeze([LEDGER_ID]),
  });
  const authorityRegistry = new AuthorityRegistry(authorityRoot, fixedNow);
  const policyRegistry = createPolicyRegistry(flippedRecord);
  const policy = policyRegistry.resolve('deep-research-postflip-policy', 1);
  const authorityProvider = () => {
    const record = authorityRegistry.read(MODE);
    return { state: record.state, epoch: record.epoch };
  };
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
    now: fixedNow,
  }, eventRegistry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
    identityResolver: (context) => ({
      actorId: context.evaluationInput.actorId,
      capabilityId: 'write',
      evidenceDigest: context.evaluationInput.evidenceDigest,
    }),
    now: fixedNow,
  }, ledger, policyRegistry);
  const binding = createBinding();
  const leaves: readonly Leaf[] = Array.from(
    { length: LEAF_COUNT },
    (_value, index) => ({ label: `leaf-${index + 1}`, index }),
  );
  const pool = await runCappedPool({
    items: leaves,
    concurrency: CONCURRENCY,
    worker: async (leaf) => {
      const common = {
        mode: MODE,
        runDirectory: rootDirectory,
        authorityRoot,
        policy: {
          policyId: policy.policyId,
          policyVersion: policy.policyVersion,
          policyDigest: policy.digest,
        },
        policyRegistry,
        authorizationGateway: gateway,
        ledger,
        eventRegistry,
        projectionContract,
        binding,
        now: fixedNow,
      } as const;
      const initializedReceipt = await appendLeafEvent({
        ...common,
        eventRecord: createRunInitializedEvent(eventRegistry, leaf, flippedRecord.epoch),
      });
      const iterationReceipt = await appendLeafEvent({
        ...common,
        eventRecord: createIterationCompletedEvent(eventRegistry, leaf, flippedRecord.epoch),
      });
      return {
        label: leaf.label,
        receipts: Object.freeze([initializedReceipt, iterationReceipt]),
      };
    },
  });
  const legacyFile = join(rootDirectory, projectionContract.relativePath);
  const watermarkDirectory = join(rootDirectory, '.legacy-projection-watermarks');
  const watermarkFiles = readdirSync(watermarkDirectory).filter((name) => name.endsWith('.json'));
  if (watermarkFiles.length !== 1) {
    throw new Error(`Expected one projection watermark, found ${watermarkFiles.length}`);
  }
  const artifactId = basename(watermarkFiles[0], '.json');
  if (artifactId !== projectionContract.artifactId) {
    throw new Error(`Projection artifact mismatch: ${artifactId}`);
  }
  return {
    rootDirectory,
    authorityRoot,
    legacyFile,
    artifactId,
    flippedRecord,
    ledger,
    pool,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

beforeAll(async () => {
  fixture = await buildFixture();
});

afterAll(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('deep-research post-flip fan-out gateway integration', () => {
  it('settles every real leaf through the gateway after the registry flip', async () => {
    expect(fixture.flippedRecord.state).toBe('new_authoritative_reversible');
    expect(fixture.flippedRecord.selectedWriter).toBe('dark');
    expect(fixture.pool.summary).toMatchObject({
      total: LEAF_COUNT,
      succeeded: LEAF_COUNT,
      failed: 0,
      all_failed: false,
    });
    expect(fixture.pool.results).toHaveLength(LEAF_COUNT);
    expect(fixture.pool.results.every((result) => result.status === 'fulfilled')).toBe(true);

    const outputs = fixture.pool.results.map((result) => result.output as LeafOutput);
    const receipts = outputs.flatMap((output) => output.receipts);
    expect(outputs.every((output) => output.receipts.length === 2)).toBe(true);
    expect(receipts).toHaveLength(LEAF_COUNT * 2);

    const events = await fixture.ledger.readVerifiedEvents();
    expect(events).toHaveLength(receipts.length);
    expect(events.map((entry) => entry.frame.sequence)).toEqual(
      Array.from({ length: receipts.length }, (_value, index) => index + 1),
    );
    expect(events.map((entry) => entry.event.effective.envelope.event_id).sort()).toEqual(
      receipts.map((receipt) => receipt.eventId).sort(),
    );
  });

  it('reads the gateway projection with the real fan-out mid-run policy reader', async () => {
    const stateRead = readProjectedState(fixture.legacyFile);
    const iterationCount = stateRead.records.filter((record) => record.type === 'iteration').length;
    const policyViolation = findMaxIterationsPolicyViolation({
      loopType: 'research',
      stateRead,
      lineage: { iterations: LEAF_COUNT },
      stopPolicy: 'max-iterations',
      lineageDir: fixture.rootDirectory,
    });

    expect(stateRead.missing).toBe(false);
    expect(stateRead.parseError).toBeNull();
    expect(iterationCount).toBe(LEAF_COUNT);
    // The real reader consumed the gateway-projected records and reached its
    // synthesis check (no synthesis event exists in this fixture), which proves
    // the projection is shape-compatible with the fan-out's mid-run reader.
    expect(policyViolation).toContain('missing synthesis event');
  });

  it('accepts the gateway watermark, detects a direct perturbation, and accepts restoration', () => {
    const originalBytes = readFileSync(fixture.legacyFile);
    const accepted = runGuard(
      fixture.authorityRoot,
      fixture.legacyFile,
      fixture.rootDirectory,
      fixture.artifactId,
    );
    console.info(JSON.stringify({ guard: 'gateway-output', stdout: accepted.stdout, exitCode: accepted.exitCode }));
    expect(accepted.exitCode).toBe(0);
    expect(accepted.payload).toMatchObject({ ok: true, status: 'ok' });

    const perturbed = runPerturbedGuard(
      fixture.authorityRoot,
      fixture.legacyFile,
      fixture.rootDirectory,
      fixture.artifactId,
    );
    console.info(JSON.stringify({ guard: 'direct-perturbation', stdout: perturbed.stdout, exitCode: perturbed.exitCode }));
    expect(perturbed.exitCode).toBe(2);
    expect(perturbed.payload).toMatchObject({
      ok: false,
      status: 'violation',
      code: 'DIRECT_APPEND_DETECTED',
    });
    expect(readFileSync(fixture.legacyFile)).toEqual(originalBytes);

    const restored = runGuard(
      fixture.authorityRoot,
      fixture.legacyFile,
      fixture.rootDirectory,
      fixture.artifactId,
    );
    console.info(JSON.stringify({ guard: 'restored-output', stdout: restored.stdout, exitCode: restored.exitCode }));
    expect(restored.exitCode).toBe(0);
    expect(restored.payload).toMatchObject({ ok: true, status: 'ok' });
  });

  it('leaves the same guard inert while the authority root is unflipped', () => {
    const preflipAuthorityRoot = join(fixture.rootDirectory, 'preflip-authority');
    const preflipRecord = new AuthorityRegistry(preflipAuthorityRoot, fixedNow).read(MODE);
    expect(preflipRecord.state).toBe('legacy_authoritative');

    const inert = runGuard(
      preflipAuthorityRoot,
      fixture.legacyFile,
      fixture.rootDirectory,
      fixture.artifactId,
    );
    console.info(JSON.stringify({ guard: 'preflip-inert', stdout: inert.stdout, exitCode: inert.exitCode }));
    expect(inert.exitCode).toBe(0);
    expect(inert.payload).toMatchObject({
      ok: true,
      status: 'not-enforced',
      authorityState: 'legacy_authoritative',
    });
  });
});
