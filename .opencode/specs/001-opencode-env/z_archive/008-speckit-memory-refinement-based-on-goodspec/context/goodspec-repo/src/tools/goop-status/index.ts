/**
 * GoopSpec Status Tool
 * Shows current workflow state, phase, and pending tasks
 * 
 * @module tools/goop-status
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, GoopState, ToolContext } from "../../core/types.js";

/**
 * Generate a text progress bar
 */
function generateProgressBar(progress: number, width: number = 10): string {
  const filled = Math.round(progress * width);
  const empty = width - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}

interface PhaseGuidance {
  current: string;
  next: { command: string; description: string };
  alternatives: Array<{ command: string; when: string }>;
}

/**
 * Get guidance for current phase including next steps
 */
function getPhaseGuidance(phase: string, specLocked: boolean): PhaseGuidance {
  const guidance: Record<string, PhaseGuidance> = {
    idle: {
      current: "No active workflow. Ready for a new task.",
      next: { command: "/goop-plan", description: "Start planning a new feature or task" },
      alternatives: [
        { command: "/goop-quick", when: "for small, well-defined fixes" },
        { command: "/goop-resume", when: "to continue from a saved checkpoint" },
      ],
    },
    plan: {
      current: "Gathering requirements and defining scope.",
      next: { command: "/goop-specify", description: "Lock the specification when requirements are clear" },
      alternatives: [
        { command: "/goop-research", when: "if there are unknowns to investigate" },
        { command: "/goop-pause", when: "to save progress and continue later" },
      ],
    },
    research: {
      current: "Investigating unknowns and gathering technical context.",
      next: { command: "/goop-specify", description: "Lock the spec with research findings applied" },
      alternatives: [
        { command: "/goop-plan", when: "to refine the plan with research insights" },
        { command: "/goop-research", when: "for additional research on related topics" },
      ],
    },
    specify: specLocked ? {
      current: "Specification is locked. Ready for implementation.",
      next: { command: "/goop-execute", description: "Begin wave-based implementation" },
      alternatives: [
        { command: "/goop-amend", when: "to modify the locked specification" },
      ],
    } : {
      current: "Reviewing specification before locking.",
      next: { command: "/goop-specify", description: "Confirm and lock the specification" },
      alternatives: [
        { command: "/goop-plan", when: "to revise requirements" },
      ],
    },
    execute: {
      current: "Implementing the blueprint in waves.",
      next: { command: "/goop-accept", description: "Verify work and request acceptance when complete" },
      alternatives: [
        { command: "/goop-status", when: "to check wave progress" },
        { command: "/goop-pause", when: "to save a checkpoint and continue later" },
      ],
    },
    accept: {
      current: "Verifying implementation against specification.",
      next: { command: "/goop-complete", description: "Archive and mark as complete" },
      alternatives: [
        { command: "/goop-execute", when: "if issues need to be fixed" },
        { command: "/goop-milestone", when: "to start the next milestone" },
      ],
    },
  };
  
  return guidance[phase] || {
    current: "Unknown phase.",
    next: { command: "/goop-status", description: "Check current state" },
    alternatives: [],
  };
}

/**
 * Format next steps from phase guidance
 */
function formatNextSteps(guidance: PhaseGuidance): string[] {
  const lines: string[] = [];
  
  lines.push(`**Current:** ${guidance.current}`);
  lines.push("");
  lines.push(`👉 **Next:** \`${guidance.next.command}\` - ${guidance.next.description}`);
  
  if (guidance.alternatives.length > 0) {
    lines.push("");
    lines.push("**Alternatives:**");
    for (const alt of guidance.alternatives) {
      lines.push(`- \`${alt.command}\` ${alt.when}`);
    }
  }
  
  return lines;
}

/**
 * Format workflow status for display
 */
function formatStatus(state: GoopState | null, verbose: boolean, ctx: PluginContext): string {
  const lines: string[] = [];
  
  lines.push("# GoopSpec Status\n");
  
  // Handle missing or incomplete state
  if (!state) {
    lines.push("**Status:** Not initialized");
    lines.push("\nRun `/goop-plan` to start a new project.");
    return lines.join("\n");
  }
  
  // Project info
  const projectName = state.project?.name || "Unknown";
  const initialized = state.project?.initialized || "Not set";
  lines.push(`**Project:** ${projectName}`);
  lines.push(`**Initialized:** ${initialized}\n`);
  
  // Workflow status with new fields
  const workflow = state.workflow || { 
    phase: "idle", 
    mode: "standard",
    depth: "standard",
    researchOptIn: false,
    specLocked: false,
    acceptanceConfirmed: false,
    currentWave: 0,
    totalWaves: 0,
    lastActivity: "Never" 
  };
  
  lines.push("## Workflow");
  
  // Phase display with visual indicator
  const phaseIcons: Record<string, string> = {
    idle: "⚪",
    plan: "📝",
    research: "🔍",
    specify: "📋",
    execute: "🔨",
    accept: "✅",
  };
  const phaseIcon = phaseIcons[workflow.phase] || "⚪";
  lines.push(`- **Phase:** ${phaseIcon} ${workflow.phase || "idle"}`);
  
  // Mode
  const modeIcons: Record<string, string> = {
    quick: "⚡",
    standard: "📦",
    comprehensive: "🏗️",
    milestone: "🎯",
  };
  const modeIcon = modeIcons[workflow.mode] || "📦";
  lines.push(`- **Mode:** ${modeIcon} ${workflow.mode || "standard"}`);
  
  // Contract gates
  lines.push(`- **Spec Locked:** ${workflow.specLocked ? "🔒 Yes" : "🔓 No"}`);
  lines.push(`- **Accepted:** ${workflow.acceptanceConfirmed ? "✅ Yes" : "⏳ Pending"}`);
  
  // Wave progress (only show if in execute phase or has waves)
  if (workflow.totalWaves > 0) {
    const progress = workflow.currentWave / workflow.totalWaves;
    const progressBar = generateProgressBar(progress);
    lines.push(`- **Wave Progress:** ${workflow.currentWave}/${workflow.totalWaves} ${progressBar}`);
  }
  
  lines.push(`- **Last Activity:** ${workflow.lastActivity || "Never"}\n`);
  
  // Execution state
  const execution = state.execution || { 
    completedPhases: [], 
    activeCheckpointId: null, 
    pendingTasks: [],
    currentMilestone: undefined
  };
  
  lines.push("## Execution");
  
  if (execution.currentMilestone) {
    lines.push(`- **Current Milestone:** ${execution.currentMilestone}`);
  }
  
  lines.push(`- **Completed Phases:** ${
    execution.completedPhases?.length > 0 
      ? execution.completedPhases.join(" → ") 
      : "None"
  }`);
  lines.push(`- **Active Checkpoint:** ${execution.activeCheckpointId || "None"}`);
  lines.push(`- **Pending Tasks:** ${execution.pendingTasks?.length || 0}`);
  
  // Verbose: show pending tasks
  if (verbose && execution.pendingTasks?.length > 0) {
    lines.push("\n### Pending Tasks");
    for (const task of execution.pendingTasks) {
      const statusIcon = {
        pending: "⏳",
        in_progress: "🔄",
        completed: "✅",
        failed: "❌",
      }[task.status] || "⏳";
      lines.push(`- ${statusIcon} ${task.name} (${task.phase}/${task.plan})`);
    }
  }
  
  // Recent memory (if available and verbose)
  if (verbose && ctx.memoryManager) {
    lines.push("\n## Recent Memory");
    // Would fetch recent memories here
    lines.push("- Use `memory_search` to find relevant context");
  }
  
  // Next steps guidance based on current phase
  lines.push("\n## Next Steps");
  const guidance = getPhaseGuidance(workflow.phase, workflow.specLocked);
  const nextSteps = formatNextSteps(guidance);
  for (const step of nextSteps) {
    lines.push(step);
  }
  
  return lines.join("\n");
}

/**
 * Create the goop_status tool
 */
export function createGoopStatusTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Show current GoopSpec workflow state, phase, and pending tasks",
    args: {
      verbose: tool.schema.boolean().optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      const state = ctx.stateManager.getState();
      return formatStatus(state, args.verbose ?? false, ctx);
    },
  });
}
