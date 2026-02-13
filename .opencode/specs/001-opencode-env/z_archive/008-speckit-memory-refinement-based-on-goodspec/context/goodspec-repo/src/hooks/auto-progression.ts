/**
 * Auto-Progression Hook
 * Automatically advances workflow phases when conditions are met
 * 
 * Progression Rules:
 * - plan → specify: Manual (user must run /goop-specify)
 * - specify → execute: Auto when spec is locked via /goop-specify
 * - execute → accept: Auto when all waves complete
 * - accept → idle: Auto when user accepts via /goop-accept
 * 
 * @module hooks/auto-progression
 */

import type { PluginContext, WorkflowPhase } from "../core/types.js";
import { existsSync } from "fs";
import { join } from "path";
import { log } from "../shared/logger.js";
import { getProjectGoopspecDir } from "../shared/paths.js";

type ToolExecuteAfterInput = {
  tool: string;
  sessionID: string;
  callID: string;
};

type ToolExecuteAfterOutput = {
  title: string;
  output: string;
  metadata: unknown;
};

interface AutoProgressionConfig {
  /** Enable auto-progression */
  enabled: boolean;
  /** Auto-progress from specify to execute when spec is locked */
  specifyToExecute: boolean;
  /** Auto-progress from execute to accept when waves complete */
  executeToAccept: boolean;
  /** Auto-progress from accept to idle when accepted */
  acceptToIdle: boolean;
}

const DEFAULT_CONFIG: AutoProgressionConfig = {
  enabled: true,
  specifyToExecute: true,
  executeToAccept: true,
  acceptToIdle: true,
};

/**
 * Check if SPEC.md exists and contains locked status
 */
function isSpecLocked(ctx: PluginContext): boolean {
  return ctx.stateManager.getState().workflow.specLocked;
}

/**
 * Check if all waves are complete
 */
function areAllWavesComplete(ctx: PluginContext): boolean {
  const state = ctx.stateManager.getState();
  const { currentWave, totalWaves } = state.workflow;
  
  // No waves defined = not complete
  if (totalWaves <= 0) return false;
  
  // Current wave must be at or beyond total
  return currentWave >= totalWaves;
}

/**
 * Check if acceptance has been confirmed
 */
function isAcceptanceConfirmed(ctx: PluginContext): boolean {
  return ctx.stateManager.getState().workflow.acceptanceConfirmed;
}

/**
 * Check if BLUEPRINT.md exists (indicates execution can start)
 */
function hasBlueprintFile(ctx: PluginContext): boolean {
  const goopspecDir = getProjectGoopspecDir(ctx.input.directory);
  return existsSync(join(goopspecDir, "BLUEPRINT.md"));
}

/**
 * Generate auto-progression notification message
 */
function generateProgressionMessage(from: WorkflowPhase, to: WorkflowPhase, reason: string): string {
  return `

---

## 🔄 Auto-Progression: ${from} → ${to}

**Reason:** ${reason}

The workflow has automatically advanced to the **${to}** phase.

${to === "execute" ? `
### What's Next
The execution phase will now begin. Tasks from BLUEPRINT.md will be executed wave by wave.

Run \`/goop-status\` to see current progress.
` : ""}

${to === "accept" ? `
### What's Next
All waves are complete! The workflow is ready for acceptance.

Run \`/goop-accept\` to verify and accept the implementation.
` : ""}

${to === "idle" ? `
### Workflow Complete! 🎉
The work has been accepted and the workflow is now idle.

You can start a new task with \`/goop-plan\`.
` : ""}
`;
}

/**
 * Create auto-progression hook
 */
export function createAutoProgressionHook(ctx: PluginContext) {
  const config: AutoProgressionConfig = {
    ...DEFAULT_CONFIG,
    // Could override from ctx.config if we add auto-progression config
  };

  return {
    /**
     * tool.execute.after - Check for auto-progression conditions
     */
    "tool.execute.after": async (
      _input: ToolExecuteAfterInput,
      output: ToolExecuteAfterOutput
    ): Promise<void> => {
      if (!config.enabled) return;

      const state = ctx.stateManager.getState();
      const currentPhase = state.workflow.phase;

      // === SPECIFY → EXECUTE ===
      // When spec is locked and we're in specify phase
      if (config.specifyToExecute && 
          currentPhase === "specify" && 
          isSpecLocked(ctx) &&
          hasBlueprintFile(ctx)) {
        
        log("Auto-progression: specify → execute", {
          specLocked: true,
          hasBlueprint: true,
        });
        
        const success = ctx.stateManager.transitionPhase("execute");
        if (success) {
          ctx.stateManager.appendADL({
            timestamp: new Date().toISOString(),
            type: "observation",
            description: "Auto-progression: specify → execute",
            action: "Spec locked and blueprint ready. Automatically advancing to execute phase.",
          });
          
          // Append progression message to output
          output.output = output.output + generateProgressionMessage("specify", "execute", "Spec locked and BLUEPRINT.md is ready");
        }
      }

      // === EXECUTE → ACCEPT ===
      // When all waves are complete
      if (config.executeToAccept && 
          currentPhase === "execute" && 
          areAllWavesComplete(ctx)) {
        
        log("Auto-progression: execute → accept", {
          currentWave: state.workflow.currentWave,
          totalWaves: state.workflow.totalWaves,
        });
        
        const success = ctx.stateManager.transitionPhase("accept");
        if (success) {
          ctx.stateManager.appendADL({
            timestamp: new Date().toISOString(),
            type: "observation",
            description: "Auto-progression: execute → accept",
            action: `All ${state.workflow.totalWaves} waves complete. Automatically advancing to accept phase.`,
          });
          
          output.output = output.output + generateProgressionMessage("execute", "accept", `All ${state.workflow.totalWaves} waves complete`);
        }
      }

      // === ACCEPT → IDLE ===
      // When acceptance is confirmed
      if (config.acceptToIdle && 
          currentPhase === "accept" && 
          isAcceptanceConfirmed(ctx)) {
        
        log("Auto-progression: accept → idle", {
          acceptanceConfirmed: true,
        });
        
        const success = ctx.stateManager.transitionPhase("idle");
        if (success) {
          ctx.stateManager.appendADL({
            timestamp: new Date().toISOString(),
            type: "observation",
            description: "Auto-progression: accept → idle",
            action: "Work accepted. Workflow complete. Returning to idle.",
          });
          
          // Reset workflow state for next project
          ctx.stateManager.updateWorkflow({
            specLocked: false,
            acceptanceConfirmed: false,
            currentWave: 0,
            totalWaves: 0,
          });
          
          output.output = output.output + generateProgressionMessage("accept", "idle", "Work accepted by user");
        }
      }
    },
  };
}

// ============================================================================
// Utility Exports
// ============================================================================

/**
 * Manually trigger progression check
 * Useful for testing or forcing a check
 */
export function checkProgressionConditions(ctx: PluginContext): {
  canProgressToExecute: boolean;
  canProgressToAccept: boolean;
  canProgressToIdle: boolean;
  currentPhase: WorkflowPhase;
  specLocked: boolean;
  wavesComplete: boolean;
  acceptanceConfirmed: boolean;
} {
  const state = ctx.stateManager.getState();
  
  return {
    canProgressToExecute: state.workflow.phase === "specify" && isSpecLocked(ctx) && hasBlueprintFile(ctx),
    canProgressToAccept: state.workflow.phase === "execute" && areAllWavesComplete(ctx),
    canProgressToIdle: state.workflow.phase === "accept" && isAcceptanceConfirmed(ctx),
    currentPhase: state.workflow.phase,
    specLocked: state.workflow.specLocked,
    wavesComplete: areAllWavesComplete(ctx),
    acceptanceConfirmed: state.workflow.acceptanceConfirmed,
  };
}
