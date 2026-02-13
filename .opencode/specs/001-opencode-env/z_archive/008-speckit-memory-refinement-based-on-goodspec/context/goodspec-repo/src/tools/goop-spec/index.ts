/**
 * GoopSpec Spec Tool
 * Read and validate SPEC.md and PLAN.md files
 * 
 * @module tools/goop-spec
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join, basename } from "path";
import type { PluginContext, ToolContext } from "../../core/types.js";
import { parseFrontmatter } from "../../shared/frontmatter.js";
import { getProjectGoopspecDir } from "../../shared/paths.js";

/**
 * Sanitize phase name to prevent path traversal attacks
 * Only allows alphanumeric characters, hyphens, and underscores
 */
function sanitizePhaseName(phase: string): { valid: boolean; sanitized: string; error?: string } {
  // Check for path traversal attempts
  if (phase.includes("..") || phase.includes("/") || phase.includes("\\")) {
    return { valid: false, sanitized: "", error: "Invalid phase name: path traversal not allowed" };
  }
  
  // Extract just the basename to be extra safe
  const sanitized = basename(phase);
  
  // Only allow safe characters
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return { valid: false, sanitized: "", error: "Invalid phase name: only alphanumeric, hyphens, and underscores allowed" };
  }
  
  // Verify the sanitized path stays within the expected directory
  if (sanitized !== phase) {
    return { valid: false, sanitized: "", error: "Invalid phase name: contains invalid characters" };
  }
  
  return { valid: true, sanitized };
}

/**
 * List all phases
 */
function listPhases(goopspecDir: string): string {
  const phasesDir = join(goopspecDir, "phases");
  
  if (!existsSync(phasesDir)) {
    return "No phases found. Use /goop-plan to create a phase.";
  }
  
  const phases = readdirSync(phasesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  if (phases.length === 0) {
    return "No phases found. Use /goop-plan to create a phase.";
  }
  
  const lines = ["# Available Phases\n"];
  for (const phase of phases) {
    const phaseDir = join(phasesDir, phase);
    const hasSpec = existsSync(join(phaseDir, "SPEC.md"));
    const hasPlan = existsSync(join(phaseDir, "PLAN.md"));
    lines.push(`- **${phase}**: ${hasSpec ? "SPEC" : ""} ${hasPlan ? "PLAN" : ""}`);
  }
  
  return lines.join("\n");
}

/**
 * Read spec/plan files for a phase
 */
function readPhaseFiles(goopspecDir: string, phase: string, file: string): string {
  const phaseDir = join(goopspecDir, "phases", phase);
  
  if (!existsSync(phaseDir)) {
    return `Phase "${phase}" not found. Use 'list' to see available phases.`;
  }
  
  const output: string[] = [];
  
  if (file === "spec" || file === "both") {
    const specPath = join(phaseDir, "SPEC.md");
    if (existsSync(specPath)) {
      const content = readFileSync(specPath, "utf-8");
      output.push("# SPEC.md\n");
      output.push(content);
    } else {
      output.push("SPEC.md not found for this phase.");
    }
  }
  
  if (file === "plan" || file === "both") {
    const planPath = join(phaseDir, "PLAN.md");
    if (existsSync(planPath)) {
      const content = readFileSync(planPath, "utf-8");
      if (output.length > 0) output.push("\n---\n");
      output.push("# PLAN.md\n");
      output.push(content);
    } else {
      output.push("PLAN.md not found for this phase.");
    }
  }
  
  return output.join("\n");
}

/**
 * Validate spec/plan files
 */
function validatePhaseFiles(goopspecDir: string, phase: string): string {
  const phaseDir = join(goopspecDir, "phases", phase);
  
  if (!existsSync(phaseDir)) {
    return `Phase "${phase}" not found.`;
  }
  
  const issues: string[] = [];
  const lines = [`# Validation for Phase: ${phase}\n`];
  
  // Validate SPEC.md
  const specPath = join(phaseDir, "SPEC.md");
  if (existsSync(specPath)) {
    const content = readFileSync(specPath, "utf-8");
    const { data } = parseFrontmatter(content);
    
    if (!data.phase) issues.push("SPEC.md: Missing 'phase' in frontmatter");
    if (!data.title) issues.push("SPEC.md: Missing 'title' in frontmatter");
    if (!data.status) issues.push("SPEC.md: Missing 'status' in frontmatter");
    
    lines.push("## SPEC.md");
    lines.push(`- Phase: ${data.phase || "MISSING"}`);
    lines.push(`- Title: ${data.title || "MISSING"}`);
    lines.push(`- Status: ${data.status || "MISSING"}`);
  } else {
    issues.push("SPEC.md not found");
    lines.push("## SPEC.md: NOT FOUND");
  }
  
  // Validate PLAN.md
  const planPath = join(phaseDir, "PLAN.md");
  if (existsSync(planPath)) {
    const content = readFileSync(planPath, "utf-8");
    const { data, body } = parseFrontmatter(content);
    
    if (!data.phase) issues.push("PLAN.md: Missing 'phase' in frontmatter");
    if (!data.plan) issues.push("PLAN.md: Missing 'plan' in frontmatter");
    if (!data.type) issues.push("PLAN.md: Missing 'type' in frontmatter");
    
    // Check for tasks
    const hasTasks = body.includes("<task");
    if (!hasTasks) issues.push("PLAN.md: No <task> elements found");
    
    lines.push("\n## PLAN.md");
    lines.push(`- Phase: ${data.phase || "MISSING"}`);
    lines.push(`- Plan: ${data.plan || "MISSING"}`);
    lines.push(`- Type: ${data.type || "MISSING"}`);
    lines.push(`- Has Tasks: ${hasTasks ? "Yes" : "No"}`);
  } else {
    issues.push("PLAN.md not found");
    lines.push("\n## PLAN.md: NOT FOUND");
  }
  
  // Summary
  lines.push("\n## Validation Result");
  if (issues.length === 0) {
    lines.push("**VALID** - No issues found.");
  } else {
    lines.push("**ISSUES FOUND:**");
    for (const issue of issues) {
      lines.push(`- ${issue}`);
    }
  }
  
  return lines.join("\n");
}

/**
 * Create the goop_spec tool
 */
export function createGoopSpecTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Read, list, or validate SPEC.md and PLAN.md files for GoopSpec phases",
    args: {
      action: tool.schema.enum(["read", "list", "validate"]),
      phase: tool.schema.string().optional(),
      file: tool.schema.enum(["spec", "plan", "both"]).optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      const goopspecDir = getProjectGoopspecDir(ctx.input.directory);
      
      switch (args.action) {
        case "list":
          return listPhases(goopspecDir);
        
        case "read": {
          if (!args.phase) {
            return "Error: 'phase' is required for read action.";
          }
          const readSanitize = sanitizePhaseName(args.phase);
          if (!readSanitize.valid) {
            return `Error: ${readSanitize.error}`;
          }
          return readPhaseFiles(goopspecDir, readSanitize.sanitized, args.file || "both");
        }
        
        case "validate": {
          if (!args.phase) {
            return "Error: 'phase' is required for validate action.";
          }
          const validateSanitize = sanitizePhaseName(args.phase);
          if (!validateSanitize.valid) {
            return `Error: ${validateSanitize.error}`;
          }
          return validatePhaseFiles(goopspecDir, validateSanitize.sanitized);
        }
        
        default:
          return "Unknown action.";
      }
    },
  });
}
