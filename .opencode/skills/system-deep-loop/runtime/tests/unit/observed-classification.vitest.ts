// ───────────────────────────────────────────────────────────────────
// TEST: Observed Classification Manifest
// ───────────────────────────────────────────────────────────────────
//
// The headline assertion is that a manifest must not be produced from
// unobservable state: when the effect ledger directory is absent the
// composition rejects with the reader's refusal, and the manifest builder
// is never reached.

import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  RestartObservationError,
  RestartObservationErrorCodes,
} from '../../lib/restart-observation/restart-facts-reader.js';
import type {
  LedgerReadPort,
  ObserveRestartFactsOptions,
} from '../../lib/restart-observation/restart-facts-reader.js';
import { buildObservedClassificationManifest } from '../../lib/restart-observation/observed-classification.js';

import type { StateBackendCensus } from '../../lib/inflight-state-classification/index.js';

// Verified-event shape the reader narrows on: only event_type and
// payload.effect_id are read, so the frame and stored evidence are left out.
function effectIntentEvent(effectId: string): unknown {
  return {
    event: {
      effective: {
        envelope: {
          event_type: 'deep-loop.effect.intent-recorded',
          payload: { effect_id: effectId },
        },
      },
    },
  };
}

function effectConfirmationEvent(effectId: string): unknown {
  return {
    event: {
      effective: {
        envelope: {
          event_type: 'deep-loop.effect.confirmed',
          payload: { effect_id: effectId },
        },
      },
    },
  };
}

function countingLedgerPort(
  headSequence: number,
  events: readonly unknown[],
): LedgerReadPort & { readonly readCalls: number } {
  const counters = { readCalls: 0 };
  return {
    get readCalls(): number {
      return counters.readCalls;
    },
    async getVerifiedHead() {
      return { sequence: headSequence };
    },
    async readVerifiedEvents() {
      counters.readCalls += 1;
      return events;
    },
  };
}

function baseObservation(
  runDirectory: string,
  overrides: Partial<ObserveRestartFactsOptions> & {
    readonly modeLedger: LedgerReadPort;
    readonly effectLedger: LedgerReadPort;
  },
): ObserveRestartFactsOptions {
  return {
    runDirectory,
    modeLedgerId: 'mode-ledger',
    effectLedgerId: 'effect-ledger',
    leases: [],
    continuityId: 'lineage-alpha',
    ...overrides,
  };
}

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
);
const CENSUS_BYTES = readFileSync(CENSUS_PATH);
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;

const CLASSIFIED_AT = '2026-08-20T09:30:00Z';
const CLASSIFICATION_ID = 'observed-classification-fixture';
const CLASSIFIER_BUILD_ID = 'classifier-build-fixture';

const tempRoots: string[] = [];

function makeRunDirectory(): string {
  const dir = mkdtempSync(join(tmpdir(), 'observed-classification-'));
  tempRoots.push(dir);
  return dir;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop() as string;
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('buildObservedClassificationManifest', () => {
  it('a manifest must not be produced from unobservable state: an absent effect ledger rejects with EFFECT_LEDGER_ABSENT before the manifest builder runs', async () => {
    const runDirectory = makeRunDirectory();
    mkdirSync(join(runDirectory, 'mode-ledger'));
    // No effect-ledger directory.

    const modeLedger = countingLedgerPort(7, []);
    const effectLedger = countingLedgerPort(0, [
      effectIntentEvent('effect-a'),
      effectConfirmationEvent('effect-a'),
    ]);

    // Census bytes are deliberately empty: if the manifest builder were
    // reached it would throw a classification error on the empty bytes.
    // Asserting the reader's refusal instead proves the builder was not.
    const result = buildObservedClassificationManifest({
      observation: baseObservation(runDirectory, { modeLedger, effectLedger }),
      rows: [{ rowId: CENSUS.rows[0].id, lifecycle: CENSUS.rows[0].lifecycle, mutability: CENSUS.rows[0].mutability }],
      classificationId: CLASSIFICATION_ID,
      classifiedAt: CLASSIFIED_AT,
      classifierBuildId: CLASSIFIER_BUILD_ID,
      censusBytes: new Uint8Array(0),
    });

    await expect(result).rejects.toBeInstanceOf(RestartObservationError);
    await expect(result).rejects.toMatchObject({
      reasonCode: RestartObservationErrorCodes.EFFECT_LEDGER_ABSENT,
    });
  });

  it('happy path: with both ledger directories present and effects with receipts, a manifest is returned with one evidence entry per requested row', async () => {
    const runDirectory = makeRunDirectory();
    mkdirSync(join(runDirectory, 'mode-ledger'));
    mkdirSync(join(runDirectory, 'effect-ledger'));

    const modeLedger = countingLedgerPort(7, []);
    const effectLedger = countingLedgerPort(0, [
      effectIntentEvent('effect-a'),
      effectConfirmationEvent('effect-a'),
    ]);

    const requested = CENSUS.rows.slice(0, 2).map((row) => ({
      rowId: row.id,
      lifecycle: row.lifecycle,
      mutability: row.mutability,
    }));
    const requestedIds = requested.map((row) => row.rowId);

    const built = await buildObservedClassificationManifest({
      observation: baseObservation(runDirectory, { modeLedger, effectLedger }),
      rows: requested,
      classificationId: CLASSIFICATION_ID,
      classifiedAt: CLASSIFIED_AT,
      classifierBuildId: CLASSIFIER_BUILD_ID,
      censusBytes: CENSUS_BYTES,
    });

    expect(built.manifest.rows).toHaveLength(CENSUS.rows.length);
    const presentForRequested = built.manifest.rows.filter(
      (row) => requestedIds.includes(row.rowId) && row.evidence.isPresent === true,
    );
    expect(presentForRequested).toHaveLength(requested.length);
  });

  it('restart facts are observed once, not per row: three rows share a single readVerifiedEvents call', async () => {
    const runDirectory = makeRunDirectory();
    mkdirSync(join(runDirectory, 'mode-ledger'));
    mkdirSync(join(runDirectory, 'effect-ledger'));

    const modeLedger = countingLedgerPort(7, []);
    const effectLedger = countingLedgerPort(0, [
      effectIntentEvent('effect-a'),
      effectConfirmationEvent('effect-a'),
    ]);

    const requested = CENSUS.rows.slice(0, 3).map((row) => ({
      rowId: row.id,
      lifecycle: row.lifecycle,
      mutability: row.mutability,
    }));

    await buildObservedClassificationManifest({
      observation: baseObservation(runDirectory, { modeLedger, effectLedger }),
      rows: requested,
      classificationId: CLASSIFICATION_ID,
      classifiedAt: CLASSIFIED_AT,
      classifierBuildId: CLASSIFIER_BUILD_ID,
      censusBytes: CENSUS_BYTES,
    });

    // A per-row observation would call readVerifiedEvents once per row (3).
    // One call means the shared facts were observed once for the whole run.
    expect(effectLedger.readCalls).toBe(1);
  });

  it('row metadata reaches the evidence: two rows with different lifecycle values produce different lifecyclePoint values', async () => {
    const runDirectory = makeRunDirectory();
    mkdirSync(join(runDirectory, 'mode-ledger'));
    mkdirSync(join(runDirectory, 'effect-ledger'));

    const modeLedger = countingLedgerPort(7, []);
    const effectLedger = countingLedgerPort(0, [
      effectIntentEvent('effect-a'),
      effectConfirmationEvent('effect-a'),
    ]);

    const distinct = CENSUS.rows
      .filter((row, _index, all) => all.some((other) => other.lifecycle !== row.lifecycle))
      .filter((row, index, all) => all.findIndex((r) => r.lifecycle === row.lifecycle) === index)
      .slice(0, 2)
      .map((row) => ({
        rowId: row.id,
        lifecycle: row.lifecycle,
        mutability: row.mutability,
      }));

    expect(distinct).toHaveLength(2);
    expect(distinct[0].lifecycle).not.toBe(distinct[1].lifecycle);

    const built = await buildObservedClassificationManifest({
      observation: baseObservation(runDirectory, { modeLedger, effectLedger }),
      rows: distinct,
      classificationId: CLASSIFICATION_ID,
      classifiedAt: CLASSIFIED_AT,
      classifierBuildId: CLASSIFIER_BUILD_ID,
      censusBytes: CENSUS_BYTES,
    });

    const points = distinct.map((row) => {
      const manifestRow = built.manifest.rows.find((entry) => entry.rowId === row.rowId);
      expect(manifestRow).toBeDefined();
      return manifestRow?.evidence.lifecyclePoint;
    });
    expect(points[0]).not.toBe(points[1]);
  });
});
