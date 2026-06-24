// ───────────────────────────────────────────────────────────────
// MODULE: Code Edge Bitemporal Reindex Tests
// ───────────────────────────────────────────────────────────────
//
// These tests cover the reindex edge-replacement path (replaceEdges) under the
// bitemporal-reads flag. With the flag on, a reindex closes the superseded edge
// (stamps invalid_at) and inserts its replacement with valid_at open, so an
// as-of query can answer about a past generation. With the flag off, the path
// keeps deleting and re-inserting with the validity columns untouched.

import Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV,
  asOfEdgesFrom,
  bumpCodeGraphGeneration,
  closeDb,
  getCodeGraphGeneration,
  getDb,
  initDb,
  queryEdgesFrom,
  replaceEdges,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph-db.js';
import type { CodeEdge, CodeNode } from '../lib/indexer-types.js';

let tempDirs: string[] = [];
let originalFlag: string | undefined;

function createTempDir(label: string): string {
  const tempDir = mkdtempSync(join(tmpdir(), `code-edge-bitemporal-reindex-${label}-`));
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

function callsEdge(sourceId: string, targetId: string): CodeEdge {
  return { sourceId, targetId, edgeType: 'CALLS', weight: 1 };
}

function edgeRows(): Array<{ source_id: string; target_id: string; valid_at: number | null; invalid_at: number | null }> {
  return getDb()
    .prepare('SELECT source_id, target_id, valid_at, invalid_at FROM code_edges ORDER BY source_id, target_id, id')
    .all() as Array<{ source_id: string; target_id: string; valid_at: number | null; invalid_at: number | null }>;
}

function setGeneration(value: number): void {
  getDb()
    .prepare(`
      INSERT INTO code_graph_metadata (key, value, updated_at)
      VALUES ('graph_generation', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `)
    .run(String(value), new Date().toISOString());
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

describe('replaceEdges bitemporal reindex', () => {
  it('answers an as-of query at the past generation with the old target and current with the new', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    const dbDir = createTempDir('as-of');
    initDb(dbDir);

    const filePath = join(dbDir, 'a.ts');
    const fileId = upsertFile(filePath, 'typescript', 'file-hash', 3, 0, 'clean', 1, { fileMtimeMs: 0 });
    replaceNodes(fileId, [
      createNode('caller', filePath, 'caller'),
      createNode('target-old', filePath, 'targetOld'),
      createNode('target-new', filePath, 'targetNew'),
    ]);

    // Generation N: caller calls the old target.
    setGeneration(1);
    const generationN = getCodeGraphGeneration();
    expect(generationN).toBe(1);
    replaceEdges(['caller'], [callsEdge('caller', 'target-old')]);

    // Reindex at generation N+1: caller now calls the new target. The old edge
    // must be closed, not deleted, so the past generation stays readable.
    bumpCodeGraphGeneration();
    const generationNext = getCodeGraphGeneration();
    expect(generationNext).toBe(generationN + 1);
    replaceEdges(['caller'], [callsEdge('caller', 'target-new')]);

    const pastEdges = asOfEdgesFrom('caller', generationN);
    expect(pastEdges).toHaveLength(1);
    expect(pastEdges[0].edge.targetId).toBe('target-old');

    const currentEdges = asOfEdgesFrom('caller', generationNext);
    expect(currentEdges).toHaveLength(1);
    expect(currentEdges[0].edge.targetId).toBe('target-new');

    // Both generations of the edge are preserved on disk: the old one closed at
    // the reindex generation, the new one open.
    const rows = edgeRows();
    expect(rows).toEqual([
      { source_id: 'caller', target_id: 'target-new', valid_at: generationNext, invalid_at: null },
      { source_id: 'caller', target_id: 'target-old', valid_at: generationN, invalid_at: generationNext },
    ]);
  });

  it('keeps the live read pointed at the new target after the reindex', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    const dbDir = createTempDir('live-read');
    initDb(dbDir);

    const filePath = join(dbDir, 'a.ts');
    const fileId = upsertFile(filePath, 'typescript', 'file-hash', 3, 0, 'clean', 1, { fileMtimeMs: 0 });
    replaceNodes(fileId, [
      createNode('caller', filePath, 'caller'),
      createNode('target-old', filePath, 'targetOld'),
      createNode('target-new', filePath, 'targetNew'),
    ]);

    setGeneration(5);
    replaceEdges(['caller'], [callsEdge('caller', 'target-old')]);
    bumpCodeGraphGeneration();
    replaceEdges(['caller'], [callsEdge('caller', 'target-new')]);

    // The live (flag-on) read filters to the current generation and returns only
    // the open edge.
    const live = asOfEdgesFrom('caller', getCodeGraphGeneration());
    expect(live).toHaveLength(1);
    expect(live[0].edge.targetId).toBe('target-new');
  });
});

describe('replaceEdges byte-identity when the bitemporal flag is off', () => {
  function runReindexScenario(dbDir: string): Array<{ source_id: string; target_id: string; valid_at: number | null; invalid_at: number | null }> {
    initDb(dbDir);
    const filePath = join(dbDir, 'a.ts');
    const fileId = upsertFile(filePath, 'typescript', 'file-hash', 3, 0, 'clean', 1, { fileMtimeMs: 0 });
    replaceNodes(fileId, [
      createNode('caller', filePath, 'caller'),
      createNode('target-old', filePath, 'targetOld'),
      createNode('target-new', filePath, 'targetNew'),
    ]);
    setGeneration(7);
    replaceEdges(['caller'], [callsEdge('caller', 'target-old')]);
    bumpCodeGraphGeneration();
    replaceEdges(['caller'], [callsEdge('caller', 'target-new')]);
    return edgeRows();
  }

  it('deletes and re-inserts so only the new edge survives with null validity columns', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    const dbDir = createTempDir('off-path');

    const rows = runReindexScenario(dbDir);
    expect(rows).toEqual([
      { source_id: 'caller', target_id: 'target-new', valid_at: null, invalid_at: null },
    ]);

    // The off-path read ignores the validity columns and returns the live edge.
    const live = queryEdgesFrom('caller');
    expect(live).toHaveLength(1);
    expect(live[0].edge.targetId).toBe('target-new');
  });

  it('matches the explicit-false flag value byte-for-byte', () => {
    originalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];

    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    const undefinedDbDir = createTempDir('off-undefined');
    const undefinedRows = runReindexScenario(undefinedDbDir);
    closeDb();

    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'false';
    const falseDbDir = createTempDir('off-false');
    const falseRows = runReindexScenario(falseDbDir);

    expect(falseRows).toEqual(undefinedRows);
  });
});
