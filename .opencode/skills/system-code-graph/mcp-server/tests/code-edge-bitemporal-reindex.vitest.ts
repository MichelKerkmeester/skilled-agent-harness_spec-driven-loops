// ───────────────────────────────────────────────────────────────
// MODULE: Code Edge Bitemporal Reindex Tests
// ───────────────────────────────────────────────────────────────
//
// These tests cover the reindex edge-replacement path under the bitemporal-reads
// flag, driving the real scan handler twice so the production write ordering
// (replaceNodes, replaceEdges, generation bump, dangling prune) is exercised
// exactly as it runs in a live reindex. With the flag on, a reindex closes the
// superseded edge (stamps invalid_at) and inserts its replacement with valid_at
// open, so an as-of query at the genuine pre-reindex generation returns the old
// target while the live read returns only the open edge. With the flag off the
// path keeps deleting and re-inserting with the validity columns untouched.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV,
  asOfEdgesFrom,
  closeDb,
  getCodeGraphGeneration,
  getDb,
  initDb,
  queryEdgesFrom,
} from '../lib/code-graph-db.js';
import { handleCodeGraphScan } from '../handlers/scan.js';

const REVERSE_DEP_FORCE_PARSE_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';

interface Fixture {
  rootDir: string;
  workspaceDir: string;
  dbDir: string;
}

interface ScanPayload {
  status: 'ok' | 'blocked' | 'error';
  data: { filesIndexed: number; filesSkipped: number; errors: string[] };
}

interface ImportEdgeRow {
  sourceId: string;
  targetId: string;
  validAt: number | null;
  invalidAt: number | null;
}

let originalCwd = process.cwd();
let originalBitemporalFlag: string | undefined;
let originalForceParseFlag: string | undefined;

function createFixture(label: string): Fixture {
  const rootDir = mkdtempSync(join(tmpdir(), `code-edge-bitemporal-reindex-${label}-`));
  const workspaceDir = join(rootDir, 'workspace');
  const dbDir = join(rootDir, 'db');
  mkdirSync(workspaceDir, { recursive: true });
  mkdirSync(dbDir, { recursive: true });
  const canonicalWorkspaceDir = realpathSync(workspaceDir);
  const canonicalDbDir = realpathSync(dbDir);
  initDb(canonicalDbDir);
  process.chdir(canonicalWorkspaceDir);
  return { rootDir, workspaceDir: canonicalWorkspaceDir, dbDir: canonicalDbDir };
}

function writeWorkspaceFile(rootDir: string, relativePath: string, content: string): string {
  const filePath = join(rootDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

async function runScan(workspaceDir: string, incremental: boolean): Promise<ScanPayload['data']> {
  const response = await handleCodeGraphScan({ rootDir: workspaceDir, incremental });
  const payload = JSON.parse(response.content[0].text) as ScanPayload;
  expect(payload.status).toBe('ok');
  expect(payload.data.errors).toEqual([]);
  return payload.data;
}

// Read every IMPORTS edge whose source symbol lives in the importer file,
// including the validity columns and regardless of whether the edge is open or
// closed. The source symbol survives a reindex of the dependency, but a closed
// edge can point at a target node that was already removed, so this must not join
// on the target node or it would drop the very rows the close preserves.
function allImportEdgesFrom(filePath: string): ImportEdgeRow[] {
  return getDb()
    .prepare(`
      SELECT
        edge.source_id AS sourceId,
        edge.target_id AS targetId,
        edge.valid_at AS validAt,
        edge.invalid_at AS invalidAt
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      WHERE edge.edge_type = 'IMPORTS'
        AND source.file_path = ?
      ORDER BY edge.valid_at, edge.target_id
    `)
    .all(filePath) as ImportEdgeRow[];
}

function liveImportEdgesFrom(filePath: string): ImportEdgeRow[] {
  return allImportEdgesFrom(filePath).filter((row) => row.invalidAt === null);
}

afterEach(() => {
  process.chdir(originalCwd);
  closeDb();
  if (originalBitemporalFlag === undefined) {
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
  } else {
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = originalBitemporalFlag;
  }
  if (originalForceParseFlag === undefined) {
    delete process.env[REVERSE_DEP_FORCE_PARSE_ENV];
  } else {
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = originalForceParseFlag;
  }
});

const DEP_BEFORE = 'export function foo() { return 1; }\n';
const DEP_AFTER = 'export const foo = 1;\n';
const IMPORTER = "import { foo } from './b';\nexport const value = foo;\n";

describe('bitemporal reindex over the real scan path', () => {
  it('answers an as-of query at the genuine pre-reindex generation with the old target', async () => {
    originalBitemporalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    originalForceParseFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('as-of');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      const importerPath = writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);

      await runScan(fixture.workspaceDir, false);
      const before = allImportEdgesFrom(importerPath);
      expect(before).toHaveLength(1);
      const oldTargetId = before[0].targetId;
      const importerId = before[0].sourceId;
      // The genuine generation a consumer would name for the pre-reindex state is
      // the generation current after scan one, read from the live counter.
      const preReindexGeneration = getCodeGraphGeneration();

      // Refactor the dependency so foo flips function to const, changing its
      // symbol identity and forcing the importer edge to rebind on rescan.
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await runScan(fixture.workspaceDir, true);

      // The live read at the current generation points at the new target.
      const liveNow = liveImportEdgesFrom(importerPath);
      expect(liveNow).toHaveLength(1);
      const newTargetId = liveNow[0].targetId;
      expect(newTargetId).not.toBe(oldTargetId);

      // The as-of read at the pre-reindex generation returns the old target. This
      // is the assertion the earlier hand-bumped test could never satisfy: the
      // pre-reindex generation is the real post-scan-one counter value.
      const pastEdges = asOfEdgesFrom(importerId, preReindexGeneration, 'IMPORTS');
      expect(pastEdges).toHaveLength(1);
      expect(pastEdges[0].edge.targetId).toBe(oldTargetId);

      // The old edge is preserved on disk, closed strictly after its valid_at.
      const rows = allImportEdgesFrom(importerPath);
      const oldRow = rows.find((row) => row.targetId === oldTargetId);
      expect(oldRow).toBeDefined();
      expect(oldRow?.invalidAt).not.toBeNull();
      expect(oldRow!.invalidAt as number).toBeGreaterThan(oldRow!.validAt as number);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('live reads return only the open edge after the real reindex', async () => {
    originalBitemporalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    originalForceParseFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'true';
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('live-read');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      const importerPath = writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);

      await runScan(fixture.workspaceDir, false);
      const before = allImportEdgesFrom(importerPath);
      const oldTargetId = before[0].targetId;
      const importerId = before[0].sourceId;

      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await runScan(fixture.workspaceDir, true);

      // The closed edge still sits in the table after the reindex, so the import
      // source now has both a closed and an open IMPORTS edge.
      const allRows = allImportEdgesFrom(importerPath);
      expect(allRows.length).toBeGreaterThanOrEqual(2);

      // But the live reader returns exactly one edge, the open one, and never the
      // superseded target. This is the regression the earlier suite missed: the
      // live reader filtering closed edges out under the flag.
      const live = queryEdgesFrom(importerId, 'IMPORTS');
      expect(live).toHaveLength(1);
      expect(live[0].edge.targetId).not.toBe(oldTargetId);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});

describe('byte-identity when the bitemporal flag is off', () => {
  async function runReindexScenario(label: string): Promise<ImportEdgeRow[]> {
    const fixture = createFixture(label);
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      const importerPath = writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);
      await runScan(fixture.workspaceDir, false);
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await runScan(fixture.workspaceDir, true);
      return allImportEdgesFrom(importerPath);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
      closeDb();
    }
  }

  it('keeps only the live edge with null validity columns when the flag is off', async () => {
    originalBitemporalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    originalForceParseFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = 'true';

    const rows = await runReindexScenario('off-path');
    // No closed history accumulates: a delete-and-insert reindex leaves exactly
    // the live edge with untouched validity columns.
    expect(rows).toHaveLength(1);
    expect(rows[0].validAt).toBeNull();
    expect(rows[0].invalidAt).toBeNull();
  });

  it('matches the explicit-false flag value byte-for-byte', async () => {
    originalBitemporalFlag = process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    originalForceParseFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = 'true';

    delete process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV];
    const undefinedRows = await runReindexScenario('off-undefined');

    process.env[CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV] = 'false';
    const falseRows = await runReindexScenario('off-false');

    // Symbol ids embed a per-run temp path, so compare the stable shape: one row
    // with untouched validity columns on both off-path variants.
    const project = (rows: ImportEdgeRow[]) =>
      rows.map((row) => ({ validAt: row.validAt, invalidAt: row.invalidAt }));
    expect(project(falseRows)).toEqual(project(undefinedRows));
    expect(project(falseRows)).toEqual([{ validAt: null, invalidAt: null }]);
  });
});
