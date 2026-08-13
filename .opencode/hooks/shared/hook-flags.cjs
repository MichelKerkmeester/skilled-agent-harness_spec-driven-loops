"use strict";

// Central kill-switch resolver for every repo-authored runtime hook. A hook is
// enabled by default and only goes silent when the operator sets a kill-switch,
// so adding this guard changes no behavior until a flag is set. The master
// switch disables the whole enforcement layer at once; a per-concern switch
// disables one hook family across every runtime that carries it. Names that
// predate this convention are honored as aliases so existing operator config
// keeps working.

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

function isTruthy(value) {
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

// The canonical per-concern kill-switch env var for a concern slug. A blank
// concern has no flag (skipped), so callers never look up "MK__DISABLED".
function concernFlag(concern) {
  if (concern === null || concern === undefined) return null;
  const slug = String(concern).trim();
  if (!slug) return null;
  return "MK_" + slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_") + "_DISABLED";
}

// True unless the master switch or one of this concern's kill-switches is set.
// `env` is injectable for testing; it defaults to the live process environment.
function isHookEnabled(concern, env) {
  const source = env || process.env;
  if (isTruthy(source[MASTER_FLAG])) return false;
  const flag = concernFlag(concern);
  const keys = (flag ? [flag] : []).concat(LEGACY_ALIASES[concern] || []);
  for (const key of keys) {
    if (isTruthy(source[key])) return false;
  }
  return true;
}

module.exports = {
  isHookEnabled,
  concernFlag,
  isTruthy,
  MASTER_FLAG,
  LEGACY_ALIASES,
};
