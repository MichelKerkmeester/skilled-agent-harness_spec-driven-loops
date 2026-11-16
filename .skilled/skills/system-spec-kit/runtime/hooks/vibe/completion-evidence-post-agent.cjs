// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Completion Evidence Post-Agent Part
// ───────────────────────────────────────────────────────────────────
// Vibe turns a post_agent deny into a retry user message, but completion
// evidence stays advisory: this part logs the sentinel's advisory and leaves it
// in a pending file the turn-start composer injects on the next main turn. It
// never prints and never denies, and it never runs the evidence check without a
// packet the operator named.

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { mkdirSync, statSync, writeFileSync } = require('node:fs');
const { dirname, isAbsolute, join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');

const { isHookEnabled } = require('../../../../../hooks/shared/hook-flags.cjs');
const sentinel = require('../lib/completion-evidence-sentinel.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CONCERN = 'completion';
const SPEC_FOLDER_ENV = 'VIBE_SPEC_FOLDER';

// Vibe may run a session in a throwaway folder while the packet lives in the
// checkout, so the reader and the sentinel are located from this file.
const REPO_ROOT = resolve(__dirname, '../../../../../..');
const READER_PATH = join(REPO_ROOT, '.skilled/hooks/shared/session-readers/vibe.mjs');

// The turn-start composer reads and deletes this file. It is kept under the
// session's own project root, so a scratch run cannot deliver another session's
// advisory.
const PENDING_ADVISORY_RELATIVE_PATH = '.skilled/skills/.state/completion-sentinel/vibe-pending-advisory.txt';

// ───────────────────────────────────────────────────────────────────
// 3. TURN READ
// ───────────────────────────────────────────────────────────────────

async function readClaimText(payload) {
  const reader = await import(pathToFileURL(READER_PATH).href);
  const session = reader.loadVibeSession({
    transcriptPath: payload?.transcript_path,
    sessionId: payload?.session_id,
  });
  if (!session || session.ok !== true) return null;
  return reader.lastAssistantText(session);
}

// ───────────────────────────────────────────────────────────────────
// 4. PENDING ADVISORY
// ───────────────────────────────────────────────────────────────────

function pendingAdvisoryPath(projectDir) {
  return join(projectDir, PENDING_ADVISORY_RELATIVE_PATH);
}

// The pending file is written only under an absolute folder that already exists
// as a directory, so a payload cannot make this part create a directory tree
// anywhere it names; the turn-start reader would delete a file there next turn.
// This is the rule the compaction state and the repo-guards hook-io helper use;
// it is restated here because this part is CommonJS and the helper is ESM.
function existingDirectory(candidate) {
  if (typeof candidate !== 'string' || !candidate || !isAbsolute(candidate)) return false;
  try {
    return statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

function writePendingAdvisory(projectDir, detail) {
  const target = pendingAdvisoryPath(projectDir);
  mkdirSync(dirname(target), { recursive: true, mode: 0o700 });
  writeFileSync(target, `${detail}\n`, { encoding: 'utf8', mode: 0o600 });
}

// ───────────────────────────────────────────────────────────────────
// 5. PART
// ───────────────────────────────────────────────────────────────────

/**
 * Build the completion part of one post_agent payload.
 *
 * @param {Object} payload - The Vibe post_agent payload.
 * @param {Object} [dependencies] - Injectable for deterministic tests.
 * @param {Object} [dependencies.evidence] - The sentinel core.
 * @param {Function} [dependencies.readClaim] - Reads the turn's reply.
 * @param {Function} [dependencies.enabled] - The concern kill switch.
 * @param {Object} [dependencies.env] - The process environment.
 * @param {string} [dependencies.cwd] - Project root when the payload names none; the
 *   checkout by default, the folder the turn-start reader falls back to.
 * @returns {Promise<{advisory: string}|null>} The advisory that was recorded, or null.
 */
async function buildCompletionPart(payload, {
  evidence = sentinel,
  readClaim = readClaimText,
  enabled = isHookEnabled,
  env = process.env,
  cwd = REPO_ROOT,
} = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (payload.hook_event_name !== 'post_agent') return null;
  if (enabled(CONCERN, env) === false) return null;

  const specFolder = typeof env[SPEC_FOLDER_ENV] === 'string' ? env[SPEC_FOLDER_ENV].trim() : '';
  if (!specFolder) return null;

  const claimText = await readClaim(payload);
  if (typeof claimText !== 'string' || !claimText.trim()) return null;

  const result = evidence.evaluateCompletionEvidence({
    specFolder,
    claimText,
    projectDir: REPO_ROOT,
    env,
  });
  if (!result || result.decision !== 'advise' || !result.detail) return null;

  evidence.appendAdvisoryLog(REPO_ROOT, result.detail);
  const projectDir = typeof payload.cwd === 'string' && payload.cwd ? payload.cwd : cwd;
  if (existingDirectory(projectDir)) {
    try {
      writePendingAdvisory(projectDir, result.detail);
    } catch {
      // The log line still carries the advisory when the pending file cannot be written.
    }
  }
  return { advisory: result.detail };
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  PENDING_ADVISORY_RELATIVE_PATH,
  buildCompletionPart,
  pendingAdvisoryPath,
};
