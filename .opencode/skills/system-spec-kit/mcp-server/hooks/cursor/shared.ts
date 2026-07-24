// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Hook Adapter Utilities
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_STDIN_BYTES = 1024 * 1024;
const MAX_STDIO_BYTES = 1024 * 1024;

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/**
 * Cursor lifecycle/tool events this adapter set targets. Confirmed live via a
 * temporary probe-hook dispatch against cursor-agent 2026.07.23-e383d2b:
 * sessionStart, preToolUse, and sessionEnd all fire under `cursor-agent -p`
 * (single-turn and --continue). beforeSubmitPrompt and stop do NOT fire in
 * that mode across 3 separate live dispatches — there is no confirmed CLI
 * attachment point for either today; do not add them here until re-verified
 * against a future cursor-agent build.
 */
export type CursorHookEvent = 'sessionStart' | 'preToolUse' | 'sessionEnd';

/** Bounded subset of the Cursor hook payload used by the adapters. */
export interface CursorHookInput {
  readonly session_id?: string;
  readonly conversation_id?: string;
  readonly transcript_path?: string | null;
  readonly workspace_roots?: readonly string[];
  readonly hook_event_name?: string;
  readonly tool_name?: string;
  readonly tool_input?: Record<string, unknown>;
  readonly reason?: string;
  readonly [key: string]: unknown;
}

/** Cursor's native hook response envelope (distinct from Claude/Codex's `hookSpecificOutput` shape). */
export interface CursorHookResponse {
  readonly permission: 'allow' | 'deny' | 'ask';
  readonly user_message?: string;
  readonly agent_message?: string;
}

type ClaudeHookAdapterFilename =
  | 'session-prime.js'
  | 'user-prompt-submit.js'
  | 'session-stop.js';

// ───────────────────────────────────────────────────────────────────
// 2. INPUT
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasNonEmptyString(input: CursorHookInput, field: string): boolean {
  const value = input[field];
  return typeof value === 'string' && value.trim().length > 0;
}

/** Parse and validate one bounded Cursor hook payload from stdin. */
export async function readCursorHookInput(
  event: CursorHookEvent,
  requiredFields: readonly string[],
): Promise<CursorHookInput | null> {
  try {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    for await (const chunk of process.stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_STDIN_BYTES) {
        process.stdin.destroy();
        return null;
      }
      chunks.push(buffer);
    }

    const raw = Buffer.concat(chunks, totalBytes).toString('utf8').trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;

    const input = parsed as CursorHookInput;
    if (input.hook_event_name !== undefined && input.hook_event_name !== event) {
      return null;
    }
    if (requiredFields.some((field) => !hasNonEmptyString(input, field))) {
      return null;
    }

    return input;
  } catch {
    return null;
  }
}

/**
 * Translate a bounded Cursor payload into the field shape the existing Claude
 * hook implementations already accept (they read `session_id`/`cwd`/
 * `transcript_path`/`source`, not Cursor-specific field names).
 */
export function toClaudeShape(input: CursorHookInput): Record<string, unknown> {
  return {
    session_id: input.session_id ?? input.conversation_id,
    cwd: input.workspace_roots?.[0],
    transcript_path: input.transcript_path ?? null,
    source: 'startup',
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. LIFECYCLE DELEGATION
// ───────────────────────────────────────────────────────────────────

/** Invoke the existing lifecycle owner with a normalized Cursor-derived payload. */
export function runClaudeHookAdapter(
  filename: ClaudeHookAdapterFilename,
  input: Record<string, unknown>,
  timeoutMs: number,
): string | null {
  try {
    // Delegate lifecycle behavior to the existing owner so state and transcript
    // semantics cannot drift between the two command transports.
    const adapterPath = fileURLToPath(new URL(`../claude/${filename}`, import.meta.url));
    const result = spawnSync(process.execPath, [adapterPath], {
      cwd: process.cwd(),
      input: JSON.stringify(input),
      encoding: 'utf8',
      env: process.env,
      timeout: timeoutMs,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });

    if (result.error || result.status !== 0) return null;
    return typeof result.stdout === 'string' ? result.stdout.trim() : null;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. OUTPUT
// ───────────────────────────────────────────────────────────────────

/** Emit Cursor's native hook response envelope. Always fail open on absent context. */
export function emitCursorResponse(response: CursorHookResponse | null): void {
  if (!response) {
    process.stdout.write(`${JSON.stringify({ permission: 'allow' })}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

/** Normalize an existing Claude/Codex-shaped JSON hook response into Cursor's envelope. */
export function emitNormalizedCursorResponse(rawOutput: string | null): void {
  if (!rawOutput) {
    emitCursorResponse(null);
    return;
  }

  try {
    const parsed = JSON.parse(rawOutput) as unknown;
    if (!isRecord(parsed) || !isRecord(parsed.hookSpecificOutput)) {
      emitCursorResponse(null);
      return;
    }

    const context = parsed.hookSpecificOutput.additionalContext;
    const agentMessage = typeof context === 'string' && context.trim() ? context : undefined;
    emitCursorResponse({ permission: 'allow', ...(agentMessage ? { agent_message: agentMessage } : {}) });
  } catch {
    // Invalid child output is a silent fail-open path.
    emitCursorResponse(null);
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

/** Run a hook only when its module is the active CLI entrypoint. */
export function runCursorHook(metaUrl: string, main: () => Promise<void>): void {
  const entrypoint = process.argv[1];
  if (!entrypoint || resolve(entrypoint) !== fileURLToPath(metaUrl)) return;

  void main().catch(() => emitCursorResponse(null)).finally(() => {
    process.exitCode = 0;
  });
}
