// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Overlay Guard
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isHookEnabled } from "../../shared/hook-flags.mjs";

const WRITE_TOOLS = new Set(["edit", "write"]);

/** Blocks a Pi edit or write to a file a vendored tree's overlay owns. */
export default function overlayGuard(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      if (!WRITE_TOOLS.has(event.toolName)) return undefined;
      if (!isHookEnabled("overlay-guard")) return undefined;

      const imported = await import("../lib/overlay-guard.cjs");
      const guard = imported.default ?? imported;
      const filePath = guard.fileFieldPath(event.input);
      if (!filePath) return undefined;

      const result = guard.evaluateWrite({ paths: [filePath], sessionDir: ctx.cwd });
      for (const note of result.notes) process.stderr.write(note + "\n");
      if (result.decision === "deny") return { block: true, reason: result.reason };
    } catch {
      // Fail open because a guard bug must never block a write it could not judge.
      return undefined;
    }
    return undefined;
  });
}
