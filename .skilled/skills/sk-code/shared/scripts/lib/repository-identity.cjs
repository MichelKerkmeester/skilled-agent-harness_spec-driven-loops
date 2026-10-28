// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Repository Identity
// ───────────────────────────────────────────────────────────────────
'use strict';

// A mode's config file lives inside the skill folder, so the same file travels with the
// skill into every repository that installs it. Its `repository` field names the one
// repository the file was written for, and a caller checks that field against the
// repository it is actually running in before it trusts the rest of the file.
//
// WHY THIS EXISTS: without the check, a config copied into a second repository would
// silently apply the first repository's conventions there. The identity is read from
// the environment first, because CI sets the canonical `owner/name`, and from the origin
// remote otherwise, because a local clone has no such variable. Both paths go through one
// parser, so a value from either source is compared in the same spelling, and neither a
// missing remote nor a malformed URL throws: an unknown repository is a normal answer,
// not a failure of the run.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPOSITORY_PATTERN = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;
// git accepts the scp-like `[user@]host:path`, where a remote named in an ssh config needs
// no user, so the host is whatever sits before the first colon that does not open a
// `//` URL.
const SCP_LIKE = /^(?:[^@\s/]+@)?([^:/\s]+):(?!\/\/)(.+)$/;
// A drive-letter path is a local path. Without this check the scp-like form would read it
// as a host and a path, and `C:/work/owner/name` would answer as `owner/name`.
const WINDOWS_DRIVE = /^[A-Za-z]:[\\/]/;
const GIT_TIMEOUT_MS = 5000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// The path part of a URL, for both `scheme://host/path` and the scp-like
// `[user@]host:path` form git also accepts. Returns null when neither shape fits.
function remotePath(text) {
  if (text.includes('://')) {
    try {
      return new URL(text).pathname;
    } catch {
      return null;
    }
  }
  if (WINDOWS_DRIVE.test(text)) return null;
  const match = SCP_LIKE.exec(text);
  return match ? match[2] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reduce a git remote URL to its `owner/name` identity.
 *
 * @param {string} url - An https, ssh or scp-like remote URL, with or without a user.
 * @returns {string|null} The identity, or null when the text names no repository.
 */
function normalizeRemote(url) {
  if (typeof url !== 'string') return null;
  const text = url.trim();
  if (text === '') return null;

  const pathPart = remotePath(text);
  if (pathPart === null) return null;

  const segments = pathPart.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  const owner = segments[segments.length - 2];
  const name = segments[segments.length - 1].replace(/\.git$/i, '');
  const identity = `${owner}/${name}`;
  return REPOSITORY_PATTERN.test(identity) ? identity : null;
}

/**
 * Read the repository the given working tree belongs to.
 *
 * @param {Object} [options] - root of the working tree and the environment to read.
 * @returns {{identity: string|null, source: 'env'|'origin'|null}}
 */
function currentRepository({ root = process.cwd(), env = process.env } = {}) {
  const declared = typeof env.GITHUB_REPOSITORY === 'string' ? env.GITHUB_REPOSITORY.trim() : '';
  if (REPOSITORY_PATTERN.test(declared)) return { identity: declared, source: 'env' };

  let identity = null;
  try {
    const run = spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', 'remote', 'get-url', 'origin'], {
      encoding: 'utf8',
      // The caller's environment decides which git configuration, and so which origin
      // remote, this read sees, so it has to reach the child as well.
      env,
      timeout: GIT_TIMEOUT_MS,
    });
    if (run.status === 0 && typeof run.stdout === 'string') identity = normalizeRemote(run.stdout);
  } catch {
    identity = null;
  }

  return identity === null ? { identity: null, source: null } : { identity, source: 'origin' };
}

/**
 * Whether a config file's declared repository applies to the current one.
 *
 * @param {string|null|undefined} declared - The file's `repository` field.
 * @param {string|null} current - The identity read from the working tree.
 * @returns {boolean} True for an absent field, or for the same identity in any case.
 */
function repositoryMatches(declared, current) {
  if (declared === undefined || declared === null) return true;
  if (typeof declared !== 'string' || typeof current !== 'string') return false;
  return declared.trim().toLowerCase() === current.trim().toLowerCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { REPOSITORY_PATTERN, currentRepository, normalizeRemote, repositoryMatches };
