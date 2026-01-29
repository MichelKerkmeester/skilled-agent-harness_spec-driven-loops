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
const fsrsScheduler = require('./fsrs-scheduler.js');
const predictionErrorGate = require('./prediction-error-gate.js');

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
  // FSRS Scheduler (no collisions)
  // ─────────────────────────────────────────────────────────────
  calculateRetrievability: fsrsScheduler.calculate_retrievability,
  updateStability: fsrsScheduler.update_stability,
  calculateOptimalInterval: fsrsScheduler.calculate_optimal_interval,
  updateDifficulty: fsrsScheduler.update_difficulty,
  calculateElapsedDays: fsrsScheduler.calculate_elapsed_days,
  getNextReviewDate: fsrsScheduler.get_next_review_date,
  createInitialParams: fsrsScheduler.create_initial_params,
  FSRS_FACTOR: fsrsScheduler.FSRS_FACTOR,
  FSRS_DECAY: fsrsScheduler.FSRS_DECAY,
  DEFAULT_STABILITY: fsrsScheduler.DEFAULT_STABILITY,
  DEFAULT_DIFFICULTY: fsrsScheduler.DEFAULT_DIFFICULTY,
  TARGET_RETRIEVABILITY: fsrsScheduler.TARGET_RETRIEVABILITY,
  GRADE_AGAIN: fsrsScheduler.GRADE_AGAIN,
  GRADE_HARD: fsrsScheduler.GRADE_HARD,
  GRADE_GOOD: fsrsScheduler.GRADE_GOOD,
  GRADE_EASY: fsrsScheduler.GRADE_EASY,

  // ─────────────────────────────────────────────────────────────
  // Prediction Error Gate (prefixed to avoid collisions)
  // ─────────────────────────────────────────────────────────────
  predictionErrorGate_init: predictionErrorGate.init,
  predictionErrorGate_getDb: predictionErrorGate.getDb,
  predictionErrorGate_ensureConflictsTable: predictionErrorGate.ensureConflictsTable,
  evaluateMemory: predictionErrorGate.evaluate_memory,
  detectContradiction: predictionErrorGate.detect_contradiction,
  formatConflictRecord: predictionErrorGate.format_conflict_record,
  shouldLogConflict: predictionErrorGate.should_log_conflict,
  logConflict: predictionErrorGate.log_conflict,
  getConflictStats: predictionErrorGate.get_conflict_stats,
  getRecentConflicts: predictionErrorGate.get_recent_conflicts,
  batchEvaluate: predictionErrorGate.batch_evaluate,
  calculateSimilarityStats: predictionErrorGate.calculate_similarity_stats,
  filterRelevantCandidates: predictionErrorGate.filter_relevant_candidates,
  getActionPriority: predictionErrorGate.get_action_priority,
  truncateContent: predictionErrorGate.truncate_content,
  PE_THRESHOLD: predictionErrorGate.THRESHOLD,
  PE_ACTION: predictionErrorGate.ACTION,
  CONTRADICTION_PATTERNS: predictionErrorGate.CONTRADICTION_PATTERNS,

  // ─────────────────────────────────────────────────────────────
  // Module References (for direct access when needed)
  // ─────────────────────────────────────────────────────────────
  attentionDecay,
  workingMemory,
  tierClassifier,
  coActivation,
  temporalContiguity,
  summaryGenerator,
  fsrsScheduler,
  predictionErrorGate,
};
