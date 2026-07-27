// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Prompt Advisor
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { extractAdditionalContext, runClaudeHookAdapter } from "./lib/claude-hook-adapter.ts";

const TIMEOUT_MS = 2_800;

/** Bridges the skill-advisor's UserPromptSubmit recommendation into Pi's input event. Distinct from spec-gate-classify.ts, which only appends the Gate-3 documentation question. */
export default function promptAdvisor(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      if (!event.text.trim()) return;

      const stdout = runClaudeHookAdapter(
        ctx.cwd,
        "user-prompt-submit.js",
        { prompt: event.text, cwd: ctx.cwd, hook_event_name: "UserPromptSubmit" },
        TIMEOUT_MS,
      );
      const context = extractAdditionalContext(stdout);
      if (!context) return;

      return { action: "transform", text: `${event.text}\n\n${context}` };
    } catch {
      // Fail open because an advisor bug must never block a user turn.
      return undefined;
    }
  });
}
