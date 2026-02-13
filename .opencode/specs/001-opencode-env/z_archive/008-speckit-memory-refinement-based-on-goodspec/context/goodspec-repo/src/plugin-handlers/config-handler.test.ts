/**
 * Tests for Config Handler
 */

import { describe, it, expect } from "bun:test";
import { createConfigHandler } from "./config-handler.js";
import type { GoopSpecConfig, ResourceResolver, ResolvedResource } from "../core/types.js";

// Mock resolver
function createMockResolver(): ResourceResolver {
  return {
    resolve: () => null,
    resolveAll: () => [],
    getDirectory: () => null,
  };
}

describe("createConfigHandler", () => {
  it("registers goopspec agent in config", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
    };
    const resolver = createMockResolver();
    const handler = createConfigHandler({
      pluginConfig,
      resolver,
      directory: "/test",
    });

    const config: Record<string, unknown> = { agent: {} };
    await handler(config);

    expect(config.agent).toBeDefined();
    expect((config.agent as Record<string, unknown>).goopspec).toBeDefined();
  });

  it("sets goopspec as default when enableAsDefault is true", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
      orchestrator: {
        enableAsDefault: true,
      },
    };
    const resolver = createMockResolver();
    const handler = createConfigHandler({
      pluginConfig,
      resolver,
      directory: "/test",
    });

    const config: Record<string, unknown> = { agent: {} };
    await handler(config);

    // NOTE: default_agent must match the agent KEY, not the name property
    expect(config.default_agent).toBe("goopspec");
  });

  it("does not set default_agent when enableAsDefault is false", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
      orchestrator: {
        enableAsDefault: false,
      },
    };
    const resolver = createMockResolver();
    const handler = createConfigHandler({
      pluginConfig,
      resolver,
      directory: "/test",
    });

    const config: Record<string, unknown> = { agent: {} };
    await handler(config);

    expect(config.default_agent).toBeUndefined();
  });

  it("preserves existing agents in config", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
    };
    const resolver = createMockResolver();
    const handler = createConfigHandler({
      pluginConfig,
      resolver,
      directory: "/test",
    });

    const existingAgent = { mode: "primary", model: "test" };
    const config: Record<string, unknown> = {
      agent: { existing: existingAgent },
    };
    await handler(config);

    const agents = config.agent as Record<string, unknown>;
    expect(agents.existing).toBe(existingAgent);
    expect(agents.goopspec).toBeDefined();
  });

  it("creates agent config when none exists", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
    };
    const resolver = createMockResolver();
    const handler = createConfigHandler({
      pluginConfig,
      resolver,
      directory: "/test",
    });

    const config: Record<string, unknown> = {};
    await handler(config);

    expect(config.agent).toBeDefined();
    expect((config.agent as Record<string, unknown>).goopspec).toBeDefined();
  });

  it("passes orchestrator config options to agent factory", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
      orchestrator: {
        model: "anthropic/claude-sonnet-4-5",
        thinkingBudget: 16000,
        phaseGates: "strict",
        waveExecution: "parallel",
      },
    };
    const resolver = createMockResolver();
    const handler = createConfigHandler({
      pluginConfig,
      resolver,
      directory: "/test",
    });

    const config: Record<string, unknown> = {};
    await handler(config);

    const goopspec = (config.agent as Record<string, unknown>).goopspec as Record<string, unknown>;
    expect(goopspec.model).toBe("anthropic/claude-sonnet-4-5");
    expect((goopspec.thinking as { budgetTokens: number }).budgetTokens).toBe(16000);
  });

  it("handles errors gracefully without crashing", async () => {
    const pluginConfig: GoopSpecConfig = {
      enforcement: "assist",
    };
    // Create a resolver that throws
    const brokenResolver: ResourceResolver = {
      resolve: () => { throw new Error("Test error"); },
      resolveAll: () => { throw new Error("Test error"); },
      getDirectory: () => null,
    };
    const handler = createConfigHandler({
      pluginConfig,
      resolver: brokenResolver,
      directory: "/test",
    });

    const config: Record<string, unknown> = {};
    
    // Should not throw
    await expect(handler(config)).resolves.toBeUndefined();
  });
});
