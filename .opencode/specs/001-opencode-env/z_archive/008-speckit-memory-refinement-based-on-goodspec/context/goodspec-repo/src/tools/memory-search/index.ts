/**
 * Memory Search Tool
 * Search persistent memory for relevant information
 * @module tools/memory-search
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";
import type { MemoryType, SearchResult } from "../../features/memory/types.js";

/**
 * Format a search result for display
 */
function formatResult(result: SearchResult, index: number): string {
  const { memory, score, matchType } = result;
  const date = new Date(memory.createdAt * 1000).toLocaleDateString();
  
  const lines = [
    `### [${index + 1}] ${memory.title}`,
    `**Type:** ${memory.type} | **Score:** ${score.toFixed(2)} (${matchType}) | **Date:** ${date}`,
    ``,
    memory.content,
  ];

  if (memory.facts.length > 0) {
    lines.push(``, `**Facts:**`);
    memory.facts.forEach((fact) => lines.push(`- ${fact}`));
  }

  if (memory.concepts.length > 0) {
    lines.push(``, `**Concepts:** ${memory.concepts.join(", ")}`);
  }

  if (memory.sourceFiles.length > 0) {
    lines.push(``, `**Files:** ${memory.sourceFiles.join(", ")}`);
  }

  return lines.join("\n");
}

/**
 * Create the memory_search tool
 */
export function createMemorySearchTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: `Search your persistent memory for relevant information.

Use this to recall:
- Previous decisions and their context
- User preferences you've learned
- Past observations about the codebase
- Historical context for current work
- Code patterns and architectural decisions

Searches use both keyword matching and semantic similarity.`,
    args: {
      query: tool.schema
        .string()
        .describe("Natural language search query"),
      limit: tool.schema
        .number()
        .optional()
        .describe("Max results to return (default: 5, max: 20)"),
      types: tool.schema
        .array(
          tool.schema.enum([
            "observation",
            "decision",
            "note",
            "todo",
            "session_summary",
          ])
        )
        .optional()
        .describe("Filter by memory types"),
      concepts: tool.schema
        .array(tool.schema.string())
        .optional()
        .describe("Filter by concept tags"),
      minImportance: tool.schema
        .number()
        .optional()
        .describe("Minimum importance level (1-10)"),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      try {
        // Check if memory manager is available
        if (!ctx.memoryManager) {
          return "Error: Memory system is not initialized. Run goop_setup first.";
        }

        // Validate and cap limit
        const limit = Math.min(Math.max(args.limit ?? 5, 1), 20);

        const results = await ctx.memoryManager.search({
          query: args.query,
          limit,
          types: args.types as MemoryType[] | undefined,
          concepts: args.concepts,
          minImportance: args.minImportance,
        });

        if (!results || results.length === 0) {
          return `No memories found matching: "${args.query}"\n\nTip: Try broader search terms or different keywords.`;
        }

        const lines = [
          `# Memory Search Results`,
          `Found ${results.length} matching memor${results.length === 1 ? "y" : "ies"} for: "${args.query}"`,
          ``,
        ];

        results.forEach((result, index) => {
          lines.push(formatResult(result, index));
          lines.push(``, `---`, ``);
        });

        return lines.join("\n");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `Error searching memory: ${message}`;
      }
    },
  });
}
