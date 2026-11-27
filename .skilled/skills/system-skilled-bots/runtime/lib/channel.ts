// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Contract
// ───────────────────────────────────────────────────────────────────
//
// Every chat transport implements one adapter. An adapter declares a fixed
// set of capability keys and answers an operation it does not declare with
// an explicit unsupported result before any I/O, never a silent success and
// never a throw. The module imports only the state layout, so the contract
// has no cycle.

import { createHash, randomBytes } from 'node:crypto';
import { closeSync, linkSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, statSync, unlinkSync, writeFileSync, writeSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { channelFolder, ensureChannelState, STATE_DIR_MODE, STATE_FILE_MODE, writeStateFile } from './state-root.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** The five chat transports an adapter can serve. */
export type ChannelName = 'terminal' | 'telegram' | 'slack' | 'signal' | 'whatsapp';

/** The chat a message arrived in or is sent to. */
export interface ChannelConversation {
  /** The provider's chat id, the second half of a links.json key. */
  id: string;
  /** True only where groupKnown is yes and the provider says so. */
  isGroup: boolean;
}

/** Who the provider says sent the message. */
export interface ChannelSender {
  /** The provider-asserted sender id, compared with the link record's senderId. */
  id: string;
}

/** One inbound message, normalised so every transport reaches the same gate. */
export interface ChannelInbound {
  channel: ChannelName;
  /** The per-transport form the inbound sequence fixes. */
  messageId: string;
  replyToId: string | null;
  timestampUnixMs: number;
  conversation: ChannelConversation;
  sender: ChannelSender;
  text: string;
  /** approval-v1:<itemId>:<index> on a press, null on a typed line. */
  actionId: string | null;
  raw: unknown;
}

/** What a send asks the transport to do. */
export type ChannelIntentKind = 'text' | 'buttons' | 'edit' | 'react' | 'file';

/** One outbound operation, carrying the key that makes a retry safe. */
export interface ChannelOutboundIntent {
  kind: ChannelIntentKind;
  idempotencyKey: string;
  conversationId: string;
  text: string;
  /** Set on a buttons intent, null otherwise. */
  itemId: string | null;
  /** Set on a buttons intent, the item's options or ['YES', 'NO']. */
  choices: string[] | null;
}

/** What a successful send produced, so a later edit can address the same messages. */
export interface ChannelReceipt {
  platformMessageIds: string[];
  primaryPlatformMessageId: string;
}

/** Why a send failed, in terms the caller can act on without parsing a provider string. */
export interface ChannelSendError {
  kind: string;
  message: string;
  unsupported: boolean;
  retryable: boolean;
  sentBeforeError: boolean;
}

/** A send either produced a receipt or a named error. */
export type ChannelSendResult =
  | { ok: true; receipt: ChannelReceipt }
  | { ok: false; error: ChannelSendError };

/** Where a running adapter delivers what it receives. */
export interface ChannelSink {
  push(message: ChannelInbound): void;
}

/** The fixed facts about a transport that the runtime reads before it sends. */
export interface ChannelDescriptor {
  name: ChannelName;
  chunkLimit: number;
  chunkUnit: 'utf8-bytes' | 'code-points';
  ackPolicy: 'after-seen-record' | 'none';
}

/** What a transport can do, one boolean per capability. */
export type ChannelCapabilities = Readonly<Record<
  'sendText' | 'receiveText' | 'buttons' | 'numberedReply' | 'groupKnown' | 'edit' | 'react' | 'file',
  boolean
>>;

/** Whether an adapter is running and since when. */
export interface ChannelStatus {
  running: boolean;
  startedAt: string | null;
}

/** The one contract every chat transport implements. */
export interface ChannelAdapter {
  descriptor(): ChannelDescriptor;
  declaredCapabilities(): ChannelCapabilities;
  start(sink: ChannelSink): Promise<void>;
  stop(): Promise<void>;
  send(intent: ChannelOutboundIntent): Promise<ChannelSendResult>;
  status(): ChannelStatus;
}

/** The result shape every channel helper returns, the same shape the rest of the runtime uses. */
export type ChannelResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string; detail?: string };

/** The capability a channel can declare, one boolean each. */
export type CapabilityKey = keyof ChannelCapabilities;

// ───────────────────────────────────────────────────────────────────
// 2. CAPABILITIES
// ───────────────────────────────────────────────────────────────────

/** Every channel name, in the order the runtime reports them. */
export const CHANNEL_NAMES: readonly ChannelName[] = ['terminal', 'telegram', 'slack', 'signal', 'whatsapp'];

/** Every capability key, in the order a matrix row lists them. */
export const CAPABILITY_KEYS: readonly CapabilityKey[] = ['sendText', 'receiveText', 'buttons', 'numberedReply', 'groupKnown', 'edit', 'react', 'file'];

/** What each transport declares. A false here is a refusal, not a fallback. */
export const CAPABILITY_MATRIX: Readonly<Record<ChannelName, ChannelCapabilities>> = Object.freeze({
  terminal: Object.freeze({
    sendText: true,
    receiveText: true,
    buttons: false,
    numberedReply: true,
    groupKnown: false,
    edit: false,
    react: false,
    file: false,
  }),
  telegram: Object.freeze({
    sendText: true,
    receiveText: true,
    buttons: true,
    numberedReply: false,
    groupKnown: true,
    edit: false,
    react: false,
    file: false,
  }),
  slack: Object.freeze({
    sendText: true,
    receiveText: true,
    buttons: true,
    numberedReply: false,
    groupKnown: true,
    edit: false,
    react: false,
    file: false,
  }),
  signal: Object.freeze({
    sendText: true,
    receiveText: true,
    buttons: false,
    numberedReply: true,
    groupKnown: true,
    edit: false,
    react: false,
    file: false,
  }),
  whatsapp: Object.freeze({
    sendText: true,
    receiveText: true,
    buttons: false,
    numberedReply: true,
    groupKnown: false,
    edit: false,
    react: false,
    file: false,
  }),
});

/** The fixed facts of each transport, so a sender never guesses a chunk limit. */
export const CHANNEL_DESCRIPTORS: Readonly<Record<ChannelName, ChannelDescriptor>> = Object.freeze({
  terminal: Object.freeze({ name: 'terminal', chunkLimit: 4096, chunkUnit: 'code-points', ackPolicy: 'none' }),
  telegram: Object.freeze({ name: 'telegram', chunkLimit: 4096, chunkUnit: 'utf8-bytes', ackPolicy: 'after-seen-record' }),
  slack: Object.freeze({ name: 'slack', chunkLimit: 3900, chunkUnit: 'code-points', ackPolicy: 'after-seen-record' }),
  signal: Object.freeze({ name: 'signal', chunkLimit: 2000, chunkUnit: 'code-points', ackPolicy: 'none' }),
  whatsapp: Object.freeze({ name: 'whatsapp', chunkLimit: 4096, chunkUnit: 'code-points', ackPolicy: 'after-seen-record' }),
});

/** The capability each intent kind needs before send may do any I/O. */
export const INTENT_CAPABILITY: Readonly<Record<ChannelIntentKind, CapabilityKey>> = Object.freeze({
  text: 'sendText', buttons: 'buttons', edit: 'edit', react: 'react', file: 'file',
});

// ───────────────────────────────────────────────────────────────────
// 3. UNSUPPORTED RESULT
// ───────────────────────────────────────────────────────────────────

/**
 * The explicit result for an operation the channel does not declare. It is
 * never retried, because nothing was sent and the same send would be refused
 * again.
 */
export function unsupportedResult(channel: ChannelName, capability: CapabilityKey): ChannelSendResult {
  return {
    ok: false,
    error: {
      kind: 'unsupported',
      message: `${channel} does not declare ${capability}`,
      unsupported: true,
      retryable: false,
      sentBeforeError: false,
    },
  };
}

/**
 * A transport's send calls this first and returns its result when it is not
 * null, so an undeclared operation reaches no provider. It never throws.
 */
export function checkDeclared(
  channel: ChannelName,
  capabilities: ChannelCapabilities,
  intent: ChannelOutboundIntent,
): ChannelSendResult | null {
  const capability = INTENT_CAPABILITY[intent.kind];
  return capabilities[capability] !== true ? unsupportedResult(channel, capability) : null;
}

// ───────────────────────────────────────────────────────────────────
// 4. CHANNEL CONFIG
// ───────────────────────────────────────────────────────────────────

/** The channels a config entry can name. The terminal transport needs no entry. */
export const CONFIGURED_CHANNELS = ['telegram', 'slack', 'signal', 'whatsapp'] as const;

/** One transport a config entry can name. */
export type ConfiguredChannel = (typeof CONFIGURED_CHANNELS)[number];

/** One channel's entry: the secret's name and whether the channel is on. */
export interface ChannelConfigEntry {
  secret: string;
  enabled: boolean;
}

/** Which channels are on, and the name of the secret each one reads. */
export interface ChannelConfig {
  schemaVersion: 1;
  channels: Partial<Record<ConfiguredChannel, ChannelConfigEntry>>;
}

/**
 * The channel config file of one identity. This module is the only reader and
 * the only writer, and the file holds secret names and never a value.
 */
export function channelConfigFile(stateRoot: string, identity: string): string {
  return join(channelFolder(stateRoot, identity), 'config.json');
}

/**
 * Read the channel config. This module is the only reader and the only writer,
 * and the file holds secret names and never a value.
 *
 * A missing file reads as an empty config, so a host that configured nothing
 * yet is not an error. Every other failure is named, because a config the
 * runtime cannot trust must never read as empty.
 */
export function readChannelConfig(stateRoot: string, identity: string): ChannelResult<ChannelConfig> {
  let text: string;
  try {
    text = readFileSync(channelConfigFile(stateRoot, identity), 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') {
      return { ok: true, value: { schemaVersion: 1, channels: {} } };
    }
    return { ok: false, reason: 'channel-config-invalid', detail: 'unreadable' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'channel-config-invalid', detail: 'not json' };
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, reason: 'channel-config-invalid', detail: 'not an object' };
  }

  const file = parsed as { schemaVersion?: unknown; channels?: unknown };
  if (file.schemaVersion !== undefined && file.schemaVersion !== 1) {
    const shown = typeof file.schemaVersion === 'number' ? String(file.schemaVersion) : 'not a number';
    return { ok: false, reason: 'channel-config-invalid', detail: `schemaVersion ${shown}` };
  }

  const raw = file.channels;
  if (raw !== undefined && (typeof raw !== 'object' || raw === null || Array.isArray(raw))) {
    return { ok: false, reason: 'channel-config-invalid', detail: 'channels not an object' };
  }

  const channels: Partial<Record<ConfiguredChannel, ChannelConfigEntry>> = {};
  for (const [key, entry] of Object.entries((raw ?? {}) as Record<string, unknown>)) {
    if (!(CONFIGURED_CHANNELS as readonly string[]).includes(key)) {
      return { ok: false, reason: 'channel-config-invalid', detail: `channel ${key}` };
    }
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      return { ok: false, reason: 'channel-config-invalid', detail: `entry ${key}` };
    }
    const fields = entry as { secret?: unknown; enabled?: unknown };
    if (typeof fields.secret !== 'string' || fields.secret.length === 0) {
      return { ok: false, reason: 'channel-config-invalid', detail: `entry ${key}` };
    }
    if (typeof fields.enabled !== 'boolean') {
      return { ok: false, reason: 'channel-config-invalid', detail: `entry ${key}` };
    }
    channels[key as ConfiguredChannel] = { secret: fields.secret, enabled: fields.enabled };
  }

  return { ok: true, value: { schemaVersion: 1, channels } };
}

/**
 * Write the channel config. This module is the only reader and the only writer,
 * and the file holds secret names and never a value.
 */
export function writeChannelConfig(stateRoot: string, identity: string, config: ChannelConfig): void {
  ensureChannelState(stateRoot, identity);
  writeStateFile(channelConfigFile(stateRoot, identity), config);
}

// ───────────────────────────────────────────────────────────────────
// 5. STATE LOCK
// ───────────────────────────────────────────────────────────────────

/** The channel files a lock can guard. */
export type ChannelLockName = 'config' | 'links' | 'approvals';

const LOCK_WAIT_MS = 2_000;
const LOCK_POLL_MS = 25;
const LOCK_STALE_MS = 60_000;

/** What a held lock records, so a later reader can tell a live owner from a dead one. */
interface LockBody {
  pid: number;
  nonce: string;
  createdAt: string;
}

/** The lock file of one channel file. Creates nothing. */
export function channelLockFile(stateRoot: string, identity: string, name: ChannelLockName): string {
  return join(channelFolder(stateRoot, identity), `${name}.lock`);
}

/**
 * Whether a process still exists. A process this user may not signal still
 * exists, so only a missing one reads as gone.
 */
function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    return (error as NodeJS.ErrnoException | null)?.code === 'EPERM';
  }
}

/**
 * Read a lock file.
 *
 * @returns Null when the file is missing, `torn` when it exists but does not hold a lock, else its
 *   contents.
 */
function readLock(path: string): LockBody | null | 'torn' {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') return null;
    throw error;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return 'torn';
  }
  if (typeof parsed !== 'object' || parsed === null) return 'torn';
  const file = parsed as Partial<LockBody>;
  if (typeof file.pid !== 'number' || typeof file.nonce !== 'string' || typeof file.createdAt !== 'string') return 'torn';
  return { pid: file.pid, nonce: file.nonce, createdAt: file.createdAt };
}

/**
 * Wait without a busy loop. The wait blocks the thread, which keeps
 * withStateLock synchronous for every caller.
 */
function pause(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Remove the lock, but only while it is still this holder's.
 *
 * A process whose lock was reclaimed must never delete the lock the next holder
 * now owns, so the file is read first and removed only when it still carries
 * this holder's nonce.
 */
function releaseLock(lockFile: string, nonce: string): void {
  const held = readLock(lockFile);
  if (held === null || held === 'torn' || held.nonce !== nonce) return;
  try {
    unlinkSync(lockFile);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
  }
}

/**
 * Run fn while holding the lock, so one writer at a time touches a channel file.
 *
 * A link verb and an inbound code can race on the same record, so every write
 * to one channel file takes its lock first. A lock a killed process left behind
 * is reclaimed, and a live one is waited on for a bounded time.
 */
export function withStateLock<T>(lockFile: string, fn: () => T): T {
  mkdirSync(dirname(lockFile), { recursive: true, mode: STATE_DIR_MODE });
  const nonce = randomBytes(8).toString('hex');
  const deadline = Date.now() + LOCK_WAIT_MS;
  for (;;) {
    let fd: number | null = null;
    try {
      fd = openSync(lockFile, 'wx', STATE_FILE_MODE);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException | null)?.code !== 'EEXIST') throw error;
    }
    if (fd !== null) {
      const body: LockBody = { pid: process.pid, nonce, createdAt: new Date().toISOString() };
      try {
        writeSync(fd, JSON.stringify(body));
      } finally {
        closeSync(fd);
      }
      try {
        return fn();
      } finally {
        releaseLock(lockFile, nonce);
      }
    }

    const held = readLock(lockFile);
    if (held === null) continue;
    let stale: boolean;
    if (held === 'torn') {
      let mtime: number;
      try {
        mtime = statSync(lockFile).mtimeMs;
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') continue;
        throw error;
      }
      stale = Date.now() - mtime > LOCK_STALE_MS;
    } else {
      const born = Date.parse(held.createdAt);
      // An unparsable createdAt cannot prove a live owner, so it counts as stale.
      stale = !pidAlive(held.pid) || Number.isNaN(born) || Date.now() - born > LOCK_STALE_MS;
    }

    if (stale) {
      const aside = `${lockFile}.${nonce}.stale`;
      try {
        renameSync(lockFile, aside);
      } catch (error: unknown) {
        // Another reclaimer moved it first, so the loop reads the path again.
        if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') continue;
        throw error;
      }
      try {
        unlinkSync(aside);
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
      }
      continue;
    }

    if (Date.now() >= deadline) throw new Error(`channel-busy: ${basename(lockFile)} is held`);
    pause(LOCK_POLL_MS);
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. TOKEN REDACTION
// ───────────────────────────────────────────────────────────────────

/** What a token becomes in any text that leaves the runtime. */
export const REDACTED = '<redacted>';

/**
 * Replace every occurrence of a token with the redaction marker.
 *
 * Every channel error, log line and queue entry passes through it, because a
 * provider URL carries the token in its own path:
 * https://api.telegram.org/bot<token>/getUpdates renders as https://api.telegram.org/bot<redacted>/getUpdates
 */
export function redactToken(text: string, token: string | null | undefined): string {
  if (token === null || token === undefined || token === '') return text;
  return text.split(token).join(REDACTED);
}

// ───────────────────────────────────────────────────────────────────
// 7. SEEN RECORDS AND THE LISTEN LEASE
// ───────────────────────────────────────────────────────────────────

/** One message the runtime has already taken, so a redelivery is recognised. */
export interface SeenRecord {
  schemaVersion: 1;
  channel: ChannelName;
  messageId: string;
  requestId: string | null;
  seenAt: string;
}

/**
 * The seen record file of one message. The provider id is hashed, so no
 * provider id reaches a path.
 */
export function seenRecordFile(stateRoot: string, identity: string, channel: ChannelName, messageId: string): string {
  return join(channelFolder(stateRoot, identity), 'seen', channel, `${createHash('sha256').update(messageId).digest('hex')}.json`);
}

/**
 * Read the seen record of one message.
 *
 * @returns The record, or null when the file is missing or does not hold one.
 */
export function readSeenRecord(stateRoot: string, identity: string, channel: ChannelName, messageId: string): SeenRecord | null {
  let text: string;
  try {
    text = readFileSync(seenRecordFile(stateRoot, identity, channel, messageId), 'utf8');
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const record = parsed as Partial<SeenRecord>;
  if (typeof record.messageId !== 'string') return null;
  return record as SeenRecord;
}

/**
 * Record that a message was taken.
 *
 * The record is written before the provider is told the message was taken, and
 * an existing record means the message was seen before, so a redelivery is
 * never answered twice.
 *
 * @returns True when this call wrote the record, false when one already existed.
 */
export function writeSeenRecord(
  stateRoot: string,
  identity: string,
  record: { channel: ChannelName; messageId: string; requestId: string | null },
  now: Date = new Date(),
): boolean {
  ensureChannelState(stateRoot, identity);
  const file = seenRecordFile(stateRoot, identity, record.channel, record.messageId);
  mkdirSync(dirname(file), { recursive: true, mode: STATE_DIR_MODE });
  const value: SeenRecord = {
    schemaVersion: 1,
    channel: record.channel,
    messageId: record.messageId,
    requestId: record.requestId,
    seenAt: now.toISOString(),
  };
  const temp = `${file}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  try {
    writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: STATE_FILE_MODE });
    linkSync(temp, file);
    return true;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'EEXIST') return false;
    throw error;
  } finally {
    rmSync(temp, { force: true });
  }
}

/** The lease one running listener holds, so a second listener is refused. */
export interface ListenLease {
  schemaVersion: 1;
  pid: number;
  nonce: string;
  startedAt: string;
}

/** The listen lease file of one channel. Creates nothing. */
export function listenLeaseFile(stateRoot: string, identity: string, channel: ChannelName): string {
  return join(channelFolder(stateRoot, identity), `listen-${channel}.lease`);
}

/**
 * Read a listen lease.
 *
 * @returns The lease, or null when the file is missing or does not hold one.
 */
function readLease(path: string): ListenLease | null {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const lease = parsed as Partial<ListenLease>;
  if (typeof lease.pid !== 'number' || typeof lease.nonce !== 'string') return null;
  return lease as ListenLease;
}

/**
 * Take the listen lease of one channel.
 *
 * One listener per channel. A second listener is refused while the first is
 * alive, and a lease whose process is gone is reclaimed.
 */
export function acquireListenLease(
  stateRoot: string,
  identity: string,
  channel: ChannelName,
  now: Date = new Date(),
): ChannelResult<ListenLease> {
  ensureChannelState(stateRoot, identity);
  const leaseFile = listenLeaseFile(stateRoot, identity, channel);
  const lease: ListenLease = {
    schemaVersion: 1,
    pid: process.pid,
    nonce: randomBytes(8).toString('hex'),
    startedAt: now.toISOString(),
  };
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const temp = `${leaseFile}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
    try {
      writeFileSync(temp, `${JSON.stringify(lease, null, 2)}\n`, { mode: STATE_FILE_MODE });
      linkSync(temp, leaseFile);
      return { ok: true, value: lease };
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException | null)?.code !== 'EEXIST') throw error;
    } finally {
      rmSync(temp, { force: true });
    }

    const held = readLease(leaseFile);
    if (held !== null && pidAlive(held.pid)) {
      return { ok: false, reason: 'channel-listening', detail: `held by pid ${held.pid}` };
    }
    const aside = `${leaseFile}.${lease.nonce}.stale`;
    try {
      renameSync(leaseFile, aside);
    } catch (error: unknown) {
      // Another listener reclaimed it first, so the next attempt decides again.
      if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') continue;
      throw error;
    }
    try {
      unlinkSync(aside);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
    }
  }
  return { ok: false, reason: 'channel-listening', detail: 'lease contended' };
}

/**
 * Release the listen lease, but only while it is still this listener's.
 *
 * A listener whose lease was reclaimed must never remove the lease the next
 * listener now holds, so the file is read first and removed only when it still
 * carries this lease's nonce.
 */
export function releaseListenLease(stateRoot: string, identity: string, channel: ChannelName, lease: ListenLease): void {
  const leaseFile = listenLeaseFile(stateRoot, identity, channel);
  const held = readLease(leaseFile);
  if (held === null || held.nonce !== lease.nonce) return;
  try {
    unlinkSync(leaseFile);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// 8. REPLY TABLE
// ───────────────────────────────────────────────────────────────────

/**
 * Every reply a channel sends of its own, plus the link code line the host
 * prints. None carries bot-authored text, so none needs the secret-literal
 * check. M07 takes the 1-based choice number or the word NO. M12 counts down
 * from 4 to 1. M13 rounds the seconds up and never prints 0. M14 names the
 * linked actor, never a display name.
 */
export const REPLIES = Object.freeze({
  M07: (f: { choice: string; itemId: string; actor: string }) => `Answer ${f.choice} recorded for item ${f.itemId} by ${f.actor}. The run resumes.`,
  M08: (f: { itemId: string }) => `Item ${f.itemId} already has this answer. Nothing changed.`,
  M09: (f: { channel: string; code: string }) => `bots: ${f.channel} link code ${f.code}, valid for 5 minutes`,
  M10: (f: { actor: string }) => `Linked. This chat now answers as ${f.actor}.`,
  M11: (f: { channel: string }) => `This chat is not linked. Ask the operator to run bots channel link ${f.channel} on the host, then send the code here.`,
  M12: (f: { codesLeft: number }) => `That code did not match. ${f.codesLeft} more wrong codes lock this chat for 300 seconds.`,
  M13: (f: { seconds: number }) => `This chat is locked for ${Math.max(1, Math.ceil(f.seconds))} more seconds after five wrong codes.`,
  M14: (f: { actor: string }) => `${f.actor} is not an owner or member of this host's roster, so the answer was not recorded.`,
  M15: (f: { itemId: string; instant: string }) => `Item ${f.itemId} expired at ${f.instant}, so the answer was not recorded.`,
  M16: () => 'Approvals are not taken in a group chat. Answer in a direct chat with the bot.',
  M17: () => 'The host has no roster, so answers from a chat are refused. The operator runs bots channel roster add <name> --role owner.',
  M18: (f: { itemId: string; instant: string }) => `Item ${f.itemId} was already answered at ${f.instant} from another surface. Your answer was not recorded.`,
  M19: (f: { itemId: string }) => `Item ${f.itemId} is being answered elsewhere right now. Send your answer again in a few seconds.`,
  M20: (f: { highest: number }) => `Reply with a number from 1 to ${f.highest}, or NO.`,
});

/** The id of one reply in the table. */
export type ReplyId = keyof typeof REPLIES;
