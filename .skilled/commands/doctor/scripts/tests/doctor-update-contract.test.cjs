#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Update Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND TEXT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const COMMAND_ROOT = path.resolve(__dirname, '../..');
const ASSET_ROOT = path.join(COMMAND_ROOT, 'assets');
const ENGINE = fs.readFileSync(path.join(COMMAND_ROOT, 'scripts', 'release-update.cjs'), 'utf8');
const ROUTER = fs.readFileSync(path.join(COMMAND_ROOT, 'update.md'), 'utf8');
const CHECK_WORKFLOW = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-check.yaml'), 'utf8',
);
const ALIGN_WORKFLOW = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-align.yaml'), 'utf8',
);
const APPLY_WORKFLOW = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-apply.yaml'), 'utf8',
);
const ROLLBACK_WORKFLOW = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-rollback.yaml'), 'utf8',
);
const RECORD_BASE_WORKFLOW = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-record-base.yaml'), 'utf8',
);
const PRESENTATION = fs.readFileSync(
  path.join(ASSET_ROOT, 'doctor-update-presentation.txt'), 'utf8',
);
const COMMAND_CONTRACT = JSON.parse(fs.readFileSync(
  path.resolve(COMMAND_ROOT, '../../skills/sk-doc/sk-create-command/assets/command-contract.json'),
  'utf8',
));
const DOCTOR_CONTRACT = COMMAND_CONTRACT.families.doctor;

function workflowPath(action) {
  // The compat workflow file is named for what it does, not for the action token.
  const workflowFiles = { compat: 'doctor-update-compat-action.yaml' };
  return path.join(ASSET_ROOT, workflowFiles[action] || 'doctor-update-' + action + '.yaml');
}

function blockAfterKey(source, key) {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.trim() === key + ':');
  if (start < 0) return '';
  const indent = lines[start].search(/\S|$/);
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (!lines[index].trim()) continue;
    const lineIndent = lines[index].search(/\S|$/);
    if (lineIndent <= indent && /^[\w-]+:/.test(lines[index].slice(lineIndent))) {
      end = index;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

function actionRoutes(source) {
  return [...source.matchAll(/^- \x60([a-z-]+)\x60 accepts ([^\n]+)$/gm)]
    .map((match) => ({ action: match[1], accepted: match[2] }));
}

function inputKey(flag) {
  return flag.slice(2).split('=')[0].replace(/-/g, '_');
}

function sectionAfterHeading(source, heading) {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start < 0) return '';
  const end = lines.findIndex((line, index) => index > start && /^##\s/.test(line));
  return lines.slice(start, end < 0 ? lines.length : end).join('\n');
}

function generatorScripts(source) {
  const definitions = source.match(/const [A-Z_]+_GENERATOR\s*=[\s\S]*?;/g) || [];
  return definitions.flatMap((definition) => (
    [...definition.matchAll(/node\s+(\.skilled\/[\w./-]+\.(?:cjs|mjs))/g)]
      .map((match) => match[1])
  ));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTED INPUTS AND ENGINE VOCABULARY
// ─────────────────────────────────────────────────────────────────────────────

test('every routed flag is a declared input of its action\'s workflow', () => {
  for (const { action, accepted } of actionRoutes(ROUTER)) {
    const workflow = fs.readFileSync(workflowPath(action), 'utf8');
    const inputs = blockAfterKey(workflow, 'user_inputs');
    for (const flag of accepted.match(/--[a-z-]+/g) || []) {
      const key = inputKey(flag);
      assert.match(inputs, new RegExp('^\\s+' + key + ':', 'm'));
    }
  }
});

test('workflow and presentation vocabulary matches the engine', () => {
  for (const value of [
    'known', 'unknown', 'at-release', 'ahead', 'behind', 'current',
    'updates-available', 'blocked', 'downgrade',
  ]) {
    assert.ok(ENGINE.includes("'" + value + "'") || ENGINE.includes('"' + value + '"'));
  }
  const upstream = CHECK_WORKFLOW.split('\n')
    .find((line) => line.trim().startsWith('upstream_status:'));
  assert.match(upstream, /known\|unknown/);
  assert.doesNotMatch(upstream, /available/);
  const mapping = blockAfterKey(CHECK_WORKFLOW, 'report_status_mapping');
  assert.ok(/blocked:[\s\S]{0,120}STATUS=UNKNOWN/.test(mapping));
  const position = PRESENTATION.split('\n')
    .find((line) => line.startsWith('Release position:'));
  assert.match(position, /at-release/);
  assert.doesNotMatch(position, /even/);
});

test('every write action records cancellation as CANCELLED', () => {
  for (const workflow of [APPLY_WORKFLOW, ROLLBACK_WORKFLOW, RECORD_BASE_WORKFLOW]) {
    assert.ok(workflow.includes('STATUS=CANCELLED'));
  }
  assert.ok(PRESENTATION.includes('STATUS=CANCELLED ACTION=cancelled'));
});

test('align and apply state the same dry-run rule', () => {
  for (const workflow of [ALIGN_WORKFLOW, APPLY_WORKFLOW]) {
    assert.ok(/dry_run_writes:\s*none/.test(workflow));
    assert.doesNotMatch(workflow, /dry_run_writes_nothing/);
  }
  assert.ok(APPLY_WORKFLOW.includes('A dry run writes no state log.'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ROUTER AND PRESENTATION CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('the router hint is within budget and matches the command contract', () => {
  const match = ROUTER.match(/^argument-hint:\s*"(.*)"$/m);
  assert.ok(match);
  assert.ok(match[1].length <= 140);
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(match[1] + ' (update)'));
});

test('the router carries no next-step wording or overclaim', () => {
  assert.ok(!/release-update\.cjs record-base/.test(ROUTER));
  assert.ok(!/\bcommit\b/i.test(ROUTER));
  assert.ok(!/instead of writing them/.test(ROUTER));
  assert.ok(ROUTER.includes('read-only for the checkout'));
});

test('the presentation discloses the release fetch next to --offline', () => {
  const checkSection = sectionAfterHeading(PRESENTATION, '## 1. Action and Flag Errors');
  assert.ok(checkSection.includes('| check |') && checkSection.includes('--offline'));
  assert.ok(checkSection.includes('fetch release commits'));
});

test('the router grants only Read and Bash', () => {
  const tools = ROUTER.split('\n').find((line) => line.startsWith('allowed-tools:'));
  assert.equal(tools, 'allowed-tools: Read, Bash');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. WRITE ACTIONS AND POST-APPLY CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('every engine write command has a routed action with an approval gate', () => {
  const actions = ['apply', 'rollback', 'record-base'];
  const routed = actionRoutes(ROUTER).map((entry) => entry.action);
  for (const action of actions) {
    const workflow = fs.readFileSync(workflowPath(action), 'utf8');
    assert.ok(routed.includes(action));
    assert.match(workflow, /^\s{2}phase_[0-9]+_[a-z_]*approval:\s*$/m);
    assert.ok(DOCTOR_CONTRACT.execution_targets.some((entry) => (
      entry.target.endsWith('doctor-update-' + action + '.yaml')
    )));
  }
});

test('every generator the engine names has a post-apply battery step', () => {
  const scripts = generatorScripts(ENGINE);
  assert.ok(scripts.length > 0);
  const battery = blockAfterKey(APPLY_WORKFLOW, 'phase_5_post_apply_battery');
  for (const script of scripts) assert.ok(battery.includes(script));
});

test('the apply result tells the operator to commit the release records', () => {
  assert.ok(PRESENTATION.includes('Commit the applied files'));
});

test('the lock template routes stale locks to rollback', () => {
  assert.ok(PRESENTATION.includes('Run /doctor:update rollback to clear the lock'));
});
