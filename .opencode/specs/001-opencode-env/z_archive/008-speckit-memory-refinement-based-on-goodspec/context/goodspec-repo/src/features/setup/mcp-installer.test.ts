/**
 * Tests for MCP Installer
 */

import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { mkdirSync, rmSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { installMcps, isMcpInstalled, getInstalledMcps } from "./mcp-installer";

const TEST_DIR = "/tmp/goopspec-mcp-test-" + Date.now();

describe("mcp-installer", () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe("isMcpInstalled", () => {
    it("should return false when config doesn't exist", () => {
      const result = isMcpInstalled("test-mcp", TEST_DIR);
      expect(result).toBe(false);
    });

    it("should return false when MCP not in config", () => {
      // Create empty config
      writeFileSync(
        join(TEST_DIR, "config.json"),
        JSON.stringify({ mcp: {} })
      );
      
      const result = isMcpInstalled("test-mcp", TEST_DIR);
      expect(result).toBe(false);
    });

    it("should return true when MCP is in config", () => {
      writeFileSync(
        join(TEST_DIR, "config.json"),
        JSON.stringify({ mcp: { "test-mcp": { enabled: true } } })
      );
      
      const result = isMcpInstalled("test-mcp", TEST_DIR);
      expect(result).toBe(true);
    });
  });

  describe("getInstalledMcps", () => {
    it("should return empty array when config doesn't exist", () => {
      const result = getInstalledMcps(TEST_DIR);
      expect(result).toEqual([]);
    });

    it("should return empty array when no MCPs installed", () => {
      writeFileSync(
        join(TEST_DIR, "config.json"),
        JSON.stringify({ mcp: {} })
      );
      
      const result = getInstalledMcps(TEST_DIR);
      expect(result).toEqual([]);
    });

    it("should return list of installed MCPs", () => {
      writeFileSync(
        join(TEST_DIR, "config.json"),
        JSON.stringify({
          mcp: {
            "mcp-one": { enabled: true },
            "mcp-two": { enabled: false },
            "mcp-three": { enabled: true },
          }
        })
      );
      
      const result = getInstalledMcps(TEST_DIR);
      expect(result).toContain("mcp-one");
      expect(result).toContain("mcp-two");
      expect(result).toContain("mcp-three");
      expect(result.length).toBe(3);
    });
  });

  describe("installMcps", () => {
    it("should return empty array when no MCPs provided", async () => {
      const result = await installMcps([], TEST_DIR);
      expect(result).toEqual([]);
    });

    // Note: Full installation tests require mocking child_process which is complex
    // and fragile. The core logic is tested through isMcpInstalled and getInstalledMcps.
    // Integration tests would be better suited for full installation flow.
  });

  describe("error handling", () => {
    it("should handle corrupted config gracefully", () => {
      writeFileSync(join(TEST_DIR, "config.json"), "invalid json{");
      
      const result = isMcpInstalled("test-mcp", TEST_DIR);
      expect(result).toBe(false);
    });

    it("should handle missing mcp field in config", () => {
      writeFileSync(
        join(TEST_DIR, "config.json"),
        JSON.stringify({ other: "data" })
      );
      
      const result = getInstalledMcps(TEST_DIR);
      expect(result).toEqual([]);
    });
  });
});
