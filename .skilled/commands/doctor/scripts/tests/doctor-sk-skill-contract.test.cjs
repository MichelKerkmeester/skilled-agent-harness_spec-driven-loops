#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor SK-Skill Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Holds the /doctor:sk-skill command together: the route in the manifest, the
// router, the presentation contract, the check workflow and the command contract
// must agree on the target, the mutation class, the asset paths and the argument
// hint. The route validator checks structure; this suite checks the promises no
// validator reads, such as template conformance and what the presentation owns.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const DOCTOR = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(DOCTOR, 'assets');
const SKILL_DOC_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');

const read = (file) => fs.readFileSync(file, 'utf8');

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:sk-skill');
const checkRoute = () => ROUTES.find((route) => route.target === 'check');

const ROUTER = read(path.join(DOCTOR, 'sk-skill.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-sk-skill-presentation.txt'));
const CHECK_YAML = read(path.join(ASSETS, 'doctor-sk-skill-check.yaml'));
const SETUP_PRESENTATION = read(path.join(ASSETS, 'doctor-setup-presentation.txt'));

const CONTRACT = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.json')));
const SCHEMA = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.schema.json')));
const DOCTOR_CONTRACT = CONTRACT.families.doctor;
const FAMILY_SCHEMA = SCHEMA.definitions.familyContract;

const WORKFLOW_ASSET = 'doctor-sk-skill-check.yaml';
const ENGINE = '.skilled/commands/doctor/scripts/sk-skill-check.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTE
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds one check route, read-only, which the bare command reaches as the only target', () => {
  assert.deepEqual(ROUTES.map((route) => route.target), ['check']);
  const route = checkRoute();
  // A single-target command needs no default_target: the bare command already reaches its only route.
  assert.equal(route.default_target, undefined);
  assert.equal(route.mutating, 'read-only');
  assert.match(route.gate3_location, /^n\/a/);
  assert.equal(route.yaml, WORKFLOW_ASSET);
  assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
  assert.ok(route.allowed_flags.includes('--json'));
  assert.deepEqual(route.mcp_tools, []);
});

test('the route names the check engine and every trigger phrase carries three or more words', () => {
  for (const phrase of checkRoute().trigger_phrases) {
    assert.ok(phrase.trim().split(/\s+/).length >= 3, phrase);
  }
  assert.deepEqual(
    checkRoute().script_invocations.map((entry) => entry.match(/\.skilled\/\S+\.cjs/)[0]),
    [ENGINE],
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTER AND PRESENTATION
// ─────────────────────────────────────────────────────────────────────────────

test('the router follows the router template: six canonical sections in order and no inline presentation', () => {
  const headings = [...ROUTER.matchAll(/^## \d+\. ([A-Z ]+)$/gm)].map((match) => match[1]);
  assert.deepEqual(headings, [
    'ROUTER CONTRACT',
    'OWNED ASSETS',
    'MODE ROUTING',
    'EXECUTION TARGETS',
    'PRESENTATION BOUNDARY',
    'WORKFLOW SUMMARY',
  ]);
  // A fenced block or a status line in the router would put a dashboard or a result
  // template inline, where the presentation contract is the only place they belong.
  assert.doesNotMatch(ROUTER, /```/);
  assert.doesNotMatch(ROUTER, /STATUS=/);
});

test('the router frontmatter stays within budget and grants only the tools it uses', () => {
  const description = ROUTER.match(/^description:\s*"(.*)"$/m)[1];
  assert.ok(description.length <= 110, `description is ${description.length} chars`);
  assert.doesNotMatch(description, /[<>]/);
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(hint.length <= 140, `argument-hint is ${hint.length} chars`);
  const tools = ROUTER.match(/^allowed-tools:\s*(.+)$/m)[1].split(',').map((tool) => tool.trim());
  assert.deepEqual(tools, ['Read', 'Bash']);
  assert.equal(ROUTER.split('<!-- skill_agent: sk-doc -->').length - 1, 1);
});

test('the router binds the check target to the workflow asset the route names', () => {
  assert.match(
    ROUTER,
    new RegExp(`^\\| \`check\` \\| \`\\.skilled/commands/doctor/assets/${WORKFLOW_ASSET}\` \\|$`, 'm'),
  );
});

test('the presentation carries the menu, the accepted answer, the manifest row and both result templates', () => {
  assert.match(PRESENTATION, /^## 1\. Argument Failure$/m);
  assert.match(PRESENTATION, /^1\) check$/m);
  assert.match(PRESENTATION, /^\| `1` \| target = `check` \|/m);
  assert.match(PRESENTATION, /^Valid targets: check$/m);
  assert.match(PRESENTATION, /^\| `check` \| `doctor-sk-skill-check\.yaml` \| read-only \|/m);
  assert.match(PRESENTATION, /^Skill fleet check$/m);
  assert.match(PRESENTATION, /^Result: \[PASS\|FINDINGS/m);
  assert.ok(PRESENTATION.includes("With `--json` print the engine's JSON and nothing else"));
});

test('the presentation closes on the summary and failure templates and one next-step line', () => {
  assert.match(PRESENTATION, /^STATUS=\[status\]$/m);
  assert.match(PRESENTATION, /^STATUS=ERROR ERROR="\[message\]"$/m);
  assert.match(PRESENTATION, /^End interactive presentations with: `What would you like to do next\?`$/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE CHECK WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('the check workflow is read-only and runs the engine the route declares', () => {
  const workflow = parseYaml(CHECK_YAML);
  assert.equal(workflow.operating_mode.execution, 'read_only');
  assert.equal(workflow.mutation_boundaries.read_only, true);
  assert.deepEqual(workflow.mutation_boundaries.allowed_targets, []);
  assert.ok(CHECK_YAML.includes(ENGINE), ENGINE);
});

test('the workflow declares every variable its route resolves', () => {
  const workflow = parseYaml(CHECK_YAML);
  for (const key of checkRoute().setup_vars) {
    assert.ok(key in workflow.inputs, `inputs.${key} is missing`);
  }
});

test('the workflow passes the engine its target and --json only when the operator asked', () => {
  const workflow = parseYaml(CHECK_YAML);
  assert.match(workflow.inputs.json_output, /true when --json is passed/);
  assert.match(CHECK_YAML, /--json when the operator/);
  // An unconditional --json would break the default report the target promises.
  assert.doesNotMatch(CHECK_YAML, /sk-skill-check\.cjs --json/);
});

test('the workflow maps all three engine exit classes to a route status', () => {
  const { output } = parseYaml(CHECK_YAML);
  assert.match(output, /STATUS=OK/);
  assert.match(output, /STATUS=FINDINGS/);
  assert.match(output, /STATUS=ERROR/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE COMMAND CONTRACT AND THE SETUP LIST
// ─────────────────────────────────────────────────────────────────────────────

test('the doctor contract entry carries every field its schema requires and nothing it forbids', () => {
  for (const key of FAMILY_SCHEMA.required) {
    assert.ok(key in DOCTOR_CONTRACT, `families.doctor is missing ${key}`);
  }
  const known = new Set(Object.keys(FAMILY_SCHEMA.properties));
  assert.deepEqual(
    Object.keys(DOCTOR_CONTRACT).filter((key) => !known.has(key)),
    [],
    'the schema forbids an additional property',
  );
  assert.ok(FAMILY_SCHEMA.properties.topology.enum.includes(DOCTOR_CONTRACT.topology));
  assert.ok(FAMILY_SCHEMA.properties.mode_matrix.properties.default_policy.enum
    .includes(DOCTOR_CONTRACT.mode_matrix.default_policy));
  for (const entry of DOCTOR_CONTRACT.execution_targets) {
    assert.equal(typeof entry.selector, 'string');
    assert.equal(typeof entry.target, 'string');
  }
});

test('the contract names the router, the check workflow, the presentation, the hint and the alias', () => {
  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/sk-skill.md'));
  assert.ok(DOCTOR_CONTRACT.execution_targets
    .some((entry) => entry.target.endsWith(WORKFLOW_ASSET)), WORKFLOW_ASSET);
  assert.ok(DOCTOR_CONTRACT.owned_assets
    .some((entry) => entry.purpose === 'presentation'
      && entry.path.endsWith('doctor-sk-skill-presentation.txt')));
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(`${hint} (sk-skill)`));
  assert.ok(DOCTOR_CONTRACT.invocation_aliases.includes(`/doctor:sk-skill ${hint}`));
  assert.ok(DOCTOR_CONTRACT.loader_requirements.some((line) => line.includes('/doctor:sk-skill check')));
});

test('the setup target list carries the check row once', () => {
  const rows = SETUP_PRESENTATION.split('\n')
    .filter((line) => line.includes('/doctor:sk-skill check'));
  assert.equal(rows.length, 1);
  assert.match(rows[0], /^\| `\/doctor:sk-skill check \[<name-or-path>\] \[--json\]` \|/);
});
