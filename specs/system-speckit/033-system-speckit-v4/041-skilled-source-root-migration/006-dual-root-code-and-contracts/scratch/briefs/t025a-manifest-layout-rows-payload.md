## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration-manifest.vitest.ts`

OLD:

~~~~text
import { afterEach, describe, expect, it } from 'vitest';

import { buildMigrationManifest } from '../core/spec-root-migration-manifest.js';

// ───────────────────────────────────────────────────────────────────
~~~~

NEW:

~~~~text
import { afterEach, describe, expect, it } from 'vitest';

import { materializeRootFixture, R_FIXTURES } from '../core/spec-root-fixtures.js';
import { buildMigrationManifest } from '../core/spec-root-migration-manifest.js';

import type { MaterializedRootFixture, RootFixtureId, SourceRootLayout } from '../core/spec-root-fixtures.js';

// ───────────────────────────────────────────────────────────────────
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration-manifest.vitest.ts`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
  });
});

// The source tree may sit under .skilled or .opencode, with one name linked to the other.
// The legacy root keeps its one .opencode/specs spelling, so a link from .opencode to
// .skilled lists it exactly as today does, and a .skilled-only workspace lists none.
describe('buildMigrationManifest under each source-root layout', () => {
  const fixtures: MaterializedRootFixture[] = [];

  afterEach(() => {
    for (const fixture of fixtures.splice(0)) fixture.cleanup();
  });

  function materialize(id: RootFixtureId, layout: SourceRootLayout): MaterializedRootFixture {
    const rootFixture = R_FIXTURES.find((candidate) => candidate.id === id);
    if (!rootFixture) throw new Error(`missing root fixture ${id}`);
    const fixture = materializeRootFixture(rootFixture, layout);
    fixtures.push(fixture);
    return fixture;
  }

  function summary(fixture: MaterializedRootFixture): Array<[string, string[]]> {
    return buildMigrationManifest(fixture.workspaceDir).entries.map((entry) => [
      entry.klass,
      entry.roots.map((root) => path.relative(fixture.workspaceDir, root)),
    ]);
  }

  it.each(['today', 'whole-link'] as const)('%s: lists the legacy root by its .opencode spelling', (layout) => {
    const legacySpelling = path.join('.opencode', 'specs');
    expect(summary(materialize('R1', layout))).toEqual([['canonical-only', ['specs']]]);
    expect(summary(materialize('R2', layout))).toEqual([['legacy-only', [legacySpelling]]]);
    expect(summary(materialize('R3', layout))).toEqual([['same-inode-alias', ['specs', legacySpelling]]]);
    const dangling = materialize('R7', layout);
    expect(() => buildMigrationManifest(dangling.workspaceDir)).toThrow('Spec root is unavailable');
  });

  it('skilled-only: lists no legacy root, because the alias has no .skilled spelling', () => {
    expect(summary(materialize('R1', 'skilled-only'))).toEqual([['canonical-only', ['specs']]]);
    expect(summary(materialize('R2', 'skilled-only'))).toEqual([]);
    expect(summary(materialize('R3', 'skilled-only'))).toEqual([['canonical-only', ['specs']]]);
    expect(summary(materialize('R7', 'skilled-only'))).toEqual([['canonical-only', ['specs']]]);
  });
});
~~~~
