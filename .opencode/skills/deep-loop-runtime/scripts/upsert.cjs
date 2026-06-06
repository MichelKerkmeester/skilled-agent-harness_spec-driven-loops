#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Upsert Entrypoint                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--spec-folder, --loop-type, --session-id, --nodes,     ║
// ║         --edges, or --events).                                           ║
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
  acquireWriterLock,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  sleepSync,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = path.resolve(__dirname, '..', '..', 'system-spec-kit', 'scripts', 'node_modules', 'tsx', 'dist', 'loader.mjs');

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
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function ensureString(args, key) {
  if (!args[key] || typeof args[key] !== 'string') throw inputError(`${key} is required`);
  return args[key];
}

function parseJsonValue(value, fallback, label) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    throw inputError(`${label} must be valid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function readEvents(arg) {
  if (!arg) return null;
  const raw = arg === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(path.resolve(arg), 'utf8');
  return parseJsonValue(raw, [], 'events');
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  const sessionId = validateNamespaceValue(ensureString(args, 'sessionId'), 'sessionId', inputError);
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context') throw inputError('loopType must be "research", "review", "council", or "context"');

  let db = null;
  let releaseWriterLock = null;
  const cleanup = () => {
    releaseWriterLock?.();
    releaseWriterLock = null;
    db?.closeDb();
  };
  try {
    const isCouncil = loopType === 'council';
    db = isCouncil
      ? await import('../lib/council/council-graph-db.ts')
      : await import('../lib/coverage-graph/coverage-graph-db.ts');
    installSignalHandlers(cleanup);
    maybeThrowTestFault();
    const events = readEvents(args.events);
    const rawNodes = events
      ? events.filter((event) => event && (event.type === 'node' || event.nodeKind || event.kind))
      : parseJsonValue(args.nodes, [], 'nodes');
    const rawEdges = events
      ? events.filter((event) => event && (event.type === 'edge' || event.source || event.sourceId || event.target || event.targetId))
      : parseJsonValue(args.edges, [], 'edges');
    if (!Array.isArray(rawNodes) || !Array.isArray(rawEdges)) throw inputError('nodes and edges must be JSON arrays');
    if (rawNodes.length === 0 && rawEdges.length === 0) {
      if (isCouncil) {
        const namespace = { specFolder, loopType, sessionId };
        jsonOut({
          status: 'ok',
          data: {
            insertedNodes: 0,
            insertedEdges: 0,
            rejectedEdges: 0,
            rejectedSelfLoops: [],
            noOp: true,
            namespace,
            sourceOfTruth: 'derived_from_ai_council_artifacts',
          },
          graph_nodes_json: [],
          graph_edges_json: [],
          graph_upsert_event_count: 0,
        });
        return;
      }
      throw inputError('At least one node or edge must be provided');
    }

    const validationErrors = [];
    const rejectedSelfLoops = [];
    const nodes = [];
    const edges = [];

    for (const n of rawNodes) {
      const kind = String(n.kind || n.nodeKind || n.type || '').toUpperCase();
      if (!n.id || typeof n.id !== 'string') {
        validationErrors.push('Node missing required id');
        continue;
      }
      const validKinds = isCouncil ? db.VALID_KINDS : db.VALID_KINDS[loopType];
      if (!validKinds.includes(kind)) {
        validationErrors.push(`Invalid node kind "${kind}" for loop type "${loopType}". Valid: ${validKinds.join(', ')}`);
        continue;
      }
      const name = n.name || n.label || n.id;
      const baseNode = {
        id: n.id,
        specFolder,
        sessionId,
        kind,
        name,
        metadata: n.metadata,
      };
      nodes.push(isCouncil
        ? {
            ...baseNode,
            artifactPath: n.artifactPath,
            contentHash: n.contentHash,
            roundId: n.roundId,
          }
        : {
            ...baseNode,
            loopType,
            contentHash: n.contentHash,
            iteration: n.iteration,
          });
    }

    for (const e of rawEdges) {
      const sourceId = e.sourceId || e.source;
      const targetId = e.targetId || e.target;
      const relation = String(e.relation || '').toUpperCase();
      if (!e.id || typeof e.id !== 'string') {
        validationErrors.push('Edge missing required id');
        continue;
      }
      if (!sourceId || !targetId) {
        validationErrors.push(`Edge "${e.id}" missing sourceId or targetId`);
        continue;
      }
      if (sourceId === targetId) {
        rejectedSelfLoops.push(e.id);
        continue;
      }
      const validRelations = isCouncil ? db.VALID_RELATIONS : db.VALID_RELATIONS[loopType];
      if (!validRelations.includes(relation)) {
        validationErrors.push(`Invalid relation "${relation}" for loop type "${loopType}". Valid: ${validRelations.join(', ')}`);
        continue;
      }
      const baseEdge = {
        id: e.id,
        specFolder,
        sessionId,
        sourceId,
        targetId,
        relation,
        weight: db.clampWeight(e.weight ?? 1.0),
        metadata: e.metadata,
      };
      edges.push(isCouncil
        ? {
            ...baseEdge,
            artifactPath: e.artifactPath,
          }
        : {
            ...baseEdge,
            loopType,
          });
    }

    const storageDir = isCouncil ? db.COUNCIL_GRAPH_STORAGE_DIR : db.COVERAGE_GRAPH_DATABASE_DIR;
    releaseWriterLock = acquireWriterLock(path.join(storageDir, isCouncil ? '.council-graph-writer.lock' : '.deep-loop-graph-writer.lock'));
    sleepSync(Number(process.env.DEEP_LOOP_SCRIPT_LOCK_HOLD_MS || 0));
    const result = db.batchUpsert(nodes, edges);
    const namespace = { specFolder, loopType, sessionId };
    const data = {
      insertedNodes: result.insertedNodes,
      insertedEdges: result.insertedEdges,
      rejectedEdges: result.rejectedEdges,
      rejectedSelfLoops,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      namespace,
      ...(isCouncil ? { sourceOfTruth: 'derived_from_ai_council_artifacts' } : {}),
    };
    jsonOut({
      status: 'ok',
      data,
      graph_nodes_json: nodes,
      graph_edges_json: edges,
      graph_upsert_event_count: nodes.length + edges.length,
    });
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  const code = classifyExitCode(err);
  jsonOut({ status: 'error', error: err instanceof Error ? err.message : String(err), code: err && err.code ? err.code : 'SCRIPT_ERROR' });
  if (code === 1) process.stderr.write(JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n');
  process.exit(code);
});
