// ───────────────────────────────────────────────────────────────
// COGNITIVE: PREDICTION ERROR GATE
// ───────────────────────────────────────────────────────────────
'use strict';

/**
 * Prediction Error Gate Module
 * Conflict detection using similarity thresholds.
 * Determines whether to create, update, or reinforce memory based
 * on similarity to existing memories (conflict detection).
 */

/* ─────────────────────────────────────────────────────────────
   1. STATE
────────────────────────────────────────────────────────────────*/

let db = null;

/* ─────────────────────────────────────────────────────────────
   2. THRESHOLD CONSTANTS
   Based on Vestige research thresholds (ADR-002)
────────────────────────────────────────────────────────────────*/

// COGNITIVE-080: Similarity thresholds for memory decisions
const THRESHOLD = {
  DUPLICATE: 0.95,     // >= 95%: reinforce
  HIGH_MATCH: 0.90,    // >= 90%: check contradiction
  MEDIUM_MATCH: 0.70,  // >= 70%: context-dependent
  LOW_MATCH: 0.50,     // < 50%: create new
};

const ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  SUPERSEDE: 'SUPERSEDE',
  REINFORCE: 'REINFORCE',
  CREATE_LINKED: 'CREATE_LINKED',
};

// COGNITIVE-080: Contradiction patterns - pairs of opposing terms
const CONTRADICTION_PATTERNS = [
  { pattern: /\balways\b|\bnever\b/i, type: 'absolute', pair: ['always', 'never'] },
  { pattern: /\bmust\b|\bmust not\b/i, type: 'requirement', pair: ['must', 'must not'] },
  { pattern: /\bshould\b|\bshould not\b|\bshouldn'?t\b/i, type: 'recommendation', pair: ['should', 'should not'] },
  { pattern: /\buse\b|\bdon'?t use\b|\bdo not use\b/i, type: 'directive', pair: ['use', "don't use"] },
  { pattern: /\benable\b|\bdisable\b/i, type: 'toggle', pair: ['enable', 'disable'] },
  { pattern: /\btrue\b|\bfalse\b/i, type: 'boolean', pair: ['true', 'false'] },
  { pattern: /\byes\b|\bno\b/i, type: 'affirmation', pair: ['yes', 'no'] },
  { pattern: /\brequired\b|\boptional\b|\bforbidden\b/i, type: 'obligation', pair: ['required', 'optional'] },
  { pattern: /\bmandatory\b|\bforbidden\b/i, type: 'mandate', pair: ['mandatory', 'forbidden'] },
  { pattern: /\ballow\b|\bdeny\b/i, type: 'permission', pair: ['allow', 'deny'] },
  { pattern: /\binclude\b|\bexclude\b/i, type: 'inclusion', pair: ['include', 'exclude'] },
  { pattern: /\bis not\b|\bisn'?t\b|\bare not\b|\baren'?t\b/i, type: 'negation', pair: ['is', 'is not'] },
  { pattern: /\bprefer\b|\bavoid\b/i, type: 'preference', pair: ['prefer', 'avoid'] },
];

/* ─────────────────────────────────────────────────────────────
   3. INITIALIZATION
────────────────────────────────────────────────────────────────*/

/** Initialize with database reference */
function init(database) {
  if (!database) {
    throw new Error('[prediction-error-gate] Database reference is required');
  }
  db = database;
}

/** Get current database reference (for testing) */
function get_db() {
  return db;
}

/** @deprecated Table created by vector-index.js migration v12 (KL-1 Schema Unification) */
function ensure_conflicts_table() {
  /* No-op: memory_conflicts table is now created by vector-index.js with unified schema */
}

/* ─────────────────────────────────────────────────────────────
   4. CORE EVALUATION FUNCTION
────────────────────────────────────────────────────────────────*/

/** Evaluate whether to create, update, or reinforce memory based on similarity */
function evaluate_memory(candidates, new_content, options = {}) {
  const check_contradictions = options.check_contradictions !== false;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return {
      action: ACTION.CREATE,
      reason: 'No similar memories found',
      candidate: null,
      similarity: 0,
    };
  }

  if (typeof new_content !== 'string') {
    new_content = '';
  }

  const sorted_candidates = [...candidates].sort((a, b) =>
    (b.similarity || 0) - (a.similarity || 0)
  );

  const best_match = sorted_candidates[0];
  const similarity = best_match.similarity || 0;

  // COGNITIVE-080: Decision logic based on similarity thresholds
  if (similarity >= THRESHOLD.DUPLICATE) {
    return {
      action: ACTION.REINFORCE,
      reason: `Similarity ${(similarity * 100).toFixed(1)}% >= ${THRESHOLD.DUPLICATE * 100}% threshold`,
      candidate: best_match,
      similarity,
    };
  }

  if (similarity >= THRESHOLD.HIGH_MATCH) {
    if (check_contradictions) {
      const contradiction = detect_contradiction(
        best_match.content || '',
        new_content
      );

      if (contradiction.found) {
        return {
          action: ACTION.SUPERSEDE,
          reason: `Contradiction detected: ${contradiction.pattern}`,
          candidate: best_match,
          similarity,
          contradiction,
        };
      }
    }

    return {
      action: ACTION.UPDATE,
      reason: `Similarity ${(similarity * 100).toFixed(1)}% in high-match range (${THRESHOLD.HIGH_MATCH * 100}%-${THRESHOLD.DUPLICATE * 100}%)`,
      candidate: best_match,
      similarity,
    };
  }

  if (similarity >= THRESHOLD.MEDIUM_MATCH) {
    return {
      action: ACTION.CREATE_LINKED,
      reason: `Similarity ${(similarity * 100).toFixed(1)}% in medium-match range (${THRESHOLD.MEDIUM_MATCH * 100}%-${THRESHOLD.HIGH_MATCH * 100}%)`,
      candidate: best_match,
      similarity,
      related_ids: sorted_candidates.slice(0, 3).map(c => c.id),
    };
  }

  return {
    action: ACTION.CREATE,
    reason: `Similarity ${(similarity * 100).toFixed(1)}% below ${THRESHOLD.MEDIUM_MATCH * 100}% threshold`,
    candidate: best_match,
    similarity,
  };
}

/* ─────────────────────────────────────────────────────────────
   5. CONTRADICTION DETECTION
────────────────────────────────────────────────────────────────*/

/** 
 * Detect contradictions between two texts using pattern matching.
 * Uses word-boundary matching and context proximity to reduce false positives.
 */
function detect_contradiction(existing_content, new_content) {
  if (typeof existing_content !== 'string') {
    existing_content = '';
  }
  if (typeof new_content !== 'string') {
    new_content = '';
  }

  const existing_lower = existing_content.toLowerCase();
  const new_lower = new_content.toLowerCase();

  // Helper: Check if term exists as whole word (not substring)
  const hasWholeWord = (text, term) => {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  };

  // Helper: Check if opposing terms are in close proximity (within ~100 chars of similar context)
  // This reduces false positives when texts discuss different topics
  const areTermsInSameContext = (text1, term1, text2, term2) => {
    // Extract sentences containing the terms
    const getSentence = (text, term) => {
      const termIndex = text.toLowerCase().indexOf(term.toLowerCase());
      if (termIndex === -1) return '';
      // Find sentence boundaries (rough approximation)
      const start = Math.max(0, text.lastIndexOf('.', termIndex) + 1, text.lastIndexOf('\n', termIndex) + 1);
      const end = Math.min(text.length, 
        Math.min(
          text.indexOf('.', termIndex + term.length) !== -1 ? text.indexOf('.', termIndex + term.length) : text.length,
          text.indexOf('\n', termIndex + term.length) !== -1 ? text.indexOf('\n', termIndex + term.length) : text.length
        )
      );
      return text.substring(start, end).trim().toLowerCase();
    };

    const sentence1 = getSentence(text1, term1);
    const sentence2 = getSentence(text2, term2);

    // If sentences are too short, can't reliably determine context
    if (sentence1.length < 10 || sentence2.length < 10) {
      return false; // Require more context to claim contradiction
    }

    // Check for shared subject words (nouns/key terms) to confirm same topic
    const extractKeyWords = (sentence) => {
      const stopwords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'must', 'shall', 'can', 'need', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
        'it', 'this', 'that', 'these', 'those', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
        'always', 'never', 'use', 'not', 'don\'t', 'true', 'false', 'yes', 'no']);
      return sentence.match(/\b[a-z]{3,}\b/g)?.filter(w => !stopwords.has(w)) || [];
    };

    const keywords1 = new Set(extractKeyWords(sentence1));
    const keywords2 = extractKeyWords(sentence2);
    
    // Require at least 1 shared keyword to indicate same context
    const sharedKeywords = keywords2.filter(w => keywords1.has(w));
    return sharedKeywords.length >= 1;
  };

  for (const { pattern, type, pair } of CONTRADICTION_PATTERNS) {
    const [term_a, term_b] = pair;

    const existing_matches = existing_lower.match(pattern);
    const new_matches = new_lower.match(pattern);

    if (existing_matches && new_matches) {
      // Use word-boundary matching to avoid substring false positives
      const existing_has_a = hasWholeWord(existing_lower, term_a);
      const existing_has_b = hasWholeWord(existing_lower, term_b);
      const new_has_a = hasWholeWord(new_lower, term_a);
      const new_has_b = hasWholeWord(new_lower, term_b);

      // Check for opposing terms
      if ((existing_has_a && new_has_b) || (existing_has_b && new_has_a)) {
        const existingTerm = existing_has_a ? term_a : term_b;
        const newTerm = new_has_a ? term_a : term_b;
        
        // Additional check: terms must be in similar context to be a true contradiction
        if (areTermsInSameContext(existing_content, existingTerm, new_content, newTerm)) {
          return {
            found: true,
            type,
            pattern: `${term_a} <-> ${term_b}`,
            existing_term: existingTerm,
            new_term: newTerm,
          };
        }
        // If not in same context, this is likely a false positive - continue checking other patterns
      }
    }
  }

  return {
    found: false,
    type: null,
    pattern: null,
    existing_term: null,
    new_term: null,
  };
}

/* ─────────────────────────────────────────────────────────────
   6. CONFLICT LOGGING
────────────────────────────────────────────────────────────────*/

/** Format a conflict record for logging/storage */
function format_conflict_record(decision, new_content, spec_folder = null) {
  return {
    timestamp: new Date().toISOString(),
    action: decision.action,
    reason: decision.reason,
    similarity: decision.similarity,
    new_content_preview: (new_content || '').substring(0, 200),
    candidate_id: decision.candidate?.id || null,
    candidate_content_preview: (decision.candidate?.content || '').substring(0, 200),
    contradiction: decision.contradiction || null,
    related_ids: decision.related_ids || null,
    spec_folder,
  };
}

/** Check if a decision should be logged */
function should_log_conflict(decision) {
  return decision.action !== ACTION.CREATE || decision.similarity > 0;
}

/** Log a conflict decision to the database */
function log_conflict(decision, new_memory_id = null, new_content = '', existing_content = '', spec_folder = null) {
  if (!db) {
    console.warn('[prediction-error-gate] Database not initialized for logging');
    return false;
  }

  if (!decision || typeof decision !== 'object') {
    console.warn('[prediction-error-gate] Invalid decision object');
    return false;
  }

  if (!should_log_conflict(decision)) {
    return true;
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO memory_conflicts (
        action,
        new_memory_id,
        existing_memory_id,
        similarity,
        reason,
        new_content_preview,
        existing_content_preview,
        contradiction_detected,
        contradiction_type,
        spec_folder
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const max_preview_length = 200;
    const new_preview = truncate_content(new_content, max_preview_length);
    const existing_preview = truncate_content(existing_content, max_preview_length);

    stmt.run(
      decision.action || 'CREATE',
      new_memory_id,
      decision.candidate?.id || null,
      decision.similarity || 0,
      decision.reason || '',
      new_preview,
      existing_preview,
      decision.contradiction?.found ? 1 : 0,
      decision.contradiction?.type || null,
      spec_folder
    );

    return true;
  } catch (error) {
    console.error(`[prediction-error-gate] Error logging conflict: ${error.message}`);
    return false;
  }
}

/** Truncate content to max length with ellipsis */
function truncate_content(content, max_length) {
  if (!content || typeof content !== 'string') {
    return '';
  }
  if (content.length <= max_length) {
    return content;
  }
  return content.substring(0, max_length - 3) + '...';
}

/** Get conflict statistics from the audit log */
function get_conflict_stats() {
  if (!db) {
    return { total: 0, byAction: {}, recentConflicts: 0 };
  }

  try {
    const total_row = db.prepare('SELECT COUNT(*) as count FROM memory_conflicts').get();
    const total = total_row ? total_row.count : 0;

    const by_action_rows = db.prepare(`
      SELECT action, COUNT(*) as count
      FROM memory_conflicts
      GROUP BY action
    `).all();

    const by_action = {};
    for (const row of by_action_rows) {
      by_action[row.action] = row.count;
    }

    const recent_row = db.prepare(`
      SELECT COUNT(*) as count
      FROM memory_conflicts
      WHERE timestamp > datetime('now', '-24 hours')
    `).get();
    const recent_conflicts = recent_row ? recent_row.count : 0;

    return { total, byAction: by_action, recentConflicts: recent_conflicts };
  } catch (error) {
    console.error(`[prediction-error-gate] Error getting conflict stats: ${error.message}`);
    return { total: 0, byAction: {}, recentConflicts: 0 };
  }
}

/** Get recent conflict decisions for review */
function get_recent_conflicts(limit = 10) {
  if (!db) {
    return [];
  }

  try {
    return db.prepare(`
      SELECT *
      FROM memory_conflicts
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit);
  } catch (error) {
    console.error(`[prediction-error-gate] Error getting recent conflicts: ${error.message}`);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   7. BATCH EVALUATION
────────────────────────────────────────────────────────────────*/

/** Evaluate multiple new memories against candidates */
async function batch_evaluate(new_memories, find_candidates, options = {}) {
  if (!Array.isArray(new_memories)) {
    return [];
  }

  const results = [];

  for (const memory of new_memories) {
    try {
      const candidates = await find_candidates(memory.embedding);
      const decision = evaluate_memory(candidates, memory.content, options);
      results.push({
        memory,
        decision,
      });
    } catch (error) {
      results.push({
        memory,
        decision: {
          action: ACTION.CREATE,
          reason: `Evaluation error: ${error.message}`,
          candidate: null,
          similarity: 0,
          error: true,
        },
      });
    }
  }

  return results;
}

/* ─────────────────────────────────────────────────────────────
   8. HELPER FUNCTIONS
────────────────────────────────────────────────────────────────*/

/** Calculate similarity statistics for a set of candidates */
function calculate_similarity_stats(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return { max: 0, min: 0, avg: 0, count: 0 };
  }

  const similarities = candidates.map(c => c.similarity || 0);
  const max = Math.max(...similarities);
  const min = Math.min(...similarities);
  const avg = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;

  return { max, min, avg, count: candidates.length };
}

/** Filter candidates above a minimum similarity threshold */
function filter_relevant_candidates(candidates, min_similarity = THRESHOLD.LOW_MATCH) {
  if (!Array.isArray(candidates)) {
    return [];
  }
  return candidates.filter(c => (c.similarity || 0) >= min_similarity);
}

/** Get action priority for sorting/display */
function get_action_priority(action) {
  const priorities = {
    [ACTION.SUPERSEDE]: 4,
    [ACTION.UPDATE]: 3,
    [ACTION.CREATE_LINKED]: 2,
    [ACTION.REINFORCE]: 1,
    [ACTION.CREATE]: 0,
  };
  return priorities[action] || 0;
}

/* ─────────────────────────────────────────────────────────────
   9. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  init,
  getDb: get_db,
  ensureConflictsTable: ensure_conflicts_table,
  evaluate_memory,
  evaluateMemory: evaluate_memory,
  detect_contradiction,
  detectContradiction: detect_contradiction,
  format_conflict_record,
  formatConflictRecord: format_conflict_record,
  should_log_conflict,
  shouldLogConflict: should_log_conflict,
  log_conflict,
  logConflict: log_conflict,
  get_conflict_stats,
  getConflictStats: get_conflict_stats,
  get_recent_conflicts,
  getRecentConflicts: get_recent_conflicts,
  batch_evaluate,
  batchEvaluate: batch_evaluate,
  calculate_similarity_stats,
  calculateSimilarityStats: calculate_similarity_stats,
  filter_relevant_candidates,
  filterRelevantCandidates: filter_relevant_candidates,
  get_action_priority,
  getActionPriority: get_action_priority,
  truncate_content,
  truncateContent: truncate_content,
  THRESHOLD,
  ACTION,
  CONTRADICTION_PATTERNS,
};
