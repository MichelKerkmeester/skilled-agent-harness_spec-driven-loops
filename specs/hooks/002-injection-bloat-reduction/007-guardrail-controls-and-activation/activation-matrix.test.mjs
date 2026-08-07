import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const phaseDirectory = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.join(phaseDirectory, 'activation-matrix.json');
const schemaPath = path.join(phaseDirectory, 'activation-matrix.schema.json');
const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const runtimes = ['Claude Code', 'Codex', 'Cursor', 'Devin', 'OpenCode', 'Pi'];
const candidates = ['002', '003', '004', '005', '006'];

function expectedApplicable(runtime, candidate) {
  if (candidate === '002' || candidate === '003') return runtime === 'OpenCode';
  if (candidate === '004') return ['Claude Code', 'Codex', 'Devin', 'OpenCode'].includes(runtime);
  if (candidate === '005') return true;
  if (candidate === '006') return runtime === 'Pi';
  return false;
}

function evidencePasses(evidence) {
  return Boolean(
    evidence
      && evidence.status === 'pass'
      && typeof evidence.artifact === 'string'
      && evidence.artifact.length > 0
      && typeof evidence.source === 'string'
      && evidence.source.length > 0
      && typeof evidence.observedAt === 'string'
      && typeof evidence.notes === 'string'
      && evidence.notes.length > 0,
  );
}

function gateVerdict(cell) {
  if (!cell.applicable) return 'N/A';
  if (evidencePasses(cell.behavioralEvidence) && evidencePasses(cell.deliveryEvidence)) {
    return 'activated';
  }
  return 'emit';
}

function assertCellShape(cell) {
  assert.deepEqual(Object.keys(cell).sort(), [
    'applicable',
    'behavioralEvidence',
    'candidate',
    'deliveryEvidence',
    'runtime',
    'verdict',
  ]);
  assert.ok(runtimes.includes(cell.runtime));
  assert.ok(candidates.includes(cell.candidate));
  assert.equal(typeof cell.applicable, 'boolean');
  assert.ok(['N/A', 'emit', 'activated'].includes(cell.verdict));
}

test('activation matrix enumerates all six runtimes by all five candidate cells', () => {
  assert.equal(matrix.schemaVersion, 1);
  assert.deepEqual(matrix.runtimes, runtimes);
  assert.deepEqual(matrix.candidates, candidates);
  assert.equal(matrix.cells.length, 30);

  const identities = new Set();
  for (const cell of matrix.cells) {
    assertCellShape(cell);
    const identity = `${cell.runtime}/${cell.candidate}`;
    assert.equal(identities.has(identity), false, `Duplicate matrix cell: ${identity}`);
    identities.add(identity);
    assert.equal(cell.applicable, expectedApplicable(cell.runtime, cell.candidate));
  }
  assert.equal(identities.size, 30);
});

test('fail-open gate emits for every applicable cell without two passing evidence records', () => {
  const applicableCells = matrix.cells.filter((cell) => cell.applicable);
  const inapplicableCells = matrix.cells.filter((cell) => !cell.applicable);
  const activatedCells = matrix.cells.filter((cell) => cell.verdict === 'activated');

  assert.equal(applicableCells.length, 13);
  assert.equal(inapplicableCells.length, 17);
  assert.equal(activatedCells.length, 0);
  assert.equal(matrix.activationState, 'all-candidate-flags-off');

  for (const cell of matrix.cells) {
    assert.equal(cell.verdict, gateVerdict(cell), `${cell.runtime}/${cell.candidate} bypassed the fail-open policy`);
    if (!cell.applicable) assert.equal(cell.verdict, 'N/A');
    if (cell.applicable && (!evidencePasses(cell.behavioralEvidence) || !evidencePasses(cell.deliveryEvidence))) {
      assert.equal(cell.verdict, 'emit');
    }
  }

  const passingDelivery = {
    status: 'pass',
    artifact: 'delivery-receipt.json',
    source: 'runtime probe',
    observedAt: '2026-08-06T00:00:00Z',
    notes: 'The host receipt is pinned to this cell.',
  };
  for (const status of ['fail', 'unknown', 'ambiguous']) {
    const syntheticCell = {
      ...applicableCells[0],
      behavioralEvidence: { ...passingDelivery, status },
      deliveryEvidence: passingDelivery,
    };
    assert.equal(gateVerdict(syntheticCell), 'emit');
  }

  console.log(`MATRIX_FAIL_OPEN applicable=${applicableCells.length} unproven_emit=${applicableCells.filter((cell) => cell.verdict === 'emit').length} activated=${activatedCells.length} ambiguous_statuses=fail,unknown,ambiguous->emit`);
});

test('activation schema exposes the evidence contract without candidate-phase changes', () => {
  assert.equal(schema.type, 'object');
  assert.deepEqual(schema.required, [
    '$schema',
    'schemaVersion',
    'phase',
    'activationState',
    'runtimes',
    'candidates',
    'policy',
    'applicabilityRules',
    'cells',
  ]);
  assert.deepEqual(schema.properties.cells.items, { $ref: '#/$defs/cell' });
  assert.deepEqual(schema.$defs.cell.required, [
    'runtime',
    'candidate',
    'applicable',
    'behavioralEvidence',
    'deliveryEvidence',
    'verdict',
  ]);
  assert.deepEqual(schema.$defs.evidence.required, [
    'status',
    'artifact',
    'source',
    'observedAt',
    'notes',
  ]);
  assert.deepEqual(schema.$defs.evidence.properties.status.enum, ['pass', 'fail', 'unknown', 'ambiguous']);
});
