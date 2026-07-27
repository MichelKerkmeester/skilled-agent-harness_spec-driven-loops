import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

function resultText(findings: unknown[]): string {
  return findings.map((finding) => {
    if (!finding || typeof finding !== "object") return String(finding);
    const item = finding as { label?: unknown; stdout?: unknown };
    return `[${String(item.label || "quality")}]\n${String(item.stdout || "")}`.trim();
  }).join("\n\n");
}

export default function postEditQuality(pi: ExtensionAPI): void {
  pi.on("tool_result", async (event, ctx) => {
    try {
      if (event.toolName !== "edit" && event.toolName !== "write") return;
      const rawPath = event.input.path;
      if (typeof rawPath !== "string" || !rawPath) return;

      const filePath = resolve(ctx.cwd, rawPath);
      if (!existsSync(filePath)) return;

      const router = await import("../../.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs");
      const entries = router.resolveDispatch(filePath, ctx.cwd);
      const findings = router.runChecks(entries, router.CLAUDE_HOOK_BUDGET_MS, {
        perChildTimeoutMs: router.CLAUDE_CHECKER_TIMEOUT_MS,
        minCheckerMs: router.CLAUDE_MIN_CHECKER_MS,
      });
      const notices = findings.length > 0 ? [resultText(findings)] : [];
      const banner = router.runDistStalenessCheck(filePath, ctx.cwd, {
        timeoutMs: router.CLAUDE_CHECKER_TIMEOUT_MS,
      });
      if (banner) notices.push(banner);
      if (notices.length > 0) {
        return {
          content: [...event.content, { type: "text", text: notices.join("\n\n") }],
        };
      }
    } catch {
      // Fail open because a quality-check bug must never affect the edit it observes.
      return undefined;
    }
    return undefined;
  });
}
