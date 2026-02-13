/**
 * GoopSpec Skill Tool
 * Load skill content for injection into agent context
 * 
 * @module tools/goop-skill
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, SkillDefinition, ToolContext } from "../../core/types.js";

/**
 * Format skill info for listing
 */
function formatSkillInfo(skill: SkillDefinition): string {
  return `- **${skill.name}**: ${skill.description}${skill.category ? ` (${skill.category})` : ""}`;
}

/**
 * Create the goop_skill tool
 */
export function createGoopSkillTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Load a skill to get specialized knowledge and guidance. Skills provide step-by-step instructions for specific tasks.",
    args: {
      name: tool.schema.string().optional(),
      list: tool.schema.boolean().optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      // List all skills
      if (args.list || !args.name) {
        const skills = ctx.resolver.resolveAll("skill");
        
        if (skills.length === 0) {
          return "No skills available.";
        }
        
        const skillDefs: SkillDefinition[] = skills.map(s => ({
          name: s.name,
          description: s.frontmatter.description as string || "",
          category: s.frontmatter.category as string | undefined,
          triggers: s.frontmatter.triggers as string[] | undefined,
          version: s.frontmatter.version as string | undefined,
          content: s.body,
        }));
        
        const lines = ["# Available Skills\n"];
        for (const skill of skillDefs) {
          lines.push(formatSkillInfo(skill));
        }
        
        return lines.join("\n");
      }
      
      // Load specific skill
      // Try direct match first
      let skill = ctx.resolver.resolve("skill", args.name);
      
      // Try with /skill.md suffix
      if (!skill) {
        skill = ctx.resolver.resolve("skill", `${args.name}/skill`);
      }
      
      if (!skill) {
        const available = ctx.resolver.resolveAll("skill").map(s => s.name);
        return `Skill "${args.name}" not found.\n\nAvailable skills: ${available.join(", ")}`;
      }
      
      const lines = [
        `# Skill: ${skill.frontmatter.name || skill.name}`,
        "",
      ];
      
      if (skill.frontmatter.description) {
        lines.push(`**Description:** ${skill.frontmatter.description}`, "");
      }
      
      if (skill.frontmatter.category) {
        lines.push(`**Category:** ${skill.frontmatter.category}`, "");
      }
      
      lines.push("---", "", skill.body);
      
      return lines.join("\n");
    },
  });
}
