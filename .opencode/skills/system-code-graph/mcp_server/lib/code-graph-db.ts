// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Database
// ───────────────────────────────────────────────────────────────
// SQLite storage for structural code graph (nodes + edges).
// Uses separate code-graph.sqlite alongside the memory index DB.

import { readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, resolve as resolvePath } from 'node:path';

import Database from 'better-sqlite3';

import { DATABASE_DIR } from '../core/config.js';
import { assertDbHandleClosed } from './close-db-assertion.js';
import { EDGE_TYPES, generateContentHash } from './indexer-types.js';
import {
  CODE_GRAPH_SCOPE_FINGERPRINT_KEY,
  CODE_GRAPH_SCOPE_LABEL_KEY,
  CODE_GRAPH_SCOPE_SOURCE_KEY,
  CODE_GRAPH_SKILL_EXCLUDE_GLOBS,
  parseIndexScopePolicyFromFingerprint,
} from './index-scope-policy.js';

import type { CodeEdge, CodeNode, DetectorProvenance, EdgeType } from './indexer-types.js';
import type { IndexScopePolicy, IndexScopePolicySource } from './index-scope-policy.js';

let db: Database.Database | null = null;
let dbPath: string | null = null;

export interface StartupHighlight {
  name: string;
  kind: string;
  filePath: string;
  callCount: number;
}

export interface FileImportDependent {
  importedFilePath: string;
  importerFilePath: string;
}

export interface FileSymbolId {
  filePath: string;
  symbolId: string;
}

export interface FileDegree {
  filePath: string;
  degree: number;
}

export interface DetectorProvenanceSummary {
  dominant: DetectorProvenance | 'unknown';
  counts: Partial<Record<DetectorProvenance, number>>;
}

export type GraphEdgeEvidenceSummaryClass =
  | 'import'
  | 'type_reference'
  | 'test_coverage'
  | 'inferred_heuristic'
  | 'direct_call';

export interface GraphEdgeEnrichmentSummary {
  edgeEvidenceClass: GraphEdgeEvidenceSummaryClass;
  numericConfidence: number;
  crossFileCallResolution?: {
    resolved: number;
    unresolved: number;
    ambiguousSkipped: number;
  };
}

export interface StoredCodeGraphScope {
  fingerprint: string | null;
  label: string | null;
  includeSkills: boolean | null;
  includedSkillsList: IndexScopePolicy['includedSkillsList'] | null;
  includeAgents: boolean | null;
  includeCommands: boolean | null;
  includeSpecs: boolean | null;
  includePlugins: boolean | null;
  source: IndexScopePolicySource | null;
}

export interface ParseDiagnostic {
  readonly filePath: string;
  readonly errorMessage: string;
  readonly errorCount: number;
  readonly lastSeenAt: string;
}

export interface ParseDiagnosticsSummary {
  readonly affectedFiles: number;
  readonly recentErrors: ParseDiagnostic[];
}

export interface FailedScanRecord {
  readonly reason: string;
  readonly totalFiles: number;
  readonly totalNodes: number;
  readonly parseErrorCount: number;
  readonly parseErrorRatio: number;
  readonly recordedAt: string;
  readonly previousGitHead?: string | null;
  readonly currentGitHead?: string | null;
  readonly scopeFingerprint?: string | null;
  readonly scopeLabel?: string | null;
  readonly errors?: string[];
}

export type CodeGraphTombstoneKind = 'file' | 'node' | 'edge';

export interface CodeGraphTombstoneRecord {
  readonly id: number;
  readonly entityKind: CodeGraphTombstoneKind;
  readonly entityId: string | null;
  readonly sourceId: string | null;
  readonly targetId: string | null;
  readonly edgeType: string | null;
  readonly filePath: string | null;
  readonly reason: string;
  readonly deletedAt: string;
}

export interface CodeGraphTombstoneSummary {
  readonly enabled: boolean;
  readonly retentionLimit: number;
  readonly retainedRows: number;
  readonly byKind: Record<string, number>;
  readonly byReason: Record<string, number>;
  readonly recent: CodeGraphTombstoneRecord[];
}

export interface SymbolIndexRow {
  readonly symbolId: string;
  readonly fqName: string | null;
  readonly name: string | null;
  readonly kind: string | null;
  readonly filePath: string | null;
  readonly startLine: number | null;
  readonly signature: string | null;
  readonly docstring: string | null;
}

export interface DeleteAuditOptions {
  readonly reason?: string;
}

/** Schema version for migration tracking */
export const SCHEMA_VERSION = 8;

interface CodeEdgesTableShape {
  readonly hasValidAt: boolean;
  readonly hasInvalidAt: boolean;
}

export interface CodeEdgeGovernanceVocabularyOffender {
  readonly tableName: 'code_edges' | 'code_graph_tombstones';
  readonly edgeType: string;
  readonly count: number;
}

const CODE_EDGES_REBUILD_TABLE_NAME = 'code_edges__edge_vocab_rebuild';
export const CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV = 'SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB';
export const CODE_GRAPH_EDGE_TYPE_VOCABULARY: readonly EdgeType[] = EDGE_TYPES;

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

const CODE_EDGE_TYPE_CHECK_SQL = `edge_type IN (${CODE_GRAPH_EDGE_TYPE_VOCABULARY.map(sqlString).join(', ')})`;

function createCodeEdgesTableSql(
  tableName: string,
  withEdgeTypeCheck: boolean,
  shape: CodeEdgesTableShape = { hasValidAt: true, hasInvalidAt: true },
): string {
  const edgeTypeDefinition = withEdgeTypeCheck
    ? `edge_type TEXT NOT NULL CHECK (${CODE_EDGE_TYPE_CHECK_SQL})`
    : 'edge_type TEXT NOT NULL';
  const temporalColumns = [
    ...(shape.hasValidAt ? ['valid_at INTEGER'] : []),
    ...(shape.hasInvalidAt ? ['invalid_at INTEGER'] : []),
  ];
  return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      ${edgeTypeDefinition},
      weight REAL DEFAULT 1.0,
      metadata TEXT${temporalColumns.length > 0 ? ',' : ''}
      ${temporalColumns.join(',\n      ')}
    );
  `;
}

function createCodeEdgeIndexesSql(): string {
  return `
    CREATE INDEX IF NOT EXISTS idx_edges_source ON code_edges(source_id, edge_type);
    CREATE INDEX IF NOT EXISTS idx_edges_target ON code_edges(target_id, edge_type);
    CREATE INDEX IF NOT EXISTS idx_edges_type ON code_edges(edge_type);
  `;
}

/** SQL schema for code graph tables */
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS code_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    file_mtime_ms INTEGER NOT NULL DEFAULT 0,
    node_count INTEGER DEFAULT 0,
    edge_count INTEGER DEFAULT 0,
    parse_health TEXT DEFAULT 'clean',
    indexed_at TEXT NOT NULL,
    parse_duration_ms INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS code_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol_id TEXT NOT NULL UNIQUE,
    file_id INTEGER NOT NULL REFERENCES code_files(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    fq_name TEXT NOT NULL,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    start_column INTEGER DEFAULT 0,
    end_column INTEGER DEFAULT 0,
    language TEXT NOT NULL,
    signature TEXT,
    docstring TEXT,
    content_hash TEXT NOT NULL
  );

  ${createCodeEdgesTableSql('code_edges', false)}

  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS code_graph_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS parse_diagnostics (
    file_path TEXT PRIMARY KEY,
    error_message TEXT NOT NULL,
    error_count INTEGER NOT NULL DEFAULT 1,
    last_seen_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS parser_skip_list (
    file_path     TEXT PRIMARY KEY,
    error_class   TEXT NOT NULL CHECK (error_class IN ('B1', 'B2', 'OTHER')),
    retry_class   TEXT NOT NULL DEFAULT 'fatal' CHECK (retry_class IN ('transient', 'fatal')),
    error_message TEXT,
    added_at      TEXT NOT NULL,
    last_seen_at  TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    source        TEXT NOT NULL CHECK (source IN ('seed', 'runtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_nodes_file_id ON code_nodes(file_id);
  CREATE INDEX IF NOT EXISTS idx_nodes_symbol_id ON code_nodes(symbol_id);
  CREATE INDEX IF NOT EXISTS idx_nodes_kind ON code_nodes(kind);
  CREATE INDEX IF NOT EXISTS idx_nodes_name ON code_nodes(name);
  CREATE INDEX IF NOT EXISTS idx_file_line ON code_nodes(file_path, start_line);
  ${createCodeEdgeIndexesSql()}
  CREATE INDEX IF NOT EXISTS idx_files_path ON code_files(file_path);
  CREATE INDEX IF NOT EXISTS idx_files_hash ON code_files(content_hash);
  CREATE INDEX IF NOT EXISTS idx_parse_diagnostics_last_seen ON parse_diagnostics(last_seen_at);
  CREATE INDEX IF NOT EXISTS idx_parser_skip_list_class ON parser_skip_list(error_class);
`;

const CODE_GRAPH_TOMBSTONES_ENV = 'SPECKIT_CODE_GRAPH_TOMBSTONES';
const CODE_GRAPH_TOMBSTONE_LIMIT_ENV = 'SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT';
const CODE_GRAPH_GENERATION_METADATA_KEY = 'graph_generation';
export const CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV = 'SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS';
const DEFAULT_TOMBSTONE_LIMIT = 100;
const MAX_TOMBSTONE_LIMIT = 10_000;

const CODE_EDGE_BITEMPORAL_COLUMNS: ReadonlyArray<{ name: string; sql: string }> = [
  { name: 'valid_at', sql: 'ALTER TABLE code_edges ADD COLUMN valid_at INTEGER' },
  { name: 'invalid_at', sql: 'ALTER TABLE code_edges ADD COLUMN invalid_at INTEGER' },
];

export function codeGraphEdgeBitemporalReadsEnabled(): boolean {
  return process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] === 'true';
}

export function codeGraphEdgeGovernanceVocabEnabled(): boolean {
  return process.env[CODE_GRAPH_EDGE_GOVERNANCE_VOCAB_ENV] === 'true';
}

function codeGraphTombstonesEnabled(): boolean {
  return process.env[CODE_GRAPH_TOMBSTONES_ENV] === 'true';
}

function getCodeGraphTombstoneLimit(): number {
  const raw = process.env[CODE_GRAPH_TOMBSTONE_LIMIT_ENV];
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_TOMBSTONE_LIMIT;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_TOMBSTONE_LIMIT;
  }
  return Math.min(Math.trunc(parsed), MAX_TOMBSTONE_LIMIT);
}

function ensureTombstoneSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS code_graph_tombstones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_kind TEXT NOT NULL CHECK (entity_kind IN ('file', 'node', 'edge')),
      entity_id TEXT,
      source_id TEXT,
      target_id TEXT,
      edge_type TEXT,
      file_path TEXT,
      reason TEXT NOT NULL,
      deleted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_code_graph_tombstones_deleted_at ON code_graph_tombstones(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_code_graph_tombstones_kind_reason ON code_graph_tombstones(entity_kind, reason);
  `);
}

function tombstoneTableExists(database: Database.Database): boolean {
  const row = database.prepare(`
    SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_graph_tombstones'
  `).get() as { name: string } | undefined;
  return row !== undefined;
}

function pruneTombstones(database: Database.Database): void {
  const limit = getCodeGraphTombstoneLimit();
  database.prepare(`
    DELETE FROM code_graph_tombstones
    WHERE id NOT IN (
      SELECT id FROM code_graph_tombstones
      ORDER BY deleted_at DESC, id DESC
      LIMIT ?
    )
  `).run(limit);
}

function recordNodeTombstones(
  database: Database.Database,
  fileId: number,
  reason: string,
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled()) {
    return;
  }
  ensureTombstoneSchema(database);
  database.prepare(`
    INSERT INTO code_graph_tombstones (entity_kind, entity_id, file_path, reason, deleted_at)
    SELECT 'node', symbol_id, file_path, ?, ?
    FROM code_nodes
    WHERE file_id = ?
  `).run(reason, deletedAt, fileId);
  pruneTombstones(database);
}

function recordEdgeTombstonesForSymbols(
  database: Database.Database,
  symbolIds: string[],
  reason: string,
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled() || symbolIds.length === 0) {
    return;
  }
  ensureTombstoneSchema(database);
  const placeholders = symbolIds.map(() => '?').join(',');
  database.prepare(`
    INSERT INTO code_graph_tombstones (
      entity_kind, entity_id, source_id, target_id, edge_type, file_path, reason, deleted_at
    )
    SELECT
      'edge',
      source_id || '->' || target_id || ':' || edge_type,
      source_id,
      target_id,
      edge_type,
      COALESCE(source_node.file_path, target_node.file_path),
      ?,
      ?
    FROM code_edges edge
    LEFT JOIN code_nodes source_node ON source_node.symbol_id = edge.source_id
    LEFT JOIN code_nodes target_node ON target_node.symbol_id = edge.target_id
    WHERE edge.source_id IN (${placeholders}) OR edge.target_id IN (${placeholders})
  `).run(reason, deletedAt, ...symbolIds, ...symbolIds);
  pruneTombstones(database);
}

function recordReplaceNodeEdgeTombstones(
  database: Database.Database,
  sourceSymbolIds: string[],
  removedTargetSymbolIds: string[],
  reason: string,
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled()) {
    return;
  }
  const sourceIds = [...new Set(sourceSymbolIds)];
  const removedTargetIds = [...new Set(removedTargetSymbolIds)];
  if (sourceIds.length === 0 && removedTargetIds.length === 0) {
    return;
  }

  ensureTombstoneSchema(database);
  const clauses: string[] = [];
  const params: string[] = [];
  if (sourceIds.length > 0) {
    clauses.push(`edge.source_id IN (${sourceIds.map(() => '?').join(',')})`);
    params.push(...sourceIds);
  }
  if (removedTargetIds.length > 0) {
    clauses.push(`edge.target_id IN (${removedTargetIds.map(() => '?').join(',')})`);
    params.push(...removedTargetIds);
  }

  database.prepare(`
    INSERT INTO code_graph_tombstones (
      entity_kind, entity_id, source_id, target_id, edge_type, file_path, reason, deleted_at
    )
    SELECT
      'edge',
      source_id || '->' || target_id || ':' || edge_type,
      source_id,
      target_id,
      edge_type,
      COALESCE(source_node.file_path, target_node.file_path),
      ?,
      ?
    FROM code_edges edge
    LEFT JOIN code_nodes source_node ON source_node.symbol_id = edge.source_id
    LEFT JOIN code_nodes target_node ON target_node.symbol_id = edge.target_id
    WHERE ${clauses.join(' OR ')}
  `).run(reason, deletedAt, ...params);
  pruneTombstones(database);
}

function recordEdgeTombstonesForSources(
  database: Database.Database,
  sourceIds: string[],
  reason: string,
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled() || sourceIds.length === 0) {
    return;
  }
  ensureTombstoneSchema(database);
  const placeholders = sourceIds.map(() => '?').join(',');
  database.prepare(`
    INSERT INTO code_graph_tombstones (
      entity_kind, entity_id, source_id, target_id, edge_type, file_path, reason, deleted_at
    )
    SELECT
      'edge',
      source_id || '->' || target_id || ':' || edge_type,
      source_id,
      target_id,
      edge_type,
      source_node.file_path,
      ?,
      ?
    FROM code_edges edge
    LEFT JOIN code_nodes source_node ON source_node.symbol_id = edge.source_id
    WHERE edge.source_id IN (${placeholders})
  `).run(reason, deletedAt, ...sourceIds);
  pruneTombstones(database);
}

function recordDanglingEdgeTombstones(
  database: Database.Database,
  reason: string,
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled()) {
    return;
  }
  ensureTombstoneSchema(database);
  database.prepare(`
    INSERT INTO code_graph_tombstones (
      entity_kind, entity_id, source_id, target_id, edge_type, file_path, reason, deleted_at
    )
    SELECT
      'edge',
      source_id || '->' || target_id || ':' || edge_type,
      source_id,
      target_id,
      edge_type,
      COALESCE(source_node.file_path, target_node.file_path),
      ?,
      ?
    FROM code_edges edge
    LEFT JOIN code_nodes source_node ON source_node.symbol_id = edge.source_id
    LEFT JOIN code_nodes target_node ON target_node.symbol_id = edge.target_id
    WHERE (
      edge.edge_type != 'SUPERSEDES'
      AND (
        edge.source_id NOT IN (SELECT symbol_id FROM code_nodes)
        OR edge.target_id NOT IN (SELECT symbol_id FROM code_nodes)
      )
    )
      OR (edge.edge_type = 'SUPERSEDES' AND edge.target_id NOT IN (SELECT symbol_id FROM code_nodes))
  `).run(reason, deletedAt);
  pruneTombstones(database);
}

function recordFileTombstone(
  database: Database.Database,
  filePath: string,
  reason: string,
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled()) {
    return;
  }
  ensureTombstoneSchema(database);
  database.prepare(`
    INSERT INTO code_graph_tombstones (entity_kind, entity_id, file_path, reason, deleted_at)
    VALUES ('file', ?, ?, ?, ?)
  `).run(filePath, filePath, reason, deletedAt);
  pruneTombstones(database);
}

interface SupersedesCandidate {
  oldNode: CodeNode;
  newNode: CodeNode;
}

function collectSupersedesCandidates(
  database: Database.Database,
  newNodes: CodeNode[],
): SupersedesCandidate[] {
  if (!codeGraphTombstonesEnabled() || newNodes.length === 0) {
    return [];
  }
  const contentHashes = [...new Set(newNodes.map((node) => node.contentHash).filter(Boolean))];
  if (contentHashes.length === 0) {
    return [];
  }

  const rows = database.prepare(`
    SELECT *
    FROM code_nodes
    WHERE content_hash IN (${contentHashes.map(() => '?').join(',')})
  `).all(...contentHashes) as Array<Record<string, unknown>>;
  const oldNodesByHash = new Map<string, CodeNode[]>();
  for (const row of rows) {
    const node = rowToNode(row);
    const oldNodes = oldNodesByHash.get(node.contentHash) ?? [];
    oldNodes.push(node);
    oldNodesByHash.set(node.contentHash, oldNodes);
  }

  const candidates: SupersedesCandidate[] = [];
  for (const newNode of newNodes) {
    for (const oldNode of oldNodesByHash.get(newNode.contentHash) ?? []) {
      if (oldNode.symbolId === newNode.symbolId) {
        continue;
      }
      if (
        oldNode.filePath === newNode.filePath
        && oldNode.fqName === newNode.fqName
        && oldNode.kind === newNode.kind
      ) {
        continue;
      }
      candidates.push({ oldNode, newNode });
    }
  }
  return candidates;
}

function recordSupersedesLineage(
  database: Database.Database,
  candidates: SupersedesCandidate[],
  deletedAt: string,
): void {
  if (!codeGraphTombstonesEnabled() || candidates.length === 0) {
    return;
  }

  ensureTombstoneSchema(database);
  const edgeExists = database.prepare(`
    SELECT 1
    FROM code_edges
    WHERE source_id = ? AND target_id = ? AND edge_type = 'SUPERSEDES'
    LIMIT 1
  `);
  // A SUPERSEDES lineage edge is an open fact about a content-stable rename, so
  // under bitemporal reads it needs a valid_at to be visible to an as-of query,
  // which requires valid_at IS NOT NULL. Without the stamp the lineage edges
  // were silently excluded from every as-of read. invalid_at stays open because
  // the lineage relation itself is not later superseded. The plain insert runs
  // when the flag is off, byte-identical to the prior write with NULL validity.
  const bitemporal = codeGraphEdgeBitemporalReadsEnabled();
  const lineageValidAt = bitemporal ? getNextCodeGraphGeneration() : null;
  const insertEdge = bitemporal
    ? database.prepare(`
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata, valid_at, invalid_at)
        VALUES (?, ?, 'SUPERSEDES', ?, ?, ?, NULL)
      `)
    : database.prepare(`
        INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
        VALUES (?, ?, 'SUPERSEDES', ?, ?)
      `);
  const insertAudit = database.prepare(`
    INSERT INTO code_graph_tombstones (
      entity_kind, entity_id, source_id, target_id, edge_type, file_path, reason, deleted_at
    )
    VALUES ('edge', ?, ?, ?, 'SUPERSEDES', ?, 'symbol_supersedes', ?)
  `);
  const metadata = JSON.stringify({
    confidence: 1,
    detectorProvenance: 'structured',
    evidenceClass: 'INFERRED',
    reason: 'content-hash-lineage',
    step: 'replace-nodes',
  });

  for (const { oldNode, newNode } of candidates) {
    const exists = edgeExists.get(oldNode.symbolId, newNode.symbolId);
    if (exists) {
      continue;
    }
    if (bitemporal) {
      insertEdge.run(oldNode.symbolId, newNode.symbolId, 1, metadata, lineageValidAt);
    } else {
      insertEdge.run(oldNode.symbolId, newNode.symbolId, 1, metadata);
    }
    insertAudit.run(
      `${oldNode.symbolId}->${newNode.symbolId}:SUPERSEDES`,
      oldNode.symbolId,
      newNode.symbolId,
      newNode.filePath,
      deletedAt,
    );
  }
  pruneTombstones(database);
}

function mapTombstoneRow(row: Record<string, unknown>): CodeGraphTombstoneRecord {
  return {
    id: row.id as number,
    entityKind: row.entity_kind as CodeGraphTombstoneKind,
    entityId: row.entity_id as string | null,
    sourceId: row.source_id as string | null,
    targetId: row.target_id as string | null,
    edgeType: row.edge_type as string | null,
    filePath: row.file_path as string | null,
    reason: row.reason as string,
    deletedAt: row.deleted_at as string,
  };
}

function getCurrentFileMtimeMs(filePath: string): number | null {
  try {
    return Math.trunc(statSync(filePath).mtimeMs);
  } catch {
    return null;
  }
}

function getCurrentFileContentHash(filePath: string): string | null {
  try {
    return generateContentHash(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function hasColumn(database: Database.Database, tableName: string, columnName: string): boolean {
  const rows = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === columnName);
}

function tableExists(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(`
    SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
  `).get(tableName) as { name: string } | undefined;
  return row !== undefined;
}

function getTableColumns(database: Database.Database, tableName: string): string[] {
  const rows = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return rows.map((row) => row.name);
}

function getCodeEdgesTableShape(database: Database.Database): CodeEdgesTableShape {
  const columns = new Set(getTableColumns(database, 'code_edges'));
  return {
    hasValidAt: columns.has('valid_at'),
    hasInvalidAt: columns.has('invalid_at'),
  };
}

function requireTableForMigration(database: Database.Database, tableName: string, context: string): void {
  if (!tableExists(database, tableName)) {
    throw new Error(`${context}: required table "${tableName}" is missing`);
  }
}

function requireColumnsForMigration(
  database: Database.Database,
  tableName: string,
  requiredColumns: readonly string[],
  context: string,
): void {
  const columns = new Set(getTableColumns(database, tableName));
  const missing = requiredColumns.filter((columnName) => !columns.has(columnName));
  if (missing.length > 0) {
    throw new Error(`${context}: ${tableName} missing required column(s): ${missing.join(', ')}`);
  }
}

function addColumnIfMissing(
  database: Database.Database,
  tableName: string,
  columns: Set<string>,
  column: { name: string; sql: string },
  context: string,
): void {
  if (columns.has(column.name)) {
    return;
  }
  try {
    database.exec(column.sql);
    columns.add(column.name);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('duplicate column')) {
      throw error;
    }
    columns.add(column.name);
  }
  if (!hasColumn(database, tableName, column.name)) {
    throw new Error(`${context}: failed to add ${tableName}.${column.name}`);
  }
}

function dropColumnIfPresent(
  database: Database.Database,
  tableName: string,
  columnName: string,
  context: string,
): void {
  if (!tableExists(database, tableName)) {
    return;
  }
  if (!hasColumn(database, tableName, columnName)) {
    return;
  }
  database.exec(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
  if (hasColumn(database, tableName, columnName)) {
    throw new Error(`${context}: ${tableName}.${columnName} still exists after rollback`);
  }
}

function getMigrationGeneration(database: Database.Database): number {
  const row = database.prepare(`
    SELECT value FROM code_graph_metadata WHERE key = ?
  `).get(CODE_GRAPH_GENERATION_METADATA_KEY) as { value: string } | undefined;
  return parseCodeGraphGeneration(row?.value ?? null);
}

export function backfillCodeEdgeBitemporalColumns(
  database: Database.Database,
  context: string = 'code-edge bitemporal backfill',
): void {
  requireTableForMigration(database, 'code_edges', context);
  requireTableForMigration(database, 'code_graph_metadata', context);
  requireColumnsForMigration(database, 'code_edges', ['valid_at', 'invalid_at'], context);

  const generation = getMigrationGeneration(database);
  database.prepare(`
    UPDATE code_edges
    SET valid_at = COALESCE(valid_at, ?)
    WHERE valid_at IS NULL
  `).run(generation);
}

export function ensureCodeEdgeBitemporalSchema(
  database: Database.Database,
  context: string = 'code-edge bitemporal migration',
): void {
  const migrate = database.transaction(() => {
    requireTableForMigration(database, 'code_edges', context);
    requireTableForMigration(database, 'code_graph_metadata', context);

    const columns = new Set(getTableColumns(database, 'code_edges'));
    for (const column of CODE_EDGE_BITEMPORAL_COLUMNS) {
      addColumnIfMissing(database, 'code_edges', columns, column, context);
    }

    backfillCodeEdgeBitemporalColumns(database, context);
  });
  migrate();
}

export function rollbackCodeEdgeBitemporalSchema(
  database: Database.Database,
  context: string = 'code-edge bitemporal rollback',
): void {
  const rollback = database.transaction(() => {
    for (const column of ['invalid_at', 'valid_at']) {
      dropColumnIfPresent(database, 'code_edges', column, context);
    }
  });
  rollback();
}

function getCodeEdgesCreateSql(database: Database.Database): string | null {
  const row = database.prepare(`
    SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'code_edges'
  `).get() as { sql: string } | undefined;
  return row?.sql ?? null;
}

export function codeGraphEdgeGovernanceVocabSchemaApplied(database: Database.Database): boolean {
  const createSql = getCodeEdgesCreateSql(database);
  return createSql !== null
    && createSql.includes('CHECK')
    && CODE_GRAPH_EDGE_TYPE_VOCABULARY.every((edgeType) => createSql.includes(sqlString(edgeType)));
}

export function scanCodeEdgeGovernanceVocabulary(
  database: Database.Database,
  context: string = 'code-edge governance vocabulary scan',
): CodeEdgeGovernanceVocabularyOffender[] {
  requireTableForMigration(database, 'code_edges', context);
  requireColumnsForMigration(database, 'code_edges', ['edge_type'], context);

  const allowed = new Set<string>(CODE_GRAPH_EDGE_TYPE_VOCABULARY);
  const offenders: CodeEdgeGovernanceVocabularyOffender[] = [];
  const edgeRows = database.prepare(`
    SELECT edge_type, COUNT(*) AS count
    FROM code_edges
    GROUP BY edge_type
    ORDER BY edge_type
  `).all() as Array<{ edge_type: string | null; count: number }>;

  for (const row of edgeRows) {
    if (row.edge_type !== null && !allowed.has(row.edge_type)) {
      offenders.push({ tableName: 'code_edges', edgeType: row.edge_type, count: row.count });
    }
  }

  if (tombstoneTableExists(database)) {
    requireColumnsForMigration(database, 'code_graph_tombstones', ['edge_type'], context);
    const tombstoneRows = database.prepare(`
      SELECT edge_type, COUNT(*) AS count
      FROM code_graph_tombstones
      GROUP BY edge_type
      ORDER BY edge_type
    `).all() as Array<{ edge_type: string | null; count: number }>;
    for (const row of tombstoneRows) {
      if (row.edge_type !== null && !allowed.has(row.edge_type)) {
        offenders.push({ tableName: 'code_graph_tombstones', edgeType: row.edge_type, count: row.count });
      }
    }
  }

  return offenders;
}

export function backfillCodeEdgeGovernanceVocabulary(
  database: Database.Database,
  context: string = 'code-edge governance vocabulary backfill',
): void {
  const offenders = scanCodeEdgeGovernanceVocabulary(database, context);
  if (offenders.length === 0) {
    return;
  }
  const rendered = offenders
    .map((offender) => `${offender.tableName}.${offender.edgeType} (${offender.count})`)
    .join(', ');
  throw new Error(`${context}: out-of-vocabulary edge_type value(s): ${rendered}`);
}

function rebuildCodeEdgesTable(
  database: Database.Database,
  withEdgeTypeCheck: boolean,
  context: string,
): void {
  requireTableForMigration(database, 'code_edges', context);
  requireColumnsForMigration(database, 'code_edges', [
    'id',
    'source_id',
    'target_id',
    'edge_type',
    'weight',
    'metadata',
  ], context);

  const shape = getCodeEdgesTableShape(database);
  const copyColumns = [
    'id',
    'source_id',
    'target_id',
    'edge_type',
    'weight',
    'metadata',
    ...(shape.hasValidAt ? ['valid_at'] : []),
    ...(shape.hasInvalidAt ? ['invalid_at'] : []),
  ];
  const columnSql = copyColumns.join(', ');
  database.exec(`DROP TABLE IF EXISTS ${CODE_EDGES_REBUILD_TABLE_NAME}`);
  database.exec(createCodeEdgesTableSql(CODE_EDGES_REBUILD_TABLE_NAME, withEdgeTypeCheck, shape));
  database.exec(`
    INSERT INTO ${CODE_EDGES_REBUILD_TABLE_NAME} (${columnSql})
    SELECT ${columnSql}
    FROM code_edges;
    DROP TABLE code_edges;
    ALTER TABLE ${CODE_EDGES_REBUILD_TABLE_NAME} RENAME TO code_edges;
    ${createCodeEdgeIndexesSql()}
  `);

  const applied = codeGraphEdgeGovernanceVocabSchemaApplied(database);
  if (withEdgeTypeCheck && !applied) {
    throw new Error(`${context}: failed to apply code_edges.edge_type CHECK`);
  }
  if (!withEdgeTypeCheck && applied) {
    throw new Error(`${context}: failed to remove code_edges.edge_type CHECK`);
  }
}

export function ensureCodeEdgeGovernanceVocabSchema(
  database: Database.Database,
  context: string = 'code-edge governance vocabulary migration',
): void {
  const migrate = database.transaction(() => {
    backfillCodeEdgeGovernanceVocabulary(database, context);
    if (codeGraphEdgeGovernanceVocabSchemaApplied(database)) {
      return;
    }
    rebuildCodeEdgesTable(database, true, context);
  });
  migrate();
}

export function rollbackCodeEdgeGovernanceVocabSchema(
  database: Database.Database,
  context: string = 'code-edge governance vocabulary rollback',
): void {
  const rollback = database.transaction(() => {
    if (!tableExists(database, 'code_edges') || !codeGraphEdgeGovernanceVocabSchemaApplied(database)) {
      return;
    }
    rebuildCodeEdgesTable(database, false, context);
  });
  rollback();
}

function ensureSchemaMigrations(database: Database.Database): void {
  if (!hasColumn(database, 'code_files', 'file_mtime_ms')) {
    database.exec('ALTER TABLE code_files ADD COLUMN file_mtime_ms INTEGER NOT NULL DEFAULT 0');
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS code_graph_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS parse_diagnostics (
      file_path TEXT PRIMARY KEY,
      error_message TEXT NOT NULL,
      error_count INTEGER NOT NULL DEFAULT 1,
      last_seen_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS parser_skip_list (
      file_path     TEXT PRIMARY KEY,
      error_class   TEXT NOT NULL CHECK (error_class IN ('B1', 'B2', 'OTHER')),
      retry_class   TEXT NOT NULL DEFAULT 'fatal' CHECK (retry_class IN ('transient', 'fatal')),
      error_message TEXT,
      added_at      TEXT NOT NULL,
      last_seen_at  TEXT NOT NULL,
      attempt_count INTEGER NOT NULL DEFAULT 1,
      source        TEXT NOT NULL CHECK (source IN ('seed', 'runtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_file_line ON code_nodes(file_path, start_line);
    CREATE INDEX IF NOT EXISTS idx_parse_diagnostics_last_seen ON parse_diagnostics(last_seen_at);
    CREATE INDEX IF NOT EXISTS idx_parser_skip_list_class ON parser_skip_list(error_class);
  `);

  if (!hasColumn(database, 'parser_skip_list', 'retry_class')) {
    database.exec("ALTER TABLE parser_skip_list ADD COLUMN retry_class TEXT NOT NULL DEFAULT 'fatal' CHECK (retry_class IN ('transient', 'fatal'))");
  }
  database.exec('CREATE INDEX IF NOT EXISTS idx_parser_skip_list_retry_class ON parser_skip_list(retry_class)');

  const now = new Date().toISOString();
  database.prepare(`
    INSERT OR IGNORE INTO parser_skip_list (
      file_path, error_class, retry_class, error_message, added_at, last_seen_at, attempt_count, source
    )
    SELECT
      file_path,
      'B1',
      'fatal',
      error_message,
      ?,
      ?,
      MAX(1, error_count),
      'seed'
    FROM parse_diagnostics
    WHERE error_message LIKE '%resolved is not a function%'
  `).run(now, now);

  ensureCodeEdgeBitemporalSchema(database, 'code-edge bitemporal migration');
  if (codeGraphEdgeGovernanceVocabEnabled()) {
    ensureCodeEdgeGovernanceVocabSchema(database, 'code-edge governance vocabulary migration');
  }
}

/** Initialize (or get) the code graph database */
export function initDb(dbDir: string): Database.Database {
  if (db) return db;

  try {
    dbPath = join(dbDir, 'code-graph.sqlite');
    db = new Database(dbPath);
    // Explicit busy_timeout so concurrent writers wait up to 5s
    // for the writer lock instead of throwing SQLITE_BUSY immediately. Set
    // BEFORE journal_mode/foreign_keys so any incidental contention during
    // PRAGMA setup also benefits from the wait.
    db.pragma('busy_timeout = 5000');
    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
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
  } catch (err) {
    if (db) {
      try { db.close(); } catch { /* best effort cleanup for failed init */ }
    }
    db = null;
    dbPath = null;
    throw err;
  }
}

/** Get the current database instance (lazy-initializes if needed) */
export function getDb(): Database.Database {
  if (!db) initDb(DATABASE_DIR);
  // initDb either assigns the singleton database or throws before this return.
  return db!;
}

/** Close the database connection */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    dbPath = null;
  }
}

export function closeDbWithAssertion(): void {
  const handle = db;
  closeDb();
  assertDbHandleClosed(handle);
}

function getMetadata(key: string): string | null {
  const d = getDb();
  const row = d.prepare('SELECT value FROM code_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

function setMetadata(key: string, value: string): void {
  const d = getDb();
  const now = new Date().toISOString();
  d.prepare(`
    INSERT INTO code_graph_metadata (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value, now);
}

function clearMetadata(key: string): void {
  const d = getDb();
  d.prepare('DELETE FROM code_graph_metadata WHERE key = ?').run(key);
}

export function getCodeGraphMetadata(key: string): string | null {
  return getMetadata(key);
}

export function setCodeGraphMetadata(key: string, value: string): void {
  setMetadata(key, value);
}

function parseCodeGraphGeneration(raw: string | null): number {
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return parsed || 0;
}

export function getCodeGraphGeneration(): number {
  return parseCodeGraphGeneration(getMetadata(CODE_GRAPH_GENERATION_METADATA_KEY));
}

// The generation bump trails the persistence loop: a scan writes its edges while
// the counter still holds the prior scan's value, then bumps once at the end. So
// the edges written during scan K logically belong to the generation that scan K
// will produce, which is one past the current counter. Loop-time bitemporal
// writers stamp at this next generation so a closed edge carries a window that is
// readable at the generation a consumer would name for that scan, and so a close
// lands strictly after the valid_at of an edge inserted in an earlier scan. The
// post-bump dangling sweep uses the plain current generation instead, because the
// bump has already landed by the time it runs.
function getNextCodeGraphGeneration(): number {
  return getCodeGraphGeneration() + 1;
}

export function bumpCodeGraphGeneration(): number {
  const d = getDb();
  const bumpGeneration = d.transaction(() => {
    const current = getMetadata(CODE_GRAPH_GENERATION_METADATA_KEY);
    const next = parseCodeGraphGeneration(current) + 1;
    setMetadata(CODE_GRAPH_GENERATION_METADATA_KEY, String(next));
    return next;
  });

  return bumpGeneration();
}

export function getStoredCodeGraphScope(): StoredCodeGraphScope {
  const fingerprint = getMetadata(CODE_GRAPH_SCOPE_FINGERPRINT_KEY);
  const label = getMetadata(CODE_GRAPH_SCOPE_LABEL_KEY);
  const source = getMetadata(CODE_GRAPH_SCOPE_SOURCE_KEY);
  const policy = parseIndexScopePolicyFromFingerprint({ fingerprint, source });

  return {
    fingerprint,
    label,
    includeSkills: policy?.includeSkills ?? null,
    includedSkillsList: policy?.includedSkillsList ?? null,
    includeAgents: policy?.includeAgents ?? null,
    includeCommands: policy?.includeCommands ?? null,
    includeSpecs: policy?.includeSpecs ?? null,
    includePlugins: policy?.includePlugins ?? null,
    source: policy?.source ?? null,
  };
}

export function setCodeGraphScope(scopePolicy: Pick<IndexScopePolicy, 'fingerprint' | 'label' | 'source'>): void {
  setMetadata(CODE_GRAPH_SCOPE_FINGERPRINT_KEY, scopePolicy.fingerprint);
  setMetadata(CODE_GRAPH_SCOPE_LABEL_KEY, scopePolicy.label);
  setMetadata(CODE_GRAPH_SCOPE_SOURCE_KEY, scopePolicy.source);
}

export function getLastGitHead(): string | null {
  return getMetadata('last_git_head');
}

export function setLastGitHead(head: string): void {
  setMetadata('last_git_head', head);
}

export function getLastDetectorProvenance(): DetectorProvenance | null {
  const value = getMetadata('last_detector_provenance');
  if (value === 'ast' || value === 'structured' || value === 'regex' || value === 'heuristic') {
    return value;
  }
  return null;
}

export function setLastDetectorProvenance(provenance: DetectorProvenance): void {
  setMetadata('last_detector_provenance', provenance);
}

export function getLastDetectorProvenanceSummary(): DetectorProvenanceSummary | null {
  const result = getLastDetectorProvenanceSummaryWithDiagnostics();
  // Backward-compat: caller-visible API still returns null on
  // any non-resolved state; corrupt/invalid state is observable via the
  // *WithDiagnostics() companion below.
  return result.kind === 'resolved' ? result.value : null;
}

/**
 * Discriminated metadata read result so callers can distinguish
 * - 'absent': the row does not exist (first-write hasn't happened yet)
 * - 'resolved': the row exists, parsed cleanly, and matches the expected shape
 * - 'corrupt': the row exists but is not valid JSON (write-side bug or
 *   storage corruption)
 * - 'invalid-shape': the row parsed as JSON but does not match the expected
 *   shape (schema-version drift or write-side type bug)
 *
 * The original API (returns `null` on absent / corrupt / invalid-shape) is
 * preserved; new callers use these companions to react differently to corrupt
 * state vs absent state (e.g. quarantine the row instead of silently rebuilding).
 */
export type MetadataReadResult<T> =
  | { kind: 'absent' }
  | { kind: 'resolved'; value: T }
  | { kind: 'corrupt'; raw: string }
  | { kind: 'invalid-shape'; raw: string };

export function getLastDetectorProvenanceSummaryWithDiagnostics(): MetadataReadResult<DetectorProvenanceSummary> {
  // Typed read: distinguish absent vs corrupt vs invalid.
  const value = getMetadata('last_detector_provenance_summary');
  if (!value) {
    return { kind: 'absent' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { kind: 'corrupt', raw: value };
  }
  // Shape guard: must be an object with `dominant` and `counts` properties.
  if (
    typeof parsed !== 'object'
    || parsed === null
    || !('dominant' in parsed)
    || !('counts' in parsed)
  ) {
    return { kind: 'invalid-shape', raw: value };
  }
  return { kind: 'resolved', value: parsed as DetectorProvenanceSummary };
}

export function setLastDetectorProvenanceSummary(summary: DetectorProvenanceSummary): void {
  setMetadata('last_detector_provenance_summary', JSON.stringify(summary));
}

export function getLastGraphEdgeEnrichmentSummary(): GraphEdgeEnrichmentSummary | null {
  const result = getLastGraphEdgeEnrichmentSummaryWithDiagnostics();
  // Backward-compat null on any non-resolved state.
  return result.kind === 'resolved' ? result.value : null;
}

export function getLastGraphEdgeEnrichmentSummaryWithDiagnostics(): MetadataReadResult<GraphEdgeEnrichmentSummary> {
  // Typed read: distinguish absent vs corrupt vs invalid.
  const value = getMetadata('last_graph_edge_enrichment_summary');
  if (!value) {
    return { kind: 'absent' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { kind: 'corrupt', raw: value };
  }
  // Shape guard: must have `edgeEvidenceClass` and `numericConfidence`.
  if (
    typeof parsed !== 'object'
    || parsed === null
    || !('edgeEvidenceClass' in parsed)
    || !('numericConfidence' in parsed)
  ) {
    return { kind: 'invalid-shape', raw: value };
  }
  return { kind: 'resolved', value: parsed as GraphEdgeEnrichmentSummary };
}

export function setLastGraphEdgeEnrichmentSummary(
  summary: GraphEdgeEnrichmentSummary,
): void {
  setMetadata('last_graph_edge_enrichment_summary', JSON.stringify(summary));
}

export function clearLastGraphEdgeEnrichmentSummary(): void {
  clearMetadata('last_graph_edge_enrichment_summary');
}

function isFailedScanRecord(value: unknown): value is FailedScanRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.reason === 'string'
    && typeof record.totalFiles === 'number'
    && typeof record.totalNodes === 'number'
    && typeof record.parseErrorCount === 'number'
    && typeof record.parseErrorRatio === 'number'
    && typeof record.recordedAt === 'string';
}

export function recordFailedScan(
  record: Omit<FailedScanRecord, 'recordedAt'>,
): FailedScanRecord {
  const failedScan: FailedScanRecord = {
    ...record,
    recordedAt: new Date().toISOString(),
  };
  setMetadata('last_failed_scan', JSON.stringify(failedScan));
  return failedScan;
}

export function getLastFailedScan(): FailedScanRecord | null {
  const raw = getMetadata('last_failed_scan');
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isFailedScanRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getLastGoldVerification(): object | null {
  const result = getLastGoldVerificationWithDiagnostics();
  // Backward-compat null on any non-resolved state.
  return result.kind === 'resolved' ? result.value : null;
}

export function getLastGoldVerificationWithDiagnostics(): MetadataReadResult<object> {
  // Typed read: distinguish absent vs corrupt vs invalid.
  const value = getCodeGraphMetadata('last_gold_verification');
  if (!value) {
    return { kind: 'absent' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return { kind: 'corrupt', raw: value };
  }
  // Shape guard: gold verification must be an object (it's a free-form
  // record but never a primitive). The detailed shape check stays at the
  // call sites that already use isRecord() etc.
  if (typeof parsed !== 'object' || parsed === null) {
    return { kind: 'invalid-shape', raw: value };
  }
  return { kind: 'resolved', value: parsed as object };
}

export function setLastGoldVerification(json: object): void {
  setCodeGraphMetadata('last_gold_verification', JSON.stringify(json));
}

export function getGraphQualitySummary(): {
  detectorProvenanceSummary: DetectorProvenanceSummary | null;
  graphEdgeEnrichmentSummary: GraphEdgeEnrichmentSummary | null;
} {
  return {
    detectorProvenanceSummary: getLastDetectorProvenanceSummary(),
    graphEdgeEnrichmentSummary: getLastGraphEdgeEnrichmentSummary(),
  };
}

/**
 * Insert or update a file record, returning the file ID.
 *
 * `options.fileMtimeMs` lets callers stage a placeholder mtime (e.g. `0`)
 * during multi-step structural persistence so `isFileStale()` continues
 * flagging the file as stale until nodes + edges have landed.
 * When omitted, the current on-disk mtime is used (original behavior).
 */
export function upsertFile(
  filePath: string,
  language: string,
  contentHash: string,
  nodeCount: number,
  edgeCount: number,
  parseHealth: string,
  parseDurationMs: number,
  options?: { fileMtimeMs?: number },
): number {
  const d = getDb();
  const now = new Date().toISOString();
  const fileMtimeMs = options?.fileMtimeMs !== undefined
    ? options.fileMtimeMs
    : (getCurrentFileMtimeMs(filePath) ?? 0);

  const existing = d.prepare('SELECT id FROM code_files WHERE file_path = ?').get(filePath) as { id: number } | undefined;
  if (existing) {
    d.prepare(`
      UPDATE code_files SET language = ?, content_hash = ?, node_count = ?, edge_count = ?,
        file_mtime_ms = ?, parse_health = ?, indexed_at = ?, parse_duration_ms = ?
      WHERE id = ?
    `).run(language, contentHash, nodeCount, edgeCount, fileMtimeMs, parseHealth, now, parseDurationMs, existing.id);
    return existing.id;
  }

  const result = d.prepare(`
    INSERT INTO code_files (
      file_path, language, content_hash, file_mtime_ms, node_count, edge_count, parse_health, indexed_at, parse_duration_ms
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(filePath, language, contentHash, fileMtimeMs, nodeCount, edgeCount, parseHealth, now, parseDurationMs);
  return Number(result.lastInsertRowid);
}

export function recordParseDiagnostic(filePath: string, errorMessage: string): ParseDiagnostic {
  const d = getDb();
  const now = new Date().toISOString();
  const message = errorMessage.length > 0
    ? errorMessage
    : 'Parser returned parseHealth="error" without diagnostics';
  d.prepare(`
    INSERT INTO parse_diagnostics (file_path, error_message, error_count, last_seen_at)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(file_path) DO UPDATE SET
      error_message = excluded.error_message,
      error_count = parse_diagnostics.error_count + 1,
      last_seen_at = excluded.last_seen_at
  `).run(filePath, message, now);

  const row = d.prepare(`
    SELECT file_path, error_message, error_count, last_seen_at
    FROM parse_diagnostics
    WHERE file_path = ?
  `).get(filePath) as {
    file_path: string;
    error_message: string;
    error_count: number;
    last_seen_at: string;
  };

  return {
    filePath: row.file_path,
    errorMessage: row.error_message,
    errorCount: row.error_count,
    lastSeenAt: row.last_seen_at,
  };
}

export function clearParseDiagnostic(filePath: string): void {
  const d = getDb();
  d.prepare('DELETE FROM parse_diagnostics WHERE file_path = ?').run(filePath);
}

export function getParseDiagnosticsSummary(limit: number = 5): ParseDiagnosticsSummary {
  const d = getDb();
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.trunc(limit), 20)) : 5;
  const affected = d.prepare('SELECT COUNT(*) AS count FROM parse_diagnostics').get() as { count: number };
  const rows = d.prepare(`
    SELECT file_path, error_message, error_count, last_seen_at
    FROM parse_diagnostics
    ORDER BY last_seen_at DESC, file_path ASC
    LIMIT ?
  `).all(safeLimit) as Array<{
    file_path: string;
    error_message: string;
    error_count: number;
    last_seen_at: string;
  }>;

  return {
    affectedFiles: affected.count,
    recentErrors: rows.map((row) => ({
      filePath: row.file_path,
      errorMessage: row.error_message,
      errorCount: row.error_count,
      lastSeenAt: row.last_seen_at,
    })),
  };
}

export function countStaleButValidParseDiagnostics(): number {
  const d = getDb();
  const row = d.prepare(`
    SELECT COUNT(*) AS count
    FROM parse_diagnostics diagnostic
    INNER JOIN code_files file ON file.file_path = diagnostic.file_path
  `).get() as { count: number };
  return row.count;
}

/** Batch insert nodes for a file (deletes existing first) */
export function replaceNodes(fileId: number, nodes: CodeNode[]): void {
  const d = getDb();
  const bitemporal = codeGraphEdgeBitemporalReadsEnabled();
  const insert = d.prepare(`
    INSERT OR IGNORE INTO code_nodes (symbol_id, file_id, file_path, fq_name, kind, name,
      start_line, end_line, start_column, end_column, language, signature, docstring, content_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = d.transaction(() => {
    const deletedAt = new Date().toISOString();
    const oldSymbolRows = d.prepare('SELECT symbol_id FROM code_nodes WHERE file_id = ?').all(fileId) as { symbol_id: string }[];
    const oldSymbolIds = oldSymbolRows.map(row => row.symbol_id);
    const newSymbolIds = new Set(nodes.map((node) => node.symbolId));
    const removedSymbolIds = oldSymbolIds.filter((symbolId) => !newSymbolIds.has(symbolId));
    const supersedesCandidates = collectSupersedesCandidates(d, nodes);

    recordNodeTombstones(d, fileId, 'replace_nodes_reindex', deletedAt);
    recordReplaceNodeEdgeTombstones(d, oldSymbolIds, removedSymbolIds, 'replace_nodes_reindex', deletedAt);
    d.prepare('DELETE FROM code_nodes WHERE file_id = ?').run(fileId);

    if (oldSymbolIds.length > 0) {
      const sourcePlaceholders = oldSymbolIds.map(() => '?').join(',');
      if (bitemporal) {
        // Node replacement runs before edge replacement on the per-file persist
        // path, so it owns the old symbol ids and is where a stale edge actually
        // gets superseded on a real reindex. Under bitemporal reads it must close
        // these edges, not delete them, or the prior generation is destroyed
        // before the close path downstream can record it. Only live edges
        // (invalid_at IS NULL) are closed, stamped at the generation this scan
        // will produce.
        const closeGeneration = getNextCodeGraphGeneration();
        if (removedSymbolIds.length > 0) {
          const removedTargetPlaceholders = removedSymbolIds.map(() => '?').join(',');
          d.prepare(`
            UPDATE code_edges SET invalid_at = ?
            WHERE invalid_at IS NULL AND (
              source_id IN (${sourcePlaceholders})
              OR target_id IN (${removedTargetPlaceholders})
            )
          `).run(closeGeneration, ...oldSymbolIds, ...removedSymbolIds);
        } else {
          d.prepare(`
            UPDATE code_edges SET invalid_at = ?
            WHERE invalid_at IS NULL AND source_id IN (${sourcePlaceholders})
          `).run(closeGeneration, ...oldSymbolIds);
        }
      } else if (removedSymbolIds.length > 0) {
        const removedTargetPlaceholders = removedSymbolIds.map(() => '?').join(',');
        d.prepare(`
          DELETE FROM code_edges
          WHERE source_id IN (${sourcePlaceholders})
            OR target_id IN (${removedTargetPlaceholders})
        `).run(...oldSymbolIds, ...removedSymbolIds);
      } else {
        d.prepare(`
          DELETE FROM code_edges
          WHERE source_id IN (${sourcePlaceholders})
        `).run(...oldSymbolIds);
      }
    }

    for (const n of nodes) {
      insert.run(
        n.symbolId, fileId, n.filePath, n.fqName, n.kind, n.name,
        n.startLine, n.endLine, n.startColumn, n.endColumn,
        n.language, n.signature ?? null, n.docstring ?? null, n.contentHash,
      );
    }
    recordSupersedesLineage(d, supersedesCandidates, deletedAt);
  });
  tx();
}

export interface ReplaceEdgesOptions {
  /**
   * When true, skip the inline dangling-target prune. During a full
   * scan, files are persisted one at a time; a cross-file IMPORTS edge whose
   * target lives in a not-yet-persisted file would otherwise be deleted here
   * (its `target_id` is not yet in `code_nodes`) and is never restored, because
   * the post-persist resolver only reconciles CALLS edges. Callers that persist
   * many files in sequence pass `true` and run `pruneDanglingEdges()` ONCE after
   * all nodes + cross-file resolution land. Selective/single-file callers leave
   * it false so genuinely-dangling edges are cleaned inline.
   */
  deferDanglingTargetPrune?: boolean;
}

/** Batch insert edges (deletes edges from the source nodes first) */
export function replaceEdges(sourceIds: string[], edges: CodeEdge[], opts: ReplaceEdgesOptions = {}): void {
  const d = getDb();

  // When bitemporal reads are on, a reindex must preserve the superseded edges
  // instead of deleting them, so an as-of query can still answer about a past
  // generation. The supersede path closes live edges with invalid_at and writes
  // the replacements with valid_at open, leaving the prior generation readable.
  // When the flag is off, the default delete-and-insert path below runs as
  // before with no validity columns touched.
  const bitemporal = codeGraphEdgeBitemporalReadsEnabled();

  const insert = d.prepare(`
    INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tx = d.transaction(() => {
    const deletedAt = new Date().toISOString();
    if (sourceIds.length > 0) {
      const placeholders = sourceIds.map(() => '?').join(',');
      recordEdgeTombstonesForSources(d, sourceIds, 'replace_edges_reindex', deletedAt);
      if (bitemporal) {
        closeEdgesForSources(sourceIds);
      } else {
        d.prepare(`DELETE FROM code_edges WHERE source_id IN (${placeholders})`).run(...sourceIds);
      }
    }

    const candidateSourceIds = [...new Set(edges.map((edge) => edge.sourceId))];
    const retainedSourceIds = new Set<string>();
    if (candidateSourceIds.length > 0) {
      const placeholders = candidateSourceIds.map(() => '?').join(',');
      const rows = d.prepare(`
        SELECT symbol_id
        FROM code_nodes
        WHERE symbol_id IN (${placeholders})
      `).all(...candidateSourceIds) as Array<{ symbol_id: string }>;
      for (const row of rows) {
        retainedSourceIds.add(row.symbol_id);
      }
    }

    for (const e of edges) {
      if (!retainedSourceIds.has(e.sourceId)) {
        continue;
      }
      if (bitemporal) {
        insertEdgeWithValidity(e);
      } else {
        insert.run(e.sourceId, e.targetId, e.edgeType, e.weight, e.metadata ? JSON.stringify(e.metadata) : null);
      }
    }

    if (!opts.deferDanglingTargetPrune) {
      recordDanglingEdgeTombstones(d, 'replace_edges_dangling_prune', deletedAt);
      if (bitemporal) {
        // Close dangling edges instead of deleting them so the prior generation
        // stays readable. This inline prune runs during the persist loop, before
        // the generation bump, so it stamps at the generation this scan will
        // produce, matching the close path above. Only live edges (invalid_at IS
        // NULL) are closed, so an already-closed edge keeps its original stamp.
        const asOfGeneration = getNextCodeGraphGeneration();
        d.prepare(`
          UPDATE code_edges SET invalid_at = ? WHERE invalid_at IS NULL AND (
            (edge_type != 'SUPERSEDES' AND (
              source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
              target_id NOT IN (SELECT symbol_id FROM code_nodes)
            ))
            OR (edge_type = 'SUPERSEDES' AND target_id NOT IN (SELECT symbol_id FROM code_nodes))
          )
        `).run(asOfGeneration);
      } else {
        d.prepare(`
          DELETE FROM code_edges WHERE
            (edge_type != 'SUPERSEDES' AND (
              source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
              target_id NOT IN (SELECT symbol_id FROM code_nodes)
            ))
            OR (edge_type = 'SUPERSEDES' AND target_id NOT IN (SELECT symbol_id FROM code_nodes))
        `).run();
      }
    }
  });
  tx();
}

/**
 * Remove edges whose source or target symbol no longer exists in
 * `code_nodes`. Run ONCE after a multi-file scan (all nodes persisted +
 * cross-file resolution complete) when per-file `replaceEdges` deferred its
 * inline prune. Returns the number of edges removed (or closed under the flag).
 *
 * This is the production dangling sweep for a full scan: the per-file persist
 * defers its inline prune, so an unconditional delete here would erase the
 * superseded edges the bitemporal path just closed. Under the flag it closes the
 * danglers instead. It runs after the generation bump has already landed for the
 * scan, so it stamps at the current generation rather than the next one.
 */
export function pruneDanglingEdges(): number {
  const d = getDb();
  recordDanglingEdgeTombstones(d, 'dangling_edge_prune', new Date().toISOString());
  if (codeGraphEdgeBitemporalReadsEnabled()) {
    const result = d.prepare(`
      UPDATE code_edges SET invalid_at = ? WHERE invalid_at IS NULL AND (
        (edge_type != 'SUPERSEDES' AND (
          source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
          target_id NOT IN (SELECT symbol_id FROM code_nodes)
        ))
        OR (edge_type = 'SUPERSEDES' AND target_id NOT IN (SELECT symbol_id FROM code_nodes))
      )
    `).run(getCodeGraphGeneration());
    return result.changes;
  }
  const result = d.prepare(`
    DELETE FROM code_edges WHERE
      (edge_type != 'SUPERSEDES' AND (
        source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
        target_id NOT IN (SELECT symbol_id FROM code_nodes)
      ))
      OR (edge_type = 'SUPERSEDES' AND target_id NOT IN (SELECT symbol_id FROM code_nodes))
  `).run();
  return result.changes;
}

/** Check if a file needs re-indexing based on stored mtime and content hash */
export function isFileStale(filePath: string, options?: { currentContentHash?: string }): boolean {
  const d = getDb();
  const row = d.prepare('SELECT file_mtime_ms, content_hash FROM code_files WHERE file_path = ?').get(filePath) as {
    file_mtime_ms: number;
    content_hash: string | null;
  } | undefined;
  if (!row) return true;
  const currentMtimeMs = getCurrentFileMtimeMs(filePath);
  if (currentMtimeMs === null) return true;
  if (!row.content_hash) return true;

  // Hash content on mtime drift before declaring stale. A touch
  // (mtime drift, content unchanged) used to force reindex; now it stays
  // fresh as long as the content hash matches. Avoids gratuitous full-scans
  // on `git checkout` of unchanged files.
  const currentContentHash = options?.currentContentHash ?? getCurrentFileContentHash(filePath);
  if (currentContentHash === null) return true;
  return row.content_hash !== currentContentHash;
}

/** Batch stale check for a set of file paths */
export interface FreshFilesResult {
  readonly stale: string[];
  readonly fresh: string[];
}

export function ensureFreshFiles(filePaths: string[]): FreshFilesResult {
  const uniquePaths = [...new Set(filePaths)];
  if (uniquePaths.length === 0) {
    return { stale: [], fresh: [] };
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT file_path, file_mtime_ms, content_hash
    FROM code_files
    WHERE file_path IN (${placeholders})
  `).all(...uniquePaths) as Array<{ file_path: string; file_mtime_ms: number; content_hash: string | null }>;
  const storedFiles = new Map(rows.map((row) => [row.file_path, row]));

  const stale: string[] = [];
  const fresh: string[] = [];

  for (const filePath of uniquePaths) {
    const storedFile = storedFiles.get(filePath);
    const currentMtimeMs = getCurrentFileMtimeMs(filePath);
    if (storedFile === undefined || currentMtimeMs === null) {
      stale.push(filePath);
      continue;
    }
    if (!storedFile.content_hash) {
      stale.push(filePath);
      continue;
    }
    // Hash on mtime drift before declaring stale. Touch-only
    // changes (mtime drift, content unchanged) stay fresh; only real content
    // changes flip the file to stale.
    const currentContentHash = getCurrentFileContentHash(filePath);
    if (currentContentHash === null || storedFile.content_hash !== currentContentHash) {
      stale.push(filePath);
      continue;
    }
    fresh.push(filePath);
  }

  return { stale, fresh };
}

/** Get all tracked file paths from the graph database */
export function getTrackedFiles(): string[] {
  const d = getDb();
  const rows = d.prepare('SELECT file_path FROM code_files').all() as Array<{ file_path: string }>;
  return rows.map((row) => row.file_path);
}

export function countTrackedSkillFiles(): number {
  const d = getDb();
  const skillLikePatterns = CODE_GRAPH_SKILL_EXCLUDE_GLOBS.map((glob) => {
    const pathSegment = glob.replace(/^\*\*\//, '').replace(/\/\*\*$/, '');
    return `%${pathSegment}/%`;
  });
  if (skillLikePatterns.length === 0) {
    return 0;
  }
  const whereClause = skillLikePatterns.map(() => 'file_path LIKE ?').join(' OR ');
  const row = d.prepare(`
    SELECT COUNT(*) AS count
    FROM code_files
    WHERE ${whereClause}
  `).get(...skillLikePatterns) as { count: number } | undefined;
  return row?.count ?? 0;
}

/** Remove a file and its nodes/edges from the graph */
export function removeFile(filePath: string, options: DeleteAuditOptions = {}): void {
  const d = getDb();
  const file = d.prepare('SELECT id FROM code_files WHERE file_path = ?').get(filePath) as { id: number } | undefined;
  if (!file) return;
  // Wrap the edge-delete + file-delete (CASCADE drops nodes) in a single
  // transaction so a crash mid-call cannot leave orphaned edges / partial graph state.
  const tx = d.transaction(() => {
    const deletedAt = new Date().toISOString();
    const reason = options.reason ?? 'tracked_file_removed';
    const nodeIds = d.prepare('SELECT symbol_id FROM code_nodes WHERE file_id = ?').all(file.id) as { symbol_id: string }[];
    if (nodeIds.length > 0) {
      const placeholders = nodeIds.map(() => '?').join(',');
      const ids = nodeIds.map(n => n.symbol_id);
      recordNodeTombstones(d, file.id, reason, deletedAt);
      recordEdgeTombstonesForSymbols(d, ids, reason, deletedAt);
      d.prepare(`DELETE FROM code_edges WHERE source_id IN (${placeholders}) OR target_id IN (${placeholders})`).run(...ids, ...ids);
    }
    recordFileTombstone(d, filePath, reason, deletedAt);
    d.prepare('DELETE FROM code_files WHERE id = ?').run(file.id);
  });
  tx();
}

/** Query: get file outline (nodes sorted by line) */
export function queryOutline(filePath: string): CodeNode[] {
  const d = getDb();
  const rows = d.prepare(`
    SELECT * FROM code_nodes WHERE file_path = ? ORDER BY start_line
  `).all(filePath) as Record<string, unknown>[];

  return rows.map(rowToNode);
}

/** Query: startup-friendly highlights — most-called project symbols (incoming calls). */
export function queryStartupHighlights(limit: number = 5): StartupHighlight[] {
  const d = getDb();
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.trunc(limit), 20)) : 5;
  const rows = d.prepare(`
    WITH filtered_nodes AS (
      SELECT n.symbol_id, n.name, n.kind, n.file_path, n.start_line
      FROM code_nodes n
      WHERE n.kind IN ('class', 'function', 'method', 'interface', 'type_alias', 'module')
        AND n.file_path NOT LIKE '%/site-packages/%'
        AND n.file_path NOT LIKE '%/node_modules/%'
        AND n.file_path NOT LIKE '%/.venv/%'
        AND n.file_path NOT LIKE '%/vendor/%'
        AND n.file_path NOT LIKE '%/dist/%'
        AND n.file_path NOT LIKE '%/build/%'
        AND n.file_path NOT LIKE '%/__pycache__/%'
        AND n.file_path NOT LIKE '%/tests/%'
        AND n.file_path NOT LIKE '%/test_%'
        AND n.file_path NOT LIKE '%__tests__%'
    ),
    aggregated AS (
      SELECT
        fn.name as name,
        fn.kind as kind,
        fn.file_path as file_path,
        MIN(fn.start_line) as start_line,
        COALESCE(SUM(CASE WHEN UPPER(e.edge_type) = 'CALLS' THEN 1 ELSE 0 END), 0) as call_count
      FROM filtered_nodes fn
      LEFT JOIN code_edges e
        ON e.target_id = fn.symbol_id
      GROUP BY fn.name, fn.kind, fn.file_path
    ),
    ranked AS (
      SELECT
        name,
        kind,
        file_path,
        call_count,
        start_line,
        ROW_NUMBER() OVER (
          PARTITION BY file_path
          ORDER BY call_count DESC, start_line ASC
        ) as file_rank
      FROM aggregated
    )
    SELECT
      name,
      kind,
      file_path,
      call_count
    FROM ranked
    WHERE file_rank <= 2
    ORDER BY call_count DESC, start_line ASC
    LIMIT ?
  `).all(safeLimit) as Array<{
    name: string;
    kind: string;
    file_path: string;
    call_count: number;
  }>;

  return rows.map((row) => ({
    name: row.name,
    kind: row.kind,
    filePath: row.file_path,
    callCount: row.call_count,
  }));
}

export function querySymbolIndexRows(): SymbolIndexRow[] {
  const d = getDb();
  const rows = d.prepare(`
    SELECT symbol_id, fq_name, name, kind, file_path, start_line, signature, docstring
    FROM code_nodes
    ORDER BY file_path, start_line, symbol_id
  `).all() as Array<{
    symbol_id: string;
    fq_name: string | null;
    name: string | null;
    kind: string | null;
    file_path: string | null;
    start_line: number | null;
    signature: string | null;
    docstring: string | null;
  }>;

  return rows.map((row) => ({
    symbolId: row.symbol_id,
    fqName: row.fq_name,
    name: row.name,
    kind: row.kind,
    filePath: row.file_path,
    startLine: row.start_line,
    signature: row.signature,
    docstring: row.docstring,
  }));
}

/** Query: get edges from a symbol */
export interface CodeEdgeTargetResult {
  readonly edge: CodeEdge;
  readonly targetNode: CodeNode | null;
}

export function queryEdgesFrom(symbolId: string, edgeType?: string): CodeEdgeTargetResult[] {
  const d = getDb();
  let sql = 'SELECT * FROM code_edges WHERE source_id = ?';
  const params: unknown[] = [symbolId];
  // Under bitemporal reads a reindex closes superseded edges instead of deleting
  // them, so a live read must exclude the closed rows or it returns both the old
  // and the new target. The filter is added only when the flag is on, so the
  // default query string is unchanged.
  if (codeGraphEdgeBitemporalReadsEnabled()) {
    sql += ' AND invalid_at IS NULL';
  }
  if (edgeType) {
    sql += ' AND edge_type = ?';
    params.push(edgeType);
  }

  const edges = d.prepare(sql).all(...params) as Record<string, unknown>[];
  return edges.map(e => {
    const edge = rowToEdge(e);
    const targetRow = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ?').get(edge.targetId) as Record<string, unknown> | undefined;
    return { edge, targetNode: targetRow ? rowToNode(targetRow) : null };
  });
}

/** Query: get edges to a symbol */
export interface CodeEdgeSourceResult {
  readonly edge: CodeEdge;
  readonly sourceNode: CodeNode | null;
}

export function queryEdgesTo(symbolId: string, edgeType?: string): CodeEdgeSourceResult[] {
  const d = getDb();
  let sql = 'SELECT * FROM code_edges WHERE target_id = ?';
  const params: unknown[] = [symbolId];
  // Same live-read filter as queryEdgesFrom: a closed edge stays in the table
  // under bitemporal reads, so the inbound read must drop it. Added only when the
  // flag is on, leaving the default query string unchanged.
  if (codeGraphEdgeBitemporalReadsEnabled()) {
    sql += ' AND invalid_at IS NULL';
  }
  if (edgeType) {
    sql += ' AND edge_type = ?';
    params.push(edgeType);
  }

  const edges = d.prepare(sql).all(...params) as Record<string, unknown>[];
  return edges.map(e => {
    const edge = rowToEdge(e);
    const sourceRow = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ?').get(edge.sourceId) as Record<string, unknown> | undefined;
    return { edge, sourceNode: sourceRow ? rowToNode(sourceRow) : null };
  });
}

// ───────────────────────────────────────────────────────────────
// Bi-temporal edge lifecycle, gated behind the bitemporal-reads flag.
//
// Default writes replace edges with a hard delete, so a superseded edge leaves
// no record of when it stopped being valid and the validity columns can only
// ever carry an open valid_at. These two functions are the smallest consumer
// that makes the columns load-bearing: a close-and-insert writer that stamps
// invalid_at on a superseded edge instead of deleting it, and an as-of reader
// that answers about an edge at a past generation. Both no-op or fall back to
// the live-only path when the flag is off, so default behavior is unchanged.
// ───────────────────────────────────────────────────────────────

export interface CloseEdgesForSourcesResult {
  readonly closedEdges: number;
  readonly asOfGeneration: number;
}

/**
 * Close every live edge from the given source symbols by stamping invalid_at
 * with the generation this scan will produce, rather than deleting it. A live
 * edge is one whose invalid_at is still NULL. Stamping at the next generation
 * keeps the close strictly after the valid_at of an edge inserted in an earlier
 * scan, so the prior target stays readable at the generation a consumer names
 * for the pre-reindex state. Returns the count closed and the generation
 * stamped. When the bitemporal-reads flag is off this is a no-op, so the default
 * replace path keeps deleting edges and nothing here runs.
 */
export function closeEdgesForSources(sourceIds: string[]): CloseEdgesForSourcesResult {
  if (!codeGraphEdgeBitemporalReadsEnabled()) {
    return { closedEdges: 0, asOfGeneration: getCodeGraphGeneration() };
  }
  const asOfGeneration = getNextCodeGraphGeneration();
  const uniqueSourceIds = [...new Set(sourceIds.filter((id) => typeof id === 'string' && id.length > 0))];
  if (uniqueSourceIds.length === 0) {
    return { closedEdges: 0, asOfGeneration };
  }
  const d = getDb();
  const placeholders = uniqueSourceIds.map(() => '?').join(',');
  const result = d.prepare(`
    UPDATE code_edges
    SET invalid_at = ?
    WHERE source_id IN (${placeholders})
      AND invalid_at IS NULL
  `).run(asOfGeneration, ...uniqueSourceIds);
  return { closedEdges: result.changes, asOfGeneration };
}

/**
 * Insert an edge with valid_at stamped to the generation this scan will produce
 * and invalid_at left open, so a later close-and-insert can record its lifetime.
 * Stamping at the next generation matches the close path, so an edge inserted in
 * one scan and superseded in the next carries a non-empty lifetime window. When
 * the flag is off this falls back to a plain insert with NULL validity columns,
 * byte-identical to the default edge write.
 */
export function insertEdgeWithValidity(edge: CodeEdge): void {
  const d = getDb();
  if (!codeGraphEdgeBitemporalReadsEnabled()) {
    d.prepare(`
      INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).run(edge.sourceId, edge.targetId, edge.edgeType, edge.weight, edge.metadata ? JSON.stringify(edge.metadata) : null);
    return;
  }
  const validAt = getNextCodeGraphGeneration();
  d.prepare(`
    INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata, valid_at, invalid_at)
    VALUES (?, ?, ?, ?, ?, ?, NULL)
  `).run(edge.sourceId, edge.targetId, edge.edgeType, edge.weight, edge.metadata ? JSON.stringify(edge.metadata) : null, validAt);
}

/**
 * Read edges from a symbol as of a past generation. An edge counts as live at
 * asOf when it was valid by then and had not yet been closed, that is
 * valid_at <= asOf AND (invalid_at IS NULL OR invalid_at > asOf). When the
 * flag is off this falls back to the live-only queryEdgesFrom, so no consumer
 * sees a temporal read until the flag is set.
 */
export function asOfEdgesFrom(symbolId: string, asOf: number, edgeType?: string): CodeEdgeTargetResult[] {
  if (!codeGraphEdgeBitemporalReadsEnabled()) {
    return queryEdgesFrom(symbolId, edgeType);
  }
  const d = getDb();
  let sql = `
    SELECT * FROM code_edges
    WHERE source_id = ?
      AND valid_at IS NOT NULL
      AND valid_at <= ?
      AND (invalid_at IS NULL OR invalid_at > ?)
  `;
  const params: unknown[] = [symbolId, asOf, asOf];
  if (edgeType) {
    sql += ' AND edge_type = ?';
    params.push(edgeType);
  }
  const edges = d.prepare(sql).all(...params) as Record<string, unknown>[];
  return edges.map((e) => {
    const edge = rowToEdge(e);
    const targetRow = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ?').get(edge.targetId) as Record<string, unknown> | undefined;
    return { edge, targetNode: targetRow ? rowToNode(targetRow) : null };
  });
}

/**
 * Inbound mirror of asOfEdgesFrom: read edges to a symbol as of a past
 * generation. Same validity window, indexed by target_id. When the flag is off
 * this falls back to the live-only queryEdgesTo, so the inbound as-of path stays
 * a no-op until the flag is set.
 */
export function asOfEdgesTo(symbolId: string, asOf: number, edgeType?: string): CodeEdgeSourceResult[] {
  if (!codeGraphEdgeBitemporalReadsEnabled()) {
    return queryEdgesTo(symbolId, edgeType);
  }
  const d = getDb();
  let sql = `
    SELECT * FROM code_edges
    WHERE target_id = ?
      AND valid_at IS NOT NULL
      AND valid_at <= ?
      AND (invalid_at IS NULL OR invalid_at > ?)
  `;
  const params: unknown[] = [symbolId, asOf, asOf];
  if (edgeType) {
    sql += ' AND edge_type = ?';
    params.push(edgeType);
  }
  const edges = d.prepare(sql).all(...params) as Record<string, unknown>[];
  return edges.map((e) => {
    const edge = rowToEdge(e);
    const sourceRow = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ?').get(edge.sourceId) as Record<string, unknown> | undefined;
    return { edge, sourceNode: sourceRow ? rowToNode(sourceRow) : null };
  });
}

export function resolveSubjectFilePath(subject: string): string | null {
  const d = getDb();

  const candidates = [subject];
  if (!isAbsolute(subject)) {
    candidates.push(resolvePath(process.cwd(), subject));
  }

  for (const candidate of candidates) {
    const directFile = d.prepare('SELECT file_path FROM code_files WHERE file_path = ? LIMIT 1').get(candidate) as { file_path: string } | undefined;
    if (directFile) return directFile.file_path;
  }

  const byId = d.prepare('SELECT file_path FROM code_nodes WHERE symbol_id = ? LIMIT 1').get(subject) as { file_path: string } | undefined;
  if (byId) return byId.file_path;

  const byFq = d.prepare('SELECT file_path FROM code_nodes WHERE fq_name = ? LIMIT 1').get(subject) as { file_path: string } | undefined;
  if (byFq) return byFq.file_path;

  const byName = d.prepare('SELECT file_path FROM code_nodes WHERE name = ? LIMIT 1').get(subject) as { file_path: string } | undefined;
  if (byName) return byName.file_path;

  const escapedSubject = subject.replace(/[%_]/g, '\\$&');
  const like = d.prepare('SELECT file_path FROM code_files WHERE file_path LIKE ? LIMIT 1').get(`%${escapedSubject}`) as { file_path: string } | undefined;
  if (like) return like.file_path;

  return null;
}

export function queryFileImportDependents(): FileImportDependent[] {
  const d = getDb();
  const rows = d.prepare(`
    SELECT DISTINCT
      target.file_path AS imported_file_path,
      source.file_path AS importer_file_path
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE UPPER(edge.edge_type) = 'IMPORTS'
      AND source.file_path != target.file_path
  `).all() as Array<{
    imported_file_path: string;
    importer_file_path: string;
  }>;

  return rows.map((row) => ({
    importedFilePath: row.imported_file_path,
    importerFilePath: row.importer_file_path,
  }));
}

export function queryImportersOf(importedFilePaths: string[]): FileImportDependent[] {
  const uniquePaths = [...new Set(importedFilePaths.filter((filePath) => typeof filePath === 'string' && filePath.length > 0))];
  if (uniquePaths.length === 0) {
    return [];
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT DISTINCT
      target.file_path AS imported_file_path,
      source.file_path AS importer_file_path
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE UPPER(edge.edge_type) = 'IMPORTS'
      AND target.file_path IN (${placeholders})
      AND source.file_path != target.file_path
      AND target.kind != 'module'
    ORDER BY imported_file_path, importer_file_path
  `).all(...uniquePaths) as Array<{
    imported_file_path: string;
    importer_file_path: string;
  }>;

  return rows.map((row) => ({
    importedFilePath: row.imported_file_path,
    importerFilePath: row.importer_file_path,
  }));
}

export function querySymbolIdsForFiles(filePaths: string[]): FileSymbolId[] {
  const uniquePaths = [...new Set(filePaths.filter((filePath) => typeof filePath === 'string' && filePath.length > 0))];
  if (uniquePaths.length === 0) {
    return [];
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT file_path, symbol_id
    FROM code_nodes
    WHERE file_path IN (${placeholders})
    ORDER BY file_path, symbol_id
  `).all(...uniquePaths) as Array<{ file_path: string; symbol_id: string }>;

  return rows.map((row) => ({
    filePath: row.file_path,
    symbolId: row.symbol_id,
  }));
}

export function queryFileDegrees(filePaths: string[]): FileDegree[] {
  const uniquePaths = [...new Set(filePaths.filter((filePath) => typeof filePath === 'string' && filePath.length > 0))];
  if (uniquePaths.length === 0) {
    return [];
  }

  const d = getDb();
  const placeholders = uniquePaths.map(() => '?').join(',');
  const rows = d.prepare(`
    SELECT
      node_file_path,
      COUNT(DISTINCT connected_file_path) AS degree
    FROM (
      SELECT
        source.file_path AS node_file_path,
        target.file_path AS connected_file_path
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
      WHERE source.file_path IN (${placeholders})
        AND source.file_path != target.file_path

      UNION ALL

      SELECT
        target.file_path AS node_file_path,
        source.file_path AS connected_file_path
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
      WHERE target.file_path IN (${placeholders})
        AND source.file_path != target.file_path
    )
    GROUP BY node_file_path
  `).all(...uniquePaths, ...uniquePaths) as Array<{
    node_file_path: string;
    degree: number;
  }>;

  const degreeByFile = new Map(rows.map((row) => [row.node_file_path, row.degree]));
  return uniquePaths.map((filePath) => ({
    filePath,
    degree: degreeByFile.get(filePath) ?? 0,
  }));
}

/** Get graph statistics */
export function getStats(): {
  totalFiles: number; totalNodes: number; totalEdges: number;
  nodesByKind: Record<string, number>; edgesByType: Record<string, number>;
  parseHealthSummary: Record<string, number>;
  tombstones: CodeGraphTombstoneSummary;
  lastScanTimestamp: string | null;
  lastGitHead: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
  graphQualitySummary: {
    detectorProvenanceSummary: DetectorProvenanceSummary | null;
    graphEdgeEnrichmentSummary: GraphEdgeEnrichmentSummary | null;
  };
} {
  const d = getDb();
  const totalFiles = (d.prepare('SELECT COUNT(*) as c FROM code_files').get() as { c: number }).c;
  const totalNodes = (d.prepare('SELECT COUNT(*) as c FROM code_nodes').get() as { c: number }).c;
  const totalEdges = (d.prepare('SELECT COUNT(*) as c FROM code_edges').get() as { c: number }).c;

  const nodesByKind: Record<string, number> = {};
  const kindRows = d.prepare('SELECT kind, COUNT(*) as c FROM code_nodes GROUP BY kind').all() as { kind: string; c: number }[];
  for (const r of kindRows) nodesByKind[r.kind] = r.c;

  const edgesByType: Record<string, number> = {};
  const typeRows = d.prepare('SELECT edge_type, COUNT(*) as c FROM code_edges GROUP BY edge_type').all() as { edge_type: string; c: number }[];
  for (const r of typeRows) edgesByType[r.edge_type] = r.c;

  const parseHealthSummary: Record<string, number> = {};
  const healthRows = d.prepare('SELECT parse_health, COUNT(*) as c FROM code_files GROUP BY parse_health').all() as { parse_health: string; c: number }[];
  for (const r of healthRows) parseHealthSummary[r.parse_health] = r.c;

  // Last scan timestamp
  const lastScan = d.prepare('SELECT MAX(indexed_at) as last FROM code_files').get() as { last: string | null } | undefined;
  const lastScanTimestamp = lastScan?.last ?? null;
  const lastGitHead = getLastGitHead();
  const graphQualitySummary = getGraphQualitySummary();
  const tombstones = getTombstoneSummary();

  // DB file size
  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
  }

  return {
    totalFiles, totalNodes, totalEdges, nodesByKind, edgesByType, parseHealthSummary,
    tombstones, lastScanTimestamp, lastGitHead, dbFileSize, schemaVersion: SCHEMA_VERSION, graphQualitySummary,
  };
}

export function getTombstoneSummary(): CodeGraphTombstoneSummary {
  const enabled = codeGraphTombstonesEnabled();
  const retentionLimit = enabled ? getCodeGraphTombstoneLimit() : 0;
  const empty: CodeGraphTombstoneSummary = {
    enabled,
    retentionLimit,
    retainedRows: 0,
    byKind: {},
    byReason: {},
    recent: [],
  };

  const d = getDb();
  if (!enabled || !tombstoneTableExists(d)) {
    return empty;
  }

  const retained = d.prepare('SELECT COUNT(*) AS count FROM code_graph_tombstones').get() as { count: number };
  const kindRows = d.prepare(`
    SELECT entity_kind, COUNT(*) AS count
    FROM code_graph_tombstones
    GROUP BY entity_kind
  `).all() as Array<{ entity_kind: string; count: number }>;
  const reasonRows = d.prepare(`
    SELECT reason, COUNT(*) AS count
    FROM code_graph_tombstones
    GROUP BY reason
  `).all() as Array<{ reason: string; count: number }>;
  const recentRows = d.prepare(`
    SELECT id, entity_kind, entity_id, source_id, target_id, edge_type, file_path, reason, deleted_at
    FROM code_graph_tombstones
    ORDER BY deleted_at DESC, id DESC
    LIMIT 10
  `).all() as Array<Record<string, unknown>>;

  return {
    enabled,
    retentionLimit,
    retainedRows: retained.count,
    byKind: Object.fromEntries(kindRows.map((row) => [row.entity_kind, row.count])),
    byReason: Object.fromEntries(reasonRows.map((row) => [row.reason, row.count])),
    recent: recentRows.map(mapTombstoneRow),
  };
}

/** Remove orphaned nodes whose files no longer exist in code_files */
export function cleanupOrphans(): number {
  const d = getDb();
  // Wrap record + delete in one transaction so a crash mid-call cannot leave
  // orphan nodes gone while their now-dangling edges remain, and so a retry
  // cannot re-record the same tombstones — matching removeFile/replaceNodes.
  const tx = d.transaction(() => {
    const deletedAt = new Date().toISOString();
    // Edges already dangling before this sweep (source/target node missing).
    recordDanglingEdgeTombstones(d, 'cleanup_orphans', deletedAt);
    if (codeGraphTombstonesEnabled()) {
      ensureTombstoneSchema(d);
      // Edges that will become dangling as a side effect of deleting the
      // orphan nodes below. Recorded BEFORE the node DELETE so the
      // source/target endpoints still exist for the file_path join, matching
      // removeFile's ordering — recordDanglingEdgeTombstones alone misses
      // these because the orphan nodes are still present when it runs.
      const orphanSymbolRows = d.prepare(`
        SELECT symbol_id FROM code_nodes WHERE file_id NOT IN (SELECT id FROM code_files)
      `).all() as { symbol_id: string }[];
      recordEdgeTombstonesForSymbols(
        d,
        orphanSymbolRows.map((row) => row.symbol_id),
        'cleanup_orphans',
        deletedAt,
      );
      // Orphan node tombstones.
      d.prepare(`
        INSERT INTO code_graph_tombstones (entity_kind, entity_id, file_path, reason, deleted_at)
        SELECT 'node', symbol_id, file_path, 'cleanup_orphans', ?
        FROM code_nodes
        WHERE file_id NOT IN (SELECT id FROM code_files)
      `).run(deletedAt);
      pruneTombstones(d);
    }
    const orphanedNodes = d.prepare(`
      DELETE FROM code_nodes WHERE file_id NOT IN (SELECT id FROM code_files)
    `).run();

    // Sweep edges referencing non-existent nodes (now includes edges orphaned
    // by the node delete above, whose tombstones were recorded beforehand).
    const orphanedEdges = d.prepare(`
      DELETE FROM code_edges WHERE
        (edge_type != 'SUPERSEDES' AND (
          source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
          target_id NOT IN (SELECT symbol_id FROM code_nodes)
        ))
        OR (edge_type = 'SUPERSEDES' AND target_id NOT IN (SELECT symbol_id FROM code_nodes))
    `).run();

    return orphanedNodes.changes + orphanedEdges.changes;
  });
  return tx();
}

/** Convert DB row to CodeNode */
function rowToNode(r: Record<string, unknown>): CodeNode {
  return {
    symbolId: r.symbol_id as string,
    filePath: r.file_path as string,
    fqName: r.fq_name as string,
    kind: r.kind as CodeNode['kind'],
    name: r.name as string,
    startLine: r.start_line as number,
    endLine: r.end_line as number,
    startColumn: r.start_column as number ?? 0,
    endColumn: r.end_column as number ?? 0,
    language: r.language as CodeNode['language'],
    signature: r.signature as string | undefined,
    docstring: r.docstring as string | undefined,
    contentHash: r.content_hash as string,
  };
}

/**
 * Allowlist `reason` / `step` strings on the edge-metadata read path.
 * Stale or imported rows may contain values
 * that pre-date a sanitizer change, were written by a different
 * branch, or simply contain control characters/newlines that
 * would break downstream rendering. Strict allowlist keeps the
 * read path safe even if a write-path regression slips a bad
 * value into `code_edges.metadata`.
 *
 * Allowlist rules (single line, length-cap, non-control-char):
 *   - No control characters (0x00-0x1F, 0x7F)
 *   - No CR/LF (single line)
 *   - Length ≤ 200
 *   - Falls back to `null` on any violation
 *
 * The cap is intentionally generous (200 chars) since the values
 * are operator-supplied free-form attribution strings; we need
 * to preserve readability while rejecting injection-shaped input.
 */
const EDGE_METADATA_STRING_MAX_LENGTH = 200;
const EDGE_METADATA_STRING_BLOCKED = /[\x00-\x1F\x7F]/;

export function sanitizeEdgeMetadataString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length === 0) return null;
  if (value.length > EDGE_METADATA_STRING_MAX_LENGTH) return null;
  if (EDGE_METADATA_STRING_BLOCKED.test(value)) return null;
  return value;
}

/** Convert DB row to CodeEdge */
function rowToEdge(r: Record<string, unknown>): CodeEdge {
  // Malformed edge metadata must not crash relationship or blast-radius reads.
  // Treat parse failures as missing metadata for that row.
  let rawMetadata: unknown = undefined;
  if (r.metadata) {
    try {
      rawMetadata = JSON.parse(r.metadata as string);
    } catch {
      rawMetadata = undefined;
    }
  }
  if (rawMetadata && typeof rawMetadata === 'object') {
    // Sanitize the two free-form attribution strings on the read
    // path. Other metadata fields (`confidence`, `detectorProvenance`,
    // `evidenceClass`, ...) are validated by their own typecheck
    // sites and don't need string-shape filtering here.
    const meta = rawMetadata as Record<string, unknown>;
    if ('reason' in meta) {
      meta.reason = sanitizeEdgeMetadataString(meta.reason);
    }
    if ('step' in meta) {
      meta.step = sanitizeEdgeMetadataString(meta.step);
    }
  }
  return {
    sourceId: r.source_id as string,
    targetId: r.target_id as string,
    edgeType: r.edge_type as CodeEdge['edgeType'],
    weight: r.weight as number,
    metadata: rawMetadata as CodeEdge['metadata'],
  };
}

/** Compute token usage ratio (completion / total) for budget allocator consumption */
export function getTokenUsageRatio(
  sessionMetrics: { estimatedPromptTokens: number; estimatedCompletionTokens: number } | null,
): number {
  if (!sessionMetrics) return 0;
  const total = sessionMetrics.estimatedPromptTokens + sessionMetrics.estimatedCompletionTokens;
  if (total === 0) return 0;
  return sessionMetrics.estimatedCompletionTokens / total;
}
