// ───────────────────────────────────────────────────────────────
// MAINTENANCE: CLEANUP ORPHANED VECTORS
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

    // Find orphaned vector rowids
    console.log('Finding orphaned vectors...');
    const orphaned_rows = database.prepare(`
      SELECT v.rowid 
      FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id
      WHERE m.id IS NULL
    `).all();

    console.log('Orphaned vectors found:', orphaned_rows.length);

    if (orphaned_rows.length === 0) {
      console.log('No cleanup needed.');
      database.close();
      process.exit(0);
    }

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
    for (let i = 0; i < orphaned_rows.length; i += chunk_size) {
      const chunk = orphaned_rows.slice(i, i + chunk_size);
      delete_batch(chunk);
      console.log(`Deleted ${deleted}/${orphaned_rows.length}`);
    }

    console.log('Cleanup complete. Total deleted:', deleted);

    // Verify
    const after_count = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    const memory_count = database.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    console.log(`Vectors: ${after_count.count}, Memories: ${memory_count.count}`);

    database.close();
    console.log('Cleanup completed successfully');
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
