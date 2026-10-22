// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Hook Utilities
// ───────────────────────────────────────────────────────────────────
// Copilot imports these helpers straight from ../shared-provenance.js, so
// drift in any one runtime silently forks the recovered-payload contract.

import { closeSync, openSync, readdirSync, readSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS & TYPES
// ───────────────────────────────────────────────────────────────────

/** Timeout for hook scripts — must stay under 2s hard cap */
export const HOOK_TIMEOUT_MS = 1800;
/** Token budget for compaction context injection */
export const COMPACTION_TOKEN_BUDGET = 4000;
/** Token budget for session priming (startup/resume) */
export const SESSION_PRIME_TOKEN_BUDGET = 2000;
const MAX_HOOK_STDIN_BYTES = 1024 * 1024;
/** How recent a fork's compaction boundary must be to belong to this SessionStart */
const FORK_COMPACTION_WINDOW_MS = 5_000;
/** A transcript untouched for longer cannot hold a boundary inside that window */
const FORK_TRANSCRIPT_MTIME_WINDOW_MS = 10_000;
const FORK_TRANSCRIPT_TAIL_BYTES = 64 * 1024;

/** Parsed JSON from Claude Code hook stdin */
export interface HookInput {
  readonly session_id?: string;
  readonly transcript_path?: string;
  readonly trigger?: 'auto' | 'manual';
  readonly source?: 'startup' | 'resume' | 'clear' | 'compact';
  readonly custom_instructions?: string;
  readonly stop_hook_active?: boolean;
  readonly last_assistant_message?: string;
  readonly [key: string]: unknown;
}

/** A titled section for hook stdout output */
export interface OutputSection {
  readonly title: string;
  readonly content: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. HOOK I/O HELPERS
// ───────────────────────────────────────────────────────────────────

/** Require a non-empty session_id for any hook that touches shared temp-state. */
export function getRequiredSessionId(sessionId: unknown, surface: string): string {
  const normalized = typeof sessionId === 'string' ? sessionId.trim() : '';
  if (normalized.length === 0) {
    throw new Error(`${surface} hook payload missing required session_id`);
  }
  return normalized;
}

/**
 * Read and parse JSON from stdin. Returns null on failure. Entries whose host
 * allows them only a short time pass a shorter stdin deadline.
 */
export async function parseHookStdin(timeoutMs = HOOK_STDIN_TIMEOUT_MS): Promise<HookInput | null> {
  try {
    const text = await readHookStdin({ timeoutMs, maxBytes: MAX_HOOK_STDIN_BYTES });
    if (text === null) {
      hookLog('warn', 'stdin', `Hook stdin exceeded ${MAX_HOOK_STDIN_BYTES} bytes`);
      return null;
    }
    const raw = text.trim();
    if (!raw) return null;
    return JSON.parse(raw) as HookInput;
  } catch (err: unknown) {
    hookLog('warn', 'stdin', `Failed to parse hook stdin: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/** Format sections into readable text block for stdout injection */
export function formatHookOutput(sections: OutputSection[]): string {
  return sections
    .filter(s => s.content.trim().length > 0)
    .map(s => `## ${s.title}\n${s.content}`)
    .join('\n\n');
}

/** Wrap a promise with a timeout. Returns fallback value on timeout. */
export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      hookLog('warn', 'timeout', `Operation timed out after ${ms}ms`);
      resolve(fallback);
    }, ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/** Log to stderr (stdout is reserved for hook output injection) */
export function hookLog(level: 'info' | 'warn' | 'error', tag: string, msg: string): void {
  const prefix = `[speckit-hook:${tag}]`;
  const line = `${prefix} ${msg}`;
  if (level === 'error') {
    process.stderr.write(`ERROR ${line}\n`);
  } else if (level === 'warn') {
    process.stderr.write(`WARN ${line}\n`);
  } else {
    process.stderr.write(`INFO ${line}\n`);
  }
}

/** Estimate token count (rough: 1 token ≈ 4 chars) and truncate if over budget */
export function truncateToTokenBudget(text: string, maxTokens: number): string {
  const estimatedTokens = Math.ceil(text.length / 4);
  if (estimatedTokens <= maxTokens) return text;
  const maxChars = maxTokens * 4;
  const boundary = text.lastIndexOf('\n\n## ', maxChars);
  const cutAt = boundary > 0 ? boundary : maxChars;
  return text.slice(0, cutAt).trimEnd() + '\n[...truncated to fit token budget]';
}

// ───────────────────────────────────────────────────────────────────
// 3. PROVENANCE RE-EXPORTS & BUDGET
// ───────────────────────────────────────────────────────────────────

// Provenance helpers (escapeProvenanceField, sanitizeRecoveredPayload,
// wrapRecoveredCompactPayload) live in ../shared-provenance.ts so they
// can be consumed by Claude and Copilot runtimes without
// transitive coupling to this Claude-specific module.
export {
  escapeProvenanceField,
  sanitizeRecoveredPayload,
  wrapRecoveredCompactPayload,
  type RecoveredCompactMetadata,
} from '../shared-provenance.js';

/** Calculate pressure-adjusted budget based on context window usage */
export function calculatePressureAdjustedBudget(
  currentTokens: number | undefined,
  maxTokens: number | undefined,
  baseBudget: number,
): number {
  if (!currentTokens || !maxTokens || maxTokens <= 0) return baseBudget;
  const ratio = currentTokens / maxTokens;
  if (ratio > 0.9) return Math.max(200, Math.floor(baseBudget * 0.2));
  if (ratio > 0.7) return Math.floor(baseBudget * (1 - ratio) * 2);
  return baseBudget;
}

// ───────────────────────────────────────────────────────────────────
// 4. TRANSCRIPT INSPECTION
// ───────────────────────────────────────────────────────────────────

/**
 * True when a forked sub-agent compacted moments ago. A fork carries its parent's session
 * id and files its transcript under the parent's directory, so a compaction boundary there
 * belongs to the fork, not to the parent whose SessionStart is running.
 */
export function forkCompactedRecently(
  transcriptPath: string,
  sessionId: string,
  nowMs: number = Date.now(),
): boolean {
  const subagentDir = join(dirname(transcriptPath), sessionId, 'subagents');
  let entries: string[];
  try {
    entries = readdirSync(subagentDir);
  } catch {
    return false;
  }

  for (const entry of entries) {
    if (!/^agent-.*\.jsonl$/.test(entry)) continue;
    const filePath = join(subagentDir, entry);
    try {
      const stat = statSync(filePath);
      if (!stat.isFile()) continue;
      // The boundary timestamp decides; the mtime check only keeps stale
      // transcripts from being read at all.
      if (Math.abs(nowMs - stat.mtimeMs) > FORK_TRANSCRIPT_MTIME_WINDOW_MS) continue;
      const boundaryMs = lastCompactBoundaryMs(filePath, stat.size);
      if (boundaryMs === null) continue;
      const ageMs = nowMs - boundaryMs;
      if (ageMs >= 0 && ageMs <= FORK_COMPACTION_WINDOW_MS) return true;
    } catch {
      continue;
    }
  }

  return false;
}

/** Newest compact_boundary timestamp in the transcript tail, or null when there is none. */
function lastCompactBoundaryMs(filePath: string, size: number): number | null {
  const length = Math.min(size, FORK_TRANSCRIPT_TAIL_BYTES);
  const buffer = Buffer.alloc(length);
  const descriptor = openSync(filePath, 'r');
  let read = 0;
  try {
    read = readSync(descriptor, buffer, 0, length, size - length);
  } finally {
    closeSync(descriptor);
  }

  const lines = buffer.subarray(0, read).toString('utf8').split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!lines[index].includes('"compact_boundary"')) continue;
    const record = JSON.parse(lines[index]) as { timestamp?: unknown };
    const timestampMs = typeof record.timestamp === 'string' ? Date.parse(record.timestamp) : Number.NaN;
    return Number.isFinite(timestampMs) ? timestampMs : null;
  }
  return null;
}
