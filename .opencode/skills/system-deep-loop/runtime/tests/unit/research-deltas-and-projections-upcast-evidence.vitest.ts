// ───────────────────────────────────────────────────────────────────
// MODULE: Research Deltas and Projections Upcast Evidence Tests
// ───────────────────────────────────────────────────────────────────

import {
  appendJsonlRecord,
} from '../../lib/deep-loop/jsonl-repair.js';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  canonicalBytes,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  ClassificationReasonCodes,
  createClassificationManifest,
  deriveRestartClassificationEvidence,
  InflightDisposition,
} from '../../lib/inflight-state-classification/index.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
  upcastLegacyDeepResearchRecord,
} from '../../lib/deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../../lib/legacy-projections/index.js';
import { deriveResearchDeltasUpcastEvidence } from '../../lib/deep-research-cutover-evidence/research-deltas-upcast-evidence.js';
import { deriveResearchProjectionsUpcastEvidence } from '../../lib/deep-research-cutover-evidence/research-projections-upcast-evidence.js';

import type {
  DeepResearchEventEnvelope,
  DeepResearchEventInput,
  DeepResearchPayloadMap,
  DeepResearchReplayMetadata,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type {
  ClassificationEvidence,
  StateBackendCensus,
} from '../../lib/inflight-state-classification/index.js';
import type { ResearchDeltasUpcastSeed } from '../../lib/deep-research-cutover-evidence/research-deltas-upcast-evidence.js';
import type { ResearchProjectionsUpcastSeed } from '../../lib/deep-research-cutover-evidence/research-projections-upcast-evidence.js';

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
);
const CENSUS_BYTES = readFileSync(CENSUS_PATH);
const CENSUS = JSON.parse(CENSUS_BYTES.toString('utf8')) as StateBackendCensus;
const SOURCE_ROOTS: string[] = [];
const RESTART_FACTS = {
  stopSequence: 12,
  pendingEffects: [],
  receipts: [],
  leases: [],
  continuityId: 'research-cutover-continuity-1',
} as const;
const REPLAY: DeepResearchReplayMetadata = {
  fingerprint_version: 1,
  final_digest: sha256Bytes(canonicalBytes('research-cutover-replay')),
  replay_input_digests: {
    configuration: sha256Bytes(canonicalBytes('research-cutover-configuration')),
  },
};

interface SeededChain {
  readonly records: readonly Record<string, unknown>[];
  readonly events: readonly DeepResearchEventEnvelope<'deep_research.iteration_completed'>[];
}

function sourceRoot(): string {
  const root = resolve(mkdtempSync(join(tmpdir(), 'research-cutover-evidence-')));
  SOURCE_ROOTS.push(root);
  return root;
}

function legacyIterationRecord(iteration: number): Record<string, unknown> {
  return {
    type: 'iteration',
    schemaVersion: 1,
    sessionId: 'research-cutover-run-1',
    parentSessionId: 'research-cutover-lineage-1',
    run: iteration,
    status: 'complete',
    newInfoRatio: 0.8 - iteration / 10,
    findingsCount: iteration,
    timestamp: `2026-08-22T10:0${iteration}:00.000Z`,
  };
}

function seededChain(length: number): SeededChain {
  const registry = createDeepResearchEventRegistry();
  const records: Record<string, unknown>[] = [];
  const events: DeepResearchEventEnvelope<'deep_research.iteration_completed'>[] = [];
  let previousEventHash = '0'.repeat(64);
  for (let iteration = 1; iteration <= length; iteration += 1) {
    const record = {
      ...legacyIterationRecord(iteration),
      prevEventHash: previousEventHash,
    };
    const upcast = upcastLegacyDeepResearchRecord(record, {
      scope: {
        runId: 'research-cutover-run-1',
        lineageId: 'research-cutover-lineage-1',
        iteration,
      },
      prevEventHash: previousEventHash,
      replay: REPLAY,
    });
    if (upcast.status !== 'migrated') throw new Error(upcast.decision.reasonCode);
    const input: DeepResearchEventInput<'deep_research.iteration_completed'> = {
      stem: 'deep_research.iteration_completed',
      scope: upcast.scope as DeepResearchScopeMap['deep_research.iteration_completed'],
      prevEventHash: upcast.prevEventHash,
      replay: upcast.replay,
      data: upcast.data as DeepResearchPayloadMap['deep_research.iteration_completed'],
      eventId: `research-delta-${iteration}-${upcast.originalRecordDigest}`,
      streamId: upcast.scope.runId,
      streamSequence: iteration,
      occurredAt: record.timestamp as string,
      recordedAt: '2026-08-22T10:00:00.000Z',
      producer: { name: 'deep-research-runtime', version: '1' },
      authorityEpoch: 1,
      correlationId: 'research-deltas-correlation-1',
      causationId: null,
      idempotencyKey: `research-deltas-upcast-${iteration}`,
    };
    const event = readEvent(prepareDeepResearchEvent(input, registry).canonicalBytes, registry);
    records.push(record);
    events.push(event.effective.envelope as DeepResearchEventEnvelope<'deep_research.iteration_completed'>);
    previousEventHash = event.effective.canonicalDigest;
  }
  return { records, events };
}

function writeDeltaFiles(root: string, records: readonly Record<string, unknown>[]): readonly string[] {
  const directory = join(root, 'research', 'deltas');
  mkdirSync(directory, { recursive: true });
  return records.map((record, index) => {
    const path = resolve(join(directory, `iter-${String(index + 1).padStart(3, '0')}.jsonl`));
    appendJsonlRecord(path, record);
    return path;
  });
}

function writeProjectionSource(
  root: string,
  events: readonly DeepResearchEventEnvelope<'deep_research.iteration_completed'>[],
): string {
  const path = resolve(join(root, 'research', 'source-events.jsonl'));
  mkdirSync(dirname(path), { recursive: true });
  events.forEach((event) => appendJsonlRecord(path, event as unknown as Record<string, unknown>));
  return path;
}

function sourceBytes(path: string): Uint8Array {
  return Uint8Array.from(readFileSync(path));
}

function directorySnapshot(root: string): readonly string[] {
  const entries: string[] = [];
  const visit = (directory: string, prefix: string): void => {
    readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
      const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      if (entry.isDirectory()) visit(join(directory, entry.name), relative);
      else entries.push(relative);
    });
  };
  visit(root, '');
  return entries.sort();
}

function installRestoreTrap(path: string, original: Uint8Array): () => void {
  const absolutePath = resolve(path);
  let active = true;
  const restore = (): void => {
    if (!active) return;
    writeFileSync(absolutePath, original);
    active = false;
  };
  const restoreOnSignal = (): void => {
    restore();
    process.exit(143);
  };
  process.once('exit', restore);
  process.once('SIGINT', restoreOnSignal);
  process.once('SIGTERM', restoreOnSignal);
  return (): void => {
    restore();
    process.removeListener('exit', restore);
    process.removeListener('SIGINT', restoreOnSignal);
    process.removeListener('SIGTERM', restoreOnSignal);
  };
}

function otherRowEvidence(excludedRowId: string): ClassificationEvidence[] {
  return CENSUS.rows
    .filter((row) => row.id !== excludedRowId)
    .map((row) => deriveRestartClassificationEvidence({
      rowId: row.id,
      lifecycle: row.lifecycle,
      mutability: row.mutability,
      restart: RESTART_FACTS,
    }));
}

function buildManifest(rowEvidence: ClassificationEvidence): ReturnType<typeof createClassificationManifest>['manifest'] {
  return createClassificationManifest({
    classificationId: `${rowEvidence.rowId}-upcast-evidence-test`,
    classifiedAt: '2026-08-22T10:30:00Z',
    classifierBuildId: `${rowEvidence.rowId}-upcast-evidence-test`,
    censusBytes: CENSUS_BYTES,
    evidence: [rowEvidence, ...otherRowEvidence(rowEvidence.rowId)],
  }).manifest;
}

function dispositionCounts(
  manifest: ReturnType<typeof buildManifest>,
): Record<string, number> {
  return manifest.rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.disposition] = (counts[row.disposition] ?? 0) + 1;
    return counts;
  }, {});
}

function foldDigest(
  events: readonly DeepResearchEventEnvelope<'deep_research.iteration_completed'>[],
): string {
  const registry = createDeepResearchEventRegistry();
  const contract = createDeepResearchProjectionContract({ ledgerId: events[0].stream_id });
  const state = events.reduce(
    (current, envelope) => contract.reduce(
      current,
      readEvent(canonicalBytes(envelope), registry),
    ),
    contract.base.state,
  );
  const serialized = contract.serialize(state);
  const bytes = typeof serialized === 'string'
    ? Uint8Array.from(Buffer.from(serialized, 'utf8'))
    : Uint8Array.from(serialized);
  return sha256Bytes(bytes);
}

function chainIdentitiesDigest(): string {
  const registry = createDeepResearchEventRegistry();
  return sha256Bytes(canonicalBytes(registry.inspect().map((entry) => ({
    eventType: entry.eventType,
    chains: entry.supportedVersions.map((version) => ({
      version,
      identity: registry.chainIdentity(entry.eventType, version),
    })),
  }))));
}

function deltaSourceBytesDigest(paths: readonly string[]): string {
  return sha256Bytes(canonicalBytes(paths.map((path) => Array.from(sourceBytes(path)))));
}

function deltaSeed(
  paths: readonly string[],
  afterStableObservation?: () => void,
): ResearchDeltasUpcastSeed {
  return {
    sourcePaths: paths,
    replay: REPLAY,
    lifecycle: 'append one file per iteration',
    mutability: 'append-only',
    restart: RESTART_FACTS,
    occurredAt: '2026-08-22T10:00:00.000Z',
    recordedAt: '2026-08-22T10:00:00.000Z',
    producer: { name: 'deep-research-runtime', version: '1' },
    authorityEpoch: 1,
    correlationId: 'research-deltas-correlation-1',
    causationId: null,
    idempotencyKeyPrefix: 'research-deltas-upcast',
    afterStableObservation,
  };
}

function projectionSeed(
  path: string,
  afterFirstFold?: () => void,
): ResearchProjectionsUpcastSeed {
  return {
    sourcePath: path,
    lifecycle: 'atomic regenerate',
    mutability: 'atomic-replace',
    restart: RESTART_FACTS,
    afterFirstFold,
  };
}

afterEach(() => {
  for (const root of SOURCE_ROOTS.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('research-deltas upcast evidence producer', () => {
  it('proves the full iteration chain through real JSONL append and fold paths', () => {
    const root = sourceRoot();
    const chain = seededChain(3);
    const paths = writeDeltaFiles(root, chain.records);
    const beforeDirectory = directorySnapshot(root);
    const beforeBytes = paths.map(sourceBytes);

    const first = deriveResearchDeltasUpcastEvidence(deltaSeed(paths));
    const second = deriveResearchDeltasUpcastEvidence(deltaSeed(paths));
    const manifest = buildManifest(first);
    const row = manifest.rows.find((candidate) => candidate.rowId === 'research-deltas');
    const counts = dispositionCounts(manifest);
    const registry = createDeepResearchEventRegistry();

    expect(first).toEqual(second);
    expect(first.proof).toMatchObject({
      kind: 'upcast',
      adjacentChainComplete: true,
      pure: true,
      deterministic: true,
      sideEffectFree: true,
      sourceBytesPreserved: true,
      immutableIdentityPreserved: true,
      replayEquivalent: true,
      sourceBytesDigest: deltaSourceBytesDigest(paths),
      registryDigest: registry.digest,
      chainIdentitiesDigest: chainIdentitiesDigest(),
      effectiveStateDigest: foldDigest(chain.events),
    });
    expect(row).toMatchObject({
      disposition: InflightDisposition.UPCAST,
      reasonCode: ClassificationReasonCodes.UPCAST_PROVEN,
    });
    expect({ counts, reason: row?.reasonCode }).toEqual({
      counts: { BLOCK: CENSUS.rows.length - 1, UPCAST: 1 },
      reason: ClassificationReasonCodes.UPCAST_PROVEN,
    });
    expect(manifest.closure).toMatchObject({
      censusRows: CENSUS.rows.length,
      classifiedRows: CENSUS.rows.length,
      missingEvidenceRows: 0,
      invalidEvidenceRows: 0,
    });
    expect(directorySnapshot(root)).toEqual(beforeDirectory);
    expect(paths.map(sourceBytes)).toEqual(beforeBytes);
  });

  it('blocks a post-read iteration gap, keeps deterministic flags observable, and restores the absolute source path', () => {
    const root = sourceRoot();
    const chain = seededChain(3);
    const paths = writeDeltaFiles(root, chain.records);
    const targetPath = paths[1];
    const original = sourceBytes(targetPath);
    const beforeDirectory = directorySnapshot(root);
    const corrupted = { ...chain.records[1], run: 4 };
    const removeRestoreTrap = installRestoreTrap(targetPath, original);
    let negative: ClassificationEvidence;
    try {
      negative = deriveResearchDeltasUpcastEvidence(deltaSeed(paths, () => {
        writeFileSync(resolve(targetPath), `${JSON.stringify(corrupted)}\n`);
      }));
    } finally {
      removeRestoreTrap();
    }

    const manifest = buildManifest(negative);
    const row = manifest.rows.find((candidate) => candidate.rowId === 'research-deltas');
    const counts = dispositionCounts(manifest);
    expect(negative.proof).toMatchObject({
      kind: 'upcast',
      adjacentChainComplete: false,
      pure: true,
      deterministic: true,
      sideEffectFree: false,
      sourceBytesPreserved: false,
      immutableIdentityPreserved: true,
      replayEquivalent: false,
    });
    expect(row).toMatchObject({
      disposition: InflightDisposition.BLOCK,
      reasonCode: ClassificationReasonCodes.UPCAST_UNSAFE,
    });
    expect({ counts, reason: row?.reasonCode }).toEqual({
      counts: { BLOCK: CENSUS.rows.length },
      reason: ClassificationReasonCodes.UPCAST_UNSAFE,
    });
    expect(sourceBytes(targetPath)).toEqual(original);
    expect(directorySnapshot(root)).toEqual(beforeDirectory);
  });
});

describe('research-projections derived upcast evidence producer', () => {
  it('proves pure projection re-derivation from an unchanged current event chain', () => {
    const root = sourceRoot();
    const chain = seededChain(4);
    const sourcePath = writeProjectionSource(root, chain.events.slice(0, 3));
    const beforeDirectory = directorySnapshot(root);
    const beforeBytes = sourceBytes(sourcePath);

    const first = deriveResearchProjectionsUpcastEvidence(projectionSeed(sourcePath));
    const second = deriveResearchProjectionsUpcastEvidence(projectionSeed(sourcePath));
    const manifest = buildManifest(first);
    const row = manifest.rows.find((candidate) => candidate.rowId === 'research-projections');
    const counts = dispositionCounts(manifest);
    const registry = createDeepResearchEventRegistry();

    expect(first).toEqual(second);
    expect(first.proof).toMatchObject({
      kind: 'upcast',
      adjacentChainComplete: true,
      pure: true,
      deterministic: true,
      sideEffectFree: true,
      sourceBytesPreserved: true,
      immutableIdentityPreserved: true,
      replayEquivalent: true,
      sourceBytesDigest: sha256Bytes(beforeBytes),
      registryDigest: registry.digest,
      chainIdentitiesDigest: chainIdentitiesDigest(),
      effectiveStateDigest: foldDigest(chain.events.slice(0, 3)),
    });
    expect(row).toMatchObject({
      disposition: InflightDisposition.UPCAST,
      reasonCode: ClassificationReasonCodes.UPCAST_PROVEN,
    });
    expect({ counts, reason: row?.reasonCode }).toEqual({
      counts: { BLOCK: CENSUS.rows.length - 1, UPCAST: 1 },
      reason: ClassificationReasonCodes.UPCAST_PROVEN,
    });
    expect(directorySnapshot(root)).toEqual(beforeDirectory);
    expect(sourceBytes(sourcePath)).toEqual(beforeBytes);
  });

  it('blocks a nondeterministic fold while preserving the original source bytes after the trap restores it', () => {
    const root = sourceRoot();
    const chain = seededChain(4);
    const sourcePath = writeProjectionSource(root, chain.events.slice(0, 3));
    const original = sourceBytes(sourcePath);
    const beforeDirectory = directorySnapshot(root);
    const removeRestoreTrap = installRestoreTrap(sourcePath, original);
    let negative: ClassificationEvidence;
    try {
      negative = deriveResearchProjectionsUpcastEvidence(projectionSeed(sourcePath, () => {
        appendJsonlRecord(
          resolve(sourcePath),
          chain.events[3] as unknown as Record<string, unknown>,
        );
      }));
    } finally {
      removeRestoreTrap();
    }

    const manifest = buildManifest(negative);
    const row = manifest.rows.find((candidate) => candidate.rowId === 'research-projections');
    const counts = dispositionCounts(manifest);
    expect(negative.proof).toMatchObject({
      kind: 'upcast',
      adjacentChainComplete: true,
      pure: false,
      deterministic: false,
      sideEffectFree: false,
      sourceBytesPreserved: false,
      immutableIdentityPreserved: true,
      replayEquivalent: false,
    });
    expect(row).toMatchObject({
      disposition: InflightDisposition.BLOCK,
      reasonCode: ClassificationReasonCodes.UPCAST_UNSAFE,
    });
    expect({ counts, reason: row?.reasonCode }).toEqual({
      counts: { BLOCK: CENSUS.rows.length },
      reason: ClassificationReasonCodes.UPCAST_UNSAFE,
    });
    expect(sourceBytes(sourcePath)).toEqual(original);
    expect(directorySnapshot(root)).toEqual(beforeDirectory);
  });
});
