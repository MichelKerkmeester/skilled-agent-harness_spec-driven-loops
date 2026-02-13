/**
 * Memory Save Tool
 * Save important information to persistent memory
 * @module tools/memory-save
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";
import type { MemoryType } from "../../features/memory/types.js";

function normalizeImportance(value: number | undefined): number {
  if (value === undefined) {
    return 5;
  }

  if (value > 0 && value < 1) {
    return value * 10;
  }

  return value;
}

/**
 * Create the memory_save tool
 */
export function createMemorySaveTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: `Save important information to persistent memory.

Use this to remember:
- Decisions made and their reasoning
- User preferences and patterns discovered
- Important observations about the codebase
- Facts that should persist across sessions
- Code patterns and architectural decisions

The memory will be searchable and can be retrieved in future sessions.`,
    args: {
      title: tool.schema
        .string()
        .describe("Brief title summarizing the memory (max 100 chars)"),
      content: tool.schema
        .string()
        .describe("Detailed content of the memory"),
      type: tool.schema
        .enum(["observation", "decision", "note", "todo"])
        .optional()
        .describe("Type of memory: observation (default), decision, note, or todo"),
      facts: tool.schema
        .array(tool.schema.string())
        .optional()
        .describe("Atomic facts extracted from this memory (bullet points)"),
      concepts: tool.schema
        .array(tool.schema.string())
        .optional()
        .describe("Tags/concepts for categorization and search"),
      sourceFiles: tool.schema
        .array(tool.schema.string())
        .optional()
        .describe("Related file paths"),
      importance: tool.schema
        .number()
        .optional()
        .describe("Importance level 1-10 (default: 5). Values between 0-1 are scaled to 1-10"),
    },
    async execute(args, context: ToolContext): Promise<string> {
      try {
        // Validate importance range
        const importance = normalizeImportance(args.importance);
        if (importance < 1 || importance > 10) {
          return "Error: Importance must be between 1 and 10";
        }

        // Validate title length
        if (args.title.length > 100) {
          return "Error: Title must be 100 characters or less";
        }

        // Check if memory manager is available
        if (!ctx.memoryManager) {
          return "Error: Memory system is not initialized. Run goop_setup first.";
        }

        const memory = await ctx.memoryManager.save({
          type: (args.type ?? "observation") as MemoryType,
          title: args.title,
          content: args.content,
          facts: args.facts ?? [],
          concepts: args.concepts ?? [],
          sourceFiles: args.sourceFiles ?? [],
          importance,
          sessionId: context.sessionID,
        });

        const lines = [
          `Memory saved successfully!`,
          ``,
          `**ID:** ${memory.id}`,
          `**Type:** ${memory.type}`,
          `**Title:** ${memory.title}`,
          `**Importance:** ${memory.importance}/10`,
        ];

        if (memory.facts.length > 0) {
          lines.push(`**Facts:** ${memory.facts.length} recorded`);
        }
        if (memory.concepts.length > 0) {
          lines.push(`**Concepts:** ${memory.concepts.join(", ")}`);
        }

        return lines.join("\n");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `Error saving memory: ${message}`;
      }
    },
  });
}
