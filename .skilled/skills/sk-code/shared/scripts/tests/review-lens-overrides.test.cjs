// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Review Lens Override Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The review mode reads `## Rule overrides` rows through the same linter as quality, so
// its rule ids have to line up with the contract. These cases read the review mode's
// own docs, the contract JSON and the hygiene checker side by side: a lens id the
// contract fixes would make an override silently impossible, a floor id the contract
// leaves open would let a row drop a review minimum, and a TODO rule that names no
// hygiene id would let review flag again a rule a repository switched off.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { lintOverrides, loadContract } = require('../check-rule-overrides.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HUB = path.resolve(__dirname, '..', '..', '..');
const REVIEW_CORE = path.join(HUB, 'sk-code-review', 'references', 'review-core.md');
const REVIEW_ASSETS = path.join(HUB, 'sk-code-review', 'assets');
const RULE_CHECKLISTS = ['code-quality-checklist.md', 'security-checklist.md', 'solid-checklist.md', 'test-quality-checklist.md'];
const STANDARDS = path.join(HUB, 'shared', 'references', 'universal', 'code-quality-standards.md');
const HYGIENE_CHECKER = path.join(HUB, 'sk-code-quality', 'scripts', 'check-comment-hygiene.sh');
const QUALITY_GATE = path.join(HUB, 'sk-code-quality', 'scripts', 'quality-gate.cjs');
const SKILLED_CHECKLIST = path.join(HUB, 'sk-code-skilled', 'assets', 'checklists', 'universal-checklist.md');
const HEADER = '| Rule | Action | Reason |\n| --- | --- | --- |\n';
const RULE_ID = /`([a-z][a-z0-9-]*\.[a-z0-9][a-z0-9-]*)`/g;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

// The first-column ids of the table under one H3 heading of review-core.md section 8.
function sectionEightTableIds(heading) {
  const section = read(REVIEW_CORE).split(/^## 8\. /m)[1].split(/^## 9\. /m)[0];
  const block = section.split(new RegExp(`^### ${heading}$`, 'm'))[1].split(/^### /m)[0];
  return block.split('\n')
    .map((line) => /^\| `([^`]+)` \|/.exec(line))
    .filter(Boolean)
    .map((match) => match[1]);
}

function universalFloorIds() {
  return read(STANDARDS).split('\n')
    .map((line) => /^\| `(floor\.[a-z0-9-]+)` \| ([A-Za-z]+) \|/.exec(line))
    .filter(Boolean)
    .map((match) => ({ id: match[1], mark: match[2] }));
}

function hygieneRuleNames() {
  const table = read(HYGIENE_CHECKER).split('VIOLATION_PATTERNS = [')[1].split(/^\]/m)[0];
  return [...table.matchAll(/^\s*\("([a-z0-9-]+)",/gm)].map((match) => match[1]);
}

// Every `Rule:` line in the review checklists, with the ids it cites and its kind.
function checklistRuleLines() {
  const lines = [];
  for (const name of RULE_CHECKLISTS) {
    const text = read(path.join(REVIEW_ASSETS, name));
    for (const line of text.split('\n')) {
      const match = /^Rule: (floor|default lens)\b(.*)$/.exec(line);
      if (match) lines.push({ file: name, kind: match[1], ids: [...match[2].matchAll(RULE_ID)].map((id) => id[1]), line });
    }
  }
  return lines;
}

function overrideRow(id, action) {
  return `# Checklist\n\n## Rule overrides\n\n${HEADER}| \`${id}\` | ${action} | |\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the review lens ids are review.<name>, none is fixed, and a replace row on review.function-length is accepted', () => {
  const lens = sectionEightTableIds('The Default Lens');
  assert.ok(lens.includes('review.function-length'), 'review-core.md section 8 lists no review.function-length lens rule');
  assert.equal(new Set(lens).size, lens.length, 'a lens id is listed twice');
  const fixed = new Set(loadContract().fixed.map((entry) => entry.id));
  for (const id of lens) {
    assert.match(id, /^review\.[a-z0-9][a-z0-9-]*$/, `${id} is not a review lens id`);
    assert.ok(!fixed.has(id), `${id} is a lens rule but the contract fixes it, so no row could change it`);
  }
  const result = lintOverrides(overrideRow('review.function-length', 'replace: A function stays under 60 lines'));
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.rows.map((row) => [row.id, row.action, row.text]), [
    ['review.function-length', 'replace', 'A function stays under 60 lines'],
  ]);
});

test('the review floor ids are the contract\'s fixed review ids, and a row naming any of them is refused', () => {
  const floor = sectionEightTableIds('The Floor');
  const fixedReview = loadContract().fixed.map((entry) => entry.id).filter((id) => id.startsWith('review.'));
  assert.deepEqual(floor, fixedReview);
  for (const id of floor) {
    const result = lintOverrides(overrideRow(id, 'none'));
    assert.equal(result.rows.length, 0, `${id} was accepted`);
    assert.match(result.errors[0].message, new RegExp(`\`${id.replace('.', '\\.')}\` is on the hard floor`));
  }
});

test('every review checklist section cites its ids, floor ids are fixed and lens ids are in the lens table', () => {
  const lines = checklistRuleLines();
  for (const name of RULE_CHECKLISTS) {
    assert.ok(lines.some((line) => line.file === name), `${name} carries no Rule: line`);
  }
  const lens = new Set(sectionEightTableIds('The Default Lens'));
  const fixed = new Set(loadContract().fixed.map((entry) => entry.id));
  const floorIds = new Map(universalFloorIds().map((row) => [row.id, row.mark]));
  for (const line of lines) {
    if (line.ids.length === 0) {
      assert.match(line.line, /Each item names its own id/, `${line.file}: "${line.line}" names no rule id`);
    }
    for (const id of line.ids) {
      if (id.startsWith('floor.')) {
        assert.ok(floorIds.has(id), `${line.file}: ${id} is not a rule of the universal standards`);
        if (line.kind === 'floor' && !line.line.includes('overridable')) {
          assert.equal(floorIds.get(id), 'FIXED', `${line.file}: ${id} is cited as floor but the standards leave it overridable`);
        }
      } else if (line.kind === 'floor') {
        assert.ok(fixed.has(id), `${line.file}: ${id} is cited as floor but the contract does not fix it`);
      } else if (!(fixed.has(id) && /\b(?:is|are) floor\b/.test(line.line))) {
        // A lens line may name the floor items it excepts, as in "except ..., which are floor".
        assert.ok(lens.has(id), `${line.file}: ${id} is cited as lens but review-core.md section 8 does not list it`);
      }
    }
  }
  // An item-level id, such as `review.function-length`: in a maintainability list, is a lens id too.
  for (const name of RULE_CHECKLISTS) {
    for (const match of read(path.join(REVIEW_ASSETS, name)).matchAll(/^- `(review\.[a-z0-9-]+)`:/gm)) {
      assert.ok(lens.has(match[1]), `${name}: item id ${match[1]} is not in the lens table`);
    }
  }
});

test('the review TODO rule maps onto real hygiene ids and asks for no tracker id by default', () => {
  const names = new Set(hygieneRuleNames());
  assert.ok(names.size > 0, 'no rule names read from the hygiene checker');
  const core = read(REVIEW_CORE);
  const mapping = core.split(/^### Hygiene Ids and the TODO Rule$/m)[1].split(/^### /m)[0];
  const tracker = [...mapping.split('\n').find((line) => line.startsWith('Quality\'s comment-hygiene checker')).matchAll(/`hygiene\.([a-z0-9-]+)`/g)]
    .map((match) => match[1]);
  assert.deepEqual(tracker, ['issue', 'task', 'adr', 'req', 'rc', 'chk']);
  for (const name of tracker) assert.ok(names.has(name), `hygiene.${name} is not a rule of the checker`);
  const todo = read(path.join(REVIEW_ASSETS, 'code-quality-checklist.md')).split('\n').find((line) => line.startsWith('- `review.todo-tracking`:'));
  assert.ok(todo, 'code-quality-checklist.md has no review.todo-tracking item');
  for (const name of tracker) assert.ok(todo.includes(`\`hygiene.${name}\``), `the TODO item does not name hygiene.${name}`);
  assert.doesNotMatch(todo, /ticket number/i);
});

test('a hygiene id a repository disables in quality reaches review as a mapped id', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'review-lens-'));
  try {
    spawnSync('git', ['-c', 'core.fsmonitor=false', 'init', '-q', repo], { encoding: 'utf8' });
    const configDir = path.join(repo, '.skilled', 'skills', 'sk-code', 'sk-code-quality', 'repository');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(path.join(configDir, 'quality.json'), JSON.stringify({ schemaVersion: 1, commentHygiene: { disableRules: ['issue'] } }));
    fs.writeFileSync(path.join(repo, 'a.js'), '// TODO ticket #12: retry the upload\nmodule.exports = 1;\n');
    const run = spawnSync(process.execPath, [QUALITY_GATE, '--explain', 'a.js'], { cwd: repo, encoding: 'utf8' });
    assert.equal(run.status, 2, run.stderr);
    const disabled = JSON.parse(run.stdout).config.hygiene.disabled;
    assert.deepEqual(disabled, ['hygiene.issue']);
    const todo = read(path.join(REVIEW_ASSETS, 'code-quality-checklist.md')).split('\n').find((line) => line.startsWith('- `review.todo-tracking`:'));
    for (const id of disabled) assert.ok(todo.includes(`\`${id}\``), `review's TODO rule does not map ${id}, so it could come back as a review finding`);
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
});

test('the SKILLED surface rows lint clean and name only lens ids', () => {
  const result = lintOverrides(read(SKILLED_CHECKLIST));
  assert.deepEqual(result.errors, []);
  assert.ok(result.found, 'universal-checklist.md carries no Rule overrides section');
  const lens = new Set(sectionEightTableIds('The Default Lens'));
  for (const row of result.rows) assert.ok(lens.has(row.id), `${row.id} would be ignored by review`);
});
