#!/usr/bin/env node
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

const fs = require('fs');
const path = require('path');
const { routeSkillResources } = require('./router-replay.cjs');
const { buildBannedVocab, lintFixture } = require('./contamination-lint.cjs');
const { scanConnectivity } = require('./d5-connectivity.cjs');
const { scoreScenario, aggregate } = require('./score-skill-benchmark.cjs');
const { probeAdvisor } = require('./advisor-probe.cjs');
const { renderReport } = require('./build-report.cjs');

const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..'); // .opencode/skills

function resolveSkillRoot(skillArg) {
  if (skillArg.includes('/') || skillArg.startsWith('.')) return path.resolve(skillArg);
  return path.join(SKILLS_DIR, skillArg);
}

function resolveSkillId(skillRoot) {
  return path.basename(skillRoot);
}

// Fixtures: assets/skill-benchmark/fixtures/<skill-id>/ with <id>.public.json +
// <id>.private.json pairs. Falls back to the --fixtures-dir override.
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

function run(args) {
  const skillRoot = resolveSkillRoot(args.skill);
  const skillId = resolveSkillId(skillRoot);
  const outputsDir = path.resolve(args['outputs-dir']);
  fs.mkdirSync(outputsDir, { recursive: true });
  // D1-inter advisor probing is opt-in so the pure-router default stays fast +
  // dependency-free. --advisor-mode=python enables the deterministic probe.
  const advisorMode = args['advisor-mode'] || 'off';

  if (!fs.existsSync(path.join(skillRoot, 'SKILL.md'))) {
    process.stderr.write(`run-skill-benchmark: no SKILL.md at ${skillRoot}\n`);
    return 2;
  }

  // 2. D5 hard gate first.
  const connectivity = scanConnectivity({ skillRoot });

  // 3. fixtures.
  const fixturesDir = args['fixtures-dir']
    ? path.resolve(args['fixtures-dir'])
    : path.join(skillRoot, 'assets', 'skill-benchmark', 'fixtures', skillId);
  const fixtures = loadFixtures(fixturesDir);

  // 4. per-scenario.
  const scenarioRows = [];
  for (const fx of fixtures) {
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
    // D1-inter (opt-in): probe the advisor out-of-band with the public prompt.
    // Deterministic (the Python advisor reads SQLite), so it stays in Mode A.
    const advisorResult = advisorMode === 'python'
      ? probeAdvisor({ prompt: fx.public.prompt || '' })
      : undefined;
    scenarioRows.push(scoreScenario({ scenarioId: fx.scenarioId, tier: fx.tier, routerResult, expected: fx.expected, advisorResult }));
  }

  // 5. aggregate + emit.
  const report = aggregate({ skillId, skillRoot, scenarioRows, connectivity, traceMode: args['trace-mode'] || 'router' });
  const reportJsonPath = args.output ? path.resolve(args.output) : path.join(outputsDir, 'skill-benchmark-report.json');
  const reportMdPath = reportJsonPath.replace(/\.json$/, '.md');
  fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(reportMdPath, renderReport(report));

  process.stdout.write(`skill-benchmark: ${skillId} verdict=${report.verdict} aggregate=${report.aggregateScore} scenarios=${scenarioRows.length}\n`);
  process.stdout.write(`  report.json -> ${reportJsonPath}\n  report.md   -> ${reportMdPath}\n`);
  return 0;
}

module.exports = { run, resolveSkillRoot, loadFixtures };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.skill || !args['outputs-dir']) {
    process.stderr.write('usage: run-skill-benchmark.cjs --skill <root-or-id> --outputs-dir <path> [--fixtures-dir <path>] [--output <report.json>] [--trace-mode router|live]\n');
    process.exit(2);
  }
  process.exit(run(args));
}
