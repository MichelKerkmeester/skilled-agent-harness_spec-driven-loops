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

/* ───────────────────────────────────────────────────────────────
   2. INDEX MEMORY FILE
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

  // Generate embedding
  const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
  if (!embedding) {
    throw new Error('Failed to generate embedding for memory content');
  }

  // Index the memory and update metadata atomically
  // Wrapping in transaction prevents race condition between INSERT and UPDATE
  const index_with_metadata = database.transaction(() => {
    const memory_id = vectorIndex.indexMemory({
      specFolder: parsed.specFolder,
      filePath: file_path,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      importanceWeight: 0.5,
      embedding: embedding
    });

    // Update additional metadata within same transaction
    database.prepare(`
      UPDATE memory_index
      SET content_hash = ?,
          context_type = ?,
          importance_tier = ?
      WHERE id = ?
    `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, memory_id);

    return memory_id;
  });

  const id = index_with_metadata();

  return {
    status: existing ? 'updated' : 'indexed',
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    warnings: validation.warnings
  };
}

/* ───────────────────────────────────────────────────────────────
   3. MEMORY SAVE HANDLER
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

  // Build response for indexed/updated status
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
  // snake_case exports
  index_memory_file,
  handle_memory_save,

  // Backward compatibility aliases
  indexMemoryFile: index_memory_file,
  handleMemorySave: handle_memory_save
};
