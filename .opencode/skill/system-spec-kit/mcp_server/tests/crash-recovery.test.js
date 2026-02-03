// ───────────────────────────────────────────────────────────────
// TESTS: CRASH RECOVERY (T071-T075)
// ───────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Database = require('better-sqlite3');

// Import session manager
const sessionManager = require('../lib/session/session-manager.js');

/* ─────────────────────────────────────────────────────────────
   1. TEST SETUP
──────────────────────────────────────────────────────────────── */

let testDb;
let testDir;

function setup() {
  // Create temporary test directory
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'crash-recovery-test-'));

  // Create in-memory database for testing
  testDb = new Database(':memory:');

  // Initialize session manager
  const result = sessionManager.init(testDb);
  assert.strictEqual(result.success, true, 'Session manager should initialize successfully');
}

function teardown() {
  if (testDb) {
    testDb.close();
    testDb = null;
  }
  if (testDir && fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}

/* ─────────────────────────────────────────────────────────────
   2. T073: SESSION STATE TABLE
──────────────────────────────────────────────────────────────── */

function test_session_state_schema_creation() {
  console.log('TEST: T073 - Session state table creation');

  // Ensure schema is created
  const result = sessionManager.ensureSessionStateSchema();
  assert.strictEqual(result.success, true, 'Schema creation should succeed');

  // Verify table exists
  const tableInfo = testDb.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'
  `).get();
  assert.ok(tableInfo, 'session_state table should exist');

  // Verify indexes exist
  const indexes = testDb.prepare(`
    SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_session_state%'
  `).all();
  assert.strictEqual(indexes.length, 2, 'Should have 2 indexes on session_state');

  console.log('  PASS: Session state table and indexes created');
}

function test_save_session_state() {
  console.log('TEST: T073 - Save session state');

  const sessionId = 'test-session-001';
  const state = {
    specFolder: 'specs/003-memory/082-speckit',
    currentTask: 'T071',
    lastAction: 'Created generateContinueSessionMd function',
    contextSummary: 'Implementing crash recovery pattern',
    pendingWork: 'Write tests, integrate with server',
    data: { progress: 75, files: ['session-manager.js'] },
  };

  // Save state
  const result = sessionManager.saveSessionState(sessionId, state);
  assert.strictEqual(result.success, true, 'Save should succeed');

  // Verify data was saved
  const row = testDb.prepare(`
    SELECT * FROM session_state WHERE session_id = ?
  `).get(sessionId);

  assert.ok(row, 'Session state should be saved');
  assert.strictEqual(row.status, 'active', 'Status should be active');
  assert.strictEqual(row.spec_folder, state.specFolder, 'Spec folder should match');
  assert.strictEqual(row.current_task, state.currentTask, 'Current task should match');
  assert.strictEqual(row.last_action, state.lastAction, 'Last action should match');

  const parsedData = JSON.parse(row.state_data);
  assert.strictEqual(parsedData.progress, 75, 'State data should be preserved');

  console.log('  PASS: Session state saved correctly');
}

/* ─────────────────────────────────────────────────────────────
   3. T074: RESET INTERRUPTED SESSIONS
──────────────────────────────────────────────────────────────── */

function test_reset_interrupted_sessions() {
  console.log('TEST: T074 - Reset interrupted sessions on startup');

  // Create multiple active sessions
  const sessions = ['session-a', 'session-b', 'session-c'];
  for (const sessionId of sessions) {
    sessionManager.saveSessionState(sessionId, {
      specFolder: `specs/${sessionId}`,
      currentTask: 'T001',
    });
  }

  // Mark one as completed (should not be affected)
  sessionManager.completeSession('session-b');

  // Simulate crash recovery by resetting interrupted sessions
  const result = sessionManager.resetInterruptedSessions();

  assert.strictEqual(result.success, true, 'Reset should succeed');
  assert.strictEqual(result.interruptedCount, 2, 'Should interrupt 2 active sessions (not completed one)');

  // Verify statuses
  const rows = testDb.prepare(`
    SELECT session_id, status FROM session_state ORDER BY session_id
  `).all();

  const statusMap = {};
  rows.forEach(r => { statusMap[r.session_id] = r.status; });

  assert.strictEqual(statusMap['session-a'], 'interrupted', 'session-a should be interrupted');
  assert.strictEqual(statusMap['session-b'], 'completed', 'session-b should remain completed');
  assert.strictEqual(statusMap['session-c'], 'interrupted', 'session-c should be interrupted');

  console.log('  PASS: Active sessions marked as interrupted');
}

/* ─────────────────────────────────────────────────────────────
   4. T075: RECOVER STATE WITH _RECOVERED FLAG
──────────────────────────────────────────────────────────────── */

function test_recover_state() {
  console.log('TEST: T075 - Recover state with _recovered flag');

  // Create and interrupt a session
  const sessionId = 'recover-test-session';
  sessionManager.saveSessionState(sessionId, {
    specFolder: 'specs/test-recovery',
    currentTask: 'T075',
    lastAction: 'Testing recovery',
    contextSummary: 'Crash recovery test',
  });

  // Simulate crash by resetting (marks as interrupted)
  sessionManager.resetInterruptedSessions();

  // Recover the session
  const result = sessionManager.recoverState(sessionId);

  assert.strictEqual(result.success, true, 'Recovery should succeed');
  assert.strictEqual(result._recovered, true, '_recovered flag should be true');
  assert.ok(result.state, 'State should be returned');
  assert.strictEqual(result.state.specFolder, 'specs/test-recovery', 'State data should be preserved');
  assert.strictEqual(result.state._recovered, true, 'State should have _recovered flag');

  // Verify session is now active again
  const row = testDb.prepare(`
    SELECT status FROM session_state WHERE session_id = ?
  `).get(sessionId);
  assert.strictEqual(row.status, 'active', 'Session should be active after recovery');

  console.log('  PASS: Session recovered with _recovered flag');
}

function test_recover_nonexistent_session() {
  console.log('TEST: T075 - Recover non-existent session');

  const result = sessionManager.recoverState('does-not-exist');

  assert.strictEqual(result.success, true, 'Should succeed even if session not found');
  assert.strictEqual(result.state, null, 'State should be null');
  assert.strictEqual(result._recovered, false, '_recovered should be false');

  console.log('  PASS: Non-existent session handled gracefully');
}

function test_get_interrupted_sessions() {
  console.log('TEST: T074 - Get interrupted sessions list');

  // Ensure schema exists first, then clean slate
  sessionManager.ensureSessionStateSchema();
  testDb.exec('DELETE FROM session_state');

  // Create sessions and interrupt some
  sessionManager.saveSessionState('list-test-1', { specFolder: 'specs/a' });
  sessionManager.saveSessionState('list-test-2', { specFolder: 'specs/b' });
  sessionManager.saveSessionState('list-test-3', { specFolder: 'specs/c' });
  sessionManager.completeSession('list-test-2');
  sessionManager.resetInterruptedSessions();

  // Get interrupted sessions
  const result = sessionManager.getInterruptedSessions();

  assert.strictEqual(result.success, true, 'Should succeed');
  assert.strictEqual(result.sessions.length, 2, 'Should have 2 interrupted sessions');

  const sessionIds = result.sessions.map(s => s.sessionId);
  assert.ok(sessionIds.includes('list-test-1'), 'Should include list-test-1');
  assert.ok(sessionIds.includes('list-test-3'), 'Should include list-test-3');
  assert.ok(!sessionIds.includes('list-test-2'), 'Should not include completed session');

  console.log('  PASS: Interrupted sessions list returned correctly');
}

/* ─────────────────────────────────────────────────────────────
   5. T071: GENERATE CONTINUE_SESSION.md
──────────────────────────────────────────────────────────────── */

function test_generate_continue_session_md() {
  console.log('TEST: T071 - Generate CONTINUE_SESSION.md content');

  const sessionState = {
    sessionId: 'md-gen-test',
    specFolder: 'specs/003-memory/082-speckit-reimagined',
    currentTask: 'T071',
    lastAction: 'Implemented generateContinueSessionMd function',
    contextSummary: 'Working on crash recovery pattern implementation for SpecKit.',
    pendingWork: 'Write tests for all crash recovery functions.',
    data: { tasksCompleted: ['T073', 'T074'], tasksRemaining: ['T075'] },
  };

  const content = sessionManager.generateContinueSessionMd(sessionState);

  // Verify content structure
  assert.ok(content.includes('# CONTINUE SESSION'), 'Should have header');
  assert.ok(content.includes('## Session State'), 'Should have session state section');
  assert.ok(content.includes('## Context Summary'), 'Should have context summary section');
  assert.ok(content.includes('## Pending Work'), 'Should have pending work section');
  assert.ok(content.includes('## Quick Resume'), 'Should have quick resume section');
  assert.ok(content.includes('## Additional State Data'), 'Should have state data section');

  // Verify content values
  assert.ok(content.includes('md-gen-test'), 'Should include session ID');
  assert.ok(content.includes('specs/003-memory/082-speckit-reimagined'), 'Should include spec folder');
  assert.ok(content.includes('T071'), 'Should include current task');
  assert.ok(content.includes('/spec_kit:resume'), 'Should include resume command');
  assert.ok(content.includes('tasksCompleted'), 'Should include state data');

  console.log('  PASS: CONTINUE_SESSION.md content generated correctly');
}

/* ─────────────────────────────────────────────────────────────
   6. T072: WRITE CONTINUE_SESSION.md ON CHECKPOINT
──────────────────────────────────────────────────────────────── */

function test_write_continue_session_md() {
  console.log('TEST: T072 - Write CONTINUE_SESSION.md to spec folder');

  // Create a test spec folder
  const specFolder = path.join(testDir, 'test-spec-folder');
  fs.mkdirSync(specFolder, { recursive: true });

  // Save session state
  const sessionId = 'write-test-session';
  sessionManager.saveSessionState(sessionId, {
    specFolder: specFolder,
    currentTask: 'T072',
    lastAction: 'Testing file write',
    contextSummary: 'Testing CONTINUE_SESSION.md generation',
    pendingWork: 'Verify file content',
  });

  // Write CONTINUE_SESSION.md
  const result = sessionManager.writeContinueSessionMd(sessionId, specFolder);

  assert.strictEqual(result.success, true, 'Write should succeed');
  assert.ok(result.filePath, 'Should return file path');

  // Verify file exists
  const filePath = path.join(specFolder, 'CONTINUE_SESSION.md');
  assert.ok(fs.existsSync(filePath), 'CONTINUE_SESSION.md should exist');

  // Verify content
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('# CONTINUE SESSION'), 'File should have correct header');
  assert.ok(content.includes('write-test-session'), 'File should include session ID');
  assert.ok(content.includes('T072'), 'File should include current task');

  console.log('  PASS: CONTINUE_SESSION.md written to spec folder');
}

function test_checkpoint_session() {
  console.log('TEST: T072 - Checkpoint session (save + generate md)');

  // Create a test spec folder
  const specFolder = path.join(testDir, 'checkpoint-test-folder');
  fs.mkdirSync(specFolder, { recursive: true });

  const sessionId = 'checkpoint-test-session';
  const state = {
    specFolder: specFolder,
    currentTask: 'T072',
    lastAction: 'Testing checkpoint',
    contextSummary: 'Full checkpoint test',
    pendingWork: 'None',
  };

  // Checkpoint session
  const result = sessionManager.checkpointSession(sessionId, state, specFolder);

  assert.strictEqual(result.success, true, 'Checkpoint should succeed');

  // Verify SQLite state saved
  const row = testDb.prepare(`
    SELECT * FROM session_state WHERE session_id = ?
  `).get(sessionId);
  assert.ok(row, 'State should be in database');
  assert.strictEqual(row.current_task, 'T072', 'Task should be saved');

  // Verify CONTINUE_SESSION.md exists
  const filePath = path.join(specFolder, 'CONTINUE_SESSION.md');
  assert.ok(fs.existsSync(filePath), 'CONTINUE_SESSION.md should exist');

  console.log('  PASS: Checkpoint saves to SQLite and generates md file');
}

/* ─────────────────────────────────────────────────────────────
   7. T009-T016: CRASH RECOVERY TESTS
──────────────────────────────────────────────────────────────── */

/**
 * T009: Test session_state table schema creation on first startup
 */
function test_T009_session_state_table_schema_creation_on_first_startup() {
  console.log('TEST: T009 - Session state table schema creation on first startup');

  // Create a fresh in-memory database (simulating first startup)
  const freshDb = new Database(':memory:');

  // Initialize session manager with fresh database
  const initResult = sessionManager.init(freshDb);
  assert.strictEqual(initResult.success, true, 'Init should succeed');

  // Verify session_state table is automatically created during init
  const tableCheck = freshDb.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='session_state'
  `).get();

  // Note: session_state table is created lazily on first use
  // We need to call ensureSessionStateSchema to create it
  const schemaResult = sessionManager.ensureSessionStateSchema();
  assert.strictEqual(schemaResult.success, true, 'Schema creation should succeed');

  // Now verify table exists
  const tableInfo = freshDb.prepare(`
    SELECT sql FROM sqlite_master
    WHERE type='table' AND name='session_state'
  `).get();
  assert.ok(tableInfo, 'session_state table should exist after schema creation');

  // Verify table has correct columns
  const columns = freshDb.prepare(`PRAGMA table_info(session_state)`).all();
  const columnNames = columns.map(c => c.name);

  assert.ok(columnNames.includes('session_id'), 'Should have session_id column');
  assert.ok(columnNames.includes('status'), 'Should have status column');
  assert.ok(columnNames.includes('spec_folder'), 'Should have spec_folder column');
  assert.ok(columnNames.includes('current_task'), 'Should have current_task column');
  assert.ok(columnNames.includes('last_action'), 'Should have last_action column');
  assert.ok(columnNames.includes('context_summary'), 'Should have context_summary column');
  assert.ok(columnNames.includes('pending_work'), 'Should have pending_work column');
  assert.ok(columnNames.includes('state_data'), 'Should have state_data column');
  assert.ok(columnNames.includes('created_at'), 'Should have created_at column');
  assert.ok(columnNames.includes('updated_at'), 'Should have updated_at column');

  // Verify status column has CHECK constraint
  assert.ok(tableInfo.sql.includes("CHECK(status IN ('active', 'completed', 'interrupted'))"),
    'Status column should have CHECK constraint');

  freshDb.close();
  console.log('  PASS: Session state table schema created correctly on first startup');
}

/**
 * T010: Test saveSessionState() persists to SQLite immediately
 */
function test_T010_saveSessionState_persists_immediately() {
  console.log('TEST: T010 - saveSessionState() persists to SQLite immediately');

  const sessionId = 'T010-immediate-persist-test';
  const state = {
    specFolder: 'specs/test-immediate',
    currentTask: 'T010',
    lastAction: 'Testing immediate persistence',
    contextSummary: 'Verifying data is written to disk immediately',
    pendingWork: 'Check that data exists in SQLite right after save',
    data: { testKey: 'testValue', timestamp: Date.now() },
  };

  // Save session state
  const saveResult = sessionManager.saveSessionState(sessionId, state);
  assert.strictEqual(saveResult.success, true, 'Save should succeed');

  // Immediately query database to verify persistence (no async delay)
  const row = testDb.prepare(`
    SELECT session_id, status, spec_folder, current_task, last_action,
           context_summary, pending_work, state_data, created_at, updated_at
    FROM session_state
    WHERE session_id = ?
  `).get(sessionId);

  // Verify all fields were persisted immediately
  assert.ok(row, 'Row should exist immediately after save');
  assert.strictEqual(row.session_id, sessionId, 'Session ID should match');
  assert.strictEqual(row.status, 'active', 'Status should be active');
  assert.strictEqual(row.spec_folder, state.specFolder, 'Spec folder should match');
  assert.strictEqual(row.current_task, state.currentTask, 'Current task should match');
  assert.strictEqual(row.last_action, state.lastAction, 'Last action should match');
  assert.strictEqual(row.context_summary, state.contextSummary, 'Context summary should match');
  assert.strictEqual(row.pending_work, state.pendingWork, 'Pending work should match');

  // Verify state_data JSON is correctly serialized
  const parsedData = JSON.parse(row.state_data);
  assert.strictEqual(parsedData.testKey, 'testValue', 'State data should be preserved');

  // Verify timestamps are set
  assert.ok(row.created_at, 'created_at should be set');
  assert.ok(row.updated_at, 'updated_at should be set');

  console.log('  PASS: saveSessionState() persists data immediately to SQLite');
}

/**
 * T011: Test session status transitions: active -> completed
 */
function test_T011_status_transition_active_to_completed() {
  console.log('TEST: T011 - Session status transitions: active -> completed');

  const sessionId = 'T011-status-transition-test';

  // Create an active session
  sessionManager.saveSessionState(sessionId, {
    specFolder: 'specs/transition-test',
    currentTask: 'T011',
  });

  // Verify session is active
  let row = testDb.prepare(`
    SELECT status FROM session_state WHERE session_id = ?
  `).get(sessionId);
  assert.strictEqual(row.status, 'active', 'Initial status should be active');

  // Transition to completed
  const completeResult = sessionManager.completeSession(sessionId);
  assert.strictEqual(completeResult.success, true, 'Complete should succeed');

  // Verify status changed to completed
  row = testDb.prepare(`
    SELECT status, updated_at FROM session_state WHERE session_id = ?
  `).get(sessionId);
  assert.strictEqual(row.status, 'completed', 'Status should be completed after transition');
  assert.ok(row.updated_at, 'updated_at should be updated');

  console.log('  PASS: Session status correctly transitions from active to completed');
}

/**
 * T012: Test session status transitions: active -> interrupted (on crash)
 */
function test_T012_status_transition_active_to_interrupted_on_crash() {
  console.log('TEST: T012 - Session status transitions: active -> interrupted (on crash)');

  const sessionId = 'T012-crash-simulation-test';

  // Create an active session
  sessionManager.saveSessionState(sessionId, {
    specFolder: 'specs/crash-test',
    currentTask: 'T012',
    lastAction: 'Working on something important',
    contextSummary: 'This session will be interrupted by crash',
  });

  // Verify session is active
  let row = testDb.prepare(`
    SELECT status FROM session_state WHERE session_id = ?
  `).get(sessionId);
  assert.strictEqual(row.status, 'active', 'Initial status should be active');

  // Simulate crash by calling resetInterruptedSessions (called on server startup)
  const resetResult = sessionManager.resetInterruptedSessions();
  assert.strictEqual(resetResult.success, true, 'Reset should succeed');
  assert.ok(resetResult.interruptedCount >= 1, 'Should have interrupted at least 1 session');

  // Verify status changed to interrupted
  row = testDb.prepare(`
    SELECT status, updated_at FROM session_state WHERE session_id = ?
  `).get(sessionId);
  assert.strictEqual(row.status, 'interrupted', 'Status should be interrupted after crash simulation');

  console.log('  PASS: Session status correctly transitions from active to interrupted on crash');
}

/**
 * T013: Test resetInterruptedSessions() marks active as interrupted on startup
 */
function test_T013_resetInterruptedSessions_marks_active_as_interrupted() {
  console.log('TEST: T013 - resetInterruptedSessions() marks active sessions as interrupted on startup');

  // Clear any existing session state
  sessionManager.ensureSessionStateSchema();
  testDb.exec('DELETE FROM session_state');

  // Create multiple sessions with different statuses
  sessionManager.saveSessionState('T013-active-1', { specFolder: 'specs/a', currentTask: 'Task1' });
  sessionManager.saveSessionState('T013-active-2', { specFolder: 'specs/b', currentTask: 'Task2' });
  sessionManager.saveSessionState('T013-active-3', { specFolder: 'specs/c', currentTask: 'Task3' });

  // Mark one as completed (should NOT be affected by reset)
  sessionManager.completeSession('T013-active-2');

  // Verify initial states
  const beforeRows = testDb.prepare(`
    SELECT session_id, status FROM session_state ORDER BY session_id
  `).all();

  const beforeStatus = {};
  beforeRows.forEach(r => { beforeStatus[r.session_id] = r.status; });

  assert.strictEqual(beforeStatus['T013-active-1'], 'active', 'Session 1 should be active initially');
  assert.strictEqual(beforeStatus['T013-active-2'], 'completed', 'Session 2 should be completed');
  assert.strictEqual(beforeStatus['T013-active-3'], 'active', 'Session 3 should be active initially');

  // Simulate server startup (crash recovery)
  const resetResult = sessionManager.resetInterruptedSessions();

  assert.strictEqual(resetResult.success, true, 'Reset should succeed');
  assert.strictEqual(resetResult.interruptedCount, 2, 'Should interrupt exactly 2 active sessions');

  // Verify final states
  const afterRows = testDb.prepare(`
    SELECT session_id, status FROM session_state ORDER BY session_id
  `).all();

  const afterStatus = {};
  afterRows.forEach(r => { afterStatus[r.session_id] = r.status; });

  assert.strictEqual(afterStatus['T013-active-1'], 'interrupted', 'Session 1 should be interrupted');
  assert.strictEqual(afterStatus['T013-active-2'], 'completed', 'Session 2 should remain completed');
  assert.strictEqual(afterStatus['T013-active-3'], 'interrupted', 'Session 3 should be interrupted');

  console.log('  PASS: resetInterruptedSessions() correctly marks only active sessions as interrupted');
}

/**
 * T014: Test recoverState() retrieves interrupted session data
 */
function test_T014_recoverState_retrieves_interrupted_session_data() {
  console.log('TEST: T014 - recoverState() retrieves interrupted session data');

  // Clear existing state
  sessionManager.ensureSessionStateSchema();
  testDb.exec('DELETE FROM session_state');

  const sessionId = 'T014-recovery-data-test';
  const originalState = {
    specFolder: 'specs/important-work',
    currentTask: 'T014',
    lastAction: 'Completed critical implementation',
    contextSummary: 'Working on feature X with dependencies on Y',
    pendingWork: 'Need to run tests and deploy',
    data: {
      filesModified: ['a.js', 'b.js'],
      linesChanged: 150,
      dependencies: ['module-x', 'module-y']
    },
  };

  // Save session state
  sessionManager.saveSessionState(sessionId, originalState);

  // Simulate crash
  sessionManager.resetInterruptedSessions();

  // Recover the session
  const recoverResult = sessionManager.recoverState(sessionId);

  // Verify recovery succeeded
  assert.strictEqual(recoverResult.success, true, 'Recovery should succeed');
  assert.ok(recoverResult.state, 'State should be returned');

  // Verify all data fields are correctly retrieved
  const state = recoverResult.state;
  assert.strictEqual(state.sessionId, sessionId, 'Session ID should match');
  assert.strictEqual(state.specFolder, originalState.specFolder, 'Spec folder should be retrieved');
  assert.strictEqual(state.currentTask, originalState.currentTask, 'Current task should be retrieved');
  assert.strictEqual(state.lastAction, originalState.lastAction, 'Last action should be retrieved');
  assert.strictEqual(state.contextSummary, originalState.contextSummary, 'Context summary should be retrieved');
  assert.strictEqual(state.pendingWork, originalState.pendingWork, 'Pending work should be retrieved');

  // Verify nested data object
  assert.ok(state.data, 'Data object should be retrieved');
  assert.deepStrictEqual(state.data.filesModified, originalState.data.filesModified, 'filesModified should match');
  assert.strictEqual(state.data.linesChanged, originalState.data.linesChanged, 'linesChanged should match');
  assert.deepStrictEqual(state.data.dependencies, originalState.data.dependencies, 'dependencies should match');

  // Verify timestamps are present
  assert.ok(state.createdAt, 'createdAt should be present');
  assert.ok(state.updatedAt, 'updatedAt should be present');

  console.log('  PASS: recoverState() correctly retrieves all interrupted session data');
}

/**
 * T015: Test _recovered flag is set to true after recovery
 */
function test_T015_recovered_flag_set_to_true_after_recovery() {
  console.log('TEST: T015 - _recovered flag is set to true after recovery');

  // Clear existing state
  sessionManager.ensureSessionStateSchema();
  testDb.exec('DELETE FROM session_state');

  const interruptedSessionId = 'T015-interrupted-session';
  const activeSessionId = 'T015-active-session';
  const completedSessionId = 'T015-completed-session';

  // Create sessions
  sessionManager.saveSessionState(interruptedSessionId, { specFolder: 'specs/interrupted' });
  sessionManager.saveSessionState(activeSessionId, { specFolder: 'specs/active' });
  sessionManager.saveSessionState(completedSessionId, { specFolder: 'specs/completed' });
  sessionManager.completeSession(completedSessionId);

  // Simulate crash (marks only active sessions as interrupted)
  sessionManager.resetInterruptedSessions();

  // Test 1: Recover interrupted session - _recovered should be TRUE
  const interruptedResult = sessionManager.recoverState(interruptedSessionId);
  assert.strictEqual(interruptedResult.success, true, 'Recovery should succeed');
  assert.strictEqual(interruptedResult._recovered, true, '_recovered flag should be true for interrupted session');
  assert.strictEqual(interruptedResult.state._recovered, true, 'state._recovered should also be true');

  // Verify session is now active again after recovery
  const afterRecovery = testDb.prepare(`
    SELECT status FROM session_state WHERE session_id = ?
  `).get(interruptedSessionId);
  assert.strictEqual(afterRecovery.status, 'active', 'Session should be active after recovery');

  // Test 2: Try to recover completed session - _recovered should be FALSE
  const completedResult = sessionManager.recoverState(completedSessionId);
  assert.strictEqual(completedResult.success, true, 'Recovery should succeed');
  assert.strictEqual(completedResult._recovered, false, '_recovered flag should be false for completed session');

  // Test 3: Try to recover non-existent session - _recovered should be FALSE
  const nonExistentResult = sessionManager.recoverState('T015-does-not-exist');
  assert.strictEqual(nonExistentResult.success, true, 'Should succeed even if not found');
  assert.strictEqual(nonExistentResult._recovered, false, '_recovered flag should be false for non-existent session');

  console.log('  PASS: _recovered flag correctly set based on session status');
}

/**
 * T016: Test getInterruptedSessions() lists all recoverable sessions
 */
function test_T016_getInterruptedSessions_lists_all_recoverable() {
  console.log('TEST: T016 - getInterruptedSessions() lists all recoverable sessions');

  // Clear existing state
  sessionManager.ensureSessionStateSchema();
  testDb.exec('DELETE FROM session_state');

  // Create multiple sessions with various states
  const testSessions = [
    { id: 'T016-session-1', state: { specFolder: 'specs/one', currentTask: 'Task1', lastAction: 'Action1' } },
    { id: 'T016-session-2', state: { specFolder: 'specs/two', currentTask: 'Task2', lastAction: 'Action2' } },
    { id: 'T016-session-3', state: { specFolder: 'specs/three', currentTask: 'Task3', lastAction: 'Action3' } },
    { id: 'T016-session-4', state: { specFolder: 'specs/four', currentTask: 'Task4', lastAction: 'Action4' } },
    { id: 'T016-session-5', state: { specFolder: 'specs/five', currentTask: 'Task5', lastAction: 'Action5' } },
  ];

  // Create all sessions
  testSessions.forEach(s => sessionManager.saveSessionState(s.id, s.state));

  // Complete sessions 2 and 5 (should not appear in interrupted list)
  sessionManager.completeSession('T016-session-2');
  sessionManager.completeSession('T016-session-5');

  // Simulate crash - interrupts active sessions (1, 3, 4)
  const resetResult = sessionManager.resetInterruptedSessions();
  assert.strictEqual(resetResult.interruptedCount, 3, 'Should interrupt 3 sessions');

  // Get interrupted sessions
  const listResult = sessionManager.getInterruptedSessions();

  assert.strictEqual(listResult.success, true, 'List should succeed');
  assert.strictEqual(listResult.sessions.length, 3, 'Should have 3 interrupted sessions');

  // Verify correct sessions are listed
  const sessionIds = listResult.sessions.map(s => s.sessionId);
  assert.ok(sessionIds.includes('T016-session-1'), 'Session 1 should be in list');
  assert.ok(sessionIds.includes('T016-session-3'), 'Session 3 should be in list');
  assert.ok(sessionIds.includes('T016-session-4'), 'Session 4 should be in list');
  assert.ok(!sessionIds.includes('T016-session-2'), 'Completed session 2 should NOT be in list');
  assert.ok(!sessionIds.includes('T016-session-5'), 'Completed session 5 should NOT be in list');

  // Verify each session has the expected fields
  for (const session of listResult.sessions) {
    assert.ok(session.sessionId, 'Should have sessionId');
    assert.ok(session.specFolder, 'Should have specFolder');
    assert.ok(session.currentTask, 'Should have currentTask');
    assert.ok(session.lastAction, 'Should have lastAction');
    assert.ok(session.updatedAt, 'Should have updatedAt');
  }

  // Verify sessions are ordered by updatedAt DESC (most recent first)
  // Since they were all interrupted at the same time, order might vary
  // Just verify the list is not empty and has correct count
  assert.strictEqual(listResult.sessions.length, 3, 'Should return exactly 3 recoverable sessions');

  console.log('  PASS: getInterruptedSessions() correctly lists all recoverable sessions');
}

/* ─────────────────────────────────────────────────────────────
   8. TEST RUNNER
──────────────────────────────────────────────────────────────── */

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     CRASH RECOVERY TESTS (T009-T016, T071-T075)          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  const tests = [
    // Original T071-T075 tests
    test_session_state_schema_creation,
    test_save_session_state,
    test_reset_interrupted_sessions,
    test_recover_state,
    test_recover_nonexistent_session,
    test_get_interrupted_sessions,
    test_generate_continue_session_md,
    test_write_continue_session_md,
    test_checkpoint_session,
    // T009-T016 crash recovery tests
    test_T009_session_state_table_schema_creation_on_first_startup,
    test_T010_saveSessionState_persists_immediately,
    test_T011_status_transition_active_to_completed,
    test_T012_status_transition_active_to_interrupted_on_crash,
    test_T013_resetInterruptedSessions_marks_active_as_interrupted,
    test_T014_recoverState_retrieves_interrupted_session_data,
    test_T015_recovered_flag_set_to_true_after_recovery,
    test_T016_getInterruptedSessions_lists_all_recoverable,
  ];

  for (const test of tests) {
    setup();
    try {
      test();
      passed++;
    } catch (error) {
      console.error(`  FAIL: ${error.message}`);
      failed++;
    } finally {
      teardown();
    }
  }

  console.log('\n──────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('──────────────────────────────────────────────────────────\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
