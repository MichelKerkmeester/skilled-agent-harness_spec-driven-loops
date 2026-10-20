// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ opencode-goal render parity — the two renderers agree on every label     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Two implementations render the same injected block: the OpenCode plugin and
// the runtime-neutral core that Pi, Cursor and Devin use. A model reading one
// runtime's block must find the same field names it learned on another, so the
// label set is a contract. Exactly two lines differ by design: `usage:`, where
// OpenCode reports a native token count and an auto-turn ratio while the other
// runtimes report an honest absence and a turn estimate, and the `Role:` line
// inside `goal_prompt:`, which names the runtime doing the reading.
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdir, mkdtemp, rm, stat, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const core = require('../../hooks/goal/lib/goal-core.cjs');
const pluginUrl = pathToFileURL(join(__dirname, '..', 'opencode-goal.js')).href;

async function loadGoalCore(pluginModule) {
  const coreUrl = pathToFileURL(join(__dirname, '..', 'lib', 'opencode-goal-core.js')).href;
  const coreModule = await import(coreUrl);
  return coreModule.getGoalCore(pluginModule.default.server);
}

const OBJECTIVE = 'Ship the parity fixture and verify it';

function labelsOf(block) {
  return block
    .split('\n')
    .map((line) => {
      if (/^\[active_goal:/.test(line)) return '[active_goal:<id>]';
      if (line === '[/active_goal]') return line;
      const match = line.match(/^([a-z_]+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);
}

// Masks the three values each runtime owns: the goal id, the usage line, and the
// runtime name baked into the role line. Everything else must match line for
// line, so drift in a shared line or in the prompt block fails here.
function comparableLines(block) {
  return block.split('\n').map((line) => {
    if (line.startsWith('[active_goal:')) return '[active_goal:<id>]';
    if (line.startsWith('usage:')) return 'usage: <runtime-specific>';
    if (/^Role: Focused .+? execution agent operating under the active session goal\.$/.test(line)) {
      return 'Role: Focused <runtime> execution agent operating under the active session goal.';
    }
    return line;
  });
}

test('both renderers emit the same ordered labels and blocks, differing only where a runtime names itself', async () => {
  const pluginModule = await import(pluginUrl);
  const helpers = await loadGoalCore(pluginModule);
  const stateDir = await mkdtemp(join(tmpdir(), 'goal-parity-'));
  const coreStateDir = await mkdtemp(join(tmpdir(), 'goal-parity-core-'));
  try {
    const pluginOptions = { stateDir };
    await helpers.setGoal('parity-session', OBJECTIVE, pluginOptions);
    const pluginGoal = await helpers.readGoal('parity-session', pluginOptions);
    const pluginBlock = helpers.renderGoalInjection(pluginGoal, pluginOptions);

    const coreOptions = { stateDir: coreStateDir, scope: { runtime: 'pi', sessionId: 'parity-session', workspace: coreStateDir } };
    const { record } = core.setGoal({ objective: OBJECTIVE }, coreOptions);
    const coreBlock = core.renderGoalBrief({ goal: record, runtimeLabel: 'Pi' });

    assert.deepEqual(labelsOf(coreBlock), labelsOf(pluginBlock), 'label set and order must match');
    assert.deepEqual(
      labelsOf(pluginBlock),
      ['[active_goal:<id>]', 'status', 'objective', 'goal_prompt', 'last_check', 'usage', 'directive', '[/active_goal]'],
      'the pinned label set',
    );

    const lineFor = (block, label) => block.split('\n').find((line) => line.startsWith(`${label}:`));
    assert.deepEqual(
      comparableLines(coreBlock),
      comparableLines(pluginBlock),
      'the blocks may differ only in the goal id, the usage line and the role line',
    );
    for (const label of ['status', 'last_check', 'directive']) {
      assert.equal(lineFor(coreBlock, label), lineFor(pluginBlock, label), `${label} must be identical`);
    }
    assert.equal(lineFor(coreBlock, 'objective'), lineFor(pluginBlock, 'objective'));

    const coreRole = lineFor(coreBlock, 'Role');
    const pluginRole = lineFor(pluginBlock, 'Role');
    assert.notEqual(coreRole, pluginRole, 'the role line names the reading runtime');
    assert.match(coreRole, /^Role: Focused Pi execution agent/);
    assert.match(pluginRole, /^Role: Focused OpenCode execution agent/);

    const coreUsage = lineFor(coreBlock, 'usage');
    const pluginUsage = lineFor(pluginBlock, 'usage');
    assert.notEqual(coreUsage, pluginUsage, 'usage is the one intended difference');
    assert.match(coreUsage, /^usage: tokens n\/a\/none; time \d+s; iteration \d+ \(source: turn-count-estimate\)$/);
    assert.match(pluginUsage, /^usage: tokens \d+\/none; time \d+s; iteration \d+\/\d+$/);
  } finally {
    await rm(stateDir, { recursive: true, force: true });
    await rm(coreStateDir, { recursive: true, force: true });
  }
});

test('the brief cache key changes when a same-length write lands in the same millisecond', async () => {
  const pluginModule = await import(pluginUrl);
  const helpers = await loadGoalCore(pluginModule);
  const stateDir = await mkdtemp(join(tmpdir(), 'goal-cachekey-'));
  try {
    const options = { stateDir };
    await helpers.setGoal('cache-session', OBJECTIVE, options);
    const path = helpers.goalPathForSession('cache-session', options);
    const before = await stat(path, { bigint: true });
    const keyBefore = helpers.goalBriefCacheKey(before);
    // A verdict flip is the same byte length, so a millisecond-resolution key
    // would collide; the key must still change.
    const goal = await helpers.readGoal('cache-session', options);
    await helpers.writeGoalAtomic({ ...goal, lastVerifierVerdict: 'met' }, options);
    const after = await stat(path, { bigint: true });
    assert.notEqual(helpers.goalBriefCacheKey(after), keyBefore, 'the key must track any write');
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
});

// A bound packet adds one label both renderers must agree on. Criteria are the
// part that decides when work is done, so a runtime that renders them under a
// different name, or not at all, breaks the contract the model reads across
// runtimes.
test('both renderers emit the same criteria field for a bound packet', async () => {
  const pluginModule = await import(pluginUrl);
  const helpers = await loadGoalCore(pluginModule);
  const workspace = await mkdtemp(join(tmpdir(), 'goal-parity-packet-'));
  const stateDir = await mkdtemp(join(tmpdir(), 'goal-parity-pstate-'));
  try {
    await mkdir(join(workspace, '.git'), { recursive: true });
    await mkdir(join(workspace, 'specs', 't', '001-fixture'), { recursive: true });
    await writeFile(join(workspace, 'specs', 't', '001-fixture', 'goal.md'), [
      '---', 'title: "Goal: parity"', '---',
      '<!-- ANCHOR:directive -->', '**Objective:** Ship it.', '<!-- /ANCHOR:directive -->',
      '<!-- ANCHOR:completion -->', '- [ ] alpha holds', '- [ ] beta holds', '<!-- /ANCHOR:completion -->',
      '<!-- ANCHOR:log -->', '| Item | State | Evidence |', '|---|---|---|', '<!-- /ANCHOR:log -->', '',
    ].join('\n'), 'utf8');

    const pluginOptions = { stateDir, directory: workspace };
    const ctx = { sessionID: 'parity-packet' };
    await helpers.executeGoalAction({ action: 'bind', packetPath: 'specs/t/001-fixture' }, ctx, pluginOptions);
    const pluginGoal = await helpers.readGoal(ctx.sessionID, pluginOptions);
    const pluginBlock = helpers.renderGoalInjection(pluginGoal, pluginOptions);

    const coreOptions = { stateDir, scope: { runtime: 'pi', sessionId: 'parity-packet-core', workspace } };
    const { record } = core.bindGoal({ packetPath: 'specs/t/001-fixture' }, coreOptions);
    const coreBlock = core.renderGoalBrief({ goal: record, runtimeLabel: 'Pi', workspace });

    assert.deepEqual(labelsOf(coreBlock), labelsOf(pluginBlock), 'label set and order must match when bound');
    assert.deepEqual(
      labelsOf(pluginBlock),
      ['[active_goal:<id>]', 'status', 'objective', 'criteria', 'goal_prompt', 'last_check', 'usage', 'directive', '[/active_goal]'],
      'the pinned bound label set',
    );
    assert.deepEqual(
      comparableLines(coreBlock),
      comparableLines(pluginBlock),
      'the bound blocks may differ only in the goal id, the usage line and the role line',
    );
    const criteriaOf = (block) => block.split('\n').filter((line) => line === '- alpha holds' || line === '- beta holds');
    assert.deepEqual(criteriaOf(coreBlock), ['- alpha holds', '- beta holds']);
    assert.deepEqual(criteriaOf(pluginBlock), ['- alpha holds', '- beta holds']);
  } finally {
    await rm(workspace, { recursive: true, force: true });
    await rm(stateDir, { recursive: true, force: true });
  }
});
