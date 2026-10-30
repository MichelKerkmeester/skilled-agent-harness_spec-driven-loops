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

// The converter's own source is the proof that a refusal quotes wording it
// actually prints: a test that read only the workflow would pass on a reason the
// engine never says. The controls come from the engine and both libraries it
// throws through, so a code added there is caught here without an edit.
const ENGINE_SOURCES = [
  path.join(SCRIPTS, 'sk-skill-convert.cjs'),
  path.join(SCRIPTS, 'lib', 'sk-skill-convert-transforms.cjs'),
  path.join(SCRIPTS, 'lib', 'sk-skill-integrate.cjs'),
];
const ENGINE_SOURCE = ENGINE_SOURCES.map(read).join('');

// Every machine code the converter can print for a target it will not convert is
// derived from the source, never listed here: each call family names its code in
// its own argument position, and the two helpers carry a default.
const CODE_CAPTURE = '([A-Z][A-Z0-9_]{3,})';
const CODE_PATTERNS = [
  new RegExp(`new ConvertError\\(\\s*'${CODE_CAPTURE}'`, 'g'),
  new RegExp(`new ConvertError\\(\\s*error\\.code\\s*\\|\\|\\s*'${CODE_CAPTURE}'`, 'g'),
  new RegExp(`transformError\\(\\s*'${CODE_CAPTURE}'`, 'g'),
  new RegExp(`new IntegrationError\\(\\s*'${CODE_CAPTURE}'`, 'g'),
  new RegExp(`new IntegrationError\\(\\s*error\\.code\\s*\\|\\|\\s*'${CODE_CAPTURE}'`, 'g'),
  // refuse(message, code) names the code second, and its signature carries the
  // default a call without one gets.
  new RegExp(`refuse\\(\\s*(?:` + '`[^`]*`' + `|'[^']*'),\\s*'${CODE_CAPTURE}'`, 'gs'),
  new RegExp(`\\bcode\\s*=\\s*'${CODE_CAPTURE}'`, 'g'),
  // runStep throws the code it is called with, as its second argument.
  new RegExp(`runStep\\(\\s*(?:context,\\s*)?'${CODE_CAPTURE}'`, 'gs'),
];

const deriveCodes = () => {
  const codes = new Set();
  for (const pattern of CODE_PATTERNS) {
    let match;
    while ((match = pattern.exec(ENGINE_SOURCE)) !== null) codes.add(match[1]);
  }
  return codes;
};

const CONVERT_REFUSAL_CODES = [...deriveCodes()].sort();

// The four messages that are a question rather than a stop: the workflow asks
// about them and reruns the plan with the approved flag.
const FOLLOW_UP_CODES = [
  'INTENT_SIGNALS_BELOW_FLOOR',
  'DESCRIPTION_TOO_LONG',
  'ALLOWED_TOOLS_MISSING',
  'EDGES_APPROVAL_REQUIRED',
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

const phaseText = (phase) => yamlStrings(CONVERT_WORKFLOW.workflow[phase]).join('\n');

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
  assert.ok(checkRoute().allowed_flags.includes('--into-hub <hub>'));
  assert.deepEqual(convertRoute().allowed_flags, ['--dry-run']);
});

test('the convert route names every place the engine writes and nothing else', () => {
  const location = convertRoute().gate3_location;
  // The staged or converted folder, its backup, the changelog and its index link,
  // then the integration targets the engine records in its plan.
  for (const expected of [
    /\.skilled\/skills\/<name>/,
    /SKILL\.md/,
    /ROUTER\.md/,
    /\.state\/doctor-sk-skill\/<name>\/<timestamp>/,
    /changelog/,
    /\.skilled\/changelog\/<name>/,
    /skill-graph\.sqlite/,
    /skill-graph\.json/,
    /advisor cases/,
    /\.hermes\/skills/,
  ]) {
    assert.match(location, expected);
  }
  // A skill folder the run was not pointed at is not a write target.
  assert.doesNotMatch(location, /every skill|any skill folder/);
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
  // The plan, the plan rerun, the preserve proof, the apply and the post-write
  // re-read, in the order the workflow runs them.
  assert.deepEqual(
    convertRoute().script_invocations.map((entry) => entry.match(/\.skilled\/\S+\.cjs/)[0]),
    [CONVERT_ENGINE, CONVERT_ENGINE, CONVERT_ENGINE, CONVERT_ENGINE, ENGINE],
  );
  const [planCall, rerunCall, preserveCall, applyCall] = convertRoute().script_invocations;
  // The plan call is the one the workflow runs before the questions, so it may not
  // carry the write switch, and only the apply carries it.
  assert.doesNotMatch(planCall, /--apply/);
  assert.match(planCall, /sk-skill-convert\.cjs plan/);
  // The rerun is the same apply form with no write switch: it prints the plan and
  // writes nothing, which is the only documented form that carries these flags.
  assert.match(rerunCall, /sk-skill-convert\.cjs apply/);
  assert.doesNotMatch(rerunCall, /--apply/);
  assert.match(preserveCall, /sk-skill-convert\.cjs preserve --snapshot/);
  assert.match(applyCall, /--apply/);
  // A plain skill is still reachable: the phrase that names it stays.
  assert.ok(convertRoute().trigger_phrases.includes('convert a plain agent skill'));
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
  // Both targets and all three flags the routes accept, so a typed invocation that
  // the router honours is one the hint also names.
  for (const token of ['[check|convert]', '[<name-or-path>]', '[--json]', '[--into-hub <hub>]', '[--dry-run]']) {
    assert.ok(hint.includes(token), token);
  }
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

test('the router step list runs the real order: plan, follow-up yeses, rerun, question, apply, undo', () => {
  const summary = ROUTER.split('## 6. WORKFLOW SUMMARY')[1];
  const steps = summary.split('\n').map((line) => line.trim()).filter((line) => /^\d+\. /.test(line));
  const stepText = steps.join('\n');
  const at = (pattern) => {
    const index = steps.findIndex((step) => pattern.test(step));
    assert.ok(index >= 0, `no step names ${pattern}`);
    return index;
  };
  const plan = at(/sk-skill-convert\.cjs plan/);
  const followUp = at(/own yes/);
  const rerun = at(/reruns the plan as `sk-skill-convert\.cjs apply/);
  const question = at(/asks the conversion question/);
  const apply = at(/sk-skill-convert\.cjs apply --apply/);
  const undo = at(/undo block the engine printed/);
  assert.ok(plan < followUp, 'the plan is printed before the follow-up questions');
  assert.ok(followUp < rerun, 'the plan is rerun after the follow-up answers');
  assert.ok(rerun < question, 'the conversion question is asked against the rerun plan');
  assert.ok(question < apply, 'the apply runs only after the conversion question');
  assert.ok(apply < undo, 'the undo is printed after the apply');
  assert.match(stepText, /preserve --snapshot/);
  assert.match(stepText, /never edits a SKILL\.md field/);
  assert.match(stepText, /ends the run as cancelled/);
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

test('the presentation keeps the check tables, the JSON passthrough and the question wording', () => {
  assert.match(PRESENTATION, /^Skill fleet check$/m);
  assert.match(PRESENTATION, /^Result: \[PASS\|FINDINGS/m);
  assert.ok(PRESENTATION.includes("With `--json` print the engine's JSON and nothing else"));
  assert.match(PRESENTATION, /^Trim the description to 130 characters or fewer\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /^Declare allowed-tools as \[the proposed list\] for this skill\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /^Convert this skill now\? \[yes\/no\]$/m);
  assert.match(PRESENTATION, /Dry run: nothing was written and nothing was asked\./);
  assert.match(PRESENTATION, /never write a permission grant without that yes/);
  // The engine's own flag is named beside the value the operator approves, so the
  // workflow never edits a field by hand.
  for (const flag of ['--description-trim', '--allowed-tools', '--agent-output']) {
    assert.ok(PRESENTATION.includes(flag), flag);
  }
  assert.match(PRESENTATION, /The workflow never edits a field/);
});

test('the presentation closes on the converted, unchanged, cancelled, dry-run and failed templates', () => {
  assert.match(PRESENTATION, /^STATUS=\[status\]$/m);
  assert.match(PRESENTATION, /^STATUS=ERROR ERROR="\[message\]"$/m);
  assert.match(PRESENTATION, /^STATUS=OK$/m);
  assert.match(PRESENTATION, /^STATUS=CANCELLED ACTION=cancelled$/m);
  assert.match(PRESENTATION, /^STATUS=FAIL ERROR="\[code\]"$/m);
  assert.match(PRESENTATION, /^End interactive presentations with: `What would you like to do next\?`$/m);
  // A declined question says what was declined, and a dry run ends at OK.
  assert.match(PRESENTATION, /^Declined: \[the intent phrases \| the description trim \| the allowed-tools list \| the edge \| the conversion\]$/m);
  assert.match(PRESENTATION, /^### Dry Run$/m);
  assert.match(PRESENTATION, /^DOCTOR DRY RUN$/m);
});

test('the presentation refusal table carries every code the converter can print', () => {
  const missing = CONVERT_REFUSAL_CODES.filter((code) => !PRESENTATION.includes(`\`${code}\``));
  assert.deepEqual(missing, [], 'every code the converter prints is named in the presentation');
  // The derivation is only worth trusting if it found the families the engine has.
  for (const code of ['PREFLIGHT_REFUSED', 'USAGE', 'PRESERVATION_FAILED', 'AGENT_RESHAPE_REQUIRED']) {
    assert.ok(CONVERT_REFUSAL_CODES.includes(code), `${code} was not derived from the engine source`);
  }
  assert.ok(CONVERT_REFUSAL_CODES.length >= 40, `only ${CONVERT_REFUSAL_CODES.length} codes derived`);
});

test('the presentation points the three follow-up messages at their questions instead of the refusal table', () => {
  const followUpSection = PRESENTATION.split('### 5.5 Messages that are a follow-up question')[1];
  assert.ok(followUpSection, 'the follow-up section is missing');
  for (const code of FOLLOW_UP_CODES) {
    assert.ok(followUpSection.includes(`\`${code}\``), `${code} is not named as a follow-up`);
    assert.ok(/intent-phrase question|trim question|allowed-tools question|edge question/.test(followUpSection), code);
  }
  // The stopping tables above it never carry them. The plan section names all three
  // as questions, so only the refusal table between the two headings is checked here.
  const refusals = PRESENTATION.split('## 5. Convert Refusals')[1]
    .split('### 5.5 Messages that are a follow-up question')[0];
  for (const code of FOLLOW_UP_CODES) {
    assert.ok(!refusals.includes(`\`${code}\``), `${code} is still a stopping refusal`);
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
  assert.equal(CONVERT_WORKFLOW.operating_mode.approvals, 'one_explicit_yes_per_question_before_the_first_write');
  assert.equal(CONVERT_WORKFLOW.operating_mode.dry_run, 'print_the_plan_then_status_ok_without_asking');
  assert.equal(CONVERT_WORKFLOW.operating_mode.never_commit, true);
  assert.deepEqual(CONVERT_WORKFLOW.output.statuses, ['OK', 'CANCELLED', 'FAIL']);
});

test('the convert workflow runs its phases in the read, plan, follow-up, yes, write, re-read, undo, report order', () => {
  assert.deepEqual(PHASES, [
    'phase_1_read',
    'phase_2_plan',
    'phase_3_follow_ups',
    'phase_4_approval',
    'phase_5_write',
    'phase_6_reread',
    'phase_7_undo',
    'phase_8_report',
  ]);
  assert.equal(CONVERT_WORKFLOW.output.presentation, '.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt');
});

// Every flag the plain-skill plan and apply need, named as the engine's own usage
// block names them: a rerun or an apply that drops one leaves the engine refusing.
const PLAIN_APPROVAL_FLAGS = ['--approved-phrase', '--description-trim', '--allowed-tools', '--edge', '--agent-output'];

test('the plan is rendered before the conversion question and the flags reach the apply', () => {
  assert.match(phaseText('phase_2_plan'), new RegExp(`${CONVERT_ENGINE} plan`));
  // The rerun is the plan the operator approves: it carries the approved flags and
  // lands before the question, with the plain-skill proof before the format gate.
  const rerun = phaseText('phase_3_follow_ups');
  assert.match(rerun, /Rerun the plan/);
  assert.match(rerun, new RegExp(`${CONVERT_ENGINE} apply`));
  assert.match(rerun, /preserve --snapshot/);
  // The write phase runs the apply with the same flags the rerun carried, so a flag
  // in one phase and missing from the other is the bug this catches.
  const write = phaseText('phase_5_write');
  assert.match(write, new RegExp(`${CONVERT_ENGINE} apply`));
  assert.match(write, /--apply/);
  for (const flag of PLAIN_APPROVAL_FLAGS) {
    assert.match(rerun, new RegExp(flag), `the rerun drops ${flag}`);
    assert.match(write, new RegExp(flag), `the apply drops ${flag}`);
  }
  // The write switch may appear before the write phase only where the read phase
  // quotes the engine's usage block and where a rerun quotes the engine's own gate
  // line; the plan, follow-up and approval phases never carry it otherwise.
  assert.match(phaseText('phase_1_read'), /usage block/);
  for (const phase of ['phase_2_plan', 'phase_3_follow_ups', 'phase_4_approval']) {
    const text = phaseText(phase).replace(/Apply gate: no writes without --apply\./g, '');
    assert.ok(!text.includes('--apply'), phase);
  }
  const order = ['phase_2_plan', 'phase_3_follow_ups', 'phase_4_approval', 'phase_5_write'];
  for (let index = 1; index < order.length; index += 1) {
    assert.ok(PHASES.indexOf(order[index - 1]) < PHASES.indexOf(order[index]), order[index]);
  }
});

test('a no at any question is a cancelled run that names what was declined', () => {
  const followUps = phaseText('phase_3_follow_ups');
  assert.match(followUps, /STATUS=CANCELLED ACTION=cancelled/);
  assert.match(followUps, /naming the declined intent phrases/);
  assert.match(followUps, /naming the declined description trim/);
  assert.match(followUps, /naming the declined allowed-tools list/);
  assert.match(followUps, /Nothing is written/);
  const approval = phaseText('phase_4_approval');
  assert.match(approval, /Any answer other than yes is a no/);
  assert.match(approval, /STATUS=CANCELLED ACTION=cancelled/);
  assert.match(approval, /naming the declined conversion/);
  assert.match(approval, /Nothing is written/);
});

test('the conversion question is asked against the printed plan and phase 5 runs only after its yes', () => {
  const approval = phaseText('phase_4_approval');
  assert.match(approval, /Ask the conversion question once/);
  assert.match(approval, /Convert this skill now\? \[yes\/no\]/);
  assert.match(approval, /the plan the operator has just read/);
  const write = phaseText('phase_5_write');
  // The write phase states the gate it sits behind, and the phase order proves the
  // gate is a separate phase rather than a step inside the write.
  assert.match(write, /only after the conversion yes/);
  assert.ok(PHASES.indexOf('phase_4_approval') < PHASES.indexOf('phase_5_write'));
  // A dry run never reaches either phase.
  assert.match(phaseText('phase_3_follow_ups'), /A dry run asks nothing and writes nothing/);
});

test('the plain-skill prose step and its preserve proof are described from the engine interface', () => {
  const followUps = phaseText('phase_3_follow_ups');
  // The agent reshapes prose into --agent-output; the workflow never edits a field.
  assert.match(followUps, /workflow agent reshapes the SKILL\.md prose/);
  assert.match(followUps, /--agent-output/);
  assert.match(followUps, /never edits a SKILL\.md field/);
  // Every temporary file lives under one declared scratch root, and the two
  // questions the engine's own plan raises carry the flags the rerun needs.
  assert.ok(followUps.includes('{scratch_dir}/agent-output.md'));
  assert.ok(followUps.includes('preserve --snapshot "{scratch_dir}/snapshot" "{scratch_dir}/staging"'));
  assert.ok('scratch_dir' in CONVERT_WORKFLOW.inputs, 'inputs.scratch_dir is missing');
  assert.match(CONVERT_WORKFLOW.mutation_boundaries.allowed_targets.join('\n'), /\.state\/doctor-sk-skill\/<name>\/scratch\//);
  // The check runs the engine's own subcommand before the format gate.
  assert.match(followUps, /Preservation PASS/);
  assert.match(followUps, /PRESERVATION_FAILED/);
  assert.match(followUps, /stops the run with STATUS=FAIL and nothing written/);
});

test('the undo phase quotes the engine block instead of composing one', () => {
  const undo = phaseText('phase_7_undo');
  assert.match(undo, /undo block exactly as the apply printed it/);
  assert.match(undo, /Undo:/);
  // The block the engine prints opens with the copy that restores the converted
  // SKILL.md, then a copy from the backup per integration file the rows overwrote
  // (a folder is removed before it is copied back, and a row that recorded no
  // backup gets the engine's own comment), then a removal per created path and
  // its check: the route quotes the block rather than restoring anything itself.
  assert.match(undo, /cp that restores the converted SKILL\.md from the backup/);
  assert.match(undo, /a cp, or cp -R for a folder, from the backup/);
  assert.match(undo, /preceded by rm -r for a folder it replaces/);
  assert.match(undo, /No backup was recorded for/);
  assert.match(undo, /one rm, or rm -r for a folder, for every path this run created/);
  assert.match(undo, /Check:/);
  // A version-control restore is not one of the shapes the engine writes, so the
  // phase names no git command at all.
  assert.doesNotMatch(undo, /git/);
  // A composed undo used to delete ROUTER.md whatever the run had created.
  assert.doesNotMatch(undo, /delete the created ROUTER\.md/);
  assert.match(undo, /Never run the undo inside this route/);
  // The advisor graph is rebuilt rather than backed up, so the operator is told to
  // rescan it after running the undo.
  assert.match(undo, /the run's own scan rebuilds it/);
  assert.match(undo, /skill_graph_scan/);
});

test('a plan reporting no writes renders the unchanged result and asks nothing', () => {
  const plan = phaseText('phase_2_plan');
  assert.match(plan, /Writes: none/);
  assert.match(plan, /already-converted result/);
  assert.match(plan, /ask nothing/);
  assert.match(plan, /STATUS=OK/);
});

test('an exit 2 during the apply is reported as a rolled-back conversion', () => {
  const write = phaseText('phase_5_write');
  assert.match(write, /Exit 2 during the apply/);
  assert.match(write, /rolled back/);
  assert.match(write, /STATUS=FAIL ERROR="<code>"/);
  // A dry run ends at OK in the follow-up phase, before any question.
  const followUps = phaseText('phase_3_follow_ups');
  assert.match(followUps, /If dry_run is true/);
  assert.match(followUps, /STATUS=OK/);
  assert.match(followUps, /asks nothing and writes nothing/);
});

test('the convert workflow declares every variable its route resolves and what it may write', () => {
  for (const key of convertRoute().setup_vars) {
    assert.ok(key in CONVERT_WORKFLOW.inputs, `inputs.${key} is missing`);
  }
  const boundaries = CONVERT_WORKFLOW.mutation_boundaries;
  assert.equal(boundaries.read_only, false);
  const allowed = boundaries.allowed_targets.join('\n');
  // Exactly the surfaces the engine writes: the skill folder, its backup, the
  // changelog and its index link, the integration targets, and the approved fields.
  for (const expected of [
    /staged or converted skill folder/,
    /SKILL\.md/,
    /ROUTER\.md/,
    /\.state\/doctor-sk-skill/,
    /changelog/,
    /\.skilled\/changelog\/<name>/,
    /skill-graph\.sqlite/,
    /skill-graph\.json/,
    /advisor cases file/,
    /\.hermes\/skills/,
    // The one scratch root the plain path uses is a write the run owns and deletes.
    /\.state\/doctor-sk-skill\/<name>\/scratch\//,
  ]) {
    assert.match(allowed, expected);
  }
  const forbidden = boundaries.forbidden_targets.join('\n');
  assert.match(forbidden, /sk-skill-convert\.cjs/);
  assert.match(forbidden, /the git index/);
  // The graph and the changelog are no longer somebody else's: the engine writes them.
  assert.doesNotMatch(forbidden, /the skill graph, the advisor index/);
  assert.doesNotMatch(forbidden, /the changelog, which other routes own/);
  assert.match(boundaries.invariant, /until the plan has been printed and the operator has answered yes/);
  // Every skill file is backed up before it is overwritten; the advisor graph is
  // the one write that is rebuilt instead, so the invariant cannot claim otherwise.
  assert.match(boundaries.invariant, /Every skill file the run overwrites is copied to the backup first/);
  assert.match(boundaries.invariant, /the advisor graph is the exception/);
  assert.match(boundaries.invariant, /rescans it afterwards/);
  assert.match(boundaries.invariant, /A no at any question ends the run with STATUS=CANCELLED/);
});

test('the convert workflow states the follow-ups that need their own yes and keeps them out of the refusals', () => {
  const followUps = phaseText('phase_3_follow_ups');
  assert.match(followUps, /130-character budget/);
  // The allowed-tools question shows the list the plan printed, never one the
  // workflow keeps: the engine's proposal is the only list on screen.
  assert.match(followUps, /allowed-tools line reports that approval is required/);
  assert.match(followUps, /ask the allowed-tools question with the list that line prints/);
  assert.doesNotMatch(followUps, /\[Read, Grep, Glob\]/);
  assert.match(followUps, /own yes/);
  assert.match(followUps, /let the operator edit it/);
  assert.match(followUps, /at least eight distinct phrases of three or more words/);
  assert.match(followUps, /repeated --approved-phrase value/);
  // The engine's proposal adds Bash only when the skill actually ships scripts.
  assert.match(followUps, /carries Bash only when the skill folder holds a scripts\/ folder/);
  // None of the three messages is a stopping refusal in the workflow either.
  const refusalCodes = new Set(CONVERT_WORKFLOW.refusals.map((entry) => entry.code));
  for (const code of FOLLOW_UP_CODES) {
    assert.ok(!refusalCodes.has(code), `${code} is listed as a stopping refusal`);
  }
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
  // Every listed code is one the engine prints, and the follow-up messages are not
  // listed: they are questions, not refusals.
  for (const code of codes) {
    if (code.startsWith('<')) continue;
    assert.ok(CONVERT_REFUSAL_CODES.includes(code), `${code} is not a code the converter prints`);
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
  // The contract's convert promises match the workflow: one yes per write, the plan
  // rerun, the engine's undo block, and the follow-ups kept out of the refusals.
  const convertLines = DOCTOR_CONTRACT.loader_requirements.filter((line) => line.includes('/doctor:sk-skill convert'));
  const convertText = convertLines.join('\n');
  assert.match(convertText, /own yes/i);
  assert.match(convertText, /follow-up questions rather than refusals/);
  assert.match(convertText, /undo block the engine printed/);
});

test('the setup target list carries one row per target', () => {
  const checkRows = SETUP_PRESENTATION.split('\n')
    .filter((line) => line.includes('/doctor:sk-skill check'));
  assert.equal(checkRows.length, 1);
  assert.match(checkRows[0], /^\| `\/doctor:sk-skill check \[<name-or-path>\] \[--json\] \[--into-hub <hub>\]` \|/);
  const convertRows = SETUP_PRESENTATION.split('\n')
    .filter((line) => line.includes('/doctor:sk-skill convert'));
  assert.equal(convertRows.length, 1);
  assert.match(convertRows[0], /^\| `\/doctor:sk-skill convert <name-or-path> \[--dry-run\]` \|/);
  assert.match(convertRows[0], /one yes per write/);
});
