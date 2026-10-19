// ───────────────────────────────────────────────────────────────────
// MODULE: Hermes Session Context Nudge
// ───────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import {
  fillFromHermesUsage,
  fillRatio,
} from '../lib/context-usage.cjs';
import { appendLog as appendRelaunchLog, isEntrypoint } from '../lib/relaunch-core.cjs';
import nudge from '../lib/nudge.cjs';

const CONCERN = 'session-relaunch';

function finish() {
  process.exit(0);
}

function done() {
  process.stdout.write('{"context":""}\n', finish);
}

function emit(output) {
  process.stdout.write(`${JSON.stringify(output)}\n`, finish);
}

function logEvent(event, fields) {
  try {
    appendRelaunchLog(event, fields, process.env);
  } catch {}
}

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function resolveHermesWindow(payload, usage) {
  const configured = positiveNumber(process.env.SESSION_RELAUNCH_WINDOW_TOKENS);
  if (configured !== null) {
    return { windowTokens: configured, windowSource: 'environment' };
  }
  const reported = positiveNumber(
    payload.model_context_window ?? usage?.model_context_window,
  );
  if (reported !== null) return { windowTokens: reported, windowSource: 'hermes' };
  return { windowTokens: 200000, windowSource: 'default' };
}

async function main() {
  const config = loadConfigFile(configPath());
  if (!isHookEnabled(CONCERN, process.env, config)) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (!payload || typeof payload !== 'object') return done();
  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  const userMessage = typeof payload.user_message === 'string'
    ? payload.user_message
    : typeof payload.prompt === 'string' ? payload.prompt : '';
  if (payload.is_first_turn === true && nudge.isSeedPrompt(userMessage)) {
    const seed = nudge.seedInstructions({ prompt: userMessage, sessionId });
    return seed === null ? done() : emit({ context: seed });
  }

  const usage = payload.usage;
  if (!usage || typeof usage !== 'object') return done();
  const fillTokens = fillFromHermesUsage(usage);
  const { windowTokens, windowSource } = resolveHermesWindow(payload, usage);
  const ratio = fillRatio(fillTokens, windowTokens);
  const decision = nudge.nudgeDecision({
    ratio,
    threshold: nudge.relaunchThreshold(config),
    sessionId,
  });
  if (!decision.nudge) return done();

  const cwd = payload.cwd || process.cwd();
  const notePath = nudge.plannedNotePath({ cwd: payload.cwd, sessionId });
  try {
    nudge.writeState(sessionId, decision.level);
  } catch (error) {
    logEvent('context-nudge-error', {
      stage: 'state',
      message: error.message,
    });
  }

  const context = nudge.handoffText({
    notePath,
    sessionId,
    specFolder: nudge.specFolderInput({ payload }),
    runtime: 'hermes',
    cliPath: nudge.CLI_COMMAND,
    cwd,
    ratio,
  });
  logEvent('context-nudge', {
    sessionId,
    level: decision.level,
    windowSource,
    windowTokens,
  });
  return emit({ context, windowTokens, windowSource });
}

if (isEntrypoint(import.meta.url)) main().catch(done);
