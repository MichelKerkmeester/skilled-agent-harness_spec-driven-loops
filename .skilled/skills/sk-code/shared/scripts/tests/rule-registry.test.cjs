// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Rule Id Registry Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The registry is the set of ids an override row may name, read from the documents that
// declare them. These cases prove it follows those documents rather than a copy, that its
// tables agree with the contract's fixed list, and that every override row a shipped
// checklist carries names an id it knows.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { loadRegistry } = require('../lib/rule-registry.cjs');
const { lintOverrides, loadContract } = require('../check-rule-overrides.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HUB = path.resolve(__dirname, '..', '..', '..');
const SKILLS = path.dirname(HUB);
const DOCS = Object.freeze([
  ['sk-code-quality', 'references', 'runner-contract.md'],
  ['shared', 'references', 'universal', 'code-quality-standards.md'],
  ['sk-code-review', 'references', 'review-core.md'],
]);
const SECTION_HEADING = /^## (?:Rule overrides|\d+\. RULE OVERRIDES)\s*$/m;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(...parts) {
  return fs.readFileSync(path.join(HUB, ...parts), 'utf8');
}

// A throwaway hub holding copies of the three declaring documents, edited by the caller.
function withHub(edit, body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rule-registry-'));
  try {
    for (const parts of DOCS) {
      const target = path.join(root, ...parts);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, read(...parts));
    }
    edit(root);
    return body(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function rewrite(root, parts, change) {
  const file = path.join(root, ...parts);
  fs.writeFileSync(file, change(fs.readFileSync(file, 'utf8')));
}

// The first-column ids of the table under one H3 heading of review-core.md section 8,
// read independently of the registry's own parser.
function reviewTableIds(heading) {
  const section = read('sk-code-review', 'references', 'review-core.md').split(/^## 8\. /m)[1].split(/^## 9\. /m)[0];
  const block = section.split(new RegExp(`^### ${heading}$`, 'm'))[1].split(/^### /m)[0];
  return block.split('\n').map((line) => /^\| `(review\.[a-z0-9-]+)` \|/.exec(line)).filter(Boolean).map((match) => match[1]);
}

function standardsRows() {
  return read('shared', 'references', 'universal', 'code-quality-standards.md').split('\n')
    .map((line) => /^\| `(floor\.[a-z0-9-]+)` \| ([A-Za-z]+) \|/.exec(line))
    .filter(Boolean)
    .map((match) => ({ id: match[1], mark: match[2] }));
}

function checkerNames() {
  const table = read('sk-code-quality', 'scripts', 'check-comment-hygiene.sh').split('VIOLATION_PATTERNS = [')[1].split(/^\]/m)[0];
  return [...table.matchAll(/^\s*\("([a-z0-9-]+)",/gm)].map((match) => match[1]);
}

// Every Markdown file under the skills folder, links and dependency folders left out.
function markdownFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) markdownFiles(file, out);
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(file);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('derived: a row added to a declaring table is known at once, and a missing section throws', () => {
  withHub((root) => rewrite(root, ['sk-code-review', 'references', 'review-core.md'], (text) => text.replace(
    '| `review.data-privacy` |', '| `review.example-new-rule` | A rule added for this case | Code quality, section 6 | P2 |\n| `review.data-privacy` |',
  )), (root) => {
    const registry = loadRegistry({ hubRoot: root });
    assert.ok(registry.has('review.example-new-rule'));
    assert.ok(!loadRegistry().has('review.example-new-rule'));
  });
  withHub((root) => rewrite(root, ['shared', 'references', 'universal', 'code-quality-standards.md'], (text) => text.replace(/^## 4\. /m, '## Four. ')),
    (root) => assert.throws(() => loadRegistry({ hubRoot: root }), /has no section 4/));
  withHub((root) => rewrite(root, ['sk-code-review', 'references', 'review-core.md'], (text) => text.replace('### The Default Lens', '### Lens')),
    (root) => assert.throws(() => loadRegistry({ hubRoot: root }), /has no "### The Default Lens" heading/));
});

test('no silent shrink: an unquoted id row or a reworded hygiene template throws with its file and line', () => {
  const review = ['sk-code-review', 'references', 'review-core.md'];
  withHub((root) => rewrite(root, review, (text) => text.replace('| `review.kiss` |', '| review.kiss |')), (root) => {
    const file = path.join(root, ...review);
    const line = fs.readFileSync(file, 'utf8').split('\n').indexOf(fs.readFileSync(file, 'utf8').split('\n').find((row) => row.startsWith('| review.kiss |'))) + 1;
    assert.throws(() => loadRegistry({ hubRoot: root }),
      (error) => error.message === `${file}:${line} is a table row whose first cell names no rule id: review.kiss`);
  });
  const runner = ['sk-code-quality', 'references', 'runner-contract.md'];
  withHub((root) => rewrite(root, runner, (text) => text.replace('| `hygiene.<name>` |', '| `hygiene.<rule>` |')), (root) => {
    assert.throws(() => loadRegistry({ hubRoot: root }), /runner-contract\.md:\d+ is a hygiene row that does not match the `hygiene\.<name>` template: `hygiene\.<rule>`/);
  });
});

test('tables agree: the documented ids, the contract\'s fixed list and the registry hold the same rules', () => {
  const registry = loadRegistry();
  const contract = loadContract();
  const fixed = contract.fixed.map((row) => row.id);

  const floorRows = standardsRows();
  assert.deepEqual([...registry.floor].sort(), floorRows.map((row) => row.id).sort());
  assert.deepEqual(floorRows.filter((row) => row.mark === 'FIXED').map((row) => row.id).sort(),
    fixed.filter((id) => id.startsWith('floor.')).sort());

  const reviewFloor = reviewTableIds('The Floor');
  assert.deepEqual(reviewFloor.sort(), fixed.filter((id) => id.startsWith('review.')).sort());
  assert.deepEqual([...registry.review].sort(), [...reviewFloor, ...reviewTableIds('The Default Lens')].sort());

  assert.deepEqual([...registry.hygiene].sort(), checkerNames().map((name) => `hygiene.${name}`).sort());
  // Each class the contract fixes by wildcard or checks by machine names real runner ids.
  for (const ruleClass of [...fixed.filter((id) => id.endsWith('.*')).map((id) => id.slice(0, -2)), ...contract.machineChecked]) {
    assert.ok([...registry.ids].some((id) => id.startsWith(`${ruleClass}.`)), ruleClass);
  }
  for (const id of fixed.filter((entry) => !entry.endsWith('.*'))) assert.ok(registry.has(id), id);
});

test('shipped checklists: every override row under the skills folder names a known rule', () => {
  const registry = loadRegistry();
  const seen = [];
  for (const file of markdownFiles(SKILLS)) {
    const text = fs.readFileSync(file, 'utf8');
    if (!SECTION_HEADING.test(text)) continue;
    const result = lintOverrides(text);
    for (const row of result.rows) {
      seen.push(path.relative(SKILLS, file));
      assert.ok(registry.has(row.id), `${path.relative(SKILLS, file)}:${row.line} names ${row.id}, which no declaring document carries`);
    }
  }
  assert.ok(seen.includes(path.join('sk-code', 'sk-code-skilled', 'assets', 'checklists', 'universal-checklist.md')), 'the SKILLED override row was not read');
});
