// ───────────────────────────────────────────────────────────────
// HANDLERS: MEMORY SAVE
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
   ─────────────────────────────────────────────────────────────── */

// Core configuration and state
const {
  LIB_DIR,
  SHARED_DIR,
  ALLOWED_BASE_PATHS,
  check_database_updated
} = require('../core');

// Utils for validation
const { create_file_path_validator } = require('../utils/validators');

// Shared utilities
const { validate_file_path } = require(path.join(SHARED_DIR, 'utils'));

// Create local path validator
const validate_file_path_local = create_file_path_validator(ALLOWED_BASE_PATHS, validate_file_path);

// Lib modules (loaded from lib directory)
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));
const memoryParser = require(path.join(LIB_DIR, 'parsing', 'memory-parser.js'));
const triggerMatcher = require(path.join(LIB_DIR, 'parsing', 'trigger-matcher.js'));

// Cognitive modules for PE gating and FSRS
const predictionErrorGate = require(path.join(LIB_DIR, 'cognitive', 'prediction-error-gate.js'));
const fsrsScheduler = require(path.join(LIB_DIR, 'cognitive', 'fsrs-scheduler.js'));

/* ───────────────────────────────────────────────────────────────
   2. PE GATING HELPER FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

/**
 * Find similar memories using vector search for PE gating.
 * Searches for candidate memories to compare against new content.
 *
 * @param {Float32Array} embedding - Embedding of new content
 * @param {Object} options - Search options
 * @param {number} options.limit - Max candidates to return (default: 5)
 * @param {string} options.specFolder - Filter by spec folder (optional)
 * @returns {Array} Array of candidate memories with similarity scores
 */
function find_similar_memories(embedding, options = {}) {
  const { limit = 5, specFolder = null } = options;
  const database = vectorIndex.getDb();

  // Guard: validate embedding
  if (!embedding) {
    return [];
  }

  // Use vector search to find similar memories
  try {
    const results = vectorIndex.vectorSearch(embedding, {
      limit: limit,
      specFolder: specFolder,
      minSimilarity: 50,  // Only consider memories with >50% similarity
      includeConstitutional: false  // Don't include constitutional in PE comparison
    });

    // Add content for contradiction detection
    return results.map(r => ({
      id: r.id,
      similarity: r.similarity / 100,  // Convert to 0-1 range
      content: r.content || '',
      stability: r.stability || fsrsScheduler.DEFAULT_STABILITY,
      difficulty: r.difficulty || fsrsScheduler.DEFAULT_DIFFICULTY,
      file_path: r.file_path
    }));
  } catch (err) {
    console.warn('[PE-Gate] Vector search failed:', err.message);
    return [];
  }
}

/**
 * Reinforce an existing memory instead of creating new.
 * Called when PE gate determines content is duplicate (similarity >= 0.95).
 *
 * @param {number} memory_id - ID of existing memory to reinforce
 * @param {Object} parsed - Parsed content from new memory file
 * @returns {Object} Result with status and updated state
 */
function reinforce_existing_memory(memory_id, parsed) {
  const database = vectorIndex.getDb();

  // BUG-006 fix: Wrap database operations in try/catch to handle unhandled promise rejection
  try {
    // Get current memory state
    const memory = database.prepare(`
      SELECT id, stability, difficulty, last_review, review_count, title
      FROM memory_index
      WHERE id = ?
    `).get(memory_id);

    if (!memory) {
      throw new Error(`Memory ${memory_id} not found for reinforcement`);
    }

    // Calculate current retrievability
    const elapsed_days = fsrsScheduler.calculate_elapsed_days(memory.last_review);
    const current_stability = memory.stability || fsrsScheduler.DEFAULT_STABILITY;
    const current_difficulty = memory.difficulty || fsrsScheduler.DEFAULT_DIFFICULTY;
    const retrievability = fsrsScheduler.calculate_retrievability(current_stability, elapsed_days);

    // Update stability using GOOD grade (successful reinforcement)
    const new_stability = fsrsScheduler.update_stability(
      current_stability,
      current_difficulty,
      retrievability,
      fsrsScheduler.GRADE_GOOD
    );

    // Update memory in database
    database.prepare(`
      UPDATE memory_index
      SET stability = ?,
          last_review = datetime('now'),
          review_count = COALESCE(review_count, 0) + 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(new_stability, memory_id);

    return {
      status: 'reinforced',
      id: memory_id,
      title: memory.title,
      specFolder: parsed.specFolder,
      previous_stability: current_stability,
      new_stability: new_stability,
      retrievability: retrievability
    };
  } catch (err) {
    console.error('[memory-save] PE reinforcement failed:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Mark an existing memory as superseded.
 * Called when PE gate detects contradiction with new content.
 *
 * @param {number} memory_id - ID of memory to mark as superseded
 * @returns {boolean} Success status
 */
function mark_memory_superseded(memory_id) {
  const database = vectorIndex.getDb();

  try {
    database.prepare(`
      UPDATE memory_index
      SET importance_tier = 'deprecated',
          updated_at = datetime('now')
      WHERE id = ?
    `).run(memory_id);

    console.log(`[PE-Gate] Memory ${memory_id} marked as superseded`);
    return true;
  } catch (err) {
    console.warn('[PE-Gate] Failed to mark memory as superseded:', err.message);
    return false;
  }
}

/**
 * Update an existing memory with new content.
 * Called when PE gate determines content is an update (similarity 0.90-0.94).
 *
 * @param {number} memory_id - ID of existing memory to update
 * @param {Object} parsed - Parsed content from new memory file
 * @param {Float32Array} embedding - New embedding
 * @returns {Object} Result with status and updated state
 */
function update_existing_memory(memory_id, parsed, embedding) {
  const database = vectorIndex.getDb();

  // Update memory with new content and embedding
  vectorIndex.updateMemory({
    id: memory_id,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    embedding: embedding
  });

  // Update metadata
  database.prepare(`
    UPDATE memory_index
    SET content_hash = ?,
        context_type = ?,
        importance_tier = ?,
        last_review = datetime('now'),
        review_count = COALESCE(review_count, 0) + 1,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, memory_id);

  return {
    status: 'updated',
    id: memory_id,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier
  };
}

/**
 * Log PE decision to memory_conflicts table for audit trail.
 *
 * @param {Object} decision - PE gate decision
 * @param {string} content_hash - Hash of new content
 * @param {string} spec_folder - Spec folder path
 */
function log_pe_decision(decision, content_hash, spec_folder) {
  const database = vectorIndex.getDb();

  try {
    // Check if memory_conflicts table exists
    const table_exists = database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='memory_conflicts'
    `).get();

    if (!table_exists) {
      // Table doesn't exist yet - will be created by schema migration
      console.log('[PE-Gate] memory_conflicts table not yet created, skipping log');
      return;
    }

    database.prepare(`
      INSERT INTO memory_conflicts (
        new_memory_hash,
        existing_memory_id,
        similarity_score,
        action,
        contradiction_detected,
        notes,
        spec_folder,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      content_hash,
      decision.candidate?.id || null,
      decision.similarity || 0,
      decision.action,
      decision.contradiction?.found ? 1 : 0,
      decision.reason || '',
      spec_folder
    );
  } catch (err) {
    // Log but don't fail if conflict logging fails
    if (!err.message.includes('no such table') && !err.message.includes('no such column')) {
      console.warn('[PE-Gate] Failed to log conflict:', err.message);
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   3. INDEX MEMORY FILE
   ─────────────────────────────────────────────────────────────── */

/**
 * Index a single memory file with vector embedding.
 * Parses the memory file, generates an embedding, and stores
 * it in the database with all metadata.
 *
 * @param {string} file_path - Validated absolute path to memory file
 * @param {Object} options - Indexing options
 * @param {boolean} options.force - Force re-index even if content unchanged
 * @returns {Promise<Object>} Result with status, id, specFolder, warnings, and parsed metadata
 * @throws {Error} If validation fails or embedding generation fails
 */
async function index_memory_file(file_path, { force = false } = {}) {
  // Parse the memory file
  const parsed = memoryParser.parseMemoryFile(file_path);

  // Validate parsed content
  const validation = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Log warnings about anchor issues (don't block indexing)
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(file_path)}:`);
    validation.warnings.forEach(w => console.warn(`[memory]   - ${w}`));
  }

  // Check if already indexed with same content hash
  const database = vectorIndex.getDb();
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE file_path = ?
  `).get(file_path);

  if (existing && existing.content_hash === parsed.contentHash && !force) {
    return {
      status: 'unchanged',
      id: existing.id,
      specFolder: parsed.specFolder,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      warnings: validation.warnings
    };
  }

  // Generate embedding (needed for both PE gating and indexing)
  const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
  if (!embedding) {
    throw new Error('Failed to generate embedding for memory content');
  }

  // ─────────────────────────────────────────────────────────────
  // PE GATING: Check for duplicates/conflicts before creating
  // ─────────────────────────────────────────────────────────────
  const candidates = find_similar_memories(embedding, {
    limit: 5,
    specFolder: parsed.specFolder
  });

  // Evaluate PE decision
  const pe_decision = predictionErrorGate.evaluate_memory(
    candidates,
    parsed.content,
    { check_contradictions: true }
  );

  // Log PE decision for audit trail
  log_pe_decision(pe_decision, parsed.contentHash, parsed.specFolder);

  // Handle PE decision
  switch (pe_decision.action) {
    case predictionErrorGate.ACTION.REINFORCE: {
      // Strengthen existing memory instead of creating new
      console.log(`[PE-Gate] REINFORCE: Duplicate detected (${(pe_decision.similarity * 100).toFixed(1)}%)`);
      const reinforced = reinforce_existing_memory(pe_decision.candidate.id, parsed);
      reinforced.pe_action = 'REINFORCE';
      reinforced.pe_reason = pe_decision.reason;
      reinforced.warnings = validation.warnings;
      return reinforced;
    }

    case predictionErrorGate.ACTION.SUPERSEDE: {
      // Mark old as superseded, then create new
      console.log(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${pe_decision.candidate.id}`);
      mark_memory_superseded(pe_decision.candidate.id);
      // Continue to create new memory below
      break;
    }

    case predictionErrorGate.ACTION.UPDATE: {
      // Update existing memory with new content
      console.log(`[PE-Gate] UPDATE: High similarity (${(pe_decision.similarity * 100).toFixed(1)}%), updating existing`);
      const updated = update_existing_memory(pe_decision.candidate.id, parsed, embedding);
      updated.pe_action = 'UPDATE';
      updated.pe_reason = pe_decision.reason;
      updated.warnings = validation.warnings;
      return updated;
    }

    case predictionErrorGate.ACTION.CREATE_LINKED: {
      // Create new memory with link to related
      console.log(`[PE-Gate] CREATE_LINKED: Related content (${(pe_decision.similarity * 100).toFixed(1)}%)`);
      // Continue to create new memory, but store related_ids
      break;
    }

    case predictionErrorGate.ACTION.CREATE:
    default:
      // Continue with normal creation
      if (pe_decision.similarity > 0) {
        console.log(`[PE-Gate] CREATE: Low similarity (${(pe_decision.similarity * 100).toFixed(1)}%)`);
      }
      break;
  }

  // ─────────────────────────────────────────────────────────────
  // CREATE NEW MEMORY
  // Index the memory and update metadata atomically
  // ─────────────────────────────────────────────────────────────
  const index_with_metadata = database.transaction(() => {
    const memory_id = vectorIndex.indexMemory({
      specFolder: parsed.specFolder,
      filePath: file_path,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      importanceWeight: 0.5,
      embedding: embedding
    });

    // Update additional metadata and initialize FSRS columns
    database.prepare(`
      UPDATE memory_index
      SET content_hash = ?,
          context_type = ?,
          importance_tier = ?,
          stability = ?,
          difficulty = ?,
          last_review = datetime('now'),
          review_count = 0
      WHERE id = ?
    `).run(
      parsed.contentHash,
      parsed.contextType,
      parsed.importanceTier,
      fsrsScheduler.DEFAULT_STABILITY,
      fsrsScheduler.DEFAULT_DIFFICULTY,
      memory_id
    );

    // Store related memories if PE gate identified them
    if (pe_decision.action === predictionErrorGate.ACTION.CREATE_LINKED && pe_decision.related_ids) {
      try {
        database.prepare(`
          UPDATE memory_index
          SET related_memories = ?
          WHERE id = ?
        `).run(JSON.stringify(pe_decision.related_ids), memory_id);
      } catch (err) {
        // related_memories column may not exist yet
        console.log('[PE-Gate] Could not store related memories:', err.message);
      }
    }

    return memory_id;
  });

  const id = index_with_metadata();

  const result = {
    status: existing ? 'updated' : 'indexed',
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    warnings: validation.warnings
  };

  // Add PE gate info to result
  if (pe_decision.action !== predictionErrorGate.ACTION.CREATE) {
    result.pe_action = pe_decision.action;
    result.pe_reason = pe_decision.reason;
  }

  if (pe_decision.action === predictionErrorGate.ACTION.SUPERSEDE) {
    result.superseded_id = pe_decision.candidate.id;
  }

  if (pe_decision.action === predictionErrorGate.ACTION.CREATE_LINKED && pe_decision.related_ids) {
    result.related_ids = pe_decision.related_ids;
  }

  return result;
}

/* ───────────────────────────────────────────────────────────────
   4. MEMORY SAVE HANDLER
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_save tool - index a single memory file.
 * Validates the file path, checks if it's a valid memory file,
 * and indexes it with embeddings.
 *
 * @param {Object} args - Tool arguments
 * @param {string} args.filePath - Path to the memory file to index
 * @param {boolean} [args.force=false] - Force re-index even if unchanged
 * @returns {Promise<Object>} MCP tool response with status and metadata
 * @throws {Error} If path is invalid or not a memory file
 */
async function handle_memory_save(args) {
  // BUG-001: Check for external database updates before processing
  await check_database_updated();

  const { filePath: file_path, force = false } = args;

  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  // Validate path
  const validated_path = validate_file_path_local(file_path);

  // Check if it's a valid memory file
  if (!memoryParser.isMemoryFile(validated_path)) {
    throw new Error('File must be in specs/**/memory/ or .opencode/specs/**/memory/ or .opencode/skill/*/constitutional/ directory and have .md extension');
  }

  // Use shared indexing logic
  const result = await index_memory_file(validated_path, { force });

  // Format response for unchanged status
  if (result.status === 'unchanged') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'unchanged',
          id: result.id,
          message: 'Memory already indexed with same content',
          specFolder: result.specFolder,
          title: result.title
        }, null, 2)
      }]
    };
  }

  // P1-005: Clear trigger cache after mutation to prevent stale data
  triggerMatcher.clearCache();

  // Build response for indexed/updated/reinforced status
  const response = {
    status: result.status,
    id: result.id,
    specFolder: result.specFolder,
    title: result.title,
    triggerPhrases: result.triggerPhrases,
    contextType: result.contextType,
    importanceTier: result.importanceTier,
    message: `Memory ${result.status} successfully`
  };

  // Add PE gate information if present
  if (result.pe_action) {
    response.pe_action = result.pe_action;
    response.pe_reason = result.pe_reason;
    response.message = `Memory ${result.status} (PE: ${result.pe_action})`;
  }

  // Add superseded memory info for SUPERSEDE action
  if (result.superseded_id) {
    response.superseded_id = result.superseded_id;
    response.message += ` - superseded memory #${result.superseded_id}`;
  }

  // Add related memories info for CREATE_LINKED action
  if (result.related_ids) {
    response.related_ids = result.related_ids;
  }

  // Add stability info for REINFORCE action
  if (result.previous_stability !== undefined) {
    response.previous_stability = result.previous_stability;
    response.new_stability = result.new_stability;
    response.retrievability = result.retrievability;
  }

  // Add warnings to response if present
  if (result.warnings && result.warnings.length > 0) {
    response.warnings = result.warnings;
    response.message += ` (with ${result.warnings.length} warning(s) - anchor issues detected)`;
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  index_memory_file,
  handle_memory_save,

  // PE gating helper functions
  find_similar_memories,
  reinforce_existing_memory,
  mark_memory_superseded,
  update_existing_memory,
  log_pe_decision,

  // Backward compatibility aliases (camelCase)
  indexMemoryFile: index_memory_file,
  handleMemorySave: handle_memory_save,
  findSimilarMemories: find_similar_memories,
  reinforceExistingMemory: reinforce_existing_memory,
  markMemorySuperseded: mark_memory_superseded,
  updateExistingMemory: update_existing_memory,
  logPeDecision: log_pe_decision
};
