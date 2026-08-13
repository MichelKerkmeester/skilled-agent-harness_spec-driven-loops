// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Dispatch Preflight Lint
// ───────────────────────────────────────────────────────────────────

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { join } from "node:path";

const PI_RUNTIME = "pi";
const DIRECTIVE_MARKER = "- Pi subagent dispatch [DEFAULT]:";
const CAPSULE_MARKER = "\n\nAdvisor:";
const SPEC_GATE_MARKER = "SPEC FOLDER QUESTION:";
const RAW_INPUT_STORE_KEY = Symbol.for("mk.pi.dispatch.raw-input");
const MAX_CAPTURED_USER_TEXT = 32_768;
const MAX_CAPTURED_SESSIONS = 64;
const NEGATION_PATTERN = /\b(?:don'?t|do not|never|avoid|without)\b/i;
const DEEP_LOOP_EXECUTOR_PATTERN = /(?:^|\s)\/deep:\S+[^\n]*?\s--executor(?:=|\s+)(cli-[\w-]+)/gi;

interface RawInputStore {
  readonly bySession: Map<string, string>;
}

export interface PiDispatchGuardInput {
  readonly runtime?: string;
  readonly toolName?: unknown;
  readonly command?: unknown;
  readonly dispatchSkill?: string | null;
  readonly inspectedExecutor?: string | null;
  readonly inspectionKind?: "direct" | "ambiguous" | "none";
  readonly userText?: unknown;
}

function rawInputStore(): RawInputStore {
  const globalState = globalThis as typeof globalThis & { [key: symbol]: RawInputStore | undefined };
  const existing = globalState[RAW_INPUT_STORE_KEY];
  if (existing) return existing;
  const created: RawInputStore = { bySession: new Map() };
  globalState[RAW_INPUT_STORE_KEY] = created;
  return created;
}

function trimSessionStore(store: RawInputStore): void {
  while (store.bySession.size >= MAX_CAPTURED_SESSIONS) {
    const oldest = store.bySession.keys().next().value;
    if (typeof oldest !== "string") return;
    store.bySession.delete(oldest);
  }
}

/** Capture the untouched text for a session before any sibling transform runs. */
export function captureRawPiUserInput(text: unknown, sessionId: unknown): void {
  if (typeof text !== "string" || typeof sessionId !== "string" || sessionId.length === 0) return;
  const bounded = text.length > MAX_CAPTURED_USER_TEXT ? text.slice(0, MAX_CAPTURED_USER_TEXT) : text;
  const store = rawInputStore();
  if (!store.bySession.has(sessionId)) trimSessionStore(store);
  store.bySession.set(sessionId, bounded);
}

export function resetRawPiUserInputCapture(): void {
  rawInputStore().bySession.clear();
}

function sessionIdFromContext(ctx: { sessionManager?: { getSessionId?: () => unknown } }): string | undefined {
  try {
    const sessionId = ctx.sessionManager?.getSessionId?.();
    return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : undefined;
  } catch {
    return undefined;
  }
}

function isKnownTransform(text: string, previous: string): boolean {
  if (text === previous || !text.startsWith(previous)) return false;
  const suffix = text.slice(previous.length);
  return suffix.includes(DIRECTIVE_MARKER) || suffix.includes(CAPSULE_MARKER) || suffix.includes(SPEC_GATE_MARKER);
}

function captureInitialPiUserInput(text: unknown, sessionId: unknown): void {
  if (typeof text !== "string" || typeof sessionId !== "string" || sessionId.length === 0) return;
  const previous = rawInputStore().bySession.get(sessionId);
  if (previous !== undefined && isKnownTransform(text, previous)) return;
  captureRawPiUserInput(text, sessionId);
}

function currentUserText(ctx: { sessionManager?: { getSessionId?: () => unknown } }): string {
  const sessionId = sessionIdFromContext(ctx);
  if (!sessionId) return "";
  return rawInputStore().bySession.get(sessionId) ?? "";
}

function stripInjectedContent(text: string): string {
  let cleaned = text;
  const directiveStart = cleaned.lastIndexOf(DIRECTIVE_MARKER);
  if (directiveStart !== -1) {
    const lineEnd = cleaned.indexOf("\n", directiveStart);
    cleaned = cleaned.slice(0, directiveStart) + (lineEnd === -1 ? "" : cleaned.slice(lineEnd));
  }
  const capsuleStart = cleaned.lastIndexOf(CAPSULE_MARKER);
  if (capsuleStart !== -1) cleaned = cleaned.slice(0, capsuleStart);
  const specGateStart = cleaned.lastIndexOf(SPEC_GATE_MARKER);
  if (specGateStart !== -1) cleaned = cleaned.slice(0, specGateStart);
  const lastUserTurn = cleaned.lastIndexOf("[user]");
  if (lastUserTurn !== -1) {
    const suffix = cleaned.slice(lastUserTurn + "[user]".length);
    if (suffix.trim()) cleaned = suffix;
  }
  return cleaned;
}

function isInsideQuote(text: string, index: number): boolean {
  let quote: "'" | '"' | undefined;
  let escaped = false;
  for (let cursor = 0; cursor < index; cursor += 1) {
    const character = text[cursor];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = undefined;
    } else if (character === "'" || character === '"') {
      quote = character;
    }
  }
  return quote !== undefined;
}

function isInsideExpansion(text: string, index: number): boolean {
  const prefix = text.slice(0, index);
  const lastOpen = prefix.lastIndexOf("$(");
  const lastClose = prefix.lastIndexOf(")");
  if (lastOpen > lastClose) return true;
  const backticks = (prefix.match(/`/g) ?? []).length;
  return backticks % 2 === 1;
}

function tokenStart(text: string, index: number): number {
  let cursor = index;
  while (cursor > 0 && !/[\s;|&]/.test(text[cursor - 1])) cursor -= 1;
  return cursor;
}

function hasExplicitModeOverride(userText: string, skill: string): boolean {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:^|[^A-Za-z0-9_-])${escapedSkill}(?:$|[^A-Za-z0-9_-])`, "g");
  let cursor = 0;
  while (cursor < userText.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(userText);
    if (!match) return false;
    const mentionIndex = match.index + (match[0].startsWith(skill) ? 0 : match[0].length - skill.length - 1);
    const start = tokenStart(userText, mentionIndex);
    const token = userText.slice(start, mentionIndex + skill.length);
    const sentenceStart = Math.max(
      userText.lastIndexOf("\n", mentionIndex),
      userText.lastIndexOf(";", mentionIndex),
      userText.lastIndexOf(".", mentionIndex),
      userText.lastIndexOf("!", mentionIndex),
      userText.lastIndexOf("?", mentionIndex),
    ) + 1;
    const preceding = userText.slice(sentenceStart, mentionIndex);
    const usable = !isInsideQuote(userText, mentionIndex) &&
      !isInsideExpansion(userText, mentionIndex) &&
      !token.includes("=") &&
      !token.startsWith("$") &&
      !NEGATION_PATTERN.test(preceding);
    if (usable) return true;
    cursor = match.index + match[0].length;
  }
  return false;
}

function deepLoopExecutors(userText: string): string[] {
  const executors: string[] = [];
  DEEP_LOOP_EXECUTOR_PATTERN.lastIndex = 0;
  for (let match = DEEP_LOOP_EXECUTOR_PATTERN.exec(userText); match; match = DEEP_LOOP_EXECUTOR_PATTERN.exec(userText)) {
    executors.push(match[1]);
  }
  DEEP_LOOP_EXECUTOR_PATTERN.lastIndex = 0;
  return executors;
}

/** Returns true only for a Pi bash dispatch that has no explicit user-level exemption. */
export function shouldDenyPiDispatch(input: PiDispatchGuardInput = {}): boolean {
  if (input.runtime !== PI_RUNTIME || input.toolName !== "bash" || typeof input.command !== "string") return false;
  if (input.inspectionKind === "none") return false;
  if (input.inspectionKind === "ambiguous") return true;
  if (typeof input.dispatchSkill !== "string" || !input.dispatchSkill) return input.inspectionKind === "direct";
  if (input.inspectionKind === "direct" && input.inspectedExecutor !== input.dispatchSkill) return true;

  // A pi session must never dispatch itself, even when explicitly named.
  if (input.dispatchSkill === "cli-pi") return true;

  const userText = stripInjectedContent(typeof input.userText === "string" ? input.userText.slice(0, MAX_CAPTURED_USER_TEXT) : "");
  if (userText.length === 0) return true;

  const deepExecutors = deepLoopExecutors(userText);
  if (deepExecutors.length > 0) return !deepExecutors.every((executor) => executor === input.dispatchSkill);
  return !hasExplicitModeOverride(userText, input.dispatchSkill);
}

async function loadDispatchModules(): Promise<{
  lint: typeof import("../../.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs");
  audit: typeof import("../../.opencode/hooks/dispatch/lib/dispatch-audit.mjs");
}> {
  try {
    const [lint, audit] = await Promise.all([
      import("../../.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"),
      import("../../.opencode/hooks/dispatch/lib/dispatch-audit.mjs"),
    ]);
    return { lint, audit };
  } catch {
    const [lint, audit] = await Promise.all([
      import("../lib/dispatch-rule-checks.mjs"),
      import("../lib/dispatch-audit.mjs"),
    ]);
    return { lint, audit };
  }
}

/** Blocks or warns on a bash dispatch command that violates a target skill's hard rules. */
export default function dispatchPreflightLint(pi: ExtensionAPI): void {
  pi.on("input", (event, ctx) => {
    try {
      if (event.source === "interactive" || event.source === "rpc") {
        captureInitialPiUserInput(event.text, sessionIdFromContext(ctx));
      }
    } catch {
      // A failed capture cannot authorize a dispatch and must not alter the turn.
    }
    return { action: "continue" };
  });

  pi.on("tool_call", async (event, ctx) => {
    try {
      if (event.toolName !== "bash" || typeof event.input.command !== "string") return;

      const { lint, audit } = await loadDispatchModules();
      const inspection = audit.inspectDispatch(event.input.command);
      if (inspection.kind === "none") return;

      const dispatchSkill = inspection.kind === "direct" ? inspection.executor : null;
      const denied = shouldDenyPiDispatch({
        runtime: PI_RUNTIME,
        toolName: event.toolName,
        command: event.input.command,
        dispatchSkill,
        inspectedExecutor: dispatchSkill,
        inspectionKind: inspection.kind,
        userText: currentUserText(ctx),
      });
      if (denied) {
        if (dispatchSkill === "cli-pi") {
          return {
            block: true,
            reason: "Pi cannot dispatch itself: cli-pi is never authorized.",
          };
        }
        if (inspection.kind !== "direct") {
          return {
            block: true,
            reason: "Pi dispatch denied: the command does not prove one direct executor.",
          };
        }
        return {
          block: true,
          reason: `Pi dispatch denied for ${dispatchSkill}. Name the matching executor in the user request, or use the native subagent tool.`,
        };
      }

      const shape = audit.DISPATCH_SHAPES.find((candidate) => candidate.skill === dispatchSkill);
      if (!shape) return;

      const skillMd = join(ctx.cwd, ".opencode", "skills", shape.packetPath, "SKILL.md");
      const rules = lint.readHardRules(skillMd);
      if (rules.length === 0) return;

      const violations = lint.evaluate(event.input.command, rules);
      const blocking = violations.filter((violation) => violation.severity === "block");
      const warnings = violations.filter((violation) => violation.severity === "warn");
      if (blocking.length > 0) {
        return {
          block: true,
          reason: `Dispatch blocked by ${dispatchSkill} hard-rule(s):\n` +
            blocking.map((violation) => `  • [${violation.id}] ${violation.message}`).join("\n"),
        };
      }
      if (warnings.length > 0) {
        return {
          reason: `Dispatch advisory for ${dispatchSkill}:\n` +
            warnings.map((violation) => `  • [${violation.id}] ${violation.message}`).join("\n"),
        };
      }
    } catch {
      // A dispatch lint failure must not block unrelated work or create an authorization allow.
      return undefined;
    }
    return undefined;
  });
}
