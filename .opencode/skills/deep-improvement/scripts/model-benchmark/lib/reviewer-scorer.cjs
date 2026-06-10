'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const dispatcher = require('../dispatch-model.cjs');
const { DEFAULT_PROFILES_DIR, fixturePathFor } = require('../../lib/profile-resolve.cjs');

const VERDICTS = new Set(['pass', 'fail', 'block']);
const SAFE_FIXTURE_ID = /^[A-Za-z0-9._-]+$/;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];
    if (!entry.startsWith('--')) continue;
    const [key, ...rest] = entry.slice(2).split('=');
    if (rest.length > 0) args[key] = rest.join('=');
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, JSON.stringify(value) + '\n', 'utf8');
}

function normalizeVerdict(value) {
  const verdict = String(value || '').trim().toLowerCase();
  return VERDICTS.has(verdict) ? verdict : null;
}

function isReviewerFixture(fixture) {
  return Boolean(
    fixture &&
    fixture.kind === 'reviewer-prompt' &&
    typeof fixture.prompt_template === 'string' &&
    normalizeVerdict(fixture.expectedVerdict),
  );
}

function assertSafeFixtureId(id) {
  if (typeof id !== 'string' || !SAFE_FIXTURE_ID.test(id) || id === '.' || id === '..') {
    throw new Error("reviewer-scorer: unsafe fixture id '" + id + "'");
  }
}

function resolveMaybeRelative(value, baseDir) {
  if (path.isAbsolute(value)) return value;
  const fromCwd = path.resolve(process.cwd(), value);
  return fs.existsSync(fromCwd) ? fromCwd : path.resolve(baseDir, value);
}

function loadProfile(profileArg, profilesDir) {
  const directPath = path.resolve(process.cwd(), profileArg);
  const profilePath = fs.existsSync(directPath) ? directPath : path.join(profilesDir, profileArg + '.json');
  return { data: readJson(profilePath), path: profilePath };
}

function loadReviewerFixtures(profile, profilePath, fixtureDirArg) {
  const profileDir = path.dirname(profilePath);
  const fixtureDir = resolveMaybeRelative(
    fixtureDirArg || profile.fixtureDir || (profile.benchmark && profile.benchmark.fixtureDir),
    profileDir,
  );
  const fixtureRefs = Array.isArray(profile.fixtures) ? profile.fixtures : (profile.benchmark && profile.benchmark.fixtures) || [];
  const files = fixtureRefs.length > 0
    ? fixtureRefs.map((fixtureRef) => fixturePathFor(fixtureRef, fixtureDir))
    : fs.readdirSync(fixtureDir).filter((entry) => entry.endsWith('.json')).map((entry) => path.join(fixtureDir, entry));
  const fixtures = files.map((filePath) => ({ filePath, fixture: readJson(filePath) }))
    .filter((entry) => isReviewerFixture(entry.fixture));
  return { fixtures, fixtureDir };
}

function inputToText(input) {
  if (input == null) return '';
  if (typeof input === 'string') return input;
  const parts = [];
  for (const key of ['repo_state', 'review_focus', 'diff', 'state_ref']) {
    if (input[key]) parts.push(key + ':\n' + String(input[key]));
  }
  return parts.length > 0 ? parts.join('\n\n') : JSON.stringify(input, null, 2);
}

function applyCase(fixture, testCase) {
  const merged = { ...fixture, ...(testCase || {}) };
  merged.expectedVerdict = normalizeVerdict(merged.expectedVerdict || fixture.expectedVerdict);
  merged.input_kind = merged.input_kind || fixture.input_kind;
  merged.input = merged.input !== undefined ? merged.input : fixture.input;
  merged.expectedFindings = merged.expectedFindings || fixture.expectedFindings || [];
  return merged;
}

function buildReviewerPrompt(fixtureCase) {
  const inputText = inputToText(fixtureCase.input);
  const input = fixtureCase.input && typeof fixtureCase.input === 'object' ? fixtureCase.input : {};
  return String(fixtureCase.prompt_template || '')
    .replace(/{{\s*input\s*}}/g, inputText)
    .replace(/{{\s*diff\s*}}/g, String(input.diff || ''))
    .replace(/{{\s*state_ref\s*}}/g, String(input.state_ref || ''))
    .replace(/{{\s*review_focus\s*}}/g, String(input.review_focus || fixtureCase.review_focus || ''));
}

function extractVerdict(text) {
  const raw = String(text || '');
  const explicit = raw.match(/\b(?:verdict|result|status)\s*[:=-]\s*(pass|fail|block)\b/i);
  if (explicit) return { verdict: normalizeVerdict(explicit[1]), method: 'pattern' };
  const standalone = raw.match(/\b(pass|fail|block)\b/i);
  if (standalone) return { verdict: normalizeVerdict(standalone[1]), method: 'pattern' };
  return { verdict: null, method: 'none' };
}

function findingPassed(output, finding) {
  const text = String(output || '').toLowerCase();
  const required = Array.isArray(finding.mustInclude) ? finding.mustInclude : [];
  return required.every((token) => text.includes(String(token).toLowerCase()));
}

function dispatchPrompt(prompt, opts) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reviewer-scorer-'));
  const promptFile = path.join(dir, 'prompt.txt');
  fs.writeFileSync(promptFile, prompt, 'utf8');
  try {
    const result = dispatcher.dispatch({
      prompt_file: promptFile,
      executor: opts.executor,
      model: opts.model,
      variant: opts.variant,
      timeout_ms: opts.timeout_ms,
      mock: opts.mock,
      mock_mode: opts.mock_mode,
      state_dir: opts.state_dir,
      cwd: dir,
    });
    const stdout = result.stdout || '';
    const parsed = result.mock ? { output: stdout, usage_parser_status: 'absent' } : dispatcher.parseOpencodeStream(stdout);
    return parsed.usage_parser_status === 'error' ? stdout : parsed.output;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function classifyWithGrader(output, opts) {
  if (opts.grader !== 'llm') return { verdict: null, method: 'none' };
  const prompt = [
    'Classify the reviewer output into exactly one verdict: PASS, FAIL, or BLOCK.',
    'Return only `VERDICT: <value>`.',
    '',
    'Reviewer output:',
    String(output || ''),
  ].join('\n');
  const graded = dispatchPrompt(prompt, opts);
  const extracted = extractVerdict(graded);
  return { verdict: extracted.verdict, method: extracted.verdict ? 'llm-grader' : 'none' };
}

function scoreReviewerOutput(output, fixtureCase, opts) {
  let extracted = extractVerdict(output);
  if (!extracted.verdict) extracted = classifyWithGrader(output, opts || {});
  const expectedVerdict = normalizeVerdict(fixtureCase.expectedVerdict);
  const verdictOk = extracted.verdict === expectedVerdict;
  const findingChecks = (fixtureCase.expectedFindings || []).map((finding) => ({
    id: finding.id || 'finding',
    ok: findingPassed(output, finding),
  }));
  const findingsOk = findingChecks.every((entry) => entry.ok);
  return {
    expectedVerdict,
    extractedVerdict: extracted.verdict,
    verdictMethod: extracted.method,
    verdictOk,
    findingsOk,
    findingChecks,
    ok: verdictOk && findingsOk,
  };
}

function runCase(fixture, testCase, opts) {
  const fixtureCase = applyCase(fixture, testCase);
  const output = fixtureCase.reviewer_output || dispatchPrompt(buildReviewerPrompt(fixtureCase), opts || {});
  const scored = scoreReviewerOutput(output, fixtureCase, opts || {});
  return {
    name: fixtureCase.name || fixture.id,
    ok: scored.ok,
    expectedVerdict: scored.expectedVerdict,
    extractedVerdict: scored.extractedVerdict,
    verdictMethod: scored.verdictMethod,
    verdictOk: scored.verdictOk,
    findingsOk: scored.findingsOk,
    findingChecks: scored.findingChecks,
    outputHash: crypto.createHash('sha256').update(String(output), 'utf8').digest('hex').slice(0, 16),
  };
}

function scoreReviewerFixture(fixture, opts) {
  if (!isReviewerFixture(fixture)) throw new Error('reviewer-scorer: malformed reviewer fixture ' + (fixture && fixture.id));
  assertSafeFixtureId(fixture.id);
  const visible = Array.isArray(fixture.tests) && fixture.tests.length > 0 ? fixture.tests : [{ name: fixture.id }];
  const hidden = Array.isArray(fixture.hidden_tests) ? fixture.hidden_tests : [];
  const perTest = visible.concat(hidden).map((testCase) => runCase(fixture, testCase, opts || {}));
  const passed = perTest.filter((entry) => entry.ok).length;
  const total = perTest.length;
  const mismatches = perTest.filter((entry) => !entry.ok).map((entry) => ({
    case: entry.name,
    expected: entry.expectedVerdict,
    got: entry.extractedVerdict || 'unknown',
    message: 'REVIEWER_BENCHMARK: fixture ' + fixture.id + ' expected ' + String(entry.expectedVerdict || 'unknown').toUpperCase() + ', got ' + String(entry.extractedVerdict || 'unknown').toUpperCase() + ' — rule not safe to promote',
  }));
  const passRate = total ? passed / total : 0;
  return {
    id: fixture.id,
    score: Math.round(passRate * 100),
    maxScore: 100,
    passed: mismatches.length === 0,
    scoringMethod: 'reviewer',
    correctness_pass_rate: passRate,
    assertions_passed: passed,
    assertions_total: total,
    dimensions: {
      D1: passRate,
      D2: perTest.every((entry) => entry.findingsOk) ? 1 : 0,
      D3: fixture.input_kind === 'diff' || fixture.input_kind === 'state_ref' ? 1 : 0,
      D4: perTest.some((entry) => entry.verdictMethod === 'llm-grader') ? 1 : 0,
      D5: perTest.every((entry) => entry.extractedVerdict) ? 1 : 0,
    },
    per_test: perTest,
    mismatchMessages: mismatches.map((entry) => entry.message),
    failureModes: mismatches.length === 0 ? [] : ['reviewer-verdict-mismatch'],
  };
}

function runReviewerBenchmark(opts) {
  if (!opts.profile) throw new Error('reviewer-scorer: --profile is required');
  const loaded = loadProfile(opts.profile, opts.profilesDir || DEFAULT_PROFILES_DIR);
  const profile = loaded.data;
  const reviewer = loadReviewerFixtures(profile, loaded.path, opts.fixtureDir);
  const rows = reviewer.fixtures.map((entry) => scoreReviewerFixture(entry.fixture, opts));
  const aggregateScore = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length) : 0;
  return {
    status: 'benchmark-complete',
    scoringMethod: 'reviewer',
    grader: opts.grader || 'noop',
    profileId: profile.profileId || profile.id || opts.profile,
    fixtureDir: reviewer.fixtureDir,
    aggregateScore,
    maxScore: 100,
    totals: {
      score: aggregateScore,
      fixtures: rows.length,
      passed: rows.filter((row) => row.passed).length,
      pass_rate: rows.length ? rows.filter((row) => row.passed).length / rows.length : 0,
    },
    recommendation: rows.length > 0 && rows.every((row) => row.passed) ? 'benchmark-pass' : 'benchmark-fail',
    rows,
    fixtures: rows,
    failureModes: [...new Set(rows.flatMap((row) => row.failureModes || []))],
    reviewerBenchmarkMessages: rows.flatMap((row) => row.mismatchMessages || []),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const enabled = process.env.SPECKIT_REVIEWER_BENCHMARKS === '1' || process.env.SPECKIT_REVIEWER_BENCHMARKS === 'true';
  if (!enabled) {
    process.stderr.write('reviewer-scorer: SPECKIT_REVIEWER_BENCHMARKS is not enabled; reviewer fixtures are inert\n');
    process.exit(0);
  }
  const outputPath = args.output || (args['outputs-dir'] ? path.join(args['outputs-dir'], 'reviewer-report.json') : null);
  if (!outputPath) {
    process.stderr.write('usage: reviewer-scorer.cjs --profile <path-or-id> --outputs-dir <path> [--output <path>] [--grader noop|mock|llm]\n');
    process.exit(2);
  }
  const report = runReviewerBenchmark({
    profile: args.profile,
    outputsDir: args['outputs-dir'],
    profilesDir: args['profiles-dir'],
    fixtureDir: args['fixture-dir'],
    outputPath,
    stateLogPath: args['state-log'],
    grader: args.grader || 'noop',
    executor: args.executor,
    model: args.model,
    variant: args.variant,
    mock: args.mock === true || args.mock === 'true',
    mock_mode: args['mock-mode'],
    state_dir: args['state-dir'],
  });
  writeJson(outputPath, report);
  if (args['state-log']) {
    appendJsonl(args['state-log'], {
      type: 'benchmark_run',
      mode: 'model-benchmark',
      scoringMethod: 'reviewer',
      grader: args.grader || 'noop',
      profileId: report.profileId,
      report: outputPath,
      aggregateScore: report.aggregateScore,
      totals: report.totals,
      rows: report.rows,
      recommendation: report.recommendation,
      failureModes: report.failureModes,
    });
  }
  process.stdout.write(JSON.stringify({
    status: report.status,
    scoringMethod: report.scoringMethod,
    aggregateScore: report.aggregateScore,
    fixtures: report.totals.fixtures,
  }, null, 2) + '\n');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write((error && error.stack) ? error.stack + '\n' : String(error) + '\n');
    process.exit(1);
  }
}

module.exports = {
  isReviewerFixture,
  normalizeVerdict,
  extractVerdict,
  buildReviewerPrompt,
  scoreReviewerOutput,
  scoreReviewerFixture,
  runReviewerBenchmark,
};
