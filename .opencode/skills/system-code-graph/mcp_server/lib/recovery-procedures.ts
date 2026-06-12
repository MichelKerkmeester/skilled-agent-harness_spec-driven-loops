// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Recovery Procedures
// ───────────────────────────────────────────────────────────────
// Typed implementations of CG-RP-001, CG-RP-002, and CG-RP-003.

import Database from 'better-sqlite3';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';
import { DATABASE_DIR } from '../core/config.js';
import { closeDb } from './code-graph-db.js';

export type ScanFunction = (args: { incremental: boolean }) => Promise<unknown>;

export interface RecoveryProcedureOptions {
  dbDir?: string;
  auditDir?: string;
  now?: () => Date;
  scan?: ScanFunction;
  /**
   * Known-good snapshot directories that must NOT be selected as a rollback
   * restore target — above all the snapshot taken at the start of the
   * current run. Without this exclusion a rollback restores the snapshot it
   * just created from the very state being rolled back: a no-op restore of
   * the suspect database.
   */
  excludeKnownGoodDirs?: string[];
}

export interface PruneApplyArtifactsOptions {
  dbDir?: string;
  auditDir?: string;
  now?: () => Date;
  /** Newest known-good snapshots to keep. */
  keepKnownGood?: number;
  /** Age threshold for quarantine/recovery/bad-apply directories. */
  maxAgeDays?: number;
  /** Directories that must never be pruned (e.g. the current run's snapshot). */
  protectDirs?: string[];
}

export interface PruneApplyArtifactsResult {
  prunedDirs: string[];
  keptKnownGoodDirs: string[];
  errors: string[];
}

export interface RecoveryProcedureResult {
  procedureId: 'CG-RP-001' | 'CG-RP-002' | 'CG-RP-003';
  status: 'ok' | 'failed';
  quarantineDir?: string;
  recoveryDir?: string;
  knownGoodDir?: string;
  restored?: boolean;
  scanIncremental?: boolean;
  integrityCheck?: string;
  stagedFiles?: string[];
  errors: string[];
}

const DB_TRIPLET = [
  'code-graph.sqlite',
  'code-graph.sqlite-wal',
  'code-graph.sqlite-shm',
] as const;

function timestamp(now: () => Date): string {
  return now().toISOString().replace(/[:.]/g, '-');
}

function ensureDir(path: string): string {
  mkdirSync(path, { recursive: true, mode: 0o700 });
  return path;
}

function assertInside(parent: string, child: string): void {
  const parentResolved = resolve(parent);
  const childResolved = resolve(child);
  const parentWithSep = parentResolved.endsWith(sep) ? parentResolved : `${parentResolved}${sep}`;
  if (childResolved !== parentResolved && !childResolved.startsWith(parentWithSep)) {
    throw new Error(`Path escapes recovery root: ${child}`);
  }
}

function resolveDbDir(dbDir?: string): string {
  const resolved = resolve(dbDir ?? DATABASE_DIR);
  ensureDir(resolved);
  return resolved;
}

function tripletPath(dbDir: string, fileName: typeof DB_TRIPLET[number]): string {
  const path = join(dbDir, fileName);
  if (basename(path) !== fileName) {
    throw new Error(`Invalid DB triplet file name: ${fileName}`);
  }
  assertInside(dbDir, path);
  return path;
}

function copyTriplet(dbDir: string, targetDir: string): number {
  ensureDir(targetDir);
  assertInside(resolve(targetDir, '..'), targetDir);
  let copied = 0;
  for (const fileName of DB_TRIPLET) {
    const source = tripletPath(dbDir, fileName);
    if (!existsSync(source)) {
      continue;
    }
    copyFileSync(source, join(targetDir, fileName));
    copied += 1;
  }
  return copied;
}

function moveTriplet(dbDir: string, targetDir: string): number {
  ensureDir(targetDir);
  let moved = 0;
  for (const fileName of DB_TRIPLET) {
    const source = tripletPath(dbDir, fileName);
    if (!existsSync(source)) {
      continue;
    }
    renameSync(source, join(targetDir, fileName));
    moved += 1;
  }
  return moved;
}

function restoreTriplet(sourceDir: string, dbDir: string): number {
  let restored = 0;
  for (const fileName of DB_TRIPLET) {
    const source = join(sourceDir, fileName);
    if (!existsSync(source)) {
      continue;
    }
    copyFileSync(source, tripletPath(dbDir, fileName));
    restored += 1;
  }
  return restored;
}

function runIntegrityCheck(sqlitePath: string): string {
  if (!existsSync(sqlitePath)) {
    return 'missing';
  }
  const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.pragma('integrity_check') as Array<Record<string, unknown>>;
    return rows.map((row) => String(Object.values(row)[0] ?? '')).join('\n') || 'ok';
  } finally {
    db.close();
  }
}

function listKnownGoodDirs(dbDir: string, auditDir: string): string[] {
  const roots = [auditDir, dbDir];
  const candidates: string[] = [];
  for (const root of roots) {
    if (!existsSync(root)) {
      continue;
    }
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name.startsWith('known-good-')) {
        candidates.push(join(root, entry.name));
      }
    }
  }
  return candidates.sort();
}

function findLatestKnownGood(dbDir: string, auditDir: string, excludeDirs: string[] = []): string | null {
  const excluded = new Set(excludeDirs.map((dir) => resolve(dir)));
  return listKnownGoodDirs(dbDir, auditDir)
    .filter((candidate) => !excluded.has(resolve(candidate)))
    .at(-1) ?? null;
}

/**
 * Resolves the directory a rollback WOULD restore, without mutating
 * anything. Uses the same selection logic as the live rollback so a
 * dry-run preview can never name a different target than the real run.
 */
export function previewRollbackTarget(options: RecoveryProcedureOptions = {}): string | null {
  const dbDir = resolveDbDir(options.dbDir);
  const auditDir = resolve(options.auditDir ?? join(dbDir, 'apply-audit'));
  return findLatestKnownGood(dbDir, auditDir, options.excludeKnownGoodDirs ?? []);
}

export function snapshotKnownGoodTriplet(options: RecoveryProcedureOptions = {}): string {
  const dbDir = resolveDbDir(options.dbDir);
  const auditDir = ensureDir(resolve(options.auditDir ?? join(dbDir, 'apply-audit')));
  assertInside(dbDir, auditDir);
  const knownGoodDir = join(auditDir, `known-good-${timestamp(options.now ?? (() => new Date()))}`);
  copyTriplet(dbDir, knownGoodDir);
  return knownGoodDir;
}

export async function recoverSqliteCorruption(
  options: RecoveryProcedureOptions = {},
): Promise<RecoveryProcedureResult> {
  const dbDir = resolveDbDir(options.dbDir);
  const ts = timestamp(options.now ?? (() => new Date()));
  const recoveryDir = join(dbDir, `recovery-${ts}`);
  const quarantineDir = join(dbDir, `quarantine-${ts}`);
  const errors: string[] = [];
  let integrityCheck = 'missing';

  try {
    closeDb();
    copyTriplet(dbDir, recoveryDir);
    integrityCheck = runIntegrityCheck(join(recoveryDir, 'code-graph.sqlite'));
    moveTriplet(dbDir, quarantineDir);
    if (options.scan) {
      await options.scan({ incremental: false });
    }
    return {
      procedureId: 'CG-RP-001',
      status: 'ok',
      recoveryDir,
      quarantineDir,
      integrityCheck,
      scanIncremental: false,
      errors,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return {
      procedureId: 'CG-RP-001',
      status: 'failed',
      recoveryDir,
      quarantineDir,
      integrityCheck,
      errors,
    };
  }
}

export async function recoverPartialScanFailure(
  options: RecoveryProcedureOptions & {
    staleFileCount?: number;
    gitHeadDrift?: boolean;
    schemaOrErrorSignal?: boolean;
  } = {},
): Promise<RecoveryProcedureResult> {
  const dbDir = resolveDbDir(options.dbDir);
  const errors: string[] = [];
  const sqlitePath = tripletPath(dbDir, 'code-graph.sqlite');
  let integrityCheck = 'missing';
  let stagedFiles: string[] = [];

  try {
    integrityCheck = runIntegrityCheck(sqlitePath);
    if (existsSync(sqlitePath)) {
      const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
      try {
        const rows = db.prepare('SELECT file_path FROM code_files WHERE file_mtime_ms = 0 ORDER BY file_path LIMIT 50').all() as Array<{ file_path: string }>;
        stagedFiles = rows.map((row) => row.file_path);
      } finally {
        db.close();
      }
    }
    const staleFileCount = options.staleFileCount ?? stagedFiles.length;
    const incremental = staleFileCount <= 50 && options.gitHeadDrift !== true && options.schemaOrErrorSignal !== true;
    if (options.scan) {
      await options.scan({ incremental });
    }
    return {
      procedureId: 'CG-RP-002',
      status: 'ok',
      integrityCheck,
      stagedFiles,
      scanIncremental: incremental,
      errors,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return {
      procedureId: 'CG-RP-002',
      status: 'failed',
      integrityCheck,
      stagedFiles,
      errors,
    };
  }
}

export async function rollbackBadApply(
  options: RecoveryProcedureOptions = {},
): Promise<RecoveryProcedureResult> {
  const dbDir = resolveDbDir(options.dbDir);
  const auditDir = ensureDir(resolve(options.auditDir ?? join(dbDir, 'apply-audit')));
  assertInside(dbDir, auditDir);
  const ts = timestamp(options.now ?? (() => new Date()));
  const quarantineDir = join(auditDir, `bad-apply-${ts}`);
  const errors: string[] = [];
  let knownGoodDir: string | null = null;
  let restored = false;

  try {
    closeDb();
    moveTriplet(dbDir, quarantineDir);
    knownGoodDir = findLatestKnownGood(dbDir, auditDir, options.excludeKnownGoodDirs ?? []);
    if (knownGoodDir) {
      assertInside(dbDir, knownGoodDir);
      restored = restoreTriplet(knownGoodDir, dbDir) > 0;
    }
    if (restored && existsSync(tripletPath(dbDir, 'code-graph.sqlite'))) {
      const db = new Database(tripletPath(dbDir, 'code-graph.sqlite'));
      try {
        db.pragma('wal_checkpoint(TRUNCATE)');
      } finally {
        db.close();
      }
    }
    if (options.scan) {
      await options.scan({ incremental: false });
    }
    return {
      procedureId: 'CG-RP-003',
      status: 'ok',
      quarantineDir,
      ...(knownGoodDir ? { knownGoodDir } : {}),
      restored,
      scanIncremental: false,
      errors,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    try {
      if (existsSync(quarantineDir) && readdirSync(quarantineDir).length === 0) {
        rmSync(quarantineDir, { recursive: true, force: true });
      }
    } catch {
      // Cleanup failure is not more important than the recovery failure.
    }
    return {
      procedureId: 'CG-RP-003',
      status: 'failed',
      quarantineDir,
      ...(knownGoodDir ? { knownGoodDir } : {}),
      restored,
      errors,
    };
  }
}

export function relativizeRecoveryPath(path: string, root: string = process.cwd()): string {
  const rel = relative(root, path);
  return rel.startsWith('..') ? path : rel;
}

function artifactDirAgeMs(dirPath: string, now: () => Date): number | null {
  // Artifact directories embed their creation time in the name
  // (e.g. bad-apply-2026-06-11T19-18-17-464Z); parse it back by undoing the
  // timestamp() substitution. Unparseable names report null and are kept —
  // retention must fail open, never delete what it cannot date.
  const match = basename(dirPath).match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)$/);
  if (!match) {
    return null;
  }
  const iso = match[1].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, 'T$1:$2:$3.$4Z');
  const created = Date.parse(iso);
  if (!Number.isFinite(created)) {
    return null;
  }
  return now().getTime() - created;
}

/**
 * Best-effort retention for apply-pipeline artifacts. Disk evidence showed
 * snapshot/quarantine/recovery directories amplifying to several times the
 * live database with no pruning anywhere. Safety rules: protected
 * directories are never touched (the current run's snapshot above all), the
 * newest known-good snapshots are always kept, only age-dated directories
 * are pruned, and every failure is collected instead of thrown — retention
 * must never break the apply that triggered it.
 */
export function pruneApplyArtifacts(options: PruneApplyArtifactsOptions = {}): PruneApplyArtifactsResult {
  const dbDir = resolveDbDir(options.dbDir);
  const auditDir = resolve(options.auditDir ?? join(dbDir, 'apply-audit'));
  const now = options.now ?? (() => new Date());
  const keepKnownGood = Math.max(1, options.keepKnownGood ?? 3);
  const maxAgeMs = Math.max(1, options.maxAgeDays ?? 14) * 24 * 60 * 60 * 1000;
  const protectedDirs = new Set((options.protectDirs ?? []).map((dir) => resolve(dir)));
  const prunedDirs: string[] = [];
  const errors: string[] = [];

  const removeDir = (dirPath: string): void => {
    if (protectedDirs.has(resolve(dirPath))) {
      return;
    }
    try {
      rmSync(dirPath, { recursive: true, force: true });
      prunedDirs.push(dirPath);
    } catch (error) {
      errors.push(`prune failed for ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const knownGood = listKnownGoodDirs(dbDir, auditDir);
  const keptKnownGoodDirs = knownGood.slice(-keepKnownGood);
  const keepSet = new Set(keptKnownGoodDirs.map((dir) => resolve(dir)));
  for (const dir of knownGood) {
    if (!keepSet.has(resolve(dir))) {
      removeDir(dir);
    }
  }

  const ageScan: Array<{ root: string; prefixes: string[] }> = [
    { root: auditDir, prefixes: ['bad-apply-'] },
    { root: dbDir, prefixes: ['recovery-', 'quarantine-'] },
  ];
  for (const { root, prefixes } of ageScan) {
    if (!existsSync(root)) {
      continue;
    }
    let entries;
    try {
      entries = readdirSync(root, { withFileTypes: true });
    } catch (error) {
      errors.push(`prune scan failed for ${root}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || !prefixes.some((prefix) => entry.name.startsWith(prefix))) {
        continue;
      }
      const dirPath = join(root, entry.name);
      const ageMs = artifactDirAgeMs(dirPath, now);
      if (ageMs !== null && ageMs > maxAgeMs) {
        removeDir(dirPath);
      }
    }
  }

  return { prunedDirs, keptKnownGoodDirs, errors };
}
