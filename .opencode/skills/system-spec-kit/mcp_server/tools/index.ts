// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Re-exports all tool dispatch modules for context-server (T303).
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import * as contextTools from './context-tools.js';
import * as memoryTools from './memory-tools.js';
import * as causalTools from './causal-tools.js';
import * as checkpointTools from './checkpoint-tools.js';
import * as lifecycleTools from './lifecycle-tools.js';
// Code-graph MCP dispatch moved to standalone system_code_graph server per ADR-002.
import * as skillGraphTools from './skill-graph-tools.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';
import { handleCoverageGraphConvergence } from '../handlers/coverage-graph/convergence.js';
import { handleCoverageGraphQuery } from '../handlers/coverage-graph/query.js';
import { handleCoverageGraphStatus } from '../handlers/coverage-graph/status.js';
import { handleCoverageGraphUpsert } from '../handlers/coverage-graph/upsert.js';
import { handleCouncilGraphConvergence } from '../handlers/council-graph/convergence.js';
import { handleCouncilGraphQuery } from '../handlers/council-graph/query.js';
import { handleCouncilGraphStatus } from '../handlers/council-graph/status.js';
import { handleCouncilGraphUpsert } from '../handlers/council-graph/upsert.js';
import { parseArgs } from './types.js';
import type { MCPCallerContext } from '../lib/context/caller-context.js';
import type { MCPResponse } from './types.js';

function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map((entry) => ({ type: 'text' as const, text: entry.text })),
  };
}

type AdvisorToolName = 'advisor_recommend' | 'advisor_rebuild' | 'advisor_status' | 'advisor_validate';

const ADVISOR_PROXY_TOOL_NAMES: Set<string> = new Set<AdvisorToolName>([
  'advisor_recommend',
  'advisor_rebuild',
  'advisor_status',
  'advisor_validate',
]);
const ADVISOR_PROXY_TIMEOUT_MS = 10_000;
const ADVISOR_DEPRECATION_MESSAGE = '[advisor-deprecation] spec_kit_memory.advisor_* is deprecated; route via system_skill_advisor.advisor_*. Removal in 013/009/006.';
const ADVISOR_UNAVAILABLE_REASON = 'system_skill_advisor unavailable; legacy proxy in spec_kit_memory will be removed in 006';
let advisorDeprecationLogged = false;

function logAdvisorDeprecationOnce(): void {
  if (advisorDeprecationLogged) return;
  advisorDeprecationLogged = true;
  console.error(ADVISOR_DEPRECATION_MESSAGE);
}

function processEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

function findWorkspaceRoot(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 16; depth += 1) {
    if (existsSync(resolve(current, '.opencode', 'bin', 'skill-advisor-launcher.cjs'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

function withTimeout<T>(operation: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return new Promise<T>((resolvePromise, rejectPromise) => {
    timeout = setTimeout(() => {
      rejectPromise(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    timeout.unref?.();
    operation.then(
      (value) => {
        if (timeout) clearTimeout(timeout);
        resolvePromise(value);
      },
      (error: unknown) => {
        if (timeout) clearTimeout(timeout);
        rejectPromise(error);
      },
    );
  });
}

function advisorUnavailableResponse(toolName: AdvisorToolName): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        ok: false,
        reason: ADVISOR_UNAVAILABLE_REASON,
        advisory: true,
        tool: toolName,
        server: 'system_skill_advisor',
      }),
    }],
  };
}

function normalizeAdvisorResponse(result: unknown): MCPResponse {
  const content = Array.isArray((result as { content?: unknown }).content)
    ? (result as { content: Array<{ type?: unknown; text?: unknown }> }).content
    : [];
  return {
    isError: (result as { isError?: unknown }).isError === true ? true : undefined,
    content: content.map((entry) => ({
      type: 'text' as const,
      text: typeof entry.text === 'string' ? entry.text : JSON.stringify(entry),
    })),
  };
}

/**
 * @deprecated Temporary 013/009/005 compatibility proxy. Child 006 removes
 * memory-side advisor registrations after consumers finish moving to
 * system_skill_advisor.advisor_*.
 */
async function proxyAdvisorTool(toolName: AdvisorToolName, args: Record<string, unknown>): Promise<MCPResponse> {
  logAdvisorDeprecationOnce();

  const workspaceRoot = findWorkspaceRoot();
  const launcherPath = resolve(workspaceRoot, '.opencode', 'bin', 'skill-advisor-launcher.cjs');
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [launcherPath],
    cwd: workspaceRoot,
    env: processEnv(),
    stderr: 'pipe',
  });
  const client = new Client({ name: 'spec_kit_memory-advisor-proxy', version: '0.1.0' });

  try {
    await withTimeout(client.connect(transport), ADVISOR_PROXY_TIMEOUT_MS, 'system_skill_advisor initialize');
    const result = await withTimeout(
      client.callTool({ name: toolName, arguments: args }),
      ADVISOR_PROXY_TIMEOUT_MS,
      `system_skill_advisor.${toolName}`,
    );
    return normalizeAdvisorResponse(result);
  } catch {
    return advisorUnavailableResponse(toolName);
  } finally {
    try {
      await client.close();
    } catch {
      // Best-effort cleanup. The proxy must never crash spec_kit_memory.
    }
  }
}

export const coverageGraphTools = {
  TOOL_NAMES: new Set([
    'deep_loop_graph_upsert',
    'deep_loop_graph_query',
    'deep_loop_graph_status',
    'deep_loop_graph_convergence',
  ]),
  async handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    switch (name) {
      case 'deep_loop_graph_upsert':
        return toMCP(await handleCoverageGraphUpsert(parseArgs<Parameters<typeof handleCoverageGraphUpsert>[0]>(args)));
      case 'deep_loop_graph_query':
        return toMCP(await handleCoverageGraphQuery(parseArgs<Parameters<typeof handleCoverageGraphQuery>[0]>(args)));
      case 'deep_loop_graph_status':
        return toMCP(await handleCoverageGraphStatus(parseArgs<Parameters<typeof handleCoverageGraphStatus>[0]>(args)));
      case 'deep_loop_graph_convergence':
        return toMCP(await handleCoverageGraphConvergence(parseArgs<Parameters<typeof handleCoverageGraphConvergence>[0]>(args)));
      default:
        return null;
    }
  },
};

export const councilGraphTools = {
  TOOL_NAMES: new Set([
    'council_graph_upsert',
    'council_graph_query',
    'council_graph_status',
    'council_graph_convergence',
  ]),
  async handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    switch (name) {
      case 'council_graph_upsert':
        return toMCP(await handleCouncilGraphUpsert(parseArgs<Parameters<typeof handleCouncilGraphUpsert>[0]>(args)));
      case 'council_graph_query':
        return toMCP(await handleCouncilGraphQuery(parseArgs<Parameters<typeof handleCouncilGraphQuery>[0]>(args)));
      case 'council_graph_status':
        return toMCP(await handleCouncilGraphStatus(parseArgs<Parameters<typeof handleCouncilGraphStatus>[0]>(args)));
      case 'council_graph_convergence':
        return toMCP(await handleCouncilGraphConvergence(parseArgs<Parameters<typeof handleCouncilGraphConvergence>[0]>(args)));
      default:
        return null;
    }
  },
};

export const advisorTools = {
  TOOL_NAMES: ADVISOR_PROXY_TOOL_NAMES,
  async handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    if (!ADVISOR_PROXY_TOOL_NAMES.has(name as AdvisorToolName)) return null;
    return proxyAdvisorTool(name as AdvisorToolName, parseArgs<Record<string, unknown>>(args));
  },
};

const SCHEMA_VALIDATED_TOOL_NAMES = new Set<string>([
  ...skillGraphTools.TOOL_NAMES,
  ...advisorTools.TOOL_NAMES,
  ...coverageGraphTools.TOOL_NAMES,
  ...councilGraphTools.TOOL_NAMES,
]);

export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools, skillGraphTools };

export type { MCPResponse } from './types.js';

/** All tool dispatch modules in priority order */
export const ALL_DISPATCHERS = [
  contextTools,
  memoryTools,
  causalTools,
  checkpointTools,
  lifecycleTools,
  // codeGraphTools intentionally omitted: standalone system_code_graph owns MCP dispatch per ADR-002.
  skillGraphTools,
  advisorTools,
  coverageGraphTools,
  councilGraphTools,
] as const;

/** Dispatch a tool call to the appropriate module. Returns null if unrecognized. */
export async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
  callerContext?: MCPCallerContext | null,
): Promise<import('./types.js').MCPResponse | null> {
  for (const dispatcher of ALL_DISPATCHERS) {
    if (dispatcher.TOOL_NAMES.has(name)) {
      const validatedArgs = SCHEMA_VALIDATED_TOOL_NAMES.has(name)
        ? validateToolArgs(name, args)
        : args;
      if (dispatcher === skillGraphTools) {
        return skillGraphTools.handleTool(name, validatedArgs, callerContext);
      }
      return dispatcher.handleTool(name, validatedArgs);
    }
  }
  return null;
}
