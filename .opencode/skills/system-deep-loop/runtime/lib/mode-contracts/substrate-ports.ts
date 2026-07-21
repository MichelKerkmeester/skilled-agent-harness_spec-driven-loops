// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Contract Substrate Ports
// ───────────────────────────────────────────────────────────────────

import type {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import type { BlindedAdjudicationService } from '../blinded-adjudication/index.js';
import type { DurableBranchOrchestrator } from '../branch-leases-waves/index.js';
import type { HierarchicalBudgetAuthority } from '../hierarchical-budgets/index.js';
import type {
  BudgetEnvelope,
  BudgetVector,
} from '../hierarchical-budgets/budget-types.js';
import type { ContinuityIdentityService } from '../deep-loop/continuity-identity/index.js';
import type {
  EventProducer,
  EventTypeRegistry,
} from '../event-envelope/index.js';
import type { HealthObservationProjector } from '../health-degeneration-harness/index.js';
import type { FencedLeaseCoordinator } from '../locks-and-fencing/index.js';
import type {
  AuthorizedEvidenceWriter,
  BoundaryReceiptIssuer,
  EffectRecoveryGateway,
} from '../receipts-and-effect-recovery/index.js';
import type { SealedArtifactStore } from '../sealed-reference-artifacts/index.js';
import type { GaugeRegistry } from '../stream-fold-gauges/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. PORT TYPES
// ───────────────────────────────────────────────────────────────────

/** Existing runtime services consumed by every mode implementation. */
export interface ModeSubstratePorts {
  readonly eventEnvelope: {
    readonly registry: EventTypeRegistry;
    readonly producer: EventProducer;
  };
  readonly authorizedLedger: {
    readonly ledger: AppendOnlyLedger;
    readonly authorizationGateway: TransitionAuthorizationGateway;
  };
  readonly replayFingerprint: {
    readonly derive: typeof import('../replay-fingerprint/index.js').deriveReplayFingerprint;
    readonly verify: typeof import('../replay-fingerprint/index.js').verifyReplayFingerprint;
  };
  readonly receiptsAndEffectRecovery: {
    readonly evidenceWriter: AuthorizedEvidenceWriter;
    readonly receiptIssuer: BoundaryReceiptIssuer;
    readonly effectRecovery: EffectRecoveryGateway;
  };
  readonly sealedReferenceArtifacts: SealedArtifactStore;
  readonly blindedAdjudication: BlindedAdjudicationService;
  readonly hierarchicalBudgets: {
    readonly authority: HierarchicalBudgetAuthority;
    readonly envelope: BudgetEnvelope;
    readonly remaining: BudgetVector;
  };
  readonly streamFoldGauges: GaugeRegistry;
  readonly locksAndFencing: FencedLeaseCoordinator;
  readonly continuityIdentity: ContinuityIdentityService;
  readonly dispatchReceipts: {
    readonly dispatch: typeof import('../dispatch-receipts/index.js').dispatchWithDurableReceipt;
  };
  readonly resultEnvelopes: {
    readonly recordResult: typeof import('../result-envelopes/index.js').recordLeafResult;
    readonly recordSalvage: typeof import('../result-envelopes/index.js').recordSalvageFragment;
    readonly foldResume: typeof import('../result-envelopes/index.js').foldResumeProgress;
  };
  readonly branchLeasesAndWaves: DurableBranchOrchestrator;
  readonly conditionalFanIn: {
    readonly commitDecision: typeof import('../conditional-fanin/index.js').commitFanInDecision;
    readonly evaluateShadow:
      typeof import('../conditional-fanin/index.js').evaluateConditionalFanInShadow;
  };
  readonly partialFailurePolicy: {
    readonly evaluate:
      typeof import('../partial-failure-policy/index.js').evaluatePartialFailurePolicy;
    readonly evaluateDark:
      typeof import('../partial-failure-policy/index.js').evaluatePartialFailurePolicyDark;
  };
  readonly provenanceReduction: {
    readonly reduce: typeof import('../provenance-reduction/index.js').reduceProvenance;
    readonly replay:
      typeof import('../provenance-reduction/index.js').replayProvenanceReduction;
  };
  readonly pathCoverageTermination: {
    readonly evaluate:
      typeof import('../path-coverage-termination/index.js').evaluatePathCoverageTermination;
  };
  readonly cycleDetection: {
    readonly evaluate: typeof import('../cycle-detection/index.js').evaluateCycleHistory;
    readonly assessProgress: typeof import('../cycle-detection/index.js').assessCycleProgress;
  };
  readonly stoppingClocks: {
    readonly arbitrate: typeof import('../stopping-clocks/index.js').arbitrateStoppingClocks;
  };
  readonly valueOfComputation: {
    readonly assess: typeof import('../voc-allocation/index.js').assessVocCandidate;
    readonly plan: typeof import('../voc-allocation/index.js').planVocAllocation;
  };
  readonly healthDegeneration: HealthObservationProjector;
}

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED PORT SET
// ───────────────────────────────────────────────────────────────────

export const ModeSubstratePortSet = Object.freeze({
  eventEnvelope: true,
  authorizedLedger: true,
  replayFingerprint: true,
  receiptsAndEffectRecovery: true,
  sealedReferenceArtifacts: true,
  blindedAdjudication: true,
  hierarchicalBudgets: true,
  streamFoldGauges: true,
  locksAndFencing: true,
  continuityIdentity: true,
  dispatchReceipts: true,
  resultEnvelopes: true,
  branchLeasesAndWaves: true,
  conditionalFanIn: true,
  partialFailurePolicy: true,
  provenanceReduction: true,
  pathCoverageTermination: true,
  cycleDetection: true,
  stoppingClocks: true,
  valueOfComputation: true,
  healthDegeneration: true,
} as const satisfies Readonly<Record<keyof ModeSubstratePorts, true>>);

export type ModeSubstratePortName = keyof typeof ModeSubstratePortSet;

/** Exact port inventory used by conformance checks. */
export const REQUIRED_MODE_SUBSTRATE_PORTS = Object.freeze(
  Object.keys(ModeSubstratePortSet) as ModeSubstratePortName[],
);
