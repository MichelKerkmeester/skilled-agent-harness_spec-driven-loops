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
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  checkAllFreshness,
  formatWarning,
} = require('../skills/system-spec-kit/scripts/lib/dist-freshness.cjs');

const RISKY_BASH_COMMAND_REGEX = /opencode\s+run|\bvalidate\.sh\b/i;
const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));
const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'dist-freshness-guard.log');
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
  return payload.sessionID || payload.sessionId || payload.session?.id || properties.sessionID || properties.sessionId || '__unknown-session__';
}

function stalePackages(projectDir) {
  return checkAllFreshness({ workspaceRoot: projectDir }).filter((result) => result.stale);
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
    appendFileSync(logPath, `${new Date().toISOString()} [mk-dist-freshness-guard] ${detail}\n`, 'utf8');
  } catch (_) {
    // Swallow: an audit-log failure must not disturb the session it observes.
  }
}

function buildBrief(stale) {
  if (!Array.isArray(stale) || stale.length === 0) return '';
  const lines = stale.map(formatWarning).filter(Boolean);
  if (lines.length === 0) return '';
  return [
    '[dist-freshness-guard] Local compiled dist is stale; affected outputs may be untrustworthy until rebuilt:',
    ...lines.map((line) => `- ${line}`),
  ].join('\n');
}

export default async function MkDistFreshnessGuardPlugin(ctx) {
  const projectDir = ctx?.directory || join(PLUGIN_DIR, '..', '..');
  const sessionWarned = new Set();
  // Per-instance freshness cache so multiple sessions in one process never share
  // a mismatched projectDir result.
  let staleCache = null;
  let staleCheckedAt = 0;

  function refreshStale(prefix) {
    try {
      staleCache = stalePackages(projectDir);
    } catch (error) {
      appendGuardLog(projectDir, `freshness check failed: ${error?.message || error}`);
      if (staleCache === null) staleCache = [];
    }
    staleCheckedAt = Date.now();
    if (staleCache.length > 0) {
      const details = staleCache.map(formatWarning).filter(Boolean).join('; ');
      if (details) appendGuardLog(projectDir, `${prefix}: ${details}`);
    }
    return staleCache;
  }

  function staleForInjection() {
    if (staleCache === null || (Date.now() - staleCheckedAt) >= STALE_CACHE_TTL_MS) {
      return refreshStale('inject');
    }
    return staleCache;
  }

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (!input || input.tool !== 'bash') return;
        const commandText = commandTextFromArgs(output?.args);
        if (!RISKY_BASH_COMMAND_REGEX.test(commandText)) return;
        refreshStale('risky-bash');
      } catch (error) {
        appendGuardLog(projectDir, `freshness check failed: ${error?.message || error}`);
      }
    },

    async event(input) {
      try {
        if (eventTypeFrom(input) !== 'session.created') return;
        const sessionId = String(sessionIdFromEvent(input));
        if (sessionWarned.has(sessionId)) return;
        sessionWarned.add(sessionId);
        refreshStale('session.created');
      } catch (error) {
        appendGuardLog(projectDir, `session freshness check failed: ${error?.message || error}`);
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        const brief = buildBrief(staleForInjection());
        if (!brief || !output || typeof output !== 'object') return;
        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(brief);
      } catch (error) {
        appendGuardLog(projectDir, `system transform failed: ${error?.message || error}`);
      }
    },
  };
}
