#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: mcp-route-guard Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the runtime-neutral mcp-route-guard core.
// It refuses a native external MCP call whose family has a Code Mode manual
// registered, with the core's routing advisory as the reason, and allows every
// other call. Vibe names an MCP call by its route, so the name is repacked into
// the shape the core parses before the core judges it. An error allows, so a
// guard bug never blocks a call it could not judge.

import { createRequire } from 'node:module';

import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import { allow, deny, readPayload, runGuard, REPO_ROOT } from './lib/hook-io.mjs';

const require = createRequire(import.meta.url);
const guardCore = require('../../../.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs');

// Vibe runs a configured server's tools in a group named "mcp_<server>", and a
// call arrives as "<group>.<tool>". The core reads the packed
// "mcp__<server>__<tool>" shape, whose reserved delimiter keeps a server name
// with single underscores unambiguous.
const VIBE_MCP_GROUP_PREFIX = 'mcp_';
const CORE_MCP_PREFIX = 'mcp__';
const CORE_SERVER_SEPARATOR = '__';

/**
 * Repack a Vibe MCP route into the core's packed tool name.
 * @param {unknown} toolName - The payload's qualified tool name.
 * @returns {string|null} The packed name, or null when the call is not MCP.
 */
function coreToolNameFor(toolName) {
  if (typeof toolName !== 'string' || !toolName.startsWith(VIBE_MCP_GROUP_PREFIX)) return null;
  const separator = toolName.indexOf('.');
  if (separator <= VIBE_MCP_GROUP_PREFIX.length || separator === toolName.length - 1) return null;
  const server = toolName.slice(VIBE_MCP_GROUP_PREFIX.length, separator);
  const tool = toolName.slice(separator + 1);
  return `${CORE_MCP_PREFIX}${server}${CORE_SERVER_SEPARATOR}${tool}`;
}

// Vibe prefixes the hook name on the tool error, so the core's own label is
// removed here rather than repeated in the reason the model reads.
function reasonFor(result) {
  const text = result.detail || result.warnings.join('\n');
  return text.replace(/^mcp-route-guard:\s*/i, '');
}

async function main() {
  const payload = await readPayload();
  if (!payload) return allow();

  const toolName = coreToolNameFor(payload.tool_name);
  if (!toolName || !isHookEnabled('mcp-route-guard')) return allow();

  const result = guardCore.evaluateNativeMcpCall({
    toolName,
    projectDir: REPO_ROOT,
    env: process.env,
  });
  return result.decision === 'warn' ? deny(reasonFor(result)) : allow();
}

await runGuard(main, 'mcp-route-guard');
