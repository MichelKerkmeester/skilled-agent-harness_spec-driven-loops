// ───────────────────────────────────────────────────────────────────
// MODULE: Research Config Upcast Evidence Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
import type {
  ClassificationEvidence,
  StateBackendCensus,
} from '../../lib/inflight-state-classification/index.js';
import {
  createDeepResearchEventRegistry,
  prepareDeepResearchEvent,
  upcastLegacyDeepResearchRecord,
} from '../../lib/deep-research-ledger-schema/index.js';
import { createDeepResearchProjectionContract } from '../../lib/legacy-projections/index.js';
import { deriveResearchConfigUpcastEvidence } from '../../lib/deep-research-cutover-evidence/research-config-upcast-evidence.js';

import type {
  DeepResearchEventInput,
  DeepResearchPayloadMap,
  DeepResearchScopeMap,
} from '../../lib/deep-research-ledger-schema/index.js';
import type { ResearchConfigUpcastSeed } from '../../lib/deep-research-cutover-evidence/research-config-upcast-evidence.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

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
const ROW_ID = 'research-config';
const RESTART_FACTS = {
  stopSequence: 12,
  pendingEffects: [],
  receipts: [],
  leases: [],
  continuityId: 'research-config-continuity-1',
} as const;
const LEGACY_RECORD = {
  type: 'config',
  schemaVersion: 1,
  runId: 'research-config-run-1',
  lineageId: 'research-config-lineage-1',
  sessionId: 'research-config-run-1',
  parentSessionId: 'research-config-lineage-1',
  topic: 'runtime enablement',
  maxIterations: 10,
  convergenceThreshold: 0.05,
  antiConvergence: {
    minIterations: 3,
    convergenceMode: 'default',
    stopPolicy: 'fail-closed',
  },
  stuckThreshold: 3,
  maxDurationMinutes: 120,
  maxToolCallsPerIteration: 12,
  maxMinutesPerIteration: 10,
  progressiveSynthesis: true,
  specFolder: 'temp/research-config',
  createdAt: '2026-08-22T10:00:00.000Z',
  status: 'initialized',
  executionMode: 'auto',
  executor: 'native',
  generation: 1,
  lineage: {
    sessionId: 'research-config-run-1',
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
  },
} as const;
const CONTEXT = {
  scope: {
    runId: LEGACY_RECORD.runId,
    lineageId: LEGACY_RECORD.lineageId,
  },
  prevEventHash: '0'.repeat(64),
  replay: {
    fingerprint_version: 1,
    final_digest: sha256Bytes(canonicalBytes('research-config-replay')),
    replay_input_digests: {
      configuration: sha256Bytes(canonicalBytes(LEGACY_RECORD)),
    },
  },
} as const;

function sourceRoot(): string {
  const root = resolve(mkdtempSync(join(tmpdir(), 'research-config-upcast-')));
  SOURCE_ROOTS.push(root);
  return root;
}

function sourcePath(root: string): string {
  return resolve(join(root, 'deep-research-config.json'));
}

function sourceBytes(path: string): Buffer {
  return readFileSync(path);
}

function directorySnapshot(root: string): readonly string[] {
  return readdirSync(root, { withFileTypes: true })
    .map((entry) => `${entry.name}:${entry.isDirectory() ? 'directory' : 'file'}`)
    .sort();
}

function seedFor(path: string, afterUpcast?: () => void): ResearchConfigUpcastSeed {
  return {
    sourcePath: path,
    context: CONTEXT,
    sequence: 1,
    lifecycle: 'create once, frozen',
    mutability: 'immutable',
    restart: RESTART_FACTS,
    occurredAt: '2026-08-22T10:00:00.000Z',
    recordedAt: '2026-08-22T10:00:00.000Z',
    producer: { name: 'deep-research-runtime', version: '1' },
    authorityEpoch: 1,
    correlationId: 'research-config-correlation-1',
    causationId: null,
    idempotencyKey: 'research-config-upcast-1',
    afterUpcast,
  };
}

function otherRowEvidence(): ClassificationEvidence[] {
  return CENSUS.rows
    .filter((row) => row.id !== ROW_ID)
    .map((row) => deriveRestartClassificationEvidence({
      rowId: row.id,
      lifecycle: row.lifecycle,
      mutability: row.mutability,
      restart: RESTART_FACTS,
    }));
}

function buildManifest(researchConfigEvidence: ClassificationEvidence) {
  return createClassificationManifest({
    classificationId: 'research-config-upcast-evidence-test',
    classifiedAt: '2026-08-22T10:30:00Z',
    classifierBuildId: 'research-config-upcast-evidence-test',
    censusBytes: CENSUS_BYTES,
    evidence: [researchConfigEvidence, ...otherRowEvidence()],
  }).manifest;
}

function dispositionCounts(manifest: ReturnType<typeof buildManifest>): Record<string, number> {
  return manifest.rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.disposition] = (counts[row.disposition] ?? 0) + 1;
    return counts;
  }, {});
}

function installRestoreTrap(path: string, original: Buffer): () => void {
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

afterEach(() => {
  for (const root of SOURCE_ROOTS.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. PRODUCTION EVIDENCE
// ───────────────────────────────────────────────────────────────────

describe('research-config upcast evidence producer', () => {
  it('proves UPCAST from a real temp-file config and leaves source bytes unchanged', () => {
    const root = sourceRoot();
    const path = sourcePath(root);
    writeFileSync(path, `${JSON.stringify(LEGACY_RECORD, null, 2)}\n`);
    const beforeDirectory = directorySnapshot(root);
    const beforeBytes = sourceBytes(path);

    const first = deriveResearchConfigUpcastEvidence(seedFor(path));
    const second = deriveResearchConfigUpcastEvidence(seedFor(path));
    const manifest = buildManifest(first);
    const row = manifest.rows.find((candidate) => candidate.rowId === ROW_ID);
    const registry = createDeepResearchEventRegistry();
    const upcast = upcastLegacyDeepResearchRecord(LEGACY_RECORD, CONTEXT);
    const counts = dispositionCounts(manifest);

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
    });
    expect(upcast.status).toBe('migrated');
    if (upcast.status !== 'migrated') throw new Error(upcast.decision.reasonCode);
    const eventInput: DeepResearchEventInput<'deep_research.run_initialized'> = {
      stem: 'deep_research.run_initialized',
      scope: upcast.scope as DeepResearchScopeMap['deep_research.run_initialized'],
      prevEventHash: upcast.prevEventHash,
      replay: upcast.replay,
      data: upcast.data as DeepResearchPayloadMap['deep_research.run_initialized'],
      eventId: `deep-research-config-upcast-${upcast.originalRecordDigest}`,
      streamId: upcast.scope.runId,
      streamSequence: 1,
      occurredAt: '2026-08-22T10:00:00.000Z',
      recordedAt: '2026-08-22T10:00:00.000Z',
      producer: { name: 'deep-research-runtime', version: '1' },
      authorityEpoch: 1,
      correlationId: 'research-config-correlation-1',
      causationId: null,
      idempotencyKey: 'research-config-upcast-1',
    };
    const event = readEvent(prepareDeepResearchEvent(eventInput, registry).canonicalBytes, registry);
    const contract = createDeepResearchProjectionContract({ ledgerId: upcast.scope.runId });
    const state = contract.reduce(contract.base.state, event);
    expect(first.proof).toMatchObject({
      effectiveStateDigest: sha256Bytes(canonicalBytes(state)),
      chainIdentitiesDigest: sha256Bytes(canonicalBytes(registry.inspect().map((entry) => ({
        eventType: entry.eventType,
        chains: entry.supportedVersions.map((version) => ({
          version,
          identity: registry.chainIdentity(entry.eventType, version),
        })),
      })))),
    });
    expect(row).toMatchObject({
      disposition: InflightDisposition.UPCAST,
      reasonCode: ClassificationReasonCodes.UPCAST_PROVEN,
    });
    expect(manifest.closure).toMatchObject({
      censusRows: CENSUS.rows.length,
      classifiedRows: CENSUS.rows.length,
      missingEvidenceRows: 0,
      invalidEvidenceRows: 0,
    });
    expect({
      counts,
      reason: row?.reasonCode,
    }).toEqual({
      counts: { BLOCK: CENSUS.rows.length - 1, UPCAST: 1 },
      reason: ClassificationReasonCodes.UPCAST_PROVEN,
    });
    expect(directorySnapshot(root)).toEqual(beforeDirectory);
    expect(sourceBytes(path)).toEqual(beforeBytes);
  });

  it('blocks a source changed after hashing and restores the absolute temp path on exit signals', () => {
    const root = sourceRoot();
    const path = sourcePath(root);
    writeFileSync(path, `${JSON.stringify(LEGACY_RECORD, null, 2)}\n`);
    const beforeDirectory = directorySnapshot(root);
    const original = sourceBytes(path);
    const corrupted = Buffer.from(original);
    const marker = Buffer.from('"maxIterations": 10');
    const markerOffset = corrupted.indexOf(marker);
    expect(markerOffset).toBeGreaterThanOrEqual(0);
    corrupted[markerOffset + marker.length - 1] = '1'.charCodeAt(0);

    const removeRestoreTrap = installRestoreTrap(path, original);
    let negative: ClassificationEvidence;
    try {
      negative = deriveResearchConfigUpcastEvidence(seedFor(path, () => {
        writeFileSync(resolve(path), corrupted);
      }));
    } finally {
      removeRestoreTrap();
    }

    const manifest = buildManifest(negative);
    const row = manifest.rows.find((candidate) => candidate.rowId === ROW_ID);
    const counts = dispositionCounts(manifest);
    expect(negative.proof).toMatchObject({
      kind: 'upcast',
      deterministic: true,
      replayEquivalent: false,
      sourceBytesPreserved: false,
    });
    expect(row).toMatchObject({
      disposition: InflightDisposition.BLOCK,
      reasonCode: ClassificationReasonCodes.UPCAST_UNSAFE,
    });
    expect({
      counts,
      reason: row?.reasonCode,
    }).toEqual({
      counts: { BLOCK: CENSUS.rows.length },
      reason: ClassificationReasonCodes.UPCAST_UNSAFE,
    });
    expect(sourceBytes(path)).toEqual(original);
    expect(directorySnapshot(root)).toEqual(beforeDirectory);
  });
});
