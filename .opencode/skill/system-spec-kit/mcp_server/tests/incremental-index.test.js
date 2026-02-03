// ───────────────────────────────────────────────────────────────
// TEST: INCREMENTAL INDEXING (T064-T066)
// ───────────────────────────────────────────────────────────────
// Tests for REQ-023: Incremental Indexing with content hash + mtime tracking
// Comprehensive test coverage for incremental-index.js
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Import the module under test
const incrementalIndex = require('../lib/storage/incremental-index.js');

// Test utilities
const test_results = [];
let tests_passed = 0;
let tests_failed = 0;

function test(name, fn) {
  try {
    fn();
    tests_passed++;
    test_results.push({ name, status: 'PASS' });
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    tests_failed++;
    test_results.push({ name, status: 'FAIL', error: err.message });
    console.log(`  [FAIL] ${name}: ${err.message}`);
  }
}

// Create an enhanced mock database for testing
function create_mock_db() {
  const storage = new Map();
  const mtime_updates = [];

  const db = {
    prepare: (sql) => ({
      get: (...params) => {
        // Mock: SELECT id, content_hash, file_mtime_ms, embedding_status FROM memory_index WHERE file_path = ?
        // Note: SQL has newlines so we need to check for both parts separately
        if (sql.includes('FROM memory_index') && sql.includes('WHERE file_path')) {
          const file_path = params[0];
          const result = storage.get(file_path);
          return result || null;
        }
        return null;
      },
      run: (...params) => {
        // Mock: UPDATE memory_index SET file_mtime_ms = ?, updated_at = ... WHERE id = ?
        if (sql.includes('UPDATE memory_index') && sql.includes('file_mtime_ms')) {
          mtime_updates.push({ mtime_ms: params[0], id: params[1] });
          return { changes: 1 };
        }
        return { changes: 0 };
      }
    }),
    transaction: (fn) => {
      // Return a function that executes the transaction
      return (items) => fn(items);
    },
    // Helper to set up test data
    _setMemory: (file_path, data) => storage.set(file_path, data),
    _getMemory: (file_path) => storage.get(file_path),
    _getMtimeUpdates: () => mtime_updates,
    _clearMtimeUpdates: () => mtime_updates.length = 0,
    _clear: () => {
      storage.clear();
      mtime_updates.length = 0;
    }
  };

  return db;
}

// Create a temporary test file
function create_temp_file(content = 'test content') {
  const temp_dir = os.tmpdir();
  const file_name = `test-${Date.now()}-${Math.random().toString(36).slice(2)}.md`;
  const file_path = path.join(temp_dir, file_name);
  fs.writeFileSync(file_path, content, 'utf-8');
  return file_path;
}

// Clean up temp file
function cleanup_temp_file(file_path) {
  try {
    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path);
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

console.log('\n=== Incremental Indexing Tests (T064-T066) ===\n');

/* ─────────────────────────────────────────────────────────────
   T064: Content Hash + Mtime Tracking Tests
──────────────────────────────────────────────────────────────── */

console.log('T064: Content Hash + Mtime Tracking\n');

test('get_file_metadata returns content hash and mtime', () => {
  const file_path = create_temp_file('Hello World');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);

    assert(metadata !== null, 'Metadata should not be null');
    assert(typeof metadata.mtime_ms === 'number', 'mtime_ms should be a number');
    assert(typeof metadata.content_hash === 'string', 'content_hash should be a string');
    assert(metadata.content_hash.length === 64, 'content_hash should be 64 char SHA256 hex');
    assert(typeof metadata.mtime_iso === 'string', 'mtime_iso should be an ISO string');
    assert(typeof metadata.file_size === 'number', 'file_size should be a number');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('get_file_metadata returns null for non-existent file', () => {
  const metadata = incrementalIndex.get_file_metadata('/non/existent/path/file.md');
  assert(metadata === null, 'Should return null for non-existent file');
});

test('get_file_metadata content hash matches crypto SHA256', () => {
  const content = 'Test content for hash verification';
  const file_path = create_temp_file(content);
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    const expected_hash = crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
    assert(metadata.content_hash === expected_hash, 'Hash should match crypto SHA256');
  } finally {
    cleanup_temp_file(file_path);
  }
});

/* ─────────────────────────────────────────────────────────────
   T065: shouldReindex() Function Tests
──────────────────────────────────────────────────────────────── */

console.log('\nT065: shouldReindex() Function\n');

test('should_reindex returns reindex:true for new file (not in DB)', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('new content');
  try {
    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === true, 'Should reindex new files');
    assert(result.reason === 'new_file', 'Reason should be new_file');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('should_reindex returns reindex:true when force=true', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('test');
  try {
    // Set up existing memory in mock DB
    const metadata = incrementalIndex.get_file_metadata(file_path);
    db._setMemory(file_path, {
      id: 1,
      content_hash: metadata.content_hash,
      file_mtime_ms: metadata.mtime_ms,
      embedding_status: 'success'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: true });
    assert(result.reindex === true, 'Should reindex when force=true');
    assert(result.reason === 'force_requested', 'Reason should be force_requested');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('should_reindex returns reindex:false for unchanged file (mtime fast-path)', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('unchanged content');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);

    // Set up existing memory with matching mtime
    db._setMemory(file_path, {
      id: 1,
      content_hash: metadata.content_hash,
      file_mtime_ms: metadata.mtime_ms,
      embedding_status: 'success'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === false, 'Should NOT reindex unchanged files');
    assert(result.reason === 'mtime_unchanged', 'Reason should be mtime_unchanged');
    assert(result.fast_path === true, 'Should use fast path');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('should_reindex returns reindex:true for pending embedding status', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('pending content');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);

    // Set up existing memory with pending status
    db._setMemory(file_path, {
      id: 1,
      content_hash: metadata.content_hash,
      file_mtime_ms: metadata.mtime_ms,
      embedding_status: 'pending'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === true, 'Should reindex pending embeddings');
    assert(result.reason === 'embedding_pending', 'Reason should be embedding_pending');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('should_reindex detects content change via hash comparison', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('original content');
  try {
    // Set up existing memory with OLD content hash but recent mtime
    db._setMemory(file_path, {
      id: 1,
      content_hash: 'old_hash_that_does_not_match',
      file_mtime_ms: Date.now() - 5000, // 5 seconds ago - different from current
      embedding_status: 'success'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === true, 'Should reindex when content changed');
    assert(result.reason === 'content_changed', 'Reason should be content_changed');
  } finally {
    cleanup_temp_file(file_path);
  }
});

/* ─────────────────────────────────────────────────────────────
   T066: Batch Categorization Tests
──────────────────────────────────────────────────────────────── */

console.log('\nT066: Batch Categorization\n');

test('categorize_files_for_indexing separates files correctly', () => {
  const db = create_mock_db();

  // Create test files
  const new_file = create_temp_file('new file content');
  const unchanged_file = create_temp_file('unchanged file content');
  const changed_file = create_temp_file('changed content v2');

  try {
    // Set up unchanged file in DB
    const unchanged_meta = incrementalIndex.get_file_metadata(unchanged_file);
    db._setMemory(unchanged_file, {
      id: 1,
      content_hash: unchanged_meta.content_hash,
      file_mtime_ms: unchanged_meta.mtime_ms,
      embedding_status: 'success'
    });

    // Set up changed file with old hash
    db._setMemory(changed_file, {
      id: 2,
      content_hash: 'old_hash_does_not_match',
      file_mtime_ms: Date.now() - 10000,
      embedding_status: 'success'
    });

    // Categorize files
    const files = [new_file, unchanged_file, changed_file];
    const result = incrementalIndex.categorize_files_for_indexing(db, files, { force: false });

    // Verify categorization
    assert(result.needs_indexing.length === 2, 'Should have 2 files needing indexing (new + changed)');
    assert(result.unchanged.length === 1, 'Should have 1 unchanged file');
    assert(result.stats.total === 3, 'Total should be 3');
    assert(result.stats.fast_path_skips >= 1, 'Should have at least 1 fast-path skip');
  } finally {
    cleanup_temp_file(new_file);
    cleanup_temp_file(unchanged_file);
    cleanup_temp_file(changed_file);
  }
});

test('MTIME_FAST_PATH_MS is configured', () => {
  assert(typeof incrementalIndex.MTIME_FAST_PATH_MS === 'number', 'Should export MTIME_FAST_PATH_MS');
  assert(incrementalIndex.MTIME_FAST_PATH_MS > 0, 'MTIME_FAST_PATH_MS should be positive');
});

/* ─────────────────────────────────────────────────────────────
   Additional get_file_metadata() Tests
──────────────────────────────────────────────────────────────── */

console.log('\nAdditional get_file_metadata() Tests\n');

test('get_file_metadata returns correct file_size', () => {
  const content = 'Test content with known size';
  const file_path = create_temp_file(content);
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    const expected_size = Buffer.byteLength(content, 'utf-8');
    assert(metadata.file_size === expected_size, `file_size should be ${expected_size}, got ${metadata.file_size}`);
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('get_file_metadata mtime_iso is valid ISO string', () => {
  const file_path = create_temp_file('test');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    const parsed = new Date(metadata.mtime_iso);
    assert(!isNaN(parsed.getTime()), 'mtime_iso should be parseable as Date');
    assert(metadata.mtime_iso.includes('T'), 'mtime_iso should contain T separator');
    assert(metadata.mtime_iso.includes('Z') || metadata.mtime_iso.includes('+'), 'mtime_iso should contain timezone');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('get_file_metadata handles empty file', () => {
  const file_path = create_temp_file('');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    assert(metadata !== null, 'Should handle empty file');
    assert(metadata.file_size === 0, 'Empty file should have size 0');
    assert(metadata.content_hash.length === 64, 'Should still compute hash for empty file');
    // SHA256 of empty string
    const expected_hash = crypto.createHash('sha256').update('', 'utf-8').digest('hex');
    assert(metadata.content_hash === expected_hash, 'Hash should match SHA256 of empty string');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('get_file_metadata handles unicode content', () => {
  const content = 'Hello 世界 🌍 emoji test';
  const file_path = create_temp_file(content);
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    const expected_hash = crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
    assert(metadata.content_hash === expected_hash, 'Hash should match for unicode content');
  } finally {
    cleanup_temp_file(file_path);
  }
});

/* ─────────────────────────────────────────────────────────────
   get_stored_metadata() Tests
──────────────────────────────────────────────────────────────── */

console.log('\nget_stored_metadata() Tests\n');

test('get_stored_metadata returns null for non-existent file', () => {
  const db = create_mock_db();
  const result = incrementalIndex.get_stored_metadata(db, '/nonexistent/path.md');
  assert(result === null, 'Should return null for non-existent file');
});

test('get_stored_metadata returns stored data correctly', () => {
  const db = create_mock_db();
  const file_path = '/test/file.md';
  const stored_data = {
    id: 42,
    content_hash: 'abc123def456',
    file_mtime_ms: 1699999999999,
    embedding_status: 'success'
  };
  db._setMemory(file_path, stored_data);

  const result = incrementalIndex.get_stored_metadata(db, file_path);
  assert(result !== null, 'Should return stored data');
  assert(result.id === 42, 'id should match');
  assert(result.content_hash === 'abc123def456', 'content_hash should match');
  assert(result.mtime_ms === 1699999999999, 'mtime_ms should match');
  assert(result.embedding_status === 'success', 'embedding_status should match');
});

/* ─────────────────────────────────────────────────────────────
   Additional should_reindex() Tests
──────────────────────────────────────────────────────────────── */

console.log('\nAdditional should_reindex() Tests\n');

test('should_reindex returns reindex:true for failed embedding status', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('failed content');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    db._setMemory(file_path, {
      id: 1,
      content_hash: metadata.content_hash,
      file_mtime_ms: metadata.mtime_ms,
      embedding_status: 'failed'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === true, 'Should reindex failed embeddings');
    assert(result.reason === 'embedding_failed', 'Reason should be embedding_failed');
    assert(result.existing_id === 1, 'Should include existing_id');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('should_reindex returns error for non-existent file', () => {
  const db = create_mock_db();
  const result = incrementalIndex.should_reindex(db, '/nonexistent/file.md', { force: false });
  assert(result.reindex === false, 'Should not reindex non-existent file');
  assert(result.reason === 'file_not_found', 'Reason should be file_not_found');
  assert(result.error === true, 'Should have error flag');
});

test('should_reindex detects content_unchanged with update_mtime flag', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('same content');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);

    // Set stored mtime to be older (different from current)
    const old_mtime = metadata.mtime_ms - 5000;
    db._setMemory(file_path, {
      id: 1,
      content_hash: metadata.content_hash, // Same hash
      file_mtime_ms: old_mtime, // Different mtime
      embedding_status: 'success'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === false, 'Should not reindex when content unchanged');
    assert(result.reason === 'content_unchanged', 'Reason should be content_unchanged');
    assert(result.update_mtime === true, 'Should have update_mtime flag');
    assert(result.new_mtime_ms === metadata.mtime_ms, 'Should include new_mtime_ms');
    assert(result.existing_id === 1, 'Should include existing_id');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('should_reindex includes old_hash and new_hash for content_changed', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('new content');
  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);
    const old_hash = 'old_hash_12345';

    db._setMemory(file_path, {
      id: 1,
      content_hash: old_hash,
      file_mtime_ms: Date.now() - 5000,
      embedding_status: 'success'
    });

    const result = incrementalIndex.should_reindex(db, file_path, { force: false });
    assert(result.reindex === true, 'Should reindex when content changed');
    assert(result.old_hash === old_hash, 'Should include old_hash');
    assert(result.new_hash === metadata.content_hash, 'Should include new_hash');
  } finally {
    cleanup_temp_file(file_path);
  }
});

/* ─────────────────────────────────────────────────────────────
   update_file_mtime() and set_indexed_mtime() Tests
──────────────────────────────────────────────────────────────── */

console.log('\nupdate_file_mtime() and set_indexed_mtime() Tests\n');

test('update_file_mtime calls database with correct params', () => {
  const db = create_mock_db();
  db._clearMtimeUpdates();

  incrementalIndex.update_file_mtime(db, 42, 1699999999999);

  const updates = db._getMtimeUpdates();
  assert(updates.length === 1, 'Should have one update');
  assert(updates[0].id === 42, 'id should be 42');
  assert(updates[0].mtime_ms === 1699999999999, 'mtime_ms should match');
});

test('set_indexed_mtime calls database with correct params', () => {
  const db = create_mock_db();
  db._clearMtimeUpdates();

  incrementalIndex.set_indexed_mtime(db, 123, 1700000000000);

  const updates = db._getMtimeUpdates();
  assert(updates.length === 1, 'Should have one update');
  assert(updates[0].id === 123, 'id should be 123');
  assert(updates[0].mtime_ms === 1700000000000, 'mtime_ms should match');
});

/* ─────────────────────────────────────────────────────────────
   batch_update_mtimes() Tests
──────────────────────────────────────────────────────────────── */

console.log('\nbatch_update_mtimes() Tests\n');

test('batch_update_mtimes returns 0 for empty array', () => {
  const db = create_mock_db();
  const result = incrementalIndex.batch_update_mtimes(db, []);
  assert(result === 0, 'Should return 0 for empty array');
});

test('batch_update_mtimes processes multiple updates', () => {
  const db = create_mock_db();
  db._clearMtimeUpdates();

  const updates = [
    { id: 1, mtime_ms: 1700000000001 },
    { id: 2, mtime_ms: 1700000000002 },
    { id: 3, mtime_ms: 1700000000003 }
  ];

  const result = incrementalIndex.batch_update_mtimes(db, updates);
  assert(result === 3, 'Should return count of updates');

  const mtime_updates = db._getMtimeUpdates();
  assert(mtime_updates.length === 3, 'Should have 3 updates recorded');
});

/* ─────────────────────────────────────────────────────────────
   categorize_files_for_indexing() Additional Tests
──────────────────────────────────────────────────────────────── */

console.log('\ncategorize_files_for_indexing() Additional Tests\n');

test('categorize_files_for_indexing handles not_found files', () => {
  const db = create_mock_db();
  const files = ['/nonexistent/file1.md', '/nonexistent/file2.md'];

  const result = incrementalIndex.categorize_files_for_indexing(db, files, { force: false });

  assert(result.not_found.length === 2, 'Should have 2 not_found files');
  assert(result.needs_indexing.length === 0, 'Should have 0 files needing indexing');
  assert(result.unchanged.length === 0, 'Should have 0 unchanged files');
  assert(result.stats.total === 2, 'Total should be 2');
});

test('categorize_files_for_indexing includes needs_mtime_update', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('content for mtime update test');

  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);

    // Same hash, different mtime
    db._setMemory(file_path, {
      id: 1,
      content_hash: metadata.content_hash,
      file_mtime_ms: metadata.mtime_ms - 5000,
      embedding_status: 'success'
    });

    const result = incrementalIndex.categorize_files_for_indexing(db, [file_path], { force: false });

    assert(result.needs_mtime_update.length === 1, 'Should have 1 file needing mtime update');
    assert(result.needs_mtime_update[0].id === 1, 'Should include id');
    assert(result.needs_mtime_update[0].mtime_ms === metadata.mtime_ms, 'Should include new mtime_ms');
  } finally {
    cleanup_temp_file(file_path);
  }
});

test('categorize_files_for_indexing with force=true reindexes all', () => {
  const db = create_mock_db();
  const file1 = create_temp_file('file 1 content');
  const file2 = create_temp_file('file 2 content');

  try {
    // Set up both files as indexed
    const meta1 = incrementalIndex.get_file_metadata(file1);
    const meta2 = incrementalIndex.get_file_metadata(file2);

    db._setMemory(file1, {
      id: 1,
      content_hash: meta1.content_hash,
      file_mtime_ms: meta1.mtime_ms,
      embedding_status: 'success'
    });
    db._setMemory(file2, {
      id: 2,
      content_hash: meta2.content_hash,
      file_mtime_ms: meta2.mtime_ms,
      embedding_status: 'success'
    });

    const result = incrementalIndex.categorize_files_for_indexing(db, [file1, file2], { force: true });

    assert(result.needs_indexing.length === 2, 'Should reindex all files when force=true');
    assert(result.unchanged.length === 0, 'Should have 0 unchanged files');
    result.needs_indexing.forEach(f => {
      assert(f.reason === 'force_requested', 'Reason should be force_requested');
    });
  } finally {
    cleanup_temp_file(file1);
    cleanup_temp_file(file2);
  }
});

test('categorize_files_for_indexing tracks hash_checks correctly', () => {
  const db = create_mock_db();
  const file_path = create_temp_file('hash check content');

  try {
    const metadata = incrementalIndex.get_file_metadata(file_path);

    // Different mtime forces hash check
    db._setMemory(file_path, {
      id: 1,
      content_hash: 'different_hash',
      file_mtime_ms: metadata.mtime_ms - 5000,
      embedding_status: 'success'
    });

    const result = incrementalIndex.categorize_files_for_indexing(db, [file_path], { force: false });

    assert(result.stats.hash_checks >= 1, 'Should count hash checks');
  } finally {
    cleanup_temp_file(file_path);
  }
});

/* ─────────────────────────────────────────────────────────────
   Backward Compatibility Aliases (camelCase)
──────────────────────────────────────────────────────────────── */

console.log('\nBackward Compatibility Aliases (camelCase)\n');

test('shouldReindex is alias for should_reindex', () => {
  assert(incrementalIndex.shouldReindex === incrementalIndex.should_reindex,
    'shouldReindex should equal should_reindex');
});

test('getFileMetadata is alias for get_file_metadata', () => {
  assert(incrementalIndex.getFileMetadata === incrementalIndex.get_file_metadata,
    'getFileMetadata should equal get_file_metadata');
});

test('getStoredMetadata is alias for get_stored_metadata', () => {
  assert(incrementalIndex.getStoredMetadata === incrementalIndex.get_stored_metadata,
    'getStoredMetadata should equal get_stored_metadata');
});

test('updateFileMtime is alias for update_file_mtime', () => {
  assert(incrementalIndex.updateFileMtime === incrementalIndex.update_file_mtime,
    'updateFileMtime should equal update_file_mtime');
});

test('setIndexedMtime is alias for set_indexed_mtime', () => {
  assert(incrementalIndex.setIndexedMtime === incrementalIndex.set_indexed_mtime,
    'setIndexedMtime should equal set_indexed_mtime');
});

test('categorizeFilesForIndexing is alias for categorize_files_for_indexing', () => {
  assert(incrementalIndex.categorizeFilesForIndexing === incrementalIndex.categorize_files_for_indexing,
    'categorizeFilesForIndexing should equal categorize_files_for_indexing');
});

test('batchUpdateMtimes is alias for batch_update_mtimes', () => {
  assert(incrementalIndex.batchUpdateMtimes === incrementalIndex.batch_update_mtimes,
    'batchUpdateMtimes should equal batch_update_mtimes');
});

/* ─────────────────────────────────────────────────────────────
   Module Exports Verification
──────────────────────────────────────────────────────────────── */

console.log('\nModule Exports Verification\n');

test('All expected exports are present', () => {
  const expected_exports = [
    // Core functions (snake_case)
    'should_reindex',
    'get_file_metadata',
    'get_stored_metadata',
    'update_file_mtime',
    'set_indexed_mtime',
    // Batch processing
    'categorize_files_for_indexing',
    'batch_update_mtimes',
    // Configuration
    'MTIME_FAST_PATH_MS',
    // Backward compatibility aliases (camelCase)
    'shouldReindex',
    'getFileMetadata',
    'getStoredMetadata',
    'updateFileMtime',
    'setIndexedMtime',
    'categorizeFilesForIndexing',
    'batchUpdateMtimes'
  ];

  const missing = [];
  for (const name of expected_exports) {
    if (incrementalIndex[name] === undefined) {
      missing.push(name);
    }
  }

  assert(missing.length === 0, `Missing exports: ${missing.join(', ')}`);
});

/* ─────────────────────────────────────────────────────────────
   Summary
──────────────────────────────────────────────────────────────── */

console.log('\n=== Test Summary ===\n');
console.log(`Total: ${tests_passed + tests_failed}`);
console.log(`Passed: ${tests_passed}`);
console.log(`Failed: ${tests_failed}`);

if (tests_failed > 0) {
  console.log('\nFailed Tests:');
  test_results.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`  - ${r.name}: ${r.error}`);
  });
  process.exit(1);
} else {
  console.log('\nAll tests passed!');
  console.log('CHK-151: Content hash tracking implemented [VERIFIED]');
  console.log('CHK-152: mtime check for file modification detection [VERIFIED]');
  console.log('CHK-153: shouldReindex() returns false for unchanged files [VERIFIED]');
  process.exit(0);
}
