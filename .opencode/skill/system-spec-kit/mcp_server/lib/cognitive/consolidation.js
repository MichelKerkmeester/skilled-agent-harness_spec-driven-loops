// ───────────────────────────────────────────────────────────────
// COGNITIVE: CONSOLIDATION ENGINE
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');
const checkpoints = require('../storage/checkpoints');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const CONSOLIDATION_CONFIG = {
  // REPLAY phase - episodic memories older than 7 days
  replay: {
    minAgeDays: 7,
    memoryTypes: ['episodic'],
    maxBatchSize: 100,
  },

  // ABSTRACT phase - pattern extraction threshold
  abstract: {
    minOccurrences: 2,  // REQ-022: 2+ occurrences for pattern extraction
    similarityThreshold: 0.75,
    maxPatternsPerRun: 50,
  },

  // INTEGRATE phase - semantic memory creation
  integrate: {
    targetType: 'semantic',
    halfLifeDays: 180,
    minPatternStrength: 0.6,
  },

  // PRUNE phase - redundancy archival
  prune: {
    redundancyThreshold: 0.85,
    preserveMinCount: 1,
    archivalTier: 'deprecated',
  },

  // STRENGTHEN phase - high-access boost
  strengthen: {
    minAccessCount: 5,
    stabilityBoost: 1.3,
    maxStability: 365,
  },

  // R14 Mitigation: Safety mechanisms (dry-run default prevents accidental data loss)
  safety: {
    dryRunDefault: true,
    backupBeforePrune: true,
    backupPrefix: 'consolidation-backup-',
  },
};

/* ─────────────────────────────────────────────────────────────
   2. DATABASE REFERENCE
────────────────────────────────────────────────────────────────*/

let db = null;

/**
 * Initialize the consolidation engine with a database reference
 * @param {Object} database - better-sqlite3 database instance
 */
function init(database) {
  if (!database) {
    throw new Error('[consolidation] Database reference is required');
  }
  db = database;

  try {
    checkpoints.init(database);
  } catch (e) {
    // Already initialized - ignore
  }

  return { success: true };
}

/**
 * Get the current database reference (for testing)
 * @returns {Object|null} Database instance or null if not initialized
 */
function get_db() {
  return db;
}

/* ─────────────────────────────────────────────────────────────
   3. PHASE 1: REPLAY (T079)
────────────────────────────────────────────────────────────────*/

/**
 * T079: REPLAY phase - Select episodic memories older than 7 days
 *
 * Simulates memory replay during consolidation, identifying
 * episodic memories that are candidates for pattern extraction.
 *
 * @param {Object} options - Replay options
 * @param {number} options.minAgeDays - Minimum age in days (default: 7)
 * @param {number} options.maxResults - Maximum results to return
 * @param {string} options.specFolder - Filter by spec folder
 * @returns {Object} Replay results with candidate memories
 */
function replay_phase(options = {}) {
  if (!db) {
    throw new Error('[consolidation] Database not initialized. Call init() first.');
  }

  const config = { ...CONSOLIDATION_CONFIG.replay, ...options };
  const minAgeDays = config.minAgeDays || 7;
  const maxResults = config.maxResults || config.maxBatchSize;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - minAgeDays);
  const cutoffIso = cutoffDate.toISOString();

  let sql = `
    SELECT
      id,
      spec_folder,
      file_path,
      title,
      memory_type,
      importance_tier,
      access_count,
      created_at,
      updated_at,
      content_hash
    FROM memory_index
    WHERE memory_type = 'episodic'
      AND created_at < ?
      AND importance_tier NOT IN ('constitutional', 'critical', 'deprecated')
  `;
  const params = [cutoffIso];

  if (config.specFolder) {
    sql += ' AND spec_folder = ?';
    params.push(config.specFolder);
  }

  sql += ' ORDER BY created_at ASC LIMIT ?';
  params.push(maxResults);

  try {
    const candidates = db.prepare(sql).all(...params);

    return {
      phase: 'REPLAY',
      success: true,
      candidateCount: candidates.length,
      candidates: candidates,
      config: {
        minAgeDays,
        cutoffDate: cutoffIso,
        specFolder: config.specFolder || null,
      },
    };
  } catch (error) {
    console.error(`[consolidation] REPLAY phase error: ${error.message}`);
    return {
      phase: 'REPLAY',
      success: false,
      error: error.message,
      candidateCount: 0,
      candidates: [],
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   4. PHASE 2: ABSTRACT (T080)
────────────────────────────────────────────────────────────────*/

/**
 * T080: ABSTRACT phase - Extract patterns with 2+ occurrences
 *
 * Analyzes episodic memories to identify recurring patterns.
 * Patterns are extracted based on content similarity and trigger phrase overlap.
 *
 * @param {Array} candidates - Episodic memories from REPLAY phase
 * @param {Object} options - Abstraction options
 * @param {number} options.minOccurrences - Minimum occurrences (default: 2)
 * @param {number} options.similarityThreshold - Grouping threshold
 * @returns {Object} Extracted patterns
 */
function abstract_phase(candidates, options = {}) {
  if (!db) {
    throw new Error('[consolidation] Database not initialized. Call init() first.');
  }

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return {
      phase: 'ABSTRACT',
      success: true,
      patternCount: 0,
      patterns: [],
      message: 'No candidates to abstract',
    };
  }

  const config = { ...CONSOLIDATION_CONFIG.abstract, ...options };
  const minOccurrences = config.minOccurrences || 2;

  try {
    const hashGroups = new Map();
    for (const candidate of candidates) {
      const hash = candidate.content_hash || generate_content_hash(candidate.title || '');
      if (!hashGroups.has(hash)) {
        hashGroups.set(hash, []);
      }
      hashGroups.get(hash).push(candidate);
    }

    const triggerGroups = group_by_triggers(candidates, config.similarityThreshold);
    const titleGroups = group_by_title_similarity(candidates, config.similarityThreshold);

    const patterns = [];
    const processedIds = new Set();

    // Exact duplicates have highest priority
    for (const [hash, group] of hashGroups) {
      if (group.length >= minOccurrences) {
        const ids = group.map(m => m.id);
        if (!ids.some(id => processedIds.has(id))) {
          patterns.push({
            type: 'exact_duplicate',
            pattern_id: `dup-${hash.slice(0, 8)}`,
            occurrences: group.length,
            memories: group,
            representative: select_representative(group),
            strength: 1.0,  // Exact match = maximum strength
          });
          ids.forEach(id => processedIds.add(id));
        }
      }
    }

    for (const group of triggerGroups) {
      if (group.length >= minOccurrences) {
        const ids = group.map(m => m.id);
        if (!ids.some(id => processedIds.has(id))) {
          patterns.push({
            type: 'trigger_similarity',
            pattern_id: `trig-${crypto.randomBytes(4).toString('hex')}`,
            occurrences: group.length,
            memories: group,
            representative: select_representative(group),
            strength: calculate_group_strength(group),
          });
          ids.forEach(id => processedIds.add(id));
        }
      }
    }

    for (const group of titleGroups) {
      if (group.length >= minOccurrences) {
        const ids = group.map(m => m.id);
        if (!ids.some(id => processedIds.has(id))) {
          patterns.push({
            type: 'title_similarity',
            pattern_id: `title-${crypto.randomBytes(4).toString('hex')}`,
            occurrences: group.length,
            memories: group,
            representative: select_representative(group),
            strength: calculate_group_strength(group),
          });
          ids.forEach(id => processedIds.add(id));
        }
      }
    }

    const limitedPatterns = patterns
      .sort((a, b) => b.strength - a.strength)
      .slice(0, config.maxPatternsPerRun);

    return {
      phase: 'ABSTRACT',
      success: true,
      patternCount: limitedPatterns.length,
      patterns: limitedPatterns,
      config: {
        minOccurrences,
        candidateCount: candidates.length,
        uniqueHashGroups: hashGroups.size,
      },
    };
  } catch (error) {
    console.error(`[consolidation] ABSTRACT phase error: ${error.message}`);
    return {
      phase: 'ABSTRACT',
      success: false,
      error: error.message,
      patternCount: 0,
      patterns: [],
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   5. PHASE 3: INTEGRATE (T081)
────────────────────────────────────────────────────────────────*/

/**
 * T081: INTEGRATE phase - Merge patterns into semantic memories
 *
 * Creates new semantic memories from strong patterns,
 * consolidating episodic experiences into long-term knowledge.
 *
 * @param {Array} patterns - Patterns from ABSTRACT phase
 * @param {Object} options - Integration options
 * @param {boolean} options.dryRun - If true, don't write to database
 * @returns {Object} Integration results
 */
function integrate_phase(patterns, options = {}) {
  if (!db) {
    throw new Error('[consolidation] Database not initialized. Call init() first.');
  }

  if (!Array.isArray(patterns) || patterns.length === 0) {
    return {
      phase: 'INTEGRATE',
      success: true,
      integratedCount: 0,
      integrated: [],
      message: 'No patterns to integrate',
    };
  }

  const config = { ...CONSOLIDATION_CONFIG.integrate, ...options };
  const dryRun = options.dryRun !== undefined ? options.dryRun : CONSOLIDATION_CONFIG.safety.dryRunDefault;

  try {
    const integrated = [];
    const eligible = patterns.filter(p => p.strength >= config.minPatternStrength);

    if (dryRun) {
      for (const pattern of eligible) {
        integrated.push({
          pattern_id: pattern.pattern_id,
          would_create: {
            title: generate_semantic_title(pattern),
            memory_type: config.targetType,
            half_life_days: config.halfLifeDays,
            source_memories: pattern.memories.map(m => m.id),
            strength: pattern.strength,
          },
        });
      }

      return {
        phase: 'INTEGRATE',
        success: true,
        dryRun: true,
        integratedCount: integrated.length,
        integrated: integrated,
        skipped: patterns.length - eligible.length,
        message: 'Dry run - no changes made',
      };
    }

    const insertStmt = db.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, title, memory_type,
        importance_tier, importance_weight, half_life_days,
        trigger_phrases, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    for (const pattern of eligible) {
      const representative = pattern.representative || pattern.memories[0];
      const title = generate_semantic_title(pattern);
      const triggerPhrases = merge_trigger_phrases(pattern.memories);

      try {
        const result = insertStmt.run(
          representative.spec_folder,
          null,  // Consolidated memories don't have file paths
          title,
          config.targetType,
          'normal',
          pattern.strength,
          config.halfLifeDays,
          triggerPhrases,
          now,
          now
        );

        integrated.push({
          pattern_id: pattern.pattern_id,
          new_memory_id: result.lastInsertRowid,
          title: title,
          source_memories: pattern.memories.map(m => m.id),
          strength: pattern.strength,
        });
      } catch (insertError) {
        console.warn(`[consolidation] Failed to integrate pattern ${pattern.pattern_id}: ${insertError.message}`);
      }
    }

    return {
      phase: 'INTEGRATE',
      success: true,
      dryRun: false,
      integratedCount: integrated.length,
      integrated: integrated,
      skipped: patterns.length - eligible.length,
    };
  } catch (error) {
    console.error(`[consolidation] INTEGRATE phase error: ${error.message}`);
    return {
      phase: 'INTEGRATE',
      success: false,
      error: error.message,
      integratedCount: 0,
      integrated: [],
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   6. PHASE 4: PRUNE (T082)
────────────────────────────────────────────────────────────────*/

/**
 * T082: PRUNE phase - Archive redundant episodic memories
 *
 * After integration, marks redundant episodic memories as deprecated
 * while preserving at least one representative.
 *
 * R14 Mitigation: Creates backup checkpoint before pruning.
 *
 * @param {Array} patterns - Integrated patterns from INTEGRATE phase
 * @param {Object} options - Prune options
 * @param {boolean} options.dryRun - If true, don't write to database
 * @param {boolean} options.createBackup - Create checkpoint before prune
 * @returns {Object} Prune results
 */
function prune_phase(patterns, options = {}) {
  if (!db) {
    throw new Error('[consolidation] Database not initialized. Call init() first.');
  }

  if (!Array.isArray(patterns) || patterns.length === 0) {
    return {
      phase: 'PRUNE',
      success: true,
      prunedCount: 0,
      pruned: [],
      message: 'No patterns to prune',
    };
  }

  const config = { ...CONSOLIDATION_CONFIG.prune, ...options };
  const dryRun = options.dryRun !== undefined ? options.dryRun : CONSOLIDATION_CONFIG.safety.dryRunDefault;
  const createBackup = options.createBackup !== undefined ? options.createBackup : CONSOLIDATION_CONFIG.safety.backupBeforePrune;

  try {
    const toPrune = [];
    const preserved = [];

    for (const pattern of patterns) {
      if (!pattern.memories || pattern.memories.length === 0) continue;

      const representativeId = pattern.representative?.id || pattern.memories[0].id;

      for (const memory of pattern.memories) {
        if (memory.id === representativeId) {
          preserved.push(memory.id);
        } else {
          toPrune.push({
            id: memory.id,
            title: memory.title,
            pattern_id: pattern.pattern_id,
          });
        }
      }
    }

    if (toPrune.length === 0) {
      return {
        phase: 'PRUNE',
        success: true,
        prunedCount: 0,
        preservedCount: preserved.length,
        pruned: [],
        message: 'No redundant memories to prune',
      };
    }

    if (dryRun) {
      return {
        phase: 'PRUNE',
        success: true,
        dryRun: true,
        prunedCount: toPrune.length,
        preservedCount: preserved.length,
        pruned: toPrune,
        message: 'Dry run - no changes made',
      };
    }

    // R14 Mitigation: Backup before pruning prevents accidental data loss
    let backupId = null;
    if (createBackup) {
      try {
        const backupName = `${CONSOLIDATION_CONFIG.safety.backupPrefix}${Date.now()}`;
        backupId = checkpoints.create(backupName, {
          metadata: {
            type: 'consolidation-backup',
            prunedCount: toPrune.length,
            preservedCount: preserved.length,
          },
        });
        console.log(`[consolidation] Created backup checkpoint: ${backupName}`);
      } catch (backupError) {
        console.warn(`[consolidation] Failed to create backup: ${backupError.message}`);
        // Backup failure shouldn't block consolidation
      }
    }

    const updateStmt = db.prepare(`
      UPDATE memory_index
      SET importance_tier = ?,
          updated_at = ?
      WHERE id = ?
    `);

    const now = new Date().toISOString();
    let prunedCount = 0;

    for (const memory of toPrune) {
      try {
        updateStmt.run(config.archivalTier, now, memory.id);
        prunedCount++;
      } catch (updateError) {
        console.warn(`[consolidation] Failed to prune memory ${memory.id}: ${updateError.message}`);
      }
    }

    return {
      phase: 'PRUNE',
      success: true,
      dryRun: false,
      prunedCount: prunedCount,
      preservedCount: preserved.length,
      pruned: toPrune.slice(0, prunedCount),
      backupId: backupId,
    };
  } catch (error) {
    console.error(`[consolidation] PRUNE phase error: ${error.message}`);
    return {
      phase: 'PRUNE',
      success: false,
      error: error.message,
      prunedCount: 0,
      pruned: [],
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   7. PHASE 5: STRENGTHEN (T083)
────────────────────────────────────────────────────────────────*/

/**
 * T083: STRENGTHEN phase - Boost high-access memories
 *
 * Increases stability of frequently accessed memories,
 * reinforcing important knowledge.
 *
 * @param {Object} options - Strengthen options
 * @param {number} options.minAccessCount - Minimum accesses to qualify
 * @param {number} options.stabilityBoost - Stability multiplier
 * @param {boolean} options.dryRun - If true, don't write to database
 * @returns {Object} Strengthen results
 */
function strengthen_phase(options = {}) {
  if (!db) {
    throw new Error('[consolidation] Database not initialized. Call init() first.');
  }

  const config = { ...CONSOLIDATION_CONFIG.strengthen, ...options };
  const dryRun = options.dryRun !== undefined ? options.dryRun : CONSOLIDATION_CONFIG.safety.dryRunDefault;

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1);  // Don't re-strengthen within 24 hours

    const candidates = db.prepare(`
      SELECT
        id,
        title,
        access_count,
        stability,
        last_review,
        updated_at
      FROM memory_index
      WHERE access_count >= ?
        AND importance_tier NOT IN ('deprecated', 'temporary')
        AND (last_review IS NULL OR last_review < ?)
      ORDER BY access_count DESC
      LIMIT 100
    `).all(config.minAccessCount, cutoffDate.toISOString());

    if (candidates.length === 0) {
      return {
        phase: 'STRENGTHEN',
        success: true,
        strengthenedCount: 0,
        strengthened: [],
        message: 'No high-access memories to strengthen',
      };
    }

    const toStrengthen = candidates.map(memory => {
      const currentStability = memory.stability || 1.0;
      const newStability = Math.min(
        currentStability * config.stabilityBoost,
        config.maxStability
      );

      return {
        id: memory.id,
        title: memory.title,
        access_count: memory.access_count,
        old_stability: currentStability,
        new_stability: newStability,
        boost_applied: newStability / currentStability,
      };
    });

    if (dryRun) {
      return {
        phase: 'STRENGTHEN',
        success: true,
        dryRun: true,
        strengthenedCount: toStrengthen.length,
        strengthened: toStrengthen,
        message: 'Dry run - no changes made',
      };
    }

    const updateStmt = db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          last_review = ?,
          updated_at = ?
      WHERE id = ?
    `);

    const now = new Date().toISOString();
    let strengthenedCount = 0;

    for (const memory of toStrengthen) {
      try {
        updateStmt.run(memory.new_stability, now, now, memory.id);
        strengthenedCount++;
      } catch (updateError) {
        console.warn(`[consolidation] Failed to strengthen memory ${memory.id}: ${updateError.message}`);
      }
    }

    return {
      phase: 'STRENGTHEN',
      success: true,
      dryRun: false,
      strengthenedCount: strengthenedCount,
      strengthened: toStrengthen.slice(0, strengthenedCount),
    };
  } catch (error) {
    console.error(`[consolidation] STRENGTHEN phase error: ${error.message}`);
    return {
      phase: 'STRENGTHEN',
      success: false,
      error: error.message,
      strengthenedCount: 0,
      strengthened: [],
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   8. FULL PIPELINE
────────────────────────────────────────────────────────────────*/

/**
 * Run the complete 5-phase consolidation pipeline
 *
 * Phases:
 * 1. REPLAY: Select episodic memories > 7 days old
 * 2. ABSTRACT: Extract patterns with 2+ occurrences
 * 3. INTEGRATE: Merge patterns into semantic memories
 * 4. PRUNE: Archive redundant episodes
 * 5. STRENGTHEN: Boost high-access memories
 *
 * @param {Object} options - Pipeline options
 * @param {boolean} options.dryRun - If true, don't write to database (R14 mitigation)
 * @param {boolean} options.createBackup - Create backup before prune (R14 mitigation)
 * @param {string} options.specFolder - Filter by spec folder
 * @returns {Object} Complete pipeline results
 */
function run_consolidation(options = {}) {
  if (!db) {
    throw new Error('[consolidation] Database not initialized. Call init() first.');
  }

  const dryRun = options.dryRun !== undefined ? options.dryRun : CONSOLIDATION_CONFIG.safety.dryRunDefault;
  const startTime = Date.now();

  const results = {
    success: true,
    dryRun: dryRun,
    startTime: new Date().toISOString(),
    phases: {},
  };

  try {
    console.log('[consolidation] Starting Phase 1: REPLAY');
    const replayResult = replay_phase(options);
    results.phases.replay = replayResult;

    if (!replayResult.success || replayResult.candidateCount === 0) {
      results.phases.abstract = { phase: 'ABSTRACT', skipped: true, reason: 'No replay candidates' };
      results.phases.integrate = { phase: 'INTEGRATE', skipped: true, reason: 'No patterns' };
      results.phases.prune = { phase: 'PRUNE', skipped: true, reason: 'No integrations' };
    } else {
      console.log(`[consolidation] Starting Phase 2: ABSTRACT (${replayResult.candidateCount} candidates)`);
      const abstractResult = abstract_phase(replayResult.candidates, options);
      results.phases.abstract = abstractResult;

      if (!abstractResult.success || abstractResult.patternCount === 0) {
        results.phases.integrate = { phase: 'INTEGRATE', skipped: true, reason: 'No patterns extracted' };
        results.phases.prune = { phase: 'PRUNE', skipped: true, reason: 'No integrations' };
      } else {
        console.log(`[consolidation] Starting Phase 3: INTEGRATE (${abstractResult.patternCount} patterns)`);
        const integrateResult = integrate_phase(abstractResult.patterns, { dryRun });
        results.phases.integrate = integrateResult;

        if (integrateResult.success && integrateResult.integratedCount > 0) {
          console.log(`[consolidation] Starting Phase 4: PRUNE (${integrateResult.integratedCount} integrated)`);
          const pruneResult = prune_phase(abstractResult.patterns, {
            dryRun,
            createBackup: options.createBackup,
          });
          results.phases.prune = pruneResult;
        } else {
          results.phases.prune = { phase: 'PRUNE', skipped: true, reason: 'No integrations' };
        }
      }
    }

    // STRENGTHEN runs independently of the replay->abstract->integrate->prune chain
    console.log('[consolidation] Starting Phase 5: STRENGTHEN');
    const strengthenResult = strengthen_phase({ dryRun });
    results.phases.strengthen = strengthenResult;

    results.endTime = new Date().toISOString();
    results.durationMs = Date.now() - startTime;
    results.summary = {
      replayed: replayResult.candidateCount || 0,
      patterns: results.phases.abstract?.patternCount || 0,
      integrated: results.phases.integrate?.integratedCount || 0,
      pruned: results.phases.prune?.prunedCount || 0,
      strengthened: results.phases.strengthen?.strengthenedCount || 0,
    };

    console.log(`[consolidation] Pipeline complete in ${results.durationMs}ms`);
    return results;

  } catch (error) {
    console.error(`[consolidation] Pipeline error: ${error.message}`);
    results.success = false;
    results.error = error.message;
    results.endTime = new Date().toISOString();
    results.durationMs = Date.now() - startTime;
    return results;
  }
}

/* ─────────────────────────────────────────────────────────────
   9. HELPER FUNCTIONS
────────────────────────────────────────────────────────────────*/

/**
 * Generate content hash for deduplication
 */
function generate_content_hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Group memories by trigger phrase similarity
 */
function group_by_triggers(memories, threshold) {
  const groups = [];
  const assigned = new Set();

  for (let i = 0; i < memories.length; i++) {
    if (assigned.has(memories[i].id)) continue;

    const group = [memories[i]];
    assigned.add(memories[i].id);

    for (let j = i + 1; j < memories.length; j++) {
      if (assigned.has(memories[j].id)) continue;

      const similarity = calculate_trigger_similarity(
        memories[i].trigger_phrases,
        memories[j].trigger_phrases
      );

      if (similarity >= threshold) {
        group.push(memories[j]);
        assigned.add(memories[j].id);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  return groups;
}

/**
 * Group memories by title similarity
 */
function group_by_title_similarity(memories, threshold) {
  const groups = [];
  const assigned = new Set();

  for (let i = 0; i < memories.length; i++) {
    if (assigned.has(memories[i].id)) continue;

    const group = [memories[i]];
    assigned.add(memories[i].id);

    for (let j = i + 1; j < memories.length; j++) {
      if (assigned.has(memories[j].id)) continue;

      const similarity = calculate_string_similarity(
        memories[i].title || '',
        memories[j].title || ''
      );

      if (similarity >= threshold) {
        group.push(memories[j]);
        assigned.add(memories[j].id);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  return groups;
}

/**
 * Calculate Jaccard similarity between trigger phrase sets
 */
function calculate_trigger_similarity(triggers1, triggers2) {
  if (!triggers1 || !triggers2) return 0;

  const set1 = new Set(
    (typeof triggers1 === 'string' ? triggers1.split(',') : triggers1)
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0)
  );

  const set2 = new Set(
    (typeof triggers2 === 'string' ? triggers2.split(',') : triggers2)
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0)
  );

  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Calculate normalized string similarity (simple word overlap)
 */
function calculate_string_similarity(str1, str2) {
  if (!str1 || !str2) return 0;

  const words1 = str1.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const words2 = str2.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Select representative memory from a group
 * Prefers: highest access count, then most recent, then first
 */
function select_representative(group) {
  if (!group || group.length === 0) return null;

  // Prefers: highest access count, then most recent, then first
  return group.reduce((best, current) => {
    if ((current.access_count || 0) > (best.access_count || 0)) {
      return current;
    }
    if ((current.access_count || 0) === (best.access_count || 0)) {
      if (current.updated_at > best.updated_at) {
        return current;
      }
    }
    return best;
  }, group[0]);
}

/**
 * Calculate pattern strength based on group characteristics
 */
function calculate_group_strength(group) {
  if (!group || group.length === 0) return 0;

  // 60% occurrence count + 40% access frequency
  const occurrenceScore = Math.min(1, group.length / 10);
  const totalAccess = group.reduce((sum, m) => sum + (m.access_count || 0), 0);
  const accessScore = Math.min(1, totalAccess / 50);

  return (occurrenceScore * 0.6) + (accessScore * 0.4);
}

/**
 * Generate title for consolidated semantic memory
 */
function generate_semantic_title(pattern) {
  const representative = pattern.representative || pattern.memories[0];
  const baseTitle = representative?.title || 'Consolidated Memory';
  const cleanTitle = baseTitle
    .replace(/^(Session|Debug|Episode|Event)[\s:-]*/i, '')
    .trim();

  return `[Consolidated] ${cleanTitle}`;
}

/**
 * Merge trigger phrases from multiple memories
 */
function merge_trigger_phrases(memories) {
  const allTriggers = new Set();

  for (const memory of memories) {
    if (!memory.trigger_phrases) continue;

    const triggers = typeof memory.trigger_phrases === 'string'
      ? memory.trigger_phrases.split(',')
      : memory.trigger_phrases;

    for (const trigger of triggers) {
      const cleaned = trigger.trim().toLowerCase();
      if (cleaned.length > 0) {
        allTriggers.add(cleaned);
      }
    }
  }

  return [...allTriggers].join(', ');
}

/* ─────────────────────────────────────────────────────────────
   10. SCHEDULING
────────────────────────────────────────────────────────────────*/

let scheduledInterval = null;

/**
 * Schedule consolidation to run periodically
 *
 * @param {number} intervalMs - Interval between runs in milliseconds
 * @param {Object} options - Consolidation options
 */
function schedule_consolidation(intervalMs, options = {}) {
  if (scheduledInterval) {
    console.warn('[consolidation] Consolidation already scheduled. Call stop_scheduled() first.');
    return false;
  }

  const interval = intervalMs || 24 * 60 * 60 * 1000;  // Default 24 hours

  scheduledInterval = setInterval(() => {
    console.log('[consolidation] Running scheduled consolidation');
    run_consolidation({ ...options, dryRun: false });
  }, interval);

  console.log(`[consolidation] Scheduled consolidation every ${interval / 1000}s`);
  return true;
}

/**
 * Stop scheduled consolidation
 */
function stop_scheduled() {
  if (scheduledInterval) {
    clearInterval(scheduledInterval);
    scheduledInterval = null;
    console.log('[consolidation] Stopped scheduled consolidation');
    return true;
  }
  return false;
}

/**
 * Check if consolidation is scheduled
 */
function is_scheduled() {
  return scheduledInterval !== null;
}

/* ─────────────────────────────────────────────────────────────
   11. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  init,
  get_db,
  replay_phase,
  abstract_phase,
  integrate_phase,
  prune_phase,
  strengthen_phase,
  run_consolidation,
  schedule_consolidation,
  stop_scheduled,
  is_scheduled,
  CONSOLIDATION_CONFIG,
  generate_content_hash,
  calculate_trigger_similarity,
  calculate_string_similarity,
  select_representative,
  calculate_group_strength,
};
