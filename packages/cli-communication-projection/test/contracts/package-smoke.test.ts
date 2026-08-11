// ───────────────────────────────────────────────────────────────────
// MODULE: Package Smoke Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  ContractKinds,
  RuntimeIds,
  SupportedSchemaVersions,
  assertValidContract,
  isContractKind,
  validateContract,
  validateEventStream,
} from '../../src/index.js';

describe('public package surface', () => {
  it('exports every v1 contract family and runtime', () => {
    const kinds = Object.values(ContractKinds);
    expect(kinds).toHaveLength(11);
    expect(Object.keys(SupportedSchemaVersions)).toHaveLength(11);
    expect(kinds.every((kind) => isContractKind(kind))).toBe(true);
    expect(Object.values(RuntimeIds)).toEqual([
      'claude',
      'codex',
      'cursor',
      'devin',
      'opencode',
      'pi',
    ]);
  });

  it('exports validation entry points without a runtime adapter dependency', () => {
    expect(validateContract).toBeTypeOf('function');
    expect(assertValidContract).toBeTypeOf('function');
    expect(validateEventStream).toBeTypeOf('function');
  });
});
