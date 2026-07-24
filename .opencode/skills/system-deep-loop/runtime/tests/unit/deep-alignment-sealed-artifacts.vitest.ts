// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Sealed Artifact Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY,
  DeepAlignmentArtifactKinds,
  createDeepAlignmentSealedArtifactStore,
  deepAlignmentDependency,
  readDeepAlignmentArtifact,
  sealDeepAlignmentArtifact,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
import {
  DeepAlignmentEventStems,
} from '../../lib/deep-alignment-ledger-schema/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  SealedArtifactStore,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  DeepAlignmentApplicabilityDecisionMaterial,
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentAuthorityCapsuleMaterial,
  DeepAlignmentConvergenceSnapshotMaterial,
  DeepAlignmentDiscoveryManifestMaterial,
  DeepAlignmentFindingEvidenceMaterial,
  DeepAlignmentGovernedExceptionMaterial,
  DeepAlignmentLaneConfigurationMaterial,
  DeepAlignmentReportMaterial,
  DeepAlignmentResumeSaveHandoffMaterial,
  DeepAlignmentRuleManifestMaterial,
  DeepAlignmentTargetSnapshotMaterial,
  DeepAlignmentVerificationInputMaterial,
  DeepAlignmentWitnessMatrixMaterial,
} from '../../lib/deep-alignment-sealed-artifacts/index.js';
import type {
  ArtifactStoreFaultInjection,
  SealedArtifactReference,
} from '../../lib/sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DIGEST_C = 'c'.repeat(64);
const DIGEST_D = 'd'.repeat(64);
const temporaryRoots: string[] = [];

const LOCATOR = Object.freeze({
  scheme: 'artifact' as const,
  artifactRef: 'artifact:subject-1',
  locatorDigest: DIGEST_A,
  selector: 'paragraph:4#subject-1',
  revision: 'revision-1',
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-alignment-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function baseMaterial(artifactKind: DeepAlignmentArtifactKind) {
  return {
    artifactId: `${artifactKind}-1`,
    authorityEpochId: 'authority-epoch-1',
    materialDigest: DIGEST_A,
    materialRef: `artifact:${artifactKind}-1`,
    dependencies: [],
    locator: LOCATOR,
    producerVersion: 'producer@1',
  };
}

function authorityCapsule(): DeepAlignmentAuthorityCapsuleMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE),
    authorityId: 'authority-1',
    authoritySourceDigest: DIGEST_A,
    publisherId: 'publisher-1',
    compilerFingerprint: DIGEST_B,
    ruleManifestDigest: DIGEST_C,
    applicabilityPolicyDigest: DIGEST_D,
    capabilityDigest: DIGEST_A,
    coverageDigest: DIGEST_B,
    signatureDigest: DIGEST_C,
    expiresAt: '2099-01-01T00:00:00.000Z',
    rollbackRef: null,
    status: 'valid',
  };
}

function rolledBackAuthorityCapsule(): DeepAlignmentAuthorityCapsuleMaterial {
  return {
    ...authorityCapsule(),
    rollbackRef: 'rolled-back-from:authority-epoch-0',
  };
}

function laneConfiguration(): DeepAlignmentLaneConfigurationMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.LANE_CONFIGURATION),
    laneId: 'lane-1',
    artifactClass: 'standard',
    scopeDigest: DIGEST_A,
    adapterContractDigest: DIGEST_B,
    selectedCorpusDigest: DIGEST_C,
    omittedScopeDigest: DIGEST_D,
    unresolvedScopeDigest: DIGEST_A,
    protectedFilesDigest: DIGEST_B,
  };
}

function ruleManifest(): DeepAlignmentRuleManifestMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.RULE_MANIFEST),
    manifestId: 'rule-manifest-1',
    orderedRuleIds: ['rule-1', 'rule-2'],
    compilerFingerprint: DIGEST_A,
    ruleIrDigest: DIGEST_B,
    applicabilityPolicyDigest: DIGEST_C,
    ruleSchemaVersion: 'rules@1',
  };
}

function applicabilityDecision(): DeepAlignmentApplicabilityDecisionMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION),
    decisionId: 'decision-1',
    laneId: 'lane-1',
    subjectId: 'subject-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: DIGEST_A,
    predicateDigest: DIGEST_B,
    targetFactDigest: DIGEST_C,
    authorityValidationDigest: DIGEST_D,
    evaluatorFingerprint: DIGEST_A,
    result: 'applicable',
    reasonCode: 'predicate-matched',
  };
}

function discoveryManifest(): DeepAlignmentDiscoveryManifestMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST),
    manifestId: 'discovery-manifest-1',
    laneId: 'lane-1',
    adapterContractDigest: DIGEST_A,
    selectedScopeDigest: DIGEST_B,
    artifactDigests: [DIGEST_C, DIGEST_D],
    omittedScopeDigest: DIGEST_A,
    unresolvedScopeDigest: DIGEST_B,
    corpusPartitionDigest: DIGEST_C,
    watermarkDigest: DIGEST_D,
  };
}

function targetSnapshot(): DeepAlignmentTargetSnapshotMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT),
    targetId: 'target-1',
    laneId: 'lane-1',
    subjectId: 'subject-1',
    subjectType: 'artifact',
    sourceVersionDigest: DIGEST_A,
    subjectDigest: DIGEST_B,
    parentSnapshotDigest: null,
    snapshotDigest: DIGEST_C,
    capturedAt: '2026-07-23T00:00:00.000Z',
  };
}

function verificationInput(
  artifactKind: DeepAlignmentArtifactKind,
): DeepAlignmentVerificationInputMaterial {
  return {
    ...baseMaterial(artifactKind),
    inputId: `${artifactKind}-1`,
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: DIGEST_A,
    applicabilityDecisionDigest: DIGEST_B,
    inputDigest: DIGEST_C,
    sourceDigest: DIGEST_D,
    producerFingerprint: DIGEST_A,
    evidenceDigests: [DIGEST_B, DIGEST_C],
    inputRole: artifactKind === DeepAlignmentArtifactKinds.DETECTOR_INPUT
      ? 'detector'
      : 'verifier',
  };
}

function witnessMatrix(): DeepAlignmentWitnessMatrixMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.WITNESS_MATRIX),
    matrixId: 'witness-matrix-1',
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: DIGEST_A,
    witnessKinds: ['conforming', 'violating', 'boundary', 'relational', 'stateful'],
    witnessDigests: [DIGEST_B, DIGEST_C],
    replayRecipeDigests: [DIGEST_D],
    coverageGapDigests: [],
    sourceAuthorityEpochId: null,
    verifierFingerprint: DIGEST_A,
  };
}

function findingEvidence(): DeepAlignmentFindingEvidenceMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.FINDING_EVIDENCE),
    findingId: 'finding-1',
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: DIGEST_A,
    authorityDigest: DIGEST_B,
    applicabilityDecisionDigest: DIGEST_C,
    observationDigest: DIGEST_D,
    reProbeReceiptDigest: DIGEST_A,
    evidenceDigests: [DIGEST_B, DIGEST_C],
    verifierFingerprint: DIGEST_D,
    verifiedLevel: 'verified',
    evidenceClass: 'deterministic',
    severity: 'P1',
    confidence: 0.9,
  };
}

function governedException(): DeepAlignmentGovernedExceptionMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION),
    exceptionId: 'exception-1',
    findingDigest: DIGEST_A,
    laneId: 'lane-1',
    ruleId: 'rule-1',
    subjectSnapshotDigest: DIGEST_B,
    authorityDigest: DIGEST_C,
    ownerId: 'owner-1',
    issuerId: 'issuer-1',
    justificationReason: 'Accepted only for the bounded authority scope.',
    scopeDigest: DIGEST_D,
    verifierFingerprint: DIGEST_A,
    issuedAt: '2026-07-23T00:00:00.000Z',
    expiresAt: '2099-01-01T00:00:00.000Z',
    status: 'active',
    invalidationTriggers: ['authority-changed', 'subject-changed'],
    invalidationReason: null,
  };
}

function findingEvidenceBoundTo(
  authorityReference: SealedArtifactReference,
  authorityDigest = authorityReference.content_digest,
): DeepAlignmentFindingEvidenceMaterial {
  return {
    ...findingEvidence(),
    authorityDigest,
    dependencies: [
      deepAlignmentDependency(
        DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
        authorityReference,
      ),
    ],
  };
}

function governedExceptionBoundTo(
  findingReference: SealedArtifactReference,
  authorityReference: SealedArtifactReference,
  overrides: Partial<Pick<
    DeepAlignmentGovernedExceptionMaterial,
    'authorityDigest' | 'findingDigest' | 'issuerId'
  >> = {},
): DeepAlignmentGovernedExceptionMaterial {
  return {
    ...governedException(),
    findingDigest: findingReference.content_digest,
    authorityDigest: authorityReference.content_digest,
    issuerId: 'publisher-1',
    dependencies: [
      deepAlignmentDependency(
        DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
        findingReference,
      ),
      deepAlignmentDependency(
        DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
        authorityReference,
      ),
    ],
    ...overrides,
  };
}

function convergenceSnapshot(): DeepAlignmentConvergenceSnapshotMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT),
    snapshotId: 'convergence-1',
    laneId: 'lane-1',
    orderedInputDigests: [DIGEST_A, DIGEST_B],
    coverageDigest: DIGEST_C,
    stabilityDigest: DIGEST_D,
    findingsViewDigest: DIGEST_A,
    exceptionViewDigest: DIGEST_B,
    unresolvedFindingDigests: [],
    laneVerdict: 'conformant',
    evaluatorVersion: 'evaluator@1',
    watermarkDigest: DIGEST_C,
  };
}

function alignmentReport(): DeepAlignmentReportMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT),
    reportId: 'report-1',
    laneId: 'lane-1',
    orderedInputDigests: [DIGEST_A, DIGEST_B],
    convergenceSnapshotDigest: DIGEST_C,
    findingsViewDigest: DIGEST_D,
    exceptionViewDigest: DIGEST_A,
    unresolvedFindingDigests: [],
    laneVerdict: 'conformant',
    overallVerdict: 'conformant',
    reportDigest: DIGEST_B,
    reportRef: 'artifact:alignment-report-1',
    reducerVersion: 'reducer@1',
    projectionVersion: 'projection@1',
  };
}

function resumeSaveHandoff(): DeepAlignmentResumeSaveHandoffMaterial {
  return {
    ...baseMaterial(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF),
    handoffId: 'handoff-1',
    handoffRole: 'save',
    referenceSetDigest: DIGEST_A,
    priorLineageDigest: DIGEST_B,
    driftDigest: DIGEST_C,
    affectedLaneDigests: [DIGEST_D],
    affectedFindingDigests: [],
    continuityPayloadDigest: DIGEST_A,
    offeredViewDigest: DIGEST_B,
    offeredViewRef: 'artifact:alignment-view-1',
    targetPacket: 'deep-alignment/continuity',
    driftStatus: 'unchanged',
    handoffVersion: 'handoff@1',
  };
}

function materialFor(artifactKind: DeepAlignmentArtifactKind): DeepAlignmentArtifactMaterial {
  switch (artifactKind) {
    case DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE:
      return authorityCapsule();
    case DeepAlignmentArtifactKinds.LANE_CONFIGURATION:
      return laneConfiguration();
    case DeepAlignmentArtifactKinds.RULE_MANIFEST:
      return ruleManifest();
    case DeepAlignmentArtifactKinds.APPLICABILITY_DECISION:
      return applicabilityDecision();
    case DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST:
      return discoveryManifest();
    case DeepAlignmentArtifactKinds.TARGET_SNAPSHOT:
      return targetSnapshot();
    case DeepAlignmentArtifactKinds.DETECTOR_INPUT:
    case DeepAlignmentArtifactKinds.VERIFIER_INPUT:
      return verificationInput(artifactKind);
    case DeepAlignmentArtifactKinds.WITNESS_MATRIX:
      return witnessMatrix();
    case DeepAlignmentArtifactKinds.FINDING_EVIDENCE:
      return findingEvidence();
    case DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION:
      return governedException();
    case DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT:
      return convergenceSnapshot();
    case DeepAlignmentArtifactKinds.ALIGNMENT_REPORT:
      return alignmentReport();
    case DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF:
      return resumeSaveHandoff();
    default: {
      const exhaustiveKind: never = artifactKind;
      throw new Error(`No material fixture for ${String(exhaustiveKind)}`);
    }
  }
}

function bindingFor(
  artifactKind: DeepAlignmentArtifactKind,
  reference: SealedArtifactReference,
) {
  return {
    bindingVersion: 1 as const,
    artifactKind,
    eventReference: `artifact:${reference.qualified_digest}`,
    reference,
  };
}

async function expectArtifactFailure(
  operation: Promise<unknown>,
  code: string,
): Promise<SealedArtifactError> {
  try {
    await operation;
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(SealedArtifactError);
    const typed = error as SealedArtifactError;
    expect(typed.code).toBe(code);
    expect(typed).not.toHaveProperty('bytes');
    return typed;
  }
  throw new Error(`Expected artifact failure ${code}`);
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. MODE BINDING CONTRACT
// ───────────────────────────────────────────────────────────────────

describe('deep alignment sealed artifacts', () => {
  it('registers every alignment lifecycle kind and reads through the shared store', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('all-kinds'),
    });
    const substrateImportsReal = store instanceof SealedArtifactStore;
    expect(substrateImportsReal).toBe(true);
    expect(DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind)).toEqual(
      Object.values(DeepAlignmentArtifactKinds),
    );
    expect(DeepAlignmentEventStems).toContain('deep_alignment.authority_reference_bound');

    let authorityReference: SealedArtifactReference | undefined;
    let findingReference: SealedArtifactReference | undefined;
    for (const artifactKind of Object.values(DeepAlignmentArtifactKinds)) {
      let material = materialFor(artifactKind);
      if (artifactKind === DeepAlignmentArtifactKinds.FINDING_EVIDENCE) {
        if (authorityReference === undefined) throw new Error('Authority fixture was not sealed');
        material = findingEvidenceBoundTo(authorityReference);
      } else if (artifactKind === DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION) {
        if (authorityReference === undefined) throw new Error('Authority fixture was not sealed');
        if (findingReference === undefined) throw new Error('Finding fixture was not sealed');
        material = governedExceptionBoundTo(findingReference, authorityReference);
      }
      const binding = await sealDeepAlignmentArtifact(
        store,
        artifactKind,
        material,
      );
      if (artifactKind === DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE) {
        authorityReference = binding.reference;
      } else if (artifactKind === DeepAlignmentArtifactKinds.FINDING_EVIDENCE) {
        findingReference = binding.reference;
      }
      const verified = await readDeepAlignmentArtifact(store, binding, {
        expectedAuthorityEpochId: 'authority-epoch-1',
      });
      expect(binding.reference.artifact_kind).toBe(artifactKind);
      expect(binding.eventReference).toBe(`artifact:${binding.reference.qualified_digest}`);
      expect(verified.descriptor.artifact_kind).toBe(artifactKind);
      expect(Buffer.from(verified.bytes).toString('utf8')).toContain(artifactKind);
    }
  });

  it('reproduces the same digest for equivalent reordered material', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('deterministic'),
    });
    const first = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
      alignmentReport(),
    );
    const reordered = {
      ...alignmentReport(),
      projectionVersion: 'projection@1',
      reducerVersion: 'reducer@1',
      reportRef: 'artifact:alignment-report-1',
      reportDigest: DIGEST_B,
      overallVerdict: 'conformant' as const,
    };
    const second = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
      reordered,
    );
    expect(second.reference).toEqual(first.reference);
  });

  it('rejects mutable bodies, prose selectors, and wrong per-kind values', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('closed-fields'),
    });
    const withMutableBody = {
      ...alignmentReport(),
      reportText: 'mutable alignment report body',
    } as unknown as DeepAlignmentReportMaterial;
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(
        store,
        DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
        withMutableBody,
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const proseSelector = {
      ...targetSnapshot(),
      locator: {
        ...LOCATOR,
        selector: Array.from({ length: 18 }, () => 'mutable').join(' '),
      },
    };
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(store, DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, proseSelector),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const wrongVerdict = {
      ...convergenceSnapshot(),
      laneVerdict: 'pass' as never,
    } as unknown as DeepAlignmentConvergenceSnapshotMaterial;
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(
        store,
        DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT,
        wrongVerdict,
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('blocks unsealed and missing dependencies before bytes are released', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('dependencies'),
    });
    const authorityKind = DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE;
    const derivedAuthority = store.derive(authorityKind, authorityCapsule(), {
      canonicalizationVersion: 'deep-alignment-binding@1',
      mediaType: 'application/vnd.openai.deep-alignment-binding+json',
    });
    const missingDependencyMaterial = {
      ...alignmentReport(),
      dependencies: [deepAlignmentDependency(authorityKind, derivedAuthority.reference)],
    };
    const derivedReport = store.derive(
      DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
      missingDependencyMaterial,
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    );
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(
        store,
        DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
        missingDependencyMaterial,
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
    expect(existsSync(store.inspectPaths(derivedReport.reference).referencePath)).toBe(false);

    const authorityBinding = await sealDeepAlignmentArtifact(
      store,
      authorityKind,
      authorityCapsule(),
    );
    const reportWithDependency = {
      ...alignmentReport(),
      dependencies: [deepAlignmentDependency(authorityKind, authorityBinding.reference)],
    };
    const reportBinding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
      reportWithDependency,
    );
    const authorityPaths = store.inspectPaths(authorityBinding.reference);
    for (const path of [authorityPaths.referencePath, authorityPaths.descriptorPath, authorityPaths.blobPath]) {
      rmSync(path, { force: true });
    }
    await expectArtifactFailure(
      readDeepAlignmentArtifact(store, reportBinding),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('rejects finding evidence whose authority digest has no dependency', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('finding-fabricated-authority'),
    });
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(
        store,
        DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
        {
          ...findingEvidence(),
          authorityDigest: DIGEST_D,
          dependencies: [],
        },
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('rejects finding evidence whose authority scalar mismatches its verified dependency', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('finding-authority-mismatch'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      authorityCapsule(),
    );
    expect(authority.reference.content_digest).not.toBe(DIGEST_D);
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(
        store,
        DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
        findingEvidenceBoundTo(authority.reference, DIGEST_D),
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('rejects a rolled-back authority capsule on direct read', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('authority-rolled-back'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      rolledBackAuthorityCapsule(),
    );
    const failure = await expectArtifactFailure(
      readDeepAlignmentArtifact(store, authority),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    expect(failure.details).toEqual({
      artifactKind: DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      reason: 'rolled_back_authority',
    });
  });

  it('rejects finding evidence bound to a rolled-back authority capsule', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('finding-authority-rolled-back'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      rolledBackAuthorityCapsule(),
    );
    const finding = await store.seal(
      DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
      findingEvidenceBoundTo(authority.reference),
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    );
    const failure = await expectArtifactFailure(
      readDeepAlignmentArtifact(
        store,
        bindingFor(
          DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
          finding.artifact.reference,
        ),
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    expect(failure.details).toEqual({
      artifactKind: DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      reason: 'rolled_back_authority',
    });
  });

  it('rejects governed exceptions bound to a rolled-back authority capsule', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('exception-authority-rolled-back'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      rolledBackAuthorityCapsule(),
    );
    const finding = await store.seal(
      DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
      findingEvidenceBoundTo(authority.reference),
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    );
    const exception = await store.seal(
      DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
      governedExceptionBoundTo(finding.artifact.reference, authority.reference),
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    );
    const failure = await expectArtifactFailure(
      readDeepAlignmentArtifact(
        store,
        bindingFor(
          DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
          exception.artifact.reference,
        ),
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    expect(failure.details).toEqual({
      artifactKind: DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      reason: 'rolled_back_authority',
    });
  });

  it('seals and reads finding evidence bound to its verified authority dependency', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('finding-authority-bound'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      authorityCapsule(),
    );
    const finding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
      findingEvidenceBoundTo(authority.reference),
    );
    const verified = await readDeepAlignmentArtifact(store, finding);
    expect(verified.descriptor.artifact_kind).toBe(
      DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
    );
  });

  it('rejects governed exceptions whose named claims have no dependencies', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('exception-fabricated-claims'),
    });
    await expectArtifactFailure(
      sealDeepAlignmentArtifact(
        store,
        DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
        {
          ...governedException(),
          findingDigest: DIGEST_A,
          authorityDigest: DIGEST_B,
          issuerId: 'fabricated-issuer',
          dependencies: [],
        },
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('rejects each governed-exception scalar that mismatches verified dependencies', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('exception-claim-mismatch'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      authorityCapsule(),
    );
    const finding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
      findingEvidenceBoundTo(authority.reference),
    );
    const mismatches: ReadonlyArray<Partial<Pick<
      DeepAlignmentGovernedExceptionMaterial,
      'authorityDigest' | 'findingDigest' | 'issuerId'
    >>> = [
      { findingDigest: DIGEST_D },
      { authorityDigest: DIGEST_D },
      { issuerId: 'fabricated-issuer' },
    ];
    for (const mismatch of mismatches) {
      await expectArtifactFailure(
        sealDeepAlignmentArtifact(
          store,
          DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
          governedExceptionBoundTo(finding.reference, authority.reference, mismatch),
        ),
        SealedArtifactErrorCodes.INVALID_INPUT,
      );
    }
  });

  it('seals and reads a governed exception bound to verified finding and issuer authority', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('exception-claims-bound'),
    });
    const authority = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      authorityCapsule(),
    );
    const finding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
      findingEvidenceBoundTo(authority.reference),
    );
    const exception = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
      governedExceptionBoundTo(finding.reference, authority.reference),
    );
    const verified = await readDeepAlignmentArtifact(store, exception);
    expect(verified.descriptor.artifact_kind).toBe(
      DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
    );
  });

  it('blocks stale authority epochs before returning verified bytes', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('stale-epoch'),
    });
    const binding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
      targetSnapshot(),
    );
    await expectArtifactFailure(
      readDeepAlignmentArtifact(store, binding, {
        expectedAuthorityEpochId: 'authority-epoch-2',
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('fails closed for unsealed, tampered, and truncated references', async () => {
    const unsealedStore = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('unsealed'),
    });
    const unsealed = unsealedStore.derive(
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      authorityCapsule(),
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    );
    await expectArtifactFailure(
      readDeepAlignmentArtifact(
        unsealedStore,
        bindingFor(DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE, unsealed.reference),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );

    const tamperedStore = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('tampered'),
    });
    const binding = await sealDeepAlignmentArtifact(
      tamperedStore,
      DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
      targetSnapshot(),
    );
    const tamperedReference = {
      ...binding.reference,
      content_digest: DIGEST_D,
      qualified_digest: `sha256:${DIGEST_D}`,
    };
    await expectArtifactFailure(
      readDeepAlignmentArtifact(
        tamperedStore,
        bindingFor(DeepAlignmentArtifactKinds.TARGET_SNAPSHOT, tamperedReference),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );

    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const partialStore = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('partial'),
      faultInjection,
    });
    const partialMaterial = resumeSaveHandoff();
    const partialDerived = partialStore.derive(
      DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF,
      partialMaterial,
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    );
    await expect(partialStore.seal(
      DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF,
      partialMaterial,
      {
        canonicalizationVersion: 'deep-alignment-binding@1',
        mediaType: 'application/vnd.openai.deep-alignment-binding+json',
      },
    )).rejects.toThrow('publication interrupted');
    expect(existsSync(partialStore.inspectPaths(partialDerived.reference).referencePath)).toBe(false);
    await expectArtifactFailure(
      readDeepAlignmentArtifact(
        partialStore,
        bindingFor(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, partialDerived.reference),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('fails closed when sealed bytes no longer match their digest', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('tampered-bytes'),
    });
    const binding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.ALIGNMENT_REPORT,
      alignmentReport(),
    );
    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{"tampered":true}'));
    await expectArtifactFailure(
      readDeepAlignmentArtifact(store, binding),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );
  });

  it('rejects wrong-kind and event-reference substitution before verified use', async () => {
    const store = createDeepAlignmentSealedArtifactStore({
      rootDirectory: temporaryRoot('binding-substitution'),
    });
    const binding = await sealDeepAlignmentArtifact(
      store,
      DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE,
      authorityCapsule(),
    );
    await expectArtifactFailure(
      readDeepAlignmentArtifact(store, {
        ...binding,
        artifactKind: DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    await expectArtifactFailure(
      readDeepAlignmentArtifact(store, {
        ...binding,
        eventReference: `artifact:sha256:${DIGEST_D}`,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });
});
