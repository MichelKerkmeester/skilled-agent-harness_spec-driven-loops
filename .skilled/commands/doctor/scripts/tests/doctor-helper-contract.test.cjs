#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Helper Contract Tests
// ───────────────────────────────────────────────────────────────────

'use strict';

// Holds /doctor:helper together, and makes the family's reach a gate rather than a
// habit.
//
// A doctor command that no entry point can name is a command nobody runs, so this
// suite fails the moment a router file lands without a manifest route, a phrase, a
// `/doctor:setup` row, or a matching entry in the matcher. The reach checks read
// the tree rather than a list, so a new router is covered the day its file lands.
//
// The other half is derivation parity. The matcher derives ids and runnables from
// the same manifest the advisor's bridge deriver reads. Nothing forces the two to
// stay in step, so this suite compares them against the deriver's own generated
// output: drift halves the family in a way no route validator can see.

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
const REPO_ROOT = path.resolve(DOCTOR, '..', '..', '..');
const SKILL_DOC_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');
const GENERATED_BRIDGES = path.join(
  REPO_ROOT,
  '.skilled',
  'skills',
  'system-skill-advisor',
  'runtime',
  'scripts',
  'command-bridges',
  'command-bridges.generated.json',
);
const MATCHER = path.join(__dirname, '..', 'doctor-helper-match.cjs');

const read = (file) => fs.readFileSync(file, 'utf8');

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:helper');
const helperRoute = () => ROUTES[0];

const ROUTER = read(path.join(DOCTOR, 'helper.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-helper-presentation.txt'));
const WORKFLOW = read(path.join(ASSETS, 'doctor-helper.yaml'));
const SETUP_PRESENTATION = read(path.join(ASSETS, 'doctor-setup-presentation.txt'));

const CONTRACT = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.json')));
const SCHEMA = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.schema.json')));
const DOCTOR_CONTRACT = CONTRACT.families.doctor;
const FAMILY_SCHEMA = SCHEMA.definitions.familyContract;

const WORKFLOW_ASSET = 'doctor-helper.yaml';
const ENGINE = '.skilled/commands/doctor/scripts/doctor-helper-match.cjs';

const matcher = require(MATCHER);

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTE
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds one helper route, read-only, on a command with one target', () => {
  assert.equal(ROUTES.length, 1, '/doctor:helper must own exactly one route');
  const route = helperRoute();
  assert.equal(route.target, 'helper');
  assert.equal(route.mutating, 'read-only');
  assert.match(route.gate3_location, /^n\/a/);
  assert.equal(route.default_target, undefined);
  assert.equal(route.yaml, WORKFLOW_ASSET);
  assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
  assert.ok(route.allowed_flags.includes('--json'));
  assert.deepEqual(route.mcp_tools, []);
});

test('the route names the matcher and every trigger phrase carries three or more words', () => {
  for (const phrase of helperRoute().trigger_phrases) {
    assert.ok(phrase.trim().split(/\s+/).length >= 3, phrase);
  }
  assert.deepEqual(
    helperRoute().script_invocations.map((entry) => entry.match(/\.skilled\/\S+\.cjs/)[0]),
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
  assert.equal(ROUTER.split('<!-- skill_agent: system-spec-kit -->').length - 1, 1);
});

test('the router binds the helper target to the workflow asset the route names', () => {
  assert.match(
    ROUTER,
    new RegExp(`^\\| \`helper\` \\| \`\\.skilled/commands/doctor/assets/${WORKFLOW_ASSET}\` \\|$`, 'm'),
  );
});

test('the router keeps free text and its two lists out of the flags it accepts', () => {
  assert.match(ROUTER, /after `--`/);
  assert.match(ROUTER, /`list`, `\?` and `menu`/);
});

test('the presentation carries the argument failure, the three questions, the ranked list and the hand-off rule', () => {
  assert.match(PRESENTATION, /^## 1\. Argument Failure$/m);
  assert.match(PRESENTATION, /^## 2\. No-Argument Prompt$/m);
  assert.match(PRESENTATION, /^1\) Area:/m);
  assert.match(PRESENTATION, /^2\) What happened\?/m);
  assert.match(PRESENTATION, /^3\) Check only, or change something\?/m);
  assert.match(PRESENTATION, /^## 3\. Ranked List$/m);
  assert.match(PRESENTATION, /^1\) \[runnable\]/m);
  assert.match(PRESENTATION, /^## 4\. The Offer to Run$/m);
  assert.match(PRESENTATION, /shown for you to run/);
  assert.match(PRESENTATION, /^## 5\. No Match$/m);
  assert.match(PRESENTATION, /^STATUS=NO_MATCH FALLBACK=\/doctor:setup$/m);
});

test('the presentation never offers a flag and closes on the family convention', () => {
  assert.doesNotMatch(PRESENTATION, /--apply|--fix|--state=|--variable=|--yes/);
  assert.match(PRESENTATION, /^STATUS=OK MATCHES=\[n\]$/m);
  assert.match(PRESENTATION, /^STATUS=FAIL ERROR="\[message\]"$/m);
  assert.match(PRESENTATION, /^End interactive presentations with: `What would you like to do next\?`$/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE READ-ONLY WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('the workflow is read-only, grants no write target and runs the matcher the route declares', () => {
  const workflow = parseYaml(WORKFLOW);
  assert.equal(workflow.operating_mode.execution, 'read_only');
  assert.equal(workflow.mutation_boundaries.read_only, true);
  assert.deepEqual(workflow.mutation_boundaries.allowed_targets, []);
  assert.ok(WORKFLOW.includes(ENGINE), ENGINE);
});

test('the workflow declares every variable its route resolves', () => {
  const workflow = parseYaml(WORKFLOW);
  for (const key of helperRoute().setup_vars) {
    assert.ok(key in workflow.inputs, `inputs.${key} is missing`);
  }
});

test('the workflow maps the matcher exit codes to the three route statuses', () => {
  const { output } = parseYaml(WORKFLOW);
  assert.match(output, /exit 0/i);
  assert.match(output, /STATUS=OK MATCHES=/);
  assert.match(output, /exit 1/i);
  assert.match(output, /STATUS=NO_MATCH FALLBACK=\/doctor:setup/);
  assert.match(output, /exit 2/i);
  assert.match(output, /STATUS=FAIL ERROR=/);
});

test('the workflow hands a writing pick back instead of running it', () => {
  assert.match(WORKFLOW, /hand[\s-]?off|handed off|for the operator to run/);
  assert.match(WORKFLOW, /never adds a flag|adds no flag/);
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
});

test('the contract names the router, the helper workflow, the presentation, the hint and the alias', () => {
  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/helper.md'));
  assert.ok(DOCTOR_CONTRACT.execution_targets
    .some((entry) => entry.target.endsWith(WORKFLOW_ASSET)), WORKFLOW_ASSET);
  assert.ok(DOCTOR_CONTRACT.owned_assets
    .some((entry) => entry.purpose === 'presentation'
      && entry.path.endsWith('doctor-helper-presentation.txt')));
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(`${hint} (helper)`));
  // The alias is the runnable form, as the git router's aliases are: the menu words
  // are an aid in the hint and not a way to call the command.
  assert.ok(DOCTOR_CONTRACT.invocation_aliases.includes('/doctor:helper [<problem in plain words>] [--json]'));
  assert.ok(DOCTOR_CONTRACT.loader_requirements.some((line) => line.includes('/doctor:helper')));
});

test('the setup target list carries one helper row and a row for every other doctor command', () => {
  const rows = SETUP_PRESENTATION.split('\n').filter((line) => line.includes('/doctor:helper'));
  assert.equal(rows.length, 1);
  assert.match(rows[0], /^\| `\/doctor:helper /);

  const routers = fs.readdirSync(DOCTOR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .filter((name) => name !== 'helper' && !name.startsWith('local-'));
  const missing = routers.filter((name) => !SETUP_PRESENTATION.includes(`/doctor:${name}`));
  assert.deepEqual(missing, [], 'every doctor command needs a row in the setup target list');
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. REACH: NO ROUTER WITHOUT AN ENTRY, NO PHRASE WITHOUT ITS ENTRY
// ─────────────────────────────────────────────────────────────────────────────

test('every doctor router owns at least one helper entry', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const covered = new Set(entries.map((entry) => entry.command.replace('/doctor:', '')));
  const routers = fs.readdirSync(DOCTOR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .filter((name) => name !== 'helper' && !name.startsWith('local-'));
  const unreachable = routers.filter((name) => !covered.has(name));
  assert.deepEqual(unreachable, [], 'a router with no manifest route has no way in');
});

test('every helper entry carries a phrase and every phrase ranks its own entry first', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const routable = entries.filter((entry) => entry.command !== '/doctor:helper');
  const misses = [];
  for (const entry of routable) {
    assert.ok(entry.phrases.length >= 1, `${entry.runnable} has no phrase`);
    for (const phrase of entry.phrases) {
      const ranked = matcher.rankProblem(routable, phrase, {}).candidates[0];
      if (!ranked || ranked.runnable !== entry.runnable) {
        misses.push(`${entry.runnable} <- "${phrase}"`);
      }
    }
  }
  assert.deepEqual(misses, []);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. DERIVATION PARITY WITH THE BRIDGE DERIVER
// ─────────────────────────────────────────────────────────────────────────────

test('the helper ids and runnables match the deriver, plus only the standalone action extras', () => {
  const generated = JSON.parse(read(GENERATED_BRIDGES));
  const doctor = generated.entries.filter((entry) => entry.id.startsWith('command-doctor-'));
  const generatedIds = new Set(doctor.map((entry) => entry.id));

  const { entries } = matcher.loadEntries(REPO_ROOT);
  const extras = entries.filter((entry) => entry.section === 'action');
  const derivedIds = new Set(entries.filter((entry) => entry.section !== 'action').map((entry) => entry.id));

  assert.deepEqual([...derivedIds].sort(), [...generatedIds].sort());

  // An active bridge publishes the runnable the advisor serves, so its name is the
  // deriver's own answer and not a second derivation of it.
  for (const entry of doctor) {
    const typescript = entry.runtime && entry.runtime.typescript;
    if (!typescript || !typescript.enabled) continue;
    const mine = entries.find((candidate) => candidate.id === entry.id);
    assert.ok(mine, `${entry.id} has no helper entry`);
    assert.equal(mine.runnable, typescript.name, entry.id);
  }

  const inactive = doctor
    .filter((entry) => !entry.runtime || !entry.runtime.typescript.enabled)
    .map((entry) => entry.id)
    .sort();
  assert.ok(inactive.every((id) => derivedIds.has(id)), inactive.join(' '));

  for (const extra of extras) {
    assert.ok(!generatedIds.has(extra.id), `${extra.id} must be an extra, not a deriver id`);
    assert.match(extra.runnable, /^\/doctor:\S+ \S+$/);
  }
});

test('the helper runs no model call and reads one manifest', () => {
  const source = read(MATCHER);
  assert.match(source, /_routes\.yaml/);
  assert.doesNotMatch(source, /skill-advisor\.cjs|advisor_recommend/);
});
