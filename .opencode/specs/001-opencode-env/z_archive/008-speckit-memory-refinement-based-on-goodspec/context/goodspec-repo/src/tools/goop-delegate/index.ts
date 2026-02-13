/**
 * GoopSpec Delegate Tool
 * Spawn specialized agents with context injection
 * 
 * @module tools/goop-delegate
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, AgentDefinition, ToolContext, ResolvedResource } from "../../core/types.js";
import { log } from "../../shared/logger.js";
import { loadPluginConfig } from "../../core/config.js";
import { fetchAvailableAgents, type OpenCodeClient } from "../../shared/opencode-client.js";

function normalizeReferencePath(name: string): string {
  return name.trim().replace(/\\/g, "/").replace(/^\.\/?/, "");
}

function extractTemplateName(name: string): string | null {
  const normalized = normalizeReferencePath(name);
  if (normalized.startsWith("templates/")) {
    return normalized.slice("templates/".length);
  }
  if (normalized.startsWith("template:")) {
    return normalized.slice("template:".length);
  }
  return null;
}

function resolveReferenceResource(
  resolver: PluginContext["resolver"],
  name: string
): { resource: ResolvedResource; kind: "reference" | "template" } | null {
  const templateName = extractTemplateName(name);
  if (templateName) {
    const template = resolver.resolve("template", templateName);
    if (template) {
      return { resource: template, kind: "template" };
    }
  }

  const reference = resolver.resolve("reference", normalizeReferencePath(name));
  if (reference) {
    return { resource: reference, kind: "reference" };
  }

  return null;
}

/**
 * Build agent prompt with skills and references
 */
function buildAgentPrompt(
  ctx: PluginContext,
  agentDef: AgentDefinition,
  userPrompt: string,
  additionalContext?: string
): string {
  const sections: string[] = [];
  
  // Agent identity
  sections.push(`# Agent: ${agentDef.name}`);
  sections.push("");
  sections.push(agentDef.prompt);
  sections.push("");
  
  // Planning file paths
  sections.push("## Planning Files (Read These First)\n");
  sections.push("- SPEC.md: `.goopspec/SPEC.md` - Specification contract");
  sections.push("- BLUEPRINT.md: `.goopspec/BLUEPRINT.md` - Execution plan");
  sections.push("- CHRONICLE.md: `.goopspec/CHRONICLE.md` - Progress log");
  sections.push("- RESEARCH.md: `.goopspec/RESEARCH.md` - Research findings");
  sections.push("");
  
  // Load and inject skills
  if (agentDef.skills.length > 0) {
    sections.push("## Loaded Skills\n");
    for (const skillName of agentDef.skills) {
      const skill = ctx.resolver.resolve("skill", skillName) 
        || ctx.resolver.resolve("skill", `${skillName}/skill`);
      if (skill) {
        sections.push(`### ${skill.frontmatter.name || skill.name}`);
        sections.push(skill.body);
        sections.push("");
      }
    }
  }
  
  // Load and inject references
  if (agentDef.references.length > 0) {
    sections.push("## References\n");
    for (const refName of agentDef.references) {
      const resolved = resolveReferenceResource(ctx.resolver, refName);
      if (resolved?.resource) {
        const title = resolved.resource.frontmatter.name || resolved.resource.name;
        const label = resolved.kind === "template" ? "Template" : "Reference";
        sections.push(`### ${label}: ${title}`);
        sections.push(resolved.resource.body);
        sections.push("");
      }
    }
  }
  
  // Additional context
  if (additionalContext) {
    sections.push("## Additional Context\n");
    sections.push(additionalContext);
    sections.push("");
  }
  
  // User task
  sections.push("## Your Task\n");
  sections.push(userPrompt);
  
  return sections.join("\n");
}

/**
 * Infer category from agent name
 */
function inferCategory(agentName: string): string {
  const categoryMap: Record<string, string> = {
    "goop-executor": "code",
    "goop-planner": "plan",
    "goop-researcher": "research",
    "goop-explorer": "explore",
    "goop-librarian": "search",
    "goop-verifier": "verify",
    "goop-debugger": "debug",
    "goop-designer": "visual",
    "goop-tester": "test",
    "goop-writer": "docs",
    "memory-distiller": "memory",
  };
  return categoryMap[agentName] || "general";
}

/**
 * Resolve the best available subagent type for task delegation.
 */
function resolveSubagentType(agentDef: AgentDefinition, available: string[]): string {
  const preferredMap: Record<string, string> = {
    "goop-explorer": "explore",
    "goop-researcher": "general",
    "goop-planner": "general",
    "goop-executor": "general",
    "goop-verifier": "general",
    "goop-debugger": "general",
    "goop-designer": "general",
    "goop-tester": "general",
    "goop-writer": "general",
    "memory-distiller": "general",
  };

  if (available.length === 0) {
    return preferredMap[agentDef.name] || "general";
  }

  const availableSet = new Set(available);
  const candidates = [agentDef.name, preferredMap[agentDef.name]].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (availableSet.has(candidate)) {
      return candidate;
    }
  }

  if (availableSet.has("general")) {
    return "general";
  }

  if (availableSet.has("explore") && agentDef.name.includes("explorer")) {
    return "explore";
  }

  return available[0];
}

/**
 * Format a task delegation response that uses the native task tool.
 */
function formatTaskDelegation(
  agentDef: AgentDefinition,
  userPrompt: string,
  composedPrompt: string,
  subagentType: string,
  availableSubagents: string[]
): string {
  const memoryProtocol = `
## Memory Protocol (Required)

### Before Starting
1. Search memory for relevant context: memory_search({ query: "[task-related terms]" })
2. Read SPEC.md, BLUEPRINT.md, CHRONICLE.md if they exist

### During Work  
1. Use memory_note for important observations
2. Use memory_decision for architectural choices
3. Update CHRONICLE.md with progress

### After Completing
1. Save learnings to memory: memory_save({ type: "observation", ... })
2. Return structured summary to orchestrator
`;

  const enrichedPrompt = composedPrompt + "\n\n" + memoryProtocol;

  const delegationPayload = {
    action: "delegate_via_task",
    agent: agentDef.name,
    subagent_type: subagentType,
    available_subagents: availableSubagents,
    model: agentDef.model,
    category: agentDef.mode || inferCategory(agentDef.name),
    skills: agentDef.skills,
    references: agentDef.references,
    userPrompt: userPrompt,
    composedPrompt: enrichedPrompt,
  };
  
  return `<goop_delegation>
${JSON.stringify(delegationPayload, null, 2)}
</goop_delegation>

**Use native \`task\` tool:**
- subagent_type: "${subagentType}"
- description: "[3-5 word task summary]"
- prompt: [composedPrompt from JSON above]`;
}

/**
 * Create the goop_delegate tool
 */
export function createGoopDelegateTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Delegate a task to a specialized GoopSpec agent by preparing a native task tool invocation with the correct prompt, skills, and references.",
    args: {
      agent: tool.schema.string().optional(),
      prompt: tool.schema.string().optional(),
      context: tool.schema.string().optional(),
      list: tool.schema.boolean().optional(),
      session_id: tool.schema.string().optional(),
    },
    async execute(args: { agent?: string; prompt?: string; context?: string; list?: boolean; session_id?: string }, _context: ToolContext): Promise<string> {
      // List agents
      if (args.list || !args.agent) {
        const agents = ctx.resolver.resolveAll("agent");
        
        if (agents.length === 0) {
          return "No agents available.";
        }
        
        const lines = ["# Available Agents\n"];
        for (const agent of agents) {
          const desc = agent.frontmatter.description as string || "";
          const model = agent.frontmatter.model as string || "default";
          lines.push(`- **${agent.name}**: ${desc} (model: ${model})`);
        }
        
        lines.push("");
        lines.push("Use the native `task` tool with `subagent_type` and `prompt` to delegate work.");
        
        return lines.join("\n");
      }
      
      // Validate prompt
      if (!args.prompt) {
        return "Error: 'prompt' is required when delegating to an agent.";
      }
      
      // Load agent
      const agentResource = ctx.resolver.resolve("agent", args.agent);
      if (!agentResource) {
        const available = ctx.resolver.resolveAll("agent").map(a => a.name);
        return `Agent "${args.agent}" not found.\n\nAvailable agents: ${available.join(", ")}`;
      }
      
      // Check config for model override
      const config = loadPluginConfig(ctx.input.directory);
      const configModel = config.agents?.[agentResource.name]?.model;
      
      // Build agent definition
      const agentDef: AgentDefinition = {
        name: agentResource.frontmatter.name as string || agentResource.name,
        description: agentResource.frontmatter.description as string || "",
        // Use config model if available, then frontmatter, then default
        model: configModel || (agentResource.frontmatter.model as string) || "anthropic/claude-sonnet-4-5",
        temperature: agentResource.frontmatter.temperature as number || 0.2,
        thinkingBudget: agentResource.frontmatter.thinking_budget as number | undefined,
        mode: agentResource.frontmatter.mode as string | undefined,
        tools: (agentResource.frontmatter.tools as string[]) || [],
        skills: (agentResource.frontmatter.skills as string[]) || [],
        references: (agentResource.frontmatter.references as string[]) || [],
        prompt: agentResource.body,
      };
      
      // Build composed prompt (used as system content)
      const composedPrompt = buildAgentPrompt(ctx, agentDef, args.prompt, args.context);
      
      const client = ctx.input.client as OpenCodeClient;
      const availableSubagents = await fetchAvailableAgents(client);

      const subagentType = resolveSubagentType(agentDef, availableSubagents);

      log("Delegation prepared", {
        agent: agentDef.name,
        subagentType,
        availableSubagents,
        modelSource: configModel ? "config" : "frontmatter",
      });

      return formatTaskDelegation(
        agentDef,
        args.prompt,
        composedPrompt,
        subagentType,
        availableSubagents
      );
    },
  });
}
