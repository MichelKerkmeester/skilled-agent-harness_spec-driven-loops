// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tombstone Audit Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanupOrphans,
  closeDb,
  getDb,
  getTombstoneSummary,
  initDb,
  queryEdgesFrom,
  removeFile,
  replaceEdges,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph-db.js';
import type { CodeEdge, CodeNode } from '../lib/indexer-types.js';

const TOMBSTONES_ENV = 'SPECKIT_CODE_GRAPH_TOMBSTONES';
const TOMBSTONE_LIMIT_ENV = 'SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT';

let tempDir: string;
let originalTombstonesEnv: string | undefined;
let originalTombstoneLimitEnv: string | undefined;

function createNode(symbolId: string, filePath: string, name: string): CodeNode {
  return {
    symbolId,
    filePath,
    fqName: name,
    kind: 'function',
    name,
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 10,
    language: 'typescript',
    signature: `function ${name}()`,
    contentHash: `hash-${name}`,
  };
}

function createEdge(sourceId: string, targetId: string): CodeEdge {
  return {
    sourceId,
    targetId,
    edgeType: 'CALLS',
    weight: 1,
    metadata: { confidence: 1 },
  };
}

function createFile(filePath: string, nodes: CodeNode[]): number {
  const fileId = upsertFile(
    filePath,
    'typescript',
    `hash-${filePath}`,
    nodes.length,
    0,
    'clean',
    1,
    { fileMtimeMs: 0 },
  );
  replaceNodes(fileId, nodes);
  return fileId;
}

beforeEach(() => {
  originalTombstonesEnv = process.env[TOMBSTONES_ENV];
  originalTombstoneLimitEnv = process.env[TOMBSTONE_LIMIT_ENV];
  delete process.env[TOMBSTONES_ENV];
  delete process.env[TOMBSTONE_LIMIT_ENV];
  tempDir = mkdtempSync(join(tmpdir(), 'code-graph-tombstones-'));
  initDb(tempDir);
});

afterEach(() => {
  closeDb();
  rmSync(tempDir, { recursive: true, force: true });
  if (originalTombstonesEnv === undefined) {
    delete process.env[TOMBSTONES_ENV];
  } else {
    process.env[TOMBSTONES_ENV] = originalTombstonesEnv;
  }
  if (originalTombstoneLimitEnv === undefined) {
    delete process.env[TOMBSTONE_LIMIT_ENV];
  } else {
    process.env[TOMBSTONE_LIMIT_ENV] = originalTombstoneLimitEnv;
  }
});

describe('code graph tombstone audit', () => {
  it('keeps default-off hard deletes free of tombstone table writes', () => {
    const sourcePath = '/workspace/source.ts';
    const targetPath = '/workspace/target.ts';
    createFile(sourcePath, [createNode('source::fn', sourcePath, 'source')]);
    createFile(targetPath, [createNode('target::fn', targetPath, 'target')]);
    replaceEdges(['source::fn'], [createEdge('source::fn', 'target::fn')]);

    removeFile(targetPath, { reason: 'incremental_missing_tracked_file' });

    const table = getDb().prepare(`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_graph_tombstones'
    `).get() as { name: string } | undefined;
    expect(table).toBeUndefined();
    expect(getTombstoneSummary()).toEqual({
      enabled: false,
      retentionLimit: 0,
      retainedRows: 0,
      byKind: {},
      byReason: {},
      recent: [],
    });
    expect(queryEdgesFrom('source::fn')).toEqual([]);
  });

  it('records why an edge disappeared when a target file is reindexed away', () => {
    process.env[TOMBSTONES_ENV] = 'true';
    const sourcePath = '/workspace/source.ts';
    const targetPath = '/workspace/target.ts';
    const targetFileId = createFile(targetPath, [createNode('target::fn', targetPath, 'target')]);
    createFile(sourcePath, [createNode('source::fn', sourcePath, 'source')]);
    replaceEdges(['source::fn'], [createEdge('source::fn', 'target::fn')]);

    replaceNodes(targetFileId, []);

    const summary = getTombstoneSummary();
    expect(summary.enabled).toBe(true);
    expect(summary.byKind.edge).toBe(1);
    expect(summary.byKind.node).toBe(1);
    expect(summary.byReason.replace_nodes_reindex).toBe(2);
    expect(summary.recent).toEqual(expect.arrayContaining([
      expect.objectContaining({
        entityKind: 'edge',
        sourceId: 'source::fn',
        targetId: 'target::fn',
        edgeType: 'CALLS',
        reason: 'replace_nodes_reindex',
      }),
    ]));
    expect(queryEdgesFrom('source::fn')).toEqual([]);
  });

  it('records file, node, and edge deletion lineage for removed files', () => {
    process.env[TOMBSTONES_ENV] = 'true';
    const sourcePath = '/workspace/source.ts';
    const targetPath = '/workspace/target.ts';
    createFile(sourcePath, [createNode('source::fn', sourcePath, 'source')]);
    createFile(targetPath, [createNode('target::fn', targetPath, 'target')]);
    replaceEdges(['source::fn'], [createEdge('source::fn', 'target::fn')]);

    removeFile(targetPath, { reason: 'incremental_missing_tracked_file' });

    const summary = getTombstoneSummary();
    expect(summary.byKind).toMatchObject({ edge: 1, file: 1, node: 1 });
    expect(summary.byReason.incremental_missing_tracked_file).toBe(3);
    expect(summary.recent).toEqual(expect.arrayContaining([
      expect.objectContaining({ entityKind: 'file', filePath: targetPath }),
      expect.objectContaining({ entityKind: 'node', entityId: 'target::fn', filePath: targetPath }),
      expect.objectContaining({ entityKind: 'edge', targetId: 'target::fn' }),
    ]));
    expect(queryEdgesFrom('source::fn')).toEqual([]);
  });

  it('bounds retention by pruning oldest tombstones', () => {
    process.env[TOMBSTONES_ENV] = 'true';
    process.env[TOMBSTONE_LIMIT_ENV] = '2';

    for (let index = 0; index < 4; index++) {
      const filePath = `/workspace/file-${index}.ts`;
      createFile(filePath, [createNode(`file-${index}::fn`, filePath, `file${index}`)]);
      removeFile(filePath, { reason: 'full_scan_unindexed_tracked_file' });
    }

    const summary = getTombstoneSummary();
    expect(summary.retentionLimit).toBe(2);
    expect(summary.retainedRows).toBe(2);
    expect(summary.recent).toHaveLength(2);
    expect(summary.recent.every((row) => row.filePath === '/workspace/file-3.ts')).toBe(true);
  });

  it('records edge tombstones for edges orphaned by cleanupOrphans node deletion', () => {
    process.env[TOMBSTONES_ENV] = 'true';
    const sourcePath = '/workspace/source.ts';
    const targetPath = '/workspace/target.ts';
    createFile(sourcePath, [createNode('source::fn', sourcePath, 'source')]);
    const targetFileId = createFile(targetPath, [createNode('target::fn', targetPath, 'target')]);
    replaceEdges(['source::fn'], [createEdge('source::fn', 'target::fn')]);

    // Create the genuine orphan-node state cleanupOrphans is meant to repair:
    // a node whose code_files row is gone but the node row survives. The
    // schema CASCADE-deletes nodes on file delete, so temporarily disable FKs
    // to leave target::fn behind as an orphan with file_id pointing nowhere.
    // The source->target edge is therefore NOT dangling yet (target::fn still
    // exists in code_nodes) — exactly the case the regression covers.
    const db = getDb();
    db.pragma('foreign_keys = OFF');
    db.prepare('DELETE FROM code_files WHERE id = ?').run(targetFileId);
    db.pragma('foreign_keys = ON');

    const removed = cleanupOrphans();
    // 1 orphan node + 1 edge swept.
    expect(removed).toBe(2);

    const summary = getTombstoneSummary();
    // The node-orphan path records the node tombstone, and the edge attached to
    // the soon-to-be-deleted orphan node is tombstoned BEFORE the node delete
    // (the regression: recordDanglingEdgeTombstones alone misses it because the
    // edge is not dangling while the orphan node is still present).
    expect(summary.byKind.node).toBe(1);
    expect(summary.byKind.edge).toBe(1);
    expect(summary.byReason.cleanup_orphans).toBe(2);
    expect(summary.recent).toEqual(expect.arrayContaining([
      expect.objectContaining({
        entityKind: 'edge',
        sourceId: 'source::fn',
        targetId: 'target::fn',
        edgeType: 'CALLS',
        reason: 'cleanup_orphans',
      }),
      expect.objectContaining({
        entityKind: 'node',
        entityId: 'target::fn',
        reason: 'cleanup_orphans',
      }),
    ]));
    expect(queryEdgesFrom('source::fn')).toEqual([]);
  });

  it('cleanupOrphans is atomic: a single transaction with no duplicate tombstone rows on the orphaned edge', () => {
    process.env[TOMBSTONES_ENV] = 'true';
    const sourcePath = '/workspace/source.ts';
    const targetPath = '/workspace/target.ts';
    createFile(sourcePath, [createNode('source::fn', sourcePath, 'source')]);
    const targetFileId = createFile(targetPath, [createNode('target::fn', targetPath, 'target')]);
    replaceEdges(['source::fn'], [createEdge('source::fn', 'target::fn')]);
    const db = getDb();
    db.pragma('foreign_keys = OFF');
    db.prepare('DELETE FROM code_files WHERE id = ?').run(targetFileId);
    db.pragma('foreign_keys = ON');

    cleanupOrphans();
    // A second sweep is a no-op (nothing left to orphan) and must not add rows.
    const second = cleanupOrphans();
    expect(second).toBe(0);

    // Exactly one edge tombstone for source::fn->target::fn (no double-record
    // from overlapping recordDanglingEdgeTombstones + recordEdgeTombstonesForSymbols).
    const edgeRows = getDb().prepare(`
      SELECT COUNT(*) AS count FROM code_graph_tombstones
      WHERE entity_kind = 'edge' AND source_id = 'source::fn' AND target_id = 'target::fn'
        AND reason = 'cleanup_orphans'
    `).get() as { count: number };
    expect(edgeRows.count).toBe(1);
  });
});
