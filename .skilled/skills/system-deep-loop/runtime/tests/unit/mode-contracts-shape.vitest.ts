// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Contracts Shape Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  MODE_CONTRACT_INTERFACE_VERSION,
  MODE_CONTRACT_SHAPE,
  ModeConvergenceHookSet,
  ModeProvidedCapabilities,
} from '../../lib/mode-contracts/index.js';
import {
  ModeSubstratePortSet,
  REQUIRED_MODE_SUBSTRATE_PORTS,
} from '../../lib/mode-contracts/substrate-ports.js';

// Every mode imports these sets, so a silent member change would spread to all of them.
const EXPECTED_PORTS = [
  'eventEnvelope',
  'authorizedLedger',
  'replayFingerprint',
  'receiptsAndEffectRecovery',
  'sealedReferenceArtifacts',
  'blindedAdjudication',
  'hierarchicalBudgets',
  'streamFoldGauges',
  'locksAndFencing',
  'continuityIdentity',
  'dispatchReceipts',
  'resultEnvelopes',
  'branchLeasesAndWaves',
  'conditionalFanIn',
  'partialFailurePolicy',
  'provenanceReduction',
  'pathCoverageTermination',
  'cycleDetection',
  'stoppingClocks',
  'valueOfComputation',
  'healthDegeneration',
];

describe('mode-contracts frozen constant sets', () => {
  it('pins the contract version and shape identifiers', () => {
    expect(MODE_CONTRACT_INTERFACE_VERSION).toBe('1.0.0');
    expect(MODE_CONTRACT_SHAPE).toBe('deep-loop.mode-contract@1.0.0');
  });

  it('pins the provided capability list in order', () => {
    expect(ModeProvidedCapabilities).toEqual([
      'describe',
      'eventTypes',
      'reduce',
      'sealArtifacts',
      'issueCertificate',
      'convergenceHooks',
      'classifyResume',
      'upcastResume',
      'restoreResume',
    ]);
  });

  it('pins the convergence hook set', () => {
    expect(ModeConvergenceHookSet).toEqual({
      observeCoverage: true,
      observeCycle: true,
      observeStoppingClocks: true,
      observeValueOfComputation: true,
      observeHealth: true,
    });
  });

  it('pins the substrate port set and derives the required list from it', () => {
    expect(Object.keys(ModeSubstratePortSet)).toEqual(EXPECTED_PORTS);
    expect(Object.values(ModeSubstratePortSet).every((value) => value === true)).toBe(true);
    expect(REQUIRED_MODE_SUBSTRATE_PORTS).toEqual(EXPECTED_PORTS);
  });

  it('freezes every set so a consumer cannot widen it at runtime', () => {
    for (const frozen of [
      ModeProvidedCapabilities,
      ModeConvergenceHookSet,
      ModeSubstratePortSet,
      REQUIRED_MODE_SUBSTRATE_PORTS,
    ]) {
      expect(Object.isFrozen(frozen)).toBe(true);
    }
    expect(() => {
      (ModeSubstratePortSet as Record<string, boolean>).extraPort = true;
    }).toThrow(TypeError);
    expect(() => {
      (REQUIRED_MODE_SUBSTRATE_PORTS as string[]).push('extraPort');
    }).toThrow(TypeError);
  });
});
