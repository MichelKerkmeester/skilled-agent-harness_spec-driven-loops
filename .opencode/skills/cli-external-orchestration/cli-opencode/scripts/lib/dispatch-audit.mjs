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
// The dispatch-shape regexes are the single source of truth shared with the PreToolUse
// preflight lint (dispatch-preflight-lint.mjs), so the two can never disagree about what
// counts as a dispatch.

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

// ── Dispatch-shape registry (shared with the preflight lint twin) ───────────────────────────

export const DISPATCH_SHAPES = [
  { test: /\bopencode\s+run\b/, skill: 'cli-opencode', packetPath: 'cli-external-orchestration/cli-opencode' },
  { test: /\bclaude\s+(-p|--print)\b/, skill: 'cli-claude-code', packetPath: 'cli-external-orchestration/cli-claude-code' },
];

/**
 * Recognize a completed Bash command as a CLI dispatch, or fast-exit on anything else.
 * @param {unknown} command - raw command text from the tool call.
 * @returns {{ skill: string } | null} the matched dispatch shape's skill name, or null.
 */
export function matchDispatchShape(command) {
  if (typeof command !== 'string' || command.length === 0) return null;
  const shape = DISPATCH_SHAPES.find((candidate) => candidate.test.test(command));
  return shape ? { skill: shape.skill } : null;
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
