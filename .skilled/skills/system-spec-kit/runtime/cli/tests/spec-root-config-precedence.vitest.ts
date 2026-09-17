// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Config Precedence Tests
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  CONFIG,
  findActiveSpecsDir,
  getAllExistingSpecsDirs,
  getSpecsDirectories,
} from '../core/config.js';
import { materializeRootFixture, R_FIXTURES } from '../core/spec-root-fixtures.js';

import type { SourceRootLayout } from '../core/spec-root-fixtures.js';

const originalProjectRoot = CONFIG.PROJECT_ROOT;

let tempDirectory: string;

describe('spec root config precedence', () => {
  beforeEach(() => {
    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-root-config-'));
    CONFIG.PROJECT_ROOT = tempDirectory;
  });

  afterEach(() => {
    CONFIG.PROJECT_ROOT = originalProjectRoot;
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });

  it('orders canonical first while enumerating both existing roots', () => {
    const canonicalRoot = path.join(tempDirectory, 'specs');
    const legacyRoot = path.join(tempDirectory, '.opencode', 'specs');
    fs.mkdirSync(canonicalRoot, { recursive: true });
    fs.mkdirSync(legacyRoot, { recursive: true });

    expect(getSpecsDirectories()).toEqual([canonicalRoot, legacyRoot]);
    expect(findActiveSpecsDir()).toBe(canonicalRoot);
    expect(getAllExistingSpecsDirs()).toEqual([canonicalRoot, legacyRoot]);
  });

  it('falls back to the legacy root when it is the only existing root', () => {
    const legacyRoot = path.join(tempDirectory, '.opencode', 'specs');
    fs.mkdirSync(legacyRoot, { recursive: true });

    expect(findActiveSpecsDir()).toBe(legacyRoot);
    expect(getAllExistingSpecsDirs()).toEqual([legacyRoot]);
  });

  it.each<SourceRootLayout>(['today', 'skilled-only', 'whole-link'])(
    '%s: an alias of the canonical root dedupes to canonical and .skilled/specs is never listed',
    (layout) => {
      const aliasFixture = R_FIXTURES.find((rootFixture) => rootFixture.id === 'R3');
      if (!aliasFixture) throw new Error('R3 fixture is missing');
      const fixture = materializeRootFixture(aliasFixture, layout);
      try {
        CONFIG.PROJECT_ROOT = fixture.workspaceDir;
        const canonicalRoot = path.join(fixture.workspaceDir, 'specs');
        const skilledEntry = path.join(fixture.workspaceDir, '.skilled', 'specs');

        expect(getSpecsDirectories()).toEqual([canonicalRoot, path.join(fixture.workspaceDir, '.opencode', 'specs')]);
        expect(findActiveSpecsDir()).toBe(canonicalRoot);
        expect(getAllExistingSpecsDirs()).toEqual([canonicalRoot]);
        expect(getAllExistingSpecsDirs()).not.toContain(skilledEntry);
      } finally {
        fixture.cleanup();
      }
    },
  );
});
