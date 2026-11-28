// ───────────────────────────────────────────────────────────────────
// MODULE: Telegram Channel Transport
// ───────────────────────────────────────────────────────────────────
//
// `bots channel listen telegram` runs this transport, and a long poll is the
// whole inbound path, so it needs no public URL and no local daemon. Every
// network call is injected, so a test replays a recorded exchange and no test
// reaches the network.
//
// The token is read from the vault inside each call that needs it and held in
// a local of that call only, so no field, no state file, no queue entry and no
// log line carries it. Every URL and every error message that leaves the
// module passes through the redaction helper, so a URL reads bot<redacted>
// where the token was.
//
// A press is answered on receipt so the person's client stops its spinner, and
// that answer confirms nothing because the offset alone confirms the update. A
// press that carries an action id then takes the same pipeline as a typed line,
// so the link check decides whether it reaches a handler.

import { answerItem } from './answer.js';
import { actionIdFor, answerFromChat } from './channel-approval.js';
import { pairChat, resolveLink } from './channel-link.js';
import { enqueueChannel, listQueueEntries, replyKey } from './channel-queue.js';
import { CAPABILITY_MATRIX, CHANNEL_DESCRIPTORS, checkDeclared, readSeenRecord, redactToken, REPLIES, writeSeenRecord } from './channel.js';
import { botDefined, CHAT_SOURCE, cleanMessageText, renderChannelBlock } from './conversation.js';
import { enqueueFromCheckout } from './request-queue.js';
import { resolveSecret } from './secrets.js';

import type { SendErrorWithWait } from './channel-queue.js';
import type { SecretStoreOptions } from './secrets.js';
import type {
  ChannelAdapter,
  ChannelCapabilities,
  ChannelDescriptor,
  ChannelInbound,
  ChannelOutboundIntent,
  ChannelSendResult,
  ChannelSink,
  ChannelStatus,
  ConfiguredChannel,
} from './channel.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The provider base every call is posted under. A trailing slash is trimmed, so a caller may pass either form. */
export const TELEGRAM_API_BASE = 'https://api.telegram.org';

/** The long-poll timeout in seconds, so the provider holds the call open instead of the loop spinning. */
export const TELEGRAM_POLL_TIMEOUT_S = 30;

/** The update kinds the poll asks for. A press is listed so the provider keeps it, because a press is an event once it carries an action id. */
export const TELEGRAM_ALLOWED_UPDATES: readonly string[] = Object.freeze(['message', 'callback_query']);

/** How long the loop waits after a failed poll, so a provider outage is not a busy loop. */
export const TELEGRAM_POLL_RETRY_MS = 5_000;

/** How long the loop waits after a conflict, which a second listener causes and a short wait resolves. */
export const TELEGRAM_CONFLICT_RETRY_MS = 2_000;

/** The most UTF-8 bytes one message may carry, counted in bytes because the provider counts bytes. */
export const TELEGRAM_CHUNK_BYTES = 4096;

/**
 * The line a chat is sent when it names no bot this host runs. It names
 * neither the address tried nor the bots this host runs, so a stranger learns
 * nothing about the roster.
 */
export const BOT_UNKNOWN_REPLY = 'This message names no bot this host runs. Start it with @ and the bot id, for example @digest Which channel?';

// ───────────────────────────────────────────────────────────────────
// 2. INJECTED I/O
// ───────────────────────────────────────────────────────────────────

/** What one HTTP call returned, the part of a fetch Response a transport reads. */
export interface FetchResponseLike {
  status: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}

/** The one fetch call shape a transport makes. */
export type FetchLike = (
  url: string,
  init: { method: 'POST'; headers: Record<string, string>; body: string; signal?: AbortSignal },
) => Promise<FetchResponseLike>;

/** What a start probe found, so the listen verb prints one line and picks one exit. */
export type ProbeResult =
  | { ok: true; name: string }
  | { ok: false; kind: 'secret'; reason: string; detail?: string }
  | { ok: false; kind: 'rejected'; detail: string }
  | { ok: false; kind: 'failed'; detail: string };

// ───────────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────────

/** Everything the transport reads from its caller, so it holds no path, no clock and no network of its own. */
export interface TelegramTransportOptions {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  /** The vault name of the bot token, the channel config entry's secret. */
  secretName: string;
  env?: NodeJS.ProcessEnv;
  resolveEnv?: NodeJS.ProcessEnv;
  secretOptions?: SecretStoreOptions;
  fetch?: FetchLike;
  sleep?: (ms: number) => Promise<void>;
  now?: () => Date;
  log?: (line: string) => void;
  /** Defaults to TELEGRAM_API_BASE. A test passes its own. */
  apiBase?: string;
}

/** What one poll did. */
export type PollResult =
  | { ok: true; updates: number; emitted: number }
  | { ok: false; reason: 'poll-conflict' | 'poll-failed'; detail: string };

/** The Telegram adapter, with the probe and the single poll a test drives without a loop. */
export interface TelegramTransport extends ChannelAdapter {
  /** Resolve the token, clear any webhook, then call getMe once. */
  probe(): Promise<ProbeResult>;
  /** One getUpdates call and every update it returned, in order. */
  pollOnce(): Promise<PollResult>;
  /** The offset the next getUpdates sends. */
  offset(): number;
}

/** The channel name every record this transport writes carries. */
const CHANNEL: ConfiguredChannel = 'telegram';

/** One inbound event the pipeline takes, normalised from the provider's own shape. */
interface InboundEvent {
  /** The seen-record id, `update:<update_id>` here. */
  messageId: string;
  /** The provider chat id, as a string. */
  chatId: string;
  isGroup: boolean;
  /** The provider-asserted sender id, as a string. */
  senderId: string;
  /** The typed text, '' on a press. */
  text: string;
  /** The button's action id on a press, null on a typed line. */
  actionId: string | null;
  timestampUnixMs: number;
  raw: unknown;
}

/** The fields of one provider body this transport reads. */
interface TelegramBody {
  ok?: unknown;
  error_code?: unknown;
  description?: unknown;
  parameters?: { retry_after?: unknown };
  result?: unknown;
}

/** The fields of one update this transport reads. */
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

/** The fields of one message this transport reads. */
interface TelegramMessage {
  chat?: { id?: unknown; type?: unknown };
  from?: { id?: unknown };
  text?: unknown;
  date?: unknown;
}

/** The fields of the message a press answers, the part of a callback query this transport reads. */
interface TelegramCallbackMessage {
  chat?: { id?: unknown; type?: unknown };
  date?: number;
}

/** The fields of one callback query this transport reads, the press a button sends back. */
interface TelegramCallbackQuery {
  id: string;
  from: { id?: unknown };
  message?: TelegramCallbackMessage;
  data?: unknown;
}

/**
 * What one call returned. A body that reads is either ok or refused, and a
 * body that does not read is told apart from a call that never arrived.
 */
type CallResult =
  | { kind: 'ok'; status: number; body: TelegramBody }
  | { kind: 'refused'; status: number; body: TelegramBody; retryAfterMs: number | null }
  | { kind: 'unreadable'; status: number; retryAfterMs: number | null }
  | { kind: 'transport'; message: string };

/** A call that did not succeed, the only result a probe line or a send error is built from. */
type CallFailure = Exclude<CallResult, { kind: 'ok' }>;

// ───────────────────────────────────────────────────────────────────
// 4. CHUNKS, LABELS AND BODY READING
// ───────────────────────────────────────────────────────────────────

/**
 * Cut one text into the chunks a message may carry, each at most `limit`
 * UTF-8 bytes.
 *
 * The walk counts one code point at a time, so a chunk never ends inside a
 * code point and a character outside the basic plane is never split. No
 * newline is looked for, because the provider counts bytes and a cut at a
 * newline would still have to respect the byte cap. An empty text is one empty
 * chunk, because a send of nothing still has to produce a receipt.
 */
export function splitUtf8Bytes(text: string, limit: number): string[] {
  const chunks: string[] = [];
  let chunk = '';
  let bytes = 0;
  for (const cp of text) {
    const size = Buffer.byteLength(cp, 'utf8');
    if (bytes + size > limit && chunk !== '') {
      chunks.push(chunk);
      chunk = '';
      bytes = 0;
    }
    chunk += cp;
    bytes += size;
  }
  chunks.push(chunk);
  return chunks;
}

/**
 * The label of each button a prompt draws.
 *
 * A yes and no prompt keeps the two words, because the words are the answer.
 * Every other prompt numbers its choices with two spaces after the number, so
 * the number a person reads is the number a typed reply sends and the two
 * spaces keep the label clear of the number at a glance.
 */
export function buttonLabels(choices: readonly string[]): string[] {
  if (choices.length === 2 && choices[0] === 'YES' && choices[1] === 'NO') return [...choices];
  return choices.map((choice, index) => `${index + 1}  ${choice}`);
}

/** Read one JSON value as an object, or null when it is not one. */
function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

// ───────────────────────────────────────────────────────────────────
// 5. THE TRANSPORT
// ───────────────────────────────────────────────────────────────────

/**
 * Build the Telegram transport.
 *
 * Every effect is injected, so a test drives the whole poll, the whole inbound
 * pipeline and the whole send with no network and no clock. The transport
 * holds only what a running listener owns: the sink, the offset, whether it is
 * running and the controller of the poll in flight.
 */
export function createTelegramTransport(options: TelegramTransportOptions): TelegramTransport {
  const apiBase = (options.apiBase ?? TELEGRAM_API_BASE).replace(/\/+$/, '');
  const fetchImpl = options.fetch ?? (globalThis.fetch as unknown as FetchLike);
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? (() => new Date());
  const log = options.log ?? ((line: string) => { process.stderr.write(`${line}\n`); });
  const secretOptions = options.secretOptions ?? {};

  let running = false;
  let startedAt: string | null = null;
  // A poll before start has nowhere to deliver, so the field starts as a sink that drops and start replaces it.
  let sink: ChannelSink = { push: () => {} };
  let nextOffset = 0;
  let controller: AbortController | null = null;

  // ─── the call ───

  /** The URL of one call as any text that leaves the module shows it. */
  const shownUrl = (method: string, token: string): string => redactToken(`${apiBase}/bot${token}/${method}`, token);

  /** The wait the provider named on a refusal, in milliseconds, or null when it named none. */
  const retryAfterMsOf = (body: TelegramBody | null, header: string | null): number | null => {
    const seconds = body?.parameters?.retry_after;
    if (typeof seconds === 'number') return seconds * 1000;
    if (header !== null && header.trim() !== '') {
      const parsed = Number(header);
      if (Number.isFinite(parsed)) return parsed * 1000;
    }
    return null;
  };

  /** Whether a result carries one status, read from the HTTP status or from the body's own error code. */
  const isStatus = (result: CallResult, code: number): boolean =>
    result.kind !== 'transport' && (result.status === code || (result.kind === 'refused' && result.body.error_code === code));

  /**
   * One provider call.
   *
   * The body is always read as text and then parsed, so a body that cannot be
   * read is told apart from a body that reads and refuses. The token is a
   * parameter of this call and is never stored.
   */
  const call = async (
    method: string,
    token: string,
    payload: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<CallResult> => {
    const init: { method: 'POST'; headers: Record<string, string>; body: string; signal?: AbortSignal } = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    };
    if (signal !== undefined) init.signal = signal;

    let response: FetchResponseLike;
    try {
      response = await fetchImpl(`${apiBase}/bot${token}/${method}`, init);
    } catch (error: unknown) {
      return { kind: 'transport', message: error instanceof Error ? error.message : String(error) };
    }

    let text: string;
    try {
      text = await response.text();
    } catch {
      return { kind: 'unreadable', status: response.status, retryAfterMs: retryAfterMsOf(null, response.headers.get('retry-after')) };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { kind: 'unreadable', status: response.status, retryAfterMs: retryAfterMsOf(null, response.headers.get('retry-after')) };
    }

    const body = (asRecord(parsed) ?? {}) as TelegramBody;
    if (response.status === 200 && body.ok === true) return { kind: 'ok', status: response.status, body };
    return {
      kind: 'refused',
      status: response.status,
      body,
      retryAfterMs: retryAfterMsOf(body, response.headers.get('retry-after')),
    };
  };

  // ─── the probe ───

  /** The probe line for a call that did not succeed, with the method, the status and the shown URL. */
  const probeFailure = (method: string, result: CallFailure, token: string): ProbeResult => {
    const url = shownUrl(method, token);
    if (result.kind === 'transport') {
      return { ok: false, kind: 'failed', detail: redactToken(`${method} failed at ${url}: ${result.message}`, token) };
    }
    if (isStatus(result, 401)) {
      return { ok: false, kind: 'rejected', detail: redactToken(`${method} rejected with HTTP ${result.status} at ${url}`, token) };
    }
    return { ok: false, kind: 'failed', detail: redactToken(`${method} failed: HTTP ${result.status} at ${url}`, token) };
  };

  const probe = async (): Promise<ProbeResult> => {
    const secret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!secret.ok) {
      return secret.detail === undefined
        ? { ok: false, kind: 'secret', reason: secret.reason }
        : { ok: false, kind: 'secret', reason: secret.reason, detail: secret.detail };
    }
    const token = secret.value;

    // This build polls and never registers a webhook, so a webhook another host left is cleared before the first poll.
    const cleared = await call('deleteWebhook', token, { drop_pending_updates: false });
    if (cleared.kind !== 'ok') return probeFailure('deleteWebhook', cleared, token);

    const me = await call('getMe', token, {});
    if (me.kind !== 'ok') return probeFailure('getMe', me, token);

    const result = asRecord(me.body.result);
    const username = typeof result?.username === 'string' ? result.username : '';
    return { ok: true, name: `@${username}` };
  };

  // ─── the seen record and the reply ───

  /** Write the seen record of one message, so a redelivery is recognised before the provider is told it was taken. */
  const markSeen = (messageId: string, requestId: string | null): void => {
    writeSeenRecord(options.stateRoot, options.identity, { channel: CHANNEL, messageId, requestId }, now());
  };

  /**
   * Queue one reply to one inbound message.
   *
   * A reply that cannot be queued is logged and never thrown, because the seen
   * record is already written and a throw would only lose the acknowledge.
   */
  const queueReply = (text: string | null, event: InboundEvent): void => {
    if (text === null) return;
    const queued = enqueueChannel({
      stateRoot: options.stateRoot,
      identity: options.identity,
      key: replyKey(CHANNEL, event.chatId, event.messageId),
      channel: CHANNEL,
      conversationId: event.chatId,
      text,
      now: now(),
    });
    if (!queued.ok) log(`bots: ${CHANNEL} reply not queued: ${queued.reason}`);
  };

  // ─── the inbound pipeline ───

  /**
   * Take one inbound event.
   *
   * Every call it makes is synchronous, so the provider is acknowledged only
   * after it returns and a throw leaves the event unacknowledged for a later
   * redelivery. The steps run in this order and no other.
   */
  const takeEvent = (event: InboundEvent, sink: ChannelSink): { emitted: boolean } => {
    // P1. A redelivery is dropped here, and the caller still acknowledges it, so the provider stops resending.
    if (readSeenRecord(options.stateRoot, options.identity, CHANNEL, event.messageId) !== null) return { emitted: false };

    // P2. One normalised event, so every transport reaches the same gate.
    const inbound: ChannelInbound = {
      channel: CHANNEL,
      messageId: event.messageId,
      replyToId: null,
      timestampUnixMs: event.timestampUnixMs,
      conversation: { id: event.chatId, isGroup: event.isGroup },
      sender: { id: event.senderId },
      text: event.text,
      actionId: event.actionId,
      raw: event.raw,
    };

    // P3. The link decides whether this chat may speak for an actor at all.
    const link = resolveLink(options.stateRoot, options.identity, CHANNEL, event.chatId, event.senderId);
    if (!link.ok) {
      // A damaged links file must not drop a message, so the event stays unacknowledged.
      if (link.reason !== 'channel-unlinked') throw new Error(`${link.reason}: ${link.detail ?? ''}`);

      // A sender who is not the person the chat linked, a press from an unlinked chat and a code sent from a group are all dropped in silence.
      if (link.detail === 'sender mismatch' || event.actionId !== null || event.isGroup) {
        markSeen(event.messageId, null);
        return { emitted: false };
      }

      // A direct chat with no link pairs by the code it sends back.
      const pair = pairChat({
        stateRoot: options.stateRoot,
        identity: options.identity,
        channel: CHANNEL,
        chatId: event.chatId,
        senderId: event.senderId,
        text: event.text,
        now: now(),
      });
      if (!pair.ok) throw new Error(`${pair.reason}: ${pair.detail ?? ''}`);

      let pairReply: string | null = null;
      switch (pair.value.kind) {
        case 'linked':
          pairReply = REPLIES.M10({ actor: pair.value.link.actor });
          break;
        case 'already-linked':
          pairReply = null;
          break;
        case 'not-a-code':
          pairReply = REPLIES.M11({ channel: CHANNEL });
          break;
        case 'wrong-code':
          pairReply = REPLIES.M12({ codesLeft: pair.value.codesLeft });
          break;
        case 'locked':
          pairReply = REPLIES.M13({ seconds: pair.value.secondsLeft });
          break;
      }

      markSeen(event.messageId, null);
      queueReply(pairReply, event);
      return { emitted: false };
    }

    // P4. A linked chat reaches the answer path, which owns the reply grammar and the press.
    const actor = link.value.actor;
    const outcome = answerFromChat({
      stateRoot: options.stateRoot,
      identity: options.identity,
      channel: CHANNEL,
      conversation: inbound.conversation,
      actor,
      actionId: event.actionId,
      text: event.text,
      delivered: (itemId) =>
        listQueueEntries(options.stateRoot, options.identity).some(
          (entry) =>
            entry.itemId === itemId &&
            entry.channel === CHANNEL &&
            entry.conversationId === event.chatId &&
            entry.state === 'delivered',
        ),
      answer: ({ itemId, text }) => {
        const result = answerItem({
          checkoutRoot: options.checkoutRoot,
          itemId,
          text,
          env: options.env,
          resolveEnv: options.resolveEnv,
          actor,
          surface: 'channel',
          now: now(),
        });
        return result.ok
          ? { ok: true, value: { status: result.value.status, itemId: result.value.itemId } }
          : { ok: false, reason: result.reason, ...(result.detail !== undefined ? { detail: result.detail } : {}) };
      },
      now: now(),
    });
    if (!outcome.ok) throw new Error(`${outcome.reason}: ${outcome.detail ?? ''}`);

    let requestId: string | null = null;
    let replyText: string | null = null;

    if (outcome.value.kind === 'reply') {
      replyText = outcome.value.text;
    } else {
      // P5. A chat message starts a run for the bot it addresses.
      const text = cleanMessageText(event.text);
      const lead = text.replace(/^\s+/, '');
      const addressed = lead.startsWith('@');
      const token = addressed ? lead.slice(1).split(/\s/)[0] : '';
      const rest = addressed ? lead.slice(1 + token.length).replace(/^\s+/, '') : '';

      // An empty message reaches no bot, so it leaves the request and the reply both null.
      if (text.trim() !== '') {
        if (!addressed || token === '' || !botDefined(options.checkoutRoot, token) || rest.trim() === '') {
          // The reply names neither the address tried nor the bots this host runs.
          replyText = BOT_UNKNOWN_REPLY;
        } else {
          // The address is stripped before the block is rendered, so the bot never sees it.
          const block = renderChannelBlock(CHANNEL, rest);
          if (!block.ok) throw new Error(`${block.reason}: ${block.detail ?? ''}`);

          const queued = enqueueFromCheckout(
            options.checkoutRoot,
            {
              kind: 'run',
              workflowId: token,
              source: CHAT_SOURCE,
              eventId: `${CHANNEL}:${event.messageId}`,
              prompt: block.value,
              origin: `channel ${CHANNEL} ${event.chatId}`,
              delivery: `${CHANNEL}:${event.chatId}`,
            },
            options.resolveEnv ?? process.env,
          );
          if (!queued.ok) throw new Error(`${queued.reason}: ${queued.detail ?? ''}`);

          // A duplicate means a stop between the enqueue and the seen record, so the request already exists.
          requestId = queued.value.requestId;
        }
      }
    }

    // P6. The seen record is written before the provider is told the event was taken.
    markSeen(event.messageId, requestId);

    // P7. A reply that cannot be queued is logged and never thrown, because the seen record is already written.
    queueReply(replyText, event);

    // P8. Only an event that reached the answer path is emitted.
    sink.push(inbound);
    return { emitted: true };
  };

  // ─── the update ───

  /**
   * Take one update.
   *
   * A typed message and a press that carries an action id are events. An
   * edited message, a bot's own message, a sticker and a press that carries no
   * action id are not, so each is acknowledged with a seen record and the
   * acknowledge never runs ahead of one.
   */
  const handleUpdate = (update: TelegramUpdate, token: string): { emitted: boolean } => {
    const messageId = `update:${update.update_id}`;
    const message = update.message;
    if (message !== undefined && typeof message.text === 'string') {
      const chat = message.chat;
      const event: InboundEvent = {
        messageId,
        chatId: String(chat?.id ?? ''),
        isGroup: chat?.type !== 'private',
        senderId: String(message.from?.id ?? chat?.id ?? ''),
        text: message.text,
        actionId: null,
        timestampUnixMs: (typeof message.date === 'number' ? message.date : 0) * 1000,
        raw: update,
      };
      return takeEvent(event, sink);
    }

    /**
     * A press is answered on receipt, before the link check, so the person's
     * client stops its spinner even when the press is dropped. That answer
     * confirms nothing, because the offset alone confirms the update.
     */
    const cq = update.callback_query;
    if (cq !== undefined && cq.message !== undefined && cq.message.chat !== undefined) {
      void call('answerCallbackQuery', token, { callback_query_id: cq.id }).catch(() => {});

      const event: InboundEvent = {
        messageId,
        chatId: String(cq.message.chat.id),
        isGroup: cq.message.chat.type !== 'private',
        senderId: String(cq.from.id),
        text: '',
        actionId: typeof cq.data === 'string' ? cq.data : null,
        timestampUnixMs: (cq.message.date ?? 0) * 1000,
        raw: update,
      };

      // A press that carries no action id has nothing to answer, so it is acknowledged and dropped like any other non-event.
      if (event.actionId === null) {
        markSeen(messageId, null);
        return { emitted: false };
      }

      // The link check inside the pipeline is the press check, so a press from an unlinked chat or from a sender who is not the linked one reaches no handler.
      return takeEvent(event, sink);
    }

    markSeen(messageId, null);
    return { emitted: false };
  };

  // ─── the poll ───

  const pollOnce = async (): Promise<PollResult> => {
    const secret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!secret.ok) {
      return {
        ok: false,
        reason: 'poll-failed',
        detail: secret.detail === undefined ? secret.reason : `${secret.reason}: ${secret.detail}`,
      };
    }
    const token = secret.value;

    const poll = new AbortController();
    controller = poll;
    try {
      const result = await call(
        'getUpdates',
        token,
        { offset: nextOffset, timeout: TELEGRAM_POLL_TIMEOUT_S, allowed_updates: [...TELEGRAM_ALLOWED_UPDATES] },
        poll.signal,
      );

      if (result.kind === 'transport') {
        // A poll the stop aborted is the loop ending, not a failure.
        if (poll.signal.aborted) return { ok: true, updates: 0, emitted: 0 };
        return {
          ok: false,
          reason: 'poll-failed',
          detail: redactToken(`getUpdates failed at ${shownUrl('getUpdates', token)}: ${result.message}`, token),
        };
      }

      if (result.kind !== 'ok') {
        if (isStatus(result, 409)) {
          return {
            ok: false,
            reason: 'poll-conflict',
            detail: redactToken(`getUpdates conflict at ${shownUrl('getUpdates', token)}`, token),
          };
        }
        return {
          ok: false,
          reason: 'poll-failed',
          detail: redactToken(`getUpdates failed: HTTP ${result.status} at ${shownUrl('getUpdates', token)}`, token),
        };
      }

      const updates = Array.isArray(result.body.result) ? result.body.result : [];
      let emitted = 0;
      for (const raw of updates) {
        const update = raw as TelegramUpdate;
        try {
          if (handleUpdate(update, token).emitted) emitted += 1;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            ok: false,
            reason: 'poll-failed',
            detail: redactToken(`update ${update.update_id} not taken: ${message}`, token),
          };
        }
        // The offset moves past an update only after its handling returned, and past a duplicate the seen record dropped.
        nextOffset = Math.max(nextOffset, update.update_id + 1);
      }
      return { ok: true, updates: updates.length, emitted };
    } finally {
      if (controller === poll) controller = null;
    }
  };

  // ─── the send ───

  /**
   * The error one failed send reports.
   *
   * A transport error, a server error and an unreadable body each mean the
   * provider may have taken the message, so each sets sentBeforeError. A rate
   * limit is the one error worth retrying, and it carries the wait the
   * provider named. Every other refusal sets both flags false, and an earlier
   * chunk that landed makes sentBeforeError true whatever the later error is.
   */
  const sendError = (result: CallFailure, token: string, landed: boolean): SendErrorWithWait => {
    const url = shownUrl('sendMessage', token);
    const rejected = (kind: string, status: number, retryable: boolean, sentBeforeError: boolean): SendErrorWithWait => ({
      kind,
      message: redactToken(`Telegram sendMessage rejected with HTTP ${status} at ${url}`, token),
      unsupported: false,
      retryable,
      sentBeforeError,
    });

    if (result.kind === 'transport') {
      return {
        kind: 'transport-error',
        message: redactToken(`Telegram sendMessage failed at ${url}: ${result.message}`, token),
        unsupported: false,
        retryable: false,
        sentBeforeError: true,
      };
    }

    if (result.status >= 500) return rejected('server-error', result.status, false, true);

    if (isStatus(result, 429)) {
      const error = rejected('rate-limited', 429, true, landed);
      if (result.retryAfterMs !== null) error.retryAfterMs = result.retryAfterMs;
      return error;
    }

    if (result.kind === 'unreadable') {
      if (result.status !== 200) return rejected('rejected', result.status, false, landed);
      return {
        kind: 'unreadable-response',
        message: redactToken(`Telegram sendMessage returned an unreadable body with HTTP ${result.status} at ${url}`, token),
        unsupported: false,
        retryable: false,
        sentBeforeError: true,
      };
    }

    return rejected('rejected', result.status, false, landed);
  };

  const send = async (intent: ChannelOutboundIntent): Promise<ChannelSendResult> => {
    const refused = checkDeclared('telegram', CAPABILITY_MATRIX.telegram, intent);
    if (refused !== null) return refused;

    const secret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!secret.ok) {
      return {
        ok: false,
        error: {
          kind: secret.reason,
          message: secret.detail === undefined ? secret.reason : `${secret.reason}: ${secret.detail}`,
          unsupported: false,
          retryable: false,
          sentBeforeError: false,
        },
      };
    }
    const token = secret.value;

    // The text is sent as it was queued, never re-rendered, as plain text with no parse mode.
    const chunks = splitUtf8Bytes(intent.text, TELEGRAM_CHUNK_BYTES);
    const itemId = intent.kind === 'buttons' ? intent.itemId : null;
    const labels = itemId !== null && intent.choices !== null ? buttonLabels(intent.choices) : null;

    const platformMessageIds: string[] = [];
    for (let index = 0; index < chunks.length; index += 1) {
      const payload: Record<string, unknown> = { chat_id: intent.conversationId, text: chunks[index] };
      // The buttons ride the last chunk, so a press always answers the message that ends the prompt.
      if (index === chunks.length - 1 && itemId !== null && labels !== null) {
        payload.reply_markup = {
          inline_keyboard: labels.map((label, k) => [{ text: label, callback_data: actionIdFor(itemId, k + 1) }]),
        };
      }

      const result = await call('sendMessage', token, payload);
      if (result.kind !== 'ok') return { ok: false, error: sendError(result, token, platformMessageIds.length > 0) };

      const messageId = asRecord(result.body.result)?.message_id;
      platformMessageIds.push(String(messageId));
    }

    return { ok: true, receipt: { platformMessageIds, primaryPlatformMessageId: platformMessageIds[0] } };
  };

  // ─── the loop ───

  const start = async (next: ChannelSink): Promise<void> => {
    running = true;
    startedAt = now().toISOString();
    sink = next;

    while (running) {
      const result = await pollOnce();
      if (result.ok) continue;
      if (result.reason === 'poll-failed') log(`bots: telegram ${result.detail}`);
      if (!running) break;
      await sleep(result.reason === 'poll-conflict' ? TELEGRAM_CONFLICT_RETRY_MS : TELEGRAM_POLL_RETRY_MS);
    }
  };

  const stop = async (): Promise<void> => {
    running = false;
    if (controller !== null) {
      controller.abort();
      controller = null;
    }
  };

  return {
    descriptor: (): ChannelDescriptor => CHANNEL_DESCRIPTORS.telegram,
    declaredCapabilities: (): ChannelCapabilities => CAPABILITY_MATRIX.telegram,
    status: (): ChannelStatus => ({ running, startedAt }),
    start,
    stop,
    send,
    probe,
    pollOnce,
    offset: () => nextOffset,
  };
}
