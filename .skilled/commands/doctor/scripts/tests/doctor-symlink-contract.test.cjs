#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Symlink Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const DOCTOR = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(DOCTOR, 'assets');
const REPO_ROOT = path.resolve(DOCTOR, '..', '..', '..');
const SKILL_DOC_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');
const read = (file) => fs.readFileSync(file, 'utf8');
const TICK = String.fromCharCode(96);

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:symlink');
const routeFor = (target) => ROUTES.find((route) => route.target === target);

const ROUTER = read(path.join(DOCTOR, 'symlink.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-symlink-presentation.txt'));
const CHECK_YAML = read(path.join(ASSETS, 'doctor-symlink-check.yaml'));
const LINK_YAML = read(path.join(ASSETS, 'doctor-symlink-link.yaml'));
const UNLINK_YAML = read(path.join(ASSETS, 'doctor-symlink-unlink.yaml'));
const CHECK_WORKFLOW = parseYaml(CHECK_YAML);
const LINK_WORKFLOW = parseYaml(LINK_YAML);
const UNLINK_WORKFLOW = parseYaml(UNLINK_YAML);
const LINK_PHASES = Object.keys(LINK_WORKFLOW.execution);
const UNLINK_PHASES = Object.keys(UNLINK_WORKFLOW.execution);

const CONTRACT = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.json')));
const SCHEMA = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.schema.json')));
const DOCTOR_CONTRACT = CONTRACT.families.doctor;
const FAMILY_SCHEMA = SCHEMA.definitions.familyContract;

const ENGINE_PATH = '.skilled/commands/doctor/scripts/symlink-engine.cjs';
const MANIFEST_PATH = '.skilled/commands/doctor/assets/symlink-manifest.json';
const ENGINE_COMMANDS = ['check', 'plan', 'apply', 'unlink'];
const { parseArgs: parseEngineArgs } = require(path.join(REPO_ROOT, ENGINE_PATH));

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

const phaseText = (workflow, phase) => yamlStrings(workflow.execution[phase]).join('\n');

const engineOf = (entry) => {
  const match = entry.match(/symlink-engine\.cjs\s+([a-z-]+)/u);
  assert.ok(match, entry);
  return match[1];
};

// The engine's own argument parser is the authority for which flags each subcommand accepts.
// Each probe carries the subcommand's required flags, then offers the flag with and without
// a value; a flag the parser takes in either form is accepted.
const ENGINE_REQUIRED = {
  check: ['--root', '/tmp/doctor-symlink-probe'],
  plan: ['--root', '/tmp/doctor-symlink-probe'],
  apply: ['--root', '/tmp/doctor-symlink-probe', '--plan-digest', 'a'.repeat(64)],
  unlink: ['--run', '/tmp/doctor-symlink-probe'],
};
const PROBE_VALUES = { '--mode': 'auto', '--ignore': 'none', '--runtimes': 'claude', '--include': 'env' };
const CANDIDATE_FLAGS = [
  '--root', '--source', '--runtimes', '--mode', '--include', '--link-instructions', '--ignore',
  '--plan-digest', '--run', '--dry-run', '--yes', '--json',
];

const engineAccepts = (command, flag) => {
  if (ENGINE_REQUIRED[command].includes(flag)) return true;
  for (const tail of [[flag, PROBE_VALUES[flag] || '/tmp/doctor-symlink-probe-value'], [flag]]) {
    try {
      parseEngineArgs([command, ...ENGINE_REQUIRED[command], ...tail]);
      return true;
    } catch {
      // A rejected form is tried in its other shape before the flag counts as unknown.
    }
  }
  return false;
};

const ENGINE_FLAGS = new Map(ENGINE_COMMANDS.map((command) => [
  command,
  new Set(CANDIDATE_FLAGS.filter((flag) => engineAccepts(command, flag))),
]));

// link's --dry-run stops the workflow after the plan is shown. The engine's plan never
// writes, so no engine flag carries it.
const WORKFLOW_ONLY_FLAGS = { link: new Set(['--dry-run']) };

const flagName = (flag) => flag.match(/^--[a-z-]+/u)?.[0] || flag;

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds check, link and unlink routes, with only check as the bare default', () => {
  assert.deepEqual(ROUTES.map((route) => route.target), ['check', 'link', 'unlink']);
  assert.equal(routeFor('check').default_target, true);
  assert.equal(routeFor('link').default_target, undefined);
  assert.equal(routeFor('unlink').default_target, undefined);
  assert.equal(routeFor('check').mutating, 'read-only');
  assert.match(routeFor('check').gate3_location, /^n\/a/u);
  assert.equal(routeFor('link').mutating, 'mutates');
  assert.equal(routeFor('unlink').mutating, 'mutates');

  for (const route of ROUTES) {
    assert.equal(route.yaml, 'doctor-symlink-' + route.target + '.yaml');
    assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
    assert.deepEqual(route.mcp_tools, []);
  }

  assert.deepEqual(routeFor('check').allowed_flags, [
    '--json',
    '--root <dir>',
    '--runtimes <list>',
    '--include <list>',
    '--link-instructions',
  ]);
  assert.deepEqual(routeFor('link').allowed_flags, [
    '--root <dir>',
    '--runtimes <list>',
    '--mode <shape>',
    '--include <list>',
    '--link-instructions',
    '--ignore <where>',
    '--dry-run',
    '--plan-digest <digest>',
  ]);
  assert.deepEqual(routeFor('unlink').allowed_flags, ['--run <dir>', '--yes', '--dry-run']);
});

test('the route manifest header lists every router file in the folder', () => {
  const header = read(path.join(DOCTOR, '_routes.yaml')).split(/^schema_version:/mu)[0];
  const listed = [...header.matchAll(/^#\s+\/doctor:(\S+)\s+\S+\.md$/gmu)]
    .map((match) => match[1])
    .sort();
  const routers = fs.readdirSync(DOCTOR)
    .filter((file) => file.endsWith('.md') && !file.startsWith('local-'))
    .map((file) => file.replace(/\.md$/u, ''))
    .sort();
  assert.deepEqual(listed, routers, 'the header names every router or its count is wrong');
});

test('the writing routes name their write boundary and keep it out of unrelated state', () => {
  const link = routeFor('link').gate3_location;
  for (const expected of [
    /framework links/u,
    /broken links into the Skilled checkout/u,
    /info\/exclude/u,
    /run record/u,
    /plan digest/u,
  ]) {
    assert.match(link, expected);
  }
  assert.doesNotMatch(link, /the git index|history|remotes/u);

  const unlink = routeFor('unlink').gate3_location;
  assert.match(unlink, /manifest\.json/u);
  assert.match(unlink, /changed since the apply/u);
  assert.match(unlink, /run directory itself is read and kept/u);
});

test('each route names its engine calls and its triggers describe the route in plain language', () => {
  for (const route of ROUTES) {
    for (const phrase of route.trigger_phrases) {
      assert.ok(phrase.trim().split(/\s+/u).length >= 3, phrase);
    }
  }

  assert.deepEqual(routeFor('check').script_invocations.map(engineOf), ['check']);
  assert.deepEqual(routeFor('link').script_invocations.map(engineOf), ['plan', 'apply']);
  assert.deepEqual(routeFor('unlink').script_invocations.map(engineOf), ['unlink', 'unlink']);

  const planAndApply = routeFor('link').script_invocations.join('\n');
  assert.match(planAndApply, /symlink-engine\.cjs plan/u);
  assert.doesNotMatch(planAndApply.split('\n')[0], /--plan-digest/u);
  assert.match(planAndApply, /symlink-engine\.cjs apply --root <dir> --plan-digest <digest>/u);
  assert.match(routeFor('unlink').script_invocations[0], /unlink --run <dir> --dry-run/u);
  assert.match(routeFor('unlink').script_invocations[1], /unlink --run <dir> --yes/u);
});

test('every route flag is accepted by an engine subcommand that route invokes', () => {
  const unsupported = [];
  for (const route of ROUTES) {
    const subcommands = new Set(route.script_invocations.map(engineOf));
    const accepted = new Set([...subcommands].flatMap((command) => [...ENGINE_FLAGS.get(command)]));
    for (const allowedFlag of route.allowed_flags) {
      const name = flagName(allowedFlag);
      if (!accepted.has(name) && !WORKFLOW_ONLY_FLAGS[route.target]?.has(name)) {
        unsupported.push(route.target + ' ' + name);
      }
    }
  }
  assert.deepEqual(unsupported, [], 'route flags outside the engine CLI contract');
});

test('every engine invocation uses flags accepted by the documented subcommand', () => {
  const unsupported = [];
  for (const route of ROUTES) {
    for (const invocation of route.script_invocations) {
      const command = engineOf(invocation);
      const call = invocation.split('#')[0];
      const flags = [...call.matchAll(/(--[a-z-]+)/gu)].map((match) => match[1]);
      for (const flag of flags) {
        if (!ENGINE_FLAGS.get(command).has(flag)) unsupported.push(route.target + ' ' + command + ' ' + flag);
      }
    }
  }
  assert.deepEqual(unsupported, [], 'engine invocations outside the CLI contract');
});

test('the router follows the six-section router template and keeps presentation out of line', () => {
  const headings = [...ROUTER.matchAll(/^## \d+\. ([A-Z ]+)$/gmu)].map((match) => match[1]);
  assert.deepEqual(headings, [
    'ROUTER CONTRACT',
    'OWNED ASSETS',
    'MODE ROUTING',
    'EXECUTION TARGETS',
    'PRESENTATION BOUNDARY',
    'WORKFLOW SUMMARY',
  ]);
  assert.equal(ROUTER.includes(TICK.repeat(3)), false);
  assert.doesNotMatch(ROUTER, /STATUS=/u);
});

test('the router frontmatter stays within budget and grants only the tools it uses', () => {
  const description = ROUTER.match(/^description:\s*"(.*)"$/mu)?.[1];
  assert.ok(description);
  assert.ok(description.length <= 110, 'description is ' + description.length + ' chars');
  assert.doesNotMatch(description, /[<>]/u);

  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/mu)?.[1];
  assert.ok(hint);
  assert.ok(hint.length <= 140, 'argument-hint is ' + hint.length + ' chars');
  for (const token of [
    '[check|link|unlink]',
    '[--root <dir>]',
    '[--runtimes <list>]',
    '[--mode <shape>]',
    '[--plan-digest <digest>]',
    '[--run <dir>]',
    '[--yes]',
  ]) {
    assert.ok(hint.includes(token), token);
  }

  const tools = ROUTER.match(/^allowed-tools:\s*(.+)$/mu)[1].split(',').map((tool) => tool.trim());
  assert.deepEqual(tools, ['Read', 'Bash']);
  assert.equal(ROUTER.split('<!-- skill_agent: system-skilled-doctor -->').length - 1, 1);
});

test('the router binds each target to the workflow asset its route names', () => {
  for (const route of ROUTES) {
    const row = '| ' + TICK + route.target + TICK + ' | ' + TICK
      + '.skilled/commands/doctor/assets/' + route.yaml + TICK + ' |';
    assert.ok(ROUTER.includes(row), route.target);
  }
});

test('the router names the engine and manifest as owned assets and composes no link itself', () => {
  const owned = ROUTER.split('## 2. OWNED ASSETS')[1].split('## 3.')[0];
  assert.ok(owned.includes(ENGINE_PATH), ENGINE_PATH);
  assert.ok(owned.includes(MANIFEST_PATH), MANIFEST_PATH);
  assert.ok(owned.includes('doctor-symlink-presentation.txt'));
  assert.match(ROUTER, /Do not compose a link, remove one or hash a plan/u);
});

test('the router resolves the bare command to check and keeps every write behind digest and yes', () => {
  assert.match(ROUTER, /default_target/u);
  assert.match(ROUTER, /A bare .*never reaches .*which write/u);
  assert.match(ROUTER, /never runs .*apply.*without the digest its own plan printed/u);
  assert.match(ROUTER, /never runs a writing target without its yes/u);
});

test('the router workflow summary runs plan, digest, question, apply and re-read in order', () => {
  const summary = ROUTER.split('## 6. WORKFLOW SUMMARY')[1];
  const steps = summary.split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+\. /u.test(line));
  const at = (pattern) => {
    const index = steps.findIndex((step) => pattern.test(step));
    assert.ok(index >= 0, 'no step names ' + pattern);
    return index;
  };

  const plan = at(/symlink-engine\.cjs plan/u);
  const digest = at(/plan digest/u);
  const question = at(/asks the link question/u);
  const apply = at(/symlink-engine\.cjs apply --plan-digest/u);
  const reread = at(/post-apply check summary/u);
  assert.ok(plan < digest, 'the plan prints before its digest is offered');
  assert.ok(digest < question, 'the digest is named before the question');
  assert.ok(question < apply, 'apply follows the link question');
  assert.ok(apply < reread, 'the re-read follows apply');
  assert.match(steps.join('\n'), /ends the run as cancelled/u);
  assert.match(steps.join('\n'), /nothing is written/u);
  assert.match(steps.join('\n'), /unlink/u);
});

test('the presentation carries the menu, accepted answers and route manifest rows', () => {
  assert.match(PRESENTATION, /^## 1\. Argument Failure$/mu);
  assert.match(PRESENTATION, /^1\) check$/mu);
  assert.match(PRESENTATION, /^2\) link$/mu);
  assert.match(PRESENTATION, /^3\) unlink$/mu);
  for (const row of [
    '| ' + TICK + '1' + TICK + ' | target = ' + TICK + 'check' + TICK + ' |',
    '| ' + TICK + '2' + TICK + ' | target = ' + TICK + 'link' + TICK + ' |',
    '| ' + TICK + '3' + TICK + ' | target = ' + TICK + 'unlink' + TICK + ' |',
  ]) {
    assert.ok(PRESENTATION.includes(row), row);
  }
  assert.match(PRESENTATION, /^Valid targets: check, link, unlink$/mu);
  for (const [target, workflow, mutation] of [
    ['check', 'doctor-symlink-check.yaml', 'read-only'],
    ['link', 'doctor-symlink-link.yaml', 'mutates'],
    ['unlink', 'doctor-symlink-unlink.yaml', 'mutates'],
  ]) {
    const row = '| ' + TICK + target + TICK + ' | ' + TICK + workflow + TICK + ' | ' + mutation + ' |';
    assert.ok(PRESENTATION.includes(row), target);
  }
});

test('the argument table defines a missing value and second positional for every target', () => {
  const table = PRESENTATION.split('## 1. Argument Failure')[1].split(/\n## 2\./u)[0];
  const rows = table.split('\n').filter((line) => line.startsWith('| '));
  const missing = rows.find((line) => /value flag given without its value/u.test(line));
  assert.ok(missing, 'no row for a value flag given without its value');
  for (const flag of ['--root', '--runtimes', '--mode', '--include', '--ignore', '--plan-digest', '--run']) {
    assert.ok(missing.includes(flag), flag + ' is not named');
  }
  assert.match(missing, /STATUS=FAIL ERROR="missing_argument"/u);
  assert.match(missing, /Try: /u);

  const second = rows.find((line) => /second positional/u.test(line));
  assert.ok(second, 'no row for a second positional');
  assert.match(second, /\/doctor:symlink check \[--json\] \[--root <dir>\]/u);
  assert.match(second, /\/doctor:symlink link \[--dry-run\]/u);
  assert.match(second, /\/doctor:symlink unlink --run <dir>/u);
  assert.match(second, /STATUS=FAIL ERROR="too_many_arguments"/u);
  assert.match(ROUTER, /a value flag without its value/u);
  assert.match(ROUTER, /a second positional/u);
});

test('the check presentation carries status, JSON and result fields', () => {
  for (const status of [
    'linked-whole',
    'linked-merge',
    'partial-merge',
    'missing',
    'broken',
    'foreign-link',
    'local',
    'source-missing',
  ]) {
    assert.ok(PRESENTATION.includes(status), status);
  }
  assert.match(PRESENTATION, /^Skilled link check: \[the root the engine read\]$/mu);
  assert.match(PRESENTATION, /^DOCTOR DIAGNOSTIC RESULT$/mu);
  const statusTemplates = PRESENTATION.split(/\r?\n/u).filter((line) => /^STATUS=\[/u.test(line));
  assert.ok(statusTemplates.length > 0, 'presentation has a STATUS template');
  assert.deepEqual(statusTemplates, statusTemplates.map(() => 'STATUS=[OK|WARN|FAIL]'));
  assert.match(PRESENTATION, /^Status: \[OK\|WARN\|FAIL\]$/mu);
  assert.match(PRESENTATION, /`Status` is `OK` when the engine exits 0, `WARN` when it exits 1 and `FAIL` when it exits 2/u);
  assert.doesNotMatch(PRESENTATION, /FINDINGS/u);
  assert.match(PRESENTATION, /print the engine's JSON and nothing else/u);
  assert.match(PRESENTATION, /^Plan digest: \[the engine's plan-digest line\]$/mu);
  assert.match(PRESENTATION, /Link the Skilled checkout into this repository now\? \[yes\/no\]\n?$/u);
  assert.match(PRESENTATION, /the digest on screen is the digest the apply repeats/u);
  assert.match(PRESENTATION, /never compose a plan digest/u);
});

test('the presentation closes on cancelled, dry-run and failure results', () => {
  assert.match(PRESENTATION, /^STATUS=CANCELLED ACTION=cancelled$/mu);
  assert.match(PRESENTATION, /^Changed: none$/mu);
  assert.match(PRESENTATION, /^Dry run: nothing was written and nothing was asked\.$/mu);
  assert.match(PRESENTATION, /^STATUS=FAIL ERROR="\[code\]"$/mu);
  assert.match(PRESENTATION, /End interactive presentations with:.*What would you like to do next/u);
  assert.equal(PRESENTATION.split('STATUS=CANCELLED ACTION=cancelled').length - 1, 2);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE CHECK WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('the check workflow is read-only and runs only the check engine', () => {
  assert.equal(CHECK_WORKFLOW.operating_mode.execution, 'read_only');
  assert.equal(CHECK_WORKFLOW.mutation_boundaries.read_only, true);
  assert.deepEqual(CHECK_WORKFLOW.mutation_boundaries.allowed_targets, []);
  assert.ok(CHECK_YAML.includes(ENGINE_PATH), ENGINE_PATH);
  assert.match(CHECK_WORKFLOW.mutation_boundaries.invariant, /check subcommand only/u);
  assert.doesNotMatch(CHECK_YAML, /symlink-engine\.cjs (?:plan|apply|unlink)/u);
});

test('the check workflow declares every variable the route resolves', () => {
  for (const key of routeFor('check').setup_vars) {
    assert.ok(key in CHECK_WORKFLOW.inputs, 'inputs.' + key + ' is missing');
  }
});

test('the check workflow forwards optional flags only when requested', () => {
  assert.match(CHECK_WORKFLOW.inputs.json_output, /pass --json/u);
  assert.match(CHECK_YAML, /--json when requested/u);
  assert.match(CHECK_WORKFLOW.inputs.root, /--root <dir>/u);
  assert.match(CHECK_WORKFLOW.inputs.runtimes, /--runtimes/u);
  assert.match(CHECK_WORKFLOW.inputs.include, /--include/u);
  assert.match(CHECK_WORKFLOW.inputs.link_instructions, /--link-instructions/u);
  assert.match(CHECK_YAML, /check --root "\{root\}"/u);
});

test('the check workflow maps the engine exit classes to the route status', () => {
  assert.match(CHECK_WORKFLOW.output, /STATUS=OK/u);
  assert.match(CHECK_WORKFLOW.output, /STATUS=WARN/u);
  assert.match(CHECK_WORKFLOW.output, /STATUS=FAIL/u);
  assert.match(CHECK_YAML, /Exit 0 means no drift/u);
  assert.match(CHECK_YAML, /Exit 1 means drift was found/u);
  assert.match(CHECK_YAML, /Exit 2 means the invocation/u);
  assert.match(CHECK_WORKFLOW.output, /engine exits 2/u);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE LINK AND UNLINK WORKFLOWS
// ─────────────────────────────────────────────────────────────────────────────

test('the link workflow is interactive, digest-gated and never commits', () => {
  assert.equal(LINK_WORKFLOW.operating_mode.execution, 'interactive');
  assert.equal(LINK_WORKFLOW.operating_mode.approvals, 'explicit_yes');
  assert.equal(LINK_WORKFLOW.operating_mode.planning, 'show_plan_and_digest_before_question');
  assert.equal(LINK_WORKFLOW.operating_mode.tracking, 'one_plan_digest');
  assert.equal(LINK_WORKFLOW.operating_mode.never_commit, true);
  assert.deepEqual(LINK_WORKFLOW.output.statuses, ['OK', 'CANCELLED', 'FAIL']);
  assert.equal(LINK_WORKFLOW.output.presentation, '.skilled/commands/doctor/assets/doctor-symlink-presentation.txt');
  assert.equal(LINK_WORKFLOW.mutation_boundaries.read_only, false);

  const allowed = LINK_WORKFLOW.mutation_boundaries.allowed_targets.join('\n');
  assert.match(allowed, /Only link paths and directories listed by the plan/u);
  assert.match(allowed, /\.git\/info\/exclude or \.gitignore/u);
  assert.match(allowed, /doctor-symlink\/<first 16 hex characters/u);
  const forbidden = LINK_WORKFLOW.mutation_boundaries.forbidden_targets.join('\n');
  assert.match(forbidden, /Any path that the plan does not list/u);
  assert.match(forbidden, /git index, history and remotes/u);
  assert.match(LINK_WORKFLOW.mutation_boundaries.invariant, /digest differs/u);
});

test('the link workflow runs read, plan, approval, apply and report in order', () => {
  assert.deepEqual(LINK_PHASES, [
    'phase_1_read',
    'phase_2_plan',
    'phase_3_approval',
    'phase_4_apply',
    'phase_5_report',
  ]);

  const plan = phaseText(LINK_WORKFLOW, 'phase_2_plan');
  assert.match(plan, /symlink-engine\.cjs plan/u);
  assert.doesNotMatch(plan, /--plan-digest/u);
  assert.match(plan, /plan digest/iu);

  const approval = phaseText(LINK_WORKFLOW, 'phase_3_approval');
  assert.match(approval, /Ask the one link question/u);
  assert.match(approval, /Any answer other than yes is a no/u);
  assert.match(approval, /STATUS=CANCELLED ACTION=cancelled/u);
  assert.match(approval, /Do not run apply/u);

  const apply = phaseText(LINK_WORKFLOW, 'phase_4_apply');
  assert.match(apply, /symlink-engine\.cjs apply --root/u);
  assert.match(apply, /--plan-digest/u);
  assert.match(apply, /only after the operator approves/u);
  assert.match(apply, /same optional flags/u);
  assert.match(apply, /undo command/u);
});

test('the link workflow declares every variable the route resolves', () => {
  const missing = routeFor('link').setup_vars.filter((key) => !(key in LINK_WORKFLOW.inputs));
  assert.deepEqual(missing, [], 'link workflow inputs missing route variables');
});

test('the link workflow handles its route dry-run flag before approval or apply', () => {
  assert.ok('dry_run' in LINK_WORKFLOW.inputs, 'inputs.dry_run is missing');
  assert.match(phaseText(LINK_WORKFLOW, 'phase_2_plan'), /dry_run/u);
  assert.match(phaseText(LINK_WORKFLOW, 'phase_2_plan'), /writes nothing/u);
});

test('the unlink workflow is interactive and changes only recorded paths', () => {
  assert.equal(UNLINK_WORKFLOW.operating_mode.execution, 'interactive');
  assert.equal(UNLINK_WORKFLOW.operating_mode.approvals, 'explicit_yes');
  assert.equal(UNLINK_WORKFLOW.operating_mode.never_commit, true);
  assert.deepEqual(UNLINK_WORKFLOW.output.statuses, ['OK', 'CANCELLED', 'FAIL']);
  assert.equal(UNLINK_WORKFLOW.output.presentation, '.skilled/commands/doctor/assets/doctor-symlink-presentation.txt');
  assert.equal(UNLINK_WORKFLOW.mutation_boundaries.read_only, false);

  const allowed = UNLINK_WORKFLOW.mutation_boundaries.allowed_targets.join('\n');
  assert.match(allowed, /Only paths listed in the run manifest/u);
  assert.match(allowed, /Only directories listed in created_dirs/u);
  assert.match(allowed, /Only the exact lines listed in ignore_added/u);
  const forbidden = UNLINK_WORKFLOW.mutation_boundaries.forbidden_targets.join('\n');
  assert.match(forbidden, /Any path not listed in the run manifest/u);
  assert.match(forbidden, /run directory, its manifest and its copies/u);
  assert.match(forbidden, /git index, history and remotes/u);
});

test('the unlink workflow shows the dry-run plan, asks once and writes only after yes', () => {
  assert.deepEqual(UNLINK_PHASES, [
    'phase_1_read',
    'phase_2_plan',
    'phase_3_approval',
    'phase_4_unlink',
    'phase_5_report',
  ]);

  const plan = phaseText(UNLINK_WORKFLOW, 'phase_2_plan');
  assert.match(plan, /symlink-engine\.cjs unlink --run .*--dry-run/u);
  assert.doesNotMatch(plan, /--yes/u);
  assert.match(plan, /dry-run writes nothing/u);

  const approval = phaseText(UNLINK_WORKFLOW, 'phase_3_approval');
  assert.match(approval, /Ask the one unlink question/u);
  assert.match(approval, /Any answer other than yes is a no/u);
  assert.match(approval, /Do not run unlink with --yes/u);

  const write = phaseText(UNLINK_WORKFLOW, 'phase_4_unlink');
  assert.match(write, /symlink-engine\.cjs unlink --run .*--yes/u);
  assert.match(write, /only after the unlink yes/u);
  assert.match(write, /changed since apply/u);
  assert.match(write, /keeps the run directory/u);
});

test('the unlink workflow declares every variable the route resolves', () => {
  const missing = routeFor('unlink').setup_vars.filter((key) => !(key in UNLINK_WORKFLOW.inputs));
  assert.deepEqual(missing, [], 'unlink workflow inputs missing route variables');
});

test('the unlink workflow lets an explicit dry run end before its approval question', () => {
  assert.ok('dry_run' in UNLINK_WORKFLOW.inputs, 'inputs.dry_run is missing');
  assert.match(phaseText(UNLINK_WORKFLOW, 'phase_2_plan'), /dry_run/u);
  assert.match(phaseText(UNLINK_WORKFLOW, 'phase_2_plan'), /end the run without asking/u);
});

test('the doctor family contract carries every schema-required field and no unknown field', () => {
  for (const key of FAMILY_SCHEMA.required) {
    assert.ok(key in DOCTOR_CONTRACT, 'families.doctor is missing ' + key);
  }
  const known = new Set(Object.keys(FAMILY_SCHEMA.properties));
  assert.deepEqual(
    Object.keys(DOCTOR_CONTRACT).filter((key) => !known.has(key)),
    [],
    'the schema forbids an additional property',
  );
  assert.ok(FAMILY_SCHEMA.properties.topology.enum.includes(DOCTOR_CONTRACT.topology));
});

test('the doctor family contract names the symlink router and generic route assets', () => {
  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/symlink.md'));
  const routeTarget = DOCTOR_CONTRACT.execution_targets.find((entry) => /symlink/u.test(entry.selector));
  assert.ok(routeTarget, 'the family contract has no symlink route selector');
  assert.match(routeTarget.target, /<the route's yaml>, named per route in _routes\.yaml/u);
  assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => (
    entry.purpose === 'route_manifest' && entry.path === '.skilled/commands/doctor/_routes.yaml'
  )));
  assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => (
    entry.purpose === 'presentation' && entry.path.endsWith('doctor-<entry>-presentation.txt')
  )));
  assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => entry.path.includes('doctor-<target>.yaml')));
  assert.equal(DOCTOR_CONTRACT.presentation.owner, 'presentation-asset');

  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/mu)[1];
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(hint + ' (symlink)'));
});

test('the doctor family contract owns the symlink engine and entry manifest', () => {
  for (const asset of [ENGINE_PATH, MANIFEST_PATH]) {
    assert.ok(
      DOCTOR_CONTRACT.owned_assets.some((entry) => entry.path.includes(asset)),
      asset,
    );
  }
});

test('the doctor family loader requirements preserve the symlink route contract', () => {
  const lines = DOCTOR_CONTRACT.loader_requirements.filter((line) => line.includes('/doctor:symlink'));
  assert.ok(lines.length > 0, 'the family contract has no symlink loader requirement');
  const text = lines.join('\n');
  assert.match(text, /check is the read-only default target/u);
  assert.match(text, /plan digest/u);
  assert.match(text, /unlink/u);
  assert.match(text, /STATUS=CANCELLED/u);
});

test('the doctor family destructive policy names the gated symlink writes', () => {
  assert.equal(DOCTOR_CONTRACT.destructive_policy.has_destructive_ops, true);
  assert.equal(DOCTOR_CONTRACT.destructive_policy.gated, true);
  assert.ok(
    DOCTOR_CONTRACT.destructive_policy.operations.some((line) => /symlink/u.test(line)),
    'the family contract has no symlink write operation',
  );
});

test('the doctor family invocation aliases include the symlink command form', () => {
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/mu)[1];
  assert.ok(
    DOCTOR_CONTRACT.invocation_aliases.some((alias) => (
      alias.startsWith('/doctor:symlink ') && alias.includes(hint)
    )),
    'the family contract has no /doctor:symlink invocation alias',
  );
});
