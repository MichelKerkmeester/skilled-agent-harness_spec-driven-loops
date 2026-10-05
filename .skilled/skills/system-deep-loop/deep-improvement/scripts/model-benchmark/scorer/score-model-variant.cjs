#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-model-variant — decoupled 5-dimension scorer            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Score one candidate output on five weighted dimensions.         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Decoupled 5-dimension scorer for the deep-improvement model-benchmark
 * mode. Ported from the eval-loop score-variant and decoupled from the
 * fixture-JSON-file assumption per the 002 research (iteration 3):
 *
 *   - PUBLIC API takes PRIMITIVE CRITERIA + an absolute `cwd`, never a fixture
 *     file path. The caller (loop-host / run-benchmark adapter) extracts the
 *     criteria from its profile/fixture and passes them as data.
 *   - Internally it synthesizes an in-memory "virtual fixture" (with an absolute
 *     scope.cwd) and writes it to a temp JSON only so the proven deterministic
 *     check subprocesses + grader can consume it unchanged. det-check scripts
 *     resolve `path.resolve(PACKET_ROOT, scope.cwd)`, which is a no-op for an
 *     absolute cwd — so they are decoupled from this module's location.
 *   - D4 grader is pluggable via buildGraderFn(graderKind): 'llm' (real claude),
 *     'mock' (deterministic stub), 'noop' (D4=1.0), or 'jev' (hosted cascade).
 *     Default 'mock'.
 *
 * Seam contract:
 *   score({ candidateId, candidateHash, outputText, criteria, rubric?, cwd,
 *           graderKind?, graderMode?, mockMode? })
 *     -> { fixtureId, weightedScore, dimensions, hard_gate_failed,
 *          deterministic, grader, interaction_terms }
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execSync, spawnSync } = require('child_process');
const { buildJevGrader } = require('./classifier-score-model-variant.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCORER_ROOT = __dirname;
const DET_DIR = path.join(SCORER_ROOT, 'deterministic');
const harness = require(path.join(SCORER_ROOT, 'grader', 'harness.cjs'));
const dispute = require(path.join(SCORER_ROOT, 'grader', 'dispute.cjs'));

/**
 * Canonical 5-dim weights (D2 is the hard gate). Overridable via opts.rubric.
 *
 * @type {{ dims: Array<{ id: string, weight: number }> }}
 */
const DEFAULT_RUBRIC = {
  dims: [
    { id: 'D1', weight: 0.25 }, // acceptance (deterministic)
    { id: 'D2', weight: 0.3 }, // bundle gate (hard gate)
    { id: 'D3', weight: 0.2 }, // cwd / path correctness
    { id: 'D4', weight: 0.15 }, // grader (hallucination)
    { id: 'D5', weight: 0.1 }, // pre-planning
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

// Separator-bounded containment mirrors cwd-check.cjs. A path is inside `base`
// only when it is `base` or begins with `base + path.sep`, so siblings sharing a
// string prefix do not read as inside. This keeps criteria reads anchored.
function isInsideCwd(candidate, base) {
  return candidate === base || candidate.startsWith(base + path.sep);
}

// Resolve a criteria-supplied `a.file` against the absolute fixture cwd and
// reject any result that escapes the cwd (traversal or absolute outside).
// Returns the resolved absolute path, or null when the read is out of bounds.
function resolveCriteriaFile(cwdAbs, file) {
  if (typeof file !== 'string' || file.length === 0) return null;
  const resolved = path.resolve(cwdAbs, file);
  return isInsideCwd(resolved, cwdAbs) ? resolved : null;
}

function runDetCheck(scriptName, fixturePath, outputFile) {
  const script = path.join(DET_DIR, `${scriptName}.cjs`);
  const res = spawnSync('node', [script, fixturePath, outputFile], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.status !== 0) {
    return { score: 0.0, passed: false, error: res.stderr || res.stdout };
  }
  try {
    return JSON.parse(res.stdout.trim());
  } catch (e) {
    return { score: 0.0, passed: false, error: 'parse failure: ' + e.message };
  }
}

/**
 * Report whether profile-defined deterministic criteria may execute commands.
 *
 * Command execution is fail-closed: only DEEP_AGENT_ALLOW_CRITERIA_EXEC=1 or
 * DEEP_AGENT_ALLOW_CRITERIA_EXEC=true opts into executing profile commands.
 *
 * @returns {boolean} True when command execution is allowed by the env gate.
 */
function criteriaExecAllowed() {
  const raw = process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC;
  if (raw === '1' || raw === 'true') return true;
  console.warn('score-model-variant: criteria command skipped because DEEP_AGENT_ALLOW_CRITERIA_EXEC is not explicitly 1 or true.');
  return false;
}

/**
 * Score acceptance criteria deterministically against an absolute cwd.
 * Ported verbatim from score-variant.cjs (acceptance is the only check the
 * eval-loop did not ship as a standalone det-script). Operates on an absolute cwd.
 *
 * @param {Array<object>} acceptance - Acceptance criteria entries to evaluate
 * @param {string} cwdAbs - Absolute fixture cwd used to resolve criteria files
 * @returns {{ score: number, details: object }} Acceptance score and per-criterion details
 */
function scoreAcceptanceDeterministic(acceptance, cwdAbs) {
  const acc = acceptance || [];
  if (acc.length === 0) return { score: 1.0, details: { count: 0, note: 'no acceptance defined' } };
  const results = [];
  let pass = 0;
  for (const a of acc) {
    let ok = false;
    let detail = '';
    try {
      if (a.type === 'grep') {
        const file = resolveCriteriaFile(cwdAbs, a.file);
        if (file === null) { detail = 'file outside fixture cwd (rejected)'; }
        else if (!fs.existsSync(file)) { detail = 'file missing'; }
        else {
          const text = fs.readFileSync(file, 'utf8');
          const matches = text.match(new RegExp(a.pattern, 'g'));
          const count = matches ? matches.length : 0;
          if (typeof a.expected_count === 'number') ok = count === a.expected_count;
          else if (typeof a.expected_count === 'string' && a.expected_count.startsWith('>=')) {
            ok = count >= parseInt(a.expected_count.slice(2).trim(), 10);
          } else ok = count >= 1;
          detail = `count=${count}`;
        }
      } else if (a.type === 'grep_absent') {
        const file = resolveCriteriaFile(cwdAbs, a.file);
        if (file === null) { ok = false; detail = 'file outside fixture cwd (rejected)'; }
        else if (!fs.existsSync(file)) { ok = true; detail = 'file missing (treated as absent)'; }
        else {
          ok = !new RegExp(a.pattern).test(fs.readFileSync(file, 'utf8'));
          detail = ok ? 'absent' : 'present';
        }
      } else if (a.type === 'deterministic') {
        if (!criteriaExecAllowed()) {
          ok = false;
          detail = 'deterministic criterion skipped: criteria exec disabled (set DEEP_AGENT_ALLOW_CRITERIA_EXEC=1 to enable)';
          results.push({ id: a.id, type: a.type, passed: ok, detail });
          if (ok) pass++;
          continue;
        }
        try {
          execSync(a.command, { cwd: cwdAbs, timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] });
          ok = (a.expected_exit === undefined || a.expected_exit === 0);
          detail = `exit=0 expected=${a.expected_exit ?? 0}`;
        } catch (err) {
          const actualStatus = err.status !== undefined ? err.status : -1;
          if (a.expected_exit !== undefined) { ok = actualStatus === a.expected_exit; detail = `exit=${actualStatus} expected=${a.expected_exit}`; }
          else if (a.expected_exit_not !== undefined) { ok = actualStatus !== a.expected_exit_not; detail = `exit=${actualStatus} expected_not=${a.expected_exit_not}`; }
          else { ok = false; detail = `exit=${actualStatus} (no expectation matched)`; }
        }
      } else if (a.type === 'git_diff_paths') {
        ok = true; detail = 'git_diff_paths check deferred (no git context here)';
      } else {
        ok = false; detail = 'unknown acceptance type: ' + a.type;
      }
    } catch (err) {
      ok = false; detail = 'exception: ' + err.message;
    }
    results.push({ id: a.id, type: a.type, passed: ok, detail });
    if (ok) pass++;
  }
  return { score: results.length === 0 ? 1.0 : pass / results.length, details: { total: results.length, passed: pass, per_criterion: results } };
}

function applyHardGate(d1, d2) {
  if (d2 && d2.hard_gate_failed === true) {
    return { d1_capped: { ...d1, score: 0.0, hard_gate_capped: true }, hard_gate_failed: true };
  }
  return { d1_capped: d1, hard_gate_failed: false };
}

/**
 * D4 grader factory. Returns an async grader
 * function (virtualFixture, outputText, opts) -> { score, confidence, parse_status, ... }.
 *   - 'llm'  : real claude grader via the ported harness
 *   - 'mock' : deterministic stub via the harness mock path (default)
 *   - 'noop' : D4 contributes a constant 1.0 (deterministic-only scoring)
 *   - 'jev'  : hosted cascade that only calls out for rows the deterministic
 *              hallucination check flags
 *
 * @param {string} graderKind - Grader selector: 'llm', 'mock', 'noop' or 'jev'
 * @param {{ jev?: { path: string, provider: string }, env?: Record<string, string | undefined> }} [graderOptions] 'jev' client/provider and the environment its calls read
 * @returns {Function} Async grader function (virtualFixture, outputText, opts)
 * @throws {Error} When graderKind is not 'llm', 'mock', 'noop' or 'jev'
 */
function isGraderFailure(result) {
  if (!result || typeof result !== 'object') return true;
  if (result.mode === 'single') return isGraderFailure(result.primary);
  if (result.mode === 'dual') {
    return isGraderFailure(result.primary) || isGraderFailure(result.adversarial);
  }
  const parseStatus = typeof result.parse_status === 'string' ? result.parse_status : '';
  return !Number.isFinite(result.score)
    || Boolean(result.error)
    || parseStatus === 'failed'
    || parseStatus === 'unmeasured'
    || parseStatus.includes('dim_mismatch');
}

function graderFailureMessage(result) {
  if (result instanceof Error) return result.message;
  if (result?.mode === 'single') return graderFailureMessage(result.primary);
  if (result?.mode === 'dual') {
    return graderFailureMessage(result.adversarial) || graderFailureMessage(result.primary);
  }
  return result?.error
    || (result?.parse_status ? `grader parse status ${result.parse_status}` : 'grader returned an invalid result');
}

async function withOneRetry(call) {
  let lastFailure;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let result;
    try {
      result = await call(attempt);
    } catch (error) {
      lastFailure = error;
      continue;
    }
    if (!isGraderFailure(result)) {
      return attempt === 0 ? result : { ...result, attempts: 2, retried: true };
    }
    lastFailure = result;
  }
  return {
    score: null,
    confidence: null,
    parse_status: 'unmeasured',
    measured: false,
    attempts: 2,
    error: graderFailureMessage(lastFailure),
    dim_id: 'D4',
    evidence: [],
  };
}

function retryRubricVersion(version, purpose) {
  return `${version}-${purpose}-${crypto.randomBytes(8).toString('hex')}`;
}

function buildGraderFn(graderKind, graderOptions = {}) {
  if (graderKind === 'noop') {
    return async () => ({ score: 1.0, confidence: 1.0, parse_status: 'noop', dim_id: 'D4', rationale: 'grader disabled (noop)', evidence: [] });
  }
  if (graderKind === 'jev') {
    return buildJevGrader(graderOptions);
  }
  // An unknown kind used to fall through to the mock stub, which scores D4
  // with fake numbers; fail loudly so the caller sees the typo.
  if (graderKind !== 'llm' && graderKind !== 'mock') {
    throw new Error(`buildGraderFn: unknown grader kind '${graderKind}' (expected noop, mock, llm or jev)`);
  }
  const mode = graderKind === 'llm' ? 'real' : 'mock';
  return async (virtualFixture, outputText, opts) => {
    const graderOpts = {
      fixture: virtualFixture,
      swe16_output_text: outputText,
      variant_hash: opts.candidateHash,
      rubric_version: opts.rubricVersion || 'v1.0.0',
      mode,
      mock_mode: opts.mockMode || 'default',
    };
    const primary = await withOneRetry((attempt) => harness.gradeD4({
      ...graderOpts,
      rubric_version: attempt === 0
        ? graderOpts.rubric_version
        : retryRubricVersion(graderOpts.rubric_version, 'retry'),
    }));
    if (isGraderFailure(primary)) return primary;

    const adjudicated = await withOneRetry((attempt) => dispute.dualGraderInvocation(
      attempt === 0
        ? graderOpts
        : { ...graderOpts, rubric_version: retryRubricVersion(graderOpts.rubric_version, 'escalation-retry') },
      primary,
    ));
    if (isGraderFailure(adjudicated)) return adjudicated;
    if (adjudicated.mode === 'single') {
      return { ...adjudicated.primary, escalated: false };
    }
    const confidences = [adjudicated.primary.confidence, adjudicated.adversarial.confidence]
      .filter((confidence) => Number.isFinite(confidence));
    return {
      ...adjudicated.primary,
      score: adjudicated.score_median,
      confidence: confidences.length > 0 ? Math.min(...confidences) : adjudicated.primary.confidence,
      escalated: true,
      escalation_reason: adjudicated.escalation_reason,
      dispute: adjudicated.dispute,
      score_delta: adjudicated.score_delta,
      adversarial: adjudicated.adversarial,
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a single candidate across the 5 dimensions and return the weighted result.
 *
 * @param {object} opts - Scoring options
 * @param {string} opts.candidateId - Candidate identifier
 * @param {string} [opts.candidateHash] - Candidate hash (derived from output when absent)
 * @param {string} opts.outputText - Candidate output text to score
 * @param {object} [opts.criteria] - Acceptance/grading criteria data
 * @param {object} [opts.rubric] - Dimension weights (defaults to DEFAULT_RUBRIC)
 * @param {string} opts.cwd - Absolute scope cwd (required)
 * @param {string} [opts.graderKind] - D4 grader selector ('mock' default)
 * @param {object} [opts.graderOptions] - Grader-specific options; the 'jev' kind needs `{ jev: { path, provider }, env }`
 * @returns {Promise<object>} Weighted score, per-dimension scores, and details
 */
async function score(opts) {
  const {
    candidateId,
    candidateHash,
    outputText,
    criteria = {},
    rubric = DEFAULT_RUBRIC,
    cwd,
    graderKind = 'mock',
    graderOptions = {},
  } = opts;

  if (!cwd || !path.isAbsolute(cwd)) {
    throw new Error('score(): `cwd` must be an absolute path (decoupled scorer requires absolute scope.cwd)');
  }

  const fixtureId = opts.fixtureId || candidateId || 'virtual-fixture';
  // Synthesize the in-memory virtual fixture with an ABSOLUTE cwd so the legacy
  // det-check subprocesses (which path.resolve(PACKET_ROOT, scope.cwd)) decouple.
  const virtualFixture = {
    id: fixtureId,
    scope: { cwd },
    task: typeof criteria.task === 'string' ? criteria.task : undefined,
    spec: typeof criteria.spec === 'string' ? criteria.spec : undefined,
    visibleSpec: typeof criteria.spec === 'string'
      ? criteria.spec
      : (typeof criteria.visibleSpec === 'string' ? criteria.visibleSpec : undefined),
    acceptance: criteria.acceptance || [],
    grading: criteria.grading || [],
    requiredHeadings: criteria.requiredHeadings || [],
    requiredPatterns: criteria.requiredPatterns || [],
    allowlist: criteria.allowlist || {},
  };

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dai-scorer-'));
  const fixturePath = path.join(tmpDir, `fixture-${fixtureId}.json`);
  const outputFile = path.join(tmpDir, `output-${candidateId || fixtureId}.md`);
  try {
    fs.writeFileSync(fixturePath, JSON.stringify(virtualFixture));
    fs.writeFileSync(outputFile, outputText);

    const acceptance = scoreAcceptanceDeterministic(virtualFixture.acceptance, cwd);
    const bundleGate = runDetCheck('bundle-gate', fixturePath, outputFile);
    const cwdCheck = runDetCheck('cwd-check', fixturePath, outputFile);
    const preplanning = runDetCheck('preplanning-regex', fixturePath, outputFile);
    const hallucinationDet = runDetCheck('hallucination-flag', fixturePath, outputFile);

    const gate = applyHardGate(acceptance, bundleGate);
    const finalAcc = gate.d1_capped;

    const graderFn = buildGraderFn(graderKind, graderOptions);
    const grader = await graderFn(virtualFixture, outputText, {
      candidateHash: candidateHash || sha256Hex(outputText).slice(0, 16),
      rubricVersion: opts.rubricVersion,
      mockMode: opts.mockMode,
      hallucinationCheck: hallucinationDet,
    });

    const dimScore = (id) => {
      if (id === 'D1') return finalAcc.score;
      if (id === 'D2') return bundleGate.score;
      if (id === 'D3') return cwdCheck.score;
      if (id === 'D4') return grader.score;
      if (id === 'D5') return preplanning.score;
      return 0;
    };
    let weighted = 0;
    let measuredWeight = 0;
    let totalWeight = 0;
    const unmeasuredDimensions = [];
    for (const d of rubric.dims) {
      totalWeight += d.weight;
      const value = dimScore(d.id);
      if (!Number.isFinite(value)) {
        unmeasuredDimensions.push(d.id);
        continue;
      }
      weighted += d.weight * value;
      measuredWeight += d.weight;
    }
    const weightedScore = unmeasuredDimensions.length > 0
      ? (measuredWeight > 0 ? weighted / measuredWeight : null)
      : weighted;

    return {
      fixtureId,
      candidateId: candidateId || null,
      weightedScore: weightedScore === null ? null : Math.round(weightedScore * 10000) / 10000,
      weightedScoreCoverage: totalWeight > 0 ? Math.round((measuredWeight / totalWeight) * 10000) / 10000 : null,
      unmeasuredDimensions,
      hard_gate_failed: gate.hard_gate_failed,
      dimensions: {
        D1: finalAcc.score,
        D2: bundleGate.score,
        D3: cwdCheck.score,
        D4: grader.score,
        D5: preplanning.score,
      },
      deterministic: { acceptance: finalAcc, bundleGate, cwdCheck, preplanning, hallucinationDet },
      grader,
      interaction_terms: {
        d2_x_d1_decoupled: bundleGate.score >= 0.8 && finalAcc.score <= 0.4,
        d4_x_d1_inverse: Number.isFinite(grader.score) ? grader.score >= 0.9 && finalAcc.score <= 0.4 : null,
        d5_x_d1_inverse: preplanning.score >= 0.8 && finalAcc.score <= 0.4,
      },
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { score, buildGraderFn, scoreAcceptanceDeterministic, criteriaExecAllowed, DEFAULT_RUBRIC };

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const [outputFile, cwdArg] = process.argv.slice(2);
  if (!outputFile || !cwdArg) {
    process.stderr.write('usage: score-model-variant.cjs <output.md> <absolute-cwd> [--grader=mock|llm|noop]\n');
    process.exit(2);
  }
  const graderArg = process.argv.find((a) => a.startsWith('--grader='));
  const result = await score({
    candidateId: path.basename(outputFile, '.md'),
    outputText: fs.readFileSync(outputFile, 'utf8'),
    criteria: {},
    cwd: path.resolve(cwdArg),
    graderKind: graderArg ? graderArg.slice('--grader='.length) : 'mock',
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (require.main === module) main().catch((err) => { process.stderr.write(err.stack + '\n'); process.exit(1); });
