import { afterEach, describe, expect, it, vi } from 'vitest';

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import {
  appendJsonlIfChangedAtomic,
  computeIntegrityHash,
  createDeferredAtomicWriter,
  stampIntegrity,
  verifyIntegrity,
  writeStateAtomic,
  writeStateIfChangedAtomic,
} from '../../lib/deep-loop/atomic-state.js';
import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs';

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
