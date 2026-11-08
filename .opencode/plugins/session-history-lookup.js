// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Session History Lookup Plugin
// ───────────────────────────────────────────────────────────────────
// A compaction keeps the session id but drops the turns before it from the
// model's context, while OpenCode's database still holds them. On
// `session.compacted` this plugin saves a history locator where the lookup CLI
// reads it, then adds the shared `## History Lookup` section to the system
// text of each request while that locator is fresh, so the model can page the
// dropped turns back on demand. Every step fails open: a lookup that cannot
// be offered never blocks a turn.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { dualPlugin } from './lib/v2-bridge.js';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-lifecycle';
const RUNTIME = 'opencode';
const HISTORY_LOCATOR_VERSION = 1;
const HISTORY_LOCATOR_KIND = 'session-store';
const HISTORY_LOCATOR_SOURCE = 'post_compaction';
// The CLI refuses a locator older than this, so the offer stops with it.
const LOCATOR_TTL_MS = 30 * 60 * 1000;

const RUNTIME_DIST = '../../.skilled/skills/system-spec-kit/runtime/dist';
const READERS_INDEX = '../../.skilled/hooks/shared/session-readers/index.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 3. SUPPORT LOADING
// ─────────────────────────────────────────────────────────────────────────────

// The compiled helpers are the one digest, state writer and offer builder every
// runtime and the CLI share. A missing build disables the offer instead of
// failing the plugin load.
async function loadSupport() {
  try {
    const [digest, state, offer] = await Promise.all([
      import(`${RUNTIME_DIST}/hooks/lib/history/locator-digest.js`),
      import(`${RUNTIME_DIST}/hooks/claude/hook-state.js`),
      import(`${RUNTIME_DIST}/hooks/lib/history/lookup-offer.js`),
    ]);
    if (typeof digest.historyHandle !== 'function'
      || typeof digest.persistHistoryLocator !== 'function'
      || typeof state.updateState !== 'function'
      || typeof state.ensureStateDir !== 'function'
      || typeof offer.buildHistoryLookupSection !== 'function'
      || typeof offer.placeLookup !== 'function') {
      return null;
    }
    return { digest, state, offer };
  } catch {
    return null;
  }
}

async function historyReady() {
  try {
    const readers = await import(READERS_INDEX);
    return readers.capabilities?.[RUNTIME]?.status === 'ready';
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LOCATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mint the locator for one compacted session.
 *
 * It names the exact session id and the folder OpenCode ran in, keyed by the
 * checkout root above that folder, where the printed command runs. A folder no
 * checkout root can serve gets no locator.
 */
function mintHistoryLocator(support, sessionId, directory, mintedAt) {
  if (typeof sessionId !== 'string' || !sessionId.trim()) return null;
  if (/[/\\\0]/.test(sessionId)) return null;
  if (typeof directory !== 'string' || !directory.trim()) return null;
  const placement = support.offer.placeLookup(directory.trim());
  if (!placement) return null;
  const identity = {
    runtime: RUNTIME,
    sessionId: sessionId.trim(),
    ...placement,
    locatorKind: HISTORY_LOCATOR_KIND,
  };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: support.digest.historyHandle(identity),
    mintedAt,
    provenance: { source: HISTORY_LOCATOR_SOURCE, capturedAt: mintedAt },
  };
}

function persistLocator(support, locator) {
  return support.digest.persistHistoryLocator(locator, () => {
    support.state.ensureStateDir();
    return support.state.updateState(locator.sessionId, { historyLocator: locator });
  });
}

function isFresh(locator, nowMs) {
  const mintedAtMs = Date.parse(locator.mintedAt);
  const ageMs = nowMs - mintedAtMs;
  return Number.isFinite(mintedAtMs) && ageMs >= 0 && ageMs < LOCATOR_TTL_MS;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the OpenCode history lookup plugin hooks.
 *
 * @param {{ directory?: string } | undefined} context - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
async function sessionHistoryLookupPlugin(context) {
  const directory = typeof context?.directory === 'string' ? context.directory : process.cwd();
  const support = await loadSupport();
  // One offer per compacted session; a later compaction replaces it.
  const offers = new Map();

  function enabled() {
    try {
      return isHookEnabled(CONCERN) !== false;
    } catch {
      return true;
    }
  }

  return {
    async event(payload) {
      try {
        if (!support || !enabled()) return;
        const event = payload?.event;
        if (event?.type !== 'session.compacted') return;
        const sessionId = event.properties?.sessionID;
        const locator = mintHistoryLocator(support, sessionId, directory, new Date().toISOString());
        // An offer is printed only for a locator the CLI can find.
        if (!locator || !persistLocator(support, locator)) {
          offers.delete(sessionId);
          return;
        }
        const section = support.offer.buildHistoryLookupSection(locator, await historyReady());
        if (section) offers.set(locator.sessionId, { locator, section });
        else offers.delete(locator.sessionId);
      } catch {
        // A failed save leaves the session as it was.
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        if (!enabled() || !output || typeof output !== 'object') return;
        const sessionId = input?.sessionID;
        const offer = typeof sessionId === 'string' ? offers.get(sessionId) : undefined;
        if (!offer) return;
        if (!isFresh(offer.locator, Date.now())) {
          offers.delete(sessionId);
          return;
        }
        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(offer.section);
      } catch {
        // The offer is optional; the request goes out without it.
      }
    },
  };
}

export default dualPlugin('session-history-lookup', sessionHistoryLookupPlugin);
