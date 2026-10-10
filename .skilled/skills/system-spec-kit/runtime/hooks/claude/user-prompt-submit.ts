#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude User Prompt Submit Shim
// ───────────────────────────────────────────────────────────────────
// Thin process-boundary shim. The advisor implementation lives in
// system-skill-advisor; this path stays for existing runtime settings.

import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const TARGET_REL = 'skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js';
const MAX_STDIN_BYTES = 1024 * 1024;
const MAX_STDIO_BYTES = 1024 * 1024;
const CHILD_TIMEOUT_MS = 2500;
// Reserve fallback time after advisor CLI; 300 ms covers measured startup overhead with headroom.
const CHILD_START_MARGIN_MS = 300;
// The host kills this hook after 3 seconds and the advisor child needs most of
// that, so a host that never closes stdin must not hold the read for long. The
// value matches SHORT_HOST_STDIN_TIMEOUT_MS in ../shared-stdin.ts, which this
// file cannot import because its tests run the source directly.
const STDIN_DEADLINE_MS = 500;
const MAX_ROOT_WALK_DEPTH = 14;

// ───────────────────────────────────────────────────────────────────
// 2. TARGET RESOLUTION & SHIM DISPATCH
// ───────────────────────────────────────────────────────────────────

// Resolve the advisor target from this module's own location by walking up to
// the nearest ancestor that owns one of the adapter roots (`.skilled` first,
// then the legacy `.opencode` mirror). Claude may invoke the hook from any
// working directory, so a CWD-relative path would silently miss the target and
// fail open to `{}`; an install-anchored absolute path stays correct off-root.

// An override names one executable module. It must be absolute, so a relative
// path cannot be resolved against whatever cwd Claude happened to spawn the hook
// with, and it must be a regular file, so a directory or a dangling link falls
// back to the install-anchored walk instead of being handed to node.
function isRegularFileOverride(candidate: string): boolean {
  if (!isAbsolute(candidate)) return false;
  try {
    return statSync(candidate).isFile();
  } catch {
    return false;
  }
}

function resolveTarget(): string | null {
  // Test/install override: an explicit absolute target wins over the walk.
  const override = process.env.SPECKIT_USER_PROMPT_TARGET;
  if (override && isRegularFileOverride(override)) {
    return override;
  }
  let current = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < MAX_ROOT_WALK_DEPTH; depth += 1) {
    // Both root names must resolve identically: a checkout whose legacy mirror
    // was dropped must not silently lose the advisor target, so the probe never
    // assumes which root name owns it.
    for (const rootName of ['.skilled', '.opencode']) {
      const candidate = join(current, rootName, TARGET_REL);
      if (existsSync(candidate)) {
        return candidate;
      }
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

// Collect stdin until it ends or the deadline passes, then release it so the
// process can exit. More than MAX_STDIN_BYTES rejects with INPUT_OVERFLOW and
// destroys stdin, so a runaway payload is never buffered whole.
function readBoundedStdin(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;

    const release = (): void => {
      clearTimeout(timer);
      stdin.removeListener('data', onData);
      stdin.removeListener('end', onEnd);
      stdin.removeListener('error', onError);
      stdin.pause();
    };

    function onEnd(): void {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks, totalBytes));
    }

    function onError(error: Error): void {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    }

    function onData(chunk: Buffer | string): void {
      if (settled) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_STDIN_BYTES) {
        settled = true;
        release();
        stdin.destroy();
        reject(new Error('INPUT_OVERFLOW'));
        return;
      }
      chunks.push(buffer);
    }

    // Listeners go on before the timer, so a stdin that cannot take listeners
    // rejects at once and leaves no timer behind.
    stdin.on('data', onData);
    stdin.on('end', onEnd);
    stdin.on('error', onError);
    const timer = setTimeout(onEnd, STDIN_DEADLINE_MS);
  });
}

async function runShim(): Promise<string> {
  const target = resolveTarget();
  if (!target) {
    emitDiagnostic('TARGET_UNRESOLVED');
    return '{}';
  }
  try {
    const childEnv = { ...process.env };
    // The advisor must finish before this shim kills it, or its fallback output is lost.
    const childBudgetCeilingMs = CHILD_TIMEOUT_MS - CHILD_START_MARGIN_MS;
    const operatorBudgetMs = Number.parseInt(process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS ?? '', 10);
    childEnv.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS = String(
      Number.isFinite(operatorBudgetMs) && operatorBudgetMs > 0
        ? Math.min(operatorBudgetMs, childBudgetCeilingMs)
        : childBudgetCeilingMs,
    );
    const input = await readBoundedStdin();
    const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {
      cwd: process.cwd(),
      input,
      encoding: 'utf8',
      env: childEnv,
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

// ───────────────────────────────────────────────────────────────────
// 3. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const advisorJson = await runShim();
  process.stdout.write(`${advisorJson}\n`);
  process.exit(0);
}

void main();
