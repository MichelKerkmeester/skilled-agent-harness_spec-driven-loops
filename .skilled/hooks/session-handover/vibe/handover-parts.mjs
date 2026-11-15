// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Handover Parts
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  configPath,
  isHookEnabled,
  loadConfigFile,
} from '../../shared/hook-flags.mjs';
import {
  fillRatio,
  readVibeUsage,
  resolveVibeWindow,
} from '../lib/context-usage.cjs';
import {
  appendLog,
  arm,
  armableRecord,
  findLoopChildPid,
  readRelaunchFile,
} from '../lib/relaunch-core.cjs';
import nudge from '../lib/nudge.cjs';
import withdraw from '../lib/withdraw.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-handover';
const CONTEXT_EVENTS = new Set(['pre_agent', 'post_tool']);
const TURN_END_EVENT = 'post_agent';
// The journal keeps a lock and temp files beside the numbered segments, and a lock is touched
// constantly, so only a numbered segment can be the transcript the killer follows.
const JOURNAL_SEGMENT_NAME = /^\d+\.jsonl$/;
const KILLER_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'killer.cjs',
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function logEvent(event, fields, env) {
  try {
    appendLog(event, fields, env);
  } catch {}
}

function hookConfig() {
  try {
    return loadConfigFile(configPath());
  } catch {
    return {};
  }
}

function handoverEnabled(env, config) {
  try {
    return isHookEnabled(CONCERN, env, config, { runtime: 'vibe' });
  } catch {
    return false;
  }
}

function isPayloadObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isSubagent(payload) {
  const parent = payload?.parent_session_id;
  return parent !== undefined && parent !== null && String(parent).trim() !== '';
}

function isContextEvent(eventName) {
  return CONTEXT_EVENTS.has(eventName);
}

// A prompt payload carries the operator's text and nothing else a hook could tell apart: the
// one prompt the hand-over itself produces is the relaunch seed, which the caller has already
// answered. Any other prompt means the session carries on past a hand-over the turn end armed,
// and the killer, which signals after a few quiet seconds, would otherwise end that turn
// mid-way.
function withdrawOnOperatorPrompt(sessionId, env) {
  const loopId = env.SKILLED_LOOP_ID;
  if (!loopId) return false;
  let withdrawn;
  try {
    withdrawn = withdraw.withdrawHandOver({
      loopId,
      sessionId,
      reason: 'user-message',
      pending: 'none',
      env,
      onError: (stage, error) => {
        logEvent('context-nudge-error', { stage, message: error.message }, env);
      },
    });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'withdraw', message: error.message }, env);
    return false;
  }
  if (withdrawn === null) return false;
  logEvent('withdrawn', { loopId, sessionId, reason: 'user-message' }, env);
  return true;
}

function newestJournalFile(sessionRoot) {
  const directory = path.join(sessionRoot, 'journal');
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }

  let newest = null;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!JOURNAL_SEGMENT_NAME.test(entry.name)) continue;
    const filePath = path.join(directory, entry.name);
    let stats;
    try {
      stats = fs.statSync(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (!stats.isFile()) continue;
    if (
      newest === null
      || stats.mtimeMs > newest.mtimeMs
      || (stats.mtimeMs === newest.mtimeMs && entry.name > newest.name)
    ) {
      newest = { filePath, name: entry.name, mtimeMs: stats.mtimeMs };
    }
  }
  return newest?.filePath ?? null;
}

async function spawnKiller(loopId, targetPid, transcriptPath, env, spawnProcess) {
  try {
    const child = spawnProcess(
      process.execPath,
      [KILLER_PATH, '--loop-id', loopId, '--target-pid', targetPid, '--transcript', transcriptPath],
      { detached: true, stdio: 'ignore', env },
    );
    if (typeof child?.once !== 'function') {
      child.unref();
      return;
    }
    const started = await new Promise((resolve) => {
      child.once('error', (error) => {
        logEvent('stop-arm-error', { stage: 'spawn', loopId, message: error.message }, env);
        resolve(false);
      });
      child.once('spawn', () => resolve(true));
    });
    if (started) child.unref();
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'spawn', loopId, message: error.message }, env);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the turn-start context a Vibe session receives at a prompt or after a tool call.
 *
 * @param {Object} payload - The parsed Vibe pre_agent or post_tool payload.
 * @param {Object} [dependencies] - Seams for tests.
 * @param {NodeJS.ProcessEnv} [dependencies.env=process.env] - Runtime environment.
 * @returns {Promise<string>} The context text, or an empty string.
 */
async function buildHandoverContextPart(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  if (!isPayloadObject(payload)) return '';
  const eventName = payload.hook_event_name;
  if (!isContextEvent(eventName)) return '';

  const config = hookConfig();
  if (!handoverEnabled(env, config)) return '';

  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return '';
  if (isSubagent(payload)) return '';

  if (eventName === 'pre_agent' && nudge.isSeedPrompt(payload.prompt)) {
    try {
      const seed = nudge.seedInstructions({ prompt: payload.prompt, sessionId });
      return typeof seed === 'string' ? seed : '';
    } catch (error) {
      logEvent('context-nudge-error', { stage: 'seed', message: error.message }, env);
      return '';
    }
  }

  // Only a turn the operator typed withdraws an armed hand-over; a turn start
  // that carries no prompt is not the operator taking the session back.
  const operatorTyped = typeof payload.prompt === 'string' && payload.prompt.trim() !== '';
  const withdrawn = eventName === 'pre_agent' && operatorTyped
    && withdrawOnOperatorPrompt(sessionId, env);
  // Every quiet exit below still tells the session its hand-over was withdrawn.
  const quiet = () => (withdrawn ? nudge.WITHDRAWN_NOTICE : '');

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) return quiet();

  let usage;
  let windowTokens;
  try {
    usage = readVibeUsage(payload.transcript_path);
    if (usage === null) return quiet();
    windowTokens = resolveVibeWindow(usage.compactionThreshold, env);
    if (windowTokens === null) return quiet();
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'usage', message: error.message }, env);
    return quiet();
  }

  const ratio = fillRatio(usage.fillTokens, windowTokens);
  let decision;
  try {
    decision = nudge.nudgeDecision({
      ratio,
      threshold: nudge.relaunchThreshold(config, env),
      sessionId,
      env,
    });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'decision', message: error.message }, env);
    return quiet();
  }
  // The withdraw prompt answers with the notice alone; its decision only fixes the re-arm floor.
  if (!decision.nudge || withdrawn) return quiet();

  let notePath;
  try {
    notePath = nudge.plannedNotePath({ cwd: payload.cwd, sessionId, env });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'note', message: error.message }, env);
    return '';
  }

  try {
    nudge.writeState(sessionId, decision.level, env);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message }, env);
  }

  try {
    return nudge.handoffText({
      notePath,
      sessionId,
      specFolder: nudge.specFolderInput({ payload, env }),
      runtime: 'vibe',
      cliPath: nudge.CLI_COMMAND,
      cwd: payload.cwd || process.cwd(),
      ratio,
      loopId: env.SKILLED_LOOP_ID || '',
    });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'text', message: error.message }, env);
    return '';
  }
}

/**
 * Arm this session's relaunch record at turn end and start the killer that ends the session.
 * The function never denies a turn and always returns null.
 *
 * @param {Object} payload - The parsed Vibe post_agent payload.
 * @param {Object} [dependencies] - Seams for tests.
 * @param {NodeJS.ProcessEnv} [dependencies.env=process.env] - Runtime environment.
 * @param {number} [dependencies.pid=process.pid] - Pid the loop-child walk climbs from.
 * @param {string} [dependencies.processTable] - `pid ppid` pairs; the live table when omitted.
 * @param {Function} [dependencies.spawn] - Spawns the killer; child_process.spawn when omitted.
 * @returns {Promise<null>} Always null.
 */
async function armHandoverTurnEnd(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  let loopId;
  try {
    if (!isPayloadObject(payload)) return null;
    if (payload.hook_event_name !== TURN_END_EVENT) return null;

    const config = hookConfig();
    if (!handoverEnabled(env, config)) return null;

    const sessionId = payload.session_id;
    if (!nudge.validSessionId(sessionId)) return null;
    if (isSubagent(payload)) return null;

    loopId = env.SKILLED_LOOP_ID;
    if (!loopId) return null;

    let record;
    try {
      record = readRelaunchFile(loopId, env);
    } catch (error) {
      logEvent('stop-arm-error', { stage: 'read', loopId, message: error.message }, env);
      return null;
    }
    if (!armableRecord(record, { loopId, sessionId, runtime: 'vibe', env }).armable) {
      return null;
    }

    if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
      logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId }, env);
      return null;
    }

    let transcriptPath;
    try {
      transcriptPath = newestJournalFile(payload.transcript_path);
    } catch (error) {
      logEvent('stop-arm-error', { stage: 'journal', loopId, message: error.message }, env);
      return null;
    }
    if (transcriptPath === null) {
      logEvent('missing-transcript-path', {
        loopId,
        sessionId: record.sessionId,
        journal: path.join(payload.transcript_path, 'journal'),
      }, env);
      return null;
    }

    // Resolve before arming so a missing ancestor leaves the record pending.
    const targetPid = findLoopChildPid(loopId, {
      pid: dependencies.pid ?? process.pid,
      processTable: dependencies.processTable,
    });
    if (targetPid === null) {
      logEvent('stop-arm-error', { stage: 'target-pid', loopId }, env);
      return null;
    }

    let armed;
    try {
      armed = arm({ loopId, cwd: payload.cwd || process.cwd(), env });
    } catch (error) {
      logEvent('stop-arm-error', { stage: 'arm', loopId, message: error.message }, env);
      return null;
    }
    if (armed === null || armed.status !== 'armed') return null;

    await spawnKiller(
      loopId,
      String(targetPid),
      transcriptPath,
      env,
      dependencies.spawn || spawn,
    );
  } catch (error) {
    logEvent('stop-arm-error', {
      stage: 'unexpected',
      loopId: loopId ?? '',
      message: error.message,
    }, env);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { buildHandoverContextPart, armHandoverTurnEnd };
