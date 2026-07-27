import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { spawn } from "node:child_process";
import { isAbsolute, join } from "node:path";

function filePathFromInput(input: Record<string, unknown>, cwd: string): string | undefined {
  const rawPath = input.path || input.file_path || input.filePath;
  if (typeof rawPath !== "string" || !rawPath) return undefined;
  return isAbsolute(rawPath) ? rawPath : join(cwd, rawPath);
}

function dispatchScan(projectDir: string, dispatch: { bin?: string; args?: string[]; env?: Record<string, string> }, core: any): void {
  if (!dispatch.bin || !Array.isArray(dispatch.args)) return;
  core.acquireScanLock({ projectDir });
  try {
    const child = spawn(process.execPath, [join(projectDir, dispatch.bin), ...dispatch.args], {
      cwd: projectDir,
      detached: true,
      stdio: "ignore",
      env: { ...process.env, ...(dispatch.env || {}) },
    });
    child.unref();
  } finally {
    core.releaseScanLock({ projectDir });
  }
}

export default function codeGraphFreshness(pi: ExtensionAPI): void {
  pi.on("tool_result", async (event, ctx) => {
    try {
      if (event.toolName !== "edit" && event.toolName !== "write") return;

      const core = await import("../../.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs");
      const result = core.evaluateEdit({
        filePath: filePathFromInput(event.input, ctx.cwd),
        sessionID: ctx.sessionManager.getSessionId(),
        projectDir: ctx.cwd,
        env: process.env,
      });
      for (const detail of [...(result.audits || []), ...(result.warnings || [])]) {
        core.appendFreshnessLog(ctx.cwd, detail, process.env);
      }
      if (result.decision === "scan" && result.dispatch) {
        dispatchScan(ctx.cwd, result.dispatch, core);
      }
    } catch {
      // Fail open because a freshness bug must never affect the edit it observes.
      return undefined;
    }
    return undefined;
  });
}
