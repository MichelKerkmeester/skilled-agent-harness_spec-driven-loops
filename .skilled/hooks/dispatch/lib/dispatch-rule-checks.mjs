// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Hard-Rule Engine
// ───────────────────────────────────────────────────────────────────
// Dependency-free dispatch hard-rule engine.
//
// Reads the `hard-rules.json` sidecar beside a dispatch skill's SKILL.md and evaluates each rule
// against a composed shell command BEFORE it is spawned. Used by the PreToolUse preflight hook
// (manual/ad-hoc dispatch) and available to the fan-out in-process guard.
// No external deps and no daemon: the enforcement path must survive even when the advisor is
// down, so the rules live in plain JSON a built-in parse reads without a YAML dependency.
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveOpencodeVersionSync, SUPPORTED_FAMILIES } from './opencode-version.mjs';
import { resolveDispatchCommands, resolveDispatchPackets } from './dispatch-audit.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. RULE LOADING
// ─────────────────────────────────────────────────────────────────────────────

const HARD_RULES_FILENAME = 'hard-rules.json';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const DSH_SKILL = 'cli-deepseek-harness';
const DSH_PINNED_VERSION = '0.2.2-rc.1';
const DSH_HEADLESS_SHAPE = /\bdsh\s+(?:[^|;&]*\s)?(?:--profile(?:=|\s)|headless\b)/;
const DSH_NPX_HEADLESS_SHAPE = /\bnpx\s+-y\s+@deepseek-ai\/dsh(?:@\S+)?[^\n;&|]*(?:--profile(?:=|\s)|\sheadless\b)/;
const DSH_UNEXPANDED_PATCH_VALUE = /(?:\$(?:[A-Za-z_][A-Za-z0-9_]*|\{[^}]*\}|\()|`)/;
const DSH_PATCH_ROSTER_CHECKS = new Set([
  'route-patch-required',
  'lineage-patch-required',
  'closed-roster',
]);
const DSH_PATCH_LITERAL_MESSAGE = 'Pass a literal `.dsh/patches/...` path to `--patch`; '
  + 'an unexpanded shell variable cannot prove the approved patch roster.';
const QUOTED_OPENCODE_RUN_BINARY = /(?:^|[\s;&|])["']((?:[^"']*[\\/])?opencode\d*)["']\s+run\b/;
const OPENCODE_RUN_BINARY = /(?:^|[\s;&|'" ])((?:[^\s"';&|]*[\\/])?opencode\d*|\$OPENCODE_BIN|\$\{OPENCODE_BIN\})["']?\s+run\b/;

/** Read the sibling sidecar beside a SKILL.md; [] on any read, parse or shape error (fail-open). */
export function readHardRules(skillMdPath) {
  try {
    if (typeof skillMdPath !== 'string' || path.basename(skillMdPath) !== 'SKILL.md') return [];
    const parsed = JSON.parse(fs.readFileSync(path.join(path.dirname(skillMdPath), HARD_RULES_FILENAME), 'utf8'));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((rule) => rule && typeof rule === 'object' && rule.id && rule.check);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CHECK FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// Each check is pure and returns true when the command SATISFIES the rule.
// A check returning false means the rule is VIOLATED and should be surfaced.

const STDIN_REDIRECT = /<\s*\/dev\/null|0<\s*\/dev\/null|<<-?\s*['"]?\w|<<</; // </dev/null, heredoc, herestring
// A pipe feeding a headless CLI (`... | opencode run`) closes inherited stdin for the run it
// feeds, not for the whole chain. The pipe is shell syntax around the dispatch, so it is read
// from the whole command, unquoted, with this global copy. The CLI-name prefix also matches
// commands that are not dispatches (`pi --version`), so a match counts only when the command
// it feeds is itself a headless dispatch: one pipe closes stdin for one run, so each run that
// closes no stdin of its own must be covered by one.
const PIPE_FED_DISPATCH = new RegExp(
  String.raw`\|\s*(?:[A-Z_]+=\S+\s+)*(?:opencode\d*\s+run|pi|claude|codex|devin|`
    + String.raw`cursor-agent|hermes|dsh|npx)\b`,
  'g',
);

// A prompt is an argument, not syntax: a quoted span is text the CLI receives, so a flag or
// redirect spelled inside one is not evidence the dispatch passes it. Blank the span contents
// and keep the quotes, leaving only the command's own argument structure. In ANSI-C `$'...'`
// a backslash escapes the next character, so only an unescaped quote ends the span.
// A quoted heredoc delimiter is syntax rather than prompt text -- `<<'EOF'` is exactly what
// the stdin rule looks for -- so a quoted word of any shape after `<<` or `<<-` survives.
function blankQuotedSpans(command) {
  let result = '';
  for (let index = 0; index < command.length; index += 1) {
    if (command[index] === '<') {
      const heredoc = /^<<-?\s*(?:'[^'\n]+'|"[^"\n]+")/.exec(command.slice(index));
      if (heredoc) {
        result += heredoc[0];
        index += heredoc[0].length - 1;
        continue;
      }
    }
    const character = command[index];
    if (character === '$' && command[index + 1] === "'") {
      let cursor = index + 2;
      let closed = false;
      while (cursor < command.length) {
        // ANSI-C quoting: a backslash escapes the next character, so `\'` stays inside.
        if (command[cursor] === '\\' && cursor + 1 < command.length) {
          cursor += 2;
          continue;
        }
        if (command[cursor] === "'") {
          closed = true;
          break;
        }
        cursor += 1;
      }
      if (!closed) {
        result += character;
        continue;
      }
      result += "''";
      index = cursor;
      continue;
    }
    if (character === "'") {
      const end = command.indexOf("'", index + 1);
      if (end === -1) {
        result += character;
        continue;
      }
      result += "''";
      index = end;
      continue;
    }
    if (character === '"') {
      let cursor = index + 1;
      let closed = false;
      while (cursor < command.length) {
        // A backslash-escaped quote inside a double-quoted span is part of the span.
        if (command[cursor] === '\\' && cursor + 1 < command.length) {
          cursor += 2;
          continue;
        }
        if (command[cursor] === '"') {
          closed = true;
          break;
        }
        cursor += 1;
      }
      if (!closed) {
        result += character;
        continue;
      }
      result += '""';
      index = cursor;
      continue;
    }
    result += character;
  }
  return result;
}

// The texts the stdin and model checks read: each resolved dispatch's own blanked arguments,
// in command order, so one dispatch's flag or redirect cannot answer for another. When
// nothing resolves the whole blanked command is the one text. Quotes are blanked either way,
// so a prompt cannot lend a check a flag or redirect the dispatch never passed.
function dispatchArgumentTexts(command) {
  const dispatches = resolveDispatchCommands(command);
  const texts = dispatches.length > 0
    ? dispatches.map((dispatch) => dispatch.text)
    : [command];
  return texts.map(blankQuotedSpans);
}

// Claude's print-mode shape, shared by the headless list below and the permission-mode check.
const CLAUDE_PRINT = /\bclaude\s+(?:[^|;&]*\s)?(?:-p|--print)\b/;

// Every headless CLI here inherits the parent terminal's stdin and can hang
// indefinitely with no output, which reads as a slow model rather than a deadlock.
// Five packets declared the stdin rule while the check only recognised `opencode run`,
// so their rule never fired; these are the print-mode shapes each one documents.
const HEADLESS_DISPATCH_SHAPES = [
  /\bopencode\d*\s+run\b/,
  /\bpi\s+(?:[^|;&]*\s)?(?:-p|--print)\b/,
  CLAUDE_PRINT,
  /\bcodex\s+exec\b/,
  /\bdevin\s+(?:[^|;&]*\s)?-p\b/,
  /\bcursor-agent\s+(?:[^|;&]*\s)?-p\b/,
  // Hermes has no print flag; its headless forms are `hermes chat` with a query flag and
  // the top-level `-z` oneshot.
  /\bhermes\s+chat\b(?:[^|;&]*\s)?(?:-q|--query|--query-file|--oneshot)\b/,
  /\bhermes\s+(?:[^|;&]*\s)?-z\b/,
  DSH_HEADLESS_SHAPE,
  DSH_NPX_HEADLESS_SHAPE,
];

const DSH_APP_FLAGS = new Set(['--json', '--session-id', '--permission-mode', '--approval-policy', '--add-dir']);
const DSH_APP_VALUE_FLAGS = new Set(['--session-id', '--permission-mode', '--approval-policy', '--add-dir']);
const DSH_ROUTE_PATCHES = new Set([
  'route-llmgateway-deepseek.patch.yml',
  'route-opencode-go-deepseek.patch.yml',
]);
const DSH_LINEAGE_PATCH = 'lineage.patch.yml';
const DSH_MCP_PATCH = 'mcp-code-mode.patch.yml';
const DSH_GUARDS_PATCH = 'guards.patch.yml';
const DSH_PATCH_FOLDERS = ['patches', 'agents'];
// Command text cannot resolve a variable, so a variable path is accepted only in the documented
// `$REPO/.dsh/patches/<file>` shape. Pointing that variable at another tree is the residual gap.
const DSH_VARIABLE_PATCH_PATH = /^(?:\$[A-Za-z_][A-Za-z0-9_]*|\$\{[A-Za-z_][A-Za-z0-9_]*\})\/\.dsh\/(?:patches|agents)\/[^/$`]+$/;

/** Split a resolved shell command into words while keeping quoted values together. */
function shellWords(command) {
  const words = [];
  let word = '';
  let quote = null;
  let escaped = false;
  let started = false;

  for (const character of command) {
    if (escaped) {
      word += character;
      escaped = false;
      started = true;
      continue;
    }
    if (quote === "'") {
      if (character === "'") quote = null;
      else word += character;
      continue;
    }
    if (quote === '"') {
      if (character === '"') quote = null;
      else if (character === '\\') escaped = true;
      else word += character;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      started = true;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      started = true;
      continue;
    }
    if (/\s/.test(character)) {
      if (started) words.push(word);
      word = '';
      started = false;
      continue;
    }
    word += character;
    started = true;
  }
  if (started) words.push(word);
  return words;
}

/** Remove shell redirections from the argument list the executable receives. */
function commandArguments(words, startIndex) {
  const args = [];
  for (let index = startIndex; index < words.length; index += 1) {
    const word = words[index];
    if (/^\d*(?:<<|>>|<|>)/.test(word) || ['<', '>', '<<', '>>', '<<<'].includes(word)) {
      if (!/[<>].+/.test(word)) index += 1;
      continue;
    }
    if (['|', '||', '&&', ';', '&'].includes(word)) break;
    args.push(word);
  }
  return args;
}

/** Parse dsh launcher and app flags from one resolved invocation. */
function parseDshInvocation(text) {
  const words = shellWords(text);
  let commandIndex = words.findIndex((word) => (
    !/^[A-Za-z_][A-Za-z0-9_]*=/.test(word) && path.basename(word) === 'dsh'
  ));
  if (commandIndex === -1) {
    const npxIndex = words.findIndex((word) => word === 'npx');
    if (npxIndex !== -1) {
      commandIndex = npxIndex + 1;
      while (['--yes', '-y'].includes(words[commandIndex])) commandIndex += 1;
      if (!/^@deepseek-ai\/dsh(?:@|$)/.test(words[commandIndex] || '')) return null;
    }
  }
  if (commandIndex === -1) {
    // A variable in command position followed by a headless profile is a dsh launch whose
    // binary name is hidden; parse it so every rule still applies.
    commandIndex = words.findIndex((word, index) => /^\$\{?[A-Za-z_][A-Za-z0-9_]*\}?$/.test(word)
      && commandArguments(words, index + 1).some((argument) => argument === '--profile' || argument.startsWith('--profile=')));
  }
  if (commandIndex === -1) return null;

  const args = commandArguments(words, commandIndex + 1);
  const profileValues = [];
  const patches = [];
  const approvalPolicies = [];
  const permissionModes = [];
  const positionalArgs = [];
  let hasJson = false;
  let appStart = Number.POSITIVE_INFINITY;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    const next = args[index + 1];
    if (index === 0 && argument === 'headless') continue;
    if (argument === '--profile') {
      profileValues.push(next && !next.startsWith('-') ? next : '');
      if (next && !next.startsWith('-')) index += 1;
      continue;
    }
    if (argument.startsWith('--profile=')) {
      profileValues.push(argument.slice('--profile='.length));
      continue;
    }
    if (argument === '--patch') {
      patches.push({ value: next && !next.startsWith('-') ? next : '', index });
      if (next && !next.startsWith('-')) index += 1;
      continue;
    }
    if (argument.startsWith('--patch=')) {
      patches.push({ value: argument.slice('--patch='.length), index });
      continue;
    }
    const equalsIndex = argument.indexOf('=');
    const optionName = equalsIndex === -1 ? argument : argument.slice(0, equalsIndex);
    const inlineValue = equalsIndex === -1 ? null : argument.slice(equalsIndex + 1);
    if (DSH_APP_FLAGS.has(optionName)) {
      appStart = Math.min(appStart, index);
      if (argument === '--json') hasJson = true;
      if (optionName === '--approval-policy') approvalPolicies.push(inlineValue ?? next ?? '');
      if (optionName === '--permission-mode') permissionModes.push(inlineValue ?? next ?? '');
      if (inlineValue === null && DSH_APP_VALUE_FLAGS.has(optionName) && next && !next.startsWith('-')) index += 1;
      continue;
    }
    if (argument === '-') continue;
    if (argument.startsWith('-')) {
      appStart = Math.min(appStart, index);
      continue;
    }
    appStart = Math.min(appStart, index);
    positionalArgs.push(argument);
  }

  return {
    text,
    words,
    commandIndex,
    args,
    profileValues,
    patches,
    approvalPolicies,
    permissionModes,
    positionalArgs,
    hasJson,
    appStart,
    hasTrailingDash: args.at(-1) === '-',
  };
}

/** Return each dsh task candidate with its independently parsed flags. */
function dshDispatches(command) {
  return resolveDispatchCommands(String(command || ''))
    .filter(({ entry }) => entry.skill === DSH_SKILL)
    .map(({ text }) => parseDshInvocation(text))
    .filter(Boolean);
}

/** The roster is proven by the patch file name, so only a variable in the name itself is unprovable. */
function hasUnexpandedPatchValue(dispatch) {
  return dispatch.patches.some(({ value }) => DSH_UNEXPANDED_PATCH_VALUE.test(path.basename(value)));
}

/** Read DSH_HOME only from assignments before the executable, honoring env resets. */
function dshHomePrefix(invocation) {
  let isSet = false;
  let value = '';
  let inEnv = false;
  const before = invocation.words.slice(0, invocation.commandIndex);
  const segmentStart = before.reduce((start, word, index) => (
    ['|', '||', '&&', ';', '&'].includes(word) ? index + 1 : start
  ), 0);
  const prefix = before.slice(segmentStart);

  for (let index = 0; index < prefix.length; index += 1) {
    const word = prefix[index];
    if (word === 'env') {
      inEnv = true;
      continue;
    }
    if (inEnv && (word === '-i' || word === '--ignore-environment')) {
      isSet = false;
      value = '';
      continue;
    }
    if (inEnv && (word === '-u' || word === '--unset')) {
      if (prefix[index + 1] === 'DSH_HOME') {
        isSet = false;
        value = '';
      }
      index += 1;
      continue;
    }
    if (inEnv && (word === '-uDSH_HOME' || word === '--unset=DSH_HOME')) {
      isSet = false;
      value = '';
      continue;
    }
    if (word.startsWith('DSH_HOME=')) {
      isSet = true;
      value = word.slice('DSH_HOME='.length);
    }
  }
  return { isSet, value };
}

/** The checkout the rules protect: the caller's repoRoot, else the one holding this file. */
function contextRepoRoot(context) {
  return typeof context?.repoRoot === 'string' && context.repoRoot ? path.resolve(context.repoRoot) : REPO_ROOT;
}

/**
 * Replaces a leading `$REPO` or `${REPO}`, quoted or not, with the checkout root. The dsh packet
 * defines REPO as the checkout, so a path built on it is the checkout and not an unknown value.
 */
function expandRepoAlias(value, repoRoot) {
  const unquoted = String(value).replace(/^(["'])(.*)\1$/, '$2');
  const match = unquoted.match(/^\$(?:REPO|\{REPO\})(?=\/|$)/);
  return match ? repoRoot + unquoted.slice(match[0].length) : value;
}

/**
 * The directory dsh will start in: the caller's cwd, else this process's, moved by every `cd`
 * before the executable. Returns null when a `cd` names a variable, which text cannot resolve,
 * except `$REPO`, which names the checkout.
 */
function dshWorkingDirectory(command, context) {
  // The resolver hands each check only the dsh segment, so a `cd` before it is read from the full text.
  const dispatch = parseDshInvocation(String(command || ''));
  let directory = typeof context?.cwd === 'string' && context.cwd ? path.resolve(context.cwd) : process.cwd();
  const before = dispatch ? dispatch.words.slice(0, dispatch.commandIndex) : [];
  for (let index = 0; index < before.length; index += 1) {
    // Only a `cd` in command position changes directory; `echo cd` merely prints the word.
    // The word splitter leaves a separator glued to the word before it (`W=1;`), so the
    // previous word counts as a boundary when it ends in one.
    const atCommandStart = index === 0 || /(?:^|[^\\])(?:;|&&|\|\||\||&)$/.test(before[index - 1]);
    if (!atCommandStart || before[index].replace(/^\(+/, '') !== 'cd') continue;
    const target = before[index + 1] && expandRepoAlias(before[index + 1], contextRepoRoot(context));
    if (!target || ['|', '||', '&&', ';', '&'].includes(target)) {
      directory = os.homedir();
      continue;
    }
    if (DSH_UNEXPANDED_PATCH_VALUE.test(target)) return null;
    directory = path.resolve(directory, target.replace(/^~(?=\/|$)/, os.homedir()));
  }
  return directory;
}

/** True when a `--patch` value is one of this checkout's own patch or persona files. */
function isCheckoutPatch(value, repoRoot, workingDirectory) {
  if (!value) return false;
  if (DSH_UNEXPANDED_PATCH_VALUE.test(value)) return DSH_VARIABLE_PATCH_PATH.test(value);
  let resolved = path.resolve(workingDirectory || repoRoot, value);
  try {
    resolved = fs.realpathSync(resolved);
  } catch {
    // A missing file still has to name a path inside the checkout.
  }
  return DSH_PATCH_FOLDERS.some((folder) => isPathInside(path.join(repoRoot, '.dsh', folder), resolved));
}

/** Return true when target is equal to or inside parent. */
function isPathInside(parent, target) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

/** Identify npm package references that make a dsh version explicit in command text. */
function dshPackageVersions(command) {
  const words = shellWords(String(command || ''));
  const versions = [];
  for (let index = 0; index < words.length; index += 1) {
    if (words[index] !== 'npx') continue;
    let packageIndex = index + 1;
    while (['--yes', '-y'].includes(words[packageIndex])) packageIndex += 1;
    const packageSpec = words[packageIndex] || '';
    if (!/^@deepseek-ai\/dsh(?:@|$)/.test(packageSpec)) continue;
    const args = words.slice(packageIndex + 1);
    if (!args.some((argument) => argument === 'headless' || argument === '--profile' || argument.startsWith('--profile='))) continue;
    versions.push(packageSpec.startsWith('@deepseek-ai/dsh@')
      ? packageSpec.slice('@deepseek-ai/dsh@'.length)
      : '');
  }
  return versions;
}

const HERMES_CHAT = /\bhermes\s+chat\b/;
// Pi's headless shape, reused by the two pi-specific checks below.
const PI_PRINT = /\bpi\s+(?:[^|;&]*\s)?(?:-p|--print)\b/;
// `--query-file` is Hermes's own stdin contract: `-` reads the prompt from stdin and a
// path reads a file, and either way the run never waits on an inherited terminal stdin.
const HERMES_STDIN_HANDLED = /--query-file(\s|=)/;
// Toolsets whose presence means the run can execute commands, so `--yolo` is needed: only a
// flagged terminal or code action hits Hermes's approval gate. `file` is deliberately absent
// because ordinary file writes are never gated and a read-only leaf keeps `file` for reading.
const HERMES_WRITE_TOOLSETS = /(?:^|[\s=,])(?:terminal|coding|code_execution|browser)(?:[\s,]|$)/;
// Hermes reads files only through the `file` toolset; `search` is web search. A list without
// it yields a leaf that cannot read anything and still exits 0 with empty stdout.
const HERMES_FILE_TOOLSET = /(?:^|,)file(?:,|$)/;

// Jev's judgment shapes. `jev` has no print flag and no headless subcommand: the subcommand IS the
// dispatch, exactly as `codex exec` is for codex, so membership here is the evidence.
const JEV_JUDGMENT = /\bjev\s+(?:noul|choice|score|run)\b/;
const JEV_CHOICE = /\bjev\s+choice\b/;
const JEV_SCORE = /\bjev\s+score\b/;
const JEV_RUN = /\bjev\s+run\b/;
// `jev-mcp` is a stdio server, not a judgment: it is matched only by the rule that refuses a shell
// start, so it is deliberately absent from JEV_JUDGMENT.
const JEV_MCP = /(?:^|[\s;&|])jev-mcp(?:\s|$)/;
const JEV_CREDENTIAL_VARS = /(?:^|\s)(?:TYPESAFE_API_KEY|AI_GATEWAY_API_KEY|OPENROUTER_API_KEY|JEV_API_KEY)=[^\s]+/;
// A state flag with an inline value is the only form that does NOT read stdin; `-s -` and an
// omitted flag both read it to EOF, which is a hang when stdin is an inherited terminal.
const JEV_INLINE_STATE = /(?:^|\s)(?:-s|--state)(?:\s+|=)(?!(?:-|$))[^\s"']+/;

/** Count repeatable `-o`/`-l` occurrences: the CLI accepts one, a choice or a scale needs two. */
function repeatedFlagCount(command, names) {
  const pattern = new RegExp(`(?:^|\\s)(?:${names})(?:\\s+|=)`, 'g');
  return (command.match(pattern) || []).length;
}

// Some checks have a legitimate negative control: a scenario proving the refusal exists must
// issue the shape that gets refused. Testing the delegation guard needs the delegation
// toolset; proving a read-nothing leaf needs no reader; proving the approval gate needs a
// write toolset without the approval flag. Without a way to say so, those scenarios are
// permanently un-runnable, and an operator who cannot run the guard's own proof stops
// trusting the guard. The marker is an explicit env prefix, so it cannot appear by accident
// and `grep` finds every use. The command text is model-writable, so the marker counts only
// when the operator opts the guard's own process in; a dispatch alone never can.
const NEGATIVE_CONTROL = /(?:^|\s)SPECKIT_DISPATCH_NEGATIVE_CONTROL=1(?:\s|$)/;
const NEGATIVE_CONTROL_ALLOW_ENV = 'SPECKIT_DISPATCH_NEGATIVE_CONTROL_ALLOWED';

/** A negative control counts only when the operator allowed it for the guard's own process. */
function negativeControlActive(cmd) {
  return process.env[NEGATIVE_CONTROL_ALLOW_ENV] === '1' && NEGATIVE_CONTROL.test(cmd);
}

/**
 * Build a check that refuses a dispatch whose binary is absent from PATH.
 *
 * Fail-open by construction: it refuses only when PATH is readable AND the binary is
 * conclusively not on it. A missing PATH, an unreadable directory or any thrown error
 * resolves to a pass, because the cost of a false refusal is a blocked dispatch while
 * the cost of a false pass is the exec failure the caller would have seen anyway.
 *
 * @param {string} binary
 * @param {RegExp} shape - matches commands that actually invoke the binary
 * @returns {(cmd: string) => boolean}
 */
function binaryOnPathCheck(binary, shape) {
  return (cmd) => {
    if (!shape.test(cmd)) return true; // command does not invoke it → n/a
    const rawPath = process.env.PATH;
    if (!rawPath) return true; // nothing to resolve against → cannot refuse
    for (const dir of rawPath.split(path.delimiter)) {
      if (!dir) continue;
      try {
        fs.accessSync(path.join(dir, binary), fs.constants.X_OK);
        return true;
      } catch {
        // Not here, or not executable here. Keep looking.
      }
    }
    return false;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHECK REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const CHECKS = {
  // A headless dispatch must close/redirect stdin or it can inherit an open stdin
  // and hang at 0% CPU, emitting nothing at all.
  'stdin-redirect-required': (cmd) => {
    if (!HEADLESS_DISPATCH_SHAPES.some((shape) => shape.test(cmd))) return true; // not a dispatch shape → n/a
    const otherHeadlessShape = HEADLESS_DISPATCH_SHAPES.some((shape) => (
      shape !== DSH_HEADLESS_SHAPE
      && shape !== DSH_NPX_HEADLESS_SHAPE
      && shape.test(cmd)
    ));
    if (!otherHeadlessShape
      && (DSH_HEADLESS_SHAPE.test(cmd) || DSH_NPX_HEADLESS_SHAPE.test(cmd))
      && dshDispatches(cmd).length === 0) return true;
    // The pipe count is the budget of runs whose stdin the shell closes for them; it is counted
    // on the whole blanked command because the pipe is syntax around the dispatch, not part of it.
    // Only a pipe whose fed command is itself a headless dispatch closes stdin: `| pi --version`
    // matches the pipe pattern but leaves the later `opencode run`'s inherited stdin open.
    const blanked = blankQuotedSpans(cmd);
    const pipeFed = [...blanked.matchAll(PIPE_FED_DISPATCH)].filter((match) => {
      const fed = blanked.slice(match.index + 1).match(/^[^;|&\n]*/)[0];
      return HEADLESS_DISPATCH_SHAPES.some((shape) => shape.test(fed));
    }).length;
    // Every dispatch answers for its own stdin: a redirect on one run cannot close stdin on
    // a later run that has none. When no resolved text carries a headless shape, the whole
    // command is the one text, so a shape the resolver did not name is still checked.
    const texts = dispatchArgumentTexts(cmd);
    const headless = texts.filter((text) => HEADLESS_DISPATCH_SHAPES.some((shape) => shape.test(text)));
    const held = headless.length > 0 ? headless : [blankQuotedSpans(cmd)];
    // Hermes reads its prompt through --query-file (a path, or `-` for stdin), never waiting on a terminal.
    const unclosed = held.filter((text) => !STDIN_REDIRECT.test(text)
      && !(HERMES_CHAT.test(text) && HERMES_STDIN_HANDLED.test(text)));
    // One pipe can feed only one run, so more unclosed runs than pipes means at least one run
    // inherits an open stdin and can hang with no output.
    return unclosed.length <= pipeFed;
  },
  // Without an explicit model the run falls back to the configured default; when that
  // provider is out of quota the 429 retries forever and emits nothing, which looks
  // exactly like a deadlock.
  'explicit-model-required': (cmd) => {
    if (!/\bopencode\d*\s+run\b/.test(cmd)) return true; // not the dispatch shape → n/a
    // Every opencode run in the chain must name its own model: one run's -m cannot cover
    // a later run that falls back to the configured default.
    const texts = dispatchArgumentTexts(cmd);
    const runs = texts.filter((text) => /\bopencode\d*\s+run\b/.test(text));
    const held = runs.length > 0 ? runs : [blankQuotedSpans(cmd)];
    return held.every((text) => /(^|\s)(-m|--model)(\s|=)/.test(text));
  },
  // A bare top-level `--agent general` is rejected by opencode at runtime. Both spellings
  // count: `--agent=general` reached the runtime unflagged while `--agent general` did not.
  'no-bare-agent-general': (cmd) => !/--agent(?:\s+|=)general(\s|$)/.test(cmd),
  // A slash-command-shaped prompt needs --command, else opencode delivers it as raw prose
  // and the wrong task runs with no error. The prompt need not be quoted to be a prompt.
  'command-flag-for-slash-prompt': (cmd) => {
    const slashPrompt = /(?:["']|\s)\s*\/[a-z0-9]+:[a-z0-9-]+/i.test(cmd);
    if (!slashPrompt) return true;
    return /--command(\s|=)/.test(cmd);
  },
  'v2-slash-prompt-route': (cmd) => !/(?:["']|\s)\s*\/[a-z0-9]+:[a-z0-9-]+/i.test(cmd),
  // --share publishes nothing: OpenCode 1.19.3 keeps it as a hidden, deprecated flag that
  // only prints a warning, and OpenCode 2 `run` has no such flag. A dispatch that passes it,
  // bare or as `--share=<value>`, still expects a share, so the advisory names the flag.
  'share-requires-confirmation': (cmd) => !/--share(?:\s|=|$)/.test(cmd),
  // The four availability rules below were declared with `severity: error` but had no
  // implementation, so they never refused anything. Each answers one question: does the
  // binary this command invokes actually resolve on PATH? Anything uncertain passes —
  // a guard that cannot see PATH must not invent a refusal.
  // Pi's startup network probes are not bounded by the dispatch timeout: a non-interactive
  // run without --offline hung past two minutes in the packet's own live probe, which reads
  // as a slow model rather than a stalled startup.
  'pi-offline-required': (cmd) => !PI_PRINT.test(cmd) || /(^|\s)--offline(\s|$)/.test(cmd),
  // Pi resolves a bare model id against its own default provider, so an unqualified selector
  // silently runs a different provider's model instead of failing. The gateway needs the
  // two-segment `provider/model` form and 400s without it.
  'pi-provider-qualified-model': (cmd) => {
    if (!PI_PRINT.test(cmd)) return true;
    const model = cmd.match(/(?:^|\s)(?:-m|--model)(?:\s+|=)([^\s"']+)/);
    if (!model) return true; // absence is the availability/model rule's business, not this one
    return model[1].includes('/');
  },
  'command-v-codex-required': binaryOnPathCheck('codex', /\bcodex\s+/),
  'command-v-cursor-agent-required': binaryOnPathCheck('cursor-agent', /\bcursor-agent\s+/),
  'command-v-devin-required': binaryOnPathCheck('devin', /\bdevin\s+/),
  'command-v-pi-required': binaryOnPathCheck('pi', /\bpi\s+/),
  'command-v-hermes-required': binaryOnPathCheck('hermes', /\bhermes\s+/),
  'command-v-dsh-required': binaryOnPathCheck('dsh', /(?:^|[\s;&|(])dsh\s+/),
  // A headless `hermes chat` without --yolo blocks any tool call Hermes flags as dangerous
  // (nobody is present to approve it), so a run given a write-capable toolset could fail a
  // flagged step mid-task. Ordinary writes run either way; read-only runs (no write toolset
  // named) are the intended --yolo-less shape and pass.
  'hermes-yolo-required-for-writes': (cmd) => {
    if (!HERMES_CHAT.test(cmd)) return true;
    if (negativeControlActive(cmd)) return true; // a scenario proving the gate must trip it
    const toolsets = cmd.match(/(?:^|\s)(?:-t|--toolsets)(?:\s+|=)([^\s]+)/);
    if (!toolsets) return true; // no explicit list: the toolset rule reports that case
    if (!HERMES_WRITE_TOOLSETS.test(toolsets[1])) return true;
    return /(^|\s)--yolo(\s|$)/.test(cmd);
  },
  // Without --ignore-rules Hermes injects SOUL.md, its memories, session search and the CWD
  // instruction files into the leaf prompt, bleeding prior sessions into the task.
  // A live A/B under --ignore-rules proved the skill preload survives the flag: with -s the
  // session quoted the preloaded text, without it the same prompt returned no preload. The
  // former carve-out for -s therefore sanctioned the exact context bleed this rule prevents.
  'hermes-ignore-rules-required': (cmd) => !HERMES_CHAT.test(cmd)
    || /(^|\s)--ignore-rules(\s|$)/.test(cmd),
  // Hermes's stock roster enables `delegation` and `memory`; a leaf must name its toolsets and
  // leave both out, or it can spawn sub-agents outside the runner's boundary and write memories.
  'hermes-explicit-toolsets-required': (cmd) => {
    if (!HERMES_CHAT.test(cmd)) return true;
    if (negativeControlActive(cmd)) return true; // a scenario proving the refusal must trip it
    const toolsets = cmd.match(/(?:^|\s)(?:-t|--toolsets)(?:\s+|=)([^\s]+)/);
    if (!toolsets) return false;
    if (/(?:^|,)(?:delegation|memory)(?:,|$)/.test(toolsets[1])) return false;
    return HERMES_FILE_TOOLSET.test(toolsets[1]);
  },
  // --worktree runs `git worktree add` inside the repository, which the fan-out
  // write-containment guard attributes to the lineage and reverts.
  'hermes-no-worktree-flag': (cmd) => !HERMES_CHAT.test(cmd) || !/(^|\s)--worktree(\s|$)/.test(cmd),
  // MCP servers are configured only in the user-level config; a dispatch that adds one is
  // performing an operator step, not a task.
  'hermes-mcp-config-operator-required': (cmd) => !/\bhermes\s+mcp\s+(?:add|remove|rm|install)\b/.test(cmd),
  // Shell hooks are user-level with a consent allowlist; --accept-hooks blesses whatever the
  // operator's config declares, so a dispatch never passes it.
  'hermes-hooks-user-level': (cmd) => !/\bhermes\b/.test(cmd) || !/(^|\s)--accept-hooks(\s|$)/.test(cmd),
  // Jev reads its state from stdin by default, so a dispatch that neither passes an inline state
  // nor redirects stdin blocks on a terminal that will never produce the EOF it waits for.
  'jev-stdin-bounded': (cmd) => {
    if (!JEV_JUDGMENT.test(cmd)) return true;
    const fromStdin = JEV_RUN.test(cmd)
      ? /\bjev\s+run\s+-(?:\s|$)/.test(cmd)
      : !JEV_INLINE_STATE.test(cmd);
    if (!fromStdin) return true;
    if (STDIN_REDIRECT.test(cmd)) return true;
    return /\|\s*(?:[A-Z_]+=\S+\s+)*jev\b/.test(cmd);
  },
  // One option is not a choice. The CLI sends it anyway, so the guard is the only surface that
  // refuses it before a model is billed to confirm the only answer available.
  'jev-choice-option-cardinality': (cmd) => !JEV_CHOICE.test(cmd)
    || repeatedFlagCount(cmd, '-o|--option') >= 2,
  // One level is not a scale: the returned zero-based position carries no information.
  'jev-score-level-cardinality': (cmd) => !JEV_SCORE.test(cmd)
    || repeatedFlagCount(cmd, '-l|--level') >= 2,
  // `--value` prints a single primary answer, which a batched request does not have; the CLI only
  // reports the conflict after the call succeeds, so the guard is the cheap refusal.
  'jev-value-not-with-run': (cmd) => !JEV_RUN.test(cmd)
    || !/(?:^|\s)--value(?:\s|$)/.test(cmd),
  // A proxy bearer travels to whatever endpoint the flag names, and the endpoint is also the one
  // value the CLI validates first, so an unnamed endpoint is a command that cannot run at all.
  'jev-custom-endpoint-required': (cmd) => {
    if (!JEV_JUDGMENT.test(cmd)) return true;
    if (!/(?:^|\s)--provider(?:\s+|=)custom(?:\s|$)/.test(cmd)) return true;
    return /(?:^|\s)--endpoint(?:\s|=)/.test(cmd) || /JEV_ENDPOINT=/.test(cmd);
  },
  // Shell history, process arguments and transcripts all retain an inline key, and the CLI's own
  // credential store exists precisely so the value never appears on a command line.
  'jev-no-inline-credential': (cmd) => {
    if (!JEV_JUDGMENT.test(cmd) && !JEV_MCP.test(cmd)) return true;
    return !JEV_CREDENTIAL_VARS.test(cmd);
  },
  // stdout is a JSON-RPC frame stream, so a hand-started server writes frames into the transcript
  // and answers nothing; only a host that speaks the protocol should own the process.
  'jev-mcp-host-only': (cmd) => !JEV_MCP.test(cmd),
  'command-v-jev-required': binaryOnPathCheck('jev', /\bjev\s+/),
  'headless-only': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    return dispatches.every((dispatch) => dispatch.profileValues.length > 0
      ? dispatch.profileValues.every((profile) => profile === 'headless')
      : dispatch.args[0] === 'headless');
  },
  'stdin-dash-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    return dispatches.every((dispatch) => dispatch.hasTrailingDash && dispatch.positionalArgs.length === 0);
  },
  'route-patch-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    return dispatches.every((dispatch) => {
      if (hasUnexpandedPatchValue(dispatch)) return false;
      const routePatches = dispatch.patches.filter(({ value }) => DSH_ROUTE_PATCHES.has(path.basename(value)));
      return routePatches.length === 1 && routePatches[0].index < dispatch.appStart;
    });
  },
  'closed-roster': (cmd, context) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    const repoRoot = contextRepoRoot(context);
    // A patch from outside the checkout can redefine a provider or disable a guard row, so only
    // the repository's own patch files may compose a dispatch.
    return dispatches.every((dispatch) => {
      const workingDirectory = dshWorkingDirectory(cmd, context);
      return !hasUnexpandedPatchValue(dispatch)
        && dispatch.patches.every(({ value }) => {
          const name = path.basename(value);
          return (!name.startsWith('route-') || DSH_ROUTE_PATCHES.has(name))
            && isCheckoutPatch(value, repoRoot, workingDirectory);
        });
    });
  },
  'guards-patch-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    return dispatches.every((dispatch) => !hasUnexpandedPatchValue(dispatch)
      && dispatch.patches.some(({ value, index }) =>
        path.basename(value) === DSH_GUARDS_PATCH && index < dispatch.appStart));
  },
  'approval-never-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    // Every occurrence must say never: a repeated flag resolves last-wins in dsh, so one
    // never next to a later ask would otherwise pass while the run asks.
    return dispatches.every((dispatch) => dispatch.approvalPolicies.length > 0
      && dispatch.approvalPolicies.every((policy) => policy === 'never')
      && !dispatch.permissionModes.includes('danger-full-access'));
  },
  'dsh-home-isolated': (cmd, context) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    const repoRoot = contextRepoRoot(context);
    const operatorHome = path.join(os.homedir(), '.dsh');
    // The dispatch resolver strips an `env` wrapper, so read the assignment from the original text too.
    const original = parseDshInvocation(String(cmd || ''));
    return dispatches.every((dispatch) => {
      const resolved = dshHomePrefix(dispatch);
      const { isSet, value: rawValue } = resolved.isSet || !original ? resolved : dshHomePrefix(original);
      if (!isSet || !rawValue) return false;
      const value = expandRepoAlias(rawValue, repoRoot);
      // The current directory, a command substitution and the operator's own home can each land
      // on the checkout or on ~/.dsh, so none of them counts as a disposable home.
      if (/\$\{?PWD\b|\$\(|`|^~|^\$\{?HOME\b/.test(value)) return false;
      // Any other variable resolves only at run time; the dispatcher owns making it disposable.
      if (DSH_UNEXPANDED_PATCH_VALUE.test(value)) return true;
      const workingDirectory = dshWorkingDirectory(cmd, context);
      if (!workingDirectory && !path.isAbsolute(value)) return false;
      const home = path.resolve(workingDirectory || '/', value);
      return !isPathInside(repoRoot, home) && !isPathInside(operatorHome, home);
    });
  },
  'lineage-patch-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    return dispatches.every((dispatch) => !hasUnexpandedPatchValue(dispatch)
      && dispatch.patches.some(({ value, index }) =>
        path.basename(value) === DSH_LINEAGE_PATCH && index < dispatch.appStart));
  },
  'json-final-and-exit-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    return dispatches.length === 0 || dispatches.every((dispatch) => dispatch.hasJson);
  },
  'pinned-version-required': (cmd) => {
    const dispatches = dshDispatches(cmd);
    const packageVersions = dshPackageVersions(cmd);
    if (dispatches.length === 0 && packageVersions.length === 0) return true;
    // Command text can reject an explicit wrong npm pin but cannot inspect an installed binary.
    return packageVersions.every((version) => version === DSH_PINNED_VERSION);
  },
  // Headless reads `<cwd>/.env`, so the folder dsh starts in must hold none. With no caller cwd
  // the hook's own working directory is the session's, which is where the command runs.
  'no-repo-root-dotenv': (cmd, context) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    const repoRoot = contextRepoRoot(context);
    return dispatches.every((dispatch) => {
      const workingDirectory = dshWorkingDirectory(cmd, context);
      // A `cd` to a variable is the documented scratch-folder pattern; text cannot resolve it.
      if (!workingDirectory) return true;
      if (workingDirectory === repoRoot) return false;
      try {
        return !fs.existsSync(path.join(workingDirectory, '.env'));
      } catch {
        return false;
      }
    });
  },
  'mcp-opt-in-only': (cmd) => {
    const dispatches = dshDispatches(cmd);
    if (dispatches.length === 0) return true;
    return dispatches.every((dispatch) => dispatch.patches.every(({ value }) => {
      const name = path.basename(value).toLowerCase();
      return !name.includes('mcp') || name === DSH_MCP_PATCH;
    }));
  },
  // Non-interactive claude -p with a Bash-heavy prompt and no permission bypass can deadlock.
  'non-interactive-permission-mode-risk': (cmd) => {
    if (!CLAUDE_PRINT.test(cmd)) return true;
    return /--dangerously-skip-permissions|--permission-mode\s+bypassPermissions/.test(cmd);
  },
};

export const KNOWN_CHECKS = Object.keys(CHECKS);

// ─────────────────────────────────────────────────────────────────────────────
// 5. EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a skill's hard rules against a command string. Those are the rules `readHardRules`
 * reads from the `hard-rules.json` sidecar beside the skill's SKILL.md.
 *
 * The optional third argument lets a caller supply its own check registry and a context object
 * describing state the command has not yet touched. Dispatch rules are answerable from the
 * command text alone, but rules about a *repository* are not: whether `git reset` is worth a
 * word depends entirely on whether the commit actually moves. Checks receive the context as a
 * second parameter, which the command-only checks above simply ignore.
 *
 * @param {string} command
 * @param {Array<object>} rules
 * @param {Object} [options]
 * @param {object} [options.checks] - Check registry override.
 * @param {object} [options.context] - State available to checks.
 * @param {'v1' | 'v2' | 'unknown'} [options.version] - Resolved OpenCode version.
 * @returns {Array<{id,severity,message,check,passed:boolean}>} only the VIOLATED rules.
 */
export function evaluate(command, rules, options = {}) {
  const registry = options.checks || CHECKS;
  const context = options.context;
  const hasVersion = [...SUPPORTED_FAMILIES, 'unknown'].includes(options.version);
  const commandText = String(command || '');
  const opencodeRun = commandText.match(QUOTED_OPENCODE_RUN_BINARY)
    || commandText.match(OPENCODE_RUN_BINARY);
  const hasApplicability = rules.some((rule) =>
    rule && Object.prototype.hasOwnProperty.call(rule, 'appliesTo'));
  let version = hasVersion ? options.version : undefined;
  let filterByVersion = hasVersion;

  if (!filterByVersion && opencodeRun && hasApplicability) {
    version = resolveOpencodeVersionSync(opencodeRun[1]);
    filterByVersion = true;
  }

  const violations = [];
  for (const rule of rules) {
    const fn = registry[rule.check];
    if (!fn) continue; // unknown check → skip (the CI validator catches typos, not this hot path)
    const appliesTo = Array.isArray(rule.appliesTo) ? rule.appliesTo : SUPPORTED_FAMILIES;
    const appliesToAll = SUPPORTED_FAMILIES.every((family) => appliesTo.includes(family));
    if (filterByVersion && version !== 'unknown' && !appliesTo.includes(version)) continue;
    let passed = true;
    try {
      passed = fn(String(command || ''), context);
    } catch {
      passed = true; // a check that throws must never block a dispatch (fail-open)
    }
    if (!passed) {
      const hasUnexpandedPatch = DSH_PATCH_ROSTER_CHECKS.has(rule.check)
        && dshDispatches(commandText).some(hasUnexpandedPatchValue);
      // A rule that declares itself blocking (`block` or the stronger `error`
      // the availability/self-invocation guards use) denies the dispatch;
      // everything else is advisory. A skill's own SKILL.md severity is the
      // source of truth here.
      const severity = filterByVersion && version === 'unknown' && !appliesToAll
        ? 'warn'
        : rule.severity;
      const blocking = severity === 'block' || severity === 'error';
      violations.push({
        id: rule.id,
        severity: blocking ? 'block' : 'warn',
        message: hasUnexpandedPatch ? DSH_PATCH_LITERAL_MESSAGE : (rule.message || rule.id),
        check: rule.check,
        passed: false,
      });
    }
  }
  return violations;
}

/**
 * Evaluate every dispatch in a command chain against its own packet's hard rules.
 *
 * A chain such as `opencode run ... && pi -p ...` is two dispatches governed by two packets,
 * and reading only the first packet held the second executor to the wrong rule set: cli-opencode
 * declares nothing about `--offline`, so the pi half of that chain was never checked at all.
 * Each resolved dispatch is therefore measured against the rules beside the SKILL.md of the
 * packet that governs it, and a packet that declares no rules contributes nothing.
 *
 * @param {string} command - raw command text.
 * @param {string} skillsRoot - directory holding the `cli-*` packets.
 * @param {Object} [options] - forwarded to `evaluate` (checks, context, version).
 * @returns {Array<{skill: string, violations: Array<object>}>} one item per packet with at
 *   least one violation, in command order; empty when nothing resolves or nothing is violated.
 */
export function evaluateDispatch(command, skillsRoot, options = {}) {
  const verdicts = [];
  for (const { skill, packetPath } of resolveDispatchPackets(command)) {
    const rules = readHardRules(path.join(skillsRoot, packetPath, 'SKILL.md'));
    if (rules.length === 0) continue; // packet declares nothing → nothing to enforce here
    const violations = evaluate(command, rules, options);
    if (violations.length > 0) verdicts.push({ skill, violations });
  }
  return verdicts;
}
