// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Sealed Artifact Tests
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
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY,
  DeepAiCouncilArtifactKinds,
  createDeepAiCouncilSealedArtifactStore,
  readDeepAiCouncilArtifact,
  sealDeepAiCouncilArtifact,
} from '../../lib/deep-ai-council-sealed-artifacts/index.js';
import {
  DeepAiCouncilEventStems,
} from '../../lib/deep-ai-council-ledger-schema/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactMaterial,
  DeepAiCouncilArtifactReadExpectations,
  DeepAiCouncilSealedArtifactBinding,
} from '../../lib/deep-ai-council-sealed-artifacts/index.js';
import type {
  ArtifactStoreFaultInjection,
  SealedArtifactReference,
} from '../../lib/sealed-reference-artifacts/index.js';

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DIGEST_C = 'c'.repeat(64);
const temporaryRoots: string[] = [];

const LOCATOR = Object.freeze({
  scheme: 'artifact' as const,
  locatorDigest: DIGEST_A,
  selector: 'artifact:material-1',
  revision: 'revision-1',
});

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `deep-ai-council-sealed-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function visibilityFor(kind: DeepAiCouncilArtifactKind):
  'public' | 'private-seat' | 'blinded' | 'judge' | 'test-gate' {
  switch (kind) {
    case DeepAiCouncilArtifactKinds.PROMPT_CAPABILITY:
    case DeepAiCouncilArtifactKinds.SEAT_ROSTER:
    case DeepAiCouncilArtifactKinds.REASONING_METHOD:
    case DeepAiCouncilArtifactKinds.SEAT_PROPOSAL:
    case DeepAiCouncilArtifactKinds.CRITIQUE_RECORD:
    case DeepAiCouncilArtifactKinds.STANCE_EVIDENCE:
      return 'private-seat';
    case DeepAiCouncilArtifactKinds.BLINDED_CANDIDATE:
      return 'blinded';
    case DeepAiCouncilArtifactKinds.PAIRWISE_JUDGMENT:
    case DeepAiCouncilArtifactKinds.BIAS_PROBE:
    case DeepAiCouncilArtifactKinds.COUNTERFACTUAL_PROBE:
      return 'judge';
    case DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE:
      return 'test-gate';
    default:
      return 'public';
  }
}

function materialFor(
  kind: DeepAiCouncilArtifactKind,
  artifactId = 'artifact-1',
  dependencyDigests: readonly string[] = [DIGEST_B],
  authorityEpoch = 1,
): DeepAiCouncilArtifactMaterial {
  return {
    artifactId,
    materialDigest: DIGEST_A,
    materialRef: `artifact:${artifactId}`,
    scope: {
      runId: 'run-1',
      roundId: 'round-1',
      artifactId,
    },
    sourceEventRange: {
      firstEventId: 'event-1',
      lastEventId: 'event-2',
      firstStem: DeepAiCouncilEventStems[0],
      lastStem: DeepAiCouncilEventStems[20],
    },
    schemaVersion: 'schema@1',
    policyVersion: 'policy@1',
    replayFingerprint: DIGEST_C,
    authorityEpoch,
    dependencyDigests,
    visibility: visibilityFor(kind),
    supersedesArtifactDigest: null,
    locator: LOCATOR,
    producerVersion: 'producer@1',
  };
}

function bindingFor(
  artifactKind: DeepAiCouncilArtifactKind,
  reference: SealedArtifactReference,
): DeepAiCouncilSealedArtifactBinding {
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

describe('deep AI council sealed artifacts', () => {
  it('registers and seals every council input and output kind through the shared store', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('all-kinds'),
    });
    expect(DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY.map((entry) => entry.artifactKind)).toEqual(
      Object.values(DeepAiCouncilArtifactKinds),
    );

    for (const artifactKind of Object.values(DeepAiCouncilArtifactKinds)) {
      const binding = await sealDeepAiCouncilArtifact(
        store,
        artifactKind,
        materialFor(artifactKind),
      );
      const verified = await readDeepAiCouncilArtifact(store, binding, {
        expectedAuthorityEpoch: 1,
        expectedReplayFingerprint: DIGEST_C,
        expectedScope: materialFor(artifactKind).scope,
        allowedVisibility: [visibilityFor(artifactKind)],
      });
      expect(binding.reference.artifact_kind).toBe(artifactKind);
      expect(binding.eventReference).toBe(`artifact:${binding.reference.qualified_digest}`);
      expect(verified.descriptor.artifact_kind).toBe(artifactKind);
      expect(Buffer.from(verified.bytes).toString('utf8')).toContain(artifactKind);
    }
  });

  it('reproduces the same digest for repeated equivalent canonical materials', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('deterministic'),
    });
    const kind = DeepAiCouncilArtifactKinds.SYNTHESIS;
    const first = await sealDeepAiCouncilArtifact(store, kind, materialFor(kind));
    const original = materialFor(kind);
    const reordered = {
      producerVersion: original.producerVersion,
      locator: original.locator,
      supersedesArtifactDigest: original.supersedesArtifactDigest,
      visibility: original.visibility,
      dependencyDigests: original.dependencyDigests,
      authorityEpoch: original.authorityEpoch,
      replayFingerprint: original.replayFingerprint,
      policyVersion: original.policyVersion,
      schemaVersion: original.schemaVersion,
      sourceEventRange: original.sourceEventRange,
      scope: original.scope,
      materialRef: original.materialRef,
      materialDigest: original.materialDigest,
      artifactId: original.artifactId,
    };
    const second = await sealDeepAiCouncilArtifact(store, kind, reordered);
    expect(second.reference).toEqual(first.reference);
  });

  it('rejects mutable bodies, prose selectors, open fields, and invalid digests', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('closed-fields'),
    });
    const kind = DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT;
    const withMutableBody = {
      ...materialFor(kind),
      reportBody: 'mutable council report',
    } as unknown as DeepAiCouncilArtifactMaterial;
    await expectArtifactFailure(
      sealDeepAiCouncilArtifact(store, kind, withMutableBody),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const proseSelector = {
      ...materialFor(DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT),
      locator: {
        ...LOCATOR,
        selector: 'this is mutable report prose rather than a structured selector',
      },
    };
    await expectArtifactFailure(
      sealDeepAiCouncilArtifact(store, DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT, proseSelector),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const invalidDependency = {
      ...materialFor(kind),
      dependencyDigests: ['missing-dependency'],
    };
    await expectArtifactFailure(
      sealDeepAiCouncilArtifact(store, kind, invalidDependency),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });

  it('blocks mutable and unsealed bindings before releasing bytes', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('unsealed'),
    });
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, { reportBody: 'not-a-binding' }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );

    const kind = DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT;
    const derived = store.derive(kind, materialFor(kind), {
      canonicalizationVersion: 'deep-ai-council-binding@1',
      mediaType: 'application/vnd.openai.deep-ai-council-binding+json',
    });
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, bindingFor(kind, derived.reference)),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('fails closed for a tampered digest-addressed reference', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('tampered-reference'),
    });
    const kind = DeepAiCouncilArtifactKinds.CONVERGENCE_EVIDENCE;
    const binding = await sealDeepAiCouncilArtifact(store, kind, materialFor(kind));
    const tamperedReference = {
      ...binding.reference,
      content_digest: DIGEST_B,
      qualified_digest: `sha256:${DIGEST_B}`,
    };
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, bindingFor(kind, tamperedReference)),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('fails closed when stored bytes are tampered or truncated', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('tampered-bytes'),
    });
    const kind = DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT;
    const binding = await sealDeepAiCouncilArtifact(store, kind, materialFor(kind));
    const paths = store.inspectPaths(binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{"truncated":'));
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, binding),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );
  });

  it('keeps a partially published capsule unreachable', async () => {
    const faultInjection: ArtifactStoreFaultInjection = {
      beforeReferencePublication: (): void => {
        throw new Error('publication interrupted');
      },
    };
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('partial-publication'),
      faultInjection,
    });
    const kind = DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE;
    const material = materialFor(kind);
    const derived = store.derive(kind, material, {
      canonicalizationVersion: 'deep-ai-council-binding@1',
      mediaType: 'application/vnd.openai.deep-ai-council-binding+json',
    });
    await expect(sealDeepAiCouncilArtifact(store, kind, material)).rejects.toThrow(
      'publication interrupted',
    );
    expect(existsSync(store.inspectPaths(derived.reference).referencePath)).toBe(false);
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, bindingFor(kind, derived.reference)),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
  });

  it('blocks missing dependencies and stale epochs before verified use', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('context-gates'),
    });
    const dependencyKind = DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT;
    const dependency = store.derive(
      dependencyKind,
      materialFor(dependencyKind, 'dependency-1', []),
      {
        canonicalizationVersion: 'deep-ai-council-binding@1',
        mediaType: 'application/vnd.openai.deep-ai-council-binding+json',
      },
    );
    const kind = DeepAiCouncilArtifactKinds.SEAT_PROPOSAL;
    const binding = await sealDeepAiCouncilArtifact(
      store,
      kind,
      materialFor(kind, 'proposal-1', [dependency.reference.content_digest]),
    );
    const missingDependencyExpectation: DeepAiCouncilArtifactReadExpectations = {
      requiredDependencyReferences: [dependency.reference],
    };
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, binding, missingDependencyExpectation),
      SealedArtifactErrorCodes.ARTIFACT_MISSING,
    );
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, binding, { expectedAuthorityEpoch: 2 }),
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
    );
  });

  it('rejects wrong-kind and event-reference substitution before verified use', async () => {
    const store = createDeepAiCouncilSealedArtifactStore({
      rootDirectory: temporaryRoot('binding-substitution'),
    });
    const kind = DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT;
    const binding = await sealDeepAiCouncilArtifact(store, kind, materialFor(kind));
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, {
        ...binding,
        artifactKind: DeepAiCouncilArtifactKinds.TASK_CLASS,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
    await expectArtifactFailure(
      readDeepAiCouncilArtifact(store, {
        ...binding,
        eventReference: `artifact:sha256:${DIGEST_B}`,
      }),
      SealedArtifactErrorCodes.INVALID_INPUT,
    );
  });
});
