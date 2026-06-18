#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Query Entrypoint                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--spec-folder, --loop-type, --session-id,              ║
// ║         --query-type).                                                   ║
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

const TSX_LOADER = require.resolve('tsx');

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
  const queryType = args.queryType || args.query;
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context') throw inputError('loopType must be "research", "review", "council", or "context"');
  if (!queryType || typeof queryType !== 'string') throw inputError('queryType is required');

  const ns = { specFolder, loopType, sessionId };
  const limit = Math.min(Math.max(Number(args.limit || 50), 1), 200);
  let db = null;

  try {
    const isCouncil = loopType === 'council';
    db = isCouncil
      ? await import('../lib/council/council-graph-db.ts')
      : await import('../lib/coverage-graph/coverage-graph-db.ts');
    installSignalHandlers(() => db?.closeDb());
    maybeThrowTestFault();
    const query = isCouncil
      ? await import('../lib/council/council-graph-query.ts')
      : await import('../lib/coverage-graph/coverage-graph-query.ts');
    let data;
    if (isCouncil) {
      const councilNs = { specFolder, sessionId };
      switch (queryType) {
        case 'unresolved_disagreements': {
          const disagreements = query.findUnresolvedDisagreements(councilNs);
          data = {
            queryType,
            namespace: ns,
            scopeMode: 'session',
            disagreements: disagreements.slice(0, limit),
            totalUnresolved: disagreements.length,
            sourceOfTruth: 'derived_from_ai_council_artifacts',
          };
          break;
        }
        case 'evidence_chain': {
          const nodeId = ensureString(args, 'nodeId');
          const maxDepth = Math.min(Math.max(Number(args.maxDepth || 10), 1), 20);
          const chain = query.findEvidenceChain(councilNs, nodeId, maxDepth);
          data = {
            queryType,
            namespace: ns,
            scopeMode: 'session',
            rootNodeId: nodeId,
            chain: chain.slice(0, limit),
            totalSteps: chain.length,
            maxDepth,
            sourceOfTruth: 'derived_from_ai_council_artifacts',
          };
          break;
        }
        case 'decision_support': {
          const support = query.findDecisionSupport(councilNs, args.nodeId).slice(0, limit);
          data = {
            queryType,
            namespace: ns,
            scopeMode: 'session',
            support,
            totalReturned: support.length,
            sourceOfTruth: 'derived_from_ai_council_artifacts',
          };
          break;
        }
        case 'convergence_blockers': {
          const blockers = query.findConvergenceBlockers(councilNs);
          data = {
            queryType,
            namespace: ns,
            scopeMode: 'session',
            blockers: {
              unresolvedCriticalDisagreements: blockers.unresolvedCriticalDisagreements.slice(0, limit),
              lowConfidenceDecisions: blockers.lowConfidenceDecisions.slice(0, limit),
              unsupportedDecisions: blockers.unsupportedDecisions.slice(0, limit),
            },
            totals: {
              unresolvedCriticalDisagreements: blockers.unresolvedCriticalDisagreements.length,
              lowConfidenceDecisions: blockers.lowConfidenceDecisions.length,
              unsupportedDecisions: blockers.unsupportedDecisions.length,
            },
            sourceOfTruth: 'derived_from_ai_council_artifacts',
          };
          break;
        }
        case 'hot_nodes': {
          const hotNodes = query.rankHotNodes(councilNs, limit);
          data = {
            queryType,
            namespace: ns,
            scopeMode: 'session',
            hotNodes,
            totalReturned: hotNodes.length,
            sourceOfTruth: 'derived_from_ai_council_artifacts',
          };
          break;
        }
        default:
          throw inputError(`Unknown queryType: "${queryType}"`);
      }
      jsonOut({ status: 'ok', data });
      return;
    }

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
    db?.closeDb();
  }
}

main().catch((err) => {
  const code = classifyExitCode(err);
  jsonOut({ status: 'error', error: err instanceof Error ? err.message : String(err), code: err && err.code ? err.code : 'SCRIPT_ERROR' });
  if (code === 1) process.stderr.write(JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n');
  process.exit(code);
});
