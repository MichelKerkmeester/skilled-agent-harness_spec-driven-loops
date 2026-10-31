#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Install Contract Tests
// ───────────────────────────────────────────────────────────────────

'use strict';

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
const CONTRACT_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');

const read = (file) => fs.readFileSync(file, 'utf8');

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:install');
const installRoute = () => ROUTES[0];

const ROUTER = read(path.join(DOCTOR, 'install.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-install-presentation.txt'));
const WORKFLOW_TEXT = read(path.join(ASSETS, 'doctor-install.yaml'));
const WORKFLOW = parseYaml(WORKFLOW_TEXT);
// The install guide's frozen interface lives here rather than in a planning document, so the
// test keeps running wherever the planning notes move.
const INSTALL_PHRASES = [
  'install skilled into my project',
  'set up skilled in another repo',
  'use skilled in my own project',
  'onboard a project repo to skilled',
  'guide me through installing skilled',
];
const WORKFLOW_STEP_NAMES = ['Locate', 'Ask', 'Inspect', 'Checklist', 'Warn'];
const SAVE_CAVEAT = 'context saves from a linked repository resolve the project root through the link until the symlinked-runtime-root fix ships, so run /doctor:setup from inside the target repo and check that a save lands in that repo\'s own specs/.';

const CONTRACT = JSON.parse(read(path.join(CONTRACT_ASSETS, 'command-contract.json')));
const SCHEMA = JSON.parse(read(path.join(CONTRACT_ASSETS, 'command-contract.schema.json')));
const DOCTOR_CONTRACT = CONTRACT.families.doctor;
const FAMILY_SCHEMA = SCHEMA.definitions.familyContract;

const WORKFLOW_ASSET = 'doctor-install.yaml';
const PRESENTATION_ASSET = 'doctor-install-presentation.txt';
const ENGINE = '.skilled/commands/doctor/scripts/symlink-engine.cjs';

const CHECKLIST_STEPS = [
  {
    command: '/doctor:symlink link --root <dir> --runtimes <list> --mode <shape>',
    owner: '/doctor:symlink',
    target: 'link',
    mutating: 'mutates',
  },
  {
    command: '/doctor:agents-md embed --root <dir>',
    owner: '/doctor:agents-md',
    target: 'embed',
    mutating: 'mutates',
  },
  {
    command: '/doctor:mcp install',
    owner: '/doctor:mcp',
    target: 'install',
    mutating: 'mutates',
  },
  {
    command: '/doctor:git setup',
    owner: '/doctor:git',
    target: 'setup',
    mutating: 'read-only',
  },
  {
    command: '/doctor:setup',
    owner: '/doctor:setup',
    target: 'setup',
    mutating: 'read-only',
  },
];

function checklistOwner(step) {
  if (step.owner === '/doctor:mcp') {
    return MANIFEST.mcp_subroutes.find((route) => route.sub_action === step.target);
  }
  return MANIFEST.routes.find((route) => route.command === step.owner && route.target === step.target);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTE
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds one read-only install route matching the frozen contract', () => {
  assert.equal(ROUTES.length, 1, '/doctor:install must own exactly one route');
  const route = installRoute();
  assert.equal(route.target, 'guide');
  assert.equal(route.mutating, 'read-only');
  assert.match(route.gate3_location, /^n\/a/);
  assert.equal(route.default_target, undefined);
  assert.equal(route.yaml, WORKFLOW_ASSET);
  assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
  assert.deepEqual(route.allowed_flags, ['--json', '--root <dir>', '--runtimes <list>']);
  assert.deepEqual(route.setup_vars, ['execution_mode', 'root', 'runtimes', 'json_output']);
  assert.deepEqual(route.mcp_tools, []);
});

test('the install route phrases and declared commands agree with the workflow contract', () => {
  for (const phrase of installRoute().trigger_phrases) {
    assert.ok(phrase.trim().split(/\s+/).length >= 3, phrase);
    assert.ok(INSTALL_PHRASES.includes(phrase), phrase);
  }

  assert.equal(installRoute().script_invocations.length, 3);
  for (const invocation of installRoute().script_invocations) {
    const command = invocation.split('#')[0].trim();
    assert.ok(WORKFLOW_TEXT.includes(command), command);
  }
});

test('the printed checklist names each route owner with its mutation class and reason', () => {
  for (const step of CHECKLIST_STEPS) {
    const owner = checklistOwner(step);
    assert.ok(owner, `${step.owner} ${step.target} has no manifest entry`);
    assert.equal(owner.mutating, step.mutating, step.command);
    assert.ok(WORKFLOW_TEXT.includes(step.command), step.command);

    const lineIndex = PRESENTATION.indexOf(step.command);
    assert.notEqual(lineIndex, -1, step.command);
    const commandLineEnd = PRESENTATION.indexOf('\n', lineIndex);
    const whyLineEnd = PRESENTATION.indexOf('\n', commandLineEnd + 1);
    const commandLine = PRESENTATION.slice(lineIndex, commandLineEnd);
    const whyLine = PRESENTATION.slice(commandLineEnd + 1, whyLineEnd);
    assert.match(commandLine, /\[class\]$/);
    assert.match(whyLine, /^\s+Why: .+/);
  }
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

test('the router binds its guide target to the workflow asset named by the route', () => {
  const targetRow = `| \`guide\` | \`.skilled/commands/doctor/assets/${WORKFLOW_ASSET}\` |`;
  assert.ok(ROUTER.includes(targetRow), targetRow);
});

test('the router keeps shortcuts and flag handling within the frozen interface', () => {
  assert.match(ROUTER, /`list`, `\?` and `menu` as the whole argument/);
  assert.match(ROUTER, /A second positional token is an argument failure/);
  for (const flag of installRoute().allowed_flags) {
    assert.ok(ROUTER.includes(flag), flag);
  }
});

test('the presentation carries install errors, the build checks, prompt, inspection and ordered steps', () => {
  for (const heading of [
    '## 1. Argument Failure',
    '## 2. The Build Check',
    '## 3. The Install Prompt',
    '## 4. Accepted Answers',
    '## 5. The Symlink Check',
    '## 6. The Ordered Steps',
    '## 7. The Caveat Line',
    '## 8. Result Templates',
  ]) {
    assert.ok(PRESENTATION.includes(heading), heading);
  }
  assert.ok(PRESENTATION.includes('`STATUS=FAIL ERROR="unknown_argument"`'));
  assert.match(PRESENTATION, /^STATUS=OK STEPS=\[n\]$/m);
  assert.match(PRESENTATION, /^1\) Target repo:/m);
  assert.match(PRESENTATION, /^2\) Runtimes:/m);
  assert.match(PRESENTATION, /^3\) Link shape:/m);
  assert.match(PRESENTATION, /^4\) Instruction file:/m);
  assert.match(PRESENTATION, /DOCTOR INSTALL — BUILDS/);
  assert.match(PRESENTATION, /DOCTOR INSTALL — WHAT IS ALREADY THERE/);

  const workflowSteps = WORKFLOW.execution.steps.map((step) => step.match(/^([A-Za-z]+):/)[1]);
  assert.deepEqual(workflowSteps, WORKFLOW_STEP_NAMES);
});

test('the presentation prints writing commands for the operator and closes on the family convention', () => {
  assert.match(PRESENTATION, /A printed step is handed back, never run/);
  assert.match(PRESENTATION, /the operator runs it/);
  assert.match(PRESENTATION, /^STATUS=FAIL ERROR="\[message\]"$/m);
  assert.ok(PRESENTATION.includes('End interactive presentations with: `What would you like to do next?`'));

  assert.ok(PRESENTATION.includes(`\n${SAVE_CAVEAT}\n`), SAVE_CAVEAT);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE READ-ONLY WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('the workflow is read-only, grants no write target and runs the route scripts', () => {
  assert.equal(WORKFLOW.operating_mode.execution, 'read_only');
  assert.equal(WORKFLOW.mutation_boundaries.read_only, true);
  assert.deepEqual(WORKFLOW.mutation_boundaries.allowed_targets, []);
  assert.ok(WORKFLOW_TEXT.includes(ENGINE), ENGINE);

  for (const invocation of installRoute().script_invocations) {
    const command = invocation.split('#')[0].trim();
    assert.ok(WORKFLOW_TEXT.includes(command), command);
  }
});

test('the workflow declares every variable its route resolves', () => {
  for (const key of installRoute().setup_vars) {
    assert.ok(key in WORKFLOW.inputs, `inputs.${key} is missing`);
  }
});

test('the workflow asks once, inspects once and hands all writing steps back', () => {
  const steps = WORKFLOW.execution.steps;
  assert.match(steps[1], /ask once/i);
  assert.match(steps[2], /symlink-engine\.cjs check/);
  assert.equal((steps[2].match(/symlink-engine\.cjs check/g) || []).length, 1);
  assert.match(steps[3], /Print these ordered writing steps/);
  assert.match(steps[3], /never run them/);
  assert.match(steps[4], /fixed caveat/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE COMMAND CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('the doctor contract carries every field its schema requires and nothing it forbids', () => {
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

test('the contract names the install router, workflow, presentation and hint', () => {
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  const presentationPath = `.skilled/commands/doctor/assets/${PRESENTATION_ASSET}`;
  const ownsPresentation = DOCTOR_CONTRACT.owned_assets.some((entry) => (
    entry.purpose === 'presentation'
    && entry.path.replace('doctor-<entry>-presentation.txt', PRESENTATION_ASSET) === presentationPath
  ));

  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/install.md'));
  assert.ok(DOCTOR_CONTRACT.execution_targets
    .some((entry) => entry.target.endsWith(WORKFLOW_ASSET)), WORKFLOW_ASSET);
  assert.ok(ownsPresentation, presentationPath);
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(`${hint} (install)`));
});

test('the contract publishes the install invocation alias', () => {
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  const alias = `/doctor:install ${hint.replace(/ \| list \| \?$/, '')}`;
  assert.ok(DOCTOR_CONTRACT.invocation_aliases.includes(alias), alias);
});

test('the contract describes the install loader behavior', () => {
  assert.ok(
    DOCTOR_CONTRACT.loader_requirements.some((line) => line.includes('/doctor:install')),
    '/doctor:install is missing from loader_requirements',
  );
});
