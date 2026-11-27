// Channel test worlds: a temporary state root with the bots CLI pointed at it, and a scripted fake transport that opens no socket.
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

import { checkDeclared, CAPABILITY_MATRIX, CHANNEL_DESCRIPTORS } from '../lib/channel.js';
import { userStateRoot } from '../lib/state-root.js';
import { tempDir, writeConfig } from './support.js';

import type {
  ChannelAdapter,
  ChannelCapabilities,
  ChannelDescriptor,
  ChannelInbound,
  ChannelName,
  ChannelOutboundIntent,
  ChannelSendResult,
  ChannelSink,
  ChannelStatus,
} from '../lib/channel.js';

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
