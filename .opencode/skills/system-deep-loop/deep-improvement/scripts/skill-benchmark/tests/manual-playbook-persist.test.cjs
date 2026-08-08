'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const LANE_DIR = path.resolve(__dirname, '..');
const manualRun = require(path.join(LANE_DIR, 'run-manual-playbook-scenario.cjs'));
const buildReport = require(path.join(LANE_DIR, 'build-report.cjs'));

const ARTIFACTS = [
  'README.md',
  'failed-runs.md',
  'findings-and-recommendations.md',
  'results.csv',
  'skill-benchmark-report.json',
  'skill-benchmark-report.md',
  'source.md',
];
const NOW = new Date('2026-08-08T12:00:00Z');
const tempRoots = [];

function makeSkill() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'manual-playbook-persist-'));
  tempRoots.push(root);
  fs.writeFileSync(path.join(root, 'SKILL.md'), '# Temporary skill\n');
  fs.mkdirSync(path.join(root, 'manual-testing-playbook'));
  return root;
}

function reportsDir(skillRoot) {
  return path.join(skillRoot, 'benchmark', 'reports');
}

function reportFolders(skillRoot) {
  const root = reportsDir(skillRoot);
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function assertRecord(result, expectedVerdict) {
  assert.deepEqual(fs.readdirSync(result.folderPath).sort(), ARTIFACTS.slice().sort());
  assert.equal(fs.existsSync(path.join(result.folderPath, 'report.md')), false);
  const jsonPath = path.join(result.folderPath, 'skill-benchmark-report.json');
  const markdownPath = path.join(result.folderPath, 'skill-benchmark-report.md');
  const csvPath = path.join(result.folderPath, 'results.csv');
  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  assert.equal(report.verdict, expectedVerdict);
  assert.equal(report.traceMode, 'doc');
  assert.equal(report.scoringMethod, 'not-applicable-manual-outcome');
  assert.equal(fs.readFileSync(markdownPath, 'utf8'), buildReport.renderReport(report));
  assert.equal(fs.readFileSync(csvPath, 'utf8'), buildReport.renderResultsCsv(report));
  assert.match(result.folderName, /^2026-08-08--manual-testing-playbook--[a-z0-9-]+(?:-\d+)?$/);
  return { report, markdown: fs.readFileSync(markdownPath, 'utf8'), csv: fs.readFileSync(csvPath, 'utf8') };
}

function indexRows(skillRoot) {
  const indexPath = path.join(reportsDir(skillRoot), 'README.md');
  if (!fs.existsSync(indexPath)) return [];
  return fs.readFileSync(indexPath, 'utf8').split('\n')
    .filter((line) => /^\|.*\]\(\.\/[^/]+\/\)/.test(line));
}

async function rejected(action) {
  try {
    await action();
  } catch (error) {
    return error;
  }
  assert.fail('expected the operation to reject');
}

test.after(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
});

test('PASS, FAIL, and SKIP persist seven-file non-scoring records', async () => {
  const skillRoot = makeSkill();
  const pass = await manualRun.run({
    skill: skillRoot, scenario: 'MP-001', variant: 'pass-case', verdict: 'PASS',
    reason: 'completed', evidence: 'evidence/pass.txt', now: NOW,
  });
  const fail = await manualRun.run({
    skill: skillRoot, scenario: 'MP-002', variant: 'fail-case', verdict: 'FAIL',
    reason: 'assertion failed', stage: 'verification', now: NOW,
  });
  const skip = await manualRun.run({
    skill: skillRoot, scenario: 'MP-003', variant: 'skip-case', verdict: 'SKIP',
    reason: 'operator deferred this scenario', now: NOW,
    execute: () => { throw new Error('SKIP must not dispatch'); },
  });

  const passRecord = assertRecord(pass, 'PASS');
  assertRecord(fail, 'FAIL');
  const skipRecord = assertRecord(skip, 'SKIP');
  assert.match(skipRecord.csv, /SKIP,operator deferred this scenario/);
  assert.match(skipRecord.markdown, /SKIP: operator deferred this scenario/);
  assert.doesNotMatch(skipRecord.markdown, /undefinedpts/);
  assert.match(skipRecord.markdown, /Manual playbook outcome; no Lane C dimension scoring applies\./);
  assert.equal(skipRecord.report.executionContext.dispatch, 'none');
  assert.equal(skipRecord.report.executionContext.stage, 'documentation');
  assert.deepEqual(passRecord.report.scenarioRows[0].evidence, ['evidence/pass.txt']);

  assert.equal(passRecord.report.aggregateScore, null);
  assert.equal(typeof passRecord.report.aggregateScore, 'object');
  for (const dimension of Object.values(passRecord.report.dimensionScores)) {
    assert.equal(dimension.status, 'not-applicable-manual-outcome');
    assert.equal(dimension.score, null);
    assert.notEqual(typeof dimension.score, 'number');
  }
  assert.equal(passRecord.report.scenarioRows[0].score, undefined);
  assert.equal(indexRows(skillRoot).length, 3);
  for (const result of [pass, fail, skip]) {
    assert.equal(indexRows(skillRoot).filter((line) => line.includes(`](./${result.folderName}/)`)).length, 1);
  }
});

test('outcome JSON overrides flags and preserves evidence and execution context', async () => {
  const skillRoot = makeSkill();
  const outcomePath = path.join(skillRoot, 'outcome.json');
  fs.writeFileSync(outcomePath, JSON.stringify({
    scenarioId: 'JSON-001',
    verdict: 'SKIP',
    reason: 'documented limitation',
    stage: 'documentation',
    evidence: ['notes/limitation.md'],
    executionContext: {
      operator: 'qa', dispatch: 'none', runToken: 'kept', executor: 'json-executor', model: 'json-model',
    },
  }));

  const result = await manualRun.run({
    skill: skillRoot,
    scenario: 'FLAG-001',
    variant: 'json-override',
    verdict: 'FAIL',
    reason: 'flag reason',
    stage: 'wrong-stage',
    evidence: 'flag.txt',
    executor: 'flag-executor',
    model: 'flag-model',
    'outcome-json': outcomePath,
    now: NOW,
  });
  const { report } = assertRecord(result, 'SKIP');
  assert.equal(report.scenarioRows[0].scenarioId, 'JSON-001');
  assert.equal(report.scenarioRows[0].reason, 'documented limitation');
  assert.deepEqual(report.scenarioRows[0].evidence, ['notes/limitation.md']);
  assert.equal(report.executionContext.operator, 'qa');
  assert.equal(report.executionContext.runToken, 'kept');
  assert.equal(report.executor, 'json-executor');
  assert.equal(report.model, 'json-model');
});

test('legacy rows without explicit verdict keep the original scenario-table cell', () => {
  const report = {
    targetSkill: { id: 'legacy-skill' },
    scoringMethod: 'mode-a-router-replay',
    traceMode: 'router',
    verdict: 'PASS',
    scenarioRows: [{ scenarioId: 'LEGACY-001', stage: 'routing', firstFailingStage: null }],
  };
  const markdown = buildReport.renderReport(report);
  assert.match(markdown, /\| LEGACY-001 \| — \| routing \| — \| passed \|/);
  assert.doesNotMatch(markdown, /PASS: /);
});

test('a throwing executor persists FAIL before the wrapper rejects', async () => {
  const skillRoot = makeSkill();
  const error = await rejected(() => manualRun.run({
    skill: skillRoot,
    scenario: 'MP-004',
    variant: 'executor-error',
    verdict: 'PASS',
    now: NOW,
    execute: () => { throw new Error('executor exploded'); },
  }));
  assert.equal(error.exitCode, 1);
  assert.ok(error.folderPath);
  const report = JSON.parse(fs.readFileSync(path.join(error.folderPath, 'skill-benchmark-report.json'), 'utf8'));
  assert.equal(report.verdict, 'FAIL');
  assert.equal(report.scenarioRows[0].verdict, 'FAIL');
  assert.match(report.scenarioRows[0].reason, /executor exploded/);
  assert.equal(indexRows(skillRoot).filter((line) => line.includes(`](./${error.folderName}/)`)).length, 1);
});

test('same-day runs reserve base and base-2 siblings', async () => {
  const skillRoot = makeSkill();
  const first = await manualRun.run({
    skill: skillRoot, scenario: 'MP-005', variant: 'same-day', verdict: 'PASS', now: NOW,
  });
  const second = await manualRun.run({
    skill: skillRoot, scenario: 'MP-006', variant: 'same-day', verdict: 'PASS', now: NOW,
  });
  assert.equal(second.folderName, `${first.folderName}-2`);
  assert.deepEqual(reportFolders(skillRoot), [first.folderName, second.folderName]);
  assert.equal(indexRows(skillRoot).length, 2);
});

test('baseline and occupied explicit destinations fail closed without partial writes', async () => {
  const baselineSkill = makeSkill();
  const baselineError = await rejected(() => manualRun.run({
    skill: baselineSkill, scenario: 'MP-007', variant: 'baseline-case', verdict: 'PASS',
    runLabel: 'baseline', now: NOW,
  }));
  assert.equal(baselineError.code, 'BAD_LABEL');
  assert.equal(fs.existsSync(reportsDir(baselineSkill)), false);

  const occupiedSkill = makeSkill();
  const occupiedDir = path.join(reportsDir(occupiedSkill), 'occupied');
  fs.mkdirSync(occupiedDir, { recursive: true });
  fs.writeFileSync(path.join(occupiedDir, 'sentinel.txt'), 'keep');
  const before = fs.readdirSync(occupiedDir).sort();
  const occupiedError = await rejected(() => manualRun.run({
    skill: occupiedSkill, scenario: 'MP-008', variant: 'occupied-case', verdict: 'PASS',
    destination: occupiedDir, now: NOW,
  }));
  assert.equal(occupiedError.code, 'COLLISION');
  assert.deepEqual(fs.readdirSync(occupiedDir).sort(), before);
  assert.equal(fs.existsSync(path.join(reportsDir(occupiedSkill), 'README.md')), false);
  assert.deepEqual(reportFolders(occupiedSkill), ['occupied']);
});
