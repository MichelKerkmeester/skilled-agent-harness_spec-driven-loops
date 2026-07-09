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
import { extractSpecFolder, extractDocumentType } from '../parsing/memory-parser.js';
import { canonicalFingerprint } from './canonical-fingerprint.js';
import { createMemoStore } from './memo.js';
import { buildMemoryLogicalKey } from './lineage-state.js';

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

interface CategorizeFilesOptions {
  staleCandidatePaths?: string[];
}

interface IndexedPathRow {
  file_path: string;
  canonical_file_path?: string | null;
}

interface IndexedRecordRow extends IndexedPathRow {
  id: number;
}

type PathExistenceCache = Map<string, boolean>;

interface OrphanSweepOptions {
  limit?: number;
  cursor?: number;
  basePath?: string;
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
let documentTypeColumnAvailable: boolean | null = null;
const pathExistenceDiagnostics = { statSyncCalls: 0, readdirSyncCalls: 0 };

function init(database: Database.Database): void {
  db = database;
  canonicalPathColumnAvailable = null;
  documentTypeColumnAvailable = null;
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

function hasDocumentTypeColumn(): boolean {
  if (!db) return false;

  if (documentTypeColumnAvailable !== null) {
    return documentTypeColumnAvailable;
  }

  try {
    const columns = (db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>);
    documentTypeColumnAvailable = columns.some((column) => column.name === 'document_type');
  } catch {
    documentTypeColumnAvailable = false;
  }

  return documentTypeColumnAvailable;
}

/* ───────────────────────────────────────────────────────────────
   4. FILE METADATA
----------------------------------------------------------------*/

function getFileMetadata(filePath: string): FileMetadata {
  try {
    pathExistenceDiagnostics.statSyncCalls += 1;
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

function buildPathExistenceCache(filePaths: string[]): PathExistenceCache {
  const normalizedPaths = Array.from(new Set(
    filePaths
      .filter((filePath) => typeof filePath === 'string' && filePath.length > 0)
      .map((filePath) => path.resolve(filePath))
  ));
  const pathsByDirectory = new Map<string, Set<string>>();
  for (const filePath of normalizedPaths) {
    const directory = path.dirname(filePath);
    const entries = pathsByDirectory.get(directory) ?? new Set<string>();
    entries.add(filePath);
    pathsByDirectory.set(directory, entries);
  }

  const existingPaths = new Set<string>();
  for (const directory of pathsByDirectory.keys()) {
    try {
      pathExistenceDiagnostics.readdirSyncCalls += 1;
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        existingPaths.add(path.join(directory, entry.name));
      }
    } catch {
      // Missing or unreadable directories mean every candidate in that directory is absent.
    }
  }

  const cache: PathExistenceCache = new Map();
  for (const filePath of normalizedPaths) {
    let exists = existingPaths.has(filePath);
    if (!exists) {
      try {
        pathExistenceDiagnostics.statSyncCalls += 1;
        exists = fs.existsSync(filePath);
      } catch {
        exists = false;
      }
    }
    cache.set(filePath, exists);
  }
  return cache;
}

function cachedPathExists(cache: PathExistenceCache, filePath: string | null | undefined): boolean {
  if (typeof filePath !== 'string' || filePath.length === 0) return false;
  return cache.get(path.resolve(filePath)) === true;
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

function categorizeFilesForIndexing(filePaths: string[], options: CategorizeFilesOptions = {}): CategorizedFiles {
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
  const staleIndexedPaths = listStaleIndexedPaths(filePaths, options.staleCandidatePaths);
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

function resetPathExistenceDiagnostics(): void {
  pathExistenceDiagnostics.statSyncCalls = 0;
  pathExistenceDiagnostics.readdirSyncCalls = 0;
}

function listStaleIndexedPaths(scannedFilePaths: string[], candidatePaths?: string[]): string[] {
  if (!db) return [];

  const scannedCanonicalPaths = new Set(scannedFilePaths.map((filePath) => getCanonicalPathKey(filePath)));
  const candidateCanonicalPaths = Array.isArray(candidatePaths) && candidatePaths.length > 0
    ? new Set(candidatePaths.map((filePath) => getCanonicalPathKey(filePath)))
    : null;
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

    const pathExistenceCache = buildPathExistenceCache(rows.flatMap((row) => [
      row.file_path,
      row.canonical_file_path ?? '',
    ]));

    for (const row of rows) {
      if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
        continue;
      }

      const rowCanonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
        ? row.canonical_file_path
        : getCanonicalPathKey(row.file_path);

      if (candidateCanonicalPaths && !candidateCanonicalPaths.has(rowCanonicalPath)) {
        continue;
      }

      if (scannedCanonicalPaths.has(rowCanonicalPath)) {
        continue;
      }

      const filePathExists = cachedPathExists(pathExistenceCache, row.file_path);
      const canonicalPathExists = typeof row.canonical_file_path === 'string' && row.canonical_file_path.length > 0
        ? cachedPathExists(pathExistenceCache, row.canonical_file_path)
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
    const pathExistenceCache = buildPathExistenceCache(filePaths);

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

        const rowFileExists = cachedPathExists(pathExistenceCache, row.file_path);
        const rowCanonicalExists = cachedPathExists(pathExistenceCache, row.canonical_file_path);

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

function pathIsWithinBase(candidatePath: string, basePath: string): boolean {
  const relative = path.relative(basePath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function resolveIndexedPath(candidatePath: string | null | undefined, basePath: string): string | null {
  if (typeof candidatePath !== 'string' || candidatePath.length === 0) {
    return null;
  }
  const resolved = path.resolve(basePath, candidatePath);
  return pathIsWithinBase(resolved, basePath) ? resolved : null;
}

function legacyTrackPath(candidatePath: string | null | undefined): string | null {
  if (typeof candidatePath !== 'string' || candidatePath.length === 0) {
    return null;
  }
  if (candidatePath.includes(`${path.sep}system-spec-kit${path.sep}`)) {
    return candidatePath.replaceAll(`${path.sep}system-spec-kit${path.sep}`, `${path.sep}system-speckit${path.sep}`);
  }
  if (candidatePath.includes('/system-spec-kit/')) {
    return candidatePath.replaceAll('/system-spec-kit/', '/system-speckit/');
  }
  return null;
}

function indexedPathExists(candidatePath: string | null | undefined, basePath: string, existenceCache?: PathExistenceCache): boolean {
  const candidates = [candidatePath, legacyTrackPath(candidatePath)];
  return candidates.some((candidate) => {
    const resolved = resolveIndexedPath(candidate, basePath);
    if (!resolved) return false;
    return existenceCache ? cachedPathExists(existenceCache, resolved) : getFileMetadata(resolved).exists;
  });
}

function indexedRecordIsAbsentWithinBase(row: IndexedRecordRow, basePath: string, existenceCache?: PathExistenceCache): boolean {
  return !indexedPathExists(row.file_path, basePath, existenceCache) && !indexedPathExists(row.canonical_file_path, basePath, existenceCache);
}

function sweepOrphanIndexRows(options: OrphanSweepOptions = {}): OrphanSweepResult {
  if (!db) {
    return { swept: 0, nextCursor: null, scannedRows: 0, orphanRecordIds: [] };
  }

  const limit = normalizeOrphanSweepLimit(options.limit);
  const cursor = typeof options.cursor === 'number' && Number.isFinite(options.cursor) && options.cursor > 0
    ? Math.floor(options.cursor)
    : 0;
  const basePath = path.resolve(options.basePath ?? process.cwd());

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

    const existenceCache = buildPathExistenceCache(rows.flatMap((row) => [
      resolveIndexedPath(row.file_path, basePath) ?? '',
      resolveIndexedPath(row.canonical_file_path, basePath) ?? '',
      resolveIndexedPath(legacyTrackPath(row.file_path), basePath) ?? '',
      resolveIndexedPath(legacyTrackPath(row.canonical_file_path), basePath) ?? '',
    ]));
    const orphanRecordIds: number[] = [];
    for (const row of rows) {
      if (!row || typeof row.id !== 'number') {
        continue;
      }
      if (indexedRecordIsAbsentWithinBase(row, basePath, existenceCache)) {
        orphanRecordIds.push(row.id);
      }
    }

    return {
      swept: orphanRecordIds.length,
      nextCursor: rows.length === limit ? rows[rows.length - 1]?.id ?? 0 : 0,
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

interface MoveReconcileRow {
  id: number;
  document_type?: string | null;
  anchor_id?: string | null;
  tenant_id?: string | null;
  user_id?: string | null;
  agent_id?: string | null;
  session_id?: string | null;
}

interface ReconcileMovesResult {
  reconciled: MoveReconcileCandidate[];
  filteredToDelete: string[];
  filteredToIndex: string[];
}

interface IncrementalChunkFingerprint {
  chunkId: string;
  chunkFingerprint: string;
}

interface MemoizedPlanningInput {
  componentPath: string;
  canonicalInput: unknown;
  codeHash: string;
  chunks?: IncrementalChunkFingerprint[];
}

interface MemoizedPlanningOptions {
  invalidateDependents?: boolean;
}

interface MemoizedPlanningResult {
  memoHits: number;
  memoMisses: number;
  chunkHits: number;
  chunkMisses: number;
  dependencyInvalidated: number;
  changedComponentPaths: string[];
  unchangedComponentPaths: string[];
  invalidatedComponentPaths: string[];
}

/** The packet slug — a spec folder name with its leading NNN- numeric prefix removed,
 * so a re-parented + renumbered packet (012-foo → 005-foo) keeps a stable logical key. */
function stripNumericPrefix(folderName: string): string {
  return folderName.replace(/^\d{3}-/, '');
}

function tableExists(database: Database.Database, tableName: string): boolean {
  try {
    const row = database.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type IN ('table', 'view') AND name = ?
      LIMIT 1
    `).get(tableName) as { found?: number } | undefined;
    return row?.found === 1;
  } catch (_error: unknown) {
    return false;
  }
}

function upsertMovedActiveProjection(
  database: Database.Database,
  row: MoveReconcileRow,
  specFolder: string,
  canonicalFilePath: string,
): void {
  if (!tableExists(database, 'active_memory_projection')) {
    return;
  }
  const logicalKey = buildMemoryLogicalKey({
    specFolder,
    filePath: canonicalFilePath,
    canonicalFilePath,
    anchorId: row.anchor_id ?? null,
    tenant_id: row.tenant_id ?? null,
    user_id: row.user_id ?? null,
    agent_id: row.agent_id ?? null,
    session_id: row.session_id ?? null,
  });
  database.prepare(
    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
  ).run(row.id, logicalKey);
  database.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(logical_key) DO UPDATE SET
      root_memory_id = excluded.root_memory_id,
      active_memory_id = excluded.active_memory_id,
      updated_at = excluded.updated_at
  `).run(logicalKey, row.id, row.id);
}

function isLegacyTrackRename(oldPath: string, newPath: string): boolean {
  const oldParts = oldPath.split(path.sep);
  const newParts = newPath.split(path.sep);
  if (oldParts.length !== newParts.length) {
    return false;
  }
  const oldTrackIndex = oldParts.findIndex((part) => part === 'system-spec-kit');
  if (oldTrackIndex < 0 || newParts[oldTrackIndex] !== 'system-speckit') {
    return false;
  }
  return oldParts.every((part, index) => index === oldTrackIndex || part === newParts[index]);
}

function reconcileMoves(
  toDelete: string[],
  toIndex: string[],
): ReconcileMovesResult {
  if (!db || toDelete.length === 0 || toIndex.length === 0) {
    return { reconciled: [], filteredToDelete: toDelete, filteredToIndex: toIndex };
  }
  const database = db;

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
      let packetCandidates = newByPacketId.get(packetId);
      if (!packetCandidates) {
        packetCandidates = [];
        newByPacketId.set(packetId, packetCandidates);
      }
      packetCandidates.push({ newPath, docType, newGrandparent });
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

  // Iterate from the NEW side: for each new path whose folder still carries a packet_id,
  // find the corresponding old path in toDelete by matching grandparent directory + basename
  // (a sibling folder rename within the same parent). The packet_id only gates which new
  // paths are eligible — the actual old→new pairing is grandparent + basename plus the
  // DB uniqueness guards below; it does NOT match the old row by its packet_id (the old
  // graph-metadata.json may be gone, and memory_index has no packet_id column). To avoid
  // repointing across mismatched document kinds, the stored document_type is cross-checked
  // against the doc type derived from the new path before the in-place update.
  const docTypeAvailable = hasDocumentTypeColumn();
  const selectSql = docTypeAvailable
    ? `SELECT id, document_type, anchor_id, tenant_id, user_id, agent_id, session_id FROM memory_index WHERE (file_path = ? OR canonical_file_path = ?)`
    : `SELECT id, anchor_id, tenant_id, user_id, agent_id, session_id FROM memory_index WHERE (file_path = ? OR canonical_file_path = ?)`;
  for (const [, newCandidates] of newByPacketId) {
    for (const { newPath, docType, newGrandparent } of newCandidates) {
      if (reconciledNewPaths.has(newPath)) continue;

      const newBasename = path.basename(newPath);
      const trackRenameDeleted = toDelete.filter(oldPath =>
        !reconciledOldPaths.has(oldPath) && isLegacyTrackRename(oldPath, newPath)
      );

      // Pair the old path. Prefer a sibling rename (same grandparent + basename, where only
      // the immediate folder's numeric prefix changed). When there is none, fall back to a
      // re-parent move: same basename and same packet slug (the immediate folder name minus
      // its NNN- numeric prefix) under a DIFFERENT grandparent — how a reorg re-homes a packet
      // beneath a new parent and renumbers it while the slug stays stable. The unique-candidate
      // requirement plus the DB-row uniqueness and document_type guards below prevent an
      // ambiguous or mismatched repoint; an ambiguous basename (the common case where many
      // packets share spec.md) falls back to the safe drop + reindex.
      const siblingDeleted = toDelete.filter(oldPath =>
        !reconciledOldPaths.has(oldPath) &&
        path.basename(oldPath) === newBasename &&
        path.dirname(path.dirname(oldPath)) === newGrandparent
      );
      const newSlug = stripNumericPrefix(path.basename(path.dirname(newPath)));
      const candidates = trackRenameDeleted.length > 0
        ? trackRenameDeleted
        : siblingDeleted.length > 0
          ? siblingDeleted
          : toDelete.filter(oldPath =>
            !reconciledOldPaths.has(oldPath) &&
            path.basename(oldPath) === newBasename &&
            stripNumericPrefix(path.basename(path.dirname(oldPath))) === newSlug
          );

      if (candidates.length !== 1) continue; // uniqueness required

      const oldPath = candidates[0];
      const canonicalOld = getCanonicalPathKey(oldPath);

      const rows = database.prepare(selectSql).all(oldPath, canonicalOld) as MoveReconcileRow[];
      if (rows.length === 0) continue;

      // Cross-verify document kind: the stored document_type must agree with the doc type
      // derived from the new path. Skip rows whose stored type diverged from the new file
      // (e.g. a generic 'memory' row that happens to share a basename), preventing a
      // mismatched repoint. Tolerant when the column is absent (legacy/test schemas).
      const extractedDocType = extractDocumentType(newPath);
      const matchingRows = docTypeAvailable
        ? rows.filter((row) => (row.document_type ?? null) === null || row.document_type === extractedDocType)
        : rows;
      if (matchingRows.length === 0) continue;

      const newCanonical = getCanonicalPathKey(newPath);
      const newSpecFolder = extractSpecFolder(newPath);
      const newMtime = (() => {
        try { return fs.statSync(newPath).mtimeMs; } catch { return null; }
      })();

      let updatedRows = 0;
      for (const row of matchingRows) {
        const updated = database.prepare(`
          UPDATE memory_index
          SET file_path = ?,
              canonical_file_path = ?,
              spec_folder = ?,
              file_mtime_ms = ?,
              updated_at = datetime('now')
          WHERE id = ?
        `).run(newPath, newCanonical, newSpecFolder, newMtime, row.id);

        if ((updated as { changes: number }).changes !== 1) continue;
        upsertMovedActiveProjection(database, row, newSpecFolder, newCanonical);
        updatedRows++;
        reconciled.push({ oldPath, newPath, rowId: row.id, docType });
      }

      if (updatedRows === 0) continue;

      reconciledOldPaths.add(oldPath);
      reconciledNewPaths.add(newPath);
      console.error(`[incremental-index] Move reconciled: ${newBasename} ${oldPath} → ${newPath} (${updatedRows} row(s), embedding preserved)`);
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

function countChunkFingerprintHits(database: Database.Database, input: MemoizedPlanningInput): { hits: number; misses: number } {
  if (!input.chunks || input.chunks.length === 0) {
    return { hits: 0, misses: 0 };
  }

  try {
    const stmt = database.prepare(`
      SELECT 1 AS hit
      FROM memory_index
      WHERE (canonical_file_path = ? OR file_path = ?)
        AND chunk_id = ?
        AND chunk_fingerprint = ?
      LIMIT 1
    `);
    const canonicalPath = getCanonicalPathKey(input.componentPath);
    let hits = 0;
    let misses = 0;
    for (const chunk of input.chunks) {
      const row = stmt.get(canonicalPath, input.componentPath, chunk.chunkId, chunk.chunkFingerprint) as { hit?: number } | undefined;
      if (row?.hit === 1) {
        hits++;
      } else {
        misses++;
      }
    }
    return { hits, misses };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[incremental-index] countChunkFingerprintHits error: ${msg}`);
    return { hits: 0, misses: input.chunks.length };
  }
}

function planMemoizedIndexing(
  inputs: readonly MemoizedPlanningInput[],
  options: MemoizedPlanningOptions = {},
  database: Database.Database | null = db,
): MemoizedPlanningResult {
  const result: MemoizedPlanningResult = {
    memoHits: 0,
    memoMisses: 0,
    chunkHits: 0,
    chunkMisses: 0,
    dependencyInvalidated: 0,
    changedComponentPaths: [],
    unchangedComponentPaths: [],
    invalidatedComponentPaths: [],
  };

  if (!database) {
    result.changedComponentPaths = inputs.map((input) => input.componentPath);
    result.memoMisses = inputs.length;
    result.chunkMisses = inputs.reduce((count, input) => count + (input.chunks?.length ?? 0), 0);
    return result;
  }

  const memoStore = createMemoStore(database);
  const changedPaths: string[] = [];
  for (const input of inputs) {
    // An unfingerprintable input (e.g. a non-finite number) must not abort the
    // whole batch plan — treat it as a memo miss for this one input so the
    // remaining inputs are still planned.
    let inputFingerprint: string | null = null;
    try {
      inputFingerprint = canonicalFingerprint(input.canonicalInput);
    } catch (_error: unknown) {
      inputFingerprint = null;
    }
    const memo = inputFingerprint === null
      ? undefined
      : memoStore.getMemoRecord(input.componentPath, inputFingerprint, input.codeHash);
    if (memo) {
      result.memoHits++;
      result.unchangedComponentPaths.push(input.componentPath);
    } else {
      result.memoMisses++;
      result.changedComponentPaths.push(input.componentPath);
      changedPaths.push(input.componentPath);
    }

    const chunkCounts = countChunkFingerprintHits(database, input);
    result.chunkHits += chunkCounts.hits;
    result.chunkMisses += chunkCounts.misses;
  }

  if (options.invalidateDependents !== false && changedPaths.length > 0) {
    const invalidation = memoStore.invalidateDependents(changedPaths);
    result.invalidatedComponentPaths = invalidation.invalidatedPaths;
    result.dependencyInvalidated = invalidation.invalidatedPaths.length;
  }

  return result;
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
  buildPathExistenceCache,
  cachedPathExists,
  pathExistenceDiagnostics,
  resetPathExistenceDiagnostics,
  reconcileMoves,
  batchUpdateMtimes,
  planMemoizedIndexing,
};

/**
 * Re-exports related public types.
 */
export type {
  FileMetadata,
  StoredMetadata,
  IndexDecision,
  CategorizedFiles,
  CategorizeFilesOptions,
  OrphanSweepOptions,
  OrphanSweepResult,
  MoveReconcileCandidate,
  ReconcileMovesResult,
  IncrementalChunkFingerprint,
  MemoizedPlanningInput,
  MemoizedPlanningOptions,
  MemoizedPlanningResult,
};
