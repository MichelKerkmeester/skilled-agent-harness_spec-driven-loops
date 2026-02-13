/**
 * Enforcement Validators
 * Phase-aware validation helpers for write operations and transitions
 *
 * @module features/enforcement/validators
 */

import { extname } from "path";
import type { PluginContext, WorkflowPhase } from "../../core/types.js";
import { isOperationAllowed } from "./phase-context.js";
import { checkPhaseDocuments } from "./scaffolder.js";

export interface ValidationResult {
  valid: boolean;
  warning?: string;
  shouldBlock?: boolean;
}

export interface TransitionValidation {
  allowed: boolean;
  reason?: string;
  missing?: string[];
}

const IMPLEMENTATION_DIRECTORIES = ["src", "lib", "app", "apps", "packages", "server", "client"] as const;
const EXCLUDED_EXTENSIONS = new Set([".md", ".json"]);

const REQUIRED_DOCUMENTS: Record<WorkflowPhase, readonly string[]> = {
  idle: [],
  plan: ["SPEC.md"],
  research: ["SPEC.md", "RESEARCH.md"],
  specify: ["SPEC.md", "BLUEPRINT.md"],
  execute: ["SPEC.md"],
  accept: ["SPEC.md", "BLUEPRINT.md", "CHRONICLE.md"],
};

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

/**
 * Determines whether a file path points to implementation code.
 */
export function isImplementationFile(filePath: string): boolean {
  const normalized = normalizePath(filePath).toLowerCase();
  if (!normalized) {
    return false;
  }

  if (
    normalized.includes("/.goopspec/") ||
    normalized.startsWith(".goopspec/") ||
    normalized.includes("/node_modules/") ||
    normalized.startsWith("node_modules/")
  ) {
    return false;
  }

  const extension = extname(normalized);
  if (EXCLUDED_EXTENSIONS.has(extension)) {
    return false;
  }

  return IMPLEMENTATION_DIRECTORIES.some((dir) =>
    normalized === dir || normalized.startsWith(`${dir}/`) || normalized.includes(`/${dir}/`)
  );
}

/**
 * Validate a write/edit operation against the current workflow phase.
 */
export function validateWriteOperation(phase: WorkflowPhase, filePath: string): ValidationResult {
  if (!isImplementationFile(filePath)) {
    return { valid: true };
  }

  const permission = isOperationAllowed(phase, "write_code");
  if (permission.allowed) {
    return { valid: true };
  }

  return {
    valid: false,
    warning: permission.reason ?? `Writing implementation files is discouraged in ${phase} phase.`,
    shouldBlock: false,
  };
}

/**
 * Validate phase transition preconditions.
 */
export function validatePhaseTransition(
  ctx: PluginContext,
  _from: WorkflowPhase,
  to: WorkflowPhase
): TransitionValidation {
  const required = REQUIRED_DOCUMENTS[to] ?? [];
  if (required.length === 0) {
    return { allowed: true };
  }

  const phaseName = ctx.stateManager.getState().workflow.currentPhase ?? to;
  const check = checkPhaseDocuments(ctx, phaseName, to);
  const missing = required.filter((doc) => !check.existing.includes(doc));

  if (missing.length === 0) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Missing required documents for ${to} phase: ${missing.join(", ")}`,
    missing,
  };
}

/**
 * Format a validation warning for display.
 */
export function getValidationWarning(result: ValidationResult): string | null {
  if (result.valid) {
    return null;
  }

  const message = result.warning ?? "Operation may violate current phase requirements.";
  const prefix = result.shouldBlock ? "Blocked" : "Warning";
  return `${prefix}: ${message}`;
}
