/**
 * Tests for Memory Configuration Schema
 * @module features/memory/config.test
 */

import { describe, it, expect } from "bun:test";
import {
  CaptureConfigSchema,
  InjectionConfigSchema,
  PrivacyConfigSchema,
  EmbeddingsConfigSchema,
  MemoryConfigSchema,
  parseMemoryConfig,
  getDefaultMemoryConfig,
  mergeMemoryConfig,
  validateMemoryConfig,
  EXAMPLE_MEMORY_CONFIG,
  MINIMAL_MEMORY_CONFIG,
} from "./config.js";

describe("CaptureConfigSchema", () => {
  it("validates complete config", () => {
    const config = {
      enabled: true,
      captureToolUse: true,
      captureMessages: false,
      capturePhaseChanges: true,
      skipTools: ["Read", "Glob"],
      minImportanceThreshold: 5,
    };
    
    const result = CaptureConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("applies defaults for missing fields", () => {
    const result = CaptureConfigSchema.parse({});
    expect(result.enabled).toBe(true);
    expect(result.captureToolUse).toBe(true);
    expect(result.captureMessages).toBe(false);
    expect(result.capturePhaseChanges).toBe(true);
    expect(result.minImportanceThreshold).toBe(4);
    expect(result.skipTools).toBeInstanceOf(Array);
  });

  it("validates minImportanceThreshold range", () => {
    const tooLow = CaptureConfigSchema.safeParse({ minImportanceThreshold: 0 });
    expect(tooLow.success).toBe(false);

    const tooHigh = CaptureConfigSchema.safeParse({ minImportanceThreshold: 11 });
    expect(tooHigh.success).toBe(false);

    const valid = CaptureConfigSchema.safeParse({ minImportanceThreshold: 5 });
    expect(valid.success).toBe(true);
  });

  it("validates skipTools as array of strings", () => {
    const invalid = CaptureConfigSchema.safeParse({ skipTools: [123, "Read"] });
    expect(invalid.success).toBe(false);

    const valid = CaptureConfigSchema.safeParse({ skipTools: ["Read", "Write"] });
    expect(valid.success).toBe(true);
  });
});

describe("InjectionConfigSchema", () => {
  it("validates complete config", () => {
    const config = {
      enabled: true,
      budgetTokens: 1000,
      format: "bullets",
      priorityTypes: ["decision", "observation"],
    };
    
    const result = InjectionConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("applies defaults", () => {
    const result = InjectionConfigSchema.parse({});
    expect(result.enabled).toBe(true);
    expect(result.budgetTokens).toBe(800);
    expect(result.format).toBe("timeline");
    expect(result.priorityTypes).toContain("decision");
  });

  it("validates budgetTokens range", () => {
    const tooLow = InjectionConfigSchema.safeParse({ budgetTokens: 50 });
    expect(tooLow.success).toBe(false);

    const tooHigh = InjectionConfigSchema.safeParse({ budgetTokens: 5000 });
    expect(tooHigh.success).toBe(false);

    const valid = InjectionConfigSchema.safeParse({ budgetTokens: 1500 });
    expect(valid.success).toBe(true);
  });

  it("validates format enum", () => {
    const valid = InjectionConfigSchema.safeParse({ format: "bullets" });
    expect(valid.success).toBe(true);

    const alsoValid = InjectionConfigSchema.safeParse({ format: "structured" });
    expect(alsoValid.success).toBe(true);

    const invalid = InjectionConfigSchema.safeParse({ format: "unknown" });
    expect(invalid.success).toBe(false);
  });

  it("validates priorityTypes array", () => {
    const valid = InjectionConfigSchema.safeParse({ 
      priorityTypes: ["decision", "observation", "todo"] 
    });
    expect(valid.success).toBe(true);

    const invalid = InjectionConfigSchema.safeParse({ 
      priorityTypes: ["invalid_type"] 
    });
    expect(invalid.success).toBe(false);
  });
});

describe("PrivacyConfigSchema", () => {
  it("validates complete config", () => {
    const config = {
      enabled: true,
      privateTagEnabled: true,
      retentionDays: 60,
      maxMemories: 5000,
    };
    
    const result = PrivacyConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("applies defaults", () => {
    const result = PrivacyConfigSchema.parse({});
    expect(result.enabled).toBe(true);
    expect(result.privateTagEnabled).toBe(true);
    expect(result.retentionDays).toBe(90);
    expect(result.maxMemories).toBe(10000);
  });

  it("validates retentionDays range", () => {
    const tooLow = PrivacyConfigSchema.safeParse({ retentionDays: 0 });
    expect(tooLow.success).toBe(false);

    const tooHigh = PrivacyConfigSchema.safeParse({ retentionDays: 400 });
    expect(tooHigh.success).toBe(false);

    const valid = PrivacyConfigSchema.safeParse({ retentionDays: 180 });
    expect(valid.success).toBe(true);
  });

  it("validates maxMemories range", () => {
    const tooLow = PrivacyConfigSchema.safeParse({ maxMemories: 50 });
    expect(tooLow.success).toBe(false);

    const tooHigh = PrivacyConfigSchema.safeParse({ maxMemories: 200000 });
    expect(tooHigh.success).toBe(false);

    const valid = PrivacyConfigSchema.safeParse({ maxMemories: 50000 });
    expect(valid.success).toBe(true);
  });
});

describe("EmbeddingsConfigSchema", () => {
  it("validates complete config", () => {
    const config = {
      provider: "openai",
      model: "text-embedding-3-small",
      dimensions: 1536,
      apiKey: "sk-test",
      baseUrl: "https://api.openai.com/v1",
    };
    
    const result = EmbeddingsConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("applies defaults", () => {
    const result = EmbeddingsConfigSchema.parse({});
    expect(result.provider).toBe("local");
    expect(result.dimensions).toBe(384);
    expect(result.model).toBeUndefined();
    expect(result.apiKey).toBeUndefined();
  });

  it("validates provider enum", () => {
    const valid = EmbeddingsConfigSchema.safeParse({ provider: "ollama" });
    expect(valid.success).toBe(true);

    const invalid = EmbeddingsConfigSchema.safeParse({ provider: "unknown" });
    expect(invalid.success).toBe(false);
  });

  it("validates dimensions range", () => {
    const tooLow = EmbeddingsConfigSchema.safeParse({ dimensions: 32 });
    expect(tooLow.success).toBe(false);

    const tooHigh = EmbeddingsConfigSchema.safeParse({ dimensions: 8192 });
    expect(tooHigh.success).toBe(false);

    const valid = EmbeddingsConfigSchema.safeParse({ dimensions: 768 });
    expect(valid.success).toBe(true);
  });
});

describe("MemoryConfigSchema", () => {
  it("validates complete config", () => {
    const result = MemoryConfigSchema.safeParse(EXAMPLE_MEMORY_CONFIG);
    expect(result.success).toBe(true);
  });

  it("validates minimal config", () => {
    const result = MemoryConfigSchema.safeParse(MINIMAL_MEMORY_CONFIG);
    expect(result.success).toBe(true);
  });

  it("applies nested defaults", () => {
    const result = MemoryConfigSchema.parse({});
    expect(result.enabled).toBe(true);
    expect(result.workerPort).toBe(37777);
    expect(result.capture?.enabled).toBe(true);
    expect(result.injection?.format).toBe("timeline");
    expect(result.privacy?.retentionDays).toBe(90);
    expect(result.embeddings?.provider).toBe("local");
  });

  it("validates workerPort range", () => {
    const tooLow = MemoryConfigSchema.safeParse({ workerPort: 500 });
    expect(tooLow.success).toBe(false);

    const tooHigh = MemoryConfigSchema.safeParse({ workerPort: 70000 });
    expect(tooHigh.success).toBe(false);

    const valid = MemoryConfigSchema.safeParse({ workerPort: 8080 });
    expect(valid.success).toBe(true);
  });

  it("validates nested sub-configs", () => {
    const invalid = MemoryConfigSchema.safeParse({
      capture: {
        minImportanceThreshold: 100, // Invalid
      },
    });
    expect(invalid.success).toBe(false);
  });
});

describe("parseMemoryConfig", () => {
  it("returns parsed config for valid input", () => {
    const config = parseMemoryConfig({ enabled: true, workerPort: 8000 });
    expect(config.enabled).toBe(true);
    expect(config.workerPort).toBe(8000);
  });

  it("returns defaults for invalid input", () => {
    const config = parseMemoryConfig("invalid");
    expect(config.enabled).toBe(true);
    expect(config.workerPort).toBe(37777);
  });

  it("adds empty stripPatterns to privacy config", () => {
    const config = parseMemoryConfig({});
    expect(config.privacy.stripPatterns).toEqual([]);
  });

  it("handles null input", () => {
    const config = parseMemoryConfig(null);
    expect(config.enabled).toBe(true);
  });

  it("handles undefined input", () => {
    const config = parseMemoryConfig(undefined);
    expect(config.enabled).toBe(true);
  });
});

describe("getDefaultMemoryConfig", () => {
  it("returns complete default config", () => {
    const config = getDefaultMemoryConfig();
    expect(config.enabled).toBe(true);
    expect(config.workerPort).toBe(37777);
    expect(config.capture).toBeDefined();
    expect(config.injection).toBeDefined();
    expect(config.privacy).toBeDefined();
    expect(config.embeddings).toBeDefined();
  });

  it("returns fresh copy each time", () => {
    const config1 = getDefaultMemoryConfig();
    const config2 = getDefaultMemoryConfig();
    expect(config1).not.toBe(config2);
    
    config1.workerPort = 9999;
    expect(config2.workerPort).toBe(37777);
  });
});

describe("mergeMemoryConfig", () => {
  it("merges user config with defaults", () => {
    const config = mergeMemoryConfig({ workerPort: 9000 });
    expect(config.workerPort).toBe(9000);
    expect(config.enabled).toBe(true);
  });

  it("allows partial nested configs", () => {
    const config = mergeMemoryConfig({
      capture: {
        enabled: false,
      },
    });
    expect(config.capture.enabled).toBe(false);
    expect(config.capture.captureToolUse).toBe(true);
  });

  it("handles empty input", () => {
    const config = mergeMemoryConfig({});
    expect(config).toEqual(getDefaultMemoryConfig());
  });
});

describe("validateMemoryConfig", () => {
  it("returns valid for correct config", () => {
    const result = validateMemoryConfig({ enabled: true });
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("returns errors for invalid config", () => {
    const result = validateMemoryConfig({ workerPort: "invalid" });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeInstanceOf(Array);
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it("includes path in error messages", () => {
    const result = validateMemoryConfig({
      capture: {
        minImportanceThreshold: -1,
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes("capture"))).toBe(true);
  });
});

describe("EXAMPLE_MEMORY_CONFIG", () => {
  it("is a valid config", () => {
    const result = MemoryConfigSchema.safeParse(EXAMPLE_MEMORY_CONFIG);
    expect(result.success).toBe(true);
  });

  it("demonstrates all config sections", () => {
    expect(EXAMPLE_MEMORY_CONFIG.enabled).toBeDefined();
    expect(EXAMPLE_MEMORY_CONFIG.capture).toBeDefined();
    expect(EXAMPLE_MEMORY_CONFIG.injection).toBeDefined();
    expect(EXAMPLE_MEMORY_CONFIG.privacy).toBeDefined();
    expect(EXAMPLE_MEMORY_CONFIG.embeddings).toBeDefined();
  });
});

describe("MINIMAL_MEMORY_CONFIG", () => {
  it("is a valid config", () => {
    const result = MemoryConfigSchema.safeParse(MINIMAL_MEMORY_CONFIG);
    expect(result.success).toBe(true);
  });

  it("only specifies enabled flag", () => {
    expect(Object.keys(MINIMAL_MEMORY_CONFIG)).toEqual(["enabled"]);
  });
});
