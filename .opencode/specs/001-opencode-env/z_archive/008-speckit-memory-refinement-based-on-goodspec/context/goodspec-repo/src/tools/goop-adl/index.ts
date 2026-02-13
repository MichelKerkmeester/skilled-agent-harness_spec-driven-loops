/**
 * GoopSpec ADL Tool
 * Read and append to Automated Decision Log
 * 
 * @module tools/goop-adl
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ADLEntry, ToolContext } from "../../core/types.js";

/**
 * Create the goop_adl tool
 */
export function createGoopAdlTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Read or append to the Automated Decision Log (ADL). Use 'read' to view the log, or 'append' to add a new entry.",
    args: {
      action: tool.schema.enum(["read", "append"]),
      type: tool.schema.enum(["decision", "deviation", "observation"]).optional(),
      description: tool.schema.string().optional(),
      entry_action: tool.schema.string().optional(),
      rule: tool.schema.number().optional(),
      files: tool.schema.array(tool.schema.string()).optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      if (args.action === "read") {
        return ctx.stateManager.getADL();
      }

      // Append action
      if (!args.type || !args.description || !args.entry_action) {
        return "Error: For append action, 'type', 'description', and 'entry_action' are required.";
      }

      const entry: ADLEntry = {
        timestamp: new Date().toISOString(),
        type: args.type,
        description: args.description,
        action: args.entry_action,
        rule: args.rule,
        files: args.files,
      };

      ctx.stateManager.appendADL(entry);
      return `ADL entry added: [${entry.type.toUpperCase()}] ${entry.description}`;
    },
  });
}
