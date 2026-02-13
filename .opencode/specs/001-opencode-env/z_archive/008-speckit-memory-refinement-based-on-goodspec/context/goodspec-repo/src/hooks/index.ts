/**
 * Hooks barrel export and factory
 * @module hooks
 */

import type { Hooks, PluginInput } from "@opencode-ai/plugin";
import type { PluginContext } from "../core/types.js";
import { createChatMessageHook } from "./chat-message.js";
import { createToolLifecycleHooks } from "./tool-lifecycle.js";
import { createEventHandler } from "./event-handler.js";
import { createSystemTransformHook } from "./system-transform.js";
import { createCommandProcessor } from "./command-processor.js";
import { createOrchestratorEnforcementHooks } from "./orchestrator-enforcement.js";
import { createAutoProgressionHook } from "./auto-progression.js";
import { createCommentCheckerHooks } from "./comment-checker.js";
import { createContinuationEnforcer } from "./continuation-enforcer.js";

/**
 * Create all GoopSpec hooks
 * 
 * @param ctx - Plugin context with state manager, resolver, etc.
 * @param input - Optional PluginInput for hooks that need client access (continuation enforcer)
 */
export function createHooks(ctx: PluginContext, input?: PluginInput): Partial<Hooks> {
  const toolLifecycleHooks = createToolLifecycleHooks(ctx);
  const commandProcessorHooks = createCommandProcessor(ctx);
  const enforcementHooks = createOrchestratorEnforcementHooks(ctx);
  const autoProgressionHooks = createAutoProgressionHook(ctx);
  const commentCheckerHooks = createCommentCheckerHooks();
  
  // Create continuation enforcer if we have client access
  const continuationEnforcer = input 
    ? createContinuationEnforcer(ctx, input)
    : null;
  
  // Combine all tool.execute.before hooks
  const toolExecuteBeforeHooks = [
    commentCheckerHooks["tool.execute.before"],
  ].filter(
    (hook): hook is NonNullable<Hooks["tool.execute.before"]> => Boolean(hook)
  );
  
  // Combine all tool.execute.after hooks
  const toolExecuteAfterHooks = [
    toolLifecycleHooks["tool.execute.after"],
    commandProcessorHooks["tool.execute.after"],
    enforcementHooks["tool.execute.after"],
    autoProgressionHooks["tool.execute.after"],
    commentCheckerHooks["tool.execute.after"],
  ].filter(
    (hook): hook is NonNullable<Hooks["tool.execute.after"]> => Boolean(hook)
  );
  
  // Combine event handlers
  const baseEventHandler = createEventHandler(ctx);

  const hooks: Partial<Hooks> = {
    event: async (eventInput) => {
      // Run base event handler
      await baseEventHandler(eventInput);
      // Run continuation enforcer event handler
      if (continuationEnforcer) {
        await continuationEnforcer.handler(eventInput);
      }
    },
    "chat.message": createChatMessageHook(ctx),
    ...toolLifecycleHooks,
    ...commandProcessorHooks,
  };
  
  // Add permission.ask hook for orchestrator code blocking
  if (enforcementHooks["permission.ask"]) {
    // @ts-expect-error - permission.ask hook type may not be in Hooks interface
    hooks["permission.ask"] = enforcementHooks["permission.ask"];
  }

  if (toolExecuteBeforeHooks.length > 0) {
    hooks["tool.execute.before"] = async (input, output) => {
      for (const hook of toolExecuteBeforeHooks) {
        await hook(input, output);
      }
    };
  }

  if (toolExecuteAfterHooks.length > 0) {
    hooks["tool.execute.after"] = async (input, output) => {
      for (const hook of toolExecuteAfterHooks) {
        await hook(input, output);
      }
    };
  }

  // Add system transform hook for memory injection if enabled
  if (ctx.memoryManager && ctx.config.memory?.injection?.enabled !== false) {
    // @ts-expect-error - experimental hook not in type definitions
    hooks["experimental.chat.system.transform"] = createSystemTransformHook(ctx);
  }

  return hooks;
}

export { createChatMessageHook } from "./chat-message.js";
export { createToolLifecycleHooks } from "./tool-lifecycle.js";
export { createCommandProcessor } from "./command-processor.js";
export { createEventHandler } from "./event-handler.js";
export { createSystemTransformHook } from "./system-transform.js";
export { 
  createContinuationEnforcer,
  isContinuationActive,
  getPromptCount,
  resetContinuation,
  updateTodoCount
} from "./continuation-enforcer.js";
export type { ContinuationConfig } from "./continuation-enforcer.js";
export { 
  createCommentCheckerHooks,
  analyzeComments,
  formatAnalysis
} from "./comment-checker.js";
export type { CommentCheckerConfig, CommentAnalysis } from "./comment-checker.js";
export {
  createOrchestratorEnforcementHooks,
  isOrchestrator,
  hasPendingDelegation,
  getPendingDelegation,
  clearPendingDelegation,
  wouldBlockPath,
} from "./orchestrator-enforcement.js";
export {
  createAutoProgressionHook,
  checkProgressionConditions,
} from "./auto-progression.js";
