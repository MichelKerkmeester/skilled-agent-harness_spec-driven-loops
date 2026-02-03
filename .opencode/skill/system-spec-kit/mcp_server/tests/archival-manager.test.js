#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// TEST: ARCHIVAL MANAGER (T059)
// ───────────────────────────────────────────────────────────────
// Tests for automatic archival of ARCHIVED state memories.
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const Database = require('better-sqlite3');

// Test utilities
let passed = 0, failed = 0, skipped = 0;

function log(msg) { console.log(msg); }
function pass(id, desc, detail = '') {
  passed++;
  console.log(`  ✅ ${id}: ${desc}${detail ? ` (${detail})` : ''}`);
}
function fail(id, desc, detail = '') {
  failed++;
  console.log(`  ❌ ${id}: ${desc}${detail ? ` - ${detail}` : ''}`);
}
function skip(id, desc, reason = '') {
  skipped++;
  console.log(`  ⏭️  ${id}: ${desc} [SKIP: ${reason}]`);
}

// Module under test
const archivalManager = require('../lib/cognitive/archival-manager.js');
const tierClassifier = require('../lib/cognitive/tier-classifier.js');

/* ─────────────────────────────────────────────────────────────
   TEST SETUP
──────────────────────────────────────────────────────────────── */

let db = null;

function setup_test_db() {
  // Create in-memory database
  db = new Database(':memory:');

  // Create minimal memory_index table
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT,
      importance_tier TEXT DEFAULT 'normal',
      created_at TEXT NOT NULL,
      last_accessed INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      archived_at TEXT
    )
  `);

  return db;
}

function teardown_test_db() {
  if (db) {
    db.close();
    db = null;
  }
}

function insert_test_memory(data) {
  const stmt = db.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, title, importance_tier, created_at, last_accessed)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.spec_folder || 'test-spec',
    data.file_path || '/test/memory.md',
    data.title || 'Test Memory',
    data.importance_tier || 'normal',
    data.created_at || new Date().toISOString(),
    data.last_accessed || 0
  );
}

/* ─────────────────────────────────────────────────────────────
   1. INITIALIZATION TESTS
──────────────────────────────────────────────────────────────── */

function test_initialization() {
  log('\n📦 1. INITIALIZATION TESTS');

  // T059-001: Init without database fails
  archivalManager.cleanup();
  const result1 = archivalManager.init(null);
  if (!result1.success && result1.error) {
    pass('T059-001', 'Init without database returns error');
  } else {
    fail('T059-001', 'Init without database returns error', `Got: ${JSON.stringify(result1)}`);
  }

  // T059-002: Init with valid database succeeds
  setup_test_db();
  const result2 = archivalManager.init(db);
  if (result2.success) {
    pass('T059-002', 'Init with valid database succeeds');
  } else {
    fail('T059-002', 'Init with valid database succeeds', result2.error);
  }

  // T059-003: is_archived column created
  const columns = db.prepare(`PRAGMA table_info(memory_index)`).all().map(c => c.name);
  if (columns.includes('is_archived')) {
    pass('T059-003', 'is_archived column exists');
  } else {
    fail('T059-003', 'is_archived column exists', `Columns: ${columns.join(', ')}`);
  }

  // T059-004: archived_at column created
  if (columns.includes('archived_at')) {
    pass('T059-004', 'archived_at column exists');
  } else {
    fail('T059-004', 'archived_at column exists', `Columns: ${columns.join(', ')}`);
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   2. ARCHIVAL CANDIDATE DETECTION TESTS
──────────────────────────────────────────────────────────────── */

function test_candidate_detection() {
  log('\n🔍 2. ARCHIVAL CANDIDATE DETECTION TESTS');

  setup_test_db();
  archivalManager.init(db);

  // Insert test memories
  const now = Date.now();
  const day_ms = 24 * 60 * 60 * 1000;

  // T059-005: Recent memory (1 day old) - should NOT be archived
  insert_test_memory({
    title: 'Recent Memory',
    last_accessed: now - (1 * day_ms),
    importance_tier: 'normal',
  });

  // T059-006: Old memory (91 days old) - SHOULD be archived
  insert_test_memory({
    title: 'Old Memory',
    last_accessed: now - (91 * day_ms),
    importance_tier: 'normal',
  });

  // T059-007: Constitutional memory (91 days old) - should NOT be archived (protected)
  insert_test_memory({
    title: 'Constitutional Memory',
    last_accessed: now - (91 * day_ms),
    importance_tier: 'constitutional',
  });

  // T059-008: Critical memory (91 days old) - should NOT be archived (protected)
  insert_test_memory({
    title: 'Critical Memory',
    last_accessed: now - (91 * day_ms),
    importance_tier: 'critical',
  });

  // T059-009: Edge case - exactly 90 days
  insert_test_memory({
    title: 'Edge Case Memory',
    last_accessed: now - (90 * day_ms),
    importance_tier: 'normal',
  });

  const candidates = archivalManager.get_archival_candidates(100);

  // Verify candidates
  const candidate_titles = candidates.map(c => c.title);

  // T059-005: Recent memory not in candidates
  if (!candidate_titles.includes('Recent Memory')) {
    pass('T059-005', 'Recent memory (1 day) NOT in candidates');
  } else {
    fail('T059-005', 'Recent memory (1 day) NOT in candidates', 'Found in candidates');
  }

  // T059-006: Old memory in candidates
  if (candidate_titles.includes('Old Memory')) {
    pass('T059-006', 'Old memory (91 days) IS in candidates');
  } else {
    fail('T059-006', 'Old memory (91 days) IS in candidates', 'Not found');
  }

  // T059-007: Constitutional not in candidates
  if (!candidate_titles.includes('Constitutional Memory')) {
    pass('T059-007', 'Constitutional memory NOT in candidates (protected tier)');
  } else {
    fail('T059-007', 'Constitutional memory NOT in candidates', 'Found in candidates');
  }

  // T059-008: Critical not in candidates
  if (!candidate_titles.includes('Critical Memory')) {
    pass('T059-008', 'Critical memory NOT in candidates (protected tier)');
  } else {
    fail('T059-008', 'Critical memory NOT in candidates', 'Found in candidates');
  }

  // T059-009: Edge case (90 days) - should be archived
  if (candidate_titles.includes('Edge Case Memory')) {
    pass('T059-009', 'Memory at 90 days threshold IS in candidates');
  } else {
    fail('T059-009', 'Memory at 90 days threshold IS in candidates', 'Not found');
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   3. ARCHIVAL ACTION TESTS
──────────────────────────────────────────────────────────────── */

function test_archival_actions() {
  log('\n📁 3. ARCHIVAL ACTION TESTS');

  setup_test_db();
  archivalManager.init(db);

  const now = Date.now();
  const day_ms = 24 * 60 * 60 * 1000;

  // Insert memory to archive
  const result = insert_test_memory({
    title: 'To Archive',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const memory_id = result.lastInsertRowid;

  // T059-010: Archive single memory (mark action)
  const archive_result = archivalManager.archive_memory(memory_id, 'mark');
  if (archive_result.success && archive_result.action === 'mark') {
    pass('T059-010', 'Archive single memory succeeds');
  } else {
    fail('T059-010', 'Archive single memory succeeds', archive_result.error);
  }

  // T059-011: Verify is_archived flag set
  const row = db.prepare('SELECT is_archived, archived_at FROM memory_index WHERE id = ?').get(memory_id);
  if (row.is_archived === 1) {
    pass('T059-011', 'is_archived flag set to 1');
  } else {
    fail('T059-011', 'is_archived flag set to 1', `Got: ${row.is_archived}`);
  }

  // T059-012: archived_at timestamp set
  if (row.archived_at) {
    pass('T059-012', 'archived_at timestamp set');
  } else {
    fail('T059-012', 'archived_at timestamp set', 'Not set');
  }

  // T059-013: Unarchive memory
  const unarchive_result = archivalManager.unarchive_memory(memory_id);
  if (unarchive_result.success) {
    const row2 = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id);
    if (row2.is_archived === 0) {
      pass('T059-013', 'Unarchive memory succeeds');
    } else {
      fail('T059-013', 'Unarchive memory succeeds', `is_archived still: ${row2.is_archived}`);
    }
  } else {
    fail('T059-013', 'Unarchive memory succeeds', unarchive_result.error);
  }

  // T059-014: Batch archive
  const ids_to_archive = [];
  for (let i = 0; i < 3; i++) {
    const r = insert_test_memory({
      title: `Batch Memory ${i}`,
      last_accessed: now - (100 * day_ms),
      importance_tier: 'normal',
    });
    ids_to_archive.push(r.lastInsertRowid);
  }

  const batch_result = archivalManager.archive_batch(ids_to_archive, 'mark');
  if (batch_result.archived === 3 && batch_result.failed === 0) {
    pass('T059-014', 'Batch archive succeeds', `Archived: ${batch_result.archived}`);
  } else {
    fail('T059-014', 'Batch archive succeeds', `Archived: ${batch_result.archived}, Failed: ${batch_result.failed}`);
  }

  // T059-015: log_only action doesn't modify database
  const log_result = insert_test_memory({
    title: 'Log Only Test',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const log_id = log_result.lastInsertRowid;

  const log_action_result = archivalManager.archive_memory(log_id, 'log_only');
  if (log_action_result.success && log_action_result.action === 'log_only') {
    const log_row = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(log_id);
    if (log_row.is_archived === 0) {
      pass('T059-015', 'log_only action does not modify database');
    } else {
      fail('T059-015', 'log_only action does not modify database', `is_archived: ${log_row.is_archived}`);
    }
  } else {
    fail('T059-015', 'log_only action returns success', log_action_result.error);
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   4. ARCHIVAL SCAN TESTS
──────────────────────────────────────────────────────────────── */

function test_archival_scan() {
  log('\n🔄 4. ARCHIVAL SCAN TESTS');

  setup_test_db();
  archivalManager.init(db);

  const now = Date.now();
  const day_ms = 24 * 60 * 60 * 1000;

  // Insert memories: 2 should be archived, 2 should not
  insert_test_memory({
    title: 'Recent 1',
    last_accessed: now - (5 * day_ms),
    importance_tier: 'normal',
  });
  insert_test_memory({
    title: 'Recent 2',
    last_accessed: now - (10 * day_ms),
    importance_tier: 'normal',
  });
  insert_test_memory({
    title: 'Old 1',
    last_accessed: now - (91 * day_ms),
    importance_tier: 'normal',
  });
  insert_test_memory({
    title: 'Old 2',
    last_accessed: now - (95 * day_ms),
    importance_tier: 'normal',
  });

  // T059-016: Run archival scan
  const scan_result = archivalManager.run_archival_scan();
  if (scan_result.archived === 2 && scan_result.failed === 0) {
    pass('T059-016', 'Archival scan archives correct count', `Archived: ${scan_result.archived}`);
  } else {
    fail('T059-016', 'Archival scan archives correct count', `Archived: ${scan_result.archived}, Expected: 2`);
  }

  // T059-017: Verify scanned count
  if (scan_result.scanned === 2) {
    pass('T059-017', 'Scan reports correct scanned count');
  } else {
    fail('T059-017', 'Scan reports correct scanned count', `Scanned: ${scan_result.scanned}`);
  }

  // T059-018: Second scan finds no new candidates
  const scan2_result = archivalManager.run_archival_scan();
  if (scan2_result.scanned === 0 && scan2_result.archived === 0) {
    pass('T059-018', 'Second scan finds no new candidates');
  } else {
    fail('T059-018', 'Second scan finds no new candidates', `Scanned: ${scan2_result.scanned}`);
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   5. BACKGROUND JOB TESTS
──────────────────────────────────────────────────────────────── */

function test_background_job() {
  log('\n⏰ 5. BACKGROUND JOB TESTS');

  setup_test_db();
  archivalManager.init(db);

  // T059-019: Start background job
  const start_result = archivalManager.start_background_job();
  if (start_result.started && start_result.interval_ms > 0) {
    pass('T059-019', 'Background job starts successfully');
  } else {
    fail('T059-019', 'Background job starts successfully', start_result.reason);
  }

  // T059-020: Check if job is running
  if (archivalManager.is_background_job_running()) {
    pass('T059-020', 'is_background_job_running returns true');
  } else {
    fail('T059-020', 'is_background_job_running returns true');
  }

  // T059-021: Starting again returns already running
  const start2_result = archivalManager.start_background_job();
  if (!start2_result.started && start2_result.reason === 'Already running') {
    pass('T059-021', 'Starting again returns already running');
  } else {
    fail('T059-021', 'Starting again returns already running', start2_result.reason);
  }

  // T059-022: Stop background job
  const stop_result = archivalManager.stop_background_job();
  if (stop_result.stopped) {
    pass('T059-022', 'Background job stops successfully');
  } else {
    fail('T059-022', 'Background job stops successfully');
  }

  // T059-023: Check job is not running after stop
  if (!archivalManager.is_background_job_running()) {
    pass('T059-023', 'Job not running after stop');
  } else {
    fail('T059-023', 'Job not running after stop');
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   6. STATISTICS TESTS
──────────────────────────────────────────────────────────────── */

function test_statistics() {
  log('\n📊 6. STATISTICS TESTS');

  setup_test_db();
  archivalManager.init(db);
  archivalManager.reset_stats();

  const now = Date.now();
  const day_ms = 24 * 60 * 60 * 1000;

  // Insert and archive some memories
  for (let i = 0; i < 5; i++) {
    insert_test_memory({
      title: `Stats Test ${i}`,
      last_accessed: now - (100 * day_ms),
      importance_tier: 'normal',
    });
  }

  archivalManager.run_archival_scan();
  const stats = archivalManager.get_stats();

  // T059-024: Stats include scan count
  if (stats.scans_completed >= 1) {
    pass('T059-024', 'Stats include scans_completed');
  } else {
    fail('T059-024', 'Stats include scans_completed', `Got: ${stats.scans_completed}`);
  }

  // T059-025: Stats include total archived
  if (stats.total_archived >= 5) {
    pass('T059-025', 'Stats include total_archived');
  } else {
    fail('T059-025', 'Stats include total_archived', `Got: ${stats.total_archived}`);
  }

  // T059-026: Stats include last_scan_at
  if (stats.last_scan_at) {
    pass('T059-026', 'Stats include last_scan_at');
  } else {
    fail('T059-026', 'Stats include last_scan_at');
  }

  // T059-027: Stats include config
  if (stats.config && stats.config.days_threshold === 90) {
    pass('T059-027', 'Stats include config with days_threshold');
  } else {
    fail('T059-027', 'Stats include config with days_threshold', JSON.stringify(stats.config));
  }

  // T059-028: Current archived count is accurate
  if (stats.current_archived_count === 5) {
    pass('T059-028', 'current_archived_count is accurate');
  } else {
    fail('T059-028', 'current_archived_count is accurate', `Got: ${stats.current_archived_count}`);
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   7. CHECK MEMORY STATUS TESTS
──────────────────────────────────────────────────────────────── */

function test_check_memory_status() {
  log('\n🔎 7. CHECK MEMORY STATUS TESTS');

  setup_test_db();
  archivalManager.init(db);

  const now = Date.now();
  const day_ms = 24 * 60 * 60 * 1000;

  // Recent memory
  const recent_result = insert_test_memory({
    title: 'Recent Status',
    last_accessed: now - (5 * day_ms),
    importance_tier: 'normal',
  });
  const recent_id = recent_result.lastInsertRowid;

  // Old memory
  const old_result = insert_test_memory({
    title: 'Old Status',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const old_id = old_result.lastInsertRowid;

  // Constitutional memory
  const const_result = insert_test_memory({
    title: 'Constitutional Status',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'constitutional',
  });
  const const_id = const_result.lastInsertRowid;

  // T059-029: Recent memory should NOT be archived
  const recent_status = archivalManager.check_memory_archival_status(recent_id);
  if (!recent_status.shouldArchive) {
    pass('T059-029', 'Recent memory shouldArchive=false');
  } else {
    fail('T059-029', 'Recent memory shouldArchive=false', recent_status.reason);
  }

  // T059-030: Old memory SHOULD be archived
  const old_status = archivalManager.check_memory_archival_status(old_id);
  if (old_status.shouldArchive) {
    pass('T059-030', 'Old memory shouldArchive=true');
  } else {
    fail('T059-030', 'Old memory shouldArchive=true', old_status.reason);
  }

  // T059-031: Constitutional protected
  const const_status = archivalManager.check_memory_archival_status(const_id);
  if (!const_status.shouldArchive && const_status.reason === 'Protected tier') {
    pass('T059-031', 'Constitutional memory protected');
  } else {
    fail('T059-031', 'Constitutional memory protected', const_status.reason);
  }

  // T059-032: Non-existent memory returns not found
  const missing_status = archivalManager.check_memory_archival_status(99999);
  if (!missing_status.shouldArchive && missing_status.reason === 'Memory not found') {
    pass('T059-032', 'Non-existent memory returns not found');
  } else {
    fail('T059-032', 'Non-existent memory returns not found', missing_status.reason);
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   8. T104-T112: SPECIFIC ARCHIVAL TASK TESTS
──────────────────────────────────────────────────────────────── */

function test_archival_tasks_t104_t112() {
  log('\n🎯 8. ARCHIVAL TASKS T104-T112');

  // ─────────────────────────────────────────────────────────────
  // T104: Test archival detection for memories > 90 days inactive
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  const now = Date.now();
  const day_ms = 24 * 60 * 60 * 1000;

  // Insert memories at various ages
  const mem_89_days = insert_test_memory({
    title: 'Memory 89 days',
    last_accessed: now - (89 * day_ms),
    importance_tier: 'normal',
  });

  const mem_90_days = insert_test_memory({
    title: 'Memory 90 days',
    last_accessed: now - (90 * day_ms),
    importance_tier: 'normal',
  });

  const mem_91_days = insert_test_memory({
    title: 'Memory 91 days',
    last_accessed: now - (91 * day_ms),
    importance_tier: 'normal',
  });

  const mem_180_days = insert_test_memory({
    title: 'Memory 180 days',
    last_accessed: now - (180 * day_ms),
    importance_tier: 'normal',
  });

  const candidates = archivalManager.get_archival_candidates(100);
  const candidate_titles = candidates.map(c => c.title);

  // 89 days should NOT be archived (below threshold)
  const t104_pass_89 = !candidate_titles.includes('Memory 89 days');
  // 90+ days SHOULD be archived
  const t104_pass_90 = candidate_titles.includes('Memory 90 days');
  const t104_pass_91 = candidate_titles.includes('Memory 91 days');
  const t104_pass_180 = candidate_titles.includes('Memory 180 days');

  if (t104_pass_89 && t104_pass_90 && t104_pass_91 && t104_pass_180) {
    pass('T104', 'Archival detection for memories > 90 days inactive',
      `89d=NOT_ARCHIVED, 90d/91d/180d=ARCHIVED`);
  } else {
    fail('T104', 'Archival detection for memories > 90 days inactive',
      `89d:${!t104_pass_89?'FAIL':'OK'} 90d:${!t104_pass_90?'FAIL':'OK'} 91d:${!t104_pass_91?'FAIL':'OK'} 180d:${!t104_pass_180?'FAIL':'OK'}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T105: Test is_archived column values: 0=active, 1=archived, 2=soft_deleted
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  // Insert test memory
  const t105_result = insert_test_memory({
    title: 'T105 Test Memory',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const t105_id = t105_result.lastInsertRowid;

  // Check initial value (0=active)
  let t105_row = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(t105_id);
  const t105_active = t105_row.is_archived === 0;

  // Archive with 'mark' action (1=archived)
  archivalManager.archive_memory(t105_id, 'mark');
  t105_row = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(t105_id);
  const t105_mark = t105_row.is_archived === 1;

  // Reset and test soft_delete (2=soft_deleted)
  db.prepare('UPDATE memory_index SET is_archived = 0 WHERE id = ?').run(t105_id);
  archivalManager.archive_memory(t105_id, 'soft_delete');
  t105_row = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(t105_id);
  const t105_soft_delete = t105_row.is_archived === 2;

  if (t105_active && t105_mark && t105_soft_delete) {
    pass('T105', 'is_archived column values: 0=active, 1=archived, 2=soft_deleted');
  } else {
    fail('T105', 'is_archived column values',
      `active(0):${t105_active?'OK':'FAIL'} mark(1):${t105_mark?'OK':'FAIL'} soft_delete(2):${t105_soft_delete?'OK':'FAIL'}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T106: Test background archival job runs at configured interval
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  // Verify the background job starts and reports its interval
  const t106_start = archivalManager.start_background_job();
  const t106_interval_valid = t106_start.started && t106_start.interval_ms > 0;

  // Verify it matches the configured interval
  const t106_interval_matches = t106_start.interval_ms === archivalManager.ARCHIVAL_CONFIG.scanIntervalMs;

  archivalManager.stop_background_job();

  if (t106_interval_valid && t106_interval_matches) {
    pass('T106', 'Background archival job runs at configured interval',
      `interval=${t106_start.interval_ms}ms`);
  } else {
    fail('T106', 'Background archival job runs at configured interval',
      `valid:${t106_interval_valid} matches:${t106_interval_matches}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T107: Test ARCHIVAL_SCAN_INTERVAL_MS configuration
  // ─────────────────────────────────────────────────────────────
  // Note: ARCHIVAL_CONFIG is loaded at module init time from env vars
  // We test that the config is exposed and has a reasonable default
  const t107_config = archivalManager.ARCHIVAL_CONFIG;
  const t107_has_interval = typeof t107_config.scanIntervalMs === 'number';
  const t107_positive = t107_config.scanIntervalMs > 0;
  // Default is 3600000 (1 hour) unless overridden by env var
  const t107_default = t107_config.scanIntervalMs === 3600000 ||
    (process.env.ARCHIVAL_SCAN_INTERVAL_MS &&
     t107_config.scanIntervalMs === parseInt(process.env.ARCHIVAL_SCAN_INTERVAL_MS, 10));

  if (t107_has_interval && t107_positive && t107_default) {
    pass('T107', 'ARCHIVAL_SCAN_INTERVAL_MS configuration',
      `scanIntervalMs=${t107_config.scanIntervalMs}ms (default=3600000)`);
  } else {
    fail('T107', 'ARCHIVAL_SCAN_INTERVAL_MS configuration',
      `has:${t107_has_interval} positive:${t107_positive} default:${t107_default} value:${t107_config.scanIntervalMs}`);
  }

  // ─────────────────────────────────────────────────────────────
  // T108: Test constitutional memories never archived (protected tier)
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  // Insert constitutional memory with very old last_accessed
  const t108_result = insert_test_memory({
    title: 'T108 Constitutional Memory',
    last_accessed: now - (365 * day_ms), // 1 year old
    importance_tier: 'constitutional',
  });
  const t108_id = t108_result.lastInsertRowid;

  // Run archival scan
  archivalManager.run_archival_scan();

  // Verify it was NOT archived
  const t108_row = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(t108_id);
  const t108_not_archived = t108_row.is_archived === 0;

  // Also verify via check_memory_archival_status
  const t108_status = archivalManager.check_memory_archival_status(t108_id);
  const t108_protected = !t108_status.shouldArchive && t108_status.reason === 'Protected tier';

  if (t108_not_archived && t108_protected) {
    pass('T108', 'Constitutional memories never archived (protected tier)');
  } else {
    fail('T108', 'Constitutional memories never archived',
      `not_archived:${t108_not_archived} protected:${t108_protected} reason:${t108_status.reason}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T109: Test critical memories never archived (protected tier)
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  // Insert critical memory with very old last_accessed
  const t109_result = insert_test_memory({
    title: 'T109 Critical Memory',
    last_accessed: now - (365 * day_ms), // 1 year old
    importance_tier: 'critical',
  });
  const t109_id = t109_result.lastInsertRowid;

  // Run archival scan
  archivalManager.run_archival_scan();

  // Verify it was NOT archived
  const t109_row = db.prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(t109_id);
  const t109_not_archived = t109_row.is_archived === 0;

  // Also verify via check_memory_archival_status
  const t109_status = archivalManager.check_memory_archival_status(t109_id);
  const t109_protected = !t109_status.shouldArchive && t109_status.reason === 'Protected tier';

  if (t109_not_archived && t109_protected) {
    pass('T109', 'Critical memories never archived (protected tier)');
  } else {
    fail('T109', 'Critical memories never archived',
      `not_archived:${t109_not_archived} protected:${t109_protected} reason:${t109_status.reason}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T110: Test ARCHIVAL_ACTION='mark' sets is_archived=1
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  const t110_result = insert_test_memory({
    title: 'T110 Mark Action Test',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const t110_id = t110_result.lastInsertRowid;

  // Use 'mark' action explicitly
  const t110_archive_result = archivalManager.archive_memory(t110_id, 'mark');

  // Verify result
  const t110_row = db.prepare('SELECT is_archived, archived_at FROM memory_index WHERE id = ?').get(t110_id);
  const t110_success = t110_archive_result.success && t110_archive_result.action === 'mark';
  const t110_value = t110_row.is_archived === 1;
  const t110_timestamp = t110_row.archived_at !== null;

  if (t110_success && t110_value && t110_timestamp) {
    pass('T110', "ARCHIVAL_ACTION='mark' sets is_archived=1",
      `archived_at=${t110_row.archived_at}`);
  } else {
    fail('T110', "ARCHIVAL_ACTION='mark' sets is_archived=1",
      `success:${t110_success} value:${t110_row.is_archived} timestamp:${t110_timestamp}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T111: Test ARCHIVAL_ACTION='soft_delete' sets is_archived=2
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  const t111_result = insert_test_memory({
    title: 'T111 Soft Delete Action Test',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const t111_id = t111_result.lastInsertRowid;

  // Use 'soft_delete' action explicitly
  const t111_archive_result = archivalManager.archive_memory(t111_id, 'soft_delete');

  // Verify result
  const t111_row = db.prepare('SELECT is_archived, archived_at FROM memory_index WHERE id = ?').get(t111_id);
  const t111_success = t111_archive_result.success && t111_archive_result.action === 'soft_delete';
  const t111_value = t111_row.is_archived === 2;
  const t111_timestamp = t111_row.archived_at !== null;

  if (t111_success && t111_value && t111_timestamp) {
    pass('T111', "ARCHIVAL_ACTION='soft_delete' sets is_archived=2",
      `archived_at=${t111_row.archived_at}`);
  } else {
    fail('T111', "ARCHIVAL_ACTION='soft_delete' sets is_archived=2",
      `success:${t111_success} value:${t111_row.is_archived} timestamp:${t111_timestamp}`);
  }

  teardown_test_db();

  // ─────────────────────────────────────────────────────────────
  // T112: Test ARCHIVAL_ACTION='log_only' does not modify records
  // ─────────────────────────────────────────────────────────────
  setup_test_db();
  archivalManager.init(db);

  const t112_result = insert_test_memory({
    title: 'T112 Log Only Action Test',
    last_accessed: now - (100 * day_ms),
    importance_tier: 'normal',
  });
  const t112_id = t112_result.lastInsertRowid;

  // Get initial state
  const t112_initial = db.prepare('SELECT is_archived, archived_at FROM memory_index WHERE id = ?').get(t112_id);

  // Use 'log_only' action explicitly
  const t112_archive_result = archivalManager.archive_memory(t112_id, 'log_only');

  // Verify result - should succeed but NOT modify database
  const t112_after = db.prepare('SELECT is_archived, archived_at FROM memory_index WHERE id = ?').get(t112_id);
  const t112_success = t112_archive_result.success && t112_archive_result.action === 'log_only';
  const t112_unchanged_archived = t112_after.is_archived === t112_initial.is_archived;
  const t112_unchanged_timestamp = t112_after.archived_at === t112_initial.archived_at;

  if (t112_success && t112_unchanged_archived && t112_unchanged_timestamp) {
    pass('T112', "ARCHIVAL_ACTION='log_only' does not modify records",
      `is_archived remained ${t112_after.is_archived}`);
  } else {
    fail('T112', "ARCHIVAL_ACTION='log_only' does not modify records",
      `success:${t112_success} unchanged_archived:${t112_unchanged_archived} unchanged_ts:${t112_unchanged_timestamp}`);
  }

  teardown_test_db();
}

/* ─────────────────────────────────────────────────────────────
   RUN ALL TESTS
──────────────────────────────────────────────────────────────── */

function run_all_tests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ARCHIVAL MANAGER TESTS (T059)');
  console.log('═══════════════════════════════════════════════════════════');

  test_initialization();
  test_candidate_detection();
  test_archival_actions();
  test_archival_scan();
  test_background_job();
  test_statistics();
  test_check_memory_status();
  test_archival_tasks_t104_t112();

  // Cleanup
  archivalManager.cleanup();

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log('═══════════════════════════════════════════════════════════');

  if (failed > 0) {
    process.exit(1);
  }
}

run_all_tests();
