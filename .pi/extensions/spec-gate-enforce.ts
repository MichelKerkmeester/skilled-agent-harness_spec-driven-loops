import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

function projectFilePath(input: Record<string, unknown>): string | undefined {

  for (const key of ["path", "file_path", "filePath"]) {
    if (typeof input[key] === "string" && input[key]) return input[key] as string;
  }
  return undefined;
}

export default function specGateEnforce(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" && event.toolName !== "write" && event.toolName !== "edit") return;

      const guard = await import("../../.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs");
      const result = guard.evaluateMutation({
        tool: event.toolName,
        filePath: projectFilePath(event.input),
        sessionID: ctx.sessionManager.getSessionId(),
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
