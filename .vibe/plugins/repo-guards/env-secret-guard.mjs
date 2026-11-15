#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the runtime-neutral env-secret-guard core.
// It refuses a call that would read or write a dotenv file, by path or by
// shell command, or change the guard's own code, and allows every other
// call. A core error allows and is reported on stderr, so a guard bug never
// blocks a call it could not judge.

import { createRequire } from 'node:module';
import { allow, deny, readPayload, runGuard, sessionDirFor, toCoreCall } from './lib/hook-io.mjs';

const require = createRequire(import.meta.url);
const guardCore = require('../../../.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs');

async function main() {
  const payload = await readPayload();
  if (!payload || !guardCore.isGuardEnabled()) return allow();
  // A path in the payload is relative to the session folder, and the guard
  // follows symlinks and hard links from there; the core call's own cwd stays
  // the checkout, which the git-message and preflight hooks depend on.
  const result = guardCore.evaluateToolCall({ ...toCoreCall(payload), cwd: sessionDirFor(payload.cwd) });
  return result.decision === 'deny' ? deny(result.reason) : allow();
}

await runGuard(main, 'env-secret-guard');
