// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Context Nudge
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import {
  appendLog,
  dropNestedLoop,
  isEntrypoint,
  payloadEventName,
  withdrawDeferred,
} from '../lib/relaunch-core.cjs';
import { readClaudeFill, resolveWindow, fillRatio } from '../lib/context-usage.cjs';
import nudge from '../lib/nudge.cjs';
import hopHistory from '../lib/hop-history.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
// Claude delivers a background task's completion as a prompt, and that completion is what a
// deferred hand-over waits for, so it must never count as the operator carrying on.
const TASK_NOTIFICATION_PATTERN = /^\s*<task-notification>/;
const WITHDRAWN_NOTICE = '[session-relaunch] The prepared hand-over was withdrawn because'
  + ' a new prompt arrived while it waited for background tasks. Keep working here. The open'
  + ' note no longer matches the work, and one more context nudge will come once the context'
  + ' fills further. That nudge is when to update the note and hand over again. Do not run'
  + ' consume or claim by hand.';

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

// Only a prompt the operator typed means the session carries on past its deferred hand-over.
function withdrawOnOperatorPrompt(eventName, prompt, sessionId) {
  const loopId = process.env.SKILLED_LOOP_ID;
  if (eventName !== 'UserPromptSubmit' || !loopId) return false;
  if (typeof prompt !== 'string' || TASK_NOTIFICATION_PATTERN.test(prompt)) return false;
  let withdrawnRecord;
  try {
    withdrawnRecord = withdrawDeferred({ loopId, sessionId, env: process.env });
    if (withdrawnRecord === null) return false;
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'withdraw', message: error.message });
    return false;
  }
  // The withdrawn session may already have spent its last nudge, so it is granted one more.
  // The grant is fixed to a fill ratio by the nudge decision that follows on this prompt.
  try {
    nudge.rearmAfterWithdraw({ sessionId, env: process.env });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'rearm', message: error.message });
  }
  // The history marks the note as still with its session, so it is not reported as unclaimed.
  try {
    hopHistory.recordHop('withdrawn', withdrawnRecord.handoff, { session: sessionId });
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'history', message: error.message });
  }
  logEvent('withdrawn', { loopId, sessionId, reason: 'user-message' });
  return true;
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

  // A sub-agent reports its parent's session and transcript, so its fill and note are the parent's.
  if (typeof payload.agent_id === 'string' && payload.agent_id.trim() !== '') return done();

  // A runtime started from this loop session's shell inherits the loop variables, so it
  // must act as a session outside the loop.
  dropNestedLoop(process.env);

  // One registration serves both events, so any named event is answered under its own name.
  const eventName = payloadEventName(payload, { runtime: 'claude' });
  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  if (nudge.isSeedPrompt(payload.prompt)) {
    const seed = nudge.seedInstructions({ prompt: payload.prompt, sessionId });
    return seed === null ? done() : emit(eventName, seed);
  }

  const withdrawn = withdrawOnOperatorPrompt(eventName, payload.prompt, sessionId);
  // Every quiet exit below still tells the session its hand-over was withdrawn.
  const quiet = () => (withdrawn ? emit(eventName, WITHDRAWN_NOTICE) : done());

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) return quiet();

  let ratio;
  try {
    const fill = readClaudeFill(payload.transcript_path);
    if (fill === null) return quiet();
    const windowTokens = resolveWindow({
      env: process.env,
      cwd: payload.cwd || process.cwd(),
      model: fill.model ?? '',
    });
    ratio = fillRatio(fill.fillTokens, windowTokens);
  } catch (error) {
    logEvent('context-nudge-error', { stage: 'usage', message: error.message });
    return quiet();
  }

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
