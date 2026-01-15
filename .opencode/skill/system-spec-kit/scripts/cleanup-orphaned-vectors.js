// ───────────────────────────────────────────────────────────────
// MAINTENANCE: CLEANUP ORPHANED VECTORS AND HISTORY
// T105: Enhanced to clean orphaned memory_history entries
// ───────────────────────────────────────────────────────────────

'use strict';

const Database = require('better-sqlite3');
const { load: loadSqliteVec } = require('sqlite-vec');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const db_path = path.join(__dirname, '../database/context-index.sqlite');

/* ─────────────────────────────────────────────────────────────
   2. MAIN FUNCTION
──────────────────────────────────────────────────────────────── */

async function main() {
  let database;
  try {
    console.log('Opening database:', db_path);
    database = new Database(db_path);
    loadSqliteVec(database);

    let total_cleaned = 0;

    // ─────────────────────────────────────────────────────────
    // STEP 1: Clean orphaned memory_history entries
    // ─────────────────────────────────────────────────────────
    console.log('\n[Step 1] Finding orphaned memory_history entries...');
    try {
      const orphaned_history = database.prepare(`
        SELECT h.memory_id 
        FROM memory_history h
        LEFT JOIN memory_index m ON h.memory_id = m.id
        WHERE m.id IS NULL
      `).all();

      if (orphaned_history.length > 0) {
        console.log(`Found ${orphaned_history.length} orphaned history entries`);
        
        const delete_history = database.transaction((ids) => {
          const stmt = database.prepare('DELETE FROM memory_history WHERE memory_id = ?');
          for (const { memory_id } of ids) {
            stmt.run(memory_id);
          }
        });
        
        delete_history(orphaned_history);
        console.log(`Deleted ${orphaned_history.length} orphaned history entries`);
        total_cleaned += orphaned_history.length;
      } else {
        console.log('No orphaned history entries found');
      }
    } catch (e) {
      // Table may not exist
      if (!e.message.includes('no such table')) {
        console.warn('memory_history cleanup warning:', e.message);
      }
    }

    // ─────────────────────────────────────────────────────────
    // STEP 2: Clean orphaned vec_memories entries
    // ─────────────────────────────────────────────────────────
    console.log('\n[Step 2] Finding orphaned vector entries...');
    const orphaned_vectors = database.prepare(`
      SELECT v.rowid 
      FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id
      WHERE m.id IS NULL
    `).all();

    console.log(`Found ${orphaned_vectors.length} orphaned vectors`);

    if (orphaned_vectors.length > 0) {
      // Delete orphaned vectors in batches
      let deleted = 0;
      const delete_stmt = database.prepare('DELETE FROM vec_memories WHERE rowid = ?');
      const delete_batch = database.transaction((rows) => {
        for (const row of rows) {
          delete_stmt.run(BigInt(row.rowid));
          deleted++;
        }
      });

      // Process in chunks of 100
      const chunk_size = 100;
      for (let i = 0; i < orphaned_vectors.length; i += chunk_size) {
        const chunk = orphaned_vectors.slice(i, i + chunk_size);
        delete_batch(chunk);
        console.log(`Deleted ${deleted}/${orphaned_vectors.length} vectors`);
      }
      
      total_cleaned += deleted;
    }

    // ─────────────────────────────────────────────────────────
    // STEP 3: Verify and report
    // ─────────────────────────────────────────────────────────
    console.log('\n[Step 3] Verification...');
    const memory_count = database.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    const vector_count = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    
    let history_count = { count: 0 };
    try {
      history_count = database.prepare('SELECT COUNT(*) as count FROM memory_history').get();
    } catch (e) {
      // Table may not exist
    }

    console.log(`\nFinal counts:`);
    console.log(`  Memories: ${memory_count.count}`);
    console.log(`  Vectors:  ${vector_count.count}`);
    console.log(`  History:  ${history_count.count}`);
    console.log(`\nTotal cleaned: ${total_cleaned}`);

    database.close();
    console.log('\nCleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[cleanup-orphaned-vectors] Error:', error.message);
    if (database) {
      try {
        database.close();
      } catch (close_err) {
        // Ignore close errors
      }
    }
    process.exit(1);
  }
}

/* ─────────────────────────────────────────────────────────────
   3. INITIALIZE
──────────────────────────────────────────────────────────────── */

main();
