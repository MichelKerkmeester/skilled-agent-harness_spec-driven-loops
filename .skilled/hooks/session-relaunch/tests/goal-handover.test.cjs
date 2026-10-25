// ───────────────────────────────────────────────────────────────────
// MODULE: Goal Hand-over Slice Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { renderGoalSlice, GOAL_SLICE_LIMIT } = require('../lib/goal-handover.cjs');

const GOAL_CLI = path.resolve(__dirname, '../../goal/bin/goal.cjs');
const PACKET = 'specs/demo/001-demo';
const BUDGET_MANIFEST = path.join(
  '.skilled', 'skills', 'system-spec-kit', 'templates', 'spec-kit-docs.json',
);

// A checkout with the one file the budget check reads, so a slice's state is the real core's.
function createWorkspace(t, { budget = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-goal-'));
  fs.mkdirSync(path.join(root, '.git'));
  if (budget) {
    fs.mkdirSync(path.dirname(path.join(root, BUDGET_MANIFEST)), { recursive: true });
    fs.writeFileSync(
      path.join(root, BUDGET_MANIFEST),
      JSON.stringify({ goalDurableBudget: { errorChars: 4000 } }),
    );
  }
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function writeGoal(root, text, packet = PACKET) {
  fs.mkdirSync(path.join(root, packet), { recursive: true });
  fs.writeFileSync(path.join(root, packet, 'goal.md'), text);
}

function goalWithBody(body) {
  return `---\ntitle: "Goal: Demo"\nstatus: active\n---\n${body}`;
}

// A body whose durable slice has exactly this many characters.
function bodyOfLength(length) {
  const heading = '# Goal: Demo\n\n';
  return heading + 'x'.repeat(length - heading.length);
}

function printedChatSlice(root, packet = PACKET) {
  const result = spawnSync(process.execPath, [GOAL_CLI, 'packet', packet, '--workspace', root], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  const line = result.stdout.split('\n').find((entry) => entry.startsWith('chat_slice='));
  return JSON.parse(line.slice('chat_slice='.length));
}

// A stand-in for the goal command that prints canned text and records that it ran.
function installStubCli(t, source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-goal-stub-'));
  const marker = path.join(dir, 'ran');
  const cliPath = path.join(dir, 'goal.cjs');
  fs.writeFileSync(
    cliPath,
    `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');\n${source}\n`,
  );
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return { cliPath, ran: () => fs.existsSync(marker) };
}

function cannedPacket({ budget = 'ok', slice }) {
  return [
    'STATUS=OK ACTION=packet',
    `packet_path=${JSON.stringify(PACKET)}`,
    `packet_budget=${budget}`,
    `chat_slice=${JSON.stringify(slice)}`,
    '',
  ].join('\n');
}

function stubPrinting(t, output) {
  return installStubCli(t, `process.stdout.write(${JSON.stringify(output)});`);
}

function assertRefusal(result, pattern) {
  assert.equal(result.ok, false);
  assert.match(result.reason, pattern);
  assert.ok(!result.reason.includes('\n'), 'the reason is one line');
}

test('renders exactly the chat slice the goal command prints, without frontmatter or comments', (t) => {
  const root = createWorkspace(t);
  writeGoal(root, goalWithBody(
    '<!-- ANCHOR:goal -->\n# Goal: Demo\n\n## 1. Objective\n\nShip the demo.\n<!-- /ANCHOR:goal -->\n'
    + '<!-- ANCHOR:log -->\nlog row\n',
  ));

  const result = renderGoalSlice({ packet: PACKET, roots: [root] });

  assert.equal(result.ok, true, result.reason);
  assert.equal(result.slice, printedChatSlice(root));
  assert.ok(result.slice.startsWith('# Goal: Demo'));
  assert.ok(!result.slice.includes('title:'));
  assert.ok(!result.slice.includes('<!--'));
  assert.ok(!result.slice.includes('log row'));
});

test('sends a slice of exactly 4000 characters and refuses 4001', (t) => {
  const root = createWorkspace(t);

  writeGoal(root, goalWithBody(bodyOfLength(GOAL_SLICE_LIMIT)));
  const atLimit = renderGoalSlice({ packet: PACKET, roots: [root] });
  assert.equal(atLimit.ok, true, atLimit.reason);
  assert.equal(atLimit.slice.length, GOAL_SLICE_LIMIT);

  writeGoal(root, goalWithBody(bodyOfLength(GOAL_SLICE_LIMIT + 1)));
  assertRefusal(renderGoalSlice({ packet: PACKET, roots: [root] }), /over the 4000-character limit/);
});

test('refuses a slice whose budget cannot be checked', (t) => {
  const root = createWorkspace(t, { budget: false });
  writeGoal(root, goalWithBody('# Goal: Demo\n\nShip the demo.\n'));

  assertRefusal(renderGoalSlice({ packet: PACKET, roots: [root] }), /budget/);
});

test('refuses a goal.md with no durable slice, and a packet with no goal.md', (t) => {
  const root = createWorkspace(t);
  writeGoal(root, goalWithBody('<!-- ANCHOR:log -->\nlog row\n'));
  assertRefusal(renderGoalSlice({ packet: PACKET, roots: [root] }), /no durable slice/);

  fs.rmSync(path.join(root, PACKET, 'goal.md'));
  assertRefusal(renderGoalSlice({ packet: PACKET, roots: [root] }), /holds no goal\.md/);
});

test('refuses a packet path that is not a repo-relative packet before any command runs', (t) => {
  const root = createWorkspace(t);
  const outside = createWorkspace(t);
  writeGoal(outside, goalWithBody('# Goal: Outside\n'), 'specs/outside/001-outside');
  fs.mkdirSync(path.join(root, 'specs', 'demo'), { recursive: true });
  fs.symlinkSync(
    path.join(outside, 'specs', 'outside', '001-outside'),
    path.join(root, 'specs', 'demo', '002-link'),
  );
  const stub = stubPrinting(t, cannedPacket({ slice: '# Goal: Demo' }));

  for (const packet of [
    '',
    '../escape',
    'specs/../escape',
    `/${PACKET}`,
    path.join(root, PACKET),
    `${PACKET}\n--workspace`,
    'specs/demo/002-link',
  ]) {
    const result = renderGoalSlice({ packet, roots: [root], goalCli: stub.cliPath });
    assertRefusal(result, /goal_packet/);
  }
  assert.equal(stub.ran(), false, 'a refused packet never reaches the goal command');
});

test('finds a packet that only the working directory holds', (t) => {
  const repoRoot = createWorkspace(t);
  const worktree = createWorkspace(t);
  writeGoal(worktree, goalWithBody('# Goal: Worktree\n\nShip it.\n'));

  const result = renderGoalSlice({ packet: PACKET, roots: [repoRoot, worktree] });

  assert.equal(result.ok, true, result.reason);
  assert.equal(result.slice, printedChatSlice(worktree));
});

test('refuses output that is not a usable slice, one line each', (t) => {
  const root = createWorkspace(t);
  writeGoal(root, goalWithBody('# Goal: Demo\n'));
  const cases = [
    ['frontmatter in the slice', cannedPacket({ slice: '---\ntitle: Demo\n---\n# Goal: Demo' }), /frontmatter or markup/],
    ['a comment in the slice', cannedPacket({ slice: '# Goal <!-- ANCHOR:goal -->' }), /frontmatter or markup/],
    ['an empty slice', cannedPacket({ slice: '  \n' }), /no durable slice/],
    ['a slice over the limit under an ok budget', cannedPacket({ slice: 'x'.repeat(GOAL_SLICE_LIMIT + 1) }), /over the 4000-character limit/],
    ['a NUL byte in the slice', cannedPacket({ slice: 'a\u0000b' }), /control character/],
    ['a budget that is not ok', cannedPacket({ budget: 'over', slice: '# Goal' }), /over the 4000-character limit/],
    ['no chat_slice line', 'STATUS=OK ACTION=packet\npacket_budget=ok\n', /did not print a slice/],
    ['an unparseable chat_slice', 'STATUS=OK ACTION=packet\npacket_budget=ok\nchat_slice=not json\n', /did not print a slice/],
    ['a failed status', 'STATUS=FAIL ACTION=packet\n', /could not render/],
  ];

  for (const [label, output, pattern] of cases) {
    const stub = stubPrinting(t, output);
    const result = renderGoalSlice({ packet: PACKET, roots: [root], goalCli: stub.cliPath });
    assert.equal(result.ok, false, label);
    assert.match(result.reason, pattern, label);
    assert.ok(!result.reason.includes('\n'), `${label}: one line`);
  }
});

test('a goal command that exits non-zero or is missing is a reason, never a throw', (t) => {
  const root = createWorkspace(t);
  writeGoal(root, goalWithBody('# Goal: Demo\n'));
  const failing = installStubCli(t, "process.stderr.write('boom\\nsecond line'); process.exit(2);");

  assertRefusal(
    renderGoalSlice({ packet: PACKET, roots: [root], goalCli: failing.cliPath }),
    /could not render/,
  );
  assertRefusal(
    renderGoalSlice({ packet: PACKET, roots: [root], goalCli: path.join(root, 'missing.cjs') }),
    /could not render/,
  );
});
