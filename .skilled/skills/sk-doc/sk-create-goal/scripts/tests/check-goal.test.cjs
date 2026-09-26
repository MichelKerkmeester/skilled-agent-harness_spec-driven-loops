// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ check-goal tests — isolated packet goal conformance controls             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
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
  'parent-budget': checkParentBudget
};
const NEGATIVE_CASES = [
  ['binding-row-removed-but-identifier-mentioned', 'missing-binding-row'],
  ['objective-placeholder', 'placeholder'],
  ['decision-placeholder', 'placeholder'],
  ['criterion-placeholder', 'placeholder'],
  ['criteria-count-out-of-range', 'criteria-count'],
  ['over-budget-parent', 'parent-budget']
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
