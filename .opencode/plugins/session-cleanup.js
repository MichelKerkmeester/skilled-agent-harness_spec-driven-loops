// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Session Cleanup OpenCode Plugin                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Run bounded MCP helper cleanup when the OpenCode plugin         ║
// ║          lifecycle reports session or server teardown.                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(PLUGIN_ROOT, '..', '..');

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * OpenCode Plugin: session MCP cleanup
 *
 * OpenCode has no JSON SessionEnd hook (unlike Claude's Stop hook), so the
 * dispose lifecycle event is its session-end equivalent.
 * On teardown this runs the runtime-agnostic session-cleanup.sh to reclaim the
 * session's MCP helper descendants — the OpenCode parity of the Claude Stop
 * cleanup wiring.
 *
 * Best-effort and bounded: it never blocks or fails teardown.
 *
 * Plugin signature follows opencode's plugin API: a default-exported async
 * factory that returns lifecycle hooks.
 *
 * @returns {Promise<Object>} Hooks object for the OpenCode plugin loader
 */
export default async function sessionCleanupPlugin() {
  return {
    // The host invokes this for every lifecycle event.
    async event({ event }) {
      // Some opencode builds wrap the payload as { event }, others pass it raw.
      const input = arguments?.[0] ?? {};
      const eventType = event?.type ?? input?.event?.type;

      if (eventType === 'server.instance.disposed' || eventType === 'global.disposed') {
        try {
          spawnSync('bash', [join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh')], {
            cwd: REPO_ROOT,
            timeout: 8000,
          });
        } catch (_) {
          // Best-effort; never block teardown.
        }
      }
    },
  };
}
