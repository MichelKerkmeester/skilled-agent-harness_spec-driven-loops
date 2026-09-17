## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts`

OLD:

~~~~text
import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
~~~~

NEW:

~~~~text
import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';
import {
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts`

OLD:

~~~~text
  AdvisorRebuildInputSchema,
  isAllowedWorkspaceRoot,
~~~~

NEW:

~~~~text
  AdvisorRebuildInputSchema,
  detectRepoRoot,
  isAllowedWorkspaceRoot,
~~~~

## Edit 3

File: `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts`

OLD:

~~~~text
      expect(isAllowedWorkspaceRoot(join(tmpDir, 'nested'))).toBe(true);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
~~~~

NEW:

~~~~text
      expect(isAllowedWorkspaceRoot(join(tmpDir, 'nested'))).toBe(true);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('detectRepoRoot stays in lockstep with findAdvisorWorkspaceRoot', () => {
  // The allowlist admits every temp path, so it cannot tell the two walks apart. The
  // schema's walk is fed the same trees as the handler's walk instead.
  it('names the same root under each source-root layout, entry name and fallback', () => {
    const root = mkdtempSync(join(tmpdir(), 'speckit-advisor-lockstep-'));
    try {
      const writeSentinel = (repo: string, name: string): void => {
        const skillDir = join(repo, name, 'skills', 'system-spec-kit');
        mkdirSync(skillDir, { recursive: true });
        writeFileSync(join(skillDir, 'SKILL.md'), '# sentinel\n');
      };
      const today = join(root, 'today');
      writeSentinel(today, '.opencode');
      const skilledOnly = join(root, 'skilled-only');
      writeSentinel(skilledOnly, '.skilled');
      const wholeLink = join(root, 'whole-link');
      writeSentinel(wholeLink, '.skilled');
      symlinkSync('.skilled', join(wholeLink, '.opencode'));
      const leak = join(root, 'leak', '.skilled', 'skills', 'x', '.opencode', 'skills');
      mkdirSync(leak, { recursive: true });
      // Deeper than both fixed walks, so each must fall back, under an ancestor that
      // carries a source-root name.
      const nestedRepo = join(root, '.skilled', 'outer', 'repo');
      writeSentinel(nestedRepo, '.opencode');
      const deepStart = join(nestedRepo, '.opencode', 'skills', 'system-spec-kit', ...Array.from({ length: 14 }, () => 'deep'));
      mkdirSync(deepStart, { recursive: true });

      const cases: ReadonlyArray<readonly [string, string]> = [
        [join(today, '.opencode', 'skills', 'system-spec-kit'), today],
        [join(skilledOnly, '.skilled', 'skills', 'system-spec-kit'), skilledOnly],
        [join(wholeLink, '.opencode', 'skills', 'system-spec-kit'), wholeLink],
        [join(wholeLink, '.skilled', 'skills', 'system-spec-kit'), wholeLink],
        [leak, join(root, 'leak')],
        [deepStart, nestedRepo],
      ];
      for (const [start, expectedRoot] of cases) {
        expect(detectRepoRoot(start)).toBe(resolve(expectedRoot));
        expect(detectRepoRoot(start)).toBe(findAdvisorWorkspaceRoot(start));
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
~~~~
