/**
 * Phase Enforcement Context Builder
 * Generates phase-specific MUST DO / MUST NOT DO enforcement rules
 * 
 * @module features/enforcement/phase-context
 */

import type { GoopState, WorkflowPhase } from "../../core/types.js";

/**
 * Phase enforcement rules
 */
export interface PhaseEnforcement {
  phase: WorkflowPhase;
  phaseName: string;
  mustDo: string[];
  mustNotDo: string[];
  requiredDocuments: string[];
  delegationReminder?: string;
}

/**
 * Delegation example using correct tool syntax
 */
const DELEGATION_EXAMPLE = `
Use the task tool for delegation:
\`\`\`
task({
  subagent_type: "goop-executor",  // or other agent type
  description: "Brief task description",
  prompt: \`
    ## TASK
    [Specific, atomic goal]
    
    ## FILES
    - path/to/file.ts (modify/create)
    
    ## REQUIREMENTS
    [From SPEC.md]
    
    ## ACCEPTANCE
    [How to verify completion]
  \`
})
\`\`\`
NOTE: Use "task" tool, NOT "delegate" tool for subagent work.
`.trim();

/**
 * Phase-specific enforcement rules
 */
const PHASE_ENFORCEMENT: Record<WorkflowPhase, Omit<PhaseEnforcement, "phase">> = {
  idle: {
    phaseName: "IDLE",
    mustDo: [
      "Use /goop-plan to start a new feature",
      "Use /goop-status to check current state",
    ],
    mustNotDo: [
      "Write implementation code without a plan",
      "Skip the planning phase",
    ],
    requiredDocuments: [],
  },
  
  plan: {
    phaseName: "PLAN",
    mustDo: [
      "Ask clarifying questions to understand requirements",
      "Create SPEC.md with must-haves, nice-to-haves, out-of-scope",
      "Define clear success criteria",
      "Get user confirmation before proceeding to research/execute",
      "Call goop_status() to verify current state",
    ],
    mustNotDo: [
      "Write ANY implementation code",
      "Create source files (only .goopspec/ documents)",
      "Skip requirement gathering",
      "Proceed without user confirmation",
      "Use write/edit tools on src/ files",
    ],
    requiredDocuments: ["SPEC.md"],
  },
  
  research: {
    phaseName: "RESEARCH",
    mustDo: [
      "Read SPEC.md to understand requirements",
      "Research implementation approaches",
      "Create RESEARCH.md with findings",
      "Document trade-offs and recommendations",
      "Search memory for similar past work",
    ],
    mustNotDo: [
      "Write implementation code",
      "Modify source files",
      "Skip documenting findings",
      "Make architectural decisions without documenting",
    ],
    requiredDocuments: ["SPEC.md", "RESEARCH.md"],
  },
  
  specify: {
    phaseName: "SPECIFY",
    mustDo: [
      "Create BLUEPRINT.md with wave-based execution plan",
      "Map all must-haves to specific tasks",
      "Define verification steps for each task",
      "Get user confirmation to lock specification",
      "Call goop_checkpoint() to save state",
    ],
    mustNotDo: [
      "Write implementation code",
      "Proceed without locked specification",
      "Skip task decomposition",
      "Create vague or incomplete tasks",
    ],
    requiredDocuments: ["SPEC.md", "BLUEPRINT.md"],
  },
  
  execute: {
    phaseName: "EXECUTE",
    mustDo: [
      "DELEGATE all code work to executor agents using task() tool",
      "Track progress in CHRONICLE.md",
      "Follow wave order (complete wave N before wave N+1)",
      "Verify each task completion before moving on",
      "Save checkpoints at wave boundaries",
      "Update ADL.md with any deviations",
    ],
    mustNotDo: [
      "Write code directly - ALWAYS delegate to subagents",
      "Use 'delegate' tool - use 'task' tool instead",
      "Skip verification steps",
      "Ignore test failures",
      "Modify files outside BLUEPRINT.md scope",
    ],
    requiredDocuments: ["SPEC.md", "BLUEPRINT.md", "CHRONICLE.md"],
    delegationReminder: DELEGATION_EXAMPLE,
  },
  
  accept: {
    phaseName: "ACCEPT",
    mustDo: [
      "Verify ALL must-haves from SPEC.md are complete",
      "Run all tests and ensure they pass",
      "Check for any deviations in ADL.md",
      "Get explicit user acceptance",
      "Save final checkpoint",
    ],
    mustNotDo: [
      "Mark complete without verification",
      "Skip user confirmation",
      "Ignore failing tests",
      "Proceed if must-haves are missing",
    ],
    requiredDocuments: ["SPEC.md", "BLUEPRINT.md", "CHRONICLE.md"],
  },
};

/**
 * Build phase enforcement context for injection into system prompt
 */
export function buildPhaseEnforcement(phase: WorkflowPhase, _state: GoopState): string {
  const rules = PHASE_ENFORCEMENT[phase];
  if (!rules) {
    return "";
  }

  const lines: string[] = [
    `## PHASE ENFORCEMENT: ${rules.phaseName}`,
    "",
    "### MUST DO:",
  ];

  for (const item of rules.mustDo) {
    lines.push(`- ${item}`);
  }

  lines.push("", "### MUST NOT DO:");
  for (const item of rules.mustNotDo) {
    lines.push(`- ${item}`);
  }

  // Add required documents status
  if (rules.requiredDocuments.length > 0) {
    lines.push("", "### REQUIRED DOCUMENTS:");
    for (const doc of rules.requiredDocuments) {
      // TODO: Check if document actually exists
      lines.push(`- [ ] ${doc}`);
    }
  }

  // Add delegation reminder for execute phase
  if (rules.delegationReminder) {
    lines.push("", "### DELEGATION (CRITICAL):", "", rules.delegationReminder);
  }

  return lines.join("\n");
}

/**
 * Build current state context for injection
 */
export function buildStateContext(state: GoopState): string {
  const workflow = state.workflow;
  const execution = state.execution;

  const lines: string[] = [
    "## CURRENT STATE",
    "",
    `**Phase:** ${workflow.phase}`,
    `**Mode:** ${workflow.mode}`,
    `**Spec Locked:** ${workflow.specLocked ? "Yes" : "No"}`,
    `**Acceptance Confirmed:** ${workflow.acceptanceConfirmed ? "Yes" : "No"}`,
  ];

  if (workflow.totalWaves > 0) {
    lines.push(`**Wave Progress:** ${workflow.currentWave}/${workflow.totalWaves}`);
  }

  if (execution.activeCheckpointId) {
    lines.push(`**Active Checkpoint:** ${execution.activeCheckpointId}`);
  }

  if (execution.pendingTasks.length > 0) {
    lines.push(`**Pending Tasks:** ${execution.pendingTasks.length}`);
  }

  return lines.join("\n");
}

/**
 * Build complete enforcement context (state + phase rules)
 */
export function buildEnforcementContext(state: GoopState): string {
  const stateContext = buildStateContext(state);
  const phaseEnforcement = buildPhaseEnforcement(state.workflow.phase, state);

  if (!phaseEnforcement) {
    return stateContext;
  }

  return `${stateContext}\n\n${phaseEnforcement}`;
}

/**
 * Get enforcement rules for a specific phase
 */
export function getPhaseEnforcement(phase: WorkflowPhase): PhaseEnforcement {
  const rules = PHASE_ENFORCEMENT[phase];
  return {
    phase,
    ...rules,
  };
}

/**
 * Check if an operation is allowed in the current phase
 */
export function isOperationAllowed(
  phase: WorkflowPhase,
  operation: "write_code" | "create_doc" | "delegate" | "transition"
): { allowed: boolean; reason?: string } {
  switch (operation) {
    case "write_code":
      if (phase === "plan" || phase === "research" || phase === "specify") {
        return {
          allowed: false,
          reason: `Cannot write implementation code in ${phase} phase. Complete planning first.`,
        };
      }
      if (phase === "execute") {
        return {
          allowed: false,
          reason: "Orchestrator should delegate code work to executor agent, not write directly.",
        };
      }
      return { allowed: true };

    case "create_doc":
      return { allowed: true };

    case "delegate":
      if (phase === "idle" || phase === "plan") {
        return {
          allowed: false,
          reason: `Cannot delegate implementation work in ${phase} phase. Complete requirements first.`,
        };
      }
      return { allowed: true };

    case "transition":
      return { allowed: true }; // Transitions have their own validation

    default:
      return { allowed: true };
  }
}
