#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Wiring Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor diagnostic for the prompt hook entry each runtime loads.
//
// WHY THIS EXISTS: the skill advisor reaches a first prompt only through the hook
// entry a runtime fires before the model sees that prompt. A runtime folder can be
// installed while its hook file is missing, its JSON is unreadable, or the entry
// was never added, and then the advisor is silent with no error at session start.
// This check names the runtime and the file to repair.
//
// Never writes. Exit 0 when every installed runtime carries its entry, 1 when one
// is missing, 2 on a bad argument or a missing root.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = [
  'Usage: hook-wiring-check.cjs --root <dir> [--json]',
  '  --root  check the checkout under <dir>.',
  '  --json  print one JSON object instead of one line per runtime.',
].join('\n');

// Each entry names the runtime folder that decides whether the check applies,
// the hook file inside it, the event that carries the prompt entry, and the path
// fragment whose presence proves the entry is wired. A runtime folder that is
// absent is skipped, because that runtime was never installed in this checkout.
// A `toml` entry is read line by line, because the repository installs no TOML parser.
const RUNTIMES = [
  {
    id: 'claude',
    dir: '.claude',
    file: '.claude/settings.json',
    event: 'UserPromptSubmit',
    marker: 'hooks/claude/user-prompt-submit.js',
  },
  {
    id: 'codex',
    dir: '.codex',
    file: '.codex/hooks.json',
    event: 'UserPromptSubmit',
    marker: 'hooks/codex/user-prompt-submit.js',
  },
  {
    id: 'cursor',
    dir: '.cursor',
    file: '.cursor/hooks.json',
    event: 'beforeSubmitPrompt',
    marker: 'hooks/cursor/user-prompt-submit.js',
  },
  {
    id: 'devin',
    dir: '.devin',
    file: '.devin/hooks.v1.json',
    event: 'UserPromptSubmit',
    marker: 'hooks/devin/user-prompt-submit.js',
  },
  {
    id: 'vibe',
    dir: '.vibe',
    file: '.vibe/hooks.toml',
    event: 'pre_agent',
    marker: 'hooks/session-lifecycle/vibe/turn-start.mjs',
    format: 'toml',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(message) {
  process.stderr.write(`hook-wiring-check: ${message}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { root: null, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--root') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) fail(`--root needs a directory\n${USAGE}`);
      opts.root = path.resolve(value);
      i += 1;
    } else {
      fail(`unknown argument: ${arg}\n${USAGE}`);
    }
  }
  if (!opts.root) fail(`--root is required\n${USAGE}`);
  if (!fs.existsSync(opts.root) || !fs.statSync(opts.root).isDirectory()) {
    fail(`root not found: ${opts.root}`);
  }
  return opts;
}

// Hook files either wrap their events in a `hooks` object or place them at the
// top level, and the cursor file omits the nested hook array the others carry.
// A mention is not a wired hook, so only a command that runs the script counts:
// the event's entries and their nested hooks arrays are walked for command
// entries, and a runtime is wired when one starts node on the marker path.
function eventPayload(document, event) {
  if (!document || typeof document !== 'object') return undefined;
  if (document.hooks && typeof document.hooks === 'object' && event in document.hooks) {
    return document.hooks[event];
  }
  if (event in document) return document[event];
  return undefined;
}

// A shell groups quoted text into one word and ends a simple command at an
// operator that stands outside quotes, even one stuck to the word before it.
// Reading the words first keeps an echo of a quoted script a mention, because a
// quoted word is only an argument unless a shell is told to run it.
function readWords(command) {
  const words = [];
  let text = '';
  let started = false;

  function flush() {
    if (!started) return;
    words.push({ text, separator: false });
    text = '';
    started = false;
  }

  for (let i = 0; i < command.length; i += 1) {
    const char = command[i];
    if (char === "'" || char === '"') {
      started = true;
      i += 1;
      // A shell refuses a line whose quote never closes, so nothing in it runs.
      if (command.indexOf(char, i) === -1) return [];
      while (i < command.length && command[i] !== char) {
        if (char === '"' && command[i] === '\\' && i + 1 < command.length) {
          text += command[i + 1];
          i += 2;
        } else {
          text += command[i];
          i += 1;
        }
      }
      continue;
    }
    if (char === '\\') {
      // A backslash before a line break joins the two lines and adds nothing.
      if (command[i + 1] === '\n') {
        i += 1;
      } else if (i + 1 < command.length) {
        text += command[i + 1];
        started = true;
        i += 1;
      }
      continue;
    }
    // A comment runs from an unquoted # at the start of a word to the line end.
    if (char === '#' && !started) {
      while (i + 1 < command.length && command[i + 1] !== '\n') i += 1;
      continue;
    }
    if (char === '\n') {
      flush();
      words.push({ text: char, separator: true });
      continue;
    }
    const pair = command.slice(i, i + 2);
    if (pair === '&&' || pair === '||') {
      flush();
      words.push({ text: pair, separator: true });
      i += 1;
      continue;
    }
    if (char === ';' || char === '|' || char === '&' || char === '(' || char === ')') {
      flush();
      words.push({ text: char, separator: true });
      continue;
    }
    if (/\s/.test(char)) {
      flush();
      continue;
    }
    text += char;
    started = true;
  }
  flush();
  return words;
}

function simpleCommands(words) {
  const commands = [];
  let current = [];
  for (const word of words) {
    if (word.separator) {
      if (current.length > 0) commands.push(current);
      current = [];
    } else {
      current.push(word);
    }
  }
  if (current.length > 0) commands.push(current);
  return commands;
}

function collectCommands(node, commands) {
  if (Array.isArray(node)) {
    for (const entry of node) collectCommands(entry, commands);
  } else if (node && typeof node === 'object') {
    if (node.type === 'command' && typeof node.command === 'string') commands.push(node.command);
    if (Array.isArray(node.hooks)) collectCommands(node.hooks, commands);
  }
  return commands;
}

// A TOML hook file groups its entries under `[[hooks]]` headers rather than a
// JSON key, and no TOML parser is installed here, so each block is read line by
// line. A commented line names nothing that runs, so it is skipped. A basic
// string value escapes the quote and backslash after it, so both are unescaped.
function tomlCommands(text, event) {
  const blocks = [];
  let current = null;
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '[[hooks]]') {
      current = {};
      blocks.push(current);
      continue;
    }
    if (current === null || trimmed.startsWith('#')) continue;
    const entry = /^(type|command)\s*=\s*"(.*)"$/.exec(trimmed);
    if (!entry) continue;
    current[entry[1]] = entry[2].replace(/\\(["\\])/g, '$1');
  }
  return blocks
    .filter((block) => block.type === event && typeof block.command === 'string')
    .map((block) => block.command);
}

const ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/;

// Flags whose next word is their own argument, so that word is not the command.
const ENV_FLAGS_WITH_ARGUMENT = new Set(['-u', '--unset', '-C', '--chdir']);
const NODE_FLAGS_WITH_ARGUMENT = new Set([
  '-r', '--require', '--import', '--loader', '--experimental-loader', '-C', '--conditions',
]);
// Flags that make node do something other than run the script it is given.
const NODE_FLAGS_WITHOUT_RUN = new Set([
  '-c', '--check', '-e', '--eval', '-p', '--print', '-v', '--version', '-h', '--help',
]);
// A flag can carry its value in the same word, after an equals sign for a long
// flag and directly after the letter for a short one, so the name is read first.
function nodeFlagSkipsScript(flag) {
  if (flag.startsWith('--')) return NODE_FLAGS_WITHOUT_RUN.has(flag.split('=')[0]);
  if (NODE_FLAGS_WITHOUT_RUN.has(flag)) return true;
  // A short preload flag takes the rest of its word as the module name.
  if (/^-[rC]/.test(flag)) return false;
  return /^-[a-zA-Z]*[cepvh]/.test(flag);
}

// Words that open a group or hand over the shell and leave the command after them.
const COMMAND_PREFIXES = new Set(['{', 'exec', 'command', 'nohup', 'time', 'then', 'do', 'else']);

function isNodeExecutable(token) {
  return token === 'node' || token.endsWith('/node');
}

function isEnvExecutable(token) {
  return token === 'env' || token.endsWith('/env');
}

function isShellExecutable(token) {
  return ['bash', 'sh', 'zsh'].some((name) => token === name || token.endsWith(`/${name}`));
}

// env launches the command after its own assignments and flags, so those words
// say nothing about what runs. The same holds for a leading assignment.
function commandWords(words) {
  let index = 0;
  while (index < words.length && COMMAND_PREFIXES.has(words[index].text)) index += 1;
  while (index < words.length && ASSIGNMENT.test(words[index].text)) index += 1;
  if (index < words.length && isEnvExecutable(words[index].text)) {
    index += 1;
    while (index < words.length
      && (ASSIGNMENT.test(words[index].text) || words[index].text.startsWith('-'))) {
      index += ENV_FLAGS_WITH_ARGUMENT.has(words[index].text) ? 2 : 1;
    }
  }
  return words.slice(index);
}

function runsNodeOnMarker(words, marker) {
  const rest = commandWords(words);
  if (rest.length === 0 || !isNodeExecutable(rest[0].text)) return false;
  let index = 1;
  while (index < rest.length && rest[index].text.startsWith('-')) {
    const flag = rest[index].text;
    if (nodeFlagSkipsScript(flag)) return false;
    index += NODE_FLAGS_WITH_ARGUMENT.has(flag) ? 2 : 1;
  }
  return index < rest.length && rest[index].text.endsWith(marker);
}

// bash -c and its login, sh and zsh forms hand the next word to a shell as a
// script, so that word is read again as commands. No other word is.
function scriptWord(words) {
  const rest = commandWords(words);
  if (rest.length < 2 || !isShellExecutable(rest[0].text)) return null;
  // The first word that is not a flag is a script file, and what follows it
  // belongs to that script.
  for (let index = 1; index < rest.length - 1; index += 1) {
    const flag = rest[index].text;
    if (!flag.startsWith('-')) return null;
    if (!flag.startsWith('--') && flag.slice(1).includes('c')) {
      return rest[index + 1];
    }
  }
  return null;
}

// An argument that only names node, as `echo node <script>` does, runs
// nothing, so node must stand where a shell starts a command.
function runsMarker(command, marker, depth = 0) {
  return simpleCommands(readWords(command)).some((words) => {
    if (runsNodeOnMarker(words, marker)) return true;
    if (depth >= 2) return false;
    const script = scriptWord(words);
    return script !== null && runsMarker(script.text, marker, depth + 1);
  });
}

function inspect(runtime, root) {
  const file = path.join(root, runtime.file);
  // A toml hook file is text rather than JSON, so the line reader reads it.
  if (runtime.format === 'toml') {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      return { runtime: runtime.id, file: runtime.file, status: 'hook-missing' };
    }
    const wired = tomlCommands(text, runtime.event).some((command) => runsMarker(command, runtime.marker));
    return { runtime: runtime.id, file: runtime.file, status: wired ? 'ok' : 'hook-missing' };
  }
  let document;
  try {
    document = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { runtime: runtime.id, file: runtime.file, status: 'hook-missing' };
  }
  const payload = eventPayload(document, runtime.event);
  const wired = collectCommands(payload, []).some((command) => runsMarker(command, runtime.marker));
  return { runtime: runtime.id, file: runtime.file, status: wired ? 'ok' : 'hook-missing' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const opts = parseArgs(argv);
  const checks = RUNTIMES.map((runtime) => {
    if (!fs.existsSync(path.join(opts.root, runtime.dir))) {
      return { runtime: runtime.id, file: runtime.file, status: 'skipped' };
    }
    return inspect(runtime, opts.root);
  });

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ root: opts.root, checks }, null, 2)}\n`);
  } else {
    for (const check of checks) {
      if (check.status === 'ok') process.stdout.write(`ok ${check.runtime}\n`);
      else if (check.status === 'hook-missing') process.stdout.write(`hook-missing ${check.runtime} ${check.file}\n`);
    }
  }

  return checks.some((check) => check.status === 'hook-missing') ? 1 : 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`hook-wiring-check: ${err && err.message ? err.message : String(err)}\n`);
    process.exitCode = 2;
  }
}

module.exports = { main, eventPayload };
