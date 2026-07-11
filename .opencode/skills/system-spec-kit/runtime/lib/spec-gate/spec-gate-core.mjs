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
  'D) Skip (no spec folder needed for this change)',
  'E) Use a phase folder (e.g. .opencode/specs/<parent>/<NNN-phase>, name it)',
].join('\n');

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

/**
 * Append one advisory line to the bounded, rotated spec-gate warning log.
 * Adapter-invoked only -- classifyIntent/evaluateMutation never call this
 * themselves, so the core stays transport-free.
 */
export function appendWarningLog(stateDir, detail) {
  const line = `${new Date().toISOString()} [mk-spec-gate] ADVISE: ${detail}\n`;
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

const SKIP_WORD_REGEX = /^\s*skip\b/i;
const ANSWER_LETTER_PREFIX_REGEX = /^\s*([a-eA-E])(?=[\s,.:)\-]|$)/;
const SPEC_PATH_REGEX = /(?:\.opencode\/specs|specs)\/[a-zA-Z0-9][\w./-]*/;
const BARE_FOLDER_TOKEN_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/i;
const TRAILING_PUNCTUATION_REGEX = /[.,;:)]+$/;

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

  const letterMatch = ANSWER_LETTER_PREFIX_REGEX.exec(text);
  if (SKIP_WORD_REGEX.test(text) || (letterMatch && letterMatch[1].toUpperCase() === 'D')) {
    return { type: 'skip' };
  }

  const pathMatch = SPEC_PATH_REGEX.exec(text);
  if (pathMatch) {
    return { type: 'binding', path: pathMatch[0].replace(TRAILING_PUNCTUATION_REGEX, '') };
  }

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
 * @param {{ prompt?: string, sessionID?: string, projectDir?: string, env?: NodeJS.ProcessEnv }} request
 * @returns {{ status: 'open'|'satisfied'|'skipped'|'closed', question: string|null }}
 */
export function classifyIntent(request = {}) {
  const environment = request.env || process.env;
  if (environment[DISABLED_ENV] === '1') return { status: 'closed', question: null };

  // Captured outside the try so the catch block can evict whatever state this
  // exact (stateDir, sessionID) pair resolved to -- see the fail-open note below.
  let stateDir;
  let sessionID;
  try {
    const { prompt, projectDir } = request;
    sessionID = request.sessionID;
    const dir = projectDir || process.cwd();
    ({ stateDir } = resolveGuardPaths(dir));
    const state = readGateState(stateDir, sessionID);

    const answer = answerParse(prompt, state.status === 'open');
    if (answer?.type === 'skip') {
      writeGateStateAtomic(stateDir, sessionID, { status: 'skipped', answeredAtMs: Date.now() });
      return { status: 'skipped', question: null };
    }
    if (answer?.type === 'binding') {
      const validation = validateSpecFolderBinding(
        { path: answer.path, source: 'prior_answer' },
        { workspaceRoot: dir },
      );
      if (validation.valid && validation.resolvedAbsolutePath) {
        writeGateStateAtomic(stateDir, sessionID, {
          status: 'satisfied',
          boundSpecFolder: { path: answer.path, source: 'prior_answer' },
          validatedResolvedPath: validation.resolvedAbsolutePath,
          answeredAtMs: Date.now(),
        });
        return { status: 'satisfied', question: null };
      }
      // Invalid candidate: fall through -- stays open, re-surfaces the question below.
    }

    if (state.status === 'satisfied' || state.status === 'skipped') {
      return { status: state.status, question: null };
    }

    const classification = classifyPrompt(typeof prompt === 'string' ? prompt : '');
    if (classification.triggersGate3) {
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
 * set, the tool is Write or Edit, the gate is open and unanswered, and the
 * target is a real in-repo, non-exempt file. Every other combination
 * resolves to advise (question surfaced, never blocking) or allow.
 *
 * @param {{ tool?: string, filePath?: string, sessionID?: string, projectDir?: string, env?: NodeJS.ProcessEnv }} request
 * @returns {{ decision: 'allow'|'advise'|'deny', detail: string|null }}
 */
export function evaluateMutation(request = {}) {
  const environment = request.env || process.env;
  if (environment[DISABLED_ENV] === '1') return { decision: 'allow', detail: null };

  try {
    const { filePath, sessionID, projectDir } = request;
    const tool = String(request.tool || '').toLowerCase();
    const dir = projectDir || process.cwd();
    const { stateDir } = resolveGuardPaths(dir);

    const state = readGateState(stateDir, sessionID);
    if (state.status === 'satisfied' || state.status === 'skipped') {
      return { decision: 'allow', detail: null };
    }
    if (state.status !== 'open') {
      // Gate was never opened this session -- nothing to enforce or advise.
      return { decision: 'allow', detail: null };
    }

    if (tool !== 'bash' && isExemptTargetPath(filePath, dir)) {
      return { decision: 'allow', detail: null };
    }

    const denyCapable = DENY_CAPABLE_TOOLS.has(tool);
    const enforceOn = environment[ENFORCE_ENV] === '1';
    if (denyCapable && enforceOn) {
      return { decision: 'deny', detail: GATE_3_QUESTION };
    }
    return { decision: 'advise', detail: GATE_3_QUESTION };
  } catch (_) {
    // Fail open on any unexpected internal error -- never block the mutation.
    return { decision: 'allow', detail: null };
  }
}
