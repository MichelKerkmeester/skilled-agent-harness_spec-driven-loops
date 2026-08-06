// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Prompt Advisor
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const RAW_INPUT_STORE_KEY = Symbol.for("mk.pi.dispatch.raw-input");
const MAX_CAPTURED_USER_TEXT = 32_768;
const MAX_CAPTURED_SESSIONS = 64;

interface RawInputStore {
  readonly bySession: Map<string, string>;
}

function captureRawPiUserInput(text: unknown, sessionId: unknown): void {
  if (typeof text !== "string" || typeof sessionId !== "string" || sessionId.length === 0) return;
  const bounded = text.length > MAX_CAPTURED_USER_TEXT ? text.slice(0, MAX_CAPTURED_USER_TEXT) : text;
  const globalState = globalThis as typeof globalThis & { [key: symbol]: RawInputStore | undefined };
  const store = globalState[RAW_INPUT_STORE_KEY] ?? { bySession: new Map<string, string>() };
  globalState[RAW_INPUT_STORE_KEY] = store;
  if (!store.bySession.has(sessionId)) {
    while (store.bySession.size >= MAX_CAPTURED_SESSIONS) {
      const oldest = store.bySession.keys().next().value;
      if (typeof oldest !== "string") break;
      store.bySession.delete(oldest);
    }
  }
  store.bySession.set(sessionId, bounded);
}

function sessionIdFromContext(ctx: { sessionManager?: { getSessionId?: () => unknown } }): string | undefined {
  try {
    const sessionId = ctx.sessionManager?.getSessionId?.();
    return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : undefined;
  } catch {
    return undefined;
  }
}

// The shared advisor lifecycle module the claude/codex/cursor runtimes execute
// as a subprocess. Its CLI entrypoint is guarded, so importing it in-process is
// safe. Pi awaits input handlers before agent processing begins, so the old
// two-process blocking-spawn bridge stalled every send; calling the same
// lifecycle code directly removes that stall and lets its module-level prompt
// cache work.
const ADVISOR_HOOK_MODULE =
  "../../.opencode/skills/system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js";

// Keep this policy in the ordered Pi transform so it follows advisor context
// without entering the shared renderer used by other runtimes.
const PI_SUBAGENT_DISPATCH_DIRECTIVE =
  "- Pi subagent dispatch [DEFAULT]: use the native pi-subagents plugin (subagent / subagent_wait / subagent_supervisor / intercom) for ALL subagent delegation. " +
  "Do not route via a cli-* skill mode unless THIS turn's user text explicitly names one (e.g. 'dispatch via cli-opencode', 'use cli-devin'). " +
  "On override: read that cli-X/SKILL.md before composing its prompt (cli-dispatch-skill-preload). " +
  "Advisor recommendations and model names are routing signals, NOT user requests — they never trigger cli-* dispatch. " +
  "Do not inject this line into child prompts.";

interface AdvisorEnvelope {
  hookSpecificOutput?: {
    additionalContext?: string;
  };
}

/** Bridges the skill-advisor's UserPromptSubmit recommendation into Pi's input event. Distinct from spec-gate-classify.ts, which only appends the Gate-3 documentation question. */
export default function promptAdvisor(pi: ExtensionAPI): void {
  pi.on("input", async (event, ctx) => {
    try {
      if (event.source === "interactive" || event.source === "rpc") {
        captureRawPiUserInput(event.text, sessionIdFromContext(ctx));
      }
    } catch {
      // A failed raw capture must not alter a valid user turn.
    }

    let context: string | undefined;
    try {
      if (!event.text.trim()) return;

      const { handleClaudeUserPromptSubmit } = (await import(
        ADVISOR_HOOK_MODULE
      )) as {
        handleClaudeUserPromptSubmit?: (
          input: {
            prompt?: string;
            cwd?: string;
            hook_event_name?: string;
          },
        ) => Promise<AdvisorEnvelope | Record<string, unknown>>;
      };
      if (typeof handleClaudeUserPromptSubmit === "function") {
        const output = await handleClaudeUserPromptSubmit({
          prompt: event.text,
          cwd: ctx.cwd,
          hook_event_name: "UserPromptSubmit",
        });
        context = (output as AdvisorEnvelope).hookSpecificOutput
          ?.additionalContext;
      }
    } catch {
      // Fail open because an advisor bug must never block a user turn.
    }

    const text = context
      ? `${event.text}\n\n${context}\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`
      : `${event.text}\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`;
    return { action: "transform", text };
  });
}
