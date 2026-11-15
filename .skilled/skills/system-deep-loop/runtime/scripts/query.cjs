#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Runtime Query Entrypoint
// ───────────────────────────────────────────────────────────────────

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  assertKnownFlags,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');

// Every option this entrypoint reads. parseArgs accepts any --key, so without
// this list a misspelled flag would be silently ignored and change what runs.
const QUERY_FLAGS = [
  'specFolder',
  'loopType',
  'sessionId',
  'queryType',
  'query',
  'readOnly',
  'limit',
  'nodeId',
  'maxDepth',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(process.execPath, ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env: require('./runtime-bootstrap.cjs').tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' }),
    // The child owns stdin. Reading it here blocks on a pipe that is never
    // closed and throws EAGAIN on a non-blocking one, before any argument is checked.
    stdio: ['inherit', 'pipe', 'pipe'],
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

function parseBoundedInteger(args, key, fallback, minimum, maximum) {
  const raw = args[key];
  if (raw === undefined) return fallback;
  if (typeof raw !== 'string' || raw.trim() === '') throw inputError(`${key} must be an integer`);
  const value = Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw inputError(`${key} must be an integer from ${minimum} through ${maximum}`);
  }
  return value;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  assertKnownFlags(args, QUERY_FLAGS, inputError);
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  const sessionId = validateNamespaceValue(ensureString(args, 'sessionId'), 'sessionId', inputError);
  const queryType = args.queryType || args.query;
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') throw inputError('loopType must be "research", "review", or "context"');
  if (!queryType || typeof queryType !== 'string') throw inputError('queryType is required');

  const ns = { specFolder, loopType, sessionId };
  const readOnly = args.readOnly === true;
  const limit = parseBoundedInteger(args, 'limit', 50, 1, 200);
  let db = null;

  try {
    db = await import('../lib/coverage-graph/coverage-graph-db.ts');
    if (readOnly) db.openReadOnlyDb();
    installSignalHandlers(() => db?.closeDb());
    maybeThrowTestFault();
    const query = await import('../lib/coverage-graph/coverage-graph-query.ts');
    let data;

    switch (queryType) {
      case 'uncovered_questions':
        if (loopType !== 'research') throw inputError('uncovered_questions is only valid for research graphs; use coverage_gaps for review graphs');
        data = { queryType, namespace: ns, scopeMode: 'session', gaps: query.findCoverageGaps(ns).slice(0, limit), totalGaps: query.findCoverageGaps(ns).length };
        break;
      case 'coverage_gaps': {
        const gaps = query.findCoverageGaps(ns);
        data = { queryType, namespace: ns, scopeMode: 'session', gaps: gaps.slice(0, limit), totalGaps: gaps.length };
        break;
      }
      case 'unverified_claims': {
        const claims = query.findUnverifiedClaims(ns);
        data = { queryType, namespace: ns, scopeMode: 'session', claims: claims.slice(0, limit), totalUnverified: claims.length };
        break;
      }
      case 'contradictions': {
        const contradictions = query.findContradictions(ns);
        data = { queryType, namespace: ns, scopeMode: 'session', contradictions: contradictions.slice(0, limit), totalContradictions: contradictions.length };
        break;
      }
      case 'provenance_chain': {
        const nodeId = ensureString(args, 'nodeId');
        const maxDepth = parseBoundedInteger(args, 'maxDepth', 10, 1, 20);
        const chain = query.findProvenanceChain(ns, nodeId, maxDepth);
        data = { queryType, namespace: ns, scopeMode: 'session', rootNodeId: nodeId, chain: chain.slice(0, limit), totalSteps: chain.length, maxDepth };
        break;
      }
      case 'hot_nodes': {
        const hotNodes = query.rankHotNodes(ns, limit);
        data = { queryType, namespace: ns, scopeMode: 'session', hotNodes, totalReturned: hotNodes.length };
        break;
      }
      default:
        throw inputError(`Unknown queryType: "${queryType}"`);
    }
    if (readOnly) data = { ...data, readOnly: true, databasePresent: db.isReadOnlyDbPresent() };
    jsonOut({ status: 'ok', data });
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
