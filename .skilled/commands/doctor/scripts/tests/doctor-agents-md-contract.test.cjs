#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Agents-MD Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Holds /doctor:agents-md together: the three routes in the manifest, the router,
// the presentation contract, the three workflows and the command contract must
// agree on the targets, the mutation classes, the asset paths, the engines they
// name and the order a write happens in.
//
// The route validator checks structure and the engines' own suites check the bytes
// they produce. What nothing else can see is the promise between the two: that the
// writing workflow is shaped as plan, digest, yes and only then a write, that a no
// leaves the tree exactly as it was, that the workflow's allowlist is the engine's
// own list rather than a second one that drifts from it, and that the router stays
// a router. This suite asserts those promises by reading the files.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const DOCTOR = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(DOCTOR, 'assets');
const SCRIPTS = path.join(DOCTOR, 'scripts');
const COMMANDS = path.resolve(DOCTOR, '..');
const SKILL_DOC_ASSETS = path.resolve(DOCTOR, '..', '..', 'skills', 'sk-doc', 'sk-create-command', 'assets');

const read = (file) => fs.readFileSync(file, 'utf8');

const MANIFEST = parseYaml(read(path.join(DOCTOR, '_routes.yaml')));
const ROUTES = MANIFEST.routes.filter((route) => route.command === '/doctor:agents-md');
const routeFor = (target) => ROUTES.find((route) => route.target === target);

const ROUTER = read(path.join(DOCTOR, 'agents-md.md'));
const PRESENTATION = read(path.join(ASSETS, 'doctor-agents-md-presentation.txt'));
const CHECK_YAML = read(path.join(ASSETS, 'doctor-agents-md-check.yaml'));
const EMBED_YAML = read(path.join(ASSETS, 'doctor-agents-md-embed.yaml'));
const RESTORE_YAML = read(path.join(ASSETS, 'doctor-agents-md-restore.yaml'));
const SETUP_PRESENTATION = read(path.join(ASSETS, 'doctor-setup-presentation.txt'));
const UPDATE_PRESENTATION = read(path.join(ASSETS, 'doctor-update-presentation.txt'));
const CATALOG = read(path.join(COMMANDS, 'README.txt'));

const CONTRACT = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.json')));
const SCHEMA = JSON.parse(read(path.join(SKILL_DOC_ASSETS, 'command-contract.schema.json')));
const DOCTOR_CONTRACT = CONTRACT.families.doctor;
const FAMILY_SCHEMA = SCHEMA.definitions.familyContract;

const CHECK_ENGINE = '.skilled/commands/doctor/scripts/agents-md-check.cjs';
const EMBED_ENGINE = '.skilled/commands/doctor/scripts/agents-md-embed.cjs';
const HELPER = path.join(SCRIPTS, 'doctor-helper-match.cjs');

// The engine's own write boundary, read from the engine. A second copy in the
// workflow is the drift this suite exists to catch, so the allowlist cases compare
// against this list rather than against a literal here.
const { ALLOWLIST } = require(path.join(SCRIPTS, 'agents-md-embed.cjs'));

const engineOf = (entry) => entry.match(/\.skilled\/\S+\.cjs/)[0];

const CHECK_WORKFLOW = parseYaml(CHECK_YAML);
const EMBED_WORKFLOW = parseYaml(EMBED_YAML);
const RESTORE_WORKFLOW = parseYaml(RESTORE_YAML);
const EMBED_PHASES = Object.keys(EMBED_WORKFLOW.workflow);
const RESTORE_PHASES = Object.keys(RESTORE_WORKFLOW.workflow);

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

const phaseText = (workflow, phase) => yamlStrings(workflow.workflow[phase]).join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

test('the manifest holds a check, an embed and a restore route, and only check answers the bare command', () => {
  assert.deepEqual(ROUTES.map((route) => route.target), ['check', 'embed', 'restore']);
  // Three targets make the command multi-target, so the read-only one has to claim
  // the bare invocation: without the flag a typed /doctor:agents-md would reach no
  // bridge at all, and a bare invocation must never reach a route that writes.
  assert.equal(routeFor('check').default_target, true);
  assert.equal(routeFor('embed').default_target, undefined);
  assert.equal(routeFor('restore').default_target, undefined);
  assert.equal(routeFor('check').mutating, 'read-only');
  assert.match(routeFor('check').gate3_location, /^n\/a/);
  assert.equal(routeFor('embed').mutating, 'mutates');
  assert.equal(routeFor('restore').mutating, 'mutates');
  for (const route of ROUTES) {
    assert.equal(route.yaml, `doctor-agents-md-${route.target}.yaml`);
    assert.ok(fs.existsSync(path.join(ASSETS, route.yaml)), route.yaml);
    assert.deepEqual(route.mcp_tools, []);
  }
  assert.deepEqual(routeFor('check').allowed_flags, ['--json', '--root <dir>']);
  assert.deepEqual([...routeFor('embed').allowed_flags].sort(), [
    '--create-router',
    '--dry-run',
    '--keep-claude-md',
    '--plan-digest <digest>',
    '--remove-claude-md',
    '--root <dir>',
  ].sort());
  assert.deepEqual([...routeFor('restore').allowed_flags].sort(), ['--dry-run', '--run <dir>', '--yes'].sort());
});

test('the writing routes name every place the engines write and nothing else', () => {
  const embed = routeFor('embed').gate3_location;
  // Exactly the six allowlisted paths, the backup that makes the write reversible and
  // the digest that decides whether the approved bytes are the bytes on disk.
  for (const expected of [
    /AGENTS\.md/,
    /CLAUDE\.md/,
    /\.codex\/AGENTS\.md/,
    /\.cursor\/rules\/repo-local\.md/,
    /\.cursor\/rules\/skill-routing\.md/,
    /REPO RULES\.md/,
    /backup/i,
    /plan digest/i,
  ]) {
    assert.match(embed, expected);
  }
  // A release unit belongs to /doctor:update, and no embed run stages a commit.
  assert.doesNotMatch(embed, /\.skilled\/skills|the git index|commit/i);

  const restore = routeFor('restore').gate3_location;
  assert.match(restore, /manifest\.json/);
  assert.match(restore, /allowlist/);
  assert.match(restore, /recorded/);
});

test('every route names the engine calls its workflow runs and every trigger phrase carries three or more words', () => {
  for (const route of ROUTES) {
    for (const phrase of route.trigger_phrases) {
      assert.ok(phrase.trim().split(/\s+/).length >= 3, phrase);
    }
  }
  // The check route reads, and only reads.
  assert.deepEqual(routeFor('check').script_invocations.map(engineOf), [CHECK_ENGINE]);

  // The plan writes nothing, the apply carries the digest the plan printed, and the
  // re-read proves what landed. A plan call that already carried the digest would
  // make the approval a formality, so it never does.
  const embedCalls = routeFor('embed').script_invocations;
  assert.deepEqual(embedCalls.map(engineOf), [EMBED_ENGINE, EMBED_ENGINE, CHECK_ENGINE]);
  assert.match(embedCalls[0], /agents-md-embed\.cjs plan/);
  assert.doesNotMatch(embedCalls[0], /--plan-digest/);
  assert.match(embedCalls[1], /agents-md-embed\.cjs apply/);
  assert.match(embedCalls[1], /--plan-digest <digest>/);

  // The restore plan is the engine's own dry run, and the write repeats the record
  // path the operator was shown.
  const restoreCalls = routeFor('restore').script_invocations;
  assert.deepEqual(restoreCalls.map(engineOf), [EMBED_ENGINE, EMBED_ENGINE, CHECK_ENGINE]);
  assert.match(restoreCalls[0], /agents-md-embed\.cjs restore --run=<dir> --dry-run/);
  assert.match(restoreCalls[1], /agents-md-embed\.cjs restore --run=<dir> --yes/);
  assert.doesNotMatch(restoreCalls[0], /--yes/);
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
  for (const token of ['[check|embed|restore]', '[--json]', '[--root <dir>]', '[--dry-run]', '[--plan-digest <digest>]', '[--run <dir>]', '[--yes]']) {
    assert.ok(hint.includes(token), token);
  }
  const tools = ROUTER.match(/^allowed-tools:\s*(.+)$/m)[1].split(',').map((tool) => tool.trim());
  assert.deepEqual(tools, ['Read', 'Bash']);
  // Instruction-document authoring is sk-doc's, so that is the one skill tag here.
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

test('the router names both engines as owned assets and composes nothing itself', () => {
  const owned = ROUTER.split('## 2. OWNED ASSETS')[1].split('## 3.')[0];
  assert.ok(owned.includes(CHECK_ENGINE), CHECK_ENGINE);
  assert.ok(owned.includes(EMBED_ENGINE), EMBED_ENGINE);
  assert.match(ROUTER, /Do not compose an `AGENTS\.md` byte/);
});

test('the router resolves the bare command to check and keeps every write behind the digest and a yes', () => {
  assert.match(ROUTER, /`default_target`/);
  assert.match(ROUTER, /A bare `\/doctor:agents-md` never reaches `embed` or `restore`, which write/);
  assert.match(ROUTER, /never runs `apply` without the digest its own plan printed/);
  assert.match(ROUTER, /never runs a writing target without its yes/);
});

test('the router step list runs the real order: plan, digest, yes, apply, re-read', () => {
  const summary = ROUTER.split('## 6. WORKFLOW SUMMARY')[1];
  const steps = summary.split('\n').map((line) => line.trim()).filter((line) => /^\d+\. /.test(line));
  const at = (pattern) => {
    const index = steps.findIndex((step) => pattern.test(step));
    assert.ok(index >= 0, `no step names ${pattern}`);
    return index;
  };
  const plan = at(/agents-md-embed\.cjs plan/);
  const digest = at(/the plan digest/);
  const question = at(/asks the embed question/);
  const apply = at(/agents-md-embed\.cjs apply --plan-digest/);
  const reread = at(/re-reads the written repository/);
  assert.ok(plan < digest, 'the plan is printed before its digest is offered');
  assert.ok(digest < question, 'the digest is named before the question');
  assert.ok(question < apply, 'the apply runs only after the question');
  assert.ok(apply < reread, 'the re-read follows the write');
  const stepText = steps.join('\n');
  assert.match(stepText, /ends the run as cancelled/);
  assert.match(stepText, /nothing is written/);
  assert.match(stepText, /restore/);
});

test('the presentation carries the menu, the accepted answers, the manifest rows and the valid targets line', () => {
  assert.match(PRESENTATION, /^## 1\. Argument Failure$/m);
  assert.match(PRESENTATION, /^1\) check$/m);
  assert.match(PRESENTATION, /^2\) embed$/m);
  assert.match(PRESENTATION, /^3\) restore$/m);
  assert.match(PRESENTATION, /^\| `1` \| target = `check` \|/m);
  assert.match(PRESENTATION, /^\| `2` \| target = `embed` \|/m);
  assert.match(PRESENTATION, /^\| `3` \| target = `restore` \|/m);
  assert.match(PRESENTATION, /^Valid targets: check, embed, restore$/m);
  assert.match(PRESENTATION, /^\| `check` \| `doctor-agents-md-check\.yaml` \| read-only \|/m);
  assert.match(PRESENTATION, /^\| `embed` \| `doctor-agents-md-embed\.yaml` \| mutates \|/m);
  assert.match(PRESENTATION, /^\| `restore` \| `doctor-agents-md-restore\.yaml` \| mutates \|/m);
});

test('the presentation keeps the check table, the JSON passthrough and the digest it makes the operator approve', () => {
  assert.match(PRESENTATION, /^Agents instruction check: \[the root the engine read\]$/m);
  assert.match(PRESENTATION, /^DOCTOR TARGET UNCHANGED$/m);
  assert.ok(PRESENTATION.includes("With `--json` print the engine's JSON and nothing else"));
  assert.match(PRESENTATION, /^Plan digest: \[the engine's plan-digest line\]$/m);
  assert.match(PRESENTATION, /Embed these files now\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /Restore these paths from that backup now\? \[yes\/no\]$/m);
  // The digest is what the operator approves, so the wording has to say so.
  assert.match(PRESENTATION, /the digest on screen is the digest the apply repeats/);
  assert.match(PRESENTATION, /never compose a plan digest/);
});

test('the presentation closes on the unchanged, cancelled, dry-run, restored and failed templates', () => {
  // Every status a route can print appears as its own line, because a workflow that
  // ends on one of them must have been told the exact string.
  for (const status of ['STATUS=OK', 'STATUS=FINDINGS', 'STATUS=CANCELLED ACTION=cancelled', 'STATUS=FAIL ERROR="[code]"', 'STATUS=ERROR ERROR="[message]"']) {
    assert.match(PRESENTATION, new RegExp(`^${status.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'), status);
  }
  assert.match(PRESENTATION, /^STATUS=CANCELLED ACTION=cancelled$/m);
  assert.match(PRESENTATION, /^STATUS=FAIL ERROR="\[code\]"$/m);
  assert.match(PRESENTATION, /^STATUS=ERROR ERROR="\[message\]"$/m);
  assert.match(PRESENTATION, /Declined: \[the embed \| the restore\]/);
  assert.match(PRESENTATION, /^End interactive presentations with: `What would you like to do next\?`$/m);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE CHECK WORKFLOW
// ─────────────────────────────────────────────────────────────────────────────

test('the check workflow is read-only and runs the check engine the route declares', () => {
  assert.equal(CHECK_WORKFLOW.operating_mode.execution, 'read_only');
  assert.equal(CHECK_WORKFLOW.mutation_boundaries.read_only, true);
  assert.deepEqual(CHECK_WORKFLOW.mutation_boundaries.allowed_targets, []);
  assert.ok(CHECK_YAML.includes(CHECK_ENGINE), CHECK_ENGINE);
});

test('the check workflow declares every variable its route resolves', () => {
  for (const key of routeFor('check').setup_vars) {
    assert.ok(key in CHECK_WORKFLOW.inputs, `inputs.${key} is missing`);
  }
});

test('the check workflow passes --json and --root only when the operator asked', () => {
  assert.match(CHECK_WORKFLOW.inputs.json_output, /true when --json is passed/);
  assert.match(CHECK_YAML, /--json when the operator/);
  assert.doesNotMatch(CHECK_YAML, /agents-md-check\.cjs --json/);
  assert.match(CHECK_WORKFLOW.inputs.root, /--root <dir>/);
  // The default root is the repository the operator is in, so an unconditional
  // --root would classify somebody else's tree.
  assert.doesNotMatch(CHECK_YAML, /agents-md-check\.cjs --root/);
});

test('the check workflow maps the engine exit classes to a route status', () => {
  const { output } = CHECK_WORKFLOW;
  assert.match(output, /STATUS=OK/);
  assert.match(output, /STATUS=FINDINGS/);
  assert.match(output, /STATUS=ERROR/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE EMBED AND RESTORE WORKFLOWS
// ─────────────────────────────────────────────────────────────────────────────

test('the embed workflow is interactive, writes only on a yes and never commits', () => {
  assert.equal(EMBED_WORKFLOW.operating_mode.execution, 'interactive');
  assert.equal(EMBED_WORKFLOW.operating_mode.approvals, 'explicit_yes');
  assert.equal(EMBED_WORKFLOW.operating_mode.dry_run, 'print_the_plan_then_status_ok_without_asking');
  assert.equal(EMBED_WORKFLOW.operating_mode.never_commit, true);
  assert.deepEqual(EMBED_WORKFLOW.output.statuses, ['OK', 'CANCELLED', 'FAIL']);
  assert.equal(EMBED_WORKFLOW.output.presentation, '.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt');
});

test('the embed workflow runs its phases in the read, plan, approval, write, re-read, report order', () => {
  assert.deepEqual(EMBED_PHASES, [
    'phase_1_read',
    'phase_2_plan',
    'phase_3_approval',
    'phase_4_write',
    'phase_5_reread',
    'phase_6_report',
  ]);
  assert.equal(EMBED_WORKFLOW.mutation_boundaries.read_only, false);
});

test('the embed allowlist is the engine own list and nothing beside it', () => {
  const boundaries = EMBED_WORKFLOW.mutation_boundaries;
  const allowed = boundaries.allowed_targets.join('\n');
  for (const file of ALLOWLIST) {
    assert.ok(allowed.includes(file), `${file} is missing from the workflow allowlist`);
  }
  const namedPaths = boundaries.allowed_targets
    .map((entry) => entry.split(/[,:]/)[0].trim())
    .filter((first) => first.endsWith('.md'));
  assert.deepEqual([...namedPaths].sort(), [...ALLOWLIST].sort());
  const forbidden = boundaries.forbidden_targets.join('\n');
  assert.match(forbidden, /agents-md-embed\.cjs/);
  assert.match(forbidden, /the git index/);
  assert.match(forbidden, /\.skilled\/\*\*, which \/doctor:update owns/);
});

test('the embed workflow writes only after the printed plan, its digest and the yes', () => {
  const plan = phaseText(EMBED_WORKFLOW, 'phase_2_plan');
  assert.match(plan, new RegExp(`${EMBED_ENGINE} plan`));
  assert.doesNotMatch(plan, /--plan-digest/);
  assert.match(plan, /plan-digest/);

  const approval = phaseText(EMBED_WORKFLOW, 'phase_3_approval');
  assert.match(approval, /Ask the embed question once/);
  assert.match(approval, /the plan the operator has just read/);
  assert.match(approval, /STATUS=CANCELLED ACTION=cancelled/);
  assert.match(approval, /naming the declined embed/);
  assert.match(approval, /Nothing is written/);

  const write = phaseText(EMBED_WORKFLOW, 'phase_4_write');
  assert.match(write, /only after the embed yes/);
  assert.match(write, /--plan-digest/);
  assert.match(write, /does not match/);
  assert.ok(EMBED_PHASES.indexOf('phase_3_approval') < EMBED_PHASES.indexOf('phase_4_write'));
  // The write switch is the engine's own apply subcommand, and the digest is the
  // plan's, so a plan approved at one tree cannot be applied at another.
  assert.doesNotMatch(phaseText(EMBED_WORKFLOW, 'phase_2_plan'), /apply --plan-digest/);
});

test('a no at the embed question ends the run with nothing written, and a dry run ends at OK', () => {
  assert.match(phaseText(EMBED_WORKFLOW, 'phase_3_approval'), /Any answer other than yes is a no/);
  assert.match(phaseText(EMBED_WORKFLOW, 'phase_2_plan'), /If dry_run is true/);
  assert.match(phaseText(EMBED_WORKFLOW, 'phase_2_plan'), /STATUS=OK/);
  assert.match(phaseText(EMBED_WORKFLOW, 'phase_2_plan'), /asks nothing and writes nothing/);
  assert.match(phaseText(EMBED_WORKFLOW, 'phase_2_plan'), /NOTHING TO DO/);
});

test('the embed workflow hands the undo block back instead of composing one', () => {
  const report = phaseText(EMBED_WORKFLOW, 'phase_6_report');
  assert.match(report, /undo block the engine printed/);
  assert.match(report, /Undo:/);
  assert.match(report, /Never run the undo inside this route/);
  assert.match(report, /the operator commits/i);
});

test('the restore workflow asks once, plans from the engine, and writes only after that yes', () => {
  assert.equal(RESTORE_WORKFLOW.operating_mode.execution, 'interactive');
  assert.equal(RESTORE_WORKFLOW.operating_mode.approvals, 'explicit_yes');
  assert.equal(RESTORE_WORKFLOW.operating_mode.never_commit, true);
  assert.deepEqual(RESTORE_WORKFLOW.output.statuses, ['OK', 'CANCELLED', 'FAIL']);
  assert.deepEqual(RESTORE_PHASES, [
    'phase_1_read',
    'phase_2_plan',
    'phase_3_approval',
    'phase_4_write',
    'phase_5_reread',
    'phase_6_report',
  ]);
  for (const key of routeFor('restore').setup_vars) {
    assert.ok(key in RESTORE_WORKFLOW.inputs, `inputs.${key} is missing`);
  }
  const plan = phaseText(RESTORE_WORKFLOW, 'phase_2_plan');
  assert.match(plan, /restore --run=\{run_dir\} --dry-run/);
  assert.doesNotMatch(plan, /--yes/);
  const write = phaseText(RESTORE_WORKFLOW, 'phase_4_write');
  assert.match(write, /restore --run=\{run_dir\} --yes/);
  assert.match(write, /only after the restore yes/);
  const approval = phaseText(RESTORE_WORKFLOW, 'phase_3_approval');
  assert.match(approval, /STATUS=CANCELLED ACTION=cancelled/);
  assert.match(approval, /naming the declined restore/);
  assert.match(approval, /Nothing is written/);
});

test('the restore workflow restores only what one run recorded, and reads the hash first', () => {
  const boundaries = RESTORE_WORKFLOW.mutation_boundaries;
  const allowed = boundaries.allowed_targets.join('\n');
  assert.match(allowed, /manifest\.json/);
  assert.match(allowed, /allowlist/);
  const forbidden = boundaries.forbidden_targets.join('\n');
  assert.match(forbidden, /agents-md-embed\.cjs/);
  assert.match(forbidden, /the git index/);
  assert.match(boundaries.invariant, /recorded hash/);
  assert.match(boundaries.invariant, /STATUS=CANCELLED/);
  // A restore never reads a backup directory the operator was not shown.
  assert.match(phaseText(RESTORE_WORKFLOW, 'phase_1_read'), /manifest\.json/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. THE COMMAND CONTRACT, THE SETUP LIST AND THE CATALOG
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
});

test('the contract names the router, the three workflows, the presentation, the hint and the alias', () => {
  assert.ok(DOCTOR_CONTRACT.router_path.includes('.skilled/commands/doctor/agents-md.md'));
  for (const asset of ['doctor-agents-md-check.yaml', 'doctor-agents-md-embed.yaml', 'doctor-agents-md-restore.yaml']) {
    assert.ok(DOCTOR_CONTRACT.execution_targets.some((entry) => entry.target.endsWith(asset)), asset);
    assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => entry.path.endsWith(asset)), asset);
  }
  assert.ok(DOCTOR_CONTRACT.owned_assets
    .some((entry) => entry.purpose === 'presentation' && entry.path.endsWith('doctor-agents-md-presentation.txt')));
  // A script asset carries its one-line purpose beside the path, the way the helper's
  // does, so the path is matched inside the cell rather than at its end.
  assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => entry.path.includes('agents-md-check.cjs')));
  assert.ok(DOCTOR_CONTRACT.owned_assets.some((entry) => entry.path.includes('agents-md-embed.cjs')));
  const hint = ROUTER.match(/^argument-hint:\s*"(.*)"$/m)[1];
  assert.ok(DOCTOR_CONTRACT.input.argument_hint.includes(`${hint} (agents-md)`));
  assert.ok(DOCTOR_CONTRACT.invocation_aliases.includes(`/doctor:agents-md ${hint}`));
  const lines = DOCTOR_CONTRACT.loader_requirements.filter((line) => line.includes('/doctor:agents-md'));
  const text = lines.join('\n');
  assert.match(text, /check is the read-only default target/);
  assert.match(text, /plan digest/i);
  assert.match(text, /restore/);
  assert.match(text, /STATUS=CANCELLED/);
  assert.ok(DOCTOR_CONTRACT.destructive_policy.operations.some((line) => line.includes('agents-md embed')));
  assert.ok(DOCTOR_CONTRACT.destructive_policy.operations.some((line) => line.includes('agents-md restore')));
});

test('the setup target list carries one agents-md row and keeps the rest of the family', () => {
  const rows = SETUP_PRESENTATION.split('\n').filter((line) => line.includes('/doctor:agents-md'));
  assert.equal(rows.length, 1);
  assert.match(rows[0], /^\| `\/doctor:agents-md \[check\|embed\|restore\]/);
  // The family's own reach check requires one row per doctor router, so a row here
  // and a router file there are the same decision.
  const routers = fs.readdirSync(DOCTOR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .filter((name) => name !== 'helper' && !name.startsWith('local-'));
  const missing = routers.filter((name) => !SETUP_PRESENTATION.includes(`/doctor:${name}`));
  assert.deepEqual(missing, []);
});

test('the update presentation gains one line naming the check target', () => {
  const lines = UPDATE_PRESENTATION.split('\n').filter((line) => line.includes('/doctor:agents-md'));
  assert.equal(lines.length, 1);
  assert.match(lines[0], /\/doctor:agents-md check$/);
});

test('the commands catalog lists the router and counts the folder it lives in', () => {
  const rows = CATALOG.split('\n').filter((line) => line.includes('/doctor:agents-md'));
  assert.equal(rows.length, 1);
  const routers = fs.readdirSync(DOCTOR).filter((file) => file.endsWith('.md') && !file.startsWith('local-'));
  const groupRow = CATALOG.split('\n').find((line) => /^\| \*\*doctor\*\* \|/.test(line));
  assert.ok(groupRow, 'the doctor group row is missing from the catalog');
  assert.equal(Number(groupRow.split('|')[3].trim()), routers.length);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. REACH: THE PROBLEMS AN OPERATOR ACTUALLY WRITES
// ─────────────────────────────────────────────────────────────────────────────

const rank = (problem) => {
  const result = spawnSync(process.execPath, [HELPER, '--json', '--', problem], { encoding: 'utf8' });
  return { status: result.status, report: JSON.parse(result.stdout) };
};

test('three plain-language AGENTS.md problems reach the three new routes', () => {
  const cases = [
    ['my agents md still has the old shipped sections and I want to know which ones are stale', '/doctor:agents-md check'],
    ['embed the new shipped instructions into my agents md', '/doctor:agents-md embed'],
    ['undo the agents md embed and bring back the file I had before', '/doctor:agents-md restore'],
  ];
  for (const [problem, runnable] of cases) {
    const { status, report } = rank(problem);
    assert.equal(status, 0, `${problem}: exit ${status}`);
    assert.equal(report.status, 'match', problem);
    assert.equal(report.candidates[0].runnable, runnable, `${problem} -> ${report.candidates[0].runnable}`);
  }
});

test('every phrase on the three routes ranks its own route first', () => {
  const { loadEntries, rankProblem } = require(HELPER);
  const { entries } = loadEntries(path.resolve(DOCTOR, '..', '..', '..'));
  const routable = entries.filter((entry) => entry.command !== '/doctor:helper');
  const misses = [];
  for (const route of ROUTES) {
    const runnable = `/doctor:agents-md ${route.target}`;
    assert.ok(routable.some((entry) => entry.runnable === runnable), `${runnable} has no helper entry`);
    for (const phrase of route.trigger_phrases) {
      const top = rankProblem(routable, phrase, {}).candidates[0];
      if (!top || top.runnable !== runnable) misses.push(`"${phrase}" -> ${top ? top.runnable : 'no match'}`);
    }
  }
  assert.deepEqual(misses, []);
});
