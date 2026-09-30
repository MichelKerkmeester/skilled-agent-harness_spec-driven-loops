// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Transport Benchmark Tests
// ───────────────────────────────────────────────────────────────────
// Fixture executables live in the OS temp directory and go first on PATH; no
// test reaches a real backend or opens a socket.

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import * as S from '../score-pi-transport.mjs';

// The cases build their option text and rotations with the CLI's own builders,
// so the shapes under test are the ones the CLI actually passes.
import { optionArgs, rotations } from '../../../../system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs';

// Fresh temp directory whose name marks it as a fixture.
function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `pitransport-${prefix}-`));
}

test('which_finds_stub_first_on_path', () => {
  const bin = tempDir('bin');
  const later = tempDir('later');
  fs.writeFileSync(path.join(bin, 'jev'), '#!/bin/sh\nexit 1\n', { mode: 0o755 });
  assert.equal(S.which('jev', { PATH: `${bin}${path.delimiter}${later}` }), path.join(bin, 'jev'));
});

test('which_returns_null_for_a_missing_name', () => {
  assert.equal(S.which('not-a-binary', { PATH: tempDir('empty') }), null);
});

// One recorded choice line. The three orders of a row answer the same question
// over the same options, so their maps share one key set.
function choiceRecord(rowId, order, probabilities) {
  return JSON.stringify({
    backend: 'jev',
    kind: 'choice',
    row_id: rowId,
    order,
    attempt: 1,
    call_ms: 300 + order,
    exit_code: 0,
    probabilities,
    status: 'measured',
  });
}

// The recorded file's shape: one auth_test line, then three choice lines per row.
function baselineText(rowCount) {
  const full = { none: 0.01, 'mcp-code-mode': 0.94, 'sk-code': 0.03, 'mcp-tooling': 0.02 };
  const lines = [JSON.stringify({ backend: 'jev', kind: 'auth_test', exit_code: 0, status: 'measured' })];
  for (let n = 1; n <= rowCount; n += 1) {
    const rowId = `row-${String(n).padStart(3, '0')}`;
    for (let order = 0; order < 3; order += 1) lines.push(choiceRecord(rowId, order, full));
  }
  return `${lines.join('\n')}\n`;
}

test('read_baseline_counts_rows_calls_and_full_maps', () => {
  const baseline = S.readBaseline(baselineText(111));
  assert.equal(baseline.unreadable, false);
  assert.equal(baseline.rows, 111);
  assert.equal(baseline.calls, 333);
  assert.equal(baseline.fullRows, 111);
  assert.equal(baseline.byRow.size, 111);
});

test('read_baseline_reports_unreadable_empty', () => {
  const baseline = S.readBaseline('');
  assert.equal(baseline.unreadable, true);
  assert.equal(baseline.reason, 'empty');
});

test('read_baseline_tolerates_a_partial_map', () => {
  const four = { none: 0.01, alpha: 0.9, beta: 0.05, gamma: 0.04 };
  const two = { none: 0.01, alpha: 0.99 };
  const text = `${[
    choiceRecord('row-full', 0, four),
    choiceRecord('row-full', 1, four),
    choiceRecord('row-full', 2, four),
    choiceRecord('row-partial', 0, four),
    choiceRecord('row-partial', 1, two),
    choiceRecord('row-partial', 2, four),
  ].join('\n')}\n`;
  const baseline = S.readBaseline(text);
  assert.equal(baseline.unreadable, false);
  assert.equal(baseline.rows, 2);
  assert.equal(baseline.calls, 6);
  assert.equal(baseline.fullRows, 1);
});

test('read_baseline_rejects_non_json', () => {
  const baseline = S.readBaseline('not json');
  assert.equal(baseline.unreadable, true);
  assert.equal(baseline.reason, 'unparseable');
});

// A stub jev that answers the two identity reads and records every invocation,
// so a test can prove the census never asked it for a classification. The
// `authExit` argument states a missing credential without touching a store.
function stubJev(dir, authExit = 0) {
  const file = path.join(dir, 'jev');
  const log = path.join(dir, 'invocations.log');
  fs.writeFileSync(file, [
    '#!/bin/sh',
    `echo "$*" >> ${JSON.stringify(log)}`,
    'case "$1" in',
    '  --version) echo "jev 0.6.2"; exit 0 ;;',
    `  auth) exit ${authExit} ;;`,
    'esac',
    'exit 1',
    '',
  ].join('\n'), { mode: 0o755 });
  return file;
}

// A stub `pi` executable inside its own package manifest. The resolver reads the
// manifest only, but the executable must exist and be runnable for `which` to
// name it, and the manifest's version is what the census line reports.
function stubPiPackage(root) {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'pi'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: '@earendil-works/pi-coding-agent', version: '0.99.1' }),
  );
  return { bin, packageDir: fs.realpathSync(root) };
}

// A fake classifier runtime shaped like the SDK's: one synchronous catalog read
// and one awaited availability read, both without a provider so the census sees
// every provider at once. `reads` records those two calls, proving the census
// asked once each and classified nothing.
function stubRuntime(known, available) {
  const reads = [];
  return {
    reads,
    getModelsOfType: (type, providerId) => {
      reads.push(['models', type, providerId]);
      return known;
    },
    getAvailableOfType: async (type, providerId) => {
      reads.push(['available', type, providerId]);
      return available;
    },
  };
}

test('census_lines_zero_call_order_and_count', async () => {
  const bin = tempDir('jev');
  const jevPath = stubJev(bin);
  const jev = S.readJevCensus({ PATH: bin, JEV_PROVIDER: 'official' });
  const llama = S.readLlamaCensus({ PATH: bin });
  const baseline = S.readBaseline(baselineText(111));

  // Twelve classifier models on one provider, seven of them credentialed, so the
  // census has to count the known list and the available list separately.
  const known = Array.from({ length: 12 }, (_, index) => ({ provider: 'openrouter', id: `classifier-${index}` }));
  const runtime = stubRuntime(known, known.slice(0, 7));
  const pi = await S.readPiCensus({ PATH: bin }, { runtime });

  const lines = S.censusLines({ pi, jev, llama, baseline });

  assert.equal(lines.length, 8);
  assert.equal(lines[0], 'pi: path=none version=none');
  assert.equal(lines[1], 'pi classifier openrouter: known=12 available=7');
  assert.equal(lines[2], 'pi classifier total: known=12 available=7');
  assert.equal(lines[3], `jev: path=${jevPath} version=0.6.2 provider=official`);
  assert.equal(lines[4], 'jev identity: provider=official auth=ok');
  assert.equal(lines[5], 'llama.cpp: server=none cli=none');
  assert.match(lines[6], /^baseline: path=\S+ rows=111 choice=333 rows_with_3_full_maps=111$/);
  assert.equal(lines[7], 'replay: rows=111 calls=333 key_source=recorded');

  // The two catalog reads happen once each, without a provider.
  assert.deepEqual(runtime.reads, [
    ['models', 'classifier', undefined],
    ['available', 'classifier', undefined],
  ]);

  // The stub log shows exactly the two identity reads, so the census made no
  // classifier call.
  assert.deepEqual(
    fs.readFileSync(path.join(bin, 'invocations.log'), 'utf8').trim().split('\n'),
    ['--version', 'auth status --provider official'],
  );
});

test('census_lines_report_zero_available_without_credentials', async () => {
  const root = tempDir('pi');
  const { bin, packageDir } = stubPiPackage(root);
  stubJev(bin, 1);
  const jev = S.readJevCensus({ PATH: bin });
  const llama = S.readLlamaCensus({ PATH: bin });
  const baseline = S.readBaseline(baselineText(3));

  // Two providers offer classifier models, and no credential is present for
  // either, so every availability count is zero.
  const known = [
    ...Array.from({ length: 7 }, (_, index) => ({ provider: 'openrouter', id: `openrouter-${index}` })),
    ...Array.from({ length: 5 }, (_, index) => ({ provider: 'z-ai', id: `z-ai-${index}` })),
  ];
  const pi = await S.readPiCensus({ PATH: bin }, { runtime: stubRuntime(known, []) });

  const lines = S.censusLines({ pi, jev, llama, baseline });

  assert.deepEqual(lines.slice(0, 4), [
    `pi: path=${packageDir} version=0.99.1`,
    'pi classifier openrouter: known=7 available=0',
    'pi classifier z-ai: known=5 available=0',
    'pi classifier total: known=12 available=0',
  ]);
  assert.equal(lines[4], `jev: path=${path.join(bin, 'jev')} version=0.6.2 provider=official`);
  assert.equal(lines[5], 'jev identity: provider=official auth=absent');
});

// Runs main with captured lines, a PATH holding only the fixtures a test put
// there, and no inherited backend endpoint, so no test can reach a real tool.
async function runMain(args, options = {}) {
  const lines = [];
  const errors = [];
  const code = await S.main(args, {
    env: { PATH: options.bin ?? '', JEV_PROVIDER: 'official' },
    runtime: options.runtime,
    baselinePath: options.baselinePath,
    loadCensus: options.loadCensus,
    out: (line) => lines.push(line),
    err: (line) => errors.push(line),
  });
  return { code, lines, errors };
}

test('main_default_run_makes_no_call_and_writes_nothing', async () => {
  const bin = tempDir('bin');
  stubJev(bin);
  const work = tempDir('cwd');
  const runtime = stubRuntime(
    Array.from({ length: 12 }, (_, index) => ({ provider: 'openrouter', id: `classifier-${index}` })),
    Array.from({ length: 7 }, (_, index) => ({ provider: 'openrouter', id: `classifier-${index}` })),
  );

  // The run starts from a directory of its own: a file written relative to the
  // working directory would land in this listing, and the recorded baseline
  // still has to resolve, because its path is relative to the repository.
  const previous = process.cwd();
  process.chdir(work);
  let result;
  try {
    result = await runMain([], { bin, runtime });
  } finally {
    process.chdir(previous);
  }

  assert.equal(result.code, 0);
  assert.deepEqual(result.errors, []);
  assert.equal(result.lines.length, 8);
  assert.equal(result.lines[0], 'pi: path=none version=none');
  assert.equal(result.lines[1], 'pi classifier openrouter: known=12 available=7');
  assert.equal(result.lines[2], 'pi classifier total: known=12 available=7');
  assert.equal(result.lines[3], `jev: path=${path.join(bin, 'jev')} version=0.6.2 provider=official`);
  assert.equal(result.lines[4], 'jev identity: provider=official auth=ok');
  assert.equal(result.lines[5], 'llama.cpp: server=none cli=none');
  assert.match(result.lines[6], /^baseline: path=\S+ rows=111 choice=333 rows_with_3_full_maps=111$/);
  assert.equal(result.lines[7], 'replay: rows=111 calls=333 key_source=recorded');

  // Both catalog reads happened once and no classification was attempted.
  assert.deepEqual(runtime.reads, [
    ['models', 'classifier', undefined],
    ['available', 'classifier', undefined],
  ]);
  assert.deepEqual(
    fs.readFileSync(path.join(bin, 'invocations.log'), 'utf8').trim().split('\n'),
    ['--version', 'auth status --provider official'],
  );
  assert.deepEqual(fs.readdirSync(work), []);
});

test('main_live_without_out_exits_two_before_any_line', async () => {
  for (const flag of ['--pi', '--cli']) {
    const { code, lines, errors } = await runMain([flag]);
    assert.equal(code, 2, flag);
    assert.deepEqual(lines, [], flag);
    assert.deepEqual(errors, [`${flag} needs --out <dir> so every call is recorded`], flag);
  }
});

test('main_out_alone_exits_two', async () => {
  const { code, lines, errors } = await runMain(['--out', tempDir('out')]);
  assert.equal(code, 2);
  assert.deepEqual(lines, []);
  assert.deepEqual(errors, ['--out is only legal with --pi or --cli']);
});

test('main_unknown_flag_exits_two', async () => {
  const { code, lines, errors } = await runMain(['--nope']);
  assert.equal(code, 2);
  assert.deepEqual(lines, []);
  assert.deepEqual(errors, ["Unknown option '--nope'"]);
});

test('main_unreadable_baseline_exits_one', async () => {
  const missing = path.join(tempDir('missing'), 'calls.jsonl');
  const { code, lines, errors } = await runMain([], { baselinePath: missing });
  assert.equal(code, 1);
  assert.deepEqual(lines, [`stop: baseline ${missing} missing`]);
  assert.deepEqual(errors, []);
});

// The copied literals belong to the suggested-order eval and stay private there;
// this test reads that file from disk to pin the copy and to signal the switch
// to an import if its declarations ever become exported.
const UPSTREAM_SUGGESTED_ORDER = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs',
);

test('census_private_literals_still_match', () => {
  const source = fs.readFileSync(UPSTREAM_SUGGESTED_ORDER, 'utf8');
  for (const [name, value] of [
    ['CHOICE_QUESTION', S.CHOICE_QUESTION],
    ['NONE_DESCRIPTION', S.NONE_DESCRIPTION],
  ]) {
    const declared = new RegExp(`^const ${name} = '([^']*)';$`, 'm').exec(source);
    assert.notEqual(declared, null, `${name} is no longer declared as a private const beside the suggested-order eval`);
    assert.equal(declared[1], value, `${name} no longer matches the copied literal`);
  }
});

test('criteria_map_keeps_option_text_and_order', () => {
  const cluster = ['sk-code', 'mcp-code-mode'];
  const rotation = ['mcp-code-mode', 'none', 'sk-code'];
  const describe = (key) => `Description of ${key}`;
  const criteria = S.criteriaMap(optionArgs(rotation, describe, cluster));
  assert.deepEqual(Object.keys(criteria), rotation);
  assert.equal(criteria.none, S.NONE_DESCRIPTION);
  assert.equal(criteria['mcp-code-mode'], 'Description of mcp-code-mode');
});

test('criteria_map_keeps_the_disambiguator_suffix', () => {
  const cluster = ['alpha', 'beta'];
  const describe = () => 'The same description';
  const criteria = S.criteriaMap(optionArgs([...cluster, 'none'], describe, cluster));
  assert.equal(criteria.alpha, 'The same description [alpha]');
  assert.equal(criteria.beta, 'The same description [beta]');
});

// The CLI names no question and Pi names every one, so both shapes meet on the
// single name the constant fixes.
test('to_classifier_context_wraps_state_and_one_question', () => {
  const prompt = 'Which skill should handle this request?';
  const keys = ['sk-code', 'none'];
  const criteria = { 'sk-code': 'Description of sk-code', none: S.NONE_DESCRIPTION };
  const context = S.toClassifierContext({ prompt, keys, criteria });
  assert.equal(context.state.request, prompt);
  assert.deepEqual(Object.keys(context.questions), ['answer']);
  assert.equal(context.questions.answer.type, 'choice');
  assert.equal(context.questions.answer.instructions, S.CHOICE_QUESTION);
  assert.deepEqual(context.questions.answer.criteria, criteria);
});

test('probabilities_from_full_map', () => {
  const keys = ['mcp-code-mode', 'none', 'sk-code'];
  const probabilities = { 'sk-code': 0.2, none: 0.1, 'mcp-code-mode': 0.7 };
  const result = { stopReason: 'stop', answers: { answer: { type: 'choice', probabilities } } };
  const { raw, full } = S.probabilitiesFrom(result, 'answer', keys);
  assert.notEqual(full, null);
  assert.deepEqual(Object.keys(full), keys);
  assert.equal(full['mcp-code-mode'], 0.7);
  assert.deepEqual(raw, probabilities);
});

test('probabilities_from_partial_map_is_unmeasured', () => {
  const probabilities = { alpha: 0.6, beta: 0.4 };
  const result = { stopReason: 'stop', answers: { answer: { type: 'choice', probabilities } } };
  const { raw, full } = S.probabilitiesFrom(result, 'answer', ['alpha', 'beta', 'none']);
  assert.equal(full, null);
  assert.deepEqual(raw, probabilities);
});

test('probabilities_from_error_result', () => {
  const result = { stopReason: 'error', errorMessage: 'classifier unavailable' };
  assert.deepEqual(S.probabilitiesFrom(result, 'answer', ['alpha']), { raw: null, full: null });
});

// The second map prefers beta, so only the mean over both orders can pick alpha.
test('top_key_by_mean_uses_the_mean_over_orders', () => {
  const maps = [
    { alpha: 0.9, beta: 0.1 },
    { alpha: 0.3, beta: 0.7 },
  ];
  assert.equal(S.topKeyByMean(maps, ['alpha', 'beta']), 'alpha');
});

test('top_key_by_mean_ties_keep_keys_order', () => {
  const maps = [
    { alpha: 0.6, beta: 0.4 },
    { alpha: 0.4, beta: 0.6 },
  ];
  assert.equal(S.topKeyByMean(maps, ['alpha', 'beta']), 'alpha');
  assert.equal(S.topKeyByMean(maps, ['beta', 'alpha']), 'beta');
});

// The mean is a plain per-key average over the orders. A key absent from one
// order is not filled in with a zero, so the arithmetic leaves it without a
// usable mean and only full maps belong here.
test('mean_map_averages_each_key_over_the_orders', () => {
  const maps = [
    { alpha: 0.75, beta: 0.125, none: 0.125 },
    { alpha: 0.375, beta: 0.5, none: 0.125 },
    { alpha: 0.375, beta: 0.125, none: 0.5 },
  ];

  const means = S.meanMap(maps, ['alpha', 'beta', 'none']);
  assert.equal(means.alpha, 0.5);
  assert.equal(means.beta, 0.25);
  assert.equal(means.none, 0.25);

  const partial = S.meanMap([{ alpha: 0.5, beta: 0.75 }, { alpha: 0.25 }], ['alpha', 'beta']);
  assert.equal(partial.alpha, 0.375);
  assert.equal(Number.isNaN(partial.beta), true);
});

// A row's recorded questions can only be replayed when the census rebuilds the
// same option set the CLI was asked, so the plan pairs each recorded order with
// the rotation and the CLI's own option arguments it was asked in.
test('build_replay_plan_matches_on_an_equal_key_set', () => {
  const baseline = S.readBaseline(baselineText(1));
  const cluster = ['mcp-code-mode', 'sk-code', 'mcp-tooling'];
  const census = {
    rows: [{ id: 'row-001', prompt: 'Which skill should handle this request?', cluster }],
  };
  const describe = (key) => `Description of ${key}`;

  const { plan, excluded } = S.buildReplayPlan({ baseline, census, describe });

  assert.deepEqual(excluded, []);
  const row = plan.get('row-001');
  assert.notEqual(row, undefined);
  assert.deepEqual(row.cluster, cluster);
  assert.equal(row.prompt, census.rows[0].prompt);
  assert.deepEqual(row.keys, [...cluster, 'none']);
  assert.deepEqual(row.orders.map((call) => call.order), [0, 1, 2]);
  assert.deepEqual(row.orders[1].keys, ['sk-code', 'mcp-tooling', 'none', 'mcp-code-mode']);
  assert.deepEqual(row.orders[0].args, optionArgs(row.orders[0].keys, describe, cluster));
});

test('build_replay_plan_excludes_on_a_key_set_mismatch', () => {
  const baseline = S.readBaseline(baselineText(1));
  const census = {
    rows: [{
      id: 'row-001',
      prompt: 'Which skill should handle this request?',
      cluster: ['mcp-code-mode', 'sk-code', 'mcp-tooling', 'sk-doc'],
    }],
  };

  const { plan, excluded } = S.buildReplayPlan({ baseline, census, describe: (key) => key });

  assert.equal(plan.size, 0);
  assert.deepEqual(excluded, ['row-001']);
});

// A ten-row plan whose rows carry the three-option set the metrics tests
// compare, so each test states its own numbers rather than a fixture's.
function metricsPlan(rowCount) {
  return new Map(
    Array.from({ length: rowCount }, (_, index) => {
      const rowId = `metrics-${String(index + 1).padStart(3, '0')}`;
      return [rowId, {
        prompt: 'Which skill should handle this request?',
        cluster: ['alpha', 'beta'],
        keys: ['alpha', 'beta', 'none'],
        orders: [0, 1, 2],
      }];
    }),
  );
}

test('metrics_for_counts_coverage_and_agreement', () => {
  const plan = metricsPlan(10);
  const piByRow = new Map();
  const cliByRow = new Map();
  for (let index = 0; index < 9; index += 1) {
    const rowId = `metrics-${String(index + 1).padStart(3, '0')}`;
    // One row's Pi answer prefers beta while the CLI prefers alpha, so the
    // agreement lands one row short of the measured nine.
    const agrees = index < 8;
    piByRow.set(rowId, [{ alpha: agrees ? 0.7 : 0.2, beta: agrees ? 0.2 : 0.7, none: 0.1 }]);
    cliByRow.set(rowId, [{ alpha: 0.6, beta: 0.3, none: 0.1 }]);
  }

  const metrics = S.metricsFor({ K: plan.size, plan, piByRow, cliByRow });

  assert.equal(metrics.K, 10);
  assert.equal(metrics.M, 9);
  assert.equal(metrics.coverage, 90);
  assert.equal(metrics.agreement, 88.9);
});

test('metrics_for_median_over_a_partial_map_row', () => {
  const plan = new Map([
    ['row-both', { prompt: 'Which skill should handle this request?', cluster: ['alpha'], keys: ['alpha', 'none'], orders: [0, 1, 2] }],
    ['row-pi-only', { prompt: 'Which skill should handle this request?', cluster: ['alpha'], keys: ['alpha', 'none'], orders: [0, 1, 2] }],
  ]);
  const piByRow = new Map([
    ['row-both', [{ alpha: 0.25, none: 0.75 }]],
    ['row-pi-only', [{ alpha: 1, none: 0 }]],
  ]);
  const cliByRow = new Map([['row-both', [{ alpha: 0, none: 1 }]]]);

  const metrics = S.metricsFor({ K: plan.size, plan, piByRow, cliByRow });

  // The one-sided row leaves the measured total and the median untouched: the
  // median is the both-sided row's own 0.25, not a value mixed with a map the
  // CLI never sent.
  assert.equal(metrics.M, 1);
  assert.equal(metrics.coverage, 50);
  assert.equal(metrics.agreement, 100);
  assert.equal(metrics.median_abs_dp, 0.25);
});

// A run's metrics with every bound passing, so each judge test moves one field
// and reads the outcome the rule returns for it.
function passingMetrics(overrides = {}) {
  return {
    K: 10,
    M: 10,
    coverage: 100,
    agreement: 100,
    median_abs_dp: 0,
    p95_ms_pi: 100,
    p95_ms_cli: 100,
    cost_per_100: 0.001,
    ...overrides,
  };
}

test('judge_stops_on_coverage_below_ninety', () => {
  assert.deepEqual(S.judge(passingMetrics({ coverage: 89.9 })), { outcome: 'stop', reason: 'coverage' });
});

test('judge_keeps_cli_on_agreement_below_ninety_five', () => {
  assert.deepEqual(S.judge(passingMetrics({ agreement: 94.9 })), { outcome: 'keep-cli', reason: 'agreement' });
});

test('judge_keeps_cli_on_latency_over_one_and_a_half', () => {
  assert.deepEqual(S.judge(passingMetrics({ p95_ms_pi: 200 })), { outcome: 'keep-cli', reason: 'latency' });
});

test('judge_adopts_when_every_bound_holds', () => {
  // Coverage at 90, agreement at 95 and latency at exactly 1.5x all sit on the
  // rule's inclusive bounds, so each check has to pass at its edge.
  assert.deepEqual(
    S.judge(passingMetrics({ coverage: 90, agreement: 95, p95_ms_pi: 150 })),
    { outcome: 'adopt', reason: null },
  );
});

test('verdict_line_matches_the_fixed_field_order', () => {
  const verdict = {
    outcome: 'adopt',
    reason: null,
    K: 111,
    M: 110,
    coverage: 99.1,
    agreement: 97.3,
    median_abs_dp: 0.0123,
    p95_ms_pi: 412,
    p95_ms_cli: 388,
    cost_per_100: null,
  };

  assert.equal(
    S.verdictLine(verdict),
    'verdict pi-transport: adopt K=111 M=110 coverage=99.1 agreement=97.3 median_abs_dp=0.0123 p95_ms=412/388 cost_per_100=none',
  );
  assert.equal(
    S.verdictLine({ ...verdict, outcome: 'stop', reason: 'coverage' }),
    'verdict pi-transport: stop (coverage) K=111 M=110 coverage=99.1 agreement=97.3 median_abs_dp=0.0123 p95_ms=412/388 cost_per_100=none',
  );
});

// One tail field per side: the cost only Pi reports, and the call count only
// the CLI needs to explain its own rows.
test('column_line_pi_prints_cost_and_cli_prints_calls', () => {
  assert.equal(
    S.columnLine({ backend: 'pi', rows: 2, measured: 2, p50_ms: 120, p95_ms: 300, cost_per_100: 0.0421 }),
    'column pi: rows=2 measured=2 p50_ms=120 p95_ms=300 cost_per_100=0.0421',
  );
  assert.equal(
    S.columnLine({ backend: 'jev', rows: 2, measured: 2, p50_ms: 200, p95_ms: 400, calls: 6 }),
    'column cli: rows=2 measured=2 p50_ms=200 p95_ms=400 calls=6',
  );
});

// The arm tests inject a fake runtime, and its `classifications` prove what the
// arm asked and how many calls it made.
function stubPiRuntime(models, classify = () => { throw new Error('the arm must not classify here'); }) {
  const classifications = [];
  return {
    classifications,
    getAvailableOfType: async (type, providerId) => models,
    getModelOfType: (type, providerId, modelId) => (
      models.some((entry) => entry.id === modelId) ? { type, provider: providerId, id: modelId } : undefined
    ),
    classify: (model, context, options) => {
      classifications.push({ model, context, options });
      return classify(model, context, options);
    },
  };
}

// One recorded call: one row, its option order and the CLI's own argument
// builder, so the arm rebuilds exactly the question a replay would ask.
const ARM_PROMPT = 'Which skill should handle this request?';

function singleCallPlan() {
  const cluster = ['mcp-code-mode', 'sk-code', 'mcp-tooling'];
  const keys = [...cluster, 'none'];
  const describe = (key) => `Description of ${key}`;
  return new Map([['row-001', {
    prompt: ARM_PROMPT,
    cluster,
    keys,
    orders: [{ order: 0, keys, args: optionArgs(keys, describe, cluster) }],
  }]]);
}

// A full choice answer over the option set the question carries, with a usage
// report so the arm has a cost to scale to a hundred calls.
function fullChoiceAnswer(model, context) {
  const keys = Object.keys(context.questions.answer.criteria);
  const probabilities = {};
  for (let index = 0; index < keys.length; index += 1) {
    probabilities[keys[index]] = (index + 1) / (keys.length + 1);
  }
  return Promise.resolve({
    api: 'classifier',
    provider: 'openrouter',
    model: 'typesafe/jev-1.13',
    answers: {
      answer: {
        type: 'choice',
        choice: keys[0],
        probabilities,
        confidence: probabilities[keys[0]],
      },
    },
    usage: {
      input: 10,
      output: 2,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 12,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0.0004 },
    },
    stopReason: 'stop',
    timestamp: 0,
  });
}

// Runs the arm with captured lines into a fresh report directory.
async function runArm(options) {
  const lines = [];
  const errors = [];
  const outDir = tempDir('out');
  const result = await S.runPiArm({
    env: { PATH: options.bin },
    runtime: options.runtime,
    plan: singleCallPlan(),
    timeoutMs: options.timeoutMs,
    outDir,
    out: (line) => lines.push(line),
    err: (line) => errors.push(line),
  });
  return { result, lines, errors, outDir };
}

// One JSON object per calls.jsonl line.
function readCallRecords(outDir) {
  return fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
}

test('run_pi_arm_skips_when_the_model_is_unavailable', async () => {
  const root = tempDir('pi');
  const { bin } = stubPiPackage(root);
  const runtime = stubPiRuntime([{ provider: 'openrouter', id: 'some/other-classifier' }]);
  const { result, lines, errors, outDir } = await runArm({ bin, runtime });

  assert.deepEqual(lines, [
    'pi gate: model=openrouter/typesafe/jev-1.13 available=no openrouter_models=1',
    'pi arm skipped: model',
  ]);
  assert.deepEqual(errors, []);
  assert.equal(result.stopped, 'pi arm skipped: model');
  assert.equal(result.column, undefined);
  assert.equal(runtime.classifications.length, 0);
  assert.equal(fs.existsSync(path.join(outDir, 'calls.jsonl')), false);
});

test('run_pi_arm_measures_a_full_map_and_records_it', async () => {
  const root = tempDir('pi');
  const { bin } = stubPiPackage(root);
  const runtime = stubPiRuntime([{ provider: 'openrouter', id: 'typesafe/jev-1.13' }], fullChoiceAnswer);
  const { result, lines, outDir } = await runArm({ bin, runtime });

  // The one planned call answered with a full map, so its row is measured and
  // its maps are kept for the comparison.
  assert.equal(result.stopped, undefined);
  assert.equal(result.column.rows, 1);
  assert.equal(result.column.calls, 1);
  assert.equal(result.column.measured, 1);
  assert.equal(result.column.unmeasured, 0);
  assert.equal(result.column.byRow.get('row-001').length, 1);
  assert.ok(Math.abs(result.column.cost_per_100 - 0.04) < 1e-9);
  assert.deepEqual(lines, [
    'pi gate: model=openrouter/typesafe/jev-1.13 available=yes openrouter_models=1',
    'pi: rows=1 calls=1 measured=1 unmeasured=0 timeouts=0 excluded=0',
  ]);

  // The gate records the model it resolved; the call records one line with the
  // CLI's field contract: the submitted map, a measured status and exit 0.
  const records = readCallRecords(outDir);
  assert.deepEqual(records.map((record) => record.kind), ['model_check', 'choice']);
  const choice = records[1];
  assert.equal(choice.backend, 'pi');
  assert.equal(choice.row_id, 'row-001');
  assert.equal(choice.order, 0);
  assert.equal(choice.attempt, 1);
  assert.equal(choice.exit_code, 0);
  assert.equal(choice.stop_reason, 'stop');
  assert.equal(choice.status, 'measured');
  assert.equal(choice.replay, 'recorded');
  assert.equal(choice.model, 'typesafe/jev-1.13');
  assert.equal(choice.provider, 'openrouter');
  assert.equal(choice.pi_version, '0.99.1');
  assert.deepEqual(Object.keys(choice.probabilities), ['mcp-code-mode', 'sk-code', 'mcp-tooling', 'none']);
  const stateSha12 = createHash('sha256').update(JSON.stringify({ request: ARM_PROMPT })).digest('hex').slice(0, 12);
  assert.equal(choice.state_sha12, stateSha12);

  // The call carried the state wrapper and the CLI's rotation, and nothing else
  // in its options, so no credential or transport detail can travel with it.
  const asked = runtime.classifications[0];
  assert.equal(asked.model.id, 'typesafe/jev-1.13');
  assert.equal(asked.context.state.request, ARM_PROMPT);
  assert.deepEqual(Object.keys(asked.context.questions.answer.criteria), ['mcp-code-mode', 'sk-code', 'mcp-tooling', 'none']);
  assert.deepEqual(Object.keys(asked.options), ['signal']);
});

test('run_pi_arm_records_a_timeout_as_unmeasured', async () => {
  const root = tempDir('pi');
  const { bin } = stubPiPackage(root);
  // The fake answers only when the injected bound aborts its signal, so the
  // arm's own timeout is the only way its call can end.
  const runtime = stubPiRuntime(
    [{ provider: 'openrouter', id: 'typesafe/jev-1.13' }],
    (model, context, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason));
    }),
  );
  const { result, lines, outDir } = await runArm({ bin, runtime, timeoutMs: 20 });

  // A timed-out call is recorded, and its row stays unmeasured rather than
  // entering the comparison as a zero.
  assert.equal(result.stopped, undefined);
  assert.equal(result.column.measured, 0);
  assert.equal(result.column.unmeasured, 1);
  assert.equal(result.column.timeouts, 1);
  assert.equal(result.column.byRow.size, 0);
  assert.equal(lines.some((line) => line.startsWith('verdict ')), false);

  const choice = readCallRecords(outDir)[1];
  assert.equal(choice.status, 'unmeasured_timeout');
  assert.equal(choice.stop_reason, 'aborted');
  assert.equal(choice.exit_code, null);
  assert.equal(choice.probabilities, null);
});

test('run_pi_arm_stops_on_a_backend_refusal', async () => {
  const root = tempDir('pi');
  const { bin } = stubPiPackage(root);
  const runtime = stubPiRuntime(
    [{ provider: 'openrouter', id: 'typesafe/jev-1.13' }],
    () => Promise.resolve({ stopReason: 'error', errorMessage: 'classifier unavailable' }),
  );
  const { result, lines, outDir } = await runArm({ bin, runtime });

  // The refusal stops the arm after its record: the finished-row count prints,
  // the arm carries no column and no verdict, and its caller exits 0.
  assert.equal(result.stopped, 'pi arm stopped: backend error');
  assert.equal(result.column, undefined);
  assert.deepEqual(lines, [
    'pi gate: model=openrouter/typesafe/jev-1.13 available=yes openrouter_models=1',
    'pi arm stopped: backend error',
    'pi: partial_rows=0',
  ]);
  assert.equal(lines.some((line) => line.startsWith('verdict ')), false);

  const choice = readCallRecords(outDir)[1];
  assert.equal(choice.status, 'unmeasured');
  assert.equal(choice.stop_reason, 'error');
  assert.equal(choice.exit_code, null);
});

// The CLI arm answers through a stub jev first on PATH: the shared gate reads
// its version and its credential store, the auth test names the model, and
// every choice call returns a full map over the plan's whole option set.
function armStubJev(dir, version = 'jev 0.6.2') {
  const file = path.join(dir, 'jev');
  const log = path.join(dir, 'invocations.log');
  const payload = JSON.stringify({
    answers: {
      answer: {
        type: 'choice',
        choice: 'mcp-code-mode',
        probabilities: { 'mcp-code-mode': 0.94, 'sk-code': 0.03, 'mcp-tooling': 0.02, none: 0.01 },
      },
    },
  });
  fs.writeFileSync(file, [
    '#!/bin/sh',
    `echo "$*" >> ${JSON.stringify(log)}`,
    'case "$1" in',
    `  --version) echo "${version}"; exit 0 ;;`,
    '  auth)',
    '    case "$2" in',
    '      status) exit 0 ;;',
    `      test) echo '${JSON.stringify({ model: 'jev-1.13.0' })}'; exit 0 ;;`,
    '    esac',
    '    ;;',
    '  choice)',
    `    echo '${payload}'`,
    '    exit 0',
    '    ;;',
    'esac',
    'exit 1',
    '',
  ].join('\n'), { mode: 0o755 });
  return file;
}

// One row planned over all three rotations, so the arm's one-record-per-call
// contract can be checked against three ordered calls.
function threeOrderPlan() {
  const cluster = ['mcp-code-mode', 'sk-code', 'mcp-tooling'];
  const keys = [...cluster, 'none'];
  const describe = (key) => `Description of ${key}`;
  return new Map([['row-001', {
    prompt: ARM_PROMPT,
    cluster,
    keys,
    orders: rotations(keys).map((rotation, order) => ({
      order,
      keys: rotation,
      args: optionArgs(rotation, describe, cluster),
    })),
  }]]);
}

// Runs the CLI arm with captured lines into a fresh report directory. The PATH
// holds only the stub the test placed there, so no call can reach a real jev.
async function runCli(options) {
  const lines = [];
  const outDir = tempDir('out');
  const result = await S.runCliArm({
    env: { PATH: options.bin },
    plan: options.plan ?? threeOrderPlan(),
    outDir,
    out: (line) => lines.push(line),
  });
  return { result, lines, outDir };
}

test('run_cli_arm_skips_when_the_stub_reports_another_version', async () => {
  const bin = tempDir('cli-stale');
  armStubJev(bin, 'jev 0.0.1');
  const { result, lines, outDir } = await runCli({ bin });

  // The shared gate refuses a version other than the pinned one before the
  // auth test, so the arm stops and leaves no call record behind.
  assert.equal(result.stopped, 'jev arm skipped: version');
  assert.equal(result.column, undefined);
  assert.ok(lines.includes('jev arm skipped: version'));
  assert.equal(fs.existsSync(path.join(outDir, 'calls.jsonl')), false);
});

test('run_cli_arm_records_one_line_per_call', async () => {
  const bin = tempDir('cli');
  armStubJev(bin);
  const { result, lines, outDir } = await runCli({ bin });

  // The gate passed, the auth test named the model, and all three rotated
  // orders answered with a full map, so the row is measured.
  assert.equal(result.stopped, undefined);
  assert.equal(result.column.rows, 1);
  assert.equal(result.column.calls, 3);
  assert.equal(result.column.measured, 1);
  assert.equal(result.column.unmeasured, 0);
  assert.equal(result.column.timeouts, 0);
  assert.equal(result.column.byRow.get('row-001').length, 3);
  assert.ok(lines.includes('jev: auth_test provider=official model=jev-1.13.0'));

  // One auth_test record and one choice record per order, each carrying the
  // recorded file's field names so a rerun sits beside it in one shape.
  const records = readCallRecords(outDir);
  assert.deepEqual(records.map((record) => record.kind), ['auth_test', 'choice', 'choice', 'choice']);

  const auth = records[0];
  assert.equal(auth.backend, 'jev');
  assert.equal(auth.status, 'measured');
  assert.equal(auth.exit_code, 0);
  assert.equal(auth.jev_version, '0.6.2');
  assert.equal(auth.provider, 'official');
  assert.equal(auth.model, 'jev-1.13.0');

  for (const [index, choice] of records.slice(1).entries()) {
    assert.equal(choice.backend, 'jev');
    assert.equal(choice.row_id, 'row-001');
    assert.equal(choice.order, index);
    assert.equal(choice.attempt, 1);
    assert.equal(choice.exit_code, 0);
    assert.equal(choice.status, 'measured');
    assert.equal(choice.jev_version, '0.6.2');
    assert.equal(choice.provider, 'official');
    assert.equal(choice.model, 'jev-1.13.0');
    assert.equal(typeof choice.child_wall_ms, 'number');
    assert.equal(choice.advisor_ms, null);
    assert.equal(choice.health_ms, null);
    assert.equal(choice.call_ms, null);
    assert.deepEqual(
      Object.keys(choice.probabilities).sort(),
      ['mcp-code-mode', 'mcp-tooling', 'none', 'sk-code'],
    );
  }

  // The log shows the gate's two probes, the auth test and exactly one call
  // per order, so no call the records do not explain was made.
  const invocations = fs.readFileSync(path.join(bin, 'invocations.log'), 'utf8').trim().split('\n');
  assert.deepEqual(invocations.slice(0, 3), [
    '--version',
    'auth status --provider official',
    'auth test --provider official',
  ]);
  assert.equal(invocations.length, 6);
  assert.equal(invocations[3].startsWith('choice --provider official -q '), true);
  assert.equal(invocations[3].includes('-o mcp-code-mode=Description of mcp-code-mode'), true);
});

// A census whose rows carry the recorded option set, so the replay plan matches
// every row a test does not deliberately point at another cluster.
function replayCensus(rowCount, mismatchCount = 0) {
  const matched = ['mcp-code-mode', 'sk-code', 'mcp-tooling'];
  const mismatched = ['mcp-code-mode', 'sk-code', 'mcp-tooling', 'sk-doc'];
  return {
    rows: Array.from({ length: rowCount }, (_, index) => ({
      id: `row-${String(index + 1).padStart(3, '0')}`,
      prompt: ARM_PROMPT,
      cluster: index < rowCount - mismatchCount ? matched : mismatched,
    })),
    describe: (key) => `Description of ${key}`,
  };
}

// Pi answers every planned question with the recorded CLI map itself, so both
// sides read the same top key and the comparison measures agreement at 100.
const RECORDED_PROBABILITIES = {
  none: 0.01,
  'mcp-code-mode': 0.94,
  'sk-code': 0.03,
  'mcp-tooling': 0.02,
};

function recordedAnswer() {
  return Promise.resolve({
    answers: {
      answer: { type: 'choice', choice: 'mcp-code-mode', probabilities: RECORDED_PROBABILITIES },
    },
    usage: { cost: { total: 0.0004 } },
    stopReason: 'stop',
  });
}

// One runtime for an armed run: the census reads the catalog, the arm resolves
// the model and classifies.
function censusAndArmRuntime(models, classify) {
  const census = stubRuntime(models, models);
  return { ...stubPiRuntime(models, classify), getModelsOfType: census.getModelsOfType };
}

test('main_pi_run_prints_columns_metrics_verdict_and_writes_report', async () => {
  const { bin } = stubPiPackage(tempDir('pi'));
  const baselineFile = path.join(tempDir('baseline'), 'calls.jsonl');
  fs.writeFileSync(baselineFile, baselineText(2));
  const outDir = tempDir('out');
  const runtime = censusAndArmRuntime([{ provider: 'openrouter', id: 'typesafe/jev-1.13' }], recordedAnswer);
  const loadCensus = async () => replayCensus(2);
  const { code, lines, errors } = await runMain(['--pi', '--out', outDir], {
    bin,
    runtime,
    baselinePath: baselineFile,
    loadCensus,
  });

  assert.equal(code, 0);
  assert.deepEqual(errors, []);
  assert.ok(lines.includes('pi: rows=2 calls=6 measured=2 unmeasured=0 timeouts=0 excluded=0'), lines.join('\n'));

  // The two columns, the metrics and the verdict print in that order.
  const printed = ['column pi:', 'column cli:', 'metrics:', 'verdict '].map(
    (prefix) => lines.findIndex((line) => line.startsWith(prefix)),
  );
  assert.ok(printed.every((index) => index >= 0), lines.join('\n'));
  assert.ok(printed.every((index, position) => position === 0 || printed[position - 1] < index), lines.join('\n'));

  // The stub answers immediately, so Pi's p95 stays far under the CLI's
  // recorded 302 ms and every bound holds: the fixture adopts.
  assert.match(lines[printed[0]], /^column pi: rows=2 measured=2 p50_ms=\d+ p95_ms=\d+ cost_per_100=0\.0400$/);
  assert.equal(lines[printed[1]], 'column cli: rows=2 measured=2 p50_ms=301 p95_ms=302 calls=6');
  assert.equal(lines[printed[2]], 'metrics: coverage=100.0 agreement=100.0 median_abs_dp=0.0000');

  const verdictLine = lines[printed[3]];
  assert.ok(verdictLine.startsWith('verdict pi-transport: adopt'), verdictLine);

  // The report repeats the printed verdict line, so the file and stdout cannot
  // tell two different stories about the run.
  const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  assert.equal(report.verdict.line, verdictLine);
  assert.equal(report.metrics.K, 2);
  assert.equal(report.metrics.M, 2);
});

test('main_excluded_rows_count_against_coverage', async () => {
  const { bin } = stubPiPackage(tempDir('pi'));
  const baselineFile = path.join(tempDir('baseline'), 'calls.jsonl');
  fs.writeFileSync(baselineFile, baselineText(10));
  const outDir = tempDir('out');
  const runtime = censusAndArmRuntime([{ provider: 'openrouter', id: 'typesafe/jev-1.13' }], recordedAnswer);
  const loadCensus = async () => replayCensus(10, 8);
  const { code, lines, errors } = await runMain(['--pi', '--out', outDir], {
    bin,
    runtime,
    baselinePath: baselineFile,
    loadCensus,
  });

  assert.equal(code, 0);
  assert.deepEqual(errors, []);

  // Eight of the ten recorded rows rebuilt to another option set, so only two
  // could be asked; the eight still count as unmeasured against coverage.
  assert.ok(lines.includes('pi: rows=2 calls=6 measured=2 unmeasured=0 timeouts=0 excluded=8'), lines.join('\n'));

  const verdictLine = lines.find((line) => line.startsWith('verdict '));
  assert.ok(verdictLine !== undefined, lines.join('\n'));
  assert.match(verdictLine, /^verdict pi-transport: stop \(coverage\) K=10 M=2 coverage=20\.0 /);
});
