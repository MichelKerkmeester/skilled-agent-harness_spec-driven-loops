import { test } from "node:test";
import assert from "node:assert/strict";
import { FastState } from "../src/state.ts";
import { DEFAULT_CONFIG } from "../src/config.ts";
import { readHandoff, writeHandoff } from "../src/handoff.ts";

test("state: not active until desired AND supported model", () => {
  const s = new FastState(DEFAULT_CONFIG);
  assert.equal(s.isActive(), false);

  s.setDesired(true);
  assert.equal(s.isActive(), false); // no model yet

  s.setModel({ provider: "openai", id: "gpt-4o" });
  assert.equal(s.isModelSupported(), false);
  assert.equal(s.isActive(), false);

  s.setModel({ provider: "openai", id: "gpt-5.5" });
  assert.equal(s.isModelSupported(), true);
  assert.equal(s.isActive(), true);
});

test("state: toggle flips desired and returns new value", () => {
  const s = new FastState(DEFAULT_CONFIG);
  assert.equal(s.toggle(), true);
  assert.equal(s.isDesired(), true);
  assert.equal(s.toggle(), false);
});

test("state: tier defaults from config and can be changed independently", () => {
  const s = new FastState(DEFAULT_CONFIG);
  assert.equal(s.serviceTier(), "priority");
  s.setTier("flex");
  assert.equal(s.serviceTier(), "flex");
  // toggling on/off does not change the selected tier
  s.toggle();
  assert.equal(s.serviceTier(), "flex");
});

test("state: preference is retained across unsupported models", () => {
  const s = new FastState(DEFAULT_CONFIG);
  s.setDesired(true);
  s.setModel({ provider: "openai", id: "gpt-5.5" });
  assert.equal(s.isActive(), true);
  s.setModel({ provider: "anthropic", id: "claude-sonnet-4" });
  assert.equal(s.isActive(), false);
  assert.equal(s.isDesired(), true); // still desired
  s.setModel({ provider: "openai", id: "gpt-5.4" });
  assert.equal(s.isActive(), true); // resumes
});

test("handoff: round-trips through an env map", () => {
  const env: NodeJS.ProcessEnv = {};
  assert.equal(readHandoff(env), undefined);
  writeHandoff(true, env);
  assert.equal(env.PI_GPT_FAST_MODE, "1");
  assert.equal(readHandoff(env), true);
  writeHandoff(false, env);
  assert.equal(readHandoff(env), false);
});

test("handoff: invalid values are treated as no opinion", () => {
  assert.equal(readHandoff({ PI_GPT_FAST_MODE: "yes" }), undefined);
  assert.equal(readHandoff({ PI_GPT_FAST_MODE: "" }), undefined);
});
