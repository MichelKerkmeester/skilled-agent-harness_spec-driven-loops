// ---------------------------------------------------------------
// MODULE: Database State
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import { DB_UPDATED_FILE } from './config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Minimal vector index interface for database operations */
export interface VectorIndexLike {
  initializeDb(): void;
  getDb(): DatabaseLike | null;
  closeDb?(): void;
  vectorSearch?: unknown;
}

/** Minimal database interface */
export interface DatabaseLike {
  exec(sql: string): void;
  prepare(sql: string): {
    get(...params: unknown[]): Record<string, unknown> | undefined;
    run(...params: unknown[]): void;
  };
  transaction<T>(fn: () => T): () => T;
}

/** Checkpoints module interface */
export interface CheckpointsLike {
  init(database: DatabaseLike): void;
}

/** Access tracker module interface */
export interface AccessTrackerLike {
  init(database: DatabaseLike): void;
}

/** Hybrid search module interface */
export interface HybridSearchLike {
  init(database: DatabaseLike, vectorSearch: unknown): void;
}

/** Session manager module interface */
export interface SessionManagerLike {
  init(database: DatabaseLike): { success: boolean; error?: string };
}

/** Incremental index module interface */
export interface IncrementalIndexLike {
  init(database: DatabaseLike): void;
}

/** Dependencies for db-state initialization */
export interface DbStateDeps {
  vectorIndex?: VectorIndexLike;
  checkpoints?: CheckpointsLike;
  accessTracker?: AccessTrackerLike;
  hybridSearch?: HybridSearchLike;
  sessionManager?: SessionManagerLike;
  incrementalIndex?: IncrementalIndexLike;
}

/* ---------------------------------------------------------------
   2. STATE VARIABLES
   --------------------------------------------------------------- */

let lastDbCheck: number = 0;
let reinitializeMutex: Promise<void> | null = null;
let embeddingModelReady: boolean = false;
let constitutionalCache: unknown = null;
let constitutionalCacheTime: number = 0;

/* ---------------------------------------------------------------
   3. MODULE REFERENCES
   --------------------------------------------------------------- */

let vectorIndex: VectorIndexLike | null = null;
let checkpoints: CheckpointsLike | null = null;
let accessTracker: AccessTrackerLike | null = null;
let hybridSearch: HybridSearchLike | null = null;
let sessionManagerRef: SessionManagerLike | null = null;
let incrementalIndexRef: IncrementalIndexLike | null = null;

export function init(deps: DbStateDeps): void {
  if (deps.vectorIndex) vectorIndex = deps.vectorIndex;
  if (deps.checkpoints) checkpoints = deps.checkpoints;
  if (deps.accessTracker) accessTracker = deps.accessTracker;
  if (deps.hybridSearch) hybridSearch = deps.hybridSearch;
  if (deps.sessionManager) sessionManagerRef = deps.sessionManager;
  if (deps.incrementalIndex) incrementalIndexRef = deps.incrementalIndex;
}

/* ---------------------------------------------------------------
   4. DATABASE CHANGE NOTIFICATION
   --------------------------------------------------------------- */

export async function checkDatabaseUpdated(): Promise<boolean> {
  try {
    if (fs.existsSync(DB_UPDATED_FILE)) {
      const updateTime = parseInt(fs.readFileSync(DB_UPDATED_FILE, 'utf8'), 10);
      if (updateTime > lastDbCheck) {
        console.error('[db-state] Database updated externally, reinitializing connection...');
        lastDbCheck = updateTime;
        await reinitializeDatabase();
        return true;
      }
    }
  } catch {
    // Ignore errors reading notification file
  }
  return false;
}

export async function reinitializeDatabase(): Promise<void> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  // If reinitialization is already in progress, wait for it
  if (reinitializeMutex) {
    console.error('[db-state] Reinitialization already in progress, waiting...');
    await reinitializeMutex;
    return;
  }

  let resolve_mutex: () => void;
  reinitializeMutex = new Promise<void>(resolve => {
    resolve_mutex = resolve;
  });

  try {
    constitutionalCache = null;
    constitutionalCacheTime = 0;

    if (typeof vectorIndex.closeDb === 'function') {
      vectorIndex.closeDb();
    }
    vectorIndex.initializeDb();

    const database = vectorIndex.getDb();
    if (database) {
      if (checkpoints) checkpoints.init(database);
      if (accessTracker) accessTracker.init(database);
      if (hybridSearch) hybridSearch.init(database, vectorIndex.vectorSearch);
      // P4-12, P4-19 FIX: Refresh stale DB handles in session-manager and incremental-index
      if (sessionManagerRef) sessionManagerRef.init(database as DatabaseLike);
      if (incrementalIndexRef) incrementalIndexRef.init(database as DatabaseLike);
    }
    console.error('[db-state] Database connection reinitialized');
  } finally {
    // P4-13 FIX: Resolve the mutex BEFORE clearing the reference.
    // If we set reinitializeMutex = null first, a concurrent caller could
    // see null and start a new reinitialization before resolve is called.
    resolve_mutex!();
    reinitializeMutex = null;
  }
}

/* ---------------------------------------------------------------
   5. PERSISTENT RATE LIMITING
   --------------------------------------------------------------- */

export async function getLastScanTime(): Promise<number> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return 0;

    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan') as { value: string } | undefined;
    return row ? parseInt(row.value, 10) : 0;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error getting last scan time:', message);
    return 0;
  }
}

export async function setLastScanTime(time: number): Promise<void> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return;

    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run('last_index_scan', time.toString());
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error setting last scan time:', message);
  }
}

/* ---------------------------------------------------------------
   6. EMBEDDING MODEL READINESS
   --------------------------------------------------------------- */

export function isEmbeddingModelReady(): boolean {
  return embeddingModelReady;
}

export function setEmbeddingModelReady(ready: boolean): void {
  embeddingModelReady = ready;
}

export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 500;

  while (!embeddingModelReady) {
    if (Date.now() - startTime > timeoutMs) {
      console.error('[db-state] Embedding model warmup timeout');
      return false;
    }
    await new Promise<void>(resolve => setTimeout(resolve, checkInterval));
  }
  return true;
}

/* ---------------------------------------------------------------
   7. CONSTITUTIONAL CACHE ACCESSORS
   --------------------------------------------------------------- */

export function getConstitutionalCache(): unknown {
  return constitutionalCache;
}

export function setConstitutionalCache(cache: unknown): void {
  constitutionalCache = cache;
  constitutionalCacheTime = Date.now();
}

export function getConstitutionalCacheTime(): number {
  return constitutionalCacheTime;
}

export function clearConstitutionalCache(): void {
  constitutionalCache = null;
  constitutionalCacheTime = 0;
}

/* ---------------------------------------------------------------
   8. (ESM exports above — no CommonJS module.exports needed)
   --------------------------------------------------------------- */
