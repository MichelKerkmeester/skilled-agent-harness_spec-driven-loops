// ───────────────────────────────────────────────────────────────────
// MODULE: Single-Loop Heartbeat Command Tests
// ───────────────────────────────────────────────────────────────────
//
// The heartbeat body moved out of the research workflow into one script, so
// these tests pin the two promises a workflow step depends on: a call with no
// phase is a usage error, and repeating the same start writes one ledger row
// rather than a duplicate.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_PATH = resolve(runtimeRoot, 'scripts', 'loop-heartbeat.cjs');
const TIMESTAMP = '2026-11-14T00:00:00.000Z';
const SESSION_ID = 'session-heartbeat-fixture';
const GENERATION = '1';

type Fixture = {
  configPath: string;
  statusLedgerPath: string;
  packetDir: string;
};

type CommandResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
};

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (!dir) continue;
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // A leaked temp directory is cleanup noise, not a test result.
    }
  }
});

function createFixture(prefix: string): Fixture {
  const root = mkdtempSync(join(tmpdir(), `loop-heartbeat-${prefix}-`));
  temporaryDirectories.push(root);

  const packetDir = join(root, 'packet');
  mkdirSync(packetDir, { recursive: true });

  const configPath = join(root, 'deep-research-config.json');
  writeFileSync(
    configPath,
    `${JSON.stringify({ lineage: { sessionId: SESSION_ID, generation: Number(GENERATION) } }, null, 2)}\n`,
    'utf8',
  );

  return {
    configPath,
    statusLedgerPath: join(packetDir, 'deep-research-status.jsonl'),
    packetDir,
  };
}

function startedArgs(fixture: Fixture): string[] {
  return [
    '--phase', 'started',
    '--config', fixture.configPath,
    '--status-ledger', fixture.statusLedgerPath,
    '--packet-dir', fixture.packetDir,
    '--timestamp', TIMESTAMP,
    '--session-id', SESSION_ID,
    '--execution-mode', 'auto',
  ];
}

function runHeartbeat(args: string[]): CommandResult {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    cwd: runtimeRoot,
    encoding: 'utf8',
  });

  return { exitCode: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function readLedgerRows(fixture: Fixture): Array<Record<string, unknown>> {
  return readFileSync(fixture.statusLedgerPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('loop-heartbeat.cjs', () => {
  it('exits 64 with a usage line naming --phase when run without arguments', () => {
    const result = runHeartbeat([]);

    expect(result.exitCode).toBe(64);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('--phase');
  });

  it('writes one started row for the research loop', () => {
    const fixture = createFixture('started');

    const result = runHeartbeat(startedArgs(fixture));

    expect(result.exitCode, result.stderr).toBe(0);
    const rows = readLedgerRows(fixture);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.event).toBe('started');
    expect(rows[0]?.loop_type).toBe('research');
  });

  it('keeps one row when the same started call runs twice', () => {
    const fixture = createFixture('repeat');
    const args = startedArgs(fixture);

    const first = runHeartbeat(args);
    const second = runHeartbeat(args);

    expect(first.exitCode, first.stderr).toBe(0);
    expect(second.exitCode, second.stderr).toBe(0);
    expect(readLedgerRows(fixture)).toHaveLength(1);
  });

  it('accepts an empty stop reason and still writes the completed terminal row', () => {
    const fixture = createFixture('terminal-empty-reason');

    const result = runHeartbeat([
      '--phase', 'terminal',
      '--config', fixture.configPath,
      '--state-log', join(fixture.packetDir, 'deep-research-state.jsonl'),
      '--status-ledger', fixture.statusLedgerPath,
      '--packet-dir', fixture.packetDir,
      '--timestamp', TIMESTAMP,
      '--session-id', SESSION_ID,
      '--generation', GENERATION,
      '--reason', '',
      '--execution-mode', 'auto',
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const rows = readLedgerRows(fixture);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.event).toBe('completed');
  });
});
