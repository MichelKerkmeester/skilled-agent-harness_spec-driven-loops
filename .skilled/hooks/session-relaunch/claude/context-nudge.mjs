// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Context Nudge
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import { appendLog, isEntrypoint, payloadEventName } from '../lib/relaunch-core.cjs';
import { readClaudeFill, resolveWindow, fillRatio } from '../lib/context-usage.cjs';
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

// The envelope flushes before exit so a piped stdout cannot truncate it.
function emit(eventName, text) {
  const envelope = { hookSpecificOutput: { hookEventName: eventName, additionalContext: text } };
  process.stdout.write(JSON.stringify(envelope), done);
}

// Logging is best-effort: a state-dir failure must never break the hook.
function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  // The flags file is read once per run and shared by the enable check and the
  // threshold, so a hook that fires on every tool call does not re-read it.
  const config = loadConfigFile(configPath());
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, config);
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || typeof payload !== 'object') return done();

  // One registration serves both events, so any named event is answered under its own name.
  const eventName = payloadEventName(payload, { runtime: 'claude' });
  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  if (nudge.isSeedPrompt(payload.prompt)) {
    const seed = nudge.seedInstructions({ prompt: payload.prompt, sessionId });
    return seed === null ? done() : emit(eventName, seed);
  }

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) return done();

  let ratio;
  try {
    const fill = readClaudeFill(payload.transcript_path);
    if (fill === null) return done();
    const windowTokens = resolveWindow({
      env: process.env,
      cwd: payload.cwd || process.cwd(),
      model: fill.model ?? '',
    });
    ratio = fillRatio(fill.fillTokens, windowTokens);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'usage', message: error.message });
    return done();
  }

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
    runtime: 'claude',
    cliPath: nudge.CLI_COMMAND,
    cwd: payload.cwd || process.cwd(),
    ratio,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
