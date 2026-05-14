// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Proxy Tools
// ───────────────────────────────────────────────────────────────
// Temporary 013/009/008 ADR-003 bridge: spec_kit_memory forwards legacy
// skill_graph_* calls to system_skill_advisor for one migration window.

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import { parseArgs } from './types.js';
import type { MCPResponse } from './types.js';
import type { MCPCallerContext } from '../lib/context/caller-context.js';

type SkillGraphToolName =
  | 'skill_graph_scan'
  | 'skill_graph_query'
  | 'skill_graph_status'
  | 'skill_graph_validate';

type SkillGraphForwarder = (
  toolName: SkillGraphToolName,
  args: Record<string, unknown>,
) => Promise<MCPResponse>;

export const TOOL_NAMES: Set<string> = new Set<SkillGraphToolName>([
  'skill_graph_scan',
  'skill_graph_query',
  'skill_graph_status',
  'skill_graph_validate',
]);

const SKILL_GRAPH_PROXY_TIMEOUT_MS = 10_000;
const SKILL_GRAPH_DEPRECATION_MESSAGE = 'spec_kit_memory.skill_graph_* is deprecated; call system_skill_advisor.skill_graph_* directly. See 013/009/008/ADR-003.';
const SKILL_GRAPH_UNAVAILABLE_REASON = 'system_skill_advisor unavailable; legacy skill_graph_* proxy in spec_kit_memory will be removed after 013/009/008 D2 Cluster D';

let deprecationLogged = false;
let forwarderOverride: SkillGraphForwarder | null = null;

function logDeprecationOnce(): void {
  if (deprecationLogged) return;
  deprecationLogged = true;
  console.error(SKILL_GRAPH_DEPRECATION_MESSAGE);
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

export function advisorUnavailableResponse(toolName: SkillGraphToolName, detail?: string): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        ok: false,
        reason: SKILL_GRAPH_UNAVAILABLE_REASON,
        ...(detail ? { detail } : {}),
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

async function callAdvisorMcp(toolName: SkillGraphToolName, args: Record<string, unknown>): Promise<MCPResponse> {
  const workspaceRoot = findWorkspaceRoot();
  const launcherPath = resolve(workspaceRoot, '.opencode', 'bin', 'skill-advisor-launcher.cjs');
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [launcherPath],
    cwd: workspaceRoot,
    env: processEnv(),
    stderr: 'pipe',
  });
  const client = new Client({ name: 'spec_kit_memory-skill-graph-proxy', version: '0.1.0' });

  try {
    await withTimeout(client.connect(transport), SKILL_GRAPH_PROXY_TIMEOUT_MS, 'system_skill_advisor initialize');
    const result = await withTimeout(
      client.callTool({ name: toolName, arguments: args }),
      SKILL_GRAPH_PROXY_TIMEOUT_MS,
      `system_skill_advisor.${toolName}`,
    );
    return normalizeAdvisorResponse(result);
  } finally {
    try {
      await client.close();
    } catch {
      // Best-effort cleanup. The proxy must never crash spec_kit_memory.
    }
  }
}

export function setSkillGraphForwarderForTests(forwarder: SkillGraphForwarder | null): void {
  forwarderOverride = forwarder;
}

export function resetSkillGraphProxyForTests(): void {
  deprecationLogged = false;
  forwarderOverride = null;
}

export async function proxySkillGraphTool(
  toolName: SkillGraphToolName,
  args: Record<string, unknown>,
): Promise<MCPResponse> {
  logDeprecationOnce();
  const forwarder = forwarderOverride ?? callAdvisorMcp;

  try {
    return await withTimeout(
      forwarder(toolName, args),
      SKILL_GRAPH_PROXY_TIMEOUT_MS,
      `system_skill_advisor.${toolName}`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return advisorUnavailableResponse(toolName, message);
  }
}

export async function handleTool(
  name: string,
  args: Record<string, unknown>,
  _callerContext?: MCPCallerContext | null,
): Promise<MCPResponse | null> {
  if (!TOOL_NAMES.has(name as SkillGraphToolName)) {
    return null;
  }
  return proxySkillGraphTool(name as SkillGraphToolName, parseArgs<Record<string, unknown>>(args));
}
