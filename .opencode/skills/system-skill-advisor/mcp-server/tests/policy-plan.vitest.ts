// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Policy Planner Tests
// ───────────────────────────────────────────────────────────────────

import {
  DeliveryStateMachine,
  buildDeliveryReceipt,
  buildPolicyPlan,
  DELIVERY_RECEIPT_FIELDS,
  evaluateDeliveryState,
  GATE_SPEC_FOLDER_QUESTION_ID,
  hashPolicyBlock,
  hashPolicySet,
  isDeliveryReceipt,
  POLICY_BLOCK_IDS,
  POLICY_BLOCK_REGISTRY,
  POLICY_HASH_FIELDS,
  POLICY_COMMENT_HYGIENE_ID,
  ROUTE_ADVISOR_ID,
  RUNTIME_PI_DISPATCH_ID,
  resetShadowDeliveryState,
  resolveConfirmedSessionId,
  serializePolicyHashInput,
} from '../lib/policy-plan.js';
import type { DeliveryReceipt } from '../lib/policy-plan.js';

function observedReceipt(contentHash: string, lifecycleEpoch = 0) {
  return { plannedHash: contentHash, lifecycleEpoch } as const;
}

describe('shadow policy planner', () => {
  it('exports the four stable block identifiers', () => {
    expect([
      POLICY_COMMENT_HYGIENE_ID,
      ROUTE_ADVISOR_ID,
      GATE_SPEC_FOLDER_QUESTION_ID,
      RUNTIME_PI_DISPATCH_ID,
    ]).toEqual([
      'policy.comment-hygiene.v1',
      'route.advisor.v1',
      'gate.spec-folder-question.v1',
      'runtime.pi-dispatch.v1',
    ]);
    expect(POLICY_BLOCK_IDS).toMatchObject({
      GOVERNOR: 'policy.governor.v1',
      PROOF_OVER_APPEARANCE: 'policy.proof-over-appearance.v1',
      SESSION_START: 'lifecycle.session-start.v1',
      OPENCODE_CONTINUITY: 'runtime.opencode-continuity.v1',
      OPENCODE_COMPILED_ROUTE: 'route.opencode-compiled.v1',
    });
    expect(POLICY_BLOCK_REGISTRY).toHaveLength(9);
  });

  it('keeps prompt and session data out of serialized hash inputs', () => {
    const prompt = 'Read /Users/example/private/session-42.txt token=session-secret-42';
    const serialization = serializePolicyHashInput({
      blocks: [{ id: ROUTE_ADVISOR_ID, content: 'Advisor: live', order: 0 }],
      prompt,
      sessionId: 'session-secret-42',
    });

    expect(serialization).not.toContain('/Users/example/private/session-42.txt');
    expect(serialization).not.toContain('session-secret-42');
    expect(POLICY_HASH_FIELDS).toEqual(['id', 'content', 'order']);
    expect(JSON.parse(serialization)).toEqual([{
      id: ROUTE_ADVISOR_ID,
      content: 'Advisor: live',
      order: 0,
    }]);
  });

  it('hashes current block content and preserves ordered delivery identity', () => {
    const blocks = [
      { id: ROUTE_ADVISOR_ID, content: 'Advisor: live', order: 0 },
      { id: POLICY_COMMENT_HYGIENE_ID, content: 'Comment policy', order: 1 },
    ];
    const plan = buildPolicyPlan({ blocks });

    expect(plan.blocks[0]?.contentHash).toBe(hashPolicyBlock(blocks[0]));
    expect(plan.policySetHash).toBe(hashPolicySet(blocks));
    expect(hashPolicySet([
      { ...blocks[0], order: 1 },
      { ...blocks[1], order: 0 },
    ])).not.toBe(plan.policySetHash);
  });

  it('rejects a delivery receipt when any required field is missing', () => {
    const receipt = buildDeliveryReceipt({
      shadowId: 'shadow.test.v1',
      plannedHash: 'planned-hash',
      emittedHash: 'emitted-hash',
      byteCount: 12,
      lifecycleEpoch: 2,
      transformMessageIdentity: 'transform:test',
      hostReceiptStatus: 'configured',
    });

    expect(DELIVERY_RECEIPT_FIELDS).toHaveLength(7);
    for (const field of DELIVERY_RECEIPT_FIELDS) {
      const missingField: Record<string, unknown> = { ...receipt };
      delete missingField[field];
      expect(isDeliveryReceipt(missingField), `receipt missing ${field}`).toBe(false);
      expect(() => buildDeliveryReceipt(missingField as unknown as DeliveryReceipt)).toThrow();
    }
  });

  it('keeps configured and observed host lanes distinct', () => {
    const configured = buildDeliveryReceipt({
      shadowId: 'shadow.configured.v1',
      plannedHash: 'planned-hash',
      emittedHash: null,
      byteCount: 0,
      lifecycleEpoch: 0,
      transformMessageIdentity: null,
      hostReceiptStatus: 'configured',
    });
    const observed = { ...configured, hostReceiptStatus: 'observed' as const };

    expect(configured.hostReceiptStatus).not.toBe(observed.hostReceiptStatus);
    expect(isDeliveryReceipt(observed)).toBe(true);
  });

  it('transitions from unseen to delivered to same-content suppression', () => {
    const machine = new DeliveryStateMachine();
    const input = { sessionId: 'session-a', blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };

    expect(machine.peek(input)).toMatchObject({
      state: 'UNSEEN',
      epoch: 0,
      sessionKnown: false,
      routeOnlyEligible: false,
    });
    const confirmed = { ...input, receipt: observedReceipt(input.contentHash) };
    expect(machine.confirmDelivery(confirmed)).toMatchObject({
      state: 'DELIVERED',
      epoch: 0,
    });
    expect(machine.decideSuppression(input)).toMatchObject({
      state: 'SUPPRESSED_SAME',
      epoch: 0,
      routeOnlyEligible: true,
    });
    expect(machine.peek(input).state).toBe('SUPPRESSED_SAME');
  });

  it('marks a changed content hash dirty and requires a new full delivery', () => {
    const machine = new DeliveryStateMachine();
    const original = { sessionId: 'session-dirty', blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };
    const changed = { ...original, contentHash: 'hash-b' };

    machine.confirmDelivery({ ...original, receipt: observedReceipt(original.contentHash) });
    expect(machine.decideSuppression(original).state).toBe('SUPPRESSED_SAME');
    expect(machine.peek(changed)).toMatchObject({
      state: 'UNSEEN',
      contentHash: 'hash-b',
      routeOnlyEligible: false,
    });
    expect(machine.confirmDelivery({ ...changed, receipt: observedReceipt(changed.contentHash) }).state).toBe('DELIVERED');
    expect(machine.decideSuppression(changed).state).toBe('SUPPRESSED_SAME');
  });

  it.each([
    ['startup', { lifecycleEvent: 'startup' }],
    ['resume', { lifecycleEvent: 'resume' }],
    ['compact', { lifecycleEvent: 'compact' }],
    ['scope', { scopeChanged: true }],
    ['policy set', { policySetChanged: true }],
    ['goal', { goalChanged: true }],
  ])('advances the epoch and resets blocks for a %s signal', (_name, signal) => {
    const machine = new DeliveryStateMachine();
    const input = { sessionId: 'session-epoch', blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };
    const secondInput = { ...input, blockId: POLICY_COMMENT_HYGIENE_ID, contentHash: 'hash-b' };

    machine.confirmDelivery({ ...input, receipt: observedReceipt(input.contentHash) });
    machine.confirmDelivery({ ...secondInput, receipt: observedReceipt(secondInput.contentHash) });
    expect(machine.decideSuppression(input).state).toBe('SUPPRESSED_SAME');
    expect(machine.decideSuppression(secondInput).state).toBe('SUPPRESSED_SAME');
    const advanced = machine.advanceForSignals({ ...input, ...signal });

    expect(advanced).toMatchObject({ epoch: 1, sessionKnown: true, advanced: true });
    expect(machine.peek(input)).toMatchObject({
      state: 'UNSEEN',
      epoch: 1,
      routeOnlyEligible: false,
    });
    expect(machine.peek(secondInput)).toMatchObject({
      state: 'UNSEEN',
      epoch: 1,
      routeOnlyEligible: false,
    });
  });

  it('never reads or shares state for unknown or ambiguous identities', () => {
    const machine = new DeliveryStateMachine();
    const confirmed = { sessionId: 'confirmed-session', blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };
    machine.confirmDelivery({ ...confirmed, receipt: observedReceipt(confirmed.contentHash) });
    expect(machine.decideSuppression(confirmed).state).toBe('SUPPRESSED_SAME');

    const unknown = { blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };
    expect(evaluateDeliveryState(unknown, machine)).toMatchObject({
      state: 'UNSEEN',
      sessionKnown: false,
      routeOnlyEligible: false,
    });
    expect(machine.confirmDelivery(unknown).sessionKnown).toBe(false);
    expect(machine.peek(unknown).state).toBe('UNSEEN');
    expect(machine.peek({
      ...confirmed,
      sessionIdentity: { id: 'confirmed-session', confirmed: false },
    })).toMatchObject({
      state: 'UNSEEN',
      sessionKnown: false,
    });
    expect(resolveConfirmedSessionId({ sessionId: 'confirmed-session', sessionIdentityAmbiguous: true })).toBeNull();
    expect(machine.peek(confirmed).state).toBe('SUPPRESSED_SAME');
  });

  it('confirmDelivery without a receipt never yields DELIVERED or SUPPRESSED_SAME', () => {
    const machine = new DeliveryStateMachine();
    const input = { sessionId: 'missing-receipt', blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };

    expect(machine.confirmDelivery(input).state).toBe('UNSEEN');
    expect(machine.peek(input).state).toBe('UNSEEN');
    expect(machine.decideSuppression(input).state).toBe('UNSEEN');
    expect(machine.peek(input).state).toBe('UNSEEN');
  });

  it('peek does not create a session or advance an epoch', () => {
    const machine = new DeliveryStateMachine();
    const input = { sessionId: 'peek-only', blockId: ROUTE_ADVISOR_ID, contentHash: 'hash-a' };

    expect(machine.peek(input)).toMatchObject({ state: 'UNSEEN', epoch: 0, sessionKnown: false });
    expect(machine.peek({ ...input, lifecycleEvent: 'resume' })).toMatchObject({
      state: 'UNSEEN',
      epoch: 0,
      sessionKnown: false,
    });
    expect(machine.currentEpoch(input)).toBe(0);
  });

  it('reproduces the representative reduction in shadow accounting only', () => {
    resetShadowDeliveryState();
    const machine = new DeliveryStateMachine();
    const block = { id: ROUTE_ADVISOR_ID, content: 'r'.repeat(43), order: 0 };
    const contentHash = hashPolicyBlock(block);
    const input = { sessionId: 'scenario-session', blockId: block.id, contentHash };
    const fullPolicyBytes = 806;
    const routeOnlyBytes = 43;
    const gateBytes = 522;
    const turns = 10;
    const mutationPositiveTurns = 3;
    const lifecycleReplays = 0;
    const fullDeliveries = Math.max(1, 1 + lifecycleReplays);
    let shadowBytes = 0;

    for (let turn = 0; turn < turns; turn += 1) {
      const decision = machine.decideSuppression(input);
      if (decision.state === 'UNSEEN') {
        shadowBytes += fullPolicyBytes;
        machine.confirmDelivery({
          ...input,
          receipt: observedReceipt(input.contentHash, decision.epoch),
        });
      } else {
        expect(decision.state).toBe('SUPPRESSED_SAME');
        shadowBytes += routeOnlyBytes;
      }
    }
    shadowBytes += Math.min(mutationPositiveTurns, fullDeliveries) * gateBytes;

    const baselineBytes = turns * fullPolicyBytes + mutationPositiveTurns * gateBytes;
    expect(baselineBytes).toBe(9_626);
    expect(shadowBytes).toBe(1_715);
    expect(Number(((1 - shadowBytes / baselineBytes) * 100).toFixed(1))).toBe(82.2);
    console.log(
      `SHADOW_REDUCTION observedReceipt=true baselineBytes=${baselineBytes} shadowBytes=${shadowBytes} reductionPct=82.2`,
    );
  });
});
