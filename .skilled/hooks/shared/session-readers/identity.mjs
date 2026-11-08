// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Identity Guard
// ───────────────────────────────────────────────────────────────────
// A caller supplies the session it wants, so a reader must never accept a
// path that resolves outside the runtime-owned store or a file whose own
// identity disagrees with the request. Every rejection is a value, never an
// exception, because the dispatcher owns the single failure envelope.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, relative, sep } from 'node:path';
import process from 'node:process';

// ─────────────────────────────────────────────────────────────────────────────
// 2. INJECTABLE ENVIRONMENT
// ─────────────────────────────────────────────────────────────────────────────

const PROCESS_HOME = homedir();

export function envOf(options = {}) {
  return options.env ?? process.env;
}

export function homeDir(options = {}) {
  return options.home ?? envOf(options).HOME ?? PROCESS_HOME;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SESSION-ID SHAPE
// ─────────────────────────────────────────────────────────────────────────────

// A session id is a single path segment and a single store key. A separator,
// a NUL, or a dot-only segment cannot name a stored session, so it is rejected
// before it becomes a path component.
export function isSafeSessionId(sessionId) {
  return typeof sessionId === 'string'
    && sessionId.length > 0
    && sessionId !== '.'
    && sessionId !== '..'
    && !sessionId.includes('/')
    && !sessionId.includes('\\')
    && !sessionId.includes('\0');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PATH COMPARISON
// ─────────────────────────────────────────────────────────────────────────────

export function samePath(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  if (!left || !right) return false;
  if (left === right) return true;
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONTAINMENT
// ─────────────────────────────────────────────────────────────────────────────

function inside(root, candidate) {
  const rel = relative(root, candidate);
  return rel !== ''
    && rel !== '..'
    && !rel.startsWith('..' + sep)
    && !isAbsolute(rel);
}

/**
 * Whether `child` is `parent` or a folder below it, compared by real path. A
 * runtime that hands its hooks the project root while recording the session's
 * own subfolder still proves the session belongs to that checkout.
 */
export function atOrBelow(child, parent) {
  if (samePath(child, parent)) return true;
  if (typeof child !== 'string' || typeof parent !== 'string' || !child || !parent) return false;
  try {
    return inside(realpathSync(parent), realpathSync(child));
  } catch {
    return false;
  }
}

// Resolve both spellings first, because a symlink inside the store can point
// at a file outside it and a textual prefix check would accept it.
export function resolveInside({ path, root }) {
  if (typeof path !== 'string' || !path.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }
  if (typeof root !== 'string' || !root.trim()) {
    return { ok: false, code: 'store_unreadable' };
  }
  if (path.split(/[\\/]+/).includes('..')) {
    return { ok: false, code: 'session_mismatch' };
  }

  let realRoot;
  let realPath;
  try {
    realRoot = realpathSync(root);
    realPath = realpathSync(path);
  } catch {
    return { ok: false, code: 'store_unreadable' };
  }

  if (!inside(realRoot, realPath)) {
    return { ok: false, code: 'session_mismatch' };
  }
  return { ok: true, path: realPath };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FULL GUARD
// ─────────────────────────────────────────────────────────────────────────────

export function guardSessionPath({ path, root, sessionId, recordedId } = {}) {
  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: 'session_mismatch' };
  }

  const contained = resolveInside({ path, root });
  if (!contained.ok) return contained;

  if (recordedId !== sessionId) {
    return { ok: false, code: 'session_mismatch' };
  }
  return contained;
}
