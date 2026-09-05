import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppendOnlyLedger } from '../../lib/authorized-ledger/index.js';
import { createDeepResearchEventRegistry } from '../../lib/deep-research-ledger-schema/index.js';
import { AUTHORITY_FLIP_MODE_ORDER } from '../../lib/per-mode-authority-flip/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');

type CliResult = {
  exitCode: number | null;
  json: Record<string, unknown>;
  rawStdout: string;
  stderr: string;
};

function runCli(args: string[], environmentOverlay: NodeJS.ProcessEnv = {}): CliResult {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...environmentOverlay },
  });
  const stdout = (result.stdout ?? '').trim();
  const lastLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(lastLine);
  } catch {
    json = { raw: lastLine };
  }
  return {
    exitCode: result.status,
    json,
    rawStdout: stdout,
    stderr: result.stderr ?? '',
  };
}

function sampleRunInitializedEvent(): Record<string, unknown> {
  const digest = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return {
    stem: 'deep_research.run_initialized',
    scope: { runId: 'run-authority-001', lineageId: 'lineage-authority-001' },
    data: {
      generation: 1,
      charterDigest: digest,
      configDigest: digest,
      executorFingerprint: digest,
      replayFingerprint: digest,
      maxIterations: 10,
      convergencePolicyVersion: '1.0.0',
    },
  };
}

function sampleReviewRunInitializedEvent(): Record<string, unknown> {
  const digest = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return {
    stem: 'deep_review.run_initialized',
    scope: { runId: 'run-authority-001-review', sessionId: 'session-authority-001-review', generation: 1 },
    data: {
      target: {
        targetId: 'target-cli',
        targetType: 'file',
        artifactRef: 'artifact:cli',
        sourceDigest: digest,
        contentDigest: digest,
      },
      lineageMode: 'fresh',
      maxIterations: 7,
      convergencePolicyVersion: 'convergence@1',
      reviewModeContractDigest: digest,
      initialReleaseReadinessState: 'not-assessed',
    },
  };
}

const temporaryDirectories: string[] = [];

function createTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `append-mode-event-cli-${prefix}-`));
  temporaryDirectories.push(dir);
  return dir;
}

// The three directory roles a caller can hand the CLI as --run-directory: a
// bare spec folder, the mode's own artifact directory, or one fan-out
// lineage's private sub-packet under it.
type RunDirectoryShape = 'spec-folder' | 'artifact-directory' | 'lineage-directory';

function createShapedRunDir(
  prefix: string,
  modeDirName: 'research' | 'review',
  shape: RunDirectoryShape,
): string {
  const base = createTempDir(prefix);
  if (shape === 'spec-folder') return base;
  const dir = shape === 'artifact-directory'
    ? join(base, modeDirName)
    : join(base, modeDirName, 'lineages', 'lineage-a');
  mkdirSync(dir, { recursive: true });
  return dir;
}

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (dir) {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup failures
      }
    }
  }
});

describe('append-mode-event CLI subprocess execution', () => {
  it('appends a plain JSON event record to deep-research ledger and exits 0', async () => {
    const runDir = createTempDir('happy-research');
    const eventJsonPath = join(runDir, 'event.json');

    const sampleEvent = {
      stem: 'deep_research.run_initialized',
      scope: {
        runId: 'run-cli-001',
        lineageId: 'lineage-cli-001',
      },
      data: {
        generation: 1,
        charterDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        configDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        executorFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        replayFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        maxIterations: 10,
        convergencePolicyVersion: '1.0.0',
      },
    };

    writeFileSync(eventJsonPath, JSON.stringify(sampleEvent, null, 2), 'utf8');

    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json.ok).toBe(true);
    expect(result.json.projectionRefreshed).toBe(true);
    expect(result.json.projectionError).toBeNull();

    const receipt = result.json.receipt as Record<string, unknown>;
    expect(receipt).toBeDefined();
    expect(receipt.ledgerId).toBe('deep-research-ledger');
    expect(receipt.sequence).toBe(1);
    expect(receipt.eventType).toBe('deep-research.ledger.run-initialized');

    // Read the event back directly from the ledger on disk to verify it landed
    const registry = createDeepResearchEventRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory: runDir,
      ledgerId: 'deep-research-ledger',
      auditLedgerId: 'deep-research-audit-ledger',
      authorityProvider: () => ({ state: 'legacy_authoritative', epoch: 1 }),
    }, registry);

    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
    expect(events[0].frame.sequence).toBe(1);
    expect(events[0].event.effective.envelope.event_type).toBe('deep-research.ledger.run-initialized');
    expect(events[0].event.effective.envelope.payload.stem).toBe('deep_research.run_initialized');

    // Verify the projected legacy state file exists and has valid contents
    const projectedPath = join(runDir, 'research', 'deep-research-state.jsonl');
    expect(existsSync(projectedPath)).toBe(true);
    const projectedContent = readFileSync(projectedPath, 'utf8').trim();
    const projectedRow = JSON.parse(projectedContent);
    expect(projectedRow.type).toBe('config');
    expect(projectedRow.topic).toBe('run-cli-001');
    expect(projectedRow.maxIterations).toBe(10);
    expect(projectedRow.generation).toBe(1);
  });

  it('supports sequential appends across multiple CLI invocations', async () => {
    const runDir = createTempDir('sequential');

    const event1Path = join(runDir, 'event1.json');
    const event1 = {
      stem: 'deep_research.run_initialized',
      scope: {
        runId: 'run-seq-1',
        lineageId: 'lineage-seq-1',
      },
      data: {
        generation: 1,
        charterDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        configDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        executorFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        replayFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        maxIterations: 10,
        convergencePolicyVersion: '1.0.0',
      },
    };
    writeFileSync(event1Path, JSON.stringify(event1, null, 2), 'utf8');

    const result1 = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      event1Path,
    ]);
    expect(result1.exitCode).toBe(0);
    expect(result1.json.projectionRefreshed).toBe(true);
    expect(result1.json.projectionError).toBeNull();
    expect((result1.json.receipt as Record<string, unknown>).sequence).toBe(1);

    const event2Path = join(runDir, 'event2.json');
    const event2 = {
      stem: 'deep_research.question_registered',
      scope: {
        runId: 'run-seq-1',
        lineageId: 'lineage-seq-1',
        questionId: 'question-1',
      },
      data: {
        normalizedQuestionDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        dependencyQuestionIds: [],
        requiredSourceClasses: ['academic-paper'],
        disconfirmingQueryRecipeIds: [],
        budgetRef: 'budget-001',
      },
    };
    writeFileSync(event2Path, JSON.stringify(event2, null, 2), 'utf8');

    const result2 = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      event2Path,
    ]);
    expect(result2.exitCode).toBe(0);
    expect(result2.json.projectionRefreshed).toBe(true);
    expect(result2.json.projectionError).toBeNull();
    expect((result2.json.receipt as Record<string, unknown>).sequence).toBe(2);

    const registry = createDeepResearchEventRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory: runDir,
      ledgerId: 'deep-research-ledger',
      auditLedgerId: 'deep-research-audit-ledger',
      authorityProvider: () => ({ state: 'legacy_authoritative', epoch: 1 }),
    }, registry);

    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(2);
    expect(events[0].frame.sequence).toBe(1);
    expect(events[1].frame.sequence).toBe(2);

    // Verify sequential projected rows on disk
    const projectedPath = join(runDir, 'research', 'deep-research-state.jsonl');
    expect(existsSync(projectedPath)).toBe(true);
    const lines = readFileSync(projectedPath, 'utf8').trim().split(/\r?\n/).filter(Boolean);
    expect(lines).toHaveLength(2);
    const row1 = JSON.parse(lines[0]);
    const row2 = JSON.parse(lines[1]);
    expect(row1.type).toBe('config');
    expect(row1.topic).toBe('run-seq-1');
    expect(row2.type).toBe('event');
    expect(row2.event).toBe('question_registered');
    expect(row2.questionId).toBe('question-1');
  });

  describe('projection lands beside the declared state log for every run-directory shape', () => {
    // The CLI hands --run-directory straight through to the gateway as its
    // shadow root. Production callers pass three different kinds of
    // directory: a bare spec folder, the mode's own artifact directory, or
    // one fan-out lineage's private sub-packet under it. The projected
    // legacy file must land beside the state log the caller actually
    // declared in every case, never doubly nested under a second copy of
    // the mode directory.
    const shapes: readonly RunDirectoryShape[] = ['spec-folder', 'artifact-directory', 'lineage-directory'];

    const modes: ReadonlyArray<{
      readonly cliMode: string;
      readonly modeDirName: 'research' | 'review';
      readonly legacyFileName: string;
      readonly sampleEvent: () => Record<string, unknown>;
    }> = [
      {
        cliMode: 'deep-research',
        modeDirName: 'research',
        legacyFileName: 'deep-research-state.jsonl',
        sampleEvent: sampleRunInitializedEvent,
      },
      {
        cliMode: 'deep-review',
        modeDirName: 'review',
        legacyFileName: 'deep-review-state.jsonl',
        sampleEvent: sampleReviewRunInitializedEvent,
      },
    ];

    for (const { cliMode, modeDirName, legacyFileName, sampleEvent } of modes) {
      for (const shape of shapes) {
        it(`${cliMode}: a ${shape} run directory gets exactly one state file at the declared path`, () => {
          const runDir = createShapedRunDir(`shape-${cliMode}-${shape}`, modeDirName, shape);
          const eventJsonPath = join(runDir, 'event.json');
          writeFileSync(eventJsonPath, JSON.stringify(sampleEvent()), 'utf8');

          const result = runCli([
            '--mode',
            cliMode,
            '--run-directory',
            runDir,
            '--event-json',
            eventJsonPath,
          ]);

          expect(result.exitCode).toBe(0);
          expect(result.json.ok).toBe(true);
          expect(result.json.projectionRefreshed).toBe(true);
          expect(result.json.projectionError).toBeNull();

          const expectedPath = shape === 'spec-folder'
            ? join(runDir, modeDirName, legacyFileName)
            : join(runDir, legacyFileName);
          expect(existsSync(expectedPath)).toBe(true);

          // The bug this guards: a contract default sized for the spec-folder
          // shape, applied to a run directory that is already the artifact or
          // lineage root, doubly nests the file instead of landing at the
          // declared path.
          if (shape !== 'spec-folder') {
            expect(existsSync(join(runDir, modeDirName, legacyFileName))).toBe(false);
          }
        });
      }
    }
  });

  it('exits with status 1 when event JSON file does not exist', () => {
    const runDir = createTempDir('missing-file');
    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      join(runDir, 'nonexistent.json'),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.json.ok).toBe(false);
    expect(result.json.code).toBe('INPUT_ERROR');
  });

  // Authority is one durable fact per deployment. These two tests pin the
  // direction it is read from, because a gate aimed at the wrong directory
  // passes every test that only ever supplies one directory.
  it('refuses before any ledger write when the durable authority record is malformed', () => {
    const runDir = createTempDir('authority-denied');
    const authorityRoot = createTempDir('authority-denied-root');
    writeFileSync(join(authorityRoot, 'authority-deep-research.json'), '{ not valid json', 'utf8');

    const eventJsonPath = join(runDir, 'event.json');
    writeFileSync(eventJsonPath, JSON.stringify(sampleRunInitializedEvent()), 'utf8');

    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ], { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot });

    expect(result.exitCode).toBe(2);
    expect(result.json.ok).toBe(false);
    expect(result.json.phase).toBe('authority');
    expect(result.json.code).toBe('AUTHORITY_DENIED');
    // The refusal must precede the write, not follow it.
    expect(existsSync(join(runDir, 'ledger'))).toBe(false);
  });

  it('refuses rather than fabricating a synthetic identity when the cutover binding cannot be resolved', () => {
    // A binding that cannot be resolved must never degrade to a synthetic
    // all-zero-SHA identity: that would let the ledger carry a transition
    // nobody can be held to. Starve the CLI of git entirely so both the
    // run-directory and working-directory resolution attempts fail, and
    // assert the CLI refuses rather than appending under a fabricated actor.
    const runDir = createTempDir('binding-unresolvable');
    const authorityRoot = createTempDir('binding-unresolvable-authority-root');
    const eventJsonPath = join(runDir, 'event.json');
    writeFileSync(eventJsonPath, JSON.stringify(sampleRunInitializedEvent()), 'utf8');

    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ], {
      DEEP_LOOP_AUTHORITY_ROOT: authorityRoot,
      PATH: '/nonexistent-bin-append-mode-event-test',
    });

    expect(result.exitCode).toBe(2);
    expect(result.json.ok).toBe(false);
    expect(result.json.phase).toBe('binding');
    expect(result.json.code).toBe('BINDING_FAILED');
    // The refusal must precede the write, not follow it.
    expect(existsSync(join(runDir, 'ledger'))).toBe(false);
  });

  it('rejects an unrecognized mode by name, rather than blaming a malformed record', () => {
    // The mode adapter runs before the authority-order check, and the adapter's
    // mode set is identical to the frozen authority order. Any mode the adapter
    // accepts is therefore already in the order, so the authority-order branch
    // is structurally unreachable from the CLI: no input can be accepted by the
    // adapter yet rejected by the order. An unknown mode dies at the adapter
    // with the offending name in the reason, which keeps an operator from
    // hunting a corrupt authority file that never existed.
    const runDir = createTempDir('unknown-mode');
    const authorityRoot = createTempDir('unknown-mode-root');
    const eventJsonPath = join(runDir, 'event.json');
    writeFileSync(eventJsonPath, JSON.stringify(sampleRunInitializedEvent()), 'utf8');

    const result = runCli([
      '--mode',
      'deep-nonexistent-mode',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ], { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot });

    expect(result.exitCode).toBe(1);
    expect(result.json.phase).toBe('runtime');
    expect(result.json.code).toBe('RUNTIME_ERROR');
    expect(String(result.json.reason)).toContain('deep-nonexistent-mode');
    expect(String(result.json.reason)).not.toContain('RECORD_MALFORMED');
  });

  it('routes deep-improvement-common past the adapter and authority-order gates', () => {
    // The authority order is the canonical spelling; a private CLI alias that
    // disagrees with it makes a real fleet mode unreachable. This test proves
    // the mode clears both the adapter switch and the frozen-order check, so
    // it is never rejected as 'Unsupported mode' or as outside the authority
    // order.
    const runDir = createTempDir('improvement-common-routable');
    const authorityRoot = createTempDir('improvement-common-root');
    const eventJsonPath = join(runDir, 'event.json');
    writeFileSync(eventJsonPath, JSON.stringify(sampleRunInitializedEvent()), 'utf8');

    const result = runCli([
      '--mode',
      'deep-improvement-common',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ], { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot });

    // Routable means the mode is refused by NEITHER the adapter switch NOR the
    // frozen-order check. Where it is refused after those two gates is a
    // property of that mode's own ledger schema, not of routing, so this test
    // deliberately does not pin it. Asserting a present, non-empty reason first
    // is what gives the two absence checks their force: a missing reason would
    // otherwise satisfy both by containing nothing at all.
    expect(result.exitCode).toBe(1);
    expect(result.json.phase).toBe('runtime');
    expect(typeof result.json.reason).toBe('string');
    expect(String(result.json.reason).length).toBeGreaterThan(0);
    // Must not be rejected as an unsupported mode by the adapter switch.
    expect(String(result.json.reason)).not.toContain('Unsupported mode');
    // Must not be rejected as outside the frozen authority order.
    expect(String(result.json.reason)).not.toContain('not in the frozen authority order');
  });

  it('routes every mode in the frozen authority order through the CLI', () => {
    // The frozen authority order is the canonical mode vocabulary, so every
    // mode it names must be reachable through the canonical write path. A mode
    // the order blesses but the CLI cannot route is unreachable in production:
    // the adapter would refuse it as 'Unsupported mode', or the order check
    // would refuse it as 'not in the frozen authority order'. Iterating the
    // order itself catches either drift at the mode that drifted.
    // A mode is routable when the write either completed or was refused for a
    // reason of its own. The two refusals the guard forbids are the ones that
    // mean the mode never reached its schema at all. A missing reason on the
    // refusal branch is itself a failure, because an absence check over a
    // missing reason passes by containing nothing.
    for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
      const runDir = createTempDir(`order-routable-${mode}`);
      const authorityRoot = createTempDir(`order-routable-${mode}-root`);
      const eventJsonPath = join(runDir, 'event.json');
      writeFileSync(eventJsonPath, JSON.stringify(sampleRunInitializedEvent()), 'utf8');

      const result = runCli([
        '--mode',
        mode,
        '--run-directory',
        runDir,
        '--event-json',
        eventJsonPath,
      ], { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot });

      if (result.json.ok === true) {
        // Routed all the way: the write completed. Nothing further to assert for this mode.
        expect(result.json.ok, `mode '${mode}' routed and completed`).toBe(true);
      } else {
        // Refused after routing: the refusal must be attributable, and it must not be either of
        // the two refusals that mean the mode never routed at all.
        expect(typeof result.json.reason, `mode '${mode}' must report a reason`).toBe('string');
        expect(String(result.json.reason).length, `mode '${mode}' must report a reason`).toBeGreaterThan(0);
        const reason = String(result.json.reason);
        expect(reason, `mode '${mode}' must be routable through the CLI`).not.toContain('Unsupported mode');
        expect(reason, `mode '${mode}' must be routable through the CLI`).not.toContain('not in the frozen authority order');
      }
    }
  });

  it('does not treat the run directory as the authority root', () => {
    // A per-run authority root would let two runs disagree about which writer
    // is canonical. Poison the run directory exactly the way a per-run
    // resolver would read it, and deliberately leave the environment override
    // unset so the default resolution path is the one under test: the append
    // must still succeed, because the run directory is not the root.
    const runDir = createTempDir('runroot-not-authority');
    const decoy = join(runDir, '.opencode', 'skills', '.state', 'authority');
    mkdirSync(decoy, { recursive: true });
    writeFileSync(join(decoy, 'authority-deep-research.json'), '{ not valid json', 'utf8');

    const eventJsonPath = join(runDir, 'event.json');
    writeFileSync(eventJsonPath, JSON.stringify(sampleRunInitializedEvent()), 'utf8');

    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ], { DEEP_LOOP_AUTHORITY_ROOT: '' });

    expect(result.exitCode).toBe(0);
    expect(result.json.ok).toBe(true);
  });
});
