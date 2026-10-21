// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Audit Core
// ───────────────────────────────────────────────────────────────────
// Runtime-neutral core for the CLI dispatch audit trail.
//
// After a Bash tool call completes under either runtime, an adapter (the OpenCode
// tool.execute.after plugin, the Claude PostToolUse(Bash) hook) hands this module a raw
// command plus whatever output metadata its transport exposes. This file owns every step
// from there: recognizing a dispatch shape, pulling model/target/duration/size hints out of
// the command and metadata, scrubbing + truncating the command, formatting one JSONL line,
// and appending it to a size-rotated log. Nothing here writes to stdout/stderr or throws past
// its own boundary — every exported function fails open, because a telemetry bug must never
// affect the dispatch it observes.
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { appendFileSync, copyFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { dirname } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A single env var name, owned here so both runtime adapters read the exact same string
// rather than each hard-coding their own copy. Set to '1' to turn the whole surface into a
// full no-op under either runtime.
export const KILL_SWITCH_ENV = 'CLI_DISPATCH_AUDIT_DISABLED';

/** True when the kill-switch env var disables the whole audit surface. */
export function isAuditDisabled(env = process.env) {
  return env?.[KILL_SWITCH_ENV] === '1';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DISPATCH CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

// Dispatch-shape registry (kept for adapter compatibility)
export const DISPATCH_SHAPES = [
  {
    test: /\bopencode\d*\s+run\b/,
    skill: 'cli-opencode',
    packetPath: 'cli-external-orchestration/cli-opencode',
  },
  { test: /\bclaude\s+(-p|--print)\b/, skill: 'cli-claude-code', packetPath: 'cli-external-orchestration/cli-claude-code' },
  // Intervening flags (e.g. pi's required `--offline`, devin's `--model`) may sit
  // between the binary and the print flag, so allow any chars EXCEPT a shell
  // separator -- a `-p` after `&&`/`;`/`|` belongs to a different command.
  // Codex has no print flag: `exec` IS its headless subcommand, so requiring one here
  // matched no real dispatch and left every cli-codex rule unevaluated.
  { test: /\bcodex\s+exec\b/, skill: 'cli-codex', packetPath: 'cli-external-orchestration/cli-codex' },
  { test: /\bdevin\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-devin', packetPath: 'cli-external-orchestration/cli-devin' },
  { test: /\bcursor-agent\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-cursor', packetPath: 'cli-external-orchestration/cli-cursor' },
  { test: /\bpi\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-pi', packetPath: 'cli-external-orchestration/cli-pi' },
  // Hermes has no print flag: its headless forms are `hermes chat` with a query flag
  // (`-q`, `--query`, `--query-file`, or the non-TTY `--oneshot`) and the top-level `-z`
  // oneshot. A bare `hermes chat` or a management subcommand is not a dispatch.
  { test: /\bhermes\s+chat\b[^\n;&|]*\s(-q|--query|--query-file|--oneshot)\b|\bhermes\b[^\n;&|]*\s(-z)\b/, skill: 'cli-hermes', packetPath: 'cli-external-orchestration/cli-hermes' },
  // Jev has no print flag: the judgment subcommand IS the dispatch, exactly as `codex exec` is for
  // codex. `jev-mcp` is a stdio server rather than a judgment, and it is matched here so the
  // packet's host-only rule can refuse a shell start instead of leaving it unclassified.
  { test: /\bjev\s+(?:noul|choice|score|run)\b|\bjev-mcp\b/, skill: 'cli-classifier', packetPath: 'cli-classifier/cli-jev' },
];

const MAX_INSPECTED_COMMAND_CHARS = 32_768;
const ASSIGNMENT_TOKEN = /^[A-Za-z_][A-Za-z0-9_]*=(.*)$/s;
const EXECUTOR_BASENAMES = new Set([
  'claude',
  'codex',
  'devin',
  'cursor-agent',
  'pi',
  'hermes',
  'jev',
  'jev-mcp',
]);
const OPENCODE_EXECUTOR_RE = /^opencode\d*$/;
const PRINT_FLAGS = new Set(['-p', '--print']);
// Hermes's equivalents of a print flag, scoped to the hermes branch so `-q` on any other
// command (grep, curl) never reads as dispatch evidence.
const HERMES_QUERY_FLAGS = new Set(['-q', '--query', '--query-file', '--oneshot', '-z']);
const SEPARATORS = new Set(['&&', '||', ';', '|', '&']);

function basename(value) {
  const slash = value.lastIndexOf('/');
  return slash === -1 ? value : value.slice(slash + 1);
}

function isExecutorBasename(value) {
  return OPENCODE_EXECUTOR_RE.test(value) || EXECUTOR_BASENAMES.has(value);
}

function isAssignmentToken(token) {
  return !token.quoted && !token.expanded && ASSIGNMENT_TOKEN.test(token.value);
}

function makeWord(value, quoted, expanded) {
  return { value, quoted, expanded };
}

function tokenizeShell(command) {
  const segments = [[]];
  let value = '';
  let quoted = false;
  let expanded = false;
  let started = false;
  let quote = null;
  let escaped = false;
  let malformed = false;
  let unsupported = false;

  const pushWord = () => {
    if (!started) return;
    segments.at(-1).push(makeWord(value, quoted, expanded));
    value = '';
    quoted = false;
    expanded = false;
    started = false;
  };

  const pushSeparator = (separator) => {
    pushWord();
    if (SEPARATORS.has(separator)) segments.push([]);
  };

  for (let index = 0; index < command.length; index += 1) {
    const character = command[index];

    if (quote === "'") {
      if (character === "'") quote = null;
      else value += character;
      continue;
    }

    if (quote === '"') {
      if (character === '"') {
        quote = null;
      } else if (character === '\\' && index + 1 < command.length) {
        value += command[++index];
      } else {
        if (character === '$' || character === '`') expanded = true;
        value += character;
      }
      continue;
    }

    if (escaped) {
      value += character;
      escaped = false;
      started = true;
      continue;
    }

    if (character === '\\') {
      escaped = true;
      started = true;
      continue;
    }

    if (character === "'" || character === '"') {
      quote = character;
      quoted = true;
      started = true;
      continue;
    }

    if (character === '#' && !started) {
      while (index + 1 < command.length && command[index + 1] !== '\n') index += 1;
      continue;
    }

    if (/\s/.test(character)) {
      pushWord();
      if (character === '\n') pushSeparator(';');
      continue;
    }

    if (character === '&' || character === ';' || character === '|') {
      const next = command[index + 1];
      const separator = character === '&' && next === '&'
        ? '&&'
        : character === '|' && next === '|'
          ? '||'
          : character;
      if (separator.length === 2) index += 1;
      pushSeparator(separator);
      continue;
    }

    if ((character === '<' || character === '>') && (command[index + 1] === character || command[index + 1] === '&')) {
      unsupported = true;
    }

    if (character === '$' || character === '`') expanded = true;
    value += character;
    started = true;
  }

  if (quote !== null || escaped) malformed = true;
  pushWord();
  return { segments, malformed, unsupported };
}

function commandStart(tokens) {
  let index = 0;
  while (index < tokens.length && isAssignmentToken(tokens[index])) index += 1;

  if (tokens[index]?.value !== 'env' || tokens[index]?.quoted) return { index, opaque: false };
  index += 1;
  while (index < tokens.length) {
    const token = tokens[index];
    if (isAssignmentToken(token) || token.value === '-i' || token.value === '--ignore-environment') {
      index += 1;
      continue;
    }
    if (token.value === '-u' || token.value === '--unset') {
      index += 2;
      continue;
    }
    if (token.value.startsWith('-u') || token.value.startsWith('--unset=')) {
      index += 1;
      continue;
    }
    break;
  }
  return { index, opaque: false };
}

function directExecutor(tokens) {
  if (tokens.length === 0 || tokens.some((token) => token.expanded)) return null;
  const start = commandStart(tokens);
  if (start.opaque || start.index >= tokens.length) return null;
  const executable = tokens[start.index];
  // A quoted command-position token still names the binary the shell will run, so
  // `"devin" -p x` invokes devin exactly as the bare form does. Set membership below only
  // admits a recognized executor basename, so a multi-word quoted payload (e.g. "devin -p task")
  // stays out on its own — dropping quoted executors here instead let them evade both the
  // authorization gate and the audit trail.
  const binary = basename(executable.value);
  if (!isExecutorBasename(binary)) return null;

  if (OPENCODE_EXECUTOR_RE.test(binary) && tokens[start.index + 1]?.value === 'run') {
    return 'cli-opencode';
  }
  // `exec` is Codex's headless subcommand and takes no print flag, so its presence alone
  // is the dispatch evidence; demanding a print flag here recorded no codex run at all.
  if (binary === 'codex' && tokens[start.index + 1]?.value === 'exec') return 'cli-codex';
  if (binary === 'claude' || binary === 'devin' || binary === 'cursor-agent' || binary === 'pi') {
    return tokens.slice(start.index + 1).some((token) => PRINT_FLAGS.has(token.value))
      ? `cli-${binary === 'cursor-agent' ? 'cursor' : binary === 'claude' ? 'claude-code' : binary}`
      : null;
  }
  if (binary === 'hermes') {
    const rest = tokens.slice(start.index + 1);
    const isChat = rest[0]?.value === 'chat';
    const hasQueryFlag = rest.some((token) => HERMES_QUERY_FLAGS.has(token.value));
    // `hermes chat` plus a query flag, or the top-level `-z` oneshot, dispatches; a bare
    // `hermes chat`, `hermes status` or `hermes skills list` does not.
    if ((isChat && hasQueryFlag) || rest.some((token) => token.value === '-z')) return 'cli-hermes';
    return null;
  }
  // Jev's judgment subcommands are its headless forms. `jev --version`, `jev auth status` and
  // `jev install-skills` are management commands, not dispatches; `jev-mcp` is classified so the
  // packet's host-only rule can refuse a shell start, which is the misuse rather than the use.
  if (binary === 'jev' || binary === 'jev-mcp') {
    if (binary === 'jev-mcp') return 'cli-classifier';
    const subcommand = tokens[start.index + 1]?.value;
    return subcommand === 'noul' || subcommand === 'choice' || subcommand === 'score' || subcommand === 'run'
      ? 'cli-classifier'
      : null;
  }
  return null;
}

function hasKnownExecutorToken(tokens) {
  return tokens.some((token) => !token.quoted && isExecutorBasename(basename(token.value)));
}

function hasDispatchText(value) {
  return (
    /\bopencode\d*\s+run\b/.test(value)
    || /\b(?:claude|devin|cursor-agent|pi)\b[^\n;&|]*\s(?:-p|--print)\b/.test(value)
    || /\bcodex\s+exec\b/.test(value)
    || /\bhermes\s+chat\b[^\n;&|]*\s(?:-q|--query|--query-file|--oneshot)\b/.test(value)
    || /\bhermes\b[^\n;&|]*\s-z\b/.test(value)
    || /\bjev\s+(?:noul|choice|score|run)\b/.test(value)
  );
}

// The text one expansion token stands for: a command substitution split across words runs
// from its opening token to the token that closes it (`$(codex`, `exec`, `task)`), while a
// plain `$X` or `${X}` opens nothing and stands alone.
function expansionText(tokens, index) {
  const opening = tokens[index].value;
  const dollarAt = opening.indexOf('$(');
  const backtickAt = opening.indexOf('`');
  if (dollarAt === -1 && backtickAt === -1) return opening;
  const closesOnDollar = dollarAt !== -1 && (backtickAt === -1 || dollarAt < backtickAt);
  const isClosed = (text) => (closesOnDollar
    ? text.includes(')')
    : text.split('`').length > 2);
  let text = opening;
  for (let cursor = index + 1; cursor < tokens.length && !isClosed(text); cursor += 1) {
    text += ` ${tokens[cursor].value}`;
  }
  return text;
}

function hasDispatchEvidence(tokens, commandHasPrintFlag) {
  const hasPrintFlag = tokens.some((token) => PRINT_FLAGS.has(token.value));
  const knownExecutor = hasKnownExecutorToken(tokens);
  // An executor token only signals dispatch intent when it is embedded (alias value, env
  // assignment, path — `d=devin`, `x/pi`) AND a print flag is present: a bare `pi list` or
  // `devin auth status` is a plain CLI subcommand, not a dispatch. The flag is read
  // command-wide because the embedded signal can sit in a different segment than the flag
  // it belongs to (e.g. `alias d=devin; d -p task`).
  const embeddedExecutor = commandHasPrintFlag && tokens.some((token) => (
    !token.quoted
    && /(?:=|\/)(?:opencode\d*|claude|codex|devin|cursor-agent|pi)$/.test(token.value)
  ));
  // An expanded token stands in for the executor only in command position: `mkdir -p "$DIR"`
  // carries a print-shaped flag and a variable but runs mkdir, not a dispatch.
  const start = commandStart(tokens);
  const variableExecutor = hasPrintFlag && !start.opaque && Boolean(tokens[start.index]?.expanded);
  // An unquoted expansion is split on its spaces, so the token carries only its first word
  // (`$(codex`); read that substitution through its closing token with it, or a bare
  // `$(codex exec task)` stays invisible while its quoted form is caught. Stop at the close
  // rather than taking the rest of the segment, because a plain `$X` opens no substitution
  // and the words after it are ordinary arguments (`echo $X codex exec` dispatches nothing).
  const expandedDispatch = tokens.some((token, index) => token.expanded
    && hasDispatchText(expansionText(tokens, index)));
  return (knownExecutor && hasPrintFlag) || embeddedExecutor || variableExecutor || expandedDispatch;
}

/**
 * Inspect a bounded shell command without evaluating it.
 * @param {unknown} command - raw command text from the tool call.
 * @returns {{ kind: 'direct', executor: string } | { kind: 'ambiguous' } | { kind: 'none' }}
 */
export function inspectDispatch(command) {
  try {
    if (typeof command !== 'string' || command.length === 0 || command.length > MAX_INSPECTED_COMMAND_CHARS) {
      return { kind: 'none' };
    }

    const parsed = tokenizeShell(command);
    const direct = [];
    let candidate = false;
    const commandHasPrintFlag = parsed.segments.some((tokens) => tokens.some((token) => PRINT_FLAGS.has(token.value)));
    for (const tokens of parsed.segments) {
      const executor = directExecutor(tokens);
      if (executor) direct.push(executor);
      else if (hasDispatchEvidence(tokens, commandHasPrintFlag)) candidate = true;
    }

    if (!parsed.malformed && !parsed.unsupported && direct.length === 1 && !candidate) {
      return { kind: 'direct', executor: direct[0] };
    }

    if (direct.length > 0 || candidate) return { kind: 'ambiguous' };
    // The tokenizer reads `bash -c '<cmd>'` as a bash call with one quoted argument. Classify
    // every wrapped command instead, the same unwrap resolveSegment applies for the hooks, and
    // combine them the way the segments above combine.
    const inner = shellPayloads(command).map((payload) => inspectDispatch(payload));
    if (inner.some((result) => result.kind === 'ambiguous')) return { kind: 'ambiguous' };
    const wrapped = inner.filter((result) => result.kind === 'direct');
    if (wrapped.length === 1) return wrapped[0];
    if (wrapped.length > 1) return { kind: 'ambiguous' };
    return { kind: 'none' };
  } catch (_) {
    return { kind: 'none' };
  }
}

/**
 * Recognize a completed Bash command as a CLI dispatch, or fast-exit on anything else.
 *
 * Resolution runs through the same resolver the preflight decides with, so a dispatch
 * behind an exec wrapper (`nohup`, `command`, `env`, `timeout`, `perl -e ... --`, a
 * subshell) or a shell `-c` payload is recorded as well as one at the head of the command.
 * Matching only the direct shape left such a dispatch linted before it ran and absent from
 * the audit trail afterwards, because the preflight unwraps and this walk did not.
 *
 * @param {unknown} command - raw command text from the tool call.
 * @returns {{ skill: string } | null} the matched dispatch shape's skill name, or null.
 */
export function matchDispatchShape(command) {
  const [first] = resolveDispatchPackets(command);
  return first ? { skill: first.skill } : null;
}

// A shell wrapper hides a real dispatch inside a quoted argument, where the tokenizer
// correctly refuses to read it as an executor. Only these four wrappers are unwrapped,
// and only their `-c` payload, so ordinary quoted text stays text.
// A double-quoted payload runs to its closing quote, past any escaped quote inside it,
// and is unescaped the way the shell would before it is inspected.
const SHELL_WRAPPER = /(?:^|[\s;&|])(?:\/[^\s;&|]*\/)?(?:bash|sh|zsh|dash)\s+(?:-[a-z]*c|--command)\s+(?:'([^']*)'|"((?:\\[\s\S]|[^"\\])*)")/;

// The payload a shell wrapper match stands for, already unescaped the way the shell would
// before it hands the text to the child.
function shellPayloadText(match) {
  if (match[1] !== undefined) return match[1];
  // Inside double quotes the shell drops a backslash only before $ ` " \ and a newline.
  return match[2].replace(/\\\n/g, '').replace(/\\([$`"\\])/g, '$1');
}

/**
 * Return the command a shell wrapper runs, or null when the text has no wrapper.
 * @param {string} command - text that may hold a `bash -c '<cmd>'` style wrapper.
 * @returns {string | null} the unwrapped payload.
 */
function shellPayload(command) {
  const match = command.match(SHELL_WRAPPER);
  return match ? shellPayloadText(match) : null;
}

/**
 * Return the wrapper's payload only when the wrapper heads the segment.
 *
 * `inspectDispatch` already unwraps shell payloads internally, so its direct verdict can
 * describe a command one level below the text it was given. Callers that need the text the
 * executor receives unwrap again; the head check keeps a wrapper spelled INSIDE a prompt
 * (`opencode run "bash -c x"`) as prompt text instead of treating it as the dispatcher.
 * @param {string} command - one shell segment.
 * @returns {string | null} the head wrapper's payload, or null.
 */
function headShellPayload(command) {
  const match = command.match(SHELL_WRAPPER);
  if (!match || command.slice(0, match.index).trim() !== '') return null;
  return shellPayloadText(match);
}

/**
 * Return the command every shell wrapper in the text runs, in order.
 * @param {string} command - text that may hold several `bash -c '<cmd>'` style wrappers.
 * @returns {string[]} the unwrapped payloads, empty when the text has no wrapper.
 */
function shellPayloads(command) {
  const payloads = [];
  for (const match of command.matchAll(new RegExp(SHELL_WRAPPER.source, 'g'))) {
    payloads.push(shellPayloadText(match));
  }
  return payloads;
}

// An exec wrapper runs the real command in its own process, so the tokenizer reads the
// wrapper as the executor and stops. The list is exhaustive rather than sampled: a prefix the
// guard fails to unwrap is a way to dispatch without the audit record or the preflight
// refusal, so every prefix that hides an executor is recognised, whether or not a dispatch
// has used it yet.
//   perl -e 'alarm N; exec @ARGV' -- <cmd>   the portable timeout, macOS has no `timeout`
//   env -S '<cmd>' / env -S "<cmd>"          one quoted command string split by env
//   env [VAR=V ...] <cmd>                    sets or clears a marker for the child
//   timeout [flags] <seconds> <cmd>
//   nohup <cmd>                              detaches the child from the terminal
//   command [-p] [--] <cmd>                  the shell builtin; -v/-V only look a name up
//   ! <cmd>                                  negates the pipeline's status, runs it anyway
//   ( <cmd> )                                runs the command in a subshell
const EXEC_WRAPPERS = [
  // Everything after a bare `--` is the wrapped command.
  /^\s*(?:\/[^\s]*\/)?perl\s+[\s\S]*?\s--\s+([\s\S]+)$/,
  // `-S` takes the rest of its arguments as one quoted command string, which the general env
  // pattern below would split at the first word inside the quotes. Its own patterns win first.
  /^\s*(?:\/[^\s]*\/)?env\s+-S\s+'([\s\S]*?)'/,
  /^\s*(?:\/[^\s]*\/)?env\s+-S\s+"([\s\S]*?)"/,
  /^\s*(?:\/[^\s]*\/)?env\s+(?:-[a-zA-Z]\s+\S+\s+|-[a-zA-Z]+\s+|\w+=[^\s]*\s+)*([\s\S]+)$/,
  /^\s*(?:\/[^\s]*\/)?timeout\s+(?:-[^\s]+\s+)*[\d.]+[smhd]?\s+([\s\S]+)$/,
  /^\s*(?:\/[^\s]*\/)?nohup\s+(?:--\s+)?([\s\S]+)$/,
  // `-v` and `-V` print a name or its path and run nothing, so they are not unwrapped.
  /^\s*(?:\/[^\s]*\/)?command\s+(?!-[vV](?:\s|$))(?:-[pP]+\s+)?(?:--\s+)?([\s\S]+)$/,
  /^\s*!\s+([\s\S]+)$/,
  /^\s*\(\s*([\s\S]+?)\s*\)\s*$/,
];

// The deepest real nesting is three unwraps (`nohup env VAR=1 perl -e ... -- cmd`), and the
// loop spends one pass inspecting before each. Four is that depth, not a margin.
const MAX_UNWRAP_DEPTH = 4;

/**
 * Resolve a command to the packet whose rules govern it, or null when nothing does.
 *
 * The regex shape list matches its pattern anywhere in the command string, so a command
 * that merely CONTAINS a dispatch -- a grep for one, a heredoc documenting one, a prose
 * line quoting one -- read as a real dispatch and was refused. The tokenizer knows a
 * quoted argument is not an executor, so it decides; unwrapping a shell -c payload keeps
 * the one case the tokenizer would otherwise miss.
 *
 * @param {string} command - raw command text.
 * @returns {{skill: string, packetPath: string} | null}
 */
// A heredoc body is usually data the call WRITES, so a dispatch inside one must not be read
// as a dispatch: stripping it first is what separates "write a script that dispatches" from
// "dispatch". The body is commands the call RUNS when the same call also feeds it to a shell
// (`bash <<EOF`, `cat <<EOF | sh`) or writes it to a script it then runs
// (`cat > run.sh <<EOF` ... `bash run.sh`). Those two shapes resolved to nothing, so a
// dispatch inside them skipped every hard rule. Stripping keeps the written case;
// executedHeredocBodies recovers the run one.
function stripHeredocBodies(command) {
  return command.replace(/<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1[\s\S]*?^\s*\2\s*$/gm, '<<HEREDOC');
}

// The `<<EOF`, `<<-EOF`, `<<'EOF'` and `<<"EOF"` grammar stripHeredocBodies matches, read one
// heredoc at a time so the introducing line, the body and the lines after it stay available.
const HEREDOC_INTRODUCER = /<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1/g;
const HEREDOC_SHELLS = new Set(['bash', 'sh', 'zsh', 'dash']);
// The introducing line writes the body to a file with either `cat > PATH` (also `>>`, and the
// `cat <<EOF > PATH` order once the introducer is removed) or `tee PATH` (also `tee -a`).
const HEREDOC_WRITE_PATTERNS = [
  /(?:^|[\s;&|()])(?:[^\s;&|()]*\/)?cat\s+(?:-[A-Za-z-]+\s+)*(?:>>?)\s*(?:"([^"]+)"|'([^']+)'|([^\s;&|()<>]+))/,
  /(?:^|[\s;&|()])(?:[^\s;&|()]*\/)?tee\s+(?:-[A-Za-z-]+\s+)*(?:"([^"]+)"|'([^']+)'|([^\s;&|()<>]+))/,
];

// `./run.sh` and `run.sh` are the same file, and a quoted path is the same path.
function comparablePath(value) {
  return value.replace(/^(['"])([\s\S]*)\1$/, '$2').replace(/^\.\//, '');
}

function commandWords(text) {
  return tokenizeShell(text).segments.flat();
}

// `bash <<EOF` and `sh -s <<EOF` read the body from stdin, so every argument before the `<<`
// is a flag: `bash script.sh <<EOF` feeds the body to the SCRIPT, not to the shell.
// `cat <<EOF | sh` reaches a shell through a pipe instead.
function heredocFeedsShell(prefix, restOfLine) {
  const words = commandWords(prefix);
  let index = 0;
  while (index < words.length && isAssignmentToken(words[index])) index += 1;
  const commandWord = words[index];
  if (commandWord && HEREDOC_SHELLS.has(basename(commandWord.value))
    && words.slice(index + 1).every((word) => word.value.startsWith('-'))) {
    return true;
  }
  return /\|\s*(?:\/[^\s;&|]*\/)?(?:bash|sh|zsh|dash)\b/.test(restOfLine);
}

// The file the introducing line writes the body to, or null when it writes no file.
function heredocWriteTarget(introducingLine) {
  const withoutIntroducer = introducingLine
    .replace(/<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1/, '');
  for (const pattern of HEREDOC_WRITE_PATTERNS) {
    const match = withoutIntroducer.match(pattern);
    const target = match && (match[1] ?? match[2] ?? match[3]);
    if (target) return comparablePath(target);
  }
  return null;
}

// `bash run.sh`, `source run.sh`, `. run.sh`, `./run.sh` and a bare `run.sh` all run the file.
function heredocRunsPath(tail, target) {
  return shellSegments(tail).some((segment) => {
    const words = commandWords(segment);
    if (words.length === 0) return false;
    if (words.length >= 2 && HEREDOC_SHELLS.has(basename(words[0].value))) {
      if (comparablePath(words[1].value) === target) return true;
    }
    if (words.length >= 2 && (words[0].value === 'source' || words[0].value === '.')) {
      if (comparablePath(words[1].value) === target) return true;
    }
    return comparablePath(words[0].value) === target;
  });
}

// Every heredoc body the same call runs, in command order. A body that is only written stays
// out: no shell is fed it, and no later part of the call runs the file it was written to.
function executedHeredocBodies(command) {
  const bodies = [];
  let searchFrom = 0;
  for (;;) {
    HEREDOC_INTRODUCER.lastIndex = searchFrom;
    const introducer = HEREDOC_INTRODUCER.exec(command);
    if (!introducer) return bodies;
    const lineStart = command.lastIndexOf('\n', introducer.index) + 1;
    const introducerEnd = introducer.index + introducer[0].length;
    const lineBreak = command.indexOf('\n', introducerEnd);
    if (lineBreak === -1) return bodies;
    const closing = new RegExp(`^[ \\t]*${introducer[2]}[ \\t]*$`, 'm')
      .exec(command.slice(lineBreak + 1));
    if (!closing) return bodies;
    const bodyStart = lineBreak + 1;
    const bodyEnd = bodyStart + closing.index;
    const regionEnd = bodyEnd + closing[0].length;
    const introducingLine = command.slice(lineStart, lineBreak);
    const writeTarget = heredocWriteTarget(introducingLine);
    const feedsShell = heredocFeedsShell(
      command.slice(lineStart, introducer.index),
      command.slice(introducerEnd, lineBreak),
    );
    const runsWritten = writeTarget !== null && heredocRunsPath(command.slice(regionEnd), writeTarget);
    if (feedsShell || runsWritten) bodies.push(command.slice(bodyStart, bodyEnd));
    searchFrom = regionEnd;
  }
}

// Split on shell separators that sit outside quotes. A wrapper unwrap is anchored to the
// start of what it is given, so it only works once each segment is considered on its own:
// `cd /tmp && perl ... -- hermes chat ...` has the dispatch in the second segment.
//
// `tokenizeShell` above already segments quote-aware, and reusing it was the cheaper move.
// It fails here because it returns each segment as an array of parsed TOKENS with quoting
// removed, while the wrapper patterns below have to re-match against the original text:
// `perl -e 'alarm 300; exec @ARGV' -- ...` is unrecognisable once its quotes are gone.
function shellSegments(command) {
  const segments = [];
  let buf = '';
  let quote = null;
  for (let i = 0; i < command.length; i += 1) {
    const ch = command[i];
    if (quote) {
      buf += ch;
      if (ch === quote && command[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '\n' || ch === ';') { segments.push(buf); buf = ''; continue; }
    if ((ch === '&' || ch === '|') && command[i + 1] === ch) { segments.push(buf); buf = ''; i += 1; continue; }
    if (ch === '|') { segments.push(buf); buf = ''; continue; }
    buf += ch;
  }
  segments.push(buf);
  return segments.map((s) => s.trim()).filter(Boolean);
}

// A redirection is not part of the command being run, and a redirect whose target is a
// quoted variable (`> "$OUT"`, the shape every capture in this repo's playbook uses) makes
// the tokenizer lose the command entirely. Strip them before deciding WHICH packet governs.
// The rules are still evaluated against the original command text, so `</dev/null` is
// still visible to the stdin rule.
const REDIRECTION = /\s(?:\d?>>?|\d?<|&>>?|\d?>&\d?)\s*(?:"[^"]*"|'[^']*'|[^\s;&|]+)/g;

// Resolve one segment, unwrapping the wrappers that hide the real executor inside it.
// Redirection stripping is a LAST resort, never a first step: the pattern is not
// quote-aware, so running it up front ate the closing quote of a `bash -c "... </dev/null"`
// payload and broke the unwrap it was meant to help.
//
// The returned `text` is the command as the executor finally receives it, after every
// unwrap, so a caller reading flags or redirects tests the real arguments rather than the
// quoted wrapper payload that merely contains them.
function resolveSegment(segment, redirectionsStripped = false) {
  let current = segment;
  for (let depth = 0; depth <= MAX_UNWRAP_DEPTH; depth += 1) {
    const inspected = inspectDispatch(current);
    if (inspected.kind === 'direct') {
      const head = headShellPayload(current);
      if (head !== null) { current = head; continue; }
      return { skill: inspected.executor, text: current };
    }
    // Ambiguous means the tokenizer saw dispatch evidence inside ONE segment but could not
    // pin one executor. Match the shape list against that segment only: matching the whole
    // command is what made a call that merely quotes a dispatch read as one.
    if (inspected.kind === 'ambiguous') {
      const wrapped = shellPayload(current);
      if (wrapped !== null) { current = wrapped; continue; }
      // Test the shape against the segment with quoted spans blanked out. A command that
      // BUILDS a payload containing a dispatch (`P='{"command":"opencode run ..."}'`) reads
      // as ambiguous, and matching inside its quotes refused a call that dispatches nothing.
      // Escaped quotes inside a payload (`"{\"command\":\"codex exec ...\"}"`) must not end
      // the span, or the blanking stops at the first one and the dispatch text survives.
      const unquoted = current
        .replace(/'(?:\\.|[^'\\])*'/g, "''")
        .replace(/"(?:\\.|[^"\\])*"/g, '""');
      const skill = DISPATCH_SHAPES.find((d) => d.test.test(unquoted))?.skill || null;
      return skill ? { skill, text: current } : null;
    }
    const shell = shellPayload(current);
    if (shell !== null) { current = shell; continue; }
    const exec = EXEC_WRAPPERS.reduce((found, re) => found || current.match(re), null);
    if (exec) { current = exec[1]; continue; }
    // Nothing matched. A redirect to a quoted variable (`> "$OUT"`, what every capture in
    // this repo's playbook uses) makes the tokenizer lose the command, so retry once
    // without redirections. The rules still see the original text, so `</dev/null` stays
    // visible to the stdin rule.
    if (redirectionsStripped) return null;
    const stripped = current.replace(REDIRECTION, ' ').trim();
    return stripped === current ? null : resolveSegment(stripped, true);
  }
  return null;
}

/**
 * Resolve every dispatch in a command chain to the packet whose rules govern it.
 *
 * A shell chain can hold more than one dispatch -- `opencode run ... && pi -p ...` is two
 * calls governed by two different packets. Returning only the first one let the preflight
 * evaluate cli-opencode's rules for the whole chain, so a later executor's own hard rules
 * (a missing `--offline`, say) were never checked at all. Every dispatch has to be checked
 * against its own packet, so this returns each one in command order, deduplicated to the
 * first position where its skill appears.
 *
 * @param {string} command - raw command text.
 * @returns {Array<{skill: string, packetPath: string}>} one entry per distinct dispatch, in command order.
 */
export function resolveDispatchPackets(command) {
  return resolveDispatchCommands(command).map(({ entry }) => entry);
}

/**
 * Resolve every dispatch together with the argument text it was resolved from.
 *
 * `resolveDispatchPackets` answers WHICH packet governs; a rule check also needs the text
 * that packet's executor actually receives. A wrapper's quoted payload is the dispatcher's
 * text, not the executor's, so a rule testing the raw command reads a prompt's words as
 * flags. Each `text` here has already been unwrapped (shell `-c`, `nohup`, `env`, a
 * heredoc body) for exactly that reason.
 *
 * @param {string} command - raw command text.
 * @returns {Array<{entry: object, text: string}>} one item per distinct dispatch, in command order.
 */
export function resolveDispatchCommands(command) {
  return resolvePacketList(command, true);
}

// An executed heredoc body is resolved one level down: a heredoc inside that body is data the
// inner call writes unless that inner call runs it too, and reading it there would need the
// same evidence this level already refuses to assume.
function resolvePacketList(command, readExecutedHeredocs) {
  const raw = typeof command === 'string' ? command : '';
  if (!raw) return [];
  const dispatches = [];
  const seen = new Set();
  const add = (resolved) => {
    if (!resolved || seen.has(resolved.skill)) return;
    const entry = DISPATCH_SHAPES.find((d) => d.skill === resolved.skill);
    if (!entry) return;
    seen.add(resolved.skill);
    dispatches.push({ entry, text: resolved.text });
  };
  for (const segment of shellSegments(stripHeredocBodies(raw))) {
    add(resolveSegment(segment));
  }
  if (readExecutedHeredocs) {
    for (const body of executedHeredocBodies(raw)) {
      for (const resolved of resolvePacketList(body, false)) {
        add({ skill: resolved.entry.skill, text: resolved.text });
      }
    }
  }
  return dispatches;
}

/**
 * Resolve a command to the first packet whose rules govern it, or null when nothing does.
 *
 * The first result is what the single-packet callers need; callers that evaluate rules
 * for a whole chain use `resolveDispatchPackets` instead.
 *
 * @param {string} command - raw command text.
 * @returns {{skill: string, packetPath: string} | null}
 */
export function resolveDispatchPacket(command) {
  return resolveDispatchPackets(command)[0] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. METADATA EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

const MODEL_FLAG_REGEX = /--model[=\s]+("([^"]+)"|'([^']+)'|(\S+))/;
const AGENT_FLAG_REGEX = /--agent[=\s]+("([^"]+)"|'([^']+)'|(\S+))/;

function firstCapturedGroup(match) {
  if (!match) return null;
  return match[2] ?? match[3] ?? match[4] ?? null;
}

function firstFiniteNumber(...candidates) {
  for (const candidate of candidates) {
    // Number(null) === 0, so a present-but-null field (e.g. { exitCode: null, exit: 1 })
    // must not shadow a real later candidate with a false-but-finite zero.
    if (candidate === null || candidate === undefined) continue;
    const value = Number(candidate);
    if (Number.isFinite(value)) return value;
  }
  return null;
}

/**
 * Pull best-effort model/target/duration/size hints out of a dispatch command and whatever
 * transport metadata the adapter was able to read. Every field is optional and defensive:
 * an untyped or missing metadata object degrades to nulls, never a thrown error.
 * @param {unknown} command - raw command text.
 * @param {{ outputText?: string, outputBytes?: number, metadataObj?: object }} meta - transport metadata.
 * @returns {{ model: string|null, target: string|null, durationMs: number|null, exitCode: number|null, outputBytes: number|null }}
 */
export function extractDispatchMeta(command, meta = {}) {
  try {
    const cmd = typeof command === 'string' ? command : '';
    const model = firstCapturedGroup(MODEL_FLAG_REGEX.exec(cmd));
    const target = firstCapturedGroup(AGENT_FLAG_REGEX.exec(cmd));

    const metadataObj = meta && typeof meta.metadataObj === 'object' && meta.metadataObj !== null
      ? meta.metadataObj
      : {};
    const durationMs = firstFiniteNumber(
      metadataObj.durationMs, metadataObj.duration, metadataObj.elapsedMs, metadataObj.elapsed,
    );
    const exitCode = firstFiniteNumber(metadataObj.exitCode, metadataObj.exit, metadataObj.code);

    const outputText = typeof meta.outputText === 'string' ? meta.outputText : null;
    const outputBytes = outputText !== null
      ? Buffer.byteLength(outputText, 'utf8')
      : firstFiniteNumber(meta.outputBytes);

    return { model, target, durationMs, exitCode, outputBytes };
  } catch (_) {
    return { model: null, target: null, durationMs: null, exitCode: null, outputBytes: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REDACTION AND LINE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

const MAX_COMMAND_CHARS = 500;
const TRUNCATION_SUFFIX = '…[truncated]';
const REDACTED_PLACEHOLDER = '[REDACTED]';

// Dispatch commands carry composed prompt bodies that can embed env-injected secrets or
// long-lived tokens. Each pattern below replaces only the secret-shaped span, not the whole
// command, so the rest of the line stays useful for a reader while the token never lands on
// disk. Order matters: flag/assignment forms run first so a matched span cannot also be
// re-matched by the broader bearer-token pattern.
const SECRET_PATTERNS = [
  // --api-key / --token / --secret / --password flags, `=` or space form. Quote-aware value
  // group (mirrors MODEL_FLAG_REGEX/AGENT_FLAG_REGEX) so a quoted multi-word secret is consumed
  // in full instead of stopping at its first space.
  { regex: /(--?(?:api[-_]?key|token|secret|password)\b(?:[=\s]+))("([^"]+)"|'([^']+)'|(\S+))/gi, replacement: `$1${REDACTED_PLACEHOLDER}` },
  // ENV_VAR=value / envVar=value assignments where the var name contains token/key/secret/
  // password in any casing (case-insensitive; no fixed-casing or fixed-prefix assumption).
  // Quote-aware value group (mirrors MODEL_FLAG_REGEX/AGENT_FLAG_REGEX/the flag pattern above) so
  // a quoted multi-word secret (e.g. FOO_KEY="abc def ghi") is consumed in full instead of
  // leaking its tail after the first space.
  { regex: /\b([A-Za-z0-9_]*(?:token|key|secret|password)[A-Za-z0-9_]*=)("([^"]+)"|'([^']+)'|(\S+))/gi, replacement: `$1${REDACTED_PLACEHOLDER}` },
  // Authorization: Bearer|Basic <token> headers.
  { regex: /(Authorization:\s*(?:Bearer|Basic)\s+)("([^"]+)"|'([^']+)'|(\S+))/gi, replacement: `$1${REDACTED_PLACEHOLDER}` },
  // Header-style credentials in colon form: `X-Api-Key: <value>`, `Secret-Key: <value>`, or a
  // bare `Authorization: <value>` with no Bearer/Basic scheme. The scheme pattern above runs
  // first, so its match (and the "Bearer"/"Basic" keyword itself) is never re-consumed here —
  // the negative lookahead is a belt-and-suspenders guard against reprocessing it.
  { regex: /\b([A-Za-z0-9-]*(?:token|key|secret|password|authorization)[A-Za-z0-9-]*\s*:\s*)(?!(?:Bearer|Basic)\b)("([^"]+)"|'([^']+)'|(\S+))/gi, replacement: `$1${REDACTED_PLACEHOLDER}` },
  // Common provider secret-key prefixes appearing bare in the command text (hyphen-delimited
  // and underscore-delimited live/test key formats alike).
  { regex: /\b(sk-[A-Za-z0-9_-]{10,}|sk_(?:live|test)_[A-Za-z0-9]{10,}|pk_(?:live|test)_[A-Za-z0-9]{10,}|ghp_[A-Za-z0-9]{10,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{12,})\b/g, replacement: REDACTED_PLACEHOLDER },
  // Bare PEM key/certificate blocks (e.g. a private key piped straight into a command)
  // carry no token/key/secret keyword for the patterns above to anchor on, so they need
  // their own multi-line match. Non-greedy body + `s` flag so `.` spans the embedded
  // newlines between the BEGIN/END markers without over-consuming past the first block.
  { regex: /-----BEGIN [A-Z0-9 ]+(?:PRIVATE KEY|CERTIFICATE)-----[\s\S]+?-----END [A-Z0-9 ]+(?:PRIVATE KEY|CERTIFICATE)-----/g, replacement: REDACTED_PLACEHOLDER },
  // Bare JWTs (header.payload.signature) carry no keyword either; the base64url JSON header
  // always starts with `eyJ` (the encoding of `{"`), a reliable, low-false-positive anchor.
  { regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, replacement: REDACTED_PLACEHOLDER },
];

function scrubSecrets(text) {
  let scrubbed = text;
  for (const { regex, replacement } of SECRET_PATTERNS) {
    scrubbed = scrubbed.replace(regex, replacement);
  }
  return scrubbed;
}

function truncateCommand(text) {
  if (text.length <= MAX_COMMAND_CHARS) return { text, truncated: false };
  return { text: text.slice(0, MAX_COMMAND_CHARS) + TRUNCATION_SUFFIX, truncated: true };
}

// model/target are substrings pulled straight out of the raw command (see extractDispatchMeta)
// and can carry the same secret-shaped or oversized content the command itself can — so they
// must run through the identical scrub+truncate pipeline before they ever reach the line.
function scrubAndBoundField(value) {
  if (typeof value !== 'string') return value ?? null;
  return truncateCommand(scrubSecrets(value)).text;
}

/**
 * Build one redacted, length-bounded, single-line JSON string for the audit log.
 * Never throws: any internal failure degrades to null so the caller can skip the write
 * entirely rather than risk a partial or malformed line.
 * @param {object} record - merged shape + metadata + call-context fields.
 * @returns {string|null} a single JSONL line, or null if the record could not be built.
 */
export function buildAuditLine(record = {}) {
  try {
    const rawCommand = typeof record.command === 'string' ? record.command : '';
    const scrubbed = scrubSecrets(rawCommand);
    const { text: boundedCommand, truncated } = truncateCommand(scrubbed);

    const line = {
      schema_version: 1,
      ts: typeof record.ts === 'string' ? record.ts : new Date().toISOString(),
      runtime: record.runtime ?? null,
      sessionID: record.sessionID ?? null,
      callID: record.callID ?? null,
      skill: record.skill ?? null,
      command: boundedCommand,
      commandTruncated: truncated,
      model: scrubAndBoundField(record.model),
      target: scrubAndBoundField(record.target),
      durationMs: record.durationMs ?? null,
      exitCode: record.exitCode ?? null,
      outputBytes: record.outputBytes ?? null,
    };
    return JSON.stringify(line);
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LOG APPEND
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_LOG_RELATIVE_PATH = '.skilled/logs/cli-dispatch-audit.log';
const DEFAULT_MAX_LOG_BYTES = 512 * 1024;
const LOG_BACKUP_SUFFIX = '.1';

/**
 * Append one pre-built JSONL line to the audit log, rotating it to a `.1` backup first when
 * the primary file has reached the size cap. Mirrors system-dist-freshness-guard's appendGuardLog
 * copy+truncate rotation. Fail-open: any read/write error is swallowed and the caller gets a
 * `false` back rather than a thrown exception, so an unwritable log can never affect the
 * dispatch it is auditing.
 * @param {string} logPath - absolute path to the audit log file.
 * @param {string} line - one JSONL line, no trailing newline.
 * @returns {boolean} true when the line was written.
 */
export function appendAuditLog(logPath, line) {
  if (typeof logPath !== 'string' || logPath.length === 0) return false;
  if (typeof line !== 'string' || line.length === 0) return false;
  try {
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= DEFAULT_MAX_LOG_BYTES) {
        copyFileSync(logPath, `${logPath}${LOG_BACKUP_SUFFIX}`);
        truncateSync(logPath, 0);
      }
    } catch (_) {
      // A missing/unreadable active log is the normal first-write case.
    }
    appendFileSync(logPath, `${line}\n`, 'utf8');
    return true;
  } catch (_) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FULL PIPELINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the whole match -> extract -> build -> append pipeline for one completed Bash call.
 * Both runtime adapters call this after normalizing their own transport shape, so the
 * sequencing itself lives in exactly one place. Fail-open throughout: any internal error
 * resolves to a `false` return, never a thrown exception.
 * @param {{ command: unknown, logPath: string, runtime?: string, sessionID?: string,
 *   callID?: string, outputText?: string, outputBytes?: number, metadataObj?: object,
 *   env?: NodeJS.ProcessEnv }} params
 * @returns {boolean} true when an audit line was matched and written.
 */
export function recordDispatch(params = {}) {
  try {
    if (isAuditDisabled(params.env)) return false;

    const shape = matchDispatchShape(params.command);
    if (!shape) return false;

    const meta = extractDispatchMeta(params.command, {
      outputText: params.outputText,
      outputBytes: params.outputBytes,
      metadataObj: params.metadataObj,
    });

    const line = buildAuditLine({
      ts: new Date().toISOString(),
      runtime: params.runtime ?? null,
      sessionID: params.sessionID ?? null,
      callID: params.callID ?? null,
      skill: shape.skill,
      command: params.command,
      ...meta,
    });
    if (!line) return false;

    return appendAuditLog(params.logPath, line);
  } catch (_) {
    return false;
  }
}
