"use strict";

// Central kill-switch resolver for every repo-authored runtime hook. A hook is
// enabled by default and only goes silent when the operator sets a kill-switch,
// so adding this guard changes no behavior until a flag is set. The master
// switch disables the whole enforcement layer at once; a per-concern switch
// disables one hook family across every runtime that carries it. Names that
// predate this convention are honored as aliases so existing operator config
// keeps working.
//
// Flags come from two places: the live environment, and an optional operator
// config file (hook-flags.env) that lets a user persist their choices without
// exporting env vars every session. The environment always wins over the file,
// so a persistent default in the file can still be overridden per session.

const fs = require("node:fs");
const path = require("node:path");

const MASTER_FLAG = "MK_HOOKS_DISABLED";

// concern -> extra env vars that also disable it (the pre-convention names).
const LEGACY_ALIASES = {
  goal: ["MK_GOAL_PLUGIN_DISABLED"],
  dispatch: ["MK_CLI_DISPATCH_AUDIT_DISABLED"],
  "skill-advisor": [
    "MK_SKILL_ADVISOR_HOOK_DISABLED",
    "MK_SKILL_ADVISOR_PLUGIN_DISABLED",
    "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED",
    "SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED",
  ],
  completion: ["MK_COMPLETION_SENTINEL_DISABLED", "MK_SPECKIT_COMPLETION_DISABLED"],
  "spec-memory": ["MK_SPEC_MEMORY_PLUGIN_DISABLED", "SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED"],
  "spec-gate": ["SPECKIT_SPEC_GATE_DISABLED"],
};

// The operator config file: sibling of this shared/ dir, in the hooks hub root.
// Overridable via HOOK_FLAGS_CONFIG so tests and alternate layouts can point
// elsewhere without touching the repo copy. Resolved per read (not at load) so
// a late override is honored after _resetConfigCache().
function configPath() {
  return process.env.HOOK_FLAGS_CONFIG || path.join(__dirname, "..", "hook-flags.env");
}

const EMPTY_CONFIG = Object.freeze({});

function isTruthy(value) {
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

// Parse a KEY=value config file into a plain object. Blank lines and lines
// beginning with '#' are ignored; surrounding single/double quotes on the value
// are stripped. Any read/parse failure returns {} so a broken or absent file
// can never disable a hook the operator did not ask to disable (fail-open).
function loadConfigFile(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return {};
  }
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      val.length >= 2 &&
      ((val[0] === '"' && val[val.length - 1] === '"') ||
        (val[0] === "'" && val[val.length - 1] === "'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

// The config file is read once per process — hooks run on every turn, so a
// re-read per lookup would be wasteful. Tests reset this via _resetConfigCache.
let cachedConfig = null;
function fileConfig() {
  if (cachedConfig === null) cachedConfig = loadConfigFile(configPath());
  return cachedConfig;
}
function _resetConfigCache() {
  cachedConfig = null;
}

// True unless the master switch or one of this concern's kill-switches is set.
// `env` is injectable for testing; it defaults to the live process environment.
// When `env` is passed explicitly, the config file is skipped so tests stay
// isolated — unless a `config` object is also injected to exercise the merge.
// The environment always overrides the config file for a given key.
function isHookEnabled(concern, env, config) {
  const hasEnv = env !== undefined && env !== null;
  const source = hasEnv ? env : process.env;
  const cfg =
    config !== undefined && config !== null
      ? config
      : hasEnv
        ? EMPTY_CONFIG
        : fileConfig();
  const resolve = (key) => {
    const fromEnv = source[key];
    return fromEnv !== undefined ? fromEnv : cfg[key];
  };
  if (isTruthy(resolve(MASTER_FLAG))) return false;
  const flag = concernFlag(concern);
  const keys = (flag ? [flag] : []).concat(LEGACY_ALIASES[concern] || []);
  for (const key of keys) {
    if (isTruthy(resolve(key))) return false;
  }
  return true;
}

// The canonical per-concern kill-switch env var for a concern slug. A blank
// concern has no flag (skipped), so callers never look up "MK__DISABLED".
function concernFlag(concern) {
  if (concern === null || concern === undefined) return null;
  const slug = String(concern).trim();
  if (!slug) return null;
  return "MK_" + slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_") + "_DISABLED";
}

module.exports = {
  isHookEnabled,
  concernFlag,
  isTruthy,
  loadConfigFile,
  MASTER_FLAG,
  LEGACY_ALIASES,
  configPath,
  _resetConfigCache,
};
