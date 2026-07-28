// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Spec Gate Classify
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** Appends the spec-folder gate question to a user turn the shared classifier flags. */
export default function specGateClassify(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      const guard = await import("../../.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs");
      const result = guard.classifyIntent({
        prompt: event.text,
        sessionID: ctx.sessionManager.getSessionId(),
        projectDir: ctx.cwd,
        env: process.env,
      });

      if (result.question) {
        return {
          action: "transform",
          text: `${event.text}\n\n${result.question}`,
        };
      }
      return { action: "continue" };
    } catch {
      // Fail open because a classifier bug must never alter a valid user turn.
      return { action: "continue" };
    }
  });
}
