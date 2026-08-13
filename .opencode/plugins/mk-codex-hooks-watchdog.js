// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-codex-hooks-watchdog OpenCode Plugin                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Codex reads hooks only from user-global ~/.codex/hooks.json, a   ║
// ║          file that can silently drift from the repo (stale checkout       ║
// ║          anchor, missing adapter). Claude/OpenCode hooks are repo-local   ║
// ║          and cannot drift, so on each OpenCode session start this runs    ║
// ║          the installer's non-mutating --check and records drift for the   ║
// ║          operator. Surfacing only; repair stays an explicit installer run.║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { appendFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));
const WARN_LOG_RELATIVE = join('.opencode', 'logs', 'codex-hooks-watchdog.log');
const MAX_GUARD_LOG_BYTES = 256 * 1024;
const MAX_SESSION_IDS = 1_000;
const CHECK_TIMEOUT_MS = 5_000;

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

// Plugin output must never reach stdout/stderr: OpenCode paints plugin console
// output onto the prompt input line, where it corrupts the interactive session.
// Persist to a bounded workspace log instead. Fail-open: a logging error must
// never affect the guarded session.
function appendWatchdogLog(projectDir, detail) {
  try {
    const logPath = join(projectDir, WARN_LOG_RELATIVE);
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size > MAX_GUARD_LOG_BYTES) truncateSync(logPath, 0);
    } catch (_) { /* first write: no existing file to trim */ }
    appendFileSync(logPath, `${new Date().toISOString()} ${detail}\n`);
  } catch (_) { /* fail-open */ }
}

export default async function MkCodexHooksWatchdogPlugin(ctx) {
  const projectDir = ctx?.directory || join(PLUGIN_DIR, '..', '..');
  const warned = new Set();

  return {
    async event(input) {
      try {
        if (eventTypeFrom(input) !== 'session.created') return;
        const sessionId = String(sessionIdFromEvent(input));
        if (warned.has(sessionId)) return;
        if (warned.size >= MAX_SESSION_IDS) warned.delete(warned.values().next().value);
        warned.add(sessionId);
        try {
          execFileSync(
            'node',
            [join(projectDir, '.opencode', 'bin', 'install-codex-hooks.mjs'), '--check'],
            { cwd: projectDir, stdio: 'ignore', timeout: CHECK_TIMEOUT_MS },
          );
        } catch (_) {
          // Non-zero exit means the user-global Codex hooks drifted from the repo
          // (or the installer could not run). Record the remediation, never throw.
          appendWatchdogLog(
            projectDir,
            'codex hook drift detected; run: node .opencode/bin/install-codex-hooks.mjs --check',
          );
        }
      } catch (_) { /* fail-open: a watchdog must never degrade a session */ }
    },
  };
}
