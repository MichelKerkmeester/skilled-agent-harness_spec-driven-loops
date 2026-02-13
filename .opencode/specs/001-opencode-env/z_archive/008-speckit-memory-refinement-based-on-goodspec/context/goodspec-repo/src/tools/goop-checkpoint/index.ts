/**
 * GoopSpec Checkpoint Tool
 * Save and restore execution checkpoints
 * 
 * @module tools/goop-checkpoint
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";

/**
 * Create the goop_checkpoint tool
 */
export function createGoopCheckpointTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Save, load, or list execution checkpoints for resuming work later",
    args: {
      action: tool.schema.enum(["save", "load", "list"]),
      id: tool.schema.string().optional(),
      context: tool.schema.record(tool.schema.string(), tool.schema.unknown()).optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      switch (args.action) {
        case "list": {
          const checkpoints = ctx.stateManager.listCheckpoints();
          if (checkpoints.length === 0) {
            return "No checkpoints saved.";
          }
          return `# Saved Checkpoints\n\n${checkpoints.map(id => `- ${id}`).join("\n")}`;
        }

        case "save": {
          if (!args.id) {
            return "Error: 'id' is required for save action.";
          }
          
          const state = ctx.stateManager.getState();
          ctx.stateManager.saveCheckpoint(args.id, {
            timestamp: new Date().toISOString(),
            state,
            context: args.context as Record<string, unknown> | undefined,
          });
          
          return `Checkpoint saved: ${args.id}`;
        }

        case "load": {
          if (!args.id) {
            return "Error: 'id' is required for load action.";
          }
          
          const checkpoint = ctx.stateManager.loadCheckpoint(args.id);
          if (!checkpoint) {
            return `Checkpoint "${args.id}" not found.`;
          }
          
          // Restore state
          ctx.stateManager.setState(checkpoint.state);
          
          const lines = [
            `# Checkpoint Loaded: ${args.id}`,
            "",
            `**Saved at:** ${checkpoint.timestamp}`,
            // Deprecated field retained for backward compatibility
            `**Named Phase:** ${checkpoint.state.workflow.currentPhase || "None"}`,
            `**Workflow Stage:** ${checkpoint.state.workflow.phase || "idle"}`,
            `**Mode:** ${checkpoint.state.workflow.mode || "standard"}`,
          ];
          
          if (checkpoint.context) {
            lines.push("", "**Context:**", "```json", JSON.stringify(checkpoint.context, null, 2), "```");
          }
          
          return lines.join("\n");
        }

        default:
          return "Unknown action.";
      }
    },
  });
}
