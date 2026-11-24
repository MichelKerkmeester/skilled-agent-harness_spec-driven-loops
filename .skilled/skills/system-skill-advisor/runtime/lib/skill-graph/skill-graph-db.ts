// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for skill graph metadata (nodes + edges).
// Uses the advisor package-local skill-graph.sqlite runtime database.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

import { createPrivateSkillLinkCheck } from '../private-skill-target.js';

import Database from 'better-sqlite3';
import { checkSqliteIntegrity } from '../freshness/sqlite-integrity.js';
import { findAdvisorWorkspaceRoot } from '../utils/workspace-root.js';
import {
  isDocTriggerHarvestEnabled,
  listSkillDocFiles,
  parseDocFrontmatter,
} from './doc-frontmatter.js';
import {
  SKILL_METADATA_SANITIZER_VERSION,
  sanitizeDerivedMetadata,
  sanitizeMetadataStringArray,
} from './metadata-sanitizer.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type SkillFamily = 'cli' | 'mcp' | 'sk-code' | 'sk-hub' | 'deep-loop' | 'sk-util' | 'documentation' | 'design' | 'system';

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

interface ParsedSkillMetadata {
  node: SkillNode;
  edges: SkillEdge[];
}

type JsonRecord = Record<string, unknown>;

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 2;

export const DB_FILENAME = 'skill-graph.sqlite';

const SKILL_METADATA_FILENAME = 'graph-metadata.json';

// Directories never descended when discovering skill metadata: dependency,
// build, and VCS trees can carry their own graph-metadata.json (e.g. a vendored
// package) that must never be ingested as a skill identity, and walking them is
// pure waste. Defensive skip — none currently contain skill metadata.
const IGNORED_SCAN_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', '.turbo', '.cache',
]);
const MIN_WEIGHT = 0.0;
const MAX_WEIGHT = 1.0;

const ALLOWED_FAMILIES: readonly SkillFamily[] = [
  'cli',
  'mcp',
  'sk-code',
  'sk-hub',
  'deep-loop',
  'sk-util',
  'documentation',
  'design',
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

// schema_version is created first, so a file another opener is still creating
// never shows skill tables without it and cannot pass for a pre-version file.
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skill_nodes (
    id TEXT PRIMARY KEY,
    family TEXT NOT NULL,
    category TEXT NOT NULL,
    schema_version INTEGER NOT NULL,
    domains TEXT,
    intent_signals TEXT,
    derived TEXT,
    source_path TEXT NOT NULL UNIQUE,
    content_hash TEXT NOT NULL,
    indexed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skill_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    edge_type TEXT NOT NULL,
    weight REAL NOT NULL CHECK(weight >= 0.0 AND weight <= 1.0),
    context TEXT NOT NULL,
    UNIQUE(source_id, target_id, edge_type),
    CHECK(source_id != target_id)
  );

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

// The env override is read on every call (never captured at module load) so a
// diagnostic probe and the writing daemon always agree on the artifact path
// even if the override is set after either module first loaded. `baseRoot`
// defaults to the writer's cwd; a caller resolving for a specific workspace
// (e.g. the status probe) passes that root so both sides target one file.
export function resolveSkillGraphDbDir(baseRoot: string = process.cwd()): string {
  const overrideDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  if (overrideDbDir) {
    return resolve(overrideDbDir);
  }
  // Anchor to the real repo root. A default `process.cwd()` inside a
  // specs/<packet> directory would otherwise plant the skill-graph database
  // under that packet; the anchored resolver can never land inside an .skilled
  // tree, so the DB always resolves to one file at the workspace root.
  return resolve(
    findAdvisorWorkspaceRoot(baseRoot),
    '.skilled',
    'skills',
    'system-skill-advisor',
    'runtime',
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

function isMissingSchemaVersionTable(error: unknown): boolean {
  const { code, message } = error as { code?: unknown; message?: unknown };
  return code === 'SQLITE_ERROR' && typeof message === 'string' && /no such table: schema_version\b/.test(message);
}

// Returns the version of a file the schema has outgrown, or null for a file to
// keep. Only what the probe actually read can condemn a file: a version row
// below SCHEMA_VERSION, or skill tables with no schema_version table at all,
// which predates versioning. An empty version table, or a file with neither,
// is one another opener is still creating.
function readOutdatedSchemaVersion(probe: Database.Database): number | null {
  try {
    const row = probe.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version?: unknown } | undefined;
    if (typeof row?.version !== 'number') return null;
    return row.version < SCHEMA_VERSION ? row.version : null;
  } catch (error: unknown) {
    if (!isMissingSchemaVersionTable(error)) throw error;
  }
  const skillTable = probe.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'skill_nodes'").get();
  return skillTable === undefined ? null : 0;
}

// A database stored below SCHEMA_VERSION was built for tables this schema no
// longer has. It holds only derived state, so it is deleted with its sidecar
// files and the next scan rebuilds it, instead of migration code that would
// have to name every retired table.
function removeOutdatedDatabase(databasePath: string, storedVersion: number): void {
  for (const suffix of ['', '-wal', '-shm', '-journal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
  console.warn(`[skill-graph] Discarded a schema version ${storedVersion} database; the next scan rebuilds it`);
}

function discardOutdatedDatabase(databasePath: string): void {
  if (!existsSync(databasePath)) return;
  let storedVersion: number | null;
  try {
    const probe = new Database(databasePath, { readonly: true, fileMustExist: true });
    try {
      probe.pragma('busy_timeout = 5000');
      storedVersion = readOutdatedSchemaVersion(probe);
    } finally {
      probe.close();
    }
  } catch {
    // A lock held past the wait, a rollback journal only a writer may replay,
    // or an I/O, permission or descriptor error says nothing about the schema.
    // The file stays, and the normal open that follows reports the error or
    // reads the version itself.
    return;
  }
  if (storedVersion !== null) removeOutdatedDatabase(databasePath, storedVersion);
}

function ensureSchemaMigrations(database: Database.Database): void {
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
    discardOutdatedDatabase(dbPath);
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
      // The probe could not read this file, but this open did. Stamping it
      // current would keep the outgrown tables forever, so it is discarded
      // now and the open starts again on a new file.
      db.close();
      db = null;
      dbPath = null;
      removeOutdatedDatabase(join(dbDir, DB_FILENAME), versionRow.version);
      return initDb(dbDir);
    }

    return db;
  } catch (error: unknown) {
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
  // Database initialization either assigns the module-level handle or throws.
  return db!;
}

/**
 * Read-only corruption probe for status surfaces. Returns null when this
 * process already owns a live read-write handle: the on-disk database is
 * healthy by construction, because initDb would have recovered any genuine
 * corruption before that handle opened. Otherwise probes the file with
 * quick_check WITHOUT opening the read-write handle or running destructive
 * recovery, so a read-only status call can REPORT corruption rather than
 * silently quarantining the database as a side effect of being asked for
 * counts.
 */
export function probeStatusIntegrity(): { ok: true } | { ok: false; reason: string } | null {
  if (db) return null;
  return checkSqliteIntegrity(getSkillGraphDbPath());
}

/**
 * Read-only database access for the skill_graph_status reader. Never creates
 * the database file, never runs schema migrations, and never triggers
 * malformed-database recovery, so a status call from a secondary or bridge
 * process cannot become a second writer on the daemon-owned skill graph.
 * Reuses the read-write handle when this process already owns one (daemon
 * path). Returns null when the database file is absent or unopenable; callers
 * must report that state rather than open the file for writing.
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
    console.warn(`[skill-graph] Read-only open failed (${message}); read-only status reads degraded for this process`);
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

/** Keep indexed metadata hashes aligned with the sanitizer policy version. */
export function computeSkillMetadataContentHash(content: string): string {
  return createHash('sha256')
    .update(`${SKILL_METADATA_SANITIZER_VERSION}\n${content}`)
    .digest('hex');
}

function discoverGraphMetadataFiles(skillDir: string): string[] {
  if (!existsSync(skillDir)) {
    return [];
  }

  const discovered: string[] = [];
  const stack: string[] = [skillDir];
  const isTrustedLink = createPrivateSkillLinkCheck(skillDir);

  while (stack.length > 0) {
    // The loop guard guarantees a directory is available to pop.
    const currentDir = stack.pop()!;
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(currentDir, entry.name);
      // A private skill is linked into the tree on purpose; follow the link only
      // when its resolved target stays inside a directory the operator trusts.
      const linkedPrivateSkill = currentDir === skillDir
        && entry.name.startsWith('local-')
        && entry.isSymbolicLink()
        && isTrustedLink(entryPath);
      if (entry.isDirectory() || linkedPrivateSkill) {
        if (!IGNORED_SCAN_DIRS.has(entry.name)) {
          stack.push(entryPath);
        }
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

function isPathInside(child: string, root: string): boolean {
  const pathFromRoot = relative(root, child);
  return pathFromRoot !== ''
    && pathFromRoot !== '..'
    && !pathFromRoot.startsWith(`..${sep}`)
    && !isAbsolute(pathFromRoot);
}

function realpathOfNearestAncestor(path: string): string {
  let existingPath = path;
  while (!existsSync(existingPath)) {
    existingPath = dirname(existingPath);
  }

  return join(realpathSync(existingPath), relative(existingPath, path));
}

function deleteMissingNodesUnderRoot(
  database: Database.Database,
  skillIds: string[],
  scanRoot: string,
): number {
  const scannedSkillIds = new Set(skillIds);
  const rows = database.prepare('SELECT id, source_path FROM skill_nodes').all() as Array<{
    id: string;
    source_path: string;
  }>;
  const deleteNode = database.prepare('DELETE FROM skill_nodes WHERE id = ?');
  const workspaceRoot = findAdvisorWorkspaceRoot(process.cwd());
  const realScanRoot = realpathSync(scanRoot);
  let deletedNodes = 0;

  // Relative rows resolve against the workspace, and linked roots still match the stored source.
  for (const row of rows) {
    if (scannedSkillIds.has(row.id)) continue;

    const storedPath = resolve(workspaceRoot, row.source_path);
    if (!isPathInside(storedPath, scanRoot)
      && !isPathInside(realpathOfNearestAncestor(storedPath), realScanRoot)) {
      continue;
    }

    deletedNodes += deleteNode.run(row.id).changes;
  }

  return deletedNodes;
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
        const docPath = relative(skillDir, absolutePath);
        let raw: string;
        try {
          raw = readFileSync(absolutePath, 'utf8');
        } catch (error: unknown) {
          keptPaths.push(docPath);
          warnings.push(`DOC-READ-FAILED: ${toDisplayPath(absolutePath)} (${error instanceof Error ? error.message : String(error)})`);
          continue;
        }

        const parsed = parseDocFrontmatter(raw);
        if (!parsed) continue;

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
 * Files whose SHA-256 content hash has not changed are skipped. Node rows absent
 * from the scan are deleted only when their stored source path lies under its
 * root, so foreign-key cascade removes stale edges without dropping other skills.
 */
export function indexSkillMetadata(skillDir: string): SkillGraphIndexResult {
  const database = getDb();
  const discoveredFiles = discoverGraphMetadataFiles(skillDir);
  const parsedMetadata: ParsedSkillMetadata[] = [];
  const skillMetadataPaths: string[] = [];
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

    const contentHash = computeSkillMetadataContentHash(content);
    parsedMetadata.push(parseSkillMetadata(sourcePath, parsedJson, contentHash));
    skillMetadataPaths.push(sourcePath);
  }

  // One-identity invariant (ingestion guard): no skill-shaped graph-metadata.json
  // may live inside another skill's subtree. A distinctly-named nested identity
  // would silently register a second advisor node under a hub that must project a
  // single identity — the duplicate-id check below only catches same-id
  // collisions, not a nested identity with a different id. Spec-folder metadata is
  // content-filtered out above, so only true skill identities reach this check.
  for (const outer of skillMetadataPaths) {
    const hubDir = dirname(outer);
    for (const inner of skillMetadataPaths) {
      if (inner === outer) continue;
      const rel = relative(hubDir, dirname(inner));
      if (rel !== '' && !rel.startsWith('..')) {
        throw new Error(
          `One-identity violation: ${toDisplayPath(inner)} is nested inside the skill identity rooted at ${toDisplayPath(outer)}; a hub projects a single advisor identity, so nested packets must not carry their own graph-metadata.json`,
        );
      }
    }
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
    // An empty result is a wrong or missing root, not evidence that its skills were removed.
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
    deletedNodes = deleteMissingNodesUnderRoot(database, skillIds, resolve(skillDir));

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
        JSON.stringify(sanitizeMetadataStringArray(entry.node.domains, entry.node.sourcePath)),
        JSON.stringify(sanitizeMetadataStringArray(entry.node.intentSignals, entry.node.sourcePath)),
        entry.node.derived ? JSON.stringify(sanitizeDerivedMetadata(entry.node.derived, entry.node.sourcePath)) : null,
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
    // Nodes outside a narrow root stay in the graph, so they are valid targets.
    const knownSkillIds = new Set(database.prepare('SELECT id FROM skill_nodes').pluck().all() as string[]);
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
