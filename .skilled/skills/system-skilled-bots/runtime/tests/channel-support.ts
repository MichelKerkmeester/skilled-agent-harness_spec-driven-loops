// Channel test worlds: a temporary state root with the bots CLI pointed at it, a scripted fake transport that opens no socket, the capability-matrix driver the conformance suite walks, and a fake platform that stands where each provider's API stands.
//
// ───────────────────────────────────────────────────────────────────
// MODULE: Channel Test Support
// ───────────────────────────────────────────────────────────────────
//
// Every channel test that writes state runs in a temp state root with the
// bots CLI pointed at it, and every channel test that sends runs against a
// scripted fake transport. No test reaches the real state root and no test
// opens a socket, so a roster one test leaves behind cannot refuse the
// operator's own answers and no provider is ever called.

import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { Readable } from 'node:stream';

import { checkDeclared, CAPABILITY_MATRIX, CHANNEL_DESCRIPTORS, CHANNEL_NAMES } from '../lib/channel.js';
import { createSignalTransport } from '../lib/channel-signal.js';
import { createSlackTransport } from '../lib/channel-slack.js';
import { createTelegramTransport } from '../lib/channel-telegram.js';
import { createTerminalTransport, terminalConversationId } from '../lib/channel-terminal.js';
import { createWhatsAppTransport } from '../lib/channel-whatsapp.js';
import { setSecret } from '../lib/secrets.js';
import { userStateRoot } from '../lib/state-root.js';
import { tempDir, writeConfig } from './support.js';

import type {
  ChannelAdapter,
  ChannelCapabilities,
  ChannelDescriptor,
  ChannelInbound,
  ChannelIntentKind,
  ChannelName,
  ChannelOutboundIntent,
  ChannelSendResult,
  ChannelSink,
  ChannelStatus,
} from '../lib/channel.js';
import type { TelegramTransport } from '../lib/channel-telegram.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The identity every channel world pins, so no test reads this repository's origin. */
export const CHANNEL_IDENTITY = 'acme/widgets';

/** The bots CLI under test. */
export const CHANNEL_BOTS_CLI = resolve(import.meta.dirname, '..', '..', '..', '..', 'bin', 'bots.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. TEMPORARY STATE ROOT
// ───────────────────────────────────────────────────────────────────

/** One temp world a channel test runs in. */
export interface TemporaryStateRoot {
  /** The temp folder everything below lives in. */
  root: string;
  /** An empty folder that is not a git checkout and holds only bots/config.json naming the identity, so this repository's config and origin stay out of the run. */
  checkoutRoot: string;
  /** XDG_STATE_HOME for the run. */
  stateHome: string;
  /** The resolved state root the runtime writes under. */
  stateRoot: string;
  /** Always CHANNEL_IDENTITY. */
  identity: string;
  /** The environment the CLI runs under: no tty, no token, no network. */
  env: NodeJS.ProcessEnv;
}

/**
 * A temp state root, a temp checkout and an environment that points the
 * runtime at both.
 *
 * Every channel test that writes state runs here, never on the real state
 * root, because a roster left on the real root would refuse the operator's own
 * answers. cleanupTemp from support.ts removes it.
 */
export function temporaryStateRoot(): TemporaryStateRoot {
  const root = tempDir('bots-channel-');
  const checkoutRoot = join(root, 'checkout');
  const stateHome = join(root, 'state');
  const home = join(root, 'home');
  const tmp = join(root, 'tmp');
  for (const folder of [checkoutRoot, stateHome, home, tmp]) mkdirSync(folder, { recursive: true });
  writeConfig(checkoutRoot, { identity: CHANNEL_IDENTITY });
  const env: NodeJS.ProcessEnv = {
    PATH: [dirname(process.execPath), '/usr/bin', '/bin'].join(':'),
    HOME: home,
    TMPDIR: tmp,
    XDG_STATE_HOME: stateHome,
    SKILLED_BOTS_IDENTITY: CHANNEL_IDENTITY,
    GIT_CONFIG_NOSYSTEM: '1',
  };
  const stateRoot = userStateRoot({ stateRoot: null }, env);
  return { root, checkoutRoot, stateHome, stateRoot, identity: CHANNEL_IDENTITY, env };
}

// ───────────────────────────────────────────────────────────────────
// 3. CLI RUNNER
// ───────────────────────────────────────────────────────────────────

/** What one bots CLI run exited with and printed. */
export interface BotsRun {
  status: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Run the bots CLI as its own process against a world's checkout and state
 * root.
 *
 * With a tty the CLI runs under `script`, so it sees a terminal and takes the
 * interactive path. A pty merges the CLI's stdout and stderr into script's
 * stdout, writes CRLF line ends and can start with the four characters caret,
 * D, backspace, backspace, so everything the CLI printed arrives in stdout.
 */
export function runBots(world: TemporaryStateRoot, args: string[], options: { tty?: boolean } = {}): BotsRun {
  const spawnOptions = {
    cwd: world.checkoutRoot,
    env: world.env,
    encoding: 'utf8' as const,
    timeout: 60_000,
    stdio: ['ignore', 'pipe', 'pipe'] as ['ignore', 'pipe', 'pipe'],
  };
  if (options.tty !== true) {
    const run = spawnSync(process.execPath, [CHANNEL_BOTS_CLI, ...args, '--repo', world.checkoutRoot], spawnOptions);
    return { status: run.status, stdout: run.stdout, stderr: run.stderr };
  }
  if (process.platform !== 'darwin') throw new Error('runBots with a tty needs darwin');
  const run = spawnSync('script', ['-q', '/dev/null', process.execPath, CHANNEL_BOTS_CLI, ...args, '--repo', world.checkoutRoot], spawnOptions);
  return {
    status: run.status,
    stdout: run.stdout.replace(/^\^D\x08\x08/, '').replace(/\r\n/g, '\n'),
    stderr: '',
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. FAKE TRANSPORT
// ───────────────────────────────────────────────────────────────────

/** One call the fake transport received. */
export interface FakeCall {
  op: 'start' | 'stop' | 'send' | 'status';
  intent: ChannelOutboundIntent | null;
}

/** A transport that records every call and answers from a script. */
export interface FakeTransport extends ChannelAdapter {
  /** Every call the adapter received, in order. */
  readonly calls: FakeCall[];
  /** Every message pushed to the sink, in order. */
  readonly delivered: ChannelInbound[];
  /** Push one inbound message to the sink start received, as the provider would. Throws when start was not called. */
  deliver(message: Partial<ChannelInbound> & { text: string }): ChannelInbound;
}

/** What a fake transport plays and what it answers. */
export interface FakeTransportOptions {
  /** The channel the fake plays. Defaults to telegram. */
  name?: ChannelName;
  /** Overrides the declared capabilities. Defaults to that channel's row of the capability matrix. */
  capabilities?: Partial<ChannelCapabilities>;
  /** Scripted send results, used in order. When the script runs out, a send returns a receipt. */
  sends?: ChannelSendResult[];
}

/**
 * A transport that records each wire call and returns a scripted result, so a
 * channel test runs with no network.
 *
 * The capability check runs before the script, so a send the channel does not
 * declare is refused here exactly as a real adapter refuses it.
 */
export function fakeTransport(options: FakeTransportOptions = {}): FakeTransport {
  const name = options.name ?? 'telegram';
  const capabilities: ChannelCapabilities = Object.freeze({ ...CAPABILITY_MATRIX[name], ...options.capabilities });
  const scripted = [...(options.sends ?? [])];
  const calls: FakeCall[] = [];
  const delivered: ChannelInbound[] = [];
  let sink: ChannelSink | null = null;
  let running = false;
  let startedAt: string | null = null;
  let receipts = 0;
  let deliveries = 0;

  return {
    calls,
    delivered,
    descriptor: (): ChannelDescriptor => CHANNEL_DESCRIPTORS[name],
    declaredCapabilities: (): ChannelCapabilities => capabilities,
    start: async (next: ChannelSink): Promise<void> => {
      calls.push({ op: 'start', intent: null });
      sink = next;
      running = true;
      startedAt = new Date().toISOString();
    },
    stop: async (): Promise<void> => {
      calls.push({ op: 'stop', intent: null });
      running = false;
    },
    status: (): ChannelStatus => {
      calls.push({ op: 'status', intent: null });
      return { running, startedAt };
    },
    send: async (intent: ChannelOutboundIntent): Promise<ChannelSendResult> => {
      calls.push({ op: 'send', intent });
      const refused = checkDeclared(name, capabilities, intent);
      if (refused !== null) return refused;
      const next = scripted.shift();
      if (next !== undefined) return next;
      receipts += 1;
      const id = `fake-${receipts}`;
      return { ok: true, receipt: { platformMessageIds: [id], primaryPlatformMessageId: id } };
    },
    deliver: (message: Partial<ChannelInbound> & { text: string }): ChannelInbound => {
      if (sink === null) throw new Error('deliver before start');
      deliveries += 1;
      const built: ChannelInbound = {
        channel: name,
        messageId: `fake-in-${deliveries}`,
        replyToId: null,
        timestampUnixMs: Date.now(),
        conversation: { id: '81234567', isGroup: false },
        sender: { id: '81234567' },
        actionId: null,
        raw: null,
        ...message,
      };
      sink.push(built);
      delivered.push(built);
      return built;
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. CAPABILITY-MATRIX DRIVER
// ───────────────────────────────────────────────────────────────────

/** The five outbound operations a conformance case sends. receiveText, numberedReply and groupKnown are inbound facts with no send intent, so they have no case. */
export type ConformanceOperation = 'sendText' | 'buttons' | 'edit' | 'react' | 'file';

/** The operations in the order the suite walks them, so the case list is the same on every run. */
export const CONFORMANCE_OPERATIONS: readonly ConformanceOperation[] = ['sendText', 'buttons', 'edit', 'react', 'file'];

/** The send intent each operation builds, so a case sends the intent its operation names. */
export const OPERATION_INTENT: Readonly<Record<ConformanceOperation, ChannelIntentKind>> = Object.freeze({
  sendText: 'text',
  buttons: 'buttons',
  edit: 'edit',
  react: 'react',
  file: 'file',
});

/** The numbered conformance rules a case checks. */
export type ConformanceRule = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

/** One conformance case: a transport, an operation and the rules that case checks. */
export interface ConformanceCase {
  /** The it name: channel, operation and the rules the case checks. */
  name: string;
  channel: ChannelName;
  operation: ConformanceOperation;
  /** True when the design matrix says yes for this channel and operation. */
  declared: boolean;
  rules: readonly ConformanceRule[];
}

/** The design table copied by hand, never read from CAPABILITY_MATRIX, because the suite checks the code against the design and not against itself. */
export function capabilityMatrix(): Readonly<Record<ChannelName, Readonly<Record<ConformanceOperation, boolean>>>> {
  return Object.freeze({
    terminal: Object.freeze({ sendText: true, buttons: false, edit: false, react: false, file: false }),
    telegram: Object.freeze({ sendText: true, buttons: true, edit: false, react: false, file: false }),
    slack: Object.freeze({ sendText: true, buttons: true, edit: false, react: false, file: false }),
    signal: Object.freeze({ sendText: true, buttons: false, edit: false, react: false, file: false }),
    whatsapp: Object.freeze({ sendText: true, buttons: false, edit: false, react: false, file: false }),
  });
}

/** One case per transport and operation, so every cell of the matrix is walked and none is skipped. */
export function conformanceCases(): readonly ConformanceCase[] {
  const matrix = capabilityMatrix();
  const cases: ConformanceCase[] = [];
  for (const channel of CHANNEL_NAMES) {
    for (const operation of CONFORMANCE_OPERATIONS) {
      const declared = matrix[channel][operation];
      const rules: readonly ConformanceRule[] = declared ? ['R3', 'R4', 'R5'] : ['R1', 'R2'];
      cases.push(Object.freeze({ name: `${channel} ${operation} ${rules.join(' ')}`, channel, operation, declared, rules }));
    }
  }
  return Object.freeze(cases);
}

// ───────────────────────────────────────────────────────────────────
// 6. FAKE PLATFORM
// ───────────────────────────────────────────────────────────────────

/** The terminal actor every conformance world pins, so no case reads the host's user name. */
export const CONFORMANCE_OS_USER = 'ada';

/** Every conversation id reaches the wire unchanged, which is why the WhatsApp one carries no leading plus. */
export const CONFORMANCE_CONVERSATION: Readonly<Record<ChannelName, string>> = Object.freeze({
  terminal: terminalConversationId(CONFORMANCE_OS_USER),
  telegram: '81234567',
  slack: 'C07CONFORM1',
  signal: '+15550101',
  whatsapp: '15550102',
});

/** Every transport is pointed at a dead loopback port, so a call the fake does not catch fails on the host instead of leaving it. */
const UNREACHABLE_BASE = 'http://127.0.0.1:9';

/** Every secret name a transport reads, so a declared and an undeclared case run in the same world and R2 tests the declaration rather than a missing secret. */
export const CONFORMANCE_SECRETS: ReadonlyArray<readonly [string, string]> = Object.freeze([
  ['telegram', 'test-telegram-token-conformance-1'],
  ['slack', 'test-slack-app-token-conformance-1'],
  ['slack-bot', 'test-slack-bot-token-conformance-1'],
  ['signal', '+15550100'],
  ['whatsapp', 'test-whatsapp-token-conformance-1'],
  ['whatsapp-app-secret', 'test-whatsapp-app-secret-conformance-1'],
  ['whatsapp-verify-token', 'test-whatsapp-verify-conformance-1'],
  ['whatsapp-phone-number-id', '106540352242922'],
] as const);

/** The four things a transport reads from its caller, so a case builds one world and every channel shares it. */
export interface ConformanceWorld {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  env: NodeJS.ProcessEnv;
}

/** Store every secret a transport reads, so a case that declares a channel and one that does not run in the same world. */
export function storeConformanceSecrets(world: ConformanceWorld): void {
  for (const [name, value] of CONFORMANCE_SECRETS) {
    const stored = setSecret({ stateRoot: world.stateRoot, identity: world.identity, name, value, store: 'file', setBy: null });
    if (!stored.ok) throw new Error(`${name}: ${stored.reason}`);
  }
}

/** One call that carried a message to a chat. */
export interface WireObservation {
  operation: ConformanceOperation;
  channel: ChannelName;
  conversation: string;
  idempotencyKey: string | null;
}

/** One call of any kind, a message or not. */
export interface WireRequest {
  channel: ChannelName;
  url: string;
  body: string;
}

/** A fake platform standing where each provider's API stands: it records every wire call and never reaches a network. */
export interface FakePlatform {
  readonly channel: ChannelName;
  readonly observations: WireObservation[];
  readonly requests: WireRequest[];
  readonly fetch: typeof globalThis.fetch;
  readonly output: { write(text: string): boolean };
  /** What each later getUpdates call answers, one array per call, then an empty list. */
  readonly telegramUpdates: unknown[][];
  /** No transport puts the key on the wire, so the fake tags every message call made while one send runs with that send's key. */
  withKey<T>(key: string, run: () => Promise<T>): Promise<T>;
}

/** A fake platform for one channel, so a conformance case runs the real transport with no network. */
export function fakePlatform(channel: ChannelName): FakePlatform {
  const observations: WireObservation[] = [];
  const requests: WireRequest[] = [];
  const telegramUpdates: unknown[][] = [];
  let activeKey: string | null = null;
  let sent = 0;

  const json = (status: number, value: unknown): Response =>
    new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });

  const observe = (operation: ConformanceOperation, conversation: string): void => {
    observations.push({ operation, channel, conversation, idempotencyKey: activeKey });
  };

  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const body = typeof init?.body === 'string' ? init.body : '';
    requests.push({ channel, url, body });
    const path = new URL(url).pathname;
    const payload = body === '' ? {} : (JSON.parse(body) as Record<string, unknown>);
    if (channel === 'telegram') {
      if (path.endsWith('/sendMessage')) {
        observe(payload.reply_markup !== undefined ? 'buttons' : 'sendText', String(payload.chat_id));
        sent += 1;
        return json(200, { ok: true, result: { message_id: 1000 + sent } });
      }
      if (path.endsWith('/getUpdates')) return json(200, { ok: true, result: telegramUpdates.shift() ?? [] });
      if (path.endsWith('/answerCallbackQuery')) return json(200, { ok: true, result: true });
      return json(404, { ok: false, error_code: 404, description: 'Not Found' });
    }
    if (channel === 'slack') {
      if (path.endsWith('/chat.postMessage')) {
        observe(payload.blocks !== undefined ? 'buttons' : 'sendText', String(payload.channel));
        sent += 1;
        return json(200, { ok: true, channel: payload.channel, ts: `1764104700.${String(sent).padStart(6, '0')}` });
      }
      return json(200, { ok: false, error: 'unknown_method' });
    }
    if (channel === 'signal') {
      if (path.endsWith('/api/v1/rpc') && payload.method === 'send') {
        const params = payload.params as Record<string, unknown>;
        const conversation = typeof params.groupId === 'string' ? `group:${params.groupId}` : String((params.recipient as unknown[])[0]);
        observe('sendText', conversation);
        sent += 1;
        return json(200, { jsonrpc: '2.0', result: { timestamp: 1764104700000 + sent }, id: payload.id });
      }
      return json(404, {});
    }
    if (channel === 'whatsapp') {
      if (path.endsWith('/messages')) {
        observe('sendText', String(payload.to));
        sent += 1;
        return json(200, {
          messaging_product: 'whatsapp',
          contacts: [{ input: payload.to, wa_id: payload.to }],
          messages: [{ id: `wamid.conformance-${sent}` }],
        });
      }
      return json(404, {});
    }
    throw new Error('the terminal has no HTTP API');
  }) as typeof globalThis.fetch;

  return {
    channel,
    observations,
    requests,
    fetch: fetchImpl,
    output: {
      write: (text: string): boolean => {
        requests.push({ channel, url: 'stdout', body: text });
        if (channel === 'terminal') observe('sendText', CONFORMANCE_CONVERSATION.terminal);
        return true;
      },
    },
    telegramUpdates,
    withKey: async <T>(key: string, run: () => Promise<T>): Promise<T> => {
      activeKey = key;
      try {
        return await run();
      } finally {
        activeKey = null;
      }
    },
  };
}

/** The real Telegram transport over a fake platform, so a case drives the adapter the runtime ships. */
export function telegramConformanceTransport(world: ConformanceWorld, platform: FakePlatform): TelegramTransport {
  return createTelegramTransport({
    stateRoot: world.stateRoot,
    identity: world.identity,
    checkoutRoot: world.checkoutRoot,
    secretName: 'telegram',
    env: world.env,
    resolveEnv: world.env,
    fetch: platform.fetch,
    apiBase: UNREACHABLE_BASE,
    sleep: async () => {},
    log: () => {},
  });
}

/** The real transport for one channel over a fake platform, so every case drives the adapter the runtime ships and never a stand-in. */
export function conformanceTransport(world: ConformanceWorld, channel: ChannelName, platform: FakePlatform): ChannelAdapter {
  const shared = {
    stateRoot: world.stateRoot,
    identity: world.identity,
    checkoutRoot: world.checkoutRoot,
    env: world.env,
    resolveEnv: world.env,
  };
  switch (channel) {
    case 'terminal':
      return createTerminalTransport({
        ...shared,
        osUser: CONFORMANCE_OS_USER,
        input: Readable.from([]),
        output: platform.output,
        listOpen: () => [],
        knownSecrets: () => ({ ok: true, value: new Map() }),
        drainRequest: async () => null,
      });
    case 'telegram':
      return telegramConformanceTransport(world, platform);
    case 'slack':
      return createSlackTransport({
        ...shared,
        secretName: 'slack',
        fetch: platform.fetch,
        socket: () => {
          throw new Error('the conformance suite opens no socket');
        },
        apiBase: UNREACHABLE_BASE,
        sleep: async () => {},
        log: () => {},
      });
    case 'signal':
      return createSignalTransport({
        ...shared,
        secretName: 'signal',
        fetch: platform.fetch,
        daemonUrl: UNREACHABLE_BASE,
        sleep: async () => {},
        log: () => {},
      });
    case 'whatsapp':
      return createWhatsAppTransport({
        ...shared,
        secretName: 'whatsapp',
        fetch: platform.fetch,
        graphBase: UNREACHABLE_BASE,
        listenPort: 0,
        log: () => {},
      });
  }
}

/** A drain passes the queue entry's own key as the intent key, so wrapping the transport tags each wire call with the key the queue holds. */
export function keyedAdapter(transport: ChannelAdapter, platform: FakePlatform): ChannelAdapter {
  return {
    descriptor: () => transport.descriptor(),
    declaredCapabilities: () => transport.declaredCapabilities(),
    start: (sink) => transport.start(sink),
    stop: () => transport.stop(),
    status: () => transport.status(),
    send: (intent) => platform.withKey(intent.idempotencyKey, () => transport.send(intent)),
  };
}

/** The intent one case sends, so every case sends the intent its operation names to the conversation its channel owns. */
export function conformanceIntent(conformance: ConformanceCase): ChannelOutboundIntent {
  return {
    kind: OPERATION_INTENT[conformance.operation],
    idempotencyKey: `conformance-${conformance.channel}-${conformance.operation}`,
    conversationId: CONFORMANCE_CONVERSATION[conformance.channel],
    text: 'Conformance check.',
    itemId: conformance.operation === 'buttons' ? 'ny-conformance-1' : null,
    choices: conformance.operation === 'buttons' ? ['email', 'chat'] : null,
  };
}
