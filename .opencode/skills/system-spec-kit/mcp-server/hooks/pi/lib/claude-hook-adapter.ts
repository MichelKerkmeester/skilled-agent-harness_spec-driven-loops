// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension Library - Claude Hook Adapter
// ───────────────────────────────────────────────────────────────────
//
// Pi-specific adapter utilities, one tier per runtime the same way
// `system-spec-kit/mcp-server/hooks/devin/shared.ts` and
// `.../hooks/cursor/shared.ts` are devin-specific and cursor-specific
// respectively (both are the real spawnSync proxies -- `.devin/hooks/`
// and `.cursor/hooks/` themselves hold only symlinks straight into the
// dist tree, not a shared.ts of their own). This is not a shared
// runtime-neutral guard core: it proxies into the Claude lifecycle-hook
// dist files under `system-spec-kit/mcp-server/dist/hooks/claude/`, the
// same lifecycle owner devin and cursor already proxy into via
// `spawnSync`, so session-prime/session-stop/user-prompt-submit state
// and transcript semantics never drift across the four runtimes.

import { spawnSync } from "node:child_process";
import { join } from "node:path";

const MAX_STDIO_BYTES = 1024 * 1024;

type ClaudeHookAdapterFilename = "session-prime.js" | "user-prompt-submit.js" | "session-stop.js";

/** Bounded payload shape accepted by the Claude lifecycle-hook dist files. */
export interface ClaudeHookPayload {
  readonly session_id?: string;
  readonly cwd?: string;
  readonly hook_event_name?: string;
  readonly prompt?: string;
  readonly [key: string]: unknown;
}

/** Spawn a Claude lifecycle-hook dist file with a synthesized payload on stdin. Returns raw stdout, or null on any failure. */
export function runClaudeHookAdapter(
  projectDir: string,
  filename: ClaudeHookAdapterFilename,
  payload: ClaudeHookPayload,
  timeoutMs: number,
): string | null {
  try {
    const adapterPath = join(
      projectDir,
      ".opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude",
      filename,
    );
    const result = spawnSync(process.execPath, [adapterPath], {
      cwd: projectDir,
      input: JSON.stringify(payload),
      encoding: "utf8",
      env: process.env,
      timeout: timeoutMs,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: "SIGKILL",
    });
    if (result.error || result.status !== 0) return null;
    return typeof result.stdout === "string" ? result.stdout.trim() : null;
  } catch {
    return null;
  }
}

/** Extract `hookSpecificOutput.additionalContext` from a Claude hook's raw stdout. */
export function extractAdditionalContext(rawOutput: string | null): string | null {
  if (!rawOutput) return null;
  try {
    const parsed = JSON.parse(rawOutput) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    const hookSpecificOutput = (parsed as Record<string, unknown>).hookSpecificOutput;
    if (typeof hookSpecificOutput !== "object" || hookSpecificOutput === null) return null;
    const context = (hookSpecificOutput as Record<string, unknown>).additionalContext;
    return typeof context === "string" && context.trim() ? context.trim() : null;
  } catch {
    return null;
  }
}
