/**
 * Document Scaffolder
 * Creates .goopspec/phases/[name]/ structure with templated documents
 * 
 * @module features/enforcement/scaffolder
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import type { PluginContext, WorkflowPhase } from "../../core/types.js";
import { renderTemplate, createDefaultContext, type TemplateContext } from "../../shared/template-engine.js";
import { getProjectGoopspecDir } from "../../shared/paths.js";
import { log, logError } from "../../shared/logger.js";

/**
 * Document types that can be scaffolded
 */
export type DocumentType = "spec" | "blueprint" | "chronicle" | "research";

/**
 * Document configuration
 */
interface DocumentConfig {
  templateName: string;
  fileName: string;
  requiredInPhases: WorkflowPhase[];
}

/**
 * Document type configurations
 */
const DOCUMENT_CONFIGS: Record<DocumentType, DocumentConfig> = {
  spec: {
    templateName: "spec.md",
    fileName: "SPEC.md",
    requiredInPhases: ["plan", "research", "specify", "execute", "accept"],
  },
  blueprint: {
    templateName: "blueprint.md",
    fileName: "BLUEPRINT.md",
    requiredInPhases: ["specify", "execute", "accept"],
  },
  chronicle: {
    templateName: "chronicle.md",
    fileName: "CHRONICLE.md",
    requiredInPhases: ["plan", "research", "specify", "execute", "accept"],
  },
  research: {
    templateName: "research.md",
    fileName: "RESEARCH.md",
    requiredInPhases: ["research", "specify"],
  },
};

/**
 * Get the templates directory path
 */
function getTemplatesDir(ctx: PluginContext): string {
  // First check project-local templates
  const projectTemplates = join(ctx.input.directory, "templates");
  if (existsSync(projectTemplates)) {
    return projectTemplates;
  }
  
  // Fall back to plugin templates (bundled with the plugin)
  // In a bundled plugin, templates may be in the plugin directory
  const resolver = ctx.resolver;
  const templateDir = resolver.getDirectory("template");
  if (templateDir && existsSync(templateDir)) {
    return templateDir;
  }
  
  // Ultimate fallback - relative to this file (for development)
  const devTemplates = join(dirname(import.meta.dir), "..", "..", "templates");
  if (existsSync(devTemplates)) {
    return devTemplates;
  }
  
  throw new Error("Templates directory not found");
}

/**
 * Load a template file
 */
function loadTemplate(ctx: PluginContext, templateName: string): string | null {
  try {
    const templatesDir = getTemplatesDir(ctx);
    const templatePath = join(templatesDir, templateName);
    
    if (!existsSync(templatePath)) {
      log(`Template not found: ${templatePath}`);
      return null;
    }
    
    return readFileSync(templatePath, "utf-8");
  } catch (error) {
    logError(`Failed to load template: ${templateName}`, error);
    return null;
  }
}

/**
 * Scaffold result
 */
export interface ScaffoldResult {
  success: boolean;
  phaseDir: string;
  documentsCreated: string[];
  documentsSkipped: string[];
  errors: string[];
}

/**
 * Scaffold phase documents
 * Creates .goopspec/phases/[phaseName]/ with required documents
 */
export async function scaffoldPhaseDocuments(
  ctx: PluginContext,
  phaseName: string,
  phase: WorkflowPhase,
  additionalContext: TemplateContext = {}
): Promise<ScaffoldResult> {
  const result: ScaffoldResult = {
    success: true,
    phaseDir: "",
    documentsCreated: [],
    documentsSkipped: [],
    errors: [],
  };

  try {
    // Create phase directory
    const goopspecDir = getProjectGoopspecDir(ctx.input.directory);
    const phaseDir = join(goopspecDir, "phases", sanitizePhaseName(phaseName));
    result.phaseDir = phaseDir;

    if (!existsSync(phaseDir)) {
      mkdirSync(phaseDir, { recursive: true });
      log(`Created phase directory: ${phaseDir}`);
    }

    // Get project name
    const projectName = ctx.config.projectName || ctx.input.project.name || "unnamed";

    // Create context for templates
    const templateContext = createDefaultContext(projectName, phaseName, {
      current_phase: phase,
      ...additionalContext,
    });

    // Scaffold each document type needed for this phase
    for (const [docType, config] of Object.entries(DOCUMENT_CONFIGS)) {
      const docPath = join(phaseDir, config.fileName);

      // Skip if document already exists
      if (existsSync(docPath)) {
        result.documentsSkipped.push(config.fileName);
        log(`Document already exists, skipping: ${config.fileName}`);
        continue;
      }

      // Check if this document is needed for the current phase
      if (!config.requiredInPhases.includes(phase)) {
        continue;
      }

      // Load and render template
      const template = loadTemplate(ctx, config.templateName);
      if (!template) {
        // Create a minimal document if template not found
        const minimalContent = createMinimalDocument(docType as DocumentType, templateContext);
        writeFileSync(docPath, minimalContent, "utf-8");
        result.documentsCreated.push(config.fileName);
        log(`Created minimal document (no template): ${config.fileName}`);
        continue;
      }

      const content = renderTemplate(template, templateContext);
      writeFileSync(docPath, content, "utf-8");
      result.documentsCreated.push(config.fileName);
      log(`Created document: ${config.fileName}`);
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
    logError("Failed to scaffold phase documents", error);
    return result;
  }
}

/**
 * Sanitize phase name for use in file paths
 */
function sanitizePhaseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Create minimal document content when template is not available
 */
function createMinimalDocument(docType: DocumentType, context: TemplateContext): string {
  const projectName = context.project_name || "Project";
  const phaseName = context.phase_name || "Phase";
  const date = context.created_date || new Date().toISOString().split("T")[0];

  switch (docType) {
    case "spec":
      return `# SPEC: ${projectName}

**Version:** 1.0.0
**Created:** ${date}
**Status:** DRAFT

---

## Vision

[Describe what you're building and why]

---

## Must-Haves

- [ ] [Requirement 1]
- [ ] [Requirement 2]

---

## Out of Scope

- [Item 1]

---

## Success Criteria

1. [Criterion 1]
2. [Criterion 2]

---

*GoopSpec v0.1.0*
`;

    case "blueprint":
      return `# BLUEPRINT: ${projectName}

**Spec Version:** 1.0.0
**Created:** ${date}
**Mode:** standard

---

## Overview

**Goal:** [Define the goal]

**Waves:** 0
**Tasks:** 0

---

## Waves

[Define waves and tasks here]

---

*GoopSpec v0.1.0*
`;

    case "chronicle":
      return `# CHRONICLE: ${projectName}

**Last Updated:** ${date}
**Current Phase:** ${phaseName}

---

## Status

**Position:** Starting

| Metric | Value |
|--------|-------|
| Waves Completed | 0/0 |
| Tasks Done | 0 |

---

## Recent Activity

[Activity will be logged here]

---

*GoopSpec v0.1.0*
`;

    case "research":
      return `# RESEARCH: ${projectName}

**Created:** ${date}
**Phase:** ${phaseName}

---

## Research Goals

[What are you researching?]

---

## Findings

[Document findings here]

---

## Recommendations

[Recommendations based on research]

---

*GoopSpec v0.1.0*
`;

    default:
      return `# ${String(docType).toUpperCase()}\n\nCreated: ${date}\n`;
  }
}

/**
 * Check if required documents exist for a phase
 */
export function checkPhaseDocuments(
  ctx: PluginContext,
  phaseName: string,
  phase: WorkflowPhase
): { valid: boolean; missing: string[]; existing: string[] } {
  const goopspecDir = getProjectGoopspecDir(ctx.input.directory);
  const phaseDir = join(goopspecDir, "phases", sanitizePhaseName(phaseName));

  const missing: string[] = [];
  const existing: string[] = [];

  for (const [_docType, config] of Object.entries(DOCUMENT_CONFIGS)) {
    if (!config.requiredInPhases.includes(phase)) {
      continue;
    }

    const docPath = join(phaseDir, config.fileName);
    if (existsSync(docPath)) {
      existing.push(config.fileName);
    } else {
      missing.push(config.fileName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    existing,
  };
}

/**
 * Get the phase directory path
 */
export function getPhaseDir(ctx: PluginContext, phaseName: string): string {
  const goopspecDir = getProjectGoopspecDir(ctx.input.directory);
  return join(goopspecDir, "phases", sanitizePhaseName(phaseName));
}
