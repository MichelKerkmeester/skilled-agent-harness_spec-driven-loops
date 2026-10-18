// --------------------------------------------------
// MODULE: Hermes Session Context Nudge
// --------------------------------------------------

import path from 'node:path';

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import {
  fillFromHermesUsage,
  fillRatio,
} from '../lib/context-usage.cjs';
import { appendLog as appendRelaunchLog } from '../lib/relaunch-core.cjs';
import nudge from '../lib/nudge.cjs';

const CONCERN = 'session-relaunch';
const CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const DEFAULT_THRESHOLD = 0.8;
const SEED_COMMAND = '[session-relaunch] claim and continue handoff ';
const SPEC_MARKER = ' | Spec folder: ';

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

function relaunchThreshold(config) {
  const value = process.env.SESSION_RELAUNCH_THRESHOLD
    ?? config.SESSION_RELAUNCH_THRESHOLD;
  const threshold = Number(value);
  return Number.isFinite(threshold) && threshold > 0 && threshold <= 1
    ? threshold
    : DEFAULT_THRESHOLD;
}

function plannedNotePath(payload, sessionId) {
  const root = path.resolve(process.env.REPO_ROOT || payload.cwd || process.cwd());
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return path.join(
    root,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
    `${stamp}-${sessionId.slice(0, 8)}.md`,
  );
}

function notePathFromSeed(prompt) {
  if (!nudge.isSeedPrompt(prompt) || !prompt.startsWith(SEED_COMMAND)) return null;
  let notePath = prompt.slice(SEED_COMMAND.length);
  const marker = notePath.indexOf(SPEC_MARKER);
  if (marker >= 0) notePath = notePath.slice(0, marker);
  if (!notePath || notePath !== notePath.trim() || /[\r\n]/.test(notePath)) return null;
  return path.isAbsolute(notePath) ? notePath : null;
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
    const notePath = notePathFromSeed(userMessage);
    if (!notePath) return done();
    const specFolder = nudge.specFolderFromSeed(userMessage);
    return emit({
      context: nudge.seedText({
        notePath,
        specFolder: specFolder || undefined,
        sessionId,
        cliPath: CLI_COMMAND,
      }),
    });
  }

  const usage = payload.usage;
  if (!usage || typeof usage !== 'object') return done();
  const fillTokens = fillFromHermesUsage(usage);
  const { windowTokens, windowSource } = resolveHermesWindow(payload, usage);
  const ratio = fillRatio(fillTokens, windowTokens);
  const threshold = relaunchThreshold(config);
  if (ratio < threshold) return done();

  const decision = nudge.nextLevel({
    ratio,
    threshold,
    state: nudge.readState(sessionId),
  });
  if (!decision.nudge) return done();

  const cwd = payload.cwd || process.cwd();
  const notePath = plannedNotePath(payload, sessionId);
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
    specFolder: payload.spec_folder,
    runtime: 'hermes',
    cliPath: CLI_COMMAND,
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

main().catch(done);
