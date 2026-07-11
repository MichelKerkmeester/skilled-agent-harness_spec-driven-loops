// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review Reducer Summary Fallback Test                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { reduceReviewState } = require('../reduce-state.cjs');

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

testSummaryOnlyFallback();
testStructuredRowsDoNotDoubleCount();
testTraceabilityRollupUnionsLatestPerProtocol();
testSearchDebtReconciliationClearsResolvedBugClass();
console.log('[deep-review] reduce-state summary fallback regression passed');
