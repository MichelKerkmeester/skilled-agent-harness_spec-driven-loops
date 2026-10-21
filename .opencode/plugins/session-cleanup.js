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

import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  statSync,
  truncateSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { dualPlugin } from './lib/v2-bridge.js';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(PLUGIN_ROOT, '..', '..');
const CLEANUP_SCRIPT = join(REPO_ROOT, '.skilled/scripts/session-cleanup.sh');
const PROCESS_SWEEP_SCRIPT = join(REPO_ROOT, '.skilled/skills/system-spec-kit/runtime/cli/dist/ops/process-sweep.js');
const GUARD_SCRIPTS = [
  { path: join(REPO_ROOT, '.skilled/bin/worktree-guard.sh'), args: [] },
  { path: join(REPO_ROOT, '.skilled/bin/check-git-hooks.sh'), args: [] },
  { path: join(REPO_ROOT, '.skilled/bin/git-live-follow.sh'), args: ['--start'] },
];
const PRIMARY_RECONCILE_SCRIPT = join(REPO_ROOT, '.skilled/bin/git-primary-reconcile.sh');
const DEFAULT_LOG_PATH = join(
  process.env.HOME || '/tmp',
  '.local/share/session-cleanup.log',
);
const DEFAULT_LOG_MAX_BYTES = 10 * 1024 * 1024;
const PROCESS_TIMEOUT_MS = 8000;
const PROCESS_KILL_GRACE_MS = 250;
const MAX_CAPTURE_BYTES = 4096;
const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

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

// Opt-in, matching the sweep itself: absent means do not run. A session that never configured
// this must not start terminating daemons because the feature landed.
function isSweepDisabled(env = process.env) {
  const value = env.SPECKIT_SESSION_START_ORPHAN_SWEEP;
  if (value === undefined) return true;
  return !['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
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
 * @param {{ spawn?: Function, spawnSync?: Function, writeDiagnostic?: Function }} [overrides] - Test seams.
 * @returns {Promise<Object>} Hooks object for the OpenCode plugin loader.
 */
async function sessionCleanupPlugin(input = {}, overrides = {}) {
  if (!isHookEnabled('session-cleanup')) {
    return {
      async event() {},
      async 'experimental.chat.system.transform'() {},
      async dispose() {},
    };
  }
  const projectDir = input.worktree || input.directory || REPO_ROOT;
  const runSync = overrides.spawnSync || spawnSync;
  const runAsync = overrides.spawn || spawn;
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
  const guardPromises = new Map();
  let disposed = false;

  function runScript(scriptPath, operation, args = [], env = process.env) {
    return runProcess('bash', [scriptPath, ...args], operation, env);
  }

  function runProcess(command, args, operation, env = process.env) {
    return new Promise((resolveResult) => {
      let child;
      let stdout = '';
      let stderr = '';
      let stdoutBytes = 0;
      let stderrBytes = 0;
      let settled = false;
      let killTimer = null;

      const finish = (result) => {
        if (settled) return;
        settled = true;
        if (killTimer) clearTimeout(killTimer);
        if (result.error || result.signal
          || (typeof result.status === 'number' && result.status !== 0)) {
          const reason = result.error?.message
            || `status=${result.status ?? 'none'} signal=${result.signal ?? 'none'}`;
          writeDiagnostic(`[session-cleanup] ${operation} failed: ${reason}`);
        }
        resolveResult(result);
      };

      const capture = (stream, append) => {
        stream?.setEncoding?.('utf8');
        stream?.on?.('data', (chunk) => {
          if (settled) return;
          append(String(chunk));
          if (stdoutBytes > MAX_CAPTURE_BYTES * 2 || stderrBytes > MAX_CAPTURE_BYTES * 2) {
            child?.kill?.('SIGTERM');
            finish({
              error: new Error('ENOBUFS'),
              signal: 'SIGTERM',
              status: null,
              stderr,
              stdout,
            });
          }
        });
      };

      try {
        child = runAsync(command, args, {
          cwd: projectDir,
          env,
          maxBuffer: MAX_CAPTURE_BYTES * 2,
          stdio: 'pipe',
          timeout: PROCESS_TIMEOUT_MS,
        }) || {};
      } catch (error) {
        writeDiagnostic(`[session-cleanup] ${operation} launch failed: ${error?.message || error}`);
        resolveResult({});
        return;
      }

      capture(child.stdout, (text) => {
        stdout += text;
        stdoutBytes += Buffer.byteLength(text, 'utf8');
      });
      capture(child.stderr, (text) => {
        stderr += text;
        stderrBytes += Buffer.byteLength(text, 'utf8');
      });

      child.once?.('error', (error) => {
        finish({ error, signal: null, status: null, stderr, stdout });
      });
      child.once?.('close', (status, signal) => {
        finish({ signal, status, stderr, stdout });
      });

      // A child that ignores SIGTERM must not leave the prompt transform waiting
      // beyond the guard timeout, so the deadline settles the promise regardless.
      killTimer = setTimeout(() => {
        child?.kill?.('SIGKILL');
        finish({
          error: new Error('ETIMEDOUT'),
          signal: 'SIGKILL',
          status: null,
          stderr,
          stdout,
        });
      }, PROCESS_TIMEOUT_MS + PROCESS_KILL_GRACE_MS);
      killTimer.unref?.();
    });
  }

  function runStartupGuards(sessionId) {
    if (guardedSessions.has(sessionId)) return guardPromises.get(sessionId);
    guardedSessions.add(sessionId);

    try {
      const child = runAsync('bash', [PRIMARY_RECONCILE_SCRIPT], {
        cwd: projectDir,
        detached: true,
        env: process.env,
        stdio: 'ignore',
      });
      child?.once?.('error', (error) => {
        writeDiagnostic(`[session-cleanup] primary reconcile launch failed: ${error?.message || error}`);
      });
      child?.unref?.();
    } catch (error) {
      writeDiagnostic(`[session-cleanup] primary reconcile launch failed: ${error?.message || error}`);
    }

    const runs = GUARD_SCRIPTS.map((entry) => (
      runScript(entry.path, `guard ${entry.path}`, entry.args)
        .then((result) => boundedText(`${result.stdout || ''}\n${result.stderr || ''}`))
    ));
    runs.push(
      isSweepDisabled()
        ? Promise.resolve('[session-cleanup] orphan daemon sweep skipped: kill-switch-disabled')
        : runProcess(
          process.execPath,
          [PROCESS_SWEEP_SCRIPT, 'apply'],
          'orphan daemon sweep',
        ).then((result) => boundedText(`${result.stdout || ''}\n${result.stderr || ''}`)),
    );

    const pending = Promise.all(runs).then((outputs) => {
      if (!guardedSessions.has(sessionId) || guardPromises.get(sessionId) !== pending) return;
      const warning = boundedText(outputs.filter(Boolean).join('\n'));
      if (warning) warningsBySession.set(sessionId, warning);
    });
    guardPromises.set(sessionId, pending);
    return pending;
  }

  function runCleanup() {
    let result;
    try {
      result = runSync('bash', [CLEANUP_SCRIPT], {
        cwd: projectDir,
        encoding: 'utf8',
        env: {
          ...process.env,
          SESSION_CLEANUP_LOG_PATH: logPath,
          SESSION_CLEANUP_PID: '',
          CLAUDE_SESSION_PID: '',
          SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off',
        },
        maxBuffer: MAX_CAPTURE_BYTES * 2,
        stdio: 'pipe',
        timeout: PROCESS_TIMEOUT_MS,
      }) || {};
    } catch (error) {
      writeDiagnostic(`[session-cleanup] cleanup launch failed: ${error?.message || error}`);
      return;
    }

    if (result.error || result.signal
      || (typeof result.status === 'number' && result.status !== 0)) {
      const reason = result.error?.message
        || `status=${result.status ?? 'none'} signal=${result.signal ?? 'none'}`;
      writeDiagnostic(`[session-cleanup] cleanup failed: ${reason}`);
    }
  }

  return {
    async event({ event } = {}) {
      const eventType = event?.type;
      const sessionId = event?.properties?.info?.id;
      if (eventType === 'session.deleted' && sessionId) {
        guardedSessions.delete(sessionId);
        guardPromises.delete(sessionId);
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
      const pending = sessionId ? guardPromises.get(sessionId) : null;
      if (pending) {
        await pending;
        guardPromises.delete(sessionId);
      }
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
      guardPromises.clear();
      warningsBySession.clear();
      runCleanup();
    },
  };
}

export default dualPlugin('session-cleanup', sessionCleanupPlugin);
