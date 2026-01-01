// ───────────────────────────────────────────────────────────────
// CHECKPOINTS: Named memory state snapshots with restore capability
// ───────────────────────────────────────────────────────────────
'use strict';

const zlib = require('zlib');
const { execSync } = require('child_process');
const { getEmbeddingDimension } = require('../../shared/embeddings');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

// Database reference
let db = null;

// Checkpoint limits
const MAX_CHECKPOINTS = 10;
const CHECKPOINT_TTL_DAYS = 30;

/* ───────────────────────────────────────────────────────────────
   2. DATABASE UTILITIES
   ─────────────────────────────────────────────────────────────── */

// Initialize checkpoints with database reference
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

// Get database with null check
function get_database() {
  if (!db) {
    throw new Error('Checkpoint database not initialized. The server may have started before the database was ready. Please try again or restart the server.');
  }
  return db;
}

// Get current git branch
function get_git_branch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000,
    }).trim();
  } catch {
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. CHECKPOINT CREATION
   ─────────────────────────────────────────────────────────────── */

// Create a named checkpoint
function create_checkpoint(name, options = {}) {
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

  const database = get_database(); // Throws if not initialized
  const { specFolder: spec_folder = null, metadata = {} } = options;

  // Get memories to snapshot
  const memory_sql = spec_folder
    ? 'SELECT * FROM memory_index WHERE spec_folder = ?'
    : 'SELECT * FROM memory_index';
  const memories = spec_folder
    ? database.prepare(memory_sql).all(spec_folder)
    : database.prepare(memory_sql).all();

  // Get embeddings for these memories (preserves semantic search capability after restore)
  const embeddings = [];
  let sqlite_vec_available = false;
  
  // Check if sqlite-vec is available
  try {
    database.prepare('SELECT 1 FROM vec_memories LIMIT 1').get();
    sqlite_vec_available = true;
  } catch (e) {
    // vec_memories table doesn't exist - sqlite-vec not available
  }
  
  if (sqlite_vec_available) {
    for (const memory of memories) {
      try {
        const row = database.prepare('SELECT embedding FROM vec_memories WHERE rowid = ?').get(memory.id);
        if (row && row.embedding) {
          // Convert Buffer to array for JSON serialization
          const float_array = new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4);
          embeddings.push({
            memoryId: memory.id,
            embedding: Array.from(float_array),
          });
        }
      } catch (err) {
        // Skip if embedding is missing
        console.warn(`[checkpoints] Could not get embedding for memory ${memory.id}: ${err.message}`);
      }
    }
  }

  // Get current embedding dimension for metadata
  const current_embedding_dim = getEmbeddingDimension();
  
  // Create snapshot with embeddings
  const snapshot = {
    memories,
    embeddings,
    metadata: {
      ...metadata,
      createdAt: new Date().toISOString(),
      memoryCount: memories.length,
      embeddingCount: embeddings.length,
      embeddingDimension: current_embedding_dim, // Store dimension for restore validation
    },
  };

  // Size validation before compression
  const MAX_CHECKPOINT_SIZE = 100 * 1024 * 1024; // 100MB limit
  const json_data = JSON.stringify(snapshot);
  if (json_data.length > MAX_CHECKPOINT_SIZE) {
    throw new Error(`Checkpoint data too large (${Math.round(json_data.length / 1024 / 1024)}MB). Maximum is ${MAX_CHECKPOINT_SIZE / 1024 / 1024}MB.`);
  }

  // Compress memory snapshot
  const memory_snapshot = zlib.gzipSync(json_data);

  // Atomic insert with race condition protection
  const result = database.prepare(`
    INSERT OR IGNORE INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    new Date().toISOString(),
    spec_folder,
    get_git_branch(),
    memory_snapshot,
    JSON.stringify(metadata)
  );

  if (result.changes === 0) {
    throw new Error(`Checkpoint already exists: ${name}`);
  }

  // Enforce checkpoint limit and TTL cleanup atomically
  database.transaction(() => {
    const existing_checkpoints = list_checkpoints({ specFolder: spec_folder, limit: 100 });
    const deleted_names = new Set();
    
    // Delete oldest if over max
    if (existing_checkpoints.length > MAX_CHECKPOINTS) {
      // Sort by created_at ascending (oldest first)
      const sorted_by_age = existing_checkpoints.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      // Delete oldest checkpoint(s) to stay at max
      const to_delete = sorted_by_age.slice(0, existing_checkpoints.length - MAX_CHECKPOINTS);
      for (const cp of to_delete) {
        delete_checkpoint(cp.name);
        deleted_names.add(cp.name);
      }
    }

    // Clean up expired checkpoints (older than TTL), excluding already deleted
    const cutoff_date = new Date();
    cutoff_date.setDate(cutoff_date.getDate() - CHECKPOINT_TTL_DAYS);
    const remaining_checkpoints = existing_checkpoints.filter(cp => !deleted_names.has(cp.name));
    const expired_checkpoints = remaining_checkpoints.filter(cp => 
      new Date(cp.created_at) < cutoff_date
    );
    for (const cp of expired_checkpoints) {
      delete_checkpoint(cp.name);
    }
  })();

  return result.lastInsertRowid;
}

/* ───────────────────────────────────────────────────────────────
   4. CHECKPOINT LISTING AND RETRIEVAL
   ─────────────────────────────────────────────────────────────── */

// List all checkpoints
function list_checkpoints(options = {}) {
  const database = get_database(); // Throws if not initialized
  const { specFolder: spec_folder = null, limit = 50 } = options;

  const sql = `
    SELECT id, name, created_at, spec_folder, git_branch,
           LENGTH(memory_snapshot) as snapshot_size,
           metadata
    FROM checkpoints
    ${spec_folder ? 'WHERE spec_folder = ?' : ''}
    ORDER BY created_at DESC
    LIMIT ?
  `;

  const params = spec_folder ? [spec_folder, limit] : [limit];
  const rows = database.prepare(sql).all(...params);

  return rows.map(row => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : {},
  }));
}

// Get checkpoint details
function get_checkpoint(name) {
  const database = get_database(); // Throws if not initialized
  const row = database.prepare('SELECT * FROM checkpoints WHERE name = ?').get(name);
  if (!row) {
    return null;
  }

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
  } catch (parse_error) {
    throw new Error(`Checkpoint data corrupted: ${parse_error.message}`);
  }

  // Handle both old format (array of memories) and new format (object with memories + embeddings)
  const is_new_format = snapshot && typeof snapshot === 'object' && Array.isArray(snapshot.memories);
  const memories = is_new_format ? snapshot.memories : snapshot;
  const embeddings = is_new_format ? (snapshot.embeddings || []) : [];

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    specFolder: row.spec_folder,
    gitBranch: row.git_branch,
    memoryCount: memories.length,
    embeddingCount: embeddings.length,
    hasEmbeddings: embeddings.length > 0,
    metadata: row.metadata ? JSON.parse(row.metadata) : {},
  };
}

/* ───────────────────────────────────────────────────────────────
   5. CHECKPOINT RESTORATION
   ─────────────────────────────────────────────────────────────── */

// Restore from a checkpoint
function restore_checkpoint(name, options = {}) {
  const database = get_database(); // Throws if not initialized
  const { clearExisting: clear_existing = false, reinsertMemories: reinsert_memories = true } = options;

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
  } catch (parse_error) {
    throw new Error(`Checkpoint data corrupted: ${parse_error.message}`);
  }

  // Handle both old format (array of memories) and new format (object with memories + embeddings)
  const is_new_format = snapshot && typeof snapshot === 'object' && Array.isArray(snapshot.memories);
  const memories = is_new_format ? snapshot.memories : snapshot;
  const snapshot_embeddings = is_new_format ? (snapshot.embeddings || []) : [];
  
  // Build old ID -> embedding mapping for restoration
  const embeddings_by_old_id = new Map();
  for (const emb of snapshot_embeddings) {
    embeddings_by_old_id.set(emb.memoryId, emb.embedding);
  }

  // Check if sqlite-vec is available
  let sqlite_vec_available = false;
  try {
    database.prepare('SELECT 1 FROM vec_memories LIMIT 1').get();
    sqlite_vec_available = true;
  } catch (e) {
    // vec_memories table doesn't exist
  }

  const result = database.transaction(() => {
    let cleared = 0;
    let inserted = 0;
    let skipped = 0;
    let deprecated = 0;
    let embeddings_restored = 0;
    let embeddings_skipped = 0;

    // Step 1: Clear or deprecate existing memories
    if (clear_existing) {
      // Get IDs to delete (scoped to spec_folder if present, otherwise ALL)
      const existing_ids = checkpoint.spec_folder
        ? database.prepare('SELECT id FROM memory_index WHERE spec_folder = ?').all(checkpoint.spec_folder).map(r => r.id)
        : database.prepare('SELECT id FROM memory_index').all().map(r => r.id);

      if (existing_ids.length > 0 && sqlite_vec_available) {
        // Batch delete from vec_memories to avoid SQLite parameter limits
        const BATCH_SIZE = 500;
        for (let i = 0; i < existing_ids.length; i += BATCH_SIZE) {
          const batch = existing_ids.slice(i, i + BATCH_SIZE);
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
      const delete_result = checkpoint.spec_folder
        ? database.prepare('DELETE FROM memory_index WHERE spec_folder = ?').run(checkpoint.spec_folder)
        : database.prepare('DELETE FROM memory_index').run();
      cleared = delete_result.changes;
    } else if (checkpoint.spec_folder) {
      // Deprecate only works for scoped checkpoints
      const deprecate_result = database.prepare(`
        UPDATE memory_index
        SET importance_tier = 'deprecated'
        WHERE spec_folder = ?
      `).run(checkpoint.spec_folder);
      deprecated = deprecate_result.changes;
    }

    // Step 2: Re-insert memories from snapshot using UPSERT logic
    // Track old ID -> new ID mapping for embedding restoration
    const id_mapping = new Map();
    let updated = 0;
    
    if (reinsert_memories && memories.length > 0) {
      console.error(`[checkpoints] DEDUP: Processing ${memories.length} memories with UPSERT logic`);
      
      // Prepare statements for check, update, and insert
      const check_existing_stmt = database.prepare(`
        SELECT id FROM memory_index 
        WHERE file_path = ? AND spec_folder = ?
      `);
      
      const update_stmt = database.prepare(`
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
      
      const insert_stmt = database.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, anchor_id, title, trigger_phrases,
          importance_weight, created_at, updated_at, embedding_model,
          embedding_status, importance_tier, context_type, channel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?)
      `);

      for (const mem of memories) {
        // Check if we have an embedding for this memory
        const has_embedding = embeddings_by_old_id.has(mem.id);
        const embedding_status = has_embedding ? 'success' : 'pending';
        
        // Check for existing memory by (file_path, spec_folder)
        // Handle NULL file_paths specially - they can't be deduplicated, always insert
        let existing_id = null;
        if (mem.file_path != null && mem.file_path !== '') {
          const existing = check_existing_stmt.get(mem.file_path, mem.spec_folder);
          existing_id = existing ? existing.id : null;
        }
        
        try {
          if (existing_id) {
            // UPDATE existing entry - preserves original created_at and id
            update_stmt.run(
              mem.title,
              mem.anchor_id,
              mem.trigger_phrases,
              mem.importance_weight || 0.5,
              mem.content_hash || null,
              mem.embedding_model || 'nomic-ai/nomic-embed-text-v1.5',
              embedding_status,
              mem.importance_tier || 'normal',
              mem.context_type || 'general',
              mem.channel || 'default',
              existing_id
            );
            updated++;
            
            // Track ID mapping (old snapshot ID -> existing database ID)
            id_mapping.set(mem.id, existing_id);
          } else {
            // INSERT new entry
            const insert_result = insert_stmt.run(
              mem.spec_folder,
              mem.file_path,
              mem.anchor_id,
              mem.title,
              mem.trigger_phrases,
              mem.importance_weight || 0.5,
              mem.created_at,
              mem.embedding_model || 'nomic-ai/nomic-embed-text-v1.5',
              embedding_status,
              mem.importance_tier || 'normal',
              mem.context_type || 'general',
              mem.channel || 'default'
            );
            inserted++;
            
            // Track ID mapping for embedding restoration
            const new_id = Number(insert_result.lastInsertRowid);
            id_mapping.set(mem.id, new_id);
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
    if (sqlite_vec_available && snapshot_embeddings.length > 0) {
      const insert_embedding_stmt = database.prepare(`
        INSERT OR REPLACE INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `);

      // Get current embedding dimension from provider (dynamic, not hardcoded)
      const current_dim = getEmbeddingDimension();
      // Get checkpoint's stored dimension (fallback to 768 for legacy checkpoints)
      const checkpoint_dim = is_new_format && snapshot.metadata?.embeddingDimension 
        ? snapshot.metadata.embeddingDimension 
        : 768;
      
      // Log dimension info for debugging
      if (checkpoint_dim !== current_dim) {
        console.warn(`[checkpoints] Dimension change detected: checkpoint=${checkpoint_dim}, current=${current_dim}. Embeddings will be regenerated.`);
      }

      for (const [old_id, embedding_array] of embeddings_by_old_id) {
        const new_id = id_mapping.get(old_id);
        if (!new_id) {
          // Memory wasn't inserted (duplicate or error)
          continue;
        }

        try {
          // Validate embedding dimension against CURRENT provider dimension
          if (embedding_array.length !== current_dim) {
            console.warn(`[checkpoints] Embedding dimension mismatch for memory ${old_id}: current provider expects ${current_dim}, checkpoint has ${embedding_array.length}. Will regenerate.`);
            // Mark for regeneration
            database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('pending', new_id);
            embeddings_skipped++;
            continue;
          }

          // Convert array back to Float32Array buffer
          const embedding_buffer = Buffer.from(new Float32Array(embedding_array).buffer);
          
          // Insert embedding
          insert_embedding_stmt.run(BigInt(new_id), embedding_buffer);
          embeddings_restored++;
        } catch (err) {
          console.warn(`[checkpoints] Could not restore embedding for memory ${old_id} -> ${new_id}: ${err.message}`);
          // Mark for regeneration on error
          database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('pending', new_id);
          embeddings_skipped++;
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
      embeddingsRestored: embeddings_restored,
      embeddingsSkipped: embeddings_skipped,
      embeddingsInSnapshot: snapshot_embeddings.length,
    };
  })();

  // Determine if embeddings need regeneration
  const embeddings_need_regeneration = result.inserted > 0 && 
    (result.embeddingsInSnapshot === 0 || result.embeddingsRestored < result.inserted);
  
  // Build appropriate note
  let note;
  const total_processed = result.inserted + result.updated;
  if (total_processed === 0) {
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
    embeddingsNeedRegeneration: embeddings_need_regeneration,
    note,
  };
}

/* ───────────────────────────────────────────────────────────────
   6. CHECKPOINT DELETION
   ─────────────────────────────────────────────────────────────── */

// Delete a checkpoint
function delete_checkpoint(name) {
  const database = get_database(); // Throws if not initialized
  const result = database.prepare('DELETE FROM checkpoints WHERE name = ?').run(name);
  return result.changes > 0;
}

/* ───────────────────────────────────────────────────────────────
   7. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  init,
  // Short aliases for MCP server
  create: create_checkpoint,
  list: list_checkpoints,
  get: get_checkpoint,
  restore: restore_checkpoint,
  delete: delete_checkpoint,
  // Full names for backward compatibility
  createCheckpoint: create_checkpoint,
  listCheckpoints: list_checkpoints,
  getCheckpoint: get_checkpoint,
  restoreCheckpoint: restore_checkpoint,
  deleteCheckpoint: delete_checkpoint,
  getGitBranch: get_git_branch,
};
