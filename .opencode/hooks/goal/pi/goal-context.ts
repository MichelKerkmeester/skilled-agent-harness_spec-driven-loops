// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Goal Context
// ───────────────────────────────────────────────────────────────────

import { join } from "node:path";
import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";

import type {
  ExtensionAPI,
  ExtensionCommandContext,
  ExtensionContext,
  TurnEndEvent,
} from "@earendil-works/pi-coding-agent";

// ─────────────────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = "pi";
const RUNTIME_LABEL = "Pi";
const DISCOVERY_CORE_PATH = "../../.opencode/hooks/goal/lib/goal-core.cjs";
const MANAGE_CLI_RELATIVE_PATH = ".opencode/hooks/goal/bin/goal.cjs";

type GoalRecord = {
  goalId?: string;
  status?: string;
  objective?: string;
  goalPrompt?: string;
  tokenBudget?: number | null;
  turnsUsed?: number;
  usageSource?: string;
  createdAtMs?: number;
  updatedAtMs?: number;
  runtime?: string;
  lastVerifierVerdict?: string;
  lastVerifierReason?: string | null;
};

type GoalOptions = {
  cwd: string;
  scope: { workspace: string; runtime: string; sessionId: string };
};

type GoalCore = {
  isPluginDisabled(): boolean;
  resolveRepoRoot(startDir: string): string;
  renderGoalBrief(input: { goal: GoalRecord | null; runtimeLabel: string }): string;
  verifyGoalHeuristic(input: { goal: GoalRecord; transcriptText: string }): { verdict: string; reason: string };
  readGoalRecord(options: GoalOptions): GoalRecord | null;
  recordTurn(input: object, options: GoalOptions): GoalRecord | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE AND COMMAND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function asGoalCore(module: unknown): GoalCore {
  const candidate = module as { default?: GoalCore } & Partial<GoalCore>;
  return candidate.default ?? candidate as GoalCore;
}

/** Load correctly from both the canonical file and Pi's discovery symlink. */
async function loadGoalCore(): Promise<GoalCore> {
  try {
    return asGoalCore(await import("../lib/goal-core.cjs"));
  } catch {
    return asGoalCore(await import(DISCOVERY_CORE_PATH));
  }
}

function goalOptions(ctx: ExtensionContext): GoalOptions {
  let sessionId = "";
  try {
    sessionId = ctx.sessionManager.getSessionId();
  } catch {
    // Missing identity must select no goal; mutation callers validate this scope.
  }
  return {
    cwd: ctx.cwd,
    scope: { workspace: ctx.cwd, runtime: RUNTIME, sessionId },
  };
}

async function runGoalCommand(
  pi: ExtensionAPI,
  rawArgs: string,
  ctx: ExtensionCommandContext,
): Promise<void> {
  try {
    const core = await loadGoalCore();
    const options = goalOptions(ctx);
    const repoRoot = core.resolveRepoRoot(ctx.cwd);
    const cliPath = join(repoRoot, MANAGE_CLI_RELATIVE_PATH);
    const userArgs = rawArgs.trim().split(/\s+/).filter(Boolean);
    const result = await pi.exec(
      process.execPath,
      [
        cliPath,
        ...(userArgs.length > 0 ? userArgs : ["show"]),
        "--runtime",
        RUNTIME_LABEL,
        "--session",
        options.scope.sessionId,
        "--workspace",
        options.scope.workspace,
      ],
      { cwd: repoRoot, timeout: 10_000 },
    );
    const output = (result.stdout || result.stderr).trim();
    if (!output) {
      ctx.ui.notify(
        'STATUS=FAIL ACTION=show ERROR="Goal manage CLI returned no output"\ncode=GOAL_CLI_EMPTY',
        "error",
      );
      return;
    }
    ctx.ui.notify(output, output.startsWith("STATUS=OK") ? "info" : "error");
  } catch {
    ctx.ui.notify(
      'STATUS=FAIL ACTION=show ERROR="Goal manage CLI is unavailable"\ncode=GOAL_CLI_UNAVAILABLE',
      "error",
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LIFECYCLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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
 * or session. Core loading supports both the canonical source path and Pi's
 * discovery symlink without assuming which path its loader preserves.
 *
 * NOTE: `turn_end`/`agent_end`/`agent_settled` are `void`-returning events
 * in Pi's extension API, so a handler cannot force continuation. The
 * `turn_end` handler below records the turn and, when the heuristic verifier
 * finds the goal not yet met, surfaces a non-blocking nudge via
 * `pi.sendMessage`. It never re-queues, steers, or blocks a turn.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGISTRATION
// ─────────────────────────────────────────────────────────────────────────────

export default function goalContext(pi: ExtensionAPI): void {
  if (!isHookEnabled("goal")) return undefined;
  pi.registerCommand("goal-pi", {
    description: "Manage the active goal for this Pi session",
    handler: (args, ctx) => runGoalCommand(pi, args, ctx),
  });

  pi.on("input", async (event, ctx) => {
    try {
      const core = await loadGoalCore();
      if (core.isPluginDisabled()) return { action: "continue" };
      const goal = core.readGoalRecord(goalOptions(ctx));
      const brief = core.renderGoalBrief({ goal, runtimeLabel: RUNTIME_LABEL });
      if (!brief) return { action: "continue" };
      return { action: "transform", text: `${event.text}\n\n${brief}` };
    } catch {
      // Fail open because a goal-state bug must never alter a valid user turn.
      return { action: "continue" };
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    try {
      const core = await loadGoalCore();
      if (core.isPluginDisabled()) return;
      const goal = core.readGoalRecord(goalOptions(ctx));
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
      const core = await loadGoalCore();
      if (core.isPluginDisabled()) return;
      const options = goalOptions(ctx);
      const goal = core.readGoalRecord(options);
      if (!goal || goal.status !== "active") return;

      const transcriptText = extractTurnEndText(event);
      const verdict = core.verifyGoalHeuristic({ goal, transcriptText });
      core.recordTurn({}, options);

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
