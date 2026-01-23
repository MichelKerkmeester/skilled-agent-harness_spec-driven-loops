'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const path = require('path');
const { CONFIG, findActiveSpecsDir } = require('../core');
const { formatTimestamp } = require('../utils/message-utils');
const { detectSpecFolder } = require('../spec-folder');

const {
  generateSessionId,
  getChannel,
  detectSessionCharacteristics,
  buildProjectStateSnapshot,
  calculateSessionDuration,
  calculateExpiryEpoch,
  detectRelatedDocs
} = require('./session-extractor');

const {
  detectObservationType,
  extractFilesFromData,
  buildObservationsWithAnchors
} = require('./file-extractor');

const {
  buildImplementationGuideData
} = require('./implementation-guide-extractor');

/* ─────────────────────────────────────────────────────────────
   1.5. PREFLIGHT/POSTFLIGHT UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Generates assessment text for a given score.
 * @param {number} score - Score value (0-100)
 * @param {string} metric - Metric name for context
 * @returns {string} Human-readable assessment
 */
function getScoreAssessment(score, metric) {
  if (score === null || score === undefined || isNaN(score)) {
    return '[Not assessed]';
  }
  if (metric === 'uncertainty') {
    // For uncertainty, lower is better
    if (score <= 20) return 'Very low uncertainty';
    if (score <= 40) return 'Low uncertainty';
    if (score <= 60) return 'Moderate uncertainty';
    if (score <= 80) return 'High uncertainty';
    return 'Very high uncertainty';
  }
  // For knowledge and context, higher is better
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Limited';
  return 'Minimal';
}

/**
 * Calculates trend indicator for delta value.
 * @param {number} delta - Delta value
 * @param {boolean} invertedBetter - If true, negative delta is good (for uncertainty)
 * @returns {string} Trend arrow indicator
 */
function getTrendIndicator(delta, invertedBetter = false) {
  if (delta === null || delta === undefined || isNaN(delta)) {
    return '→';
  }
  if (invertedBetter) {
    // For uncertainty reduction: positive delta (reduction) is good
    if (delta > 0) return '↓'; // Uncertainty went down (good)
    if (delta < 0) return '↑'; // Uncertainty went up (bad)
    return '→';
  }
  // For knowledge/context: positive delta is good
  if (delta > 0) return '↑';
  if (delta < 0) return '↓';
  return '→';
}

/**
 * Calculates Learning Index from deltas.
 * Formula: (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
 * @param {number} deltaKnow - Knowledge delta
 * @param {number} deltaUncert - Uncertainty reduction (positive = good)
 * @param {number} deltaContext - Context delta
 * @returns {number} Learning Index (0-100)
 */
function calculateLearningIndex(deltaKnow, deltaUncert, deltaContext) {
  const dk = deltaKnow ?? 0;
  const du = deltaUncert ?? 0;
  const dc = deltaContext ?? 0;
  const index = (dk * 0.4) + (du * 0.35) + (dc * 0.25);
  return Math.round(Math.max(0, Math.min(100, index)));
}

/**
 * Extracts and calculates preflight/postflight data from collected data.
 * @param {Object} collectedData - Raw collected data from JSON input
 * @returns {Object} Processed preflight/postflight template data
 */
function extractPreflightPostflightData(collectedData) {
  const preflight = collectedData?.preflight;
  const postflight = collectedData?.postflight;

  // Default values when data not provided
  const DEFAULT_VALUE = '[TBD]';

  // Build preflight data
  const preflightData = {
    PREFLIGHT_KNOW_SCORE: preflight?.knowledgeScore ?? DEFAULT_VALUE,
    PREFLIGHT_UNCERTAINTY_SCORE: preflight?.uncertaintyScore ?? DEFAULT_VALUE,
    PREFLIGHT_CONTEXT_SCORE: preflight?.contextScore ?? DEFAULT_VALUE,
    PREFLIGHT_KNOW_ASSESSMENT: getScoreAssessment(preflight?.knowledgeScore, 'knowledge'),
    PREFLIGHT_UNCERTAINTY_ASSESSMENT: getScoreAssessment(preflight?.uncertaintyScore, 'uncertainty'),
    PREFLIGHT_CONTEXT_ASSESSMENT: getScoreAssessment(preflight?.contextScore, 'context'),
    PREFLIGHT_TIMESTAMP: preflight?.timestamp ?? DEFAULT_VALUE,
    PREFLIGHT_GAPS: preflight?.gaps?.map(g => ({ GAP_DESCRIPTION: g })) ?? [],
    PREFLIGHT_CONFIDENCE: preflight?.confidence ?? DEFAULT_VALUE,
    PREFLIGHT_UNCERTAINTY_RAW: preflight?.uncertaintyRaw ?? preflight?.uncertaintyScore ?? DEFAULT_VALUE,
    PREFLIGHT_READINESS: preflight?.readiness ?? DEFAULT_VALUE
  };

  // Build postflight data
  const postflightData = {
    POSTFLIGHT_KNOW_SCORE: postflight?.knowledgeScore ?? DEFAULT_VALUE,
    POSTFLIGHT_UNCERTAINTY_SCORE: postflight?.uncertaintyScore ?? DEFAULT_VALUE,
    POSTFLIGHT_CONTEXT_SCORE: postflight?.contextScore ?? DEFAULT_VALUE
  };

  // Calculate deltas if both preflight and postflight exist with valid scores
  let deltaData = {
    DELTA_KNOW_SCORE: DEFAULT_VALUE,
    DELTA_UNCERTAINTY_SCORE: DEFAULT_VALUE,
    DELTA_CONTEXT_SCORE: DEFAULT_VALUE,
    DELTA_KNOW_TREND: '→',
    DELTA_UNCERTAINTY_TREND: '→',
    DELTA_CONTEXT_TREND: '→',
    LEARNING_INDEX: DEFAULT_VALUE,
    LEARNING_SUMMARY: 'Learning metrics will be calculated when both preflight and postflight data are provided.'
  };

  if (preflight && postflight &&
      typeof preflight.knowledgeScore === 'number' &&
      typeof postflight.knowledgeScore === 'number') {

    // Knowledge delta: higher is better
    const deltaKnow = postflight.knowledgeScore - preflight.knowledgeScore;

    // Uncertainty delta: reduction is good (preflight - postflight, so positive = good)
    const deltaUncert = preflight.uncertaintyScore - postflight.uncertaintyScore;

    // Context delta: higher is better
    const deltaContext = postflight.contextScore - preflight.contextScore;

    // Calculate learning index
    const learningIndex = calculateLearningIndex(deltaKnow, deltaUncert, deltaContext);

    // Format delta display with sign
    const formatDelta = (d) => d >= 0 ? `+${d}` : `${d}`;

    deltaData = {
      DELTA_KNOW_SCORE: formatDelta(deltaKnow),
      DELTA_UNCERTAINTY_SCORE: formatDelta(deltaUncert),
      DELTA_CONTEXT_SCORE: formatDelta(deltaContext),
      DELTA_KNOW_TREND: getTrendIndicator(deltaKnow, false),
      DELTA_UNCERTAINTY_TREND: getTrendIndicator(deltaUncert, true),
      DELTA_CONTEXT_TREND: getTrendIndicator(deltaContext, false),
      LEARNING_INDEX: learningIndex,
      LEARNING_SUMMARY: generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex)
    };
  }

  // Build gaps data
  const gapsData = {
    GAPS_CLOSED: postflight?.gapsClosed?.map(g => ({ GAP_DESCRIPTION: g })) ?? [],
    NEW_GAPS: postflight?.newGaps?.map(g => ({ GAP_DESCRIPTION: g })) ?? []
  };

  return {
    ...preflightData,
    ...postflightData,
    ...deltaData,
    ...gapsData
  };
}

/**
 * Generates a human-readable learning summary based on deltas.
 * @param {number} deltaKnow - Knowledge delta
 * @param {number} deltaUncert - Uncertainty reduction
 * @param {number} deltaContext - Context delta
 * @param {number} learningIndex - Calculated learning index
 * @returns {string} Learning summary text
 */
function generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex) {
  const parts = [];

  if (deltaKnow > 20) {
    parts.push(`Significant knowledge gain (+${deltaKnow} points)`);
  } else if (deltaKnow > 10) {
    parts.push(`Moderate knowledge improvement (+${deltaKnow} points)`);
  } else if (deltaKnow > 0) {
    parts.push(`Slight knowledge increase (+${deltaKnow} points)`);
  } else if (deltaKnow < -10) {
    parts.push(`Knowledge score decreased (${deltaKnow} points) - may indicate scope expansion`);
  }

  if (deltaUncert > 20) {
    parts.push(`Major uncertainty reduction (-${deltaUncert} points)`);
  } else if (deltaUncert > 10) {
    parts.push(`Good uncertainty reduction (-${deltaUncert} points)`);
  } else if (deltaUncert < -10) {
    parts.push(`Uncertainty increased (+${Math.abs(deltaUncert)} points) - new unknowns discovered`);
  }

  if (deltaContext > 15) {
    parts.push(`Substantial context enrichment (+${deltaContext} points)`);
  } else if (deltaContext > 5) {
    parts.push(`Context improved (+${deltaContext} points)`);
  }

  if (parts.length === 0) {
    if (learningIndex >= 25) {
      return 'Productive session with balanced learning across metrics.';
    } else if (learningIndex >= 10) {
      return 'Moderate learning session - incremental progress made.';
    } else {
      return 'Low learning delta - session may have focused on execution rather than exploration.';
    }
  }

  let summary = parts.join('. ') + '.';

  if (learningIndex >= 40) {
    summary += ' Overall: Highly productive learning session.';
  } else if (learningIndex >= 25) {
    summary += ' Overall: Good learning session with meaningful progress.';
  } else if (learningIndex >= 10) {
    summary += ' Overall: Moderate learning session.';
  }

  return summary;
}

/* ─────────────────────────────────────────────────────────────
   2. LAZY-LOADED DEPENDENCIES
──────────────────────────────────────────────────────────────── */

let simFactory;
function getSimFactory() {
  if (!simFactory) {
    simFactory = require('../lib/simulation-factory');
  }
  return simFactory;
}

/* ─────────────────────────────────────────────────────────────
   3. AUTO-SAVE DETECTION
──────────────────────────────────────────────────────────────── */

function shouldAutoSave(messageCount) {
  return messageCount > 0 && messageCount % CONFIG.MESSAGE_COUNT_TRIGGER === 0;
}

/* ─────────────────────────────────────────────────────────────
   4. SESSION DATA COLLECTION
──────────────────────────────────────────────────────────────── */

async function collectSessionData(collectedData, specFolderName = null) {
  const now = new Date();
  
  let folderName = specFolderName;
  if (!folderName) {
    const detectedFolder = await detectSpecFolder();
    const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
    folderName = path.relative(specsDir, detectedFolder);
  }
  const dateOnly = formatTimestamp(now, 'date-dutch');
  const timeOnly = formatTimestamp(now, 'time-short');

  if (!collectedData) {
    console.log('   ⚠️  Using simulation data');
    return getSimFactory().createSessionData({
      specFolder: folderName,
      channel: getChannel(),
      skillVersion: CONFIG.SKILL_VERSION
    });
  }

  const sessionInfo = collectedData.recent_context?.[0] || {};
  const observations = collectedData.observations || [];
  const userPrompts = collectedData.user_prompts || [];
  const messageCount = userPrompts.length || 0;

  if (shouldAutoSave(messageCount)) {
    console.log(`\n   📊 Context Budget: ${messageCount} messages reached. Auto-saving context...\n`);
  }

  const duration = calculateSessionDuration(userPrompts, now);
  const FILES = extractFilesFromData(collectedData, observations);

  const OUTCOMES = observations
    .slice(0, 10)
    .map(obs => ({
      OUTCOME: obs.title || obs.narrative?.substring(0, 300),
      TYPE: detectObservationType(obs)
    }));

  const SUMMARY = sessionInfo.learning
    || observations.slice(0, 3).map(o => o.narrative).join(' ')
    || 'Session focused on implementing and testing features.';

  const { contextType, importanceTier, decisionCount, toolCounts } = 
    detectSessionCharacteristics(observations, userPrompts, FILES);
  
  const TOOL_COUNT = Object.values(toolCounts).reduce((sum, count) => sum + count, 0);

  const firstPrompt = userPrompts[0]?.prompt || '';
  const taskFromPrompt = firstPrompt.match(/^(.{20,100}?)(?:[.!?\n]|$)/)?.[1];

  const OBSERVATIONS_DETAILED = buildObservationsWithAnchors(
    observations, 
    collectedData.SPEC_FOLDER || folderName
  );

  const sessionId = generateSessionId();
  const channel = getChannel();
  const createdAtEpoch = Math.floor(Date.now() / 1000);

  let SPEC_FILES = [];
  const activeSpecsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  const specFolderPath = collectedData.SPEC_FOLDER
    ? path.join(activeSpecsDir, collectedData.SPEC_FOLDER)
    : null;

  if (specFolderPath) {
    try {
      SPEC_FILES = await detectRelatedDocs(specFolderPath);
    } catch (docError) {
      console.warn(`   ⚠️  Could not detect related docs: ${docError.message}`);
      SPEC_FILES = [];
    }
  }

  const implementationGuide = buildImplementationGuideData(observations, FILES, folderName);

  const { projectPhase, activeFile, lastAction, nextAction, blockers, fileProgress } = 
    buildProjectStateSnapshot({
      toolCounts,
      observations,
      messageCount,
      FILES,
      SPEC_FILES,
      specFolderPath,
      recentContext: collectedData.recent_context
    });

  const expiresAtEpoch = calculateExpiryEpoch(importanceTier, createdAtEpoch);

  // Extract preflight/postflight data for learning delta tracking
  const preflightPostflightData = extractPreflightPostflightData(collectedData);

  return {
    TITLE: folderName.replace(/^\d{3}-/, '').replace(/-/g, ' '),
    DATE: dateOnly,
    TIME: timeOnly,
    SPEC_FOLDER: folderName,
    DURATION: duration,
    SUMMARY: SUMMARY,
    FILES: FILES.length > 0 ? FILES : [],
    HAS_FILES: FILES.length > 0,
    FILE_COUNT: FILES.length,
    OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress' }],
    TOOL_COUNT,
    MESSAGE_COUNT: messageCount,
    QUICK_SUMMARY: observations[0]?.title || sessionInfo.request || taskFromPrompt?.trim() || 'Development session',
    SKILL_VERSION: CONFIG.SKILL_VERSION,
    OBSERVATIONS: OBSERVATIONS_DETAILED,
    HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
    SPEC_FILES: SPEC_FILES,
    HAS_SPEC_FILES: SPEC_FILES.length > 0,
    ...implementationGuide,
    SESSION_ID: sessionId,
    CHANNEL: channel,
    IMPORTANCE_TIER: importanceTier,
    CONTEXT_TYPE: contextType,
    CREATED_AT_EPOCH: createdAtEpoch,
    LAST_ACCESSED_EPOCH: createdAtEpoch,
    EXPIRES_AT_EPOCH: expiresAtEpoch,
    TOOL_COUNTS: toolCounts,
    DECISION_COUNT: decisionCount,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    PROJECT_PHASE: projectPhase,
    ACTIVE_FILE: activeFile,
    LAST_ACTION: lastAction,
    NEXT_ACTION: nextAction,
    BLOCKERS: blockers,
    FILE_PROGRESS: fileProgress,
    HAS_FILE_PROGRESS: fileProgress.length > 0,
    // Preflight/Postflight learning delta data
    ...preflightPostflightData
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  collectSessionData,
  shouldAutoSave,
  // Exported for testing and direct use
  extractPreflightPostflightData,
  calculateLearningIndex,
  getScoreAssessment,
  getTrendIndicator,
  generateLearningSummary
};
