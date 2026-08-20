// Characterization of the evidence record produced for one fixed restart
// input. The literal values below are NOT a specification of correct
// behaviour; they record what the resume classifier currently produces so
// that any future change to what gets hashed (for example, hashing a copy
// of the restart object instead of the object itself, or hashing a
// different set of fields) shows up as a test failure rather than passing
// silently. If these literals change, that change must be intentional and
// reviewed, not an accidental side effect of a refactor.

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it, vi } from 'vitest';

// Holds the evidence record handed to createClassificationManifest while
// the real classifier runs unchanged. vi.hoisted keeps it available inside
// the hoisted vi.mock factory below.
const evidenceCapture = vi.hoisted(() => ({ evidence: null as unknown }));

vi.mock('../../lib/inflight-state-classification/index.js', async () => {
  const actual = await vi.importActual<
    typeof import('../../lib/inflight-state-classification/index.js')
  >('../../lib/inflight-state-classification/index.js');
  return {
    ...actual,
    createClassificationManifest: (input: Parameters<typeof actual.createClassificationManifest>[0]) => {
      // Capture the real evidence the code under test produces, then defer
      // to the real implementation so classification behaviour is unchanged.
      evidenceCapture.evidence = input.evidence[0];
      return actual.createClassificationManifest(input);
    },
  };
});

import { createFrozenInflightResumeClassifier } from '../../lib/mixed-version-fixtures/index.js';

import type { ClassificationEvidence } from '../../lib/inflight-state-classification/index.js';
import type {
  MixedVersionRestartMetadata,
  MixedVersionResumeClassifierConfig,
} from '../../lib/mixed-version-fixtures/index.js';

const TEST_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = resolve(TEST_DIRECTORY, '../../../../../..');
const CENSUS_PATH = join(
  REPOSITORY_ROOT,
  '.opencode/specs/system-deep-loop/036-deep-loop-innovation',
  '001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json',
);

// Reuse the same frozen-census construction the rest of the suite relies on
// so the census bytes bound to this evidence are the real frozen census
// bytes, not invented ones.
function resumeClassifierConfig(): MixedVersionResumeClassifierConfig {
  return {
    classificationId: 'mixed-version-interrupted-fixture',
    classifiedAt: '2026-07-21T00:00:00Z',
    classifierBuildId: 'mixed-version-fixture-harness',
    censusBytes: readFileSync(CENSUS_PATH),
    rowId: 'fanout-checkpoints',
  };
}

const restart: MixedVersionRestartMetadata = {
  stopSequence: 7,
  continuityId: 'lineage-alpha',
  pendingEffects: ['effect-a', 'effect-b'],
  receipts: [
    { effectId: 'effect-a', receiptId: 'receipt-a' },
    { effectId: 'effect-b', receiptId: 'receipt-b' },
  ],
  leases: [
    { leaseId: 'lease-active', fencingToken: 3, state: 'active' },
    { leaseId: 'lease-quiescent', fencingToken: 5, state: 'quiescent' },
  ],
};

describe('restartClassificationEvidence characterization', () => {
  it('produces the pinned evidence record for the fixed restart input', () => {
    // Running the real classifier drives the internal evidence builder and
    // hands its result to createClassificationManifest, where the mock
    // above captures it. The classification result itself is not under test
    // here; only the captured evidence record is.
    createFrozenInflightResumeClassifier(resumeClassifierConfig(), restart)();

    const evidence = evidenceCapture.evidence as ClassificationEvidence;
    expect(evidence).toBeDefined();

    expect(evidence).toEqual({
      rowId: 'fanout-checkpoints',
      isPresent: true,
      stateDigest: '63162d9e95796093b1f86a2b66b54e3d079bfbdbad629788a01987315b1cdabf',
      shapeVersion: '1',
      shapeStatus: 'registered',
      schemaDigest: '295d129714a1a3238ab7808e2e638eedf8dda1c97e90ac6d9885acd26363e0f4',
      lifecyclePoint: 'atomic replace at pool transitions:restart-7',
      authorityState: 'legacy_authoritative',
      authorityEpoch: 5,
      mutability: 'atomic-replace',
      leaseState: 'active',
      activeLeaseCount: 1,
      leaseSetDigest: '32eabd4d7687593a30df26e24c65ea2ea95dfd12e25b9d6e473e735eca5e42cd',
      pendingEffectsState: 'active-legacy',
      pendingEffectSetDigest: 'e76a9d463f1d2404aa7c9c57fa14b741cfb90eaa1c624b3a274e3c9d385f171f',
      identityCoverage: true,
      orderCoverage: true,
      idempotencyCoverage: true,
      budgetCoverage: true,
      receiptCoverage: true,
      pendingWorkCoverage: true,
      isCorrupt: false,
      rollbackAnchor: {
        anchorId: 'lineage-alpha',
        digest: 'beb6c161d27d5d16a2fc7f4852d2a53a7190b19a71b36d4909b1edbd46e0c21c',
        retained: true,
        restorable: true,
        minimumRetentionDays: 14,
        minimumSuccessfulRuns: 5,
      },
      verifier: {
        verified: true,
        receiptDigest: 'bee18aa3233c7d7435a382c2deea70c28c2d89217f4e86dd70e0e61cbbc7e252',
        replayFingerprintDigest: null,
        rollbackScenarioDigest: 'e83b46a8088100fcfae4af9075f20080d2ed25bc91f364bb5d2abe85f266ad41',
        parityCaseDigest: null,
      },
      proof: {
        kind: 'pin',
        legacyWriterSoleAuthority: true,
        legacyCompletionAvailable: true,
        boundedCompletion: true,
        timedOut: false,
        terminalBoundary: 'lineage-alpha',
        terminalReceiptRequired: true,
      },
    });
  });
});
