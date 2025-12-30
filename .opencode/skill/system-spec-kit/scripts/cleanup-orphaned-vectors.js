#!/usr/bin/env node
/**
 * Cleanup orphaned vectors from the database
 * These are vector entries that have no corresponding memory entry
 */

const Database = require('better-sqlite3');
const { load: loadSqliteVec } = require('sqlite-vec');
const path = require('path');

const dbPath = path.join(__dirname, '../database/context-index.sqlite');

async function main() {
  let database;
  try {
    console.log('Opening database:', dbPath);
    database = new Database(dbPath);
    loadSqliteVec(database);

    // Find orphaned vector rowids
    console.log('Finding orphaned vectors...');
    const orphanedRows = database.prepare(`
      SELECT v.rowid 
      FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id
      WHERE m.id IS NULL
    `).all();

    console.log('Orphaned vectors found:', orphanedRows.length);

    if (orphanedRows.length === 0) {
      console.log('No cleanup needed.');
      database.close();
      process.exit(0);
    }

    // Delete orphaned vectors in batches
    let deleted = 0;
    const deleteStmt = database.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    const deleteBatch = database.transaction((rows) => {
      for (const row of rows) {
        deleteStmt.run(BigInt(row.rowid));
        deleted++;
      }
    });

    // Process in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < orphanedRows.length; i += chunkSize) {
      const chunk = orphanedRows.slice(i, i + chunkSize);
      deleteBatch(chunk);
      console.log(`Deleted ${deleted}/${orphanedRows.length}`);
    }

    console.log('Cleanup complete. Total deleted:', deleted);

    // Verify
    const afterCount = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    const memoryCount = database.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    console.log(`Vectors: ${afterCount.count}, Memories: ${memoryCount.count}`);

    database.close();
    console.log('Cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[cleanup-orphaned-vectors] Error:', error.message);
    if (database) {
      try {
        database.close();
      } catch (closeErr) {
        // Ignore close errors
      }
    }
    process.exit(1);
  }
}

main();
