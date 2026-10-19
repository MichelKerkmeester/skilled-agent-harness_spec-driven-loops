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

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    return done();
  }

  let usage;
  let windowTokens;
  try {
    usage = readCodexUsage(payload.transcript_path);
    if (usage === null) return done();
    windowTokens = resolveCodexWindow(usage.modelContextWindow, process.env);
    if (windowTokens === null) return done();
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'usage', message: error.message });
    return done();
  }

  const ratio = fillRatio(usage.fillTokens, windowTokens);
  const decision = nudge.nudgeDecision({
    ratio,
    threshold: nudge.relaunchThreshold(config),
    sessionId,
  });
  if (!decision.nudge) return done();

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
