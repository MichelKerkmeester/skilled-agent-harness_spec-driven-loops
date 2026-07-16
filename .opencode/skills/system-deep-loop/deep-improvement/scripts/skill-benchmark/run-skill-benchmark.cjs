#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ run-skill-benchmark — Lane C orchestrator                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * run-skill-benchmark.cjs — Lane C orchestrator (loop-host --mode=skill-benchmark).
 *
 * Post-run join: private gold never crosses the dispatch boundary. Sequence:
 *   1. resolve the target skill root (path or bare id under .opencode/skills/)
 *   2. D5 static connectivity scan (the hard gate) — runs first, before any dispatch
 *   3. load public/private fixture pairs
 *   4. per scenario: contamination-lint the PUBLIC prompt (a leak is a fixture
 *      failure), then router-replay (Mode A), then join with private gold to score
 *   5. aggregate -> write report.json, then render report.md FROM it
 *
 * Mode A (router-replay) is the deterministic default and the CI gate. Live
 * dispatch (Mode B) + D1-inter advisor scoring + D4 ablation are follow-on; this
 * orchestrator emits a complete, honest Mode A report today.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { routeSkillResources } = require('./router-replay.cjs');
const { buildBannedVocab, lintFixture } = require('./contamination-lint.cjs');
const { scanConnectivity, scanHubRegistry } = require('./d5-connectivity.cjs');
const { scoreScenario, aggregate } = require('./score-skill-benchmark.cjs');
const { probeAdvisor } = require('./advisor-probe.cjs');
const { renderReport } = require('./build-report.cjs');
const { loadPlaybookScenarios } = require('./load-playbook-scenarios.cjs');
const { dispatchScenario } = require('./executor-dispatch.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..'); // .opencode/skills

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a skill argument to an absolute root: a path/relative arg resolves
 * as-is, a bare id resolves under .opencode/skills/.
 *
 * @param {string} skillArg - Skill path or bare id.
 * @returns {string} Absolute skill root dir.
 */
function resolveSkillRoot(skillArg) {
  if (skillArg.includes('/') || skillArg.startsWith('.')) return path.resolve(skillArg);
  return path.join(SKILLS_DIR, skillArg);
}

function resolveSkillId(skillRoot) {
  return path.basename(skillRoot);
}

/**
 * Digest a skill's committed leaf-manifest.json, when it has one. Used to
 * detect a manifest edited out from under a run in progress; a skill with no
 * manifest at all always digests to null and never engages the abort below.
 *
 * @param {string} skillRoot - Skill root dir.
 * @returns {string|null} Hex sha256 digest, or null when no manifest exists.
 */
function readManifestDigest(skillRoot) {
  const manifestPath = path.join(skillRoot, 'leaf-manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(manifestPath)).digest('hex');
}

/**
 * Load public/private fixture pairs from a fixtures dir
 * (assets/skill_benchmark/fixtures/<skill-id>/ with <id>.public.json +
 * <id>.private.json pairs). Falls back to the --fixtures-dir override.
 *
 * @param {string} fixturesDir - Directory containing fixture pairs.
 * @returns {Array<Object>} Loaded fixture rows (malformed pairs carry loadError).
 */
function loadFixtures(fixturesDir) {
  const out = [];
  if (!fs.existsSync(fixturesDir)) return out;
  const publics = fs.readdirSync(fixturesDir).filter((f) => f.endsWith('.public.json'));
  for (const pf of publics) {
    const id = pf.replace(/\.public\.json$/, '');
    // A malformed fixture is operator error this tool exists to surface, not a
    // reason to crash the whole run. Degrade: record a load error and skip.
    let pub; let priv;
    try {
      pub = JSON.parse(fs.readFileSync(path.join(fixturesDir, pf), 'utf8'));
      const privPath = path.join(fixturesDir, `${id}.private.json`);
      priv = fs.existsSync(privPath) ? JSON.parse(fs.readFileSync(privPath, 'utf8')) : { expected: {} };
    } catch (err) {
      out.push({ scenarioId: id, loadError: err.message });
      continue;
    }
    out.push({ scenarioId: pub.scenarioId || id, tier: pub.tier || 'T1', public: pub.public || {}, expected: priv.expected || {}, rubric: priv.rubric });
  }
  return out;
}

// Legacy synthetic-fixture loop (kept for back-compat + malformed-fixture
// surfacing). Used only when --fixtures-dir is given explicitly.
function runLegacyFixtures({ fixturesDir, skillRoot, skillId, advisorMode, scenarioRows }) {
  for (const fx of loadFixtures(fixturesDir)) {
    if (fx.loadError) {
      scenarioRows.push({
        scenarioId: fx.scenarioId, tier: 'unknown', modeAScore: 0,
        firstFailingStage: 'unparseable-fixture',
        dims: { d1intra: { score: 0 }, d2: { score: 0 }, d3: { score: 0 }, d1inter: { score: null }, d4: { score: null } },
        loadError: fx.loadError,
      });
      continue;
    }
    const bannedVocab = buildBannedVocab({ skillRoot, skillId, privateExpected: fx.expected });
    const lint = lintFixture({ publicText: fx.public.prompt || '', bannedVocab });
    if (!lint.passed) {
      scenarioRows.push({
        scenarioId: fx.scenarioId, tier: fx.tier, modeAScore: 0,
        firstFailingStage: 'contaminated-fixture',
        dims: { d1intra: { score: 0 }, d2: { score: 0 }, d3: { score: 0 }, d1inter: { score: null }, d4: { score: null } },
        contamination: lint.hardLeaks,
      });
      continue;
    }
    const routerResult = routeSkillResources({ skillRoot, taskText: fx.public.prompt || '' });
    const advisorResult = advisorMode === 'python'
      ? probeAdvisor({ prompt: fx.public.prompt || '' }) : undefined;
    scenarioRows.push(scoreScenario({ scenarioId: fx.scenarioId, tier: fx.tier, routerResult, expected: fx.expected, advisorResult }));
  }
}

function filterScenarios(scenarios, filter) {
  if (!filter) return scenarios;
  const f = String(filter).toLowerCase();
  if (f === 'critical') return scenarios.filter((s) => s.critical);
  const ids = new Set(f.split(',').map((x) => x.trim().toUpperCase()));
  return scenarios.filter((s) => ids.has(s.scenarioId.toUpperCase()));
}

// Default corpus: the skill's manual_testing_playbook. Each scenario routes to
// the executor for its classKind; browser scenarios are routed out of the text
// executors. Contamination-lint is a drift FINDING in router mode (the playbook
// intentionally carries trigger words) and is skipped entirely in live mode.
function runPlaybook({ skillRoot, skillId, traceMode, advisorMode, executor, playbookDir, scenariosFilter, scenarioRows, lintFindings, warningsOut }) {
  const { scenarios, warnings } = loadPlaybookScenarios({ skillRoot, playbookDir });
  if (warningsOut) warningsOut.push(...warnings);
  for (const sc of filterScenarios(scenarios, scenariosFilter)) {
    const observed = dispatchScenario({ scenario: sc, skillRoot, traceMode, executor });
    if (sc.classKind === 'browser') {
      if (observed.routedOut || observed.error) {
        // Router/CI mode, or the browser harness was unavailable.
        scenarioRows.push({
          scenarioId: sc.scenarioId, classKind: 'browser', routedOut: true,
          reason: observed.reason || observed.error || 'browser scenario — routed to browser harness',
        });
      } else {
        // Live mode: browser-executor returned a full scenario row (with a verdict).
        scenarioRows.push(observed);
      }
      continue;
    }
    if (traceMode === 'router' && sc.prompt) {
      const bannedVocab = buildBannedVocab({ skillRoot, skillId, privateExpected: { resources: sc.expectedResources } });
      const lint = lintFixture({ publicText: sc.prompt, bannedVocab });
      if (!lint.passed) lintFindings.push({ scenarioId: sc.scenarioId, leaks: lint.hardLeaks.map((h) => h.term) });
    }
    const advisorResult = (advisorMode === 'python' && sc.classKind === 'advisor' && sc.prompt)
      ? probeAdvisor({ prompt: sc.prompt }) : undefined;
    scenarioRows.push(scoreScenario({ scenario: sc, skillId, observed, advisorResult, traceMode }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the Lane C benchmark: resolve skill, D5 connectivity gate, score scenarios
 * (legacy fixtures or playbook), aggregate, and write report.{json,md}.
 *
 * @param {Object} args - Parsed CLI args.
 * @returns {number} Process exit code (0 success, 2 on missing SKILL.md,
 *   3 when the D5 structural/registry gate blocked the verdict).
 */
function run(args) {
  const skillRoot = resolveSkillRoot(args.skill);
  const skillId = resolveSkillId(skillRoot);
  const outputsDir = path.resolve(args['outputs-dir']);
  fs.mkdirSync(outputsDir, { recursive: true });
  const advisorMode = args['advisor-mode'] || 'off';
  // The internal fallback stays 'router' so direct run() calls (the test suite)
  // are deterministic; the live default is injected by loop-host for operators.
  const traceMode = args['trace-mode'] || 'router';

  if (!fs.existsSync(path.join(skillRoot, 'SKILL.md'))) {
    process.stderr.write(`run-skill-benchmark: no SKILL.md at ${skillRoot}\n`);
    return 2;
  }

  // Topology digest snapshot: a manifest-bearing skill's leaf-manifest.json
  // must not change while a run is scoring against it, or the scored rows and
  // the committed gold would silently drift apart mid-run. A skill with no
  // manifest digests to null and never reaches the abort check below.
  const topologyDigestBefore = readManifestDigest(skillRoot);

  // D5 hard gate first.
  const connectivity = scanConnectivity({ skillRoot });
  const hubRegistry = scanHubRegistry({ skillRoot });

  const scenarioRows = [];
  const lintFindings = [];
  const warnings = [];
  if (args['fixtures-dir']) {
    runLegacyFixtures({ fixturesDir: path.resolve(args['fixtures-dir']), skillRoot, skillId, advisorMode, scenarioRows });
  } else {
    runPlaybook({
      skillRoot, skillId, traceMode, advisorMode, executor: args.executor,
      playbookDir: args['playbook-dir'],
      scenariosFilter: args.scenarios, scenarioRows, lintFindings, warningsOut: warnings,
    });
  }

  const topologyDigestAfter = readManifestDigest(skillRoot);
  if (topologyDigestBefore !== null && topologyDigestBefore !== topologyDigestAfter) {
    process.stderr.write(
      `run-skill-benchmark: topology_changed_during_run — leaf-manifest.json changed while scoring ${skillId} `
      + `(before=${topologyDigestBefore} after=${topologyDigestAfter}); aborting rather than scoring against a shifted manifest\n`,
    );
    return 4;
  }

  // aggregate + emit.
  const report = aggregate({ skillId, skillRoot, scenarioRows, connectivity, hubRegistry, traceMode, lintFindings });
  if (topologyDigestBefore !== null) report.topologyDigest = topologyDigestBefore;
  if (warnings.length) report.parseWarnings = warnings;
  const reportJsonPath = args.output ? path.resolve(args.output) : path.join(outputsDir, 'skill-benchmark-report.json');
  const reportMdPath = reportJsonPath.replace(/\.json$/, '.md');
  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(reportMdPath, renderReport(report));

  process.stdout.write(`skill-benchmark: ${skillId} verdict=${report.verdict} aggregate=${report.aggregateScore} scenarios=${scenarioRows.length}\n`);
  process.stdout.write(`  report.json -> ${reportJsonPath}\n  report.md   -> ${reportMdPath}\n`);
  // The D5 gate exists to make a structurally-broken skill (dead router, broken
  // hub registry) unusable regardless of weighted score. An exit code that stays
  // 0 on that verdict lets a CI caller treat "blocked" the same as "passed" —
  // reports still write either way, but the process signal must disagree.
  if (report.verdict === 'BLOCKED-BY-STRUCTURE' || report.verdict === 'BLOCKED-BY-REGISTRY') return 3;
  return 0;
}

// Opt-in D4-R pass (live + paid). Kept OUT of the synchronous run() so the
// deterministic test suite (which calls run() and reads the report immediately)
// stays sync. Re-reads the report run() wrote, runs the task-outcome ablation on
// the explicitly selected scenarios, attaches each row's d4TaskOutcome, recomputes
// the advisory D4_task_outcome aggregate, and re-writes report.{json,md}. D4-R runs
// only on target-owned scenarios named via --d4-scenarios (or --scenarios); there
// are no cross-target defaults, which would silently borrow another skill's ids.

/**
 * Opt-in D4-R pass: re-read the written report, run the task-outcome ablation on
 * the chosen scenarios, attach each row's d4TaskOutcome, recompute the advisory
 * D4_task_outcome aggregate, and re-write report.{json,md}.
 *
 * @param {Object} args - Parsed CLI args.
 * @returns {Promise<number>} Process exit code (0 on success).
 */
async function augmentWithD4R(args) {
  const { runD4RAblation } = require('./d4-ablation.cjs');
  const skillRoot = resolveSkillRoot(args.skill);
  const outputsDir = path.resolve(args['outputs-dir']);
  const reportJsonPath = args.output ? path.resolve(args.output) : path.join(outputsDir, 'skill-benchmark-report.json');
  const report = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));
  const { scenarios } = loadPlaybookScenarios({ skillRoot, playbookDir: args['playbook-dir'] });
  const explicit = args['d4-scenarios'] || args.scenarios;
  const wanted = explicit
    ? String(explicit).split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
    : [];
  if (!wanted.length) {
    report.advisorySignals = report.advisorySignals || {};
    report.advisorySignals.D4_task_outcome = {
      score: null,
      status: 'not-run-no-target-scenarios',
      note: 'D4-R needs explicit target-owned --d4-scenarios (or --scenarios); no cross-target defaults',
    };
    fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
    fs.writeFileSync(reportJsonPath.replace(/\.json$/, '.md'), renderReport(report));
    process.stdout.write('  D4-R: not run — pass explicit --d4-scenarios (target-owned ids)\n');
    return 0;
  }
  const byId = new Map((report.scenarioRows || []).map((r) => [(r.scenarioId || '').toUpperCase(), r]));
  const graderMode = args['grader-mode'] || 'real';
  const model = process.env.SKILL_BENCH_OPENCODE_MODEL;
  const variant = process.env.SKILL_BENCH_OPENCODE_VARIANT;
  let scored = 0;
  for (const sc of scenarios) {
    if (!wanted.includes((sc.scenarioId || '').toUpperCase())) continue;
    process.stdout.write(`  D4-R ablation: ${sc.scenarioId} ...\n`);
    const res = await runD4RAblation({ scenario: sc, skillRoot, model, variant, graderMode });
    const row = byId.get((sc.scenarioId || '').toUpperCase());
    if (row) { row.d4TaskOutcome = res.d4r; if (typeof res.d4r.score === 'number') scored += 1; }
  }
  const vals = (report.scenarioRows || [])
    .map((r) => (r.d4TaskOutcome && typeof r.d4TaskOutcome.score === 'number' ? Math.round(r.d4TaskOutcome.score * 100) : null))
    .filter((v) => typeof v === 'number');
  const d4TaskAvg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  report.advisorySignals = report.advisorySignals || {};
  report.advisorySignals.D4_task_outcome = d4TaskAvg === null
    ? { score: null, status: 'no D4-R rows scored', note: 'task-outcome usefulness delta; separate from D4 hallucination' }
    : { score: d4TaskAvg, scoredCount: scored, attribution: 'approximate', note: 'task-outcome usefulness delta (skill-on vs off), separate from D4 hallucination' };
  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(reportJsonPath.replace(/\.json$/, '.md'), renderReport(report));
  process.stdout.write(`  D4-R: ${scored} scenario(s) scored; advisory D4_task_outcome=${d4TaskAvg == null ? 'null' : d4TaskAvg}\n`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { run, augmentWithD4R, resolveSkillRoot, loadFixtures };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill || !args['outputs-dir']) {
    process.stderr.write('usage: run-skill-benchmark.cjs --skill <root-or-id> --outputs-dir <path> [--fixtures-dir <path>] [--playbook-dir <path>] [--scenarios <ids>] [--output <report.json>] [--trace-mode router|live] [--d4 [--d4-scenarios <ids>] [--grader-mode real|mock]]\n');
    process.exit(2);
  }
  const code = run(args);
  if (code === 0 && args.d4 && (args['trace-mode'] === 'live')) {
    augmentWithD4R(args).then((c) => process.exit(c)).catch((err) => {
      process.stderr.write(`D4-R pass failed: ${err && err.message}\n`);
      process.exit(1);
    });
  } else {
    if (args.d4 && args['trace-mode'] !== 'live') process.stderr.write('note: --d4 requires --trace-mode live; skipped.\n');
    process.exit(code);
  }
}
