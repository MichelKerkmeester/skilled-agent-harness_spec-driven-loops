/**
 * Command Processor Hook
 * Intercepts slash command tool output to trigger phase transitions
 * 
 * @module hooks/command-processor
 */

import { join } from "path";
import type { PluginContext, WorkflowPhase, ADLEntry, WorkflowDepth } from "../core/types.js";
import { scaffoldPhaseDocuments } from "../features/enforcement/scaffolder.js";
import { log, logError } from "../shared/logger.js";

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

const COMMAND_PHASES: Record<string, WorkflowPhase> = {
  "goop-plan": "plan",
  "goop-discuss": "plan",  // discuss also starts planning phase
  "goop-research": "research",
  "goop-specify": "specify",
  "goop-execute": "execute",
  "goop-accept": "accept",
  "goop-complete": "idle",  // completing returns to idle
};

/**
 * Create command processor hook
 */
export function createCommandProcessor(ctx: PluginContext) {
  return {
    "tool.execute.after": async (
      input: ToolExecuteAfterInput,
      output: ToolExecuteAfterOutput
    ): Promise<void> => {
      // Handle both internal name and MCP-prefixed name
      const toolName = input.tool.replace(/^mcp_/, "");
      if (toolName !== "slashcommand") {
        return;
      }

      const commandText = getCommandText(output);
      const parsed = commandText ? parseCommandText(commandText) : null;
      if (!parsed) {
        return;
      }

  const phase = COMMAND_PHASES[parsed.name];
  const shouldUpdateFlags = parsed.name === "goop-plan" || parsed.name === "goop-discuss" || parsed.name === "goop-quick";
  if (!phase && !shouldUpdateFlags) {
    return;
  }

  // Get current phase to determine if we need to force transition
  const currentPhase = ctx.stateManager.getState().workflow.phase;
  
  // Force transition from idle since user explicitly requested a command
  // Also force if current phase is same as target (restart scenario)
  const shouldForce = currentPhase === "idle" || currentPhase === phase;
  const transitioned = phase ? ctx.stateManager.transitionPhase(phase, shouldForce) : false;
  
  log("Command processor phase transition", {
    command: parsed.name,
    currentPhase,
    targetPhase: phase,
    shouldForce,
    transitioned,
  });
  let scaffoldResult: Awaited<ReturnType<typeof scaffoldPhaseDocuments>> | null = null;
  let phaseName = "";

  if (shouldUpdateFlags) {
    const defaults = parsed.name === "goop-quick"
      ? { depth: "shallow" as WorkflowDepth, researchOptIn: false }
      : { depth: "standard" as WorkflowDepth, researchOptIn: false };
    const depth = inferDepth(parsed.args, defaults.depth);
    const researchOptIn = inferResearchOptIn(parsed.args, defaults.researchOptIn);
    ctx.stateManager.updateWorkflow({ depth, researchOptIn });
  }

  if (parsed.name === "goop-plan") {
    phaseName = parsed.args || "plan";
    scaffoldResult = await scaffoldPhaseDocuments(ctx, phaseName, "plan");
  }

  if (phase && !transitioned) {
    logError(`Command processor failed to transition to ${phase}`);
  }

      if (scaffoldResult && !scaffoldResult.success) {
        logError("Command processor failed to scaffold phase documents", scaffoldResult.errors);
      }

      const files = scaffoldResult
        ? scaffoldResult.documentsCreated.map((doc) => join(scaffoldResult!.phaseDir, doc))
        : undefined;

  const actionParts: string[] = [];
  if (phase) {
    actionParts.push(`Transitioned to ${phase}`);
  }
  if (shouldUpdateFlags) {
    actionParts.push("Updated workflow depth and research flags");
  }
  if (scaffoldResult) {
    const scaffoldStatus = scaffoldResult.success ? "scaffolded" : "failed to scaffold";
    const docCount = scaffoldResult.documentsCreated.length;
    const namePart = phaseName ? ` for phase "${phaseName}"` : "";
    actionParts.push(`${scaffoldStatus} ${docCount} documents${namePart}`);
        if (!scaffoldResult.success && scaffoldResult.errors.length > 0) {
          actionParts.push(`errors: ${scaffoldResult.errors.join("; ")}`);
        }
      }

  const adlEntry: ADLEntry = {
    timestamp: new Date().toISOString(),
    type: "observation",
    description: `Slash command "/${parsed.name}" processed`,
    action: transitioned || shouldUpdateFlags
      ? actionParts.join("; ")
      : `Transition to ${phase} rejected`,
    files,
  };

      ctx.stateManager.appendADL(adlEntry);
  log("Command processor handled slash command", {
    command: parsed.name,
    phase: phase || undefined,
    transitioned,
    phaseName: phaseName || undefined,
  });
    },
  };
}

function getCommandText(output: ToolExecuteAfterOutput): string | null {
  const metadataCommand = extractCommandFromMetadata(output.metadata);
  if (metadataCommand) {
    return metadataCommand;
  }

  return extractCommandFromOutput(output.output);
}

function extractCommandFromMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const record = metadata as Record<string, unknown>;
  if (typeof record.command === "string") {
    return record.command;
  }

  const args = record.args;
  if (args && typeof args === "object") {
    const argsRecord = args as Record<string, unknown>;
    if (typeof argsRecord.command === "string") {
      return argsRecord.command;
    }
  }

  return null;
}

function extractCommandFromOutput(output: string): string | null {
  if (!output) {
    return null;
  }

  const match = output.match(/^#\s*\/([^\s]+)\s+Command/m);
  if (!match) {
    return null;
  }

  return match[1];
}

function parseCommandText(raw: string): { name: string; args: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(/^\//, "");
  const [name, ...rest] = normalized.split(/\s+/);
  if (!name) {
    return null;
  }

  return {
    name: name.toLowerCase(),
    args: rest.join(" ").trim(),
  };
}

function inferDepth(args: string, fallback: WorkflowDepth): WorkflowDepth {
  if (!args) {
    return fallback;
  }

  if (/\b(deep|in-depth|thorough|detailed|exhaustive|deep dive)\b/i.test(args)) {
    return "deep";
  }

  if (/\b(shallow|brief|lightweight|minimal|surface|quick)\b/i.test(args)) {
    return "shallow";
  }

  return fallback;
}

function inferResearchOptIn(args: string, fallback: boolean): boolean {
  if (!args) {
    return fallback;
  }

  if (/\b(no\s+research|without\s+research|skip\s+research|--no-research)\b/i.test(args)) {
    return false;
  }

  if (/\b(research|explore|investigate|analysis)\b/i.test(args)) {
    return true;
  }

  return fallback;
}
