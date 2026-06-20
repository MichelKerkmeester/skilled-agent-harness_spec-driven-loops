#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: SEEDED-PPR STRUCTURAL-RETRIEVAL EVAL DRIVER
// ───────────────────────────────────────────────────────────────
//
// Measures what the seeded Personalized-PageRank impact-ranking flag changes for
// a `code_graph_context` impact query, on a COPY of the live code graph.
//
// The flag governs the impact path in lib/code-graph-context:
//   OFF -> rank the DIRECT callers of the anchor by edge reliability (RRF).
//   ON  -> run a bounded seeded-PPR power method over the caller fan-in and rank
//          every PPR-scored caller by mass, then minHop, then reliability.
//
// Two seeded topologies probe the flag's behaviour against a known target:
//   (1) FAN_IN  — anchor has two direct callers; one ('central') is itself a hub
//                 with N of its own callers, the other ('leaf') is a sink.
//   (2) CHAIN   — a pure two-hop chain: only 'middle' directly calls the anchor,
//                 and 'deep' calls 'middle' (so 'deep' is two hops away).
//
// Right-target metric = the rank of the KNOWN central/deep caller in the ordered
// caller list (lower is better; -1 means not surfaced). The eval reports the
// flag-OFF vs flag-ON delta per topology.
//
// ISOLATION: the code-graph runtime keeps a module-level DB singleton, so the OFF
// and ON conditions are each run in a SEPARATE child process. Reusing one process
// silently shares the singleton and produces non-deterministic results.
//
// SAFETY (mutating eval): every condition seeds its subgraph into a fresh COPY of
// code-graph.sqlite under the gitignored in-workspace vitest-tmp dir. The live DB
// is never opened for write. (The copy stays in-workspace because the canonical
// DB-dir guard rejects out-of-workspace paths.)

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const MCP_SERVER = join(SCRIPT_DIR, '..', '..'); // eval -> scripts -> mcp_server
const LIVE_DB = join(MCP_SERVER, 'database', 'code-graph.sqlite');
const SCRATCH = join(MCP_SERVER, 'vitest-tmp');
const CHILD = join(SCRIPT_DIR, 'ppr-impact-child.mjs');

const EVAL_FILE = 'eval/ppr-eval-target.ts';
const ANCHOR_LINE = 105; // first seeded node sits at this line; the seed targets it

// Child worker: seeds one topology into a copied DB, runs the impact query under
// the given flag state, prints the ordered caller list. Written next to this
// driver so the eval is self-contained and reusable.
const CHILD_SOURCE = `import Database from 'better-sqlite3';
import { join } from 'node:path';

const [dbDir, topology] = process.argv.slice(2);
const dbPath = join(dbDir, 'code-graph.sqlite');

function seed(topology) {
  const db = new Database(dbPath);
  const fileId = 999000001;
  db.prepare(
    "INSERT OR REPLACE INTO code_files (id, file_path, language, content_hash, file_mtime_ms, indexed_at) VALUES (?, ?, 'typescript', 'eval-hash', ?, ?)",
  ).run(fileId, ${JSON.stringify(EVAL_FILE)}, Date.now(), new Date().toISOString());
  const node = db.prepare(
    "INSERT OR REPLACE INTO code_nodes (symbol_id, file_id, file_path, fq_name, kind, name, start_line, end_line, language, content_hash) VALUES (?, ?, ?, ?, 'function', ?, ?, ?, 'typescript', ?)",
  );
  let line = 100;
  const add = (sid, fq) => {
    line += 5;
    node.run(sid, fileId, ${JSON.stringify(EVAL_FILE)}, fq, fq.split('.').pop(), line, line + 3, 'h-' + sid);
  };
  const edge = db.prepare(
    "INSERT INTO code_edges (source_id, target_id, edge_type, weight, metadata) VALUES (?, ?, 'CALLS', 1, json('{\\"confidence\\":1,\\"evidenceClass\\":\\"EXTRACTED\\"}'))",
  );

  if (topology === 'fan_in') {
    // anchor <- central(hub, 6 of its own callers), anchor <- leaf(sink)
    add('eval__anchor', 'Eval.anchor');
    add('eval__central', 'Eval.zCentralHub'); // sorts last alphabetically on purpose
    add('eval__leaf', 'Eval.aLeaf');
    for (let i = 1; i <= 6; i += 1) add('eval__g' + i, 'Eval.g' + i);
    edge.run('eval__leaf', 'eval__anchor');
    edge.run('eval__central', 'eval__anchor');
    for (let i = 1; i <= 6; i += 1) edge.run('eval__g' + i, 'eval__central');
  } else {
    // pure two-hop chain: middle -> anchor, deep -> middle
    add('eval__anchor', 'Eval.anchor');
    add('eval__middle', 'Eval.middleCaller');
    add('eval__deep', 'Eval.deepCaller');
    edge.run('eval__middle', 'eval__anchor');
    edge.run('eval__deep', 'eval__middle');
  }
  db.close();
}

seed(topology);

const cdb = await import(${JSON.stringify(join(MCP_SERVER, 'dist', 'lib', 'code-graph-db.js'))});
const ctx = await import(${JSON.stringify(join(MCP_SERVER, 'dist', 'lib', 'code-graph-context.js'))});
cdb.closeDb();
cdb.initDb(dbDir);
const result = ctx.buildContext({
  queryMode: 'impact',
  input: 'impact of Eval.anchor blast radius callers',
  seeds: [{ filePath: ${JSON.stringify(EVAL_FILE)}, startLine: ${ANCHOR_LINE}, endLine: ${ANCHOR_LINE + 3} }],
  deadlineMs: 5000,
});
cdb.closeDb();
const callers = (result.graphContext[0]?.edges ?? []).map((e) => e.from);
process.stdout.write(JSON.stringify({ callers }));
`;

const TOPOLOGIES = {
  fan_in: { known_target: 'Eval.zCentralHub', other: 'Eval.aLeaf' },
  chain: { known_target: 'Eval.deepCaller', other: 'Eval.middleCaller' },
};

function runChild(topology, flagOn) {
  // Fresh COPY per condition; isolated child process for a clean DB singleton.
  const workDir = mkdtempSync(join(SCRATCH, 'ppr-eval-'));
  copyFileSync(LIVE_DB, join(workDir, 'code-graph.sqlite'));
  const env = { ...process.env };
  delete env.SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING;
  delete env.SPECKIT_CODE_GRAPH_DB_DIR;
  if (flagOn) env.SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING = 'true';

  const proc = spawnSync(process.execPath, [CHILD, workDir, topology], {
    env,
    encoding: 'utf8',
    timeout: 60_000,
  });
  rmSync(workDir, { recursive: true, force: true });
  if (proc.status !== 0) {
    throw new Error(`child failed (${topology}, flagOn=${flagOn}): ${proc.stderr || proc.stdout}`);
  }
  return JSON.parse(proc.stdout).callers;
}

function rankOf(callers, fq) {
  return callers.indexOf(fq);
}

function main() {
  mkdirSync(SCRATCH, { recursive: true });
  writeFileSync(CHILD, CHILD_SOURCE, 'utf8');

  const results = {};
  for (const [topology, meta] of Object.entries(TOPOLOGIES)) {
    const offCallers = runChild(topology, false);
    const onCallers = runChild(topology, true);
    const offRank = rankOf(offCallers, meta.known_target);
    const onRank = rankOf(onCallers, meta.known_target);
    results[topology] = {
      known_target: meta.known_target,
      flag_off: { callers: offCallers, target_rank: offRank, target_surfaced: offRank >= 0 },
      flag_on: { callers: onCallers, target_rank: onRank, target_surfaced: onRank >= 0 },
      ranking_changed: JSON.stringify(offCallers) !== JSON.stringify(onCallers),
      target_rank_improved:
        onRank >= 0 && (offRank < 0 || onRank < offRank),
    };
  }
  rmSync(CHILD, { force: true });

  const report = {
    flag: 'SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING',
    subsystem: 'system-code-graph (mk_code_index)',
    db_source: 'COPY of database/code-graph.sqlite (live DB never mutated)',
    mutated_live_db: false,
    topologies: results,
    note: 'PRELIMINARY — single run per condition. Re-run officially before promotion.',
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  return 0;
}

process.exit(main());
