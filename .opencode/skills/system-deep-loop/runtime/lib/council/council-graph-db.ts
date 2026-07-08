// MODULE: Council Graph Database
//
// Runtime-owned SQLite projection for AI Council graph state. This is a
// derived index: packet-local ai-council artifacts remain source-of-truth.

import Database from 'better-sqlite3';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───── TYPE DEFINITIONS ─────

export type CouncilNodeKind =
  | 'SESSION'
  | 'ROUND'
  | 'SEAT'
  | 'CLAIM'
  | 'EVIDENCE'
  | 'DISAGREEMENT'
  | 'DECISION'
  | 'RECOMMENDATION';

export type CouncilRelation =
  | 'PARTICIPATES_IN'
  | 'PROPOSES'
  | 'SUPPORTS'
  | 'CONTRADICTS'
  | 'DERIVES_FROM'
  | 'AGREES_WITH'
  | 'RESOLVES'
  | 'ESCALATES'
  | 'EVIDENCE_FOR'
  | 'RECOMMENDS';

export interface CouncilNode {
  id: string;
  specFolder: string;
  sessionId: string;
  kind: CouncilNodeKind;
  name: string;
  artifactPath?: string;
  contentHash?: string;
  roundId?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouncilEdge {
  id: string;
  specFolder: string;
  sessionId: string;
  sourceId: string;
  targetId: string;
  relation: CouncilRelation;
  weight: number;
  artifactPath?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface CouncilSnapshot {
  id?: number;
  specFolder: string;
  sessionId: string;
  roundId?: string;
  metrics: Record<string, unknown>;
  nodeCount: number;
  edgeCount: number;
  createdAt?: string;
}

export interface CouncilNamespace {
  specFolder: string;
  sessionId?: string;
}

// ───── CONSTANTS ─────

export const SCHEMA_VERSION = 1;
export const DB_FILENAME = 'council-graph.sqlite';
export const COUNCIL_GRAPH_STORAGE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'database',
);

const MIN_WEIGHT = 0.0;
const MAX_WEIGHT = 2.0;

export const VALID_KINDS = [
  'SESSION',
  'ROUND',
  'SEAT',
  'CLAIM',
  'EVIDENCE',
  'DISAGREEMENT',
  'DECISION',
  'RECOMMENDATION',
] as const;

export const VALID_RELATIONS = [
  'PARTICIPATES_IN',
  'PROPOSES',
  'SUPPORTS',
  'CONTRADICTS',
  'DERIVES_FROM',
  'AGREES_WITH',
  'RESOLVES',
  'ESCALATES',
  'EVIDENCE_FOR',
  'RECOMMENDS',
] as const;

const KIND_CHECK = VALID_KINDS.map((kind) => `'${kind}'`).join(', ');
const RELATION_CHECK = VALID_RELATIONS.map((relation) => `'${relation}'`).join(', ');

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS council_nodes (
    spec_folder TEXT NOT NULL,
    session_id TEXT NOT NULL,
    id TEXT NOT NULL,
    kind TEXT NOT NULL CHECK(kind IN (${KIND_CHECK})),
    name TEXT NOT NULL,
    artifact_path TEXT,
    content_hash TEXT,
    round_id TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (spec_folder, session_id, id)
  );

  CREATE TABLE IF NOT EXISTS council_edges (
    spec_folder TEXT NOT NULL,
    session_id TEXT NOT NULL,
    id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relation TEXT NOT NULL CHECK(relation IN (${RELATION_CHECK})),
    weight REAL DEFAULT 1.0 CHECK(weight >= 0.0 AND weight <= 2.0),
    artifact_path TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    CHECK(source_id != target_id),
    PRIMARY KEY (spec_folder, session_id, id),
    FOREIGN KEY (spec_folder, session_id, source_id)
      REFERENCES council_nodes (spec_folder, session_id, id),
    FOREIGN KEY (spec_folder, session_id, target_id)
      REFERENCES council_nodes (spec_folder, session_id, id)
  );

  CREATE TABLE IF NOT EXISTS council_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spec_folder TEXT NOT NULL,
    session_id TEXT NOT NULL,
    round_id TEXT,
    metrics TEXT,
    node_count INTEGER,
    edge_count INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(spec_folder, session_id, round_id)
  );

  CREATE TABLE IF NOT EXISTS council_schema_version (
    version INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_council_nodes_session ON council_nodes(spec_folder, session_id);
  CREATE INDEX IF NOT EXISTS idx_council_nodes_kind ON council_nodes(kind);
  CREATE INDEX IF NOT EXISTS idx_council_nodes_round ON council_nodes(spec_folder, session_id, round_id);
  CREATE INDEX IF NOT EXISTS idx_council_edges_source ON council_edges(spec_folder, session_id, source_id);
  CREATE INDEX IF NOT EXISTS idx_council_edges_target ON council_edges(spec_folder, session_id, target_id);
  CREATE INDEX IF NOT EXISTS idx_council_edges_relation ON council_edges(relation);
  CREATE INDEX IF NOT EXISTS idx_council_snapshots_session ON council_snapshots(spec_folder, session_id);
`;

// ───── DATABASE LIFECYCLE ─────

let db: Database.Database | null = null;
let dbPath: string | null = null;
let statementDb: Database.Database | null = null;
const preparedStatements = new Map<string, Database.Statement>();

/**
 * Initialize (or get) the council graph database.
 *
 * Creates the runtime database directory and file, applies the schema, and
 * enables WAL journaling and foreign keys.
 *
 * @param dbDir - Directory for the database file.
 * @returns The initialized Database instance.
 */
export function initDb(dbDir: string = COUNCIL_GRAPH_STORAGE_DIR): Database.Database {
  if (db) return db;

  try {
    mkdirSync(dbDir, { recursive: true });
    dbPath = join(dbDir, DB_FILENAME);
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(SCHEMA_SQL);

    const versionRow = db.prepare('SELECT version FROM council_schema_version LIMIT 1').get() as { version: number } | undefined;
    if (!versionRow) {
      db.prepare('INSERT INTO council_schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
    } else if (versionRow.version < SCHEMA_VERSION) {
      db.prepare('UPDATE council_schema_version SET version = ?').run(SCHEMA_VERSION);
    }

    return db;
  } catch (err: unknown) {
    if (db) {
      try { db.close(); } catch { }
    }
    db = null;
    dbPath = null;
    statementDb = null;
    preparedStatements.clear();
    throw err;
  }
}

/**
 * Get the current database instance (lazy-initializes if needed).
 *
 * @returns The Database instance.
 */
export function getDb(): Database.Database {
  if (!db) initDb(COUNCIL_GRAPH_STORAGE_DIR);
  return db!;
}

/**
 * Close the database connection and clear cached prepared statements.
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    dbPath = null;
    statementDb = null;
    preparedStatements.clear();
  }
}

/**
 * Return the active database file path, if a connection has been opened.
 *
 * @returns Active SQLite file path or null.
 */
export function getDbPath(): string | null {
  return dbPath;
}

// ───── HELPERS ─────

function prepareStatement(sql: string): Database.Statement {
  const currentDb = getDb();
  if (statementDb !== currentDb) {
    preparedStatements.clear();
    statementDb = currentDb;
  }

  let statement = preparedStatements.get(sql);
  if (!statement) {
    statement = currentDb.prepare(sql);
    preparedStatements.set(sql, statement);
  }
  return statement;
}

function buildNamespaceWhere(ns: CouncilNamespace): { clause: string; params: unknown[] } {
  const parts = ['spec_folder = ?'];
  const params: unknown[] = [ns.specFolder];
  if (ns.sessionId) {
    parts.push('session_id = ?');
    params.push(ns.sessionId);
  }
  return { clause: parts.join(' AND '), params };
}

function rowToNode(row: Record<string, unknown>): CouncilNode {
  return {
    id: row.id as string,
    specFolder: row.spec_folder as string,
    sessionId: row.session_id as string,
    kind: row.kind as CouncilNodeKind,
    name: row.name as string,
    artifactPath: (row.artifact_path as string | null) ?? undefined,
    contentHash: (row.content_hash as string | null) ?? undefined,
    roundId: (row.round_id as string | null) ?? undefined,
    metadata: row.metadata ? JSON.parse(row.metadata as string) as Record<string, unknown> : undefined,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function rowToEdge(row: Record<string, unknown>): CouncilEdge {
  return {
    id: row.id as string,
    specFolder: row.spec_folder as string,
    sessionId: row.session_id as string,
    sourceId: row.source_id as string,
    targetId: row.target_id as string,
    relation: row.relation as CouncilRelation,
    weight: row.weight as number,
    artifactPath: (row.artifact_path as string | null) ?? undefined,
    metadata: row.metadata ? JSON.parse(row.metadata as string) as Record<string, unknown> : undefined,
    createdAt: row.created_at as string | undefined,
  };
}

function rowToSnapshot(row: Record<string, unknown>): CouncilSnapshot {
  const roundId = row.round_id === '__latest__' ? undefined : (row.round_id as string | null) ?? undefined;
  return {
    id: row.id as number,
    specFolder: row.spec_folder as string,
    sessionId: row.session_id as string,
    roundId,
    metrics: row.metrics ? JSON.parse(row.metrics as string) as Record<string, unknown> : {},
    nodeCount: row.node_count as number,
    edgeCount: row.edge_count as number,
    createdAt: row.created_at as string | undefined,
  };
}

// ───── EXPORTS ─────

/**
 * Clamp relation weight to the valid range [0.0, 2.0].
 *
 * @param weight - Raw weight value.
 * @returns Clamped weight in [0.0, 2.0]. Non-finite values default to 1.0.
 */
export function clampWeight(weight: number): number {
  if (!Number.isFinite(weight)) return 1.0;
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
}

/**
 * Check whether a string is a valid council node kind.
 *
 * @param kind - Candidate node kind.
 * @returns True when the kind belongs to the council taxonomy.
 */
export function isCouncilNodeKind(kind: string): kind is CouncilNodeKind {
  return (VALID_KINDS as readonly string[]).includes(kind);
}

/**
 * Check whether a string is a valid council relation.
 *
 * @param relation - Candidate relation kind.
 * @returns True when the relation belongs to the council taxonomy.
 */
export function isCouncilRelation(relation: string): relation is CouncilRelation {
  return (VALID_RELATIONS as readonly string[]).includes(relation);
}

/**
 * Insert or update a node scoped to the full council namespace.
 *
 * @param node - Council node to upsert.
 * @returns The node ID.
 */
export function upsertNode(node: CouncilNode): string {
  const now = new Date().toISOString();
  const metadataStr = node.metadata ? JSON.stringify(node.metadata) : null;

  const existing = prepareStatement(
    'SELECT id FROM council_nodes WHERE spec_folder = ? AND session_id = ? AND id = ?',
  ).get(node.specFolder, node.sessionId, node.id) as { id: string } | undefined;

  if (existing) {
    prepareStatement(`
      UPDATE council_nodes SET
        kind = ?, name = ?, artifact_path = ?, content_hash = ?,
        round_id = ?, metadata = ?, updated_at = ?
      WHERE spec_folder = ? AND session_id = ? AND id = ?
    `).run(
      node.kind,
      node.name,
      node.artifactPath ?? null,
      node.contentHash ?? null,
      node.roundId ?? null,
      metadataStr,
      now,
      node.specFolder,
      node.sessionId,
      node.id,
    );
    return node.id;
  }

  prepareStatement(`
    INSERT INTO council_nodes (
      spec_folder, session_id, id, kind, name, artifact_path,
      content_hash, round_id, metadata, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    node.specFolder,
    node.sessionId,
    node.id,
    node.kind,
    node.name,
    node.artifactPath ?? null,
    node.contentHash ?? null,
    node.roundId ?? null,
    metadataStr,
    now,
    now,
  );
  return node.id;
}

/**
 * Get a node by ID inside a session-scoped namespace.
 *
 * @param ns - Namespace for scoping.
 * @param id - Node ID.
 * @returns The node or null if not found.
 */
export function getNode(ns: CouncilNamespace, id: string): CouncilNode | null {
  if (!ns.sessionId) return null;
  const row = prepareStatement(
    'SELECT * FROM council_nodes WHERE spec_folder = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.sessionId, id) as Record<string, unknown> | undefined;
  return row ? rowToNode(row) : null;
}

/**
 * Get all nodes in a namespace.
 *
 * @param ns - Namespace for scoping.
 * @returns Array of council nodes.
 */
export function getNodes(ns: CouncilNamespace): CouncilNode[] {
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = prepareStatement(`SELECT * FROM council_nodes WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

/**
 * Get nodes of a specific council kind.
 *
 * @param ns - Namespace for scoping.
 * @param kind - Node kind to filter by.
 * @returns Array of matching council nodes.
 */
export function getNodesByKind(ns: CouncilNamespace, kind: CouncilNodeKind): CouncilNode[] {
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = prepareStatement(`SELECT * FROM council_nodes WHERE ${clause} AND kind = ?`).all(...params, kind) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

/**
 * Insert or update an edge scoped to the full council namespace.
 *
 * Rejects self-loops and clamps weights. Foreign keys ensure edges cannot
 * cross namespace boundaries.
 *
 * @param edge - Council edge to upsert.
 * @returns The edge ID or null if rejected as a self-loop.
 */
export function upsertEdge(edge: CouncilEdge): string | null {
  if (edge.sourceId === edge.targetId) return null;

  const now = new Date().toISOString();
  const weight = clampWeight(edge.weight);
  const metadataStr = edge.metadata ? JSON.stringify(edge.metadata) : null;

  const existing = prepareStatement(
    'SELECT id FROM council_edges WHERE spec_folder = ? AND session_id = ? AND id = ?',
  ).get(edge.specFolder, edge.sessionId, edge.id) as { id: string } | undefined;

  if (existing) {
    prepareStatement(`
      UPDATE council_edges SET
        source_id = ?, target_id = ?, relation = ?, weight = ?, artifact_path = ?, metadata = ?
      WHERE spec_folder = ? AND session_id = ? AND id = ?
    `).run(
      edge.sourceId,
      edge.targetId,
      edge.relation,
      weight,
      edge.artifactPath ?? null,
      metadataStr,
      edge.specFolder,
      edge.sessionId,
      edge.id,
    );
    return edge.id;
  }

  prepareStatement(`
    INSERT INTO council_edges (
      spec_folder, session_id, id, source_id, target_id,
      relation, weight, artifact_path, metadata, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    edge.specFolder,
    edge.sessionId,
    edge.id,
    edge.sourceId,
    edge.targetId,
    edge.relation,
    weight,
    edge.artifactPath ?? null,
    metadataStr,
    now,
  );
  return edge.id;
}

/**
 * Get all edges in a namespace.
 *
 * @param ns - Namespace for scoping.
 * @returns Array of council edges.
 */
export function getEdges(ns: CouncilNamespace): CouncilEdge[] {
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = prepareStatement(`SELECT * FROM council_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/**
 * Get outgoing edges from a node inside a session-scoped namespace.
 *
 * @param ns - Namespace for scoping.
 * @param sourceId - Source node ID.
 * @returns Array of matching council edges.
 */
export function getEdgesFrom(ns: CouncilNamespace, sourceId: string): CouncilEdge[] {
  if (!ns.sessionId) return [];
  const rows = prepareStatement(
    'SELECT * FROM council_edges WHERE spec_folder = ? AND session_id = ? AND source_id = ?',
  ).all(ns.specFolder, ns.sessionId, sourceId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/**
 * Get incoming edges to a node inside a session-scoped namespace.
 *
 * @param ns - Namespace for scoping.
 * @param targetId - Target node ID.
 * @returns Array of matching council edges.
 */
export function getEdgesTo(ns: CouncilNamespace, targetId: string): CouncilEdge[] {
  if (!ns.sessionId) return [];
  const rows = prepareStatement(
    'SELECT * FROM council_edges WHERE spec_folder = ? AND session_id = ? AND target_id = ?',
  ).all(ns.specFolder, ns.sessionId, targetId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

/**
 * Create or replace a metrics snapshot for a council round.
 *
 * @param snapshot - Snapshot payload to persist.
 * @returns The auto-increment row ID for new inserts.
 */
export function createSnapshot(snapshot: CouncilSnapshot): number {
  const metricsStr = JSON.stringify(snapshot.metrics);
  const roundKey = snapshot.roundId ?? '__latest__';
  const result = prepareStatement(`
    INSERT INTO council_snapshots (
      spec_folder, session_id, round_id, metrics, node_count, edge_count
    )
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(spec_folder, session_id, round_id) DO UPDATE SET
      metrics = excluded.metrics,
      node_count = excluded.node_count,
      edge_count = excluded.edge_count
  `).run(snapshot.specFolder, snapshot.sessionId, roundKey, metricsStr, snapshot.nodeCount, snapshot.edgeCount);
  return Number(result.lastInsertRowid);
}

/**
 * Get snapshots for a spec folder, optionally scoped to one session.
 *
 * @param specFolder - Spec folder for scoping.
 * @param sessionId - Optional session ID.
 * @returns Snapshots ordered by creation time.
 */
export function getSnapshots(specFolder: string, sessionId?: string): CouncilSnapshot[] {
  if (sessionId) {
    const rows = prepareStatement(`
      SELECT * FROM council_snapshots
      WHERE spec_folder = ? AND session_id = ?
      ORDER BY created_at ASC
    `).all(specFolder, sessionId) as Record<string, unknown>[];
    return rows.map(rowToSnapshot);
  }
  const rows = prepareStatement(`
    SELECT * FROM council_snapshots
    WHERE spec_folder = ?
    ORDER BY created_at ASC
  `).all(specFolder) as Record<string, unknown>[];
  return rows.map(rowToSnapshot);
}

/**
 * Get graph statistics for a spec folder, optionally scoped to one session.
 *
 * @param specFolder - Spec folder for scoping.
 * @param sessionId - Optional session ID.
 * @returns Counts, taxonomy breakdowns, schema version, and database size.
 */
export function getStats(specFolder: string, sessionId?: string): {
  totalNodes: number;
  totalEdges: number;
  nodesByKind: Record<string, number>;
  edgesByRelation: Record<string, number>;
  snapshotCount: number;
  schemaVersion: number;
  dbFileSize: number | null;
} {
  const ns = { specFolder, sessionId };
  const { clause, params } = buildNamespaceWhere(ns);

  const totalNodes = (prepareStatement(`SELECT COUNT(*) as c FROM council_nodes WHERE ${clause}`).get(...params) as { c: number }).c;
  const totalEdges = (prepareStatement(`SELECT COUNT(*) as c FROM council_edges WHERE ${clause}`).get(...params) as { c: number }).c;

  const nodesByKind: Record<string, number> = {};
  const kindRows = prepareStatement(`SELECT kind, COUNT(*) as c FROM council_nodes WHERE ${clause} GROUP BY kind`).all(...params) as { kind: string; c: number }[];
  for (const row of kindRows) nodesByKind[row.kind] = row.c;

  const edgesByRelation: Record<string, number> = {};
  const relationRows = prepareStatement(`SELECT relation, COUNT(*) as c FROM council_edges WHERE ${clause} GROUP BY relation`).all(...params) as { relation: string; c: number }[];
  for (const row of relationRows) edgesByRelation[row.relation] = row.c;

  const snapshotCount = sessionId
    ? (prepareStatement('SELECT COUNT(*) as c FROM council_snapshots WHERE spec_folder = ? AND session_id = ?').get(specFolder, sessionId) as { c: number }).c
    : (prepareStatement('SELECT COUNT(*) as c FROM council_snapshots WHERE spec_folder = ?').get(specFolder) as { c: number }).c;

  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { }
  }

  return {
    totalNodes,
    totalEdges,
    nodesByKind,
    edgesByRelation,
    snapshotCount,
    schemaVersion: SCHEMA_VERSION,
    dbFileSize,
  };
}

/**
 * Upsert nodes and edges in one transaction.
 *
 * @param nodes - Council nodes to insert or update.
 * @param edges - Council edges to insert or update.
 * @returns Insert/reject counts for script bridge output.
 */
export function batchUpsert(
  nodes: CouncilNode[],
  edges: CouncilEdge[],
): { insertedNodes: number; insertedEdges: number; rejectedEdges: number } {
  const d = getDb();
  let insertedNodes = 0;
  let insertedEdges = 0;
  let rejectedEdges = 0;

  const tx = d.transaction(() => {
    for (const node of nodes) {
      upsertNode(node);
      insertedNodes += 1;
    }
    for (const edge of edges) {
      const result = upsertEdge(edge);
      if (result) insertedEdges += 1;
      else rejectedEdges += 1;
    }
  });
  tx();

  return { insertedNodes, insertedEdges, rejectedEdges };
}

/**
 * Delete all derived council graph rows for a namespace.
 *
 * @param ns - Spec folder and optional session ID to clean up.
 * @returns Number of rows removed.
 */
export function cleanupNamespace(ns: CouncilNamespace): number {
  const { clause, params } = buildNamespaceWhere(ns);
  const d = getDb();
  const tx = d.transaction(() => {
    const deletedEdges = prepareStatement(`DELETE FROM council_edges WHERE ${clause}`).run(...params).changes;
    const deletedSnapshots = prepareStatement(`DELETE FROM council_snapshots WHERE ${clause}`).run(...params).changes;
    const deletedNodes = prepareStatement(`DELETE FROM council_nodes WHERE ${clause}`).run(...params).changes;
    return deletedEdges + deletedSnapshots + deletedNodes;
  });
  return tx();
}
