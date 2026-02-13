/**
 * Workflow Memory Integration
 * Adds memory operations to each workflow phase
 * 
 * @module features/workflow-memory/phase-hooks
 */

import type { WorkflowPhase, MemoryInput, MemoryManager } from "../../core/types.js";
import { log } from "../../shared/logger.js";

export interface PhaseMemoryConfig {
  enabled: boolean;
  autoSaveOnTransition: boolean;
  importance: {
    plan: number;
    research: number;
    specify: number;
    execute: number;
    accept: number;
  };
}

const DEFAULT_CONFIG: PhaseMemoryConfig = {
  enabled: true,
  autoSaveOnTransition: true,
  importance: {
    plan: 0.6,
    research: 0.7,
    specify: 0.8,  // Spec decisions are important
    execute: 0.5,
    accept: 0.7,
  },
};

/**
 * Memory entry templates for each phase
 */
const PHASE_TEMPLATES: Record<WorkflowPhase, (data: Record<string, unknown>) => MemoryInput | null> = {
  idle: () => null,
  
  plan: (data) => ({
    type: "note",
    title: `Project Intent: ${data.projectName || "Unnamed"}`,
    content: `Intent: ${data.intent || "Not specified"}\n\nRequirements:\n${data.requirements || "Not specified"}`,
    concepts: ["planning", "requirements", "intent"],
    importance: DEFAULT_CONFIG.importance.plan,
  }),
  
  research: (data) => ({
    type: "observation",
    title: `Research: ${data.topic || "General"}`,
    content: `Research findings:\n${data.findings || "Not specified"}\n\nRecommendations:\n${data.recommendations || "None"}`,
    concepts: ["research", "analysis", ...(data.concepts as string[] || [])],
    importance: DEFAULT_CONFIG.importance.research,
  }),
  
  specify: (data) => ({
    type: "decision",
    title: `Spec Locked: ${data.specName || "Unnamed"}`,
    content: `Specification locked.\n\nMust-haves:\n${data.mustHaves || "Not specified"}\n\nOut of scope:\n${data.outOfScope || "Not specified"}`,
    concepts: ["specification", "contract", "requirements"],
    importance: DEFAULT_CONFIG.importance.specify,
  }),
  
  execute: (data) => ({
    type: "note",
    title: `Wave ${data.wave || "?"} Complete`,
    content: `Completed wave ${data.wave} of ${data.totalWaves}.\n\nTasks completed:\n${data.tasks || "Not specified"}`,
    concepts: ["execution", "progress", "implementation"],
    importance: DEFAULT_CONFIG.importance.execute,
  }),
  
  accept: (data) => ({
    type: "observation",
    title: `Project Accepted: ${data.projectName || "Unnamed"}`,
    content: `Project completed and accepted.\n\nDelivered:\n${data.delivered || "Not specified"}\n\nLearnings:\n${data.learnings || "None"}`,
    concepts: ["completion", "acceptance", "delivery"],
    importance: DEFAULT_CONFIG.importance.accept,
  }),
};

/**
 * Create memory entry for a phase transition
 */
export function createPhaseMemoryEntry(
  fromPhase: WorkflowPhase,
  _toPhase: WorkflowPhase,
  data: Record<string, unknown>
): MemoryInput | null {
  // Use the 'from' phase template to summarize what was done
  const template = PHASE_TEMPLATES[fromPhase];
  if (!template) {
    return null;
  }
  
  return template(data);
}

/**
 * Generate memory search query for a phase
 */
export function getPhaseSearchQuery(phase: WorkflowPhase, context: string): {
  query: string;
  concepts: string[];
} {
  const queries: Record<WorkflowPhase, { query: string; concepts: string[] }> = {
    idle: { query: context, concepts: [] },
    plan: { 
      query: `past requirements for ${context}`, 
      concepts: ["planning", "requirements"] 
    },
    research: { 
      query: `previous research on ${context}`, 
      concepts: ["research", "analysis", "technology"] 
    },
    specify: { 
      query: `past specifications similar to ${context}`, 
      concepts: ["specification", "contract"] 
    },
    execute: { 
      query: `implementation patterns for ${context}`, 
      concepts: ["implementation", "patterns"] 
    },
    accept: { 
      query: `past deliveries related to ${context}`, 
      concepts: ["completion", "delivery"] 
    },
  };
  
  return queries[phase] || { query: context, concepts: [] };
}

/**
 * Create a phase memory hook handler
 */
export function createPhaseMemoryHook(
  memoryManager: MemoryManager | undefined,
  config: Partial<PhaseMemoryConfig> = {}
) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  return {
    /**
     * Called before entering a new phase
     */
    async onPhaseEnter(phase: WorkflowPhase, context: string): Promise<string[]> {
      if (!cfg.enabled || !memoryManager) {
        return [];
      }
      
      // Search for relevant memories
      const searchParams = getPhaseSearchQuery(phase, context);
      
      try {
        const results = await memoryManager.search({
          query: searchParams.query,
          concepts: searchParams.concepts,
          limit: 5,
        });
        
        log("Phase memory search", { phase, resultCount: results.length });
        
        return results.map(r => r.memory.content);
      } catch (error) {
        log("Phase memory search failed", { phase, error });
        return [];
      }
    },
    
    /**
     * Called when leaving a phase
     */
    async onPhaseExit(
      fromPhase: WorkflowPhase,
      toPhase: WorkflowPhase,
      data: Record<string, unknown>
    ): Promise<void> {
      if (!cfg.enabled || !cfg.autoSaveOnTransition || !memoryManager) {
        return;
      }
      
      const entry = createPhaseMemoryEntry(fromPhase, toPhase, data);
      
      if (entry) {
        try {
          await memoryManager.save(entry);
          log("Phase memory saved", { fromPhase, toPhase });
        } catch (error) {
          log("Phase memory save failed", { fromPhase, error });
        }
      }
    },
  };
}
