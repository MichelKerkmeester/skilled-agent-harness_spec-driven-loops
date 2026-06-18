import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  runCappedPool,
  appendStatusLedger,
  writeOrchestrationSummary,
} = require('../../scripts/fanout-pool.cjs') as {
  runCappedPool: (options: {
    items: Array<{ label?: string } | unknown>;
    concurrency: number;
    worker: (item: unknown, ctx: { index: number }) => Promise<unknown>;
    onEvent?: (event: Record<string, unknown>) => void;
  }) => Promise<{
    results: Array<{ label: string; status: string; output?: unknown; error?: { message: string } }>;
    summary: {
      total: number;
      succeeded: number;
      failed: number;
      all_failed: boolean;
      gauges: { lag: number; pending: number; failed: number };
    };
  }>;
  appendStatusLedger: (ledgerPath: string, entry: Record<string, unknown>) => void;
  writeOrchestrationSummary: (summaryPath: string, summary: Record<string, unknown>) => void;
};

// Flush the microtask queue past any number of chained .then/.finally hops by
// yielding to a macrotask — deterministic regardless of how many ticks the
// pool's admission chain (.then -> .finally -> pump) takes.
const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

// A controllable worker: each item resolves only when its gate is released.
// `entered` is append-only (worker invocation order); `inFlight` reflects the
// live set (gate deleted on release) so the cap can be asserted precisely.
function makeGatedWorker() {
  const gates = new Map<string, () => void>();
  const entered: string[] = [];
  let active = 0;
  let maxActive = 0;
  const worker = (item: { label: string }) =>
    new Promise<{ label: string }>((resolve) => {
      entered.push(item.label);
      active += 1;
      maxActive = Math.max(maxActive, active);
      gates.set(item.label, () => {
        if (!gates.has(item.label)) return;
        gates.delete(item.label);
        active -= 1;
        resolve({ label: item.label });
      });
    });
  return {
    worker,
    release: (label: string) => gates.get(label)?.(),
    releaseAll: () => [...gates.values()].forEach((fn) => fn()),
    inFlight: () => [...gates.keys()].sort(),
    entered: () => [...entered],
    maxActive: () => maxActive,
  };
}

const tmpDirs: string[] = [];
function freshTmpDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fanout-pool-'));
  tmpDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tmpDirs.length > 0) {
    const dir = tmpDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('runCappedPool', () => {
  it('never exceeds the concurrency cap', async () => {
    const gated = makeGatedWorker();
    const items = ['a', 'b', 'c', 'd', 'e'].map((label) => ({ label }));
    const run = runCappedPool({ items, concurrency: 2, worker: gated.worker });

    // With cap 2, only the first two items are admitted initially.
    await flush();
    expect(gated.inFlight()).toEqual(['a', 'b']);
    expect(gated.entered()).toEqual(['a', 'b']);
    expect(gated.maxActive()).toBe(2);

    // Releasing one frees exactly one slot, admitting the next item ('c').
    gated.release('a');
    await flush();
    expect(gated.inFlight()).toEqual(['b', 'c']);
    expect(gated.entered()).toEqual(['a', 'b', 'c']);

    // Drain the rest, re-releasing until the pool fully settles.
    for (let i = 0; i < items.length; i += 1) {
      gated.releaseAll();
      await flush();
    }
    const result = await run;
    expect(result.summary).toMatchObject({ total: 5, succeeded: 5, failed: 0, all_failed: false });
    expect(gated.entered()).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(gated.maxActive()).toBe(2);
  });

  it('preserves input order in results regardless of completion order', async () => {
    const result = await runCappedPool({
      items: [{ label: 'slow' }, { label: 'fast' }],
      concurrency: 2,
      worker: async (item: { label: string }) => {
        if (item.label === 'slow') {
          await new Promise((resolve) => setTimeout(resolve, 15));
        }
        return { label: item.label };
      },
    });
    expect(result.results.map((r) => r.label)).toEqual(['slow', 'fast']);
    expect(result.results.every((r) => r.status === 'fulfilled')).toBe(true);
  });

  it('isolates a single failing item without sinking the pool', async () => {
    const result = await runCappedPool({
      items: [{ label: 'ok' }, { label: 'boom' }],
      concurrency: 2,
      worker: async (item: { label: string }) => {
        if (item.label === 'boom') throw new Error('lineage executor failed');
        return { ok: true };
      },
    });
    expect(result.results.map((r) => r.status)).toEqual(['fulfilled', 'rejected']);
    expect(result.results[1].error?.message).toBe('lineage executor failed');
    expect(result.summary).toMatchObject({ total: 2, succeeded: 1, failed: 1, all_failed: false });
  });

  it('marks all_failed=true when every item throws', async () => {
    const result = await runCappedPool({
      items: [{ label: 'a' }, { label: 'b' }, { label: 'c' }],
      concurrency: 2,
      worker: async () => {
        throw new Error('all lineages fail');
      },
    });
    expect(result.results.every((r) => r.status === 'rejected')).toBe(true);
    expect(result.summary).toMatchObject({ total: 3, succeeded: 0, failed: 3, all_failed: true });
  });

  it('resolves an empty pool with a zero summary (all_failed false)', async () => {
    const result = await runCappedPool({ items: [], concurrency: 2, worker: async () => ({}) });
    expect(result.results).toEqual([]);
    expect(result.summary).toEqual({
      total: 0,
      succeeded: 0,
      failed: 0,
      all_failed: false,
      gauges: { lag: 0, pending: 0, failed: 0 },
    });
  });

  it('clamps a concurrency below 1 up to 1 and still completes', async () => {
    const result = await runCappedPool({
      items: [{ label: 'a' }, { label: 'b' }],
      concurrency: 0,
      worker: async (item: { label: string }) => ({ label: item.label }),
    });
    expect(result.summary).toMatchObject({ total: 2, succeeded: 2 });
  });

  it('emits started + completed/failed ledger events per item', async () => {
    const events: Array<Record<string, unknown>> = [];
    await runCappedPool({
      items: [{ label: 'ok' }, { label: 'boom' }],
      concurrency: 2,
      worker: async (item: { label: string }) => {
        if (item.label === 'boom') throw new Error('x');
        return {};
      },
      onEvent: (event) => events.push(event),
    });
    const byLabel = (label: string) => events.filter((e) => e.label === label).map((e) => e.event);
    expect(byLabel('ok')).toEqual(['started', 'completed']);
    expect(byLabel('boom')).toEqual(['started', 'failed']);
  });

  it('attaches lag, pending, and failed gauges to events and final summary', async () => {
    const events: Array<Record<string, unknown>> = [];
    const result = await runCappedPool({
      items: [{ label: 'ok' }, { label: 'boom' }],
      concurrency: 1,
      worker: async (item: { label: string }) => {
        if (item.label === 'boom') throw new Error('x');
        return {};
      },
      onEvent: (event) => events.push(event),
    });

    expect(events.map((event) => ({ event: event.event, gauges: event.gauges }))).toEqual([
      { event: 'started', gauges: { lag: 2, pending: 1, failed: 0 } },
      { event: 'completed', gauges: { lag: 1, pending: 1, failed: 0 } },
      { event: 'started', gauges: { lag: 1, pending: 0, failed: 0 } },
      { event: 'failed', gauges: { lag: 0, pending: 0, failed: 1 } },
    ]);
    expect(result.summary.gauges).toEqual({ lag: 0, pending: 0, failed: 1 });
  });

  it('throws on invalid items or worker', () => {
    expect(() => runCappedPool({ items: 'nope' as unknown as [], concurrency: 1, worker: async () => ({}) })).toThrow(
      TypeError,
    );
    expect(() =>
      runCappedPool({ items: [], concurrency: 1, worker: undefined as unknown as () => Promise<unknown> }),
    ).toThrow(TypeError);
  });
});

describe('status ledger helpers', () => {
  it('appends JSONL entries to the status ledger', () => {
    const dir = freshTmpDir();
    const ledger = join(dir, 'nested', 'orchestration-status.log');
    appendStatusLedger(ledger, { event: 'started', label: 'minimax-1' });
    appendStatusLedger(ledger, { event: 'completed', label: 'minimax-1', duration_ms: 12 });
    const lines = readFileSync(ledger, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0])).toMatchObject({ event: 'started', label: 'minimax-1' });
    expect(JSON.parse(lines[1])).toMatchObject({ event: 'completed', duration_ms: 12 });
  });

  it('writes the orchestration summary as pretty JSON', () => {
    const dir = freshTmpDir();
    const summaryPath = join(dir, 'orchestration-summary.json');
    writeOrchestrationSummary(summaryPath, { total: 4, succeeded: 3, failed: 1, salvaged: 1 });
    const parsed = JSON.parse(readFileSync(summaryPath, 'utf8'));
    expect(parsed).toEqual({ total: 4, succeeded: 3, failed: 1, salvaged: 1 });
  });
});
