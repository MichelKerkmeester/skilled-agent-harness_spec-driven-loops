#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Overlay Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Holds /doctor:overlay together: the routes in the manifest, the router, the
// presentation contract, the workflows and the command contract must agree on the
// targets, the default target, the flags each target owns and the assets they name.
//
// The engine's own suites prove what the engine writes. What only this suite can see
// is the promise around it: that a bare command never reaches a writing target,
// that every flag a route allows is a flag the engine parses, and that each writing
// workflow asks before it runs the engine.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const DOCTOR = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(DOCTOR, 'assets');
const ENGINE = path.join(DOCTOR, 'scripts', 'overlay-engine.cjs');
const CONTRACT_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');

const read = (file) => fs.readFileSync(file, 'utf8');

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:overlay');
const routeFor = (target) => ROUTES.find((route) => route.target === target);

const ROUTER = read(path.join(DOCTOR, 'overlay.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-overlay-presentation.txt'));
const SETUP_PRESENTATION = read(path.join(ASSETS, 'doctor-setup-presentation.txt'));
const DOCTOR_CONTRACT = JSON.parse(read(path.join(CONTRACT_ASSETS, 'command-contract.json'))).families.doctor;

const MISSING_TREE = path.join(os.tmpdir(), `doctor-overlay-no-such-tree-${process.pid}`);
const MISSING_STAGE = path.join(os.tmpdir(), `doctor-overlay-no-such-stage-${process.pid}`);

// The repin target lands in the engine separately from its route. Until the engine's
// usage block names it, the repin probes have no parser to ask and are skipped.
const ENGINE_USAGE = spawnSync(process.execPath, [ENGINE, '--help'], { encoding: 'utf8' }).stdout;
const ENGINE_HAS_REPIN = /\brepin\b/.test(ENGINE_USAGE);

// A flag declared as "--root <dir>" takes one value, and a bare "--json" takes none.
// --root always points at a folder that does not exist, so no probe can reach a tree.
function argvFor(flags) {
  const argv = [];
  for (const flag of flags) {
    const [name, value] = flag.split(' ');
    if (name === '--root') continue;
    argv.push(name);
    if (value) argv.push('some/path.md');
  }
  return [...argv, '--root', MISSING_TREE];
}

// The engine reports a missing root only after its parser accepted the arguments, and
// prints its usage block when the parser refused them, so the two outputs tell a flag
// the engine takes apart from one it lacks without touching any tree.
function engineParses(target, flags) {
  return engineAccepts([target, ...argvFor(flags)]);
}

function engineAccepts(argv) {
  const result = spawnSync(process.execPath, [ENGINE, ...argv], { encoding: 'utf8' });
  return { status: result.status, accepted: /root is not a directory/.test(result.stdout) };
}

// A workflow names a route's invocation with each <placeholder> filled by one of its
// own {variables}, such as --capture "{capture_path}".
function invocationPattern(invocation) {
  const command = invocation.split('#')[0].trim();
  const escaped = command.split(/ <[^>]+>/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(escaped.join(' "?\\{[a-z_]+\\}"?'));
}

function yamlStrings(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((value) => yamlStrings(value, out));
  else if (node && typeof node === 'object') Object.values(node).forEach((value) => yamlStrings(value, out));
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds status, apply and repin routes, and only status answers the bare command', () => {
  assert.deepEqual(ROUTES.map((route) => route.target), ['status', 'apply', 'repin']);
  assert.equal(routeFor('status').default_target, true);
  assert.equal(routeFor('status').mutating, 'read-only');
  assert.match(routeFor('status').gate3_location, /^n\/a/);
  // A bare invocation must never reach a route that writes.
  for (const target of ['apply', 'repin']) {
    assert.equal(routeFor(target).default_target, undefined, target);
    assert.equal(routeFor(target).mutating, 'mutates', target);
  }
  for (const route of ROUTES) {
    assert.equal(route.yaml, `doctor-overlay-${route.target}.yaml`);
    assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
    assert.deepEqual(route.mcp_tools, []);
  }
  assert.deepEqual(routeFor('status').allowed_flags, ['--json', '--root <dir>']);
  assert.deepEqual(routeFor('apply').allowed_flags, ['--root <dir>', '--capture <path>', '--adopt <path>']);
  assert.deepEqual(routeFor('repin').allowed_flags, ['--root <dir>', '--upstream <dir>', '--to <commit>', '--rollback <run-id>']);
  // The phrase moved off the read-only route, so a re-pin request reaches the target that re-pins.
  assert.ok(routeFor('repin').trigger_phrases.includes('re-pin my vendored Skilled'));
  assert.ok(!routeFor('status').trigger_phrases.includes('re-pin my vendored Skilled'));
});

test('the engine parses every flag each route allows and refuses a flag the other target owns', () => {
  // --capture and --adopt name two different writes, so apply takes one of them
  // at a time and each is probed on its own beside the flags that combine.
  const exclusive = ['--capture <path>', '--adopt <path>'];
  for (const route of ROUTES.filter((entry) => entry.target !== 'repin')) {
    const shared = route.allowed_flags.filter((flag) => !exclusive.includes(flag));
    const alone = route.allowed_flags.filter((flag) => exclusive.includes(flag));
    for (const flags of alone.length > 0 ? alone.map((flag) => [...shared, flag]) : [shared]) {
      const { status, accepted } = engineParses(route.target, flags);
      assert.equal(status, 2, route.target);
      assert.ok(accepted, `the engine refused a flag ${route.target} allows: ${flags.join(' ')}`);
    }
  }
  assert.equal(engineParses('apply', exclusive).accepted, false, 'apply must not take --capture with --adopt');
  assert.equal(engineParses('status', ['--adopt <path>']).accepted, false, 'status must not take --adopt');
  assert.equal(engineParses('apply', ['--json']).accepted, false, 'apply must not take --json');
  assert.equal(engineParses('status', ['--capture <path>']).accepted, false, 'status must not take --capture');
  assert.equal(engineParses('status', ['--upstream <dir>']).accepted, false, 'status must not take --upstream');
  assert.equal(engineParses('apply', ['--to <commit>']).accepted, false, 'apply must not take --to');
});

test('the engine parses the three repin forms the workflow runs and refuses a mixed one', { skip: !ENGINE_HAS_REPIN && 'the engine usage block does not name repin yet' }, () => {
  // --upstream names a real folder that is no checkout, and --root a missing one, so
  // the engine stops at the root check and no probe can reach a tree.
  const live = ['repin', '--upstream', os.tmpdir(), '--to', 'HEAD', '--root', MISSING_TREE];
  try {
    for (const argv of [live, [...live, '--stage', MISSING_STAGE], ['repin', '--rollback', 'some-run', '--root', MISSING_TREE]]) {
      const { status, accepted } = engineAccepts(argv);
      assert.equal(status, 2, argv.join(' '));
      assert.ok(accepted, `the engine refused a form the repin workflow runs: ${argv.join(' ')}`);
    }
    assert.equal(engineAccepts([...live, '--capture', 'some/path.md']).accepted, false, 'repin must not take --capture');
    assert.equal(engineAccepts(['repin', '--rollback', 'some-run', '--to', 'HEAD', '--root', MISSING_TREE]).accepted, false,
      '--rollback must not combine with --to');
  } finally {
    fs.rmSync(MISSING_STAGE, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE ROUTER AND THE PRESENTATION
// ─────────────────────────────────────────────────────────────────────────────

test('the router carries the owner tag on line 6, the template sections and one row per target', () => {
  assert.equal(ROUTER.split('\n')[5], '<!-- skill_agent: system-skilled-doctor -->');
  assert.equal(ROUTER.split('<!-- skill_agent:').length - 1, 1);
  const tools = ROUTER.match(/^allowed-tools:\s*(.+)$/m)[1].split(',').map((tool) => tool.trim());
  assert.deepEqual(tools, ['Read', 'Bash']);
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(hint.length <= 140, `argument-hint is ${hint.length} chars`);
  assert.ok(hint.startsWith('[status|apply|repin]'), hint);

  const headings = [...ROUTER.matchAll(/^## \d+\. ([A-Z ]+)$/gm)].map((match) => match[1]);
  assert.deepEqual(headings, [
    'ROUTER CONTRACT',
    'OWNED ASSETS',
    'MODE ROUTING',
    'EXECUTION TARGETS',
    'PRESENTATION BOUNDARY',
    'WORKFLOW SUMMARY',
  ]);
  assert.doesNotMatch(ROUTER, /```|STATUS=/);
  for (const route of ROUTES) {
    const row = `| \`${route.target}\` | \`.skilled/commands/doctor/assets/${route.yaml}\` |`;
    assert.ok(ROUTER.includes(row), row);
  }
  assert.match(ROUTER, /A bare `\/doctor:overlay` never reaches `apply`, which writes, or `repin`, which writes too/);
});

test('the presentation menu and the target list name exactly the manifest targets, in order', () => {
  const menu = PRESENTATION.match(/```text\n(What do you want to do\?[\s\S]*?)```/)[1];
  const numbered = [...menu.matchAll(/^\d+\) (\S+)$/gm)].map((match) => match[1]);
  assert.deepEqual(numbered, ROUTES.map((route) => route.target));
  assert.match(PRESENTATION, new RegExp(`^Valid targets: ${ROUTES.map((route) => route.target).join(', ')}$`, 'm'));
  for (const route of ROUTES) {
    assert.match(PRESENTATION, new RegExp(`^\\| \`${route.target}\` \\| \`${route.yaml}\` \\| ${route.mutating} \\|`, 'm'));
  }
  const setupRows = SETUP_PRESENTATION.split('\n').filter((line) => line.includes('/doctor:overlay'));
  assert.equal(setupRows.length, 1);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE WORKFLOWS
// ─────────────────────────────────────────────────────────────────────────────

test('status writes nothing, and each writing target asks before the phases that run a writing engine call', () => {
  const status = parseYaml(read(path.join(ASSETS, routeFor('status').yaml)));
  assert.equal(status.mutation_boundaries.read_only, true);
  assert.deepEqual(status.mutation_boundaries.allowed_targets, []);

  const applyText = read(path.join(ASSETS, routeFor('apply').yaml));
  const apply = parseYaml(applyText);
  assert.equal(apply.operating_mode.approvals, 'explicit_yes');
  const phases = Object.keys(apply.workflow);
  const writingPhases = phases.filter((phase) => apply.workflow[phase].activities
    .some((line) => /overlay-engine\.cjs apply/.test(line)));
  assert.deepEqual(writingPhases, ['phase_4_write']);
  assert.ok(phases.indexOf('phase_3_approval') < phases.indexOf('phase_4_write'));

  for (const route of ROUTES) {
    const workflow = parseYaml(read(path.join(ASSETS, route.yaml)));
    const text = yamlStrings(workflow).join('\n');
    for (const invocation of route.script_invocations) {
      assert.match(text, invocationPattern(invocation), `${route.yaml} never runs ${invocation.split('#')[0].trim()}`);
    }
    for (const key of route.setup_vars) {
      assert.ok(key in workflow.inputs, `${route.yaml} inputs.${key} is missing`);
    }
  }
  // The engine has no plan, digest or dry-run mode, so no such flag may reach it.
  assert.doesNotMatch(applyText, /--plan-digest|--dry-run|--yes/);
});

test('repin stages first, writes only after its yes, and rolls back only after a second yes', () => {
  const repinText = read(path.join(ASSETS, routeFor('repin').yaml));
  const repin = parseYaml(repinText);
  assert.equal(repin.operating_mode.approvals, 'explicit_yes');
  const phases = Object.keys(repin.workflow);
  const activitiesOf = (phase) => repin.workflow[phase].activities;
  const runs = (line) => /overlay-engine\.cjs repin /.test(line);

  // The stage is the plan and runs only in the plan phase, before any question.
  const stagePhases = phases.filter((phase) => activitiesOf(phase).some((line) => runs(line) && /--stage/.test(line)));
  assert.deepEqual(stagePhases, ['phase_2_plan']);
  assert.ok(activitiesOf('phase_2_plan').some((line) => /blocked/.test(line) && /before the question/.test(line)));

  const writingPhases = phases.filter((phase) => activitiesOf(phase).some((line) => runs(line) && !/--stage/.test(line)));
  assert.deepEqual(writingPhases, ['phase_4_write', 'phase_5_rollback']);
  assert.ok(phases.indexOf('phase_2_plan') < phases.indexOf('phase_3_approval'));
  assert.ok(phases.indexOf('phase_3_approval') < phases.indexOf('phase_4_write'));

  // The rollback phase asks its own question before the line that restores.
  const rollback = activitiesOf('phase_5_rollback');
  const asks = rollback.findIndex((line) => /ask the rollback question/.test(line));
  const restores = rollback.findIndex((line) => /repin --rollback/.test(line));
  assert.ok(asks !== -1 && asks < restores, 'phase_5_rollback must ask before it restores');
  assert.ok(rollback[restores].startsWith('After the rollback yes'), rollback[restores]);

  // The presentation carries both questions the workflow asks.
  assert.match(PRESENTATION, /^Re-pin this tree to \[commit\] now\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /^Roll this re-pin back now\? \[yes\/no\]$/m);
  assert.doesNotMatch(repinText, /--plan-digest|--dry-run|--yes/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE COMMAND CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

test('the doctor contract names the overlay router, its workflows, presentation, hint and alias', () => {
  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/overlay.md'));
  for (const route of ROUTES) {
    assert.ok(DOCTOR_CONTRACT.execution_targets.some((entry) => entry.target.endsWith(route.yaml)), route.yaml);
  }
  assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => entry.purpose === 'presentation'
    && entry.path.endsWith('doctor-overlay-presentation.txt')));
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(`${hint} (overlay)`));
  assert.ok(DOCTOR_CONTRACT.invocation_aliases.includes(`/doctor:overlay ${hint.replace(/ \| list \| \?$/, '')}`));
  for (const target of ['apply', 'repin']) {
    assert.ok(DOCTOR_CONTRACT.loader_requirements.some((line) => line.startsWith(`/doctor:overlay ${target}`)), target);
  }
});
