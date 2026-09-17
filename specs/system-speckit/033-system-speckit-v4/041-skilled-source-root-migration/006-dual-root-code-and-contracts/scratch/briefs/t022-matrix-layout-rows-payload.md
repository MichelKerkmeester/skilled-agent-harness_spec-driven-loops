## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts`

OLD:

~~~~text
import { assertSpecWriteAllowed } from '../core/spec-root-write-guard.js';

import type { CollisionClass } from '../core/spec-root-collision-classifier.js';
import type {
  MaterializedRootFixture,
  RootFixtureId,
} from '../core/spec-root-fixtures.js';
~~~~

NEW:

~~~~text
import { assertSpecWriteAllowed } from '../core/spec-root-write-guard.js';

import type { CollisionClass, PhysicalRoot } from '../core/spec-root-collision-classifier.js';
import type {
  MaterializedRootFixture,
  RootFixtureId,
  SourceRootLayout,
} from '../core/spec-root-fixtures.js';
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts`

OLD:

~~~~text
};

const materializedFixtures: MaterializedRootFixture[] = [];
~~~~

NEW:

~~~~text
};

const SOURCE_ROOT_LAYOUTS: readonly SourceRootLayout[] = ['today', 'skilled-only', 'whole-link'];
const LAYOUT_FIXTURES = R_FIXTURES.filter((rootFixture) => ['R1', 'R3', 'R7'].includes(rootFixture.id));

const materializedFixtures: MaterializedRootFixture[] = [];
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
  });
});

describe('spec root matrix under each source-root layout', () => {
  describe.each(SOURCE_ROOT_LAYOUTS)('%s', (layout) => {
    it.each(LAYOUT_FIXTURES)('$id: $name', (rootFixture) => {
      const fixture = materializeRootFixture(rootFixture, layout);
      materializedFixtures.push(fixture);
      const { canonicalRoot, legacyRoot } = getRoots(fixture);
      const skilledEntry = path.join(fixture.workspaceDir, '.skilled', 'specs');
      // A workspace with no .opencode path hides the legacy entry from every resolver,
      // so each fixture reads as canonical-only there.
      const expected = layout === 'skilled-only' ? EXPECTED_RESULTS.R1 : EXPECTED_RESULTS[rootFixture.id];
      const resolverRoots: PhysicalRoot[] = [
        { rootPath: canonicalRoot, kind: 'canonical' },
        { rootPath: legacyRoot, kind: 'legacy' },
      ];

      for (const roots of [fixture.physicalRoots, resolverRoots]) {
        const collision = classifySpecRootCollision(fixture.relativePacketId, roots);
        expect(collision.klass).toBe(expected.klass);
        expect(collision.decision).toBe(expected.decision);
      }
      expect(fixture.physicalRoots.some((root) => root.rootPath === skilledEntry)).toBe(false);
      expect(resolveSpecFolderCanonical(fixture.relativePacketId, fixture.workspaceDir))
        .toBe(path.join(canonicalRoot, fixture.relativePacketId));
      expectWriteAllowed(fixture.relativePacketId, fixture.workspaceDir);

      if (rootFixture.id === 'R3') {
        const aliasEntry = layout === 'today' ? legacyRoot : skilledEntry;
        expect(fs.realpathSync(aliasEntry)).toBe(fs.realpathSync(canonicalRoot));
      }
      if (rootFixture.id === 'R7') {
        expect(fs.existsSync(legacyRoot)).toBe(false);
      }
      if (layout === 'skilled-only') {
        expect(pathEntryExists(path.join(fixture.workspaceDir, '.opencode'))).toBe(false);
      }
    });
  });
});
~~~~
