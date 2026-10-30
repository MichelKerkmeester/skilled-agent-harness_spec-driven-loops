#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor SK-Skill Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Holds the /doctor:sk-skill command together: the routes in the manifest, the
// router, the presentation contract, both workflows and the command contract
// must agree on the targets, the mutation classes, the asset paths and the
// argument hint. The route validator checks structure; this suite checks the
// promises no validator reads, such as template conformance, the plan-before-write
// order and the refusal wording the workflow prints.

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
const SCRIPTS = path.join(DOCTOR, 'scripts');
const SKILL_DOC_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');

const read = (file) => fs.readFileSync(file, 'utf8');

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:sk-skill');
const routeFor = (target) => ROUTES.find((route) => route.target === target);
const checkRoute = () => routeFor('check');
const convertRoute = () => routeFor('convert');

const ROUTER = read(path.join(DOCTOR, 'sk-skill.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-sk-skill-presentation.txt'));
const CHECK_YAML = read(path.join(ASSETS, 'doctor-sk-skill-check.yaml'));
const CONVERT_YAML = read(path.join(ASSETS, 'doctor-sk-skill-convert.yaml'));
const SETUP_PRESENTATION = read(path.join(ASSETS, 'doctor-setup-presentation.txt'));

const CONTRACT = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.json')));
const SCHEMA = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.schema.json')));
const DOCTOR_CONTRACT = CONTRACT.families.doctor;
const FAMILY_SCHEMA = SCHEMA.definitions.familyContract;

const WORKFLOW_ASSET = 'doctor-sk-skill-check.yaml';
const CONVERT_ASSET = 'doctor-sk-skill-convert.yaml';
const ENGINE = '.skilled/commands/doctor/scripts/sk-skill-check.cjs';
const CONVERT_ENGINE = '.skilled/commands/doctor/scripts/sk-skill-convert.cjs';

// The converter's own source is the proof that the refusal list quotes wording it
// actually prints: a test that read only the workflow would pass on a reason the
// engine never says. The controls come from the engine and its transforms library.
const ENGINE_SOURCE = read(path.join(SCRIPTS, 'sk-skill-convert.cjs'))
  + read(path.join(SCRIPTS, 'lib', 'sk-skill-convert-transforms.cjs'));

// Every machine code the converter can print for a target it will not convert.
const CONVERT_REFUSAL_CODES = [
  'PREFLIGHT_REFUSED',
  'RESERVED_PREFIX',
  'PERSONA_PREFIX',
  'NAME_NOT_KEBAB',
  'NESTED_PACKETS',
  'HUB_DECLARATION',
  'DUAL_DECLARATION',
  'NAME_COLLISION',
  'ROUTER_EXISTS',
  'STALE_PLAN',
  'ROUTER_CONTENT_CHANGED',
  'ROUTER_SEMANTICS_CHANGED',
  'APPLY_FAILED',
  'ROLLBACK_FAILED',
  'FRONTMATTER_INVALID',
  'ALLOWED_TOOLS_MISSING',
  'ALLOWED_TOOLS_AMBIGUOUS',
  'ALLOWED_TOOLS_INVALID',
];

const CONVERT_WORKFLOW = parseYaml(CONVERT_YAML);
const PHASES = Object.keys(CONVERT_WORKFLOW.workflow);

const yamlStrings = (node, out = []) => {
  if (Array.isArray(node)) {
    for (const value of node) yamlStrings(value, out);
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      out.push(key);
      yamlStrings(value, out);
    }
  } else if (typeof node === 'string') {
    out.push(node);
  }
  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds a check route and a convert route, and only check answers the bare command', () => {
  assert.deepEqual(ROUTES.map((route) => route.target), ['check', 'convert']);
  // Two targets make the command multi-target, so the read-only one has to claim the
  // bare invocation: without the flag a typed /doctor:sk-skill would reach no bridge.
  assert.equal(checkRoute().default_target, true);
  assert.equal(convertRoute().default_target, undefined);
  assert.equal(checkRoute().mutating, 'read-only');
  assert.match(checkRoute().gate3_location, /^n\/a/);
  assert.equal(convertRoute().mutating, 'mutates');
  assert.equal(checkRoute().yaml, WORKFLOW_ASSET);
  assert.equal(convertRoute().yaml, CONVERT_ASSET);
  for (const route of ROUTES) {
    assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
    assert.deepEqual(route.mcp_tools, []);
  }
  assert.ok(checkRoute().allowed_flags.includes('--json'));
  assert.deepEqual(convertRoute().allowed_flags, ['--dry-run']);
});

test('the convert route names the skill folder and its backup as the only place it writes', () => {
  const location = convertRoute().gate3_location;
  assert.match(location, /\.skilled\/skills/);
  assert.match(location, /SKILL\.md/);
  assert.match(location, /ROUTER\.md/);
  assert.match(location, /\.state\/doctor-sk-skill\/<name>\/<timestamp>/);
});

test('both routes name the engines their workflows run and every trigger phrase carries three or more words', () => {
  for (const route of ROUTES) {
    for (const phrase of route.trigger_phrases) {
      assert.ok(phrase.trim().split(/\s+/).length >= 3, phrase);
    }
  }
  assert.deepEqual(
    checkRoute().script_invocations.map((entry) => entry.match(/\.skilled\/\S+\.cjs/)[0]),
    [ENGINE],
  );
  assert.deepEqual(
    convertRoute().script_invocations.map((entry) => entry.match(/\.skilled\/\S+\.cjs/)[0]),
    [CONVERT_ENGINE, CONVERT_ENGINE, ENGINE],
  );
  // The plan call is the one the workflow runs before the question, so it may not
  // carry the write switch.
  assert.doesNotMatch(convertRoute().script_invocations[0], /--apply/);
  assert.match(convertRoute().script_invocations[1], /--apply/);
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

test('the router binds each target to the workflow asset its route names', () => {
  for (const route of ROUTES) {
    assert.match(
      ROUTER,
      new RegExp(`^\\| \`${route.target}\` \\| \`\\.skilled/commands/doctor/assets/${route.yaml}\` \\|$`, 'm'),
      route.target,
    );
  }
});

test('the router resolves the bare command to check and asks once for a convert name', () => {
  assert.match(ROUTER, /`default_target`/);
  assert.match(ROUTER, /ask for it once/);
  assert.match(ROUTER, /never infer it/);
  assert.match(ROUTER, /A bare `\/doctor:sk-skill` never reaches `convert`, which writes/);
});

test('the presentation carries the dual menu, the accepted answers, the manifest rows and the target list', () => {
  assert.match(PRESENTATION, /^## 1\. Argument Failure$/m);
  assert.match(PRESENTATION, /^1\) check$/m);
  assert.match(PRESENTATION, /^2\) convert$/m);
  assert.match(PRESENTATION, /^\| `1` \| target = `check` \|/m);
  assert.match(PRESENTATION, /^\| `2` \| target = `convert` \|/m);
  assert.match(PRESENTATION, /^Valid targets: check, convert$/m);
  assert.match(PRESENTATION, /^\| `check` \| `doctor-sk-skill-check\.yaml` \| read-only \|/m);
  assert.match(PRESENTATION, /^\| `convert` \| `doctor-sk-skill-convert\.yaml` \| mutates \|/m);
});

test('the presentation keeps the check tables, the JSON passthrough and the plan-before-write wording', () => {
  assert.match(PRESENTATION, /^Skill fleet check$/m);
  assert.match(PRESENTATION, /^Result: \[PASS\|FINDINGS/m);
  assert.ok(PRESENTATION.includes("With `--json` print the engine's JSON and nothing else"));
  assert.match(PRESENTATION, /^Trim the description to 130 characters or fewer\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /^Declare allowed-tools as \[Read, Grep, Glob\] for this skill\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /^Convert this skill now\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /Dry run: nothing was written and nothing was asked\./);
  assert.match(PRESENTATION, /never write a permission grant without that yes/);
});

test('the presentation closes on the summary, cancelled, failed and next-step templates', () => {
  assert.match(PRESENTATION, /^STATUS=\[status\]$/m);
  assert.match(PRESENTATION, /^STATUS=ERROR ERROR="\[message\]"$/m);
  assert.match(PRESENTATION, /^STATUS=OK$/m);
  assert.match(PRESENTATION, /^STATUS=CANCELLED ACTION=cancelled$/m);
  assert.match(PRESENTATION, /^STATUS=FAIL ERROR="\[code\]"$/m);
  assert.match(PRESENTATION, /^End interactive presentations with: `What would you like to do next\?`$/m);
});

test('the presentation refusal table carries every code the workflow can print', () => {
  for (const code of CONVERT_REFUSAL_CODES) {
    assert.ok(PRESENTATION.includes(`\`${code}\``), code);
  }
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

test('the check workflow declares every variable its route resolves', () => {
  const workflow = parseYaml(CHECK_YAML);
  for (const key of checkRoute().setup_vars) {
    assert.ok(key in workflow.inputs, `inputs.${key} is missing`);
  }
});

test('the check workflow passes the engine its target and --json only when the operator asked', () => {
  const workflow = parseYaml(CHECK_YAML);
  assert.match(workflow.inputs.json_output, /true when --json is passed/);
  assert.match(CHECK_YAML, /--json when the operator/);
  // An unconditional --json would break the default report the target promises.
  assert.doesNotMatch(CHECK_YAML, /sk-skill-check\.cjs --json/);
});

test('the check workflow maps all three engine exit classes to a route status', () => {
  const { output } = parseYaml(CHECK_YAML);
  assert.match(output, /STATUS=OK/);
  assert.match(output, /STATUS=FINDINGS/);
  assert.match(output, /STATUS=ERROR/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE CONVERT WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('the convert workflow is interactive, asks once per write and writes nothing on a dry run', () => {
  assert.equal(CONVERT_WORKFLOW.operating_mode.execution, 'interactive');
  assert.equal(CONVERT_WORKFLOW.operating_mode.approvals, 'explicit_yes_before_the_first_write');
  assert.equal(CONVERT_WORKFLOW.operating_mode.dry_run, 'run_the_plan_and_stop_before_the_approval');
  assert.equal(CONVERT_WORKFLOW.operating_mode.never_commit, true);
  assert.deepEqual(CONVERT_WORKFLOW.output.statuses, ['OK', 'CANCELLED', 'FAIL']);
});

test('the convert workflow runs its phases in the read, refuse, plan, yes, write, re-read, undo order', () => {
  assert.deepEqual(PHASES, [
    'phase_1_read',
    'phase_2_refuse',
    'phase_3_plan',
    'phase_4_approval',
    'phase_5_write',
    'phase_6_reread',
    'phase_7_undo',
    'phase_8_report',
  ]);
  assert.equal(CONVERT_WORKFLOW.output.presentation, '.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt');
});

test('the plan runs before the approval and only the write phase runs the apply', () => {
  const planPhase = PHASES.findIndex((phase) => yamlStrings(CONVERT_WORKFLOW.workflow[phase]).some(
    (value) => value.includes(`${CONVERT_ENGINE} plan`),
  ));
  const applyPhase = PHASES.find((phase) => yamlStrings(CONVERT_WORKFLOW.workflow[phase]).some(
    (value) => value.includes(`${CONVERT_ENGINE} apply`),
  ));
  assert.equal(PHASES[planPhase], 'phase_2_refuse');
  assert.equal(applyPhase, 'phase_5_write');
  assert.ok(planPhase < PHASES.indexOf('phase_4_approval'), 'the plan is printed before the question');
  // The write switch may appear in the write phase and in the refusal that names it,
  // never in the read, plan or approval phase.
  for (const phase of ['phase_1_read', 'phase_3_plan', 'phase_4_approval']) {
    assert.ok(
      !yamlStrings(CONVERT_WORKFLOW.workflow[phase]).some((value) => value.includes('--apply')),
      phase,
    );
  }
});

test('the convert workflow declares every variable its route resolves and what it may write', () => {
  for (const key of convertRoute().setup_vars) {
    assert.ok(key in CONVERT_WORKFLOW.inputs, `inputs.${key} is missing`);
  }
  const boundaries = CONVERT_WORKFLOW.mutation_boundaries;
  assert.equal(boundaries.read_only, false);
  const allowed = boundaries.allowed_targets.join('\n');
  assert.match(allowed, /SKILL\.md/);
  assert.match(allowed, /ROUTER\.md/);
  assert.match(allowed, /\.state\/doctor-sk-skill/);
  const forbidden = boundaries.forbidden_targets.join('\n');
  assert.match(forbidden, /sk-skill-convert\.cjs/);
  assert.match(forbidden, /the git index/);
  assert.match(boundaries.invariant, /until the plan has been printed and the operator has answered yes/);
  assert.match(boundaries.invariant, /every write is preceded by a backup/);
});

test('the convert workflow states the follow-ups that need their own yes and keeps them out of the refusals', () => {
  const planText = yamlStrings(CONVERT_WORKFLOW.workflow.phase_3_plan).join('\n');
  assert.match(planText, /130 characters or fewer/);
  assert.match(planText, /\[Read, Grep, Glob\]/);
  assert.match(planText, /its own yes/);
  assert.match(planText, /neither is written without its own yes/);
  const dryRunText = yamlStrings(CONVERT_WORKFLOW.workflow.phase_3_plan).join('\n');
  assert.match(dryRunText, /dry_run is true/);
});

test('the convert workflow carries a reason for every refusal the converter can print', () => {
  const refusals = CONVERT_WORKFLOW.refusals;
  assert.ok(Array.isArray(refusals) && refusals.length > 0, 'refusals is a list');
  for (const entry of refusals) {
    assert.equal(typeof entry.code, 'string');
    assert.ok(entry.code.length > 0);
    assert.equal(typeof entry.reason, 'string');
    assert.ok(entry.reason.length > 0, entry.code);
    assert.equal(typeof entry.next, 'string');
    assert.ok(entry.next.length > 0, entry.code);
  }
  const codes = new Set(refusals.map((entry) => entry.code));
  for (const code of CONVERT_REFUSAL_CODES) {
    assert.ok(codes.has(code), `${code} is missing from the refusal list`);
    assert.ok(ENGINE_SOURCE.includes(`'${code}'`), `${code} is not a code the converter prints`);
  }
  // The catch-all keeps a code the list has not learned yet from printing nothing.
  assert.ok(refusals.some((entry) => entry.code.startsWith('<')), 'a catch-all entry is missing');
});

test('every refusal reason quotes the wording the converter prints', () => {
  const segments = (reason) => reason
    .replace(/<[^>]*>/g, '\u0000')
    .split('\u0000')
    .map((part) => part.trim())
    // A placeholder can sit mid-sentence, so a stub of punctuation proves nothing.
    .filter((part) => part.replace(/[^A-Za-z0-9]/g, '').length >= 8);
  for (const entry of CONVERT_WORKFLOW.refusals) {
    if (entry.code.startsWith('<')) continue;
    for (const segment of segments(entry.reason)) {
      assert.ok(ENGINE_SOURCE.includes(segment), `${entry.code}: "${segment}" is not the converter's wording`);
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. THE COMMAND CONTRACT AND THE SETUP LIST
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

test('the contract names the router, both workflows, the presentation, the hint and the alias', () => {
  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/sk-skill.md'));
  for (const asset of [WORKFLOW_ASSET, CONVERT_ASSET]) {
    assert.ok(DOCTOR_CONTRACT.execution_targets
      .some((entry) => entry.target.endsWith(asset)), asset);
    assert.ok(DOCTOR_CONTRACT.owned_assets
      .some((entry) => entry.path.endsWith(asset)), asset);
  }
  assert.ok(DOCTOR_CONTRACT.owned_assets
    .some((entry) => entry.purpose === 'presentation'
      && entry.path.endsWith('doctor-sk-skill-presentation.txt')));
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(`${hint} (sk-skill)`));
  assert.ok(DOCTOR_CONTRACT.invocation_aliases.includes(`/doctor:sk-skill ${hint}`));
  assert.ok(DOCTOR_CONTRACT.loader_requirements.some((line) => line.includes('/doctor:sk-skill check')));
  assert.ok(DOCTOR_CONTRACT.loader_requirements.some((line) => line.includes('/doctor:sk-skill convert')));
});

test('the setup target list carries one row per target', () => {
  const checkRows = SETUP_PRESENTATION.split('\n')
    .filter((line) => line.includes('/doctor:sk-skill check'));
  assert.equal(checkRows.length, 1);
  assert.match(checkRows[0], /^\| `\/doctor:sk-skill check \[<name-or-path>\] \[--json\]` \|/);
  const convertRows = SETUP_PRESENTATION.split('\n')
    .filter((line) => line.includes('/doctor:sk-skill convert'));
  assert.equal(convertRows.length, 1);
  assert.match(convertRows[0], /^\| `\/doctor:sk-skill convert <name-or-path> \[--dry-run\]` \|/);
});
