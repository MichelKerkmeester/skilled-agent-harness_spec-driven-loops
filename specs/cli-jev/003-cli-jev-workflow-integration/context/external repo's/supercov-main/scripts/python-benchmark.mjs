#!/usr/bin/env node
// Overhead benchmark for a Python suite that executes a realistic number of
// measured lines.
//
// A suite's bill is not its test count. Every execution of a measured
// statement runs its probe -- a byte store into the context's slot -- and
// every condition its probe call; what a test pays grows with the measured
// lines it executes. An earlier shape of this benchmark gave each test one
// four-line `classify(a, b)` call -- 7.1 measured lines per test -- and
// reported 1.1x, while a real library (h11) executes about 2,100 lines per
// test. The number it printed could not move when the cost that matters
// changed, so it is the measured lines per test that must be realistic here.

import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-python-benchmark-'));
const project = resolve(temporary, 'project');
const venv = resolve(temporary, 'venv');
const python = process.env.SUPERCOV_PYTHON ?? 'python3';
const moduleCount = 200;
const testCount = 1000;
// Statements in the measured function, and how many times a test calls it.
// Their product is the line events a test pays for; `h11` sits near 2,100.
const statementCount = 100;
const callsPerTest = 20;
const linesPerTest = statementCount * callsPerTest;

function run(program, args, options = {}) {
  const started = performance.now();
  const result = spawnSync(program, args, { encoding: 'utf8', ...options });
  const elapsedMs = Math.round((performance.now() - started) * 10) / 10;
  assert.equal(result.status, 0, `${program} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return { ...result, elapsedMs };
}

try {
  mkdirSync(resolve(project, 'src'), { recursive: true });
  mkdirSync(resolve(project, 'tests'), { recursive: true });
  writeFileSync(resolve(project, 'src/__init__.py'), '');
  for (let index = 0; index < moduleCount; index += 1) {
    writeFileSync(
      resolve(project, `src/mod_${index.toString().padStart(3, '0')}.py`),
      // A body of distinct statements, so a call pays for the probe on each of
      // them, the way measured code does. A loop over two lines would
      // exercise only the first.
      //
      // One statement in ten branches. Making every one of them a conditional
      // measured decision recording rather than line coverage, and reported an
      // overhead no ordinary code would ever pay.
      `def classify(a, b):\n    total = 0\n${Array.from(
        { length: statementCount - 2 },
        (_, step) =>
          step % 10 === 9
            ? `    total = total + (1 if a else 0)\n`
            : `    total = total + ${step % 7}\n`,
      ).join('')}    return 1 if (a and b) else 0\n`,
    );
  }
  const imports = Array.from(
    { length: moduleCount },
    (_, index) => `from src import mod_${index.toString().padStart(3, '0')}`,
  ).join('\n');
  const modules = Array.from(
    { length: moduleCount },
    (_, index) => `mod_${index.toString().padStart(3, '0')}`,
  ).join(', ');
  writeFileSync(
    resolve(project, 'tests/test_many.py'),
    `${imports}\n\nMODULES = [${modules}]\n\ndef make_test(index):\n    def test():\n        module = MODULES[index % len(MODULES)]\n        for _ in range(${callsPerTest}):\n            assert module.classify(True, index % 2 == 0) == int(index % 2 == 0)\n    return test\n\nfor index in range(${testCount}):\n    globals()[f"test_{index:04}"] = make_test(index)\n`,
  );
  writeFileSync(
    resolve(project, 'pyproject.toml'),
    '[tool.pytest.ini_options]\naddopts = "-p no:cacheprovider"\n',
  );
  run('git', ['init', '-q', '.'], { cwd: project });
  run(python, ['-m', 'venv', venv]);
  const venvPython = resolve(venv, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  run(venvPython, ['-m', 'pip', 'install', '--disable-pip-version-check', '-q', 'pytest']);
  const environment = {
    ...process.env,
    PATH: `${resolve(venv, process.platform === 'win32' ? 'Scripts' : 'bin')}${delimiter}${process.env.PATH}`,
    SUPERCOV_RUST_BINARY: resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`),
    SUPERCOV_VERBOSE: '1',
  };
  // Three of each, alternating, and the fastest of each compared. A shared CI
  // machine stalls now and then; one run against one run let a single stall
  // decide the verdict -- the same 3.9 job measured 4.36x and then 3.09x --
  // while the fastest run is the one the machine disturbed least.
  const phaseMs = (result) => {
    const phase = result.stderr.match(/timings .*?tests=([0-9.]+)ms/);
    assert(phase, `no phase timings in:\n${result.stderr}`);
    return Number(phase[1]);
  };
  const plains = [];
  const measureds = [];
  // Every attempt starts cold, as the single run did: bytecode an earlier
  // attempt cached -- pytest's and the probed modules' -- would make the later
  // ones measure a warm run instead.
  // `.supercov` is left out of the walk: the previous run's trash sweeper
  // may still be deleting from it, and a directory it removes between the
  // listing and the descent failed the benchmark.
  const cold = () => {
    const walk = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name === '.supercov') continue;
        const path = resolve(directory, entry.name);
        if (entry.name === '__pycache__') rmSync(path, { recursive: true, force: true });
        else walk(path);
      }
    };
    walk(project);
    rmSync(resolve(project, '.supercov/cache'), { recursive: true, force: true });
  };
  for (let attempt = 0; attempt < 3; attempt += 1) {
    cold();
    plains.push(run(venvPython, ['-m', 'pytest', '-q'], { cwd: project, env: environment }));
    cold();
    measureds.push(
      run(
        process.execPath,
        [resolve(repository, 'bin/supercov.js'), '--', venvPython, '-m', 'pytest', '-q'],
        { cwd: project, env: environment },
      ),
    );
  }
  const plain = plains.reduce((best, result) => (result.elapsedMs < best.elapsedMs ? result : best));
  const measured = measureds.reduce((best, result) => (phaseMs(result) < phaseMs(best) ? result : best));
  assert.match(measured.stderr, new RegExp(`${testCount} test\\(s\\)`));
  const timings = measured.stderr.match(
    /python evidence: join=([0-9.]+)ms serialize=([0-9.]+)ms archive=([0-9.]+)ms/,
  );
  assert(timings, measured.stderr);
  const publication = timings.slice(1).map(Number);
  // The generator decides how many measured lines a test executes, so the
  // line events are known without counting them at runtime: the loop's own
  // two lines per call, plus the body's statements.
  const lineEvents = testCount * (linesPerTest + callsPerTest * 2);
  // Against the tests phase, not the whole command. What a measured line costs
  // is paid inside the interpreter; publication is Rust, reported separately
  // below, and swings by an order of magnitude between a debug and a release
  // build -- folding it in would make this say more about the build than the
  // runtime.
  const testsMs = phaseMs(measured);
  const ratio = Math.round((testsMs / plain.elapsedMs) * 100) / 100;
  const nsPerLine = Math.round(((testsMs - plain.elapsedMs) * 1e6) / lineEvents);
  console.log(JSON.stringify({
    python,
    modules: moduleCount,
    tests: testCount,
    linesPerTest,
    lineEvents,
    plainMs: plain.elapsedMs,
    supercovMs: measured.elapsedMs,
    testsMs,
    overheadMs: Math.round((testsMs - plain.elapsedMs) * 10) / 10,
    ratio,
    nsPerLine,
    publicationMs: {
      join: publication[0],
      serialize: publication[1],
      archive: publication[2],
      total: Math.round(publication.reduce((sum, value) => sum + value, 0) * 10) / 10,
    },
  }, null, 2));
  // A ratio rather than an absolute time: both halves scale with the host, so
  // it survives a slower CI box where a wall-clock budget would not.
  const budget = JSON.parse(
    readFileSync(resolve(repository, 'benchmarks/budget.json'), 'utf8'),
  ).pythonOverheadRatioMax;
  assert(
    typeof budget === 'number',
    'benchmarks/budget.json must set pythonOverheadRatioMax',
  );
  assert(
    ratio <= budget,
    `Python overhead is ${ratio}x on ${linesPerTest} measured lines per test, over the ${budget}x budget (${nsPerLine}ns per line event)`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
