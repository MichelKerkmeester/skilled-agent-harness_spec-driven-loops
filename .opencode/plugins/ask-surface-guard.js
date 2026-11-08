// ───────────────────────────────────────────────────────────────────
// MODULE: Ask Surface Guard Plugin
// ───────────────────────────────────────────────────────────────────
// session.idle cannot block a finished turn, but promptAsync starts a new
// one, which is how this plugin sends a prose option menu back to be asked
// through the `question` tool. It writes nothing to stdout or stderr,
// because either would overlay the TUI.

import { createRequire } from 'node:module';

import { dualPlugin } from './lib/v2-bridge.js';

const require = createRequire(import.meta.url);
const core = require('../hooks/ask-surface-guard/lib/ask-surface-core.cjs');
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// One bounded read covers the current turn without fetching the whole session.
const MESSAGE_FETCH_LIMIT = 20;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function sessionIdFromEvent(event) {
  const properties = event && typeof event.properties === 'object' ? event.properties : {};
  return event?.sessionID || event?.sessionId || properties.sessionID || properties.sessionId || null;
}

/**
 * Read the current turn: everything after the last user message.
 *
 * @param {Array<object>} entries - Session messages, oldest first, each `{info, parts}`.
 * @returns {{lastMessage: string, askToolCalled: boolean, messageId: string|null}} What the turn held.
 */
export function readTurn(entries) {
  const list = Array.isArray(entries) ? entries : [];
  let start = 0;
  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (list[index]?.info?.role === 'user') { start = index + 1; break; }
  }
  const result = { lastMessage: '', askToolCalled: false, messageId: null };
  for (const entry of list.slice(start)) {
    if (entry?.info?.role !== 'assistant') continue;
    const parts = Array.isArray(entry.parts) ? entry.parts : [];
    if (parts.some((part) => part?.type === 'tool' && core.QUESTION_TOOLS.opencode.includes(part.tool))) {
      result.askToolCalled = true;
    }
    const text = parts
      .filter((part) => part?.type === 'text' && !part.ignored && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim();
    if (text) {
      result.lastMessage = text;
      result.messageId = entry.info.id || null;
    }
  }
  return result;
}

async function fetchMessages(client, sessionID) {
  if (typeof client?.session?.messages !== 'function') return [];
  const response = await client.session.messages({ path: { id: sessionID }, query: { limit: MESSAGE_FETCH_LIMIT } });
  return Array.isArray(response?.data) ? response.data : [];
}

// ───────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ───────────────────────────────────────────────────────────────────

/**
 * Create the ask-surface guard hooks.
 *
 * @param {{directory?: string, client?: object}|undefined} ctx - OpenCode plugin context.
 * @param {{markerDir?: string}} [options] - Marker root for tests.
 * @returns {Promise<object>} Hooks for the OpenCode plugin loader.
 */
export async function AskSurfaceGuardPlugin(ctx, options = {}) {
  const projectDir = ctx?.directory || process.cwd();
  const inFlight = new Set();

  return {
    async event(input = {}) {
      const event = input && typeof input.event === 'object' ? input.event : input;
      if (event?.type !== 'session.idle') return;
      const sessionID = sessionIdFromEvent(event);
      if (!sessionID || inFlight.has(sessionID)) return;
      inFlight.add(sessionID);
      try {
        if (!isHookEnabled(core.CONCERN)) return;
        const client = ctx?.client;
        if (typeof client?.session?.promptAsync !== 'function') return;

        const turn = readTurn(await fetchMessages(client, sessionID));
        if (core.evaluateTurn(turn).verdict !== 'fire') return;
        // Keyed on the message, so the turn this plugin starts is judged on
        // its own reply and the same reply is never sent back twice.
        if (!core.markTurn(projectDir, `opencode:${sessionID}:${turn.messageId || turn.lastMessage}`, options.markerDir)) return;

        core.recordFire(projectDir, { runtime: 'opencode', mode: 'reprompt' });
        await client.session.promptAsync({
          path: { id: sessionID },
          body: { parts: [{ type: 'text', text: core.repromptFor('opencode') }] },
        });
      } catch (_) {
        // Fail open: a guard error leaves the session idle as it was.
      } finally {
        inFlight.delete(sessionID);
      }
    },
  };
}

export default dualPlugin('ask-surface-guard', AskSurfaceGuardPlugin);
