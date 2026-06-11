// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for skill graph metadata (nodes + edges).
// Uses the advisor package-local skill-graph.sqlite runtime database.

import Database from 'better-sqlite3';
// NOTE: lib/shared/embeddings is a symlink to system-spec-kit/shared/embeddings.
// The symlink in the file tree makes the cross-skill dependency on
// system-spec-kit visible to repo users. The import here uses the @spec-kit/shared workspace
// alias (resolved via tsconfig paths) for clean tsc resolution. If system-spec-kit is
// deleted, both the symlink and the alias dangle and embeddings-backed features break — the
// dangling symlink in the file tree is the documenting failure signal.
import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory.js';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import {
  ensureVecMetadataTable,
  ensureVecTableForDim,
  getActiveEmbedder,
  hasActiveEmbedderPointer,
  vecTableNameForDim,
} from '../embedders/schema.js';
import { getAdapter } from '../embedders/registry.js';
import type { EmbedderAdapter } from '../embedders/adapter.js';
import { checkSqliteIntegrity } from '../freshness/sqlite-integrity.js';
import { parseSkillFrontmatter } from '../utils/skill-markdown.js';
import {
  isDocTriggerHarvestEnabled,
  listSkillDocFiles,
  parseDocFrontmatter,
} from './doc-frontmatter.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type SkillFamily = 'cli' | 'mcp' | 'sk-code' | 'deep-loop' | 'sk-util' | 'system';

export type SkillEdgeType =
  | 'depends_on'
  | 'enhances'
  | 'siblings'
  | 'conflicts_with'
  | 'prerequisite_for';

export interface SkillNode {
  id: string;
  family: SkillFamily;
  category: string;
  schemaVersion: 1 | 2;
  domains: string[];
  intentSignals: string[];
  derived: Record<string, unknown> | null;
  sourcePath: string;
  contentHash: string;
  indexedAt?: string;
}

export interface SkillEdge {
  id?: number;
  sourceId: string;
  targetId: string;
  edgeType: SkillEdgeType;
  weight: number;
  context: string;
}

export interface SkillGraphStats {
  totalNodes: number;
  totalEdges: number;
  nodesByFamily: Record<string, number>;
  edgesByType: Record<string, number>;
  lastScanTimestamp: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
}

export interface SkillGraphIndexResult {
  scannedFiles: number;
  indexedFiles: number;
  skippedFiles: number;
  indexedNodes: number;
  indexedEdges: number;
  rejectedEdges: number;
  deletedNodes: number;
  warnings: string[];
  /** Present only when the doc-trigger harvest flag is enabled. */
  docs?: SkillDocHarvestResult;
}

export interface SkillDocHarvestResult {
  scannedDocs: number;
  indexedDocs: number;
  skippedDocs: number;
  deletedDocs: number;
}

export interface SkillEmbeddingRefreshResult {
  embedded: number;
  skipped: number;
  failed: number;
  warnings: string[];
}

export interface SkillEmbeddingRow {
  skillId: string;
  embedding: Float32Array;
  modelId: string;
  contentHash: string;
}

interface ParsedSkillMetadata {
  node: SkillNode;
  edges: SkillEdge[];
}

type JsonRecord = Record<string, unknown>;

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 1;

export const DB_FILENAME = 'skill-graph.sqlite';

const SKILL_METADATA_FILENAME = 'graph-metadata.json';
const MIN_WEIGHT = 0.0;
const MAX_WEIGHT = 1.0;

const ALLOWED_FAMILIES: readonly SkillFamily[] = [
  'cli',
  'mcp',
  'sk-code',
  'deep-loop',
  'sk-util',
  'system',
];

const EDGE_TYPES: readonly SkillEdgeType[] = [
  'depends_on',
  'enhances',
  'siblings',
  'conflicts_with',
  'prerequisite_for',
];

const WEIGHT_BANDS: Readonly<Record<SkillEdgeType, readonly [number, number]>> = {
  depends_on: [0.7, 1.0],
  prerequisite_for: [0.7, 1.0],
  enhances: [0.3, 0.7],
  siblings: [0.4, 0.6],
  conflicts_with: [0.5, 1.0],
} as const;

function isWalFallbackError(error: unknown): boolean {
  const code = (error as { code?: string }).code ?? '';
  // better-sqlite3/libsqlite3 on SQLite 3.x may surface base or extended result codes.
  return /^(?:SQLITE_READONLY|SQLITE_CANTOPEN|SQLITE_IOERR)(?:_|$)/.test(code)
    || code === 'EACCES'
    || code === 'EROFS'
    || code === 'EPERM'
    || code === 'ENOSPC';
}

// ───────────────────────────────────────────────────────────────
// 3. SCHEMA
// ───────────────────────────────────────────────────────────────

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS skill_nodes (
    id TEXT PRIMARY KEY,
    family TEXT NOT NULL CHECK(family IN ('cli', 'mcp', 'sk-code', 'deep-loop', 'sk-util', 'system')),
    category TEXT NOT NULL,
    schema_version INTEGER NOT NULL,
    domains TEXT,
    intent_signals TEXT,
    derived TEXT,
    source_path TEXT NOT NULL UNIQUE,
    content_hash TEXT NOT NULL,
    embedding BLOB,
    embedding_model_id TEXT,
    embedding_content_hash TEXT,
    indexed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skill_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    edge_type TEXT NOT NULL CHECK(edge_type IN ('depends_on', 'enhances', 'siblings', 'conflicts_with', 'prerequisite_for')),
    weight REAL NOT NULL CHECK(weight >= 0.0 AND weight <= 1.0),
    context TEXT NOT NULL,
    UNIQUE(source_id, target_id, edge_type),
    CHECK(source_id != target_id)
  );

  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skill_graph_metadata (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vec_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skill_docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    doc_path TEXT NOT NULL,
    title TEXT,
    description TEXT,
    trigger_phrases TEXT NOT NULL,
    importance_tier TEXT NOT NULL DEFAULT 'normal',
    context_type TEXT NOT NULL DEFAULT 'general',
    content_hash TEXT NOT NULL,
    indexed_at TEXT DEFAULT (datetime('now')),
    UNIQUE(skill_id, doc_path)
  );

  CREATE INDEX IF NOT EXISTS idx_skill_docs_skill ON skill_docs(skill_id);

  CREATE INDEX IF NOT EXISTS idx_skill_nodes_family ON skill_nodes(family);
  CREATE INDEX IF NOT EXISTS idx_skill_nodes_category ON skill_nodes(category);
  CREATE INDEX IF NOT EXISTS idx_skill_nodes_hash ON skill_nodes(content_hash);
  CREATE INDEX IF NOT EXISTS idx_skill_edges_source ON skill_edges(source_id, edge_type);
  CREATE INDEX IF NOT EXISTS idx_skill_edges_target ON skill_edges(target_id, edge_type);
  CREATE INDEX IF NOT EXISTS idx_skill_edges_type ON skill_edges(edge_type);
`;

// ───────────────────────────────────────────────────────────────
// 4. DATABASE LIFECYCLE
// ───────────────────────────────────────────────────────────────

let db: Database.Database | null = null;
let dbPath: string | null = null;
let readOnlyDb: Database.Database | null = null;

export function resolveSkillGraphDbDir(): string {
  const overrideDbDir = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  if (overrideDbDir) {
    return resolve(overrideDbDir);
  }
  return resolve(
    process.cwd(),
    '.opencode',
    'skills',
    'system-skill-advisor',
    'mcp_server',
    'database',
  );
}

export function getSkillGraphDbPath(): string {
  return dbPath ?? join(resolveSkillGraphDbDir(), DB_FILENAME);
}

const CORRUPTION_REASON_PATTERN = /SQLITE_CORRUPT|SQLITE_NOTADB|database disk image is malformed|file is not a database|malformed/i;
const TRANSIENT_REASON_PATTERN = /database is locked|SQLITE_BUSY|SQLITE_LOCKED|SQLITE_PROTOCOL|EIO|EPERM|EACCES|EROFS|ENOSPC/i;

/**
 * Only genuine on-disk corruption may trigger destructive recovery.
 *
 * Transient conditions (lock contention from a concurrent daemon, I/O or
 * permission errors) must never rename/delete the live database out from
 * under its owner, so they fail this check and initDb proceeds to a normal
 * open (busy_timeout handles contention).
 */
export function isGenuineCorruptionReason(reason: string): boolean {
  if (reason.startsWith('SQLITE_CHECK_FAILED') || TRANSIENT_REASON_PATTERN.test(reason)) {
    return false;
  }
  // quick_check completed and reported integrity violations
  if (reason.startsWith('SQLITE_QUICK_CHECK_')) {
    return true;
  }
  return CORRUPTION_REASON_PATTERN.test(reason);
}

function recoverMalformedDatabase(databasePath: string, reason: string): void {
  if (!existsSync(databasePath)) {
    return;
  }

  const backupPath = join(dirname(databasePath), `${DB_FILENAME}.${Date.now()}.corrupt`);
  try {
    renameSync(databasePath, backupPath);
  } catch {
    rmSync(databasePath, { force: true });
  }
  console.warn(`[skill-graph] Recovered malformed SQLite database via initDb quick_check (${reason})`);
}

function ensureSchemaMigrations(database: Database.Database): void {
  ensureVecMetadataTable(database);
  ensureVecTableForDim(database, 768);
  ensureVecTableForDim(database, 1024);

  database.exec(`
    CREATE TABLE IF NOT EXISTS skill_graph_metadata (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS skill_docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      skill_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
      doc_path TEXT NOT NULL,
      title TEXT,
      description TEXT,
      trigger_phrases TEXT NOT NULL,
      importance_tier TEXT NOT NULL DEFAULT 'normal',
      context_type TEXT NOT NULL DEFAULT 'general',
      content_hash TEXT NOT NULL,
      indexed_at TEXT DEFAULT (datetime('now')),
      UNIQUE(skill_id, doc_path)
    );
    CREATE INDEX IF NOT EXISTS idx_skill_docs_skill ON skill_docs(skill_id);
    CREATE INDEX IF NOT EXISTS idx_skill_nodes_family ON skill_nodes(family);
    CREATE INDEX IF NOT EXISTS idx_skill_edges_source ON skill_edges(source_id, edge_type);
    CREATE INDEX IF NOT EXISTS idx_skill_edges_target ON skill_edges(target_id, edge_type);
  `);

  const columns = new Set(
    (database.prepare('PRAGMA table_info(skill_nodes)').all() as Array<{ name: string }>)
      .map((column) => column.name),
  );
  if (!columns.has('embedding')) {
    database.exec('ALTER TABLE skill_nodes ADD COLUMN embedding BLOB');
  }
  if (!columns.has('embedding_model_id')) {
    database.exec('ALTER TABLE skill_nodes ADD COLUMN embedding_model_id TEXT');
  }
  if (!columns.has('embedding_content_hash')) {
    database.exec('ALTER TABLE skill_nodes ADD COLUMN embedding_content_hash TEXT');
  }
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_skill_nodes_embedding_model ON skill_nodes(embedding_model_id);
    CREATE INDEX IF NOT EXISTS idx_skill_nodes_embedding_hash ON skill_nodes(embedding_content_hash);
  `);
}

/** Initialize (or get) the skill graph database. */
export function initDb(dbDir: string): Database.Database {
  if (db) return db;

  try {
    mkdirSync(dbDir, { recursive: true });
    dbPath = join(dbDir, DB_FILENAME);
    const integrity = checkSqliteIntegrity(dbPath);
    if (!integrity.ok && integrity.reason !== 'SQLITE_ABSENT' && isGenuineCorruptionReason(integrity.reason)) {
      recoverMalformedDatabase(dbPath, integrity.reason);
    }
    db = new Database(dbPath);
    db.pragma('busy_timeout = 5000');
    try {
      db.pragma('journal_mode = WAL');
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      if (isWalFallbackError(error)) {
        console.warn(`[skill-graph] WAL mode unavailable (${code}); falling back to journal_mode=DELETE. Concurrent readers may stall during writes; performance degraded vs WAL mode.`);
        db.pragma('journal_mode = DELETE');
      } else {
        throw error;
      }
    }
    db.pragma('foreign_keys = ON');
    db.exec(SCHEMA_SQL);
    ensureSchemaMigrations(db);

    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
    if (!versionRow) {
      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
    } else if (versionRow.version < SCHEMA_VERSION) {
      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
    }

    return db;
  } catch (error) {
    if (db) {
      try { db.close(); } catch { /* best effort cleanup for failed init */ }
    }
    db = null;
    dbPath = null;
    throw error;
  }
}

/** Get the current database instance (lazy-initializes if needed). */
export function getDb(): Database.Database {
  if (!db) initDb(resolveSkillGraphDbDir());
  return db!;
}

/**
 * Read-only database access for recommend-path consumers (semantic shadow
 * lane). Never creates the database file, never runs schema migrations, and
 * never triggers malformed-database recovery, so secondary/bridge processes
 * cannot become a second writer on the daemon-owned skill graph. Reuses the
 * read-write handle when this process already owns one (daemon path).
 * Returns null when the database file is absent or unopenable; callers must
 * degrade gracefully (no shadow scoring).
 */
export function getDbReadOnly(): Database.Database | null {
  if (db) return db;
  if (readOnlyDb) return readOnlyDb;

  const databasePath = join(resolveSkillGraphDbDir(), DB_FILENAME);
  if (!existsSync(databasePath)) {
    return null;
  }

  try {
    const handle = new Database(databasePath, { readonly: true, fileMustExist: true });
    handle.pragma('busy_timeout = 5000');
    readOnlyDb = handle;
    return readOnlyDb;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[skill-graph] Read-only open failed (${message}); shadow scoring degraded for this process`);
    return null;
  }
}

/** Close the database connection. */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    dbPath = null;
  }
  if (readOnlyDb) {
    try {
      readOnlyDb.close();
    } catch { /* best effort: read-only handle teardown */ }
    readOnlyDb = null;
  }
}

// ───────────────────────────────────────────────────────────────
// 5. METADATA HELPERS
// ───────────────────────────────────────────────────────────────

function getMetadata(key: string): string | null {
  const database = getDb();
  const row = database.prepare('SELECT value FROM skill_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function setMetadata(key: string, value: string): void {
  const database = getDb();
  const now = new Date().toISOString();
  database.prepare(`
    INSERT INTO skill_graph_metadata (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value, now);
}

function checkpointWal(database: Database.Database): void {
  try {
    database.pragma('wal_checkpoint(FULL)');
  } catch (error: unknown) {
    const code = (error as { code?: string }).code ?? '';
    if (!isWalFallbackError(error) && code !== 'SQLITE_BUSY') {
      throw error;
    }
  }
}

export function getLastScanTimestamp(): string | null {
  return getMetadata('last_scan_timestamp');
}

// ───────────────────────────────────────────────────────────────
// 6. INDEXING HELPERS
// ───────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toDisplayPath(filePath: string): string {
  const relativePath = relative(process.cwd(), filePath);
  return relativePath && !relativePath.startsWith('..') ? relativePath : filePath;
}

function requireString(value: unknown, fieldName: string, sourcePath: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${toDisplayPath(sourcePath)}: ${fieldName} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(value: unknown, fieldName: string, sourcePath: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`${toDisplayPath(sourcePath)}: ${fieldName} must be an array of strings`);
  }
  return value;
}

function requireDerived(value: unknown, schemaVersion: number, sourcePath: string): JsonRecord | null {
  if (schemaVersion === 1) {
    return isRecord(value) ? value : null;
  }

  if (!isRecord(value)) {
    throw new Error(`${toDisplayPath(sourcePath)}: schema_version 2 requires a derived object`);
  }

  return value;
}

function requireEdgeWeight(value: unknown, edgeType: SkillEdgeType, sourcePath: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${toDisplayPath(sourcePath)}: ${edgeType} edge weight must be a number`);
  }

  if (value < MIN_WEIGHT || value > MAX_WEIGHT) {
    throw new Error(
      `${toDisplayPath(sourcePath)}: ${edgeType} edge weight ${value} out of range [${MIN_WEIGHT}, ${MAX_WEIGHT}]`,
    );
  }

  return value;
}

function warnWeightBand(edge: SkillEdge, sourcePath: string, warnings: string[]): void {
  const [minBand, maxBand] = WEIGHT_BANDS[edge.edgeType];
  if (edge.weight >= minBand && edge.weight <= maxBand) {
    return;
  }

  const warning = `WEIGHT-BAND: ${edge.sourceId} ${edge.edgeType} ${edge.targetId} weight ${edge.weight} ` +
    `outside recommended band [${minBand}, ${maxBand}] (${toDisplayPath(sourcePath)})`;
  warnings.push(warning);
  console.warn(`[skill-graph] ${warning}`);
}

function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function encodeEmbedding(vector: Float32Array | readonly number[]): Buffer {
  const array = vector instanceof Float32Array ? vector : Float32Array.from(vector);
  return Buffer.from(array.buffer, array.byteOffset, array.byteLength);
}

function decodeEmbedding(blob: Buffer): Float32Array | null {
  if (blob.byteLength === 0 || blob.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) {
    return null;
  }
  const copied = blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength);
  return new Float32Array(copied);
}

function skillDescriptionForEmbedding(sourcePath: string): string {
  const skillMdPath = join(dirname(sourcePath), 'SKILL.md');
  if (!existsSync(skillMdPath)) {
    return '';
  }
  const parsed = parseSkillFrontmatter(readFileSync(skillMdPath, 'utf8'));
  return parsed.frontmatter.description || '';
}

function providerModelId(profile: { provider: string; model: string; dim: number; dtype?: string | null; slug?: string }): string {
  return profile.slug ?? [profile.provider, profile.model, profile.dim, profile.dtype ?? null]
    .filter((part): part is string | number => part !== null && part !== undefined && part !== '')
    .join(':');
}

function discoverGraphMetadataFiles(skillDir: string): string[] {
  if (!existsSync(skillDir)) {
    return [];
  }

  const discovered: string[] = [];
  const stack: string[] = [skillDir];

  while (stack.length > 0) {
    const currentDir = stack.pop()!;
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name === SKILL_METADATA_FILENAME) {
        discovered.push(entryPath);
      }
    }
  }

  return discovered.sort((left, right) => left.localeCompare(right));
}

function readMetadataJson(sourcePath: string, content: string): JsonRecord {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content) as unknown;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${toDisplayPath(sourcePath)}: failed to parse JSON (${message})`);
  }

  if (!isRecord(parsedJson)) {
    throw new Error(`${toDisplayPath(sourcePath)}: root must be an object`);
  }

  return parsedJson;
}

function isSkillGraphMetadata(parsedJson: JsonRecord): boolean {
  return typeof parsedJson.skill_id === 'string' || typeof parsedJson.family === 'string' || isRecord(parsedJson.edges);
}

function parseSkillMetadata(sourcePath: string, parsedJson: JsonRecord, contentHash: string): ParsedSkillMetadata {
  const schemaVersion = parsedJson.schema_version;
  if (schemaVersion !== 1 && schemaVersion !== 2) {
    throw new Error(`${toDisplayPath(sourcePath)}: schema_version must be 1 or 2`);
  }

  const skillId = requireString(parsedJson.skill_id, 'skill_id', sourcePath);
  const folderName = basename(dirname(sourcePath));
  if (skillId !== folderName) {
    throw new Error(`${toDisplayPath(sourcePath)}: skill_id "${skillId}" does not match folder name "${folderName}"`);
  }

  const family = requireString(parsedJson.family, 'family', sourcePath);
  if (!ALLOWED_FAMILIES.includes(family as SkillFamily)) {
    throw new Error(`${toDisplayPath(sourcePath)}: family "${family}" is not supported`);
  }

  const category = requireString(parsedJson.category, 'category', sourcePath);
  const domains = requireStringArray(parsedJson.domains, 'domains', sourcePath);
  const intentSignals = requireStringArray(parsedJson.intent_signals, 'intent_signals', sourcePath);
  const derived = requireDerived(parsedJson.derived, schemaVersion, sourcePath);

  if (!isRecord(parsedJson.edges)) {
    throw new Error(`${toDisplayPath(sourcePath)}: edges must be an object`);
  }

  const edges: SkillEdge[] = [];
  for (const edgeType of EDGE_TYPES) {
    const rawEdgeList = parsedJson.edges[edgeType];
    if (rawEdgeList === undefined) {
      continue;
    }

    if (!Array.isArray(rawEdgeList)) {
      throw new Error(`${toDisplayPath(sourcePath)}: edges.${edgeType} must be an array`);
    }

    for (const rawEdge of rawEdgeList) {
      if (!isRecord(rawEdge)) {
        throw new Error(`${toDisplayPath(sourcePath)}: edges.${edgeType} entries must be objects`);
      }

      edges.push({
        sourceId: skillId,
        targetId: requireString(rawEdge.target, `edges.${edgeType}.target`, sourcePath),
        edgeType,
        weight: requireEdgeWeight(rawEdge.weight, edgeType, sourcePath),
        context: requireString(rawEdge.context, `edges.${edgeType}.context`, sourcePath),
      });
    }
  }

  for (const key of Object.keys(parsedJson.edges)) {
    if (!EDGE_TYPES.includes(key as SkillEdgeType)) {
      throw new Error(`${toDisplayPath(sourcePath)}: unsupported edge type "${key}"`);
    }
  }

  return {
    node: {
      id: skillId,
      family: family as SkillFamily,
      category,
      schemaVersion,
      domains,
      intentSignals,
      derived,
      sourcePath,
      contentHash,
    },
    edges,
  };
}

function deleteMissingNodes(database: Database.Database, skillIds: string[]): number {
  if (skillIds.length === 0) {
    const result = database.prepare('DELETE FROM skill_nodes').run();
    return result.changes;
  }

  const placeholders = skillIds.map(() => '?').join(', ');
  const result = database.prepare(`DELETE FROM skill_nodes WHERE id NOT IN (${placeholders})`).run(...skillIds);
  return result.changes;
}

/**
 * Harvest reference/asset doc frontmatter into skill_docs rows.
 *
 * Runs only when the doc-trigger flag is on. Unchanged docs are skipped
 * via per-doc content hashes; docs that disappeared from disk (or lost
 * their trigger_phrases) are deleted per skill so the table mirrors the
 * harvestable surface exactly.
 */
function harvestSkillDocs(
  database: Database.Database,
  skills: ReadonlyArray<{ skillId: string; skillDir: string }>,
  warnings: string[],
): SkillDocHarvestResult {
  const result: SkillDocHarvestResult = {
    scannedDocs: 0,
    indexedDocs: 0,
    skippedDocs: 0,
    deletedDocs: 0,
  };

  const selectExistingDoc = database.prepare(
    'SELECT content_hash FROM skill_docs WHERE skill_id = ? AND doc_path = ?',
  );
  const upsertDoc = database.prepare(`
    INSERT INTO skill_docs (
      skill_id, doc_path, title, description, trigger_phrases,
      importance_tier, context_type, content_hash, indexed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(skill_id, doc_path) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      trigger_phrases = excluded.trigger_phrases,
      importance_tier = excluded.importance_tier,
      context_type = excluded.context_type,
      content_hash = excluded.content_hash,
      indexed_at = excluded.indexed_at
  `);

  const tx = database.transaction(() => {
    for (const { skillId, skillDir } of skills) {
      const docFiles = listSkillDocFiles(skillDir);
      const keptPaths: string[] = [];

      for (const absolutePath of docFiles) {
        result.scannedDocs++;
        let raw: string;
        try {
          raw = readFileSync(absolutePath, 'utf8');
        } catch (error: unknown) {
          warnings.push(`DOC-READ-FAILED: ${toDisplayPath(absolutePath)} (${error instanceof Error ? error.message : String(error)})`);
          continue;
        }

        const parsed = parseDocFrontmatter(raw);
        if (!parsed) continue;

        const docPath = relative(skillDir, absolutePath);
        keptPaths.push(docPath);

        const contentHash = computeContentHash(raw);
        const existing = selectExistingDoc.get(skillId, docPath) as { content_hash: string } | undefined;
        if (existing && existing.content_hash === contentHash) {
          result.skippedDocs++;
          continue;
        }

        upsertDoc.run(
          skillId,
          docPath,
          parsed.title,
          parsed.description,
          JSON.stringify(parsed.triggerPhrases),
          parsed.importanceTier,
          parsed.contextType,
          contentHash,
          new Date().toISOString(),
        );
        result.indexedDocs++;
      }

      if (keptPaths.length === 0) {
        const deleted = database.prepare('DELETE FROM skill_docs WHERE skill_id = ?').run(skillId);
        result.deletedDocs += deleted.changes;
      } else {
        const placeholders = keptPaths.map(() => '?').join(', ');
        const deleted = database
          .prepare(`DELETE FROM skill_docs WHERE skill_id = ? AND doc_path NOT IN (${placeholders})`)
          .run(skillId, ...keptPaths);
        result.deletedDocs += deleted.changes;
      }
    }
  });

  tx();
  return result;
}

// ───────────────────────────────────────────────────────────────
// 7. INDEXER
// ───────────────────────────────────────────────────────────────

/**
 * Index all discovered graph-metadata.json files under a skill directory.
 *
 * Files whose SHA-256 content hash has not changed are skipped. Node rows that
 * disappear from the source directory are deleted first so foreign-key cascade
 * cleanup removes stale edges, even when neighboring source files are skipped.
 */
export function indexSkillMetadata(skillDir: string): SkillGraphIndexResult {
  const database = getDb();
  const discoveredFiles = discoverGraphMetadataFiles(skillDir);
  const parsedMetadata: ParsedSkillMetadata[] = [];
  const warnings: string[] = [];
  let nonSkillMetadataFiles = 0;

  for (const sourcePath of discoveredFiles) {
    const content = readFileSync(sourcePath, 'utf8');
    const parsedJson = readMetadataJson(sourcePath, content);
    if (!isSkillGraphMetadata(parsedJson)) {
      nonSkillMetadataFiles++;
      warnings.push(`NON-SKILL-METADATA: skipped ${toDisplayPath(sourcePath)}`);
      continue;
    }

    const contentHash = computeContentHash(content);
    parsedMetadata.push(parseSkillMetadata(sourcePath, parsedJson, contentHash));
  }

  const skillIds = parsedMetadata.map((entry) => entry.node.id);
  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  for (const skillId of skillIds) {
    if (seenIds.has(skillId)) {
      duplicateIds.add(skillId);
      continue;
    }
    seenIds.add(skillId);
  }
  if (duplicateIds.size > 0) {
    throw new Error(`Duplicate skill_ids discovered: ${[...duplicateIds].sort().join(', ')}`);
  }

  let indexedFiles = 0;
  let skippedFiles = nonSkillMetadataFiles;
  let indexedNodes = 0;
  let indexedEdges = 0;
  let rejectedEdges = 0;
  let deletedNodes = 0;

  if (skillIds.length === 0) {
    warnings.push(`EMPTY-SKILL-SCAN: no skill metadata discovered under ${toDisplayPath(skillDir)}; preserving existing graph`);
    const summary: SkillGraphIndexResult = {
      scannedFiles: discoveredFiles.length,
      indexedFiles,
      skippedFiles,
      indexedNodes,
      indexedEdges,
      rejectedEdges,
      deletedNodes,
      warnings,
    };

    setMetadata('last_scan_timestamp', new Date().toISOString());
    setMetadata('last_scan_skill_dir', skillDir);
    setMetadata('last_scan_summary', JSON.stringify(summary));
    checkpointWal(database);

    return summary;
  }

  const knownSkillIds = new Set(skillIds);

  const selectExisting = database.prepare(`
    SELECT content_hash, source_path
    FROM skill_nodes
    WHERE id = ?
  `);
  const upsertNode = database.prepare(`
    INSERT INTO skill_nodes (
      id, family, category, schema_version, domains, intent_signals, derived,
      source_path, content_hash, indexed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      family = excluded.family,
      category = excluded.category,
      schema_version = excluded.schema_version,
      domains = excluded.domains,
      intent_signals = excluded.intent_signals,
      derived = excluded.derived,
      source_path = excluded.source_path,
      content_hash = excluded.content_hash,
      indexed_at = excluded.indexed_at
  `);
  const deleteEdgesBySource = database.prepare('DELETE FROM skill_edges WHERE source_id = ?');
  const insertEdge = database.prepare(`
    INSERT INTO skill_edges (source_id, target_id, edge_type, weight, context)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(source_id, target_id, edge_type) DO UPDATE SET
      weight = excluded.weight,
      context = excluded.context
  `);

  const tx = database.transaction(() => {
    deletedNodes = deleteMissingNodes(database, skillIds);

    const changedEntries: ParsedSkillMetadata[] = [];
    for (const entry of parsedMetadata) {
      const now = new Date().toISOString();
      const existing = selectExisting.get(entry.node.id) as {
        content_hash: string;
        source_path: string;
      } | undefined;

      if (
        existing &&
        existing.content_hash === entry.node.contentHash &&
        existing.source_path === entry.node.sourcePath
      ) {
        skippedFiles++;
        continue;
      }

      upsertNode.run(
        entry.node.id,
        entry.node.family,
        entry.node.category,
        entry.node.schemaVersion,
        JSON.stringify(entry.node.domains),
        JSON.stringify(entry.node.intentSignals),
        entry.node.derived ? JSON.stringify(entry.node.derived) : null,
        entry.node.sourcePath,
        entry.node.contentHash,
        now,
      );

      indexedFiles++;
      indexedNodes++;
      changedEntries.push(entry);
    }

    // Re-publish every source edge after all nodes are known so previously
    // rejected edges can backfill when a target skill appears in a later scan.
    for (const entry of parsedMetadata) {
      deleteEdgesBySource.run(entry.node.id);

      for (const edge of entry.edges) {
        warnWeightBand(edge, entry.node.sourcePath, warnings);

        if (edge.sourceId === edge.targetId) {
          rejectedEdges++;
          const warning = `SELF-LOOP: rejected ${edge.sourceId} ${edge.edgeType} ${edge.targetId} (${toDisplayPath(entry.node.sourcePath)})`;
          warnings.push(warning);
          console.warn(`[skill-graph] ${warning}`);
          continue;
        }

        if (!knownSkillIds.has(edge.targetId)) {
          rejectedEdges++;
          const warning = `UNKNOWN-TARGET: rejected ${edge.sourceId} ${edge.edgeType} ${edge.targetId} (${toDisplayPath(entry.node.sourcePath)})`;
          warnings.push(warning);
          console.warn(`[skill-graph] ${warning}`);
          continue;
        }

        insertEdge.run(edge.sourceId, edge.targetId, edge.edgeType, edge.weight, edge.context);
        indexedEdges++;
      }
    }
  });

  tx();

  // Doc-trigger harvest runs after the node transaction and for EVERY
  // skill (not just changed nodes): reference/asset edits never touch
  // graph-metadata.json, so node content hashes cannot gate doc work.
  // Per-doc content hashes keep unchanged docs cheap.
  let docsResult: SkillDocHarvestResult | undefined;
  if (isDocTriggerHarvestEnabled()) {
    docsResult = harvestSkillDocs(
      database,
      parsedMetadata.map((entry) => ({
        skillId: entry.node.id,
        skillDir: dirname(entry.node.sourcePath),
      })),
      warnings,
    );
  }

  const summary: SkillGraphIndexResult = {
    scannedFiles: discoveredFiles.length,
    indexedFiles,
    skippedFiles,
    indexedNodes,
    indexedEdges,
    rejectedEdges,
    deletedNodes,
    warnings,
    ...(docsResult ? { docs: docsResult } : {}),
  };

  setMetadata('last_scan_timestamp', new Date().toISOString());
  setMetadata('last_scan_skill_dir', skillDir);
  setMetadata('last_scan_summary', JSON.stringify(summary));
  checkpointWal(database);

  return summary;
}

/**
 * Refresh embeddings for skill_nodes rows.
 *
 * Dual-path dispatch:
 * - When `hasActiveEmbedderPointer(database)` returns true: use the pluggable
 * EmbedderAdapter layer — embed via `getAdapter(active.name)` and
 *   write to `vec_<active.dim>` table via INSERT OR REPLACE.
 * - When the pointer is unset (fresh install / pre-pluggable state): keep the
 *   legacy path — embed via `createEmbeddingsProvider()` factory and write to
 *   the `skill_nodes.embedding` BLOB column.
 *
 * The legacy column is retained for backward compatibility; the reader
 * (`loadSkillEmbeddings`) already prefers `vec_<dim>` when the pointer is set,
 * so once the adapter path populates `vec_<dim>`, the legacy column becomes
 * stale-but-harmless. A separate "legacy embedding column deprecation" packet
 * may remove it once all installs have migrated.
 */
export async function refreshSkillEmbeddings(skillDir?: string): Promise<SkillEmbeddingRefreshResult> {
  const database = getDb();

  if (hasActiveEmbedderPointer(database)) {
    return refreshSkillEmbeddingsViaAdapter(database, skillDir);
  }

  return refreshSkillEmbeddingsLegacy(database, skillDir);
}

async function refreshSkillEmbeddingsViaAdapter(
  database: Database.Database,
  skillDir: string | undefined,
): Promise<SkillEmbeddingRefreshResult> {
  const active = getActiveEmbedder(database);
  ensureVecTableForDim(database, active.dim);
  const tableName = vecTableNameForDim(active.dim);
  let adapter: EmbedderAdapter;
  try {
    const resolved = getAdapter(active.name);
    if (!resolved) {
      const warning = `ADAPTER-UNAVAILABLE: ${active.name} (manifest not found in registry)`;
      console.warn(`[skill-graph] ${warning}`);
      // F review P2-1: failed = total skill_nodes count so refresh-watchers
      // see an outage signal instead of "0 failed / 0 skipped" which looks
      // like an empty corpus.
      const rowCount = (database.prepare('SELECT COUNT(*) AS c FROM skill_nodes').get() as { c: number }).c;
      return { embedded: 0, skipped: 0, failed: rowCount, warnings: [warning] };
    }
    adapter = resolved;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const warning = `ADAPTER-UNAVAILABLE: ${active.name} (${message})`;
    console.warn(`[skill-graph] ${warning}`);
    const rowCount = (database.prepare('SELECT COUNT(*) AS c FROM skill_nodes').get() as { c: number }).c;
    return { embedded: 0, skipped: 0, failed: rowCount, warnings: [warning] };
  }

  // F review P1-1: fail fast on adapter-vs-pointer dim mismatch instead of
  // per-row EMBEDDING-FAILED noise + accidental vec_<dim> table emptying.
  if (adapter.dim !== active.dim) {
    const warning = `ADAPTER-DIM-MISMATCH: ${active.name} reports dim=${adapter.dim} but vec_metadata pointer dim=${active.dim}; fix configuration before refresh`;
    console.warn(`[skill-graph] ${warning}`);
    const rowCount = (database.prepare('SELECT COUNT(*) AS c FROM skill_nodes').get() as { c: number }).c;
    return { embedded: 0, skipped: 0, failed: rowCount, warnings: [warning] };
  }
  const modelId = active.name;
  const warnings: string[] = [];
  let embedded = 0;
  let skipped = 0;
  let failed = 0;

  const rows = database.prepare(`
    SELECT n.id AS id,
           n.source_path AS source_path,
           v.embedding AS vec_embedding,
           v.model_id AS vec_model_id,
           v.content_hash AS vec_content_hash
    FROM skill_nodes n
    LEFT JOIN ${tableName} v ON v.skill_id = n.id
    ORDER BY n.id ASC
  `).all() as Array<{
    id: string;
    source_path: string;
    vec_embedding: Buffer | null;
    vec_model_id: string | null;
    vec_content_hash: string | null;
  }>;

  const upsertEmbedding = database.prepare(`
    INSERT INTO ${tableName} (skill_id, embedding, model_id, content_hash, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(skill_id) DO UPDATE SET
      embedding = excluded.embedding,
      model_id = excluded.model_id,
      content_hash = excluded.content_hash,
      updated_at = datetime('now')
  `);
  const deleteEmbedding = database.prepare(`DELETE FROM ${tableName} WHERE skill_id = ?`);

  for (const row of rows) {
    if (skillDir && !row.source_path.startsWith(skillDir)) {
      skipped++;
      continue;
    }

    const description = skillDescriptionForEmbedding(row.source_path).trim();
    if (!description) {
      deleteEmbedding.run(row.id);
      skipped++;
      continue;
    }

    const contentHash = computeContentHash(description);
    if (
      row.vec_embedding
      && row.vec_model_id === modelId
      && row.vec_content_hash === contentHash
    ) {
      skipped++;
      continue;
    }

    try {
      const vectors = await adapter.embed([description], { inputType: 'document' });
      const vector = vectors[0];
      if (!vector || vector.length !== active.dim) {
        throw new Error(`adapter returned vector of length ${vector?.length ?? 0}, expected ${active.dim}`);
      }
      upsertEmbedding.run(row.id, encodeEmbedding(vector), modelId, contentHash);
      embedded++;
    } catch (error: unknown) {
      failed++;
      deleteEmbedding.run(row.id);
      const message = error instanceof Error ? error.message : String(error);
      const warning = `EMBEDDING-FAILED: ${row.id} (${message})`;
      warnings.push(warning);
      console.warn(`[skill-graph] ${warning}`);
    }
  }

  return { embedded, skipped, failed, warnings };
}

async function refreshSkillEmbeddingsLegacy(
  database: Database.Database,
  skillDir: string | undefined,
): Promise<SkillEmbeddingRefreshResult> {
  const provider = await createEmbeddingsProvider();
  const modelId = providerModelId(provider.getProfile());
  const warnings: string[] = [];
  let embedded = 0;
  let skipped = 0;
  let failed = 0;

  const rows = database.prepare(`
    SELECT id, source_path, embedding, embedding_model_id, embedding_content_hash
    FROM skill_nodes
    ORDER BY id ASC
  `).all() as Array<{
    id: string;
    source_path: string;
    embedding: Buffer | null;
    embedding_model_id: string | null;
    embedding_content_hash: string | null;
  }>;
  const updateEmbedding = database.prepare(`
    UPDATE skill_nodes
    SET embedding = ?, embedding_model_id = ?, embedding_content_hash = ?
    WHERE id = ?
  `);

  for (const row of rows) {
    if (skillDir && !row.source_path.startsWith(skillDir)) {
      skipped++;
      continue;
    }

    const description = skillDescriptionForEmbedding(row.source_path).trim();
    if (!description) {
      updateEmbedding.run(null, null, null, row.id);
      skipped++;
      continue;
    }

    const contentHash = computeContentHash(description);
    if (
      row.embedding
      && row.embedding_model_id === modelId
      && row.embedding_content_hash === contentHash
    ) {
      skipped++;
      continue;
    }

    try {
      const vector = await provider.embedDocument(description);
      if (!vector) {
        throw new Error('provider returned no vector');
      }
      updateEmbedding.run(encodeEmbedding(vector), modelId, contentHash, row.id);
      embedded++;
    } catch (error: unknown) {
      failed++;
      updateEmbedding.run(null, modelId, contentHash, row.id);
      const message = error instanceof Error ? error.message : String(error);
      const warning = `EMBEDDING-FAILED: ${row.id} (${message})`;
      warnings.push(warning);
      console.warn(`[skill-graph] ${warning}`);
    }
  }

  return { embedded, skipped, failed, warnings };
}

export function loadSkillEmbeddings(skillIds?: readonly string[]): SkillEmbeddingRow[] {
  // Recommend-path read: must not lazily create or migrate the database.
  // Absent database means no embeddings; the shadow lane degrades to empty.
  const database = getDbReadOnly();
  if (!database) {
    return [];
  }
  if (hasActiveEmbedderPointer(database)) {
    const active = getActiveEmbedder(database);
    const tableName = vecTableNameForDim(active.dim);
    ensureVecTableForDim(database, active.dim);

    const activeRows = skillIds && skillIds.length > 0
      ? database.prepare(`
          SELECT skill_id, embedding, model_id, content_hash
          FROM ${tableName}
          WHERE skill_id IN (${skillIds.map(() => '?').join(', ')})
          ORDER BY skill_id ASC
        `).all(...skillIds)
      : database.prepare(`
          SELECT skill_id, embedding, model_id, content_hash
          FROM ${tableName}
          ORDER BY skill_id ASC
        `).all();

    return (activeRows as Array<{
      skill_id: string;
      embedding: Buffer;
      model_id: string;
      content_hash: string;
    }>)
      .map((row) => {
        const embedding = decodeEmbedding(row.embedding);
        return embedding
          ? {
              skillId: row.skill_id,
              embedding,
              modelId: row.model_id,
              contentHash: row.content_hash,
            }
          : null;
      })
      .filter((row): row is SkillEmbeddingRow => row !== null);
  }

  const rows = skillIds && skillIds.length > 0
    ? database.prepare(`
        SELECT id, embedding, embedding_model_id, embedding_content_hash
        FROM skill_nodes
        WHERE embedding IS NOT NULL
          AND id IN (${skillIds.map(() => '?').join(', ')})
        ORDER BY id ASC
      `).all(...skillIds)
    : database.prepare(`
        SELECT id, embedding, embedding_model_id, embedding_content_hash
        FROM skill_nodes
        WHERE embedding IS NOT NULL
        ORDER BY id ASC
      `).all();

  return (rows as Array<{
    id: string;
    embedding: Buffer;
    embedding_model_id: string | null;
    embedding_content_hash: string | null;
  }>)
    .map((row) => {
      const embedding = decodeEmbedding(row.embedding);
      return embedding && row.embedding_model_id && row.embedding_content_hash
        ? {
            skillId: row.id,
            embedding,
            modelId: row.embedding_model_id,
            contentHash: row.embedding_content_hash,
          }
        : null;
    })
    .filter((row): row is SkillEmbeddingRow => row !== null);
}

// ───────────────────────────────────────────────────────────────
// 8. STATS
// ───────────────────────────────────────────────────────────────

/** Get graph statistics. */
export function getStats(): SkillGraphStats {
  const database = getDb();
  const totalNodes = (database.prepare('SELECT COUNT(*) as c FROM skill_nodes').get() as { c: number }).c;
  const totalEdges = (database.prepare('SELECT COUNT(*) as c FROM skill_edges').get() as { c: number }).c;

  const nodesByFamily: Record<string, number> = {};
  const familyRows = database.prepare(`
    SELECT family, COUNT(*) as c
    FROM skill_nodes
    GROUP BY family
  `).all() as Array<{ family: string; c: number }>;
  for (const row of familyRows) {
    nodesByFamily[row.family] = row.c;
  }

  const edgesByType: Record<string, number> = {};
  const edgeRows = database.prepare(`
    SELECT edge_type, COUNT(*) as c
    FROM skill_edges
    GROUP BY edge_type
  `).all() as Array<{ edge_type: string; c: number }>;
  for (const row of edgeRows) {
    edgesByType[row.edge_type] = row.c;
  }

  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
  }

  return {
    totalNodes,
    totalEdges,
    nodesByFamily,
    edgesByType,
    lastScanTimestamp: getLastScanTimestamp(),
    dbFileSize,
    schemaVersion: SCHEMA_VERSION,
  };
}

// ───────────────────────────────────────────────────────────────
// 9. ROW CONVERTERS
// ───────────────────────────────────────────────────────────────

export function rowToSkillNode(row: Record<string, unknown>): SkillNode {
  return {
    id: row.id as string,
    family: row.family as SkillFamily,
    category: row.category as string,
    schemaVersion: row.schema_version as 1 | 2,
    domains: row.domains ? JSON.parse(row.domains as string) as string[] : [],
    intentSignals: row.intent_signals ? JSON.parse(row.intent_signals as string) as string[] : [],
    derived: row.derived ? JSON.parse(row.derived as string) as Record<string, unknown> : null,
    sourcePath: row.source_path as string,
    contentHash: row.content_hash as string,
    indexedAt: row.indexed_at as string | undefined,
  };
}

export function rowToSkillEdge(row: Record<string, unknown>): SkillEdge {
  return {
    id: row.id as number | undefined,
    sourceId: row.source_id as string,
    targetId: row.target_id as string,
    edgeType: row.edge_type as SkillEdgeType,
    weight: row.weight as number,
    context: row.context as string,
  };
}
