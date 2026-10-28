// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: SpecKit Review Dispatch Contract Tests                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin how a code review is marked, dispatched and read.           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const OPENCODE_ROOT = join(__dirname, '..', '..');

const REVIEW_DISPATCH_YAMLS = [
  'commands/speckit/assets/speckit-implement.yaml',
  'commands/speckit/assets/speckit-complete.yaml',
];

// The deep-loop guards match this exact line, so a dispatcher that writes any other
// text produces a marker nothing recognizes.
const MARKER = 'CODE-REVIEW';

function read(relativePath) {
  return readFileSync(join(OPENCODE_ROOT, relativePath), 'utf8');
}

// The review entry of agent_availability runs from its key to the next sibling key.
function reviewEntry(relativePath) {
  const text = read(relativePath);
  const start = text.indexOf('\n  review:\n', text.indexOf('agent_availability:'));
  assert.ok(start >= 0, `${relativePath} has no agent_availability.review entry`);
  const end = text.slice(start + 1).search(/\n {2}[a-z_-]+:\n/u);
  assert.ok(end > 0, `${relativePath} review entry has no end`);
  return text.slice(start, start + 1 + end);
}

test('both speckit review entries state the CODE-REVIEW marker for a step that dispatches @review', () => {
  const blocks = REVIEW_DISPATCH_YAMLS.map((relativePath) => {
    const entry = reviewEntry(relativePath);
    const start = entry.indexOf('    dispatch_prompt:\n');
    assert.ok(start >= 0, `${relativePath} review entry has no dispatch_prompt`);
    const block = entry.slice(start, entry.indexOf('\n    standards_contract:', start));
    assert.ok(block.includes(`marker: "${MARKER}"`), `${relativePath} names a different marker`);
    assert.ok(block.includes('then one blank line'), `${relativePath} lost the blank line after the marker`);
    // agent_availability entries are not instructions, so the block must not claim to dispatch.
    assert.ok(block.includes('This entry dispatches nothing.'), `${relativePath} lost the note that the entry dispatches nothing`);
    return block;
  });
  assert.equal(blocks[1], blocks[0], 'the two review entries state the marker differently');
});

test('both speckit review gates follow severity, not a score', () => {
  for (const relativePath of REVIEW_DISPATCH_YAMLS) {
    const entry = reviewEntry(relativePath);
    assert.match(entry, /verdict: ".*any P0, or an open P1, fails the gate\. The advisory score never blocks\."/u, relativePath);
    assert.doesNotMatch(entry, /threshold/u, `${relativePath} review entry carries a score threshold`);
  }
});

test('@orchestrate adds the marker to a code review dispatch only', () => {
  const orchestrate = read('agents/orchestrate.md');
  const start = orchestrate.indexOf('### Code Review Marker');
  assert.ok(start >= 0, 'orchestrate.md has no Code Review Marker rule');
  const rule = orchestrate.slice(start, orchestrate.indexOf('\n\n', orchestrate.indexOf('\n\n', start) + 2));
  assert.ok(rule.includes(`the line \`${MARKER}\`, then one blank line`), 'the rule lost the marker line');
  assert.ok(rule.includes('Never add it to a `@deep-review` or `@deep-research` dispatch'), 'the rule lost the deep-loop exclusion');
});

test("@orchestrate reads @code's Quality Gate field by the name @code writes it", () => {
  const field = read('agents/code.md').match(/^\*\*Quality Gate:\*\* <GATE> \| p0_blocking=<n> \| unverified=<ids or none>$/mu);
  assert.ok(field, 'code.md no longer writes the Quality Gate field this test pins');
  const orchestrate = read('agents/orchestrate.md');
  assert.ok(orchestrate.includes(`\`${field[0]}\``), "orchestrate.md does not name @code's Quality Gate field");
  for (const gate of ['BLOCKED', 'UNVERIFIED', 'NOTHING_CHECKED', 'ERROR', 'NO_BLOCKER_FOUND']) {
    assert.ok(orchestrate.includes(`| \`${gate}\``), `orchestrate.md has no action for ${gate}`);
  }
});

test("@review's gate is named apart from the quality runner's gate", () => {
  const review = read('agents/review.md');
  assert.ok(review.includes('### Review Gate Protocol'), 'review.md lost its Review Gate Protocol');
  assert.doesNotMatch(review, /Quality Gate Protocol/u, 'review.md reuses the quality runner gate name');
  assert.doesNotMatch(review, /threshold: 70|threshold \(default 70\)/u, 'review.md carries a score threshold');
});
