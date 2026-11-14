// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: SpecKit Goal Offer Contract Tests                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the Speckit command goal-offer surfaces against drift.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { readdirSync, readFileSync, statSync } = require('node:fs');
const { join, relative } = require('node:path');
const test = require('node:test');

const OPENCODE_ROOT = join(__dirname, '..', '..');
const SPECKIT_ROOT = join(OPENCODE_ROOT, 'commands', 'speckit');

const OFFER_LINE = 'Session Goal (optional): A) Offer or reference a session goal for this workflow  B) Set goal: <objective>  C) Skip';

const PRESENTATION_FILES = [
  'commands/speckit/assets/speckit-plan-presentation.txt',
  'commands/speckit/assets/speckit-complete-presentation.txt',
  'commands/speckit/assets/speckit-implement-presentation.txt',
  'commands/speckit/assets/speckit-resume-presentation.txt',
];

const WORKFLOW_YAML_FILES = [
  'commands/speckit/assets/speckit-plan.yaml',
  'commands/speckit/assets/speckit-complete.yaml',
  'commands/speckit/assets/speckit-implement.yaml',
  'commands/speckit/assets/speckit-resume.yaml',
];

// The lifecycle workflows point at this include for the blocks they share.
const LIFECYCLE_SHARED = 'commands/speckit/assets/speckit-lifecycle-shared.yaml';

const ROUTER_FILES = [
  'commands/speckit/plan.md',
  'commands/speckit/complete.md',
  'commands/speckit/implement.md',
  'commands/speckit/resume.md',
];

const TOUCHED_FILES = [
  ...PRESENTATION_FILES,
  ...WORKFLOW_YAML_FILES,
  ...ROUTER_FILES,
];

function read(relativePath) {
  return readFileSync(join(OPENCODE_ROOT, relativePath), 'utf8');
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) return listFiles(absolute);
    return [absolute];
  });
}

function allowedToolsLine(relativePath) {
  const line = read(relativePath).split(/\r?\n/u).find((entry) => entry.startsWith('allowed-tools:'));
  assert.ok(line, `${relativePath} must have an allowed-tools line`);
  return line;
}

function hasBareTool(line, toolName) {
  return new RegExp(`(^|,\\s*)${toolName}(?=,|$)`, 'u').test(line.replace('allowed-tools:', '').trim());
}

test('goal offer text is present in all presentation contracts', () => {
  for (const relativePath of PRESENTATION_FILES) {
    assert.match(read(relativePath), new RegExp(OFFER_LINE.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'u'), relativePath);
  }
});

test('goal_prompt_choice is confined to the workflow YAML assets and their shared include', () => {
  const actual = listFiles(SPECKIT_ROOT)
    .filter((absolute) => readFileSync(absolute, 'utf8').includes('goal_prompt_choice'))
    .map((absolute) => relative(OPENCODE_ROOT, absolute))
    .sort();

  assert.deepEqual(actual, [...WORKFLOW_YAML_FILES, LIFECYCLE_SHARED].sort());
});

test('router allowed-tools expose the expected goal tools only', () => {
  for (const relativePath of [
    'commands/speckit/plan.md',
    'commands/speckit/complete.md',
    'commands/speckit/implement.md',
  ]) {
    const line = allowedToolsLine(relativePath);
    assert.equal(hasBareTool(line, 'opencode_goal'), true, `${relativePath} must allow opencode_goal`);
    assert.equal(hasBareTool(line, 'opencode_goal_status'), true, `${relativePath} must allow opencode_goal_status`);
  }

  const resumeLine = allowedToolsLine('commands/speckit/resume.md');
  assert.equal(hasBareTool(resumeLine, 'opencode_goal_status'), true, 'resume.md must allow opencode_goal_status');
  assert.equal(hasBareTool(resumeLine, 'opencode_goal'), false, 'resume.md must not allow bare opencode_goal');
});

test('touched command files do not contain the stale goal command filename', () => {
  // The goal command was renamed, and this guards against a reference to the old
  // file. It matches the command PATH rather than the bare basename: a spec-folder
  // document is also named goal.md, and a bare match would forbid naming it.
  const staleCommandRef = /(?:^|[\s(`'"\/])commands\/goal\.md|(?:^|[\s(`'"])\.?\/goal\.md/u;
  for (const relativePath of TOUCHED_FILES) {
    assert.equal(
      staleCommandRef.test(read(relativePath)),
      false,
      `${relativePath} references the stale goal command file`,
    );
  }
});

// The three lifecycle workflows share one goal contract. It lives once, in the
// shared include, because three copies had already drifted: a runtime that
// learns the rule from one workflow and meets a different rule in the next
// has no way to tell which is current.
test('the goal contract lives once in the shared include and each lifecycle workflow points at it', () => {
  const FILES = [
    'commands/speckit/assets/speckit-plan.yaml',
    'commands/speckit/assets/speckit-implement.yaml',
    'commands/speckit/assets/speckit-complete.yaml',
  ];
  const shared = read(LIFECYCLE_SHARED);
  assert.equal(shared.split('\n  packet_goal:\n').length - 1, 1, 'the include must hold packet_goal exactly once');
  const start = shared.indexOf('  packet_goal:\n');
  const end = shared.indexOf('  status_tool_by_runtime:', start);
  assert.ok(end > start, 'the include has no status_tool_by_runtime after packet_goal');
  const block = shared.slice(start, end);
  // The block is the goal contract, so these load-bearing keys must be in it.
  for (const key of ['nesting:', 'bind_by_runtime:', 'resend:', 'reminder:', 'log:', 'without_a_session:']) {
    assert.ok(block.includes(key), `the shared block lost ${key}`);
  }
  for (const relPath of FILES) {
    const text = read(relPath);
    assert.equal(text.includes('  packet_goal:\n'), false, `${relPath} still carries its own packet_goal block`);
    assert.ok(
      text.includes('goal_prompting:\n  shared_tail: "assets/speckit-lifecycle-shared.yaml#goal_prompting"\n'),
      `${relPath} must point goal_prompting at the shared include`,
    );
  }
});
