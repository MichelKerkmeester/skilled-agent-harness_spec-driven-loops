/**
 * GoopSpec Setup Module
 * Core setup logic: detect environment, plan changes, apply configuration
 * 
 * @module features/setup
 */

import { existsSync, readFileSync } from "fs";
import { getGlobalConfigPath, getProjectGoopspecDir, joinPath } from "../../shared/paths.js";
import { hasOpenCodeConfig, getOpenCodeConfigPath, readOpenCodeConfig, getExistingMcps } from "../../core/opencode-config.js";
import { DEFAULT_CONFIG, validateConfig } from "../../core/config.js";
import { installMcps } from "./mcp-installer.js";
import { log, logError } from "../../shared/logger.js";
import type { 
  SetupEnvironment, 
  SetupInput, 
  SetupPlan, 
  SetupAction, 
  SetupResult,
  ConfigWrite,
  VerificationResult,
  VerificationCheck,
  InitResult,
  ResetOptions,
  ResetResult,
  SetupStatus,
} from "./types.js";
import { MCP_PRESETS } from "./types.js";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { initializeGoopspec } from "../state-manager/manager.js";

// ============================================================================
// Environment Detection
// ============================================================================

/**
 * Detect current setup environment
 * Checks for existing configs, MCPs, and directory structure
 */
export async function detectEnvironment(projectDir: string): Promise<SetupEnvironment> {
  const globalConfigPath = getGlobalConfigPath();
  const goopspecDir = getProjectGoopspecDir(projectDir);
  const projectConfigPath = joinPath(goopspecDir, "config.json");
  const opencodeConfigPath = getOpenCodeConfigPath();
  const statePath = joinPath(goopspecDir, "state.json");
  const adlPath = joinPath(goopspecDir, "ADL.md");
  const memoryDir = joinPath(goopspecDir, "memory");
  
  const hasGlobal = existsSync(globalConfigPath);
  const hasProject = existsSync(projectConfigPath);
  const hasOpenCode = hasOpenCodeConfig();
  const hasGoopspecDir = existsSync(goopspecDir);
  const hasStateFile = existsSync(statePath);
  const hasADLFile = existsSync(adlPath);
  const hasMemoryDir = existsSync(memoryDir);
  
  let existingMcps: string[] = [];
  if (hasOpenCode) {
    try {
      const config = readOpenCodeConfig();
      existingMcps = getExistingMcps(config);
    } catch {
      // Ignore errors reading config
    }
  }
  
  log("Detected environment", {
    hasGlobal,
    hasProject,
    hasOpenCode,
    hasGoopspecDir,
    hasStateFile,
    hasADLFile,
    hasMemoryDir,
    existingMcps,
  });
  
  return {
    hasOpenCodeConfig: hasOpenCode,
    hasGlobalGoopSpecConfig: hasGlobal,
    hasProjectGoopSpecConfig: hasProject,
    hasGoopspecDir,
    hasStateFile,
    hasADLFile,
    hasMemoryDir,
    existingMcps,
    opencodeConfigPath,
    globalConfigPath,
    projectConfigPath,
    goopspecDir,
  };
}

// ============================================================================
// Planning Functions
// ============================================================================

/**
 * Plan setup actions based on user input
 * Returns a plan describing what will be changed
 */
export async function planSetup(input: SetupInput, env: SetupEnvironment): Promise<SetupPlan> {
  const actions: SetupAction[] = [];
  const configsToWrite: ConfigWrite[] = [];
  const dirsToCreate: string[] = [];
  
  // Determine which MCPs to install
  const mcpsToInstall: string[] = [];
  if (input.mcpPreset !== "none") {
    const presetMcps = MCP_PRESETS[input.mcpPreset];
    for (const mcp of presetMcps) {
      if (!env.existingMcps.includes(mcp)) {
        mcpsToInstall.push(mcp);
      }
    }
  }
  
  // Plan global config write
  if (input.scope === "global" || input.scope === "both") {
    const globalConfig: Record<string, unknown> = {
      ...DEFAULT_CONFIG,
      defaultModel: input.models.default ?? DEFAULT_CONFIG.defaultModel,
      orchestrator: {
        model: input.models.orchestrator ?? "anthropic/claude-opus-4-5",
        thinkingBudget: 32000,
      },
      mcp: {
        ...DEFAULT_CONFIG.mcp,
      },
    };
    
    // Add MCP preset to config
    if (input.mcpPreset !== "none") {
      const presetMcps = MCP_PRESETS[input.mcpPreset];
      for (const mcp of presetMcps) {
        (globalConfig.mcp as Record<string, boolean>)[mcp] = true;
      }
    }
    
    // Add agent model overrides to global config
    if (input.agentModels && Object.keys(input.agentModels).length > 0) {
      globalConfig.agents = {};
      for (const [agentName, model] of Object.entries(input.agentModels)) {
        (globalConfig.agents as Record<string, { model: string }>)[agentName] = { model };
      }
    }
    
    // Add memory configuration to global config
    if (input.memory) {
      globalConfig.memory = {
        enabled: input.memory.enabled ?? true,
        workerPort: input.memory.workerPort ?? 37777,
        embeddings: input.memory.embeddings ?? { provider: "local" },
        privacy: input.memory.privacy ?? { enabled: true, retentionDays: 90 },
      };
    }
    
    actions.push({
      type: "write_config",
      target: env.globalConfigPath,
      changes: globalConfig,
      description: "Write global GoopSpec configuration",
    });
    
    configsToWrite.push({
      path: env.globalConfigPath,
      scope: "global",
      content: globalConfig,
    });
  }
  
  // Plan project config write
  if (input.scope === "project" || input.scope === "both") {
    const projectConfig: Record<string, unknown> = {
      projectName: input.projectName,
      orchestrator: {
        enableAsDefault: input.enableOrchestrator ?? false,
        phaseGates: "ask",
        waveExecution: "sequential",
      },
    };
    
    // Add agent model overrides to project config
    if (input.agentModels && Object.keys(input.agentModels).length > 0) {
      projectConfig.agents = {};
      for (const [agentName, model] of Object.entries(input.agentModels)) {
        (projectConfig.agents as Record<string, { model: string }>)[agentName] = { model };
      }
    }
    
    // Add memory configuration to project config if specified
    if (input.memory) {
      projectConfig.memory = {
        enabled: input.memory.enabled ?? true,
        workerPort: input.memory.workerPort ?? 37777,
        embeddings: input.memory.embeddings ?? { provider: "local" },
        privacy: input.memory.privacy ?? { enabled: true, retentionDays: 90 },
      };
    }
    
    actions.push({
      type: "write_config",
      target: env.projectConfigPath,
      changes: projectConfig,
      description: "Write project GoopSpec configuration",
    });
    
    configsToWrite.push({
      path: env.projectConfigPath,
      scope: "project",
      content: projectConfig,
    });
  }
  
  // Plan MCP installation
  if (mcpsToInstall.length > 0) {
    actions.push({
      type: "install_mcp",
      target: "OpenCode MCPs",
      changes: { mcps: mcpsToInstall },
      description: `Install ${mcpsToInstall.length} MCP(s): ${mcpsToInstall.join(", ")}`,
    });
  }
  
  // Build summary
  const summaryParts = [
    `GoopSpec will be configured for: ${input.scope}`,
    input.models.orchestrator && `Orchestrator model: ${input.models.orchestrator}`,
    input.mcpPreset !== "none" && `MCP preset: ${input.mcpPreset}`,
    input.enableOrchestrator && "GoopSpec will be set as default agent",
    input.memory?.enabled !== false && "Memory system: enabled",
    input.memory?.embeddings?.provider && `Embedding provider: ${input.memory.embeddings.provider}`,
  ];
  
  const summary = summaryParts.filter(Boolean).join("\n");
  
  return {
    actions,
    summary,
    mcpsToInstall,
    configsToWrite,
    dirsToCreate,
    memoryConfig: input.memory,
    projectName: input.projectName,
  };
}

/**
 * Plan initialization for a new project
 * This is a comprehensive plan that creates everything needed
 */
export async function planInit(
  _projectDir: string,
  input: SetupInput,
  env: SetupEnvironment
): Promise<SetupPlan> {
  // Start with the regular setup plan
  const basePlan = await planSetup(input, env);
  
  const dirsToCreate: string[] = [];
  const additionalActions: SetupAction[] = [];
  
  // Plan directory creation
  if (!env.hasGoopspecDir) {
    dirsToCreate.push(env.goopspecDir);
    additionalActions.push({
      type: "create_dir",
      target: env.goopspecDir,
      changes: {},
      description: "Create .goopspec directory",
    });
  }
  
  // Plan subdirectory creation
  const checkpointsDir = joinPath(env.goopspecDir, "checkpoints");
  const historyDir = joinPath(env.goopspecDir, "history");
  const memoryDir = joinPath(env.goopspecDir, "memory");
  
  if (!existsSync(checkpointsDir)) {
    dirsToCreate.push(checkpointsDir);
  }
  if (!existsSync(historyDir)) {
    dirsToCreate.push(historyDir);
  }
  if (input.memory?.enabled !== false && !existsSync(memoryDir)) {
    dirsToCreate.push(memoryDir);
    additionalActions.push({
      type: "init_memory",
      target: memoryDir,
      changes: { config: input.memory },
      description: "Initialize memory system directory",
    });
  }
  
  // Plan state initialization
  if (!env.hasStateFile) {
    additionalActions.push({
      type: "init_state",
      target: joinPath(env.goopspecDir, "state.json"),
      changes: { projectName: input.projectName },
      description: "Initialize workflow state",
    });
  }
  
  return {
    ...basePlan,
    actions: [...additionalActions, ...basePlan.actions],
    dirsToCreate,
    isInit: true,
    projectName: input.projectName,
  };
}

// ============================================================================
// Apply Functions
// ============================================================================

/**
 * Apply setup plan
 * Executes all planned actions
 */
export async function applySetup(plan: SetupPlan): Promise<SetupResult> {
  const result: SetupResult = {
    success: true,
    configsWritten: [],
    mcpsInstalled: [],
    errors: [],
    warnings: [],
  };
  
  try {
    // Create directories first
    if (plan.dirsToCreate) {
      for (const dir of plan.dirsToCreate) {
        try {
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            log(`Created directory: ${dir}`);
          }
        } catch (error) {
          const errorMsg = `Failed to create directory ${dir}: ${error instanceof Error ? error.message : String(error)}`;
          result.errors.push(errorMsg);
          result.success = false;
        }
      }
    }
    
    // Write all config files
    for (const configWrite of plan.configsToWrite) {
      try {
        const dir = configWrite.path.substring(0, configWrite.path.lastIndexOf("/"));
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        
        writeFileSync(configWrite.path, JSON.stringify(configWrite.content, null, 2));
        result.configsWritten.push(configWrite.path);
        log(`Wrote config: ${configWrite.path}`);
      } catch (error) {
        const errorMsg = `Failed to write ${configWrite.scope} config: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMsg);
        result.success = false;
      }
    }
    
    // Install MCPs
    if (plan.mcpsToInstall.length > 0) {
      try {
        const installed = await installMcps(plan.mcpsToInstall);
        result.mcpsInstalled = installed;
        log(`Installed ${installed.length} MCPs`);
      } catch (error) {
        const errorMsg = `MCP installation failed: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMsg);
        result.warnings.push("You may need to install MCPs manually");
        // Don't mark as failed - configs are still written
      }
    }
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
  }
  
  return result;
}

/**
 * Apply initialization plan
 * Executes init-specific actions in addition to regular setup
 */
export async function applyInit(
  projectDir: string,
  plan: SetupPlan
): Promise<InitResult> {
  const result: InitResult = {
    success: true,
    projectName: plan.projectName ?? "unnamed",
    created: [],
    configsWritten: [],
    mcpsInstalled: [],
    errors: [],
    warnings: [],
  };
  
  try {
    // Create directories first
    if (plan.dirsToCreate) {
      for (const dir of plan.dirsToCreate) {
        try {
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            result.created.push(dir);
            log(`Created directory: ${dir}`);
          }
        } catch (error) {
          const errorMsg = `Failed to create directory ${dir}: ${error instanceof Error ? error.message : String(error)}`;
          result.errors.push(errorMsg);
          result.success = false;
        }
      }
    }
    
    // Initialize state and ADL using state manager
    try {
      await initializeGoopspec(projectDir, plan.projectName ?? "unnamed");
      result.created.push(joinPath(getProjectGoopspecDir(projectDir), "state.json"));
      result.created.push(joinPath(getProjectGoopspecDir(projectDir), "ADL.md"));
      log("Initialized GoopSpec state and ADL");
    } catch (error) {
      const errorMsg = `Failed to initialize state: ${error instanceof Error ? error.message : String(error)}`;
      result.errors.push(errorMsg);
      result.success = false;
    }
    
    // Apply regular setup
    const setupResult = await applySetup(plan);
    result.configsWritten = setupResult.configsWritten;
    result.mcpsInstalled = setupResult.mcpsInstalled;
    result.errors.push(...setupResult.errors);
    result.warnings.push(...setupResult.warnings);
    
    if (!setupResult.success) {
      result.success = false;
    }
    
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
  }
  
  return result;
}

// ============================================================================
// Verification Functions
// ============================================================================

/**
 * Verify GoopSpec setup is complete and working
 */
export async function verifySetup(projectDir: string): Promise<VerificationResult> {
  const checks: VerificationCheck[] = [];
  const env = await detectEnvironment(projectDir);
  
  // Check 1: Directory structure
  checks.push({
    name: "Directory Structure",
    passed: env.hasGoopspecDir,
    message: env.hasGoopspecDir 
      ? ".goopspec directory exists" 
      : ".goopspec directory not found",
    suggestedFix: env.hasGoopspecDir 
      ? undefined 
      : "Run goop_setup(action: 'init') to create the directory structure",
  });
  
  // Check 2: Configuration files
  const hasAnyConfig = env.hasGlobalGoopSpecConfig || env.hasProjectGoopSpecConfig;
  checks.push({
    name: "Configuration",
    passed: hasAnyConfig,
    message: hasAnyConfig 
      ? `Config found: ${env.hasGlobalGoopSpecConfig ? "global" : ""}${env.hasGlobalGoopSpecConfig && env.hasProjectGoopSpecConfig ? " + " : ""}${env.hasProjectGoopSpecConfig ? "project" : ""}`
      : "No GoopSpec configuration found",
    suggestedFix: hasAnyConfig 
      ? undefined 
      : "Run goop_setup(action: 'apply', scope: 'both') to create configuration",
  });
  
  // Check 3: Config validity
  if (env.hasProjectGoopSpecConfig) {
    try {
      const configContent = readFileSync(env.projectConfigPath, "utf-8");
      const config = JSON.parse(configContent);
      const validation = validateConfig(config);
      
      checks.push({
        name: "Config Validity",
        passed: validation.valid,
        message: validation.valid 
          ? "Project configuration is valid" 
          : `Invalid config: ${validation.errors?.join(", ")}`,
        suggestedFix: validation.valid 
          ? undefined 
          : "Fix configuration errors or reset with goop_setup(action: 'reset')",
      });
    } catch (error) {
      checks.push({
        name: "Config Validity",
        passed: false,
        message: `Failed to parse config: ${error instanceof Error ? error.message : String(error)}`,
        suggestedFix: "Check config.json for syntax errors",
      });
    }
  }
  
  // Check 4: State file
  checks.push({
    name: "State File",
    passed: env.hasStateFile,
    message: env.hasStateFile 
      ? "state.json exists" 
      : "state.json not found",
    suggestedFix: env.hasStateFile 
      ? undefined 
      : "Run goop_setup(action: 'init') to initialize state",
  });
  
  // Check 5: ADL file
  checks.push({
    name: "ADL File",
    passed: env.hasADLFile,
    message: env.hasADLFile 
      ? "ADL.md exists" 
      : "ADL.md not found",
    suggestedFix: env.hasADLFile 
      ? undefined 
      : "Run goop_setup(action: 'init') to create ADL",
  });
  
  // Check 6: Memory system
  checks.push({
    name: "Memory Directory",
    passed: env.hasMemoryDir,
    message: env.hasMemoryDir 
      ? "Memory directory exists" 
      : "Memory directory not found (optional)",
    suggestedFix: env.hasMemoryDir 
      ? undefined 
      : "Memory will be initialized on first use, or run init with memory enabled",
  });
  
  // Check 7: MCPs
  const recommendedMcps = MCP_PRESETS.recommended;
  const installedRecommended = recommendedMcps.filter(mcp => env.existingMcps.includes(mcp));
  const allMcpsInstalled = installedRecommended.length === recommendedMcps.length;
  
  checks.push({
    name: "MCPs",
    passed: env.existingMcps.length > 0,
    message: env.existingMcps.length > 0
      ? `Installed: ${env.existingMcps.join(", ")}`
      : "No MCPs detected",
    suggestedFix: allMcpsInstalled 
      ? undefined 
      : `Consider installing: ${recommendedMcps.filter(m => !env.existingMcps.includes(m)).join(", ")}`,
    details: {
      installed: env.existingMcps,
      recommended: recommendedMcps,
      missing: recommendedMcps.filter(m => !env.existingMcps.includes(m)),
    },
  });
  
  // Calculate summary
  const passed = checks.filter(c => c.passed).length;
  const failed = checks.filter(c => !c.passed).length;
  
  return {
    success: failed === 0,
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      total: checks.length,
      passed,
      failed,
      warnings: checks.filter(c => c.suggestedFix && c.passed).length,
    },
  };
}

// ============================================================================
// Reset Functions
// ============================================================================

/**
 * Reset GoopSpec configuration to defaults
 */
export async function resetSetup(
  projectDir: string,
  options: ResetOptions
): Promise<ResetResult> {
  const result: ResetResult = {
    success: true,
    reset: [],
    preserved: [],
    errors: [],
  };
  
  if (!options.confirmed) {
    result.success = false;
    result.errors.push("Reset requires confirmation. Set confirmed: true to proceed.");
    return result;
  }
  
  const env = await detectEnvironment(projectDir);
  
  try {
    // Reset global config
    if ((options.scope === "global" || options.scope === "both") && env.hasGlobalGoopSpecConfig) {
      try {
        writeFileSync(env.globalConfigPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
        result.reset.push(env.globalConfigPath);
        log(`Reset global config to defaults`);
      } catch (error) {
        result.errors.push(`Failed to reset global config: ${error instanceof Error ? error.message : String(error)}`);
        result.success = false;
      }
    }
    
    // Reset project config
    if ((options.scope === "project" || options.scope === "both") && env.hasProjectGoopSpecConfig) {
      const defaultProjectConfig = {
        orchestrator: {
          enableAsDefault: false,
          phaseGates: "ask",
          waveExecution: "sequential",
        },
        memory: {
          enabled: true,
        },
      };
      
      try {
        writeFileSync(env.projectConfigPath, JSON.stringify(defaultProjectConfig, null, 2));
        result.reset.push(env.projectConfigPath);
        log(`Reset project config to defaults`);
      } catch (error) {
        result.errors.push(`Failed to reset project config: ${error instanceof Error ? error.message : String(error)}`);
        result.success = false;
      }
    }
    
    // Preserve user data by default
    if (options.preserveData !== false) {
      const preservedPaths = [
        joinPath(env.goopspecDir, "memory"),
        joinPath(env.goopspecDir, "history"),
        joinPath(env.goopspecDir, "checkpoints"),
      ];
      
      for (const path of preservedPaths) {
        if (existsSync(path)) {
          result.preserved.push(path);
        }
      }
    } else if (options.preserveData === false) {
      // Full destructive reset - delete everything except config
      const dirsToDelete = [
        joinPath(env.goopspecDir, "memory"),
        joinPath(env.goopspecDir, "history"),
        joinPath(env.goopspecDir, "checkpoints"),
      ];
      
      for (const dir of dirsToDelete) {
        if (existsSync(dir)) {
          try {
            rmSync(dir, { recursive: true, force: true });
            result.reset.push(dir);
            log(`Deleted: ${dir}`);
          } catch (error) {
            result.errors.push(`Failed to delete ${dir}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      
      // Reset state.json
      if (env.hasStateFile) {
        try {
          rmSync(joinPath(env.goopspecDir, "state.json"));
          result.reset.push(joinPath(env.goopspecDir, "state.json"));
        } catch (error) {
          logError("Failed to delete state.json", error);
        }
      }
    }
    
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
  }
  
  return result;
}

// ============================================================================
// Status Functions
// ============================================================================

/**
 * Get current setup status
 */
export async function getSetupStatus(projectDir: string): Promise<SetupStatus> {
  const env = await detectEnvironment(projectDir);
  
  let projectName: string | undefined;
  let memoryEnabled = false;
  let memoryProvider: string | undefined;
  const agentModels: Record<string, string> = {};
  
  // Read project config for details
  if (env.hasProjectGoopSpecConfig) {
    try {
      const content = readFileSync(env.projectConfigPath, "utf-8");
      const config = JSON.parse(content);
      projectName = config.projectName;
      memoryEnabled = config.memory?.enabled !== false;
      memoryProvider = config.memory?.embeddings?.provider ?? "local";
      
      if (config.agents) {
        for (const [name, agent] of Object.entries(config.agents)) {
          if (typeof agent === "object" && agent && "model" in agent) {
            agentModels[name] = (agent as { model: string }).model;
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  // Read state for project name if not in config
  if (!projectName && env.hasStateFile) {
    try {
      const statePath = joinPath(env.goopspecDir, "state.json");
      const content = readFileSync(statePath, "utf-8");
      const state = JSON.parse(content);
      projectName = state.project?.name;
    } catch {
      // Ignore parse errors
    }
  }
  
  // Determine missing MCPs
  const recommendedMcps = MCP_PRESETS.recommended;
  const missingMcps = recommendedMcps.filter(m => !env.existingMcps.includes(m));
  
  return {
    initialized: env.hasGoopspecDir && env.hasStateFile,
    projectName,
    scope: {
      hasGlobal: env.hasGlobalGoopSpecConfig,
      hasProject: env.hasProjectGoopSpecConfig,
    },
    memory: {
      configured: env.hasProjectGoopSpecConfig || env.hasGlobalGoopSpecConfig,
      enabled: memoryEnabled,
      provider: memoryProvider,
      workerRunning: undefined, // Would need to check worker health
    },
    mcps: {
      installed: env.existingMcps,
      missing: missingMcps,
    },
    agentModels,
  };
}
