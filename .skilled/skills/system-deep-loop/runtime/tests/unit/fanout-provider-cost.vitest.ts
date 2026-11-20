// ───────────────────────────────────────────────────────────────
// MODULE: Fan-out provider cost from lineage logs
// ───────────────────────────────────────────────────────────────
// A lineage's provider cost comes from the cost records its JSON log carries.
// A log with no cost record reads as unknown, never as zero.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const scriptsDir = resolve(here, '..', '..', 'scripts');
const requireCjs = createRequire(import.meta.url);
const { sumProviderCostFromLog, readLineageProviderCostUsd, summarizeProviderCost } = requireCjs(
  join(scriptsDir, 'fanout-salvage.cjs'),
) as {
  sumProviderCostFromLog: (text: string) => number | null;
  readLineageProviderCostUsd: (lineageDir: string) => number | null;
  summarizeProviderCost: (costs: Record<string, number | null>) => {
    total: number | null;
    by_lineage: Record<string, number | null>;
  };
};
const { buildAttributionMd } = requireCjs(join(scriptsDir, 'fanout-merge.cjs')) as {
  buildAttributionMd: (lineageData: unknown[], loopType: string) => string;
};

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

function stepFinish(cost: number): string {
  return JSON.stringify({
    type: 'step_finish',
    part: { type: 'step-finish', cost, tokens: { input: 10, output: 2 } },
  });
}

function lineageWithLogs(logs: Record<string, string>): string {
  const lineageDir = mkdtempSync(join(tmpdir(), 'fanout-provider-cost-'));
  tempDirs.push(lineageDir);
  mkdirSync(join(lineageDir, 'logs'));
  for (const [name, text] of Object.entries(logs)) writeFileSync(join(lineageDir, 'logs', name), text);
  return lineageDir;
}

describe('fanout-salvage.cjs — provider cost', () => {
  it('sums step_finish cost from an opencode JSON log and reads a text log as unknown', () => {
    const jsonLog = [
      JSON.stringify({ type: 'step_start', part: {} }),
      stepFinish(0.25),
      JSON.stringify({ type: 'text', part: { text: 'answer' } }),
      stepFinish(0.076),
    ].join('\n');
    expect(sumProviderCostFromLog(jsonLog)).toBeCloseTo(0.326, 9);
    expect(sumProviderCostFromLog('Final answer in plain text.\n')).toBeNull();
    expect(sumProviderCostFromLog(JSON.stringify({ type: 'step_start', part: {} }))).toBeNull();
  });

  it('adds every rotated attempt and turns unknown when any attempt carries no cost', () => {
    const retried = lineageWithLogs({
      'fanout-lineage.1.out': stepFinish(0.1),
      'fanout-lineage.out': stepFinish(0.2),
      'fanout-lineage.err': 'stderr is never cost\n',
    });
    expect(readLineageProviderCostUsd(retried)).toBeCloseTo(0.3, 9);
    const mixed = lineageWithLogs({
      'fanout-lineage.1.out': 'plain text attempt\n',
      'fanout-lineage.out': stepFinish(0.2),
    });
    expect(readLineageProviderCostUsd(mixed)).toBeNull();
    expect(readLineageProviderCostUsd(lineageWithLogs({}))).toBeNull();
  });

  it('reads an unreadable attempt log as unknown instead of throwing', () => {
    const lineage = lineageWithLogs({ 'fanout-lineage.1.out': stepFinish(0.1) });
    mkdirSync(join(lineage, 'logs', 'fanout-lineage.out'));
    expect(readLineageProviderCostUsd(lineage)).toBeNull();
  });

  it('keeps the total unknown while any lineage cost is unknown', () => {
    expect(summarizeProviderCost({ opus: null, deepseek: 0.326 })).toEqual({
      total: null,
      by_lineage: { opus: null, deepseek: 0.326 },
    });
    expect(summarizeProviderCost({ a: 0.1, b: 0.2 }).total).toBeCloseTo(0.3, 9);
  });
});

describe('fanout-merge.cjs — attribution provider cost', () => {
  it('prints each lineage cost and an unknown total when one lineage reported none', () => {
    const md = buildAttributionMd([
      { label: 'opus', registry: {}, stateRecords: [], kind: 'cli-claude-code', model: 'm', providerCostUsd: null },
      { label: 'deepseek', registry: {}, stateRecords: [], kind: 'cli-opencode', model: 'm', providerCostUsd: 0.326051 },
    ], 'research');
    expect(md).toContain('| opus | unknown |');
    expect(md).toContain('| deepseek | 0.326051 |');
    expect(md).toContain('Total provider cost (USD): unknown');
    expect(md).not.toMatch(/Total provider cost \(USD\): 0\.32/);
  });
});
