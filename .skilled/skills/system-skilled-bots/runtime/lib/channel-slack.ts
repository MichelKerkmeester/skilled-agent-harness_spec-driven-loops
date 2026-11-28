// ───────────────────────────────────────────────────────────────────
// MODULE: Slack Channel Transport
// ───────────────────────────────────────────────────────────────────
//
// `bots channel listen slack` runs this transport, and Socket Mode is the
// whole inbound path, so it needs no public URL and no local daemon: the
// transport opens one outbound WebSocket and never opens a port. Every
// network call and every socket is injected, so a test replays a recorded
// exchange and no test reaches the network.
//
// Two tokens are read from the vault. The app-level token opens the socket
// and the bot token carries every Web API call. Each is read inside the call
// that needs it and held in a local of that call only, so no field, no state
// file, no queue entry and no log line carries one. Every URL and every error
// message that leaves the module passes through the redaction helper.
//
// The acknowledge follows the seen record, so an envelope is acknowledged
// only after the pipeline took it and a throw leaves it for a redelivery.

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

/** The Web API base every call is posted under. A trailing slash is trimmed, so a caller may pass either form. */
export const SLACK_API_BASE = 'https://slack.com/api';

/** The most code points one message may carry, counted after the escape so a sent chunk never passes the cap. */
export const SLACK_CHUNK_CHARS = 3900;

/** The most code points a section block may carry, so the chunk that draws the buttons is cut again. */
export const SLACK_SECTION_CHARS = 3000;

/** How many buttons share one actions block, because the provider refuses a longer row. */
export const SLACK_BUTTONS_PER_BLOCK = 5;

/** How long the loop waits before it opens a fresh socket, so a provider outage is not a busy loop. */
export const SLACK_RECONNECT_MS = 2_000;

/** The Web API error codes that mean the provider rejected the token. */
export const SLACK_REJECTED_ERRORS: readonly string[] = Object.freeze(['invalid_auth', 'not_authed', 'account_inactive', 'token_revoked', 'token_expired']);

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

/** The part of a WebSocket this transport uses. */
export interface SocketLike {
  send(data: string): void;
  close(): void;
  addEventListener(type: 'open' | 'message' | 'close' | 'error', listener: (event: { data?: unknown }) => void): void;
}

/** Opens one socket. A test passes a fake. */
export type SocketFactory = (url: string) => SocketLike;

/** Everything the transport reads from its caller, so it holds no path, no clock and no network of its own. */
export interface SlackTransportOptions {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  /** The vault name of the app-level token. The bot token is `${secretName}-bot`. */
  secretName: string;
  env?: NodeJS.ProcessEnv;
  resolveEnv?: NodeJS.ProcessEnv;
  secretOptions?: SecretStoreOptions;
  fetch?: FetchLike;
  socket?: SocketFactory;
  sleep?: (ms: number) => Promise<void>;
  now?: () => Date;
  log?: (line: string) => void;
  /** Defaults to SLACK_API_BASE. */
  apiBase?: string;
}

/** The Slack adapter, with the probe and the single frame a test drives without a socket. */
export interface SlackTransport extends ChannelAdapter {
  /** Resolve both tokens, call auth.test on the bot token, then apps.connections.open on the app token. */
  probe(): Promise<ProbeResult>;
  /** Handle one socket frame as the socket loop does, and return the acknowledge it sent or null. Exported so a test drives it. */
  receive(frame: string): string | null;
}

/** The channel name every record this transport writes carries. */
const CHANNEL: ConfiguredChannel = 'slack';

/** One inbound event the pipeline takes, normalised from the provider's own shape. */
interface InboundEvent {
  /** The seen-record id, `envelope:<envelope_id>` here. */
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
interface SlackBody {
  ok?: unknown;
  error?: unknown;
  url?: unknown;
  ts?: unknown;
  user_id?: unknown;
}

/**
 * What one call returned. A body that reads is either ok or refused, and a
 * body that does not read is told apart from a call that never arrived.
 */
type CallResult =
  | { kind: 'ok'; status: number; body: SlackBody }
  | { kind: 'refused'; status: number; body: SlackBody; retryAfterMs: number | null }
  | { kind: 'unreadable'; status: number }
  | { kind: 'transport'; message: string };

// ───────────────────────────────────────────────────────────────────
// 4. ESCAPE, CHUNKS AND LABELS
// ───────────────────────────────────────────────────────────────────

/**
 * Escape the three characters the provider reads as markup.
 *
 * The ampersand is replaced first, so the ampersand an entity introduces is
 * never escaped a second time. Nothing else is changed, because the text is
 * sent as it was queued and never re-rendered.
 */
export function escapeSlackText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The index of the semicolon that closes the entity an ampersand starts, or -1 when it starts none. */
function entityEnd(points: readonly string[], amp: number): number {
  for (let index = amp + 1; index < points.length && index <= amp + 5; index += 1) {
    if (points[index] === ';') return index;
  }
  return -1;
}

/**
 * Cut one already escaped text into the chunks a message may carry, each at
 * most `limit` code points.
 *
 * The count is code points, so a cut never splits a character outside the
 * basic plane. A cut that would land inside an entity moves back to the
 * ampersand that starts it, because half an entity renders as literal text.
 * An empty text is one empty chunk, because a send of nothing still has to
 * produce a receipt.
 */
export function splitSlackText(escaped: string, limit: number): string[] {
  const points = [...escaped];
  if (points.length === 0) return [''];

  // A limit below one entity cannot honour the rule, so it is raised to one code point and the walk still ends.
  const cap = Math.max(1, limit);
  const chunks: string[] = [];
  let start = 0;
  while (start < points.length) {
    let end = Math.min(start + cap, points.length);

    // Only the last ampersand in the chunk can be cut, because two entities never overlap.
    for (let index = end - 1; index > start; index -= 1) {
      if (points[index] !== '&') continue;
      if (entityEnd(points, index) >= end) end = index;
      break;
    }

    chunks.push(points.slice(start, end).join(''));
    start = end;
  }
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
 * Build the Slack transport.
 *
 * Every effect is injected, so a test drives the whole socket loop, the whole
 * inbound pipeline and the whole send with no network and no clock. The
 * transport holds only what a running listener owns: the sink, the socket, the
 * one-use socket URL a probe left behind, whether it is running and since when.
 */
export function createSlackTransport(options: SlackTransportOptions): SlackTransport {
  const apiBase = (options.apiBase ?? SLACK_API_BASE).replace(/\/+$/, '');
  const fetchImpl = options.fetch ?? (globalThis.fetch as unknown as FetchLike);
  const socketFactory =
    options.socket ?? ((url: string) => new (globalThis as unknown as { WebSocket: new (url: string) => SocketLike }).WebSocket(url));
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? (() => new Date());
  const log = options.log ?? ((line: string) => { process.stderr.write(`${line}\n`); });
  const secretOptions = options.secretOptions ?? {};

  let running = false;
  let startedAt: string | null = null;
  // A frame before start has nowhere to deliver, so the field starts as a sink that drops and start replaces it.
  let sink: ChannelSink = { push: () => {} };
  let socket: SocketLike | null = null;
  // A one-use socket URL, not a credential, so it may outlive the probe that read it.
  let pendingUrl: string | null = null;

  // ─── the call ───

  /** The wait the provider named on a refusal, in milliseconds, or null when it named none. */
  const retryAfterMsOf = (header: string | null): number | null => {
    if (header === null || header.trim() === '') return null;
    const seconds = Number(header);
    return Number.isFinite(seconds) ? seconds * 1000 : null;
  };

  /** Whether a result means the provider rejected the token rather than the request. */
  const isRejectedToken = (result: CallResult): boolean => {
    if (result.kind === 'transport' || result.kind === 'unreadable') return false;
    if (result.status === 401 || result.status === 403) return true;
    const error = result.body.error;
    return result.body.ok === false && typeof error === 'string' && SLACK_REJECTED_ERRORS.includes(error);
  };

  /** One line naming what a call did, before any token is redacted out of it. */
  const describe = (method: string, result: CallResult): string => {
    if (result.kind === 'transport') return `${method} failed: ${result.message}`;
    if (result.kind === 'unreadable') return `${method} returned an unreadable body with HTTP ${result.status}`;
    const error = result.body.error;
    if (typeof error === 'string' && error !== '') return `${method} failed: HTTP ${result.status} ${error}`;
    return `${method} failed: HTTP ${result.status}`;
  };

  /** Redact one line against every token the call resolved, so no token reaches a log or an error. */
  const redactAll = (text: string, tokens: readonly string[]): string =>
    tokens.reduce((line, token) => redactToken(line, token), text);

  /**
   * One provider call.
   *
   * The body is always read as text and then parsed, so a body that cannot be
   * read is told apart from a body that reads and refuses. The token is a
   * parameter of this call and is never stored.
   */
  const call = async (method: string, token: string, payload: Record<string, unknown>): Promise<CallResult> => {
    const init: { method: 'POST'; headers: Record<string, string>; body: string } = {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8', authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    };

    let response: FetchResponseLike;
    try {
      response = await fetchImpl(`${apiBase}/${method}`, init);
    } catch (error: unknown) {
      return { kind: 'transport', message: error instanceof Error ? error.message : String(error) };
    }

    let text: string;
    try {
      text = await response.text();
    } catch {
      return { kind: 'unreadable', status: response.status };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { kind: 'unreadable', status: response.status };
    }

    const body = (asRecord(parsed) ?? {}) as SlackBody;
    if (response.status === 200 && body.ok === true) return { kind: 'ok', status: response.status, body };
    return {
      kind: 'refused',
      status: response.status,
      body,
      retryAfterMs: retryAfterMsOf(response.headers.get('retry-after')),
    };
  };

  // ─── the probe ───

  /** The probe line for a token that could not be read, before any network call. */
  const secretFailure = (secret: { reason: string; detail?: string }): ProbeResult =>
    secret.detail === undefined
      ? { ok: false, kind: 'secret', reason: secret.reason }
      : { ok: false, kind: 'secret', reason: secret.reason, detail: secret.detail };

  /** The probe line for a call that did not succeed, told apart by whether the token was refused. */
  const probeFailure = (method: string, result: CallResult, tokens: readonly string[]): ProbeResult => {
    const detail = redactAll(describe(method, result), tokens);
    return isRejectedToken(result) ? { ok: false, kind: 'rejected', detail } : { ok: false, kind: 'failed', detail };
  };

  const probe = async (): Promise<ProbeResult> => {
    const botSecret = resolveSecret(options.stateRoot, options.identity, `${options.secretName}-bot`, secretOptions);
    if (!botSecret.ok) return secretFailure(botSecret);
    const appSecret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!appSecret.ok) return secretFailure(appSecret);

    const bot = botSecret.value;
    const app = appSecret.value;

    const auth = await call('auth.test', bot, {});
    if (auth.kind !== 'ok') return probeFailure('auth.test', auth, [bot, app]);

    const opened = await call('apps.connections.open', app, {});
    if (opened.kind !== 'ok') return probeFailure('apps.connections.open', opened, [bot, app]);

    // The URL is spent by the first connect, so it is kept for the loop that starts next and never written down.
    const url = opened.body.url;
    pendingUrl = typeof url === 'string' ? url : null;

    return { ok: true, name: String(auth.body.user_id) };
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

  // ─── the frame ───

  /**
   * The event one envelope carries, or null when it carries none.
   *
   * A typed message and a press are the only two shapes that reach a handler.
   * An edited message, a bot's own message, a sticker and every other frame
   * are not events, so each is recorded and acknowledged and reaches nothing.
   */
  const eventOf = (envelope: Record<string, unknown>, messageId: string): InboundEvent | null => {
    const payload = asRecord(envelope.payload);
    if (payload === null) return null;

    if (envelope.type === 'events_api') {
      const event = asRecord(payload.event);
      if (event === null) return null;
      if (event.type !== 'message') return null;
      if (typeof event.text !== 'string') return null;
      if (event.bot_id !== undefined) return null;
      if (event.subtype !== undefined) return null;

      const seconds = Number(event.ts);
      return {
        messageId,
        chatId: String(event.channel ?? ''),
        isGroup: event.channel_type !== 'im',
        senderId: String(event.user ?? ''),
        text: event.text,
        actionId: null,
        timestampUnixMs: Number.isFinite(seconds) ? Math.round(seconds * 1000) : now().getTime(),
        raw: envelope,
      };
    }

    if (envelope.type === 'interactive') {
      if (payload.type !== 'block_actions') return null;
      const actions = Array.isArray(payload.actions) ? payload.actions : [];
      if (actions.length === 0) return null;

      const action = asRecord(actions[0]) ?? {};
      const channel = asRecord(payload.channel);
      const container = asRecord(payload.container);
      const user = asRecord(payload.user);
      const chatId = String(channel?.id ?? container?.channel_id ?? '');

      return {
        messageId,
        chatId,
        isGroup: !chatId.startsWith('D'),
        senderId: String(user?.id ?? ''),
        text: '',
        actionId: String(action.value ?? action.action_id ?? ''),
        timestampUnixMs: now().getTime(),
        raw: envelope,
      };
    }

    return null;
  };

  /** Send one acknowledge when a socket is open. A frame before start has no socket, so the acknowledge is only returned. */
  const sendAck = (ack: string): void => {
    if (socket !== null) socket.send(ack);
  };

  const receive = (frame: string): string | null => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(frame);
    } catch {
      return null;
    }

    const envelope = asRecord(parsed);
    if (envelope === null) return null;

    if (envelope.type === 'hello') return null;

    if (envelope.type === 'disconnect') {
      // A disconnect spends the socket URL, so the loop opens a fresh one after this close.
      if (socket !== null) {
        socket.close();
        socket = null;
      }
      return null;
    }

    const envelopeId = envelope.envelope_id;
    if (typeof envelopeId !== 'string') return null;

    const messageId = `envelope:${envelopeId}`;
    const ack = JSON.stringify({ envelope_id: envelopeId });

    const event = eventOf(envelope, messageId);
    if (event === null) {
      // Not an event, so the seen record is written before the acknowledge and the frame reaches no handler.
      markSeen(messageId, null);
      sendAck(ack);
      return ack;
    }

    try {
      takeEvent(event, sink);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      // A provider string can reach this line, so it is redacted against the bot token, read here and dropped with the call.
      const secret = resolveSecret(options.stateRoot, options.identity, `${options.secretName}-bot`, secretOptions);
      log(redactToken(`bots: slack envelope not taken: ${message}`, secret.ok ? secret.value : null));
      return null;
    }

    // The seen record is written inside takeEvent before this line runs, so the acknowledge never runs ahead of one.
    sendAck(ack);
    return ack;
  };

  // ─── the socket loop ───

  const start = async (next: ChannelSink): Promise<void> => {
    running = true;
    startedAt = now().toISOString();
    sink = next;

    while (running) {
      let url = pendingUrl;
      pendingUrl = null;

      if (url === null) {
        const secret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
        if (!secret.ok) {
          const detail = secret.detail === undefined ? secret.reason : `${secret.reason}: ${secret.detail}`;
          log(`bots: slack connect failed: ${detail}`);
          await sleep(SLACK_RECONNECT_MS);
          continue;
        }

        const app = secret.value;
        const opened = await call('apps.connections.open', app, {});
        if (opened.kind !== 'ok') {
          log(redactToken(`bots: slack connect failed: ${describe('apps.connections.open', opened)}`, app));
          await sleep(SLACK_RECONNECT_MS);
          continue;
        }

        const openedUrl = opened.body.url;
        url = typeof openedUrl === 'string' ? openedUrl : null;
        if (url === null) {
          log('bots: slack connect failed: apps.connections.open returned no url');
          await sleep(SLACK_RECONNECT_MS);
          continue;
        }
      }

      // A stop that landed during the connect await leaves no socket to close, so the loop ends before it opens one.
      if (!running) break;

      const opened = socketFactory(url);
      socket = opened;
      await new Promise<void>((resolve) => {
        let settled = false;
        const settle = (): void => {
          if (settled) return;
          settled = true;
          resolve();
        };
        opened.addEventListener('message', (event) => { receive(String(event.data)); });
        opened.addEventListener('close', settle);
        opened.addEventListener('error', settle);
      });
      socket = null;

      if (!running) break;
      await sleep(SLACK_RECONNECT_MS);
    }
  };

  const stop = async (): Promise<void> => {
    running = false;
    if (socket !== null) {
      socket.close();
      socket = null;
    }
  };

  // ─── the send ───

  /** The blocks one button message carries: the section that holds the text, then one actions block per row of buttons. */
  const blocksFor = (chunk: string, itemId: string, labels: readonly string[]): unknown[] => {
    const blocks: unknown[] = [{ type: 'section', text: { type: 'mrkdwn', text: chunk } }];
    for (let start = 0; start < labels.length; start += SLACK_BUTTONS_PER_BLOCK) {
      const elements = labels.slice(start, start + SLACK_BUTTONS_PER_BLOCK).map((label, offset) => {
        const actionId = actionIdFor(itemId, start + offset + 1);
        return { type: 'button', text: { type: 'plain_text', text: label }, action_id: actionId, value: actionId };
      });
      blocks.push({ type: 'actions', elements });
    }
    return blocks;
  };

  /** One line naming what a failed send did, in the two forms a caller reads. */
  const sendFailure = (result: CallResult): string => {
    if (result.kind === 'transport') return `Slack chat.postMessage failed: ${result.message}`;
    if (result.kind === 'unreadable') return `Slack chat.postMessage returned an unreadable body with HTTP ${result.status}`;
    const error = result.body.error;
    if (result.status === 200 && typeof error === 'string' && error !== '') {
      return `Slack chat.postMessage answered ok false: ${error}`;
    }
    return `Slack chat.postMessage rejected with HTTP ${result.status}`;
  };

  /**
   * The error one failed send reports.
   *
   * A transport error, a server error and an unreadable body each mean the
   * provider may have taken the message, so each sets sentBeforeError. A rate
   * limit is the one error worth retrying, and it carries the wait the
   * provider named. Every other refusal sets both flags false, and an earlier
   * chunk that landed makes sentBeforeError true whatever the later error is.
   */
  const sendError = (result: CallResult, token: string, landed: boolean): SendErrorWithWait => {
    const message = redactToken(sendFailure(result), token);

    if (result.kind === 'transport') {
      return { kind: 'transport-error', message, unsupported: false, retryable: false, sentBeforeError: true };
    }

    if (result.status >= 500) {
      return { kind: 'server-error', message, unsupported: false, retryable: false, sentBeforeError: true };
    }

    const limited = result.status === 429 || (result.kind === 'refused' && result.body.error === 'ratelimited');
    if (limited) {
      const error: SendErrorWithWait = { kind: 'rate-limited', message, unsupported: false, retryable: true, sentBeforeError: landed };
      if (result.kind === 'refused' && result.retryAfterMs !== null) error.retryAfterMs = result.retryAfterMs;
      return error;
    }

    if (result.kind === 'unreadable' && result.status === 200) {
      return { kind: 'unreadable-response', message, unsupported: false, retryable: false, sentBeforeError: true };
    }

    return { kind: 'rejected', message, unsupported: false, retryable: false, sentBeforeError: landed };
  };

  const send = async (intent: ChannelOutboundIntent): Promise<ChannelSendResult> => {
    const refused = checkDeclared('slack', CAPABILITY_MATRIX.slack, intent);
    if (refused !== null) return refused;

    const secret = resolveSecret(options.stateRoot, options.identity, `${options.secretName}-bot`, secretOptions);
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
    const bot = secret.value;

    // The text is sent as it was queued, never re-rendered, so the escape runs before the cut and no chunk passes the cap.
    const chunks = splitSlackText(escapeSlackText(intent.text), SLACK_CHUNK_CHARS);

    const itemId = intent.kind === 'buttons' ? intent.itemId : null;
    const choices = intent.kind === 'buttons' ? intent.choices : null;
    const labels = itemId !== null && choices !== null ? buttonLabels(choices) : null;

    // The buttons ride the last chunk, so that chunk is cut again to the section cap the provider allows.
    if (labels !== null && itemId !== null) {
      const last = chunks[chunks.length - 1];
      if ([...last].length > SLACK_SECTION_CHARS) {
        chunks.splice(chunks.length - 1, 1, ...splitSlackText(last, SLACK_SECTION_CHARS));
      }
    }

    const platformMessageIds: string[] = [];
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const payload: Record<string, unknown> = { channel: intent.conversationId, text: chunk };
      if (labels !== null && itemId !== null && index === chunks.length - 1) {
        payload.blocks = blocksFor(chunk, itemId, labels);
      }

      const result = await call('chat.postMessage', bot, payload);
      if (result.kind !== 'ok') return { ok: false, error: sendError(result, bot, platformMessageIds.length > 0) };

      platformMessageIds.push(String(result.body.ts));
    }

    return { ok: true, receipt: { platformMessageIds, primaryPlatformMessageId: platformMessageIds[0] } };
  };

  return {
    descriptor: (): ChannelDescriptor => CHANNEL_DESCRIPTORS.slack,
    declaredCapabilities: (): ChannelCapabilities => CAPABILITY_MATRIX.slack,
    status: (): ChannelStatus => ({ running, startedAt }),
    start,
    stop,
    send,
    probe,
    receive,
  };
}
