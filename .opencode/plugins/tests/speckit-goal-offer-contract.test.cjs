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

const OFFER_LINE = 'Session Goal (optional): A) Offer or reference a session goal for this workflow  B) Skip  C) Set goal: <objective>';

const PRESENTATION_FILES = [
  'commands/speckit/assets/speckit-plan-presentation.txt',
  'commands/speckit/assets/speckit-complete-presentation.txt',
  'commands/speckit/assets/speckit-implement-presentation.txt',
  'commands/speckit/assets/speckit-resume-presentation.txt',
];

const WORKFLOW_YAML_FILES = [
  'commands/speckit/assets/speckit-plan-auto.yaml',
  'commands/speckit/assets/speckit-plan-confirm.yaml',
  'commands/speckit/assets/speckit-complete-auto.yaml',
  'commands/speckit/assets/speckit-complete-confirm.yaml',
  'commands/speckit/assets/speckit-implement-auto.yaml',
  'commands/speckit/assets/speckit-implement-confirm.yaml',
  'commands/speckit/assets/speckit-resume-auto.yaml',
  'commands/speckit/assets/speckit-resume-confirm.yaml',
];

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

test('goal_prompt_choice is confined to the eight workflow YAML assets', () => {
  const actual = listFiles(SPECKIT_ROOT)
    .filter((absolute) => readFileSync(absolute, 'utf8').includes('goal_prompt_choice'))
    .map((absolute) => relative(OPENCODE_ROOT, absolute))
    .sort();

  assert.deepEqual(actual, [...WORKFLOW_YAML_FILES].sort());
});

test('router allowed-tools expose the expected goal tools only', () => {
  for (const relativePath of [
    'commands/speckit/plan.md',
    'commands/speckit/complete.md',
    'commands/speckit/implement.md',
  ]) {
    const line = allowedToolsLine(relativePath);
    assert.equal(hasBareTool(line, 'mk_goal'), true, `${relativePath} must allow mk_goal`);
    assert.equal(hasBareTool(line, 'mk_goal_status'), true, `${relativePath} must allow mk_goal_status`);
  }

  const resumeLine = allowedToolsLine('commands/speckit/resume.md');
  assert.equal(hasBareTool(resumeLine, 'mk_goal_status'), true, 'resume.md must allow mk_goal_status');
  assert.equal(hasBareTool(resumeLine, 'mk_goal'), false, 'resume.md must not allow bare mk_goal');
});

test('touched command files do not contain the stale goal command filename', () => {
  for (const relativePath of TOUCHED_FILES) {
    assert.equal(read(relativePath).includes('goal.md'), false, `${relativePath} contains stale goal.md`);
  }
});
