// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Types
// ───────────────────────────────────────────────────────────────────

import type {
  BlindedAdjudicationService,
  CandidateRegistration,
  CounterfactualResult,
  RawJudgment,
  AdjudicationRequest,
  AdjudicationVerdict,
} from '../blinded-adjudication/index.js';
import type {
  BudgetEnvelope,
  HierarchicalBudgetAuthority,
} from '../hierarchical-budgets/index.js';
import type {
  FencedLeaseCoordinator,
  FencedStateStore,
  ProtectedResourceIdentity,
} from '../locks-and-fencing/index.js';
import type {
  ModeContract,
  ModeInterfaceVersion,
} from '../mode-contracts/index.js';
import type {
  AuthorizedEvidenceWriter,
  BoundaryReceiptIssuer,
  EffectRecoveryGateway,
} from '../receipts-and-effect-recovery/index.js';
import type {
  SealedArtifactReference,
  SealedArtifactStore,
} from '../sealed-reference-artifacts/index.js';
import type { GaugeRegistry } from '../stream-fold-gauges/index.js';
import type { EventWritePreflight, JsonObject } from '../event-envelope/index.js';

export const PHASE_013_MODE_IDS = Object.freeze([
  '001-deep-research',
  '002-deep-review',
  '003-deep-ai-council',
  '004-deep-improvement-common',
  '005-agent-improvement',
  '006-model-benchmark',
  '007-skill-benchmark',
  '008-deep-alignment',
] as const);

/** Exact mode identity accepted by the manifest-complete catalog. */
export type Phase013ModeId = typeof PHASE_013_MODE_IDS[number];

export const ClosureResponsibilities = Object.freeze({
  EVIDENCE: 'evidence',
  RECEIPTS_EFFECTS: 'receipts-effects',
  ADJUDICATION: 'adjudication',
  BUDGETS: 'budgets',
  PROJECTIONS: 'projections',
} as const);

/** One recurring behavior with a single shared implementation owner. */
export type ClosureResponsibility =
  typeof ClosureResponsibilities[keyof typeof ClosureResponsibilities];

export const ClosureOwnerIds = Object.freeze({
  [ClosureResponsibilities.EVIDENCE]: 'cross-mode-closures.evidence@1',
  [ClosureResponsibilities.RECEIPTS_EFFECTS]: 'cross-mode-closures.receipts-effects@1',
  [ClosureResponsibilities.ADJUDICATION]: 'cross-mode-closures.adjudication@1',
  [ClosureResponsibilities.BUDGETS]: 'cross-mode-closures.budgets@1',
  [ClosureResponsibilities.PROJECTIONS]: 'cross-mode-closures.projections@1',
} as const satisfies Record<ClosureResponsibility, string>);

/** Fixed authority posture for every additive-dark closure invocation. */
export interface LegacyShadowPosture {
  readonly legacyAuthority: 'authoritative';
  readonly closureAuthority: 'shadow-only';
  readonly closureFailure: 'preserve-legacy-result';
}

/** Stable trace identities shared across closure-owned side effects. */
export interface ClosureCorrelationIds {
  readonly runId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
}

/** Concrete fence resource bound to one declaration from the frozen mode contract. */
export interface ClosureWriteSetBinding {
  readonly modeResource: string;
  readonly protectedResource: ProtectedResourceIdentity;
}

/** Closed policy-selected input for the shared adjudication service. */
export interface AdjudicationInvocationPlan {
  readonly adjudicationId: string;
  readonly request: AdjudicationRequest;
  readonly candidates: readonly CandidateRegistration[];
  readonly judgePolicy: Readonly<JsonObject>;
  readonly counterfactualPolicy: Readonly<JsonObject>;
}

/** Unreduced evidence returned by the shared adjudication service. */
export interface AdjudicationInvocationResult {
  readonly verdict: AdjudicationVerdict;
  readonly rawJudgments: readonly RawJudgment[];
  readonly counterfactualResults: readonly CounterfactualResult[];
}

/** Full-service invocation seam that keeps orchestration outside each mode. */
export interface BlindedAdjudicationInvocationPort {
  readonly service: BlindedAdjudicationService;
  invoke(
    service: BlindedAdjudicationService,
    plan: Readonly<AdjudicationInvocationPlan>,
  ): Promise<AdjudicationInvocationResult>;
}

/** Existing safety services bound privately for the reusable closure owners. */
export interface ClosureServicePorts {
  readonly authorization: Pick<AuthorizedEvidenceWriter, 'append'>;
  readonly receipts: {
    readonly effects: Pick<EffectRecoveryGateway, 'execute' | 'recover'>;
    readonly boundaries: Pick<BoundaryReceiptIssuer, 'issue'>;
  };
  readonly sealedArtifacts: Pick<SealedArtifactStore, 'readVerified'>;
  readonly adjudication: BlindedAdjudicationInvocationPort;
  readonly budgets: Pick<
    HierarchicalBudgetAuthority,
    'admit' | 'settle' | 'startAttempt'
  >;
  readonly gauges: Pick<
    GaugeRegistry,
    'finalize' | 'initialAccumulator' | 'reduce'
  >;
  readonly fencing: {
    readonly coordinator: FencedLeaseCoordinator;
    readonly stateStore: Pick<FencedStateStore, 'replace'>;
  };
}

/** The lifecycle value is consumed opaquely so this layer cannot redefine it. */
export interface CrossModeClosureContext {
  readonly modeContract: ModeContract;
  readonly modeIdentity: Phase013ModeId;
  readonly interfaceVersion: ModeInterfaceVersion;
  readonly lifecycleEvent: Readonly<EventWritePreflight>;
  readonly continuityIdentity: string;
  readonly sealedReferences: readonly SealedArtifactReference[];
  readonly budgetScope: Readonly<BudgetEnvelope>;
  readonly writeSet: readonly ClosureWriteSetBinding[];
  readonly posture: Readonly<LegacyShadowPosture>;
  readonly correlation: Readonly<ClosureCorrelationIds>;
}

/** Trusted inputs used to bind one immutable closure execution context. */
export interface CrossModeClosureContextInput {
  readonly modeContract: ModeContract;
  readonly lifecycleEvent: Readonly<EventWritePreflight>;
  readonly continuityIdentity: string;
  readonly sealedReferences: readonly SealedArtifactReference[];
  readonly services: ClosureServicePorts;
  readonly budgetScope: BudgetEnvelope;
  readonly writeSet: readonly ClosureWriteSetBinding[];
  readonly correlation: ClosureCorrelationIds;
}

/** Data-only specialization seam with explicit contract versions and ownership. */
export interface ModeDataPolicyOverride<TInput, TOutput> {
  readonly policyOwner: string;
  readonly inputVersion: string;
  readonly outputVersion: string;
  apply(input: Readonly<TInput>): TOutput | Promise<TOutput>;
}
