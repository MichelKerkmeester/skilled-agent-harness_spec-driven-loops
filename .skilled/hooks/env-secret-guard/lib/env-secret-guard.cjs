// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard Core (runtime-neutral policy)
// ───────────────────────────────────────────────────────────────────
// Keeps dotenv values out of the model's context. Decides whether a pending
// tool call reads or writes a dotenv file, and answers the three value-free
// questions an agent may ask instead: which keys exist, whether the syntax is
// valid, and a keyed HMAC fingerprint of one value. No function here returns a
// value or the pepper. Each adapter owns its own transport and output; this
// core writes neither stdout nor stderr.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'env-secret-guard';
const PEPPER_ENV = 'ENV_SECRET_GUARD_PEPPER';
const ALLOWED_TEMPLATE = '.env.example';
const MAX_DOTENV_BYTES = 1024 * 1024;
const CLI_HINT = 'node .skilled/hooks/env-secret-guard/cli/env-secret.cjs keys|validate|fingerprint <file> [KEY]';

// Tool names are compared lower-cased, so one set covers Claude's `Read` and
// Pi's `read`. Every runtime's file reader, writer, patcher and grep is here.
const FILE_TOOLS = new Set([
  'read', 'view', 'read_file',
  'write', 'edit', 'multiedit', 'notebookedit', 'delete',
  'patch', 'apply_patch', 'apply-patch',
  'grep',
]);
// Pi registers `powershell` in place of `bash` on Windows, and Devin names its
// shell `run-command` or `run_command` beside `exec`.
const SHELL_TOOLS = new Set(['bash', 'exec', 'shell', 'powershell', 'run-command', 'run_command']);
// The file tools that change a file, as opposed to reading or searching one.
const WRITE_TOOLS = new Set([
  'write', 'edit', 'multiedit', 'notebookedit', 'delete', 'patch', 'apply_patch', 'apply-patch',
]);
const DISABLE_ENV = 'SYSTEM_ENV_SECRET_GUARD_DISABLED';
const MASTER_DISABLE_ENV = 'SYSTEM_HOOKS_DISABLED';
// The guard's own code. An agent that can rewrite it can switch it off.
const GUARD_FOLDER = /(?:^|[\\/])hooks[\\/]env-secret-guard(?:[\\/]|$)/;
// The value-free CLI the refusal names; it is the one script allowed to take a dotenv file.
const GUARD_CLI = /(?:^|[\\/])hooks[\\/]env-secret-guard[\\/]cli[\\/]env-secret\.cjs$/;
const EVENT_LOG = ['.skilled', 'skills', '.state', 'env-secret-guard.log'];
const MAX_EVENT_LOG_BYTES = 256 * 1024;
// Programs whose first plain argument is the search pattern, not a file.
const PATTERN_FIRST = new Set(['grep', 'egrep', 'fgrep', 'rg', 'ag', 'select-string']);
// Of those, the ones whose `-f FILE` reads patterns from a file. ag's `-f` follows symlinks instead.
const PATTERN_FILE = new Set(['grep', 'egrep', 'fgrep', 'rg']);

// A shell command is refused only when one of these programs is handed a
// dotenv file, or a redirection points at one. Running an app that loads its
// own .env (`node --env-file=.env app.js`, `docker compose up`) stays allowed,
// because the values then never pass through the agent's output.
const READ_VERBS = new Set([
  'cat', 'tac', 'less', 'more', 'head', 'tail', 'bat', 'batcat', 'nl', 'od', 'xxd', 'hexdump', 'strings',
  'grep', 'egrep', 'fgrep', 'rg', 'ag', 'awk', 'gawk', 'sed', 'cut', 'sort', 'uniq', 'paste', 'column',
  'diff', 'cmp', 'comm', 'base64', 'cp', 'mv', 'scp', 'rsync', 'tee', 'dd', 'jq', 'yq',
  'vi', 'vim', 'nvim', 'nano', 'emacs', 'open', 'code', 'truncate', 'rm', 'ln', 'link',
  // PowerShell's own readers. Its command names ignore case, so verbs are compared lower-cased.
  'get-content', 'gc', 'type', 'select-string', 'copy-item', 'set-content', 'add-content',
]);
// Words that run the next word as the program, so `sudo cat .env` is judged as `cat`.
const PASS_THROUGH = new Set(['sudo', 'command', 'exec', 'nohup', 'time', 'env', 'xargs']);
// Options of those wrappers that take the following word as their value, so
// `sudo -u root cat .env` skips `root` and still finds `cat`.
const WRAPPER_VALUE_OPTIONS = {
  sudo: new Set(['-u', '-g', '-C', '-D', '-h', '-p', '-r', '-t', '-T', '-U', '--user', '--group', '--chdir']),
  env: new Set(['-u', '-C', '--unset', '--chdir']),
  xargs: new Set([
    '-I', '-n', '-P', '-L', '-d', '-E', '-s', '-a', '--arg-file', '--max-args', '--max-procs', '--delimiter',
  ]),
  time: new Set(['-f', '-o', '--format', '--output']),
};
// xargs reads its arguments from the file these options name.
// Words that open a compound command. The program follows them, so
// `if [ -f .env ]; then cat .env; fi` runs `cat` after `then`.
const SHELL_KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{', '(']);
const XARGS_FILE_OPTIONS = new Set(['-a', '--arg-file']);
// Shells whose `-c` argument is a script of its own, judged like the outer line.
const SCRIPT_SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish']);
// Interpreters whose inline code can open a file, with the options that carry that code.
const INLINE_CODE = {
  node: new Set(['-e', '-p', '--eval', '--print']),
  bun: new Set(['-e', '-p', '--eval', '--print']),
  deno: new Set(['eval']),
  python: new Set(['-c']),
  python3: new Set(['-c']),
  ruby: new Set(['-e']),
  perl: new Set(['-e', '-E']),
  php: new Set(['-r']),
};

// Keys an agent's tool input uses to name a file, across every runtime.
const PATH_KEY = /^(?:file_?path|filepath|path|paths|file|files|filename|target_file|target|notebook_path)$/i;
// Keys whose string value may hold an apply_patch body or a unified diff. A
// write tool's `content` is the text being written, so it is never read as a patch.
const PATCH_KEY = /^(?:patch|patchtext|patch_text|input|diff|command)$/i;
const DOTENV_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
// `${NAME}`, `${NAME:-default}` and the other default forms, capturing the name and the default.
const BRACED_VARIABLE = /\$\{([A-Za-z_][A-Za-z0-9_]*)(?::?[-=+?]([^}]*))?\}/g;
// Nesting limits. Real tool input and shell lines sit far below them; they only
// stop a hostile, deeply nested payload from recursing without bound.
const MAX_INPUT_DEPTH = 6;
const MAX_SHELL_NESTING = 4;
// Programs whose output is only their operands, so a substitution running one
// can be judged by what it prints without running it.
const PRODUCERS = new Set(['echo', 'printf', 'realpath', 'readlink', 'basename']);
// Stands in for a `$` the shell keeps literal; a control character no command
// line uses, so it never collides with a real word.
const LITERAL_DOLLAR = '\u0001';

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATH CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/** True when a base name is `.env` or `.env.<suffix>`, except the committed template. */
function isDotenvName(name) {
  if (typeof name !== 'string') return false;
  if (name === '.env') return true;
  return name.startsWith('.env.') && name !== ALLOWED_TEMPLATE;
}

/** The last segment of a path, split on both separators so `C:\repo\.env` reads as `.env` on any host. */
function baseName(candidate) {
  return candidate.split(/[\\/]/).pop();
}

/**
 * True when a path names a dotenv file, by its own name or, for an existing
 * symlink, by the name of the file it resolves to.
 * @param {string} candidate
 * @param {string} [cwd]
 */
function isDotenvPath(candidate, cwd = process.cwd()) {
  if (typeof candidate !== 'string' || !candidate.trim()) return false;
  const cleaned = candidate.trim().replace(/^['"]|['"]$/g, '');
  if (isDotenvName(baseName(cleaned))) return true;
  // A unified diff prefixes paths with `a/` or `b/`, but a real folder can carry
  // the same name, so the symlink check tries the path both as given and stripped.
  for (const variant of new Set([cleaned, cleaned.replace(/^[ab]\//, '')])) {
    try {
      if (isDotenvName(path.basename(fs.realpathSync.native(path.resolve(cwd, variant))))) return true;
    } catch {
      // A path that does not exist cannot be a symlink to a dotenv file.
    }
    if (isHardLinkToDotenv(path.resolve(cwd, variant), cwd)) return true;
  }
  return false;
}

/**
 * True when a file is a hard link to a dotenv file in its own folder or the
 * project root. A hard link carries any name, so only the file's identity
 * shows what it is.
 */
function isHardLinkToDotenv(file, cwd) {
  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return false;
  }
  if (!stat.isFile() || stat.nlink < 2) return false;
  for (const dir of new Set([path.dirname(file), path.resolve(cwd)])) {
    let names;
    try {
      names = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!isDotenvName(name)) continue;
      try {
        const other = fs.statSync(path.join(dir, name));
        if (other.ino === stat.ino && other.dev === stat.dev) return true;
      } catch {
        // A dotenv entry that cannot be read is not the same file.
      }
    }
  }
  return false;
}

/** Every path an apply_patch body or unified diff names, including rename targets. */
function pathsFromPatch(text) {
  if (typeof text !== 'string') return [];
  const paths = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\*\*\* (?:Add|Update|Delete) File:\s*(.+?)\s*$/)
      || line.match(/^\*\*\* Move to:\s*(.+?)\s*$/)
      || line.match(/^(?:---|\+\+\+) ([^\t ]+)/);
    if (match && match[1] !== '/dev/null') paths.push(match[1]);
  }
  return paths;
}

/**
 * Collect every file path a tool input names, at any depth.
 * @param {unknown} input - The tool's argument object.
 * @param {number} [depth] - Current nesting level; callers pass 0.
 * @returns {string[]}
 */
function pathsFromToolInput(input, depth = 0) {
  if (!input || typeof input !== 'object' || depth > MAX_INPUT_DEPTH) return [];
  const paths = [];
  for (const [key, value] of Object.entries(input)) {
    if (PATH_KEY.test(key)) {
      if (typeof value === 'string') paths.push(value);
      else if (Array.isArray(value)) paths.push(...value.filter((item) => typeof item === 'string'));
    } else if (PATCH_KEY.test(key) && typeof value === 'string') {
      paths.push(...pathsFromPatch(value));
    }
    if (value && typeof value === 'object') paths.push(...pathsFromToolInput(value, depth + 1));
  }
  return paths;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SHELL COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split a command line into simple commands, each a list of words, the way the
 * shell does: `|`, `;`, `&` and newlines inside quotes are text, and quotes and
 * backslashes are removed where they sit, so `.e"nv"` and `.en\v` both become
 * `.env`. A pattern such as `"API_KEY|PORT"` therefore stays one word.
 * PowerShell escapes with a backtick, so there a backslash is a path separator.
 * @param {string} command
 * @param {string} [escape] - The escape character: `\` for POSIX shells, `` ` `` for PowerShell.
 */
function simpleCommands(command, escape = '\\') {
  const commands = [];
  let words = [];
  let word = null;
  let quote = null;
  const endWord = () => {
    if (word !== null) words.push(word);
    word = null;
  };
  const endCommand = () => {
    endWord();
    if (words.length) commands.push(words);
    words = [];
  };
  // A `$` the shell keeps literal, inside single quotes or escaped, is held as
  // LITERAL_DOLLAR so expandVariables never expands it.
  const literal = (ch) => (ch === '$' ? LITERAL_DOLLAR : ch);
  for (let i = 0; i < command.length; i += 1) {
    const c = command[i];
    if (quote === "'") {
      if (c === "'") quote = null;
      else word += literal(c);
    } else if (quote === '"') {
      if (c === '"') quote = null;
      else if (c === escape && i + 1 < command.length) word += literal(command[++i]);
      else word += c;
    } else if (c === "'" || c === '"') {
      quote = c;
      word = word ?? '';
    } else if (c === escape && i + 1 < command.length) {
      word = (word ?? '') + literal(command[++i]);
    } else if (c === '|' || c === ';' || c === '&' || c === '\n') {
      endCommand();
    } else if (c === ')' || (c === '(' && !(i > 0 && '$<>'.includes(command[i - 1])))) {
      // A subshell's parentheses bound a command: `(cat .env)` runs `cat`.
      endCommand();
    } else if (/\s/.test(c)) {
      endWord();
    } else {
      word = (word ?? '') + c;
    }
  }
  endCommand();
  return commands;
}

/**
 * The bodies of every command substitution in a command line: `$(...)`,
 * backticks and the process substitutions `<(...)` and `>(...)`. The shell
 * runs each body as its own command, so each is judged as one.
 */
function substitutionBodies(command, escape = '\\') {
  return substitutionSpans(command, escape).map((span) => span.body);
}

/**
 * Every command substitution in a command line with its position: `start` is
 * the index of its `$`, `<`, `>` or opening backtick and `end` the index just
 * past its close. `kind` is `$` for `$(...)` and backticks, else `<` or `>`.
 */
function substitutionSpans(command, escape = '\\') {
  const bodies = [];
  let quote = null;
  for (let i = 0; i < command.length; i += 1) {
    const c = command[i];
    if (quote === "'") {
      if (c === "'") quote = null;
      continue;
    }
    if (c === escape) {
      i += 1;
      continue;
    }
    if (c === "'" && quote === null) {
      quote = "'";
    } else if (c === '"') {
      quote = quote === '"' ? null : '"';
    } else if (c === '`') {
      const end = command.indexOf('`', i + 1);
      if (end < 0) break;
      bodies.push({ body: command.slice(i + 1, end), start: i, end: end + 1, kind: '$' });
      i = end;
    } else if (c === '(' && i > 0 && '$<>'.includes(command[i - 1])) {
      let depth = 1;
      let j = i + 1;
      for (; j < command.length && depth > 0; j += 1) {
        if (command[j] === '(') depth += 1;
        else if (command[j] === ')') depth -= 1;
      }
      bodies.push({ body: command.slice(i + 1, depth === 0 ? j - 1 : j), start: i - 1, end: j, kind: command[i - 1] });
      i = j - 1;
    }
  }
  return bodies;
}

/**
 * The text a substitution prints when its body is a program that only echoes
 * its operands, such as `echo .env` or `printf %s .env`, else null. Anything
 * else would have to run before its output is known, so it is not guessed.
 */
function producedText(body, escape, depth) {
  const commands = simpleCommands(expandProducers(body, escape, depth + 1), escape);
  if (commands.length !== 1) return null;
  const [program, ...args] = commands[0];
  const verb = baseName(program).toLowerCase();
  if (!PRODUCERS.has(verb)) return null;
  const operands = args.filter((word) => !word.startsWith('-'));
  if (verb === 'printf') {
    return operands.length > 1 && operands[0].includes('%') ? operands.slice(1).join('') : (operands[0] ?? '');
  }
  return operands.join(' ');
}

/**
 * The command line with every `$(...)` and backtick that only echoes text
 * replaced by that text, so `f=$(printf .env); cat "$f"` is judged as
 * `f=.env; cat "$f"`. The text is escaped character by character, which holds
 * inside and outside double quotes; whitespace stays bare so it still splits
 * words where the shell would.
 */
function expandProducers(command, escape = '\\', depth = 0) {
  if (depth > MAX_SHELL_NESTING) return command;
  let result = '';
  let last = 0;
  for (const span of substitutionSpans(command, escape)) {
    if (span.kind !== '$') continue;
    const text = producedText(span.body, escape, depth);
    if (text === null) continue;
    const escaped = [...text].map((ch) => (/[\w./$\s-]/.test(ch) ? ch : escape + ch)).join('');
    result += command.slice(last, span.start) + escaped;
    last = span.end;
  }
  return result + command.slice(last);
}

/**
 * Replace `$NAME`, `${NAME}` and `${NAME:-default}` the way the shell would,
 * using the assignments seen earlier in the same command line. An unknown
 * variable becomes empty, so `$HOME/.env` is still judged as `/.env`.
 */
function expandVariables(word, vars) {
  return restoreDollar(word
    .replace(BRACED_VARIABLE, (_, name, fallback) => vars.get(name) ?? fallback ?? '')
    .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => vars.get(name) ?? ''));
}

/** A word with each literal `$` held by simpleCommands put back. */
function restoreDollar(word) {
  return word.split(LITERAL_DOLLAR).join('$');
}

/** A shell glob as a regular expression over one path segment. */
function globRegex(glob) {
  let source = '';
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === '*') source += '[^/]*';
    else if (c === '?') source += '[^/]';
    else if (c === '[') {
      const end = glob.indexOf(']', i + 2);
      if (end < 0) {
        source += '\\[';
        continue;
      }
      const body = glob.slice(i + 1, end).replace(/^!/, '^').replace(/\\/g, '\\\\');
      source += `[${body}]`;
      i = end;
    } else source += c.replace(/[.+^${}()|\\]/g, '\\$&');
  }
  return new RegExp(`^${source}$`);
}

/**
 * True when a glob can expand to a dotenv file. The shell matches a leading
 * dot only when the glob spells it, so only a glob that starts with `.` can.
 * A glob that could match `.env` itself is refused even when the listed
 * directory has none: an earlier `cd` in the same line can move the shell to
 * a directory the guard never lists, so the listing is a second check only.
 */
function globMatchesDotenv(value, cwd) {
  const base = baseName(value);
  if (!base.startsWith('.')) return false;
  const pattern = globRegex(base);
  if (pattern.test('.env')) return true;
  const dir = value.slice(0, value.length - base.length) || '.';
  try {
    return fs.readdirSync(path.resolve(cwd, dir)).some((name) => isDotenvName(name) && pattern.test(name));
  } catch {
    return false;
  }
}

/** True when a shell word, or the value after `=` in `--flag=` or `if=`, names a dotenv file or a dotenv glob. */
function wordIsDotenv(word, cwd, vars = new Map()) {
  const expanded = expandVariables(word, vars);
  const value = expanded.includes('=') ? expanded.slice(expanded.indexOf('=') + 1) : expanded;
  // A glob is judged by what it can expand to, never by its literal text.
  if (/[*?[]/.test(value)) return globMatchesDotenv(value, cwd);
  return isDotenvPath(value, cwd);
}

/**
 * The arguments a reading program treats as files. For grep and its kin the
 * first plain argument is the pattern, unless `-e` or `--regexp` supplied one,
 * so `grep -n .env README.md` reads README.md and is allowed. `-f FILE` reads
 * its patterns from FILE, so that word is a file the program opens.
 */
function fileArguments(verb, args) {
  if (!PATTERN_FIRST.has(verb)) return args;
  const patternFile = PATTERN_FILE.has(verb);
  const files = [];
  let patternGiven = false;
  for (let i = 0; i < args.length; i += 1) {
    const word = args[i];
    if (patternFile && (word === '-f' || word === '--file')) {
      if (i + 1 < args.length) files.push(args[i + 1]);
      patternGiven = true;
      i += 1;
    } else if (patternFile && /^(?:--file=|-f.)/.test(word)) {
      files.push(word.startsWith('--file=') ? word.slice('--file='.length) : word.slice(2));
      patternGiven = true;
    } else if (/^--(?:exclude|exclude-dir|include|glob|iglob)(?:=|$)/.test(word) || word === '-g') {
      // A filter on which files to search, never a file the program opens.
      if (!word.includes('=')) i += 1;
    } else if (word === '-e' || word === '--regexp' || word === '-Pattern') {
      patternGiven = true;
      i += 1;
    } else if (word === '-Path' || word === '-LiteralPath') {
      if (i + 1 < args.length) files.push(args[i + 1]);
      i += 1;
    } else if (/^(?:-e.+|--regexp=)/.test(word)) {
      patternGiven = true;
    } else if (word.startsWith('-')) {
      files.push(word);
    } else if (!patternGiven) {
      patternGiven = true;
    } else {
      files.push(word);
    }
  }
  return files;
}

/** The dotenv name inline interpreter code mentions, such as `readFileSync('.env')`, or null. */
function dotenvNamedInCode(code) {
  for (const match of String(code).matchAll(/(^|[^\w.-])(\.env(?:\.[\w.-]+)?)(?![\w-])/g)) {
    const name = match[2].replace(/\.$/, '');
    if (isDotenvName(name)) return name;
  }
  return null;
}

/**
 * The program a simple command runs and the index of its first argument.
 * Assignments, wrappers such as `sudo` and `env`, and each wrapper's options
 * and their values are skipped, so `sudo -u root cat .env` runs `cat`.
 * `xargs -a FILE` reads FILE itself, so that file is returned as a hit.
 */
function resolveProgram(words, cwd, vars) {
  let index = 0;
  while (index < words.length) {
    const word = words[index];
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(word) || SHELL_KEYWORDS.has(word)) {
      index += 1;
      continue;
    }
    if (!PASS_THROUGH.has(word)) break;
    const valueOptions = WRAPPER_VALUE_OPTIONS[word] || new Set();
    const wrapper = word;
    index += 1;
    while (index < words.length && words[index].startsWith('-')) {
      const option = words[index];
      if (option === '--') {
        index += 1;
        break;
      }
      const inline = option.match(/^(--[^=]+)=(.*)$/);
      if (wrapper === 'xargs' && inline && XARGS_FILE_OPTIONS.has(inline[1]) && wordIsDotenv(inline[2], cwd, vars)) {
        return { hit: inline[2] };
      }
      if (valueOptions.has(option)) {
        const value = words[index + 1];
        const readsFile = wrapper === 'xargs' && XARGS_FILE_OPTIONS.has(option);
        if (readsFile && value && wordIsDotenv(value, cwd, vars)) return { hit: value };
        index += 2;
      } else {
        index += 1;
      }
    }
  }
  return { index };
}

/** The command line `env -S "..."` or `env --split-string=...` runs, or null. */
function envSplitString(words) {
  const at = words.findIndex((word) => baseName(word) === 'env');
  if (at < 0) return null;
  for (let i = at + 1; i < words.length && words[i].startsWith('-'); i += 1) {
    const word = words[i];
    if (word === '-S' || word === '--split-string') return words[i + 1] ?? null;
    if (word.startsWith('--split-string=')) return word.slice('--split-string='.length);
    if (/^-[A-Za-z]*S./.test(word)) return word.slice(word.indexOf('S') + 1);
  }
  return null;
}

/**
 * The command line an argv array runs. `['bash', '-lc', 'cat .env']` runs its
 * script argument, so that is what gets judged, not the shell's own name.
 */
function argvScript(argv) {
  const words = argv.filter((word) => typeof word === 'string');
  const flag = words.findIndex((word) => /^-[A-Za-z]*c$/.test(word));
  return flag >= 0 && flag + 1 < words.length ? words[flag + 1] : words.join(' ');
}

/**
 * The dotenv path a shell command reads or redirects into, or null.
 * @param {string|string[]} command - A command string, or an argv array as Codex sends it.
 * @param {string} [cwd] - Directory relative paths and globs resolve against.
 * @param {number} [depth] - Nesting level of a substitution or `-c` script; callers pass 0.
 * @param {{powershell?: boolean}} [options] - `powershell` makes the backtick the escape character.
 * @returns {string|null} The word or name that targets a dotenv file.
 */
function shellDotenvTarget(command, cwd = process.cwd(), depth = 0, { powershell = false } = {}) {
  const text = Array.isArray(command) ? argvScript(command) : command;
  // No substring pre-filter: the shell joins `.e"nv"` into `.env` only after tokenizing.
  if (typeof text !== 'string' || !text || depth > MAX_SHELL_NESTING) return null;
  const escape = powershell ? '`' : '\\';
  for (const body of substitutionBodies(text, escape)) {
    const hit = shellDotenvTarget(body, cwd, depth + 1, { powershell });
    if (hit) return hit;
  }
  // `f=.env; cat "$f"` reads the file through a variable, so every assignment
  // in the line is remembered before any word is judged.
  const vars = new Map();
  const commands = simpleCommands(expandProducers(text, escape), escape);
  for (const words of commands) {
    for (const word of words) {
      const assignment = word.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (assignment) vars.set(assignment[1], expandVariables(assignment[2], vars));
    }
  }
  for (const words of commands) {
    for (let i = 0; i < words.length; i += 1) {
      const redirect = words[i].match(/^\d*(?:<|>>?)(.*)$/);
      if (!redirect) continue;
      const target = redirect[1] || words[i + 1];
      if (target && wordIsDotenv(target, cwd, vars)) return target;
    }
    // `for f in .env; do cat "$f"; done` hands the file to the loop body by name.
    if (words[0] === 'for' && words[2] === 'in') {
      const looped = words.slice(3).find((word) => wordIsDotenv(word, cwd, vars));
      if (looped) return looped;
    }
    const split = envSplitString(words);
    const splitHit = split ? shellDotenvTarget(restoreDollar(split), cwd, depth + 1) : null;
    if (splitHit) return splitHit;
    const program = resolveProgram(words, cwd, vars);
    if (program.hit) return program.hit;
    const { index } = program;
    const verb = baseName(words[index] || '').toLowerCase();
    const args = words.slice(index + 1);
    if (INLINE_CODE[verb] || SCRIPT_SHELLS.has(verb)) {
      // A here-document feeds the interpreter its program on stdin, so the
      // program is in the command text: `python3 - <<'PY' ... open('.env')`.
      const fed = /<<-?\s*['"\\]?\w/.test(text) ? dotenvNamedInCode(restoreDollar(text)) : null;
      if (fed) return fed;
    }
    if (SCRIPT_SHELLS.has(verb)) {
      const flag = args.findIndex((word) => /^-[A-Za-z]*c$/.test(word));
      const script = flag >= 0 && args[flag + 1] ? restoreDollar(args[flag + 1]) : null;
      const hit = script ? shellDotenvTarget(script, cwd, depth + 1) : null;
      if (hit) return hit;
      // `bash -c 'cat "$1"' _ .env` hands the file to the script as an argument.
      // `bash append.sh .env` hands it to a script file the same way.
      const rest = script ? args.slice(flag + 2) : args.filter((word) => !word.startsWith('-'));
      const passed = rest.find((word) => wordIsDotenv(word, cwd, vars));
      if (passed) return passed;
      continue;
    }
    if (INLINE_CODE[verb]) {
      const flag = args.findIndex((word) => INLINE_CODE[verb].has(word));
      const named = flag >= 0 && args[flag + 1] ? dotenvNamedInCode(restoreDollar(args[flag + 1])) : null;
      if (named) return named;
      // Inline code can open any file it is handed, so `node -e '...' .env`
      // counts even though the code never names the file.
      // A script file is code too, so `node append.js .env` counts the same
      // way. Only the interpreter's own options, such as `--env-file=.env`,
      // and the guard's own value-free CLI, are left alone when there is no inline code.
      const passed = flag >= 0
        ? args.find((word, i) => i !== flag + 1 && wordIsDotenv(word, cwd, vars))
        : !GUARD_CLI.test(args.find((word) => !word.startsWith('-')) ?? '')
          && args.find((word, i) => !word.startsWith('-') && args[i - 1] !== '--env-file' && wordIsDotenv(word, cwd, vars));
      if (passed) return passed;
      continue;
    }
    if (!READ_VERBS.has(verb)) continue;
    const hit = fileArguments(verb, args).find((word) => wordIsDotenv(word, cwd, vars));
    if (hit) return hit;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. POLICY EVALUATION (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

function refusal(target, extraHint) {
  const hint = extraHint ? `${extraHint}, or run ${CLI_HINT}` : `run ${CLI_HINT}`;
  return `env-secret-guard: ${target} is a dotenv file and its values must not reach the model. `
    + `To inspect it without values, ${hint}.`;
}

/**
 * Decide whether a pending tool call may run.
 * @param {{tool: string, input: unknown, cwd?: string, hint?: string}} request
 *   `hint` names runtime-native tools the refusal should mention first.
 * @returns {{decision: 'allow'|'deny', reason: string|null}}
 */
function evaluateToolCall({ tool, input, cwd = process.cwd(), hint } = {}) {
  const allow = { decision: 'allow', reason: null };
  const name = String(tool || '').toLowerCase();
  const deny = (reason) => {
    recordEvent(cwd, `${name}: ${reason}`);
    return { decision: 'deny', reason };
  };
  if (SHELL_TOOLS.has(name)) {
    const command = input && typeof input === 'object'
      ? (input.command ?? input.cmd ?? input.script ?? input.code ?? input.input)
      : input;
    const powershell = name === 'powershell';
    for (const candidate of [command, ...wrappedShellCommands(command)]) {
      const target = shellDotenvTarget(candidate, cwd, 0, { powershell });
      if (target) return deny(refusal(target, hint));
    }
    const guarded = shellGuardFolderTarget(command, powershell);
    return guarded ? deny(guardFolderRefusal(guarded)) : allow;
  }
  if (!FILE_TOOLS.has(name)) return allow;
  const paths = pathsFromToolInput(input);
  const target = paths.find((candidate) => isDotenvPath(candidate, cwd));
  if (target) return deny(refusal(target, hint));
  const guarded = WRITE_TOOLS.has(name) ? paths.find((candidate) => GUARD_FOLDER.test(candidate)) : null;
  return guarded ? deny(guardFolderRefusal(guarded)) : allow;
}

/**
 * The shell commands inside a code-mode tool call. Codex sends its `exec` tool
 * a small JavaScript program such as `tools.exec_command({cmd: "cat .env"})`,
 * so the command the shell runs is a string literal inside that program.
 */
function wrappedShellCommands(code) {
  if (typeof code !== 'string' || !code.includes('exec_command')) return [];
  const commands = [];
  for (const match of code.matchAll(/["']?\b(?:cmd|command)["']?\s*:\s*("(?:[^"\\]|\\.)*")/g)) {
    try {
      commands.push(JSON.parse(match[1]));
    } catch {
      // A literal that is not valid JSON is left to the plain text check.
    }
  }
  return commands;
}

function guardFolderRefusal(target) {
  return `env-secret-guard: ${target} is part of the guard itself and an agent may not change it. `
    + `A person can, or can start the session with ${DISABLE_ENV}=1 to work on the guard.`;
}

/** The guard file a shell command redirects output into, or null. Reading the guard's code stays allowed. */
function shellGuardFolderTarget(command, powershell) {
  const text = Array.isArray(command) ? argvScript(command) : command;
  if (typeof text !== 'string' || !text) return null;
  for (const words of simpleCommands(text, powershell ? '`' : '\\')) {
    for (let i = 0; i < words.length; i += 1) {
      const redirect = words[i].match(/^\d*>>?(.*)$/);
      const target = redirect ? restoreDollar(redirect[1] || words[i + 1] || '') : '';
      if (target && GUARD_FOLDER.test(target)) return target;
    }
  }
  return null;
}

/**
 * True unless the guard was switched off for this process. The switch is read
 * from the environment only: a flags file in the checkout is one an agent can
 * write, and a guard the agent can switch off guards nothing.
 * @param {NodeJS.ProcessEnv} [env]
 */
function isGuardEnabled(env = process.env) {
  const on = (value) => typeof value === 'string' && /^(?:1|true|yes|on)$/i.test(value.trim());
  return !on(env[DISABLE_ENV]) && !on(env[MASTER_DISABLE_ENV]);
}

/**
 * Append one line to the guard's event log in the project's runtime-state
 * folder, when the project has one. The line holds a tool name and a path,
 * never a value. A logging failure is swallowed: it must not change a decision.
 */
function recordEvent(cwd, line) {
  try {
    const state = path.join(path.resolve(cwd), ...EVENT_LOG.slice(0, 3));
    if (!fs.existsSync(state)) return;
    const logPath = path.join(state, EVENT_LOG[3]);
    try {
      if (fs.statSync(logPath).size >= MAX_EVENT_LOG_BYTES) fs.renameSync(logPath, `${logPath}.1`);
    } catch {
      // A missing log is the normal first-write case.
    }
    fs.appendFileSync(logPath, `${new Date().toISOString()} ${String(line).replace(/\s+/g, ' ').slice(0, 400)}\n`);
  } catch {
    // Swallowed on purpose, see above.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VALUE-FREE INSPECTION
// ─────────────────────────────────────────────────────────────────────────────

/** The index of the quote that closes a quoted dotenv value, or -1. Only a double quote honours backslash escapes. */
function closingQuote(body, quote) {
  for (let i = 0; i < body.length; i += 1) {
    if (quote === '"' && body[i] === '\\') i += 1;
    else if (body[i] === quote) return i;
  }
  return -1;
}

/**
 * Parse dotenv text into entries and the 1-based line numbers that fail to
 * parse, the way dotenv reads it: a quoted value may span lines, may be
 * followed by a `#` comment, and a double-quoted value expands `\n` and `\r`.
 * @param {string} text
 * @returns {{entries: {key: string, value: string}[], invalidLines: number[]}}
 */
function parseDotenv(text) {
  const entries = [];
  const invalidLines = [];
  const lines = String(text).split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line || line.startsWith('#')) continue;
    const assignment = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!assignment) {
      invalidLines.push(index + 1);
      continue;
    }
    const value = assignment[2];
    const quote = value[0];
    if (quote !== '"' && quote !== "'" && quote !== '`') {
      entries.push({ key: assignment[1], value: value.replace(/\s+#.*$/, '').trim() });
      continue;
    }
    const start = index;
    let body = value.slice(1);
    let close = closingQuote(body, quote);
    while (close < 0 && index + 1 < lines.length) {
      index += 1;
      body += `\n${lines[index]}`;
      close = closingQuote(body, quote);
    }
    // Only a `#` comment may follow the closing quote. An unclosed quote marks
    // its own line invalid and leaves the lines after it to be read normally.
    if (close < 0 || !/^\s*(?:#.*)?$/.test(body.slice(close + 1).split('\n')[0])) {
      invalidLines.push(start + 1);
      index = start;
      continue;
    }
    const raw = body.slice(0, close);
    entries.push({ key: assignment[1], value: quote === '"' ? raw.replace(/\\n/g, '\n').replace(/\\r/g, '\r') : raw });
  }
  return { entries, invalidLines };
}

/**
 * Resolve a file an inspection request names. Only a dotenv file or the
 * template may be inspected, and only inside the project directory.
 * @returns {string|null} The absolute path, or null when the request is refused.
 */
function resolveInspectable(filePath, cwd) {
  if (typeof filePath !== 'string' || !filePath.trim()) return null;
  let root;
  let real;
  try {
    root = fs.realpathSync.native(path.resolve(cwd));
    real = fs.realpathSync.native(path.resolve(root, filePath.trim()));
  } catch {
    return null;
  }
  const relative = path.relative(root, real);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  const base = path.basename(real);
  return isDotenvName(base) || base === ALLOWED_TEMPLATE ? real : null;
}

function readInspectable(filePath, cwd) {
  const resolved = resolveInspectable(filePath, cwd);
  if (!resolved) return { error: 'Refused: not a dotenv file inside the project.' };
  try {
    // A FIFO would block the synchronous read forever and a huge file would
    // exhaust the host, and both run inside the agent's own process.
    const stat = fs.statSync(resolved);
    if (!stat.isFile()) return { error: 'Refused: not a regular file.' };
    if (stat.size > MAX_DOTENV_BYTES) return { error: 'Refused: the dotenv file is too large to inspect.' };
    return { parsed: parseDotenv(fs.readFileSync(resolved, 'utf8')) };
  } catch {
    return { error: 'Unable to read the dotenv file.' };
  }
}

/**
 * The keys a dotenv file defines, never their values.
 * @param {string} filePath
 * @param {string} [cwd]
 * @returns {{ok: true, keys: string[], valid: boolean} | {ok: false, error: string}}
 */
function listKeys(filePath, cwd = process.cwd()) {
  const { parsed, error } = readInspectable(filePath, cwd);
  if (error) return { ok: false, error };
  return { ok: true, keys: parsed.entries.map(({ key }) => key), valid: parsed.invalidLines.length === 0 };
}

/**
 * Whether every line parses, with the line numbers that do not.
 * @param {string} filePath
 * @param {string} [cwd]
 * @returns {{ok: true, valid: boolean, invalidLines: number[]} | {ok: false, error: string}}
 */
function validate(filePath, cwd = process.cwd()) {
  const { parsed, error } = readInspectable(filePath, cwd);
  if (error) return { ok: false, error };
  return { ok: true, valid: parsed.invalidLines.length === 0, invalidLines: parsed.invalidLines };
}

/**
 * HMAC-SHA256 of one key's value, keyed by the pepper in the environment.
 * Two equal digests mean equal values. Without the pepper a digest of a short
 * secret could be brute-forced, so no pepper means no digest.
 * @param {string} filePath
 * @param {string} key
 * @param {string} [cwd]
 * @param {Record<string, string|undefined>} [env] - Where the pepper is read from.
 * @returns {{ok: true, key: string, algorithm: 'hmac-sha256', fingerprint: string} | {ok: false, error: string}}
 */
function fingerprint(filePath, key, cwd = process.cwd(), env = process.env) {
  if (typeof key !== 'string' || !DOTENV_KEY.test(key)) return { ok: false, error: 'Refused: invalid key name.' };
  const pepper = env[PEPPER_ENV];
  if (!pepper) return { ok: false, error: `Fingerprint unavailable: set ${PEPPER_ENV} in the environment.` };
  const { parsed, error } = readInspectable(filePath, cwd);
  if (error) return { ok: false, error };
  // dotenv keeps the last of a repeated key, so the fingerprint does too.
  const entry = parsed.entries.filter((candidate) => candidate.key === key).pop();
  if (!entry) return { ok: false, error: 'Key not found.' };
  const digest = crypto.createHmac('sha256', pepper).update(entry.value).digest('hex');
  // No length: an exact length narrows an offline search for a short secret.
  return { ok: true, key, algorithm: 'hmac-sha256', fingerprint: digest };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CONCERN,
  PEPPER_ENV,
  DISABLE_ENV,
  SHELL_TOOLS,
  evaluateToolCall,
  isGuardEnabled,
  recordEvent,
  isDotenvName,
  isDotenvPath,
  pathsFromToolInput,
  shellDotenvTarget,
  parseDotenv,
  listKeys,
  validate,
  fingerprint,
};
