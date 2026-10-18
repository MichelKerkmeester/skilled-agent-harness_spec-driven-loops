// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Injection Screen OpenCode Plugin
// ───────────────────────────────────────────────────────────────────
// Screens the text a webfetch returned for instructions aimed at the agent.
// Like the post-edit plugin, it buffers the advisory per session and drains it
// into the next system transform, the model call that reads the fetched text,
// rather than rewriting the tool result. It never writes stdout or stderr,
// which OpenCode paints onto the TUI prompt line, and every path fails open.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { fetchedText, screenAdvisory } from '../hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs';
import {
  MAX_PENDING_ADVISORIES,
  MAX_SESSIONS,
  SCREEN_TOOL,
  sessionIdOf,
  UNKNOWN_SESSION,
} from './lib/classifier-injection-screen-core.js';
import { dualPlugin } from './lib/v2-bridge.js';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the classifier-injection-screen OpenCode plugin hooks.
 *
 * @param {{ directory?: string } | undefined} _ctx - OpenCode plugin context.
 * @param {{ screenAdvisory?: Function } | undefined} [options] - Optional screen seam.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
async function injectionScreenPlugin(_ctx, options = {}) {
  const screen = typeof options?.screenAdvisory === 'function' ? options.screenAdvisory : screenAdvisory;
  const pendingBySession = new Map();

  function remember(sessionId, advisory) {
    let pending = pendingBySession.get(sessionId);
    if (!pending) {
      if (pendingBySession.size >= MAX_SESSIONS) {
        pendingBySession.delete(pendingBySession.keys().next().value);
      }
      pending = [];
      pendingBySession.set(sessionId, pending);
    }
    if (pending.length >= MAX_PENDING_ADVISORIES) pending.shift();
    pending.push(advisory);
  }

  return {
    async 'tool.execute.after'(input, output) {
      try {
        if (!isHookEnabled('injection-screen')) return;
        if (typeof input?.tool !== 'string' || input.tool.toLowerCase() !== SCREEN_TOOL) return;
        const advisory = await screen(fetchedText(output?.output));
        if (typeof advisory !== 'string' || !advisory) return;
        remember(sessionIdOf(input), advisory);
      } catch (_) {
        // Fail open: a screen failure must never affect the fetch it observed.
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        if (!isHookEnabled('injection-screen')) return;
        if (!output || typeof output !== 'object') return;
        let sessionId = sessionIdOf(input);
        let pending = pendingBySession.get(sessionId);
        if ((!pending || pending.length === 0) && sessionId === UNKNOWN_SESSION && pendingBySession.size === 1) {
          // A sessionless transform cannot name its buffer, so it adopts the
          // only session with advisories waiting. With several waiting there
          // is no way to choose, and the advisories stay put.
          const ownerId = pendingBySession.keys().next().value;
          const candidate = pendingBySession.get(ownerId);
          if (candidate && candidate.length > 0) {
            sessionId = ownerId;
            pending = candidate;
          }
        }
        if (!pending || pending.length === 0) return;
        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(...pending);
        pendingBySession.delete(sessionId); // drain -- surface each advisory once
      } catch (_) {
        // Fail open: a transform error must never block the turn.
      }
    },
  };
}

export default dualPlugin('classifier-injection-screen', injectionScreenPlugin);
