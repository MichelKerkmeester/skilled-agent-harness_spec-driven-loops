#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Directive Lifecycle Boundary
// ───────────────────────────────────────────────────────────────
// Host lifecycle hooks advance durable policy state independently of prompt
// payloads. Missing identity invalidates every older session record.

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isHookEnabled } from '../../../../../.opencode/hooks/shared/hook-flags.mjs';
import {
  advanceDirectiveLifecycleBoundary,
  defaultDirectiveLifecycleStore,
  type DirectiveLifecycleState,
} from '../lib/directive-lifecycle.js';

const MAX_INPUT_BYTES = 64 * 1024;
const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface DirectiveLifecycleBoundaryInput {
  readonly session_id?: string;
  readonly boundary?: string;
}

/** Apply one trusted host boundary without emitting model-visible output. */
export function handleDirectiveLifecycleBoundary(
  input: DirectiveLifecycleBoundaryInput | null,
  state: DirectiveLifecycleState = defaultDirectiveLifecycleStore(),
): boolean {
  if (!isHookEnabled('directive-lifecycle')) return false;
  return advanceDirectiveLifecycleBoundary(state, input?.session_id);
}

async function readInput(): Promise<DirectiveLifecycleBoundaryInput | null> {
  try {
    const chunks: Buffer[] = [];
    let total = 0;
    for await (const chunk of process.stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += buffer.length;
      if (total > MAX_INPUT_BYTES) return null;
      chunks.push(buffer);
    }
    const raw = Buffer.concat(chunks, total).toString('utf8').trim();
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed as DirectiveLifecycleBoundaryInput
      : null;
  } catch {
    return null;
  }
}

async function main(): Promise<boolean> {
  return handleDirectiveLifecycleBoundary(await readInput());
}

if (IS_CLI_ENTRY) {
  main()
    .then((committed) => process.exit(committed ? 0 : 1))
    .catch(() => process.exit(1));
}
