// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ opencode-goal render parity — the two renderers agree on every label     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Two implementations render the same injected block: the OpenCode plugin and
// the runtime-neutral core that Pi, Cursor and Devin use. A model reading one
// runtime's block must find the same field names it learned on another, so the
// label set is a contract. Exactly one line differs by design: `usage:`, where
// OpenCode reports a native token count and an auto-turn ratio and the other
// runtimes report an honest absence and a turn estimate.
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const core = require('../../hooks/goal/lib/goal-core.cjs');
const pluginUrl = pathToFileURL(join(__dirname, '..', 'opencode-goal.js')).href;

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

test('both renderers emit the same ordered label set, and only the usage line differs', async () => {
  const pluginModule = await import(pluginUrl);
  const { __test } = pluginModule.default;
  const stateDir = await mkdtemp(join(tmpdir(), 'goal-parity-'));
  const coreStateDir = await mkdtemp(join(tmpdir(), 'goal-parity-core-'));
  try {
    const pluginOptions = { stateDir };
    await __test.setGoal('parity-session', OBJECTIVE, pluginOptions);
    const pluginGoal = await __test.readGoal('parity-session', pluginOptions);
    const pluginBlock = __test.renderGoalInjection(pluginGoal, pluginOptions);

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
    for (const label of ['status', 'last_check', 'directive']) {
      assert.equal(lineFor(coreBlock, label), lineFor(pluginBlock, label), `${label} must be identical`);
    }
    assert.equal(lineFor(coreBlock, 'objective'), lineFor(pluginBlock, 'objective'));

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
  const { __test } = pluginModule.default;
  const stateDir = await mkdtemp(join(tmpdir(), 'goal-cachekey-'));
  try {
    const options = { stateDir };
    await __test.setGoal('cache-session', OBJECTIVE, options);
    const path = __test.goalPathForSession('cache-session', options);
    const { stat } = require('node:fs/promises');
    const before = await stat(path, { bigint: true });
    const keyBefore = __test.goalBriefCacheKey(before);
    // A verdict flip is the same byte length, so a millisecond-resolution key
    // would collide; the key must still change.
    const goal = await __test.readGoal('cache-session', options);
    await __test.writeGoalAtomic({ ...goal, lastVerifierVerdict: 'met' }, options);
    const after = await stat(path, { bigint: true });
    assert.notEqual(__test.goalBriefCacheKey(after), keyBefore, 'the key must track any write');
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
});
