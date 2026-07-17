// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-goal Tool-Path Tests                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Exercises the real tool execute path (executeGoalAction/executeGoalStatus
// resolving sessionID from a ToolContext), which the state-only tests skipped.
// A live opencode run revealed the tool handler — not setGoal — is where a
// session id must resolve, so this pins that contract.

'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const pluginUrl = pathToFileURL(join(__dirname, '..', 'mk-goal.js')).href;
const opencodeRoot = join(__dirname, '..', '..');

async function loadPluginModule() {
  return import(pluginUrl);
}

async function withState(fn) {
  const pluginModule = await loadPluginModule();
  const __test = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-toolpath-'));
  const opts = { stateDir };
  const ctx = { sessionID: 'tool-ctx-sid', messageID: 'm1', agent: 'build' };

  try {
    return await fn({ __test, ctx, opts, pluginModule, stateDir });
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}

test('executeGoalAction set persists an enhanced goal via ToolContext', async () => withState(async ({ __test, ctx, opts }) => {
  const setRes = await __test.executeGoalAction({ action: 'set', objective: 'TOOLPATH_OBJ' }, ctx, opts);
  assert.match(String(setRes), /STATUS=OK/, 'set via ToolContext should succeed (not fail-closed)');

  const goal = await __test.readGoal(ctx.sessionID, opts);
  assert.ok(goal && String(goal.objective).includes('TOOLPATH_OBJ'), 'goal persisted via the tool path');
  assert.ok(goal && String(goal.goalPrompt).includes('Objective: TOOLPATH_OBJ'), 'enhanced prompt persisted via the tool path');
  assert.equal(goal.promptEnhancement.framework, 'CRAFT+TIDD-EC');
  assert.ok(goal.goalPrompt.length <= 4000, 'enhanced prompt respects the hard cap');
}));

test('executeGoalStatus reflects the active tool-path goal', async () => withState(async ({ __test, ctx, opts }) => {
  await __test.executeGoalAction({ action: 'set', objective: 'TOOLPATH_OBJ' }, ctx, opts);
  const statusRes = await __test.executeGoalStatus(ctx, opts);
  assert.match(String(statusRes), /TOOLPATH_OBJ/, 'status reflects the active goal');
  assert.match(String(statusRes), /goal_prompt=/, 'status exposes the enhanced prompt');
  assert.match(String(statusRes), /prompt_clear_score=44/, 'status exposes prompt quality metadata');
}));

test('executeGoalAction clear removes the tool-path goal', async () => withState(async ({ __test, ctx, opts }) => {
  await __test.executeGoalAction({ action: 'set', objective: 'TOOLPATH_OBJ' }, ctx, opts);
  const clearRes = await __test.executeGoalAction({ action: 'clear' }, ctx, opts);
  assert.match(String(clearRes), /STATUS=OK/, 'clear via ToolContext should succeed');

  const after = await __test.readGoal(ctx.sessionID, opts);
  assert.equal(after, null, 'goal cleared after clear');
}));

test('invalid set action returns the documented failure envelope', async () => withState(async ({ __test, ctx, opts }) => {
  const failingSet = await __test.executeGoalAction({ action: 'set' }, ctx, opts);
  assert.match(String(failingSet), /^STATUS=FAIL ACTION=set ERROR=/m);
  assert.match(String(failingSet), /code=INVALID_OBJECTIVE/);
}));

test('registered mk_goal reports created, refreshed, and replaced mutations', async () => withState(async ({ __test, pluginModule, opts }) => {
  const plugin = await pluginModule.default({}, opts);
  const registeredCtx = { sessionID: 'registered-tool-sid', messageID: 'm2', agent: 'build' };
  const registeredSet = await plugin.tool.mk_goal.execute(
    { action: 'set', objective: 'REGISTERED_TOOL_OBJ' },
    registeredCtx,
  );
  assert.match(String(registeredSet), /STATUS=OK ACTION=set/);
  assert.match(String(registeredSet), /mutation=created/);
  const registeredGoal = await __test.readGoal(registeredCtx.sessionID, opts);
  assert.ok(registeredGoal && registeredGoal.objective === 'REGISTERED_TOOL_OBJ');

  const registeredRefresh = await plugin.tool.mk_goal.execute(
    { action: 'set', objective: 'REGISTERED_TOOL_OBJ' },
    registeredCtx,
  );
  assert.match(String(registeredRefresh), /mutation=refreshed/, 're-setting the same objective reports mutation=refreshed');

  const registeredReplace = await plugin.tool.mk_goal.execute(
    { action: 'set', objective: 'REGISTERED_TOOL_OBJ_REPLACED' },
    registeredCtx,
  );
  assert.match(String(registeredReplace), /mutation=replaced/, 'setting a different objective reports mutation=replaced');
}));

test('terminal same-objective set reports replacement and resets counters', async () => withState(async ({ __test, pluginModule, opts }) => {
  const plugin = await pluginModule.default({}, opts);
  const terminalCtx = { sessionID: 'terminal-tool-sid', messageID: 'm3', agent: 'build' };
  const terminalSet = await plugin.tool.mk_goal.execute(
    { action: 'set', objective: 'TERMINAL_TOOL_OBJ', tokenBudget: 20 },
    terminalCtx,
  );
  assert.match(String(terminalSet), /mutation=created/);
  await plugin.tool.mk_goal.execute({ action: 'complete' }, terminalCtx);
  const terminalReplace = await plugin.tool.mk_goal.execute(
    { action: 'set', objective: 'TERMINAL_TOOL_OBJ' },
    terminalCtx,
  );
  assert.match(String(terminalReplace), /mutation=replaced/);
  const terminalGoal = await __test.readGoal(terminalCtx.sessionID, opts);
  assert.ok(terminalGoal.goalId);
  assert.notEqual(terminalGoal.goalId, 'tool-goal');
  assert.equal(terminalGoal.status, 'active');
  assert.equal(terminalGoal.tokensUsed, 0);
  assert.equal(terminalGoal.timeUsedSeconds, 0);
  assert.equal(terminalGoal.tokenBudget, 20);
}));

test('goal command documentation exposes the registered command contract', async () => {
  const commandPath = join(opencodeRoot, 'commands', 'goal-opencode.md');
  const commandDoc = await readFile(commandPath, 'utf8');
  assert.match(commandDoc, /^# \/goal/m);
  assert.match(commandDoc, /allowed-tools: mk_goal, mk_goal_status/);
});

test('goal plugin reference links the OpenCode command document', async () => {
  const referenceDoc = await readFile(
    join(opencodeRoot, 'skills', 'system-spec-kit', 'references', 'hooks', 'goal_plugin.md'),
    'utf8',
  );
  assert.match(referenceDoc, /\.opencode\/commands\/goal-opencode\.md/);
});

test('regression graph key files exclude non-deliverable legacy basenames', async () => {
  const phaseRoot = join(opencodeRoot, 'specs', 'deep-loops', '032-goal-opencode-plugin');
  const graph = JSON.parse(await readFile(
    join(phaseRoot, '012-regression-test-backfill', 'graph-metadata.json'),
    'utf8',
  ));
  const forbiddenKeyFileBasenames = new Set([
    'mk-spec-memory.js',
    'session-cleanup.js',
    'goal.md',
    'opencode_goal.md',
  ]);
  const keyFiles = graph?.derived?.key_files || [];
  for (const keyFile of keyFiles) {
    const basename = String(keyFile).split('/').at(-1);
    assert.equal(
      forbiddenKeyFileBasenames.has(basename),
      false,
      `012 graph-metadata key_files contains non-deliverable ${basename}`,
    );
  }
});
