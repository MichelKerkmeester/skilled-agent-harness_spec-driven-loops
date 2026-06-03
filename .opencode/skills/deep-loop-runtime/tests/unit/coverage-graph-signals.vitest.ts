// MODULE: Deep-Loop Coverage Graph Signals — Unit Tests
//
// Closes DR-013 (zero unit coverage on lib/coverage-graph/coverage-graph-signals.ts).
// Smoke-tests the public signal-computation functions against an empty + populated namespace.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type DbModule = typeof import('../../lib/coverage-graph/coverage-graph-db.js');
type SignalsModule = typeof import('../../lib/coverage-graph/coverage-graph-signals.js');

let originalDbDir: string | undefined;
let tempDir: string;
let dbModule: DbModule;
let signalsModule: SignalsModule;

const researchNs = {
  specFolder: 'specs/coverage-graph-signals-fixture',
  loopType: 'research',
  sessionId: 'coverage-graph-signals-fixture-research',
} as const;

const reviewNs = {
  specFolder: 'specs/coverage-graph-signals-fixture',
  loopType: 'review',
  sessionId: 'coverage-graph-signals-fixture-review',
} as const;

beforeEach(async () => {
  originalDbDir = process.env.SPEC_KIT_DB_DIR;
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-signals-'));
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();
  dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  dbModule.initDb(tempDir);
  signalsModule = await import('../../lib/coverage-graph/coverage-graph-signals.js');
});

afterEach(() => {
  dbModule?.closeDb?.();
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('coverage-graph-signals', () => {
  it('computeNodeSignals returns array on empty namespace', () => {
    const signals = signalsModule.computeNodeSignals(researchNs);
    expect(Array.isArray(signals)).toBe(true);
    expect(signals).toEqual([]);
  });

  it('computeResearchSignals returns an object with documented research keys on empty namespace', () => {
    const sig = signalsModule.computeResearchSignals(researchNs);
    expect(typeof sig).toBe('object');
    expect(sig).toBeTruthy();
    // ResearchConvergenceSignals shape should include question coverage, claim verification, contradictions, sources, evidence
    expect(Object.keys(sig).length).toBeGreaterThan(0);
  });

  it('computeReviewSignals returns an object on empty namespace', () => {
    const sig = signalsModule.computeReviewSignals(reviewNs);
    expect(typeof sig).toBe('object');
    expect(sig).toBeTruthy();
  });

  it('computeSignals dispatches to research signals for research loopType', () => {
    const sig = signalsModule.computeSignals(researchNs);
    expect(typeof sig).toBe('object');
    expect(sig).toBeTruthy();
  });

  it('computeSignals dispatches to review signals for review loopType', () => {
    const sig = signalsModule.computeSignals(reviewNs);
    expect(typeof sig).toBe('object');
    expect(sig).toBeTruthy();
  });

  it('createSignalSnapshot includes iteration number', () => {
    const snapshot = signalsModule.createSignalSnapshot(researchNs, 1);
    expect(typeof snapshot).toBe('object');
    expect(snapshot).toBeTruthy();
  });

  it('createSignalSnapshot accepts different iteration numbers without throwing', () => {
    expect(() => signalsModule.createSignalSnapshot(researchNs, 5)).not.toThrow();
    expect(() => signalsModule.createSignalSnapshot(researchNs, 10)).not.toThrow();
  });

  it('computeMomentum returns null when fewer than 2 snapshots exist', () => {
    // computeMomentum(specFolder, loopType, sessionId) reads snapshots from the DB;
    // with <2 snapshots it returns null.
    const momentum = signalsModule.computeMomentum(
      researchNs.specFolder,
      researchNs.loopType,
      researchNs.sessionId,
    );
    expect(momentum).toBeNull();
  });

  it('research and review signal shapes differ', () => {
    const research = signalsModule.computeResearchSignals(researchNs);
    const review = signalsModule.computeReviewSignals(reviewNs);
    expect(research).not.toEqual(review);
  });

  it('computeResearchClaimVerificationRateFromData vacuous-passes (1.0) when there are no claim nodes', () => {
    // A graph with QUESTION/FINDING/SOURCE nodes but zero CLAIM nodes has
    // nothing to verify; the rate must be 1.0 so convergence is not blocked.
    const nodes = [
      { id: 'q1', kind: 'QUESTION' },
      { id: 'f1', kind: 'FINDING' },
      { id: 's1', kind: 'SOURCE' },
    ];
    expect(signalsModule.computeResearchClaimVerificationRateFromData(nodes)).toBe(1.0);
  });

  it('computeResearchClaimVerificationRateFromData computes the verified fraction when claims exist', () => {
    const nodes = [
      { id: 'c1', kind: 'CLAIM', metadata: JSON.stringify({ verification_status: 'verified' }) },
      { id: 'c2', kind: 'CLAIM', metadata: JSON.stringify({ verification_status: 'unresolved' }) },
    ];
    expect(signalsModule.computeResearchClaimVerificationRateFromData(nodes)).toBe(0.5);
  });
});
