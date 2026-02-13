/**
 * GoopSpec Plugin v0.1.0
 * A spec-driven development plugin for OpenCode
 * 
 * @module index
 */

import type { Plugin, Hooks } from "@opencode-ai/plugin";
import type { PluginContext, MinimalPluginInput } from "./core/types.js";
import { loadPluginConfig } from "./core/config.js";
import { createResourceResolver } from "./core/resolver.js";
import { createStateManager } from "./features/state-manager/manager.js";
import { MemoryServiceManager } from "./features/memory/manager.js";
import { createTools } from "./tools/index.js";
import { createHooks } from "./hooks/index.js";
import { createConfigHandler } from "./plugin-handlers/config-handler.js";
import { log, logError, setDebug } from "./shared/logger.js";

/**
 * Create a minimal hooks object for error/degraded mode
 * This ensures the plugin never completely fails to load
 */
function createMinimalHooks(): Hooks {
  return {
    tool: {
      goop_status: {
        description: "GoopSpec is not fully initialized. Run setup to configure.",
        args: {},
        async execute() {
          return "GoopSpec plugin is running in degraded mode. Please check configuration.";
        },
      },
    },
  };
}

/**
 * GoopSpec Plugin Entry Point
 * 
 * This is the main plugin export that OpenCode loads.
 * It follows the progressive enhancement pattern:
 * - Returns minimal plugin on error
 * - Full functionality when properly initialized
 */
const GoopSpecPlugin: Plugin = async (input) => {
  try {
    // Enable debug logging in development
    if (process.env.GOOPSPEC_DEBUG === "true") {
      setDebug(true);
    }

    // Extract project name - prefer directory name as it's human-readable
    // input.project?.id is often a hash/UUID which isn't useful for display
    const directoryName = input.directory.split("/").pop() || "unnamed";
    const projectIdName = input.project?.id?.split("/").pop();
    
    // Use directory name unless projectId looks like a path (contains meaningful name)
    // Hashes (40+ chars, alphanumeric only) are not useful project names
    const isHashLike = projectIdName && /^[a-f0-9]{32,}$/i.test(projectIdName);
    const projectName = isHashLike ? directoryName : (projectIdName || directoryName);

    log("GoopSpec plugin initializing...", { 
      directory: input.directory,
      projectId: input.project?.id,
      projectName,
    });

    // Cast input to our minimal type (we track name derived from id)
    const pluginInput: MinimalPluginInput = {
      client: input.client,
      project: { name: projectName },
      directory: input.directory,
      worktree: input.worktree,
      serverUrl: input.serverUrl,
    };

    // Load configuration (global + project merge)
    const config = loadPluginConfig(input.directory);
    log("Config loaded", { config });

    // Create resource resolver
    const resolver = createResourceResolver(input.directory);
    log("Resource resolver created");

    // Create state manager
    const stateManager = createStateManager(
      input.directory,
      config.projectName || projectName
    );
    log("State manager created");

    // Initialize memory service manager
    // Memory is ENABLED by default but gracefully degrades if worker fails
    // Worker architecture may have issues in some bundled plugin setups
    // Disable with memory.enabled: false in config if needed
    let memoryClient: import("./features/memory/types.js").MemoryManager | undefined;
    const memoryEnabled = config.memory?.enabled !== false; // Default to true
    
    if (memoryEnabled) {
      try {
        const memoryManager = new MemoryServiceManager(input.directory, config.memory);
        // Try to start the memory worker (best effort)
        try {
          await memoryManager.ensureRunning();
          // If ensureRunning didn't throw, assume it's working
          memoryClient = memoryManager.getClient();
          log("Memory service initialized successfully", {
            port: config.memory?.workerPort ?? 37777,
          });
        } catch (err) {
          // Log but continue - memory is nice to have, not required
          log("Memory worker unavailable, memory features will be limited", {
            error: err instanceof Error ? err.message : String(err),
          });
        }
      } catch (error) {
        log("Memory service init failed, continuing without memory", {
          error: error instanceof Error ? error.message : String(error),
        });
        // Continue without memory - graceful degradation
      }
    } else {
      log("Memory system disabled via config");
    }

    // Build plugin context
    const ctx: PluginContext = {
      input: pluginInput,
      config,
      resolver,
      stateManager,
      memoryManager: memoryClient,
    };

    // Create all tools
    const tools = createTools(ctx);
    log("Tools created", { toolCount: Object.keys(tools).length });

    // Create all hooks (pass input for hooks that need client access)
    const hooksFromFactory = createHooks(ctx, input);
    log("Hooks created");

    // Create config handler for orchestrator agent registration
    const configHandler = createConfigHandler({
      pluginConfig: config,
      resolver,
      directory: input.directory,
    });
    log("Config handler created", {
      orchestratorEnabled: config.orchestrator?.enableAsDefault,
    });

    // Build hooks object
    const hooks: Hooks = {
      tool: tools as Hooks["tool"],
      config: configHandler,
      ...hooksFromFactory,
    };

    log("GoopSpec plugin initialized successfully", {
      tools: Object.keys(tools),
      hooks: Object.keys(hooksFromFactory),
      enforcement: config.enforcement,
      orchestrator: config.orchestrator?.enableAsDefault ? "enabled" : "available",
    });

    return hooks;
  } catch (error) {
    // Graceful degradation: return minimal hooks on any error
    logError("GoopSpec plugin initialization failed, running in degraded mode", error);
    return createMinimalHooks();
  }
};

export default GoopSpecPlugin;
