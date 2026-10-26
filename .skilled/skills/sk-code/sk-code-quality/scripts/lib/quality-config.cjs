// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config
// ───────────────────────────────────────────────────────────────────
'use strict';

// A repository names its own checks in one committed file, and this module is the
// only reader of it, so the quality runner and the doctor see the same thing. It
// finds the file, validates every field before anything can spawn and merges it over
// the shipped base layer. Only the repository layer may name a command. The base
// layer and the manifest readers never supply one that runs: a command read from a
// manifest comes back as a suggestion with the entry that would enable it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { runGit } = require('./run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_ROOT = path.resolve(path.dirname(fs.realpathSync(__filename)), '..', '..');
const SYNTAX_PATH = path.join(QUALITY_ROOT, 'assets', 'comment-syntax.json');
const TEMPLATE_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-config.template.json');

const REPO_CONFIG_FILE = '.sk-code/quality.json';
const GIT_CONFIG_KEY = 'skcode.qualityConfig';
const SCHEMA_VERSION = 1;
const FILES_TOKEN = '{files}';

const TOP_KEYS = Object.freeze(['schemaVersion', 'exclude', 'checks', 'checklists', 'generated', 'commentHygiene', 'sensors']);
const CHECK_KEYS = Object.freeze(['id', 'argv', 'languages', 'paths', 'cwd', 'requires', 'severity', 'required', 'timeoutSec']);
const GENERATED_KEYS = Object.freeze(['id', 'argv', 'paths', 'cwd', 'requires', 'severity', 'required', 'timeoutSec']);
const CHECKLIST_KEYS = Object.freeze(['file', 'why', 'paths', 'extensions', 'contentMarkers']);
const HYGIENE_KEYS = Object.freeze(['ticketPrefixes', 'extraPatterns', 'extensions', 'exclude']);
// An exact sensor can be narrowed but never switched off, because its findings block.
const SENSOR_KINDS = Object.freeze({ conflictMarkers: 'exact', secrets: 'exact', debugLeftovers: 'heuristic' });
const SEVERITIES = Object.freeze(['P0', 'P1', 'P2']);
const CWD_MODES = Object.freeze(['.', 'package']);
const CHECK_ID = /^[a-z0-9][a-z0-9-]{0,62}$/;
const TICKET_PREFIX = /^[A-Za-z][A-Za-z0-9]{0,15}$/;
const EXTENSION = /^\.[A-Za-z0-9][A-Za-z0-9._-]*$/;
// A pattern runs on every comment line of every file, so its length is capped. The
// cap bounds what a reviewer must read, not the cost of a pathological pattern.
const MAX_PATTERN_CHARS = 200;
// The checker compiles a repository pattern with Python's re, which accepts none of these
// constructs. Each expression allows a run of escaped backslashes in front, so a backslash
// the author meant as text does not hide the construct after it.
const PYTHON_REJECTED_PATTERN = [
  [/(?<!\\)(?:\\\\)*\\[pP]/, 'a \\p or \\P property escape'],
];
// Python reads the other metacharacters literally inside a character class too, so a
// construct there is not a fault. \p and \P stay in the list above because Python refuses
// them inside a class as well.
const PYTHON_REJECTED_OUTSIDE_CLASS_PATTERN = [
  [/(?<!\\)(?:\\\\)*\\k</, 'a \\k<name> backreference'],
  [/(?<!\\)(?:\\\\)*\(\?<(?![=!])/, 'a (?<name> named group, which Python spells (?P<name>)'],
];
const PACKAGE_MARKERS = Object.freeze(['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod']);

// A script that rewrites files is a fixer, and a gate never runs one.
const FIXER_FLAG = /(?:^|\s)--(?:fix|write)\b/;
const SUGGESTED_SCRIPTS = Object.freeze(['typecheck', 'lint', 'format:check']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class ConfigError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    Object.assign(this, details);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function lstatOrNull(file) {
  try {
    return fs.lstatSync(file);
  } catch {
    return null;
  }
}

function statOrNull(file) {
  try {
    return fs.statSync(file);
  } catch {
    return null;
  }
}

function realOrSelf(file) {
  try {
    return fs.realpathSync(file);
  } catch {
    return file;
  }
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function readJsonQuiet(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function readTextQuiet(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Print a config path the way a reader finds it: relative inside the repository,
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

function issue(field, message) {
  return { code: 'CONFIG_INVALID', field, message: field ? `${field}: ${message}` : message };
}

function unknownKeys(value, allowed, field, errors) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) errors.push(issue(field ? `${field}.${key}` : key, 'is not a known key'));
  }
}

function stringList(value, field, errors, { required = false, nonEmpty = required, pattern = null, hint = '' } = {}) {
  if (value === undefined) {
    if (required) errors.push(issue(field, 'is required'));
    return;
  }
  if (!Array.isArray(value) || (nonEmpty && value.length === 0)) {
    errors.push(issue(field, nonEmpty ? 'must be a non-empty list of strings' : 'must be a list of strings'));
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || entry.trim() === '') errors.push(issue(`${field}[${index}]`, 'must be a non-empty string'));
    else if (pattern && !pattern.test(entry)) errors.push(issue(`${field}[${index}]`, `${JSON.stringify(entry)} ${hint}`));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVERY
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

/**
 * Pick the one repository config source, most explicit first: --config relative to
 * the working directory, the file-scoped git config value relative to the root, then
 * .sk-code/quality.json at the root. A named path that points nowhere is a broken
 * install, never a fall back to the next source.
 *
 * `value` is the git config value discovery read, verbatim, and null for every other
 * source. A trust decision needs it, because whether that value sits in the repository's
 * own .git/config is a different question from which scope git labels it with.
 *
 * @param {Object} options - cliPath, cwd, root, git and env.
 * @returns {{source:string, path:string|null, scope:string|null, value:string|null}}
 *   source is cli, git-config, repo or none, and scope is the git config scope that
 *   supplied it.
 */
function discoverConfig({ cliPath = null, cwd, root, git, env = process.env }) {
  if (cliPath) {
    const file = path.resolve(cwd, cliPath);
    if (!statOrNull(file)) {
      throw new ConfigError('CONFIG_PATH_MISSING', `--config names ${file}, which does not exist`, { source: 'cli', path: file, scope: null });
    }
    return { source: 'cli', path: file, scope: null, value: null };
  }
  if (git) {
    const configured = fileScopedGitValue(root, env);
    if (configured) {
      const file = path.resolve(root, configured.value);
      if (!statOrNull(file)) {
        throw new ConfigError('CONFIG_PATH_MISSING', `git config ${GIT_CONFIG_KEY} names ${file}, which does not exist`,
          { source: 'git-config', path: file, scope: configured.scope });
      }
      return { source: 'git-config', path: file, scope: configured.scope, value: configured.value };
    }
  }
  const file = path.join(root, REPO_CONFIG_FILE);
  if (!lstatOrNull(file)) return { source: 'none', path: null, scope: null, value: null };
  return { source: 'repo', path: file, scope: null, value: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function readSyntaxTable() {
  const table = JSON.parse(fs.readFileSync(SYNTAX_PATH, 'utf8'));
  const languages = table.languages || {};
  // A language owns its extensions, and the checker resolves an extension to that
  // language's family. The owners are collected once so a repository can be asked about
  // the extensions it wants to add.
  const extensionOwners = new Map();
  for (const [language, spec] of Object.entries(languages)) {
    for (const ext of spec.extensions || []) extensionOwners.set(ext.toLowerCase(), language);
  }
  return { families: Object.keys(table.families || {}), languages: Object.keys(languages), extensionOwners };
}

function validateCommand(entry, field, kind, errors, table) {
  if (!isPlainObject(entry)) {
    errors.push(issue(field, 'must be an object'));
    return;
  }
  unknownKeys(entry, kind === 'check' ? CHECK_KEYS : GENERATED_KEYS, field, errors);
  if (kind === 'check' || entry.id !== undefined) {
    if (typeof entry.id !== 'string' || !CHECK_ID.test(entry.id)) {
      errors.push(issue(`${field}.id`, 'must be lowercase letters, digits and hyphens, starting with a letter or digit'));
    }
  }
  if (!Array.isArray(entry.argv) || entry.argv.length === 0) {
    errors.push(issue(`${field}.argv`, 'must be a non-empty list of strings, one per argument, because no shell reads it'));
  } else {
    entry.argv.forEach((arg, index) => {
      if (typeof arg !== 'string' || arg === '') errors.push(issue(`${field}.argv[${index}]`, 'must be a non-empty string'));
      else if (arg.includes(FILES_TOKEN) && arg !== FILES_TOKEN) {
        errors.push(issue(`${field}.argv[${index}]`, `${FILES_TOKEN} must be a whole argument of its own`));
      }
    });
    if (entry.argv[0] === FILES_TOKEN) errors.push(issue(`${field}.argv[0]`, 'must name the program, not the files'));
  }
  if (kind === 'check') {
    // An empty selector would match nothing, so a check that names one must fill it.
    stringList(entry.languages, `${field}.languages`, errors, { nonEmpty: true });
    for (const [index, language] of (Array.isArray(entry.languages) ? entry.languages : []).entries()) {
      if (typeof language === 'string' && !table.languages.includes(language)) {
        errors.push(issue(`${field}.languages[${index}]`, `${JSON.stringify(language)} is not a language in comment-syntax.json (${table.languages.join(', ')})`));
      }
    }
  }
  stringList(entry.paths, `${field}.paths`, errors, { required: kind === 'generated', nonEmpty: true });
  if (entry.cwd !== undefined && !CWD_MODES.includes(entry.cwd)) errors.push(issue(`${field}.cwd`, 'must be "." or "package"'));
  if (entry.requires !== undefined && (typeof entry.requires !== 'string' || entry.requires.trim() === '')) {
    errors.push(issue(`${field}.requires`, 'must name one program'));
  }
  if (kind === 'check' && entry.severity === undefined) errors.push(issue(`${field}.severity`, 'is required, one of P0, P1 and P2'));
  else if (entry.severity !== undefined && !SEVERITIES.includes(entry.severity)) errors.push(issue(`${field}.severity`, 'must be P0, P1 or P2'));
  if (entry.required !== undefined && typeof entry.required !== 'boolean') errors.push(issue(`${field}.required`, 'must be true or false'));
  if (entry.timeoutSec !== undefined && !(typeof entry.timeoutSec === 'number' && Number.isFinite(entry.timeoutSec) && entry.timeoutSec > 0)) {
    errors.push(issue(`${field}.timeoutSec`, 'must be a number of seconds above zero'));
  }
}

function validateChecklistRow(row, field, errors) {
  if (!isPlainObject(row)) {
    errors.push(issue(field, 'must be an object'));
    return;
  }
  unknownKeys(row, CHECKLIST_KEYS, field, errors);
  if (typeof row.file !== 'string' || row.file.trim() === '') {
    errors.push(issue(`${field}.file`, 'is required'));
  } else {
    const rel = row.file.startsWith('hub:') ? row.file.slice('hub:'.length) : row.file;
    if (rel === '' || path.isAbsolute(rel) || rel.split(/[\\/]/).includes('..')) {
      errors.push(issue(`${field}.file`, 'must be repository-relative or hub:<hub>/<path>, with no .. segment'));
    }
  }
  if (row.why !== undefined && typeof row.why !== 'string') errors.push(issue(`${field}.why`, 'must be a string'));
  const kinds = ['paths', 'extensions', 'contentMarkers'].filter((key) => row[key] !== undefined);
  if (kinds.length === 0) errors.push(issue(field, 'needs paths, extensions or contentMarkers'));
  for (const key of kinds) stringList(row[key], `${field}.${key}`, errors, { required: true });
  stringList(row.extensions, `${field}.extensions`, errors, { pattern: EXTENSION, hint: 'must start with a dot' });
}

// A character class makes its contents literal in both engines, so a construct only faults
// where it sits outside one. The scan is escape aware, a "]" right after "[" or "[^" is a
// literal member and an unclosed "[" is no class at all, so the rest of the pattern is kept
// as it is.
function withoutCharacterClasses(pattern) {
  let outside = '';
  let index = 0;
  while (index < pattern.length) {
    const char = pattern[index];
    if (char === '\\') {
      outside += pattern.slice(index, index + 2);
      index += 2;
      continue;
    }
    if (char !== '[') {
      outside += char;
      index += 1;
      continue;
    }
    const open = index;
    index += 1;
    if (pattern[index] === '^') index += 1;
    if (pattern[index] === ']') index += 1;
    let closed = false;
    while (index < pattern.length) {
      if (pattern[index] === '\\') {
        index += 2;
        continue;
      }
      if (pattern[index] === ']') {
        index += 1;
        closed = true;
        break;
      }
      index += 1;
    }
    if (!closed) outside += pattern.slice(open);
  }
  return outside;
}

// A construct that only JavaScript accepts compiles above and then makes the checker
// refuse its whole argument list, so it is named here as the config fault it is.
function pythonRejectedConstruct(pattern) {
  const outsideClasses = withoutCharacterClasses(pattern);
  for (const [construct, label] of PYTHON_REJECTED_PATTERN) {
    if (construct.test(pattern)) return label;
  }
  for (const [construct, label] of PYTHON_REJECTED_OUTSIDE_CLASS_PATTERN) {
    if (construct.test(outsideClasses)) return label;
  }
  return null;
}

function validateHygiene(value, errors, table) {
  if (!isPlainObject(value)) {
    errors.push(issue('commentHygiene', 'must be an object'));
    return;
  }
  unknownKeys(value, HYGIENE_KEYS, 'commentHygiene', errors);
  stringList(value.ticketPrefixes, 'commentHygiene.ticketPrefixes', errors, {
    pattern: TICKET_PREFIX, hint: 'must start with a letter and continue with up to 15 letters or digits',
  });
  stringList(value.extraPatterns, 'commentHygiene.extraPatterns', errors);
  for (const [index, pattern] of (Array.isArray(value.extraPatterns) ? value.extraPatterns : []).entries()) {
    if (typeof pattern !== 'string') continue;
    if (pattern.length > MAX_PATTERN_CHARS) {
      errors.push(issue(`commentHygiene.extraPatterns[${index}]`, `is ${pattern.length} characters, over the ${MAX_PATTERN_CHARS}-character limit`));
      continue;
    }
    try {
      new RegExp(pattern);
    } catch (error) {
      errors.push(issue(`commentHygiene.extraPatterns[${index}]`, `does not compile: ${error.message}`));
      continue;
    }
    const construct = pythonRejectedConstruct(pattern);
    if (construct) {
      errors.push(issue(`commentHygiene.extraPatterns[${index}]`, `uses ${construct}, but the checker compiles patterns with Python re, which does not accept it`));
    }
  }
  if (value.extensions !== undefined) {
    if (!isPlainObject(value.extensions)) {
      errors.push(issue('commentHygiene.extensions', 'must map an extension to a comment family'));
    } else {
      for (const [ext, family] of Object.entries(value.extensions)) {
        if (!EXTENSION.test(ext)) errors.push(issue(`commentHygiene.extensions.${ext}`, 'must be an extension that starts with a dot'));
        if (table.extensionOwners.has(ext.toLowerCase())) {
          errors.push(issue(`commentHygiene.extensions.${ext}`, `${ext} is already owned by the shipped table as ${table.extensionOwners.get(ext.toLowerCase())}, and a repository can only add extensions`));
        }
        if (!table.families.includes(family)) {
          errors.push(issue(`commentHygiene.extensions.${ext}`, `${JSON.stringify(family)} is not a comment family (${table.families.join(', ')})`));
        }
      }
    }
  }
  stringList(value.exclude, 'commentHygiene.exclude', errors);
}

function validateSensors(value, errors) {
  if (!isPlainObject(value)) {
    errors.push(issue('sensors', 'must be an object'));
    return;
  }
  for (const [name, settings] of Object.entries(value)) {
    const field = `sensors.${name}`;
    if (!SENSOR_KINDS[name]) {
      errors.push(issue(field, `is not a sensor (${Object.keys(SENSOR_KINDS).join(', ')})`));
      continue;
    }
    if (!isPlainObject(settings)) {
      errors.push(issue(field, 'must be an object'));
      continue;
    }
    if (SENSOR_KINDS[name] === 'exact') {
      for (const key of Object.keys(settings)) {
        if (key === 'exclude') continue;
        errors.push(issue(`${field}.${key}`, key === 'enabled' && settings.enabled === false
          ? 'an exact sensor cannot be switched off, because its findings block. Narrow it with exclude'
          : 'an exact sensor accepts exclude only'));
      }
    } else {
      unknownKeys(settings, ['enabled', 'exclude'], field, errors);
      if (settings.enabled !== undefined && typeof settings.enabled !== 'boolean') errors.push(issue(`${field}.enabled`, 'must be true or false'));
    }
    stringList(settings.exclude, `${field}.exclude`, errors);
  }
}

/**
 * Validate a parsed repository config against the schema. Every fault is collected,
 * so one run names every field to fix.
 *
 * @param {*} raw - The parsed JSON.
 * @param {Object} [options] - builtinIds, the check ids the runner owns.
 * @returns {Array<{code:string, field:string, message:string}>} The faults, empty when valid.
 */
function validateConfig(raw, { builtinIds = [] } = {}) {
  const errors = [];
  if (!isPlainObject(raw)) return [issue('', 'the config must be one JSON object')];
  const table = readSyntaxTable();
  unknownKeys(raw, TOP_KEYS, '', errors);
  if (raw.schemaVersion !== SCHEMA_VERSION) errors.push(issue('schemaVersion', `must be ${SCHEMA_VERSION}`));
  stringList(raw.exclude, 'exclude', errors);
  const ids = new Map();
  const claim = (id, field) => {
    if (typeof id !== 'string') return;
    if (builtinIds.includes(id)) errors.push(issue(`${field}.id`, `${id} is a built-in check id`));
    else if (ids.has(id)) errors.push(issue(`${field}.id`, `${id} is already used by ${ids.get(id)}`));
    else ids.set(id, field);
  };
  for (const [key, kind] of [['checks', 'check'], ['generated', 'generated']]) {
    if (raw[key] === undefined) continue;
    if (!Array.isArray(raw[key])) {
      errors.push(issue(key, 'must be a list'));
      continue;
    }
    raw[key].forEach((entry, index) => {
      validateCommand(entry, `${key}[${index}]`, kind, errors, table);
      if (isPlainObject(entry)) claim(entry.id === undefined && kind === 'generated' ? `generated-${index + 1}` : entry.id, `${key}[${index}]`);
    });
  }
  if (raw.checklists !== undefined) {
    if (!Array.isArray(raw.checklists)) errors.push(issue('checklists', 'must be a list'));
    else raw.checklists.forEach((row, index) => validateChecklistRow(row, `checklists[${index}]`, errors));
  }
  if (raw.commentHygiene !== undefined) validateHygiene(raw.commentHygiene, errors, table);
  if (raw.sensors !== undefined) validateSensors(raw.sensors, errors);
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LOADING AND MERGE
// ─────────────────────────────────────────────────────────────────────────────

function normalizeCommand(entry, index, kind) {
  const severity = entry.severity || 'P1';
  return {
    id: entry.id || `generated-${index + 1}`,
    kind,
    argv: [...entry.argv],
    languages: kind === 'check' && Array.isArray(entry.languages) ? [...entry.languages] : null,
    paths: Array.isArray(entry.paths) ? [...entry.paths] : null,
    cwd: entry.cwd || '.',
    requires: entry.requires || entry.argv[0],
    severity,
    required: typeof entry.required === 'boolean' ? entry.required : severity === 'P0',
    timeoutSec: entry.timeoutSec || null,
  };
}

/**
 * Merge the repository layer over the base layer. Only the repository layer declares
 * checks. Lists append, sensors merge per sensor, and nothing the base layer holds can
 * be removed.
 *
 * @param {Object} defaults - The parsed quality-defaults.json.
 * @param {Object|null} repo - The validated repository config, or null.
 * @returns {Object} exclude, sensors, checklists, generated, checks and commentHygiene.
 */
function mergeConfig(defaults, repo) {
  const layer = repo || {};
  const hygiene = layer.commentHygiene || {};
  const sensors = {};
  for (const name of Object.keys(SENSOR_KINDS)) {
    const base = (defaults.sensors && defaults.sensors[name]) || {};
    const own = (layer.sensors && layer.sensors[name]) || {};
    sensors[name] = { ...base, ...own, exclude: [...(base.exclude || []), ...(own.exclude || [])] };
    if (SENSOR_KINDS[name] === 'exact') delete sensors[name].enabled;
  }
  return {
    exclude: [...(defaults.exclude || []), ...(layer.exclude || [])],
    sensors,
    checklists: [
      ...(defaults.checklists || []).map((row) => ({ ...row, layer: 'defaults' })),
      ...(layer.checklists || []).map((row) => ({ ...row, layer: 'repo' })),
    ],
    generated: [
      ...(defaults.generated || []).map((row) => ({ ...row, layer: 'defaults' })),
      ...(layer.generated || []).map((row, index) => ({ ...normalizeCommand(row, index, 'generated'), layer: 'repo' })),
    ],
    checks: (layer.checks || []).map((entry, index) => normalizeCommand(entry, index, 'check')),
    commentHygiene: {
      ticketPrefixes: [...(hygiene.ticketPrefixes || [])],
      extraPatterns: [...(hygiene.extraPatterns || [])],
      // The checker compares extensions in lower case, so the runner reads them the same way.
      extensions: Object.fromEntries(Object.entries(hygiene.extensions || {}).map(([ext, family]) => [ext.toLowerCase(), family])),
      exclude: [...(hygiene.exclude || [])],
    },
  };
}

/**
 * Discover, read, validate and merge in one call, the way the runner and the doctor
 * both need it. Discovery faults throw. Parse and schema faults come back in errors,
 * and merged is null whenever errors is not empty.
 *
 * @param {Object} options - cliPath, cwd, root, git, env, defaults and builtinIds.
 * @returns {{source:string, path:string|null, scope:string|null, display:string|null, bytes:number|null, raw:*, errors:Object[], merged:Object|null}}
 */
function loadConfig({ cliPath = null, cwd, root, git, env = process.env, defaults, builtinIds = [] }) {
  const found = discoverConfig({ cliPath, cwd, root, git, env });
  const base = { source: found.source, scope: found.scope, path: found.path, value: found.value, display: displayPath(found.path, root), bytes: null, raw: null, errors: [] };
  if (!found.path) return { ...base, merged: mergeConfig(defaults, null) };
  // The committed file is the one source no operator named, so it must be this
  // repository's own content. A link that leads out of the repository is refused.
  if (found.source === 'repo' && !isInside(realOrSelf(found.path), realOrSelf(root))) {
    return { ...base, errors: [issue('', `${REPO_CONFIG_FILE} resolves to ${realOrSelf(found.path)}, outside the repository`)], merged: null };
  }
  const stat = statOrNull(found.path);
  if (!stat || !stat.isFile()) {
    return { ...base, errors: [issue('', `${base.display} is not a regular file`)], merged: null };
  }
  let text;
  try {
    text = fs.readFileSync(found.path, 'utf8');
  } catch (error) {
    return { ...base, errors: [issue('', `cannot read ${base.display}: ${error.message}`)], merged: null };
  }
  const bytes = Buffer.byteLength(text);
  let raw;
  try {
    raw = JSON.parse(text.replace(/^﻿/, ''));
  } catch (error) {
    return { ...base, bytes, errors: [issue('', `does not parse as JSON: ${error.message}`)], merged: null };
  }
  const errors = validateConfig(raw, { builtinIds });
  return { ...base, bytes, raw, errors, merged: errors.length > 0 ? null : mergeConfig(defaults, raw) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SUGGESTIONS AND THE TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

function suggestion(source, reason, entry) {
  return { id: entry.id, source, reason, entry };
}

/**
 * Read the manifests at the repository root and return the checks they imply. Nothing
 * here runs: each suggestion carries the config entry that would enable it, and a
 * script that runs tests or rewrites files is never suggested.
 *
 * @param {string} root - Repository root.
 * @returns {Array<{id:string, source:string, reason:string, entry:Object}>} The suggestions.
 */
function readSuggestions(root) {
  const out = [];
  const pkg = readJsonQuiet(path.join(root, 'package.json'));
  if (pkg && isPlainObject(pkg.scripts)) {
    for (const name of SUGGESTED_SCRIPTS) {
      const body = pkg.scripts[name];
      if (typeof body !== 'string' || FIXER_FLAG.test(body)) continue;
      out.push(suggestion('package.json', `package.json defines a ${name} script`, {
        id: name.replace(/[^a-z0-9-]/g, '-'), argv: ['npm', 'run', name], languages: ['javascript', 'typescript'],
        requires: 'npm', severity: 'P1', required: false,
      }));
    }
  }
  const pyproject = readTextQuiet(path.join(root, 'pyproject.toml'));
  if (pyproject !== null) {
    if (/^\s*\[tool\.ruff[\].]/m.test(pyproject)) {
      out.push(suggestion('pyproject.toml', 'pyproject.toml configures ruff', {
        id: 'ruff', argv: ['ruff', 'check', FILES_TOKEN], languages: ['python'], requires: 'ruff', severity: 'P1', required: false,
      }));
    }
    if (/^\s*\[tool\.mypy[\].]/m.test(pyproject)) {
      out.push(suggestion('pyproject.toml', 'pyproject.toml configures mypy', {
        id: 'mypy', argv: ['mypy', FILES_TOKEN], languages: ['python'], requires: 'mypy', severity: 'P1', required: false,
      }));
    }
  }
  if (fs.existsSync(path.join(root, 'Cargo.toml'))) {
    for (const verb of ['check', 'clippy']) {
      out.push(suggestion('Cargo.toml', 'Cargo.toml defines a Rust package', {
        id: `cargo-${verb}`, argv: ['cargo', verb], languages: ['rust'], cwd: 'package', requires: 'cargo', severity: 'P1', required: false,
      }));
    }
  }
  if (fs.existsSync(path.join(root, 'go.mod'))) {
    out.push(suggestion('go.mod', 'go.mod defines a Go module', {
      id: 'go-vet', argv: ['go', 'vet', './...'], languages: ['go'], cwd: 'package', requires: 'go', severity: 'P1', required: false,
    }));
  }
  let workflows = [];
  try {
    workflows = fs.readdirSync(path.join(root, '.github', 'workflows')).filter((name) => /\.ya?ml$/i.test(name));
  } catch {
    workflows = [];
  }
  if (workflows.length > 0) {
    out.push(suggestion('.github/workflows', 'the repository has GitHub Actions workflows', {
      id: 'actionlint', argv: ['actionlint', FILES_TOKEN], paths: ['.github/workflows/**'], requires: 'actionlint', severity: 'P1', required: false,
    }));
  }
  for (const name of ['GNUmakefile', 'makefile', 'Makefile']) {
    const text = readTextQuiet(path.join(root, name));
    if (text !== null && /^lint\s*:(?!=)/m.test(text)) {
      out.push(suggestion(name, `${name} defines a lint target`, {
        id: 'make-lint', argv: ['make', 'lint'], paths: ['**'], requires: 'make', severity: 'P1', required: false,
      }));
      break;
    }
  }
  return out;
}

/**
 * The config init writes: the shipped template with every suggestion entered as a
 * check that is not required, so an absent tool warns instead of blocking.
 *
 * @param {string} root - Repository root.
 * @returns {{config:Object, suggestions:Object[]}} The config to write and what filled it.
 */
function initialConfig(root) {
  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  const suggestions = readSuggestions(root);
  return { config: { ...template, checks: suggestions.map((item) => ({ ...item.entry, required: false })) }, suggestions };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ConfigError,
  FILES_TOKEN,
  GIT_CONFIG_KEY,
  PACKAGE_MARKERS,
  REPO_CONFIG_FILE,
  TEMPLATE_PATH,
  discoverConfig,
  displayPath,
  initialConfig,
  loadConfig,
  mergeConfig,
  readSuggestions,
  validateConfig,
};
