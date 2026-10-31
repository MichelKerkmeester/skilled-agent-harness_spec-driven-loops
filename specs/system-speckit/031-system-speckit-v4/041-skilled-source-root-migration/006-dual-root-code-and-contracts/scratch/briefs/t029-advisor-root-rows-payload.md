## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`

OLD:

~~~~text
// `skills/` were never in scope and went unnoticed.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
~~~~

NEW:

~~~~text
// `skills/` were never in scope and went unnoticed.
//
// The source tree sits under `.skilled` or `.opencode`, or under `.skilled` with
// `.opencode` linked to it, and the walk treats both names as the same tree.

import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
~~~~

## Edit 2

File: `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`

OLD:

~~~~text
    expect(findAdvisorWorkspaceRoot(plain)).toBe(resolve(plain));
  });
});
~~~~

NEW:

~~~~text
    expect(findAdvisorWorkspaceRoot(plain)).toBe(resolve(plain));
  });
});

describe('findAdvisorWorkspaceRoot — either source-root name', () => {
  type Layout = 'today' | 'skilled-only' | 'whole-link';
  const layouts: ReadonlyArray<readonly [Layout, readonly string[]]> = [
    ['today', ['.opencode']],
    ['skilled-only', ['.skilled']],
    ['whole-link', ['.opencode', '.skilled']],
  ];

  function makeLayoutRepo(layout: Layout): string {
    const repo = makeTmpRoot();
    const skillDir = mkdirp(join(repo, layout === 'today' ? '.opencode' : '.skilled', 'skills', 'system-spec-kit'));
    writeFileSync(join(skillDir, 'SKILL.md'), '# sentinel\n');
    if (layout === 'whole-link') symlinkSync('.skilled', join(repo, '.opencode'));
    return repo;
  }

  for (const [layout, entries] of layouts) {
    for (const entry of entries) {
      it(`${layout} through ${entry}: default, explicit and capped walks all name the root`, () => {
        const repo = makeLayoutRepo(layout);
        const seat = mkdirp(join(repo, entry, 'skills', 'sk-doc', 'create-diff'));
        expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
        expect(findAdvisorWorkspaceRoot(seat, { sentinel: SENTINEL })).toBe(resolve(repo));
        expect(findAdvisorWorkspaceRoot(seat, { maxDepth: 2 })).toBe(resolve(repo));
      });
    }
  }

  for (const layout of ['today', 'skilled-only'] as const) {
    it(`${layout}: a workspace inside an ancestor named .skilled keeps its own root on full and capped walks`, () => {
      const repo = mkdirp(join(makeTmpRoot(), '.skilled', 'outer', 'repo'));
      const skillDir = mkdirp(join(repo, layout === 'today' ? '.opencode' : '.skilled', 'skills', 'system-spec-kit'));
      writeFileSync(join(skillDir, 'SKILL.md'), '# sentinel\n');
      const seat = mkdirp(join(skillDir, 'runtime', 'lib'));
      expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
      expect(findAdvisorWorkspaceRoot(seat, { maxDepth: 2 })).toBe(resolve(repo));
    });
  }

  it('hoists above the OUTERMOST segment when a .skilled tree leaked an .opencode tree inside it', () => {
    const repo = makeTmpRoot();
    const seat = mkdirp(join(repo, '.skilled', 'skills', 'x', '.opencode', 'skills'));
    expect(findAdvisorWorkspaceRoot(seat)).toBe(resolve(repo));
  });

  it('never treats look-alike segments as a source root', () => {
    const repo = makeTmpRoot();
    const plain = mkdirp(join(repo, '055-skilled-source-root-migration', 'skilled', '.skilled-backup'));
    expect(findAdvisorWorkspaceRoot(plain)).toBe(resolve(plain));
  });

  it('never returns a path containing a .skilled or .opencode segment for a start under either tree', () => {
    const repo = makeTmpRoot();
    for (const name of ['.skilled', '.opencode']) {
      const segments = findAdvisorWorkspaceRoot(mkdirp(join(repo, name, 'skills', 'system-spec-kit'))).split(sep);
      expect(segments).not.toContain('.skilled');
      expect(segments).not.toContain('.opencode');
    }
  });
});
~~~~
