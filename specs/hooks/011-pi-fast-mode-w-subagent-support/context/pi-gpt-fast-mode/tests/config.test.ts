import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeConfig, DEFAULT_CONFIG } from "../src/config.ts";

test("normalizeConfig returns defaults for non-object input", () => {
  assert.deepEqual(normalizeConfig(null), DEFAULT_CONFIG);
  assert.deepEqual(normalizeConfig("nope"), DEFAULT_CONFIG);
  assert.deepEqual(normalizeConfig(42), DEFAULT_CONFIG);
});

test("normalizeConfig keeps valid fields and falls back per-field", () => {
  const result = normalizeConfig({
    persist: true,
    desired: true,
    tier: "flex",
    indicator: "widget",
  });
  assert.equal(result.persist, true);
  assert.equal(result.desired, true);
  assert.equal(result.tier, "flex");
  assert.equal(result.indicator, "widget");
  // models not provided -> default list
  assert.deepEqual(result.models, DEFAULT_CONFIG.models);
});

test("normalizeConfig ignores invalid types and unknown tiers", () => {
  const result = normalizeConfig({
    persist: "yes",
    desired: 1,
    tier: "turbo",
    indicator: "turbo",
  });
  assert.deepEqual(result, DEFAULT_CONFIG);
});

test("normalizeConfig filters models to provider/model strings and dedupes", () => {
  const result = normalizeConfig({
    models: ["openai/gpt-5.5", "openai/gpt-5.5", "bad", 7, "x/y"],
  });
  assert.deepEqual(result.models, ["openai/gpt-5.5", "x/y"]);
});

test("normalizeConfig honors an explicit empty models array (opt out)", () => {
  const result = normalizeConfig({ models: [] });
  assert.deepEqual(result.models, []);
});
