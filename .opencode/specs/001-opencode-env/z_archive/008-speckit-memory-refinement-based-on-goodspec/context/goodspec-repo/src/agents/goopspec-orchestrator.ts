/**
 * GoopSpec Orchestrator Agent Factory
 * Creates the primary orchestrator agent configuration
 * 
 * @module agents/goopspec-orchestrator
 */

import type { 
  ResourceResolver, 
  ResolvedResource,
  PhaseGateMode, 
  WaveExecutionMode 
} from "../core/types.js";
import { buildOrchestratorPrompt } from "./prompt-sections/index.js";
import { log } from "../shared/logger.js";

// ============================================================================
// Types
// ============================================================================

export interface OrchestratorOptions {
  model?: string;
  thinkingBudget?: number;
  phaseGates?: PhaseGateMode;
  waveExecution?: WaveExecutionMode;
  resolver: ResourceResolver;
}

export interface OrchestratorAgentConfig {
  name: string;
  mode: "primary";
  model: string;
  thinking: { type: "enabled"; budgetTokens: number };
  prompt: string;
  description: string;
  color: string;
  permission: Record<string, string>;
}

// ============================================================================
// Agent Factory
// ============================================================================

/**
 * Create the GoopSpec orchestrator agent configuration
 * 
 * This is the primary user-facing agent that:
 * - Controls the 5-phase workflow (Discuss → Plan → Execute → Audit → Confirm)
 * - Delegates to specialized sub-agents
 * - Manages phase gates and wave execution
 */
export function createGoopSpecOrchestrator(options: OrchestratorOptions): OrchestratorAgentConfig {
  const { resolver } = options;
  
  // Get available sub-agents and skills for dynamic prompt generation
  const availableAgents = resolver.resolveAll("agent");
  const availableSkills = resolver.resolveAll("skill");
  
  log("Building GoopSpec orchestrator", {
    agentCount: availableAgents.length,
    skillCount: availableSkills.length,
    phaseGates: options.phaseGates ?? "ask",
    waveExecution: options.waveExecution ?? "sequential",
  });

  // Build the dynamic prompt based on available resources
  const prompt = buildOrchestratorPrompt({
    phaseGates: options.phaseGates ?? "ask",
    waveExecution: options.waveExecution ?? "sequential",
    availableAgents,
    availableSkills,
  });

  return {
    // NOTE: name MUST match the registration key in config-handler.ts
    // OpenCode looks up agents by name when switching via Tab
    name: "goopspec",
    mode: "primary",
    model: options.model ?? "anthropic/claude-opus-4-5",
    thinking: { 
      type: "enabled", 
      budgetTokens: options.thinkingBudget ?? 32000 
    },
    prompt,
    description: "GoopSpec Orchestrator - Spec-driven development (Plan → Research → Specify → Execute → Accept)",
    color: "#65f463", // Green to distinguish GoopSpec
    permission: {
      // GoopSpec tools
      goop_delegate: "allow",
      goop_skill: "allow",
      goop_status: "allow",
      goop_adl: "allow",
      goop_spec: "allow",
      goop_checkpoint: "allow",
      // Standard tools
      question: "allow",
      todowrite: "allow",
      todoread: "allow",
      read: "allow",
      glob: "allow",
      grep: "allow",
      edit: "allow",
      write: "allow",
      bash: "allow",
      task: "allow",
    },
  };
}

/**
 * Extract agent names from resolved resources for prompt building
 */
export function getAgentNames(agents: ResolvedResource[]): string[] {
  return agents
    .map(a => a.frontmatter.name || a.name)
    .filter((name): name is string => typeof name === "string");
}

/**
 * Extract skill names from resolved resources for prompt building
 */
export function getSkillNames(skills: ResolvedResource[]): string[] {
  return skills
    .map(s => s.frontmatter.name || s.name)
    .filter((name): name is string => typeof name === "string");
}
