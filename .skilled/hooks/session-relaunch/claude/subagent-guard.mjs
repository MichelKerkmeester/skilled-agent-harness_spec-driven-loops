// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Relaunch Subagent Guard
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import { isEntrypoint } from '../lib/relaunch-core.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
const LIFECYCLE_COMMAND = /session-relaunch\.cjs['"]?\s+(claim|complete|keep|prepare)\b/;
const DENIAL_REASON = [
  '[session-relaunch] A sub-agent shares its parent\'s session id, so this command would act',
  'on the parent\'s handoff note. Leave the note to the parent session.',
].join(' ');

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
// from inside one resolves the parent's handoff note and would claim, complete,
// keep or prepare it behind the parent's back. Only the main session's calls carry
// no agent id, so only those reach the note.
function deniesRelaunchCommand(payload) {
  if (payload === null || typeof payload !== 'object') return false;
  if (payload.tool_name !== 'Bash') return false;

  const agentId = payload.agent_id;
  if (typeof agentId !== 'string' || agentId.trim() === '') return false;

  const command = payload.tool_input?.command;
  if (typeof command !== 'string' || command === '') return false;

  return LIFECYCLE_COMMAND.test(command);
}

async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, loadConfigFile(configPath()));
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (!deniesRelaunchCommand(payload)) return done();

  return emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: DENIAL_REASON,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
