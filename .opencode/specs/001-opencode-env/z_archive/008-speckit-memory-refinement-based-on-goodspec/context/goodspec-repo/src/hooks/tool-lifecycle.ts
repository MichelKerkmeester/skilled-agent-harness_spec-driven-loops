/**
 * Tool Lifecycle Hooks
 * Tracks tool calls in history and captures to memory
 * 
 * @module hooks/tool-lifecycle
 */

import type { PluginContext, RawEvent } from "../core/types.js";
import { log, logError } from "../shared/logger.js";
import {
  shouldCapture,
  estimateImportance,
  sanitizeContent,
  getMemoryTypeForEvent,
  DEFAULT_CAPTURE_CONFIG,
} from "../features/memory/capture.js";

type ToolExecuteBeforeInput = {
  tool: string;
  sessionID: string;
  callID: string;
};

type ToolExecuteBeforeOutput = {
  args: unknown;
};

type ToolExecuteAfterInput = {
  tool: string;
  sessionID: string;
  callID: string;
};

type ToolExecuteAfterOutput = {
  title: string;
  output: string;
  metadata: unknown;
};

// Store tool args temporarily between before/after calls
const pendingToolCalls = new Map<string, { tool: string; args: unknown; startTime: number }>();

/**
 * Create tool lifecycle hooks
 * 
 * Returns both before and after hooks for tool execution
 * Includes auto-capture to memory system for important tool calls
 */
export function createToolLifecycleHooks(ctx: PluginContext) {
  // Get capture config from plugin config or use defaults
  const captureConfig = {
    ...DEFAULT_CAPTURE_CONFIG,
    ...ctx.config.memory?.capture,
  };

  return {
    "tool.execute.before": async (
      input: ToolExecuteBeforeInput,
      output: ToolExecuteBeforeOutput
    ): Promise<void> => {
      log("Tool execute before", {
        tool: input.tool,
        sessionID: input.sessionID,
        callID: input.callID,
      });

      // Store args for the after hook to use when capturing
      pendingToolCalls.set(input.callID, {
        tool: input.tool,
        args: output.args,
        startTime: Date.now(),
      });

      // Track tool call start in history
      ctx.stateManager.appendHistory({
        timestamp: new Date().toISOString(),
        type: "tool_call",
        sessionId: input.sessionID,
        data: {
          phase: "before",
          tool: input.tool,
          callID: input.callID,
        },
      });
    },

    "tool.execute.after": async (
      input: ToolExecuteAfterInput,
      output: ToolExecuteAfterOutput
    ): Promise<void> => {
      log("Tool execute after", {
        tool: input.tool,
        sessionID: input.sessionID,
        callID: input.callID,
        title: output.title,
      });

      // Track tool call completion in history
      ctx.stateManager.appendHistory({
        timestamp: new Date().toISOString(),
        type: "tool_call",
        sessionId: input.sessionID,
        data: {
          phase: "after",
          tool: input.tool,
          callID: input.callID,
          title: output.title,
        },
      });

      // Update last activity
      ctx.stateManager.updateWorkflow({
        lastActivity: new Date().toISOString(),
      });

      // Get stored args from before hook
      const pending = pendingToolCalls.get(input.callID);
      pendingToolCalls.delete(input.callID);

      // Note: Continuation enforcer and comment checker are now handled by dedicated hooks
      // in hooks/index.ts that properly integrate with the tool.execute.after chain

      // Auto-capture to memory if enabled and tool is worth capturing
      if (ctx.memoryManager && captureConfig.enabled) {
        const rawEvent: RawEvent = {
          type: "tool_use",
          timestamp: Date.now(),
          sessionId: input.sessionID,
          data: {
            tool: input.tool,
            args: pending?.args ?? {},
            result: output.output?.slice(0, 2000) ?? "",
            title: output.title,
            duration: pending ? Date.now() - pending.startTime : 0,
          },
        };

        // Check if this tool call should be captured
        if (shouldCapture(rawEvent, captureConfig)) {
          const importance = estimateImportance(rawEvent);
          
          // Only capture if importance meets threshold
          if (importance >= captureConfig.minImportanceThreshold) {
            try {
              // Use distill if available (LLM-based), otherwise direct save
              if (ctx.memoryManager.distill) {
                await ctx.memoryManager.distill(rawEvent);
              } else {
                // Direct save with extracted info
                const memoryType = getMemoryTypeForEvent(rawEvent);
                const content = sanitizeContent(
                  `Tool: ${input.tool}\n` +
                  `Result: ${output.output?.slice(0, 1000) ?? "No output"}`
                );

                await ctx.memoryManager.save({
                  type: memoryType,
                  title: output.title || `${input.tool} execution`,
                  content,
                  importance,
                  sessionId: input.sessionID,
                  phase: ctx.stateManager.getState().workflow.phase,
                });
              }
              
              log("Tool call captured to memory", {
                tool: input.tool,
                importance,
              });
            } catch (error) {
              logError("Failed to capture tool call to memory", error);
              // Don't fail the tool execution
            }
          }
        }
      }
    },
  };
}
