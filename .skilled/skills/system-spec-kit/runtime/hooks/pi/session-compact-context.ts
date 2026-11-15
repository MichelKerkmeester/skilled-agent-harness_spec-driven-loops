// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Session Compact Context
// ───────────────────────────────────────────────────────────────────
//
// Native port of the devin PostCompaction adapter's recovery chain, not a
// spawnSync proxy: Pi's session_compact event already carries the real
// compactionEntry.summary in-process, so there is no transcript-shaped
// payload to synthesize. Reuses the same shared tmpdir state file
// devin's post-compaction.cjs reads.

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import * as hookFlags from "../../../../../hooks/shared/hook-flags.mjs";
import { fitRecoverySections } from "../lib/history/lookup-offer.ts";

const MAX_CONTEXT_BYTES = 4_096;

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

/**
 * The packet's purpose as a recovery section, read through the built helper
 * the Claude adapter uses. A missing build or an unreadable packet yields
 * null, so the purpose can be lost but the compaction recovery cannot.
 */
async function readPacketPurposeSection(cwd: string, specFolder: string): Promise<string | null> {
  try {
    type PacketPurposeModule = typeof import("../../lib/spec/packet-purpose.ts");
    const { enclosingPacketFolder, formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } = await import(
      "../../dist/lib/spec/packet-purpose.js"
    ) as PacketPurposeModule;
    const root = resolve(cwd);
    // The folder is read from a temp state file, and can be a track folder or a
    // packet subfolder. The resolver keeps it in the project, as on Claude.
    const folder = enclosingPacketFolder(specFolder, root);
    if (!folder) return null;
    const purpose = resolvePacketPurpose(folder);
    if (!purpose) return null;
    const line = formatPacketPurpose(purpose, root);
    const problem = formatPacketProblem(purpose);
    return `## Packet Purpose\n${problem ? `${line}\n${problem}` : line}`;
  } catch (error) {
    // A stale or missing build drops the purpose, so say so on stderr rather
    // than lose it silently. The recovery itself still goes ahead.
    process.stderr.write(`WARN [speckit-hook:session-compact-context] packet purpose unavailable: ${String(error)}\n`);
    return null;
  }
}

function stripControlCharacters(text: string): string {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
}

export function buildRecoveryPointer(): string {
  return "## Recovery\nRun `/speckit:resume` against the active packet to recover session state.";
}

/** Rehydrates spec-folder continuity after a compaction, mirroring the devin PostCompaction recovery chain. */
export default function sessionCompactContext(pi: ExtensionAPI): void {
  if (!sessionLifecycleHookEnabled()) return undefined;
  pi.on("session_compact", async (event, ctx) => {
    try {
      const sessionId = ctx.sessionManager.getSessionId();
      const summary = event.compactionEntry?.summary?.trim() ?? "";
      const sections: string[] = [];
      const summarySection = summary
        ? stripControlCharacters(`## Post-Compaction Summary\n${summary}`)
        : null;
      if (sessionId) {
        const specFolder = readLastSpecFolder(ctx.cwd, sessionId);
        if (specFolder) {
          const purpose = await readPacketPurposeSection(ctx.cwd, specFolder);
          if (purpose) sections.push(purpose);
          sections.push(`## Active Spec Folder\n${specFolder}`);
        }
      }

      sections.push(buildRecoveryPointer());

      pi.sendMessage({
        customType: "session-compact-context",
        content: fitRecoverySections(summarySection, sections.map(stripControlCharacters), MAX_CONTEXT_BYTES),
        display: false,
      });
    } catch {
      // Fail open because a compaction-recovery bug must never block compaction.
      return undefined;
    }
  });
}
