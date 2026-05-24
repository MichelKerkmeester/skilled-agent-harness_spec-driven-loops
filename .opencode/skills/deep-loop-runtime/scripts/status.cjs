#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Status Entrypoint                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--spec-folder, --loop-type, --session-id).             ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=ok, 1=script error, 2=DB error, 3=input validation error.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = path.resolve(__dirname, '..', '..', 'system-spec-kit', 'scripts', 'node_modules', 'tsx', 'dist', 'loader.mjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(process.execPath, ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
    input: process.stdin.isTTY ? undefined : fs.readFileSync(0),
    encoding: 'utf8',
  });
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status === null ? 1 : child.status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) throw inputError(`Unexpected positional argument: ${token}`);
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function ensureString(args, key) {
  if (!args[key] || typeof args[key] !== 'string') throw inputError(`${key} is required`);
  return args[key];
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  const sessionId = validateNamespaceValue(ensureString(args, 'sessionId'), 'sessionId', inputError);
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council') throw inputError('loopType must be "research", "review", or "council"');

  const ns = { specFolder, loopType, sessionId };
  let db = null;

  try {
    const isCouncil = loopType === 'council';
    db = isCouncil
      ? await import('../lib/council/council-graph-db.ts')
      : await import('../lib/coverage-graph/coverage-graph-db.ts');
    installSignalHandlers(() => db?.closeDb());
    maybeThrowTestFault();
    if (isCouncil) {
      const convergence = require('../lib/council/convergence.cjs');
      const councilNs = { specFolder, sessionId };
      const stats = db.getStats(specFolder, sessionId);
      const readiness = stats.totalNodes === 0 ? 'empty' : 'ready';
      const data = {
        namespace: ns,
        scopeMode: 'session',
        readiness,
        sourceOfTruth: 'derived_from_ai_council_artifacts',
        notes: [
          'Council graph rows are derived from packet-local ai-council artifacts and may be rebuilt.',
        ],
        recovery: {
          mode: 'derived_replay',
          boundedCleanup: 'delete rows for this specFolder/sessionId from council_nodes, council_edges, and council_snapshots, then replay ai-council artifacts',
          artifactAuthority: 'ai-council/**',
          safeActions: [
            'keep ai-council/** artifacts unchanged',
            'discard only derived council graph rows for this namespace',
            'replay nodes and edges from packet-local artifacts',
            'rerun status.cjs --loop-type council and convergence.cjs --loop-type council',
          ],
        },
        totalNodes: stats.totalNodes,
        totalEdges: stats.totalEdges,
        nodesByKind: stats.nodesByKind,
        edgesByRelation: stats.edgesByRelation,
        snapshotCount: stats.snapshotCount,
        schemaVersion: stats.schemaVersion,
        dbFileSize: stats.dbFileSize,
        signals: stats.totalNodes > 0 ? await convergence.computeCouncilSignals({ ...councilNs, loopType }) : null,
        momentum: null,
      };
      jsonOut({ status: 'ok', data, schemaVersion: data.schemaVersion, rowCount: data.totalNodes + data.totalEdges });
      return;
    }

    const signals = await import('../lib/coverage-graph/coverage-graph-signals.ts');
    const nodes = db.getNodes(ns);
    const edges = db.getEdges(ns);
    const snapshots = db.getSnapshots(specFolder, loopType, sessionId);
    const data = {
      namespace: ns,
      scopeMode: 'session',
      notes: ['Status metrics were computed from the session-scoped subgraph only.'],
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodesByKind: nodes.reduce((acc, node) => ({ ...acc, [node.kind]: (acc[node.kind] || 0) + 1 }), {}),
      edgesByRelation: edges.reduce((acc, edge) => ({ ...acc, [edge.relation]: (acc[edge.relation] || 0) + 1 }), {}),
      lastIteration: snapshots.length > 0 ? snapshots[snapshots.length - 1].iteration : null,
      schemaVersion: db.SCHEMA_VERSION,
      dbFileSize: (() => {
        try {
          return fs.statSync(path.join(db.COVERAGE_GRAPH_DATABASE_DIR, 'deep-loop-graph.sqlite')).size;
        } catch {
          return null;
        }
      })(),
      signals: nodes.length > 0 ? signals.computeSignals(ns) : null,
      momentum: null,
    };
    jsonOut({ status: 'ok', data, schemaVersion: data.schemaVersion, rowCount: data.totalNodes + data.totalEdges });
  } finally {
    db?.closeDb();
  }
}

main().catch((err) => {
  const code = classifyExitCode(err);
  jsonOut({ status: 'error', error: err instanceof Error ? err.message : String(err), code: err && err.code ? err.code : 'SCRIPT_ERROR' });
  if (code === 1) process.stderr.write(JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n');
  process.exit(code);
});
