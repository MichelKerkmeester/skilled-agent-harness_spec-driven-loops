import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  createRoundState,
  createSessionState,
  createTopicState,
  validateSessionStateHierarchy,
} = require('../../lib/council/session-state-hierarchy.cjs') as {
  createRoundState: (input?: Record<string, unknown>) => Record<string, unknown>;
  createSessionState: (input?: Record<string, unknown>) => Record<string, unknown>;
  createTopicState: (input?: Record<string, unknown>) => Record<string, unknown>;
  validateSessionStateHierarchy: (state: Record<string, unknown>) => Record<string, unknown>;
};

describe('council session-state hierarchy', () => {
  it('creates and validates the session -> topic -> round shape from ADR-002', () => {
    const state = createSessionState({
      sessionId: 'council-session-test',
      specFolder: '.opencode/specs/129/002',
      topics: [
        { title: 'Runtime Boundary', priorFingerprints: [] },
        { title: 'Convergence Semantics', priorFingerprints: ['council:runtime-boundary:extend'] },
      ],
      round: createRoundState({
        roundNumber: 1,
        seats: ['seat-001', 'seat-002', 'seat-003'],
      }),
    });

    expect(validateSessionStateHierarchy(state)).toBe(state);
    expect(state).toMatchObject({
      session: {
        session_id: 'council-session-test',
        max_topics_per_session: 5,
        current_topic: 1,
        status: 'in_progress',
      },
      topics: [
        {
          topic_id: 'topic-001-runtime-boundary',
          topic_slug: 'runtime-boundary',
          current_round: 1,
        },
        {
          topic_id: 'topic-002-convergence-semantics',
          prior_fingerprints: ['council:runtime-boundary:extend'],
        },
      ],
      current: {
        round: {
          round_id: 'round-001',
          cli_boundary: 'in-cli',
          seats: ['seat-001', 'seat-002', 'seat-003'],
          adjudicator_verdict: null,
          verdict_delta_from_previous: null,
        },
      },
    });
  });

  it('creates individual topic and round nodes with stable ids', () => {
    expect(createTopicState({ index: 4, title: 'Cost Guards' })).toMatchObject({
      topic_id: 'topic-004-cost-guards',
      topic_slug: 'cost-guards',
    });
    expect(createRoundState({ roundNumber: 3 })).toMatchObject({ round_id: 'round-003' });
  });

  it('rejects malformed hierarchy objects', () => {
    expect(() => validateSessionStateHierarchy({ session: {}, topics: [], current: {} })).toThrow(TypeError);
  });
});
