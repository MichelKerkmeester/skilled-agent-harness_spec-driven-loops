#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Review Verdict
// ───────────────────────────────────────────────────────────────────

// The verdict a review stops on is a function of the state it stopped in, never of
// the wording a report chose: a remaining P0, or any required quality gate that
// failed at the terminal stop, is a FAIL; a remaining P1, or a search-debt
// obligation the run never covered, is a CONDITIONAL; and anything else is a PASS
// that still records whether P2 advisories remain. The merged verdict and the
// per-lineage attribution verdict both read the rule from here, so one stop cannot
// be a failure in one table and a pass in another.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  assertKnownFlags,
} = require('./lib/cli-guards.cjs');

const {
  readJsonObjectFile,
  readStateLogRows,
} = require('./convergence.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Every key this entrypoint reads from the parsed arguments. A flag missing here
// is treated as an unknown option, so this list is the accepted set.
const REVIEW_VERDICT_FLAGS = ['registryPath', 'stateLog', 'activeP0', 'activeP1', 'activeP2', 'searchDebt', 'failedGateIds'];
// Any one of these flags means the caller already bound the counts in a merge, and
// the bound values are then the authority: re-reading the files could bind a state
// the merge never decided on.
const BOUND_VALUE_FLAGS = ['activeP0', 'activeP1', 'activeP2', 'searchDebt', 'failedGateIds'];
// A verdict is a report, not a mutation, so a FAIL is still a successful run and an
// unreadable input is the only condition that stops the script.
const EXIT_ERROR = 2;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function isActiveFinding(finding) {
  return (finding?.disposition ?? finding?.status) === 'active';
}

// A per-lineage verdict must apply the same active-disposition guard an active
// count uses, not the registry's raw findingsBySeverity — a raw count can include
// findings that were since resolved, which would let one report's verdict diverge
// from another's over the same findings.
function activeReviewSeverityCounts(registry) {
  const openFindings = Array.isArray(registry?.openFindings) ? registry.openFindings : [];
  const active = openFindings.filter(isActiveFinding);
  return {
    P0: active.filter((finding) => finding?.severity === 'P0').length,
    P1: active.filter((finding) => finding?.severity === 'P1').length,
    P2: active.filter((finding) => finding?.severity === 'P2').length,
  };
}

// Open search debt is one obligation per bug class the search path still owes. A
// registry written before the ledger existed carries no array, which owes nothing
// rather than an unknown amount.
function openSearchDebtCount(registry) {
  return Array.isArray(registry?.searchDebt) ? registry.searchDebt.length : 0;
}

// One shape for the ids a report prints, whatever order and however many times a
// caller bound them.
function normalizeGateIds(ids) {
  const values = Array.isArray(ids) ? ids : [];
  return [...new Set(values.map((id) => String(id)).filter(Boolean))].sort();
}

// The state log is the first source: the reducer can run before the terminal-gates
// row is written, so a registry can predate it. A required gate the lineage still
// failed is a stop no verdict may read as a pass.
function lineageFailedRequiredGateIds({ registry, stateRecords }) {
  const latest = (Array.isArray(stateRecords) ? stateRecords : [])
    .filter((record) => record?.type === 'event' && record?.event === 'terminal_gates')
    .at(-1);
  const ids = latest ? latest.failedRequiredGateIds : registry?.terminalGates?.failedRequiredGateIds;
  return normalizeGateIds(ids);
}

function deriveReviewVerdict({
  activeP0 = 0,
  activeP1 = 0,
  activeP2 = 0,
  openSearchDebt = 0,
  failedRequiredGateIds = [],
} = {}) {
  const failedGateIds = Array.isArray(failedRequiredGateIds) ? failedRequiredGateIds : [];
  let verdict = 'PASS';
  if (activeP0 > 0 || failedGateIds.length > 0) verdict = 'FAIL';
  else if (activeP1 > 0 || openSearchDebt > 0) verdict = 'CONDITIONAL';
  // Advisories mark a pass that carried suggestions; they never lift the verdict
  // above PASS and never change one.
  return { verdict, hasAdvisories: verdict === 'PASS' && activeP2 > 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLI ENTRY
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw inputError(`Unexpected positional argument: ${token}`);
    const key = token.slice(2).replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
    const next = argv[index + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function pathArg(args, key, flag) {
  const value = args[key];
  if (typeof value !== 'string' || value === '') throw inputError(`--${flag} requires a value`);
  return value;
}

function countArg(args, key, flag) {
  const value = args[key];
  if (typeof value !== 'string' || value === '') throw inputError(`--${flag} requires a value`);
  const count = Number(value);
  if (!Number.isInteger(count) || count < 0) {
    throw inputError(`--${flag} must be a non-negative integer: ${value}`);
  }
  return count;
}

// The gate ids arrive as the JSON array a merge wrote, so a caller cannot pass a
// comma-joined string whose ids would be read as one unknown gate.
function gateIdsArg(args) {
  const value = args.failedGateIds;
  if (typeof value !== 'string' || value === '') throw inputError('--failed-gate-ids requires a value');
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw inputError(`--failed-gate-ids must be a JSON array: ${value}`);
  }
  if (!Array.isArray(parsed)) throw inputError(`--failed-gate-ids must be a JSON array: ${value}`);
  return normalizeGateIds(parsed);
}

function boundVerdictInputs(args) {
  return {
    activeP0: countArg(args, 'activeP0', 'active-p0'),
    activeP1: countArg(args, 'activeP1', 'active-p1'),
    activeP2: countArg(args, 'activeP2', 'active-p2'),
    openSearchDebt: countArg(args, 'searchDebt', 'search-debt'),
    failedRequiredGateIds: gateIdsArg(args),
  };
}

function registryVerdictInputs(args) {
  const registryPath = pathArg(args, 'registryPath', 'registry-path');
  const stateLogPath = pathArg(args, 'stateLog', 'state-log');
  const registry = readJsonObjectFile(registryPath, 'registryPath');
  const counts = activeReviewSeverityCounts(registry);
  return {
    activeP0: counts.P0,
    activeP1: counts.P1,
    activeP2: counts.P2,
    openSearchDebt: openSearchDebtCount(registry),
    failedRequiredGateIds: lineageFailedRequiredGateIds({
      registry,
      stateRecords: readStateLogRows(stateLogPath),
    }),
  };
}

function resolveVerdictInputs(args) {
  const bound = BOUND_VALUE_FLAGS.some((key) => args[key] !== undefined);
  return bound ? boundVerdictInputs(args) : registryVerdictInputs(args);
}

function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    assertKnownFlags(args, REVIEW_VERDICT_FLAGS, inputError);
    const inputs = resolveVerdictInputs(args);
    const { verdict, hasAdvisories } = deriveReviewVerdict(inputs);
    jsonOut({
      status: 'ok',
      verdict,
      has_advisories: hasAdvisories,
      active_p0: inputs.activeP0,
      active_p1: inputs.activeP1,
      active_p2: inputs.activeP2,
      search_debt: inputs.openSearchDebt,
      failed_required_gate_ids: normalizeGateIds(inputs.failedRequiredGateIds),
    });
    return 0;
  } catch (error) {
    jsonOut({ status: 'error', error: error instanceof Error ? error.message : String(error) });
    return EXIT_ERROR;
  }
}

if (require.main === module) {
  process.exitCode = main();
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  activeReviewSeverityCounts,
  deriveReviewVerdict,
  lineageFailedRequiredGateIds,
  main,
  openSearchDebtCount,
};
