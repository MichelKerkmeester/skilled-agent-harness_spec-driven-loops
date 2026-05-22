#!/usr/bin/env node
'use strict';
// MODULE: upsert entry point for deep-loop graph operations
// Replaces the MCP tool mcp__mk_spec_memory__deep_loop_graph_upsert.
// Input: CLI args (--spec-folder, --loop-type, --session-id, --nodes, --edges, or --events).
// Output: JSON to stdout.
// Exit codes: 0=ok, 1=script error, 2=DB error, 3=input validation error.

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

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

async function main() {
  const args = parseArgs();
  const specFolder = ensureString(args, 'specFolder');
  const loopType = ensureString(args, 'loopType');
  const sessionId = ensureString(args, 'sessionId');
  if (loopType !== 'research' && loopType !== 'review') throw inputError('loopType must be "research" or "review"');

  const db = await import('../lib/coverage-graph/coverage-graph-db.ts');
  const events = readEvents(args.events);
  const rawNodes = events
    ? events.filter((event) => event && (event.type === 'node' || event.nodeKind || event.kind))
    : parseJsonValue(args.nodes, [], 'nodes');
  const rawEdges = events
    ? events.filter((event) => event && (event.type === 'edge' || event.source || event.sourceId || event.target || event.targetId))
    : parseJsonValue(args.edges, [], 'edges');
  if (!Array.isArray(rawNodes) || !Array.isArray(rawEdges)) throw inputError('nodes and edges must be JSON arrays');
  if (rawNodes.length === 0 && rawEdges.length === 0) throw inputError('At least one node or edge must be provided');

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
    if (!db.VALID_KINDS[loopType].includes(kind)) {
      validationErrors.push(`Invalid node kind "${kind}" for loop type "${loopType}". Valid: ${db.VALID_KINDS[loopType].join(', ')}`);
      continue;
    }
    const name = n.name || n.label || n.id;
    nodes.push({
      id: n.id,
      specFolder,
      loopType,
      sessionId,
      kind,
      name,
      contentHash: n.contentHash,
      iteration: n.iteration,
      metadata: n.metadata,
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
    if (!db.VALID_RELATIONS[loopType].includes(relation)) {
      validationErrors.push(`Invalid relation "${relation}" for loop type "${loopType}". Valid: ${db.VALID_RELATIONS[loopType].join(', ')}`);
      continue;
    }
    edges.push({
      id: e.id,
      specFolder,
      loopType,
      sessionId,
      sourceId,
      targetId,
      relation,
      weight: db.clampWeight(e.weight ?? 1.0),
      metadata: e.metadata,
    });
  }

  try {
    const result = db.batchUpsert(nodes, edges);
    const data = {
      insertedNodes: result.insertedNodes,
      insertedEdges: result.insertedEdges,
      rejectedEdges: result.rejectedEdges,
      rejectedSelfLoops,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      namespace: { specFolder, loopType, sessionId },
    };
    jsonOut({
      status: 'ok',
      data,
      graph_nodes_json: nodes,
      graph_edges_json: edges,
      graph_upsert_event_count: nodes.length + edges.length,
    });
  } finally {
    db.closeDb();
  }
}

main().catch((err) => {
  const code = err && err.code === 'INPUT_VALIDATION' ? 3 : err && (err.code === 'SQLITE_ERROR' || err.code === 'DB_ERROR') ? 2 : 1;
  jsonOut({ status: 'error', error: err instanceof Error ? err.message : String(err), code: err && err.code ? err.code : 'SCRIPT_ERROR' });
  if (code === 1) process.stderr.write(JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n');
  process.exit(code);
});
