// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Goal Context
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI, TurnEndEvent } from "@earendil-works/pi-coding-agent";

const RUNTIME_LABEL = "Pi";

/** Flattens a Message-shaped `content` field (plain string, or a `TextContent[]`-style array) into plain text. */
function extractContentText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (item && typeof item === "object" && (item as { type?: unknown }).type === "text") {
          return String((item as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

/** Flattens a `turn_end` event's ending message plus any tool results into one evidence string for the heuristic verifier. */
function extractTurnEndText(event: TurnEndEvent): string {
  const messageText = extractContentText((event.message as { content?: unknown } | undefined)?.content);
  const toolResultText = (event.toolResults || [])
    .map((result) => extractContentText(result.content))
    .filter(Boolean)
    .join("\n");
  return [messageText, toolResultText].filter(Boolean).join("\n");
}

/**
 * Registers the shared active-goal brief across three Pi lifecycle points:
 * `input` (operator-visible per-turn injection, chains additively with any
 * other registered `input` handler), `session_start` (restore on a fresh
 * session), and `turn_end` (heuristic verify -- observe-only, see NOTE).
 * Every handler dynamic-imports the runtime-neutral goal core at call time
 * and fails open on any error so a goal-state bug can never block a Pi turn
 * or session; imports are written relative to Pi's fixed discovery
 * directory, the base its loader resolves a symlinked extension's relative
 * imports against, not this file's own real path.
 *
 * NOTE: `turn_end`/`agent_end`/`agent_settled` are `void`-returning events
 * in Pi's extension API -- there is no result type a handler can return to
 * force continuation the way Devin's `Stop` can. The `turn_end` handler
 * below only records the turn and, when the heuristic verifier finds the
 * goal not yet met, surfaces a non-blocking nudge via `pi.sendMessage`. It
 * never re-queues, steers, or blocks a turn.
 */
export default function goalContext(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      const core = await import("../../.opencode/hooks/goal/lib/goal-core.cjs");
      if (core.isPluginDisabled()) return { action: "continue" };
      const goal = core.readGoalRecord({ cwd: ctx.cwd });
      const brief = core.renderGoalBrief({ goal, runtimeLabel: RUNTIME_LABEL });
      if (!brief) return { action: "continue" };
      return { action: "transform", text: `${event.text}\n\n${brief}` };
    } catch {
      // Fail open because a goal-state bug must never alter a valid user turn.
      return { action: "continue" };
    }
  });

  pi.on("session_start", async (event, ctx) => {
    try {
      const core = await import("../../.opencode/hooks/goal/lib/goal-core.cjs");
      if (core.isPluginDisabled()) return;
      const goal = core.readGoalRecord({ cwd: ctx.cwd });
      const brief = core.renderGoalBrief({ goal, runtimeLabel: RUNTIME_LABEL });
      if (!brief) return;
      pi.sendMessage({ customType: "goal-context-restore", content: brief, display: false });
    } catch {
      // Fail open because a goal-state bug must never block session start.
      return undefined;
    }
  });

  pi.on("turn_end", async (event, ctx) => {
    try {
      const core = await import("../../.opencode/hooks/goal/lib/goal-core.cjs");
      if (core.isPluginDisabled()) return;
      const goal = core.readGoalRecord({ cwd: ctx.cwd });
      if (!goal || goal.status !== "active") return;

      const transcriptText = extractTurnEndText(event);
      const verdict = core.verifyGoalHeuristic({ goal, transcriptText });
      core.recordTurn({ runtime: "pi" }, { cwd: ctx.cwd });

      if (verdict.verdict !== "met") {
        pi.sendMessage({
          customType: "goal-verify-nudge",
          content: `[goal_verify] verdict=${verdict.verdict}; reason=${verdict.reason}`,
          display: false,
        });
      }
    } catch {
      // Fail open because a verify bug must never block or alter a turn.
      return undefined;
    }
  });
}
