/**
 * Event Handler
 * Handles session and system events, captures to memory
 * 
 * @module hooks/event-handler
 */

import type { Event } from "@opencode-ai/sdk";
import type { PluginContext } from "../core/types.js";
import { log, logError, logEvent } from "../shared/logger.js";

/**
 * Create the event handler
 * 
 * Handles events:
 * - session.created
 * - session.deleted
 * - session.idle
 * - etc.
 */
export function createEventHandler(ctx: PluginContext) {
  return async (input: { event: Event }): Promise<void> => {
    const event = input.event;

    // Type guard for event types
    if (!event || typeof event !== "object") {
      return;
    }

    // Handle different event types
    const eventType = "type" in event ? (event as { type: string }).type : "unknown";

    // Log all events to file for debugging
    logEvent(eventType, { properties: (event as { properties?: unknown }).properties });

    switch (eventType) {
      case "session.created":
        await handleSessionCreated(ctx, event as { type: string; properties?: { sessionID?: string } });
        break;
      
      case "session.deleted":
        await handleSessionDeleted(ctx, event as { type: string; properties?: { sessionID?: string } });
        break;
      
      case "session.idle":
        await handleSessionIdle(ctx, event as { type: string; properties?: { sessionID?: string } });
        break;
      
      // Ignore other events silently
      default:
        break;
    }
  };
}

/**
 * Handle session created event
 */
async function handleSessionCreated(
  ctx: PluginContext,
  event: { type: string; properties?: { sessionID?: string } }
): Promise<void> {
  const sessionID = event.properties?.sessionID;
  
  log("Session created", { sessionID });

  // Update workflow status
  ctx.stateManager.updateWorkflow({
    lastActivity: new Date().toISOString(),
  });

  // Track in history
  ctx.stateManager.appendHistory({
    timestamp: new Date().toISOString(),
    type: "phase_change",
    sessionId: sessionID,
    data: {
      event: "session.created",
    },
  });

  // Capture session start to memory if enabled
  if (ctx.memoryManager && ctx.config.memory?.capture?.capturePhaseChanges !== false) {
    try {
      await ctx.memoryManager.save({
        type: "session_summary",
        title: "Session started",
        content: `New session started at ${new Date().toISOString()}`,
        importance: 3,
        sessionId: sessionID,
        phase: ctx.stateManager.getState().workflow.phase,
      });
    } catch (error) {
      logError("Failed to capture session start to memory", error);
    }
  }
}

/**
 * Handle session deleted event
 */
async function handleSessionDeleted(
  ctx: PluginContext,
  event: { type: string; properties?: { sessionID?: string } }
): Promise<void> {
  const sessionID = event.properties?.sessionID;
  
  log("Session deleted", { sessionID });

  // Track in history
  ctx.stateManager.appendHistory({
    timestamp: new Date().toISOString(),
    type: "phase_change",
    sessionId: sessionID,
    data: {
      event: "session.deleted",
    },
  });

  // Capture session end summary to memory
  if (ctx.memoryManager && ctx.config.memory?.capture?.capturePhaseChanges !== false) {
    try {
      // Get session summary from recent memories
      const recentMemories = await ctx.memoryManager.getRecent(5);
      const summary = recentMemories.length > 0
        ? `Session completed with ${recentMemories.length} recent activities. Last activity: ${recentMemories[0]?.title ?? "unknown"}`
        : "Session completed with no tracked activities";

      await ctx.memoryManager.save({
        type: "session_summary",
        title: "Session ended",
        content: summary,
        importance: 4,
        sessionId: sessionID,
        phase: ctx.stateManager.getState().workflow.phase,
      });
    } catch (error) {
      logError("Failed to capture session end to memory", error);
    }
  }
}

/**
 * Handle session idle event
 */
async function handleSessionIdle(
  _ctx: PluginContext,
  event: { type: string; properties?: { sessionID?: string } }
): Promise<void> {
  const sessionID = event.properties?.sessionID;
  
  log("Session idle", { sessionID });

  // Track in history (optional - may create too many entries)
  // For now, just log - no state update needed for idle
}
