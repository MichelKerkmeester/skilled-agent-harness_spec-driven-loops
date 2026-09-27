// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ check-goal tests — isolated packet goal conformance controls             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const { createGoalFixtures } = require('./fixtures/goal-fixtures.cjs');
const {
  CHECKS,
  checkMissingBindingRows,
  checkPlaceholders,
  checkCriteriaCount,
  checkParentBudget,
  checkFrontmatterFence,
  checkGoalPacket
} = require('../check-goal.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../../../');
const DIRECT_CHECKS = {
  'missing-binding-row': checkMissingBindingRows,
  placeholder: checkPlaceholders,
  'criteria-count': checkCriteriaCount,
  'parent-budget': checkParentBudget,
  'frontmatter-fence': checkFrontmatterFence
};
const NEGATIVE_CASES = [
  ['binding-row-removed-but-identifier-mentioned', 'missing-binding-row'],
  ['objective-placeholder', 'placeholder'],
  ['decision-placeholder', 'placeholder'],
  ['criterion-placeholder', 'placeholder'],
  ['criteria-count-out-of-range', 'criteria-count'],
  ['over-budget-parent', 'parent-budget'],
  ['over-budget-nested-phase-parent', 'parent-budget'],
  ['frontmatter-inner-fence', 'frontmatter-fence']
];

let fixtureRoot;
let fixtures;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

before(() => {
  fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'check-goal-fixtures-'));
  fixtures = createGoalFixtures(fixtureRoot);
});

after(() => {
  if (fixtureRoot) fs.rmSync(fixtureRoot, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('positive fixture passes every named check', () => {
  const result = checkGoalPacket(fixtures.positive, { workspaceRoot: WORKSPACE_ROOT });
  assert.equal(result.errors.length, 0);
  assert.equal(result.passed, true);
  assert.deepEqual(result.checks.map((check) => check.name), CHECKS);
  assert.ok(result.checks.every((check) => check.passed));

  for (const [name, run] of Object.entries(DIRECT_CHECKS)) {
    assert.equal(run(fixtures.positive, { workspaceRoot: WORKSPACE_ROOT }).passed, true, name);
  }
});

test('anchored criteria count even after a numbered directive list', () => {
  const result = checkCriteriaCount(fixtures.directiveCriteria, { workspaceRoot: WORKSPACE_ROOT });
  assert.equal(result.errors.length, 0);
  assert.equal(result.passed, true);
});

test('an over-length phase child that is not a phase parent passes the budget', () => {
  const result = checkGoalPacket(fixtures.overBudgetPhaseChild, { workspaceRoot: WORKSPACE_ROOT });
  assert.equal(result.errors.length, 0);
  assert.equal(result.isPhaseChild, true);
  assert.equal(result.passed, true);
});

for (const [fixtureName, expectedCheck] of NEGATIVE_CASES) {
  test(fixtureName + ' fails only ' + expectedCheck, () => {
    const packetDir = fixtures.negatives[fixtureName];
    const result = checkGoalPacket(packetDir, { workspaceRoot: WORKSPACE_ROOT });
    const failedChecks = result.checks
      .filter((check) => check.findings.length > 0 || check.errors.length > 0)
      .map((check) => check.name);

    assert.equal(result.errors.length, 0);
    assert.deepEqual(failedChecks, [expectedCheck]);
    assert.equal(result.passed, false);

    const directResult = DIRECT_CHECKS[expectedCheck](
      packetDir,
      { workspaceRoot: WORKSPACE_ROOT }
    );
    assert.equal(directResult.passed, false);
    assert.ok(directResult.findings.length > 0);
    assert.ok(directResult.findings.every((finding) => finding.check === expectedCheck));

    if (expectedCheck === 'placeholder') {
      assert.ok(
        directResult.findings.every((finding) => finding.code === 'template-placeholder')
      );
    }
  });
}

for (const asset of ['goal-top-level-template.md', 'goal-phase-parent-template.md', 'goal-phase-child-template.md']) {
  test('an unfilled copy of ' + asset + ' fails placeholder on objective, decision and criteria', () => {
    const text = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', asset), 'utf8');
    const block = text.match(/<!-- BEGIN TEMPLATE -->\n```markdown\n([\s\S]*?)\n```\n<!-- END TEMPLATE -->/u);
    assert.ok(block, asset + ' has no template block');
    const packetDir = path.join(fixtureRoot, 'unfilled-' + path.basename(asset, '.md'));
    fs.mkdirSync(packetDir, { recursive: true });
    fs.writeFileSync(path.join(packetDir, 'goal.md'), block[1] + '\n');

    const result = checkPlaceholders(packetDir, { workspaceRoot: WORKSPACE_ROOT });
    const details = result.findings.map((finding) => finding.detail);
    assert.equal(result.passed, false);
    assert.ok(details.some((detail) => detail.startsWith('objective')), 'objective');
    assert.ok(details.some((detail) => detail.startsWith('decision')), 'decision');
    assert.ok(details.some((detail) => detail.startsWith('completion criterion')), 'criteria');
  });
}

test('a goal.md path checks the folder that holds it', () => {
  const folderRun = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'check-goal.cjs'), '--root', WORKSPACE_ROOT, fixtures.positive],
    { encoding: 'utf8' }
  );
  const goalRun = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'check-goal.cjs'), '--root', WORKSPACE_ROOT, path.join(fixtures.positive, 'goal.md')],
    { encoding: 'utf8' }
  );

  assert.equal(folderRun.status, 0);
  assert.equal(goalRun.status, 0);
  assert.equal(goalRun.stdout, folderRun.stdout);
  assert.ok(goalRun.stdout.includes('RESULT: PASSED'));
});

test('a path to another file still exits 2 as not a directory', () => {
  const target = path.join(fixtureRoot, 'not-a-goal.md');
  fs.writeFileSync(target, 'x\n');
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', 'check-goal.cjs'), '--root', WORKSPACE_ROOT, target],
    { encoding: 'utf8' }
  );

  assert.equal(result.status, 2);
  assert.ok((result.stdout + result.stderr).includes('packet path is not a directory'));
});
