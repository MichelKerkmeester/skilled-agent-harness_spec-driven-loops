// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ goal-slice tests — frontmatter never leaves the file, slices are stable  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const slice = require('./goal-slice.cjs');

let workspace;

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), 'goal-slice-test-'));
  mkdirSync(join(workspace, '.git'));
});

afterEach(() => {
  rmSync(workspace, { recursive: true, force: true });
});

function goalDoc({ nested = false, criteria = ['validate.sh passes', 'tests pass'], log = '| Item | State | Evidence |\n|---|---|---|\n| scaffolded | Done | file |' } = {}) {
  const binding = nested
    ? '<!-- ANCHOR:binding -->\n## 2. BINDING\n| Phase | Goal document |\n|---|---|\n| 001-a | `001-a/goal.md` |\n<!-- /ANCHOR:binding -->\n\n'
    : '';
  return [
    '---',
    'title: "Goal: fixture"',
    '_memory:',
    '  continuity:',
    '    session_dedup:',
    '      fingerprint: "sha256:SECRET-FINGERPRINT"',
    '      session_id: "SECRET-SESSION"',
    '---',
    '# Goal: fixture',
    '',
    '<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->',
    '<!-- ANCHOR:directive -->',
    '## 1. DURABLE DIRECTIVE',
    '**Objective:** Ship the fixture.',
    '<!-- /ANCHOR:directive -->',
    '',
    binding + '<!-- ANCHOR:completion -->',
    '## 3. COMPLETION CRITERIA',
    ...criteria.map((c) => `- [ ] ${c}`),
    '<!-- /ANCHOR:completion -->',
    '',
    '<!-- ANCHOR:log -->',
    '## 4. LOG',
    log,
    '<!-- /ANCHOR:log -->',
    '',
  ].join('\n');
}

function writePacket(rel, content) {
  const dir = join(workspace, rel);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'goal.md'), content, 'utf8');
  return dir;
}

test('no projection carries the frontmatter', () => {
  writePacket('specs/x/001-fixture', goalDoc());
  const packet = slice.readPacketGoal(workspace, 'specs/x/001-fixture');
  for (const field of ['durableSlice', 'chatSlice', 'objectiveSlice']) {
    assert.ok(!packet[field].includes('SECRET'), `${field} leaked frontmatter`);
    assert.ok(!packet[field].startsWith('---'), `${field} starts with a fence`);
  }
});

test('the durable slice stops at the log anchor and the chat slice drops markup', () => {
  writePacket('specs/x/001-fixture', goalDoc());
  const packet = slice.readPacketGoal(workspace, 'specs/x/001-fixture');
  assert.ok(!packet.durableSlice.includes('## 4. LOG'));
  assert.ok(!packet.chatSlice.includes('<!--'));
  assert.ok(packet.chatSlice.includes('## 1. DURABLE DIRECTIVE'));
});

test('a nested packet gets the binding sentence and a singular one does not', () => {
  writePacket('specs/x/parent', goalDoc({ nested: true }));
  writePacket('specs/x/single', goalDoc({ nested: false }));
  const parent = slice.readPacketGoal(workspace, 'specs/x/parent');
  const single = slice.readPacketGoal(workspace, 'specs/x/single');
  assert.equal(parent.nested, true);
  assert.ok(parent.objectiveSlice.includes('BINDING:'));
  assert.equal(single.nested, false);
  assert.ok(!single.objectiveSlice.includes('BINDING:'));
  assert.ok(parent.objectiveSlice.startsWith('Execute specs/x/parent/goal.md.'));
  assert.ok(parent.objectiveSlice.includes('- validate.sh passes'));
});

test('the slice hash ignores log edits and reflow but not a criterion change', () => {
  const base = goalDoc();
  const logEdited = goalDoc({ log: '| Item | State | Evidence |\n|---|---|---|\n| scaffolded | Done | file |\n| built | Done | tests |' });
  const reflowed = base.replace('**Objective:** Ship the fixture.', '**Objective:**   Ship the fixture.\n');
  const changed = goalDoc({ criteria: ['validate.sh passes', 'docs updated'] });
  assert.equal(slice.durableSliceHash(base), slice.durableSliceHash(logEdited));
  assert.equal(slice.durableSliceHash(base), slice.durableSliceHash(reflowed));
  assert.notEqual(slice.durableSliceHash(base), slice.durableSliceHash(changed));
});

test('paths outside the workspace and missing documents read as unbound', () => {
  writePacket('specs/x/001-fixture', goalDoc());
  assert.equal(slice.readPacketGoal(workspace, '../elsewhere'), null);
  assert.equal(slice.readPacketGoal(workspace, '/etc'), null);
  assert.equal(slice.readPacketGoal(workspace, 'specs/x/never-authored'), null);
  assert.ok(slice.readPacketGoal(workspace, 'specs/x/001-fixture'));
});


test('a fence with trailing whitespace still hides the frontmatter, and an unclosed opener yields no slice', () => {
  const tolerant = goalDoc().replace('---\ntitle', '---  \ntitle');
  assert.ok(!slice.extractDurableSlice(tolerant).includes('SECRET'));
  const unclosed = '---\ntitle: "x"\nsession_id: "SECRET"\n# Goal\n<!-- ANCHOR:log -->\n';
  assert.equal(slice.extractDurableSlice(unclosed), '');
  assert.equal(slice.renderChatSlice(unclosed), '');
  writePacket('specs/x/broken', unclosed);
  assert.equal(slice.readPacketGoal(workspace, 'specs/x/broken'), null);
});

test('a symlinked packet that resolves outside the workspace reads as unbound', () => {
  const { symlinkSync } = require('node:fs');
  const outside = mkdtempSync(join(tmpdir(), 'goal-slice-outside-'));
  try {
    writeFileSync(join(outside, 'goal.md'), goalDoc(), 'utf8');
    mkdirSync(join(workspace, 'specs'), { recursive: true });
    symlinkSync(outside, join(workspace, 'specs', 'escape'));
    assert.equal(slice.readPacketGoal(workspace, 'specs/escape'), null);
    writePacket('specs/x/inside', goalDoc());
    symlinkSync(join(workspace, 'specs', 'x', 'inside'), join(workspace, 'specs', 'alias'));
    assert.ok(slice.readPacketGoal(workspace, 'specs/alias'));
  } finally {
    rmSync(outside, { recursive: true, force: true });
  }
});

test('a CR-only document still hides its frontmatter', () => {
  const crOnly = goalDoc().replace(/\n/g, '\r');
  assert.ok(!slice.extractDurableSlice(crOnly).includes('SECRET'));
  assert.ok(slice.renderChatSlice(crOnly).includes('## 1. DURABLE DIRECTIVE'));
});

test('the projection carries the packet real path and no file handle fields', () => {
  writePacket('specs/x/001-fixture', goalDoc());
  const packet = slice.readPacketGoal(workspace, 'specs/x/001-fixture');
  assert.equal(packet.packetRealPath, require('node:fs').realpathSync(join(workspace, 'specs', 'x', '001-fixture')));
  assert.equal(packet.content, undefined);
  assert.equal(packet.mtimeMs, undefined);
});

test('the reminder names the runtime command that records the resend', () => {
  const generic = slice.renderResendReminderText('specs/x/p');
  const pi = slice.renderResendReminderText('specs/x/p', { recordCommand: '/goal-pi resent' });
  assert.ok(generic.includes("goal command's resent action"));
  assert.ok(pi.includes('record it with: /goal-pi resent'));
  assert.ok(!pi.includes('ask the operator to set it'));
});

test('resolveWorkspaceRoot walks up from a subdirectory to the repository root', () => {
  mkdirSync(join(workspace, 'a', 'b'), { recursive: true });
  assert.equal(slice.resolveWorkspaceRoot(join(workspace, 'a', 'b')), require('node:path').resolve(workspace));
});

test('an objective splits into the packet sentence and whole criteria', () => {
  writePacket('specs/x/001-split', goalDoc({ nested: true, criteria: ['alpha holds', 'beta holds'] }));
  const packet = slice.readPacketGoal(workspace, 'specs/x/001-split');
  const split = slice.splitObjectiveSlice(packet.objectiveSlice);
  assert.ok(split.headline.startsWith('Execute specs/x/001-split/goal.md.'));
  assert.ok(split.headline.includes('BINDING:'));
  assert.deepEqual(split.criteria, ['alpha holds', 'beta holds']);
  assert.ok(!split.headline.includes('DONE WHEN'));
});

test('a plain objective with no criteria heading stays whole', () => {
  const split = slice.splitObjectiveSlice('Ship the thing and prove it');
  assert.equal(split.headline, 'Ship the thing and prove it');
  assert.deepEqual(split.criteria, []);
});

test('a criteria budget drops whole items and counts what it left', () => {
  const criteria = ['alpha', 'beta', 'gamma'];
  const fits = slice.selectCriteriaWithin(criteria, 1000);
  assert.deepEqual(fits.shown, criteria);
  assert.equal(fits.omitted, 0);

  // 'alpha' costs 5 + 3 for the '- ' and newline; 'beta' would take it past 10.
  const trimmed = slice.selectCriteriaWithin(criteria, 10);
  assert.deepEqual(trimmed.shown, ['alpha']);
  assert.equal(trimmed.omitted, 2);

  const none = slice.selectCriteriaWithin(criteria, 0);
  assert.deepEqual(none.shown, []);
  assert.equal(none.omitted, 3);
});

test('a phase child goal carries no budget, matching the validator', () => {
  const manifestDir = join(workspace, '.opencode', 'skills', 'system-spec-kit', 'templates');
  mkdirSync(manifestDir, { recursive: true });
  writeFileSync(
    join(manifestDir, 'spec-kit-docs.json'),
    JSON.stringify({ goalDurableBudget: { warnChars: 3000, errorChars: 4000 } }),
    'utf8',
  );

  // A top-level packet is budgeted.
  writePacket('specs/x/001-parent', goalDoc());
  const parent = slice.readPacketGoal(workspace, 'specs/x/001-parent');
  assert.notEqual(parent.budget, null);
  assert.equal(parent.budgetState, 'ok');

  // A child inside a packet binds through its parent, so no budget applies.
  writeFileSync(join(workspace, 'specs', 'x', '001-parent', 'spec.md'), '# parent\n', 'utf8');
  writePacket('specs/x/001-parent/002-child', goalDoc());
  const child = slice.readPacketGoal(workspace, 'specs/x/001-parent/002-child');
  assert.equal(child.budget, null);
  assert.equal(child.budgetState, 'unknown');
});
