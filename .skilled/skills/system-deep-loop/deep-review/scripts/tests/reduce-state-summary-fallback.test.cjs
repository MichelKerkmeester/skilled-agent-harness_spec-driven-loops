// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review Reducer Summary Fallback Test                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { reduceReviewState } = require('../../../runtime/scripts/reduce-state.cjs');

function makeSpecFolder(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `review-summary-fallback-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'summary-fallback');
  const reviewDir = path.join(specFolder, 'review');
  fs.mkdirSync(path.join(reviewDir, 'iterations'), { recursive: true });
  fs.mkdirSync(path.join(reviewDir, 'deltas'), { recursive: true });
  return { root, specFolder, reviewDir };
}

function writeBaseConfig(reviewDir) {
  fs.writeFileSync(
    path.join(reviewDir, 'deep-review-config.json'),
    `${JSON.stringify({
      topic: 'summary fallback regression',
      mode: 'review',
      reviewTarget: 'summary fallback fixture',
      reviewTargetType: 'spec-folder',
      reviewDimensions: ['correctness', 'security', 'traceability', 'maintainability'],
      sessionId: 'rvw-summary-fallback',
      generation: 1,
      lineageMode: 'new',
      maxIterations: 3,
      convergenceThreshold: 0.1,
      status: 'running',
      createdAt: '2026-06-29T00:00:00Z',
    }, null, 2)}\n`,
    'utf8',
  );
}

function iterationRecord(overrides = {}) {
  return {
    type: 'iteration',
    mode: 'review',
    run: 1,
    status: 'complete',
    focus: 'correctness summary-only review',
    dimensions: ['correctness'],
    filesReviewed: ['src/reducer.ts'],
    findingsCount: 3,
    findingsSummary: { P0: 1, P1: 1, P2: 1 },
    findingsNew: { P0: 1, P1: 1, P2: 1 },
    newFindingsRatio: 1,
    sessionId: 'rvw-summary-fallback',
    generation: 1,
    lineageMode: 'new',
    timestamp: '2026-06-29T00:01:00Z',
    durationMs: 1000,
    ...overrides,
  };
}

function writeJsonl(filePath, records) {
  fs.writeFileSync(
    filePath,
    `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
    'utf8',
  );
}

function runFixture(slug, deltaRecords) {
  const { root, specFolder, reviewDir } = makeSpecFolder(slug);
  try {
    writeBaseConfig(reviewDir);
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: 'rvw-summary-fallback' },
      iterationRecord(),
    ]);
    writeJsonl(path.join(reviewDir, 'deltas', 'iter-001.jsonl'), deltaRecords);
    return reduceReviewState(specFolder, { write: false }).registry;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function runIterationRecordsFixture(slug, iterationRecords) {
  const { root, specFolder, reviewDir } = makeSpecFolder(slug);
  try {
    writeBaseConfig(reviewDir);
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: 'rvw-summary-fallback' },
      ...iterationRecords,
    ]);
    return reduceReviewState(specFolder, { write: false }).registry;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function runSplitIterationFixture(slug, stateRecords, deltaRecords) {
  const { root, specFolder, reviewDir } = makeSpecFolder(slug);
  try {
    writeBaseConfig(reviewDir);
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: 'rvw-summary-fallback' },
      ...stateRecords,
    ]);
    writeJsonl(path.join(reviewDir, 'deltas', 'iter-002.jsonl'), deltaRecords);
    return reduceReviewState(specFolder, { write: false }).registry;
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function testSummaryOnlyFallback() {
  const registry = runFixture('summary-only', [iterationRecord()]);

  assert.deepEqual(registry.findingsBySeverity, { P0: 1, P1: 1, P2: 1 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 3);
}

function testStructuredRowsDoNotDoubleCount() {
  const registry = runFixture('structured-rows', [
    iterationRecord(),
    {
      type: 'finding',
      id: 'F001',
      iteration: 1,
      severity: 'P0',
      title: 'Structured blocker',
      file: 'src/reducer.ts:10',
      findingClass: 'correctness',
      claim: 'The structured row already represents the iteration summary.',
      status: 'active',
    },
    {
      type: 'finding',
      id: 'F002',
      iteration: 1,
      severity: 'P1',
      title: 'Structured required finding',
      file: 'src/reducer.ts:20',
      findingClass: 'correctness',
      claim: 'The structured row already represents the iteration summary.',
      status: 'active',
    },
    {
      type: 'finding',
      id: 'F003',
      iteration: 1,
      severity: 'P2',
      title: 'Structured advisory finding',
      file: 'src/reducer.ts:30',
      findingClass: 'correctness',
      claim: 'The structured row already represents the iteration summary.',
      status: 'active',
    },
  ]);

  assert.deepEqual(registry.findingsBySeverity, { P0: 1, P1: 1, P2: 1 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 0);
}

function testTraceabilityRollupUnionsLatestPerProtocol() {
  const registry = runIterationRecordsFixture('traceability-union', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      traceabilityChecks: {
        results: [
          { protocolId: 'checklist_evidence', status: 'fail', applicable: true, gateClass: 'hard' },
        ],
      },
    }),
    iterationRecord({
      run: 2,
      timestamp: '2026-06-29T00:02:00Z',
      // Iteration 2 only re-executes a different protocol; it must not erase
      // iteration 1's checklist_evidence result from canonical state.
      traceabilityChecks: {
        results: [
          { protocolId: 'other_protocol', status: 'pass', applicable: true, gateClass: 'soft' },
        ],
      },
    }),
  ]);

  const protocolIds = registry.traceability.results.map((result) => result.protocolId).sort();
  assert.deepEqual(protocolIds, ['checklist_evidence', 'other_protocol']);

  const checklistResult = registry.traceability.results.find((result) => result.protocolId === 'checklist_evidence');
  assert.equal(checklistResult.status, 'fail');
  assert.equal(registry.traceability.summary.fail, 1);
  assert.equal(registry.traceability.summary.pass, 1);
  assert.equal(registry.traceability.summary.gatingFailures, 1);
}

function testSearchDebtReconciliationClearsResolvedBugClass() {
  const registry = runIterationRecordsFixture('search-debt-reconciliation', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      reviewDepthSchemaVersion: 2,
      searchLedger: [
        {
          id: 'row-sql-1',
          dimension: 'security',
          bugClass: 'sql-injection',
          disposition: 'deferred',
          targetRefs: ['src/db.ts'],
          rationale: 'needs schema access',
          deferredReason: 'blocked on schema access',
        },
        {
          id: 'row-xss-1',
          dimension: 'security',
          bugClass: 'xss',
          disposition: 'blocked',
          targetRefs: ['src/render.ts'],
          rationale: 'blocked on external review',
          blockedReason: 'awaiting security team',
        },
      ],
    }),
    iterationRecord({
      run: 2,
      timestamp: '2026-06-29T00:02:00Z',
      reviewDepthSchemaVersion: 2,
      searchLedger: [
        {
          id: 'row-sql-2',
          dimension: 'security',
          bugClass: 'sql-injection',
          disposition: 'covered',
          targetRefs: ['src/db.ts'],
          rationale: 'executed parametrized-query check',
        },
      ],
    }),
  ]);

  // The later 'covered' disposition must clear the earlier 'deferred' debt for
  // the same bug class instead of leaving a stale duplicate entry.
  assert.equal(registry.searchDebt.length, 1);
  assert.equal(registry.searchDebt[0].bugClass, 'xss');
  assert.equal(registry.candidateCoverage.byBugClass['sql-injection'].deferred, false);
  assert.ok(registry.candidateCoverage.covered.includes('sql-injection'));
  assert.ok(!registry.candidateCoverage.deferred.includes('sql-injection'));
  assert.deepEqual(registry.candidateCoverage.blocked, ['xss']);
}

function testMalformedDeltaFailsClosed() {
  const { root, specFolder, reviewDir } = makeSpecFolder('malformed-delta');
  try {
    writeBaseConfig(reviewDir);
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: 'rvw-summary-fallback' },
      iterationRecord(),
    ]);
    fs.writeFileSync(path.join(reviewDir, 'deltas', 'iter-001.jsonl'), `${JSON.stringify(iterationRecord())}\nnot-json\n`, 'utf8');
    assert.throws(
      () => reduceReviewState(specFolder, { write: false }),
      (error) => error && error.code === 'STATE_CORRUPTION',
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function testInvalidReducerFlagsFailAsInputValidation() {
  const { root, specFolder, reviewDir } = makeSpecFolder('invalid-flags');
  try {
    writeBaseConfig(reviewDir);
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: 'rvw-summary-fallback' },
      iterationRecord(),
    ]);
    writeJsonl(path.join(reviewDir, 'deltas', 'iter-001.jsonl'), [iterationRecord()]);
    const script = path.join(__dirname, '../../../runtime/scripts/reduce-state.cjs');
    const unknownFlag = spawnSync(process.execPath, [script, specFolder, '--misspelled-flag', 'value'], { encoding: 'utf8' });
    const missingValue = spawnSync(process.execPath, [script, specFolder, '--artifact-dir'], { encoding: 'utf8' });
    assert.equal(unknownFlag.status, 3);
    assert.equal(missingValue.status, 3);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function testDeltaFindingKeyedByFindingIdLands() {
  const registry = runFixture('finding-id-alias', [
    iterationRecord(),
    {
      type: 'finding',
      findingId: 'F009',
      iteration: 1,
      severity: 'P2',
      title: 'Delta row keyed by findingId',
      file: 'src/reducer.ts:40',
      findingClass: 'correctness',
      claim: 'The row is structured even though its id field is named findingId.',
      status: 'active',
    },
  ]);

  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 1 });
  assert.equal(registry.openFindingsCount, 1);
  assert.equal(registry.openFindings[0].findingId, 'F009');
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 0);
}

function testCumulativeSummaryCountsFindingsActiveByRun() {
  const registry = runIterationRecordsFixture('cumulative-summary', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      findingsCount: 2,
      findingsSummary: { P0: 0, P1: 0, P2: 2 },
      findingDetails: [
        { id: 'A1', severity: 'P2', title: 'Carried finding one', file: 'src/one.ts:10', findingClass: 'correctness' },
        { id: 'A2', severity: 'P2', title: 'Carried finding two', file: 'src/two.ts:20', findingClass: 'correctness' },
      ],
    }),
    iterationRecord({
      run: 2,
      timestamp: '2026-06-29T00:02:00Z',
      findingsCount: 3,
      findingsSummary: { P0: 0, P1: 0, P2: 3 },
      findingDetails: [
        { id: 'B1', severity: 'P2', title: 'Finding added in run two', file: 'src/three.ts:30', findingClass: 'correctness' },
      ],
    }),
  ]);

  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 3 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 0);
}

function testCumulativeSummaryExcludesResolvedFindings() {
  const registry = runIterationRecordsFixture('cumulative-resolved', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      findingsCount: 2,
      findingsSummary: { P0: 0, P1: 0, P2: 2 },
      findingDetails: [
        { id: 'A1', severity: 'P2', title: 'Finding closed in run two', file: 'src/one.ts:10', findingClass: 'correctness' },
        { id: 'A2', severity: 'P2', title: 'Finding still open', file: 'src/two.ts:20', findingClass: 'correctness' },
      ],
    }),
    iterationRecord({
      run: 2,
      timestamp: '2026-06-29T00:02:00Z',
      findingsCount: 3,
      findingsSummary: { P0: 0, P1: 0, P2: 3 },
      resolvedFindings: ['A1'],
      findingDetails: [
        { id: 'B1', severity: 'P2', title: 'Finding added in run two', file: 'src/three.ts:30', findingClass: 'correctness' },
      ],
    }),
  ]);

  // A2 and B1 are the only represented findings: the resolved A1 does not count
  // toward the cumulative total, so the third slot still needs one summary row.
  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 3 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 1);
}

function testDeltaOnlyIterationRecordResolvesForCumulativePadding() {
  const registry = runSplitIterationFixture('delta-resolved-padding', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      findingsCount: 2,
      findingsSummary: { P0: 0, P1: 0, P2: 2 },
      findingDetails: [
        { id: 'A1', severity: 'P2', title: 'Finding closed in run two', file: 'src/one.ts:10', findingClass: 'correctness' },
        { id: 'A2', severity: 'P2', title: 'Finding still open', file: 'src/two.ts:20', findingClass: 'correctness' },
      ],
    }),
  ], [
    iterationRecord({
      run: 2,
      timestamp: '2026-06-29T00:02:00Z',
      findingsCount: 3,
      findingsSummary: { P0: 0, P1: 0, P2: 3 },
      resolvedFindings: ['A1'],
      findingDetails: [
        { id: 'B1', severity: 'P2', title: 'Finding added in run two', file: 'src/three.ts:30', findingClass: 'correctness' },
      ],
    }),
  ]);

  // Run two's record exists only in the delta file; its resolvedFindings still
  // closes A1, so the cumulative count of three is A2, B1, and one padded row.
  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 3 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 1);
  assert.equal(registry.resolvedFindings.length, 1);
  assert.equal(registry.resolvedFindings[0].findingId, 'A1');
}

function testSummaryWithoutFindingsCountPadsPerRun() {
  const registry = runIterationRecordsFixture('per-run-no-count', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      findingsCount: undefined,
      findingsSummary: { P0: 0, P1: 0, P2: 3 },
      findingDetails: [
        { id: 'C1', severity: 'P2', title: 'Only reported finding', file: 'src/one.ts:10', findingClass: 'correctness' },
      ],
    }),
  ]);

  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 3 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 2);
}

function testSummaryDivergingFromFindingsCountPadsPerRun() {
  const registry = runIterationRecordsFixture('per-run-diverging-count', [
    iterationRecord({
      run: 1,
      timestamp: '2026-06-29T00:01:00Z',
      findingsCount: 5,
      findingsSummary: { P0: 0, P1: 0, P2: 3 },
      findingDetails: [
        { id: 'C1', severity: 'P2', title: 'Only reported finding', file: 'src/one.ts:10', findingClass: 'correctness' },
      ],
    }),
  ]);

  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 3 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 2);
}

function testDeltaFindingPrefersIdOverFindingId() {
  const registry = runFixture('id-over-finding-id', [
    iterationRecord(),
    {
      type: 'finding',
      id: 'A1',
      findingId: 'B9',
      iteration: 1,
      severity: 'P2',
      title: 'Delta row carrying both id spellings',
      file: 'src/reducer.ts:50',
      findingClass: 'correctness',
      claim: 'The producer may emit both keys; id names the canonical finding.',
      status: 'active',
    },
  ]);

  // The alias must not double-register: one finding keyed by id, and the
  // findingId spelling leaves no entry of its own.
  const allFindings = registry.openFindings.concat(registry.resolvedFindings);
  assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 0, P2: 1 });
  assert.equal(registry.openFindingsCount, 1);
  assert.equal(registry.openFindings[0].findingId, 'A1');
  assert.ok(!allFindings.some((finding) => finding.findingId === 'B9'
    || (finding.mergedFindingIds || []).includes('B9')));
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 0);
}

function testDeltaFindingWithEmptyFindingIdIsSkipped() {
  const registry = runFixture('empty-finding-id', [
    iterationRecord(),
    {
      type: 'finding',
      findingId: '',
      iteration: 1,
      severity: 'P2',
      title: 'Delta row with a blank findingId',
      file: 'src/reducer.ts:60',
      findingClass: 'correctness',
      claim: 'A blank id cannot name a registry finding.',
      status: 'active',
    },
  ]);

  // The blank id drops the structured row, so the run falls back to its
  // summary exactly as it does when no finding rows exist at all.
  assert.deepEqual(registry.findingsBySeverity, { P0: 1, P1: 1, P2: 1 });
  assert.equal(registry.openFindingsCount, 3);
  assert.equal(registry.openFindings.filter((finding) => finding.findingClass === 'summary-only').length, 3);
  assert.ok(registry.openFindings.every((finding) => typeof finding.findingId === 'string' && finding.findingId.length > 0));
}

testSummaryOnlyFallback();
testStructuredRowsDoNotDoubleCount();
testTraceabilityRollupUnionsLatestPerProtocol();
testSearchDebtReconciliationClearsResolvedBugClass();
testMalformedDeltaFailsClosed();
testInvalidReducerFlagsFailAsInputValidation();
testDeltaFindingKeyedByFindingIdLands();
testCumulativeSummaryCountsFindingsActiveByRun();
testCumulativeSummaryExcludesResolvedFindings();
testDeltaOnlyIterationRecordResolvesForCumulativePadding();
testSummaryWithoutFindingsCountPadsPerRun();
testSummaryDivergingFromFindingsCountPadsPerRun();
testDeltaFindingPrefersIdOverFindingId();
testDeltaFindingWithEmptyFindingIdIsSkipped();
console.log('[deep-review] reduce-state summary fallback regression passed');
