// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Shared Session Relaunch Adapter
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import {
  configPath,
  isHookEnabled,
  loadConfigFile,
} from '../../shared/hook-flags.mjs';
import { appendLog, payloadEventName } from '../lib/relaunch-core.cjs';
import {
  fillRatio,
  readCodexUsage,
  resolveCodexWindow,
} from '../lib/context-usage.cjs';
import nudge from '../lib/nudge.cjs';
import withdraw from '../lib/withdraw.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

function emit(eventName, text) {
  const envelope = {
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: text,
    },
  };
  process.stdout.write(JSON.stringify(envelope), done);
}

function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

// A prompt payload carries the operator's text and nothing else a hook could tell apart: Codex
// delivers no background-task completions as prompts, and the one prompt the hand-over itself
// produces is the relaunch seed, which the caller has already answered. So any other prompt
// means the session carries on past a hand-over a Stop armed, and the killer, which signals
// after a few quiet seconds, would otherwise end that turn mid-way.
function withdrawOnOperatorPrompt(eventName, sessionId) {
  const loopId = process.env.SKILLED_LOOP_ID;
  if (eventName !== 'UserPromptSubmit' || !loopId) return false;
  try {
    const withdrawn = withdraw.withdrawHandOver({
      loopId,
      sessionId,
      reason: 'user-message',
      pending: 'none',
      env: process.env,
      onError: (stage, error) => {
        logEvent('context-nudge-error', { stage, message: error.message });
      },
    });
    if (withdrawn === null) return false;
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'withdraw', message: error.message });
    return false;
  }
  logEvent('withdrawn', { loopId, sessionId, reason: 'user-message' });
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main(expectedEvent) {
  const config = loadConfigFile(configPath());
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, config);
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || typeof payload !== 'object') return done();

  const eventName = payloadEventName(payload, { runtime: 'codex', expected: expectedEvent });
  if (eventName === null) return done();

  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  if (eventName === 'UserPromptSubmit' && nudge.isSeedPrompt(payload.prompt)) {
    const seed = nudge.seedInstructions({ prompt: payload.prompt, sessionId });
    return seed === null ? done() : emit(eventName, seed);
  }

  const withdrawn = withdrawOnOperatorPrompt(eventName, sessionId);
  // Every quiet exit below still tells the session its hand-over was withdrawn.
  const quiet = () => (withdrawn ? emit(eventName, nudge.WITHDRAWN_NOTICE) : done());

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    return quiet();
  }

  let usage;
  let windowTokens;
  try {
    usage = readCodexUsage(payload.transcript_path);
    if (usage === null) return quiet();
    windowTokens = resolveCodexWindow(usage.modelContextWindow, process.env);
    if (windowTokens === null) return quiet();
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'usage', message: error.message });
    return quiet();
  }

  const ratio = fillRatio(usage.fillTokens, windowTokens);
  const decision = nudge.nudgeDecision({
    ratio,
    threshold: nudge.relaunchThreshold(config),
    sessionId,
  });
  // The withdraw prompt answers with the notice alone; its decision only fixes the re-arm floor.
  if (!decision.nudge || withdrawn) return quiet();

  const notePath = nudge.plannedNotePath({ cwd: payload.cwd, sessionId });
  try {
    nudge.writeState(sessionId, decision.level);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message });
  }
  return emit(eventName, nudge.handoffText({
    notePath,
    sessionId,
    specFolder: nudge.specFolderInput({ payload }),
    runtime: 'codex',
    cliPath: nudge.CLI_COMMAND,
    cwd: payload.cwd || process.cwd(),
    ratio,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the shared prompt logic for one registered Codex hook event.
 *
 * @param {string} expectedEvent - The event handled by the calling entrypoint.
 */
export function runCodexAdapter(expectedEvent) {
  main(expectedEvent).catch(done);
}
