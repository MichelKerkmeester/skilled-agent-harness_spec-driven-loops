#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Code-Graph Edge-Staleness Fan-In COST Benchmark
// Usage:
//   node edge-staleness-cost-benchmark.mjs
//
// Measures the fan-in re-parse cost of the reverse-dependency force-parse
// repair on a hot high-importer dependency, uncapped versus degree-capped, and
// confirms the degree cap bounds the blast radius without losing rebind
// correctness for a low-fan-in dependency. This is the COST half of the gate
// the staleness work was held on. The correctness half is measured by the
// sibling edge-staleness-rebind-benchmark.mjs.
//
// Why a fan-out fixture:
//   The force-parse repair pulls every importer of a refactored dependency back
//   into the parse batch. A hot dependency with N importers re-parses all N on
//   every symbol-identity change. This benchmark builds one dependency imported
//   by a configurable fan-out of importer files, renames the dependency symbol
//   so its identity shifts, and measures how many importers the repair pulls in
//   and how long the incremental scan takes, with the degree cap off and on.
//
// What is measured:
//   - forcedImporters: how many importer files the repair force-parses,
//     observed as the files-indexed delta over the dependency's own re-parse.
//   - scanMs: the incremental scan wall time.
//   - The cap drops a dependency whose importer fan-in degree exceeds the cap,
//     so a high-fan-in rename force-parses zero importers under the cap while a
//     low-fan-in rename still rebinds.
//
// Safety:
//   Every variant builds a fresh throwaway workspace and SQLite database under
//   the OS temp directory and deletes it after. The live code-graph.sqlite is
//   never opened.
//
// It never changes a default and never decides whether the flag graduates. It
// writes results/cost-metrics.json.
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
const CAP = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP';

const { handleCodeGraphScan } = await import(join(MCP_SERVER, 'dist/handlers/scan.js'));
const graphDb = await import(join(MCP_SERVER, 'dist/lib/code-graph-db.js'));

function makeFixture(label) {
  const root = mkdtempSync(join(tmpdir(), `edge-cost-${label}-`));
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

// Build one dependency and `fanOut` importers, each importing the dependency
// symbol under a name that stays in the importer text on rename so the importer
// itself is byte-identical and only the force-parse path can rebind its edge.
function buildFanOut(workspace, fanOut, depSymbol) {
  writeFile(workspace, 'dep.ts', `export function ${depSymbol}() { return 1; }\n`);
  for (let i = 0; i < fanOut; i += 1) {
    writeFile(
      workspace,
      `importer-${i}.ts`,
      `import { ${depSymbol} } from './dep';\nexport const v${i} = ${depSymbol};\n`,
    );
  }
}

async function runVariant({ label, fanOut, degreeCap }) {
  const originalFlag = process.env[FLAG];
  const originalCap = process.env[CAP];
  process.env[FLAG] = 'true';
  if (degreeCap > 0) {
    process.env[CAP] = String(degreeCap);
  } else {
    delete process.env[CAP];
  }
  const fixture = makeFixture(label);
  try {
    // The importer text references the dependency symbol as a value, so a
    // kind-flip on the dependency keeps the importer byte-identical. Build the
    // fan-out as a function, then flip it to a const so its symbol id shifts
    // while every importer stays unchanged.
    buildFanOut(fixture.workspace, fanOut, 'hot');
    await scan(fixture.workspace, false);

    writeFile(fixture.workspace, 'dep.ts', 'export const hot = 1;\n');
    const started = process.hrtime.bigint();
    const incremental = await scan(fixture.workspace, true);
    const scanMs = Number(process.hrtime.bigint() - started) / 1e6;

    // The dependency re-parses once. Everything beyond that is a forced
    // importer, so forcedImporters is the indexed count minus the dependency.
    const forcedImporters = Math.max(0, incremental.data.filesIndexed - 1);

    // Confirm a representative importer's edge rebound (or stayed stale under a
    // cap that dropped this dependency).
    const sampleImporter = join(fixture.workspace, 'importer-0.ts');
    const rebound = graphDb.getDb().prepare(`
      SELECT t.kind AS kind
      FROM code_edges e
      INNER JOIN code_nodes s ON s.symbol_id = e.source_id
      INNER JOIN code_nodes t ON t.symbol_id = e.target_id
      WHERE e.edge_type = 'IMPORTS' AND s.file_path = ? AND s.file_path != t.file_path
    `).get(sampleImporter);

    return {
      label,
      fanOut,
      degreeCap,
      filesIndexed: incremental.data.filesIndexed,
      filesSkipped: incremental.data.filesSkipped,
      forcedImporters,
      scanMs: Number(scanMs.toFixed(2)),
      sampleEdgeKind: rebound ? rebound.kind : null,
      sampleRebound: Boolean(rebound && rebound.kind === 'variable'),
    };
  } finally {
    process.chdir('/');
    graphDb.closeDb();
    rmSync(fixture.root, { recursive: true, force: true });
    if (originalFlag === undefined) { delete process.env[FLAG]; } else { process.env[FLAG] = originalFlag; }
    if (originalCap === undefined) { delete process.env[CAP]; } else { process.env[CAP] = originalCap; }
  }
}

async function main() {
  const HOT_FANOUT = 30;
  const LOW_FANOUT = 2;
  const CAP_CEILING = 10;

  const variants = [
    { label: 'hot-uncapped', fanOut: HOT_FANOUT, degreeCap: 0 },
    { label: 'hot-capped', fanOut: HOT_FANOUT, degreeCap: CAP_CEILING },
    { label: 'low-uncapped', fanOut: LOW_FANOUT, degreeCap: 0 },
    { label: 'low-capped', fanOut: LOW_FANOUT, degreeCap: CAP_CEILING },
  ];

  const rows = [];
  for (const variant of variants) {
    rows.push(await runVariant(variant));
  }

  const byLabel = Object.fromEntries(rows.map((row) => [row.label, row]));
  const hotUncapped = byLabel['hot-uncapped'];
  const hotCapped = byLabel['hot-capped'];
  const lowCapped = byLabel['low-capped'];

  const summary = {
    hotFanOut: HOT_FANOUT,
    lowFanOut: LOW_FANOUT,
    capCeiling: CAP_CEILING,
    hotUncappedForcedImporters: hotUncapped.forcedImporters,
    hotCappedForcedImporters: hotCapped.forcedImporters,
    hotUncappedScanMs: hotUncapped.scanMs,
    hotCappedScanMs: hotCapped.scanMs,
    forcedImporterReductionOnHot: hotUncapped.forcedImporters - hotCapped.forcedImporters,
    lowCappedStillRebinds: lowCapped.sampleRebound,
    hotCappedAvoidsForceParse: hotCapped.forcedImporters === 0,
  };

  const out = {
    benchmark: 'code-graph edge-staleness fan-in force-parse cost, uncapped vs degree-capped',
    flag: FLAG,
    degreeCapEnv: CAP,
    generatedAt: new Date().toISOString(),
    safety: 'fresh throwaway workspace and SQLite db per variant under OS temp, live graph never opened',
    summary,
    variants: rows,
  };

  mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'cost-metrics.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');

  // eslint-disable-next-line no-console
  console.log(`[edge-staleness-cost] hotUncappedForced=${summary.hotUncappedForcedImporters} hotCappedForced=${summary.hotCappedForcedImporters} lowCappedRebinds=${summary.lowCappedStillRebinds}`);
  // eslint-disable-next-line no-console
  console.log(`[edge-staleness-cost] hotUncappedScanMs=${summary.hotUncappedScanMs} hotCappedScanMs=${summary.hotCappedScanMs}`);
  // eslint-disable-next-line no-console
  console.log(`[edge-staleness-cost] wrote ${path.relative(BENCH_ROOT, outPath)}`);

  // The cap is sound when it drops the hot dependency entirely (zero forced
  // importers) while a low-fan-in dependency under the same cap still rebinds.
  const gatePass = summary.hotCappedAvoidsForceParse && summary.lowCappedStillRebinds;
  process.exit(gatePass ? 0 : 1);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[edge-staleness-cost] FAILED', error);
  process.exit(2);
});
