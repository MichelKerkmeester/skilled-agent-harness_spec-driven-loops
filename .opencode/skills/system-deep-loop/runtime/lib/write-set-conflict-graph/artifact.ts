// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Artifact
// ───────────────────────────────────────────────────────────────────

import {
  WriteSetGraphErrorCodes,
  WriteSetGraphValidationError,
} from './errors.js';
import {
  deriveWriteSetConflictGraph,
  validateManifestNodeSet,
} from './graph.js';
import {
  compareStableText,
  stableDigest,
  stableStringify,
} from './stable-digest.js';

import type {
  ConflictEdge,
  ConflictEdgeType,
  GraphBuildInput,
  Phase013Workstream,
  WriteSetConflictGraph,
} from './types.js';

export const WRITE_SET_CONFLICT_ARTIFACT_SCHEMA_VERSION =
  'write-set-conflict-artifact/v1' as const;

export const PairClassificationFailureCodes = {
  GRAPH_NOT_READY: 'GRAPH_NOT_READY',
} as const;

export type PairClassificationFailureCode =
  typeof PairClassificationFailureCodes[keyof typeof PairClassificationFailureCodes];

export interface PairClassificationFailure {
  readonly code: PairClassificationFailureCode;
  readonly issue_codes: readonly string[];
  readonly messages: readonly string[];
}

export interface WorkstreamPairClassification {
  readonly left: Phase013Workstream;
  readonly right: Phase013Workstream;
  readonly classification: 'must-serialize' | 'parallel-safe';
  readonly edge_ids: readonly string[];
  readonly edge_types: readonly ConflictEdgeType[];
  readonly resources: readonly string[];
  readonly failure: PairClassificationFailure | null;
}

export interface WriteSetConflictArtifact {
  readonly schema_version: typeof WRITE_SET_CONFLICT_ARTIFACT_SCHEMA_VERSION;
  readonly graph: WriteSetConflictGraph;
  readonly pair_classifications: readonly WorkstreamPairClassification[];
  readonly artifact_digest: string;
}

type ArtifactPayload = Omit<WriteSetConflictArtifact, 'artifact_digest'>;

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareStableText);
}

function connectedPairEdges(
  left: string,
  right: string,
  edges: readonly ConflictEdge[],
): readonly ConflictEdge[] {
  return edges
    .filter((edge) => (edge.from === left && edge.to === right)
      || (edge.from === right && edge.to === left))
    .sort((first, second) => compareStableText(first.id, second.id));
}

function assertGraphDigest(graph: WriteSetConflictGraph): void {
  const { graph_digest: graphDigest, ...payload } = graph;
  const observedDigest = stableDigest(payload);
  if (observedDigest !== graphDigest) {
    throw new WriteSetGraphValidationError(
      WriteSetGraphErrorCodes.INVALID_GRAPH_ARTIFACT_INPUT,
      'The graph digest does not match its canonical payload.',
      { expected: graphDigest, observed: observedDigest },
    );
  }
}

function classifyPair(
  left: Phase013Workstream,
  right: Phase013Workstream,
  graph: WriteSetConflictGraph,
): WorkstreamPairClassification {
  const pairEdges = connectedPairEdges(left, right, graph.edges);
  const failure = graph.schedule.graph_state === 'fallback'
    ? {
      code: PairClassificationFailureCodes.GRAPH_NOT_READY,
      issue_codes: uniqueSorted(graph.schedule.missing_evidence.map((issue) => issue.code)),
      messages: uniqueSorted(graph.schedule.missing_evidence.map((issue) => issue.message)),
    }
    : null;
  const mustSerialize = pairEdges.length > 0 || failure !== null;

  return {
    left,
    right,
    classification: mustSerialize ? 'must-serialize' : 'parallel-safe',
    edge_ids: pairEdges.map((edge) => edge.id),
    edge_types: uniqueSorted(pairEdges.map((edge) => edge.edge_type)) as readonly ConflictEdgeType[],
    resources: uniqueSorted(pairEdges.flatMap((edge) => edge.resources)),
    failure,
  };
}

function artifactPayload(graph: WriteSetConflictGraph): ArtifactPayload {
  const workstreams = [...graph.nodes]
    .map((node) => node.id)
    .sort(compareStableText) as Phase013Workstream[];
  validateManifestNodeSet(workstreams);
  assertGraphDigest(graph);

  if (graph.schedule.graph_state === 'ready' && graph.schedule.missing_evidence.length > 0) {
    throw new WriteSetGraphValidationError(
      WriteSetGraphErrorCodes.INVALID_GRAPH_ARTIFACT_INPUT,
      'A ready graph cannot contain missing evidence.',
      { issueCodes: graph.schedule.missing_evidence.map((issue) => issue.code) },
    );
  }

  const pairClassifications: WorkstreamPairClassification[] = [];
  for (let leftIndex = 0; leftIndex < workstreams.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < workstreams.length; rightIndex += 1) {
      const left = workstreams[leftIndex];
      const right = workstreams[rightIndex];
      if (left === undefined || right === undefined) {
        throw new WriteSetGraphValidationError(
          WriteSetGraphErrorCodes.INVALID_GRAPH_ARTIFACT_INPUT,
          'A workstream pair could not be classified.',
          { leftIndex, rightIndex },
        );
      }
      pairClassifications.push(classifyPair(left, right, graph));
    }
  }

  return {
    schema_version: WRITE_SET_CONFLICT_ARTIFACT_SCHEMA_VERSION,
    graph,
    pair_classifications: pairClassifications,
  };
}

export function createWriteSetConflictArtifact(
  graph: WriteSetConflictGraph,
): WriteSetConflictArtifact {
  const payload = artifactPayload(graph);
  return {
    ...payload,
    artifact_digest: stableDigest(payload),
  };
}

export function buildWriteSetConflictArtifact(
  input: GraphBuildInput,
): WriteSetConflictArtifact {
  return createWriteSetConflictArtifact(deriveWriteSetConflictGraph(input));
}

export function serializeWriteSetConflictArtifact(
  artifact: WriteSetConflictArtifact,
): Uint8Array {
  const { artifact_digest: artifactDigest, ...payload } = artifact;
  const observedDigest = stableDigest(payload);
  if (observedDigest !== artifactDigest) {
    throw new WriteSetGraphValidationError(
      WriteSetGraphErrorCodes.INVALID_GRAPH_ARTIFACT_DIGEST,
      'The artifact digest does not match its canonical payload.',
      { expected: artifactDigest, observed: observedDigest },
    );
  }
  return new TextEncoder().encode(`${stableStringify(artifact)}\n`);
}

export function buildWriteSetConflictArtifactBytes(
  input: GraphBuildInput,
): Uint8Array {
  return serializeWriteSetConflictArtifact(buildWriteSetConflictArtifact(input));
}
