#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: MCP Code Mode Server Entry
// ───────────────────────────────────────────────────────────────────
// Entry point for the mcp-bridge bin of the @utcp/code-mode-mcp package.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import path, { dirname } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { format } from 'util';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import '@utcp/http';
import '@utcp/text';
import '@utcp/mcp';
import '@utcp/cli';
import '@utcp/dotenv-loader';
import '@utcp/file';

import {
    CallTemplateSchema,
    ensureCorePluginsInitialized,
    UtcpClientConfigSerializer
} from '@utcp/sdk';
import { CodeModeUtcpClient } from '@utcp/code-mode';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND TYPES
// ───────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Bounded so an unresponsive transport delays exit instead of preventing it.
const TRANSPORT_CLOSE_TIMEOUT_MS = 5_000;
const PARENT_WATCHDOG_INTERVAL_MS = 15_000;
const DEFAULT_SEARCH_LIMIT = 10;
const DEFAULT_CALL_TIMEOUT_MS = 30000;
const DEFAULT_MAX_OUTPUT_SIZE = 200000;

type ToolResponse = { content: Array<{ type: "text"; text: string }> };
type CallTemplateInput = z.infer<typeof CallTemplateSchema>;

type ToolRegistrar = {
    registerTool: (
        name: string,
        config: {
            title: string;
            description: string;
            inputSchema: unknown;
        },
        handler: (input: Record<string, unknown>) => Promise<ToolResponse>
    ) => void;
};

// ───────────────────────────────────────────────────────────────────
// 3. PROCESS SETUP
// ───────────────────────────────────────────────────────────────────

function redirectConsoleStdoutToStderr(): void {
    const writeToStderr = (...args: unknown[]): void => {
        process.stderr.write(`${format(...args)}\n`);
    };

    // MCP stdio reserves stdout for JSON-RPC frames; library logs must not corrupt it.
    console.log = writeToStderr;
    console.info = writeToStderr;
    console.debug = writeToStderr;
}

redirectConsoleStdoutToStderr();

ensureCorePluginsInitialized();

let utcpClient: CodeModeUtcpClient | null = null;

// ───────────────────────────────────────────────────────────────────
// 4. RESPONSE AND ERROR HELPERS
// ───────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === "string") {
            return message;
        }
    }

    return String(error);
}

function getErrorCode(error: unknown): string | undefined {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code?: unknown }).code;
        if (typeof code === "string") {
            return code;
        }
    }

    return undefined;
}

function textResponse(text: string): ToolResponse {
    return { content: [{ type: "text", text }] };
}

function errorResponse(error: unknown, context: Record<string, unknown> = {}): ToolResponse {
    return textResponse(JSON.stringify({ success: false, ...context, error: getErrorMessage(error) }));
}

// ───────────────────────────────────────────────────────────────────
// 5. TRANSPORT LIFECYCLE
// ───────────────────────────────────────────────────────────────────

async function closeWithinTimeout(
    client: CodeModeUtcpClient,
    timeoutMs: number,
    failurePrefix: string
): Promise<void> {
    try {
        await Promise.race([
            client.close(),
            new Promise<void>(resolve => setTimeout(resolve, timeoutMs).unref())
        ]);
    } catch (error) {
        console.error(`${failurePrefix}: ${getErrorMessage(error)}`);
    }
}

// Registration opens a transport per manual only to read its tool list, and
// those transports then sit idle for the whole session. Most are never called,
// yet each one holds a child process, and several sessions at once make those
// children contend over shared credential state. Dropping them after discovery
// keeps every tool searchable: the protocol reopens a transport on first real
// use.
async function releaseIdleTransports(
    client: CodeModeUtcpClient,
    timeoutMs = TRANSPORT_CLOSE_TIMEOUT_MS
): Promise<void> {
    await closeWithinTimeout(client, timeoutMs, "CodeMode-MCP idle transport release failed");
}

// Closing the client cascades into each communication protocol, which ends the
// child processes backing remote transports.
async function releaseTransports(timeoutMs = TRANSPORT_CLOSE_TIMEOUT_MS): Promise<void> {
    const client = utcpClient;
    if (!client) {
        return;
    }
    utcpClient = null;

    await closeWithinTimeout(client, timeoutMs, "CodeMode-MCP transport cleanup failed");
}

// A stdio MCP server's lifetime is its parent session. Without these exits the
// process survives a hard session kill, reparents to PID 1, and orphans
// accumulate until they exhaust shared infrastructure.
function exitWhenSessionEnds(transport: StdioServerTransport): void {
    let shuttingDown = false;

    const shutdown = (reason: string) => {
        if (shuttingDown) {
            return;
        }
        shuttingDown = true;
        console.error(`CodeMode-MCP shutting down: ${reason}`);

        // Remote transports are backed by long-lived child processes that this
        // process spawned. Exiting without closing them leaves them running,
        // reparented to PID 1, where they pile up across sessions and fight each
        // other over shared OAuth token files until a browser prompt loops.
        void releaseTransports().finally(() => process.exit(0));
    };

    process.stdin.once("end", () => shutdown("stdin closed"));
    process.stdin.once("close", () => shutdown("stdin closed"));
    transport.onclose = () => shutdown("transport closed");

    // Hard parent kills can leave the pipe open with no EOF delivered; polling
    // for reparenting to PID 1 catches that case.
    const watchdog = setInterval(() => {
        if (process.ppid === 1) {
            shutdown("parent process exited");
        }
    }, PARENT_WATCHDOG_INTERVAL_MS);
    watchdog.unref();
}

// ───────────────────────────────────────────────────────────────────
// 6. MCP SERVER AND TOOLS
// ───────────────────────────────────────────────────────────────────

const mcp = new McpServer({
    name: "CodeMode-MCP",
    version: "1.0.0",
});

function setupMcpTools(): void {
    const mcpTools = mcp as unknown as ToolRegistrar;

    mcp.registerPrompt("utcp_codemode_usage", {
        title: "UTCP Code Mode Usage Guide",
        description: "Comprehensive guide on how to use the UTCP Code Mode MCP server for executing TypeScript code with tool access."
    }, async () => {
        const codeInstructions = `# UTCP Code Mode MCP Server Usage Guide

You have access to a powerful UTCP Code Mode MCP server that allows you to execute TypeScript code with direct access to registered tools.

## Workflow: Always Follow This Pattern

### 1. 🔍 DISCOVER TOOLS FIRST
**Always start by searching for relevant tools before writing code:**
- Use \`search_tools\` with a description of your task to find relevant tools
- This returns tools with their TypeScript interfaces - study these carefully
- Use \`tool_info\` to get detailed interface information for specific tools if needed

${CodeModeUtcpClient.AGENT_PROMPT_TEMPLATE}

- in the call_tool_chain code, return the result that you want to see, your code will be wrapped in an async function and executed

Remember: The power of this system comes from combining multiple tools in sophisticated TypeScript code execution workflows.`;

        return {
            messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: codeInstructions
                }
            }]
        };
    });

    mcpTools.registerTool("register_manual", {
        title: "Register a UTCP Manual",
        description: "Registers a new tool provider by providing its call template.",
        inputSchema: { manual_call_template: CallTemplateSchema.describe("The call template for the UTCP Manual endpoint.") },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const manualCallTemplate = input.manual_call_template;
        try {
            const result = await client.registerManual(manualCallTemplate as CallTemplateInput);
            return textResponse(JSON.stringify(result));
        } catch (e: unknown) {
            return errorResponse(e);
        }
    });

    mcpTools.registerTool("deregister_manual", {
        title: "Deregister a UTCP Manual",
        description: "Deregisters a tool provider from the UTCP client.",
        inputSchema: { manual_name: z.string().describe("The name of the manual to deregister.") },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const manualName = typeof input.manual_name === "string" ? input.manual_name : "";
        try {
            const success = await client.deregisterManual(manualName);
            const message = success ? `Manual '${manualName}' deregistered.` : `Manual '${manualName}' not found.`;
            return textResponse(JSON.stringify({ success, message }));
        } catch (e: unknown) {
            return errorResponse(e);
        }
    });

    mcpTools.registerTool("search_tools", {
        title: "Search for UTCP Tools",
        description: "Searches for relevant tools based on a task description.",
        inputSchema: {
            task_description: z.string().describe("A natural language description of the task."),
            limit: z.number().optional().default(DEFAULT_SEARCH_LIMIT),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const taskDescription = typeof input.task_description === "string" ? input.task_description : "";
        const limit = typeof input.limit === "number" ? input.limit : DEFAULT_SEARCH_LIMIT;
        try {
            const tools = await client.searchTools(taskDescription, limit);
            const toolsWithInterfaces = tools.map(t => ({
                name: t.name,
                description: t.description,
                typescript_interface: client.toolToTypeScriptInterface(t)
            }));
            return textResponse(JSON.stringify({ tools: toolsWithInterfaces }));
        } catch (e: unknown) {
            return errorResponse(e);
        }
    });

    mcpTools.registerTool("list_tools", {
        title: "List All Registered UTCP Tools",
        description: "Returns a list of all tool names currently registered.",
        inputSchema: {},
    }, async () => {
        const client = await initializeUtcpClient();
        try {
            const tools = await client.config.tool_repository.getTools();
            const toolNames = tools.map(t => t.name);
            return textResponse(JSON.stringify({ tools: toolNames }));
        } catch (e: unknown) {
            return errorResponse(e);
        }
    });

    mcpTools.registerTool("get_required_keys_for_tool", {
        title: "Get Required Variables for Tool",
        description: "Get required environment variables for a registered tool.",
        inputSchema: {
            tool_name: z.string().describe("Name of the tool to get required variables for."),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const toolName = typeof input.tool_name === "string" ? input.tool_name : "";
        try {
            const variables = await client.getRequiredVariablesForRegisteredTool(toolName);
            return textResponse(JSON.stringify({ success: true, tool_name: toolName, required_variables: variables }));
        } catch (e: unknown) {
            return errorResponse(e, { tool_name: toolName });
        }
    });

    mcpTools.registerTool("tool_info", {
        title: "Get Tool Information with TypeScript Interface",
        description: "Get complete information about a specific tool including TypeScript interface definition.",
        inputSchema: {
            tool_name: z.string().describe("Name of the tool to get complete information for."),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const toolName = typeof input.tool_name === "string" ? input.tool_name : "";
        try {
            const tool = await client.config.tool_repository.getTool(toolName);
            if (!tool) {
                return textResponse(JSON.stringify({ success: false, error: `Tool '${toolName}' not found` }));
            }
            return textResponse(client.toolToTypeScriptInterface(tool));
        } catch (e: unknown) {
            return errorResponse(e);
        }
    });

    mcpTools.registerTool("call_tool_chain", {
        title: "Execute TypeScript Code with Tool Access",
        description: "Execute TypeScript code with direct access to all registered tools as hierarchical functions (e.g., manual.tool()).",
        inputSchema: {
            code: z.string().describe("TypeScript code to execute with access to all registered tools."),
            timeout: z.number().optional().default(DEFAULT_CALL_TIMEOUT_MS).describe(`Optional timeout in milliseconds (default: ${DEFAULT_CALL_TIMEOUT_MS}).`),
            max_output_size: z.number().optional().default(DEFAULT_MAX_OUTPUT_SIZE).describe(`Optional maximum output size in characters (default: ${DEFAULT_MAX_OUTPUT_SIZE}).`),
        },
    }, async (input: Record<string, unknown>) => {
        const client = await initializeUtcpClient();
        const code = typeof input.code === "string" ? input.code : "";
        const timeout = typeof input.timeout === "number" ? input.timeout : DEFAULT_CALL_TIMEOUT_MS;
        const maxOutputSize = typeof input.max_output_size === "number" ? input.max_output_size : DEFAULT_MAX_OUTPUT_SIZE;
        try {
            const { result, logs } = await client.callToolChain(code, timeout);
            const content = JSON.stringify({ success: true, result, logs });
            if (content.length > maxOutputSize) {
                return textResponse(content.slice(0, maxOutputSize) + "...\nmax_output_size exceeded");
            }
            return textResponse(content);
        } catch (e: unknown) {
            return errorResponse(e);
        }
    });
}

// ───────────────────────────────────────────────────────────────────
// 7. UTCP CLIENT
// ───────────────────────────────────────────────────────────────────

async function initializeUtcpClient(): Promise<CodeModeUtcpClient> {
    if (utcpClient) {
        return utcpClient;
    }

    // Config lookup order: UTCP_CONFIG_FILE, then the working directory, then the package directory.
    const cwd = process.cwd();
    const packageDir = __dirname;

    let configPath: string;
    let scriptDir: string;

    if (process.env.UTCP_CONFIG_FILE) {
        configPath = path.resolve(process.env.UTCP_CONFIG_FILE);
        scriptDir = path.dirname(configPath);

        try {
            await fs.access(configPath);
        } catch {
            console.warn(`UTCP config file specified in UTCP_CONFIG_FILE not found: ${configPath}`);
        }
    } else {
        configPath = path.resolve(cwd, '.utcp_config.json');
        scriptDir = cwd;

        try {
            await fs.access(configPath);
        } catch {
            configPath = path.resolve(packageDir, '.utcp_config.json');
            scriptDir = packageDir;
        }
    }

    let rawConfig: unknown = {};
    try {
        const configFileContent = await fs.readFile(configPath, 'utf-8');
        rawConfig = JSON.parse(configFileContent);
    } catch (e: unknown) {
        if (getErrorCode(e) !== 'ENOENT') {
            console.warn(`Could not read or parse .utcp_config.json. Error: ${getErrorMessage(e)}`);
        }
    }

    const safeRawConfig = typeof rawConfig === "object" && rawConfig !== null
        ? rawConfig as Record<string, unknown>
        : {};

    const clientConfig = new UtcpClientConfigSerializer().validateDict(safeRawConfig);

    const newClient = await CodeModeUtcpClient.create(scriptDir, clientConfig);

    utcpClient = newClient;
    return utcpClient;
}

// ───────────────────────────────────────────────────────────────────
// 8. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    setupMcpTools();
    utcpClient = await initializeUtcpClient();
    await releaseIdleTransports(utcpClient);
    const transport = new StdioServerTransport();
    exitWhenSessionEnds(transport);
    await mcp.connect(transport);
}

main().catch(err => {
    console.error("Failed to start UTCP-MCP Bridge:", err);
    process.exit(1);
});
