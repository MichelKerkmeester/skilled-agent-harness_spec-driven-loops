// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Executor Effect Recording Tests
// ───────────────────────────────────────────────────────────────────
//
// Proves the live fan-out executor dispatch routes through the shipped
// effect gateway: one durable intent before the spawn, one confirmation
// after, both sharing an effect id, into the effect ledger the enablement
// consumer reads. Proves fail-closed (no spawn when the intent append
// fails) and that the consumer observes non-empty effect coverage.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { AppendOnlyLedger } from '../../lib/authorized-ledger/index.js';
import {
  createEvidenceControlEventRegistry,
  EFFECT_CONFIRMATION_EVENT_TYPE,
  EFFECT_INTENT_EVENT_TYPE,
} from '../../lib/receipts-and-effect-recovery/index.js';
import type { AuthoritySnapshot } from '../../lib/authorized-ledger/index.js';
import type { VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';
import {
  RestartObservationError,
  RestartObservationErrorCodes,
  observeRestartFacts,
} from '../../lib/restart-observation/restart-facts-reader.js';
import {
  dispatchExecutorEffect,
  type EffectGatewayWriter,
  type ExecutorSpawnResult,
} from '../../lib/deep-loop/fanout-effect-dispatch.js';

const tempDirs: string[] = [];

const AUTHORITY: AuthoritySnapshot = Object.freeze({
  state: 'new_authoritative_reversible',
  epoch: 1,
});
const authorityProvider = (): AuthoritySnapshot => AUTHORITY;
const CANONICAL_MODE = 'deep-research' as const;
const EFFECT_LEDGER_ID = `${CANONICAL_MODE}-effect-ledger`;
const MODE_LEDGER_ID = `${CANONICAL_MODE}-ledger`;
const AUDIT_LEDGER_ID = `${CANONICAL_MODE}-audit-ledger`;

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function makeDispatchSpy(
  stdout = 'lineage output\n',
  onDispatch?: () => void | Promise<void>,
): {
  dispatch: (command: string, cmdArgs: readonly string[], opts: Record<string, unknown>) => Promise<ExecutorSpawnResult>;
  calls: number;
} {
  const state = { calls: 0 };
  return {
    dispatch: async (_command, _cmdArgs, _opts) => {
      state.calls += 1;
      await onDispatch?.();
      return Object.freeze({ status: 0, signal: null, stdout });
    },
    get calls() {
      return state.calls;
    },
  };
}

async function readEffectLedger(lineageDir: string): Promise<readonly VerifiedLedgerEvent[]> {
  const registry = createEvidenceControlEventRegistry();
  const ledger = new AppendOnlyLedger({
    rootDirectory: lineageDir,
    ledgerId: EFFECT_LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  return ledger.readVerifiedEvents();
}

function effectLedgerReadPort(lineageDir: string) {
  const registry = createEvidenceControlEventRegistry();
  return new AppendOnlyLedger({
    rootDirectory: lineageDir,
    ledgerId: EFFECT_LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
}

function modeLedgerReadPort(lineageDir: string) {
  // An empty mode ledger is sufficient for the observer: it only needs the
  // directory to exist and a readable head. Construction creates the dir.
  const registry = createEvidenceControlEventRegistry();
  return new AppendOnlyLedger({
    rootDirectory: lineageDir,
    ledgerId: MODE_LEDGER_ID,
    auditLedgerId: AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('fanout executor effect recording', () => {
  it('writes one intent and one confirmation sharing an effect id, intent before spawn', async () => {
    const lineageDir = makeTempDir('fanout-effect-order-');
    let intentSequenceAtSpawn: number | null = null;
    const spy = makeDispatchSpy('payload\n', async () => {
      // The dispatch spy runs inside the adapter, AFTER the gateway appended
      // the durable intent and BEFORE the confirmation. Reading the ledger
      // here proves the intent preceded the spawn.
      const events = await readEffectLedger(lineageDir);
      const intent = events.find(
        (entry) => entry.event.effective.envelope.event_type === EFFECT_INTENT_EVENT_TYPE,
      );
      intentSequenceAtSpawn = intent ? intent.frame.sequence : null;
    });

    const result = await dispatchExecutorEffect({
      lineageDir,
      canonicalMode: CANONICAL_MODE,
      sessionId: 'sess-lineage-A-run-1',
      lineageLabel: 'lineage-A',
      attempt: 1,
      command: 'echo',
      cmdArgs: ['payload'],
      dispatchOpts: { cwd: lineageDir, timeoutMs: 5_000 },
      dispatch: spy.dispatch,
      authorityProvider,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('payload\n');
    expect(spy.calls).toBe(1);

    const events = await readEffectLedger(lineageDir);
    const intents = events.filter(
      (entry) => entry.event.effective.envelope.event_type === EFFECT_INTENT_EVENT_TYPE,
    );
    const confirmations = events.filter(
      (entry) => entry.event.effective.envelope.event_type === EFFECT_CONFIRMATION_EVENT_TYPE,
    );

    expect(intents).toHaveLength(1);
    expect(confirmations).toHaveLength(1);
    const intentPayload = intents[0]!.event.effective.envelope.payload as { effect_id: string };
    const confirmationPayload = confirmations[0]!.event.effective.envelope.payload as { effect_id: string };
    expect(confirmationPayload.effect_id).toBe(intentPayload.effect_id);

    // Intent sequence precedes the spawn (observed mid-dispatch), and the
    // confirmation follows it.
    expect(intentSequenceAtSpawn).toBe(1);
    expect(intents[0]!.frame.sequence).toBe(1);
    expect(confirmations[0]!.frame.sequence).toBe(2);
    expect(confirmations[0]!.frame.sequence).toBeGreaterThan(intents[0]!.frame.sequence);
  });

  it('fails closed when the durable intent append throws, then spawns once restored', async () => {
    const lineageDir = makeTempDir('fanout-effect-failclosed-');

    // Negative control: a writer whose append throws. The gateway calls
    // readVerifiedEvents first, then append; the append throws before the
    // adapter dispatch (the spawn) is ever reached.
    const throwingWriter: EffectGatewayWriter = {
      readVerifiedEvents: async () => [],
      findEvent: async () => null,
      append: async () => {
        throw new Error('durable intent append failed (test-injected)');
      },
    };
    const negativeSpy = makeDispatchSpy('should-not-run\n');

    const negativeResult = await dispatchExecutorEffect({
      lineageDir,
      canonicalMode: CANONICAL_MODE,
      sessionId: 'sess-lineage-B-run-1',
      lineageLabel: 'lineage-B',
      attempt: 1,
      command: 'echo',
      cmdArgs: ['should-not-run'],
      dispatchOpts: { cwd: lineageDir, timeoutMs: 5_000 },
      dispatch: negativeSpy.dispatch,
      authorityProvider,
      writer: throwingWriter,
    });

    // Run 1 (negative): spawn never ran; a failure result is surfaced.
    expect(negativeSpy.calls).toBe(0);
    expect(negativeResult.status).toBeNull();
    expect(negativeResult.signal).toBeNull();
    expect(negativeResult.stdout).toBe('');
    expect(negativeResult.error).toBeInstanceOf(Error);
    expect(negativeResult.error!.message).toContain('durable intent append failed');

    // Run 2 (restored): no writer stub, so the real authorized append path
    // runs; the spawn executes and the ledger is populated.
    const positiveSpy = makeDispatchSpy('restored-run\n');
    const positiveResult = await dispatchExecutorEffect({
      lineageDir,
      canonicalMode: CANONICAL_MODE,
      sessionId: 'sess-lineage-B-run-2',
      lineageLabel: 'lineage-B',
      attempt: 2,
      command: 'echo',
      cmdArgs: ['restored-run'],
      dispatchOpts: { cwd: lineageDir, timeoutMs: 5_000 },
      dispatch: positiveSpy.dispatch,
      authorityProvider,
    });

    expect(positiveSpy.calls).toBe(1);
    expect(positiveResult.status).toBe(0);
    expect(positiveResult.stdout).toBe('restored-run\n');

    const events = await readEffectLedger(lineageDir);
    const intents = events.filter(
      (entry) => entry.event.effective.envelope.event_type === EFFECT_INTENT_EVENT_TYPE,
    );
    const confirmations = events.filter(
      (entry) => entry.event.effective.envelope.event_type === EFFECT_CONFIRMATION_EVENT_TYPE,
    );
    expect(intents).toHaveLength(1);
    expect(confirmations).toHaveLength(1);

    // Report the two runs as required: counts and the failure reason.
    // (Assertions above encode the report; this comment records the shape:
    // negative run = 0 dispatches / failure result / append-threw reason;
    // positive run = 1 dispatch / exit 0 / 1 intent + 1 confirmation.)
  });

  it('consumer observes non-empty effect coverage from the dispatch ledger', async () => {
    const lineageDir = makeTempDir('fanout-effect-consumer-');
    const spy = makeDispatchSpy('consumer-output\n');
    await dispatchExecutorEffect({
      lineageDir,
      canonicalMode: CANONICAL_MODE,
      sessionId: 'sess-lineage-C-run-1',
      lineageLabel: 'lineage-C',
      attempt: 1,
      command: 'echo',
      cmdArgs: ['consumer-output'],
      dispatchOpts: { cwd: lineageDir, timeoutMs: 5_000 },
      dispatch: spy.dispatch,
      authorityProvider,
    });
    expect(spy.calls).toBe(1);

    // The observer refuses when the effect ledger directory is absent. Point
    // it at an empty directory to prove the refusal, then at the lineage dir
    // where the dispatch recorded its effects.
    const emptyDir = makeTempDir('fanout-effect-empty-');
    await expect(observeRestartFacts({
      runDirectory: emptyDir,
      modeLedgerId: MODE_LEDGER_ID,
      effectLedgerId: EFFECT_LEDGER_ID,
      modeLedger: () => modeLedgerReadPort(emptyDir),
      effectLedger: () => effectLedgerReadPort(emptyDir),
      leases: [],
      continuityId: null,
    })).rejects.toMatchObject({ reasonCode: RestartObservationErrorCodes.EFFECT_LEDGER_ABSENT });

    // The mode ledger must exist for the observer to proceed past its mode
    // ledger check; constructing it creates the directory.
    modeLedgerReadPort(lineageDir);

    const facts = await observeRestartFacts({
      runDirectory: lineageDir,
      modeLedgerId: MODE_LEDGER_ID,
      effectLedgerId: EFFECT_LEDGER_ID,
      modeLedger: () => modeLedgerReadPort(lineageDir),
      effectLedger: () => effectLedgerReadPort(lineageDir),
      leases: [],
      continuityId: null,
    });

    // Non-empty effect coverage: one receipt (confirmation), no pending
    // (unconfirmed) effects. This is the opposite of the vacuous clean bill
    // of health an absent ledger would produce.
    expect(facts.receipts).toHaveLength(1);
    expect(facts.pendingEffects).toHaveLength(0);
  });
});
