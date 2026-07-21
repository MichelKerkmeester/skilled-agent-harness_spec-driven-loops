// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Derivation
// ───────────────────────────────────────────────────────────────────

import { posix } from 'node:path';

import {
  buildAliasIndex,
  canonicalizeResource,
  normalizeComparablePath,
  normalizeResourceIdentity,
} from './canonicalize.js';
import {
  WriteSetGraphErrorCodes,
  WriteSetGraphValidationError,
} from './errors.js';
import { createDeterministicSchedule } from './scheduler.js';
import { compareStableText, stableDigest, stableStringify } from './stable-digest.js';
import {
  PHASE_013_WORKSTREAMS,
  ResourceKinds,
  WRITE_SET_GRAPH_SCHEMA_VERSION,
} from './types.js';

import type {
  CanonicalResource,
  ConflictEdge,
  ConflictEdgeType,
  GeneratedSourceDigest,
  GraphBuildInput,
  GraphNode,
  GraphPolicy,
  GraphReuseDecision,
  GraphReuseInput,
  GraphValidationIssue,
  IndependentAssertion,
  ModeResourceDeclaration,
  ResourceEvidence,
  ResourceInput,
  SourceDigestInput,
  WriteSetConflictGraph,
} from './types.js';

export const GRAPH_CONTRACT_SOURCE_PATHS = [
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/'
    + '012-shared-mode-contracts-and-fixtures/spec.md',
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/'
    + '012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md',
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md',
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json',
  '.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/canonicalize.ts',
  '.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts',
  '.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts',
  '.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts',
  '.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/stable-digest.ts',
  '.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts',
] as const;

const SEQUENCING_SOURCE = GRAPH_CONTRACT_SOURCE_PATHS[2];
const REQUIRED_DEPENDENCIES = new Map<string, readonly string[]>([
  ['005-agent-improvement', ['004-deep-improvement-common']],
  ['006-model-benchmark', ['004-deep-improvement-common']],
  ['007-skill-benchmark', ['004-deep-improvement-common']],
]);
const REVIEW_NODE_ID = '002-deep-review';
const ALIGNMENT_NODE_ID = '008-deep-alignment';
const RESEARCH_NODE_ID = '001-deep-research';
const COUNCIL_NODE_ID = '003-deep-ai-council';
interface MutableEdge {
  from: string;
  to: string;
  edgeType: ConflictEdgeType;
  edgeOrigin: ConflictEdge['edge_origin'];
  resources: Set<string>;
  serialization: ConflictEdge['serialization'];
  reason: string;
  evidence: Map<string, ResourceEvidence>;
}

function compareText(left: string, right: string): number {
  return compareStableText(left, right);
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareText);
}

function compareCanonicalResources(left: CanonicalResource, right: CanonicalResource): number {
  const canonicalOrder = compareText(left.canonical_id, right.canonical_id);
  if (canonicalOrder !== 0) return canonicalOrder;
  const identityOrder = compareText(left.identity, right.identity);
  return identityOrder !== 0
    ? identityOrder
    : compareText(stableStringify(left), stableStringify(right));
}

function normalizeSourcePath(sourcePath: string): string {
  return posix.normalize(sourcePath.trim().replaceAll('\\', '/')).replace(/^\.\//, '');
}

function normalizeDigest(digest: string): string {
  const normalized = digest.trim().toLowerCase();
  return normalized.startsWith('sha256:') ? normalized : `sha256:${normalized}`;
}

function isValidDigest(digest: string): boolean {
  return /^sha256:[0-9a-f]{64}$/.test(digest);
}

function graphIssue(
  code: string,
  message: string,
  nodeIds: readonly string[] = [],
  resources: readonly string[] = [],
  sourcePaths: readonly string[] = [],
): GraphValidationIssue {
  return {
    code,
    message,
    node_ids: uniqueSorted(nodeIds),
    resources: uniqueSorted(resources),
    source_paths: uniqueSorted(sourcePaths.map(normalizeSourcePath)),
  };
}

function exactNodeSetProblems(values: readonly string[]): {
  readonly duplicates: readonly string[];
  readonly missing: readonly string[];
  readonly extra: readonly string[];
} {
  const expected = new Set<string>(PHASE_013_WORKSTREAMS);
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return {
    duplicates: [...duplicates].sort(compareText),
    missing: PHASE_013_WORKSTREAMS.filter((value) => !seen.has(value)),
    extra: [...seen].filter((value) => !expected.has(value)).sort(compareText),
  };
}

export function validateManifestNodeSet(workstreams: readonly string[]): void {
  const problems = exactNodeSetProblems(workstreams);
  if (problems.duplicates.length + problems.missing.length + problems.extra.length > 0) {
    throw new WriteSetGraphValidationError(
      WriteSetGraphErrorCodes.INVALID_MANIFEST_NODE_SET,
      'The phase workstream set does not equal the frozen eight-node manifest contract.',
      problems,
    );
  }
}

function validateDeclarations(declarations: readonly ModeResourceDeclaration[]): void {
  const ids = declarations.map((declaration) => declaration.id);
  const problems = exactNodeSetProblems(ids);
  const renamed = declarations
    .filter((declaration) => declaration.modeSlug !== declaration.id)
    .map((declaration) => `${declaration.id}->${declaration.modeSlug}`)
    .sort(compareText);
  if (problems.duplicates.length + problems.missing.length + problems.extra.length + renamed.length > 0) {
    throw new WriteSetGraphValidationError(
      WriteSetGraphErrorCodes.INVALID_MODE_DECLARATIONS,
      'Mode declarations do not map one-to-one to the frozen manifest nodes.',
      { ...problems, renamed },
    );
  }
}

function graphPolicy(input: GraphBuildInput['policy']): GraphPolicy {
  const rawPolicy = input as Readonly<Record<string, unknown>> | undefined;
  if (rawPolicy?.unknown_as_conflict === false
    || (rawPolicy?.default_schedule !== undefined
      && rawPolicy.default_schedule !== 'serial-single-writer')
    || (Array.isArray(rawPolicy?.manual_edge_overrides)
      && rawPolicy.manual_edge_overrides.length > 0)) {
    throw new WriteSetGraphValidationError(
      WriteSetGraphErrorCodes.INVALID_POLICY,
      'The graph policy cannot disable fail-closed unknown handling or its serial default.',
    );
  }
  return {
    unknown_as_conflict: true,
    default_schedule: 'serial-single-writer',
    manual_edge_overrides: [],
  };
}

function allResources(declaration: ModeResourceDeclaration): readonly ResourceInput[] {
  return [...declaration.readSet, ...declaration.writeSet, ...declaration.sharedState];
}

export function collectRequiredSourcePaths(
  declarations: readonly ModeResourceDeclaration[],
  additionalPaths: readonly string[] = [],
): readonly string[] {
  return uniqueSorted([
    ...GRAPH_CONTRACT_SOURCE_PATHS,
    ...additionalPaths,
    ...declarations.flatMap((declaration) => [
      ...declaration.contractRefs,
      ...declaration.sourceRefs,
      ...allResources(declaration).flatMap(
        (resource) => resource.evidence.map((entry) => entry.source_path),
      ),
    ]),
  ].map(normalizeSourcePath));
}

function generatedSources(
  sourceInputs: readonly SourceDigestInput[],
  requiredPaths: readonly string[],
): { readonly sources: readonly GeneratedSourceDigest[]; readonly issues: readonly GraphValidationIssue[] } {
  const issues: GraphValidationIssue[] = [];
  const byPath = new Map<string, GeneratedSourceDigest>();

  for (const input of sourceInputs) {
    const sourcePath = normalizeSourcePath(input.path);
    const digest = normalizeDigest(input.digest);
    const observedDigest = normalizeDigest(input.observedDigest);
    const validDigests = isValidDigest(digest) && isValidDigest(observedDigest);
    const existing = byPath.get(sourcePath);
    if (existing && (existing.digest !== digest || existing.observed_digest !== observedDigest)) {
      issues.push(graphIssue(
        'CONTRADICTORY_SOURCE_DIGEST',
        `Source ${sourcePath} has multiple incompatible digest declarations.`,
        [],
        [],
        [sourcePath],
      ));
      continue;
    }
    byPath.set(sourcePath, {
      path: sourcePath,
      digest,
      observed_digest: observedDigest,
      status: validDigests && digest === observedDigest ? 'fresh' : 'stale',
    });
    if (!validDigests) {
      issues.push(graphIssue(
        'INVALID_SOURCE_DIGEST',
        `Source ${sourcePath} does not have two valid sha256 digests.`,
        [],
        [],
        [sourcePath],
      ));
    } else if (digest !== observedDigest) {
      issues.push(graphIssue(
        'STALE_SOURCE_DIGEST',
        `Source ${sourcePath} changed after graph generation.`,
        [],
        [],
        [sourcePath],
      ));
    }
  }

  for (const requiredPath of requiredPaths) {
    const sourcePath = normalizeSourcePath(requiredPath);
    const source = byPath.get(sourcePath);
    if (!source) {
      issues.push(graphIssue(
        'MISSING_SOURCE_DIGEST',
        `Required source ${sourcePath} has no digest evidence.`,
        [],
        [],
        [sourcePath],
      ));
      byPath.set(sourcePath, {
        path: sourcePath,
        digest: 'sha256:unknown',
        observed_digest: 'sha256:unknown',
        status: 'stale',
      });
    }
  }

  return {
    sources: [...byPath.values()].sort((left, right) => compareText(left.path, right.path)),
    issues,
  };
}

function sourceDigestForNode(
  declaration: ModeResourceDeclaration,
  sources: readonly GeneratedSourceDigest[],
): string {
  const relevantPaths = new Set(collectRequiredSourcePaths([declaration], []));
  const relevantSources = sources.filter((source) => relevantPaths.has(source.path));
  return stableDigest(relevantSources.map((source) => ({ path: source.path, digest: source.digest })));
}

function canonicalizeNode(
  declaration: ModeResourceDeclaration,
  sources: readonly GeneratedSourceDigest[],
  aliases: ReturnType<typeof buildAliasIndex>,
): { readonly node: GraphNode; readonly issues: readonly GraphValidationIssue[] } {
  const issues: GraphValidationIssue[] = [];
  const canonicalizeSet = (
    resources: readonly ResourceInput[],
    access: 'read' | 'write',
  ): readonly CanonicalResource[] => resources.map((resource) => {
    const result = canonicalizeResource(resource, access, declaration.id, aliases);
    issues.push(...result.issues);
    return result.resource;
  }).sort(compareCanonicalResources);

  if (declaration.readSet.length === 0 || declaration.writeSet.length === 0) {
    issues.push(graphIssue(
      'INCOMPLETE_ACCESS_DECLARATION',
      `Node ${declaration.id} must declare at least one canonical read and write resource.`,
      [declaration.id],
    ));
  }
  if (declaration.sourceRefs.length === 0) {
    issues.push(graphIssue(
      'MISSING_NODE_SOURCE_REFS',
      `Node ${declaration.id} has no census source references.`,
      [declaration.id],
    ));
  }

  const requiredDependencies = REQUIRED_DEPENDENCIES.get(declaration.id) ?? [];
  return {
    node: {
      id: declaration.id,
      mode_slug: declaration.modeSlug,
      read_set: canonicalizeSet(declaration.readSet, 'read'),
      write_set: canonicalizeSet(declaration.writeSet, 'write'),
      shared_state: declaration.sharedState.map((resource) => {
        const result = canonicalizeResource(resource, undefined, declaration.id, aliases);
        issues.push(...result.issues);
        return result.resource;
      }).sort(compareCanonicalResources),
      migration_dependencies: uniqueSorted([
        ...declaration.migrationDependencies,
        ...requiredDependencies,
      ]),
      contract_refs: uniqueSorted(declaration.contractRefs.map(normalizeSourcePath)),
      source_refs: uniqueSorted(declaration.sourceRefs.map(normalizeSourcePath)),
      source_digest: sourceDigestForNode(declaration, sources),
    },
    issues,
  };
}

interface NodeResourceBucket {
  readonly canonicalIds: Set<string>;
  readonly entries: CanonicalResource[];
}

function nodeResourceMap(node: GraphNode): ReadonlyMap<string, NodeResourceBucket> {
  const resources = new Map<string, NodeResourceBucket>();
  for (const resource of [...node.read_set, ...node.write_set, ...node.shared_state]) {
    const key = normalizeComparablePath(resource.canonical_id) ?? resource.canonical_id;
    const bucket = resources.get(key) ?? { canonicalIds: new Set<string>(), entries: [] };
    bucket.canonicalIds.add(resource.canonical_id);
    bucket.entries.push(resource);
    resources.set(key, bucket);
  }
  return resources;
}

function evidenceKey(evidence: ResourceEvidence): string {
  return stableStringify(evidence);
}

function edgeKey(from: string, to: string, edgeType: ConflictEdgeType): string {
  return `${from}\u0000${to}\u0000${edgeType}`;
}

function addEdge(
  edges: Map<string, MutableEdge>,
  input: Omit<MutableEdge, 'resources' | 'evidence'> & {
    readonly resources: readonly string[];
    readonly evidence: readonly ResourceEvidence[];
  },
): void {
  const isDirected = input.edgeType === 'hard-order';
  const [from, to] = isDirected || compareText(input.from, input.to) <= 0
    ? [input.from, input.to]
    : [input.to, input.from];
  const key = edgeKey(from, to, input.edgeType);
  const existing = edges.get(key);
  if (!existing) {
    edges.set(key, {
      ...input,
      from,
      to,
      resources: new Set(input.resources),
      evidence: new Map(input.evidence.map((entry) => [evidenceKey(entry), entry])),
    });
    return;
  }
  for (const resource of input.resources) existing.resources.add(resource);
  for (const evidence of input.evidence) existing.evidence.set(evidenceKey(evidence), evidence);
  if (input.edgeOrigin === 'required-constraint') existing.edgeOrigin = input.edgeOrigin;
  else if (input.edgeOrigin === 'unknown-widening' && existing.edgeOrigin === 'derived') {
    existing.edgeOrigin = input.edgeOrigin;
  }
}

function pathResourceOverlap(left: string, right: string): boolean {
  const leftComparable = normalizeComparablePath(left);
  const rightComparable = normalizeComparablePath(right);
  if (leftComparable === undefined || rightComparable === undefined) return left === right;
  if (leftComparable === rightComparable) return true;
  const leftSeparator = leftComparable.indexOf(':');
  const rightSeparator = rightComparable.indexOf(':');
  const leftNamespace = leftComparable.slice(0, leftSeparator);
  const rightNamespace = rightComparable.slice(0, rightSeparator);
  if (leftNamespace !== rightNamespace) return false;
  const leftPath = leftComparable.slice(leftSeparator + 1);
  const rightPath = rightComparable.slice(rightSeparator + 1);
  if (leftPath === rightPath) return true;
  if (leftPath === '/' || rightPath === '/') return true;
  return leftPath.startsWith(`${rightPath}/`) || rightPath.startsWith(`${leftPath}/`);
}

function isPathResourceIdentity(identity: string): boolean {
  return normalizeComparablePath(identity) !== undefined;
}

function derivedConflictEdges(nodes: readonly GraphNode[]): {
  readonly edges: Map<string, MutableEdge>;
  readonly issues: readonly GraphValidationIssue[];
} {
  const edges = new Map<string, MutableEdge>();
  const issues: GraphValidationIssue[] = [];
  const resourceMaps = new Map(nodes.map((node) => [node.id, nodeResourceMap(node)] as const));

  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    const left = nodes[leftIndex] as GraphNode;
    const leftResources = resourceMaps.get(left.id) as ReadonlyMap<string, NodeResourceBucket>;
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      const right = nodes[rightIndex] as GraphNode;
      const rightResources = resourceMaps.get(right.id) as ReadonlyMap<string, NodeResourceBucket>;
      const overlapping = [...leftResources.keys()].flatMap((leftCanonicalId) =>
        [...rightResources.keys()]
          .filter((rightCanonicalId) => pathResourceOverlap(leftCanonicalId, rightCanonicalId))
          .map((rightCanonicalId) => [leftCanonicalId, rightCanonicalId] as const))
        .sort(([leftA, rightA], [leftB, rightB]) => {
          const leftOrder = compareText(leftA, leftB);
          return leftOrder !== 0 ? leftOrder : compareText(rightA, rightB);
        });

      for (const [leftCanonicalId, rightCanonicalId] of overlapping) {
        const leftBucket = leftResources.get(leftCanonicalId);
        const rightBucket = rightResources.get(rightCanonicalId);
        const leftEntries = leftBucket?.entries ?? [];
        const rightEntries = rightBucket?.entries ?? [];
        const conflictResources = uniqueSorted([
          ...(leftBucket?.canonicalIds ?? []),
          ...(rightBucket?.canonicalIds ?? []),
        ]);
        const leftWrites = leftEntries.some((entry) => entry.access === 'write');
        const rightWrites = rightEntries.some((entry) => entry.access === 'write');
        const leftReads = leftEntries.some((entry) => entry.access === 'read');
        const rightReads = rightEntries.some((entry) => entry.access === 'read');
        const evidence = [...leftEntries, ...rightEntries].flatMap((entry) => entry.evidence);
        const resourceKind = leftCanonicalId === rightCanonicalId
          ? [...leftEntries, ...rightEntries][0]?.kind
          : undefined;

        if (leftWrites && rightWrites) {
          addEdge(edges, {
            from: left.id,
            to: right.id,
            edgeType: 'write-write',
            edgeOrigin: 'derived',
            resources: conflictResources,
            serialization: 'mutual-exclusion',
            reason: 'Both nodes write overlapping canonical resources.',
            evidence,
          });
        }
        if ((leftWrites && rightReads) || (rightWrites && leftReads)) {
          addEdge(edges, {
            from: left.id,
            to: right.id,
            edgeType: 'write-read',
            edgeOrigin: 'derived',
            resources: conflictResources,
            serialization: 'mutual-exclusion',
            reason: 'One node writes a canonical resource consumed by the other.',
            evidence,
          });
        }
        if (resourceKind === ResourceKinds.BACKEND && (leftWrites || rightWrites)) {
          addEdge(edges, {
            from: left.id,
            to: right.id,
            edgeType: 'shared-backend',
            edgeOrigin: 'derived',
            resources: conflictResources,
            serialization: 'mutual-exclusion',
            reason: 'The nodes share a mutable backend reached by at least one writer.',
            evidence,
          });
        }
        if (resourceKind === ResourceKinds.LOCK && (leftWrites || rightWrites)) {
          addEdge(edges, {
            from: left.id,
            to: right.id,
            edgeType: 'fence',
            edgeOrigin: 'derived',
            resources: conflictResources,
            serialization: 'mutual-exclusion',
            reason: 'The nodes share a canonical single-writer fence.',
            evidence,
          });
        }
      }
    }
  }

  for (const node of nodes) {
    const unknownResources = [...node.read_set, ...node.write_set, ...node.shared_state]
      .filter((resource) => resource.kind === ResourceKinds.UNKNOWN
        || resource.mutability === 'unknown'
        || resource.canonical_id.startsWith('unknown:'));
    for (const resource of unknownResources) {
      for (const other of nodes.filter((candidate) => candidate.id !== node.id)) {
        addEdge(edges, {
          from: node.id,
          to: other.id,
          edgeType: 'shared-backend',
          edgeOrigin: 'unknown-widening',
          resources: [resource.canonical_id],
          serialization: 'mutual-exclusion',
          reason: 'Unknown resource evidence is conservatively treated as shared mutable state.',
          evidence: resource.evidence,
        });
      }
    }
  }

  const metadataByCanonical = new Map<string, CanonicalResource>();
  const canonicalByIdentity = new Map<string, {
    readonly nodeId: string;
    readonly resource: CanonicalResource;
  }>();
  const canonicalByComparablePath = new Map<string, {
    readonly nodeId: string;
    readonly resource: CanonicalResource;
  }>();
  for (const node of nodes) {
    for (const resource of [...node.read_set, ...node.write_set, ...node.shared_state]) {
      if (resource.canonical_id.startsWith('unknown:')) continue;
      const identityKey = normalizeComparablePath(resource.identity) ?? resource.identity;
      const canonicalComparable = normalizeComparablePath(resource.canonical_id);
      const identityMatch = canonicalByIdentity.get(identityKey);
      const identityMatchCanonicalComparable = identityMatch
        ? normalizeComparablePath(identityMatch.resource.canonical_id)
        : undefined;
      const canonicalIdsMatch = canonicalComparable !== undefined
        || identityMatchCanonicalComparable !== undefined
        ? canonicalComparable !== undefined
          && identityMatchCanonicalComparable !== undefined
          && canonicalComparable === identityMatchCanonicalComparable
        : identityMatch?.resource.canonical_id === resource.canonical_id;
      if (identityMatch && !canonicalIdsMatch) {
        issues.push(graphIssue(
          'CONTRADICTORY_CANONICAL_ID',
          `Resource ${resource.identity} maps to multiple canonical identities.`,
          [identityMatch.nodeId, node.id],
          [identityMatch.resource.canonical_id, resource.canonical_id],
          [...identityMatch.resource.evidence, ...resource.evidence].map((entry) => entry.source_path),
        ));
        if (identityMatch.nodeId !== node.id) {
          addEdge(edges, {
            from: identityMatch.nodeId,
            to: node.id,
            edgeType: 'shared-backend',
            edgeOrigin: 'unknown-widening',
            resources: [identityMatch.resource.canonical_id, resource.canonical_id],
            serialization: 'mutual-exclusion',
            reason: 'One resource identity maps to contradictory canonical identities.',
            evidence: [...identityMatch.resource.evidence, ...resource.evidence],
          });
        }
      } else if (!identityMatch) {
        canonicalByIdentity.set(identityKey, { nodeId: node.id, resource });
      }
      if (isPathResourceIdentity(resource.canonical_id)) {
        const comparableId = normalizeComparablePath(resource.canonical_id) as string;
        const pathMatch = canonicalByComparablePath.get(comparableId);
        if (pathMatch && pathMatch.resource.canonical_id !== resource.canonical_id) {
          issues.push(graphIssue(
            'UNRESOLVED_RESOURCE_ALIAS',
            `Path resources ${pathMatch.resource.canonical_id} and ${resource.canonical_id} normalize to the same comparable path.`,
            [pathMatch.nodeId, node.id],
            [pathMatch.resource.canonical_id, resource.canonical_id],
            [...pathMatch.resource.evidence, ...resource.evidence].map((entry) => entry.source_path),
          ));
          if (pathMatch.nodeId !== node.id) {
            addEdge(edges, {
              from: pathMatch.nodeId,
              to: node.id,
              edgeType: 'shared-backend',
              edgeOrigin: 'unknown-widening',
              resources: [pathMatch.resource.canonical_id, resource.canonical_id],
              serialization: 'mutual-exclusion',
              reason: 'Distinct path identities that normalize to one comparable path may name the same resource.',
              evidence: [...pathMatch.resource.evidence, ...resource.evidence],
            });
          }
        } else if (!pathMatch) {
          canonicalByComparablePath.set(comparableId, { nodeId: node.id, resource });
        }
      }
      const metadataKey = canonicalComparable ?? resource.canonical_id;
      const existing = metadataByCanonical.get(metadataKey);
      if (!existing) {
        metadataByCanonical.set(metadataKey, resource);
        continue;
      }
      if (existing.kind !== resource.kind
        || existing.scope !== resource.scope
        || existing.mutability !== resource.mutability
        || existing.owner !== resource.owner) {
        issues.push(graphIssue(
          'CONTRADICTORY_RESOURCE_OWNERSHIP',
          `Canonical resource ${resource.canonical_id} has inconsistent metadata or ownership.`,
          [node.id],
          [resource.canonical_id],
          [...existing.evidence, ...resource.evidence].map((entry) => entry.source_path),
        ));
      }
    }
  }

  return { edges, issues };
}

function applyHardOrderEdges(
  nodes: readonly GraphNode[],
  edges: Map<string, MutableEdge>,
): readonly GraphValidationIssue[] {
  const issues: GraphValidationIssue[] = [];
  const nodeIds = new Set(nodes.map((node) => node.id));
  for (const node of nodes) {
    for (const dependency of node.migration_dependencies) {
      if (!nodeIds.has(dependency)) {
        issues.push(graphIssue(
          'MISSING_DEPENDENCY_NODE',
          `Node ${node.id} depends on missing node ${dependency}.`,
          [node.id, dependency],
        ));
        continue;
      }
      const isRequired = dependency === '004-deep-improvement-common'
        && REQUIRED_DEPENDENCIES.has(node.id);
      addEdge(edges, {
        from: dependency,
        to: node.id,
        edgeType: 'hard-order',
        edgeOrigin: isRequired ? 'required-constraint' : 'declared',
        resources: [`dependency:${dependency}`],
        serialization: 'predecessor',
        reason: isRequired
          ? 'The common improvement migration must complete before its variant.'
          : 'The node declares a migration predecessor.',
        evidence: [{
          source_path: SEQUENCING_SOURCE,
          basis: isRequired ? 'required-constraint' : 'contract-declaration',
          detail: `${dependency} precedes ${node.id}.`,
        }],
      });
    }
  }
  return issues;
}

function applyReviewFence(
  nodes: readonly GraphNode[],
  edges: Map<string, MutableEdge>,
): readonly GraphValidationIssue[] {
  const review = nodes.find((node) => node.id === REVIEW_NODE_ID) as GraphNode;
  const alignment = nodes.find((node) => node.id === ALIGNMENT_NODE_ID) as GraphNode;
  const reviewResources = nodeResourceMap(review);
  const alignmentResources = nodeResourceMap(alignment);
  const resolvedFenceResources = ['backend:review-loop', 'lock:review-loop']
    .filter((canonicalId) => reviewResources.has(canonicalId) && alignmentResources.has(canonicalId));
  const hasUnresolvedReviewAlias = [...review.read_set, ...review.write_set, ...review.shared_state,
    ...alignment.read_set, ...alignment.write_set, ...alignment.shared_state]
    .some((resource) => resource.identity.includes('review-loop')
      && resource.canonical_id.startsWith('unknown:'));
  const fenceResources = hasUnresolvedReviewAlias
    ? [...resolvedFenceResources, 'unknown:review-loop-fence']
    : resolvedFenceResources;
  const issues: GraphValidationIssue[] = [];
  const evidence = resolvedFenceResources.flatMap((canonicalId) => [
    ...(reviewResources.get(canonicalId)?.entries ?? []),
    ...(alignmentResources.get(canonicalId)?.entries ?? []),
  ]).flatMap((resource) => resource.evidence);

  if (resolvedFenceResources.length === 0) {
    issues.push(graphIssue(
      'REVIEW_LOOP_FENCE_EVIDENCE_MISSING',
      'Review and alignment do not resolve to one shared review-loop identity.',
      [REVIEW_NODE_ID, ALIGNMENT_NODE_ID],
      ['unknown:review-loop-fence'],
    ));
  }
  addEdge(edges, {
    from: REVIEW_NODE_ID,
    to: ALIGNMENT_NODE_ID,
    edgeType: 'fence',
    edgeOrigin: 'required-constraint',
    resources: fenceResources.length > 0 ? fenceResources : ['unknown:review-loop-fence'],
    serialization: 'mutual-exclusion',
    reason: 'Review and alignment must not hold the shared review-loop writer concurrently.',
    evidence: evidence.length > 0 ? evidence : [{
      source_path: SEQUENCING_SOURCE,
      basis: 'required-constraint',
      detail: 'Missing or unresolved review-loop aliases retain the fence.',
    }],
  });
  return issues;
}

function finalizeEdges(edges: ReadonlyMap<string, MutableEdge>): readonly ConflictEdge[] {
  return [...edges.values()].map((edge) => ({
    id: `edge:${edge.from}:${edge.to}:${edge.edgeType}`,
    from: edge.from,
    to: edge.to,
    edge_type: edge.edgeType,
    edge_origin: edge.edgeOrigin,
    resources: [...edge.resources].sort(compareText),
    serialization: edge.serialization,
    reason: edge.reason,
    evidence: [...edge.evidence.values()].sort((left, right) => {
      const pathOrder = compareText(left.source_path, right.source_path);
      return pathOrder !== 0 ? pathOrder : compareText(left.detail, right.detail);
    }),
  })).sort((left, right) => compareText(left.id, right.id));
}

function dependencyCycleIssue(nodes: readonly GraphNode[], edges: readonly ConflictEdge[]): GraphValidationIssue | null {
  const incoming = new Map<string, number>(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map<string, string[]>(nodes.map((node) => [node.id, []]));
  for (const edge of edges.filter((entry) => entry.edge_type === 'hard-order')) {
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    outgoing.get(edge.from)?.push(edge.to);
  }
  const ready = [...incoming.entries()]
    .filter(([, count]) => count === 0)
    .map(([nodeId]) => nodeId)
    .sort(compareText);
  let visited = 0;
  while (ready.length > 0) {
    const nodeId = ready.shift() as string;
    visited += 1;
    for (const target of (outgoing.get(nodeId) ?? []).sort(compareText)) {
      const next = (incoming.get(target) ?? 0) - 1;
      incoming.set(target, next);
      if (next === 0) ready.push(target);
      ready.sort(compareText);
    }
  }
  if (visited === nodes.length) return null;
  return graphIssue(
    'DEPENDENCY_CYCLE',
    'The directed migration dependency graph contains a cycle.',
    [...incoming.entries()].filter(([, count]) => count > 0).map(([nodeId]) => nodeId),
  );
}

function independentAssertion(
  nodes: readonly GraphNode[],
  edges: readonly ConflictEdge[],
): IndependentAssertion {
  const conflicts = edges.filter((edge) => edge.edge_type !== 'hard-order'
    && ((edge.from === RESEARCH_NODE_ID && edge.to === COUNCIL_NODE_ID)
      || (edge.from === COUNCIL_NODE_ID && edge.to === RESEARCH_NODE_ID)));
  const research = nodes.find((node) => node.id === RESEARCH_NODE_ID) as GraphNode;
  const council = nodes.find((node) => node.id === COUNCIL_NODE_ID) as GraphNode;
  return {
    left: RESEARCH_NODE_ID,
    right: COUNCIL_NODE_ID,
    assertion: 'independent-if-resource-disjoint',
    validated: conflicts.length === 0,
    conflict_edge_ids: conflicts.map((edge) => edge.id).sort(compareText),
    evidence: [research.source_digest, council.source_digest].sort(compareText),
    reason: conflicts.length === 0
      ? 'The current canonical resource sets are disjoint for mutable access.'
      : 'Actual resource conflicts override the independence assertion.',
  };
}

function deduplicateIssues(issues: readonly GraphValidationIssue[]): readonly GraphValidationIssue[] {
  const byKey = new Map<string, GraphValidationIssue>();
  for (const issue of issues) byKey.set(stableStringify(issue), issue);
  return [...byKey.values()].sort((left, right) => {
    const codeOrder = compareText(left.code, right.code);
    return codeOrder !== 0 ? codeOrder : compareText(left.message, right.message);
  });
}

export function deriveWriteSetConflictGraph(input: GraphBuildInput): WriteSetConflictGraph {
  validateManifestNodeSet(input.manifestWorkstreams);
  validateDeclarations(input.declarations);
  const policy = graphPolicy(input.policy);
  const requiredSourcePaths = collectRequiredSourcePaths(
    input.declarations,
    input.requiredSourcePaths ?? [],
  );
  const sourceResult = generatedSources(input.sourceDigests, requiredSourcePaths);
  const aliases = buildAliasIndex(input.aliasGroups ?? []);
  const issues: GraphValidationIssue[] = [...sourceResult.issues];
  if (!input.baseIdentity.trim()) {
    issues.push(graphIssue('MISSING_BASE_IDENTITY', 'The graph has no pinned base identity.'));
  }

  const nodes = [...input.declarations]
    .sort((left, right) => compareText(left.id, right.id))
    .map((declaration) => {
      const result = canonicalizeNode(declaration, sourceResult.sources, aliases);
      issues.push(...result.issues);
      return result.node;
    });
  const conflictResult = derivedConflictEdges(nodes);
  issues.push(...conflictResult.issues);
  issues.push(...applyHardOrderEdges(nodes, conflictResult.edges));
  issues.push(...applyReviewFence(nodes, conflictResult.edges));
  const edges = finalizeEdges(conflictResult.edges);
  const cycleIssue = dependencyCycleIssue(nodes, edges);
  if (cycleIssue) issues.push(cycleIssue);

  const assertion = independentAssertion(nodes, edges);
  if (!assertion.validated) {
    issues.push(graphIssue(
      'INDEPENDENCE_ASSERTION_CONFLICT',
      'Research and council share an actual mutable resource despite the independence assertion.',
      [RESEARCH_NODE_ID, COUNCIL_NODE_ID],
      edges
        .filter((edge) => assertion.conflict_edge_ids.includes(edge.id))
        .flatMap((edge) => edge.resources),
    ));
  }
  const stableIssues = deduplicateIssues(issues);
  const schedule = createDeterministicSchedule(nodes, edges, stableIssues);
  const graphWithoutDigest = {
    schema_version: WRITE_SET_GRAPH_SCHEMA_VERSION,
    base_identity: input.baseIdentity,
    generated_from: sourceResult.sources,
    policy,
    nodes,
    edges,
    independent_assertions: [assertion],
    schedule,
  } as const;

  return {
    ...graphWithoutDigest,
    graph_digest: stableDigest(graphWithoutDigest),
  };
}

function graphPayload(graph: WriteSetConflictGraph): Omit<WriteSetConflictGraph, 'graph_digest'> {
  const { graph_digest: omittedDigest, ...payload } = graph;
  void omittedDigest;
  return payload;
}

export function validateGraphForReuse(
  graph: WriteSetConflictGraph,
  input: GraphReuseInput,
): GraphReuseDecision {
  const reasons: string[] = [];
  try {
    validateManifestNodeSet(input.manifestWorkstreams);
  } catch (error: unknown) {
    reasons.push(error instanceof Error ? error.message : String(error));
  }
  try {
    validateManifestNodeSet(graph.nodes.map((node) => node.id));
  } catch (error: unknown) {
    reasons.push(`Stored graph node set is invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (graph.nodes.some((node) => node.id !== node.mode_slug)) {
    reasons.push('The stored graph contains a renamed mode slug.');
  }
  if (graph.schema_version !== WRITE_SET_GRAPH_SCHEMA_VERSION) {
    reasons.push(`Graph schema ${graph.schema_version as string} is not supported.`);
  }
  if (graph.policy.unknown_as_conflict !== true
    || graph.policy.default_schedule !== 'serial-single-writer'
    || graph.policy.manual_edge_overrides.length > 0) {
    reasons.push('The stored graph policy does not preserve fail-closed scheduling.');
  }
  if (graph.base_identity !== input.baseIdentity) {
    reasons.push(`Base identity changed from ${graph.base_identity} to ${input.baseIdentity}.`);
  }
  if (stableDigest(graphPayload(graph)) !== graph.graph_digest) {
    reasons.push('The graph digest no longer matches the graph payload.');
  }
  const observed = new Map(Object.entries(input.observedSourceDigests).map(
    ([sourcePath, digest]) => [normalizeSourcePath(sourcePath), normalizeDigest(digest)] as const,
  ));
  const sourceEvidence = graph.generated_from.map((source) => {
    const observedDigest = observed.get(source.path) ?? 'sha256:missing';
    if (!isValidDigest(source.digest) || !isValidDigest(observedDigest)) {
      reasons.push(`Source ${source.path} has invalid or missing digest evidence.`);
    } else if (observedDigest !== source.digest || source.status !== 'fresh') {
      reasons.push(`Source ${source.path} changed or is missing.`);
    }
    return {
      ...source,
      observed_digest: observedDigest,
      status: isValidDigest(source.digest)
        && isValidDigest(observedDigest)
        && observedDigest === source.digest
        ? 'fresh' as const
        : 'stale' as const,
    };
  });

  try {
    const currentSourceDigests = [...observed.entries()].map(([sourcePath, digest]) => ({
      path: sourcePath,
      digest,
      observedDigest: digest,
    }));
    const currentGraph = deriveWriteSetConflictGraph({
      baseIdentity: input.baseIdentity,
      manifestWorkstreams: input.manifestWorkstreams,
      declarations: input.declarations,
      sourceDigests: currentSourceDigests,
      requiredSourcePaths: graph.generated_from.map((source) => source.path),
      aliasGroups: input.aliasGroups,
      policy: graph.policy,
    });
    if (currentGraph.schedule.graph_state !== 'ready') {
      reasons.push('Current declarations or source evidence do not produce a ready graph.');
    }
    if (currentGraph.graph_digest !== graph.graph_digest) {
      reasons.push('Current declarations, sources, or derived edges differ from the stored graph.');
    }
  } catch (error: unknown) {
    reasons.push(`Current graph inputs are invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (graph.schedule.graph_state !== 'ready') {
    reasons.push('The stored graph is a conservative fallback, not a green scheduling gate.');
  }

  const accepted = reasons.length === 0;
  return {
    accepted,
    graph_refresh_required: !accepted,
    required_schedule: accepted ? graph.schedule.schedule_class : 'serial-single-writer',
    phase_gate_complete: false,
    reasons: uniqueSorted(reasons),
    graph_digest: graph.graph_digest,
    source_evidence: sourceEvidence,
  };
}
