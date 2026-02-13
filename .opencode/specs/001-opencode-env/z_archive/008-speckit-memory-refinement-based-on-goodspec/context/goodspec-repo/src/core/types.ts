/**
 * Core types for GoopSpec plugin
 * @module core/types
 */

// PluginInput type is available when the plugin is loaded by OpenCode
// We define a minimal version here to avoid import issues
export interface MinimalPluginInput {
  client: unknown;
  project: { name: string };
  directory: string;
  worktree: string;
  serverUrl: URL;
}

export type ToolContext = import("@opencode-ai/plugin/tool").ToolContext;

// ============================================================================
// Resource Types
// ============================================================================

export type ResourceType = "agent" | "command" | "skill" | "reference" | "template";

export interface ResourceFrontmatter {
  name?: string;
  description?: string;
  model?: string;
  temperature?: number;
  tools?: string[];
  skills?: string[];
  references?: string[];
  [key: string]: unknown;
}

export interface ResolvedResource {
  name: string;
  path: string;
  type: ResourceType;
  frontmatter: ResourceFrontmatter;
  body: string;
  content: string; // full raw content
}

export interface ResourceResolver {
  resolve(type: ResourceType, name: string): ResolvedResource | null;
  resolveAll(type: ResourceType): ResolvedResource[];
  getDirectory(type: ResourceType): string | null;
  clearCache?: () => void;
}

// ============================================================================
// State Types
// ============================================================================

/**
 * Workflow phase represents the current stage in the GoopSpec workflow
 * - idle: No active workflow
 * - plan: Gathering requirements and planning (includes discuss phase for requirement discovery)
 * - research: Exploring codebase and technologies
 * - specify: Locking the specification (contract)
 * - execute: Implementing via wave-based execution
 * - accept: Verifying and accepting completion
 * 
 * Note: The "discuss" command maps to the "plan" phase internally, representing
 * the requirement discovery stage before formal planning.
 */
export type WorkflowPhase = "idle" | "plan" | "research" | "specify" | "execute" | "accept";

/**
 * Task mode determines the complexity and thoroughness of the workflow
 * - quick: Abbreviated workflow for small fixes
 * - standard: Normal workflow with all phases
 * - comprehensive: Detailed workflow with extra verification
 * - milestone: Multi-phase project with archiving
 */
export type TaskMode = "quick" | "standard" | "comprehensive" | "milestone";

/**
 * Workflow depth describes the desired level of investigation and rigor.
 * - shallow: minimal depth for quick changes
 * - standard: default depth for typical work
 * - deep: increased depth for thorough analysis
 */
export type WorkflowDepth = "shallow" | "standard" | "deep";

export interface GoopState {
  version: number;
  project: {
    name: string;
    initialized: string; // ISO timestamp
  };
  workflow: {
    /**
     * Named phase identifier for the current work item (e.g., "auth-feature", "phase-1")
     * This is the project-specific phase name, NOT the workflow stage.
     * Can be null if not in a named phase.
     * @deprecated Prefer `workflow.phase` for stage tracking. This field is reserved for future phase naming.
     */
    currentPhase: string | null;
    
    /**
     * Current workflow stage (idle, plan, research, specify, execute, accept)
     * This is the GoopSpec workflow stage, NOT the project phase name.
     */
    phase: WorkflowPhase;
    
    mode: TaskMode;
    depth: WorkflowDepth;
    researchOptIn: boolean;
    specLocked: boolean;
    acceptanceConfirmed: boolean;
    currentWave: number;
    totalWaves: number;
    lastActivity: string; // ISO timestamp
    
    /**
     * @deprecated Use `phase` instead. Kept for backward compatibility with existing state files.
     */
    status?: WorkflowPhase;
  };
  execution: {
    activeCheckpointId: string | null;
    completedPhases: WorkflowPhase[];
    pendingTasks: TaskInfo[];
    currentMilestone?: string;
  };
}

export interface TaskInfo {
  id: string;
  name: string;
  phase: string;
  plan: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string;
}

export interface CheckpointData {
  id: string;
  timestamp: string;
  state: GoopState;
  context?: Record<string, unknown>;
}

export interface HistoryEntry {
  timestamp: string;
  type: "tool_call" | "phase_change" | "checkpoint" | "decision";
  sessionId?: string;
  data: Record<string, unknown>;
}

export interface ADLEntry {
  timestamp: string;
  rule?: number; // deviation rule number
  type: "decision" | "deviation" | "observation";
  description: string;
  action: string;
  files?: string[];
}

// ============================================================================
// Configuration Types
// ============================================================================

export type EnforcementLevel = "assist" | "warn" | "strict";

export interface AgentConfig {
  model?: string;
  temperature?: number;
}

export interface McpConfig {
  context7?: boolean;
  exa?: boolean;
}

// ============================================================================
// Memory Configuration Types
// ============================================================================

export interface MemoryCaptureConfig {
  enabled?: boolean;
  captureToolUse?: boolean;
  captureMessages?: boolean;
  capturePhaseChanges?: boolean;
  skipTools?: string[];
  minImportanceThreshold?: number;
}

export interface MemoryInjectionConfig {
  enabled?: boolean;
  budgetTokens?: number;
  format?: "timeline" | "bullets" | "structured";
  priorityTypes?: MemoryType[];
}

export interface MemoryPrivacyConfig {
  enabled?: boolean;
  stripPatterns?: string[];
  privateTagEnabled?: boolean;
  retentionDays?: number;
  maxMemories?: number;
}

export interface MemoryEmbeddingsConfig {
  provider?: "local" | "openai" | "ollama";
  model?: string;
  dimensions?: number;
}

export interface MemorySystemConfig {
  enabled?: boolean;
  workerPort?: number;
  capture?: MemoryCaptureConfig;
  injection?: MemoryInjectionConfig;
  privacy?: MemoryPrivacyConfig;
  embeddings?: MemoryEmbeddingsConfig;
}

// ============================================================================
// Orchestrator Configuration Types
// ============================================================================

export type PhaseGateMode = "strict" | "automatic" | "ask";
export type WaveExecutionMode = "sequential" | "parallel";

export interface OrchestratorConfig {
  /** Enable the GoopSpec orchestrator as the default agent */
  enableAsDefault?: boolean;
  /** Model to use for the orchestrator (default: anthropic/claude-opus-4-5) */
  model?: string;
  /** Thinking budget for extended reasoning (default: 32000) */
  thinkingBudget?: number;
  /** Phase gate behavior: strict (confirm each phase), automatic (flow with checkpoints), ask (per-project) */
  phaseGates?: PhaseGateMode;
  /** Wave execution strategy: sequential (one at a time) or parallel (independent tasks together) */
  waveExecution?: WaveExecutionMode;
}

export interface GoopSpecConfig {
  projectName?: string;
  enforcement?: EnforcementLevel;
  constitution?: boolean;
  adlEnabled?: boolean;
  defaultModel?: string;
  agents?: Record<string, AgentConfig>;
  mcp?: McpConfig;
  /** Orchestrator agent configuration */
  orchestrator?: OrchestratorConfig;
  /** Memory system configuration */
  memory?: MemorySystemConfig;
}

// ============================================================================
// Plugin Context Types
// ============================================================================

export interface StateManager {
  getState(): GoopState;
  setState(state: Partial<GoopState>): void;
  updateWorkflow(updates: Partial<GoopState["workflow"]>): void;
  transitionPhase(to: WorkflowPhase, force?: boolean): boolean;
  lockSpec(): void;
  confirmAcceptance(): void;
  setMode(mode: TaskMode): void;
  updateWaveProgress(current: number, total: number): void;
  getADL(): string;
  appendADL(entry: ADLEntry): void;
  saveCheckpoint(id: string, data: Omit<CheckpointData, "id">): void;
  loadCheckpoint(id: string): CheckpointData | null;
  listCheckpoints(): string[];
  appendHistory(entry: HistoryEntry): void;
}

export interface PluginContext {
  input: MinimalPluginInput;
  config: GoopSpecConfig;
  resolver: ResourceResolver;
  stateManager: StateManager;
  memoryManager?: MemoryManager;
}

// ============================================================================
// Memory Manager Interface
// ============================================================================

export interface MemoryManager {
  save(input: MemoryInput): Promise<Memory>;
  search(options: SearchOptions): Promise<SearchResult[]>;
  getById(id: number): Promise<Memory | null>;
  getRecent(limit: number, types?: MemoryType[]): Promise<Memory[]>;
  update(id: number, updates: MemoryUpdate): Promise<Memory | null>;
  delete(id: number): Promise<boolean>;
  distill?(event: RawEvent): Promise<Memory | null>;
}

// Forward type declarations for memory system
export interface Memory {
  id: number;
  type: MemoryType;
  title: string;
  content: string;
  facts: string[];
  concepts: string[];
  sourceFiles: string[];
  importance: number;
  visibility: "public" | "private";
  phase?: string;
  sessionId?: string;
  createdAt: number;
  updatedAt: number;
  accessedAt: number;
  accessCount: number;
}

/**
 * Memory type values - used by both type definition and validation schemas
 */
export const MEMORY_TYPES = [
  "observation",
  "decision",
  "session_summary",
  "user_prompt",
  "note",
  "todo",
] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];

export interface MemoryInput {
  type: MemoryType;
  title: string;
  content: string;
  facts?: string[];
  concepts?: string[];
  sourceFiles?: string[];
  importance?: number;
  visibility?: "public" | "private";
  phase?: string;
  sessionId?: string;
}

export interface MemoryUpdate {
  title?: string;
  content?: string;
  facts?: string[];
  concepts?: string[];
  sourceFiles?: string[];
  importance?: number;
  visibility?: "public" | "private";
}

export interface SearchResult {
  memory: Memory;
  score: number;
  matchType: "fts" | "vector" | "hybrid";
  highlighted?: string;
}

export interface SearchOptions {
  query: string;
  limit?: number;
  types?: MemoryType[];
  concepts?: string[];
  minImportance?: number;
  includePrivate?: boolean;
}

export interface RawEvent {
  type: "tool_use" | "user_message" | "assistant_message" | "phase_change";
  timestamp: number;
  sessionId: string;
  data: Record<string, unknown>;
}

/**
 * Internal tool context for GoopSpec tools that need plugin context
 * Note: This is different from @opencode-ai/plugin/tool ToolContext
 * SDK's ToolContext has: sessionID, messageID, agent, directory, worktree, abort
 * Our GoopToolContext wraps the full plugin context for internal use
 */
export interface GoopToolContext {
  ctx: PluginContext;
}

export interface HookContext {
  ctx: PluginContext;
}

// ============================================================================
// Agent Types
// ============================================================================

export interface AgentDefinition {
  name: string;
  description: string;
  model: string;
  temperature: number;
  thinkingBudget?: number;
  mode?: string;
  tools: string[];
  skills: string[];
  references: string[];
  prompt: string;
}

// ============================================================================
// Command Types
// ============================================================================

export interface CommandDefinition {
  name: string;
  description: string;
  argumentHint?: string;
  model?: string;
  agent?: string;
  content: string;
}

// ============================================================================
// Skill Types
// ============================================================================

export interface SkillDefinition {
  name: string;
  description: string;
  category?: string;
  triggers?: string[];
  version?: string;
  content: string;
}

// ============================================================================
// OpenCode Client Types
// ============================================================================

/**
 * Configuration for creating an authenticated OpenCode client
 */
export interface OpenCodeClientConfig {
  /** Directory scope for API calls */
  directory?: string;
  /** Whether to create authenticated client when password is set */
  useAuth?: boolean;
}

/**
 * Result of a safe API call with error handling
 */
export interface SafeApiCallResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Prompt injection result with method tracking
 */
export interface PromptInjectionResult {
  success: boolean;
  /** Which method was used: session API, TUI fallback, or none (both failed) */
  method: "session" | "tui" | "none";
}
