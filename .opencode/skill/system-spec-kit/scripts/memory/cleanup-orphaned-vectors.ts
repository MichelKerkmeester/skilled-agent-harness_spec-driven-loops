// ---------------------------------------------------------------
// MODULE: Cleanup Orphaned Vectors
// Database maintenance — removes orphaned vector embeddings and history entries
// ---------------------------------------------------------------

// Node stdlib
import * as path from 'path';

// External packages
import Database from 'better-sqlite3';
import { load as loadSqliteVec } from 'sqlite-vec';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

interface CountResult {
  count: number;
}

interface OrphanedEntry {
  memory_id: number;
}

interface OrphanedVector {
  rowid: number | bigint;
}

/* -----------------------------------------------------------------
   2. CONFIGURATION
------------------------------------------------------------------*/

const dbPath: string = path.join(__dirname, '../../../mcp_server/database/context-index.sqlite');

/* -----------------------------------------------------------------
   3. MAIN FUNCTION
------------------------------------------------------------------*/

async function main(): Promise<void> {
  let database: InstanceType<typeof Database> | null = null;
  try {
    console.log('Opening database:', dbPath);
    database = new Database(dbPath);
    loadSqliteVec(database);

    let totalCleaned = 0;

    // ---------------------------------------------------------
    // STEP 1: Clean orphaned memory_history entries
    // ---------------------------------------------------------
    console.log('\n[Step 1] Finding orphaned memory_history entries...');
    try {
      const orphanedHistory: OrphanedEntry[] = database.prepare(`
        SELECT h.memory_id
        FROM memory_history h
        LEFT JOIN memory_index m ON h.memory_id = m.id
        WHERE m.id IS NULL
      `).all() as OrphanedEntry[];

      if (orphanedHistory.length > 0) {
        console.log(`Found ${orphanedHistory.length} orphaned history entries`);

        const deleteHistory = database.transaction((ids: OrphanedEntry[]) => {
          const stmt = database!.prepare('DELETE FROM memory_history WHERE memory_id = ?');
          for (const { memory_id } of ids) {
            stmt.run(memory_id);
          }
        });

        deleteHistory(orphanedHistory);
        console.log(`Deleted ${orphanedHistory.length} orphaned history entries`);
        totalCleaned += orphanedHistory.length;
      } else {
        console.log('No orphaned history entries found');
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      if (!errMsg.includes('no such table')) {
        console.warn('memory_history cleanup warning:', errMsg);
      }
    }

    // ---------------------------------------------------------
    // STEP 2: Clean orphaned vec_memories entries
    // ---------------------------------------------------------
    console.log('\n[Step 2] Finding orphaned vector entries...');
    const orphanedVectors: OrphanedVector[] = database.prepare(`
      SELECT v.rowid
      FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id
      WHERE m.id IS NULL
    `).all() as OrphanedVector[];

    console.log(`Found ${orphanedVectors.length} orphaned vectors`);

    if (orphanedVectors.length > 0) {
      let deleted = 0;
      const deleteStmt = database.prepare('DELETE FROM vec_memories WHERE rowid = ?');
      const deleteBatch = database.transaction((rows: OrphanedVector[]) => {
        for (const row of rows) {
          deleteStmt.run(BigInt(row.rowid));
          deleted++;
        }
      });

      const chunkSize = 100;
      for (let i = 0; i < orphanedVectors.length; i += chunkSize) {
        const chunk = orphanedVectors.slice(i, i + chunkSize);
        deleteBatch(chunk);
        console.log(`Deleted ${deleted}/${orphanedVectors.length} vectors`);
      }

      totalCleaned += deleted;
    }

    // ---------------------------------------------------------
    // STEP 3: Verify and report
    // ---------------------------------------------------------
    console.log('\n[Step 3] Verification...');
    const memoryCount: CountResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as CountResult;
    const vectorCount: CountResult = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get() as CountResult;

    let historyCount: CountResult = { count: 0 };
    try {
      historyCount = database.prepare('SELECT COUNT(*) as count FROM memory_history').get() as CountResult;
    } catch (e) {
      // Table may not exist
    }

    console.log('\nFinal counts:');
    console.log(`  Memories: ${memoryCount.count}`);
    console.log(`  Vectors:  ${vectorCount.count}`);
    console.log(`  History:  ${historyCount.count}`);
    console.log(`\nTotal cleaned: ${totalCleaned}`);

    database.close();
    console.log('\nCleanup completed successfully');
    process.exit(0);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[cleanup-orphaned-vectors] Error:', errMsg);
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

/* -----------------------------------------------------------------
   4. INITIALIZE
------------------------------------------------------------------*/

main();

/* -----------------------------------------------------------------
   5. EXPORTS
------------------------------------------------------------------*/

export { main };
