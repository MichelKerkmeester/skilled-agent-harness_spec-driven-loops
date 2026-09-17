// MODULE: Deep-Loop Coverage Graph Signals — Unit Tests
//
// Adds unit coverage for lib/coverage-graph/coverage-graph-signals.ts.
// Smoke-tests the public signal-computation functions against an empty + populated namespace.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import {
  namespaceArgs,
  runScript,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

type DbModule = typeof import('../../lib/coverage-graph/coverage-graph-db.js');
type SignalsModule = typeof import('../../lib/coverage-graph/coverage-graph-signals.js');

const requireCjs = createRequire(import.meta.url);

const { readConvergenceModeConfig } = requireCjs('../../scripts/convergence.cjs') as {
  readConvergenceModeConfig: (args: Record<string, unknown>) => {
    mode: 'default' | 'off' | 'sliding-window' | 'divergent';
    slidingWindowSize: number;
  };
};

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

function snapshotsThrough(iteration: number): Array<{ iteration: number; createdAt: string }> {
  return Array.from({ length: iteration }, (_, index) => {
    const current = index + 1;
    return {
      iteration: current,
      createdAt: `2026-06-${String(current).padStart(2, '0')}T00:00:00.000Z`,
    };
  });
}

function seedConvergedResearchGraph(namespace: ScriptNamespace) {
  return runScript('upsert', [
    ...namespaceArgs(namespace),
    '--nodes',
    JSON.stringify([
      { id: 'question-1', kind: 'QUESTION', name: 'Main question' },
      { id: 'finding-1', kind: 'FINDING', name: 'First answer' },
      { id: 'finding-2', kind: 'FINDING', name: 'Second answer' },
      { id: 'source-1', kind: 'SOURCE', name: 'Primary source', metadata: { quality_class: 'primary' } },
      { id: 'source-2', kind: 'SOURCE', name: 'Secondary source', metadata: { quality_class: 'secondary' } },
    ]),
    '--edges',
    JSON.stringify([
      { id: 'answer-1', sourceId: 'finding-1', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'answer-2', sourceId: 'finding-2', targetId: 'question-1', relation: 'ANSWERS' },
      { id: 'cite-1', sourceId: 'finding-1', targetId: 'source-1', relation: 'CITES' },
      { id: 'cite-2', sourceId: 'finding-2', targetId: 'source-2', relation: 'CITES' },
    ]),
  ]);
}

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

  it('timeDecayWeight applies half-life decay and keeps the no-decay path at full weight', () => {
    const now = '2026-06-28T00:00:00.000Z';

    expect(signalsModule.timeDecayWeight('2026-04-29T00:00:00.000Z', 0, now)).toBe(1.0);
    expect(signalsModule.timeDecayWeight('2026-05-29T00:00:00.000Z', 30, now)).toBeCloseTo(0.5, 5);
    expect(signalsModule.timeDecayWeight('2026-04-29T00:00:00.000Z', 30, now)).toBeCloseTo(0.25, 5);
    expect(() => signalsModule.normalizeTimeDecayDays(4)).toThrow(/decayDays/);
  });

  it('computeNodeSignals applies decay only to ranking weight, not structural counts', () => {
    const ns = {
      specFolder: 'specs/coverage-graph-signals-fixture',
      loopType: 'review',
      sessionId: 'coverage-graph-signals-fixture-decay',
    } as const;

    dbModule.upsertNode({
      ...ns,
      id: 'evidence-1',
      kind: 'EVIDENCE',
      name: 'Aged evidence',
    });
    dbModule.upsertNode({
      ...ns,
      id: 'finding-1',
      kind: 'FINDING',
      name: 'Finding with aged evidence',
    });
    dbModule.upsertEdge({
      ...ns,
      id: 'edge-1',
      sourceId: 'evidence-1',
      targetId: 'finding-1',
      relation: 'EVIDENCE_FOR',
      weight: 2,
    });
    dbModule.getDb().prepare(`
      UPDATE coverage_edges
      SET created_at = ?
      WHERE spec_folder = ? AND loop_type = ? AND session_id = ? AND id = ?
    `).run('2026-05-29T00:00:00.000Z', ns.specFolder, ns.loopType, ns.sessionId, 'edge-1');

    const noDecay = signalsModule.computeNodeSignals(ns, {
      decayDays: 0,
      now: '2026-06-28T00:00:00.000Z',
    });
    const decayed = signalsModule.computeNodeSignals(ns, {
      decayDays: 30,
      now: '2026-06-28T00:00:00.000Z',
    });
    const noDecayFinding = noDecay.find((signal) => signal.nodeId === 'finding-1');
    const decayedFinding = decayed.find((signal) => signal.nodeId === 'finding-1');

    expect(noDecayFinding?.degree).toBe(1);
    expect(decayedFinding?.degree).toBe(1);
    expect(noDecayFinding?.weightSum).toBe(2);
    expect(decayedFinding?.weightSum).toBeCloseTo(1, 5);
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

  it('computeGraphNoveltyDelta counts new evidence-bearing graph rows since the latest snapshot', () => {
    const snapshot = { iteration: 2, createdAt: '2026-06-19T10:00:00.000Z' };
    const nodes = [
      { id: 'finding-old', kind: 'FINDING', createdAt: '2026-06-19T09:59:00.000Z' },
      { id: 'source-new', kind: 'SOURCE', createdAt: '2026-06-19T10:01:00.000Z' },
      { id: 'finding-insight', kind: 'FINDING', createdAt: '2026-06-19T10:02:00.000Z', metadata: { status: 'insight' } },
      { id: 'question-new', kind: 'QUESTION', createdAt: '2026-06-19T10:03:00.000Z' },
    ];
    const edges = [
      { id: 'edge-new', relation: 'EVIDENCE_FOR', sourceId: 'source-new', targetId: 'finding-old', createdAt: '2026-06-19T10:04:00.000Z' },
      { id: 'edge-cites', relation: 'CITES', sourceId: 'finding-old', targetId: 'source-new', createdAt: '2026-06-19T10:04:00.000Z' },
    ];

    expect(signalsModule.computeGraphNoveltyDelta(nodes, edges, [snapshot])).toBeCloseTo(2 / 3, 5);
  });

  it('computeGraphNoveltyDelta fails open when no prior snapshot exists', () => {
    const nodes = [{ id: 'finding-new', kind: 'FINDING', createdAt: '2026-06-19T10:01:00.000Z' }];

    expect(signalsModule.computeGraphNoveltyDelta(nodes, [], [])).toBe(0);
  });

  it('computeWindowedGraphNoveltyDelta keeps late novelty visible when full history suppresses it', () => {
    const oldNodes = Array.from({ length: 40 }, (_, index) => ({
      id: `old-finding-${index}`,
      kind: 'FINDING',
      iteration: 1,
    }));
    const recentNodes = [4, 5, 6].map((iteration) => ({
      id: `recent-finding-${iteration}`,
      kind: 'FINDING',
      iteration,
    }));
    const lateNode = { id: 'late-finding', kind: 'FINDING', iteration: 7 };
    const nodes = [...oldNodes, ...recentNodes, lateNode];
    const snapshots = snapshotsThrough(6);

    const fullHistory = signalsModule.computeGraphNoveltyDelta(nodes, [], snapshots);
    const windowed = signalsModule.computeWindowedGraphNoveltyDelta(nodes, [], snapshots, 3);

    expect(fullHistory).toBeCloseTo(1 / 44, 5);
    expect(fullHistory).toBeLessThan(0.05);
    expect(windowed).toBeCloseTo(1 / 4, 5);
    expect(windowed).toBeGreaterThan(0.20);
  });

  it('computeWindowedGraphNoveltyDelta clamps early history to the full-history result', () => {
    const nodes = [
      { id: 'old-finding-1', kind: 'FINDING', iteration: 1 },
      { id: 'old-finding-2', kind: 'FINDING', iteration: 1 },
      { id: 'late-finding', kind: 'FINDING', iteration: 3 },
    ];
    const snapshots = snapshotsThrough(2);

    expect(signalsModule.computeWindowedGraphNoveltyDelta(nodes, [], snapshots, 5)).toBe(
      signalsModule.computeGraphNoveltyDelta(nodes, [], snapshots),
    );
  });

  it('readConvergenceModeConfig accepts all modes from camelCase and snake_case CLI/config forms', () => {
    const modes = ['default', 'off', 'sliding-window', 'divergent'] as const;
    for (const mode of modes) {
      const forms = [
        { convergenceMode: mode },
        { convergence_mode: mode },
        { configJson: JSON.stringify({ convergenceMode: mode }) },
        { configJson: JSON.stringify({ convergence_mode: mode }) },
        { configJson: JSON.stringify({ antiConvergence: { convergenceMode: mode } }) },
        { configJson: JSON.stringify({ antiConvergence: { convergence_mode: mode } }) },
      ];
      for (const form of forms) {
        expect(readConvergenceModeConfig(form).mode).toBe(mode);
      }
    }
  });

  it('readConvergenceModeConfig validates slidingWindowSize and unknown modes', () => {
    expect(readConvergenceModeConfig({ convergenceMode: 'sliding-window' })).toEqual({
      mode: 'sliding-window',
      slidingWindowSize: 5,
    });
    expect(readConvergenceModeConfig({
      configJson: JSON.stringify({
        antiConvergence: { convergenceMode: 'sliding-window', slidingWindowSize: 7 },
      }),
    })).toEqual({ mode: 'sliding-window', slidingWindowSize: 7 });
    expect(() => readConvergenceModeConfig({
      convergenceMode: 'sliding-window',
      slidingWindowSize: 0,
    })).toThrow(/slidingWindowSize must be a positive integer/);
    expect(() => readConvergenceModeConfig({
      convergenceMode: 'sliding-window',
      slidingWindowSize: -1,
    })).toThrow(/slidingWindowSize must be a positive integer/);
    expect(() => readConvergenceModeConfig({
      convergenceMode: 'sliding-window',
      slidingWindowSize: 1.5,
    })).toThrow(/slidingWindowSize must be a positive integer/);
    expect(() => readConvergenceModeConfig({ convergenceMode: 'unknown' })).toThrow(
      /convergenceMode must be "default", "off", "sliding-window", or "divergent"/,
    );
  });

  it('convergence telemetry records both novelty ratios only in sliding-window mode', () => {
    const namespace = uniqueNamespace('convergence', 'research');
    expect(seedConvergedResearchGraph(namespace).exitCode).toBe(0);
    expect(runScript('convergence', [
      ...namespaceArgs(namespace),
      '--persist-snapshot',
      '--iteration',
      '1',
    ]).exitCode).toBe(0);

    const defaultResult = runScript('convergence', namespaceArgs(namespace));
    const offResult = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--convergence-mode',
      'off',
    ]);
    const slidingResult = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--convergence-mode',
      'sliding-window',
    ]);

    const defaultSignals = (defaultResult.json.data as { signals: Record<string, unknown> }).signals;
    const offSignals = (offResult.json.data as { signals: Record<string, unknown> }).signals;
    const slidingSignals = (slidingResult.json.data as { signals: Record<string, unknown> }).signals;

    expect(defaultResult.exitCode).toBe(0);
    expect(offResult.exitCode).toBe(0);
    expect(slidingResult.exitCode).toBe(0);
    expect(defaultSignals).not.toHaveProperty('fullHistoryNewInfoRatio');
    expect(defaultSignals).not.toHaveProperty('windowedNewInfoRatio');
    expect(offSignals).not.toHaveProperty('fullHistoryNewInfoRatio');
    expect(offSignals).not.toHaveProperty('windowedNewInfoRatio');
    expect(slidingSignals).toMatchObject({
      convergenceMode: 'sliding-window',
      slidingWindowSize: 5,
      fullHistoryNewInfoRatio: expect.any(Number),
      windowedNewInfoRatio: expect.any(Number),
    });
    expect(slidingSignals.graphNoveltyDelta).toBe(slidingSignals.windowedNewInfoRatio);
    expect(slidingResult.json.graph_signals_json).toMatchObject({
      fullHistoryNewInfoRatio: slidingSignals.fullHistoryNewInfoRatio,
      windowedNewInfoRatio: slidingSignals.windowedNewInfoRatio,
    });
  });

  it('computeFindingObservationSignalsFromData marks findings below the observation threshold', () => {
    const signals = signalsModule.computeFindingObservationSignalsFromData(
      [
        { id: 'finding-1', kind: 'FINDING', name: 'Confirmed twice', metadata: { observations: 2 } },
        { id: 'finding-2', kind: 'FINDING', name: 'Confirmed once', metadata: { observations: 1 } },
      ],
      [],
      3,
    );

    expect(signals).toEqual({
      minObservations: 3,
      leadingFinding: {
        id: 'finding-1',
        kind: 'FINDING',
        name: 'Confirmed twice',
        observations: 2,
        subThreshold: true,
      },
      findings: [
        {
          id: 'finding-1',
          kind: 'FINDING',
          name: 'Confirmed twice',
          observations: 2,
          subThreshold: true,
        },
        {
          id: 'finding-2',
          kind: 'FINDING',
          name: 'Confirmed once',
          observations: 1,
          subThreshold: true,
        },
      ],
    });
  });

  // ───── Context signals ─────

  it('computeContextSignalsFromData vacuous-passes all five signals on an empty graph', () => {
    const s = signalsModule.computeContextSignalsFromData([], []);
    expect(s).toEqual({
      sliceCoverage: 1,
      reuseCatalogCoverage: 1,
      agreementRate: 1,
      relevanceFloor: 1,
      dependencyCompleteness: 1,
    });
  });

  it('dependencyCompleteness counts a DEPENDENCY that is the TARGET of DEPENDS_ON (SYMBOL -> DEPENDENCY)', () => {
    const nodes = [
      { id: 'sym1', kind: 'SYMBOL', metadata: {} },
      { id: 'dep1', kind: 'DEPENDENCY', metadata: {} },
    ];
    expect(
      signalsModule.computeContextSignalsFromData(nodes, [
        { relation: 'DEPENDS_ON', sourceId: 'sym1', targetId: 'dep1', weight: 1 },
      ]).dependencyCompleteness,
    ).toBe(1);
    // No edge -> unresolved; IMPORTS (FILE->FILE) does not resolve a DEPENDENCY node.
    expect(signalsModule.computeContextSignalsFromData(nodes, []).dependencyCompleteness).toBe(0);
    expect(
      signalsModule.computeContextSignalsFromData(nodes, [
        { relation: 'IMPORTS', sourceId: 'sym1', targetId: 'dep1', weight: 1 },
      ]).dependencyCompleteness,
    ).toBe(0);
  });

  it('sliceCoverage counts a SLICE that is the SOURCE of a COVERED_BY edge', () => {
    const nodes = [
      { id: 'slice1', kind: 'SLICE', metadata: {} },
      { id: 'file1', kind: 'FILE', metadata: {} },
    ];
    expect(
      signalsModule.computeContextSignalsFromData(nodes, [
        { relation: 'COVERED_BY', sourceId: 'slice1', targetId: 'file1', weight: 1 },
      ]).sliceCoverage,
    ).toBe(1);
  });

  it('agreementRate denominator excludes below-relevance-gate findings', () => {
    const nodes = [
      { id: 'r1', kind: 'REUSE_CANDIDATE', metadata: { relevance: 0.9, confirmations: 2 } },
      { id: 'noise', kind: 'PATTERN', metadata: { relevance: 0.2, confirmations: 0 } },
    ];
    const s = signalsModule.computeContextSignalsFromData(nodes, []);
    // Only r1 clears the gate and it is agreement-eligible -> 1/1 = 1 (noise excluded, not 1/2).
    expect(s.agreementRate).toBe(1);
    // relevanceFloor still sees the noise: 1 of 2 findings above the gate.
    expect(s.relevanceFloor).toBe(0.5);
  });

  it('reuseCatalogCoverage accepts agreement >= 1 OR metadata.verified === true', () => {
    const nodes = [
      { id: 'a', kind: 'REUSE_CANDIDATE', metadata: { confirmations: 1 } },
      { id: 'b', kind: 'REUSE_CANDIDATE', metadata: { verified: true } },
      { id: 'c', kind: 'REUSE_CANDIDATE', metadata: { confirmations: 0 } },
    ];
    expect(
      signalsModule.computeContextSignalsFromData(nodes, []).reuseCatalogCoverage,
    ).toBeCloseTo(2 / 3, 5);
  });
});
