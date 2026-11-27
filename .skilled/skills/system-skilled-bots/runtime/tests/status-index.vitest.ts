// ───────────────────────────────────────────────────────────────────
// MODULE: Status Index Tests
// ───────────────────────────────────────────────────────────────────
//
// The index is derived, so the key test is parity: build it, delete it,
// rebuild it, and find the same rows. The rest prove the pragmas, the stale
// signal, every retention bound and its folder boundary, that a run row is
// never rewritten, and that a damaged file or binding is reported with the
// rebuild named, never answered from the run folders. Every case runs in
// temp folders.

import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { identityKey } from '../lib/identity.js';
import { writeRunRecord } from '../lib/run-record.js';
import { identityStatePaths, runRoot, statusIndexFile, writeGenerationStamp } from '../lib/state-root.js';
import { formatStatus, statusReport } from '../lib/status.js';
import { applyRetention, indexRunRecord, openIndex, readIndex, rebuildIndex, recordUpdatedAt } from '../lib/status-index.js';
import { statusCheckout, statusWorld, writeRecord, writeStatusItem } from './status-support.js';
import { cleanupTemp, tempDir } from './support.js';

import type { IndexSnapshot, RunSummary } from '../lib/status-index.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';

function at(minute: number): string {
  return new Date(Date.UTC(2026, 10, 20, 9, minute)).toISOString();
}

function runId(n: number): string {
  return `r${String(n).padStart(3, '0')}`;
}

/** The snapshot without its two build times, which differ between two builds. */
function withoutBuiltAt(snapshot: IndexSnapshot): Omit<IndexSnapshot, 'builtAt' | 'updatedAt'> {
  const { builtAt: _builtAt, updatedAt: _updatedAt, ...rest } = snapshot;
  return rest;
}

function snapshotOf(stateRoot: string): IndexSnapshot {
  const opened = openIndex(stateRoot);
  if (!opened.ok) throw new Error(`${opened.reason} ${opened.detail ?? ''}`);
  try {
    return readIndex(opened.value);
  } finally {
    opened.value.close();
  }
}

function rebuildOrThrow(stateRoot: string, now?: Date) {
  const built = rebuildIndex(stateRoot, now === undefined ? {} : { now });
  if (!built.ok) throw new Error(`${built.reason} ${built.detail ?? ''}`);
  return built.value;
}

describe('opening the index', () => {
  it('reads back WAL, a 5000 ms busy timeout and full sync from a freshly opened index, owner-only', () => {
    const world = statusWorld();
    rebuildOrThrow(world.stateRoot);
    const opened = openIndex(world.stateRoot);
    if (!opened.ok) throw new Error(opened.reason);
    try {
      expect(opened.value.db.pragma('journal_mode', { simple: true })).toBe('wal');
      expect(opened.value.db.pragma('busy_timeout', { simple: true })).toBe(5000);
      expect(opened.value.db.pragma('synchronous', { simple: true })).toBe(2);
    } finally {
      opened.value.close();
    }
    const path = statusIndexFile(world.stateRoot);
    expect(statSync(path).mode & 0o777).toBe(0o600);
    expect(statSync(join(world.stateRoot, 'index')).mode & 0o777).toBe(0o700);
    // Closing the last connection leaves no write-ahead side file behind.
    expect(readdirSync(join(world.stateRoot, 'index')).sort()).toEqual(['status.sqlite']);
  });

  it('names the file and the rebuild for a truncated index, and for a binding that does not load', () => {
    const world = statusWorld();
    rebuildOrThrow(world.stateRoot);
    const path = statusIndexFile(world.stateRoot);
    writeFileSync(path, readFileSync(path).subarray(0, 40));
    const corrupt = statusReport({ stateRoot: world.stateRoot, seams: world.seams });
    expect(corrupt.ok).toBe(false);
    if (corrupt.ok) return;
    expect(corrupt.reason).toBe('index-unreadable');
    expect(corrupt.detail).toContain(path);
    expect(corrupt.detail).toContain('--rebuild');

    const noBinding = statusReport({
      stateRoot: world.stateRoot,
      seams: world.seams,
      loader: () => {
        throw new Error('NODE_MODULE_VERSION mismatch');
      },
    });
    expect(noBinding).toMatchObject({ ok: false, reason: 'index-binding-failed' });
    if (!noBinding.ok) expect(noBinding.detail).toContain('--rebuild');
  });

  it('accepts a write into an index built by the old DDL', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY);
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(1), dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    rebuildOrThrow(world.stateRoot, new Date('2026-11-21T00:00:00Z'));

    // An index built before the row existed carries a schema version and a builtAt and no updatedAt.
    const opened = openIndex(world.stateRoot);
    if (!opened.ok) throw new Error(opened.reason);
    try {
      opened.value.db.prepare("DELETE FROM meta WHERE key = 'updatedAt'").run();
    } finally {
      opened.value.close();
    }

    const reopened = openIndex(world.stateRoot);
    if (!reopened.ok) throw new Error(`${reopened.reason} ${reopened.detail ?? ''}`);
    try {
      expect(readIndex(reopened.value).updatedAt).toBeNull();
      const columns = reopened.value.db.prepare('PRAGMA table_info(runs)').all();
      const second = writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(2), dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
      indexRunRecord(reopened.value, { ...second, actor: 'ada' }, { skippedSlotsPerSummary: 10 });
      recordUpdatedAt(reopened.value, '2026-11-23T12:00:00.000Z');
      const snapshot = readIndex(reopened.value);
      const row = snapshot.runs.find((candidate) => candidate.runId === runId(2));
      expect(JSON.parse(row?.summary ?? '{}')).toMatchObject({ actor: 'ada' });
      expect(snapshot.updatedAt).toBe('2026-11-23T12:00:00.000Z');
      expect(snapshot.builtAt).toBe('2026-11-21T00:00:00.000Z');
      // The row lives in the meta table, so the runs table keeps the columns it was built with.
      expect(reopened.value.db.prepare('PRAGMA table_info(runs)').all()).toEqual(columns);
    } finally {
      reopened.value.close();
    }
  });
});

describe('building and rebuilding', () => {
  it('indexes three runs with a builtAt, and a rebuild after deleting the file gives the same rows', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY);
    for (const n of [1, 2, 3]) {
      writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(n), dispatchedAt: at(n), repositoryPath: checkout, skilledTree: world.skilledTree });
    }
    const first = rebuildOrThrow(world.stateRoot, new Date('2026-11-21T00:00:00Z'));
    expect(first.runs).toBe(3);
    const before = snapshotOf(world.stateRoot);
    expect(before.runs).toHaveLength(3);
    expect(before.builtAt).toBe('2026-11-21T00:00:00.000Z');

    rmSync(statusIndexFile(world.stateRoot));
    rebuildOrThrow(world.stateRoot, new Date('2026-11-22T00:00:00Z'));
    const after = snapshotOf(world.stateRoot);
    expect(after.builtAt).toBe('2026-11-22T00:00:00.000Z');
    expect(withoutBuiltAt(after)).toEqual(withoutBuiltAt(before));
    // The delivery target can carry a token and is never copied into the index.
    expect(readFileSync(statusIndexFile(world.stateRoot)).includes('T0KEN')).toBe(false);
  });

  it('says it is stale, with builtAt, once a run writes a newer generation stamp', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY);
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(1), dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeGenerationStamp(world.stateRoot, IDENTITY);
    rebuildOrThrow(world.stateRoot, new Date('2026-11-21T00:00:00Z'));
    const fresh = statusReport({ stateRoot: world.stateRoot, seams: world.seams });
    expect(fresh).toMatchObject({ ok: true, value: { stale: false } });

    writeGenerationStamp(world.stateRoot, IDENTITY);
    // A read brings a stale identity up to date, so a moved stamp alone no longer leaves the index stale.
    const moved = statusReport({ stateRoot: world.stateRoot, seams: world.seams });
    expect(moved).toMatchObject({ ok: true, value: { stale: false } });

    // Stale now means a refresh that could not complete, so the stamp moves again and the item folder stops listing.
    writeGenerationStamp(world.stateRoot, IDENTITY);
    const needsYou = identityStatePaths(world.stateRoot, IDENTITY).needsYou;
    mkdirSync(needsYou, { recursive: true });
    chmodSync(needsYou, 0o000);
    try {
      const stale = statusReport({ stateRoot: world.stateRoot, seams: world.seams });
      if (!stale.ok) throw new Error(stale.reason);
      expect(stale.value.stale).toBe(true);
      expect(stale.value.staleIdentities).toEqual([IDENTITY]);
      const text = formatStatus(stale.value).join('\n');
      expect(text).toContain('stale');
      expect(text).toContain('2026-11-21T00:00:00.000Z');
    } finally {
      chmodSync(needsYou, 0o700);
    }
  });

  it('carries the actor in the run summary', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY);
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(2), dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
    const first = writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(1), dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    const named = writeRunRecord(world.stateRoot, { ...first, actor: 'ada' });
    if (!named.ok) throw new Error(named.reason);

    rebuildOrThrow(world.stateRoot, new Date('2026-11-21T00:00:00Z'));
    const snapshot = snapshotOf(world.stateRoot);
    const summaries = snapshot.runs.map((row) => JSON.parse(row.summary) as RunSummary);
    expect(summaries.map((summary) => summary.actor)).toEqual(['ada', null]);
    // A build stamps both times with the same instant.
    expect(snapshot.updatedAt).toBe(snapshot.builtAt);
  });
});

describe('retention', () => {
  it('cuts index rows, run folders and the skipped-slot list to their bounds from bots/config.json', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY, { retention: { indexRowsPerIdentity: 5, runFoldersPerBot: 3, skippedSlotsPerSummary: 4 } });
    for (let n = 1; n <= 8; n += 1) {
      const slots = Array.from({ length: 10 }, (_, i) => at(i));
      writeRecord(world.stateRoot, {
        identity: IDENTITY,
        botId: 'nightly',
        runId: runId(n),
        dispatchedAt: at(10 + n),
        repositoryPath: checkout,
        skilledTree: world.skilledTree,
        skippedSlots: n === 8 ? { count: 10, slots, first: slots[0] ?? null, last: slots[9] ?? null } : null,
      });
    }
    rebuildOrThrow(world.stateRoot);
    const snapshot = snapshotOf(world.stateRoot);
    expect(snapshot.runs.map((run) => run.runId)).toEqual([runId(4), runId(5), runId(6), runId(7), runId(8)]);
    const runsFolder = join(runRoot(world.skilledTree), identityKey(IDENTITY), 'runs');
    expect(readdirSync(runsFolder).sort()).toEqual([runId(6), runId(7), runId(8)]);
    const newest = JSON.parse(snapshot.runs[4]?.summary ?? '{}') as { skippedSlots: { count: number; slots: string[] } };
    expect(newest.skippedSlots.count).toBe(10);
    expect(newest.skippedSlots.slots).toHaveLength(4);
    // Run records are the source and are never deleted by retention.
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).records)).toHaveLength(8);
  });

  it('never rewrites a run row: every kept row stays byte-identical to its first write', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY, { retention: { indexRowsPerIdentity: 5 } });
    rebuildOrThrow(world.stateRoot);
    const opened = openIndex(world.stateRoot);
    if (!opened.ok) throw new Error(opened.reason);
    const firstWrite = new Map<string, string>();
    const dump = () => readIndex(opened.value).runs;
    try {
      const retention = { skippedSlotsPerSummary: 100 };
      const records = [];
      for (let n = 1; n <= 9; n += 1) {
        const record = writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(n), dispatchedAt: at(n), repositoryPath: checkout, skilledTree: world.skilledTree });
        records.push(record);
        indexRunRecord(opened.value, record, retention);
        const row = dump().find((candidate) => candidate.runId === runId(n));
        firstWrite.set(runId(n), JSON.stringify(row));
      }
      // A later pass records delivery and even a different exit; the terminal row must not move.
      const changed = { ...records[8], exit: { reason: 'tampered', class: null, needsYouItemId: null }, delivery: [] } as unknown as (typeof records)[number];
      indexRunRecord(opened.value, changed, retention);
      applyRetention(opened.value, world.stateRoot, identityKey(IDENTITY), { indexRowsPerIdentity: 5, runFoldersPerBot: 200, skippedSlotsPerSummary: 100, closedNeedsYouPerIdentity: 200 });
      const kept = dump();
      expect(kept).toHaveLength(5);
      for (const row of kept) expect(JSON.stringify(row)).toBe(firstWrite.get(row.runId));
      expect(readIndex(opened.value).deliveries.filter((entry) => entry.runId === runId(9))).toEqual([]);
    } finally {
      opened.value.close();
    }
  });

  it('deletes run folders only inside the identity runs folder: a link out and another identity folder stay', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY, { retention: { runFoldersPerBot: 1 } });
    const runsFolder = join(runRoot(world.skilledTree), identityKey(IDENTITY), 'runs');
    mkdirSync(runsFolder, { recursive: true });
    const outside = tempDir('bots-outside-');
    writeFileSync(join(outside, 'keep.txt'), 'outside the runs folder');
    symlinkSync(outside, join(runsFolder, runId(1)));
    const other = writeRecord(world.stateRoot, { identity: 'acme/other', botId: 'nightly', runId: runId(2), dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeFileSync(join(other.evidence.runFolder, 'evidence.txt'), 'another identity');

    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(1), dispatchedAt: at(1), repositoryPath: checkout, runFolder: join(runsFolder, runId(1)) });
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(3), dispatchedAt: at(3), repositoryPath: checkout, runFolder: other.evidence.runFolder });
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(4), dispatchedAt: at(4), repositoryPath: checkout, skilledTree: world.skilledTree });
    const old = writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(0), dispatchedAt: at(0), repositoryPath: checkout, skilledTree: world.skilledTree });

    const built = rebuildOrThrow(world.stateRoot);
    expect(readFileSync(join(outside, 'keep.txt'), 'utf8')).toBe('outside the runs folder');
    expect(readFileSync(join(other.evidence.runFolder, 'evidence.txt'), 'utf8')).toBe('another identity');
    expect(built.retention.runFoldersRefused.sort()).toEqual([join(runsFolder, runId(1)), other.evidence.runFolder].sort());
    expect(built.retention.runFoldersDeleted).toEqual([old.evidence.runFolder]);
    expect(existsSync(old.evidence.runFolder)).toBe(false);
  });

  it('keeps the closed-item bound and every open item, deleting only closed item files', () => {
    const world = statusWorld();
    statusCheckout(world, IDENTITY, { retention: { closedNeedsYouPerIdentity: 4 } });
    const now = new Date('2026-11-23T12:00:00Z');
    for (let n = 1; n <= 7; n += 1) {
      writeStatusItem(world.stateRoot, { identity: IDENTITY, botId: 'nightly', id: `a${n}`, createdAt: at(n), expiresAt: '2026-12-30T00:00:00.000Z', answer: 'merge', resumeRequestId: `req-a${n}` });
    }
    for (let n = 1; n <= 7; n += 1) {
      writeStatusItem(world.stateRoot, { identity: IDENTITY, botId: 'nightly', id: `e${n}`, createdAt: at(20 + n), expiresAt: '2026-11-21T00:00:00.000Z' });
    }
    for (let n = 1; n <= 3; n += 1) {
      writeStatusItem(world.stateRoot, { identity: IDENTITY, botId: 'nightly', id: `o${n}`, createdAt: at(n), expiresAt: '2026-12-30T00:00:00.000Z' });
    }
    rebuildOrThrow(world.stateRoot, now);
    const files = readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou).sort();
    expect(files).toHaveLength(4 + 3);
    expect(files).toEqual(expect.arrayContaining(['o1.json', 'o2.json', 'o3.json']));
    // The four newest closed items are the newest expired ones.
    expect(files.filter((name) => name.startsWith('e'))).toEqual(['e4.json', 'e5.json', 'e6.json', 'e7.json']);
    expect(snapshotOf(world.stateRoot).items).toHaveLength(7);
  });
});

describe('what retention never deletes', () => {
  it('keeps an answered item whose resume is queued, claimed or not yet recorded, past the bound', () => {
    const world = statusWorld();
    statusCheckout(world, IDENTITY, { retention: { closedNeedsYouPerIdentity: 1 } });
    const now = new Date('2026-11-23T12:00:00Z');
    const requests = identityStatePaths(world.stateRoot, IDENTITY).requests;
    mkdirSync(requests.inbox, { recursive: true });
    mkdirSync(requests.claimed, { recursive: true });
    writeFileSync(join(requests.inbox, 'req-queued.json'), '{}');
    writeFileSync(join(requests.claimed, 'req-claimed.json'), '{}');
    const answered = (id: string, minute: number, resumeRequestId: string | null) =>
      writeStatusItem(world.stateRoot, { identity: IDENTITY, botId: 'nightly', id, createdAt: at(minute), expiresAt: '2026-12-30T00:00:00.000Z', answer: 'merge', resumeRequestId });
    answered('queued', 1, 'req-queued');
    answered('claimed', 2, 'req-claimed');
    answered('unsent', 3, null);
    answered('drained1', 4, 'req-done1');
    answered('drained2', 5, 'req-done2');
    rebuildOrThrow(world.stateRoot, now);
    // Of the two whose resume left the queue, the bound keeps the newest; the three still waiting all stay.
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou).sort()).toEqual(['claimed.json', 'drained2.json', 'queued.json', 'unsent.json']);
  });

  it('keeps the run folder of a run an open item names, past the per-bot bound', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY, { retention: { runFoldersPerBot: 1 } });
    const parked = writeRecord(world.stateRoot, {
      identity: IDENTITY,
      botId: 'nightly',
      runId: runId(1),
      dispatchedAt: at(1),
      repositoryPath: checkout,
      skilledTree: world.skilledTree,
      exit: { reason: 'awaiting-decision', class: 'operator', needsYouItemId: runId(1) },
    });
    const plain = writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(2), dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(3), dispatchedAt: at(3), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeStatusItem(world.stateRoot, { identity: IDENTITY, botId: 'nightly', id: runId(1), createdAt: at(1), expiresAt: '2099-01-01T00:00:00.000Z' });
    rebuildOrThrow(world.stateRoot);
    expect(existsSync(parked.evidence.runFolder)).toBe(true);
    expect(existsSync(plain.evidence.runFolder)).toBe(false);
  });

  it('prunes nothing for an identity whose checkout cannot be read, even when the defaults would', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY, { retention: { closedNeedsYouPerIdentity: 300 } });
    for (let n = 0; n < 210; n += 1) {
      writeStatusItem(world.stateRoot, { identity: IDENTITY, botId: 'nightly', id: `e${String(n).padStart(3, '0')}`, createdAt: at(n % 60), expiresAt: '2026-11-21T00:00:00.000Z' });
    }
    rmSync(checkout, { recursive: true, force: true });
    const built = rebuildOrThrow(world.stateRoot, new Date('2026-11-23T12:00:00Z'));
    expect(built.retentionSkipped).toEqual([IDENTITY]);
    expect(readdirSync(identityStatePaths(world.stateRoot, IDENTITY).needsYou)).toHaveLength(210);
  });

  it('deletes nothing when the build fails before its new index is in place', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, IDENTITY, { retention: { runFoldersPerBot: 1 } });
    const old = writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(1), dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeRecord(world.stateRoot, { identity: IDENTITY, botId: 'nightly', runId: runId(2), dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
    // A folder where the index file belongs makes the final rename fail.
    mkdirSync(join(statusIndexFile(world.stateRoot), 'blocker'), { recursive: true });
    const built = rebuildIndex(world.stateRoot);
    expect(built).toMatchObject({ ok: false, reason: 'index-build-failed' });
    expect(existsSync(old.evidence.runFolder)).toBe(true);
  });
});

describe('an empty state root', () => {
  it('builds an index with no rows and a builtAt', () => {
    const world = statusWorld();
    const report = statusReport({ stateRoot: world.stateRoot, seams: world.seams });
    if (!report.ok) throw new Error(report.reason);
    expect(report.value.rows).toEqual([]);
    expect(report.value.builtAt).not.toBeNull();
    expect(report.value.stale).toBe(false);
  });
});
