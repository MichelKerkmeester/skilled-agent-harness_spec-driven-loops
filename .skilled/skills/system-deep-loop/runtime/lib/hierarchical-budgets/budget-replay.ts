// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Replay Contract
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
} from '../replay-fingerprint/index.js';
import {
  BUDGET_PROJECTION_SCHEMA_VERSION,
  BUDGET_REDUCER_VERSION,
  createBudgetReducerRegistry,
  createInitialBudgetProjection,
} from './budget-reducer.js';

import type { ReplayExecutionInput } from '../replay-fingerprint/index.js';
import type { BudgetProjection } from './budget-reducer.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const BUDGET_REPLAY_REDUCER_ID = 'hierarchical-budget-projection';

// ───────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Register the exact reducer and projection schema used by replay fingerprints. */
export function createBudgetReplayComponentRegistry(): ReplayComponentRegistry<BudgetProjection> {
  return new ReplayComponentRegistry([{
    reducerId: BUDGET_REPLAY_REDUCER_ID,
    reducerVersion: BUDGET_REDUCER_VERSION,
    projectionSchemaVersion: BUDGET_PROJECTION_SCHEMA_VERSION,
    requiredReplayInputKeys: [INITIAL_STATE_REPLAY_INPUT],
    reducerRegistry: createBudgetReducerRegistry(),
  }]);
}

/** Build the content-addressed initial-state input required for deterministic replay. */
export function createBudgetReplayExecutionInput(): ReplayExecutionInput<BudgetProjection> {
  const initialState = createInitialBudgetProjection();
  return Object.freeze({
    reducerId: BUDGET_REPLAY_REDUCER_ID,
    reducerVersion: BUDGET_REDUCER_VERSION,
    projectionSchemaVersion: BUDGET_PROJECTION_SCHEMA_VERSION,
    initialState,
    replayInputDigests: Object.freeze({
      [INITIAL_STATE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(initialState)),
    }),
  });
}
