// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Session Start Context
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as hookFlags from "../../.opencode/hooks/shared/hook-flags.mjs";
import { runClaudeHookAdapter } from "./lib/claude-hook-adapter.ts";

const TIMEOUT_MS = 2_800;

function sessionLifecycleHookEnabled(): boolean {
  try {
    return typeof hookFlags.isHookEnabled !== "function"
      || hookFlags.isHookEnabled("session-lifecycle") !== false;
  } catch {
    return true;
  }
}

/** Pi has no "compact" or "clear" SessionStart reason (those are Claude-only synthesized sources), so both map to the session-prime default: startup. */
function claudeSourceFor(reason: string): "startup" | "resume" {
  return reason === "resume" || reason === "fork" ? "resume" : "startup";
}

/** Bridges Claude's session-prime SessionStart context (compact recovery, resume reminder) into a Pi session_start message. */
export default function sessionStartContext(pi: ExtensionAPI): void {
  if (!sessionLifecycleHookEnabled()) return undefined;
  pi.on("session_start", async (event, ctx) => {
    try {
      const sessionId = ctx.sessionManager.getSessionId();
      if (!sessionId) return;

      // session-prime.js writes plain text to stdout, unlike user-prompt-submit.js's
      // hookSpecificOutput envelope -- devin's own JSON wrapping happens downstream
      // of this same raw-text return, in emitDevinContext, not in session-prime.js itself.
      const context = runClaudeHookAdapter(
        ctx.cwd,
        "session-prime.js",
        { session_id: sessionId, cwd: ctx.cwd, hook_event_name: "SessionStart", source: claudeSourceFor(event.reason) },
        TIMEOUT_MS,
      );
      if (!context) return;

      pi.sendMessage({ customType: "session-start-context", content: context, display: false });
    } catch {
      // Fail open because a context-priming bug must never block session start.
      return undefined;
    }
  });
}
