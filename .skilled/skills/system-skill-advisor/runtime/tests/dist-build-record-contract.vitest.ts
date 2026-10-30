// ───────────────────────────────────────────────────────────────
// MODULE: Dist Build Record Contract Tests
// ───────────────────────────────────────────────────────────────
// A build leaves an attested freshness record beside each dist entry it emits.
// Without that record the first freshness check writes one of its own, so any
// suite that asserts a run leaves the tree unchanged reports the write, and it
// reports it only in a checkout whose dist was just built -- a fresh worktree
// provision, never a warm one. This suite reads the registry that decides which
// entries exist and holds the package scripts to it, so adding a dist entry
// without teaching the build to attest it fails here rather than intermittently
// somewhere else.

import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const PACKAGE_ID = 'system-skill-advisor/runtime';
const DIST_FRESHNESS = require('../../../system-spec-kit/runtime/cli/lib/dist-freshness.cjs') as {
  DIST_PACKAGES: Array<{ id: string; distEntries: Record<string, string> }>;
};
const scripts = (require('../package.json') as { scripts: Record<string, string> }).scripts;

function declaredEntries(): string[] {
  const entry = DIST_FRESHNESS.DIST_PACKAGES.find((candidate) => candidate.id === PACKAGE_ID);
  if (!entry) throw new Error(`the freshness registry no longer declares ${PACKAGE_ID}`);
  return Object.keys(entry.distEntries);
}

function occurrences(script: string, subcommand: string): string[] {
  const pattern = new RegExp(`${subcommand} --package ${PACKAGE_ID} --entry (\\S+)`, 'g');
  return [...script.matchAll(pattern)].map((match) => match[1]);
}

describe('advisor runtime build records', () => {
  it('declares a prepare step before the compile and a record step after it', () => {
    expect(scripts.build).toContain('tsc -p tsconfig.build.json');
    expect(scripts.prebuild).toBeTruthy();
    expect(scripts.postbuild).toBeTruthy();
  });

  it('prepares and records every dist entry the freshness registry declares, and no other', () => {
    const entries = declaredEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(occurrences(scripts.prebuild, 'prepare-build').sort()).toEqual([...entries].sort());
    expect(occurrences(scripts.postbuild, 'record-build').sort()).toEqual([...entries].sort());
  });
});
