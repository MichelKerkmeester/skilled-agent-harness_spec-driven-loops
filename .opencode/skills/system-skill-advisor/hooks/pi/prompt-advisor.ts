// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Prompt Advisor
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// The shared advisor lifecycle module the claude/codex/cursor runtimes execute
// as a subprocess. Its CLI entrypoint is guarded, so importing it in-process is
// safe. Pi awaits input handlers before agent processing begins, so the old
// two-process blocking-spawn bridge stalled every send; calling the same
// lifecycle code directly removes that stall and lets its module-level prompt
// cache work.
const ADVISOR_HOOK_MODULE =
  "../../.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js";

interface AdvisorEnvelope {
  hookSpecificOutput?: {
    additionalContext?: string;
  };
}

/** Bridges the skill-advisor's UserPromptSubmit recommendation into Pi's input event. Distinct from spec-gate-classify.ts, which only appends the Gate-3 documentation question. */
export default function promptAdvisor(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      if (!event.text.trim()) return;

      const { handleClaudeUserPromptSubmit } = (await import(
        ADVISOR_HOOK_MODULE
      )) as {
        handleClaudeUserPromptSubmit?: (
          input: {
            prompt?: string;
            cwd?: string;
            hook_event_name?: string;
          },
        ) => Promise<AdvisorEnvelope | Record<string, unknown>>;
      };
      if (typeof handleClaudeUserPromptSubmit !== "function") {
        return undefined;
      }

      const output = await handleClaudeUserPromptSubmit({
        prompt: event.text,
        cwd: ctx.cwd,
        hook_event_name: "UserPromptSubmit",
      });
      const context = (output as AdvisorEnvelope).hookSpecificOutput
        ?.additionalContext;
      if (!context) return undefined;

      return { action: "transform", text: `${event.text}\n\n${context}` };
    } catch {
      // Fail open because an advisor bug must never block a user turn.
      return undefined;
    }
  });
}
