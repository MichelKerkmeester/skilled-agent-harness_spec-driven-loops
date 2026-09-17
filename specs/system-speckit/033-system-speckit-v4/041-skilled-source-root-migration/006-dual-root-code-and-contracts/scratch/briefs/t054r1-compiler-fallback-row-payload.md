## Edit 1

File: `.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`

OLD:

~~~~text
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
~~~~

NEW:

~~~~text
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
~~~~

## Edit 2

File: `.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts`

OLD:

~~~~text
  });
});
~~~~

NEW:

~~~~text
  });

  // A checkout that holds its tree only under .skilled has no .opencode path, so an output
  // directory missing under both names must resolve under the compiler's own tree.
  it('resolves a missing compiled directory under the tree the compiler runs from', () => {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'compile-contracts-skilled-only-')));
    try {
      const scripts = join(root, '.skilled', 'skills', 'system-deep-loop', 'runtime', 'scripts');
      mkdirSync(scripts, { recursive: true });
      copyFileSync(require.resolve('../../scripts/compile-command-contracts.cjs'), join(scripts, 'compile-command-contracts.cjs'));
      const copied = require(join(scripts, 'compile-command-contracts.cjs')) as typeof compiler;

      expect(copied.outputPathFor('deep/review')).toBe(
        join(root, '.skilled', 'commands', 'deep', 'assets', 'compiled', 'deep-review.contract.md'),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
~~~~
