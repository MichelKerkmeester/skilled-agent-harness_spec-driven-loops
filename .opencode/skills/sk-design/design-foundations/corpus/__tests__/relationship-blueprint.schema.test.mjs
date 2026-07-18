// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Foundations Relationship Schema Tests                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import test from 'node:test';

import { validateFoundationsRelationshipRequest } from '../relationship-blueprint.mjs';
import {
  MAINTAINER_FIXTURE_ATLAS,
  foundationsExplicitNoneFixture,
  foundationsRelationshipFixture,
} from './fixtures.mjs';

const GENERATION_HASH = `sha256:${'1'.repeat(64)}`;

test('the fixture atlas is maintainer-only', () => {
  assert.equal(MAINTAINER_FIXTURE_ATLAS, true);
});

for (const relation of ['works-with', 'conflicts-with', 'not-assessed']) {
  test(`compatibility relation ${relation} is a typed outcome`, () => {
    const fixture = foundationsRelationshipFixture(GENERATION_HASH, relation);
    const validation = validateFoundationsRelationshipRequest(fixture.input);

    assert.deepEqual(validation, { valid: true, errors: [] });
  });
}

for (const unsafeRelation of ['average', 'interpolate', 'co-present', 'similar']) {
  test(`compatibility rejects untyped relation ${unsafeRelation}`, () => {
    const fixture = foundationsRelationshipFixture(GENERATION_HASH);
    fixture.input.compatibilityGraph.edges[0].relation = unsafeRelation;
    const validation = validateFoundationsRelationshipRequest(fixture.input);

    assert.equal(validation.valid, false);
    assert.ok(validation.errors.includes('compatibilityGraph.edges.0.relation:invalid'));
  });
}

test('the allowed-enum verdict smuggling combination is rejected', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH, 'works-with');
  fixture.input.compatibilityGraph.edges[0].basis = 'unresolved-target-check';
  fixture.input.transformationLedger.records[0].transformation = 'target-derived';
  fixture.input.transformationLedger.records[0].lock = 'target-value';
  fixture.input.transformationLedger.records[0].authorityLockId =
    fixture.input.authorityInputs.targetValues.lockId;
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'compatibilityGraph.edges.0.relation-basis:invalid-union',
  ));
  assert.ok(validation.errors.includes(
    'transformationLedger.records.0.transformation:invalid',
  ));
  assert.ok(validation.errors.includes(
    'transformationLedger.records.0.transformation-lock:invalid-union',
  ));
});

test('a target-derived corpus transformation is rejected', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.transformationLedger.records[0].transformation = 'target-derived';
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'transformationLedger.records.0.transformation:invalid',
  ));
});

test('a target-derived corpus graph record is rejected', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.compatibilityGraph.nodes[0].ownerRole = 'target-derived';
  fixture.input.compatibilityGraph.nodes[0].sourceId = null;
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'compatibilityGraph.nodes.0.ownerRole:invalid',
  ));
});

test('an unresolved basis permits only not-assessed', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH, 'not-assessed');
  fixture.input.compatibilityGraph.edges[0].relation = 'conflicts-with';
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'compatibilityGraph.edges.0.relation-basis:invalid-union',
  ));
});

test('a ledger source must be an endpoint of its relationship edge', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.transformationLedger.records[0].sourceId =
    'dddddddd-4444-4444-8444-dddddddddddd';
  fixture.input.selection.axisOwnerIds.push(
    'dddddddd-4444-4444-8444-dddddddddddd',
  );
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'transformationLedger.records.0.sourceId:not-edge-endpoint',
  ));
});

test('a ledger lock must identify its matching authority lock', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.transformationLedger.records[0].authorityLockId =
    fixture.input.authorityInputs.targetValues.lockId;
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'transformationLedger.records.0.authorityLockId:lock-authority-mismatch',
  ));
});

test('an explicit no-fit request validates with an empty graph and ledger', () => {
  const fixture = foundationsExplicitNoneFixture(GENERATION_HASH);

  assert.deepEqual(validateFoundationsRelationshipRequest(fixture.input), {
    valid: true,
    errors: [],
  });
});

test('a corpus edge attempting authority is structurally rejected', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.compatibilityGraph.edges[0].accessibilityProof = 'passed';
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'compatibilityGraph.edges.0.accessibilityProof:unexpected',
  ));
});

test('a free-text claim channel is rejected from the transformation ledger', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.transformationLedger.records[0].claim = 'Assign severity and reuse values';
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('transformationLedger.records.0.claim:unexpected'));
});

test('downstream checks cannot be promoted by corpus evidence', () => {
  const fixture = foundationsRelationshipFixture(GENERATION_HASH);
  fixture.input.downstreamChecks.accessibility = 'passed';
  const validation = validateFoundationsRelationshipRequest(fixture.input);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'downstreamChecks.accessibility:must-be-not-assessed',
  ));
});
