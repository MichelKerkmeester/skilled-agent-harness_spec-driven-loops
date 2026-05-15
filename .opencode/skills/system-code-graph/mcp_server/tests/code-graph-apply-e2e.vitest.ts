// ───────────────────────────────────────────────────────────────────
// MODULE: Code graph apply-mode recovery playbook scenarios Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/apply-metadata.js', () => ({
  persistApplyMetadata: vi.fn(),
}));

import {
  applyCodeGraph,
  classifyApplyState,
  type ApplyStateInput,
  type GoldBatteryRunResult,
} from '../lib/apply-orchestrator';

function battery(passed: boolean): GoldBatteryRunResult {
  return {
    batteryPath: '<test>',
    queryCount: 28,
    pass_policy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
    defaultPassPolicy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
    effectivePassPolicy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
    overall_pass_rate: passed ? 1 : 0.5,
    edge_focus_pass_rate: passed ? 1 : 0.5,
    overallPassRate: passed ? 1 : 0.5,
    categoryPassRates: {},
    missingSymbols: passed ? [] : ['criticalSymbol'],
    unexpectedErrors: [],
    passed,
    probes: [],
  };
}

describe('code graph apply e2e recovery-playbook scenarios', () => {
  const scenarios: Array<[string, ApplyStateInput, string]> = [
    ['fresh graph noop', { freshness: 'fresh', canonicalReadiness: 'ready', trustState: 'live', lastPersistedAt: '2026-05-08T00:00:00Z' }, 'fresh'],
    ['one stale file', { freshness: 'stale', action: 'selective_reindex', staleFileCount: 1, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'soft-stale'],
    ['fifty stale files', { freshness: 'stale', action: 'selective_reindex', staleFileCount: 50, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'soft-stale'],
    ['fifty-one stale files', { freshness: 'stale', staleFileCount: 51, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
    ['empty graph', { freshness: 'empty', trustState: 'absent', lastPersistedAt: null }, 'hard-stale'],
    ['error graph', { freshness: 'error', trustState: 'unavailable', lastPersistedAt: null }, 'hard-stale'],
    ['git head drift', { freshness: 'stale', staleFileCount: 1, gitHeadDrift: true, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
    ['schema mismatch', { freshness: 'fresh', schemaVersion: 4, expectedSchemaVersion: 5, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
    ['missing persisted timestamp', { freshness: 'fresh', canonicalReadiness: 'ready', trustState: 'live', lastPersistedAt: null }, 'hard-stale'],
    ['battery floor failure', { freshness: 'fresh', canonicalReadiness: 'ready', trustState: 'live', lastPersistedAt: '2026-05-08T00:00:00Z', verification: battery(false) }, 'hard-stale'],
    ['deleted tracked files only', { freshness: 'stale', action: 'none', staleFileCount: 0, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'soft-stale'],
    ['unclassified stale full scan', { freshness: 'stale', action: 'full_scan', staleFileCount: 3, lastPersistedAt: '2026-05-08T00:00:00Z' }, 'hard-stale'],
  ];

  it.each(scenarios)('classifies scenario: %s', (_name, input, expected) => {
    expect(classifyApplyState(input).state).toBe(expected);
  });

  it('dry-run executes both batteries and skips mutation dispatch', async () => {
    let batteryRuns = 0;
    const scans: unknown[] = [];
    const result = await applyCodeGraph({ dryRun: true }, {
      auditDir: mkdtempSync(join(tmpdir(), 'code-graph-apply-dryrun-')),
      battery: async () => {
        batteryRuns += 1;
        return battery(true);
      },
      status: async () => ({
        freshness: 'stale',
        action: 'selective_reindex',
        staleFileCount: 1,
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async (args) => { scans.push(args); },
    });

    expect(result.status).toBe('dry-run');
    expect(batteryRuns).toBe(2);
    expect(scans).toEqual([]);
  });

  it('hard-stale state aborts without confirmation and mutates with confirmation', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'code-graph-apply-hard-'));
    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
    const scans: Array<{ incremental?: boolean }> = [];

    const aborted = await applyCodeGraph({}, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: async () => ({ freshness: 'empty', trustState: 'absent', lastPersistedAt: null }),
      scan: async (args) => { scans.push(args); },
    });
    expect(aborted.status).toBe('aborted');
    expect(scans).toEqual([]);

    const committed = await applyCodeGraph({ confirm: true }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: async () => ({ freshness: 'empty', trustState: 'absent', lastPersistedAt: null }),
      scan: async (args) => { scans.push(args); },
    });
    expect(committed.status).toBe('committed');
    expect(scans.at(-1)?.incremental).toBe(false);
  });
});
