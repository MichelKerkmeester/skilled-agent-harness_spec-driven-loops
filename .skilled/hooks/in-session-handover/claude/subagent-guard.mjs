// ───────────────────────────────────────────────────────────────────
// MODULE: Claude In-Session Handover Subagent Guard
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import { isEntrypoint } from '../lib/relaunch-core.cjs';
import { questionHoldReason } from '../lib/nudge.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'in-session-handover';
const LIFECYCLE_COMMAND = new RegExp(
  String.raw`in-session-handover\.cjs['"]?\s+(claim|complete|keep|prepare|cancel|consume|hand-over)\b`,
);
const DENIAL_REASON = [
  '[in-session-handover] A sub-agent shares its parent\'s session id, so this command would act',
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
// open until the operator answers, so the shared check holds the dialog while this
// session's record can still be armed.
function questionHold(payload, env) {
  if (payload === null || typeof payload !== 'object') return null;
  if (payload.tool_name !== QUESTION_TOOL) return null;
  return questionHoldReason({ sessionId: payload.session_id, runtime: 'claude', env });
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

  const reason = questionHold(payload, process.env);
  if (reason !== null) return deny(reason);

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
