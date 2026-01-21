// ───────────────────────────────────────────────────────────────
// MODULE: COGNITIVE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const attentionDecay = require('./attention-decay.js');
const workingMemory = require('./working-memory.js');
const tierClassifier = require('./tier-classifier.js');
const coActivation = require('./co-activation.js');
const temporalContiguity = require('./temporal-contiguity.js');
const summaryGenerator = require('./summary-generator.js');

module.exports = {
  // ─────────────────────────────────────────────────────────────
  // Attention Decay (prefixed to avoid collision with working-memory)
  // ─────────────────────────────────────────────────────────────
  attentionDecay_init: attentionDecay.init,
  attentionDecay_getDb: attentionDecay.getDb,
  applyDecay: attentionDecay.applyDecay,
  getDecayRate: attentionDecay.getDecayRate,
  activateMemory: attentionDecay.activateMemory,
  calculateDecayedScore: attentionDecay.calculateDecayedScore,
  attentionDecay_getActiveMemories: attentionDecay.getActiveMemories,
  attentionDecay_clearSession: attentionDecay.clearSession,
  DECAY_CONFIG: attentionDecay.DECAY_CONFIG,

  // ─────────────────────────────────────────────────────────────
  // Working Memory (prefixed to avoid collision with attention-decay)
  // ─────────────────────────────────────────────────────────────
  workingMemory_init: workingMemory.init,
  workingMemory_getDb: workingMemory.getDb,
  ensureSchema: workingMemory.ensureSchema,
  getOrCreateSession: workingMemory.getOrCreateSession,
  workingMemory_clearSession: workingMemory.clearSession,
  cleanupOldSessions: workingMemory.cleanupOldSessions,
  getWorkingMemory: workingMemory.getWorkingMemory,
  getSessionMemories: workingMemory.getSessionMemories,
  setAttentionScore: workingMemory.setAttentionScore,
  batchUpdateScores: workingMemory.batchUpdateScores,
  workingMemory_isEnabled: workingMemory.isEnabled,
  workingMemory_getConfig: workingMemory.getConfig,
  getSessionStats: workingMemory.getSessionStats,
  calculateTier: workingMemory.calculateTier,
  WORKING_MEMORY_CONFIG: workingMemory.CONFIG,

  // ─────────────────────────────────────────────────────────────
  // Tier Classifier (no collisions)
  // ─────────────────────────────────────────────────────────────
  classifyTier: tierClassifier.classifyTier,
  getTieredContent: tierClassifier.getTieredContent,
  filterAndLimitByTier: tierClassifier.filterAndLimitByTier,
  formatTieredResponse: tierClassifier.formatTieredResponse,
  getTierStats: tierClassifier.getTierStats,
  isIncluded: tierClassifier.isIncluded,
  getTierThreshold: tierClassifier.getTierThreshold,
  getFullContent: tierClassifier.getFullContent,
  getSummaryContent: tierClassifier.getSummaryContent,
  TIER_CONFIG: tierClassifier.TIER_CONFIG,

  // ─────────────────────────────────────────────────────────────
  // Co-Activation (prefixed to avoid collision with working-memory)
  // ─────────────────────────────────────────────────────────────
  coActivation_init: coActivation.init,
  coActivation_isEnabled: coActivation.isEnabled,
  spreadActivation: coActivation.spreadActivation,
  getRelatedMemories: coActivation.getRelatedMemories,
  boostScore: coActivation.boostScore,
  populateRelatedMemories: coActivation.populateRelatedMemories,
  logCoActivationEvent: coActivation.logCoActivationEvent,
  CO_ACTIVATION_CONFIG: coActivation.CONFIG,

  // ─────────────────────────────────────────────────────────────
  // Temporal Contiguity (no collisions)
  // ─────────────────────────────────────────────────────────────
  DEFAULT_WINDOW: temporalContiguity.DEFAULT_WINDOW,
  MAX_WINDOW: temporalContiguity.MAX_WINDOW,
  vector_search_with_contiguity: temporalContiguity.vector_search_with_contiguity,
  get_temporal_neighbors: temporalContiguity.get_temporal_neighbors,
  build_timeline: temporalContiguity.build_timeline,

  // ─────────────────────────────────────────────────────────────
  // Summary Generator (no collisions)
  // ─────────────────────────────────────────────────────────────
  generateSummary: summaryGenerator.generateSummary,
  getSummaryOrFallback: summaryGenerator.getSummaryOrFallback,
  stripMarkdown: summaryGenerator.stripMarkdown,
  extractFirstParagraph: summaryGenerator.extractFirstParagraph,
  SUMMARY_CONFIG: summaryGenerator.SUMMARY_CONFIG,

  // ─────────────────────────────────────────────────────────────
  // Module References (for direct access when needed)
  // ─────────────────────────────────────────────────────────────
  attentionDecay,
  workingMemory,
  tierClassifier,
  coActivation,
  temporalContiguity,
  summaryGenerator,
};
