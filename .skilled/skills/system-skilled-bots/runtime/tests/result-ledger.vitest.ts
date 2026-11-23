import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { openResultLedger, RESULT_MODE, resultEventKey, sendResultEvent } from '../lib/result-ledger.js';
import { cleanupTemp, tempDir, tempRepo } from './support.js';
import { commitAll } from './runner-support.js';

import type { EventWritePreflight } from '../../../system-deep-loop/runtime/lib/event-envelope/index.js';
import type { RunResultPayload } from '../lib/result-ledger.js';

afterEach(cleanupTemp);

const PAYLOAD: RunResultPayload = { runId: 'r1', botId: 'manual-ok', reason: 'converged', class: null, needsYouItemId: null };

function committedCheckout(): string {
  const checkout = tempRepo();
  commitAll(checkout);
  return checkout;
}

function open(checkoutRoot: string) {
  const root = tempDir('bots-ledger-');
  const ledger = openResultLedger({ ledgerDir: join(root, 'ledger'), authorityRoot: join(root, 'authority'), checkoutRoot });
  if (!ledger.ok) throw new Error(ledger.reason);
  return ledger.value;
}

describe('run result ledger', () => {
  it('stores a result event through the gateway once, and a re-send of it as a replay', async () => {
    const ledger = open(committedCheckout());
    const event = ledger.prepare(PAYLOAD);
    expect(event.identity.idempotencyKey).toBe(resultEventKey('r1'));
    expect(await sendResultEvent(ledger, event)).toMatchObject({ ok: true, replayed: false, attempts: 1 });
    expect(await sendResultEvent(ledger, event)).toMatchObject({ ok: true, replayed: true, attempts: 1 });
    expect(await ledger.storedEventCount()).toBe(1);
  });

  it('refuses a second, different result under the same run key without storing it', async () => {
    const ledger = open(committedCheckout());
    await sendResultEvent(ledger, ledger.prepare(PAYLOAD));
    const other = await sendResultEvent(ledger, ledger.prepare({ ...PAYLOAD, reason: 'timeout', class: 'environment' }));
    expect(other).toMatchObject({ ok: false, reason: 'append: IDEMPOTENCY_CONFLICT', attempts: 1 });
    expect(await ledger.storedEventCount()).toBe(1);
  });

  it('retries a failed write by re-sending the same event object', async () => {
    const ledger = open(committedCheckout());
    const event = ledger.prepare(PAYLOAD);
    const sent: EventWritePreflight[] = [];
    let calls = 0;
    const flaky = {
      send: async (candidate: EventWritePreflight) => {
        sent.push(candidate);
        calls += 1;
        if (calls === 1) throw new Error('disk hiccup');
        return ledger.send(candidate);
      },
    };
    expect(await sendResultEvent(flaky, event)).toMatchObject({ ok: true, attempts: 2 });
    expect(sent).toEqual([event, event]);
    expect(sent[0]).toBe(sent[1]);
    expect(await ledger.storedEventCount()).toBe(1);
  });

  it('refuses to bind a checkout that has no commit', () => {
    const root = tempDir('bots-ledger-');
    const result = openResultLedger({ ledgerDir: join(root, 'ledger'), authorityRoot: join(root, 'authority'), checkoutRoot: tempRepo() });
    expect(result).toMatchObject({ ok: false, reason: 'checkout-has-no-commit' });
    expect(RESULT_MODE).toBe('system-skilled-bots');
  });
});
