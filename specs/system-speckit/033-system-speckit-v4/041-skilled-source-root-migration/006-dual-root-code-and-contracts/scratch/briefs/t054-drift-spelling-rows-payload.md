## Edit 1

File: `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`

OLD:

~~~~text
import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type DriftClass =
~~~~

NEW:

~~~~text
import { createRequire } from 'node:module';
import { sep } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const fs = require('node:fs') as typeof import('node:fs');

type DriftClass =
~~~~

## Edit 2

File: `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`

OLD:

~~~~text
  checkContracts: (options?: { commands?: string[] }) => { failures: Drift[]; warnings: Drift[] };
};
~~~~

NEW:

~~~~text
  checkContracts: (options?: { commands?: string[] }) => { failures: Drift[]; warnings: Drift[] };
  deriveAuthoritySources: (command: string) => string[];
};
~~~~

## Edit 3

File: `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`

OLD:

~~~~text
  }

  it('passes against the real current compiled contracts', () => {
~~~~

NEW:

~~~~text
  }

  // The source tree may sit under .skilled or .opencode, with one name linked to the other,
  // so recorded and referenced sources must compare the same whichever name they spell.
  it('accepts recorded source digests spelled under .skilled on a tree that holds them under .opencode', () => {
    const contract = withHeader(realContract(), (header) => {
      for (const digest of header.sourceDigests) digest.path = digest.path.replace(/^\.opencode\//, '.skilled/');
    });

    const result = checkMutated(contract);

    expect(classes(result)).not.toContain(checker.DRIFT_CLASSES.STALE_SOURCE_DIGEST);
    expect(classes(result)).not.toContain(checker.DRIFT_CLASSES.ENUMERATED_SOURCE_GAP);
  });

  it('derives the same authority sources when the command documents name .skilled paths', () => {
    const baseline = checker.deriveAuthoritySources(COMMAND);
    const realReadFileSync = fs.readFileSync;
    const commandDocuments = `${sep}commands${sep}deep${sep}`;
    const spy = vi.spyOn(fs, 'readFileSync').mockImplementation(((file: unknown, options?: unknown) => {
      const content = (realReadFileSync as (file: unknown, options?: unknown) => string | Buffer)(file, options);
      if (typeof file === 'string' && file.includes(commandDocuments) && typeof content === 'string') {
        return content.replaceAll('.opencode/', '.skilled/');
      }
      return content;
    }) as typeof fs.readFileSync);

    try {
      expect(checker.deriveAuthoritySources(COMMAND)).toEqual(baseline);
    } finally {
      spy.mockRestore();
    }
  });

  it('passes against the real current compiled contracts', () => {
~~~~
