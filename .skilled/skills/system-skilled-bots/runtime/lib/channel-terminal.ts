// ───────────────────────────────────────────────────────────────────
// MODULE: Terminal Channel Transport
// ───────────────────────────────────────────────────────────────────
//
// `bots channel listen terminal` runs this transport, and it is the one
// transport that needs no public URL and no local daemon: a line on stdin is
// the whole inbound path. A line that answers the newest open needs-you prompt
// is answered by the reply grammar with the OS user as the actor on the
// channel surface, and every other line goes through the same chat path
// `bots chat` uses, so a terminal session and a chat session leave the same
// record and a reply reaches the terminal the same way.
//
// The prompts come from the caller's list of open items and never from the
// approval index, so this transport writes no index entry and a terminal
// answer never depends on a prompt a chat is holding.

import { randomBytes } from 'node:crypto';
import { userInfo } from 'node:os';
import { createInterface } from 'node:readline';

import { answerItem } from './answer.js';
import { choicesFor, countNotApprover, parseReply } from './channel-approval.js';
import { CAPABILITY_MATRIX, CHANNEL_DESCRIPTORS, checkDeclared, REPLIES } from './channel.js';
import { appendMessage, CHAT_SOURCE, cleanMessageText, listBots, prepareHumanMessage } from './conversation.js';
import { enqueueFromCheckout } from './request-queue.js';

import type { Interface as ReadlineInterface } from 'node:readline';
import type {
  ChannelAdapter,
  ChannelCapabilities,
  ChannelDescriptor,
  ChannelInbound,
  ChannelOutboundIntent,
  ChannelSendResult,
  ChannelSink,
  ChannelStatus,
} from './channel.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/**
 * The known-secret map the chat path checks a message against. It is derived
 * from the chat path's own input rather than imported, so this module names no
 * type of a module it may not import.
 */
type KnownSecretsOf = Parameters<typeof prepareHumanMessage>[0]['known'];

/** One open needs-you item as the terminal prints and answers it. */
export interface TerminalPrompt {
  itemId: string;
  botId: string;
  options: string[] | null;
  /** ISO 8601 instant the item expires at. */
  expiresAt: string;
  /** The whole prompt as printed: the run notice and its text-form choice block. */
  text: string;
}

/** The bot message one drained request appended, as the chat path prints it. */
export interface TerminalReply {
  botId: string;
  text: string;
}

/** Everything the transport reads from its caller, so it holds no path and no clock of its own. */
export interface TerminalTransportOptions {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  /** Passed to answerItem as env. */
  env?: NodeJS.ProcessEnv;
  /** Passed to answerItem and enqueueFromCheckout as the resolve environment. */
  resolveEnv?: NodeJS.ProcessEnv;
  /** The actor every answer carries. Defaults to userInfo().username from node:os. */
  osUser?: string;
  /** Where lines are read from. */
  input: NodeJS.ReadableStream;
  /** Where every prompt and reply is printed. */
  output: { write(text: string): unknown };
  /** The open needs-you items of the identity, newest first. */
  listOpen: () => TerminalPrompt[];
  /** The known-secret map the chat path checks a message against. */
  knownSecrets: () => { ok: true; value: KnownSecretsOf } | { ok: false; reason: string; detail?: string };
  /** Drains exactly one request and returns the bot message the drain appended, or null. */
  drainRequest: (requestId: string) => Promise<TerminalReply | null>;
  /** A unique stamp for one message id. */
  stamp?: () => string;
  /** How often the open list is read again. Defaults to TERMINAL_TICK_MS. */
  tickMs?: number;
  now?: () => Date;
}

/** The terminal adapter, with the two entry points a test drives without a stream. */
export interface TerminalTransport extends ChannelAdapter {
  /** Handle one stdin line, as the read loop does. Exported so a test drives it directly. */
  handleLine(line: string): Promise<void>;
  /** Read the open list and print every prompt not printed before, oldest first. */
  refresh(): void;
  /** terminal:<os user>, the reply target of this terminal. */
  replyTarget(): string;
  /** terminal-<os user>, the conversation file id the chat path appends to. */
  conversationId(): string;
}

/**
 * How often the open list is read again, so a prompt that arrives while the
 * terminal sits idle still prints without a line being typed.
 */
export const TERMINAL_TICK_MS = 60_000;

/**
 * The line a terminal prints when it cannot tell which bot a message is for.
 * A host that runs no bot and a host that runs several are the same answer,
 * because neither says which bot the person meant.
 */
export const BOT_UNKNOWN_REPLY = 'This message names no bot this host runs. Start it with @ and the bot id, for example @digest Which channel?';

// ───────────────────────────────────────────────────────────────────
// 2. THE TWO IDS
// ───────────────────────────────────────────────────────────────────

/**
 * The reply target of one terminal, in the `<channel>:<chat>` form every
 * transport uses, so a reply addressed to a terminal reads like a reply
 * addressed to any other chat.
 */
export function terminalReplyTarget(osUser: string): string {
  return `terminal:${osUser}`;
}

/**
 * The conversation file id of one terminal.
 *
 * A conversation file id must be a safe path segment and a colon is not one,
 * so the file id uses a hyphen while the reply target keeps the
 * `<channel>:<chat>` form every transport uses. The two ids therefore name one
 * terminal in the two grammars that read them.
 */
export function terminalConversationId(osUser: string): string {
  return `terminal-${osUser}`;
}

// ───────────────────────────────────────────────────────────────────
// 3. CHUNKS
// ───────────────────────────────────────────────────────────────────

/**
 * Cut one text into the chunks a terminal prints, each at most the descriptor's
 * chunk limit in code points.
 *
 * The cut counts code points rather than UTF-16 units, so a character outside
 * the basic plane is never split across two chunks. An empty text is one empty
 * chunk, because a send of nothing still has to produce a receipt.
 */
function chunkText(text: string): string[] {
  const points = [...text];
  const limit = CHANNEL_DESCRIPTORS.terminal.chunkLimit;
  if (points.length === 0) return [''];
  const chunks: string[] = [];
  for (let start = 0; start < points.length; start += limit) {
    chunks.push(points.slice(start, start + limit).join(''));
  }
  return chunks;
}

// ───────────────────────────────────────────────────────────────────
// 4. THE TRANSPORT
// ───────────────────────────────────────────────────────────────────

/**
 * Build the terminal transport.
 *
 * Every effect the transport needs is injected, so a test drives the whole
 * answer path and the whole chat path with no tty, no clock and no drain. The
 * transport holds only what a running listener owns: the ids it has printed,
 * whether it is running, the readline interface and the refresh timer.
 */
export function createTerminalTransport(options: TerminalTransportOptions): TerminalTransport {
  const osUser = options.osUser ?? userInfo().username;
  const now = options.now ?? (() => new Date());
  const stamp = options.stamp ?? (() => {
    const iso = now().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return `${iso}-${randomBytes(4).toString('hex')}`;
  });
  const conversationId = terminalConversationId(osUser);

  const printed = new Set<string>();
  let running = false;
  let startedAt: string | null = null;
  let reader: ReadlineInterface | null = null;
  let timer: NodeJS.Timeout | null = null;
  let receipts = 0;

  const print = (text: string): void => {
    options.output.write(`${text}\n`);
  };

  const printReply = (botId: string, text: string): void => {
    const [first, ...rest] = text.split('\n');
    print(`${botId} › ${first}`);
    for (const line of rest) print(`    ${line}`);
  };

  const refusalLine = (refusal: { reason: string; detail?: string }): string => {
    const detail = refusal.detail;
    return typeof detail === 'string' && detail !== '' ? `bots: ${refusal.reason}: ${detail}` : `bots: ${refusal.reason}`;
  };

  const refresh = (): void => {
    const list = options.listOpen();
    // The list is newest first, so the walk runs backwards to print the oldest prompt first.
    for (let index = list.length - 1; index >= 0; index -= 1) {
      const prompt = list[index];
      if (printed.has(prompt.itemId)) continue;
      print(prompt.text);
      printed.add(prompt.itemId);
    }
  };

  const answerPrompt = (prompt: TerminalPrompt, label: string, text: string): void => {
    const result = answerItem({
      checkoutRoot: options.checkoutRoot,
      itemId: prompt.itemId,
      text,
      env: options.env,
      resolveEnv: options.resolveEnv,
      actor: osUser,
      surface: 'channel',
      now: now(),
    });

    if (result.ok) {
      print(result.value.status === 'duplicate'
        ? REPLIES.M08({ itemId: prompt.itemId })
        : REPLIES.M07({ choice: label, itemId: prompt.itemId, actor: osUser }));
      return;
    }

    switch (result.reason) {
      case 'answer-not-approver':
        try {
          countNotApprover(options.stateRoot, options.identity, osUser);
        } catch {
          // The refusal is what the person is told, so a count that cannot be written must not hide it.
        }
        print(REPLIES.M14({ actor: osUser }));
        return;
      case 'channel-roster-missing':
        print(REPLIES.M17());
        return;
      case 'item-expired':
        print(REPLIES.M15({ itemId: prompt.itemId, instant: prompt.expiresAt.replace(/\.\d{3}Z$/, 'Z') }));
        return;
      case 'item-busy':
        print(REPLIES.M19({ itemId: prompt.itemId }));
        return;
      default:
        print(refusalLine(result));
    }
  };

  const handleLine = async (raw: string): Promise<void> => {
    const line = cleanMessageText(raw);
    if (line.trim() === '') return;

    const open = options.listOpen();
    const reply = parseReply(line);

    // A bare answer belongs to the newest open prompt, because that is the one the person just read.
    if (reply.kind !== 'chat' && open.length > 0) {
      const newest = open[0];
      const choices = choicesFor({ options: newest.options });
      const yesNo = choices.length === 2 && choices[0] === 'YES' && choices[1] === 'NO';
      const highest = choices.length;

      if (reply.kind === 'not-a-choice') {
        print(REPLIES.M20({ highest }));
        return;
      }
      if (reply.kind === 'number' && reply.value > highest) {
        print(REPLIES.M20({ highest }));
        return;
      }
      if (reply.kind === 'yes' && !yesNo) {
        print(REPLIES.M20({ highest }));
        return;
      }

      let text: string;
      let label: string;
      if (reply.kind === 'number') {
        text = yesNo ? (reply.value === 1 ? 'yes' : 'no') : choices[reply.value - 1];
        label = yesNo ? (reply.value === 1 ? 'YES' : 'NO') : String(reply.value);
      } else if (reply.kind === 'yes') {
        text = 'yes';
        label = 'YES';
      } else {
        // N maps to no before the answer call, so the answer seam records deny and the terminal passes no scope of its own.
        text = 'no';
        label = 'NO';
      }

      answerPrompt(newest, label, text);
      refresh();
      return;
    }

    // The line is a chat message, so an open prompt stays open and the chat path owns the line.
    const bots = listBots(options.checkoutRoot);
    // With one bot an unaddressed line goes to it, the same rule the terminal screen's bot picker uses.
    const defaultBot = bots.length === 1 ? bots[0] : null;
    const lead = line.replace(/^\s+/, '');
    const addressed = lead.startsWith('@') && lead.length > 1 && !/\s/.test(lead[1]);
    if (!addressed && defaultBot === null) {
      print(BOT_UNKNOWN_REPLY);
      return;
    }

    const known = options.knownSecrets();
    if (!known.ok) {
      print(refusalLine(known));
      return;
    }

    const prepared = prepareHumanMessage({
      checkoutRoot: options.checkoutRoot,
      stateRoot: options.stateRoot,
      identity: options.identity,
      conversationId,
      defaultBot: defaultBot ?? '',
      text: line,
      by: osUser,
      known: known.value,
      stamp: stamp(),
      now: now(),
    });
    if (!prepared.ok) {
      if (prepared.reason === 'message-empty') return;
      if (prepared.reason === 'bot-unknown' || prepared.reason === 'address-without-message') {
        print(BOT_UNKNOWN_REPLY);
        return;
      }
      print(refusalLine(prepared));
      return;
    }

    const appended = appendMessage(prepared.value.path, prepared.value.message);
    if (!appended.ok) {
      print(refusalLine(appended));
      return;
    }

    // The request carries no delivery target: the reply reaches this terminal through the chat path, and a terminal target would be recorded as an unsupported channel.
    const queued = enqueueFromCheckout(
      options.checkoutRoot,
      {
        kind: 'run',
        workflowId: prepared.value.botId,
        source: CHAT_SOURCE,
        eventId: prepared.value.message.id,
        prompt: prepared.value.block,
        origin: `conversation ${conversationId}`,
        conversationId,
      },
      options.resolveEnv ?? process.env,
    );
    if (!queued.ok) {
      print(refusalLine(queued));
      return;
    }
    if (queued.value.status === 'duplicate') {
      print(`bots: ${queued.value.requestId} duplicate`);
      return;
    }

    const drained = await options.drainRequest(queued.value.requestId);
    if (drained !== null) printReply(drained.botId, drained.text);
    refresh();
  };

  const send = async (intent: ChannelOutboundIntent): Promise<ChannelSendResult> => {
    const refused = checkDeclared('terminal', CAPABILITY_MATRIX.terminal, intent);
    if (refused !== null) return refused;

    const platformMessageIds: string[] = [];
    for (const chunk of chunkText(intent.text)) {
      print(chunk);
      receipts += 1;
      platformMessageIds.push(`terminal-${receipts}`);
    }
    return { ok: true, receipt: { platformMessageIds, primaryPlatformMessageId: platformMessageIds[0] } };
  };

  const start = async (sink: ChannelSink): Promise<void> => {
    running = true;
    startedAt = now().toISOString();
    refresh();

    timer = setInterval(() => refresh(), options.tickMs ?? TERMINAL_TICK_MS);
    // The timer never keeps the process alive after stdin closes, so a piped session ends when its input does.
    timer.unref();

    const rl = createInterface({ input: options.input, terminal: false, crlfDelay: Infinity });
    reader = rl;
    try {
      for await (const raw of rl) {
        await handleLine(raw);
        const inbound: ChannelInbound = {
          channel: 'terminal',
          // A stdin line carries no provider id, so the message id is empty.
          messageId: '',
          replyToId: null,
          timestampUnixMs: now().getTime(),
          conversation: { id: osUser, isGroup: false },
          sender: { id: osUser },
          text: raw,
          actionId: null,
          raw: null,
        };
        sink.push(inbound);
      }
    } finally {
      if (timer !== null) clearInterval(timer);
      timer = null;
      running = false;
    }
  };

  const stop = async (): Promise<void> => {
    if (reader !== null) {
      reader.close();
      reader = null;
    }
    running = false;
  };

  return {
    descriptor: (): ChannelDescriptor => CHANNEL_DESCRIPTORS.terminal,
    declaredCapabilities: (): ChannelCapabilities => CAPABILITY_MATRIX.terminal,
    status: (): ChannelStatus => ({ running, startedAt }),
    start,
    stop,
    send,
    handleLine,
    refresh,
    replyTarget: () => terminalReplyTarget(osUser),
    conversationId: () => conversationId,
  };
}
