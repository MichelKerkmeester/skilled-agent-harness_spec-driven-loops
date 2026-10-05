#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Iteration Leaf Verification
// ───────────────────────────────────────────────────────────────────

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
//
// A leaf can also satisfy every shape check above by writing the state-log
// record directly instead of through the append gateway, which leaves the
// projection looking complete while the ledger holds nothing behind it. This
// check cross-checks the state log against check-direct-append.cjs's gateway
// watermark so a receipt-less projection cannot be counted as a verified
// iteration once the mode has actually moved to ledger authority.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseIterationMarkdownFindings, deltaRowIteration } = require('../lib/deep-loop/iteration-findings.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const LEAF_BY_LOOP = {
  review: 'deep-review',
  research: 'deep-research',
};

const STATE_LOG_BY_LOOP = {
  review: 'deep-review-state.jsonl',
  research: 'deep-research-state.jsonl',
};

// Matches each mode's `artifactId` in its legacy projection contract
// (runtime/lib/legacy-projections/*-contract.ts) -- the key check-direct-append.cjs
// uses to locate the gateway's watermark under the packet root.
const ARTIFACT_ID_BY_LOOP = {
  review: 'review-state',
  research: 'research-state',
};

const CHECK_DIRECT_APPEND_CLI = path.join(__dirname, 'check-direct-append.cjs');

const REASONS = {
  DISPATCH_FAILED: 'dispatch_failed',
  ITERATION_FILE_MISSING: 'iteration_file_missing',
  ITERATION_VERDICT_MISSING: 'iteration_verdict_missing',
  STATE_RECORD_MISSING: 'state_record_missing',
  ROUTE_PROOF_MISSING: 'route_proof_missing',
  ROUTE_PROOF_MISMATCH: 'route_proof_mismatch',
  DELTA_FILE_MISSING: 'delta_file_missing',
  STATE_LOG_MALFORMED: 'state_log_malformed',
  DELTA_FILE_MALFORMED: 'delta_file_malformed',
  FINDINGS_NOT_ENUMERATED: 'findings_not_enumerated',
  GATEWAY_BYPASS_DETECTED: 'gateway_bypass_detected',
  LEDGER_BACKING_MISSING: 'ledger_backing_missing',
};

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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

// Read a JSONL file and retain malformed-line evidence so the gate can fail closed.
function readJsonlRecords(filePath) {
  return readJsonlRecordsDetailed(filePath).records;
}

function readJsonlRecordsDetailed(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return { records: null, malformedLines: [] };
  }
  const records = [];
  const malformedLines = [];
  let lineNumber = 0;
  for (const line of raw.split('\n')) {
    lineNumber += 1;
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed));
    } catch (_) {
      malformedLines.push(lineNumber);
    }
  }
  return { records, malformedLines };
}

function hasReadableFindingValue(value) {
  if (typeof value === 'string') return value.trim() !== '';
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return [value.title, value.summary, value.text, value.finding, value.description]
    .some(hasReadableFindingValue);
}

function hasReadableFindingText(record) {
  return [record.title, record.label, record.finding, record.text, record.claim, record.summary]
    .some(hasReadableFindingValue);
}

function hasReadableResearchCandidate(candidate) {
  if (typeof candidate === 'string') return candidate.trim() !== '';
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
  return [candidate.title, candidate.summary, candidate.text, candidate.finding, candidate.description]
    .some(hasReadableFindingValue);
}

function researchFindingEnumerationCounts(record, deltaRecords, narrative, iteration, narrativePath) {
  const structured = [record.keyFindings, record.findings, record.findingDetails]
    .find((value) => Array.isArray(value) && value.length > 0);
  if (structured) return structured.every(hasReadableResearchCandidate) ? [structured.length] : [];
  const markdownCount = parseIterationMarkdownFindings(narrative, iteration, narrativePath).length;
  const graphCount = Array.isArray(record.graphEvents)
    ? record.graphEvents.filter((event) => event?.type === 'node'
      && event?.kind === 'FINDING'
      && [event.label, event.title, event.text].some(hasReadableFindingValue)).length
    : 0;
  // The merge files a delta row under the row's own iteration and falls back to the
  // file's number only when the row has none, so count exactly the rows it will
  // attribute here. A row keyed to another iteration must not satisfy this one.
  const deltaCount = deltaRecords.filter((row) => row
    && row.type === 'finding'
    && hasReadableFindingText(row)
    && deltaRowIteration(row, iteration) === iteration).length;
  return [markdownCount, graphCount, deltaCount];
}

function isRankedReviewFinding(finding, idFields) {
  return Boolean(finding)
    && typeof finding === 'object'
    && !Array.isArray(finding)
    && ['P0', 'P1', 'P2'].includes(finding.finalSeverity || finding.severity)
    && idFields.some((field) => typeof finding[field] === 'string' && finding[field].trim() !== '');
}

// A review findingsCount is the running total of active findings, so an iteration
// that adds nothing still carries a positive count that earlier iterations listed.
// The claim this iteration makes is findingsNew, which the contract allows in two
// shapes: a list of new-finding entries, or a {P0,P1,P2} count object. The total
// stands in only when a record carries neither.
function reviewNewFindingsClaim(record) {
  const added = record.findingsNew;
  if (Array.isArray(added)) return added.length;
  if (added && typeof added === 'object') {
    const counts = ['P0', 'P1', 'P2']
      .filter((key) => key in added)
      .map((key) => Number(added[key]))
      .filter(Number.isFinite);
    if (counts.length > 0) return Math.floor(counts.reduce((sum, value) => sum + Math.max(0, value), 0));
  }
  return Math.floor(Number(record.findingsCount));
}

// A review count is often the iteration's new findings while findingDetails lists
// every active one, and the reducer pads totals the details do not cover, so the
// two are not held equal. A positive claim needs a readable finding behind it, from
// any source the reducer reads, each read the way the reducer reads it: complete
// findingDetails, a ranked delta finding row whose numeric iteration is this one,
// or severity bullets in a narrative named exactly iteration-NNN.md, the only name
// the reducer loads, parsed by its own parser. Severity is adjudicated first.
function reviewFindingsAreEnumerated(record, deltaRecords, iteration, narrativePath) {
  const details = record.findingDetails;
  if (Array.isArray(details) && details.length > 0
    && details.every((finding) => isRankedReviewFinding(finding, ['id', 'findingId', 'title']))) {
    return true;
  }
  const listedInDelta = deltaRecords.some((row) => row
    && row.type === 'finding'
    && isRankedReviewFinding(row, ['id'])
    && typeof row.iteration === 'number'
    && row.iteration === iteration);
  if (listedInDelta) return true;
  if (!/^iteration-\d+\.md$/.test(path.basename(narrativePath))) return false;
  const { parseIterationFile } = require('./reduce-state.cjs');
  return parseIterationFile(narrativePath).findings.length > 0;
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

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

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

// Cross-check the projected state log against check-direct-append.cjs's gateway
// watermark. That script already knows how to read a mode's authority state and
// stays inert (status 'not-enforced') until the mode has actually cut over to
// ledger authority, so this call is a no-op everywhere a mode still runs on the
// legacy writer -- it only turns into a real finding once ledger authority is
// live and the watermark disagrees with (or is missing for) the file on disk.
// artifactRoot is the packet root ONE level above artifactDir: the gateway's
// --run-directory is that packet root, and both the projection's relativePath
// ("review/deep-review-state.jsonl") and the watermark directory
// (".legacy-projection-watermarks/") resolve from it, not from artifactDir itself.
function checkGatewayReceipt(loopType, artifactDir, legacyFilePath) {
  const leaf = LEAF_BY_LOOP[loopType];
  const artifactId = ARTIFACT_ID_BY_LOOP[loopType];
  if (!leaf || !artifactId) return { status: 'skipped' };

  let spawned;
  try {
    spawned = spawnSync(process.execPath, [
      CHECK_DIRECT_APPEND_CLI,
      '--mode', leaf,
      '--artifact-root', path.dirname(artifactDir),
      '--artifact-id', artifactId,
      '--legacy-file', legacyFilePath,
    ], { encoding: 'utf8', timeout: 15000 });
  } catch (error) {
    return { status: 'error', detail: `check-direct-append spawn failed: ${error instanceof Error ? error.message : String(error)}` };
  }
  if (spawned.error) {
    return { status: 'error', detail: `check-direct-append spawn failed: ${spawned.error.message}` };
  }

  const lastLine = (spawned.stdout || '').trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '';
  let payload = null;
  try { payload = JSON.parse(lastLine); } catch (_) { /* handled as inconclusive below */ }

  if (spawned.status === 2 && payload) {
    return { status: 'violation', detail: payload.reason || `check-direct-append reported ${payload.code || 'a violation'}`, payload };
  }
  if (spawned.status === 0 && payload) {
    return { status: payload.status === 'not-enforced' ? 'not-enforced' : 'ok', payload };
  }
  return { status: 'error', detail: `check-direct-append exited ${spawned.status} with unreadable output: ${(spawned.stdout || spawned.stderr || '').slice(0, 200)}` };
}

// Structural ledger-backing check. Under ledger authority the gateway roots the
// mode's own append-only ledger ({leaf}-ledger) at its run directory and writes an
// event there for every iteration it records. A complete-looking projection record
// with no such ledger behind it is a leaf that wrote the projection directly, so the
// ledger and the projection have silently diverged. The run directory is the artifact
// dir for lineage-rooted modes and its parent for packet-rooted ones, so the ledger
// is accepted at either level; its total absence is the divergence signal. Returns
// 'not-enforced' before a mode moves to ledger authority (the legacy writer is
// sanctioned then), and 'skipped' when authority cannot be read (fail-open).
function checkLedgerBacking(loopType, artifactDir, legacyFilePath) {
  const leaf = LEAF_BY_LOOP[loopType];
  if (!leaf || !ARTIFACT_ID_BY_LOOP[loopType]) return { status: 'skipped' };
  const authority = checkGatewayReceipt(loopType, artifactDir, legacyFilePath);
  if (authority.status !== 'violation' && authority.status !== 'ok') {
    return { status: 'not-enforced', authority: authority.status };
  }
  const roots = [
    { root: artifactDir, kind: 'artifact-dir' },
    { root: path.dirname(artifactDir), kind: 'parent-of-lineage' },
  ];
  const match = roots.find(({ root }) => {
    const framesDir = path.join(root, `${leaf}-ledger`, 'frames');
    try {
      return fs.existsSync(framesDir) && fs.readdirSync(framesDir).some((f) => f.endsWith('.frame'));
    } catch (_) {
      return false;
    }
  });
  if (!match) return { status: 'unbacked' };
  return {
    status: 'backed',
    framesRoot: path.join(match.root, `${leaf}-ledger`, 'frames'),
    framesRootKind: match.kind,
  };
}

function readReceipt(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// The audited dispatch wrapper returns 0 for every executor outcome and records
// the child's exit in a completion receipt, the one record of it that survives:
// a dispatch_failure line it writes to the state log is gone at the next gateway
// refresh. So when an iteration left nothing behind, the latest completion receipt
// for that iteration says whether the executor failed, and how.
function dispatchFailure(artifactDir, iteration) {
  const receiptDir = path.join(artifactDir, 'dispatch-receipts');
  let names;
  try {
    names = fs.readdirSync(receiptDir);
  } catch {
    return null;
  }
  const latest = names
    .filter((name) => /^dispatch-.+\.completion\.json$/u.test(name) && !/\.attempt-\d+\.completion\.json$/u.test(name))
    .map((name) => ({ name, receipt: readReceipt(path.join(receiptDir, name)) }))
    .filter(({ receipt }) => receipt?.facts?.iteration === iteration)
    .sort((a, b) => String(b.receipt.issuedAt).localeCompare(String(a.receipt.issuedAt)))[0];
  if (!latest) return null;
  const { exitStatus, signal, executor } = latest.receipt.facts;
  const exited = typeof exitStatus === 'number' && exitStatus !== 0;
  if (!exited && !signal) return null;
  const dispatchId = latest.receipt.dispatchId;
  const intent = readReceipt(path.join(receiptDir, `dispatch-${dispatchId}.intent.json`));
  const seconds = intent ? Math.round((Date.parse(latest.receipt.issuedAt) - Date.parse(intent.issuedAt)) / 1000) : NaN;
  const timeout = Number(executor?.timeoutSeconds);
  const parts = [`${executor?.kind ?? 'executor'} ${signal ? `killed by ${signal}` : `exited ${exitStatus}`}`];
  if (Number.isFinite(seconds)) {
    parts.push(Number.isFinite(timeout) && seconds >= timeout - 2 ? `after ${seconds} s, at the ${timeout} s executor timeout` : `after ${seconds} s`);
  }
  const earlier = names.filter((name) => name.startsWith(`dispatch-${dispatchId}.attempt-`) && name.endsWith('.completion.json')).length;
  if (earlier > 0) parts.push(`${earlier} earlier attempt(s) kept as dispatch-${dispatchId}.attempt-N`);
  return `dispatch ${dispatchId}: ${parts.join(', ')}; no iterations/iteration-${pad3(iteration)}*.md written`;
}

function verify(loopType, artifactDir, iteration) {
  const leaf = LEAF_BY_LOOP[loopType];
  const stateLogName = STATE_LOG_BY_LOOP[loopType];

  // 1. Iteration narrative markdown.
  const narrativePath = findIterationNarrative(path.join(artifactDir, 'iterations'), iteration);
  if (!narrativePath) {
    const failure = dispatchFailure(artifactDir, iteration);
    if (failure) return { ok: false, reason: REASONS.DISPATCH_FAILED, detail: failure };
    return { ok: false, reason: REASONS.ITERATION_FILE_MISSING, detail: `no iterations/iteration-${pad3(iteration)}*.md under ${artifactDir}` };
  }
  const narrative = fs.readFileSync(narrativePath, 'utf8');
  if (!narrative.trim()) {
    return { ok: false, reason: REASONS.ITERATION_FILE_MISSING, detail: `${narrativePath} is empty` };
  }
  // Review narratives must end on exactly one machine-readable verdict; research/context
  // use a different closing shape, so only review enforces the verdict line here.
  // Shape only: this reads the line's format, never whether it agrees with the findings, so a
  // PASS written above active P1 findings passes here. The line is the leaf's own report; the
  // verdict that governs a release is recomputed from the findings registry, and in a fan-out
  // run the cross-lineage merge turns any active P0 into a merged FAIL.
  if (loopType === 'review') {
    const verdictPattern = /^Review verdict:\s*(PASS|CONDITIONAL|FAIL)\s*$/i;
    const verdictLines = narrative.split(/\r?\n/).filter((line) => verdictPattern.test(line));
    const finalLine = narrative.trimEnd().split(/\r?\n/).at(-1) ?? '';
    if (verdictLines.length !== 1 || !verdictPattern.test(finalLine)) {
      return { ok: false, reason: REASONS.ITERATION_VERDICT_MISSING, detail: `${narrativePath} must end with exactly one "Review verdict: PASS|CONDITIONAL|FAIL" line` };
    }
  }

  // 2. Canonical state-log record for this iteration. Existence must come from the
  // projection -- the gateway is its only writer -- but the route proof may not: the
  // ledger upcast keeps no leaf dispatch fields, so every re-projection rebuilds the
  // state log without them. The leaf's own delta record always carries them.
  const stateLogPath = path.join(artifactDir, stateLogName);
  const stateLog = readJsonlRecordsDetailed(stateLogPath);
  if (stateLog.malformedLines.length > 0) {
    return { ok: false, reason: REASONS.STATE_LOG_MALFORMED, detail: `${stateLogName} contains malformed JSONL at line(s) ${stateLog.malformedLines.join(', ')}` };
  }
  const stateRecords = stateLog.records;
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

  // 3. Per-iteration delta file with at least one iteration record.
  const deltaLog = readJsonlRecordsDetailed(path.join(artifactDir, 'deltas', `iter-${pad3(iteration)}.jsonl`));
  if (deltaLog.malformedLines.length > 0) {
    return { ok: false, reason: REASONS.DELTA_FILE_MALFORMED, detail: `deltas/iter-${pad3(iteration)}.jsonl contains malformed JSONL at line(s) ${deltaLog.malformedLines.join(', ')}` };
  }
  const deltaRecords = deltaLog.records;
  if (!deltaRecords || !deltaRecords.some((r) => r && r.type === 'iteration')) {
    return { ok: false, reason: REASONS.DELTA_FILE_MISSING, detail: `deltas/iter-${pad3(iteration)}.jsonl missing or has no type=iteration record` };
  }

  const claimedFindingsCount = loopType === 'review'
    ? reviewNewFindingsClaim(iterationRecord)
    : Math.floor(Number(iterationRecord.findingsCount));
  if (Number.isFinite(claimedFindingsCount) && claimedFindingsCount > 0) {
    const enumerated = loopType === 'review'
      ? reviewFindingsAreEnumerated(iterationRecord, deltaRecords, iteration, narrativePath)
      : researchFindingEnumerationCounts(iterationRecord, deltaRecords, narrative, iteration, narrativePath)
        .includes(claimedFindingsCount);
    if (!enumerated) {
      return {
        ok: false,
        reason: REASONS.FINDINGS_NOT_ENUMERATED,
        detail: loopType === 'review'
          ? `iteration ${iteration} claims ${claimedFindingsCount} new finding(s) but its findingDetails, delta finding rows and Markdown severity sections list no P0/P1/P2 finding behind it`
          : `iteration ${iteration} claims findingsCount=${claimedFindingsCount} but its structured state, Markdown, graph events, or delta rows do not enumerate that many findings`,
      };
    }
  }

  // 4. Route proof, preferring the projection and falling back to the delta the leaf
  // wrote itself. The delta is the authoritative record of the dispatch, so reading it
  // is not a relaxation: it is the same evidence the projection was built from, taken
  // before the projection dropped it. Only a mismatch in BOTH is a failure.
  const routeWarnings = [];
  const stateRouteReason = checkRouteProof(iterationRecord, loopType, leaf);
  const deltaRouteReason = checkRouteProof(deltaRecords.findLast((r) => r && r.type === 'iteration'), loopType, leaf);
  if (stateRouteReason && deltaRouteReason) {
    return {
      ok: false,
      reason: stateRouteReason,
      detail: `iteration ${iteration} failed route-proof in both the state record and deltas/iter-${pad3(iteration)}.jsonl (expected mode=${loopType} target_agent=${leaf})`,
    };
  }
  if (stateRouteReason) {
    routeWarnings.push(`route proof for iteration ${iteration} came from deltas/iter-${pad3(iteration)}.jsonl; the ${stateLogName} projection carries no leaf dispatch fields`);
  }

  // 2b. Structural ledger-backing gate (default on; DEEP_LOOP_LEDGER_BACKING_GATE=0
  // disables it as an emergency escape). Under ledger authority a complete-looking
  // iteration record with no mode ledger behind it means the leaf wrote the projection
  // directly, bypassing the gateway -- exactly the divergence where the reducer would
  // otherwise build a report from projection-only state. Fail the iteration loudly.
  let ledgerBacking = { status: 'disabled' };
  if (process.env.DEEP_LOOP_LEDGER_BACKING_GATE !== '0') {
    ledgerBacking = checkLedgerBacking(loopType, artifactDir, stateLogPath);
    if (ledgerBacking.status === 'unbacked') {
      return {
        ok: false,
        reason: REASONS.LEDGER_BACKING_MISSING,
        detail: `iteration ${iteration}: ${stateLogName} shows a complete iteration but no ${leaf}-ledger events back it — the gateway was bypassed under ledger authority`,
      };
    }
  }
  // Every measured gateway invocation roots the ledger at the artifact directory,
  // so a match through the parent-of-lineage directory still passes (the path is
  // legitimate) but is reported instead of silently accepted: the producer path
  // has to be visible on the result so a vestigial root cannot hide.
  const ledgerRootWarning = ledgerBacking.status === 'backed'
    && ledgerBacking.framesRootKind === 'parent-of-lineage'
    ? `ledger frames for ${stateLogName} resolved through the parent-of-lineage directory: ${ledgerBacking.framesRoot}`
    : null;

  // 2c. The state log should be backed by the append gateway's ledger, not merely
  // shaped like a complete record: a leaf that writes the projection directly
  // produces an indistinguishable type=iteration record with no ledger event
  // behind it. This corroboration is opt-in: the modes are mid-migration and not
  // every correct path publishes a projection watermark yet, so enforcing here
  // would false-alarm on legitimate iterations. When explicitly enabled it is
  // advisory only -- a warning, never a hard failure -- so a real bypass stays
  // visible without blocking a possibly-valid iteration. The unambiguous, always-on
  // defense against a leaf that skips the gateway is the prompt-pack contract,
  // which now states plainly that the gateway call is required and in-scope.
  const gatewayCheck = process.env.DEEP_LOOP_VERIFY_GATEWAY_RECEIPT === '1'
    ? checkGatewayReceipt(loopType, artifactDir, stateLogPath)
    : { status: 'skipped' };
  const gatewayWarning = gatewayCheck.status === 'violation'
    ? `possible direct state-log write for ${stateLogName} (no matching gateway receipt): ${gatewayCheck.detail}`
    : gatewayCheck.status === 'error'
      ? `gateway receipt check inconclusive for ${stateLogName}: ${gatewayCheck.detail}`
      : null;

  const warnings = [...routeWarnings, gatewayWarning, ledgerRootWarning].filter(Boolean);
  return {
    ok: true,
    reason: null,
    detail: `iteration ${iteration} complete: narrative + route-proof + delta`,
    ledgerBacking,
    ...(warnings.length > 0 ? { warnings } : {}),
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(`Usage: verify-iteration.cjs --loop-type ${Object.keys(LEAF_BY_LOOP).join('|')} --artifact-dir <dir> --iteration <N> [--json]\n`);
    return 0;
  }
  if (args.error) { process.stderr.write(`${args.error}\n`); return 2; }
  if (!args.loopType || !LEAF_BY_LOOP[args.loopType]) { process.stderr.write(`--loop-type must be one of ${Object.keys(LEAF_BY_LOOP).join('|')}\n`); return 2; }
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
  // Warnings ride on an ok:true result, so a plain OK line would otherwise hide
  // them from a human running this outside --json.
  if (result.warnings) {
    for (const warning of result.warnings) process.stderr.write(`WARNING ${warning}\n`);
  }
  return result.ok ? 0 : 1;
}

if (require.main === module) {
  process.exit(main());
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = { verify, checkGatewayReceipt, checkLedgerBacking, checkRouteProof, findIterationNarrative, readJsonlRecords, readJsonlRecordsDetailed, pad3, REASONS, LEAF_BY_LOOP, STATE_LOG_BY_LOOP, ARTIFACT_ID_BY_LOOP };
