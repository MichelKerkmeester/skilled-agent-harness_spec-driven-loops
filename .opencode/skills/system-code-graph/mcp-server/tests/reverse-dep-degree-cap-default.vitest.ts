// ───────────────────────────────────────────────────────────────
// MODULE: Reverse-Dep Degree Cap Default Tests
// ───────────────────────────────────────────────────────────────
//
// The degree-cap default bounds the staleness-repair force-parse fan-out. It is
// read only inside the force-parse branch, which is gated on the force-parse
// flag. These tests prove that the default is inert while that flag is off: a
// symbol-identity-changing refactor leaves the inbound import edge stale (no
// importer is force-parsed), and the resulting edge state does not vary with the
// degree-cap env value.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
import { handleCodeGraphScan } from '../handlers/scan.js';

const REVERSE_DEP_FORCE_PARSE_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';
const REVERSE_DEP_DEGREE_CAP_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP';

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
  targetKind: string;
  targetName: string;
}

let originalCwd = process.cwd();
let originalForceParseFlag: string | undefined;
let originalDegreeCap: string | undefined;

function createFixture(label: string): Fixture {
  const rootDir = mkdtempSync(join(tmpdir(), `reverse-dep-degree-cap-${label}-`));
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
  return getDb()
    .prepare(`
      SELECT
        edge.source_id AS sourceId,
        edge.target_id AS targetId,
        target.kind AS targetKind,
        target.name AS targetName
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
      WHERE edge.edge_type = 'IMPORTS'
        AND source.file_path = ?
      ORDER BY edge.source_id, edge.target_id
    `)
    .all(filePath) as ImportEdgeRow[];
}

// Run the full refactor scenario with the force-parse flag OFF and return the
// importer's inbound import edge state after an incremental rescan.
async function runForceParseOffScenario(label: string): Promise<ImportEdgeRow[]> {
  const fixture = createFixture(label);
  try {
    writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export function foo() { return 1; }\n');
    const importerPath = writeWorkspaceFile(
      fixture.workspaceDir,
      'a.ts',
      "import { foo } from './b';\nexport const value = foo;\n",
    );
    await runScan(fixture.workspaceDir, false);

    // Refactor the dependency so its exported symbol identity flips. With the
    // force-parse flag off the importer is not rescanned, so its inbound edge
    // stays bound to the pre-refactor target.
    writeWorkspaceFile(fixture.workspaceDir, 'b.ts', 'export const foo = 1;\n');
    await runScan(fixture.workspaceDir, true);
    return importEdgesFrom(importerPath);
  } finally {
    rmSync(fixture.rootDir, { recursive: true, force: true });
    closeDb();
  }
}

afterEach(() => {
  process.chdir(originalCwd);
  closeDb();
  if (originalForceParseFlag === undefined) {
    delete process.env[REVERSE_DEP_FORCE_PARSE_ENV];
  } else {
    process.env[REVERSE_DEP_FORCE_PARSE_ENV] = originalForceParseFlag;
  }
  if (originalDegreeCap === undefined) {
    delete process.env[REVERSE_DEP_DEGREE_CAP_ENV];
  } else {
    process.env[REVERSE_DEP_DEGREE_CAP_ENV] = originalDegreeCap;
  }
});

describe('reverse-dep degree cap default is inert while force-parse is off', () => {
  it('leaves the importer edge stale when the force-parse flag is off', async () => {
    originalForceParseFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    originalDegreeCap = process.env[REVERSE_DEP_DEGREE_CAP_ENV];
    delete process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    delete process.env[REVERSE_DEP_DEGREE_CAP_ENV];

    const after = await runForceParseOffScenario('default');
    // The repair never runs, so the importer's inbound edge is not rebound.
    expect(after).toHaveLength(0);
  });

  it('produces identical edge state regardless of the degree-cap env value', async () => {
    originalForceParseFlag = process.env[REVERSE_DEP_FORCE_PARSE_ENV];
    originalDegreeCap = process.env[REVERSE_DEP_DEGREE_CAP_ENV];
    delete process.env[REVERSE_DEP_FORCE_PARSE_ENV];

    // Default (env unset -> the compiled default cap).
    delete process.env[REVERSE_DEP_DEGREE_CAP_ENV];
    const defaultRows = await runForceParseOffScenario('cap-default');

    // Explicit uncapped (0).
    process.env[REVERSE_DEP_DEGREE_CAP_ENV] = '0';
    const uncappedRows = await runForceParseOffScenario('cap-zero');

    // Explicit small cap (5).
    process.env[REVERSE_DEP_DEGREE_CAP_ENV] = '5';
    const smallCapRows = await runForceParseOffScenario('cap-five');

    // The degree cap is unreachable while force-parse is off, so the value never
    // changes the outcome.
    expect(uncappedRows).toEqual(defaultRows);
    expect(smallCapRows).toEqual(defaultRows);
  });
});
