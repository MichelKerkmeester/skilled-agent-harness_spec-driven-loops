// Deep Review Reducer Traceability And Refines Test
//
// Three regression cases:
//   1. A traceability-only iteration renders no BLOCKED dead ends, while an
//      explicit Dead Ends entry still renders one.
//   2. A structured row that names the finding it refines folds into that
//      finding instead of adding a second open entry.
//   3. An id reuse without a refines link still keeps both findings.

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const {
  parseIterationFile,
  reduceReviewState,
} = require('../../../runtime/scripts/reduce-state.cjs');

const SESSION_ID = 'rvw-reducer-fixture';

function makeReviewFixture(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `review-reducer-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'reducer-fixture');
  const reviewDir = path.join(specFolder, 'review');
  const iterationDir = path.join(reviewDir, 'iterations');
  fs.mkdirSync(iterationDir, { recursive: true });
  fs.mkdirSync(path.join(reviewDir, 'deltas'), { recursive: true });
  fs.writeFileSync(
    path.join(reviewDir, 'deep-review-config.json'),
    `${JSON.stringify({
      topic: 'reducer traceability and refines',
      mode: 'review',
      reviewTarget: 'reducer fixture',
      reviewTargetType: 'spec-folder',
      reviewDimensions: ['correctness'],
      sessionId: SESSION_ID,
      generation: 1,
      lineageMode: 'new',
      maxIterations: 4,
      convergenceThreshold: 0.1,
      status: 'running',
      createdAt: '2026-11-14T12:00:00Z',
    }, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(reviewDir, 'deep-review-strategy.md'),
    '# Deep Review Strategy: reducer fixture\n',
    'utf8',
  );
  return { root, specFolder, reviewDir, iterationDir };
}

function iterationRecord(run, overrides = {}) {
  return {
    type: 'iteration',
    iteration: run,
    mode: 'review',
    run,
    status: 'complete',
    focus: 'correctness review',
    dimensions: ['correctness'],
    filesReviewed: ['src/reducer.ts'],
    findingsCount: 1,
    findingsSummary: { P0: 0, P1: 0, P2: 1 },
    findingsNew: [],
    newFindingsRatio: 0.5,
    sessionId: SESSION_ID,
    generation: 1,
    lineageMode: 'new',
    timestamp: `2026-11-14T12:0${run}:00Z`,
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

function detailRow(id, title, claim, extra = {}) {
  return {
    id,
    severity: 'P2',
    title,
    file: 'src/reducer.ts:10',
    findingClass: 'correctness',
    claim,
    ...extra,
  };
}

function reduceFixture(slug, build) {
  const fixture = makeReviewFixture(slug);
  try {
    build(fixture);
    return reduceReviewState(fixture.specFolder, {
      write: false,
      createMissingAnchors: true,
    });
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
}

function testTraceabilityChecksDoNotBecomeBlockedDeadEnds() {
  let traceabilityOnly = null;
  let explicitDeadEnds = null;
  const result = reduceFixture('traceability-only', ({ reviewDir, iterationDir }) => {
    fs.writeFileSync(
      path.join(iterationDir, 'iteration-001.md'),
      [
        '# Iteration 1: correctness review',
        '',
        '## Files Reviewed',
        '- src/reducer.ts',
        '',
        '## Findings - New',
        '',
        '### P2 Findings',
        '- none',
        '',
        '## Traceability Checks',
        '- checklist_evidence: deferred',
        '- feature_catalog_code: partial',
        '- agent_cross_runtime: deferred',
        '- playbook_capability: partial',
        '',
      ].join('\n'),
      'utf8',
    );
    fs.writeFileSync(
      path.join(iterationDir, 'iteration-002.md'),
      [
        '# Iteration 2: correctness review',
        '',
        '## Files Reviewed',
        '- src/reducer.ts',
        '',
        '## Dead Ends',
        '- keyword scan for unsafe casts',
        '',
      ].join('\n'),
      'utf8',
    );
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: SESSION_ID },
      iterationRecord(1),
      iterationRecord(2),
    ]);
    traceabilityOnly = parseIterationFile(path.join(iterationDir, 'iteration-001.md'));
    explicitDeadEnds = parseIterationFile(path.join(iterationDir, 'iteration-002.md'));
  });

  assert.deepEqual(traceabilityOnly.deadEnds, []);
  assert.deepEqual(explicitDeadEnds.deadEnds, ['keyword scan for unsafe casts']);

  const blockedTraceability = result.strategy
    .split('\n')
    .filter((line) => /^### .*(checklist_evidence|feature_catalog_code|agent_cross_runtime|playbook_capability).*BLOCKED/.test(line));
  assert.deepEqual(blockedTraceability, []);

  assert.match(result.strategy, /^### keyword scan for unsafe casts -- BLOCKED/m);
}

function testRefinesRowFoldsIntoItsTarget() {
  const result = reduceFixture('refines-fold', ({ reviewDir }) => {
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: SESSION_ID },
      iterationRecord(1, {
        findingDetails: [
          detailRow('R1-P2-001', 'Original advisory title', 'Original claim about the wrapper.'),
        ],
      }),
      iterationRecord(2, {
        findingDetails: [
          detailRow(
            'R1-P2-001',
            'Refined advisory title',
            'Refined claim about the wrapper.',
            { refinementOf: 'R1-P2-001' },
          ),
        ],
      }),
    ]);
  });

  const registry = result.registry;
  assert.equal(registry.openFindingsCount, 1);
  const folded = registry.openFindings[0];
  assert.equal(folded.findingId, 'R1-P2-001');
  assert.equal(folded.lastSeen, 2);
  assert.equal(folded.title, 'Refined advisory title');
  assert.equal(folded.description, 'Refined claim about the wrapper.');
  const refinementTransitions = folded.transitions.filter((transition) => transition.from !== null);
  assert.equal(refinementTransitions.length, 1);
  assert.equal(refinementTransitions[0].iteration, 2);
  assert.equal(registry.severityChanged.length, 0);
  assert.equal(registry.persistentSameSeverity.length, 1);
  assert.equal(registry.persistentSameSeverity[0].findingId, 'R1-P2-001');
}

function testUnknownRefinesTargetFallsBackToInsert() {
  const result = reduceFixture('refines-unknown', ({ reviewDir }) => {
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: SESSION_ID },
      iterationRecord(1, {
        findingDetails: [
          detailRow(
            'R1-P2-001',
            'Advisory naming a missing target',
            'The target was never inserted into the registry.',
            { refines: 'R9-P2-404' },
          ),
        ],
      }),
    ]);
  });

  const registry = result.registry;
  assert.equal(registry.openFindingsCount, 1);
  assert.equal(registry.openFindings[0].findingId, 'R1-P2-001');
}

function testIdReuseWithoutRefinesKeepsBothFindings() {
  const result = reduceFixture('id-reuse', ({ reviewDir }) => {
    writeJsonl(path.join(reviewDir, 'deep-review-state.jsonl'), [
      { type: 'config', mode: 'review', sessionId: SESSION_ID },
      iterationRecord(1, {
        findingDetails: [
          detailRow('R1-P2-001', 'First advisory title', 'First claim about the wrapper.'),
        ],
      }),
      iterationRecord(2, {
        findingDetails: [
          detailRow('R1-P2-001', 'Second advisory title', 'Second claim about the wrapper.'),
        ],
      }),
    ]);
  });

  const registry = result.registry;
  assert.equal(registry.openFindingsCount, 2);
  const titles = registry.openFindings.map((finding) => finding.title).sort();
  assert.deepEqual(titles, ['First advisory title', 'Second advisory title']);
}

test('traceability checks do not become blocked dead ends', () => {
  testTraceabilityChecksDoNotBecomeBlockedDeadEnds();
});

test('a refines row folds into its target', () => {
  testRefinesRowFoldsIntoItsTarget();
});

test('an unknown refines target falls back to the ordinary insert path', () => {
  testUnknownRefinesTargetFallsBackToInsert();
});

test('an id reuse without refines keeps both findings', () => {
  testIdReuseWithoutRefinesKeepsBothFindings();
});
