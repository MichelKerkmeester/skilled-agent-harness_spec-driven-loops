// ───────────────────────────────────────────────────────────────────
// MODULE: launchd Label Grammar
// ───────────────────────────────────────────────────────────────────
//
// Every repository installs into the same per-user agents folder, so a label
// built from the bot id alone would let two repositories overwrite each
// other's job. The label carries the repository identity, the bot id and the
// schedule index, and it parses back to them so status and the uninstall
// sweep can tell whose job a plist is. Only labels under the hub prefix
// parse, so no unrelated agent is ever mistaken for a bot.

import { BOT_ID_PATTERN } from './definition.js';
import { IDENTITY_PATTERN } from './repo-config.js';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The prefix that marks a launchd label as owned by this hub. */
export const LABEL_PREFIX = 'com.skilled.bots.';

/** The suffix of the one queue-drain agent per repository identity. */
export const DRAIN_SUFFIX = 'drain';

/** The bot id every memory proposal item carries, so a review item names a queue and never a real bot. */
export const MEMORY_PROPOSALS_BOT_ID = 'memory-proposals';

/** Bot ids a definition may not take, because a label part or a review queue already means something else. */
export const RESERVED_BOT_IDS: readonly string[] = [DRAIN_SUFFIX, MEMORY_PROPOSALS_BOT_ID];

export type ParsedLabel =
  | { kind: 'bot'; identity: string; botId: string; scheduleIndex: number }
  | { kind: 'drain'; identity: string };

const SLUG_SAFE = /[a-z0-9-]/;
const SLUG_PATTERN = /^(?:[a-z0-9-]|_[0-9a-f]{2})+$/;
const INDEX_PATTERN = /^(?:0|[1-9]\d*)$/;

// ───────────────────────────────────────────────────────────────────
// 2. IDENTITY SLUG
// ───────────────────────────────────────────────────────────────────

/**
 * Encode an identity as one dot-free label part.
 *
 * Identity is lowercased, as hosting services compare it, and every
 * character outside `[a-z0-9-]` becomes `_` plus two hex digits. `_` itself
 * is encoded, so the slug is one-to-one and decodes exactly.
 */
export function identitySlug(identity: string): string {
  let slug = '';
  for (const char of identity.toLowerCase()) {
    if (SLUG_SAFE.test(char)) {
      slug += char;
      continue;
    }
    for (const byte of Buffer.from(char, 'utf8')) slug += `_${byte.toString(16).padStart(2, '0')}`;
  }
  return slug;
}

/** Decode a slug built by identitySlug; null when it is not one. */
export function identityFromSlug(slug: string): string | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const bytes: number[] = [];
  for (let index = 0; index < slug.length;) {
    if (slug[index] === '_') {
      bytes.push(Number.parseInt(slug.slice(index + 1, index + 3), 16));
      index += 3;
    } else {
      bytes.push(slug.charCodeAt(index));
      index += 1;
    }
  }
  const identity = Buffer.from(bytes).toString('utf8');
  return identitySlug(identity) === slug ? identity : null;
}

// ───────────────────────────────────────────────────────────────────
// 3. BUILD
// ───────────────────────────────────────────────────────────────────

function checkIdentity(identity: string): Result<string> {
  if (!IDENTITY_PATTERN.test(identity)) return { ok: false, reason: 'identity-invalid', detail: 'expected owner/name' };
  return { ok: true, value: identitySlug(identity) };
}

/**
 * Build the label for one schedule of one bot.
 *
 * @param identity - The resolved `owner/name` identity.
 * @param botId - The definition's id.
 * @param scheduleIndex - Which schedule of the bot, from 0.
 * @returns The label, or `identity-invalid`, `bot-id-invalid`, `bot-id-reserved` or `schedule-index-invalid`.
 */
export function buildBotLabel(identity: string, botId: string, scheduleIndex: number): Result<string> {
  const slug = checkIdentity(identity);
  if (!slug.ok) return slug;
  if (!BOT_ID_PATTERN.test(botId)) return { ok: false, reason: 'bot-id-invalid' };
  if (RESERVED_BOT_IDS.includes(botId)) return { ok: false, reason: 'bot-id-reserved', detail: botId };
  if (!Number.isSafeInteger(scheduleIndex) || scheduleIndex < 0) return { ok: false, reason: 'schedule-index-invalid' };
  return { ok: true, value: `${LABEL_PREFIX}${slug.value}.${botId}.${scheduleIndex}` };
}

/** Build the label of a repository's queue-drain agent. */
export function buildDrainLabel(identity: string): Result<string> {
  const slug = checkIdentity(identity);
  if (!slug.ok) return slug;
  return { ok: true, value: `${LABEL_PREFIX}${slug.value}.${DRAIN_SUFFIX}` };
}

// ───────────────────────────────────────────────────────────────────
// 4. PARSE
// ───────────────────────────────────────────────────────────────────

/**
 * Parse a launchd label back to its parts.
 *
 * @returns The bot or drain parts, or `label-not-hub` for a label outside the
 *   prefix and `label-invalid` for a hub-prefixed label that does not parse.
 */
export function parseLabel(label: string): Result<ParsedLabel> {
  if (!label.startsWith(LABEL_PREFIX)) return { ok: false, reason: 'label-not-hub' };
  const parts = label.slice(LABEL_PREFIX.length).split('.');
  const identity = identityFromSlug(parts[0] ?? '');
  if (identity === null || !IDENTITY_PATTERN.test(identity)) return { ok: false, reason: 'label-invalid', detail: 'identity' };

  if (parts.length === 2 && parts[1] === DRAIN_SUFFIX) return { ok: true, value: { kind: 'drain', identity } };

  if (parts.length === 3) {
    const [, botId = '', index = ''] = parts;
    if (!BOT_ID_PATTERN.test(botId) || RESERVED_BOT_IDS.includes(botId)) {
      return { ok: false, reason: 'label-invalid', detail: 'bot id' };
    }
    if (!INDEX_PATTERN.test(index)) return { ok: false, reason: 'label-invalid', detail: 'schedule index' };
    return { ok: true, value: { kind: 'bot', identity, botId, scheduleIndex: Number(index) } };
  }
  return { ok: false, reason: 'label-invalid', detail: 'expected identity.bot-id.index or identity.drain' };
}
