/**
 * Tests for path utilities
 */

import { describe, it, expect } from "bun:test";
import {
  getPackageRoot,
  isDevMode,
  getProjectGoopspecDir,
  getGlobalConfigDir,
  getBundledResourceDir,
  getProjectResourceDir,
  pathExists,
  joinPath,
  resolvePath,
} from "./paths";

describe("paths", () => {
  describe("getPackageRoot", () => {
    it("should return a valid directory path", () => {
      const root = getPackageRoot();
      expect(root).toBeTruthy();
      expect(typeof root).toBe("string");
      // Should end with opencode-goopspec
      expect(root).toContain("opencode-goopspec");
    });

    it("should return path where package.json exists", () => {
      const root = getPackageRoot();
      const packageJsonPath = joinPath(root, "package.json");
      expect(pathExists(packageJsonPath)).toBe(true);
    });
  });

  describe("isDevMode", () => {
    it("should return a boolean", () => {
      const result = isDevMode();
      expect(typeof result).toBe("boolean");
    });

    it("should return true when src/index.ts exists", () => {
      // In dev mode, src/index.ts should exist
      const result = isDevMode();
      expect(result).toBe(true);
    });
  });

  describe("getProjectGoopspecDir", () => {
    it("should return path ending with .goopspec", () => {
      const dir = getProjectGoopspecDir("/home/user/project");
      expect(dir).toBe("/home/user/project/.goopspec");
    });
  });

  describe("getGlobalConfigDir", () => {
    it("should return path containing .config/opencode", () => {
      const dir = getGlobalConfigDir();
      expect(dir).toContain(".config");
      expect(dir).toContain("opencode");
    });
  });

  describe("getBundledResourceDir", () => {
    it("should return path for agents", () => {
      const dir = getBundledResourceDir("agent");
      expect(dir).toContain("agents");
    });

    it("should return path for commands", () => {
      const dir = getBundledResourceDir("command");
      expect(dir).toContain("commands");
    });

    it("should return existing directory for agents", () => {
      const dir = getBundledResourceDir("agent");
      expect(pathExists(dir)).toBe(true);
    });
  });

  describe("getProjectResourceDir", () => {
    it("should return path within .goopspec", () => {
      const dir = getProjectResourceDir("/home/user/project", "agent");
      expect(dir).toBe("/home/user/project/.goopspec/agents");
    });
  });

  describe("joinPath", () => {
    it("should join paths correctly", () => {
      const result = joinPath("/home", "user", "project");
      expect(result).toBe("/home/user/project");
    });
  });

  describe("resolvePath", () => {
    it("should resolve relative paths", () => {
      const result = resolvePath("/home/user", "..", "other");
      expect(result).toBe("/home/other");
    });
  });
});
