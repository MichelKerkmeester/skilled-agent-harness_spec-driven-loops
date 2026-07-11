// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-completion-sentinel OpenCode Plugin (adapter)              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral             ║
// ║          completion-evidence-sentinel core. On `session.idle`, resolves ║
// ║          the session's last assistant text via `ctx.client` (the event  ║
// ║          itself carries neither the message nor the active packet,      ║
// ║          unlike Claude's Stop hook), recovers a candidate spec folder    ║
// ║          from that text, then delegates to the shared core. All policy  ║
// ║          -- claim detection, evidence evaluation, dedup -- lives in that ║
// ║          core so the Claude Stop hook enforces the identical rule; this  ║
// ║          file only maps OpenCode's event/ctx.client shape onto it. Never ║
// ║          writes stdout/stderr (advisories go to the shared bounded log)  ║
// ║          and fails open on any resolution or internal error.            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// The sentinel core lives outside .opencode/plugins/ so this file can remain a
// thin, default-export-only OpenCode plugin while the Claude Stop hook
// consumes the identical core. A .cjs core is imported here as the ESM
// default export, exactly like mk-deep-loop-guard.js.
import sentinelCore from '../skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Bounded so a session with a long history costs one small paginated read, not
// a full-transcript fetch, to find the most recent assistant turn.
const MESSAGE_FETCH_LIMIT = 20;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- event + message resolution
// ─────────────────────────────────────────────────────────────────────────────

function sessionIdFromEvent(event) {
  const properties = event && typeof event.properties === 'object' ? event.properties : {};
  const info = properties.info && typeof properties.info === 'object' ? properties.info : {};
  return event?.sessionID || event?.sessionId
    || properties.sessionID || properties.sessionId
    || info.sessionID || info.sessionId
    || null;
}

function textFromAssistantEntry(entry) {
  const parts = Array.isArray(entry?.parts) ? entry.parts : [];
  return parts
    .filter((part) => part && part.type === 'text' && !part.ignored && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

/**
 * Resolve the most recent assistant turn's text for a session via
 * ctx.client.session.messages(). session.idle hands over neither the last
 * message nor the transcript, so this is the one non-trivial resolution step
 * the OpenCode adapter owns that the Claude adapter does not need. Best
 * effort: any missing client method, request failure, or unexpected response
 * shape resolves to null so the caller no-ops.
 *
 * @param {object|undefined} client - OpenCode ctx.client
 * @param {string} sessionID
 * @returns {Promise<string|null>}
 */
async function resolveLastAssistantText(client, sessionID) {
  if (!client || !client.session || typeof client.session.messages !== 'function') return null;
  try {
    const response = await client.session.messages({
      path: { id: sessionID },
      query: { limit: MESSAGE_FETCH_LIMIT },
    });
    const messages = response && response.data;
    if (!Array.isArray(messages)) return null;

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const entry = messages[index];
      if (!entry || !entry.info || entry.info.role !== 'assistant') continue;
      const text = textFromAssistantEntry(entry);
      if (text) return text;
    }
    return null;
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-completion-sentinel OpenCode plugin hooks.
 *
 * Hard limits (by design, not oversight):
 * - Best-effort packet resolution only: a candidate spec folder is recovered
 *   from the resolved assistant text via a shared regex, not from the richer
 *   per-session state Claude's Stop hook can read; when nothing matches, this
 *   adapter no-ops rather than guessing.
 * - Advisory-only: the core never returns a block decision, and this adapter
 *   never throws to enforce one.
 * - Fails open on any internal error (missing client method, request
 *   failure, malformed event shape) so a bug here never affects unrelated
 *   session-idle processing.
 *
 * @param {{ directory?: string, client?: object } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkCompletionSentinelPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();

  return {
    async event(input = {}) {
      try {
        if (process.env[sentinelCore.KILL_SWITCH_ENV] === '1') return;

        const event = input && typeof input.event === 'object' ? input.event : input;
        if (!event || event.type !== 'session.idle') return;

        const sessionID = sessionIdFromEvent(event);
        if (!sessionID) return;

        const claimText = await resolveLastAssistantText(ctx?.client, sessionID);
        if (!claimText || !sentinelCore.detectCompletionClaim(claimText)) return;

        const specFolder = sentinelCore.resolveSpecFolderFromText(claimText);
        if (!specFolder) return;

        const result = sentinelCore.evaluateCompletionEvidence({
          specFolder,
          claimText,
          projectDir,
          env: process.env,
        });

        if (result.decision === 'advise' && result.detail) {
          sentinelCore.appendAdvisoryLog(projectDir, result.detail);
        }
      } catch (_) {
        // Fail open: a sentinel error must never affect session-idle processing.
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TEST SURFACE
// ─────────────────────────────────────────────────────────────────────────────

// Hang test-only access off the default export so no named export is ever
// added to this file (a stray named export drops the whole plugin).
MkCompletionSentinelPlugin.__test = Object.freeze({
  core: sentinelCore,
  sessionIdFromEvent,
  resolveLastAssistantText,
});
