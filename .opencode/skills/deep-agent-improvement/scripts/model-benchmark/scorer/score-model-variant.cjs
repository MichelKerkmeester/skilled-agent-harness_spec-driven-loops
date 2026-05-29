#!/usr/bin/env node
'use strict';

/**
 * scorer/score-model-variant.cjs
 *
 * Decoupled 5-dimension scorer for the deep-agent-improvement model-benchmark
 * mode. Ported from 120/003 eval-loop/score-variant.cjs and decoupled from the
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
 *     'mock' (deterministic stub), or 'noop' (D4=1.0). Default 'mock'.
 *
 * Seam contract:
 *   score({ candidateId, candidateHash, outputText, criteria, rubric?, cwd,
 *           graderKind?, graderMode?, mockMode? })
 *     -> { fixtureId, weightedScore, dimensions, hard_gate_failed,
 *          deterministic, grader, interaction_terms }
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execSync, spawnSync } = require('child_process');

const SCORER_ROOT = __dirname;
const DET_DIR = path.join(SCORER_ROOT, 'deterministic');
const harness = require(path.join(SCORER_ROOT, 'grader', 'harness.cjs'));

// 120/003 canonical 5-dim weights (D2 is the hard gate). Overridable via opts.rubric.
const DEFAULT_RUBRIC = {
  dims: [
    { id: 'D1', weight: 0.25 }, // acceptance (deterministic)
    { id: 'D2', weight: 0.3 }, // bundle gate (hard gate)
    { id: 'D3', weight: 0.2 }, // cwd / path correctness
    { id: 'D4', weight: 0.15 }, // grader (hallucination)
    { id: 'D5', weight: 0.1 }, // pre-planning
  ],
};

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

// (F017-P2-03 / packet-018): separator-bounded containment, mirroring the
// proven cwd-check.cjs isInside. A path is inside `base` only when it IS `base`
// or begins with `base + path.sep`, so a sibling sharing a string prefix
// (`/repo/proj-evil` vs `/repo/proj`) does NOT read as inside. Used to keep
// grep / grep_absent criteria file reads anchored inside the fixture cwd.
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

// Ported verbatim from score-variant.cjs (acceptance is the only check 120/003
// did not ship as a standalone det-script). Operates on an absolute cwd.
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
          const matches = text.match(new RegExp(new RegExp(a.pattern).source, 'g'));
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
        // F-P1-3 (122 review): `a.command` is profile/fixture-supplied data that flows
        // into a shell via execSync. Benchmark profiles are trusted-author content today,
        // so this is a latent injection surface rather than an open exploit. The gate lets
        // a hardened deployment refuse criteria-driven shell execution by setting
        // DEEP_AGENT_ALLOW_CRITERIA_EXEC=0. Default ('1'/unset) preserves backward-compat.
        if (process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC === '0') {
          ok = false;
          detail = 'deterministic criterion skipped: criteria exec disabled (DEEP_AGENT_ALLOW_CRITERIA_EXEC=0)';
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
 * D4 grader factory (research iteration 3, F5 step 2). Returns an async grader
 * function (virtualFixture, outputText, opts) -> { score, confidence, parse_status, ... }.
 *   - 'llm'  : real claude grader via the ported harness
 *   - 'mock' : deterministic stub via the harness mock path (default)
 *   - 'noop' : D4 contributes a constant 1.0 (deterministic-only scoring)
 */
function buildGraderFn(graderKind) {
  if (graderKind === 'noop') {
    return async () => ({ score: 1.0, confidence: 1.0, parse_status: 'noop', dim_id: 'D4', rationale: 'grader disabled (noop)', evidence: [] });
  }
  const mode = graderKind === 'llm' ? 'real' : 'mock';
  return async (virtualFixture, outputText, opts) => {
    try {
      return await harness.gradeD4({
        fixture: virtualFixture,
        swe16_output_text: outputText,
        variant_hash: opts.candidateHash,
        rubric_version: opts.rubricVersion || 'v1.0.0',
        mode,
        mock_mode: opts.mockMode || 'default',
      });
    } catch (err) {
      return { score: 0.0, confidence: 0.0, parse_status: 'failed', dim_id: 'D4', error: err.message, evidence: [] };
    }
  };
}

async function score(opts) {
  const {
    candidateId,
    candidateHash,
    outputText,
    criteria = {},
    rubric = DEFAULT_RUBRIC,
    cwd,
    graderKind = 'mock',
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

    const graderFn = buildGraderFn(graderKind);
    const grader = await graderFn(virtualFixture, outputText, {
      candidateHash: candidateHash || sha256Hex(outputText).slice(0, 16),
      rubricVersion: opts.rubricVersion,
      mockMode: opts.mockMode,
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
    for (const d of rubric.dims) weighted += d.weight * dimScore(d.id);

    return {
      fixtureId,
      candidateId: candidateId || null,
      weightedScore: Math.round(weighted * 10000) / 10000,
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
        d4_x_d1_inverse: grader.score >= 0.9 && finalAcc.score <= 0.4,
        d5_x_d1_inverse: preplanning.score >= 0.8 && finalAcc.score <= 0.4,
      },
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

module.exports = { score, buildGraderFn, scoreAcceptanceDeterministic, DEFAULT_RUBRIC };

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
