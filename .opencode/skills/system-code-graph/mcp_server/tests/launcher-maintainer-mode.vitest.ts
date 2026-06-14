import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-code-index-launcher.cjs') as {
  resolveMaintainerModeCategories: (raw: string | undefined) => string[];
  MAINTAINER_CATEGORY_ENV: Record<string, string>;
};

describe('resolveMaintainerModeCategories', () => {
  it('"true" forces every category (back-compat)', () => {
    expect(launcher.resolveMaintainerModeCategories('true').sort()).toEqual(
      ['agents', 'commands', 'plugins', 'skills', 'specs'],
    );
  });

  it('a comma subset forces only the recognized categories', () => {
    expect(launcher.resolveMaintainerModeCategories('skills,plugins').sort()).toEqual(['plugins', 'skills']);
  });

  it('drops unknown category names and tolerates whitespace + case', () => {
    expect(launcher.resolveMaintainerModeCategories(' Skills , bogus , PLUGINS ').sort()).toEqual(['plugins', 'skills']);
  });

  it('"false", empty, and unset force nothing', () => {
    expect(launcher.resolveMaintainerModeCategories('false')).toEqual([]);
    expect(launcher.resolveMaintainerModeCategories('')).toEqual([]);
    expect(launcher.resolveMaintainerModeCategories(undefined)).toEqual([]);
  });

  it('every category maps to a SPECKIT_CODE_GRAPH_INDEX_* env key', () => {
    const keys = Object.values(launcher.MAINTAINER_CATEGORY_ENV);
    expect(keys).toHaveLength(5);
    for (const key of keys) {
      expect(key).toMatch(/^SPECKIT_CODE_GRAPH_INDEX_[A-Z]+$/);
    }
  });
});
