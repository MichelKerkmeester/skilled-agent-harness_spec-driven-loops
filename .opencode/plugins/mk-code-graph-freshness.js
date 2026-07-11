// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-code-graph-freshness OpenCode Plugin (adapter)             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral freshness   ║
// ║          core. After a source-file write/edit lands, debounces the edit ║
// ║          burst and -- only when the graph is already established and   ║
// ║          the daemon is warm -- fire-and-forget dispatches a warm-only   ║
// ║          incremental code_graph_scan so the graph self-heals from       ║
// ║          soft-stale back to fresh. Never blocks the tool call, never    ║
// ║          cold-starts the daemon, and never writes stdout/stderr. The    ║
// ║          policy, the debounce state, and the two cheap file probes live ║
// ║          in the shared core so the Claude PostToolUse hook applies the  ║
// ║          identical decision; this file only maps OpenCode's             ║
// ║          tool.execute.after / event transport onto it, owns the         ║
// ║          detached spawn, and owns a real in-memory debounce timer that  ║
// ║          a short-lived process cannot have.                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

// The freshness policy lives outside .opencode/plugins/ so this file can stay
// a thin, default-export-only OpenCode plugin while the Claude hook consumes
// the same core. A .cjs core is required here via createRequire so both the
// factory body and its attached __test surface can reach it synchronously.
const require = createRequire(import.meta.url);
const freshnessCore = require('../skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Same mutating-tool set mk-dist-freshness-guard.js / mk-post-edit-quality.js
// watch, reused here because every plugin needs the identical
// "did this tool just write a file" signal from tool.execute.before's args shape.
const MUTATING_TOOLS = new Set(['write', 'edit', 'patch', 'multiedit', 'apply_patch', 'apply-patch']);
const MAX_CALL_IDS = 1_000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function extractFilePath(args) {
  if (!args || typeof args !== 'object') return null;
  const candidate = args.filePath || args.file_path || args.path;
  return typeof candidate === 'string' && candidate.length > 0 ? candidate : null;
}

function resolveQuietMs() {
  const raw = Number(process.env[freshnessCore.QUIET_MS_ENV]);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : 4000;
}

/**
 * Bounded callID -> filePath correlation map. The `@opencode-ai/plugin` Hooks
 * type puts `args` on `tool.execute.before`'s OUTPUT but only on
 * `tool.execute.after`'s INPUT alongside title/output/metadata on its own
 * output -- so `tool.execute.after`'s `output.args` is always undefined and a
 * guard reading it there is a silent no-op on every edit. `before` stashes the
 * path by callID here; `after` retrieves + evicts it, mirroring the identical,
 * already-proven pattern in mk-post-edit-quality.js.
 */
function createCorrelationMap(maxEntries = MAX_CALL_IDS) {
  const map = new Map();
  return {
    stash(callID, filePath) {
      if (!callID || !filePath) return;
      if (map.size >= maxEntries) map.delete(map.keys().next().value);
      map.set(callID, filePath);
    },
    take(callID) {
      if (!callID || !map.has(callID)) return null;
      const filePath = map.get(callID);
      map.delete(callID);
      return filePath;
    },
    size() {
      return map.size;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-code-graph-freshness OpenCode plugin hooks.
 *
 * Hard limits (by design, not oversight):
 * - Never blocks or throws into the tool path: unlike mk-deep-loop-guard, a
 *   guard bug here must never affect an unrelated write/edit, so every
 *   handler fails open on its own error.
 * - Never cold-starts the daemon: a scan only dispatches once the cheap
 *   heartbeat probe passes, and every dispatch still carries `--warm-only`
 *   as a backstop against a probe-to-spawn race.
 * - The Claude-side trailing edge is inherently bounded (a stateless hook
 *   cannot "wait" for quiet); this plugin's advantage is a real in-memory
 *   timer that fires drainPending() once a burst goes quiet, which the
 *   Claude adapter cannot reproduce.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkCodeGraphFreshnessPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const runtimeState = { lastFreshnessSweepAtMs: 0 };
  const drainTimers = new Map(); // sessionID -> Timeout
  const callPaths = createCorrelationMap();

  function clearDrainTimer(sessionID) {
    const existing = drainTimers.get(sessionID);
    if (existing) {
      try { clearTimeout(existing); } catch (_) { /* a lost timer is harmless */ }
      drainTimers.delete(sessionID);
    }
  }

  function clearAllDrainTimers() {
    for (const sessionID of [...drainTimers.keys()]) clearDrainTimer(sessionID);
  }

  function dispatchScan(dispatchSpec) {
    try {
      freshnessCore.acquireScanLock({ projectDir });
      const binPath = join(projectDir, dispatchSpec.bin);
      const child = spawn(
        process.execPath,
        [binPath, ...dispatchSpec.args],
        {
          cwd: projectDir,
          detached: true,
          stdio: 'ignore',
          env: { ...process.env, ...(dispatchSpec.env || {}) },
        },
      );
      const release = () => {
        try { freshnessCore.releaseScanLock({ projectDir }); } catch (_) { /* fail open */ }
      };
      child.on('exit', release);
      child.on('error', release);
      child.unref();
    } catch (_) {
      // Fail open: a spawn error must never affect the tool call it followed.
    }
  }

  function applyResult(result) {
    if (!result) return;
    for (const audit of result.audits || []) freshnessCore.appendFreshnessLog(projectDir, audit);
    for (const warning of result.warnings || []) freshnessCore.appendFreshnessLog(projectDir, warning);
    if (result.decision === 'scan' && result.dispatch) dispatchScan(result.dispatch);
  }

  function armDrainTimer(sessionID) {
    clearDrainTimer(sessionID);
    const quietMs = resolveQuietMs();
    const timer = setTimeout(() => {
      drainTimers.delete(sessionID);
      try {
        applyResult(freshnessCore.drainPending({ projectDir, sessionID, env: process.env }));
      } catch (_) {
        // Fail open: a timer callback must never throw into the process.
      }
    }, quietMs);
    if (typeof timer.unref === 'function') timer.unref();
    drainTimers.set(sessionID, timer);
  }

  const hooks = {
    async event(input = {}) {
      try {
        if (freshnessCore.isFreshnessDisabled(process.env)) return;
        const type = input?.event?.type || input?.type;
        if (type === 'session.created') {
          freshnessCore.sweepStaleFreshnessState(projectDir, runtimeState);
          // A crashed prior process can leave pending edits behind under a
          // session id nobody will ever resume; a new session is a safe,
          // low-frequency point to drain them instead of losing the refresh.
          applyResult(freshnessCore.drainPending({ projectDir, env: process.env }));
        } else if (type === 'server.instance.disposed' || type === 'global.disposed') {
          clearAllDrainTimers();
        }
      } catch (_) {
        // Fail open: a lifecycle error must never affect session teardown/startup.
      }
    },
    async 'tool.execute.before'(input, output) {
      try {
        if (freshnessCore.isFreshnessDisabled(process.env)) return;
        if (!input) return;
        const tool = String(input.tool || '').toLowerCase();
        if (!MUTATING_TOOLS.has(tool)) return;
        const filePath = extractFilePath(output && output.args);
        if (!filePath) return;
        callPaths.stash(input.callID, filePath);
      } catch (_) {
        // Fail open: a capture error must never block the edit.
      }
    },
    async 'tool.execute.after'(input, output) {
      try {
        if (freshnessCore.isFreshnessDisabled(process.env)) return;
        if (!input) return;
        const tool = String(input.tool || '').toLowerCase();
        if (!MUTATING_TOOLS.has(tool)) return;
        const filePath = callPaths.take(input.callID);
        if (!filePath) return;
        const sessionID = input.sessionID || '__unknown-session__';

        const result = freshnessCore.evaluateEdit({
          filePath,
          sessionID,
          projectDir,
          env: process.env,
        });
        applyResult(result);
        // Only a long-lived OpenCode process can meaningfully arm a real
        // timer to catch the trailing edge of a settled burst.
        armDrainTimer(sessionID);
      } catch (_) {
        // Fail open: never block or affect the tool call this observed.
      }
    },
  };

  return hooks;
}

// Test surface hangs off the default export function itself -- a named
// export here would be loaded as its own (invalid) plugin and silently drop
// this entire file (plugins/README.md:26-28).
MkCodeGraphFreshnessPlugin.__test = {
  core: freshnessCore, extractFilePath, resolveQuietMs, MUTATING_TOOLS, createCorrelationMap,
};
