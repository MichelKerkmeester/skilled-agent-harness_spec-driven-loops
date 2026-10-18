// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Shared Session Relaunch Adapter
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import {
  configPath,
  isHookEnabled,
  loadConfigFile,
} from '../../shared/hook-flags.mjs';
import { appendLog } from '../lib/relaunch-core.cjs';
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
const CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const DEFAULT_THRESHOLD = 0.8;

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

function relaunchThreshold(config) {
  const switches = { ...config, ...process.env };
  const parsed = Number(switches.SESSION_RELAUNCH_THRESHOLD);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 1
    ? parsed
    : DEFAULT_THRESHOLD;
}

function plannedNotePath(payload, sessionId) {
  const repoRoot = process.env.REPO_ROOT || payload?.cwd || process.cwd();
  const stamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, 'Z');
  return path.join(
    repoRoot,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
    `${stamp}-${sessionId.slice(0, 8)}.md`,
  );
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

  const eventName = payload.hook_event_name;
  if (eventName !== expectedEvent) return done();

  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  if (eventName === 'UserPromptSubmit' && nudge.isSeedPrompt(payload.prompt)) {
    return emit(eventName, nudge.seedText({
      notePath: '<handoff-path>',
      specFolder: nudge.specFolderFromSeed(payload.prompt),
      sessionId,
      cliPath: CLI_COMMAND,
    }));
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
  const threshold = relaunchThreshold(config);
  if (ratio < threshold) return done();

  const decision = nudge.nextLevel({
    ratio,
    threshold,
    state: nudge.readState(sessionId),
  });
  if (!decision.nudge) return done();

  const notePath = plannedNotePath(payload, sessionId);
  try {
    nudge.writeState(sessionId, decision.level);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'state', message: error.message });
  }
  return emit(eventName, nudge.handoffText({
    notePath,
    sessionId,
    specFolder: payload.spec_folder,
    runtime: 'codex',
    cliPath: CLI_COMMAND,
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
