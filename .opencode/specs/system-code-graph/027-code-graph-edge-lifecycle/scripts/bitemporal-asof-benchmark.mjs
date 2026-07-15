#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Code-Graph Bi-temporal As-Of Consumer Benchmark
// Usage:
//   node bitemporal-asof-benchmark.mjs
//
// Exercises the smallest proving consumer for the bitemporal-reads flag: a
// close-and-insert writer that stamps invalid_at on a superseded edge instead
// of deleting it, feeding an as-of reader that answers about an edge at a past
// generation. The proving question is whether the graph still answers correctly
// about an edge that has since been rebound.
//
// What is measured:
//   - asOfPastSeesOldTarget: an as-of read at the generation when the old edge
//     was live returns the old target, even though a newer edge has since
//     superseded it.
//   - asOfNowSeesNewTarget: an as-of read at the current generation returns the
//     new target and not the closed old one.
//   - flagOffByteIdentity: with the flag off, closeEdgesForSources is a no-op,
//     insertEdgeWithValidity writes NULL validity columns identical to a plain
//     insert, and asOfEdgesFrom falls back to the live-only read.
//
// Safety:
//   A fresh throwaway SQLite database under the OS temp directory, deleted
//   after. The live code-graph.sqlite is never opened.
//
// It never changes a default and never decides whether the flag graduates. It
// writes results/bitemporal-metrics.json.
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, realpathSync } from 'node:fs';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(HERE, '..');
const RESULTS_DIR = path.join(BENCH_ROOT, 'results');

const MCP_SERVER = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server';
const FLAG = 'SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS';

const graphDb = await import(join(MCP_SERVER, 'dist/lib/code-graph-db.js'));

function makeDb(label) {
  const root = mkdtempSync(join(tmpdir(), `bitemporal-${label}-`));
  const dbDir = join(root, 'db');
  mkdirSync(dbDir, { recursive: true });
  const canonicalDbDir = realpathSync(dbDir);
  graphDb.initDb(canonicalDbDir);
  return { root };
}

function seedNodes(filePath) {
  // A source symbol and two candidate targets, an old one and a new one, so a
  // close-and-insert can supersede the old edge with the new.
  const fileId = graphDb.upsertFile(filePath, 'typescript', 'hash', 1, 0, 'clean', 1, { fileMtimeMs: 0 });
  graphDb.replaceNodes(fileId, [
    { symbolId: 'src', filePath, fqName: 'src', kind: 'function', name: 'src', startLine: 1, endLine: 1, startColumn: 0, endColumn: 1, language: 'typescript', signature: null, docstring: null, contentHash: 'h-src' },
    { symbolId: 'old-target', filePath, fqName: 'oldTarget', kind: 'function', name: 'oldTarget', startLine: 2, endLine: 2, startColumn: 0, endColumn: 1, language: 'typescript', signature: null, docstring: null, contentHash: 'h-old' },
    { symbolId: 'new-target', filePath, fqName: 'newTarget', kind: 'function', name: 'newTarget', startLine: 3, endLine: 3, startColumn: 0, endColumn: 1, language: 'typescript', signature: null, docstring: null, contentHash: 'h-new' },
  ]);
}

function runFlagOn() {
  const original = process.env[FLAG];
  process.env[FLAG] = 'true';
  const fixture = makeDb('on');
  try {
    seedNodes('/virtual/a.ts');

    // Generation g1: the edge src -> old-target is born valid.
    const g1 = graphDb.getCodeGraphGeneration();
    graphDb.insertEdgeWithValidity({ sourceId: 'src', targetId: 'old-target', edgeType: 'CALLS', weight: 1 });

    // Advance the clock and rebind: close the old edge and insert the new one.
    const g2 = graphDb.bumpCodeGraphGeneration();
    const closed = graphDb.closeEdgesForSources(['src']);
    graphDb.insertEdgeWithValidity({ sourceId: 'src', targetId: 'new-target', edgeType: 'CALLS', weight: 1 });

    const asOfPast = graphDb.asOfEdgesFrom('src', g1, 'CALLS').map((r) => r.edge.targetId);
    const asOfNow = graphDb.asOfEdgesFrom('src', graphDb.getCodeGraphGeneration(), 'CALLS').map((r) => r.edge.targetId);

    return {
      g1,
      g2,
      closedEdges: closed.closedEdges,
      asOfPastTargets: asOfPast,
      asOfNowTargets: asOfNow,
      asOfPastSeesOldTarget: asOfPast.length === 1 && asOfPast[0] === 'old-target',
      asOfNowSeesNewTarget: asOfNow.length === 1 && asOfNow[0] === 'new-target',
    };
  } finally {
    graphDb.closeDb();
    rmSync(fixture.root, { recursive: true, force: true });
    if (original === undefined) { delete process.env[FLAG]; } else { process.env[FLAG] = original; }
  }
}

function runFlagOff() {
  const original = process.env[FLAG];
  delete process.env[FLAG];
  const fixture = makeDb('off');
  try {
    seedNodes('/virtual/a.ts');

    // With the flag off, the consumer writes a plain edge with NULL validity,
    // the close is a no-op, and the as-of read falls back to live-only.
    graphDb.insertEdgeWithValidity({ sourceId: 'src', targetId: 'old-target', edgeType: 'CALLS', weight: 1 });
    const closed = graphDb.closeEdgesForSources(['src']);

    const row = graphDb.getDb().prepare(`
      SELECT valid_at AS validAt, invalid_at AS invalidAt
      FROM code_edges WHERE source_id = 'src' AND target_id = 'old-target'
    `).get();
    const asOf = graphDb.asOfEdgesFrom('src', 0, 'CALLS').map((r) => r.edge.targetId);
    const live = graphDb.queryEdgesFrom('src', 'CALLS').map((r) => r.edge.targetId);

    return {
      closedEdges: closed.closedEdges,
      insertedValidAt: row ? row.validAt : 'missing',
      insertedInvalidAt: row ? row.invalidAt : 'missing',
      asOfFallbackTargets: asOf,
      liveTargets: live,
      closeIsNoOp: closed.closedEdges === 0,
      insertHasNullValidity: Boolean(row) && row.validAt === null && row.invalidAt === null,
      asOfMatchesLive: JSON.stringify(asOf) === JSON.stringify(live),
    };
  } finally {
    graphDb.closeDb();
    rmSync(fixture.root, { recursive: true, force: true });
    if (original === undefined) { delete process.env[FLAG]; } else { process.env[FLAG] = original; }
  }
}

function main() {
  const on = runFlagOn();
  const off = runFlagOff();

  const summary = {
    asOfPastSeesOldTarget: on.asOfPastSeesOldTarget,
    asOfNowSeesNewTarget: on.asOfNowSeesNewTarget,
    closedEdgesOnRebind: on.closedEdges,
    flagOffCloseIsNoOp: off.closeIsNoOp,
    flagOffInsertHasNullValidity: off.insertHasNullValidity,
    flagOffAsOfMatchesLive: off.asOfMatchesLive,
  };

  const out = {
    benchmark: 'code-graph bitemporal close-and-insert writer plus as-of reader',
    flag: FLAG,
    generatedAt: new Date().toISOString(),
    safety: 'fresh throwaway SQLite db per variant under OS temp, live graph never opened',
    summary,
    flagOn: on,
    flagOff: off,
  };

  mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'bitemporal-metrics.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');

  // eslint-disable-next-line no-console
  console.log(`[bitemporal-asof] asOfPastSeesOld=${summary.asOfPastSeesOldTarget} asOfNowSeesNew=${summary.asOfNowSeesNewTarget} closedOnRebind=${summary.closedEdgesOnRebind}`);
  // eslint-disable-next-line no-console
  console.log(`[bitemporal-asof] flagOffCloseNoOp=${summary.flagOffCloseIsNoOp} flagOffNullValidity=${summary.flagOffInsertHasNullValidity} flagOffAsOfMatchesLive=${summary.flagOffAsOfMatchesLive}`);
  // eslint-disable-next-line no-console
  console.log(`[bitemporal-asof] wrote ${path.relative(BENCH_ROOT, outPath)}`);

  const gatePass = summary.asOfPastSeesOldTarget
    && summary.asOfNowSeesNewTarget
    && summary.flagOffCloseIsNoOp
    && summary.flagOffInsertHasNullValidity
    && summary.flagOffAsOfMatchesLive;
  process.exit(gatePass ? 0 : 1);
}

main();
