#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor CI Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Holds the /doctor:ci command together: the three routes in the manifest, the
// router, the presentation contract and the three workflow assets must agree on
// targets, mutation classes, template paths and refusal wording. The route
// validator checks structure; this suite checks the safety promises that no
// validator reads, such as the refusal strings and the six documented names.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const DOCTOR = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(DOCTOR, '..', '..', '..');
const ASSETS = path.join(DOCTOR, 'assets');

const read = (file) => fs.readFileSync(file, 'utf8');
const asset = (name) => read(path.join(ASSETS, name));

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:ci');
const route = (target) => ROUTES.find((candidate) => candidate.target === target);

const ROUTER = read(path.join(DOCTOR, 'ci.md'));
const PRESENTATION = asset('doctor-ci-presentation.txt');
const REPORT_YAML = asset('doctor-ci-report.yaml');
const SCAFFOLD_YAML = asset('doctor-ci-scaffold.yaml');
const TOGGLE_YAML = asset('doctor-ci-toggle.yaml');
const WORKFLOWS_README = read(path.join(REPO_ROOT, '.github', 'workflows', 'README.md'));

const TARGETS = ['report', 'scaffold', 'toggle'];
const SWITCH_VARIABLES = [
  'SKILLED_CI',
  'SKILLED_CI_TESTS',
  'SKILLED_CI_REPORTS',
  'SKILLED_CI_REVIEW',
  'SKILLED_CI_FRESHNESS',
  'SKILLED_CI_MESSAGES',
];
const PROHIBITION = 'SKILLED_CI_MESSAGES must stay unset';

// The toggle either runs the command after a yes or only prints it. Both shapes
// are valid, and each has to be consistent from the manifest down to the asset.
const VALID_CLASSES = {
  report: ['read-only'],
  scaffold: ['mutates'],
  toggle: ['mutates', 'read-only'],
};

// Every file the command ships under the doctor folder.
const SHIPPED_FILES = [
  path.join(DOCTOR, 'ci.md'),
  path.join(ASSETS, 'doctor-ci-presentation.txt'),
  path.join(ASSETS, 'doctor-ci-report.yaml'),
  path.join(ASSETS, 'doctor-ci-scaffold.yaml'),
  path.join(ASSETS, 'doctor-ci-toggle.yaml'),
  path.join(DOCTOR, 'scripts', 'ci-report.cjs'),
  path.join(DOCTOR, 'scripts', 'tests', 'ci-report.test.cjs'),
  path.join(DOCTOR, 'scripts', 'tests', 'doctor-ci-contract.test.cjs'),
];
const EPHEMERAL_ID = [/\bR[0-9]{2}\b/, /\bD[0-9]{1,2}\b/, /[Pp]hase 0[0-9]/];

// ─────────────────────────────────────────────────────────────────────────────
// 2. ROUTES
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds exactly the report, scaffold and toggle routes', () => {
  assert.deepEqual(ROUTES.map((candidate) => candidate.target), TARGETS);
  for (const candidate of ROUTES) {
    assert.equal(candidate.yaml, `doctor-ci-${candidate.target}.yaml`);
  }
});

test('each route carries a mutation class its target may have', () => {
  for (const target of TARGETS) {
    assert.ok(VALID_CLASSES[target].includes(route(target).mutating), `${target}: ${route(target).mutating}`);
  }
});

test('the toggle workflow and its route agree on whether the command runs', () => {
  const toggle = route('toggle');
  const boundaries = parseYaml(TOGGLE_YAML).mutation_boundaries;
  if (toggle.mutating === 'mutates') {
    assert.equal(boundaries.read_only, false);
    assert.doesNotMatch(toggle.gate3_location, /^n\/a/);
    assert.match(toggle.gate3_location, /explicit yes/);
    assert.match(TOGGLE_YAML, /Run exactly the printed gh variable command/);
  } else {
    assert.equal(boundaries.read_only, true);
    assert.match(toggle.gate3_location, /^n\/a/);
    assert.match(TOGGLE_YAML, /this route writes nothing/);
  }
});

test('every trigger phrase has three or more words and every route declares its tool surface', () => {
  for (const candidate of ROUTES) {
    assert.ok(candidate.trigger_phrases.length > 0, `${candidate.target}: no phrases`);
    for (const phrase of candidate.trigger_phrases) {
      assert.ok(phrase.trim().split(/\s+/).length >= 3, `${candidate.target}: "${phrase}"`);
    }
    assert.ok(Array.isArray(candidate.mcp_tools), `${candidate.target}: mcp_tools`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTER AND PRESENTATION
// ─────────────────────────────────────────────────────────────────────────────

test('the router carries the skill tag and one workflow row per target', () => {
  assert.equal(ROUTER.split('<!-- skill_agent: sk-code -->').length - 1, 1);
  for (const target of TARGETS) {
    assert.match(ROUTER, new RegExp(`^\\| \`${target}\` \\| \`\\.skilled/commands/doctor/assets/doctor-ci-${target}\\.yaml\` \\|$`, 'm'));
  }
});

test('the presentation carries the menu, the accepted answers, the valid-targets line and a manifest row per target', () => {
  TARGETS.forEach((target, index) => {
    const number = index + 1;
    assert.match(PRESENTATION, new RegExp(`^${number}\\) ${target}$`, 'm'));
    assert.match(PRESENTATION, new RegExp(`^\\| \`${number}\` \\| target = \`${target}\` \\|`, 'm'));
    assert.match(PRESENTATION, new RegExp(`^\\| \`${target}\` \\| \`doctor-ci-${target}\\.yaml\` \\|`, 'm'));
  });
  assert.match(PRESENTATION, /^Valid targets: report, scaffold, toggle$/m);
  assert.match(PRESENTATION, /Write this file\? \[yes\/no\]/);
  assert.match(PRESENTATION, /Run this command\? \[yes\/no\]/);
  assert.match(PRESENTATION, /What would you like to do next\?/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. WORKFLOW ASSETS
// ─────────────────────────────────────────────────────────────────────────────

test('the report workflow is read-only and runs the report script', () => {
  const report = parseYaml(REPORT_YAML);
  assert.equal(report.operating_mode.execution, 'read_only');
  assert.equal(report.mutation_boundaries.read_only, true);
  assert.deepEqual(report.mutation_boundaries.allowed_targets, []);
  assert.match(REPORT_YAML, /\.skilled\/commands\/doctor\/scripts\/ci-report\.cjs/);
  assert.deepEqual(route('report').script_invocations, ['node .skilled/commands/doctor/scripts/ci-report.cjs']);
});

test('the scaffold workflow reads both templates and the protected set, refuses twice and waits for a yes', () => {
  const scaffold = parseYaml(SCAFFOLD_YAML);
  assert.equal(scaffold.operating_mode.approvals, 'explicit_yes_for_each_file_write');
  for (const file of ['workflow-template.yml', 'job-block-template.yml', 'protected-set.md']) {
    assert.ok(SCAFFOLD_YAML.includes(file), file);
  }
  assert.ok(SCAFFOLD_YAML.includes('REFUSE: the target path already exists; scaffold creates new workflows only'));
  assert.ok(SCAFFOLD_YAML.includes('REFUSE: <name> is a protected workflow'));
  assert.match(SCAFFOLD_YAML, /never runs git add or git commit/);
});

test('the scaffold templates and the protected set the workflow names exist', () => {
  for (const relative of [
    '.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml',
    '.skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml',
    '.skilled/skills/sk-code/sk-code-ci/references/protected-set.md',
  ]) {
    assert.ok(SCAFFOLD_YAML.includes(relative), `${relative} is not named by the workflow`);
    assert.ok(fs.existsSync(path.join(REPO_ROOT, relative)), `${relative} is missing`);
  }
});

test('the toggle workflow allows the six documented names and refuses the message-contract switches', () => {
  for (const name of SWITCH_VARIABLES) assert.ok(TOGGLE_YAML.includes(name), name);
  assert.ok(TOGGLE_YAML.includes('REFUSE: <name> is not a documented switch'));
  assert.ok(TOGGLE_YAML.includes(`REFUSE: ${PROHIBITION} while the ruleset requires that context`));
  assert.ok(TOGGLE_YAML.includes('REFUSE: SKILLED_CI must stay unset while the ruleset requires that context'));
  assert.ok(TOGGLE_YAML.includes('gh variable set <name> --body off'));
  assert.ok(TOGGLE_YAML.includes('gh variable delete <name>'));
});

test('the workflows README still carries the sentence the toggle enforces', () => {
  assert.ok(WORKFLOWS_README.includes(PROHIBITION));
  for (const name of SWITCH_VARIABLES) assert.ok(WORKFLOWS_README.includes(name), name);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMMENT HYGIENE
// ─────────────────────────────────────────────────────────────────────────────

test('no file the command ships names a requirement, decision or phase id', () => {
  for (const file of SHIPPED_FILES) {
    const text = read(file);
    for (const pattern of EPHEMERAL_ID) {
      assert.doesNotMatch(text, pattern, `${path.relative(REPO_ROOT, file)} matches ${pattern}`);
    }
  }
});
