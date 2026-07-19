// TEST: Code graph recovery procedures
import Database from 'better-sqlite3';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import {
  recoverPartialScanFailure,
  recoverSqliteCorruption,
  rollbackBadApply,
  snapshotKnownGoodTriplet,
} from '../lib/recovery-procedures';

function makeDbDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'code-graph-recovery-'));
  const db = new Database(join(dir, 'code-graph.sqlite'));
  db.exec(`
    CREATE TABLE code_files (file_path TEXT, file_mtime_ms INTEGER);
    INSERT INTO code_files (file_path, file_mtime_ms) VALUES ('src/a.ts', 0);
  `);
  db.close();
  writeFileSync(join(dir, 'code-graph.sqlite-wal'), '');
  writeFileSync(join(dir, 'code-graph.sqlite-shm'), '');
  return dir;
}

describe('code graph recovery procedures', () => {
  it('CG-RP-001 copies forensic recovery state, quarantines live triplet, and runs full scan', async () => {
    const dbDir = makeDbDir();
    const scans: boolean[] = [];
    const result = await recoverSqliteCorruption({
      dbDir,
      scan: async (args) => { scans.push(args.incremental); },
      now: () => new Date('2026-05-08T00:00:00Z'),
    });

    expect(result.status).toBe('ok');
    expect(result.procedureId).toBe('CG-RP-001');
    expect(result.integrityCheck).toContain('ok');
    expect(scans).toEqual([false]);
    expect(existsSync(result.recoveryDir!)).toBe(true);
    expect(existsSync(result.quarantineDir!)).toBe(true);
  });

  it('CG-RP-002 uses incremental scan for bounded staged rows', async () => {
    const dbDir = makeDbDir();
    const scans: boolean[] = [];
    const result = await recoverPartialScanFailure({
      dbDir,
      scan: async (args) => { scans.push(args.incremental); },
    });

    expect(result.status).toBe('ok');
    expect(result.procedureId).toBe('CG-RP-002');
    expect(result.stagedFiles).toEqual(['src/a.ts']);
    expect(scans).toEqual([true]);
  });

  it('CG-RP-002 escalates to full scan when stale files exceed the soft boundary', async () => {
    const dbDir = makeDbDir();
    const scans: boolean[] = [];
    const result = await recoverPartialScanFailure({
      dbDir,
      staleFileCount: 51,
      scan: async (args) => { scans.push(args.incremental); },
    });

    expect(result.status).toBe('ok');
    expect(scans).toEqual([false]);
  });

  it('CG-RP-003 moves bad apply aside and restores latest known-good triplet', async () => {
    const dbDir = makeDbDir();
    const auditDir = join(dbDir, 'apply-audit');
    const knownGood = snapshotKnownGoodTriplet({
      dbDir,
      auditDir,
      now: () => new Date('2026-05-08T00:00:00Z'),
    });
    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'bad-state');
    const scans: boolean[] = [];

    const result = await rollbackBadApply({
      dbDir,
      auditDir,
      scan: async (args) => { scans.push(args.incremental); },
      now: () => new Date('2026-05-08T00:01:00Z'),
    });

    expect(result.status).toBe('ok');
    expect(result.procedureId).toBe('CG-RP-003');
    expect(result.knownGoodDir).toBe(knownGood);
    expect(result.restored).toBe(true);
    expect(scans).toEqual([false]);
    expect(existsSync(result.quarantineDir!)).toBe(true);
  });
});
