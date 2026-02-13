/**
 * Memory Decision Tool
 * Record an important decision with reasoning
 * @module tools/memory-decision
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";

/**
 * Create the memory_decision tool
 */
export function createMemoryDecisionTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: `Record an important decision with its reasoning.

Use this to document:
- Architecture decisions
- Technology choices
- Design trade-offs
- User preference decisions
- Implementation approaches

Decisions are stored with high importance for future reference.`,
    args: {
      decision: tool.schema
        .string()
        .describe("The decision that was made (used as title)"),
      reasoning: tool.schema
        .string()
        .describe("Why this decision was made"),
      alternatives: tool.schema
        .array(tool.schema.string())
        .optional()
        .describe("Alternatives that were considered"),
      impact: tool.schema
        .enum(["low", "medium", "high"])
        .optional()
        .describe("Impact level of this decision (affects importance score)"),
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

        // Calculate importance based on impact
        const importance =
          args.impact === "high" ? 9 : args.impact === "medium" ? 7 : 5;

        // Build content with structured format
        const contentLines = [
          `## Decision`,
          args.decision,
          ``,
          `## Reasoning`,
          args.reasoning,
        ];

        if (args.alternatives?.length) {
          contentLines.push(
            ``,
            `## Alternatives Considered`,
            ...args.alternatives.map((alt) => `- ${alt}`)
          );
        }

        contentLines.push(
          ``,
          `## Impact`,
          `${args.impact ?? "medium"}`
        );

        const memory = await ctx.memoryManager.save({
          type: "decision",
          title: args.decision.slice(0, 100),
          content: contentLines.join("\n"),
          facts: [args.decision],
          concepts: args.concepts ?? [],
          importance,
          sessionId: context.sessionID,
        });

        const lines = [
          `Decision recorded!`,
          ``,
          `**ID:** ${memory.id}`,
          `**Decision:** ${args.decision}`,
          `**Impact:** ${args.impact ?? "medium"}`,
          `**Importance:** ${importance}/10`,
        ];

        if (args.alternatives?.length) {
          lines.push(
            `**Alternatives:** ${args.alternatives.length} considered`
          );
        }

        return lines.join("\n");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `Error recording decision: ${message}`;
      }
    },
  });
}
