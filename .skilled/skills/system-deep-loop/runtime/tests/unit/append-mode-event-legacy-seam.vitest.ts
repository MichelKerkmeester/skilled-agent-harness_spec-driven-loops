// ┌──────────────────────────────────────────────────────────────────────────┐
// │ MODULE: append-mode-event legacy deep-research upcast seam               │
// │ Each case spawns the real CLI script and asserts its process exit code    │
// │ and stdout JSON, so a pass is a statement about the script itself rather  │
// │ than about a mock of it. Authority is isolated per case via a private     │
// │ DEEP_LOOP_AUTHORITY_ROOT so the default legacy-authoritative admission    │
// │ holds regardless of the host checkout's durable authority state.         │
// └──────────────────────────────────────────────────────────────────────────┘

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const temporaryDirectories: string[] = [];

function createTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `append-mode-event-legacy-${prefix}-`));
  temporaryDirectories.push(dir);
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

// A canonical stem-shaped event that already passes the registry. This is the
// fast path the legacy branch must leave untouched.
function canonicalRunInitializedEvent(): Record<string, unknown> {
  const digest = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return {
    stem: 'deep_research.run_initialized',
    scope: { runId: 'run-canonical-001', lineageId: 'lineage-canonical-001' },
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

// The legacy row shape the workflow's directives actually emit: a flat config
// record with no stem and no event_type. Stable identity (sessionId + lineageId)
// is what makes the upcaster accept it as a run_initialized migration.
function legacyConfigRow(): Record<string, unknown> {
  return {
    type: 'config',
    sessionId: 's1',
    lineageId: 'l1',
    generation: 1,
    executor: 'x',
    maxIterations: 3,
  };
}

function writeEvent(dir: string, payload: Record<string, unknown>): string {
  const path = join(dir, 'event.json');
  writeFileSync(path, JSON.stringify(payload), 'utf8');
  return path;
}

function framesDirectory(runDir: string, ledgerId = 'deep-research-ledger'): string {
  return join(runDir, ledgerId, 'frames');
}

describe('append-mode-event legacy deep-research upcast seam', () => {
  it('a legacy config row that upcasts appends to the deep-research ledger and exits 0', () => {
    const runDir = createTempDir('upcast-ok');
    const authorityRoot = createTempDir('upcast-ok-auth');
    const eventJsonPath = writeEvent(runDir, legacyConfigRow());

    const result = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', eventJsonPath],
      { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot },
    );

    expect(result.exitCode).toBe(0);
    expect(result.json.ok).toBe(true);
    const receipt = result.json.receipt as Record<string, unknown>;
    expect(receipt).toBeDefined();
    expect(receipt.ledgerId).toBe('deep-research-ledger');
    expect(receipt.sequence).toBe(1);
    expect(receipt.eventType).toBe('deep-research.ledger.run-initialized');

    // A lossy migration must be visible, not silent: the upcaster emits a
    // warning because the legacy config carried one digest for both charter
    // and configuration evidence.
    const warnings = result.json.warnings as unknown;
    expect(Array.isArray(warnings)).toBe(true);
    expect((warnings as string[]).length).toBeGreaterThan(0);

    // The append actually landed on disk.
    expect(readdirSync(framesDirectory(runDir)).length).toBeGreaterThan(0);
  });

  it('a legacy row the upcaster refuses exits 1 carrying the decision reason and writes nothing', () => {
    const runDir = createTempDir('upcast-refused');
    const authorityRoot = createTempDir('upcast-refused-auth');
    // A liveness progress row is non-authoritative: the compatibility table
    // returns 'compatible' rather than 'migrate', so the upcaster refuses.
    const eventJsonPath = writeEvent(runDir, {
      type: 'progress',
      sessionId: 's1',
      lineageId: 'l1',
    });

    const result = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', eventJsonPath],
      { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot },
    );

    expect(result.exitCode).toBe(1);
    expect(result.json.ok).toBe(false);
    expect(result.json.code).toBe('RUNTIME_ERROR');
    // The refusal must carry the decision's own reason so the operator can fix
    // the input rather than guess at a bare "refused".
    expect(String(result.json.reason)).toContain('legacy-liveness-record-is-non-authoritative');

    // Nothing was appended: the throw happens before any write is attempted.
    expect(readdirSync(framesDirectory(runDir)).length).toBe(0);
  });

  it('a canonical stem event still appends unchanged with no warnings key', () => {
    const runDir = createTempDir('canonical');
    const authorityRoot = createTempDir('canonical-auth');
    const eventJsonPath = writeEvent(runDir, canonicalRunInitializedEvent());

    const result = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', eventJsonPath],
      { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot },
    );

    expect(result.exitCode).toBe(0);
    expect(result.json.ok).toBe(true);
    const receipt = result.json.receipt as Record<string, unknown>;
    expect(receipt).toBeDefined();
    expect(receipt.sequence).toBe(1);
    expect(result.json.projectionRefreshed).toBe(true);
    // The canonical fast path never touches the legacy upcaster, so no
    // warnings key is added to its output.
    expect(result.json.warnings).toBeUndefined();
  });

  it('a non-research mode given a legacy row exits 1 with the original unrecognized-format message', () => {
    const runDir = createTempDir('non-research');
    const authorityRoot = createTempDir('non-research-auth');
    const eventJsonPath = writeEvent(runDir, legacyConfigRow());

    const result = runCli(
      ['--mode', 'deep-review', '--run-directory', runDir, '--event-json', eventJsonPath],
      { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot },
    );

    // deep-review is in the frozen authority order and admits by default, so
    // the request reaches record resolution. The legacy upcast branch is
    // research-only, so the row falls through to the original final throw.
    expect(result.exitCode).toBe(1);
    expect(result.json.ok).toBe(false);
    expect(result.json.code).toBe('RUNTIME_ERROR');
    expect(String(result.json.reason)).toBe(
      'Unrecognized event format: expected object with stem or event_type',
    );
    // The throw precedes any append, so the deep-review frames dir the ledger
    // constructor created stays empty.
    expect(readdirSync(framesDirectory(runDir, 'deep-review-ledger')).length).toBe(0);
  });

  it('appends run_extended after the run opens and projects an extended row into the state log', () => {
    const runDir = createTempDir('extended');
    const authorityRoot = createTempDir('extended-auth');
    const env = { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };

    const opened = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, canonicalRunInitializedEvent())],
      env,
    );
    expect(opened.exitCode).toBe(0);

    const digest = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const extension = {
      addedIterations: 3, priorMaxIterations: 10, newMaxIterations: 10,
      priorMaxDurationMinutes: 120, newMaxDurationMinutes: 420, elapsedMinutesAtExtension: 300,
    };
    const extended = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, {
        stem: 'deep_research.run_extended',
        scope: { runId: 'run-canonical-001', lineageId: 'lineage-canonical-001' },
        data: {
          priorTailDigest: digest,
          sessionId: 'run-canonical-001',
          generation: 1,
          continuedFromRun: 7,
          extension,
        },
      })],
      env,
    );
    expect(extended.exitCode, extended.stderr + extended.rawStdout).toBe(0);

    const receipt = extended.json.receipt as Record<string, unknown>;
    expect(receipt.sequence).toBe(2);
    expect(receipt.eventType).toBe('deep-research.ledger.run-extended');

    // The projection writes the ledger event back as the legacy state row the
    // dashboards already read, so the continued budget stays visible there.
    const stateLog = readFileSync(join(runDir, 'research', 'deep-research-state.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    const row = stateLog.find((entry) => entry.event === 'extended');
    expect(row).toMatchObject({
      type: 'event',
      event: 'extended',
      lineageMode: 'completed-continue',
      continuedFromRun: 7,
      extension,
    });
  });

  it('upcasts a legacy extended row through the gateway', () => {
    const runDir = createTempDir('extended-legacy');
    const authorityRoot = createTempDir('extended-legacy-auth');
    const env = { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };

    expect(runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, legacyConfigRow())],
      env,
    ).exitCode).toBe(0);

    const result = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, {
        type: 'event',
        event: 'extended',
        sessionId: 's1',
        generation: 1,
        continuedFromRun: 2,
        extension: {
          addedIterations: 1, priorMaxIterations: 3, newMaxIterations: 3,
          priorMaxDurationMinutes: 0, newMaxDurationMinutes: 0, elapsedMinutesAtExtension: 5,
        },
      })],
      env,
    );
    expect(result.exitCode, result.stderr + result.rawStdout).toBe(0);
    expect((result.json.receipt as Record<string, unknown>).eventType)
      .toBe('deep-research.ledger.run-extended');
  });

  it('refuses a legacy extended row whose budget lacks a field instead of guessing the ceiling', () => {
    const runDir = createTempDir('extended-legacy-partial');
    const authorityRoot = createTempDir('extended-legacy-partial-auth');
    const env = { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };

    expect(runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, legacyConfigRow())],
      env,
    ).exitCode).toBe(0);
    const framesBefore = readdirSync(framesDirectory(runDir)).length;

    const result = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, {
        type: 'event',
        event: 'extended',
        sessionId: 's1',
        generation: 1,
        continuedFromRun: 2,
        extension: {
          addedIterations: 1, priorMaxIterations: 3,
          priorMaxDurationMinutes: 0, newMaxDurationMinutes: 0, elapsedMinutesAtExtension: 5,
        },
      })],
      env,
    );
    expect(result.exitCode).toBe(1);
    expect(result.json.ok).toBe(false);
    expect(String(result.json.reason)).toContain('run-extended-budget-missing');
    expect(readdirSync(framesDirectory(runDir)).length).toBe(framesBefore);
  });

  it('carries the leaf dispatch, gate and telemetry fields of a legacy iteration row through the gateway', () => {
    const runDir = createTempDir('iteration-leaf');
    const authorityRoot = createTempDir('iteration-leaf-auth');
    const env = { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };

    expect(runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, canonicalRunInitializedEvent())],
      env,
    ).exitCode).toBe(0);

    // The research leaf writes one flat row per iteration, naming the same run,
    // session and lineage the run-open event scoped so the upcaster admits it as
    // that run's iteration completion. Dispatch, gate and telemetry fields the
    // leaf records are what the state log is read back for.
    const leafIteration = {
      type: 'iteration',
      iteration: 1,
      runId: 'run-canonical-001',
      sessionId: 'run-canonical-001',
      lineageId: 'lineage-canonical-001',
      mode: 'research',
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      run: 1,
      status: 'complete',
      focus: 'trace a leaf iteration record through the append gateway',
      findingsCount: 3,
      newInfoRatio: 0.5,
      noveltyJustification: 'The row names the dispatch target and the sources it queried.',
      keyQuestions: ['does the gateway keep the leaf iteration fields'],
      answeredQuestions: ['does the gateway keep the leaf iteration fields'],
      ruledOut: [],
      focusTrack: 'legacy state-log projection',
      edgeCase: 'none',
      toolsUsed: ['Read'],
      sourcesQueried: ['src/file.ts:42'],
    };

    const appended = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, leafIteration)],
      env,
    );
    expect(appended.exitCode, appended.stderr + appended.rawStdout).toBe(0);

    const stateLog = readFileSync(join(runDir, 'research', 'deep-research-state.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    const row = stateLog.find((entry) => entry.type === 'iteration');
    expect(row, appended.stderr + appended.rawStdout).toBeDefined();
    expect(row).toMatchObject({
      iteration: 1,
      target_agent: 'deep-research',
      agent_definition_loaded: true,
      resolved_route: 'Resolved route: mode=research target_agent=deep-research',
      findingsCount: 3,
      noveltyJustification: 'The row names the dispatch target and the sources it queried.',
      keyQuestions: ['does the gateway keep the leaf iteration fields'],
      focusTrack: 'legacy state-log projection',
      edgeCase: 'none',
      toolsUsed: ['Read'],
      sourcesQueried: ['src/file.ts:42'],
    });
  });

  // The model writes the iteration row, so a stamp it wrote must not set the row
  // time: the gateway clock does, and the stamp survives as a claim in the event.
  it('times a legacy iteration row by the gateway clock and keeps the model stamp as a claim', () => {
    const runDir = createTempDir('iteration-clock');
    const authorityRoot = createTempDir('iteration-clock-auth');
    const env = { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };

    expect(runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, legacyConfigRow())],
      env,
    ).exitCode).toBe(0);

    const before = Date.now();
    const appended = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, {
        type: 'iteration', iteration: 1, sessionId: 's1', lineageId: 'l1', run: 1, status: 'complete',
        newInfoRatio: 0.5, ruledOut: [],
        timestamp: '2099-01-01T00:00:00Z',
        occurredAt: '2098-01-01T00:00:00Z',
        occurred_at: '2097-01-01T00:00:00Z',
      })],
      env,
    );
    const after = Date.now();
    expect(appended.exitCode, appended.stderr + appended.rawStdout).toBe(0);
    // An ordinary iteration migrates without loss, so the output carries no warnings.
    expect(appended.json.warnings).toBeUndefined();

    const frameNames = readdirSync(framesDirectory(runDir)).sort();
    const frame = JSON.parse(readFileSync(join(framesDirectory(runDir), frameNames.at(-1) as string), 'utf8'));
    const event = JSON.parse(Buffer.from(frame.canonical_event_bytes, 'base64').toString('utf8'));
    const occurredAt = Date.parse(event.occurred_at);
    expect(occurredAt).toBeGreaterThanOrEqual(before);
    expect(occurredAt).toBeLessThanOrEqual(after);
    expect(event.payload.data.claimedTimestamp).toBe('2099-01-01T00:00:00Z');

    const stateLog = readFileSync(join(runDir, 'research', 'deep-research-state.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    const row = stateLog.find((entry) => entry.type === 'iteration');
    expect(row.timestamp).toBe(event.occurred_at);
    expect(row.claimedTimestamp).toBe('2099-01-01T00:00:00Z');
  });

  // The completed-iteration override must not reach the rows that keep their own
  // time: a lifecycle row written by the workflow still keeps its timestamp.
  it('still keeps a legacy reducer-read row\'s own timestamp as the event time', () => {
    const runDir = createTempDir('row-clock');
    const authorityRoot = createTempDir('row-clock-auth');
    const env = { DEEP_LOOP_AUTHORITY_ROOT: authorityRoot };

    expect(runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, legacyConfigRow())],
      env,
    ).exitCode).toBe(0);

    const appended = runCli(
      ['--mode', 'deep-research', '--run-directory', runDir, '--event-json', writeEvent(runDir, {
        type: 'event', event: 'userPaused', mode: 'research', run: 1, stopReason: 'userPaused',
        sentinelPath: 'research/.deep-research-pause',
        sessionId: 's1', generation: 1, timestamp: '2026-05-24T03:04:05Z',
      })],
      env,
    );
    expect(appended.exitCode, appended.stderr + appended.rawStdout).toBe(0);
    const stateLog = readFileSync(join(runDir, 'research', 'deep-research-state.jsonl'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    expect(stateLog.at(-1).timestamp).toBe('2026-05-24T03:04:05Z');
  });
});
