/**
 * SQLite Schema for Memory Storage
 * @module features/memory/storage/schema
 */

import { Database } from "bun:sqlite";

export const SCHEMA_VERSION = 1;

/**
 * Initialize the memory database schema
 * Creates tables, indexes, FTS5 virtual table, and triggers
 */
export function initializeSchema(db: Database): void {
  // Enable WAL mode for better concurrency and performance
  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA synchronous = NORMAL;");
  db.run("PRAGMA cache_size = -64000;"); // 64MB cache
  db.run("PRAGMA temp_store = MEMORY;");
  db.run("PRAGMA busy_timeout = 5000;");

  // Create main memories table
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'observation',
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      facts TEXT DEFAULT '[]',
      concepts TEXT DEFAULT '[]',
      source_files TEXT DEFAULT '[]',
      importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
      visibility TEXT DEFAULT 'public',
      phase TEXT,
      session_id TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch()),
      accessed_at INTEGER DEFAULT (unixepoch()),
      access_count INTEGER DEFAULT 0
    )
  `);

  // Create indexes for common queries
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_importance ON memories(importance)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(created_at)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_phase ON memories(phase)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_visibility ON memories(visibility)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(session_id)"
  );

  // Check if FTS5 table exists before creating
  const ftsExists = db
    .query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='memories_fts'"
    )
    .get();

  if (!ftsExists) {
    // Create FTS5 virtual table for full-text search
    // Using external content table for space efficiency
    db.run(`
      CREATE VIRTUAL TABLE memories_fts USING fts5(
        title,
        content,
        facts,
        concepts,
        content='memories',
        content_rowid='id',
        tokenize='porter unicode61 remove_diacritics 2',
        prefix='2 3'
      )
    `);

    // Populate FTS index with existing data (if any)
    db.run(`
      INSERT INTO memories_fts(rowid, title, content, facts, concepts)
      SELECT id, title, content, facts, concepts FROM memories
    `);
  }

  // Create triggers to keep FTS index synchronized
  // Check if triggers exist before creating
  const triggerAiExists = db
    .query(
      "SELECT name FROM sqlite_master WHERE type='trigger' AND name='memories_ai'"
    )
    .get();

  if (!triggerAiExists) {
    // After INSERT trigger
    db.run(`
      CREATE TRIGGER memories_ai AFTER INSERT ON memories BEGIN
        INSERT INTO memories_fts(rowid, title, content, facts, concepts)
        VALUES (new.id, new.title, new.content, new.facts, new.concepts);
      END
    `);

    // After DELETE trigger
    db.run(`
      CREATE TRIGGER memories_ad AFTER DELETE ON memories BEGIN
        INSERT INTO memories_fts(memories_fts, rowid, title, content, facts, concepts)
        VALUES ('delete', old.id, old.title, old.content, old.facts, old.concepts);
      END
    `);

    // After UPDATE trigger
    db.run(`
      CREATE TRIGGER memories_au AFTER UPDATE ON memories BEGIN
        INSERT INTO memories_fts(memories_fts, rowid, title, content, facts, concepts)
        VALUES ('delete', old.id, old.title, old.content, old.facts, old.concepts);
        INSERT INTO memories_fts(rowid, title, content, facts, concepts)
        VALUES (new.id, new.title, new.content, new.facts, new.concepts);
      END
    `);
  }

  // Create schema version table
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER DEFAULT (unixepoch())
    )
  `);

  // Insert current schema version if not exists
  db.run(`
    INSERT OR IGNORE INTO schema_version (version) VALUES (${SCHEMA_VERSION})
  `);
}

/**
 * Check if schema needs migration
 */
export function getSchemaVersion(db: Database): number {
  try {
    const row = db
      .query("SELECT MAX(version) as version FROM schema_version")
      .get() as { version: number | null } | null;
    return row?.version ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Run schema migrations if needed
 */
export function migrateSchema(db: Database): void {
  const currentVersion = getSchemaVersion(db);

  if (currentVersion < SCHEMA_VERSION) {
    // Future migrations would go here
    // Example:
    // if (currentVersion < 2) {
    //   db.run("ALTER TABLE memories ADD COLUMN new_field TEXT");
    //   db.run("INSERT INTO schema_version (version) VALUES (2)");
    // }

    console.log(
      `[Memory] Migrated schema from v${currentVersion} to v${SCHEMA_VERSION}`
    );
  }
}

/**
 * Optimize the FTS5 index
 * Should be called periodically for best performance
 */
export function optimizeFts(db: Database): void {
  db.run("INSERT INTO memories_fts(memories_fts) VALUES('optimize')");
}

/**
 * Rebuild the FTS5 index from scratch
 * Use if index becomes corrupted
 */
export function rebuildFts(db: Database): void {
  db.run("INSERT INTO memories_fts(memories_fts) VALUES('rebuild')");
}

/**
 * Get database statistics
 */
export function getStats(db: Database): {
  totalMemories: number;
  byType: Record<string, number>;
  byVisibility: Record<string, number>;
  oldestMemory: number | null;
  newestMemory: number | null;
} {
  const total = db
    .query("SELECT COUNT(*) as count FROM memories")
    .get() as { count: number };

  const byType = db
    .query("SELECT type, COUNT(*) as count FROM memories GROUP BY type")
    .all() as Array<{ type: string; count: number }>;

  const byVisibility = db
    .query(
      "SELECT visibility, COUNT(*) as count FROM memories GROUP BY visibility"
    )
    .all() as Array<{ visibility: string; count: number }>;

  const oldest = db
    .query("SELECT MIN(created_at) as ts FROM memories")
    .get() as { ts: number | null };

  const newest = db
    .query("SELECT MAX(created_at) as ts FROM memories")
    .get() as { ts: number | null };

  return {
    totalMemories: total.count,
    byType: Object.fromEntries(byType.map((r) => [r.type, r.count])),
    byVisibility: Object.fromEntries(
      byVisibility.map((r) => [r.visibility, r.count])
    ),
    oldestMemory: oldest.ts,
    newestMemory: newest.ts,
  };
}
