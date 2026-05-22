#!/usr/bin/env node
'use strict';
// MODULE: query entry point for deep-loop graph operations
// Input: CLI args (--spec-folder, --loop-type, --session-id, --query-type).
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

async function main() {
  const args = parseArgs();
  const specFolder = ensureString(args, 'specFolder');
  const loopType = ensureString(args, 'loopType');
  const sessionId = ensureString(args, 'sessionId');
  const queryType = args.queryType || args.query;
  if (loopType !== 'research' && loopType !== 'review') throw inputError('loopType must be "research" or "review"');
  if (!queryType || typeof queryType !== 'string') throw inputError('queryType is required');

  const query = await import('../lib/coverage-graph/coverage-graph-query.ts');
  const db = await import('../lib/coverage-graph/coverage-graph-db.ts');
  const ns = { specFolder, loopType, sessionId };
  const limit = Math.min(Math.max(Number(args.limit || 50), 1), 200);

  try {
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
        const maxDepth = Math.min(Math.max(Number(args.maxDepth || 10), 1), 20);
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
    jsonOut({ status: 'ok', data });
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
