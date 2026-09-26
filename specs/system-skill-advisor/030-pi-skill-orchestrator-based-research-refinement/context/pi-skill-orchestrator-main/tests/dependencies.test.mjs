import test from "node:test";
import assert from "node:assert/strict";
import { detectDependencies, effectiveDependencies, resolveDependencyGraph } from "../src/dependencies.ts";

const baseConfig = {
  version: 1,
  groups: [],
  memberships: {},
  autoload: {},
  ignoreAutoDetected: {},
  catalogDescriptionMax: 160,
};

const record = (name) => ({ name, description: name, filePath: `/${name}/SKILL.md` });

test("detectDependencies detects explicit references and ignores unrelated names", () => {
  const body = "Now invoke `grill-me`, then use the verify-before-done skill. Do not mention handoff.";
  assert.deepEqual(detectDependencies(body, "write-prd", ["grill-me", "verify-before-done", "handoff", "write-prd"]), ["grill-me", "verify-before-done"]);
});

test("detectDependencies detects skill tool calls and slash invocations", () => {
  const body = "Call skill(\"tdd\") and later /skill:handoff when complete.";
  assert.deepEqual(detectDependencies(body, "x", ["tdd", "handoff", "x"]), ["handoff", "tdd"]);
});

test("effectiveDependencies merges configured dependencies and honors ignored auto-detections", () => {
  const config = {
    ...baseConfig,
    autoload: { root: ["configured", "shared"] },
    ignoreAutoDetected: { root: ["ignored"] },
  };
  assert.deepEqual(effectiveDependencies("root", ["auto", "ignored", "shared"], config), ["auto", "configured", "shared"]);
});

test("resolveDependencyGraph loads recursive dependencies before the root and deduplicates shared dependencies", async () => {
  const skills = new Map(["root", "a", "b", "shared"].map((name) => [name, record(name)]));
  const bodies = {
    root: "use a skill and use b skill",
    a: "use shared skill",
    b: "use shared skill",
    shared: "no dependencies",
  };
  const graph = await resolveDependencyGraph("root", skills, baseConfig, async (skill) => bodies[skill.name]);
  assert.deepEqual(graph.order, ["shared", "a", "b", "root"]);
  assert.deepEqual(graph.missing, []);
  assert.deepEqual(graph.cycles, []);
});

test("resolveDependencyGraph reports missing configured dependencies", async () => {
  const skills = new Map([["root", record("root")]]);
  const config = { ...baseConfig, autoload: { root: ["missing-helper"] } };
  const graph = await resolveDependencyGraph("root", skills, config, async () => "root body");
  assert.deepEqual(graph.order, ["root"]);
  assert.deepEqual(graph.missing, ["missing-helper"]);
});

test("resolveDependencyGraph reports dependency cycles while loading each available skill once", async () => {
  const skills = new Map([["a", record("a")], ["b", record("b")]]);
  const config = { ...baseConfig, autoload: { a: ["b"], b: ["a"] } };
  const graph = await resolveDependencyGraph("a", skills, config, async () => "body");
  assert.deepEqual(graph.order, ["b", "a"]);
  assert.deepEqual(graph.cycles, [["a", "b", "a"]]);
});

test("resolveDependencyGraph propagates skill read failures instead of silently ignoring them", async () => {
  const skills = new Map([["root", record("root")]]);
  await assert.rejects(
    resolveDependencyGraph("root", skills, baseConfig, async () => { throw new Error("unreadable skill"); }),
    /unreadable skill/,
  );
});

test("automatic dependency detection does not autonomously load disable-model-invocation skills", async () => {
  const visible = record("visible");
  const manual = { ...record("manual"), modelVisible: false };
  const skills = new Map([["visible", visible], ["manual", manual]]);
  const graph = await resolveDependencyGraph("visible", skills, baseConfig, async (skill) =>
    skill.name === "visible" ? "use manual skill" : "manual body");
  assert.deepEqual(graph.order, ["visible"]);
});

test("explicit autoload may deliberately include a manual-only dependency", async () => {
  const visible = record("visible");
  const manual = { ...record("manual"), modelVisible: false };
  const skills = new Map([["visible", visible], ["manual", manual]]);
  const config = { ...baseConfig, autoload: { visible: ["manual"] } };
  const graph = await resolveDependencyGraph("visible", skills, config, async () => "body");
  assert.deepEqual(graph.order, ["manual", "visible"]);
});

test("detectDependencies ignores explicitly negated skill references", () => {
  const body = "Do not use handoff skill. Never call skill(\"tdd\"). Avoid running /skill:grill-me.";
  assert.deepEqual(detectDependencies(body, "root", ["handoff", "tdd", "grill-me", "root"]), []);
});
