"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { isHookEnabled, concernFlag, isTruthy, MASTER_FLAG } = require("./hook-flags.cjs");

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
