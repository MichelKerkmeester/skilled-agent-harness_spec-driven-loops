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
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import {
  EventTypeRegistry,
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY,
  DeepResearchArtifactKinds,
  bindDeepResearchArtifactSet,
  canonicalDeepResearchArtifactSetBytes,
  compareDeepResearchArtifactSets,
  createDeepResearchSealedArtifactStore,
  deepResearchArtifactSetReplayInput,
  parseDeepResearchArtifactSet,
  readDeepResearchArtifact,
  sealDeepResearchArtifact,
} from '../../lib/deep-research-sealed-artifacts/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
  prepareArtifactSealedEvent,
  readVerifiedArtifactEvidence,
  recordArtifactEvent,
  sealedArtifactEventDefinitions,
} from '../../lib/sealed-reference-artifacts/index.js';

import type {
  AuthoritySnapshot,
  PolicyEvaluationInput,
  PolicyEvaluationResult,
} from '../../lib/authorized-ledger/index.js';
import type {
  DeepResearchAnalysisArtifactMaterial,
  DeepResearchArtifactSetContext,
  DeepResearchArtifactSetMemberInput,
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
  ArtifactAuthorizationContext,
  ArtifactEventMetadata,
  ArtifactEventRecorder,
  ArtifactStoreFaultInjection,
  SealedArtifactReference,
  SealedArtifactStore,
  VerifiedArtifactEvidence,
} from '../../lib/sealed-reference-artifacts/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);
const DIGEST_C = 'c'.repeat(64);
const DIGEST_D = 'd'.repeat(64);
const temporaryRoots: string[] = [];

const AUTHORITY: AuthoritySnapshot = Object.freeze({ state: 'shadowing', epoch: 1 });
const FIXED_TIME = '2026-07-22T00:00:00.000Z';
const STATE_DIGEST = sha256Bytes(canonicalBytes({ state: 'deep-research-artifact-set' }));
const ARTIFACT_SET_CONTEXT: DeepResearchArtifactSetContext = Object.freeze({
  runId: 'deep-research-run-1',
  lineageId: 'deep-research-lineage-1',
  generation: 1,
  sourceTailSequence: 23,
  replayContractDigest: DIGEST_D,
});

interface ArtifactEvidenceHarness {
  readonly registry: EventTypeRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly store: SealedArtifactStore;
  readonly recorder: ArtifactEventRecorder;
  readonly nextMetadata: (label: string) => ArtifactEventMetadata;
}

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

function evaluateArtifactPolicy(
  input: Readonly<PolicyEvaluationInput>,
): PolicyEvaluationResult {
  return input.capabilityId === 'deep-research-artifact-write'
    ? { verdict: 'allow', reasonCode: 'allowed', matchedRuleIds: ['artifact-write'] }
    : { verdict: 'deny', reasonCode: 'policy-denied', matchedRuleIds: ['artifact-write'] };
}

function createArtifactEvidenceHarness(): ArtifactEvidenceHarness {
  const rootDirectory = temporaryRoot('evidence-harness');
  const registry = new EventTypeRegistry(sealedArtifactEventDefinitions());
  const policies = new TransitionPolicyRegistry([{
    policyId: 'deep-research-artifact-policy',
    policyVersion: 1,
    evaluatorVersion: '1',
    ruleIds: ['artifact-write'],
    evaluate: evaluateArtifactPolicy,
  }]);
  const ledger = new AppendOnlyLedger({
    rootDirectory: join(rootDirectory, 'ledger'),
    ledgerId: 'deep-research-artifact-domain',
    auditLedgerId: 'deep-research-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(FIXED_TIME),
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory: join(rootDirectory, 'ledger'),
    auditLedgerId: 'deep-research-artifact-audit',
    authorityProvider: () => AUTHORITY,
    now: () => new Date(FIXED_TIME),
    identityResolver: ({ evaluationInput }) => ({
      actorId: evaluationInput.actorId,
      capabilityId: evaluationInput.capabilityId,
      evidenceDigest: evaluationInput.evidenceDigest,
    }),
  }, ledger, policies);
  const store = createDeepResearchSealedArtifactStore({
    rootDirectory: join(rootDirectory, 'artifacts'),
    now: () => new Date(FIXED_TIME),
  });
  let eventIndex = 0;
  const nextMetadata = (label: string): ArtifactEventMetadata => {
    eventIndex += 1;
    return {
      eventId: `${label}-${eventIndex}`,
      streamId: 'deep-research-artifact-stream',
      streamSequence: eventIndex,
      occurredAt: FIXED_TIME,
      recordedAt: FIXED_TIME,
      producer: { name: 'deep-research-artifact-tests', version: '1' },
      authorityEpoch: AUTHORITY.epoch,
      correlationId: `deep-research-artifact-correlation-${eventIndex}`,
      causationId: null,
      idempotencyKey: `deep-research-artifact-idempotency-${eventIndex}`,
    };
  };
  const policy = policies.resolve('deep-research-artifact-policy', 1);
  const recorder: ArtifactEventRecorder = {
    ledger,
    gateway,
    authorizationContext: (event): ArtifactAuthorizationContext => ({
      requestId: `request-${event.identity.eventId}`,
      mode: 'research',
      priorStateVersion: 'deep-research-artifacts@1',
      priorStateFingerprint: STATE_DIGEST,
      actorId: 'deep-research-artifact-test-actor',
      capabilityId: 'deep-research-artifact-write',
      authorityEpoch: AUTHORITY.epoch,
      policy: {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion,
        policyDigest: policy.digest,
      },
      evidenceDigest: sha256Bytes(canonicalBytes({ event: event.canonicalDigest })),
    }),
  };
  return { registry, ledger, store, recorder, nextMetadata };
}

async function sealAndRecordModeArtifact(
  harness: ArtifactEvidenceHarness,
  artifactKind: DeepResearchArtifactKind,
  logicalSequence: number,
): Promise<DeepResearchArtifactSetMemberInput> {
  const binding = await sealDeepResearchArtifact(
    harness.store,
    artifactKind,
    materialFor(artifactKind),
  );
  const artifact = await harness.store.readVerified(binding.reference, artifactKind);
  const event = prepareArtifactSealedEvent(
    artifact,
    harness.registry,
    harness.nextMetadata(`${artifactKind}-sealed`),
    'run-retained',
  );
  await recordArtifactEvent(harness.recorder, event);
  const evidence: VerifiedArtifactEvidence = await readVerifiedArtifactEvidence(
    harness.ledger,
    harness.store,
    binding.reference,
    artifactKind,
  );
  const registration = DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.find(
    (candidate) => candidate.artifactKind === artifactKind,
  );
  if (!registration) throw new Error(`Missing registration for ${artifactKind}`);
  return Object.freeze({
    iteration: registration.lifecycle === 'init' ? 0 : 1,
    logicalSequence,
    binding,
    evidence,
  });
}

async function completeArtifactSetMembers(
  harness: ArtifactEvidenceHarness,
): Promise<readonly DeepResearchArtifactSetMemberInput[]> {
  const members: DeepResearchArtifactSetMemberInput[] = [];
  for (const [index, registration] of DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.entries()) {
    members.push(await sealAndRecordModeArtifact(
      harness,
      registration.artifactKind,
      index + 1,
    ));
  }
  return Object.freeze(members);
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

  it('builds byte-identical complete lifecycle sets and replay inputs', async () => {
    const harness = createArtifactEvidenceHarness();
    const members = await completeArtifactSetMembers(harness);
    const first = bindDeepResearchArtifactSet(ARTIFACT_SET_CONTEXT, members);
    const second = bindDeepResearchArtifactSet(
      { ...ARTIFACT_SET_CONTEXT },
      members.map((member) => ({ ...member })),
    );

    expect(Buffer.from(canonicalDeepResearchArtifactSetBytes(first))).toEqual(
      Buffer.from(canonicalDeepResearchArtifactSetBytes(second)),
    );
    expect(second).toEqual(first);
    const mutableInput = JSON.parse(JSON.stringify(first)) as {
      referenceSet: { ordered_artifacts: Array<{ sealed_ledger_id: string }> };
    };
    const parsedSnapshot = parseDeepResearchArtifactSet(mutableInput);
    mutableInput.referenceSet.ordered_artifacts[0]!.sealed_ledger_id = 'mutated-ledger';
    expect(parsedSnapshot).toEqual(first);
    const replayInput = await deepResearchArtifactSetReplayInput(
      harness.ledger,
      harness.store,
      first,
      ARTIFACT_SET_CONTEXT,
    );
    expect(replayInput.source.kind).toBe('content-addressed');
    expect(replayInput.source.value).toMatchObject({
      reference_set_digest: first.referenceSet.reference_set_digest,
    });
    expect(compareDeepResearchArtifactSets(first, second)).toEqual({
      ok: true,
      referenceSetDigest: first.referenceSet.reference_set_digest,
    });
  });

  it('rejects missing and reordered lifecycle artifacts before binding', async () => {
    const harness = createArtifactEvidenceHarness();
    const members = [...await completeArtifactSetMembers(harness)];

    expect(() => bindDeepResearchArtifactSet(
      ARTIFACT_SET_CONTEXT,
      members.slice(0, -1),
    )).toThrowError(expect.objectContaining({
      code: SealedArtifactErrorCodes.EVIDENCE_MISSING,
    }));

    [members[0], members[1]] = [members[1]!, members[0]!];
    expect(() => bindDeepResearchArtifactSet(
      ARTIFACT_SET_CONTEXT,
      members,
    )).toThrowError(expect.objectContaining({
      code: SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
    }));
  });

  it('rejects a binding that does not match its verified creation evidence', async () => {
    const harness = createArtifactEvidenceHarness();
    const members = [...await completeArtifactSetMembers(harness)];
    const first = members[0];
    if (!first) throw new Error('Expected a first artifact-set member');
    members[0] = {
      ...first,
      binding: {
        ...first.binding,
        eventReference: `artifact:sha256:${DIGEST_D}`,
      },
    };

    expect(() => bindDeepResearchArtifactSet(
      ARTIFACT_SET_CONTEXT,
      members,
    )).toThrowError(expect.objectContaining({
      code: SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
    }));
  });

  it('rejects stale context and post-build artifact corruption during replay', async () => {
    const harness = createArtifactEvidenceHarness();
    const members = await completeArtifactSetMembers(harness);
    const artifactSet = bindDeepResearchArtifactSet(ARTIFACT_SET_CONTEXT, members);

    await expectArtifactFailure(
      deepResearchArtifactSetReplayInput(
        harness.ledger,
        harness.store,
        artifactSet,
        { ...ARTIFACT_SET_CONTEXT, sourceTailSequence: 24 },
      ),
      SealedArtifactErrorCodes.EVIDENCE_CONFLICT,
    );

    const last = members.at(-1);
    if (!last) throw new Error('Expected a final artifact-set member');
    const paths = harness.store.inspectPaths(last.binding.reference);
    chmodSync(paths.blobPath, 0o600);
    writeFileSync(paths.blobPath, Buffer.from('{"tampered":true}'));
    await expectArtifactFailure(
      deepResearchArtifactSetReplayInput(
        harness.ledger,
        harness.store,
        artifactSet,
        ARTIFACT_SET_CONTEXT,
      ),
      SealedArtifactErrorCodes.ARTIFACT_CORRUPT,
    );
  });
});
