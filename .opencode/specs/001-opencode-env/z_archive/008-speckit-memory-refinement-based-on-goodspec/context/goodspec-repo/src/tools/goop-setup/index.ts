/**
 * GoopSpec Setup Tool
 * Configuration tool for GoopSpec - works with agent-driven setup flow
 * 
 * @module tools/goop-setup
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import type { PluginContext, ToolContext } from "../../core/types.js";
import { 
  detectEnvironment, 
  planSetup, 
  applySetup,
  planInit,
  applyInit,
  verifySetup,
  resetSetup,
  getSetupStatus,
} from "../../features/setup/index.js";
import type { 
  SetupInput, 
  SetupEnvironment,
  SetupPlan,
  SetupResult,
  InitResult,
  VerificationResult,
  ResetResult,
  SetupStatus,
  MemorySetupInput,
} from "../../features/setup/types.js";

// ============================================================================
// Model Suggestions for each agent
// ============================================================================

export const AGENT_MODEL_SUGGESTIONS: Record<string, {
  suggestions: string[];
  description: string;
}> = {
  "goop-debugger": {
    suggestions: [
      "openai/gpt-5.2-codex",
      "anthropic/claude-opus-4-5",
      "opencode/kimi-k2.5-free",
    ],
    description: "Systematic debugging with hypothesis testing",
  },
  "goop-designer": {
    suggestions: [
      "anthropic/claude-opus-4-5",
      "opencode/kimi-k2.5-free",
      "google/antigravity-gemini-3-pro-high",
    ],
    description: "Visual design planning and UI/UX reasoning",
  },
  "goop-executor": {
    suggestions: [
      "openai/gpt-5.2-codex",
      "anthropic/claude-opus-4-5",
      "anthropic/claude-sonnet-4-5",
      "opencode/kimi-k2.5-free",
      "google/antigravity-gemini-3-pro-high",
      "opencode/glm-4.7-free",
    ],
    description: "Task execution with checkpoints and verification",
  },
  "goop-explorer": {
    suggestions: [
      "google/antigravity-gemini-3-flash",
      "anthropic/claude-haiku-4-5",
      "opencode/minimax-m2.1-free",
    ],
    description: "Fast codebase exploration and pattern extraction",
  },
  "goop-librarian": {
    suggestions: [
      "openai/gpt-5.2",
      "google/antigravity-gemini-3-flash",
      "anthropic/claude-sonnet-4-5",
    ],
    description: "Codebase search and documentation retrieval",
  },
  "goop-orchestrator": {
    suggestions: [
      "openai/gpt-5.2-codex",
      "anthropic/claude-opus-4-5",
      "opencode/kimi-k2.5-free",
      "anthropic/claude-sonnet-4-5",
    ],
    description: "Primary orchestrator - spec clarity and wave execution",
  },
  "goop-planner": {
    suggestions: [
      "openai/gpt-5.2-codex",
      "anthropic/claude-opus-4-5",
      "opencode/kimi-k2.5-free",
      "anthropic/claude-sonnet-4-5",
    ],
    description: "Detailed execution plans with architectural precision",
  },
  "goop-researcher": {
    suggestions: [
      "openai/gpt-5.2",
      "anthropic/claude-sonnet-4-5",
      "opencode/kimi-k2.5-free",
      "opencode/glm-4.7-free",
    ],
    description: "Comprehensive ecosystem research",
  },
  "goop-tester": {
    suggestions: [
      "anthropic/claude-sonnet-4-5",
      "opencode/kimi-k2.5-free",
      "google/antigravity-gemini-3-flash",
    ],
    description: "Web frontend testing with Playwright",
  },
  "goop-verifier": {
    suggestions: [
      "openai/gpt-5.2-codex",
      "anthropic/claude-opus-4-5",
    ],
    description: "Post-execution verification with security focus",
  },
  "goop-writer": {
    suggestions: [
      "google/antigravity-gemini-3-pro-high",
      "opencode/kimi-k2.5-free",
      "anthropic/claude-sonnet-4-5",
    ],
    description: "Comprehensive documentation generation",
  },
};

// List of all configurable agents
export const ALL_AGENTS = Object.keys(AGENT_MODEL_SUGGESTIONS);

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format environment detection for display
 */
function formatEnvironment(env: SetupEnvironment): string {
  const lines = [
    "# GoopSpec Environment Detection",
    "",
    "## Directory Structure",
    "",
    `- **.goopspec directory**: ${env.hasGoopspecDir ? "✅ Found" : "❌ Not found"} (${env.goopspecDir})`,
    `- **state.json**: ${env.hasStateFile ? "✅ Found" : "❌ Not found"}`,
    `- **ADL.md**: ${env.hasADLFile ? "✅ Found" : "❌ Not found"}`,
    `- **memory directory**: ${env.hasMemoryDir ? "✅ Found" : "❌ Not found"}`,
    "",
    "## Configuration Files",
    "",
    `- **OpenCode config**: ${env.hasOpenCodeConfig ? "Found" : "Not found"} (${env.opencodeConfigPath})`,
    `- **Global GoopSpec config**: ${env.hasGlobalGoopSpecConfig ? "Found" : "Not found"} (${env.globalConfigPath})`,
    `- **Project GoopSpec config**: ${env.hasProjectGoopSpecConfig ? "Found" : "Not found"} (${env.projectConfigPath})`,
    "",
    "## Installed MCPs",
    "",
  ];
  
  if (env.existingMcps.length > 0) {
    lines.push(...env.existingMcps.map(m => `- ${m}`));
  } else {
    lines.push("No MCPs detected");
  }
  
  lines.push("");
  lines.push("## Available Actions");
  lines.push("");
  lines.push("| Action | Description |");
  lines.push("|--------|-------------|");
  lines.push("| `init` | Full first-time setup wizard |");
  lines.push("| `plan` | Preview changes before applying |");
  lines.push("| `apply` | Write configuration changes |");
  lines.push("| `verify` | Check if setup is complete and working |");
  lines.push("| `reset` | Reset configuration to defaults |");
  lines.push("| `models` | Show agent model suggestions |");
  lines.push("| `status` | Show current configuration summary |");
  
  return lines.join("\n");
}

/**
 * Format model suggestions for display
 */
function formatModelSuggestions(): string {
  const lines = [
    "# GoopSpec Agent Model Configuration",
    "",
    "Configure models for each GoopSpec agent. Each agent has recommended models optimized for its role.",
    "",
    "## Available Agents and Recommended Models",
    "",
  ];
  
  for (const [agentName, config] of Object.entries(AGENT_MODEL_SUGGESTIONS)) {
    lines.push(`### ${agentName}`);
    lines.push(`*${config.description}*`);
    lines.push("");
    lines.push("**Suggestions:**");
    for (let i = 0; i < config.suggestions.length; i++) {
      const model = config.suggestions[i];
      lines.push(`${i + 1}. \`${model}\``);
    }
    lines.push("");
  }
  
  lines.push("---");
  lines.push("");
  lines.push("## Usage");
  lines.push("");
  lines.push("To configure agent models, use:");
  lines.push("```");
  lines.push('goop_setup(action: "apply", scope: "project", agentModels: {');
  lines.push('  "goop-orchestrator": "anthropic/claude-opus-4-5",');
  lines.push('  "goop-executor": "anthropic/claude-sonnet-4-5",');
  lines.push('  "goop-explorer": "anthropic/claude-haiku-4-5"');
  lines.push("})");
  lines.push("```");
  lines.push("");
  lines.push("You can also enter custom model names not in the suggestions list.");
  
  return lines.join("\n");
}

/**
 * Format plan for display
 */
function formatPlan(plan: SetupPlan): string {
  const lines = [
    "# GoopSpec Setup Plan",
    "",
    "## Summary",
    plan.summary,
    "",
  ];
  
  if (plan.isInit) {
    lines.push("## Initialization");
    lines.push(`- Project name: ${plan.projectName ?? "unnamed"}`);
    lines.push("");
  }
  
  if (plan.dirsToCreate && plan.dirsToCreate.length > 0) {
    lines.push("## Directories to Create");
    lines.push(...plan.dirsToCreate.map(d => `- ${d}`));
    lines.push("");
  }
  
  if (plan.agentModels && Object.keys(plan.agentModels).length > 0) {
    lines.push("## Agent Models to Configure");
    lines.push("");
    lines.push("| Agent | Model |");
    lines.push("|-------|-------|");
    for (const [agent, model] of Object.entries(plan.agentModels)) {
      lines.push(`| ${agent} | \`${model}\` |`);
    }
    lines.push("");
  }
  
  if (plan.memoryConfig) {
    lines.push("## Memory Configuration");
    lines.push(`- Enabled: ${plan.memoryConfig.enabled !== false ? "yes" : "no"}`);
    if (plan.memoryConfig.embeddings?.provider) {
      lines.push(`- Embedding provider: ${plan.memoryConfig.embeddings.provider}`);
    }
    if (plan.memoryConfig.workerPort) {
      lines.push(`- Worker port: ${plan.memoryConfig.workerPort}`);
    }
    lines.push("");
  }
  
  if (plan.mcpsToInstall.length > 0) {
    lines.push("## MCPs to Install");
    lines.push(...plan.mcpsToInstall.map(m => `- ${m}`));
    lines.push("");
  }
  
  if (plan.configsToWrite.length > 0) {
    lines.push("## Configurations to Write");
    lines.push(...plan.configsToWrite.map(c => `- **${c.scope}**: ${c.path}`));
    lines.push("");
  }
  
  return lines.join("\n");
}

/**
 * Format result for display
 */
function formatResult(result: SetupResult): string {
  const lines = ["# GoopSpec Setup Result", ""];
  
  if (result.success) {
    lines.push("✅ Setup completed successfully!");
    lines.push("");
  } else {
    lines.push("⚠️ Setup completed with errors");
    lines.push("");
  }
  
  if (result.configsWritten.length > 0) {
    lines.push("## Configurations Written");
    lines.push(...result.configsWritten.map(c => `- ${c}`));
    lines.push("");
  }
  
  if (result.mcpsInstalled.length > 0) {
    lines.push("## MCPs Installed");
    lines.push(...result.mcpsInstalled.map(m => `- ${m}`));
    lines.push("");
  }
  
  if (result.warnings.length > 0) {
    lines.push("## Warnings");
    lines.push(...result.warnings.map(w => `- ⚠️ ${w}`));
    lines.push("");
  }
  
  if (result.errors.length > 0) {
    lines.push("## Errors");
    lines.push(...result.errors.map(e => `- ❌ ${e}`));
    lines.push("");
  }
  
  if (result.success) {
    lines.push("## Next Steps");
    lines.push("- Run `/goop-status` to verify your configuration");
    lines.push("- Start using GoopSpec for spec-driven development");
    lines.push("- Try `/goop-discuss` to begin a new project");
  }
  
  return lines.join("\n");
}

/**
 * Format init result for display
 */
function formatInitResult(result: InitResult): string {
  const lines = ["# GoopSpec Initialization Result", ""];
  
  if (result.success) {
    lines.push(`✅ Project "${result.projectName}" initialized successfully!`);
    lines.push("");
  } else {
    lines.push("⚠️ Initialization completed with errors");
    lines.push("");
  }
  
  if (result.created.length > 0) {
    lines.push("## Created");
    lines.push(...result.created.map(c => `- ${c}`));
    lines.push("");
  }
  
  if (result.configsWritten.length > 0) {
    lines.push("## Configurations Written");
    lines.push(...result.configsWritten.map(c => `- ${c}`));
    lines.push("");
  }
  
  if (result.mcpsInstalled.length > 0) {
    lines.push("## MCPs Installed");
    lines.push(...result.mcpsInstalled.map(m => `- ${m}`));
    lines.push("");
  }
  
  if (result.warnings.length > 0) {
    lines.push("## Warnings");
    lines.push(...result.warnings.map(w => `- ⚠️ ${w}`));
    lines.push("");
  }
  
  if (result.errors.length > 0) {
    lines.push("## Errors");
    lines.push(...result.errors.map(e => `- ❌ ${e}`));
    lines.push("");
  }
  
  if (result.success) {
    lines.push("## Next Steps");
    lines.push("1. Run `goop_setup(action: 'verify')` to check your setup");
    lines.push("2. Use `/goop-discuss` to start planning your first feature");
    lines.push("3. Try `/goop-help` for available commands");
  }
  
  return lines.join("\n");
}

/**
 * Format verification result for display
 */
function formatVerificationResult(result: VerificationResult): string {
  const lines = [
    "# GoopSpec Setup Verification",
    "",
    `**Status**: ${result.success ? "✅ All checks passed" : "⚠️ Some checks failed"}`,
    `**Timestamp**: ${result.timestamp}`,
    "",
    "## Check Results",
    "",
    "| Check | Status | Message |",
    "|-------|--------|---------|",
  ];
  
  for (const check of result.checks) {
    const status = check.passed ? "✅" : "❌";
    lines.push(`| ${check.name} | ${status} | ${check.message} |`);
  }
  
  lines.push("");
  lines.push("## Summary");
  lines.push(`- **Total**: ${result.summary.total}`);
  lines.push(`- **Passed**: ${result.summary.passed}`);
  lines.push(`- **Failed**: ${result.summary.failed}`);
  lines.push(`- **Warnings**: ${result.summary.warnings}`);
  
  // Show suggested fixes for failed checks
  const failedChecks = result.checks.filter(c => !c.passed && c.suggestedFix);
  if (failedChecks.length > 0) {
    lines.push("");
    lines.push("## Suggested Fixes");
    for (const check of failedChecks) {
      lines.push(`- **${check.name}**: ${check.suggestedFix}`);
    }
  }
  
  return lines.join("\n");
}

/**
 * Format reset result for display
 */
function formatResetResult(result: ResetResult): string {
  const lines = ["# GoopSpec Reset Result", ""];
  
  if (result.success) {
    lines.push("✅ Reset completed successfully!");
    lines.push("");
  } else {
    lines.push("⚠️ Reset encountered errors");
    lines.push("");
  }
  
  if (result.reset.length > 0) {
    lines.push("## Reset");
    lines.push(...result.reset.map(r => `- ${r}`));
    lines.push("");
  }
  
  if (result.preserved.length > 0) {
    lines.push("## Preserved (user data)");
    lines.push(...result.preserved.map(p => `- ${p}`));
    lines.push("");
  }
  
  if (result.errors.length > 0) {
    lines.push("## Errors");
    lines.push(...result.errors.map(e => `- ❌ ${e}`));
    lines.push("");
  }
  
  return lines.join("\n");
}

/**
 * Format status for display
 */
function formatStatus(status: SetupStatus): string {
  const lines = [
    "# GoopSpec Configuration Status",
    "",
    `**Initialized**: ${status.initialized ? "✅ Yes" : "❌ No"}`,
  ];
  
  if (status.projectName) {
    lines.push(`**Project**: ${status.projectName}`);
  }
  
  lines.push("");
  lines.push("## Configuration Scope");
  lines.push(`- Global config: ${status.scope.hasGlobal ? "✅" : "❌"}`);
  lines.push(`- Project config: ${status.scope.hasProject ? "✅" : "❌"}`);
  
  lines.push("");
  lines.push("## Memory System");
  lines.push(`- Configured: ${status.memory.configured ? "✅" : "❌"}`);
  lines.push(`- Enabled: ${status.memory.enabled ? "✅" : "❌"}`);
  if (status.memory.provider) {
    lines.push(`- Provider: ${status.memory.provider}`);
  }
  if (status.memory.workerRunning !== undefined) {
    lines.push(`- Worker: ${status.memory.workerRunning ? "🟢 Running" : "🔴 Stopped"}`);
  }
  
  lines.push("");
  lines.push("## MCPs");
  if (status.mcps.installed.length > 0) {
    lines.push(`- Installed: ${status.mcps.installed.join(", ")}`);
  } else {
    lines.push("- Installed: none");
  }
  if (status.mcps.missing.length > 0) {
    lines.push(`- Recommended: ${status.mcps.missing.join(", ")}`);
  }
  
  if (Object.keys(status.agentModels).length > 0) {
    lines.push("");
    lines.push("## Agent Models");
    for (const [agent, model] of Object.entries(status.agentModels)) {
      lines.push(`- ${agent}: \`${model}\``);
    }
  }
  
  return lines.join("\n");
}

// ============================================================================
// Tool Definition
// ============================================================================

/**
 * Create the goop-setup tool
 */
export function createGoopSetupTool(_ctx: PluginContext): ToolDefinition {
  return tool({
    description: `GoopSpec configuration tool. Actions:
- 'detect': Check current setup state
- 'init': Full first-time initialization wizard
- 'plan': Preview changes before applying
- 'apply': Write configuration changes
- 'verify': Check if setup is complete and working
- 'reset': Reset configuration to defaults
- 'models': Show agent model suggestions
- 'status': Show current configuration summary`,
    args: {
      action: tool.schema.enum(["detect", "init", "plan", "apply", "verify", "reset", "models", "status"]),
      // Scope options
      scope: tool.schema.enum(["global", "project", "both"]).optional(),
      // Init options
      projectName: tool.schema.string().optional(),
      // Model options
      orchestratorModel: tool.schema.string().optional(),
      defaultModel: tool.schema.string().optional(),
      agentModels: tool.schema.record(tool.schema.string(), tool.schema.string()).optional(),
      // MCP options
      mcpPreset: tool.schema.enum(["core", "recommended", "none"]).optional(),
      // Orchestrator options
      enableOrchestrator: tool.schema.boolean().optional(),
      // Memory options
      memoryEnabled: tool.schema.boolean().optional(),
      memoryProvider: tool.schema.enum(["local", "openai", "ollama"]).optional(),
      memoryWorkerPort: tool.schema.number().optional(),
      // Reset options
      preserveData: tool.schema.boolean().optional(),
      confirmed: tool.schema.boolean().optional(),
    },
    async execute(args, toolCtx: ToolContext): Promise<string> {
      try {
        const projectDir = toolCtx.directory;
        
        // ====================================================================
        // Models action: show model suggestions for all agents
        // ====================================================================
        if (args.action === "models") {
          return formatModelSuggestions();
        }
        
        // ====================================================================
        // Detect action: show current environment state
        // ====================================================================
        if (args.action === "detect") {
          const env = await detectEnvironment(projectDir);
          return formatEnvironment(env);
        }
        
        // ====================================================================
        // Status action: show current configuration summary
        // ====================================================================
        if (args.action === "status") {
          const status = await getSetupStatus(projectDir);
          return formatStatus(status);
        }
        
        // ====================================================================
        // Verify action: check if setup is complete and working
        // ====================================================================
        if (args.action === "verify") {
          const result = await verifySetup(projectDir);
          return formatVerificationResult(result);
        }
        
        // ====================================================================
        // Reset action: reset configuration to defaults
        // ====================================================================
        if (args.action === "reset") {
          if (!args.scope) {
            return "Error: 'scope' is required for reset action. Use scope='global', 'project', or 'both'.";
          }
          
          const result = await resetSetup(projectDir, {
            scope: args.scope,
            preserveData: args.preserveData,
            confirmed: args.confirmed,
          });
          return formatResetResult(result);
        }
        
        // ====================================================================
        // Build setup input for init/plan/apply actions
        // ====================================================================
        
        // Build memory config if any memory options provided
        let memoryConfig: MemorySetupInput | undefined;
        if (args.memoryEnabled !== undefined || args.memoryProvider || args.memoryWorkerPort) {
          memoryConfig = {
            enabled: args.memoryEnabled,
            workerPort: args.memoryWorkerPort,
            embeddings: args.memoryProvider ? { provider: args.memoryProvider } : undefined,
          };
        }
        
        // For init, plan, apply we need scope
        if (!args.scope) {
          return "Error: 'scope' is required for init/plan/apply actions. Use scope='global', 'project', or 'both'.";
        }
        
        // Build setup input from args
        const input: SetupInput = {
          scope: args.scope,
          projectName: args.projectName,
          models: {
            orchestrator: args.orchestratorModel,
            default: args.defaultModel,
          },
          mcpPreset: args.mcpPreset ?? "recommended",
          enableOrchestrator: args.enableOrchestrator,
          agentModels: args.agentModels,
          memory: memoryConfig,
        };
        
        // Detect environment
        const env = await detectEnvironment(projectDir);
        
        // ====================================================================
        // Init action: full first-time initialization
        // ====================================================================
        if (args.action === "init") {
          // Generate init plan
          const plan = await planInit(projectDir, input, env);
          
          // Add agent models to plan if provided
          if (args.agentModels) {
            plan.agentModels = args.agentModels;
          }
          
          // Execute init
          const result = await applyInit(projectDir, plan);
          return formatInitResult(result);
        }
        
        // ====================================================================
        // Plan action: show what would change
        // ====================================================================
        if (args.action === "plan") {
          const plan = await planSetup(input, env);
          
          // Add agent models to plan if provided
          if (args.agentModels) {
            plan.agentModels = args.agentModels;
          }
          
          return formatPlan(plan);
        }
        
        // ====================================================================
        // Apply action: execute the plan
        // ====================================================================
        if (args.action === "apply") {
          const plan = await planSetup(input, env);
          
          // Add agent models to plan if provided
          if (args.agentModels) {
            plan.agentModels = args.agentModels;
          }
          
          const result = await applySetup(plan);
          return formatResult(result);
        }
        
        return `Unknown action: ${args.action}`;
        
      } catch (error) {
        return `Setup failed: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  });
}

// Export for use in commands
export { AGENT_MODEL_SUGGESTIONS as agentModelSuggestions };
