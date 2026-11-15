#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Terminal Gate Results
// ───────────────────────────────────────────────────────────────────

// A review that stops records three terminal gates: the cited evidence behind
// its findings, whether those findings sit inside the reviewed scope, and the
// dimension coverage behind its stop. Judged from prose, a gate passes on the
// writer's word; computed here from loop state, the same state always reports
// the same three verdicts. Each row carries a digest of the summary it was
// decided from, so a later reader can tell two passes on the same state from
// two passes on different state without keeping the state itself.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const fs = require('node:fs');

const {
  assertKnownFlags,
} = require('./lib/cli-guards.cjs');

const {
  buildStopDecisionInput,
  evaluateReviewLegalStopGates,
  readJsonObjectFile,
  readStateLogRows,
} = require('./convergence.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EVIDENCE_GATE_ID = 'evidence';
const SCOPE_GATE_ID = 'scope';
const COVERAGE_GATE_ID = 'coverage';
// Every key this entrypoint reads from the parsed arguments. A flag missing
// here is treated as an unknown option, so this list is the accepted set.
const TERMINAL_GATE_FLAGS = ['configPath', 'registryPath', 'stateLog'];
// A gate result is a report, not a verdict on the run: a failed row changes no
// state, so an unreadable input is the only condition that stops the script.
const EXIT_ERROR = 2;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function numberOrZero(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

// A scope entry and a finding file reach this script from different machines,
// so both are compared in one spelling: a checkout's separator and its
// relative prefix must not decide whether a finding is inside the scope.
function normalizePath(value) {
  return value.replace(/\\/gu, '/').replace(/^\.\//u, '');
}

// The config records scope as a list, or as named lists once a review splits
// its target by kind; both spellings name the same reviewed paths.
function scopeEntries(reviewScopeFiles) {
  const entries = [];
  const collect = (values) => {
    for (const value of values) {
      if (typeof value !== 'string' || value === '') continue;
      const entry = normalizePath(value);
      if (entry !== '') entries.push(entry);
    }
  };
  if (Array.isArray(reviewScopeFiles)) {
    collect(reviewScopeFiles);
  } else if (isPlainObject(reviewScopeFiles)) {
    for (const value of Object.values(reviewScopeFiles)) {
      if (Array.isArray(value)) collect(value);
    }
  }
  return entries;
}

function findingFilePaths(registry) {
  const openFindings = Array.isArray(registry.openFindings) ? registry.openFindings : [];
  const paths = [];
  for (const finding of openFindings) {
    if (!isPlainObject(finding) || typeof finding.file !== 'string' || finding.file === '') continue;
    paths.push(normalizePath(finding.file));
  }
  return paths;
}

// A finding is inside the scope when the entry is the file itself or a
// directory that contains it. A finding recorded on another checkout arrives as
// an absolute path, so an absolute path also counts as inside when the entry is
// its suffix; two relative paths are already in one spelling, and admitting a
// suffix there would let the entry name any file of the same basename.
function isAbsolutePath(file) {
  return file.startsWith('/') || /^[A-Za-z]:\//u.test(file);
}

function isInScope(file, entry) {
  if (file === entry) return true;
  if (isAbsolutePath(file) && file.endsWith(`/${entry}`)) return true;
  if (entry.endsWith('/') && file.startsWith(entry)) return true;
  return file.startsWith(`${entry}/`);
}

function digestOf(summary) {
  return createHash('sha256').update(JSON.stringify(summary)).digest('hex');
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function evidenceGateRow(facts, gates) {
  const pass = gates.evidenceDensityGate?.pass === true;
  return {
    gateId: EVIDENCE_GATE_ID,
    status: pass ? 'pass' : 'fail',
    reasonCode: pass ? 'all-findings-cited' : 'uncited-findings',
    evidenceDigest: digestOf({
      activeP0: numberOrZero(facts.activeP0),
      activeP1: numberOrZero(facts.activeP1),
      evidenceBackedP0P1: numberOrZero(facts.evidenceBackedP0P1),
    }),
  };
}

function scopeGateRow(config, registry) {
  const entries = scopeEntries(config.reviewScopeFiles);
  const files = findingFilePaths(registry);
  const outOfScopeFiles = [...new Set(
    files.filter((file) => !entries.some((entry) => isInScope(file, entry))),
  )].sort();
  // A review with no recorded scope cannot show that its findings were in it,
  // so the row fails on the missing record rather than on the files.
  const pass = outOfScopeFiles.length === 0;
  let reasonCode = 'all-findings-in-scope';
  if (!pass && entries.length === 0) reasonCode = 'scope-unrecorded';
  else if (!pass) reasonCode = 'findings-out-of-scope';
  return {
    gateId: SCOPE_GATE_ID,
    status: pass ? 'pass' : 'fail',
    reasonCode,
    evidenceDigest: digestOf({
      outOfScopeFiles,
      entryCount: entries.length,
    }),
  };
}

function coverageGateRow(facts, gates) {
  const missingDimensions = Array.isArray(facts.missingDimensions) ? facts.missingDimensions : [];
  const pass = gates.dimensionCoverageGate?.pass === true;
  // The failure names the first reason the coverage is short: a dimension that
  // was never recorded, a cross-reference that was never closed, or coverage
  // that is too old to describe the state the stop is judged on.
  let reasonCode = 'coverage-too-young';
  if (pass) reasonCode = 'coverage-complete';
  else if (missingDimensions.length > 0) reasonCode = 'missing-dimensions';
  else if (facts.traceabilityCovered !== true) reasonCode = 'traceability-incomplete';
  return {
    gateId: COVERAGE_GATE_ID,
    status: pass ? 'pass' : 'fail',
    reasonCode,
    evidenceDigest: digestOf({
      missingDimensions,
      traceabilityCovered: facts.traceabilityCovered === true,
      coverageAge: numberOrZero(facts.coverageAge),
    }),
  };
}

// The reviewed scope stays out of the stop-decision input: it decides where a
// finding was recorded, not whether the loop may stop.
function computeTerminalGates(files = {}) {
  const source = isPlainObject(files) ? files : {};
  const config = isPlainObject(source.config) ? source.config : {};
  const registry = isPlainObject(source.registry) ? source.registry : {};
  const stateLogRows = Array.isArray(source.stateLogRows) ? source.stateLogRows : [];

  const input = buildStopDecisionInput({}, 'review', { config, registry, stateLogRows }, null);
  const facts = isPlainObject(input?.review) ? input.review : {};
  const gates = evaluateReviewLegalStopGates(facts).gates;
  const gateResults = [
    evidenceGateRow(facts, gates),
    scopeGateRow(config, registry),
    coverageGateRow(facts, gates),
  ];

  return {
    gateResults,
    failedRequiredGateIds: gateResults
      .filter((row) => row.status === 'fail')
      .map((row) => row.gateId),
  };
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

function readTerminalGateFiles(args) {
  const configPath = pathArg(args, 'configPath', 'config-path');
  const stateLogPath = pathArg(args, 'stateLog', 'state-log');
  const registryPath = typeof args.registryPath === 'string' && args.registryPath !== ''
    ? args.registryPath
    : null;
  return {
    config: readJsonObjectFile(configPath, 'configPath'),
    stateLogRows: readStateLogRows(stateLogPath),
    // An absent registry is a loop with no recorded findings yet, not a broken
    // request; only a present-but-unreadable registry file is an error.
    registry: registryPath === null || !fs.existsSync(registryPath)
      ? {}
      : readJsonObjectFile(registryPath, 'registryPath'),
  };
}

function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    assertKnownFlags(args, TERMINAL_GATE_FLAGS, inputError);
    const result = computeTerminalGates(readTerminalGateFiles(args));
    jsonOut({
      status: 'ok',
      terminal_gate_results_json: result.gateResults,
      failed_required_gate_ids: result.failedRequiredGateIds,
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
  computeTerminalGates,
  main,
  parseArgs,
};
