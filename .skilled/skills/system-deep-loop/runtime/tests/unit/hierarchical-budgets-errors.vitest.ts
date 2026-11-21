// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Error Context Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  BudgetEventTypes,
  budgetScopePath,
  createInitialBudgetProjection,
  materializeBudgetLifecyclePayload,
} from '../../lib/hierarchical-budgets/index.js';

import type { BudgetPayloadMaterializationInput } from '../../lib/hierarchical-budgets/index.js';

function materializationInput(
  overrides: Partial<BudgetPayloadMaterializationInput>,
): BudgetPayloadMaterializationInput {
  return {
    operationId: 'operation-1',
    requestId: 'request-1',
    scopeId: 'scope-ghost',
    scopePath: [],
    replayFingerprint: 'fingerprint-1',
    reasonCode: 'allowed',
    data: {},
    outcome: {},
    ...overrides,
  };
}

describe('hierarchical budget error context', () => {
  it('names the scope that is missing from the projection', () => {
    expect(() => budgetScopePath(createInitialBudgetProjection(), 'scope-ghost'))
      .toThrow(/scope-ghost/);
  });

  it('names the missing scope inside a scope path', () => {
    expect(() => materializeBudgetLifecyclePayload(
      createInitialBudgetProjection(),
      BudgetEventTypes.RESERVATION_DENIED,
      materializationInput({ scopePath: ['scope-ghost'] }),
    )).toThrow(/scope-ghost/);
  });

  it('names the reservation that does not exist', () => {
    expect(() => materializeBudgetLifecyclePayload(
      createInitialBudgetProjection(),
      BudgetEventTypes.RESERVATION_RENEWED,
      materializationInput({ data: { reservationId: 'reservation-ghost' } }),
    )).toThrow(/reservation-ghost/);
  });
});
