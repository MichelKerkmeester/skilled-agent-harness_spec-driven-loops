// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Ask Surface Post-Agent Part
// ───────────────────────────────────────────────────────────────────
// Vibe runs a post_agent deny as a retry user message, capped at three per
// turn, so a main turn that closes on a prose option menu can be sent back
// once. The reply is read from the session journal because the payload carries
// only the session root: at hook time the reply exists as a completion record,
// not yet as a projected assistant message. A child session, a subagent and a
// session whose catalog never offers the question tool have no operator to
// ask, so they pass.

import { isHookEnabled } from '../../shared/hook-flags.mjs';
import {
  lastAssistantText,
  loadVibeSession,
  turnId,
  turnToolCalls,
} from '../../shared/session-readers/vibe.mjs';
import core from '../lib/ask-surface-core.cjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CHILD_SESSION_ENV = 'AI_SESSION_CHILD';
const QUESTION_TOOL = 'ask_user_question';

// ───────────────────────────────────────────────────────────────────
// 2. TURN READ
// ───────────────────────────────────────────────────────────────────

function isQuestionToolName(name) {
  if (typeof name !== 'string' || !name) return false;
  return name === QUESTION_TOOL || name.endsWith(`.${QUESTION_TOOL}`);
}

// A `keep` catalog entry reuses the previous one, so only an entry that lists
// tools can answer whether this session offers the question tool. A headless
// run's catalog never names it.
function catalogNamesQuestionTool(records) {
  if (!Array.isArray(records)) return false;
  for (const record of records) {
    if (!record || record.type !== 'action_intent') continue;
    const catalog = record.payload?.request?.model_input?.tool_catalog;
    if (!catalog || !Array.isArray(catalog.tools)) continue;
    if (catalog.tools.some((tool) => isQuestionToolName(tool?.name))) return true;
  }
  return false;
}

// A dispatched child inherits the marker and a subagent carries a parent id.
// Either runs a fixed task, where a question to the operator is noise.
function isChildSession(payload, env) {
  if (String(env[CHILD_SESSION_ENV] ?? '').trim() === '1') return true;
  const parent = payload?.parent_session_id;
  return typeof parent === 'string' && parent.trim() !== '';
}

// ───────────────────────────────────────────────────────────────────
// 3. PART
// ───────────────────────────────────────────────────────────────────

/**
 * Build the ask-surface part of one post_agent payload.
 *
 * @param {Object} payload - The Vibe post_agent payload.
 * @param {Object} [dependencies] - Injectable for deterministic tests.
 * @param {Object} [dependencies.askCore] - The shared ask-surface core.
 * @param {Function} [dependencies.load] - The journal reader.
 * @param {Function} [dependencies.enabled] - The concern kill switch.
 * @param {Object} [dependencies.env] - The process environment.
 * @param {string} [dependencies.cwd] - Project root when the payload names none.
 * @param {string} [dependencies.markerDir] - Marker root for tests.
 * @returns {{decision: 'deny', reason: string}|null} The deny, or null to pass.
 */
export function buildAskSurfacePart(payload, {
  askCore = core,
  load = loadVibeSession,
  enabled = isHookEnabled,
  env = process.env,
  cwd = process.cwd(),
  markerDir = undefined,
} = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (payload.hook_event_name !== 'post_agent') return null;
  if (enabled(askCore.CONCERN) === false) return null;

  const session = load({
    transcriptPath: payload.transcript_path,
    sessionId: payload.session_id,
  });
  if (!session || session.ok !== true) return null;

  const lastMessage = lastAssistantText(session) ?? '';
  const askToolCalled = turnToolCalls(session).some((call) => isQuestionToolName(call.name));
  const surfaceAvailable = !isChildSession(payload, env) && catalogNamesQuestionTool(session.journalRecords);
  const result = askCore.evaluateTurn({ lastMessage, askToolCalled, surfaceAvailable });
  if (result.verdict !== 'fire') return null;

  // A retry keeps the turn id, so the marker holds across every retry Vibe
  // counts for one operator message.
  const turn = turnId(session);
  if (!turn) return null;

  const projectDir = typeof payload.cwd === 'string' && payload.cwd ? payload.cwd : cwd;
  const sessionId = session.source?.sessionId || payload.session_id || 'session';
  if (!askCore.markTurn(projectDir, `vibe:${sessionId}:${turn}`, markerDir)) return null;
  askCore.recordFire(projectDir, { runtime: 'vibe', mode: 'reprompt' });
  return { decision: 'deny', reason: askCore.repromptFor('vibe') };
}
