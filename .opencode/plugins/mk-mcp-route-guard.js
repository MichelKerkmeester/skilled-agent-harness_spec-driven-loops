// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-mcp-route-guard OpenCode Plugin (adapter)                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral             ║
// ║          mcp-route-guard core. On tool.execute.before, evaluates whether ║
// ║          a native external MCP call has a Code Mode manual registered   ║
// ║          for its family and, if so, appends a routing advisory to a     ║
// ║          bounded rotated log -- warn-only, log-only, never console      ║
// ║          output, never throws. Dormant until a native external MCP      ║
// ║          server is registered in opencode.json; harmless either way.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { appendFileSync, copyFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
// A .cjs core is imported here as the ESM default export so this file can stay
// a thin, default-export-only OpenCode plugin while the Claude hook consumes
// the identical policy.
const guardCore = require('../skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs');

const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'mcp-route-guard.log');
const MAX_LOG_BYTES = 256 * 1024;

// Plugin warnings must never reach stdout/stderr: OpenCode's TUI paints plugin
// console output onto the prompt input line, where it sticks until a redraw
// and corrupts the interactive session. Persisting to a bounded, rotated
// workspace log keeps the signal auditable without touching the session.
// Fail-open -- a logging error must never affect the call being observed.
function appendGuardLog(projectDir, detail) {
  try {
    const logPath = join(projectDir, WARN_LOG_RELATIVE);
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= MAX_LOG_BYTES) {
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch (_) {
      // A missing active log is the normal first-write case.
    }
    appendFileSync(logPath, `${new Date().toISOString()} [mk-mcp-route-guard] ${detail}\n`, 'utf8');
  } catch (_) {
    // Swallow: an audit-log failure must not disturb the call it observes.
  }
}

export default async function MkMcpRouteGuardPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (process.env.MK_MCP_ROUTE_GUARD_DISABLED === '1') return;
        const toolName = input && typeof input.tool === 'string' ? input.tool : null;
        if (!toolName) return;

        const result = guardCore.evaluateNativeMcpCall({
          toolName,
          projectDir,
          env: process.env,
        });

        for (const warning of result.warnings) appendGuardLog(projectDir, `WARN: ${warning}`);
        // Never throws: this guard has no stronger outcome than a logged advisory.
      } catch (error) {
        appendGuardLog(projectDir, `guard evaluation failed: ${error?.message || error}`);
      }
    },
  };
}
