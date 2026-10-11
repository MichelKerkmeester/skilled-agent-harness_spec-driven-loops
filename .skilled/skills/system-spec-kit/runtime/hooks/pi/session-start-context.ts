// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Session Start Context
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as hookFlags from "../../.skilled/hooks/shared/hook-flags.mjs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { runClaudeHookAdapter } from "./lib/claude-hook-adapter.ts";

const TIMEOUT_MS = 2_800;
const SESSION_PRIME_ADAPTER = ".skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js";
function unbuiltNotice(cwd: string): string {
  return `Session-start context is off: no built spec-kit session hook under ${cwd}. Start Pi at the repository root, or build the runtime there: npm --prefix .skilled/skills/system-spec-kit run build`;
}

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
      if (!context) {
        // A missing build, or a session started away from the repository root, is a cause the user can fix, so name it instead of returning silently.
        if (!existsSync(join(ctx.cwd, SESSION_PRIME_ADAPTER))) ctx.ui.notify(unbuiltNotice(ctx.cwd), "warning");
        return;
      }

      pi.sendMessage({ customType: "session-start-context", content: context, display: false });
    } catch {
      // Fail open because a context-priming bug must never block session start.
      return undefined;
    }
  });
}
