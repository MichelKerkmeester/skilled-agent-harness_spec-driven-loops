// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Artifact Material
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes } from '../event-envelope/index.js';
import {
  ArtifactCanonicalizerRegistry,
  DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
  DEFAULT_ARTIFACT_DIGEST_ALGORITHM,
  DEFAULT_ARTIFACT_MEDIA_TYPE,
  InitialArtifactKinds,
  SealedArtifactError,
  SealedArtifactErrorCodes,
  createArtifactCanonicalizerRegistry,
  parseSealedArtifactReference,
} from '../sealed-reference-artifacts/index.js';
import {
  DeepReviewArtifactKinds,
} from './deep-review-sealed-artifact-types.js';
import {
  DeepReviewEventStems,
} from '../deep-review-ledger-schema/index.js';

import type {
  ArtifactCanonicalizerDefinition,
} from '../sealed-reference-artifacts/index.js';
import type {
  DeepReviewEventStem,
} from '../deep-review-ledger-schema/index.js';
import type {
  DeepReviewArtifactDependency,
  DeepReviewArtifactKind,
  DeepReviewArtifactKindRegistration,
  DeepReviewArtifactLocator,
  DeepReviewArtifactMaterial,
  DeepReviewArtifactMaterialByKind,
  DeepReviewCandidateArtifactMaterial,
  DeepReviewConvergenceArtifactMaterial,
  DeepReviewPassArtifactMaterial,
  DeepReviewResumeArtifactMaterial,
  DeepReviewScopeArtifactMaterial,
  DeepReviewSynthesisArtifactMaterial,
} from './deep-review-sealed-artifact-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. REGISTRY
// ───────────────────────────────────────────────────────────────────

export const DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION =
  'deep-review-binding@1';
export const DEEP_REVIEW_ARTIFACT_MEDIA_TYPE =
  'application/vnd.openai.deep-review-binding+json';

const REGISTRY_ROWS = [
  [DeepReviewArtifactKinds.TARGET_SNAPSHOT, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.SCOPE_REFERENCE_SET, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.REVIEW_CONTRACT, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.CONTEXT_SNAPSHOT, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.CAPABILITY_COMMITMENT, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.PROMPT_RUBRIC, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.POLICY_INPUT, 'scope-init', 'scope'],
  [DeepReviewArtifactKinds.DIMENSION_PASS, 'dimension-pass', 'pass'],
  [DeepReviewArtifactKinds.CANDIDATE_EVIDENCE, 'candidate-adjudication', 'candidate'],
  [DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE, 'candidate-adjudication', 'candidate'],
  [DeepReviewArtifactKinds.CONVERGENCE_WITNESS, 'convergence', 'convergence'],
  [DeepReviewArtifactKinds.SYNTHESIS_VIEW, 'synthesis', 'synthesis'],
  [DeepReviewArtifactKinds.SYNTHESIS_REPORT, 'synthesis', 'synthesis'],
  [DeepReviewArtifactKinds.RESUME_HANDOFF, 'resume-save', 'resume'],
] as const;

export const DEEP_REVIEW_ARTIFACT_KIND_REGISTRY: readonly DeepReviewArtifactKindRegistration[] =
  Object.freeze(REGISTRY_ROWS.map(([artifactKind, lifecycle, materialFamily]) => Object.freeze({
    artifactKind,
    lifecycle,
    materialFamily,
    canonicalizationVersion: DEEP_REVIEW_ARTIFACT_CANONICALIZATION_VERSION,
    mediaType: DEEP_REVIEW_ARTIFACT_MEDIA_TYPE,
  })));
const SUPPORTED_DEPENDENCY_KINDS: ReadonlySet<string> = new Set([
  ...Object.values(DeepReviewArtifactKinds),
  ...Object.values(InitialArtifactKinds),
]);

// ───────────────────────────────────────────────────────────────────
// 2. CLOSED VALIDATION
// ───────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/;
const SELECTOR_CHARACTER_PATTERN =
  /^[A-Za-z0-9._:/#@\[\]()>*='"$,+~^|-]+(?: [A-Za-z0-9._:/#@\[\]()>*='"$,+~^|-]+)*$/u;
const NON_CSS_STRUCTURED_SELECTOR_PATTERNS: readonly RegExp[] = Object.freeze([
  /^#[A-Za-z0-9][A-Za-z0-9._:@-]*$/u,
  /^(?:[A-Za-z0-9._@-]+\/)*[A-Za-z0-9._@-]+:\d+(?::\d+)?(?:#[A-Za-z0-9][A-Za-z0-9._:@-]*)?$/u,
  /^[A-Za-z][A-Za-z0-9._-]{0,63}:[A-Za-z0-9][A-Za-z0-9._:/#@\[\]()>*='"$,+~^|-]*$/u,
  /^[A-Za-z][A-Za-z0-9+.-]*:\/\/[A-Za-z0-9][A-Za-z0-9._:@/-]*(?:#[A-Za-z0-9][A-Za-z0-9._:@-]*)?$/u,
  /^(?:\/{1,2}|\.{1,2}\/)[A-Za-z0-9_.*:@\[\]="'$()-]+(?:\/[A-Za-z0-9_.*:@\[\]="'$()-]+)*$/u,
]);
const CSS_SELECTOR_SEPARATOR_PATTERN = /\s*[>+~]\s*|\s+/u;
const CSS_COMPOUND_SELECTOR_PATTERN =
  /^(?:(?:(?:[A-Za-z*][A-Za-z0-9_-]*\|)?(?:[A-Za-z][A-Za-z0-9_-]*|\*))?(?:(?:[.#][A-Za-z_][A-Za-z0-9_-]*)|\[[^\]\s]+\]|:[A-Za-z_][A-Za-z0-9_-]*(?:\([^()\s]+\))?)+|(?:[A-Za-z*][A-Za-z0-9_-]*\|)?(?:[A-Za-z][A-Za-z0-9_-]*|\*))$/u;
const CSS_LOCATOR_STRUCTURE_PATTERN = /[.#:|]|\[|\]/u;
const CSS_TYPE_SELECTOR_TOKENS: ReadonlySet<string> = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi',
  'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code',
  'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
  'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr',
  'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li',
  'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress',
  'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'search', 'section', 'select',
  'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time',
  'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',
  'circle', 'clippath', 'defs', 'ellipse', 'filter', 'foreignobject', 'g', 'line',
  'lineargradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline',
  'radialgradient', 'rect', 'stop', 'svg', 'symbol', 'text', 'textpath', 'tspan',
  'use',
]);
const MAX_DIGESTS = 256;
const MAX_DEPENDENCIES = 256;
const MAX_SELECTOR_LENGTH = 256;
const MAX_AUTHORITY_EPOCH = 0xffffffff;

const LOCATOR_FIELDS = ['scheme', 'locatorDigest', 'selector', 'revision'] as const;
const DEPENDENCY_FIELDS = ['artifactKind', 'reference'] as const;
const SCOPE_FIELDS = [
  'artifactId', 'eventStem', 'eventId', 'authorityEpoch', 'materialDigest',
  'materialRef', 'dependencies', 'locator', 'producerVersion',
] as const;
const PASS_FIELDS = [
  'passId', 'eventStem', 'eventId', 'authorityEpoch', 'orderedInputDigests',
  'selectedTargetDigests', 'searchLedgerDigest', 'diagnosticsDigest',
  'observationDigests', 'graphEventDigest', 'iterationDigest', 'deltaDigest',
  'dependencies', 'locator', 'passVersion',
] as const;
const CANDIDATE_FIELDS = [
  'candidateId', 'eventStem', 'eventId', 'authorityEpoch', 'claimDigest',
  'evidenceDigests', 'intermediateFactDigests', 'reproductionDigest',
  'refutationDigest', 'rawScore', 'confidence', 'impact', 'reachability',
  'exploitability', 'evidenceStrength', 'evidenceScope', 'dependencies',
  'locator', 'candidateVersion',
] as const;
const CONVERGENCE_FIELDS = [
  'witnessId', 'eventStem', 'eventId', 'authorityEpoch', 'orderedInputDigests',
  'stateHistoryDigest', 'findingsRegistryInputDigest', 'coverageDigest',
  'gateResultDigests', 'graphConvergenceDigest', 'decision', 'recoveryDecision',
  'dependencies', 'locator', 'evaluatorVersion',
] as const;
const SYNTHESIS_FIELDS = [
  'outputId', 'eventStem', 'eventId', 'authorityEpoch', 'orderedInputDigests',
  'findingsRegistryDigest', 'dashboardDigest', 'resourceMapDigest', 'reportDigest',
  'unresolvedFindingDigests', 'verdict', 'advisoryState', 'reducerVersion',
  'projectionVersion', 'dependencies', 'locator',
] as const;
const RESUME_FIELDS = [
  'handoffId', 'eventStem', 'eventId', 'authorityEpoch', 'priorReferenceSetDigest',
  'changedInputDigest', 'affectedFindingDigests', 'affectedReportDigests',
  'continuityPointer', 'driftDisposition', 'dependencies', 'locator',
  'handoffVersion',
] as const;

function invalidMaterial(artifactKind: string, field: string): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.INVALID_INPUT,
    'canonicalization',
    'Deep Review artifact material violates its closed field contract',
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
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
  fields: readonly string[],
): Record<string, unknown> {
  if (!isRecord(input) || !hasExactFields(input, fields)) {
    return invalidMaterial(artifactKind, 'shape');
  }
  return input;
}

function requireToken(
  artifactKind: DeepReviewArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !TOKEN_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigest(
  artifactKind: DeepReviewArtifactKind,
  field: string,
  value: unknown,
): string {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireDigestArray(
  artifactKind: DeepReviewArtifactKind,
  field: string,
  value: unknown,
  minimum = 0,
): readonly string[] {
  if (
    !Array.isArray(value)
    || value.length < minimum
    || value.length > MAX_DIGESTS
    || !value.every((entry) => typeof entry === 'string' && DIGEST_PATTERN.test(entry))
  ) {
    return invalidMaterial(artifactKind, field);
  }
  return Object.freeze([...value]);
}

function requireRatio(
  artifactKind: DeepReviewArtifactKind,
  field: string,
  value: unknown,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    return invalidMaterial(artifactKind, field);
  }
  return value;
}

function requireAuthorityEpoch(
  artifactKind: DeepReviewArtifactKind,
  value: unknown,
): number {
  if (
    typeof value !== 'number'
    || !Number.isSafeInteger(value)
    || value < 0
    || value > MAX_AUTHORITY_EPOCH
  ) {
    return invalidMaterial(artifactKind, 'authorityEpoch');
  }
  return value;
}

function requireEventStem(
  artifactKind: DeepReviewArtifactKind,
  value: unknown,
): DeepReviewEventStem {
  if (
    typeof value !== 'string'
    || !(DeepReviewEventStems as readonly string[]).includes(value)
  ) {
    return invalidMaterial(artifactKind, 'eventStem');
  }
  return value as DeepReviewEventStem;
}

function requireEnum<T extends string>(
  artifactKind: DeepReviewArtifactKind,
  field: string,
  value: unknown,
  allowed: readonly T[],
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    return invalidMaterial(artifactKind, field);
  }
  return value as T;
}

function isStructuredSelector(selector: string): boolean {
  return SELECTOR_CHARACTER_PATTERN.test(selector)
    && (
      NON_CSS_STRUCTURED_SELECTOR_PATTERNS.some((pattern) => pattern.test(selector))
      || isStructuredCssSelector(selector)
    );
}

function isStructuredCssSelector(selector: string): boolean {
  const segments = selector.split(CSS_SELECTOR_SEPARATOR_PATTERN);
  return segments.length > 0
    && segments.every((segment) => (
      segment.length > 0
      && CSS_COMPOUND_SELECTOR_PATTERN.test(segment)
      && (
        segment === '*'
        || CSS_LOCATOR_STRUCTURE_PATTERN.test(segment)
        || CSS_TYPE_SELECTOR_TOKENS.has(segment.toLowerCase())
      )
    ));
}

function requireLocator(
  artifactKind: DeepReviewArtifactKind,
  value: unknown,
): DeepReviewArtifactLocator {
  const locator = requireRecord(artifactKind, value, LOCATOR_FIELDS);
  const selector = locator.selector;
  if (
    !['artifact', 'file', 'url'].includes(String(locator.scheme))
    || typeof selector !== 'string'
    || selector.length === 0
    || selector.length > MAX_SELECTOR_LENGTH
    || !isStructuredSelector(selector)
  ) {
    return invalidMaterial(artifactKind, 'locator.selector');
  }
  return Object.freeze({
    scheme: locator.scheme as DeepReviewArtifactLocator['scheme'],
    locatorDigest: requireDigest(artifactKind, 'locator.locatorDigest', locator.locatorDigest),
    selector,
    revision: locator.revision === null
      ? null
      : requireToken(artifactKind, 'locator.revision', locator.revision),
  });
}

function requireDependencies(
  artifactKind: DeepReviewArtifactKind,
  value: unknown,
): readonly DeepReviewArtifactDependency[] {
  if (!Array.isArray(value) || value.length > MAX_DEPENDENCIES) {
    return invalidMaterial(artifactKind, 'dependencies');
  }
  const dependencies = value.map((entry) => {
    const dependency = requireRecord(artifactKind, entry, DEPENDENCY_FIELDS);
    const reference = parseSealedArtifactReference(dependency.reference);
    if (
      typeof dependency.artifactKind !== 'string'
      || !SUPPORTED_DEPENDENCY_KINDS.has(dependency.artifactKind)
      || reference.artifact_kind !== dependency.artifactKind
    ) {
      return invalidMaterial(artifactKind, 'dependencies.reference.artifact_kind');
    }
    return Object.freeze({
      artifactKind: dependency.artifactKind as DeepReviewArtifactDependency['artifactKind'],
      reference,
    });
  });
  return Object.freeze(dependencies);
}

function requireMaterialReference(
  artifactKind: DeepReviewArtifactKind,
  materialDigest: string,
  value: unknown,
): string {
  const materialRef = requireToken(artifactKind, 'materialRef', value);
  if (
    materialRef
    !== `artifact:${DEFAULT_ARTIFACT_DIGEST_ALGORITHM}:${materialDigest}`
  ) {
    return invalidMaterial(artifactKind, 'materialRef');
  }
  return materialRef;
}

function commonScopeMaterial(
  artifactKind: DeepReviewArtifactKind,
  value: Record<string, unknown>,
): DeepReviewScopeArtifactMaterial {
  const materialDigest = requireDigest(artifactKind, 'materialDigest', value.materialDigest);
  return Object.freeze({
    artifactId: requireToken(artifactKind, 'artifactId', value.artifactId),
    eventStem: requireEventStem(artifactKind, value.eventStem),
    eventId: requireToken(artifactKind, 'eventId', value.eventId),
    authorityEpoch: requireAuthorityEpoch(artifactKind, value.authorityEpoch),
    materialDigest,
    materialRef: requireMaterialReference(artifactKind, materialDigest, value.materialRef),
    dependencies: requireDependencies(artifactKind, value.dependencies),
    locator: requireLocator(artifactKind, value.locator),
    producerVersion: requireToken(artifactKind, 'producerVersion', value.producerVersion),
  });
}

function parseScopeMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewScopeArtifactMaterial {
  return commonScopeMaterial(
    artifactKind,
    requireRecord(artifactKind, input, SCOPE_FIELDS),
  );
}

function parsePassMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewPassArtifactMaterial {
  const value = requireRecord(artifactKind, input, PASS_FIELDS);
  return Object.freeze({
    passId: requireToken(artifactKind, 'passId', value.passId),
    eventStem: requireEventStem(artifactKind, value.eventStem),
    eventId: requireToken(artifactKind, 'eventId', value.eventId),
    authorityEpoch: requireAuthorityEpoch(artifactKind, value.authorityEpoch),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
      1,
    ),
    selectedTargetDigests: requireDigestArray(
      artifactKind,
      'selectedTargetDigests',
      value.selectedTargetDigests,
      1,
    ),
    searchLedgerDigest: requireDigest(artifactKind, 'searchLedgerDigest', value.searchLedgerDigest),
    diagnosticsDigest: requireDigest(artifactKind, 'diagnosticsDigest', value.diagnosticsDigest),
    observationDigests: requireDigestArray(
      artifactKind,
      'observationDigests',
      value.observationDigests,
      1,
    ),
    graphEventDigest: requireDigest(artifactKind, 'graphEventDigest', value.graphEventDigest),
    iterationDigest: requireDigest(artifactKind, 'iterationDigest', value.iterationDigest),
    deltaDigest: requireDigest(artifactKind, 'deltaDigest', value.deltaDigest),
    dependencies: requireDependencies(artifactKind, value.dependencies),
    locator: requireLocator(artifactKind, value.locator),
    passVersion: requireToken(artifactKind, 'passVersion', value.passVersion),
  });
}

function parseCandidateMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewCandidateArtifactMaterial {
  const value = requireRecord(artifactKind, input, CANDIDATE_FIELDS);
  return Object.freeze({
    candidateId: requireToken(artifactKind, 'candidateId', value.candidateId),
    eventStem: requireEventStem(artifactKind, value.eventStem),
    eventId: requireToken(artifactKind, 'eventId', value.eventId),
    authorityEpoch: requireAuthorityEpoch(artifactKind, value.authorityEpoch),
    claimDigest: requireDigest(artifactKind, 'claimDigest', value.claimDigest),
    evidenceDigests: requireDigestArray(artifactKind, 'evidenceDigests', value.evidenceDigests, 1),
    intermediateFactDigests: requireDigestArray(
      artifactKind,
      'intermediateFactDigests',
      value.intermediateFactDigests,
      1,
    ),
    reproductionDigest: requireDigest(artifactKind, 'reproductionDigest', value.reproductionDigest),
    refutationDigest: requireDigest(artifactKind, 'refutationDigest', value.refutationDigest),
    rawScore: requireRatio(artifactKind, 'rawScore', value.rawScore),
    confidence: requireRatio(artifactKind, 'confidence', value.confidence),
    impact: requireRatio(artifactKind, 'impact', value.impact),
    reachability: requireRatio(artifactKind, 'reachability', value.reachability),
    exploitability: requireRatio(artifactKind, 'exploitability', value.exploitability),
    evidenceStrength: requireEnum(
      artifactKind,
      'evidenceStrength',
      value.evidenceStrength,
      ['direct', 'limited', 'substantial'],
    ),
    evidenceScope: requireEnum(
      artifactKind,
      'evidenceScope',
      value.evidenceScope,
      ['complete', 'partial', 'targeted'],
    ),
    dependencies: requireDependencies(artifactKind, value.dependencies),
    locator: requireLocator(artifactKind, value.locator),
    candidateVersion: requireToken(artifactKind, 'candidateVersion', value.candidateVersion),
  });
}

function parseConvergenceMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewConvergenceArtifactMaterial {
  const value = requireRecord(artifactKind, input, CONVERGENCE_FIELDS);
  const gateResultDigests = requireDigestArray(
    artifactKind,
    'gateResultDigests',
    value.gateResultDigests,
    9,
  );
  if (gateResultDigests.length !== 9) return invalidMaterial(artifactKind, 'gateResultDigests');
  return Object.freeze({
    witnessId: requireToken(artifactKind, 'witnessId', value.witnessId),
    eventStem: requireEventStem(artifactKind, value.eventStem),
    eventId: requireToken(artifactKind, 'eventId', value.eventId),
    authorityEpoch: requireAuthorityEpoch(artifactKind, value.authorityEpoch),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
      1,
    ),
    stateHistoryDigest: requireDigest(artifactKind, 'stateHistoryDigest', value.stateHistoryDigest),
    findingsRegistryInputDigest: requireDigest(
      artifactKind,
      'findingsRegistryInputDigest',
      value.findingsRegistryInputDigest,
    ),
    coverageDigest: requireDigest(artifactKind, 'coverageDigest', value.coverageDigest),
    gateResultDigests,
    graphConvergenceDigest: requireDigest(
      artifactKind,
      'graphConvergenceDigest',
      value.graphConvergenceDigest,
    ),
    decision: requireEnum(
      artifactKind,
      'decision',
      value.decision,
      ['blocked', 'continue', 'converged', 'incomplete', 'recover'],
    ),
    recoveryDecision: requireEnum(
      artifactKind,
      'recoveryDecision',
      value.recoveryDecision,
      ['blocked', 'continue', 'recover', 'none'],
    ),
    dependencies: requireDependencies(artifactKind, value.dependencies),
    locator: requireLocator(artifactKind, value.locator),
    evaluatorVersion: requireToken(artifactKind, 'evaluatorVersion', value.evaluatorVersion),
  });
}

function parseSynthesisMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewSynthesisArtifactMaterial {
  const value = requireRecord(artifactKind, input, SYNTHESIS_FIELDS);
  return Object.freeze({
    outputId: requireToken(artifactKind, 'outputId', value.outputId),
    eventStem: requireEventStem(artifactKind, value.eventStem),
    eventId: requireToken(artifactKind, 'eventId', value.eventId),
    authorityEpoch: requireAuthorityEpoch(artifactKind, value.authorityEpoch),
    orderedInputDigests: requireDigestArray(
      artifactKind,
      'orderedInputDigests',
      value.orderedInputDigests,
      1,
    ),
    findingsRegistryDigest: requireDigest(
      artifactKind,
      'findingsRegistryDigest',
      value.findingsRegistryDigest,
    ),
    dashboardDigest: requireDigest(artifactKind, 'dashboardDigest', value.dashboardDigest),
    resourceMapDigest: value.resourceMapDigest === null
      ? null
      : requireDigest(artifactKind, 'resourceMapDigest', value.resourceMapDigest),
    reportDigest: requireDigest(artifactKind, 'reportDigest', value.reportDigest),
    unresolvedFindingDigests: requireDigestArray(
      artifactKind,
      'unresolvedFindingDigests',
      value.unresolvedFindingDigests,
    ),
    verdict: requireEnum(
      artifactKind,
      'verdict',
      value.verdict,
      ['blocked', 'fail', 'incomplete', 'pass'],
    ),
    advisoryState: requireEnum(
      artifactKind,
      'advisoryState',
      value.advisoryState,
      ['advisory', 'blocked', 'ready', 'unavailable'],
    ),
    reducerVersion: requireToken(artifactKind, 'reducerVersion', value.reducerVersion),
    projectionVersion: requireToken(artifactKind, 'projectionVersion', value.projectionVersion),
    dependencies: requireDependencies(artifactKind, value.dependencies),
    locator: requireLocator(artifactKind, value.locator),
  });
}

function parseResumeMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewResumeArtifactMaterial {
  const value = requireRecord(artifactKind, input, RESUME_FIELDS);
  return Object.freeze({
    handoffId: requireToken(artifactKind, 'handoffId', value.handoffId),
    eventStem: requireEventStem(artifactKind, value.eventStem),
    eventId: requireToken(artifactKind, 'eventId', value.eventId),
    authorityEpoch: requireAuthorityEpoch(artifactKind, value.authorityEpoch),
    priorReferenceSetDigest: requireDigest(
      artifactKind,
      'priorReferenceSetDigest',
      value.priorReferenceSetDigest,
    ),
    changedInputDigest: requireDigest(artifactKind, 'changedInputDigest', value.changedInputDigest),
    affectedFindingDigests: requireDigestArray(
      artifactKind,
      'affectedFindingDigests',
      value.affectedFindingDigests,
    ),
    affectedReportDigests: requireDigestArray(
      artifactKind,
      'affectedReportDigests',
      value.affectedReportDigests,
    ),
    continuityPointer: requireToken(artifactKind, 'continuityPointer', value.continuityPointer),
    driftDisposition: requireEnum(
      artifactKind,
      'driftDisposition',
      value.driftDisposition,
      ['changed', 'missing', 'unchanged', 'unverifiable'],
    ),
    dependencies: requireDependencies(artifactKind, value.dependencies),
    locator: requireLocator(artifactKind, value.locator),
    handoffVersion: requireToken(artifactKind, 'handoffVersion', value.handoffVersion),
  });
}

export function parseDeepReviewArtifactMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): DeepReviewArtifactMaterial {
  switch (artifactKind) {
    case DeepReviewArtifactKinds.TARGET_SNAPSHOT:
    case DeepReviewArtifactKinds.SCOPE_REFERENCE_SET:
    case DeepReviewArtifactKinds.REVIEW_CONTRACT:
    case DeepReviewArtifactKinds.CONTEXT_SNAPSHOT:
    case DeepReviewArtifactKinds.CAPABILITY_COMMITMENT:
    case DeepReviewArtifactKinds.PROMPT_RUBRIC:
    case DeepReviewArtifactKinds.POLICY_INPUT:
      return parseScopeMaterial(artifactKind, input);
    case DeepReviewArtifactKinds.DIMENSION_PASS:
      return parsePassMaterial(artifactKind, input);
    case DeepReviewArtifactKinds.CANDIDATE_EVIDENCE:
    case DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE:
      return parseCandidateMaterial(artifactKind, input);
    case DeepReviewArtifactKinds.CONVERGENCE_WITNESS:
      return parseConvergenceMaterial(artifactKind, input);
    case DeepReviewArtifactKinds.SYNTHESIS_VIEW:
    case DeepReviewArtifactKinds.SYNTHESIS_REPORT:
      return parseSynthesisMaterial(artifactKind, input);
    case DeepReviewArtifactKinds.RESUME_HANDOFF:
      return parseResumeMaterial(artifactKind, input);
    default:
      return unsupportedArtifactKind(artifactKind);
  }
}

function unsupportedArtifactKind(artifactKind: never): never {
  throw new SealedArtifactError(
    SealedArtifactErrorCodes.UNSUPPORTED_ARTIFACT_KIND,
    'canonicalization',
    'Deep Review artifact kind is not registered',
    { artifactKind: String(artifactKind) },
  );
}

function canonicalizeDeepReviewMaterial(
  artifactKind: DeepReviewArtifactKind,
  input: unknown,
): Uint8Array {
  const material = parseDeepReviewArtifactMaterial(artifactKind, input);
  return Uint8Array.from(canonicalBytes({ artifactKind, material }));
}

// Register closed mode profiles while leaving digest, storage, and verification to the shared store.
export function createDeepReviewArtifactCanonicalizerRegistry(): ArtifactCanonicalizerRegistry {
  const definitions: ArtifactCanonicalizerDefinition[] =
    DEEP_REVIEW_ARTIFACT_KIND_REGISTRY.map((entry) => ({
      artifactKind: entry.artifactKind,
      canonicalizationVersion: entry.canonicalizationVersion,
      mediaType: entry.mediaType,
      implementationIdentity: 'deep-review-binding-canonicalizer-v1',
      canonicalize: (input: unknown): Uint8Array => (
        canonicalizeDeepReviewMaterial(entry.artifactKind, input)
      ),
    }));
  const sharedRegistry = createArtifactCanonicalizerRegistry();
  const sharedDefinitions: ArtifactCanonicalizerDefinition[] =
    Object.values(InitialArtifactKinds).map((artifactKind) => {
      const profile = sharedRegistry.describe(
        artifactKind,
        DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
      );
      return {
        artifactKind,
        canonicalizationVersion: DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
        mediaType: DEFAULT_ARTIFACT_MEDIA_TYPE,
        implementationIdentity: profile.implementationIdentity,
        canonicalize: (input: unknown): Uint8Array => (
          sharedRegistry.canonicalize(
            artifactKind,
            DEFAULT_ARTIFACT_CANONICALIZATION_VERSION,
            input,
          ).bytes
        ),
      };
    });
  return new ArtifactCanonicalizerRegistry([...definitions, ...sharedDefinitions]);
}

export function deepReviewMaterialFromCanonicalBytes(
  artifactKind: DeepReviewArtifactKind,
  bytes: readonly number[],
): DeepReviewArtifactMaterial {
  let value: unknown;
  try {
    value = JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
  } catch {
    return invalidMaterial(artifactKind, 'canonical-bytes');
  }
  if (!isRecord(value) || !hasExactFields(value, ['artifactKind', 'material'])) {
    return invalidMaterial(artifactKind, 'canonical-bytes.shape');
  }
  if (value.artifactKind !== artifactKind) {
    return invalidMaterial(artifactKind, 'canonical-bytes.artifactKind');
  }
  const material = parseDeepReviewArtifactMaterial(artifactKind, value.material);
  const expectedBytes = canonicalizeDeepReviewMaterial(artifactKind, material);
  if (Buffer.compare(Buffer.from(expectedBytes), Buffer.from(bytes)) !== 0) {
    return invalidMaterial(artifactKind, 'canonical-bytes.encoding');
  }
  return material;
}
