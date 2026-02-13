/**
 * System Transform Hook
 * Injects memory context into agent system prompts
 * 
 * @module hooks/system-transform
 */

import type { PluginContext } from "../core/types.js";
import { log, logError } from "../shared/logger.js";
import { createMemoryContextBuilder } from "../features/memory/context-builder.js";
import { buildEnforcementContext } from "../features/enforcement/index.js";

type SystemTransformInput = {
  sessionID: string;
  agent?: string;
  model?: {
    providerID: string;
    modelID: string;
  };
};

type SystemTransformOutput = {
  system: string;
};

/**
 * Create the experimental.chat.system.transform hook
 * 
 * This hook injects relevant memory context into the system prompt
 * before each chat completion request.
 */
export function createSystemTransformHook(ctx: PluginContext) {
  return async (
    input: SystemTransformInput,
    output: SystemTransformOutput
  ): Promise<SystemTransformOutput> => {
    log("System transform hook triggered", {
      agent: input.agent,
      sessionID: input.sessionID,
    });

    try {
      const state = ctx.stateManager.getState();
      const enforcementContext = buildEnforcementContext(state);

      let memoryContext = "";
      if (ctx.memoryManager && ctx.config.memory?.injection?.enabled !== false) {
        // Create context builder with config
        const builder = createMemoryContextBuilder(ctx.memoryManager, {
          budgetTokens: ctx.config.memory?.injection?.budgetTokens ?? 800,
          format: (ctx.config.memory?.injection?.format ?? "structured") as "timeline" | "bullets" | "structured",
          priorityTypes: ctx.config.memory?.injection?.priorityTypes ?? ["decision", "observation", "todo"],
          includeDecisions: true,
          includeRecentActivity: true,
        });

        const currentPhase = state.workflow.phase;
        if (currentPhase) {
          memoryContext = await builder.buildPhaseContext(currentPhase);
        } else {
          memoryContext = await builder.buildRecentContext(10);
        }
      }

      if (!enforcementContext && (!memoryContext || memoryContext.trim().length === 0)) {
        log("No enforcement or memory context to inject");
        return output;
      }

      let enhancedSystem = output.system;
      if (enforcementContext.trim().length > 0) {
        enhancedSystem = `${enhancedSystem}

${enforcementContext}`;
      }

      if (memoryContext.trim().length > 0) {
        enhancedSystem = `${enhancedSystem}

## Persistent Memory Context

The following memories are relevant to this session. Use them to maintain continuity and avoid repeating mistakes.

${memoryContext}

Use the memory tools (memory_save, memory_search, memory_note, memory_decision) to store and retrieve information for future sessions.`;
      }

      log("System context injected", {
        originalLength: output.system.length,
        enforcementLength: enforcementContext.length,
        memoryLength: memoryContext.length,
        enhancedLength: enhancedSystem.length,
      });

      return {
        system: enhancedSystem,
      };
    } catch (error) {
      logError("Failed to inject system context", error);
      // Return original on error - don't break the system
      return output;
    }
  };
}
