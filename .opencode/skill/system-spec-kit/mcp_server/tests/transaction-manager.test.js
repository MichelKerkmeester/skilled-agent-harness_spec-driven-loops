// ───────────────────────────────────────────────────────────────
// TEST: TRANSACTION MANAGER
// T105-T107: Memory Save Atomicity Tests
// T192-T200: Transaction Atomicity Tests
// ───────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const transactionManager = require('../lib/storage/transaction-manager.js');

/* ─────────────────────────────────────────────────────────────
   1. TEST UTILITIES
──────────────────────────────────────────────────────────────── */

let TEST_DIR = null;

function setup(test_name = 'default') {
  // Create unique directory per test to avoid cross-contamination
  TEST_DIR = path.join(os.tmpdir(), 'transaction-manager-test-' + Date.now() + '-' + test_name);
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
  transactionManager.reset_metrics();
}

function cleanup() {
  try {
    if (TEST_DIR && fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  } catch (err) {
    console.warn('Cleanup warning:', err.message);
  }
  TEST_DIR = null;
}

/* ─────────────────────────────────────────────────────────────
   2. UNIT TESTS
──────────────────────────────────────────────────────────────── */

async function test_pending_path_generation() {
  console.log('Test: Pending path generation...');

  const original = '/path/to/memory/file.md';
  const pending = transactionManager.get_pending_path(original);

  assert.strictEqual(pending, '/path/to/memory/file_pending.md', 'Pending path should have _pending suffix');

  const recovered = transactionManager.get_original_path(pending);
  assert.strictEqual(recovered, original, 'Original path should be recovered from pending');

  assert(transactionManager.is_pending_file(pending), 'Should detect pending file');
  assert(!transactionManager.is_pending_file(original), 'Should not detect original as pending');

  console.log('  PASS: Pending path generation');
}

async function test_atomic_write_success() {
  console.log('Test: Atomic write success...');
  setup('atomic-write');

  const file_path = path.join(TEST_DIR, 'test-file.md');
  const content = '# Test Content\n\nThis is a test memory file.';

  await transactionManager.atomic_write_file(file_path, content);

  assert(fs.existsSync(file_path), 'File should be created');
  const read_content = fs.readFileSync(file_path, 'utf-8');
  assert.strictEqual(read_content, content, 'Content should match');

  // Verify temp file is cleaned up
  assert(!fs.existsSync(file_path + '.tmp'), 'Temp file should be removed');

  console.log('  PASS: Atomic write success');
}

async function test_execute_atomic_save_success() {
  console.log('Test: Execute atomic save success...');
  setup('save-success');

  const file_path = path.join(TEST_DIR, 'memory', 'success.md');
  const content = '# Test Memory\n\nContent for successful save.';
  let index_called = false;

  const result = await transactionManager.execute_atomic_save({
    file_path,
    content,
    index_fn: async (fp) => {
      index_called = true;
      assert.strictEqual(fp, file_path, 'Index function should receive correct path');
      return { id: 123, status: 'indexed' };
    }
  });

  assert(result.success, 'Transaction should succeed');
  assert.strictEqual(result.status, 'success', 'Status should be success');
  assert(index_called, 'Index function should be called');
  assert(fs.existsSync(file_path), 'File should exist');

  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.successful_transactions, 1, 'Should track successful transaction');

  console.log('  PASS: Execute atomic save success');
}

async function test_execute_atomic_save_rollback() {
  console.log('Test: Execute atomic save with rollback...');
  setup('save-rollback');

  const file_path = path.join(TEST_DIR, 'memory', 'rollback.md');
  const content = '# Test Memory\n\nContent for rollback test.';

  const result = await transactionManager.execute_atomic_save({
    file_path,
    content,
    index_fn: async () => {
      throw new Error('Simulated index failure');
    }
  }, {
    rollback_on_failure: true,
    create_pending_on_failure: false
  });

  assert(!result.success, 'Transaction should fail');
  assert.strictEqual(result.status, 'rolled_back', 'Status should be rolled_back');
  assert(!fs.existsSync(file_path), 'File should be deleted on rollback');

  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.failed_transactions, 1, 'Should track failed transaction');
  assert.strictEqual(metrics.rollback_count, 1, 'Should track rollback');

  console.log('  PASS: Execute atomic save with rollback');
}

async function test_execute_atomic_save_pending() {
  console.log('Test: Execute atomic save with pending file...');
  setup('save-pending');

  const file_path = path.join(TEST_DIR, 'memory', 'pending.md');
  const pending_path = transactionManager.get_pending_path(file_path);
  const content = '# Test Memory\n\nContent for pending test.';

  const result = await transactionManager.execute_atomic_save({
    file_path,
    content,
    index_fn: async () => {
      throw new Error('Simulated index failure');
    }
  }, {
    rollback_on_failure: true,
    create_pending_on_failure: true
  });

  assert(!result.success, 'Transaction should fail');
  assert.strictEqual(result.status, 'pending', 'Status should be pending');
  assert(!fs.existsSync(file_path), 'Original file should not exist');
  assert(fs.existsSync(pending_path), 'Pending file should exist');

  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.pending_files_created, 1, 'Should track pending file creation');

  console.log('  PASS: Execute atomic save with pending file');
}

async function test_find_pending_files() {
  console.log('Test: Find pending files...');
  setup('find-pending');

  // Create some pending files
  const memory_dir = path.join(TEST_DIR, 'specs', '001-test', 'memory');
  fs.mkdirSync(memory_dir, { recursive: true });

  fs.writeFileSync(path.join(memory_dir, 'normal.md'), 'Normal file');
  fs.writeFileSync(path.join(memory_dir, 'file1_pending.md'), 'Pending file 1');
  fs.writeFileSync(path.join(memory_dir, 'file2_pending.md'), 'Pending file 2');

  const pending_files = transactionManager.find_pending_files(TEST_DIR);

  assert.strictEqual(pending_files.length, 2, 'Should find 2 pending files');
  assert(pending_files.every(f => f.includes('_pending')), 'All found files should be pending');

  console.log('  PASS: Find pending files');
}

async function test_recover_pending_file() {
  console.log('Test: Recover pending file...');
  setup('recover-pending');

  // Create a pending file
  const memory_dir = path.join(TEST_DIR, 'specs', '002-test', 'memory');
  fs.mkdirSync(memory_dir, { recursive: true });

  const original_path = path.join(memory_dir, 'recovered.md');
  const pending_path = transactionManager.get_pending_path(original_path);
  const content = '# Recovered Memory\n\nThis was pending.';

  fs.writeFileSync(pending_path, content);

  let index_called = false;
  const result = await transactionManager.recover_pending_file(pending_path, async (fp) => {
    index_called = true;
    assert.strictEqual(fp, original_path, 'Should receive original path');
    return { id: 456, status: 'indexed' };
  });

  assert(result.success, 'Recovery should succeed');
  assert.strictEqual(result.status, 'recovered', 'Status should be recovered');
  assert(index_called, 'Index function should be called');
  assert(fs.existsSync(original_path), 'Original file should exist');
  assert(!fs.existsSync(pending_path), 'Pending file should be removed');

  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.pending_files_recovered, 1, 'Should track recovery');

  console.log('  PASS: Recover pending file');
}

async function test_recover_all_pending_files() {
  console.log('Test: Recover all pending files...');
  setup('recover-all');

  // Create multiple pending files
  const memory_dir = path.join(TEST_DIR, 'specs', '003-test', 'memory');
  fs.mkdirSync(memory_dir, { recursive: true });

  fs.writeFileSync(path.join(memory_dir, 'file1_pending.md'), 'Content 1');
  fs.writeFileSync(path.join(memory_dir, 'file2_pending.md'), 'Content 2');
  fs.writeFileSync(path.join(memory_dir, 'file3_pending.md'), 'Content 3');

  let index_count = 0;
  const summary = await transactionManager.recover_all_pending_files(
    TEST_DIR,
    async () => {
      index_count++;
      return { id: index_count, status: 'indexed' };
    }
  );

  assert.strictEqual(summary.found, 3, 'Should find 3 pending files');
  assert.strictEqual(summary.processed, 3, 'Should process 3 files');
  assert.strictEqual(summary.recovered, 3, 'Should recover 3 files');
  assert.strictEqual(summary.failed, 0, 'No failures expected');
  assert.strictEqual(index_count, 3, 'Index should be called 3 times');

  // Verify files are renamed back
  assert(fs.existsSync(path.join(memory_dir, 'file1.md')), 'file1.md should exist');
  assert(fs.existsSync(path.join(memory_dir, 'file2.md')), 'file2.md should exist');
  assert(fs.existsSync(path.join(memory_dir, 'file3.md')), 'file3.md should exist');

  console.log('  PASS: Recover all pending files');
}

async function test_metrics_tracking() {
  console.log('Test: Metrics tracking...');
  setup('metrics');

  // Initial state
  let metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.successful_transactions, 0, 'Initial success count should be 0');
  assert.strictEqual(metrics.failed_transactions, 0, 'Initial failure count should be 0');

  // Run a successful transaction
  await transactionManager.execute_atomic_save({
    file_path: path.join(TEST_DIR, 'metrics-test.md'),
    content: 'Test content',
    index_fn: async () => ({ id: 1 })
  });

  metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.successful_transactions, 1, 'Should track success');

  // Reset metrics
  transactionManager.reset_metrics();
  metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.successful_transactions, 0, 'Reset should clear success count');

  console.log('  PASS: Metrics tracking');
}

/* ─────────────────────────────────────────────────────────────
   3. T192-T200: TRANSACTION ATOMICITY TESTS
──────────────────────────────────────────────────────────────── */

/**
 * T192: Test execute_atomic_save() wraps file + index in transaction
 * Verifies that file write and index insert are executed as atomic unit
 */
async function test_T192_atomic_transaction_wrapper() {
  console.log('Test T192: execute_atomic_save() wraps file + index in transaction...');
  setup('T192-atomic-wrapper');

  const file_path = path.join(TEST_DIR, 'memory', 'atomic-test.md');
  const content = '# Atomic Test\n\nTransaction test content.';

  let file_written_before_index = false;
  let index_received_correct_path = false;

  const result = await transactionManager.execute_atomic_save({
    file_path,
    content,
    index_fn: async (fp) => {
      // At this point, file should already be written
      file_written_before_index = fs.existsSync(fp);
      index_received_correct_path = fp === file_path;
      return { id: 'T192', indexed: true };
    }
  });

  // Verify transaction completed successfully
  assert(result.success, 'Transaction should succeed');
  assert.strictEqual(result.status, 'success', 'Status should be success');

  // Verify atomic ordering: file written before index called
  assert(file_written_before_index, 'File should be written before index_fn is called');
  assert(index_received_correct_path, 'index_fn should receive correct file path');

  // Verify result contains expected properties
  assert.strictEqual(result.file_path, file_path, 'Result should contain file_path');
  assert(result.result, 'Result should contain index function result');
  assert.strictEqual(result.result.id, 'T192', 'Result should contain index return value');

  console.log('  PASS: T192 - execute_atomic_save() wraps file + index in transaction');
}

/**
 * T193: Test temp file + rename strategy for atomic writes
 * Verifies that atomic_write_file uses temp file + rename pattern
 */
async function test_T193_temp_file_rename_strategy() {
  console.log('Test T193: temp file + rename strategy for atomic writes...');
  setup('T193-temp-rename');

  const file_path = path.join(TEST_DIR, 'atomic-rename.md');
  const temp_path = file_path + transactionManager.TEMP_SUFFIX;
  const content = '# Temp File Test\n\nContent for temp file rename test.';

  // Verify temp file constant exists
  assert.strictEqual(transactionManager.TEMP_SUFFIX, '.tmp', 'TEMP_SUFFIX should be .tmp');

  // Write file atomically
  await transactionManager.atomic_write_file(file_path, content);

  // Verify final file exists with correct content
  assert(fs.existsSync(file_path), 'Final file should exist');
  const read_content = fs.readFileSync(file_path, 'utf-8');
  assert.strictEqual(read_content, content, 'Content should match');

  // Verify temp file is cleaned up (rename completed)
  assert(!fs.existsSync(temp_path), 'Temp file should not exist after successful write');

  console.log('  PASS: T193 - temp file + rename strategy for atomic writes');
}

/**
 * T194: Test file rollback (deletion) on index failure
 * Verifies that file is deleted when index fails with rollback_on_failure=true
 */
async function test_T194_file_rollback_on_index_failure() {
  console.log('Test T194: file rollback (deletion) on index failure...');
  setup('T194-rollback');

  const file_path = path.join(TEST_DIR, 'memory', 'rollback-test.md');
  const content = '# Rollback Test\n\nThis file should be deleted on failure.';

  const result = await transactionManager.execute_atomic_save({
    file_path,
    content,
    index_fn: async () => {
      throw new Error('Simulated index failure for T194');
    }
  }, {
    rollback_on_failure: true,
    create_pending_on_failure: false  // Force rollback instead of pending
  });

  // Verify transaction failed
  assert(!result.success, 'Transaction should fail');
  assert.strictEqual(result.status, 'rolled_back', 'Status should be rolled_back');

  // Verify file was deleted (rolled back)
  assert(!fs.existsSync(file_path), 'File should be deleted on rollback');

  // Verify error is captured
  assert(result.error, 'Result should contain error');
  assert(result.error.message.includes('T194'), 'Error should contain original message');

  // Verify metrics track rollback
  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.rollback_count, 1, 'Rollback count should be 1');
  assert.strictEqual(metrics.failed_transactions, 1, 'Failed transactions should be 1');

  console.log('  PASS: T194 - file rollback (deletion) on index failure');
}

/**
 * T195: Test file renamed with _pending suffix on failure (alternative)
 * Verifies that file is renamed to _pending when index fails with create_pending_on_failure=true
 */
async function test_T195_pending_suffix_on_failure() {
  console.log('Test T195: file renamed with _pending suffix on failure...');
  setup('T195-pending');

  const file_path = path.join(TEST_DIR, 'memory', 'pending-test.md');
  const pending_path = transactionManager.get_pending_path(file_path);
  const content = '# Pending Test\n\nThis file should be renamed to _pending on failure.';

  // Verify pending suffix constant
  assert.strictEqual(transactionManager.PENDING_SUFFIX, '_pending', 'PENDING_SUFFIX should be _pending');

  const result = await transactionManager.execute_atomic_save({
    file_path,
    content,
    index_fn: async () => {
      throw new Error('Simulated index failure for T195');
    }
  }, {
    rollback_on_failure: true,
    create_pending_on_failure: true  // Create pending file instead of delete
  });

  // Verify transaction failed with pending status
  assert(!result.success, 'Transaction should fail');
  assert.strictEqual(result.status, 'pending', 'Status should be pending');

  // Verify original file does not exist
  assert(!fs.existsSync(file_path), 'Original file should not exist');

  // Verify pending file exists with correct content
  assert(fs.existsSync(pending_path), 'Pending file should exist');
  const read_content = fs.readFileSync(pending_path, 'utf-8');
  assert.strictEqual(read_content, content, 'Pending file content should match original');

  // Verify result contains pending path
  assert.strictEqual(result.pending_path, pending_path, 'Result should contain pending_path');

  // Verify metrics track pending file creation
  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.pending_files_created, 1, 'pending_files_created should be 1');

  console.log('  PASS: T195 - file renamed with _pending suffix on failure');
}

/**
 * T196: Test recover_pending_files() on MCP startup
 * Verifies that pending files can be recovered after simulated restart
 */
async function test_T196_recover_pending_files_startup() {
  console.log('Test T196: recover_pending_files() on MCP startup...');
  setup('T196-startup-recovery');

  // Simulate MCP crash scenario: create a pending file manually
  const memory_dir = path.join(TEST_DIR, 'specs', 'crash-test', 'memory');
  fs.mkdirSync(memory_dir, { recursive: true });

  const original_path = path.join(memory_dir, 'recovered-startup.md');
  const pending_path = transactionManager.get_pending_path(original_path);
  const content = '# Startup Recovery Test\n\nThis simulates a file left pending after crash.';

  fs.writeFileSync(pending_path, content);

  // Simulate MCP startup - recover pending file
  let index_called = false;
  let indexed_path = null;

  const result = await transactionManager.recover_pending_file(pending_path, async (fp) => {
    index_called = true;
    indexed_path = fp;
    return { id: 'T196', status: 'indexed' };
  });

  // Verify recovery succeeded
  assert(result.success, 'Recovery should succeed');
  assert.strictEqual(result.status, 'recovered', 'Status should be recovered');

  // Verify index was called with original path (not pending path)
  assert(index_called, 'Index function should be called during recovery');
  assert.strictEqual(indexed_path, original_path, 'Index should receive original path, not pending path');

  // Verify file state after recovery
  assert(fs.existsSync(original_path), 'Original file should exist after recovery');
  assert(!fs.existsSync(pending_path), 'Pending file should not exist after recovery');

  // Verify content preserved
  const read_content = fs.readFileSync(original_path, 'utf-8');
  assert.strictEqual(read_content, content, 'Content should be preserved after recovery');

  console.log('  PASS: T196 - recover_pending_files() on MCP startup');
}

/**
 * T197: Test find_pending_files() scans recursively
 * Verifies that pending files are found in nested directories
 */
async function test_T197_find_pending_files_recursive() {
  console.log('Test T197: find_pending_files() scans recursively...');
  setup('T197-recursive-scan');

  // Create nested directory structure with pending files at various depths
  const dirs = [
    path.join(TEST_DIR, 'level1'),
    path.join(TEST_DIR, 'level1', 'level2'),
    path.join(TEST_DIR, 'level1', 'level2', 'level3'),
    path.join(TEST_DIR, 'specs', 'project-a', 'memory'),
    path.join(TEST_DIR, 'specs', 'project-b', 'memory')
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create pending files at different levels
  fs.writeFileSync(path.join(dirs[0], 'file1_pending.md'), 'Level 1 pending');
  fs.writeFileSync(path.join(dirs[1], 'file2_pending.md'), 'Level 2 pending');
  fs.writeFileSync(path.join(dirs[2], 'file3_pending.md'), 'Level 3 pending');
  fs.writeFileSync(path.join(dirs[3], 'memory1_pending.md'), 'Project A pending');
  fs.writeFileSync(path.join(dirs[4], 'memory2_pending.md'), 'Project B pending');

  // Also create some non-pending files to verify they're not picked up
  fs.writeFileSync(path.join(dirs[0], 'normal.md'), 'Normal file');
  fs.writeFileSync(path.join(dirs[2], 'another.md'), 'Another normal file');

  // Find all pending files recursively
  const pending_files = transactionManager.find_pending_files(TEST_DIR, { recursive: true });

  // Verify all 5 pending files are found
  assert.strictEqual(pending_files.length, 5, 'Should find 5 pending files across all levels');

  // Verify all found files are actually pending files
  assert(pending_files.every(f => transactionManager.is_pending_file(f)),
    'All found files should be pending files');

  // Verify files from different depths are found
  const file_names = pending_files.map(f => path.basename(f));
  assert(file_names.includes('file1_pending.md'), 'Should find level 1 pending file');
  assert(file_names.includes('file2_pending.md'), 'Should find level 2 pending file');
  assert(file_names.includes('file3_pending.md'), 'Should find level 3 pending file');
  assert(file_names.includes('memory1_pending.md'), 'Should find project A pending file');
  assert(file_names.includes('memory2_pending.md'), 'Should find project B pending file');

  // Test non-recursive mode
  const non_recursive = transactionManager.find_pending_files(TEST_DIR, { recursive: false });
  assert.strictEqual(non_recursive.length, 0, 'Non-recursive should not find nested pending files');

  console.log('  PASS: T197 - find_pending_files() scans recursively');
}

/**
 * T198: Test recover_all_pending_files() processes up to 50 files
 * Verifies that max_files option limits number of processed files
 */
async function test_T198_recover_all_max_files() {
  console.log('Test T198: recover_all_pending_files() processes up to max_files...');
  setup('T198-max-files');

  const memory_dir = path.join(TEST_DIR, 'specs', 'bulk-test', 'memory');
  fs.mkdirSync(memory_dir, { recursive: true });

  // Create 75 pending files
  const total_files = 75;
  for (let i = 1; i <= total_files; i++) {
    const file_name = `memory${String(i).padStart(3, '0')}_pending.md`;
    fs.writeFileSync(path.join(memory_dir, file_name), `# Memory ${i}\n\nContent for file ${i}.`);
  }

  // Verify all files were created
  const initial_pending = transactionManager.find_pending_files(TEST_DIR);
  assert.strictEqual(initial_pending.length, total_files, `Should have created ${total_files} pending files`);

  // Recover with max_files = 50
  let index_count = 0;
  const summary = await transactionManager.recover_all_pending_files(
    TEST_DIR,
    async () => {
      index_count++;
      return { id: index_count, status: 'indexed' };
    },
    { max_files: 50 }
  );

  // Verify summary reflects limits
  assert.strictEqual(summary.found, total_files, `Should find all ${total_files} pending files`);
  assert.strictEqual(summary.processed, 50, 'Should process only 50 files');
  assert.strictEqual(summary.recovered, 50, 'Should recover 50 files');
  assert.strictEqual(summary.failed, 0, 'No failures expected');
  assert.strictEqual(index_count, 50, 'Index should be called 50 times');

  // Verify remaining pending files
  const remaining_pending = transactionManager.find_pending_files(TEST_DIR);
  assert.strictEqual(remaining_pending.length, total_files - 50, 'Should have 25 pending files remaining');

  // Verify recovered files exist
  const recovered_count = fs.readdirSync(memory_dir)
    .filter(f => !f.includes('_pending')).length;
  assert.strictEqual(recovered_count, 50, 'Should have 50 recovered (non-pending) files');

  console.log('  PASS: T198 - recover_all_pending_files() processes up to max_files');
}

/**
 * T199: Test pending file recovery re-indexes after rename
 * Verifies that recovered files are properly indexed after rename from _pending
 */
async function test_T199_recovery_reindex_after_rename() {
  console.log('Test T199: pending file recovery re-indexes after rename...');
  setup('T199-reindex');

  const memory_dir = path.join(TEST_DIR, 'specs', 'reindex-test', 'memory');
  fs.mkdirSync(memory_dir, { recursive: true });

  const original_path = path.join(memory_dir, 'reindex-memory.md');
  const pending_path = transactionManager.get_pending_path(original_path);
  const content = '# Reindex Test\n\nANCHOR: summary\nContent to be reindexed.';

  fs.writeFileSync(pending_path, content);

  // Track recovery sequence
  const events = [];
  let file_existed_at_original_when_indexed = false;
  let file_existed_at_pending_when_indexed = false;

  const result = await transactionManager.recover_pending_file(pending_path, async (fp) => {
    // Record state when index is called
    file_existed_at_original_when_indexed = fs.existsSync(original_path);
    file_existed_at_pending_when_indexed = fs.existsSync(pending_path);
    events.push({ event: 'index', path: fp });

    // Simulate indexing
    return {
      id: 'T199',
      anchor: 'summary',
      path: fp,
      status: 'indexed'
    };
  });

  // Verify recovery succeeded
  assert(result.success, 'Recovery should succeed');

  // Verify index was called AFTER rename (file at original, not pending)
  assert(file_existed_at_original_when_indexed,
    'File should exist at original path when index is called');
  assert(!file_existed_at_pending_when_indexed,
    'File should NOT exist at pending path when index is called');

  // Verify index received the original path
  assert.strictEqual(events.length, 1, 'Index should be called once');
  assert.strictEqual(events[0].path, original_path, 'Index should receive original path');

  // Verify result contains indexed information
  assert.strictEqual(result.result.id, 'T199', 'Result should contain index result');
  assert.strictEqual(result.result.path, original_path, 'Index result path should be original');

  // Verify metrics
  const metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.pending_files_recovered, 1, 'Should track successful recovery');

  console.log('  PASS: T199 - pending file recovery re-indexes after rename');
}

/**
 * T200: Test metrics tracking for rollback count
 * Verifies that rollback_count metric is accurately tracked across multiple operations
 */
async function test_T200_metrics_rollback_count() {
  console.log('Test T200: metrics tracking for rollback count...');
  setup('T200-metrics');

  // Reset metrics to ensure clean state
  transactionManager.reset_metrics();

  // Verify initial state
  let metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.rollback_count, 0, 'Initial rollback_count should be 0');
  assert.strictEqual(metrics.failed_transactions, 0, 'Initial failed_transactions should be 0');
  assert.strictEqual(metrics.pending_files_created, 0, 'Initial pending_files_created should be 0');

  // Cause 3 rollbacks with pending file creation
  for (let i = 1; i <= 3; i++) {
    const file_path = path.join(TEST_DIR, 'memory', `rollback${i}.md`);
    await transactionManager.execute_atomic_save({
      file_path,
      content: `# Rollback ${i}\n\nContent ${i}`,
      index_fn: async () => {
        throw new Error(`Failure ${i}`);
      }
    }, {
      rollback_on_failure: true,
      create_pending_on_failure: true
    });
  }

  // Verify pending rollback metrics
  metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.rollback_count, 3, 'rollback_count should be 3 after pending creations');
  assert.strictEqual(metrics.pending_files_created, 3, 'pending_files_created should be 3');
  assert.strictEqual(metrics.failed_transactions, 3, 'failed_transactions should be 3');

  // Cause 2 more rollbacks with file deletion (not pending)
  for (let i = 4; i <= 5; i++) {
    const file_path = path.join(TEST_DIR, 'memory', `rollback${i}.md`);
    await transactionManager.execute_atomic_save({
      file_path,
      content: `# Rollback ${i}\n\nContent ${i}`,
      index_fn: async () => {
        throw new Error(`Failure ${i}`);
      }
    }, {
      rollback_on_failure: true,
      create_pending_on_failure: false  // Force deletion rollback
    });
  }

  // Verify cumulative rollback metrics
  metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.rollback_count, 5, 'rollback_count should be 5 total');
  assert.strictEqual(metrics.pending_files_created, 3, 'pending_files_created should still be 3');
  assert.strictEqual(metrics.failed_transactions, 5, 'failed_transactions should be 5');

  // Add successful transactions
  for (let i = 1; i <= 2; i++) {
    const file_path = path.join(TEST_DIR, 'memory', `success${i}.md`);
    await transactionManager.execute_atomic_save({
      file_path,
      content: `# Success ${i}\n\nContent ${i}`,
      index_fn: async () => ({ id: i })
    });
  }

  // Verify successful transactions don't affect rollback count
  metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.rollback_count, 5, 'rollback_count should remain 5 after successes');
  assert.strictEqual(metrics.successful_transactions, 2, 'successful_transactions should be 2');

  // Verify last failure info is tracked
  assert(metrics.last_failure_reason, 'Should track last failure reason');
  assert(metrics.last_failure_time, 'Should track last failure time');

  // Verify reset clears all metrics
  transactionManager.reset_metrics();
  metrics = transactionManager.get_metrics();
  assert.strictEqual(metrics.rollback_count, 0, 'rollback_count should be 0 after reset');
  assert.strictEqual(metrics.pending_files_created, 0, 'pending_files_created should be 0 after reset');
  assert.strictEqual(metrics.successful_transactions, 0, 'successful_transactions should be 0 after reset');
  assert.strictEqual(metrics.failed_transactions, 0, 'failed_transactions should be 0 after reset');
  assert.strictEqual(metrics.last_failure_reason, null, 'last_failure_reason should be null after reset');

  console.log('  PASS: T200 - metrics tracking for rollback count');
}

/* ─────────────────────────────────────────────────────────────
   4. TEST RUNNER
──────────────────────────────────────────────────────────────── */

async function run_all_tests() {
  console.log('\n=== Transaction Manager Tests (T105-T107, T192-T200) ===\n');

  const tests = [
    // T105-T107: Original tests
    test_pending_path_generation,
    test_atomic_write_success,
    test_execute_atomic_save_success,
    test_execute_atomic_save_rollback,
    test_execute_atomic_save_pending,
    test_find_pending_files,
    test_recover_pending_file,
    test_recover_all_pending_files,
    test_metrics_tracking,
    // T192-T200: Transaction atomicity tests
    test_T192_atomic_transaction_wrapper,
    test_T193_temp_file_rename_strategy,
    test_T194_file_rollback_on_index_failure,
    test_T195_pending_suffix_on_failure,
    test_T196_recover_pending_files_startup,
    test_T197_find_pending_files_recursive,
    test_T198_recover_all_max_files,
    test_T199_recovery_reindex_after_rename,
    test_T200_metrics_rollback_count
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (error) {
      failed++;
      console.error(`  FAIL: ${test.name}`);
      console.error(`    Error: ${error.message}`);
      if (error.stack) {
        console.error(`    Stack: ${error.stack.split('\n')[1]}`);
      }
    } finally {
      // Clean up after each test to prevent cross-contamination
      cleanup();
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  run_all_tests().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
}

module.exports = {
  run_all_tests,
  // T105-T107: Original tests
  test_pending_path_generation,
  test_atomic_write_success,
  test_execute_atomic_save_success,
  test_execute_atomic_save_rollback,
  test_execute_atomic_save_pending,
  test_find_pending_files,
  test_recover_pending_file,
  test_recover_all_pending_files,
  test_metrics_tracking,
  // T192-T200: Transaction atomicity tests
  test_T192_atomic_transaction_wrapper,
  test_T193_temp_file_rename_strategy,
  test_T194_file_rollback_on_index_failure,
  test_T195_pending_suffix_on_failure,
  test_T196_recover_pending_files_startup,
  test_T197_find_pending_files_recursive,
  test_T198_recover_all_max_files,
  test_T199_recovery_reindex_after_rename,
  test_T200_metrics_rollback_count
};
