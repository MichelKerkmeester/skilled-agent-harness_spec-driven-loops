// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - MCP Route Guard
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const MCP_TOOL_PREFIX = "mcp_";

/** Attaches shared MCP-route warnings to a native `mcp_*` tool call. */
export default function mcpRouteGuard(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      if (typeof event.toolName !== "string" || !event.toolName.startsWith(MCP_TOOL_PREFIX)) return;

      const guard = await import("../../.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs");
      const result = guard.evaluateNativeMcpCall({
        toolName: event.toolName,
        projectDir: ctx.cwd,
        env: process.env,
      });
      if (result.warnings && result.warnings.length > 0) {
        return { reason: result.warnings.join("\n") };
      }
    } catch {
      // Fail open because a route-guard bug must never block a valid MCP call.
      return undefined;
    }
    return undefined;
  });
}
