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
import { DATABASE_DIR } from '../../core/config.js';
import { closeDb } from './code-graph-db.js';

export type ScanFunction = (args: { incremental: boolean }) => Promise<unknown>;

export interface RecoveryProcedureOptions {
  dbDir?: string;
  auditDir?: string;
  now?: () => Date;
  scan?: ScanFunction;
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

function findLatestKnownGood(dbDir: string, auditDir: string): string | null {
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
  return candidates.sort().at(-1) ?? null;
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
    knownGoodDir = findLatestKnownGood(dbDir, auditDir);
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
