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
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as hookFlags from "../../../../../hooks/shared/hook-flags.mjs";
import {
  historyHandle,
  persistHistoryLocator,
} from "../lib/history/locator-digest.ts";
import { buildHistoryLookupSection, fitRecoverySections, placeLookup } from "../lib/history/lookup-offer.ts";

const MAX_CONTEXT_BYTES = 4_096;
const HISTORY_LOCATOR_VERSION = 1;
const HISTORY_LOCATOR_KIND = "live_branch_or_session_log";
const HISTORY_LOCATOR_SOURCE = "post_compaction";

type HistoryLocator = {
  version: typeof HISTORY_LOCATOR_VERSION;
  runtime: "pi";
  sessionId: string;
  workspace: string;
  sessionDirectory?: string;
  locatorKind: typeof HISTORY_LOCATOR_KIND;
  handle: string;
  mintedAt: string;
  provenance: {
    source: typeof HISTORY_LOCATOR_SOURCE;
    capturedAt: string;
  };
};

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

function stripControlCharacters(text: string): string {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
}

async function loadHistoryCapability(runtime: string): Promise<boolean> {
  try {
    const readers = (await import("../../../../../hooks/shared/session-readers/index.mjs")) as {
      capabilities?: Record<string, { status?: string } | undefined>;
    };
    return readers.capabilities?.[runtime]?.status === "ready";
  } catch {
    return false;
  }
}

/**
 * The handle is a digest of the exact live identity, never a path: a locator
 * that contains no store path cannot leak one or be authored by a model. It is
 * keyed by the checkout root above the session folder, where the printed
 * command runs, and a folder no root can serve gets no locator.
 */
export function mintHistoryLocator(
  sessionId: string,
  workspace: string,
  mintedAt: string,
): HistoryLocator | null {
  const normalizedSession = sessionId.trim();
  const normalizedWorkspace = workspace.trim();
  if (!normalizedSession || /[/\\\0]/.test(normalizedSession) || !normalizedWorkspace) return null;
  const placement = placeLookup(normalizedWorkspace);
  if (!placement) return null;
  const identity = {
    runtime: "pi" as const,
    sessionId: normalizedSession,
    ...placement,
    locatorKind: HISTORY_LOCATOR_KIND,
  };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: historyHandle(identity),
    mintedAt,
    provenance: { source: HISTORY_LOCATOR_SOURCE, capturedAt: mintedAt },
  };
}

export function buildRecoveryPointer(): string {
  return "## Recovery\nRun `/speckit:resume` against the active packet to recover session state.";
}

/**
 * Persist the locator beside the other hook state so the printed command can
 * redeem it. Best-effort: a missing dist build or unwritable state directory
 * must never block compaction, and the caller withholds the offer when the
 * write did not land.
 */
async function persistLocator(locator: HistoryLocator): Promise<boolean> {
  try {
    const { ensureStateDir, updateState } = await import(
      "../../dist/hooks/claude/hook-state.js"
    ) as {
      ensureStateDir: () => void;
      updateState: (
        sessionId: string,
        patch: { historyLocator: HistoryLocator },
      ) => { persisted?: boolean };
    };
    return persistHistoryLocator(locator, () => {
      ensureStateDir();
      return updateState(locator.sessionId, { historyLocator: locator });
    });
  } catch {
    return false;
  }
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
        if (specFolder) sections.push(`## Active Spec Folder\n${specFolder}`);
      }

      // The locator mirrors the historyLocator field Claude persists beside its compact cache.
      const locator = sessionId
        ? mintHistoryLocator(sessionId, ctx.cwd, new Date().toISOString())
        : null;
      if (locator && await persistLocator(locator)) {
        const lookup = buildHistoryLookupSection(locator, await loadHistoryCapability("pi"));
        if (lookup) sections.push(lookup);
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
