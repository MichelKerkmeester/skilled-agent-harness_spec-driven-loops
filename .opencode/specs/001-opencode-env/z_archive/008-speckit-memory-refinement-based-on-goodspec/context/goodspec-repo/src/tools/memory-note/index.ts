/**
 * Memory Note Tool
 * Quickly save a brief note to memory
 * @module tools/memory-note
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";

/**
 * Create the memory_note tool
 */
export function createMemoryNoteTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: `Quickly save a brief note to memory.

This is a simplified version of memory_save for quick captures.
Use this for:
- Quick observations
- Temporary reminders
- Brief insights
- Things to remember later`,
    args: {
      note: tool.schema
        .string()
        .describe("The note to save (will be used as both title and content)"),
      concepts: tool.schema
        .array(tool.schema.string())
        .optional()
        .describe("Tags/concepts for categorization"),
    },
    async execute(args, context: ToolContext): Promise<string> {
      try {
        // Check if memory manager is available
        if (!ctx.memoryManager) {
          return "Error: Memory system is not initialized. Run goop_setup first.";
        }

        // Use first 100 chars as title, full text as content
        const title = args.note.slice(0, 100);
        
        const memory = await ctx.memoryManager.save({
          type: "note",
          title,
          content: args.note,
          concepts: args.concepts ?? [],
          importance: 4, // Notes are lower priority by default
          sessionId: context.sessionID,
        });

        return `Note saved (ID: ${memory.id}): ${title}${args.note.length > 100 ? "..." : ""}`;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `Error saving note: ${message}`;
      }
    },
  });
}
