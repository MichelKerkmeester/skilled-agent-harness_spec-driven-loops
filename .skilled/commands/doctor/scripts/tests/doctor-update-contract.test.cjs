#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Update Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

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

test('the apply result keeps updater records local and asks to resolve framework changes', () => {
  assert.ok(PRESENTATION.includes('Updater records remain local and ignored'));
});

test('the lock template routes stale locks to rollback', () => {
  assert.ok(PRESENTATION.includes('Run /doctor:update rollback to clear the lock'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. LANE CLEANUP CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

const LANE_CLEANUP = blockAfterKey(APPLY_WORKFLOW, 'phase_7_lane_cleanup');
const LANE_CLEANUP_OUTCOMES = ['clean', 'cleaned', 'remaining', 'failed', 'not_run', 'not_applicable'];

function occurrences(source, text) {
  return source.split(text).length - 1;
}

test('the lane cleanup runs after the rebuild prompt and before the state log', () => {
  const phases = [...APPLY_WORKFLOW.matchAll(/^ {2}(phase_\d+_[a-z_]+):\s*$/gm)].map((match) => match[1]);
  assert.deepEqual(phases.slice(-3), ['phase_6_rebuild_prompt', 'phase_7_lane_cleanup', 'phase_8_state_log']);
  const action = APPLY_WORKFLOW.split('\n').find((line) => line.startsWith('action:'));
  assert.ok(action.endsWith('rebuild.prompt -> lane.cleanup -> state.log'));
});

test('the lane cleanup runs on every path that reached the rebuild prompt and on no other', () => {
  assert.match(LANE_CLEANUP, /every path that reached phase_6_rebuild_prompt/);
  assert.match(LANE_CLEANUP, /whether the rebuild ran, was skipped or failed/);
  assert.match(LANE_CLEANUP, /Never run it on DRY_RUN, DECLINED, CANCELLED, or a failure or rollback before the rebuild prompt/);
  const stateLog = blockAfterKey(APPLY_WORKFLOW, 'phase_8_state_log');
  assert.match(stateLog, /lane_cleanup=not_run on every path that ended before phase_7_lane_cleanup/);
});

test('the lane cleanup reports first, asks only on a non-empty askFirst, then applies once with stdin closed', () => {
  const tool = APPLY_WORKFLOW.match(/^\s+lane_cleanup:\s*"([^"]+)"\s*$/m)[1];
  assert.ok(fs.existsSync(path.resolve(COMMAND_ROOT, '../../..', tool)), tool + ' must exist');
  assert.ok(LANE_CLEANUP.includes('report_command: "node ' + tool + ' machine --json"'));
  assert.ok(LANE_CLEANUP.includes('apply_command: "node ' + tool + ' apply --json [--shared-model delete|keep] </dev/null"'));
  assert.match(LANE_CLEANUP, /Exit 1 with an empty askFirst: run apply_command without --shared-model/);
  assert.match(LANE_CLEANUP, /Exit 1 with a non-empty askFirst: show each askFirst\[\]\.question verbatim/);
  assert.match(LANE_CLEANUP, /for the one apply_command that follows/);
  assert.match(LANE_CLEANUP, /Exit 0: record lane_cleanup=clean, run no apply and ask nothing/);
});

// Text checks above pin the wording. This one runs both commands as the phase
// spells them, so a flag the tool renames or drops fails here before it fails
// on a user's machine. The child env is built from scratch, so no location the
// tool could read points outside the fixture, and the extra flags only move
// the database and socket folders into it. The one key set below comes from
// the tool's own list, so this file names no lane term.
test('the tool accepts the report and apply commands exactly as the phase spells them', async () => {
  const repoRoot = path.resolve(COMMAND_ROOT, '../../..');
  const tool = LANE_CLEANUP.match(/^\s+report_command: "node (\S+) /m)[1];
  const { LANE_ENV_KEYS } = await import(pathToFileURL(path.join(repoRoot, tool)).href);
  const hostKey = LANE_ENV_KEYS.find((key) => key.endsWith('_BASE_URL'));
  assert.equal(typeof hostKey, 'string', 'the tool lists the model host key');

  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-lane-cleanup-')));
  try {
    const root = path.join(base, 'root');
    const home = path.join(base, 'home');
    const dbDir = path.join(base, 'db');
    for (const dir of [root, home, dbDir]) fs.mkdirSync(dir);
    // Nothing listens on the discard port, so the model host probe is refused at once.
    const env = { PATH: process.env.PATH, HOME: home, TMPDIR: base, [hostKey]: 'http://127.0.0.1:9' };
    assert.equal(spawnSync('git', ['init', '-q', root], { env }).status, 0);
    const fixtureFlags = ['--db-dir', dbDir, '--socket-dir', path.join(base, 'sock')];

    for (const [key, mode] of [['report_command', 'machine'], ['apply_command', 'apply']]) {
      const line = LANE_CLEANUP.match(new RegExp('^\\s+' + key + ': "([^"]+)"$', 'm'))[1];
      const words = line
        .replace(' </dev/null', '')
        .replace('[--shared-model delete|keep]', '--shared-model keep')
        .split(/\s+/);
      assert.equal(words[0], 'node', key + ' must start with node');
      const [script, ...args] = words.slice(1);
      const run = spawnSync(process.execPath, [path.join(repoRoot, script), ...args, ...fixtureFlags], {
        cwd: root,
        encoding: 'utf8',
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      assert.equal(run.status, 0, key + ' must exit 0 on a clean fixture: ' + run.stderr);
      const report = JSON.parse(run.stdout);
      assert.equal(report.mode, mode);
      assert.equal(report.exitCode, 0);
      assert.deepEqual(report.askFirst, []);
    }
  } finally {
    fs.rmSync(base, { force: true, recursive: true });
  }
});

test('the shared-model answer and the closed stdin appear only in the lane cleanup phase', () => {
  for (const text of ['--shared-model', '</dev/null']) {
    assert.ok(occurrences(LANE_CLEANUP, text) > 0, text + ' must appear in phase_7_lane_cleanup');
    assert.equal(occurrences(APPLY_WORKFLOW, text), occurrences(LANE_CLEANUP, text), text + ' must appear nowhere else');
  }
});

test('the lane cleanup asks on every run, reads no earlier answer and writes none', () => {
  assert.match(LANE_CLEANUP, /Ask on every run\./);
  assert.match(LANE_CLEANUP, /never to a later run/);
  assert.match(LANE_CLEANUP, /Never read an earlier state log, run directory or answer to decide whether to ask or what to pass/);
  assert.match(LANE_CLEANUP, /never write the answer to any file, the state log included/);
});

test('the state log records the lane cleanup outcome and never an answer', () => {
  const schema = blockAfterKey(APPLY_WORKFLOW, 'state_log_schema');
  assert.ok(schema.includes('lane_cleanup: "' + LANE_CLEANUP_OUTCOMES.join('|') + '"'));
  const fields = blockAfterKey(APPLY_WORKFLOW, 'phase_8_state_log').match(/fields: \[([^\]]+)\]/)[1].split(', ');
  assert.ok(fields.includes('lane_cleanup'));
  for (const field of [...schema.matchAll(/^ {2}([a-z_]+):/gm)].map((match) => match[1]).concat(fields)) {
    assert.doesNotMatch(field, /answer|shared_model|question/, field + ' must not hold an answer');
  }
  assert.deepEqual(LANE_CLEANUP.match(/outcomes: \[([^\]]+)\]/)[1].split(', '), LANE_CLEANUP_OUTCOMES);
});

test('a cleanup exit 1 is remaining and never decides STATUS', () => {
  assert.match(LANE_CLEANUP, /exit 1 records lane_cleanup=remaining/);
  assert.match(LANE_CLEANUP, /an exit 1 from the tool is remaining, never STATUS=FAILED/);
  assert.ok(blockAfterKey(APPLY_WORKFLOW, 'mutation_boundaries').includes('lane cleanup tool lists as deleted in its apply --json actions'));
});

test('the presentation discloses the cleanup, templates its question and report, and shows its outcome', () => {
  const headings = PRESENTATION.split('\n').filter((line) => /^## \d+\. /.test(line));
  const at = (heading) => headings.indexOf(heading);
  assert.ok(at('## 8. Advisor Rebuild Prompt') >= 0);
  assert.equal(at('## 9. Lane Cleanup'), at('## 8. Advisor Rebuild Prompt') + 1);
  assert.equal(at('## 10. Result Templates'), at('## 9. Lane Cleanup') + 1);
  assert.equal(at('## 11. Compatibility Action'), at('## 10. Result Templates') + 1);

  const plan = sectionAfterHeading(PRESENTATION, '## 4. Apply Plan and Startup Approval');
  assert.match(plan, /^Lane cleanup: after the rebuild prompt, delete what the retired embedding lane left in this checkout/m);

  const cleanup = sectionAfterHeading(PRESENTATION, '## 9. Lane Cleanup');
  assert.ok(cleanup.includes('[askFirst[].question]'));
  assert.ok(cleanup.includes('Reply yes to delete the pulled shared model, or no to keep it.'));
  assert.ok(cleanup.includes('The next run asks again and never reuses an earlier answer.'));
  assert.match(cleanup, /^Lane cleanup: \[clean\|cleaned\|remaining\|failed\|not_applicable\]$/m);

  const result = sectionAfterHeading(PRESENTATION, '## 10. Result Templates');
  assert.ok(result.includes('Lane cleanup: [' + LANE_CLEANUP_OUTCOMES.join('|') + ']'));
});
