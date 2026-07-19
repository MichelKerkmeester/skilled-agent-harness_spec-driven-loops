// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: code-graph freshness-core (runtime-neutral policy)            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Runtime-agnostic post-edit policy that lets an established,     ║
// ║          warm structural code graph self-heal from soft-stale back to   ║
// ║          fresh without an operator re-running a scan. Debounces an edit ║
// ║          burst in an atomic hex(sessionID)-keyed state file, gates on   ║
// ║          an empty graph (default-off bootstrap opt-in), gates on a warm ║
// ║          daemon heartbeat, and gates on a concurrent in-flight scan.    ║
// ║          evaluateEdit() returns a transport-free decision so each       ║
// ║          runtime adapter (the OpenCode plugin, the Claude PostToolUse   ║
// ║          hook) can surface it in its own protocol. This module performs ║
// ║          state persistence but NEVER writes to stdout/stderr and NEVER ║
// ║          spawns a process -- the adapters own the detached scan spawn  ║
// ║          and the log append, so both runtimes share one bounded log    ║
// ║          path and one state directory.                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} = require('node:fs');
const { extname, join } = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIR_RELATIVE_PATH = '.opencode/skills/.code-graph-freshness-state';
const READINESS_RELATIVE_PATH = '.opencode/skills/system-code-graph/mcp-server/database/.code-graph-readiness.json';
const OWNER_RELATIVE_PATH = '.opencode/skills/system-code-graph/mcp-server/database/.code-graph-owner.json';
const CLI_BIN_RELATIVE_PATH = '.opencode/bin/code-index.cjs';
const FRESHNESS_LOG_FILENAME = 'freshness.log';
const LOG_BACKUP_SUFFIX = '.1';
const SCAN_LOCK_FILENAME = '.scan.lock';
const ARCHIVE_DIR_NAME = '.archive';
const SWEEP_LOCK_DIR_NAME = '.sweep.lock';
const DEBOUNCE_TEMP_FILE_REGEX = /^[0-9a-f]+\.json\.\d+\.\d+\.tmp$/;
const DEBOUNCE_STATE_FILE_REGEX = /^[0-9a-f]+\.json$/;

// Kill-switch: a full no-op for both adapters when set to '1'.
const DISABLED_ENV = 'MK_CODE_GRAPH_FRESHNESS_DISABLED';
// Default-off opt-in: proceed past the empty-graph gate (initial scope
// establishment otherwise stays SessionStart / operator territory).
const BOOTSTRAP_ENV = 'MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP';
const QUIET_MS_ENV = 'MK_CODE_GRAPH_FRESHNESS_QUIET_MS';
const MAX_WAIT_MS_ENV = 'MK_CODE_GRAPH_FRESHNESS_MAX_WAIT_MS';
const MAX_PENDING_ENV = 'MK_CODE_GRAPH_FRESHNESS_MAX_PENDING';
const LOCK_TTL_MS_ENV = 'MK_CODE_GRAPH_FRESHNESS_LOCK_TTL_MS';
const HEARTBEAT_TTL_FALLBACK_ENV = 'MK_CODE_GRAPH_FRESHNESS_HEARTBEAT_TTL_MS';
const ACTIVE_RETENTION_DAYS_ENV = 'MK_CODE_GRAPH_FRESHNESS_ACTIVE_RETENTION_DAYS';
const ARCHIVE_RETENTION_DAYS_ENV = 'MK_CODE_GRAPH_FRESHNESS_ARCHIVE_RETENTION_DAYS';
const SWEEP_INTERVAL_MS_ENV = 'MK_CODE_GRAPH_FRESHNESS_SWEEP_INTERVAL_MS';
const LOG_MAX_BYTES_ENV = 'MK_CODE_GRAPH_FRESHNESS_LOG_MAX_BYTES';

const DEFAULT_QUIET_MS = 4000;
const DEFAULT_MAX_WAIT_MS = 20000;
const DEFAULT_MAX_PENDING = 200;
const DEFAULT_LOCK_TTL_MS = 30000;
const DEFAULT_HEARTBEAT_TTL_MS = 60000;
const DEFAULT_ACTIVE_RETENTION_DAYS = 2;
const DEFAULT_ARCHIVE_RETENTION_DAYS = 90;
const DEFAULT_SWEEP_INTERVAL_MS = 60 * 60 * 1000;
const DEFAULT_LOG_MAX_BYTES = 256 * 1024;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_LOG_DETAIL_CHARS = 800;

// Same 5 opt-in env flags the code-index scan itself reads
// (mcp-server/lib/index-scope-policy.ts). Kept as a small local mirror rather
// than an import so this core stays a dependency-free .cjs both a short-lived
// Claude hook and a long-lived OpenCode plugin can require directly.
const INDEX_SKILLS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SKILLS';
const INDEX_AGENTS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_AGENTS';
const INDEX_COMMANDS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_COMMANDS';
const INDEX_SPECS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_SPECS';
const INDEX_PLUGINS_ENV = 'SPECKIT_CODE_GRAPH_INDEX_PLUGINS';

const OPENCODE_SCOPED_DIRS = [
  { label: '.opencode/skills', segments: ['.opencode', 'skills'], isWidened: isSkillsScopeWidened },
  { label: '.opencode/agents', segments: ['.opencode', 'agents'], isWidened: (env) => isEnvFlagTrue(env, INDEX_AGENTS_ENV) },
  { label: '.opencode/commands', segments: ['.opencode', 'commands'], isWidened: (env) => isEnvFlagTrue(env, INDEX_COMMANDS_ENV) },
  { label: '.opencode/specs', segments: ['.opencode', 'specs'], isWidened: (env) => isEnvFlagTrue(env, INDEX_SPECS_ENV) },
  { label: '.opencode/plugins', segments: ['.opencode', 'plugins'], isWidened: (env) => isEnvFlagTrue(env, INDEX_PLUGINS_ENV) },
];

// Directories that never carry indexable source regardless of scope env,
// so an edit under them can never plausibly move the structural graph.
const ALWAYS_EXCLUDED_DIR_SEGMENTS = [
  'node_modules', '.git', 'dist', 'build', 'out', '.archive', '.worktrees',
  'coverage', '.cache', '.turbo', '.next', '.venv', '__pycache__', '.vite-temp',
];

// Extensions that are never structural source, so an edit never has to reach
// the directory checks below. Everything else -- including files with no
// extension (Makefile, Dockerfile) or an unrecognized one -- errs toward
// include, so a real source type this list has not learned about yet still
// gets a chance to refresh the graph.
const NON_SOURCE_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.rst', '.adoc',
  '.json', '.jsonc', '.json5', '.yaml', '.yml', '.toml', '.ini', '.env',
  '.lock', '.log', '.csv', '.tsv',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.bmp',
  '.pdf', '.zip', '.tar', '.gz', '.tgz', '.7z', '.rar',
  '.mp3', '.mp4', '.wav', '.mov', '.avi',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.map', '.ds_store',
]);

// Best-effort redaction for anything this core writes to the shared log.
// The content here is our own decision detail (paths, reasons), never raw
// tool/command text, but a file path could still embed a credential-looking
// token, so every log line is scrubbed and bounded regardless of source.
const SECRET_PATTERNS = [
  /\b(sk-[A-Za-z0-9_-]{16,})\b/g,
  /\b(gh[pousr]_[A-Za-z0-9]{20,})\b/g,
  /\b(AKIA[0-9A-Z]{16})\b/g,
  /\b(xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
  /(Bearer\s+)[A-Za-z0-9._-]{10,}/gi,
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- env parsing
// ─────────────────────────────────────────────────────────────────────────────

function envFlagEnabled(env, name) {
  const raw = env ? env[name] : undefined;
  if (raw === undefined || raw === null) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(raw).trim().toLowerCase());
}

function positiveIntFromEnv(env, name, fallback) {
  const raw = Number(env ? env[name] : undefined);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : fallback;
}

function isFreshnessDisabled(env) {
  const environment = env || process.env;
  return environment[DISABLED_ENV] === '1';
}

function isEnvFlagTrue(env, name) {
  return String((env && env[name]) || '').trim().toLowerCase() === 'true';
}

// Mirrors index-scope-policy.ts's parseSkillsEnvValue widening rule: any
// non-empty, non-"false" value (a bare "true" or a csv allow-list of sk-*
// names) means skills are no longer at the excluded default.
function isSkillsScopeWidened(env) {
  const raw = String((env && env[INDEX_SKILLS_ENV]) || '').trim().toLowerCase();
  return raw !== '' && raw !== 'false';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS -- paths + probes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve every file both runtime adapters read/write. Keeping this in the
 * core guarantees the OpenCode plugin and the Claude hook agree on one state
 * directory, one lock, and one log path.
 *
 * @param {string} [projectDir] - project root (OpenCode ctx.directory / Claude cwd)
 * @returns {{ projectDir: string, stateDir: string, readinessPath: string, ownerPath: string, logPath: string, lockPath: string, cliBinPath: string }}
 */
function resolveFreshnessPaths(projectDir) {
  const dir = projectDir || process.cwd();
  const stateDir = join(dir, STATE_DIR_RELATIVE_PATH);
  return {
    projectDir: dir,
    stateDir,
    readinessPath: join(dir, READINESS_RELATIVE_PATH),
    ownerPath: join(dir, OWNER_RELATIVE_PATH),
    logPath: join(stateDir, FRESHNESS_LOG_FILENAME),
    lockPath: join(stateDir, SCAN_LOCK_FILENAME),
    cliBinPath: join(dir, CLI_BIN_RELATIVE_PATH),
  };
}

function readJsonSafe(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_) {
    return null;
  }
}

function probeDaemonWarmFromOwnerFile(ownerPath, now, env) {
  const owner = readJsonSafe(ownerPath);
  if (!owner || typeof owner.lastHeartbeatIso !== 'string') {
    return { isWarm: false, reason: 'owner-marker-unavailable' };
  }
  const heartbeatMs = Date.parse(owner.lastHeartbeatIso);
  if (!Number.isFinite(heartbeatMs)) {
    return { isWarm: false, reason: 'owner-heartbeat-unparseable' };
  }
  const ttlMs = Number.isFinite(owner.ttlMs) && owner.ttlMs > 0
    ? owner.ttlMs
    : positiveIntFromEnv(env, HEARTBEAT_TTL_FALLBACK_ENV, DEFAULT_HEARTBEAT_TTL_MS);
  const ageMs = now - heartbeatMs;
  if (ageMs < ttlMs) return { isWarm: true, reason: 'heartbeat-fresh', ageMs, ttlMs };
  return { isWarm: false, reason: 'heartbeat-stale', ageMs, ttlMs };
}

/**
 * Cheap, no-spawn warm probe. Exported standalone so an adapter (or a test)
 * can ask "is the daemon warm right now" without going through the full
 * evaluateEdit gate chain.
 *
 * @param {{ projectDir?: string, now?: number, env?: NodeJS.ProcessEnv }} [request]
 * @returns {{ isWarm: boolean, reason: string, ageMs?: number, ttlMs?: number }}
 */
function probeDaemonWarm(request = {}) {
  const now = Number.isFinite(request.now) ? request.now : Date.now();
  const environment = request.env || process.env;
  const { ownerPath } = resolveFreshnessPaths(request.projectDir);
  try {
    return probeDaemonWarmFromOwnerFile(ownerPath, now, environment);
  } catch (_) {
    return { isWarm: false, reason: 'probe-error' };
  }
}

function isScanLockFresh(lockPath, now, env) {
  try {
    const stats = statSync(lockPath);
    const ttl = positiveIntFromEnv(env, LOCK_TTL_MS_ENV, DEFAULT_LOCK_TTL_MS);
    return (now - stats.mtimeMs) < ttl;
  } catch (_) {
    return false;
  }
}

/**
 * Touch the shared concurrency lock. Called by an adapter immediately before
 * it spawns the detached scan, so a second, near-simultaneous edit in another
 * process sees a fresh lock and defers instead of piling up scans.
 *
 * @param {{ projectDir?: string }} [request]
 * @returns {boolean} true on success
 */
function acquireScanLock(request = {}) {
  const { stateDir, lockPath } = resolveFreshnessPaths(request.projectDir);
  try {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(lockPath, `${process.pid}\n${new Date().toISOString()}\n`, 'utf8');
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Clear the shared concurrency lock. Called by an adapter's child `exit`
 * (and `error`) handler once the detached scan process has ended.
 *
 * @param {{ projectDir?: string }} [request]
 * @returns {boolean} true on success
 */
function releaseScanLock(request = {}) {
  const { lockPath } = resolveFreshnessPaths(request.projectDir);
  try {
    unlinkSync(lockPath);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * The one fixed dispatch shape every scan carries: `--warm-only` plus the
 * PROMPT_TIME env so the CLI's own refusal path is the backstop if the
 * heartbeat goes stale between this probe and the child actually running
 * (code-index-cli.js:996 -- warmOnly throws instead of spawning the launcher).
 *
 * @returns {{ bin: string, args: string[], env: Record<string, string> }}
 */
function buildScanDispatchSpec() {
  return {
    bin: CLI_BIN_RELATIVE_PATH,
    args: ['code_graph_scan', '--json', '{"incremental":true}', '--warm-only', '--format', 'json', '--timeout-ms', '8000'],
    env: { SPECKIT_CODE_INDEX_CLI_PROMPT_TIME: '1' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS -- in-scope filter
// ─────────────────────────────────────────────────────────────────────────────

function pathContainsDir(segments, dirSegments) {
  for (let i = 0; i <= segments.length - dirSegments.length; i += 1) {
    let match = true;
    for (let j = 0; j < dirSegments.length; j += 1) {
      if (segments[i + j] !== dirSegments[j]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

/**
 * Decide whether an edited file could plausibly move the structural graph.
 * Errs toward include: only a known-excluded directory or a known-non-source
 * extension returns out-of-scope; anything else (including an unrecognized
 * or absent extension) proceeds.
 *
 * @param {string} filePath - raw edited file path (absolute or repo-relative)
 * @param {NodeJS.ProcessEnv} env - env used to resolve the same 5 opt-in
 *   scope flags the scan itself reads, so a widened scope widens this filter too
 * @returns {{ inScope: boolean, reason: string }}
 */
function classifyEditScope(filePath, env) {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return { inScope: false, reason: 'no-file-path' };
  }
  const normalized = filePath.replace(/\\/g, '/');
  const segments = normalized.split('/').filter(Boolean);

  for (const excluded of ALWAYS_EXCLUDED_DIR_SEGMENTS) {
    if (segments.includes(excluded)) {
      return { inScope: false, reason: `excluded-dir:${excluded}` };
    }
  }
  for (const scoped of OPENCODE_SCOPED_DIRS) {
    if (pathContainsDir(segments, scoped.segments) && !scoped.isWidened(env)) {
      return { inScope: false, reason: `excluded-dir:${scoped.label}` };
    }
  }

  const ext = extname(normalized).toLowerCase();
  if (NON_SOURCE_EXTENSIONS.has(ext)) {
    return { inScope: false, reason: 'non-source-extension' };
  }

  return { inScope: true, reason: 'in-scope' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HELPERS -- session-scoped debounce state (atomic file persistence)
// ─────────────────────────────────────────────────────────────────────────────

function sessionStateKey(sessionID) {
  return Buffer.from(String(sessionID ?? '__unknown-session__'), 'utf8').toString('hex');
}

function debounceStatePath(stateDir, key) {
  return join(stateDir, `${key}.json`);
}

function readDebounceStateByKey(stateDir, key) {
  try {
    const raw = readFileSync(debounceStatePath(stateDir, key), 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      pending: Array.isArray(parsed.pending) ? parsed.pending.filter((entry) => typeof entry === 'string') : [],
      firstPendingAt: Number.isFinite(parsed.firstPendingAt) ? parsed.firstPendingAt : null,
      lastEditAt: Number.isFinite(parsed.lastEditAt) ? parsed.lastEditAt : null,
    };
  } catch (_) {
    return null;
  }
}

function writeDebounceStateAtomic(stateDir, key, state) {
  try {
    mkdirSync(stateDir, { recursive: true });
  } catch (_) {
    return false;
  }
  const finalPath = debounceStatePath(stateDir, key);
  const tempPath = `${finalPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tempPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    renameSync(tempPath, finalPath);
    return true;
  } catch (_) {
    try { unlinkSync(tempPath); } catch (_ignored) { /* best-effort cleanup */ }
    // Fail open: a persistence error must never block the edit it tracks.
    return false;
  }
}

function clearDebounceStateByKey(stateDir, key, now) {
  writeDebounceStateAtomic(stateDir, key, { pending: [], firstPendingAt: null, lastEditAt: now });
}

function listDebounceStateKeys(stateDir) {
  try {
    return readdirSync(stateDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && DEBOUNCE_STATE_FILE_REGEX.test(entry.name))
      .map((entry) => entry.name.slice(0, -'.json'.length));
  } catch (_) {
    return [];
  }
}

function dedupeCapped(list, max) {
  const seen = new Set();
  const result = [];
  for (const item of list) {
    if (typeof item !== 'string' || item.length === 0) continue;
    if (seen.has(item)) continue;
    seen.add(item);
    result.push(item);
  }
  // Oversized burst: cap the set (keep the most recent entries) rather than
  // growing it unbounded; the max-wait cap still guarantees a scan fires.
  return result.length > max ? result.slice(result.length - max) : result;
}

function maxPendingFromEnv(env) {
  return positiveIntFromEnv(env, MAX_PENDING_ENV, DEFAULT_MAX_PENDING);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. HELPERS -- logging (redacted, bounded, rotated)
// ─────────────────────────────────────────────────────────────────────────────

function redactDetail(detail) {
  let text = String(detail == null ? '' : detail);
  for (const pattern of SECRET_PATTERNS) text = text.replace(pattern, '[redacted]');
  if (text.length > MAX_LOG_DETAIL_CHARS) text = `${text.slice(0, MAX_LOG_DETAIL_CHARS)}...[truncated]`;
  return text;
}

function maintainFreshnessLogPath(logPath, incomingBytes, env) {
  const retentionMs = positiveIntFromEnv(env, ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;
  for (const candidatePath of [logPath, `${logPath}${LOG_BACKUP_SUFFIX}`]) {
    try {
      const stats = statSync(candidatePath);
      if (Date.now() - stats.mtimeMs > retentionMs) unlinkSync(candidatePath);
    } catch (_) {
      // Absent or unreadable logs require no maintenance.
    }
  }
  try {
    const stats = statSync(logPath);
    const maxBytes = positiveIntFromEnv(env, LOG_MAX_BYTES_ENV, DEFAULT_LOG_MAX_BYTES);
    if (stats.size + incomingBytes <= maxBytes) return;
    const backupPath = `${logPath}${LOG_BACKUP_SUFFIX}`;
    try { unlinkSync(backupPath); } catch (_ignored) { /* a prior generation is optional */ }
    renameSync(logPath, backupPath);
  } catch (_) {
    // Absent or unreadable logs require no rotation.
  }
}

// Log lines must never reach stdout/stderr: OpenCode's TUI paints plugin
// console output onto the prompt input line, where it sticks until a redraw.
// Persisting to a state-dir log keeps the signal auditable for both runtimes
// without corrupting the interactive session. Fail-open -- a logging error
// must never affect or block the edit this guard observed.
function appendFreshnessLog(projectDir, detail, env) {
  const environment = env || process.env;
  const { stateDir, logPath } = resolveFreshnessPaths(projectDir);
  const line = `${new Date().toISOString()} [mk-code-graph-freshness] ${redactDetail(detail)}\n`;
  try {
    mkdirSync(stateDir, { recursive: true });
    maintainFreshnessLogPath(logPath, Buffer.byteLength(line), environment);
    appendFileSync(logPath, line, 'utf8');
    return true;
  } catch (_) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. HELPERS -- retention (age-based sweep, archive, prune)
// ─────────────────────────────────────────────────────────────────────────────

function ensureFreshnessArchiveDir(stateDir) {
  const archiveDir = join(stateDir, ARCHIVE_DIR_NAME);
  try {
    mkdirSync(archiveDir, { recursive: true, mode: 0o700 });
  } catch (_) {
    return null;
  }
  return archiveDir;
}

function pruneFreshnessArchive(stateDir, env) {
  const archiveDir = join(stateDir, ARCHIVE_DIR_NAME);
  let entries;
  try {
    entries = readdirSync(archiveDir, { withFileTypes: true });
  } catch (_) {
    return;
  }
  const retentionMs = positiveIntFromEnv(env, ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;
  const now = Date.now();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = join(archiveDir, entry.name);
    try {
      const stats = statSync(filePath);
      if (now - stats.mtimeMs > retentionMs) unlinkSync(filePath);
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
    const stats = statSync(lockPath);
    if (now - stats.mtimeMs <= intervalMs) return null;
    rmdirSync(lockPath);
    mkdirSync(lockPath, { mode: 0o700 });
    return lockPath;
  } catch (_) {
    return null;
  }
}

/**
 * Archive per-session debounce state files untouched past the active-
 * retention window, then prune the archive itself and rotate the log.
 * Throttled to once per sweep interval via runtimeState, mirroring
 * dispatch-guard.cjs's sweepStaleLoopGuardStates.
 *
 * @param {string} [projectDir] - project root
 * @param {{ lastFreshnessSweepAtMs?: number }} [runtimeState] - per-plugin-instance throttle state
 * @param {NodeJS.ProcessEnv} [env]
 */
function sweepStaleFreshnessState(projectDir, runtimeState = {}, env) {
  const environment = env || process.env;
  const { stateDir } = resolveFreshnessPaths(projectDir);
  let lockPath = null;
  try {
    const intervalMs = positiveIntFromEnv(environment, SWEEP_INTERVAL_MS_ENV, DEFAULT_SWEEP_INTERVAL_MS);
    const now = Date.now();
    if (now - (runtimeState.lastFreshnessSweepAtMs || 0) <= intervalMs) return;
    lockPath = acquireSweepLock(stateDir, intervalMs, now);
    if (!lockPath) return;
    runtimeState.lastFreshnessSweepAtMs = now;

    try {
      maintainFreshnessLogPath(join(stateDir, FRESHNESS_LOG_FILENAME), 0, environment);
    } catch (_) {
      // Absent or unreadable log requires no maintenance.
    }

    let entries;
    try {
      entries = readdirSync(stateDir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    const archiveDir = ensureFreshnessArchiveDir(stateDir);
    if (!archiveDir) return;

    const activeRetentionMs = positiveIntFromEnv(environment, ACTIVE_RETENTION_DAYS_ENV, DEFAULT_ACTIVE_RETENTION_DAYS) * MS_PER_DAY;
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const sourcePath = join(stateDir, entry.name);

      if (DEBOUNCE_TEMP_FILE_REGEX.test(entry.name)) {
        try {
          const stats = statSync(sourcePath);
          if (now - stats.mtimeMs > activeRetentionMs) unlinkSync(sourcePath);
        } catch (_) {
          // Fail open on a single entry; the rest of the sweep pass still runs.
        }
        continue;
      }

      if (!DEBOUNCE_STATE_FILE_REGEX.test(entry.name)) continue;
      try {
        const stats = statSync(sourcePath);
        if (now - stats.mtimeMs <= activeRetentionMs) continue;
        renameSync(sourcePath, join(archiveDir, entry.name));
      } catch (_) {
        // Fail open on a single entry; the rest of the sweep pass still runs.
      }
    }

    pruneFreshnessArchive(stateDir, environment);
  } catch (_) {
    // Fail open: a sweep error must never affect session startup.
  } finally {
    if (lockPath) {
      try { rmdirSync(lockPath); } catch (_) { /* a lost lock must not affect startup */ }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. POLICY EVALUATION (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one post-edit signal and return a transport-free decision. Gate
 * order is fixed: disabled -> in-scope filter -> empty gate -> debounce ->
 * warm probe -> concurrency -> scan. This function performs the required
 * debounce-state persistence (the only way to compute the burst window) but
 * does NOT append the log or spawn anything -- the caller applies
 * `warnings`/`audits` through appendFreshnessLog and, only on `scan`,
 * performs the detached spawn itself via the returned `dispatch` spec.
 *
 * Fail-open: any unexpected internal error resolves to `skip`, so a bug here
 * never blocks the edit it observed and never dispatches a scan.
 *
 * @param {{ filePath?: string, sessionID?: string, now?: number, projectDir?: string, env?: NodeJS.ProcessEnv }} request
 * @returns {{
 *   decision: 'skip'|'defer-empty'|'defer-debounce'|'defer-cold'|'defer-inflight'|'scan',
 *   reason?: string,
 *   keepPending?: boolean,
 *   pendingPaths?: string[],
 *   pendingCount?: number,
 *   dispatch?: { bin: string, args: string[], env: Record<string,string> },
 *   nextState?: object,
 *   warnings: string[],
 *   audits: string[],
 * }}
 */
function evaluateEdit(request = {}) {
  const warnings = [];
  const audits = [];
  try {
    const environment = request.env || process.env;
    if (isFreshnessDisabled(environment)) {
      return { decision: 'skip', reason: 'disabled', warnings, audits };
    }

    const now = Number.isFinite(request.now) ? request.now : Date.now();
    const projectDir = request.projectDir || process.cwd();
    const filePath = request.filePath;

    const scope = classifyEditScope(filePath, environment);
    if (!scope.inScope) {
      return { decision: 'skip', reason: scope.reason, warnings, audits };
    }

    const paths = resolveFreshnessPaths(projectDir);
    const readiness = readJsonSafe(paths.readinessPath);
    const bootstrapEnabled = envFlagEnabled(environment, BOOTSTRAP_ENV);
    if (!readiness) {
      return { decision: 'defer-empty', reason: 'readiness-unavailable', warnings, audits };
    }
    if (readiness.graphFreshness === 'empty' && !bootstrapEnabled) {
      return { decision: 'defer-empty', reason: 'graph-empty', warnings, audits };
    }

    const key = sessionStateKey(request.sessionID);
    const priorState = readDebounceStateByKey(paths.stateDir, key)
      || { pending: [], firstPendingAt: null, lastEditAt: null };

    const wasEmpty = priorState.pending.length === 0;
    const maxPending = maxPendingFromEnv(environment);
    const pendingSet = dedupeCapped([...priorState.pending, filePath], maxPending);

    const quietMs = positiveIntFromEnv(environment, QUIET_MS_ENV, DEFAULT_QUIET_MS);
    const maxWaitMs = positiveIntFromEnv(environment, MAX_WAIT_MS_ENV, DEFAULT_MAX_WAIT_MS);
    const quietElapsed = priorState.lastEditAt != null && (now - priorState.lastEditAt) >= quietMs;
    const firstPendingAt = wasEmpty ? now : priorState.firstPendingAt;
    const maxWaitElapsed = firstPendingAt != null && (now - firstPendingAt) >= maxWaitMs;
    const shouldScan = pendingSet.length > 0 && (quietElapsed || maxWaitElapsed);

    if (!shouldScan) {
      const persisted = writeDebounceStateAtomic(paths.stateDir, key, {
        pending: pendingSet,
        firstPendingAt,
        lastEditAt: now,
      });
      if (!persisted) {
        audits.push('debounce state persistence unavailable; this edit is tracked in-memory only for this call');
      }
      return {
        decision: 'defer-debounce',
        reason: 'awaiting-quiet-or-maxwait',
        pendingCount: pendingSet.length,
        warnings,
        audits,
      };
    }

    const warmProbe = probeDaemonWarmFromOwnerFile(paths.ownerPath, now, environment);
    if (!warmProbe.isWarm) {
      writeDebounceStateAtomic(paths.stateDir, key, { pending: pendingSet, firstPendingAt, lastEditAt: now });
      return { decision: 'defer-cold', reason: warmProbe.reason, keepPending: true, warnings, audits };
    }

    if (isScanLockFresh(paths.lockPath, now, environment)) {
      writeDebounceStateAtomic(paths.stateDir, key, { pending: pendingSet, firstPendingAt, lastEditAt: now });
      return { decision: 'defer-inflight', keepPending: true, warnings, audits };
    }

    const nextState = { pending: [], firstPendingAt: null, lastEditAt: now };
    writeDebounceStateAtomic(paths.stateDir, key, nextState);
    return {
      decision: 'scan',
      pendingPaths: pendingSet,
      dispatch: buildScanDispatchSpec(),
      nextState,
      warnings,
      audits,
    };
  } catch (_) {
    // Fail open on any unexpected internal error -- never dispatch, never block.
    return { decision: 'skip', reason: 'internal-error', warnings: [], audits: [] };
  }
}

/**
 * Fire unconditionally on any pending, warm, non-empty-graph edit set left
 * over from a settled burst or a crashed prior process -- unlike
 * evaluateEdit, this does not itself apply the quiet/max-wait timing gate.
 * Called from OpenCode's `session.created` (drain leftovers from a crashed
 * prior process) and from its in-memory debounce timer (drain on burst
 * settle); the Claude side only gets this at the next SessionStart.
 *
 * @param {{ projectDir?: string, now?: number, env?: NodeJS.ProcessEnv, sessionID?: string }} [request]
 *   sessionID scopes the drain to one session; omit it to drain every
 *   session-state file in the shared state directory.
 * @returns {{ decision: 'skip'|'defer-empty'|'defer-cold'|'defer-inflight'|'scan', reason?: string, pendingPaths: string[], dispatch?: object }}
 */
function drainPending(request = {}) {
  try {
    const environment = request.env || process.env;
    if (isFreshnessDisabled(environment)) {
      return { decision: 'skip', reason: 'disabled', pendingPaths: [] };
    }

    const now = Number.isFinite(request.now) ? request.now : Date.now();
    const projectDir = request.projectDir || process.cwd();
    const paths = resolveFreshnessPaths(projectDir);

    const readiness = readJsonSafe(paths.readinessPath);
    const bootstrapEnabled = envFlagEnabled(environment, BOOTSTRAP_ENV);
    if (!readiness) {
      return { decision: 'defer-empty', reason: 'readiness-unavailable', pendingPaths: [] };
    }
    if (readiness.graphFreshness === 'empty' && !bootstrapEnabled) {
      return { decision: 'defer-empty', reason: 'graph-empty', pendingPaths: [] };
    }

    const keys = request.sessionID ? [sessionStateKey(request.sessionID)] : listDebounceStateKeys(paths.stateDir);
    const rawPending = [];
    for (const key of keys) {
      const state = readDebounceStateByKey(paths.stateDir, key);
      if (state && state.pending.length > 0) rawPending.push(...state.pending);
    }
    const cap = maxPendingFromEnv(environment) * Math.max(keys.length, 1);
    const pendingPaths = dedupeCapped(rawPending, cap);
    if (pendingPaths.length === 0) {
      return { decision: 'skip', reason: 'no-pending', pendingPaths: [] };
    }

    const warmProbe = probeDaemonWarmFromOwnerFile(paths.ownerPath, now, environment);
    if (!warmProbe.isWarm) {
      return { decision: 'defer-cold', reason: warmProbe.reason, pendingPaths };
    }
    if (isScanLockFresh(paths.lockPath, now, environment)) {
      return { decision: 'defer-inflight', pendingPaths };
    }

    for (const key of keys) clearDebounceStateByKey(paths.stateDir, key, now);

    return { decision: 'scan', pendingPaths, dispatch: buildScanDispatchSpec() };
  } catch (_) {
    return { decision: 'skip', reason: 'internal-error', pendingPaths: [] };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // constants
  STATE_DIR_RELATIVE_PATH,
  READINESS_RELATIVE_PATH,
  OWNER_RELATIVE_PATH,
  CLI_BIN_RELATIVE_PATH,
  FRESHNESS_LOG_FILENAME,
  SCAN_LOCK_FILENAME,
  DISABLED_ENV,
  BOOTSTRAP_ENV,
  QUIET_MS_ENV,
  MAX_WAIT_MS_ENV,
  MAX_PENDING_ENV,
  LOCK_TTL_MS_ENV,
  // path + probe helpers
  resolveFreshnessPaths,
  isFreshnessDisabled,
  classifyEditScope,
  probeDaemonWarm,
  acquireScanLock,
  releaseScanLock,
  buildScanDispatchSpec,
  // debounce-state helpers (exported for test seeding + introspection)
  sessionStateKey,
  readDebounceStateByKey,
  writeDebounceStateAtomic,
  listDebounceStateKeys,
  // logging + maintenance
  appendFreshnessLog,
  sweepStaleFreshnessState,
  // runtime-neutral entrypoints
  evaluateEdit,
  drainPending,
};
