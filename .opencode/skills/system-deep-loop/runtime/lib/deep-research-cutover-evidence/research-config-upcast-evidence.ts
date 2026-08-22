// ───────────────────────────────────────────────────────────────────
// MODULE: Research Config Upcast Evidence
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  canonicalBytes,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  createDeepResearchEventRegistry,
  decideDeepResearchCompatibility,
  prepareDeepResearchEvent,
  upcastLegacyDeepResearchRecord,
} from '../deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../legacy-projections/index.js';
import { deriveRestartClassificationEvidence } from '../inflight-state-classification/restart-classification-evidence.js';
import { FROZEN_CENSUS_ROW_POLICIES } from '../inflight-state-classification/frozen-census-policy.js';
import { InflightDisposition } from '../inflight-state-classification/inflight-state-types.js';

import type {
  DeepResearchEventInput,
  DeepResearchPayloadMap,
  DeepResearchScopeMap,
  LegacyUpcastCandidate,
  LegacyUpcastContext,
} from '../deep-research-ledger-schema/index.js';
import type {
  EventProducer,
} from '../event-envelope/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
} from '../inflight-state-classification/inflight-state-types.js';
import type { RestartFacts } from '../inflight-state-classification/restart-classification-evidence.js';

// ───────────────────────────────────────────────────────────────────
// 1. INPUTS
// ───────────────────────────────────────────────────────────────────

/**
 * File-backed seed and observed restart facts for the immutable config row.
 * The optional hook is an observation boundary used to test source stability;
 * this producer itself only reads the source file.
 */
export interface ResearchConfigUpcastSeed {
  readonly sourcePath: string;
  readonly context: LegacyUpcastContext;
  readonly sequence: number;
  readonly lifecycle: string;
  readonly mutability: string;
  readonly restart: RestartFacts;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKey: string;
  readonly afterUpcast?: () => void;
}

interface UpcastObservation {
  readonly first: ReturnType<typeof upcastLegacyDeepResearchRecord>;
  readonly second: ReturnType<typeof upcastLegacyDeepResearchRecord>;
  readonly after: ReturnType<typeof upcastLegacyDeepResearchRecord>;
  readonly inputBytesBefore: readonly number[];
  readonly inputBytesAfter: readonly number[];
  readonly sourceBytesBefore: Uint8Array;
  readonly sourceBytesAfter: Uint8Array;
  readonly record: unknown;
}

interface ProjectionObservation {
  readonly immutableIdentityPreserved: boolean;
  readonly replayEquivalent: boolean;
  readonly effectiveStateDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function bytesEqual(left: readonly number[] | Uint8Array, right: readonly number[] | Uint8Array): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function readSeed(sourcePath: string): { readonly bytes: Uint8Array; readonly record: unknown } {
  const bytes = Uint8Array.from(readFileSync(sourcePath));
  const record = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown;
  return { bytes, record };
}

function readSourceBytes(sourcePath: string): Uint8Array {
  return Uint8Array.from(readFileSync(sourcePath));
}

function identityFromRecord(
  record: unknown,
): { readonly runId: string | null; readonly lineageId: string | null } {
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    return { runId: null, lineageId: null };
  }
  const source = record as Record<string, unknown>;
  const runValue = source.runId ?? source.sessionId;
  const lineageValue = source.lineageId ?? source.parentSessionId ?? source.sessionId;
  const runId = typeof runValue === 'string' ? runValue : null;
  const lineageId = typeof lineageValue === 'string' ? lineageValue : null;
  return { runId, lineageId };
}

function chainIdentitiesDigest(registry: ReturnType<typeof createDeepResearchEventRegistry>): string {
  const identities = registry.inspect().map((entry) => ({
    eventType: entry.eventType,
    chains: entry.supportedVersions.map((version) => ({
      version,
      identity: registry.chainIdentity(entry.eventType, version),
    })),
  }));
  return digest(identities);
}

function observeUpcast(seed: ResearchConfigUpcastSeed): UpcastObservation {
  const sourcePath = resolve(seed.sourcePath);
  const sourceBefore = readSeed(sourcePath);
  const inputBytesBefore = canonicalBytes(sourceBefore.record);
  const first = upcastLegacyDeepResearchRecord(sourceBefore.record, seed.context);
  const second = upcastLegacyDeepResearchRecord(sourceBefore.record, seed.context);
  const inputBytesAfter = canonicalBytes(sourceBefore.record);
  seed.afterUpcast?.();
  const sourceAfter = readSourceBytes(sourcePath);
  const afterRecord = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(sourceAfter)) as unknown;
  const after = upcastLegacyDeepResearchRecord(afterRecord, seed.context);
  return {
    first,
    second,
    after,
    inputBytesBefore,
    inputBytesAfter,
    sourceBytesBefore: sourceBefore.bytes,
    sourceBytesAfter: sourceAfter,
    record: sourceBefore.record,
  };
}

function migratedCandidate(
  result: ReturnType<typeof upcastLegacyDeepResearchRecord>,
): LegacyUpcastCandidate | null {
  return result.status === 'migrated' ? result : null;
}

function prepareProjectionEvent(
  candidate: LegacyUpcastCandidate,
  seed: ResearchConfigUpcastSeed,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
) {
  const input: DeepResearchEventInput<'deep_research.run_initialized'> = {
    stem: 'deep_research.run_initialized',
    scope: candidate.scope as DeepResearchScopeMap['deep_research.run_initialized'],
    prevEventHash: candidate.prevEventHash,
    replay: candidate.replay,
    data: candidate.data as DeepResearchPayloadMap['deep_research.run_initialized'],
    eventId: `deep-research-config-upcast-${candidate.originalRecordDigest}`,
    streamId: candidate.scope.runId,
    streamSequence: seed.sequence,
    occurredAt: seed.occurredAt,
    recordedAt: seed.recordedAt,
    producer: seed.producer,
    authorityEpoch: seed.authorityEpoch,
    correlationId: seed.correlationId,
    causationId: seed.causationId,
    idempotencyKey: seed.idempotencyKey,
  };
  return readEvent(prepareDeepResearchEvent(input, registry).canonicalBytes, registry);
}

function observeProjection(
  candidate: LegacyUpcastCandidate,
  secondCandidate: LegacyUpcastCandidate | null,
  afterCandidate: LegacyUpcastCandidate | null,
  seed: ResearchConfigUpcastSeed,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
  record: unknown,
): ProjectionObservation {
  const event = prepareProjectionEvent(candidate, seed, registry);
  const contract = createDeepResearchProjectionContract({ ledgerId: candidate.scope.runId });
  const firstState = contract.reduce(contract.base.state, event);
  const secondState = contract.reduce(contract.base.state, event);
  const firstStateBytes = canonicalBytes(firstState);
  const secondStateBytes = canonicalBytes(secondState);
  const afterStateBytes = afterCandidate === null
    ? null
    : canonicalBytes(contract.reduce(
      contract.base.state,
      prepareProjectionEvent(afterCandidate, seed, registry),
    ));
  const payload = event.effective.envelope.payload as Record<string, unknown>;
  const eventScope = payload.scope;
  const sourceIdentity = identityFromRecord(record);
  const eventIdentity = eventScope !== null
    && typeof eventScope === 'object'
    && !Array.isArray(eventScope)
    ? eventScope as Record<string, unknown>
    : null;
  const immutableIdentityPreserved = secondCandidate !== null
    && sourceIdentity.runId !== null
    && sourceIdentity.lineageId !== null
    && candidate.scope.runId === sourceIdentity.runId
    && candidate.scope.lineageId === sourceIdentity.lineageId
    && eventIdentity?.runId === sourceIdentity.runId
    && eventIdentity.lineageId === sourceIdentity.lineageId
    && event.effective.envelope.stream_id === sourceIdentity.runId;
  return {
    immutableIdentityPreserved,
    replayEquivalent: secondCandidate !== null
      && afterStateBytes !== null
      && bytesEqual(firstStateBytes, secondStateBytes)
      && bytesEqual(firstStateBytes, afterStateBytes),
    effectiveStateDigest: sha256Bytes(firstStateBytes),
  };
}

function blockProof(reason: string): DispositionProof {
  return { kind: 'block', veto: reason };
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC PRODUCER
// ───────────────────────────────────────────────────────────────────

/**
 * Derive the real UPCAST evidence for the immutable research configuration row.
 *
 * @param seed - File-backed legacy input, upcast context, and observed restart facts.
 * @returns Classification evidence whose proof is populated only by observed checks.
 */
export function deriveResearchConfigUpcastEvidence(
  seed: ResearchConfigUpcastSeed,
): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES['research-config'];
  const restartEvidence = deriveRestartClassificationEvidence({
    rowId: 'research-config',
    lifecycle: seed.lifecycle,
    mutability: seed.mutability,
    restart: seed.restart,
  });
  const registry = createDeepResearchEventRegistry();
  const observation = observeUpcast(seed);
  const compatibility = decideDeepResearchCompatibility(observation.record);
  const firstCandidate = migratedCandidate(observation.first);
  const secondCandidate = migratedCandidate(observation.second);
  const sourceBytesDigest = sha256Bytes(observation.sourceBytesBefore);
  const sourceBytesPreserved = bytesEqual(
    observation.sourceBytesBefore,
    observation.sourceBytesAfter,
  );
  const canonicalFirst = firstCandidate === null ? null : canonicalBytes(firstCandidate);
  const canonicalSecond = secondCandidate === null ? null : canonicalBytes(secondCandidate);
  const canonicalAfter = migratedCandidate(observation.after);
  const deterministic = canonicalFirst !== null
    && canonicalSecond !== null
    && bytesEqual(canonicalFirst, canonicalSecond);
  const inputUnchanged = bytesEqual(
    observation.inputBytesBefore,
    observation.inputBytesAfter,
  );
  const adjacentChainComplete = seed.sequence === 1
    && seed.context.prevEventHash === '0'.repeat(64);
  const dispositionIsUpcast = policy.disposition === InflightDisposition.UPCAST
    && compatibility.status === 'migrate'
    && compatibility.targetStem === 'deep_research.run_initialized';

  let projection: ProjectionObservation | null = null;
  if (firstCandidate !== null) {
    projection = observeProjection(
      firstCandidate,
      secondCandidate,
      canonicalAfter,
      seed,
      registry,
      observation.record,
    );
  }

  const replayEquivalent = projection !== null
    && deterministic
    && projection.replayEquivalent;
  const pure = deterministic && inputUnchanged;
  const sideEffectFree = inputUnchanged && sourceBytesPreserved;
  const proof: DispositionProof = dispositionIsUpcast && firstCandidate !== null
    ? {
      kind: 'upcast',
      adjacentChainComplete,
      pure,
      deterministic,
      sideEffectFree,
      sourceBytesPreserved,
      immutableIdentityPreserved: projection?.immutableIdentityPreserved ?? false,
      replayEquivalent,
      sourceBytesDigest,
      effectiveStateDigest: projection?.effectiveStateDigest ?? digest({
        sourceBytesDigest,
        targetStem: compatibility.targetStem,
      }),
      registryDigest: registry.digest,
      chainIdentitiesDigest: chainIdentitiesDigest(registry),
    }
    : blockProof(`research-config upcast unavailable: ${compatibility.reasonCode}`);

  return {
    ...restartEvidence,
    proof,
  };
}
