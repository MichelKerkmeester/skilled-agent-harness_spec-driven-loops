// ─────────────────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch OpenCode Plugin
// ─────────────────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const childProcess = require('node:child_process');
const core = require('../hooks/session-relaunch/lib/relaunch-core.cjs');
const contextUsage = require('../hooks/session-relaunch/lib/context-usage.cjs');
const nudge = require('../hooks/session-relaunch/lib/nudge.cjs');
const hookFlags = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
const DEFAULT_THRESHOLD = 0.8;
const DEFAULT_MAX_AGE_MIN = 10;
const MAX_SESSIONS = 1_000;
const CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const KILLER_PATH = require.resolve('../hooks/session-relaunch/lib/killer.cjs');

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function sessionIdOf(input) {
  const value = input?.sessionID;
  return nudge.validSessionId(value) ? value : null;
}

function resolveWindow(modelWindow) {
  return positiveNumber(process.env.SESSION_RELAUNCH_WINDOW_TOKENS)
    ?? positiveNumber(modelWindow);
}

function relaunchThreshold(config) {
  const value = process.env.SESSION_RELAUNCH_THRESHOLD
    ?? config.SESSION_RELAUNCH_THRESHOLD;
  const threshold = Number(value);
  return Number.isFinite(threshold) && threshold > 0 && threshold <= 1
    ? threshold
    : DEFAULT_THRESHOLD;
}

function plannedNotePath(directory, sessionID) {
  const repoRoot = path.resolve(
    process.env.REPO_ROOT || directory || process.cwd(),
  );
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return path.join(
    repoRoot,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
    `${stamp}-${sessionID.slice(0, 8)}.md`,
  );
}

function existingHandoffPath(directory, sessionID) {
  const handoffsDir = path.dirname(plannedNotePath(directory, sessionID));
  let filenames;
  try {
    filenames = fs.readdirSync(handoffsDir);
  } catch {
    return null;
  }

  const suffix = `-${sessionID.slice(0, 8)}.md`;
  for (const filename of filenames) {
    if (!filename.endsWith(suffix)) continue;
    const notePath = path.join(handoffsDir, filename);
    let contents;
    try {
      contents = fs.readFileSync(notePath, 'utf8');
    } catch {
      continue;
    }
    let parsed;
    try {
      parsed = core.parseHandoff(contents);
    } catch {
      continue;
    }
    if (
      parsed.frontmatter.session_id === sessionID
      && parsed.frontmatter.status === 'open'
    ) return notePath;
  }
  return null;
}

function validLoopId(loopId) {
  if (!loopId) return null;
  try {
    core.relaunchFilePath(loopId, process.env);
    return loopId;
  } catch {
    return null;
  }
}

// The armed-age limit mirrors the CLI's numeric switch rule: unset, empty,
// negative or non-numeric values fall back, zero stays valid. A stale armed
// record means the spawned killer died before firing, so it stops suppressing.
function relaunchMaxAgeMinutes() {
  const switches = {
    ...hookFlags.loadConfigFile(hookFlags.configPath()),
    ...process.env,
  };
  const rawValue = switches.SESSION_RELAUNCH_MAX_AGE_MIN;
  if (rawValue === undefined || String(rawValue).trim() === '') {
    return DEFAULT_MAX_AGE_MIN;
  }
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_MAX_AGE_MIN;
}

function armedRecordIsStale(record) {
  const armedAtMs = Date.parse(record?.armedAt);
  return !Number.isFinite(armedAtMs)
    || Date.now() - armedAtMs > relaunchMaxAgeMinutes() * 60_000;
}

function shouldPushActiveNudge(activeNudge, sessionID) {
  if (!activeNudge) return false;
  const loopId = validLoopId(process.env.SKILLED_LOOP_ID);
  if (!loopId) return !fs.existsSync(activeNudge.notePath);

  try {
    const record = core.readRelaunchFile(loopId, process.env);
    if (record?.sessionId !== sessionID) return true;
    if (record.status === 'armed') return armedRecordIsStale(record);
    return record.status !== 'pending';
  } catch {
    return true;
  }
}

function notePathFromSeed(prompt) {
  const marker = 'claim and continue handoff ';
  const markerIndex = prompt.indexOf(marker);
  if (markerIndex < 0) return '<handoff-path>';
  const seedRemainder = prompt.slice(markerIndex + marker.length);
  const specFolderMarkerIndex = seedRemainder.indexOf(' | Spec folder: ');
  const rawPath = (specFolderMarkerIndex < 0
    ? seedRemainder
    : seedRemainder.slice(0, specFolderMarkerIndex)).trim();
  return rawPath.replace(/\\([\\'"$`])/g, '$1') || '<handoff-path>';
}

function makeState() {
  return {
    contextWindow: null,
    lastAssistantMessageId: null,
    latestUserMessageId: null,
    nudgeLevel: 0,
    activeNudge: null,
    pendingNudge: null,
    pendingSeed: null,
    pendingUsage: null,
  };
}

function stateFor(sessionStates, sessionID) {
  let state = sessionStates.get(sessionID);
  if (state) {
    sessionStates.delete(sessionID);
    sessionStates.set(sessionID, state);
    return state;
  }

  if (sessionStates.size >= MAX_SESSIONS) {
    sessionStates.delete(sessionStates.keys().next().value);
  }
  state = makeState();
  sessionStates.set(sessionID, state);
  return state;
}

function queueNudge(state, sessionID, fillTokens, windowTokens, directory) {
  if (state.pendingNudge) {
    state.pendingUsage = null;
    return;
  }

  const ratio = contextUsage.fillRatio(fillTokens, windowTokens);
  const threshold = relaunchThreshold(hookFlags.loadConfigFile(hookFlags.configPath()));
  state.pendingUsage = null;
  if (ratio < threshold) return;

  const persistedLevel = nudge.readState(sessionID, process.env);
  const currentLevel = Math.max(persistedLevel, state.nudgeLevel);
  const isRestartedNudge = !state.activeNudge && persistedLevel >= 1;
  const decision = isRestartedNudge
    ? { level: currentLevel, nudge: true }
    : nudge.nextLevel({ ratio, threshold, state: currentLevel });
  if (!decision.nudge) return;

  const notePath = state.activeNudge?.notePath
    ?? (isRestartedNudge ? existingHandoffPath(directory, sessionID) : null)
    ?? plannedNotePath(directory, sessionID);
  const nextNudge = {
    level: decision.level,
    notePath,
    text: nudge.handoffText({
      notePath,
      sessionId: sessionID,
      specFolder: process.env.SYSTEM_SPEC_FOLDER || undefined,
      runtime: 'opencode',
      cliPath: CLI_COMMAND,
      cwd: directory || process.cwd(),
      ratio,
    }),
  };
  state.activeNudge = nextNudge;
  state.pendingNudge = nextNudge;
}

// Logging is best-effort: a state-dir failure must never break the plugin host.
function logEvent(event, fields) {
  try {
    core.appendLog(event, fields, process.env);
  } catch {}
}

function logSpawnError(loopId, error) {
  logEvent('session-idle-arm-error', {
    stage: 'spawn',
    loopId,
    message: error?.message || 'killer spawn failed',
  });
}

function spawnKiller(loopId) {
  const command = process.versions.bun ? 'node' : process.execPath;
  try {
    const child = childProcess.spawn(
      command,
      [KILLER_PATH, '--loop-id', loopId, '--target-pid', String(process.pid)],
      { detached: true, stdio: 'ignore' },
    );
    if (typeof child?.on === 'function') {
      child.on('error', (error) => logSpawnError(loopId, error));
    }
    if (typeof child?.unref === 'function') child.unref();
  } catch (error) {
    logSpawnError(loopId, error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

export default function sessionRelaunchPlugin(ctx = {}) {
  const sessionStates = new Map();

  function isEnabled() {
    try {
      const config = hookFlags.loadConfigFile(hookFlags.configPath());
      return hookFlags.isHookEnabled(CONCERN, process.env, config);
    } catch {
      return false;
    }
  }

  return {
    async event(payload) {
      try {
        if (!isEnabled()) return;
        const event = payload?.event;
        const properties = event?.properties;
        const sessionID = properties?.sessionID;
        if (!nudge.validSessionId(sessionID)) return;

        if (event.type === 'message.updated') {
          const info = properties.info;
          if (!info || typeof info !== 'object') return;

          if (info.role === 'user' && typeof info.id === 'string') {
            const state = stateFor(sessionStates, sessionID);
            if (state.latestUserMessageId !== info.id) state.pendingSeed = null;
            state.latestUserMessageId = info.id;
            return;
          }

          if (info.role !== 'assistant') return;
          const completedAt = positiveNumber(info.time?.completed);
          if (completedAt === null) return;

          const state = stateFor(sessionStates, sessionID);
          if (
            typeof info.id === 'string'
            && state.lastAssistantMessageId === info.id
          ) return;
          state.lastAssistantMessageId = info.id || null;
          if (state.pendingNudge) return;

          const fillTokens = contextUsage.fillFromOpenCodeTokens(info.tokens);
          state.pendingUsage = { fillTokens };
          const windowTokens = resolveWindow(state.contextWindow);
          if (windowTokens !== null) {
            queueNudge(
              state,
              sessionID,
              fillTokens,
              windowTokens,
              ctx.directory,
            );
          }
          return;
        }

        if (event.type === 'message.part.updated') {
          const state = sessionStates.get(sessionID);
          const part = properties.part;
          if (
            !state
            || part?.type !== 'text'
            || typeof part.text !== 'string'
            || part.messageID !== state.latestUserMessageId
          ) return;

          if (nudge.isSeedPrompt(part.text)) {
            state.pendingSeed = nudge.seedText({
              notePath: notePathFromSeed(part.text),
              specFolder: nudge.specFolderFromSeed(part.text),
              sessionId: sessionID,
              cliPath: CLI_COMMAND,
            });
          }
          return;
        }

        if (event.type === 'session.idle') {
          const loopId = process.env.SKILLED_LOOP_ID;
          if (!loopId) return;
          const pending = core.readRelaunchFile(loopId, process.env);
          if (
            pending?.status !== 'pending'
            || pending.sessionId !== sessionID
            || pending.runtime !== 'opencode'
          ) return;

          const directory = typeof ctx.directory === 'string'
            ? ctx.directory
            : process.cwd();
          const armed = core.arm({ loopId, cwd: directory, env: process.env });
          if (armed?.status !== 'armed') return;
          spawnKiller(loopId);
        }
      } catch {
        return undefined;
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        if (!isEnabled() || !output || typeof output !== 'object') return;
        output.system = Array.isArray(output.system) ? output.system : [];

        const sessionID = sessionIdOf(input);
        if (!sessionID) return;
        const state = sessionStates.get(sessionID);
        if (!state) return;

        const windowTokens = resolveWindow(input?.model?.limit?.context);
        if (windowTokens !== null) state.contextWindow = windowTokens;
        if (state.pendingUsage && windowTokens !== null && !state.pendingNudge) {
          queueNudge(
            state,
            sessionID,
            state.pendingUsage.fillTokens,
            windowTokens,
            ctx.directory,
          );
        }

        if (state.pendingSeed) {
          output.system.push(state.pendingSeed);
          state.pendingSeed = null;
        }
        const activeNudge = state.activeNudge;
        const shouldPushNudge = shouldPushActiveNudge(activeNudge, sessionID);
        if (state.pendingNudge) {
          const pending = state.pendingNudge;
          state.nudgeLevel = pending.level;
          state.pendingNudge = null;
          try {
            nudge.writeState(sessionID, pending.level, process.env);
          } catch {}
        }
        if (shouldPushNudge) output.system.push(activeNudge.text);

        state.latestUserMessageId = null;
      } catch {
        return undefined;
      }
    },
  };
}
