/**
 * Agent Factory
 * Converts markdown agent definitions to OpenCode AgentConfig objects
 * Includes memory system integration for persistent context
 * 
 * @module agents/agent-factory
 */

import type { ResolvedResource, ResourceResolver, GoopSpecConfig } from "../core/types.js";
import { log } from "../shared/logger.js";

/**
 * Memory tools that should be added to agents
 */
const MEMORY_TOOLS = [
  "memory_save",
  "memory_search",
  "memory_note",
  "memory_decision",
  "memory_forget",
];

/**
 * Memory-related skills to inject
 */
const MEMORY_SKILLS = ["memory-usage"];

/**
 * OpenCode AgentConfig interface
 * This matches the structure expected by OpenCode's config.agent
 */
export interface AgentConfig {
  mode: "primary" | "subagent" | "all";
  model?: string;
  prompt: string;
  description: string;
  color?: string;
  permission?: Record<string, "allow" | "deny">;
  temperature?: number;
  thinking?: { type: "enabled"; budgetTokens: number };
}

/**
 * Options for creating agent configs
 */
export interface AgentFactoryOptions {
  /** Whether to add memory tools to agents */
  enableMemoryTools?: boolean;
  /** Plugin config for additional settings */
  pluginConfig?: GoopSpecConfig;
}

/**
 * Create an AgentConfig from a markdown agent resource
 * 
 * This function:
 * 1. Extracts configuration from frontmatter
 * 2. Builds permission map from tools list (including memory tools if enabled)
 * 3. Composes the full prompt by injecting skills and references
 * 4. Returns a complete AgentConfig ready for OpenCode registration
 */
export function createAgentFromMarkdown(
  resource: ResolvedResource,
  resolver: ResourceResolver,
  options?: AgentFactoryOptions
): AgentConfig {
  const fm = resource.frontmatter;
  const agentName = (fm.name as string) || resource.name;
  const enableMemory = options?.enableMemoryTools ?? (options?.pluginConfig?.memory?.enabled !== false);
  
  log(`Creating agent config for: ${agentName}`, { enableMemory });
  
  // Build permission map from tools list
  let tools = (fm.tools as string[]) ?? [];
  
  // Add memory tools if enabled and not already present
  if (enableMemory) {
    const existingTools = new Set(tools.map(t => t.toLowerCase()));
    const memoryToolsToAdd = MEMORY_TOOLS.filter(t => !existingTools.has(t.toLowerCase()));
    if (memoryToolsToAdd.length > 0) {
      tools = [...tools, ...memoryToolsToAdd];
      log(`Added memory tools to ${agentName}`, { added: memoryToolsToAdd });
    }
  }
  
  const permission: Record<string, "allow" | "deny"> = {};
  for (const tool of tools) {
    permission[tool] = "allow";
  }
  
  // Load and inject skills/references into prompt
  let skills = (fm.skills as string[]) ?? [];
  
  // Add memory-usage skill if memory is enabled
  if (enableMemory && !skills.includes("memory-usage")) {
    skills = [...skills, ...MEMORY_SKILLS];
  }
  
  const references = (fm.references as string[]) ?? [];
  const composedPrompt = composeAgentPrompt(
    resource.body, 
    skills, 
    references, 
    resolver,
    agentName,
    enableMemory
  );
  
  // Build the agent configuration
  const config: AgentConfig = {
    mode: (fm.mode as "primary" | "subagent" | "all") ?? "subagent",
    prompt: composedPrompt,
    description: (fm.description as string) ?? `GoopSpec ${agentName} agent`,
    model: fm.model as string | undefined,
    color: fm.color as string | undefined,
    temperature: fm.temperature as number | undefined,
  };
  
  // Add permission if tools are defined
  if (Object.keys(permission).length > 0) {
    config.permission = permission;
  }
  
  // Add thinking budget if defined
  if (fm.thinking_budget) {
    config.thinking = {
      type: "enabled",
      budgetTokens: fm.thinking_budget as number,
    };
  }
  
  log(`Created agent config for ${agentName}`, {
    mode: config.mode,
    model: config.model,
    toolCount: tools.length,
    skillCount: skills.length,
    referenceCount: references.length,
    memoryEnabled: enableMemory,
  });
  
  return config;
}

/**
 * Compose full agent prompt by injecting skills and references
 * 
 * The composed prompt includes:
 * 1. Base agent prompt (from markdown body)
 * 2. Loaded skills (inline content)
 * 3. Referenced documents (inline content)
 * 4. Memory system instructions (if enabled)
 */
function composeAgentPrompt(
  basePrompt: string,
  skillNames: string[],
  referenceNames: string[],
  resolver: ResourceResolver,
  agentName: string,
  enableMemory: boolean = true
): string {
  const sections: string[] = [basePrompt];
  
  // Inject skills
  if (skillNames.length > 0) {
    sections.push("\n## Loaded Skills\n");
    
    for (const name of skillNames) {
      try {
        // Try direct match first
        let skill = resolver.resolve("skill", name);
        
        // Try with /skill.md suffix
        if (!skill) {
          skill = resolver.resolve("skill", `${name}/skill`);
        }
        
        if (skill) {
          const skillTitle = (skill.frontmatter.name as string) || name;
          sections.push(`### ${skillTitle}\n`);
          sections.push(skill.body);
          sections.push("");
          
          log(`Injected skill: ${name} into ${agentName}`);
        } else {
          log(`Skill not found: ${name} for ${agentName}`, { level: "warn" });
        }
      } catch (error) {
        log(`Failed to load skill: ${name} for ${agentName}`, { error, level: "warn" });
      }
    }
  }
  
  // Inject references
  if (referenceNames.length > 0) {
    sections.push("\n## Reference Documents\n");
    
    for (const name of referenceNames) {
      try {
        const resolved = resolveReferenceResource(resolver, name);
        
        if (resolved) {
          const title = (resolved.resource.frontmatter.name as string) || resolved.resource.name;
          const label = resolved.kind === "template" ? "Template" : "Reference";
          sections.push(`### ${label}: ${title}\n`);
          sections.push(resolved.resource.body);
          sections.push("");
          
          log(`Injected ${resolved.kind}: ${name} into ${agentName}`);
        } else {
          log(`Reference not found: ${name} for ${agentName}`, { level: "warn" });
        }
      } catch (error) {
        log(`Failed to load reference: ${name} for ${agentName}`, { error, level: "warn" });
      }
    }
  }
  
  // Add memory system instructions if enabled
  if (enableMemory) {
    sections.push(`
## Memory System

You have access to a persistent memory system that stores knowledge across sessions. Use it to:

- **Remember decisions**: Use \`memory_decision\` to log architectural decisions with reasoning
- **Store observations**: Use \`memory_save\` to save important findings and patterns
- **Quick notes**: Use \`memory_note\` for quick context notes
- **Search context**: Use \`memory_search\` to find relevant past context
- **Clean up**: Use \`memory_forget\` to remove outdated or incorrect memories

**Best practices:**
- Search memory before making decisions that might repeat past mistakes
- Log all significant architectural decisions for future reference
- Store patterns, conventions, and project-specific knowledge
- Reference memory IDs when building on previous work
`);
  }
  
  return sections.join("\n");
}

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
  resolver: ResourceResolver,
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
 * Validate that an agent resource has required frontmatter fields
 * Returns array of missing/invalid fields
 */
export function validateAgentResource(resource: ResolvedResource): string[] {
  const issues: string[] = [];
  const fm = resource.frontmatter;
  
  if (!fm.name && !resource.name) {
    issues.push("Missing 'name' field");
  }
  
  if (!fm.description) {
    issues.push("Missing 'description' field");
  }
  
  if (!fm.mode || !["primary", "subagent", "all"].includes(fm.mode as string)) {
    issues.push("Invalid or missing 'mode' field (must be primary, subagent, or all)");
  }
  
  if (!resource.body || resource.body.trim().length === 0) {
    issues.push("Empty agent prompt body");
  }
  
  return issues;
}
