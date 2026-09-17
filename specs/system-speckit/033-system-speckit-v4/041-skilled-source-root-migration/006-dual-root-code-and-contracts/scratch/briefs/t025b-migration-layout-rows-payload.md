## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration.vitest.ts`

OLD:

~~~~text
import { afterEach, describe, expect, it } from 'vitest';

import {
~~~~

NEW:

~~~~text
import { afterEach, describe, expect, it } from 'vitest';

import { materializeRootFixture, R_FIXTURES } from '../core/spec-root-fixtures.js';
import {
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration.vitest.ts`

OLD:

~~~~text
} from '../core/spec-root-migration.js';

const tempDirectories: string[] = [];
~~~~

NEW:

~~~~text
} from '../core/spec-root-migration.js';

import type { MaterializedRootFixture, SourceRootLayout } from '../core/spec-root-fixtures.js';

const tempDirectories: string[] = [];
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-migration.vitest.ts`

OLD:

~~~~text
      .toBe('# Divergent legacy packet\n');
    expect(fs.existsSync(fixture.quarantinePath)).toBe(false);
  });
});
~~~~

NEW:

~~~~text
      .toBe('# Divergent legacy packet\n');
    expect(fs.existsSync(fixture.quarantinePath)).toBe(false);
  });
});

// A legacy-only packet is written inside the source tree, so a link from .opencode to
// .skilled reaches it through the legacy spelling and it migrates as today. With no
// .opencode path, .skilled/specs is no legacy root, and the packet stays where it is.
describe('migrateLegacyOnlyToCanonical under each source-root layout', () => {
  function materializeLegacyOnly(layout: SourceRootLayout): MaterializedRootFixture {
    const rootFixture = R_FIXTURES.find((candidate) => candidate.id === 'R2');
    if (!rootFixture) throw new Error('missing root fixture R2');
    const fixture = materializeRootFixture(rootFixture, layout);
    tempDirectories.push(fixture.tempDir);
    return fixture;
  }

  it.each(['today', 'whole-link'] as const)('%s: moves a legacy-only packet reached through .opencode/specs', (layout) => {
    const fixture = materializeLegacyOnly(layout);

    const result = migrateLegacyOnlyToCanonical(fixture.workspaceDir, {
      quarantinePath: path.join(fixture.tempDir, 'quarantine'),
    });

    expect(result).toEqual({
      moved: [fixture.relativePacketId],
      quarantined: [fixture.relativePacketId],
      deferredDivergent: [],
    });
    expect(fs.existsSync(path.join(fixture.workspaceDir, 'specs', fixture.relativePacketId, 'spec.md'))).toBe(true);
  });

  it('skilled-only: leaves a packet under .skilled/specs in place', () => {
    const fixture = materializeLegacyOnly('skilled-only');

    const result = migrateLegacyOnlyToCanonical(fixture.workspaceDir, {
      quarantinePath: path.join(fixture.tempDir, 'quarantine'),
    });

    expect(result).toEqual({ moved: [], quarantined: [], deferredDivergent: [] });
    expect(fs.existsSync(path.join(fixture.workspaceDir, '.skilled', 'specs', fixture.relativePacketId, 'spec.md'))).toBe(true);
    expect(fs.existsSync(path.join(fixture.workspaceDir, 'specs', fixture.relativePacketId))).toBe(false);
  });
});
~~~~
