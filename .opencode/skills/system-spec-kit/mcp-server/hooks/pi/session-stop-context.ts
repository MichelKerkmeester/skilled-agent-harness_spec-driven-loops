// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Session Stop Context
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as hookFlags from "../../../../../../.opencode/hooks/shared/hook-flags.mjs";
import { runClaudeHookAdapter } from "./lib/claude-hook-adapter.ts";

const TIMEOUT_MS = 10_000;

function sessionLifecycleHookEnabled(): boolean {
  try {
    return typeof hookFlags.isHookEnabled !== "function"
      || hookFlags.isHookEnabled("session-lifecycle") !== false;
  } catch {
    return true;
  }
}

/** Bridges Claude's session-stop autosave/state-cleanup work into Pi's session_shutdown(reason="quit"). Fire-and-forget: session-stop.js performs side effects, not context injection. */
export default function sessionStopContext(pi: ExtensionAPI): void {
  if (!sessionLifecycleHookEnabled()) return undefined;
  pi.on("session_shutdown", async (event, ctx) => {
    try {
      if (event.reason !== "quit") return;
      const sessionId = ctx.sessionManager.getSessionId();
      if (!sessionId) return;

      runClaudeHookAdapter(
        ctx.cwd,
        "session-stop.js",
        { session_id: sessionId, cwd: ctx.cwd, hook_event_name: "Stop" },
        TIMEOUT_MS,
      );
    } catch {
      // Fail open because a shutdown-autosave bug must never block quit.
      return undefined;
    }
  });
}
