export { 
  createResearchPlan, 
  formatResearchPlan, 
  updateTaskStatus,
  isResearchComplete,
  getResearchProgress
} from "./manager.js";
export type { ResearchTask, ResearchPlan, ParallelResearchConfig } from "./manager.js";

export { consolidateFindings, formatResearchMarkdown } from "./consolidator.js";
export type { ConsolidatedFindings } from "./consolidator.js";

export {
  executeResearchPlan,
  cancelResearchExecution,
  getExecutionStatus,
  createResearchExecutor,
} from "./executor.js";
export type { ResearchExecutionResult, ResearchExecutorConfig } from "./executor.js";

export type {
  ResearchTaskStatus,
  ResearchFocus,
  ResearchAgentType,
  ResearchPriority,
  ResearchQuality,
  ResearchMetadata,
  ResearchFinding,
  ResearchRecommendation,
  ResearchOutput,
} from "./types.js";
