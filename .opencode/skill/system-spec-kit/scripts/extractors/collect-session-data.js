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
    HAS_FILE_PROGRESS: fileProgress.length > 0
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  collectSessionData,
  shouldAutoSave
};
