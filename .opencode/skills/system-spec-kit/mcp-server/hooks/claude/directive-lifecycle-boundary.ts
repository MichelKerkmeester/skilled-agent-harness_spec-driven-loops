#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Boundary Bridge
// ───────────────────────────────────────────────────────────────
// Runtime lifecycle owners notify the advisor store through one bounded,
// fail-open process boundary.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isHookEnabled } from '../../../../../../.opencode/hooks/shared/hook-flags.mjs';

const TARGET_REL = 'skills/system-skill-advisor/mcp-server/dist/hooks/claude/directive-lifecycle-boundary.js';
const MAX_ROOT_WALK_DEPTH = 14;
const CHILD_TIMEOUT_MS = 500;
const MAX_STDIO_BYTES = 64 * 1024;
const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface HostDirectiveLifecycleBoundary {
  readonly sessionId?: string | null;
  readonly boundary: 'startup' | 'resume' | 'compact' | 'clear' | 'post-compact';
}

function resolveTarget(): string | null {
  const override = process.env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET;
  if (override && existsSync(override)) return override;

  let current = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < MAX_ROOT_WALK_DEPTH; depth += 1) {
    const candidate = join(current, '.opencode', TARGET_REL);
    if (existsSync(candidate)) return candidate;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

/** Notify the canonical store; lifecycle delivery remains fail-open on errors. */
export function notifyDirectiveLifecycleBoundary(input: HostDirectiveLifecycleBoundary): boolean {
  if (!isHookEnabled('directive-lifecycle')) return false;
  const target = resolveTarget();
  if (!target) return false;
  try {
    const result = spawnSync(process.execPath, [target], {
      cwd: process.cwd(),
      input: JSON.stringify({ session_id: input.sessionId, boundary: input.boundary }),
      encoding: 'utf8',
      env: process.env,
      timeout: CHILD_TIMEOUT_MS,
      maxBuffer: MAX_STDIO_BYTES,
      killSignal: 'SIGKILL',
    });
    return !result.error && result.status === 0;
  } catch {
    return false;
  }
}

async function readInput(): Promise<HostDirectiveLifecycleBoundary | null> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as HostDirectiveLifecycleBoundary;
    return parsed && typeof parsed.boundary === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

if (IS_CLI_ENTRY) {
  readInput()
    .then((input) => process.exit(input && notifyDirectiveLifecycleBoundary(input) ? 0 : 1))
    .catch(() => process.exit(1));
}
