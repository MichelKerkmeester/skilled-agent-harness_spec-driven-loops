// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch OpenCode Plugin
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { createRequire } from 'node:module';

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

function validLoopId(loopId) {
  if (!loopId) return null;
  try {
    core.relaunchFilePath(loopId, process.env);
    return loopId;
  } catch {
    return null;
  }
}

// A record this session already owns suppresses the nudge: pending always, and
// armed until it goes stale, because a stale record's killer died before firing
// and can never relaunch. The nudge module answers that same question for every
// runtime, so the age limit keeps one reader instead of two that can disagree.
function shouldPushActiveNudge(activeNudge, sessionID) {
  if (!activeNudge) return false;
  // A session at its hop cap cannot relaunch, so even a held nudge is spent.
  if (nudge.hopLimitReached(process.env)) return false;
  // Without a usable loop id there is no record to consult, so an existing note
  // is the only proof this session already wrote its handoff.
  if (!validLoopId(process.env.SKILLED_LOOP_ID)) return !fs.existsSync(activeNudge.notePath);
  return !nudge.handoffPending({ sessionId: sessionID, env: process.env });
}

// A turn rebuilds the system prompt for every model request, and an auxiliary
// request may consume the first one, so the claim instructions stay in place
// until the note leaves the open state. A note that cannot be read keeps them
// too: a failed read is no proof that the note was claimed.
function seedNoteStatus(seed) {
  if (!seed.notePath) return 'open';
  let contents;
  try {
    contents = fs.readFileSync(seed.notePath, 'utf8');
  } catch {
    return 'open';
  }
  try {
    return core.parseHandoff(contents).frontmatter.status;
  } catch {
    return 'open';
  }
}

// A claimed note already ran the claim steps, so repeating the full seed text asks
// for work the note records as done. The completion step is the one still owed.
function claimedReminder(seed) {
  const complete = nudge.completeCommandFor(seed.notePath, CLI_COMMAND);
  return `[${CONCERN}] This session claimed handoff note ${seed.notePath}. `
    + `When the remaining work is done, run \`${complete}\` to close the note.`;
}

function makeState() {
  return {
    contextWindow: null,
    lastAssistantMessageId: null,
    latestUserMessageId: null,
    nudgeLevel: 0,
    activeNudge: null,
    pendingNudge: null,
    activeSeed: null,
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
  const threshold = nudge.relaunchThreshold(
    hookFlags.loadConfigFile(hookFlags.configPath()),
  );
  state.pendingUsage = null;
  if (ratio < threshold) return;

  const persistedLevel = nudge.readState(sessionID, process.env);
  const currentLevel = Math.max(persistedLevel, state.nudgeLevel);
  const isRestartedNudge = !state.activeNudge && persistedLevel >= 1;
  // A prepared or armed record means this session already ran the handoff steps.
  if (nudge.handoffPending({ sessionId: sessionID, env: process.env })) return;
  // A session at its hop cap cannot relaunch, so the nudge would only ask for work
  // that its own prepare has to decline.
  if (nudge.hopLimitReached(process.env)) return;
  const decision = isRestartedNudge
    ? { level: currentLevel, nudge: true }
    : nudge.nextLevel({ ratio, threshold, state: currentLevel });
  if (!decision.nudge) return;

  // Reusing the note this session already has open is the shared planner's job.
  const notePath = state.activeNudge?.notePath
    ?? nudge.plannedNotePath({ cwd: directory, sessionId: sessionID });
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
            if (
              state.latestUserMessageId !== info.id
              && info.id !== state.activeSeed?.messageID
            ) state.activeSeed = null;
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
            const notePath = nudge.notePathFromSeed(part.text);
            state.activeSeed = {
              messageID: part.messageID,
              notePath,
              text: nudge.seedText({
                notePath: notePath ?? '<handoff-path>',
                specFolder: nudge.specFolderFromSeed(part.text),
                sessionId: sessionID,
                cliPath: CLI_COMMAND,
              }),
            };
          }
          return;
        }

        if (event.type === 'session.idle') {
          const loopId = process.env.SKILLED_LOOP_ID;
          if (!loopId) return;
          const record = core.readRelaunchFile(loopId, process.env);
          if (
            record === null
            || record.sessionId !== sessionID
            || record.runtime !== 'opencode'
          ) return;
          // Pending arms here; an armed record belongs to a killer, so it
          // respawns only when no live killer owns the lock.
          if (
            record.status !== 'pending'
            && (record.status !== 'armed'
              || core.liveKillerPid(loopId, process.env) !== null)
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

        if (state.activeSeed) {
          const seed = state.activeSeed;
          const status = seedNoteStatus(seed);
          if (status === 'open') {
            if (!output.system.includes(seed.text)) output.system.push(seed.text);
          } else if (status === 'claimed') {
            const reminder = claimedReminder(seed);
            if (!output.system.includes(reminder)) output.system.push(reminder);
          } else {
            state.activeSeed = null;
          }
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
