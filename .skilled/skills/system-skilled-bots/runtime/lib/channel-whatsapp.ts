// ───────────────────────────────────────────────────────────────────
// MODULE: WhatsApp Channel Transport
// ───────────────────────────────────────────────────────────────────
//
// `bots channel listen whatsapp` runs this transport, and the Cloud API
// webhook is the whole inbound path. The listener binds loopback only, so the
// operator's tunnel is the public side and this module never opens a port a
// network can reach.
//
// The signature is checked over the raw bytes in constant time before any
// parse, so a body the app secret did not sign is refused without its content
// ever being read. A missing header, a malformed value and a wrong digest
// answer the same status and log the same line, so a caller learns nothing
// from the difference.
//
// The 200 is written only after every message of the body is durable, because
// the provider posts the body again when it sees no 2xx and the seen record is
// what drops a message already taken. A later failed status moves a delivered
// entry to failed, so a reply never resolves against a prompt the person never
// saw.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

import { answerItem } from './answer.js';
import { answerFromChat, removePromptEntry } from './channel-approval.js';
import { pairChat, resolveLink } from './channel-link.js';
import { enqueueChannel, failDeliveredEntry, listQueueEntries, replyKey, writeSentRecord } from './channel-queue.js';
import { CAPABILITY_MATRIX, CHANNEL_DESCRIPTORS, checkDeclared, readSeenRecord, redactToken, REPLIES, writeSeenRecord } from './channel.js';
import { botDefined, CHAT_SOURCE, cleanMessageText, renderChannelBlock } from './conversation.js';
import { enqueueFromCheckout } from './request-queue.js';
import { resolveSecret } from './secrets.js';

import type { IncomingMessage, Server, ServerResponse } from 'node:http';
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

/** The host the listener binds. Loopback only, because the operator's tunnel is the public side. */
export const WHATSAPP_LISTEN_HOST = '127.0.0.1';

/** The port the listener binds when its caller names none. */
export const WHATSAPP_LISTEN_PORT = 8787;

/** The most bytes one webhook body may carry, counted as they arrive because a declared length is not trusted. */
export const WHATSAPP_MAX_BODY_BYTES = 2 * 1024 * 1024;

/** The header the app secret signs the raw body into. */
export const WHATSAPP_SIGNATURE_HEADER = 'X-Hub-Signature-256';

/** The Graph base every send is posted under. */
export const WHATSAPP_GRAPH_BASE = 'https://graph.facebook.com';

/** The Graph version every send is posted under. */
export const WHATSAPP_GRAPH_VERSION = 'v23.0';

/** The most code points one message may carry, counted in code points because the provider counts them. */
export const WHATSAPP_CHUNK_CHARS = 4096;

/** The suffix of the app secret, the key the webhook signature is checked with. */
export const WHATSAPP_APP_SECRET_SUFFIX = '-app-secret';

/** The suffix of the verify token, the value the handshake compares. */
export const WHATSAPP_VERIFY_TOKEN_SUFFIX = '-verify-token';

/** The suffix of the phone number id, the number this host serves. */
export const WHATSAPP_PHONE_NUMBER_ID_SUFFIX = '-phone-number-id';

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
export type ProbeResult = { ok: true; name: string } | { ok: false; kind: 'secret'; reason: string; detail?: string };

// ───────────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────────

/** Everything the transport reads from its caller, so it holds no path, no clock and no network of its own. */
export interface WhatsAppTransportOptions {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  /** The vault name of the access token, and the base of the three derived names. */
  secretName: string;
  env?: NodeJS.ProcessEnv;
  resolveEnv?: NodeJS.ProcessEnv;
  secretOptions?: SecretStoreOptions;
  /** The fetch the Graph send uses. This build sends nothing, so it is read by no call yet. */
  fetch?: FetchLike;
  now?: () => Date;
  log?: (line: string) => void;
  /** Defaults to WHATSAPP_LISTEN_PORT. A test passes 0, so it binds an ephemeral port and never the fixed one. */
  listenPort?: number;
  /** Defaults to WHATSAPP_GRAPH_BASE with trailing slashes trimmed. */
  graphBase?: string;
  /** Defaults to the platform parser. A test passes a spy, so an unsigned body proves it was never read. */
  parseJson?: (text: string) => unknown;
}

/** The WhatsApp adapter, with the probe and the bound address a caller reads while it listens. */
export interface WhatsAppTransport extends ChannelAdapter {
  /** Resolve the four secrets in order. It makes no network call and binds nothing. */
  probe(): Promise<ProbeResult>;
  /** The bound host and port while listening, else null. */
  address(): { host: string; port: number } | null;
}

/** The channel name every record this transport writes carries. */
const CHANNEL: ConfiguredChannel = 'whatsapp';

/** One inbound event the pipeline takes, normalised from the provider's own shape. */
interface InboundEvent {
  /** The seen-record id, the provider's own message id here. */
  messageId: string;
  /** The provider chat id, as a string. */
  chatId: string;
  isGroup: boolean;
  /** The provider-asserted sender id, as a string. */
  senderId: string;
  /** The typed text. */
  text: string;
  /** The button's action id on a press, null on a typed line. */
  actionId: string | null;
  timestampUnixMs: number;
  raw: unknown;
}

/** The fields of one inbound message this transport reads. */
interface WhatsAppMessage {
  id?: unknown;
  from?: unknown;
  type?: unknown;
  text?: unknown;
  timestamp?: unknown;
}

/** The fields of one delivery status this transport reads. */
interface WhatsAppStatus {
  id?: unknown;
  status?: unknown;
  errors?: unknown;
}

/** What one body read produced, and whether it passed the size bound. */
interface BodyRead {
  over: boolean;
  body: Buffer;
}

/** What one Graph send call produced, before it is turned into a send error. */
type ChunkResult =
  | { kind: 'ok'; id: string }
  | { kind: 'transport'; message: string }
  | { kind: 'unreadable'; status: number; retryAfterMs: number | null }
  | { kind: 'refused'; status: number; retryAfterMs: number | null; detail: string | null };

/** What one Graph send call produced when it did not succeed. */
type ChunkFailure = Exclude<ChunkResult, { kind: 'ok' }>;

// ───────────────────────────────────────────────────────────────────
// 4. BODY READING AND THE SIGNATURE
// ───────────────────────────────────────────────────────────────────

/** Read one JSON value as an object, or null when it is not one. */
function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

/**
 * Read one request body as bytes, counting them as they arrive.
 *
 * A declared length is not trusted, because a caller controls it. Once the
 * count passes the bound the kept chunks are dropped and the rest is still
 * read, so the socket drains and the caller gets an answer instead of a reset.
 */
function readBody(request: IncomingMessage): Promise<BodyRead> {
  return new Promise<BodyRead>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    let over = false;
    request.on('data', (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > WHATSAPP_MAX_BODY_BYTES) {
        over = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve({ over, body: Buffer.concat(chunks) }));
    request.on('error', reject);
  });
}

/**
 * Whether one signature header signs these exact bytes with this app secret.
 *
 * The digest is computed over the raw bytes as received, so a body that was
 * re-encoded after signing never verifies. Both sides are compared only after
 * their lengths match, because the constant-time compare throws on a length
 * difference and a throw would tell a caller which of the three failures it
 * caused.
 */
function signatureOk(header: string | string[] | undefined, appSecret: string, rawBody: Buffer): boolean {
  if (typeof header !== 'string') return false;
  const match = /^sha256=([0-9a-fA-F]{64})$/.exec(header.trim());
  if (match === null) return false;
  const expected = createHmac('sha256', appSecret).update(rawBody).digest();
  const given = Buffer.from(match[1], 'hex');
  if (given.length !== 32 || expected.length !== 32) return false;
  return timingSafeEqual(given, expected);
}

/**
 * Whether one handshake token equals the stored one.
 *
 * Both sides are compared only after their lengths match, because the
 * constant-time compare throws on a length difference and a throw would answer
 * a different status than a mismatch. An empty stored token matches nothing, so
 * a host with no verify token configured verifies no caller.
 */
function sameVerifyToken(given: string | null, stored: string): boolean {
  if (given === null || stored === '') return false;
  const a = Buffer.from(given, 'utf8');
  const b = Buffer.from(stored, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ───────────────────────────────────────────────────────────────────
// 5. THE TRANSPORT
// ───────────────────────────────────────────────────────────────────

/**
 * Build the WhatsApp transport.
 *
 * Every effect is injected, so a test drives the whole webhook, the whole
 * inbound pipeline and the whole send with no network and no clock. The
 * transport holds only what a running listener owns: the sink, the server, the
 * bound address and whether it is running.
 */
export function createWhatsAppTransport(options: WhatsAppTransportOptions): WhatsAppTransport {
  const listenPort = options.listenPort ?? WHATSAPP_LISTEN_PORT;
  const graphBase = (options.graphBase ?? WHATSAPP_GRAPH_BASE).replace(/\/+$/, '');
  const fetchImpl = options.fetch ?? (globalThis.fetch as unknown as FetchLike);
  const now = options.now ?? (() => new Date());
  const log = options.log ?? ((line: string) => { process.stderr.write(`${line}\n`); });
  const secretOptions = options.secretOptions ?? {};
  const parseJson = options.parseJson ?? ((text: string) => JSON.parse(text));

  let running = false;
  let startedAt: string | null = null;
  // A request before start has nowhere to deliver, so the field starts as a sink that drops and start replaces it.
  let sink: ChannelSink = { push: () => {} };
  let server: Server | null = null;
  let stopped = false;
  let resolveStop: () => void = () => {};
  // The promise is made once, so a stop before start and a stop during the bind both end the same start.
  const stoppedPromise = new Promise<void>((resolve) => {
    resolveStop = resolve;
  });

  // ─── the probe ───

  const probe = async (): Promise<ProbeResult> => {
    const names = [
      options.secretName,
      `${options.secretName}${WHATSAPP_APP_SECRET_SUFFIX}`,
      `${options.secretName}${WHATSAPP_VERIFY_TOKEN_SUFFIX}`,
      `${options.secretName}${WHATSAPP_PHONE_NUMBER_ID_SUFFIX}`,
    ];

    let served = '';
    for (const name of names) {
      const secret = resolveSecret(options.stateRoot, options.identity, name, secretOptions);
      if (!secret.ok) {
        return secret.detail === undefined
          ? { ok: false, kind: 'secret', reason: secret.reason }
          : { ok: false, kind: 'secret', reason: secret.reason, detail: secret.detail };
      }
      served = secret.value;
    }

    return { ok: true, name: served };
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
  const takeEvent = (event: InboundEvent, target: ChannelSink): { emitted: boolean } => {
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
    target.push(inbound);
    return { emitted: true };
  };

  // ─── the webhook body ───

  /**
   * Take one inbound message.
   *
   * A message that is not text is remembered and dropped, so a redelivery of it
   * stays cheap. A throw propagates, so the body answers 500 and the provider
   * posts it again.
   */
  const takeMessage = (message: WhatsAppMessage): void => {
    if (typeof message.id !== 'string') return;
    const messageId = message.id;

    const body = asRecord(message.text)?.body;
    if (message.type !== 'text' || typeof body !== 'string') {
      markSeen(messageId, null);
      return;
    }

    const stamp = Number(message.timestamp) * 1000;
    const event: InboundEvent = {
      messageId,
      chatId: String(message.from),
      senderId: String(message.from),
      isGroup: false,
      text: body,
      actionId: null,
      timestampUnixMs: Number.isFinite(stamp) ? stamp : 0,
      raw: message,
    };
    takeEvent(event, sink);
  };

  /**
   * Take one delivery status.
   *
   * Only a failed status moves anything, because a sent, delivered or read
   * status says the message arrived. A moved entry that answered a prompt
   * loses its prompt entry, so the person is never asked to answer a message
   * that never arrived.
   */
  const takeStatus = (status: WhatsAppStatus): void => {
    if (status.status !== 'failed' || typeof status.id !== 'string') return;

    const errors = Array.isArray(status.errors) ? status.errors : [];
    const first = errors[0] as { code?: unknown; title?: unknown } | undefined;
    const code = first?.code;
    const title = first?.title;

    let detail = 'whatsapp reported the send failed';
    if (typeof code === 'number' || typeof code === 'string') detail += `: ${code}`;
    if (typeof title === 'string') detail += ` ${title}`;

    const failed = failDeliveredEntry({
      stateRoot: options.stateRoot,
      identity: options.identity,
      channel: CHANNEL,
      platformMessageId: status.id,
      detail,
      now: now(),
    });
    if (!failed.ok) throw new Error(`${failed.reason}: ${failed.detail ?? ''}`);

    if (failed.value.moved && failed.value.itemId !== null) {
      removePromptEntry(options.stateRoot, options.identity, failed.value.itemId);
    }
  };

  /**
   * Take one webhook body.
   *
   * A change for another number is dropped, because this host serves one
   * number and a delivery for a second one is not its business. Messages are
   * taken before statuses, so a body that carries both leaves the message
   * durable first.
   */
  const takeBody = (parsed: unknown, servedNumberId: string): void => {
    const body = asRecord(parsed);
    if (body === null || body.object !== 'whatsapp_business_account') return;

    const entries = Array.isArray(body.entry) ? body.entry : [];
    for (const rawEntry of entries) {
      const entry = asRecord(rawEntry);
      if (entry === null) continue;

      const changes = Array.isArray(entry.changes) ? entry.changes : [];
      for (const rawChange of changes) {
        const change = asRecord(rawChange);
        if (change === null) continue;
        if (typeof change.field === 'string' && change.field !== 'messages') continue;

        const value = asRecord(change.value);
        if (value === null) continue;
        const metadata = asRecord(value.metadata);
        if (metadata === null || metadata.phone_number_id !== servedNumberId) continue;

        const messages = Array.isArray(value.messages) ? value.messages : [];
        for (const rawMessage of messages) takeMessage(rawMessage as WhatsAppMessage);

        const statuses = Array.isArray(value.statuses) ? value.statuses : [];
        for (const rawStatus of statuses) takeStatus(rawStatus as WhatsAppStatus);
      }
    }
  };

  // ─── the handler ───

  /** Answer one request with one status and an empty body. */
  const answer = (response: ServerResponse, status: number): void => {
    response.writeHead(status);
    response.end();
  };

  /**
   * Answer one webhook handshake.
   *
   * The verify token is resolved on every handshake, so a rotated secret takes
   * effect without a restart. A failed resolve, a wrong mode, a missing
   * challenge and a wrong token all answer the same 403 with an empty body, so
   * a caller learns nothing from the difference.
   */
  const handshake = (request: IncomingMessage, response: ServerResponse): void => {
    const url = new URL(request.url ?? '/', `http://${WHATSAPP_LISTEN_HOST}`);
    const mode = url.searchParams.get('hub.mode');
    const given = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const verifyToken = resolveSecret(
      options.stateRoot,
      options.identity,
      `${options.secretName}${WHATSAPP_VERIFY_TOKEN_SUFFIX}`,
      secretOptions,
    );
    if (!verifyToken.ok) {
      log(`bots: whatsapp ${verifyToken.reason}`);
      answer(response, 403);
      return;
    }

    if (mode !== 'subscribe' || challenge === null || challenge === '' || !sameVerifyToken(given, verifyToken.value)) {
      answer(response, 403);
      return;
    }

    log('bots: whatsapp webhook verified');
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end(challenge);
  };

  /**
   * Serve one request.
   *
   * The order is the whole point. The size bound runs before the secret is
   * read, the signature runs before the body is read as text, and the 200 runs
   * after every message of the body is durable.
   */
  const handle = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const method = request.method ?? '';

    // The handshake is the only GET this listener answers, and it reads no body.
    if (method === 'GET') {
      handshake(request, response);
      return;
    }
    if (method !== 'POST') {
      answer(response, 405);
      return;
    }

    const read = await readBody(request);
    if (read.over) {
      log('bots: whatsapp body over 2 MiB refused');
      answer(response, 413);
      return;
    }

    const appSecret = resolveSecret(
      options.stateRoot,
      options.identity,
      `${options.secretName}${WHATSAPP_APP_SECRET_SUFFIX}`,
      secretOptions,
    );
    if (!appSecret.ok) {
      log(`bots: whatsapp ${appSecret.reason}`);
      answer(response, 500);
      return;
    }

    // No byte of the body reaches the parser before this check passed.
    if (!signatureOk(request.headers['x-hub-signature-256'], appSecret.value, read.body)) {
      log('bots: whatsapp channel-signature');
      answer(response, 401);
      return;
    }

    let parsed: unknown;
    try {
      parsed = parseJson(read.body.toString('utf8'));
    } catch {
      log('bots: whatsapp body not read');
      answer(response, 400);
      return;
    }

    const served = resolveSecret(
      options.stateRoot,
      options.identity,
      `${options.secretName}${WHATSAPP_PHONE_NUMBER_ID_SUFFIX}`,
      secretOptions,
    );
    if (!served.ok) {
      answer(response, 500);
      return;
    }

    takeBody(parsed, served.value);

    // The 200 follows every seen record, so a body the provider resends is cheap and a message already taken is dropped.
    answer(response, 200);
  };

  /**
   * The server's request listener.
   *
   * A throw answers 500 and is logged, so a body that could not be taken is
   * posted again rather than silently lost. A response whose headers already
   * went out is only ended, because its status can no longer change.
   */
  const handler = (request: IncomingMessage, response: ServerResponse): void => {
    handle(request, response).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      log(`bots: whatsapp body not taken: ${message}`);
      if (!response.headersSent) response.writeHead(500);
      response.end();
    });
  };

  // ─── the listener ───

  const start = async (next: ChannelSink): Promise<void> => {
    // A stop before start leaves nothing to run, so start returns at once.
    if (stopped) return;

    running = true;
    startedAt = now().toISOString();
    sink = next;

    const created = createServer(handler);
    server = created;

    try {
      await new Promise<void>((resolve, reject) => {
        function onListening(): void {
          created.removeListener('error', onError);
          resolve();
        }
        function onError(error: Error): void {
          created.removeListener('listening', onListening);
          reject(error);
        }
        created.once('error', onError);
        created.once('listening', onListening);
        created.listen(listenPort, WHATSAPP_LISTEN_HOST);
      });
    } catch (error: unknown) {
      running = false;
      server = null;
      throw error;
    }

    const bound = created.address();
    const port = typeof bound === 'object' && bound !== null ? bound.port : listenPort;
    log(`bots: whatsapp listening on ${WHATSAPP_LISTEN_HOST}:${port}`);

    // A stop during the bind already resolved this, so the wait ends as soon as the port is open.
    await stoppedPromise;

    created.closeAllConnections();
    await new Promise<void>((resolve) => {
      created.close(() => resolve());
    });
    server = null;
    running = false;
  };

  const stop = async (): Promise<void> => {
    stopped = true;
    resolveStop();
  };

  // ─── the send ───

  /**
   * Cut one text into the chunks a message may carry, each at most
   * WHATSAPP_CHUNK_CHARS code points.
   *
   * The walk counts one code point at a time, so a chunk never ends inside a
   * code point and a character outside the basic plane is never split. An empty
   * text is one empty chunk, because a send of nothing still has to produce a
   * receipt.
   */
  const chunkText = (text: string): string[] => {
    const points = [...text];
    if (points.length === 0) return [''];
    const chunks: string[] = [];
    for (let start = 0; start < points.length; start += WHATSAPP_CHUNK_CHARS) {
      chunks.push(points.slice(start, start + WHATSAPP_CHUNK_CHARS).join(''));
    }
    return chunks;
  };

  /**
   * The error a secret that could not be read reports.
   *
   * Nothing was sent, so no message landed and the queue may keep the entry.
   */
  const secretError = (secret: { reason: string; detail?: string }): SendErrorWithWait => ({
    kind: secret.reason,
    message: secret.detail === undefined ? secret.reason : `${secret.reason}: ${secret.detail}`,
    unsupported: false,
    retryable: false,
    sentBeforeError: false,
  });

  /**
   * Post one chunk of text to the Graph send endpoint.
   *
   * The body is always read as text and then parsed, so a body that cannot be
   * read is told apart from a body that reads and refuses. The token rides the
   * authorization header only, so it never reaches a URL.
   */
  const postChunk = async (token: string, phoneNumberId: string, to: string, chunk: string): Promise<ChunkResult> => {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: chunk },
    };

    let response: FetchResponseLike;
    try {
      response = await fetchImpl(`${graphBase}/${WHATSAPP_GRAPH_VERSION}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error: unknown) {
      return { kind: 'transport', message: error instanceof Error ? error.message : String(error) };
    }

    const header = response.headers.get('retry-after');
    const seconds = header === null ? Number.NaN : Number(header);
    const retryAfterMs = Number.isFinite(seconds) ? seconds * 1000 : null;

    let text: string;
    try {
      text = await response.text();
    } catch {
      return { kind: 'unreadable', status: response.status, retryAfterMs };
    }

    let parsed: unknown;
    try {
      parsed = parseJson(text);
    } catch {
      return { kind: 'unreadable', status: response.status, retryAfterMs };
    }

    if (response.status >= 200 && response.status < 300) {
      const messages = asRecord(parsed)?.messages;
      const first = Array.isArray(messages) ? asRecord(messages[0]) : null;
      const id = first?.id;
      if (typeof id === 'string' && id.trim() !== '') return { kind: 'ok', id: id.trim() };
      return { kind: 'unreadable', status: response.status, retryAfterMs };
    }

    const error = asRecord(asRecord(parsed)?.error);
    let detail: string | null = null;
    if (error !== null) {
      const parts = [error.code, error.message]
        .filter((part) => typeof part === 'string' || typeof part === 'number')
        .map((part) => String(part));
      if (parts.length > 0) detail = parts.join(' ');
    }

    return { kind: 'refused', status: response.status, retryAfterMs, detail };
  };

  /**
   * The error one failed chunk reports.
   *
   * A transport error, a timeout, a server error and an unreadable body each
   * mean the provider may have taken the message, so each sets sentBeforeError.
   * A rate limit is the one error worth retrying, because a 4xx other than 408
   * left the account untouched. Every other refusal sets sentBeforeError to
   * whether an earlier chunk of the same text already landed.
   */
  const chunkError = (result: ChunkFailure, token: string, landed: boolean): SendErrorWithWait => {
    const failed = (kind: string, message: string, retryable: boolean, sentBeforeError: boolean): SendErrorWithWait => ({
      kind,
      message: redactToken(message, token),
      unsupported: false,
      retryable,
      sentBeforeError,
    });

    if (result.kind === 'transport') {
      return failed('transport-error', `WhatsApp messages failed: ${result.message}`, false, true);
    }

    const rejected = `WhatsApp messages rejected with HTTP ${result.status}`;

    if (result.status === 429) {
      const error = failed('rate-limited', rejected, true, landed);
      if (result.retryAfterMs !== null) error.retryAfterMs = result.retryAfterMs;
      return error;
    }

    // A timeout and a server error may have landed, so neither is ever repeated.
    if (result.status === 408 || result.status >= 500) return failed('server-error', rejected, false, true);

    if (result.kind === 'unreadable') {
      if (result.status >= 200 && result.status < 300) return failed('unreadable-response', rejected, false, true);
      return failed('rejected', rejected, false, landed);
    }

    const message = result.detail === null ? rejected : `${rejected}: ${result.detail}`;
    return failed('rejected', message, false, landed);
  };

  const send = async (intent: ChannelOutboundIntent): Promise<ChannelSendResult> => {
    const refused = checkDeclared('whatsapp', CAPABILITY_MATRIX.whatsapp, intent);
    if (refused !== null) return refused;

    const accessToken = resolveSecret(options.stateRoot, options.identity, options.secretName, secretOptions);
    if (!accessToken.ok) return { ok: false, error: secretError(accessToken) };

    const phoneNumberId = resolveSecret(
      options.stateRoot,
      options.identity,
      `${options.secretName}${WHATSAPP_PHONE_NUMBER_ID_SUFFIX}`,
      secretOptions,
    );
    if (!phoneNumberId.ok) return { ok: false, error: secretError(phoneNumberId) };

    const token = accessToken.value;
    // The provider addresses a recipient by digits, so the leading plus a chat id carries is dropped.
    const to = intent.conversationId.replace(/^\+/, '');
    const platformMessageIds: string[] = [];

    for (const chunk of chunkText(intent.text)) {
      const result = await postChunk(token, phoneNumberId.value, to, chunk);
      if (result.kind !== 'ok') return { ok: false, error: chunkError(result, token, platformMessageIds.length > 0) };

      platformMessageIds.push(result.id);
      // The record is written before the next chunk, so a later failed status for this id finds its queue entry.
      writeSentRecord({
        stateRoot: options.stateRoot,
        identity: options.identity,
        channel: CHANNEL,
        platformMessageId: result.id,
        key: intent.idempotencyKey,
        now: now(),
      });
    }

    return { ok: true, receipt: { platformMessageIds, primaryPlatformMessageId: platformMessageIds[0] } };
  };

  return {
    descriptor: (): ChannelDescriptor => CHANNEL_DESCRIPTORS.whatsapp,
    declaredCapabilities: (): ChannelCapabilities => CAPABILITY_MATRIX.whatsapp,
    status: (): ChannelStatus => ({ running, startedAt }),
    start,
    stop,
    send,
    probe,
    address: () => {
      const bound = server?.address() ?? null;
      if (bound === null || typeof bound === 'string') return null;
      return { host: bound.address, port: bound.port };
    },
  };
}
