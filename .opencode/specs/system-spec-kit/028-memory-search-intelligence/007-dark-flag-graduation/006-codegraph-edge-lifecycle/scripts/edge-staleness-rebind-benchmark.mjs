#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Code-Graph Edge-Staleness Rebind Benchmark
// Usage:
//   node edge-staleness-rebind-benchmark.mjs
//
// Measures whether the reverse-dependency force-parse repair correctly rebinds
// cross-file edges after a dependency symbol identity changes (rename, kind-flip
// or move) while the importer file content stays byte-identical. The repair is
// gated behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE and ships default-off.
// This is the fan-in re-parse benchmark the staleness work was explicitly gated
// on before any default-on decision.
//
// Why importer-unchanged is the discriminating case:
//   When a rename also edits the importer text (the importer now references the
//   new name), the importer is independently stale by its own content hash and
//   gets re-parsed with or without the flag, so the scenario cannot tell the
//   repair apart from the ordinary incremental scan. The flag only changes
//   behavior when the importer file is byte-identical and only its dependency's
//   symbol identity shifted. Each labeled case below keeps the importer fixed
//   and mutates only the dependency, so a rebind under the flag and a stale edge
//   without it are both observable.
//
// What is measured per case:
//   - rebound: with the flag ON, the cross-file edge points at the new symbol id
//     (correct rebind), proven by the edge target name, kind and a changed
//     symbol id versus the baseline edge.
//   - staleOff: with the flag OFF, the importer is skipped as fresh and the edge
//     is left stale (no live rebind), so the case discriminates.
//   - discriminates: rebound AND staleOff, i.e. the repair is the thing that
//     makes the rebind happen.
//
// Safety:
//   The live code-graph.sqlite is never opened. Every case builds a fresh
//   throwaway workspace and a fresh throwaway SQLite database under the OS temp
//   directory, indexes it with the real production handler and lib, asserts, and
//   deletes the temp tree. The production graph is read-only by construction
//   because it is never referenced.
//
// It never changes a default and never decides whether the flag graduates. It
// only produces measurements and writes them to results/staleness-metrics.json.
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync, realpathSync } from 'node:fs';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(HERE, '..');
const RESULTS_DIR = path.join(BENCH_ROOT, 'results');

const MCP_SERVER = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server';
const FLAG = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';

const { handleCodeGraphScan } = await import(join(MCP_SERVER, 'dist/handlers/scan.js'));
const graphDb = await import(join(MCP_SERVER, 'dist/lib/code-graph-db.js'));

function makeFixture(label) {
  const root = mkdtempSync(join(tmpdir(), `edge-staleness-${label}-`));
  const workspace = join(root, 'workspace');
  const dbDir = join(root, 'db');
  mkdirSync(workspace, { recursive: true });
  mkdirSync(dbDir, { recursive: true });
  const canonicalWorkspace = realpathSync(workspace);
  const canonicalDbDir = realpathSync(dbDir);
  graphDb.initDb(canonicalDbDir);
  process.chdir(canonicalWorkspace);
  return { root, workspace: canonicalWorkspace };
}

function writeFile(root, relativePath, content) {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

async function scan(workspace, incremental) {
  const response = await handleCodeGraphScan({ rootDir: workspace, incremental });
  return JSON.parse(response.content[0].text);
}

function crossFileEdges(importerFile, edgeType) {
  return graphDb.getDb().prepare(`
    SELECT
      t.name AS targetName,
      t.kind AS targetKind,
      e.target_id AS targetId,
      t.file_path AS targetFile
    FROM code_edges e
    INNER JOIN code_nodes s ON s.symbol_id = e.source_id
    INNER JOIN code_nodes t ON t.symbol_id = e.target_id
    WHERE e.edge_type = ?
      AND s.file_path = ?
      AND s.file_path != t.file_path
    ORDER BY t.name, e.target_id
  `).all(edgeType, importerFile);
}

// Each case carries the labeled before and after dependency content, the stable
// importer content, the expected target name, the expected target kind, and the
// cross-file edge type whose rebind is scored.
const CASES = [
  {
    id: 'rename-function',
    label: 'pure rename of an imported function',
    edgeType: 'IMPORTS',
    depBefore: 'export function getThing() { return 1; }\n',
    depAfter: 'export function getThingV2() { return 1; }\n',
    importerName: 'app.ts',
    importerBefore: "import { getThing } from './dep';\nexport const value = getThing;\n",
    importerAfter: "import { getThingV2 } from './dep';\nexport const value = getThingV2;\n",
    importerChanges: true,
    expectName: 'getThingV2',
    expectKind: 'function',
  },
  {
    id: 'kind-flip',
    label: 'imported symbol changes kind, importer unchanged',
    edgeType: 'IMPORTS',
    depBefore: 'export function foo() { return 1; }\n',
    depAfter: 'export const foo = 1;\n',
    importerName: 'app.ts',
    importerBefore: "import { foo } from './dep';\nexport const value = foo;\n",
    importerAfter: "import { foo } from './dep';\nexport const value = foo;\n",
    importerChanges: false,
    expectName: 'foo',
    expectKind: 'variable',
  },
  {
    id: 'move-file',
    label: 'imported function moves to a new file, importer re-pointed',
    edgeType: 'IMPORTS',
    depBefore: 'export function moved() { return 1; }\n',
    depAfter: '',
    moveTo: 'relocated.ts',
    moveContent: 'export function moved() { return 1; }\n',
    importerName: 'app.ts',
    importerBefore: "import { moved } from './dep';\nexport const value = moved;\n",
    importerAfter: "import { moved } from './relocated';\nexport const value = moved;\n",
    importerChanges: true,
    expectName: 'moved',
    expectKind: 'function',
  },
];

async function runCase(testCase, flagOn) {
  const original = process.env[FLAG];
  if (flagOn) {
    process.env[FLAG] = 'true';
  } else {
    delete process.env[FLAG];
  }
  const fixture = makeFixture(`${testCase.id}-${flagOn ? 'on' : 'off'}`);
  try {
    const depPath = writeFile(fixture.workspace, 'dep.ts', testCase.depBefore);
    const importerPath = writeFile(fixture.workspace, testCase.importerName, testCase.importerBefore);
    await scan(fixture.workspace, false);
    const before = crossFileEdges(importerPath, testCase.edgeType);

    // Mutate the dependency. For a move the symbol leaves dep.ts for moveTo.
    writeFile(fixture.workspace, 'dep.ts', testCase.depAfter);
    if (testCase.moveTo) {
      writeFile(fixture.workspace, testCase.moveTo, testCase.moveContent);
    }
    // The importer text only changes for cases where a real edit accompanies the
    // refactor. The kind-flip keeps the importer byte-identical so it isolates
    // the force-parse path.
    if (testCase.importerChanges) {
      writeFile(fixture.workspace, testCase.importerName, testCase.importerAfter);
    }

    const incremental = await scan(fixture.workspace, true);
    const after = crossFileEdges(importerPath, testCase.edgeType);

    const baseline = before.find((edge) => edge.targetName === testCase.importerBeforeName)
      ?? before[0]
      ?? null;
    const target = after.find((edge) => edge.targetName === testCase.expectName) ?? null;

    const reboundCorrect = Boolean(
      target
      && target.targetKind === testCase.expectKind
      && (!baseline || target.targetId !== baseline.targetId),
    );

    return {
      flag: flagOn ? 'on' : 'off',
      filesIndexed: incremental.data.filesIndexed,
      filesSkipped: incremental.data.filesSkipped,
      baselineEdge: baseline,
      resultEdge: target,
      reboundCorrect,
    };
  } finally {
    process.chdir('/');
    graphDb.closeDb();
    rmSync(fixture.root, { recursive: true, force: true });
    if (original === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = original;
    }
  }
}

async function main() {
  const rows = [];
  for (const testCase of CASES) {
    const on = await runCase(testCase, true);
    const off = await runCase(testCase, false);
    const discriminates = on.reboundCorrect && !off.reboundCorrect;
    rows.push({
      id: testCase.id,
      label: testCase.label,
      edgeType: testCase.edgeType,
      importerUnchanged: !testCase.importerChanges,
      on,
      off,
      discriminates,
    });
  }

  const reboundOn = rows.filter((row) => row.on.reboundCorrect).length;
  const discriminating = rows.filter((row) => row.discriminates).length;
  const importerUnchangedCases = rows.filter((row) => row.importerUnchanged);
  const importerUnchangedDiscriminating = importerUnchangedCases.filter((row) => row.discriminates).length;

  const summary = {
    totalCases: rows.length,
    reboundCorrectWithFlagOn: reboundOn,
    reboundCorrectnessRate: rows.length === 0 ? 0 : Number((reboundOn / rows.length).toFixed(4)),
    discriminatingCases: discriminating,
    importerUnchangedCases: importerUnchangedCases.length,
    importerUnchangedDiscriminating,
  };

  const out = {
    benchmark: 'code-graph edge-staleness reverse-dependency force-parse rebind',
    flag: FLAG,
    generatedAt: new Date().toISOString(),
    safety: 'fresh throwaway workspace and SQLite db per case under OS temp, live graph never opened',
    summary,
    cases: rows,
  };

  mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'staleness-metrics.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');

  // eslint-disable-next-line no-console
  console.log(`[edge-staleness-benchmark] cases=${summary.totalCases} reboundOn=${summary.reboundCorrectWithFlagOn} discriminating=${summary.discriminatingCases} importerUnchangedDiscriminating=${summary.importerUnchangedDiscriminating}`);
  // eslint-disable-next-line no-console
  console.log(`[edge-staleness-benchmark] wrote ${path.relative(BENCH_ROOT, outPath)}`);

  // The gate passes when every importer-unchanged case rebinds under the flag
  // and stays stale without it. The importer-changing cases are controls that
  // confirm the ordinary incremental scan still rebinds when the importer is
  // independently stale.
  const gatePass = importerUnchangedCases.length > 0
    && importerUnchangedDiscriminating === importerUnchangedCases.length;
  process.exit(gatePass ? 0 : 1);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[edge-staleness-benchmark] FAILED', error);
  process.exit(2);
});
