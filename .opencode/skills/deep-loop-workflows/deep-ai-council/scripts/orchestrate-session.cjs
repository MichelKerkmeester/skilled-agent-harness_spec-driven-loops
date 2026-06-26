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
const { appendRoundStateRecord } = require('../../../deep-loop-runtime/lib/council/round-state-jsonl.cjs');
const { evaluateCouncilCostGuards, normalizeCostGuards } = require('../../../deep-loop-runtime/lib/council/cost-guards.cjs');
const { validateSessionStateHierarchy } = require('../../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs');
const { orchestrateTopic } = require('./orchestrate-topic.cjs');
const { appendFinding, getCrossTopicPriors } = require('./lib/findings-registry.cjs');

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

function pad3(value) {
  return String(value).padStart(3, '0');
}

function lastRoundId(topicResult) {
  if (Array.isArray(topicResult.rounds) && topicResult.rounds.length > 0) {
    const lastRound = topicResult.rounds[topicResult.rounds.length - 1];
    if (isRecord(lastRound) && typeof lastRound.round_id === 'string') {
      return lastRound.round_id;
    }
  }
  if (Number.isInteger(topicResult.rounds_completed) && topicResult.rounds_completed > 0) {
    return `round-${pad3(topicResult.rounds_completed)}`;
  }
  return null;
}

function topicFinding(topic, topicResult, sessionState) {
  const verdict = isRecord(topicResult.final_verdict) ? topicResult.final_verdict : {};
  const roundId = lastRoundId(topicResult);
  const recommended = verdict.recommended_option || topicResult.stop_reason || 'undecided';
  return {
    session_id: sessionState.session.session_id,
    topic_id: topic.topic_id,
    topic_slug: topic.topic_slug,
    round_id: roundId,
    finding_type: 'topic-final-verdict',
    claim: `Topic ${topic.topic_id} final verdict: ${recommended}`,
    stance: 'support',
    confidence: verdict.confidence,
    final_verdict: verdict,
    evidence: {
      final_verdict: verdict,
      stability_score: topicResult.stability_score,
      stop_reason: topicResult.stop_reason,
      rounds_completed: topicResult.rounds_completed,
    },
    source_iter: roundId,
    source_artifacts: roundId
      ? [`ai-council/topics/${topic.topic_id}/rounds/${roundId}/deliberation.md`]
      : [`ai-council/topics/${topic.topic_id}/topic-report.md`],
  };
}

function sessionSynthesisFinding(sessionState, topicResults, stopReason) {
  const completedTopicIds = topicResults.map((result) => result.topic_id).filter(Boolean);
  return {
    session_id: sessionState.session.session_id,
    topic_id: 'session',
    topic_slug: 'session',
    finding_type: 'session-synthesis',
    claim: `Session ${sessionState.session.session_id} completed ${topicResults.length} topic(s): ${stopReason}`,
    stance: 'synthesis',
    confidence: null,
    evidence: {
      completed_topic_ids: completedTopicIds,
      stop_reason: stopReason,
      topic_results: topicResults,
    },
    source_iter: 'session-close',
    source_artifacts: ['ai-council/session-report.md'],
  };
}

function withCrossTopicPriors(topic, sessionState, executorConfig, priors) {
  if (!priors.length) {
    return {
      topic,
      sessionState,
      executorConfig,
    };
  }
  const priorFingerprints = [
    ...(Array.isArray(topic.prior_fingerprints) ? topic.prior_fingerprints : []),
    ...priors.map((prior) => prior.fingerprint),
  ];
  const enrichedTopic = {
    ...topic,
    prior_fingerprints: [...new Set(priorFingerprints)],
    prior_findings: priors,
  };
  const configuredBrief = executorConfig.topic_brief || executorConfig.topicBrief || topic.topic_brief || topic.brief || {};
  const topicBrief = {
    ...(isRecord(configuredBrief) ? configuredBrief : {}),
    topic_id: enrichedTopic.topic_id,
    title: enrichedTopic.title || enrichedTopic.topic_slug || enrichedTopic.topic_id,
    prior_fingerprints: enrichedTopic.prior_fingerprints,
    prior_findings: priors,
    session_id: sessionState.session.session_id,
  };
  return {
    topic: enrichedTopic,
    sessionState: {
      ...sessionState,
      current: {
        ...sessionState.current,
        topic: enrichedTopic,
      },
    },
    executorConfig: {
      ...executorConfig,
      topic_brief: topicBrief,
    },
  };
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

    const priors = index === 0 ? [] : getCrossTopicPriors(packetSpecFolder, { topic_id: topic.topic_id });
    const enriched = withCrossTopicPriors(topic, {
      ...sessionState,
      session: {
        ...sessionState.session,
        current_topic: topicNumber,
      },
    }, executorConfig, priors);

    const topicResult = await runTopic({
      topic_id: enriched.topic.topic_id,
      session_state: {
        ...enriched.sessionState,
        session: {
          ...enriched.sessionState.session,
          current_topic: topicNumber,
        },
        current: {
          ...enriched.sessionState.current,
          topic: enriched.topic,
        },
      },
      executor_config: enriched.executorConfig,
    });
    topicResults.push(topicResult);
    appendFinding(packetSpecFolder, topicFinding(enriched.topic, topicResult, sessionState));

    appendTopicCompletion(statePath, {
      session_id: sessionState.session.session_id,
      topic_id: enriched.topic.topic_id,
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

  appendFinding(packetSpecFolder, sessionSynthesisFinding(sessionState, topicResults, stopReason));

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
