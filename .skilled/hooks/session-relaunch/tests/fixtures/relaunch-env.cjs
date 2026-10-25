// ───────────────────────────────────────────────────────────────────
// MODULE: Hermetic Relaunch Test Environment
// ───────────────────────────────────────────────────────────────────
'use strict';

const {
  DEFAULT_OFF,
  LEGACY_ALIASES,
  MASTER_ALIASES,
  MASTER_FLAG,
  RUNTIMES,
  concernFlag,
  runtimeEnableFlag,
} = require('../../../shared/hook-flags.cjs');

const CONCERN = 'session-relaunch';

// A per-runtime enable switch answers before the global one, and a kill switch beats
// both, so any of these exported in the developer's shell would decide a case before
// the sandbox's own flags do. Every sandbox drops them all before it sets its own.
// The names come from the resolver, so a runtime or alias it adds is dropped too.
const RUNTIME_SWITCH_KEYS = Object.freeze(RUNTIMES.map((runtime) => runtimeEnableFlag(CONCERN, runtime)));

const RELAUNCH_SWITCH_KEYS = Object.freeze([
  ...RUNTIME_SWITCH_KEYS,
  DEFAULT_OFF[CONCERN],
  concernFlag(CONCERN),
  ...(LEGACY_ALIASES[CONCERN] || []),
  MASTER_FLAG,
  ...MASTER_ALIASES,
]);

// A hop can start the next session on the goal command, which refuses while the goal
// concern is off, so an exported goal kill switch would fail those cases as well.
const GOAL_SWITCH_KEYS = Object.freeze([concernFlag('goal'), ...(LEGACY_ALIASES.goal || [])]);

// The flags file can hold the same switches, so an inherited path to the developer's
// file leaks them too. A sandbox that needs a flags file sets its own path.
const HERMETIC_DROP_KEYS = Object.freeze([...RELAUNCH_SWITCH_KEYS, ...GOAL_SWITCH_KEYS, 'HOOK_FLAGS_CONFIG']);

/**
 * Copy an environment without any inherited relaunch switch or flags file path.
 *
 * @param {NodeJS.ProcessEnv} [env=process.env] - Environment to copy.
 * @returns {NodeJS.ProcessEnv} A new object; the input is left unchanged.
 */
function withoutRelaunchSwitches(env = process.env) {
  const clean = { ...env };
  for (const key of HERMETIC_DROP_KEYS) delete clean[key];
  return clean;
}

/**
 * Delete every inherited relaunch switch and the flags file path from an object in place,
 * for suites that drive a plugin through process.env itself.
 *
 * @param {NodeJS.ProcessEnv} [env=process.env] - Environment to clear.
 * @returns {NodeJS.ProcessEnv} The same object.
 */
function clearRelaunchSwitches(env = process.env) {
  for (const key of HERMETIC_DROP_KEYS) delete env[key];
  return env;
}

module.exports = {
  RUNTIME_SWITCH_KEYS,
  RELAUNCH_SWITCH_KEYS,
  GOAL_SWITCH_KEYS,
  HERMETIC_DROP_KEYS,
  withoutRelaunchSwitches,
  clearRelaunchSwitches,
};
