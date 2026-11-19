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

async function loadGoalCore(pluginModule) {
  const coreUrl = pathToFileURL(join(__dirname, '..', 'lib', 'opencode-goal-core.js')).href;
  const coreModule = await import(coreUrl);
  return coreModule.getGoalCore(pluginModule.default.factory);
}

test('module exports only the default plugin entrypoint', async () => {
  const pluginModule = await loadPluginModule();
  assert.deepEqual(Object.keys(pluginModule), ['default']);
});

test('default export is an OpenCode 2 plugin object with a hidden factory', async () => {
  const pluginModule = await loadPluginModule();
  assert.equal(typeof pluginModule.default, 'object');
  assert.deepEqual(Object.keys(pluginModule.default).sort(), ['id', 'setup']);
  assert.equal(pluginModule.default.id, 'opencode-goal');
  assert.equal(typeof pluginModule.default.factory, 'function');
  assert.equal(typeof pluginModule.default.setup, 'function');
});

test('core exposes the complete pinned helper list', async () => {
  const pluginModule = await loadPluginModule();
  assert.deepEqual(Object.keys(await loadGoalCore(pluginModule)).sort(), [
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
