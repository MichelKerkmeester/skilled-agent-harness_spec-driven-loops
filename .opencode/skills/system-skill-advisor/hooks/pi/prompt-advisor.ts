// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Prompt Advisor
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const RAW_INPUT_STORE_KEY = Symbol.for("mk.pi.dispatch.raw-input");
const MAX_CAPTURED_USER_TEXT = 32_768;
const MAX_CAPTURED_SESSIONS = 64;
const PI_DISPATCH_CANDIDATE = "006";

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

const POLICY_PLAN_MODULE =
  "../../.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/lib/policy-plan.js";
const POLICY_PLAN_FALLBACK_MODULE =
  "../../mcp-server/dist/mcp-server/lib/policy-plan.js";
const PI_COMPACT_SHADOW_STORE_KEY = Symbol.for("mk.pi.dispatch.compact-shadow");
const MAX_PI_RECEIPT_SESSIONS = 64;

type PiLifecycleEvent = "startup" | "resume" | "compact";
type PiDeliveryState = "UNSEEN" | "DELIVERED" | "SUPPRESSED_SAME";

interface PiDeliveryStateSignals {
  readonly sessionId?: unknown;
  readonly lifecycleEvent?: PiLifecycleEvent;
}

interface PiDeliveryStateRequest extends PiDeliveryStateSignals {
  readonly blockId: string;
  readonly contentHash: string;
  readonly deliveryConfirmed?: boolean;
}

interface PiDeliveryStateSnapshot {
  readonly state: PiDeliveryState;
  readonly epoch: number;
  readonly sessionKnown: boolean;
}

interface PiDeliveryEpochSnapshot {
  readonly epoch: number;
  readonly sessionKnown: boolean;
  readonly reasons: readonly string[];
}

interface PiDeliveryStateMachine {
  decideSuppression(input: PiDeliveryStateRequest): PiDeliveryStateSnapshot;
  confirmDelivery(input: PiDeliveryStateRequest): PiDeliveryStateSnapshot;
  advanceEpoch(signals: PiDeliveryStateSignals): PiDeliveryEpochSnapshot;
  clear(): void;
}

interface PolicyPlanModule {
  readonly RUNTIME_PI_DISPATCH_ID: string;
  readonly DeliveryStateMachine: new () => PiDeliveryStateMachine;
  readonly hashPolicyBlock: (block: { readonly id: string; readonly content: string }) => string;
  readonly advanceDeliveryEpoch: (
    signals: PiDeliveryStateSignals,
    machine: PiDeliveryStateMachine,
  ) => PiDeliveryEpochSnapshot;
  readonly recordObservedPolicyDelivery: (input: {
    readonly runtime: string;
    readonly candidate?: string | null;
    readonly blockId: string;
    readonly content: string;
    readonly contentHash: string;
    readonly lifecycleEpoch: number;
    readonly sessionId?: unknown;
    readonly sessionIdentityConfirmed?: boolean;
  }) => unknown;
}

export const PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG = "SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE";

// Keep this policy in the ordered Pi transform so it follows advisor context
// without entering the shared renderer used by other runtimes.
export const PI_SUBAGENT_DISPATCH_DIRECTIVE =
  "- Pi subagent dispatch [DEFAULT]: use the native pi-subagents plugin (subagent / subagent_wait / subagent_supervisor / intercom) for ALL subagent delegation. " +
  "Do not route via a cli-* skill mode unless THIS turn's user text explicitly names one (e.g. 'dispatch via cli-opencode', 'use cli-devin'). " +
  "On override: read that cli-X/SKILL.md before composing its prompt (cli-dispatch-skill-preload). " +
  "Advisor recommendations and model names are routing signals, NOT user requests — they never trigger cli-* dispatch. " +
  "Do not inject this line into child prompts.";

export const PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE =
  "- Pi dispatch: native pi-subagents by default; current-turn user cli-* only; preload cli-X/SKILL.md; advisor/model signals never override; no child-prompt injection.";

export const PI_SUBAGENT_DISPATCH_DIRECTIVE_BYTE_COUNT =
  Buffer.byteLength(PI_SUBAGENT_DISPATCH_DIRECTIVE, "utf8");
export const PI_COMPACT_DIRECTIVE_EXECUTED_BYTE_COUNT =
  Buffer.byteLength(PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE, "utf8");

export interface PiDispatchShadowReceipt {
  readonly compactByteCount: number;
  readonly fullByteCount: number;
  readonly emittedByteCount: number;
  readonly compactHash: string;
  readonly state: PiDeliveryState;
  readonly epoch: number;
  readonly sessionKnown: boolean;
  readonly resetReasons: readonly string[];
}

interface PiCompactShadowStore {
  machine?: PiDeliveryStateMachine;
  policyPlan?: PolicyPlanModule | null;
  policyPlanPromise?: Promise<PolicyPlanModule | null>;
  compactHash?: string;
  resetReasonsBySession?: Map<string, readonly string[]>;
  lastReceiptBySession?: Map<string, PiDispatchShadowReceipt>;
}

function compactShadowStore(): PiCompactShadowStore {
  const globalState = globalThis as typeof globalThis & {
    [PI_COMPACT_SHADOW_STORE_KEY]?: PiCompactShadowStore;
  };
  const existing = globalState[PI_COMPACT_SHADOW_STORE_KEY];
  if (existing) return existing;
  const created: PiCompactShadowStore = {};
  globalState[PI_COMPACT_SHADOW_STORE_KEY] = created;
  return created;
}

export function isPiCompactDirectivePrototypeEnabled(): boolean {
  const value = process.env[PI_COMPACT_DIRECTIVE_PROTOTYPE_FLAG]?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

async function loadPolicyPlan(): Promise<PolicyPlanModule | null> {
  const store = compactShadowStore();
  if (store.policyPlan !== undefined) return store.policyPlan;
  if (!store.policyPlanPromise) {
    store.policyPlanPromise = (async () => {
      try {
        return (await import(POLICY_PLAN_MODULE)) as unknown as PolicyPlanModule;
      } catch {
        try {
          return (await import(POLICY_PLAN_FALLBACK_MODULE)) as unknown as PolicyPlanModule;
        } catch {
          return null;
        }
      }
    })();
  }
  store.policyPlan = await store.policyPlanPromise;
  return store.policyPlan;
}

function receiptSessionKey(sessionId?: string): string | null {
  return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : null;
}

function sessionResetReasons(
  store: PiCompactShadowStore,
  sessionId?: string,
): readonly string[] | undefined {
  const key = receiptSessionKey(sessionId);
  if (!key || !store.resetReasonsBySession) return undefined;
  return store.resetReasonsBySession.get(key);
}

function setSessionResetReasons(
  store: PiCompactShadowStore,
  sessionId: string | undefined,
  reasons: readonly string[],
): void {
  const key = receiptSessionKey(sessionId);
  if (!key) return;
  if (!store.resetReasonsBySession) {
    store.resetReasonsBySession = new Map();
  }
  store.resetReasonsBySession.set(key, Object.freeze([...reasons]));
}

function updateShadowReceipt(
  store: PiCompactShadowStore,
  input: {
    readonly compactHash: string;
    readonly state: PiDeliveryState;
    readonly epoch: number;
    readonly sessionKnown: boolean;
    readonly resetReasons?: readonly string[];
  },
  sessionId?: string,
): void {
  const receipt = Object.freeze({
    compactByteCount: PI_COMPACT_DIRECTIVE_EXECUTED_BYTE_COUNT,
    fullByteCount: PI_SUBAGENT_DISPATCH_DIRECTIVE_BYTE_COUNT,
    emittedByteCount: PI_SUBAGENT_DISPATCH_DIRECTIVE_BYTE_COUNT,
    compactHash: input.compactHash,
    state: input.state,
    epoch: input.epoch,
    sessionKnown: input.sessionKnown,
    resetReasons: Object.freeze([...(input.resetReasons ?? [])]),
  });
  if (!store.lastReceiptBySession) {
    store.lastReceiptBySession = new Map();
  }
  const key = receiptSessionKey(sessionId);
  if (!key) return;
  if (!store.lastReceiptBySession.has(key)) {
    while (store.lastReceiptBySession.size >= MAX_PI_RECEIPT_SESSIONS) {
      const oldest = store.lastReceiptBySession.keys().next().value;
      if (typeof oldest !== "string") break;
      store.lastReceiptBySession.delete(oldest);
      store.resetReasonsBySession?.delete(oldest);
    }
  }
  store.lastReceiptBySession.set(key, receipt);
}

export function getPiDispatchShadowReceipt(sessionId?: string): PiDispatchShadowReceipt | null {
  const store = compactShadowStore();
  const map = store.lastReceiptBySession;
  if (!map) return null;
  const key = receiptSessionKey(sessionId);
  if (!key) return null;
  const receipt = map.get(key);
  if (!receipt) return null;
  return Object.freeze({ ...receipt, resetReasons: Object.freeze([...receipt.resetReasons]) });
}

export function resetPiDispatchShadowState(): void {
  const store = compactShadowStore();
  store.machine?.clear();
  store.compactHash = undefined;
  store.resetReasonsBySession?.clear();
  store.lastReceiptBySession?.clear();
  store.policyPlan = undefined;
  store.policyPlanPromise = undefined;
}

function forcePiDispatchUnknownReceipt(store: PiCompactShadowStore, sessionId?: string): void {
  setSessionResetReasons(store, sessionId, ["lifecycle-error"]);
  updateShadowReceipt(store, {
    compactHash: store.compactHash ?? "",
    state: "UNSEEN",
    epoch: 0,
    sessionKnown: false,
    resetReasons: ["lifecycle-error"],
  }, sessionId);
}

function latchPiDispatchFailure(store: PiCompactShadowStore, sessionId?: string): void {
  const key = receiptSessionKey(sessionId);
  const existingReasons = sessionResetReasons(store, sessionId) ?? [];
  const reasons = existingReasons.includes("lifecycle-error")
    ? existingReasons
    : Object.freeze([...existingReasons, "lifecycle-error"]);
  setSessionResetReasons(store, sessionId, reasons);
  const currentReceipt = key ? store.lastReceiptBySession?.get(key) : undefined;
  updateShadowReceipt(store, {
    compactHash: currentReceipt?.compactHash ?? store.compactHash ?? "",
    state: "UNSEEN",
    epoch: currentReceipt?.epoch ?? 0,
    sessionKnown: false,
    resetReasons: reasons,
  }, sessionId);
}

function isPiDispatchFailureLatched(store: PiCompactShadowStore, sessionId?: string): boolean {
  return sessionResetReasons(store, sessionId)?.includes("lifecycle-error") ?? false;
}

async function observeEmittedPiDispatch(sessionId: string | undefined): Promise<void> {
  try {
    const policyPlan = await loadPolicyPlan();
    if (!policyPlan || !sessionId) return;
    const store = compactShadowStore();
    const machine = store.machine ?? (store.machine = new policyPlan.DeliveryStateMachine());
    const epoch = machine.currentEpoch({ sessionId });
    const contentHash = policyPlan.hashPolicyBlock({
      id: policyPlan.RUNTIME_PI_DISPATCH_ID,
      content: PI_SUBAGENT_DISPATCH_DIRECTIVE,
    });
    policyPlan.recordObservedPolicyDelivery({
      runtime: "Pi",
      candidate: PI_DISPATCH_CANDIDATE,
      blockId: policyPlan.RUNTIME_PI_DISPATCH_ID,
      content: PI_SUBAGENT_DISPATCH_DIRECTIVE,
      contentHash,
      lifecycleEpoch: epoch,
      sessionId,
      sessionIdentityConfirmed: true,
    });
  } catch {
    // Host observation is fail-open so a throwing sink cannot affect delivery.
  }
}

async function observePiCompactDirective(
  sessionId: string | undefined,
  enabled: boolean,
): Promise<void> {
  const store = compactShadowStore();
  if (!enabled) {
    store.machine?.clear();
    store.compactHash = undefined;
    store.resetReasonsBySession?.clear();
    store.lastReceiptBySession?.clear();
    return;
  }

  const policyPlan = await loadPolicyPlan();
  if (!policyPlan) {
    forcePiDispatchUnknownReceipt(store, sessionId);
    return;
  }
  const machine = store.machine ?? (store.machine = new policyPlan.DeliveryStateMachine());
  const compactHash = store.compactHash ?? (store.compactHash = policyPlan.hashPolicyBlock({
    id: policyPlan.RUNTIME_PI_DISPATCH_ID,
    content: PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE,
  }));
  const request = {
    sessionId,
    blockId: policyPlan.RUNTIME_PI_DISPATCH_ID,
    contentHash: compactHash,
  };
  const decision = machine.decideSuppression(request);
  if (isPiDispatchFailureLatched(store, sessionId)) {
    latchPiDispatchFailure(store, sessionId);
    return;
  }
  updateShadowReceipt(store, {
    compactHash,
    state: decision.state,
    epoch: decision.epoch,
    sessionKnown: decision.sessionKnown,
    resetReasons: sessionResetReasons(store, sessionId),
  }, sessionId);
}

async function resetPiDispatchLifecycle(
  sessionId: string | undefined,
  lifecycleEvent: PiLifecycleEvent,
): Promise<void> {
  const store = compactShadowStore();
  if (!isPiCompactDirectivePrototypeEnabled()) {
    store.machine?.clear();
    store.compactHash = undefined;
    store.resetReasonsBySession?.clear();
    store.lastReceiptBySession?.clear();
    return;
  }
  const policyPlan = await loadPolicyPlan();
  if (!policyPlan) {
    forcePiDispatchUnknownReceipt(store, sessionId);
    return;
  }
  const machine = store.machine ?? (store.machine = new policyPlan.DeliveryStateMachine());
  const compactHash = store.compactHash ?? (store.compactHash = policyPlan.hashPolicyBlock({
    id: policyPlan.RUNTIME_PI_DISPATCH_ID,
    content: PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE,
  }));
  const epoch = policyPlan.advanceDeliveryEpoch({ sessionId, lifecycleEvent }, machine);
  setSessionResetReasons(store, sessionId, epoch.reasons);
  updateShadowReceipt(store, {
    compactHash,
    state: "UNSEEN",
    epoch: epoch.epoch,
    sessionKnown: epoch.sessionKnown,
    resetReasons: epoch.reasons,
  }, sessionId);
}

function sessionStartLifecycleEvent(reason: unknown): PiLifecycleEvent | null {
  if (reason === "startup" || reason === "new") return "startup";
  if (reason === "resume" || reason === "fork") return "resume";
  return null;
}

interface AdvisorEnvelope {
  hookSpecificOutput?: {
    additionalContext?: string;
  };
}

/** Bridges the skill-advisor's UserPromptSubmit recommendation into Pi's input event. Distinct from spec-gate-classify.ts, which only appends the Gate-3 documentation question. */
export default function promptAdvisor(pi: ExtensionAPI): void {
  pi.on("session_start", async (event, ctx) => {
    const lifecycleEvent = sessionStartLifecycleEvent(event.reason);
    if (!lifecycleEvent) return;
    const sessionId = sessionIdFromContext(ctx);
    try {
      await resetPiDispatchLifecycle(sessionId, lifecycleEvent);
    } catch {
      forcePiDispatchUnknownReceipt(compactShadowStore(), sessionId);
    }
  });

  pi.on("session_compact", async (_event, ctx) => {
    const sessionId = sessionIdFromContext(ctx);
    try {
      await resetPiDispatchLifecycle(sessionId, "compact");
    } catch {
      forcePiDispatchUnknownReceipt(compactShadowStore(), sessionId);
    }
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
      latchPiDispatchFailure(compactShadowStore(), sessionIdFromContext(ctx));
      advisorFailed = true;
    }

    if (!advisorFailed) {
      try {
        await observePiCompactDirective(
          sessionIdFromContext(ctx),
          isPiCompactDirectivePrototypeEnabled(),
        );
      } catch {
        latchPiDispatchFailure(compactShadowStore(), sessionIdFromContext(ctx));
      }
    }

    const text = context
      ? `${event.text}\n\n${context}\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`
      : `${event.text}\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`;
    const output = { action: "transform" as const, text };
    await observeEmittedPiDispatch(sessionIdFromContext(ctx));
    return output;
  });
}
