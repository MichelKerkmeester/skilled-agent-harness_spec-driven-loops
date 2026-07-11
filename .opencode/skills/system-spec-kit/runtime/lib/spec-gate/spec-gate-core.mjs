// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: spec-gate core (runtime-neutral Gate-3 policy)                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Runtime-agnostic classify + enforce policy that turns the        ║
// ║          "spec folder before any file mutation" rule from a prompt-time  ║
// ║          instruction into session-scoped state both runtimes can read.   ║
// ║          classifyIntent() reads each user turn: it parses an answer to   ║
// ║          an already-open gate, or opens the gate and returns a bounded   ║
// ║          question when the turn triggers file-mutation intent.          ║
// ║          evaluateMutation() reads the cached gate state for a Write/Edit ║
// ║          and returns allow/advise/deny -- deny only when the opt-in      ║
// ║          enforce env is set. This module performs the atomic session-    ║
// ║          state persistence and exposes an appendable warning log and a   ║
// ║          throttled sweep, but it NEVER writes to stdout/stderr and NEVER ║
// ║          appends its own log -- each runtime adapter owns transport and  ║
// ║          decides whether/when to call the exported logging helpers.      ║
// ║          Every entrypoint fails OPEN: any unreadable/corrupt state, a    ║
// ║          classifier throw, an unresolvable root, or an unexpected        ║
// ║          argument shape resolves to allow/no-op with no side effects.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// The shared Gate-3 classifier compiles to ESM (`shared/package.json` declares
// "type":"module"), so this core must be ESM too -- a CommonJS `require()` of an
// ESM module fails at runtime. Import the already-compiled dist artifact
// directly; nothing under `mcp_server/` is touched or rebuilt by this module.
import { classifyPrompt, validateSpecFolderBinding } from '../../../shared/dist/gate-3-classifier.js';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GATE_STATE_DIR_RELATIVE_PATH = '.opencode/skills/.spec-gate-state';
const GATE_ARCHIVE_DIR_NAME = '.archive';
const WARN_LOG_FILENAME = 'spec-gate-warnings.log';
const WARN_LOG_BACKUP_SUFFIX = '.1';
const WARN_LOG_MAX_BYTES_ENV = 'MK_SPEC_GATE_WARNING_LOG_MAX_BYTES';
const SWEEP_LOCK_DIR_NAME = '.sweep.lock';
const STATE_TEMP_FILE_REGEX = /^[0-9a-f]+\.json\.\d+\.\d+\.tmp$/;

/** Deny is opt-in: unset (default) means classify-and-advise only, never deny. */
export const ENFORCE_ENV = 'MK_SPEC_GATE_ENFORCE';
/** Full no-op kill-switch: both classify and enforce become inert. */
export const DISABLED_ENV = 'MK_SPEC_GATE_DISABLED';
/**
 * Cross-runtime convention for an orchestrated child/dispatched sub-session
 * (see worktree-session.sh's own child-detection branch and the cli-external
 * dispatch recipes). A dispatched session has no user turn to answer Gate 3,
 * so it must never be denied even when the enforce env leaks into its
 * environment -- only the exact value '1' reads as a child; every other
 * value (unset, '0', 'true', 'yes', ...) is treated as interactive, the safe
 * default when the signal is missing or ambiguous.
 */
export const CHILD_SESSION_ENV = 'AI_SESSION_CHILD';

export function isChildSession(env) {
  const environment = env && typeof env === 'object' ? env : {};
  return environment[CHILD_SESSION_ENV] === '1';
}

/**
 * Canonical no-session state key. Every adapter that can call classifyIntent()
 * or evaluateMutation() with a missing/empty sessionID MUST resolve to this
 * exact token before (or by leaving sessionID undefined and letting
 * sessionStateKey() below) apply the fallback -- otherwise classify and
 * enforce silently key the same "no session" turn to two different state
 * files and each surface goes blind to the other's state.
 */
export const UNKNOWN_SESSION_ID = '__unknown-session__';

const GATE_ACTIVE_RETENTION_DAYS_ENV = 'MK_SPEC_GATE_ACTIVE_RETENTION_DAYS';
const GATE_ARCHIVE_RETENTION_DAYS_ENV = 'MK_SPEC_GATE_ARCHIVE_RETENTION_DAYS';
const GATE_SWEEP_INTERVAL_MS_ENV = 'MK_SPEC_GATE_SWEEP_INTERVAL_MS';
const DEFAULT_ACTIVE_RETENTION_DAYS = 2;
const DEFAULT_ARCHIVE_RETENTION_DAYS = 90;
const DEFAULT_SWEEP_INTERVAL_MS = 60 * 60 * 1000;
const DEFAULT_WARN_LOG_MAX_BYTES = 256 * 1024;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Tools whose target file the enforce surface evaluates at all. */
export const MUTATING_TOOLS = new Set(['write', 'edit', 'patch', 'multiedit', 'apply_patch', 'apply-patch']);
/** The single deterministic, high-confidence deny predicate never covers anything wider than this. */
export const DENY_CAPABLE_TOOLS = new Set(['write', 'edit']);

// A small, fixed string -- the guard never echoes the classifier's matched-token
// arrays into the TUI or injected context (see NFR-S01).
export const GATE_3_QUESTION = [
  'SPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit, pick one:',
  'A) Use an existing spec folder (name it)',
  'B) Create a new spec folder',
  'C) Update a related spec folder (name it)',
  'D) Use a phase folder (e.g. .opencode/specs/<parent>/<NNN-phase>, name it)',
  'E) Skip (no spec folder needed for this change)',
].join('\n');

// The human-facing relay question above and the model-facing deny reason
// below are deliberately different strings: GATE_3_QUESTION is what the USER
// sees (a menu to answer); GATE_3_DENY_DETAIL is what the MODEL sees when a
// Write/Edit is actually blocked -- an instruction to go get that answer from
// the user, not a menu the model itself could try to resolve alone.
export const GATE_3_DENY_DETAIL = 'DENIED: this Write/Edit needs a bound spec folder first. Ask the USER to reply with a letter A-E naming an existing (or new) spec folder, then retry.';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- session-scoped state (atomic file persistence)
// ─────────────────────────────────────────────────────────────────────────────

export function sessionStateKey(sessionID) {
  return Buffer.from(String(sessionID ?? UNKNOWN_SESSION_ID), 'utf8').toString('hex');
}

export function resolveGuardPaths(projectDir) {
  const dir = projectDir || process.cwd();
  return { stateDir: join(dir, GATE_STATE_DIR_RELATIVE_PATH) };
}

function gateStatePath(stateDir, sessionID) {
  return join(stateDir, `${sessionStateKey(sessionID)}.json`);
}

export function readGateState(stateDir, sessionID) {
  try {
    const raw = readFileSync(gateStatePath(stateDir, sessionID), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    // Missing, corrupt, or unreadable state reads as "never opened" -- fail open.
    return {};
  }
}

export function writeGateStateAtomic(stateDir, sessionID, state) {
  try {
    mkdirSync(stateDir, { recursive: true });
  } catch (_) {
    return false;
  }
  const finalPath = gateStatePath(stateDir, sessionID);
  const tempPath = `${finalPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tempPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    renameSync(tempPath, finalPath);
    return true;
  } catch (_) {
    try { unlinkSync(tempPath); } catch (_ignored) { /* best-effort cleanup */ }
    // Fail open: a persistence error must never block the write it guards.
    return false;
  }
}

export function evictGateState(stateDir, sessionID) {
  try {
    unlinkSync(gateStatePath(stateDir, sessionID));
    return true;
  } catch (_) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS -- warning log + retention (adapter-invoked only)
// ─────────────────────────────────────────────────────────────────────────────

function positiveIntFromEnv(env, name, fallback) {
  const raw = Number((env || process.env)[name]);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : fallback;
}

function maintainWarningLogPath(logPath, incomingBytes = 0) {
  const retentionMs = positiveIntFromEnv(process.env, GATE_ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;

  for (const candidatePath of [logPath, `${logPath}${WARN_LOG_BACKUP_SUFFIX}`]) {
    try {
      const fileStats = statSync(candidatePath);
      if (Date.now() - fileStats.mtimeMs > retentionMs) unlinkSync(candidatePath);
    } catch (_) {
      // Absent or unreadable logs require no maintenance.
    }
  }

  try {
    const fileStats = statSync(logPath);
    const maxBytes = positiveIntFromEnv(process.env, WARN_LOG_MAX_BYTES_ENV, DEFAULT_WARN_LOG_MAX_BYTES);
    if (fileStats.size + incomingBytes <= maxBytes) return;

    const backupPath = `${logPath}${WARN_LOG_BACKUP_SUFFIX}`;
    try { unlinkSync(backupPath); } catch (_ignored) { /* a prior generation is optional */ }
    renameSync(logPath, backupPath);
  } catch (_) {
    // Absent or unreadable logs require no rotation.
  }
}

const LOG_FIELD_UNSAFE_CHARS_REGEX = /[\r\n|]+/g;
const LOG_FIELD_MAX_LENGTH = 500;

function sanitizeLogField(value) {
  const text = value === null || value === undefined ? '' : String(value);
  const collapsed = text.replace(LOG_FIELD_UNSAFE_CHARS_REGEX, ' ').trim();
  if (collapsed.length === 0) return '-';
  return collapsed.length > LOG_FIELD_MAX_LENGTH ? `${collapsed.slice(0, LOG_FIELD_MAX_LENGTH)}...` : collapsed;
}

const PATH_REDACTED_PLACEHOLDER = '[REDACTED]';

// The target filePath itself can carry a secret-shaped segment (e.g. a file
// or directory literally named "token=sk_live_...") even though command
// contents are already excluded from this telemetry line entirely -- mirrors
// the secret-scrub idiom cli-external/cli-opencode's dispatch-audit core uses
// (see scripts/lib/dispatch-audit.mjs SECRET_PATTERNS), scoped down to the
// two shapes that actually occur in a filesystem path: a key=value-style
// segment naming a token/key/secret/password, and a bare known provider
// secret-key prefix. Each pattern replaces only the secret-shaped span, never
// the whole path, so the rest stays useful for a reader while the value never
// lands on disk.
const PATH_SECRET_PATTERNS = [
  { regex: /\b([A-Za-z0-9_]*(?:token|key|secret|password)[A-Za-z0-9_]*=)([^/\\?#]+)/gi, replacement: `$1${PATH_REDACTED_PLACEHOLDER}` },
  { regex: /\b(sk-[A-Za-z0-9_-]{10,}|sk_(?:live|test)_[A-Za-z0-9]{6,}|pk_(?:live|test)_[A-Za-z0-9]{6,}|ghp_[A-Za-z0-9]{10,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{12,})\b/g, replacement: PATH_REDACTED_PLACEHOLDER },
];

function redactPathSecrets(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) return filePath;
  let redacted = filePath;
  for (const { regex, replacement } of PATH_SECRET_PATTERNS) {
    redacted = redacted.replace(regex, replacement);
  }
  return redacted;
}

/**
 * Compose the one canonical, single-line telemetry payload both runtime
 * adapters write on every advise / would-deny mutation event. Every field is
 * sanitized independently (pipes and newlines stripped, length-clamped) so a
 * hostile filePath or sessionID can never inject a second log line or
 * misalign the parser -- the fields are joined AFTER sanitization, so a
 * stripped pipe inside one field can never be confused with a real
 * separator. filePath is additionally secret-scrubbed (see
 * redactPathSecrets) BEFORE sanitization, so a secret-shaped path segment
 * never reaches the retained log even once.
 *
 * @param {{ runtime?: string, sessionID?: string, tool?: string, filePath?: string, decision?: string }} event
 * @returns {string}
 */
export function formatSpecGateEvent(event = {}) {
  const { runtime, sessionID, tool, filePath, decision } = event;
  return [runtime, sessionID, tool, redactPathSecrets(filePath), decision].map(sanitizeLogField).join(' | ');
}

/**
 * Append one advisory line to the bounded, rotated spec-gate warning log.
 * Adapter-invoked only -- classifyIntent/evaluateMutation never call this
 * themselves, so the core stays transport-free. `detail` is expected to
 * already be a composed, single-line payload (see formatSpecGateEvent
 * above); this still strips any stray newline so a careless caller can never
 * split one advisory into two log lines.
 */
export function appendWarningLog(stateDir, detail) {
  const safeDetail = typeof detail === 'string' ? detail.replace(/[\r\n]+/g, ' ') : String(detail ?? '');
  const line = `${new Date().toISOString()} [mk-spec-gate] ${safeDetail}\n`;
  try {
    mkdirSync(stateDir, { recursive: true });
    const logPath = join(stateDir, WARN_LOG_FILENAME);
    maintainWarningLogPath(logPath, Buffer.byteLength(line));
    appendFileSync(logPath, line, 'utf8');
    return true;
  } catch (_) {
    // Fail open: swallow logging errors so the guarded mutation is untouched.
    return false;
  }
}

function ensureGateArchiveDir(stateDir) {
  const archiveDir = join(stateDir, GATE_ARCHIVE_DIR_NAME);
  try {
    mkdirSync(archiveDir, { recursive: true, mode: 0o700 });
  } catch (_) {
    return null;
  }
  return archiveDir;
}

function pruneGateArchive(stateDir) {
  const archiveDir = join(stateDir, GATE_ARCHIVE_DIR_NAME);
  let entries;
  try {
    entries = readdirSync(archiveDir, { withFileTypes: true });
  } catch (_) {
    return;
  }
  const retentionMs = positiveIntFromEnv(process.env, GATE_ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;
  const now = Date.now();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = join(archiveDir, entry.name);
    try {
      const fileStats = statSync(filePath);
      if (now - fileStats.mtimeMs > retentionMs) unlinkSync(filePath);
    } catch (_) {
      // Fail open on a single entry; the rest of the prune pass still runs.
    }
  }
}

function acquireSweepLock(stateDir, intervalMs, now) {
  try {
    mkdirSync(stateDir, { recursive: true });
  } catch (_) {
    return null;
  }

  const lockPath = join(stateDir, SWEEP_LOCK_DIR_NAME);
  try {
    mkdirSync(lockPath, { mode: 0o700 });
    return lockPath;
  } catch (error) {
    if (!error || error.code !== 'EEXIST') return null;
  }

  try {
    const lockStats = statSync(lockPath);
    if (now - lockStats.mtimeMs <= intervalMs) return null;
    rmdirSync(lockPath);
    mkdirSync(lockPath, { mode: 0o700 });
    return lockPath;
  } catch (_) {
    return null;
  }
}

/**
 * Archive per-session gate-state files untouched past the active-retention
 * window, then prune the archive itself. Throttled to once per sweep interval
 * via runtimeState, mirroring the deep-loop dispatch-guard's own sweep.
 */
export function sweepStaleGateStates(stateDir, runtimeState) {
  let lockPath = null;
  try {
    const intervalMs = positiveIntFromEnv(process.env, GATE_SWEEP_INTERVAL_MS_ENV, DEFAULT_SWEEP_INTERVAL_MS);
    const now = Date.now();
    if (now - (runtimeState.lastGateSweepAtMs || 0) <= intervalMs) return;
    lockPath = acquireSweepLock(stateDir, intervalMs, now);
    if (!lockPath) return;
    runtimeState.lastGateSweepAtMs = now;

    maintainWarningLogPath(join(stateDir, WARN_LOG_FILENAME));

    let entries;
    try {
      entries = readdirSync(stateDir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    const archiveDir = ensureGateArchiveDir(stateDir);
    if (!archiveDir) return;

    const activeRetentionMs = positiveIntFromEnv(process.env, GATE_ACTIVE_RETENTION_DAYS_ENV, DEFAULT_ACTIVE_RETENTION_DAYS) * MS_PER_DAY;
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const sourcePath = join(stateDir, entry.name);

      if (STATE_TEMP_FILE_REGEX.test(entry.name)) {
        try {
          const fileStats = statSync(sourcePath);
          if (now - fileStats.mtimeMs > activeRetentionMs) unlinkSync(sourcePath);
        } catch (_) {
          // Fail open on a single entry; the rest of the sweep pass still runs.
        }
        continue;
      }

      if (!entry.name.endsWith('.json')) continue;
      try {
        const fileStats = statSync(sourcePath);
        if (now - fileStats.mtimeMs <= activeRetentionMs) continue;
        renameSync(sourcePath, join(archiveDir, entry.name));
      } catch (_) {
        // Fail open on a single entry; the rest of the sweep pass still runs.
      }
    }

    pruneGateArchive(stateDir);
  } catch (_) {
    // Fail open: a sweep error must never affect session startup.
  } finally {
    if (lockPath) {
      try { rmdirSync(lockPath); } catch (_) { /* a lost lock must not affect startup */ }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS -- answer parsing
// ─────────────────────────────────────────────────────────────────────────────

// Bare "skip" / "skip it", optionally followed by a short aside that is
// clearly SEPARATED from the word itself (a dash/colon/comma/period right
// after "skip", or end of string) -- never a bare word running straight into
// a full sentence ("skip the lint errors ... fix the parser"), which is
// prose ABOUT skipping something else, not an answer to Gate 3.
const SKIP_WORD_REGEX = /^\s*skip\b(?:\s+it\b)?\s*(?:[-:,.]|$)/i;
// A standalone "D"/"d" immediately followed by punctuation or end of string.
// A bare hyphen is deliberately EXCLUDED from the immediate-adjacency class
// (only comma/period/colon/close-paren qualify there): "D-danger" is a
// compound word fused directly onto the letter with no separating
// whitespace, not the dash-separator convention ("D - clarification"), so a
// hyphen only counts as a separator when preceded by whitespace (`\s+-`).
// Never a bare letter running into ordinary prose ("D is the wrong option,
// use A instead"), which is prose ABOUT option D, not a chosen skip.
const STANDALONE_LETTER_D_REGEX = /^\s*[dD](?:[,.:)]|\s+-|$)/;
const ANSWER_LETTER_PREFIX_REGEX = /^\s*([a-eA-E])(?=[\s,.:)\-]|$)/;
// A closed set of natural lead-ins ("option B", "go with C", ...) so the
// letter still registers when the bare-token bind below needs it, without
// opening the grammar to arbitrary prose that happens to contain a letter.
// D is special-cased in answerParse() below: even through this lead-in
// grammar it is always the SKIP option, never a folder-binding target.
const NATURAL_LEAD_IN_LETTER_REGEX = /^\s*(?:option|choice|answer|go with|use option)\s+([a-eA-E])(?=[\s,.:)\-]|$)/i;
// A skip answer must be a COMPLETE, unambiguous standalone reply. A trailing
// clause that either negates the skip itself ("do not skip", "not a skip",
// "isn't a skip") or names a DIFFERENT lettered option ("use A instead", "go
// with C") is prose ABOUT the skip grammar, not a chosen skip -- when either
// signals, answerParse() returns null (stays open, re-asks) rather than
// guess which reading was meant. D is excluded from the alternative-option
// half: naming D again is consistent with, not contradictory to, a skip.
const SKIP_NEGATION_REGEX = /\b(?:not|n't|isn't|is not|never)\b[^.;]{0,30}\bskip\b|\bskip\b[^.;]{0,30}\b(?:not|n't|isn't|is not)\b/i;
const SKIP_ALTERNATIVE_OPTION_REGEX = /\b(?:use|go with|choose|pick|option|choice|answer)\s+[a-ceA-CE]\b/;
const SPEC_PATH_REGEX = /(?:\.opencode\/specs|specs)\/[a-zA-Z0-9][\w./-]*/;
const BARE_FOLDER_TOKEN_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/i;
const TRAILING_PUNCTUATION_REGEX = /[.,;:)]+$/;

function hasSkipContradiction(text) {
  return SKIP_NEGATION_REGEX.test(text) || SKIP_ALTERNATIVE_OPTION_REGEX.test(text);
}

/**
 * Parse a candidate Gate-3 answer out of a user turn. The isOpen guard is
 * enforced HERE, not merely by convention at the call site, so a future
 * caller (or a refactor of classifyIntent) cannot accidentally treat an
 * ordinary prompt as a gate-closing answer just because it happens to start
 * with an A-E letter -- only a session whose persisted gate status is
 * literally 'open' may have its prompt read as an answer.
 *
 * Returns null immediately when isOpen is falsy, and also when the text does
 * not look like an answer at all, so the caller falls through to a normal
 * classify pass instead of guessing.
 *
 * @param {string} promptText
 * @param {boolean} [isOpen=true] - true only when the session's persisted
 *   gate status is 'open'. Defaults to true so direct callers (e.g. the
 *   answerParse() corpus test below) can exercise the raw parser without
 *   threading gate state through every call.
 * @returns {null | { type: 'skip' } | { type: 'binding', path: string }}
 */
export function answerParse(promptText, isOpen = true) {
  if (!isOpen) return null;
  const text = typeof promptText === 'string' ? promptText.trim() : '';
  if (!text) return null;

  // Computed once and reused below (natural-lead-in letters are never
  // re-derived) -- D is special-cased HERE, not just in the bare-letter
  // regex, so "option D" / "answer D" reads as the skip choice rather than
  // falling into the folder-binding letter grammar below.
  const naturalLeadInMatch = NATURAL_LEAD_IN_LETTER_REGEX.exec(text);
  const naturalLeadInIsSkipLetter = naturalLeadInMatch !== null && /^[dD]$/.test(naturalLeadInMatch[1]);

  if (SKIP_WORD_REGEX.test(text) || STANDALONE_LETTER_D_REGEX.test(text) || naturalLeadInIsSkipLetter) {
    // A COMPLETE, unambiguous standalone answer only -- reject (return null,
    // stay open) when the rest of the turn contradicts the skip itself. See
    // hasSkipContradiction() / SKIP_NEGATION_REGEX / SKIP_ALTERNATIVE_OPTION_REGEX above.
    return hasSkipContradiction(text) ? null : { type: 'skip' };
  }

  const pathMatch = SPEC_PATH_REGEX.exec(text);
  if (pathMatch) {
    return { type: 'binding', path: pathMatch[0].replace(TRAILING_PUNCTUATION_REGEX, '') };
  }

  const letterMatch = ANSWER_LETTER_PREFIX_REGEX.exec(text) || naturalLeadInMatch;
  if (letterMatch) {
    const bareMatch = BARE_FOLDER_TOKEN_REGEX.exec(text);
    if (bareMatch) {
      return { type: 'binding', path: bareMatch[0].replace(TRAILING_PUNCTUATION_REGEX, '') };
    }
    // A letter was chosen but no folder was named -- not enough to bind yet;
    // stay open and re-ask rather than guessing at a target.
    return null;
  }

  return null;
}

/**
 * Extract a candidate spec-folder token directly from a TRIGGER prompt (the
 * same turn that opens the gate), with no letter/skip grammar at all --
 * distinct from answerParse, which only runs against an already-open gate's
 * answer turn. Surfacing a token here is advisory only: only
 * validateSpecFolderBinding (via acceptPriorAnswerBinding below) decides
 * whether it actually binds, so an incidental digit-dash token in ordinary
 * prose (e.g. a component named "404-not-found") can surface here and still
 * safely fall through to opening the gate when it does not resolve to a
 * real, valid, in-tree spec folder.
 *
 * @param {string} promptText
 * @returns {string|null}
 */
export function extractSpecFolderCandidate(promptText) {
  const text = typeof promptText === 'string' ? promptText.trim() : '';
  if (!text) return null;

  const pathMatch = SPEC_PATH_REGEX.exec(text);
  if (pathMatch) return pathMatch[0].replace(TRAILING_PUNCTUATION_REGEX, '');

  const bareMatch = BARE_FOLDER_TOKEN_REGEX.exec(text);
  if (bareMatch) return bareMatch[0].replace(TRAILING_PUNCTUATION_REGEX, '');

  return null;
}

// ── Local mirrors of gate-3-classifier's post-trio checks (fix 3) ──────────
//
// validateSpecFolderCandidate() in the shared (frozen, out-of-scope) shared
// classifier checks MANDATORY_SPEC_METADATA_FILES BEFORE it ever checks
// deprecated/superseded status or resolves a phase-parent's active child --
// so a scaffold missing the save-time trio comes back 'missing_metadata' even
// when the folder is ALSO Deprecated/Superseded, or an unresolvable
// phase-parent, and the classifier never reaches those checks to say so. The
// dist build exports only validateSpecFolderBinding/classifyPrompt --
// readSpecStatus/isDeprecatedOrSuperseded/isPhaseParent are internal to
// gate-3-classifier.ts and are never exported -- so the scaffolded-folder
// relaxation below re-runs those same two checks itself, matching the
// classifier's own logic and file layout, before ever accepting a scaffold
// on the trio's behalf.
const PHASE_CHILD_FOLDER_PATTERN = /^\d{3}-[a-z0-9-]+$/;
const SPEC_STATUS_TABLE_ROW_REGEX = /^\|\s*\*\*Status\*\*\s*\|\s*([^|]+?)\s*\|/im;
const SPEC_STATUS_FRONTMATTER_REGEX = /^status:\s*["']?([^"'\n]+?)["']?\s*$/im;
const DEPRECATED_OR_SUPERSEDED_STATUS_REGEX = /^(deprecated|superseded)$/i;
// Bounds the phase-parent-chases-phase-parent recursion below; the real
// classifier's own recursion has no adversarial-depth concern (it only ever
// runs against a fully-formed tree), but this relaxation walks scaffolds that
// may not be, so it stays defensive.
const MAX_SCAFFOLD_PHASE_PARENT_DEPTH = 5;

function scaffoldFileExists(absolutePath) {
  try {
    return statSync(absolutePath).isFile();
  } catch (_) {
    return false;
  }
}

function readScaffoldSpecStatus(specMdAbsolutePath) {
  let content;
  try {
    content = readFileSync(specMdAbsolutePath, 'utf8');
  } catch (_) {
    return null;
  }
  const tableMatch = SPEC_STATUS_TABLE_ROW_REGEX.exec(content);
  if (tableMatch?.[1]) return tableMatch[1].trim();
  const frontmatterMatch = SPEC_STATUS_FRONTMATTER_REGEX.exec(content);
  return frontmatterMatch?.[1]?.trim() ?? null;
}

function isScaffoldDeprecatedOrSuperseded(folderAbsolutePath) {
  const status = readScaffoldSpecStatus(join(folderAbsolutePath, 'spec.md'));
  return status !== null && DEPRECATED_OR_SUPERSEDED_STATUS_REGEX.test(status);
}

function isScaffoldPhaseParent(folderAbsolutePath) {
  let entries;
  try {
    entries = readdirSync(folderAbsolutePath, { withFileTypes: true });
  } catch (_) {
    return false;
  }
  return entries.some((entry) => {
    if (!entry.isDirectory() || !PHASE_CHILD_FOLDER_PATTERN.test(entry.name)) return false;
    const childPath = join(folderAbsolutePath, entry.name);
    return scaffoldFileExists(join(childPath, 'spec.md')) || scaffoldFileExists(join(childPath, 'description.json'));
  });
}

function readScaffoldLastActiveChildId(folderAbsolutePath) {
  let raw;
  try {
    raw = readFileSync(join(folderAbsolutePath, 'graph-metadata.json'), 'utf8');
  } catch (_) {
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_) {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const derived = parsed.derived && typeof parsed.derived === 'object' ? parsed.derived : null;
  const candidate = (derived && derived.last_active_child_id) ?? parsed.last_active_child_id;
  return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate.trim() : null;
}

/**
 * Re-run the classifier's deprecated/superseded + phase-parent checks (see
 * the block comment above) against a scaffolded folder that only failed
 * validateSpecFolderBinding on the missing save-time metadata trio. Returns
 * the resolved absolute path a fully-run validation would accept (which, for
 * a phase-parent, is its resolved active CHILD, not the parent itself,
 * mirroring the classifier's own recursion), or null when the folder -- or,
 * recursively, its resolved phase child -- fails a check the trio-only
 * relaxation must never paper over.
 *
 * @param {string} folderAbsolutePath
 * @param {number} [depth]
 * @returns {string|null}
 */
function resolveScaffoldAcceptance(folderAbsolutePath, depth = 0) {
  if (depth > MAX_SCAFFOLD_PHASE_PARENT_DEPTH) return null;
  if (!scaffoldFileExists(join(folderAbsolutePath, 'spec.md'))) return null;
  if (isScaffoldDeprecatedOrSuperseded(folderAbsolutePath)) return null;

  if (isScaffoldPhaseParent(folderAbsolutePath)) {
    const lastActiveChildId = readScaffoldLastActiveChildId(folderAbsolutePath);
    if (!lastActiveChildId) return null; // mirrors 'phase_parent_without_active_child'
    const childPath = resolve(folderAbsolutePath, lastActiveChildId);
    if (!isPathWithin(folderAbsolutePath, childPath)) return null;
    return resolveScaffoldAcceptance(childPath, depth + 1);
  }

  return folderAbsolutePath;
}

/**
 * Decide whether a prior_answer-sourced candidate path satisfies Gate 3,
 * shared by both binding call sites (an explicit answer to an already-open
 * gate, and the trigger-turn self-bind below) so the acceptance rule can
 * never drift between them.
 *
 * Accepts outright when the shared classifier validates the candidate.
 * Additionally accepts when the ONLY failing check was the save-time
 * metadata trio (description.json/graph-metadata.json do not exist yet --
 * they are produced at memory-save time, not at scaffold time) AND a
 * fully-run validation would otherwise accept the folder -- re-checked via
 * resolveScaffoldAcceptance() above (deprecated/superseded status, and the
 * phase-parent case), not merely "a spec.md file exists": that early return
 * skips the classifier's OWN downstream checks entirely, so this relaxation
 * must independently re-preserve them. validateSpecFolderCandidate has, by
 * the missing_metadata point, already confirmed the folder is in-tree,
 * exists, is not a symlink escape, and is not a repeat/cycle -- the trio (and
 * now these re-checked invariants) are the only gap. This relaxation is
 * local to the spec-gate's own binding path; the shared classifier's
 * MANDATORY_SPEC_METADATA_FILES contract is never touched, and
 * prebound/AUTONOMOUS bindings (which do not use source:'prior_answer')
 * still require the full trio via applyGate3Satisfaction.
 *
 * @param {string} candidatePath
 * @param {string} workspaceRoot
 * @returns {{ accepted: boolean, resolvedAbsolutePath: string|null }}
 */
function acceptPriorAnswerBinding(candidatePath, workspaceRoot) {
  const validation = validateSpecFolderBinding(
    { path: candidatePath, source: 'prior_answer' },
    { workspaceRoot },
  );
  if (validation.valid && validation.resolvedAbsolutePath) {
    return { accepted: true, resolvedAbsolutePath: validation.resolvedAbsolutePath };
  }

  if (validation.reason === 'missing_metadata' && typeof validation.path === 'string' && validation.path.length > 0) {
    try {
      const scaffoldedAbsolutePath = join(workspaceRoot, validation.path);
      const resolvedAbsolutePath = resolveScaffoldAcceptance(scaffoldedAbsolutePath);
      if (resolvedAbsolutePath) {
        return { accepted: true, resolvedAbsolutePath };
      }
    } catch (_) {
      // Any unexpected error re-running the local checks -- fall through to
      // reject, never let this optional check propagate to the outer classify catch.
    }
  }

  return { accepted: false, resolvedAbsolutePath: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HELPERS -- path-class exemptions
// ─────────────────────────────────────────────────────────────────────────────

function isUnderAnyRoot(absolutePath, roots) {
  return roots.some((root) => absolutePath === root || absolutePath.startsWith(`${root}/`));
}

function isPathWithin(parentAbsolute, candidateAbsolute) {
  return candidateAbsolute === parentAbsolute || candidateAbsolute.startsWith(`${parentAbsolute}/`);
}

/**
 * Canonicalize a path through real symlinks. When the path itself does not
 * exist yet (e.g. a new file about to be Written), walk up to the nearest
 * existing ancestor, realpath THAT, then re-append the not-yet-existing
 * suffix untouched -- a symlinked ancestor directory still gets resolved.
 * Always terminates at the filesystem root, which always exists, so this
 * never throws and never loops.
 *
 * Uses realpathSync.native (the OS realpath(3) syscall) rather than the
 * pure-JS realpathSync: on a case-insensitive-but-case-preserving filesystem
 * (default macOS APFS, Windows NTFS), the JS implementation returns existing
 * path segments in whatever case the CALLER supplied, while the native
 * implementation resolves them to their actual on-disk casing. Comparing a
 * case-preserved lexical path against a case-canonicalized project root would
 * let a case-variant repo path (e.g. "SRC/Login.ts" vs "src/login.ts") read
 * as outside the project root and slip through as exempt.
 */
function realpathOrNearestExisting(absolutePath) {
  let current = absolutePath;
  let suffix = '';
  for (;;) {
    try {
      const real = realpathSync.native(current);
      return suffix ? join(real, suffix) : real;
    } catch (_) {
      const parent = dirname(current);
      if (parent === current) return absolutePath; // reached root and it still failed -- give up safely
      const segment = current.slice(parent.length + 1);
      suffix = suffix ? join(segment, suffix) : segment;
      current = parent;
    }
  }
}

/**
 * Exempt path classes that must never be blocked: the spec tree itself
 * (writing it IS the Gate-3 workflow), /tmp scratch space, dist output,
 * node_modules, .git, and anything outside the repo. Substitutes for the
 * framework's size-based tiny-edit exemption, which is undetectable at hook
 * time (no diff is available here).
 */
export function isExemptTargetPath(filePath, projectDir) {
  if (typeof filePath !== 'string' || filePath.trim().length === 0) return true;

  const dir = projectDir || process.cwd();
  const resolvedProjectDir = resolve(dir).replace(/\/+$/, '');
  // Resolve away any `..` segments before classifying so a crafted or
  // relative path cannot masquerade as an exempt root (e.g. "/tmp/../real").
  const lexicalAbsolute = resolve(filePath.startsWith('/') ? filePath : join(resolvedProjectDir, filePath));

  // Canonicalize both sides through real symlinks so an in-repo symlink whose
  // real target lands outside the repo (or vice versa) cannot be
  // misclassified by a lexical-only check -- containment and every
  // exemption below is decided on the REAL path, never the lexical one.
  const projectDirReal = realpathOrNearestExisting(resolvedProjectDir);
  const absolute = realpathOrNearestExisting(lexicalAbsolute);

  if (isUnderAnyRoot(absolute, ['/tmp', '/private/tmp'])) return true;
  if (!isPathWithin(projectDirReal, absolute)) return true;

  const relative = absolute.slice(projectDirReal.length + 1);
  if (relative === '.opencode/specs' || relative.startsWith('.opencode/specs/')) return true;
  if (relative === 'specs' || relative.startsWith('specs/')) return true;
  if (relative === '.git' || relative.startsWith('.git/')) return true;
  if (relative.includes('/node_modules/') || relative.startsWith('node_modules/')) return true;
  if (relative === 'dist' || relative.startsWith('dist/') || relative.includes('/dist/')) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. RUNTIME-NEUTRAL ENTRYPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classify one user turn against the session's Gate-3 state.
 *
 * When the gate is already open, an answer is parsed first: a validated
 * binding closes the gate as 'satisfied', a recognized skip closes it as
 * 'skipped'. Otherwise, when the turn triggers Gate-3 and the gate is not
 * already satisfied/skipped, the gate opens and the bounded question is
 * returned. Fails open: any internal error returns the current status with
 * no side effects.
 *
 * @param {{ prompt?: string, sessionID?: string, projectDir?: string, env?: NodeJS.ProcessEnv, classificationOptions?: { executionMode?: string, boundSpecFolder?: object|null, commandContract?: object|null } }} request
 * @returns {{ status: 'open'|'satisfied'|'skipped'|'closed', question: string|null }}
 */
export function classifyIntent(request) {
  // Normalized BEFORE the try, but only a truthiness/type check -- it never
  // dereferences a property of `request` itself, so a null/non-object
  // request cannot throw here. The environment + kill-switch read moves
  // INSIDE the try below (fix 2): request.env on a bare `null` throws before
  // any try/catch could intervene, defeating the fail-open contract for the
  // very first line of the function.
  const safeRequest = request && typeof request === 'object' ? request : {};

  // Captured outside the try so the catch block can evict whatever state this
  // exact (stateDir, sessionID) pair resolved to -- see the fail-open note below.
  let stateDir;
  let sessionID;
  try {
    const environment = safeRequest.env || process.env;
    if (environment[DISABLED_ENV] === '1') return { status: 'closed', question: null };

    const { prompt, projectDir, classificationOptions } = safeRequest;
    sessionID = safeRequest.sessionID;
    const dir = projectDir || process.cwd();
    ({ stateDir } = resolveGuardPaths(dir));
    const state = readGateState(stateDir, sessionID);

    const answer = answerParse(prompt, state.status === 'open');
    if (answer?.type === 'skip') {
      writeGateStateAtomic(stateDir, sessionID, { status: 'skipped', answeredAtMs: Date.now() });
      return { status: 'skipped', question: null };
    }
    if (answer?.type === 'binding') {
      const accepted = acceptPriorAnswerBinding(answer.path, dir);
      if (accepted.accepted) {
        writeGateStateAtomic(stateDir, sessionID, {
          status: 'satisfied',
          boundSpecFolder: { path: answer.path, source: 'prior_answer' },
          validatedResolvedPath: accepted.resolvedAbsolutePath,
          answeredAtMs: Date.now(),
        });
        return { status: 'satisfied', question: null };
      }
      // Invalid candidate: fall through -- stays open, re-surfaces the question below.
    }

    if (state.status === 'satisfied' || state.status === 'skipped') {
      return { status: state.status, question: null };
    }

    const classification = classifyPrompt(typeof prompt === 'string' ? prompt : '', classificationOptions);
    if (classification.triggersGate3) {
      // A prebound/command-contract context the shared classifier already
      // trusts (see ClassificationOptions/applyGate3Satisfaction) closes the
      // gate on this same turn -- no generic question needed.
      if (!classification.requiresGate3Prompt && classification.satisfiedBy) {
        writeGateStateAtomic(stateDir, sessionID, {
          status: 'satisfied',
          satisfiedBy: classification.satisfiedBy,
          writeBoundary: classification.writeBoundary,
          answeredAtMs: Date.now(),
        });
        return { status: 'satisfied', question: null };
      }

      // Trigger-turn self-binding: the SAME prompt that just opened the gate
      // may also already name a folder ("fix the login bug, use
      // .opencode/specs/999-valid") -- validate it before falling back to
      // asking again, rather than opening the gate and denying the very next
      // Write for a turn that already answered its own question.
      const candidatePath = extractSpecFolderCandidate(prompt);
      if (candidatePath) {
        const accepted = acceptPriorAnswerBinding(candidatePath, dir);
        if (accepted.accepted) {
          writeGateStateAtomic(stateDir, sessionID, {
            status: 'satisfied',
            boundSpecFolder: { path: candidatePath, source: 'prior_answer' },
            validatedResolvedPath: accepted.resolvedAbsolutePath,
            answeredAtMs: Date.now(),
          });
          return { status: 'satisfied', question: null };
        }
      }

      if (state.status !== 'open') {
        writeGateStateAtomic(stateDir, sessionID, { status: 'open', askedAtMs: Date.now() });
      }
      return { status: 'open', question: GATE_3_QUESTION };
    }

    return { status: state.status === 'open' ? 'open' : 'closed', question: state.status === 'open' ? GATE_3_QUESTION : null };
  } catch (_) {
    // Fail open on any unexpected internal error: no question, no NEW state
    // write. But a classifier/binding-validation throw can happen AFTER a
    // prior turn already persisted 'open' -- leaving that file in place would
    // let a later enforce hook read stale 'open' state and deny despite this
    // turn reporting closed. Evict (best-effort) so fail-open holds end-to-end.
    if (stateDir !== undefined) {
      try { evictGateState(stateDir, sessionID); } catch (_ignored) { /* best-effort */ }
    }
    return { status: 'closed', question: null };
  }
}

/**
 * Evaluate one Write/Edit-class mutation against the cached session gate
 * state. Never walks the specs tree -- only the classify path (above) ever
 * calls validateSpecFolderBinding; this reads the already-persisted status.
 *
 * Deny is deterministic and opt-in: it fires only when the enforce env is
 * set, the session is not a dispatched/child session (see isChildSession --
 * a child has no user turn to answer Gate 3, so it can never be denied), the
 * tool is Write or Edit, the gate is open and unanswered, and the target is
 * a real in-repo, non-exempt file. Every other combination resolves to
 * advise (question surfaced, never blocking) or allow.
 *
 * `wouldDeny` is an additive telemetry signal, computed independent of the
 * enforce env: it answers "would this exact mutation be denied if enforce
 * were on for every session", so operators can size a future enforce flip
 * from real advise-mode traffic without needing enforce on anywhere yet.
 *
 * @param {{ tool?: string, filePath?: string, sessionID?: string, projectDir?: string, env?: NodeJS.ProcessEnv }} request
 * @returns {{ decision: 'allow'|'advise'|'deny', detail: string|null, wouldDeny: boolean }}
 */
export function evaluateMutation(request) {
  // See classifyIntent()'s matching comment (fix 2): normalization here is a
  // truthiness/type check only, never a property read of `request` itself,
  // so a null/non-object request cannot throw before the try below.
  const safeRequest = request && typeof request === 'object' ? request : {};

  try {
    const environment = safeRequest.env || process.env;
    if (environment[DISABLED_ENV] === '1') return { decision: 'allow', detail: null, wouldDeny: false };

    const { filePath, sessionID, projectDir } = safeRequest;
    const tool = String(safeRequest.tool || '').toLowerCase();
    const dir = projectDir || process.cwd();
    const { stateDir } = resolveGuardPaths(dir);

    const state = readGateState(stateDir, sessionID);
    if (state.status === 'satisfied' || state.status === 'skipped') {
      return { decision: 'allow', detail: null, wouldDeny: false };
    }
    if (state.status !== 'open') {
      // Gate was never opened this session -- nothing to enforce or advise.
      return { decision: 'allow', detail: null, wouldDeny: false };
    }

    if (tool !== 'bash' && isExemptTargetPath(filePath, dir)) {
      return { decision: 'allow', detail: null, wouldDeny: false };
    }

    const denyCapable = DENY_CAPABLE_TOOLS.has(tool);
    const wouldDeny = denyCapable;
    const enforceOn = environment[ENFORCE_ENV] === '1';
    if (denyCapable && enforceOn && !isChildSession(environment)) {
      return { decision: 'deny', detail: GATE_3_DENY_DETAIL, wouldDeny };
    }
    return { decision: 'advise', detail: GATE_3_QUESTION, wouldDeny };
  } catch (_) {
    // Fail open on any unexpected internal error -- never block the mutation.
    return { decision: 'allow', detail: null, wouldDeny: false };
  }
}
