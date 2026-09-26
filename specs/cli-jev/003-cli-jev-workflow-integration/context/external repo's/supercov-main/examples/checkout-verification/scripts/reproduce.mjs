import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const record = process.argv.includes('--record');
assert(process.argv.slice(2).every(arg => arg === '--record'), 'Usage: node scripts/reproduce.mjs [--record]');
const launcher = join(root, 'node_modules/supercov/bin/supercov.js');
assert(existsSync(launcher), 'Run npm ci in examples/checkout-verification first.');
const temporary = mkdtempSync(join(tmpdir(), 'supercov-checkout-'));
const project = join(temporary, 'project');
const mutant = join(temporary, 'expiry-check-removed');
const transcripts = new Map();
const beforeTests = ['tests/session.test.js'];
const afterTests = [...beforeTests, 'tests/expired-session.test.js'];
const original = readFileSync(join(root, 'src/session.js'), 'utf8');

function fixture(destination) {
  mkdirSync(destination);
  writeFileSync(join(destination, 'package.json'), '{"private":true,"type":"module"}\n');
  cpSync(join(root, 'src'), join(destination, 'src'), { recursive: true });
  cpSync(join(root, 'tests'), join(destination, 'tests'), { recursive: true });
}

function execute(executable, args, cwd, expectedStatus = 0) {
  const result = spawnSync(executable, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
    timeout: 120_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  assert.ifError(result.error);
  assert.equal(result.status, expectedStatus, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function cli(args, name) {
  const result = execute(process.execPath, [launcher, ...args], project);
  if (name) {
    transcripts.set(`${name}.txt`, result.stdout);
    if (result.stderr) transcripts.set(`${name}.stderr.txt`, result.stderr);
  }
  return result.stdout;
}

function query(args, name) {
  const raw = cli([...args, '--json']);
  const result = JSON.parse(raw);
  assert.equal(result.ok, true, raw);
  transcripts.set(`${name}.json`, raw);
  return result.data;
}

function checkSummary(summary, tests, mcdc, assertedConditions) {
  assert.equal(summary.valid, true);
  assert.equal(summary.testExitCode, 0);
  assert.equal(summary.stale, false);
  assert.equal(summary.measurement.complete, true);
  assert.equal(summary.sourceScope.included, 1);
  assert.equal(summary.tests, tests);
  assert.equal(summary.testOutcomes.passed, tests);
  assert.equal(summary.testOutcomes.failed, 0);
  assert.deepEqual(summary.coverage.lines, { covered: 3, total: 3, percentage: 100 });
  assert.deepEqual(summary.coverage.branches, { covered: 2, total: 2, percentage: 100 });
  assert.equal(summary.coverage.conditionCoveragePct, mcdc);
  assert.equal(summary.confidence.assertionCoveredMcdcConditions, assertedConditions);
}

try {
  fixture(project);
  const version = cli(['--version']).trim();
  console.log(`\n${version} · checkout verification\n`);

  cli(['--', 'node', '--test', ...beforeTests], 'before-test-run');
  const before = query(['runs', 'latest'], 'before-summary');
  checkSummary(before, 2, 50, 1);
  const beforeDecision = query(['runs', before.run, 'decision', 'src/session.js:2'], 'before-decision');
  assert.equal(beforeDecision.decisions[0].conditions[1].source, '!expired');
  assert.equal(beforeDecision.decisions[0].conditions[1].covered, false);
  console.log('BEFORE · two passing tests');
  console.log(cli(['runs', before.run], 'before-summary'));
  console.log(cli(['runs', before.run, 'decision', 'src/session.js:2'], 'before-decision'));

  cli(['--', 'node', '--test', ...afterTests], 'after-test-run');
  const after = query(['runs', 'latest'], 'after-summary');
  checkSummary(after, 3, 100, 2);
  const afterDecision = query(['runs', after.run, 'decision', 'src/session.js:2'], 'after-decision');
  assert.equal(afterDecision.decisions[0].conditions[1].covered, true);
  assert.equal(afterDecision.decisions[0].conditions[1].assertionCovered, true);
  assert.equal(after.filesWithCoverageGaps, 0);
  console.log('AFTER · the expired-session test is included');
  console.log(cli(['runs', after.run], 'after-summary'));
  console.log(cli(['runs', after.run, 'decision', 'src/session.js:2'], 'after-decision'));

  const diff = query(['diff', before.run, after.run], 'diff');
  assert.deepEqual(diff.delta, { lines: 0, branches: 0, mcdc: 50 });
  assert.deepEqual(diff.gained.mcdc, ['src/session.js:2 C2 !expired']);
  assert.deepEqual([diff.lost.lineCount, diff.lost.branchCount, diff.lost.mcdcCount], [0, 0, 0]);
  console.log(cli(['diff', before.run, after.run], 'diff'));

  // A separate, deliberately broken copy tests whether the new assertion
  // catches the regression. This is NOT a Supercov mutation-testing feature.
  fixture(mutant);
  assert.equal(original.split('signedIn && !expired').length, 2);
  writeFileSync(join(mutant, 'src/session.js'), original.replace('signedIn && !expired', 'signedIn'));
  const mutantBefore = execute(process.execPath, ['--test', '--test-reporter=tap', ...beforeTests], mutant);
  const mutantAfter = execute(process.execPath, ['--test', '--test-reporter=tap', ...afterTests], mutant, 1);
  assert.match(mutantBefore.stdout, /# pass 2\b/);
  assert.match(mutantAfter.stdout, /not ok \d+ - an expired session cannot check out/);
  assert.match(mutantAfter.stdout, /# pass 2\b/);
  assert.match(mutantAfter.stdout, /# fail 1\b/);
  transcripts.set('regression-before.tap', mutantBefore.stdout);
  transcripts.set('regression-after.tap', mutantAfter.stdout);
  assert.equal(readFileSync(join(project, 'src/session.js'), 'utf8'), original);
  assert.equal(readFileSync(join(root, 'src/session.js'), 'utf8'), original);

  const result = {
    supercov: version,
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    recordedAt: new Date().toISOString(),
    before: { tests: 2, lines: '3/3', branches: '2/2', mcdc: '1/2', assertionLinkedMcdc: '1/2' },
    after: { tests: 3, lines: '3/3', branches: '2/2', mcdc: '2/2', assertionLinkedMcdc: '2/2' },
    regression: { change: 'Remove && !expired in a temporary copy', beforeExitCode: 0, afterExitCode: 1, failingTest: 'an expired session cannot check out' },
    sourceUnchanged: true,
  };
  transcripts.set('result.json', JSON.stringify(result, null, 2) + '\n');
  console.log('REGRESSION CHECK · remove the expiry guard in a separate copy');
  console.log('Original tests: 2 pass. With the new test: 2 pass, 1 fails.');
  console.log('The failed test is: an expired session cannot check out.');
  console.log('\nVerified: MC/DC 50% → 100%; the added assertion catches removal of the expiry check.');
  console.log('No application source or tests in your checkout were changed.');

  if (record) {
    const destination = join(root, 'recorded');
    mkdirSync(destination, { recursive: true });
    for (const [name, output] of transcripts) writeFileSync(join(destination, name), output);
    console.log(`\nSaved actual CLI output to ${destination}`);
  }
} finally {
  // Only the directory made by this invocation is removed, never the checkout.
  rmSync(temporary, { recursive: true, force: true });
}
