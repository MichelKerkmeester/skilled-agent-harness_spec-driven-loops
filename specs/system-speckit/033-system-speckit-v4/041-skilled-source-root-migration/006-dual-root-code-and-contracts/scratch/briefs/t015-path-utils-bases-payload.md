## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts`

OLD:

~~~~text
import { structuredLog } from './logger.js';

// ───────────────────────────────────────────────────────────────────
~~~~

NEW:

~~~~text
import { structuredLog } from './logger.js';
import { SOURCE_ROOT_NAMES } from '@spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

// ───────────────────────────────────────────────────────────────────
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts`

OLD:

~~~~text
  }

  const bases: string[] = allowedBases || [
    process.cwd(),
    path.join(process.cwd(), 'specs'),
    path.join(process.cwd(), '.opencode')
  ];
~~~~

NEW:

~~~~text
  }

  // A consumer may link either source-root name to a tree outside its working directory,
  // and a path inside that tree is admitted only by the base named after the link.
  const bases: string[] = allowedBases || [
    process.cwd(),
    path.join(process.cwd(), 'specs'),
    ...SOURCE_ROOT_NAMES.map((name: string) => path.join(process.cwd(), name))
  ];
~~~~
