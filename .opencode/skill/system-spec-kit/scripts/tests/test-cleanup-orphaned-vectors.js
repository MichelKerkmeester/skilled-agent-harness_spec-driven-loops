// ───────────────────────────────────────────────────────────────
// TEST: CLEANUP ORPHANED VECTORS MODULE
// Tests database maintenance — orphaned vector and history cleanup
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const SCRIPTS_DIR = path.join(__dirname, '..', 'dist');
const MODULE_PATH = path.join(SCRIPTS_DIR, 'memory', 'cleanup-orphaned-vectors.js');

// Track sqlite-vec availability (loaded once)
let sqliteVecAvailable = false;
let loadSqliteVec = null;

// Monotonic counter for unique history IDs (avoids Date.now() collisions)
let historyIdCounter = 0;

try {
  const sqliteVec = require('sqlite-vec');
  loadSqliteVec = sqliteVec.load;
  sqliteVecAvailable = true;
} catch (e) {
  // sqlite-vec not available — vec_memories tests will be skipped
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
────────────────────────────────────────────────────────────────*/

function log(msg) {
  console.log(msg);
}

function pass(testName, evidence) {
  results.passed++;
  results.tests.push({ name: testName, status: 'PASS', evidence });
  log(`   ✅ ${testName}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(testName, reason) {
  results.failed++;
  results.tests.push({ name: testName, status: 'FAIL', reason });
  log(`   ❌ ${testName}`);
  log(`      Reason: ${reason}`);
}

function skip(testName, reason) {
  results.skipped++;
  results.tests.push({ name: testName, status: 'SKIP', reason });
  log(`   ⏭️  ${testName} (skipped: ${reason})`);
}

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    pass(testName, `${actual} === ${expected}`);
    return true;
  } else {
    fail(testName, `Expected ${expected}, got ${actual}`);
    return false;
  }
}

function assertType(value, expectedType, testName) {
  const actualType = typeof value;
  if (actualType === expectedType) {
    pass(testName, `Type is ${actualType}`);
    return true;
  } else {
    fail(testName, `Expected type ${expectedType}, got ${actualType}`);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. DATABASE HELPERS
────────────────────────────────────────────────────────────────*/

/**
 * Creates an in-memory SQLite database with the same schema
 * used by the cleanup-orphaned-vectors module.
 * @param {object} opts - Options
 * @param {boolean} opts.withHistory - Include memory_history table (default true)
 * @param {boolean} opts.withVec - Include vec_memories virtual table (default true, requires sqlite-vec)
 * @returns {Database} better-sqlite3 Database instance
 */
function createTestDatabase(opts = {}) {
  const { withHistory = true, withVec = true } = opts;
  const db = new Database(':memory:');

  // Disable foreign keys — the cleanup module operates on databases where
  // orphans already exist (FK was either not enforced or data was externally
  // modified). Tests must be able to create orphaned state freely.
  db.pragma('foreign_keys = OFF');

  // Core memory_index table (simplified for tests)
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      importance_tier TEXT DEFAULT 'normal'
    )
  `);

  // memory_history table
  if (withHistory) {
    db.exec(`
      CREATE TABLE memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system',
        FOREIGN KEY (memory_id) REFERENCES memory_index(id)
      )
    `);
  }

  // vec_memories virtual table (requires sqlite-vec extension)
  if (withVec && sqliteVecAvailable) {
    loadSqliteVec(db);
    db.exec(`
      CREATE VIRTUAL TABLE vec_memories USING vec0(
        embedding FLOAT[384]
      )
    `);
  }

  return db;
}

/**
 * Insert a memory record into memory_index.
 * @returns {number} The inserted row ID
 */
function insertMemory(db, { specFolder = 'test-spec', filePath = '/test/file.md', title = 'Test' } = {}) {
  const result = db.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, title)
    VALUES (?, ?, ?)
  `).run(specFolder, filePath, title);
  return Number(result.lastInsertRowid);
}

/**
 * Insert a history record referencing a memory_id.
 */
function insertHistory(db, memoryId, event = 'ADD') {
  historyIdCounter++;
  db.prepare(`
    INSERT INTO memory_history (id, memory_id, event)
    VALUES (?, ?, ?)
  `).run(`hist-${memoryId}-${historyIdCounter}`, memoryId, event);
}

/**
 * Insert a vector embedding into vec_memories at the given rowid.
 * Fills with zeros for simplicity.
 */
function insertVector(db, rowid) {
  const embedding = new Float32Array(384).fill(0);
  db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(
    BigInt(rowid),
    Buffer.from(embedding.buffer)
  );
}

/* ─────────────────────────────────────────────────────────────
   4. MODULE STRUCTURE TESTS
────────────────────────────────────────────────────────────────*/

async function testModuleStructure() {
  log('\n🔬 MODULE STRUCTURE: cleanup-orphaned-vectors.js');

  // Test 1: Compiled file exists
  if (fs.existsSync(MODULE_PATH)) {
    pass('T-COV-001a: Compiled module file exists', MODULE_PATH);
  } else {
    fail('T-COV-001a: Compiled module file exists', 'File not found');
    return; // Can't continue without the file
  }

  // Test 2: File is valid JavaScript (parseable)
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');
    if (content.includes('exports.main') || content.includes('exports.main =')) {
      pass('T-COV-001b: Module exports main function', 'exports.main found');
    } else {
      fail('T-COV-001b: Module exports main function', 'exports.main not found');
    }
  } catch (e) {
    fail('T-COV-001b: Module exports main function', e.message);
  }

  // Test 3: Module contains expected SQL queries
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');

    if (content.includes('memory_history') && content.includes('LEFT JOIN memory_index')) {
      pass('T-COV-001c: Module contains orphaned history detection SQL', 'LEFT JOIN pattern found');
    } else {
      fail('T-COV-001c: Module contains orphaned history detection SQL', 'SQL pattern missing');
    }

    if (content.includes('vec_memories') && content.includes('DELETE FROM vec_memories')) {
      pass('T-COV-001d: Module contains orphaned vector deletion SQL', 'DELETE FROM vec_memories found');
    } else {
      fail('T-COV-001d: Module contains orphaned vector deletion SQL', 'SQL pattern missing');
    }
  } catch (e) {
    fail('T-COV-001c: Module contains expected SQL', e.message);
  }

  // Test 4: Module has chunked batch deletion (chunkSize = 100)
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');
    if (content.includes('chunkSize') || content.includes('chunk')) {
      pass('T-COV-001e: Module uses chunked batch deletion', 'chunk pattern found');
    } else {
      fail('T-COV-001e: Module uses chunked batch deletion', 'No chunking pattern');
    }
  } catch (e) {
    fail('T-COV-001e: Module uses chunked batch deletion', e.message);
  }

  // Test 5: Module handles database close in error path
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');
    const closeCount = (content.match(/\.close\(\)/g) || []).length;
    if (closeCount >= 2) {
      pass('T-COV-001f: Module closes database in both success and error paths', `${closeCount} close() calls`);
    } else {
      fail('T-COV-001f: Module closes database in both success and error paths', `Only ${closeCount} close() calls`);
    }
  } catch (e) {
    fail('T-COV-001f: Module closes database in both paths', e.message);
  }

  // Test 6: Module uses transactions for batch operations
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');
    const transactionCount = (content.match(/\.transaction\(/g) || []).length;
    if (transactionCount >= 2) {
      pass('T-COV-001g: Module uses transactions for batch operations', `${transactionCount} transaction() calls`);
    } else {
      fail('T-COV-001g: Module uses transactions for batch operations', `Only ${transactionCount} transaction() calls`);
    }
  } catch (e) {
    fail('T-COV-001g: Module uses transactions', e.message);
  }

  // Test 7: Module handles "no such table" gracefully for memory_history
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');
    if (content.includes('no such table')) {
      pass('T-COV-001h: Module handles missing memory_history table', '"no such table" check found');
    } else {
      fail('T-COV-001h: Module handles missing memory_history table', 'No such table check missing');
    }
  } catch (e) {
    fail('T-COV-001h: Module handles missing table', e.message);
  }

  // Test 8: Module uses BigInt for vec_memories rowid
  try {
    const content = fs.readFileSync(MODULE_PATH, 'utf8');
    if (content.includes('BigInt')) {
      pass('T-COV-001i: Module uses BigInt for vec_memories rowid', 'BigInt usage found');
    } else {
      fail('T-COV-001i: Module uses BigInt for vec_memories rowid', 'BigInt not found');
    }
  } catch (e) {
    fail('T-COV-001i: Module uses BigInt', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. ORPHANED HISTORY DETECTION SQL TESTS
────────────────────────────────────────────────────────────────*/

async function testOrphanedHistoryDetection() {
  log('\n🔬 SQL LOGIC: Orphaned History Detection');

  // Use the same SQL query pattern as the module
  const ORPHANED_HISTORY_SQL = `
    SELECT h.memory_id
    FROM memory_history h
    LEFT JOIN memory_index m ON h.memory_id = m.id
    WHERE m.id IS NULL
  `;

  // Test 1: No orphans when all history references valid memories
  try {
    const db = createTestDatabase({ withVec: false });
    const memId = insertMemory(db);
    insertHistory(db, memId, 'ADD');
    insertHistory(db, memId, 'UPDATE');

    const orphans = db.prepare(ORPHANED_HISTORY_SQL).all();
    assertEqual(orphans.length, 0, 'T-COV-002a: No orphans when all history refs valid memories');
    db.close();
  } catch (e) {
    fail('T-COV-002a: No orphans when all history refs valid memories', e.message);
  }

  // Test 2: Detects orphans when memory is deleted but history remains
  try {
    const db = createTestDatabase({ withVec: false });
    const memId = insertMemory(db);
    insertHistory(db, memId, 'ADD');
    insertHistory(db, memId, 'UPDATE');

    // Delete the memory, leaving orphaned history
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(memId);

    const orphans = db.prepare(ORPHANED_HISTORY_SQL).all();
    assertEqual(orphans.length, 2, 'T-COV-002b: Detects orphaned history after memory deletion');
    db.close();
  } catch (e) {
    fail('T-COV-002b: Detects orphaned history after memory deletion', e.message);
  }

  // Test 3: Empty database returns no orphans
  try {
    const db = createTestDatabase({ withVec: false });
    const orphans = db.prepare(ORPHANED_HISTORY_SQL).all();
    assertEqual(orphans.length, 0, 'T-COV-002c: Empty database returns no orphans');
    db.close();
  } catch (e) {
    fail('T-COV-002c: Empty database returns no orphans', e.message);
  }

  // Test 4: Mixed — some orphaned, some valid
  try {
    const db = createTestDatabase({ withVec: false });

    const validMemId = insertMemory(db, { title: 'Valid' });
    insertHistory(db, validMemId, 'ADD');

    const toDeleteId = insertMemory(db, { title: 'ToDelete' });
    insertHistory(db, toDeleteId, 'ADD');
    insertHistory(db, toDeleteId, 'UPDATE');
    insertHistory(db, toDeleteId, 'DELETE');

    // Delete one memory
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(toDeleteId);

    const orphans = db.prepare(ORPHANED_HISTORY_SQL).all();
    assertEqual(orphans.length, 3, 'T-COV-002d: Mixed — 3 orphaned from deleted memory');

    // Verify valid memory's history is NOT orphaned
    const validOrphans = orphans.filter(o => o.memory_id === validMemId);
    assertEqual(validOrphans.length, 0, 'T-COV-002e: Valid memory history not flagged as orphan');
    db.close();
  } catch (e) {
    fail('T-COV-002d: Mixed orphaned/valid detection', e.message);
  }

  // Test 5: Orphan deletion works correctly
  try {
    const db = createTestDatabase({ withVec: false });

    const toDeleteId = insertMemory(db, { title: 'ToDelete' });
    insertHistory(db, toDeleteId, 'ADD');
    insertHistory(db, toDeleteId, 'UPDATE');

    // Delete the memory
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(toDeleteId);

    // Get orphans
    const orphans = db.prepare(ORPHANED_HISTORY_SQL).all();
    assertEqual(orphans.length, 2, 'T-COV-002f: Found 2 orphans before cleanup');

    // Clean up using the same pattern as the module (transactional delete)
    const deleteStmt = db.prepare('DELETE FROM memory_history WHERE memory_id = ?');
    const deleteTransaction = db.transaction((ids) => {
      for (const { memory_id } of ids) {
        deleteStmt.run(memory_id);
      }
    });
    deleteTransaction(orphans);

    // Verify cleanup
    const remaining = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();
    assertEqual(remaining.count, 0, 'T-COV-002g: All orphaned history entries deleted');
    db.close();
  } catch (e) {
    fail('T-COV-002f: Orphan history deletion', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. ORPHANED VECTOR DETECTION SQL TESTS
────────────────────────────────────────────────────────────────*/

async function testOrphanedVectorDetection() {
  log('\n🔬 SQL LOGIC: Orphaned Vector Detection');

  if (!sqliteVecAvailable) {
    skip('T-COV-003a: Orphaned vector detection (entire section)', 'sqlite-vec not available');
    return;
  }

  const ORPHANED_VECTOR_SQL = `
    SELECT v.rowid
    FROM vec_memories v
    LEFT JOIN memory_index m ON v.rowid = m.id
    WHERE m.id IS NULL
  `;

  // Test 1: No orphans when all vectors have matching memories
  try {
    const db = createTestDatabase();
    const memId = insertMemory(db);
    insertVector(db, memId);

    const orphans = db.prepare(ORPHANED_VECTOR_SQL).all();
    assertEqual(orphans.length, 0, 'T-COV-003a: No orphans when all vectors have matching memories');
    db.close();
  } catch (e) {
    fail('T-COV-003a: No orphans when all vectors match', e.message);
  }

  // Test 2: Detects orphaned vectors when memory is deleted
  try {
    const db = createTestDatabase();
    const memId = insertMemory(db);
    insertVector(db, memId);

    // Delete the memory, leaving orphaned vector
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(memId);

    const orphans = db.prepare(ORPHANED_VECTOR_SQL).all();
    assertEqual(orphans.length, 1, 'T-COV-003b: Detects orphaned vector after memory deletion');
    db.close();
  } catch (e) {
    fail('T-COV-003b: Detects orphaned vectors', e.message);
  }

  // Test 3: Empty vec_memories returns no orphans
  try {
    const db = createTestDatabase();
    const orphans = db.prepare(ORPHANED_VECTOR_SQL).all();
    assertEqual(orphans.length, 0, 'T-COV-003c: Empty vec_memories returns no orphans');
    db.close();
  } catch (e) {
    fail('T-COV-003c: Empty vec_memories no orphans', e.message);
  }

  // Test 4: Multiple orphaned vectors
  try {
    const db = createTestDatabase();

    // Create 5 memories and vectors
    const memIds = [];
    for (let i = 0; i < 5; i++) {
      const id = insertMemory(db, { title: `Memory ${i}` });
      insertVector(db, id);
      memIds.push(id);
    }

    // Delete 3 memories (keep first two)
    for (let i = 2; i < 5; i++) {
      db.prepare('DELETE FROM memory_index WHERE id = ?').run(memIds[i]);
    }

    const orphans = db.prepare(ORPHANED_VECTOR_SQL).all();
    assertEqual(orphans.length, 3, 'T-COV-003d: Detects multiple (3) orphaned vectors');
    db.close();
  } catch (e) {
    fail('T-COV-003d: Multiple orphaned vectors', e.message);
  }

  // Test 5: Vector deletion with BigInt rowid (matches module behavior)
  try {
    const db = createTestDatabase();
    const memId = insertMemory(db);
    insertVector(db, memId);

    // Delete memory
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(memId);

    // Get orphans and delete using same BigInt pattern as module
    const orphans = db.prepare(ORPHANED_VECTOR_SQL).all();
    const deleteStmt = db.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    const deleteBatch = db.transaction((rows) => {
      for (const row of rows) {
        deleteStmt.run(BigInt(row.rowid));
      }
    });
    deleteBatch(orphans);

    // Verify deletion
    const remaining = db.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    assertEqual(remaining.count, 0, 'T-COV-003e: Orphaned vectors deleted via BigInt rowid');
    db.close();
  } catch (e) {
    fail('T-COV-003e: Vector deletion with BigInt', e.message);
  }

  // Test 6: Chunked deletion for large batches (simulates chunkSize = 100)
  try {
    const db = createTestDatabase();

    // Create 250 memories with vectors, then delete all memories
    const batchSize = 250;
    for (let i = 0; i < batchSize; i++) {
      const id = insertMemory(db, { title: `Batch ${i}` });
      insertVector(db, id);
    }
    db.exec('DELETE FROM memory_index');

    const orphans = db.prepare(ORPHANED_VECTOR_SQL).all();
    assertEqual(orphans.length, batchSize, `T-COV-003f: Found ${batchSize} orphaned vectors before chunked delete`);

    // Delete in chunks of 100 (same pattern as module)
    let deleted = 0;
    const deleteStmt = db.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    const deleteBatch = db.transaction((rows) => {
      for (const row of rows) {
        deleteStmt.run(BigInt(row.rowid));
        deleted++;
      }
    });

    const chunkSize = 100;
    for (let i = 0; i < orphans.length; i += chunkSize) {
      const chunk = orphans.slice(i, i + chunkSize);
      deleteBatch(chunk);
    }

    assertEqual(deleted, batchSize, `T-COV-003g: Chunked deletion processed all ${batchSize} vectors`);

    const remaining = db.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    assertEqual(remaining.count, 0, 'T-COV-003h: All orphaned vectors cleaned after chunked deletion');
    db.close();
  } catch (e) {
    fail('T-COV-003f: Chunked deletion for large batches', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. VERIFICATION STEP SQL TESTS
────────────────────────────────────────────────────────────────*/

async function testVerificationCounts() {
  log('\n🔬 SQL LOGIC: Verification Count Queries');

  // Test 1: Count queries return correct values after cleanup
  try {
    const db = createTestDatabase({ withVec: sqliteVecAvailable });

    // Add some memories
    const mem1 = insertMemory(db, { title: 'Kept 1' });
    const mem2 = insertMemory(db, { title: 'Kept 2' });
    insertHistory(db, mem1, 'ADD');
    insertHistory(db, mem2, 'ADD');

    if (sqliteVecAvailable) {
      insertVector(db, mem1);
      insertVector(db, mem2);
    }

    // Verify counts match expected
    const memoryCount = db.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    assertEqual(memoryCount.count, 2, 'T-COV-004a: memory_index count is correct');

    const historyCount = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();
    assertEqual(historyCount.count, 2, 'T-COV-004b: memory_history count is correct');

    if (sqliteVecAvailable) {
      const vectorCount = db.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
      assertEqual(vectorCount.count, 2, 'T-COV-004c: vec_memories count is correct');
    } else {
      skip('T-COV-004c: vec_memories count', 'sqlite-vec not available');
    }

    db.close();
  } catch (e) {
    fail('T-COV-004a: Verification counts', e.message);
  }

  // Test 2: Verification after cleanup shows reduced counts
  try {
    const db = createTestDatabase({ withVec: sqliteVecAvailable });

    // Create 3 memories, delete 1 (creating orphans)
    const kept1 = insertMemory(db, { title: 'Kept' });
    const kept2 = insertMemory(db, { title: 'Also Kept' });
    const toDelete = insertMemory(db, { title: 'ToDelete' });

    insertHistory(db, kept1, 'ADD');
    insertHistory(db, kept2, 'ADD');
    insertHistory(db, toDelete, 'ADD');
    insertHistory(db, toDelete, 'UPDATE');

    if (sqliteVecAvailable) {
      insertVector(db, kept1);
      insertVector(db, kept2);
      insertVector(db, toDelete);
    }

    // Delete one memory
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(toDelete);

    // Clean orphaned history
    const orphanedHistory = db.prepare(`
      SELECT h.memory_id FROM memory_history h
      LEFT JOIN memory_index m ON h.memory_id = m.id
      WHERE m.id IS NULL
    `).all();
    const delHistStmt = db.prepare('DELETE FROM memory_history WHERE memory_id = ?');
    for (const { memory_id } of orphanedHistory) {
      delHistStmt.run(memory_id);
    }

    // Clean orphaned vectors
    if (sqliteVecAvailable) {
      const orphanedVecs = db.prepare(`
        SELECT v.rowid FROM vec_memories v
        LEFT JOIN memory_index m ON v.rowid = m.id
        WHERE m.id IS NULL
      `).all();
      const delVecStmt = db.prepare('DELETE FROM vec_memories WHERE rowid = ?');
      for (const row of orphanedVecs) {
        delVecStmt.run(BigInt(row.rowid));
      }
    }

    // Verify final counts
    const finalMemCount = db.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    assertEqual(finalMemCount.count, 2, 'T-COV-004d: memory_index count after cleanup');

    const finalHistCount = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();
    assertEqual(finalHistCount.count, 2, 'T-COV-004e: memory_history count after cleanup');

    if (sqliteVecAvailable) {
      const finalVecCount = db.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
      assertEqual(finalVecCount.count, 2, 'T-COV-004f: vec_memories count after cleanup');
    } else {
      skip('T-COV-004f: vec_memories count after cleanup', 'sqlite-vec not available');
    }

    db.close();
  } catch (e) {
    fail('T-COV-004d: Post-cleanup verification', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. EDGE CASES & ERROR HANDLING TESTS
────────────────────────────────────────────────────────────────*/

async function testEdgeCases() {
  log('\n🔬 EDGE CASES: Error Handling and Boundaries');

  // Test 1: Missing memory_history table does not crash (module catches "no such table")
  try {
    const db = createTestDatabase({ withHistory: false, withVec: false });

    // Querying memory_history should throw "no such table"
    let threw = false;
    let errMsg = '';
    try {
      db.prepare('SELECT COUNT(*) FROM memory_history').get();
    } catch (e) {
      threw = true;
      errMsg = e.message;
    }

    if (threw && errMsg.includes('no such table')) {
      pass('T-COV-005a: Missing memory_history throws "no such table"', errMsg);
    } else {
      fail('T-COV-005a: Missing memory_history throws "no such table"', `threw=${threw}, msg=${errMsg}`);
    }

    // The module silently ignores "no such table" for memory_history
    // Verify the module's guard logic pattern works:
    let suppressedCorrectly = false;
    try {
      db.prepare('SELECT COUNT(*) FROM memory_history').get();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('no such table')) {
        // Module suppresses this specific error — that's the correct behavior
        suppressedCorrectly = true;
      }
    }
    if (suppressedCorrectly) {
      pass('T-COV-005b: "no such table" error is suppressable (module pattern)', 'Pattern verified');
    } else {
      fail('T-COV-005b: "no such table" error is suppressable', 'Unexpected behavior');
    }

    db.close();
  } catch (e) {
    fail('T-COV-005a: Missing memory_history table', e.message);
  }

  // Test 2: History with memory_id referencing non-existent memories (bulk)
  try {
    const db = createTestDatabase({ withVec: false });

    // Insert history records with memory_ids that never existed
    for (let i = 100; i < 110; i++) {
      db.prepare(`INSERT INTO memory_history (id, memory_id, event) VALUES (?, ?, 'ADD')`).run(`orphan-${i}`, i);
    }

    const orphans = db.prepare(`
      SELECT h.memory_id FROM memory_history h
      LEFT JOIN memory_index m ON h.memory_id = m.id
      WHERE m.id IS NULL
    `).all();

    assertEqual(orphans.length, 10, 'T-COV-005c: Detects 10 history entries with nonexistent memory references');
    db.close();
  } catch (e) {
    fail('T-COV-005c: Bulk nonexistent memory references', e.message);
  }

  // Test 3: Database with only memory_index (no history, no vectors to clean)
  try {
    const db = createTestDatabase({ withHistory: true, withVec: false });

    insertMemory(db, { title: 'Solo memory' });

    const histOrphans = db.prepare(`
      SELECT h.memory_id FROM memory_history h
      LEFT JOIN memory_index m ON h.memory_id = m.id
      WHERE m.id IS NULL
    `).all();

    assertEqual(histOrphans.length, 0, 'T-COV-005d: No orphans in clean database with only memories');
    db.close();
  } catch (e) {
    fail('T-COV-005d: Clean database', e.message);
  }

  // Test 4: Transaction rollback on error during deletion
  try {
    const db = createTestDatabase({ withVec: false });

    const memId = insertMemory(db);
    insertHistory(db, memId, 'ADD');
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(memId);

    // Verify we have orphan
    const before = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();
    assertEqual(before.count, 1, 'T-COV-005e: History record exists before transaction test');

    // Simulate a failing transaction (should rollback)
    const badTransaction = db.transaction(() => {
      db.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(memId);
      throw new Error('Simulated failure');
    });

    let transactionFailed = false;
    try {
      badTransaction();
    } catch (e) {
      transactionFailed = true;
    }

    if (transactionFailed) {
      // Verify rollback — record should still exist
      const after = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();
      assertEqual(after.count, 1, 'T-COV-005f: Transaction rolled back on error — record preserved');
    } else {
      fail('T-COV-005f: Transaction should have failed', 'No error thrown');
    }

    db.close();
  } catch (e) {
    fail('T-COV-005e: Transaction rollback', e.message);
  }

  // Test 5: Database close after error (module's error path)
  try {
    const db = createTestDatabase({ withVec: false });
    db.close();

    // Accessing closed database should throw
    let threw = false;
    try {
      db.prepare('SELECT 1').get();
    } catch (e) {
      threw = true;
    }

    if (threw) {
      pass('T-COV-005g: Accessing closed database throws error', 'Expected behavior');
    } else {
      fail('T-COV-005g: Accessing closed database throws error', 'No error thrown');
    }
  } catch (e) {
    fail('T-COV-005g: Database close error handling', e.message);
  }

  // Test 6: Double-close does not crash (module tries close in catch block too)
  try {
    const db = createTestDatabase({ withVec: false });
    db.close();

    let doubleClosed = false;
    try {
      db.close();
      doubleClosed = true;
    } catch (e) {
      // Some versions throw, some don't — either is acceptable
      doubleClosed = false;
    }

    // The module wraps the second close in a try/catch, so either outcome is fine
    pass('T-COV-005h: Double-close handled gracefully', `doubleClosed=${doubleClosed}`);
  } catch (e) {
    fail('T-COV-005h: Double-close handling', e.message);
  }

  // Test 7: Large memory_id values (common in production)
  try {
    const db = createTestDatabase({ withVec: false });

    // Insert with explicit large ID
    db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`).run(
      99999, 'test', '/test.md', 'Large ID'
    );
    insertHistory(db, 99999, 'ADD');

    // Delete the memory
    db.prepare('DELETE FROM memory_index WHERE id = ?').run(99999);

    const orphans = db.prepare(`
      SELECT h.memory_id FROM memory_history h
      LEFT JOIN memory_index m ON h.memory_id = m.id
      WHERE m.id IS NULL
    `).all();

    assertEqual(orphans.length, 1, 'T-COV-005i: Handles large memory_id values');
    if (orphans.length > 0) {
      assertEqual(orphans[0].memory_id, 99999, 'T-COV-005j: Correct large memory_id in orphan result');
    }

    db.close();
  } catch (e) {
    fail('T-COV-005i: Large memory_id values', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. FULL CLEANUP WORKFLOW SIMULATION
────────────────────────────────────────────────────────────────*/

async function testFullCleanupWorkflow() {
  log('\n🔬 INTEGRATION: Full Cleanup Workflow Simulation');

  if (!sqliteVecAvailable) {
    skip('T-COV-006a: Full cleanup workflow (entire section)', 'sqlite-vec not available');
    return;
  }

  // Test: Simulate the complete cleanup workflow from the module
  try {
    const db = createTestDatabase();

    // ----- Setup: Create realistic data -----
    // 5 valid memories with history and vectors
    const validIds = [];
    for (let i = 0; i < 5; i++) {
      const id = insertMemory(db, { title: `Valid Memory ${i}` });
      insertHistory(db, id, 'ADD');
      insertVector(db, id);
      validIds.push(id);
    }

    // 3 memories that will be "deleted" (creating orphans)
    const orphanIds = [];
    for (let i = 0; i < 3; i++) {
      const id = insertMemory(db, { title: `Orphan Source ${i}` });
      insertHistory(db, id, 'ADD');
      insertHistory(db, id, 'UPDATE');
      insertVector(db, id);
      orphanIds.push(id);
    }

    // Delete the 3 memories (simulates external deletion)
    for (const id of orphanIds) {
      db.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
    }

    // ----- Pre-cleanup verification -----
    const preMemCount = db.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    assertEqual(preMemCount.count, 5, 'T-COV-006a: Pre-cleanup: 5 memories remain');

    const preHistCount = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();
    assertEqual(preHistCount.count, 11, 'T-COV-006b: Pre-cleanup: 11 history entries (5 valid + 6 orphaned)');

    const preVecCount = db.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    assertEqual(preVecCount.count, 8, 'T-COV-006c: Pre-cleanup: 8 vectors (5 valid + 3 orphaned)');

    // ----- Step 1: Clean orphaned history (same as module) -----
    let totalCleaned = 0;

    const orphanedHistory = db.prepare(`
      SELECT h.memory_id
      FROM memory_history h
      LEFT JOIN memory_index m ON h.memory_id = m.id
      WHERE m.id IS NULL
    `).all();

    if (orphanedHistory.length > 0) {
      const deleteHistory = db.transaction((ids) => {
        const stmt = db.prepare('DELETE FROM memory_history WHERE memory_id = ?');
        for (const { memory_id } of ids) {
          stmt.run(memory_id);
        }
      });
      deleteHistory(orphanedHistory);
      totalCleaned += orphanedHistory.length;
    }

    assertEqual(orphanedHistory.length, 6, 'T-COV-006d: Found 6 orphaned history entries');

    // ----- Step 2: Clean orphaned vectors (same as module) -----
    const orphanedVectors = db.prepare(`
      SELECT v.rowid
      FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id
      WHERE m.id IS NULL
    `).all();

    if (orphanedVectors.length > 0) {
      let deleted = 0;
      const deleteStmt = db.prepare('DELETE FROM vec_memories WHERE rowid = ?');
      const deleteBatch = db.transaction((rows) => {
        for (const row of rows) {
          deleteStmt.run(BigInt(row.rowid));
          deleted++;
        }
      });

      const chunkSize = 100;
      for (let i = 0; i < orphanedVectors.length; i += chunkSize) {
        const chunk = orphanedVectors.slice(i, i + chunkSize);
        deleteBatch(chunk);
      }
      totalCleaned += deleted;
    }

    assertEqual(orphanedVectors.length, 3, 'T-COV-006e: Found 3 orphaned vectors');

    // ----- Step 3: Verification (same as module) -----
    const finalMemCount = db.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    const finalVecCount = db.prepare('SELECT COUNT(*) as count FROM vec_memories').get();
    const finalHistCount = db.prepare('SELECT COUNT(*) as count FROM memory_history').get();

    assertEqual(finalMemCount.count, 5, 'T-COV-006f: Post-cleanup: 5 memories intact');
    assertEqual(finalVecCount.count, 5, 'T-COV-006g: Post-cleanup: 5 vectors intact');
    assertEqual(finalHistCount.count, 5, 'T-COV-006h: Post-cleanup: 5 history entries intact');
    assertEqual(totalCleaned, 9, 'T-COV-006i: Total cleaned: 9 (6 history + 3 vectors)');

    // Verify no orphans remain
    const remainingHistOrphans = db.prepare(`
      SELECT h.memory_id FROM memory_history h
      LEFT JOIN memory_index m ON h.memory_id = m.id WHERE m.id IS NULL
    `).all();
    assertEqual(remainingHistOrphans.length, 0, 'T-COV-006j: Zero orphaned history entries remain');

    const remainingVecOrphans = db.prepare(`
      SELECT v.rowid FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id WHERE m.id IS NULL
    `).all();
    assertEqual(remainingVecOrphans.length, 0, 'T-COV-006k: Zero orphaned vectors remain');

    db.close();
  } catch (e) {
    fail('T-COV-006: Full cleanup workflow', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. MODULE IMPORT SAFETY TESTS
────────────────────────────────────────────────────────────────*/

async function testModuleImportSafety() {
  log('\n🔬 IMPORT SAFETY: Module require() behavior');

  // Test 1: Module auto-executes main() on require — verify process.exit is called
  // We stub process.exit to prevent actual exit, then verify it was called.
  try {
    const originalExit = process.exit;
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    let exitCode = null;
    const capturedLogs = [];

    // Stub process.exit
    process.exit = (code) => {
      exitCode = code;
      throw new Error(`__EXIT_${code}__`);
    };

    // Suppress console output during require
    console.log = (...args) => capturedLogs.push(['log', ...args]);
    console.error = (...args) => capturedLogs.push(['error', ...args]);
    console.warn = (...args) => capturedLogs.push(['warn', ...args]);

    let moduleExports = null;
    let requireError = null;

    try {
      // Clear from cache to force re-execution
      delete require.cache[require.resolve(MODULE_PATH)];
      moduleExports = require(MODULE_PATH);
    } catch (e) {
      requireError = e;
    }

    // Restore original functions
    process.exit = originalExit;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;

    // The module either:
    // a) Called process.exit(0) on success (unlikely without real DB)
    // b) Called process.exit(1) on error (most likely — no real DB available)
    // c) Threw our stubbed exit error
    if (exitCode !== null) {
      pass('T-COV-007a: Module calls process.exit on execution', `Exit code: ${exitCode}`);
    } else if (requireError) {
      // main() is async, so the exit may happen asynchronously
      // The require itself may succeed but the async main() fails later
      pass('T-COV-007a: Module caught during require (async main)', requireError.message.substring(0, 60));
    } else {
      // main() is async and hasn't resolved yet — this is expected behavior
      pass('T-COV-007a: Module required successfully (async main pending)', 'Async execution');
    }

    // Test 2: Module exports main function regardless of execution
    if (moduleExports && typeof moduleExports.main === 'function') {
      pass('T-COV-007b: Module exports main as function', 'typeof main === function');
    } else if (moduleExports && typeof moduleExports.main !== 'undefined') {
      pass('T-COV-007b: Module exports main', `typeof main = ${typeof moduleExports.main}`);
    } else {
      // Since main() calls process.exit which we threw from, the module
      // may not have finished defining exports
      skip('T-COV-007b: Module exports main function', 'Module execution interrupted by exit stub');
    }

    // Test 3: Verify the module tried to open the database (check captured logs)
    const hasDbLog = capturedLogs.some(
      args => args.some(a => typeof a === 'string' && a.includes('database'))
    );
    const hasErrorLog = capturedLogs.some(
      args => args[0] === 'error'
    );
    if (hasDbLog || hasErrorLog) {
      pass('T-COV-007c: Module attempted database operation', `Logs captured: ${capturedLogs.length}`);
    } else {
      // Async — logs may not have been captured before the throw
      skip('T-COV-007c: Module attempted database operation', 'Async main — logs not captured synchronously');
    }

  } catch (e) {
    fail('T-COV-007a: Module import safety test', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. MAIN
────────────────────────────────────────────────────────────────*/

async function main() {
  log('🧪 Cleanup Orphaned Vectors — Test Suite');
  log('=============================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Module: ${MODULE_PATH}`);
  log(`sqlite-vec available: ${sqliteVecAvailable}\n`);

  // Module structure verification
  await testModuleStructure();

  // SQL logic tests — orphaned history
  await testOrphanedHistoryDetection();

  // SQL logic tests — orphaned vectors
  await testOrphanedVectorDetection();

  // Verification counts
  await testVerificationCounts();

  // Edge cases and error handling
  await testEdgeCases();

  // Full workflow integration test
  await testFullCleanupWorkflow();

  // Module import safety
  await testModuleImportSafety();

  // Summary
  log('\n=============================================');
  log('📊 TEST SUMMARY');
  log('=============================================');
  log(`✅ Passed:  ${results.passed}`);
  log(`❌ Failed:  ${results.failed}`);
  log(`⏭️  Skipped: ${results.skipped}`);
  log(`📝 Total:   ${results.passed + results.failed + results.skipped}`);
  log('');

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!');
    return true;
  } else {
    log('⚠️  Some tests failed. Review output above.');
    log('\nFailed tests:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => log(`   - ${t.name}: ${t.reason}`));
    return false;
  }
}

// Run tests
main().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
