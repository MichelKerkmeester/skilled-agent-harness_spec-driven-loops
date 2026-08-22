// ───────────────────────────────────────────────────────────────────
// MODULE: Research Deltas Upcast Evidence
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
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
  LegacyUpcastCandidate,
} from '../deep-research-ledger-schema/index.js';
import type {
  EventProducer,
  EventReadResult,
} from '../event-envelope/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
} from '../inflight-state-classification/inflight-state-types.js';
import type { RestartFacts } from '../inflight-state-classification/restart-classification-evidence.js';

export interface ResearchDeltasUpcastSeed {
  readonly sourcePaths: readonly string[];
  readonly replay: DeepResearchReplayMetadata;
  readonly lifecycle: string;
  readonly mutability: string;
  readonly restart: RestartFacts;
  readonly occurredAt: string;
  readonly recordedAt: string;
  readonly producer: EventProducer;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly idempotencyKeyPrefix: string;
  readonly afterStableObservation?: () => void;
}

interface SourceFileObservation {
  readonly path: string;
  readonly bytes: Uint8Array;
  readonly records: readonly Record<string, unknown>[];
}

interface ChainObservation {
  readonly candidates: readonly (LegacyUpcastCandidate | null)[];
  readonly events: readonly EventReadResult[];
  readonly adjacentChainComplete: boolean;
  readonly immutableIdentityPreserved: boolean;
  readonly allCurrentIterationEvents: boolean;
  readonly inputUnchanged: boolean;
}

interface FoldObservation {
  readonly bytes: Uint8Array;
  readonly digest: string;
}

interface DeltasObservation {
  readonly before: readonly SourceFileObservation[];
  readonly first: ChainObservation;
  readonly second: ChainObservation;
  readonly firstFold: FoldObservation;
  readonly secondFold: FoldObservation;
  readonly after: readonly SourceFileObservation[];
  readonly afterChain: ChainObservation;
  readonly afterFold: FoldObservation;
}

const GENESIS_EVENT_HASH = '0'.repeat(64);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function bytesEqual(left: readonly number[] | Uint8Array, right: readonly number[] | Uint8Array): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function sourceBytesDigest(files: readonly SourceFileObservation[]): string {
  return digest(files.map((file) => Array.from(file.bytes)));
}

function sourceBytesPreserved(
  before: readonly SourceFileObservation[],
  after: readonly SourceFileObservation[],
): boolean {
  return before.length === after.length
    && before.every((file, index) => file.path === after[index]?.path
      && bytesEqual(file.bytes, after[index]?.bytes ?? []));
}

function chainIdentitiesDigest(registry: ReturnType<typeof createDeepResearchEventRegistry>): string {
  return digest(registry.inspect().map((entry) => ({
    eventType: entry.eventType,
    chains: entry.supportedVersions.map((version) => ({
      version,
      identity: registry.chainIdentity(entry.eventType, version),
    })),
  })));
}

function blockProof(reason: string): DispositionProof {
  return { kind: 'block', veto: reason };
}

function recordIteration(record: Record<string, unknown>): number | null {
  const value = record.iteration ?? record.run;
  return Number.isSafeInteger(value) && (value as number) > 0 ? value as number : null;
}

function recordIdentity(record: Record<string, unknown>): {
  readonly runId: string | null;
  readonly lineageId: string | null;
} {
  const runValue = record.runId ?? record.sessionId;
  const lineageValue = record.lineageId ?? record.parentSessionId ?? record.sessionId;
  return {
    runId: typeof runValue === 'string' ? runValue : null,
    lineageId: typeof lineageValue === 'string' ? lineageValue : null,
  };
}

function readSourceFiles(paths: readonly string[]): readonly SourceFileObservation[] {
  return paths.map((inputPath) => {
    const path = resolve(inputPath);
    const bytes = Uint8Array.from(readFileSync(path));
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const records = text.split(/\r?\n/)
      .filter((line) => line.length > 0)
      .map((line, index) => {
        const parsed = JSON.parse(line) as unknown;
        if (!isRecord(parsed)) {
          throw new TypeError(`Research delta ${path} line ${index + 1} is not an object`);
        }
        return parsed;
      });
    return { path, bytes, records };
  });
}

function flattenedRecords(files: readonly SourceFileObservation[]): readonly Record<string, unknown>[] {
  return files.flatMap((file) => file.records);
}

function timestampFor(record: Record<string, unknown>, fallback: string): string {
  return typeof record.timestamp === 'string' ? record.timestamp : fallback;
}

function migratedCandidate(
  result: ReturnType<typeof upcastLegacyDeepResearchRecord>,
): LegacyUpcastCandidate | null {
  return result.status === 'migrated' ? result : null;
}

function prepareIterationEvent(
  candidate: LegacyUpcastCandidate,
  record: Record<string, unknown>,
  index: number,
  seed: ResearchDeltasUpcastSeed,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): EventReadResult {
  const iteration = recordIteration(record);
  if (iteration === null) throw new TypeError('Research delta iteration is missing');
  const input: DeepResearchEventInput<'deep_research.iteration_completed'> = {
    stem: 'deep_research.iteration_completed',
    scope: candidate.scope as DeepResearchScopeMap['deep_research.iteration_completed'],
    prevEventHash: candidate.prevEventHash,
    replay: candidate.replay,
    data: candidate.data as DeepResearchPayloadMap['deep_research.iteration_completed'],
    eventId: `research-delta-${index + 1}-${candidate.originalRecordDigest}`,
    streamId: candidate.scope.runId,
    streamSequence: iteration,
    occurredAt: timestampFor(record, seed.occurredAt),
    recordedAt: seed.recordedAt,
    producer: seed.producer,
    authorityEpoch: seed.authorityEpoch,
    correlationId: seed.correlationId,
    causationId: seed.causationId,
    idempotencyKey: `${seed.idempotencyKeyPrefix}-${index + 1}`,
  };
  return readEvent(prepareDeepResearchEvent(input, registry).canonicalBytes, registry);
}

function observeChain(
  records: readonly Record<string, unknown>[],
  seed: ResearchDeltasUpcastSeed,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): ChainObservation {
  const inputBytesBefore = canonicalBytes(records);
  let expectedPreviousEventHash = GENESIS_EVENT_HASH;
  let adjacentChainComplete = records.length > 0;
  let immutableIdentityPreserved = records.length > 0;
  let allCurrentIterationEvents = records.length > 0;
  let chainRunId: string | null = null;
  let chainLineageId: string | null = null;
  const candidates: Array<LegacyUpcastCandidate | null> = [];
  const events: EventReadResult[] = [];

  records.forEach((record, index) => {
    const iteration = recordIteration(record);
    const identity = recordIdentity(record);
    const previousEventHash = typeof record.prevEventHash === 'string'
      ? record.prevEventHash
      : expectedPreviousEventHash;
    const result = iteration === null || identity.runId === null || identity.lineageId === null
      ? null
      : upcastLegacyDeepResearchRecord(record, {
        scope: { runId: identity.runId, lineageId: identity.lineageId, iteration },
        prevEventHash: previousEventHash,
        replay: seed.replay,
      });
    const candidate = result === null ? null : migratedCandidate(result);
    candidates.push(candidate);
    if (candidate === null || iteration === null || identity.runId === null || identity.lineageId === null) {
      adjacentChainComplete = false;
      immutableIdentityPreserved = false;
      allCurrentIterationEvents = false;
      return;
    }
    if (chainRunId === null) chainRunId = identity.runId;
    if (chainLineageId === null) chainLineageId = identity.lineageId;
    const event = prepareIterationEvent(candidate, record, index, seed, registry);
    events.push(event);
    const payload = event.effective.envelope.payload as Record<string, unknown>;
    const scope = payload.scope as Record<string, unknown>;
    const expectedIteration = index + 1;
    adjacentChainComplete = adjacentChainComplete
      && iteration === expectedIteration
      && candidate.prevEventHash === expectedPreviousEventHash
      && scope.iteration === expectedIteration
      && event.effective.envelope.stream_sequence === expectedIteration;
    immutableIdentityPreserved = immutableIdentityPreserved
      && scope.runId === identity.runId
      && scope.lineageId === identity.lineageId
      && identity.runId === chainRunId
      && identity.lineageId === chainLineageId
      && event.effective.envelope.stream_id === identity.runId;
    allCurrentIterationEvents = allCurrentIterationEvents
      && candidate.targetStem === 'deep_research.iteration_completed'
      && event.hopTrace.length === 0;
    expectedPreviousEventHash = event.effective.canonicalDigest;
  });

  const inputBytesAfter = canonicalBytes(records);
  return {
    candidates,
    events,
    adjacentChainComplete,
    immutableIdentityPreserved,
    allCurrentIterationEvents,
    inputUnchanged: bytesEqual(inputBytesBefore, inputBytesAfter),
  };
}

function foldEvents(events: readonly EventReadResult[]): FoldObservation {
  const contract = createDeepResearchProjectionContract({
    ledgerId: events[0]?.effective.envelope.stream_id ?? 'research-deltas',
  });
  const state = events.reduce(
    (current, event) => contract.reduce(current, event),
    contract.base.state,
  );
  const serialized = contract.serialize(state);
  const bytes = typeof serialized === 'string'
    ? Uint8Array.from(Buffer.from(serialized, 'utf8'))
    : Uint8Array.from(serialized);
  return { bytes, digest: sha256Bytes(bytes) };
}

function candidatesEqual(
  left: readonly (LegacyUpcastCandidate | null)[],
  right: readonly (LegacyUpcastCandidate | null)[],
): boolean {
  return left.length === right.length
    && left.every((candidate, index) => candidate !== null
      && right[index] !== null
      && bytesEqual(canonicalBytes(candidate), canonicalBytes(right[index])));
}

function observe(seed: ResearchDeltasUpcastSeed): DeltasObservation {
  const before = readSourceFiles(seed.sourcePaths);
  const registry = createDeepResearchEventRegistry();
  const records = flattenedRecords(before);
  const first = observeChain(records, seed, registry);
  const second = observeChain(records, seed, registry);
  const firstFold = foldEvents(first.events);
  const secondFold = foldEvents(second.events);
  seed.afterStableObservation?.();
  const after = readSourceFiles(seed.sourcePaths);
  const afterChain = observeChain(flattenedRecords(after), seed, registry);
  const afterFold = foldEvents(afterChain.events);
  return { before, first, second, firstFold, secondFold, after, afterChain, afterFold };
}

/**
 * Derive observed UPCAST proof for append-only iteration delta files.
 *
 * @param seed - Legacy delta files and the restart facts for the row.
 * @returns Classification evidence populated from source, upcast, and fold observations.
 */
export function deriveResearchDeltasUpcastEvidence(
  seed: ResearchDeltasUpcastSeed,
): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES['research-deltas'];
  const restartEvidence = deriveRestartClassificationEvidence({
    rowId: 'research-deltas',
    lifecycle: seed.lifecycle,
    mutability: seed.mutability,
    restart: seed.restart,
  });
  const registry = createDeepResearchEventRegistry();
  const observation = observe(seed);
  const sourcePreserved = sourceBytesPreserved(observation.before, observation.after);
  const deterministic = candidatesEqual(
    observation.first.candidates,
    observation.second.candidates,
  ) && bytesEqual(observation.firstFold.bytes, observation.secondFold.bytes);
  const replayEquivalent = deterministic
    && bytesEqual(observation.firstFold.bytes, observation.afterFold.bytes);
  const dispositionIsUpcast = policy.disposition === InflightDisposition.UPCAST
    && observation.first.allCurrentIterationEvents
    && observation.second.allCurrentIterationEvents
    && observation.first.candidates.length > 0;
  const proof: DispositionProof = dispositionIsUpcast
    ? {
      kind: 'upcast',
      adjacentChainComplete: observation.first.adjacentChainComplete
        && observation.second.adjacentChainComplete
        && observation.afterChain.adjacentChainComplete,
      pure: deterministic && observation.first.inputUnchanged && observation.second.inputUnchanged,
      deterministic,
      sideEffectFree: sourcePreserved
        && observation.first.inputUnchanged
        && observation.second.inputUnchanged,
      sourceBytesPreserved: sourcePreserved,
      immutableIdentityPreserved: observation.first.immutableIdentityPreserved
        && observation.second.immutableIdentityPreserved
        && observation.afterChain.immutableIdentityPreserved,
      replayEquivalent,
      sourceBytesDigest: sourceBytesDigest(observation.before),
      effectiveStateDigest: observation.firstFold.digest,
      registryDigest: registry.digest,
      chainIdentitiesDigest: chainIdentitiesDigest(registry),
    }
    : blockProof('research-deltas upcast unavailable: iteration chain was not migratable');
  return { ...restartEvidence, proof };
}
