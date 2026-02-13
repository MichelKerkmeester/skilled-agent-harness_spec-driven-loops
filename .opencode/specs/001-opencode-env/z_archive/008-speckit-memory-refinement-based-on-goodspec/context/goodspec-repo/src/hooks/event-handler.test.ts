/**
 * Tests for Event Handler
 * @module hooks/event-handler.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createEventHandler } from "./event-handler.js";
import {
  createMockPluginContext,
  createMockMemoryManager,
} from "../test-utils.js";
import type { PluginContext } from "../core/types.js";

describe("createEventHandler", () => {
  let ctx: PluginContext;
  let testDir: string;

  beforeEach(() => {
    testDir = `/tmp/event-handler-test-${Date.now()}`;
    ctx = createMockPluginContext({
      testDir,
      config: {
        memory: {
          enabled: true,
          capture: {
            enabled: true,
            capturePhaseChanges: true,
          },
        },
      },
      includeMemory: true,
    });
  });

  describe("handler creation", () => {
    it("creates a function", () => {
      const handler = createEventHandler(ctx);
      expect(typeof handler).toBe("function");
    });
  });

  describe("event handling", () => {
    it("ignores null events", async () => {
      const handler = createEventHandler(ctx);
      await handler({ event: null as any });
      // Should not throw
    });

    it("ignores non-object events", async () => {
      const handler = createEventHandler(ctx);
      await handler({ event: "string" as any });
      // Should not throw
    });

    it("ignores unknown event types", async () => {
      const handler = createEventHandler(ctx);
      await handler({ event: { type: "unknown.event" } as any });
      // Should not throw
    });
  });

  describe("session.created event", () => {
    it("updates workflow last activity", async () => {
      const handler = createEventHandler(ctx);
      const initialActivity = ctx.stateManager.getState().workflow.lastActivity;

      await new Promise(r => setTimeout(r, 10));

      await handler({
        event: {
          type: "session.created",
          properties: { sessionID: "new-session" },
        } as any,
      });

      const newActivity = ctx.stateManager.getState().workflow.lastActivity;
      expect(new Date(newActivity).getTime()).toBeGreaterThanOrEqual(
        new Date(initialActivity).getTime()
      );
    });

    it("appends to history", async () => {
      let historyEntry: any;
      ctx.stateManager.appendHistory = (entry) => {
        historyEntry = entry;
      };

      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.created",
          properties: { sessionID: "new-session" },
        } as any,
      });

      expect(historyEntry).toBeDefined();
      expect(historyEntry.type).toBe("phase_change");
      expect(historyEntry.sessionId).toBe("new-session");
      expect(historyEntry.data.event).toBe("session.created");
    });

    it("captures session start to memory when enabled", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.created",
          properties: { sessionID: "new-session" },
        } as any,
      });

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
      expect(recent[0].type).toBe("session_summary");
      expect(recent[0].title).toBe("Session started");
    });

    it("does not capture to memory when capturePhaseChanges is false", async () => {
      const ctxNoCapture = createMockPluginContext({
        testDir,
        config: {
          memory: {
            enabled: true,
            capture: {
              enabled: true,
              capturePhaseChanges: false,
            },
          },
        },
        includeMemory: true,
      });

      const handler = createEventHandler(ctxNoCapture);

      await handler({
        event: {
          type: "session.created",
          properties: { sessionID: "new-session" },
        } as any,
      });

      const recent = await ctxNoCapture.memoryManager!.getRecent(1);
      expect(recent.length).toBe(0);
    });

    it("handles memory save errors gracefully", async () => {
      const errorMemory = createMockMemoryManager();
      errorMemory.save = async () => {
        throw new Error("Save failed");
      };
      ctx.memoryManager = errorMemory;

      const handler = createEventHandler(ctx);

      // Should not throw
      await expect(
        handler({
          event: {
            type: "session.created",
            properties: { sessionID: "new-session" },
          } as any,
        })
      ).resolves.toBeUndefined();
    });

    it("handles missing sessionID", async () => {
      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.created",
          properties: {},
        } as any,
      });

      // Should not throw
    });
  });

  describe("session.deleted event", () => {
    it("appends to history", async () => {
      let historyEntry: any;
      ctx.stateManager.appendHistory = (entry) => {
        historyEntry = entry;
      };

      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.deleted",
          properties: { sessionID: "deleted-session" },
        } as any,
      });

      expect(historyEntry).toBeDefined();
      expect(historyEntry.type).toBe("phase_change");
      expect(historyEntry.sessionId).toBe("deleted-session");
      expect(historyEntry.data.event).toBe("session.deleted");
    });

    it("captures session end summary to memory", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.deleted",
          properties: { sessionID: "deleted-session" },
        } as any,
      });

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
      expect(recent[0].type).toBe("session_summary");
      expect(recent[0].title).toBe("Session ended");
    });

    it("includes recent activity count in summary", async () => {
      const mockMemory = createMockMemoryManager();
      // Pre-populate with some memories
      await mockMemory.save({
        type: "observation",
        title: "Previous observation",
        content: "Some content",
      });
      await mockMemory.save({
        type: "decision",
        title: "Previous decision",
        content: "Some decision",
      });

      ctx.memoryManager = mockMemory;

      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.deleted",
          properties: { sessionID: "deleted-session" },
        } as any,
      });

      // Get all recent memories and find the session summary
      const recent = await mockMemory.getRecent(10);
      const sessionSummary = recent.find(m => m.title === "Session ended");
      expect(sessionSummary).toBeDefined();
      expect(sessionSummary!.content).toContain("activities");
    });

    it("handles memory without recent activities", async () => {
      const mockMemory = createMockMemoryManager();
      // Override getRecent to return empty array, but allow saves
      const originalSave = mockMemory.save;
      let savedMemory: any = null;
      mockMemory.save = async (input) => {
        savedMemory = await originalSave(input);
        return savedMemory;
      };
      mockMemory.getRecent = async () => [];
      ctx.memoryManager = mockMemory;

      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.deleted",
          properties: { sessionID: "deleted-session" },
        } as any,
      });

      // The session summary should have been saved with "no tracked activities"
      expect(savedMemory).toBeDefined();
      expect(savedMemory.content).toContain("no tracked activities");
    });
  });

  describe("session.idle event", () => {
    it("handles idle event without errors", async () => {
      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.idle",
          properties: { sessionID: "idle-session" },
        } as any,
      });

      // Should not throw
    });

    it("does not update state for idle events", async () => {
      const initialState = ctx.stateManager.getState();
      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.idle",
          properties: { sessionID: "idle-session" },
        } as any,
      });

      // State should remain unchanged (except possibly lastActivity from hook setup)
      const currentState = ctx.stateManager.getState();
      expect(currentState.workflow.phase).toBe(initialState.workflow.phase);
    });
  });

  describe("without memory manager", () => {
    it("handles session.created without memory manager", async () => {
      const ctxNoMemory = createMockPluginContext({ testDir });
      delete ctxNoMemory.memoryManager;

      const handler = createEventHandler(ctxNoMemory);

      await handler({
        event: {
          type: "session.created",
          properties: { sessionID: "new-session" },
        } as any,
      });

      // Should not throw
    });

    it("handles session.deleted without memory manager", async () => {
      const ctxNoMemory = createMockPluginContext({ testDir });
      delete ctxNoMemory.memoryManager;

      const handler = createEventHandler(ctxNoMemory);

      await handler({
        event: {
          type: "session.deleted",
          properties: { sessionID: "deleted-session" },
        } as any,
      });

      // Should not throw
    });
  });

  describe("event without type", () => {
    it("handles event without type property", async () => {
      const handler = createEventHandler(ctx);

      await handler({
        event: { properties: { sessionID: "test" } } as any,
      });

      // Should handle as "unknown" type
    });
  });
});
