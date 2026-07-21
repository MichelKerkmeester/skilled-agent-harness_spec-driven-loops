// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Mode Resource Census
// ───────────────────────────────────────────────────────────────────

import { ResourceKinds } from './types.js';

import type {
  EvidenceBasis,
  ModeResourceDeclaration,
  ResourceAccess,
  ResourceInput,
  ResourceKind,
  ResourceMutability,
} from './types.js';

export const SHIPPED_MODE_CENSUS_VERSION = 'shipped-mode-census/v1' as const;

const MODE_INTERFACE_CONTRACT =
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/'
  + '012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces/spec.md';
const CLOSURE_CONTRACT =
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/'
  + '012-shared-mode-contracts-and-fixtures/002-cross-mode-closures/spec.md';

function resource(
  identity: string,
  kind: ResourceKind,
  access: ResourceAccess,
  mutability: ResourceMutability,
  owner: string,
  sourcePath: string,
  basis: EvidenceBasis,
  detail: string,
  scope = 'packet',
): ResourceInput {
  const canonicalAliases: Readonly<Record<string, string>> = {
    'backend:deep-alignment-review-loop': 'backend:review-loop',
    'backend:deep-review-loop': 'backend:review-loop',
    'lock:deep-alignment-review-loop': 'lock:review-loop',
    'lock:deep-review-loop': 'lock:review-loop',
  };
  return {
    identity,
    canonical_id: canonicalAliases[identity] ?? identity,
    kind,
    scope,
    mutability,
    access,
    owner,
    evidence: [{ source_path: sourcePath, basis, detail }],
  };
}

function declaration(
  id: string,
  readSet: readonly ResourceInput[],
  writeSet: readonly ResourceInput[],
  sharedState: readonly ResourceInput[],
  sourceRefs: readonly string[],
  migrationDependencies: readonly string[] = [],
): ModeResourceDeclaration {
  return {
    id,
    modeSlug: id,
    readSet,
    writeSet,
    sharedState,
    migrationDependencies,
    contractRefs: [MODE_INTERFACE_CONTRACT, CLOSURE_CONTRACT],
    sourceRefs,
  };
}

const researchReducer =
  '.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs';
const researchPivot =
  '.opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts';
const researchConfig =
  '.opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json';
const reviewContract =
  '.opencode/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml';
const reviewPivot =
  '.opencode/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts';
const reviewLoopProtocol =
  '.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md';
const councilPersistence =
  '.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs';
const councilSession =
  '.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs';
const councilRoundState =
  '.opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs';
const commonLoopHost =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs';
const commonJournal =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs';
const commonPromotion =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs';
const commonPacketContract =
  '.opencode/skills/system-deep-loop/deep-improvement/SKILL.md';
const agentScorer =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs';
const agentProfile =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs';
const modelRunner =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs';
const modelCache =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs';
const skillRunner =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs';
const skillAblation =
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs';
const alignmentWiring =
  '.opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md';
const alignmentConvergence =
  '.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs';
const alignmentReducer =
  '.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs';

export const SHIPPED_MODE_CENSUS: readonly ModeResourceDeclaration[] = [
  declaration(
    '001-deep-research',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'runtime:deep-loop',
        researchPivot,
        'import-census',
        'The pivot implementation imports the shared deep-loop candidate and divergence services.',
        'repository',
      ),
      resource(
        'file:.opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'runtime:shared-synthesis',
        researchReducer,
        'import-census',
        'The reducer imports the shared synthesis resource-map emitter.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-research',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-research',
        researchReducer,
        'write-census',
        'The migration owns the shipped deep-research packet surface.',
        'repository',
      ),
      resource(
        'state:{packet}/research/deep-research-state.jsonl',
        ResourceKinds.STATE,
        'write',
        'append-only',
        'mode:deep-research',
        researchReducer,
        'write-census',
        'The reducer appends the canonical research state log.',
      ),
      resource(
        'artifact:{packet}/research/iterations',
        ResourceKinds.ARTIFACT,
        'write',
        'write-once',
        'mode:deep-research',
        researchConfig,
        'contract-declaration',
        'The shipped config marks iteration artifacts write-once.',
      ),
      resource(
        'artifact:{packet}/research/research.md',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:deep-research',
        researchConfig,
        'contract-declaration',
        'The shipped config assigns mutable synthesis ownership to the workflow.',
      ),
    ],
    [],
    [researchReducer, researchPivot, researchConfig],
  ),
  declaration(
    '002-deep-review',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'runtime:deep-loop',
        reviewPivot,
        'import-census',
        'The review pivot imports the shared candidate and divergence services.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-review',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-review',
        reviewContract,
        'contract-declaration',
        'The migration owns the shipped deep-review packet surface.',
        'repository',
      ),
      resource(
        'state:{packet}/review/deep-review-state.jsonl',
        ResourceKinds.STATE,
        'write',
        'append-only',
        'mode:deep-review',
        reviewContract,
        'contract-declaration',
        'The mode contract declares the append-only review state log.',
      ),
      resource(
        'artifact:{packet}/review/review-report.md',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:deep-review',
        reviewContract,
        'contract-declaration',
        'The mode contract declares the workflow-owned review report.',
      ),
    ],
    [
      resource(
        'backend:deep-review-loop',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:review-loop',
        reviewLoopProtocol,
        'contract-declaration',
        'The protocol uses the shared convergence, coverage, and reducer loop.',
        'repository',
      ),
      resource(
        'lock:deep-review-loop',
        ResourceKinds.LOCK,
        'write',
        'mutable',
        'runtime:review-loop',
        reviewLoopProtocol,
        'contract-declaration',
        'The loop protocol requires single-writer loop coordination.',
        'repository',
      ),
    ],
    [reviewContract, reviewPivot, reviewLoopProtocol],
  ),
  declaration(
    '003-deep-ai-council',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/shared/progress/progress-record.cjs',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'runtime:shared-progress',
        councilPersistence,
        'import-census',
        'Council persistence imports the shared progress record contract.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-ai-council',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-ai-council',
        councilPersistence,
        'write-census',
        'The migration owns the shipped council packet surface.',
        'repository',
      ),
      resource(
        'file:.opencode/skills/system-deep-loop/runtime/lib/council',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-ai-council',
        councilSession,
        'import-census',
        'The session orchestrator consumes and owns council-specific runtime helpers.',
        'repository',
      ),
      resource(
        'state:{packet}/ai-council/ai-council-state.jsonl',
        ResourceKinds.STATE,
        'write',
        'append-only',
        'mode:deep-ai-council',
        councilPersistence,
        'write-census',
        'Council persistence appends artifact and completion events.',
      ),
      resource(
        'artifact:{packet}/ai-council',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:deep-ai-council',
        councilPersistence,
        'write-census',
        'The scoped writer persists seats, critiques, deliberations, and reports.',
      ),
    ],
    [
      resource(
        'backend:council-graph',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:council-graph',
        councilRoundState,
        'write-census',
        'Council state and graph projections use council-owned persistence.',
        'repository',
      ),
    ],
    [councilPersistence, councilSession, councilRoundState],
  ),
  declaration(
    '004-deep-improvement-common',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/SKILL.md',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'mode:deep-improvement-common',
        commonPacketContract,
        'contract-declaration',
        'The common migration is bounded by the shipped improvement packet contract.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/shared',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-improvement-common',
        commonLoopHost,
        'import-census',
        'The common loop host dispatches every improvement variant.',
        'repository',
      ),
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/lib',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-improvement-common',
        commonPromotion,
        'import-census',
        'Shared promotion gates and profile resolution are common-owned.',
        'repository',
      ),
    ],
    [
      resource(
        'backend:deep-improvement-score',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:deep-improvement-common',
        commonJournal,
        'write-census',
        'The shared improvement journal is the cross-variant scoring state surface.',
        'repository',
      ),
    ],
    [commonPacketContract, commonLoopHost, commonJournal, commonPromotion],
  ),
  declaration(
    '005-agent-improvement',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/shared',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'mode:deep-improvement-common',
        commonLoopHost,
        'import-census',
        'The agent lane executes through the common loop host.',
        'repository',
      ),
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/lib',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'mode:deep-improvement-common',
        agentProfile,
        'import-census',
        'Agent profiles consume common profile and promotion helpers.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:agent-improvement',
        agentScorer,
        'write-census',
        'The agent migration owns its scorer, profile, lineage, and rollback scripts.',
        'repository',
      ),
      resource(
        'artifact:{packet}/improvement/agent',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:agent-improvement',
        agentScorer,
        'write-census',
        'The agent scorer writes candidate score and lineage outputs.',
      ),
    ],
    [
      resource(
        'backend:deep-improvement-score',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:deep-improvement-common',
        commonJournal,
        'import-census',
        'The agent lane records results through the shared improvement journal.',
        'repository',
      ),
    ],
    [commonLoopHost, commonJournal, agentScorer, agentProfile],
    ['004-deep-improvement-common'],
  ),
  declaration(
    '006-model-benchmark',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/shared',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'mode:deep-improvement-common',
        modelRunner,
        'import-census',
        'Model benchmarking consumes shared fixtures, journal, and reduction helpers.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:model-benchmark',
        modelRunner,
        'write-census',
        'The model migration owns runners, scorers, profiles, and reports.',
        'repository',
      ),
      resource(
        'artifact:{packet}/improvement/model-benchmark',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:model-benchmark',
        modelRunner,
        'write-census',
        'The runner writes benchmark state, reports, and materialized results.',
      ),
      resource(
        'generated-output:{packet}/improvement/model-benchmark/cache',
        ResourceKinds.GENERATED_OUTPUT,
        'write',
        'append-only',
        'mode:model-benchmark',
        modelCache,
        'write-census',
        'The grader cache appends indexed blobs under run-scoped output roots.',
      ),
    ],
    [
      resource(
        'backend:deep-improvement-score',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:deep-improvement-common',
        commonJournal,
        'import-census',
        'The model lane records results through the shared improvement journal.',
        'repository',
      ),
    ],
    [commonLoopHost, commonJournal, modelRunner, modelCache],
    ['004-deep-improvement-common'],
  ),
  declaration(
    '007-skill-benchmark',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/shared',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'mode:deep-improvement-common',
        skillRunner,
        'import-census',
        'Skill benchmarking executes through the common loop and report substrate.',
        'repository',
      ),
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'mode:model-benchmark',
        skillAblation,
        'import-census',
        'The skill ablation path imports the model grader harness.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:skill-benchmark',
        skillRunner,
        'write-census',
        'The skill migration owns router replay, executors, scoring, and reports.',
        'repository',
      ),
      resource(
        'artifact:{packet}/improvement/skill-benchmark',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:skill-benchmark',
        skillRunner,
        'write-census',
        'The skill runner writes JSON and Markdown benchmark reports.',
      ),
    ],
    [
      resource(
        'backend:deep-improvement-score',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:deep-improvement-common',
        commonJournal,
        'import-census',
        'The skill lane records results through the shared improvement journal.',
        'repository',
      ),
    ],
    [commonLoopHost, commonJournal, skillRunner, skillAblation],
    ['004-deep-improvement-common'],
  ),
  declaration(
    '008-deep-alignment',
    [
      resource(
        'file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop',
        ResourceKinds.FILE,
        'read',
        'mutable',
        'runtime:deep-loop',
        alignmentConvergence,
        'import-census',
        'Alignment resolves packet artifacts through the shared deep-loop runtime.',
        'repository',
      ),
    ],
    [
      resource(
        'file:.opencode/skills/system-deep-loop/deep-alignment',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-alignment',
        alignmentWiring,
        'contract-declaration',
        'The migration owns the shipped alignment packet surface.',
        'repository',
      ),
      resource(
        'file:.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs',
        ResourceKinds.FILE,
        'write',
        'mutable',
        'mode:deep-alignment',
        alignmentReducer,
        'write-census',
        'The alignment migration owns its shared-runtime reducer entry point.',
        'repository',
      ),
      resource(
        'state:{packet}/alignment/deep-alignment-state.jsonl',
        ResourceKinds.STATE,
        'write',
        'append-only',
        'mode:deep-alignment',
        alignmentWiring,
        'contract-declaration',
        'The state machine appends alignment iteration state.',
      ),
      resource(
        'artifact:{packet}/alignment/alignment-report.md',
        ResourceKinds.ARTIFACT,
        'write',
        'mutable',
        'mode:deep-alignment',
        alignmentWiring,
        'contract-declaration',
        'The shared-runtime reducer emits the alignment report.',
      ),
    ],
    [
      resource(
        'backend:deep-alignment-review-loop',
        ResourceKinds.BACKEND,
        'write',
        'mutable',
        'runtime:review-loop',
        alignmentWiring,
        'contract-declaration',
        'Alignment reuses the iterative review convergence and coverage substrate.',
        'repository',
      ),
      resource(
        'lock:deep-alignment-review-loop',
        ResourceKinds.LOCK,
        'write',
        'mutable',
        'runtime:review-loop',
        alignmentWiring,
        'contract-declaration',
        'Alignment uses the shared single-writer loop coordination path.',
        'repository',
      ),
    ],
    [alignmentWiring, alignmentConvergence, alignmentReducer],
  ),
] as const;

export function shippedModeCensus(): readonly ModeResourceDeclaration[] {
  return SHIPPED_MODE_CENSUS;
}
