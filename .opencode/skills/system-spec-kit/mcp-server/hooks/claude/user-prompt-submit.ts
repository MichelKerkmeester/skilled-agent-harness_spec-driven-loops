#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Claude User Prompt Submit Shim
// ───────────────────────────────────────────────────────────────
// Thin process-boundary shim. The advisor implementation lives in
// system-skill-advisor; this path stays for existing runtime settings.

import { readSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const TARGET_REL = 'skills/system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js';
const MAX_STDIN_BYTES = 1024 * 1024;
const MAX_STDIO_BYTES = 1024 * 1024;
const CHILD_TIMEOUT_MS = 2500;
const READ_CHUNK_BYTES = 64 * 1024;
const MAX_ROOT_WALK_DEPTH = 14;
// Per-turn code-graph refresh runs on the hot prompt path, so it is warm-only,
// tightly bounded, and debounced across the separate per-prompt processes via a
// short filesystem cache (mirrors the OpenCode plugin's 5s transport TTL).
const CODEGRAPH_DEBOUNCE_MS = 5000;
const CODEGRAPH_PROBE_TIMEOUT_MS = 250;

// Resolve the advisor target from this module's own location by walking up to
// the ancestor that owns `.opencode`. Claude may invoke the hook from any
// working directory, so a CWD-relative path would silently miss the target and
// fail open to `{}`; an install-anchored absolute path stays correct off-root.
function resolveTarget(): string | null {
  // Test/install override: an explicit absolute target wins over the walk.
  const override = process.env.SPECKIT_USER_PROMPT_TARGET;
  if (override && existsSync(override)) {
    return override;
  }
  let current = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < MAX_ROOT_WALK_DEPTH; depth += 1) {
    const candidate = join(current, '.opencode', TARGET_REL);
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

function emitDiagnostic(code: string): void {
  process.stderr.write(`[speckit-hook:user-prompt-submit] ${code}\n`);
}

function readBoundedStdin(): Buffer {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  while (true) {
    const buffer = Buffer.alloc(Math.min(READ_CHUNK_BYTES, MAX_STDIN_BYTES + 1 - totalBytes));
    const bytesRead = readSync(0, buffer, 0, buffer.length, null);
    if (bytesRead === 0) break;
    totalBytes += bytesRead;
    if (totalBytes > MAX_STDIN_BYTES) {
      throw new Error('INPUT_OVERFLOW');
    }
    chunks.push(buffer.subarray(0, bytesRead));
  }
  return Buffer.concat(chunks, totalBytes);
}

function runShim(): string {
  const target = resolveTarget();
  if (!target) {
    emitDiagnostic('TARGET_UNRESOLVED');
    return '{}';
  }
  try {
    const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {
      cwd: process.cwd(),
      input: readBoundedStdin(),
      encoding: 'utf8',
      env: process.env,
      timeout: CHILD_TIMEOUT_MS,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });
    if (result.error) {
      const code = (result.error as NodeJS.ErrnoException).code;
      emitDiagnostic(code === 'ETIMEDOUT' ? 'CHILD_TIMEOUT' : code === 'ENOBUFS' ? 'OUTPUT_OVERFLOW' : 'SPAWN_ERROR');
      return '{}';
    }
    if (result.status !== 0) {
      emitDiagnostic('NONZERO_EXIT');
      return '{}';
    }

    const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
    if (!stdout) {
      emitDiagnostic('EMPTY_OUTPUT');
      return '{}';
    }
    try {
      JSON.parse(stdout);
      return stdout;
    } catch {
      emitDiagnostic('INVALID_JSON');
      return '{}';
    }
  } catch (error: unknown) {
    emitDiagnostic(error instanceof Error && error.message === 'INPUT_OVERFLOW'
      ? 'INPUT_OVERFLOW'
      : 'STDIN_READ_ERROR');
    return '{}';
  }
}

// Scope the debounce cache by workspace so distinct repos never read each
// other's code-graph status.
function codeGraphCachePath(): string {
  const key = createHash('sha1').update(process.cwd()).digest('hex').slice(0, 16);
  return join(tmpdir(), `mk-code-graph-prompt-status-${key}.json`);
}

async function warmCodeGraphSection(): Promise<string | null> {
  const cachePath = codeGraphCachePath();
  try {
    const cached = JSON.parse(readFileSync(cachePath, 'utf8')) as { at?: number; content?: string };
    if (typeof cached.at === 'number' && Date.now() - cached.at < CODEGRAPH_DEBOUNCE_MS) {
      return cached.content ? cached.content : null;
    }
  } catch {
    // No fresh cache; fall through to a warm probe.
  }
  let content = '';
  try {
    const { buildWarmCodeGraphStatusSection } = await import('../code-index-cli-fallback.js');
    const section = await buildWarmCodeGraphStatusSection({
      title: 'Code Index CLI Fallback',
      timeoutMs: CODEGRAPH_PROBE_TIMEOUT_MS,
      includeRetryableStatus: false,
    });
    if (section) {
      content = `## ${section.title}\n${section.content}`;
    }
  } catch {
    content = '';
  }
  try {
    writeFileSync(cachePath, JSON.stringify({ at: Date.now(), content }), 'utf8');
  } catch {
    // Best-effort cache; a write failure just means the next prompt re-probes.
  }
  return content ? content : null;
}

// Hard upper bound so a misbehaving probe can never stall the prompt hook.
function warmCodeGraphSectionBounded(): Promise<string | null> {
  return Promise.race([
    warmCodeGraphSection(),
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), CODEGRAPH_PROBE_TIMEOUT_MS + 100).unref?.();
    }),
  ]);
}

function mergeAdditionalContext(advisorJson: string, section: string): string {
  try {
    const parsed = JSON.parse(advisorJson) as Record<string, unknown>;
    const hsoRaw = parsed.hookSpecificOutput;
    const hso = (typeof hsoRaw === 'object' && hsoRaw !== null) ? hsoRaw as Record<string, unknown> : {};
    const existing = typeof hso.additionalContext === 'string' ? hso.additionalContext : '';
    parsed.hookSpecificOutput = {
      ...hso,
      hookEventName: 'UserPromptSubmit',
      additionalContext: existing ? `${existing}\n\n${section}` : section,
    };
    return JSON.stringify(parsed);
  } catch {
    // Advisor output stays authoritative; never emit something worse than it.
    return advisorJson;
  }
}

async function main(): Promise<void> {
  const advisorJson = runShim();
  const section = await warmCodeGraphSectionBounded();
  process.stdout.write(`${section ? mergeAdditionalContext(advisorJson, section) : advisorJson}\n`);
  process.exit(0);
}

void main();
