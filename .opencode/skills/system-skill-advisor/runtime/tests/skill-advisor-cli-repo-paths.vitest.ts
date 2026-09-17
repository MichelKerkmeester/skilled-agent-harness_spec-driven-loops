// -----------------------------------------------------------------------------
// MODULE: Skill Advisor CLI Repository Paths Tests
// -----------------------------------------------------------------------------
// The CLI finds its launcher assets beside the source tree, which sits under
// .skilled or .opencode, or under .skilled with .opencode linked to it. Node
// reports the CLI's real path through that link, so the walk starts under .skilled.

import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { __testing } from '../skill-advisor-cli.js';

describe('skill advisor CLI repository paths under either source-root name', () => {
  for (const layout of [{ name: 'skilled-only', linked: false }, { name: 'whole-link', linked: true }] as const) {
    it(`${layout.name}: finds the launcher assets from a CLI path under .skilled`, () => {
      const root = realpathSync(mkdtempSync(join(tmpdir(), 'advisor-cli-repo-paths-')));
      try {
        mkdirSync(join(root, '.skilled', 'bin', 'lib'), { recursive: true });
        writeFileSync(join(root, '.skilled', 'bin', 'system-skill-advisor-launcher.cjs'), '');
        writeFileSync(join(root, '.skilled', 'bin', 'lib', 'launcher-ipc-bridge.cjs'), '');
        if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));
        const cliPath = join(root, '.skilled', 'skills', 'system-skill-advisor', 'runtime', 'dist', 'skill-advisor-cli.js');

        const paths = __testing.findRepoPaths(cliPath);

        expect(paths.repoRoot).toBe(root);
        expect(paths.launcherPath).toBe(join(root, '.skilled', 'bin', 'system-skill-advisor-launcher.cjs'));
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  }
});
