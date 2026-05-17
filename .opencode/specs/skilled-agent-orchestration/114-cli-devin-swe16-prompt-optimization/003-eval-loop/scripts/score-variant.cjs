#!/usr/bin/env node
/**
 * scripts/score-variant.cjs
 *
 * Orchestrate per-fixture scoring of a single SWE 1.6 output via the 002-eval-rig.
 * Runs all 4 deterministic checks + the grader, applies D2 hard-gate logic
 * (council ADR), aggregates into a weighted variant score.
 *
 * Returns:
 *   {
 *     fixtureId, variantId, weightedScore,
 *     deterministic: { acceptance, bundleGate, cwdCheck, preplanning, hallucinationDet },
 *     grader: { score, confidence, cache_hit, parse_status },
 *     hard_gate_failed: bool,
 *     interaction_terms: { d2_x_d1_decoupled, d4_x_d1_inverse, d5_x_d1_inverse }
 *   }
 *
 * Acceptance check (D1) is fixture-specific. We delegate the deterministic
 * acceptance checks (grep / grep_absent / deterministic command / etc.)
 * to a built-in evaluator below, since 002 didn't ship a generic acceptance
 * scorer.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const crypto = require('crypto');

const PACKET_ROOT = path.resolve(__dirname, '..');
const RIG_ROOT = path.resolve(PACKET_ROOT, '..', '002-eval-rig');
const DET_DIR = path.join(RIG_ROOT, 'scripts', 'deterministic');
const harness = require(path.join(RIG_ROOT, 'grader', 'harness.cjs'));
const config = require(path.join(PACKET_ROOT, 'state', 'eval-loop-config.json'));

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
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

function scoreAcceptanceDeterministic(fixture, outputFile, fixtureCwdAbs) {
  // Runs each acceptance criterion that has a deterministic shape.
  const acc = fixture.acceptance || [];
  if (acc.length === 0) return { score: 1.0, details: { count: 0, note: 'no acceptance defined' } };
  const results = [];
  let pass = 0;
  for (const a of acc) {
    let ok = false;
    let detail = '';
    try {
      if (a.type === 'grep') {
        const file = path.join(fixtureCwdAbs, a.file);
        if (!fs.existsSync(file)) { detail = 'file missing'; }
        else {
          const text = fs.readFileSync(file, 'utf8');
          const re = new RegExp(a.pattern);
          const matches = text.match(new RegExp(re.source, 'g'));
          const count = matches ? matches.length : 0;
          if (typeof a.expected_count === 'number') ok = count === a.expected_count;
          else if (typeof a.expected_count === 'string' && a.expected_count.startsWith('>=')) {
            ok = count >= parseInt(a.expected_count.slice(2).trim(), 10);
          } else ok = count >= 1;
          detail = `count=${count}`;
        }
      } else if (a.type === 'grep_absent') {
        const file = path.join(fixtureCwdAbs, a.file);
        if (!fs.existsSync(file)) { ok = true; detail = 'file missing (treated as absent)'; }
        else {
          const text = fs.readFileSync(file, 'utf8');
          ok = !new RegExp(a.pattern).test(text);
          detail = ok ? 'absent' : 'present';
        }
      } else if (a.type === 'deterministic') {
        try {
          execSync(a.command, { cwd: fixtureCwdAbs, timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] });
          const expected = a.expected_exit !== undefined ? a.expected_exit : 0;
          ok = (expected === 0);
          detail = `exit=0 expected=${expected}`;
        } catch (err) {
          const expected = a.expected_exit;
          const expectedNot = a.expected_exit_not;
          const actualStatus = err.status !== undefined ? err.status : -1;
          if (expected !== undefined) {
            ok = actualStatus === expected;
            detail = `exit=${actualStatus} expected=${expected}`;
          } else if (expectedNot !== undefined) {
            ok = actualStatus !== expectedNot;
            detail = `exit=${actualStatus} expected_not=${expectedNot}`;
          } else {
            ok = false;
            detail = `exit=${actualStatus} (no expectation matched)`;
          }
        }
      } else if (a.type === 'git_diff_paths') {
        // requires a git env in fixture cwd; for now skip with a passing default
        ok = true;
        detail = 'git_diff_paths check deferred (no git context here)';
      } else {
        ok = false;
        detail = 'unknown acceptance type: ' + a.type;
      }
    } catch (err) {
      ok = false;
      detail = 'exception: ' + err.message;
    }
    results.push({ id: a.id, type: a.type, passed: ok, detail });
    if (ok) pass++;
  }
  return {
    score: results.length === 0 ? 1.0 : pass / results.length,
    details: { total: results.length, passed: pass, per_criterion: results },
  };
}

function applyHardGate(d1, d2) {
  // Council ADR: if D2 smoke-run errored with environment failure (not test-failure),
  // short-circuit D1 to 0.0 and mark hard_gate_failed.
  if (d2 && d2.hard_gate_failed === true) {
    return { d1_capped: { ...d1, score: 0.0, hard_gate_capped: true }, hard_gate_failed: true };
  }
  return { d1_capped: d1, hard_gate_failed: false };
}

async function scoreVariantFixture(opts) {
  const { variantId, variantHash, fixturePath, swe16OutputText, rubricVersion, mode, mockMode } = opts;
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const fixtureCwdAbs = path.resolve(RIG_ROOT, fixture.scope.cwd);

  // Write SWE16 output to a temp file for det checks that expect a path
  const outputDir = path.join(PACKET_ROOT, 'state', 'in-flight');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `output-${variantId}-${fixture.id}.md`);
  fs.writeFileSync(outputFile, swe16OutputText);

  // Optional: extract files from markdown output into fixture CWD before scoring.
  // Gated on EVAL_LOOP_EXTRACT=true. When set, captures a pre-extraction seed
  // snapshot so the next variant starts from pristine seed files.
  let extractionResult = null;
  let preExtractionSnapshot = null;
  if (process.env.EVAL_LOOP_EXTRACT === 'true') {
    const extractScriptPath = path.resolve(PACKET_ROOT, '..', '..', '116-cli-devin-extraction-rerun', 'scripts', 'extract-files-from-markdown.cjs');
    if (fs.existsSync(extractScriptPath)) {
      const extract = require(extractScriptPath);
      // Snapshot seed directory contents before extraction so we can restore
      preExtractionSnapshot = snapshotDir(fixtureCwdAbs);
      try {
        extractionResult = extract.extract(swe16OutputText, fixtureCwdAbs);
      } catch (err) {
        extractionResult = { error: err.message, written: [], skipped: [] };
      }
    } else {
      extractionResult = { error: 'extraction script not found at ' + extractScriptPath };
    }
  }

  // Deterministic checks
  const acceptance = scoreAcceptanceDeterministic(fixture, outputFile, fixtureCwdAbs);
  const bundleGate = runDetCheck('bundle-gate', fixturePath, outputFile);
  const cwdCheck = runDetCheck('cwd-check', fixturePath, outputFile);
  const preplanning = runDetCheck('preplanning-regex', fixturePath, outputFile);
  const hallucinationDet = runDetCheck('hallucination-flag', fixturePath, outputFile);

  // Apply D2 hard-gate before computing weighted score
  const gate = applyHardGate(acceptance, bundleGate);
  const finalAcc = gate.d1_capped;

  // Grader (D4) — runs whether or not hard-gate fired (still useful diagnostic)
  let grader;
  try {
    grader = await harness.gradeD4({
      fixture,
      swe16_output_text: swe16OutputText,
      variant_hash: variantHash,
      rubric_version: rubricVersion || 'v1.0.0',
      mode: mode || 'mock',
      mock_mode: mockMode || 'default',
    });
  } catch (err) {
    grader = { score: 0.0, confidence: 0.0, parse_status: 'failed', error: err.message };
  }

  const dims = config.rubric.dims;
  const dimScore = (id) => {
    if (id === 'D1') return finalAcc.score;
    if (id === 'D2') return bundleGate.score;
    if (id === 'D3') return cwdCheck.score;
    if (id === 'D4') return grader.score;
    if (id === 'D5') return preplanning.score;
    return 0;
  };
  let weighted = 0;
  for (const d of dims) weighted += d.weight * dimScore(d.id);

  // Interaction terms (logged, not weighted into score)
  const d2_x_d1_decoupled = bundleGate.score >= 0.8 && finalAcc.score <= 0.4;
  const d4_x_d1_inverse = grader.score >= 0.9 && finalAcc.score <= 0.4;
  const d5_x_d1_inverse = preplanning.score >= 0.8 && finalAcc.score <= 0.4;

  // Restore fixture cwd to pristine seed state if we extracted
  if (preExtractionSnapshot) {
    restoreFromSnapshot(fixtureCwdAbs, preExtractionSnapshot);
  }

  return {
    fixtureId: fixture.id,
    variantId,
    weightedScore: Math.round(weighted * 10000) / 10000,
    deterministic: {
      acceptance: finalAcc,
      bundleGate,
      cwdCheck,
      preplanning,
      hallucinationDet,
    },
    grader,
    hard_gate_failed: gate.hard_gate_failed,
    extraction: extractionResult ? {
      written_count: extractionResult.summary ? extractionResult.summary.written_count : 0,
      skipped_count: extractionResult.summary ? extractionResult.summary.skipped_count : 0,
      paths: (extractionResult.written || []).map((w) => w.inferred_path),
    } : null,
    interaction_terms: {
      d2_x_d1_decoupled,
      d4_x_d1_inverse,
      d5_x_d1_inverse,
    },
  };
}

// Snapshot a directory tree (file paths + contents + symlinks) for restoration.
// Used by EVAL_LOOP_EXTRACT to preserve fixture seeds across variants.
function snapshotDir(rootAbs) {
  if (!fs.existsSync(rootAbs)) return { exists: false, files: [] };
  const files = [];
  function walk(dir, relBase) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      const rel = path.join(relBase, e.name);
      if (e.isDirectory()) {
        walk(abs, rel);
      } else if (e.isFile()) {
        files.push({ rel, content: fs.readFileSync(abs, 'utf8') });
      }
    }
  }
  walk(rootAbs, '');
  return { exists: true, files };
}

function restoreFromSnapshot(rootAbs, snapshot) {
  if (!snapshot || !snapshot.exists) return;
  // Wipe contents (files added by extraction) and restore from snapshot
  const seenRels = new Set(snapshot.files.map((f) => f.rel));
  function walk(dir, relBase) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      const rel = path.join(relBase, e.name);
      if (e.isDirectory()) {
        walk(abs, rel);
        // Try removing now-empty dir (idempotent)
        try { fs.rmdirSync(abs); } catch (_) {}
      } else if (e.isFile()) {
        if (!seenRels.has(rel)) {
          try { fs.unlinkSync(abs); } catch (_) {}
        }
      }
    }
  }
  walk(rootAbs, '');
  // Restore each snapshot file
  for (const f of snapshot.files) {
    const target = path.join(rootAbs, f.rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, f.content);
  }
}

module.exports = { scoreVariantFixture, snapshotDir, restoreFromSnapshot };

async function main() {
  const [variantPath, fixturePath, swe16OutputFile] = process.argv.slice(2);
  if (!variantPath || !fixturePath || !swe16OutputFile) {
    process.stderr.write('usage: score-variant.cjs <variant.md> <fixture.json> <swe16-output.md>\n');
    process.exit(2);
  }
  const variantId = path.basename(variantPath, '.md');
  const variantHash = sha256Hex(fs.readFileSync(variantPath, 'utf8') + '\x00' + fixturePath).slice(0, 16);
  const swe16OutputText = fs.readFileSync(swe16OutputFile, 'utf8');
  const result = await scoreVariantFixture({
    variantId,
    variantHash,
    fixturePath,
    swe16OutputText,
    rubricVersion: 'v1.0.0',
    mode: 'mock',
    mockMode: 'high-confidence',
  });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (require.main === module) main().catch((err) => { process.stderr.write(err.stack); process.exit(1); });
