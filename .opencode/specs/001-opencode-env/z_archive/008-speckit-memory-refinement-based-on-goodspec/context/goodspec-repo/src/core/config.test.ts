/**
 * Tests for configuration system
 */

import { describe, it, expect } from "bun:test";
import { 
  loadPluginConfig, 
  validateConfig, 
  getDefaultConfig,
  GoopSpecConfigSchema,
  DEFAULT_CONFIG,
} from "./config";
import { getPackageRoot } from "../shared/paths";

describe("config", () => {
  describe("DEFAULT_CONFIG", () => {
    it("should have required defaults", () => {
      expect(DEFAULT_CONFIG.enforcement).toBe("assist");
      expect(DEFAULT_CONFIG.constitution).toBe(true);
      expect(DEFAULT_CONFIG.adlEnabled).toBe(true);
      expect(DEFAULT_CONFIG.defaultModel).toBeTruthy();
    });

    it("should have MCP defaults", () => {
      expect(DEFAULT_CONFIG.mcp?.context7).toBe(true);
      expect(DEFAULT_CONFIG.mcp?.exa).toBe(true);
    });
  });

  describe("getDefaultConfig", () => {
    it("should return a copy of defaults", () => {
      const config1 = getDefaultConfig();
      const config2 = getDefaultConfig();
      
      // Should be equal
      expect(config1).toEqual(config2);
      
      // But not the same object
      config1.projectName = "test";
      expect(config2.projectName).toBeUndefined();
    });
  });

  describe("validateConfig", () => {
    it("should validate a valid config", () => {
      const result = validateConfig({
        projectName: "test-project",
        enforcement: "assist",
      });
      expect(result.valid).toBe(true);
    });

    it("should reject invalid enforcement level", () => {
      const result = validateConfig({
        enforcement: "invalid",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeTruthy();
    });

    it("should validate agent config", () => {
      const result = validateConfig({
        agents: {
          "test-agent": {
            model: "gpt-4",
            temperature: 0.5,
          },
        },
      });
      expect(result.valid).toBe(true);
    });

    it("should reject invalid temperature", () => {
      const result = validateConfig({
        agents: {
          "test-agent": {
            temperature: 5, // Too high
          },
        },
      });
      expect(result.valid).toBe(false);
    });

    it("should accept empty config", () => {
      const result = validateConfig({});
      expect(result.valid).toBe(true);
    });
  });

  describe("loadPluginConfig", () => {
    it("should return default config when no files exist", () => {
      // Use a non-existent directory
      const config = loadPluginConfig("/tmp/non-existent-project-12345");
      
      // Should have defaults
      expect(config.enforcement).toBe("assist");
      expect(config.constitution).toBe(true);
    });

    it("should work with actual project directory", () => {
      const projectDir = getPackageRoot();
      const config = loadPluginConfig(projectDir);
      
      // Should at least have defaults
      expect(config).toBeTruthy();
      expect(config.enforcement).toBeTruthy();
    });
  });

  describe("GoopSpecConfigSchema", () => {
    it("should parse complete config", () => {
      const config = {
        projectName: "my-project",
        enforcement: "warn",
        constitution: false,
        adlEnabled: true,
        defaultModel: "claude-opus",
        agents: {
          orchestrator: { model: "gpt-4" },
        },
        mcp: {
          context7: true,
          exa: false,
        },
      };

      const result = GoopSpecConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should allow partial config", () => {
      const config = {
        projectName: "minimal",
      };

      const result = GoopSpecConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });
});
