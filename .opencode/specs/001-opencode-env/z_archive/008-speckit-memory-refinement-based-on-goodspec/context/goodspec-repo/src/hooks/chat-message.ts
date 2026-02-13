/**
 * Chat Message Hook
 * Tracks session activity and provides memory context injection
 * 
 * @module hooks/chat-message
 */

import type { UserMessage, Part } from "@opencode-ai/sdk";
import type { PluginContext, RawEvent } from "../core/types.js";
import { log, logError } from "../shared/logger.js";
import {
  shouldCapture,
  sanitizeContent,
  DEFAULT_CAPTURE_CONFIG,
} from "../features/memory/capture.js";

type ChatMessageInput = {
  sessionID: string;
  agent?: string;
  model?: {
    providerID: string;
    modelID: string;
  };
  messageID?: string;
  variant?: string;
};

type ChatMessageOutput = {
  message: UserMessage;
  parts: Part[];
};

/**
 * Extract text content from message parts
 */
function extractTextFromParts(parts: Part[]): string {
  return parts
    .filter((p): p is Part & { type: "text" } => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("\n");
}

/**
 * Create the chat.message hook
 * 
 * This implementation:
 * - Tracks session activity in state
 * - Optionally captures user messages to memory
 * - Provides hook for memory context (actual injection in agent-factory)
 */
export function createChatMessageHook(ctx: PluginContext) {
  // Get capture config
  const captureConfig = {
    ...DEFAULT_CAPTURE_CONFIG,
    ...ctx.config.memory?.capture,
  };

  return async (input: ChatMessageInput, output: ChatMessageOutput): Promise<void> => {
    log("Chat message received", { 
      sessionID: input.sessionID,
      agent: input.agent,
      messageID: input.messageID,
    });

    // Update last activity timestamp
    ctx.stateManager.updateWorkflow({
      lastActivity: new Date().toISOString(),
    });

    // Track message in history
    ctx.stateManager.appendHistory({
      timestamp: new Date().toISOString(),
      type: "tool_call",
      sessionId: input.sessionID,
      data: {
        type: "chat_message",
        agent: input.agent,
        messageID: input.messageID,
      },
    });

    // Capture user message to memory if enabled
    if (ctx.memoryManager && captureConfig.captureMessages) {
      const messageContent = extractTextFromParts(output.parts);
      
      if (messageContent.trim().length > 0) {
        const rawEvent: RawEvent = {
          type: "user_message",
          timestamp: Date.now(),
          sessionId: input.sessionID,
          data: {
            content: messageContent,
            role: "user",
            agent: input.agent,
          },
        };

        if (shouldCapture(rawEvent, captureConfig)) {
          try {
            // Check if this is a significant message (questions, commands, requirements)
            const isSignificant = 
              messageContent.includes("?") ||
              messageContent.startsWith("/") ||
              messageContent.length > 100 ||
              /\b(must|should|need|require|want|implement|create|build|fix|debug)\b/i.test(messageContent);

            if (isSignificant) {
              const sanitized = sanitizeContent(messageContent);
              
              await ctx.memoryManager.save({
                type: "user_prompt",
                title: sanitized.slice(0, 80) + (sanitized.length > 80 ? "..." : ""),
                content: sanitized.slice(0, 2000),
                importance: messageContent.includes("?") ? 6 : 5,
                sessionId: input.sessionID,
                phase: ctx.stateManager.getState().workflow.phase,
              });

              log("User message captured to memory", {
                length: messageContent.length,
                agent: input.agent,
              });
            }
          } catch (error) {
            logError("Failed to capture user message to memory", error);
          }
        }
      }
    }
  };
}
