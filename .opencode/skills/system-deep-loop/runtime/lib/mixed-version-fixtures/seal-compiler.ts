// ───────────────────────────────────────────────────────────────────
// MODULE: Mixed-Version Seal Compiler
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';
import {
  InitialArtifactKinds,
  SealedArtifactError,
} from '../sealed-reference-artifacts/index.js';
import { assertAuthoredMixedVersionCase } from './fixture-corpus.js';
import {
  MixedVersionFixtureError,
  MixedVersionFixtureErrorCodes,
} from './mixed-version-types.js';

import type { JsonValue } from '../event-envelope/index.js';
import type {
  SealedArtifactReference,
  SealedArtifactStore,
} from '../sealed-reference-artifacts/index.js';
import type {
  CompiledMixedVersionCase,
  MixedVersionCase,
  SealedMixedVersionInput,
} from './mixed-version-types.js';

const INPUT_ORDER = Object.freeze([
  'case-envelope',
  'prompts',
  'initial-state',
  'configuration',
  'evaluator-material',
  'prior-outputs',
  'version-policy',
  'environment',
  'event-stream',
  'restart-metadata',
] as const);

type InputKey = typeof INPUT_ORDER[number];

interface InputDefinition {
  readonly key: InputKey;
  readonly artifactKind: string;
  readonly value: JsonValue;
}

function inputDefinitions(fixture: MixedVersionCase): readonly InputDefinition[] {
  return [
    { key: 'case-envelope', artifactKind: InitialArtifactKinds.FIXTURE, value: fixture },
    {
      key: 'prompts',
      artifactKind: InitialArtifactKinds.PROMPT_SET,
      value: fixture.replayInputs.prompts,
    },
    {
      key: 'initial-state',
      artifactKind: InitialArtifactKinds.FIXTURE,
      value: fixture.replayInputs.initialState,
    },
    {
      key: 'configuration',
      artifactKind: InitialArtifactKinds.CONFIGURATION,
      value: fixture.replayInputs.configuration,
    },
    { key: 'evaluator-material', artifactKind: InitialArtifactKinds.FIXTURE, value: fixture.replayInputs.evaluatorMaterial },
    {
      key: 'prior-outputs',
      artifactKind: InitialArtifactKinds.PRIOR_RUN_OUTPUT,
      value: fixture.replayInputs.priorOutputs,
    },
    { key: 'version-policy', artifactKind: InitialArtifactKinds.FIXTURE, value: fixture.replayInputs.versionPolicy },
    {
      key: 'environment',
      artifactKind: InitialArtifactKinds.CONFIGURATION,
      value: fixture.replayInputs.environment,
    },
    { key: 'event-stream', artifactKind: InitialArtifactKinds.FIXTURE, value: fixture.replayInputs.eventStream },
    { key: 'restart-metadata', artifactKind: InitialArtifactKinds.FIXTURE, value: fixture.replayInputs.restartMetadata },
  ];
}

function parseJsonBytes(bytes: readonly number[]): unknown {
  return JSON.parse(Buffer.from(bytes).toString('utf8')) as unknown;
}

/** Seal every replay input and publish one verified ordered case capsule. */
export async function compileMixedVersionCase(
  store: SealedArtifactStore,
  fixture: MixedVersionCase,
): Promise<CompiledMixedVersionCase> {
  assertAuthoredMixedVersionCase(fixture);
  const orderedInputs: SealedMixedVersionInput[] = [];
  for (const definition of inputDefinitions(fixture)) {
    const sealed = await store.seal(definition.artifactKind, definition.value);
    const verified = await store.readVerified(
      sealed.artifact.reference,
      definition.artifactKind,
    );
    orderedInputs.push(Object.freeze({
      key: definition.key,
      reference: verified.reference,
    }));
  }
  const capsule = {
    capsuleVersion: 1,
    caseId: fixture.caseId,
    orderedInputs,
    authorityState: 'legacy_authoritative',
    authorityMutation: false,
  };
  const sealedCapsule = await store.seal(InitialArtifactKinds.FIXTURE, capsule);
  const verifiedCapsule = await store.readVerified(
    sealedCapsule.artifact.reference,
    InitialArtifactKinds.FIXTURE,
  );
  return Object.freeze({
    caseId: fixture.caseId,
    capsuleReference: verifiedCapsule.reference,
    orderedInputs: Object.freeze(orderedInputs),
    capsuleDigest: verifiedCapsule.reference.content_digest,
  });
}

/** Compile the authored corpus without sharing mutable publication state between cases. */
export async function compileMixedVersionCorpus(
  store: SealedArtifactStore,
  fixtures: readonly MixedVersionCase[],
): Promise<readonly CompiledMixedVersionCase[]> {
  const compiled: CompiledMixedVersionCase[] = [];
  for (const fixture of fixtures) compiled.push(await compileMixedVersionCase(store, fixture));
  return Object.freeze(compiled);
}

/** Verify the capsule and every referenced input before releasing fixture bytes. */
export async function verifyCompiledMixedVersionCase(
  store: SealedArtifactStore,
  compiled: CompiledMixedVersionCase,
): Promise<MixedVersionCase> {
  try {
    const capsuleArtifact = await store.readVerified(
      compiled.capsuleReference,
      InitialArtifactKinds.FIXTURE,
    );
    if (capsuleArtifact.reference.content_digest !== compiled.capsuleDigest) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.INPUT_INEQUALITY,
        'capsule',
        'Claimed capsule digest differs from the verified reference',
      );
    }
    const capsule = parseJsonBytes(capsuleArtifact.bytes) as {
      readonly caseId?: unknown;
      readonly orderedInputs?: unknown;
      readonly authorityState?: unknown;
      readonly authorityMutation?: unknown;
    };
    if (
      capsule.caseId !== compiled.caseId
      || capsule.authorityState !== 'legacy_authoritative'
      || capsule.authorityMutation !== false
      || canonicalJson(capsule.orderedInputs) !== canonicalJson(compiled.orderedInputs)
      || compiled.orderedInputs.map((entry) => entry.key).join('|') !== INPUT_ORDER.join('|')
    ) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.INPUT_INEQUALITY,
        'capsule',
        'Verified capsule does not match the complete ordered input claim',
      );
    }
    const verifiedValues = new Map<string, unknown>();
    for (const input of compiled.orderedInputs) {
      const artifact = await store.readVerified(input.reference);
      verifiedValues.set(input.key, parseJsonBytes(artifact.bytes));
    }
    const fixture = verifiedValues.get('case-envelope') as MixedVersionCase;
    assertAuthoredMixedVersionCase(fixture);
    const expectedInputs = inputDefinitions(fixture);
    for (const [position, definition] of expectedInputs.entries()) {
      if (canonicalJson(verifiedValues.get(definition.key)) !== canonicalJson(definition.value)) {
        throw new MixedVersionFixtureError(
          MixedVersionFixtureErrorCodes.INPUT_INEQUALITY,
          `input:${position}`,
          'Verified replay input differs from its sealed authored case envelope',
        );
      }
    }
    return fixture;
  } catch (error: unknown) {
    if (error instanceof MixedVersionFixtureError) throw error;
    if (error instanceof SealedArtifactError) {
      throw new MixedVersionFixtureError(
        MixedVersionFixtureErrorCodes.SEAL_VERIFICATION_FAILED,
        'seal-verification',
        `Sealed input verification failed with ${error.code}`,
      );
    }
    throw error;
  }
}

/** Return a copy with an alternate reference for negative preflight fixtures. */
export function replaceCapsuleReference(
  compiled: CompiledMixedVersionCase,
  capsuleReference: SealedArtifactReference,
): CompiledMixedVersionCase {
  return Object.freeze({ ...compiled, capsuleReference });
}
