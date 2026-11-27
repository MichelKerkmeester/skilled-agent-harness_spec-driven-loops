// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Link and Roster
// ───────────────────────────────────────────────────────────────────
//
// This module owns the facts that decide who a chat is and who may answer
// from one. The operators.json roster names one owner and any members, and
// only an actor it names may answer from a chat. A missing, unreadable or
// empty roster refuses every chat answer, while the terminal is the host's
// own authority and needs no roster. The roster is written only by the
// roster verbs through this module.

import { randomInt, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { normalizeActor } from './actor.js';
import { channelLockFile, CONFIGURED_CHANNELS, readChannelConfig, withStateLock, writeChannelConfig } from './channel.js';
import { channelFolder, ensureChannelState, operatorsFile, writeStateFile } from './state-root.js';

import type { ChannelResult, ConfiguredChannel } from './channel.js';

// ───────────────────────────────────────────────────────────────────
// 1. ROSTER
// ───────────────────────────────────────────────────────────────────

/** The roster's one schema version. */
export const OPERATORS_SCHEMA_VERSION = 1;

/** Who may answer from a chat: one owner and any members. */
export interface Roster {
  schemaVersion: 1;
  owner: string;
  members: string[];
}

/** The role an actor takes on the roster. */
export type RosterRole = 'owner' | 'member';

/** What the roster says about one actor. */
export type ApproverCheck = 'approver' | 'not-approver' | 'roster-missing';

/**
 * Read the operators.json roster of one identity.
 *
 * A missing, unreadable or empty roster reads as null, and the caller decides
 * what null refuses. Nothing here throws, because every answer surface reaches
 * this read and a damaged file must refuse an answer rather than crash the
 * surface that asked.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @returns The roster, or null when it is missing, unreadable or unusable.
 */
export function readRoster(stateRoot: string, identity: string): Roster | null {
  let text: string;
  try {
    text = readFileSync(operatorsFile(stateRoot, identity), 'utf8');
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

  const file = parsed as { schemaVersion?: unknown; owner?: unknown; members?: unknown };
  if (file.schemaVersion !== undefined && file.schemaVersion !== 1) return null;
  if (typeof file.owner !== 'string' || file.owner.trim() === '') return null;
  if (file.members !== undefined && !Array.isArray(file.members)) return null;

  const members: string[] = [];
  for (const entry of (file.members ?? []) as unknown[]) {
    if (typeof entry !== 'string') continue;
    const name = entry.trim();
    if (name !== '') members.push(name);
  }

  return { schemaVersion: OPERATORS_SCHEMA_VERSION, owner: file.owner.trim(), members };
}

/**
 * The one roster check every answer surface reaches.
 *
 * The answer path calls it with the actor it holds, and the actor comes from a
 * link record or the host, never from a chat message. Case is significant, so
 * `Ada` and `ada` are two different actors.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param actor - The actor the caller holds, or null when it holds none.
 * @returns Whether the roster names the actor, or that there is no roster.
 */
export function isApprover(stateRoot: string, identity: string, actor: string | null): ApproverCheck {
  const roster = readRoster(stateRoot, identity);
  if (roster === null) return 'roster-missing';
  if (actor === null) return 'not-approver';
  const name = actor.trim();
  if (name === roster.owner) return 'approver';
  return roster.members.includes(name) ? 'approver' : 'not-approver';
}

/**
 * Add an owner or a member to the roster.
 *
 * An owner add replaces a damaged roster, because that verb is how the operator
 * repairs one. Handing the host over keeps the members exactly as they were, so
 * it never promotes or drops anyone.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param actor - The name to add.
 * @param role - Whether the name becomes the owner or a member.
 * @returns Whether the roster was written, or a named refusal.
 */
export function rosterAdd(
  stateRoot: string,
  identity: string,
  actor: string,
  role: RosterRole,
): ChannelResult<{ written: boolean }> {
  const name = normalizeActor(actor);
  if (name === null) return { ok: false, reason: 'actor-invalid', detail: 'the roster takes a name' };

  const roster = readRoster(stateRoot, identity);

  if (role === 'owner') {
    if (roster !== null && roster.owner === name) return { ok: true, value: { written: false } };
    const next: Roster = {
      schemaVersion: OPERATORS_SCHEMA_VERSION,
      owner: name,
      members: roster === null ? [] : roster.members,
    };
    writeStateFile(operatorsFile(stateRoot, identity), next);
    return { ok: true, value: { written: true } };
  }

  if (roster === null) return { ok: false, reason: 'channel-roster-missing', detail: 'add an owner first' };
  if (roster.owner === name || roster.members.includes(name)) return { ok: true, value: { written: false } };

  const next: Roster = {
    schemaVersion: OPERATORS_SCHEMA_VERSION,
    owner: roster.owner,
    members: [...roster.members, name],
  };
  writeStateFile(operatorsFile(stateRoot, identity), next);
  return { ok: true, value: { written: true } };
}

/**
 * Remove a member from the roster.
 *
 * The owner is refused rather than removed, because a roster with no owner
 * would leave the host with no one to hand it to. Every other member keeps its
 * place in the order.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param actor - The name to remove.
 * @returns Whether a member was removed, or a named refusal.
 */
export function rosterRemove(
  stateRoot: string,
  identity: string,
  actor: string,
): ChannelResult<{ removed: boolean }> {
  const name = normalizeActor(actor);
  if (name === null) return { ok: false, reason: 'actor-invalid', detail: 'the roster takes a name' };

  const roster = readRoster(stateRoot, identity);
  if (roster === null) return { ok: true, value: { removed: false } };
  if (roster.owner === name) {
    return { ok: false, reason: 'channel-roster-owner', detail: `${name} is the owner` };
  }
  if (!roster.members.includes(name)) return { ok: true, value: { removed: false } };

  const next: Roster = {
    schemaVersion: OPERATORS_SCHEMA_VERSION,
    owner: roster.owner,
    members: roster.members.filter((member) => member !== name),
  };
  writeStateFile(operatorsFile(stateRoot, identity), next);
  return { ok: true, value: { removed: true } };
}

// ───────────────────────────────────────────────────────────────────
// 2. LINK RECORDS AND THE PAIRING CODE
// ───────────────────────────────────────────────────────────────────

/** How long a pairing code links a chat, five minutes from the link verb. */
export const LINK_CODE_TTL_MS = 5 * 60 * 1000;

/** The longest secret name the vault grammar holds. */
export const SECRET_NAME_MAX = 64;

/** The longest whatsapp secret name, because its longest derived suffix, -phone-number-id, adds 16 characters. */
export const WHATSAPP_SECRET_MAX = 48;

/** One chat bound to the person who ran the link verb and to the sender who sent the code. */
export interface LinkRecord { channel: ConfiguredChannel; chatId: string; senderId: string; actor: string; linkedAt: string; }

/** A code waiting for a chat to send it. failures counts the wrong codes sent against it from every chat of the channel. */
export interface PendingCode { code: string; actor: string; expiresAt: string; failures: number; }

/** Wrong codes from one chat that has no link. lockedUntil is null until the chat is locked. */
export interface Lockout { failures: number; lockedUntil: string | null; }

/** The links.json file: every link, every pending code and every lockout of one identity. */
export interface LinksFile {
  schemaVersion: 1;
  links: Record<string, LinkRecord>;
  codes: Partial<Record<ConfiguredChannel, PendingCode>>;
  lockouts: Record<string, Lockout>;
}

/**
 * The links.json file of one identity. Creates nothing.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 */
export function linksFile(stateRoot: string, identity: string): string {
  return join(channelFolder(stateRoot, identity), 'links.json');
}

/**
 * The key one chat's link is stored under, so a lookup never scans the file.
 *
 * @param channel - The transport the chat belongs to.
 * @param chatId - The provider's chat id.
 */
export function linkKey(channel: ConfiguredChannel, chatId: string): string {
  return `${channel}:${chatId}`;
}

/** Whether a parsed value is a plain object, the only shape a links.json section may take. */
function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * The links.json file of one identity, read by this module alone.
 *
 * A missing file reads as an empty file, so a host that linked nothing yet is
 * not an error. A file the runtime cannot trust is refused by name rather than
 * read as empty, because an empty read would silently unlink every chat. A
 * single damaged entry is dropped instead, so one bad record never costs the
 * operator the rest of the file.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @returns Every link, pending code and lockout, or a named refusal.
 */
export function readLinks(stateRoot: string, identity: string): ChannelResult<LinksFile> {
  let text: string;
  try {
    text = readFileSync(linksFile(stateRoot, identity), 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') {
      return { ok: true, value: { schemaVersion: 1, links: {}, codes: {}, lockouts: {} } };
    }
    return { ok: false, reason: 'channel-links-invalid', detail: 'unreadable' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'channel-links-invalid', detail: 'not json' };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, reason: 'channel-links-invalid', detail: 'not an object' };
  }

  const file = parsed as { schemaVersion?: unknown; links?: unknown; codes?: unknown; lockouts?: unknown };
  if (file.schemaVersion !== undefined && file.schemaVersion !== 1) {
    return { ok: false, reason: 'channel-links-invalid', detail: 'schemaVersion not 1' };
  }
  if (file.links !== undefined && !isPlainObject(file.links)) {
    return { ok: false, reason: 'channel-links-invalid', detail: 'links not an object' };
  }
  if (file.codes !== undefined && !isPlainObject(file.codes)) {
    return { ok: false, reason: 'channel-links-invalid', detail: 'codes not an object' };
  }
  if (file.lockouts !== undefined && !isPlainObject(file.lockouts)) {
    return { ok: false, reason: 'channel-links-invalid', detail: 'lockouts not an object' };
  }

  const links: Record<string, LinkRecord> = {};
  for (const [key, entry] of Object.entries((file.links ?? {}) as Record<string, unknown>)) {
    if (!isPlainObject(entry)) continue;
    const fields = entry as { channel?: unknown; chatId?: unknown; senderId?: unknown; actor?: unknown; linkedAt?: unknown };
    if (typeof fields.channel !== 'string' || !(CONFIGURED_CHANNELS as readonly string[]).includes(fields.channel)) continue;
    if (typeof fields.chatId !== 'string' || typeof fields.senderId !== 'string') continue;
    if (typeof fields.actor !== 'string' || typeof fields.linkedAt !== 'string') continue;
    links[key] = {
      channel: fields.channel as ConfiguredChannel,
      chatId: fields.chatId,
      senderId: fields.senderId,
      actor: fields.actor,
      linkedAt: fields.linkedAt,
    };
  }

  const codes: Partial<Record<ConfiguredChannel, PendingCode>> = {};
  for (const [key, entry] of Object.entries((file.codes ?? {}) as Record<string, unknown>)) {
    if (!(CONFIGURED_CHANNELS as readonly string[]).includes(key)) continue;
    if (!isPlainObject(entry)) continue;
    const fields = entry as { code?: unknown; actor?: unknown; expiresAt?: unknown; failures?: unknown };
    if (typeof fields.code !== 'string' || !/^[0-9]{6}$/.test(fields.code)) continue;
    if (typeof fields.actor !== 'string' || typeof fields.expiresAt !== 'string') continue;
    const failures = typeof fields.failures === 'number' && Number.isInteger(fields.failures) && fields.failures >= 0
      ? fields.failures
      : 0;
    codes[key as ConfiguredChannel] = { code: fields.code, actor: fields.actor, expiresAt: fields.expiresAt, failures };
  }

  const lockouts: Record<string, Lockout> = {};
  for (const [key, entry] of Object.entries((file.lockouts ?? {}) as Record<string, unknown>)) {
    if (!isPlainObject(entry)) continue;
    const fields = entry as { failures?: unknown; lockedUntil?: unknown };
    if (typeof fields.failures !== 'number' || !Number.isInteger(fields.failures) || fields.failures < 0) continue;
    lockouts[key] = {
      failures: fields.failures,
      lockedUntil: typeof fields.lockedUntil === 'string' ? fields.lockedUntil : null,
    };
  }

  return { ok: true, value: { schemaVersion: 1, links, codes, lockouts } };
}

/** Write the links.json file of one identity, owner-only, through the one writer of the channel folder. */
function writeLinks(stateRoot: string, identity: string, file: LinksFile): void {
  ensureChannelState(stateRoot, identity);
  writeStateFile(linksFile(stateRoot, identity), file);
}

/** What a link verb hands over. */
export interface StartLinkInput {
  stateRoot: string;
  identity: string;
  channel: ConfiguredChannel;
  /** The actor who ran the link verb: --as when given, the OS user otherwise. */
  actor: string | null;
  /** The secret name the channel config entry names. Absent keeps the entry's name, or uses the channel name for a new entry. */
  secret?: string | null;
  now?: Date;
}

/**
 * Start a link by minting the one-time code a chat sends back.
 *
 * The code is printed only on the host, lasts five minutes, is consumed by its
 * first use and a second link replaces the first unused code. The link records
 * the actor who ran the verb, so a later answer from that chat is attributed to
 * a person rather than to a chat.
 *
 * Every refusal happens before the first write, so a refused link leaves the
 * channel config and the links file exactly as they were.
 *
 * @param input - The identity, the channel, the actor and the optional secret name.
 * @returns The code, when it expires and the actor it will be attributed to, or a named refusal.
 */
export function startLink(input: StartLinkInput): ChannelResult<{ code: string; expiresAt: string; actor: string }> {
  const check = isApprover(input.stateRoot, input.identity, input.actor);
  if (check === 'roster-missing') {
    return { ok: false, reason: 'channel-roster-missing', detail: 'add an owner first' };
  }
  if (check === 'not-approver') {
    return { ok: false, reason: 'answer-not-approver', detail: input.actor ?? 'unknown' };
  }
  // Only a roster that names an actor answers approver, so a name is present here.
  if (input.actor === null) {
    return { ok: false, reason: 'answer-not-approver', detail: 'unknown' };
  }
  const actor = input.actor.trim();

  const secret = input.secret === undefined || input.secret === null ? null : input.secret.trim();
  if (secret !== null) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(secret)) {
      return { ok: false, reason: 'secret-name-invalid', detail: 'a secret name takes lowercase letters, digits and hyphens' };
    }
    const limit = input.channel === 'whatsapp' ? WHATSAPP_SECRET_MAX : SECRET_NAME_MAX;
    if (secret.length > limit) {
      return { ok: false, reason: 'secret-name-invalid', detail: `a ${input.channel} secret name is at most ${limit} characters` };
    }
  }

  const configured = withStateLock<ChannelResult<null>>(
    channelLockFile(input.stateRoot, input.identity, 'config'),
    () => {
      const read = readChannelConfig(input.stateRoot, input.identity);
      if (!read.ok) return read;
      const name = secret ?? read.value.channels[input.channel]?.secret ?? input.channel;
      const channels = { ...read.value.channels };
      channels[input.channel] = { secret: name, enabled: true };
      writeChannelConfig(input.stateRoot, input.identity, { schemaVersion: 1, channels });
      return { ok: true, value: null };
    },
  );
  if (!configured.ok) return configured;

  const now = input.now ?? new Date();
  const linked = withStateLock<ChannelResult<{ code: string; expiresAt: string }>>(
    channelLockFile(input.stateRoot, input.identity, 'links'),
    () => {
      const read = readLinks(input.stateRoot, input.identity);
      if (!read.ok) return read;
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
      const expiresAt = new Date(now.getTime() + LINK_CODE_TTL_MS).toISOString();
      const codes = { ...read.value.codes };
      codes[input.channel] = { code, actor, expiresAt, failures: 0 };
      writeLinks(input.stateRoot, input.identity, { ...read.value, codes });
      return { ok: true, value: { code, expiresAt } };
    },
  );
  if (!linked.ok) return linked;

  return { ok: true, value: { code: linked.value.code, expiresAt: linked.value.expiresAt, actor } };
}

/**
 * Unlink switches the channel off and removes its chats' links, and keeps the
 * entry so a later link restores its secret name.
 *
 * A pending code and a lockout are left alone, because neither is a link and a
 * lockout that outlived its link is what keeps a guessing chat out.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param channel - The transport to switch off.
 * @returns How many links were removed, or a named refusal.
 */
export function unlinkChannel(
  stateRoot: string,
  identity: string,
  channel: ConfiguredChannel,
): ChannelResult<{ removedLinks: number }> {
  const configured = withStateLock<ChannelResult<null>>(channelLockFile(stateRoot, identity, 'config'), () => {
    const read = readChannelConfig(stateRoot, identity);
    if (!read.ok) return read;
    const entry = read.value.channels[channel];
    if (entry !== undefined) {
      const channels = { ...read.value.channels };
      channels[channel] = { secret: entry.secret, enabled: false };
      writeChannelConfig(stateRoot, identity, { schemaVersion: 1, channels });
    }
    return { ok: true, value: null };
  });
  if (!configured.ok) return configured;

  const unlinked = withStateLock<ChannelResult<{ removedLinks: number }>>(
    channelLockFile(stateRoot, identity, 'links'),
    () => {
      const read = readLinks(stateRoot, identity);
      if (!read.ok) return read;
      const links: Record<string, LinkRecord> = {};
      let removedLinks = 0;
      for (const [key, record] of Object.entries(read.value.links)) {
        if (record.channel === channel) {
          removedLinks += 1;
          continue;
        }
        links[key] = record;
      }
      if (removedLinks > 0) writeLinks(stateRoot, identity, { ...read.value, links });
      return { ok: true, value: { removedLinks } };
    },
  );
  if (!unlinked.ok) return unlinked;

  return { ok: true, value: { removedLinks: unlinked.value.removedLinks } };
}

/**
 * The only place a provider-asserted sender id is compared with a link record,
 * for every event kind, a press and a typed line alike.
 *
 * A transport calls it before it emits an event and refuses a sender mismatch
 * silently, with no reply, no counter and no answer call, because the sender is
 * not the person the chat linked. It writes nothing, so a refused event leaves
 * no trace an attacker could read.
 *
 * @param stateRoot - The resolved user-level state root.
 * @param identity - An `owner/name` identity.
 * @param channel - The transport the event arrived on.
 * @param conversationId - The provider's chat id.
 * @param senderId - The provider-asserted sender id.
 * @returns The link record, or a named refusal.
 */
export function resolveLink(
  stateRoot: string,
  identity: string,
  channel: ConfiguredChannel,
  conversationId: string,
  senderId: string,
): ChannelResult<LinkRecord> {
  const read = readLinks(stateRoot, identity);
  if (!read.ok) return read;

  const record: LinkRecord | undefined = read.value.links[linkKey(channel, conversationId)];
  if (record === undefined) return { ok: false, reason: 'channel-unlinked', detail: 'no link' };
  if (record.senderId !== senderId) return { ok: false, reason: 'channel-unlinked', detail: 'sender mismatch' };
  return { ok: true, value: record };
}

// ───────────────────────────────────────────────────────────────────
// 3. PAIRING AND THE LOCKOUT
// ───────────────────────────────────────────────────────────────────

/** Wrong six-digit codes one chat may send before it is locked. */
export const MAX_PAIR_ATTEMPTS = 5;

/** How long a locked chat stays locked, in seconds. */
export const PAIR_LOCKOUT_SECS = 300;

/** What one message from a chat with no link did. */
export type PairOutcome =
  /** The chat sent the pending code and is now linked. The transport replies with the link confirmation. */
  | { kind: 'linked'; link: LinkRecord }
  /** The chat already has a link, so nothing was paired and nothing was written. */
  | { kind: 'already-linked'; link: LinkRecord }
  /** Not six digits. Nothing was counted. The transport refuses it channel-unlinked with the not-linked reply. */
  | { kind: 'not-a-code' }
  /** Six digits that were not the pending code. codesLeft is how many more wrong codes lock the chat, 4 down to 1. */
  | { kind: 'wrong-code'; codesLeft: number }
  /** The chat is locked. The transport refuses it channel-locked with the whole seconds left. */
  | { kind: 'locked'; secondsLeft: number };

/** What one message from a chat with no link hands the pairing step. */
export interface PairInput {
  stateRoot: string;
  identity: string;
  channel: ConfiguredChannel;
  /** The provider's chat id. */
  chatId: string;
  /** The provider-asserted sender id, which the link records. */
  senderId: string;
  /** The message text as the chat sent it. */
  text: string;
  now?: Date;
}

/**
 * Pair a chat that has no link by the code it sends back.
 *
 * An unlinked chat is denied by default. The lockout lives in links.json, so a
 * restart neither clears a lock nor revives an expired code. Wrong codes are
 * counted per chat because no actor exists before a link, and a linked actor's
 * later refusals are counted elsewhere per actor, so one person's failures
 * never lock a shared chat for the others.
 *
 * @param input - The identity, the channel, the chat, the sender and the message text.
 * @returns What the message did, or a named refusal.
 */
export function pairChat(input: PairInput): ChannelResult<PairOutcome> {
  return withStateLock<ChannelResult<PairOutcome>>(
    channelLockFile(input.stateRoot, input.identity, 'links'),
    () => {
      const now = input.now ?? new Date();
      const read = readLinks(input.stateRoot, input.identity);
      if (!read.ok) return read;

      const key = linkKey(input.channel, input.chatId);
      const links = { ...read.value.links };
      const codes = { ...read.value.codes };
      const lockouts = { ...read.value.lockouts };
      let dirty = false;

      const existing = links[key];
      if (existing !== undefined) return { ok: true, value: { kind: 'already-linked', link: existing } };

      const lockout = lockouts[key];
      if (lockout !== undefined && lockout.lockedUntil !== null) {
        const until = Date.parse(lockout.lockedUntil);
        if (until > now.getTime()) {
          const secondsLeft = Math.max(1, Math.ceil((until - now.getTime()) / 1000));
          return { ok: true, value: { kind: 'locked', secondsLeft } };
        }
        delete lockouts[key];
        dirty = true;
      }

      const attempt = input.text.trim();
      if (!/^[0-9]{6}$/.test(attempt)) {
        if (dirty) writeLinks(input.stateRoot, input.identity, { schemaVersion: 1, links, codes, lockouts });
        return { ok: true, value: { kind: 'not-a-code' } };
      }

      let pending = codes[input.channel];
      if (pending !== undefined && Date.parse(pending.expiresAt) <= now.getTime()) {
        delete codes[input.channel];
        dirty = true;
        pending = undefined;
      }

      if (pending !== undefined && timingSafeEqual(Buffer.from(pending.code), Buffer.from(attempt))) {
        const link: LinkRecord = {
          channel: input.channel,
          chatId: input.chatId,
          senderId: input.senderId,
          actor: pending.actor,
          linkedAt: now.toISOString(),
        };
        links[key] = link;
        delete codes[input.channel];
        delete lockouts[key];
        writeLinks(input.stateRoot, input.identity, { schemaVersion: 1, links, codes, lockouts });
        return { ok: true, value: { kind: 'linked', link } };
      }

      const failures = (lockouts[key]?.failures ?? 0) + 1;
      if (pending !== undefined) {
        const spent = pending.failures + 1;
        if (spent >= MAX_PAIR_ATTEMPTS) {
          delete codes[input.channel];
        } else {
          codes[input.channel] = { ...pending, failures: spent };
        }
      }

      if (failures >= MAX_PAIR_ATTEMPTS) {
        lockouts[key] = {
          failures: MAX_PAIR_ATTEMPTS,
          lockedUntil: new Date(now.getTime() + PAIR_LOCKOUT_SECS * 1000).toISOString(),
        };
        writeLinks(input.stateRoot, input.identity, { schemaVersion: 1, links, codes, lockouts });
        return { ok: true, value: { kind: 'locked', secondsLeft: PAIR_LOCKOUT_SECS } };
      }

      lockouts[key] = { failures, lockedUntil: null };
      writeLinks(input.stateRoot, input.identity, { schemaVersion: 1, links, codes, lockouts });
      return { ok: true, value: { kind: 'wrong-code', codesLeft: MAX_PAIR_ATTEMPTS - failures } };
    },
  );
}
