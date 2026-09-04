"use strict";

// Back-compat bridge for the runtime-hook env namespace. The hook library's env
// vars were renamed from an opaque two-letter prefix to self-describing prefixes
// that name the owning skill or surface. Operators may still have the old names
// exported in a shell, CI, or config file, so at load this copies each old value
// forward onto its new name (only when the new name is unset — a value set
// explicitly under the new name always wins). Read sites therefore consult only
// the new name yet keep honoring existing operator configuration.
//
// Every legacy hook and daemon env var is bridged, including the daemon-family
// vars (skill-advisor / code-index / code-graph / hf-embed / reranker) whose
// identity was renamed alongside the daemons themselves. The bridge is a
// prefix rewrite with no per-family rows, so a retired family needs no removal
// here: its names simply stop having a read site.

// [oldPrefix, newPrefix], longest/most-specific first so a plugin-owned prefix
// wins over the framework-core catch-all.
const PREFIX_RULES = [
  ["MK_POST_EDIT_QUALITY", "SK_CODE_POST_EDIT_QUALITY"],
  ["MK_COMMUNICATION_PROJECTION", "SK_COMMUNICATION_PROJECTION"],
  ["MK_GIT_PREFLIGHT", "SK_GIT_PREFLIGHT"],
  ["MK_CLI_DISPATCH_AUDIT", "CLI_DISPATCH_AUDIT"],
  ["MK_MCP_ROUTE_GUARD", "MCP_ROUTE_GUARD"],
  ["MK_CODEX_HOOKS_WATCHDOG", "CODEX_HOOKS_WATCHDOG"],
  ["MK_CODEX_WATCHDOG", "CODEX_WATCHDOG"],
  ["MK_GOAL", "OPENCODE_GOAL"],
  ["MK_", "SYSTEM_"],
];

// No env family is excluded from bridging any more; the daemon rename has landed.
const SKIP_PREFIXES = [];

function newNameFor(key) {
  if (!key.startsWith("MK_")) return null;
  for (const skip of SKIP_PREFIXES) {
    if (key.startsWith(skip)) return null;
  }
  for (const [oldPrefix, newPrefix] of PREFIX_RULES) {
    if (key.startsWith(oldPrefix)) return newPrefix + key.slice(oldPrefix.length);
  }
  return null;
}

// Copy every legacy MK_ value forward onto its new name when the new name is
// unset. Idempotent and cheap; safe to call from any entry point at load.
function applyEnvAliases(env) {
  const target = env || process.env;
  for (const key of Object.keys(target)) {
    const mapped = newNameFor(key);
    if (mapped && target[mapped] === undefined) {
      target[mapped] = target[key];
    }
  }
  return target;
}

module.exports = { applyEnvAliases, newNameFor, PREFIX_RULES, SKIP_PREFIXES };
