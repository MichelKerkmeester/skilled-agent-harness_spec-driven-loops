import { afterEach, describe, expect, it, vi } from 'vitest';

import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs.js';

import type {
  PivotIdentityInput,
  PivotSeatMandate,
  PivotSeatReport,
  RunDivergentPivotOptions,
} from '../../lib/deep-loop/divergent-pivot.js';
import type { PivotCandidate } from '../../lib/deep-loop/pivot-candidates.js';

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
      config: { maxCouncilSeatOutputs: 4 },
      usage: { completedPivots: 0, councilSeatOutputs: 2, remainingIterations: 2 },
      reason: 'max_council_seat_outputs_exceeded',
    },
    {
      name: 'minRemainingIterations',
      config: { minRemainingIterations: 2 },
      usage: { completedPivots: 0, councilSeatOutputs: 0, remainingIterations: 1 },
      reason: 'insufficient_remaining_iterations',
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
  });
});
