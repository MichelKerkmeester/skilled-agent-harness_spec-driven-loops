// ───────────────────────────────────────────────────────────────────
// MODULE: Schema Compatibility Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  ContractKinds,
  assessSchemaCompatibility,
  parseSemanticVersion,
} from '../../src/index.js';

describe('schema compatibility policy', () => {
  it('parses strict semantic versions without coercion', () => {
    expect(parseSemanticVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
    expect(parseSemanticVersion('01.2.3')).toBeNull();
    expect(parseSemanticVersion('1.2')).toBeNull();
    expect(parseSemanticVersion('v1.2.3')).toBeNull();
  });

  it('classifies exact, additive, backward-readable, and breaking versions', () => {
    expect(assessSchemaCompatibility(ContractKinds.EVENT, '1.0.0').behavior)
      .toBe('exact');
    expect(assessSchemaCompatibility(ContractKinds.EVENT, '1.1.0').behavior)
      .toBe('additive');
    expect(assessSchemaCompatibility(ContractKinds.EVENT, '1.0.1').behavior)
      .toBe('backward-readable');

    const breaking = assessSchemaCompatibility(ContractKinds.EVENT, '2.0.0');
    expect(breaking.supported).toBe(false);
    expect(breaking.behavior).toBe('breaking');
    expect(breaking.requiresMigration).toBe(true);
  });
});
