// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-spec-gate OpenCode Plugin (adapter)                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral spec-gate   ║
// ║ core. Classify runs in experimental.chat.system.transform, whose typed   ║
// ║ input carries no prompt field -- so this adapter best-effort fetches     ║
// ║ the session's last user message via ctx.client (guarded, fail-open)      ║
// ║ when extractPrompt(input) comes up empty, then opens the session gate    ║
// ║ + injects the bounded Gate-3 question when a turn triggers file-         ║
// ║ mutation intent. Enforce runs in tool.execute.before on the mutating-    ║
// ║ tool set and denies a Write/Edit only when the session gate is open,     ║
// ║ unanswered, and the opt-in enforce env is set -- otherwise it advises    ║
// ║ via a bounded state-dir log, never stdout/stderr. event() sweeps         ║
// ║ stale per-session state on session.created and evicts it on              ║
// ║ session.deleted. All policy and persistence live in the core; this       ║
// ║ file only maps OpenCode's transport onto it.                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// The guard policy lives outside .opencode/plugins/ so this file can remain a
// thin, default-export-only OpenCode plugin while the Claude hooks consume the
// same core. Unlike the deep-loop guard's .cjs core, this core is real ESM
// (it statically imports the ESM Gate-3 classifier), so it is imported directly.
import * as guardCore from '../skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRANSPORT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function extractPrompt(input) {
  if (typeof input === 'string') return input;
  if (!input || typeof input !== 'object') return null;

  const candidates = [
    input.prompt,
    input.text,
    input.userPrompt,
    input.message,
    input.input,
    input.properties?.prompt,
    input.properties?.message,
    input.request?.prompt,
    input.request?.message,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  return null;
}

// Both classify (this function) and enforce (tool.execute.before, below)
// resolve a missing sessionID to guardCore.UNKNOWN_SESSION_ID -- the SAME
// token the core itself defaults to internally (sessionStateKey()). Two
// different fallback strings here would key the same no-session turn to two
// different state files, so once classify starts (P1 fix) enforce would
// never see what classify wrote, and vice versa.
function sessionIdFrom(input) {
  if (!input || typeof input !== 'object') return guardCore.UNKNOWN_SESSION_ID;
  const raw = input.sessionID || input.sessionId || input.session?.id || input.properties?.sessionID;
  return raw === null || raw === undefined || raw === '' ? guardCore.UNKNOWN_SESSION_ID : String(raw);
}

/**
 * Best-effort fetch of the session's last user-authored text, used ONLY when
 * extractPrompt(input) finds nothing in the chat.system.transform hook input
 * itself (that hook's typed input is `{ sessionID?, model }` -- no prompt
 * field is ever present). Mirrors mk-skill-advisor.js's own ctx.client.session
 * .messages() fallback so both plugins read the same transport the same way.
 *
 * Fully guarded: any missing client, rejected call, or unexpected response
 * shape resolves to null, never throws -- a broken/absent ctx.client must
 * only ever mean "no prompt found", i.e. the gate stays closed (allow).
 *
 * @param {{ client?: { session?: { messages?: Function } } } | undefined} ctx
 * @param {string} projectDir
 * @param {string} sessionID
 * @returns {Promise<string|null>}
 */
async function fetchLastUserPromptViaClient(ctx, projectDir, sessionID) {
  try {
    const result = await ctx?.client?.session?.messages?.({
      path: { id: sessionID },
      query: { directory: projectDir, limit: 20 },
    });
    const messages = Array.isArray(result?.data)
      ? result.data
      : (Array.isArray(result) ? result : []);

    for (const entry of [...messages].reverse()) {
      const info = entry?.info ?? entry?.message ?? entry;
      if (info?.role !== 'user') continue;

      const parts = Array.isArray(entry?.parts)
        ? entry.parts
        : (Array.isArray(info?.parts) ? info.parts : []);
      const textPart = [...parts]
        .reverse()
        .find((part) => part?.type === 'text' && typeof part.text === 'string' && part.text.trim());
      if (textPart) return textPart.text;

      const fallback = extractPrompt(info);
      if (fallback) return fallback;
    }
    return null;
  } catch (_) {
    // Fail open: a client error must resolve to "no prompt found", never throw.
    return null;
  }
}

function eventPayloadFrom(input) {
  if (input?.event && typeof input.event === 'object') return input.event;
  if (input?.payload && typeof input.payload === 'object') return input.payload;
  return input || {};
}

function eventTypeFrom(input) {
  const payload = eventPayloadFrom(input);
  return typeof payload.type === 'string' ? payload.type : null;
}

function sessionIdFromEvent(input) {
  const payload = eventPayloadFrom(input);
  const properties = payload.properties && typeof payload.properties === 'object' ? payload.properties : {};
  const info = properties.info && typeof properties.info === 'object' ? properties.info : {};
  return payload.sessionID || payload.sessionId || payload.session?.id
    || properties.sessionID || properties.sessionId || properties.session?.id
    || info.sessionID || info.sessionId || info.id || '__global__';
}

function filePathFromArgs(args) {
  if (!args || typeof args !== 'object') return null;
  const candidate = args.filePath || args.file_path || args.path;
  return typeof candidate === 'string' ? candidate : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-spec-gate OpenCode plugin hooks.
 *
 * Posture (by design, not oversight):
 * - Advisory by default: classify surfaces the question, enforce advises. Deny
 *   only fires for Write/Edit while MK_SPEC_GATE_ENFORCE=1 is set.
 * - Bash is always advise-only, matching the framework rule that only
 *   deterministic, high-confidence violations may be denied.
 * - Fails open on every error path: a bug here must never block unrelated,
 *   correctly-scoped work. Only a genuine spec-gate deny re-throws.
 * - MK_SPEC_GATE_DISABLED=1 makes the whole plugin a full no-op.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkSpecGatePlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const { stateDir } = guardCore.resolveGuardPaths(projectDir);
  const runtimeState = { lastGateSweepAtMs: 0 };

  function disabled() {
    return process.env[guardCore.DISABLED_ENV] === '1';
  }

  return {
    async event(input = {}) {
      try {
        if (disabled()) return;
        const eventType = eventTypeFrom(input);
        if (eventType === 'session.created') {
          guardCore.sweepStaleGateStates(stateDir, runtimeState);
          return;
        }
        if (eventType === 'session.deleted') {
          guardCore.evictGateState(stateDir, String(sessionIdFromEvent(input)));
        }
      } catch (_) {
        // Fail open: a sweep/evict error must never affect session lifecycle.
      }
    },

    async 'experimental.chat.system.transform'(input, output) {
      try {
        // Kill-switch checked FIRST -- before reading or mutating `output` at
        // all -- so MK_SPEC_GATE_DISABLED=1 is a genuine full no-op, not just
        // a no-question no-op that still normalizes output.system.
        if (disabled()) return;
        if (!output || typeof output !== 'object') return;
        output.system = Array.isArray(output.system) ? output.system : [];

        const sessionID = sessionIdFrom(input);
        let prompt = extractPrompt(input);
        // The real chat.system.transform input carries no prompt field at
        // all (`{ sessionID?, model }`) -- extractPrompt(input) above is
        // always null in production. Best-effort fetch the last user
        // message for this session instead; skip entirely when there is no
        // real session to query. Any failure resolves to null (see
        // fetchLastUserPromptViaClient), so the gate simply stays closed.
        if (!prompt && sessionID !== guardCore.UNKNOWN_SESSION_ID) {
          prompt = await fetchLastUserPromptViaClient(ctx, projectDir, sessionID);
        }
        if (!prompt) return;

        const result = guardCore.classifyIntent({
          prompt,
          sessionID,
          projectDir,
          env: process.env,
        });
        if (result.question) output.system.push(result.question);
      } catch (_) {
        // Fail open: a classify error must never block or corrupt the turn.
      }
    },

    async 'tool.execute.before'(input, output) {
      try {
        if (disabled()) return;
        const tool = String(input?.tool || '').toLowerCase();
        if (!guardCore.MUTATING_TOOLS.has(tool) && tool !== 'bash') return;

        const args = output && output.args;
        const result = guardCore.evaluateMutation({
          tool,
          filePath: filePathFromArgs(args),
          // Routed through the SAME sessionIdFrom() helper the classify
          // surface uses (not a raw input.sessionID read) so a missing
          // session ID resolves to the identical state key on both sides.
          sessionID: sessionIdFrom(input),
          projectDir,
          env: process.env,
        });

        if (result.decision === 'advise' && result.detail) {
          guardCore.appendWarningLog(stateDir, result.detail);
        }
        if (result.decision === 'deny') {
          throw new Error(`mk-spec-gate: ${result.detail}`);
        }
      } catch (err) {
        if (err instanceof Error && err.message.startsWith('mk-spec-gate:')) throw err;
        // Fail open on any unexpected internal error -- never block unrelated tool calls.
      }
    },
  };
}

// Test surface hangs off the default export so no stray named export is
// mistaken for a second plugin (see .opencode/plugins/README.md).
MkSpecGatePlugin.__test = {
  extractPrompt,
  sessionIdFrom,
  fetchLastUserPromptViaClient,
  eventTypeFrom,
  sessionIdFromEvent,
  filePathFromArgs,
};
