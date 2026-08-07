import { afterEach, describe, expect, it, vi } from 'vitest';

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

import {
  appendJsonlIfChangedAtomic,
  computeIntegrityHash,
  createDeferredAtomicWriter,
  stampIntegrity,
  verifyIntegrity,
  writeStateAtomic,
  writeStateIfChangedAtomic,
} from '../../lib/deep-loop/atomic-state.js';
import { processAlive } from '../../lib/deep-loop/loop-lock.js';
import { createHermeticEnv, runtimeRoot, type HermeticEnv } from '../helpers/spawn-cjs';

/**
 * Finds a known-dead PID to use as a stale lock owner.
 */
function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid for atomic-state test');
}

const hermeticEnvs: HermeticEnv[] = [];

function withHermeticState<T>(testId: string, run: (statePath: string, tempDir: string) => T): T {
  const hermetic = createHermeticEnv(testId);
  hermeticEnvs.push(hermetic);
  return run(join(hermetic.tmpDir, 'state.json'), hermetic.tmpDir);
}

/**
 * Returns temporary sibling files matching the atomic-state naming convention.
 */
function tempSiblings(path: string): string[] {
  const prefix = `${basename(path)}.tmp.`;
  return readdirSync(dirname(path)).filter((entry) => entry.startsWith(prefix));
}

interface StatusLedgerRow {
  event: string;
  label: string;
  gauges: Record<string, unknown>;
  duration_ms?: number;
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseStatusLedgerRow(line: string): StatusLedgerRow {
  const parsed = JSON.parse(line) as unknown;
  if (!isJsonRecord(parsed)) {
    throw new TypeError('Status ledger row must be an object.');
  }
  if (typeof parsed.event !== 'string' || typeof parsed.label !== 'string') {
    throw new TypeError('Status ledger row must include event and label.');
  }
  if (!isJsonRecord(parsed.gauges)) {
    throw new TypeError('Status ledger row must include gauges.');
  }
  if (parsed.duration_ms !== undefined && typeof parsed.duration_ms !== 'number') {
    throw new TypeError('Status ledger row duration must be numeric.');
  }
  return parsed as unknown as StatusLedgerRow;
}

interface ChildResult {
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

function writeConcurrentAppendWriter(tempDir: string): string {
  const writerPath = join(tempDir, 'append-writer.mjs');
  writeFileSync(
    writerPath,
    [
      "import fs from 'node:fs';",
      "import { syncBuiltinESMExports } from 'node:module';",
      '',
      'const [, , atomicModulePath, ledgerPath, controlDir, writer, rawValue] = process.argv;',
      'const originalWriteFileSync = fs.writeFileSync.bind(fs);',
      'const waitBuffer = new SharedArrayBuffer(4);',
      'const waitView = new Int32Array(waitBuffer);',
      'function waitBriefly() {',
      '  Atomics.wait(waitView, 0, 0, 10);',
      '}',
      'function waitForFile(path) {',
      '  const deadline = Date.now() + 5000;',
      '  while (!fs.existsSync(path)) {',
      '    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${path}`);',
      '    waitBriefly();',
      '  }',
      '}',
      'fs.writeFileSync = (...args) => {',
      '  const [target] = args;',
      "  if (typeof target === 'string' && target.startsWith(ledgerPath) && target.includes('.tmp.')) {",
      "    originalWriteFileSync(`${controlDir}/${writer}.waiting`, 'ready', 'utf8');",
      "    waitForFile(`${controlDir}/release`);",
      '  }',
      '  return originalWriteFileSync(...args);',
      '};',
      'syncBuiltinESMExports();',
      '',
      'const { appendJsonlIfChangedAtomic } = await import(atomicModulePath);',
      "originalWriteFileSync(`${controlDir}/${writer}.ready`, 'ready', 'utf8');",
      "waitForFile(`${controlDir}/start`);",
      'const value = Number(rawValue);',
      'appendJsonlIfChangedAtomic(',
      '  ledgerPath,',
      '  { writer, value },',
      "  { diffField: 'state_hash', diffData: { writer, value }, cache: new Map() },",
      ');',
      "originalWriteFileSync(`${controlDir}/${writer}.done`, 'done', 'utf8');",
    ].join('\n'),
    'utf8',
  );
  return writerPath;
}

function spawnAppendWriter(
  writerPath: string,
  atomicModulePath: string,
  ledgerPath: string,
  controlDir: string,
  writer: string,
  value: number,
): Promise<ChildResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', writerPath, atomicModulePath, ledgerPath, controlDir, writer, String(value)],
      { cwd: runtimeRoot, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolvePromise({ exitCode, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

async function releaseConcurrentAppendWriters(controlDir: string, writers: readonly string[]): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < 5_000) {
    if (writers.every((writer) => existsSync(join(controlDir, `${writer}.waiting`)))) {
      writeFileSync(join(controlDir, 'release'), 'release', 'utf8');
      return;
    }

    if (writers.every((writer) => existsSync(join(controlDir, `${writer}.done`)))) {
      return;
    }

    await sleep(10);
  }

  throw new Error('Timed out waiting for concurrent append writers.');
}

interface DedupWriterResult extends ChildResult {
  readonly appended: boolean | null;
}

/**
 * Writes a child script that pauses right after it wins the append-lock
 * acquisition, so the test can prove a second writer is genuinely blocked
 * out rather than racing the diff-gate check in memory.
 */
function writeLockHoldingAppendWriter(tempDir: string): string {
  const writerPath = join(tempDir, 'append-holder.mjs');
  writeFileSync(
    writerPath,
    [
      "import fs from 'node:fs';",
      "import { syncBuiltinESMExports } from 'node:module';",
      '',
      'const [, , atomicModulePath, ledgerPath, controlDir] = process.argv;',
      'const originalOpenSync = fs.openSync.bind(fs);',
      'const originalFsyncSync = fs.fsyncSync.bind(fs);',
      'const originalWriteFileSync = fs.writeFileSync.bind(fs);',
      'const waitBuffer = new SharedArrayBuffer(4);',
      'const waitView = new Int32Array(waitBuffer);',
      'function waitBriefly() {',
      '  Atomics.wait(waitView, 0, 0, 5);',
      '}',
      'function waitForFile(path) {',
      '  const deadline = Date.now() + 5000;',
      '  while (!fs.existsSync(path)) {',
      '    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${path}`);',
      '    waitBriefly();',
      '  }',
      '}',
      'let lockFd = null;',
      'let paused = false;',
      'fs.openSync = (...args) => {',
      '  const [target, flags] = args;',
      '  const fd = originalOpenSync(...args);',
      "  if (typeof target === 'string' && target.endsWith('.lock') && flags === 'wx') {",
      '    lockFd = fd;',
      '  }',
      '  return fd;',
      '};',
      'fs.fsyncSync = (fd) => {',
      '  originalFsyncSync(fd);',
      '  if (!paused && fd === lockFd) {',
      '    paused = true;',
      "    originalWriteFileSync(`${controlDir}/holder.holding`, 'holding', 'utf8');",
      "    waitForFile(`${controlDir}/release`);",
      '  }',
      '};',
      'syncBuiltinESMExports();',
      '',
      'const { appendJsonlIfChangedAtomic } = await import(atomicModulePath);',
      "originalWriteFileSync(`${controlDir}/holder.ready`, 'ready', 'utf8');",
      "waitForFile(`${controlDir}/start`);",
      'const appended = appendJsonlIfChangedAtomic(',
      '  ledgerPath,',
      "  { tag: 'dup', value: 1 },",
      "  { diffField: 'state_hash', diffData: { tag: 'dup', value: 1 }, cache: new Map() },",
      ');',
      "originalWriteFileSync(`${controlDir}/holder.done`, JSON.stringify({ appended }), 'utf8');",
    ].join('\n'),
    'utf8',
  );
  return writerPath;
}

/**
 * Writes a plain contender script with no synchronization hooks of its own;
 * it relies entirely on the append lock to serialize against the holder.
 */
function writeContenderAppendWriter(tempDir: string): string {
  const writerPath = join(tempDir, 'append-waiter.mjs');
  writeFileSync(
    writerPath,
    [
      "import fs from 'node:fs';",
      '',
      'const [, , atomicModulePath, ledgerPath, controlDir] = process.argv;',
      'const waitBuffer = new SharedArrayBuffer(4);',
      'const waitView = new Int32Array(waitBuffer);',
      'function waitBriefly() {',
      '  Atomics.wait(waitView, 0, 0, 5);',
      '}',
      'function waitForFile(path) {',
      '  const deadline = Date.now() + 5000;',
      '  while (!fs.existsSync(path)) {',
      '    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${path}`);',
      '    waitBriefly();',
      '  }',
      '}',
      '',
      'const { appendJsonlIfChangedAtomic } = await import(atomicModulePath);',
      "fs.writeFileSync(`${controlDir}/waiter.ready`, 'ready', 'utf8');",
      "waitForFile(`${controlDir}/start`);",
      'const appended = appendJsonlIfChangedAtomic(',
      '  ledgerPath,',
      "  { tag: 'dup', value: 1 },",
      "  { diffField: 'state_hash', diffData: { tag: 'dup', value: 1 }, cache: new Map() },",
      ');',
      "fs.writeFileSync(`${controlDir}/waiter.done`, JSON.stringify({ appended }), 'utf8');",
    ].join('\n'),
    'utf8',
  );
  return writerPath;
}

function spawnDedupChild(
  writerPath: string,
  atomicModulePath: string,
  ledgerPath: string,
  controlDir: string,
): Promise<DedupWriterResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      ['--import', 'tsx', writerPath, atomicModulePath, ledgerPath, controlDir],
      { cwd: runtimeRoot, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolvePromise({ exitCode, stdout: stdout.trim(), stderr: stderr.trim(), appended: null });
    });
  });
}

function readDoneMarker(controlDir: string, name: string): boolean {
  return (JSON.parse(readFileSync(join(controlDir, name), 'utf8')) as { appended: boolean }).appended;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();

  while (hermeticEnvs.length > 0) {
    hermeticEnvs.pop()?.cleanup();
  }
});

describe('atomic-state', () => {
  it('writes JSON state through an atomic replacement path', () => {
    withHermeticState('atomic-write', (statePath) => {
      writeStateAtomic(statePath, { status: 'started', iteration: 1 });

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'started', iteration: 1 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('replaces an existing state file without leaving torn JSON', () => {
    withHermeticState('atomic-replace', (statePath) => {
      writeStateAtomic(statePath, { status: 'old', iteration: 1 });
      writeStateAtomic(statePath, { status: 'new', iteration: 2 });

      const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
      expect(parsed).toEqual({ status: 'new', iteration: 2 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('cleans up the temp file when rename cannot replace a directory target', () => {
    withHermeticState('atomic-cleanup', (statePath) => {
      mkdirSync(statePath);

      expect(() => writeStateAtomic(statePath, { status: 'new' })).toThrow();
      expect(existsSync(statePath)).toBe(true);
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('rejects non-representable top-level state without creating a file', () => {
    withHermeticState('atomic-invalid-undefined', (statePath) => {
      expect(() => writeStateAtomic(statePath, undefined)).toThrow(TypeError);
      expect(existsSync(statePath)).toBe(false);
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('rejects non-representable top-level state without replacing the prior file', () => {
    withHermeticState('atomic-invalid-function', (statePath) => {
      writeStateAtomic(statePath, { status: 'valid' });
      const before = readFileSync(statePath, 'utf8');

      expect(() => writeStateAtomic(statePath, () => 'invalid')).toThrow(TypeError);
      expect(readFileSync(statePath, 'utf8')).toBe(before);
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('writes state only when the serialized payload changes', () => {
    withHermeticState('atomic-if-changed', (statePath) => {
      const cache = new Map<string, string>();

      const firstWrite = writeStateIfChangedAtomic(statePath, { status: 'started', iteration: 1 }, cache);
      const firstMtime = statSync(statePath).mtimeMs;

      expect(firstWrite).toBe(true);
      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'started', iteration: 1 });

      const secondWrite = writeStateIfChangedAtomic(statePath, { status: 'started', iteration: 1 }, cache);
      const secondMtime = statSync(statePath).mtimeMs;

      expect(secondWrite).toBe(false);
      expect(secondMtime).toBe(firstMtime);

      const thirdWrite = writeStateIfChangedAtomic(statePath, { status: 'finished', iteration: 2 }, cache);

      expect(thirdWrite).toBe(true);
      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({ status: 'finished', iteration: 2 });
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('writes single-loop telemetry rows through the shared ledger shape and skips unchanged state', () => {
    withHermeticState('telemetry-if-changed', (_statePath, tempDir) => {
      const ledgerPath = join(tempDir, 'orchestration-status.log');
      const diffData = {
        event: 'progress',
        label: 'single',
        sessionId: 'session-1',
        run: 1,
        status: 'insight',
        gauges: { iterations: 1, score: 0.5 },
      };
      const firstRow = {
        ...diffData,
        at: '2026-06-28T00:00:00.000Z',
        duration_ms: 100,
        gauges: { iterations: 1, elapsed_ms: 100, score: 0.5 },
      };
      const secondRow = {
        ...firstRow,
        at: '2026-06-28T00:00:05.000Z',
        duration_ms: 5_100,
        gauges: { iterations: 1, elapsed_ms: 5_100, score: 0.5 },
      };
      const changedRow = {
        ...secondRow,
        run: 2,
        duration_ms: 6_000,
        gauges: { iterations: 2, elapsed_ms: 6_000, score: 0.65 },
      };

      expect(appendJsonlIfChangedAtomic(ledgerPath, firstRow, {
        diffData,
        diffField: 'state_hash',
        cache: new Map<string, string>(),
      })).toBe(true);
      expect(appendJsonlIfChangedAtomic(ledgerPath, secondRow, {
        diffData,
        diffField: 'state_hash',
        cache: new Map<string, string>(),
      })).toBe(false);
      expect(appendJsonlIfChangedAtomic(ledgerPath, changedRow, {
        diffData: {
          ...diffData,
          run: 2,
          gauges: { iterations: 2, score: 0.65 },
        },
        diffField: 'state_hash',
        cache: new Map<string, string>(),
      })).toBe(true);

      const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n');
      const singleRows = lines.map(parseStatusLedgerRow);
      const fanoutRow = parseStatusLedgerRow(JSON.stringify({
        event: 'progress',
        label: 'slow',
        duration_ms: 250,
        gauges: { lag: 1, pending: 0, failed: 0 },
      }));

      expect(lines).toHaveLength(2);
      expect(singleRows[0]).toMatchObject({
        event: 'progress',
        label: 'single',
        duration_ms: 100,
        gauges: { iterations: 1, elapsed_ms: 100, score: 0.5 },
      });
      expect(JSON.parse(lines[0]) as Record<string, unknown>).toEqual(expect.objectContaining({
        state_hash: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
      }));
      expect(fanoutRow).toMatchObject({
        event: 'progress',
        label: 'slow',
        gauges: { lag: 1, pending: 0, failed: 0 },
      });
      expect(tempSiblings(ledgerPath)).toEqual([]);
    });
  });

  it('preserves both rows from concurrent diff-gated appends', async () => {
    await withHermeticState('jsonl-concurrent-append', async (_statePath, tempDir) => {
      const ledgerPath = join(tempDir, 'orchestration-status.log');
      const controlDir = join(tempDir, 'control');
      const writerPath = writeConcurrentAppendWriter(tempDir);
      const atomicModulePath = join(runtimeRoot, 'lib', 'deep-loop', 'atomic-state.ts');
      mkdirSync(controlDir, { recursive: true });

      const writers = ['left', 'right'] as const;
      const left = spawnAppendWriter(writerPath, atomicModulePath, ledgerPath, controlDir, 'left', 1);
      const right = spawnAppendWriter(writerPath, atomicModulePath, ledgerPath, controlDir, 'right', 2);

      while (!writers.every((writer) => existsSync(join(controlDir, `${writer}.ready`)))) {
        await sleep(10);
      }

      writeFileSync(join(controlDir, 'start'), 'start', 'utf8');
      await releaseConcurrentAppendWriters(controlDir, writers);

      const results = await Promise.all([left, right]);
      expect(results).toEqual([
        expect.objectContaining({ exitCode: 0, stderr: '' }),
        expect.objectContaining({ exitCode: 0, stderr: '' }),
      ]);

      const rows = readFileSync(ledgerPath, 'utf8')
        .trimEnd()
        .split('\n')
        .map((line) => JSON.parse(line) as Record<string, unknown>);

      expect(rows.map((row) => row.writer).sort()).toEqual(['left', 'right']);
      expect(rows).toHaveLength(2);
      expect(readFileSync(ledgerPath, 'utf8').endsWith('\n')).toBe(true);
    });
  });

  it('serializes identical concurrent diff-gated appends so exactly one row lands', async () => {
    await withHermeticState('jsonl-dedup-race', async (_statePath, tempDir) => {
      const ledgerPath = join(tempDir, 'dedup-status.log');
      const controlDir = join(tempDir, 'control');
      mkdirSync(controlDir, { recursive: true });
      const atomicModulePath = join(runtimeRoot, 'lib', 'deep-loop', 'atomic-state.ts');

      const holderPath = writeLockHoldingAppendWriter(tempDir);
      const waiterPath = writeContenderAppendWriter(tempDir);

      const holder = spawnDedupChild(holderPath, atomicModulePath, ledgerPath, controlDir);
      while (!existsSync(join(controlDir, 'holder.ready'))) await sleep(10);
      writeFileSync(join(controlDir, 'start'), 'start', 'utf8');
      while (!existsSync(join(controlDir, 'holder.holding'))) await sleep(10);

      // The holder now owns the append lock. Start a contender and give it
      // time to hit EEXIST and enter its retry loop before releasing.
      const waiter = spawnDedupChild(waiterPath, atomicModulePath, ledgerPath, controlDir);
      while (!existsSync(join(controlDir, 'waiter.ready'))) await sleep(10);
      await sleep(150);
      expect(existsSync(join(controlDir, 'waiter.done'))).toBe(false);

      writeFileSync(join(controlDir, 'release'), 'release', 'utf8');
      const results = await Promise.all([holder, waiter]);

      expect(results).toEqual([
        expect.objectContaining({ exitCode: 0, stderr: '' }),
        expect.objectContaining({ exitCode: 0, stderr: '' }),
      ]);

      const holderAppended = readDoneMarker(controlDir, 'holder.done');
      const waiterAppended = readDoneMarker(controlDir, 'waiter.done');
      expect([holderAppended, waiterAppended].filter(Boolean)).toHaveLength(1);

      const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n');
      expect(lines).toHaveLength(1);
      expect(JSON.parse(lines[0])).toMatchObject({ tag: 'dup', value: 1 });
    });
  });

  it('reclaims an append lock abandoned by a dead process', () => {
    withHermeticState('append-lock-dead-reclaim', (_statePath, tempDir) => {
      const ledgerPath = join(tempDir, 'reclaim-status.log');
      mkdirSync(tempDir, { recursive: true });
      writeFileSync(`${ledgerPath}.lock`, JSON.stringify({
        pid: knownDeadPid(),
        nonce: 'stale-nonce',
        acquiredAtIso: '2020-01-01T00:00:00.000Z',
      }), 'utf8');

      const appended = appendJsonlIfChangedAtomic(ledgerPath, { tag: 'after-dead-owner' }, {
        cache: new Map(),
      });

      expect(appended).toBe(true);
      expect(existsSync(`${ledgerPath}.lock`)).toBe(false);
      expect(readFileSync(ledgerPath, 'utf8').trim().split('\n')).toHaveLength(1);
    });
  });

  it('does not reclaim an append lock owned by a live process just because it looks old', () => {
    withHermeticState('append-lock-live-owner', (_statePath, tempDir) => {
      const ledgerPath = join(tempDir, 'live-owner-status.log');
      mkdirSync(tempDir, { recursive: true });
      writeFileSync(`${ledgerPath}.lock`, JSON.stringify({
        pid: process.pid,
        nonce: 'still-live',
        acquiredAtIso: '1970-01-01T00:00:00.000Z',
      }), 'utf8');

      expect(() => appendJsonlIfChangedAtomic(ledgerPath, { tag: 'blocked' }, {
        cache: new Map(),
      })).toThrow(/Timed out acquiring append lock/);
      expect(existsSync(ledgerPath)).toBe(false);
    });
  }, 10_000);

  it('stamps and verifies object state integrity', () => {
    withHermeticState('integrity-roundtrip', (statePath) => {
      const stamped = stampIntegrity({
        status: 'started',
        iteration: 1,
        registry: { beta: true, alpha: true },
      });

      writeStateAtomic(statePath, stamped);

      const parsed = JSON.parse(readFileSync(statePath, 'utf8'));
      expect(parsed._integrity).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(parsed._integrity).toBe(computeIntegrityHash(parsed));
      expect(computeIntegrityHash({ beta: true, alpha: true })).toBe(
        computeIntegrityHash({ alpha: true, beta: true }),
      );
      expect(verifyIntegrity(parsed)).toBe(true);
    });
  });

  it('coalesces deferred writes so only the last state lands', async () => {
    vi.useFakeTimers();

    await withHermeticState('deferred-coalesce', async (statePath) => {
      const writer = createDeferredAtomicWriter(statePath, { debounceMs: 25 });

      for (let iteration = 1; iteration <= 10; iteration += 1) {
        writer.write({ status: 'pending', iteration });
      }

      expect(existsSync(statePath)).toBe(false);

      await vi.advanceTimersByTimeAsync(24);

      expect(existsSync(statePath)).toBe(false);

      await vi.advanceTimersByTimeAsync(1);
      await writer.flushNow();

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({
        status: 'pending',
        iteration: 10,
      });
      expect(tempSiblings(statePath)).toEqual([]);

      await writer.close();
    });
  });

  it('flushes again when state changes during an active drain', async () => {
    await withHermeticState('deferred-dirty-again', async (statePath) => {
      const writer = createDeferredAtomicWriter(statePath, { debounceMs: 1_000 });

      writer.write({ status: 'first', iteration: 1 });
      const drain = writer.flushNow();
      writer.write({ status: 'second', iteration: 2 });

      await Promise.resolve();

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({
        status: 'first',
        iteration: 1,
      });

      await drain;

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({
        status: 'second',
        iteration: 2,
      });
      expect(tempSiblings(statePath)).toEqual([]);

      await writer.close();
    });
  });

  it('flushNow drains pending state before the debounce window expires', async () => {
    vi.useFakeTimers();

    await withHermeticState('deferred-flush-now', async (statePath) => {
      const writer = createDeferredAtomicWriter(statePath, { debounceMs: 1_000 });

      writer.write({ status: 'ready', iteration: 3 });
      await writer.flushNow();

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({
        status: 'ready',
        iteration: 3,
      });
      expect(tempSiblings(statePath)).toEqual([]);

      await vi.advanceTimersByTimeAsync(1_000);

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({
        status: 'ready',
        iteration: 3,
      });

      await writer.close();
    });
  });

  it('close drains pending state and rejects later writes', async () => {
    vi.useFakeTimers();

    await withHermeticState('deferred-close', async (statePath) => {
      const writer = createDeferredAtomicWriter(statePath, { debounceMs: 1_000 });

      writer.write({ status: 'closing', iteration: 4 });
      await writer.close();

      expect(JSON.parse(readFileSync(statePath, 'utf8'))).toEqual({
        status: 'closing',
        iteration: 4,
      });
      expect(() => writer.write({ status: 'late' })).toThrow('Deferred atomic writer is closed.');
      expect(tempSiblings(statePath)).toEqual([]);
    });
  });

  it('surfaces timer flush failures through close without an unhandled rejection', async () => {
    vi.useFakeTimers();

    await withHermeticState('deferred-timer-failure', async (statePath) => {
      mkdirSync(statePath);
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const unhandledRejections: unknown[] = [];
      const onUnhandledRejection = (reason: unknown): void => {
        unhandledRejections.push(reason);
      };
      process.on('unhandledRejection', onUnhandledRejection);

      try {
        const writer = createDeferredAtomicWriter(statePath, { debounceMs: 1 });
        writer.write({ status: 'pending', iteration: 1 });

        await vi.advanceTimersByTimeAsync(1);
        await Promise.resolve();

        await expect(writer.close()).rejects.toThrow();
        expect(unhandledRejections).toEqual([]);
        expect(error).toHaveBeenCalledWith(
          '[deep-loop] Deferred atomic writer flush failed.',
          expect.anything(),
        );
      } finally {
        process.off('unhandledRejection', onUnhandledRejection);
      }
    });
  });

  it('warns and returns false when stamped object state is tampered', () => {
    withHermeticState('integrity-tamper', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const stamped = stampIntegrity({ status: 'started', iteration: 1 });
      const tampered = { ...stamped, iteration: 2 };

      expect(verifyIntegrity(tampered)).toBe(false);
      expect(warn).toHaveBeenCalledWith(
        '[deep-loop] State integrity mismatch detected; continuing with on-disk state.',
        expect.objectContaining({
          stored: stamped._integrity,
          computed: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
        }),
      );
    });
  });
});
