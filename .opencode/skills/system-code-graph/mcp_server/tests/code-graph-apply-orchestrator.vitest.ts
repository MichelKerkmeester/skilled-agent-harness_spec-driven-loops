// TEST: Code graph apply orchestrator
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/apply-metadata.js', () => ({
  persistApplyMetadata: vi.fn(),
}));

import {
  applyCodeGraph,
  classifyApplyState,
  type GoldBatteryRunResult,
} from '../lib/apply-orchestrator';

function battery(passed: boolean, rate = passed ? 1 : 0): GoldBatteryRunResult {
  return {
    batteryPath: '<test>',
    queryCount: 28,
    pass_policy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
    defaultPassPolicy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
    effectivePassPolicy: { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
    overall_pass_rate: rate,
    edge_focus_pass_rate: rate,
    overallPassRate: rate,
    categoryPassRates: {},
    missingSymbols: passed ? [] : ['handleCodeGraphQuery'],
    unexpectedErrors: [],
    passed,
    probes: [],
  };
}

describe('code graph apply orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('classifies fresh, soft-stale, and hard-stale states', () => {
    expect(classifyApplyState({
      freshness: 'fresh',
      canonicalReadiness: 'ready',
      trustState: 'live',
      lastPersistedAt: '2026-05-08T00:00:00Z',
    }).state).toBe('fresh');

    expect(classifyApplyState({
      freshness: 'stale',
      action: 'selective_reindex',
      staleFileCount: 4,
      lastPersistedAt: '2026-05-08T00:00:00Z',
    }).state).toBe('soft-stale');

    expect(classifyApplyState({
      freshness: 'stale',
      staleFileCount: 51,
      lastPersistedAt: '2026-05-08T00:00:00Z',
    }).state).toBe('hard-stale');
  });

  it('aborts before mutation when the pre-flight battery fails', async () => {
    const scans: unknown[] = [];
    const result = await applyCodeGraph({}, {
      battery: async () => battery(false),
      status: async () => ({ freshness: 'stale', staleFileCount: 1 }),
      scan: async (args) => { scans.push(args); },
      auditDir: mkdtempSync(join(tmpdir(), 'code-graph-apply-audit-')),
    });

    expect(result.status).toBe('aborted');
    expect(result.message).toContain('Pre-flight');
    expect(scans).toEqual([]);
  });

  it('routes soft-stale rescan to incremental scan and commits after post-flight pass', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'code-graph-apply-db-'));
    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
    const scans: Array<{ incremental?: boolean }> = [];
    const result = await applyCodeGraph({}, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: async () => ({
        freshness: 'stale',
        action: 'selective_reindex',
        staleFileCount: 2,
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async (args) => { scans.push(args); },
      now: () => new Date('2026-05-08T00:00:00Z'),
    });

    expect(result.status).toBe('committed');
    expect(scans[0]?.incremental).toBe(true);
    expect(result.auditLogPath).toContain('apply-audit');
  });

  it('reports rollback-failed when post-flight fails and the restore target is unusable', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'code-graph-apply-rollback-'));
    // 'snapshot' bytes are not a valid SQLite database, so restoring the
    // known-good triplet cannot produce a usable database. The rollback is
    // attempted but fails — report that honestly instead of 'rolled-back'.
    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
    let calls = 0;
    const result = await applyCodeGraph({}, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => {
        calls += 1;
        return calls === 1 ? battery(true) : battery(false);
      },
      status: async () => ({
        freshness: 'stale',
        action: 'selective_reindex',
        staleFileCount: 1,
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async () => undefined,
      now: () => new Date('2026-05-08T00:00:00Z'),
    });

    expect(result.status).toBe('rollback-failed');
    expect(result.recovery?.procedureId).toBe('CG-RP-003');
    expect(result.requiredAction).toContain('known-good snapshot');
  });

  it('rolls back when post-flight battery fails and the snapshot restores cleanly', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'code-graph-apply-rollback-ok-'));
    // An empty file is a valid (empty) SQLite database, so the restored triplet
    // is usable and the rollback genuinely succeeds.
    writeFileSync(join(dbDir, 'code-graph.sqlite'), '');
    let calls = 0;
    const result = await applyCodeGraph({}, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => {
        calls += 1;
        return calls === 1 ? battery(true) : battery(false);
      },
      status: async () => ({
        freshness: 'stale',
        action: 'selective_reindex',
        staleFileCount: 1,
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async () => undefined,
      now: () => new Date('2026-05-08T00:00:00Z'),
    });

    expect(result.status).toBe('rolled-back');
    expect(result.recovery?.procedureId).toBe('CG-RP-003');
  });

  it('applies high-tier prune-excludes through scan excludeGlobs and blocks medium without confirm', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'code-graph-prune-db-'));
    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
    const artifactPath = join(dbDir, 'exclude-rule-confidence.json');
    writeFileSync(artifactPath, JSON.stringify({
      schema_version: 1,
      tiers: {
        high: { definition: 'high', default_action: 'exclude_without_prompt', patterns: [{ pattern: '**/.git/**', rationale: 'git metadata' }] },
        medium: { definition: 'medium', default_action: 'prompt', patterns: [{ pattern: '**/dist/**', rationale: 'build output' }] },
        low: { definition: 'low', default_action: 'opt_in', patterns: [] },
      },
    }));
    const scans: Array<{ excludeGlobs?: string[] }> = [];

    const committed = await applyCodeGraph({
      operation: 'prune-excludes',
      excludePatterns: ['**/.git/**'],
    }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      excludeRuleConfidencePath: artifactPath,
      battery: async () => battery(true),
      status: async () => ({
        freshness: 'fresh',
        canonicalReadiness: 'ready',
        trustState: 'live',
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async (args) => { scans.push(args); },
    });

    expect(committed.status).toBe('committed');
    expect(scans[0]?.excludeGlobs).toEqual(['**/.git/**']);

    const blocked = await applyCodeGraph({
      operation: 'prune-excludes',
      excludePatterns: ['**/dist/**'],
    }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      excludeRuleConfidencePath: artifactPath,
      battery: async () => battery(true),
      status: async () => ({
        freshness: 'fresh',
        canonicalReadiness: 'ready',
        trustState: 'live',
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async () => undefined,
    });

    // A medium-tier pattern without confirm now aborts BEFORE the snapshot
    // rather than throwing into the rollback path (which would have churned the
    // triplet and reindexed for a mere missing confirm flag).
    expect(blocked.status).toBe('aborted');
    expect(blocked.requiredAction).toContain('confirm=true');
  });

  it('classifies prune-excludes against the shipped default artifact when no path is supplied', async () => {
    const dbDir = mkdtempSync(join(tmpdir(), 'code-graph-prune-default-db-'));
    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
    const scans: Array<{ excludeGlobs?: string[] }> = [];

    // No excludeRuleConfidencePath: the orchestrator must fall back to the
    // shipped default so a real request is classified instead of collapsing
    // every pattern to 'unknown'. The default puts **/.git/** in the high tier.
    const committed = await applyCodeGraph({
      operation: 'prune-excludes',
      excludePatterns: ['**/.git/**'],
    }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: async () => ({
        freshness: 'fresh',
        canonicalReadiness: 'ready',
        trustState: 'live',
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async (args) => { scans.push(args); },
    });

    expect(committed.status).toBe('committed');
    expect(scans[0]?.excludeGlobs).toEqual(['**/.git/**']);

    // A medium-tier default pattern (**/dist/**) still blocks without confirm,
    // proving the gates ride along with the default artifact.
    const blocked = await applyCodeGraph({
      operation: 'prune-excludes',
      excludePatterns: ['**/dist/**'],
    }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: async () => ({
        freshness: 'fresh',
        canonicalReadiness: 'ready',
        trustState: 'live',
        lastPersistedAt: '2026-05-08T00:00:00Z',
      }),
      scan: async () => undefined,
    });

    // Same pre-snapshot refusal applies when the gate rides along with the
    // shipped default artifact instead of an explicit path.
    expect(blocked.status).toBe('aborted');
    expect(blocked.requiredAction).toContain('confirm=true');
  });
});
