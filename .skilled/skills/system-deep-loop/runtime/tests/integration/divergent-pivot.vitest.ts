// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot Integration Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildPivotCouncilPaths,
  derivePivotId,
  evaluatePivotAgreement,
  finalizePivotTransaction,
  preparePivotTransaction,
  recordPivotSeatResult,
  runDivergentPivot,
} from '../../lib/deep-loop/divergent-pivot.js';
import { buildReviewPivotPreparationInput } from '../../../deep-review/scripts/divergent-review-pivot';
import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs.js';

import type {
  PivotIdentityInput,
  PivotSeatMandate,
  PivotSeatReport,
  RunDivergentPivotOptions,
} from '../../lib/deep-loop/divergent-pivot.js';
import type { PivotCandidate } from '../../lib/deep-loop/pivot-candidates.js';

const requireCjs = createRequire(import.meta.url);
const { reduceReviewState } = requireCjs('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options: { write?: boolean; artifactDir?: string },
  ) => {
    registryPath: string;
    registry: { dimensionCoverage: Record<string, boolean> };
  };
};

const environments: HermeticEnv[] = [];
const seats: readonly PivotSeatMandate[] = [
  { id: 'seat-001', mandate: 'Analyze the candidate evidence and mechanics' },
  { id: 'seat-002', mandate: 'Challenge transaction safety and boundary compliance' },
  { id: 'seat-003', mandate: 'Assess integration cost and durable continuation value' },
];

function environment(id: string): HermeticEnv {
  const value = createHermeticEnv(id);
  environments.push(value);
  return value;
}

function identity(overrides: Partial<PivotIdentityInput> = {}): PivotIdentityInput {
  return {
    sessionId: 'session-001',
    generation: 2,
    loopType: 'generic-loop',
    sourceIteration: 7,
    normalizedTrigger: 'coverage direction saturated',
    ordinal: 1,
    ...overrides,
  };
}

function candidate(index = 1): PivotCandidate {
  const directions = [
    ['Inspect cache lifetime boundaries', 'Trace cache lifetime boundaries across isolated workers'],
    ['Measure scheduler fairness', 'Measure scheduler fairness during concurrent producer bursts'],
    ['Compare protocol framing', 'Compare protocol framing at independent transport boundaries'],
  ] as const;
  const [title, focus] = directions[index - 1];
  return {
    id: `candidate-${String(index).padStart(3, '0')}`,
    title,
    focus,
    evidenceRefs: [`artifact:${index}`],
    relevanceRationale: `Direction ${index} addresses a distinct unresolved mechanism`,
    boundaryVerdict: {
      status: 'within_boundary',
      rationale: 'The direction remains inside the caller supplied boundary',
    },
    fingerprint: `sha256:candidate-${index}`,
    seatProvenance: [`seat-00${index}`],
  };
}

function seatReport(
  seatId: string,
  selectedCandidateId: string | null = 'candidate-001',
  overrides: Partial<PivotSeatReport> = {},
): PivotSeatReport {
  return {
    seatId,
    selectedCandidateId,
    materialEndorsement: selectedCandidateId !== null,
    rationale: 'The selected direction is materially supported by the supplied evidence',
    blockers: [],
    ...overrides,
  };
}

function options(
  artifactRoot: string,
  overrides: Partial<RunDivergentPivotOptions> = {},
): RunDivergentPivotOptions {
  return {
    artifactRoot,
    identity: identity(),
    usage: {
      completedPivots: 0,
      councilSeatOutputs: 0,
      remainingIterations: 2,
    },
    seats,
    candidates: [candidate()],
    previousFocus: 'Current saturated focus',
    saturatedDirections: ['Current saturated focus'],
    async dispatchSeat(seat) {
      return seatReport(seat.id);
    },
    now: () => '2026-07-10T12:00:00.000Z',
    ...overrides,
  };
}

function stateEvents(path: string): Array<Record<string, unknown>> {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

afterEach(() => {
  vi.restoreAllMocks();
  while (environments.length > 0) {
    environments.pop()?.cleanup();
  }
});

describe('divergent pivot identity and paths', () => {
  it('derives a stable lineage hash without using the display ordinal as hash input', () => {
    const first = derivePivotId(identity());
    const same = derivePivotId(identity());
    const nextIteration = derivePivotId(identity({ sourceIteration: 8 }));
    const nextTrigger = derivePivotId(identity({ normalizedTrigger: 'new saturation trigger' }));
    const nextOrdinal = derivePivotId(identity({ ordinal: 2 }));

    expect(same).toBe(first);
    expect(nextIteration).not.toBe(first);
    expect(nextTrigger).not.toBe(first);
    expect(nextOrdinal).not.toBe(first);
    expect(nextOrdinal.split('-').at(-1)).toBe(first.split('-').at(-1));
  });

  it('constructs a pivot-scoped layout that cannot enter an ai-council tree', () => {
    const env = environment('pivot-paths');
    const pivotId = derivePivotId(identity());
    const paths = buildPivotCouncilPaths(env.tmpDir, pivotId);
    const packetCouncilRoot = join(env.tmpDir, 'packet', 'ai-council');

    expect(paths.councilRoot.startsWith(packetCouncilRoot)).toBe(false);
    expect(paths.councilRoot).toBe(join(
      paths.artifactRoot,
      'divergent',
      'pivots',
      pivotId,
      'council',
    ));
    expect(() => buildPivotCouncilPaths(packetCouncilRoot, pivotId)).toThrow(
      'artifactRoot must not be inside an ai-council artifact tree',
    );
  });

  it('gives attempt 2 its own seat and deliberation paths and keeps attempt 1 paths', () => {
    const env = environment('pivot-attempt-paths');
    const pivotId = derivePivotId(identity());
    const first = buildPivotCouncilPaths(env.tmpDir, pivotId);
    const second = buildPivotCouncilPaths(env.tmpDir, pivotId, 2);

    expect(second.configPath).toBe(first.configPath);
    expect(second.statePath).toBe(first.statePath);
    expect(second.reportPath).toBe(first.reportPath);
    expect(second.seatPaths).not.toEqual(first.seatPaths);
    expect(second.seatPaths.every((path) => path.includes('/attempt-2/'))).toBe(true);
    expect(second.deliberationPath).not.toBe(first.deliberationPath);
    expect(second.deliberationPath).toContain('/attempt-2/');
    expect(first.seatPaths[0].endsWith(join('council', 'seats', 'seat-001.md'))).toBe(true);
    expect(() => buildPivotCouncilPaths(env.tmpDir, pivotId, 3 as never)).toThrow(
      'attempt must be 1 or 2',
    );
  });
});

describe('divergent pivot quorum and agreement', () => {
  it('persists the complete layout after 3/3 parse-valid returns and 2/3 agreement', async () => {
    const env = environment('pivot-success');
    const result = await runDivergentPivot(options(env.tmpDir, {
      async dispatchSeat(seat) {
        return seatReport(seat.id, seat.id === 'seat-003' ? null : 'candidate-001');
      },
    }));

    expect(result).toMatchObject({
      status: 'completed',
      restoredFocus: candidate().focus,
      agreement: { converged: true, endorsementCount: 2 },
    });
    expect(readdirSync(result.paths.councilRoot).sort()).toEqual([
      'config.json',
      'deliberation.md',
      'report.md',
      'seats',
      'state.jsonl',
    ]);
    expect(readdirSync(result.paths.seatsRoot).sort()).toEqual([
      'seat-001.md',
      'seat-002.md',
      'seat-003.md',
    ]);
    const events = stateEvents(result.paths.statePath);
    expect(events.filter((event) => event.event === 'pivot_seat_returned')).toHaveLength(3);
    expect(events.at(-1)).toMatchObject({
      event: 'pivot_completed',
      currentFocus: candidate().focus,
      pivotCount: 1,
      councilSeatOutputs: 3,
    });
  });

  it('produces an identical completed result via prepare / recordPivotSeatResult / finalize as via runDivergentPivot', async () => {
    const oneShotEnv = environment('pivot-split-oneshot');
    const splitEnv = environment('pivot-split-multistep');
    const baseOptions = options(oneShotEnv.tmpDir);

    const oneShot = await runDivergentPivot(baseOptions);

    const prepared = await preparePivotTransaction({ ...baseOptions, artifactRoot: splitEnv.tmpDir });
    if (prepared.status !== 'pending') {
      throw new Error(`Expected a pending prepare result, got "${prepared.status}".`);
    }
    expect(prepared.missingSeats.map((seat) => seat.id)).toEqual(['seat-001', 'seat-002', 'seat-003']);

    for (const seat of prepared.missingSeats) {
      recordPivotSeatResult({
        paths: prepared.paths,
        pivotId: prepared.pivotId,
        seat,
        outcome: {
          status: 'fulfilled',
          output: seatReport(seat.id),
          startedAtIso: '2026-07-10T12:00:00.000Z',
          completedAtIso: '2026-07-10T12:00:01.000Z',
          durationMs: 1000,
        },
      });
    }

    const finalized = finalizePivotTransaction({
      paths: prepared.paths,
      pivotId: prepared.pivotId,
      resumed: prepared.resumed,
      now: baseOptions.now,
    });

    expect(finalized.status).toBe('completed');
    expect(finalized.pivotId).toBe(oneShot.pivotId);
    expect(finalized).toMatchObject({
      status: 'completed',
      restoredFocus: oneShot.status === 'completed' ? oneShot.restoredFocus : undefined,
    });
    if (finalized.status === 'completed' && oneShot.status === 'completed') {
      expect(finalized.selectedCandidate).toEqual(oneShot.selectedCandidate);
      expect(finalized.agreement).toEqual(oneShot.agreement);
    }
    const splitEvents = stateEvents(finalized.paths.statePath);
    expect(splitEvents.filter((event) => event.event === 'pivot_seat_returned')).toHaveLength(3);
    expect(splitEvents.at(-1)).toMatchObject({ event: 'pivot_completed' });
  });

  it('keeps attempt-1 seat event ids and loads a config written before attempts existed', async () => {
    const env = environment('pivot-pre-attempt-config');
    const result = await runDivergentPivot(options(env.tmpDir));

    expect(result.status).toBe('completed');
    const seatEvents = stateEvents(result.paths.statePath)
      .filter((event) => event.event === 'pivot_seat_returned');
    expect(seatEvents.map((event) => event.eventId)).toEqual([
      `${result.pivotId}:pivot_seat_returned:seat-001`,
      `${result.pivotId}:pivot_seat_returned:seat-002`,
      `${result.pivotId}:pivot_seat_returned:seat-003`,
    ]);
    expect(seatEvents.some((event) => Object.prototype.hasOwnProperty.call(event, 'attempt'))).toBe(false);

    const persisted = JSON.parse(readFileSync(result.paths.configPath, 'utf8')) as Record<string, unknown>;
    expect(Object.prototype.hasOwnProperty.call(persisted, 'attempt')).toBe(false);
    expect((persisted.invariants as Record<string, unknown>).rounds).toBe(1);

    expect(finalizePivotTransaction({ paths: result.paths, pivotId: result.pivotId }).status).toBe('completed');
  });

  it('fails closed when only 2/3 seats fulfill', async () => {
    const env = environment('pivot-two-fulfilled');
    const result = await runDivergentPivot(options(env.tmpDir, {
      async dispatchSeat(seat) {
        if (seat.id === 'seat-003') throw new Error('seat unavailable');
        return seatReport(seat.id);
      },
    }));

    expect(result).toMatchObject({
      status: 'failed',
      failureReason: 'council_return_quorum_failed',
      quorum: { fulfilled: 2, parseValid: 2, passed: false },
    });
  });

  it('fails closed when one fulfilled output is not parse-valid', async () => {
    const env = environment('pivot-invalid-output');
    const result = await runDivergentPivot(options(env.tmpDir, {
      async dispatchSeat(seat) {
        if (seat.id === 'seat-002') return { seatId: seat.id, materialEndorsement: true };
        return seatReport(seat.id);
      },
    }));

    expect(result).toMatchObject({
      status: 'failed',
      failureReason: 'council_parse_quorum_failed',
      quorum: { fulfilled: 3, parseValid: 2, passed: false },
    });
  });

  it('reports the all-failed dispatch case specifically', async () => {
    const env = environment('pivot-all-failed');
    const result = await runDivergentPivot(options(env.tmpDir, {
      async dispatchSeat() {
        throw new Error('executor unavailable');
      },
    }));

    expect(result).toMatchObject({
      status: 'failed',
      failureReason: 'council_all_seats_rejected',
      quorum: { fulfilled: 0, allFailed: true, passed: false },
    });
  });

  it('retries a first-attempt quorum failure once and completes on the second attempt', async () => {
    const env = environment('pivot-attempt-retry');
    const calls = new Map<string, number>();
    const dispatchSeat = vi.fn(async (seat: PivotSeatMandate) => {
      const count = (calls.get(seat.id) ?? 0) + 1;
      calls.set(seat.id, count);
      if (seat.id === 'seat-003' && count === 1) {
        throw new Error('seat unavailable on the first attempt');
      }
      return seatReport(seat.id);
    });
    const result = await runDivergentPivot(options(env.tmpDir, { dispatchSeat }));

    expect(result.status).toBe('completed');
    if (result.status !== 'completed') {
      throw new Error(`Expected a completed pivot, got "${result.status}".`);
    }
    expect(dispatchSeat).toHaveBeenCalledTimes(6);
    expect(result.completedEvent.councilSeatOutputs).toBe(6);

    const events = stateEvents(result.paths.statePath);
    const attemptFailures = events.filter((event) => event.event === 'pivot_attempt_failed');
    expect(attemptFailures).toHaveLength(1);
    expect(attemptFailures[0]).toMatchObject({ attempt: 1, retryable: true });
    expect(events.filter((event) => event.event === 'pivot_failed')).toHaveLength(0);
    const seatEvents = events.filter((event) => event.event === 'pivot_seat_returned');
    expect(seatEvents).toHaveLength(6);
    expect(seatEvents.map((event) => event.eventId)).toEqual([
      `${result.pivotId}:pivot_seat_returned:seat-001`,
      `${result.pivotId}:pivot_seat_returned:seat-002`,
      `${result.pivotId}:pivot_seat_returned:seat-003`,
      `${result.pivotId}:attempt-2:pivot_seat_returned:seat-001`,
      `${result.pivotId}:attempt-2:pivot_seat_returned:seat-002`,
      `${result.pivotId}:attempt-2:pivot_seat_returned:seat-003`,
    ]);
    expect(seatEvents.slice(3).every((event) => event.attempt === 2)).toBe(true);

    const root = result.paths.artifactRoot;
    expect(buildPivotCouncilPaths(root, result.pivotId).seatPaths.every(
      (path) => existsSync(path),
    )).toBe(true);
    expect(buildPivotCouncilPaths(root, result.pivotId, 2).seatPaths.every(
      (path) => existsSync(path),
    )).toBe(true);

    const persisted = JSON.parse(readFileSync(result.paths.configPath, 'utf8')) as Record<string, unknown>;
    expect(persisted.attempt).toBe(2);
    expect((persisted.invariants as Record<string, unknown>).rounds).toBe(2);
    expect(finalizePivotTransaction({ paths: result.paths, pivotId: result.pivotId }).status).toBe('completed');
  });

  it('fails closed when the retry also misses quorum and opens no third attempt', async () => {
    const env = environment('pivot-attempt-retry-exhausted');
    const dispatchSeat = vi.fn(async (seat: PivotSeatMandate) => {
      if (seat.id === 'seat-003') throw new Error('seat unavailable');
      return seatReport(seat.id);
    });
    const result = await runDivergentPivot(options(env.tmpDir, { dispatchSeat }));

    expect(result).toMatchObject({
      status: 'failed',
      failureReason: 'council_return_quorum_failed',
    });
    expect(Object.prototype.hasOwnProperty.call(result, 'retryable')).toBe(false);
    expect(dispatchSeat).toHaveBeenCalledTimes(6);
    const events = stateEvents(result.paths.statePath);
    expect(events.filter((event) => event.event === 'pivot_attempt_failed')).toHaveLength(1);
    expect(events.filter((event) => event.event === 'pivot_failed')).toHaveLength(1);
  });

  it('does not retry an agreement failure', async () => {
    const env = environment('pivot-agreement-terminal');
    const candidates = [candidate(1), candidate(2), candidate(3)];
    const dispatchSeat = vi.fn(async (seat: PivotSeatMandate) => {
      const selected = candidates[Number(seat.id.slice(-1)) - 1];
      return seatReport(seat.id, selected.id);
    });
    const result = await runDivergentPivot(options(env.tmpDir, { candidates, dispatchSeat }));

    expect(result).toMatchObject({
      status: 'failed',
      failureReason: 'council_agreement_failed',
    });
    expect(dispatchSeat).toHaveBeenCalledTimes(3);
    const events = stateEvents(result.paths.statePath);
    expect(events.filter((event) => event.event === 'pivot_attempt_failed')).toHaveLength(0);
    expect(events.filter((event) => event.event === 'pivot_seat_returned')).toHaveLength(3);
  });

  it('reopens a quorum-failed pivot as attempt 2 through prepare, record and finalize', async () => {
    const env = environment('pivot-attempt-retry-split');
    const baseOptions = options(env.tmpDir, {
      identity: identity({ normalizedTrigger: 'retry across the step api boundary' }),
    });

    const prepared = await preparePivotTransaction(baseOptions);
    if (prepared.status !== 'pending') {
      throw new Error(`Expected a pending prepare result, got "${prepared.status}".`);
    }
    expect(prepared.attempt).toBe(1);

    const rejectedSeat = prepared.missingSeats.find((seat) => seat.id === 'seat-003');
    if (!rejectedSeat) {
      throw new Error('Expected seat-003 to still be missing.');
    }
    recordPivotSeatResult({
      paths: prepared.paths,
      pivotId: prepared.pivotId,
      seat: rejectedSeat,
      outcome: {
        status: 'rejected',
        error: { name: 'Error', message: 'seat unavailable' },
        startedAtIso: '2026-07-10T12:00:00.000Z',
        completedAtIso: '2026-07-10T12:00:01.000Z',
        durationMs: 1000,
      },
    });

    const firstFinalize = finalizePivotTransaction({
      paths: prepared.paths,
      pivotId: prepared.pivotId,
      resumed: prepared.resumed,
      now: baseOptions.now,
    });
    expect(firstFinalize).toMatchObject({ status: 'failed', retryable: true, attempt: 1 });

    const reopened = await preparePivotTransaction(baseOptions);
    expect(reopened).toMatchObject({ status: 'pending', attempt: 2 });
    if (reopened.status !== 'pending') {
      throw new Error(`Expected a pending prepare result, got "${reopened.status}".`);
    }
    expect(reopened.missingSeats.map((seat) => seat.id)).toEqual(['seat-001', 'seat-002', 'seat-003']);
    expect(reopened.paths.seatPaths[0]).toContain('/attempt-2/');
  });

  it('distinguishes material agreement, non-agreement, and a high blocker veto', () => {
    const agreed = evaluatePivotAgreement([
      seatReport('seat-001'),
      seatReport('seat-002'),
      seatReport('seat-003', null),
    ], ['candidate-001']);
    const split = evaluatePivotAgreement([
      seatReport('seat-001', 'candidate-001'),
      seatReport('seat-002', 'candidate-002'),
      seatReport('seat-003', 'candidate-003'),
    ], ['candidate-001', 'candidate-002', 'candidate-003']);
    const blocked = evaluatePivotAgreement([
      seatReport('seat-001'),
      seatReport('seat-002', 'candidate-001', {
        blockers: [{ severity: 'high', message: 'Boundary proof is contradictory' }],
      }),
      seatReport('seat-003', null),
    ], ['candidate-001']);

    expect(agreed).toMatchObject({ converged: true, endorsementCount: 2, reason: 'agreed' });
    expect(split).toMatchObject({
      converged: false,
      selectedCandidateId: null,
      reason: 'insufficient_endorsement',
    });
    expect(blocked).toMatchObject({
      converged: false,
      selectedCandidateId: 'candidate-001',
      reason: 'high_severity_blocker',
    });
  });

  it('fails the transaction when three parse-valid seats do not agree', async () => {
    const env = environment('pivot-no-agreement');
    const candidates = [candidate(1), candidate(2), candidate(3)];
    const result = await runDivergentPivot(options(env.tmpDir, {
      candidates,
      async dispatchSeat(seat) {
        const selected = candidates[Number(seat.id.slice(-1)) - 1];
        return seatReport(seat.id, selected.id);
      },
    }));

    expect(result).toMatchObject({
      status: 'failed',
      failureReason: 'council_agreement_failed',
      quorum: { passed: true },
      agreement: { converged: false, reason: 'insufficient_endorsement' },
    });
  });
});

describe('divergent pivot preflight and resume', () => {
  it.each([
    {
      name: 'maxPivots',
      config: { maxPivots: 1 },
      usage: { completedPivots: 1, councilSeatOutputs: 0, remainingIterations: 2 },
      reason: 'max_pivots_exceeded',
    },
    {
      name: 'maxCouncilSeatOutputs',
      config: { maxCouncilSeatOutputs: 2 },
      usage: { completedPivots: 0, councilSeatOutputs: 0, remainingIterations: 2 },
      reason: 'max_council_seat_outputs_exceeded',
    },
  ])('rejects $name before dispatch', async ({ config, usage, reason }) => {
    const env = environment(`pivot-preflight-${reason}`);
    const dispatchSeat = vi.fn(async (seat: PivotSeatMandate) => seatReport(seat.id));
    const result = await runDivergentPivot(options(env.tmpDir, {
      identity: identity({ normalizedTrigger: reason }),
      config: { antiConvergence: { divergent: config } },
      usage,
      dispatchSeat,
    }));

    expect(result).toMatchObject({ status: 'failed', failureReason: reason });
    expect(dispatchSeat).not.toHaveBeenCalled();
  });

  // The pivot no longer refuses on remaining iterations, so a live setting for it
  // would be accepted and do nothing. It is not read, and not persisted.
  it('ignores a live minRemainingIterations setting and persists no such limit', async () => {
    const env = environment('pivot-min-remaining-ignored');
    const result = await runDivergentPivot(options(env.tmpDir, {
      identity: identity({ normalizedTrigger: 'min remaining ignored' }),
      // An older config may still carry the key the input type no longer names.
      config: { antiConvergence: { divergent: { minRemainingIterations: 2 } } } as RunDivergentPivotOptions['config'],
      usage: { completedPivots: 0, councilSeatOutputs: 0, remainingIterations: 1 },
    }));

    expect(result.status).toBe('completed');
    const persisted = JSON.parse(readFileSync(result.paths.configPath, 'utf8')) as { limits: Record<string, unknown> };
    expect(Object.prototype.hasOwnProperty.call(persisted.limits, 'minRemainingIterations')).toBe(false);
  });

  it('still finalizes a pivot whose persisted limits carry minRemainingIterations', async () => {
    const env = environment('pivot-min-remaining-persisted');
    const result = await runDivergentPivot(options(env.tmpDir, {
      identity: identity({ normalizedTrigger: 'min remaining persisted' }),
      usage: { completedPivots: 0, councilSeatOutputs: 0, remainingIterations: 1 },
    }));
    expect(result.status).toBe('completed');
    const persisted = JSON.parse(readFileSync(result.paths.configPath, 'utf8')) as { limits: Record<string, unknown> };
    writeFileSync(result.paths.configPath, JSON.stringify({
      ...persisted,
      limits: { ...persisted.limits, minRemainingIterations: 2 },
    }), 'utf8');

    const replayed = finalizePivotTransaction({ paths: result.paths, pivotId: result.pivotId });
    expect(replayed.status).toBe('completed');
  });

  it('allows a later pivot after an earlier pivot used six seat outputs', async () => {
    const env = environment('pivot-cap-later-pivot');
    const result = await runDivergentPivot(options(env.tmpDir, {
      identity: identity({ ordinal: 2, normalizedTrigger: 'second pivot after a retried first' }),
      usage: { completedPivots: 1, councilSeatOutputs: 6, remainingIterations: 2 },
    }));

    expect(result.status).toBe('completed');
  });

  it('does not refuse a resumed attempt that already holds two seat returns', async () => {
    const env = environment('pivot-cap-resume-two');
    const dispatchSeat = vi.fn(async (seat: PivotSeatMandate) => seatReport(seat.id));
    let interrupted = false;
    await expect(runDivergentPivot(options(env.tmpDir, {
      dispatchSeat,
      afterEventPersisted(event) {
        if (!interrupted && event.event === 'pivot_seat_returned' && event.seatId === 'seat-002') {
          interrupted = true;
          throw new Error('simulated interruption after two seats');
        }
      },
    }))).rejects.toThrow('simulated interruption after two seats');

    const resumed = await runDivergentPivot(options(env.tmpDir, {
      dispatchSeat,
      usage: { completedPivots: 0, councilSeatOutputs: 2, remainingIterations: 2 },
    }));

    expect(resumed).toMatchObject({ status: 'completed', resumed: true });
    expect(dispatchSeat).toHaveBeenCalledTimes(4);
  });

  it('rejects a nested adapter invocation through the runtime recursion guard', async () => {
    const env = environment('pivot-recursion');
    let nestedResult: Awaited<ReturnType<typeof runDivergentPivot>> | null = null;
    const result = await runDivergentPivot(options(join(env.tmpDir, 'outer'), {
      async dispatchSeat(seat) {
        if (seat.id === 'seat-001') {
          nestedResult = await runDivergentPivot(options(join(env.tmpDir, 'nested'), {
            identity: identity({ ordinal: 2, normalizedTrigger: 'nested attempt' }),
          }));
        }
        return seatReport(seat.id);
      },
    }));

    expect(result.status).toBe('completed');
    expect(nestedResult).toMatchObject({
      status: 'failed',
      failureReason: 'recursion_guard',
      durable: false,
    });
  });

  it('resumes from durable seats, fills only missing seats, and replays completion', async () => {
    const env = environment('pivot-resume');
    const calls = new Map<string, number>();
    const dispatchSeat = vi.fn(async (seat: PivotSeatMandate) => {
      calls.set(seat.id, (calls.get(seat.id) ?? 0) + 1);
      return seatReport(seat.id);
    });
    let interrupted = false;

    await expect(runDivergentPivot(options(env.tmpDir, {
      dispatchSeat,
      afterEventPersisted(event) {
        if (!interrupted && event.event === 'pivot_seat_returned' && event.seatId === 'seat-001') {
          interrupted = true;
          throw new Error('simulated process interruption');
        }
      },
    }))).rejects.toThrow('simulated process interruption');

    const resumed = await runDivergentPivot(options(env.tmpDir, { dispatchSeat }));
    const replayed = await runDivergentPivot(options(env.tmpDir, { dispatchSeat }));

    expect(resumed).toMatchObject({ status: 'completed', resumed: true });
    expect(replayed).toMatchObject({ status: 'completed', resumed: true });
    expect(calls.get('seat-001')).toBe(1);
    expect(calls.get('seat-002')).toBe(2);
    expect(calls.get('seat-003')).toBe(2);
    expect(dispatchSeat).toHaveBeenCalledTimes(5);
    const events = stateEvents(resumed.paths.statePath);
    expect(events.filter((event) => event.event === 'pivot_started')).toHaveLength(1);
    expect(events.filter((event) => event.event === 'pivot_seat_returned')).toHaveLength(3);
    expect(events.filter((event) => event.event === 'pivot_completed')).toHaveLength(1);
    expect(existsSync(resumed.paths.reportPath)).toBe(true);

    const persistedConfig = JSON.parse(readFileSync(resumed.paths.configPath, 'utf8')) as Record<string, unknown>;
    writeFileSync(resumed.paths.configPath, JSON.stringify({ ...persistedConfig, acceptedCandidates: [{}] }), 'utf8');
    expect(() => finalizePivotTransaction({
      paths: resumed.paths,
      pivotId: derivePivotId(identity()),
    })).toThrow('does not match the expected contract');
  });
});

describe('review divergent pivot with a configured custom dimension', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      rmSync(tempDirs.pop() as string, { recursive: true, force: true });
    }
  });

  it('accepts the clean-stop trigger and seeds no unswept-dimension for a covered custom dimension', () => {
    const dir = mkdtempSync(join(tmpdir(), 'review-custom-dim-pivot-'));
    tempDirs.push(dir);
    const reviewDir = join(dir, 'review');
    mkdirSync(reviewDir, { recursive: true });
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      sessionId: 'review-custom-dim',
      generation: 1,
      reviewTarget: 'src',
      maxIterations: 6,
      reviewDimensions: ['correctness', 'performance'],
    }), 'utf8');
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), [
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        status: 'complete',
        focus: 'correctness',
        dimensions: ['correctness'],
        newFindingsRatio: 0.2,
        findingsSummary: { P0: 0, P1: 0, P2: 0 },
      },
      {
        type: 'iteration',
        iteration: 2,
        run: 2,
        status: 'complete',
        focus: 'performance',
        dimensions: ['performance'],
        newFindingsRatio: 0.1,
        findingsSummary: { P0: 0, P1: 0, P2: 0 },
      },
    ].map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '## 11. NEXT FOCUS\n\nperformance\n', 'utf8');

    const reduced = reduceReviewState(dir, { write: true, artifactDir: reviewDir });
    // The custom dimension is covered by persisted state, so the pivot must not
    // propose sweeping it again; the assertion below is only meaningful if this holds.
    expect(reduced.registry.dimensionCoverage.performance).toBe(true);

    const buildInput = () => buildReviewPivotPreparationInput({
      artifactRoot: dir,
      configPath: join(reviewDir, 'deep-review-config.json'),
      stateLogPath: join(reviewDir, 'deep-review-state.jsonl'),
      strategyPath: join(reviewDir, 'deep-review-strategy.md'),
      registryPath: reduced.registryPath,
      currentIteration: 2,
      maxIterations: 6,
      triggerReason: 'all_dimensions_clean',
    });

    expect(buildInput).not.toThrow();
    const prepared = buildInput();

    // A candidate carries its seed source on seatProvenance, while a rejected seed
    // keeps the source field. Checking both lists keeps a re-proposed dimension
    // from hiding in the boundary-rejection path.
    const unsweptPerformanceSeeds = [
      ...prepared.candidates.map((entry) => ({
        source: entry.seatProvenance.join(' '),
        title: entry.title,
        focus: entry.focus,
      })),
      ...prepared.boundaryRejections.map((entry) => ({
        source: entry.source,
        title: entry.title,
        focus: entry.focus,
      })),
    ].filter((entry) => entry.source.includes('unswept-dimension')
      && /performance/iu.test(`${entry.title} ${entry.focus}`));

    expect(unsweptPerformanceSeeds).toEqual([]);
  });
});
describe('review divergent pivot under the expansive depth mode', () => {
  const tempDirs: string[] = [];
  const iterationRecords = [
    {
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'correctness',
      dimensions: ['correctness'],
      newFindingsRatio: 0.2,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    },
    {
      type: 'iteration',
      iteration: 2,
      run: 2,
      status: 'complete',
      focus: 'performance',
      dimensions: ['performance'],
      newFindingsRatio: 0.1,
      findingsSummary: { P0: 0, P1: 0, P2: 0 },
    },
  ];

  afterEach(() => {
    while (tempDirs.length > 0) {
      rmSync(tempDirs.pop() as string, { recursive: true, force: true });
    }
  });

  function fixture(
    expansive: boolean,
    frontierNodes: readonly Record<string, unknown>[] = [],
  ): { readonly dir: string; readonly reviewDir: string; readonly registryPath: string } {
    const dir = mkdtempSync(join(tmpdir(), 'review-frontier-pivot-'));
    tempDirs.push(dir);
    const reviewDir = join(dir, 'review');
    mkdirSync(reviewDir, { recursive: true });
    writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({
      sessionId: `review-frontier-${expansive ? 'expansive' : 'default'}`,
      generation: 1,
      reviewTarget: 'src',
      maxIterations: 6,
      reviewDimensions: ['correctness', 'performance'],
      ...(expansive ? { antiConvergence: { depthMode: 'expansive' } } : {}),
    }), 'utf8');
    writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), iterationRecords
      .map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
    writeFileSync(join(reviewDir, 'deep-review-strategy.md'), '## 11. NEXT FOCUS\n\nperformance\n', 'utf8');
    if (frontierNodes.length > 0) {
      writeFileSync(join(reviewDir, 'frontier-nodes.jsonl'), frontierNodes
        .map((node) => JSON.stringify(node)).join('\n') + '\n', 'utf8');
    }
    const reduced = reduceReviewState(dir, { write: true, artifactDir: reviewDir });
    return { dir, reviewDir, registryPath: reduced.registryPath };
  }

  function frontierStatuses(registryPath: string): Record<string, string> {
    const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as {
      frontier?: { nodes?: Array<{ nodeId: string; status: string }> };
    };
    return Object.fromEntries((registry.frontier?.nodes ?? [])
      .map((node) => [node.nodeId, node.status]));
  }

  function buildInput(
    target: { readonly dir: string; readonly reviewDir: string; readonly registryPath: string },
    configFile = 'deep-review-config.json',
  ) {
    return buildReviewPivotPreparationInput({
      artifactRoot: target.dir,
      configPath: join(target.reviewDir, configFile),
      stateLogPath: join(target.reviewDir, 'deep-review-state.jsonl'),
      strategyPath: join(target.reviewDir, 'deep-review-strategy.md'),
      registryPath: target.registryPath,
      currentIteration: 2,
      maxIterations: 6,
      triggerReason: 'all_dimensions_clean',
    });
  }

  const openNode = {
    nodeId: 'frontier-001',
    depth: 1,
    scope: ['src/cache'],
    question: 'Does the cache evict on the lifetime boundary?',
    status: 'open',
    iteration: 2,
  };
  const exhaustedNode = {
    nodeId: 'frontier-002',
    depth: 1,
    scope: ['src/cache', 'src/scheduler'],
    question: 'Is the cache write path bounded?',
    status: 'exhausted',
    iteration: 2,
  };
  const answeredNode = {
    nodeId: 'frontier-003',
    depth: 1,
    scope: 'src/cache/lifetime',
    question: 'Is the lifetime bounded?',
    status: 'answered',
    iteration: 2,
  };

  it('refuses a pivot while an open frontier node remains', () => {
    const target = fixture(true, [openNode]);
    expect(frontierStatuses(target.registryPath)['frontier-001']).toBe('open');

    expect(() => buildInput(target)).toThrow(/terminal frontier/u);
  });

  it('seeds one frontier-unanswered direction per closed sub-target the frontier left uncovered', () => {
    const target = fixture(true, [exhaustedNode, answeredNode]);
    expect(frontierStatuses(target.registryPath)).toEqual({
      'frontier-002': 'exhausted',
      'frontier-003': 'answered',
    });

    const prepared = buildInput(target);
    const frontierSeeds = [
      ...prepared.candidates.map((entry) => ({
        source: entry.seatProvenance.join(' '),
        title: entry.title,
        focus: entry.focus,
      })),
      ...prepared.boundaryRejections.map((entry) => ({
        source: entry.source,
        title: entry.title,
        focus: entry.focus,
      })),
    ].filter((entry) => entry.source.includes('frontier-unanswered'));

    expect(frontierSeeds).toHaveLength(1);
    expect(frontierSeeds[0].title).toBe('Revisit exhausted frontier node frontier-002');
    expect(frontierSeeds[0].focus).toContain('exhausted frontier sub-target frontier-002 (src/cache, src/scheduler)');
    expect(frontierSeeds.some((entry) => `${entry.title} ${entry.focus}`.includes('frontier-003'))).toBe(false);
  });

  it('keeps a frontier seed whose scope path happens to name a mutation verb', () => {
    const verbScoped = {
      ...exhaustedNode,
      nodeId: 'frontier-004',
      scope: ['src/mutation', 'src/modify-record.ts', 'src/rewrite-engine'],
    };
    const target = fixture(true, [verbScoped]);
    expect(frontierStatuses(target.registryPath)['frontier-004']).toBe('exhausted');

    const prepared = buildInput(target);
    const kept = prepared.candidates.filter((entry) => entry.seatProvenance.join(' ').includes('frontier-unanswered'));
    const dropped = prepared.boundaryRejections.filter((entry) => entry.source.includes('frontier-unanswered'));

    expect(dropped).toEqual([]);
    expect(kept.map((entry) => entry.title)).toEqual(['Revisit exhausted frontier node frontier-004']);
    expect(kept[0].focus).toContain('(src/mutation, src/modify-record.ts, src/rewrite-engine)');
  });

  it('still rejects a frontier seed whose free-text scope asks for a change', () => {
    const proseScoped = {
      ...exhaustedNode,
      nodeId: 'frontier-005',
      scope: ['src/cache', 'implement the fix in src/x'],
    };
    const target = fixture(true, [proseScoped]);
    expect(frontierStatuses(target.registryPath)['frontier-005']).toBe('exhausted');

    const prepared = buildInput(target);
    const kept = prepared.candidates.filter((entry) => entry.seatProvenance.join(' ').includes('frontier-unanswered'));
    const dropped = prepared.boundaryRejections.filter((entry) => entry.source.includes('frontier-unanswered'));

    expect(kept).toEqual([]);
    expect(dropped.map((entry) => entry.title)).toEqual(['Revisit exhausted frontier node frontier-005']);
  });

  it('leaves a default run untouched even when the registry still carries an open frontier node', () => {
    const target = fixture(true, [openNode]);
    writeFileSync(join(target.reviewDir, 'deep-review-config-default.json'), JSON.stringify({
      sessionId: 'review-frontier-default',
      generation: 1,
      reviewTarget: 'src',
      maxIterations: 6,
      reviewDimensions: ['correctness', 'performance'],
    }), 'utf8');
    expect(frontierStatuses(target.registryPath)['frontier-001']).toBe('open');

    const prepared = buildInput(target, 'deep-review-config-default.json');
    const frontierSeeds = [
      ...prepared.candidates.map((entry) => entry.seatProvenance.join(' ')),
      ...prepared.boundaryRejections.map((entry) => entry.source),
    ].filter((source) => source.includes('frontier-unanswered'));

    expect(frontierSeeds).toEqual([]);
  });
});
