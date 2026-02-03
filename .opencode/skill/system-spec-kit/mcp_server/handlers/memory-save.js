// ───────────────────────────────────────────────────────────────
// HANDLER: MEMORY SAVE
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. DEPENDENCIES
────────────────────────────────────────────────────────────────*/

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

// T030: BM25 indexing for hybrid search (REQ-014, REQ-028)
const bm25Index = require(path.join(LIB_DIR, 'search', 'bm25-index.js'));

// Cognitive modules for PE gating and FSRS
const predictionErrorGate = require(path.join(LIB_DIR, 'cognitive', 'prediction-error-gate.js'));
const fsrsScheduler = require(path.join(LIB_DIR, 'cognitive', 'fsrs-scheduler.js'));

// T105-T107: Transaction manager for memory save atomicity (REQ-033)
const transactionManager = require(path.join(LIB_DIR, 'storage', 'transaction-manager.js'));

// T064-T066: Incremental indexing for mtime tracking (REQ-023)
const incrementalIndex = require(path.join(LIB_DIR, 'storage', 'incremental-index.js'));

// Pre-flight validation (T067-T070: REQ-024)
const preflight = require(path.join(LIB_DIR, 'validation', 'preflight.js'));

// T015: Tool cache for write operation invalidation
const toolCache = require(path.join(LIB_DIR, 'cache', 'tool-cache.js'));

// REQ-019: Standardized Response Structure
const { createMCPSuccessResponse } = require(path.join(LIB_DIR, 'response', 'envelope.js'));

// T099: Retry manager for opportunistic background processing (REQ-031, CHK-179)
const retryManager = require(path.join(LIB_DIR, 'providers', 'retry-manager.js'));

// T126: Causal edges for memory graph relationships (REQ-012, CHK-231)
const causalEdges = require(path.join(LIB_DIR, 'storage', 'causal-edges.js'));

/* ─────────────────────────────────────────────────────────────
   2. PE GATING HELPER FUNCTIONS
────────────────────────────────────────────────────────────────*/

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

  // T064: Get file mtime for incremental indexing (REQ-023)
  const file_metadata = incrementalIndex.get_file_metadata(parsed.filePath);
  const file_mtime_ms = file_metadata ? file_metadata.mtime_ms : null;

  // Update metadata
  database.prepare(`
    UPDATE memory_index
    SET content_hash = ?,
        context_type = ?,
        importance_tier = ?,
        last_review = datetime('now'),
        review_count = COALESCE(review_count, 0) + 1,
        updated_at = datetime('now'),
        file_mtime_ms = ?
    WHERE id = ?
  `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, file_mtime_ms, memory_id);

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

/* ─────────────────────────────────────────────────────────────
   3. CAUSAL LINKS PROCESSING
────────────────────────────────────────────────────────────────*/

/**
 * Mapping from causal_links keys to causal_edges relation types.
 *
 * Template format (context_template.md v2.2):
 * - caused_by: Memory IDs that caused this memory to be created
 * - supersedes: Memory IDs that this memory replaces
 * - derived_from: Memory IDs that this memory builds upon
 * - blocks: Memory IDs that this memory blocks (issue/dependency tracking)
 * - related_to: Memory IDs with general relationship
 *
 * Database relation types (causal-edges.js):
 * - caused: A caused B
 * - enabled: A enabled/unlocked B
 * - supersedes: A replaces/supersedes B
 * - contradicts: A contradicts B
 * - derived_from: A was derived from B
 * - supports: A supports/reinforces B
 */
const CAUSAL_LINK_MAPPINGS = {
  // caused_by: This memory was caused by target -> target CAUSED this (reverse edge)
  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
  // supersedes: This memory supersedes target -> this SUPERSEDES target
  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
  // derived_from: This memory derived from target -> this DERIVED_FROM target
  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
  // blocks: This memory blocks target -> This is a blocker, target is ENABLED when resolved
  // Semantic: When this memory/issue is resolved, it ENABLES the blocked item
  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
  // related_to: General relationship -> SUPPORTS (weakest causal link)
  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
};

/**
 * Resolve memory reference to database ID.
 * Supports multiple reference formats:
 * - Numeric ID: "123" -> 123
 * - Session ID: "session-2026-01-15-abc123" -> lookup by session_id
 * - File path: "specs/.../memory/file.md" -> lookup by file_path
 * - Title: "My Memory Title" -> lookup by title
 *
 * @param {Object} database - SQLite database instance
 * @param {string} reference - Memory reference string
 * @returns {number|null} Memory ID or null if not found
 */
function resolve_memory_reference(database, reference) {
  if (!reference || typeof reference !== 'string') {
    return null;
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    return null;
  }

  // Try numeric ID first
  const numeric_id = parseInt(trimmed, 10);
  if (!isNaN(numeric_id) && numeric_id > 0) {
    // Verify it exists
    const exists = database.prepare('SELECT id FROM memory_index WHERE id = ?').get(numeric_id);
    if (exists) {
      return numeric_id;
    }
  }

  // Try session_id lookup (pattern: session-YYYY-MM-DD-xxx or similar)
  if (trimmed.includes('session') || trimmed.match(/^\d{4}-\d{2}-\d{2}/)) {
    const by_session = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ?
    `).get(`%${trimmed}%`);
    if (by_session) {
      return by_session.id;
    }
  }

  // Try file path lookup (contains specs/ and memory/)
  if (trimmed.includes('specs/') || trimmed.includes('memory/')) {
    const by_path = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ?
    `).get(`%${trimmed}%`);
    if (by_path) {
      return by_path.id;
    }
  }

  // Try title lookup (exact match first, then partial)
  const by_title_exact = database.prepare(`
    SELECT id FROM memory_index WHERE title = ?
  `).get(trimmed);
  if (by_title_exact) {
    return by_title_exact.id;
  }

  const by_title_partial = database.prepare(`
    SELECT id FROM memory_index WHERE title LIKE ?
  `).get(`%${trimmed}%`);
  if (by_title_partial) {
    return by_title_partial.id;
  }

  return null;
}

/**
 * Process causal_links from parsed memory and insert edges into causal_edges table.
 * T126: Implements causal_links tracking in memory operations (CHK-231).
 *
 * @param {Object} database - SQLite database instance
 * @param {number} memory_id - ID of the newly indexed memory
 * @param {Object} causal_links - Causal links object from memory parser
 * @returns {Object} Processing result with counts and any errors
 */
function process_causal_links(database, memory_id, causal_links) {
  const result = {
    processed: 0,
    inserted: 0,
    resolved: 0,
    unresolved: [],
    errors: []
  };

  if (!causal_links || typeof causal_links !== 'object') {
    return result;
  }

  const memory_id_str = String(memory_id);

  for (const [link_type, references] of Object.entries(causal_links)) {
    if (!Array.isArray(references) || references.length === 0) {
      continue;
    }

    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
    if (!mapping) {
      console.warn(`[causal-links] Unknown link type: ${link_type}`);
      continue;
    }

    for (const reference of references) {
      result.processed++;

      // Resolve reference to memory ID
      const target_id = resolve_memory_reference(database, reference);

      if (!target_id) {
        result.unresolved.push({ type: link_type, reference });
        continue;
      }

      result.resolved++;

      // Determine edge direction based on mapping
      const edge_params = {
        source_id: mapping.reverse ? String(target_id) : memory_id_str,
        target_id: mapping.reverse ? memory_id_str : String(target_id),
        relation: mapping.relation,
        strength: 1.0,
        evidence: `Auto-extracted from ${link_type} in memory file`
      };

      try {
        causalEdges.insert_edge(database, edge_params);
        result.inserted++;
        console.log(`[causal-links] Inserted edge: ${edge_params.source_id} -[${edge_params.relation}]-> ${edge_params.target_id}`);
      } catch (err) {
        // Handle duplicate edge (UNIQUE constraint) - not an error
        if (err.message.includes('UNIQUE constraint')) {
          console.log(`[causal-links] Edge already exists: ${edge_params.source_id} -[${edge_params.relation}]-> ${edge_params.target_id}`);
        } else {
          result.errors.push({ type: link_type, reference, error: err.message });
          console.warn(`[causal-links] Failed to insert edge: ${err.message}`);
        }
      }
    }
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   4. INDEX MEMORY FILE
────────────────────────────────────────────────────────────────*/

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

  // ─────────────────────────────────────────────────────────────
  // EMBEDDING GENERATION (with deferred indexing fallback - REQ-031, T097)
  // ─────────────────────────────────────────────────────────────
  let embedding = null;
  let embedding_status = 'pending';
  let embedding_failure_reason = null;

  try {
    embedding = await embeddings.generateDocumentEmbedding(parsed.content);
    if (embedding) {
      embedding_status = 'success';
    } else {
      embedding_failure_reason = 'Embedding generation returned null';
      console.warn(`[memory-save] Embedding failed for ${path.basename(file_path)}: ${embedding_failure_reason}`);
    }
  } catch (embedding_error) {
    embedding_failure_reason = embedding_error.message;
    console.warn(`[memory-save] Embedding failed for ${path.basename(file_path)}: ${embedding_failure_reason}`);
  }

  // ─────────────────────────────────────────────────────────────
  // PE GATING: Check for duplicates/conflicts before creating
  // (Only if we have an embedding - otherwise skip PE gating)
  // ─────────────────────────────────────────────────────────────
  let pe_decision = { action: 'CREATE', similarity: 0 };
  let candidates = [];

  if (embedding) {
    candidates = find_similar_memories(embedding, {
      limit: 5,
      specFolder: parsed.specFolder
    });
  }

  // Evaluate PE decision (only if we have candidates from vector search)
  if (candidates.length > 0) {
    pe_decision = predictionErrorGate.evaluate_memory(
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
        reinforced.embedding_status = embedding_status;
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
        updated.embedding_status = embedding_status;
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
  }

  // ─────────────────────────────────────────────────────────────
  // CREATE NEW MEMORY (with deferred indexing fallback - REQ-031, T097)
  // Index the memory and update metadata atomically
  // ─────────────────────────────────────────────────────────────
  let id;

  if (embedding) {
    // Normal path: create with embedding
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
      // T064: Store file_mtime_ms for incremental indexing fast-path (REQ-023)
      const file_metadata = incrementalIndex.get_file_metadata(file_path);
      const file_mtime_ms = file_metadata ? file_metadata.mtime_ms : null;

      // T125: Include memory_type classification for type-specific half-lives (CHK-230)
      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_STABILITY,
        fsrsScheduler.DEFAULT_DIFFICULTY,
        file_mtime_ms,
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

    id = index_with_metadata();
  } else {
    // Deferred indexing path: create without embedding (REQ-031, CHK-176)
    // Memory is still searchable via BM25/FTS5, retry job will add embedding later
    console.log(`[memory-save] Using deferred indexing for ${path.basename(file_path)}`);

    const index_deferred = database.transaction(() => {
      const memory_id = vectorIndex.indexMemoryDeferred({
        specFolder: parsed.specFolder,
        filePath: file_path,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight: 0.5,
        failureReason: embedding_failure_reason
      });

      // Update additional metadata and initialize FSRS columns
      // T125: Include memory_type classification for type-specific half-lives (CHK-230)
      const file_metadata = incrementalIndex.get_file_metadata(file_path);
      const file_mtime_ms = file_metadata ? file_metadata.mtime_ms : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_STABILITY,
        fsrsScheduler.DEFAULT_DIFFICULTY,
        file_mtime_ms,
        memory_id
      );

      return memory_id;
    });

    id = index_deferred();
  }

  // ─────────────────────────────────────────────────────────────
  // T030: BM25 INDEXING (REQ-014, REQ-028)
  // Index into BM25 for hybrid search keyword matching
  // ─────────────────────────────────────────────────────────────
  if (bm25Index.is_bm25_enabled()) {
    try {
      const bm25 = bm25Index.get_index();
      bm25.add_document(id, parsed.content, {
        spec_folder: parsed.specFolder,
        title: parsed.title,
        importance_tier: parsed.importanceTier,
        context_type: parsed.contextType,
        // T125: Include memory_type for BM25 filtering/boosting
        memory_type: parsed.memoryType,
      });
    } catch (bm25_err) {
      // BM25 indexing failure should not block memory save
      console.warn(`[memory-save] BM25 indexing failed: ${bm25_err.message}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // T126: CAUSAL LINKS PROCESSING (REQ-012, CHK-231)
  // Extract causal_links from memory metadata and insert edges
  // ─────────────────────────────────────────────────────────────
  let causal_links_result = null;
  if (parsed.hasCausalLinks && parsed.causalLinks) {
    try {
      causal_links_result = process_causal_links(database, id, parsed.causalLinks);
      if (causal_links_result.inserted > 0) {
        console.log(`[causal-links] Processed ${causal_links_result.inserted} causal edges for memory #${id}`);
      }
      if (causal_links_result.unresolved.length > 0) {
        console.log(`[causal-links] ${causal_links_result.unresolved.length} references could not be resolved`);
      }
    } catch (causal_err) {
      // Causal links processing failure should not block memory save
      console.warn(`[memory-save] Causal links processing failed: ${causal_err.message}`);
    }
  }

  const result = {
    status: existing ? 'updated' : 'indexed',
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    // T125: Include memory_type in response for observability (CHK-230)
    memoryType: parsed.memoryType,
    memoryTypeSource: parsed.memoryTypeSource,
    embedding_status: embedding_status,  // T100: Include embedding status in response
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

  // Add deferred indexing info if embedding failed (CHK-180)
  if (embedding_status === 'pending' && embedding_failure_reason) {
    result.embedding_failure_reason = embedding_failure_reason;
    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
  }

  // T126: Add causal links info to result (CHK-231)
  if (causal_links_result) {
    result.causal_links = {
      processed: causal_links_result.processed,
      inserted: causal_links_result.inserted,
      resolved: causal_links_result.resolved,
      unresolved_count: causal_links_result.unresolved.length
    };
    if (causal_links_result.errors.length > 0) {
      result.causal_links.errors = causal_links_result.errors;
    }
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   5. MEMORY SAVE HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_save tool - index a single memory file.
 * Validates the file path, checks if it's a valid memory file,
 * and indexes it with embeddings.
 *
 * T067-T070: Pre-flight validation before expensive operations.
 * REQ-024: Pre-Flight Quality Gates
 *
 * @param {Object} args - Tool arguments
 * @param {string} args.filePath - Path to the memory file to index
 * @param {boolean} [args.force=false] - Force re-index even if unchanged
 * @param {boolean} [args.dryRun=false] - Validate only, don't save (CHK-160)
 * @param {boolean} [args.skipPreflight=false] - Skip preflight validation
 * @returns {Promise<Object>} MCP tool response with status and metadata
 * @throws {Error} If path is invalid or not a memory file
 */
async function handle_memory_save(args) {
  // BUG-001: Check for external database updates before processing
  await check_database_updated();

  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false } = args;

  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  // Validate path
  const validated_path = validate_file_path_local(file_path);

  // Check if it's a valid memory file
  if (!memoryParser.isMemoryFile(validated_path)) {
    throw new Error('File must be in specs/**/memory/ or .opencode/specs/**/memory/ or .opencode/skill/*/constitutional/ directory and have .md extension');
  }

  // ─────────────────────────────────────────────────────────────
  // T067-T070: PRE-FLIGHT VALIDATION
  // Run validation checks BEFORE expensive operations (embedding)
  // CHK-156: ANCHOR format validation
  // CHK-157: Duplicate detection
  // CHK-158: Token budget estimation
  // CHK-159: Validation errors block save
  // CHK-160: Dry-run mode
  // ─────────────────────────────────────────────────────────────
  if (!skipPreflight) {
    // Parse file to get content for preflight checks
    const parsed_for_preflight = memoryParser.parseMemoryFile(validated_path);
    const database = vectorIndex.getDb();

    // Run preflight validation
    const preflight_result = preflight.run_preflight(
      {
        content: parsed_for_preflight.content,
        file_path: validated_path,
        spec_folder: parsed_for_preflight.specFolder,
        database: database,
        find_similar: find_similar_memories,
        // Note: embedding not provided here - similar check is skipped (PE-gating handles it)
      },
      {
        dry_run: dryRun,
        check_anchors: true,
        check_duplicates: !force, // Skip duplicate check if force=true
        check_similar: false,     // PE-gating handles similar detection
        check_tokens: true,
        check_size: true,
        strict_anchors: false,    // Anchor issues are warnings by default
      }
    );

    // CHK-160: Dry-run mode - return validation result without saving
    if (dryRun) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'dry_run',
            would_pass: preflight_result.dry_run_would_pass,
            file_path: validated_path,
            spec_folder: parsed_for_preflight.specFolder,
            title: parsed_for_preflight.title,
            validation: {
              errors: preflight_result.errors,
              warnings: preflight_result.warnings,
              details: preflight_result.details,
            },
            message: preflight_result.dry_run_would_pass
              ? 'Pre-flight validation passed (dry-run mode)'
              : `Pre-flight validation failed: ${preflight_result.errors.length} error(s)`,
          }, null, 2)
        }]
      };
    }

    // CHK-159: Validation errors block save with clear error messages
    if (!preflight_result.pass) {
      const error_messages = preflight_result.errors.map(e =>
        typeof e === 'string' ? e : e.message
      ).join('; ');

      throw new preflight.PreflightError(
        preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
        `Pre-flight validation failed: ${error_messages}`,
        {
          errors: preflight_result.errors,
          warnings: preflight_result.warnings,
          recoverable: true,
          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
        }
      );
    }

    // Log preflight warnings (non-blocking)
    if (preflight_result.warnings.length > 0) {
      console.log(`[preflight] ${validated_path}: ${preflight_result.warnings.length} warning(s)`);
      preflight_result.warnings.forEach(w => {
        const msg = typeof w === 'string' ? w : w.message;
        console.log(`[preflight]   - ${msg}`);
      });
    }
  }

  // Use shared indexing logic
  const result = await index_memory_file(validated_path, { force });

  // Format response for unchanged status
  if (result.status === 'unchanged') {
    // REQ-019: Use standardized response envelope
    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: 'Memory already indexed with same content',
      data: {
        status: 'unchanged',
        id: result.id,
        specFolder: result.specFolder,
        title: result.title
      },
      hints: ['Use force: true to re-index anyway']
    });
  }

  // P1-005: Clear trigger cache after mutation to prevent stale data
  triggerMatcher.clearCache();

  // T015: Invalidate tool cache after write operations
  toolCache.invalidateOnWrite('save', { specFolder: result.specFolder, filePath: file_path });

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

  // T100: Add embedding_status to response envelope (CHK-180)
  if (result.embedding_status) {
    response.embedding_status = result.embedding_status;
    if (result.embedding_status === 'pending') {
      response.message += ' (deferred indexing - searchable via BM25/FTS5)';
      if (result.embedding_failure_reason) {
        response.embedding_failure_reason = result.embedding_failure_reason;
      }
    }
  }

  // REQ-019: Build summary and hints for standardized envelope
  const summary = response.message;
  const hints = [];
  if (result.pe_action === 'REINFORCE') {
    hints.push('Existing memory was reinforced instead of creating duplicate');
  }
  if (result.pe_action === 'SUPERSEDE') {
    hints.push(`Previous memory #${result.superseded_id} marked as deprecated`);
  }
  if (result.warnings && result.warnings.length > 0) {
    hints.push('Review anchor warnings for better searchability');
  }
  // T100: Add hint about deferred indexing
  if (result.embedding_status === 'pending') {
    hints.push('Memory will be fully indexed when embedding provider becomes available');
  }
  // T126: Add causal links info to response and hints
  if (result.causal_links) {
    response.causal_links = result.causal_links;
    if (result.causal_links.inserted > 0) {
      hints.push(`Created ${result.causal_links.inserted} causal graph edge(s)`);
    }
    if (result.causal_links.unresolved_count > 0) {
      hints.push(`${result.causal_links.unresolved_count} causal link reference(s) could not be resolved`);
    }
  }

  // T099: Opportunistic retry processing (REQ-031, CHK-179)
  // Process a few pending embeddings after successful save (non-blocking)
  if (result.embedding_status === 'success') {
    // Fire-and-forget: process pending items without blocking response
    retryManager.process_retry_queue(2).catch(err => {
      console.warn('[memory-save] Opportunistic retry failed:', err.message);
    });
  }

  return createMCPSuccessResponse({
    tool: 'memory_save',
    summary,
    data: response,
    hints
  });
}

/* ─────────────────────────────────────────────────────────────
   6. ATOMIC MEMORY SAVE
────────────────────────────────────────────────────────────────*/

/**
 * Save and index a memory file atomically.
 * T105: File write + index insert wrapped in transaction pattern.
 * T106: File rollback on index failure.
 *
 * This function writes the file AND indexes it in one atomic operation.
 * If indexing fails, the file is either deleted or renamed with _pending suffix.
 *
 * @param {Object} params - Save parameters
 * @param {string} params.file_path - Target file path
 * @param {string} params.content - File content to write
 * @param {Object} [options={}] - Options
 * @param {boolean} [options.force=false] - Force re-index even if content unchanged
 * @param {boolean} [options.rollback_on_failure=true] - Delete file on index failure
 * @param {boolean} [options.create_pending_on_failure=true] - Rename to _pending on failure
 * @returns {Promise<Object>} Transaction result with indexing status
 */
async function atomic_save_memory(params, options = {}) {
  const { file_path, content } = params;
  const { force = false, ...transaction_options } = options;

  // Execute atomic save with index_memory_file as the index function
  const result = await transactionManager.execute_atomic_save(
    {
      file_path,
      content,
      index_fn: async (saved_file_path) => {
        // Index the saved file
        return await index_memory_file(saved_file_path, { force });
      }
    },
    transaction_options
  );

  // On success, clear trigger cache
  if (result.success) {
    triggerMatcher.clearCache();
  }

  return result;
}

/**
 * Get atomicity metrics for monitoring.
 * CHK-190: Metrics track atomicity failures.
 *
 * @returns {Object} Atomicity metrics
 */
function get_atomicity_metrics() {
  return transactionManager.get_metrics();
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary exports (snake_case)
  index_memory_file,
  handle_memory_save,
  atomic_save_memory,
  get_atomicity_metrics,

  // PE gating helper functions
  find_similar_memories,
  reinforce_existing_memory,
  mark_memory_superseded,
  update_existing_memory,
  log_pe_decision,

  // T126: Causal links helper functions (CHK-231)
  process_causal_links,
  resolve_memory_reference,
  CAUSAL_LINK_MAPPINGS,

  // Backward compatibility aliases (camelCase)
  indexMemoryFile: index_memory_file,
  handleMemorySave: handle_memory_save,
  atomicSaveMemory: atomic_save_memory,
  getAtomicityMetrics: get_atomicity_metrics,
  findSimilarMemories: find_similar_memories,
  reinforceExistingMemory: reinforce_existing_memory,
  markMemorySuperseded: mark_memory_superseded,
  updateExistingMemory: update_existing_memory,
  logPeDecision: log_pe_decision,
  processCausalLinks: process_causal_links,
  resolveMemoryReference: resolve_memory_reference
};
