// ───────────────────────────────────────────────────────────────────
// TEST: Hermetic Rollback Drills
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  createHmacCertificationProvider,
} from '../../lib/receipts-and-effect-recovery/index.js';
import {
  DRILL_INPUT_BINDING_KEYS,
  DetectorByFaultFixture,
  DrillTimelineSteps,
  ROLLBACK_STATE_FILE,
  ROLLBACK_DRILL_SCHEMA_VERSION,
  RollbackDrillError,
  RollbackDrillReasonCodes,
  RollbackFaultFixtures,
  SandboxedAuthorityStore,
  classificationManifestDigest,
  rollbackAnchorDigest,
  runRollbackDrill,
  verifyPhase014RollbackEvidence,
} from '../../lib/rollback-drills/index.js';

import type { CertificationProfile } from '../../lib/receipts-and-effect-recovery/index.js';
import type {
  DrillInputBindings,
  InflightClassificationManifest,
  RollbackDrillClock,
  RollbackDrillManifest,
  RollbackDrillOptions,
  RollbackFaultFixture,
  RollbackLaneState,
  RollbackStateReconstruction,
} from '../../lib/rollback-drills/index.js';

interface CensusRow {
  readonly id: string;
  readonly mutability: string;
  readonly lifecycle: string;
}

interface CensusDocument {
  readonly rows: CensusRow[];
}

const CENSUS_PATH = fileURLToPath(new URL(
  '../../../../../specs/system-deep-loop/036-deep-loop-innovation/'
    + '003-baseline-taxonomy-and-state-census/state-backend-census.json',
  import.meta.url,
));
const CENSUS = JSON.parse(readFileSync(CENSUS_PATH, 'utf8')) as CensusDocument;
const CUTOVER_ELIGIBLE_MODES = Object.freeze([
  'research',
  'review',
  'ai-council',
  'agent-improvement',
  'model-benchmark',
  'skill-benchmark',
  'alignment',
] as const);
const DURABLE_PROFILE: CertificationProfile = Object.freeze({
  scheme: 'hmac-sha256',
  provider_id: 'rollback-drill-test-provider',
  key_id: 'rollback-drill-test-key',
  verifier_version: '1',
  trust_scope: 'durable-cross-resume',
});
const CERTIFICATION_PROVIDER = createHmacCertificationProvider(
  DURABLE_PROFILE,
  'rollback-drill-test-secret-with-more-than-thirty-two-bytes',
);
const TEST_ROOTS: string[] = [];

class SyntheticClock implements RollbackDrillClock {
  #instant: number;

  public constructor(instant = '2026-07-10T00:00:00.000Z') {
    this.#instant = Date.parse(instant);
  }

  public now(): Date {
    return new Date(this.#instant);
  }

  public advance(milliseconds: number): void {
    this.#instant += milliseconds;
  }
}

function digest(label: string): string {
  return sha256Bytes(canonicalBytes({ label }));
}

function classification(): InflightClassificationManifest {
  const rows = CENSUS.rows.map((row) => ({
    rowId: row.id,
    stateDigest: digest(`state:${row.id}`),
    shapeVersion: 'census-v1',
    lifecyclePoint: row.lifecycle,
    authorityEpoch: 7,
    mutability: row.mutability,
    activeLeaseIds: [],
    pendingEffectIds: [],
    identityCoverageComplete: true,
    orderCoverageComplete: true,
    rollbackAnchorDigest: digest(`anchor:${row.id}`),
    disposition: 'UPCAST' as const,
    reasonCode: 'sandbox-upcast-covered',
    verifier: 'rollback-drill-verifier',
    terminalReceiptId: null,
    isQuiescent: true,
  }));
  return {
    expectedRowIds: rows.map((row) => row.rowId),
    rows,
  };
}

function manifest(
  mode: string,
  fixture: RollbackFaultFixture,
  clock: SyntheticClock,
): RollbackDrillManifest {
  const classified = classification();
  const anchorState: RollbackLaneState = {
    facts: ['sealed-anchor-fact'],
    artifacts: { seed: 'stable' },
    completedSteps: 1,
  };
  const anchorId = `${mode}-rollback-anchor`;
  const anchorDigest = rollbackAnchorDigest(anchorId, anchorState);
  const bindings: DrillInputBindings = {
    adapterRegistry: digest('adapter-registry-v1'),
    base: digest('base-identity'),
    candidate: digest('candidate-identity'),
    classificationManifest: classificationManifestDigest(classified),
    contractDefectLedger: digest('contract-defect-ledger-v1'),
    eventSchemaCensus: digest('event-schema-census-v1'),
    fingerprintContract: digest('fingerprint-contract-v1'),
    modeRegistry: digest('mode-registry-v1'),
    parityCertificate: digest(`parity-certificate:${mode}`),
    phaseTree: digest('phase-tree-v1'),
    policy: digest('rollback-policy-v1'),
    projectionContract: digest('projection-contract-v1'),
    receiptContract: digest('receipt-contract-v1'),
    rollbackAsset: anchorDigest,
  };
  const now = clock.now().getTime();
  return {
    schemaVersion: ROLLBACK_DRILL_SCHEMA_VERSION,
    drillId: `${mode}-${fixture.replaceAll('_', '-')}-drill`,
    mode,
    baseSha: digest('base-commit').slice(0, 40),
    candidateSha: digest('candidate-commit').slice(0, 40),
    policyVersion: 'rollback-policy-v1',
    verifierIdentity: 'rollback-drill-verifier',
    startingAuthorityEpoch: 7,
    legacyWriterId: 'legacy-writer',
    spineWriterId: 'spine-writer',
    bindings,
    parityUnresolvedDivergences: 0,
    classification: classified,
    rollbackAnchor: {
      anchorId,
      state: anchorState,
      digest: anchorDigest,
    },
    workload: {
      factIds: ['continued-fact-a', 'continued-fact-b'],
      artifactName: 'result.json',
      artifactContent: '{"status":"complete"}',
    },
    rollbackWindow: {
      openedAt: new Date(now - 9 * 24 * 60 * 60 * 1_000).toISOString(),
      successfulAuthoritativeRuns: 5,
      minimumCalendarDays: 14,
      minimumSuccessfulRuns: 5,
      stricterDeadlineAt: new Date(now + 60 * 60 * 1_000).toISOString(),
    },
    fault: {
      fixture,
      expectedDetector: DetectorByFaultFixture[fixture],
      cutPoint: 'after-durable-spine-work',
      timeoutMs: 100,
    },
  };
}

function environment(
  mode = 'research',
  fixture: RollbackFaultFixture = RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH,
  clock = new SyntheticClock(),
): Readonly<{
  options: RollbackDrillOptions;
  sandboxRoot: string;
  protectedFile: string;
  protectedBytes: string;
}> {
  const protectedRoot = mkdtempSync(join(tmpdir(), 'deep-loop-rollback-protected-'));
  const sandboxRoot = mkdtempSync(join(tmpdir(), 'deep-loop-rollback-drill-'));
  TEST_ROOTS.push(protectedRoot, sandboxRoot);
  const protectedFile = join(protectedRoot, 'live-authority.json');
  const protectedBytes = '{"state":"legacy_authoritative","epoch":41}\n';
  writeFileSync(protectedFile, protectedBytes, { mode: 0o600 });
  return {
    options: {
      manifest: manifest(mode, fixture, clock),
      currentMode: mode,
      currentBindings: manifest(mode, fixture, clock).bindings,
      sandboxRoot,
      protectedPaths: [{ id: 'live-authority', path: protectedFile }],
      certificationProvider: CERTIFICATION_PROVIDER,
      certificationProfile: DURABLE_PROFILE,
      clock,
    },
    sandboxRoot,
    protectedFile,
    protectedBytes,
  };
}

function withClassification(
  fixture: ReturnType<typeof environment>,
  classified: InflightClassificationManifest,
): RollbackDrillOptions {
  const bindings = {
    ...fixture.options.manifest.bindings,
    classificationManifest: classificationManifestDigest(classified),
  };
  return {
    ...fixture.options,
    manifest: {
      ...fixture.options.manifest,
      classification: classified,
      bindings,
    },
    currentBindings: bindings,
  };
}

afterEach(() => {
  for (const root of TEST_ROOTS.splice(0)) {
    chmodSync(root, 0o700);
    rmSync(root, { recursive: true, force: true });
  }
});

describe('rollback drill execution', () => {
  it.each(CUTOVER_ELIGIBLE_MODES)(
    'executes and reverses a sandbox cutover for %s',
    async (mode) => {
      const fixture = environment(mode);
      const result = await runRollbackDrill(fixture.options);
      const facts = result.certificate.facts;

      expect(facts.passed).toBe(true);
      expect(facts.observedDetector).toBe(facts.expectedDetector);
      expect(facts.authorityTransitions.map((entry) => [
        entry.fromState,
        entry.toState,
        entry.fromEpoch,
        entry.toEpoch,
      ])).toEqual([
        ['cutover_ready', 'new_authoritative_reversible', 7, 8],
        ['new_authoritative_reversible', 'rollback_pending', 8, 9],
        ['rollback_pending', 'legacy_authoritative', 9, 10],
      ]);
      expect(facts.timeline.map((entry) => entry.step)).toEqual([
        DrillTimelineSteps.PREFLIGHT,
        DrillTimelineSteps.CONTROL_CONTINUED,
        DrillTimelineSteps.TEST_CUTOVER,
        DrillTimelineSteps.SPINE_WORK_COMMITTED,
        DrillTimelineSteps.REGRESSION_DETECTED,
        DrillTimelineSteps.ADMISSION_FROZEN,
        DrillTimelineSteps.SPINE_FENCED,
        DrillTimelineSteps.STATE_RECONCILED,
        DrillTimelineSteps.LEGACY_RESTORED,
        DrillTimelineSteps.STALE_WRITER_DENIED,
        DrillTimelineSteps.LEGACY_RESUMED,
        DrillTimelineSteps.INTEGRITY_VERIFIED,
        DrillTimelineSteps.CLEANUP_VERIFIED,
      ]);
      expect(facts.restoredAuthorityState).toBe('legacy_authoritative');
      expect(facts.staleWriterDenied).toBe(true);
      expect(facts.replay).toMatchObject({
        controlVerified: true,
        resumedVerified: true,
        effectiveEventDigestMatch: true,
        projectionDigestMatch: true,
      });
      for (const range of [facts.replay.controlRange, facts.replay.resumedRange]) {
        expect(range).toMatchObject({
          rangeStartSequence: 1,
          sealedHeadSequence: 1,
          boundedSpineWorkCovered: true,
          effectEventsCovered: true,
          forwardCutoverCovered: true,
          rollbackTransitionCovered: true,
          restoredStateCovered: true,
        });
        expect(range.rangeEndSequence).toBeGreaterThan(range.sealedHeadSequence);
      }
      expect(facts.legacyProjection).toMatchObject({
        bytesMatch: true,
        readerResultMatch: true,
      });
      expect(facts.state).toMatchObject({
        duplicateFactCount: 0,
        stateDigestMatch: true,
      });
      expect(facts.effects).toMatchObject({
        intentCount: 1,
        confirmationCount: 1,
        conflictCount: 0,
        unresolvedIntentCount: 0,
        terminalExactlyOnce: true,
      });
      expect(facts.cleanup).toEqual({
        disposableStateRemoved: true,
        evidencePreserved: true,
        residualEntries: ['evidence'],
      });
      expect(readFileSync(fixture.protectedFile, 'utf8')).toBe(fixture.protectedBytes);
      expect(statSync(result.certificatePath).mode & 0o222).toBe(0);
      expect(readFileSync(result.certificatePath, 'utf8')).not.toContain(
        'rollback-drill-test-secret',
      );
      expect(await verifyPhase014RollbackEvidence({
        certificatePath: result.certificatePath,
        expectedMode: mode,
        currentBindings: fixture.options.manifest.bindings,
        certificationProvider: CERTIFICATION_PROVIDER,
      })).toMatchObject({ ok: true });
    },
  );

  it.each([
    RollbackFaultFixtures.LEGACY_PROJECTION_MISMATCH,
    RollbackFaultFixtures.STALE_AUTHORITY_EPOCH,
    RollbackFaultFixtures.MISSING_RECEIPT,
    RollbackFaultFixtures.CRASH_AT_CUT_POINT,
    RollbackFaultFixtures.TIMEOUT_AT_CUT_POINT,
  ] as const)('recovers the %s fixture with exact detector evidence', async (fixtureName) => {
    const fixture = environment('review', fixtureName);
    const result = await runRollbackDrill(fixture.options);

    expect(result.certificate.facts).toMatchObject({
      passed: true,
      regressionDetected: true,
      expectedDetector: DetectorByFaultFixture[fixtureName],
      observedDetector: DetectorByFaultFixture[fixtureName],
      restoredAuthorityState: 'legacy_authoritative',
    });
    expect(result.certificate.facts.effects).toMatchObject({
      intentCount: 1,
      confirmationCount: 1,
      conflictCount: 0,
      unresolvedIntentCount: 0,
      terminalExactlyOnce: true,
    });
    expect(readFileSync(fixture.protectedFile, 'utf8')).toBe(fixture.protectedBytes);
  });

  it.each([
    RollbackFaultFixtures.CONFLICTING_RECEIPT,
    RollbackFaultFixtures.UNRESOLVED_EFFECT_INTENT,
  ] as const)('fails closed for non-clean %s recovery', async (fixtureName) => {
    const fixture = environment('alignment', fixtureName);
    const result = await runRollbackDrill(fixture.options);
    const preflight = await verifyPhase014RollbackEvidence({
      certificatePath: result.certificatePath,
      expectedMode: 'alignment',
      currentBindings: fixture.options.manifest.bindings,
      certificationProvider: CERTIFICATION_PROVIDER,
    });

    expect(result.certificate.facts.passed).toBe(false);
    expect(result.certificate.facts.reasonCodes).toContain(
      fixtureName === RollbackFaultFixtures.CONFLICTING_RECEIPT
        ? RollbackDrillReasonCodes.EFFECT_CONFLICT
        : RollbackDrillReasonCodes.EFFECT_IN_DOUBT,
    );
    expect(preflight).toMatchObject({
      ok: false,
      reasonCode: RollbackDrillReasonCodes.CERTIFICATE_INVALID,
    });
    expect(readFileSync(fixture.protectedFile, 'utf8')).toBe(fixture.protectedBytes);
  });

  it('fails closed when legacy authority cannot be restored', async () => {
    const fixture = environment('research');
    const result = await runRollbackDrill({
      ...fixture.options,
      faultHooks: {
        beforeLegacyRestore: () => {
          throw new Error('synthetic authority-store interruption');
        },
      },
    });

    expect(result.certificate.facts).toMatchObject({
      passed: false,
      restoredAuthorityEpoch: null,
      restoredAuthorityState: null,
    });
    expect(result.certificate.facts.reasonCodes).toContain(
      RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
    );
    expect(readFileSync(fixture.protectedFile, 'utf8')).toBe(fixture.protectedBytes);
  });

  it('fails closed when persisted restored state is corrupted outside the drill fixtures', async () => {
    const fixture = environment('research');
    const persistedStatePath = join(
      fixture.sandboxRoot,
      'cutover',
      'authority',
      ROLLBACK_STATE_FILE,
    );
    const result = await runRollbackDrill({
      ...fixture.options,
      faultHooks: {
        afterLegacyRestore: () => {
          const persisted = JSON.parse(
            readFileSync(persistedStatePath, 'utf8'),
          ) as RollbackStateReconstruction;
          const corrupted = {
            ...persisted,
            state: {
              ...persisted.state,
              artifacts: {
                ...persisted.state.artifacts,
                seed: 'storage-layer-corruption',
              },
            },
          };
          writeFileSync(persistedStatePath, Uint8Array.from(canonicalBytes(corrupted)));
        },
      },
    });

    expect(result.certificate.facts.passed).toBe(false);
    expect(result.certificate.facts.reasonCodes).toEqual(expect.arrayContaining([
      RollbackDrillReasonCodes.REPLAY_INTEGRITY_FAILED,
      RollbackDrillReasonCodes.PROJECTION_INTEGRITY_FAILED,
      RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
    ]));
    expect(result.certificate.facts.replay.effectiveEventDigestMatch).toBe(false);
    expect(result.certificate.facts.legacyProjection.bytesMatch).toBe(false);
    expect(result.certificate.facts.state.stateDigestMatch).toBe(false);
  });

  it('fails when the durable restore write is short-circuited', async () => {
    const fixture = environment('review');
    const restore = vi.spyOn(SandboxedAuthorityStore.prototype, 'restoreLegacyState')
      .mockImplementation((_epoch, reconstruction) => reconstruction);
    try {
      const result = await runRollbackDrill(fixture.options);

      expect(result.certificate.facts.passed).toBe(false);
      expect(result.certificate.facts.reasonCodes).toEqual(expect.arrayContaining([
        RollbackDrillReasonCodes.REPLAY_INTEGRITY_FAILED,
        RollbackDrillReasonCodes.PROJECTION_INTEGRITY_FAILED,
        RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
      ]));
      expect(result.certificate.facts.state.reconstructionDigestMatch).toBe(false);
    } finally {
      restore.mockRestore();
    }
  });

  it('applies each declared disposition to the reconstructed state', async () => {
    const upcastFixture = environment('alignment');
    const forkFixture = environment('alignment');
    const changedRows = forkFixture.options.manifest.classification.rows.map((row, index) => (
      index === 0
        ? { ...row, disposition: 'FORK' as const, reasonCode: 'sandbox-fork-covered' }
        : row
    ));
    const forkClassification = {
      ...forkFixture.options.manifest.classification,
      rows: changedRows,
    };

    const upcastResult = await runRollbackDrill(upcastFixture.options);
    const forkResult = await runRollbackDrill(withClassification(
      forkFixture,
      forkClassification,
    ));

    expect(upcastResult.certificate.facts.passed).toBe(true);
    expect(forkResult.certificate.facts.passed).toBe(true);
    expect(upcastResult.certificate.facts.state.controlReconstructionDigest)
      .not.toBe(forkResult.certificate.facts.state.controlReconstructionDigest);
    expect(forkResult.certificate.facts.dispositionCounts).toMatchObject({
      UPCAST: CENSUS.rows.length - 1,
      FORK: 1,
      BLOCK: 0,
    });
  });
});

describe('rollback drill preflight and certificate refusal', () => {
  it('rejects a wrong detector before creating any lane state', async () => {
    const fixture = environment();
    const invalid: RollbackDrillManifest = {
      ...fixture.options.manifest,
      fault: {
        ...fixture.options.manifest.fault,
        expectedDetector: DetectorByFaultFixture[RollbackFaultFixtures.MISSING_RECEIPT],
      },
    };

    await expect(runRollbackDrill({ ...fixture.options, manifest: invalid }))
      .rejects.toMatchObject({
        reasonCode: RollbackDrillReasonCodes.REGRESSION_CLASS_MISMATCH,
      });
    expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
  });

  it('rejects cross-mode and stale current inputs before creating lane state', async () => {
    const fixture = environment();

    await expect(runRollbackDrill({ ...fixture.options, currentMode: 'review' }))
      .rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.BINDING_DRIFT });
    await expect(runRollbackDrill({
      ...fixture.options,
      currentBindings: {
        ...fixture.options.currentBindings,
        policy: digest('drifted-current-policy'),
      },
    })).rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.BINDING_DRIFT });
    expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
  });

  it('rejects incomplete state classification before authority mutation', async () => {
    const fixture = environment();
    const rows = fixture.options.manifest.classification.rows.slice(1);
    const invalid: RollbackDrillManifest = {
      ...fixture.options.manifest,
      classification: {
        ...fixture.options.manifest.classification,
        rows,
      },
    };

    await expect(runRollbackDrill({ ...fixture.options, manifest: invalid }))
      .rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.RECONCILIATION_BLOCKED });
    expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
  });

  it.each(['BLOCK', 'UNDECLARED'] as const)(
    'rejects the %s state disposition before authority mutation',
    async (disposition) => {
      const fixture = environment();
      const rows = fixture.options.manifest.classification.rows.map((row, index) => (
        index === 0
          ? { ...row, disposition, reasonCode: 'sandbox-reconstruction-refused' }
          : row
      ));
      const invalid = {
        ...fixture.options.manifest.classification,
        rows,
      } as unknown as InflightClassificationManifest;

      await expect(runRollbackDrill(withClassification(fixture, invalid)))
        .rejects.toMatchObject({
          reasonCode: RollbackDrillReasonCodes.RECONCILIATION_BLOCKED,
        });
      expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
    },
  );

  it('rejects unknown manual-success input rather than trusting caller attestation', async () => {
    const fixture = environment();
    const invalid = {
      ...fixture.options.manifest,
      manuallyAssertedSuccess: true,
    } as unknown as RollbackDrillManifest;

    await expect(runRollbackDrill({ ...fixture.options, manifest: invalid }))
      .rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.INPUT_INVALID });
    expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
  });

  it('rejects a closed governed window before writing sandbox state', async () => {
    const clock = new SyntheticClock('2026-07-20T00:00:00.000Z');
    const fixture = environment('research', RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH, clock);
    const invalid: RollbackDrillManifest = {
      ...fixture.options.manifest,
      rollbackWindow: {
        ...fixture.options.manifest.rollbackWindow,
        openedAt: '2026-07-01T00:00:00.000Z',
      },
    };

    await expect(runRollbackDrill({ ...fixture.options, manifest: invalid }))
      .rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.WINDOW_CLOSED });
    expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
  });

  it('passes immediately before both rollback-window thresholds close', async () => {
    const clock = new SyntheticClock('2026-07-14T23:59:59.000Z');
    const fixture = environment('research', RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH, clock);
    const nearClosure: RollbackDrillManifest = {
      ...fixture.options.manifest,
      rollbackWindow: {
        ...fixture.options.manifest.rollbackWindow,
        openedAt: '2026-07-01T00:00:00.000Z',
        successfulAuthoritativeRuns: 5,
        stricterDeadlineAt: '2026-07-15T00:00:00.000Z',
      },
    };
    const result = await runRollbackDrill({ ...fixture.options, manifest: nearClosure });

    expect(result.certificate.facts.passed).toBe(true);
    expect(result.certificate.facts.timing).toMatchObject({
      insidePolicyWindow: true,
      insideStricterDeadline: true,
    });
  });

  it('rejects non-temporary and protected-path-overlapping targets', async () => {
    const fixture = environment();
    const wrongRoot = mkdtempSync(join(tmpdir(), 'rollback-unsafe-root-'));
    TEST_ROOTS.push(wrongRoot);

    await expect(runRollbackDrill({ ...fixture.options, sandboxRoot: wrongRoot }))
      .rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.ISOLATION_INVALID });
    await expect(runRollbackDrill({
      ...fixture.options,
      protectedPaths: [{ id: 'overlapping-state', path: fixture.sandboxRoot }],
    })).rejects.toMatchObject({ reasonCode: RollbackDrillReasonCodes.ISOLATION_INVALID });
    expect(readdirSync(fixture.sandboxRoot)).toEqual([]);
  });

  it('invalidates every independently drifted certificate binding', async () => {
    const fixture = environment('skill-benchmark');
    const result = await runRollbackDrill(fixture.options);

    for (const key of DRILL_INPUT_BINDING_KEYS) {
      const currentBindings: DrillInputBindings = {
        ...fixture.options.manifest.bindings,
        [key]: digest(`drifted:${key}`),
      };
      expect(await verifyPhase014RollbackEvidence({
        certificatePath: result.certificatePath,
        expectedMode: 'skill-benchmark',
        currentBindings,
        certificationProvider: CERTIFICATION_PROVIDER,
      }), key).toMatchObject({
        ok: false,
        reasonCode: RollbackDrillReasonCodes.BINDING_DRIFT,
      });
    }
  });

  it('rejects missing, wrong-mode, and tampered certificate evidence', async () => {
    const fixture = environment('model-benchmark');
    const result = await runRollbackDrill(fixture.options);
    const verify = (certificatePath: string, expectedMode = 'model-benchmark') =>
      verifyPhase014RollbackEvidence({
        certificatePath,
        expectedMode,
        currentBindings: fixture.options.manifest.bindings,
        certificationProvider: CERTIFICATION_PROVIDER,
      });

    expect(await verify(join(fixture.sandboxRoot, 'missing-certificate.json')))
      .toMatchObject({ ok: false });
    expect(await verify(result.certificatePath, 'review')).toMatchObject({
      ok: false,
      reasonCode: RollbackDrillReasonCodes.BINDING_DRIFT,
    });

    chmodSync(result.certificatePath, 0o600);
    const tampered = JSON.parse(readFileSync(result.certificatePath, 'utf8')) as {
      facts: { verifierIdentity: string };
    };
    tampered.facts.verifierIdentity = 'tampered-verifier';
    writeFileSync(result.certificatePath, JSON.stringify(tampered));
    expect(await verify(result.certificatePath)).toMatchObject({
      ok: false,
      reasonCode: RollbackDrillReasonCodes.CERTIFICATE_INVALID,
    });
  });

  it('preserves only immutable evidence after disposable lane cleanup', async () => {
    const fixture = environment('ai-council');
    const result = await runRollbackDrill(fixture.options);
    const evidenceRoot = join(fixture.sandboxRoot, 'evidence');

    expect(existsSync(join(fixture.sandboxRoot, 'capsule'))).toBe(false);
    expect(existsSync(join(fixture.sandboxRoot, 'control'))).toBe(false);
    expect(existsSync(join(fixture.sandboxRoot, 'cutover'))).toBe(false);
    expect(readdirSync(fixture.sandboxRoot)).toEqual(['evidence']);
    expect(readdirSync(evidenceRoot).sort()).toEqual([
      `${fixture.options.manifest.mode}-${result.certificate.facts.manifestDigest.slice(0, 16)}.rollback-certificate.json`,
      'drill-transcript.json',
      'preserved-ledger',
    ]);
  });
});
