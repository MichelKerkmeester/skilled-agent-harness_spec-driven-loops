// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Goal (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the goal command and tool over the shared manage CLI, the per-turn
// brief, the verify note for the next operator turn, and the leaf and kill-switch gates,
// plus the goal-context adapter's packet slice and its throw policy.

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  ERROR_POLICY,
  GOAL_ACTIONS,
  GOAL_COMMAND_NAME,
  GOAL_TOOL_NAME,
  goalCliArgs,
  registerGoalManage,
} from '../dsh/goal-manage.mjs';
import goalCore from '../lib/goal-core.cjs';
import { ERROR_POLICY as goalPolicy, registerGoalContext } from '../dsh/goal-context.mjs';
import {
  adapterHarness,
  cleanup,
  fakeAgent,
  humanMessage,
  interactive,
  leaf,
  noticeText,
  plainNotice,
  pluginHarness,
  tempDir,
} from '../../shared/tests/dsh-plugin-harness.mjs';

const ROOT = '/fixture/repo';
const SCOPE = ['--runtime', 'dsh', '--session', 'session-goal', '--workspace', ROOT];

function stubCore(overrides = {}) {
  return {
    isPluginDisabled: () => false,
    resolveRepoRoot: () => ROOT,
    readGoalRecord: () => null,
    renderGoalBrief: () => '',
    renderResendReminder: () => '',
    verifyGoalHeuristic: () => ({ verdict: 'met', reason: 'done' }),
    recordTurn: () => null,
    ...overrides,
  };
}

function setup({ core = stubCore(), isLeaf = interactive, stdout = 'STATUS=OK ACTION=show\ngoal_present=false' } = {}) {
  const runs = [];
  const harness = pluginHarness();
  registerGoalManage(harness.ctx, {
    core,
    runCli: (argv, options) => {
      runs.push({ argv, options });
      return { status: stdout.startsWith('STATUS=OK') ? 0 : 1, stdout, stderr: '' };
    },
    defineTool: async () => (definition) => definition,
    createNotice: plainNotice,
    isLeaf,
  });
  return { ...harness, runs };
}

test('the goal tool mirrors the OpenCode action set', () => {
  assert.deepEqual(GOAL_ACTIONS, [
    'set', 'bind', 'unbind', 'resent', 'log', 'packet', 'show', 'clear', 'complete', 'pause', 'history', 'resume', 'doctor', 'health',
  ]);
});

test('goal arguments map each action onto the shared manage CLI grammar', () => {
  assert.deepEqual(goalCliArgs({ action: 'bind', packetPath: 'specs/a/001-x', tokenBudget: 5000 }), ['bind', 'specs/a/001-x', '--budget', '5000']);
  assert.deepEqual(goalCliArgs({ action: 'log', item: 'Build | test', state: 'Done', evidence: 'run 3' }), ['log', 'Build / test | Done | run 3']);
  assert.deepEqual(goalCliArgs({ action: 'set', objective: 'Ship parity' }), ['set', 'Ship parity']);
  assert.deepEqual(goalCliArgs({ action: 'pause', reason: 'waiting on review' }), ['pause', 'waiting on review']);
  assert.deepEqual(goalCliArgs({ action: 'packet', packetPath: 'specs/a' }), ['packet', 'specs/a']);
  assert.deepEqual(goalCliArgs({ action: 'complete' }), ['complete']);
  assert.throws(() => goalCliArgs({ action: 'drop-table' }), /Unknown goal action/);
});

test('the goal command runs the manage CLI under this session scope', async () => {
  const { commands, runs } = setup();
  assert.equal(commands.length, 1);
  assert.equal(commands[0].name, GOAL_COMMAND_NAME);
  const { agent } = fakeAgent({ id: 'session-goal' });

  const shown = await commands[0].handler({ agent, rawInput: '' });
  assert.deepEqual(runs[0].argv, ['show', ...SCOPE]);
  assert.equal(runs[0].options.cwd, ROOT);
  assert.equal(shown.kind, 'success');

  await commands[0].handler({ agent, rawInput: ' bind specs/a/001-x' });
  assert.deepEqual(runs[1].argv, ['bind', 'specs/a/001-x', ...SCOPE]);
});

test('the goal command reports a failed envelope as an error', async () => {
  const { commands } = setup({ stdout: 'STATUS=FAIL ACTION=bind ERROR="no goal.md"\ncode=PACKET_GOAL_NOT_FOUND' });
  const { agent } = fakeAgent({ id: 'session-goal' });
  const result = await commands[0].handler({ agent, rawInput: 'bind specs/missing' });
  assert.equal(result.kind, 'error');
  assert.match(result.text, /PACKET_GOAL_NOT_FOUND/);
});

test('an interactive agent gets the goal tool and a fan-out leaf does not', async () => {
  for (const [isLeaf, expected] of [[interactive, 1], [leaf, 0]]) {
    const { fire } = setup({ isLeaf });
    const { agent, tools } = fakeAgent({ id: 'session-goal' });
    await fire('agent/created', { agent, source: 'startup' });
    assert.equal(tools.length, expected);
    if (expected) assert.equal(tools[0].name, GOAL_TOOL_NAME);
  }
});

test('the goal tool returns the manage envelope for its action', async () => {
  const { fire, runs } = setup();
  const { agent, tools } = fakeAgent({ id: 'session-goal' });
  await fire('agent/created', { agent, source: 'startup' });
  const output = await tools[0].execute({ action: 'log', item: 'Adapters', state: 'Done', evidence: 'tests green' }, { agent });
  assert.deepEqual(runs[0].argv, ['log', 'Adapters | Done | tests green', ...SCOPE]);
  assert.match(output, /^STATUS=OK/);
});

test('the goal brief rides each operator turn while a goal is bound', async () => {
  const seen = [];
  const core = stubCore({
    readGoalRecord: (options) => { seen.push(options.scope); return { status: 'active', packetPath: 'specs/a' }; },
    renderGoalBrief: () => 'GOAL BRIEF',
    renderResendReminder: () => 'RESEND REMINDER',
  });
  const { fire } = setup({ core });
  const { agent } = fakeAgent({ id: 'session-goal' });

  const briefed = await fire('agent/pre-step', { agent, messages: [humanMessage('Next task.')] }, async () => ({ kind: 'enter', messages: [] }));
  assert.equal(noticeText(briefed.messages[0]), 'GOAL BRIEF\nRESEND REMINDER');
  assert.deepEqual(seen[0], { workspace: ROOT, runtime: 'dsh', sessionId: 'session-goal' });

  const toolStep = await fire('agent/pre-step', { agent, messages: [] }, async () => ({ kind: 'enter', messages: [] }));
  assert.deepEqual(toolStep.messages, []);
});

test('a turn that misses the goal leaves a verify note for the next operator turn', async () => {
  const recorded = [];
  const core = stubCore({
    readGoalRecord: () => ({ status: 'active', objective: 'Ship parity' }),
    verifyGoalHeuristic: () => ({ verdict: 'not_met', reason: 'no evidence yet' }),
    recordTurn: (_input, options) => recorded.push(options.scope.sessionId),
  });
  const { fire } = setup({ core });
  const events = [{ type: 'assistant/message', data: { turn: 3, message: { role: 'assistant', content: [{ type: 'text', text: 'Partial.' }] } } }];
  const { agent, injected } = fakeAgent({ id: 'session-goal', events });

  await fire('agent/turn-stopping', { agent, turn: 3 });
  assert.deepEqual(recorded, ['session-goal']);
  assert.deepEqual(injected, []);
  await fire('agent/status', { agent, status: 'idle' });
  assert.equal(noticeText(injected[0]), '[goal_verify] verdict=not_met; reason=no evidence yet');
  await fire('agent/status', { agent, status: 'idle' });
  assert.equal(injected.length, 1);
});

test('throw policy: the goal brief fails open and logs when its core throws', async () => {
  assert.equal(ERROR_POLICY, 'fail-open');
  const { fire, logs } = setup({ core: stubCore({ readGoalRecord() { throw new Error('fixture failure'); } }) });
  const { agent } = fakeAgent({ id: 'session-goal' });
  const downstream = { kind: 'enter', messages: [] };
  const result = await fire('agent/pre-step', { agent, messages: [humanMessage('Go.')] }, async () => downstream);
  assert.equal(result, downstream);
  assert.equal(logs.length, 1);
});

test('the goal surface stays dark in a leaf and when the goal concern is off', async () => {
  const leafSetup = setup({ isLeaf: leaf, core: stubCore({ readGoalRecord: () => ({ status: 'active' }), renderGoalBrief: () => 'BRIEF' }) });
  const { agent } = fakeAgent({ id: 'session-goal' });
  const leafStep = await leafSetup.fire('agent/pre-step', { agent, messages: [humanMessage('Go.')] }, async () => ({ kind: 'enter', messages: [] }));
  assert.deepEqual(leafStep.messages, []);

  const off = pluginHarness();
  registerGoalManage(off.ctx, { core: stubCore({ isPluginDisabled: () => true }) });
  assert.equal(off.handlers.size, 0);
  assert.equal(off.commands.length, 0);
});

test('goal context injects the exact CLI chat slice without frontmatter', async () => {
  const directory = tempDir();
  try {
    execFileSync('git', ['-C', directory, 'init', '-q'], { stdio: 'ignore' });
    const packetRelative = path.join(['spec', 's'].join(''), 'fixture-track', '001-goal-context');
    const packetDirectory = path.join(directory, packetRelative);
    mkdirSync(packetDirectory, { recursive: true });
    writeFileSync(path.join(packetDirectory, 'goal.md'), [
      '---',
      'title: Fixture Goal',
      'status: active',
      '---',
      '# Goal: Fixture',
      '',
      '## DURABLE DIRECTIVE',
      '',
      '**Objective:** Keep this exact directive in model context.',
      '',
    ].join('\n'));

    const cliPath = fileURLToPath(new URL(
      '../bin/goal.cjs',
      import.meta.url,
    ));
    const cli = spawnSync(process.execPath, [
      cliPath,
      'packet',
      packetRelative.split(path.sep).join('/'),
      '--workspace',
      directory,
    ], { cwd: directory, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const sliceLine = cli.stdout.split(/\r?\n/).find((line) => line.startsWith('chat_slice='));
    assert.ok(sliceLine, cli.stdout);
    const expectedSlice = JSON.parse(sliceLine.slice('chat_slice='.length));
    assert.doesNotMatch(expectedSlice, /^---$/m);

    const { ctx, handlers } = adapterHarness();
    const injected = [];
    registerGoalContext(ctx, {
      core: goalCore,
      env: { DSH_SPEC_FOLDER: packetRelative },
      cwd: directory,
      createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
    });
    await handlers.get('agent/created')({
      agent: {
        session: { id: 'goal-context-fixture', header: { cwd: directory } },
        inject(message) { injected.push(message); },
      },
      source: 'startup',
    });
    const injectedText = injected[0].content[0].text;
    assert.equal(injectedText, expectedSlice);
    assert.doesNotMatch(injectedText, /^---$/m);
  } finally {
    cleanup(directory);
  }
});

test('goal context logs and continues when its core throws', async () => {
  assert.equal(goalPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerGoalContext(ctx, {
    core: { describePacketGoal() { throw new Error('fixture failure'); } },
    env: { DSH_SPEC_FOLDER: 'fixture-track/001-goal-context' },
    createNotice: async () => assert.fail('a failed goal read must not inject'),
  });
  const result = await handlers.get('agent/created')({
    agent: { session: { id: 'goal-context-throw' }, inject() { assert.fail('unexpected injection'); } },
    source: 'startup',
  });
  assert.equal(result, undefined);
  assert.equal(logs.length, 1);
  assert.equal(handlers.has('tools/pre-execute'), false);
});
