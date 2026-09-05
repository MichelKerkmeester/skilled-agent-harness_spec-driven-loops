// TEST: Import Policy Rules
import { describe, expect, it } from 'vitest';

import { isProhibitedImportPath } from '../evals/import-policy-rules';

describe('isProhibitedImportPath', () => {
  it('blocks package imports for internal runtime roots and descendants', () => {
    expect(isProhibitedImportPath('@spec-kit/runtime/lib/search/vector-index')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/runtime/core')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/runtime/core/db-state')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/runtime/handlers')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/runtime/handlers/memory-index')).toBe(true);
  });

  it('blocks relative imports for internal runtime roots and descendants', () => {
    expect(isProhibitedImportPath('../../lib/search/vector-index')).toBe(true);
    expect(isProhibitedImportPath('../../core')).toBe(true);
    expect(isProhibitedImportPath('../../../core/db-state')).toBe(true);
    expect(isProhibitedImportPath('../../handlers')).toBe(true);
    expect(isProhibitedImportPath('../../../handlers/memory-index')).toBe(true);
  });

  it('blocks normalized relative bypass attempts into internal runtime roots', () => {
    expect(isProhibitedImportPath('../../api/../core/config')).toBe(true);
    expect(isProhibitedImportPath('./../runtime/core/config')).toBe(true);
    expect(isProhibitedImportPath('../../shared/lib/../utils')).toBe(true);
  });

  it('blocks sibling shared traversals and still allows public package imports', () => {
    expect(isProhibitedImportPath('../shared/utils')).toBe(true);
    expect(isProhibitedImportPath('../../shared/utils/path-security')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/runtime/api')).toBe(false);
    expect(isProhibitedImportPath('@spec-kit/runtime/api/indexing')).toBe(false);
    expect(isProhibitedImportPath('../../api/indexing')).toBe(false);
    expect(isProhibitedImportPath('../../core/../api/indexing')).toBe(false);
  });
});
