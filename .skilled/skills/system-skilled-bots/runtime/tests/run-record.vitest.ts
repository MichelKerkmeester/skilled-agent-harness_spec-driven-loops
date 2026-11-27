import { readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';

import { afterEach, describe, expect, it } from 'vitest';

import { defaultRepoConfig } from '../lib/repo-config.js';
import {
  AWAITING_DECISION,
  AWAITING_DECISION_STOP_REASON,
  readRunRecord,
  RESULT_EVENT_UNRECORDED,
  validateRunRecord,
  writeRunRecord,
} from '../lib/run-record.js';
import { identityStatePaths, resolveRunFolder, userStateRoot } from '../lib/state-root.js';
import { cleanupTemp, tempDir, tempSkilledTree } from './support.js';

import type { RunRecord } from '../lib/run-record.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';

/** A record with every field group filled and an unknown cost. */
function fullRecord(runFolder: string, runId = 'r1'): RunRecord {
  return {
    schemaVersion: 1,
    identity: {
      repository: IDENTITY,
      repositoryPath: '/work/acme/tool',
      botId: 'weekday-deep-review',
      runId,
      definitionDigest: 'sha256:abc123',
    },
    request: { requestId: 'req-1', leaseNonce: 'nonce-1', resultEventId: 'evt-1', firedSlot: '2026-11-23T09:00:00Z' },
    dispatch: {
      source: 'launchd',
      scheduledAt: '2026-11-23T09:00:00Z',
      dispatchedAt: '2026-11-23T09:00:04Z',
      latenessSeconds: 4,
      latenessClass: 'on-time',
      skippedSlots: { count: 1, slots: ['2026-11-22T09:00:00Z'] },
    },
    budget: {
      declared: { maxIterations: 6, maxDurationMinutes: 120, timeoutSeconds: 900 },
      measured: { iterations: 3, elapsedMinutes: 12.5, costUsd: null, costSource: null },
    },
    posture: { isolation: 'worktree', sandbox: 'workspace-write', executorKind: 'cli-opencode', model: 'deepseek-v4-flash' },
    exit: { reason: 'converged', class: null, needsYouItemId: null },
    evidence: {
      runFolder,
      ledgerDir: `${runFolder}/ledger`,
      receiptDir: `${runFolder}/receipts`,
      observabilityStream: `${runFolder}/events.jsonl`,
      worktreePath: '/work/acme/tool-wt/r1',
      branch: 'bots/r1',
    },
    delivery: [
      { channel: 'desktop', target: 'local', state: 'attempted', evidence: null },
      { channel: 'slack', target: '#ops', state: 'delivered', evidence: 'ts-1' },
      { channel: 'email', target: 'ops@example.invalid', state: 'unknown', evidence: null },
    ],
  };
}

function setup() {
  const stateRoot = userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
  const tree = tempSkilledTree(true);
  const folder = resolveRunFolder({ skilledTree: tree, identity: IDENTITY, runId: 'r1' });
  if (!folder.ok) throw new Error(folder.reason);
  return { stateRoot, runFolder: folder.value };
}

describe('run record', () => {
  it('round-trips every field group and keeps an unknown cost as null', () => {
    const { stateRoot, runFolder } = setup();
    const record = fullRecord(runFolder);
    const written = writeRunRecord(stateRoot, record);
    if (!written.ok) throw new Error(written.reason);

    expect(written.value).toBe(`${identityStatePaths(stateRoot, IDENTITY).records}/r1.json`);
    expect(written.value.startsWith(stateRoot)).toBe(true);
    expect(written.value.startsWith(runFolder)).toBe(false);

    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    // The written record named neither actor, so the read carries both as null.
    expect(read).toEqual({ ok: true, value: { record: { ...record, actor: null, answeredBy: null, until: null }, runFolder: { path: runFolder, present: true } } });
    expect(JSON.parse(readFileSync(written.value, 'utf8')).budget.measured.costUsd).toBeNull();
  });

  it('keeps one delivery entry per target, in order', () => {
    const { stateRoot, runFolder } = setup();
    writeRunRecord(stateRoot, fullRecord(runFolder));
    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.record.delivery.map((entry) => entry.target)).toEqual(['local', '#ops', 'ops@example.invalid']);
  });

  it('reads a record whole and reports a vanished run folder as missing', () => {
    const { stateRoot, runFolder } = setup();
    writeRunRecord(stateRoot, fullRecord(runFolder));
    rmSync(runFolder, { recursive: true });
    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    if (!read.ok) throw new Error(read.reason);
    expect(read.value.runFolder).toEqual({ path: runFolder, present: false });
    expect(read.value.record).toEqual({ ...fullRecord(runFolder), actor: null, answeredBy: null, until: null });
  });

  it('refuses a record that drops a field group or turns cost into a string', () => {
    const { stateRoot, runFolder } = setup();
    const { delivery: _dropped, ...noDelivery } = fullRecord(runFolder);
    expect(writeRunRecord(stateRoot, noDelivery as RunRecord)).toMatchObject({ reason: 'record-field-missing', detail: 'delivery' });
    const badCost = fullRecord(runFolder);
    (badCost.budget.measured as { costUsd: unknown }).costUsd = '0';
    expect(writeRunRecord(stateRoot, badCost)).toMatchObject({ reason: 'record-field-invalid' });
    const badState = fullRecord(runFolder);
    (badState.delivery[0] as { state: string }).state = 'sent';
    expect(writeRunRecord(stateRoot, badState)).toMatchObject({ reason: 'record-field-invalid' });
  });

  it('refuses an unsafe run id or identity by name instead of throwing', () => {
    const { stateRoot, runFolder } = setup();
    const badId = fullRecord(runFolder, '../x');
    expect(writeRunRecord(stateRoot, badId)).toEqual({ ok: false, reason: 'run-id-invalid' });
    const badIdentity = fullRecord(runFolder);
    badIdentity.identity.repository = '..';
    expect(writeRunRecord(stateRoot, badIdentity)).toEqual({ ok: false, reason: 'identity-invalid' });
  });

  it('reports a missing record by name', () => {
    expect(readRunRecord(tempDir(), IDENTITY, 'nope')).toEqual({ ok: false, reason: 'record-missing' });
  });

  it('reads a record written before the actor as null', () => {
    const { stateRoot, runFolder } = setup();
    // A record written before records named anyone carries neither key.
    expect(writeRunRecord(stateRoot, fullRecord(runFolder)).ok).toBe(true);
    const legacy = readRunRecord(stateRoot, IDENTITY, 'r1');
    if (!legacy.ok) throw new Error(legacy.reason);
    expect({ actor: legacy.value.record.actor, answeredBy: legacy.value.record.answeredBy }).toEqual({ actor: null, answeredBy: null });

    const notAString = { ...fullRecord(runFolder), actor: 7 } as unknown as RunRecord;
    expect(writeRunRecord(stateRoot, notAString)).toEqual({ ok: false, reason: 'record-field-invalid', detail: 'actor' });

    const named = { ...fullRecord(runFolder), actor: 'ada', answeredBy: 'bob' };
    expect(writeRunRecord(stateRoot, named).ok).toBe(true);
    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    if (!read.ok) throw new Error(read.reason);
    expect({ actor: read.value.record.actor, answeredBy: read.value.record.answeredBy }).toEqual({ actor: 'ada', answeredBy: 'bob' });
  });

  it('carries the until observation', () => {
    const { stateRoot, runFolder } = setup();
    for (const met of [true, false]) {
      expect(writeRunRecord(stateRoot, { ...fullRecord(runFolder), until: { met } }).ok).toBe(true);
      const read = readRunRecord(stateRoot, IDENTITY, 'r1');
      if (!read.ok) throw new Error(read.reason);
      expect(read.value.record.until).toEqual({ met });
    }

    // A run whose routine carries no until check writes no key and reads it as null.
    expect(writeRunRecord(stateRoot, fullRecord(runFolder)).ok).toBe(true);
    const silent = readRunRecord(stateRoot, IDENTITY, 'r1');
    if (!silent.ok) throw new Error(silent.reason);
    expect(silent.value.record.until).toBeNull();

    for (const until of [{ met: 'yes' }, { met: true, extra: 1 }, 'met']) {
      expect(validateRunRecord({ ...fullRecord(runFolder), until })).toEqual({ ok: false, reason: 'record-field-invalid', detail: 'until' });
    }
  });
});

describe('awaiting-decision exit', () => {
  it('accepts the parked exit with class operator and an item id', () => {
    const { stateRoot, runFolder } = setup();
    const record = fullRecord(runFolder);
    record.exit = { reason: AWAITING_DECISION, class: 'operator', needsYouItemId: 'r1' };
    expect(writeRunRecord(stateRoot, record).ok).toBe(true);
    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    expect(read.ok && read.value.record.exit).toEqual(record.exit);
  });

  it('rejects a parked exit with no item id, or another class', () => {
    const { stateRoot, runFolder } = setup();
    const noItem = fullRecord(runFolder);
    noItem.exit = { reason: AWAITING_DECISION, class: 'operator', needsYouItemId: null };
    expect(writeRunRecord(stateRoot, noItem)).toEqual({ ok: false, reason: 'awaiting-decision-without-item' });
    const wrongClass = fullRecord(runFolder);
    wrongClass.exit = { reason: AWAITING_DECISION, class: 'hub', needsYouItemId: 'r1' };
    expect(writeRunRecord(stateRoot, wrongClass)).toEqual({ ok: false, reason: 'awaiting-decision-class-invalid' });
    const strayItem = fullRecord(runFolder);
    strayItem.exit = { reason: 'converged', class: null, needsYouItemId: 'r1' };
    expect(writeRunRecord(stateRoot, strayItem)).toEqual({ ok: false, reason: 'needs-you-item-without-awaiting-decision' });
    // A parked run that then failed to record its result keeps naming the item that still holds the bot.
    const parkedThenFailed = { ...strayItem, exit: { reason: RESULT_EVENT_UNRECORDED, class: 'hub' as const, needsYouItemId: 'r1' } };
    expect(writeRunRecord(stateRoot, parkedThenFailed).ok).toBe(true);
  });

  it('maps to blockedStop in the deep-loop stop-reason taxonomy', () => {
    const taxonomy = createRequire(import.meta.url)(
      '../../../system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs',
    ) as { STOP_REASONS: Record<string, string> };
    expect(AWAITING_DECISION_STOP_REASON).toBe('blockedStop');
    expect(Object.values(taxonomy.STOP_REASONS)).toContain(AWAITING_DECISION_STOP_REASON);
  });

  it('carries a refusal cause and a resumed item id, and rejects a malformed refusal', () => {
    const { stateRoot, runFolder } = setup();
    const refused = {
      ...fullRecord(runFolder),
      request: { ...fullRecord(runFolder).request, resumedItemId: 'parked-1' },
      exit: { reason: 'blockedStop', class: null, needsYouItemId: null, refusal: { cause: 'awaiting-decision-hold', itemId: 'parked-1', detail: null } },
    };
    expect(writeRunRecord(stateRoot, refused).ok).toBe(true);
    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    expect(read.ok && read.value.record.exit.refusal).toEqual({ cause: 'awaiting-decision-hold', itemId: 'parked-1', detail: null });
    const broken = { ...refused, exit: { ...refused.exit, refusal: { cause: '', itemId: null, detail: null } } };
    expect(writeRunRecord(stateRoot, broken)).toEqual({ ok: false, reason: 'record-field-invalid', detail: 'exit.refusal' });
  });
});

describe('worktree evidence', () => {
  it('round-trips a kept tree with its reason, and refuses a kept tree with none', () => {
    const { stateRoot, runFolder } = setup();
    const worktree = {
      postureSource: 'definition' as const,
      baseCommit: 'abc123',
      links: ['/work/acme/tool-wt/r1/node_modules'],
      createdDirs: [],
      setupMs: 120,
      disposition: 'kept' as const,
      keptReason: 'dirty',
      detail: 'notes.txt',
    };
    const kept = { ...fullRecord(runFolder), evidence: { ...fullRecord(runFolder).evidence, worktree } };
    expect(writeRunRecord(stateRoot, kept).ok).toBe(true);
    const read = readRunRecord(stateRoot, IDENTITY, 'r1');
    expect(read.ok && read.value.record.evidence.worktree).toEqual(worktree);
    const silent = { ...kept, evidence: { ...kept.evidence, worktree: { ...worktree, keptReason: null } } };
    expect(writeRunRecord(stateRoot, silent)).toEqual({ ok: false, reason: 'worktree-kept-without-reason' });
  });
});
