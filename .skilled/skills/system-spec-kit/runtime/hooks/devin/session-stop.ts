#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Stop Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
} from './shared.js';

const require = createRequire(import.meta.url);

function sessionLifecycleHookEnabled(): boolean {
  try {
    const { isHookEnabled } = require(fileURLToPath(new URL('../../../../../../../.opencode/hooks/shared/hook-flags.cjs', import.meta.url)));
    return typeof isHookEnabled !== 'function' || isHookEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

async function main(): Promise<void> {
  if (!sessionLifecycleHookEnabled()) return;
  const input = await readDevinHookInput('Stop', ['session_id']);
  if (!input) return;

  runClaudeHookAdapter('session-stop.js', input, 10_000);
}

runDevinHook(import.meta.url, main);
