// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Statistics Persistence Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  commitStatsUpdate,
  prepareStatsUpdate,
  readStatsFile,
  StatsUnreadableError,
  updateStatsForSession,
} from '../extensions/deeppi/stats.js';

import type { DeepPiModelId } from '../extensions/deeppi/eligibility.js';
import type { DeepPiStatsDocument } from '../extensions/deeppi/stats.js';
import type { ModelTotals } from '../extensions/deeppi/telemetry.js';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS AND SETUP
// ───────────────────────────────────────────────────────────────────

let testRoot = '';

function totals(overrides: Partial<ModelTotals> = {}): ModelTotals {
  return {
    responses: 0,
    hitTokens: 0,
    missTokens: 0,
    cacheWriteTokens: 0,
    actualInputCost: 0,
    noCacheCounterfactualSavings: 0,
    ...overrides,
  };
}

function byModel(
  flash: Partial<ModelTotals> = {},
  pro: Partial<ModelTotals> = {},
): Record<DeepPiModelId, ModelTotals> {
  return {
    'deepseek-v4-flash': totals(flash),
    'deepseek-v4-pro': totals(pro),
  };
}

function statsPath(): string {
  return join(testRoot, 'deep-pi-stats.json');
}

function requireDocument(result: Awaited<ReturnType<typeof readStatsFile>>): DeepPiStatsDocument {
  if (result.status !== 'ok') throw new Error(`expected readable stats, got ${result.status}`);
  return result.document;
}

const testsDir = dirname(fileURLToPath(import.meta.url));

function runWorker(scriptName: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(testsDir, scriptName), ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} ${args.join(' ')} exited ${code}\n${stderr}`));
    });
  });
}

beforeEach(async () => {
  testRoot = await mkdtemp(join(tmpdir(), 'deep-pi-stats-'));
});

afterEach(async () => {
  await rm(testRoot, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('versioned session and daily persistence', () => {
  it('replaces a session snapshot and rebuilds cumulative UTC-day totals', async () => {
    const path = statsPath();
    await updateStatsForSession(
      path,
      'session-a',
      byModel({
        responses: 1,
        hitTokens: 100,
        missTokens: 50,
        cacheWriteTokens: 20,
        actualInputCost: 0.1,
      }),
      new Date('2026-08-08T10:00:00Z'),
    );
    await updateStatsForSession(
      path,
      'session-a',
      byModel({
        responses: 2,
        hitTokens: 200,
        missTokens: 75,
        cacheWriteTokens: 30,
        actualInputCost: 0.2,
      }),
      new Date('2026-08-08T10:05:00Z'),
    );
    await updateStatsForSession(
      path,
      'session-b',
      byModel({}, { responses: 1, hitTokens: 40, missTokens: 60, actualInputCost: 0.3 }),
      new Date('2026-08-08T12:00:00Z'),
    );

    const document = requireDocument(await readStatsFile(path));
    expect(document.schemaVersion).toBe(1);
    expect(Object.keys(document.sessions)).toEqual(['session-a', 'session-b']);
    expect(document.sessions['session-a']?.byModel['deepseek-v4-flash'].responses).toBe(2);
    expect(document.daily['2026-08-08']?.sessionCount).toBe(2);
    expect(document.daily['2026-08-08']?.byModel['deepseek-v4-flash'].cacheWriteTokens).toBe(30);
    expect(document.daily['2026-08-08']?.byModel['deepseek-v4-pro'].responses).toBe(1);
  });
});

describe('unreadable files', () => {
  it('returns unreadable for corrupt JSON and never replaces it with empty data', async () => {
    const path = statsPath();
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, '{not-json', { mode: 0o600 });

    const result = await readStatsFile(path);
    expect(result.status).toBe('unreadable');
    if (result.status !== 'unreadable') throw new Error('expected corrupt stats to be unreadable');
    expect(result.reason).toBe('corrupt');
    await expect(updateStatsForSession(path, 'session-a', byModel())).rejects.toBeInstanceOf(
      StatsUnreadableError,
    );
    expect(await readFile(path, 'utf8')).toBe('{not-json');
  });

  it('returns unreadable for an unknown future schema version', async () => {
    const path = statsPath();
    await mkdir(dirname(path), { recursive: true });
    const future = JSON.stringify({ schemaVersion: 99, sessions: {}, daily: {} });
    await writeFile(path, future, { mode: 0o600 });

    const result = await readStatsFile(path);
    expect(result.status).toBe('unreadable');
    if (result.status !== 'unreadable') throw new Error('expected future stats to be unreadable');
    expect(result.reason).toBe('unsupported-version');
    await expect(updateStatsForSession(path, 'session-a', byModel())).rejects.toBeInstanceOf(
      StatsUnreadableError,
    );
    expect(await readFile(path, 'utf8')).toBe(future);
  });
});

describe('compare-and-swap writes', () => {
  it('rejects one of two prepared concurrent writers', async () => {
    const path = statsPath();
    await updateStatsForSession(path, 'seed', byModel(), new Date('2026-08-08T09:00:00Z'));
    const first = await prepareStatsUpdate(
      path,
      'session-a',
      byModel({ responses: 1 }),
      new Date('2026-08-08T09:01:00Z'),
    );
    const second = await prepareStatsUpdate(
      path,
      'session-b',
      byModel({}, { responses: 1 }),
      new Date('2026-08-08T09:02:00Z'),
    );

    const results = await Promise.allSettled([commitStatsUpdate(first), commitStatsUpdate(second)]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1);
    const document = requireDocument(await readStatsFile(path));
    expect(Object.keys(document.sessions)).toHaveLength(2);
  });
});

describe('cross-process mutual exclusion', () => {
  // The in-process CAS test above shares one Node event loop.
  // It does not exercise two separate `updateStatsForSession` callers racing the same stats file.
  // This test spawns two workers in independent OS processes.
  // The workers hold `withCrossProcessLock` and their critical sections must not interleave.
  // Fixed hold times make the check deterministic.
  it('serializes two real OS processes holding the same lock', async () => {
    const logPath = join(testRoot, 'lock-race.log');
    await Promise.all([
      runWorker('cross-process-lock-worker.mjs', [logPath, 'worker-a', '150']),
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        await runWorker('cross-process-lock-worker.mjs', [logPath, 'worker-b', '150']);
      })(),
    ]);

    const lines = (await readFile(logPath, 'utf8')).trim().split('\n');
    const events = lines.map((line) => {
      const [worker, phase, timestamp] = line.split(' ');
      return { worker, phase, timestamp: Number(timestamp) };
    });
    expect(events).toHaveLength(4);

    const byWorker = new Map<string, { start: number; end: number }>();
    for (const event of events) {
      const entry = byWorker.get(event.worker) ?? { start: 0, end: 0 };
      if (event.phase === 'start') entry.start = event.timestamp;
      else entry.end = event.timestamp;
      byWorker.set(event.worker, entry);
    }
    const [a, b] = [...byWorker.values()];
    // One worker's whole [start, end] interval must fully precede the other's.
    // This is the actual definition of mutual exclusion, not just paired counts.
    const disjoint = a.end <= b.start || b.end <= a.start;
    expect(disjoint).toBe(true);
  });

  it('keeps every session recorded when two real OS processes race the same stats file', async () => {
    const path = statsPath();
    await Promise.all([
      runWorker('cross-process-stats-worker.mjs', [path, 'proc-session-a', '3']),
      runWorker('cross-process-stats-worker.mjs', [path, 'proc-session-b', '5']),
    ]);

    const document = requireDocument(await readStatsFile(path));
    expect(Object.keys(document.sessions).sort()).toEqual(['proc-session-a', 'proc-session-b']);
  });
});
