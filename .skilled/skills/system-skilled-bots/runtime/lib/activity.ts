// ───────────────────────────────────────────────────────────────────
// MODULE: Bots Activity
// ───────────────────────────────────────────────────────────────────
//
// The seven groups, their titles and their order follow OpenBot's
// app/src/lib/bot-lifecycle/activity-groups.ts (MIT, see
// THIRD_PARTY_NOTICES.md beside the runtime). A reader who knows that screen
// finds the same groups here in the same order, so the two reads can be
// compared without a translation table.
//
// This module is pure. It reads no file and prints nothing, so the text form
// and the JSON form are built from one payload and cannot disagree about what
// a group holds or where a row belongs.
//
// status.ts gathers the sources: the index snapshot, the live lease side
// files, the queued requests and the next fire of each installed schedule.
// Nothing here opens a path or asks the clock, so a caller decides what "now"
// means and a test can pin it.

import type { IndexSnapshot, RunSummary } from './status-index.js';

// ───────────────────────────────────────────────────────────────────
// 1. GROUPS
// ───────────────────────────────────────────────────────────────────

/** The seven groups a reader sees, in the order they are shown. */
export const ACTIVITY_GROUPS = [
  { id: 'needs_you', title: 'Needs you' },
  { id: 'working', title: 'Working' },
  { id: 'scheduled', title: 'Scheduled' },
  { id: 'done', title: 'Done' },
  { id: 'stopped', title: 'Stopped' },
  { id: 'failed', title: 'Failed' },
  { id: 'recurring', title: 'Recurring' },
] as const;

/** One group id, taken from the group list so the two cannot drift apart. */
export type ActivityGroupId = (typeof ACTIVITY_GROUPS)[number]['id'];

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

/** One row of one group. Every row carries the same fields whatever its group. */
export interface ActivityRow {
  botId: string;
  identity: string;
  state: ActivityGroupId;
  at: string;
  actor: string | null;
  runId: string | null;
  schedule: string | null;
}

/** One group and the rows it holds, in the order the group list gives. */
export interface ActivityGroup {
  id: ActivityGroupId;
  title: string;
  rows: ActivityRow[];
}

/** The whole read. The version lets a reader refuse a payload it does not know. */
export interface ActivityPayload {
  version: 1;
  groups: ActivityGroup[];
}

/** The start a schedule row was installed from, as the describe seam takes it. */
export interface CronStart {
  kind: 'cron';
  expression: string;
}

/** Turns a cron start into the words a reader sees, or null when it cannot. */
export type DescribeStart = (start: CronStart) => string | null;

/** A run in flight, read from a held lease side file. */
export interface LiveRun {
  identity: string;
  botId: string;
  runId: string;
  dispatchedAt: string;
  actor: string | null;
}

/** A run request queued and not yet claimed. */
export interface QueuedRequest {
  identity: string;
  botId: string;
  enqueuedAt: string;
}

/** The next fire of one installed, unheld cron schedule. */
export interface ScheduleFire {
  identity: string;
  botId: string;
  at: string;
  actor: string | null;
  expression: string;
}

/** Everything the read needs, already gathered. Nothing here is read from disk. */
export interface ActivitySources {
  snapshot: IndexSnapshot;
  live: LiveRun[];
  queued: QueuedRequest[];
  fires: ScheduleFire[];
  now: Date;
  describe?: DescribeStart;
}

// ───────────────────────────────────────────────────────────────────
// 3. BUILD
// ───────────────────────────────────────────────────────────────────

/** One run row of the snapshot, named through the snapshot type so no second import is needed. */
type SnapshotRunRow = IndexSnapshot['runs'][number];

/** A run summary as the index stores it. A summary written before the actor existed has no key. */
type SummaryWithActor = RunSummary & { actor?: string | null };

/** The summary a run row carries, or null when its JSON does not parse. */
function parseSummary(row: SnapshotRunRow): SummaryWithActor | null {
  try {
    return JSON.parse(row.summary) as SummaryWithActor;
  } catch {
    return null;
  }
}

/** The actor a summary names, or null when it names none. */
function summaryActor(summary: SummaryWithActor): string | null {
  return typeof summary.actor === 'string' ? summary.actor : null;
}

/** The key an item and a run row share, so an item can find the run that parked on it. */
function runKey(identityKey: string, runId: string): string {
  return `${identityKey}\u0000${runId}`;
}

/**
 * The group a run row lands in, or null when it draws no row at all. A parked
 * run is drawn as its open item, so it is left out here. A refusal with no
 * class is a stop rather than a fault, and a clean run records no class.
 */
function runGroup(summary: SummaryWithActor): ActivityGroupId | null {
  if (summary.exitReason === 'awaiting-decision') return null;
  const refusal = summary.refusalCause ?? null;
  const exitClass = summary.exitClass ?? null;
  if (refusal !== null) return exitClass === null ? 'stopped' : 'failed';
  return exitClass === null ? 'done' : 'failed';
}

/** Compare two strings by code unit, so the order never depends on the locale. */
function compareText(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/** Compare two run ids, with a null one last. */
function compareRunId(left: string | null, right: string | null): number {
  if (left === null) return right === null ? 0 : 1;
  if (right === null) return -1;
  return compareText(left, right);
}

/** The order inside one group: `at` first, then identity, botId and runId. */
function compareRows(newestFirst: boolean): (left: ActivityRow, right: ActivityRow) => number {
  return (left, right) => {
    const leftAt = Date.parse(left.at);
    const rightAt = Date.parse(right.at);
    if (leftAt !== rightAt) return newestFirst ? rightAt - leftAt : leftAt - rightAt;
    const byIdentity = compareText(left.identity, right.identity);
    if (byIdentity !== 0) return byIdentity;
    const byBotId = compareText(left.botId, right.botId);
    if (byBotId !== 0) return byBotId;
    return compareRunId(left.runId, right.runId);
  };
}

/**
 * Group every row the sources hold. A retired identity is left out, a parked
 * run draws no row of its own and a group with no rows is left out too, so the
 * payload names only what a reader can act on.
 */
export function buildActivity(sources: ActivitySources): ActivityPayload {
  const retired = new Set(sources.snapshot.retired.map((row) => row.identityKey));
  const describe = sources.describe;
  const rows: ActivityRow[] = [];
  const actorByRun = new Map<string, string | null>();

  for (const run of sources.snapshot.runs) {
    if (retired.has(run.identityKey)) continue;
    const summary = parseSummary(run);
    if (summary === null) continue;
    const actor = summaryActor(summary);
    actorByRun.set(runKey(run.identityKey, run.runId), actor);
    const state = runGroup(summary);
    if (state === null) continue;
    rows.push({ botId: run.botId, identity: run.identity, state, at: summary.dispatchedAt, actor, runId: summary.runId, schedule: null });
  }

  for (const item of sources.snapshot.items) {
    if (retired.has(item.identityKey)) continue;
    if (item.answeredAt !== null) continue;
    if (!(sources.now.getTime() < Date.parse(item.expiresAt))) continue;
    rows.push({
      botId: item.botId,
      identity: item.identity,
      state: 'needs_you',
      at: item.createdAt,
      actor: actorByRun.get(runKey(item.identityKey, item.runId)) ?? null,
      runId: item.runId,
      schedule: null,
    });
  }

  for (const live of sources.live) {
    rows.push({ botId: live.botId, identity: live.identity, state: 'working', at: live.dispatchedAt, actor: live.actor, runId: live.runId, schedule: null });
  }

  for (const queued of sources.queued) {
    rows.push({ botId: queued.botId, identity: queued.identity, state: 'scheduled', at: queued.enqueuedAt, actor: null, runId: null, schedule: null });
  }

  for (const fire of sources.fires) {
    const schedule = describe === undefined ? null : (describe({ kind: 'cron', expression: fire.expression }) ?? null);
    rows.push({ botId: fire.botId, identity: fire.identity, state: 'scheduled', at: fire.at, actor: fire.actor, runId: null, schedule });
    rows.push({ botId: fire.botId, identity: fire.identity, state: 'recurring', at: fire.at, actor: fire.actor, runId: null, schedule });
  }

  const groups: ActivityGroup[] = [];
  for (const group of ACTIVITY_GROUPS) {
    const newestFirst = group.id !== 'scheduled' && group.id !== 'recurring';
    const held = rows.filter((row) => row.state === group.id).sort(compareRows(newestFirst));
    if (held.length > 0) groups.push({ id: group.id, title: group.title, rows: held });
  }

  return { version: 1, groups };
}

// ───────────────────────────────────────────────────────────────────
// 4. TEXT
// ───────────────────────────────────────────────────────────────────

/**
 * The payload as terminal lines: one heading per group, then one tab-separated
 * line per row. A null actor or run id prints `-`, and the schedule field is
 * printed only when it is set. An empty payload gives no lines, so the caller
 * prints its own empty message.
 */
export function formatActivity(payload: ActivityPayload): string[] {
  const lines: string[] = [];
  for (const group of payload.groups) {
    lines.push(`${group.id}\t${group.title}`);
    for (const row of group.rows) {
      const parts = [row.botId, row.identity, row.at, `actor ${row.actor ?? '-'}`, `run ${row.runId ?? '-'}`];
      if (row.schedule !== null) parts.push(`schedule ${row.schedule}`);
      lines.push(`\t${parts.join('\t')}`);
    }
  }
  return lines;
}
