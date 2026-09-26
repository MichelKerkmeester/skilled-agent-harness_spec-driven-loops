#!/usr/bin/env node
// End-to-end conformance gate for the Python frontend, on one interpreter:
// SUPERCOV_PYTHON when set -- CI runs this once per supported CPython, 3.9
// through 3.14 -- otherwise the newest on PATH. The public CLI measures
// serial pytest, xdist, reruns, a killed worker, signalled children,
// concurrency adapters, unittest and the position corpus, and every total is
// pinned: the suites that avoid `match` must produce identical numbers on
// every interpreter, and the full suites (3.10+) theirs. Then what probes
// compiled at import have to get right on their own: bytecode left in
// pytest's cache, nothing written into the project, and what cannot be
// observed declared rather than missed. The coverage.py fixture remains an
// independent line/branch-outcome oracle; coverage.py itself is never
// imported by the product path.

import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, delimiter, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const launcher = resolve(repository, 'bin/supercov.js');
const conformanceFixture = resolve(repository, 'tests/fixtures/python-conformance');
const positionFixture = resolve(repository, 'tests/fixtures/python-position-corpus');
const oracleFixture = resolve(repository, 'tests/fixtures/python-pytest');
// The runner spells TEMP as an 8.3 short name; the product resolves paths
// to long names, and a Ruby load path in two spellings loads every file
// twice. Real installations live under long names, so hand it those.
const temporary = mkdtempSync(resolve(realpathSync.native(tmpdir()), 'supercov-python-'));

function interpreterVersion(program) {
  const probe = spawnSync(program, ['-c', 'import sys; print(sys.version_info[0], sys.version_info[1])'], {
    encoding: 'utf8',
  });
  if (probe.status !== 0) return null;
  const [major, minor] = probe.stdout.trim().split(' ').map(Number);
  return { major, minor };
}

// The interpreter named is the one measured: a CI job for 3.9 that quietly
// fell back to the runner's own newer Python would prove nothing about 3.9.
function findInterpreter() {
  const named = process.env.SUPERCOV_PYTHON;
  const candidates = named
    ? [named]
    : ['python3.14', 'python3.13', 'python3.12', 'python3.11', 'python3.10', 'python3.9', 'python3', 'python'];
  for (const candidate of candidates) {
    const version = interpreterVersion(candidate);
    if (version && version.major === 3 && version.minor >= 9) return { program: candidate, version };
  }
  throw new Error(
    named
      ? `SUPERCOV_PYTHON=${named} is not CPython 3.9 or newer`
      : 'python integration needs CPython 3.9 or newer on PATH (or SUPERCOV_PYTHON)',
  );
}

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { encoding: 'utf8', ...options });
  assert.equal(result.status, 0, `${program} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function createProject(source, name) {
  const project = resolve(temporary, name);
  cpSync(source, project, { recursive: true });
  run('git', ['init', '-q', '.'], { cwd: project });
  return project;
}

function environmentFor(project, venv) {
  const environment = {
    ...process.env,
    SUPERCOV_RUST_BINARY: binary,
    PATH: `${resolve(venv, process.platform === 'win32' ? 'Scripts' : 'bin')}${delimiter}${process.env.PATH}`,
    SUPERCOV_PROJECT_ROOT: project,
  };
  delete environment.PYTHONPATH;
  delete environment.PYTEST_PLUGINS;
  return environment;
}

function supercov(project, args, environment) {
  return spawnSync(process.execPath, [launcher, ...args], {
    cwd: project,
    encoding: 'utf8',
    env: environment,
  });
}

function successfulSupercov(project, args, environment) {
  const result = supercov(project, args, environment);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return result;
}

// Every assertion the syntax inventory found, with the tests observed running
// it. An assertion map credits a source statement only when a passing test ran
// a named assertion, so a site with no observed test can never earn credit
// however well it is explained.
function assertionSites(project, environment, runId = 'latest') {
  const sites = [];
  let offset = 0;
  for (;;) {
    const page = query(project, ['runs', runId, 'assertions', '--limit', '200', '--offset', String(offset)], environment);
    sites.push(...page.items.map((item) => ({
      at: `${item.at.file}:${item.at.line}`,
      tests: item.observedPassingTests ?? [],
    })));
    if (page.pagination.nextOffset === null) return sites;
    offset = page.pagination.nextOffset;
  }
}

// The inventory covers every captured test file, so a run that exercised some
// of them leaves the others unobserved by design. Only the files this command
// ran have to name a test for each of their assertions.
function assertAssertionsAreObserved(project, environment, runner, ranFiles, expectedUnobserved = []) {
  const sites = assertionSites(project, environment)
    .filter((site) => ranFiles.some((file) => site.at.startsWith(`${file}:`)));
  assert.ok(sites.length > 0, `${runner}: the inventory found no assertion sites in ${ranFiles.join(', ')}`);
  // Credit needs a *passing* occurrence, so an assertion that only ever runs
  // inside a failing or expected-failure test is unobserved by design.
  const unobserved = sites.filter((site) => site.tests.length === 0).map((site) => site.at);
  assert.deepEqual(unobserved, expectedUnobserved, `${runner}: every assertion a passing test runs should name that test`);
  // An assertion map selects a test by file and name, so the run has to report
  // the test's path rather than the runner's own identity.
  const tests = query(project, ['runs', 'latest', 'test', sites[0].tests[0]], environment).tests;
  assert.ok(
    ranFiles.some((file) => tests[0].file === file),
    `${runner}: expected the test under one of ${ranFiles.join(', ')}, got ${tests[0].file}`,
  );
}

function query(project, args, environment) {
  const result = successfulSupercov(project, [...args, '--json'], environment);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true, result.stdout);
  return payload.data;
}

function decisionVectors(project, location, environment, filter = null) {
  const args = ['runs', 'latest', 'decision', location];
  if (filter) args.push('--filter', filter);
  const decision = query(project, args, environment).decisions[0];
  return decision.vectors
    .map((vector) => `${vector.values.map((value) => (value === null ? '-' : value ? 'T' : 'F')).join('')}->${vector.outcome ? 'T' : 'F'}`)
    .sort();
}

function totals(summary) {
  const coverage = summary.coverage;
  return [
    coverage.lines.covered, coverage.lines.total,
    coverage.statements.covered, coverage.statements.total,
    coverage.functions.covered, coverage.functions.total,
    coverage.branches.covered, coverage.branches.total,
    coverage.coveredConditions, coverage.conditions,
  ];
}

// Lines, statements, functions, branches, conditions: covered then total.
// `core` leaves out tests/test_patterns.py, whose `match` 3.9 cannot parse,
// and has to come out the same on every interpreter.
const FIXTURE_TOTALS = {
  full: [81, 82, 83, 84, 18, 18, 79, 94, 8, 16],
  core: [75, 82, 77, 84, 17, 18, 69, 94, 8, 16],
};
const CORPUS_TOTALS = {
  full: [67, 67, 69, 69, 17, 17, 94, 114, 12, 27],
  core: [61, 67, 63, 69, 16, 17, 82, 114, 12, 27],
};

function assertFixtureTotals(summary, expected = FIXTURE_TOTALS.full) {
  assert.equal(summary.model.variant, 'python-owned-probes');
  assert.equal(summary.measurement.complete, true, JSON.stringify(summary.measurement));
  assert.deepEqual(totals(summary), expected, JSON.stringify(summary.coverage));
  assert.equal(summary.testExitCode, 0);
}

function assertOracleAgreement(project, environment) {
  const expectedCoveredLines = new Set([1, 2, 3, 4, 5, 9, 10, 11, 12, 14]);
  const expectedMissingLines = new Set([6, 13]);
  for (const line of [...expectedCoveredLines, ...expectedMissingLines]) {
    const detail = query(project, ['runs', 'latest', 'line', `src/calculator.py:${line}`], environment);
    assert.equal(
      detail.covered,
      expectedCoveredLines.has(line),
      `coverage.py line differential disagreed at calculator.py:${line}`,
    );
  }
  const expectedMissingOutcomes = new Map([[2, 0], [4, 1], [10, 0], [12, 1]]);
  for (const [line, expected] of expectedMissingOutcomes) {
    const detail = query(project, ['runs', 'latest', 'line', `src/calculator.py:${line}`], environment);
    const missing = detail.remaining.filter((obligation) => obligation.kind === 'branch').length;
    assert.equal(missing, expected, `coverage.py branch differential disagreed at calculator.py:${line}`);
  }
}

try {
  const { program: python, version } = findInterpreter();
  // `match` arrived in 3.10 and `except*` in 3.11.
  const hasMatch = version.minor >= 10;
  const hasExceptStar = version.minor >= 11;
  const venv = resolve(temporary, 'venv');
  run(python, ['-m', 'venv', venv]);
  const venvPython = resolve(venv, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  run(venvPython, [
    '-m', 'pip', 'install', '--disable-pip-version-check', '-q',
    'pytest', 'pytest-xdist', 'pytest-rerunfailures', 'pytest-subtests',
  ]);

  const project = createProject(conformanceFixture, 'conformance');
  const environment = environmentFor(project, venv);
  const suite = hasMatch ? ['tests'] : ['tests', '--ignore=tests/test_patterns.py'];
  const ranTestFiles = ['tests/test_shapes.py', 'tests/test_unittest_style.py', ...(hasMatch ? ['tests/test_patterns.py'] : [])];
  const fixtureTotals = hasMatch ? FIXTURE_TOTALS.full : FIXTURE_TOTALS.core;

  // The same suite on every interpreter, the same numbers.
  successfulSupercov(
    project,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests', '--ignore=tests/test_patterns.py'],
    environment,
  );
  assertFixtureTotals(query(project, ['runs', 'latest'], environment), FIXTURE_TOTALS.core);

  const serial = successfulSupercov(
    project,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', ...suite],
    environment,
  );
  assert.match(serial.stdout, /\[coverage\] evidence:/);
  // Publication analyses the evidence once and stores what the first query
  // reads, and says what that cost: a run's query views used to be analysed
  // twice more, untimed, by the first query after it.
  const evidencePath = serial.stdout.match(/\[coverage\] evidence: (.+)/)[1].trim();
  const runDirectory = evidencePath.slice(0, -'evidence.raw.gz'.length);
  for (const name of ['query-index.v1.bin', 'assertions.summary.cache.json']) {
    assert.ok(existsSync(resolve(runDirectory, name)), `publication wrote ${name} before any query`);
  }
  assert.match(serial.stderr, /\[supercov\] timings .* evidence=\d+(?:\.\d)?ms publication=\d+(?:\.\d)?ms total=/);
  assert.match(serial.stderr, new RegExp(`${hasMatch ? 14 : 13} test\\(s\\) across 3 source file\\(s\\)`));
  assert.match(serial.stderr, new RegExp(`interpreter process\\(es\\) on Python 3\\.${version.minor}\\.`));
  assertFixtureTotals(query(project, ['runs', 'latest'], environment), fixtureTotals);
  // pytest's rewriter reports the line of each assert it passes, and a
  // TestCase pytest runs reaches the wrapped unittest methods instead.
  assertAssertionsAreObserved(
    project,
    environment,
    'pytest',
    ranTestFiles,
    // The only assertion in an @unittest.expectedFailure test: it fails by
    // design, so it never has a passing occurrence to witness with.
    ['tests/test_unittest_style.py:19'],
  );
  assert.deepEqual(
    decisionVectors(project, 'app/shapes.py:26', environment),
    ['TF->T', 'TT->F'],
    'not (a and b) keeps both operands as conditions',
  );

  // test_account builds its Account before its first assertion: that line
  // is the assertion's evidence, and must be linked to it.
  const beforeAssertion = query(project, ['runs', 'latest', 'line', 'app/shapes.py:70'], environment);
  assert.ok(
    beforeAssertion.phases.some((phase) => phase.kind === 'assertion' && phase.source.endsWith('test_account')),
    `evidence before the first assertion links to it: ${JSON.stringify(beforeAssertion.phases)}`,
  );
  const comprehension = query(project, ['runs', 'latest', 'decision', 'app/shapes.py:12'], environment);
  assert.equal(comprehension.decisions[0].executed, true, 'comprehension filter mapped by offset order');
  const subprocessLine = query(project, ['runs', 'latest', 'line', 'app/shapes.py:34'], environment);
  assert.match(JSON.stringify(subprocessLine), /test_thread_and_subprocess/, 'child interpreter inherits exact identity');
  const exceptions = query(project, ['runs', 'latest', 'line', 'app/shapes.py:81'], environment);
  assert.doesNotMatch(JSON.stringify(exceptions), /not observed: try completed/, 'try completion is structural');

  successfulSupercov(
    project,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', '-n', '2', ...suite],
    environment,
  );
  assertFixtureTotals(query(project, ['runs', 'latest'], environment), fixtureTotals);
  // Each xdist worker is its own process with its own contexts and evidence
  // file, so the sites have to survive being joined from several of them.
  assertAssertionsAreObserved(
    project,
    environment,
    'pytest -n 2',
    ranTestFiles,
    ['tests/test_unittest_style.py:19'],
  );

  const rerun = successfulSupercov(
    project,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests_extended/test_rerun.py'],
    environment,
  );
  assert.match(rerun.stderr, /1 test\(s\) across 3 source file\(s\)/, 'retry count is one logical test');
  const rerunSummary = query(project, ['runs', 'latest'], environment);
  assert.equal(rerunSummary.tests, 1);
  assert.equal(rerunSummary.testOutcomes.flaky, 1);
  assert.deepEqual(decisionVectors(project, 'app/shapes.py:26', environment, 'failed'), ['TF->T']);
  assert.deepEqual(decisionVectors(project, 'app/shapes.py:26', environment, 'passed'), ['TT->F']);

  const crashEnvironment = {
    ...environment,
    SUPERCOV_PYTHON_CRASH_MARKER: resolve(temporary, 'worker-crashed'),
  };
  successfulSupercov(
    project,
    [
      '--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider',
      '-n', '1', '--reruns', '1', 'tests_extended/test_crash.py',
    ],
    crashEnvironment,
  );
  const crashSummary = query(project, ['runs', 'latest'], crashEnvironment);
  assert.equal(crashSummary.tests, 1);
  assert.equal(crashSummary.testOutcomes.flaky, 1);
  assert.deepEqual(
    decisionVectors(project, 'app/shapes.py:26', crashEnvironment),
    ['TF->T', 'TT->F'],
    "the killed worker's slot keeps the decision it recorded before os._exit",
  );
  assert.deepEqual(decisionVectors(project, 'app/shapes.py:26', crashEnvironment, 'failed'), ['TF->T']);

  successfulSupercov(
    project,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests_extended/test_concurrency.py'],
    environment,
  );
  const smallLine = query(project, ['runs', 'latest', 'line', 'app/shapes.py:35'], environment);
  assert.match(JSON.stringify(smallLine), /test_thread_pool_first_context/);
  const largeLine = query(project, ['runs', 'latest', 'line', 'app/shapes.py:37'], environment);
  const largeOwners = JSON.stringify(largeLine);
  assert.match(largeOwners, /test_reused_thread_pool_gets_new_context/);
  assert.match(largeOwners, /test_spawned_multiprocessing_context/);
  assert.match(largeOwners, /test_interleaved_asyncio_tasks_keep_one_test_context/);

  successfulSupercov(
    project,
    [
      '--', 'python', '-m', 'unittest', '-q',
      'tests_extended.test_unittest_subtests.SubTestCases.test_passing_subtests',
    ],
    environment,
  );
  const subtestLine = query(project, ['runs', 'latest', 'line', 'app/shapes.py:35'], environment);
  assert.match(JSON.stringify(subtestLine), /SubTestCases\.test_passing_subtests/);
  const failedSubtest = supercov(
    project,
    [
      '--', 'python', '-m', 'unittest', '-q',
      'tests_extended.test_unittest_subtests.SubTestCases.test_failing_subtest_rolls_up',
    ],
    environment,
  );
  assert.equal(failedSubtest.status, 1, `${failedSubtest.stdout}\n${failedSubtest.stderr}`);
  const failedSubtestSummary = query(project, ['runs', 'latest'], environment);
  assert.equal(failedSubtestSummary.testOutcomes.failed, 1);
  assert.equal(failedSubtestSummary.measurement.complete, true, JSON.stringify(failedSubtestSummary.measurement));

  // pytest-subtests reports every subtest as its own result under the same
  // node id and the same call phase, so an attempt carries several outcomes
  // for the identity a phase id is derived from. Each became a phase of its
  // own with the same id, the run was refused whole, and a suite of 6872 tests
  // lost two and three-quarter hours of measurement to it (#40). The same
  // subtests as above, under the runner that narrates them one by one.
  successfulSupercov(
    project,
    [
      '--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider',
      'tests_extended/test_unittest_subtests.py::SubTestCases::test_passing_subtests',
    ],
    environment,
  );
  const pytestSubtests = query(project, ['runs', 'latest'], environment);
  assert.equal(pytestSubtests.tests, 1, 'the subtests are the one test that ran them');
  assert.equal(pytestSubtests.testOutcomes.passed, 1);
  assert.match(
    JSON.stringify(query(project, ['runs', 'latest', 'line', 'app/shapes.py:35'], environment)),
    /test_passing_subtests/,
    'the coverage the subtests recorded belongs to the test that ran them',
  );

  // And a subtest that fails fails its test, rather than folding into a pass.
  const failedPytestSubtest = supercov(
    project,
    [
      '--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider',
      'tests_extended/test_unittest_subtests.py::SubTestCases::test_failing_subtest_rolls_up',
    ],
    environment,
  );
  assert.equal(
    failedPytestSubtest.status,
    1,
    `${failedPytestSubtest.stdout}\n${failedPytestSubtest.stderr}`,
  );
  assert.doesNotMatch(
    `${failedPytestSubtest.stdout}${failedPytestSubtest.stderr}`,
    /duplicate frontend phase/,
    'the run is published rather than refused whole',
  );
  const failedPytestSummary = query(project, ['runs', 'latest'], environment);
  assert.equal(failedPytestSummary.testOutcomes.failed, 1);

  // One failing and one passing test per runner, reported as such. Everything
  // under `tests/` passes, so a runner whose failure path broke would look
  // fine to the totals above; the Ruby gate found exactly that in test-unit.
  for (const [runner, command] of [
    ['pytest', ['python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests_extended/test_failing.py']],
    ['unittest', ['python', '-m', 'unittest', '-q', 'tests_extended.test_unittest_failing']],
  ]) {
    const result = supercov(project, ['--', ...command], environment);
    assert.equal(result.status, 1, `${runner}: the failing test must fail the command\n${result.stdout}\n${result.stderr}`);
    const summary = query(project, ['runs', 'latest'], environment);
    assert.deepEqual(
      [summary.testOutcomes.passed, summary.testOutcomes.failed],
      [1, 1],
      `${runner} must report one passing and one failing test: ${JSON.stringify(summary.testOutcomes)}`,
    );
    assert.equal(summary.measurement.complete, true, `${runner}: ${JSON.stringify(summary.measurement)}`);
  }

  successfulSupercov(
    project,
    [
      '--', 'python', '-X', 'no_debug_ranges', '-m', 'pytest', '-q',
      '-p', 'no:cacheprovider', 'tests/test_shapes.py::test_chained',
    ],
    environment,
  );
  // Probes are placed from the parse, not from bytecode positions, so an
  // interpreter compiling without column tables measures exactly the same.
  const noDebug = query(project, ['runs', 'latest'], environment);
  assert.equal(noDebug.filesWithMeasurementLimitations, 0, 'no_debug_ranges costs nothing');
  assert.equal(noDebug.measurement.complete, true, JSON.stringify(noDebug.measurement));
  const noDebugLine = query(project, ['runs', 'latest', 'line', 'app/shapes.py:35'], environment);
  assert.equal(noDebugLine.covered, true, 'the line test_chained runs is covered without column tables');

  const isolated = supercov(
    project,
    [
      '--', 'python', '-I', '-m', 'pytest', '-q', '-p', 'no:cacheprovider',
      'tests/test_shapes.py::test_chained',
    ],
    environment,
  );
  assert.notEqual(isolated.status, 0, 'isolated mode must fail closed instead of publishing partial evidence');
  assert.doesNotMatch(isolated.stdout, /\[coverage\] evidence:/);

  const positionProject = createProject(positionFixture, 'positions');
  const positionEnvironment = environmentFor(positionProject, venv);
  const corpusSuite = hasMatch ? ['tests'] : ['tests', '--ignore=tests/test_patterns.py'];
  successfulSupercov(
    positionProject,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', ...corpusSuite],
    positionEnvironment,
  );
  const positionSummary = query(positionProject, ['runs', 'latest'], positionEnvironment);
  const positionFile = query(
    positionProject,
    ['runs', 'latest', 'file', 'src/corpus.py', '--limit', '200'],
    positionEnvironment,
  );
  assert.equal(
    positionSummary.filesWithMeasurementLimitations,
    0,
    `position corpus must map completely: ${JSON.stringify(positionFile.gapLines.filter((line) => line.limitations.length))}`,
  );
  assert.equal(positionSummary.testExitCode, 0);
  assert.deepEqual(
    totals(positionSummary),
    hasMatch ? CORPUS_TOTALS.full : CORPUS_TOTALS.core,
    'position corpus must have identical gaps on every supported interpreter',
  );

  const oracleProject = resolve(temporary, 'oracle');
  mkdirSync(oracleProject, { recursive: true });
  cpSync(resolve(oracleFixture, 'src'), resolve(oracleProject, 'src'), { recursive: true });
  cpSync(resolve(oracleFixture, 'tests'), resolve(oracleProject, 'tests'), { recursive: true });
  run('git', ['init', '-q', '.'], { cwd: oracleProject });
  const oracleEnvironment = environmentFor(oracleProject, venv);
  successfulSupercov(
    oracleProject,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests'],
    oracleEnvironment,
  );
  assertOracleAgreement(oracleProject, oracleEnvironment);


  // A suite stops a server it started by signalling it. Python's default
  // SIGTERM ends the process without running atexit, so nothing written at
  // exit would survive -- but evidence goes into an mmap that the kernel has
  // already made durable, which is what makes a killed worker's coverage
  // recoverable at all. Assert that directly, for SIGKILL as well as SIGTERM,
  // because any move back to a buffer flushed at exit would silently undo it.
  const signalProject = resolve(temporary, 'signals');
  mkdirSync(signalProject, { recursive: true });
  writeFileSync(
    resolve(signalProject, 'worker.py'),
    [
      'def handle(kind):',
      '    if kind == "termed":',
      '        first = len(kind)',
      '        return "termed%d" % first',
      '    if kind == "killed":',
      '        second = len(kind)',
      '        return "killed%d" % second',
      '    return "other"',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(signalProject, 'child.py'),
    [
      'import sys',
      'from worker import handle',
      '',
      'for line in sys.stdin:',
      '    sys.stdout.write(handle(line.strip()) + "\\n")',
      '    sys.stdout.flush()',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(signalProject, 'test_signal.py'),
    [
      'import os',
      'import signal',
      'import subprocess',
      'import sys',
      '',
      '',
      'def drive(word, number):',
      '    child = subprocess.Popen(',
      '        [sys.executable, "child.py"],',
      '        stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True,',
      '    )',
      '    child.stdin.write(word + "\\n")',
      '    child.stdin.flush()',
      '    assert word in child.stdout.readline()',
      '    os.kill(child.pid, number)',
      '    child.wait()',
      '    # POSIX reports a signal death as the negated number. Windows has no',
      '    # signals: os.kill there is TerminateProcess with the number as the',
      '    # exit code, and every kill is already the hard kind.',
      '    expected = number if sys.platform == "win32" else -number',
      '    assert child.returncode == expected, "the child must die from the signal"',
      '',
      '',
      'def test_terminated():',
      '    drive("termed", signal.SIGTERM)',
      '',
      '',
      'def test_hard_killed():',
      '    drive("killed", getattr(signal, "SIGKILL", signal.SIGABRT))',
      '',
    ].join('\n'),
  );
  const signalEnvironment = environmentFor(signalProject, venv);
  successfulSupercov(
    signalProject,
    ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'test_signal.py'],
    signalEnvironment,
  );
  for (const [line, test] of [[3, 'test_terminated'], [6, 'test_hard_killed']]) {
    const detail = query(signalProject, ['runs', 'latest', 'line', `worker.py:${line}`], signalEnvironment);
    assert.match(
      JSON.stringify(detail),
      new RegExp(test),
      `worker.py:${line} must keep the coverage its signalled child produced`,
    );
  }

  // Child supervision must preserve the same observable behavior. Compare
  // plain and measured runs, then verify the direct-script measurement
  // boundary on every interpreter (including those without monitoring).
  const processes = createProject(resolve(repository, 'tests/fixtures/python-subprocess'), 'subprocess-edge-cases');
  const processesEnvironment = environmentFor(processes, venv);
  run('python', ['-m', 'unittest', '-q'], { cwd: processes, env: processesEnvironment });
  successfulSupercov(processes, ['--', 'python', '-m', 'unittest', '-q'], processesEnvironment);
  const processFiles = query(processes, ['runs', 'latest', 'files'], processesEnvironment).files;
  for (const file of ['app/entry_one.py', 'app/entry_two.py']) {
    // The parent imports these files and children run them as scripts. What
    // the imports ran stays measured; the direct runs are declared, so the
    // file reads as a lower bound rather than as unmeasured (issue #40).
    const detail = query(processes, ['runs', 'latest', 'file', file], processesEnvironment);
    assert.ok(detail.counts.totalLines > 0, 'a script the tests also import stays measured');
    assert.ok(detail.counts.coveredLines > 0, 'what its imports ran is counted');
    assert.ok(detail.totalTests > 0, 'the parent also imported this source, retaining its observed test identity');
    assert.equal(processFiles.find(row => row.file === file).measurementLimitations, 1, 'each affected script keeps its own limitation');
  }
  const moduleEntry = query(processes, ['runs', 'latest', 'file', 'app/module_entry.py'], processesEnvironment);
  assert.ok(moduleEntry.counts.coveredLines > 0, 'a module entry goes through the import loader and stays measured');
  assert.equal(moduleEntry.counts.measurementLimitations, 0);

  // A command that never ran its tests is the command's failure, not a
  // Supercov bug with evidence to send: pytest refuses an unknown option.
  const refusedProject = createProject(resolve(repository, 'tests/fixtures/python-subprocess'), 'refused');
  const refused = supercov(refusedProject, ['--', 'python', '-m', 'pytest', '--no-such-option'], environmentFor(refusedProject, venv));
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /before any test reported an outcome/);
  assert.doesNotMatch(refused.stderr, /Supercov bug/);

  // `python -m py_compile` runs py_compile as __main__, where the patch that
  // keeps its bytecode plain was never applied: a measured test that ran it
  // wrote probed bytecode to the ordinary cache (issue #40).
  const compiled = createProject(resolve(repository, 'tests/fixtures/python-subprocess'), 'py-compile');
  const compiledEnvironment = environmentFor(compiled, venv);
  writeFileSync(resolve(compiled, 'test_py_compile.py'), [
    'import marshal, os, pathlib, subprocess, sys, tempfile, unittest',
    '',
    'def names(code):',
    '    found = set(code.co_names)',
    '    for constant in code.co_consts:',
    '        if hasattr(constant, "co_names"):',
    '            found |= names(constant)',
    '    return found',
    '',
    'class PyCompile(unittest.TestCase):',
    '    def test_writes_plain_bytecode(self):',
    '        with tempfile.TemporaryDirectory() as prefix:',
    '            env = dict(os.environ, PYTHONPYCACHEPREFIX=prefix)',
    '            subprocess.run([sys.executable, "-m", "py_compile", "app/entry_one.py"], env=env, check=True)',
    '            [pyc] = list(pathlib.Path(prefix).rglob("entry_one*.pyc"))',
    '            probed = sorted(n for n in names(marshal.loads(pyc.read_bytes()[16:])) if "supercov" in n.lower())',
    '            self.assertEqual(probed, [])',
    '',
  ].join('\n'));
  if (version.minor >= 10) {
    successfulSupercov(compiled, ['--', 'python', '-m', 'unittest', '-q', 'test_py_compile'], compiledEnvironment);
  }

  // -- what probes compiled at import have to get right on their own --------
  // pytest keeps the bytecode it rewrote, site probes included; a plain run
  // after a measured one must not load it, and must not see Supercov at all.
  const venvPath = `${resolve(venv, process.platform === 'win32' ? 'Scripts' : 'bin')}${delimiter}${process.env.PATH}`;
  successfulSupercov(project, ['--', 'python', '-m', 'pytest', '-q', ...suite], environment);
  const plain = spawnSync('python', ['-m', 'pytest', '-q', ...suite], {
    cwd: project,
    encoding: 'utf8',
    env: { ...process.env, PATH: venvPath, PYTHONPATH: '' },
  });
  assert.equal(plain.status, 0, `a plain run after a measured one\n${plain.stdout}\n${plain.stderr}`);
  assert.doesNotMatch(plain.stdout + plain.stderr, /supercov|_scv_/i, 'nothing of Supercov surfaces in a plain run');
  // Nothing is written into the project but pytest's own cache and .supercov.
  const stray = readdirSync(project, { recursive: true })
    .map(String)
    .filter((entry) => !entry.startsWith('.supercov') && !entry.startsWith('.git'))
    .filter((entry) => /supercov|_scv_|\.slot$/i.test(basename(entry)) && !/-supercov-probes\d+(-[0-9a-f]+)?\.pyc$/.test(entry));
  assert.deepEqual(stray, [], 'the project holds no Supercov artefacts outside .supercov and pytest\'s cache');
  assert.equal(run('git', ['check-ignore', '.supercov/runs'], { cwd: project }).stdout.trim(), '.supercov/runs', 'direct Python runs initialize the store ignore file');

  // A measured module pytest rewrites itself -- registered with
  // register_assert_rewrite -- is cached by pytest under its own source's
  // mtime. Its probes are numbered into the run's slot layout, which moves
  // when another measured file changes; bytecode from before must not be
  // loaded after, or its stores land on other obligations' bytes.
  const rewritten = resolve(temporary, 'rewritten');
  mkdirSync(resolve(rewritten, 'app'), { recursive: true });
  mkdirSync(resolve(rewritten, 'tests'), { recursive: true });
  writeFileSync(resolve(rewritten, 'app/__init__.py'), '');
  writeFileSync(resolve(rewritten, 'app/helpers.py'), 'def double(x):\n    y = x * 2\n    return y\n\n\ndef unused(x):\n    return x - 1\n');
  writeFileSync(resolve(rewritten, 'conftest.py'), 'import pytest\npytest.register_assert_rewrite("app.helpers")\n');
  writeFileSync(resolve(rewritten, 'tests/test_helpers.py'), 'from app import helpers\n\n\ndef test_double():\n    assert helpers.double(2) == 4\n');
  run('git', ['init', '-q', '.'], { cwd: rewritten });
  const rewrittenEnvironment = environmentFor(rewritten, venv);
  const helperGaps = () =>
    query(rewritten, ['runs', 'latest', 'file', 'app/helpers.py'], rewrittenEnvironment).gapLines.map((line) => line.line);
  successfulSupercov(rewritten, ['--', 'python', '-m', 'pytest', '-q', 'tests'], rewrittenEnvironment);
  assert.deepEqual(helperGaps(), [6, 7]);
  // A file ahead of it in the plan gains obligations, so its numbering moves.
  writeFileSync(resolve(rewritten, 'app/__init__.py'), 'def a():\n    return 1\n\n\ndef b():\n    return 2\n');
  successfulSupercov(rewritten, ['--', 'python', '-m', 'pytest', '-q', 'tests'], rewrittenEnvironment);
  assert.deepEqual(helperGaps(), [6, 7], 'the rewritten module was measured through its current numbering');
  assert.deepEqual(
    totals(query(rewritten, ['runs', 'latest'], rewrittenEnvironment)).slice(0, 2),
    [6, 9],
    'and nothing it ran was credited to another file',
  );
  const helperCaches = readdirSync(resolve(rewritten, 'app/__pycache__')).filter((name) => name.startsWith('helpers.') && name.includes('-supercov-'));
  assert.equal(helperCaches.length, 1, `one cached rewrite per module, not one per numbering: ${helperCaches}`);

  // What probes cannot observe is declared on its file, never missed. An
  // `except*` clause that matched nothing leaves no trace a probe can see
  // (3.11+); a planned file compiled past the import system runs unprobed,
  // and the 3.12+ detector names it.
  const detects = version.minor >= 12;
  if (hasExceptStar || detects) {
    const declared = createProject(conformanceFixture, 'declared');
    const declaredEnvironment = environmentFor(declared, venv);
    const lines = ['import os'];
    if (hasExceptStar) {
      writeFileSync(
        resolve(declared, 'app/grouped.py'),
        'def grouped(values):\n    count = -1\n    try:\n        raise ExceptionGroup("g", [ValueError(v) for v in values])\n    except* ValueError as group:\n        count = len(group.exceptions)\n    except* TypeError:\n        count = -2\n    return count\n',
      );
      lines.push('from app import grouped', '', 'def test_grouped():', '    assert grouped.grouped([1, 2]) == 2', '');
    }
    lines.push(
      '',
      'def test_unprobed_copy():',
      '    import supercov_probes',
      '    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "shapes.py"))',
      '    code = supercov_probes._original_compile(open(path).read(), path, "exec")',
      '    namespace = {"__name__": "app.shapes_plain"}',
      '    exec(code, namespace)',
      '    assert namespace["chained"](3) == "small"',
      '',
    );
    writeFileSync(resolve(declared, 'tests/test_declared.py'), lines.join('\n'));
    successfulSupercov(
      declared,
      ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests/test_declared.py'],
      declaredEnvironment,
    );
    const declaredSummary = query(declared, ['runs', 'latest'], declaredEnvironment);
    assert.equal(declaredSummary.measurement.complete, false, 'a run with declared limitations is not complete');
    const limited = Object.fromEntries(
      query(declared, ['runs', 'latest', 'files', '--limit', '50'], declaredEnvironment)
        .files.filter((file) => file.measurementLimitations > 0)
        .map((file) => [file.file, file.measurementLimitations]),
    );
    const expected = {};
    // Each except* handler has its own unobservable missed alternative.
    if (hasExceptStar) expected['app/grouped.py'] = 2;
    if (detects) expected['app/shapes.py'] = 1;
    assert.deepEqual(limited, expected, 'each declared limitation is named once, on its file');
    // The next run reuses compiled modules. Its denominator and limitation
    // records must be identical even though no AST transformation runs.
    successfulSupercov(
      declared,
      ['--', 'python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', 'tests/test_declared.py'],
      declaredEnvironment,
    );
    const warmLimited = Object.fromEntries(
      query(declared, ['runs', 'latest', 'files', '--limit', '50'], declaredEnvironment)
        .files.filter((file) => file.measurementLimitations > 0)
        .map((file) => [file.file, file.measurementLimitations]),
    );
    assert.deepEqual(warmLimited, expected, 'cached modules retain every measurement limitation');
    assert.equal(query(declared, ['runs', 'latest'], declaredEnvironment).measurement.complete, false);
    if (detects) {
      const files = query(declared, ['runs', 'latest', 'files', '--limit', '50'], declaredEnvironment).files;
      const detail = query(declared, ['runs', 'latest', 'file', 'app/shapes.py'], declaredEnvironment);
      assert.equal(detail.counts.totalLines, 0, 'the deliberately unobserved file is outside the measured denominator');
      assert.equal(files.find(file => file.file === 'app/shapes.py').uncoveredLines, 0, 'the list must not turn unmeasured lines into missed coverage');
    }
  }

  console.log(
    `[python] ${basename(python)} (3.${version.minor}) passed serial, xdist, retry, crash, concurrency, unittest, positions, signalled children, oracle differentials, cache safety, renumbered rewrites and declared limitations`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
