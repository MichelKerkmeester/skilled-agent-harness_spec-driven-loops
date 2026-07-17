// -----------------------------------------------------------------------------
// MODULE: Spec Root Collision Classifier Tests
// -----------------------------------------------------------------------------

import { afterEach, describe, expect, it } from 'vitest';

import { classifySpecRootCollision } from '../core/spec-root-collision-classifier.js';
import {
  materializeRootFixture,
  R_FIXTURES,
} from '../core/spec-root-fixtures.js';

import type { CollisionClass } from '../core/spec-root-collision-classifier.js';
import type {
  MaterializedRootFixture,
  RootFixture,
} from '../core/spec-root-fixtures.js';

type ClassifierFixture = RootFixture & {
  readonly expectedClass: CollisionClass;
  readonly expectedDecision: 'allow' | 'reject';
};

const materializedFixtures: MaterializedRootFixture[] = [];

function isClassifierFixture(fixture: RootFixture): fixture is ClassifierFixture {
  return fixture.expectedClass !== undefined && fixture.expectedDecision !== 'n/a';
}

afterEach(() => {
  for (const fixture of materializedFixtures.splice(0)) {
    fixture.cleanup();
  }
});

describe('classifySpecRootCollision', () => {
  it.each(R_FIXTURES.filter(isClassifierFixture))('$id: $name', (fixture) => {
    const materialized = materializeRootFixture(fixture);
    materializedFixtures.push(materialized);

    const result = classifySpecRootCollision(
      materialized.relativePacketId,
      materialized.physicalRoots,
    );

    expect(result.klass).toBe(fixture.expectedClass);
    expect(result.decision).toBe(fixture.expectedDecision);
  });
});
