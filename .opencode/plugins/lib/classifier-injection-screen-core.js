// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Injection Screen Core
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const SCREEN_TOOL = 'webfetch';
export const MAX_PENDING_ADVISORIES = 20;
export const MAX_SESSIONS = 1_000;
export const UNKNOWN_SESSION = '__unknown-session__';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the session identifier across the supported hook input shapes.
 *
 * @param {object | undefined} input - Hook input that may contain a session identifier.
 * @returns {string} The session identifier or the shared unknown-session key.
 */
export function sessionIdOf(input) {
  const value = input?.sessionID ?? input?.sessionId ?? input?.session?.id ?? input?.properties?.sessionID;
  return typeof value === 'string' && value ? value : UNKNOWN_SESSION;
}
