// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Relaunch Subagent Guard
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import { armableRecord, isEntrypoint, readRelaunchFile } from '../lib/relaunch-core.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
const LIFECYCLE_COMMAND = new RegExp(
  String.raw`session-relaunch\.cjs['"]?\s+(claim|complete|keep|prepare|cancel|consume|hand-over)\b`,
);
const DENIAL_REASON = [
  '[session-relaunch] A sub-agent shares its parent\'s session id, so this command would act',
  'on the parent\'s handoff note. Leave the note to the parent session.',
].join(' ');
const QUESTION_TOOL = 'AskUserQuestion';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

// The envelope flushes before exit so a piped stdout cannot truncate it.
function emit(envelope) {
  process.stdout.write(JSON.stringify(envelope), done);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// A sub-agent or fork reports its parent's session id, so a lifecycle command run
// from inside one resolves the parent's hand-over and would claim, complete, keep,
// prepare, cancel, consume or hand over that note behind the parent's back. Only
// the main session's calls carry no agent id, so only those reach it.
function deniesRelaunchCommand(payload) {
  if (payload === null || typeof payload !== 'object') return false;
  if (payload.tool_name !== 'Bash') return false;

  const agentId = payload.agent_id;
  if (typeof agentId !== 'string' || agentId.trim() === '') return false;

  const command = payload.tool_input?.command;
  if (typeof command !== 'string' || command === '') return false;

  return LIFECYCLE_COMMAND.test(command);
}

// Only the Stop event arms a prepared hand-over, and a question dialog holds the turn
// open until the operator answers. A sender that asks after prepare therefore never
// reaches Stop and sits at its context limit with a record nothing will act on, so every
// record that can still be armed is held. A live killer ends the idle session itself, so
// the dialog is allowed once one owns the loop's lock.
function pendingHandOver(payload, env) {
  if (payload === null || typeof payload !== 'object') return null;
  if (payload.tool_name !== QUESTION_TOOL) return null;

  const loopId = env.SKILLED_LOOP_ID;
  if (typeof loopId !== 'string' || loopId === '') return null;

  let record;
  try {
    record = readRelaunchFile(loopId, env);
  } catch {
    return null;
  }
  const verdict = armableRecord(record, {
    loopId,
    sessionId: payload.session_id,
    runtime: 'claude',
    env,
  });
  return verdict.armable ? record : null;
}

function questionDenialReason(record) {
  return [
    '[session-relaunch] A hand-over is prepared for this session and only goes live when',
    'this turn ends. A question dialog keeps the turn open, so the hop would never run.',
    `End this turn now and put the question in the handoff note at ${record.handoff} for`,
    'the next session, or call the hand-over off first with',
    `\`node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs cancel --loop-id ${record.loopId}\`.`,
  ].join(' ');
}

function deny(reason) {
  return emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  });
}

async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, loadConfigFile(configPath()), { runtime: 'claude' });
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (deniesRelaunchCommand(payload)) return deny(DENIAL_REASON);

  const record = pendingHandOver(payload, process.env);
  if (record !== null) return deny(questionDenialReason(record));

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
