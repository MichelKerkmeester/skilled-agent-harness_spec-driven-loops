#!/usr/bin/env node
/**
 * OpenCode Plugin: session MCP cleanup
 *
 * OpenCode has no JSON SessionEnd hook (unlike Claude's Stop and Gemini's
 * SessionEnd), so the dispose lifecycle event is its session-end equivalent.
 * On teardown this runs the runtime-agnostic session-cleanup.sh to reclaim the
 * session's MCP helper descendants — the OpenCode parity of the Claude Stop /
 * Gemini SessionEnd cleanup wiring.
 *
 * Best-effort and bounded: it never blocks or fails teardown.
 *
 * Plugin signature follows opencode's plugin API: a default-exported async
 * factory that returns lifecycle hooks.
 */

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const PLUGIN_ROOT = __dirname;
const REPO_ROOT = path.resolve(PLUGIN_ROOT, "..", "..");

export default async function sessionCleanupPlugin() {
  return {
    // The host invokes this for every lifecycle event.
    async event({ event }) {
      // Some opencode builds wrap the payload as { event }, others pass it raw.
      const input = arguments?.[0] ?? {};
      const eventType = event?.type ?? input?.event?.type;

      if (eventType === 'server.instance.disposed' || eventType === 'global.disposed') {
        try {
          spawnSync('bash', [path.join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh')], {
            cwd: REPO_ROOT,
            timeout: 8000,
          });
        } catch (_) {
          // best-effort; never block teardown
        }
      }
    },
  };
}
