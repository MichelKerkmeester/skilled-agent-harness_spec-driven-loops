// ───────────────────────────────────────────────────────────────────
// TEST: Restart Facts Reader
// ───────────────────────────────────────────────────────────────────
//
// The headline assertion is the refusal: an absent effect ledger must
// reject before any read method is called, so a system that never
// recorded effects can never be mistaken for one that recorded none.

import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  RestartObservationError,
  RestartObservationErrorCodes,
  observeRestartFacts,
} from '../../lib/restart-observation/restart-facts-reader.js';
import type {
  LedgerReadPort,
  LeasePeekPort,
  ObserveRestartFactsOptions,
} from '../../lib/restart-observation/restart-facts-reader.js';

// Build a verified-event-shaped object the way the real ledger reader
// returns it: { event: { effective: { envelope: { event_type, payload } } } }.
// Only the fields the reader narrows on are needed; the frame and stored
// evidence are left out because the reader does not touch them.
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

interface CountingLedgerPort extends LedgerReadPort {
  readonly headCalls: number;
  readonly readCalls: number;
}

function countingLedgerPort(
  headSequence: number,
  events: readonly unknown[],
): CountingLedgerPort {
  const counters = { headCalls: 0, readCalls: 0 };
  return {
    get headCalls(): number {
      return counters.headCalls;
    },
    get readCalls(): number {
      return counters.readCalls;
    },
    async getVerifiedHead() {
      counters.headCalls += 1;
      return { sequence: headSequence };
    },
    async readVerifiedEvents() {
      counters.readCalls += 1;
      return events;
    },
  };
}

function stubPeek(
  result: { readonly fenceToken: number; readonly expiresAt: string } | null,
): LeasePeekPort & { readonly peekCalls: number } {
  const counters = { peekCalls: 0 };
  return {
    get peekCalls(): number {
      return counters.peekCalls;
    },
    peekCurrentLease() {
      counters.peekCalls += 1;
      return result;
    },
  };
}

function baseOptions(
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

const tempRoots: string[] = [];

function makeRunDirectory(): string {
  const dir = mkdtempSync(join(tmpdir(), 'restart-facts-reader-'));
  tempRoots.push(dir);
  return dir;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop() as string;
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('observeRestartFacts', () => {
  describe('refusal before reading', () => {
    it('rejects with EFFECT_LEDGER_ABSENT when the effect ledger directory is missing and calls no read method', async () => {
      const runDirectory = makeRunDirectory();
      // Mode ledger directory exists; effect ledger directory does not.
      mkdirSync(join(runDirectory, 'mode-ledger'));

      const modeLedger = countingLedgerPort(7, []);
      const effectLedger = countingLedgerPort(0, []);

      await expect(
        observeRestartFacts(
          baseOptions(runDirectory, { modeLedger, effectLedger }),
        ),
      ).rejects.toMatchObject({
        reasonCode: RestartObservationErrorCodes.EFFECT_LEDGER_ABSENT,
      });

      // The refusal must happen before any read method runs, so an absent
      // producer can never be mistaken for an empty one.
      expect(modeLedger.headCalls).toBe(0);
      expect(modeLedger.readCalls).toBe(0);
      expect(effectLedger.headCalls).toBe(0);
      expect(effectLedger.readCalls).toBe(0);
    });

    it('an absent effect ledger must not produce empty facts (rejects rather than resolving to pendingEffects: [])', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'mode-ledger'));
      // No effect-ledger directory.

      const modeLedger = countingLedgerPort(7, []);
      const effectLedger = countingLedgerPort(0, []);

      const result = observeRestartFacts(
        baseOptions(runDirectory, { modeLedger, effectLedger }),
      );

      // The defining assertion: the call rejects rather than resolving to
      // an empty-facts object (pendingEffects: []) that would feed the
      // derivation a vacuous pass.
      await expect(result).rejects.toBeInstanceOf(RestartObservationError);
      await expect(result).rejects.toMatchObject({
        reasonCode: RestartObservationErrorCodes.EFFECT_LEDGER_ABSENT,
      });
    });

    it('rejects with MODE_LEDGER_ABSENT when the mode ledger directory is missing (effect ledger present)', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'effect-ledger'));
      // No mode-ledger directory.

      const modeLedger = countingLedgerPort(7, []);
      const effectLedger = countingLedgerPort(0, []);

      await expect(
        observeRestartFacts(
          baseOptions(runDirectory, { modeLedger, effectLedger }),
        ),
      ).rejects.toMatchObject({
        reasonCode: RestartObservationErrorCodes.MODE_LEDGER_ABSENT,
      });

      expect(modeLedger.headCalls).toBe(0);
      expect(effectLedger.readCalls).toBe(0);
    });
  });

  describe('happy path', () => {
    it('effects with matching receipts produce empty pendingEffects; an effect without a receipt appears in pendingEffects', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'mode-ledger'));
      mkdirSync(join(runDirectory, 'effect-ledger'));

      const modeLedger = countingLedgerPort(7, []);
      const effectLedger = countingLedgerPort(0, [
        effectIntentEvent('effect-a'),
        effectIntentEvent('effect-b'),
        effectConfirmationEvent('effect-a'),
        // effect-b has no confirmation -> pending.
      ]);

      const facts = await observeRestartFacts(
        baseOptions(runDirectory, { modeLedger, effectLedger }),
      );

      expect(facts.stopSequence).toBe(7);
      expect(facts.pendingEffects).toEqual(['effect-b']);
      expect(facts.receipts).toEqual([{ effectId: 'effect-a' }]);
      expect(facts.continuityId).toBe('lineage-alpha');
    });

    it('all effects confirmed yields empty pendingEffects', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'mode-ledger'));
      mkdirSync(join(runDirectory, 'effect-ledger'));

      const modeLedger = countingLedgerPort(3, []);
      const effectLedger = countingLedgerPort(0, [
        effectIntentEvent('effect-a'),
        effectConfirmationEvent('effect-a'),
      ]);

      const facts = await observeRestartFacts(
        baseOptions(runDirectory, { modeLedger, effectLedger }),
      );

      expect(facts.pendingEffects).toEqual([]);
      expect(facts.receipts).toEqual([{ effectId: 'effect-a' }]);
    });
  });

  describe('leases', () => {
    it('a lease that peeks null contributes no entry; a lease that peeks a value contributes { state: "active", fencingToken }', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'mode-ledger'));
      mkdirSync(join(runDirectory, 'effect-ledger'));

      const modeLedger = countingLedgerPort(1, []);
      const effectLedger = countingLedgerPort(0, []);

      const heldLease = stubPeek({
        fenceToken: 9,
        expiresAt: '2026-08-21T00:00:00.000Z',
      });
      const releasedLease = stubPeek(null);

      const facts = await observeRestartFacts(
        baseOptions(runDirectory, {
          modeLedger,
          effectLedger,
          leases: [
            { resource: 'resource-held', peek: heldLease },
            { resource: 'resource-released', peek: releasedLease },
          ],
        }),
      );

      expect(facts.leases).toEqual([
        { state: 'active', fencingToken: 9 },
      ]);
      expect(heldLease.peekCalls).toBe(1);
      expect(releasedLease.peekCalls).toBe(1);
    });

    it('an empty leases list yields no lease entries and does not throw', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'mode-ledger'));
      mkdirSync(join(runDirectory, 'effect-ledger'));

      const modeLedger = countingLedgerPort(0, []);
      const effectLedger = countingLedgerPort(0, []);

      const facts = await observeRestartFacts(
        baseOptions(runDirectory, { modeLedger, effectLedger, leases: [] }),
      );

      expect(facts.leases).toEqual([]);
    });
  });

  describe('return shape', () => {
    it('returns an object with exactly the five RestartFacts keys', async () => {
      const runDirectory = makeRunDirectory();
      mkdirSync(join(runDirectory, 'mode-ledger'));
      mkdirSync(join(runDirectory, 'effect-ledger'));

      const modeLedger = countingLedgerPort(7, []);
      const effectLedger = countingLedgerPort(0, [
        effectIntentEvent('effect-a'),
        effectConfirmationEvent('effect-a'),
      ]);

      const facts = await observeRestartFacts(
        baseOptions(runDirectory, {
          modeLedger,
          effectLedger,
          leases: [
            {
              resource: 'r',
              peek: stubPeek({
                fenceToken: 4,
                expiresAt: '2026-08-21T00:00:00.000Z',
              }),
            },
          ],
          continuityId: 'lineage-beta',
        }),
      );

      expect(Object.keys(facts).sort()).toEqual(
        ['continuityId', 'leases', 'pendingEffects', 'receipts', 'stopSequence'],
      );
    });
  });
});
