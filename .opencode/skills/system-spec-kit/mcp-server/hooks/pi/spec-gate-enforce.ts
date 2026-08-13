// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Spec Gate Enforce
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

function projectFilePath(input: Record<string, unknown>): string | undefined {
  for (const key of ["path", "file_path", "filePath"]) {
    if (typeof input[key] === "string" && input[key]) return input[key] as string;
  }
  return undefined;
}

/** Blocks a bash/write/edit tool call the shared spec-gate core denies. */
export default function specGateEnforce(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" && event.toolName !== "write" && event.toolName !== "edit") return;

      const guard = await import("../../.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs");
      // The session file stays stable across invocations of one conversation
      // while the session id is fresh per process; both hooks must key state
      // identically or classify's answer never reaches enforce's lookup.
      let sessionFile: string | undefined;
      try {
        sessionFile = ctx.sessionManager.getSessionFile();
      } catch {
        // A session-file lookup failure must not lose the mutation check --
        // fall back to the raw session id (resolveSessionKey handles it).
        sessionFile = undefined;
      }
      const result = guard.evaluateMutation({
        tool: event.toolName,
        filePath: projectFilePath(event.input),
        sessionID: guard.resolveSessionKey({
          sessionId: ctx.sessionManager.getSessionId(),
          sessionFile,
        }),
        projectDir: ctx.cwd,
        env: process.env,
      });

      if (result.decision === "deny") {
        return { block: true, reason: result.detail || "Mutation blocked by the spec gate." };
      }
    } catch {
      // Fail open because a guard bug must never block correctly-scoped work.
      return undefined;
    }
    return undefined;
  });
}
