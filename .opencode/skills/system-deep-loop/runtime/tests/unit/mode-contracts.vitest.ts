// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Mode Contract Conformance Tests
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  MODE_COMPATIBILITY_POLICY_VERSION,
  MODE_CONTRACT_INTERFACE_VERSION,
  MODE_CONTRACT_SHAPE,
  ModeProvidedCapabilities,
  REQUIRED_MODE_SUBSTRATE_PORTS,
  evaluateModeEventWrite,
  modeWorkstreamsFromManifest,
  resolveModeInterfaceCompatibility,
  runModeConformance,
} from '../../lib/mode-contracts/index.js';

import type {
  JsonObject,
} from '../../lib/event-envelope/index.js';
import type {
  ModeCertificate,
  ModeConformanceFixtures,
  ModeConformanceInput,
  ModeContract,
  ModeContractEntry,
  ModeConvergenceHooks,
  ModeDescriptor,
  ModeEventSchema,
  ModeInterfaceChange,
  ModeReducerFixture,
  ModeResumeEvidence,
  ModeResumeSnapshot,
} from '../../lib/mode-contracts/index.js';
import type { VerifiedLedgerEvent } from '../../lib/authorized-ledger/index.js';

const MANIFEST_URL = new URL(
  '../../../../../specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json',
  import.meta.url,
);
const manifest: unknown = JSON.parse(readFileSync(MANIFEST_URL, 'utf8'));
const modeIds = modeWorkstreamsFromManifest(manifest);

function eventTypeFor(modeId: string): string {
  return `deep-loop.mode.${modeId.replace(/^\d+-/u, '')}.recorded`;
}

function eventSchemaFor(modeId: string): ModeEventSchema {
  const eventType = eventTypeFor(modeId);
  return Object.freeze({
    eventType,
    schemaVersion: 1,
    interfaceVersion: MODE_CONTRACT_INTERFACE_VERSION,
    requiredFields: Object.freeze(['value']),
    transitionIntent: 'record-mode-state',
    reducerOwner: `${modeId}:state-reducer`,
    replayInputs: Object.freeze([{
      inputId: 'mode-configuration',
      source: 'configuration',
      digestRequired: true,
    }]),
    producer: Object.freeze({ name: modeId, version: MODE_CONTRACT_INTERFACE_VERSION }),
    definition: Object.freeze({
      eventType,
      currentVersion: 1,
      versions: Object.freeze([{
        version: 1,
        payload: Object.freeze({
          requiredFields: Object.freeze(['value']),
          validate: (payload: Readonly<JsonObject>): boolean => (
            typeof payload.value === 'number'
          ),
        }),
      }]),
      upcasters: Object.freeze([]),
    }),
    writeBoundary: Object.freeze({
      authorization: 'TransitionAuthorizationGateway',
      append: 'AppendOnlyLedger.appendAuthorized',
    }),
  });
}

function descriptorFor(modeId: string): ModeDescriptor {
  return Object.freeze({
    modeId,
    displayName: modeId,
    interfaceVersion: MODE_CONTRACT_INTERFACE_VERSION,
    interfaceShape: MODE_CONTRACT_SHAPE,
    compatibilityPolicyVersion: MODE_COMPATIBILITY_POLICY_VERSION,
    providedCapabilities: ModeProvidedCapabilities,
    requiredPorts: REQUIRED_MODE_SUBSTRATE_PORTS,
    migrationPosture: 'additive-dark',
    legacyAuthority: 'authoritative',
    ledgerAuthority: 'shadow-only',
    writeSet: Object.freeze({
      resources: Object.freeze([{
        resource: `${modeId}:projection`,
        conflictKey: `${modeId}:projection`,
        owner: Object.freeze({
          kind: 'mode-reducer',
          ownerId: `${modeId}:state-reducer`,
        }),
        mutation: 'shadow-project',
        serialization: null,
      }]),
      legacyProjection: 'required',
      ledgerPosture: 'shadow-write',
      authority: 'legacy',
    }),
    compatibilityChanges: Object.freeze([]),
    compatibilityAdapters: Object.freeze([]),
    resumeAdapters: Object.freeze([Object.freeze({
      adapterId: `${modeId}:resume-upcaster`,
      fromInterfaceVersion: '0.0.0',
      toInterfaceVersion: MODE_CONTRACT_INTERFACE_VERSION,
      deterministic: true,
      requiredChecks: Object.freeze([
        'replayFingerprint',
        'lease',
        'receipts',
        'continuityIdentity',
        'artifacts',
        'pendingEffects',
      ]),
    })]),
  });
}

function hasUnknownEvidence(evidence: ModeResumeEvidence): boolean {
  return evidence.replayFingerprint.status === 'unknown'
    || evidence.lease.status === 'unknown'
    || evidence.receipts.status === 'unknown'
    || evidence.continuityIdentity.status === 'unknown'
    || evidence.artifacts.status === 'unknown'
    || evidence.pendingEffects.status === 'unknown';
}

function convergenceHooks(): ModeConvergenceHooks {
  return Object.freeze({
    observeCoverage: (signal) => Object.freeze({
      kind: 'coverage', signal, evidenceReferences: Object.freeze([]), authority: 'observation-only',
    }),
    observeCycle: (signal) => Object.freeze({
      kind: 'cycle', signal, evidenceReferences: Object.freeze([]), authority: 'observation-only',
    }),
    observeStoppingClocks: (signal) => Object.freeze({
      kind: 'stopping-clock',
      signal,
      evidenceReferences: Object.freeze([]),
      authority: 'observation-only',
    }),
    observeValueOfComputation: (signal) => Object.freeze({
      kind: 'value-of-computation',
      signal,
      evidenceReferences: Object.freeze([]),
      authority: 'observation-only',
    }),
    observeHealth: (signal) => Object.freeze({
      kind: 'health', signal, evidenceReferences: Object.freeze([]), authority: 'observation-only',
    }),
  });
}

function createContract(modeId: string): ModeContract {
  const event = eventSchemaFor(modeId);
  const descriptor = descriptorFor(modeId);
  return Object.freeze({
    reducers: Object.freeze({
      persistedFields: Object.freeze(['value']),
      definitions: Object.freeze([{
        reducerId: `${modeId}:state-reducer`,
        reducerVersion: '1',
        stateVersion: '1',
        ownedFields: Object.freeze(['value']),
        inputEventTypes: Object.freeze([event.eventType]),
        replaySource: 'verified-ledger-events-only',
        outputRule: 'immutable',
      }]),
    }),
    artifactPolicies: Object.freeze([{
      artifactKind: `${modeId}:reference`,
      schemaVersion: 1,
      identityStrategy: 'content-digest',
      requiredInputDigests: Object.freeze(['mode-configuration']),
      sourceEventTypes: Object.freeze([event.eventType]),
      sealBoundary: 'SealedArtifactStore',
      validityScope: modeId,
      producerVersion: MODE_CONTRACT_INTERFACE_VERSION,
      invalidationConditions: Object.freeze(['source-event-superseded']),
      authorityEffect: 'none',
    }]),
    certificatePolicies: Object.freeze([{
      certificateKind: `${modeId}:shadow-parity`,
      evidenceReferencesRequired: true,
      validityScope: modeId,
      producerVersion: MODE_CONTRACT_INTERFACE_VERSION,
      invalidationConditions: Object.freeze(['evidence-invalidated']),
      migrationUse: 'shadow-parity',
      authorityEffect: 'none',
      legacyAuthority: 'unchanged',
    }]),
    describe: (): ModeDescriptor => descriptor,
    eventTypes: (): readonly ModeEventSchema[] => Object.freeze([event]),
    reduce: (_verifiedEvent, state) => Object.freeze({
      reducerId: `${modeId}:state-reducer`,
      stateVersion: '1',
      appliedEventId: 'fixture-event',
      state: Object.freeze({ ...state, value: Number(state.value ?? 0) + 1 }),
    }),
    sealArtifacts: (_state, context) => Object.freeze([Object.freeze({
      artifactId: `${modeId}:artifact`,
      artifactKind: `${modeId}:reference`,
      contentDigest: 'a'.repeat(64),
      inputDigests: Object.freeze(Object.keys(context.inputDigests)),
      sourceEventIds: Object.freeze([...context.sourceEventIds]),
      validityScope: modeId,
      producerVersion: MODE_CONTRACT_INTERFACE_VERSION,
      invalidationConditions: Object.freeze(['source-event-superseded']),
      authorityEffect: 'none',
      legacyAuthority: 'unchanged',
      sealedReference: {} as never,
    })]),
    issueCertificate: (evidence): ModeCertificate => Object.freeze({
      certificateId: `${modeId}:certificate`,
      certificateKind: `${modeId}:shadow-parity`,
      evidenceReferences: Object.freeze([...evidence.evidenceReferences]),
      validityScope: modeId,
      producerVersion: MODE_CONTRACT_INTERFACE_VERSION,
      invalidationConditions: Object.freeze(['evidence-invalidated']),
      migrationUse: 'shadow-parity',
      authorityEffect: 'none',
      legacyAuthority: 'unchanged',
    }),
    convergenceHooks,
    classifyResume: (snapshot) => {
      if (hasUnknownEvidence(snapshot.evidence)) {
        return Object.freeze({
          outcome: 'block',
          snapshotId: snapshot.snapshotId,
          evidence: snapshot.evidence,
          reasonCodes: Object.freeze(['resume-evidence-unknown']),
          failedChecks: Object.freeze(['replayFingerprint']),
        });
      }
      if (snapshot.evidence.pendingEffects.status === 'recoverable') {
        return Object.freeze({
          outcome: 'migrate',
          snapshotId: snapshot.snapshotId,
          evidence: snapshot.evidence,
          reasonCodes: Object.freeze(['pending-effects-recoverable']),
          migrationId: `${snapshot.snapshotId}:migration`,
        });
      }
      if (snapshot.sourceInterfaceVersion !== MODE_CONTRACT_INTERFACE_VERSION) {
        return Object.freeze({
          outcome: 'upcast',
          snapshotId: snapshot.snapshotId,
          evidence: snapshot.evidence,
          reasonCodes: Object.freeze(['interface-version-old']),
          adapterId: `${modeId}:resume-upcaster`,
          targetInterfaceVersion: MODE_CONTRACT_INTERFACE_VERSION,
        });
      }
      return Object.freeze({
        outcome: 'pin-legacy',
        snapshotId: snapshot.snapshotId,
        evidence: snapshot.evidence,
        reasonCodes: Object.freeze(['legacy-remains-authoritative']),
        legacyProjectionId: `${modeId}:legacy`,
      });
    },
    upcastResume: (snapshot) => Object.freeze({
      status: 'upcasted',
      adapterId: `${modeId}:resume-upcaster`,
      snapshot,
    }),
    restoreResume: () => Object.freeze({
      status: 'blocked',
      reasonCodes: Object.freeze(['fixture-does-not-restore-runtime-state']),
    }),
  });
}

function createEntries(): ModeContractEntry[] {
  return modeIds.map((modeId) => Object.freeze({ modeId, contract: createContract(modeId) }));
}

function verifiedResumeEvidence(
  pendingEffects: 'none' | 'recoverable' = 'none',
): ModeResumeEvidence {
  return Object.freeze({
    replayFingerprint: Object.freeze({ status: 'verified', verification: {} as never }),
    lease: Object.freeze({ status: 'valid', lease: {} as never }),
    receipts: Object.freeze({ status: 'verified', receipts: Object.freeze([{} as never]) }),
    continuityIdentity: Object.freeze({ status: 'verified', frontier: {} as never }),
    artifacts: Object.freeze({ status: 'verified', references: Object.freeze([{} as never]) }),
    pendingEffects: Object.freeze({
      status: pendingEffects,
      claims: pendingEffects === 'recoverable' ? Object.freeze([{} as never]) : Object.freeze([]),
    }),
  });
}

function resumeSnapshot(
  modeId: string,
  evidence: ModeResumeEvidence = verifiedResumeEvidence(),
): ModeResumeSnapshot<JsonObject> {
  return Object.freeze({
    snapshotId: `${modeId}:snapshot`,
    sourceInterfaceVersion: MODE_CONTRACT_INTERFACE_VERSION,
    state: Object.freeze({ value: 1 }),
    evidence,
  });
}

function validFixtures(entries: readonly ModeContractEntry[]): ModeConformanceFixtures {
  return Object.freeze({
    writes: Object.freeze(entries.map(({ modeId, contract }) => {
      const event = contract.eventTypes()[0];
      return Object.freeze({
        fixtureId: `${modeId}:valid-write`,
        modeId,
        attempt: Object.freeze({
          eventType: event.eventType,
          schemaVersion: event.schemaVersion,
          interfaceVersion: event.interfaceVersion,
          transitionIntent: event.transitionIntent,
          reducerOwner: event.reducerOwner,
          replayInputIds: Object.freeze(event.replayInputs.map((input) => input.inputId)),
          appendPath: 'AppendOnlyLedger.appendAuthorized',
          authorizationVerdict: 'allow',
          directMutation: false,
        }),
        expected: 'accept',
      });
    })),
    reducers: Object.freeze(entries.map(({ modeId }): ModeReducerFixture => Object.freeze({
      fixtureId: `${modeId}:deterministic-reducer`,
      modeId,
      initialState: Object.freeze({ value: 0 }),
      event: {} as VerifiedLedgerEvent,
      expected: 'accept',
    }))),
    certificates: Object.freeze(entries.map(({ modeId }) => Object.freeze({
      fixtureId: `${modeId}:evidence-certificate`,
      modeId,
      evidence: Object.freeze({
        evidenceReferences: Object.freeze([`${modeId}:evidence`]),
        inputDigests: Object.freeze(['a'.repeat(64)]),
      }),
      expected: 'accept',
    }))),
    artifacts: Object.freeze(entries.map(({ modeId }) => Object.freeze({
      fixtureId: `${modeId}:sealed-artifact`,
      modeId,
      state: Object.freeze({ value: 0 }),
      context: Object.freeze({
        sourceEventIds: Object.freeze([`${modeId}:event`]),
        inputDigests: Object.freeze({ configuration: 'a'.repeat(64) }),
      }),
      expected: 'accept',
    }))),
    hooks: Object.freeze(entries.map(({ modeId }) => Object.freeze({
      fixtureId: `${modeId}:observation-hook`,
      modeId,
      inputs: Object.freeze({
        observeCoverage: Object.freeze({}) as never,
        observeCycle: Object.freeze({}) as never,
        observeStoppingClocks: Object.freeze({}) as never,
        observeValueOfComputation: Object.freeze({}) as never,
        observeHealth: Object.freeze({}) as never,
      }),
      expected: 'accept',
    }))),
    resumes: Object.freeze(entries.map(({ modeId }) => Object.freeze({
      fixtureId: `${modeId}:legacy-pin-resume`,
      modeId,
      snapshot: resumeSnapshot(modeId),
      expectedOutcome: 'pin-legacy',
    }))),
    compatibility: Object.freeze(entries.map(({ modeId }) => Object.freeze({
      fixtureId: `${modeId}:exact-version`,
      modeId,
      readerVersion: MODE_CONTRACT_INTERFACE_VERSION,
      writerVersion: MODE_CONTRACT_INTERFACE_VERSION,
      changes: Object.freeze([]),
      adapters: Object.freeze([]),
      expectedStatus: 'compatible',
    }))),
  });
}

function inputWith(
  entries: readonly ModeContractEntry[],
  fixtures: ModeConformanceFixtures = validFixtures(entries),
): ModeConformanceInput {
  return { manifest, contracts: entries, fixtures };
}

function replaceContract(
  entries: readonly ModeContractEntry[],
  modeId: string,
  contract: ModeContract,
): ModeContractEntry[] {
  return entries.map((entry) => entry.modeId === modeId
    ? Object.freeze({ modeId, contract })
    : entry);
}

function withDescriptor(contract: ModeContract, descriptor: ModeDescriptor): ModeContract {
  return Object.freeze({ ...contract, describe: (): ModeDescriptor => descriptor });
}

describe('shared mode contract conformance', () => {
  it('derives an exact passing matrix for every manifest workstream with full port coverage', () => {
    const entries = createEntries();
    const report = runModeConformance(inputWith(entries));

    expect(report.passed).toBe(true);
    expect(report.manifestModeIds).toEqual(modeIds);
    expect(report.rows.map((row) => row.modeId)).toEqual(modeIds);
    expect(report.rows).toHaveLength(8);
    expect(report.rows.every((row) => row.status === 'pass')).toBe(true);
    expect(new Set(entries[0].contract.describe().requiredPorts)).toEqual(
      new Set(REQUIRED_MODE_SUBSTRATE_PORTS),
    );
  });

  it('rejects a missing substrate port instead of treating it as documentation drift', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const descriptor = contract.describe();
    const missingPort = withDescriptor(contract, Object.freeze({
      ...descriptor,
      requiredPorts: Object.freeze(descriptor.requiredPorts.slice(1)),
    }));
    const report = runModeConformance(inputWith(replaceContract(entries, modeId, missingPort)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'PORT_SET_MISMATCH', modeId,
    }));
  });

  it('rejects direct, unauthorized, and stale event writes while accepting the authorized path', () => {
    const contract = createContract(modeIds[0]);
    const schema = contract.eventTypes()[0];
    const valid = {
      eventType: schema.eventType,
      schemaVersion: schema.schemaVersion,
      interfaceVersion: schema.interfaceVersion,
      transitionIntent: schema.transitionIntent,
      reducerOwner: schema.reducerOwner,
      replayInputIds: schema.replayInputs.map((input) => input.inputId),
      appendPath: 'AppendOnlyLedger.appendAuthorized',
      authorizationVerdict: 'allow' as const,
      directMutation: false,
    };

    expect(evaluateModeEventWrite(contract, valid).outcome).toBe('accept');
    expect(evaluateModeEventWrite(contract, { ...valid, directMutation: true }).outcome)
      .toBe('reject');
    expect(evaluateModeEventWrite(contract, { ...valid, authorizationVerdict: 'deny' }).outcome)
      .toBe('reject');
    expect(evaluateModeEventWrite(contract, { ...valid, schemaVersion: 0 }).outcome)
      .toBe('reject');
    const forgedBoundary = Object.freeze({
      ...contract,
      eventTypes: (): readonly ModeEventSchema[] => Object.freeze([Object.freeze({
        ...schema,
        writeBoundary: Object.freeze({
          authorization: 'ModeOwnedAuthorization',
          append: 'ModeOwnedAppend',
        }),
      })]) as unknown as readonly ModeEventSchema[],
    });
    expect(evaluateModeEventWrite(forgedBoundary, valid).reasonCodes).toEqual(
      expect.arrayContaining([
        'schema-authorization-boundary-invalid',
        'schema-append-boundary-invalid',
      ]),
    );
  });

  it('rejects competing reducer ownership for one persisted field', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const conflicting = Object.freeze({
      ...contract,
      reducers: Object.freeze({
        persistedFields: contract.reducers.persistedFields,
        definitions: Object.freeze([
          ...contract.reducers.definitions,
          Object.freeze({
            reducerId: `${modeId}:competitor`,
            reducerVersion: '1',
            stateVersion: '1',
            ownedFields: Object.freeze(['value']),
            inputEventTypes: Object.freeze([eventTypeFor(modeId)]),
            replaySource: 'verified-ledger-events-only' as const,
            outputRule: 'immutable' as const,
          }),
        ]),
      }),
    });
    const report = runModeConformance(inputWith(replaceContract(entries, modeId, conflicting)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'REDUCER_OWNER_CONFLICT', modeId,
    }));
  });

  it('rejects persisted state that has no declared reducer owner', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const uncovered = Object.freeze({
      ...contract,
      reducers: Object.freeze({
        ...contract.reducers,
        persistedFields: Object.freeze(['value', 'unowned']),
      }),
    });
    const report = runModeConformance(inputWith(replaceContract(entries, modeId, uncovered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'PERSISTED_FIELD_OWNERSHIP_INCOMPLETE', modeId,
    }));
  });

  it('rejects a reducer whose hidden mutable state makes replay nondeterministic', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    let hiddenCounter = 0;
    const nondeterministic = Object.freeze({
      ...contract,
      reduce: (_event: VerifiedLedgerEvent, state: Readonly<JsonObject>) => {
        hiddenCounter += 1;
        return Object.freeze({
          reducerId: `${modeId}:state-reducer`,
          stateVersion: '1',
          appliedEventId: 'fixture-event',
          state: Object.freeze({ ...state, value: hiddenCounter }),
        });
      },
    });
    const altered = replaceContract(entries, modeId, nondeterministic);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'REDUCER_FIXTURE_MISMATCH', modeId,
    }));
  });

  it('rejects a reducer that adds an undeclared state field', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const undeclaredOutput = Object.freeze({
      ...contract,
      reduce: (_event: VerifiedLedgerEvent, state: Readonly<JsonObject>) => Object.freeze({
        reducerId: `${modeId}:state-reducer`,
        stateVersion: '1',
        appliedEventId: 'fixture-event',
        state: Object.freeze({ ...state, value: Number(state.value ?? 0) + 1, secretField: true }),
      }),
    });
    const altered = replaceContract(entries, modeId, undeclaredOutput);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'REDUCER_FIXTURE_MISMATCH', modeId,
    }));
  });

  it('rejects a reducer that changes a field owned by another reducer', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const crossOwnerWrite = Object.freeze({
      ...contract,
      reducers: Object.freeze({
        persistedFields: Object.freeze(['value', 'otherValue']),
        definitions: Object.freeze([
          contract.reducers.definitions[0],
          Object.freeze({
            reducerId: `${modeId}:other-reducer`,
            reducerVersion: '1',
            stateVersion: '1',
            ownedFields: Object.freeze(['otherValue']),
            inputEventTypes: Object.freeze([`${eventTypeFor(modeId)}.other`]),
            replaySource: 'verified-ledger-events-only' as const,
            outputRule: 'immutable' as const,
          }),
        ]),
      }),
      reduce: (_event: VerifiedLedgerEvent, state: Readonly<JsonObject>) => Object.freeze({
        reducerId: `${modeId}:state-reducer`,
        stateVersion: '1',
        appliedEventId: 'fixture-event',
        state: Object.freeze({
          ...state,
          value: Number(state.value ?? 0) + 1,
          otherValue: Number(state.otherValue ?? 0) + 1,
        }),
      }),
    });
    const altered = replaceContract(entries, modeId, crossOwnerWrite);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'REDUCER_FIXTURE_MISMATCH', modeId,
    }));
  });

  it('rejects artifact or certificate metadata that attempts an authority cutover', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      artifactPolicies: Object.freeze([Object.freeze({
        ...contract.artifactPolicies[0],
        authorityEffect: 'cutover',
      })]) as unknown as ModeContract['artifactPolicies'],
      issueCertificate: (): ModeCertificate => ({
        certificateId: 'authority-leak',
        certificateKind: 'cutover',
        evidenceReferences: ['evidence'],
        validityScope: modeId,
        producerVersion: MODE_CONTRACT_INTERFACE_VERSION,
        invalidationConditions: ['never'],
        migrationUse: 'phase-014-cutover-input',
        authorityEffect: 'cutover',
        legacyAuthority: 'replaced',
      } as unknown as ModeCertificate),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const fixtures = validFixtures(altered);
    const report = runModeConformance(inputWith(altered, Object.freeze({
      ...fixtures,
      certificates: Object.freeze([{
        fixtureId: 'certificate-authority-leak',
        modeId,
        evidence: Object.freeze({ evidenceReferences: ['evidence'], inputDigests: ['digest'] }),
        expected: 'accept',
      }]),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'ARTIFACT_POLICY_INVALID',
      'CERTIFICATE_FIXTURE_MISMATCH',
    ]));
  });

  it('rejects authority asserted by the real artifact sealing result', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      sealArtifacts: (state: Readonly<JsonObject>, context: Parameters<ModeContract['sealArtifacts']>[1]) => (
        Object.freeze(contract.sealArtifacts(state, context).map((artifact) => Object.freeze({
          ...artifact,
          authorityEffect: 'full',
        }))) as unknown as ReturnType<ModeContract['sealArtifacts']>
      ),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'ARTIFACT_FIXTURE_MISMATCH', modeId,
    }));
  });

  it('rejects mode stop policy leaking through an observation hook', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      convergenceHooks: (): ModeConvergenceHooks => Object.freeze({
        ...convergenceHooks(),
        observeCoverage: ((signal: unknown) => Object.freeze({
          kind: 'coverage',
          signal,
          evidenceReferences: Object.freeze([]),
          authority: 'observation-only',
          shouldStop: true,
          modeStopPolicy: Object.freeze({ terminationThreshold: 0.9 }),
        })) as unknown as ModeConvergenceHooks['observeCoverage'],
      }),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HOOK_FIXTURE_MISMATCH', modeId,
    }));
  });

  it('rejects a leaky hook even when its fixture labels the live violation as rejected', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      convergenceHooks: (): ModeConvergenceHooks => Object.freeze({
        ...convergenceHooks(),
        observeCoverage: ((signal: unknown) => Object.freeze({
          kind: 'coverage',
          signal,
          evidenceReferences: Object.freeze([]),
          authority: 'observation-only',
          shouldStop: true,
          modeStopPolicy: Object.freeze({ terminationThreshold: 0.9 }),
        })) as unknown as ModeConvergenceHooks['observeCoverage'],
      }),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const fixtures = validFixtures(altered);
    const report = runModeConformance(inputWith(altered, Object.freeze({
      ...fixtures,
      hooks: Object.freeze(fixtures.hooks.map((fixture) => fixture.modeId === modeId
        ? Object.freeze({ ...fixture, expected: 'reject' as const })
        : fixture)),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HOOK_AUTHORITY_INVARIANT', modeId,
    }));
  });

  it('rejects authority-bearing artifacts even when the fixture claims rejection', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      sealArtifacts: (state: Readonly<JsonObject>, context: Parameters<ModeContract['sealArtifacts']>[1]) => (
        Object.freeze(contract.sealArtifacts(state, context).map((artifact) => Object.freeze({
          ...artifact,
          authorityEffect: 'full',
        }))) as unknown as ReturnType<ModeContract['sealArtifacts']>
      ),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const fixtures = validFixtures(altered);
    const report = runModeConformance(inputWith(altered, Object.freeze({
      ...fixtures,
      artifacts: Object.freeze(fixtures.artifacts.map((fixture) => fixture.modeId === modeId
        ? Object.freeze({ ...fixture, expected: 'reject' as const })
        : fixture)),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'ARTIFACT_AUTHORITY_INVARIANT', modeId,
    }));
  });

  it('rejects cross-owner reducer output even when the fixture claims rejection', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const crossOwnerWrite = Object.freeze({
      ...contract,
      reducers: Object.freeze({
        persistedFields: Object.freeze(['value', 'otherValue']),
        definitions: Object.freeze([
          contract.reducers.definitions[0],
          Object.freeze({
            reducerId: `${modeId}:other-reducer`,
            reducerVersion: '1',
            stateVersion: '1',
            ownedFields: Object.freeze(['otherValue']),
            inputEventTypes: Object.freeze([`${eventTypeFor(modeId)}.other`]),
            replaySource: 'verified-ledger-events-only' as const,
            outputRule: 'immutable' as const,
          }),
        ]),
      }),
      reduce: (_event: VerifiedLedgerEvent, state: Readonly<JsonObject>) => Object.freeze({
        reducerId: `${modeId}:state-reducer`,
        stateVersion: '1',
        appliedEventId: 'fixture-event',
        state: Object.freeze({
          ...state,
          value: Number(state.value ?? 0) + 1,
          otherValue: Number(state.otherValue ?? 0) + 1,
        }),
      }),
    });
    const altered = replaceContract(entries, modeId, crossOwnerWrite);
    const fixtures = validFixtures(altered);
    const report = runModeConformance(inputWith(altered, Object.freeze({
      ...fixtures,
      reducers: Object.freeze(fixtures.reducers.map((fixture) => fixture.modeId === modeId
        ? Object.freeze({
          ...fixture,
          initialState: Object.freeze({ value: 0, otherValue: 0 }),
          expected: 'reject' as const,
        })
        : fixture)),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'REDUCER_OWNERSHIP_INVARIANT', modeId,
    }));
  });

  it('rejects direct writes even when the fixture claims rejection', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const fixtures = validFixtures(entries);
    const report = runModeConformance(inputWith(entries, Object.freeze({
      ...fixtures,
      writes: Object.freeze(fixtures.writes.map((fixture) => fixture.modeId === modeId
        ? Object.freeze({
          ...fixture,
          attempt: Object.freeze({ ...fixture.attempt, directMutation: true }),
          expected: 'reject' as const,
        })
        : fixture)),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'WRITE_BOUNDARY_INVARIANT', modeId,
    }));
  });

  it('rejects authority-bearing certificates even when the fixture claims rejection', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      issueCertificate: (): ModeCertificate => ({
        certificateId: 'authority-leak',
        certificateKind: 'cutover',
        evidenceReferences: ['evidence'],
        validityScope: modeId,
        producerVersion: MODE_CONTRACT_INTERFACE_VERSION,
        invalidationConditions: ['never'],
        migrationUse: 'phase-014-cutover-input',
        authorityEffect: 'cutover',
        legacyAuthority: 'replaced',
      } as unknown as ModeCertificate),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const fixtures = validFixtures(altered);
    const report = runModeConformance(inputWith(altered, Object.freeze({
      ...fixtures,
      certificates: Object.freeze(fixtures.certificates.map((fixture) => (
        fixture.modeId === modeId
          ? Object.freeze({ ...fixture, expected: 'reject' as const })
          : fixture
      ))),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'CERTIFICATE_AUTHORITY_INVARIANT', modeId,
    }));
  });

  it('rejects renamed decision fields on an otherwise observation-only hook', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      convergenceHooks: (): ModeConvergenceHooks => Object.freeze({
        ...convergenceHooks(),
        observeCoverage: ((signal: unknown) => Object.freeze({
          kind: 'coverage',
          signal,
          evidenceReferences: Object.freeze([]),
          authority: 'observation-only',
          haltRecommended: true,
          convergenceVerdict: 'stop-now',
          escalateToOperator: true,
        })) as unknown as ModeConvergenceHooks['observeCoverage'],
      }),
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'HOOK_AUTHORITY_INVARIANT', modeId,
    }));
  });

  it('rejects extra cutover fields on otherwise authority-neutral evidence outputs', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const authorityLeaking = Object.freeze({
      ...contract,
      sealArtifacts: (state: Readonly<JsonObject>, context: Parameters<ModeContract['sealArtifacts']>[1]) => (
        Object.freeze(contract.sealArtifacts(state, context).map((artifact) => Object.freeze({
          ...artifact,
          cutoverBindingToken: 'ACTIVATE-AUTHORITY-NOW',
        }))) as unknown as ReturnType<ModeContract['sealArtifacts']>
      ),
      issueCertificate: (evidence: Parameters<ModeContract['issueCertificate']>[0]) => Object.freeze({
        ...contract.issueCertificate(evidence),
        supersedesLegacyProjection: true,
      }) as unknown as ModeCertificate,
    });
    const altered = replaceContract(entries, modeId, authorityLeaking);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'ARTIFACT_AUTHORITY_INVARIANT', modeId }),
      expect.objectContaining({ code: 'CERTIFICATE_AUTHORITY_INVARIANT', modeId }),
    ]));
  });

  it('rejects reducer output attributed to an undeclared reducer', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const unknownOwner = Object.freeze({
      ...contract,
      reduce: (_event: VerifiedLedgerEvent, state: Readonly<JsonObject>) => Object.freeze({
        reducerId: `${modeId}:undeclared-reducer`,
        stateVersion: '1',
        appliedEventId: 'fixture-event',
        state: Object.freeze({ ...state, value: Number(state.value ?? 0) + 1 }),
      }),
    });
    const altered = replaceContract(entries, modeId, unknownOwner);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'REDUCER_OWNERSHIP_INVARIANT', modeId,
    }));
  });

  it('rejects a non-array artifact sealing result as an authority invariant', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const wrongShape = Object.freeze({
      ...contract,
      sealArtifacts: () => Object.freeze({
        authorityEffect: 'none',
        legacyAuthority: 'unchanged',
      }) as unknown as ReturnType<ModeContract['sealArtifacts']>,
    });
    const altered = replaceContract(entries, modeId, wrongShape);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'ARTIFACT_AUTHORITY_INVARIANT', modeId,
    }));
  });

  it('rejects a missing authorization verdict even when the fixture expects rejection', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const fixtures = validFixtures(entries);
    const report = runModeConformance(inputWith(entries, Object.freeze({
      ...fixtures,
      writes: Object.freeze(fixtures.writes.map((fixture) => fixture.modeId === modeId
        ? Object.freeze({
          ...fixture,
          attempt: Object.freeze({ ...fixture.attempt, authorizationVerdict: 'missing' as const }),
          expected: 'reject' as const,
        })
        : fixture)),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'WRITE_BOUNDARY_INVARIANT', modeId,
    }));
    expect(report.issues).not.toContainEqual(expect.objectContaining({
      code: 'WRITE_FIXTURE_MISMATCH', modeId,
    }));
  });

  it('accepts declared-only hook, evidence, reducer, and write outputs', () => {
    const entries = createEntries();
    const report = runModeConformance(inputWith(entries, validFixtures(entries)));

    expect(report.passed).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it('accepts a legitimate malformed-input fixture when the contract rejects it', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const fixtures = validFixtures(entries);
    const report = runModeConformance(inputWith(entries, Object.freeze({
      ...fixtures,
      artifacts: Object.freeze(fixtures.artifacts.map((fixture) => fixture.modeId === modeId
        ? Object.freeze({
          ...fixture,
          context: Object.freeze({ inputDigests: Object.freeze({}) }) as never,
          expected: 'reject' as const,
        })
        : fixture)),
    })));

    expect(report.passed).toBe(true);
  });

  it('fails an unclassifiable resume closed and accepts an explicit partial-resume migration', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const unknownEvidence = Object.freeze({
      ...verifiedResumeEvidence(),
      replayFingerprint: Object.freeze({ status: 'unknown' as const, verification: null }),
    });
    const fixtures = validFixtures(entries);
    const otherModeResumes = fixtures.resumes.filter((fixture) => fixture.modeId !== modeId);
    const report = runModeConformance(inputWith(entries, Object.freeze({
      ...fixtures,
      resumes: Object.freeze([
        Object.freeze({
          fixtureId: 'resume-fail-closed',
          modeId,
          snapshot: resumeSnapshot(modeId, unknownEvidence),
          expectedOutcome: 'block',
        }),
        Object.freeze({
          fixtureId: 'partial-resume-migrate',
          modeId,
          snapshot: resumeSnapshot(modeId, verifiedResumeEvidence('recoverable')),
          expectedOutcome: 'migrate',
        }),
        ...otherModeResumes,
      ]),
    })));

    expect(report.passed).toBe(true);
  });

  it('rejects a resume adapter that guesses through unknown evidence', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const guessing = Object.freeze({
      ...contract,
      classifyResume: (snapshot: ModeResumeSnapshot<JsonObject>) => Object.freeze({
        outcome: 'migrate' as const,
        snapshotId: snapshot.snapshotId,
        evidence: snapshot.evidence,
        reasonCodes: Object.freeze(['best-effort']),
        migrationId: 'guessed-migration',
      }),
    });
    const altered = replaceContract(entries, modeId, guessing);
    const fixtures = validFixtures(altered);
    const unknownEvidence = Object.freeze({
      ...verifiedResumeEvidence(),
      continuityIdentity: Object.freeze({ status: 'unknown' as const, frontier: null }),
    });
    const report = runModeConformance(inputWith(altered, Object.freeze({
      ...fixtures,
      resumes: Object.freeze([{
        fixtureId: 'resume-guess-rejected',
        modeId,
        snapshot: resumeSnapshot(modeId, unknownEvidence),
        expectedOutcome: 'block',
      }]),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'RESUME_FIXTURE_MISMATCH', fixtureId: 'resume-guess-rejected',
    }));
  });

  it('rejects missing resume evidence that still carries artifact references', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const fixtures = validFixtures(entries);
    const incoherentEvidence = Object.freeze({
      ...verifiedResumeEvidence(),
      artifacts: Object.freeze({
        status: 'missing' as const,
        references: Object.freeze([{} as never]),
      }),
    });
    const report = runModeConformance(inputWith(entries, Object.freeze({
      ...fixtures,
      resumes: Object.freeze([
        Object.freeze({
          fixtureId: 'resume-missing-with-reference',
          modeId,
          snapshot: resumeSnapshot(modeId, incoherentEvidence),
          expectedOutcome: 'block',
        }),
        ...fixtures.resumes.filter((fixture) => fixture.modeId !== modeId),
      ]),
    })));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'RESUME_FIXTURE_MISMATCH', fixtureId: 'resume-missing-with-reference',
    }));
  });

  it('distinguishes additive, deprecated, semantic, and breaking version changes', () => {
    const additive: ModeInterfaceChange = Object.freeze({
      changeId: 'add-field',
      kind: 'additive',
      fromVersion: '1.0.0',
      toVersion: '1.1.0',
      safeDefaults: Object.freeze({ newField: null }),
      deprecatedFields: Object.freeze([]),
    });
    const deprecated: ModeInterfaceChange = Object.freeze({
      ...additive,
      changeId: 'deprecate-field',
      kind: 'deprecated',
      toVersion: '1.2.0',
      deprecatedFields: Object.freeze(['oldField']),
    });
    const semantic: ModeInterfaceChange = Object.freeze({
      ...additive,
      changeId: 'semantic-change',
      kind: 'semantic',
      toVersion: '2.0.0',
      safeDefaults: Object.freeze({}),
    });
    const breaking: ModeInterfaceChange = Object.freeze({
      ...semantic,
      changeId: 'breaking-change',
      kind: 'breaking',
      toVersion: '3.0.0',
    });

    expect(resolveModeInterfaceCompatibility({
      readerVersion: '1.0.0', writerVersion: '1.1.0', changes: [additive], adapters: [],
    })).toMatchObject({ status: 'compatible', strategy: 'native-additive' });
    expect(resolveModeInterfaceCompatibility({
      readerVersion: '1.0.0', writerVersion: '1.2.0', changes: [deprecated], adapters: [],
    })).toMatchObject({ status: 'compatible', strategy: 'native-deprecated' });
    expect(resolveModeInterfaceCompatibility({
      readerVersion: '1.0.0',
      writerVersion: '2.0.0',
      changes: [semantic],
      adapters: [{
        adapterId: 'semantic-adapter',
        fromVersion: '2.0.0',
        toVersion: '1.0.0',
        deterministic: true,
      }],
    })).toMatchObject({ status: 'adapter-required', adapterId: 'semantic-adapter' });
    expect(resolveModeInterfaceCompatibility({
      readerVersion: '1.0.0', writerVersion: '3.0.0', changes: [breaking], adapters: [],
    })).toMatchObject({ status: 'refused', changeKind: 'breaking' });
  });

  it('refuses an undeclared mixed-version pair instead of best-effort reading it', () => {
    expect(resolveModeInterfaceCompatibility({
      readerVersion: '1.0.0',
      writerVersion: '9.0.0',
      changes: [],
      adapters: [],
    })).toEqual(expect.objectContaining({ status: 'refused', changeKind: 'unknown' }));
  });

  it('rejects conflicting compatibility classifications for one version pair', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const additive = Object.freeze({
      changeId: 'additive-declaration',
      kind: 'additive' as const,
      fromVersion: '1.0.0' as const,
      toVersion: '1.1.0' as const,
      safeDefaults: Object.freeze({ field: null }),
      deprecatedFields: Object.freeze([]),
    });
    const contradictory = withDescriptor(contract, Object.freeze({
      ...contract.describe(),
      compatibilityChanges: Object.freeze([
        additive,
        Object.freeze({ ...additive, changeId: 'breaking-declaration', kind: 'breaking' as const }),
      ]),
    }));
    const altered = replaceContract(entries, modeId, contradictory);
    const report = runModeConformance(inputWith(altered, validFixtures(altered)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: 'COMPATIBILITY_CHANGE_CONFLICT', modeId,
    }));
  });

  it('rejects a local contract-shape fork even when the mode keeps the version string', () => {
    const entries = createEntries();
    const modeId = modeIds[0];
    const contract = entries[0].contract;
    const forked = withDescriptor(contract, Object.freeze({
      ...contract.describe(),
      interfaceShape: 'local.mode-contract@1.0.0',
    }) as unknown as ModeDescriptor);
    const report = runModeConformance(inputWith(replaceContract(entries, modeId, forked)));

    expect(report.passed).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'INTERFACE_FORK', modeId }));
  });

  it('rejects missing and extra contracts instead of inventing a second mode list', () => {
    const entries = createEntries();
    const missingReport = runModeConformance(inputWith(entries.slice(1), validFixtures(entries.slice(1))));
    const extra = Object.freeze({ modeId: '009-not-in-manifest', contract: createContract('009-not-in-manifest') });
    const extraEntries = Object.freeze([...entries, extra]);
    const extraReport = runModeConformance(inputWith(extraEntries, validFixtures(extraEntries)));

    expect(missingReport.issues).toContainEqual(expect.objectContaining({
      code: 'MODE_MISSING', modeId: modeIds[0],
    }));
    expect(extraReport.issues).toContainEqual(expect.objectContaining({
      code: 'MODE_UNEXPECTED', modeId: '009-not-in-manifest',
    }));
  });

  it('rejects cross-mode write conflicts without one explicit serialization rule', () => {
    const entries = createEntries();
    const conflicted = entries.map((entry, index) => {
      if (index > 1) return entry;
      const descriptor = entry.contract.describe();
      return Object.freeze({
        modeId: entry.modeId,
        contract: withDescriptor(entry.contract, Object.freeze({
          ...descriptor,
          writeSet: Object.freeze({
            ...descriptor.writeSet,
            resources: Object.freeze([Object.freeze({
              ...descriptor.writeSet.resources[0],
              conflictKey: 'shared:unsafe-projection',
              serialization: null,
            })]),
          }),
        })),
      });
    });
    const report = runModeConformance(inputWith(conflicted, validFixtures(conflicted)));

    expect(report.passed).toBe(false);
    expect(report.issues.filter((issue) => issue.code === 'WRITE_SET_CONFLICT')).toHaveLength(2);
  });
});
