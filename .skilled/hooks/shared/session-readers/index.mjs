// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Dispatcher
// ───────────────────────────────────────────────────────────────────
// One read-only entry point per runtime. A caller names a runtime and an exact
// session id; the dispatcher checks the id shape, then delegates. It does not
// consult `capabilities`: the callers that offer or redeem history check a
// runtime's status there before they read. It owns the one failure envelope,
// so a reader may fail but never throw across this boundary, and a projection
// defect can never return a partial list.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { loadClaudeSession } from './claude.mjs';
import { loadCodexSession } from './codex.mjs';
import { loadCursorSession } from './cursor.mjs';
import { loadDevinSession } from './devin.mjs';
import { loadDshSession } from './dsh.mjs';
import { loadOpenCodeSession } from './opencode.mjs';
import { loadPiSession } from './pi.mjs';
import { projectEntries } from './project.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CAPABILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const capabilities = Object.freeze({
  claude: Object.freeze({
    status: 'ready',
    locatorKind: 'transcript_path',
    storeRoot: '~/.claude/projects',
  }),
  codex: Object.freeze({
    status: 'ready',
    locatorKind: 'transcript_path',
    storeRoot: '$CODEX_HOME/sessions',
  }),
  pi: Object.freeze({
    status: 'ready',
    locatorKind: 'live_branch_or_session_log',
    storeRoot: '~/.pi/agent/sessions',
  }),
  opencode: Object.freeze({
    status: 'ready',
    locatorKind: 'session-store',
    storeRoot: '$XDG_DATA_HOME/opencode/opencode.db',
  }),
  devin: Object.freeze({
    status: 'ready',
    locatorKind: 'transcript_file',
    storeRoot: '$XDG_DATA_HOME/devin/cli/sessions.db',
  }),
  dsh: Object.freeze({
    status: 'ready',
    locatorKind: 'session_log',
    storeRoot: '$DSH_HOME/sessions',
  }),
  cursor: Object.freeze({
    status: 'gated',
    locatorKind: 'capability_flag',
    storeRoot: '(unconfirmed)',
    reason: 'PreCompact delivery is unconfirmed, so there is no trustworthy capture point',
  }),
});

const READERS = Object.freeze({
  claude: loadClaudeSession,
  codex: loadCodexSession,
  pi: loadPiSession,
  opencode: loadOpenCodeSession,
  devin: loadDevinSession,
  dsh: loadDshSession,
  cursor: loadCursorSession,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. ENVELOPE
// ─────────────────────────────────────────────────────────────────────────────

function failure(code) {
  return { ok: false, code };
}

function hasSessionId(sessionId) {
  return typeof sessionId === 'string' && sessionId.trim().length > 0;
}

function normalize(options) {
  return options && typeof options === 'object' ? options : {};
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISPATCH
// ─────────────────────────────────────────────────────────────────────────────

async function load(options) {
  const { runtime, sessionId } = options;
  if (!hasSessionId(sessionId)) return failure('locator_unavailable');

  const reader = READERS[runtime];
  if (!reader) return failure('capability_gated');

  return reader(options);
}

/**
 * Resolve one exact session and return the shared entry list.
 * @param {{ runtime: string, sessionId: string }} options - Runtime and exact id,
 *   plus the runtime-specific locator fields its reader accepts.
 * @returns {Promise<{ ok: true, source: object, items: Array<object> }
 *   | { ok: false, code: string }>}
 */
export async function readSession(input) {
  const options = normalize(input);
  try {
    const loaded = await load(options);
    if (!loaded.ok) return loaded;

    const projected = projectEntries(loaded.records);
    if (!projected.ok) return failure('store_unreadable');

    return { ok: true, source: loaded.source, items: projected.items };
  } catch {
    return failure('store_unreadable');
  }
}

/**
 * Resolve one exact session and return its raw neutral records.
 * This is the only raw path; `readSession` is the projected one.
 */
export async function loadSession(input) {
  const options = normalize(input);
  try {
    const loaded = await load(options);
    if (!loaded.ok) return loaded;
    return {
      ok: true,
      source: loaded.source,
      records: loaded.records,
      ...(Array.isArray(loaded.injected) ? { injected: loaded.injected } : {}),
    };
  } catch {
    return failure('store_unreadable');
  }
}
