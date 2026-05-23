import { describe, expect, it } from 'vitest';

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { createSessionState, createRoundState } = require('../../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs') as {
  createSessionState: (input?: Record<string, unknown>) => Record<string, unknown>;
  createRoundState: (input?: Record<string, unknown>) => Record<string, unknown>;
};
const { computeCouncilCostUpperBound } = require('../../../deep-loop-runtime/lib/council/cost-guards.cjs') as {
  computeCouncilCostUpperBound: (input?: Record<string, unknown>) => Record<string, number>;
};
const { readRoundStateRecords } = require('../../../deep-loop-runtime/lib/council/round-state-jsonl.cjs') as {
  readRoundStateRecords: (path: string) => Record<string, unknown>[];
};
const { orchestrateSession } = require('../orchestrate-session.cjs') as {
  orchestrateSession: (options: Record<string, unknown>) => Promise<{
    session_id: string;
    topics_completed: number;
    topic_results: Array<{
      topic_id: string;
      rounds_completed: number;
      final_verdict: Record<string, unknown> | null;
      stability_score: number | null;
      stop_reason: string;
      rounds: Array<Record<string, unknown>>;
    }>;
    skipped_topic_ids: string[];
    stop_reason: string;
    session_state_path: string;
  }>;
};
const { loadRegistry, registryPath } = require('../lib/findings-registry.cjs') as {
  loadRegistry: (packetSpecFolder: string) => Array<Record<string, unknown>>;
  registryPath: (packetSpecFolder: string) => string;
};

const costGuards = {
  max_rounds_per_topic: 3,
  max_topics_per_session: 2,
  saturation_threshold: 0.2,
  seats_per_round: 3,
};

interface DispatchCapture {
  readonly topic_id: string;
  readonly round_number: number;
  readonly seat_id: string;
  readonly topic_brief: Record<string, unknown>;
}

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
function withTempPacket(run: (packetSpecFolder: string) => Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-deep-mode-e2e-'));
  return run(tempDir).finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
}

/**
 * Creates a session state object for testing with default topics and round configuration.
 */
function sessionState(packetSpecFolder: string): Record<string, unknown> {
  return createSessionState({
    sessionId: 'council-session-e2e',
    specFolder: packetSpecFolder,
    maxTopicsPerSession: costGuards.max_topics_per_session,
    topics: [
      { title: 'Runtime Boundary', maxRoundsPerTopic: costGuards.max_rounds_per_topic },
      { title: 'Convergence Semantics', maxRoundsPerTopic: costGuards.max_rounds_per_topic },
    ],
    round: createRoundState({
      roundNumber: 1,
      seats: ['seat-001', 'seat-002', 'seat-003'],
    }),
  });
}

/**
 * Creates a verdict object for testing with the given option, confidence, and overrides.
 */
function verdictFor(
  recommendedOption: string,
  confidence: number,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    recommended_option: recommendedOption,
    confidence,
    blocking_disagreements: [],
    material_risks: ['operator cost'],
    decision_axes: {
      correctness: recommendedOption,
      maintainability: recommendedOption,
      cost: recommendedOption,
    },
    ...overrides,
  };
}

/**
 * Reads and parses a JSONL file into an array of records.
 */
function validJsonlRecords(filePath: string): Array<Record<string, unknown>> {
  const lines = readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.map((line) => JSON.parse(line) as Record<string, unknown>);
}

/**
 * Asserts that the session state JSONL file contains the expected number of topic-completed events.
 */
function assertSessionStateJsonl(filePath: string, expectedTopicsCompleted: number): void {
  const records = validJsonlRecords(filePath);
  expect(records).toHaveLength(expectedTopicsCompleted);
  expect(records.every((record) => record.schema_version === '1.0')).toBe(true);
  expect(new Set(records.map((record) => record.event_id)).size).toBe(records.length);
  expect(records.every((record) => record.type === 'topic_completed')).toBe(true);
}

/**
 * Asserts that the findings registry contains final verdicts for both expected topics.
 */
function assertRegistryHasBothTopicVerdicts(packetSpecFolder: string): void {
  expect(existsSync(registryPath(packetSpecFolder))).toBe(true);
  const topicVerdicts = loadRegistry(packetSpecFolder)
    .filter((finding) => finding.finding_type === 'topic-final-verdict');
  expect(topicVerdicts.map((finding) => finding.topic_id)).toEqual([
    'topic-001-runtime-boundary',
    'topic-002-convergence-semantics',
  ]);
}

/**
 * Asserts that the orchestration result respects all cost guard limits.
 */
function assertCostGuardsRespected(
  result: Awaited<ReturnType<typeof orchestrateSession>>,
  captures: readonly DispatchCapture[],
): void {
  const upperBound = computeCouncilCostUpperBound(costGuards);

  expect(result.topics_completed).toBeLessThanOrEqual(costGuards.max_topics_per_session);
  expect(captures).toHaveLength(result.topic_results.reduce(
    (count, topicResult) => count + topicResult.rounds_completed * costGuards.seats_per_round,
    0,
  ));
  expect(captures.length).toBeLessThanOrEqual(upperBound.max_seat_outputs);
  for (const topicResult of result.topic_results) {
    expect(topicResult.rounds_completed).toBeGreaterThanOrEqual(1);
    expect(topicResult.rounds_completed).toBeLessThanOrEqual(costGuards.max_rounds_per_topic);
  }
}

describe('deep-ai-council deep mode e2e orchestration', () => {
  it('happy path completes both topics, writes registry verdicts, and injects topic 2 priors', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const captures: DispatchCapture[] = [];

      const result = await orchestrateSession({
        session_state: sessionState(packetSpecFolder),
        executor_config: {
          deliberation_topic: 'test',
          cost_guards: costGuards,
          min_topics_before_session_saturation: 3,
          dispatchSeat: async (seat: { id: string }, meta: { context: Record<string, unknown> }) => {
            const topicId = String(meta.context.topic_id);
            const roundNumber = Number(meta.context.round_number);
            captures.push({
              topic_id: topicId,
              round_number: roundNumber,
              seat_id: seat.id,
              topic_brief: meta.context.topic_brief as Record<string, unknown>,
            });
            return {
              verdict: verdictFor(`plan-${topicId}`, roundNumber === 1 ? 0.82 : 0.81),
            };
          },
        },
      });

      expect(result).toMatchObject({
        session_id: 'council-session-e2e',
        topics_completed: 2,
        skipped_topic_ids: [],
        stop_reason: 'topics_exhausted',
      });
      expect(result.topic_results.map((topic) => topic.rounds_completed)).toEqual([2, 2]);
      expect(result.topic_results.every((topic) => topic.stop_reason === 'saturation_threshold')).toBe(true);

      assertRegistryHasBothTopicVerdicts(packetSpecFolder);
      const topic2FirstRound = captures.find((capture) => capture.topic_id === 'topic-002-convergence-semantics');
      expect(topic2FirstRound?.topic_brief.prior_fingerprints).toEqual([
        'council:runtime-boundary:topic-topic-001-runtime-boundary-final-verdict-plan-topic-001-runtime-boundary',
      ]);
      expect(topic2FirstRound?.topic_brief.prior_findings).toEqual([
        expect.objectContaining({
          topic_id: 'topic-001-runtime-boundary',
          finding_type: 'topic-final-verdict',
        }),
      ]);

      assertCostGuardsRespected(result, captures);
      assertSessionStateJsonl(result.session_state_path, 2);
      for (const topicResult of result.topic_results) {
        expect(readRoundStateRecords(String(topicResult.rounds.at(-1)?.state_path))).toHaveLength(1);
      }
    });
  });

  it('max_rounds_hit stops each topic at the configured round cap', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const captures: DispatchCapture[] = [];
      const divergentVerdicts = [
        verdictFor('extend-deep-loop-runtime', 0.90),
        verdictFor('create-council-runtime', 0.42, {
          blocking_disagreements: ['runtime ownership unresolved'],
          material_risks: ['package duplication'],
          decision_axes: { correctness: 'split', maintainability: 'split', cost: 'split' },
        }),
        verdictFor('hybrid-adapter', 0.88, {
          blocking_disagreements: ['operator cost unresolved'],
          material_risks: ['operator cost', 'threshold leakage'],
          decision_axes: { correctness: 'hybrid', maintainability: 'hybrid', cost: 'hybrid' },
        }),
      ];

      const result = await orchestrateSession({
        session_state: sessionState(packetSpecFolder),
        executor_config: {
          deliberation_topic: 'test',
          cost_guards: costGuards,
          min_topics_before_session_saturation: 3,
          dispatchSeat: async (seat: { id: string }, meta: { context: Record<string, unknown> }) => {
            const roundNumber = Number(meta.context.round_number);
            captures.push({
              topic_id: String(meta.context.topic_id),
              round_number: roundNumber,
              seat_id: seat.id,
              topic_brief: meta.context.topic_brief as Record<string, unknown>,
            });
            return { verdict: divergentVerdicts[roundNumber - 1] };
          },
        },
      });

      expect(result.topics_completed).toBe(2);
      expect(result.stop_reason).toBe('topics_exhausted');
      expect(result.topic_results.map((topic) => topic.rounds_completed)).toEqual([3, 3]);
      expect(result.topic_results.every((topic) => topic.stop_reason === 'max_rounds_per_topic')).toBe(true);
      expect(result.topic_results.every((topic) => Number(topic.stability_score) > costGuards.saturation_threshold)).toBe(true);

      assertRegistryHasBothTopicVerdicts(packetSpecFolder);
      assertCostGuardsRespected(result, captures);
      assertSessionStateJsonl(result.session_state_path, 2);
    });
  });

  it('saturation_hit completes the required topics and records a session saturation stop', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const captures: DispatchCapture[] = [];

      const result = await orchestrateSession({
        session_state: sessionState(packetSpecFolder),
        executor_config: {
          deliberation_topic: 'test',
          cost_guards: costGuards,
          min_topics_before_session_saturation: 2,
          adjudicateRound: async ({ topic_id }: { topic_id: string }) => verdictFor(`stable-${topic_id}`, 0.83, {
            stability_score: 0.1,
          }),
          dispatchSeat: async (seat: { id: string }, meta: { context: Record<string, unknown> }) => {
            captures.push({
              topic_id: String(meta.context.topic_id),
              round_number: Number(meta.context.round_number),
              seat_id: seat.id,
              topic_brief: meta.context.topic_brief as Record<string, unknown>,
            });
            return {
              verdict: verdictFor(`stable-${String(meta.context.topic_id)}`, 0.83),
            };
          },
        },
      });

      expect(result.topics_completed).toBe(2);
      expect(result.skipped_topic_ids).toEqual([]);
      expect(result.stop_reason).toBe('session_saturation_threshold');
      expect(result.topic_results.map((topic) => topic.rounds_completed)).toEqual([1, 1]);
      expect(result.topic_results.every((topic) => topic.stop_reason === 'saturation_threshold')).toBe(true);

      assertRegistryHasBothTopicVerdicts(packetSpecFolder);
      assertCostGuardsRespected(result, captures);
      assertSessionStateJsonl(result.session_state_path, 2);
    });
  });
});
