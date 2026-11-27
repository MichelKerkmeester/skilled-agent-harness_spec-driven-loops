// ───────────────────────────────────────────────────────────────────
// MODULE: Bots Activity Tests
// ───────────────────────────────────────────────────────────────────
//
// The activity read is the one place a reader sees every group at once, so
// these tests pin three things: the group order and the row shape a reader
// depends on, the empty read, and the whole one data set the terminal screen
// is drawn from. The last one builds a real state root in a temp folder and
// compares the payload against the screen's own sample, so the runtime and
// the screen are tested against one file rather than two copies of it.
//
// The cron in the data set must give a fixed instant, so the time zone is
// pinned to UTC before any Date is made and put back when the file is done.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import { buildActivity, formatActivity } from '../lib/activity.js';
import { identityKey } from '../lib/identity.js';
import { buildBotLabel, buildDrainLabel } from '../lib/label.js';
import { writeNeedsYouItem } from '../lib/needs-you.js';
import { writeRunRecord } from '../lib/run-record.js';
import { leaseFile, leaseKey } from '../lib/runner.js';
import { identityStatePaths, installFile, writeGenerationStamp } from '../lib/state-root.js';
import { activityReport, statusReport } from '../lib/status.js';
import { openIndex, readIndex, rebuildIndex } from '../lib/status-index.js';
import { cleanupTemp, tempDir } from './support.js';

import type { ActivityGroup, ActivityPayload, ActivitySources, DescribeStart, LiveRun } from '../lib/activity.js';
import type { NeedsYouItem } from '../lib/needs-you.js';
import type { RunRecord } from '../lib/run-record.js';
import type { ActivityInput } from '../lib/status.js';
import type { IndexSnapshot, RunSummary } from '../lib/status-index.js';

const SAVED_TZ = process.env.TZ;
process.env.TZ = 'UTC';

afterEach(cleanupTemp);

afterAll(() => {
  if (SAVED_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = SAVED_TZ;
});

const FIXTURES = 'specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/fixtures';
const ONE_DATA_SET = `${FIXTURES}/one-data-set.json`;
const EMPTY = `${FIXTURES}/empty.json`;
const QUEUED_REQUEST = `${FIXTURES}/queued-request.json`;
const ACTIVITY_PAYLOAD = 'specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/activity.json';

const NOW = new Date('2026-11-25T21:14:04.000Z');
const IDENTITY = 'acme/tool';

/** The keys every row carries, whatever group it lands in. */
const ROW_KEYS = ['actor', 'at', 'botId', 'identity', 'runId', 'schedule', 'state'];

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE READING
// ───────────────────────────────────────────────────────────────────

/** A repository-relative path from a fixture, resolved from this file. */
function repoPath(path: string): string {
  return resolve(import.meta.dirname, '..', '..', '..', '..', '..', path);
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(repoPath(path), 'utf8')) as T;
}

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Set one dotted path, making the objects on the way when they are not there. */
function setPath(target: JsonObject, path: string, value: unknown): void {
  const parts = path.split('.');
  const last = parts.pop() as string;
  let node = target;
  for (const part of parts) {
    const next = node[part];
    if (!isObject(next)) {
      const made: JsonObject = {};
      node[part] = made;
      node = made;
      continue;
    }
    node = next;
  }
  node[last] = value;
}

/** Delete one dotted path, leaving a path that is not there alone. */
function dropPath(target: JsonObject, path: string): void {
  const parts = path.split('.');
  const last = parts.pop() as string;
  let node = target;
  for (const part of parts) {
    const next = node[part];
    if (!isObject(next)) return;
    node = next;
  }
  delete node[last];
}

// ───────────────────────────────────────────────────────────────────
// 2. THE ONE DATA SET
// ───────────────────────────────────────────────────────────────────

interface OneDataSet {
  clock: string;
  timeZone: string;
  identity: string;
  checkoutRoot: string;
  recordBase: string;
  recordBaseDrop: string[];
  records: JsonObject[];
  items: NeedsYouItem[];
  leases: Array<{ botId: string; specFolder: string | null; acquireNonce: string; seed: JsonObject }>;
  requests: unknown[];
  installs: JsonObject[];
  describe: Record<string, string>;
  expect: Record<string, unknown>;
}

/**
 * Build the one data set into a fresh temp state root: its run records, its
 * needs-you items, its live lease, its install records and the index over
 * them. Every path the data set names is repository-relative, and every run
 * folder it names is replaced by a temp folder, so nothing here depends on a
 * checkout that only exists on the machine the sample was written on.
 */
function buildOneDataSet(): { stateRoot: string; clock: Date; identity: string; describe: DescribeStart } {
  const data = readJson<OneDataSet>(ONE_DATA_SET);
  const clock = new Date(data.clock);
  const stateRoot = tempDir('bots-state-');
  const base = readJson<JsonObject>(data.recordBase);

  for (const [position, entry] of data.records.entries()) {
    const record = JSON.parse(JSON.stringify(base)) as JsonObject;
    for (const path of data.recordBaseDrop) dropPath(record, path);
    for (const [path, value] of Object.entries(entry)) setPath(record, path, value);
    const evidence = record.evidence;
    if (isObject(evidence) && typeof evidence.runFolder === 'string' && !existsSync(evidence.runFolder)) {
      evidence.runFolder = tempDir('bots-run-');
    }
    const written = writeRunRecord(stateRoot, record as unknown as RunRecord);
    if (!written.ok) throw new Error(`record ${String(position)}: ${written.reason} ${written.detail ?? ''}`);
  }

  for (const item of data.items) {
    const written = writeNeedsYouItem(stateRoot, item);
    if (!written.ok) throw new Error(`item ${item.id}: ${written.reason} ${written.detail ?? ''}`);
  }

  for (const entry of data.leases) {
    const lease = leaseFile(stateRoot, data.identity, leaseKey(data.identity, entry.botId, entry.specFolder));
    mkdirSync(dirname(lease), { recursive: true });
    writeFileSync(lease, '');
    writeFileSync(`${lease}.run.json`, JSON.stringify({ ownerPid: process.pid, acquireNonce: entry.acquireNonce, seed: entry.seed }));
  }

  for (const entry of data.installs) {
    const botId = String(entry.botId);
    const label = entry.agent === 'drain' ? buildDrainLabel(data.identity) : buildBotLabel(data.identity, botId, 0);
    if (!label.ok) throw new Error(`label ${botId}: ${label.reason}`);
    const path = installFile(stateRoot, data.identity, botId);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify({
      ...entry,
      schemaVersion: 1,
      identity: data.identity,
      checkoutRoot: data.checkoutRoot,
      labels: [label.value],
      plistPaths: [],
      interpreter: process.execPath,
      plistRunnerPath: resolve(stateRoot, 'bots.cjs'),
      repoRunnerPath: resolve(stateRoot, 'bots.cjs'),
      repoRunnerRealPath: resolve(stateRoot, 'bots.cjs'),
      treeRoot: resolve(stateRoot, 'skilled'),
      skilledTree: resolve(stateRoot, 'skilled'),
      skilledKind: 'repository',
      pinCommit: null,
      installedAt: data.clock,
      enabledAt: null,
    }));
  }

  const built = rebuildIndex(stateRoot, { now: clock });
  if (!built.ok) throw new Error(`index: ${built.reason} ${built.detail ?? ''}`);

  const describeStart: DescribeStart = (start) => data.describe[start.expression] ?? null;
  return { stateRoot, clock, identity: data.identity, describe: describeStart };
}

/** The payload, or the refusal as a thrown error so a broken read names itself. */
function activityOrThrow(input: ActivityInput): ActivityPayload {
  const report = activityReport(input);
  if (!report.ok) throw new Error(`${report.reason} ${report.detail ?? ''}`);
  return report.value;
}

// ───────────────────────────────────────────────────────────────────
// 3. HAND-BUILT SOURCES
// ───────────────────────────────────────────────────────────────────

/** A run summary as the index stores it, with every field the read may touch. */
function runSummary(input: {
  identity: string;
  botId: string;
  runId: string;
  dispatchedAt: string;
  exitReason: string;
  exitClass: string | null;
  refusalCause: string | null;
  actor: string | null;
}): RunSummary {
  return {
    runId: input.runId,
    botId: input.botId,
    identity: input.identity,
    repositoryPath: '/tmp/checkout',
    definitionDigest: 'digest',
    source: 'manual',
    scheduledAt: null,
    dispatchedAt: input.dispatchedAt,
    latenessClass: null,
    skippedSlots: null,
    heldSlot: null,
    exitReason: input.exitReason,
    exitClass: input.exitClass,
    needsYouItemId: null,
    refusalCause: input.refusalCause,
    runFolder: '/tmp/run',
    requestId: null,
    actor: input.actor,
  };
}

/** One run row of a snapshot, with its summary serialized as the index keeps it. */
function runRow(input: { identity: string; botId: string; runId: string; dispatchedAt: string; summary: RunSummary }): IndexSnapshot['runs'][number] {
  return {
    identityKey: identityKey(input.identity),
    runId: input.runId,
    identity: input.identity,
    repositoryPath: '/tmp/checkout',
    botId: input.botId,
    dispatchedAt: input.dispatchedAt,
    runFolder: '/tmp/run',
    summary: JSON.stringify(input.summary),
  };
}

/** One open needs-you item row. */
function itemRow(input: { identity: string; botId: string; runId: string; createdAt: string; expiresAt: string }): IndexSnapshot['items'][number] {
  return {
    identityKey: identityKey(input.identity),
    itemId: input.runId,
    identity: input.identity,
    botId: input.botId,
    runId: input.runId,
    createdAt: input.createdAt,
    expiresAt: input.expiresAt,
    answeredAt: null,
    resumeRequestId: null,
  };
}

/** A snapshot holding only what a case gives it. */
function snapshotOf(input: { runs: IndexSnapshot['runs']; items: IndexSnapshot['items'] }): IndexSnapshot {
  return {
    builtAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
    generations: {},
    runs: input.runs,
    deliveries: [],
    items: input.items,
    retired: [],
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. STATE ROOT SOURCES
// ───────────────────────────────────────────────────────────────────

/** A minimal valid run record, with the fields a row source reads. */
function recordFor(input: {
  botId: string;
  runId: string;
  dispatchedAt: string;
  source?: string;
  exit?: RunRecord['exit'];
  actor?: string | null;
  delivery?: RunRecord['delivery'];
}): RunRecord {
  return {
    schemaVersion: 1,
    identity: { repository: IDENTITY, repositoryPath: '/tmp/checkout', botId: input.botId, runId: input.runId, definitionDigest: 'digest' },
    request: { requestId: null, leaseNonce: null, resultEventId: null, firedSlot: null, resumedItemId: null },
    dispatch: {
      source: input.source ?? 'manual',
      scheduledAt: null,
      dispatchedAt: input.dispatchedAt,
      latenessSeconds: null,
      latenessClass: null,
      skippedSlots: null,
    },
    budget: {
      declared: { maxIterations: 1, maxDurationMinutes: 5, timeoutSeconds: 60 },
      measured: { iterations: 1, elapsedMinutes: 0.1, costUsd: null, costSource: null },
    },
    posture: { isolation: 'shared', sandbox: 'read-only', executorKind: 'cli-codex', model: null },
    exit: input.exit ?? { reason: 'converged', class: null, needsYouItemId: null, refusal: null },
    evidence: { runFolder: '/tmp/run', ledgerDir: null, receiptDir: null, observabilityStream: null, worktreePath: null, branch: null },
    delivery: input.delivery ?? [],
    actor: input.actor ?? null,
  };
}

/** Every run record under one state root, in file order. */
function recordsOf(stateRoot: string, identity: string): RunRecord[] {
  const folder = identityStatePaths(stateRoot, identity).records;
  return readdirSync(folder)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(folder, name), 'utf8')) as RunRecord);
}

/** Write one install record the way the one data set does. */
function writeInstall(stateRoot: string, identity: string, entry: JsonObject): void {
  const botId = String(entry.botId);
  const label = buildBotLabel(identity, botId, 0);
  if (!label.ok) throw new Error(`label ${botId}: ${label.reason}`);
  const path = installFile(stateRoot, identity, botId);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({
    ...entry,
    schemaVersion: 1,
    identity,
    checkoutRoot: '/tmp/checkout',
    labels: [label.value],
    plistPaths: [],
    interpreter: process.execPath,
    plistRunnerPath: resolve(stateRoot, 'bots.cjs'),
    repoRunnerPath: resolve(stateRoot, 'bots.cjs'),
    repoRunnerRealPath: resolve(stateRoot, 'bots.cjs'),
    treeRoot: resolve(stateRoot, 'skilled'),
    skilledTree: resolve(stateRoot, 'skilled'),
    skilledKind: 'repository',
    pinCommit: null,
    installedAt: NOW.toISOString(),
    enabledAt: null,
  }));
}

/** A lease file and its side file, as a run in flight leaves them. */
function writeLease(
  stateRoot: string,
  identity: string,
  input: { botId: string; runId: string; dispatchedAt: string; ownerPid: number; actor: string | null },
): void {
  const lease = leaseFile(stateRoot, identity, leaseKey(identity, input.botId, null));
  mkdirSync(dirname(lease), { recursive: true });
  writeFileSync(lease, '');
  writeFileSync(`${lease}.run.json`, JSON.stringify({
    ownerPid: input.ownerPid,
    acquireNonce: '5b7d9f1a',
    seed: { identity, botId: input.botId, runId: input.runId, dispatchedAt: input.dispatchedAt, actor: input.actor },
  }));
}

/** The payload of one state root, with its index rebuilt first so the read sees the files. */
function activityOf(stateRoot: string, describe: DescribeStart): ActivityPayload {
  const built = rebuildIndex(stateRoot, { now: NOW });
  if (!built.ok) throw new Error(`index: ${built.reason} ${built.detail ?? ''}`);
  return activityOrThrow({ stateRoot, now: NOW, describe });
}

/** One group of a payload, or a failure naming the group that is not there. */
function groupOf(payload: ActivityPayload, id: ActivityGroup['id']): ActivityGroup {
  const group = payload.groups.find((candidate) => candidate.id === id);
  if (group === undefined) throw new Error(`no ${id} group`);
  return group;
}

// ───────────────────────────────────────────────────────────────────
// 5. TESTS
// ───────────────────────────────────────────────────────────────────

describe('bots activity', () => {
  it('order', () => {
    const doneAt = '2026-11-25T21:02:04.000Z';
    const sources: ActivitySources = {
      snapshot: snapshotOf({
        runs: [
          runRow({
            identity: IDENTITY,
            botId: 'hello',
            runId: 'run-1',
            dispatchedAt: doneAt,
            summary: runSummary({
              identity: IDENTITY,
              botId: 'hello',
              runId: 'run-1',
              dispatchedAt: doneAt,
              exitReason: 'converged',
              exitClass: null,
              refusalCause: null,
              actor: 'ada',
            }),
          }),
        ],
        items: [
          itemRow({
            identity: IDENTITY,
            botId: 'hello',
            runId: 'run-1',
            createdAt: '2026-11-25T21:12:04.000Z',
            expiresAt: '2026-11-26T21:12:04.000Z',
          }),
        ],
      }),
      live: [
        { identity: IDENTITY, botId: 'digest', runId: 'run-2', dispatchedAt: '2026-11-25T21:13:40.000Z', actor: 'ada' } satisfies LiveRun,
      ],
      queued: [],
      fires: [],
      now: NOW,
    };

    const payload = buildActivity(sources);
    expect(payload.groups.map((group) => group.id)).toEqual(['needs_you', 'working', 'done']);

    const rows = payload.groups.flatMap((group) => group.rows);
    expect(rows).toHaveLength(3);
    for (const row of rows) expect(Object.keys(row).sort()).toEqual(ROW_KEYS);

    // Two rows at one instant are ordered by identity first and bot id second,
    // so the order never depends on the order the sources were gathered in.
    const tieAt = '2026-11-25T20:00:00.000Z';
    const tie = (identity: string, botId: string, runId: string): IndexSnapshot['runs'][number] => runRow({
      identity,
      botId,
      runId,
      dispatchedAt: tieAt,
      summary: runSummary({
        identity,
        botId,
        runId,
        dispatchedAt: tieAt,
        exitReason: 'converged',
        exitClass: null,
        refusalCause: null,
        actor: 'ada',
      }),
    });
    const tied = buildActivity({
      snapshot: snapshotOf({
        runs: [tie('acme/beta', 'alpha', 'run-c'), tie('acme/alpha', 'zeta', 'run-a'), tie('acme/alpha', 'aaa', 'run-b')],
        items: [],
      }),
      live: [],
      queued: [],
      fires: [],
      now: NOW,
    });
    const done = tied.groups.find((group) => group.id === 'done');
    expect(done?.rows.map((row) => `${row.identity} ${row.botId}`)).toEqual(['acme/alpha aaa', 'acme/alpha zeta', 'acme/beta alpha']);
  });

  it('empty', () => {
    const stateRoot = tempDir('bots-state-');
    const empty = readJson<{ activityJson: ActivityPayload }>(EMPTY);

    const payload = activityOrThrow({ stateRoot, now: NOW });

    expect(payload).toEqual(empty.activityJson);
    expect(formatActivity(payload)).toEqual([]);
  });

  it('one data set', () => {
    const data = buildOneDataSet();
    const expected = readJson<ActivityPayload>(ACTIVITY_PAYLOAD);

    const withDescribe = activityOrThrow({ stateRoot: data.stateRoot, now: data.clock, describe: data.describe });
    expect(withDescribe).toEqual(expected);

    const withoutDescribe = activityOrThrow({ stateRoot: data.stateRoot, now: data.clock });
    expect(withoutDescribe).toEqual(expected);
  });

  it('refresh on read', () => {
    const data = buildOneDataSet();
    const records = recordsOf(data.stateRoot, data.identity);
    const runFolders = records.map((record) => record.evidence.runFolder);
    expect(runFolders.length).toBeGreaterThan(0);
    for (const folder of runFolders) expect(existsSync(folder)).toBe(true);

    const template = records.find((record) => record.identity.botId === 'hello' && record.exit.reason === 'converged');
    if (template === undefined) throw new Error('the data set holds no converged hello run');

    // A run that ended after the build lands with no rebuild, and the stamp says the index is behind.
    const newRunId = '20261125T211350Z-aa11bb22';
    const landed = writeRunRecord(data.stateRoot, {
      ...template,
      identity: { ...template.identity, runId: newRunId },
      dispatch: { ...template.dispatch, dispatchedAt: '2026-11-25T21:13:50.000Z' },
      exit: { reason: 'converged', class: null, needsYouItemId: null, refusal: null },
      delivery: [],
    });
    if (!landed.ok) throw new Error(`landed run: ${landed.reason} ${landed.detail ?? ''}`);
    writeGenerationStamp(data.stateRoot, data.identity);

    // A delivery outcome changes after the run ended, so the row is rewritten and the stamp moves again.
    const rewritten = writeRunRecord(data.stateRoot, {
      ...template,
      delivery: [{ channel: 'telegram', target: 'ada', state: 'delivered', evidence: null }],
    });
    if (!rewritten.ok) throw new Error(`rewritten run: ${rewritten.reason} ${rewritten.detail ?? ''}`);
    writeGenerationStamp(data.stateRoot, data.identity);

    const payload = activityOrThrow({ stateRoot: data.stateRoot, now: data.clock });
    expect(groupOf(payload, 'done').rows.find((row) => row.runId === newRunId)).toMatchObject({
      botId: 'hello',
      identity: data.identity,
      state: 'done',
      actor: 'ada',
    });

    const status = statusReport({ stateRoot: data.stateRoot, now: data.clock });
    if (!status.ok) throw new Error(`${status.reason} ${status.detail ?? ''}`);
    expect(status.value.stale).toBe(false);
    expect(status.value.updatedAt).not.toBeNull();

    const opened = openIndex(data.stateRoot);
    if (!opened.ok) throw new Error(`${opened.reason} ${opened.detail ?? ''}`);
    try {
      const snapshot = readIndex(opened.value);
      const delivery = snapshot.deliveries.filter((entry) => entry.runId === template.identity.runId);
      expect(delivery.map((entry) => entry.state)).toEqual(['delivered']);
    } finally {
      opened.value.close();
    }

    // A read deletes nothing.
    for (const folder of runFolders) expect(existsSync(folder)).toBe(true);
  });

  it('row sources', () => {
    const describeStub: DescribeStart = () => 'stub';

    // a. An open item draws a needs_you row.
    const itemState = tempDir('bots-state-');
    const item: NeedsYouItem = {
      id: 'run-1',
      runId: 'run-1',
      botId: 'hello',
      identity: IDENTITY,
      question: 'Ship the release?',
      options: null,
      createdAt: '2026-11-25T21:12:04.000Z',
      expiresAt: '2026-11-26T21:12:04.000Z',
      evidence: [],
      prompt: 'Ship the release when the checks pass.',
      specFolder: null,
      answer: null,
      resumeRequestId: null,
    };
    const writtenItem = writeNeedsYouItem(itemState, item);
    if (!writtenItem.ok) throw new Error(`item: ${writtenItem.reason} ${writtenItem.detail ?? ''}`);
    expect(groupOf(activityOf(itemState, describeStub), 'needs_you').rows).toEqual([
      { botId: 'hello', identity: IDENTITY, state: 'needs_you', at: '2026-11-25T21:12:04.000Z', actor: null, runId: 'run-1', schedule: null },
    ]);

    // b. A completed record draws a done row.
    const runState = tempDir('bots-state-');
    const writtenRun = writeRunRecord(runState, recordFor({ botId: 'hello', runId: 'run-1', dispatchedAt: '2026-11-25T21:02:04.000Z', actor: 'ada' }));
    if (!writtenRun.ok) throw new Error(`run: ${writtenRun.reason} ${writtenRun.detail ?? ''}`);
    expect(groupOf(activityOf(runState, describeStub), 'done').rows).toEqual([
      { botId: 'hello', identity: IDENTITY, state: 'done', at: '2026-11-25T21:02:04.000Z', actor: 'ada', runId: 'run-1', schedule: null },
    ]);

    // c. A live lease draws a working row with the seed's actor.
    const liveState = tempDir('bots-state-');
    writeLease(liveState, IDENTITY, { botId: 'nightly-report', runId: 'run-live', dispatchedAt: '2026-11-25T21:13:40.000Z', ownerPid: process.pid, actor: 'ada' });
    expect(groupOf(activityOf(liveState, describeStub), 'working').rows).toEqual([
      { botId: 'nightly-report', identity: IDENTITY, state: 'working', at: '2026-11-25T21:13:40.000Z', actor: 'ada', runId: 'run-live', schedule: null },
    ]);

    // d. A lease whose owner is gone draws no row, and neither does one whose run is recorded.
    const exited = spawnSync(process.execPath, ['-e', '']);
    const deadPid = exited.pid;
    if (!Number.isSafeInteger(deadPid) || deadPid <= 0) throw new Error('the spawned process left no pid');
    const staleState = tempDir('bots-state-');
    writeLease(staleState, IDENTITY, { botId: 'stale-bot', runId: 'run-stale', dispatchedAt: '2026-11-25T21:13:40.000Z', ownerPid: deadPid, actor: 'ada' });
    writeLease(staleState, IDENTITY, { botId: 'recorded-bot', runId: 'run-recorded', dispatchedAt: '2026-11-25T21:13:40.000Z', ownerPid: process.pid, actor: 'ada' });
    const recordedRun = writeRunRecord(staleState, recordFor({ botId: 'recorded-bot', runId: 'run-recorded', dispatchedAt: '2026-11-25T21:13:40.000Z' }));
    if (!recordedRun.ok) throw new Error(`recorded run: ${recordedRun.reason} ${recordedRun.detail ?? ''}`);
    const stalePayload = activityOf(staleState, describeStub);
    expect(stalePayload.groups.find((group) => group.id === 'working')).toBeUndefined();
    expect(groupOf(stalePayload, 'done').rows.map((row) => row.runId)).toEqual(['run-recorded']);

    // e. A queued request draws a scheduled row at its enqueue time, and the same file claimed draws none.
    const queued = readJson<{ request: JsonObject; expectRow: { row: JsonObject } }>(QUEUED_REQUEST);
    const requestIdentity = String((queued.request.target as JsonObject).identity);
    const requestName = `${String(queued.request.id)}.json`;
    const inboxState = tempDir('bots-state-');
    const inbox = identityStatePaths(inboxState, requestIdentity).requests.inbox;
    mkdirSync(inbox, { recursive: true });
    writeFileSync(join(inbox, requestName), JSON.stringify(queued.request));
    expect(groupOf(activityOf(inboxState, describeStub), 'scheduled').rows).toEqual([queued.expectRow.row]);

    const claimedState = tempDir('bots-state-');
    const claimed = identityStatePaths(claimedState, requestIdentity).requests.claimed;
    mkdirSync(claimed, { recursive: true });
    writeFileSync(join(claimed, requestName), JSON.stringify(queued.request));
    expect(activityOf(claimedState, describeStub).groups).toEqual([]);

    // f. An unheld schedule draws one scheduled row and one recurring row at its next fire.
    const unheldState = tempDir('bots-state-');
    writeInstall(unheldState, IDENTITY, { botId: 'digest', agent: 'bot', schedule: { expression: '15 */6 * * *', scheduleIndex: 0 }, hold: null, operator: 'ada', fullAccess: false });
    const unheld = activityOf(unheldState, describeStub);
    expect(groupOf(unheld, 'scheduled').rows).toEqual([
      { botId: 'digest', identity: IDENTITY, state: 'scheduled', at: '2026-11-26T00:15:00.000Z', actor: 'ada', runId: null, schedule: 'stub' },
    ]);
    expect(groupOf(unheld, 'recurring').rows).toEqual([
      { botId: 'digest', identity: IDENTITY, state: 'recurring', at: '2026-11-26T00:15:00.000Z', actor: 'ada', runId: null, schedule: 'stub' },
    ]);

    // g. A held schedule draws neither.
    const heldState = tempDir('bots-state-');
    writeInstall(heldState, IDENTITY, { botId: 'digest', agent: 'bot', schedule: { expression: '15 */6 * * *', scheduleIndex: 0 }, hold: 'operator', operator: 'ada', fullAccess: false });
    expect(activityOf(heldState, describeStub).groups).toEqual([]);

    // h. The same calendar fire inside one day.
    const insideDayState = tempDir('bots-state-');
    writeInstall(insideDayState, IDENTITY, { botId: 'digest', agent: 'bot', schedule: { expression: '15 */6 * * *', scheduleIndex: 0 }, hold: null, operator: 'ada', fullAccess: false });
    const insideDay = activityOf(insideDayState, describeStub);
    expect(groupOf(insideDay, 'scheduled').rows.map((row) => row.at)).toEqual(['2026-11-26T00:15:00.000Z']);
    expect(groupOf(insideDay, 'recurring').rows.map((row) => row.at)).toEqual(['2026-11-26T00:15:00.000Z']);

    // i. A calendar fire past 32 days is still found.
    const leapState = tempDir('bots-state-');
    writeInstall(leapState, IDENTITY, { botId: 'leap', agent: 'bot', schedule: { expression: '0 0 29 2 *', scheduleIndex: 0 }, hold: null, operator: 'ada', fullAccess: false });
    expect(groupOf(activityOf(leapState, describeStub), 'scheduled').rows.map((row) => row.at)).toEqual(['2028-02-29T00:00:00.000Z']);

    // j. An interval schedule steps on from its newest scheduled run.
    const intervalRunState = tempDir('bots-state-');
    writeInstall(intervalRunState, IDENTITY, { botId: 'tick', agent: 'bot', schedule: { expression: '* * * * *', scheduleIndex: 0 }, hold: null, operator: 'ada', fullAccess: false });
    const tickRun = writeRunRecord(intervalRunState, recordFor({ botId: 'tick', runId: 'run-tick', dispatchedAt: '2026-11-25T21:13:30.000Z', source: 'schedule' }));
    if (!tickRun.ok) throw new Error(`tick run: ${tickRun.reason} ${tickRun.detail ?? ''}`);
    expect(groupOf(activityOf(intervalRunState, describeStub), 'scheduled').rows.map((row) => row.at)).toEqual(['2026-11-25T21:14:30.000Z']);

    // k. An interval schedule with no run steps on from now.
    const intervalNoneState = tempDir('bots-state-');
    writeInstall(intervalNoneState, IDENTITY, { botId: 'tick', agent: 'bot', schedule: { expression: '* * * * *', scheduleIndex: 0 }, hold: null, operator: 'ada', fullAccess: false });
    expect(groupOf(activityOf(intervalNoneState, describeStub), 'scheduled').rows.map((row) => row.at)).toEqual(['2026-11-25T21:15:04.000Z']);
  });
});
