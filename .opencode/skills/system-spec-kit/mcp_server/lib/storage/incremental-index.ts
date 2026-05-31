// ───────────────────────────────────────────────────────────────
// MODULE: Incremental Index
// ───────────────────────────────────────────────────────────────
// Feature catalog: Deferred lexical-only indexing
// Mtime-based incremental indexing for fast re-indexing
// Node stdlib
import { createHash } from 'node:crypto';
import * as fs from 'fs';
import * as path from 'path';

// External packages
import type Database from 'better-sqlite3';

// Internal modules
import { getCanonicalPathKey } from '../utils/canonical-path.js';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second
const DEFAULT_ORPHAN_SWEEP_LIMIT = 200;

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface FileMetadata {
  path: string;
  mtime: number;
  size: number;
  exists: boolean;
}

interface StoredMetadata {
  file_path: string;
  canonical_file_path?: string | null;
  file_mtime_ms: number | null;
  content_hash: string | null;
  embedding_status: string;
}

type IndexDecision = 'skip' | 'reindex' | 'new' | 'deleted' | 'modified' | 'unknown';

interface CategorizedFiles {
  toIndex: string[];
  toUpdate: string[];
  toSkip: string[];
  toDelete: string[];
}

interface IndexedPathRow {
  file_path: string;
  canonical_file_path?: string | null;
}

interface IndexedRecordRow extends IndexedPathRow {
  id: number;
}

interface OrphanSweepOptions {
  limit?: number;
  cursor?: number;
}

interface OrphanSweepResult {
  swept: number;
  nextCursor: number | null;
  scannedRows: number;
  orphanRecordIds: number[];
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let canonicalPathColumnAvailable: boolean | null = null;

function init(database: Database.Database): void {
  db = database;
  canonicalPathColumnAvailable = null;
}

function hasCanonicalPathColumn(): boolean {
  if (!db) return false;

  if (canonicalPathColumnAvailable !== null) {
    return canonicalPathColumnAvailable;
  }

  try {
    const columns = (db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>);
    canonicalPathColumnAvailable = columns.some((column) => column.name === 'canonical_file_path');
  } catch {
    canonicalPathColumnAvailable = false;
  }

  return canonicalPathColumnAvailable;
}

/* ───────────────────────────────────────────────────────────────
   4. FILE METADATA
----------------------------------------------------------------*/

function getFileMetadata(filePath: string): FileMetadata {
  try {
    const stats = fs.statSync(filePath);
    return {
      path: filePath,
      mtime: stats.mtimeMs,
      size: stats.size,
      exists: true,
    };
  } catch {
    return {
      path: filePath,
      mtime: 0,
      size: 0,
      exists: false,
    };
  }
}

function getStoredMetadata(filePath: string): StoredMetadata | null {
  if (!db) return null;

  try {
    const canonicalPath = getCanonicalPathKey(filePath);

    const row = hasCanonicalPathColumn()
      ? (db.prepare(`
          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
          FROM memory_index
          WHERE canonical_file_path = ? OR file_path = ?
          ORDER BY CASE WHEN canonical_file_path = ? THEN 0 ELSE 1 END, id DESC
          LIMIT 1
        `) as Database.Statement).get(canonicalPath, filePath, canonicalPath) as StoredMetadata | undefined
      : (db.prepare(`
          SELECT file_path, file_mtime_ms, content_hash, embedding_status
          FROM memory_index
          WHERE file_path = ?
        `) as Database.Statement).get(filePath) as StoredMetadata | undefined;

    return row || null;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] getStoredMetadata error: ${msg}`);
    return null;
  }
}

function computeFileContentHash(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath);
    return createHash('sha256').update(content).digest('hex');
  } catch {
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   5. DECISION LOGIC
----------------------------------------------------------------*/

/**
 * 6-path decision logic for whether a file needs re-indexing.
 */
function shouldReindex(filePath: string): IndexDecision {
  const fileInfo = getFileMetadata(filePath);

  // Path 1: File doesn't exist on disk
  if (!fileInfo.exists) {
    const stored = getStoredMetadata(filePath);
    if (stored) return 'deleted';
    return 'skip';
  }

  // Path 2: No stored metadata (new file)
  const stored = getStoredMetadata(filePath);
  if (!stored) return 'new';

  // Path 3: No stored mtime (legacy entry, needs re-indexing)
  if (stored.file_mtime_ms === null) return 'reindex';

  // Path 4: Mtime unchanged (fast path - skip)
  if (Math.abs(fileInfo.mtime - stored.file_mtime_ms) < MTIME_FAST_PATH_MS) {
    // Still check if embedding status is pending
    if (stored.embedding_status === 'pending' || stored.embedding_status === 'failed') {
      return 'reindex';
    }

    if (stored.content_hash) {
      const currentContentHash = computeFileContentHash(filePath);
      if (currentContentHash && currentContentHash !== stored.content_hash) {
        return 'modified';
      }
    }

    return 'skip';
  }

  // Path 5: Mtime changed (file modified)
  return 'modified';
}

/* ───────────────────────────────────────────────────────────────
   6. MTIME MANAGEMENT
----------------------------------------------------------------*/

function updateFileMtime(filePath: string, mtimeMs: number): boolean {
  if (!db) return false;

  try {
    const canonicalPath = getCanonicalPathKey(filePath);

    const result = hasCanonicalPathColumn()
      ? (db.prepare(`
          UPDATE memory_index
          SET file_mtime_ms = ?
          WHERE canonical_file_path = ? OR file_path = ?
        `) as Database.Statement).run(mtimeMs, canonicalPath, filePath)
      : (db.prepare(`
          UPDATE memory_index
          SET file_mtime_ms = ?
          WHERE file_path = ?
        `) as Database.Statement).run(mtimeMs, filePath);

    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] updateFileMtime error: ${msg}`);
    return false;
  }
}

function setIndexedMtime(filePath: string): boolean {
  const fileInfo = getFileMetadata(filePath);
  if (!fileInfo.exists) return false;
  return updateFileMtime(filePath, fileInfo.mtime);
}

/* ───────────────────────────────────────────────────────────────
   7. BATCH OPERATIONS
----------------------------------------------------------------*/

function categorizeFilesForIndexing(filePaths: string[]): CategorizedFiles {
  const result: CategorizedFiles = {
    toIndex: [],
    toUpdate: [],
    toSkip: [],
    toDelete: [],
  };

  for (const filePath of filePaths) {
    const decision = shouldReindex(filePath);

    switch (decision) {
      case 'new':
        result.toIndex.push(filePath);
        break;
      case 'modified':
      case 'reindex':
        result.toUpdate.push(filePath);
        break;
      case 'deleted':
        result.toDelete.push(filePath);
        break;
      case 'skip':
      default:
        result.toSkip.push(filePath);
        break;
    }
  }

  // Include stale indexed paths that are no longer discovered on disk.
  // Without this pass, removed files never enter toDelete during normal scans
  // Because discovery only returns files that currently exist.
  const staleIndexedPaths = listStaleIndexedPaths(filePaths);
  if (staleIndexedPaths.length > 0) {
    const seenDeleteKeys = new Set<string>(result.toDelete.map((filePath) => getCanonicalPathKey(filePath)));
    for (const stalePath of staleIndexedPaths) {
      const staleKey = getCanonicalPathKey(stalePath);
      if (!seenDeleteKeys.has(staleKey)) {
        result.toDelete.push(stalePath);
        seenDeleteKeys.add(staleKey);
      }
    }
  }

  return result;
}

function listStaleIndexedPaths(scannedFilePaths: string[]): string[] {
  if (!db) return [];

  const scannedCanonicalPaths = new Set(scannedFilePaths.map((filePath) => getCanonicalPathKey(filePath)));
  const stalePaths = new Set<string>();

  try {
    const rows = hasCanonicalPathColumn()
      ? (db.prepare(`
          SELECT DISTINCT file_path, canonical_file_path
          FROM memory_index
          WHERE file_path IS NOT NULL AND file_path != ''
        `) as Database.Statement).all() as IndexedPathRow[]
      : (db.prepare(`
          SELECT DISTINCT file_path
          FROM memory_index
          WHERE file_path IS NOT NULL AND file_path != ''
        `) as Database.Statement).all() as IndexedPathRow[];

    for (const row of rows) {
      if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
        continue;
      }

      const rowCanonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
        ? row.canonical_file_path
        : getCanonicalPathKey(row.file_path);

      if (scannedCanonicalPaths.has(rowCanonicalPath)) {
        continue;
      }

      const filePathExists = getFileMetadata(row.file_path).exists;
      const canonicalPathExists = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
        ? getFileMetadata(row.canonical_file_path).exists
        : false;

      if (!filePathExists && !canonicalPathExists) {
        stalePaths.add(row.file_path);
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] listStaleIndexedPaths error: ${msg}`);
  }

  return Array.from(stalePaths);
}

function listIndexedRecordIdsForDeletedPaths(filePaths: string[]): number[] {
  if (!db || filePaths.length === 0) return [];

  const ids = new Set<number>();
  const seenLookupKeys = new Set<string>();

  try {
    for (const filePath of filePaths) {
      if (typeof filePath !== 'string' || filePath.length === 0) {
        continue;
      }

      const canonicalPath = getCanonicalPathKey(filePath);
      const lookupKey = `${canonicalPath}::${filePath}`;
      if (seenLookupKeys.has(lookupKey)) {
        continue;
      }
      seenLookupKeys.add(lookupKey);

      const rows = hasCanonicalPathColumn()
        ? (db.prepare(`
            SELECT id, file_path, canonical_file_path
            FROM memory_index
            WHERE canonical_file_path = ? OR file_path = ?
          `) as Database.Statement).all(canonicalPath, filePath) as IndexedRecordRow[]
        : (db.prepare(`
            SELECT id, file_path
            FROM memory_index
            WHERE file_path = ?
          `) as Database.Statement).all(filePath) as IndexedRecordRow[];

      for (const row of rows) {
        if (!row || typeof row.id !== 'number') {
          continue;
        }

        const rowFileExists = typeof row.file_path === 'string' && row.file_path.length > 0
          ? getFileMetadata(row.file_path).exists
          : false;
        const rowCanonicalExists = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
          ? getFileMetadata(row.canonical_file_path).exists
          : false;

        if (rowFileExists || rowCanonicalExists) {
          continue;
        }

        ids.add(row.id);
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] listIndexedRecordIdsForDeletedPaths error: ${msg}`);
    return [];
  }

  return Array.from(ids).sort((a, b) => a - b);
}

function normalizeOrphanSweepLimit(limit?: number): number {
  if (typeof limit !== 'number' || !Number.isFinite(limit) || limit <= 0) {
    return DEFAULT_ORPHAN_SWEEP_LIMIT;
  }

  return Math.max(1, Math.floor(limit));
}

function indexedRecordIsAbsent(row: IndexedRecordRow): boolean {
  const rowFileExists = typeof row.file_path === 'string' && row.file_path.length > 0
    ? getFileMetadata(row.file_path).exists
    : false;
  const rowCanonicalExists = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
    ? getFileMetadata(row.canonical_file_path).exists
    : false;

  return !rowFileExists && !rowCanonicalExists;
}

function sweepOrphanIndexRows(options: OrphanSweepOptions = {}): OrphanSweepResult {
  if (!db) {
    return { swept: 0, nextCursor: null, scannedRows: 0, orphanRecordIds: [] };
  }

  const limit = normalizeOrphanSweepLimit(options.limit);
  const cursor = typeof options.cursor === 'number' && Number.isFinite(options.cursor) && options.cursor > 0
    ? Math.floor(options.cursor)
    : 0;

  try {
    const rows = hasCanonicalPathColumn()
      ? (db.prepare(`
          SELECT id, file_path, canonical_file_path
          FROM memory_index
          WHERE id > ?
            AND file_path IS NOT NULL
            AND file_path != ''
          ORDER BY id ASC
          LIMIT ?
        `) as Database.Statement).all(cursor, limit) as IndexedRecordRow[]
      : (db.prepare(`
          SELECT id, file_path
          FROM memory_index
          WHERE id > ?
            AND file_path IS NOT NULL
            AND file_path != ''
          ORDER BY id ASC
          LIMIT ?
        `) as Database.Statement).all(cursor, limit) as IndexedRecordRow[];

    const orphanRecordIds: number[] = [];
    for (const row of rows) {
      if (!row || typeof row.id !== 'number') {
        continue;
      }
      if (indexedRecordIsAbsent(row)) {
        orphanRecordIds.push(row.id);
      }
    }

    return {
      swept: orphanRecordIds.length,
      nextCursor: rows.length === limit ? rows[rows.length - 1]?.id ?? null : null,
      scannedRows: rows.length,
      orphanRecordIds,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] sweepOrphanIndexRows error: ${msg}`);
    return { swept: 0, nextCursor: null, scannedRows: 0, orphanRecordIds: [] };
  }
}

/* ───────────────────────────────────────────────────────────────
   7b. MOVE RECONCILIATION
----------------------------------------------------------------*/

interface MoveReconcileCandidate {
  oldPath: string;
  newPath: string;
  rowId: number;
  docType: string;
}

interface ReconcileMovesResult {
  reconciled: MoveReconcileCandidate[];
  filteredToDelete: string[];
  filteredToIndex: string[];
}

function reconcileMoves(
  toDelete: string[],
  toIndex: string[],
): ReconcileMovesResult {
  if (!db || toDelete.length === 0 || toIndex.length === 0) {
    return { reconciled: [], filteredToDelete: toDelete, filteredToIndex: toIndex };
  }

  // Build a map: packet_id → [{newPath, docType, newGrandparent}] from the toIndex files.
  // Reads graph-metadata.json from the NEW location only — the old one may be gone after a move.
  const newByPacketId = new Map<string, Array<{ newPath: string; docType: string; newGrandparent: string }>>();
  for (const newPath of toIndex) {
    try {
      const newSpecFolder = path.dirname(newPath);
      const graphMetaPath = path.join(newSpecFolder, 'graph-metadata.json');
      if (!fs.existsSync(graphMetaPath)) continue;
      const raw = fs.readFileSync(graphMetaPath, 'utf-8');
      const meta = JSON.parse(raw) as { packet_id?: string };
      const packetId = meta?.packet_id;
      if (typeof packetId !== 'string' || packetId.length === 0) continue;
      const docType = path.basename(newPath, path.extname(newPath));
      const newGrandparent = path.dirname(newSpecFolder);
      if (!newByPacketId.has(packetId)) newByPacketId.set(packetId, []);
      newByPacketId.get(packetId)!.push({ newPath, docType, newGrandparent });
    } catch {
      // skip unreadable or non-JSON graph-metadata
    }
  }

  if (newByPacketId.size === 0) {
    return { reconciled: [], filteredToDelete: toDelete, filteredToIndex: toIndex };
  }

  const reconciledOldPaths = new Set<string>();
  const reconciledNewPaths = new Set<string>();
  const reconciled: MoveReconcileCandidate[] = [];

  // Iterate from the NEW side: for each packet_id we know about, find the corresponding
  // old path in toDelete by matching grandparent directory + basename (folder rename within
  // the same parent). This avoids reading the old graph-metadata.json which may be gone.
  for (const [, newCandidates] of newByPacketId) {
    for (const { newPath, docType, newGrandparent } of newCandidates) {
      if (reconciledNewPaths.has(newPath)) continue;

      const newBasename = path.basename(newPath);

      // Find toDelete paths that are sibling renames: same grandparent dir, same basename.
      // A sibling rename means only the immediate spec folder name changed (e.g. 012-old → 012-new).
      const siblingDeleted = toDelete.filter(oldPath =>
        !reconciledOldPaths.has(oldPath) &&
        path.basename(oldPath) === newBasename &&
        path.dirname(path.dirname(oldPath)) === newGrandparent
      );

      if (siblingDeleted.length !== 1) continue; // uniqueness required

      const oldPath = siblingDeleted[0];
      const canonicalOld = getCanonicalPathKey(oldPath);

      // Verify in DB: exactly one live row for this old path (uniqueness guard).
      const rows = db!.prepare(
        `SELECT id FROM memory_index WHERE (file_path = ? OR canonical_file_path = ?) AND embedding_status != 'failed' LIMIT 2`
      ).all(oldPath, canonicalOld) as Array<{ id: number }>;
      if (rows.length !== 1) continue;

      const rowId = rows[0].id;
      const newCanonical = getCanonicalPathKey(newPath);
      const newMtime = (() => {
        try { return fs.statSync(newPath).mtimeMs; } catch { return null; }
      })();

      // Update the row's path in place (preserves embedding, id, history).
      const updated = db!.prepare(`
        UPDATE memory_index
        SET file_path = ?,
            canonical_file_path = ?,
            file_mtime_ms = ?,
            updated_at = datetime('now')
        WHERE id = ?
          AND embedding_status != 'failed'
      `).run(newPath, newCanonical, newMtime, rowId);

      if ((updated as { changes: number }).changes !== 1) continue;

      reconciledOldPaths.add(oldPath);
      reconciledNewPaths.add(newPath);
      reconciled.push({ oldPath, newPath, rowId, docType });
      console.error(`[incremental-index] Move reconciled: ${newBasename} ${oldPath} → ${newPath} (row ${rowId}, embedding preserved)`);
    }
  }

  return {
    reconciled,
    filteredToDelete: toDelete.filter(p => !reconciledOldPaths.has(p)),
    filteredToIndex: toIndex.filter(p => !reconciledNewPaths.has(p)),
  };
}

function batchUpdateMtimes(filePaths: string[]): { updated: number; failed: number } {
  if (!db) return { updated: 0, failed: filePaths.length };

  let updated = 0;
  let failed = 0;

  const updateTx = db.transaction(() => {
    for (const filePath of filePaths) {
      if (setIndexedMtime(filePath)) {
        updated++;
      } else {
        failed++;
      }
    }
  });

  try {
    updateTx();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] batchUpdateMtimes error: ${msg}`);
  }

  return { updated, failed };
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
----------------------------------------------------------------*/

export {
  MTIME_FAST_PATH_MS,

  init,
  getFileMetadata,
  getStoredMetadata,
  shouldReindex,
  updateFileMtime,
  setIndexedMtime,
  categorizeFilesForIndexing,
  listStaleIndexedPaths,
  listIndexedRecordIdsForDeletedPaths,
  sweepOrphanIndexRows,
  reconcileMoves,
  batchUpdateMtimes,
};

/**
 * Re-exports related public types.
 */
export type {
  FileMetadata,
  StoredMetadata,
  IndexDecision,
  CategorizedFiles,
  OrphanSweepOptions,
  OrphanSweepResult,
  MoveReconcileCandidate,
  ReconcileMovesResult,
};
