// ───────────────────────────────────────────────────────────────
// MODULE: Edge Staleness Correctness Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import {
  closeDb,
  getDb,
  getTombstoneSummary,
  initDb,
  queryEdgesFrom,
  queryEdgesTo,
  queryImportersOf,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph-db.js';
import { parseFile } from '../lib/structural-indexer.js';
import { handleCodeGraphScan } from '../handlers/scan.js';
import type { CodeNode } from '../lib/indexer-types.js';

const REVERSE_DEP_FORCE_PARSE_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';
const TOMBSTONES_ENV = 'SPECKIT_CODE_GRAPH_TOMBSTONES';

interface Fixture {
  rootDir: string;
  workspaceDir: string;
  dbDir: string;
}

interface ScanPayload {
  status: 'ok' | 'blocked' | 'error';
  data: {
    filesIndexed: number;
    filesSkipped: number;
    errors: string[];
  };
}

interface ImportEdgeRow {
  sourceId: string;
  targetId: string;
  targetKind: string;
  targetName: string;
  sourceFilePath: string;
  targetFilePath: string;
}

let originalCwd = process.cwd();
let originalReverseDepFlag: string | undefined;
let originalTombstonesFlag: string | undefined;

function createFixture(label: string): Fixture {
  const rootDir = mkdtempSync(join(tmpdir(), `code-graph-edge-staleness-${label}-`));
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

function importEdgesFrom(filePath: string): ImportEdgeRow[] {
  return getDb().prepare(`
    SELECT
      edge.source_id AS sourceId,
      edge.target_id AS targetId,
      target.kind AS targetKind,
      target.name AS targetName,
      source.file_path AS sourceFilePath,
      target.file_path AS targetFilePath
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE edge.edge_type = 'IMPORTS'
      AND source.file_path = ?
    ORDER BY edge.source_id, edge.target_id
  `).all(filePath) as ImportEdgeRow[];
}

function createNode(symbolId: string, filePath: string, name: string, contentHash: string): CodeNode {
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
    contentHash,
  };
}

afterEach(() => {
  process.chdir(originalCwd);
  closeDb();
  if (originalReverseDepFlag === undefined) {
    delete process.env[REVERSE_DEP_FORCE_PARSE_ENV];
  } else {
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = originalReverseDepFlag;
  }
  if (originalTombstonesFlag === undefined) {
    delete process.env[TOMBSTONES_ENV];
  } else {
    process.env[TOMBSTONES_ENV] = originalTombstonesFlag;
  }
});

describe('incremental edge staleness repair', () => {
  it('force-parses importers when a dependency refactor changes symbol identity', async () => {
    originalReverseDepFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('kind-flip');
    try {
      const depPath = writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export function foo() { return 1; }\n');
      const importerPath = writeWorkspaceFile(
        fixture.workspaceDir,
        'a.ts',
        "import { foo } from './b';\nexport const value = foo;\n",
      );

      await runScan(fixture.workspaceDir, false);
      const before = importEdgesFrom(importerPath);
      expect(before).toHaveLength(1);
      expect(before[0].targetKind).toBe('function');

      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export const foo = 1;\n');
      const incremental = await runScan(fixture.workspaceDir, true);
      const after = importEdgesFrom(importerPath);

      expect(incremental.filesIndexed).toBe(2);
      expect(after).toHaveLength(1);
      expect(after[0].targetKind).toBe('variable');
      expect(after[0].targetName).toBe('foo');
      expect(after[0].targetId).not.toBe(before[0].targetId);
      expect(relative(fixture.workspaceDir, after[0].targetFilePath)).toBe('b.ts');
      expect(queryImportersOf([depPath])).toEqual([{
        importedFilePath: depPath,
        importerFilePath: importerPath,
      }]);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('preserves inbound import edges without force-parsing importers on body-only edits', async () => {
    originalReverseDepFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('body-edit');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export function foo() { return 1; }\n');
      const importerPath = writeWorkspaceFile(
        fixture.workspaceDir,
        'a.ts',
        "import { foo } from './b';\nexport const value = foo;\n",
      );

      await runScan(fixture.workspaceDir, false);
      const before = importEdgesFrom(importerPath);
      expect(before).toHaveLength(1);

      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export function foo() { return 2; }\n');
      const incremental = await runScan(fixture.workspaceDir, true);
      const after = importEdgesFrom(importerPath);

      expect(incremental.filesIndexed).toBe(1);
      expect(incremental.filesSkipped).toBe(1);
      expect(after).toEqual(before);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('shows why reverse importers must be captured before node replacement', async () => {
    const fixture = createFixture('ordering');
    try {
      const depPath = writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export function foo() { return 1; }\n');
      const importerPath = writeWorkspaceFile(
        fixture.workspaceDir,
        'a.ts',
        "import { foo } from './b';\nexport const value = foo;\n",
      );

      await runScan(fixture.workspaceDir, false);
      expect(queryImportersOf([depPath])).toEqual([{
        importedFilePath: depPath,
        importerFilePath: importerPath,
      }]);

      const fileRow = getDb().prepare('SELECT id FROM code_files WHERE file_path = ?').get(depPath) as { id: number };
      const parsed = await parseFile(depPath, 'export const foo = 1;\n', 'typescript');
      replaceNodes(fileRow.id, parsed.nodes);

      expect(queryImportersOf([depPath])).toEqual([]);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});

describe('supersedes lineage', () => {
  it('records same-content symbol lineage when tombstones are enabled', () => {
    originalTombstonesFlag = process.env[TOMBSTONES_ENV];
    process.env[TOMBSTONES_ENV] = 'true';
    const fixture = createFixture('supersedes');
    try {
      const filePath = join(fixture.workspaceDir, 'lineage.ts');
      const fileId = upsertFile(filePath, 'typescript', 'file-hash', 1, 0, 'clean', 1, { fileMtimeMs: 0 });
      const oldNode = createNode('old-symbol', filePath, 'oldName', 'stable-content');
      const newNode = createNode('new-symbol', filePath, 'newName', 'stable-content');

      replaceNodes(fileId, [oldNode]);
      replaceNodes(fileId, [newNode]);

      const lineageEdges = queryEdgesTo('new-symbol', 'SUPERSEDES');
      const outgoingLineageEdges = queryEdgesFrom('old-symbol', 'SUPERSEDES');
      expect(lineageEdges).toHaveLength(1);
      expect(lineageEdges[0].edge).toMatchObject({
        sourceId: 'old-symbol',
        targetId: 'new-symbol',
        edgeType: 'SUPERSEDES',
      });
      expect(lineageEdges[0].sourceNode).toBeNull();
      expect(outgoingLineageEdges).toHaveLength(1);
      expect(outgoingLineageEdges[0].targetNode?.symbolId).toBe('new-symbol');

      const summary = getTombstoneSummary();
      expect(summary.byReason.symbol_supersedes).toBe(1);
      expect(summary.recent).toEqual(expect.arrayContaining([
        expect.objectContaining({
          entityKind: 'edge',
          sourceId: 'old-symbol',
          targetId: 'new-symbol',
          edgeType: 'SUPERSEDES',
          reason: 'symbol_supersedes',
        }),
      ]));
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('keeps default tombstone-off replacement free of supersedes edges', () => {
    originalTombstonesFlag = process.env[TOMBSTONES_ENV];
    delete process.env[TOMBSTONES_ENV];
    const fixture = createFixture('supersedes-off');
    try {
      const filePath = join(fixture.workspaceDir, 'lineage.ts');
      const fileId = upsertFile(filePath, 'typescript', 'file-hash', 1, 0, 'clean', 1, { fileMtimeMs: 0 });

      replaceNodes(fileId, [createNode('old-symbol', filePath, 'oldName', 'stable-content')]);
      replaceNodes(fileId, [createNode('new-symbol', filePath, 'newName', 'stable-content')]);

      expect(queryEdgesTo('new-symbol', 'SUPERSEDES')).toEqual([]);
      expect(getTombstoneSummary()).toEqual({
        enabled: false,
        retentionLimit: 0,
        retainedRows: 0,
        byKind: {},
        byReason: {},
        recent: [],
      });
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});
