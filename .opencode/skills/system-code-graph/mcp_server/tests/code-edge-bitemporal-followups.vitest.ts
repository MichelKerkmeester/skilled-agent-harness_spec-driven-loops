// ───────────────────────────────────────────────────────────────
// MODULE: Code Edge Bitemporal Follow-Up Tests
// ───────────────────────────────────────────────────────────────
//
// Covers three follow-ups on the bitemporal path, all gated on the
// bitemporal-reads flag:
//   1. The ensure-ready auto-index path bumps the generation under the flag, so
//      two consecutive ensure-ready reindexes write at distinct generations and
//      a superseded edge gets a non-empty as-of window.
//   2. SUPERSEDES lineage edges carry valid_at under the flag, so they are
//      visible to an as-of read instead of being silently excluded.
//   3. code_graph_query accepts an asOf generation that routes the relationship
//      reads through the as-of readers, returning the old target while the
//      default query returns the new one.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV,
  asOfEdgesFrom,
  bumpCodeGraphGeneration,
  closeDb,
  getCodeGraphGeneration,
  getDb,
  initDb,
  replaceNodes,
  upsertFile,
} from '../lib/code-graph-db.js';
import { ensureCodeGraphReady } from '../lib/ensure-ready.js';
import { handleCodeGraphScan } from '../handlers/scan.js';
import { handleCodeGraphQuery } from '../handlers/query.js';
import type { CodeNode } from '../lib/indexer-types.js';

const BITEMPORAL_ENV = CODE_GRAPH_EDGE_BITEMPORAL_READS_ENV;
const FORCE_PARSE_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';
const TOMBSTONES_ENV = 'SPECKIT_CODE_GRAPH_TOMBSTONES';

interface Fixture {
  rootDir: string;
  workspaceDir: string;
  dbDir: string;
}

let originalCwd = process.cwd();
let savedBitemporal: string | undefined;
let savedForceParse: string | undefined;
let savedTombstones: string | undefined;

function snapshotEnv(): void {
  savedBitemporal = process.env[BITEMPORAL_ENV];
  savedForceParse = process.env[FORCE_PARSE_ENV];
  savedTombstones = process.env[TOMBSTONES_ENV];
}

function restoreEnv(name: string, saved: string | undefined): void {
  if (saved === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = saved;
  }
}

function createFixture(label: string): Fixture {
  const rootDir = mkdtempSync(join(tmpdir(), `code-edge-bitemporal-followups-${label}-`));
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

function importerEdgeRows(filePath: string): Array<{ targetId: string; validAt: number | null; invalidAt: number | null }> {
  return getDb()
    .prepare(`
      SELECT edge.target_id AS targetId, edge.valid_at AS validAt, edge.invalid_at AS invalidAt
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      WHERE edge.edge_type = 'IMPORTS' AND source.file_path = ?
      ORDER BY edge.valid_at, edge.target_id
    `)
    .all(filePath) as Array<{ targetId: string; validAt: number | null; invalidAt: number | null }>;
}

function importerSourceId(filePath: string): string {
  const row = getDb()
    .prepare(`
      SELECT edge.source_id AS sourceId
      FROM code_edges edge
      INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
      WHERE edge.edge_type = 'IMPORTS' AND source.file_path = ?
      ORDER BY edge.valid_at
      LIMIT 1
    `)
    .get(filePath) as { sourceId: string } | undefined;
  if (!row) {
    throw new Error('expected an importer edge');
  }
  return row.sourceId;
}

const DEP_BEFORE = 'export function foo() { return 1; }\n';
const DEP_AFTER = 'export const foo = 1;\n';
const IMPORTER = "import { foo } from './b';\nexport const value = foo;\n";

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
  restoreEnv(BITEMPORAL_ENV, savedBitemporal);
  restoreEnv(FORCE_PARSE_ENV, savedForceParse);
  restoreEnv(TOMBSTONES_ENV, savedTombstones);
});

describe('ensure-ready path bumps the generation under the flag', () => {
  it('gives a superseded edge a non-empty as-of window across two ensure-ready reindexes', async () => {
    snapshotEnv();
    process.env[BITEMPORAL_ENV] = 'true';
    process.env[FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('ensure-ready');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      const importerPath = writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);

      // Seed via the scan handler, then capture the pre-reindex generation.
      await handleCodeGraphScan({ rootDir: fixture.workspaceDir, incremental: false });
      const before = importerEdgeRows(importerPath);
      expect(before).toHaveLength(1);
      const oldTargetId = before[0].targetId;
      const importerId = importerSourceId(importerPath);
      const preReindexGeneration = getCodeGraphGeneration();

      // Refactor and reindex through the ensure-ready auto-index path, not the
      // scan handler. Without the ensure-ready bump the close would collapse to a
      // zero-width window.
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await ensureCodeGraphReady(fixture.workspaceDir, {
        allowInlineIndex: true,
        allowInlineFullScan: true,
        allowGuardedInlineFullScan: true,
      });

      // The generation advanced on the ensure-ready path.
      expect(getCodeGraphGeneration()).toBeGreaterThan(preReindexGeneration);

      // The old target is readable at the pre-reindex generation.
      const past = asOfEdgesFrom(importerId, preReindexGeneration, 'IMPORTS');
      expect(past).toHaveLength(1);
      expect(past[0].edge.targetId).toBe(oldTargetId);

      // The old edge has a non-empty window, closed strictly after its valid_at.
      const rows = importerEdgeRows(importerPath);
      const oldRow = rows.find((row) => row.targetId === oldTargetId);
      expect(oldRow).toBeDefined();
      expect(oldRow!.invalidAt as number).toBeGreaterThan(oldRow!.validAt as number);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('does not bump the generation on the ensure-ready path when the flag is off', async () => {
    snapshotEnv();
    delete process.env[BITEMPORAL_ENV];
    process.env[FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('ensure-ready-off');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);
      await handleCodeGraphScan({ rootDir: fixture.workspaceDir, incremental: false });
      const generationBefore = getCodeGraphGeneration();

      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await ensureCodeGraphReady(fixture.workspaceDir, {
        allowInlineIndex: true,
        allowInlineFullScan: true,
        allowGuardedInlineFullScan: true,
      });

      // With the flag off the ensure-ready path leaves the generation untouched,
      // byte-identical to the prior behavior.
      expect(getCodeGraphGeneration()).toBe(generationBefore);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});

describe('SUPERSEDES lineage edges carry validity under the flag', () => {
  // A SUPERSEDES lineage edge is created when a symbol id changes while the
  // content hash stays stable, so the two replaceNodes calls below share a
  // content hash and differ only in symbol id, the deterministic lineage trigger.
  it('makes a lineage edge visible to an as-of read', () => {
    snapshotEnv();
    process.env[BITEMPORAL_ENV] = 'true';
    process.env[TOMBSTONES_ENV] = 'true';
    const fixture = createFixture('lineage-on');
    try {
      const filePath = join(fixture.workspaceDir, 'lineage.ts');
      const fileId = upsertFile(filePath, 'typescript', 'file-hash', 1, 0, 'clean', 1, { fileMtimeMs: 0 });
      replaceNodes(fileId, [createNode('old-symbol', filePath, 'oldName', 'stable-content')]);
      replaceNodes(fileId, [createNode('new-symbol', filePath, 'newName', 'stable-content')]);
      // The lineage write stamps valid_at at the next generation, mirroring the
      // scan loop. Bump so the current generation reaches that window, as a real
      // scan would after its persist loop.
      bumpCodeGraphGeneration();

      const lineage = getDb()
        .prepare(`SELECT source_id, target_id, valid_at, invalid_at FROM code_edges WHERE edge_type = 'SUPERSEDES'`)
        .all() as Array<{ source_id: string; target_id: string; valid_at: number | null; invalid_at: number | null }>;
      expect(lineage.length).toBeGreaterThanOrEqual(1);
      const edge = lineage[0];
      // The lineage edge has a valid_at, so an as-of read at the current
      // generation surfaces it instead of dropping it for a NULL valid_at.
      expect(edge.valid_at).not.toBeNull();
      const asOf = asOfEdgesFrom(edge.source_id, getCodeGraphGeneration(), 'SUPERSEDES');
      expect(asOf.map((entry) => entry.edge.targetId)).toContain(edge.target_id);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('leaves lineage edges with NULL validity when the flag is off', () => {
    snapshotEnv();
    delete process.env[BITEMPORAL_ENV];
    process.env[TOMBSTONES_ENV] = 'true';
    const fixture = createFixture('lineage-off');
    try {
      const filePath = join(fixture.workspaceDir, 'lineage.ts');
      const fileId = upsertFile(filePath, 'typescript', 'file-hash', 1, 0, 'clean', 1, { fileMtimeMs: 0 });
      replaceNodes(fileId, [createNode('old-symbol', filePath, 'oldName', 'stable-content')]);
      replaceNodes(fileId, [createNode('new-symbol', filePath, 'newName', 'stable-content')]);

      const lineage = getDb()
        .prepare(`SELECT valid_at, invalid_at FROM code_edges WHERE edge_type = 'SUPERSEDES'`)
        .all() as Array<{ valid_at: number | null; invalid_at: number | null }>;
      expect(lineage.length).toBeGreaterThanOrEqual(1);
      // Byte-identical to the prior write: NULL validity columns.
      for (const edge of lineage) {
        expect(edge.valid_at).toBeNull();
        expect(edge.invalid_at).toBeNull();
      }
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});

describe('code_graph_query asOf parameter exposes preserved history', () => {
  async function parsePayload(args: Parameters<typeof handleCodeGraphQuery>[0]) {
    const response = await handleCodeGraphQuery(args);
    return JSON.parse(response.content[0].text);
  }

  it('returns the old target at the pre-reindex generation and the new target by default', async () => {
    snapshotEnv();
    process.env[BITEMPORAL_ENV] = 'true';
    process.env[FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('query-asof');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      const importerPath = writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);

      await handleCodeGraphScan({ rootDir: fixture.workspaceDir, incremental: false });
      const importerId = importerSourceId(importerPath);
      const preReindexGeneration = getCodeGraphGeneration();

      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await handleCodeGraphScan({ rootDir: fixture.workspaceDir, incremental: true });

      // Default query (no asOf) returns the live target (the new const foo).
      const live = await parsePayload({ operation: 'imports_from', subject: importerId });
      const liveTargets = (live.data?.edges ?? []).map((e: { target?: string }) => e.target);

      // As-of query at the pre-reindex generation returns the old target.
      const past = await parsePayload({ operation: 'imports_from', subject: importerId, asOf: preReindexGeneration });
      const pastEdges = past.data?.edges ?? [];
      expect(pastEdges.length).toBeGreaterThanOrEqual(1);

      // The two reads disagree: the as-of read surfaces a target the live read
      // does not, which is the preserved history becoming consumable.
      const pastTargets = pastEdges.map((e: { target?: string }) => e.target);
      expect(pastTargets.some((t: string) => !liveTargets.includes(t))).toBe(true);
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });

  it('ignores asOf when the flag is off, matching the default live query', async () => {
    snapshotEnv();
    delete process.env[BITEMPORAL_ENV];
    process.env[FORCE_PARSE_ENV] = 'true';
    const fixture = createFixture('query-asof-off');
    try {
      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_BEFORE);
      const importerPath = writeWorkspaceFile(fixture.workspaceDir, 'a.ts', IMPORTER);

      await handleCodeGraphScan({ rootDir: fixture.workspaceDir, incremental: false });
      const importerId = importerSourceId(importerPath);
      const preReindexGeneration = getCodeGraphGeneration();

      writeWorkspaceFile(fixture.workspaceDir, 'b.ts', DEP_AFTER);
      await handleCodeGraphScan({ rootDir: fixture.workspaceDir, incremental: true });

      const live = await parsePayload({ operation: 'imports_from', subject: importerId });
      const past = await parsePayload({ operation: 'imports_from', subject: importerId, asOf: preReindexGeneration });

      // With the flag off the as-of reader falls back to the live reader, so the
      // asOf request matches the default query.
      const project = (payload: { data?: { edges?: Array<{ target?: string }> } }) =>
        (payload.data?.edges ?? []).map((e) => e.target).sort();
      expect(project(past)).toEqual(project(live));
    } finally {
      rmSync(fixture.rootDir, { recursive: true, force: true });
    }
  });
});
