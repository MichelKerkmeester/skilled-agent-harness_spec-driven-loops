// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Prompt Advisor
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const RAW_INPUT_STORE_KEY = Symbol.for("mk.pi.dispatch.raw-input");
const MAX_CAPTURED_USER_TEXT = 32_768;
const MAX_CAPTURED_SESSIONS = 64;
const MAX_TRACKED_SESSIONS = 64;
// The advisor's CLI budget ends first; this margin only catches a call that hangs past it.
const PI_ADVISOR_DEADLINE_MARGIN_MS = 300;
// Mirrors the Claude hook's default budget, which Pi cannot import statically because it loads the hook lazily.
const PI_ADVISOR_DEFAULT_BUDGET_MS = 2500;

// The hook applies the same parse rule; diverging here would let Pi's deadline fire
// before the hook's own budget expires.
function advisorBudgetMs(): number {
  const value = process.env.SPECKIT_CLAUDE_HOOK_TIMEOUT_MS;
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : PI_ADVISOR_DEFAULT_BUDGET_MS;
}

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
export const ADVISOR_HOOK_MODULE =
  "../../.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js";
export const ADVISOR_HOOK_FALLBACK_MODULE =
  "../../runtime/dist/hooks/claude/user-prompt-submit.js";

// ── Pi-local advisor-brief de-duplication ──────────────────────────
// The advisor brief Pi appends onto the visible prompt is a dynamic route line
// plus constant directives. Pi renders the entire extension contribution on
// screen, so a proven same-content repeat suppresses that brief. The first
// turn, changed contribution, resume/compact, unknown sessions, and the
// kill-switch all fail open to the complete contribution. Dispatch
// authorization remains enforced separately at the tool-call boundary on every
// turn.
export const PI_DIRECTIVE_DEDUP_FLAG = "SPECKIT_PI_DIRECTIVE_DEDUP";

// Mirrors render.ts DIRECTIVES_LABEL. If the brief format ever drifts past
// this separator the split fails closed to full delivery.
const PI_DIRECTIVE_SEPARATOR = "\nDirectives:";

export function isPiDirectiveDedupEnabled(): boolean {
  const value = process.env[PI_DIRECTIVE_DEDUP_FLAG]?.trim().toLowerCase();
  return value !== "0" && value !== "false" && value !== "off" && value !== "no";
}

interface PiDirectiveBriefParts {
  readonly head: string;
  readonly directives: string;
}

function splitPiDirectiveBrief(context: string): PiDirectiveBriefParts | null {
  const index = context.indexOf(PI_DIRECTIVE_SEPARATOR);
  if (index > 0) {
    return { head: context.slice(0, index), directives: context.slice(index) };
  }
  // Advisor-failure / no-route fallback: the brief is the directive block with
  // no advisor head. Normalize it to the separator-prefixed form so an
  // identical directive block dedups to the same key whether or not a head was
  // present; record an empty head. Without this the operator-visible directives
  // repeat on every headless-brief turn.
  const label = PI_DIRECTIVE_SEPARATOR.slice(1);
  if (context.startsWith(label)) {
    return { head: "", directives: PI_DIRECTIVE_SEPARATOR + context.slice(label.length) };
  }
  return null;
}

export interface PiDirectiveDeliveryDecision {
  readonly suppressed: boolean;
}

const FULL_PI_DIRECTIVE_DELIVERY: PiDirectiveDeliveryDecision = Object.freeze({
  suppressed: false,
});

const PI_DIRECTIVE_DEDUP_STORE_KEY = Symbol.for("mk.pi.directive-dedup");

interface PiDirectiveDedupStore {
  readonly directiveDedupBySession: Map<string, string>;
}

function directiveDedupStore(): PiDirectiveDedupStore {
  const globalState = globalThis as typeof globalThis & {
    [PI_DIRECTIVE_DEDUP_STORE_KEY]?: PiDirectiveDedupStore;
  };
  const existing = globalState[PI_DIRECTIVE_DEDUP_STORE_KEY];
  if (existing) return existing;
  const created: PiDirectiveDedupStore = { directiveDedupBySession: new Map() };
  globalState[PI_DIRECTIVE_DEDUP_STORE_KEY] = created;
  return created;
}

function receiptSessionKey(sessionId?: string): string | null {
  return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : null;
}

/**
 * Decide whether this extension may omit its entire visible contribution.
 * Suppresses only for a confirmed session's proven same-content repeat within
 * the current lifecycle epoch; every uncertain case falls open to full
 * delivery. Records the delivered contribution on a full delivery so the next
 * identical contribution is eligible.
 */
export function decidePiDirectiveDelivery(
  context: string,
  sessionId: string | undefined,
): PiDirectiveDeliveryDecision {
  if (!isPiDirectiveDedupEnabled()) return FULL_PI_DIRECTIVE_DELIVERY;
  const key = receiptSessionKey(sessionId);
  if (!key) return FULL_PI_DIRECTIVE_DELIVERY;
  const parts = splitPiDirectiveBrief(context);
  if (!parts) return FULL_PI_DIRECTIVE_DELIVERY;

  const map = directiveDedupStore().directiveDedupBySession;
  if (map.get(key) === context) {
    return Object.freeze({ suppressed: true });
  }
  if (!map.has(key)) {
    while (map.size >= MAX_TRACKED_SESSIONS) {
      const oldest = map.keys().next().value;
      if (typeof oldest !== "string") break;
      map.delete(oldest);
    }
  }
  map.set(key, context);
  return FULL_PI_DIRECTIVE_DELIVERY;
}

export function resetPiDirectiveDedupForSession(sessionId: string | undefined): void {
  const key = receiptSessionKey(sessionId);
  if (!key) return;
  directiveDedupStore().directiveDedupBySession.delete(key);
}

export function resetPiDirectiveDedupState(): void {
  directiveDedupStore().directiveDedupBySession.clear();
}

export const PI_ADVISOR_DEBUG_FLAG = "SPECKIT_PI_ADVISOR_DEBUG";

export function isPiAdvisorDebugEnabled(): boolean {
  const v = process.env[PI_ADVISOR_DEBUG_FLAG];
  return v === "1" || v === "true";
}

// Operator-facing, opt-in only. Classifies what the advisor returned this turn
// so a cli-pi operator can tell a live advisor route from each fallback case
// (outage, no match, skipped), and read how long the advisor call took against
// its timeout budget — enough to distinguish a timeout (durationMs ≈ budgetMs)
// from an unreachable daemon (fast fallback) without instrumenting the advisor.
export function formatPiAdvisorDebug(
  context: string | undefined,
  advisorFailed: boolean,
  durationMs: number,
): string {
  let brief: string;
  if (advisorFailed) brief = "failed";
  else if (!context || !context.trim()) brief = "empty";
  else if (context.startsWith("Advisor: outage (")) brief = "fallback(outage)";
  else if (context.startsWith("Advisor: no skill matched.")) brief = "fallback(no-match)";
  else if (context.startsWith("Advisor: prompt skipped.")) brief = "fallback(skipped)";
  else if (context.startsWith("Directives:")) brief = "fallback(headless)";
  else {
    const match = context.match(/^Advisor:\s*([A-Za-z]+)/);
    brief = match ? `head(${match[1]})` : "other";
  }
  const budgetMs = advisorBudgetMs();
  return `[advisor-debug] brief=${brief} durationMs=${durationMs} budgetMs=${budgetMs}`;
}

interface AdvisorEnvelope {
  hookSpecificOutput?: {
    additionalContext?: string;
  };
}

/**
 * Bridges the skill-advisor's UserPromptSubmit recommendation into Pi's input
 * event. Distinct from spec-gate-classify.ts, which opens the gate silently and
 * appends only the one-shot deferral instruction when the session has no dialog
 * UI attached.
 */
export default function promptAdvisor(pi: ExtensionAPI): void {
  pi.on("session_start", (_event, ctx) => {
    resetPiDirectiveDedupForSession(sessionIdFromContext(ctx));
  });

  pi.on("session_compact", (_event, ctx) => {
    resetPiDirectiveDedupForSession(sessionIdFromContext(ctx));
  });

  pi.on("input", async (event, ctx) => {
    try {
      if (event.source === "interactive" || event.source === "rpc") {
        captureRawPiUserInput(event.text, sessionIdFromContext(ctx));
      }
    } catch {
      // A failed raw capture must not alter a valid user turn.
    }

    let context: string | undefined;
    let advisorFailed = false;
    let advisorMs = 0;
    const advisorStart = Date.now();
    try {
      if (!event.text.trim()) return;

      const advisorModule = await import(ADVISOR_HOOK_MODULE).catch(
        () => import(ADVISOR_HOOK_FALLBACK_MODULE),
      );
      const { handleClaudeUserPromptSubmit, renderAdvisorFallbackDirective } = advisorModule as {
        handleClaudeUserPromptSubmit?: (
          input: {
            prompt?: string;
            cwd?: string;
            hook_event_name?: string;
          },
          dependencies?: { runtime?: "pi" },
        ) => Promise<AdvisorEnvelope | Record<string, unknown>>;
        renderAdvisorFallbackDirective?: () => string;
      };
      if (typeof handleClaudeUserPromptSubmit === "function") {
        let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
        try {
          const outcome = await Promise.race([
            handleClaudeUserPromptSubmit(
              {
                prompt: event.text,
                cwd: ctx.cwd,
                hook_event_name: "UserPromptSubmit",
              },
              { runtime: "pi" },
            ).then((output) => ({ timedOut: false as const, output })),
            new Promise<{ timedOut: true }>((resolve) => {
              const budgetMs = advisorBudgetMs();
              deadlineTimer = setTimeout(
                () => resolve({ timedOut: true }),
                budgetMs + PI_ADVISOR_DEADLINE_MARGIN_MS,
              );
              deadlineTimer.unref();
            }),
          ]);
          if (outcome.timedOut) {
            if (typeof renderAdvisorFallbackDirective === "function") {
              context = renderAdvisorFallbackDirective();
            }
          } else {
            context = (outcome.output as AdvisorEnvelope).hookSpecificOutput
              ?.additionalContext;
          }
        } finally {
          if (deadlineTimer) clearTimeout(deadlineTimer);
        }
      }
    } catch {
      advisorFailed = true;
    } finally {
      advisorMs = Date.now() - advisorStart;
    }

    const advisorDebug = isPiAdvisorDebugEnabled()
      ? formatPiAdvisorDebug(context, advisorFailed, advisorMs)
      : "";

    if (!advisorFailed && context) {
      try {
        const decision = decidePiDirectiveDelivery(context, sessionIdFromContext(ctx));
        if (decision.suppressed) {
          // A suppressed turn normally emits no transform. When advisor-debug is
          // opt-in enabled, still surface the debug line so the operator can read
          // advisor freshness on every cli-pi turn, not only the delivered ones.
          if (advisorDebug) {
            return { action: "transform" as const, text: `${event.text}\n\n${advisorDebug}` };
          }
          return;
        }
      } catch {
        // Directive de-dup is advisory; on any failure keep the full contribution.
      }
    }

    const briefBlock = advisorDebug
      ? context
        ? `${advisorDebug}\n\n${context}`
        : advisorDebug
      : context;
    if (!briefBlock) return;
    const text = `${event.text}\n\n${briefBlock}`;
    return { action: "transform" as const, text };
  });
}
