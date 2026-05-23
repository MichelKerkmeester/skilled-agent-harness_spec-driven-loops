// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ orchestrate-session                                                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Session-level council topic orchestration with cost guard checks         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { appendRoundStateRecord } = require('../../deep-loop-runtime/lib/council/round-state-jsonl.cjs');
const { evaluateCouncilCostGuards, normalizeCostGuards } = require('../../deep-loop-runtime/lib/council/cost-guards.cjs');
const { validateSessionStateHierarchy } = require('../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs');
const { orchestrateTopic } = require('./orchestrate-topic.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeOptions(input = {}) {
  if (!isRecord(input)) {
    throw new TypeError('orchestrateSession options must be an object');
  }
  const sessionState = input.session_state || input.sessionState;
  const executorConfig = input.executor_config || input.executorConfig || {};
  if (!isRecord(sessionState)) {
    throw new TypeError('session_state must be an object');
  }
  if (!isRecord(executorConfig)) {
    throw new TypeError('executor_config must be an object');
  }
  validateSessionStateHierarchy(sessionState);
  return { sessionState, executorConfig };
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

function sessionStatePath(packetSpecFolder) {
  return path.join(packetSpecFolder, 'ai-council', 'session-state.jsonl');
}

function normalizeGuards(sessionState, executorConfig) {
  return normalizeCostGuards({
    max_topics_per_session: sessionState.session.max_topics_per_session,
    ...(executorConfig.cost_guards || executorConfig.costGuards || {}),
  });
}

function appendTopicCompletion(statePath, payload) {
  return appendRoundStateRecord(statePath, {
    type: 'topic_completed',
    ...payload,
  });
}

function sessionSaturationDecision(topicResult, completedCount, guards, executorConfig) {
  const minimumTopics = Number.isInteger(executorConfig.min_topics_before_session_saturation)
    ? executorConfig.min_topics_before_session_saturation
    : Number.isInteger(executorConfig.minTopicsBeforeSessionSaturation)
      ? executorConfig.minTopicsBeforeSessionSaturation
      : 2;
  if (completedCount < minimumTopics || typeof topicResult.stability_score !== 'number') {
    return { continue_allowed: true, stop_reasons: [], upper_bound: null };
  }
  return evaluateCouncilCostGuards({
    verdictDelta: topicResult.stability_score,
    guards,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a council session across topics until all topics complete or guards stop.
 *
 * @param {Object} options - Orchestration options
 * @param {Object} options.session_state - Session -> topic -> round state
 * @param {Object} options.executor_config - Topic runner and guard config
 * @returns {Promise<Object>} Session completion summary
 */
async function orchestrateSession(options = {}) {
  const { sessionState, executorConfig } = normalizeOptions(options);
  const packetSpecFolder = resolvePacketSpecFolder(sessionState, executorConfig);
  const statePath = sessionStatePath(packetSpecFolder);
  const guards = normalizeGuards(sessionState, executorConfig);
  const runTopic = executorConfig.orchestrateTopic || executorConfig.orchestrate_topic || orchestrateTopic;
  if (typeof runTopic !== 'function') {
    throw new TypeError('executor_config.orchestrateTopic must be a function when provided');
  }

  const topicResults = [];
  const skippedTopicIds = [];
  let stopReason = 'topics_exhausted';

  for (let index = 0; index < sessionState.topics.length; index += 1) {
    const topicNumber = index + 1;
    const topic = sessionState.topics[index];
    const maxTopicDecision = evaluateCouncilCostGuards({
      topicNumber,
      guards,
    });
    if (topicNumber > guards.max_topics_per_session || maxTopicDecision.stop_reasons.includes('max_topics_per_session')) {
      stopReason = 'max_topics_per_session';
      skippedTopicIds.push(...sessionState.topics.slice(index).map((entry) => entry.topic_id));
      break;
    }

    const topicResult = await runTopic({
      topic_id: topic.topic_id,
      session_state: {
        ...sessionState,
        session: {
          ...sessionState.session,
          current_topic: topicNumber,
        },
        current: {
          ...sessionState.current,
          topic,
        },
      },
      executor_config: executorConfig,
    });
    topicResults.push(topicResult);

    appendTopicCompletion(statePath, {
      session_id: sessionState.session.session_id,
      topic_id: topic.topic_id,
      topic_number: topicNumber,
      rounds_completed: topicResult.rounds_completed,
      final_verdict: topicResult.final_verdict,
      stability_score: topicResult.stability_score,
      topic_stop_reason: topicResult.stop_reason,
    });

    const saturationDecision = sessionSaturationDecision(topicResult, topicResults.length, guards, executorConfig);
    if (saturationDecision.stop_reasons.includes('saturation_threshold')) {
      stopReason = 'session_saturation_threshold';
      skippedTopicIds.push(...sessionState.topics.slice(index + 1).map((entry) => entry.topic_id));
      break;
    }

    if (topicResults.length >= guards.max_topics_per_session && topicNumber < sessionState.topics.length) {
      stopReason = 'max_topics_per_session';
      skippedTopicIds.push(...sessionState.topics.slice(index + 1).map((entry) => entry.topic_id));
      break;
    }
  }

  return {
    session_id: sessionState.session.session_id,
    topics_completed: topicResults.length,
    topic_results: topicResults,
    skipped_topic_ids: skippedTopicIds,
    stop_reason: stopReason,
    session_state_path: statePath,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  orchestrateSession,
  sessionStatePath,
};
