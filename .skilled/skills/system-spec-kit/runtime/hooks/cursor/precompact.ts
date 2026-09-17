#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor PreCompact Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: registered, delivery unconfirmed and untestable in isolation -- no known CLI compaction trigger.
//
// REGISTERED, DELIVERY UNCONFIRMED -- AND UNTESTABLE IN ISOLATION. Research
// found no forcing mechanism for `preCompact` reachable from a single
// `cursor-agent -p` dispatch: neither cli-reference.md/cursor-tools.md nor a
// live `cursor-agent --help` expose any compaction/context-limit/token-budget
// flag, and hook-contract.md §7 documents every event in its §4 enumeration
// (preCompact included) as "documented-but-unconfirmed-under-the-CLI" absent
// a live-verifying dispatch. Registered anyway per this repo's own
// spec-gate-classify.mjs precedent (build the thin proxy, wire it, document
// status honestly) rather than skipped -- there is a defensible target to
// proxy to even though its trigger condition cannot be manufactured inside a
// short probe session. Re-verify against a future cursor-agent build (a long
// real session that actually compacts) before treating this as confirmed.
//
// compact-inject.js only caches merged context for the NEXT SessionStart to
// inject -- per its own header comment, "stdout is NOT injected on
// PreCompact". This adapter therefore relays no agent_message; it always
// emits a plain allow envelope after the (fire-and-forget-bounded) cache
// write attempt.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {
  emitCursorResponse,
  readCursorHookInput,
  runClaudeHookAdapter,
  runCursorHook,
  toClaudeShape,
} from './shared.js';
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';

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
  const input = await readCursorHookInput('preCompact', ['session_id']);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'compact' });
    return emitCursorResponse(null);
  }

  runClaudeHookAdapter('compact-inject.js', toClaudeShape(input), 3_000);
  emitCursorResponse({ permission: 'allow' });
}

runCursorHook(import.meta.url, main);
