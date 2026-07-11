// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: completion-evidence-sentinel core (runtime-neutral policy)    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Runtime-agnostic gate + policy for the completion-evidence      ║
// ║          sentinel. When a turn ends with a completion claim, this        ║
// ║          module checks recorded artifacts only -- a folder's            ║
// ║          checklist.md via check-completion.sh --json, or a Level 1       ║
// ║          folder's implementation-summary.md via a stat -- and returns a  ║
// ║          transport-free decision so each runtime adapter (the Claude     ║
// ║          Stop hook, the OpenCode session.idle plugin) can surface it in  ║
// ║          its own protocol. It NEVER executes a test, a build, or         ║
// ║          validate.sh, and NEVER writes stdout/stderr. Dedup state is     ║
// ║          persisted here (so both adapters share one fingerprint store),  ║
// ║          but the bounded advisory log append stays an explicit,          ║
// ║          adapter-invoked step, mirroring the deep-loop dispatch-guard    ║
// ║          shape: the core owns policy + persistence, the adapter owns     ║
// ║          when to log.                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  truncateSync,
  unlinkSync,
  writeFileSync,
} = require('node:fs');
const { createHash } = require('node:crypto');
const { dirname, join } = require('node:path');
// Kept as an object reference (never destructured) so a test-time
// `vi.spyOn(require('node:child_process'), 'execFileSync')` can intercept the
// same singleton the rest of this module calls through.
const childProcess = require('node:child_process');

// check-completion.sh already has a proven, tested "spawn --json, and on a
// non-zero exit parse err.stdout because the script still wrote its payload
// before exiting 1" wrapper in the completion-state core that a sibling
// OpenCode tool already ships. Reusing its script-path constant and JSON-parse
// helper avoids a second copy of that parsing subtlety; the spawn call itself
// stays local (see "3. CHECKLIST EVALUATION" below) because that core's own
// wrapper has a fixed 5s timeout that is safe for an isolated Claude
// subprocess but too loose for a call made directly on the OpenCode plugin
// host, which the spawn would block in full for its whole duration.
const completionState = require('../../../scripts/lib/completion-state.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors quality-loop.ts's private COMPLETION_CLAIM_PATTERN verbatim. That
// module does not export the constant, and this phase is barred from editing
// mcp_server .ts sources or rebuilding dist to add an export, so the value is
// duplicated here rather than imported. Keep both copies byte-identical.
const COMPLETION_CLAIM_PATTERN = /\b(completed|resolved|fixed|finished|shipped|released|deployed|implemented|occurred|happened)\b/i;

// A completion claim is anchored to the trailing slice of the turn rather than
// tested against the whole message, so a claim word used in passing mid-turn
// narration ("I fixed the earlier typo, now let me look at...") does not fire
// the same as a turn that actually ends on the claim.
const CLAIM_ANCHOR_TAIL_CHARS = 400;

// Best-effort packet resolution from free text (the OpenCode adapter's own
// use: session.idle hands over neither the last message nor the active
// packet, so the adapter must recover both itself).
const SPEC_FOLDER_TEXT_PATTERN = /(?:\.opencode\/)?specs\/[^\s"'`)\]]+/;

const STATE_DIR_RELATIVE_PATH = '.opencode/skills/.completion-sentinel-state';
const LOG_RELATIVE_PATH = '.opencode/logs/completion-sentinel-advisories.log';
const DEDUP_FILE_NAME = 'advisory-dedup.json';

const KILL_SWITCH_ENV = 'MK_COMPLETION_SENTINEL_DISABLED';
const CHECK_TIMEOUT_MS_ENV = 'SPECKIT_COMPLETION_SENTINEL_CHECK_TIMEOUT_MS';
const LOG_MAX_BYTES_ENV = 'SPECKIT_COMPLETION_SENTINEL_LOG_MAX_BYTES';

// Kept well under the NFR-P01 bound (<1.5s) so the check stays a small slice
// of whichever budget calls it -- generous for the Claude Stop hook's 10s
// async window, but the number that actually matters is the OpenCode side,
// where the spawn blocks the whole plugin host, not just this call.
const DEFAULT_CHECK_TIMEOUT_MS = 1200;
const DEFAULT_LOG_MAX_BYTES = 256 * 1024;
const EXEC_MAX_BUFFER_BYTES = 256 * 1024;

const CHECKLIST_ADVISE_STATUSES = new Set([
  'EVIDENCE_MISSING',
  'PRIORITY_CONTEXT_MISSING',
  'P0_INCOMPLETE',
  'P1_INCOMPLETE',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- claim + packet detection
// ─────────────────────────────────────────────────────────────────────────────

function detectCompletionClaim(text) {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  const tail = trimmed.slice(-CLAIM_ANCHOR_TAIL_CHARS);
  return COMPLETION_CLAIM_PATTERN.test(tail);
}

function resolveSpecFolderFromText(text) {
  if (typeof text !== 'string') return null;
  const match = SPEC_FOLDER_TEXT_PATTERN.exec(text);
  if (!match) return null;
  return match[0].replace(/[.,;:'"`)\]]+$/, '') || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS -- env-tunable constants
// ─────────────────────────────────────────────────────────────────────────────

function positiveIntFromEnv(environment, envName, fallback) {
  const raw = Number(environment[envName]);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PATHS (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the state dir, bounded log path, and dedup store both runtime
 * adapters share, plus the check-completion.sh script this module spawns.
 *
 * @param {string} projectDir - project root (OpenCode ctx.directory / Claude cwd)
 */
function resolveSentinelPaths(projectDir) {
  const dir = projectDir || process.cwd();
  return {
    stateDir: join(dir, STATE_DIR_RELATIVE_PATH),
    logPath: join(dir, LOG_RELATIVE_PATH),
    checkCompletionScriptPath: completionState.CHECK_COMPLETION_SCRIPT,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CHECKLIST EVALUATION (bounded spawn, err.stdout-on-exit-1 parse)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Spawn check-completion.sh --json against one folder and parse its status.
 * The script exits 1 for an incomplete checklist but still writes its JSON to
 * stdout before exiting -- execFileSync throws on any non-zero exit, so the
 * catch branch reads `err.stdout` first and only falls back to a fail-open
 * `{ok:false}` when no JSON payload is recoverable.
 *
 * @returns {{ok:true,data:object}|{ok:false,error:string}}
 */
function runCheckCompletion(absoluteSpecFolder, { timeoutMs, cwd }) {
  try {
    const stdout = childProcess.execFileSync(
      'bash',
      [completionState.CHECK_COMPLETION_SCRIPT, absoluteSpecFolder, '--json'],
      {
        cwd,
        timeout: timeoutMs,
        maxBuffer: EXEC_MAX_BUFFER_BYTES,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    return completionState.parseJsonSafely(stdout);
  } catch (err) {
    const stdoutText = err && typeof err.stdout === 'string' ? err.stdout : '';
    if (stdoutText.trim()) {
      const parsed = completionState.parseJsonSafely(stdoutText);
      if (parsed.ok) return parsed;
    }
    return { ok: false, error: (err && err.message) || 'check-completion.sh spawn failed' };
  }
}

function detailForChecklistStatus(status, specFolder, data) {
  const gates = (data && typeof data.qualityGates === 'object' && data.qualityGates) || {};
  const priorities = (data && typeof data.priorities === 'object' && data.priorities) || {};

  if (status === 'EVIDENCE_MISSING') {
    const missing = (gates.p0MissingEvidence || 0) + (gates.p1MissingEvidence || 0);
    return `claimed done but ${missing} completed P0/P1 checklist item(s) in ${specFolder} lack an evidence marker`;
  }
  if (status === 'PRIORITY_CONTEXT_MISSING') {
    return `claimed done but ${gates.priorityContextMissing || 0} checklist item(s) in ${specFolder} are missing P0/P1/P2 priority context`;
  }
  if (status === 'P0_INCOMPLETE') {
    const p0 = priorities.p0 || {};
    return `claimed done but only ${p0.completed || 0}/${p0.total || 0} P0 checklist item(s) are complete in ${specFolder}`;
  }
  if (status === 'P1_INCOMPLETE') {
    const p1 = priorities.p1 || {};
    return `claimed done but only ${p1.completed || 0}/${p1.total || 0} P1 checklist item(s) are complete in ${specFolder}`;
  }
  return `claimed done but ${specFolder} checklist status is ${status}`;
}

function verdictFromChecklistResult(result, specFolder) {
  if (!result || !result.ok || !result.data || typeof result.data !== 'object') {
    // Spawn/parse failure: fail open. This also covers the (pre-checked-away)
    // "checklist.md not found" branch of the script, which reports no status.
    return { decision: 'ok', detail: null };
  }
  const status = typeof result.data.status === 'string' ? result.data.status : null;
  if (!status || !CHECKLIST_ADVISE_STATUSES.has(status)) {
    return { decision: 'ok', detail: null };
  }
  return { decision: 'advise', detail: detailForChecklistStatus(status, specFolder, result.data) };
}

function verdictFromImplementationSummary(absoluteSpecFolder, specFolder) {
  try {
    if (statSync(join(absoluteSpecFolder, 'implementation-summary.md')).isFile()) {
      return { decision: 'ok', detail: null };
    }
  } catch (_) {
    // Absent or unreadable falls through to the advise below.
  }
  return {
    decision: 'advise',
    detail: `claimed done but no implementation-summary.md recorded in ${specFolder}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. DEDUP (atomic, packet + message fingerprint)
// ─────────────────────────────────────────────────────────────────────────────

function dedupKeyForSpecFolder(specFolder) {
  return createHash('sha256').update(String(specFolder)).digest('hex').slice(0, 24);
}

function fingerprintFor(specFolder, claimText) {
  return `sha256:${createHash('sha256').update(`${specFolder} ${claimText}`).digest('hex')}`;
}

function readDedupStore(stateDir) {
  try {
    const raw = readFileSync(join(stateDir, DEDUP_FILE_NAME), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeDedupStoreAtomic(stateDir, store) {
  try {
    mkdirSync(stateDir, { recursive: true, mode: 0o700 });
  } catch (_) {
    return false;
  }
  const finalPath = join(stateDir, DEDUP_FILE_NAME);
  const tempPath = `${finalPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tempPath, `${JSON.stringify(store)}\n`, 'utf8');
    renameSync(tempPath, finalPath);
    return true;
  } catch (_) {
    try { unlinkSync(tempPath); } catch (_ignored) { /* best-effort cleanup */ }
    return false;
  }
}

/**
 * Record one advisory fingerprint per packet and report whether this exact
 * packet+message pair was already advised. A persistence failure fails open
 * to "not deduped" -- the worst case is one extra bounded advisory, never a
 * blocked turn.
 */
function applyDedup(stateDir, specFolder, claimText) {
  const fingerprint = fingerprintFor(specFolder, claimText);
  const store = readDedupStore(stateDir);
  const key = dedupKeyForSpecFolder(specFolder);
  const prior = store[key];
  if (prior && prior.fingerprint === fingerprint) {
    return { deduped: true, fingerprint };
  }
  store[key] = { fingerprint, advisedAt: new Date().toISOString() };
  writeDedupStoreAtomic(stateDir, store);
  return { deduped: false, fingerprint };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. BOUNDED ADVISORY LOG (adapter-invoked, never stdout/stderr)
// ─────────────────────────────────────────────────────────────────────────────

// Advisories must never reach stdout/stderr: on the OpenCode side that
// corrupts the TUI, and on the Claude side stdout is reserved for hook output
// injection. A size-bounded, single-backup-rotated file under .opencode/logs/
// (already covered by the repo's blanket "*.log" gitignore rule) keeps the
// signal auditable without either risk. Fail-open -- a logging error must
// never affect the turn or session it observes.
function appendAdvisoryLog(projectDir, detail) {
  try {
    const { logPath } = resolveSentinelPaths(projectDir || process.cwd());
    const environment = process.env;
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      const maxBytes = positiveIntFromEnv(environment, LOG_MAX_BYTES_ENV, DEFAULT_LOG_MAX_BYTES);
      if (statSync(logPath).size >= maxBytes) {
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch (_) {
      // A missing active log is the normal first-write case.
    }
    appendFileSync(logPath, `${new Date().toISOString()} [completion-evidence-sentinel] ${detail}\n`, 'utf8');
    return true;
  } catch (_) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. MAIN ENTRYPOINT (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate one completion claim against recorded evidence and return a
 * transport-free decision. Never executes a test, build, or validate.sh --
 * only a bounded read of check-completion.sh's --json output, or a stat of
 * implementation-summary.md. Fails open on every error path.
 *
 * @param {{specFolder?: string, claimText?: string, projectDir?: string, env?: NodeJS.ProcessEnv}} request
 * @returns {{decision:'ok'|'advise', detail: string|null, deduped: boolean}}
 */
function evaluateCompletionEvidence(request = {}) {
  try {
    const environment = request.env || process.env;
    if (environment[KILL_SWITCH_ENV] === '1') {
      return { decision: 'ok', detail: null, deduped: false };
    }

    const claimText = typeof request.claimText === 'string' ? request.claimText : '';
    if (!detectCompletionClaim(claimText)) {
      return { decision: 'ok', detail: null, deduped: false };
    }

    const rawSpecFolder = typeof request.specFolder === 'string' ? request.specFolder.trim() : '';
    if (!rawSpecFolder) {
      return { decision: 'ok', detail: null, deduped: false };
    }

    const projectDir = completionState.resolveProjectDir(request.projectDir);
    const absoluteSpecFolder = completionState.resolveSpecFolder(rawSpecFolder, projectDir);

    let hasChecklist = false;
    try {
      hasChecklist = statSync(join(absoluteSpecFolder, 'checklist.md')).isFile();
    } catch (_) {
      hasChecklist = false;
    }

    const verdict = hasChecklist
      ? verdictFromChecklistResult(
        runCheckCompletion(absoluteSpecFolder, {
          timeoutMs: positiveIntFromEnv(environment, CHECK_TIMEOUT_MS_ENV, DEFAULT_CHECK_TIMEOUT_MS),
          cwd: projectDir,
        }),
        rawSpecFolder,
      )
      : verdictFromImplementationSummary(absoluteSpecFolder, rawSpecFolder);

    if (verdict.decision !== 'advise') {
      return { decision: 'ok', detail: null, deduped: false };
    }

    const { stateDir } = resolveSentinelPaths(projectDir);
    const dedup = applyDedup(stateDir, rawSpecFolder, claimText);
    if (dedup.deduped) {
      return { decision: 'ok', detail: null, deduped: true };
    }

    return { decision: 'advise', detail: verdict.detail, deduped: false };
  } catch (_) {
    // Fail open on any unexpected internal error -- a sentinel bug must never
    // block or affect the stop/idle processing it observes.
    return { decision: 'ok', detail: null, deduped: false };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // constants
  COMPLETION_CLAIM_PATTERN,
  SPEC_FOLDER_TEXT_PATTERN,
  STATE_DIR_RELATIVE_PATH,
  LOG_RELATIVE_PATH,
  KILL_SWITCH_ENV,
  CHECK_TIMEOUT_MS_ENV,
  LOG_MAX_BYTES_ENV,
  DEFAULT_CHECK_TIMEOUT_MS,
  // detection + resolution helpers
  detectCompletionClaim,
  resolveSpecFolderFromText,
  // paths
  resolveSentinelPaths,
  // policy
  evaluateCompletionEvidence,
  // logging (adapter-invoked)
  appendAdvisoryLog,
};
