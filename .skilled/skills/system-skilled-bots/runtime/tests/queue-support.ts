// ───────────────────────────────────────────────────────────────────
// MODULE: Queue Test Support
// ───────────────────────────────────────────────────────────────────
//
// Helpers the queue tests share: the queue folders of a test world, its run
// records, a needs-you item written straight to the state root, and one
// drain pass with the recursion guard's host reads pinned empty. Everything
// stays inside the world's temp folders.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { needsYouExpiry, writeNeedsYouItem } from '../lib/needs-you.js';
import { drainQueue } from '../lib/request-drain.js';
import { queuePaths } from '../lib/request-queue.js';
import { newRunId } from '../lib/runner.js';
import { identityStatePaths } from '../lib/state-root.js';
import { IDENTITY } from './runner-support.js';

import type { NeedsYouItem } from '../lib/needs-you.js';
import type { DrainInput } from '../lib/request-drain.js';
import type { RunRecord } from '../lib/run-record.js';
import type { BotWorld } from './runner-support.js';

/** The queue folders of a world. */
export function queueOf(world: BotWorld) {
  return queuePaths(world.stateRoot, IDENTITY);
}

/** The entries of a folder, the way `ls -A` lists them; a missing folder lists nothing. */
export function entries(folder: string): string[] {
  return existsSync(folder) ? readdirSync(folder).sort() : [];
}

/** Every run record of a world. */
export function records(world: BotWorld): RunRecord[] {
  const folder = identityStatePaths(world.stateRoot, IDENTITY).records;
  return entries(folder)
    .filter((name) => name.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(folder, name), 'utf8')) as RunRecord);
}

/** Write a needs-you item for a bot straight to the state root; open unless an answer is given. */
export function writeItem(
  world: BotWorld,
  botId: string,
  options: { createdAt?: Date; expiryDays?: number; answer?: string; prompt?: string } = {},
): NeedsYouItem {
  const created = options.createdAt ?? new Date();
  const id = newRunId(created);
  const item: NeedsYouItem = {
    id,
    runId: id,
    botId,
    identity: IDENTITY,
    question: 'Merge or open a PR?',
    options: ['merge', 'open a PR'],
    createdAt: created.toISOString(),
    expiresAt: needsYouExpiry(created, options.expiryDays ?? 7),
    evidence: [],
    prompt: options.prompt ?? 'The parked prompt.',
    specFolder: null,
    answer: options.answer === undefined ? null : { text: options.answer, answeredAt: created.toISOString() },
    resumeRequestId: null,
  };
  const written = writeNeedsYouItem(world.stateRoot, item);
  if (!written.ok) throw new Error(written.reason);
  return item;
}

/** One drain pass over a world's queue, with the real runner unless one is given. */
export function drain(world: BotWorld, extra: Partial<DrainInput> = {}) {
  return drainQueue({
    checkoutRoot: world.checkoutRoot,
    skilledTree: world.skilledTree,
    env: world.env,
    runOptions: { guard: { ancestryCmdlines: [], statePaths: [] } },
    ...extra,
  });
}
