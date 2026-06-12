// TEST: Apply-pipeline safety — confirm gates, rollback target selection, retention
import Database from 'better-sqlite3';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/apply-metadata.js', () => ({
  persistApplyMetadata: vi.fn(),
}));

import { applyCodeGraph, type GoldBatteryRunResult } from '../lib/apply-orchestrator';
import { pruneApplyArtifacts, previewRollbackTarget, snapshotKnownGoodTriplet } from '../lib/recovery-procedures';

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

function makeDbDir(marker: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'code-graph-pipeline-'));
  writeMarkerDb(dir, marker);
  return dir;
}

function writeMarkerDb(dir: string, marker: string): void {
  const db = new Database(join(dir, 'code-graph.sqlite'));
  db.exec('CREATE TABLE IF NOT EXISTS marker (v TEXT)');
  db.prepare('DELETE FROM marker').run();
  db.prepare('INSERT INTO marker (v) VALUES (?)').run(marker);
  db.close();
}

function readMarker(dir: string): string {
  const db = new Database(join(dir, 'code-graph.sqlite'), { readonly: true });
  try {
    const row = db.prepare('SELECT v FROM marker LIMIT 1').get() as { v: string } | undefined;
    return row?.v ?? '<missing>';
  } finally {
    db.close();
  }
}

const softStale = async () => ({ freshness: 'stale', staleFileCount: 1, action: 'selective_reindex' });

describe('apply-pipeline safety', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('refuses destructive operations without confirm BEFORE taking a snapshot', async () => {
    const dbDir = makeDbDir('live');
    const auditDir = join(dbDir, 'apply-audit');
    const scans: unknown[] = [];

    for (const operation of ['rollback-bad-apply', 'recover-sqlite-corruption'] as const) {
      const result = await applyCodeGraph({ operation }, {
        dbDir,
        auditDir,
        battery: async () => battery(true),
        status: softStale,
        scan: async (args) => { scans.push(args); },
      });
      expect(result.status).toBe('aborted');
      expect(result.requiredAction).toContain('confirm=true');
    }

    expect(scans).toEqual([]);
    expect(readMarker(dbDir)).toBe('live');
    const snapshots = existsSync(auditDir)
      ? readdirSync(auditDir).filter((name) => name.startsWith('known-good-'))
      : [];
    expect(snapshots).toEqual([]);
  });

  it('refuses repair-nodes without crashRootCauseAddressed instead of committing a no-op', async () => {
    const dbDir = makeDbDir('live');
    const result = await applyCodeGraph({ operation: 'repair-nodes' }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: softStale,
      scan: async () => undefined,
    });

    expect(result.status).toBe('aborted');
    expect(result.requiredAction).toContain('crashRootCauseAddressed=true');
    expect(result.status).not.toBe('committed');
  });

  it('operator rollback restores the PRIOR baseline, never the snapshot it just took', async () => {
    const dbDir = makeDbDir('baseline');
    const auditDir = join(dbDir, 'apply-audit');
    const baselineSnapshot = snapshotKnownGoodTriplet({
      dbDir,
      auditDir,
      now: () => new Date('2026-06-12T10:00:00.000Z'),
    });
    // The live database then degrades into the state the operator wants gone.
    writeMarkerDb(dbDir, 'suspect');

    const result = await applyCodeGraph({ operation: 'rollback-bad-apply', confirm: true }, {
      dbDir,
      auditDir,
      battery: async () => battery(true),
      status: softStale,
      scan: async () => undefined,
      now: () => new Date('2026-06-12T11:00:00.000Z'),
    });

    expect(result.status).toBe('committed');
    expect(result.recovery?.restored).toBe(true);
    expect(result.recovery?.knownGoodDir).toBe(baselineSnapshot);
    expect(readMarker(dbDir)).toBe('baseline');
  });

  it('rollback dry-run names the restore target without mutating anything', async () => {
    const dbDir = makeDbDir('live');
    const auditDir = join(dbDir, 'apply-audit');
    const baselineSnapshot = snapshotKnownGoodTriplet({
      dbDir,
      auditDir,
      now: () => new Date('2026-06-12T10:00:00.000Z'),
    });

    const result = await applyCodeGraph({ operation: 'rollback-bad-apply', dryRun: true }, {
      dbDir,
      auditDir,
      battery: async () => battery(true),
      status: softStale,
      scan: async () => undefined,
      now: () => new Date('2026-06-12T11:00:00.000Z'),
    });

    expect(result.status).toBe('dry-run');
    expect(result.rollbackTarget).toBe(baselineSnapshot);
    expect(result.message).toContain(baselineSnapshot);
    expect(readMarker(dbDir)).toBe('live');
  });

  it('rollback dry-run reports plainly when no restore target exists', async () => {
    const dbDir = makeDbDir('live');
    const result = await applyCodeGraph({ operation: 'rollback-bad-apply', dryRun: true }, {
      dbDir,
      auditDir: join(dbDir, 'apply-audit'),
      battery: async () => battery(true),
      status: softStale,
      scan: async () => undefined,
    });

    expect(result.status).toBe('dry-run');
    expect(result.rollbackTarget).toBeNull();
    expect(result.message).toContain('NO known-good snapshot');
  });

  it('previewRollbackTarget matches live selection semantics including exclusions', () => {
    const dbDir = makeDbDir('live');
    const auditDir = join(dbDir, 'apply-audit');
    const older = snapshotKnownGoodTriplet({ dbDir, auditDir, now: () => new Date('2026-06-12T10:00:00.000Z') });
    const newer = snapshotKnownGoodTriplet({ dbDir, auditDir, now: () => new Date('2026-06-12T11:00:00.000Z') });

    expect(previewRollbackTarget({ dbDir, auditDir })).toBe(newer);
    expect(previewRollbackTarget({ dbDir, auditDir, excludeKnownGoodDirs: [newer] })).toBe(older);
  });

  it('retention keeps the newest known-goods, protects the current run, and prunes only age-dated artifacts', () => {
    const dbDir = makeDbDir('live');
    const auditDir = join(dbDir, 'apply-audit');
    const stamps = ['01', '02', '03', '04', '05'];
    const snapshots = stamps.map((minute) => snapshotKnownGoodTriplet({
      dbDir,
      auditDir,
      now: () => new Date(`2026-06-01T10:${minute}:00.000Z`),
    }));
    const oldBadApply = join(auditDir, 'bad-apply-2026-05-01T00-00-00-000Z');
    const freshBadApply = join(auditDir, 'bad-apply-2026-06-11T00-00-00-000Z');
    const oldRecovery = join(dbDir, 'recovery-2026-05-01T00-00-00-000Z');
    const undatedQuarantine = join(dbDir, 'quarantine-manual-keep');
    for (const dir of [oldBadApply, freshBadApply, oldRecovery, undatedQuarantine]) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'code-graph.sqlite'), 'artifact');
    }

    const result = pruneApplyArtifacts({
      dbDir,
      auditDir,
      keepKnownGood: 3,
      maxAgeDays: 14,
      protectDirs: [snapshots[0]],
      now: () => new Date('2026-06-12T00:00:00.000Z'),
    });

    // Newest three kept; the protected oldest survives even though it falls
    // outside the keep window; only the unprotected old one is pruned.
    expect(existsSync(snapshots[4])).toBe(true);
    expect(existsSync(snapshots[3])).toBe(true);
    expect(existsSync(snapshots[2])).toBe(true);
    expect(existsSync(snapshots[0])).toBe(true);
    expect(existsSync(snapshots[1])).toBe(false);
    // Age-dated artifacts: only those older than the threshold are pruned;
    // undated directories fail open and are kept.
    expect(existsSync(oldBadApply)).toBe(false);
    expect(existsSync(oldRecovery)).toBe(false);
    expect(existsSync(freshBadApply)).toBe(true);
    expect(existsSync(undatedQuarantine)).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
