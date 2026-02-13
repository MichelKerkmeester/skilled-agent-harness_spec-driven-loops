/**
 * Memory Forget Tool
 * Delete memories by ID or search query
 * @module tools/memory-forget
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";

/**
 * Create the memory_forget tool
 */
export function createMemoryForgetTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: `Delete memories from persistent storage.

Use this to:
- Remove outdated information
- Delete incorrect memories
- Clean up temporary notes
- Remove sensitive data that was accidentally stored

WARNING: Deleted memories cannot be recovered.`,
    args: {
      id: tool.schema
        .number()
        .optional()
        .describe("Specific memory ID to delete"),
      query: tool.schema
        .string()
        .optional()
        .describe("Search query to find and delete matching memories (requires confirmation)"),
      confirm: tool.schema
        .boolean()
        .optional()
        .describe("Set to true to confirm deletion when using query"),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      try {
        // Check if memory manager is available
        if (!ctx.memoryManager) {
          return "Error: Memory system is not initialized. Run goop_setup first.";
        }

        // Must provide either id or query
        if (args.id === undefined && !args.query) {
          return "Error: Must provide either 'id' or 'query' to delete memories.";
        }

        // Delete by ID
        if (args.id !== undefined) {
          const deleted = await ctx.memoryManager.delete(args.id);
          if (deleted) {
            return `Memory ${args.id} deleted successfully.`;
          } else {
            return `Memory ${args.id} not found.`;
          }
        }

        // Delete by query
        if (args.query) {
          // First, search to show what will be deleted
          const results = await ctx.memoryManager.search({
            query: args.query,
            limit: 10,
            includePrivate: true,
          });

          if (!results || results.length === 0) {
            return `No memories found matching: "${args.query}"`;
          }

          // If not confirmed, show what would be deleted
          if (!args.confirm) {
            const lines = [
              `Found ${results.length} memor${results.length === 1 ? "y" : "ies"} matching: "${args.query}"`,
              ``,
              `**Will delete:**`,
            ];

            results.forEach((result) => {
              lines.push(
                `- [${result.memory.id}] ${result.memory.title} (${result.memory.type})`
              );
            });

            lines.push(
              ``,
              `To confirm deletion, call memory_forget with query="${args.query}" and confirm=true`
            );

            return lines.join("\n");
          }

          // Confirmed - delete all matching
          let deletedCount = 0;
          for (const result of results) {
            const deleted = await ctx.memoryManager.delete(result.memory.id);
            if (deleted) deletedCount++;
          }

          return `Deleted ${deletedCount} memor${deletedCount === 1 ? "y" : "ies"} matching: "${args.query}"`;
        }

        return "Error: Unexpected state in memory_forget";
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `Error deleting memory: ${message}`;
      }
    },
  });
}
