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
//
import { appendFileSync, copyFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { dirname } from 'node:path';

// A single env var name, owned here so both runtime adapters read the exact same string
// rather than each hard-coding their own copy. Set to '1' to turn the whole surface into a
// full no-op under either runtime.
export const KILL_SWITCH_ENV = 'MK_CLI_DISPATCH_AUDIT_DISABLED';

/** True when the kill-switch env var disables the whole audit surface. */
export function isAuditDisabled(env = process.env) {
  return env?.[KILL_SWITCH_ENV] === '1';
}

// ── Dispatch-shape registry (kept for adapter compatibility) ───────────────────────────────

export const DISPATCH_SHAPES = [
  { test: /\bopencode\s+run\b/, skill: 'cli-opencode', packetPath: 'cli-external-orchestration/cli-opencode' },
  { test: /\bclaude\s+(-p|--print)\b/, skill: 'cli-claude-code', packetPath: 'cli-external-orchestration/cli-claude-code' },
  // Intervening flags (e.g. pi's required `--offline`, devin's `--model`) may sit
  // between the binary and the print flag, so allow any chars EXCEPT a shell
  // separator -- a `-p` after `&&`/`;`/`|` belongs to a different command.
  { test: /\bcodex\s+exec\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-codex', packetPath: 'cli-external-orchestration/cli-codex' },
  { test: /\bdevin\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-devin', packetPath: 'cli-external-orchestration/cli-devin' },
  { test: /\bcursor-agent\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-cursor', packetPath: 'cli-external-orchestration/cli-cursor' },
  { test: /\bpi\b[^\n;&|]*\s(-p|--print)\b/, skill: 'cli-pi', packetPath: 'cli-external-orchestration/cli-pi' },
];

const MAX_INSPECTED_COMMAND_CHARS = 32_768;
const ASSIGNMENT_TOKEN = /^[A-Za-z_][A-Za-z0-9_]*=(.*)$/s;
const EXECUTOR_BASENAMES = new Set(['opencode', 'claude', 'codex', 'devin', 'cursor-agent', 'pi']);
const PRINT_FLAGS = new Set(['-p', '--print']);
const SEPARATORS = new Set(['&&', '||', ';', '|', '&']);

function basename(value) {
  const slash = value.lastIndexOf('/');
  return slash === -1 ? value : value.slice(slash + 1);
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
  // admits an exact executor basename, so a multi-word quoted payload (e.g. "devin -p task")
  // stays out on its own — dropping quoted executors here instead let them evade both the
  // authorization gate and the audit trail.
  const binary = basename(executable.value);
  if (!EXECUTOR_BASENAMES.has(binary)) return null;

  if (binary === 'opencode' && tokens[start.index + 1]?.value === 'run') return 'cli-opencode';
  if (binary === 'codex' && tokens[start.index + 1]?.value === 'exec') {
    return tokens.slice(start.index + 2).some((token) => PRINT_FLAGS.has(token.value)) ? 'cli-codex' : null;
  }
  if (binary === 'claude' || binary === 'devin' || binary === 'cursor-agent' || binary === 'pi') {
    return tokens.slice(start.index + 1).some((token) => PRINT_FLAGS.has(token.value))
      ? `cli-${binary === 'cursor-agent' ? 'cursor' : binary === 'claude' ? 'claude-code' : binary}`
      : null;
  }
  return null;
}

function hasKnownExecutorToken(tokens) {
  return tokens.some((token) => !token.quoted && EXECUTOR_BASENAMES.has(basename(token.value)));
}

function hasDispatchText(value) {
  return /\bopencode\s+run\b|\b(?:claude|devin|cursor-agent|pi)\b[^\n;&|]*\s(?:-p|--print)\b|\bcodex\s+exec\b[^\n;&|]*\s(?:-p|--print)\b/.test(value);
}

function hasDispatchEvidence(tokens, commandHasPrintFlag) {
  const hasPrintFlag = tokens.some((token) => PRINT_FLAGS.has(token.value));
  const knownExecutor = hasKnownExecutorToken(tokens);
  // An executor token only signals dispatch intent when it is embedded (alias value, env
  // assignment, path — `d=devin`, `x/pi`) AND a print flag is present: a bare `pi list` or
  // `devin auth status` is a plain CLI subcommand, not a dispatch. The flag is read
  // command-wide because the embedded signal can sit in a different segment than the flag
  // it belongs to (e.g. `alias d=devin; d -p task`).
  const embeddedExecutor = commandHasPrintFlag && tokens.some((token) => !token.quoted && /(?:=|\/)(?:opencode|claude|codex|devin|cursor-agent|pi)$/.test(token.value));
  const variableExecutor = tokens.some((token) => token.expanded) && hasPrintFlag;
  const expandedDispatch = tokens.some((token) => token.expanded && hasDispatchText(token.value));
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
    return { kind: 'none' };
  } catch (_) {
    return { kind: 'none' };
  }
}

/**
 * Recognize a completed Bash command as a CLI dispatch, or fast-exit on anything else.
 * @param {unknown} command - raw command text from the tool call.
 * @returns {{ skill: string } | null} the matched dispatch shape's skill name, or null.
 */
export function matchDispatchShape(command) {
  const inspected = inspectDispatch(command);
  return inspected.kind === 'direct' ? { skill: inspected.executor } : null;
}

// ── Metadata extraction ──────────────────────────────────────────────────────────────────────

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

// ── Redaction + line formatting ──────────────────────────────────────────────────────────────

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

// ── Size-rotated append ──────────────────────────────────────────────────────────────────────

export const DEFAULT_LOG_RELATIVE_PATH = '.opencode/logs/cli-dispatch-audit.log';
const DEFAULT_MAX_LOG_BYTES = 512 * 1024;
const LOG_BACKUP_SUFFIX = '.1';

/**
 * Append one pre-built JSONL line to the audit log, rotating it to a `.1` backup first when
 * the primary file has reached the size cap. Mirrors mk-dist-freshness-guard's appendGuardLog
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

// ── Full pipeline (convenience entrypoint for adapters) ──────────────────────────────────────

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
