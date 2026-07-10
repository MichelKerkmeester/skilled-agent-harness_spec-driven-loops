// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-dist-freshness-guard OpenCode Plugin                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Warn when Bash dispatches or new sessions are about to trust    ║
// ║          stale local dist outputs. The signal reaches the agent through  ║
// ║          bounded system-context injection and an auditable log file --   ║
// ║          never the terminal (see appendGuardLog for why).                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { appendFileSync, copyFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  checkAllFreshness,
  formatCheckError,
  formatWarning,
  packageForSourceFile,
} = require('../skills/system-spec-kit/scripts/lib/dist-freshness.cjs');

const RISKY_BASH_COMMAND_REGEX = /opencode\s+run|\bvalidate\.sh\b/i;
const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));
const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'dist-freshness-guard.log');
const MAX_GUARD_LOG_BYTES = 256 * 1024;
const MAX_SESSION_IDS = 1_000;
const MAX_DIAGNOSTIC_LINES = 8;
const MUTATING_TOOLS = new Set(['write', 'edit', 'patch', 'multiedit', 'apply_patch', 'apply-patch']);
// Re-hashing every watched package's sources is far too costly to run on every
// chat turn, so the per-turn system-context injection reuses a short-lived cache
// that the bounded bash/session triggers force-refresh.
const STALE_CACHE_TTL_MS = 120_000;

function commandTextFromArgs(args) {
  if (!args || typeof args !== 'object') return '';
  if (typeof args.command === 'string') return args.command;
  try {
    return JSON.stringify(args);
  } catch (_) {
    return '';
  }
}

function eventPayloadFrom(input) {
  if (input?.event && typeof input.event === 'object') return input.event;
  if (input?.payload && typeof input.payload === 'object') return input.payload;
  return input || {};
}

function eventTypeFrom(input) {
  const payload = eventPayloadFrom(input);
  return typeof payload.type === 'string' ? payload.type : null;
}

function sessionIdFromEvent(input) {
  const payload = eventPayloadFrom(input);
  const properties = payload.properties && typeof payload.properties === 'object' ? payload.properties : {};
  const info = properties.info && typeof properties.info === 'object' ? properties.info : {};
  return payload.sessionID || payload.sessionId || payload.session?.id
    || properties.sessionID || properties.sessionId || properties.session?.id
    || info.sessionID || info.sessionId || info.id || '__unknown-session__';
}

function freshnessDiagnostics(projectDir) {
  return checkAllFreshness({ workspaceRoot: projectDir })
    .filter((result) => result.stale || result.status === 'error');
}

function formatDiagnostic(result) {
  return result?.status === 'error' ? formatCheckError(result) : formatWarning(result);
}

// Plugin warnings must never reach stdout/stderr: OpenCode's TUI paints plugin
// console output onto the prompt input line, where it sticks until a redraw and
// corrupts the interactive session. Persisting to a workspace log keeps the
// signal auditable, and the system-context injection makes it actionable for the
// agent. Fail-open -- a logging error must never affect the guarded work.
function appendGuardLog(projectDir, detail) {
  try {
    const logPath = join(projectDir, WARN_LOG_RELATIVE);
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= MAX_GUARD_LOG_BYTES) {
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch (_) {
      // A missing active log is the normal first-write case.
    }
    appendFileSync(logPath, `${new Date().toISOString()} [mk-dist-freshness-guard] ${detail}\n`, 'utf8');
  } catch (_) {
    // Swallow: an audit-log failure must not disturb the session it observes.
  }
}

function buildBrief(diagnostics) {
  if (!Array.isArray(diagnostics) || diagnostics.length === 0) return '';
  const stale = diagnostics.filter((result) => result.stale).map(formatWarning).filter(Boolean);
  const errors = diagnostics.filter((result) => result.status === 'error').map(formatCheckError).filter(Boolean);
  const lines = [];
  if (stale.length > 0) {
    lines.push('[dist-freshness-guard] Local compiled dist is stale; affected outputs may be untrustworthy until rebuilt:');
    lines.push(...stale.map((line) => `- ${line}`));
  }
  if (errors.length > 0) {
    lines.push('[dist-freshness-guard] CHECK ERROR: freshness could not be verified for every package:');
    lines.push(...errors.map((line) => `- ${line}`));
  }
  return lines.slice(0, MAX_DIAGNOSTIC_LINES + 2).join('\n');
}

export default async function MkDistFreshnessGuardPlugin(ctx) {
  const projectDir = ctx?.directory || join(PLUGIN_DIR, '..', '..');
  const sessionWarned = new Set();
  // Per-instance freshness cache so multiple sessions in one process never share
  // a mismatched projectDir result.
  let diagnosticCache = null;
  let diagnosticCheckedAt = 0;

  function refreshDiagnostics(prefix) {
    try {
      diagnosticCache = freshnessDiagnostics(projectDir);
    } catch (error) {
      diagnosticCache = [{
        packageId: null,
        packageName: null,
        status: 'error',
        stale: false,
        message: error?.message || String(error),
      }];
    }
    diagnosticCheckedAt = Date.now();
    if (diagnosticCache.length > 0) {
      const details = diagnosticCache.map(formatDiagnostic).filter(Boolean).slice(0, MAX_DIAGNOSTIC_LINES).join('; ');
      if (details) appendGuardLog(projectDir, `${prefix}: ${details}`);
    }
    return diagnosticCache;
  }

  function diagnosticsForInjection() {
    if (diagnosticCache === null || (Date.now() - diagnosticCheckedAt) >= STALE_CACHE_TTL_MS) {
      return refreshDiagnostics('inject');
    }
    return diagnosticCache;
  }

  function invalidateMutation(input, output) {
    const tool = typeof input?.tool === 'string' ? input.tool.toLowerCase() : '';
    if (!MUTATING_TOOLS.has(tool)) return false;
    const args = output?.args;
    const filePath = args && typeof args === 'object'
      ? args.filePath || args.file_path || args.path
      : null;
    if (typeof filePath === 'string' && filePath
      && !packageForSourceFile(resolve(projectDir, filePath), { workspaceRoot: projectDir })) return false;
    diagnosticCache = null;
    diagnosticCheckedAt = 0;
    return true;
  }

  function rememberSession(sessionId) {
    if (sessionWarned.has(sessionId)) return false;
    if (sessionWarned.size >= MAX_SESSION_IDS) {
      sessionWarned.delete(sessionWarned.values().next().value);
    }
    sessionWarned.add(sessionId);
    return true;
  }

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (invalidateMutation(input, output)) return;
        if (!input || String(input.tool).toLowerCase() !== 'bash') return;
        const commandText = commandTextFromArgs(output?.args);
        if (!RISKY_BASH_COMMAND_REGEX.test(commandText)) return;
        refreshDiagnostics('risky-bash');
      } catch (error) {
        appendGuardLog(projectDir, `freshness check failed: ${error?.message || error}`);
      }
    },

    async event(input) {
      try {
        const eventType = eventTypeFrom(input);
        if (eventType === 'session.deleted') {
          sessionWarned.delete(String(sessionIdFromEvent(input)));
          return;
        }
        if (eventType === 'server.instance.disposed' || eventType === 'global.disposed') {
          sessionWarned.clear();
          diagnosticCache = null;
          diagnosticCheckedAt = 0;
          return;
        }
        if (eventType !== 'session.created') return;
        const sessionId = String(sessionIdFromEvent(input));
        if (!rememberSession(sessionId)) return;
        refreshDiagnostics('session.created');
      } catch (error) {
        appendGuardLog(projectDir, `session freshness check failed: ${error?.message || error}`);
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        const brief = buildBrief(diagnosticsForInjection());
        if (!brief || !output || typeof output !== 'object') return;
        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(brief);
      } catch (error) {
        appendGuardLog(projectDir, `system transform failed: ${error?.message || error}`);
      }
    },
  };
}
