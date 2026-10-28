// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config Schema
// ───────────────────────────────────────────────────────────────────
'use strict';

// The shape a repository config must have, and every rule that decides whether it may
// run: the keys each block accepts, the patterns an id, an extension and a ticket prefix
// must match, and the syntax table a language and a comment family come from. Every
// fault is collected rather than thrown, so one run names every field to fix.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { loadContract } = require('../../../shared/scripts/check-rule-overrides.cjs');

const { REPOSITORY_PATTERN } = require('../../../shared/scripts/lib/repository-identity.cjs');

const {
  disabledHygieneRule, pythonRejectedConstruct, readHygieneRules,
} = require('./quality-config-hygiene.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The skill root comes from this file's real path, so a repository that reaches
// the hub through a link still reads the hub's own assets.
const QUALITY_ROOT = path.resolve(path.dirname(fs.realpathSync(__filename)), '..', '..');
const SYNTAX_PATH = path.join(QUALITY_ROOT, 'assets', 'comment-syntax.json');

const SCHEMA_VERSION = 1;
const FILES_TOKEN = '{files}';

const TOP_KEYS = Object.freeze(['schemaVersion', 'repository', 'exclude', 'checks', 'checklists', 'generated', 'commentHygiene', 'sensors']);
const CHECK_KEYS = Object.freeze(['id', 'argv', 'languages', 'paths', 'cwd', 'requires', 'severity', 'required', 'timeoutSec']);
const GENERATED_KEYS = Object.freeze(['id', 'argv', 'paths', 'cwd', 'requires', 'severity', 'required', 'timeoutSec']);
const CHECKLIST_KEYS = Object.freeze(['file', 'why', 'paths', 'extensions', 'contentMarkers']);
const HYGIENE_KEYS = Object.freeze(['ticketPrefixes', 'extraPatterns', 'extensions', 'exclude', 'disableRules']);

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

const PACKAGE_MARKERS = Object.freeze(['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod']);

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

// Compare relative path segments so dot-prefixed child names remain inside the folder.
/**
 * Check whether a path is a descendant of the given parent directory.
 *
 * @param {string} child - Candidate child path.
 * @param {string} parent - Directory the candidate must be inside.
 * @returns {boolean} Whether child is strictly inside parent.
 */
function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel);
}

// A file may open with a byte-order mark, which JSON.parse refuses. Every reader of a config
// file strips it here, so discovery and validation cannot disagree about what the file says.
function parseConfigJson(text) {
  return JSON.parse(text.replace(/^\uFEFF/, ''));
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
// 4. SYNTAX TABLE
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. COMMAND AND CHECKLIST VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 6. HYGIENE AND SENSOR VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validateDisableRules(value, errors) {
  const field = 'commentHygiene.disableRules';
  stringList(value, field, errors);
  if (!Array.isArray(value)) return;
  let rules;
  let fixed;
  try {
    rules = readHygieneRules();
    ({ fixed } = loadContract());
  } catch (error) {
    errors.push(issue(field, `cannot be checked: ${error.message}`));
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || entry.trim() === '') return;
    const { error } = disabledHygieneRule(entry, rules, fixed);
    if (error) errors.push(issue(`${field}[${index}]`, error));
  });
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
  if (value.disableRules !== undefined) validateDisableRules(value.disableRules, errors);
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

// ─────────────────────────────────────────────────────────────────────────────
// 7. CONFIG VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

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
  if (raw.repository !== undefined && (typeof raw.repository !== 'string' || !REPOSITORY_PATTERN.test(raw.repository))) {
    errors.push(issue('repository', 'must name one repository as <owner>/<name>, the repository this file applies to'));
  }
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
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ConfigError,
  FILES_TOKEN,
  PACKAGE_MARKERS,
  SENSOR_KINDS,
  displayPath,
  isInside,
  isPlainObject,
  issue,
  lstatOrNull,
  parseConfigJson,
  readJsonQuiet,
  readTextQuiet,
  realOrSelf,
  statOrNull,
  validateConfig,
};
