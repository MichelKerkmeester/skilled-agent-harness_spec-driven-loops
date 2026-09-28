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
  // passing an explicit env must not read the on-disk file, so existing callers
  // that inject env stay hermetic
  assert.equal(isHookEnabled("skill-advisor", {}), true);
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

test("a missing config file is fail-open (empty object, no throw)", () => {
  assert.deepEqual(loadConfigFile(path.join(os.tmpdir(), "does-not-exist-hookflags.env")), {});
});

test("live file path resolves via HOOK_FLAGS_CONFIG and env still wins", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hookflags-"));
  const f = path.join(dir, "hook-flags.env");
  fs.writeFileSync(f, "OPENCODE_GOAL_DISABLED=1\n");
  const prevCfg = process.env.HOOK_FLAGS_CONFIG;
  const prevGoal = process.env.OPENCODE_GOAL_DISABLED;
  try {
    process.env.HOOK_FLAGS_CONFIG = f;
    delete process.env.OPENCODE_GOAL_DISABLED;
    _resetConfigCache();
    // no env arg -> reads process.env + the file; the file disables goal
    assert.equal(isHookEnabled("goal"), false);
    // a real env var overrides the file back to enabled
    process.env.OPENCODE_GOAL_DISABLED = "0";
    assert.equal(isHookEnabled("goal"), true);
  } finally {
    if (prevCfg === undefined) delete process.env.HOOK_FLAGS_CONFIG; else process.env.HOOK_FLAGS_CONFIG = prevCfg;
    if (prevGoal === undefined) delete process.env.OPENCODE_GOAL_DISABLED; else process.env.OPENCODE_GOAL_DISABLED = prevGoal;
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

test("a '#' after a space or tab ends a value in every reader of the file", () => {
  const { spawnSync } = require("node:child_process");
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
    const keys = Object.keys(expected);
    const env = { ...process.env, HOOK_FLAGS_CONFIG: f };
    for (const key of keys) delete env[key];
    const parse = (stdout) => Object.fromEntries(
      stdout.trim().split("\n").map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
    );

    assert.deepEqual(loadConfigFile(f), expected);

    const shell = spawnSync(
      "bash",
      ["-c", '. "$1"; shift; for k in "$@"; do printf "%s=%s\\n" "$k" "$(__hook_flags_resolve "$k")"; done', "probe", path.join(__dirname, "hook-flags.sh"), ...keys],
      { env, encoding: "utf8" },
    );
    assert.deepEqual(parse(shell.stdout), expected);

    // Two skills read the file with their own Python parser. Each is checked
    // where the checkout carries it, so this suite still runs without them.
    const skills = path.resolve(__dirname, "..", "..", "skills");
    const pythonReaders = [
      [
        path.join(skills, "sk-doc", "shared", "scripts", "validation_switch.py"),
        "import json, sys, pathlib; sys.path.insert(0, str(pathlib.Path(sys.argv[1]).parent)); import validation_switch as m; print(json.dumps(m.load_config_file(pathlib.Path(sys.argv[2]))))",
      ],
      [
        path.join(skills, "sk-code", "sk-code-quality", "scripts", "check-dist-staleness.sh"),
        "import json, sys, importlib.machinery, importlib.util; loader = importlib.machinery.SourceFileLoader('dist_checker', sys.argv[1]); m = importlib.util.module_from_spec(importlib.util.spec_from_loader('dist_checker', loader)); loader.exec_module(m); print(json.dumps(m._hook_flags_config()))",
      ],
    ];
    for (const [reader, script] of pythonReaders) {
      if (!fs.existsSync(reader)) continue;
      const result = spawnSync("python3", ["-c", script, reader, f], { env, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(JSON.parse(result.stdout), expected, reader);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
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
    const script = `. "$1"; hook_enabled session-cleanup && echo on || echo off`;
    const shell = spawnSync("bash", ["-c", script, "probe", path.join(__dirname, "hook-flags.sh")], { env, encoding: "utf8" });
    assert.equal(shell.stdout.trim(), "off");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
