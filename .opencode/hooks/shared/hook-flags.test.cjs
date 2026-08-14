"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  isHookEnabled,
  concernFlag,
  isTruthy,
  MASTER_FLAG,
  loadConfigFile,
  _resetConfigCache,
} = require("./hook-flags.cjs");

test("enabled by default when no flag is set", () => {
  assert.equal(isHookEnabled("mcp-route-guard", {}), true);
  assert.equal(isHookEnabled("anything-new", {}), true);
});

test("master switch disables every concern", () => {
  const env = { [MASTER_FLAG]: "1" };
  assert.equal(isHookEnabled("mcp-route-guard", env), false);
  assert.equal(isHookEnabled("dispatch", env), false);
  assert.equal(isHookEnabled("skill-advisor", env), false);
});

test("canonical per-concern switch disables only that concern", () => {
  const env = { MK_MCP_ROUTE_GUARD_DISABLED: "1" };
  assert.equal(isHookEnabled("mcp-route-guard", env), false);
  assert.equal(isHookEnabled("dispatch", env), true);
});

test("concernFlag derives the canonical env name", () => {
  assert.equal(concernFlag("mcp-route-guard"), "MK_MCP_ROUTE_GUARD_DISABLED");
  assert.equal(concernFlag("post-edit-quality"), "MK_POST_EDIT_QUALITY_DISABLED");
  assert.equal(concernFlag("goal"), "MK_GOAL_DISABLED");
});

test("legacy aliases still disable their concern", () => {
  assert.equal(isHookEnabled("goal", { MK_GOAL_PLUGIN_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("dispatch", { MK_CLI_DISPATCH_AUDIT_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("skill-advisor", { SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: "true" }), false);
  assert.equal(isHookEnabled("completion", { MK_SPECKIT_COMPLETION_DISABLED: "yes" }), false);
  assert.equal(isHookEnabled("spec-memory", { MK_SPEC_MEMORY_PLUGIN_DISABLED: "on" }), false);
  // an alias for one concern must not disable a different concern
  assert.equal(isHookEnabled("dispatch", { MK_GOAL_PLUGIN_DISABLED: "1" }), true);
});

test("truthy parsing is case/space-insensitive and strict about falsey", () => {
  for (const v of ["1", "true", "TRUE", " yes ", "On"]) assert.equal(isTruthy(v), true, String(v));
  for (const v of ["0", "false", "", "no", undefined, null, 1]) assert.equal(isTruthy(v), false, String(v));
});

test(".mjs and .ts facades re-export identical behavior", async () => {
  const mjs = await import("./hook-flags.mjs");
  assert.equal(mjs.isHookEnabled("goal", { MK_GOAL_PLUGIN_DISABLED: "1" }), false);
  assert.equal(mjs.isHookEnabled("goal", {}), true);
  assert.equal(mjs.MASTER_FLAG, MASTER_FLAG);

  const ts = await import("./hook-flags.ts");
  assert.equal(ts.isHookEnabled("goal", { MK_GOAL_PLUGIN_DISABLED: "1" }), false);
  assert.equal(ts.concernFlag("mcp-route-guard"), "MK_MCP_ROUTE_GUARD_DISABLED");
});

test("config file disables a concern (master, canonical, and aliases)", () => {
  assert.equal(isHookEnabled("skill-advisor", {}, { MK_SKILL_ADVISOR_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("dispatch", {}, { MK_SKILL_ADVISOR_DISABLED: "1" }), true); // only its own concern
  assert.equal(isHookEnabled("dispatch", {}, { MK_HOOKS_DISABLED: "1" }), false); // master via file
  assert.equal(isHookEnabled("goal", {}, { MK_GOAL_PLUGIN_DISABLED: "true" }), false); // alias via file
});

test("environment overrides the config file both ways", () => {
  // file disables, but env re-enables (falsey) for this session
  assert.equal(isHookEnabled("skill-advisor", { MK_SKILL_ADVISOR_DISABLED: "0" }, { MK_SKILL_ADVISOR_DISABLED: "1" }), true);
  // file silent, but env disables
  assert.equal(isHookEnabled("dispatch", { MK_DISPATCH_DISABLED: "1" }, {}), false);
});

test("explicit env without a config arg ignores the config file (test isolation)", () => {
  // passing an explicit env must not read the on-disk file, so existing callers
  // that inject env stay hermetic
  assert.equal(isHookEnabled("skill-advisor", {}), true);
});

test("loadConfigFile parses KEY=value, ignoring comments/blanks/quotes/malformed", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(
    f,
    ["# a comment", "", "MK_GOAL_DISABLED=1", '  MK_DISPATCH_DISABLED = "true" ', "NO_EQUALS_LINE", "=novalue"].join("\n"),
  );
  const cfg = loadConfigFile(f);
  assert.equal(cfg.MK_GOAL_DISABLED, "1");
  assert.equal(cfg.MK_DISPATCH_DISABLED, "true"); // trimmed + unquoted
  assert.equal("NO_EQUALS_LINE" in cfg, false);
  assert.equal("" in cfg, false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("a missing config file is fail-open (empty object, no throw)", () => {
  assert.deepEqual(loadConfigFile(path.join(os.tmpdir(), "does-not-exist-hookflags.env")), {});
});

test("live file path resolves via HOOK_FLAGS_CONFIG and env still wins", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(f, "MK_GOAL_DISABLED=1\n");
  const prevCfg = process.env.HOOK_FLAGS_CONFIG;
  const prevGoal = process.env.MK_GOAL_DISABLED;
  try {
    process.env.HOOK_FLAGS_CONFIG = f;
    delete process.env.MK_GOAL_DISABLED;
    _resetConfigCache();
    // no env arg -> reads process.env + the file; the file disables goal
    assert.equal(isHookEnabled("goal"), false);
    // a real env var overrides the file back to enabled
    process.env.MK_GOAL_DISABLED = "0";
    assert.equal(isHookEnabled("goal"), true);
  } finally {
    if (prevCfg === undefined) delete process.env.HOOK_FLAGS_CONFIG; else process.env.HOOK_FLAGS_CONFIG = prevCfg;
    if (prevGoal === undefined) delete process.env.MK_GOAL_DISABLED; else process.env.MK_GOAL_DISABLED = prevGoal;
    _resetConfigCache();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
