// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Dispatch Preflight Lint
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { join } from 'node:path';

import { executorSkill } from '../../.skilled/hooks/dispatch/lib/dispatch-audit.mjs';
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
// A mention authorizes only inside a sentence that carries no negation or refusal word, before
// or after it. `anything but`, `everything but` and `all but` name the mention only as the thing
// to avoid, so they refuse in the same way a negation word does. The list nouns (`prohibition`,
// `blocklist`, `denylist`) refuse without any verb, and `w/o` refuses because a reader expands
// it to `without`; it is matched as a token, so the slash is never read as a word boundary.
const REFUSAL_PATTERN = /\b(?:\w*n't|do not|don'?t|dont|never|avoid|avoids|avoided|avoiding|without|not|cannot|can not|must not|mustn't|should not|shouldn't|will not|won't|stop|stops|stopped|stopping|skip|skips|skipped|skipping|refuse|refuses|refused|refusing|ban|bans|banned|banning|drop|drops|dropped|dropping|forget|forgets|forgot|forgetting|exclude|excludes|excluded|excluding|forbid|forbids|forbade|forbidding|forbidden|prohibit|prohibits|prohibited|prohibiting|disallow|disallows|disallowed|disallowing|block|blocks|blocked|blocking|prevent|prevents|prevented|preventing|reject|rejects|rejected|rejecting|deny|denies|denied|denying|veto|vetoes|vetoed|vetoing|cease|ceases|ceased|ceasing|quit|quits|quitting|nobody|no one|none|no|nor|neither|instead of|rather than|except|other than|apart from|aside from|besides|off-limits|off limits|anything but|everything but|all but|prohibition|prohibitions|blocklist|blocklisted|blacklist|blacklisted|denylist|denylisted|w\/o|nope|nah|scratch that|never mind|cancel|cancelled|canceled)\b/i;
const EXECUTOR_NAME_SOURCE = '(?:cli-[\\w-]+|cursor-agent|opencode|claude|codex|devin|cursor|pi|hermes|jev)';
// The only sentences that both refuse and still authorize: `not <other>, use <executor>` and
// `not <other> but <executor>`, matched whole so a further clause or list item refuses again.
// The refused name is any single word, because the registry below decides which words are
// executor spellings (`opencode2`, `cli-jev`) and which are not.
const RESET_FORM_PATTERN = new RegExp(`^not\\s+(\\S+)\\s*(?:,\\s*use\\s+|but\\s+)(\\S.*)$`, 'i');
// A mention authorizes the name its token ends with: a `/deep:` phrase ends with the `cli-*`
// its `--executor` value names.
const MENTION_EXECUTOR_PATTERN = new RegExp(`(${EXECUTOR_NAME_SOURCE})$`, 'i');
// A sentence ends only at `.`, `!` or `?` followed by whitespace and an upper-case letter, so an
// abbreviation (`i.e.`, `e.g.`, `etc.`), a semicolon or a line break cannot cut a refusal off
// from the mention it governs.
const SENTENCE_TERMINATOR_PATTERN = /[.!?](?=\s+[A-Z])/;
const DEEP_LOOP_EXECUTOR_PATTERN = /(?:^|\s)\/deep:\S+[^\n]*?\s--executor(?:=|\s+)(cli-[\w-]+)/gi;
// The end of a `/deep:` mention is the end of its executor value, not the end of `/deep:`.
const DEEP_LOOP_PHRASE_END_PATTERN = /^\/deep:\S+[^\n]*?\s--executor(?:=|\s+)(?:cli-[\w-]+)/i;
// Only these contraction words are prose; any other in-word apostrophe is a shell quote.
const CONTRACTION_PATTERNS = [
  /(?<=\b(?:i|you|we|they|he|she|it|that|there|here|what|who|where|how|when|let))'(?=(?:s|re|ve|ll|d|m)\b)/gi,
  /(?<=\b(?:don|doesn|didn|isn|aren|wasn|weren|hasn|haven|hadn|won|can|couldn|shouldn|wouldn|mustn|mightn|needn|ain|shan))'(?=t\b)/gi,
];

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
  // A marker inside an open quote or substitution is the operator's own text, not a turn
  // boundary, so the text is refused rather than cut there.
  if (lastUserTurn !== -1) {
    const suffix = cleaned.slice(lastUserTurn + '[user]'.length);
    if (isEnclosedInAnyReading(cleaned, lastUserTurn)) return '';
    if (suffix.trim()) cleaned = suffix;
  }
  return cleaned;
}

/** POSIX quoting decides what each character means, and each context has its own rules, so the
 * scan keeps one frame per open context and reads every character the way the frame on top of
 * the stack reads it: inside single quotes only the closing quote is special, inside double
 * quotes a backslash escapes only `$`, a backtick, a quote, a backslash or a newline, inside a
 * substitution a bare `(` nests while a `)` closes, and inside a brace only `}` closes. A
 * backtick, a `$(` and a `${` start a fresh context even inside double quotes, so the double
 * quote around them resumes only once that context closes. A brace nests the way a substitution
 * does, so a quote inside `${...}` opens a context of its own instead of pairing with the quote
 * around it, and a mention the shell still reads inside that span is not passed as plain text.
 * Carrying the contexts as a stack is what reproduces that resume; a single flat quote flag
 * instead lets a quoted `)` inside the inner context close the outer span, and a mention the
 * shell still reads inside a substitution is then wrongly allowed. A `case` word at a word start
 * inside a substitution or a parenthesised span makes the structure unresolvable, because its
 * pattern's `)` cannot be told from the closer that ends the span, and that reading fails closed;
 * a `)` ends a word, so a word start follows one just as it follows whitespace or an operator.
 * When `comments` is true, a `#` at a word start opens a comment that runs to the next newline,
 * and inside a backtick context to the nearer of that newline and the closing backtick, while a
 * `#` inside `${...}` is literal; the comment is not a frame, so a mention the shell drops as a
 * comment is not enclosed, while one the comment line leaves inside an open span still is.
 * Structure the scan cannot resolve fails closed: an unclosed context, or a nesting no real
 * command line reaches, counts as enclosing so a mention is refused rather than guessed. The one
 * exception is a single trailing `'` opened after the mention, because a prose apostrophe such as
 * `users'` opens a span nothing ever closes; a mention that apostrophe already encloses is still
 * refused. */
function isEnclosedOrUnresolved(text: string, index: number, comments: boolean): boolean {
  type Frame = 'sub' | 'paren' | 'tick' | 'dq' | 'sq' | 'brace';
  const stack: Frame[] = [];
  let enclosed = false;
  let recorded = false;
  const record = (position: number): void => {
    if (recorded || position < index) return;
    enclosed = stack.length > 0;
    recorded = true;
  };
  const open = (frame: Frame): boolean => {
    stack.push(frame);
    return stack.length > 32;
  };
  let cursor = 0;
  while (cursor < text.length) {
    record(cursor);
    const top = stack[stack.length - 1];
    const character = text[cursor];
    const following = text[cursor + 1];
    if (top === 'sq') {
      if (character === '\'') stack.pop();
      cursor += 1;
      continue;
    }
    if (comments && character === '#' && top !== 'dq' && top !== 'brace' &&
      (cursor === 0 || /[\s;&|()`]/.test(text[cursor - 1]))) {
      const newline = text.indexOf('\n', cursor);
      let commentEnd = newline === -1 ? text.length : newline;
      if (top === 'tick') {
        const backtick = text.indexOf('`', cursor);
        if (backtick !== -1 && backtick < commentEnd) commentEnd = backtick;
      }
      while (cursor < commentEnd) {
        record(cursor);
        cursor += 1;
      }
      continue;
    }
    if (character === '$' && following === '(') {
      if (open('sub')) return true;
      record(cursor + 1);
      cursor += 2;
      continue;
    }
    if (character === '$' && following === '{') {
      if (open('brace')) return true;
      record(cursor + 1);
      cursor += 2;
      continue;
    }
    if (character === '\\') {
      const literalBackslash = top === 'dq' && following !== '$' && following !== '`' &&
        following !== '"' && following !== '\\' && following !== '\n';
      if (literalBackslash) {
        cursor += 1;
        continue;
      }
      record(cursor + 1);
      cursor += 2;
      continue;
    }
    if (character === '`') {
      if (top === 'tick') stack.pop();
      else if (open('tick')) return true;
      cursor += 1;
      continue;
    }
    if (character === '"') {
      if (top === 'dq') stack.pop();
      else if (open('dq')) return true;
      cursor += 1;
      continue;
    }
    if (character === '\'' && top !== 'dq') {
      if (open('sq')) return true;
      cursor += 1;
      continue;
    }
    if (top === 'brace') {
      if (character === '}') stack.pop();
      cursor += 1;
      continue;
    }
    if (top === 'sub' || top === 'paren') {
      if (text.startsWith('case', cursor) && (cursor === 0 || /[\s;&|()]/.test(text[cursor - 1])) &&
        /\s/.test(text[cursor + 4] ?? '')) {
        return true;
      }
      if (character === '(') {
        if (open('paren')) return true;
      } else if (character === ')') {
        stack.pop();
      }
    }
    cursor += 1;
  }
  if (enclosed) return true;
  return stack.length > 0 && !(stack.length === 1 && stack[0] === 'sq');
}

function tokenStart(text: string, index: number): number {
  let cursor = index;
  while (cursor > 0 && !/[\s;|&]/.test(text[cursor - 1])) cursor -= 1;
  return cursor;
}

function mentionTokenEnd(text: string, mentionIndex: number): number {
  const deepPhrase = DEEP_LOOP_PHRASE_END_PATTERN.exec(text.slice(mentionIndex));
  if (deepPhrase) return mentionIndex + deepPhrase[0].length;
  let end = mentionIndex;
  while (end < text.length && !/\s/.test(text[end])) end += 1;
  return end;
}

/** The sentence a mention sits in. Only a terminator followed by whitespace and an upper-case
 * letter starts a new sentence, so abbreviations, semicolons and line breaks keep the mention in
 * the sentence that carries its refusal. */
function mentionSentence(text: string, mentionIndex: number): string {
  const terminators = new RegExp(SENTENCE_TERMINATOR_PATTERN.source, 'g');
  let start = 0;
  let end = text.length;
  for (let match = terminators.exec(text); match; match = terminators.exec(text)) {
    if (match.index < mentionIndex) {
      start = match.index + 1;
      continue;
    }
    end = match.index;
    break;
  }
  return text.slice(start, end);
}

/** The sentence after the mention's own sentence, or `''` when the mention's sentence is the last
 * one. It reads the same terminator `mentionSentence` does, so only a refusal in the sentence that
 * follows the mention can retract it and a refusal further away cannot. */
function followingSentence(text: string, mentionIndex: number): string {
  const terminators = new RegExp(SENTENCE_TERMINATOR_PATTERN.source, 'g');
  let start = -1;
  for (let match = terminators.exec(text); match; match = terminators.exec(text)) {
    if (match.index < mentionIndex) continue;
    start = match.index + 1;
    break;
  }
  if (start === -1) return '';
  let end = text.length;
  for (let match = terminators.exec(text); match; match = terminators.exec(text)) {
    end = match.index;
    break;
  }
  return text.slice(start, end);
}

/** The skills a sentence names, one entry per executor spelling the registry resolves. A word it
 * does not map contributes nothing, so an unknown `cli-` word cannot stand in for a named
 * executor. Every alias spelling resolves to the one skill it belongs to, which is what lets a
 * retraction compare names rather than spellings. */
function namedSkills(sentence: string): Set<string> {
  const skills = new Set<string>();
  for (const word of sentence.split(/[^\w-]+/)) {
    if (word === '') continue;
    const skill = executorSkill(word);
    if (skill !== null) skills.add(skill);
  }
  return skills;
}

/** The skill a mention authorizes: the executor its token ends with, after the punctuation that
 * closed the sentence is set aside. A token whose ending the registry does not resolve leaves the
 * mention with no skill, so a retraction cannot prove it names another executor. */
function mentionSkill(mentionToken: string): string | null {
  const token = mentionToken.replace(/[^\w-]+$/, '');
  return executorSkill(MENTION_EXECUTOR_PATTERN.exec(token)?.[1] ?? token);
}

/** True only for a whole sentence that is `not <other>, use <mention>` or `not <other> but <mention>`
 * where the two names resolve to different executors. Every spelling of one executor (`claude`,
 * `claude-code`, `cli-claude-code`) resolves to one skill, so refusing any spelling refuses the
 * mention: the reset never crosses between aliases. A name the registry does not map proves no
 * different executor, so it fails closed. */
function isResetForm(sentence: string, mentionToken: string): boolean {
  const match = RESET_FORM_PATTERN.exec(sentence);
  if (!match) return false;
  if (match[2].trim().toLowerCase() !== mentionToken.trim().toLowerCase()) return false;
  const mentioned = MENTION_EXECUTOR_PATTERN.exec(mentionToken)?.[1] ?? mentionToken;
  const otherSkill = executorSkill(match[1]);
  const mentionedSkill = executorSkill(mentioned);
  return otherSkill !== null && mentionedSkill !== null && otherSkill !== mentionedSkill;
}

// Operator text is not known to be shell, and each reading can pair quotes the other cannot, so
// the scan runs with comment handling off and on, and with curly quotes read as quotes and as the
// literal characters a shell sees. A mention any reading encloses is refused. Only a contraction
// from the prose list is neutralized, so `foo'cli-devin'` still quotes the mention and so does a
// possessive such as `file's`.
function isEnclosedInAnyReading(userText: string, index: number): boolean {
  const withoutContractions = (value: string): string =>
    CONTRACTION_PATTERNS.reduce((probe, pattern) => probe.replace(pattern, '_'), value);
  const quoteProbe = withoutContractions(userText.replace(/[“”„‟]/g, '"').replace(/[‘’‚‛]/g, "'"));
  const shellProbe = withoutContractions(userText);
  return [quoteProbe, shellProbe].some((probe) => isEnclosedOrUnresolved(probe, index, false) ||
    isEnclosedOrUnresolved(probe, index, true));
}

/** A mention authorizes only inside a sentence that carries no negation or refusal word, before
 * or after it; `not <other>, use <executor>` and `not <other> but <executor>` are the only
 * exceptions. A false deny is accepted, so `use cli-devin, it is not forbidden` stays refused:
 * the operator writes the request as its own sentence. The operator can also withdraw a request
 * one sentence later, so the one sentence that follows the mention's own is read too: when it
 * carries a refusal and either names no executor or names the mention's own executor, the mention
 * is not usable. Only that one sentence is read, and a refusal there that names only other
 * executors governs those names instead, so `Use cli-devin. Never use codex.` stays a request for
 * `cli-devin` while `Use cli-devin. Never use devin.` does not: both spellings are one skill. A
 * mention whose own skill cannot be resolved is retracted too, so the rule fails closed. Every
 * curly and low quote reads as the straight quote it stands in for, so a mention the operator
 * quoted is refused whichever form the pair mixes, and an apostrophe that ends a contraction is
 * not a delimiter. The substitution swaps one character for one character, so indexes into the
 * original text still address the same characters. */
function isUsableMention(userText: string, mentionIndex: number): boolean {
  const text = userText.replace(/[“”„‟]/g, '"').replace(/[‘’‚‛]/g, "'");
  if (isEnclosedInAnyReading(userText, mentionIndex)) return false;
  const sentence = mentionSentence(text, mentionIndex).trim();
  if (REFUSAL_PATTERN.test(sentence)) {
    if (!isResetForm(sentence, text.slice(mentionIndex, mentionTokenEnd(text, mentionIndex)))) return false;
  }
  const retraction = followingSentence(text, mentionIndex).trim();
  if (retraction === '' || !REFUSAL_PATTERN.test(retraction)) return true;
  const mention = mentionSkill(text.slice(mentionIndex, mentionTokenEnd(text, mentionIndex)));
  if (mention === null) return false;
  const retracted = namedSkills(retraction);
  return retracted.size > 0 && !retracted.has(mention);
}

function hasExplicitModeOverride(userText: string, skill: string): boolean {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?:^|[^A-Za-z0-9_-])${escapedSkill}(?:$|[^A-Za-z0-9_-])`, 'g');
  let cursor = 0;
  while (cursor < userText.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(userText);
    if (!match) return false;
    // The match spans one separator plus the skill, and the trailing separator is absent at the
    // end of the text, so the skill's own offset is the only stable way to its first character.
    const mentionIndex = match.index + match[0].indexOf(skill);
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
    // A quote or substitution can open between `/deep:` and its executor value, so the value's
    // own position must be plain text as well.
    const executorIndex = match.index + match[0].lastIndexOf(match[1]);
    if (isUsableMention(userText, deepIndex) && !isEnclosedInAnyReading(userText, executorIndex)) {
      executors.push(match[1]);
    }
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
