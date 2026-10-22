// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch OpenCode Plugin
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { dualPlugin } from './lib/v2-bridge.js';

const require = createRequire(import.meta.url);
const childProcess = require('node:child_process');
const fs = require('node:fs');
const core = require('../hooks/session-relaunch/lib/relaunch-core.cjs');
const contextUsage = require('../hooks/session-relaunch/lib/context-usage.cjs');
const nudge = require('../hooks/session-relaunch/lib/nudge.cjs');
const hookFlags = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
const MAX_SESSIONS = 1_000;
const KILLER_PATH = require.resolve('../hooks/session-relaunch/lib/killer.cjs');
// Both the nudge and the seed read a note through the core's one classification:
// a note that is missing or cannot be parsed proves nothing was written or claimed.
const NOTE_NOT_WRITTEN = new Set(['missing', 'invalid']);

// message.part.updated fires for every streamed part, so a flags read per event
// would parse the same file many times per turn. A stat is enough to notice the
// edit that changes the answer, and a missing file is a stable answer too.
// The cache rereads the file whenever mtime, ctime, size or inode changes. A
// rewrite that changes none of them within the filesystem's timestamp resolution
// is served stale until the next change.
let flagsCache = null;

function flagsConfig() {
  const configPath = hookFlags.configPath();
  let stat = null;
  try {
    stat = fs.statSync(configPath);
  } catch {}
  const mtimeMs = stat ? stat.mtimeMs : null;
  const ctimeMs = stat ? stat.ctimeMs : null;
  const size = stat ? stat.size : null;
  const ino = stat ? stat.ino : null;
  if (
    flagsCache
    && flagsCache.path === configPath
    && flagsCache.mtimeMs === mtimeMs
    && flagsCache.ctimeMs === ctimeMs
    && flagsCache.size === size
    && flagsCache.ino === ino
  ) return flagsCache.config;

  const config = hookFlags.loadConfigFile(configPath);
  flagsCache = { path: configPath, mtimeMs, ctimeMs, size, ino, config };
  return config;
}

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
  // The shared decision never queues a nudge outside the loop, so this branch is a loop
  // id that cannot name a record: a readable note is then the only proof this session
  // already wrote its handoff; a missing or broken one is not.
  if (!validLoopId(process.env.SKILLED_LOOP_ID)) {
    return NOTE_NOT_WRITTEN.has(core.noteState(activeNudge.notePath));
  }
  return !nudge.handoffPending({ sessionId: sessionID, env: process.env });
}

// A claimed note already ran the claim steps, so repeating the full seed text asks
// for work the note records as done. The completion step is the one still owed.
function claimedReminder(seed) {
  const complete = nudge.completeCommandFor(seed.notePath, nudge.CLI_COMMAND);
  return `[${CONCERN}] This session claimed handoff note ${seed.notePath}. `
    + `When the remaining work is done, run \`${complete}\` to close the note.`;
}

// The note's own frontmatter names the spec folder a claim of it should resume into.
function noteSpecFolder(notePath) {
  try {
    const folder = core.parseHandoff(fs.readFileSync(notePath, 'utf8')).frontmatter.spec_folder;
    return typeof folder === 'string' ? folder : '';
  } catch {
    return '';
  }
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

function trackChildSession(sessionStates, childSessions, sessionID) {
  if (!childSessions.has(sessionID) && childSessions.size >= MAX_SESSIONS) {
    childSessions.delete(childSessions.keys().next().value);
  }
  childSessions.add(sessionID);
  sessionStates.delete(sessionID);
}

function queueNudge(state, sessionID, fillTokens, windowTokens, directory) {
  if (state.pendingNudge) {
    state.pendingUsage = null;
    return;
  }

  const ratio = contextUsage.fillRatio(fillTokens, windowTokens);
  const threshold = nudge.relaunchThreshold(flagsConfig());
  state.pendingUsage = null;
  if (ratio < threshold) return;

  const persistedLevel = nudge.readState(sessionID, process.env);
  // A restarted plugin host has lost the nudge it held, so a spent level is shown again.
  const decision = nudge.nudgeDecision({
    ratio,
    threshold,
    sessionId: sessionID,
    env: process.env,
    level: Math.max(persistedLevel, state.nudgeLevel),
    resume: !state.activeNudge && persistedLevel >= 1,
  });
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
      specFolder: nudge.specFolderInput({ env: process.env }),
      runtime: 'opencode',
      cliPath: nudge.CLI_COMMAND,
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

function sessionRelaunchPlugin(ctx = {}) {
  const sessionStates = new Map();
  // A sub-agent runs as a child session with its own id and its own fill, so its nudge,
  // seed or idle would hand off or end the parent's runtime.
  const childSessions = new Set();

  // A runtime started from inside another loop's process inherits that loop's variables, so a
  // nested run would arm and relaunch a runtime that is not its own.
  try {
    core.dropNestedLoop(process.env, { hostPid: process.pid });
  } catch {}

  function isEnabled() {
    try {
      return hookFlags.isHookEnabled(CONCERN, process.env, flagsConfig());
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
        if (event?.type === 'session.created' || event?.type === 'session.updated') {
          const info = properties?.info;
          if (
            info
            && typeof info === 'object'
            && typeof info.parentID === 'string'
            && info.parentID
            && nudge.validSessionId(info.id)
          ) {
            trackChildSession(sessionStates, childSessions, info.id);
            return;
          }
        }

        const sessionID = properties?.sessionID;
        if (!nudge.validSessionId(sessionID) || childSessions.has(sessionID)) return;

        if (event.type === 'message.updated') {
          const info = properties.info;
          if (!info || typeof info !== 'object') return;

          if (info.role === 'user' && typeof info.id === 'string') {
            const state = stateFor(sessionStates, sessionID);
            if (
              state.latestUserMessageId !== info.id
              && state.activeSeed?.messageID !== null
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

          const seedText = nudge.seedInstructions({ prompt: part.text, sessionId: sessionID });
          if (seedText !== null) {
            state.activeSeed = {
              messageID: part.messageID,
              notePath: nudge.notePathFromSeed(part.text),
              text: seedText,
            };
          }
          return;
        }

        if (event.type === 'session.idle') {
          const loopId = process.env.SKILLED_LOOP_ID;
          if (!loopId) return;
          const record = core.readRelaunchFile(loopId, process.env);
          const verdict = core.armableRecord(record, {
            loopId,
            sessionId: sessionID,
            runtime: 'opencode',
            env: process.env,
          });
          if (!verdict.armable) return;

          const directory = typeof ctx.directory === 'string'
            ? ctx.directory
            : process.cwd();
          const armed = core.arm({ loopId, cwd: directory, env: process.env });
          if (armed?.status !== 'armed') return;
          spawnKiller(loopId);
          return;
        }

        if (event.type === 'session.compacted') {
          // A compacted session keeps its id but loses the detail its open note holds, and the
          // freed context makes the spent nudge level stale; the nudge the plugin still holds
          // goes with it, since its text quotes the fill the compaction freed. A note a prepared
          // hop already owns is left for that hop to claim.
          try {
            nudge.writeState(sessionID, 0, process.env);
          } catch {}
          const state = sessionStates.get(sessionID);
          if (state) {
            state.nudgeLevel = 0;
            state.activeNudge = null;
            state.pendingNudge = null;
            state.pendingUsage = null;
          }
          if (nudge.handoffPending({ sessionId: sessionID, env: process.env })) return;

          const notePath = nudge.openNotePathFor({
            repoRoot: nudge.resolveRepoRoot(),
            sessionId: sessionID,
          });
          if (notePath === null) return;

          logEvent('compact-pointer', { sessionId: sessionID, note: notePath });
          stateFor(sessionStates, sessionID).activeSeed = {
            messageID: null,
            notePath,
            text: nudge.seedText({
              notePath,
              specFolder: noteSpecFolder(notePath),
              sessionId: sessionID,
              cliPath: nudge.CLI_COMMAND,
              afterCompaction: true,
            }),
          };
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
        if (!sessionID || childSessions.has(sessionID)) return;
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

        // A turn rebuilds the system prompt for every model request, and an auxiliary
        // request may consume the first one, so the claim instructions stay in place
        // until the note leaves the open state; a note not yet readable keeps them too.
        if (state.activeSeed) {
          const seed = state.activeSeed;
          const status = core.noteState(seed.notePath);
          if (status === 'open' || NOTE_NOT_WRITTEN.has(status)) {
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

export default dualPlugin('session-relaunch', sessionRelaunchPlugin);
