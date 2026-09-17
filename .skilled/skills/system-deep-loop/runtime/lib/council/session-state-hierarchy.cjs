// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Council Session State Hierarchy                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SESSION_STATUS = 'in_progress';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a normalized topic state record for a council session.
 *
 * Derives topic_id and topic_slug from the provided input, assigns
 * defaults for max_rounds_per_topic and current_round, and captures
 * any prior finding fingerprints for cross-topic context.
 *
 * @param {Object} [input={}] - Raw topic state input.
 * @param {number} [input.index=1] - One-based topic index.
 * @param {string} [input.topicSlug] - Human-readable topic slug.
 * @param {string} [input.title] - Fallback title if topicSlug is
 *   absent.
 * @param {string} [input.topicId] - Explicit topic identifier
 *   (auto-generated if omitted).
 * @param {number} [input.maxRoundsPerTopic=3] - Maximum deliberation
 *   rounds for this topic.
 * @param {number} [input.currentRound=1] - Current round index.
 * @param {Array<string>} [input.priorFingerprints] - Prior finding
 *   fingerprints.
 * @param {string} [input.status] - Topic status (default
 *   'in_progress').
 * @returns {Object} Normalized topic state record.
 */
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

/**
 * Create a normalized round state record within a council session.
 *
 * Captures the round identifier, CLI execution boundary, seat
 * configuration, adjudicator verdict, and verdict stability delta
 * from the previous round.
 *
 * @param {Object} [input={}] - Raw round state input.
 * @param {number} [input.roundNumber=1] - One-based round number.
 * @param {string} [input.roundId] - Explicit round identifier
 *   (auto-generated if omitted).
 * @param {string} [input.cliBoundary='in-cli'] - CLI execution
 *   boundary label.
 * @param {Array} [input.seats] - Seat descriptors for this round.
 * @param {Object} [input.adjudicatorVerdict] - Adjudicator verdict
 *   for this round.
 * @param {number} [input.verdictDeltaFromPrevious] - Verdict delta
 *   from the previous round.
 * @param {string} [input.status] - Round status (default
 *   'in_progress').
 * @returns {Object} Normalized round state record.
 */
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

/**
 * Create a complete council session state hierarchy.
 *
 * Builds a session-level envelope with a unique session identifier,
 * spec-folder binding, topic array, and current topic/round pointers.
 * Falls back to a single default topic when none are provided.
 *
 * @param {Object} [input={}] - Raw session state input.
 * @param {string} [input.sessionId] - Session identifier
 *   (auto-generated if omitted).
 * @param {string} [input.specFolder] - Spec-folder path this session
 *   belongs to.
 * @param {number} [input.maxTopicsPerSession=5] - Maximum topics in
 *   this session.
 * @param {number} [input.currentTopic=1] - One-based current topic
 *   index.
 * @param {Array<Object>} [input.topics] - Array of raw topic states.
 * @param {Object} [input.round] - Raw round state for the current
 *   round.
 * @param {string} [input.status] - Session status (default
 *   'in_progress').
 * @returns {Object} Complete session state hierarchy with session,
 *   topics, and current pointers.
 */
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

/**
 * Validate a council session state hierarchy object.
 *
 * Checks that the required structure (session, topics array, current
 * pointer) is present, that session_id is non-empty, that guard values
 * are positive integers, and that every topic has the required fields.
 *
 * @param {Object} state - Session state hierarchy to validate.
 * @returns {Object} The validated state (identity return for chaining).
 * @throws {TypeError} If the state structure or any required field is
 *   invalid.
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  createRoundState,
  createSessionState,
  createTopicState,
  validateSessionStateHierarchy,
};
