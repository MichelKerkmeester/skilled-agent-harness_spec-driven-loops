// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Mode Resource Census
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
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

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const SHIPPED_MODE_CENSUS_VERSION = 'shipped-mode-census/v1' as const;

const MODE_INTERFACE_CONTRACT =
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/'
  + '012-shared-mode-contracts-and-fixtures/001-shared-mode-interfaces/spec.md';
const CLOSURE_CONTRACT =
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/'
  + '012-shared-mode-contracts-and-fixtures/002-cross-mode-closures/spec.md';

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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
    'backend:deep-review-loop': 'backend:review-loop',
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

// ───────────────────────────────────────────────────────────────────
// 4. PATH CONSTANTS
// ───────────────────────────────────────────────────────────────────

const researchReducer =
  '.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs';
const researchPivot =
  '.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts';
const researchConfig =
  '.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json';
const reviewContract =
  '.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml';
const reviewPivot =
  '.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts';
const reviewLoopProtocol =
  '.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md';
const councilPersistence =
  '.skilled/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs';
const councilSession =
  '.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs';
const councilRoundState =
  '.skilled/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs';

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export const SHIPPED_MODE_CENSUS: readonly ModeResourceDeclaration[] = [
  declaration(
    '001-deep-research',
    [
      resource(
        'file:.skilled/skills/system-deep-loop/runtime/lib/deep-loop',
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
        'file:.skilled/skills/system-deep-loop/shared/synthesis/resource-map.cjs',
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
        'file:.skilled/skills/system-deep-loop/deep-research',
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
        'file:.skilled/skills/system-deep-loop/runtime/lib/deep-loop',
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
        'file:.skilled/skills/system-deep-loop/deep-review',
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
        'file:.skilled/skills/system-deep-loop/shared/progress/progress-record.cjs',
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
        'file:.skilled/skills/system-deep-loop/deep-ai-council',
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
        'file:.skilled/skills/system-deep-loop/runtime/lib/council',
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
] as const;

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

export function shippedModeCensus(): readonly ModeResourceDeclaration[] {
  return SHIPPED_MODE_CENSUS;
}
