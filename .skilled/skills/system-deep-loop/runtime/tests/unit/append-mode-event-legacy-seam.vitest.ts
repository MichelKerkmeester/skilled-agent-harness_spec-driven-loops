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
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
});
