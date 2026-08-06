// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Policy Planner Tests
// ───────────────────────────────────────────────────────────────────

import {
  buildDeliveryReceipt,
  buildPolicyPlan,
  DELIVERY_RECEIPT_FIELDS,
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
  serializePolicyHashInput,
} from '../lib/policy-plan.js';
import type { DeliveryReceipt } from '../lib/policy-plan.js';

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
});
