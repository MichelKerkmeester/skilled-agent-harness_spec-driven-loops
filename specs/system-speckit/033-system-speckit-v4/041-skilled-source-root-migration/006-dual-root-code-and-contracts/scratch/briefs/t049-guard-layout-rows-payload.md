## Edit 1

File: `.opencode/bin/compiled-routing-foundation.vitest.ts`

OLD:

~~~~text
import { dirname, join } from 'node:path';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
~~~~

NEW:

~~~~text
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
~~~~

## Edit 2

File: `.opencode/bin/compiled-routing-foundation.vitest.ts`

OLD:

~~~~text
    expect(v).toEqual([]);
  });
});
~~~~

NEW:

~~~~text
    expect(v).toEqual([]);
  });
});

describe('durable no-spec-import guard under either source-root name', () => {
  const REPO_ROOT = join(HERE, '..', '..');
  const GUARD = join(HERE, 'check-no-spec-imports.cjs');
  // A checkout holds the tree under .opencode, under .skilled, or under .skilled with
  // .opencode linked to it, and Node runs a script through that link by its real path.
  const layouts = [
    { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
    { name: 'skilled-only', realRoot: '.skilled', linked: false, entries: ['.skilled'] },
    { name: 'whole-link', realRoot: '.skilled', linked: true, entries: ['.opencode', '.skilled'] },
  ];

  it.each(['specs', '.opencode/specs', '.skilled/specs'])(
    'flags an import from a .skilled/bin script that resolves under %s',
    (spelling) => {
      expect(scanner.targetResolvesUnderSpecs(join(REPO_ROOT, '.skilled', 'bin'), `../../${spelling}`)).toBe(true);
    },
  );

  it("flags require('../specs') from a .skilled/bin script", () => {
    expect(scanner.targetResolvesUnderSpecs(join(REPO_ROOT, '.skilled', 'bin'), '../specs')).toBe(true);
  });

  for (const layout of layouts) {
    for (const entry of layout.entries) {
      it(`${layout.name} through ${entry}/bin: the default scan reads its own directory and fails on a seeded import`, () => {
        const root = mkdtempSync(join(tmpdir(), 'no-spec-import-layout-'));
        try {
          const binDirectory = join(root, layout.realRoot, 'bin');
          mkdirSync(binDirectory, { recursive: true });
          copyFileSync(GUARD, join(binDirectory, 'check-no-spec-imports.cjs'));
          writeFileSync(join(binDirectory, 'seeded-spec-import.cjs'), "require('../../specs/seeded/target.cjs');\n");
          if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));

          const result = spawnSync(process.execPath, [join(root, entry, 'bin', 'check-no-spec-imports.cjs')], { encoding: 'utf8' });
          expect(result.status).toBe(1);
          expect(result.stderr).toContain('seeded-spec-import.cjs');
        } finally {
          rmSync(root, { recursive: true, force: true });
        }
      });
    }
  }

  it('exits 2, not 0 or the violation code, when a scan reads no file', () => {
    const empty = mkdtempSync(join(tmpdir(), 'no-spec-import-empty-'));
    try {
      const result = spawnSync(process.execPath, [GUARD, empty], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stdout).not.toContain('ok:');
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  });
});
~~~~
