/**
 * Tests for Logger Utility
 * @module shared/logger.test
 */

import { describe, it, expect, beforeEach, afterEach, mock, spyOn } from "bun:test";
import { existsSync, unlinkSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { log, logError, logEvent, setDebug } from "./logger.js";

const DEBUG_LOG_FILE = join(homedir(), ".goopspec-debug.log");

describe("logger", () => {
  // Clean up log file before and after tests
  function cleanupLogFile() {
    try {
      if (existsSync(DEBUG_LOG_FILE)) {
        unlinkSync(DEBUG_LOG_FILE);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  beforeEach(() => {
    cleanupLogFile();
    setDebug(false);
  });

  afterEach(() => {
    setDebug(false);
    cleanupLogFile();
  });

  describe("setDebug", () => {
    it("enables debug logging when set to true", () => {
      setDebug(true);
      
      log("test message");
      
      // Should write to file when debug is enabled
      expect(existsSync(DEBUG_LOG_FILE)).toBe(true);
      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("test message");
    });

    it("disables debug logging when set to false", () => {
      setDebug(false);
      
      log("test message");
      
      // Should not write to file when debug is disabled
      expect(existsSync(DEBUG_LOG_FILE)).toBe(false);
    });

    it("can toggle debug mode multiple times", () => {
      setDebug(true);
      log("message 1");
      
      let content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("message 1");

      setDebug(false);
      log("message 2");
      
      // message 2 should not be added
      content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).not.toContain("message 2");

      setDebug(true);
      log("message 3");
      
      content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("message 3");
    });
  });

  describe("log", () => {
    beforeEach(() => {
      setDebug(true);
    });

    it("does nothing when debug is disabled", () => {
      setDebug(false);
      
      log("test message");
      
      expect(existsSync(DEBUG_LOG_FILE)).toBe(false);
    });

    it("logs message with DEBUG level when debug enabled", () => {
      log("test message");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("[DEBUG]");
      expect(content).toContain("test message");
    });

    it("includes timestamp in log output", () => {
      log("test message");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      // ISO timestamp format check (contains T and timezone info)
      expect(content).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("logs message without data", () => {
      log("simple message");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("simple message");
      // Should not have extra JSON data
      expect(content.split("\n").filter(l => l.trim()).length).toBe(1);
    });

    it("logs message with data object", () => {
      const data = { key: "value", count: 42 };
      
      log("message with data", data);

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("message with data");
      expect(content).toContain('"key":"value"');
      expect(content).toContain('"count":42');
    });

    it("logs message with nested data object", () => {
      const data = {
        nested: {
          deep: {
            value: "test",
          },
        },
        array: [1, 2, 3],
      };

      log("nested data", data);

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("nested data");
      expect(content).toContain('"value":"test"');
    });

    it("logs message with empty data object", () => {
      log("empty data", {});

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("empty data");
      expect(content).toContain("{}");
    });
  });

  describe("logError", () => {
    beforeEach(() => {
      setDebug(true);
    });

    it("logs errors when debug mode is enabled", () => {
      logError("error message");
      
      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("[ERROR]");
      expect(content).toContain("error message");
    });

    it("does not log errors when debug mode is disabled", () => {
      setDebug(false);
      
      logError("error message");
      
      // logError only writes when DEBUG is true (via writeDebugLog)
      expect(existsSync(DEBUG_LOG_FILE)).toBe(false);
    });

    it("logs error with ERROR level", () => {
      logError("test error");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("[ERROR]");
      expect(content).toContain("test error");
    });

    it("includes timestamp in error output", () => {
      logError("test error");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("logs error message without error object", () => {
      logError("simple error");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("simple error");
    });

    it("logs error message with Error object", () => {
      const error = new Error("test error object");
      
      logError("error occurred", error);

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("error occurred");
      expect(content).toContain("test error object");
    });

    it("logs error message with string error", () => {
      logError("error occurred", "string error");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("string error");
    });

    it("logs error message with unknown error type", () => {
      const weirdError = { custom: "error", code: 500 };
      
      logError("unknown error", weirdError);

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain('"custom":"error"');
      expect(content).toContain('"code":500');
    });

    it("logs error message with undefined error", () => {
      logError("error with undefined", undefined);

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("error with undefined");
    });

    it("logs error message with null error", () => {
      logError("error with null", null);

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("error with null");
      expect(content).toContain("null");
    });
  });

  describe("logEvent", () => {
    beforeEach(() => {
      setDebug(true);
    });

    it("logs events with EVENT level", () => {
      logEvent("test.event", { data: "value" });

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("[EVENT]");
      expect(content).toContain("test.event");
      expect(content).toContain('"data":"value"');
    });

    it("does not log events when debug is disabled", () => {
      setDebug(false);
      
      logEvent("test.event");
      
      expect(existsSync(DEBUG_LOG_FILE)).toBe(false);
    });
  });

  describe("concurrent logging", () => {
    it("handles multiple rapid log calls", () => {
      setDebug(true);

      // Use unique marker to count only our messages
      const marker = `concurrent-test-${Date.now()}`;
      for (let i = 0; i < 100; i++) {
        log(`${marker}-message-${i}`);
      }

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      const lines = content.split("\n").filter(l => l.includes(marker));
      expect(lines.length).toBe(100);
    });

    it("handles interleaved log and logError calls", () => {
      setDebug(true);

      log("log 1");
      logError("error 1");
      log("log 2");
      logError("error 2");

      const content = readFileSync(DEBUG_LOG_FILE, "utf-8");
      expect(content).toContain("log 1");
      expect(content).toContain("error 1");
      expect(content).toContain("log 2");
      expect(content).toContain("error 2");
    });
  });
});
