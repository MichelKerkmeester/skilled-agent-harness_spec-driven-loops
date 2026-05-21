// ───────────────────────────────────────────────────────────────
// MODULE: Council Graph Database
// ───────────────────────────────────────────────────────────────
// Dedicated SQLite projection for AI Council graph state. This is a
// derived index: packet-local ai-council artifacts remain source-of-truth.

import Database from 'better-sqlite3';
import { join } from 'node:path';
import { statSync } from 'node:fs';
import { DATABASE_DIR } from '../../core/config.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SCHEMA_VERSION = 1;
const DB_FILENAME = 'council-graph.sqlite';
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

// ───────────────────────────────────────────────────────────────
// 3. DATABASE LIFECYCLE
// ───────────────────────────────────────────────────────────────

let db: Database.Database | null = null;
let dbPath: string | null = null;

export function initDb(dbDir: string): Database.Database {
  if (db) return db;

  try {
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
  } catch (err) {
    if (db) {
      try { db.close(); } catch { /* best effort cleanup */ }
    }
    db = null;
    dbPath = null;
    throw err;
  }
}

export function getDb(): Database.Database {
  if (!db) initDb(DATABASE_DIR);
  return db!;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    dbPath = null;
  }
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

// ───────────────────────────────────────────────────────────────
// 4. VALIDATION HELPERS
// ───────────────────────────────────────────────────────────────

export function clampWeight(weight: number): number {
  if (!Number.isFinite(weight)) return 1.0;
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
}

export function isCouncilNodeKind(kind: string): kind is CouncilNodeKind {
  return (VALID_KINDS as readonly string[]).includes(kind);
}

export function isCouncilRelation(relation: string): relation is CouncilRelation {
  return (VALID_RELATIONS as readonly string[]).includes(relation);
}

// ───────────────────────────────────────────────────────────────
// 5. NODE OPERATIONS
// ───────────────────────────────────────────────────────────────

export function upsertNode(node: CouncilNode): string {
  const d = getDb();
  const now = new Date().toISOString();
  const metadataStr = node.metadata ? JSON.stringify(node.metadata) : null;

  const existing = d.prepare(
    'SELECT id FROM council_nodes WHERE spec_folder = ? AND session_id = ? AND id = ?',
  ).get(node.specFolder, node.sessionId, node.id) as { id: string } | undefined;

  if (existing) {
    d.prepare(`
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

  d.prepare(`
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

export function getNode(ns: CouncilNamespace, id: string): CouncilNode | null {
  if (!ns.sessionId) return null;
  const d = getDb();
  const row = d.prepare(
    'SELECT * FROM council_nodes WHERE spec_folder = ? AND session_id = ? AND id = ?',
  ).get(ns.specFolder, ns.sessionId, id) as Record<string, unknown> | undefined;
  return row ? rowToNode(row) : null;
}

export function getNodes(ns: CouncilNamespace): CouncilNode[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM council_nodes WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

export function getNodesByKind(ns: CouncilNamespace, kind: CouncilNodeKind): CouncilNode[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM council_nodes WHERE ${clause} AND kind = ?`).all(...params, kind) as Record<string, unknown>[];
  return rows.map(rowToNode);
}

// ───────────────────────────────────────────────────────────────
// 6. EDGE OPERATIONS
// ───────────────────────────────────────────────────────────────

export function upsertEdge(edge: CouncilEdge): string | null {
  if (edge.sourceId === edge.targetId) return null;

  const d = getDb();
  const now = new Date().toISOString();
  const weight = clampWeight(edge.weight);
  const metadataStr = edge.metadata ? JSON.stringify(edge.metadata) : null;

  const existing = d.prepare(
    'SELECT id FROM council_edges WHERE spec_folder = ? AND session_id = ? AND id = ?',
  ).get(edge.specFolder, edge.sessionId, edge.id) as { id: string } | undefined;

  if (existing) {
    d.prepare(`
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

  d.prepare(`
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

export function getEdges(ns: CouncilNamespace): CouncilEdge[] {
  const d = getDb();
  const { clause, params } = buildNamespaceWhere(ns);
  const rows = d.prepare(`SELECT * FROM council_edges WHERE ${clause}`).all(...params) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

export function getEdgesFrom(ns: CouncilNamespace, sourceId: string): CouncilEdge[] {
  if (!ns.sessionId) return [];
  const d = getDb();
  const rows = d.prepare(
    'SELECT * FROM council_edges WHERE spec_folder = ? AND session_id = ? AND source_id = ?',
  ).all(ns.specFolder, ns.sessionId, sourceId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

export function getEdgesTo(ns: CouncilNamespace, targetId: string): CouncilEdge[] {
  if (!ns.sessionId) return [];
  const d = getDb();
  const rows = d.prepare(
    'SELECT * FROM council_edges WHERE spec_folder = ? AND session_id = ? AND target_id = ?',
  ).all(ns.specFolder, ns.sessionId, targetId) as Record<string, unknown>[];
  return rows.map(rowToEdge);
}

// ───────────────────────────────────────────────────────────────
// 7. SNAPSHOTS AND STATS
// ───────────────────────────────────────────────────────────────

export function createSnapshot(snapshot: CouncilSnapshot): number {
  const d = getDb();
  const metricsStr = JSON.stringify(snapshot.metrics);
  const roundKey = snapshot.roundId ?? '__latest__';
  const result = d.prepare(`
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

export function getSnapshots(specFolder: string, sessionId?: string): CouncilSnapshot[] {
  const d = getDb();
  if (sessionId) {
    const rows = d.prepare(`
      SELECT * FROM council_snapshots
      WHERE spec_folder = ? AND session_id = ?
      ORDER BY created_at ASC
    `).all(specFolder, sessionId) as Record<string, unknown>[];
    return rows.map(rowToSnapshot);
  }
  const rows = d.prepare(`
    SELECT * FROM council_snapshots
    WHERE spec_folder = ?
    ORDER BY created_at ASC
  `).all(specFolder) as Record<string, unknown>[];
  return rows.map(rowToSnapshot);
}

export function getStats(specFolder: string, sessionId?: string): {
  totalNodes: number;
  totalEdges: number;
  nodesByKind: Record<string, number>;
  edgesByRelation: Record<string, number>;
  snapshotCount: number;
  schemaVersion: number;
  dbFileSize: number | null;
} {
  const d = getDb();
  const ns = { specFolder, sessionId };
  const { clause, params } = buildNamespaceWhere(ns);

  const totalNodes = (d.prepare(`SELECT COUNT(*) as c FROM council_nodes WHERE ${clause}`).get(...params) as { c: number }).c;
  const totalEdges = (d.prepare(`SELECT COUNT(*) as c FROM council_edges WHERE ${clause}`).get(...params) as { c: number }).c;

  const nodesByKind: Record<string, number> = {};
  const kindRows = d.prepare(`SELECT kind, COUNT(*) as c FROM council_nodes WHERE ${clause} GROUP BY kind`).all(...params) as { kind: string; c: number }[];
  for (const row of kindRows) nodesByKind[row.kind] = row.c;

  const edgesByRelation: Record<string, number> = {};
  const relRows = d.prepare(`SELECT relation, COUNT(*) as c FROM council_edges WHERE ${clause} GROUP BY relation`).all(...params) as { relation: string; c: number }[];
  for (const row of relRows) edgesByRelation[row.relation] = row.c;

  const snapshotCount = sessionId
    ? (d.prepare('SELECT COUNT(*) as c FROM council_snapshots WHERE spec_folder = ? AND session_id = ?').get(specFolder, sessionId) as { c: number }).c
    : (d.prepare('SELECT COUNT(*) as c FROM council_snapshots WHERE spec_folder = ?').get(specFolder) as { c: number }).c;

  let dbFileSize: number | null = null;
  if (dbPath) {
    try { dbFileSize = statSync(dbPath).size; } catch { /* file may not exist yet */ }
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
      insertedNodes++;
    }
    for (const edge of edges) {
      const result = upsertEdge(edge);
      if (result) insertedEdges++;
      else rejectedEdges++;
    }
  });
  tx();

  return { insertedNodes, insertedEdges, rejectedEdges };
}

// ───────────────────────────────────────────────────────────────
// 8. ROW CONVERTERS
// ───────────────────────────────────────────────────────────────

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
