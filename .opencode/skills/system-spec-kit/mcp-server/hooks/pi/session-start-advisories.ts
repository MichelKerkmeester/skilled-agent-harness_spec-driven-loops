// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Session Start Advisories
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as hookFlags from "../../.opencode/hooks/shared/hook-flags.mjs";

function sessionLifecycleHookEnabled(): boolean {
  try {
    return typeof hookFlags.isHookEnabled !== "function"
      || hookFlags.isHookEnabled("session-lifecycle") !== false;
  } catch {
    return true;
  }
}

function advisoryConcernEnabled(concern: string): boolean {
  try {
    return typeof hookFlags.isHookEnabled !== "function"
      || hookFlags.isHookEnabled(concern) !== false;
  } catch {
    return true;
  }
}

interface AdvisoryCheck {
  readonly label: string;
  readonly concern: string;
  readonly command: string;
  readonly args: string[];
}

const CHECKS: AdvisoryCheck[] = [
  { label: "worktree-guard", concern: "worktree-guard", command: "bash", args: [".opencode/bin/worktree-guard.sh"] },
  { label: "check-git-hooks", concern: "git-hooks-check", command: "bash", args: [".opencode/bin/check-git-hooks.sh"] },
  { label: "live-sync-follow", concern: "live-sync", command: "bash", args: [".opencode/bin/git-live-follow.sh", "--start"] },
  {
    label: "check-dist-staleness",
    concern: "dist-freshness",
    command: "bash",
    args: [".opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh", "--all"],
  },
  { label: "install-codex-hooks", concern: "hook-install", command: "node", args: [".opencode/bin/install-codex-hooks.mjs", "--check"] },
];

/** Runs the same warn-only, always-exit-0 SessionStart advisory scripts cursor/devin wire into their SessionStart chain, surfacing any warning text via a Pi notification. */
export default function sessionStartAdvisories(pi: ExtensionAPI): void {
  if (!sessionLifecycleHookEnabled()) return undefined;
  pi.on("session_start", async (event, ctx) => {
    if (event.reason !== "startup" && event.reason !== "new") return;
    for (const check of CHECKS) {
      if (!advisoryConcernEnabled(check.concern)) continue;
      try {
        const result = await ctx.exec(check.command, check.args, { cwd: ctx.cwd, timeout: 5_000 });
        const warning = (result.stderr || result.stdout || "").trim();
        if (warning) ctx.ui.notify(warning, "warning");
      } catch {
        // Fail open because an advisory-check bug must never block session start.
      }
    }
  });
}
