import { describe, expect, it } from "bun:test";
import { isTextOnlyModel } from "./model-modality.js";

describe("isTextOnlyModel", () => {
  it("classifies listed text-only families as text-only", () => {
    expect(isTextOnlyModel({ providerID: "openrouter", modelID: "deepseek/deepseek-v4-flash-latest" }, {})).toBe(true);
    expect(isTextOnlyModel({ providerID: "minimax", modelID: "MiniMax-M3" }, {})).toBe(true);
    expect(isTextOnlyModel({ providerID: "xiaomi", modelID: "mimo-v2.5-pro" }, {})).toBe(true);
  });

  it("does not classify an unlisted model as text-only", () => {
    expect(isTextOnlyModel({ providerID: "anthropic", modelID: "claude-opus-4-8" }, {})).toBe(false);
    expect(isTextOnlyModel({ providerID: "google", modelID: "gemini-3-pro" }, {})).toBe(false);
  });

  it("returns false for a missing model rather than guessing", () => {
    expect(isTextOnlyModel(undefined, {})).toBe(false);
    expect(isTextOnlyModel({}, {})).toBe(false);
  });

  it("honours SK_VISION_FORCE=1 for any model", () => {
    expect(isTextOnlyModel({ providerID: "anthropic", modelID: "claude-opus-4-8" }, { SK_VISION_FORCE: "1" })).toBe(true);
  });

  it("extends the allowlist from SK_VISION_TEXT_ONLY_MODELS", () => {
    const env = { SK_VISION_TEXT_ONLY_MODELS: "grok, some-text-model" };
    expect(isTextOnlyModel({ providerID: "xai", modelID: "grok-4-6" }, env)).toBe(true);
    expect(isTextOnlyModel({ providerID: "acme", modelID: "some-text-model-1" }, env)).toBe(true);
    // still false for an unrelated model
    expect(isTextOnlyModel({ providerID: "anthropic", modelID: "claude-opus-4-8" }, env)).toBe(false);
  });

  it("treats a declared non-image input modality as authoritative text-only", () => {
    // A host reporting the model's accepted inputs is authoritative: no "image" => blind.
    expect(isTextOnlyModel({ providerID: "acme", modelID: "unlisted-x", input: ["text"] }, {})).toBe(true);
    // declares image input => not text-only (and not on the allowlist)
    expect(isTextOnlyModel({ providerID: "acme", modelID: "unlisted-y", input: ["text", "image"] }, {})).toBe(false);
    // an empty input list is not a signal; fall through to the allowlist
    expect(isTextOnlyModel({ providerID: "acme", modelID: "unlisted-z", input: [] }, {})).toBe(false);
    // the operator allowlist still wins even if a listed model reports image input
    expect(
      isTextOnlyModel({ providerID: "openrouter", modelID: "deepseek/deepseek-v4-flash-latest", input: ["text", "image"] }, {}),
    ).toBe(true);
  });
});
