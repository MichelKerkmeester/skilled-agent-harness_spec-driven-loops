// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: classifier-injection-screen OpenCode Plugin                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Screens text a webfetch returned for instructions aimed at      ║
// ║          the agent. Like the post-edit plugin, it buffers the advisory   ║
// ║          per session and drains it into the next system transform, the   ║
// ║          model call that reads the fetched text, rather than rewriting   ║
// ║          the tool result. Never writes stdout/stderr (OpenCode paints    ║
// ║          those onto the TUI prompt line); every path fails open and      ║
// ║          silent.                                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { fetchedText, screenAdvisory } from '../hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCREEN_TOOL = 'webfetch';
const MAX_PENDING_ADVISORIES = 20;
const MAX_SESSIONS = 1_000;
// tool.execute.after always carries a sessionID; the transform's is optional, so a
// missing id lands in one shared bucket instead of dropping the buffered advisory.
const UNKNOWN_SESSION = '__unknown-session__';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sessionIdOf(input) {
  const value = input?.sessionID;
  return typeof value === 'string' && value ? value : UNKNOWN_SESSION;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the classifier-injection-screen OpenCode plugin hooks.
 *
 * @param {{ directory?: string } | undefined} _ctx - OpenCode plugin context.
 * @param {{ screenAdvisory?: Function } | undefined} [options] - Optional screen seam.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkInjectionScreenPlugin(_ctx, options = {}) {
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
        const sessionId = sessionIdOf(input);
        const pending = pendingBySession.get(sessionId);
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

// Test surface hung off the default export (never a separate named export --
// OpenCode loads every export as its own plugin and a stray one silently
// drops this entire file).
MkInjectionScreenPlugin.__test = {
  SCREEN_TOOL,
  MAX_PENDING_ADVISORIES,
  MAX_SESSIONS,
  UNKNOWN_SESSION,
  sessionIdOf,
};
