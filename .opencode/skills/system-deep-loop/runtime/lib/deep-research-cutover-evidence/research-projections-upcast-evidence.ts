// ───────────────────────────────────────────────────────────────────
// MODULE: Research Projections Upcast Evidence
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  canonicalBytes,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import { createDeepResearchEventRegistry } from '../deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../legacy-projections/index.js';
import { deriveRestartClassificationEvidence } from '../inflight-state-classification/restart-classification-evidence.js';
import { FROZEN_CENSUS_ROW_POLICIES } from '../inflight-state-classification/frozen-census-policy.js';
import { InflightDisposition } from '../inflight-state-classification/inflight-state-types.js';

import type { DeepResearchEventStem } from '../deep-research-ledger-schema/index.js';
import type { EventReadResult } from '../event-envelope/index.js';
import type {
  ClassificationEvidence,
  DispositionProof,
} from '../inflight-state-classification/inflight-state-types.js';
import type { RestartFacts } from '../inflight-state-classification/restart-classification-evidence.js';

export interface ResearchProjectionsUpcastSeed {
  readonly sourcePath: string;
  readonly lifecycle: string;
  readonly mutability: string;
  readonly restart: RestartFacts;
  readonly afterFirstFold?: () => void;
}

interface SourceObservation {
  readonly path: string;
  readonly bytes: Uint8Array;
  readonly records: readonly Record<string, unknown>[];
}

interface EventChainObservation {
  readonly events: readonly EventReadResult[];
  readonly adjacentChainComplete: boolean;
  readonly immutableIdentityPreserved: boolean;
  readonly allCurrentIterationEvents: boolean;
}

interface FoldObservation {
  readonly bytes: Uint8Array;
  readonly digest: string;
}

interface ProjectionObservation {
  readonly before: SourceObservation;
  readonly first: EventChainObservation;
  readonly firstFold: FoldObservation;
  readonly second: EventChainObservation;
  readonly secondFold: FoldObservation;
  readonly after: SourceObservation;
  readonly afterChain: EventChainObservation;
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

function chainIdentitiesDigest(registry: ReturnType<typeof createDeepResearchEventRegistry>): string {
  return digest(registry.inspect().map((entry) => ({
    eventType: entry.eventType,
    chains: entry.supportedVersions.map((version) => ({
      version,
      identity: registry.chainIdentity(entry.eventType, version),
    })),
  })));
}

function readSource(pathInput: string): SourceObservation {
  const path = resolve(pathInput);
  const bytes = Uint8Array.from(readFileSync(path));
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const records = text.split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line, index) => {
      const parsed = JSON.parse(line) as unknown;
      if (!isRecord(parsed)) throw new TypeError(`Research projection source line ${index + 1} is not an object`);
      return parsed;
    });
  return { path, bytes, records };
}

function eventStem(event: EventReadResult): DeepResearchEventStem | null {
  const payload = event.effective.envelope.payload as Record<string, unknown>;
  return typeof payload.stem === 'string' ? payload.stem as DeepResearchEventStem : null;
}

function observeEventChain(
  source: SourceObservation,
  registry: ReturnType<typeof createDeepResearchEventRegistry>,
): EventChainObservation {
  const events = source.records.map((record) => readEvent(canonicalBytes(record), registry));
  let expectedPreviousEventHash = GENESIS_EVENT_HASH;
  let adjacentChainComplete = events.length > 0;
  let immutableIdentityPreserved = events.length > 0;
  let allCurrentIterationEvents = events.length > 0;
  let runId: string | null = null;
  let lineageId: string | null = null;

  events.forEach((event, index) => {
    const payload = event.effective.envelope.payload as Record<string, unknown>;
    const scope = payload.scope as Record<string, unknown>;
    const currentRunId = typeof scope.runId === 'string' ? scope.runId : null;
    const currentLineageId = typeof scope.lineageId === 'string' ? scope.lineageId : null;
    const iteration = typeof scope.iteration === 'number' ? scope.iteration : null;
    if (runId === null) runId = currentRunId;
    if (lineageId === null) lineageId = currentLineageId;
    adjacentChainComplete = adjacentChainComplete
      && eventStem(event) === 'deep_research.iteration_completed'
      && iteration === index + 1
      && payload.prevEventHash === expectedPreviousEventHash
      && event.effective.envelope.stream_sequence === index + 1;
    immutableIdentityPreserved = immutableIdentityPreserved
      && currentRunId !== null
      && currentLineageId !== null
      && currentRunId === runId
      && currentLineageId === lineageId
      && event.effective.envelope.stream_id === currentRunId;
    allCurrentIterationEvents = allCurrentIterationEvents
      && eventStem(event) === 'deep_research.iteration_completed'
      && event.hopTrace.length === 0;
    expectedPreviousEventHash = event.effective.canonicalDigest;
  });

  return {
    events,
    adjacentChainComplete,
    immutableIdentityPreserved,
    allCurrentIterationEvents,
  };
}

function foldEvents(events: readonly EventReadResult[]): FoldObservation {
  const contract = createDeepResearchProjectionContract({
    ledgerId: events[0]?.effective.envelope.stream_id ?? 'research-projections',
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

function observe(seed: ResearchProjectionsUpcastSeed): ProjectionObservation {
  const before = readSource(seed.sourcePath);
  const registry = createDeepResearchEventRegistry();
  const first = observeEventChain(before, registry);
  const firstFold = foldEvents(first.events);
  seed.afterFirstFold?.();
  const second = observeEventChain(readSource(seed.sourcePath), registry);
  const secondFold = foldEvents(second.events);
  const after = readSource(seed.sourcePath);
  const afterChain = observeEventChain(after, registry);
  const afterFold = foldEvents(afterChain.events);
  return { before, first, firstFold, second, secondFold, after, afterChain, afterFold };
}

function blockProof(reason: string): DispositionProof {
  return { kind: 'block', veto: reason };
}

/**
 * Derive observed UPCAST proof for projection bytes derived from current events.
 *
 * @param seed - Current source-event JSONL and restart facts for the row.
 * @returns Classification evidence proving or blocking the derived projection row.
 */
export function deriveResearchProjectionsUpcastEvidence(
  seed: ResearchProjectionsUpcastSeed,
): ClassificationEvidence {
  const policy = FROZEN_CENSUS_ROW_POLICIES['research-projections'];
  const restartEvidence = deriveRestartClassificationEvidence({
    rowId: 'research-projections',
    lifecycle: seed.lifecycle,
    mutability: seed.mutability,
    restart: seed.restart,
  });
  const registry = createDeepResearchEventRegistry();
  const observation = observe(seed);
  const sourceBytesPreserved = bytesEqual(observation.before.bytes, observation.after.bytes);
  const deterministic = bytesEqual(observation.firstFold.bytes, observation.secondFold.bytes);
  const replayEquivalent = deterministic
    && bytesEqual(observation.firstFold.bytes, observation.afterFold.bytes);
  const dispositionIsUpcast = policy.disposition === InflightDisposition.UPCAST
    && observation.first.allCurrentIterationEvents
    && observation.second.allCurrentIterationEvents
    && observation.first.events.length > 0;
  const proof: DispositionProof = dispositionIsUpcast
    ? {
      kind: 'upcast',
      adjacentChainComplete: observation.first.adjacentChainComplete
        && observation.second.adjacentChainComplete
        && observation.afterChain.adjacentChainComplete,
      pure: deterministic && sourceBytesPreserved,
      deterministic,
      sideEffectFree: sourceBytesPreserved,
      sourceBytesPreserved,
      immutableIdentityPreserved: observation.first.immutableIdentityPreserved
        && observation.second.immutableIdentityPreserved
        && observation.afterChain.immutableIdentityPreserved,
      replayEquivalent,
      sourceBytesDigest: sha256Bytes(observation.before.bytes),
      effectiveStateDigest: observation.firstFold.digest,
      registryDigest: registry.digest,
      chainIdentitiesDigest: chainIdentitiesDigest(registry),
    }
    : blockProof('research-projections upcast unavailable: current source-event chain was not proven');
  return { ...restartEvidence, proof };
}
