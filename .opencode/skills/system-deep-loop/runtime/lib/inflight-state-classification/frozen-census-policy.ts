// ───────────────────────────────────────────────────────────────────
// MODULE: Frozen In-Flight Census Policy
// ───────────────────────────────────────────────────────────────────

import { InflightDisposition } from './inflight-state-types.js';

import type {
  FrozenCensusContract,
  FrozenCensusRowPolicy,
  WorkflowMode,
} from './inflight-state-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PINNED CONTRACT
// ───────────────────────────────────────────────────────────────────

export const FROZEN_CENSUS_CONTRACT: FrozenCensusContract = Object.freeze({
  schemaVersion: 2,
  baseSha: 'fe6ca3030917073f3b478bc044e10034dcc4394b',
  stateBackendCensusSha256: 'e35a707bc969f075e1e4fb0558a9b211f48c526a47d7d0a121e8712d54bb9441',
  stateBackendRowCount: 46,
  transitionPolicyRevision: '2026-07-20',
  transitionPolicySha256: '329ad7ad1c4f8eaedb531887b00ed29c3413fef00e7c8532941ad07f033b634d',
  phaseTreeSha256: '363da601d45c5eacd90d4ce02adc2af14f80f21d62df6edaf9afa49f6efda50d',
  rollbackMinimumDays: 14,
  rollbackMinimumSuccessfulRuns: 5,
});

const ALL_MODES: readonly WorkflowMode[] = Object.freeze([
  'research',
  'review',
  'ai-council',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'alignment',
]);

const IMPROVEMENT_MODES: readonly WorkflowMode[] = Object.freeze([
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
]);

const RESEARCH_MODE: readonly WorkflowMode[] = Object.freeze(['research']);
const REVIEW_MODE: readonly WorkflowMode[] = Object.freeze(['review']);
const ALIGNMENT_MODE: readonly WorkflowMode[] = Object.freeze(['alignment']);
const COUNCIL_MODE: readonly WorkflowMode[] = Object.freeze(['ai-council']);
const MODEL_BENCHMARK_MODE: readonly WorkflowMode[] = Object.freeze(['model-benchmark']);
const SKILL_BENCHMARK_MODE: readonly WorkflowMode[] = Object.freeze(['skill-benchmark']);
const PIVOT_MODES: readonly WorkflowMode[] = Object.freeze(['research', 'review']);

function policy(
  disposition: FrozenCensusRowPolicy['disposition'],
  modes: readonly WorkflowMode[],
  rationale: string,
): FrozenCensusRowPolicy {
  return Object.freeze({ disposition, modes, rationale });
}

// ───────────────────────────────────────────────────────────────────
// 2. ROW-LEVEL DISPOSITIONS
// ───────────────────────────────────────────────────────────────────

const ROW_POLICIES = {
  'research-config': policy(
    InflightDisposition.UPCAST,
    RESEARCH_MODE,
    'The frozen input contract changes only through a pure versioned shape conversion.',
  ),
  'research-state': policy(
    InflightDisposition.MIGRATE,
    RESEARCH_MODE,
    'The authoritative event history moves only from a quiescent checkpoint with replay and restore proof.',
  ),
  'research-deltas': policy(
    InflightDisposition.UPCAST,
    RESEARCH_MODE,
    'Completed iteration deltas retain stored bytes and receive only an effective versioned shape.',
  ),
  'research-projections': policy(
    InflightDisposition.UPCAST,
    RESEARCH_MODE,
    'Derived projections are replayed through a pure schema conversion without rewriting their sources.',
  ),
  'research-strategy-inbox': policy(
    InflightDisposition.PIN,
    RESEARCH_MODE,
    'Pending control input stays with the legacy consumer until its bounded dequeue boundary.',
  ),
  'research-controls': policy(
    InflightDisposition.BLOCK,
    RESEARCH_MODE,
    'Lock or pause ownership cannot be translated in place and must drain before reclassification.',
  ),
  'research-workdirs': policy(
    InflightDisposition.PIN,
    RESEARCH_MODE,
    'The active packet artifact bundle keeps legacy path resolution until the run reaches a terminal boundary.',
  ),
  'review-config': policy(
    InflightDisposition.UPCAST,
    REVIEW_MODE,
    'The frozen input contract changes only through a pure versioned shape conversion.',
  ),
  'review-state': policy(
    InflightDisposition.MIGRATE,
    REVIEW_MODE,
    'The authoritative event history moves only from a quiescent checkpoint with replay and restore proof.',
  ),
  'review-deltas': policy(
    InflightDisposition.UPCAST,
    REVIEW_MODE,
    'Completed iteration deltas retain stored bytes and receive only an effective versioned shape.',
  ),
  'review-projections': policy(
    InflightDisposition.UPCAST,
    REVIEW_MODE,
    'Derived projections are replayed through a pure schema conversion without rewriting their sources.',
  ),
  'review-strategy': policy(
    InflightDisposition.PIN,
    REVIEW_MODE,
    'Mutable strategy input stays legacy-authoritative until the current iteration boundary closes.',
  ),
  'review-controls': policy(
    InflightDisposition.BLOCK,
    REVIEW_MODE,
    'Lock or pause ownership cannot be translated in place and must drain before reclassification.',
  ),
  'review-workdirs': policy(
    InflightDisposition.PIN,
    REVIEW_MODE,
    'The active packet artifact bundle keeps legacy path resolution until the run reaches a terminal boundary.',
  ),
  'alignment-config-corpus': policy(
    InflightDisposition.MIGRATE,
    ALIGNMENT_MODE,
    'The bound corpus moves only as one complete checkpoint with its identity and rollback anchor.',
  ),
  'alignment-state-deltas': policy(
    InflightDisposition.MIGRATE,
    ALIGNMENT_MODE,
    'The combined lane history moves atomically because separating state from deltas would lose ordering.',
  ),
  'alignment-projections': policy(
    InflightDisposition.UPCAST,
    ALIGNMENT_MODE,
    'Derived projections are replayed through a pure schema conversion without rewriting their sources.',
  ),
  'alignment-control': policy(
    InflightDisposition.BLOCK,
    ALIGNMENT_MODE,
    'Active execution-control ownership must drain under the legacy lock protocol.',
  ),
  'alignment-workdirs': policy(
    InflightDisposition.PIN,
    ALIGNMENT_MODE,
    'The active lane artifact bundle remains on the legacy root through its terminal boundary.',
  ),
  'council-config-state': policy(
    InflightDisposition.PIN,
    COUNCIL_MODE,
    'Configuration and live session history stay under one legacy authority until the session closes.',
  ),
  'council-round-ledgers': policy(
    InflightDisposition.PIN,
    COUNCIL_MODE,
    'A live round preserves its legacy lock, ordering, and retry ownership until a terminal receipt exists.',
  ),
  'council-controls': policy(
    InflightDisposition.BLOCK,
    COUNCIL_MODE,
    'Session and round locks cannot be transferred while their owners may still append.',
  ),
  'council-artifacts': policy(
    InflightDisposition.PIN,
    COUNCIL_MODE,
    'The complete round artifact bundle remains legacy-addressed until session and round ledgers terminate.',
  ),
  'council-graph': policy(
    InflightDisposition.MIGRATE,
    COUNCIL_MODE,
    'The graph moves only from a transactionally frozen snapshot with atomic import and restoration proof.',
  ),
  'improvement-config-manifests': policy(
    InflightDisposition.PIN,
    IMPROVEMENT_MODES,
    'Run-bound targets and manifests stay with the active legacy evaluation until its terminal boundary.',
  ),
  'improvement-ledgers': policy(
    InflightDisposition.PIN,
    IMPROVEMENT_MODES,
    'The active evaluation journal preserves legacy lifecycle ordering and effect ownership until terminal.',
  ),
  'improvement-derived-state': policy(
    InflightDisposition.PIN,
    IMPROVEMENT_MODES,
    'Derived evaluation state remains coupled to the legacy journal until the current evaluation closes.',
  ),
  'improvement-artifacts': policy(
    InflightDisposition.PIN,
    IMPROVEMENT_MODES,
    'Candidate and evaluation artifacts retain their legacy root until the active evaluation terminates.',
  ),
  'improvement-controls': policy(
    InflightDisposition.BLOCK,
    IMPROVEMENT_MODES,
    'Evaluation locks and pause ownership must drain before any state handling can proceed.',
  ),
  'model-benchmark-hub-output': policy(
    InflightDisposition.FORK,
    MODEL_BENCHMARK_MODE,
    'Immutable benchmark evidence may be copied only to an isolated shadow namespace.',
  ),
  'skill-benchmark-output': policy(
    InflightDisposition.FORK,
    SKILL_BENCHMARK_MODE,
    'Diagnostic benchmark evidence may be copied only to an isolated shadow namespace.',
  ),
  'model-grader-cache': policy(
    InflightDisposition.PIN,
    MODEL_BENCHMARK_MODE,
    'An in-progress scorer keeps legacy cache and retry ownership until the bounded scoring boundary.',
  ),
  'coverage-graph': policy(
    InflightDisposition.MIGRATE,
    ALL_MODES,
    'The shared graph moves only from a transactionally frozen snapshot with atomic restoration evidence.',
  ),
  'database-controls': policy(
    InflightDisposition.BLOCK,
    ALL_MODES,
    'Writer locks cannot be translated or shared between legacy and dark graph writers.',
  ),
  'runtime-observability': policy(
    InflightDisposition.UPCAST,
    ALL_MODES,
    'Completed telemetry rows retain historical bytes and receive only an effective schema conversion.',
  ),
  'fanout-ledger': policy(
    InflightDisposition.PIN,
    ALL_MODES,
    'The legacy orchestrator retains branch, lease, and retry ownership until fan-out reaches terminal state.',
  ),
  'fanout-checkpoints': policy(
    InflightDisposition.PIN,
    ALL_MODES,
    'The current wait set and summary remain coupled to the legacy orchestrator until terminal fan-in.',
  ),
  'fanout-lineages': policy(
    InflightDisposition.PIN,
    ALL_MODES,
    'Lineage artifacts stay under legacy executor ownership until every branch is terminal or salvaged.',
  ),
  'behavior-benchmark-output': policy(
    InflightDisposition.FORK,
    ALL_MODES,
    'Behavior evidence is copied only into a non-authoritative diagnostic namespace.',
  ),
  'divergent-pivot-transactions': policy(
    InflightDisposition.PIN,
    PIVOT_MODES,
    'The pivot lifecycle and its evidence remain one legacy transaction until a durable terminal event.',
  ),
  'loop-guard-session-state': policy(
    InflightDisposition.PIN,
    ALL_MODES,
    'Active dispatch counts stay with the legacy guard until the session reaches an inactive boundary.',
  ),
  'loop-guard-warning-logs': policy(
    InflightDisposition.FORK,
    ALL_MODES,
    'Non-authoritative warnings may be mirrored only to an isolated audit sink.',
  ),
  'loop-guard-archive': policy(
    InflightDisposition.UPCAST,
    ALL_MODES,
    'Retained inactive history keeps its source bytes and receives only an effective schema conversion.',
  ),
  'loop-guard-sweep-lock': policy(
    InflightDisposition.BLOCK,
    ALL_MODES,
    'Retention-sweep exclusion cannot be transferred while a process may own the lock directory.',
  ),
  'compiled-command-contracts': policy(
    InflightDisposition.UPCAST,
    ALL_MODES,
    'Generated contracts remain derived from maintained sources and change only by deterministic conversion.',
  ),
  'compiled-command-manifest': policy(
    InflightDisposition.UPCAST,
    ALL_MODES,
    'Completed provenance rows keep stored order and bytes while readers consume an effective shape.',
  ),
} as const satisfies Readonly<Record<string, FrozenCensusRowPolicy>>;

export type FrozenCensusRowId = keyof typeof ROW_POLICIES;

export const FROZEN_CENSUS_ROW_POLICIES: Readonly<
  Record<FrozenCensusRowId, FrozenCensusRowPolicy>
> = Object.freeze(ROW_POLICIES);

export const FROZEN_CENSUS_ROW_IDS: readonly FrozenCensusRowId[] = Object.freeze(
  Object.keys(ROW_POLICIES).sort() as FrozenCensusRowId[],
);

/** Resolve one exact census row without inventing a fallback family. */
export function frozenPolicyFor(rowId: string): FrozenCensusRowPolicy | null {
  return Object.prototype.hasOwnProperty.call(FROZEN_CENSUS_ROW_POLICIES, rowId)
    ? FROZEN_CENSUS_ROW_POLICIES[rowId as FrozenCensusRowId]
    : null;
}
