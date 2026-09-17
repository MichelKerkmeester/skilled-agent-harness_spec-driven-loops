// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Benchmark Runner — Fixture and Integration Scoring                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
// The profiles-dir default and fixturePathFor are shared with
// materialize-benchmark-fixtures.cjs via ../lib/profile-resolve.cjs so path
// resolution stays one source of truth across materialization and scoring.
const { DEFAULT_PROFILES_DIR, fixturePathFor } = require('../lib/profile-resolve.cjs');
// Anti-Goodhart guards: different-family grader enforcement, N-sample
// aggregation, and deliverable-contract extraction.
const { assertGraderIndependence } = require('../shared/model-family.cjs');
const { extractDeliverable } = require('../shared/extract-deliverable.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    if (rest.length > 0) {
      args[key] = rest.join('=');
    } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
      args[key] = argv[index + 1];
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function listJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter((entry) => entry.endsWith('.json'))
    .sort()
    .map((entry) => path.join(dir, entry));
}

function resolveMaybeRelative(value, baseDir) {
  if (path.isAbsolute(value)) {
    return value;
  }
  const fromCwd = path.resolve(process.cwd(), value);
  if (fs.existsSync(fromCwd)) {
    return fromCwd;
  }
  return path.resolve(baseDir, value);
}

function loadProfile(profileArg, profilesDir) {
  const directPath = path.resolve(process.cwd(), profileArg);
  const profilePath = fs.existsSync(directPath)
    ? directPath
    : path.join(profilesDir, `${profileArg}.json`);
  return {
    data: readJson(profilePath),
    path: profilePath,
  };
}

// The immutable history snapshot lives at a basename derived from the
// author-controlled label. Reduce the label to a safe filename fragment so it
// cannot escape report-history/, then timestamp it for per-iteration uniqueness.
function sanitizeLabel(label) {
  const cleaned = String(label).replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned.length > 0 ? cleaned.slice(0, 120) : 'benchmark';
}

function timestampStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function loadFixtures(profile, profilePath) {
  const profileDir = path.dirname(profilePath);
  const fixtureDir = resolveMaybeRelative(profile.fixtureDir || profile.benchmark?.fixtureDir, profileDir);
  const fixtureRefs = profile.fixtures || profile.benchmark?.fixtures || null;
  const fixtureFiles = Array.isArray(fixtureRefs)
    ? fixtureRefs.map((fixtureRef) => fixturePathFor(fixtureRef, fixtureDir))
    : listJsonFiles(fixtureDir);
  return {
    fixtures: fixtureFiles.map((filePath) => readJson(filePath)),
    fixtureDir,
    fixtureFiles,
  };
}

function inferStateLogPath(outputsDir) {
  let current = path.resolve(process.cwd(), outputsDir);
  while (current !== path.dirname(current)) {
    if (path.basename(current) === 'improvement') {
      return path.join(current, 'agent-improvement-state.jsonl');
    }
    current = path.dirname(current);
  }
  return null;
}

// Fixture ids are later used as path segments via path.join(outputsDir,
// `${fixture.id}.md`). An unsanitized id like '../evil' or 'a/b' would escape
// outputsDir. Restrict ids to a basename charset and reject path separators /
// parent-dir traversal before any path.join.
const SAFE_FIXTURE_ID = /^[A-Za-z0-9._-]+$/;

function assertSafeFixtureId(id) {
  if (typeof id !== 'string' || id.length === 0 || !SAFE_FIXTURE_ID.test(id) || id === '.' || id === '..') {
    throw new Error(`run-benchmark: unsafe fixture id '${id}' (must match ${SAFE_FIXTURE_ID} and not be '.'/'..' or contain path separators)`);
  }
  return id;
}

function fixtureOutputPath(outputsDir, id) {
  assertSafeFixtureId(id);
  return path.join(outputsDir, `${id}.md`);
}

// Fixture/profile-authored requiredPatterns and forbiddenPatterns are compiled
// with `new RegExp(value, 'i')` and tested against full model output. A crafted
// pattern with nested quantifiers can trigger catastrophic backtracking. Bound
// the authored pattern length so a single pattern cannot encode an
// exponential-backtracking construct over a long input, and anchor matching cost
// by capping the tested input length.
const MAX_PATTERN_LENGTH = 512;
const MAX_MATCH_INPUT_LENGTH = 200000;

function compilePatterns(patterns) {
  return (patterns || []).map((value) => {
    const source = String(value);
    if (source.length > MAX_PATTERN_LENGTH) {
      throw new Error(`run-benchmark: pattern exceeds ${MAX_PATTERN_LENGTH} chars (len=${source.length}); refusing to compile to avoid regex DoS`);
    }
    return new RegExp(source, 'i');
  });
}

// Bound the input a regex is tested against so a pathological pattern that
// slipped past the length guard still cannot run unbounded over huge output.
function safeRegexTest(regex, content) {
  const input = content.length > MAX_MATCH_INPUT_LENGTH
    ? content.slice(0, MAX_MATCH_INPUT_LENGTH)
    : content;
  return regex.test(input);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE SCORING
// ─────────────────────────────────────────────────────────────────────────────

function scoreFixture(fixture, outputPath, options) {
  if (!fs.existsSync(outputPath)) {
    return {
      id: fixture.id,
      outputPath,
      score: 0,
      maxScore: 100,
      passed: false,
      missingHeadings: fixture.requiredHeadings || [],
      missingPatterns: fixture.requiredPatterns || [],
      forbiddenMatches: [],
      failureModes: ['missing-output'],
    };
  }

  let content = fs.readFileSync(outputPath, 'utf8');
  let extraction;
  // When the profile declares deliverable_contract, score ONLY the delimited
  // deliverable region because reasoning text contaminates pattern and
  // forbidden-pattern matching. Default path stays byte-identical.
  if (options && options.contract) {
    const extracted = extractDeliverable(content);
    extraction = extracted.confidence;
    if (extracted.confidence === 'low' && options.contract.required) {
      return {
        id: fixture.id,
        outputPath,
        score: 0,
        maxScore: 100,
        passed: false,
        extraction,
        missingHeadings: [],
        missingPatterns: [],
        forbiddenMatches: [],
        failureModes: ['missing-deliverable-contract'],
      };
    }
    if (extracted.confidence !== 'low') content = extracted.text;
  }
  const missingHeadings = (fixture.requiredHeadings || []).filter((heading) => !content.includes(heading));
  const patternRegexes = compilePatterns(fixture.requiredPatterns);
  const missingPatterns = patternRegexes
    .map((regex, index) => ({ regex, source: fixture.requiredPatterns[index] }))
    .filter((entry) => !safeRegexTest(entry.regex, content))
    .map((entry) => entry.source);
  const forbiddenRegexes = compilePatterns(fixture.forbiddenPatterns);
  const forbiddenMatches = forbiddenRegexes
    .map((regex, index) => ({ regex, source: fixture.forbiddenPatterns[index] }))
    .filter((entry) => safeRegexTest(entry.regex, content))
    .map((entry) => entry.source);

  const headingScore =
    (fixture.requiredHeadings || []).length === 0
      ? 45
      : Math.round(45 * (((fixture.requiredHeadings || []).length - missingHeadings.length) / (fixture.requiredHeadings || []).length));
  const patternScore =
    (fixture.requiredPatterns || []).length === 0
      ? 35
      : Math.round(35 * (((fixture.requiredPatterns || []).length - missingPatterns.length) / (fixture.requiredPatterns || []).length));
  const cleanScore =
    (fixture.forbiddenPatterns || []).length === 0
      ? 20
      : Math.round(20 * (((fixture.forbiddenPatterns || []).length - forbiddenMatches.length) / (fixture.forbiddenPatterns || []).length));

  const score = headingScore + patternScore + cleanScore;
  const failureModes = [];
  if (missingHeadings.length > 0) {
    failureModes.push('missing-headings');
  }
  if (missingPatterns.length > 0) {
    failureModes.push('missing-required-patterns');
  }
  if (forbiddenMatches.length > 0) {
    failureModes.push('forbidden-patterns');
  }

  return {
    id: fixture.id,
    outputPath,
    score,
    maxScore: 100,
    passed: failureModes.length === 0,
    ...(extraction !== undefined && { extraction }),
    missingHeadings,
    missingPatterns,
    forbiddenMatches,
    failureModes,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3a. N-SAMPLE AGGREGATION (opt-in, --samples N)
// ─────────────────────────────────────────────────────────────────────────────
// Single benchmark runs are stochastic (the pilot saw one fixture swing 16->22
// independent across runs). With --samples N the runner scores run-tagged
// outputs `<id>.run<k>.md` (k=1..N, produced by the dispatch side) and folds
// them into one noise-robust entry: mean score, all-samples pass semantics,
// per-sample detail + std. --samples 1 (default) stays byte-identical.

function fixtureSampleOutputPath(outputsDir, id, runIndex) {
  assertSafeFixtureId(id);
  return path.join(outputsDir, `${id}.run${runIndex}.md`);
}

async function scoreFixtureWithSamples(fixture, outputsDir, samples, scoreOne) {
  if (samples <= 1) {
    return scoreOne(fixtureOutputPath(outputsDir, fixture.id));
  }
  const perSample = [];
  for (let k = 1; k <= samples; k += 1) {
    perSample.push(await scoreOne(fixtureSampleOutputPath(outputsDir, fixture.id, k)));
  }
  const scores = perSample.map((s) => s.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const std = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length);
  const failureModes = [...new Set(perSample.flatMap((s) => s.failureModes || []))];
  const aggregate = {
    ...perSample[0],
    outputPath: fixtureOutputPath(outputsDir, fixture.id),
    score: Math.round(mean),
    passed: perSample.every((s) => s.passed),
    failureModes,
    samples: perSample.map((s, i) => ({ run: i + 1, score: s.score, passed: s.passed, failureModes: s.failureModes })),
    sample_count: perSample.length,
    sample_std: Math.round(std * 100) / 100,
  };
  // The first sample's per-sample diagnostics (missing patterns etc.) do not
  // represent the aggregate; per-sample detail lives under `samples`.
  for (const k of ['missingHeadings', 'missingPatterns', 'forbiddenMatches', 'extraction']) delete aggregate[k];
  return aggregate;
}

function aggregateFailureModes(fixtures) {
  const counts = {};
  for (const fixture of fixtures) {
    for (const mode of fixture.failureModes || []) {
      counts[mode] = (counts[mode] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([mode]) => mode);
}

function finiteNumberOrNull(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function scoreFromBaselineValue(value) {
  const direct = finiteNumberOrNull(value);
  if (direct !== null) {
    return direct;
  }
  if (value && typeof value === 'object') {
    return finiteNumberOrNull(
      value.score
      ?? value.baselineScore
      ?? value.baseline_score
      ?? value.beforeScore
      ?? value.before_score
    );
  }
  return null;
}

function baselineScoreForFixture(profile, fixture) {
  const direct = scoreFromBaselineValue(
    fixture.baselineScore
    ?? fixture.baseline_score
    ?? fixture.beforeScore
    ?? fixture.before_score
  );
  if (direct !== null) {
    return direct;
  }

  const maps = [
    profile.baselineScores,
    profile.baseline_scores,
    profile.baseline?.fixtureScores,
    profile.baseline?.fixture_scores,
  ];
  for (const map of maps) {
    if (map && typeof map === 'object' && Object.prototype.hasOwnProperty.call(map, fixture.id)) {
      const mapped = scoreFromBaselineValue(map[fixture.id]);
      if (mapped !== null) {
        return mapped;
      }
    }
  }
  return null;
}

function roundDelta(value) {
  return Math.round(value * 10000) / 10000;
}

function summarizeFixtureDeltas(fixtureDeltas) {
  const summary = {
    total: fixtureDeltas.length,
    helped: 0,
    hurt: 0,
    unchanged: 0,
    missingBaseline: 0,
  };
  for (const entry of fixtureDeltas) {
    if (!Number.isFinite(entry.delta)) {
      summary.missingBaseline += 1;
    } else if (entry.delta > 0) {
      summary.helped += 1;
    } else if (entry.delta < 0) {
      summary.hurt += 1;
    } else {
      summary.unchanged += 1;
    }
  }
  return summary;
}

function buildBenchmarkDeltas(profile, fixtures, results) {
  const fixtureById = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  const fixtureDeltas = results.map((result) => {
    const fixture = fixtureById.get(result.id) || {};
    const beforeScore = baselineScoreForFixture(profile, fixture);
    const afterScore = finiteNumberOrNull(result.score);
    const delta = beforeScore !== null && afterScore !== null
      ? roundDelta(afterScore - beforeScore)
      : null;
    return {
      id: result.id,
      beforeScore,
      afterScore,
      delta,
      helped: delta !== null && delta > 0,
      hurt: delta !== null && delta < 0,
    };
  });
  const summary = summarizeFixtureDeltas(fixtureDeltas);
  const outcomeScoreDelta = fixtureDeltas.length > 0 && summary.missingBaseline === 0
    ? roundDelta(
        fixtureDeltas.reduce((sum, entry) => sum + entry.afterScore, 0) / fixtureDeltas.length
        - fixtureDeltas.reduce((sum, entry) => sum + entry.beforeScore, 0) / fixtureDeltas.length
      )
    : null;
  return { outcomeScoreDelta, fixtureDeltas, fixtureDeltaSummary: summary };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3b. 5-DIM SCORING (opt-in, --scorer=5dim)
// ─────────────────────────────────────────────────────────────────────────────
// Routes the materialized fixture output through the ported 5-dim scorer
// (deterministic checks + grader factory) instead of the default heading/pattern
// matcher. Opt-in so the default `pattern` path stays byte-identical; the scorer
// module is lazily required only on this path. graderKind defaults to 'noop'
// (deterministic, no LLM dispatch) so a benchmark run stays hermetic unless the
// operator explicitly asks for the 'llm' grader.

async function scoreFixture5dim(fixture, outputPath, cwdAbs, graderKind, scorerModule) {
  if (!fs.existsSync(outputPath)) {
    return {
      id: fixture.id,
      outputPath,
      score: 0,
      maxScore: 100,
      passed: false,
      scoringMethod: '5dim',
      dimensions: {},
      hard_gate_failed: false,
      failureModes: ['missing-output'],
    };
  }
  const outputText = fs.readFileSync(outputPath, 'utf8');
  const result = await scorerModule.score({
    candidateId: fixture.id,
    outputText,
    criteria: {
      acceptance: fixture.acceptance || [],
      requiredHeadings: fixture.requiredHeadings || [],
      requiredPatterns: fixture.requiredPatterns || [],
    },
    cwd: cwdAbs,
    graderKind,
  });
  const score = Math.round((result.weightedScore || 0) * 100);
  const failureModes = [];
  if (result.hard_gate_failed) {
    failureModes.push('hard-gate-failed');
  }
  for (const [dim, value] of Object.entries(result.dimensions || {})) {
    if (typeof value === 'number' && value < 0.5) {
      failureModes.push(`low-${dim}`);
    }
  }
  return {
    id: fixture.id,
    outputPath,
    score,
    maxScore: 100,
    passed: !result.hard_gate_failed && failureModes.length === 0,
    scoringMethod: '5dim',
    dimensions: result.dimensions || {},
    hard_gate_failed: Boolean(result.hard_gate_failed),
    failureModes,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INTEGRATION SCORING
// ─────────────────────────────────────────────────────────────────────────────

// Every sub-score below is on a normalized 0..100 scale and combined with the
// weights defined here. Earlier comments described a "10 pt" scale that did not
// match the code; these named constants are now the single source of truth for
// the integration score composition.
const INTEGRATION_FULL_SCORE = 100;
const MIRROR_MISSING_PENALTY = 30;
const MIRROR_DIVERGED_PENALTY = 20;
const COVERAGE_PRESENT_SCORE = 100; // binary: >=1 reference => full normalized score
const INTEGRATION_WEIGHTS = { mirror: 0.6, command: 0.2, skill: 0.2 };

function scoreIntegration(integrationReportPath) {
  const data = readJson(integrationReportPath);

  // Normalize scanner output: scan-integration.cjs emits surfaces.mirrors/commands/skills
  // while this function historically expects top-level mirrors/commandReferences/skillReferences.
  const mirrors = data.mirrors || (data.surfaces && data.surfaces.mirrors) || [];
  const commandRefs = data.commandReferences || (data.surfaces && data.surfaces.commands) || [];
  const skillRefs = data.skillReferences || (data.surfaces && data.surfaces.skills) || [];

  // --- Mirror sync score (0..100, start full and penalize diverged/missing) ---
  let mirrorScore = INTEGRATION_FULL_SCORE;
  for (const mirror of mirrors) {
    const mStatus = mirror.status || mirror.syncStatus;
    if (mStatus === 'missing') {
      mirrorScore -= MIRROR_MISSING_PENALTY;
    } else if (mStatus === 'diverged') {
      mirrorScore -= MIRROR_DIVERGED_PENALTY;
    }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const mirrorStatus =
    mirrorScore === INTEGRATION_FULL_SCORE
      ? 'all-aligned'
      : mirrors.some((entry) => (entry.status || entry.syncStatus) === 'missing')
        ? 'has-missing'
        : 'has-divergence';

  // --- Command coverage (binary: >=1 reference => COVERAGE_PRESENT_SCORE, else 0) ---
  const commandCount = commandRefs.length;
  const commandScore = commandCount >= 1 ? COVERAGE_PRESENT_SCORE : 0;

  // --- Skill coverage (binary: >=1 reference => COVERAGE_PRESENT_SCORE, else 0) ---
  const skillCount = skillRefs.length;
  const skillScore = skillCount >= 1 ? COVERAGE_PRESENT_SCORE : 0;

  // --- Weighted average on the 0..100 scale (mirror 60%, command 20%, skill 20%) ---
  const integrationScore = Math.round(
    mirrorScore * INTEGRATION_WEIGHTS.mirror
    + commandScore * INTEGRATION_WEIGHTS.command
    + skillScore * INTEGRATION_WEIGHTS.skill,
  );

  return {
    integrationScore,
    integrationDetails: {
      mirrorScore,
      commandScore,
      skillScore,
      mirrorStatus,
      commandCount,
      skillCount,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const profileArg = args.profile;
  const outputsDir = args['outputs-dir'];
  const outputPath = args.output || (outputsDir ? path.join(outputsDir, 'report.json') : null);
  const profilesDir = args['profiles-dir'] || DEFAULT_PROFILES_DIR;
  const integrationReportPath = args['integration-report'] || null;

  // Opt-in scorer selection. 'pattern' (default) keeps the byte-identical
  // heading/pattern matcher; '5dim' routes through the ported 5-dim scorer.
  const VALID_SCORERS = new Set(['pattern', '5dim']);
  let scorer = args.scorer || 'pattern';
  if (!VALID_SCORERS.has(scorer)) {
    process.stderr.write(`run-benchmark: unknown --scorer '${scorer}', defaulting to 'pattern'\n`);
    scorer = 'pattern';
  }
  const graderKind = args.grader || 'noop';
  const samples = Math.max(1, parseInt(args.samples, 10) || 1);
  const allowSameFamily = args['allow-same-family'] === true || args['allow-same-family'] === 'true';

  if (!profileArg || !outputsDir || !outputPath) {
    process.stderr.write('Usage: node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--output <path>] [--state-log <path>] [--label <string>] [--profiles-dir <path>] [--integration-report <path>] [--scorer pattern|5dim] [--grader noop|mock|llm] [--samples <n>] [--allow-same-family]\n');
    process.exit(2);
  }

  let profileId = profileArg;
  const stateLogPath = args['state-log'] || inferStateLogPath(outputsDir);
  const label = args.label || `${path.basename(profileArg, '.json')}-benchmark`;

  // Provenance must survive on BOTH success and failure paths.
  // profilePath/profileVersion/fixtureDir start null and are filled once the
  // profile loads, so a failure before/after load still records whatever
  // provenance was resolved.
  let profilePath = null;
  let profileVersion = null;
  let fixtureDir = null;
  let fixtureFiles = [];

  try {
    const loadedProfile = loadProfile(profileArg, profilesDir);
    const profile = loadedProfile.data;
    profilePath = loadedProfile.path;
    profileId = profile.profileId || profile.id || profileId;
    profileVersion = profile.version ?? null;
    const loaded = loadFixtures(profile, loadedProfile.path);
    const fixtures = loaded.fixtures;
    fixtureDir = loaded.fixtureDir;
    fixtureFiles = loaded.fixtureFiles;

    // An LLM grader sharing a model family with any generator model inherits its
    // blind spots. Refuse unless explicitly overridden.
    const graderModel = process.env.GRADER_MODEL || 'claude-sonnet-4-5';
    let graderIndependence = null;
    if (graderKind === 'llm' && Array.isArray(profile.models) && profile.models.length > 0) {
      const verdict = assertGraderIndependence(profile.models, graderModel, allowSameFamily);
      if (!verdict.ok) {
        process.stderr.write(
          `run-benchmark: GRADER FAMILY COLLISION — grader '${graderModel}' shares a model family with generator(s) ${JSON.stringify(verdict.collisions)}. `
          + 'Same-family grading is the score-inflation mechanism. Use a different-family grader or pass --allow-same-family to override explicitly.\n',
        );
        process.exit(2);
      }
      graderIndependence = verdict.overridden ? 'overridden-same-family' : 'independent';
    }

    // Profile-declared deliverable contracts make scorers grade only the
    // delimited region. `{required: true}` fails fixtures with no contract region.
    const contract = profile.deliverable_contract
      ? { required: Boolean(profile.deliverable_contract.required) }
      : null;
    const scoreOptions = contract ? { contract } : undefined;

    let results;
    if (scorer === '5dim') {
      // Lazy-require so the default path never loads the scorer tree.
      const scorerModule = require('./scorer/score-model-variant.cjs');
      const cwdAbs = path.resolve(outputsDir);
      results = await Promise.all(
        fixtures.map((fixture) => scoreFixtureWithSamples(
          fixture, outputsDir, samples,
          (outPath) => scoreFixture5dim(fixture, outPath, cwdAbs, graderKind, scorerModule),
        )),
      );
    } else {
      results = await Promise.all(
        fixtures.map((fixture) => scoreFixtureWithSamples(
          fixture, outputsDir, samples,
          (outPath) => scoreFixture(fixture, outPath, scoreOptions),
        )),
      );
    }

    const benchmarkDeltas = buildBenchmarkDeltas(profile, fixtures, results);

    // When the profile declares how the system under test SELF-reports a score,
    // record self-vs-independent per fixture and warn when the mean ratio gap
    // exceeds the profile threshold.
    let phantomGap = null;
    if (profile.self_score_pattern) {
      const selfMax = Number(profile.self_score_max || 100);
      const selfSource = String(profile.self_score_pattern);
      if (selfSource.length > MAX_PATTERN_LENGTH) {
        throw new Error(`run-benchmark: self_score_pattern exceeds ${MAX_PATTERN_LENGTH} chars (len=${selfSource.length}); refusing to compile to avoid regex DoS`);
      }
      let selfRe = null;
      try { selfRe = new RegExp(selfSource, 'i'); }
      catch { process.stderr.write('run-benchmark: self_score_pattern is not a valid regex; skipping phantom-gap metric\n'); }
      const perFixture = [];
      for (const entry of selfRe ? results : []) {
        // Sampled runs may have only run-tagged outputs; fall back to sample 1.
        const candidatePaths = [entry.outputPath];
        if (entry.sample_count) candidatePaths.push(fixtureSampleOutputPath(outputsDir, entry.id, 1));
        const primaryPath = candidatePaths.find((p2) => fs.existsSync(p2));
        const primary = primaryPath ? fs.readFileSync(primaryPath, 'utf8') : '';
        const m = selfRe.exec(primary.slice(0, MAX_MATCH_INPUT_LENGTH));
        const selfVal = m && m[1] !== undefined ? Number(m[1]) : NaN;
        // A non-numeric capture or self_score_max <= 0 must be skipped, never
        // NaN-poisoning the mean because NaN comparisons silently mute the alarm.
        if (Number.isFinite(selfVal) && Number.isFinite(selfMax) && selfMax > 0) {
          const gapRatio = selfVal / selfMax - entry.score / entry.maxScore;
          perFixture.push({ id: entry.id, self_score: selfVal, independent_score: entry.score, gap_ratio: Math.round(gapRatio * 1000) / 1000 });
        }
      }
      if (perFixture.length > 0) {
        const meanGap = perFixture.reduce((a, b) => a + b.gap_ratio, 0) / perFixture.length;
        const warnAt = Number(profile.phantom_gap_warn ?? 0.08);
        phantomGap = {
          per_fixture: perFixture,
          mean_gap_ratio: Math.round(meanGap * 1000) / 1000,
          warn_threshold: warnAt,
          warning: meanGap > warnAt,
        };
        if (phantomGap.warning) {
          process.stderr.write(`run-benchmark: PHANTOM-GAP WARNING — mean self-vs-independent gap ${phantomGap.mean_gap_ratio} exceeds ${warnAt}; self-reported scores are inflating.\n`);
        }
      }
    }
    const aggregateScore = results.length === 0
      ? 0
      : Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length);
    const minimumFixtureScore = profile.benchmark?.minimumFixtureScore ?? 70;
    const aggregateThreshold = profile.benchmark?.requiredAggregateScore ?? 80;
    const passCount = results.filter((entry) => entry.passed).length;
    const passRate = results.length === 0 ? 0 : passCount / results.length;
    // Both operands are in 0..1 space. `aggregateScore` is a 0..100 percentage,
    // so `/100` normalizes it to a 0..1 ratio; `profile.thresholdDelta` is
    // authored as a 0..1 ratio. `delta` is therefore the headroom above the
    // profile's ratio threshold, in 0..1 units.
    const delta = aggregateScore / 100 - Number(profile.thresholdDelta || 0);
    const recommendation =
      aggregateScore >= aggregateThreshold && results.every((entry) => entry.score >= minimumFixtureScore)
        ? 'benchmark-pass'
        : 'benchmark-fail';
    // Persist profile + fixture provenance so a report can be traced back to the
    // exact profile file, version, and fixtures.
    const provenance = {
      profilePath,
      profileVersion,
      fixtureDir,
      fixtureFiles,
    };
    const report = {
      status: 'benchmark-complete',
      scoringMethod: scorer,
      // Grader is part of the run identity for the 5dim path; persist it on
      // every report so 5dim+mock/llm runs are attributable.
      grader: graderKind,
      // Run-identity and anti-Goodhart fields are omitted when defaults apply.
      ...(graderIndependence && { graderModel, graderIndependence }),
      ...(samples > 1 && { samples }),
      ...(contract && { deliverableContract: contract }),
      ...(phantomGap && { phantomGap }),
      profileId,
      family: profile.family,
      target: profile.targetPath,
      label,
      provenance,
      aggregateScore,
      maxScore: 100,
      outcomeScoreDelta: benchmarkDeltas.outcomeScoreDelta,
      fixtureDeltas: benchmarkDeltas.fixtureDeltas,
      fixtureDeltaSummary: benchmarkDeltas.fixtureDeltaSummary,
      totals: {
        score: aggregateScore,
        delta,
        outcomeScoreDelta: benchmarkDeltas.outcomeScoreDelta,
        fixtureDeltaSummary: benchmarkDeltas.fixtureDeltaSummary,
        pass_rate: passRate,
        fixtures: results.length,
        passed: passCount,
      },
      recommendation,
      thresholds: {
        requiredAggregateScore: aggregateThreshold,
        minimumFixtureScore,
        repeatabilityTolerance: profile.benchmark?.repeatabilityTolerance ?? 0,
        thresholdDelta: Number(profile.thresholdDelta || 0),
      },
      rows: results,
      fixtures: results,
      failureModes: aggregateFailureModes(results),
    };

    if (integrationReportPath) {
      const integration = scoreIntegration(integrationReportPath);
      report.integrationScore = integration.integrationScore;
      report.integrationDetails = integration.integrationDetails;
    }

    writeJson(outputPath, report);

    // outputPath is a mutable canonical location overwritten every iteration, so
    // historical state-log rows would all point at the latest report. Also write
    // an immutable, label-stamped snapshot and persist that snapshot path in the
    // ledger so each iteration's report is recoverable. The canonical report.json
    // stays the stable "latest" pointer.
    const historyDir = path.join(path.dirname(outputPath), 'report-history');
    const snapshotName = `report-${sanitizeLabel(label)}-${timestampStamp()}.json`;
    const snapshotPath = path.join(historyDir, snapshotName);
    writeJson(snapshotPath, report);

    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'benchmark_run',
        mode: 'model-benchmark',
        scoringMethod: scorer,
        grader: graderKind,
        profileId,
        family: profile.family,
        target: profile.targetPath,
        label,
        outputDir: outputsDir,
        report: outputPath,
        reportSnapshot: snapshotPath,
        provenance,
        aggregateScore,
        outcomeScoreDelta: benchmarkDeltas.outcomeScoreDelta,
        fixtureDeltas: benchmarkDeltas.fixtureDeltas,
        fixtureDeltaSummary: benchmarkDeltas.fixtureDeltaSummary,
        totals: report.totals,
        rows: results,
        recommendation,
        failureModes: report.failureModes,
      });
    }
  } catch (error) {
    const failure = {
      status: 'infra_failure',
      // A failed 5dim/mock/llm run must be distinguishable from a pattern/noop
      // failure, so carry scorer + grader provenance here too.
      scoringMethod: scorer,
      grader: graderKind,
      profileId,
      family: null,
      evaluationMode: 'benchmark',
      mode: 'model-benchmark',
      outputsDir,
      provenance: {
        profilePath,
        profileVersion,
        fixtureDir,
        fixtureFiles,
      },
      error: error.message,
      failureModes: ['benchmark-runner-failure'],
    };
    writeJson(outputPath, failure);
    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'infra_failure',
        mode: 'model-benchmark',
        evaluationMode: 'benchmark',
        scoringMethod: scorer,
        grader: graderKind,
        profileId,
        family: null,
        provenance: {
          profilePath,
          profileVersion,
          fixtureDir,
          fixtureFiles,
        },
        recommendation: 'infra_failure',
        error: error.message,
        failureModes: ['benchmark-runner-failure'],
      });
    }
    process.exit(1);
  }
}

main().catch((error) => {
  process.stderr.write(`${error && error.stack ? error.stack : error}\n`);
  process.exit(1);
});
