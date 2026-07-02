// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-dist-freshness-guard OpenCode Plugin                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Warn when Bash dispatches or new sessions are about to trust    ║
// ║          stale local dist outputs.                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
  checkAllFreshness,
  formatWarning,
} = require('../skills/system-spec-kit/scripts/lib/dist-freshness.cjs');

const RISKY_BASH_COMMAND_REGEX = /opencode\s+run|\bvalidate\.sh\b/i;
const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));

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

function warnForStalePackages(prefix, stale) {
  if (stale.length === 0) return;
  const details = stale.map(formatWarning).filter(Boolean).join('; ');
  if (details) console.warn(`[mk-dist-freshness-guard] ${prefix}: ${details}`);
}

export default async function MkDistFreshnessGuardPlugin(ctx) {
  const projectDir = ctx?.directory || join(PLUGIN_DIR, '..', '..');
  const sessionWarned = new Set();

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (!input || input.tool !== 'bash') return;
        const commandText = commandTextFromArgs(output?.args);
        if (!RISKY_BASH_COMMAND_REGEX.test(commandText)) return;
        warnForStalePackages('WARN', stalePackages(projectDir));
      } catch (error) {
        console.error(`[mk-dist-freshness-guard] WARN: freshness check failed: ${error?.message || error}`);
      }
    },

    async event(input) {
      try {
        if (eventTypeFrom(input) !== 'session.created') return;
        const sessionId = String(sessionIdFromEvent(input));
        if (sessionWarned.has(sessionId)) return;
        sessionWarned.add(sessionId);
        warnForStalePackages('session.created', stalePackages(projectDir));
      } catch (error) {
        console.error(`[mk-dist-freshness-guard] WARN: session freshness check failed: ${error?.message || error}`);
      }
    },
  };
}
