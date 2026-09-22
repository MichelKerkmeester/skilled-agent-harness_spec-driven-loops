// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Spec Gate Enforce
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Pi is the one runtime that can ask the operator directly, so its delivery is
// a real dialog at the first mutation instead of a notice appended to a turn.
// The dialog exists in every mode: asking is not enforcement, and only the
// enforce env turns the same mutation into a block.
const CHOICE_EXISTING = "Use an existing spec folder";
const CHOICE_NEW = "Create a new spec folder";
const CHOICE_RELATED = "Use a related folder or phase child";
const CHOICE_SKIP = "Skip - no spec folder needed for this change";
const CHOICE_OPTIONS = [CHOICE_EXISTING, CHOICE_NEW, CHOICE_RELATED, CHOICE_SKIP];
const PATH_PLACEHOLDER = "specs/<track>/<NNN-name>";
const DIALOG_TIMEOUT_MS = 120_000;

function projectFilePath(input: Record<string, unknown>): string | undefined {
  for (const key of ["path", "file_path", "filePath"]) {
    if (typeof input[key] === "string" && input[key]) return input[key] as string;
  }
  return undefined;
}

type GateGuard = typeof import("../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs");
type GateContext = Parameters<Parameters<ExtensionAPI["on"]>[1]>[1];

interface DialogOutcome {
  answered: boolean;
  reason: string;
}

async function askForSpecFolder(
  guard: GateGuard,
  ctx: GateContext,
  sessionID: string,
): Promise<DialogOutcome> {
  const choice = await ctx.ui.select("Where should this change live?", CHOICE_OPTIONS, {
    timeout: DIALOG_TIMEOUT_MS,
  });
  if (choice === undefined) return { answered: false, reason: "" };

  if (choice === CHOICE_SKIP) {
    const bound = guard.bindGate3Answer({
      answer: { type: "skip" },
      sessionID,
      projectDir: ctx.cwd,
      env: process.env,
    });
    return bound.accepted
      ? { answered: true, reason: "Spec gate: skipped for this session. Retry the same call." }
      : { answered: false, reason: "" };
  }

  const enteredPath = await ctx.ui.input(
    choice === CHOICE_NEW ? `New spec folder path (${PATH_PLACEHOLDER})` : `Spec folder path (${PATH_PLACEHOLDER})`,
    PATH_PLACEHOLDER,
    { timeout: DIALOG_TIMEOUT_MS },
  );
  if (enteredPath === undefined || !enteredPath.trim()) return { answered: false, reason: "" };

  const candidate = enteredPath.trim();
  const bound = guard.bindGate3Answer({
    answer: { type: "binding", path: candidate },
    sessionID,
    projectDir: ctx.cwd,
    env: process.env,
  });
  if (!bound.accepted) {
    // Tell the operator why nothing was bound; the gate stays open and the
    // write proceeds under whatever the shipped policy says.
    ctx.ui.notify(`Spec gate: ${candidate} could not be bound (${bound.reason}).`, "warning");
    return { answered: false, reason: "" };
  }
  return { answered: true, reason: `Spec gate: bound to ${candidate} for this session. Retry the same call.` };
}

/** Asks the Gate-3 question at the first write/edit, or blocks a denied call. */
export default function specGateEnforce(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" && event.toolName !== "write" && event.toolName !== "edit") return;

      const guard = await import("../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs");
      // The session file stays stable across invocations of one conversation
      // while the session id is fresh per process; both hooks must key state
      // identically or classify's answer never reaches enforce's lookup.
      let sessionFile: string | undefined;
      try {
        sessionFile = ctx.sessionManager.getSessionFile();
      } catch {
        // A session-file lookup failure must not lose the mutation check --
        // fall back to the raw session id (resolveSessionKey handles it).
        sessionFile = undefined;
      }
      const sessionID = guard.resolveSessionKey({
        sessionId: ctx.sessionManager.getSessionId(),
        sessionFile,
      });
      const result = guard.runEnforceGate({
        tool: event.toolName,
        filePath: projectFilePath(event.input),
        sessionID,
        projectDir: ctx.cwd,
        env: process.env,
        runtimeKey: "pi",
      });

      const writeLikeTool = event.toolName === "write" || event.toolName === "edit";
      if (writeLikeTool && result.gateOpenUndelivered && ctx.hasUI) {
        const outcome = await askForSpecFolder(guard, ctx, sessionID);
        // Once per session either way: a cancelled dialog must not re-open on
        // every later write, and an answered one has already resolved the gate,
        // so this write is only a bookkeeping no-op.
        guard.recordGate3NoticeDelivered({
          sessionID,
          projectDir: ctx.cwd,
          env: process.env,
          channel: outcome.answered ? "dialog" : "dialog-cancelled",
        });
        if (outcome.answered) return { block: true, reason: outcome.reason };
      }

      if (result.decision === "deny") {
        return { block: true, reason: result.detail || "Mutation blocked by the spec gate." };
      }
    } catch {
      // Fail open because a guard bug must never block correctly-scoped work.
      return undefined;
    }
    return undefined;
  });
}
