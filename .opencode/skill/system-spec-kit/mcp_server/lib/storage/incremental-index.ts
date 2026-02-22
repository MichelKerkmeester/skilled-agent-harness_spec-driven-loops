// ---------------------------------------------------------------
// MODULE: Incremental Index
// Mtime-based incremental indexing for fast re-indexing
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs';

// External packages
import type Database from 'better-sqlite3';

// Internal modules
import { getCanonicalPathKey } from '../utils/canonical-path';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second

/* -------------------------------------------------------------
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

/* -------------------------------------------------------------
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

/* -------------------------------------------------------------
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

/* -------------------------------------------------------------
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
    return 'skip';
  }

  // Path 5: Mtime changed (file modified)
  return 'modified';
}

/* -------------------------------------------------------------
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

/* -------------------------------------------------------------
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

  return result;
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

/* -------------------------------------------------------------
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
  batchUpdateMtimes,
};

export type {
  FileMetadata,
  StoredMetadata,
  IndexDecision,
  CategorizedFiles,
};
