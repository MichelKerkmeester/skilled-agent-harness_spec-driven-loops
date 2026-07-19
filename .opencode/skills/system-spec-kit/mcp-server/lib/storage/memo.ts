// ───────────────────────────────────────────────────────────────
// MODULE: Memo Storage
// ───────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';
import { BetterSqliteGraphTraversal, type GraphTraversal } from './ports/index.js';

export interface MemoRecordInput {
  componentPath: string;
  inputFingerprint: string;
  codeHash: string;
  outputBlob: string;
  computedAt?: string;
}

export interface MemoRecord extends MemoRecordInput {
  computedAt: string;
}

export interface DependencyEdgeInput {
  parentPath: string;
  childPath: string;
  kind: string;
}

export interface DependencyEdge extends DependencyEdgeInput {
  createdAt: string;
}

export interface InvalidationResult {
  invalidatedPaths: string[];
  deletedMemoRecords: number;
}

function assertPath(value: string, label: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

export function ensureMemoStorageSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS memoization_records (
      component_path TEXT NOT NULL,
      input_fingerprint TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      output_blob TEXT NOT NULL,
      computed_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (component_path, input_fingerprint, code_hash)
    );

    CREATE TABLE IF NOT EXISTS dependency_edges (
      parent_path TEXT NOT NULL,
      child_path TEXT NOT NULL,
      kind TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (parent_path, child_path, kind),
      CHECK(parent_path != child_path)
    );

    CREATE INDEX IF NOT EXISTS idx_memoization_records_component
      ON memoization_records(component_path);
    CREATE INDEX IF NOT EXISTS idx_dependency_edges_parent
      ON dependency_edges(parent_path);
    CREATE INDEX IF NOT EXISTS idx_dependency_edges_child
      ON dependency_edges(child_path);
    CREATE INDEX IF NOT EXISTS idx_dependency_edges_kind
      ON dependency_edges(kind);
  `);
}

function mapMemoRow(row: {
  component_path: string;
  input_fingerprint: string;
  code_hash: string;
  output_blob: string;
  computed_at: string;
}): MemoRecord {
  return {
    componentPath: row.component_path,
    inputFingerprint: row.input_fingerprint,
    codeHash: row.code_hash,
    outputBlob: row.output_blob,
    computedAt: row.computed_at,
  };
}

function mapEdgeRow(row: {
  parent_path: string;
  child_path: string;
  kind: string;
  created_at: string;
}): DependencyEdge {
  return {
    parentPath: row.parent_path,
    childPath: row.child_path,
    kind: row.kind,
    createdAt: row.created_at,
  };
}

export class MemoStore {
  // Counted once at construction and maintained on insert; correct only while
  // this single MemoStore instance is the sole writer of dependency_edges.
  private dependencyEdgeCount: number;
  private readonly graphTraversal: GraphTraversal;

  constructor(
    private readonly database: Database.Database,
    graphTraversal: GraphTraversal = new BetterSqliteGraphTraversal(database),
  ) {
    ensureMemoStorageSchema(database);
    this.graphTraversal = graphTraversal;
    this.dependencyEdgeCount = this.countDependencyEdges();
  }

  private countDependencyEdges(): number {
    const row = this.database.prepare(`
      SELECT COUNT(*) AS edge_count
      FROM dependency_edges
    `).get() as { edge_count: number } | undefined;
    return row?.edge_count ?? 0;
  }

  private insertDependencyEdge(edge: DependencyEdgeInput): void {
    const result = this.database.prepare(`
      INSERT OR IGNORE INTO dependency_edges (parent_path, child_path, kind)
      VALUES (?, ?, ?)
    `).run(edge.parentPath, edge.childPath, edge.kind) as { changes: number };
    if (result.changes > 0) {
      this.dependencyEdgeCount += result.changes;
    }
  }

  getMemoRecord(componentPath: string, inputFingerprint: string, codeHash: string): MemoRecord | null {
    const row = this.database.prepare(`
      SELECT component_path, input_fingerprint, code_hash, output_blob, computed_at
      FROM memoization_records
      WHERE component_path = ?
        AND input_fingerprint = ?
        AND code_hash = ?
      LIMIT 1
    `).get(componentPath, inputFingerprint, codeHash) as Parameters<typeof mapMemoRow>[0] | undefined;

    return row ? mapMemoRow(row) : null;
  }

  upsertMemoRecord(record: MemoRecordInput): void {
    assertPath(record.componentPath, 'componentPath');
    assertPath(record.inputFingerprint, 'inputFingerprint');
    assertPath(record.codeHash, 'codeHash');
    this.database.prepare(`
      INSERT INTO memoization_records (
        component_path,
        input_fingerprint,
        code_hash,
        output_blob,
        computed_at
      ) VALUES (?, ?, ?, ?, COALESCE(?, datetime('now')))
      ON CONFLICT(component_path, input_fingerprint, code_hash) DO UPDATE SET
        output_blob = excluded.output_blob,
        computed_at = excluded.computed_at
    `).run(
      record.componentPath,
      record.inputFingerprint,
      record.codeHash,
      record.outputBlob,
      record.computedAt ?? null,
    );
  }

  deleteMemoRecords(componentPaths: readonly string[]): number {
    const paths = Array.from(new Set(componentPaths.filter((value) => typeof value === 'string' && value.length > 0)));
    if (paths.length === 0) {
      return 0;
    }

    const placeholders = paths.map(() => '?').join(', ');
    const result = this.database.prepare(`
      DELETE FROM memoization_records
      WHERE component_path IN (${placeholders})
    `).run(...paths) as { changes: number };
    return result.changes;
  }

  listDependencyEdges(parentPath?: string): DependencyEdge[] {
    const rows = parentPath
      ? this.database.prepare(`
          SELECT parent_path, child_path, kind, created_at
          FROM dependency_edges
          WHERE parent_path = ?
          ORDER BY parent_path, child_path, kind
        `).all(parentPath) as Parameters<typeof mapEdgeRow>[0][]
      : this.database.prepare(`
          SELECT parent_path, child_path, kind, created_at
          FROM dependency_edges
          ORDER BY parent_path, child_path, kind
        `).all() as Parameters<typeof mapEdgeRow>[0][];

    return rows.map(mapEdgeRow);
  }

  addDependencyEdge(edge: DependencyEdgeInput): void {
    assertPath(edge.parentPath, 'parentPath');
    assertPath(edge.childPath, 'childPath');
    assertPath(edge.kind, 'kind');
    if (edge.parentPath === edge.childPath) {
      throw new Error(`Dependency edge would create a cycle: ${edge.parentPath} -> ${edge.childPath}`);
    }
    if (this.dependencyEdgeCount > 0 && this.wouldCreateCycle(edge.parentPath, edge.childPath)) {
      throw new Error(`Dependency edge would create a cycle: ${edge.parentPath} -> ${edge.childPath}`);
    }

    this.insertDependencyEdge(edge);
  }

  collectDependents(parentPaths: readonly string[]): string[] {
    const roots = Array.from(new Set(parentPaths.filter((value) => typeof value === 'string' && value.length > 0)));
    if (roots.length === 0 || this.dependencyEdgeCount === 0) {
      return [];
    }

    return this.graphTraversal.collectDependencyReachability(roots).sort();
  }

  invalidateDependents(parentPaths: readonly string[], includeSources = false): InvalidationResult {
    const roots = Array.from(new Set(parentPaths.filter((value) => typeof value === 'string' && value.length > 0)));
    const invalidatedPaths = this.collectDependents(roots);
    const deleteTargets = includeSources ? Array.from(new Set([...roots, ...invalidatedPaths])) : invalidatedPaths;
    const deletedMemoRecords = this.deleteMemoRecords(deleteTargets);
    return { invalidatedPaths, deletedMemoRecords };
  }

  private wouldCreateCycle(parentPath: string, childPath: string): boolean {
    if (parentPath === childPath) {
      return true;
    }

    return this.collectDependents([childPath]).includes(parentPath);
  }
}

export function createMemoStore(
  database: Database.Database,
  graphTraversal?: GraphTraversal,
): MemoStore {
  return new MemoStore(database, graphTraversal);
}
