// ───────────────────────────────────────────────────────────────────
// MODULE: Signal Channel Transport
// ───────────────────────────────────────────────────────────────────
//
// `bots channel listen signal` runs this transport, and a local signal-cli
// daemon is the whole inbound path: the daemon holds the account, the events
// arrive over Server-Sent Events and a send is one JSON-RPC call. The daemon
// belongs to the operator and listens on loopback only, so this module opens no
// port, holds no tunnel and reaches nothing beyond the address it is given.
// Every call, every clock and every pause is injected, so a test points the
// transport at an ephemeral loopback port and drives the whole stream with no
// daemon.
//
// The account number is read from the vault inside each call that needs it and
// held in a local of that call only, so no field, no state file, no queue entry
// and no log line carries it. Every URL, every detail and every log line passes
// through the redaction helper, so the number reads <redacted> where it was.
//
// Signal has no acknowledge, so the seen record is the only thing that stops a
// redelivery being answered twice: the daemon may resend an event after a
// reconnect, and the record drops it. A group answer is refused with the group
// reply, because an approval is taken in a direct chat only. A send whose
// outcome is unknown is never repeated, because the JSON-RPC id is a fresh
// random value per request and no id is an idempotency key, so a retry is a
// second send.

import { randomUUID } from 'node:crypto';
import { TextDecoder } from 'node:util';

import { answerItem } from './answer.js';
import { answerFromChat } from './channel-approval.js';
import { pairChat, resolveLink } from './channel-link.js';
import { enqueueChannel, listQueueEntries, replyKey } from './channel-queue.js';
import { CAPABILITY_MATRIX, CHANNEL_DESCRIPTORS, checkDeclared, readSeenRecord, redactToken, REPLIES, writeSeenRecord } from './channel.js';
import { botDefined, CHAT_SOURCE, cleanMessageText, renderChannelBlock } from './conversation.js';
import { enqueueFromCheckout } from './request-queue.js';
import { resolveSecret } from './secrets.js';

import type { ChannelAnswerFn } from './channel-approval.js';
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

/** The daemon address a listener uses when its caller names none. The daemon is the operator's and listens on loopback only. */
export const SIGNAL_DAEMON_URL = 'http://127.0.0.1:8080';

/** The most code points one message may carry, counted in code points because the daemon counts characters and not bytes. */
export const SIGNAL_CHUNK_CHARS = 2000;

/** How long the loop waits before it reconnects, and the value a successful stream resets the wait to. */
export const SIGNAL_RECONNECT_MS = 2_000;

/** The longest the loop waits between reconnects, so a daemon outage is not a busy loop and not an unbounded backoff. */
export const SIGNAL_RECONNECT_MAX_MS = 60_000;

/** The prefix a group conversation id carries, so a send knows to address a group and not a person. */
export const SIGNAL_GROUP_PREFIX = 'group:';

/**
 * The line a chat is sent when it names no bot this host runs. It names
 * neither the address tried nor the bots this host runs, so a stranger learns
 * nothing about the roster.
 */
export const BOT_UNKNOWN_REPLY = 'This message names no bot this host runs. Start it with @ and the bot id, for example @digest Which channel?';

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

/** What a start probe found, so the listen verb prints one line and picks one exit. */
export type ProbeResult =
  | { ok: true; name: string }
  | { ok: false; kind: 'secret'; reason: string; detail?: string }
  | { ok: false; kind: 'unreachable'; detail: string };

/** What one event stream read did, so the loop knows whether to reset its wait or grow it. */
export type StreamResult =
  | { ok: true; events: number; emitted: number }
  | { ok: false; detail: string };

/** Everything the transport reads from its caller, so it holds no path, no clock and no network of its own. */
export interface SignalTransportOptions {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  /** The vault name of the account's E.164 number, the channel config entry's secret. */
  secretName: string;
  env?: NodeJS.ProcessEnv;
  resolveEnv?: NodeJS.ProcessEnv;
  secretOptions?: SecretStoreOptions;
  fetch?: typeof globalThis.fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => Date;
  log?: (line: string) => void;
  /** Defaults to SIGNAL_DAEMON_URL. A test passes its own, so it can point at an ephemeral loopback port. */
  daemonUrl?: string;
}

/** The Signal adapter, with the probe, one event and one stream read a test drives without a loop. */
export interface SignalTransport extends ChannelAdapter {
  /** Resolve the account, then call the daemon's health check once. */
  probe(): Promise<ProbeResult>;
  /** Take the data text of one Server-Sent Event. */
  receive(data: string): { emitted: boolean };
  /** Read one event stream until it ends, fails or a stop aborts it. */
  streamOnce(): Promise<StreamResult>;
}

/** The channel name every record this transport writes carries. */
const CHANNEL: ConfiguredChannel = 'signal';

/** One inbound event the pipeline takes, normalised from the daemon's own shape. */
interface InboundEvent {
  /** The seen-record id, `<sender>:<timestamp>` here. */
  messageId: string;
  /** The sender's number in a direct chat, the group id with its prefix in a group. */
  chatId: string;
  isGroup: boolean;
  /** The sender's number, which is also the chat id of that person's direct chat. */
  senderId: string;
  text: string;
  /** Always null, because Signal declares no buttons. */
  actionId: string | null;
  timestampUnixMs: number;
  raw: unknown;
}

// ───────────────────────────────────────────────────────────────────
// 3. CHUNKS AND BODY READING
// ───────────────────────────────────────────────────────────────────

/**
 * Cut one text into the chunks a message may carry, each at most `limit` code
 * points.
 *
 * The walk counts one code point at a time, so a chunk never ends inside a code
 * point and a character outside the basic plane is never split. An empty text
 * is one empty chunk, because a send of nothing still has to produce a receipt.
 */
function splitCodePoints(text: string, limit: number): string[] {
  const points = [...text];
  if (points.length === 0) return [''];
  const chunks: string[] = [];
  for (let start = 0; start < points.length; start += limit) {
    chunks.push(points.slice(start, start + limit).join(''));
  }
  return chunks;
}

/** Read one JSON value as an object, or null when it is not one. */
function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

/** The message of a thrown value, so a log line never prints an object. */
function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The code a thrown fetch error carries, read from the error itself or from its cause. */
function errorCodeOf(error: unknown): string | null {
  const own = asRecord(error)?.code;
  if (typeof own === 'string') return own;
  const cause = asRecord(asRecord(error)?.cause)?.code;
  return typeof cause === 'string' ? cause : null;
}

// ───────────────────────────────────────────────────────────────────
// 4. THE TRANSPORT
// ───────────────────────────────────────────────────────────────────

/**
 * Build the Signal transport.
 *
 * Every effect is injected, so a test drives the whole stream, the whole
 * inbound pipeline and the whole send with no daemon and no clock. The
 * transport holds only what a running listener owns: the sink, whether it is
 * running, the controller of the stream in flight and the gate a stop opens.
 */
export function createSignalTransport(options: SignalTransportOptions): SignalTransport {
  const base = (options.daemonUrl ?? SIGNAL_DAEMON_URL).replace(/\/+$/, '');
  const fetchImpl = options.fetch ?? globalThis.fetch;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? (() => new Date());
  const log = options.log ?? ((line: string) => { process.stderr.write(`${line}\n`); });
  const secretOptions = options.secretOptions ?? {};

  let running = false;
  let startedAt: string | null = null;
  // A stream before start has nowhere to deliver, so the field starts as a sink that drops and start replaces it.
  let sink: ChannelSink = { push: () => {} };
  let inFlight: AbortController | null = null;
  // Only a stop sets this, and it is never cleared, so a transport instance runs one loop and no second one.
  let stopped = false;
  let releaseStop: () => void = () => {};
  // A stop that lands during a pause resolves this gate, so the loop wakes at once instead of waiting the delay out.
  const stopGate = new Promise<void>((resolve) => { releaseStop = resolve; });

  // ─── the probe ───

  const probe = async (): Promise<ProbeResult> => {
    const secret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!secret.ok) {
      return secret.detail === undefined
        ? { ok: false, kind: 'secret', reason: secret.reason }
        : { ok: false, kind: 'secret', reason: secret.reason, detail: secret.detail };
    }
    const account = secret.value;

    let response: Response;
    try {
      response = await fetchImpl(`${base}/api/v1/check`, { method: 'GET' });
    } catch (error: unknown) {
      return {
        ok: false,
        kind: 'unreachable',
        detail: redactToken(`GET /api/v1/check failed at ${base}: ${messageOf(error)}`, account),
      };
    }

    if (response.status !== 200) {
      return {
        ok: false,
        kind: 'unreachable',
        detail: redactToken(`GET /api/v1/check answered HTTP ${response.status} at ${base}`, account),
      };
    }

    return { ok: true, name: account };
  };

  // ─── the seen record and the reply ───

  /** Write the seen record of one message, so a redelivery is recognised before the event is pushed. */
  const markSeen = (messageId: string, requestId: string | null): void => {
    writeSeenRecord(options.stateRoot, options.identity, { channel: CHANNEL, messageId, requestId }, now());
  };

  /**
   * Queue one reply to one inbound message.
   *
   * A reply that cannot be queued is logged and never thrown, because the seen
   * record is already written and a throw would only lose the event.
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

  // ─── the answer path ───

  /** Whether the prompt of one item went out on one conversation, the only prompt a typed reply answers. */
  const deliveredOn = (conversationId: string): ((itemId: string) => boolean) => (itemId) =>
    listQueueEntries(options.stateRoot, options.identity).some(
      (entry) =>
        entry.itemId === itemId &&
        entry.channel === CHANNEL &&
        entry.conversationId === conversationId &&
        entry.state === 'delivered',
    );

  /** The answer call one chat makes, bound to the actor its link names and to the channel surface. */
  const answerAs = (actor: string): ChannelAnswerFn => (input) => {
    const result = answerItem({
      checkoutRoot: options.checkoutRoot,
      itemId: input.itemId,
      text: input.text,
      env: options.env,
      resolveEnv: options.resolveEnv,
      actor,
      surface: 'channel',
      now: now(),
    });
    return result.ok
      ? { ok: true, value: { status: result.value.status, itemId: result.value.itemId } }
      : { ok: false, reason: result.reason, ...(result.detail !== undefined ? { detail: result.detail } : {}) };
  };

  // ─── the inbound pipeline ───

  /**
   * Take one inbound event.
   *
   * Every call it makes is synchronous, so a throw leaves the event without a
   * seen record and the daemon's next delivery of it is taken again. The steps
   * run in this order and no other.
   */
  const takeEvent = (event: InboundEvent, sink: ChannelSink): { emitted: boolean } => {
    // P1. A redelivery is dropped here, because Signal has no acknowledge and the daemon may resend after a reconnect.
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

    if (event.isGroup) {
      // P3. A group speaks for the actor its sender linked in a direct chat, so the sender's own link is the gate.
      const link = resolveLink(options.stateRoot, options.identity, CHANNEL, event.senderId, event.senderId);
      if (!link.ok) {
        // A damaged links file must not drop a message, so the event stays without a seen record.
        if (link.reason !== 'channel-unlinked') throw new Error(`${link.reason}: ${link.detail ?? ''}`);

        // A stranger in a group learns nothing, so the event is dropped in silence.
        markSeen(event.messageId, null);
        return { emitted: false };
      }

      // P4. A linked sender reaches the answer path, which refuses a group answer with the group reply.
      const outcome = answerFromChat({
        stateRoot: options.stateRoot,
        identity: options.identity,
        channel: CHANNEL,
        conversation: inbound.conversation,
        actor: link.value.actor,
        actionId: event.actionId,
        text: event.text,
        delivered: deliveredOn(event.chatId),
        answer: answerAs(link.value.actor),
        now: now(),
      });
      if (!outcome.ok) throw new Error(`${outcome.reason}: ${outcome.detail ?? ''}`);

      // P5. No run starts from a group, so a chat line queues nothing and only a refusal is answered.
      const groupReply = outcome.value.kind === 'reply' ? outcome.value.text : null;

      // P6. The seen record is written before the event is pushed.
      markSeen(event.messageId, null);

      // P7. A reply that cannot be queued is logged and never thrown, because the seen record is already written.
      queueReply(groupReply, event);

      // P8. Only an event that reached the answer path is emitted.
      sink.push(inbound);
      return { emitted: true };
    }

    // P3. The link decides whether this chat may speak for an actor at all.
    const link = resolveLink(options.stateRoot, options.identity, CHANNEL, event.chatId, event.senderId);
    if (!link.ok) {
      // A damaged links file must not drop a message, so the event stays without a seen record.
      if (link.reason !== 'channel-unlinked') throw new Error(`${link.reason}: ${link.detail ?? ''}`);

      // A sender who is not the person the chat linked is dropped in silence.
      if (link.detail === 'sender mismatch') {
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

    // P4. A linked chat reaches the answer path, which owns the reply grammar.
    const actor = link.value.actor;
    const outcome = answerFromChat({
      stateRoot: options.stateRoot,
      identity: options.identity,
      channel: CHANNEL,
      conversation: inbound.conversation,
      actor,
      actionId: event.actionId,
      text: event.text,
      delivered: deliveredOn(event.chatId),
      answer: answerAs(actor),
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

    // P6. The seen record is written before the event is pushed.
    markSeen(event.messageId, requestId);

    // P7. A reply that cannot be queued is logged and never thrown, because the seen record is already written.
    queueReply(replyText, event);

    // P8. Only an event that reached the answer path is emitted.
    sink.push(inbound);
    return { emitted: true };
  };

  // ─── the event ───

  /**
   * Take the data text of one Server-Sent Event.
   *
   * A receipt, a reaction, a delete, a typing notice and a story all arrive
   * without a text, so none of them is an event and none writes a seen record.
   * A throw from the pipeline propagates, because the caller decides whether
   * the read goes on.
   */
  const receive = (data: string): { emitted: boolean } => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      log('bots: signal event not read');
      return { emitted: false };
    }

    const envelope = asRecord(asRecord(parsed)?.envelope);
    const dm = asRecord(envelope?.dataMessage);
    const text = dm?.message;
    if (dm === null || typeof text !== 'string' || text === '') return { emitted: false };

    const sourceNumber = envelope?.sourceNumber;
    const source = envelope?.source;
    const sender = typeof sourceNumber === 'string' && sourceNumber !== '' ? sourceNumber : source;
    if (typeof sender !== 'string' || sender === '') return { emitted: false };

    const dmStamp = dm.timestamp;
    const envelopeStamp = envelope?.timestamp;
    const timestamp = typeof dmStamp === 'number' ? dmStamp : typeof envelopeStamp === 'number' ? envelopeStamp : null;
    if (timestamp === null) return { emitted: false };

    const groupId = asRecord(dm.groupInfo)?.groupId;
    const group = typeof groupId === 'string' && groupId !== '' ? groupId : null;

    const event: InboundEvent = {
      messageId: `${sender}:${timestamp}`,
      chatId: group === null ? sender : `${SIGNAL_GROUP_PREFIX}${group}`,
      isGroup: group !== null,
      senderId: sender,
      text,
      actionId: null,
      timestampUnixMs: timestamp,
      raw: parsed,
    };
    return takeEvent(event, sink);
  };

  // ─── the stream ───

  const streamOnce = async (): Promise<StreamResult> => {
    const secret = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!secret.ok) {
      return { ok: false, detail: secret.detail === undefined ? secret.reason : `${secret.reason}: ${secret.detail}` };
    }
    const account = secret.value;

    const controller = new AbortController();
    inFlight = controller;
    try {
      let response: Response;
      try {
        response = await fetchImpl(`${base}/api/v1/events?account=${encodeURIComponent(account)}`, {
          method: 'GET',
          headers: { accept: 'text/event-stream' },
          signal: controller.signal,
        });
      } catch (error: unknown) {
        // A stop aborts the request, and that is the loop ending rather than a failure.
        if (controller.signal.aborted) return { ok: true, events: 0, emitted: 0 };
        return { ok: false, detail: redactToken(`GET /api/v1/events failed at ${base}: ${messageOf(error)}`, account) };
      }

      if (response.status !== 200) {
        return { ok: false, detail: redactToken(`GET /api/v1/events answered HTTP ${response.status} at ${base}`, account) };
      }

      const body = response.body;
      if (body === null) {
        return { ok: false, detail: redactToken(`GET /api/v1/events returned no body at ${base}`, account) };
      }

      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let gathered: string | null = null;
      let events = 0;
      let emitted = 0;

      /** Take the data one event gathered, so a throw from the pipeline never stops the read. */
      const dispatch = (): void => {
        if (gathered === null) return;
        const data = gathered;
        gathered = null;
        events += 1;
        try {
          if (receive(data).emitted) emitted += 1;
        } catch (error: unknown) {
          // The daemon never resends an event, so a pipeline throw is logged and the read goes on.
          log(redactToken(`bots: signal event not taken: ${messageOf(error)}`, account));
        }
      };

      try {
        for (;;) {
          const chunk = await reader.read();
          if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });

          let end = buffer.indexOf('\n');
          while (end !== -1) {
            const raw = buffer.slice(0, end);
            buffer = buffer.slice(end + 1);
            const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw;

            if (line === '') {
              // An empty line ends the event, so whatever it gathered is taken now.
              dispatch();
            } else if (line.startsWith(':')) {
              // A comment line is a keepalive, so it carries nothing.
            } else if (line.startsWith('data:')) {
              const text = line.slice('data:'.length).replace(/^\s+/, '');
              gathered = gathered === null ? text : `${gathered}\n${text}`;
            }
            // Every other field line is ignored, so an event name is never read.

            end = buffer.indexOf('\n');
          }
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) return { ok: true, events, emitted };
        return { ok: false, detail: redactToken(`GET /api/v1/events failed at ${base}: ${messageOf(error)}`, account) };
      }

      // Data left over when the stream ends is taken once more before the reconnect.
      dispatch();
      return { ok: true, events, emitted };
    } finally {
      if (inFlight === controller) inFlight = null;
    }
  };

  // ─── the send ───

  /** The error one failed send reports, with the account redacted out of the message. */
  const sendError = (
    kind: string,
    detail: string,
    account: string,
    retryable: boolean,
    sentBeforeError: boolean,
  ): SendErrorWithWait => ({
    kind,
    message: redactToken(detail, account),
    unsupported: false,
    retryable,
    sentBeforeError,
  });

  const send = async (intent: ChannelOutboundIntent): Promise<ChannelSendResult> => {
    const refused = checkDeclared('signal', CAPABILITY_MATRIX.signal, intent);
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
    const account = secret.value;

    // The text is sent as it was queued, cut on code points because the daemon counts characters and not bytes.
    const chunks = splitCodePoints(intent.text, SIGNAL_CHUNK_CHARS);
    const group = intent.conversationId.startsWith(SIGNAL_GROUP_PREFIX);
    const platformMessageIds: string[] = [];

    for (const message of chunks) {
      const params = group
        ? { account, groupId: intent.conversationId.slice(SIGNAL_GROUP_PREFIX.length), message }
        : { account, recipient: [intent.conversationId], message };
      const body = JSON.stringify({ jsonrpc: '2.0', method: 'send', params, id: randomUUID() });

      let response: Response;
      try {
        response = await fetchImpl(`${base}/api/v1/rpc`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
        });
      } catch (error: unknown) {
        const landed = platformMessageIds.length > 0;
        // A refused connection never reached the daemon, so nothing was sent and the queue keeps the entry.
        if (!landed && errorCodeOf(error) === 'ECONNREFUSED') {
          return {
            ok: false,
            error: sendError('channel-daemon-unreachable', `Signal send failed at ${base}: ${messageOf(error)}`, account, false, false),
          };
        }
        return {
          ok: false,
          error: sendError('transport-error', `Signal send failed at ${base}: ${messageOf(error)}`, account, false, true),
        };
      }

      let text: string | null = null;
      try {
        text = await response.text();
      } catch {
        text = null;
      }

      if (response.status >= 500) {
        return {
          ok: false,
          error: sendError('server-error', `Signal send answered HTTP ${response.status} at ${base}`, account, false, true),
        };
      }

      let parsed: unknown = null;
      if (text !== null) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }
      }
      if (text === null || parsed === null) {
        return {
          ok: false,
          error: sendError(
            'unreadable-response',
            `Signal send returned an unreadable body with HTTP ${response.status} at ${base}`,
            account,
            false,
            true,
          ),
        };
      }

      const landed = platformMessageIds.length > 0;
      const errorBody = asRecord(asRecord(parsed)?.error);
      if (errorBody !== null) {
        const detail = typeof errorBody.message === 'string' ? errorBody.message : 'unknown';
        if (/rate ?limit/i.test(detail)) {
          return { ok: false, error: sendError('rate-limited', `Signal send was rate limited: ${detail}`, account, true, landed) };
        }
        return { ok: false, error: sendError('rejected', `Signal send was rejected: ${detail}`, account, false, landed) };
      }

      if (response.status < 200 || response.status > 299) {
        return {
          ok: false,
          error: sendError('rejected', `Signal send answered HTTP ${response.status} at ${base}`, account, false, landed),
        };
      }

      const timestamp = asRecord(asRecord(parsed)?.result)?.timestamp;
      if (typeof timestamp !== 'number') {
        return {
          ok: false,
          error: sendError(
            'unreadable-response',
            `Signal send returned no timestamp with HTTP ${response.status} at ${base}`,
            account,
            false,
            true,
          ),
        };
      }
      platformMessageIds.push(String(timestamp));
    }

    return { ok: true, receipt: { platformMessageIds, primaryPlatformMessageId: platformMessageIds[0] } };
  };

  // ─── the loop ───

  /** Wait one reconnect delay, or less when a stop lands first, so a stop never waits out a pause. */
  const pause = async (ms: number): Promise<void> => {
    await Promise.race([sleep(ms), stopGate]);
  };

  const start = async (next: ChannelSink): Promise<void> => {
    // A stop that landed before start leaves nothing to run, so the loop never begins.
    if (stopped) return;

    running = true;
    startedAt = now().toISOString();
    sink = next;
    let wait = SIGNAL_RECONNECT_MS;

    while (!stopped) {
      const result = await streamOnce();
      if (stopped) break;

      if (result.ok) {
        // A stream that ended normally waits the first value again, not the grown one.
        wait = SIGNAL_RECONNECT_MS;
        await pause(SIGNAL_RECONNECT_MS);
        continue;
      }

      log(`bots: signal ${result.detail}`);
      await pause(wait);
      wait = Math.min(wait * 2, SIGNAL_RECONNECT_MAX_MS);
    }

    running = false;
  };

  const stop = async (): Promise<void> => {
    stopped = true;
    running = false;
    if (inFlight !== null) {
      inFlight.abort();
      inFlight = null;
    }
    releaseStop();
  };

  return {
    descriptor: (): ChannelDescriptor => CHANNEL_DESCRIPTORS.signal,
    declaredCapabilities: (): ChannelCapabilities => CAPABILITY_MATRIX.signal,
    status: (): ChannelStatus => ({ running, startedAt }),
    start,
    stop,
    send,
    probe,
    receive,
    streamOnce,
  };
}
