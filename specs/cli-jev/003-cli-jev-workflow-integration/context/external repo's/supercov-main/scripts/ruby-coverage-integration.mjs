#!/usr/bin/env node
// End-to-end gate for the owned Ruby frontend: a real Ruby 3.3+ runs the
// construct fixture through RSpec and Minitest with nothing but Supercov's
// environment variables, and the published run must report the exact
// denominator and observations the fixture is designed to produce.

import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const launcher = resolve(repository, 'bin/supercov.js');
const fixture = resolve(repository, 'tests/fixtures/ruby-coverage');
// The runner spells TEMP as an 8.3 short name; the product resolves paths
// to long names, and a Ruby load path in two spellings loads every file
// twice. Real installations live under long names, so hand it those.
const temporary = mkdtempSync(resolve(realpathSync.native(tmpdir()), 'supercov-ruby-coverage-'));
const project = resolve(temporary, 'project');

function interpreterVersion(program) {
  const probe = spawnSync(program, ['-e', 'puts RUBY_VERSION'], { encoding: 'utf8' });
  if (probe.status !== 0) return null;
  const [major, minor] = probe.stdout.trim().split('.').map(Number);
  return { major, minor };
}

// Where `gem` and the interpreter itself live. Deriving this from the string
// that launched Ruby breaks the moment that string is a bare `ruby` from PATH,
// which is how every CI runner provides it.
function interpreterBindir(program) {
  const probe = spawnSync(program, ['-e', 'print RbConfig::CONFIG["bindir"]'], { encoding: 'utf8' });
  assert.equal(probe.status, 0, `could not ask ${program} for its bindir: ${probe.stderr}`);
  return probe.stdout.trim();
}

function findInterpreter() {
  const candidates = process.env.SUPERCOV_RUBY
    ? [process.env.SUPERCOV_RUBY]
    : ['/opt/homebrew/opt/ruby/bin/ruby', 'ruby'];
  for (const candidate of candidates) {
    const version = interpreterVersion(candidate);
    if (version && (version.major > 3 || (version.major === 3 && version.minor >= 3))) return candidate;
  }
  throw new Error('ruby-coverage integration needs Ruby 3.3 or newer on PATH (or SUPERCOV_RUBY)');
}

// On Windows `gem` is a batch file, which only a command interpreter can start.
const windows = process.platform === 'win32';
function shell(command, args) {
  return windows
    ? [process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command, ...args]]
    : [command, args];
}

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { encoding: 'utf8', ...options });
  assert.equal(result.status, 0, `${program} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function supercov(args, environment, cwd = project) {
  return spawnSync(process.execPath, [launcher, ...args], {
    cwd,
    encoding: 'utf8',
    env: environment,
  });
}

function query(args, environment, cwd = project) {
  const result = supercov([...args, '--json'], environment, cwd);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.ok, true, result.stdout);
  return payload.data;
}

// Every assertion the syntax inventory found in a test file, with the tests
// that were observed running it. An assertion map credits a source statement
// only when a passing test ran a named assertion, so a site with no observed
// test can never earn credit however well it is explained.
function assertionSites(environment, runId) {
  const sites = [];
  let offset = 0;
  for (;;) {
    const page = query(['runs', runId, 'assertions', '--limit', '200', '--offset', String(offset)], environment);
    sites.push(...page.items.map((item) => ({
      at: `${item.at.file}:${item.at.line}`,
      tests: item.observedPassingTests ?? [],
    })));
    if (page.pagination.nextOffset === null) return sites;
    offset = page.pagination.nextOffset;
  }
}

// The inventory covers every captured test file, so a run that exercised one
// of them leaves the others' sites unobserved by design. Only the file this
// command actually ran has to name a test for each of its assertions.
function assertAssertionsAreObserved(environment, runId, runner, ranFile) {
  const sites = assertionSites(environment, runId).filter((site) => site.at.startsWith(`${ranFile}:`));
  assert.ok(sites.length > 0, `${runner}: the inventory found no assertion sites in ${ranFile}`);
  const unobserved = sites.filter((site) => site.tests.length === 0).map((site) => site.at);
  assert.deepEqual(unobserved, [], `${runner}: every assertion ${ranFile} runs should name the test that ran it`);
  // An assertion map selects a test by file and name, so the run has to report
  // the test's path rather than the runner's own identity.
  const tests = query(['runs', runId, 'test', sites[0].tests[0]], environment).tests;
  assert.equal(tests[0].file, ranFile, `${runner}: the test should be reported in ${ranFile}`);
}

function assertStdlibOnlyTotals(summary) {
  // Ruby 3.3 measures through Coverage alone: lines, methods and stdlib
  // branches are exact, probe-driven obligations are declared unmeasured.
  assert.equal(summary.model.variant, 'ruby-owned-coverage');
  // `case ... in`, `x = begin`, `kind = case`, `detail = {`, bare `begin` and
  // `if false` lines carry no line event on 3.3, so their statements are
  // declared unmeasured and leave the line total with them; on 3.4+ the
  // runtime probes them instead.
  assert.deepEqual([summary.coverage.lines.covered, summary.coverage.lines.total], [79, 82], JSON.stringify(summary.coverage));
  assert.equal(summary.testExitCode, 0);
  // 3.3 declares two interpreter boundaries (a line it never counts, the
  // probe-only obligations), so the run is not Complete there by design.
  assert.equal(summary.measurement.complete, false, JSON.stringify(summary.measurement));
}

function assertFixtureTotals(summary) {
  // The fixture is designed so `return "unreachable"` and `when Array` never
  // run, `c` in `a && (b || c)` never short-circuits, `cache[key] ||=` never
  // short-circuits, and the guard `n > 5` is never false. Everything
  // else is observed exactly, including elsif, ternaries, `for`/`while`/
  // `until`, safe navigation, case/in, rescue flow and same-line statements.
  assert.equal(summary.model.variant, 'ruby-owned-coverage');
  assert.deepEqual([summary.coverage.lines.covered, summary.coverage.lines.total], [85, 88], JSON.stringify(summary.coverage));
  assert.deepEqual([summary.coverage.branches.covered, summary.coverage.branches.total], [114, 132], JSON.stringify(summary.coverage));
  assert.deepEqual([summary.coverage.coveredConditions, summary.coverage.conditions], [13, 19], JSON.stringify(summary.coverage));
  assert.equal(summary.testExitCode, 0);
  assert.equal(summary.measurement.complete, true, JSON.stringify(summary.measurement));
}

try {
  const ruby = findInterpreter();
  const version = interpreterVersion(ruby);
  const probes = version.major > 3 || version.minor >= 4;
  const assertTotals = probes ? assertFixtureTotals : assertStdlibOnlyTotals;
  const rubyDirectory = interpreterBindir(ruby);
  const gems = resolve(temporary, 'gems');
  run(...shell(resolve(rubyDirectory, windows ? 'gem.cmd' : 'gem'), [
    'install',
    '--install-dir',
    gems,
    '--no-document',
    'rspec',
    'minitest',
    'test-unit',
    'cucumber',
  ]));
  cpSync(fixture, project, { recursive: true });
  run('git', ['init', '-q', '.'], { cwd: project });

  const environment = {
    ...process.env,
    SUPERCOV_RUST_BINARY: binary,
    GEM_PATH: gems,
    PATH: [rubyDirectory, resolve(gems, 'bin'), process.env.PATH].join(delimiter),
  };
  delete environment.RUBYOPT;
  delete environment.GEM_HOME;

  const rspec = supercov(['--', 'rspec'], environment);
  assert.equal(rspec.status, 0, `${rspec.stdout}\n${rspec.stderr}`);
  assert.match(rspec.stdout, /\[coverage\] evidence:/);
  assert.match(rspec.stderr, /12 test\(s\) across 1 source file\(s\)/);
  assert.match(rspec.stderr, /interpreter process\(es\) on Ruby (3\.[3-9]|[4-9])/);
  assertTotals(query(['runs', 'latest'], environment));
  assertAssertionsAreObserved(environment, 'latest', 'rspec', 'spec/shapes_spec.rb');

  if (probes) {
    const compound = query(['runs', 'latest', 'decision', 'lib/shapes.rb:8'], environment);
    assert.deepEqual(compound.decisions[0].meta.conditions, ['a', 'b', 'c']);
    const vectors = compound.decisions[0].vectors
      .map((vector) => `${vector.values.map((value) => (value === null ? '-' : value ? 'T' : 'F')).join('')}->${vector.outcome ? 'T' : 'F'}`)
      .sort();
    assert.deepEqual(vectors, ['F--->F', 'TFF->F', 'TFT->T'], 'MC/DC vectors from operand probes');

    const child = query(['runs', 'latest', 'line', 'lib/shapes.rb:8'], environment);
    assert.match(JSON.stringify(child), /shapes_spec\.rb\[1:10\]/, 'IO.popen child inherits the exact example identity');

    const rescue = query(['runs', 'latest', 'line', 'lib/shapes.rb:66'], environment);
    assert.doesNotMatch(JSON.stringify(rescue), /not observed: body completed/, 'begin completion is observed through the probe');
  } else {
    const file = query(['runs', 'latest', 'file', 'lib/shapes.rb'], environment);
    assert.match(JSON.stringify(file), /ruby-probe-obligations-need-3\.4/, 'Ruby 3.3 declares probe obligations unmeasured');
  }

  if (probes) {
    // A file Supercov cannot instrument, or is asked to leave alone, still
    // loads and is still measured through Ruby's line events; what only a
    // probe, or a branch or method key Ruby 3.4+ no longer asks for, would
    // have proven is declared. Multi-line bodies keep their branches and
    // methods through the statement that starts them. This is the same path
    // a compile failure takes.
    const skipped = supercov(['--', 'rspec'], { ...environment, SUPERCOV_RUBY_SKIP_PROBES: 'lib/shapes.rb' });
    assert.equal(skipped.status, 0, `${skipped.stdout}\n${skipped.stderr}`);
    assert.match(skipped.stderr, /12 test\(s\) across 1 source file\(s\)/, 'the suite still runs unmodified');
    const stdlibOnly = query(['runs', 'latest'], environment);
    assert.deepEqual(
      [stdlibOnly.coverage.lines.covered, stdlibOnly.coverage.lines.total],
      [66, 67],
      JSON.stringify(stdlibOnly.coverage),
    );
    assert.deepEqual(
      [stdlibOnly.coverage.branches.covered, stdlibOnly.coverage.branches.total],
      [8, 8],
      JSON.stringify(stdlibOnly.coverage),
    );
    assert.deepEqual(
      [stdlibOnly.coverage.functions.covered, stdlibOnly.coverage.functions.total],
      [15, 16],
      'methods whose body starts on a line of its own stay measured without probes',
    );
    const declared = query(['runs', 'latest', 'file', 'lib/shapes.rb'], environment);
    assert.ok(declared.totalLimitations > 0, 'probe-only obligations are declared, not reported as gaps');
    assert.match(JSON.stringify(declared), /ruby-file-not-instrumented/);
  }

  const minitest = supercov(['--', 'ruby', '-Itest', 'test/shapes_test.rb'], environment);
  assert.equal(minitest.status, 0, `${minitest.stdout}\n${minitest.stderr}`);
  assert.match(minitest.stderr, /3 test\(s\) across 1 source file\(s\)/);
  assertAssertionsAreObserved(environment, 'latest', 'minitest', 'test/shapes_test.rb');
  const runners = supercov(['runs', 'latest', 'runners'], environment);
  assert.match(runners.stdout, /minitest\s+3 test\(s\)/);
  const matcher = query(['runs', 'latest', 'line', 'lib/shapes.rb:51'], environment);
  assert.match(JSON.stringify(matcher), /ShapesTest#test_matcher/, 'Minitest identity reaches the line');

  // A test's coverage is a lower bound, and affected-test selection has to
  // treat it as one.
  //
  // Ruby's Coverage reports a line the first time it executes in the process
  // and never again -- that is what makes collecting it cheap -- so the first
  // test to reach a line is credited with it and every later test that runs
  // the same line is recorded against none of it. Reading that silence as "the
  // change missed this test" dropped tests that ran the changed code out of
  // the selection, with exit 0: three tests all exercising one method offered
  // two of them to a runner.
  //
  // What `--names` emits has to be the set that is safe to run, so it carries
  // the tests whose own record proves the change reached them and the tests
  // whose record cannot say.
  writeFileSync(
    resolve(project, 'test/shared_line_test.rb'),
    [
      'require "minitest/autorun"',
      'require_relative "../lib/shapes"',
      '',
      'class SharedLineTest < Minitest::Test',
      '  def test_first',
      '    assert_equal :yes, Shapes.classify(true, true, false)',
      '  end',
      '',
      '  def test_second',
      '    assert_equal :yes, Shapes.classify(true, true, false)',
      '  end',
      '',
      '  def test_third',
      '    assert_equal :yes, Shapes.classify(true, true, false)',
      '  end',
      'end',
      '',
    ].join('\n'),
  );
  const shared = supercov(['--', 'ruby', '-Itest', 'test/shared_line_test.rb'], environment);
  assert.equal(shared.status, 0, `${shared.stdout}\n${shared.stderr}`);
  assert.match(shared.stderr, /3 test\(s\)/, shared.stderr);

  // Change the body all three ran. Exactly one of them is credited with the
  // line; which one depends on Minitest's order, so the check is on the
  // selection rather than on any test's numbers.
  const shapes = resolve(project, 'lib/shapes.rb');
  const before = readFileSync(shapes, 'utf8');
  assert.ok(before.includes('      :yes\n'), 'the fixture still has the branch this rests on');
  writeFileSync(shapes, before.replace('      :yes\n', '      :indeed\n'));
  try {
    const names = supercov(['runs', 'latest', 'tests', 'affected', '--names'], environment);
    assert.equal(names.status, 0, names.stderr);
    const selected = names.stdout.split('\n').filter(Boolean);
    for (const test of [
      'SharedLineTest#test_first',
      'SharedLineTest#test_second',
      'SharedLineTest#test_third',
    ]) {
      assert.ok(
        selected.includes(test),
        `${test} ran the changed method, so a runner has to be offered it: ${selected.join(', ')}`,
      );
    }
  } finally {
    writeFileSync(shapes, before);
    rmSync(resolve(project, 'test/shared_line_test.rb'), { force: true });
  }

  const testUnit = supercov(['--', 'ruby', '-Itest', 'test/unit_style_test.rb'], environment);
  assert.equal(testUnit.status, 0, `${testUnit.stdout}\n${testUnit.stderr}`);
  assert.match(testUnit.stderr, /2 test\(s\) across 1 source file\(s\)/);
  const testUnitRunners = supercov(['runs', 'latest', 'runners'], environment);
  assert.match(testUnitRunners.stdout, /test-unit\s+2 test\(s\)/);
  const negation = query(['runs', 'latest', 'line', 'lib/shapes.rb:36'], environment);
  assert.match(JSON.stringify(negation), /UnitStyleTest#test_negation/, 'test-unit identity reaches the line');
  const testUnitFile = query(['runs', 'latest', 'file', 'lib/shapes.rb'], environment);
  assert.doesNotMatch(JSON.stringify(testUnitFile), /ruby-runner-adapter-failed/, 'the test-unit adapter installed completely');
  assertAssertionsAreObserved(environment, 'latest', 'test-unit', 'test/unit_style_test.rb');
  const testUnitSummary = query(['runs', 'latest'], environment);
  assert.equal(testUnitSummary.confidence.lines.asserted, 0, "Only assertions.json awards assertion credit");

  // Thread-parallel Minitest: probes stay per test, stdlib deltas that
  // overlapped go to the run and the limitation says so.
  const parallel = supercov(['--', 'ruby', '-Itest', 'test/parallel_test.rb'], environment);
  assert.equal(parallel.status, 0, `${parallel.stdout}\n${parallel.stderr}`);
  assert.match(parallel.stderr, /4 test\(s\) across 1 source file\(s\)/);
  assertAssertionsAreObserved(environment, 'latest', 'parallel minitest', 'test/parallel_test.rb');
  const parallelFile = query(['runs', 'latest', 'file', 'lib/shapes.rb'], environment);
  assert.match(JSON.stringify(parallelFile), /ruby-concurrent-test-phases/, 'thread-parallel run declares its limitation');

  const cucumber = supercov(['--', 'cucumber', '--publish-quiet'], environment);
  assert.equal(cucumber.status, 0, `${cucumber.stdout}\n${cucumber.stderr}`);
  assert.match(cucumber.stderr, /2 test\(s\) across 1 source file\(s\)/);
  const cucumberRunners = supercov(['runs', 'latest', 'runners'], environment);
  assert.match(cucumberRunners.stdout, /cucumber\s+2 test\(s\)/);
  const countdown = query(['runs', 'latest', 'line', 'lib/shapes.rb:99'], environment);
  assert.match(JSON.stringify(countdown), /features\/shapes\.feature:7/, 'Cucumber scenario identity reaches the line');

  // One failing test per runner, reported as one. Every leg above passes, so
  // a runner whose failure path was broken looked fine: the test-unit
  // adapter's result hooks never installed, and its failing tests were
  // reported as passed, until a run with a failing test was tried by hand.
  const failing = [
    ['minitest', ['ruby', '-Itest', 'test/failing/shapes_failing_test.rb']],
    ['test-unit', ['ruby', '-Itest', 'test/failing/unit_style_failing_test.rb']],
    ['rspec', ['rspec', 'spec_failing/shapes_failing_spec.rb']],
    ['cucumber', ['cucumber', '--publish-quiet', '-r', 'features', 'features_failing']],
  ];
  for (const [runner, command] of failing) {
    const result = supercov(['--', ...command], environment);
    assert.notEqual(result.status, 0, `${runner}: the failing test must fail the command\n${result.stdout}\n${result.stderr}`);
    const summary = query(['runs', 'latest'], environment);
    assert.deepEqual(
      [summary.testOutcomes.passed, summary.testOutcomes.failed],
      [1, 1],
      `${runner} must report one passing and one failing test: ${JSON.stringify(summary.testOutcomes)}`,
    );
    // Complete on 3.4+; 3.3 declares its interpreter boundaries here too.
    assert.equal(summary.measurement.complete, probes, `${runner}: ${JSON.stringify(summary.measurement)}`);
    const runners = supercov(['runs', 'latest', 'runners'], environment);
    assert.match(runners.stdout, new RegExp(`${runner}\\s+2 test\\(s\\)`), runners.stdout);
  }


  // A suite stops a server it started by signalling it, and what a signalled
  // process keeps is not obvious: Ruby turns a terminating signal into
  // SignalException, which unwinds through the `at_exit` where Coverage's own
  // result is read, so the child keeps every line it measured. SIGKILL cannot
  // be caught in any language and loses that result, which is the documented
  // boundary. Both are asserted together, because a trap installed in the
  // runtime could quietly turn the first case into the second.
  const signalProject = resolve(temporary, 'signals');
  mkdirSync(resolve(signalProject, 'lib'), { recursive: true });
  mkdirSync(resolve(signalProject, 'test'), { recursive: true });
  writeFileSync(
    resolve(signalProject, 'lib/worker.rb'),
    [
      'module Worker',
      '  def self.handle(kind)',
      '    if kind == "termed"',
      '      first = kind.length',
      '      return "termed#{first}"',
      '    end',
      '    if kind == "killed"',
      '      second = kind.length',
      '      return "killed#{second}"',
      '    end',
      '    "other"',
      '  end',
      'end',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(signalProject, 'child.rb'),
    [
      'require "worker"',
      '$stdout.sync = true',
      'while (line = $stdin.gets)',
      '  $stdout.puts Worker.handle(line.strip)',
      'end',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(signalProject, 'test/signal_test.rb'),
    [
      'require "minitest/autorun"',
      'require "open3"',
      'require "rbconfig"',
      '',
      'class SignalTest < Minitest::Test',
      '  def drive(word, signal)',
      '    stdin, stdout, wait = Open3.popen2(RbConfig.ruby, "-Ilib", "child.rb")',
      '    stdin.puts word',
      '    assert_match(/#{word}/, stdout.gets.strip)',
      '    Process.kill(signal, wait.pid)',
      '    if Gem.win_platform?',
      '      # Windows has no signals: "KILL" is TerminateProcess, and Ruby then',
      '      # reports the child as exited -- with status 0, no less. Its stdin is',
      '      # still open, so nothing but the kill could have ended it.',
      '      assert wait.value.exited?, "the child must have ended, and only the kill could end it"',
      '    else',
      '      refute_nil wait.value.termsig, "the child must die from the signal"',
      '    end',
      '  end',
      '',
      '  def test_terminated',
      '    skip "Windows has no SIGTERM; every kill there is the hard case" if Gem.win_platform?',
      '    drive("termed", "TERM")',
      '  end',
      '',
      '  def test_hard_killed',
      '    drive("killed", "KILL")',
      '  end',
      'end',
      '',
    ].join('\n'),
  );
  const signals = supercov(
    ['--', 'ruby', '-Ilib', '-Itest', 'test/signal_test.rb'],
    environment,
    signalProject,
  );
  assert.equal(signals.status, 0, `${signals.stdout}\n${signals.stderr}`);
  if (!windows) {
    // Windows has no SIGTERM, so the fixture skips this case there.
    const terminated = query(['runs', 'latest', 'line', 'lib/worker.rb:4'], environment, signalProject);
    assert.match(
      JSON.stringify(terminated),
      /test_terminated/,
      'a child that took SIGTERM must keep the lines it covered',
    );
  }
  const hardKilled = query(['runs', 'latest', 'line', 'lib/worker.rb:8'], environment, signalProject);
  assert.doesNotMatch(
    JSON.stringify(hardKilled),
    /test_hard_killed/,
    'SIGKILL cannot be caught, so that result is gone and must not be claimed',
  );
  // Losing it is unavoidable; reporting those lines as merely uncovered is
  // not. The run says a process never reported, which blocks completeness, so
  // the number is read as the floor it is.
  const signalSummary = query(['runs', 'latest', 'summary'], environment, signalProject);
  assert.ok(
    signalSummary.measurement.limitations >= 1 && signalSummary.measurement.blocking >= 1,
    `a killed process must declare the gap it left: ${JSON.stringify(signalSummary.measurement)}`,
  );
  assert.equal(
    signalSummary.complete,
    false,
    'a run missing a process cannot call itself complete',
  );

  const signalled = windows
    ? 'a killed child declares what it took with it (Windows has no SIGTERM to keep coverage through)'
    : 'a signalled child keeps its coverage, and a killed one declares what it took with it';
  console.log(`[ruby-coverage] ${ruby} measured the fixture through RSpec, Minitest, test-unit, Cucumber and thread-parallel Minitest with exact totals, and ${signalled}`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
