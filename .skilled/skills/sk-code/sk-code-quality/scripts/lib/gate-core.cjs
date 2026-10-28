// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Core
// ───────────────────────────────────────────────────────────────────
'use strict';

// The runner's own vocabulary: the hub paths every other module resolves against, the check
// table it reports in a fixed order, the exit codes a verdict carries, and the small readers,
// matchers and row builders more than one concern needs. A name lives here when keeping it
// beside its first caller would make a second module import its sibling's private copy, so a
// reader can hold this file as the runner's shared floor rather than as one of its steps.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HUB PATHS
// ─────────────────────────────────────────────────────────────────────────────

// The hub comes from this file's real path, so a repository that reaches the hub
// through a link still runs the hub's own checkers. Only the declarations can move to
// another hub, through HUB_OVERRIDE_ENV, and never the commands. This module sits one
// folder below the scripts folder, so the hub is three folders up from here.
const HUB_ROOT = path.resolve(path.dirname(fs.realpathSync(__filename)), '..', '..', '..');
const QUALITY_ROOT = path.join(HUB_ROOT, 'sk-code-quality');
const HYGIENE_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-comment-hygiene.sh');
const NODE_CHECK_HELPER = path.join(QUALITY_ROOT, 'scripts', 'lib', 'parallel-node-check.cjs');
const DIST_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-dist-staleness.sh');
const COMMENT_SYNTAX_PATH = path.join(QUALITY_ROOT, 'assets', 'comment-syntax.json');
const DEFAULTS_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json');
const DEFAULTS_FILE = 'hub:sk-code/sk-code-quality/assets/quality-defaults.json';
const REPLAY_LIB_PATH = path.join(HUB_ROOT, 'sk-code-skilled', 'assets', 'scripts', 'router-replay-lib.cjs');
const HUB_OVERRIDE_ENV = 'SK_CODE_QUALITY_HUB_ROOT';
// The linter is the runner's own hub code, like the checkers, so a moved declaration hub
// never changes which grammar or floor reads an override section.
const OVERRIDE_LINTER_PATH = path.join(HUB_ROOT, 'shared', 'scripts', 'check-rule-overrides.cjs');
// The known rule ids come from the same hub, read from the documents that declare them.
const RULE_REGISTRY_PATH = path.join(HUB_ROOT, 'shared', 'scripts', 'lib', 'rule-registry.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCHEMAS AND EXIT CODES
// ─────────────────────────────────────────────────────────────────────────────

const RUN_SCHEMA = 'code-quality-run/v1';

const GATE_EXIT = Object.freeze({ NO_BLOCKER_FOUND: 0, BLOCKED: 1, NOTHING_CHECKED: 2, ERROR: 3, UNVERIFIED: 4 });
// A required check in one of these states produced no evidence, so the run cannot
// say that nothing blocks.
const UNVERIFIED_STATES = new Set(['SKIPPED_ABSENT', 'SKIPPED_BY_FLAG', 'SKIPPED_UNTRUSTED', 'TIMEOUT', 'ERROR', 'LISTED']);
const RAN_STATES = new Set(['RAN_CLEAN', 'RAN_FAIL']);
// A repository command reports through its exit code alone, so a required P0 one that
// fails blocks by itself. A generated row is a command too.
const REPOSITORY_ORIGINS = new Set(['configured', 'generated']);

// ─────────────────────────────────────────────────────────────────────────────
// 4. TRUST
// ─────────────────────────────────────────────────────────────────────────────

// A committed config may name any command, and the gate runs in whatever repository it was
// opened in, so a configured command starts only from a config an operator or the repository
// itself vouched for. The key is local, so a commit cannot carry the trust with it.
const TRUST_KEY = 'skilled.trustRepoChecks';
const TRUST_REPAIR = `git config --local ${TRUST_KEY} true`;

// ─────────────────────────────────────────────────────────────────────────────
// 5. LIMITS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_SEC = 120;

const MAX_EXCERPT_CHARS = 200;

// ─────────────────────────────────────────────────────────────────────────────
// 6. JUDGMENT AND CHECKS
// ─────────────────────────────────────────────────────────────────────────────

const JUDGMENT_REQUIRED = Object.freeze([
  'input validation',
  'no silent failures',
  'initialization safety',
  'no commented-out code',
  'accessibility',
  'design restraint ladder',
]);

// Every check the runner knows, in the order it reports them. A P0 check is required,
// except the YAML and TOML floors, which run only where python3 can import a parser.
const CHECKS = Object.freeze([
  { id: 'comment-hygiene', severity: 'P0', required: true, requires: 'python3' },
  { id: 'conflict-markers', severity: 'P0', required: true, requires: null },
  { id: 'secrets', severity: 'P0', required: true, requires: null },
  { id: 'debug-leftovers', severity: 'P1', required: false, requires: null },
  { id: 'syntax-json', severity: 'P0', required: true, requires: null },
  { id: 'syntax-cjs', severity: 'P0', required: true, requires: null },
  { id: 'syntax-node', severity: 'P0', required: true, requires: 'node' },
  { id: 'syntax-python', severity: 'P0', required: true, requires: 'python3' },
  { id: 'syntax-shell', severity: 'P0', required: true, requires: 'bash' },
  { id: 'syntax-yaml', severity: 'P0', required: false, requires: 'python3 with PyYAML' },
  { id: 'syntax-toml', severity: 'P0', required: false, requires: 'python3 with tomllib' },
  { id: 'dist-staleness', severity: 'P1', required: false, requires: 'python3' },
]);
const CHECK_IDS = new Set(CHECKS.map((check) => check.id));

// ─────────────────────────────────────────────────────────────────────────────
// 7. REPAIRS
// ─────────────────────────────────────────────────────────────────────────────

const REPAIRS = Object.freeze({
  USAGE: 'use the flags that the CLI section of runner-contract.md lists',
  NO_GIT_REPOSITORY: 'run inside a git repository, or name the files with --files',
  FILE_NOT_FOUND: 'name an existing regular file',
  FILE_OUTSIDE_ROOT: 'name files inside the repository, or inside the working directory outside git',
  BASE_NOT_FOUND: 'name a ref that shares history with HEAD',
  GIT_FAILED: 'run git status in this repository and fix what it reports',
  HUB_ROOT_INVALID: `point ${HUB_OVERRIDE_ENV} at a hub folder that holds mode-registry.json, or unset it`,
  TABLE_UNREADABLE: 'restore sk-code-quality/assets/comment-syntax.json',
  DEFAULTS_INVALID: 'restore sk-code-quality/assets/quality-defaults.json',
  CHECKLIST_MISSING: 'restore the checklist file or fix the declaration that names it',
  CHECKLIST_OUTSIDE_SKILL: 'point the row at a file inside the folder of the skill that declares it',
  CHECKLIST_ROW_INVALID: 'fix the row as the skill root metadata contract describes',
  CONFIG_PATH_MISSING: 'create the named config file, or fix the --config value or the skcode.qualityConfig git config value that names it',
  CONFIG_LEGACY_LOCATION: 'move .sk-code/quality.json to the path the message names inside the sk-code-quality skill folder, then delete the .sk-code folder',
  CONFIG_INVALID: 'fix each field that config.errors lists, as references/quality-config.md describes',
  CHECK_MUTATED_WORKSPACE: 'review the listed paths, the runner reverts nothing',
  GUARD_FAILED: 'run git status in this repository and fix what it reports',
  GUARD_UNAVAILABLE: 'run inside a git repository, because only git can show whether a configured command changed the workspace',
  INTERNAL_ERROR: 'rerun with --format json and report the message',
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class GateError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function usage(message) {
  return new GateError('USAGE', message);
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

// A path that is not there still reads through the deepest folder that is, so a link
// above a missing name cannot pass an outside path off as one the skill shipped. The
// native call returns the case a file has on disk, which is the case a filesystem that
// ignores case resolves another spelling to.
function realpathOrSelf(p) {
  let current = path.resolve(p);
  const rest = [];
  for (;;) {
    try {
      return path.join(fs.realpathSync.native(current), ...rest);
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return p;
      rest.unshift(path.basename(current));
      current = parent;
    }
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function lines(text) {
  return text.split('\n').map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
}

function excerpt(text) {
  const trimmed = text.trim();
  return trimmed.length > MAX_EXCERPT_CHARS ? `${trimmed.slice(0, MAX_EXCERPT_CHARS)}...` : trimmed;
}

const globCache = new Map();

// A glob matches a whole repository-relative path. ** crosses folders, * and ? stay
// inside one, and **/ also matches no folder at all.
function globToRegExp(glob) {
  if (globCache.has(glob)) return globCache.get(glob);
  let source = '';
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index];
    if (char === '*' && glob[index + 1] === '*') {
      index += 1;
      if (glob[index + 1] === '/') {
        index += 1;
        source += '(?:.*/)?';
      } else {
        source += '.*';
      }
    } else if (char === '*') {
      source += '[^/]*';
    } else if (char === '?') {
      source += '[^/]';
    } else {
      source += char.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  const pattern = new RegExp(`^${source}$`);
  globCache.set(glob, pattern);
  return pattern;
}

function matchesGlob(globs, rel) {
  return Array.isArray(globs) && globs.some((glob) => globToRegExp(glob).test(rel));
}

// A marker matches lower-cased text as a substring, with a word boundary on each side
// where the marker itself starts or ends with a word character, as the shared surface
// reader matches request text.
function textMarkerMatches(lowerText, marker) {
  const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const head = /^\w/.test(marker) ? '\\b' : '';
  const tail = /\w$/.test(marker) ? '\\b' : '';
  return new RegExp(`${head}${escaped}${tail}`).test(lowerText);
}

// A path marker names a folder, so it matches only where a path segment starts.
function pathMarkerMatches(lowerPath, marker) {
  return `/${lowerPath}`.includes(`/${marker.replace(/^\/+/, '')}`);
}

function fileMarkerMatches(lowerBase, marker) {
  return marker.startsWith('.') ? lowerBase.endsWith(marker) : lowerBase === marker;
}

function interpreterFromShebang(firstLine) {
  if (!firstLine.startsWith('#!')) return null;
  const words = firstLine.slice(2).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  let program = path.basename(words[0]);
  if (program === 'env') {
    const rest = words.slice(1).filter((word) => !word.startsWith('-') && !word.includes('='));
    if (rest.length === 0) return null;
    program = path.basename(rest[0]);
  }
  return program.replace(/[0-9.]+$/, '') || null;
}

// Comments and trailing commas leave the text, and line breaks stay, so a parse fault
// still names the right line.
function stripJsonComments(text) {
  let out = '';
  let inString = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inString) {
      out += char;
      if (char === '\\') {
        out += next === undefined ? '' : next;
        index += 1;
      } else if (char === '"') {
        inString = false;
      }
    } else if (char === '"') {
      inString = true;
      out += char;
    } else if (char === '/' && next === '/') {
      while (index < text.length && text[index] !== '\n') index += 1;
      out += '\n';
    } else if (char === '/' && next === '*') {
      index += 2;
      while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
        out += text[index] === '\n' ? '\n' : ' ';
        index += 1;
      }
      index += 1;
    } else {
      out += char;
    }
  }
  return dropTrailingCommas(out);
}

function dropTrailingCommas(text) {
  let out = '';
  let inString = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      out += char;
      if (char === '\\') {
        out += text[index + 1] || '';
        index += 1;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }
    if (char === '"') inString = true;
    if (char === ',') {
      const rest = text.slice(index + 1).match(/^\s*([}\]])?/);
      if (rest && rest[1]) continue;
    }
    out += char;
  }
  return out;
}

function parsesAsJsonc(text) {
  try {
    JSON.parse(stripJsonComments(text));
    return true;
  } catch {
    return false;
  }
}

function lineFromJsonError(message, text) {
  const byLine = /line (\d+)/.exec(message);
  if (byLine) return Number(byLine[1]);
  const byPosition = /position (\d+)/.exec(message);
  if (byPosition) return text.slice(0, Number(byPosition[1])).split('\n').length;
  return null;
}

// Git quotes a path with special bytes in C style, octal escapes included.
function unquoteGitPath(raw) {
  if (!raw.startsWith('"')) return raw;
  const bytes = [];
  const escapes = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, '\\': 92 };
  for (let index = 1; index < raw.length - 1; index += 1) {
    const char = raw[index];
    if (char !== '\\') {
      bytes.push(...Buffer.from(char, 'utf8'));
      continue;
    }
    const next = raw[index + 1];
    if (/[0-7]/.test(next)) {
      bytes.push(parseInt(raw.slice(index + 1, index + 4), 8));
      index += 3;
    } else {
      bytes.push(escapes[next] === undefined ? next.charCodeAt(0) : escapes[next]);
      index += 1;
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

// The new-side line numbers of each file in a -U0 diff. A +++ line counts as a header
// only between a diff --git line and its first hunk, so file content that starts with
// two plus signs is never read as a file name. Git ends that header with a tab when the
// name holds a space, so a patch tool can tell where the name stops, and the tab is no
// part of the name.
function parseDiffHunks(text) {
  const changed = new Map();
  let current = null;
  let inHeader = false;
  for (const line of text.split('\n')) {
    if (line.startsWith('diff --git ')) {
      inHeader = true;
      current = null;
    } else if (inHeader && line.startsWith('+++ ')) {
      const raw = line.slice(4);
      const target = unquoteGitPath(raw.endsWith('\t') ? raw.slice(0, -1) : raw);
      current = target === '/dev/null' ? null : target.replace(/^b\//, '');
      if (current && !changed.has(current)) changed.set(current, new Set());
    } else if (line.startsWith('@@')) {
      inHeader = false;
      const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
      if (current && hunk) {
        const start = Number(hunk[1]);
        const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
        for (let number = start; number < start + count; number += 1) changed.get(current).add(number);
      }
    }
  }
  return changed;
}

function isRegularFile(abs) {
  try {
    return fs.statSync(abs).isFile();
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CHANGE ORIGINS
// ─────────────────────────────────────────────────────────────────────────────

function hasChanges(facts) {
  return facts.changed === 'all' || facts.changed.size > 0;
}

function originFor(facts, line) {
  return facts.changed === 'all' || (line !== null && facts.changed.has(line)) ? 'changed-line' : 'touched-file';
}

// A parse fault belongs to the whole file, so it is the change's when the change
// edited the file at all.
function fileOrigin(facts) {
  return hasChanges(facts) ? 'changed-line' : 'touched-file';
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CHECK ROWS
// ─────────────────────────────────────────────────────────────────────────────

function finding(fields) {
  const blocking = fields.severity === 'P0' && fields.confidence === 'exact' && fields.origin === 'changed-line';
  return { excerpt: null, blocking, ...fields };
}

function checkEntry(id, overrides = {}) {
  const spec = CHECKS.find((check) => check.id === id);
  return {
    id,
    origin: 'builtin',
    severity: spec.severity,
    required: spec.required,
    state: 'NOT_APPLICABLE',
    argv: null,
    cwd: '.',
    exit: null,
    duration_ms: 0,
    requires: spec.requires,
    repair: null,
    code: null,
    files: 0,
    ...overrides,
  };
}

function aggregateState(results, hasFindings) {
  if (results.some((result) => result.state === 'TIMEOUT')) return 'TIMEOUT';
  if (results.some((result) => result.state === 'ERROR')) return 'ERROR';
  return hasFindings ? 'RAN_FAIL' : 'RAN_CLEAN';
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  HUB_ROOT, QUALITY_ROOT, HYGIENE_CHECKER, NODE_CHECK_HELPER, DIST_CHECKER, COMMENT_SYNTAX_PATH,
  DEFAULTS_PATH, DEFAULTS_FILE, REPLAY_LIB_PATH, HUB_OVERRIDE_ENV, OVERRIDE_LINTER_PATH, RULE_REGISTRY_PATH,
  RUN_SCHEMA, GATE_EXIT, UNVERIFIED_STATES, RAN_STATES, REPOSITORY_ORIGINS, TRUST_KEY, TRUST_REPAIR,
  DEFAULT_TIMEOUT_SEC, JUDGMENT_REQUIRED, CHECKS, CHECK_IDS, REPAIRS, GateError, usage, toPosix, realpathOrSelf, readJson, lines, excerpt,
  globToRegExp, matchesGlob, textMarkerMatches, pathMarkerMatches, fileMarkerMatches, interpreterFromShebang,
  stripJsonComments, parsesAsJsonc, lineFromJsonError, parseDiffHunks, hasChanges, originFor, fileOrigin,
  finding, checkEntry, aggregateState, isRegularFile,
};
