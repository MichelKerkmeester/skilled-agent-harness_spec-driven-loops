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

// Bridge legacy env names onto their new equivalents once, as early as possible.
// Nearly every runtime hook loads this module, so wiring the bridge here covers
// the whole library from a single place; entry points with no flag dependency
// (the standalone daemon launchers) call it themselves.
require("./env-aliases.cjs").applyEnvAliases();

const MASTER_FLAG = "SYSTEM_HOOKS_DISABLED";
// The master switch was renamed from its opaque prefix to a self-describing one.
// The old name stays honored so any operator who exported it keeps their opt-out.
const MASTER_ALIASES = ["MK_HOOKS_DISABLED"];

// Canonical per-concern kill-switch, where the new name does not follow the
// default `SYSTEM_<CONCERN>_DISABLED` shape because the hook is owned by a named
// skill or CLI surface rather than the framework core. Concerns not listed here
// fall back to the default shape in concernFlag().
const CONCERN_CANONICAL = {
  goal: "OPENCODE_GOAL_DISABLED",
  dispatch: "CLI_DISPATCH_AUDIT_DISABLED",
  "mcp-route-guard": "MCP_ROUTE_GUARD_DISABLED",
  "codex-watchdog": "CODEX_HOOKS_WATCHDOG_DISABLED",
  "git-preflight": "SK_GIT_PREFLIGHT_DISABLED",
  "post-edit-quality": "SK_CODE_POST_EDIT_QUALITY_DISABLED",
};

// concern -> extra env vars that also disable it. Three generations coexist here
// so operator config written against any of them keeps working: the still-older
// MK_/SPECKIT_ aliases, and the self-describing variant names that a concern's
// own plugin/config/docs use where they differ from concernFlag()'s canonical
// (e.g. a plugin's *_PLUGIN_DISABLED / *_HOOK_DISABLED const, or a doc's shorter
// spelling). concernFlag() supplies the one canonical name; everything a real
// surface also documents or exports for the same concern is listed here so the
// documented switch actually disables the hook.
const LEGACY_ALIASES = {
  goal: ["OPENCODE_GOAL_PLUGIN_DISABLED", "MK_GOAL_DISABLED", "MK_GOAL_PLUGIN_DISABLED"],
  dispatch: ["SYSTEM_DISPATCH_DISABLED", "MK_DISPATCH_DISABLED", "MK_CLI_DISPATCH_AUDIT_DISABLED"],
  "skill-advisor": [
    "SYSTEM_SKILL_ADVISOR_HOOK_DISABLED",
    "SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED",
    "MK_SKILL_ADVISOR_DISABLED",
    "MK_SKILL_ADVISOR_HOOK_DISABLED",
    "MK_SKILL_ADVISOR_PLUGIN_DISABLED",
    "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED",
    "SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED",
  ],
  completion: [
    "SYSTEM_SPECKIT_COMPLETION_DISABLED",
    "SYSTEM_COMPLETION_SENTINEL_DISABLED",
    "MK_COMPLETION_DISABLED",
    "MK_COMPLETION_SENTINEL_DISABLED",
    "MK_SPECKIT_COMPLETION_DISABLED",
  ],
  "spec-gate": ["MK_SPEC_GATE_DISABLED", "SPECKIT_SPEC_GATE_DISABLED"],
  "mcp-route-guard": ["MK_MCP_ROUTE_GUARD_DISABLED"],
  "codex-watchdog": ["CODEX_WATCHDOG_DISABLED", "MK_CODEX_WATCHDOG_DISABLED", "MK_CODEX_HOOKS_WATCHDOG_DISABLED"],
  "dist-freshness": ["MK_DIST_FRESHNESS_DISABLED", "MK_DIST_FRESHNESS_GUARD_DISABLED"],
  "git-preflight": ["MK_GIT_PREFLIGHT_DISABLED"],
  "hook-install": ["MK_HOOK_INSTALL_DISABLED"],
  "permission-policy": ["MK_PERMISSION_POLICY_DISABLED"],
  "session-lifecycle": ["MK_SESSION_LIFECYCLE_DISABLED"],
  "session-cleanup": ["MK_SESSION_CLEANUP_DISABLED"],
  "task-dispatch": ["MK_TASK_DISPATCH_DISABLED"],
  "post-edit-quality": ["MK_POST_EDIT_QUALITY_DISABLED"],
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
  for (const alias of MASTER_ALIASES) {
    if (isTruthy(resolve(alias))) return false;
  }
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
  if (CONCERN_CANONICAL[slug]) return CONCERN_CANONICAL[slug];
  return "SYSTEM_" + slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_") + "_DISABLED";
}

module.exports = {
  isHookEnabled,
  concernFlag,
  isTruthy,
  loadConfigFile,
  MASTER_FLAG,
  MASTER_ALIASES,
  CONCERN_CANONICAL,
  LEGACY_ALIASES,
  configPath,
  _resetConfigCache,
};
