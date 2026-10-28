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
// skcode.ciProfile, then the profile inside the skill folder, then the default. A named
// path that points nowhere is an error, never a fall back to the next source, because a
// typo would otherwise apply the default and drop every protection silently.
//
// The profile travels with the skill into every repository that installs it, so its
// `repository` field decides whether it applies here. A file written for another
// repository is reported and ignored, never applied, because its branch names and
// protected workflows would silently replace this repository's. A declared value the
// pattern refuses is a profile fault rather than another repository, so validation names
// the field instead of the file being ignored. The former repository-root location is
// refused with its move target wherever a discovery path leads into it, because a stale
// copy there would otherwise look authoritative while nothing reads it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const {
  REPOSITORY_PATTERN,
  currentRepository,
  repositoryMatches,
} = require('../../../../skills/sk-code/shared/scripts/lib/repository-identity.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_PROFILE_FILE = '.skilled/skills/sk-code/sk-code-ci/repository/ci.json';
const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const LEGACY_PROFILE_FILE = '.sk-code/ci.json';
// A repository that installs the skills under .opencode/ instead keeps the file at the
// same path there, so the profile is found in either installation.
const PROFILE_CANDIDATES = Object.freeze([
  REPO_PROFILE_FILE,
  REPO_PROFILE_FILE.replace(/^\.skilled\//, '.opencode/'),
]);
const GIT_CONFIG_KEY = 'skcode.ciProfile';
const SCHEMA_VERSION = 1;

const TOP_KEYS = Object.freeze([
  'schemaVersion',
  'repository',
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

/**
 * Test whether a parsed profile value is a non-array object.
 *
 * @param {*} value - The parsed value.
 * @returns {boolean} Whether the value is a plain object candidate.
 */
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Read a --profile argument without changing the caller's command-specific parsing.
 *
 * @param {string[]} argv - The arguments after the program name.
 * @param {number} index - The index of the current argument.
 * @returns {{value:string, nextIndex:number}|null} The path and consumed index, or null.
 */
function parseProfileFlag(argv, index) {
  const arg = argv[index];
  if (arg !== '--profile' && !arg.startsWith('--profile=')) return null;
  const value = arg === '--profile' ? argv[index + 1] : arg.slice('--profile='.length);
  if (!value) throw new Error('--profile needs a path');
  return { value, nextIndex: arg === '--profile' ? index + 1 : index };
}

function readProfileFile(file) {
  try {
    return { raw: JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')), error: null };
  } catch (error) {
    return { raw: null, error };
  }
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

/**
 * Refuse a profile path that sits in the old repository-root folder.
 *
 * @param {string} file - Absolute profile path.
 * @param {string} root - Repository root.
 */
function refuseLegacyLocation(file, root) {
  const rel = path.relative(path.join(root, path.dirname(LEGACY_PROFILE_FILE)), file);
  if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
    throw new ProfileError('PROFILE_LEGACY_LOCATION', `${displayPath(file, root)} is no longer read: move it to ${REPO_PROFILE_FILE}`);
  }
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
 * Resolve the selected source and retain a parsed repository profile for the loader.
 *
 * @param {Object} options - cliPath, cwd, root, git and env.
 * @returns {{found:Object, read:Object|null}} The selected source and any repository read.
 */
function resolveProfile({ cliPath = null, cwd = process.cwd(), root, git = true, env = process.env }) {
  if (cliPath) {
    const file = path.resolve(cwd, cliPath);
    if (!fs.existsSync(file)) throw new ProfileError('PROFILE_PATH_MISSING', `--profile names ${file}, which does not exist`);
    refuseLegacyLocation(file, root);
    return { found: { source: 'cli', path: file }, read: null };
  }
  if (git) {
    const configured = fileScopedGitValue(root, env);
    if (configured) {
      const file = path.resolve(root, configured);
      if (!fs.existsSync(file)) throw new ProfileError('PROFILE_PATH_MISSING', `git config ${GIT_CONFIG_KEY} names ${file}, which does not exist`);
      refuseLegacyLocation(file, root);
      return { found: { source: 'git-config', path: file }, read: null };
    }
  }
  const legacy = path.join(root, LEGACY_PROFILE_FILE);
  if (fs.existsSync(legacy)) {
    throw new ProfileError('PROFILE_LEGACY_LOCATION', `${LEGACY_PROFILE_FILE} is no longer read: move it to ${REPO_PROFILE_FILE}`);
  }
  const file = PROFILE_CANDIDATES
    .map((candidate) => path.join(root, candidate))
    .find((candidate) => fs.existsSync(candidate));
  if (!file) return { found: { source: 'default', path: null }, read: null };
  const read = readProfileFile(file);
  if (read.error) return { found: { source: 'repo', path: file }, read };
  const { raw } = read;
  const declared = isPlainObject(raw) ? raw.repository : undefined;
  const namesRepository = typeof declared === 'string' && REPOSITORY_PATTERN.test(declared.trim());
  // An absent field applies everywhere. A value the pattern refuses is a profile fault
  // rather than another repository, so the file stays a profile source and validation
  // names the field.
  if (declared === undefined || !namesRepository) return { found: { source: 'repo', path: file }, read };
  const { identity } = currentRepository({ root, env });
  if (repositoryMatches(declared, identity)) return { found: { source: 'repo', path: file }, read };
  return {
    found: { source: 'default', path: null, ignored: { path: file, repository: declared, current: identity } },
    read,
  };
}

/**
 * Pick the one profile source, most explicit first.
 *
 * @param {Object} options - cliPath, cwd, root, git and env.
 * @returns {{source:string, path:string|null, ignored?:Object}} source is cli, git-config,
 * repo or default. ignored names a profile found for another repository, with its
 * repository-relative path, its declared repository and the one read here.
 */
function discoverProfile(options = {}) {
  return resolveProfile(options).found;
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
  nullableText(raw.repository, 'repository', errors, { pattern: REPOSITORY_PATTERN, hint: 'must name the repository as owner/name' });
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
/**
 * Fill optional profile fields with the generic defaults after validation.
 *
 * @param {Object|null} raw - The validated profile data, or null for the generic default.
 * @returns {Object} The normalized CI profile.
 */
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
 * @returns {{source:string, path:string|null, display:string|null, errors:Object[], profile:Object|null, ignored?:Object}}
 */
function loadProfile({ cliPath = null, cwd = process.cwd(), root, git = true, env = process.env }) {
  const resolved = resolveProfile({ cliPath, cwd, root, git, env });
  const { found } = resolved;
  const base = { source: found.source, path: found.path, display: displayPath(found.path, root), errors: [] };
  if (found.ignored) base.ignored = { ...found.ignored, path: displayPath(found.ignored.path, root) };
  if (!found.path) return { ...base, profile: normalizeProfile(null) };
  const read = resolved.read || readProfileFile(found.path);
  if (read.error) {
    const { error } = read;
    return { ...base, errors: [issue('', `${base.display} does not parse as JSON: ${error.message}`)], profile: null };
  }
  const { raw } = read;
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
  LEGACY_PROFILE_FILE,
  PROFILE_CANDIDATES,
  ProfileError,
  REPO_PROFILE_FILE,
  REPO_ROOT,
  SCHEMA_VERSION,
  declaredSwitches,
  discoverProfile,
  displayPath,
  isPlainObject,
  loadProfile,
  normalizeProfile,
  parseProfileFlag,
  validateProfile,
};
