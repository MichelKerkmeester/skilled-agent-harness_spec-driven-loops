// ───────────────────────────────────────────────────────────────────
// MODULE: Delivery
// ───────────────────────────────────────────────────────────────────
//
// An unattended run that fails is silent until someone reads the state
// root, so every run tells its declared targets what happened. Delivery is
// at most once: a send is claimed before it is made, by creating a claim file
// exclusively and recording the entry as claimed, so no pass can send the
// same notice twice. A send whose result is uncertain is recorded `unknown`
// and never retried, because a duplicate notice costs more than a lost one.
// Run outcome and delivery outcome stay separate fields: delivery only ever
// changes the record's delivery entries, and it starts only after the
// run's terminal record is written.
//
// The first channels are local-only, which sends nothing, and the macOS
// desktop notice. Nothing acknowledges a desktop notice, so it can claim
// `attempted` and never `delivered`. A message carries the bot id, run id,
// outcome, evidence pointers, a kept worktree and a needs-you question:
// never a command line or an environment value, and a body that holds a
// known secret literal is withheld rather than sent.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, join, relative } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { LOCAL_ONLY } from './definition.js';
import { collectAllKnownSecrets, findSecretLiteral } from './dispatch.js';
import { readNeedsYouItem } from './needs-you.js';
import { AWAITING_DECISION, postRunCausesOf, readRunRecord, writeRunRecord } from './run-record.js';
import { deliveryClaimFolder, recordFile, STATE_DIR_MODE, writeGenerationStamp } from './state-root.js';

import type { Delivery } from './definition.js';
import type { NeedsYouItem } from './needs-you.js';
import type { Result } from './repo-config.js';
import type { DeliveryEntry, DeliveryState, RunExit, RunRecord } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Channels a target may name. A target is `<channel>` or `<channel>:<address>`. */
export const DELIVERY_CHANNELS = ['desktop'] as const;

export type DeliveryChannel = (typeof DELIVERY_CHANNELS)[number];

/** Whether a channel's sender can learn that its notice arrived. Only such a channel may record `delivered`. */
const CHANNEL_ACKNOWLEDGES: Readonly<Record<DeliveryChannel, boolean>> = Object.freeze({ desktop: false });

/** The one entry of a run that sends nothing: local-only, no target, or a refusal that is not a failure. */
export const NO_SEND_ENTRY: Readonly<DeliveryEntry> = Object.freeze({
  channel: LOCAL_ONLY,
  target: 'local',
  state: 'not-attempted',
  evidence: null,
});

const OSASCRIPT_TIMEOUT_MS = 10_000;

/** What a sender is handed. The body is already checked for secret literals. */
export interface DeliveryMessage {
  channel: DeliveryChannel;
  target: string;
  title: string;
  body: string;
}

/**
 * What a sender reports. `acknowledged` means the far end confirmed the
 * notice; `uncertain` means it may or may not have gone out.
 */
export interface SendResult {
  outcome: 'acknowledged' | 'attempted' | 'failed' | 'uncertain';
  evidence: string | null;
}

export type DeliverySender = (message: DeliveryMessage) => SendResult;

export type DeliverySenders = Partial<Record<DeliveryChannel, DeliverySender>>;

export interface DeliverInput {
  stateRoot: string;
  identity: string;
  runId: string;
  /** Replaces the real channel senders; tests always pass stubs. */
  senders?: DeliverySenders;
  /** The environment whose secret values a body must not hold. */
  env?: NodeJS.ProcessEnv;
  /** The checkout whose dotenv values a body must not hold. */
  checkoutRoot?: string | null;
}

export interface DeliverOutcome {
  record: RunRecord;
  /** How many senders this pass called. */
  sends: number;
}

interface ClaimFile {
  runId: string;
  itemId: string | null;
  channel: string;
  target: string;
  state: DeliveryState;
  evidence: string | null;
  at: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. TARGET RESOLUTION
// ───────────────────────────────────────────────────────────────────

/** The channel a target names, and whether this build can send on it. */
export function parseTarget(target: string): { channel: string; known: boolean } {
  const channel = target.split(':')[0]?.trim() ?? '';
  return { channel, known: (DELIVERY_CHANNELS as readonly string[]).includes(channel) };
}

/**
 * Turn a definition's delivery fields and a run's exit into the entries the
 * terminal record carries. A failed run goes to the failure override when
 * one is declared. A refusal that is not a failure (a disabled or paused bot,
 * a held lease, a skipped precheck) tells nobody. A run that parked a
 * question sends a notice for its needs-you item, keyed by the item id.
 *
 * @returns One `queued` entry per target, or the single no-send entry.
 */
export function resolveDeliveryEntries(delivery: Delivery | null, exit: RunExit): DeliveryEntry[] {
  if (delivery === null || delivery.mode === 'local-only') return [{ ...NO_SEND_ENTRY }];
  if (exit.refusal !== undefined && exit.refusal !== null && exit.class === null) return [{ ...NO_SEND_ENTRY }];
  const parked = exit.reason === AWAITING_DECISION && exit.needsYouItemId !== null;
  const failed = exit.class !== null && !parked;
  const chosen = failed && delivery.onFailure !== null ? delivery.onFailure : delivery.targets;
  const targets = [...new Set(chosen.map((target) => target.trim()).filter((target) => target !== ''))];
  if (targets.length === 0) return [{ ...NO_SEND_ENTRY }];
  return targets.map((target) => {
    const { channel, known } = parseTarget(target);
    const entry: DeliveryEntry = known
      ? { channel, target, state: 'queued', evidence: null }
      : { channel, target, state: 'not-attempted', evidence: 'channel-unsupported' };
    if (parked) entry.itemId = exit.needsYouItemId as string;
    return entry;
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. MESSAGE
// ───────────────────────────────────────────────────────────────────

/** Show a path relative to the state root or HOME, so no environment value is spelled out in a notice. */
function pointer(path: string, stateRoot: string, home: string): string {
  const fromState = relative(stateRoot, path);
  if (fromState !== '' && !fromState.startsWith('..') && !isAbsolute(fromState)) return `<bots state>/${fromState}`;
  const fromHome = relative(home, path);
  if (fromHome !== '' && !fromHome.startsWith('..') && !isAbsolute(fromHome)) return `~/${fromHome}`;
  return path;
}

function outcomeWord(record: RunRecord): string {
  if (record.exit.reason === AWAITING_DECISION) return 'needs your decision';
  if (record.exit.class === null) return record.exit.refusal ? 'did not start' : 'completed';
  return `failed (${record.exit.class})`;
}

/**
 * Build the notice for one run: bot id, run id, outcome, evidence pointers,
 * a kept worktree's path and branch, and a parked run's question.
 */
export function deliveryMessage(
  record: RunRecord,
  item: NeedsYouItem | null,
  stateRoot: string,
  env: NodeJS.ProcessEnv = process.env,
): { title: string; body: string } {
  const home = env.HOME?.trim() || homedir();
  const lines = [
    `Run ${record.identity.runId}: ${outcomeWord(record)}`,
    `Reason: ${record.exit.reason}`,
  ];
  if (item !== null) lines.push(`Needs-you item ${item.id}: ${item.question}`);
  const tree = record.evidence.worktree;
  if (tree?.disposition === 'kept' && record.evidence.worktreePath !== null) {
    lines.push(`Worktree kept (${tree.keptReason ?? 'unknown'}): ${pointer(record.evidence.worktreePath, stateRoot, home)} on ${record.evidence.branch ?? 'unknown branch'}`);
  }
  lines.push(`Record: ${pointer(recordFile(stateRoot, record.identity.repository, record.identity.runId), stateRoot, home)}`);
  return { title: `Skilled bot ${record.identity.botId}`, body: lines.join('\n') };
}

// ───────────────────────────────────────────────────────────────────
// 4. CHANNELS
// ───────────────────────────────────────────────────────────────────

/**
 * Build the macOS desktop notice sender around an `osascript` binary. The
 * title and body go in as script arguments, never spliced into the script
 * text, because the body may hold a question a child wrote. A clean exit
 * means the notice was handed over, not seen.
 *
 * @param binary - The osascript to call; tests pass an absolute stub path.
 */
export function createDesktopSender(binary = 'osascript'): DeliverySender {
  return (message) => sendDesktopNotice(binary, message);
}

function sendDesktopNotice(binary: string, message: DeliveryMessage): SendResult {
  const run = spawnSync(
    binary,
    ['-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', message.title, message.body],
    { encoding: 'utf8', timeout: OSASCRIPT_TIMEOUT_MS, stdio: ['ignore', 'ignore', 'pipe'] },
  );
  if (run.error !== undefined) {
    const code = (run.error as NodeJS.ErrnoException).code;
    // A missing binary sent nothing; a timeout may already have shown the notice.
    if (code === 'ENOENT') return { outcome: 'failed', evidence: 'osascript not found' };
    return { outcome: 'uncertain', evidence: `osascript ${code ?? 'error'}` };
  }
  if (run.signal !== null) return { outcome: 'uncertain', evidence: `osascript ended by ${run.signal}` };
  if (run.status !== 0) return { outcome: 'failed', evidence: `osascript exit ${String(run.status)}` };
  return { outcome: 'attempted', evidence: 'osascript exit 0' };
}

/** The real desktop channel. */
export const desktopSender: DeliverySender = createDesktopSender();

/** The senders a real run uses. */
export const DEFAULT_SENDERS: Readonly<DeliverySenders> = Object.freeze({ desktop: desktopSender });

function stateFor(channel: DeliveryChannel, result: SendResult): DeliveryState {
  switch (result.outcome) {
    case 'acknowledged':
      return CHANNEL_ACKNOWLEDGES[channel] ? 'delivered' : 'attempted';
    case 'attempted':
      return 'attempted';
    case 'failed':
      return 'failed';
    case 'uncertain':
      return 'unknown';
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. DELIVER
// ───────────────────────────────────────────────────────────────────

function claimPath(stateRoot: string, identity: string, runId: string, entry: DeliveryEntry): string {
  const key = `${entry.itemId !== undefined ? `item:${entry.itemId}` : `run:${runId}`}|${entry.target}`;
  return join(deliveryClaimFolder(stateRoot, identity), `${createHash('sha256').update(key).digest('hex').slice(0, 32)}.json`);
}

/** Claim one send by creating its file exclusively. @returns null when claimed here, else what the earlier claim holds. */
function claim(path: string, body: ClaimFile): ClaimFile | null {
  try {
    writeFileSync(path, `${JSON.stringify(body)}\n`, { flag: 'wx', mode: 0o600 });
    return null;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'EEXIST') throw error;
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as ClaimFile;
    } catch {
      return { ...body, state: 'unknown', evidence: 'claim unreadable' };
    }
  }
}

/**
 * Send every `queued` entry of a run's record once. Each send is claimed
 * and recorded as `claimed` before the sender runs, then recorded with its
 * outcome. A second pass over the same run or the same needs-you item finds
 * nothing queued and sends nothing; an entry claimed by an earlier pass takes
 * that pass's recorded state instead of a second send.
 *
 * @returns The updated record and the number of sends made, or the record read refusal.
 */
export function deliverRecord(input: DeliverInput): Result<DeliverOutcome> {
  const read = readRunRecord(input.stateRoot, input.identity, input.runId);
  if (!read.ok) return read;
  const record = read.value.record;
  const senders = input.senders ?? DEFAULT_SENDERS;
  const env = input.env ?? process.env;
  if (!record.delivery.some((entry) => entry.state === 'queued')) return { ok: true, value: { record, sends: 0 } };

  let item: NeedsYouItem | null = null;
  const itemId = record.delivery.find((entry) => entry.itemId !== undefined)?.itemId;
  if (itemId !== undefined) {
    const found = readNeedsYouItem(input.stateRoot, input.identity, itemId);
    item = found.ok ? found.value : null;
  }
  const message = deliveryMessage(record, item, input.stateRoot, env);
  // A run whose child printed a stored value is never delivered, and a vault
  // that cannot be read withholds the send rather than checking against the
  // environment alone. The message's own literal is checked first, because
  // naming the key the message holds is the evidence an operator acts on.
  const leaked = postRunCausesOf(record).some((row) => row.cause === 'secret-in-output');
  const allKnown = collectAllKnownSecrets(env, input.checkoutRoot ?? null, input.stateRoot, input.identity);
  const secret = allKnown.ok ? findSecretLiteral(`${message.title}\n${message.body}`, allKnown.value) : null;
  mkdirSync(deliveryClaimFolder(input.stateRoot, input.identity), { recursive: true, mode: STATE_DIR_MODE });

  // A rewrite the record refuses or that throws is noted in the claim file, which
  // stays the authority on what was sent, rather than dropped unseen.
  const persist = (): string | null => {
    try {
      const written = writeRunRecord(input.stateRoot, record);
      return written.ok ? null : `${written.reason}${written.detail !== undefined ? ` (${written.detail})` : ''}`;
    } catch (error: unknown) {
      return error instanceof Error ? error.message : String(error);
    }
  };
  const withWriteFailure = (evidence: string | null, failures: string[]): string | null =>
    failures.length === 0 ? evidence : [evidence, `record write failed: ${failures.join('; ')}`].filter((part) => part !== null).join('; ');

  let sends = 0;
  let changed = false;
  for (const entry of record.delivery) {
    if (entry.state !== 'queued') continue;
    const path = claimPath(input.stateRoot, input.identity, input.runId, entry);
    const claimBody: ClaimFile = {
      runId: input.runId,
      itemId: entry.itemId ?? null,
      channel: entry.channel,
      target: entry.target,
      state: 'claimed',
      evidence: null,
      at: new Date().toISOString(),
    };
    const earlier = claim(path, claimBody);
    if (earlier !== null) {
      entry.state = earlier.state;
      entry.evidence = earlier.evidence ?? 'claimed by an earlier pass';
      changed = true;
      const failed = persist();
      // A claim still marked claimed belongs to a send in flight, whose own final write must not be overwritten.
      if (failed !== null && earlier.state !== 'claimed') {
        writeStateAtomic(path, { ...earlier, evidence: withWriteFailure(earlier.evidence, [failed]) } satisfies ClaimFile);
      }
      continue;
    }
    entry.state = 'claimed';
    changed = true;
    const failures: string[] = [];
    const claimedWrite = persist();
    if (claimedWrite !== null) failures.push(`as claimed: ${claimedWrite}`);

    const { channel, known } = parseTarget(entry.target);
    const sender = known ? senders[channel as DeliveryChannel] : undefined;
    if (secret !== null) {
      entry.state = 'not-attempted';
      entry.evidence = `withheld: the message holds a literal of ${secret.kind} ${secret.name}`;
    } else if (leaked) {
      entry.state = 'not-attempted';
      entry.evidence = 'withheld: secret-in-output';
    } else if (!allKnown.ok) {
      entry.state = 'not-attempted';
      entry.evidence = 'withheld: secret-store-unreadable';
    } else if (sender === undefined) {
      entry.state = 'not-attempted';
      entry.evidence = 'channel-unsupported';
    } else {
      sends += 1;
      try {
        const result = sender({ channel: channel as DeliveryChannel, target: entry.target, title: message.title, body: message.body });
        entry.state = stateFor(channel as DeliveryChannel, result);
        entry.evidence = result.evidence;
      } catch (error: unknown) {
        // The sender may have sent before it threw, so the send is uncertain, never failed.
        entry.state = 'unknown';
        entry.evidence = `sender threw: ${error instanceof Error ? error.message : String(error)}`;
      }
    }
    const finalWrite = persist();
    if (finalWrite !== null) failures.push(`as ${entry.state}: ${finalWrite}`);
    writeStateAtomic(path, { ...claimBody, state: entry.state, evidence: withWriteFailure(entry.evidence, failures), at: new Date().toISOString() } satisfies ClaimFile);
  }
  // One stamp per pass, so a status index sees the delivery transitions.
  if (changed) writeGenerationStamp(input.stateRoot, input.identity);
  return { ok: true, value: { record, sends } };
}
