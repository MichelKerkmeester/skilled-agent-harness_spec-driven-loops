import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { dispatchCouncilSeats } = require('../../lib/council/multi-seat-dispatch.cjs') as {
  dispatchCouncilSeats: (options: {
    roundId: string;
    seats: Array<{ id: string; lens?: string }>;
    dispatchSeat: (seat: { id: string }, context: { roundId: string; seatIndex: number }) => Promise<unknown>;
  }) => Promise<{
    round_id: string;
    results: Array<{ seat_id: string; status: string; output?: unknown; error?: { message: string } }>;
    summary: { total: number; succeeded: number; failed: number; all_failed: boolean };
  }>;
};

describe('council multi-seat dispatch', () => {
  it('dispatches seats in parallel while preserving result order', async () => {
    let release!: () => void;
    const barrier = new Promise<void>((resolve) => {
      release = resolve;
    });
    const started: string[] = [];

    const dispatch = dispatchCouncilSeats({
      roundId: 'round-001',
      seats: [{ id: 'seat-001' }, { id: 'seat-002' }, { id: 'seat-003' }],
      async dispatchSeat(seat, context) {
        started.push(`${seat.id}:${context.seatIndex}`);
        await barrier;
        return { seat_id: seat.id, round_id: context.roundId };
      },
    });

    await Promise.resolve();
    expect(started).toEqual(['seat-001:0', 'seat-002:1', 'seat-003:2']);

    release();
    const result = await dispatch;

    expect(result.round_id).toBe('round-001');
    expect(result.results.map((entry) => entry.seat_id)).toEqual(['seat-001', 'seat-002', 'seat-003']);
    expect(result.results.every((entry) => entry.status === 'fulfilled')).toBe(true);
    expect(result.summary).toMatchObject({ total: 3, succeeded: 3, failed: 0, all_failed: false });
  });

  it('captures individual seat failures without failing the whole round dispatch', async () => {
    const result = await dispatchCouncilSeats({
      roundId: 'round-002',
      seats: [{ id: 'seat-001' }, { id: 'seat-002' }],
      async dispatchSeat(seat) {
        if (seat.id === 'seat-002') throw new Error('seat executor failed');
        return { ok: true };
      },
    });

    expect(result.results.map((entry) => entry.status)).toEqual(['fulfilled', 'rejected']);
    expect(result.results[1].error?.message).toBe('seat executor failed');
    expect(result.summary).toMatchObject({ total: 2, succeeded: 1, failed: 1, all_failed: false });
  });
});
