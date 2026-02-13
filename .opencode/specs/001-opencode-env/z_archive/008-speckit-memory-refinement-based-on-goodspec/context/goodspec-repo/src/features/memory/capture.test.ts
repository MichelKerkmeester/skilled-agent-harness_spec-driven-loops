/**
 * Unit Tests for Memory Capture
 * @module features/memory/capture.test
 */

import { describe, it, expect } from "bun:test";
import {
  shouldCapture,
  estimateImportance,
  sanitizeContent,
  getMemoryTypeForEvent,
  buildToolCaptureEvent,
  buildPhaseCaptureEvent,
  buildMessageCaptureEvent,
  DEFAULT_CAPTURE_CONFIG,
  SENSITIVE_PATTERNS,
  TOOL_IMPORTANCE,
} from "./capture.js";
import type { RawEvent, CaptureConfig } from "./types.js";

describe("memory capture", () => {
  describe("DEFAULT_CAPTURE_CONFIG", () => {
    it("is enabled by default", () => {
      expect(DEFAULT_CAPTURE_CONFIG.enabled).toBe(true);
    });

    it("captures tool use by default", () => {
      expect(DEFAULT_CAPTURE_CONFIG.captureToolUse).toBe(true);
    });

    it("does not capture messages by default", () => {
      expect(DEFAULT_CAPTURE_CONFIG.captureMessages).toBe(false);
    });

    it("captures phase changes by default", () => {
      expect(DEFAULT_CAPTURE_CONFIG.capturePhaseChanges).toBe(true);
    });

    it("has skip tools list", () => {
      expect(Array.isArray(DEFAULT_CAPTURE_CONFIG.skipTools)).toBe(true);
      expect(DEFAULT_CAPTURE_CONFIG.skipTools.length).toBeGreaterThan(0);
    });

    it("skips read-only tools", () => {
      const readOnlyTools = ["Read", "Glob", "Grep", "mcp_read", "mcp_glob", "mcp_grep"];
      for (const tool of readOnlyTools) {
        expect(DEFAULT_CAPTURE_CONFIG.skipTools).toContain(tool);
      }
    });

    it("skips memory tools to avoid recursion", () => {
      const memoryTools = ["memory_save", "memory_search", "memory_note"];
      for (const tool of memoryTools) {
        expect(DEFAULT_CAPTURE_CONFIG.skipTools).toContain(tool);
      }
    });
  });

  describe("SENSITIVE_PATTERNS", () => {
    it("has patterns for common sensitive data", () => {
      expect(SENSITIVE_PATTERNS.length).toBeGreaterThan(0);
    });

    it("includes API key pattern", () => {
      const hasApiKeyPattern = SENSITIVE_PATTERNS.some(
        p => p.toString().toLowerCase().includes("api")
      );
      expect(hasApiKeyPattern).toBe(true);
    });

    it("includes password pattern", () => {
      const hasPasswordPattern = SENSITIVE_PATTERNS.some(
        p => p.toString().toLowerCase().includes("password")
      );
      expect(hasPasswordPattern).toBe(true);
    });

    it("includes token pattern", () => {
      const hasTokenPattern = SENSITIVE_PATTERNS.some(
        p => p.toString().toLowerCase().includes("token")
      );
      expect(hasTokenPattern).toBe(true);
    });
  });

  describe("TOOL_IMPORTANCE", () => {
    it("assigns high importance to write operations", () => {
      expect(TOOL_IMPORTANCE.Write).toBeGreaterThanOrEqual(7);
      expect(TOOL_IMPORTANCE.mcp_write).toBeGreaterThanOrEqual(7);
    });

    it("assigns medium importance to edit operations", () => {
      expect(TOOL_IMPORTANCE.Edit).toBeGreaterThanOrEqual(6);
    });

    it("assigns lower importance to status checks", () => {
      expect(TOOL_IMPORTANCE.goop_status).toBeLessThan(5);
    });
  });

  describe("shouldCapture", () => {
    describe("when disabled", () => {
      it("returns false", () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test",
          data: { tool: "Write" },
        };
        const config: CaptureConfig = { ...DEFAULT_CAPTURE_CONFIG, enabled: false };

        expect(shouldCapture(event, config)).toBe(false);
      });
    });

    describe("tool_use events", () => {
      it("captures non-skipped tools", () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test",
          data: { tool: "Write" },
        };

        expect(shouldCapture(event, DEFAULT_CAPTURE_CONFIG)).toBe(true);
      });

      it("skips tools in skipTools list", () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test",
          data: { tool: "Read" },
        };

        expect(shouldCapture(event, DEFAULT_CAPTURE_CONFIG)).toBe(false);
      });

      it("respects captureToolUse setting", () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test",
          data: { tool: "Write" },
        };
        const config: CaptureConfig = { ...DEFAULT_CAPTURE_CONFIG, captureToolUse: false };

        expect(shouldCapture(event, config)).toBe(false);
      });
    });

    describe("message events", () => {
      it("does not capture messages by default", () => {
        const event: RawEvent = {
          type: "user_message",
          timestamp: Date.now(),
          sessionId: "test",
          data: { content: "Hello" },
        };

        expect(shouldCapture(event, DEFAULT_CAPTURE_CONFIG)).toBe(false);
      });

      it("captures messages when enabled", () => {
        const event: RawEvent = {
          type: "user_message",
          timestamp: Date.now(),
          sessionId: "test",
          data: { content: "Hello" },
        };
        const config: CaptureConfig = { ...DEFAULT_CAPTURE_CONFIG, captureMessages: true };

        expect(shouldCapture(event, config)).toBe(true);
      });
    });

    describe("phase_change events", () => {
      it("captures phase changes by default", () => {
        const event: RawEvent = {
          type: "phase_change",
          timestamp: Date.now(),
          sessionId: "test",
          data: { from: "plan", to: "execute" },
        };

        expect(shouldCapture(event, DEFAULT_CAPTURE_CONFIG)).toBe(true);
      });

      it("respects capturePhaseChanges setting", () => {
        const event: RawEvent = {
          type: "phase_change",
          timestamp: Date.now(),
          sessionId: "test",
          data: { from: "plan", to: "execute" },
        };
        const config: CaptureConfig = { ...DEFAULT_CAPTURE_CONFIG, capturePhaseChanges: false };

        expect(shouldCapture(event, config)).toBe(false);
      });
    });
  });

  describe("estimateImportance", () => {
    it("returns configured importance for known tools", () => {
      const event: RawEvent = {
        type: "tool_use",
        timestamp: Date.now(),
        sessionId: "test",
        data: { tool: "Write" },
      };

      expect(estimateImportance(event)).toBe(TOOL_IMPORTANCE.Write);
    });

    it("returns default importance for unknown tools", () => {
      const event: RawEvent = {
        type: "tool_use",
        timestamp: Date.now(),
        sessionId: "test",
        data: { tool: "UnknownTool" },
      };

      expect(estimateImportance(event)).toBe(5);
    });

    it("assigns high importance to phase changes", () => {
      const event: RawEvent = {
        type: "phase_change",
        timestamp: Date.now(),
        sessionId: "test",
        data: { from: "plan", to: "execute" },
      };

      expect(estimateImportance(event)).toBe(7);
    });

    it("assigns higher importance to user questions", () => {
      const event: RawEvent = {
        type: "user_message",
        timestamp: Date.now(),
        sessionId: "test",
        data: { content: "How does this work?" },
      };

      expect(estimateImportance(event)).toBeGreaterThan(4);
    });

    it("assigns higher importance to commands", () => {
      const event: RawEvent = {
        type: "user_message",
        timestamp: Date.now(),
        sessionId: "test",
        data: { content: "/goop-plan add feature" },
      };

      expect(estimateImportance(event)).toBeGreaterThan(4);
    });

    it("assigns lower importance to assistant messages", () => {
      const event: RawEvent = {
        type: "assistant_message",
        timestamp: Date.now(),
        sessionId: "test",
        data: { content: "I will help you." },
      };

      expect(estimateImportance(event)).toBeLessThan(5);
    });
  });

  describe("sanitizeContent", () => {
    it("redacts API keys", () => {
      const content = 'The api_key = "sk-abc123xyz" is used here.';
      const sanitized = sanitizeContent(content);

      expect(sanitized).not.toContain("sk-abc123xyz");
      expect(sanitized).toContain("[REDACTED]");
    });

    it("redacts passwords", () => {
      const content = 'password: "mysecretpass123"';
      const sanitized = sanitizeContent(content);

      expect(sanitized).not.toContain("mysecretpass123");
      expect(sanitized).toContain("[REDACTED]");
    });

    it("redacts bearer tokens", () => {
      const content = "Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      const sanitized = sanitizeContent(content);

      expect(sanitized).not.toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      expect(sanitized).toContain("[REDACTED]");
    });

    it("redacts private key blocks", () => {
      const content = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC
-----END PRIVATE KEY-----`;
      const sanitized = sanitizeContent(content);

      expect(sanitized).toContain("[REDACTED]");
    });

    it("removes private blocks", () => {
      const content = "Public info <private>Secret stuff</private> More public";
      const sanitized = sanitizeContent(content);

      expect(sanitized).not.toContain("Secret stuff");
      expect(sanitized).toContain("[PRIVATE]");
      expect(sanitized).toContain("Public info");
      expect(sanitized).toContain("More public");
    });

    it("preserves non-sensitive content", () => {
      const content = "This is a normal message about programming.";
      const sanitized = sanitizeContent(content);

      expect(sanitized).toBe(content);
    });
  });

  describe("getMemoryTypeForEvent", () => {
    it("returns decision for decision tools", () => {
      const event: RawEvent = {
        type: "tool_use",
        timestamp: Date.now(),
        sessionId: "test",
        data: { tool: "memory_decision" },
      };

      expect(getMemoryTypeForEvent(event)).toBe("decision");
    });

    it("returns observation for checkpoint tools", () => {
      const event: RawEvent = {
        type: "tool_use",
        timestamp: Date.now(),
        sessionId: "test",
        data: { tool: "goop_checkpoint" },
      };

      expect(getMemoryTypeForEvent(event)).toBe("observation");
    });

    it("returns session_summary for phase changes", () => {
      const event: RawEvent = {
        type: "phase_change",
        timestamp: Date.now(),
        sessionId: "test",
        data: {},
      };

      expect(getMemoryTypeForEvent(event)).toBe("session_summary");
    });

    it("returns user_prompt for user messages", () => {
      const event: RawEvent = {
        type: "user_message",
        timestamp: Date.now(),
        sessionId: "test",
        data: { content: "Hello" },
      };

      expect(getMemoryTypeForEvent(event)).toBe("user_prompt");
    });

    it("returns observation for assistant messages", () => {
      const event: RawEvent = {
        type: "assistant_message",
        timestamp: Date.now(),
        sessionId: "test",
        data: { content: "Hello" },
      };

      expect(getMemoryTypeForEvent(event)).toBe("observation");
    });
  });

  describe("buildToolCaptureEvent", () => {
    it("creates tool use event with correct type", () => {
      const event = buildToolCaptureEvent("Write", { path: "/test" }, "Success", "session-1");

      expect(event.type).toBe("tool_use");
    });

    it("includes tool name in data", () => {
      const event = buildToolCaptureEvent("Write", {}, "", "session-1");

      expect(event.data.tool).toBe("Write");
    });

    it("includes args in data", () => {
      const args = { path: "/test/file.ts", content: "code" };
      const event = buildToolCaptureEvent("Write", args, "", "session-1");

      expect(event.data.args).toEqual(args);
    });

    it("truncates long results", () => {
      const longResult = "A".repeat(3000);
      const event = buildToolCaptureEvent("Write", {}, longResult, "session-1");

      expect((event.data.result as string).length).toBeLessThanOrEqual(2000);
    });

    it("includes session ID", () => {
      const event = buildToolCaptureEvent("Write", {}, "", "my-session");

      expect(event.sessionId).toBe("my-session");
    });

    it("includes timestamp", () => {
      const before = Date.now();
      const event = buildToolCaptureEvent("Write", {}, "", "session-1");
      const after = Date.now();

      expect(event.timestamp).toBeGreaterThanOrEqual(before);
      expect(event.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe("buildPhaseCaptureEvent", () => {
    it("creates phase change event", () => {
      const event = buildPhaseCaptureEvent("plan", "execute", "session-1");

      expect(event.type).toBe("phase_change");
      expect(event.data.from).toBe("plan");
      expect(event.data.to).toBe("execute");
    });

    it("handles null from phase", () => {
      const event = buildPhaseCaptureEvent(null, "plan", "session-1");

      expect(event.data.from).toBeNull();
      expect(event.data.to).toBe("plan");
    });
  });

  describe("buildMessageCaptureEvent", () => {
    it("creates user message event", () => {
      const event = buildMessageCaptureEvent("Hello", "user", "session-1");

      expect(event.type).toBe("user_message");
      expect(event.data.content).toBe("Hello");
      expect(event.data.role).toBe("user");
    });

    it("creates assistant message event", () => {
      const event = buildMessageCaptureEvent("Hi there", "assistant", "session-1");

      expect(event.type).toBe("assistant_message");
      expect(event.data.role).toBe("assistant");
    });

    it("sanitizes content", () => {
      const event = buildMessageCaptureEvent('My api_key="secret123"', "user", "session-1");

      expect((event.data.content as string)).not.toContain("secret123");
    });

    it("truncates long messages", () => {
      const longMessage = "A".repeat(6000);
      const event = buildMessageCaptureEvent(longMessage, "user", "session-1");

      expect((event.data.content as string).length).toBeLessThanOrEqual(5000);
    });
  });
});
