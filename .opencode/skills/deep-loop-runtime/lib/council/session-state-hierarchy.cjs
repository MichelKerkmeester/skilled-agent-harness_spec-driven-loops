// MODULE: Council Session State Hierarchy
'use strict';

const DEFAULT_SESSION_STATUS = 'in_progress';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function pad3(value) {
  return String(value).padStart(3, '0');
}

function slugify(value) {
  return String(value || 'topic')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'topic';
}

function createTopicState(input = {}) {
  const index = Number.isInteger(input.index) && input.index > 0 ? input.index : 1;
  const topicSlug = slugify(input.topicSlug || input.title || `topic-${pad3(index)}`);
  return {
    topic_id: input.topicId || `topic-${pad3(index)}-${topicSlug}`,
    topic_slug: topicSlug,
    title: input.title || topicSlug,
    max_rounds_per_topic: input.maxRoundsPerTopic || 3,
    current_round: input.currentRound || 1,
    prior_fingerprints: Array.isArray(input.priorFingerprints) ? input.priorFingerprints : [],
    status: input.status || DEFAULT_SESSION_STATUS,
  };
}

function createRoundState(input = {}) {
  const roundNumber = Number.isInteger(input.roundNumber) && input.roundNumber > 0 ? input.roundNumber : 1;
  return {
    round_id: input.roundId || `round-${pad3(roundNumber)}`,
    cli_boundary: input.cliBoundary || 'in-cli',
    seats: Array.isArray(input.seats) ? input.seats : [],
    adjudicator_verdict: input.adjudicatorVerdict || null,
    verdict_delta_from_previous: input.verdictDeltaFromPrevious ?? null,
    status: input.status || DEFAULT_SESSION_STATUS,
  };
}

function createSessionState(input = {}) {
  const topics = Array.isArray(input.topics) && input.topics.length > 0
    ? input.topics.map((topic, index) => createTopicState({ ...topic, index: index + 1 }))
    : [createTopicState({ index: 1, title: 'initial-topic' })];
  return {
    session: {
      session_id: input.sessionId || `council-session-${new Date().toISOString().replace(/[:.]/g, '-')}`,
      spec_folder: input.specFolder || '',
      max_topics_per_session: input.maxTopicsPerSession || 5,
      current_topic: input.currentTopic || 1,
      status: input.status || DEFAULT_SESSION_STATUS,
    },
    topics,
    current: {
      topic: topics[(input.currentTopic || 1) - 1] || topics[0],
      round: createRoundState(input.round || {}),
    },
  };
}

function validateSessionStateHierarchy(state) {
  if (!isRecord(state) || !isRecord(state.session) || !Array.isArray(state.topics) || !isRecord(state.current)) {
    throw new TypeError('state must include session, topics[], and current');
  }
  if (typeof state.session.session_id !== 'string' || state.session.session_id.trim() === '') {
    throw new TypeError('session.session_id must be a non-empty string');
  }
  if (!Number.isInteger(state.session.max_topics_per_session) || state.session.max_topics_per_session < 1) {
    throw new TypeError('session.max_topics_per_session must be a positive integer');
  }
  if (state.topics.length === 0) {
    throw new TypeError('topics must include at least one topic');
  }
  for (const topic of state.topics) {
    if (!isRecord(topic) || typeof topic.topic_id !== 'string' || typeof topic.topic_slug !== 'string') {
      throw new TypeError('each topic must include topic_id and topic_slug');
    }
    if (!Number.isInteger(topic.max_rounds_per_topic) || topic.max_rounds_per_topic < 1) {
      throw new TypeError('topic.max_rounds_per_topic must be a positive integer');
    }
  }
  if (!isRecord(state.current.topic) || !isRecord(state.current.round)) {
    throw new TypeError('current must include topic and round objects');
  }
  if (typeof state.current.round.round_id !== 'string' || !Array.isArray(state.current.round.seats)) {
    throw new TypeError('current.round must include round_id and seats[]');
  }
  return state;
}

module.exports = {
  createRoundState,
  createSessionState,
  createTopicState,
  validateSessionStateHierarchy,
};
