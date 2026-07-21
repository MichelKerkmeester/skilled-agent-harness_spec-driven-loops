// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Census Manifest
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  LegacyProjectionError,
  LegacyProjectionErrorCodes,
} from './legacy-projection-errors.js';

import type { JsonValue } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. MANIFEST TYPES
// ───────────────────────────────────────────────────────────────────

/** Census format retained without pretending mixed legacy trees are one file. */
export type LegacyCensusSurfaceFormat = 'json' | 'jsonl' | 'mixed';

/** Closed disposition for every censused JSON-bearing state surface. */
export type LegacyCensusDisposition = 'project' | 'retain-legacy-input';

/** Runtime-facing projection inventory derived from the frozen state census. */
export interface LegacyProjectionManifestEntry {
  readonly surfaceId: string;
  readonly format: LegacyCensusSurfaceFormat;
  readonly schemaClass: LegacyCensusSurfaceFormat;
  readonly pathTemplate: string;
  readonly legacyWriter: string;
  readonly readers: readonly string[];
  readonly fixture: string;
  readonly disposition: LegacyCensusDisposition;
  readonly foldId: string | null;
  readonly serializerId: string | null;
  readonly refreshBoundary: 'event' | 'lifecycle' | null;
  readonly orderingSemantics: string;
  readonly publicationSemantics: string;
  readonly repairSemantics: string;
  readonly archivalObligation: string;
  readonly nonProjectableReason: string | null;
  readonly laterOwner: string | null;
}

type LegacyProjectionManifestSeed = Omit<
  LegacyProjectionManifestEntry,
  | 'schemaClass'
  | 'foldId'
  | 'orderingSemantics'
  | 'publicationSemantics'
  | 'repairSemantics'
  | 'archivalObligation'
>;

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED CENSUS
// ───────────────────────────────────────────────────────────────────

const EVENT_FIXTURE = 'fixtures/event-streams.json';
const PROJECTION_FIXTURE = 'fixtures/expected-projections.json';
const CONTROL_FIXTURE = 'fixtures/control-surfaces.json';

const manifestSeeds: LegacyProjectionManifestSeed[] = [
  {
    surfaceId: 'research-config', format: 'json',
    pathTemplate: '{spec_folder}/research/deep-research-config.json',
    legacyWriter: 'deep-research', readers: ['deep-research resume'],
    fixture: CONTROL_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,
    refreshBoundary: null, nonProjectableReason: 'Immutable operator input is not ledger-derived',
    laterOwner: 'in-flight state classification',
  },
  {
    surfaceId: 'research-state', format: 'jsonl',
    pathTemplate: '{spec_folder}/research/deep-research-state.jsonl',
    legacyWriter: 'deep-research', readers: ['deep-research reducer'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'research-deltas', format: 'jsonl',
    pathTemplate: '{spec_folder}/research/deltas/iter-NNN.jsonl',
    legacyWriter: 'deep-research', readers: ['deep-research reducer'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'research-projections', format: 'mixed',
    pathTemplate: '{spec_folder}/research/{deep-research-findings-registry.json,deep-research-dashboard.md,research.md,resource-map.md}',
    legacyWriter: 'deep-research reducer', readers: ['operators and resume'],
    fixture: PROJECTION_FIXTURE, disposition: 'project', serializerId: 'legacy-pretty-json-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'research-strategy-inbox', format: 'mixed',
    pathTemplate: '{spec_folder}/research/{deep-research-strategy.md,inbox.jsonl}',
    legacyWriter: 'deep-research', readers: ['deep-research loop'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'review-config', format: 'json',
    pathTemplate: '{spec_folder}/review/deep-review-config.json',
    legacyWriter: 'deep-review', readers: ['deep-review resume'],
    fixture: CONTROL_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,
    refreshBoundary: null, nonProjectableReason: 'Immutable operator input is not ledger-derived',
    laterOwner: 'in-flight state classification',
  },
  {
    surfaceId: 'review-state', format: 'jsonl',
    pathTemplate: '{spec_folder}/review/deep-review-state.jsonl',
    legacyWriter: 'deep-review', readers: ['deep-review reducer'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'review-deltas', format: 'jsonl',
    pathTemplate: '{spec_folder}/review/deltas/iter-NNN.jsonl',
    legacyWriter: 'deep-review', readers: ['deep-review reducer'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'review-projections', format: 'mixed',
    pathTemplate: '{spec_folder}/review/{deep-review-findings-registry.json,deep-review-dashboard.md,review-report.md}',
    legacyWriter: 'deep-review reducer', readers: ['operators and resume'],
    fixture: PROJECTION_FIXTURE, disposition: 'project', serializerId: 'legacy-pretty-json-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'alignment-config-corpus', format: 'json',
    pathTemplate: '{spec_folder}/alignment/{deep-alignment-config.json,deep-alignment-corpus.json}',
    legacyWriter: 'deep-alignment', readers: ['alignment reducer and partitioner'],
    fixture: CONTROL_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,
    refreshBoundary: null, nonProjectableReason: 'Write-once corpus inputs are not ledger-derived',
    laterOwner: 'in-flight state classification',
  },
  {
    surfaceId: 'alignment-state-deltas', format: 'jsonl',
    pathTemplate: '{spec_folder}/alignment/{deep-alignment-state.jsonl,deltas/iter-NNN.jsonl}',
    legacyWriter: 'deep-alignment', readers: ['alignment reducer and convergence checker'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'alignment-projections', format: 'mixed',
    pathTemplate: '{spec_folder}/alignment/{deep-alignment-findings-registry.json,alignment-report.md}',
    legacyWriter: 'alignment reducer', readers: ['operators and resume'],
    fixture: PROJECTION_FIXTURE, disposition: 'project', serializerId: 'legacy-pretty-json-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'council-config-state', format: 'mixed',
    pathTemplate: '{spec_folder}/ai-council/{ai-council-config.json,ai-council-state.jsonl,session-state.jsonl}',
    legacyWriter: 'deep-ai-council', readers: ['council orchestrator'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-mixed-council-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'council-round-ledgers', format: 'jsonl',
    pathTemplate: '{spec_folder}/ai-council/topics/{topic_id}/rounds/{round_id}/round-state.jsonl',
    legacyWriter: 'council round state writer', readers: ['council orchestrator'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-council-jsonl-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'improvement-config-manifests', format: 'mixed',
    pathTemplate: '{spec_folder}/improvement/{agent-improvement-config.json,model-benchmark-config.json,target-manifest.jsonc,optimizer-manifest.json}',
    legacyWriter: 'deep-improvement', readers: ['loop host and promotion scripts'],
    fixture: CONTROL_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,
    refreshBoundary: null, nonProjectableReason: 'Operator and target contracts are not ledger-derived',
    laterOwner: 'in-flight state classification',
  },
  {
    surfaceId: 'improvement-ledgers', format: 'jsonl',
    pathTemplate: '{spec_folder}/improvement/{agent-improvement-state.jsonl,improvement-journal.jsonl}',
    legacyWriter: 'deep-improvement', readers: ['improvement reducer'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'improvement-derived-state', format: 'mixed',
    pathTemplate: '{spec_folder}/improvement/{agent-improvement-registry.json,agent-improvement-dashboard.md,candidate-lineage.json,mutation-coverage.json,experiment-registry.json}',
    legacyWriter: 'improvement reducer and analysis scripts',
    readers: ['loop host, trade-off detector, operators'],
    fixture: PROJECTION_FIXTURE, disposition: 'project', serializerId: 'legacy-pretty-json-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'model-benchmark-hub-output', format: 'mixed',
    pathTemplate: '.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/',
    legacyWriter: 'model-benchmark lane', readers: ['model benchmark report and promotion tools'],
    fixture: CONTROL_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,
    refreshBoundary: null, nonProjectableReason: 'Write-once benchmark evidence remains source-owned',
    laterOwner: 'in-flight state classification',
  },
  {
    surfaceId: 'skill-benchmark-output', format: 'mixed',
    pathTemplate: '{outputs_dir}/skill-benchmark-report.{json,md}',
    legacyWriter: 'skill-benchmark lane', readers: ['operator and remediation handoff'],
    fixture: CONTROL_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,
    refreshBoundary: null, nonProjectableReason: 'Write-once benchmark evidence remains source-owned',
    laterOwner: 'in-flight state classification',
  },
  {
    surfaceId: 'model-grader-cache', format: 'mixed',
    pathTemplate: '.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/{index.jsonl,*.out.md}',
    legacyWriter: 'model benchmark scorer', readers: ['model benchmark scorer'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'runtime-observability', format: 'jsonl',
    pathTemplate: '.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl',
    legacyWriter: 'runtime observability emitter', readers: ['observability projections and tests'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'fanout-ledger', format: 'jsonl',
    pathTemplate: '{artifact_root}/orchestration-status.log',
    legacyWriter: 'fanout pool', readers: ['fanout run, salvage, and audit'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'fanout-checkpoints', format: 'json',
    pathTemplate: '{artifact_root}/{orchestration-summary.json,orchestration-wait-checkpoint.json}',
    legacyWriter: 'fanout run and pool', readers: ['fanout resume and operator'],
    fixture: PROJECTION_FIXTURE, disposition: 'project', serializerId: 'legacy-pretty-json-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'behavior-benchmark-output', format: 'mixed',
    pathTemplate: '{output_dir}/{scenario_id}.{result.json,transcript.jsonl,scorecard.md}',
    legacyWriter: 'behavior benchmark runner', readers: ['benchmark grader and operator'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-benchmark-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'divergent-pivot-transactions', format: 'mixed',
    pathTemplate: '{artifact_root}/divergent/pivots/{pivot_id}/council/{config.json,state.jsonl,seats/*.md,deliberation.md,report.md}',
    legacyWriter: 'runtime divergent-pivot transaction',
    readers: ['runtime divergent-pivot resume plus research and review prior-pivot loaders'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-divergent-pivot-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'loop-guard-session-state', format: 'json',
    pathTemplate: '.opencode/skills/.loop-guard-state/{hex(session_id)}.json',
    legacyWriter: 'runtime dispatch guard shared by OpenCode and Claude adapters',
    readers: ['dispatch guard reads active session state; operators may inspect archived state'],
    fixture: CONTROL_FIXTURE, disposition: 'project', serializerId: 'legacy-compact-json-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'loop-guard-archive', format: 'json',
    pathTemplate: '.opencode/skills/.loop-guard-state/.archive/{hex(session_id)}.json',
    legacyWriter: 'runtime dispatch guard retention sweep',
    readers: ['operators only; the guard prunes by mtime and does not restore archived sessions'],
    fixture: CONTROL_FIXTURE, disposition: 'project', serializerId: 'legacy-compact-json-v1',
    refreshBoundary: 'lifecycle', nonProjectableReason: null, laterOwner: null,
  },
  {
    surfaceId: 'compiled-command-manifest', format: 'jsonl',
    pathTemplate: '.opencode/commands/deep/assets/compiled/manifest.jsonl',
    legacyWriter: 'runtime command renderer',
    readers: ['developer audit only via the compiled README validation snippet; no shipped BASE runtime reader'],
    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',
    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,
  },
];

function completeManifestEntry(
  entry: LegacyProjectionManifestSeed,
): LegacyProjectionManifestEntry {
  const isProjected = entry.disposition === 'project';
  const isAppend = entry.format === 'jsonl';
  return {
    ...entry,
    schemaClass: entry.format,
    foldId: isProjected ? `legacy-${entry.surfaceId}-fold@1` : null,
    orderingSemantics: entry.format === 'mixed'
      ? 'each artifact contract preserves its censused row or object insertion order'
      : isAppend
        ? 'verified ledger order; exact row-key insertion order'
        : 'legacy object-key insertion order per artifact contract',
    publicationSemantics: entry.format === 'mixed'
      ? 'each concrete JSONL or JSON artifact uses its exact append or replace contract'
      : isAppend
        ? 'immediate durable append after expected-head check'
        : 'durable staged atomic replacement at declared refresh boundary',
    repairSemantics: isProjected
      ? 'discard or rebuild shadow bytes from immutable BASE and verified ledger head'
      : 'source-owned input; projection never repairs or replaces it',
    archivalObligation: `preserve unchanged access for: ${entry.readers.join('; ')}`,
  };
}

const manifestEntries = manifestSeeds.map(completeManifestEntry);

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION AND EXPORT
// ───────────────────────────────────────────────────────────────────

/** Reject an empty, duplicate, ambiguous, or unowned projection inventory. */
export function validateLegacyProjectionManifest(
  entries: readonly LegacyProjectionManifestEntry[],
): void {
  if (entries.length === 0) {
    throw new LegacyProjectionError(
      LegacyProjectionErrorCodes.MANIFEST_INVALID,
      'Legacy projection manifest must contain census rows',
      { invariant: 'non-empty-manifest' },
    );
  }
  const surfaceIds = new Set<string>();
  for (const entry of entries) {
    if (entry.surfaceId.trim() === '' || surfaceIds.has(entry.surfaceId)) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.MANIFEST_INVALID,
        'Legacy projection manifest contains an empty or duplicate surface identity',
        { artifactId: entry.surfaceId, invariant: 'unique-census-surface' },
      );
    }
    surfaceIds.add(entry.surfaceId);
    const isProject = entry.disposition === 'project';
    if (
      entry.pathTemplate.trim() === ''
      || entry.legacyWriter.trim() === ''
      || entry.readers.length === 0
      || entry.schemaClass !== entry.format
      || entry.orderingSemantics.trim() === ''
      || entry.publicationSemantics.trim() === ''
      || entry.repairSemantics.trim() === ''
      || entry.archivalObligation.trim() === ''
      || (isProject && (
        entry.foldId === null
        || entry.serializerId === null
        || entry.refreshBoundary === null
      ))
      || (!isProject && (entry.nonProjectableReason === null || entry.laterOwner === null))
    ) {
      throw new LegacyProjectionError(
        LegacyProjectionErrorCodes.MANIFEST_INVALID,
        'Legacy projection manifest row is incomplete or ambiguously owned',
        { artifactId: entry.surfaceId, invariant: 'closed-census-row' },
      );
    }
  }
}

validateLegacyProjectionManifest(manifestEntries);

/** Frozen JSON-bearing census with one projection or retained-input disposition per row. */
export const LEGACY_PROJECTION_MANIFEST: readonly LegacyProjectionManifestEntry[] =
  Object.freeze(manifestEntries.map((entry) => Object.freeze({
    ...entry,
    readers: Object.freeze([...entry.readers]),
  })));

/** Stable digest that binds parity evidence to the complete projection inventory. */
export const LEGACY_PROJECTION_MANIFEST_DIGEST = sha256Bytes(canonicalBytes(
  LEGACY_PROJECTION_MANIFEST as unknown as JsonValue,
));

/** Resolve only projectable rows; retained legacy inputs never enter a fold. */
export function requireProjectableManifestEntry(
  surfaceId: string,
): LegacyProjectionManifestEntry {
  const entry = LEGACY_PROJECTION_MANIFEST.find((candidate) => candidate.surfaceId === surfaceId);
  if (!entry || entry.disposition !== 'project') {
    throw new LegacyProjectionError(
      LegacyProjectionErrorCodes.CONTRACT_UNREGISTERED,
      'Projection contract does not identify a projectable census surface',
      { artifactId: surfaceId, invariant: 'projectable-census-surface' },
    );
  }
  return entry;
}
