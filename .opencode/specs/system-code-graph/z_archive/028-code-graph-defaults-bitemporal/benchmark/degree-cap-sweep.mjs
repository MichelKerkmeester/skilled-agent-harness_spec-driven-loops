// Degree-cap sweep benchmark.
//
// Measures the staleness-repair force-parse trade across importer degrees. For
// each importer degree D in the sweep, a dependency imported by D files is
// reindexed after a symbol-identity flip with the force-parse flag on, at each
// candidate cap. The cap admits a refactored dependency to the force-parse
// expansion only when its importer degree is at or below the cap, so above the
// cap the dependency is dropped and its importer edges stay stale.
//
// Reported per (cap, degree):
//   forcedReparses    importer files re-parsed by the repair (the rebind cost)
//   residualStale     importer edges left stale (the correctness cost)
//   reindexMs         wall time of the incremental rescan
//
// The script imports the freshly compiled handlers passed as MODULE_DIR.

import { mkdtempSync, mkdirSync, writeFileSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const MODULE_DIR = process.env.CODEGRAPH_DIST;
if (!MODULE_DIR) {
  console.error('CODEGRAPH_DIST must point at a compiled mcp_server output directory');
  process.exit(2);
}

const db = await import(pathToFileURL(join(MODULE_DIR, 'lib/code-graph-db.js')).href);
const scan = await import(pathToFileURL(join(MODULE_DIR, 'handlers/scan.js')).href);

const FORCE_PARSE_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';
const DEGREE_CAP_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP';

const DEGREES = [5, 10, 15, 20, 25];
const CAPS = [5, 10, 15, 20, 25];

function writeFile(root, rel, content) {
  const path = join(root, rel);
  writeFileSync(path, content);
  return path;
}

async function runScan(workspaceDir, incremental) {
  const response = await scan.handleCodeGraphScan({ rootDir: workspaceDir, incremental });
  return JSON.parse(response.content[0].text).data;
}

// Build a workspace where dep.ts exports foo and D importer files each import it.
function buildWorkspace(workspaceDir, degree) {
  writeFile(workspaceDir, 'dep.ts', 'export function foo() { return 1; }\n');
  for (let i = 0; i < degree; i++) {
    writeFile(workspaceDir, `importer${i}.ts`, `import { foo } from './dep';\nexport const value${i} = foo;\n`);
  }
}

// Count importer files whose import binding is NOT rebound to the new const foo.
// After the refactor the only correct state for an importer is an IMPORTS edge to
// the new variable-kind foo. An importer the repair skipped either still points
// at the deleted function-kind foo (its target node is gone, so the edge was
// pruned and is missing) or has no live edge to the new const. Either way it is
// stale. Counting importers WITHOUT a live edge to the new const foo captures
// both, which is the residual correctness cost of dropping the dependency.
function residualStaleImporters(getDb, degree) {
  const reboundRow = getDb().prepare(`
    SELECT COUNT(DISTINCT source.file_path) AS n
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE edge.edge_type = 'IMPORTS'
      AND edge.invalid_at IS NULL
      AND target.name = 'foo'
      AND target.kind = 'variable'
  `).get();
  return Math.max(0, degree - reboundRow.n);
}

async function measure(cap, degree) {
  const root = mkdtempSync(join(tmpdir(), `degree-sweep-c${cap}-d${degree}-`));
  const workspaceDir = realpathSync((mkdirSync(join(root, 'workspace'), { recursive: true }), join(root, 'workspace')));
  const dbDir = realpathSync((mkdirSync(join(root, 'db'), { recursive: true }), join(root, 'db')));
  try {
    db.initDb(dbDir);
    process.chdir(workspaceDir);
    process.env[FORCE_PARSE_ENV] = 'true';
    process.env[DEGREE_CAP_ENV] = String(cap);

    buildWorkspace(workspaceDir, degree);
    await runScan(workspaceDir, false);

    // Flip foo from function to const so its symbol identity changes.
    writeFile(workspaceDir, 'dep.ts', 'export const foo = 1;\n');
    const start = process.hrtime.bigint();
    const incremental = await runScan(workspaceDir, true);
    const reindexMs = Number(process.hrtime.bigint() - start) / 1e6;

    // filesIndexed counts dep.ts plus every importer the repair force-parsed.
    const forcedReparses = Math.max(0, incremental.filesIndexed - 1);
    const residualStale = residualStaleImporters(db.getDb, degree);
    return { cap, degree, forcedReparses, residualStale, reindexMs: Number(reindexMs.toFixed(2)) };
  } finally {
    db.closeDb();
    rmSync(root, { recursive: true, force: true });
  }
}

const rows = [];
for (const cap of CAPS) {
  for (const degree of DEGREES) {
    rows.push(await measure(cap, degree));
  }
}

process.env[FORCE_PARSE_ENV] = '';
process.env[DEGREE_CAP_ENV] = '';

console.log(JSON.stringify({ degrees: DEGREES, caps: CAPS, rows }, null, 2));
