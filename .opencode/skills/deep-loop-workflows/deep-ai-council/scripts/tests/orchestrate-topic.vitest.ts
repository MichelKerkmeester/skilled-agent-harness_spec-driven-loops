import { describe, expect, it } from 'vitest';

import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { createSessionState, createRoundState } = require('../../../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs') as {
  createSessionState: (input?: Record<string, unknown>) => Record<string, unknown>;
  createRoundState: (input?: Record<string, unknown>) => Record<string, unknown>;
};
const { readRoundStateRecords } = require('../../../../deep-loop-runtime/lib/council/round-state-jsonl.cjs') as {
  readRoundStateRecords: (path: string) => Record<string, unknown>[];
};
const { orchestrateTopic, roundStatePath } = require('../orchestrate-topic.cjs') as {
  orchestrateTopic: (options: Record<string, unknown>) => Promise<{
    topic_id: string;
    rounds_completed: number;
    final_verdict: Record<string, unknown> | null;
    stability_score: number | null;
    stop_reason: string;
  }>;
  roundStatePath: (packetSpecFolder: string, topicId: string, roundId: string) => string;
};

const baseVerdict = {
  recommended_option: 'extend-deep-loop-runtime',
  confidence: 0.82,
  blocking_disagreements: [],
  material_risks: ['threshold leakage'],
  decision_axes: {
    correctness: 'extend',
    integration: 'extend',
    maintainability: 'extend',
  },
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
function withTempPacket(run: (packetSpecFolder: string) => Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-orchestrate-topic-'));
  return run(tempDir).finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
}

/**
 * Creates a session state object for testing with a configurable max rounds per topic.
 */
function sessionState(packetSpecFolder: string, maxRoundsPerTopic = 3): Record<string, unknown> {
  return createSessionState({
    sessionId: 'council-session-test',
    specFolder: packetSpecFolder,
    topics: [{ title: 'Runtime Boundary', maxRoundsPerTopic }],
    round: createRoundState({
      roundNumber: 1,
      seats: ['seat-001', 'seat-002', 'seat-003'],
    }),
  });
}

describe('deep-ai-council topic orchestration', () => {
  it('returns early for a stable single-round verdict', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const state = sessionState(packetSpecFolder, 3);
      const result = await orchestrateTopic({
        topic_id: 'topic-001-runtime-boundary',
        session_state: state,
        executor_config: {
          dispatchSeat: async (seat: { id: string }) => ({ verdict: { ...baseVerdict, seat_id: seat.id } }),
          adjudicateRound: async () => ({ ...baseVerdict, stability_score: 0.05 }),
        },
      });

      expect(result).toMatchObject({
        topic_id: 'topic-001-runtime-boundary',
        rounds_completed: 1,
        stability_score: 0.05,
        stop_reason: 'saturation_threshold',
      });

      const records = readRoundStateRecords(roundStatePath(packetSpecFolder, 'topic-001-runtime-boundary', 'round-001'));
      expect(records).toHaveLength(1);
      expect(records[0]).toMatchObject({ type: 'round_completed', verdict_stable: true });
    });
  });

  it('converges after round 2 when the verdict delta is stable', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const state = sessionState(packetSpecFolder, 3);
      const verdicts = [
        baseVerdict,
        { ...baseVerdict, confidence: 0.81 },
        { ...baseVerdict, confidence: 0.8 },
      ];

      const result = await orchestrateTopic({
        topic_id: 'topic-001-runtime-boundary',
        session_state: state,
        executor_config: {
          dispatchSeat: async (seat: { id: string }) => ({ verdict: { ...baseVerdict, seat_id: seat.id } }),
          adjudicateRound: async ({ round_number }: { round_number: number }) => verdicts[round_number - 1],
        },
      });

      expect(result.rounds_completed).toBe(2);
      expect(result.stability_score).toBeCloseTo(0.002);
      expect(result.stop_reason).toBe('saturation_threshold');
      expect(readRoundStateRecords(roundStatePath(packetSpecFolder, 'topic-001-runtime-boundary', 'round-002'))[0])
        .toMatchObject({ verdict_stable: true, stop_reason: 'saturation_threshold' });
    });
  });

  it('terminates at max_rounds_per_topic when verdicts keep diverging', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const state = sessionState(packetSpecFolder, 3);
      const verdicts = [
        baseVerdict,
        {
          ...baseVerdict,
          recommended_option: 'create-council-runtime',
          confidence: 0.45,
          blocking_disagreements: ['runtime ownership unresolved'],
          material_risks: ['package duplication'],
          decision_axes: { correctness: 'split', integration: 'split', maintainability: 'split' },
        },
        {
          ...baseVerdict,
          recommended_option: 'extend-deep-loop-runtime',
          confidence: 0.9,
          blocking_disagreements: ['operator cost unresolved'],
          material_risks: ['threshold leakage', 'operator cost'],
          decision_axes: { correctness: 'extend', integration: 'extend', maintainability: 'extend' },
        },
      ];

      const result = await orchestrateTopic({
        topic_id: 'topic-001-runtime-boundary',
        session_state: state,
        executor_config: {
          dispatchSeat: async (seat: { id: string }) => ({ verdict: { ...baseVerdict, seat_id: seat.id } }),
          adjudicateRound: async ({ round_number }: { round_number: number }) => verdicts[round_number - 1],
        },
      });

      expect(result.rounds_completed).toBe(3);
      expect(result.stop_reason).toBe('max_rounds_per_topic');
      expect(result.stability_score).toBeGreaterThan(0.2);
    });
  });

  it('passes the resolved route contract into seat dispatch context', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const state = sessionState(packetSpecFolder, 1);
      const seenContexts: Array<Record<string, unknown>> = [];

      await orchestrateTopic({
        topic_id: 'topic-001-runtime-boundary',
        session_state: state,
        executor_config: {
          dispatchSeat: async (seat: { id: string }, dispatchContext: { context: Record<string, unknown> }) => {
            seenContexts.push(dispatchContext.context);
            return { verdict: { ...baseVerdict, seat_id: seat.id } };
          },
          adjudicateRound: async () => ({ ...baseVerdict, stability_score: 0.05 }),
        },
      });

      expect(seenContexts).toHaveLength(3);
      expect(seenContexts[0].resolved_route_header).toBe('Resolved route: mode=ai-council; target_agent=@ai-council; execution=multi_topic_session_round; state_source=ai-council/session-state.jsonl; depth_aware=true; do_not_switch_mode=true');
      expect(seenContexts[0].route_fields).toMatchObject({
        mode: 'ai-council',
        target_agent: '@ai-council',
        execution: 'multi_topic_session_round',
        depth_aware: true,
        do_not_switch_mode: true,
      });
    });
  });
});
