// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ orchestrate-topic                                                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Topic-local council round loop using deep-loop-runtime council primitives║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { dispatchCouncilSeats } = require('../../deep-loop-runtime/lib/council/multi-seat-dispatch.cjs');
const { appendRoundStateRecord } = require('../../deep-loop-runtime/lib/council/round-state-jsonl.cjs');
const { scoreVerdictDelta } = require('../../deep-loop-runtime/lib/council/adjudicator-verdict-scoring.cjs');
const { normalizeCostGuards } = require('../../deep-loop-runtime/lib/council/cost-guards.cjs');
const { validateSessionStateHierarchy } = require('../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TOPIC_ID = 'topic-001-topic';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function pad3(value) {
  return String(value).padStart(3, '0');
}

function normalizeTopicId(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('topic_id must be a non-empty string');
  }
  return value.trim();
}

function normalizeOptions(input = {}) {
  if (!isRecord(input)) {
    throw new TypeError('orchestrateTopic options must be an object');
  }
  const topicId = normalizeTopicId(input.topic_id || input.topicId || DEFAULT_TOPIC_ID);
  const sessionState = input.session_state || input.sessionState;
  const executorConfig = input.executor_config || input.executorConfig || {};
  if (!isRecord(sessionState)) {
    throw new TypeError('session_state must be an object');
  }
  if (!isRecord(executorConfig)) {
    throw new TypeError('executor_config must be an object');
  }
  validateSessionStateHierarchy(sessionState);
  return { topicId, sessionState, executorConfig };
}

function findTopic(sessionState, topicId) {
  return sessionState.topics.find((topic) => topic.topic_id === topicId)
    || sessionState.current.topic
    || { topic_id: topicId, title: topicId };
}

function resolvePacketSpecFolder(sessionState, executorConfig) {
  const configured = executorConfig.packet_spec_folder
    || executorConfig.packetSpecFolder
    || sessionState.session.spec_folder;
  if (typeof configured !== 'string' || configured.trim() === '') {
    throw new TypeError('packet spec folder is required on executor_config or session_state.session.spec_folder');
  }
  return path.resolve(configured);
}

function roundIdFor(roundNumber) {
  return `round-${pad3(roundNumber)}`;
}

function roundStatePath(packetSpecFolder, topicId, roundId) {
  return path.join(packetSpecFolder, 'ai-council', 'topics', topicId, 'rounds', roundId, 'round-state.jsonl');
}

function normalizeGuards(sessionState, topic, executorConfig) {
  return normalizeCostGuards({
    max_rounds_per_topic: topic.max_rounds_per_topic || sessionState.session.max_rounds_per_topic,
    max_topics_per_session: sessionState.session.max_topics_per_session,
    ...(executorConfig.cost_guards || executorConfig.costGuards || {}),
  });
}

function normalizeSeats(topic, sessionState, executorConfig, guards) {
  const seats = executorConfig.seats
    || topic.seats
    || sessionState.current.round.seats;
  if (Array.isArray(seats) && seats.length > 0) return seats;
  return Array.from({ length: guards.seats_per_round }, (_unused, index) => ({
    id: `seat-${pad3(index + 1)}`,
  }));
}

function topicBriefFor(topic, sessionState, executorConfig) {
  return executorConfig.topic_brief
    || executorConfig.topicBrief
    || topic.topic_brief
    || topic.brief
    || {
      topic_id: topic.topic_id,
      title: topic.title || topic.topic_slug || topic.topic_id,
      prior_fingerprints: topic.prior_fingerprints || [],
      session_id: sessionState.session.session_id,
    };
}

function collectSeatVerdicts(dispatchResult) {
  return dispatchResult.results
    .filter((result) => result.status === 'fulfilled' && isRecord(result.output))
    .map((result) => ({
      seat_id: result.seat_id,
      verdict: result.output.adjudicator_verdict || result.output.verdict || result.output,
    }))
    .filter((entry) => isRecord(entry.verdict));
}

function mergeVerdicts(verdictEntries) {
  if (!verdictEntries.length) return null;
  const byOption = new Map();
  for (const entry of verdictEntries) {
    const option = String(entry.verdict.recommended_option || 'undecided');
    byOption.set(option, (byOption.get(option) || 0) + 1);
  }
  const recommendedOption = [...byOption.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0][0];
  const matching = verdictEntries
    .map((entry) => entry.verdict)
    .filter((verdict) => String(verdict.recommended_option || 'undecided') === recommendedOption);
  const confidenceValues = matching
    .map((verdict) => Number(verdict.confidence))
    .filter((value) => Number.isFinite(value));
  const confidence = confidenceValues.length
    ? confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length
    : 0;

  return {
    recommended_option: recommendedOption,
    confidence,
    blocking_disagreements: [...new Set(matching.flatMap((verdict) => verdict.blocking_disagreements || []))],
    material_risks: [...new Set(matching.flatMap((verdict) => verdict.material_risks || []))],
    decision_axes: matching.reduce((axes, verdict) => ({ ...axes, ...(verdict.decision_axes || {}) }), {}),
  };
}

async function adjudicateRound(input) {
  const adjudicator = input.executorConfig.adjudicateRound || input.executorConfig.adjudicator;
  const seatVerdicts = collectSeatVerdicts(input.dispatchResult);
  if (typeof adjudicator === 'function') {
    const verdict = await adjudicator({
      topic_id: input.topic.topic_id,
      topic: input.topic,
      topic_brief: input.topicBrief,
      round_id: input.roundId,
      round_number: input.roundNumber,
      dispatch_result: input.dispatchResult,
      seat_verdicts: seatVerdicts,
      previous_verdict: input.previousVerdict,
      session_state: input.sessionState,
    });
    return verdict || null;
  }
  return mergeVerdicts(seatVerdicts);
}

function scoreRound(previousVerdict, currentVerdict, saturationThreshold) {
  if (!isRecord(currentVerdict)) return null;
  if (previousVerdict) {
    return scoreVerdictDelta(previousVerdict, currentVerdict, { saturationThreshold });
  }
  const firstRoundScore = currentVerdict.stability_score ?? currentVerdict.verdict_delta_from_previous;
  if (typeof firstRoundScore === 'number' && Number.isFinite(firstRoundScore)) {
    return {
      verdict_delta: Number(firstRoundScore.toFixed(6)),
      stable: firstRoundScore <= saturationThreshold,
      saturation_threshold: saturationThreshold,
      components: {},
      weights: {},
    };
  }
  return null;
}

function stopReasonFor({ dispatchResult, verdict, score, roundNumber, guards }) {
  if (dispatchResult.summary.all_failed && !verdict) return 'all_seats_failed';
  if (score && score.stable) return 'saturation_threshold';
  if (roundNumber >= guards.max_rounds_per_topic) return 'max_rounds_per_topic';
  return null;
}

function appendRoundCompletion(statePath, payload) {
  return appendRoundStateRecord(statePath, {
    type: 'round_completed',
    ...payload,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one topic through bounded council rounds until stable or maxed out.
 *
 * @param {Object} options - Orchestration options
 * @param {string} options.topic_id - Topic id to run
 * @param {Object} options.session_state - Session -> topic -> round state
 * @param {Object} options.executor_config - Seat dispatch and adjudicator config
 * @returns {Promise<Object>} Topic completion summary
 */
async function orchestrateTopic(options = {}) {
  const { topicId, sessionState, executorConfig } = normalizeOptions(options);
  const topic = findTopic(sessionState, topicId);
  const packetSpecFolder = resolvePacketSpecFolder(sessionState, executorConfig);
  const guards = normalizeGuards(sessionState, topic, executorConfig);
  const seats = normalizeSeats(topic, sessionState, executorConfig, guards);
  const topicBrief = topicBriefFor(topic, sessionState, executorConfig);
  const dispatchSeat = executorConfig.dispatchSeat || executorConfig.dispatch_seat;
  if (typeof dispatchSeat !== 'function') {
    throw new TypeError('executor_config.dispatchSeat must be a function');
  }

  const roundSummaries = [];
  const verdicts = [];
  let finalVerdict = null;
  let finalScore = null;
  let stopReason = null;

  for (let roundNumber = 1; roundNumber <= guards.max_rounds_per_topic; roundNumber += 1) {
    const roundId = roundIdFor(roundNumber);
    const previousVerdict = verdicts.length ? verdicts[verdicts.length - 1] : null;
    const dispatchResult = await dispatchCouncilSeats({
      roundId,
      seats,
      dispatchSeat,
      context: {
        topic_id: topicId,
        topic,
        topic_brief: topicBrief,
        round_number: roundNumber,
        session_state: sessionState,
        executor_config: executorConfig,
      },
    });
    const adjudicatorVerdict = await adjudicateRound({
      topic,
      topicBrief,
      roundId,
      roundNumber,
      dispatchResult,
      previousVerdict,
      sessionState,
      executorConfig,
    });
    const score = scoreRound(previousVerdict, adjudicatorVerdict, guards.saturation_threshold);
    const currentStopReason = stopReasonFor({
      dispatchResult,
      verdict: adjudicatorVerdict,
      score,
      roundNumber,
      guards,
    });

    if (adjudicatorVerdict) {
      verdicts.push(adjudicatorVerdict);
      finalVerdict = adjudicatorVerdict;
    }
    finalScore = score;
    stopReason = currentStopReason;

    const statePath = roundStatePath(packetSpecFolder, topicId, roundId);
    appendRoundCompletion(statePath, {
      topic_id: topicId,
      round_id: roundId,
      round_number: roundNumber,
      seats: seats.map((seat) => (typeof seat === 'string' ? seat : seat.id)),
      dispatch_summary: dispatchResult.summary,
      adjudicator_verdict: adjudicatorVerdict,
      verdict_delta_from_previous: score ? score.verdict_delta : null,
      verdict_stable: score ? score.stable : false,
      stop_reason: currentStopReason,
    });

    roundSummaries.push({
      round_id: roundId,
      dispatch_summary: dispatchResult.summary,
      adjudicator_verdict: adjudicatorVerdict,
      verdict_delta_from_previous: score ? score.verdict_delta : null,
      verdict_stable: score ? score.stable : false,
      stop_reason: currentStopReason,
      state_path: statePath,
    });

    if (currentStopReason) break;
  }

  return {
    topic_id: topicId,
    rounds_completed: roundSummaries.length,
    final_verdict: finalVerdict,
    stability_score: finalScore ? finalScore.verdict_delta : null,
    stop_reason: stopReason || 'max_rounds_per_topic',
    rounds: roundSummaries,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  orchestrateTopic,
  roundIdFor,
  roundStatePath,
};
