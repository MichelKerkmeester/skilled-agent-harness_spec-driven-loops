import { describe, expect, it } from 'vitest';

import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { createSessionState, createRoundState } = require('../../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs') as {
  createSessionState: (input?: Record<string, unknown>) => Record<string, unknown>;
  createRoundState: (input?: Record<string, unknown>) => Record<string, unknown>;
};
const { readRoundStateRecords } = require('../../../deep-loop-runtime/lib/council/round-state-jsonl.cjs') as {
  readRoundStateRecords: (path: string) => Record<string, unknown>[];
};
const { orchestrateSession, sessionStatePath } = require('../orchestrate-session.cjs') as {
  orchestrateSession: (options: Record<string, unknown>) => Promise<{
    session_id: string;
    topics_completed: number;
    topic_results: Array<Record<string, unknown>>;
    skipped_topic_ids: string[];
    stop_reason: string;
    session_state_path: string;
  }>;
  sessionStatePath: (packetSpecFolder: string) => string;
};
const { loadRegistry } = require('../lib/findings-registry.cjs') as {
  loadRegistry: (packetSpecFolder: string) => Array<Record<string, unknown>>;
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
function withTempPacket(run: (packetSpecFolder: string) => Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-orchestrate-session-'));
  return run(tempDir).finally(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });
}

/**
 * Creates a session state object for testing with default topics and round configuration.
 */
function sessionState(packetSpecFolder: string): Record<string, unknown> {
  return createSessionState({
    sessionId: 'council-session-test',
    specFolder: packetSpecFolder,
    maxTopicsPerSession: 5,
    topics: [
      { title: 'Runtime Boundary' },
      { title: 'Convergence Semantics' },
      { title: 'Cost Guards' },
    ],
    round: createRoundState({
      roundNumber: 1,
      seats: ['seat-001', 'seat-002', 'seat-003'],
    }),
  });
}

describe('deep-ai-council session orchestration', () => {
  it('completes all topics when under max_topics_per_session', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const result = await orchestrateSession({
        session_state: sessionState(packetSpecFolder),
        executor_config: {
          cost_guards: { max_topics_per_session: 5 },
          orchestrateTopic: async ({ topic_id }: { topic_id: string }) => ({
            topic_id,
            rounds_completed: 1,
            final_verdict: { recommended_option: `plan-${topic_id}`, confidence: 0.8 },
            stability_score: 0.5,
            stop_reason: 'max_rounds_per_topic',
          }),
        },
      });

      expect(result).toMatchObject({
        session_id: 'council-session-test',
        topics_completed: 3,
        skipped_topic_ids: [],
        stop_reason: 'topics_exhausted',
      });

      expect(result.session_state_path).toBe(sessionStatePath(packetSpecFolder));
      const records = readRoundStateRecords(result.session_state_path);
      expect(records.map((record) => record.topic_id)).toEqual([
        'topic-001-runtime-boundary',
        'topic-002-convergence-semantics',
        'topic-003-cost-guards',
      ]);

      const registry = loadRegistry(packetSpecFolder);
      expect(registry.map((finding) => finding.finding_type)).toEqual([
        'topic-final-verdict',
        'topic-final-verdict',
        'topic-final-verdict',
        'session-synthesis',
      ]);
    });
  });

  it('stops after topic 2 when session saturation trips and skips topic 3', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const scores = new Map([
        ['topic-001-runtime-boundary', 0.5],
        ['topic-002-convergence-semantics', 0.1],
      ]);

      const result = await orchestrateSession({
        session_state: sessionState(packetSpecFolder),
        executor_config: {
          cost_guards: { max_topics_per_session: 5, saturation_threshold: 0.2 },
          orchestrateTopic: async ({ topic_id }: { topic_id: string }) => ({
            topic_id,
            rounds_completed: 1,
            final_verdict: { recommended_option: `plan-${topic_id}`, confidence: 0.8 },
            stability_score: scores.get(topic_id),
            stop_reason: 'saturation_threshold',
          }),
        },
      });

      expect(result.topics_completed).toBe(2);
      expect(result.stop_reason).toBe('session_saturation_threshold');
      expect(result.skipped_topic_ids).toEqual(['topic-003-cost-guards']);

      const records = readRoundStateRecords(result.session_state_path);
      expect(records).toHaveLength(2);
      expect(records[1]).toMatchObject({
        type: 'topic_completed',
        topic_id: 'topic-002-convergence-semantics',
        stability_score: 0.1,
      });
    });
  });

  it('injects registry priors into topic briefs after the first topic', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const seenBriefs: Array<Record<string, unknown>> = [];

      await orchestrateSession({
        session_state: sessionState(packetSpecFolder),
        executor_config: {
          cost_guards: { max_topics_per_session: 5 },
          orchestrateTopic: async ({ topic_id, executor_config }: { topic_id: string; executor_config: Record<string, unknown> }) => {
            seenBriefs.push((executor_config.topic_brief || {}) as Record<string, unknown>);
            return {
              topic_id,
              rounds_completed: 1,
              final_verdict: { recommended_option: `plan-${topic_id}`, confidence: 0.8 },
              stability_score: 0.5,
              stop_reason: 'max_rounds_per_topic',
            };
          },
        },
      });

      expect(seenBriefs[0].prior_findings).toBeUndefined();
      expect(seenBriefs[1].prior_fingerprints).toEqual([
        'council:runtime-boundary:topic-topic-001-runtime-boundary-final-verdict-plan-topic-001-runtime-boundary',
      ]);
      expect((seenBriefs[2].prior_findings as Array<Record<string, unknown>>).map((prior) => prior.topic_id).sort()).toEqual([
        'topic-001-runtime-boundary',
        'topic-002-convergence-semantics',
      ]);
    });
  });
});
