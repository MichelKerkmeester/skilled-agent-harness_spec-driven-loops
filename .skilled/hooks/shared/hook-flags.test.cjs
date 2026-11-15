// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Kill-Switch Resolver Tests
// ───────────────────────────────────────────────────────────────────
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  isHookEnabled,
  isFlagOn,
  concernFlag,
  isTruthy,
  MASTER_FLAG,
  LEGACY_ALIASES,
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
  const env = { MCP_ROUTE_GUARD_DISABLED: "1" };
  assert.equal(isHookEnabled("mcp-route-guard", env), false);
  assert.equal(isHookEnabled("dispatch", env), true);
});

test("concernFlag derives the canonical env name", () => {
  assert.equal(concernFlag("mcp-route-guard"), "MCP_ROUTE_GUARD_DISABLED");
  assert.equal(concernFlag("post-edit-quality"), "SK_CODE_POST_EDIT_QUALITY_DISABLED");
  assert.equal(concernFlag("goal"), "OPENCODE_GOAL_DISABLED");
});

test("legacy aliases still disable their concern", () => {
  assert.equal(isHookEnabled("goal", { OPENCODE_GOAL_PLUGIN_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("dispatch", { CLI_DISPATCH_AUDIT_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("skill-advisor", { SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: "true" }), false);
  assert.equal(isHookEnabled("completion", { SYSTEM_SPECKIT_COMPLETION_DISABLED: "yes" }), false);
  assert.equal(isHookEnabled("spec-gate", { SPECKIT_SPEC_GATE_DISABLED: "on" }), false);
  // an alias for one concern must not disable a different concern
  assert.equal(isHookEnabled("dispatch", { OPENCODE_GOAL_PLUGIN_DISABLED: "1" }), true);
});

test("the preflight guard has its own switch, so silencing the audit log leaves it on", () => {
  // The two halves share a surface but not a concern: an operator who turns off the
  // audit log must not lose the pre-execution refusal by accident.
  assert.equal(isHookEnabled("dispatch", { CLI_DISPATCH_AUDIT_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("dispatch-guard", { CLI_DISPATCH_AUDIT_DISABLED: "1" }), true);
  assert.equal(isHookEnabled("dispatch-guard", { SYSTEM_DISPATCH_GUARD_DISABLED: "1" }), false);
  // The whole-surface switch still turns off both halves at once.
  const whole = { SYSTEM_DISPATCH_DISABLED: "1" };
  assert.equal(isHookEnabled("dispatch", whole), false);
  assert.equal(isHookEnabled("dispatch-guard", whole), false);
});

test("truthy parsing is case/space-insensitive and strict about falsey", () => {
  for (const v of ["1", "true", "TRUE", " yes ", "On"]) assert.equal(isTruthy(v), true, String(v));
  for (const v of ["0", "false", "", "no", undefined, null, 1]) assert.equal(isTruthy(v), false, String(v));
});

test(".mjs and .ts facades re-export identical behavior", async () => {
  const mjs = await import("./hook-flags.mjs");
  assert.equal(mjs.isHookEnabled("goal", { OPENCODE_GOAL_PLUGIN_DISABLED: "1" }), false);
  assert.equal(mjs.isHookEnabled("goal", {}), true);
  assert.equal(mjs.MASTER_FLAG, MASTER_FLAG);

  const ts = await import("./hook-flags.ts");
  assert.equal(ts.isHookEnabled("goal", { OPENCODE_GOAL_PLUGIN_DISABLED: "1" }), false);
  assert.equal(ts.concernFlag("mcp-route-guard"), "MCP_ROUTE_GUARD_DISABLED");
});

test("config file disables a concern (master, canonical, and aliases)", () => {
  assert.equal(isHookEnabled("skill-advisor", {}, { SYSTEM_SKILL_ADVISOR_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("dispatch", {}, { SYSTEM_SKILL_ADVISOR_DISABLED: "1" }), true); // only its own concern
  assert.equal(isHookEnabled("dispatch", {}, { SYSTEM_HOOKS_DISABLED: "1" }), false); // master via file
  assert.equal(isHookEnabled("goal", {}, { OPENCODE_GOAL_PLUGIN_DISABLED: "true" }), false); // alias via file
});

test("environment overrides the config file both ways", () => {
  // file disables, but env re-enables (falsey) for this session
  assert.equal(isHookEnabled("skill-advisor", { SYSTEM_SKILL_ADVISOR_DISABLED: "0" }, { SYSTEM_SKILL_ADVISOR_DISABLED: "1" }), true);
  // file silent, but env disables
  assert.equal(isHookEnabled("dispatch", { SYSTEM_DISPATCH_DISABLED: "1" }, {}), false);
});

test("explicit env without a config arg ignores the config file (test isolation)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(f, "SYSTEM_SKILL_ADVISOR_DISABLED=1\n");
  // Clear every name that could answer for this concern from the live
  // environment, so the temp file is what decides.
  const names = [MASTER_FLAG, "MK_HOOKS_DISABLED", "SYSTEM_SKILL_ADVISOR_DISABLED", ...LEGACY_ALIASES["skill-advisor"]];
  const prev = names.map((name) => [name, process.env[name]]);
  const prevCfg = process.env.HOOK_FLAGS_CONFIG;
  try {
    for (const name of names) delete process.env[name];
    process.env.HOOK_FLAGS_CONFIG = f;
    _resetConfigCache();
    // passing an explicit env must not read the on-disk file, so existing callers
    // that inject env stay hermetic
    assert.equal(isHookEnabled("skill-advisor", {}), true);
    // while the same call with no env argument does read the file
    assert.equal(isHookEnabled("skill-advisor"), false);
  } finally {
    if (prevCfg === undefined) delete process.env.HOOK_FLAGS_CONFIG; else process.env.HOOK_FLAGS_CONFIG = prevCfg;
    for (const [name, value] of prev) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    _resetConfigCache();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("loadConfigFile parses KEY=value, ignoring comments/blanks/quotes/malformed", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(
    f,
    ["# a comment", "", "OPENCODE_GOAL_DISABLED=1", '  SYSTEM_DISPATCH_DISABLED = "true" ', "NO_EQUALS_LINE", "=novalue"].join("\n"),
  );
  const cfg = loadConfigFile(f);
  assert.equal(cfg.OPENCODE_GOAL_DISABLED, "1");
  assert.equal(cfg.SYSTEM_DISPATCH_DISABLED, "true"); // trimmed + unquoted
  assert.equal("NO_EQUALS_LINE" in cfg, false);
  assert.equal("" in cfg, false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("session-handover is off by default while every other concern stays on", () => {
  assert.equal(isHookEnabled("session-handover", {}), false);
  assert.equal(isHookEnabled("session-handover", {}, {}), false);
  assert.equal(isHookEnabled("skill-advisor", {}), true);
  assert.equal(isHookEnabled("session-cleanup", {}, {}), true);
  // The enable flag of one concern switches on nothing else.
  assert.equal(isHookEnabled("skill-advisor", { SYSTEM_SESSION_HANDOVER_ENABLED: "0" }), true);
});

test("Claude Code is the one runtime where session-handover is on with no switch set", () => {
  const { hookFlagDecision, DEFAULT_ON_RUNTIMES, RUNTIMES } = require("./hook-flags.cjs");
  assert.deepEqual(DEFAULT_ON_RUNTIMES["session-handover"], ["claude"]);
  assert.deepEqual(
    hookFlagDecision("session-handover", {}, {}, { runtime: "claude" }),
    { enabled: true, key: null, reason: "default" },
  );
  for (const runtime of RUNTIMES.filter((name) => name !== "claude")) {
    assert.deepEqual(
      hookFlagDecision("session-handover", {}, {}, { runtime }),
      { enabled: false, key: "SYSTEM_SESSION_HANDOVER_ENABLED", reason: "global" },
      runtime,
    );
  }
  // A runtime the resolver does not know keeps the global-only answer.
  assert.equal(isHookEnabled("session-handover", {}, {}, { runtime: "cline" }), false);
  // A set global value decides for Claude too, and a blank one counts as unset.
  assert.deepEqual(
    hookFlagDecision("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: "0" }, {}, { runtime: "claude" }),
    { enabled: false, key: "SYSTEM_SESSION_HANDOVER_ENABLED", reason: "global" },
  );
  assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: " " }, {}, { runtime: "claude" }), true);
  assert.equal(isHookEnabled("session-handover", {}, { SYSTEM_SESSION_HANDOVER_ENABLED: "off" }, { runtime: "claude" }), false);
  // The Claude switch and every kill switch still answer before the default.
  assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "0" }, {}, { runtime: "claude" }), false);
  assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_DISABLED: "1" }, {}, { runtime: "claude" }), false);
  assert.equal(isHookEnabled("session-handover", { [MASTER_FLAG]: "1" }, {}, { runtime: "claude" }), false);
});

test("session-handover turns on when its enable flag is set in the environment", () => {
  for (const v of ["1", "true", " YES ", "on"]) {
    assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: v }), true, v);
  }
  for (const v of ["0", "", "no", "enabled"]) {
    assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: v }), false, v);
  }
});

test("session-handover turns on from the config file, and the environment still wins", () => {
  const cfg = { SYSTEM_SESSION_HANDOVER_ENABLED: "1" };
  assert.equal(isHookEnabled("session-handover", {}, cfg), true);
  assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: "0" }, cfg), false);
  assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: "" }, cfg), false);
  assert.equal(isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: "1" }, {}), true);

  // The live path: no env argument reads process.env and the file on disk.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-optin-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(f, "SYSTEM_SESSION_HANDOVER_ENABLED=1   # opt in to the relaunch loop\n");
  const names = [MASTER_FLAG, "MK_HOOKS_DISABLED", "SYSTEM_SESSION_HANDOVER_DISABLED", "SYSTEM_SESSION_HANDOVER_ENABLED"];
  const prev = names.map((name) => [name, process.env[name]]);
  const prevCfg = process.env.HOOK_FLAGS_CONFIG;
  try {
    for (const name of names) delete process.env[name];
    process.env.HOOK_FLAGS_CONFIG = f;
    _resetConfigCache();
    assert.equal(isHookEnabled("session-handover"), true);
    process.env.SYSTEM_SESSION_HANDOVER_ENABLED = "0";
    assert.equal(isHookEnabled("session-handover"), false);
  } finally {
    if (prevCfg === undefined) delete process.env.HOOK_FLAGS_CONFIG; else process.env.HOOK_FLAGS_CONFIG = prevCfg;
    for (const [name, value] of prev) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    _resetConfigCache();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a kill switch beats the session-handover enable flag", () => {
  const on = { SYSTEM_SESSION_HANDOVER_ENABLED: "1" };
  assert.equal(isHookEnabled("session-handover", { ...on, SYSTEM_SESSION_HANDOVER_DISABLED: "1" }), false);
  assert.equal(isHookEnabled("session-handover", { ...on, [MASTER_FLAG]: "1" }), false);
  assert.equal(isHookEnabled("session-handover", { ...on, MK_HOOKS_DISABLED: "1" }), false);
  // The kill switch in the file still beats an enable flag in the environment.
  assert.equal(isHookEnabled("session-handover", on, { SYSTEM_SESSION_HANDOVER_DISABLED: "1" }), false);
});

test("the facades carry the session-handover default", async () => {
  const mjs = await import("./hook-flags.mjs");
  assert.equal(mjs.isHookEnabled("session-handover", {}), false);
  assert.equal(mjs.isHookEnabled("session-handover", { SYSTEM_SESSION_HANDOVER_ENABLED: "1" }), true);
  const ts = await import("./hook-flags.ts");
  assert.equal(ts.isHookEnabled("session-handover", {}), false);
  assert.equal(ts.isHookEnabled("session-handover", {}, { SYSTEM_SESSION_HANDOVER_ENABLED: "on" }), true);
});

test("the node and shell resolvers give the same session-handover answers", () => {
  const { spawnSync } = require("node:child_process");
  const names = [MASTER_FLAG, "MK_HOOKS_DISABLED", "SYSTEM_SESSION_HANDOVER_DISABLED", "SYSTEM_SESSION_HANDOVER_ENABLED", "SYSTEM_SKILL_ADVISOR_DISABLED"];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-optin-parity-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    const ask = (fileText, envValues) => {
      fs.writeFileSync(f, fileText);
      const env = { ...process.env, HOOK_FLAGS_CONFIG: f };
      for (const name of names) delete env[name];
      Object.assign(env, envValues);
      const node = ["session-handover", "skill-advisor"].map((c) => (isHookEnabled(c, envValues, loadConfigFile(f)) ? "on" : "off"));
      const script = '. "$1"; for c in session-handover skill-advisor; do hook_enabled "$c" && echo on || echo off; done';
      const shell = spawnSync("bash", ["-c", script, "probe", path.join(__dirname, "hook-flags.sh")], { env, encoding: "utf8" });
      return { node, shell: shell.stdout.trim().split("\n") };
    };
    const cases = [
      ["nothing set", "", {}, ["off", "on"]],
      ["enabled in the environment", "", { SYSTEM_SESSION_HANDOVER_ENABLED: "1" }, ["on", "on"]],
      ["enabled in the file", "SYSTEM_SESSION_HANDOVER_ENABLED=yes  # opt in\n", {}, ["on", "on"]],
      ["environment unsets the file's opt-in", "SYSTEM_SESSION_HANDOVER_ENABLED=1\n", { SYSTEM_SESSION_HANDOVER_ENABLED: "" }, ["off", "on"]],
      ["kill switch beats the opt-in", "SYSTEM_SESSION_HANDOVER_ENABLED=1\nSYSTEM_SESSION_HANDOVER_DISABLED=1\n", {}, ["off", "on"]],
      ["master switch beats the opt-in", "", { SYSTEM_SESSION_HANDOVER_ENABLED: "1", [MASTER_FLAG]: "1" }, ["off", "off"]],
    ];
    for (const [label, fileText, envValues, expected] of cases) {
      const { node, shell } = ask(fileText, envValues);
      assert.deepEqual(node, expected, `${label}: hook-flags.cjs`);
      assert.deepEqual(shell, expected, `${label}: hook-flags.sh`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the in-session switch names answer only while the main name is blank, in both readers", () => {
  const { spawnSync } = require("node:child_process");
  const { hookFlagDecision } = require("./hook-flags.cjs");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-alias-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    const ask = (fileText, envValues) => {
      fs.writeFileSync(f, fileText);
      const env = { ...process.env, HOOK_FLAGS_CONFIG: f };
      for (const name of Object.keys(env)) if (/SESSION_(HANDOVER|RELAUNCH)|HOOKS_DISABLED/.test(name)) delete env[name];
      Object.assign(env, envValues);
      const decision = hookFlagDecision("session-handover", envValues, loadConfigFile(f), { runtime: "codex" });
      const script = '. "$1"; hook_enabled session-handover codex && echo on || echo off';
      const shell = spawnSync("bash", ["-c", script, "probe", path.join(__dirname, "hook-flags.sh")], { env, encoding: "utf8" });
      return { node: decision.enabled ? "on" : "off", key: decision.key, shell: shell.stdout.trim() };
    };
    const cases = [
      ["in-session global switch alone", "", { SYSTEM_IN_SESSION_HANDOVER_ENABLED: "1" }, "on", "SYSTEM_IN_SESSION_HANDOVER_ENABLED"],
      ["in-session global switch in the file", "SYSTEM_IN_SESSION_HANDOVER_ENABLED=1\n", {}, "on", "SYSTEM_IN_SESSION_HANDOVER_ENABLED"],
      ["main global switch wins over the second one", "", { SYSTEM_SESSION_HANDOVER_ENABLED: "0", SYSTEM_IN_SESSION_HANDOVER_ENABLED: "1" }, "off", "SYSTEM_SESSION_HANDOVER_ENABLED"],
      ["in-session runtime switch alone", "", { SYSTEM_IN_SESSION_HANDOVER_CODEX_ENABLED: "1" }, "on", "SYSTEM_IN_SESSION_HANDOVER_CODEX_ENABLED"],
      ["in-session kill switch beats the main enable switch", "", { SYSTEM_SESSION_HANDOVER_ENABLED: "1", SYSTEM_IN_SESSION_HANDOVER_DISABLED: "1" }, "off", "SYSTEM_IN_SESSION_HANDOVER_DISABLED"],
      ["main kill switch set to 0 wins over the second one", "", { SYSTEM_SESSION_HANDOVER_ENABLED: "1", SYSTEM_SESSION_HANDOVER_DISABLED: "0", SYSTEM_IN_SESSION_HANDOVER_DISABLED: "1" }, "on", "SYSTEM_SESSION_HANDOVER_ENABLED"],
      ["the retired relaunch name is not read", "", { SYSTEM_SESSION_RELAUNCH_ENABLED: "1" }, "off", "SYSTEM_SESSION_HANDOVER_ENABLED"],
    ];
    for (const [label, fileText, envValues, expected, key] of cases) {
      const got = ask(fileText, envValues);
      assert.equal(got.node, expected, `${label}: hook-flags.cjs`);
      assert.equal(got.key, key, `${label}: deciding switch`);
      assert.equal(got.shell, expected, `${label}: hook-flags.sh`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a missing config file is fail-open (empty object, no throw)", () => {
  assert.deepEqual(loadConfigFile(path.join(os.tmpdir(), "does-not-exist-hookflags.env")), {});
});

test("live file path resolves via HOOK_FLAGS_CONFIG and env still wins", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(f, "OPENCODE_GOAL_DISABLED=1\n");
  // Clear every name that could answer for this concern from the live
  // environment, so an exported master switch or goal alias cannot decide.
  const names = [MASTER_FLAG, "MK_HOOKS_DISABLED", "OPENCODE_GOAL_DISABLED", ...LEGACY_ALIASES.goal];
  const prev = names.map((name) => [name, process.env[name]]);
  const prevCfg = process.env.HOOK_FLAGS_CONFIG;
  try {
    for (const name of names) delete process.env[name];
    process.env.HOOK_FLAGS_CONFIG = f;
    _resetConfigCache();
    // no env arg -> reads process.env + the file; the file disables goal
    assert.equal(isHookEnabled("goal"), false);
    // a real env var overrides the file back to enabled
    process.env.OPENCODE_GOAL_DISABLED = "0";
    assert.equal(isHookEnabled("goal"), true);
  } finally {
    if (prevCfg === undefined) delete process.env.HOOK_FLAGS_CONFIG; else process.env.HOOK_FLAGS_CONFIG = prevCfg;
    for (const [name, value] of prev) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
    _resetConfigCache();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the shell mirror reads the config file of whichever source root the checkout carries", () => {
  const { spawnSync } = require("node:child_process");
  const probe = (sourceRoot) => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-sh-"));
    try {
      const sentinel = path.join(repo, sourceRoot, "skills", "system-spec-kit", "SKILL.md");
      fs.mkdirSync(path.dirname(sentinel), { recursive: true });
      fs.writeFileSync(sentinel, "---\nname: system-spec-kit\n---\n");
      fs.mkdirSync(path.join(repo, sourceRoot, "hooks"), { recursive: true });
      fs.writeFileSync(path.join(repo, sourceRoot, "hooks", "hook-flags.env"), "SYSTEM_SESSION_CLEANUP_DISABLED=1\n");
      const script = `__hf_root="$1"; . "$2"; hook_enabled session-cleanup && echo on || echo off`;
      const env = { ...process.env };
      delete env.HOOK_FLAGS_CONFIG;
      delete env.SYSTEM_SESSION_CLEANUP_DISABLED;
      delete env.SYSTEM_HOOKS_DISABLED;
      delete env.MK_HOOKS_DISABLED;
      return spawnSync("bash", ["-c", script, "probe", repo, path.join(__dirname, "hook-flags.sh")], { env, encoding: "utf8" }).stdout.trim();
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  };
  assert.equal(probe(".skilled"), "off");
  assert.equal(probe(".opencode"), "off");
});

test("isFlagOn reads a named switch with the kill-switch precedence", () => {
  const name = "SKDOC_SKIP_VALIDATION";
  assert.equal(isFlagOn(name, { [name]: "1" }), true);
  assert.equal(isFlagOn(name, {}, { [name]: "yes" }), true); // saved in the file
  // a set environment value answers, even when it is falsy or empty
  assert.equal(isFlagOn(name, { [name]: "0" }, { [name]: "1" }), false);
  assert.equal(isFlagOn(name, { [name]: "" }, { [name]: "1" }), false);
  assert.equal(isFlagOn(name, { [name]: "skip" }), false); // outside the truthy set
  assert.equal(isFlagOn(name, {}), false); // explicit env ignores the on-disk file
  assert.equal(isFlagOn("", { "": "1" }), false);
});

test("hook_flag_on reads a named switch from the environment first, then the config file", () => {
  const { spawnSync } = require("node:child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-named-"));
  try {
    const cfg = path.join(dir, "hook-flags.env");
    fs.writeFileSync(cfg, 'SKDOC_SKIP_VALIDATION="1"\n');
    const probe = (name, envValue) => {
      const env = { ...process.env, HOOK_FLAGS_CONFIG: cfg };
      delete env.SKDOC_SKIP_VALIDATION;
      if (envValue !== undefined) env.SKDOC_SKIP_VALIDATION = envValue;
      const script = `. "$1"; hook_flag_on "$2" && echo on || echo off`;
      return spawnSync("bash", ["-c", script, "probe", path.join(__dirname, "hook-flags.sh"), name], { env, encoding: "utf8" }).stdout.trim();
    };
    assert.equal(probe("SKDOC_SKIP_VALIDATION"), "on"); // quoted value in the file
    assert.equal(probe("SKDOC_SKIP_VALIDATION", "0"), "off"); // environment wins
    assert.equal(probe("SKDOC_SKIP_VALIDATION", ""), "off"); // even when empty
    assert.equal(probe("SPECKIT_SKIP_VALIDATION"), "off"); // not in the file
    // A name that is not a plain variable name never reaches the resolver's
    // eval. The marker file is the proof: an unguarded resolver creates it.
    const marker = path.join(dir, "injected");
    assert.equal(probe(`X}; touch ${marker}; #`), "off");
    assert.equal(fs.existsSync(marker), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Two skills read the file with their own Python parser: sk-doc's validation
// switch and sk-code's dist checker. Each is asked where the checkout carries
// it, so this suite still runs without them.
const SKILLS = path.resolve(__dirname, "..", "..", "skills");
const SWITCH_READER = path.join(SKILLS, "sk-doc", "shared", "scripts", "validation_switch.py");
const DIST_READER = path.join(SKILLS, "sk-code", "sk-code-quality", "scripts", "check-dist-staleness.sh");
const LOAD_SWITCH_READER = "import sys, pathlib; sys.path.insert(0, str(pathlib.Path(sys.argv[1]).parent)); import validation_switch as m";
const LOAD_DIST_READER = "import sys, importlib.machinery, importlib.util; loader = importlib.machinery.SourceFileLoader('dist_checker', sys.argv[1]); m = importlib.util.module_from_spec(importlib.util.spec_from_loader('dist_checker', loader)); loader.exec_module(m)";

// Run a Python snippet against one reader, or return null when the checkout
// does not carry that reader.
function askPython(reader, loadReader, snippet, env, ...args) {
  if (!fs.existsSync(reader)) return null;
  const { spawnSync } = require("node:child_process");
  const result = spawnSync("python3", ["-c", `${loadReader}; ${snippet}`, reader, ...args], { env, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

// Parse one flags file with all four readers and return each one's values for
// the given keys, keyed by reader.
function parseWithEveryReader(filePath, keys) {
  const { spawnSync } = require("node:child_process");
  const env = { ...process.env, HOOK_FLAGS_CONFIG: filePath };
  for (const key of keys) delete env[key];
  const read = { "hook-flags.cjs": loadConfigFile(filePath) };
  const shell = spawnSync(
    "bash",
    ["-c", '. "$1"; shift; for k in "$@"; do printf "%s=%s\\n" "$k" "$(__hook_flags_resolve "$k")"; done', "probe", path.join(__dirname, "hook-flags.sh"), ...keys],
    { env, encoding: "utf8" },
  );
  read["hook-flags.sh"] = Object.fromEntries(
    shell.stdout.trim().split("\n").map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
  );
  const switchValues = askPython(SWITCH_READER, LOAD_SWITCH_READER, "import json; print(json.dumps(m.load_config_file(pathlib.Path(sys.argv[2]))))", env, filePath);
  if (switchValues !== null) read["validation_switch.py"] = JSON.parse(switchValues);
  const distValues = askPython(DIST_READER, LOAD_DIST_READER, "import json; print(json.dumps(m._hook_flags_config()))", env);
  if (distValues !== null) read["check-dist-staleness.sh"] = JSON.parse(distValues);
  return read;
}

// Ask all four readers whether a switch is on, the way their callers ask. Each
// answers for SKDOC_SKIP_VALIDATION, for the hook concern "probe", or for both.
function askEveryReader(fileText, envValues) {
  const { spawnSync } = require("node:child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-ask-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    fs.writeFileSync(f, fileText);
    const env = { ...process.env, HOOK_FLAGS_CONFIG: f };
    for (const name of ["SKDOC_SKIP_VALIDATION", "SYSTEM_PROBE_DISABLED", MASTER_FLAG, "MK_HOOKS_DISABLED"]) delete env[name];
    Object.assign(env, envValues);
    const cfg = loadConfigFile(f);
    const skip = { "hook-flags.cjs": isFlagOn("SKDOC_SKIP_VALIDATION", envValues, cfg) };
    const disabled = { "hook-flags.cjs": !isHookEnabled("probe", envValues, cfg) };
    const shell = spawnSync(
      "bash",
      ["-c", '. "$1"; hook_flag_on SKDOC_SKIP_VALIDATION && echo on || echo off; hook_enabled probe && echo on || echo off', "probe", path.join(__dirname, "hook-flags.sh")],
      { env, encoding: "utf8" },
    );
    const [shellSkip, shellProbe] = shell.stdout.trim().split("\n");
    skip["hook-flags.sh"] = shellSkip === "on";
    disabled["hook-flags.sh"] = shellProbe === "off";
    const switchAnswer = askPython(SWITCH_READER, LOAD_SWITCH_READER, "print('on' if m.skip_source() else 'off')", env);
    if (switchAnswer !== null) skip["validation_switch.py"] = switchAnswer === "on";
    const distAnswer = askPython(DIST_READER, LOAD_DIST_READER, "print('on' if m._hook_enabled('probe') else 'off')", env);
    if (distAnswer !== null) disabled["check-dist-staleness.sh"] = distAnswer === "off";
    return { skip, disabled };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("a '#' after a space or tab ends a value in every reader of the file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-comment-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    fs.writeFileSync(
      f,
      [
        "A=1   # trailing comment",
        'B="yes" # quoted, then a comment',
        "C=a#b",
        "D= # only a comment",
        "E='x y'\t# a tab before the hash",
        "F=on#not-a-comment",
        "G=1",
      ].join("\n") + "\n",
    );
    const expected = { A: "1", B: "yes", C: "a#b", D: "", E: "x y", F: "on#not-a-comment", G: "1" };
    for (const [reader, values] of Object.entries(parseWithEveryReader(f, Object.keys(expected)))) {
      assert.deepEqual(values, expected, reader);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a byte order mark before the first line hides nothing from any reader", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-bom-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    // An editor that saves UTF-8 with a signature writes these bytes first.
    fs.writeFileSync(f, "﻿A=1\nB=yes\n");
    for (const [reader, values] of Object.entries(parseWithEveryReader(f, ["A", "B"]))) {
      assert.deepEqual(values, { A: "1", B: "yes" }, reader);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("every reader trims only a value's edges and lets any set environment value answer", () => {
  const both = (value) => `SKDOC_SKIP_VALIDATION=${value}\nSYSTEM_PROBE_DISABLED=${value}\n`;
  const inEnv = (value) => ({ SKDOC_SKIP_VALIDATION: value, SYSTEM_PROBE_DISABLED: value });
  const cases = [
    ["inner whitespace in the file", both("o n"), {}, false],
    ["inner whitespace in the environment", "", inEnv("o n"), false],
    ["surrounding whitespace in the environment", "", inEnv(" \ton \t"), true],
    // The shell reader once stood in this value for an unset variable.
    ["the environment set to __HF_UNSET__ over a file set to 1", both("1"), inEnv("__HF_UNSET__"), false],
    ["nothing in the environment, so the file answers", both("1"), {}, true],
  ];
  for (const [label, fileText, envValues, expected] of cases) {
    const { skip, disabled } = askEveryReader(fileText, envValues);
    for (const [reader, answer] of Object.entries(skip)) {
      assert.equal(answer, expected, `${label}: ${reader} on SKDOC_SKIP_VALIDATION`);
    }
    for (const [reader, answer] of Object.entries(disabled)) {
      assert.equal(answer, expected, `${label}: ${reader} on the probe hook`);
    }
  }
});

test("an example line uncommented as-is, trailing comment and all, disables its hook", () => {
  const { spawnSync } = require("node:child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-example-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    fs.writeFileSync(
      f,
      [
        "SYSTEM_SKILL_ADVISOR_DISABLED=1         # skill-advisor brief on your prompts",
        "SYSTEM_SESSION_CLEANUP_DISABLED=1       # stop-hook orphan/session cleanup",
      ].join("\n") + "\n",
    );
    assert.equal(isHookEnabled("skill-advisor", {}, loadConfigFile(f)), false);
    const env = { ...process.env, HOOK_FLAGS_CONFIG: f };
    delete env.SYSTEM_SESSION_CLEANUP_DISABLED;
    delete env.SYSTEM_HOOKS_DISABLED;
    delete env.MK_HOOKS_DISABLED;
    const script = `. "$1"; hook_enabled session-cleanup && echo on || echo off`;
    const shell = spawnSync("bash", ["-c", script, "probe", path.join(__dirname, "hook-flags.sh")], { env, encoding: "utf8" });
    assert.equal(shell.stdout.trim(), "off");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a per-runtime enable flag answers before the global one in every reader", async () => {
  const { spawnSync } = require("node:child_process");
  const mjs = await import("./hook-flags.mjs");
  const ts = await import("./hook-flags.ts");
  const runtimes = ["claude", "pi", "opencode", "codex"];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hook-flags-runtime-"));
  try {
    const f = path.join(dir, "hook-flags.env");
    // Each row lists the answer for claude, pi, opencode, codex and then for a call
    // that names no runtime, which keeps the global-only answer. A fifth entry, when
    // present, replaces the four runtime names as the caller spells them.
    const rows = [
      ["global on, claude off", { SYSTEM_SESSION_HANDOVER_ENABLED: "1", SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "0" }, "", "off on on on on"],
      ["claude on, no global", { SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "1" }, "", "on off off off off"],
      ["kill switch beats a per-runtime opt-in", { SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "1", SYSTEM_SESSION_HANDOVER_DISABLED: "1" }, "", "off off off off off"],
      ["master switch beats a per-runtime opt-in", { SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "1", [MASTER_FLAG]: "1" }, "", "off off off off off"],
      ["empty per-runtime falls through to the global", { SYSTEM_SESSION_HANDOVER_ENABLED: "1", SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "" }, "", "on on on on on"],
      ["file per-runtime off beats an environment global on", { SYSTEM_SESSION_HANDOVER_ENABLED: "1" }, "SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=0\n", "off on on on on"],
      ["nothing set, so only claude is on", {}, "", "on off off off off"],
      ["global off turns claude off too", { SYSTEM_SESSION_HANDOVER_ENABLED: "0" }, "", "off off off off off"],
      ["global off in the file turns claude off too", {}, "SYSTEM_SESSION_HANDOVER_ENABLED=0\n", "off off off off off"],
      ["a blank global counts as unset", { SYSTEM_SESSION_HANDOVER_ENABLED: " " }, "", "on off off off off"],
      ["a runtime name with surrounding spaces still finds its switch", { SYSTEM_SESSION_HANDOVER_PI_ENABLED: "1" }, "", "on on off off off", [" claude ", " pi", "opencode ", "  codex"]],
      ["the legacy master alias beats every opt-in", { SYSTEM_SESSION_HANDOVER_ENABLED: "1", SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED: "1", MK_HOOKS_DISABLED: "1" }, "", "off off off off off"],
      ["the legacy master alias in the file beats an environment opt-in", { SYSTEM_SESSION_HANDOVER_ENABLED: "1" }, "MK_HOOKS_DISABLED=1\n", "off off off off off"],
    ];
    const relaunchNames = (env) => {
      for (const name of Object.keys(env)) {
        if (/^SYSTEM_SESSION_HANDOVER_/.test(name) || name === MASTER_FLAG || name === "MK_HOOKS_DISABLED") delete env[name];
      }
      return env;
    };
    for (const [label, envValues, fileText, expectedText, spelled = runtimes] of rows) {
      fs.writeFileSync(f, fileText);
      const expected = expectedText.split(" ");
      const cfg = loadConfigFile(f);
      for (const [reader, flags] of [["cjs", { isHookEnabled }], ["mjs", mjs], ["ts", ts]]) {
        const got = spelled
          .map((runtime) => flags.isHookEnabled("session-handover", envValues, cfg, { runtime }))
          .concat(flags.isHookEnabled("session-handover", envValues, cfg))
          .map((on) => (on ? "on" : "off"));
        assert.deepEqual(got, expected, `${label}: hook-flags.${reader}`);
      }
      // A stray per-runtime flag in the caller's shell must not leak into the probe.
      const env = { ...relaunchNames({ ...process.env }), HOOK_FLAGS_CONFIG: f, ...envValues };
      // The names go through as quoted arguments so their spaces reach the reader.
      const script = '. "$1"; shift; for r in "$@"; do hook_enabled session-handover "$r" && echo on || echo off; done';
      const shellArgs = ["-c", script, "probe", path.join(__dirname, "hook-flags.sh"), ...spelled, ""];
      const shell = spawnSync("bash", shellArgs, { env, encoding: "utf8" });
      assert.deepEqual(shell.stdout.trim().split("\n"), expected, `${label}: hook-flags.sh`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// A runtime the relaunch loop accepts but the flag readers do not know gets the
// global-only answer, so its own enable switch is ignored without a word.
test("every runtime the relaunch loop accepts has its own enable switch in both readers", () => {
  const { spawnSync } = require("node:child_process");
  const { RUNTIMES, hookFlagDecision } = require("./hook-flags.cjs");
  const relaunch = require("../session-handover/lib/relaunch-core.cjs");
  assert.deepEqual([...RUNTIMES].sort(), [...relaunch.RUNTIMES].sort());

  const env = { ...process.env };
  for (const name of Object.keys(env)) {
    if (/^SYSTEM_SESSION_HANDOVER_/.test(name) || name === MASTER_FLAG || name === "MK_HOOKS_DISABLED") delete env[name];
  }
  const script = '. "$1"; hook_enabled session-handover "$2" && echo on || echo off';
  const shell = (runtime, values) => spawnSync(
    "bash",
    ["-c", script, "probe", path.join(__dirname, "hook-flags.sh"), runtime],
    { env: { ...env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), "no-such-hook-flags.env"), ...values }, encoding: "utf8" },
  ).stdout.trim();
  for (const runtime of relaunch.RUNTIMES) {
    const key = `SYSTEM_SESSION_HANDOVER_${runtime.toUpperCase()}_ENABLED`;
    const on = { [key]: "1" };
    const off = { SYSTEM_SESSION_HANDOVER_ENABLED: "1", [key]: "0" };
    assert.deepEqual(hookFlagDecision("session-handover", on, {}, { runtime }), { enabled: true, key, reason: "runtime" }, runtime);
    assert.deepEqual(hookFlagDecision("session-handover", off, {}, { runtime }), { enabled: false, key, reason: "runtime" }, runtime);
    assert.equal(shell(runtime, on), "on", `${runtime}: hook-flags.sh`);
    assert.equal(shell(runtime, off), "off", `${runtime}: hook-flags.sh`);
  }
});
