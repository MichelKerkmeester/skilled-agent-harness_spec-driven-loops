// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Persistent Style Database Schema                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const STYLE_DB_SCHEMA_VERSION = 2;
export const DEFAULT_STYLE_DATABASE_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'style-library.sqlite',
);
export const STYLE_DATABASE_POINTER_SUFFIX = '.current.json';

/**
 * Resolve the immutable generation selected by an atomic pointer file.
 *
 * @param {string} [databasePath] - Logical database path.
 * @returns {string} Published generation path, or the direct path for legacy databases.
 */
export function resolvePublishedDatabasePath(databasePath = DEFAULT_STYLE_DATABASE_PATH) {
  const pointerPath = `${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`;
  if (!existsSync(pointerPath)) return databasePath;
  let pointer;
  try {
    pointer = JSON.parse(readFileSync(pointerPath, 'utf8'));
  } catch (cause) {
    const error = new Error('Style database generation pointer is invalid JSON.', { cause });
    error.code = 'generation-pointer-invalid';
    throw error;
  }
  if (pointer?.schemaVersion !== 1
    || typeof pointer.generationHash !== 'string'
    || typeof pointer.databaseFile !== 'string'
    || path.basename(pointer.databaseFile) !== pointer.databaseFile) {
    const error = new Error('Style database generation pointer has an invalid shape.');
    error.code = 'generation-pointer-invalid';
    throw error;
  }
  const publishedPath = path.join(path.dirname(databasePath), pointer.databaseFile);
  if (!existsSync(publishedPath)) {
    const error = new Error('Published style database generation is unavailable.');
    error.code = 'generation-unavailable';
    throw error;
  }
  return publishedPath;
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS style_db_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS styles (
    style_rowid INTEGER PRIMARY KEY,
    style_id TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    lifecycle_state TEXT NOT NULL DEFAULT 'active'
      CHECK (lifecycle_state IN ('active', 'quarantined', 'tombstoned')),
    crawl_status TEXT NOT NULL,
    title TEXT NOT NULL,
    thesis TEXT NOT NULL,
    theme TEXT,
    industry TEXT,
    aggregate_hash TEXT NOT NULL,
    retrieval_hash TEXT NOT NULL,
    quarantine_at TEXT,
    tombstoned_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    CHECK (
      (lifecycle_state = 'active' AND quarantine_at IS NULL AND tombstoned_at IS NULL)
      OR (lifecycle_state = 'quarantined' AND quarantine_at IS NOT NULL AND tombstoned_at IS NULL)
      OR (lifecycle_state = 'tombstoned' AND quarantine_at IS NOT NULL AND tombstoned_at IS NOT NULL)
    )
  ) STRICT;

  CREATE TABLE IF NOT EXISTS style_provenance (
    style_rowid INTEGER PRIMARY KEY REFERENCES styles(style_rowid) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('known', 'missing')),
    source_url TEXT,
    original_url TEXT,
    screenshot_url TEXT,
    source_uuid TEXT,
    captured_at TEXT,
    license_status TEXT NOT NULL,
    rights_known INTEGER NOT NULL CHECK (rights_known IN (0, 1)),
    evidence_scope_json TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS style_artifacts (
    artifact_id INTEGER PRIMARY KEY,
    style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN (
      'canonical', 'tokens', 'design', 'source', 'css-variables', 'tailwind'
    )),
    relative_path TEXT NOT NULL,
    byte_length INTEGER NOT NULL CHECK (byte_length >= 0),
    sha256 TEXT NOT NULL,
    mtime_ns TEXT NOT NULL,
    ctime_ns TEXT NOT NULL,
    UNIQUE (style_rowid, role),
    UNIQUE (style_rowid, relative_path)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS style_terms (
    style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    term_type TEXT NOT NULL CHECK (term_type IN ('facet', 'capability')),
    term TEXT NOT NULL,
    PRIMARY KEY (style_rowid, term_type, term)
  ) WITHOUT ROWID, STRICT;

  CREATE TABLE IF NOT EXISTS style_token_axes (
    style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    axis TEXT NOT NULL,
    token_count INTEGER NOT NULL CHECK (token_count >= 0),
    PRIMARY KEY (style_rowid, axis)
  ) WITHOUT ROWID, STRICT;

  CREATE TABLE IF NOT EXISTS style_sections (
    style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
    name TEXT NOT NULL,
    line_number INTEGER NOT NULL CHECK (line_number > 0),
    PRIMARY KEY (style_rowid, ordinal)
  ) WITHOUT ROWID, STRICT;

  CREATE TABLE IF NOT EXISTS retrieval_documents (
    style_rowid INTEGER PRIMARY KEY REFERENCES styles(style_rowid) ON DELETE CASCADE,
    title TEXT NOT NULL,
    thesis TEXT NOT NULL,
    theme TEXT NOT NULL,
    industry TEXT NOT NULL,
    terms TEXT NOT NULL,
    body TEXT NOT NULL,
    document_json TEXT NOT NULL,
    retrieval_hash TEXT NOT NULL
  ) STRICT;

  CREATE VIRTUAL TABLE IF NOT EXISTS style_fts USING fts5(
    title, thesis, theme, industry, terms, body,
    content='retrieval_documents', content_rowid='style_rowid'
  );

  CREATE TRIGGER IF NOT EXISTS style_fts_insert
  AFTER INSERT ON retrieval_documents BEGIN
    INSERT INTO style_fts(rowid, title, thesis, theme, industry, terms, body)
    VALUES (new.style_rowid, new.title, new.thesis, new.theme, new.industry,
      new.terms, new.body);
  END;

  CREATE TRIGGER IF NOT EXISTS style_fts_update
  AFTER UPDATE ON retrieval_documents BEGIN
    INSERT INTO style_fts(style_fts, rowid, title, thesis, theme, industry, terms, body)
    VALUES ('delete', old.style_rowid, old.title, old.thesis, old.theme,
      old.industry, old.terms, old.body);
    INSERT INTO style_fts(rowid, title, thesis, theme, industry, terms, body)
    VALUES (new.style_rowid, new.title, new.thesis, new.theme, new.industry,
      new.terms, new.body);
  END;

  CREATE TRIGGER IF NOT EXISTS style_fts_delete
  AFTER DELETE ON retrieval_documents BEGIN
    INSERT INTO style_fts(style_fts, rowid, title, thesis, theme, industry, terms, body)
    VALUES ('delete', old.style_rowid, old.title, old.thesis, old.theme,
      old.industry, old.terms, old.body);
  END;

  CREATE TABLE IF NOT EXISTS embedding_profiles (
    profile_id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    dimensions INTEGER CHECK (dimensions IS NULL OR dimensions > 0),
    config_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS embedding_cache (
    retrieval_hash TEXT NOT NULL,
    profile_id TEXT NOT NULL REFERENCES embedding_profiles(profile_id) ON DELETE CASCADE,
    dimensions INTEGER NOT NULL CHECK (dimensions > 0),
    vector_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (retrieval_hash, profile_id)
  ) WITHOUT ROWID, STRICT;

  CREATE TABLE IF NOT EXISTS style_vector_jobs (
    job_id INTEGER PRIMARY KEY,
    style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    retrieval_hash TEXT NOT NULL,
    profile_id TEXT NOT NULL REFERENCES embedding_profiles(profile_id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'running', 'completed', 'failed', 'superseded')),
    attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    next_attempt_at TEXT,
    last_error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (style_rowid, retrieval_hash, profile_id)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS style_vectors (
    style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    retrieval_hash TEXT NOT NULL,
    profile_id TEXT NOT NULL REFERENCES embedding_profiles(profile_id) ON DELETE CASCADE,
    dimensions INTEGER NOT NULL CHECK (dimensions > 0),
    vector_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (style_rowid, profile_id)
  ) WITHOUT ROWID, STRICT;

  CREATE TABLE IF NOT EXISTS style_relationships (
    relationship_id INTEGER PRIMARY KEY,
    source_style_rowid INTEGER NOT NULL REFERENCES styles(style_rowid) ON DELETE CASCADE,
    ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
    raw_target_label TEXT NOT NULL,
    target_style_rowid INTEGER REFERENCES styles(style_rowid) ON DELETE SET NULL,
    rationale TEXT NOT NULL,
    resolution_state TEXT NOT NULL
      CHECK (resolution_state IN ('resolved', 'ambiguous', 'unresolved')),
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    UNIQUE (source_style_rowid, ordinal)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS style_index_state (
    style_rowid INTEGER PRIMARY KEY REFERENCES styles(style_rowid) ON DELETE CASCADE,
    artifact_hint_hash TEXT NOT NULL,
    crawl_record_hash TEXT NOT NULL,
    aggregate_hash TEXT NOT NULL,
    last_success_generation TEXT NOT NULL,
    last_success_at TEXT NOT NULL,
    missing_observations INTEGER NOT NULL DEFAULT 0 CHECK (missing_observations >= 0)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS corpus_generations (
    generation_hash TEXT PRIMARY KEY,
    parent_generation_hash TEXT REFERENCES corpus_generations(generation_hash),
    crawl_manifest_hash TEXT NOT NULL,
    aggregate_corpus_hash TEXT NOT NULL,
    schema_version INTEGER NOT NULL,
    active_style_count INTEGER NOT NULL CHECK (active_style_count >= 0),
    quarantined_style_count INTEGER NOT NULL CHECK (quarantined_style_count >= 0),
    tombstoned_style_count INTEGER NOT NULL CHECK (tombstoned_style_count >= 0),
    created_at TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS current_corpus_generation (
    singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
    generation_hash TEXT NOT NULL REFERENCES corpus_generations(generation_hash),
    published_at TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS vector_projection_revisions (
    profile_id TEXT PRIMARY KEY REFERENCES embedding_profiles(profile_id) ON DELETE CASCADE,
    revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),
    updated_at TEXT NOT NULL
  ) STRICT;

  CREATE TRIGGER IF NOT EXISTS corpus_generations_immutable_update
  BEFORE UPDATE ON corpus_generations BEGIN
    SELECT RAISE(ABORT, 'corpus generations are immutable');
  END;

  CREATE TRIGGER IF NOT EXISTS corpus_generations_immutable_delete
  BEFORE DELETE ON corpus_generations BEGIN
    SELECT RAISE(ABORT, 'corpus generations are immutable');
  END;

  CREATE INDEX IF NOT EXISTS idx_styles_active_theme
    ON styles(theme, style_id) WHERE lifecycle_state = 'active';
  CREATE INDEX IF NOT EXISTS idx_styles_lifecycle ON styles(lifecycle_state, style_id);
  CREATE INDEX IF NOT EXISTS idx_style_terms_lookup ON style_terms(term_type, term, style_rowid);
  CREATE INDEX IF NOT EXISTS idx_style_axes_lookup ON style_token_axes(axis, style_rowid);
  CREATE INDEX IF NOT EXISTS idx_style_artifacts_path ON style_artifacts(relative_path);
  CREATE INDEX IF NOT EXISTS idx_style_vectors_profile ON style_vectors(profile_id, style_rowid);
  CREATE INDEX IF NOT EXISTS idx_vector_jobs_drain
    ON style_vector_jobs(status, next_attempt_at, job_id);
  CREATE INDEX IF NOT EXISTS idx_relationships_source
    ON style_relationships(source_style_rowid, resolution_state);
  CREATE INDEX IF NOT EXISTS idx_relationships_target
    ON style_relationships(target_style_rowid) WHERE target_style_rowid IS NOT NULL;
`;

/**
 * Create or validate the current style database schema.
 *
 * @param {DatabaseSync} database - Open SQLite connection.
 * @returns {DatabaseSync} The configured connection.
 */
export function createSchema(database) {
  if (!(database instanceof DatabaseSync)) {
    throw new TypeError('database must be a node:sqlite DatabaseSync instance.');
  }
  database.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  const currentVersion = Number(database.prepare('PRAGMA user_version').get().user_version);
  if (currentVersion > STYLE_DB_SCHEMA_VERSION) {
    throw new Error(`Style database schema ${currentVersion} is newer than supported version ${STYLE_DB_SCHEMA_VERSION}.`);
  }
  if (currentVersion === 1) {
    const indexStateColumns = database.prepare(`
      PRAGMA table_info(style_index_state)
    `).all().map((column) => column.name);
    if (!indexStateColumns.includes('crawl_record_hash')) {
      database.exec('BEGIN IMMEDIATE');
      try {
        database.exec(`
          ALTER TABLE style_index_state
          ADD COLUMN crawl_record_hash TEXT NOT NULL DEFAULT 'legacy-unverified'
        `);
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
    }
  }
  database.exec(SCHEMA_SQL);
  const requiredIndexStateColumns = new Set([
    'style_rowid',
    'artifact_hint_hash',
    'crawl_record_hash',
    'aggregate_hash',
    'last_success_generation',
    'last_success_at',
    'missing_observations',
  ]);
  const actualIndexStateColumns = new Set(database.prepare(`
    PRAGMA table_info(style_index_state)
  `).all().map((column) => column.name));
  if ([...requiredIndexStateColumns].some((column) => !actualIndexStateColumns.has(column))) {
    throw new Error('Style database index-state schema is incomplete after migration.');
  }
  database.prepare(`
    INSERT INTO style_db_metadata(key, value) VALUES ('schema_version', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(String(STYLE_DB_SCHEMA_VERSION));
  database.exec(`PRAGMA user_version = ${STYLE_DB_SCHEMA_VERSION};`);
  return database;
}

/**
 * Open a local style database with its versioned schema initialized.
 *
 * @param {string} [databasePath=':memory:'] - SQLite file path or in-memory marker.
 * @returns {DatabaseSync} Ready database connection.
 */
export function openStyleDatabase(databasePath = ':memory:') {
  const database = new DatabaseSync(databasePath);
  if (databasePath !== ':memory:') database.exec('PRAGMA journal_mode = WAL;');
  return createSchema(database);
}
