// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Capability Gate
// ───────────────────────────────────────────────────────────────────
// Cursor registers a preCompact hook but no forcing mechanism has been proven
// to deliver it, so there is no trustworthy moment to capture or read a Cursor
// session. The runtime stays behind one operator switch; while the switch is
// off the reader returns before touching any file.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const hookFlags = require('../hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ENABLE_FLAG = 'SYSTEM_SESSION_READERS_CURSOR_ENABLED';

// ─────────────────────────────────────────────────────────────────────────────
// 3. GATE
// ─────────────────────────────────────────────────────────────────────────────

export function cursorEnabled({ env, config } = {}) {
  return hookFlags.isFlagOn(ENABLE_FLAG, env, config);
}

export function loadCursorSession(options = {}) {
  if (!cursorEnabled(options)) {
    return { ok: false, code: 'capability_gated' };
  }
  // The switch allows a future reader, not an unproven one: until preCompact
  // delivery is confirmed there is no store path to resolve.
  return { ok: false, code: 'locator_unavailable' };
}
