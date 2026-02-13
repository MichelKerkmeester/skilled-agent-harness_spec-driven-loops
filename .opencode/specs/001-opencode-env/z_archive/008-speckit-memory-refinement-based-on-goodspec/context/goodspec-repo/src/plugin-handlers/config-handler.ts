/**
 * Config Handler for GoopSpec Plugin
 * Registers the GoopSpec orchestrator agent and user commands with OpenCode
 * 
 * @module plugin-handlers/config-handler
 */

import type { GoopSpecConfig, ResourceResolver } from "../core/types.js";
import { createGoopSpecOrchestrator } from "../agents/goopspec-orchestrator.js";
import { createAgentFromMarkdown, validateAgentResource, type AgentFactoryOptions } from "../agents/agent-factory.js";
import { log } from "../shared/logger.js";

export interface ConfigHandlerDeps {
  pluginConfig: GoopSpecConfig;
  resolver: ResourceResolver;
  directory: string;
}

/**
 * Command definition for OpenCode config
 */
interface CommandConfig {
  template: string;
  description?: string;
  agent?: string;
  model?: string;
  subtask?: boolean;
}

/**
 * Create the config handler that registers agents and commands with OpenCode
 * 
 * This follows the Oh-My-Opencode pattern:
 * - Receives the OpenCode config object
 * - Modifies it to register our agents
 * - Registers user commands from commands/ directory
 * - Optionally sets our agent as the default
 */
export function createConfigHandler(deps: ConfigHandlerDeps) {
  const { pluginConfig, resolver, directory } = deps;

  return async (config: Record<string, unknown>) => {
    log("GoopSpec config handler running", { 
      enableAsDefault: pluginConfig.orchestrator?.enableAsDefault,
      directory,
    });

    try {
      // Build the orchestrator agent configuration
      const orchestrator = createGoopSpecOrchestrator({
        model: pluginConfig.orchestrator?.model,
        thinkingBudget: pluginConfig.orchestrator?.thinkingBudget,
        phaseGates: pluginConfig.orchestrator?.phaseGates,
        waveExecution: pluginConfig.orchestrator?.waveExecution,
        resolver,
      });

      // Register orchestrator as an available agent (coexists with build/plan)
      const existingAgents = (config.agent as Record<string, unknown>) ?? {};
      config.agent = {
        ...existingAgents,
        goopspec: orchestrator,
      };

      log("Registered goopspec orchestrator agent");

      // Register all sub-agents from agents/ directory
      const agentResources = resolver.resolveAll("agent");
      let subAgentCount = 0;
      
      // Agent factory options with memory enabled based on config
      const agentFactoryOptions: AgentFactoryOptions = {
        enableMemoryTools: pluginConfig.memory?.enabled !== false,
        pluginConfig,
      };
      
      for (const agentResource of agentResources) {
        const agentName = agentResource.name;
        
        // Skip the orchestrator (already registered above as "goopspec")
        // The file is goop-orchestrator.md, so agentResource.name = "goop-orchestrator"
        if (agentName === "goop-orchestrator") {
          continue;
        }
        
        try {
          // Validate agent resource
          const issues = validateAgentResource(agentResource);
          if (issues.length > 0) {
            log(`Agent ${agentName} has validation issues`, { issues, level: "warn" });
            continue;
          }
          
          // Create agent config from markdown with memory tools
          const agentConfig = createAgentFromMarkdown(agentResource, resolver, agentFactoryOptions);
          
          // Register with OpenCode
          (config.agent as Record<string, unknown>)[agentName] = agentConfig;
          subAgentCount++;
          
          log(`Registered sub-agent: ${agentName}`);
        } catch (error) {
          log(`Failed to register agent ${agentName}`, { error, level: "warn" });
        }
      }
      
      log(`Registered ${subAgentCount} sub-agents`, {
        agents: agentResources.map(a => a.name).filter(n => n !== "goopspec-orchestrator"),
      });

      // Only set as default if explicitly enabled
      if (pluginConfig.orchestrator?.enableAsDefault) {
        // NOTE: default_agent must match the AGENT KEY (not the name property)
        (config as { default_agent?: string }).default_agent = "goopspec";
        log("Set goopspec as default agent");
      }
    } catch (error) {
      // Don't fail plugin loading if orchestrator registration fails
      log("Failed to register goopspec orchestrator", { error });
    }

    // Register user commands from commands/ directory
    try {
      const commands = resolver.resolveAll("command");
      const existingCommands = (config.command as Record<string, CommandConfig>) ?? {};
      const goopCommands: Record<string, CommandConfig> = {};

      for (const cmd of commands) {
        const description = cmd.frontmatter.description as string || "";
        const agent = cmd.frontmatter.agent as string | undefined;
        const model = cmd.frontmatter.model as string | undefined;
        
        goopCommands[cmd.name] = {
          template: cmd.body,
          description,
          agent,
          model,
        };
      }

      config.command = {
        ...existingCommands,
        ...goopCommands,
      };

      log("Registered GoopSpec commands", { 
        count: Object.keys(goopCommands).length,
        commands: Object.keys(goopCommands),
      });
    } catch (error) {
      // Don't fail plugin loading if command registration fails
      log("Failed to register GoopSpec commands", { error });
    }
  };
}
