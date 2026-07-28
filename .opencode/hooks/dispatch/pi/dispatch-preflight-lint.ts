// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Dispatch Preflight Lint
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { join } from "node:path";

/** Blocks or warns on a bash dispatch command that violates a target skill's hard rules. */
export default function dispatchPreflightLint(pi: ExtensionAPI): void {
  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" || typeof event.input.command !== "string") return;

      const [lint, audit] = await Promise.all([
        import("../../.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"),
        import("../../.opencode/hooks/dispatch/lib/dispatch-audit.mjs"),
      ]);
      const match = audit.DISPATCH_SHAPES.find((shape) => shape.test.test(event.input.command));
      if (!match) return;

      const skillMd = join(ctx.cwd, ".opencode", "skills", match.packetPath, "SKILL.md");
      const rules = lint.readHardRules(skillMd);
      if (rules.length === 0) return;

      const violations = lint.evaluate(event.input.command, rules);
      const blocking = violations.filter((violation) => violation.severity === "block");
      const warnings = violations.filter((violation) => violation.severity === "warn");
      if (blocking.length > 0) {
        return {
          block: true,
          reason: `Dispatch blocked by ${match.skill} hard-rule(s):\n` +
            blocking.map((violation) => `  • [${violation.id}] ${violation.message}`).join("\n"),
        };
      }
      if (warnings.length > 0) {
        return {
          reason: `Dispatch advisory for ${match.skill}:\n` +
            warnings.map((violation) => `  • [${violation.id}] ${violation.message}`).join("\n"),
        };
      }
    } catch {
      // Fail open because a dispatch lint bug must never block a valid command.
      return undefined;
    }
    return undefined;
  });
}
