#!/usr/bin/env node
'use strict';

// After-dispatch leaf-reliability check for the deep-loop iteration loop.
//
// A dispatched leaf owes THREE artifacts per iteration: the narrative markdown
// (iterations/iteration-NNN.md), an appended canonical state-log record, and a
// per-iteration delta file. The state-log record must also carry route-proof
// fields proving the leaf ran as itself (mode, target_agent, agent_definition_loaded,
// resolved_route). A model-driven loop is trusted to self-check today, which lets a
// silently-incomplete leaf advance the loop. This makes the check mechanical: exit
// non-zero with a single machine reason so the workflow can re-dispatch the same
// iteration once before recording an error and continuing.

const fs = require('node:fs');
const path = require('node:path');

const LEAF_BY_LOOP = {
  review: 'deep-review',
  research: 'deep-research',
  context: 'deep-context',
};

const STATE_LOG_BY_LOOP = {
  review: 'deep-review-state.jsonl',
  research: 'deep-research-state.jsonl',
  context: 'deep-context-state.jsonl',
};

const REASONS = {
  ITERATION_FILE_MISSING: 'iteration_file_missing',
  ITERATION_VERDICT_MISSING: 'iteration_verdict_missing',
  STATE_RECORD_MISSING: 'state_record_missing',
  ROUTE_PROOF_MISSING: 'route_proof_missing',
  ROUTE_PROOF_MISMATCH: 'route_proof_mismatch',
  DELTA_FILE_MISSING: 'delta_file_missing',
};

function pad3(n) {
  return String(n).padStart(3, '0');
}

function parseArgs(argv) {
  const out = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--loop-type') { out.loopType = argv[i + 1]; i += 1; }
    else if (a === '--artifact-dir') { out.artifactDir = argv[i + 1]; i += 1; }
    else if (a === '--iteration') { out.iteration = parseInt(argv[i + 1], 10); i += 1; }
    else if (a === '--json') { out.json = true; }
    else if (a === '--help' || a === '-h') { out.help = true; }
    else { out.error = `unknown flag: ${a}`; }
  }
  return out;
}

// Read a JSONL file and return parsed objects, skipping blank/malformed lines so a
// single corrupt append never crashes the gate.
function readJsonlRecords(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return null; // file absent/unreadable
  }
  const records = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed));
    } catch (_) {
      // skip malformed line
    }
  }
  return records;
}

// The narrative file is written as iteration-NNN.md but the leaf may append a
// descriptive suffix (iteration-NNN-some-focus.md), so match the padded number as a
// prefix bounded by "." or "-" to avoid confusing 002 with 020.
function findIterationNarrative(iterationsDir, iteration) {
  const nnn = pad3(iteration);
  let entries;
  try {
    entries = fs.readdirSync(iterationsDir);
  } catch (_) {
    return null;
  }
  const re = new RegExp(`^iteration-${nnn}(?:\\.md$|-.*\\.md$)`);
  for (const name of entries) {
    if (re.test(name)) return path.join(iterationsDir, name);
  }
  return null;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// Route-proof lives on the canonical iteration record. Absent fields => the leaf did
// not emit route-proof at all; present-but-wrong => it ran as something other than
// its own leaf identity or in the wrong mode.
function checkRouteProof(record, loopType, leaf) {
  const hasMode = 'mode' in record;
  const hasTarget = 'target_agent' in record;
  const hasLoaded = 'agent_definition_loaded' in record;
  const hasRoute = 'resolved_route' in record;
  if (!hasMode || !hasTarget || !hasLoaded || !hasRoute) {
    return REASONS.ROUTE_PROOF_MISSING;
  }
  if (
    record.mode !== loopType ||
    record.target_agent !== leaf ||
    record.agent_definition_loaded !== true ||
    !isNonEmptyString(record.resolved_route)
  ) {
    return REASONS.ROUTE_PROOF_MISMATCH;
  }
  return null;
}

function verify(loopType, artifactDir, iteration) {
  const leaf = LEAF_BY_LOOP[loopType];
  const stateLogName = STATE_LOG_BY_LOOP[loopType];

  // 1. Iteration narrative markdown.
  const narrativePath = findIterationNarrative(path.join(artifactDir, 'iterations'), iteration);
  if (!narrativePath) {
    return { ok: false, reason: REASONS.ITERATION_FILE_MISSING, detail: `no iterations/iteration-${pad3(iteration)}*.md under ${artifactDir}` };
  }
  const narrative = fs.readFileSync(narrativePath, 'utf8');
  if (!narrative.trim()) {
    return { ok: false, reason: REASONS.ITERATION_FILE_MISSING, detail: `${narrativePath} is empty` };
  }
  // Review narratives must end on a machine-readable verdict; research/context use a
  // different closing shape, so only review enforces the verdict line here.
  if (loopType === 'review' && !/Review verdict:\s*(PASS|CONDITIONAL|FAIL)/i.test(narrative)) {
    return { ok: false, reason: REASONS.ITERATION_VERDICT_MISSING, detail: `${narrativePath} lacks a "Review verdict: PASS|CONDITIONAL|FAIL" line` };
  }

  // 2. Canonical state-log record for this iteration + route-proof.
  const stateRecords = readJsonlRecords(path.join(artifactDir, stateLogName));
  // Review/research key the iteration number as `iteration`; context keys it as `run`.
  // Match either so one shim covers all three modes (a non-numeric run-id yields NaN
  // and never false-matches). Take the LAST matching record, not the first: the state
  // log is append-only, so a re-dispatched iteration appends a corrected record after
  // the bad one -- matching the first would keep reporting the stale failure and defeat
  // the bounded retry. The state reducer applies the same latest-record-wins rule.
  const iterationRecord = (stateRecords || []).findLast(
    (r) => r && r.type === 'iteration' && (Number(r.iteration) === iteration || Number(r.run) === iteration),
  );
  if (!iterationRecord) {
    return { ok: false, reason: REASONS.STATE_RECORD_MISSING, detail: `no type=iteration record with iteration=${iteration} in ${stateLogName}` };
  }
  const routeReason = checkRouteProof(iterationRecord, loopType, leaf);
  if (routeReason) {
    return { ok: false, reason: routeReason, detail: `iteration ${iteration} state record failed route-proof (expected mode=${loopType} target_agent=${leaf})` };
  }

  // 3. Per-iteration delta file with at least one iteration record.
  const deltaRecords = readJsonlRecords(path.join(artifactDir, 'deltas', `iter-${pad3(iteration)}.jsonl`));
  if (!deltaRecords || !deltaRecords.some((r) => r && r.type === 'iteration')) {
    return { ok: false, reason: REASONS.DELTA_FILE_MISSING, detail: `deltas/iter-${pad3(iteration)}.jsonl missing or has no type=iteration record` };
  }

  return { ok: true, reason: null, detail: `iteration ${iteration} complete: narrative + route-proof + delta` };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write('Usage: verify-iteration.cjs --loop-type review|research|context --artifact-dir <dir> --iteration <N> [--json]\n');
    return 0;
  }
  if (args.error) { process.stderr.write(`${args.error}\n`); return 2; }
  if (!args.loopType || !LEAF_BY_LOOP[args.loopType]) { process.stderr.write('--loop-type must be one of review|research|context\n'); return 2; }
  if (!args.artifactDir) { process.stderr.write('--artifact-dir is required\n'); return 2; }
  if (!Number.isInteger(args.iteration) || args.iteration < 1) { process.stderr.write('--iteration must be a positive integer\n'); return 2; }

  const result = verify(args.loopType, args.artifactDir, args.iteration);
  if (args.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else if (result.ok) {
    process.stdout.write(`OK ${result.detail}\n`);
  } else {
    process.stderr.write(`${result.reason} ${result.detail}\n`);
  }
  return result.ok ? 0 : 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { verify, checkRouteProof, findIterationNarrative, readJsonlRecords, pad3, REASONS, LEAF_BY_LOOP, STATE_LOG_BY_LOOP };
