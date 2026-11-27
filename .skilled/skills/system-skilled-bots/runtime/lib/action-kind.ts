// ───────────────────────────────────────────────────────────────────
// MODULE: Action Kinds
// ───────────────────────────────────────────────────────────────────
//
// A bot that parks a question is asking to do something, and this module
// names which kind of thing, so the gate and the answer agree on what a
// delete is. The kinds come in a fixed order and the earliest kind found
// anywhere in the question wins, so a payment that also deletes reads as
// pay.

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

// The order is the rule that ranks them: the first kind found wins.
/** The six kinds a question can name, in the order that ranks them. */
export const ACTION_KINDS = ['pay', 'credentials', 'delete', 'send', 'share', 'post'] as const;

/** The kind a question with no recognisable word falls back to. */
export const ACTION_KIND_FALLBACK = 'other' as const;

/** Every kind a grant may hold, with the fallback last. */
export const ALL_ACTION_KINDS = [...ACTION_KINDS, ACTION_KIND_FALLBACK] as const;

/** One kind of action a parked question asks for. */
export type ActionKind = (typeof ALL_ACTION_KINDS)[number];

/** The longest `action` a grant stores. */
export const ACTION_MAX = 120;

/** The words that name each kind, matched as whole words against a lower-cased question. */
export const ACTION_WORDS: Readonly<Record<(typeof ACTION_KINDS)[number], readonly string[]>> = {
  pay: [
    'pay', 'payment', 'buy', 'purchase', 'checkout', 'refund', 'transfer', 'payout', 'withdraw',
    'withdrawal', 'charge', 'order', 'invoice', 'payroll', 'subscribe', 'subscription', 'upgrade',
    'downgrade', 'plan change',
  ],
  credentials: [
    'password', 'passphrase', 'credential', 'credentials', 'two-factor', '2fa', 'api key',
    'secret key', 'access token', 'security setting', 'sign in as',
  ],
  delete: ['delete', 'trash', 'destroy', 'erase', 'purge', 'wipe', 'discard', 'remove', 'archive'],
  send: ['send', 'reply', 'forward', 'respond', 'notify', 'broadcast', 'invite', 'comment', 'message', 'email'],
  share: [
    'share', 'sharing', 'shared link', 'permission', 'permissions', 'collaborator', 'collaborators',
    'grant access', 'add people',
  ],
  post: ['post', 'publish', 'tweet', 'repost', 'release', 'go live'],
};

// ───────────────────────────────────────────────────────────────────
// 2. PATTERNS
// ───────────────────────────────────────────────────────────────────

const REGEX_METACHARACTERS = /[.*+?^${}()|[\]\\]/g;

/** The longest part of a declared kind a refusal detail repeats, so a long token never fills a log line. */
const DECLARED_DETAIL_MAX = 40;

/** A declaration token, matched anywhere because a parked question is one line. */
const ACTION_TOKEN = /\[ACTION:\s*([^\]\r\n]*?)\s*\]/gi;

function escapeMetacharacters(part: string): string {
  return part.replace(REGEX_METACHARACTERS, '\\$&');
}

/**
 * Build the whole-word pattern for one entry. A space in the entry makes it a
 * phrase, so its parts may be separated by one space or one hyphen. A hyphen
 * inside an entry stays literal.
 */
function wordPattern(entry: string): RegExp {
  const body = entry.split(' ').map(escapeMetacharacters).join('[ -]');
  return new RegExp(`(?<![a-z])${body}(?![a-z])`);
}

const ACTION_PATTERNS = new Map<(typeof ACTION_KINDS)[number], readonly RegExp[]>(
  ACTION_KINDS.map((kind) => [kind, ACTION_WORDS[kind].map(wordPattern)] as const),
);

// ───────────────────────────────────────────────────────────────────
// 3. CLASSIFY
// ───────────────────────────────────────────────────────────────────

/** Keep the question verbatim, including any declaration token, clipped to what a grant stores. */
export function clipAction(question: string): string {
  return question.slice(0, ACTION_MAX);
}

/** The stricter kind is the earlier one, so a declaration can raise a kind and never lower it. */
export function stricterKind(a: ActionKind, b: ActionKind): ActionKind {
  return ALL_ACTION_KINDS.indexOf(a) <= ALL_ACTION_KINDS.indexOf(b) ? a : b;
}

/**
 * Classify a parked question into the kind of action it asks for. Every token
 * is stripped before the scan, so a declaration's own words never feed the
 * word lists.
 *
 * @param question - The question as the bot parked it, declaration tokens included.
 * @returns The kind, or the refusal naming a declaration outside the seven.
 */
export function classifyAction(question: string): Result<ActionKind> {
  const tokens = [...question.matchAll(ACTION_TOKEN)];

  let declared: ActionKind | null = null;
  if (tokens.length > 0) {
    const value = tokens[0][1].trim().toLowerCase();
    if (!(ALL_ACTION_KINDS as readonly string[]).includes(value)) {
      return { ok: false, reason: 'action-kind-invalid', detail: value.slice(0, DECLARED_DETAIL_MAX) };
    }
    declared = value as ActionKind;
  }

  const text = question.replace(ACTION_TOKEN, ' ').toLowerCase();
  const found = ACTION_KINDS.find((kind) =>
    (ACTION_PATTERNS.get(kind) ?? []).some((pattern) => pattern.test(text)),
  );
  const classified = found ?? ACTION_KIND_FALLBACK;

  if (declared === null) return { ok: true, value: classified };
  // The declaration is a floor and never an override, so the stricter kind wins.
  return { ok: true, value: stricterKind(declared, classified) };
}
