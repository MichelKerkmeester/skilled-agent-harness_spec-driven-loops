// ───────────────────────────────────────────────────────────────────
// MODULE: Reproducible Evaluation Run Manifest
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest } from '../contracts/exact-original.js';
import { createCorpusManifest, verifyCorpusIntegrity } from './corpus.js';

import type { RuntimeId } from '../contracts/common.js';
import type {
  EvaluationCase,
  RunEnvironmentMetadata,
  RunManifest,
  RunRuntimeMetadata,
} from './types.js';

/** Inputs whose explicit metadata determines every manifest byte. */
export interface CreateRunManifestInput {
  readonly corpus: readonly EvaluationCase[];
  readonly seed: string;
  readonly runtime: RunRuntimeMetadata;
  readonly environment?: RunEnvironmentMetadata;
}

/** Create deterministic case ordering and a digest over the complete manifest. */
export function createRunManifest(input: CreateRunManifestInput): RunManifest {
  if (input.corpus.length === 0) {
    throw new RangeError('Run manifest requires at least one corpus case.');
  }
  if (input.seed.length === 0) {
    throw new TypeError('Run manifest seed must be non-empty.');
  }
  validateRuntime(input.runtime);
  const corpusVersion = input.corpus[0]?.corpusVersion;
  if (corpusVersion === undefined) {
    throw new RangeError('Run manifest requires at least one corpus case.');
  }
  const corpusManifest = createCorpusManifest(input.corpus, corpusVersion);
  if (!verifyCorpusIntegrity(input.corpus, corpusManifest)) {
    throw new TypeError('Run manifest corpus failed integrity validation.');
  }

  const environment = normalizeEnvironment(input.environment ?? currentEnvironment());
  validateEnvironment(environment);
  const runtime = normalizeRuntime(input.runtime);
  const caseOrder = createCaseOrder(
    input.corpus,
    input.seed,
    corpusManifest.contentFreeDigest,
  );
  const digestInput = {
    manifestVersion: 'evaluation-run/1.0.0' as const,
    corpusVersion,
    corpusDigest: corpusManifest.contentFreeDigest,
    caseOrder,
    seed: input.seed,
    environment,
    runtime,
  };
  return Object.freeze({
    ...digestInput,
    reproducibilityDigest: digestMetadata(digestInput),
  });
}

function createCaseOrder(
  corpus: readonly EvaluationCase[],
  seed: string,
  corpusDigest: string,
): readonly string[] {
  const ranked = corpus.map((evaluationCase) => ({
    id: evaluationCase.id,
    rank: digestMetadata([seed, corpusDigest, evaluationCase.id]),
  }));
  ranked.sort((left, right) =>
    compareText(left.rank, right.rank) || compareText(left.id, right.id));
  return Object.freeze(ranked.map((entry) => entry.id));
}

function currentEnvironment(): RunEnvironmentMetadata {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
  };
}

function validateRuntime(runtime: RunRuntimeMetadata): void {
  const runtimeIds: readonly RuntimeId[] = [
    'claude',
    'codex',
    'cursor',
    'devin',
    'opencode',
    'pi',
  ];
  if (
    !runtimeIds.includes(runtime.runtimeId)
    || [runtime.runtimeVersion, runtime.protocolVersion, runtime.pathId]
      .some((value) => value.length === 0)
  ) {
    throw new TypeError('Run manifest runtime metadata is invalid.');
  }
}

function validateEnvironment(environment: RunEnvironmentMetadata): void {
  if (
    [environment.nodeVersion, environment.platform, environment.architecture]
      .some((value) => value.length === 0)
  ) {
    throw new TypeError('Run manifest environment metadata is invalid.');
  }
}

function normalizeEnvironment(
  environment: RunEnvironmentMetadata,
): RunEnvironmentMetadata {
  return Object.freeze({
    nodeVersion: environment.nodeVersion,
    platform: environment.platform,
    architecture: environment.architecture,
  });
}

function normalizeRuntime(runtime: RunRuntimeMetadata): RunRuntimeMetadata {
  return Object.freeze({
    runtimeId: runtime.runtimeId,
    runtimeVersion: runtime.runtimeVersion,
    protocolVersion: runtime.protocolVersion,
    pathId: runtime.pathId,
  });
}

function digestMetadata(value: unknown): string {
  return createSha256Digest(new TextEncoder().encode(JSON.stringify(value)));
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
