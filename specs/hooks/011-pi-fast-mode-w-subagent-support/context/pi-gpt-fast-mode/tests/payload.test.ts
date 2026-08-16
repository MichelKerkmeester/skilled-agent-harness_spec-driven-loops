import { test } from "node:test";
import assert from "node:assert/strict";
import {
  injectServiceTier,
  isSupportedModel,
  modelKey,
  toModelRef,
} from "../src/payload.ts";
import { DEFAULT_CONFIG } from "../src/config.ts";

test("toModelRef extracts provider/id from a model object", () => {
  assert.deepEqual(toModelRef({ provider: "openai", id: "gpt-5.5" }), {
    provider: "openai",
    id: "gpt-5.5",
  });
});

test("toModelRef rejects malformed input", () => {
  assert.equal(toModelRef(undefined), undefined);
  assert.equal(toModelRef({ provider: "openai" }), undefined);
  assert.equal(toModelRef({ provider: "", id: "x" }), undefined);
  assert.equal(toModelRef([{ provider: "openai", id: "x" }]), undefined);
});

test("modelKey builds provider/model key", () => {
  assert.equal(modelKey({ provider: "openai", id: "gpt-5.4" }), "openai/gpt-5.4");
});

test("isSupportedModel matches configured models only", () => {
  assert.equal(
    isSupportedModel({ provider: "openai", id: "gpt-5.5" }, DEFAULT_CONFIG),
    true,
  );
  assert.equal(
    isSupportedModel({ provider: "openai", id: "gpt-4o" }, DEFAULT_CONFIG),
    false,
  );
  assert.equal(isSupportedModel(undefined, DEFAULT_CONFIG), false);
});

test("injectServiceTier adds service_tier to plain object payloads", () => {
  const payload = { model: "gpt-5.5", messages: [] };
  const next = injectServiceTier(payload, "priority") as Record<string, unknown>;
  assert.equal(next.service_tier, "priority");
  assert.equal(next.model, "gpt-5.5");
  // original is not mutated
  assert.equal("service_tier" in payload, false);
});

test("injectServiceTier leaves non-object payloads untouched", () => {
  assert.equal(injectServiceTier(null, "priority"), null);
  assert.equal(injectServiceTier("str", "priority"), "str");
  const arr = [1, 2];
  assert.equal(injectServiceTier(arr, "priority"), arr);
});

test("injectServiceTier falls back to priority when tier is empty", () => {
  const next = injectServiceTier({}, "") as Record<string, unknown>;
  assert.equal(next.service_tier, "priority");
});
