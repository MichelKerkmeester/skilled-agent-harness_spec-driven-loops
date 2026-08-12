// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Completion Evidence
// ───────────────────────────────────────────────────────────────────
// `turn_end` provides the ending assistant message, so this can evaluate the
// same advisory-only sentinel as Claude.

import type { ExtensionAPI, TurnEndEvent } from "@earendil-works/pi-coding-agent";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs";

type SentinelCore = typeof import("../../lib/hooks/completion-evidence-sentinel.cjs");

async function loadSentinelCore(): Promise<SentinelCore> {
  try {
    return await import("../../lib/hooks/completion-evidence-sentinel.cjs");
  } catch {
    return await import("../../.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs");
  }
}

function contentText(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((part) => part && typeof part === "object" && (part as { type?: unknown }).type === "text")
    .map((part) => String((part as { text?: unknown }).text ?? ""))
    .filter(Boolean)
    .join("\n");
}

function claimTextFrom(event: TurnEndEvent): string {
  const message = event.message as { role?: unknown; content?: unknown } | undefined;
  return message?.role === "assistant" ? contentText(message.content).trim() : "";
}

function readLastSpecFolder(projectDir: string, sessionId: string): string | null {
  try {
    const projectHash = createHash("sha256").update(projectDir).digest("hex").slice(0, 12);
    const sessionHash = createHash("sha256").update(sessionId).digest("hex").slice(0, 16);
    const statePath = join(tmpdir(), "speckit-claude-hooks", projectHash, `${sessionHash}.json`);
    const parsed = JSON.parse(readFileSync(statePath, "utf8")) as { lastSpecFolder?: unknown };
    const specFolder = typeof parsed.lastSpecFolder === "string" ? parsed.lastSpecFolder.trim() : "";
    return specFolder || null;
  } catch {
    return null;
  }
}

export default function completionEvidence(pi: ExtensionAPI): void {
  if (!isHookEnabled("completion")) return undefined;

  pi.on("turn_end", async (event, ctx) => {
    try {
      const core = await loadSentinelCore();
      const claimText = claimTextFrom(event);
      if (!core.detectCompletionClaim(claimText)) return;

      const sessionId = ctx.sessionManager.getSessionId();
      const specFolder = core.resolveSpecFolderFromText(claimText)
        || (sessionId ? readLastSpecFolder(ctx.cwd, sessionId) : null);
      if (!specFolder) return;

      const result = core.evaluateCompletionEvidence({
        specFolder,
        claimText,
        projectDir: ctx.cwd,
        env: process.env,
      });
      if (result.decision === "advise" && result.detail) {
        core.appendAdvisoryLog(ctx.cwd, result.detail);
        pi.sendMessage({
          customType: "completion-evidence-advisory",
          content: `[completion-evidence] ${result.detail}`,
          display: false,
        });
      }
    } catch {
      // Fail open because completion evidence must never block or alter a turn.
      return undefined;
    }
  });
}
