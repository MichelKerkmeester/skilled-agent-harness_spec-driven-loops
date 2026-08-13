// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Session Compact Context
// ───────────────────────────────────────────────────────────────────
//
// Native port of the devin PostCompaction adapter's recovery chain, not a
// spawnSync proxy: Pi's session_compact event already carries the real
// compactionEntry.summary in-process, so there is no transcript-shaped
// payload to synthesize. Reuses the same shared tmpdir state file and
// `spec-memory.cjs` CLI fallback devin's post-compaction.cjs reads.

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as hookFlags from "../../../../../../.opencode/hooks/shared/hook-flags.mjs";

const MAX_CONTEXT_BYTES = 4_096;
const MEMORY_CONTEXT_TIMEOUT_MS = 2_500;

function sessionLifecycleHookEnabled(): boolean {
  try {
    return typeof hookFlags.isHookEnabled !== "function"
      || hookFlags.isHookEnabled("session-lifecycle") !== false;
  } catch {
    return true;
  }
}

function readLastSpecFolder(cwd: string, sessionId: string): string | null {
  try {
    const projectHash = createHash("sha256").update(cwd).digest("hex").slice(0, 12);
    const sessionHash = createHash("sha256").update(sessionId).digest("hex").slice(0, 16);
    const statePath = join(tmpdir(), "speckit-claude-hooks", projectHash, `${sessionHash}.json`);
    const parsed = JSON.parse(readFileSync(statePath, "utf8")) as { lastSpecFolder?: unknown };
    const specFolder = typeof parsed.lastSpecFolder === "string" ? parsed.lastSpecFolder.trim() : "";
    return specFolder || null;
  } catch {
    return null;
  }
}

function boundedMemoryContextResume(projectDir: string): string | null {
  try {
    const binPath = join(projectDir, ".opencode", "bin", "spec-memory.cjs");
    const raw = execFileSync(
      process.execPath,
      [
        binPath, "memory_context",
        "--json", JSON.stringify({ input: "resume previous work after compaction", mode: "resume" }),
        "--format", "json",
        "--timeout-ms", String(MEMORY_CONTEXT_TIMEOUT_MS),
      ],
      { cwd: projectDir, timeout: MEMORY_CONTEXT_TIMEOUT_MS + 500, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    const parsed = JSON.parse(raw) as { data?: { summary?: unknown; context?: unknown }; summary?: unknown } | null;
    const text = parsed?.data?.summary ?? parsed?.summary ?? parsed?.data?.context;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

function sanitizeForInjection(text: string): string {
  const stripped = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
  if (!stripped) return "";
  const buf = Buffer.from(stripped, "utf8");
  return buf.length <= MAX_CONTEXT_BYTES ? stripped : `${buf.subarray(0, MAX_CONTEXT_BYTES).toString("utf8")}...`;
}

/** Rehydrates spec-folder continuity after a compaction, mirroring the devin PostCompaction recovery chain. */
export default function sessionCompactContext(pi: ExtensionAPI): void {
  if (!sessionLifecycleHookEnabled()) return undefined;
  pi.on("session_compact", async (event, ctx) => {
    try {
      const sessionId = ctx.sessionManager.getSessionId();
      const summary = event.compactionEntry?.summary?.trim() ?? "";
      const sections: string[] = [];

      if (summary) sections.push(`## Post-Compaction Summary\n${summary}`);
      if (sessionId) {
        const specFolder = readLastSpecFolder(ctx.cwd, sessionId);
        if (specFolder) sections.push(`## Active Spec Folder\n${specFolder}`);
      }
      if (!summary) {
        const resumeContext = boundedMemoryContextResume(ctx.cwd);
        if (resumeContext) sections.push(`## Resume Context (fallback)\n${resumeContext}`);
      }
      if (sections.length === 0) return;

      pi.sendMessage({
        customType: "session-compact-context",
        content: sanitizeForInjection(sections.join("\n\n")),
        display: false,
      });
    } catch {
      // Fail open because a compaction-recovery bug must never block compaction.
      return undefined;
    }
  });
}
