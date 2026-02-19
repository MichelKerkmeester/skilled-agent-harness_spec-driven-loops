// ---------------------------------------------------------------
// MODULE: Checkpoints
// Gzip-compressed database checkpoints with embedding preservation
// ---------------------------------------------------------------

// Node stdlib
import * as zlib from 'zlib';
import { execSync } from 'child_process';

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

interface CheckpointEntry {
  id: number;
  name: string;
  created_at: string;
  spec_folder: string | null;
  git_branch: string | null;
  memory_snapshot: Buffer | null;
  file_snapshot: Buffer | null;
  metadata: string | null;
}

interface CheckpointInfo {
  id: number;
  name: string;
  createdAt: string;
  specFolder: string | null;
  gitBranch: string | null;
  snapshotSize: number;
  metadata: Record<string, unknown>;
  [key: string]: unknown;
}

interface CreateCheckpointOptions {
  name?: string;
  specFolder?: string | null;
  includeEmbeddings?: boolean;
  metadata?: Record<string, unknown>;
}

interface RestoreResult {
  restored: number;
  skipped: number;
  errors: string[];
  workingMemoryRestored: number;
}

/* -------------------------------------------------------------
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* -------------------------------------------------------------
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
}

function getDatabase(): Database.Database {
  if (!db) throw new Error('[checkpoints] Database not initialized. Server may still be starting up.');
  return db;
}

/* -------------------------------------------------------------
   5. HELPERS
----------------------------------------------------------------*/

function getGitBranch(): string | null {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).toString().trim();
    return branch || null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------
   6. T107 FIX: CHECKPOINT SCHEMA VALIDATION
   Validate each memory row before restore to prevent silent data
   loss from corrupt/malformed checkpoint snapshots.
----------------------------------------------------------------*/

/**
 * Validates a single memory row from a checkpoint snapshot.
 * Throws on invalid data — caller should reject the entire restore.
 *
 * Strict on identity fields (id, file_path, spec_folder).
 * Required-but-lenient on INSERT-needed fields (must be present, type flexible).
 * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for
 * backwards compatibility with older checkpoint formats.
 */
function validateMemoryRow(row: unknown, index: number): void {
  if (!row || typeof row !== 'object') {
    throw new Error(`Checkpoint row ${index}: not an object (got ${typeof row})`);
  }
  const r = row as Record<string, unknown>;

  // --- Strict identity fields (core to INSERT and data integrity) ---
  if (typeof r.id !== 'number' || !Number.isFinite(r.id)) {
    throw new Error(`Checkpoint row ${index}: id must be a finite number, got ${typeof r.id} (${String(r.id)})`);
  }
  if (typeof r.file_path !== 'string' || !r.file_path) {
    throw new Error(`Checkpoint row ${index}: file_path must be non-empty string, got ${typeof r.file_path}`);
  }
  if (typeof r.spec_folder !== 'string' || !r.spec_folder) {
    throw new Error(`Checkpoint row ${index}: spec_folder must be non-empty string, got ${typeof r.spec_folder}`);
  }

  // --- Required fields for INSERT (must be present; type flexibility for compat) ---
  const requiredFields = ['title', 'importance_weight', 'created_at', 'updated_at', 'importance_tier'];
  for (const field of requiredFields) {
    if (r[field] === undefined) {
      throw new Error(`Checkpoint row ${index}: missing required field '${field}'`);
    }
  }
}

/* -------------------------------------------------------------
   7. CHECKPOINT OPERATIONS
----------------------------------------------------------------*/

function createCheckpoint(options: CreateCheckpointOptions = {}): CheckpointInfo | null {
  const database = getDatabase();

  const {
    name = `checkpoint-${Date.now()}`,
    specFolder = null,
    includeEmbeddings: _includeEmbeddings = true,
    metadata = {},
  } = options;

  try {
    // Snapshot memory_index
    const folderFilter = specFolder ? 'WHERE spec_folder = ?' : '';
    const params = specFolder ? [specFolder] : [];

    const memories = database.prepare(
      `SELECT * FROM memory_index ${folderFilter}`
    ).all(...params) as Array<Record<string, unknown>>;

    // Snapshot working memory if exists
    let workingMemorySnapshot: Array<Record<string, unknown>> = [];
    try {
      workingMemorySnapshot = database.prepare(
        'SELECT * FROM working_memory'
      ).all() as Array<Record<string, unknown>>;
    } catch {
      // Table may not exist
    }

    const snapshot = {
      memories,
      workingMemory: workingMemorySnapshot,
      timestamp: new Date().toISOString(),
    };

    const snapshotJson = JSON.stringify(snapshot);
    const compressed = zlib.gzipSync(Buffer.from(snapshotJson));

    const gitBranch = getGitBranch();
    const now = new Date().toISOString();

    const result = (database.prepare(`
      INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `) as Database.Statement).run(
      name,
      now,
      specFolder,
      gitBranch,
      compressed,
      JSON.stringify({ ...metadata, memoryCount: memories.length })
    );

    // Enforce max checkpoints
    const checkpointCount = (database.prepare(
      'SELECT COUNT(*) as count FROM checkpoints'
    ) as Database.Statement).get() as { count: number };

    if (checkpointCount.count > MAX_CHECKPOINTS) {
      database.prepare(`
        DELETE FROM checkpoints WHERE id IN (
          SELECT id FROM checkpoints ORDER BY created_at ASC LIMIT ?
        )
      `).run(checkpointCount.count - MAX_CHECKPOINTS);
    }

    console.error(`[checkpoints] Created checkpoint "${name}" (${compressed.length} bytes compressed)`);

    return {
      id: (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number,
      name,
      createdAt: now,
      specFolder,
      gitBranch,
      snapshotSize: compressed.length,
      metadata: { ...metadata, memoryCount: memories.length },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[checkpoints] createCheckpoint error: ${msg}`);
    return null;
  }
}

function listCheckpoints(specFolder: string | null = null, limit: number = 50): CheckpointInfo[] {
  const database = getDatabase();

  try {
    const folderFilter = specFolder ? 'WHERE spec_folder = ?' : '';
    const params: Array<string | number> = specFolder ? [specFolder] : [];
    params.push(limit);

    const rows = database.prepare(`
      SELECT id, name, created_at, spec_folder, git_branch, LENGTH(memory_snapshot) as snapshot_size, metadata
      FROM checkpoints ${folderFilter}
      ORDER BY created_at DESC
      LIMIT ?
    `).all(...params) as Array<Record<string, unknown>>;

    return rows.map(row => ({
      id: row.id as number,
      name: row.name as string,
      createdAt: row.created_at as string,
      specFolder: row.spec_folder as string | null,
      gitBranch: row.git_branch as string | null,
      snapshotSize: (row.snapshot_size as number) || 0,
      metadata: row.metadata ? JSON.parse(row.metadata as string) : {},
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[checkpoints] listCheckpoints error: ${msg}`);
    return [];
  }
}

function getCheckpoint(nameOrId: string | number): CheckpointEntry | null {
  const database = getDatabase();

  try {
    const row = typeof nameOrId === 'number'
      ? database.prepare('SELECT * FROM checkpoints WHERE id = ?').get(nameOrId)
      : database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(nameOrId);

    return (row as CheckpointEntry) || null;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[checkpoints] getCheckpoint error: ${msg}`);
    return null;
  }
}

function restoreCheckpoint(nameOrId: string | number, clearExisting: boolean = false): RestoreResult {
  const database = getDatabase();
  const result: RestoreResult = { restored: 0, skipped: 0, errors: [], workingMemoryRestored: 0 };

  try {
    const checkpoint = getCheckpoint(nameOrId);
    if (!checkpoint || !checkpoint.memory_snapshot) {
      result.errors.push('Checkpoint not found or empty');
      return result;
    }

    // Decompress snapshot
    const decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
    const snapshot = JSON.parse(decompressed.toString());

    if (!snapshot.memories || !Array.isArray(snapshot.memories)) {
      result.errors.push('Invalid snapshot format');
      return result;
    }

    // T107 FIX: Validate every row BEFORE any DB mutations.
    // Reject the entire restore on schema violations to prevent
    // partial restores or silent NULL insertions.
    if (snapshot.memories.length > 0) {
      try {
        for (let i = 0; i < snapshot.memories.length; i++) {
          validateMemoryRow(snapshot.memories[i], i);
        }
      } catch (validationError: unknown) {
        const msg = validationError instanceof Error ? validationError.message : String(validationError);
        result.errors.push(`Schema validation failed: ${msg}`);
        return result;
      }
    }

    // T101 FIX: Transaction-wrap checkpoint restore to prevent data loss.
    // When clearExisting=true, the DELETE and all INSERTs must be atomic.
    // If any INSERT fails after DELETE, ROLLBACK restores original data.
    // Previously, individual insert errors were silently swallowed inside
    // the transaction, allowing COMMIT after DELETE + partial inserts = data loss.
    const restoreTx = database.transaction(() => {
      // Clear existing data if requested
      if (clearExisting) {
        database.prepare('DELETE FROM memory_index').run();
        try { database.prepare('DELETE FROM vec_memories').run(); } catch { /* table may not exist */ }
      }

      const txErrors: string[] = [];

      for (const memory of snapshot.memories) {
        try {
          // P4-11 FIX: When clearExisting=false, check for duplicate file_path
          // before inserting. INSERT OR REPLACE only handles ID-based conflicts,
          // but a memory with the same file_path under a different ID would
          // create a true duplicate.
          if (!clearExisting) {
            const existingByPath = database.prepare(
              'SELECT id FROM memory_index WHERE file_path = ? AND id != ?'
            ).get(memory.file_path, memory.id) as { id: number } | undefined;

            if (existingByPath) {
              console.error(`[checkpoints] Skipping restore of memory ${memory.id}: file_path "${memory.file_path}" already exists as memory ${existingByPath.id}`);
              result.skipped++;
              continue;
            }
          }
          // UPSERT: restore memory data
          database.prepare(`
            INSERT OR REPLACE INTO memory_index (
              id, spec_folder, file_path, anchor_id, title, trigger_phrases,
              importance_weight, created_at, updated_at, embedding_model,
              embedding_generated_at, embedding_status, importance_tier,
              confidence, stability, difficulty, last_review, review_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            memory.id, memory.spec_folder, memory.file_path, memory.anchor_id,
            memory.title, memory.trigger_phrases, memory.importance_weight,
            memory.created_at, memory.updated_at, memory.embedding_model,
            memory.embedding_generated_at, memory.embedding_status,
            memory.importance_tier, memory.confidence || 0.5,
            memory.stability || 1.0, memory.difficulty || 5.0,
            memory.last_review, memory.review_count || 0
          );
          result.restored++;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          txErrors.push(`Memory ${memory.id}: ${msg}`);
          result.skipped++;
        }
      }

      // T213: Restore working memory state from checkpoint snapshot.
      // The working_memory table holds session-based attention data that must
      // survive checkpoint save/restore cycles.
      if (Array.isArray(snapshot.workingMemory) && snapshot.workingMemory.length > 0) {
        // Ensure working_memory table exists
        try {
          database.exec(`
            CREATE TABLE IF NOT EXISTS working_memory (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_id TEXT NOT NULL,
              memory_id INTEGER NOT NULL,
              attention_score REAL DEFAULT 1.0,
              added_at TEXT DEFAULT CURRENT_TIMESTAMP,
              last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
              focus_count INTEGER DEFAULT 1,
              event_counter INTEGER NOT NULL DEFAULT 0,
              mention_count INTEGER NOT NULL DEFAULT 0,
              source_tool TEXT,
              source_call_id TEXT,
              extraction_rule_id TEXT,
              redaction_applied INTEGER NOT NULL DEFAULT 0,
              UNIQUE(session_id, memory_id),
              FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
            )
          `);

          const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
            .map(column => column.name);
          if (!wmColumns.includes('event_counter')) {
            database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
          }
          if (!wmColumns.includes('mention_count')) {
            database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
          }
          if (!wmColumns.includes('source_tool')) {
            database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
          }
          if (!wmColumns.includes('source_call_id')) {
            database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
          }
          if (!wmColumns.includes('extraction_rule_id')) {
            database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
          }
          if (!wmColumns.includes('redaction_applied')) {
            database.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
          }
        } catch {
          // Table may already exist with different schema — proceed anyway
        }

        if (clearExisting) {
          try { database.prepare('DELETE FROM working_memory').run(); } catch { /* table may not exist */ }
        }

        for (const wmEntry of snapshot.workingMemory) {
          try {
            database.prepare(`
              INSERT OR REPLACE INTO working_memory (
                id, session_id, memory_id, attention_score,
                added_at, last_focused, focus_count,
                event_counter, mention_count,
                source_tool, source_call_id, extraction_rule_id, redaction_applied
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              wmEntry.id,
              wmEntry.session_id,
              wmEntry.memory_id,
              wmEntry.attention_score ?? 1.0,
              wmEntry.added_at,
              wmEntry.last_focused,
              wmEntry.focus_count ?? 1,
              wmEntry.event_counter ?? 0,
              wmEntry.mention_count ?? 0,
              wmEntry.source_tool ?? null,
              wmEntry.source_call_id ?? null,
              wmEntry.extraction_rule_id ?? null,
              wmEntry.redaction_applied ?? 0
            );
            result.workingMemoryRestored++;
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            txErrors.push(`WorkingMemory ${wmEntry.id}: ${msg}`);
          }
        }
      }

      // T101: When clearExisting=true, any insert error means data loss risk.
      // Throw to trigger ROLLBACK — this undoes both the DELETEs and partial INSERTs,
      // leaving original data intact.
      if (clearExisting && txErrors.length > 0) {
        // Reset counters — ROLLBACK will undo all DB changes
        result.restored = 0;
        result.skipped = 0;
        result.workingMemoryRestored = 0;
        result.errors = txErrors;
        throw new Error(
          `Restore aborted: ${txErrors.length} error(s) during restore with clearExisting=true. ` +
          `Transaction rolled back to prevent data loss. First error: ${txErrors[0]}`
        );
      }

      // For non-clearExisting, partial failures are acceptable (no data was deleted)
      if (txErrors.length > 0) {
        result.errors.push(...txErrors);
      }
    });

    restoreTx();

    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    result.errors.push(msg);
    console.warn(`[checkpoints] restoreCheckpoint error: ${msg}`);
  }

  return result;
}

function deleteCheckpoint(nameOrId: string | number): boolean {
  const database = getDatabase();

  try {
    const result = typeof nameOrId === 'number'
      ? (database.prepare('DELETE FROM checkpoints WHERE id = ?') as Database.Statement).run(nameOrId)
      : (database.prepare('DELETE FROM checkpoints WHERE name = ?') as Database.Statement).run(nameOrId);

    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[checkpoints] deleteCheckpoint error: ${msg}`);
    return false;
  }
}

/* -------------------------------------------------------------
   8. EXPORTS
----------------------------------------------------------------*/

export {
  MAX_CHECKPOINTS,

  init,
  getDatabase,
  getGitBranch,
  validateMemoryRow,
  createCheckpoint,
  listCheckpoints,
  getCheckpoint,
  restoreCheckpoint,
  deleteCheckpoint,
};

export type {
  CheckpointEntry,
  CheckpointInfo,
  CreateCheckpointOptions,
  RestoreResult,
};
