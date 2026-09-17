## Edit 1

File: `.opencode/bin/compiled-routing-foundation.vitest.ts`

OLD:

~~~~text
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
~~~~

NEW:

~~~~text
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
~~~~

## Edit 2

File: `.opencode/bin/compiled-routing-foundation.vitest.ts`

OLD:

~~~~text
      rmSync(empty, { recursive: true, force: true });
    }
  });
});
~~~~

NEW:

~~~~text
      rmSync(empty, { recursive: true, force: true });
    }
  });

  // Permission bits hide a file from every user but root, so the row skips under root.
  it.skipIf(process.getuid?.() === 0)('exits 2 when a scanned file cannot be read, even beside a readable one', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-spec-import-unreadable-'));
    try {
      const hidden = join(root, 'hidden-spec-import.cjs');
      writeFileSync(join(root, 'clean-runtime.cjs'), 'module.exports = 1;\n');
      writeFileSync(hidden, "require('../../specs/seeded/target.cjs');\n");
      chmodSync(hidden, 0o000);

      const result = spawnSync(process.execPath, [GUARD, root], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('hidden-spec-import.cjs');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
~~~~
