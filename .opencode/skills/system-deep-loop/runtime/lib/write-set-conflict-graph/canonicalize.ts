// ───────────────────────────────────────────────────────────────────
// MODULE: Graph Resource Canonicalization
// ───────────────────────────────────────────────────────────────────

import { posix } from 'node:path';

import { compareStableText, stableDigest } from './stable-digest.js';
import { ResourceKinds } from './types.js';

import type {
  AliasGroup,
  CanonicalResource,
  GraphValidationIssue,
  ResourceAccess,
  ResourceInput,
  ResourceKind,
  ResourceMutability,
} from './types.js';

export const DEFAULT_ALIAS_GROUPS: readonly AliasGroup[] = [
  {
    canonical_id: 'backend:review-loop',
    aliases: [
      'backend:review-loop',
      'backend:deep-review-loop',
      'backend:deep-alignment-review-loop',
      'service:deep-review-loop',
      'service:deep-alignment-review-loop',
    ],
  },
  {
    canonical_id: 'lock:review-loop',
    aliases: [
      'lock:review-loop',
      'lock:deep-review-loop',
      'lock:deep-alignment-review-loop',
    ],
  },
] as const;

const knownKinds = new Set<string>(Object.values(ResourceKinds));
const knownAccesses = new Set<string>(['read', 'write']);
const knownMutabilities = new Set<string>([
  'append-only',
  'immutable',
  'mutable',
  'unknown',
  'write-once',
]);
const pathKinds = new Set(['artifact', 'file', 'fixture', 'generated-output', 'state']);

function asciiCaseFold(value: string): string {
  return value.replace(/[A-Z]/g, (character) => character.toLowerCase());
}

export function normalizeComparablePath(identity: string): string | undefined {
  const trimmed = identity.trim().replaceAll('\\', '/');
  const separator = trimmed.indexOf(':');
  if (separator < 1) return undefined;

  const namespace = trimmed.slice(0, separator).toLowerCase();
  if (!pathKinds.has(namespace)) return undefined;

  const value = trimmed.slice(separator + 1).normalize('NFC');
  const normalizedPath = posix.normalize(value).replace(/^(?:\.\/)+/, '');
  const withoutTrailingSlashes = normalizedPath.replace(/\/+$/, '');
  const canonicalPath = withoutTrailingSlashes === '' || withoutTrailingSlashes === '.'
    ? '/'
    : withoutTrailingSlashes;
  return `${namespace}:${asciiCaseFold(canonicalPath)}`;
}

interface AliasIndex {
  readonly resolved: ReadonlyMap<string, string>;
  readonly ambiguous: ReadonlySet<string>;
}

export interface CanonicalizationResult {
  readonly resource: CanonicalResource;
  readonly issues: readonly GraphValidationIssue[];
}

export function normalizeResourceIdentity(identity: string): string {
  const trimmed = identity.trim().replaceAll('\\', '/');
  const separator = trimmed.indexOf(':');
  if (separator < 1) return trimmed;

  const namespace = trimmed.slice(0, separator).toLowerCase();
  const value = trimmed.slice(separator + 1);
  if (!pathKinds.has(namespace)) return `${namespace}:${value}`;

  const normalizedPath = posix.normalize(value.normalize('NFC')).replace(/^\.\//, '');
  const canonicalPath = normalizedPath === '.' || normalizedPath === '/'
    ? '/'
    : normalizedPath;
  return `${namespace}:${canonicalPath}`;
}

function resourceLookupKey(identity: string): string {
  return normalizeComparablePath(identity) ?? normalizeResourceIdentity(identity);
}

export function buildAliasIndex(aliasGroups: readonly AliasGroup[]): AliasIndex {
  const candidates = new Map<string, Set<string>>();
  for (const group of [...DEFAULT_ALIAS_GROUPS, ...aliasGroups]) {
    const canonicalId = normalizeResourceIdentity(group.canonical_id);
    for (const alias of [group.canonical_id, ...group.aliases]) {
      const normalizedAlias = resourceLookupKey(alias);
      const existing = candidates.get(normalizedAlias) ?? new Set<string>();
      existing.add(canonicalId);
      candidates.set(normalizedAlias, existing);
    }
  }

  const resolved = new Map<string, string>();
  const ambiguous = new Set<string>();
  for (const [alias, canonicalIds] of candidates.entries()) {
    if (canonicalIds.size === 1) resolved.set(alias, [...canonicalIds][0] ?? alias);
    else ambiguous.add(alias);
  }
  return { resolved, ambiguous };
}

function issue(
  code: string,
  message: string,
  nodeId: string,
  resource: string,
  sourcePaths: readonly string[],
): GraphValidationIssue {
  return {
    code,
    message,
    node_ids: [nodeId],
    resources: [resource],
    source_paths: [...sourcePaths].sort(compareStableText),
  };
}

function unknownCanonicalId(nodeId: string, identity: string): string {
  return `unknown:${stableDigest({ nodeId, identity }).slice('sha256:'.length, 20)}`;
}

export function canonicalizeResource(
  input: ResourceInput,
  expectedAccess: ResourceAccess | undefined,
  nodeId: string,
  aliases: AliasIndex,
): CanonicalizationResult {
  const issues: GraphValidationIssue[] = [];
  const identity = normalizeResourceIdentity(input.identity);
  const explicitCanonicalId = input.canonical_id
    ? normalizeResourceIdentity(input.canonical_id)
    : undefined;
  const sourcePaths = input.evidence.map((entry) => entry.source_path);
  const identityLookupKey = resourceLookupKey(identity);
  const explicitCanonicalLookupKey = explicitCanonicalId === undefined
    ? undefined
    : resourceLookupKey(explicitCanonicalId);
  const isAmbiguous = aliases.ambiguous.has(identityLookupKey)
    || (explicitCanonicalLookupKey !== undefined
      && aliases.ambiguous.has(explicitCanonicalLookupKey));

  let canonicalId = explicitCanonicalId
    ?? aliases.resolved.get(identityLookupKey)
    ?? identity;
  if (!explicitCanonicalId) {
    issues.push(issue(
      'MISSING_CANONICAL_RESOURCE_ID',
      `Resource ${identity} has no reviewed canonical identity.`,
      nodeId,
      canonicalId,
      sourcePaths,
    ));
  }
  const aliasedCanonicalId = aliases.resolved.get(identityLookupKey);
  if (explicitCanonicalId && aliasedCanonicalId && explicitCanonicalId !== aliasedCanonicalId) {
    issues.push(issue(
      'CONTRADICTORY_CANONICAL_ID',
      `Resource ${identity} declares ${explicitCanonicalId} but its alias resolves to ${aliasedCanonicalId}.`,
      nodeId,
      identity,
      sourcePaths,
    ));
    canonicalId = unknownCanonicalId(nodeId, identity);
  } else if (isAmbiguous) {
    issues.push(issue(
      'UNRESOLVED_RESOURCE_ALIAS',
      `Resource alias ${identity} resolves to more than one canonical identity.`,
      nodeId,
      identity,
      sourcePaths,
    ));
    canonicalId = unknownCanonicalId(nodeId, identity);
  }

  const kind = knownKinds.has(input.kind) ? input.kind as ResourceKind : ResourceKinds.UNKNOWN;
  const mutability = knownMutabilities.has(input.mutability)
    ? input.mutability as ResourceMutability
    : 'unknown';
  const accessIsKnown = knownAccesses.has(input.access);
  const access = accessIsKnown
    ? input.access as ResourceAccess
    : expectedAccess ?? 'write';
  if (kind === ResourceKinds.UNKNOWN || mutability === 'unknown') {
    issues.push(issue(
      'UNCLASSIFIED_RESOURCE',
      `Resource ${identity} has unknown kind or mutability.`,
      nodeId,
      canonicalId,
      sourcePaths,
    ));
  }
  if (!accessIsKnown) {
    issues.push(issue(
      'UNCLASSIFIED_RESOURCE_ACCESS',
      `Resource ${identity} declares unrecognized ${String(input.access)} access.`,
      nodeId,
      canonicalId,
      sourcePaths,
    ));
  } else if (expectedAccess !== undefined && input.access !== expectedAccess) {
    issues.push(issue(
      'CONTRADICTORY_RESOURCE_ACCESS',
      `Resource ${identity} is in the ${expectedAccess} set but declares ${input.access} access.`,
      nodeId,
      canonicalId,
      sourcePaths,
    ));
  }
  if (!input.scope.trim() || !input.owner.trim() || input.evidence.length === 0) {
    issues.push(issue(
      'INCOMPLETE_RESOURCE_EVIDENCE',
      `Resource ${identity} is missing scope, owner, or source evidence.`,
      nodeId,
      canonicalId,
      sourcePaths,
    ));
  }
  if (identity.includes('../')
    || identity.endsWith('/..')
    || explicitCanonicalId?.includes('../')
    || explicitCanonicalId?.endsWith('/..')) {
    issues.push(issue(
      'UNSAFE_RESOURCE_PATH',
      `Resource ${identity} escapes its declared namespace.`,
      nodeId,
      canonicalId,
      sourcePaths,
    ));
    canonicalId = unknownCanonicalId(nodeId, identity);
  }

  const evidence = [...input.evidence].sort((left, right) => {
    const pathOrder = compareStableText(left.source_path, right.source_path);
    if (pathOrder !== 0) return pathOrder;
    const basisOrder = compareStableText(left.basis, right.basis);
    return basisOrder !== 0 ? basisOrder : compareStableText(left.detail, right.detail);
  });

  return {
    resource: {
      ...input,
      identity,
      canonical_id: canonicalId,
      kind,
      mutability,
      access,
      evidence,
    },
    issues,
  };
}
