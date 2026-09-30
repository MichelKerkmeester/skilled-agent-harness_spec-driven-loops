// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lint-goal-criteria tests: lexical rule and parser controls              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const { createGoalFixtures } = require('./fixtures/goal-fixtures.cjs');
const { checkCriteriaCount } = require('../check-goal.cjs');
const {
  readGoalCriteria,
  rule4DanglingRefs,
  rule5ExternalFile,
  classifyCriterion,
  lintCriterion,
  walkGoalFiles,
  lintWorkspace
} = require('../lint-goal-criteria.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../../../');
let LINT = path.join(__dirname, '..', 'lint-goal-criteria.cjs');

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

function createWalkRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-goal-walk-'));
  return {
    root,
    write(relativePath, content) {
      const file = path.join(root, relativePath);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    },
    remove() {
      fs.rmSync(root, { recursive: true, force: true });
    }
  };
}

// A minimal authored goal: three scored criteria, one clean, one with a
// dangling reference, and one failing both rules.
const GOOD = [
  '---',
  'title: x',
  '---',
  '# Goal',
  '',
  '<!-- ANCHOR:completion -->',
  '## 3. COMPLETION CRITERIA',
  '',
  '- [ ] The report exists',
  '- [ ] `npm test` exits 0',
  '- [ ] Every REQ-001 row holds',
  '<!-- /ANCHOR:completion -->',
  ''
].join('\n');

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

test('rule 5 fails a check that needs another document', () => {
  assert.deepEqual(
    rule5ExternalFile('Every check passes as described in the plan.'),
    ['as described in']
  );
  assert.deepEqual(rule5ExternalFile('Every REQ-001 row holds'), ['REQ-001']);
  assert.deepEqual(
    rule5ExternalFile('The rows in the report are listed'),
    ['are listed', 'The rows in']
  );
});

test('rule 5 passes a check on named commands and counts', () => {
  const lines = [
    '`npm test` exits 0 with 12 passing cases.',
    'the rows in `labels.jsonl` are listed'
  ];

  for (const line of lines) {
    assert.deepEqual(rule5ExternalFile(line), [], line);
  }
});

test('a line can fail both rules', () => {
  assert.deepEqual(
    lintCriterion('The report covers every listed file as described in the spec.'),
    {
      class: 'scored',
      rule4: ['The report', 'every listed', 'the spec'],
      rule5: ['as described in', 'every listed']
    }
  );
});

test('placeholder and unscored lines stay out of both rules', () => {
  assert.equal(classifyCriterion('[Another]'), 'placeholder');
  assert.equal(classifyCriterion('Repo trusted; verdict recorded'), 'lexical_unscored');
  assert.deepEqual(lintCriterion('[Another]'), { class: 'placeholder', rule4: [], rule5: [] });
});

test('a goal with no criteria yields no records and counts as no_input', () => {
  const { root, write, remove } = createWalkRoot();
  try {
    write('specs/p/goal.md', '---\ntitle: x\n---\n# Goal\n\nNo criteria here.\n');
    const r = lintWorkspace(root);

    assert.equal(r.summary.goals_scanned, 1);
    assert.equal(r.summary.no_input, 1);
    assert.deepEqual(r.records, []);
    assert.deepEqual(r.files, [{ path: 'specs/p/goal.md', criteria: 0, noInput: true, error: null }]);
  } finally {
    remove();
  }
});

test('the walker excludes scratch paths and z_archive', () => {
  const { root, write, remove } = createWalkRoot();
  try {
    const goalPaths = [
      'specs/a/goal.md',
      'specs/a/scratch/b/goal.md',
      'specs/scratch/c/goal.md',
      'specs/z_archive/d/goal.md'
    ];
    for (const goalPath of goalPaths) write(goalPath, GOOD);

    const walk = walkGoalFiles(path.join(root, 'specs'));
    assert.deepEqual(walk.goalFiles, [path.join(root, 'specs/a/goal.md')]);
    assert.equal(walk.scratchExcluded, 2);
    assert.deepEqual(walk.errors, []);

    const r = lintWorkspace(root);
    assert.deepEqual(r.summary, {
      goals_scanned: 1,
      scratch_excluded: 2,
      criteria: 3,
      scored: 3,
      rule4_violations: 2,
      rule5_violations: 1,
      both_violations: 1,
      placeholder: 0,
      lexical_unscored: 0,
      no_input: 0,
      errors: 0
    });
    assert.equal(r.records[0].id, 'specs/a/goal.md:9');
  } finally {
    remove();
  }
});

test('the command line exits 0 and names a missing packet or a bad option', () => {
  const missing = spawnSync(
    process.execPath,
    [LINT, '--root', WORKSPACE_ROOT, 'specs/no-such-packet'],
    { encoding: 'utf8' }
  );

  assert.equal(missing.status, 0);
  assert.ok(missing.stderr.includes('[lint-goal-criteria] ERROR specs/no-such-packet: packet not found'));
  assert.ok(missing.stdout.includes('goals_scanned=0'));

  const bogus = spawnSync(process.execPath, [LINT, '--bogus'], { encoding: 'utf8' });

  assert.equal(bogus.status, 0);
  assert.ok(bogus.stderr.includes('[lint-goal-criteria] ERROR unknown option: --bogus'));
});

test('the report prints per-rule counts and each flagged line', () => {
  const { root, write, remove } = createWalkRoot();
  try {
    write('specs/a/goal.md', GOOD);
    write('specs/a/scratch/b/goal.md', GOOD);

    const text = spawnSync(
      process.execPath,
      [LINT, '--root', root, '--all'],
      { encoding: 'utf8' }
    );

    assert.equal(text.status, 0);
    const lines = text.stdout.split('\n');
    assert.ok(lines.includes('scratch_excluded=1'));
    assert.ok(lines.includes('rule4_violations=2'));
    assert.ok(lines.includes('rule5_violations=1'));
    assert.ok(lines.includes('rule4 specs/a/goal.md:9: The report'));
    assert.ok(lines.includes('rule5 specs/a/goal.md:11: REQ-001'));

    const json = spawnSync(
      process.execPath,
      [LINT, '--root', root, '--all', '--json'],
      { encoding: 'utf8' }
    );

    assert.equal(json.status, 0);
    assert.equal(JSON.parse(json.stdout).summary.rule5_violations, 1);
  } finally {
    remove();
  }
});
