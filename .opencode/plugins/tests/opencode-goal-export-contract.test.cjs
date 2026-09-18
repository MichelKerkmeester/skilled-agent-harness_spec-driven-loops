// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: opencode-goal Export Contract Tests                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the OpenCode plugin loader export shape.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

async function loadPluginModule() {
  const pluginUrl = pathToFileURL(join(__dirname, '..', 'opencode-goal.js')).href;
  return import(pluginUrl);
}

test('module exports only the default plugin entrypoint', async () => {
  const pluginModule = await loadPluginModule();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
});

test('default export is a plugin factory function', async () => {
  const pluginModule = await loadPluginModule();
  assert.equal(typeof pluginModule.default, 'function');
});

test('default export exposes the complete pinned __test seam list', async () => {
  const pluginModule = await loadPluginModule();
  assert.deepEqual(Object.keys(pluginModule.default.__test).sort(), [
    'GoalError',
    'accountUsage',
    'appendGoalBrief',
    'bindGoal',
    'buildEnhancedGoalPrompt',
    'clearGoal',
    'ensureGoalStateDir',
    'executeGoalAction',
    'executeGoalStatus',
    'fsyncDirectory',
    'goalBriefCacheKey',
    'goalPathForSession',
    'markGoalStatus',
    'maybeContinueGoal',
    'maybeVerifyGoal',
    'noteResent',
    'readGoal',
    'renderGoalInjection',
    'resendPending',
    'sessionKeyForSession',
    'setGoal',
    'unbindGoal',
    'writeGoalAtomic',
  ]);
});
