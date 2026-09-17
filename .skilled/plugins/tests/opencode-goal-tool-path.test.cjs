// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: opencode-goal Tool-Path Tests                                        ║
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

const pluginUrl = pathToFileURL(join(__dirname, '..', 'opencode-goal.js')).href;
const opencodeRoot = join(__dirname, '..', '..');

async function loadPluginModule() {
  return import(pluginUrl);
}

async function withState(fn) {
  const pluginModule = await loadPluginModule();
  const __test = pluginModule.default.__test;
  const stateDir = await mkdtemp(join(tmpdir(), 'opencode-goal-toolpath-'));
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

test('registered opencode_goal reports created, refreshed, and replaced mutations', async () => withState(async ({ __test, pluginModule, opts }) => {
  const plugin = await pluginModule.default({}, opts);
  const registeredCtx = { sessionID: 'registered-tool-sid', messageID: 'm2', agent: 'build' };
  const registeredSet = await plugin.tool.opencode_goal.execute(
    { action: 'set', objective: 'REGISTERED_TOOL_OBJ' },
    registeredCtx,
  );
  assert.match(String(registeredSet), /STATUS=OK ACTION=set/);
  assert.match(String(registeredSet), /mutation=created/);
  const registeredGoal = await __test.readGoal(registeredCtx.sessionID, opts);
  assert.ok(registeredGoal && registeredGoal.objective === 'REGISTERED_TOOL_OBJ');

  const registeredRefresh = await plugin.tool.opencode_goal.execute(
    { action: 'set', objective: 'REGISTERED_TOOL_OBJ' },
    registeredCtx,
  );
  assert.match(String(registeredRefresh), /mutation=refreshed/, 're-setting the same objective reports mutation=refreshed');

  const registeredReplace = await plugin.tool.opencode_goal.execute(
    { action: 'set', objective: 'REGISTERED_TOOL_OBJ_REPLACED' },
    registeredCtx,
  );
  assert.match(String(registeredReplace), /mutation=replaced/, 'setting a different objective reports mutation=replaced');
}));

test('terminal same-objective set reports replacement and resets counters', async () => withState(async ({ __test, pluginModule, opts }) => {
  const plugin = await pluginModule.default({}, opts);
  const terminalCtx = { sessionID: 'terminal-tool-sid', messageID: 'm3', agent: 'build' };
  const terminalSet = await plugin.tool.opencode_goal.execute(
    { action: 'set', objective: 'TERMINAL_TOOL_OBJ', tokenBudget: 20 },
    terminalCtx,
  );
  assert.match(String(terminalSet), /mutation=created/);
  await plugin.tool.opencode_goal.execute({ action: 'complete' }, terminalCtx);
  const terminalReplace = await plugin.tool.opencode_goal.execute(
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
  assert.match(commandDoc, /allowed-tools: opencode_goal, opencode_goal_status/);
});

test('goal plugin reference links the OpenCode command document', async () => {
  const referenceDoc = await readFile(
    join(opencodeRoot, 'hooks', 'goal', 'goal-plugin.md'),
    'utf8',
  );
  assert.match(referenceDoc, /\.opencode\/commands\/goal-opencode\.md/);
});

test('regression graph key files exclude non-deliverable legacy basenames', async () => {
  // Historical graph metadata must not point at files absent from the deliverable runtime.
  const phaseRoot = join(opencodeRoot, 'specs', 'system-deep-loop', 'z_archive', '026-goal-opencode-plugin');
  const graph = JSON.parse(await readFile(
    join(phaseRoot, '012-regression-test-backfill', 'graph-metadata.json'),
    'utf8',
  ));
  const forbiddenKeyFileBasenames = new Set([
    'system-spec-memory.js',
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

// ─────────────────────────────────────────────────────────────────────────────
// PACKET BINDING THROUGH THE TOOL PATH
// ─────────────────────────────────────────────────────────────────────────────

const { mkdir, writeFile } = require('node:fs/promises');

async function writePacketGoal(root, rel) {
  const dir = join(root, rel);
  await mkdir(dir, { recursive: true });
  await mkdir(join(root, '.git'), { recursive: true });
  await writeFile(join(dir, 'goal.md'), [
    '---', 'title: "Goal: fixture"', '_memory:', '  continuity:', '    session_dedup:', '      session_id: "SECRET"', '---',
    '<!-- ANCHOR:directive -->', '**Objective:** Ship it.', '<!-- /ANCHOR:directive -->',
    '<!-- ANCHOR:completion -->', '- [ ] TOOLPATH_CRITERION', '<!-- /ANCHOR:completion -->',
    '<!-- ANCHOR:log -->', '| Item | State | Evidence |', '|---|---|---|', '<!-- /ANCHOR:log -->', '',
  ].join('\n'), 'utf8');
}

test('executeGoalAction bind derives the objective from the packet and the injection never carries frontmatter', async () => withState(async ({ __test, ctx, opts, stateDir }) => {
  await writePacketGoal(stateDir, 'specs/t/001-fixture');
  const bindOpts = { ...opts, directory: stateDir };
  const bindRes = await __test.executeGoalAction({ action: 'bind', packetPath: 'specs/t/001-fixture' }, ctx, bindOpts);
  assert.match(String(bindRes), /STATUS=OK ACTION=bind/);
  assert.match(String(bindRes), /mutation=bound/);
  assert.match(String(bindRes), /packet_bound=true/);
  assert.match(String(bindRes), /resend_pending=true/);
  const goal = await __test.readGoal(ctx.sessionID, opts);
  assert.equal(goal.packetPath, 'specs/t/001-fixture');
  assert.ok(String(goal.objective).startsWith('Execute specs/t/001-fixture/goal.md.'));
  const block = __test.renderGoalInjection(goal, bindOpts);
  assert.ok(block.includes('TOOLPATH_CRITERION'));
  assert.ok(!block.includes('SECRET'));
  const resentRes = await __test.executeGoalAction({ action: 'resent' }, ctx, bindOpts);
  assert.match(String(resentRes), /resend_pending=false/);
}));

test('executeGoalAction packet reads a packet without binding, and bind refuses a missing document', async () => withState(async ({ __test, ctx, opts, stateDir }) => {
  await writePacketGoal(stateDir, 'specs/t/001-fixture');
  const readOpts = { ...opts, directory: stateDir };
  const packetRes = await __test.executeGoalAction({ action: 'packet', packetPath: 'specs/t/001-fixture' }, ctx, readOpts);
  assert.match(String(packetRes), /STATUS=OK ACTION=packet/);
  assert.match(String(packetRes), /packet_nested=false/);
  assert.ok(!String(packetRes).includes('SECRET'));
  assert.equal(await __test.readGoal(ctx.sessionID, opts), null);
  const missing = await __test.executeGoalAction({ action: 'bind', packetPath: 'specs/t/never' }, ctx, readOpts);
  assert.match(String(missing), /STATUS=FAIL/);
  assert.match(String(missing), /PACKET_GOAL_NOT_FOUND/);
}));


test('the system transform carries the resend reminder while the bound packet is unresent', async () => withState(async ({ __test, ctx, opts, stateDir, pluginModule }) => {
  await writePacketGoal(stateDir, 'specs/t/001-fixture');
  const bindOpts = { ...opts, directory: stateDir };
  await __test.executeGoalAction({ action: 'bind', packetPath: 'specs/t/001-fixture' }, ctx, bindOpts);
  const output = { system: [] };
  await pluginModule.default.__test.appendGoalBrief({ sessionID: ctx.sessionID }, output, bindOpts);
  assert.ok(output.system.some((entry) => entry.includes('[goal_resend_pending]')), 'reminder rides the injection');
  await __test.executeGoalAction({ action: 'resent' }, ctx, bindOpts);
  const after = { system: [] };
  await pluginModule.default.__test.appendGoalBrief({ sessionID: ctx.sessionID }, after, bindOpts);
  assert.ok(!after.system.some((entry) => entry.includes('[goal_resend_pending]')), 'reminder clears after resent');
}));

test('executeGoalAction unbind, log, packet budget and an unknown action', async () => withState(async ({ __test, ctx, opts, stateDir }) => {
  await writePacketGoal(stateDir, 'specs/t/001-fixture');
  const bindOpts = { ...opts, directory: join(stateDir, 'specs') };
  const bindRes = await __test.executeGoalAction({ action: 'bind', packetPath: 'specs/t/001-fixture' }, ctx, bindOpts);
  assert.match(String(bindRes), /packet_bound=true/, 'bind resolves against the repo root, not the subdirectory');
  assert.match(String(bindRes), /packet_state=bound/);
  const logRes = await __test.executeGoalAction({ action: 'log', item: 'from plugin', state: 'Done', evidence: 'tool' }, ctx, bindOpts);
  assert.match(String(logRes), /STATUS=OK ACTION=log/);
  const doc = await readFile(join(stateDir, 'specs', 't', '001-fixture', 'goal.md'), 'utf8');
  assert.ok(doc.includes('| from plugin | Done | tool |'));
  const packetRes = await __test.executeGoalAction({ action: 'packet', packetPath: 'specs/t/001-fixture' }, ctx, bindOpts);
  assert.match(String(packetRes), /packet_budget=/);
  const unknown = await __test.executeGoalAction({ action: 'explode' }, ctx, bindOpts);
  assert.match(String(unknown), /STATUS=FAIL/);
  assert.match(String(unknown), /UNKNOWN_ACTION/);
  const unbindRes = await __test.executeGoalAction({ action: 'unbind' }, ctx, bindOpts);
  assert.match(String(unbindRes), /mutation=unbound/);
  assert.match(String(unbindRes), /packet_state=unbound/);
}));

test('executeGoalAction set reports a truncated text objective', async () => withState(async ({ __test, ctx, opts }) => {
  const res = await __test.executeGoalAction({ action: 'set', objective: 'y'.repeat(4500) }, ctx, opts);
  assert.match(String(res), /STATUS=OK ACTION=set/);
  assert.match(String(res), /warning="objective was 4500 characters and was truncated to 4000/);
}));

test('a rebind to a different packet leaves the prior record in history', async () => withState(async ({ __test, ctx, opts, stateDir }) => {
  await writePacketGoal(stateDir, 'specs/t/001-fixture');
  await writePacketGoal(stateDir, 'specs/t/002-other');
  const bindOpts = { ...opts, directory: stateDir };
  const first = await __test.executeGoalAction({ action: 'bind', packetPath: 'specs/t/001-fixture' }, ctx, bindOpts);
  const firstId = String(first).match(/goal_id=(\S+)/)[1];
  const second = await __test.executeGoalAction({ action: 'bind', packetPath: 'specs/t/002-other' }, ctx, bindOpts);
  assert.match(String(second), /mutation=rebound/);
  const history = await __test.executeGoalAction({ action: 'history' }, ctx, bindOpts);
  assert.ok(String(history).includes(firstId), 'prior record archived on rebind');
}));
