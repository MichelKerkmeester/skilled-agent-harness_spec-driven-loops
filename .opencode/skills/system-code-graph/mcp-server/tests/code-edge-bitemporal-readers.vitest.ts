// ───────────────────────────────────────────────────────────────
// MODULE: Code Edge Bitemporal Live-Reader Tests
// ───────────────────────────────────────────────────────────────
//
// Focused unit coverage for the live readers and the close-not-delete edge
// removers under the bitemporal-reads flag. queryEdgesFrom and queryEdgesTo must
// drop closed edges when the flag is on, and replaceNodes and pruneDanglingEdges
// must close instead of delete. With the flag off all four behave exactly as
// before, with the validity columns untouched.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV,
  closeDb,
  getDb,
  initDb,
  pruneDanglingEdges,
  queryEdgesFrom,
  queryEdgesTo,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph-db.js';
import type { CodeNode } from '../lib/indexer-types.js';

let tempDirs: string[] = [];
let originalFlag: string | undefined;

function createTempDir(label: string): string {
  const tempDir = mkdtempSync(join(tmpdir(), `code-edge-bitemporal-readers-${label}-`));
  tempDirs.push(tempDir);
  return tempDir;
}

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
    contentHash: `${symbolId}-hash`,
  };
}

// Insert a CALLS edge directly with explicit validity columns so a test can model
// an already-closed edge without driving a whole reindex.
function insertEdge(sourceId: string, targetId: string, validAt: number | null, invalidAt: number | null): void {
  getDb()
    .prepare(`
      INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata, valid_at, invalid_at)
      VALUES (?, ?, 'CALLS', 1, NULL, ?, ?)
    `)
    .run(sourceId, targetId, validAt, invalidAt);
}

function edgeRows(): Array<{ source_id: string; target_id: string; valid_at: number | null; invalid_at: number | null }> {
  return getDb()
    .prepare('SELECT source_id, target_id, valid_at, invalid_at FROM code_edges ORDER BY source_id, target_id, id')
    .all() as Array<{ source_id: string; target_id: string; valid_at: number | null; invalid_at: number | null }>;
}

function seedNodes(dbDir: string): string {
  const filePath = join(dbDir, 'a.ts');
  const fileId = upsertFile(filePath, 'typescript', 'file-hash', 3, 0, 'clean', 1, { fileMtimeMs: 0 });
  replaceNodes(fileId, [
    createNode('caller', filePath, 'caller'),
    createNode('target-old', filePath, 'targetOld'),
    createNode('target-new', filePath, 'targetNew'),
  ]);
  return filePath;
}

afterEach(() => {
  closeDb();
  for (const tempDir of tempDirs) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  tempDirs = [];
  if (originalFlag === undefined) {
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
  } else {
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = originalFlag;
  }
});

describe('live readers drop closed edges when the flag is on', () => {
  it('queryEdgesFrom returns only the open edge', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    const dbDir = createTempDir('from-on');
    initDb(dbDir);
    seedNodes(dbDir);

    insertEdge('caller', 'target-old', 1, 2);
    insertEdge('caller', 'target-new', 2, null);

    const live = queryEdgesFrom('caller');
    expect(live).toHaveLength(1);
    expect(live[0].edge.targetId).toBe('target-new');
  });

  it('queryEdgesTo returns only the open inbound edge', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    const dbDir = createTempDir('to-on');
    initDb(dbDir);
    seedNodes(dbDir);

    insertEdge('caller', 'target-new', 2, null);
    insertEdge('target-old', 'target-new', 1, 2);

    const inbound = queryEdgesTo('target-new');
    expect(inbound).toHaveLength(1);
    expect(inbound[0].edge.sourceId).toBe('caller');
  });

  it('returns both edges when the flag is off, byte-identical to the pre-change reader', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    const dbDir = createTempDir('from-off');
    initDb(dbDir);
    seedNodes(dbDir);

    insertEdge('caller', 'target-old', 1, 2);
    insertEdge('caller', 'target-new', 2, null);

    // With the flag off the reader has no validity filter, so it surfaces both
    // rows exactly as a pre-bitemporal reader would.
    const all = queryEdgesFrom('caller');
    expect(all.map((result) => result.edge.targetId).sort()).toEqual(['target-new', 'target-old']);
  });
});

describe('replaceNodes closes edges instead of deleting under the flag', () => {
  it('preserves the inbound edge to a removed symbol as a closed row', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    const dbDir = createTempDir('replace-nodes-on');
    initDb(dbDir);
    const filePath = seedNodes(dbDir);
    const fileId = getDb().prepare('SELECT id FROM code_files WHERE file_path = ?').get(filePath) as { id: number };

    insertEdge('caller', 'target-old', 1, null);

    // Re-replace the file's nodes dropping target-old. Under the flag the edge is
    // closed, not deleted, so the row survives with an invalid_at stamp.
    replaceNodes(fileId.id, [
      createNode('caller', filePath, 'caller'),
      createNode('target-new', filePath, 'targetNew'),
    ]);

    const rows = edgeRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ source_id: 'caller', target_id: 'target-old' });
    expect(rows[0].invalid_at).not.toBeNull();
  });

  it('hard-deletes the edge when the flag is off', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    const dbDir = createTempDir('replace-nodes-off');
    initDb(dbDir);
    const filePath = seedNodes(dbDir);
    const fileId = getDb().prepare('SELECT id FROM code_files WHERE file_path = ?').get(filePath) as { id: number };

    insertEdge('caller', 'target-old', 1, null);

    replaceNodes(fileId.id, [
      createNode('caller', filePath, 'caller'),
      createNode('target-new', filePath, 'targetNew'),
    ]);

    expect(edgeRows()).toHaveLength(0);
  });
});

describe('pruneDanglingEdges closes danglers instead of deleting under the flag', () => {
  it('closes the dangling edge when the flag is on', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    const dbDir = createTempDir('prune-on');
    initDb(dbDir);
    seedNodes(dbDir);

    // ghost-target has no code_nodes row, so this edge is dangling.
    insertEdge('caller', 'ghost-target', 1, null);

    const changed = pruneDanglingEdges();
    expect(changed).toBe(1);
    const rows = edgeRows();
    expect(rows).toHaveLength(1);
    expect(rows[0].invalid_at).not.toBeNull();
  });

  it('deletes the dangling edge when the flag is off', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    const dbDir = createTempDir('prune-off');
    initDb(dbDir);
    seedNodes(dbDir);

    insertEdge('caller', 'ghost-target', 1, null);

    const changed = pruneDanglingEdges();
    expect(changed).toBe(1);
    expect(edgeRows()).toHaveLength(0);
  });
});
