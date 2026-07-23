// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Sealed Artifact Tests
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
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY,
  DeepResearchArtifactKinds,
  createDeepResearchSealedArtifactStore,
  readDeepResearchArtifact,
  sealDeepResearchArtifact,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  DeepResearchAnalysisArtifactMaterial,
  DeepResearchArtifactKind,
  DeepResearchArtifactMaterial,
  DeepResearchConvergenceArtifactMaterial,
  DeepResearchInputArtifactMaterial,
  DeepResearchMemoryHandoffArtifactMaterial,
  DeepResearchSealedArtifactBinding,
  DeepResearchSourceArtifactMaterial,
  DeepResearchSynthesisArtifactMaterial,
} from '../../lib/deep-research-sealed-artifacts/index.js';
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
  locatorDigest: DIGEST_A,
  selector: 'claim:primary#span-1',
  revision: 'revision-1',
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-research-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function inputMaterial(): DeepResearchInputArtifactMaterial {
  return {
    artifactId: 'input-1',
    materialDigest: DIGEST_B,
    materialRef: 'artifact:input-1',
    locator: LOCATOR,
    producerVersion: 'producer@1',
  };
}

function sourceMaterial(): DeepResearchSourceArtifactMaterial {
  return {
    sourceVersionId: 'source-version-1',
    sourceIdentityDigest: DIGEST_A,
    responseDigest: DIGEST_B,
    responseRef: 'artifact:source-response-1',
    retrievalMetadataDigest: DIGEST_C,
    extractionProfileDigest: DIGEST_D,
    normalizedPassageDigests: [DIGEST_A, DIGEST_B],
    locator: LOCATOR,
    captureVersion: 'capture@1',
  };
}

function analysisMaterial(
  artifactKind: DeepResearchArtifactKind,
): DeepResearchAnalysisArtifactMaterial {
  const statuses = {
    [DeepResearchArtifactKinds.BRANCH_OBSERVATION]: 'observed',
    [DeepResearchArtifactKinds.ATOMIC_CLAIM]: 'supported',
    [DeepResearchArtifactKinds.EVIDENCE_SPAN]: 'admitted',
    [DeepResearchArtifactKinds.CROSS_VALIDATION]: 'confirmed',
    [DeepResearchArtifactKinds.UNRESOLVED_STATE]: 'unresolved',
    [DeepResearchArtifactKinds.CONTRADICTION_OBLIGATION]: 'open',
  } as const;
  const status = statuses[artifactKind as keyof typeof statuses];
  if (!status) throw new Error(`No analysis status fixture for ${artifactKind}`);
  return {
    observationId: 'observation-1',
    observationDigest: DIGEST_A,
    observationRef: 'artifact:observation-1',
    sourceArtifactDigest: DIGEST_B,
    evidenceDigests: [DIGEST_C, DIGEST_D],
    status,
    locator: LOCATOR,
    analysisVersion: 'analysis@1',
  };
}

function convergenceMaterial(
  artifactKind: DeepResearchArtifactKind,
): DeepResearchConvergenceArtifactMaterial {
  return {
    witnessId: 'witness-1',
    snapshotDigest: DIGEST_A,
    snapshotRef: 'artifact:frontier-snapshot-1',
    orderedInputDigests: [DIGEST_B, DIGEST_C],
    evaluatorVersion: 'evaluator@1',
    decision: artifactKind === DeepResearchArtifactKinds.CONVERGENCE_INPUT
      ? 'pending'
      : 'converged',
    locator: LOCATOR,
  };
}

function synthesisMaterial(
  artifactKind: DeepResearchArtifactKind,
): DeepResearchSynthesisArtifactMaterial {
  return {
    outputId: 'synthesis-output-1',
    outputDigest: DIGEST_A,
    outputRef: 'artifact:synthesis-output-1',
    orderedInputDigests: [DIGEST_B, DIGEST_C],
    reducerVersion: 'reducer@1',
    projectionVersion: 'projection@1',
    outputRole: artifactKind === DeepResearchArtifactKinds.SYNTHESIS_VIEW
      ? 'claim-evidence-view'
      : 'report',
    locator: LOCATOR,
  };
}

function handoffMaterial(): DeepResearchMemoryHandoffArtifactMaterial {
  return {
    handoffId: 'memory-handoff-1',
    finalReferenceSetDigest: DIGEST_A,
    continuityPayloadDigest: DIGEST_B,
    offeredViewDigest: DIGEST_C,
    offeredViewRef: 'artifact:offered-view-1',
    targetPacket: 'system-deep-loop/research-target',
    locator: LOCATOR,
    handoffVersion: 'handoff@1',
  };
}

function materialFor(artifactKind: DeepResearchArtifactKind): DeepResearchArtifactMaterial {
  switch (artifactKind) {
    case DeepResearchArtifactKinds.OBJECTIVE:
    case DeepResearchArtifactKinds.PLAN_FRONTIER:
    case DeepResearchArtifactKinds.SEARCH_RECIPE:
    case DeepResearchArtifactKinds.CAPABILITY_COMMITMENT:
    case DeepResearchArtifactKinds.MODE_CONFIGURATION:
    case DeepResearchArtifactKinds.POLICY_INPUT:
      return inputMaterial();
    case DeepResearchArtifactKinds.SOURCE_CAPTURE:
    case DeepResearchArtifactKinds.NORMALIZED_PASSAGE:
      return sourceMaterial();
    case DeepResearchArtifactKinds.BRANCH_OBSERVATION:
    case DeepResearchArtifactKinds.ATOMIC_CLAIM:
    case DeepResearchArtifactKinds.EVIDENCE_SPAN:
    case DeepResearchArtifactKinds.CROSS_VALIDATION:
    case DeepResearchArtifactKinds.UNRESOLVED_STATE:
    case DeepResearchArtifactKinds.CONTRADICTION_OBLIGATION:
      return analysisMaterial(artifactKind);
    case DeepResearchArtifactKinds.CONVERGENCE_INPUT:
    case DeepResearchArtifactKinds.CONVERGENCE_WITNESS:
      return convergenceMaterial(artifactKind);
    case DeepResearchArtifactKinds.SYNTHESIS_VIEW:
    case DeepResearchArtifactKinds.SYNTHESIS_REPORT:
      return synthesisMaterial(artifactKind);
    case DeepResearchArtifactKinds.MEMORY_HANDOFF:
      return handoffMaterial();
    default: {
      const exhaustiveKind: never = artifactKind;
      throw new Error(`No material fixture for ${String(exhaustiveKind)}`);
    }
  }
}

function bindingFor(
  artifactKind: DeepResearchArtifactKind,
  reference: SealedArtifactReference,
): DeepResearchSealedArtifactBinding {
  return {
    bindingVersion: 1,
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

describe('deep research sealed artifacts', () => {
  it('registers and seals every lifecycle kind through the shared store', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('all-kinds'),
    });
    expect(DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind)).toEqual(
      Object.values(DeepResearchArtifactKinds),
    );

    for (const artifactKind of Object.values(DeepResearchArtifactKinds)) {
      const binding = await sealDeepResearchArtifact(
        store,
        artifactKind,
        materialFor(artifactKind),
      );
      const verified = await readDeepResearchArtifact(store, binding);
      expect(binding.reference.artifact_kind).toBe(artifactKind);
      expect(binding.eventReference).toBe(`artifact:${binding.reference.qualified_digest}`);
      expect(verified.descriptor.artifact_kind).toBe(artifactKind);
      expect(Buffer.from(verified.bytes).toString('utf8')).toContain(artifactKind);
    }
  });

  it('reproduces the same shared digest for repeated equivalent seals', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('deterministic'),
    });
    const first = await sealDeepResearchArtifact(
      store,
      DeepResearchArtifactKinds.SYNTHESIS_REPORT,
      synthesisMaterial(DeepResearchArtifactKinds.SYNTHESIS_REPORT),
    );
    const reordered = {
      locator: LOCATOR,
      outputRole: 'report' as const,
      projectionVersion: 'projection@1',
      reducerVersion: 'reducer@1',
      orderedInputDigests: [DIGEST_B, DIGEST_C],
      outputRef: 'artifact:synthesis-output-1',
      outputDigest: DIGEST_A,
      outputId: 'synthesis-output-1',
    };
    const second = await sealDeepResearchArtifact(
      store,
      DeepResearchArtifactKinds.SYNTHESIS_REPORT,
      reordered,
    );
    expect(second.reference).toEqual(first.reference);
  });

  it('rejects mutable bodies, prose-like selectors, and wrong per-kind enums', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('closed-fields'),
    });
    const withMutableBody = {
      ...synthesisMaterial(DeepResearchArtifactKinds.SYNTHESIS_REPORT),
      reportText: 'mutable report body',
    } as unknown as DeepResearchSynthesisArtifactMaterial;
    await expectArtifactFailure(
      sealDeepResearchArtifact(
        store,
        DeepResearchArtifactKinds.SYNTHESIS_REPORT,
        withMutableBody,
      ),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const proseSelector = {
      ...inputMaterial(),
      locator: {
        ...LOCATOR,
        selector: Array.from({ length: 18 }, () => 'mutable').join(' '),
      },
    };
    await expectArtifactFailure(
      sealDeepResearchArtifact(store, DeepResearchArtifactKinds.OBJECTIVE, proseSelector),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const wrongRole = {
      ...synthesisMaterial(DeepResearchArtifactKinds.SYNTHESIS_REPORT),
      outputRole: 'claim-evidence-view' as const,
    };
    await expectArtifactFailure(
      sealDeepResearchArtifact(store, DeepResearchArtifactKinds.SYNTHESIS_REPORT, wrongRole),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('blocks mutable and unsealed bindings before any bytes are released', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('unsealed'),
    });
    await expectArtifactFailure(
      readDeepResearchArtifact(store, { reportBody: 'not-a-binding' }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const artifactKind = DeepResearchArtifactKinds.OBJECTIVE;
    const derived = store.derive(artifactKind, inputMaterial(), {
      canonicalizationVersion: 'deep-research-binding@1',
      mediaType: 'application/vnd.openai.deep-research-binding+json',
    });
    await expectArtifactFailure(
      readDeepResearchArtifact(store, bindingFor(artifactKind, derived.reference)),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('fails closed when a digest-addressed reference is tampered', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('tampered-reference'),
    });
    const binding = await sealDeepResearchArtifact(
      store,
      DeepResearchArtifactKinds.CONVERGENCE_WITNESS,
      convergenceMaterial(DeepResearchArtifactKinds.CONVERGENCE_WITNESS),
    );
    const tamperedReference = {
      ...binding.reference,
      content_digest: DIGEST_D,
      qualified_digest: `sha256:${DIGEST_D}`,
    };
    await expectArtifactFailure(
      readDeepResearchArtifact(
        store,
        bindingFor(DeepResearchArtifactKinds.CONVERGENCE_WITNESS, tamperedReference),
      ),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('fails closed when sealed bytes no longer match their digest', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('tampered-bytes'),
    });
    const binding = await sealDeepResearchArtifact(
      store,
      DeepResearchArtifactKinds.SYNTHESIS_REPORT,
      synthesisMaterial(DeepResearchArtifactKinds.SYNTHESIS_REPORT),
    );
    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{"tampered":true}'));
    await expectArtifactFailure(
      readDeepResearchArtifact(store, binding),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );
  });

  it('keeps a partially published capsule unreachable', async () => {
    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('partial-publication'),
      faultInjection,
    });
    const artifactKind = DeepResearchArtifactKinds.MEMORY_HANDOFF;
    const material = handoffMaterial();
    const derived = store.derive(artifactKind, material, {
      canonicalizationVersion: 'deep-research-binding@1',
      mediaType: 'application/vnd.openai.deep-research-binding+json',
    });
    await expect(
      sealDeepResearchArtifact(store, artifactKind, material),
    ).rejects.toThrow('publication interrupted');
    expect(existsSync(store.inspectPaths(derived.reference).referencePath)).toBe(false);
    await expectArtifactFailure(
      readDeepResearchArtifact(store, bindingFor(artifactKind, derived.reference)),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('rejects wrong-kind and event-reference substitution before verified use', async () => {
    const store = createDeepResearchSealedArtifactStore({
      rootDirectory: temporaryRoot('binding-substitution'),
    });
    const binding = await sealDeepResearchArtifact(
      store,
      DeepResearchArtifactKinds.OBJECTIVE,
      inputMaterial(),
    );
    await expectArtifactFailure(
      readDeepResearchArtifact(store, {
        ...binding,
        artifactKind: DeepResearchArtifactKinds.PLAN_FRONTIER,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    await expectArtifactFailure(
      readDeepResearchArtifact(store, {
        ...binding,
        eventReference: `artifact:sha256:${DIGEST_D}`,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });
});
