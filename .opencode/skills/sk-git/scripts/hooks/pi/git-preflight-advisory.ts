// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Git Preflight Advisory
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { join } from "node:path";

const MAX_ADVISORIES = 3;

function resolveSuppression(env: NodeJS.ProcessEnv) {
  const isOff = /^(0|false|off)$/i.test(env.SKGIT_ADVISORY || "");
  const skipped = (env.SKGIT_ADVISORY_SKIP || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  return {
    isOff,
    isSilenced: (id: string) => skipped.some((token) => id === token || id.startsWith(`${token}-`)),
  };
}

function formatAdvisory(command: string, violations: Array<{ id: string; message: string }>): string {
  const shown = violations.slice(0, MAX_ADVISORIES);
  const omitted = violations.length - shown.length;
  const subcommand = (command.match(/git\s+(?:-C\s+\S+\s+)?([a-z-]+)/) || [])[1] || "git";
  const lines = [
    `⚠ sk-git advisory — this \`git ${subcommand}\` may not do what it appears to:`,
    ...shown.map((violation) => `  • [${violation.id}] ${violation.message}`),
  ];
  if (omitted > 0) lines.push(`  • …and ${omitted} more; the rule set may need narrowing.`);
  lines.push("  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>");
  return lines.join("\n");
}

/** Advises on bash git commands that violate the shared sk-git hard rules. */
export default function gitPreflightAdvisory(pi: ExtensionAPI): void {
  // Advisory text is evaluated before execution but delivered on the tool RESULT, keyed by
  // call id. Pi's agent core reads a tool_call handler's return only for `.block` — a bare
  // `reason` without a block is discarded before the model ever sees it (confirmed against
  // the installed agent-loop source, and by a live dispatch where the warning never arrived).
  // A tool_result handler's returned content, by contrast, replaces what the model reads.
  const pendingByCallId = new Map<string, string>();
  const MAX_PENDING = 20;

  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" || typeof event.input.command !== "string") return;

      const [lint, gitChecks, gitContext] = await Promise.all([
        import("../../.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"),
        import("../../.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs"),
        import("../../.opencode/skills/sk-git/scripts/lib/git-context.mjs"),
      ]);
      const command = event.input.command;
      if (!gitChecks.GIT_SHAPE.test(command)) return;

      const suppression = resolveSuppression(process.env);
      if (suppression.isOff) return;

      const skillMd = join(ctx.cwd, ".opencode", "skills", "sk-git", "SKILL.md");
      const rules = lint.readHardRules(skillMd)
        .filter((rule) => gitChecks.GIT_CHECKS[rule.check] && !suppression.isSilenced(rule.id));
      if (rules.length === 0) return;

      const context = gitContext.createGitContext(ctx.cwd);
      if (!context.isRepo()) return;

      const violations = lint.evaluate(command, rules, {
        checks: gitChecks.GIT_CHECKS,
        context,
      });
      if (violations.length > 0) {
        if (pendingByCallId.size >= MAX_PENDING) {
          const oldest = pendingByCallId.keys().next().value;
          if (oldest !== undefined) pendingByCallId.delete(oldest);
        }
        pendingByCallId.set(event.toolCallId, formatAdvisory(command, violations));
      }
    } catch {
      // Fail open because an advisory bug must never block a valid command.
      return undefined;
    }
    return undefined;
  });

  pi.on("tool_result", async (event) => {
    try {
      const advisory = pendingByCallId.get(event.toolCallId);
      if (!advisory) return;
      pendingByCallId.delete(event.toolCallId);
      return {
        content: [...event.content, { type: "text", text: advisory }],
        details: event.details,
        isError: event.isError,
      };
    } catch {
      // Fail open: losing an advisory must never corrupt a tool result.
      return undefined;
    }
  });
}
