/**
 * Checkpoints Module - Session state management
 * @module lib/checkpoints
 * @version 11.0.0
 */

'use strict';

const zlib = require('zlib');
const { execSync } = require('child_process');

// Database reference
let db = null;

// Checkpoint limits
const MAX_CHECKPOINTS = 10;
const CHECKPOINT_TTL_DAYS = 30;

// Embedding dimension for validation (must match vector-index.js)
const EMBEDDING_DIM = 768;

/**
 * Initialize checkpoints with database reference
 * @param {Object} database - better-sqlite3 instance
 * @returns {boolean} True if initialization succeeded
 */
function init(database) {
  if (!database) {
    console.error('[checkpoints] WARNING: init() called with null database');
    console.error('[checkpoints] Checkpoint operations will fail until a valid database is provided');
    return false;
  }
  db = database;
  console.error('[checkpoints] Database initialized successfully');
  return true;
}

/**
 * Get database with null check
 * @returns {Object} Database instance
 * @throws {Error} If database not initialized
 */
function getDatabase() {
  if (!db) {
    throw new Error('Checkpoint database not initialized. The server may have started before the database was ready. Please try again or restart the server.');
  }
  return db;
}

/**
 * Get current git branch
 * @returns {string|null}
 */
function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Create a named checkpoint
 * @param {string} name - Unique checkpoint name
 * @param {Object} [options]
 * @param {string} [options.specFolder] - Limit to specific spec folder
 * @param {Object} [options.metadata] - Additional metadata
 * @returns {number} Checkpoint ID
 */
function createCheckpoint(name, options = {}) {
  // Validate checkpoint name format
  if (!name || typeof name !== 'string') {
    throw new Error('Checkpoint name is required and must be a string');
  }
  
  // Allow alphanumeric, underscore, hyphen only
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error('Checkpoint name can only contain letters, numbers, underscores, and hyphens');
  }
  
  // Reasonable length limit
  if (name.length > 100) {
    throw new Error('Checkpoint name must be 100 characters or less');
  }

  const database = getDatabase(); // Throws if not initialized
  const { specFolder = null, metadata = {} } = options;

  // Get memories to snapshot
  const memorySql = specFolder
    ? 'SELECT * FROM memory_index WHERE spec_folder = ?'
    : 'SELECT * FROM memory_index';
  const memories = specFolder
    ? database.prepare(memorySql).all(specFolder)
    : database.prepare(memorySql).all();

  // Get embeddings for these memories (preserves semantic search capability after restore)
  const embeddings = [];
  let sqliteVecAvailable = false;
  
  // Check if sqlite-vec is available
  try {
    database.prepare('SELECT 1 FROM vec_memories LIMIT 1').get();
    sqliteVecAvailable = true;
  } catch (e) {
    // vec_memories table doesn't exist - sqlite-vec not available
  }
  
  if (sqliteVecAvailable) {
    for (const memory of memories) {
      try {
        const row = database.prepare('SELECT embedding FROM vec_memories WHERE rowid = ?').get(memory.id);
        if (row && row.embedding) {
          // Convert Buffer to array for JSON serialization
          const floatArray = new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4);
          embeddings.push({
            memoryId: memory.id,
            embedding: Array.from(floatArray)
          });
        }
      } catch (err) {
        // Skip if embedding is missing
        console.warn(`[checkpoints] Could not get embedding for memory ${memory.id}: ${err.message}`);
      }
    }
  }

  // Create snapshot with embeddings
  const snapshot = {
    memories,
    embeddings,
    metadata: {
      ...metadata,
      createdAt: new Date().toISOString(),
      memoryCount: memories.length,
      embeddingCount: embeddings.length
    }
  };

  // Size validation before compression
  const MAX_CHECKPOINT_SIZE = 100 * 1024 * 1024; // 100MB limit
  const jsonData = JSON.stringify(snapshot);
  if (jsonData.length > MAX_CHECKPOINT_SIZE) {
    throw new Error(`Checkpoint data too large (${Math.round(jsonData.length / 1024 / 1024)}MB). Maximum is ${MAX_CHECKPOINT_SIZE / 1024 / 1024}MB.`);
  }

  // Compress memory snapshot
  const memorySnapshot = zlib.gzipSync(jsonData);

  // Atomic insert with race condition protection
  const result = database.prepare(`
    INSERT OR IGNORE INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    new Date().toISOString(),
    specFolder,
    getGitBranch(),
    memorySnapshot,
    JSON.stringify(metadata)
  );

  if (result.changes === 0) {
    throw new Error(`Checkpoint already exists: ${name}`);
  }

  // Enforce checkpoint limit and TTL cleanup atomically
  database.transaction(() => {
    const existingCheckpoints = listCheckpoints({ specFolder, limit: 100 });
    const deletedNames = new Set();
    
    // Delete oldest if over max
    if (existingCheckpoints.length > MAX_CHECKPOINTS) {
      // Sort by created_at ascending (oldest first)
      const sortedByAge = existingCheckpoints.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      // Delete oldest checkpoint(s) to stay at max
      const toDelete = sortedByAge.slice(0, existingCheckpoints.length - MAX_CHECKPOINTS);
      for (const cp of toDelete) {
        deleteCheckpoint(cp.name);
        deletedNames.add(cp.name);
      }
    }

    // Clean up expired checkpoints (older than TTL), excluding already deleted
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CHECKPOINT_TTL_DAYS);
    const remainingCheckpoints = existingCheckpoints.filter(cp => !deletedNames.has(cp.name));
    const expiredCheckpoints = remainingCheckpoints.filter(cp => 
      new Date(cp.created_at) < cutoffDate
    );
    for (const cp of expiredCheckpoints) {
      deleteCheckpoint(cp.name);
    }
  })();

  return result.lastInsertRowid;
}

/**
 * List all checkpoints
 * @param {Object} [options]
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.limit=50]
 * @returns {Array} Checkpoint list
 */
function listCheckpoints(options = {}) {
  const database = getDatabase(); // Throws if not initialized
  const { specFolder = null, limit = 50 } = options;

  const sql = `
    SELECT id, name, created_at, spec_folder, git_branch,
           LENGTH(memory_snapshot) as snapshot_size,
           metadata
    FROM checkpoints
    ${specFolder ? 'WHERE spec_folder = ?' : ''}
    ORDER BY created_at DESC
    LIMIT ?
  `;

  const params = specFolder ? [specFolder, limit] : [limit];
  const rows = database.prepare(sql).all(...params);

  return rows.map(row => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : {}
  }));
}

/**
 * Get checkpoint details
 * @param {string} name - Checkpoint name
 * @returns {Object|null}
 */
function getCheckpoint(name) {
  const database = getDatabase(); // Throws if not initialized
  const row = database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(name);
  if (!row) return null;

  // Safe decompression with error handling
  let decompressed;
  try {
    decompressed = zlib.gunzipSync(row.memory_snapshot);
  } catch (err) {
    throw new Error(`Failed to decompress checkpoint data: ${err.message}. The checkpoint may be corrupted.`);
  }
  
  let snapshot;
  try {
    snapshot = JSON.parse(decompressed);
  } catch (parseError) {
    throw new Error(`Checkpoint data corrupted: ${parseError.message}`);
  }

  // Handle both old format (array of memories) and new format (object with memories + embeddings)
  const isNewFormat = snapshot && typeof snapshot === 'object' && Array.isArray(snapshot.memories);
  const memories = isNewFormat ? snapshot.memories : snapshot;
  const embeddings = isNewFormat ? (snapshot.embeddings || []) : [];

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    specFolder: row.spec_folder,
    gitBranch: row.git_branch,
    memoryCount: memories.length,
    embeddingCount: embeddings.length,
    hasEmbeddings: embeddings.length > 0,
    metadata: row.metadata ? JSON.parse(row.metadata) : {}
  };
}

/**
 * Restore from a checkpoint
 * @param {string} name - Checkpoint name
 * @param {Object} [options]
 * @param {boolean} [options.clearExisting=false] - Clear existing memories first
 * @param {boolean} [options.reinsertMemories=true] - Re-insert memories from snapshot
 * @returns {Object} Restoration report
 */
function restoreCheckpoint(name, options = {}) {
  const database = getDatabase(); // Throws if not initialized
  const { clearExisting = false, reinsertMemories = true } = options;

  const checkpoint = database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(name);
  if (!checkpoint) {
    throw new Error(`Checkpoint not found: ${name}`);
  }

  // Safe decompression with error handling
  let decompressed;
  try {
    decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
  } catch (err) {
    throw new Error(`Failed to decompress checkpoint data: ${err.message}. The checkpoint may be corrupted.`);
  }
  
  let snapshot;
  try {
    snapshot = JSON.parse(decompressed);
  } catch (parseError) {
    throw new Error(`Checkpoint data corrupted: ${parseError.message}`);
  }

  // Handle both old format (array of memories) and new format (object with memories + embeddings)
  const isNewFormat = snapshot && typeof snapshot === 'object' && Array.isArray(snapshot.memories);
  const memories = isNewFormat ? snapshot.memories : snapshot;
  const snapshotEmbeddings = isNewFormat ? (snapshot.embeddings || []) : [];
  
  // Build old ID -> embedding mapping for restoration
  const embeddingsByOldId = new Map();
  for (const emb of snapshotEmbeddings) {
    embeddingsByOldId.set(emb.memoryId, emb.embedding);
  }

  // Check if sqlite-vec is available
  let sqliteVecAvailable = false;
  try {
    database.prepare('SELECT 1 FROM vec_memories LIMIT 1').get();
    sqliteVecAvailable = true;
  } catch (e) {
    // vec_memories table doesn't exist
  }

  const result = database.transaction(() => {
    let cleared = 0;
    let inserted = 0;
    let skipped = 0;
    let deprecated = 0;
    let embeddingsRestored = 0;
    let embeddingsSkipped = 0;

    // Step 1: Clear or deprecate existing memories
    if (clearExisting) {
      // Get IDs to delete (scoped to spec_folder if present, otherwise ALL)
      const existingIds = checkpoint.spec_folder
        ? database.prepare('SELECT id FROM memory_index WHERE spec_folder = ?').all(checkpoint.spec_folder).map(r => r.id)
        : database.prepare('SELECT id FROM memory_index').all().map(r => r.id);

      if (existingIds.length > 0 && sqliteVecAvailable) {
        // Batch delete from vec_memories to avoid SQLite parameter limits
        const BATCH_SIZE = 500;
        for (let i = 0; i < existingIds.length; i += BATCH_SIZE) {
          const batch = existingIds.slice(i, i + BATCH_SIZE);
          const placeholders = batch.map(() => '?').join(',');
          try {
            database.prepare(`DELETE FROM vec_memories WHERE rowid IN (${placeholders})`).run(...batch);
          } catch (e) {
            // Only ignore expected errors (table doesn't exist or busy)
            if (!e.message.includes('no such table') && !e.message.includes('SQLITE_BUSY')) {
              throw e;
            }
          }
        }
      }

      // Delete from memory_index
      const deleteResult = checkpoint.spec_folder
        ? database.prepare('DELETE FROM memory_index WHERE spec_folder = ?').run(checkpoint.spec_folder)
        : database.prepare('DELETE FROM memory_index').run();
      cleared = deleteResult.changes;
    } else if (checkpoint.spec_folder) {
      // Deprecate only works for scoped checkpoints
      const deprecateResult = database.prepare(`
        UPDATE memory_index
        SET importance_tier = 'deprecated'
        WHERE spec_folder = ?
      `).run(checkpoint.spec_folder);
      deprecated = deprecateResult.changes;
    }

    // Step 2: Re-insert memories from snapshot using UPSERT logic
    // Track old ID -> new ID mapping for embedding restoration
    const idMapping = new Map();
    let updated = 0;
    
    if (reinsertMemories && memories.length > 0) {
      // ========================================================================
      // DEDUPLICATION FIX (SPECKIT-003 v3): UPSERT LOGIC
      // ========================================================================
      // Previous approaches had issues:
      // v1: Per-memory check with NULL file_paths didn't work (SQL semantics)
      // v2: Batch delete before insert lost metadata and was destructive
      //
      // This fix uses proper UPSERT: check by (file_path, spec_folder), then
      // UPDATE existing or INSERT new. This preserves metadata and tracks stats.
      // ========================================================================
      
      console.error(`[checkpoints] DEDUP: Processing ${memories.length} memories with UPSERT logic`);
      
      // Prepare statements for check, update, and insert
      const checkExistingStmt = database.prepare(`
        SELECT id FROM memory_index 
        WHERE file_path = ? AND spec_folder = ?
      `);
      
      const updateStmt = database.prepare(`
        UPDATE memory_index SET
          title = ?,
          anchor_id = ?,
          trigger_phrases = ?,
          importance_weight = ?,
          content_hash = ?,
          embedding_model = ?,
          embedding_status = ?,
          importance_tier = ?,
          context_type = ?,
          channel = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `);
      
      const insertStmt = database.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, anchor_id, title, trigger_phrases,
          importance_weight, created_at, updated_at, embedding_model,
          embedding_status, importance_tier, context_type, channel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?)
      `);

      for (const mem of memories) {
        // Check if we have an embedding for this memory
        const hasEmbedding = embeddingsByOldId.has(mem.id);
        const embeddingStatus = hasEmbedding ? 'success' : 'pending';
        
        // Check for existing memory by (file_path, spec_folder)
        // Handle NULL file_paths specially - they can't be deduplicated, always insert
        let existingId = null;
        if (mem.file_path != null && mem.file_path !== '') {
          const existing = checkExistingStmt.get(mem.file_path, mem.spec_folder);
          existingId = existing ? existing.id : null;
        }
        
        try {
          if (existingId) {
            // UPDATE existing entry - preserves original created_at and id
            updateStmt.run(
              mem.title,
              mem.anchor_id,
              mem.trigger_phrases,
              mem.importance_weight || 0.5,
              mem.content_hash || null,
              mem.embedding_model || 'nomic-ai/nomic-embed-text-v1.5',
              embeddingStatus,
              mem.importance_tier || 'normal',
              mem.context_type || 'general',
              mem.channel || 'default',
              existingId
            );
            updated++;
            
            // Track ID mapping (old snapshot ID -> existing database ID)
            idMapping.set(mem.id, existingId);
          } else {
            // INSERT new entry
            const insertResult = insertStmt.run(
              mem.spec_folder,
              mem.file_path,
              mem.anchor_id,
              mem.title,
              mem.trigger_phrases,
              mem.importance_weight || 0.5,
              mem.created_at,
              mem.embedding_model || 'nomic-ai/nomic-embed-text-v1.5',
              embeddingStatus,
              mem.importance_tier || 'normal',
              mem.context_type || 'general',
              mem.channel || 'default'
            );
            inserted++;
            
            // Track ID mapping for embedding restoration
            const newId = Number(insertResult.lastInsertRowid);
            idMapping.set(mem.id, newId);
          }
        } catch (e) {
          // Skip duplicates (UNIQUE constraint) - fallback for edge cases
          if (e.message.includes('UNIQUE constraint failed')) {
            console.error(`[checkpoints] DEDUP: Skipped duplicate (unexpected): ${mem.file_path}`);
            skipped++;
          } else {
            throw e;
          }
        }
      }
      
      console.error(`[checkpoints] DEDUP: Updated ${updated}, inserted ${inserted}, skipped ${skipped}`);
    }

    // Step 3: Restore embeddings if available and sqlite-vec is present
    if (sqliteVecAvailable && snapshotEmbeddings.length > 0) {
      const insertEmbeddingStmt = database.prepare(`
        INSERT OR REPLACE INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `);

      for (const [oldId, embeddingArray] of embeddingsByOldId) {
        const newId = idMapping.get(oldId);
        if (!newId) {
          // Memory wasn't inserted (duplicate or error)
          continue;
        }

        try {
          // Validate embedding dimension
          if (embeddingArray.length !== EMBEDDING_DIM) {
            console.warn(`[checkpoints] Embedding dimension mismatch for memory ${oldId}: expected ${EMBEDDING_DIM}, got ${embeddingArray.length}. Will regenerate.`);
            // Mark for regeneration
            database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('pending', newId);
            embeddingsSkipped++;
            continue;
          }

          // Convert array back to Float32Array buffer
          const embeddingBuffer = Buffer.from(new Float32Array(embeddingArray).buffer);
          
          // Insert embedding
          insertEmbeddingStmt.run(BigInt(newId), embeddingBuffer);
          embeddingsRestored++;
        } catch (err) {
          console.warn(`[checkpoints] Could not restore embedding for memory ${oldId} -> ${newId}: ${err.message}`);
          // Mark for regeneration on error
          database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('pending', newId);
          embeddingsSkipped++;
        }
      }
    }

    return { 
      cleared, 
      deprecated, 
      inserted,
      updated,
      skipped, 
      memoryCount: memories.length,
      embeddingsRestored,
      embeddingsSkipped,
      embeddingsInSnapshot: snapshotEmbeddings.length
    };
  })();

  // Determine if embeddings need regeneration
  const embeddingsNeedRegeneration = result.inserted > 0 && 
    (result.embeddingsInSnapshot === 0 || result.embeddingsRestored < result.inserted);
  
  // Build appropriate note
  let note;
  const totalProcessed = result.inserted + result.updated;
  if (totalProcessed === 0) {
    note = 'No memories were processed (empty snapshot or all skipped).';
  } else if (result.updated > 0 && result.inserted === 0) {
    note = `Updated ${result.updated} existing memories (no new inserts). Embeddings preserved.`;
  } else if (result.updated > 0) {
    note = `Updated ${result.updated}, inserted ${result.inserted} memories.`;
  } else if (result.embeddingsRestored === result.inserted) {
    note = `All ${result.embeddingsRestored} embeddings restored. Semantic search works immediately.`;
  } else if (result.embeddingsRestored > 0) {
    note = `${result.embeddingsRestored}/${result.inserted} embeddings restored. Run memory_index_scan to regenerate ${result.inserted - result.embeddingsRestored} missing embeddings.`;
  } else if (result.embeddingsInSnapshot === 0) {
    note = 'Checkpoint created before embedding preservation was added. Run memory_index_scan to generate embeddings.';
  } else {
    note = 'Embeddings could not be restored. Run memory_index_scan to regenerate embeddings.';
  }

  return {
    restored: result.inserted,
    updated: result.updated,
    skipped: result.skipped,
    cleared: result.cleared,
    deprecated: result.deprecated,
    totalInSnapshot: result.memoryCount,
    embeddingsRestored: result.embeddingsRestored,
    embeddingsSkipped: result.embeddingsSkipped,
    specFolder: checkpoint.spec_folder,
    gitBranch: checkpoint.git_branch,
    createdAt: checkpoint.created_at,
    embeddingsNeedRegeneration,
    note
  };
}

/**
 * Delete a checkpoint
 * @param {string} name - Checkpoint name
 * @returns {boolean} Success
 */
function deleteCheckpoint(name) {
  const database = getDatabase(); // Throws if not initialized
  const result = database.prepare('DELETE FROM checkpoints WHERE name = ?').run(name);
  return result.changes > 0;
}

module.exports = {
  init,
  // Short aliases for MCP server
  create: createCheckpoint,
  list: listCheckpoints,
  get: getCheckpoint,
  restore: restoreCheckpoint,
  delete: deleteCheckpoint,
  // Full names for backward compatibility
  createCheckpoint,
  listCheckpoints,
  getCheckpoint,
  restoreCheckpoint,
  deleteCheckpoint,
  getGitBranch
};
