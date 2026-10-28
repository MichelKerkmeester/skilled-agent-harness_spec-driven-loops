// ───────────────────────────────────────────────────────────────────
// MODULE: CI Repository Profile
// ───────────────────────────────────────────────────────────────────
'use strict';

// A repository states its own CI conventions in one file, and this module is the only
// reader of it, so the /doctor:ci report, toggle and scaffold see the same thing. The
// conventions are the branch names, the switch variables, the workflows that must not
// be switched off, the path twins, the workflows README and the setup action. None of
// them is universal, so with no file the generic default forces nothing: no switch is
// required, no README row is checked and no branch is assumed.
//
// Discovery follows the quality config: --profile, then the file-scoped git config value
// skcode.ciProfile, then .sk-code/ci.json at the repository root, then the default. A
// named path that points nowhere is an error, never a fall back to the next source,
// because a typo would otherwise apply the default and drop every protection silently.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_PROFILE_FILE = '.sk-code/ci.json';
const GIT_CONFIG_KEY = 'skcode.ciProfile';
const SCHEMA_VERSION = 1;

const TOP_KEYS = Object.freeze([
  'schemaVersion',
  'defaultBranch',
  'integrationBranches',
  'workflowsReadme',
  'switch',
  'neverOff',
  'protected',
  'pathTwins',
  'rebuildTrailer',
  'setupAction',
  'timeoutFloorMinutes',
]);
const SWITCH_KEYS = Object.freeze(['master', 'groups', 'required', 'exempt']);
const README_KEYS = Object.freeze(['path', 'rowTables']);
const PROTECTED_KEYS = Object.freeze(['file', 'role']);
const SETUP_KEYS = Object.freeze(['uses', 'with', 'note']);

// GitHub stores variable names in upper case and accepts letters, digits and
// underscores, with no leading digit.
const VARIABLE_NAME = /^[A-Z_][A-Z0-9_]*$/;
const WORKFLOW_FILE = /^[A-Za-z0-9._-]+\.ya?ml$/;
const BRANCH_PATTERN = /^[^\s~^:?\\[]+$/;

// The default is a value, not a file, so a repository that ships no profile reads the
// same thing on every machine.
const DEFAULT_PROFILE = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  defaultBranch: null,
  integrationBranches: [],
  workflowsReadme: null,
  switch: { master: null, groups: [], required: false, exempt: [] },
  neverOff: [],
  protected: [],
  pathTwins: [],
  rebuildTrailer: null,
  setupAction: null,
  timeoutFloorMinutes: 10,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class ProfileError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    Object.assign(this, details);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function issue(field, message) {
  return { code: 'PROFILE_INVALID', field, message: field ? `${field}: ${message}` : message };
}

function unknownKeys(value, allowed, field, errors) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) errors.push(issue(field ? `${field}.${key}` : key, 'is not a known key'));
  }
}

function textList(value, field, errors, { pattern = null, hint = '' } = {}) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(issue(field, 'must be a list of strings'));
    return;
  }
  value.forEach((entry, index) => {
    if (!isText(entry)) errors.push(issue(`${field}[${index}]`, 'must be a non-empty string'));
    else if (pattern && !pattern.test(entry)) errors.push(issue(`${field}[${index}]`, `${JSON.stringify(entry)} ${hint}`));
  });
}

function nullableText(value, field, errors, { pattern = null, hint = '' } = {}) {
  if (value === undefined || value === null) return;
  if (!isText(value)) errors.push(issue(field, 'must be a non-empty string or null'));
  else if (pattern && !pattern.test(value)) errors.push(issue(field, `${JSON.stringify(value)} ${hint}`));
}

function isRepoRelative(value) {
  return isText(value) && !path.isAbsolute(value) && !value.split(/[\\/]/).includes('..');
}

/**
 * Print a profile path the way a reader finds it: relative inside the repository,
 * absolute outside it.
 *
 * @param {string|null} file - Absolute path, or null.
 * @param {string} root - Repository root.
 * @returns {string|null} The display path.
 */
function displayPath(file, root) {
  if (!file) return null;
  const rel = path.relative(root, file);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel) ? rel.split(path.sep).join('/') : file;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

// Only a value stored in a config file counts. A git -c flag reports scope command, and
// honoring it would let one invocation swap the protections a repository committed.
function fileScopedGitValue(root, env) {
  const result = spawnSync('git', ['config', '--show-scope', '--get-all', GIT_CONFIG_KEY], { cwd: root, env, encoding: 'utf8' });
  if (result.error || result.status !== 0) return null;
  return String(result.stdout).split('\n')
    .filter((line) => line && !line.startsWith('command\t'))
    .map((line) => line.slice(line.indexOf('\t') + 1).trim())
    .filter(Boolean)
    .pop() || null;
}

/**
 * Pick the one profile source, most explicit first.
 *
 * @param {Object} options - cliPath, cwd, root, git and env.
 * @returns {{source:string, path:string|null}} source is cli, git-config, repo or default.
 */
function discoverProfile({ cliPath = null, cwd = process.cwd(), root, git = true, env = process.env }) {
  if (cliPath) {
    const file = path.resolve(cwd, cliPath);
    if (!fs.existsSync(file)) throw new ProfileError('PROFILE_PATH_MISSING', `--profile names ${file}, which does not exist`);
    return { source: 'cli', path: file };
  }
  if (git) {
    const configured = fileScopedGitValue(root, env);
    if (configured) {
      const file = path.resolve(root, configured);
      if (!fs.existsSync(file)) throw new ProfileError('PROFILE_PATH_MISSING', `git config ${GIT_CONFIG_KEY} names ${file}, which does not exist`);
      return { source: 'git-config', path: file };
    }
  }
  const file = path.join(root, REPO_PROFILE_FILE);
  return fs.existsSync(file) ? { source: 'repo', path: file } : { source: 'default', path: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validateSwitch(value, errors) {
  if (!isPlainObject(value)) {
    errors.push(issue('switch', 'must be an object'));
    return;
  }
  unknownKeys(value, SWITCH_KEYS, 'switch', errors);
  nullableText(value.master, 'switch.master', errors, { pattern: VARIABLE_NAME, hint: 'must be an upper-case variable name' });
  textList(value.groups, 'switch.groups', errors, { pattern: VARIABLE_NAME, hint: 'must be an upper-case variable name' });
  if (value.required !== undefined && typeof value.required !== 'boolean') errors.push(issue('switch.required', 'must be true or false'));
  textList(value.exempt, 'switch.exempt', errors, { pattern: WORKFLOW_FILE, hint: 'must be a workflow file name' });
}

function validateReadme(value, errors) {
  if (value === undefined || value === null) return;
  if (!isPlainObject(value)) {
    errors.push(issue('workflowsReadme', 'must be an object or null'));
    return;
  }
  unknownKeys(value, README_KEYS, 'workflowsReadme', errors);
  if (!isRepoRelative(value.path)) errors.push(issue('workflowsReadme.path', 'must be a repository-relative path with no .. segment'));
  textList(value.rowTables, 'workflowsReadme.rowTables', errors);
}

function validateProtected(value, errors) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(issue('protected', 'must be a list'));
    return;
  }
  value.forEach((entry, index) => {
    const field = `protected[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(issue(field, 'must be an object with file and role'));
      return;
    }
    unknownKeys(entry, PROTECTED_KEYS, field, errors);
    if (!isText(entry.file) || !WORKFLOW_FILE.test(entry.file)) errors.push(issue(`${field}.file`, 'must be a workflow file name'));
    if (!isText(entry.role)) errors.push(issue(`${field}.role`, 'must say in one sentence what the workflow protects'));
  });
}

function validateTwins(value, errors) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(issue('pathTwins', 'must be a list of [root, twin] pairs'));
    return;
  }
  value.forEach((pair, index) => {
    if (!Array.isArray(pair) || pair.length !== 2 || !pair.every((entry) => isRepoRelative(entry) && entry.endsWith('/'))) {
      errors.push(issue(`pathTwins[${index}]`, 'must be two repository-relative roots, each ending in /'));
    }
  });
}

function validateSetup(value, errors) {
  if (value === undefined || value === null) return;
  if (!isPlainObject(value)) {
    errors.push(issue('setupAction', 'must be an object or null'));
    return;
  }
  unknownKeys(value, SETUP_KEYS, 'setupAction', errors);
  if (!isText(value.uses)) errors.push(issue('setupAction.uses', 'must name the action, for example ./.github/actions/setup'));
  if (value.with !== undefined) {
    if (!isPlainObject(value.with)) errors.push(issue('setupAction.with', 'must map an input name to a string'));
    else for (const [key, input] of Object.entries(value.with)) {
      if (typeof input !== 'string') errors.push(issue(`setupAction.with.${key}`, 'must be a string'));
    }
  }
  nullableText(value.note, 'setupAction.note', errors);
}

/**
 * Validate a parsed profile. Every fault is collected, so one run names every field.
 *
 * @param {*} raw - The parsed JSON.
 * @returns {Array<{code:string, field:string, message:string}>} The faults, empty when valid.
 */
function validateProfile(raw) {
  if (!isPlainObject(raw)) return [issue('', 'the profile must be one JSON object')];
  const errors = [];
  unknownKeys(raw, TOP_KEYS, '', errors);
  if (raw.schemaVersion !== SCHEMA_VERSION) errors.push(issue('schemaVersion', `must be ${SCHEMA_VERSION}`));
  nullableText(raw.defaultBranch, 'defaultBranch', errors, { pattern: BRANCH_PATTERN, hint: 'is not a branch name' });
  textList(raw.integrationBranches, 'integrationBranches', errors);
  validateReadme(raw.workflowsReadme, errors);
  if (raw.switch !== undefined) validateSwitch(raw.switch, errors);
  textList(raw.neverOff, 'neverOff', errors, { pattern: VARIABLE_NAME, hint: 'must be an upper-case variable name' });
  validateProtected(raw.protected, errors);
  validateTwins(raw.pathTwins, errors);
  nullableText(raw.rebuildTrailer, 'rebuildTrailer', errors);
  validateSetup(raw.setupAction, errors);
  if (raw.timeoutFloorMinutes !== undefined
    && !(Number.isInteger(raw.timeoutFloorMinutes) && raw.timeoutFloorMinutes > 0)) {
    errors.push(issue('timeoutFloorMinutes', 'must be a whole number of minutes above zero'));
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LOADING
// ─────────────────────────────────────────────────────────────────────────────

// Every key the file leaves out takes the default, so a profile names only what
// differs. The switch block merges per key for the same reason.
function normalizeProfile(raw) {
  const own = raw || {};
  const ownSwitch = own.switch || {};
  return {
    schemaVersion: SCHEMA_VERSION,
    defaultBranch: own.defaultBranch ?? DEFAULT_PROFILE.defaultBranch,
    integrationBranches: [...(own.integrationBranches || [])],
    workflowsReadme: own.workflowsReadme
      ? { path: own.workflowsReadme.path, rowTables: [...(own.workflowsReadme.rowTables || [])] }
      : null,
    switch: {
      master: ownSwitch.master ?? null,
      groups: [...(ownSwitch.groups || [])],
      required: ownSwitch.required === true,
      exempt: [...(ownSwitch.exempt || [])],
    },
    neverOff: [...(own.neverOff || [])],
    protected: (own.protected || []).map((entry) => ({ file: entry.file, role: entry.role })),
    pathTwins: (own.pathTwins || []).map((pair) => [...pair]),
    rebuildTrailer: own.rebuildTrailer ?? null,
    setupAction: own.setupAction
      ? { uses: own.setupAction.uses, with: { ...(own.setupAction.with || {}) }, note: own.setupAction.note ?? null }
      : null,
    timeoutFloorMinutes: own.timeoutFloorMinutes ?? DEFAULT_PROFILE.timeoutFloorMinutes,
  };
}

/**
 * Discover, read, validate and normalize in one call. A named path that does not exist
 * throws a ProfileError. Parse and schema faults come back in errors, and profile is
 * null whenever errors is not empty.
 *
 * @param {Object} options - cliPath, cwd, root, git and env.
 * @returns {{source:string, path:string|null, display:string|null, errors:Object[], profile:Object|null}}
 */
function loadProfile({ cliPath = null, cwd = process.cwd(), root, git = true, env = process.env }) {
  const found = discoverProfile({ cliPath, cwd, root, git, env });
  const base = { source: found.source, path: found.path, display: displayPath(found.path, root), errors: [] };
  if (!found.path) return { ...base, profile: normalizeProfile(null) };
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(found.path, 'utf8').replace(/^﻿/, ''));
  } catch (error) {
    return { ...base, errors: [issue('', `${base.display} does not parse as JSON: ${error.message}`)], profile: null };
  }
  const errors = validateProfile(raw);
  return { ...base, errors, profile: errors.length > 0 ? null : normalizeProfile(raw) };
}

/**
 * Every switch variable the profile declares, master first, in the order written.
 *
 * @param {Object} profile - A normalized profile.
 * @returns {string[]} The declared names.
 */
function declaredSwitches(profile) {
  return [...new Set([profile.switch.master, ...profile.switch.groups].filter(Boolean))];
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_PROFILE,
  GIT_CONFIG_KEY,
  ProfileError,
  REPO_PROFILE_FILE,
  SCHEMA_VERSION,
  declaredSwitches,
  discoverProfile,
  displayPath,
  loadProfile,
  normalizeProfile,
  validateProfile,
};
