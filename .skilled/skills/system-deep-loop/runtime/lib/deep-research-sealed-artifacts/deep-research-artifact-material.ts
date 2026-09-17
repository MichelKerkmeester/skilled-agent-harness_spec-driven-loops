// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  ArtifactCanonicalizerRegistry,
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../sealed-reference-artifacts/index.js';
import { DeepResearchArtifactKinds } from './deep-research-sealed-artifact-types.js';

import type {
  ArtifactCanonicalizerDefinition,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepResearchAnalysisArtifactMaterial,
  DeepResearchAnalysisStatus,
  DeepResearchArtifactKind,
  DeepResearchArtifactKindRegistration,
  DeepResearchArtifactLocator,
  DeepResearchConvergenceArtifactMaterial,
  DeepResearchConvergenceDecision,
  DeepResearchInputArtifactMaterial,
  DeepResearchMemoryHandoffArtifactMaterial,
  DeepResearchSourceArtifactMaterial,
  DeepResearchSynthesisArtifactMaterial,
} from './deep-research-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY
// ───────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_ARTIFACT_CANONICALIZATION_VERSION =
  'deep-research-binding@1';
export const DEEP_RESEARCH_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.deep-research-binding+json';

const REGISTRY_ROWS = [
  [DeepResearchArtifactKinds.OBJECTIVE, 'init', 'input'],
  [DeepResearchArtifactKinds.PLAN_FRONTIER, 'init', 'input'],
  [DeepResearchArtifactKinds.SEARCH_RECIPE, 'init', 'input'],
  [DeepResearchArtifactKinds.CAPABILITY_COMMITMENT, 'init', 'input'],
  [DeepResearchArtifactKinds.MODE_CONFIGURATION, 'init', 'input'],
  [DeepResearchArtifactKinds.POLICY_INPUT, 'init', 'input'],
  [DeepResearchArtifactKinds.SOURCE_CAPTURE, 'gather', 'source'],
  [DeepResearchArtifactKinds.NORMALIZED_PASSAGE, 'gather', 'source'],
  [DeepResearchArtifactKinds.BRANCH_OBSERVATION, 'gather', 'analysis'],
  [DeepResearchArtifactKinds.ATOMIC_CLAIM, 'analyze', 'analysis'],
  [DeepResearchArtifactKinds.EVIDENCE_SPAN, 'analyze', 'analysis'],
  [DeepResearchArtifactKinds.CROSS_VALIDATION, 'analyze', 'analysis'],
  [DeepResearchArtifactKinds.UNRESOLVED_STATE, 'analyze', 'analysis'],
  [DeepResearchArtifactKinds.CONTRADICTION_OBLIGATION, 'analyze', 'analysis'],
  [DeepResearchArtifactKinds.CONVERGENCE_INPUT, 'convergence', 'convergence'],
  [DeepResearchArtifactKinds.CONVERGENCE_WITNESS, 'convergence', 'convergence'],
  [DeepResearchArtifactKinds.SYNTHESIS_VIEW, 'synthesize', 'synthesis'],
  [DeepResearchArtifactKinds.SYNTHESIS_REPORT, 'synthesize', 'synthesis'],
  [DeepResearchArtifactKinds.MEMORY_HANDOFF, 'memory-save', 'handoff'],
] as const;

export const DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY: readonly DeepResearchArtifactKindRegistration[] =
  Object.freeze(REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
    artifactKind,
    lifecycle,
    materialFamily,
    canonicalizationVersion: DEEP_RESEARCH_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_RESEARCH_ARTIFACT_MEDIA_TYPE,
  })));

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const SELECTOR_PATTERN = /^[^\u0000-\u001f\u007f\r\n]{1,256}$/u;
const MAX_SELECTOR_SPACES = 16;
const MAX_DIGESTS = 256;

const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;
const INPUT_FIELDS = [
  'artifactId', 'materialDigest', 'materialRef', 'locator', 'producerVersion',
] as const;
const SOURCE_FIELDS = [
  'sourceVersionId', 'sourceIdentityDigest', 'responseDigest', 'responseRef',
  'retrievalMetadataDigest', 'extractionProfileDigest', 'normalizedPassageDigests',
  'locator', 'captureVersion',
] as const;
const ANALYSIS_FIELDS = [
  'observationId', 'observationDigest', 'observationRef', 'sourceArtifactDigest',
  'evidenceDigests', 'status', 'locator', 'analysisVersion',
] as const;
const CONVERGENCE_FIELDS = [
  'witnessId', 'snapshotDigest', 'snapshotRef', 'orderedInputDigests',
  'evaluatorVersion', 'decision', 'locator',
] as const;
const SYNTHESIS_FIELDS = [
  'outputId', 'outputDigest', 'outputRef', 'orderedInputDigests', 'reducerVersion',
  'projectionVersion', 'outputRole', 'locator',
] as const;
const HANDOFF_FIELDS = [
  'handoffId', 'finalReferenceSetDigest', 'continuityPayloadDigest',
  'offeredViewDigest', 'offeredViewRef', 'targetPacket', 'locator', 'handoffVersion',
] as const;

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Deep Research artifact material violates its closed field contract',
    { artifactKind, field },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactFields(
  value: Record<string, unknown>,
  fields: readonly string[],
): boolean {
  const expected = new Set(fields);
  return Object.keys(value).length === fields.length
    && Object.keys(value).every((field) => expected.has(field));
}

function requireRecord(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) {
    return invalidMaterial(artifactKind, 'shape');
  }
  return input;
}

function requireToken(
  artifactKind: DeepResearchArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: DeepResearchArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigestArray(
  artifactKind: DeepResearchArtifactKind,
  field: string,
  value: unknown,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length === 0
    || value.length > MAX_DIGESTS
    || !value.every((entry) => typeof entry === 'string' && DIGEST_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireLocator(
  artifactKind: DeepResearchArtifactKind,
  value: unknown,
): DeepResearchArtifactLocator {
  const locator = requireRecord(artifactKind, value, LOCATOR_FIELDS);
  if (!['artifact', 'file', 'url'].includes(String(locator.scheme))) {
    return invalidMaterial(artifactKind, 'locator.scheme');
  }
  if (
    typeof locator.selector !== 'string'
    || locator.selector.trim().length === 0
    || !SELECTOR_PATTERN.test(locator.selector)
    || (locator.selector.match(/\s/gu)?.length ?? 0) > MAX_SELECTOR_SPACES
  ) {
    return invalidMaterial(artifactKind, 'locator.selector');
  }
  return Object.freeze({
    scheme: locator.scheme as DeepResearchArtifactLocator['scheme'],
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', locator.locatorDigest),
    selector: locator.selector,
    revision: locator.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', locator.revision),
  });
}

function requireEnum<T extends string>(
  artifactKind: DeepResearchArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    return invalidMaterial(artifactKind, field);
  }
  return value as T;
}

function parseInputMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
): DeepResearchInputArtifactMaterial {
  const value = requireRecord(artifactKind, input, INPUT_FIELDS);
  return Object.freeze({
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    materialDigest: requireDigest(artifactKind, 'materialDigest', value.materialDigest),
    materialRef: requireToken(artifactKind, 'materialRef', value.materialRef),
    locator: requireLocator(artifactKind, value.locator),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
  });
}

function parseSourceMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
): DeepResearchSourceArtifactMaterial {
  const value = requireRecord(artifactKind, input, SOURCE_FIELDS);
  return Object.freeze({
    sourceVersionId: requireToken(artifactKind, 'sourceVersionId', value.sourceVersionId),
    sourceIdentityDigest: requireDigest(
      artifactKind,
      'sourceIdentityDigest',
      value.sourceIdentityDigest,
    ),
    responseDigest: requireDigest(artifactKind, 'responseDigest', value.responseDigest),
    responseRef: requireToken(artifactKind, 'responseRef', value.responseRef),
    retrievalMetadataDigest: requireDigest(
      artifactKind,
      'retrievalMetadataDigest',
      value.retrievalMetadataDigest,
    ),
    extractionProfileDigest: requireDigest(
      artifactKind,
      'extractionProfileDigest',
      value.extractionProfileDigest,
    ),
    normalizedPassageDigests: requireDigestArray(
      artifactKind,
      'normalizedPassageDigests',
      value.normalizedPassageDigests,
    ),
    locator: requireLocator(artifactKind, value.locator),
    captureVersion: requireToken(artifactKind, 'captureVersion', value.captureVersion),
  });
}

function parseAnalysisMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
  allowedStatuses: readonly DeepResearchAnalysisStatus[],
): DeepResearchAnalysisArtifactMaterial {
  const value = requireRecord(artifactKind, input, ANALYSIS_FIELDS);
  return Object.freeze({
    observationId: requireToken(artifactKind, 'observationId', value.observationId),
    observationDigest: requireDigest(
      artifactKind,
      'observationDigest',
      value.observationDigest,
    ),
    observationRef: requireToken(artifactKind, 'observationRef', value.observationRef),
    sourceArtifactDigest: requireDigest(
      artifactKind,
      'sourceArtifactDigest',
      value.sourceArtifactDigest,
    ),
    evidenceDigests: requireDigestArray(
      artifactKind,
      'evidenceDigests',
      value.evidenceDigests,
    ),
    status: requireEnum(artifactKind, 'status', value.status, allowedStatuses),
    locator: requireLocator(artifactKind, value.locator),
    analysisVersion: requireToken(artifactKind, 'analysisVersion', value.analysisVersion),
  });
}

function parseConvergenceMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
  allowedDecisions: readonly DeepResearchConvergenceDecision[],
): DeepResearchConvergenceArtifactMaterial {
  const value = requireRecord(artifactKind, input, CONVERGENCE_FIELDS);
  return Object.freeze({
    witnessId: requireToken(artifactKind, 'witnessId', value.witnessId),
    snapshotDigest: requireDigest(artifactKind, 'snapshotDigest', value.snapshotDigest),
    snapshotRef: requireToken(artifactKind, 'snapshotRef', value.snapshotRef),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
    ),
    evaluatorVersion: requireToken(
      artifactKind,
      'evaluatorVersion',
      value.evaluatorVersion,
    ),
    decision: requireEnum(artifactKind, 'decision', value.decision, allowedDecisions),
    locator: requireLocator(artifactKind, value.locator),
  });
}

function parseSynthesisMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
  expectedRole: DeepResearchSynthesisArtifactMaterial['outputRole'],
): DeepResearchSynthesisArtifactMaterial {
  const value = requireRecord(artifactKind, input, SYNTHESIS_FIELDS);
  return Object.freeze({
    outputId: requireToken(artifactKind, 'outputId', value.outputId),
    outputDigest: requireDigest(artifactKind, 'outputDigest', value.outputDigest),
    outputRef: requireToken(artifactKind, 'outputRef', value.outputRef),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
    ),
    reducerVersion: requireToken(artifactKind, 'reducerVersion', value.reducerVersion),
    projectionVersion: requireToken(
      artifactKind,
      'projectionVersion',
      value.projectionVersion,
    ),
    outputRole: requireEnum(artifactKind, 'outputRole', value.outputRole, [expectedRole]),
    locator: requireLocator(artifactKind, value.locator),
  });
}

function parseHandoffMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
): DeepResearchMemoryHandoffArtifactMaterial {
  const value = requireRecord(artifactKind, input, HANDOFF_FIELDS);
  return Object.freeze({
    handoffId: requireToken(artifactKind, 'handoffId', value.handoffId),
    finalReferenceSetDigest: requireDigest(
      artifactKind,
      'finalReferenceSetDigest',
      value.finalReferenceSetDigest,
    ),
    continuityPayloadDigest: requireDigest(
      artifactKind,
      'continuityPayloadDigest',
      value.continuityPayloadDigest,
    ),
    offeredViewDigest: requireDigest(
      artifactKind,
      'offeredViewDigest',
      value.offeredViewDigest,
    ),
    offeredViewRef: requireToken(artifactKind, 'offeredViewRef', value.offeredViewRef),
    targetPacket: requireToken(artifactKind, 'targetPacket', value.targetPacket),
    locator: requireLocator(artifactKind, value.locator),
    handoffVersion: requireToken(artifactKind, 'handoffVersion', value.handoffVersion),
  });
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Deep Research artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

function canonicalizeDeepResearchMaterial(
  artifactKind: DeepResearchArtifactKind,
  input: unknown,
): Uint8Array {
  let material: unknown;
  switch (artifactKind) {
    case DeepResearchArtifactKinds.OBJECTIVE:
    case DeepResearchArtifactKinds.PLAN_FRONTIER:
    case DeepResearchArtifactKinds.SEARCH_RECIPE:
    case DeepResearchArtifactKinds.CAPABILITY_COMMITMENT:
    case DeepResearchArtifactKinds.MODE_CONFIGURATION:
    case DeepResearchArtifactKinds.POLICY_INPUT:
      material = parseInputMaterial(artifactKind, input);
      break;
    case DeepResearchArtifactKinds.SOURCE_CAPTURE:
    case DeepResearchArtifactKinds.NORMALIZED_PASSAGE:
      material = parseSourceMaterial(artifactKind, input);
      break;
    case DeepResearchArtifactKinds.BRANCH_OBSERVATION:
      material = parseAnalysisMaterial(artifactKind, input, ['observed', 'unresolved']);
      break;
    case DeepResearchArtifactKinds.ATOMIC_CLAIM:
      material = parseAnalysisMaterial(
        artifactKind,
        input,
        ['contested', 'supported', 'unresolved'],
      );
      break;
    case DeepResearchArtifactKinds.EVIDENCE_SPAN:
      material = parseAnalysisMaterial(
        artifactKind,
        input,
        ['admitted', 'degraded', 'quarantined'],
      );
      break;
    case DeepResearchArtifactKinds.CROSS_VALIDATION:
      material = parseAnalysisMaterial(
        artifactKind,
        input,
        ['confirmed', 'contradicted', 'inconclusive'],
      );
      break;
    case DeepResearchArtifactKinds.UNRESOLVED_STATE:
      material = parseAnalysisMaterial(artifactKind, input, ['abstained', 'unresolved']);
      break;
    case DeepResearchArtifactKinds.CONTRADICTION_OBLIGATION:
      material = parseAnalysisMaterial(artifactKind, input, ['open', 'resolved']);
      break;
    case DeepResearchArtifactKinds.CONVERGENCE_INPUT:
      material = parseConvergenceMaterial(artifactKind, input, ['pending']);
      break;
    case DeepResearchArtifactKinds.CONVERGENCE_WITNESS:
      material = parseConvergenceMaterial(
        artifactKind,
        input,
        ['blocked', 'continue', 'converged', 'incomplete', 'recover'],
      );
      break;
    case DeepResearchArtifactKinds.SYNTHESIS_VIEW:
      material = parseSynthesisMaterial(artifactKind, input, 'claim-evidence-view');
      break;
    case DeepResearchArtifactKinds.SYNTHESIS_REPORT:
      material = parseSynthesisMaterial(artifactKind, input, 'report');
      break;
    case DeepResearchArtifactKinds.MEMORY_HANDOFF:
      material = parseHandoffMaterial(artifactKind, input);
      break;
    default:
      return unsupportedArtifactKind(artifactKind);
  }
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

// ───────────────────────────────────────────────────────────────────
// 3. SHARED-SEALER ADAPTER
// ───────────────────────────────────────────────────────────────────

/** Register closed mode material profiles without replacing shared seal mechanics. */
export function createDeepResearchArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const definitions: ArtifactCanonicalizerDefinition[] =
    DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'deep-research-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeDeepResearchMaterial(entry.artifactKind, input)
      ),
    }));
  return new ArtifactCanonicalizerRegistry(definitions);
}
