/**
 * GoopSpec Slash Command Tool
 * Load and execute slash commands with automatic agent spawning
 * 
 * Commands with `spawn: true` and `agent: <name>` will trigger
 * automatic delegation to the specified agent.
 * 
 * @module tools/slashcommand
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, CommandDefinition, ToolContext } from "../../core/types.js";
import { log } from "../../shared/logger.js";

/**
 * Build description with available commands
 */
function buildDescription(ctx: PluginContext): string {
  const commands = ctx.resolver.resolveAll("command");
  
  const commandList = commands
    .map(c => {
      const hint = c.frontmatter["argument-hint"] || "";
      const desc = c.frontmatter.description || "";
      return `- /${c.name}${hint ? ` ${hint}` : ""}: ${desc}`;
    })
    .join("\n");
  
  return `Execute a GoopSpec slash command. Available commands:\n\n${commandList}`;
}

/**
 * Create the slashcommand tool
 */
export function createSlashcommandTool(ctx: PluginContext): ToolDefinition {
  // Cache description
  let cachedDescription: string | null = null;
  
  const getDescription = () => {
    if (!cachedDescription) {
      cachedDescription = buildDescription(ctx);
    }
    return cachedDescription;
  };
  
  return tool({
    get description() {
      return getDescription();
    },
    args: {
      command: tool.schema.string(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      const commands = ctx.resolver.resolveAll("command");
      
      // Normalize command name
      const cmdName = args.command.replace(/^\//, "").toLowerCase();
      
      // Find matching command
      const command = commands.find(
        c => c.name.toLowerCase() === cmdName
      );
      
      if (!command) {
        // Try partial match
        const partialMatches = commands.filter(
          c => c.name.toLowerCase().includes(cmdName)
        );
        
        if (partialMatches.length > 0) {
          const suggestions = partialMatches.map(c => `/${c.name}`).join(", ");
          return `Command "/${cmdName}" not found. Did you mean: ${suggestions}?`;
        }
        
        const available = commands.map(c => `/${c.name}`).join(", ");
        return `Command "/${cmdName}" not found.\n\nAvailable commands: ${available}`;
      }
      
      // Build command output
      const cmdDef: CommandDefinition = {
        name: command.name,
        description: command.frontmatter.description as string || "",
        argumentHint: command.frontmatter["argument-hint"] as string | undefined,
        model: command.frontmatter.model as string | undefined,
        agent: command.frontmatter.agent as string | undefined,
        content: command.body,
      };
      
      // Check if command should spawn an agent
      const shouldSpawn = command.frontmatter.spawn === true;
      const spawnAgent = cmdDef.agent;
      
      const lines = [
        `# /${cmdDef.name} Command`,
        "",
      ];
      
      if (cmdDef.description) {
        lines.push(`**Description:** ${cmdDef.description}`, "");
      }
      
      if (cmdDef.argumentHint) {
        lines.push(`**Usage:** /${cmdDef.name} ${cmdDef.argumentHint}`, "");
      }
      
      if (cmdDef.model) {
        lines.push(`**Model:** ${cmdDef.model}`, "");
      }
      
      if (cmdDef.agent) {
        lines.push(`**Agent:** ${cmdDef.agent}`, "");
      }
      
      lines.push("---", "", "## Instructions", "", cmdDef.content);
      
      // Add Next Steps section from frontmatter
      const nextStep = command.frontmatter["next-step"] as string | undefined;
      const nextCommand = command.frontmatter["next-command"] as string | undefined;
      const alternatives = command.frontmatter["alternatives"] as Array<{command: string; when: string}> | undefined;
      
      if (nextStep || nextCommand || alternatives) {
        lines.push("");
        lines.push("---");
        lines.push("");
        lines.push("## ➡️ Next Steps");
        lines.push("");
        
        if (nextStep && nextCommand) {
          lines.push(`**When this phase is complete:** ${nextStep}`);
          lines.push("");
          lines.push(`👉 Run \`${nextCommand}\` to proceed`);
          lines.push("");
        }
        
        if (alternatives && alternatives.length > 0) {
          lines.push("**Alternatives:**");
          for (const alt of alternatives) {
            lines.push(`- \`${alt.command}\` - ${alt.when}`);
          }
          lines.push("");
        }
      }
      
      // If command should spawn agent, append task invocation
      if (shouldSpawn && spawnAgent) {
        log("Slash command triggers agent spawn", {
          command: cmdDef.name,
          agent: spawnAgent,
        });
        
        // Extract any arguments after the command name
        const cmdArgs = args.command.replace(/^\/?\S+\s*/, "").trim();
        
        lines.push("");
        lines.push("---");
        lines.push("");
        lines.push("## 🚀 AUTOMATIC AGENT SPAWN");
        lines.push("");
        lines.push(`This command spawns the **${spawnAgent}** agent to handle the work.`);
        lines.push("");
        lines.push("**Execute immediately:**");
        lines.push("");
        lines.push("```");
        lines.push("task({");
        lines.push(`  subagent_type: "${spawnAgent}",`);
        lines.push(`  description: "${cmdDef.description}",`);
        lines.push("  prompt: `");
        lines.push(`    Execute /${cmdDef.name}${cmdArgs ? ` for: ${cmdArgs}` : ""}`);
        lines.push("");
        lines.push("    Context:");
        lines.push("    - Read .goopspec/SPEC.md if it exists");
        lines.push("    - Read .goopspec/BLUEPRINT.md if it exists");
        lines.push("    - Search memory for relevant context");
        lines.push("");
        lines.push("    Follow the instructions above and return a structured response.");
        lines.push("  `");
        lines.push("})");
        lines.push("```");
        lines.push("");
        lines.push("**Do not skip this step.** The command requires agent execution.");
      }
      
      return lines.join("\n");
    },
  });
}
