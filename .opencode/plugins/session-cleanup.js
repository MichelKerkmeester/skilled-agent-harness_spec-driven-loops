// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Session Cleanup OpenCode Plugin                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Run bounded startup guards and teardown cleanup without writing ║
// ║          into the OpenCode TUI.                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  statSync,
  truncateSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(PLUGIN_ROOT, '..', '..');
const CLEANUP_SCRIPT = join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh');
const GUARD_SCRIPTS = [
  join(REPO_ROOT, '.opencode/bin/worktree-guard.sh'),
  join(REPO_ROOT, '.opencode/bin/check-git-hooks.sh'),
];
const DEFAULT_LOG_PATH = join(
  process.env.HOME || '/tmp',
  '.local/share/session-cleanup.log',
);
const DEFAULT_LOG_MAX_BYTES = 10 * 1024 * 1024;
const PROCESS_TIMEOUT_MS = 8000;
const MAX_CAPTURE_BYTES = 4096;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function boundedText(value) {
  if (value === undefined || value === null) return '';
  return String(value).replaceAll('\0', '').trim().slice(0, MAX_CAPTURE_BYTES);
}

function appendPluginLog(logPath, maxBytes, detail) {
  try {
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= maxBytes) {
        try { copyFileSync(`${logPath}.2`, `${logPath}.3`); } catch (_) { /* Optional generation. */ }
        try { copyFileSync(`${logPath}.1`, `${logPath}.2`); } catch (_) { /* Optional generation. */ }
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch (_) {
      // A missing active log is the normal first-write case.
    }
    const safeDetail = boundedText(detail).replace(/\s+/g, ' ');
    appendFileSync(logPath, `${new Date().toISOString()} ${safeDetail}\n`, 'utf8');
  } catch (_) {
    // Logging must remain fail-open during startup and disposal.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * OpenCode Plugin: session MCP cleanup
 *
 * OpenCode exposes a canonical dispose callback for plugin teardown. Process
 * signaling remains disabled until the host can prove a session-owned PID;
 * the workspace-scoped server PID is not sufficient ownership evidence.
 *
 * Best-effort and bounded: subprocesses wait at most eight seconds and hook
 * failures never escape into startup or teardown.
 *
 * Plugin signature follows opencode's plugin API: a default-exported async
 * factory that returns lifecycle hooks.
 *
 * @param {{ directory?: string, worktree?: string }} [input] - Plugin context.
 * @param {{ spawnSync?: Function, writeDiagnostic?: Function }} [overrides] - Test seams.
 * @returns {Promise<Object>} Hooks object for the OpenCode plugin loader.
 */
export default async function sessionCleanupPlugin(input = {}, overrides = {}) {
  const projectDir = input.worktree || input.directory || REPO_ROOT;
  const runSync = overrides.spawnSync || spawnSync;
  const logPath = process.env.SESSION_CLEANUP_LOG_PATH
    || process.env.CLAUDE_SESSION_CLEANUP_LOG_PATH
    || DEFAULT_LOG_PATH;
  const logMaxBytes = positiveInteger(
    process.env.SESSION_CLEANUP_LOG_MAX_BYTES
    || process.env.CLAUDE_SESSION_CLEANUP_LOG_MAX_BYTES,
    DEFAULT_LOG_MAX_BYTES,
  );
  const writeDiagnostic = overrides.writeDiagnostic
    || ((detail) => appendPluginLog(logPath, logMaxBytes, detail));
  const warningsBySession = new Map();
  const guardedSessions = new Set();
  let disposed = false;

  function runScript(scriptPath, operation, env = process.env) {
    let result;
    try {
      result = runSync('bash', [scriptPath], {
        cwd: projectDir,
        encoding: 'utf8',
        env,
        maxBuffer: MAX_CAPTURE_BYTES * 2,
        stdio: 'pipe',
        timeout: PROCESS_TIMEOUT_MS,
      }) || {};
    } catch (error) {
      writeDiagnostic(`[session-cleanup] ${operation} launch failed: ${error?.message || error}`);
      return {};
    }

    if (result.error || result.signal
      || (typeof result.status === 'number' && result.status !== 0)) {
      const reason = result.error?.message
        || `status=${result.status ?? 'none'} signal=${result.signal ?? 'none'}`;
      writeDiagnostic(`[session-cleanup] ${operation} failed: ${reason}`);
    }
    return result;
  }

  function runStartupGuards(sessionId) {
    if (guardedSessions.has(sessionId)) return;
    guardedSessions.add(sessionId);

    const warnings = [];
    for (const scriptPath of GUARD_SCRIPTS) {
      const result = runScript(scriptPath, `guard ${scriptPath}`);
      const output = boundedText(`${result.stdout || ''}\n${result.stderr || ''}`);
      if (output) warnings.push(output);
    }
    const warning = boundedText(warnings.join('\n'));
    if (warning) warningsBySession.set(sessionId, warning);
  }

  function runCleanup() {
    runScript(CLEANUP_SCRIPT, 'cleanup', {
      ...process.env,
      SESSION_CLEANUP_LOG_PATH: logPath,
      SESSION_CLEANUP_PID: '',
      CLAUDE_SESSION_PID: '',
      SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off',
    });
  }

  return {
    async event({ event } = {}) {
      const eventType = event?.type;
      const sessionId = event?.properties?.info?.id;
      if (eventType === 'session.deleted' && sessionId) {
        guardedSessions.delete(sessionId);
        warningsBySession.delete(sessionId);
        return;
      }
      if (eventType !== 'session.created') return;
      if (!sessionId) {
        writeDiagnostic('[session-cleanup] startup guards skipped: missing session id');
        return;
      }
      runStartupGuards(sessionId);
    },

    async 'experimental.chat.system.transform'(transformInput, output) {
      const sessionId = transformInput?.sessionID;
      const warning = sessionId ? warningsBySession.get(sessionId) : null;
      if (!warning || !output || typeof output !== 'object') return;
      output.system = Array.isArray(output.system) ? output.system : [];
      output.system.push(`[session-cleanup] Startup safety warnings:\n${warning}`);
      warningsBySession.delete(sessionId);
    },

    async dispose() {
      if (disposed) return;
      disposed = true;
      guardedSessions.clear();
      warningsBySession.clear();
      runCleanup();
    },
  };
}
