/**
 * OpenCode Plugin Template
 * 
 * This is a starter template demonstrating correct plugin structure.
 * Copy this file and customize for your plugin.
 */

import type { Plugin, Hooks } from "@opencode-ai/plugin";
// Uncomment if creating custom tools:
// import { tool } from "@opencode-ai/plugin";

// Module-scope state (NOT inside a factory function)
let sessionCount = 0;
const sessionTimestamps = new Map<string, number>();

// Plugin configuration (loaded at module initialization)
interface PluginConfig {
  enabled: boolean;
  // Add your config fields here
}

function loadConfig(): PluginConfig {
  // Load from environment, file, etc.
  return { enabled: true };
}

const config = loadConfig();

/**
 * Main Plugin Function
 * 
 * CRITICAL: This is exported directly, NOT wrapped in a factory.
 * OpenCode calls: const hooks = await YourPlugin(ctx)
 */
export const TemplatePlugin: Plugin = async ({ directory, client, project, worktree, $ }) => {
  // Initialization runs once when plugin loads
  const projectName = (project as Record<string, unknown>).name || directory;
  console.log(`[TemplatePlugin] Loaded for project: ${projectName}`);
  
  if (!config.enabled) {
    return {}; // Return empty hooks if disabled
  }

  // Return hooks object
  const hooks: Hooks = {
    // React to 27+ system events
    event: async ({ event }) => {
      // Use properties with type assertions for event-specific data
      const props = event.properties as Record<string, unknown>;
      
      switch (event.type) {
        // Session lifecycle
        case "session.created":
          sessionCount++;
          const sessionID = props.sessionID as string;
          sessionTimestamps.set(sessionID, Date.now());
          console.log(`[TemplatePlugin] Session #${sessionCount} started: ${sessionID}`);
          break;
        
        case "session.deleted":
          const info = props.info as { id: string } | undefined;
          if (info?.id) {
            sessionTimestamps.delete(info.id);
          }
          break;
        
        case "session.idle":
          console.log(`[TemplatePlugin] Session went idle`);
          // Good place for notifications
          break;
        
        case "session.compacted":
          console.log(`[TemplatePlugin] Session context was compacted`);
          break;
        
        // File operations
        case "file.edited":
          const filePath = (props.path || props.file) as string;
          if (filePath?.endsWith(".env")) {
            console.warn("[TemplatePlugin] Warning: .env file was edited");
          }
          break;
        
        // Commands
        case "command.executed":
          const cmdName = (props.command || props.name) as string;
          console.log(`[TemplatePlugin] Command: ${cmdName}`);
          break;
        
        // Permissions
        case "permission.replied":
          const response = props.response as string;
          console.log(`[TemplatePlugin] Permission response: ${response}`);
          break;
        
        // TUI events
        case "tui.toast.show":
          // React to toast notifications
          break;
        
        // LSP diagnostics
        case "lsp.client.diagnostics":
          // Handle language server diagnostics
          break;
      }
    },
    
    // Inject content into chat messages
    "chat.message": async (input, output) => {
      // input: { sessionID, agent?, model?, messageID? }
      // output: { message: UserMessage, parts: Part[] } - MUTABLE
      
      const timestamp = sessionTimestamps.get(input.sessionID);
      if (timestamp) {
        const elapsed = Math.round((Date.now() - timestamp) / 1000);
        // Cast to any to avoid strict type checking on Part structure
        (output.parts as unknown[]).push({
          type: "text",
          text: `\n[Session duration: ${elapsed}s]`
        });
      }
    },
    
    // Intercept tool execution (before)
    "tool.execute.before": async (input, output) => {
      // input: { tool: string, sessionID: string, callID: string }
      // output: { args: any } - MUTABLE
      
      // Example: Log all tool calls
      console.log(`[TemplatePlugin] Tool called: ${input.tool}`);
      
      // Example: Modify args
      // if (input.tool === "Bash") {
      //   output.args.command = `echo "Intercepted" && ${output.args.command}`;
      // }
    },
    
    // Intercept tool execution (after)
    "tool.execute.after": async (input, output) => {
      // input: { tool: string, sessionID: string, callID: string }
      // output: { title: string, output: string, metadata: any } - MUTABLE
      
      // Example: Add suffix to output
      // output.output += "\n[Modified by plugin]";
    },
    
    // Uncomment to add custom tools:
    // tool: {
    //   my_custom_tool: tool({
    //     description: "Description of what the tool does",
    //     args: {
    //       query: tool.schema.string().describe("Parameter description"),
    //       count: tool.schema.number().optional().describe("Optional count"),
    //     },
    //     async execute({ query, count = 10 }, ctx) {
    //       // ctx: { sessionID, messageID, agent, abort }
    //       return `Result for ${query} (count: ${count})`;
    //     },
    //   }),
    // },
  };
  
  return hooks;
};

// Default export - REQUIRED for OpenCode to load the plugin
export default TemplatePlugin;
