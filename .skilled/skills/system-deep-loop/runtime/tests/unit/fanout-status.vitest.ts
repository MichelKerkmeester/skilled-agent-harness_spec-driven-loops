// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-out progress rows and the read-only status table
// ───────────────────────────────────────────────────────────────────
// A progress row says how far each lineage has got, so the root ledger alone
// answers "where is this run", and --status prints that view without starting
// or writing anything.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const scriptsDir = resolve(here, '..', '..', 'scripts');
const fanoutRunPath = join(scriptsDir, 'fanout-run.cjs');
const requireCjs = createRequire(import.meta.url);
const { readLineageProgressFields, runLineageProcess, startLineageProgressHeartbeat } = requireCjs(fanoutRunPath) as {
  readLineageProgressFields: (lineageDir: string, liveStdout?: string) => Record<string, unknown>;
  runLineageProcess: (command: string, args: string[], opts: Record<string, unknown>) => Promise<{ stdout: string }>;
  startLineageProgressHeartbeat: (options: {
    cadenceMs: number;
    label: string;
    ledgerPath: string;
    getGauges: () => Record<string, number>;
    getProgress?: () => Record<string, unknown>;
  }) => () => void;
};

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

const T0 = Date.parse('2026-11-20T10:00:00.000Z');
const at = (seconds: number) => new Date(T0 + seconds * 1000).toISOString();

function writeFrame(framesDir: string, sequence: number, stem: string, iteration: number | null, committedAt: string): void {
  const event = {
    occurred_at: committedAt,
    payload: { stem, scope: iteration === null ? {} : { iteration }, data: { findingsCount: 2 } },
  };
  writeFileSync(
    join(framesDir, `${String(sequence).padStart(16, '0')}.frame`),
    JSON.stringify({
      canonical_event_bytes: Buffer.from(JSON.stringify(event)).toString('base64'),
      receipt: { committed_at: committedAt },
    }),
  );
}

function readLedgerRows(ledgerPath: string): Record<string, unknown>[] {
  return readFileSync(ledgerPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
}

describe('progress row fields', () => {
  it('reads iterations, the last commit, node counts and flagged passes from the lineage files', () => {
    const lineageDir = makeTempDir('fanout-status-lineage-');
    const framesDir = join(lineageDir, 'deep-research-ledger', 'frames');
    mkdirSync(framesDir, { recursive: true });
    writeFrame(framesDir, 1, 'deep_research.run_initialized', null, at(0));
    writeFrame(framesDir, 2, 'deep_research.iteration_completed', 1, at(60));
    writeFrame(framesDir, 3, 'deep_research.iteration_completed', 2, at(120));
    writeFileSync(join(lineageDir, 'frontier-nodes.jsonl'), [
      { nodeId: 'F-1-001', status: 'open' },
      { nodeId: 'F-1-002', status: 'open' },
      { nodeId: 'F-1-003', status: 'pruned' },
      { nodeId: 'F-1-001', status: 'answered' },
    ].map((row) => JSON.stringify(row)).join('\n'));
    const liveStdout = [
      { type: 'step_start', timestamp: T0 + 1000, sessionID: 's', part: {} },
      { type: 'tool_use', timestamp: T0 + 11_000, sessionID: 's', part: { tool: 'read', state: { input: {}, time: { start: T0 + 10_000 } } } },
      { type: 'tool_use', timestamp: T0 + 71_000, sessionID: 's', part: { tool: 'read', state: { input: {}, time: { start: T0 + 70_000 } } } },
    ].map((row) => JSON.stringify(row)).join('\n');

    expect(readLineageProgressFields(lineageDir, liveStdout)).toEqual({
      iterations: 2,
      lastCommitAt: at(120),
      nodes: { answered: 1, open: 1, total: 3 },
      flaggedPasses: 0,
    });
    // With no log at all the passes cannot be judged, which is not the same as none flagged.
    expect(readLineageProgressFields(lineageDir)).toMatchObject({ iterations: 2, flaggedPasses: null });
  });

  it('writes the fields on each heartbeat and still beats when they cannot be read', async () => {
    const dir = makeTempDir('fanout-status-heartbeat-');
    const ledgerPath = join(dir, 'orchestration-status.log');
    const fields = { iterations: 3, lastCommitAt: at(90), nodes: { answered: 1, open: 2, total: 3 }, flaggedPasses: 0 };
    const stopGood = startLineageProgressHeartbeat({
      cadenceMs: 5, label: 'good', ledgerPath, getGauges: () => ({ lag: 0 }), getProgress: () => fields,
    });
    const stopTorn = startLineageProgressHeartbeat({
      cadenceMs: 5,
      label: 'torn',
      ledgerPath,
      getGauges: () => ({ lag: 0 }),
      getProgress: () => { throw new Error('torn frame'); },
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 40));
    stopGood();
    stopTorn();

    const rows = readLedgerRows(ledgerPath);
    expect(rows.find((row) => row.label === 'good')).toMatchObject({ event: 'progress', ...fields, gauges: { lag: 0 } });
    const torn = rows.find((row) => row.label === 'torn');
    expect(torn).toMatchObject({ event: 'progress', gauges: { lag: 0 } });
    expect(torn).not.toHaveProperty('iterations');
  });
});

describe('live stdout for the progress row', () => {
  it('hands each stdout chunk to the output callback, so a running attempt can be judged', async () => {
    const chunks: string[] = [];
    const result = await runLineageProcess('sh', ['-c', 'printf "one\\n"; sleep 0.05; printf "two\\n"'], {
      env: process.env,
      timeoutMs: 10_000,
      maxBuffer: 1024 * 1024,
      onOutput: (chunk: unknown) => { if (typeof chunk === 'string') chunks.push(chunk); },
    });
    expect(result.stdout).toBe('one\ntwo\n');
    expect(chunks.join('')).toBe(result.stdout);
  });

  // The cap stops the child and keeps only what fit, so the result must say so: a child
  // that survives the stop and exits 0 would otherwise read as a clean run on cut output.
  it('marks a result whose stdout passed the cap, even when the child exits 0', async () => {
    const script = "trap '' TERM; yes a | head -c 4096; sleep 0.2; exit 0";
    const over = await runLineageProcess('sh', ['-c', script], {
      env: process.env,
      timeoutMs: 10_000,
      maxBuffer: 1024,
    }) as { status: number | null; stdout: string; error?: { code?: string } };
    expect(over.status).toBe(0);
    expect(over.error?.code).toBe('ENOBUFS');
    expect(over.stdout.length).toBeLessThanOrEqual(1024);

    const under = await runLineageProcess('sh', ['-c', 'printf "small\\n"'], {
      env: process.env,
      timeoutMs: 10_000,
      maxBuffer: 1024,
    }) as { error?: unknown };
    expect(under.error).toBeUndefined();
  });

  // The progress row judges the attempt in flight from this copy, so it must hold what
  // the saved log will hold, and must not keep growing for a child that outlives the stop.
  it('hands the callback the kept stdout, which stops at the cap while the child writes on', async () => {
    const script = "trap '' TERM; printf 'head\\n'; sleep 0.1; yes a | head -c 4096; sleep 0.1; printf 'after\\n'; exit 0";
    const chunks: string[] = [];
    const kept: unknown[] = [];
    const result = await runLineageProcess('sh', ['-c', script], {
      env: process.env,
      timeoutMs: 10_000,
      maxBuffer: 1024,
      onOutput: (chunk: unknown, keptStdout: unknown) => {
        if (typeof chunk === 'string') chunks.push(chunk);
        kept.push(keptStdout);
      },
    });
    expect(chunks.join('')).toContain('after\n');
    expect(result.stdout.length).toBeLessThanOrEqual(1024);
    expect(result.stdout).not.toContain('after');
    expect(kept.at(-1)).toBe(result.stdout);
  });
});

function listTree(dir: string): string[] {
  return readdirSync(dir, { recursive: true }).map(String).sort();
}

function runStatus(args: string[]) {
  return spawnSync(process.execPath, [fanoutRunPath, ...args], { encoding: 'utf8', env: { ...process.env } });
}

describe('fanout-run.cjs --status', () => {
  it('prints one row per lineage from the ledger and writes nothing', () => {
    const baseDir = makeTempDir('fanout-status-base-');
    const ledgerPath = join(baseDir, 'orchestration-status.log');
    writeFileSync(ledgerPath, [
      { event: 'started', label: 'deepseek', at: at(0) },
      { event: 'progress', label: 'deepseek', at: at(60), iterations: 4, lastCommitAt: at(55), nodes: { answered: 2, open: 3, total: 5 }, flaggedPasses: 1 },
      { event: 'started', label: 'opus', at: at(0) },
      { event: 'progress', label: 'opus', at: at(61), iterations: 2, lastCommitAt: at(50), nodes: { answered: 1, open: 1, total: 2 }, flaggedPasses: null },
      { event: 'progress', label: 'deepseek', at: at(62), gauges: { lag: 0 } },
      { event: 'containment_git_contention', label: 'deepseek', at: at(63), severity: 'warning' },
      { event: 'started', label: 'cursor', at: at(0) },
    ].map((row) => JSON.stringify(row)).join('\n') + '\n');
    const ledgerBefore = readFileSync(ledgerPath, 'utf8');
    const treeBefore = listTree(baseDir);

    const result = runStatus(['--status', '--base-artifact-dir', baseDir]);

    expect(result.status).toBe(0);
    const lines = result.stdout.trim().split('\n');
    expect(lines[0]).toMatch(/^lineage\s+status\s+iterations\s+last commit\s+nodes answered\/open\/total\s+flagged passes\s+updated$/);
    expect(lines[1].split(/\s{2,}/)).toEqual(['deepseek', 'running', '4', at(55), '2/3/5', '1', at(60)]);
    expect(lines[2].split(/\s{2,}/)).toEqual(['opus', 'running', '2', at(50), '1/1/2', 'unknown', at(61)]);
    expect(lines[3].split(/\s{2,}/)).toEqual(['cursor', 'running', '-', '-', '-', '-', '-']);
    expect(readFileSync(ledgerPath, 'utf8')).toBe(ledgerBefore);
    expect(listTree(baseDir)).toEqual(treeBefore);
  });

  it('refuses a directory with no fan-out ledger and creates nothing there', () => {
    const baseDir = makeTempDir('fanout-status-empty-');

    const result = runStatus(['--status', '--base-artifact-dir', baseDir]);

    expect(result.status).toBe(3);
    expect(result.stdout).toContain('no fan-out status ledger');
    expect(listTree(baseDir)).toEqual([]);
  });
});
