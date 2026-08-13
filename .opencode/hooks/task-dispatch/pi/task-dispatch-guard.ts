// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Task Dispatch Guard
// ───────────────────────────────────────────────────────────────────
// Native `subagent` tool calls reach `tool_call` before execution; every core
// rejection is intentionally advisory-only here.

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";

type DispatchCore = typeof import("../lib/dispatch-guard.cjs");

async function loadDispatchCore(): Promise<DispatchCore> {
  try {
    return await import("../lib/dispatch-guard.cjs");
  } catch {
    return await import("../../.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs");
  }
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function dispatchInput(input: Record<string, unknown>): { subagentType?: string; prompt?: string } | null {
  if (typeof input.action === "string" || typeof input.resume === "string") return null;
  const prompt = firstString(input.task, input.message, input.workflowScript);
  if (!prompt) return null;
  return {
    subagentType: firstString(input.agent, input.subagent_type, input.subagentType),
    prompt,
  };
}

export default function taskDispatchGuard(pi: ExtensionAPI): void {
  if (!isHookEnabled("task-dispatch")) return undefined;

  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "subagent") return;
      const request = dispatchInput(event.input);
      if (!request) return;

      const core = await loadDispatchCore();
      const result = core.evaluateDispatch({
        ...request,
        sessionID: ctx.sessionManager.getSessionId(),
        projectDir: ctx.cwd,
        env: process.env,
      });
      const { stateDir } = core.resolveGuardPaths(ctx.cwd);
      for (const audit of result.audits || []) core.appendRejectModeDegradedAudit(stateDir, audit);
      for (const warning of result.warnings || []) core.appendWarningLog(stateDir, warning);

      const advisory = result.decision === "reject"
        ? result.detail
        : result.warnings?.join("\n");
      if (advisory) {
        if (result.decision === "reject") core.appendWarningLog(stateDir, advisory);
        return { reason: advisory };
      }
    } catch {
      // Fail open because a dispatch advisory must never block a valid subagent.
      return undefined;
    }
    return undefined;
  });
}
