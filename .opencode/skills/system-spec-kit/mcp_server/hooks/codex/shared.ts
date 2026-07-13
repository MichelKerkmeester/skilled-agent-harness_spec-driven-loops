// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Hook Adapter Utilities
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_STDIN_BYTES = 1024 * 1024;
const MAX_STDIO_BYTES = 1024 * 1024;

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Codex lifecycle events registered by the project hook bridge. */
export type CodexHookEvent = 'SessionStart' | 'UserPromptSubmit' | 'Stop' | 'PreCompact';

/** Bounded subset of the Codex hook payload used by the adapters. */
export interface CodexHookInput {
  readonly session_id?: string;
  readonly transcript_path?: string | null;
  readonly cwd?: string;
  readonly hook_event_name?: string;
  readonly prompt?: string;
  readonly source?: string;
  readonly [key: string]: unknown;
}

type ClaudeHookAdapterFilename =
  | 'session-prime.js'
  | 'user-prompt-submit.js'
  | 'session-stop.js'
  | 'compact-inject.js';

// ───────────────────────────────────────────────────────────────────
// 2. INPUT
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasNonEmptyString(input: CodexHookInput, field: string): boolean {
  const value = input[field];
  return typeof value === 'string' && value.trim().length > 0;
}

/** Parse and validate one bounded Codex hook payload from stdin. */
export async function readCodexHookInput(
  event: CodexHookEvent,
  requiredFields: readonly string[],
): Promise<CodexHookInput | null> {
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

    const input = parsed as CodexHookInput;
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

// ───────────────────────────────────────────────────────────────────
// 3. LIFECYCLE DELEGATION
// ───────────────────────────────────────────────────────────────────

/** Invoke the existing lifecycle owner with a normalized Codex payload. */
export function runClaudeHookAdapter(
  filename: ClaudeHookAdapterFilename,
  input: CodexHookInput,
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

/** Emit model-visible context using Codex's native hook response envelope. */
export function emitCodexContext(event: CodexHookEvent, context: string | null): void {
  if (!context) return;

  process.stdout.write(`${JSON.stringify({
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: context,
    },
  })}\n`);
}

/** Normalize an existing JSON hook response into the Codex event envelope. */
export function emitNormalizedCodexContext(event: CodexHookEvent, rawOutput: string | null): void {
  if (!rawOutput) return;

  try {
    const parsed = JSON.parse(rawOutput) as unknown;
    if (!isRecord(parsed) || !isRecord(parsed.hookSpecificOutput)) return;

    const context = parsed.hookSpecificOutput.additionalContext;
    emitCodexContext(event, typeof context === 'string' && context.trim() ? context : null);
  } catch {
    // Invalid child output is a silent fail-open path.
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

/** Run a hook only when its module is the active CLI entrypoint. */
export function runCodexHook(metaUrl: string, main: () => Promise<void>): void {
  const entrypoint = process.argv[1];
  if (!entrypoint || resolve(entrypoint) !== fileURLToPath(metaUrl)) return;

  void main().catch(() => undefined).finally(() => {
    process.exitCode = 0;
  });
}
