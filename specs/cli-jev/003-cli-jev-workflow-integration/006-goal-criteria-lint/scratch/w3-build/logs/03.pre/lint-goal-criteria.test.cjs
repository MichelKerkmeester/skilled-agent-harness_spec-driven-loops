// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lint-goal-criteria tests — lexical rule and parser controls              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const { createGoalFixtures } = require('./fixtures/goal-fixtures.cjs');
const { checkCriteriaCount } = require('../check-goal.cjs');
const { readGoalCriteria, rule4DanglingRefs } = require('../lint-goal-criteria.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../../../');

let fixtureRoot;
let fixtures;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

before(() => {
  fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-goal-fixtures-'));
  fixtures = createGoalFixtures(fixtureRoot);
});

after(() => {
  if (fixtureRoot) fs.rmSync(fixtureRoot, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the ported parser counts criteria the way check-goal does', () => {
  const cases = [
    ['positive', fixtures.positive],
    ['directive-criteria', fixtures.directiveCriteria],
    ['criteria-count-out-of-range', fixtures.negatives['criteria-count-out-of-range']],
    ['criterion-placeholder', fixtures.negatives['criterion-placeholder']]
  ];
  const counts = new Map();

  for (const [name, packetDir] of cases) {
    const n = readGoalCriteria(fs.readFileSync(path.join(packetDir, 'goal.md'), 'utf8')).criteria.length;
    const result = checkCriteriaCount(packetDir, { workspaceRoot: WORKSPACE_ROOT });
    counts.set(name, n);

    assert.equal(result.passed, n >= 3 && n <= 7, name);
    if (!result.passed) {
      assert.ok(result.findings[0].detail.includes('count is ' + n + ';'), name);
    }
  }

  assert.equal(counts.get('positive'), 3);
  assert.equal(counts.get('criteria-count-out-of-range'), 2);
});

test('each criterion carries its file line and a 12-hex text hash', () => {
  const h = (text) => createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 12);
  const content = [
    '---',
    'title: x',
    '---',
    '# Goal',
    '',
    '<!-- ANCHOR:completion -->',
    '## 3. COMPLETION CRITERIA',
    '',
    '- [ ] First check exits 0',
    '- [x] Second check prints 3',
    '<!-- /ANCHOR:completion -->',
    ''
  ].join('\n');

  assert.deepEqual(readGoalCriteria(content), {
    criteria: [
      { line: 9, text: 'First check exits 0', text_sha12: h('First check exits 0') },
      { line: 10, text: 'Second check prints 3', text_sha12: h('Second check prints 3') }
    ],
    error: null
  });

  assert.deepEqual(readGoalCriteria('---\ntitle: x\n# Goal\n'), {
    criteria: [],
    error: 'goal frontmatter opener has no closing fence'
  });
});

test('rule 4 fails a dangling definite description', () => {
  assert.deepEqual(
    rule4DanglingRefs('The report includes the result.'),
    ['The report', 'the result']
  );
  assert.deepEqual(rule4DanglingRefs('It passes.'), ['It']);
  assert.deepEqual(
    rule4DanglingRefs('each of the four goals lists the same three rows'),
    ['the same three rows']
  );
});

test('rule 4 passes a line whose references resolve locally', () => {
  const lines = [
    '`node lint.cjs --all` exits 0 in the packet and prints the `rows=` line.',
    "This phase's report names docs/a.md",
    'Every test in the repo passes'
  ];

  for (const line of lines) {
    assert.deepEqual(rule4DanglingRefs(line), [], line);
  }
});
