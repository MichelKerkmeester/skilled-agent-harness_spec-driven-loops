// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tombstone Audit Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
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
});
