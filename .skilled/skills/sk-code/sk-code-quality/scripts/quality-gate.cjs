#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner
// ───────────────────────────────────────────────────────────────────
'use strict';

// One verdict for one change, in any repository. The runner reads the change, runs its
// built-in sensors, one comment-hygiene call and a parse floor, probes which hooks and
// workflows enforce hygiene, resolves the checklists the hub declares and prints the
// result. It writes no file and starts no command a repository names. No gate value
// means pass: exit 0 says only that no blocker was found and every required check
// produced evidence, and the acting agent still owns every judgment item.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { findTool, runGit, spawnArgv, withGuard } = require('./lib/run-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The hub comes from this file's real path, so a repository that reaches the hub
// through a link still runs the hub's own checkers. Only the declarations can move to
// another hub, through HUB_OVERRIDE_ENV, and never the commands.
const HUB_ROOT = path.resolve(path.dirname(fs.realpathSync(__filename)), '..', '..');
const QUALITY_ROOT = path.join(HUB_ROOT, 'sk-code-quality');
const HYGIENE_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-comment-hygiene.sh');
const DIST_CHECKER = path.join(QUALITY_ROOT, 'scripts', 'check-dist-staleness.sh');
const COMMENT_SYNTAX_PATH = path.join(QUALITY_ROOT, 'assets', 'comment-syntax.json');
const DEFAULTS_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json');
const DEFAULTS_FILE = 'hub:sk-code/sk-code-quality/assets/quality-defaults.json';
const REPLAY_LIB_PATH = path.join(HUB_ROOT, 'sk-code-skilled', 'assets', 'scripts', 'router-replay-lib.cjs');
const HUB_OVERRIDE_ENV = 'SK_CODE_QUALITY_HUB_ROOT';

const RUN_SCHEMA = 'code-quality-run/v1';
const ENVELOPE_SCHEMA = 'code-quality/v1';
const EXPLAIN_SCHEMA = 'code-quality-explain/v1';
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
const PENDING = 'PENDING_AGENT_JUDGMENT';

const GATE_EXIT = Object.freeze({ NO_BLOCKER_FOUND: 0, BLOCKED: 1, NOTHING_CHECKED: 2, ERROR: 3, UNVERIFIED: 4 });
// A required check in one of these states produced no evidence, so the run cannot
// say that nothing blocks.
const UNVERIFIED_STATES = new Set(['SKIPPED_ABSENT', 'SKIPPED_BY_FLAG', 'TIMEOUT', 'ERROR', 'LISTED']);
const RAN_STATES = new Set(['RAN_CLEAN', 'RAN_FAIL']);
const FORMATS = Object.freeze(['json', 'text', 'envelope']);
const DEFAULT_TIMEOUT_SEC = 120;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const BINARY_SNIFF_BYTES = 8192;
const MAX_EXCERPT_CHARS = 200;

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

// Signatures that are exact enough to block. A secret finding carries the rule and the
// line only, so the matched text never reaches any output.
const SECRET_RULES = Object.freeze([
  { rule: 'secret.private-key', pattern: /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/, reason: 'private key header' },
  { rule: 'secret.aws-access-key', pattern: /\bAKIA[0-9A-Z]{16}\b/, reason: 'AWS access key id' },
  { rule: 'secret.github-token', pattern: /\bghp_[A-Za-z0-9]{36}\b/, reason: 'GitHub personal access token' },
  { rule: 'secret.github-pat', pattern: /\bgithub_pat_[A-Za-z0-9_]{22,}\b/, reason: 'GitHub fine-grained token' },
  { rule: 'secret.slack-token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, reason: 'Slack token' },
]);
const CONFLICT_START = /^<{7}(?: |$)/;
const CONFLICT_END = /^>{7}(?: |$)/;
const DEBUG_RULES = Object.freeze([
  { rule: 'debug.debugger', pattern: /^\s*debugger\s*;?\s*$/, reason: 'a debugger statement left in' },
  { rule: 'debug.breakpoint', pattern: /^\s*breakpoint\(\s*\)/, reason: 'a Python breakpoint call left in' },
  { rule: 'debug.pdb', pattern: /\bpdb\.set_trace\(\s*\)/, reason: 'a pdb trace call left in' },
  { rule: 'debug.pry', pattern: /\bbinding\.pry\b/, reason: 'a Ruby pry breakpoint left in' },
]);

// TypeScript, VS Code, dev containers and ESLint read these JSON files with comments
// and trailing commas, so a strict parse would report a fault that no tool sees.
const JSONC_BASENAME = /^(?:(?:ts|js)config(?:\.[^/]*)?|\.?devcontainer|\.eslintrc)\.json$/i;
const JSONC_FOLDER = /(?:^|\/)\.vscode\/[^/]+\.json$/i;
// A parser quotes a window of text near its fault, and that window can hold part of a
// key, so a field that shares this many characters with a key in its file is withheld.
const SECRET_WINDOW = 8;
const SHELL_PARSERS = new Set(['bash', 'sh']);
const CJS_PARAMETERS = Object.freeze(['exports', 'require', 'module', '__filename', '__dirname']);
const HYGIENE_REFERENCE = /check-comment-hygiene\.sh\b/;
const POST_EDIT_CONFIGS = Object.freeze(['.claude/settings.json', '.codex/hooks.json', '.cursor/hooks.json', '.devin/hooks.v1.json']);
const POST_EDIT_PATH = /[A-Za-z0-9_./-]*post-edit-quality[A-Za-z0-9_./-]*\.(?:cjs|mjs|js|sh)\b/g;
const DIST_STALE = 'STALE DIST WARNING:';
const DIST_ERROR = 'DIST FRESHNESS CHECK ERROR:';

// One python3 process parses every Python, YAML and TOML file in scope. ast.parse
// compiles nothing to disk, and compose_all reads YAML structure without building
// objects, so an unknown tag is never a parse fault. The user site is added back
// because isolated mode drops it, and that is where a user-installed PyYAML lives.
const PARSE_SCRIPT = [
  'import ast, json, re, site, sys',
  'try:',
  '    site.addsitedir(site.getusersitepackages())',
  'except Exception:',
  '    pass',
  'try:',
  '    import yaml',
  'except Exception:',
  '    yaml = None',
  'try:',
  '    import tomllib',
  'except Exception:',
  '    tomllib = None',
  'results = []',
  'for item in json.load(sys.stdin):',
  '    path, kind = item["path"], item["kind"]',
  '    entry = {"path": path, "kind": kind, "ok": True}',
  '    try:',
  '        with open(path, "rb") as handle:',
  '            data = handle.read()',
  '        if kind == "python":',
  '            ast.parse(data, filename=path)',
  '        elif kind == "yaml" and yaml is None:',
  '            entry = {"path": path, "kind": kind, "unavailable": True}',
  '        elif kind == "yaml":',
  '            for _ in yaml.compose_all(data.decode("utf-8-sig"), Loader=yaml.SafeLoader):',
  '                pass',
  '        elif kind == "toml" and tomllib is None:',
  '            entry = {"path": path, "kind": kind, "unavailable": True}',
  '        elif kind == "toml":',
  '            tomllib.loads(data.decode("utf-8-sig"))',
  '    except SyntaxError as error:',
  '        entry = {"path": path, "kind": kind, "ok": False, "line": error.lineno, "message": error.msg}',
  '    except OSError as error:',
  '        entry = {"path": path, "kind": kind, "error": str(error)}',
  '    except Exception as error:',
  '        text = str(error) or type(error).__name__',
  '        mark = getattr(error, "problem_mark", None)',
  '        found = re.search(r"line (\\d+)", text)',
  '        line = mark.line + 1 if mark is not None else (int(found.group(1)) if found else None)',
  '        entry = {"path": path, "kind": kind, "ok": False, "line": line, "message": text.splitlines()[0]}',
  '    results.append(entry)',
  'json.dump(results, sys.stdout)',
].join('\n');

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
  CHECK_MUTATED_WORKSPACE: 'review the listed paths, the runner reverts nothing',
  GUARD_FAILED: 'run git status in this repository and fix what it reports',
  INTERNAL_ERROR: 'rerun with --format json and report the message',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
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

function realpathOrSelf(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return p;
  }
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
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
// 4. CLI ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseCheckIds(flag, value) {
  const ids = value.split(',').map((id) => id.trim()).filter(Boolean);
  const unknown = ids.filter((id) => !CHECK_IDS.has(id));
  if (ids.length === 0 || unknown.length > 0) {
    throw usage(`${flag} needs check ids from: ${[...CHECK_IDS].join(', ')}${unknown.length ? ` (unknown: ${unknown.join(', ')})` : ''}`);
  }
  return new Set(ids);
}

function parseArgs(argv) {
  const options = {
    scope: null, base: null, files: [], lines: 'changed', noRun: false, only: null,
    skip: new Set(), timeoutSec: DEFAULT_TIMEOUT_SEC, format: 'json', explain: null,
  };
  const setScope = (scope) => {
    if (options.scope && options.scope !== scope) throw usage('choose one of --worktree, --base, --files and --explain');
    options.scope = scope;
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined || next.startsWith('--')) throw usage(`${arg} needs a value`);
      index += 1;
      return next;
    };
    if (arg === '--worktree') {
      setScope('worktree');
    } else if (arg === '--base') {
      setScope('base');
      options.base = value();
    } else if (arg === '--files') {
      setScope('files');
      while (index + 1 < argv.length && !argv[index + 1].startsWith('--')) options.files.push(argv[(index += 1)]);
    } else if (arg === '--') {
      setScope('files');
      options.files.push(...argv.slice(index + 1));
      index = argv.length;
    } else if (arg === '--lines') {
      options.lines = value();
      if (!['changed', 'file'].includes(options.lines)) throw usage('--lines takes changed or file');
    } else if (arg === '--no-run') {
      options.noRun = true;
    } else if (arg === '--only') {
      options.only = parseCheckIds(arg, value());
    } else if (arg === '--skip') {
      options.skip = parseCheckIds(arg, value());
    } else if (arg === '--config') {
      throw usage('--config is not accepted: this runner reads no repository config and runs built-in checks only');
    } else if (arg === '--timeout') {
      options.timeoutSec = Number(value());
      if (!Number.isFinite(options.timeoutSec) || options.timeoutSec <= 0) throw usage('--timeout takes a number of seconds above zero');
    } else if (arg === '--format') {
      options.format = value();
      if (!FORMATS.includes(options.format)) throw usage(`--format takes one of ${FORMATS.join(', ')}`);
    } else if (arg === '--explain') {
      setScope('explain');
      options.explain = value();
    } else {
      throw usage(`unknown argument ${arg}`);
    }
  }
  options.scope = options.scope || 'worktree';
  if (options.scope === 'files' && options.files.length === 0) throw usage('--files needs at least one file');
  if (options.scope === 'explain' && options.format !== 'json') throw usage('--explain prints JSON, so it takes no other --format');
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROOTS, DECLARATIONS AND SCOPE
// ─────────────────────────────────────────────────────────────────────────────

function loadCommentSyntax() {
  try {
    const table = readJson(COMMENT_SYNTAX_PATH);
    const byExtension = {};
    const byInterpreter = {};
    for (const [language, spec] of Object.entries(table.languages)) {
      for (const ext of spec.extensions || []) byExtension[ext.toLowerCase()] = language;
      for (const name of spec.shebangs || []) byInterpreter[name] = language;
    }
    return { languages: table.languages, byExtension, byInterpreter };
  } catch (error) {
    throw new GateError('TABLE_UNREADABLE', `cannot read ${COMMENT_SYNTAX_PATH}: ${error.message}`);
  }
}

function loadDefaults() {
  try {
    const defaults = readJson(DEFAULTS_PATH);
    if (defaults.schemaVersion !== 1 || !Array.isArray(defaults.checklists) || !defaults.sensors) {
      throw new Error('schemaVersion 1, checklists and sensors are required');
    }
    return defaults;
  } catch (error) {
    throw new GateError('DEFAULTS_INVALID', `cannot read ${DEFAULTS_PATH}: ${error.message}`);
  }
}

function resolveDeclarationHub(env) {
  const override = env[HUB_OVERRIDE_ENV];
  const hub = override ? path.resolve(override) : HUB_ROOT;
  if (!fs.existsSync(path.join(hub, 'mode-registry.json'))) {
    throw new GateError('HUB_ROOT_INVALID', `${hub} holds no mode-registry.json`);
  }
  return realpathOrSelf(hub);
}

function buildContext(options, cwd, env) {
  const table = loadCommentSyntax();
  const defaults = loadDefaults();
  const declHub = resolveDeclarationHub(env);
  const realCwd = realpathOrSelf(path.resolve(cwd));
  const top = runGit(['rev-parse', '--show-toplevel'], { cwd: realCwd, env });
  const git = top.ok;
  if (!git && !['files', 'explain'].includes(options.scope)) {
    throw new GateError('NO_GIT_REPOSITORY', top.missing ? 'git is not on PATH' : `${realCwd} is not inside a git repository`);
  }
  const root = git ? top.stdout.trim() : realCwd;
  return {
    options, env, table, defaults, declHub, git, root, cwd: realCwd,
    rootReal: realpathOrSelf(root),
    skilledDir: realpathOrSelf(path.resolve(declHub, '..', '..')),
    // spawnSync reads a deadline of 0 as none, so a tiny value rounds up to 1 ms.
    timeoutMs: Math.max(1, Math.round(options.timeoutSec * 1000)),
    python: findTool('python3', env),
    bash: findTool('bash', env),
  };
}

function gitOrThrow(context, args) {
  const result = runGit(args, { cwd: context.root, env: context.env });
  if (!result.ok) throw new GateError('GIT_FAILED', `git ${args[0]} failed: ${(result.stderr || result.error || '').trim().split('\n')[0]}`);
  return result.stdout;
}

function headOrEmptyTree(context) {
  const head = runGit(['rev-parse', '--verify', '-q', 'HEAD^{commit}'], { cwd: context.root, env: context.env });
  return head.ok ? head.stdout.trim() : EMPTY_TREE;
}

function diffHunks(context, base, paths) {
  if (paths && paths.length === 0) return new Map();
  const args = ['diff', '-U0', '-M', '--diff-filter=ACMR', '--no-color', '--no-ext-diff', '--no-textconv',
    '--src-prefix=a/', '--dst-prefix=b/', base];
  return parseDiffHunks(gitOrThrow(context, paths ? [...args, '--', ...paths] : args));
}

function nulList(text) {
  return text.split('\0').filter(Boolean);
}

// Git refuses a path below a symlinked folder, and such a file is not this
// repository's tracked content anyway, so it is read as new.
function belowSymlink(root, rel) {
  const parts = rel.split('/');
  let current = root;
  for (const part of parts.slice(0, -1)) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) return true;
    } catch {
      return false;
    }
  }
  return false;
}

function namedFiles(context, names) {
  const seen = new Map();
  for (const name of names) {
    const abs = path.resolve(context.cwd, name);
    let stat = null;
    try {
      stat = fs.statSync(abs);
    } catch {
      stat = null;
    }
    if (!stat || !stat.isFile()) throw new GateError('FILE_NOT_FOUND', `${name} is not an existing regular file`);
    const rel = toPosix(path.relative(context.root, abs));
    if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new GateError('FILE_OUTSIDE_ROOT', `${name} lies outside ${context.root}`);
    }
    seen.set(rel, abs);
  }
  return [...seen.entries()].map(([rel, abs]) => ({ rel, abs }));
}

function collectScope(context) {
  const { options } = context;
  if (options.scope === 'files') {
    const named = namedFiles(context, options.files);
    if (!context.git) return { base: null, mergeBase: null, files: named.map((file) => ({ ...file, changed: 'all' })) };
    const safe = named.filter((file) => !belowSymlink(context.root, file.rel)).map((file) => file.rel);
    const tracked = new Set(safe.length ? nulList(gitOrThrow(context, ['ls-files', '-z', '--', ...safe])) : []);
    const hunks = diffHunks(context, headOrEmptyTree(context), [...tracked]);
    return {
      base: null,
      mergeBase: null,
      files: named.map((file) => ({ ...file, changed: tracked.has(file.rel) ? hunks.get(file.rel) || new Set() : 'all' })),
    };
  }
  let base = headOrEmptyTree(context);
  let mergeBase = null;
  if (options.scope === 'base') {
    const found = runGit(['merge-base', options.base, 'HEAD'], { cwd: context.root, env: context.env });
    if (!found.ok) throw new GateError('BASE_NOT_FOUND', `no merge base between ${options.base} and HEAD`);
    mergeBase = found.stdout.trim();
    base = mergeBase;
  }
  const names = nulList(gitOrThrow(context, ['diff', '--name-only', '-z', '-M', '--diff-filter=ACMR', '--no-ext-diff', base]));
  const untracked = nulList(gitOrThrow(context, ['ls-files', '--others', '--exclude-standard', '-z']));
  const hunks = diffHunks(context, base, null);
  const files = new Map();
  for (const rel of names) files.set(rel, hunks.get(rel) || new Set());
  for (const rel of untracked) files.set(rel, 'all');
  return {
    base: options.scope === 'base' ? options.base : null,
    mergeBase,
    files: [...files.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([rel, changed]) => ({ rel, abs: path.join(context.root, rel), changed })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FILE FACTS
// ─────────────────────────────────────────────────────────────────────────────

function syntaxKind(rel, language, interpreter) {
  const ext = path.extname(rel).toLowerCase();
  if (language === 'python') return 'python';
  if (language === 'shell') {
    const shell = interpreter || (['.sh', '.bash'].includes(ext) ? 'bash' : null);
    return SHELL_PARSERS.has(shell) ? 'shell' : null;
  }
  if (language === 'javascript') return ext === '.cjs' ? 'cjs' : ext === '.mjs' ? 'mjs' : 'js';
  if (language === 'jsonc') return 'jsonc';
  if (ext === '.json') return JSONC_BASENAME.test(path.basename(rel)) || JSONC_FOLDER.test(rel) ? 'jsonc' : 'json';
  if (language === 'yaml' || language === 'toml') return language;
  return null;
}

// Path selectors read the resolved path: a hub file reached through a link is read
// where the hub keeps it, and any other file inside the repository by its real place
// there.
function matchPathFor(facts, context) {
  if (facts.real && isInside(facts.real, context.skilledDir)) {
    return toPosix(path.join(path.basename(context.skilledDir), path.relative(context.skilledDir, facts.real)));
  }
  if (facts.real && isInside(facts.real, context.rootReal)) return toPosix(path.relative(context.rootReal, facts.real));
  return facts.rel;
}

function fileFacts(file, context) {
  const facts = {
    ...file, unchecked: null, text: null, language: null, languageSource: null,
    interpreter: null, family: null, syntax: null, real: null, insideHub: false, labels: [],
  };
  facts.real = realpathOrSelf(file.abs);
  facts.insideHub = isInside(facts.real, context.skilledDir);
  facts.matchPath = matchPathFor(facts, context);
  if (matchesGlob(context.defaults.exclude, file.rel)) {
    facts.unchecked = 'excluded';
    return facts;
  }
  let buffer;
  try {
    const stat = fs.statSync(file.abs);
    if (!stat.isFile()) {
      facts.unchecked = 'not a regular file';
      return facts;
    }
    if (stat.size > MAX_FILE_BYTES) {
      facts.unchecked = 'size';
      return facts;
    }
    buffer = fs.readFileSync(file.abs);
  } catch {
    facts.unchecked = 'unreadable';
    return facts;
  }
  if (buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0)) {
    facts.unchecked = 'binary';
    return facts;
  }
  facts.text = buffer.toString('utf8').replace(/^﻿/, '');
  const firstLine = facts.text.split('\n', 1)[0];
  facts.interpreter = interpreterFromShebang(firstLine);
  const ext = path.extname(file.rel).toLowerCase();
  if (facts.interpreter && context.table.byInterpreter[facts.interpreter]) {
    facts.language = context.table.byInterpreter[facts.interpreter];
    facts.languageSource = 'shebang';
  } else if (context.table.byExtension[ext]) {
    facts.language = context.table.byExtension[ext];
    facts.languageSource = 'extension';
  }
  facts.family = facts.language ? context.table.languages[facts.language].family : null;
  facts.syntax = syntaxKind(file.rel, facts.language, facts.languageSource === 'shebang' ? facts.interpreter : null);
  if (!facts.family && !facts.syntax) facts.unchecked = 'no comment family';
  return facts;
}

// A file whose shebang names another language than its extension does, or whose
// name has no known extension, is read with that language's extensions, so a Python
// program named .sh gets the Python checklist. A file whose two signals agree keeps
// its own extension, so a .cjs file never reads as .js.
function effectiveExtensions(facts, context) {
  const own = path.extname(facts.rel).toLowerCase();
  if (facts.languageSource === 'shebang' && context.table.byExtension[own] !== facts.language) {
    return context.table.languages[facts.language].extensions || [];
  }
  return [own];
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SURFACES AND CHECKLISTS
// ─────────────────────────────────────────────────────────────────────────────

function declaredSurfaces(declHub) {
  return require(REPLAY_LIB_PATH).declaredSurfaces(declHub);
}

// A specific surface matches on any of its markers. The fallback is the hub's own
// code, so on a real file it holds only through a path marker and only when the
// resolved path lies inside the hub's own .skilled/ folder.
function fileLabels(facts, surfaces) {
  const lowerPath = facts.matchPath.toLowerCase();
  const lowerBase = path.posix.basename(lowerPath);
  const lowerText = facts.text ? facts.text.toLowerCase() : '';
  const labels = [];
  for (const surface of surfaces) {
    const paths = surface.pathMarkers || [];
    if (surface.role === 'fallback') {
      if (facts.insideHub && paths.some((marker) => pathMarkerMatches(lowerPath, marker))) labels.push(surface.label);
      continue;
    }
    const hit = paths.some((marker) => pathMarkerMatches(lowerPath, marker))
      || (surface.fileMarkers || []).some((marker) => fileMarkerMatches(lowerBase, marker))
      || (lowerText !== '' && (surface.contentMarkers || []).some((marker) => textMarkerMatches(lowerText, marker)));
    if (hit) labels.push(surface.label);
  }
  return labels.length > 0 ? labels : ['UNKNOWN'];
}

function describeSelectors(row) {
  return ['paths', 'extensions', 'contentMarkers']
    .filter((key) => Array.isArray(row[key]))
    .map((key) => `${key} ${row[key].join(' ')}`)
    .join(', ');
}

function hubFile(file, skillsDir) {
  return path.join(skillsDir, file.slice('hub:'.length));
}

function checklistRows(context) {
  const rows = context.defaults.checklists.map((row) => ({
    owner: null,
    file: row.file,
    path: hubFile(row.file, path.dirname(HUB_ROOT)),
    why: row.why,
    selectors: row,
  }));
  const registry = readJson(path.join(context.declHub, 'mode-registry.json'));
  const hubName = path.basename(context.declHub);
  for (const mode of Array.isArray(registry.modes) ? registry.modes : []) {
    const declared = mode && mode.quality && Array.isArray(mode.quality.checklists) ? mode.quality.checklists : [];
    const owner = mode && mode.surfaceDetection && typeof mode.surfaceDetection.label === 'string'
      ? mode.surfaceDetection.label.toUpperCase()
      : null;
    for (const row of declared) {
      rows.push({
        owner,
        file: `hub:${hubName}/${row.file}`,
        path: path.join(context.declHub, row.file),
        why: `${owner ? `${owner} surface` : mode.workflowMode}, ${describeSelectors(row)}`,
        selectors: row,
      });
    }
  }
  return rows;
}

function selectorsMatch(selectors, facts, context) {
  const kinds = ['paths', 'extensions', 'contentMarkers'].filter((key) => Array.isArray(selectors[key]));
  if (kinds.length === 0) return false;
  return kinds.every((key) => {
    if (key === 'paths') return matchesGlob(selectors.paths, facts.matchPath);
    if (key === 'extensions') {
      const own = effectiveExtensions(facts, context);
      return selectors.extensions.some((ext) => own.includes(ext.toLowerCase()));
    }
    const lowerText = facts.text ? facts.text.toLowerCase() : '';
    return lowerText !== '' && selectors.contentMarkers.some((marker) => textMarkerMatches(lowerText, marker.toLowerCase()));
  });
}

function resolveChecklists(files, context) {
  const checklists = [];
  const errors = [];
  const scoped = files.filter((facts) => facts.unchecked !== 'excluded');
  for (const row of checklistRows(context)) {
    const matched = scoped.filter((facts) => (row.owner === null || facts.labels.includes(row.owner))
      && selectorsMatch(row.selectors, facts, context));
    if (matched.length === 0) continue;
    const existing = checklists.find((entry) => entry.file === row.file);
    if (existing) {
      for (const facts of matched) if (!existing.files.includes(facts.rel)) existing.files.push(facts.rel);
      continue;
    }
    checklists.push({ file: row.file, path: row.path, why: row.why, files: matched.map((facts) => facts.rel) });
    if (!fs.existsSync(row.path)) {
      errors.push({ code: 'CHECKLIST_MISSING', message: `${row.file} is declared but ${row.path} does not exist`, repair: REPAIRS.CHECKLIST_MISSING });
    }
  }
  return { checklists, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CHECK PLAN AND IN-PROCESS CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function sensorExcluded(context, sensor, facts) {
  const settings = context.defaults.sensors[sensor] || {};
  return matchesGlob(settings.exclude, facts.rel);
}

// Which files each check applies to, and why. The run and --explain read the same
// plan, so an explanation can never disagree with what a run does.
function applicability(facts, context, { explain = false } = {}) {
  const textual = !facts.unchecked;
  // The conflict and secret sensors read raw text, so they also scan a file with no
  // comment family, such as a .env or a Markdown file, where a marker or a key matters
  // as much as in code. A debugger line in such a file is an example, not a leftover.
  const readable = facts.text !== null;
  const generated = context.defaults.generated || [];
  const debugOn = (context.defaults.sensors.debugLeftovers || {}).enabled !== false;
  const kind = facts.syntax;
  return {
    'comment-hygiene': textual && facts.family ? `${facts.language} comments, ${facts.family} family, chosen by ${facts.languageSource}` : null,
    'conflict-markers': readable && !sensorExcluded(context, 'conflictMarkers', facts) ? 'every readable text file' : null,
    secrets: readable && !sensorExcluded(context, 'secrets', facts) ? 'every readable text file' : null,
    'debug-leftovers': textual && debugOn && !sensorExcluded(context, 'debugLeftovers', facts) && (explain || hasChanges(facts))
      ? 'changed lines only' : null,
    'syntax-json': textual && (kind === 'json' || kind === 'jsonc') ? `${kind} parse in process` : null,
    'syntax-cjs': textual && kind === 'cjs' ? 'CommonJS compiled in process, never run' : null,
    'syntax-node': textual && (kind === 'mjs' || kind === 'js')
      ? `node --check, ${kind === 'mjs' ? 'exact' : 'heuristic, because plain .js may hold JSX or Flow'}` : null,
    'syntax-python': textual && kind === 'python' ? `ast.parse, Python chosen by ${facts.languageSource}` : null,
    'syntax-shell': textual && kind === 'shell' ? 'bash -n' : null,
    'syntax-yaml': textual && kind === 'yaml' ? 'PyYAML compose, when python3 can import it' : null,
    'syntax-toml': textual && kind === 'toml' ? 'tomllib, when python3 can import it' : null,
    'dist-staleness': textual && generated.some((row) => matchesGlob(row.paths, facts.rel)) ? 'a declared generated path' : null,
  };
}

function planChecks(files, context) {
  const plan = new Map(CHECKS.map((check) => [check.id, []]));
  for (const facts of files) {
    const reasons = applicability(facts, context);
    for (const [id, why] of Object.entries(reasons)) if (why) plan.get(id).push(facts);
  }
  return plan;
}

function selected(context, id) {
  const { only, skip } = context.options;
  return (!only || only.has(id)) && !skip.has(id);
}

function runSensors(plan, context) {
  const findings = [];
  for (const facts of plan.get('conflict-markers')) {
    let open = false;
    lines(facts.text).forEach((text, index) => {
      const line = index + 1;
      const start = CONFLICT_START.test(text);
      if (start || (CONFLICT_END.test(text) && !open)) {
        findings.push(finding({ rule: 'conflict.marker', severity: 'P0', confidence: 'exact', file: facts.rel, line,
          origin: originFor(facts, line), reason: 'merge-conflict marker', excerpt: excerpt(text), check: 'conflict-markers' }));
      }
      if (start) open = true;
      else if (CONFLICT_END.test(text)) open = false;
    });
  }
  for (const facts of plan.get('secrets')) {
    lines(facts.text).forEach((text, index) => {
      const rule = SECRET_RULES.find((candidate) => candidate.pattern.test(text));
      if (!rule) return;
      const line = index + 1;
      findings.push(finding({ rule: rule.rule, severity: 'P0', confidence: 'exact', file: facts.rel, line,
        origin: originFor(facts, line), reason: rule.reason, excerpt: null, check: 'secrets' }));
    });
  }
  for (const facts of plan.get('debug-leftovers')) {
    lines(facts.text).forEach((text, index) => {
      const line = index + 1;
      if (originFor(facts, line) !== 'changed-line') return;
      const rule = DEBUG_RULES.find((candidate) => candidate.pattern.test(text));
      if (!rule) return;
      findings.push(finding({ rule: rule.rule, severity: 'P1', confidence: 'heuristic', file: facts.rel, line,
        origin: 'changed-line', reason: rule.reason, excerpt: excerpt(text), check: 'debug-leftovers' }));
    });
  }
  return findings;
}

function cjsFault(facts) {
  const source = facts.text.startsWith('#!') ? `//${facts.text.slice(2)}` : facts.text;
  try {
    vm.compileFunction(source, [...CJS_PARAMETERS], { filename: facts.abs });
    return null;
  } catch (error) {
    const where = /:(\d+)\s*$/.exec(String(error.stack || '').split('\n')[0]);
    return { line: where ? Number(where[1]) : null, message: error.message };
  }
}

function runInProcessSyntax(plan) {
  const findings = [];
  for (const facts of plan.get('syntax-json')) {
    try {
      JSON.parse(facts.syntax === 'jsonc' ? stripJsonComments(facts.text) : facts.text);
    } catch (error) {
      // Many tools read their own .json files as JSONC, so a file that parses once its
      // comments and trailing commas leave may be valid where it is read, and the fault
      // cannot block.
      const jsoncOnly = facts.syntax === 'json' && parsesAsJsonc(facts.text);
      findings.push(finding({ rule: 'syntax.json', severity: 'P0', confidence: jsoncOnly ? 'heuristic' : 'exact', file: facts.rel,
        line: lineFromJsonError(error.message, facts.text), origin: fileOrigin(facts),
        reason: jsoncOnly
          ? `does not parse as JSON, and parses as JSONC, which the tool that reads it may accept: ${error.message}`
          : `does not parse as ${facts.syntax.toUpperCase()}: ${error.message}`,
        check: 'syntax-json' }));
    }
  }
  for (const facts of plan.get('syntax-cjs')) {
    const fault = cjsFault(facts);
    if (!fault) continue;
    findings.push(finding({ rule: 'syntax.cjs', severity: 'P0', confidence: 'exact', file: facts.rel, line: fault.line,
      origin: fileOrigin(facts), reason: `does not compile as CommonJS: ${fault.message}`, check: 'syntax-cjs' }));
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. SPAWNED CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function runHygiene(files, context) {
  const argv = [context.python, '-B', '-I', HYGIENE_CHECKER, '--json', '--', ...files.map((facts) => facts.rel)];
  const result = spawnArgv(argv, { cwd: context.root, env: context.env, timeoutMs: context.timeoutMs });
  const base = { exit: result.exit, duration_ms: result.durationMs };
  if (result.state === 'TIMEOUT' || result.state === 'ERROR') return { ...base, state: result.state, findings: [] };
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    return { ...base, state: 'ERROR', findings: [], repair: 'the checker printed no comment-hygiene/v1 document' };
  }
  const byRel = new Map(files.map((facts) => [facts.rel, facts]));
  const findings = [];
  let unreadable = false;
  for (const record of Array.isArray(report.files) ? report.files : []) {
    const facts = byRel.get(record.file);
    if (record.status === 'unreadable') unreadable = true;
    if (!facts) continue;
    for (const hit of record.findings || []) {
      findings.push(finding({ rule: `hygiene.${hit.rule}`, severity: 'P0', confidence: 'exact', file: facts.rel,
        line: hit.line, origin: originFor(facts, hit.line), reason: hit.reason, excerpt: hit.excerpt ? excerpt(String(hit.excerpt)) : null,
        check: 'comment-hygiene' }));
    }
  }
  const failed = unreadable || ![0, 1, 2].includes(report.exit_code);
  return { ...base, state: failed ? 'ERROR' : findings.length ? 'RAN_FAIL' : 'RAN_CLEAN', findings };
}

function runNodeCheck(files, context) {
  const results = [];
  const findings = [];
  for (const facts of files) {
    const result = spawnArgv([process.execPath, '--check', facts.abs], { cwd: context.root, env: context.env, timeoutMs: context.timeoutMs });
    results.push(result);
    if (result.state !== 'RAN_FAIL') continue;
    const where = /:(\d+)\s*$/.exec(result.stderr.split('\n')[0]);
    const message = /^(?:SyntaxError|Error): (.*)$/m.exec(result.stderr);
    const exact = facts.syntax === 'mjs';
    findings.push(finding({ rule: exact ? 'syntax.mjs' : 'syntax.js', severity: 'P0', confidence: exact ? 'exact' : 'heuristic',
      file: facts.rel, line: where ? Number(where[1]) : null, origin: fileOrigin(facts),
      reason: `node --check: ${message ? message[1] : result.stderr.trim().split('\n').pop()}`, check: 'syntax-node' }));
  }
  return { state: aggregateState(results, findings.length > 0), findings, duration_ms: results.reduce((sum, r) => sum + r.durationMs, 0) };
}

function runShellCheck(files, context) {
  const results = [];
  const findings = [];
  for (const facts of files) {
    const result = spawnArgv([context.bash, '-n', facts.abs], { cwd: context.root, env: context.env, timeoutMs: context.timeoutMs });
    results.push(result);
    if (result.state !== 'RAN_FAIL') continue;
    const where = /line (\d+): (.*)$/m.exec(result.stderr);
    findings.push(finding({ rule: 'syntax.shell', severity: 'P0', confidence: 'exact', file: facts.rel,
      line: where ? Number(where[1]) : null, origin: fileOrigin(facts),
      reason: `bash -n: ${where ? where[2] : result.stderr.trim().split('\n')[0]}`, check: 'syntax-shell' }));
  }
  return { state: aggregateState(results, findings.length > 0), findings, duration_ms: results.reduce((sum, r) => sum + r.durationMs, 0) };
}

const PARSE_CHECKS = Object.freeze({ python: 'syntax-python', yaml: 'syntax-yaml', toml: 'syntax-toml' });
const PARSER_REPAIRS = Object.freeze({
  'syntax-yaml': 'install PyYAML for python3 to parse YAML',
  'syntax-toml': 'run Python 3.11 or later, whose tomllib parses TOML',
});

// One process parses every Python, YAML and TOML file, and its result is split back
// into the three checks it serves.
function runParseFloor(byCheck, context) {
  const items = [];
  for (const [kind, id] of Object.entries(PARSE_CHECKS)) {
    for (const facts of byCheck[id] || []) items.push({ path: facts.abs, kind, facts });
  }
  const result = spawnArgv([context.python, '-B', '-I', '-c', PARSE_SCRIPT], {
    cwd: context.root,
    env: context.env,
    timeoutMs: context.timeoutMs,
    input: JSON.stringify(items.map(({ path: file, kind }) => ({ path: file, kind }))),
  });
  const outcome = {};
  const fail = (state, repair) => {
    for (const id of Object.keys(byCheck)) outcome[id] = { state, findings: [], repair, duration_ms: result.durationMs };
    return outcome;
  };
  if (result.state !== 'RAN_CLEAN') return fail(result.state === 'TIMEOUT' ? 'TIMEOUT' : 'ERROR', null);
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    return fail('ERROR', 'the parse floor printed no result list');
  }
  for (const id of Object.keys(byCheck)) outcome[id] = { findings: [], unavailable: false, failed: false, duration_ms: result.durationMs };
  parsed.forEach((entry, index) => {
    const item = items[index];
    if (!item) return;
    const id = PARSE_CHECKS[item.kind];
    if (entry.unavailable) outcome[id].unavailable = true;
    else if (entry.error) outcome[id].failed = true;
    else if (entry.ok === false) {
      outcome[id].findings.push(finding({ rule: `syntax.${item.kind}`, severity: 'P0', confidence: 'exact', file: item.facts.rel,
        line: entry.line || null, origin: fileOrigin(item.facts), reason: `does not parse: ${entry.message}`, check: id }));
    }
  });
  for (const id of Object.keys(byCheck)) {
    const entry = outcome[id];
    if (entry.unavailable) Object.assign(entry, { state: 'SKIPPED_ABSENT', repair: PARSER_REPAIRS[id] });
    else entry.state = entry.failed ? 'ERROR' : entry.findings.length ? 'RAN_FAIL' : 'RAN_CLEAN';
  }
  return outcome;
}

function readHookFlags(file) {
  const flags = {};
  try {
    for (const raw of fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#') || !line.includes('=')) continue;
      const key = line.slice(0, line.indexOf('=')).trim();
      let value = line.slice(line.indexOf('=') + 1).replace(/[ \t]#.*$/, '').trim();
      if (value.length >= 2 && value[0] === value[value.length - 1] && ['"', "'"].includes(value[0])) value = value.slice(1, -1);
      if (key) flags[key] = value;
    }
  } catch {
    return {};
  }
  return flags;
}

// The dist checker stays silent when its hook switch is off, so the adapter reads the
// switch the way the checker does and reports the skip instead of reading silence as
// fresh.
function distSwitchOn(script, env) {
  const truthy = (value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());
  const sourceRoot = path.resolve(path.dirname(realpathOrSelf(script)), '..', '..', '..', '..');
  const flags = readHookFlags(env.HOOK_FLAGS_CONFIG || path.join(sourceRoot, 'hooks', 'hook-flags.env'));
  const resolve = (key) => (Object.prototype.hasOwnProperty.call(env, key) ? env[key] : flags[key]);
  return !truthy(resolve('SYSTEM_HOOKS_DISABLED')) && !truthy(resolve('SYSTEM_DIST_FRESHNESS_DISABLED'));
}

/**
 * Check declared generated files with the dist checker's per-file mode, which never
 * rebuilds. It always exits 0, so the banner it prints is the only signal, and any line
 * it does not recognize reads as an error, never as fresh.
 *
 * @param {Array<{rel:string, abs:string}>} files - Declared generated files in scope.
 * @param {Object} [options] - env, timeoutMs, noRun, script and cwd.
 * @returns {{check:Object, findings:Object[]}}
 */
function runDistAdapter(files, { env = process.env, timeoutMs = DEFAULT_TIMEOUT_SEC * 1000, noRun = false,
  script = DIST_CHECKER, cwd = path.resolve(HUB_ROOT, '..', '..', '..') } = {}) {
  const check = checkEntry('dist-staleness', { argv: ['python3', '-B', script, '{file}'], cwd, files: files.length });
  if (files.length === 0) return { check, findings: [] };
  if (!distSwitchOn(script, env)) {
    return { check: { ...check, state: 'SKIPPED_BY_FLAG', repair: 'the dist-freshness hook switch is off, so no file was checked' }, findings: [] };
  }
  const python = findTool('python3', env);
  if (!python) return { check: { ...check, state: 'SKIPPED_ABSENT', repair: 'install python3' }, findings: [] };
  if (noRun) return { check: { ...check, state: 'LISTED' }, findings: [] };
  const findings = [];
  const results = [];
  for (const file of files) {
    const result = spawnArgv([python, '-B', script, file.abs], {
      cwd,
      env: { ...env, SPECKIT_DIST_AUTO_REBUILD: '0' },
      timeoutMs,
    });
    const banner = result.stdout.split('\n').map((line) => line.trim()).filter(Boolean);
    const unknown = banner.some((line) => !line.startsWith(DIST_STALE));
    const broken = result.state === 'RAN_FAIL' || result.stderr.trim() !== '' || unknown;
    results.push(broken && !['TIMEOUT', 'ERROR'].includes(result.state) ? { ...result, state: 'ERROR' } : result);
    if (broken) continue;
    for (const line of banner) {
      findings.push(finding({ rule: 'dist.stale', severity: 'P1', confidence: 'exact', file: file.rel, line: null,
        origin: 'changed-line', reason: line, check: 'dist-staleness' }));
    }
  }
  const duration = results.reduce((sum, result) => sum + result.durationMs, 0);
  return { check: { ...check, state: aggregateState(results, findings.length > 0), duration_ms: duration }, findings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. ENFORCEMENT LAYER PROBES
// ─────────────────────────────────────────────────────────────────────────────

function gitValue(context, args, cwd) {
  const env = { ...context.env };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE']) if (cwd) delete env[key];
  const result = runGit(args, { cwd: cwd || context.root, env });
  return result.ok ? result.stdout.trim() : null;
}

// Present only when a pre-commit hook names the checker, git would run it, and the
// hook's own trust gate lets it run in this repository.
function probePreCommit(context) {
  if (!context.git) return 'absent';
  const hooks = gitValue(context, ['rev-parse', '--path-format=absolute', '--git-path', 'hooks']);
  if (!hooks) return 'unknown';
  const hook = path.join(hooks, 'pre-commit');
  let text;
  try {
    text = fs.readFileSync(hook, 'utf8');
  } catch (error) {
    return error.code === 'ENOENT' ? 'absent' : 'unknown';
  }
  if (!HYGIENE_REFERENCE.test(text)) return 'absent';
  try {
    fs.accessSync(hook, fs.constants.X_OK);
  } catch {
    return 'broken';
  }
  if (/skilled\.trustRepoHooks/.test(text)) {
    const hookCommon = gitValue(context, ['rev-parse', '--path-format=absolute', '--git-common-dir'], path.dirname(realpathOrSelf(hook)));
    const repoCommon = gitValue(context, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
    const trusted = gitValue(context, ['config', '--local', '--bool', 'skilled.trustRepoHooks']) === 'true';
    if ((!hookCommon || hookCommon !== repoCommon) && !trusted) return 'untrusted';
  }
  return 'present';
}

function probeCi(context) {
  const dir = path.join(context.root, '.github', 'workflows');
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch (error) {
    return error.code === 'ENOENT' ? 'absent' : 'unknown';
  }
  try {
    const found = names.filter((name) => /\.ya?ml$/i.test(name))
      .some((name) => HYGIENE_REFERENCE.test(fs.readFileSync(path.join(dir, name), 'utf8')));
    return found ? 'present' : 'absent';
  } catch {
    return 'unknown';
  }
}

// A runtime hook config that names the post-edit adapter runs it from the project
// folder, so a named adapter missing from this repository is a broken hook. Only a
// token holding a folder is a path: a bare file name in a config is a log label.
function probePostEdit(context) {
  let configured = false;
  const named = [];
  for (const config of POST_EDIT_CONFIGS) {
    let text;
    try {
      text = fs.readFileSync(path.join(context.root, config), 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      return 'unknown';
    }
    if (!text.includes('post-edit-quality')) continue;
    configured = true;
    named.push(...(text.match(POST_EDIT_PATH) || []).filter((token) => token.includes('/')));
  }
  if (!configured) return 'absent';
  const missing = named.some((file) => !fs.existsSync(path.join(context.root, file.replace(/^\.?\/+/, ''))));
  return missing ? 'broken' : 'present';
}

function probeLayers(context) {
  return { pre_commit_hygiene: probePreCommit(context), ci_hygiene: probeCi(context), post_edit: probePostEdit(context) };
}

const WHOLE_FILE_LAYERS = Object.freeze([
  ['pre_commit_hygiene', 'the pre-commit hook scans whole files'],
  ['ci_hygiene', 'the CI hygiene job scans whole files'],
]);

// A hygiene finding on an unchanged line of a touched file blocks only when a layer
// that scans whole files would fail the commit anyway. Otherwise it is debt the change
// did not write.
function applyLayerRule(findings, layers) {
  const layer = WHOLE_FILE_LAYERS.find(([key]) => layers[key] === 'present');
  return findings.map((entry) => {
    if (entry.check !== 'comment-hygiene' || entry.origin !== 'touched-file') return entry;
    if (layer) return { ...entry, severity: 'P0', blocking: true, reason: `${entry.reason}, blocking because ${layer[1]}` };
    return { ...entry, severity: 'P1', blocking: false };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. VERDICT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick the gate by precedence: ERROR, then BLOCKED, then UNVERIFIED, then
 * NOTHING_CHECKED, then NO_BLOCKER_FOUND. No gate means pass.
 *
 * @param {Object} facts - errors, findings, checks and filesChecked.
 * @returns {{gate:string, exit_code:number, unverified:string[]}}
 */
function decideGate({ errors = [], findings = [], checks = [], filesChecked = 0 }) {
  const unverified = checks.filter((check) => check.required && UNVERIFIED_STATES.has(check.state)).map((check) => check.id);
  const blocked = findings.some((entry) => entry.blocking && entry.severity === 'P0' && entry.confidence === 'exact')
    || checks.some((check) => check.origin === 'configured' && check.severity === 'P0' && check.required && check.state === 'RAN_FAIL');
  let gate = 'NO_BLOCKER_FOUND';
  if (errors.length > 0) gate = 'ERROR';
  else if (blocked) gate = 'BLOCKED';
  else if (unverified.length > 0) gate = 'UNVERIFIED';
  else if (filesChecked === 0) gate = 'NOTHING_CHECKED';
  return { gate, exit_code: GATE_EXIT[gate], unverified };
}

// Every secret value in one file's text, found the way the sensor finds them.
function secretValues(text) {
  const values = [];
  for (const { pattern } of SECRET_RULES) {
    for (const match of text.matchAll(new RegExp(pattern.source, 'g'))) values.push(match[0]);
  }
  return values;
}

function quotesSecret(field, values) {
  return values.some((value) => {
    if (field.includes(value)) return true;
    for (let at = 0; at + SECRET_WINDOW <= value.length; at += 1) {
      if (field.includes(value.slice(at, at + SECRET_WINDOW))) return true;
    }
    return false;
  });
}

function withheld(reason, values) {
  const at = reason.indexOf(': ');
  const head = at > 0 ? reason.slice(0, at) : null;
  const note = 'the message is withheld, because this file holds a secret signature';
  return head && !quotesSecret(head, values) ? `${head}: ${note}` : note;
}

// A key never reaches a finding, whichever check reported it, and whether or not the
// secret sensor ran. The decision reads the whole source line and the file's own keys,
// because an excerpt is cut to its length limit and a parser quotes only a window of
// text, and either cut can leave part of a key that no signature matches any more. A
// parser message in a file that holds a key is withheld whole, since the window it
// quotes can sit anywhere.
function redactSecrets(findings, files) {
  const byRel = new Map(files.map((facts) => [facts.rel, facts]));
  const keys = new Map();
  return findings.map((entry) => {
    const facts = byRel.get(entry.file);
    if (!facts || !facts.text) return entry;
    if (!keys.has(entry.file)) keys.set(entry.file, secretValues(facts.text));
    const values = keys.get(entry.file);
    if (values.length === 0) return entry;
    const source = entry.line ? lines(facts.text)[entry.line - 1] || '' : '';
    const keyOnLine = SECRET_RULES.some((rule) => rule.pattern.test(source));
    const excerptOut = entry.excerpt && (keyOnLine || quotesSecret(entry.excerpt, values)) ? null : entry.excerpt;
    const parser = String(entry.check).startsWith('syntax-');
    const reasonOut = entry.reason && (parser || quotesSecret(entry.reason, values)) ? withheld(entry.reason, values) : entry.reason;
    return { ...entry, excerpt: excerptOut, reason: reasonOut };
  });
}

function summarize(findings, unverified) {
  return {
    p0_blocking: findings.filter((entry) => entry.severity === 'P0' && entry.blocking).length,
    p0_heuristic: findings.filter((entry) => entry.severity === 'P0' && entry.confidence === 'heuristic').length,
    p1_open: findings.filter((entry) => entry.severity === 'P1').length,
    p2_open: findings.filter((entry) => entry.severity === 'P2').length,
    touched_file_debt: findings.filter((entry) => entry.origin === 'touched-file' && !entry.blocking).length,
    unverified,
  };
}

function emptyVerdict(options) {
  return {
    schema: RUN_SCHEMA,
    status: 'advisory',
    gate: 'ERROR',
    exit_code: GATE_EXIT.ERROR,
    scope: { mode: options ? options.scope : null, base: options ? options.base : null, merge_base: null,
      lines: options ? options.lines : 'changed', files: [] },
    config: { source: 'defaults', path: DEFAULTS_FILE, errors: [] },
    resolved_surface: ['unknown'],
    surfaces: [],
    layers: { pre_commit_hygiene: 'unknown', ci_hygiene: 'unknown', post_edit: 'unknown' },
    checklists: [],
    checks: [],
    findings: [],
    suggested_checks: [],
    judgment_required: [...JUDGMENT_REQUIRED],
    coverage: { files_total: 0, files_checked: 0, unchecked: [] },
    summary: summarize([], []),
    errors: [],
  };
}

function errorVerdict(error, options) {
  const code = error instanceof GateError ? error.code : 'INTERNAL_ERROR';
  return {
    ...emptyVerdict(options),
    errors: [{ code, message: error.message, repair: REPAIRS[code] || REPAIRS.INTERNAL_ERROR }],
  };
}

function recordSpawnedCheck(id, files, context, run) {
  const tool = { 'comment-hygiene': context.python, 'syntax-node': process.execPath, 'syntax-shell': context.bash }[id];
  const argv = {
    'comment-hygiene': ['python3', '-B', '-I', HYGIENE_CHECKER, '--json', '--', '{files}'],
    'syntax-node': ['node', '--check', '{file}'],
    'syntax-shell': ['bash', '-n', '{file}'],
  }[id];
  const entry = checkEntry(id, { argv, files: files.length });
  if (files.length === 0) return { entry, run: null };
  if (!selected(context, id)) return { entry: { ...entry, state: 'SKIPPED_BY_FLAG' }, run: null };
  if (!tool) return { entry: { ...entry, state: 'SKIPPED_ABSENT', repair: `install ${entry.requires}` }, run: null };
  if (context.options.noRun) return { entry: { ...entry, state: 'LISTED' }, run: null };
  return { entry, run };
}

function runGate(context) {
  const scope = collectScope(context);
  if (context.options.lines === 'file') for (const file of scope.files) file.changed = 'all';
  const surfaces = declaredSurfaces(context.declHub);
  const files = scope.files.map((file) => fileFacts(file, context));
  for (const facts of files) if (facts.unchecked !== 'excluded') facts.labels = fileLabels(facts, surfaces);
  const { checklists, errors: configErrors } = resolveChecklists(files, context);
  const layers = probeLayers(context);
  const plan = planChecks(files, context);
  const checks = new Map();
  const errors = [];
  let findings = [];
  const ranOn = new Map();

  const settle = (entry, applicable) => {
    checks.set(entry.id, entry);
    if (RAN_STATES.has(entry.state)) ranOn.set(entry.id, applicable);
  };

  for (const id of ['conflict-markers', 'secrets', 'debug-leftovers', 'syntax-json', 'syntax-cjs']) {
    const applicable = plan.get(id);
    const entry = checkEntry(id, { files: applicable.length });
    if (applicable.length === 0) settle(entry, applicable);
    else if (!selected(context, id)) settle({ ...entry, state: 'SKIPPED_BY_FLAG' }, applicable);
    else settle({ ...entry, state: 'RAN_CLEAN' }, applicable);
    if (checks.get(id).state !== 'RAN_CLEAN') plan.set(id, []);
  }
  const inProcess = [...runSensors(plan, context), ...runInProcessSyntax(plan)];
  for (const entry of inProcess) checks.get(entry.check).state = 'RAN_FAIL';
  findings.push(...inProcess);

  // Each spawned check is a step that runs and then settles its own row. All of them run
  // between one snapshot and the next, because listing the untracked files walks the
  // whole tree and a snapshot per check dominated the run in a large repository. A
  // mutation therefore names every check that ran in that window.
  const steps = [];
  const spawned = [
    ['comment-hygiene', () => runHygiene(plan.get('comment-hygiene'), context)],
    ['syntax-node', () => runNodeCheck(plan.get('syntax-node'), context)],
  ];
  for (const [id, work] of spawned) {
    const { entry, run } = recordSpawnedCheck(id, plan.get(id), context, work);
    if (!run) {
      settle(entry, plan.get(id));
      continue;
    }
    steps.push({ id, run, finish: (outcome) => {
      findings.push(...outcome.findings);
      settle({ ...entry, state: outcome.state, exit: outcome.exit === undefined ? null : outcome.exit,
        duration_ms: outcome.duration_ms || 0, repair: outcome.repair || null }, plan.get(id));
    } });
  }

  const parseArgv = ['python3', '-B', '-I', '-c', '<parse floor>'];
  const parseWanted = {};
  for (const id of Object.values(PARSE_CHECKS)) {
    const applicable = plan.get(id);
    const entry = checkEntry(id, { argv: parseArgv, files: applicable.length });
    if (applicable.length === 0) settle(entry, applicable);
    else if (!selected(context, id)) settle({ ...entry, state: 'SKIPPED_BY_FLAG' }, applicable);
    else if (!context.python) settle({ ...entry, state: 'SKIPPED_ABSENT', repair: 'install python3' }, applicable);
    else if (context.options.noRun) settle({ ...entry, state: 'LISTED' }, applicable);
    else parseWanted[id] = applicable;
  }
  if (Object.keys(parseWanted).length > 0) {
    steps.push({ id: Object.keys(parseWanted).join(','), run: () => runParseFloor(parseWanted, context), finish: (outcome) => {
      for (const id of Object.keys(parseWanted)) {
        const result = outcome[id] || { state: outcome.state || 'ERROR', findings: [], repair: outcome.repair };
        findings.push(...result.findings);
        settle(checkEntry(id, { argv: parseArgv, files: parseWanted[id].length, state: result.state,
          duration_ms: result.duration_ms || 0, repair: result.repair || null }), parseWanted[id]);
      }
    } });
  }

  const shell = recordSpawnedCheck('syntax-shell', plan.get('syntax-shell'), context, () => runShellCheck(plan.get('syntax-shell'), context));
  if (shell.run) {
    steps.push({ id: 'syntax-shell', run: shell.run, finish: (outcome) => {
      findings.push(...outcome.findings);
      settle({ ...shell.entry, state: outcome.state, duration_ms: outcome.duration_ms || 0, repair: outcome.repair || null }, plan.get('syntax-shell'));
    } });
  } else {
    settle(shell.entry, plan.get('syntax-shell'));
  }

  const generated = plan.get('dist-staleness');
  const distOptions = { env: context.env, timeoutMs: context.timeoutMs, noRun: context.options.noRun };
  const settleDist = (outcome) => {
    if (outcome.check) {
      findings.push(...outcome.findings);
      settle(outcome.check, generated);
    } else {
      settle(checkEntry('dist-staleness', { state: 'ERROR', files: generated.length, repair: outcome.repair || null }), generated);
    }
  };
  if (generated.length === 0) {
    settle(checkEntry('dist-staleness'), generated);
  } else if (!selected(context, 'dist-staleness')) {
    settle(checkEntry('dist-staleness', { state: 'SKIPPED_BY_FLAG', files: generated.length }), generated);
  } else if (context.options.noRun) {
    settleDist(runDistAdapter(generated, distOptions));
  } else {
    steps.push({ id: 'dist-staleness', run: () => runDistAdapter(generated, distOptions), finish: settleDist });
  }

  const finished = new Set();
  const failRest = (repair) => {
    for (const step of steps) if (!finished.has(step)) step.finish({ state: 'ERROR', findings: [], repair });
  };
  if (steps.length > 0) {
    const guardContext = { root: context.root, git: context.git, files: files.map((facts) => facts.rel), env: context.env };
    try {
      const outcome = withGuard(guardContext, () => {
        for (const step of steps) {
          const result = step.run();
          finished.add(step);
          step.finish(result);
        }
      });
      if (outcome.mutated.length > 0) {
        const ids = steps.map((step) => step.id).join(',');
        errors.push({ code: 'CHECK_MUTATED_WORKSPACE', message: `the workspace changed while ${ids} ran`, check: ids,
          paths: outcome.mutated, repair: REPAIRS.CHECK_MUTATED_WORKSPACE });
      }
    } catch (error) {
      errors.push({ code: error.code === 'GUARD_FAILED' ? 'GUARD_FAILED' : 'INTERNAL_ERROR', message: error.message,
        repair: REPAIRS.GUARD_FAILED });
      failRest('not run, because the workspace guard or an earlier check failed');
    }
  }

  findings = redactSecrets(applyLayerRule(findings, layers), files)
    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : (a.line || 0) - (b.line || 0) || (a.rule < b.rule ? -1 : 1)));
  const orderedChecks = CHECKS.map((check) => checks.get(check.id));
  // A file the language checks could not read stays unchecked, even when the sensors
  // scanned its raw text, so a change of such files alone never reads as checked.
  const checked = new Set();
  for (const applicable of ranOn.values()) for (const facts of applicable) if (!facts.unchecked) checked.add(facts.rel);
  const allErrors = [...configErrors, ...errors];
  const decision = decideGate({ errors: allErrors, findings, checks: orderedChecks, filesChecked: checked.size });
  const labels = [];
  for (const surface of surfaces) {
    if (files.some((facts) => facts.labels.includes(surface.label)) && !labels.includes(surface.label)) labels.push(surface.label);
  }
  return {
    schema: RUN_SCHEMA,
    status: 'advisory',
    gate: decision.gate,
    exit_code: decision.exit_code,
    scope: { mode: context.options.scope, base: scope.base, merge_base: scope.mergeBase, lines: context.options.lines,
      files: files.map((facts) => facts.rel) },
    config: { source: 'defaults', path: DEFAULTS_FILE, errors: configErrors },
    resolved_surface: labels.length > 0 ? labels : ['unknown'],
    surfaces: files.filter((facts) => facts.unchecked !== 'excluded').map((facts) => ({ file: facts.rel, labels: facts.labels })),
    layers,
    checklists,
    checks: orderedChecks,
    findings,
    suggested_checks: [],
    judgment_required: [...JUDGMENT_REQUIRED],
    coverage: {
      files_total: files.length,
      files_checked: checked.size,
      unchecked: files.filter((facts) => facts.unchecked).map((facts) => ({ file: facts.rel, reason: facts.unchecked })),
    },
    summary: summarize(findings, decision.unverified),
    errors,
    private_labels: surfaces.filter((surface) => surface.skillId && /^local-/.test(surface.skillId))
      .map((surface) => [surface.skillId, surface.label]),
  };
}

function explain(context) {
  const [named] = namedFiles(context, [context.options.explain]);
  const facts = fileFacts({ ...named, changed: new Set() }, context);
  const surfaces = declaredSurfaces(context.declHub);
  if (facts.unchecked !== 'excluded') facts.labels = fileLabels(facts, surfaces);
  const { checklists, errors } = resolveChecklists([facts], context);
  const reasons = applicability(facts, context, { explain: true });
  return {
    schema: EXPLAIN_SCHEMA,
    status: 'advisory',
    exit_code: GATE_EXIT.NOTHING_CHECKED,
    file: facts.rel,
    language: facts.language,
    language_source: facts.languageSource,
    unchecked: facts.unchecked,
    surfaces: facts.labels,
    checklists: checklists.map(({ file, path: where, why }) => ({ file, path: where, why })),
    checks: CHECKS.map((check) => ({
      id: check.id,
      applies: Boolean(reasons[check.id]),
      why: reasons[check.id] || (facts.unchecked ? `the file is unchecked: ${facts.unchecked}` : 'not this file\'s language or path'),
    })),
    errors,
    note: 'nothing was run',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

// A private surface prints by its label only, because an envelope gets pasted into
// tracked handoffs and no tracked file may name a private skill. A private name starts
// a path segment or a word, so a public name that only holds the text, such as
// nonlocal-config.js or .local-env.sh, prints as it is.
function redactPrivate(text, privateLabels) {
  const labels = new Map(privateLabels || []);
  return text.replace(/(^|[^A-Za-z0-9_.-])(local-[A-Za-z0-9._-]*)/gm, (match, lead, name) => `${lead}<${labels.get(name) || 'PRIVATE'}>`);
}

function checkerOutputs(verdict) {
  const { summary, layers } = verdict;
  const unverified = summary.unverified.length > 0 ? summary.unverified.join(',') : 'none';
  return `${RUN_SCHEMA} gate=${verdict.gate} exit=${verdict.exit_code} p0_blocking=${summary.p0_blocking} `
    + `unverified=${unverified} unchecked=${verdict.coverage.unchecked.length} `
    + `layers=pc:${layers.pre_commit_hygiene},ci:${layers.ci_hygiene},pe:${layers.post_edit}`;
}

function renderEnvelope(verdict) {
  const lines = [
    'CODE_QUALITY_RESULT v1',
    `schema_version: ${ENVELOPE_SCHEMA}`,
    'status: advisory',
    `modified_files: ${verdict.scope.files.length > 0 ? verdict.scope.files.join(', ') : 'none'}`,
    `resolved_surface: ${verdict.resolved_surface.join(', ')}`,
    `checklists_loaded: ${verdict.checklists.length > 0 ? verdict.checklists.map((entry) => entry.file).join(', ') : 'none'}`,
    `checker_outputs: ${checkerOutputs(verdict)}`,
    `p0_p1_p2_decisions: ${PENDING}`,
    `accepted_deferrals: ${PENDING}`,
    'verification_handoff: workflow-verify.md',
    `remaining_accepted_risk: ${PENDING}`,
  ];
  return redactPrivate(lines.join('\n'), verdict.private_labels);
}

function renderText(verdict) {
  const out = [`${RUN_SCHEMA} gate=${verdict.gate} exit=${verdict.exit_code} status=advisory`];
  out.push(`scope: ${verdict.scope.mode}, lines ${verdict.scope.lines}, ${verdict.scope.files.length} file(s)`);
  out.push(`surfaces: ${verdict.resolved_surface.join(', ')}`);
  out.push(`layers: pre-commit ${verdict.layers.pre_commit_hygiene}, ci ${verdict.layers.ci_hygiene}, post-edit ${verdict.layers.post_edit}`);
  for (const error of verdict.errors.concat(verdict.config.errors)) out.push(`error ${error.code}: ${error.message} (repair: ${error.repair})`);
  out.push('checks:');
  for (const check of verdict.checks) {
    out.push(`  ${check.id} ${check.state} ${check.severity}${check.required ? ' required' : ''}${check.repair ? ` (${check.repair})` : ''}`);
  }
  out.push(`findings: ${verdict.findings.length}`);
  for (const entry of verdict.findings) {
    const where = entry.line ? `${entry.file}:${entry.line}` : entry.file;
    const flags = `${entry.severity} ${entry.confidence}${entry.blocking ? ' blocking' : ''} ${entry.origin}`;
    out.push(`  ${where} ${entry.rule} ${flags}: ${entry.reason}${entry.excerpt ? ` | ${entry.excerpt}` : ''}`);
  }
  out.push('checklists to load:');
  for (const entry of verdict.checklists) out.push(`  ${entry.file} (${entry.why})`);
  for (const entry of verdict.coverage.unchecked) out.push(`unchecked: ${entry.file} (${entry.reason})`);
  out.push(`judgment required: ${verdict.judgment_required.join(', ')}`);
  return out.join('\n');
}

function render(verdict, format) {
  if (format === 'envelope') return renderEnvelope(verdict);
  if (format === 'text') return renderText(verdict);
  const { private_labels: omitted, ...printable } = verdict;
  return JSON.stringify(printable, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function main(argv, { cwd = process.cwd(), env = process.env } = {}) {
  let options = null;
  try {
    options = parseArgs(argv);
    const context = buildContext(options, cwd, env);
    if (options.scope === 'explain') return { output: JSON.stringify(explain(context), null, 2), exitCode: GATE_EXIT.NOTHING_CHECKED, message: null };
    const verdict = runGate(context);
    return { output: render(verdict, options.format), exitCode: verdict.exit_code, message: null };
  } catch (error) {
    const verdict = errorVerdict(error, options);
    const format = options && options.scope !== 'explain' ? options.format : 'json';
    return { output: render(verdict, format), exitCode: GATE_EXIT.ERROR, message: `${verdict.errors[0].code}: ${error.message}` };
  }
}

// Module identity, never a path comparison, decides whether this file runs as the CLI,
// so a hub reached through a link still runs.
if (require.main === module) {
  const { output, exitCode, message } = main(process.argv.slice(2));
  process.stdout.write(`${output}\n`);
  if (message) process.stderr.write(`quality-gate: ${message}\n`);
  process.exitCode = exitCode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { decideGate, runDistAdapter };
