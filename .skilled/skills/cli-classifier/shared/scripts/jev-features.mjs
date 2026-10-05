// ───────────────────────────────────────────────────────────────────
// MODULE: Jev Features
// ───────────────────────────────────────────────────────────────────
// The single gate an optional Jev path asks before it runs. A feature is on
// by default and goes off only when the operator sets its switch in the
// environment or in the shared hook-flags file; readiness then asks the jev
// CLI's own `auth status` whether a credential is stored. A closed gate sends
// the caller down its existing non-Jev fallback, so the switches add an
// opt-out without changing behavior on their own.
//
// The module never prints, never reads or passes a key, and discards the
// command's output. The `.cjs` callers require this file, so it ships no
// top-level await.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const __req = createRequire(import.meta.url);
const { configPath, loadConfigFile } = __req('../../../../hooks/shared/hook-flags.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const MASTER_SWITCH = 'JEV_FEATURES';

// One entry per feature: the env var that names its own switch, plus the
// older names operators may already have set. An entry with no aliases keeps
// an empty list so every lookup walks the same shape.
export const FEATURES = Object.freeze({
  'cite-drift': Object.freeze({
    env: 'JEV_FEATURE_CITE_DRIFT',
    aliases: Object.freeze(['SKDOC_CITE_DRIFT_CHECK']),
  }),
  'injection-screen': Object.freeze({
    env: 'JEV_FEATURE_INJECTION_SCREEN',
    aliases: Object.freeze([]),
  }),
  'verdict-fallback': Object.freeze({
    env: 'JEV_FEATURE_VERDICT_FALLBACK',
    aliases: Object.freeze([]),
  }),
  'hallucination-grader': Object.freeze({
    env: 'JEV_FEATURE_HALLUCINATION_GRADER',
    aliases: Object.freeze([]),
  }),
});

const DEFAULT_TIMEOUT_MS = 10000;

// ───────────────────────────────────────────────────────────────────
// 3. SWITCH RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * True only for the string spellings an operator uses to switch a feature
 * off. Any other value, an absent variable or a non-string is not an off
 * signal, so an unset switch leaves its feature on.
 *
 * @param {unknown} value Value resolved for one switch.
 * @returns {boolean} Whether the value switches its feature off.
 */
export function isOff(value) {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off';
}

/**
 * Whether one feature may run, from the master switch, the feature's own
 * switch and its older names in that order. Each key resolves from `env`
 * first and falls back to `config`; an omitted `config` reads the operator's
 * hook-flags file, at `env.HOOK_FLAGS_CONFIG` when set, so a persisted choice
 * works without an exported variable.
 * The environment wins per key, which keeps a saved default overridable.
 *
 * @param {string} name Feature name, one key of FEATURES.
 * @param {Record<string, string | undefined>} [env] Environment to read; defaults to the process environment.
 * @param {Record<string, string | undefined> | null} [config] Operator config to fall back on, or the hook-flags file when omitted.
 * @returns {{ enabled: boolean, reason: string }} Decision plus the switch that decided it.
 */
export function featureSwitch(name, env = process.env, config) {
  const feature = FEATURES[name];
  if (feature === undefined) throw new Error(`unknown jev feature '${name}'`);

  const environment = env ?? process.env;
  const cfg = config === undefined || config === null
    ? loadConfigFile(environment.HOOK_FLAGS_CONFIG || configPath())
    : config;
  const resolve = (key) => (environment[key] !== undefined ? environment[key] : cfg[key]);

  if (isOff(resolve(MASTER_SWITCH))) return { enabled: false, reason: `off: ${MASTER_SWITCH}` };
  if (isOff(resolve(feature.env))) return { enabled: false, reason: `off: ${feature.env}` };
  for (const alias of feature.aliases) {
    if (isOff(resolve(alias))) return { enabled: false, reason: `off: ${alias}` };
  }
  return { enabled: true, reason: 'on: default' };
}

// ───────────────────────────────────────────────────────────────────
// 4. READINESS
// ───────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * The walk runs in-process so the ready check finds the CLI the caller's own
 * environment names without opening a shell of its own. Empty PATH entries are
 * skipped; a missing path, a directory, or a file that cannot be executed is
 * not a match.
 *
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Whether the jev CLI is installed and holds a credential for its provider.
 * A missing executable never spawns. Otherwise one bounded `auth status` call
 * decides: exit 0 means a stored credential, anything else does not. The
 * command's output is discarded and never returned.
 *
 * @param {Record<string, string | undefined>} [env] Environment the search and the call use; defaults to the process environment.
 * @param {{ timeoutMs?: number, spawnSyncFn?: Function }} [options] Timeout for the auth check plus a spawn seam for tests.
 * @returns {{ ready: boolean, path?: string, provider: string, reason: string }} Readiness plus the provider it was checked against.
 */
export function jevReady(env = process.env, { timeoutMs = DEFAULT_TIMEOUT_MS, spawnSyncFn } = {}) {
  const environment = env ?? process.env;
  const provider = environment.JEV_PROVIDER || 'official';
  const found = which('jev', environment);
  if (found === null) return { ready: false, reason: 'jev not on PATH', provider };

  const run = spawnSyncFn ?? spawnSync;
  const result = run(found, ['auth', 'status', '--provider', provider], {
    env: environment,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: timeoutMs,
  });

  if (result.status === 0) return { ready: true, path: found, provider, reason: 'ready' };
  return { ready: false, path: found, provider, reason: 'no stored credential' };
}

// ───────────────────────────────────────────────────────────────────
// 5. FEATURE GATE
// ───────────────────────────────────────────────────────────────────

/**
 * The one call a live path makes: the switch decides first, and only a
 * feature that may run reaches the readiness check. A disabled feature
 * returns without spawning anything, so an off switch never touches the CLI.
 *
 * @param {string} name Feature name, one key of FEATURES.
 * @param {Record<string, string | undefined>} [env] Environment both checks read; defaults to the process environment.
 * @param {{ config?: Record<string, string | undefined> | null, timeoutMs?: number, spawnSyncFn?: Function }} [options] Config override plus the readiness options.
 * @returns {{ ready: boolean, name: string, path?: string, provider?: string, reason: string }} Readiness plus the feature it was asked for.
 */
export function featureReady(name, env = process.env, options = {}) {
  const environment = env ?? process.env;
  const decision = featureSwitch(name, environment, options.config);
  if (!decision.enabled) return { ready: false, name, reason: decision.reason };
  return { ...jevReady(environment, options), name };
}
