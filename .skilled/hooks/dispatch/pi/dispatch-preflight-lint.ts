// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Dispatch Preflight Lint
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { join } from 'node:path';

import { isHookEnabled } from '../../.skilled/hooks/shared/hook-flags.mjs';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface RawInputStore {
  readonly bySession: Map<string, string>;
}

export interface PiDispatchGuardInput {
  readonly runtime?: string;
  readonly toolName?: unknown;
  readonly command?: unknown;
  readonly dispatchSkill?: string | null;
  readonly inspectedExecutor?: string | null;
  readonly inspectionKind?: 'direct' | 'ambiguous' | 'none';
  readonly userText?: unknown;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const PI_RUNTIME = 'pi';
const CAPSULE_MARKER = '\n\nAdvisor:';
const SPEC_GATE_MARKER = 'SPEC FOLDER QUESTION:';
const RAW_INPUT_STORE_KEY = Symbol.for('mk.pi.dispatch.raw-input');
const MAX_CAPTURED_USER_TEXT = 32_768;
const MAX_CAPTURED_SESSIONS = 64;
const NEGATION_PATTERN = /\b(?:don'?t|do not|never|avoid|without|not)\b/i;
// A comma ends a negation's clause only when an executor is named before it and a new
// imperative follows it; otherwise the comma belongs to a parenthetical or a list.
const NEGATION_CLAUSE_EXECUTOR_PATTERN = /(?:\bcli-[\w-]+|\/deep:|\b(?:opencode|claude|codex|devin|cursor-agent|cursor|pi|hermes|jev)\b)/i;
const NEGATION_CLAUSE_IMPERATIVE_PATTERN = /^(?:use|run|try|pick|choose|call|dispatch|launch|prefer|switch|go)\b/i;
const DEEP_LOOP_EXECUTOR_PATTERN = /(?:^|\s)\/deep:\S+[^\n]*?\s--executor(?:=|\s+)(cli-[\w-]+)/gi;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

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
    if (typeof oldest !== 'string') return;
    store.bySession.delete(oldest);
  }
}

/** Capture the untouched text for a session before any sibling transform runs. */
export function captureRawPiUserInput(text: unknown, sessionId: unknown): void {
  if (typeof text !== 'string' || typeof sessionId !== 'string' || sessionId.length === 0) return;
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
    return typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : undefined;
  } catch {
    return undefined;
  }
}

function isKnownTransform(text: string, previous: string): boolean {
  if (text === previous || !text.startsWith(previous)) return false;
  const suffix = text.slice(previous.length);
  return suffix.includes(CAPSULE_MARKER) || suffix.includes(SPEC_GATE_MARKER);
}

function captureInitialPiUserInput(text: unknown, sessionId: unknown): void {
  if (typeof text !== 'string' || typeof sessionId !== 'string' || sessionId.length === 0) return;
  const previous = rawInputStore().bySession.get(sessionId);
  if (previous !== undefined && isKnownTransform(text, previous)) return;
  captureRawPiUserInput(text, sessionId);
}

function currentUserText(ctx: { sessionManager?: { getSessionId?: () => unknown } }): string {
  const sessionId = sessionIdFromContext(ctx);
  if (!sessionId) return '';
  return rawInputStore().bySession.get(sessionId) ?? '';
}

function stripInjectedContent(text: string): string {
  let cleaned = text;
  const capsuleStart = cleaned.lastIndexOf(CAPSULE_MARKER);
  if (capsuleStart !== -1) cleaned = cleaned.slice(0, capsuleStart);
  const specGateStart = cleaned.lastIndexOf(SPEC_GATE_MARKER);
  if (specGateStart !== -1) cleaned = cleaned.slice(0, specGateStart);
  const lastUserTurn = cleaned.lastIndexOf('[user]');
  if (lastUserTurn !== -1) {
    const suffix = cleaned.slice(lastUserTurn + '[user]'.length);
    if (suffix.trim()) cleaned = suffix;
  }
  return cleaned;
}

function isInsideQuote(text: string, index: number): boolean {
  let quote: '\'' | '"' | undefined;
  let escaped = false;
  for (let cursor = 0; cursor < index; cursor += 1) {
    const character = text[cursor];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\' && quote !== '\'') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = undefined;
    } else if (character === '\'' || character === '"') {
      quote = character;
    }
  }
  return quote !== undefined;
}

function isInsideExpansion(text: string, index: number): boolean {
  const prefix = text.slice(0, index);
  const lastOpen = prefix.lastIndexOf('$(');
  const lastClose = prefix.lastIndexOf(')');
  if (lastOpen > lastClose) return true;
  const backticks = (prefix.match(/`/g) ?? []).length;
  return backticks % 2 === 1;
}

function tokenStart(text: string, index: number): number {
  let cursor = index;
  while (cursor > 0 && !/[\s;|&]/.test(text[cursor - 1])) cursor -= 1;
  return cursor;
}

function negationReachesMention(preceding: string): boolean {
  const scan = new RegExp(NEGATION_PATTERN.source, 'gi');
  let lastNegation: RegExpExecArray | null = null;
  for (let match = scan.exec(preceding); match; match = scan.exec(preceding)) lastNegation = match;
  if (!lastNegation) return false;
  const negationEnd = lastNegation.index + lastNegation[0].length;
  for (let comma = preceding.indexOf(',', negationEnd); comma !== -1; comma = preceding.indexOf(',', comma + 1)) {
    const beforeComma = preceding.slice(negationEnd, comma);
    if (!NEGATION_CLAUSE_EXECUTOR_PATTERN.test(beforeComma)) continue;
    const afterComma = preceding.slice(comma + 1).replace(/^\s+/, '');
    if (NEGATION_CLAUSE_IMPERATIVE_PATTERN.test(afterComma)) return false;
  }
  return true;
}

/** A mention authorizes only where the user states it literally: quoted text, expansions and
 * negations in the mention's own clause describe an executor without requesting it. The
 * sentence starts after punctuation or a contrast word (`but`, `instead`, `rather`), and the
 * last negation reaches the mention unless a comma closes its clause by naming an executor
 * before it and starting a new imperative after it. So `do not, under any circumstances, use
 * cli-devin` and `do not use opencode, codex, or cli-devin` stay negated, while `not opencode,
 * use cli-devin` ends the negation at the comma. */
function isUsableMention(userText: string, mentionIndex: number): boolean {
  let sentenceStart = Math.max(
    userText.lastIndexOf('\n', mentionIndex),
    userText.lastIndexOf(';', mentionIndex),
    userText.lastIndexOf('.', mentionIndex),
    userText.lastIndexOf('!', mentionIndex),
    userText.lastIndexOf('?', mentionIndex),
  ) + 1;
  const beforeMention = userText.slice(0, mentionIndex);
  const contrastWordPattern = /\b(?:but|instead|rather)\b/gi;
  for (let match = contrastWordPattern.exec(beforeMention); match; match = contrastWordPattern.exec(beforeMention)) {
    sentenceStart = Math.max(sentenceStart, match.index + match[0].length);
  }
  const preceding = userText.slice(sentenceStart, mentionIndex);
  // An apostrophe inside a word (`don't`) is a contraction, not a quote delimiter.
  const quoteProbe = userText.replace(/(?<=\w)'(?=\w)/g, '_');
  return !isInsideQuote(quoteProbe, mentionIndex) &&
    !isInsideExpansion(userText, mentionIndex) &&
    !negationReachesMention(preceding);
}

function hasExplicitModeOverride(userText: string, skill: string): boolean {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?:^|[^A-Za-z0-9_-])${escapedSkill}(?:$|[^A-Za-z0-9_-])`, 'g');
  let cursor = 0;
  while (cursor < userText.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(userText);
    if (!match) return false;
    const mentionIndex = match.index + (match[0].startsWith(skill) ? 0 : match[0].length - skill.length - 1);
    const start = tokenStart(userText, mentionIndex);
    const token = userText.slice(start, mentionIndex + skill.length);
    const usable = isUsableMention(userText, mentionIndex) &&
      !token.includes('=') &&
      !token.startsWith('$');
    if (usable) return true;
    cursor = match.index + match[0].length;
  }
  return false;
}

function deepLoopExecutors(userText: string): string[] {
  const executors: string[] = [];
  DEEP_LOOP_EXECUTOR_PATTERN.lastIndex = 0;
  for (let match = DEEP_LOOP_EXECUTOR_PATTERN.exec(userText); match; match = DEEP_LOOP_EXECUTOR_PATTERN.exec(userText)) {
    const deepIndex = match.index + match[0].indexOf('/deep:');
    if (isUsableMention(userText, deepIndex)) executors.push(match[1]);
  }
  DEEP_LOOP_EXECUTOR_PATTERN.lastIndex = 0;
  return executors;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Returns true only for a Pi bash dispatch that has no explicit user-level exemption. */
export function shouldDenyPiDispatch(input: PiDispatchGuardInput = {}): boolean {
  if (input.runtime !== PI_RUNTIME || input.toolName !== 'bash' || typeof input.command !== 'string') return false;
  if (input.inspectionKind === 'none') return false;
  if (input.inspectionKind === 'ambiguous') return true;
  if (typeof input.dispatchSkill !== 'string' || !input.dispatchSkill) return input.inspectionKind === 'direct';
  if (input.inspectionKind === 'direct' && input.inspectedExecutor !== input.dispatchSkill) return true;

  const userText = stripInjectedContent(typeof input.userText === 'string' ? input.userText.slice(0, MAX_CAPTURED_USER_TEXT) : '');
  if (userText.length === 0) return true;

  const deepExecutors = deepLoopExecutors(userText);
  if (deepExecutors.length > 0) return !deepExecutors.every((executor) => executor === input.dispatchSkill);
  return !hasExplicitModeOverride(userText, input.dispatchSkill);
}

async function loadDispatchModules(): Promise<{
  lint: typeof import('../../.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs');
  audit: typeof import('../../.skilled/hooks/dispatch/lib/dispatch-audit.mjs');
}> {
  try {
    const [lint, audit] = await Promise.all([
      import('../../.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs'),
      import('../../.skilled/hooks/dispatch/lib/dispatch-audit.mjs'),
    ]);
    return { lint, audit };
  } catch {
    const [lint, audit] = await Promise.all([
      import('../lib/dispatch-rule-checks.mjs'),
      import('../lib/dispatch-audit.mjs'),
    ]);
    return { lint, audit };
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

/** Blocks or warns on a bash dispatch command that violates a target skill's hard rules. */
export default function dispatchPreflightLint(pi: ExtensionAPI): void {
  if (!isHookEnabled('dispatch-guard')) return undefined;
  pi.on('input', (event, ctx) => {
    try {
      if (event.source === 'interactive' || event.source === 'rpc') {
        captureInitialPiUserInput(event.text, sessionIdFromContext(ctx));
      }
    } catch {
      // A failed capture cannot authorize a dispatch and must not alter the turn.
    }
    return { action: 'continue' };
  });

  pi.on('tool_call', async (event, ctx) => {
    try {
      if (event.toolName !== 'bash' || typeof event.input.command !== 'string') return;

      const { lint, audit } = await loadDispatchModules();
      const command: string = event.input.command;
      const inspection = audit.inspectDispatch(command);
      const resolved = audit.resolveDispatchPackets(command);

      // `inspectDispatch` reads the command word, so a wrapper (`command`, `nohup`,
      // `perl -e ... --`) in front of `codex exec` or `opencode run`, or a heredoc a shell
      // runs, reads as none. The resolver unwraps those layers and names the packet, so one
      // resolved packet under a none reading is that single direct dispatch; zero packets or
      // several leave it ambiguous. Only a none reading is upgraded: an ambiguous reading is
      // never upgraded, whatever the resolver found.
      const effectiveKind = ((): 'direct' | 'ambiguous' | 'none' => {
        if (inspection.kind === 'none') {
          if (resolved.length === 1) return 'direct';
          return resolved.length > 1 ? 'ambiguous' : 'none';
        }
        if (inspection.kind === 'ambiguous') return 'ambiguous';
        return resolved.some((packet) => packet.skill !== inspection.executor) ? 'ambiguous' : 'direct';
      })();
      if (effectiveKind === 'none') return;

      const dispatchSkill = effectiveKind === 'direct'
        ? (inspection.kind === 'direct' ? inspection.executor : resolved[0].skill)
        : null;
      const denied = shouldDenyPiDispatch({
        runtime: PI_RUNTIME,
        toolName: event.toolName,
        command,
        dispatchSkill,
        inspectedExecutor: dispatchSkill,
        inspectionKind: effectiveKind,
        userText: currentUserText(ctx),
      });
      if (denied) {
        if (effectiveKind !== 'direct') {
          return {
            block: true,
            reason: 'Pi dispatch denied: the command does not prove one direct executor. Call one executor by its literal name, such as `pi -p` or `codex exec`, not through a variable or alias, and name that executor in the user request.',
          };
        }
        return {
          block: true,
          reason: `Pi dispatch denied for ${dispatchSkill}. Name the matching executor in the user request.`,
        };
      }

      // Every resolved packet answers to its own rules, so a chain gets one verdict per
      // executor instead of the first packet's rule set standing in for the whole command.
      const verdicts = lint.evaluateDispatch(command, join(ctx.cwd, '.skilled', 'skills'));
      const blocking = verdicts
        .map((verdict) => ({
          skill: verdict.skill,
          violations: verdict.violations.filter((violation) => violation.severity === 'block'),
        }))
        .filter((verdict) => verdict.violations.length > 0);
      if (blocking.length > 0) {
        return {
          block: true,
          reason: blocking
            .map(({ skill, violations }) => `Dispatch blocked by ${skill} hard-rule(s):\n` +
              violations.map((violation) => `  • [${violation.id}] ${violation.message}`).join('\n'))
            .join('\n'),
        };
      }

      const warnings = verdicts
        .map((verdict) => ({
          skill: verdict.skill,
          violations: verdict.violations.filter((violation) => violation.severity === 'warn'),
        }))
        .filter((verdict) => verdict.violations.length > 0);
      if (warnings.length > 0) {
        return {
          reason: warnings
            .map(({ skill, violations }) => `Dispatch advisory for ${skill}:\n` +
              violations.map((violation) => `  • [${violation.id}] ${violation.message}`).join('\n'))
            .join('\n'),
        };
      }
    } catch {
      // A dispatch lint failure must not block unrelated work or create an authorization allow.
      return undefined;
    }
    return undefined;
  });
}
