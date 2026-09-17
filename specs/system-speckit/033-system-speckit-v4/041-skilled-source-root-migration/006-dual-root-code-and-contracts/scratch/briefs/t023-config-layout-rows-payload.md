## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-config-precedence.vitest.ts`

OLD:

~~~~text
} from '../core/config.js';

const originalProjectRoot = CONFIG.PROJECT_ROOT;
~~~~

NEW:

~~~~text
} from '../core/config.js';
import { materializeRootFixture, R_FIXTURES } from '../core/spec-root-fixtures.js';

import type { SourceRootLayout } from '../core/spec-root-fixtures.js';

const originalProjectRoot = CONFIG.PROJECT_ROOT;
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-config-precedence.vitest.ts`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
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
~~~~
