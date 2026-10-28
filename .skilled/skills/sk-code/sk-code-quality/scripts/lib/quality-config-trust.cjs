// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config Source Trust
// ───────────────────────────────────────────────────────────────────
'use strict';

// Which config a run may trust is a property of the source, not of the file's content.
// This module owns the decisions that refuse a source before it is read: the path init
// writes and the paths a run accepts, the repository a file declares, and the git config
// value, where only a value stored in a config file counts. A git -c flag or a
// GIT_CONFIG_* variable reports scope command, and honoring one would let a single
// invocation swap the commands a repository committed.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { runGit } = require('./run-check.cjs');

const {
  ConfigError, displayPath, isInside, isPlainObject, lstatOrNull, parseConfigJson,
  realOrSelf,
} = require('./quality-config-schema.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The config travels with the skill, so a repository that installs skills under .opencode/
// keeps the same path there. The root-level file is where it used to live, and a copy left
// there is refused rather than read, so a repository cannot look configured while the gate
// reads nothing.
const REPO_CONFIG_FILE = '.skilled/skills/sk-code/sk-code-quality/repository/quality.json';
const LEGACY_CONFIG_FILE = '.sk-code/quality.json';
const CONFIG_CANDIDATES = Object.freeze([REPO_CONFIG_FILE, REPO_CONFIG_FILE.replace(/^\.skilled\//, '.opencode/')]);
const GIT_CONFIG_KEY = 'skcode.qualityConfig';

// ─────────────────────────────────────────────────────────────────────────────
// 3. LOCATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The path init writes: the candidate whose skill folder this repository holds. A
 * repository that keeps skills under .opencode/ keeps the config there, and a repository
 * with neither layout gets the path this framework installs by default.
 *
 * @param {string} root - Repository root.
 * @returns {string} The repository-relative target, one of CONFIG_CANDIDATES.
 */
function repoConfigTarget(root) {
  for (const candidate of CONFIG_CANDIDATES) {
    if (lstatOrNull(path.join(root, path.dirname(path.dirname(candidate))))) return candidate;
  }
  return REPO_CONFIG_FILE;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DECLARED REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The repository a config file declares, or undefined when it declares none or does not
 * parse. A file that does not parse stays a repository source, so the JSON fault is what
 * the caller reports.
 *
 * @param {string} file - Absolute path to a config file.
 * @returns {*} The declared value, or undefined.
 */
function declaredRepository(file) {
  let raw;
  try {
    raw = parseConfigJson(fs.readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
  return isPlainObject(raw) ? raw.repository : undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GIT CONFIG VALUE
// ─────────────────────────────────────────────────────────────────────────────

// Only a value stored in a config file counts. A git -c flag or a GIT_CONFIG_*
// variable reports scope command, and honoring it would let one invocation swap the
// commands a repository committed. The last value wins, as git reads it, and its scope
// travels with it because a value stored by the operator outranks one a repository ships.
function fileScopedGitValue(root, env) {
  const result = runGit(['config', '--show-scope', '--get-all', GIT_CONFIG_KEY], { cwd: root, env });
  if (!result.ok) {
    if (result.state === 'RAN_FAIL' && result.exit === 1) return null;
    throw new ConfigError('GIT_FAILED', `git config could not read ${GIT_CONFIG_KEY}: ${(result.stderr || result.error || '').trim().split('\n')[0]}`);
  }
  return result.stdout.split('\n')
    .filter((line) => line && !line.startsWith('command\t'))
    .map((line) => {
      const tab = line.indexOf('\t');
      return { scope: line.slice(0, tab), value: line.slice(tab + 1).trim() };
    })
    .filter((entry) => entry.value)
    .pop() || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LEGACY LOCATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Refuse a path an operator named when it resolves inside the old root-level folder. The
 * old folder is refused on every path, so no repository can keep its config there by
 * naming it with --config or the git config value.
 *
 * @param {string} file - Absolute path the source named.
 * @param {string} root - Repository root.
 * @param {string} source - The source that named it, cli or git-config.
 * @param {string|null} scope - The git config scope, null for --config.
 * @returns {void}
 */
function refuseNamedLegacyPath(file, root, source, scope) {
  if (!isInside(realOrSelf(file), realOrSelf(path.join(root, path.dirname(LEGACY_CONFIG_FILE))))) return;
  throw new ConfigError('CONFIG_LEGACY_LOCATION', `${displayPath(file, root)} is no longer read: move it to ${repoConfigTarget(root)}`,
    { source, path: file, scope });
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CONFIG_CANDIDATES,
  GIT_CONFIG_KEY,
  LEGACY_CONFIG_FILE,
  REPO_CONFIG_FILE,
  declaredRepository,
  fileScopedGitValue,
  refuseNamedLegacyPath,
  repoConfigTarget,
};
