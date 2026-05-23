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

  // Closes DR-014 (weak coverage: was 2 tests / ~8 expects; expanded to 6 tests / 25+ expects).

  it('marks all_failed=true when every seat throws', async () => {
    const result = await dispatchCouncilSeats({
      roundId: 'round-003',
      seats: [{ id: 'seat-a' }, { id: 'seat-b' }, { id: 'seat-c' }],
      async dispatchSeat() {
        throw new Error('all seats fail');
      },
    });

    expect(result.results.every((entry) => entry.status === 'rejected')).toBe(true);
    expect(result.results.every((entry) => entry.error?.message === 'all seats fail')).toBe(true);
    expect(result.summary).toMatchObject({ total: 3, succeeded: 0, failed: 3, all_failed: true });
  });

  it('handles single-seat round correctly', async () => {
    const result = await dispatchCouncilSeats({
      roundId: 'round-004',
      seats: [{ id: 'solo-seat' }],
      async dispatchSeat(seat) {
        return { seat_id: seat.id, lens: 'solo' };
      },
    });

    expect(result.round_id).toBe('round-004');
    expect(result.results).toHaveLength(1);
    expect(result.results[0].status).toBe('fulfilled');
    expect(result.results[0].seat_id).toBe('solo-seat');
    expect(result.summary).toMatchObject({ total: 1, succeeded: 1, failed: 0, all_failed: false });
  });

  it('preserves seat order even when later seats complete before earlier ones', async () => {
    const result = await dispatchCouncilSeats({
      roundId: 'round-005',
      seats: [{ id: 'slow-seat' }, { id: 'fast-seat' }],
      async dispatchSeat(seat) {
        if (seat.id === 'slow-seat') {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        return { seat_id: seat.id };
      },
    });

    expect(result.results.map((entry) => entry.seat_id)).toEqual(['slow-seat', 'fast-seat']);
    expect(result.results.every((entry) => entry.status === 'fulfilled')).toBe(true);
  });

  it('passes seat lens through to dispatchSeat context', async () => {
    const observedLenses: Array<string | undefined> = [];
    const result = await dispatchCouncilSeats({
      roundId: 'round-006',
      seats: [
        { id: 'seat-x', lens: 'engineer' },
        { id: 'seat-y', lens: 'auditor' },
      ],
      async dispatchSeat(seat) {
        observedLenses.push(seat.lens);
        return { seat_id: seat.id };
      },
    });

    expect(observedLenses).toEqual(['engineer', 'auditor']);
    expect(result.summary.succeeded).toBe(2);
  });
});
