// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Spec Gate Classify
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** Appends the spec-folder gate question to a user turn the shared classifier flags. */
export default function specGateClassify(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      const guard = await import("../../.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs");
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
      const result = guard.classifyIntent({
        prompt,
        sessionID,
        projectDir: ctx.cwd,
        env: process.env,
      });

      if (result.question) {
        const lifecycleEpoch = guard.currentGate3LifecycleEpoch(sessionID);
        const observeArgs = {
          question: result.question,
          sessionID,
          lifecycleEpoch,
          gateState: guard.readGateState(guard.resolveGuardPaths(ctx.cwd).stateDir, sessionID),
          env: process.env,
          emitted: true,
          runtime: "Pi",
          receipt: guard.buildGate3ObservedReceipt(lifecycleEpoch),
        };
        const output = {
          action: "transform" as const,
          text: `${event.text}\n\n${result.question}`,
        };
        guard.observeGate3QuestionDelivery(observeArgs);
        return output;
      }
      return { action: "continue" };
    } catch {
      // Fail open because a classifier bug must never alter a valid user turn.
      return { action: "continue" };
    }
  });
}
