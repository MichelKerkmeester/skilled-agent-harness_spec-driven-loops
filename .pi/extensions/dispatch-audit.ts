// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Dispatch Audit
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { join } from "node:path";

function textFromContent(content: unknown): string | undefined {
  if (!Array.isArray(content)) return undefined;
  const text = content
    .filter((item): item is { type: "text"; text: string } =>
      Boolean(item) && typeof item === "object" && (item as { type?: unknown }).type === "text" &&
      typeof (item as { text?: unknown }).text === "string")
    .map((item) => item.text)
    .join("\n");
  return text || undefined;
}

/** Records a completed bash dispatch to the shared JSONL audit log. */
export default function dispatchAudit(pi: ExtensionAPI): void {
  pi.on("tool_result", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" || typeof event.input.command !== "string") return;

      const audit = await import("../../.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs");
      audit.recordDispatch({
        command: event.input.command,
        logPath: join(ctx.cwd, audit.DEFAULT_LOG_RELATIVE_PATH),
        runtime: "pi",
        sessionID: ctx.sessionManager.getSessionId(),
        callID: event.toolCallId,
        outputText: textFromContent(event.content),
        metadataObj: { isError: event.isError, details: event.details },
        env: process.env,
      });
    } catch {
      // Fail open because an audit bug must never affect a completed command.
      return undefined;
    }
    return undefined;
  });
}
