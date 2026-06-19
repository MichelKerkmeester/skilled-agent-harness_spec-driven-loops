import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  backfillBitemporalWindow,
  createSchema,
  ensureSchemaVersion,
  migrateConstitutionalTier,
  rollbackBitemporalWindowSchema,
  rollbackRetentionForgettingSchema,
  rollbackSemanticEdgeLayerSchema,
  runMigrations,
  SCHEMA_VERSION,
  validateBackwardCompatibility,
  validateLineageSchemaSupport,
} from '../lib/search/vector-index-schema';

function createTestDatabase(): Database.Database {
  const database = new Database(':memory:');
  createSchema(database, {
    sqlite_vec_available: false,
    get_embedding_dim: () => 4,
  });
  ensureSchemaVersion(database);
  return database;
}

function getColumnNames(database: Database.Database, tableName: string): string[] {
  return (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
    .map((column) => column.name);
}

function createLegacyBitemporalDatabase(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      valid_at TEXT,
      invalid_at TEXT
    );
    CREATE TABLE memory_lineage (
      memory_id INTEGER PRIMARY KEY,
      logical_key TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      root_memory_id INTEGER NOT NULL,
      predecessor_memory_id INTEGER,
      superseded_by_memory_id INTEGER,
      valid_from TEXT NOT NULL,
      valid_to TEXT,
      transition_event TEXT NOT NULL,
      actor TEXT DEFAULT 'system',
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO causal_edges (
      id, source_id, target_id, relation, extracted_at, valid_at, invalid_at
    ) VALUES
      (1, '10', '20', 'supports', '2026-01-01T00:00:10.000Z', '2026-01-01T00:00:00.000Z', NULL),
      (2, '20', '30', 'contradicts', '2026-02-01T00:00:10.000Z', '2026-02-01T00:00:00.000Z', '2026-02-03T00:00:00.000Z');
    INSERT INTO memory_lineage (
      memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
      superseded_by_memory_id, valid_from, valid_to, transition_event, actor, metadata, created_at
    ) VALUES
      (10, 'spec|a', 1, 10, NULL, NULL, '2026-01-01T00:00:00.000Z', NULL, 'CREATE', 'system', NULL, '2026-01-01T00:00:05.000Z'),
      (20, 'spec|b', 1, 20, NULL, 21, '2026-02-01T00:00:00.000Z', '2026-02-03T00:00:00.000Z', 'CREATE', 'system', NULL, '2026-02-01T00:00:05.000Z');
  `);
  return database;
}

describe('vector-index schema migration refinements', () => {
  const openDatabases = new Set<Database.Database>();

  afterEach(() => {
    for (const database of openDatabases) {
      database.close();
      openDatabases.delete(database);
    }
  });

  it('keeps schema_version unchanged when a required migration index build fails', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('DROP INDEX IF EXISTS idx_quality_score');
    database.prepare('UPDATE schema_version SET version = 14 WHERE id = 1').run();

    const originalExec = database.exec.bind(database);
    (database as Database.Database & { exec: typeof database.exec }).exec = ((sql: string) => {
      if (sql.includes('CREATE INDEX IF NOT EXISTS idx_quality_score')) {
        throw new Error('simulated idx_quality_score failure');
      }
      return originalExec(sql);
    }) as typeof database.exec;

    expect(() => ensureSchemaVersion(database)).toThrow(/simulated idx_quality_score failure/);

    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(versionRow.version).toBe(14);

    const compatibility = validateBackwardCompatibility(database);
    expect(compatibility.compatible).toBe(false);
    expect(compatibility.missingIndexes).toContain('idx_quality_score');
  });

  it('canonicalizes session and history spec folders during the v23 upgrade', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    const staleSpecFolder = 'current';
    const canonicalSpecFolder = '02--domain/010-feature';
    const filePath = '/workspace/specs/02--domain/010-feature/implementation-summary.md';
    const now = '2026-03-28T12:00:00.000Z';

    database.exec(`
      CREATE TABLE IF NOT EXISTS session_state (
        session_id TEXT PRIMARY KEY,
        spec_folder TEXT
      )
    `);

    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, title, created_at, updated_at,
        importance_tier, context_type, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      101,
      staleSpecFolder,
      filePath,
      'Migration Target',
      now,
      now,
      'normal',
      'general',
      'pending',
    );

    database.prepare(`
      INSERT INTO memory_history (
        id, memory_id, spec_folder, prev_value, new_value, event, actor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('history-null-folder', 101, null, null, 'seed', 'ADD', 'system');
    database.prepare(`
      INSERT INTO memory_history (
        id, memory_id, spec_folder, prev_value, new_value, event, actor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('history-stale-folder', 101, staleSpecFolder, 'before', 'after', 'UPDATE', 'system');
    database.prepare('INSERT INTO session_state (session_id, spec_folder) VALUES (?, ?)').run('session-1', staleSpecFolder);

    database.prepare('UPDATE schema_version SET version = 22 WHERE id = 1').run();

    ensureSchemaVersion(database);

    const memoryRow = database.prepare('SELECT spec_folder FROM memory_index WHERE id = ?').get(101) as { spec_folder: string };
    const sessionRow = database.prepare('SELECT spec_folder FROM session_state WHERE session_id = ?').get('session-1') as { spec_folder: string };
    const historyRows = database.prepare(`
      SELECT id, spec_folder FROM memory_history WHERE memory_id = ? ORDER BY id
    `).all(101) as Array<{ id: string; spec_folder: string | null }>;

    expect(memoryRow.spec_folder).toBe(canonicalSpecFolder);
    expect(sessionRow.spec_folder).toBe(canonicalSpecFolder);
    expect(historyRows).toEqual([
      { id: 'history-null-folder', spec_folder: canonicalSpecFolder },
      { id: 'history-stale-folder', spec_folder: canonicalSpecFolder },
    ]);
  });

  it('creates trigger-cache and temporal-contiguity indexes during the v24 upgrade', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('DROP INDEX IF EXISTS idx_trigger_cache_source');
    database.exec('DROP INDEX IF EXISTS idx_spec_folder_created_at');
    database.prepare('UPDATE schema_version SET version = 23 WHERE id = 1').run();

    ensureSchemaVersion(database);

    const indexNames = (database.prepare('PRAGMA index_list(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name);

    expect(indexNames).toEqual(expect.arrayContaining([
      'idx_trigger_cache_source',
      'idx_spec_folder_created_at',
    ]));
  });

  it('adds causal-edge anchor columns and indexes during the v26 upgrade', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE schema_version (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        version INTEGER NOT NULL,
        updated_at TEXT
      );
      INSERT INTO schema_version (id, version, updated_at) VALUES (1, 25, datetime('now'));

      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relation TEXT NOT NULL,
        strength REAL DEFAULT 1.0,
        evidence TEXT,
        extracted_at TEXT DEFAULT (datetime('now')),
        created_by TEXT DEFAULT 'manual',
        last_accessed TEXT,
        UNIQUE(source_id, target_id, relation)
      );

      INSERT INTO causal_edges (id, source_id, target_id, relation)
      VALUES (1, '1', '2', 'supports');
    `);

    runMigrations(database, 25, 26);

    const columns = (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    const indexes = (database.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='causal_edges'").all() as Array<{ name: string }>)
      .map((row) => row.name);
    const row = database.prepare(`
      SELECT id, source_anchor, target_anchor
      FROM causal_edges
      WHERE id = 1
    `).get() as { id: number; source_anchor: string | null; target_anchor: string | null };

    expect(columns).toEqual(expect.arrayContaining(['source_anchor', 'target_anchor']));
    expect(indexes).toEqual(expect.arrayContaining([
      'idx_causal_edges_source_anchor',
      'idx_causal_edges_target_anchor',
    ]));
    expect(row).toEqual({
      id: 1,
      source_anchor: null,
      target_anchor: null,
    });
  });

  it('fails fast on legacy memory_index schemas that cannot store constitutional tier values', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('critical', 'important', 'normal', 'temporary', 'deprecated')),
        context_type TEXT DEFAULT 'general',
        session_id TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);

    expect(() => migrateConstitutionalTier(database)).toThrow(/constitutional support/i);
  });

  it('preserves legacy memory_conflicts audit rows when upgrading to the unified v12 schema', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY
      );

      CREATE TABLE memory_conflicts (
        id INTEGER PRIMARY KEY,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        new_memory_hash TEXT NOT NULL,
        existing_memory_id INTEGER,
        similarity_score REAL,
        action TEXT,
        contradiction_detected INTEGER DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
      );
    `);

    database.prepare('INSERT INTO memory_index (id) VALUES (?)').run(7);
    database.prepare(`
      INSERT INTO memory_conflicts (
        id, timestamp, new_memory_hash, existing_memory_id,
        similarity_score, action, contradiction_detected, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      1,
      '2026-03-27T10:00:00.000Z',
      'hash-1',
      7,
      0.91,
      'UPDATE',
      1,
      'legacy note',
    );

    runMigrations(database, 11, 12);

    const columns = (database.prepare('PRAGMA table_info(memory_conflicts)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toContain('similarity');
    expect(columns).toContain('reason');
    expect(columns).not.toContain('similarity_score');
    expect(columns).not.toContain('notes');

    const row = database.prepare(`
      SELECT id, timestamp, new_memory_hash, existing_memory_id, similarity, reason, contradiction_detected
      FROM memory_conflicts
      WHERE id = 1
    `).get() as {
      id: number;
      timestamp: string;
      new_memory_hash: string;
      existing_memory_id: number;
      similarity: number;
      reason: string | null;
      contradiction_detected: number;
    };

    expect(row).toEqual({
      id: 1,
      timestamp: '2026-03-27T10:00:00.000Z',
      new_memory_hash: 'hash-1',
      existing_memory_id: 7,
      similarity: 0.91,
      reason: 'legacy note',
      contradiction_detected: 1,
    });
  });

  it('migrates legacy embedding_cache primary keys so dimension variants can coexist', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec(`
      DROP TABLE embedding_cache;
      CREATE TABLE embedding_cache (
        content_hash TEXT NOT NULL,
        model_id TEXT NOT NULL,
        embedding BLOB NOT NULL,
        dimensions INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (content_hash, model_id)
      );
    `);

    database.prepare(`
      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('hash-1', 'model-A', Buffer.from([1, 2, 3]), 768, '2026-03-28T12:00:00.000Z', '2026-03-28T12:00:00.000Z');

    createSchema(database, {
      sqlite_vec_available: false,
      get_embedding_dim: () => 4,
    });

    const tableSql = database.prepare(`
      SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'embedding_cache'
    `).get() as { sql: string };
    expect(tableSql.sql).toMatch(/PRIMARY KEY \(content_hash, profile_key, input_kind, model_id, dimensions\)/);

    database.prepare(`
      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('hash-1', 'model-A', Buffer.from([4, 5, 6]), 1024, '2026-03-28T12:01:00.000Z', '2026-03-28T12:01:00.000Z');

    const rows = database.prepare(`
      SELECT dimensions
      FROM embedding_cache
      WHERE content_hash = ? AND model_id = ?
      ORDER BY dimensions ASC
    `).all('hash-1', 'model-A') as Array<{ dimensions: number }>;
    expect(rows).toEqual([{ dimensions: 768 }, { dimensions: 1024 }]);
  });

  it('creates save-path optimization indexes for canonical-path and scoped hash lookups', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    const indexes = database.prepare(`
      SELECT name, sql
      FROM sqlite_master
      WHERE type = 'index'
        AND name IN ('idx_save_parent_content_hash_scope', 'idx_save_parent_canonical_path')
      ORDER BY name
    `).all() as Array<{ name: string; sql: string | null }>;

    expect(indexes).toHaveLength(2);
    expect(indexes).toEqual([
      expect.objectContaining({
        name: 'idx_save_parent_canonical_path',
        sql: expect.stringContaining('WHERE parent_id IS NULL'),
      }),
      expect.objectContaining({
        name: 'idx_save_parent_content_hash_scope',
        sql: expect.stringContaining('WHERE parent_id IS NULL'),
      }),
    ]);
    expect(indexes[0]?.sql).toContain('spec_folder, canonical_file_path, id DESC');
    expect(indexes[1]?.sql).toContain('spec_folder');
    expect(indexes[1]?.sql).toContain('content_hash');
    expect(indexes[1]?.sql).toContain('embedding_status');
    expect(indexes[1]?.sql).toContain('id DESC');
  });

  it('advances a DB with duplicate active logical keys to v30 by deprecating losers before the v28 unique index', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    // Simulate a pre-existing DB that predates the active-row guard: drop the unique index
    // and rewind the schema version so migrations 28..30 re-run on dirty data.
    database.exec('DROP INDEX IF EXISTS idx_memory_logical_key_active_unique');

    const sharedPath = '/workspace/specs/012-dup/spec.md';
    const insertRow = database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, canonical_file_path, title,
        created_at, updated_at, importance_tier, context_type, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'general', 'success')
    `);

    // Two ACTIVE rows for the SAME logical key (same spec_folder + path + null scope/anchor).
    // The 'important' row should win; the 'normal' row should be deprecated.
    insertRow.run(201, '012-dup', sharedPath, sharedPath, 'Loser', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', 'normal');
    insertRow.run(202, '012-dup', sharedPath, sharedPath, 'Winner', '2026-01-02T00:00:00.000Z', '2026-01-02T00:00:00.000Z', 'important');
    // An independent row for a different logical key must be left untouched.
    const otherPath = '/workspace/specs/013-other/spec.md';
    insertRow.run(203, '013-other', otherPath, otherPath, 'Independent', '2026-01-03T00:00:00.000Z', '2026-01-03T00:00:00.000Z', 'normal');

    database.prepare('UPDATE schema_version SET version = 27 WHERE id = 1').run();

    // Must NOT throw — the deprecate-before-create pre-pass clears the duplicate actives.
    expect(() => ensureSchemaVersion(database)).not.toThrow();

    // Schema advanced fully to the current terminal version.
    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(versionRow.version).toBe(SCHEMA_VERSION);

    // The unique index now exists.
    const indexNames = (database.prepare('PRAGMA index_list(memory_index)').all() as Array<{ name: string }>)
      .map((row) => row.name);
    expect(indexNames).toContain('idx_memory_logical_key_active_unique');

    // Exactly one of the duplicate rows stays active; the lower-tier one is deprecated.
    const dupRows = database.prepare('SELECT id, importance_tier FROM memory_index WHERE id IN (201, 202) ORDER BY id')
      .all() as Array<{ id: number; importance_tier: string }>;
    expect(dupRows).toEqual([
      { id: 201, importance_tier: 'deprecated' },
      { id: 202, importance_tier: 'important' },
    ]);

    // The independent row keeps its tier.
    const independent = database.prepare('SELECT importance_tier FROM memory_index WHERE id = 203')
      .get() as { importance_tier: string };
    expect(independent.importance_tier).toBe('normal');

    // The active-row guard now actually holds: inserting another active dup must fail.
    expect(() => {
      database.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, canonical_file_path, title,
          created_at, updated_at, importance_tier, context_type, embedding_status
        ) VALUES (204, '012-dup', ?, ?, 'Another', '2026-01-04T00:00:00.000Z', '2026-01-04T00:00:00.000Z', 'normal', 'general', 'success')
      `).run(sharedPath, sharedPath);
    }).toThrow();
  });

  it('reports a v30 DB missing the active-row unique index as backward-incompatible', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    // A healthy fully-migrated DB is compatible and carries the guard.
    const healthy = validateBackwardCompatibility(database);
    expect(healthy.compatible).toBe(true);
    expect(healthy.missingIndexes).not.toContain('idx_memory_logical_key_active_unique');

    // Simulate a DB whose active-row uniqueness guard was dropped after migration.
    database.exec('DROP INDEX IF EXISTS idx_memory_logical_key_active_unique');

    const degraded = validateBackwardCompatibility(database);
    expect(degraded.compatible).toBe(false);
    expect(degraded.missingIndexes).toContain('idx_memory_logical_key_active_unique');
  });

  it('creates causal edge tombstone schema during the v32 upgrade without touching active edges', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('DROP TABLE IF EXISTS causal_edge_tombstones');
    database.prepare('UPDATE schema_version SET version = 31 WHERE id = 1').run();
    database.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, evidence, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run('101', '102', 'supports', 'active edge survives migration', 'vitest');

    ensureSchemaVersion(database);

    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(versionRow.version).toBe(SCHEMA_VERSION);

    const columns = (database.prepare('PRAGMA table_info(causal_edge_tombstones)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toEqual(expect.arrayContaining([
      'id',
      'source_id',
      'target_id',
      'relation',
      'tombstoned_at',
      'reason',
      'lifecycle_generation',
      'restore_metadata',
    ]));

    const indexes = (database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'causal_edge_tombstones'
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(indexes).toEqual(expect.arrayContaining([
      'idx_causal_edge_tombstones_identity',
      'idx_causal_edge_tombstones_tombstoned_at',
      'idx_causal_edge_tombstones_reason',
    ]));

    const activeCount = database.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number };
    const tombstoneCount = database.prepare('SELECT COUNT(*) AS count FROM causal_edge_tombstones').get() as { count: number };
    expect(activeCount.count).toBe(1);
    expect(tombstoneCount.count).toBe(0);
  });

  it('adds generated causal-edge provenance columns during the v33 upgrade without touching active edges', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('ALTER TABLE causal_edges RENAME TO causal_edges_with_provenance');
    database.exec(`
      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        source_anchor TEXT,
        target_anchor TEXT,
        relation TEXT NOT NULL,
        strength REAL DEFAULT 1.0,
        evidence TEXT,
        extracted_at TEXT DEFAULT (datetime('now')),
        created_by TEXT DEFAULT 'manual',
        last_accessed TEXT,
        UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)
      )
    `);
    database.exec(`
      INSERT INTO causal_edges (
        id, source_id, target_id, source_anchor, target_anchor, relation,
        strength, evidence, extracted_at, created_by, last_accessed
      )
      SELECT id, source_id, target_id, source_anchor, target_anchor, relation,
        strength, evidence, extracted_at, created_by, last_accessed
      FROM causal_edges_with_provenance;
      DROP TABLE causal_edges_with_provenance;
    `);
    database.prepare('UPDATE schema_version SET version = 32 WHERE id = 1').run();
    database.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, evidence, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run('301', '302', 'derived_from', 'active edge survives provenance migration', 'manual');

    ensureSchemaVersion(database);

    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(versionRow.version).toBe(SCHEMA_VERSION);

    const columns = (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toEqual(expect.arrayContaining(['confidence', 'extraction_method']));

    const row = database.prepare(`
      SELECT confidence, extraction_method, evidence, created_by
      FROM causal_edges
      WHERE source_id = '301' AND target_id = '302'
    `).get() as { confidence: number; extraction_method: string; evidence: string; created_by: string };
    expect(row).toEqual({
      confidence: 1,
      extraction_method: 'manual',
      evidence: 'active edge survives provenance migration',
      created_by: 'manual',
    });
  });

  it('creates trigger embedding schema during the v34 upgrade without touching source memories', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    database.exec('DROP INDEX IF EXISTS idx_memory_trigger_embeddings_status');
    database.exec('DROP TABLE IF EXISTS memory_trigger_embeddings');
    database.prepare('UPDATE schema_version SET version = 33 WHERE id = 1').run();
    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, title, trigger_phrases,
        created_at, updated_at, importance_tier, context_type, embedding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      401,
      'schema/backfill',
      '/workspace/schema/backfill/spec.md',
      'Trigger Source',
      JSON.stringify(['save context']),
      '2026-06-10T00:00:00.000Z',
      '2026-06-10T00:00:00.000Z',
      'normal',
      'implementation',
      'pending',
    );

    ensureSchemaVersion(database);

    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(versionRow.version).toBe(SCHEMA_VERSION);

    const columns = (database.prepare('PRAGMA table_info(memory_trigger_embeddings)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toEqual(expect.arrayContaining([
      'memory_id',
      'phrase_hash',
      'profile_key',
      'input_kind',
      'model_id',
      'dimensions',
      'embedding_status',
      'failure_reason',
      'created_at',
      'updated_at',
    ]));

    const indexes = (database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'memory_trigger_embeddings'
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(indexes).toContain('idx_memory_trigger_embeddings_status');

    const sourceCount = database.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE id = 401').get() as { count: number };
    const derivedCount = database.prepare('SELECT COUNT(*) AS count FROM memory_trigger_embeddings').get() as { count: number };
    expect(sourceCount.count).toBe(1);
    expect(derivedCount.count).toBe(0);
  });

  it('adds source_kind during the v35 upgrade and backfills legacy rows conservatively', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        provenance_source TEXT
      );
      INSERT INTO memory_index (id, provenance_source) VALUES
        (1, 'manual'),
        (2, 'memory_index_scan'),
        (3, 'feedback-validator'),
        (4, NULL);
    `);

    runMigrations(database, 34, 35);
    runMigrations(database, 34, 35);

    const sourceKindColumns = (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .filter((column) => column.name === 'source_kind');
    expect(sourceKindColumns).toHaveLength(1);

    const rows = database.prepare(`
      SELECT id, source_kind
      FROM memory_index
      ORDER BY id ASC
    `).all() as Array<{ id: number; source_kind: string }>;
    expect(rows).toEqual([
      { id: 1, source_kind: 'human' },
      { id: 2, source_kind: 'import' },
      { id: 3, source_kind: 'feedback' },
      { id: 4, source_kind: 'system' },
    ]);
  });

  it('adds idempotency receipt schema and near-duplicate columns during the v36 upgrade idempotently', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        updated_at TEXT
      );
    `);

    runMigrations(database, 35, 36);
    runMigrations(database, 35, 36);

    const columns = (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toEqual(expect.arrayContaining([
      'near_duplicate_of',
      'last_dedup_checked_at',
    ]));

    const receiptColumns = (database.prepare('PRAGMA table_info(memory_idempotency_receipts)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(receiptColumns).toEqual(expect.arrayContaining([
      'receipt_key',
      'operation',
      'content_hash',
      'request_fingerprint',
      'payload_hash',
      'response_payload',
      'memory_id',
      'created_at',
      'updated_at',
    ]));

    const indexes = (database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'memory_idempotency_receipts'
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(indexes).toContain('idx_memory_idempotency_receipts_operation');

    const nearDuplicateColumns = (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .filter((column) => column.name === 'near_duplicate_of');
    expect(nearDuplicateColumns).toHaveLength(1);
  });

  it('adds tombstone partitions during the v37 upgrade idempotently', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        document_type TEXT,
        updated_at TEXT,
        delete_after TEXT
      );
      INSERT INTO memory_index (id, spec_folder, document_type, updated_at, delete_after)
      VALUES
        (1, 'specs/a', 'spec', '2026-06-10T00:00:00.000Z', NULL),
        (2, 'specs/a', 'plan', '2026-06-10T01:00:00.000Z', '2026-06-09T00:00:00.000Z');
    `);

    runMigrations(database, 36, 37);
    runMigrations(database, 36, 37);
    database.prepare("UPDATE memory_index SET deleted_at = ? WHERE id = 2").run('2026-06-08T00:00:00.000Z');

    const columns = (database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>)
      .map((column) => column.name);
    expect(columns).toContain('deleted_at');

    const indexes = (database.prepare(`
      SELECT name, sql
      FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'memory_index'
        AND name IN ('idx_memory_active_recall', 'idx_memory_purgeable_retention')
      ORDER BY name
    `).all() as Array<{ name: string; sql: string }>);
    expect(indexes).toHaveLength(2);
    expect(indexes[0].sql).toContain('WHERE deleted_at IS NULL');
    expect(indexes[1].sql).toContain('WHERE deleted_at IS NOT NULL');

    const activePlan = database.prepare(`
      EXPLAIN QUERY PLAN
      SELECT id FROM memory_index
      WHERE deleted_at IS NULL AND spec_folder = ?
      ORDER BY updated_at DESC, id DESC
    `).all('specs/a') as Array<{ detail: string }>;
    const purgeablePlan = database.prepare(`
      EXPLAIN QUERY PLAN
      SELECT id FROM memory_index INDEXED BY idx_memory_purgeable_retention
      WHERE deleted_at IS NOT NULL AND delete_after IS NOT NULL
    `).all() as Array<{ detail: string }>;

    expect(activePlan.some((row) => row.detail.includes('idx_memory_active_recall'))).toBe(true);
    expect(purgeablePlan.some((row) => row.detail.includes('idx_memory_purgeable_retention'))).toBe(true);
  });

  it('adds bi-temporal window columns during the v38 upgrade', () => {
    const database = createLegacyBitemporalDatabase();
    openDatabases.add(database);

    runMigrations(database, 37, 38);

    expect(getColumnNames(database, 'causal_edges')).toEqual(expect.arrayContaining([
      'valid_from',
      'valid_to',
      'ingested_at',
      'expired_at',
    ]));
    expect(getColumnNames(database, 'memory_lineage')).toEqual(expect.arrayContaining([
      'valid_from',
      'valid_to',
      'ingested_at',
      'expired_at',
    ]));
  });

  it('backfills bi-temporal windows from legacy edge and lineage timestamps', () => {
    const database = createLegacyBitemporalDatabase();
    openDatabases.add(database);

    runMigrations(database, 37, 38);
    backfillBitemporalWindow(database, 'test backfill rerun');

    const activeEdge = database.prepare(`
      SELECT valid_from, valid_to, ingested_at, expired_at
      FROM causal_edges
      WHERE id = 1
    `).get() as {
      valid_from: string | null;
      valid_to: string | null;
      ingested_at: string | null;
      expired_at: string | null;
    };
    expect(activeEdge).toEqual({
      valid_from: '2026-01-01T00:00:00.000Z',
      valid_to: null,
      ingested_at: '2026-01-01T00:00:10.000Z',
      expired_at: null,
    });

    const closedEdge = database.prepare(`
      SELECT valid_from, valid_to, ingested_at, expired_at
      FROM causal_edges
      WHERE id = 2
    `).get() as {
      valid_from: string | null;
      valid_to: string | null;
      ingested_at: string | null;
      expired_at: string | null;
    };
    expect(closedEdge).toEqual({
      valid_from: '2026-02-01T00:00:00.000Z',
      valid_to: '2026-02-03T00:00:00.000Z',
      ingested_at: '2026-02-01T00:00:10.000Z',
      expired_at: '2026-02-03T00:00:00.000Z',
    });

    const lineage = database.prepare(`
      SELECT ingested_at, expired_at
      FROM memory_lineage
      WHERE memory_id = 20
    `).get() as { ingested_at: string | null; expired_at: string | null };
    expect(lineage).toEqual({
      ingested_at: '2026-02-01T00:00:05.000Z',
      expired_at: '2026-02-03T00:00:00.000Z',
    });
  });

  it('re-runs the v38 migration idempotently without duplicating columns', () => {
    const database = createLegacyBitemporalDatabase();
    openDatabases.add(database);

    runMigrations(database, 37, 38);
    runMigrations(database, 37, 38);

    for (const column of ['valid_from', 'valid_to', 'ingested_at', 'expired_at']) {
      expect(getColumnNames(database, 'causal_edges').filter((name) => name === column)).toHaveLength(1);
    }
    for (const column of ['ingested_at', 'expired_at']) {
      expect(getColumnNames(database, 'memory_lineage').filter((name) => name === column)).toHaveLength(1);
    }
  });

  it('rolls back the v38 window columns without dropping legacy edge columns', () => {
    const database = createLegacyBitemporalDatabase();
    openDatabases.add(database);

    runMigrations(database, 37, 38);
    rollbackBitemporalWindowSchema(database, 'test rollback');
    rollbackBitemporalWindowSchema(database, 'test rollback idempotent');

    expect(getColumnNames(database, 'causal_edges')).toEqual(expect.arrayContaining(['valid_at', 'invalid_at']));
    expect(getColumnNames(database, 'causal_edges')).not.toEqual(expect.arrayContaining([
      'valid_from',
      'valid_to',
      'ingested_at',
      'expired_at',
    ]));
    expect(getColumnNames(database, 'memory_lineage')).not.toEqual(expect.arrayContaining([
      'ingested_at',
      'expired_at',
    ]));
  });

  it('adds retention forgetting and semantic edge schema during the v41 upgrade idempotently', () => {
    const database = new Database(':memory:');
    openDatabases.add(database);

    database.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        quality_score REAL
      );
      INSERT INTO memory_index (id, quality_score)
      VALUES (1, 0.82), (2, NULL);

      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relation TEXT NOT NULL
      );
      INSERT INTO causal_edges (id, source_id, target_id, relation)
      VALUES
        (1, '99', '1', 'supports'),
        (2, '99', '2', 'audit');
    `);

    runMigrations(database, 40, 41);
    runMigrations(database, 40, 41);

    expect(getColumnNames(database, 'memory_index').filter((name) => name === 'retention_trust_score')).toHaveLength(1);
    const rows = database.prepare(`
      SELECT id, retention_trust_score AS retentionTrustScore
      FROM memory_index
      ORDER BY id
    `).all() as Array<{ id: number; retentionTrustScore: number | null }>;
    expect(rows).toEqual([
      { id: 1, retentionTrustScore: 0.82 },
      { id: 2, retentionTrustScore: null },
    ]);

    const indexes = (database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'causal_edges'
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(indexes).toContain('idx_causal_edges_retention_incoming');

    const plan = database.prepare(`
      EXPLAIN QUERY PLAN
      SELECT id
      FROM causal_edges INDEXED BY idx_causal_edges_retention_incoming
      WHERE target_id = ? AND relation = ?
    `).all('1', 'supports') as Array<{ detail: string }>;
    expect(plan.some((row) => row.detail.includes('idx_causal_edges_retention_incoming'))).toBe(true);

    expect(getColumnNames(database, 'causal_edges').filter((name) => name === 'fact_text')).toHaveLength(1);
    const factRows = database.prepare(`
      SELECT id, fact_text AS factText
      FROM causal_edges
      ORDER BY id
    `).all() as Array<{ id: number; factText: string | null }>;
    expect(factRows).toEqual([
      { id: 1, factText: '99 supports 1' },
      { id: 2, factText: '99 audit 2' },
    ]);

    const edgeVectorColumns = getColumnNames(database, 'edge_vector_embeddings');
    expect(edgeVectorColumns).toEqual(expect.arrayContaining([
      'edge_id',
      'profile_key',
      'input_kind',
      'model_id',
      'dimensions',
      'embedding',
      'embedding_status',
      'fact_hash',
    ]));
    const edgeVectorIndexes = (database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'edge_vector_embeddings'
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(edgeVectorIndexes).toEqual(expect.arrayContaining([
      'idx_edge_vector_embeddings_status',
      'idx_edge_vector_embeddings_edge',
    ]));

    rollbackSemanticEdgeLayerSchema(database, 'test semantic rollback');
    rollbackSemanticEdgeLayerSchema(database, 'test semantic rollback idempotent');
    expect(getColumnNames(database, 'causal_edges')).not.toContain('fact_text');
    const semanticTable = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name = 'edge_vector_embeddings'
    `).get() as { name: string } | undefined;
    expect(semanticTable).toBeUndefined();

    rollbackRetentionForgettingSchema(database, 'test rollback');
    rollbackRetentionForgettingSchema(database, 'test rollback idempotent');

    expect(getColumnNames(database, 'memory_index')).not.toContain('retention_trust_score');
    const indexesAfterRollback = (database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'index' AND tbl_name = 'causal_edges'
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(indexesAfterRollback).not.toContain('idx_causal_edges_retention_incoming');
  });

  it('initializes fresh databases with the v38 bi-temporal foundation', () => {
    const database = createTestDatabase();
    openDatabases.add(database);

    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
    expect(SCHEMA_VERSION).toBeGreaterThanOrEqual(38);
    expect(versionRow.version).toBe(SCHEMA_VERSION);
    expect(getColumnNames(database, 'causal_edges')).toEqual(expect.arrayContaining([
      'valid_from',
      'valid_to',
      'ingested_at',
      'expired_at',
    ]));

    const lineageReport = validateLineageSchemaSupport(database);
    expect(lineageReport.compatible).toBe(true);
    expect(lineageReport.missingColumns).toEqual({});
  });
});
