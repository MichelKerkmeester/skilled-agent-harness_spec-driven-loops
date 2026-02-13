/**
 * Simple Template Engine
 * Mustache-like variable replacement for document scaffolding
 * 
 * @module shared/template-engine
 */

/**
 * Template variables context
 */
export interface TemplateContext {
  [key: string]: string | number | boolean | string[] | TemplateContext | undefined;
}

/**
 * Replace {{variable}} placeholders with values from context
 * Supports:
 * - {{variable}} - simple replacement
 * - {{#array}}...{{/array}} - array iteration (basic)
 * - {{^variable}}...{{/variable}} - inverted section (if falsy)
 * 
 * Note: This is a simplified implementation. For complex templates,
 * consider using a full mustache library.
 */
export function renderTemplate(template: string, context: TemplateContext): string {
  let result = template;

  // Handle simple variable replacements first
  result = result.replace(/\{\{([^#^/][^}]*)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    const value = getNestedValue(context, trimmedKey);
    
    if (value === undefined || value === null) {
      return match; // Keep placeholder if no value
    }
    
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    
    return String(value);
  });

  // Handle array sections: {{#items}}...{{/items}}
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match, key, content) => {
    const value = getNestedValue(context, key);
    
    if (!value) {
      return ""; // Remove section if falsy
    }
    
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "object") {
            return renderTemplate(content, item as TemplateContext);
          }
          // For simple arrays, replace {{.}} with the item
          return content.replace(/\{\{\.\}\}/g, String(item));
        })
        .join("");
    }
    
    // If truthy but not array, render content once
    return renderTemplate(content, context);
  });

  // Handle inverted sections: {{^items}}...{{/items}}
  result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match, key, content) => {
    const value = getNestedValue(context, key);
    
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return renderTemplate(content, context); // Show if falsy or empty array
    }
    
    return ""; // Hide if truthy
  });

  return result;
}

/**
 * Get a nested value from context using dot notation
 * e.g., getNestedValue(ctx, "project.name") returns ctx.project.name
 */
function getNestedValue(context: TemplateContext, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = context;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Generate default context for GoopSpec documents
 */
export function createDefaultContext(
  projectName: string,
  phaseName: string,
  additionalContext: TemplateContext = {}
): TemplateContext {
  const now = new Date();
  
  return {
    project_name: projectName,
    phase_name: phaseName,
    version: "1.0.0",
    created_date: now.toISOString().split("T")[0],
    updated_date: now.toISOString().split("T")[0],
    status: "DRAFT",
    mode: "standard",
    
    // Placeholders that should be filled by orchestrator
    vision: "[Vision to be defined]",
    why: "[Motivation to be defined]",
    goal: "[Goal to be defined]",
    approach: "[Approach to be defined]",
    
    // Empty arrays for lists
    must_haves: [],
    nice_to_haves: [],
    out_of_scope: [],
    acceptance_criteria: [],
    always: [],
    ask_first: [],
    never: [],
    
    // Technical defaults
    runtime: "Bun",
    language: "TypeScript",
    framework: "[Framework]",
    database: "[Database]",
    testing: "bun:test",
    file_naming: "kebab-case",
    component_naming: "PascalCase",
    function_naming: "camelCase",
    commit_format: "conventional",
    
    ...additionalContext,
  };
}
