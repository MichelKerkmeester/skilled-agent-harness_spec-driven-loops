// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Spec Gate Classify
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Opens the gate on a write-intent turn and deliberately asks nothing.
 *
 * Appending the menu to the user's own turn was the defect: a question in the
 * user's voice reads as a blocking request to an instruction-literal model, and
 * because the answer channel is the next message -- usually the next
 * instruction -- the gate stayed open and the menu was re-appended on every
 * triggering turn. Delivery moved to the first mutation (spec-gate-enforce). A
 * reframed deferral instruction survives only where no dialog can ask, so the
 * model still learns the decision is coming without stopping the turn.
 */
export default function specGateClassify(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      const guard = await import("../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs");
      // Input transforms chain across handlers, so this hook sees sibling
      // injections (the advisor's directives capsule) and the harness's
      // embedded conversation history appended to the user's own turn. The
      // injected prose contains literal trigger words ("write", "move"), and
      // history text re-opens the gate on read-only turns -- only the user's
      // own latest words may classify. The shared sanitizer owns the strip
      // contract (and its tests).
      const prompt = guard.sanitizePromptForClassify(event.text);
      let sessionFile: string | undefined;
      try {
        sessionFile = ctx.sessionManager.getSessionFile();
      } catch {
        // A session-file lookup failure must not lose the turn -- fall back
        // to the raw session id (resolveSessionKey handles it).
        sessionFile = undefined;
      }
      const sessionID = guard.resolveSessionKey({
        sessionId: ctx.sessionManager.getSessionId(),
        sessionFile,
      });
      const { question } = guard.runClassifyGate({
        prompt,
        sessionID,
        projectDir: ctx.cwd,
        env: process.env,
        runtimeLabel: "Pi",
      });
      if (question && !ctx.hasUI) {
        // No dialog exists in this mode, so hand the model the deferral once:
        // it must not stop now, only ask once at the first write.
        const { deliver } = guard.shouldDeliverGate3Deferral({
          sessionID,
          projectDir: ctx.cwd,
          env: process.env,
        });
        if (deliver) {
          const output = {
            action: "transform" as const,
            text: `${event.text}\n\n${guard.GATE_3_DEFERRED_INSTRUCTION}`,
          };
          guard.recordGate3NoticeDelivered({
            sessionID,
            projectDir: ctx.cwd,
            env: process.env,
            channel: "classify-deferral",
          });
          return output;
        }
      }
      return { action: "continue" };
    } catch {
      // Fail open because a classifier bug must never alter a valid user turn.
      return { action: "continue" };
    }
  });
}
