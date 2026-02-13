/**
 * Setup Feature Types
 * Type definitions for the GoopSpec setup system
 * 
 * @module features/setup/types
 */

// Note: MemorySystemConfig is in core/types.ts but we define our own setup-specific input type

// ============================================================================
// Action Types
// ============================================================================

/**
 * All available setup actions
 */
export type SetupAction_Type = 
  | "detect"     // Show current environment state
  | "plan"       // Preview changes before applying
  | "apply"      // Execute configuration changes
  | "models"     // Show agent model suggestions
  | "init"       // Full first-time initialization
  | "verify"     // Health check all systems
  | "reset"      // Reset configuration to defaults
  | "status";    // Show current configuration summary

// ============================================================================
// Environment Detection
// ============================================================================

/**
 * Setup environment detection result
 */
export interface SetupEnvironment {
  /** Whether OpenCode config exists */
  hasOpenCodeConfig: boolean;
  /** Whether global GoopSpec config exists */
  hasGlobalGoopSpecConfig: boolean;
  /** Whether project GoopSpec config exists */
  hasProjectGoopSpecConfig: boolean;
  /** Whether .goopspec directory exists */
  hasGoopspecDir: boolean;
  /** Whether state.json exists */
  hasStateFile: boolean;
  /** Whether ADL.md exists */
  hasADLFile: boolean;
  /** Whether memory directory exists */
  hasMemoryDir: boolean;
  /** List of already installed MCPs */
  existingMcps: string[];
  /** Path to OpenCode config file */
  opencodeConfigPath: string;
  /** Path to global GoopSpec config file */
  globalConfigPath: string;
  /** Path to project GoopSpec config file */
  projectConfigPath: string;
  /** Path to .goopspec directory */
  goopspecDir: string;
}

/**
 * Setup input from user (interactive or CLI args)
 */
export interface SetupInput {
  /** Where to write configuration */
  scope: "global" | "project" | "both";
  /** Project name (for init action) */
  projectName?: string;
  /** Model configuration */
  models: {
    /** Orchestrator model (default: claude-opus-4-5) */
    orchestrator?: string;
    /** Default model for agents */
    default?: string;
  };
  /** MCP preset selection */
  mcpPreset: "core" | "recommended" | "none";
  /** Custom MCP selection (if preset is "custom") */
  mcpSelection?: {
    context7?: boolean;
    exa?: boolean;
    playwright?: boolean;
    memory?: boolean;
    github?: boolean;
    sqlite?: boolean;
  };
  /** Whether to enable orchestrator as default agent */
  enableOrchestrator?: boolean;
  /** Per-agent model configuration */
  agentModels?: Record<string, string>;
  /** Memory system configuration */
  memory?: MemorySetupInput;
}

/**
 * Memory system setup input
 */
export interface MemorySetupInput {
  /** Whether to enable memory system (default: true) */
  enabled?: boolean;
  /** Worker port (default: 37777) */
  workerPort?: number;
  /** Embedding provider */
  embeddings?: {
    /** Provider type: local (free), openai (paid), ollama (local) */
    provider?: "local" | "openai" | "ollama";
    /** Model name (provider-specific) */
    model?: string;
    /** Embedding dimensions */
    dimensions?: number;
  };
  /** Privacy settings */
  privacy?: {
    /** Enable privacy features */
    enabled?: boolean;
    /** Retention period in days */
    retentionDays?: number;
    /** Maximum memories to store */
    maxMemories?: number;
  };
}

/**
 * Planned setup actions
 */
export interface SetupPlan {
  /** List of actions to perform */
  actions: SetupAction[];
  /** Human-readable summary */
  summary: string;
  /** MCPs that need to be installed */
  mcpsToInstall: string[];
  /** Configs that will be written */
  configsToWrite: ConfigWrite[];
  /** Per-agent model configuration */
  agentModels?: Record<string, string>;
  /** Directories to create */
  dirsToCreate?: string[];
  /** Memory configuration to apply */
  memoryConfig?: MemorySetupInput;
  /** Whether this is an init operation */
  isInit?: boolean;
  /** Project name (for init) */
  projectName?: string;
}

/**
 * Individual setup action (planned operation)
 */
export interface SetupAction {
  /** Type of action */
  type: "write_config" | "install_mcp" | "update_schema" | "create_dir" | "init_state" | "init_memory";
  /** Target file or resource */
  target: string;
  /** Changes to apply */
  changes: Record<string, unknown>;
  /** Human-readable description */
  description: string;
}

/**
 * Configuration write operation
 */
export interface ConfigWrite {
  /** Path to config file */
  path: string;
  /** Scope of config */
  scope: "global" | "project" | "opencode";
  /** Config content to write */
  content: Record<string, unknown>;
}

/**
 * Setup execution result
 */
export interface SetupResult {
  /** Whether setup succeeded */
  success: boolean;
  /** List of config files written */
  configsWritten: string[];
  /** List of MCPs installed */
  mcpsInstalled: string[];
  /** Any errors encountered */
  errors: string[];
  /** Any warnings generated */
  warnings: string[];
}

/**
 * MCP preset definitions
 */
export const MCP_PRESETS = {
  core: ["context7", "exa"],
  recommended: ["context7", "exa", "playwright"],
  none: [],
} as const;

export type McpPreset = keyof typeof MCP_PRESETS;

// ============================================================================
// Verification Types
// ============================================================================

/**
 * Individual verification check result
 */
export interface VerificationCheck {
  /** Name of the check */
  name: string;
  /** Whether the check passed */
  passed: boolean;
  /** Status message */
  message: string;
  /** Suggested fix if failed */
  suggestedFix?: string;
  /** Additional details */
  details?: Record<string, unknown>;
}

/**
 * Complete verification result
 */
export interface VerificationResult {
  /** Overall verification passed */
  success: boolean;
  /** Timestamp of verification */
  timestamp: string;
  /** All check results */
  checks: VerificationCheck[];
  /** Summary counts */
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

// ============================================================================
// Init Types
// ============================================================================

/**
 * Init action result
 */
export interface InitResult {
  /** Whether initialization succeeded */
  success: boolean;
  /** Project name */
  projectName: string;
  /** Files/directories created */
  created: string[];
  /** Configuration written */
  configsWritten: string[];
  /** MCPs installed */
  mcpsInstalled: string[];
  /** Any errors */
  errors: string[];
  /** Any warnings */
  warnings: string[];
}

// ============================================================================
// Reset Types
// ============================================================================

/**
 * Reset options
 */
export interface ResetOptions {
  /** Reset scope */
  scope: "global" | "project" | "both";
  /** Whether to preserve user data (memories, history, checkpoints) */
  preserveData?: boolean;
  /** Explicit confirmation for destructive reset */
  confirmed?: boolean;
}

/**
 * Reset result
 */
export interface ResetResult {
  /** Whether reset succeeded */
  success: boolean;
  /** What was reset */
  reset: string[];
  /** What was preserved */
  preserved: string[];
  /** Any errors */
  errors: string[];
}

// ============================================================================
// Status Types
// ============================================================================

/**
 * Current configuration status
 */
export interface SetupStatus {
  /** Whether GoopSpec is initialized */
  initialized: boolean;
  /** Project name if initialized */
  projectName?: string;
  /** Configuration scope */
  scope: {
    hasGlobal: boolean;
    hasProject: boolean;
  };
  /** Memory system status */
  memory: {
    configured: boolean;
    enabled: boolean;
    provider?: string;
    workerRunning?: boolean;
  };
  /** MCP status */
  mcps: {
    installed: string[];
    missing: string[];
  };
  /** Agent models configured */
  agentModels: Record<string, string>;
}
