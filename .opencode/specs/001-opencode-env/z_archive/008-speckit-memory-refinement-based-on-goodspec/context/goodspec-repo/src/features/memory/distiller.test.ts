/**
 * Tests for Memory Distillation Pipeline
 * @module features/memory/distiller.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { MemoryDistiller } from "./distiller.js";
import type { RawEvent } from "./types.js";

describe("MemoryDistiller", () => {
  let distiller: MemoryDistiller;

  beforeEach(() => {
    distiller = new MemoryDistiller();
  });

  describe("constructor", () => {
    it("uses default config when none provided", () => {
      const d = new MemoryDistiller();
      expect(d).toBeDefined();
    });

    it("accepts custom config", () => {
      const d = new MemoryDistiller({
        enabled: false,
        minImportanceThreshold: 8,
      });
      expect(d).toBeDefined();
    });
  });

  describe("distill", () => {
    describe("filtering", () => {
      it("filters events when capture is disabled", async () => {
        const disabledDistiller = new MemoryDistiller({ enabled: false });
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Write",
            args: { filePath: "/test/file.ts" },
            result: "Success",
          },
        };

        const result = await disabledDistiller.distill(event);
        expect(result.captured).toBe(false);
        expect(result.reason).toContain("filtered");
      });

      it("filters events below importance threshold", async () => {
        const highThresholdDistiller = new MemoryDistiller({
          minImportanceThreshold: 10,
        });
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Edit",
            args: { filePath: "/test/file.ts" },
            result: "Success",
          },
        };

        const result = await highThresholdDistiller.distill(event);
        expect(result.captured).toBe(false);
        expect(result.reason).toContain("importance");
      });

      it("filters skipped tools", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Read", // In default skipTools
            args: { filePath: "/test/file.ts" },
            result: "file content",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(false);
      });

      it("filters unknown event types", async () => {
        const event: RawEvent = {
          type: "unknown_type" as any,
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {},
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(false);
        // Unknown types are filtered by shouldCapture which returns false for unknown types
        expect(result.reason).toContain("filtered");
      });
    });

    describe("tool_use events", () => {
      it("distills Edit tool events", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Edit",
            args: { filePath: "/src/components/Button.tsx" },
            result: "Successfully edited file",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory).toBeDefined();
        expect(result.memory!.title).toContain("Edited");
        expect(result.memory!.title).toContain("Button.tsx");
        expect(result.memory!.concepts).toContain("edit");
        expect(result.memory!.concepts).toContain("tsx");
        expect(result.memory!.sourceFiles).toContain("/src/components/Button.tsx");
      });

      it("distills mcp_edit tool events", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "mcp_edit",
            args: { filePath: "/src/index.ts" },
            result: "Success",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("Edited");
      });

      it("distills Write tool events", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Write",
            args: { filePath: "/new-file.ts" },
            result: "File written successfully",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("Wrote");
      });

      it("distills Bash tool events", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Bash",
            args: { command: "npm install express" },
            result: "added 1 package",
          },
        };

        const lowThresholdDistiller = new MemoryDistiller({
          minImportanceThreshold: 1,
          skipTools: [], // Don't skip any
        });
        const result = await lowThresholdDistiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("Ran:");
        expect(result.memory!.title).toContain("npm install");
      });

      it("distills goop_checkpoint events", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "goop_checkpoint",
            args: { id: "checkpoint-001" },
            result: "Checkpoint saved",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("checkpoint");
        expect(result.memory!.title).toContain("checkpoint-001");
      });

      it("distills goop_adl events", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "goop_adl",
            args: { type: "decision" },
            result: "Entry added",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("ADL");
        expect(result.memory!.title).toContain("decision");
      });

      it("handles unknown tools with generic title", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "custom_tool",
            args: { param: "value" },
            result: "Done",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("Tool: custom_tool");
      });

      it("extracts facts from successful results", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Write",
            args: { filePath: "/test.ts" },
            result: "File written success",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.facts).toContain("File modification successful");
      });

      it("extracts facts from error results", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Bash",
            args: { command: "npm test" },
            result: "Error: test failed",
          },
        };

        const lowThresholdDistiller = new MemoryDistiller({
          minImportanceThreshold: 1,
          skipTools: [],
        });
        const result = await lowThresholdDistiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.facts).toContain("Command encountered an error");
      });

      it("truncates long titles", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "Edit",
            args: { filePath: "/this/is/a/very/long/path/that/should/be/truncated/because/it/exceeds/100/characters/file.ts" },
            result: "Success",
          },
        };

        const result = await distiller.distill(event);
        expect(result.memory!.title.length).toBeLessThanOrEqual(100);
      });

      it("limits extracted args in content", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "custom_tool",
            args: {
              arg1: "value1",
              arg2: "value2",
              arg3: "value3",
              arg4: "value4",
              arg5: "value5",
              arg6: "value6", // Should be excluded (only 5 shown)
              content: "should be filtered", // Should be excluded
              newString: "also filtered", // Should be excluded
            },
            result: "Done",
          },
        };

        const result = await distiller.distill(event);
        expect(result.memory!.content).toContain("arg1");
        expect(result.memory!.content).not.toContain("content:");
        expect(result.memory!.content).not.toContain("newString:");
      });

      it("extracts source files from result patterns", async () => {
        const event: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            tool: "custom_tool",
            args: {},
            result: "Modified files: /src/a.ts, /src/b.ts, /lib/c.js",
          },
        };

        const result = await distiller.distill(event);
        expect(result.memory!.sourceFiles).toContain("/src/a.ts");
        expect(result.memory!.sourceFiles).toContain("/src/b.ts");
        expect(result.memory!.sourceFiles).toContain("/lib/c.js");
      });
    });

    describe("phase_change events", () => {
      it("distills phase transitions", async () => {
        const event: RawEvent = {
          type: "phase_change",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            from: "plan",
            to: "execute",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("plan");
        expect(result.memory!.title).toContain("execute");
        expect(result.memory!.type).toBe("session_summary");
        expect(result.memory!.concepts).toContain("workflow");
        expect(result.memory!.concepts).toContain("phase");
        expect(result.memory!.concepts).toContain("execute");
        expect(result.memory!.facts).toContain("Entered execute phase");
      });

      it("handles initial phase transition (null from)", async () => {
        const event: RawEvent = {
          type: "phase_change",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            from: null,
            to: "plan",
          },
        };

        const result = await distiller.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.title).toContain("start");
        expect(result.memory!.content).toContain("initial");
      });
    });

    describe("user_message events", () => {
      it("distills user messages", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const event: RawEvent = {
          type: "user_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            content: "Can you add a new function to handle user authentication?",
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.type).toBe("user_prompt");
        expect(result.memory!.concepts).toContain("function");
        // Note: "security" not in the keywords list, only common programming terms
      });

      it("extracts intent from first sentence", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const event: RawEvent = {
          type: "user_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            content: "Create a new component. It should have props for color and size. Make sure it's accessible.",
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.memory!.title).toBe("Create a new component");
      });

      it("extracts programming concepts from text", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const event: RawEvent = {
          type: "user_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            // Using keywords that are in the extractConceptsFromText list
            content: "I need to fix a bug in the component that handles the api database calls",
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.memory!.concepts).toContain("fix");
        expect(result.memory!.concepts).toContain("bug");
        expect(result.memory!.concepts).toContain("component");
        expect(result.memory!.concepts).toContain("api");
        expect(result.memory!.concepts).toContain("database");
        // Note: "react" would only match if lowercase in the content
      });
    });

    describe("assistant_message events", () => {
      it("filters short assistant messages", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const event: RawEvent = {
          type: "assistant_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            content: "Done.", // Too short
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.captured).toBe(false);
        expect(result.reason).toContain("too short");
      });

      it("distills significant assistant messages", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const longContent = `
I've analyzed the codebase and found the following issues:
- The authentication function doesn't properly validate tokens
- The database connection has a potential race condition
- The API endpoint is missing proper error handling

Here are my recommendations:
- Add token validation in the middleware
- Implement connection pooling
- Add try-catch blocks with proper error responses
        `.trim();

        const event: RawEvent = {
          type: "assistant_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            content: longContent,
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.type).toBe("observation");
        expect(result.memory!.facts).toContain("The authentication function doesn't properly validate tokens");
      });

      it("truncates very long assistant content", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const veryLongContent = "a".repeat(3000);

        const event: RawEvent = {
          type: "assistant_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            content: veryLongContent,
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.captured).toBe(true);
        expect(result.memory!.content.length).toBeLessThanOrEqual(2000);
      });

      it("extracts facts from bullet points", async () => {
        const distillerWithMessages = new MemoryDistiller({
          captureMessages: true,
          minImportanceThreshold: 1,
        });

        const event: RawEvent = {
          type: "assistant_message",
          timestamp: Date.now(),
          sessionId: "test-session",
          data: {
            content: `
Here are the changes made:
- Added new component Button
- Updated styles for theme
- Fixed accessibility issues
- Removed deprecated code
- Added unit tests
            `.trim() + " " + "x".repeat(100), // Make it long enough
          },
        };

        const result = await distillerWithMessages.distill(event);
        expect(result.memory!.facts).toContain("Added new component Button");
        expect(result.memory!.facts).toContain("Updated styles for theme");
        expect(result.memory!.facts.length).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("sessionId handling", () => {
    it("preserves sessionId in distilled memory", async () => {
      const event: RawEvent = {
        type: "tool_use",
        timestamp: Date.now(),
        sessionId: "specific-session-123",
        data: {
          tool: "Edit",
          args: { filePath: "/test.ts" },
          result: "Success",
        },
      };

      const result = await distiller.distill(event);
      expect(result.memory!.sessionId).toBe("specific-session-123");
    });
  });

  describe("importance handling", () => {
    it("includes importance in distilled memory", async () => {
      const event: RawEvent = {
        type: "tool_use",
        timestamp: Date.now(),
        sessionId: "test",
        data: {
          tool: "Write",
          args: { filePath: "/important.ts" },
          result: "Success",
        },
      };

      const result = await distiller.distill(event);
      expect(result.memory!.importance).toBeGreaterThan(0);
    });
  });
});
