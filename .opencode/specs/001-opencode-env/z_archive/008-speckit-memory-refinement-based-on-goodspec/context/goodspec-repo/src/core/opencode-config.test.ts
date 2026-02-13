/**
 * Tests for OpenCode Configuration Helper
 * @module core/opencode-config.test
 */

import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import {
  readOpenCodeConfig,
  writeOpenCodeConfig,
  mergeMcpConfig,
  hasOpenCodeConfig,
  getExistingMcps,
  getOpenCodeConfigDir,
  getOpenCodeConfigPath,
  type OpenCodeConfig,
  type McpEntry,
} from "./opencode-config.js";
import { createTestDir, cleanupTestDir } from "../test-utils.js";

describe("opencode-config", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir("opencode-config-test");
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  describe("getOpenCodeConfigDir", () => {
    it("returns path in home directory", () => {
      const dir = getOpenCodeConfigDir();
      expect(dir).toContain(".config");
      expect(dir).toContain("opencode");
    });
  });

  describe("getOpenCodeConfigPath", () => {
    it("returns path to config.json", () => {
      const path = getOpenCodeConfigPath();
      expect(path).toContain("config.json");
      expect(path).toContain(".config");
      expect(path).toContain("opencode");
    });
  });

  describe("readOpenCodeConfig", () => {
    it("returns empty object when config does not exist", () => {
      const nonExistentDir = join(testDir, "nonexistent");
      const config = readOpenCodeConfig(nonExistentDir);
      expect(config).toEqual({});
    });

    it("reads valid JSON config", () => {
      const expectedConfig: OpenCodeConfig = {
        mcp: {
          "test-server": { enabled: true },
        },
        default_agent: "test-agent",
      };

      writeFileSync(
        join(testDir, "config.json"),
        JSON.stringify(expectedConfig, null, 2)
      );

      const config = readOpenCodeConfig(testDir);
      expect(config).toEqual(expectedConfig);
    });

    it("throws error for invalid JSON", () => {
      writeFileSync(join(testDir, "config.json"), "invalid json {");
      
      expect(() => readOpenCodeConfig(testDir)).toThrow();
    });

    it("reads nested MCP configuration", () => {
      const expectedConfig: OpenCodeConfig = {
        mcp: {
          "context7": {
            enabled: true,
            command: "npx",
            args: ["-y", "@context7/mcp"],
          },
          "exa": {
            enabled: true,
            command: "npx",
            args: ["-y", "@exa/mcp"],
          },
        },
      };

      writeFileSync(
        join(testDir, "config.json"),
        JSON.stringify(expectedConfig)
      );

      const config = readOpenCodeConfig(testDir);
      expect(config.mcp).toBeDefined();
      expect(Object.keys(config.mcp!)).toHaveLength(2);
      expect(config.mcp!["context7"]).toEqual(expectedConfig.mcp!["context7"]);
    });
  });

  describe("writeOpenCodeConfig", () => {
    it("writes config to file", () => {
      const config: OpenCodeConfig = {
        mcp: { "test": { enabled: true } },
        default_agent: "my-agent",
      };

      writeOpenCodeConfig(config, testDir);

      const configPath = join(testDir, "config.json");
      expect(existsSync(configPath)).toBe(true);

      const content = readFileSync(configPath, "utf-8");
      const written = JSON.parse(content);
      expect(written).toEqual(config);
    });

    it("creates directory if it does not exist", () => {
      const nestedDir = join(testDir, "nested", "config", "dir");
      const config: OpenCodeConfig = { default_agent: "test" };

      writeOpenCodeConfig(config, nestedDir);

      expect(existsSync(nestedDir)).toBe(true);
      expect(existsSync(join(nestedDir, "config.json"))).toBe(true);
    });

    it("overwrites existing config", () => {
      const originalConfig: OpenCodeConfig = { default_agent: "original" };
      const newConfig: OpenCodeConfig = { default_agent: "new" };

      writeFileSync(
        join(testDir, "config.json"),
        JSON.stringify(originalConfig)
      );

      writeOpenCodeConfig(newConfig, testDir);

      const content = readFileSync(join(testDir, "config.json"), "utf-8");
      const written = JSON.parse(content);
      expect(written.default_agent).toBe("new");
    });

    it("formats JSON with indentation", () => {
      const config: OpenCodeConfig = {
        mcp: { test: { enabled: true } },
      };

      writeOpenCodeConfig(config, testDir);

      const content = readFileSync(join(testDir, "config.json"), "utf-8");
      expect(content).toContain("\n");
      expect(content).toContain("  "); // 2-space indentation
    });
  });

  describe("mergeMcpConfig", () => {
    it("merges MCP entries into empty config", () => {
      const config: OpenCodeConfig = {};
      const mcpEntries: Record<string, McpEntry> = {
        "new-server": { enabled: true },
      };

      const merged = mergeMcpConfig(config, mcpEntries);

      expect(merged.mcp).toBeDefined();
      expect(merged.mcp!["new-server"]).toEqual({ enabled: true });
    });

    it("merges MCP entries into existing config", () => {
      const config: OpenCodeConfig = {
        mcp: { "existing": { enabled: true } },
        default_agent: "my-agent",
      };
      const mcpEntries: Record<string, McpEntry> = {
        "new-server": { enabled: true },
      };

      const merged = mergeMcpConfig(config, mcpEntries);

      expect(merged.mcp!["existing"]).toEqual({ enabled: true });
      expect(merged.mcp!["new-server"]).toEqual({ enabled: true });
      expect(merged.default_agent).toBe("my-agent");
    });

    it("overwrites existing MCP entry with same key", () => {
      const config: OpenCodeConfig = {
        mcp: { "server": { enabled: true, oldProp: "old" } },
      };
      const mcpEntries: Record<string, McpEntry> = {
        "server": { enabled: false, newProp: "new" },
      };

      const merged = mergeMcpConfig(config, mcpEntries);

      expect(merged.mcp!["server"]).toEqual({ enabled: false, newProp: "new" });
    });

    it("preserves non-MCP config properties", () => {
      const config: OpenCodeConfig = {
        default_agent: "test-agent",
        agent: { "custom": { model: "gpt-4" } },
      };
      const mcpEntries: Record<string, McpEntry> = {
        "server": { enabled: true },
      };

      const merged = mergeMcpConfig(config, mcpEntries);

      expect(merged.default_agent).toBe("test-agent");
      expect(merged.agent).toEqual({ "custom": { model: "gpt-4" } });
    });

    it("does not mutate original config", () => {
      const config: OpenCodeConfig = {
        mcp: { "existing": { enabled: true } },
      };
      const mcpEntries: Record<string, McpEntry> = {
        "new": { enabled: true },
      };

      const merged = mergeMcpConfig(config, mcpEntries);

      expect(config.mcp).not.toHaveProperty("new");
      expect(merged.mcp).toHaveProperty("new");
    });
  });

  describe("hasOpenCodeConfig", () => {
    it("returns false when config does not exist", () => {
      const result = hasOpenCodeConfig(testDir);
      expect(result).toBe(false);
    });

    it("returns true when config exists", () => {
      writeFileSync(join(testDir, "config.json"), "{}");
      
      const result = hasOpenCodeConfig(testDir);
      expect(result).toBe(true);
    });

    it("returns true even for empty config file", () => {
      writeFileSync(join(testDir, "config.json"), "");
      
      const result = hasOpenCodeConfig(testDir);
      expect(result).toBe(true);
    });
  });

  describe("getExistingMcps", () => {
    it("returns empty array for config without mcp", () => {
      const config: OpenCodeConfig = { default_agent: "test" };
      
      const mcps = getExistingMcps(config);
      expect(mcps).toEqual([]);
    });

    it("returns empty array for null mcp", () => {
      const config: OpenCodeConfig = {};
      
      const mcps = getExistingMcps(config);
      expect(mcps).toEqual([]);
    });

    it("returns list of MCP keys", () => {
      const config: OpenCodeConfig = {
        mcp: {
          "context7": { enabled: true },
          "exa": { enabled: true },
          "custom": { enabled: false },
        },
      };

      const mcps = getExistingMcps(config);
      
      expect(mcps).toHaveLength(3);
      expect(mcps).toContain("context7");
      expect(mcps).toContain("exa");
      expect(mcps).toContain("custom");
    });

    it("returns keys regardless of enabled status", () => {
      const config: OpenCodeConfig = {
        mcp: {
          "enabled-server": { enabled: true },
          "disabled-server": { enabled: false },
        },
      };

      const mcps = getExistingMcps(config);
      
      expect(mcps).toHaveLength(2);
    });
  });
});
