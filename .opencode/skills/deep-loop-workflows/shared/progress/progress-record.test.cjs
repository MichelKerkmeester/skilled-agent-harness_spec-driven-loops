// Tests for the progress_record type and reducer allowlist safety rule.
//
// (a) A reducer fed ONLY progress lines returns null/zero for completion math.
// (b) A zero-progress_delta started/completed pair is rejected by the validator.
// (c) A real step-transition pair with positive delta is accepted.

'use strict';

const assert = require('node:assert/strict');

const {
  PROGRESS_RECORD_TYPE,
  PROGRESS_RECORD_EVENT,
  COMPLETION_BEARING_TYPES,
  PROGRESS_THRESHOLD_SECONDS,
  isProgressRecord,
  filterCompletionBearingRecords,
  hasWorkAnchor,
  validateProgressRecordPair,
} = require('./progress-record.cjs');

const { buildTerminalStopState, deriveDashboardStatus: deriveResearchStatus } =
  require('../../deep-research/scripts/reduce-state.cjs');
const { deriveDashboardStatus: deriveReviewStatus, parseJsonlDetailed } =
  require('../../deep-review/scripts/reduce-state.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

function progressStarted(overrides = {}) {
  return {
    schema_version: '1.3',
    protocol: 'deep-loop',
    type: 'progress',
    event: 'progress_record',
    mode: 'context',
    run: 'iter-001',
    phase: 'step_parallel_sweep',
    step: 'step_sweep_cli_pool',
    unit_id: 'iter-001/opencode',
    status: 'started',
    timestamp: '2026-07-03T09:00:00.000Z',
    ...overrides,
  };
}

function progressCompleted(overrides = {}) {
  return {
    schema_version: '1.3',
    protocol: 'deep-loop',
    type: 'progress',
    event: 'progress_record',
    mode: 'context',
    run: 'iter-001',
    phase: 'step_parallel_sweep',
    step: 'step_sweep_cli_pool',
    unit_id: 'iter-001/opencode',
    status: 'completed',
    timestamp: '2026-07-03T09:00:45.000Z',
    progress_delta: 5,
    artifact_path: 'context/seats/iter-001/opencode.json',
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// (a) Reducer fed ONLY progress lines returns null/zero for completion math
// ─────────────────────────────────────────────────────────────────────────────

function testFilterDropsAllProgressRecords() {
  const progressLines = [
    progressStarted(),
    progressCompleted(),
    progressStarted({ unit_id: 'iter-001/claude-code' }),
    progressCompleted({ unit_id: 'iter-001/claude-code', progress_delta: 3 }),
  ];
  const jsonl = progressLines.map((r) => JSON.stringify(r)).join('\n');
  const { records } = parseJsonlDetailed(jsonl);

  assert.equal(records.length, 4, 'parsed 4 records');

  const filtered = filterCompletionBearingRecords(records);
  assert.equal(filtered.length, 0, 'all progress records dropped by allowlist');

  const iterationCount = filtered.filter((r) => r.type === 'iteration').length;
  const eventCount = filtered.filter((r) => r.type === 'event').length;
  assert.equal(iterationCount, 0, 'zero iteration records after allowlist');
  assert.equal(eventCount, 0, 'zero event records after allowlist');
}

function testResearchTerminalStopNullForProgressOnly() {
  const records = [progressStarted(), progressCompleted()];
  const stop = buildTerminalStopState(records);
  assert.equal(stop, null, 'no terminal stop from progress-only records');
}

function testResearchStatusNotCompleteForProgressOnly() {
  const records = []; // no iteration records
  const events = [];  // no event records (progress already filtered out upstream)
  const config = { status: 'running' };
  const status = deriveResearchStatus(config, records, events, null);
  assert.notEqual(status, 'COMPLETE', 'progress-only state is not COMPLETE');
}

function testReviewStatusNotCompleteForProgressOnly() {
  const records = filterCompletionBearingRecords([progressStarted(), progressCompleted()]);
  const config = { status: 'running' };
  const status = deriveReviewStatus(config, records, null);
  assert.notEqual(status, 'COMPLETE', 'progress-only state is not COMPLETE');
}

function testProgressDoesNotInflateIterationCount() {
  // A mix of real iteration records and progress records — progress must not
  // inflate the iteration count.
  const records = [
    { type: 'iteration', mode: 'review', run: 1, status: 'complete', focus: 'correctness', timestamp: '2026-07-03T09:00:00.000Z' },
    progressStarted(),
    progressCompleted(),
    { type: 'iteration', mode: 'review', run: 2, status: 'complete', focus: 'security', timestamp: '2026-07-03T09:02:00.000Z' },
    progressStarted({ unit_id: 'iter-002/seat-a' }),
    progressCompleted({ unit_id: 'iter-002/seat-a', progress_delta: 1 }),
  ];
  const filtered = filterCompletionBearingRecords(records);
  const iterationCount = filtered.filter((r) => r.type === 'iteration').length;
  assert.equal(iterationCount, 2, 'exactly 2 iterations — progress records excluded');
}

// ─────────────────────────────────────────────────────────────────────────────
// (b) Zero-delta no-op pair is rejected
// ─────────────────────────────────────────────────────────────────────────────

function testZeroDeltaPairRejected() {
  const started = progressStarted();
  const completed = progressCompleted({ progress_delta: 0, artifact_path: undefined });
  delete completed.artifact_path;
  const result = validateProgressRecordPair(started, completed);
  assert.equal(result.valid, false, 'zero-delta no-op pair rejected');
  assert.ok(result.reason.includes('zero-delta'), `reason mentions zero-delta: ${result.reason}`);
}

function testMissingDeltaPairRejected() {
  const started = progressStarted();
  const completed = progressCompleted();
  delete completed.progress_delta;
  delete completed.artifact_path;
  const result = validateProgressRecordPair(started, completed);
  assert.equal(result.valid, false, 'missing-delta no-op pair rejected');
}

function testHasWorkAnchorFalseForZero() {
  assert.equal(hasWorkAnchor({ progress_delta: 0 }), false, 'zero delta has no work anchor');
  assert.equal(hasWorkAnchor({}), false, 'empty record has no work anchor');
  assert.equal(hasWorkAnchor({ progress_delta: 0, artifact_path: '' }), false, 'empty path has no work anchor');
}

// ─────────────────────────────────────────────────────────────────────────────
// (c) Real step-transition pair with positive delta is accepted
// ─────────────────────────────────────────────────────────────────────────────

function testPositiveDeltaPairAccepted() {
  const started = progressStarted();
  const completed = progressCompleted({ progress_delta: 5 });
  const result = validateProgressRecordPair(started, completed);
  assert.equal(result.valid, true, 'positive-delta pair accepted');
}

function testArtifactPathPairAccepted() {
  const started = progressStarted();
  const completed = progressCompleted();
  delete completed.progress_delta;
  const result = validateProgressRecordPair(started, completed);
  assert.equal(result.valid, true, 'artifact-path-only pair accepted');
}

function testHasWorkAnchorTrue() {
  assert.equal(hasWorkAnchor({ progress_delta: 1 }), true, 'positive delta has work anchor');
  assert.equal(hasWorkAnchor({ progress_delta: 0.5 }), true, 'fractional delta has work anchor');
  assert.equal(hasWorkAnchor({ artifact_path: 'seats/iter-001/opencode.json' }), true, 'artifact path has work anchor');
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants sanity
// ─────────────────────────────────────────────────────────────────────────────

function testConstants() {
  assert.equal(PROGRESS_RECORD_TYPE, 'progress');
  assert.equal(PROGRESS_RECORD_EVENT, 'progress_record');
  assert.ok(COMPLETION_BEARING_TYPES.has('iteration'), 'allowlist includes iteration');
  assert.ok(COMPLETION_BEARING_TYPES.has('event'), 'allowlist includes event');
  assert.ok(!COMPLETION_BEARING_TYPES.has('progress'), 'allowlist excludes progress');
  assert.equal(PROGRESS_THRESHOLD_SECONDS, 60, 'T = half the 120s watchdog window');
}

function testIsProgressRecord() {
  assert.ok(isProgressRecord({ type: 'progress', event: 'progress_record' }), 'type+event match');
  assert.ok(isProgressRecord({ type: 'progress' }), 'type-only match');
  assert.ok(isProgressRecord({ event: 'progress_record' }), 'event-only match');
  assert.ok(!isProgressRecord({ type: 'iteration' }), 'iteration is not progress');
  assert.ok(!isProgressRecord(null), 'null is not progress');
  assert.ok(!isProgressRecord({}), 'empty object is not progress');
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

const tests = [
  ['filter drops all progress records', testFilterDropsAllProgressRecords],
  ['research terminal stop null for progress-only', testResearchTerminalStopNullForProgressOnly],
  ['research status not COMPLETE for progress-only', testResearchStatusNotCompleteForProgressOnly],
  ['review status not COMPLETE for progress-only', testReviewStatusNotCompleteForProgressOnly],
  ['progress does not inflate iteration count', testProgressDoesNotInflateIterationCount],
  ['zero-delta pair rejected', testZeroDeltaPairRejected],
  ['missing-delta pair rejected', testMissingDeltaPairRejected],
  ['hasWorkAnchor false for zero', testHasWorkAnchorFalseForZero],
  ['positive-delta pair accepted', testPositiveDeltaPairAccepted],
  ['artifact-path pair accepted', testArtifactPathPairAccepted],
  ['hasWorkAnchor true', testHasWorkAnchorTrue],
  ['constants sanity', testConstants],
  ['isProgressRecord predicate', testIsProgressRecord],
];

let passed = 0;
for (const [name, fn] of tests) {
  fn();
  passed += 1;
}

process.stdout.write(`[progress-record] ${passed}/${tests.length} assertions passed\n`);
