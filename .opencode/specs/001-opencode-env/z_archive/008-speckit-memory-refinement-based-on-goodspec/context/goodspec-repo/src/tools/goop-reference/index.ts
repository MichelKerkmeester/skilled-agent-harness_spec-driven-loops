/**
 * GoopSpec Reference Tool
 * Load references and templates for injection into agent context
 * 
 * References provide specialized knowledge (protocols, checklists, patterns)
 * Templates provide standardized document structures (SPEC.md, BLUEPRINT.md, etc.)
 * 
 * @module tools/goop-reference
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ResolvedResource, ToolContext } from "../../core/types.js";

type ReferenceCategory = "reference" | "template";

/**
 * Format resource info for listing
 */
function formatResourceInfo(resource: ResolvedResource, _category: ReferenceCategory): string {
  const desc = resource.frontmatter.description 
    ? `: ${resource.frontmatter.description}`
    : "";
  const categoryTag = resource.frontmatter.category 
    ? ` (${resource.frontmatter.category})`
    : "";
  return `- **${resource.name}**${desc}${categoryTag}`;
}

/**
 * Get section from frontmatter
 */
function getSection(resource: ResolvedResource, section?: string): string | null {
  if (!section) return null;
  
  // Try frontmatter first
  const sectionLower = section.toLowerCase();
  for (const [key, value] of Object.entries(resource.frontmatter)) {
    if (key.toLowerCase() === sectionLower && typeof value === "string") {
      return value;
    }
  }
  
  // Try finding section in body by heading
  const lines = resource.body.split("\n");
  let capturing = false;
  let capturedLines: string[] = [];
  const sectionPattern = new RegExp(`^##?\\s*${section}`, "i");
  
  for (const line of lines) {
    if (sectionPattern.test(line)) {
      capturing = true;
      capturedLines = [line];
      continue;
    }
    
    if (capturing) {
      // Stop at next heading of same or higher level
      if (/^##?\s/.test(line) && !line.startsWith("###")) {
        break;
      }
      capturedLines.push(line);
    }
  }
  
  return capturedLines.length > 0 ? capturedLines.join("\n").trim() : null;
}

/**
 * Create the goop_reference tool
 */
export function createGoopReferenceTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: `Load reference documents or templates for specialized knowledge.

**References** provide protocols, checklists, and patterns:
- subagent-protocol: How subagents communicate with orchestrator
- deviation-rules: When to auto-fix vs ask user
- security-checklist: Security verification checklist
- response-format: Standardized agent response formats

**Templates** provide document structures:
- spec: SPEC.md template for requirements
- blueprint: BLUEPRINT.md template for execution plans
- chronicle: CHRONICLE.md template for progress tracking

Use \`list: true\` to see all available resources.
Use \`type\` to filter: "reference" or "template" or "all".
Use \`section\` to extract a specific section from the document.`,
    args: {
      name: tool.schema.string().optional(),
      type: tool.schema.enum(["reference", "template", "all"]).optional(),
      section: tool.schema.string().optional(),
      list: tool.schema.boolean().optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      const resourceType = args.type || "all";
      
      // List resources
      if (args.list || !args.name) {
        const lines: string[] = [];
        
        if (resourceType === "all" || resourceType === "reference") {
          const refs = ctx.resolver.resolveAll("reference");
          if (refs.length > 0) {
            lines.push("# Available References\n");
            lines.push("*Protocols, checklists, and patterns for agents*\n");
            for (const ref of refs) {
              lines.push(formatResourceInfo(ref, "reference"));
            }
            lines.push("");
          }
        }
        
        if (resourceType === "all" || resourceType === "template") {
          const templates = ctx.resolver.resolveAll("template");
          if (templates.length > 0) {
            lines.push("# Available Templates\n");
            lines.push("*Document structures for GoopSpec artifacts*\n");
            for (const tmpl of templates) {
              lines.push(formatResourceInfo(tmpl, "template"));
            }
            lines.push("");
          }
        }
        
        if (lines.length === 0) {
          return "No references or templates found.";
        }
        
        lines.push("---");
        lines.push("Use `goop_reference({ name: \"resource-name\" })` to load content.");
        lines.push("Use `goop_reference({ name: \"resource-name\", section: \"Section Name\" })` to extract a specific section.");
        
        return lines.join("\n");
      }
      
      // Load specific resource
      const name = args.name;
      
      // Try reference first, then template
      let resource: ResolvedResource | null = null;
      let foundType: ReferenceCategory = "reference";
      
      if (resourceType === "all" || resourceType === "reference") {
        resource = ctx.resolver.resolve("reference", name);
        if (resource) foundType = "reference";
      }
      
      if (!resource && (resourceType === "all" || resourceType === "template")) {
        resource = ctx.resolver.resolve("template", name);
        if (resource) foundType = "template";
      }
      
      if (!resource) {
        const availableRefs = ctx.resolver.resolveAll("reference").map(r => r.name);
        const availableTemplates = ctx.resolver.resolveAll("template").map(t => t.name);
        
        return [
          `Resource "${name}" not found.`,
          "",
          "**Available references:**",
          availableRefs.join(", ") || "(none)",
          "",
          "**Available templates:**",
          availableTemplates.join(", ") || "(none)",
        ].join("\n");
      }
      
      // Extract section if requested
      if (args.section) {
        const sectionContent = getSection(resource, args.section);
        if (sectionContent) {
          return [
            `# ${resource.name} - ${args.section}`,
            "",
            `*Extracted from ${foundType}: ${resource.name}*`,
            "",
            "---",
            "",
            sectionContent,
          ].join("\n");
        } else {
          return [
            `Section "${args.section}" not found in ${resource.name}.`,
            "",
            "**Available content:**",
            resource.body.slice(0, 500) + (resource.body.length > 500 ? "..." : ""),
          ].join("\n");
        }
      }
      
      // Return full content
      const lines = [
        `# ${foundType === "reference" ? "Reference" : "Template"}: ${resource.frontmatter.name || resource.name}`,
        "",
      ];
      
      if (resource.frontmatter.description) {
        lines.push(`**Description:** ${resource.frontmatter.description}`, "");
      }
      
      if (resource.frontmatter.category) {
        lines.push(`**Category:** ${resource.frontmatter.category}`, "");
      }
      
      if (resource.frontmatter.version) {
        lines.push(`**Version:** ${resource.frontmatter.version}`, "");
      }
      
      lines.push("---", "", resource.body);
      
      return lines.join("\n");
    },
  });
}
