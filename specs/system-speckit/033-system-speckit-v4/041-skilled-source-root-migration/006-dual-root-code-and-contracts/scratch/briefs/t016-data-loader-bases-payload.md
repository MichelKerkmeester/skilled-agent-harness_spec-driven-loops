## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/loaders/data-loader.ts`

OLD:

~~~~text
import { structuredLog, sanitizePath } from '../utils/index.js';

import {
~~~~

NEW:

~~~~text
import { structuredLog, sanitizePath } from '../utils/index.js';
import { SOURCE_ROOT_NAMES } from '@spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

import {
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/loaders/data-loader.ts`

OLD:

~~~~text
      path.join(process.cwd(), 'specs'),
      path.join(process.cwd(), '.opencode'),
      ...(specsDirOverride ? [path.resolve(process.cwd(), specsDirOverride)] : [])
~~~~

NEW:

~~~~text
      path.join(process.cwd(), 'specs'),
      ...SOURCE_ROOT_NAMES.map((name: string) => path.join(process.cwd(), name)),
      ...(specsDirOverride ? [path.resolve(process.cwd(), specsDirOverride)] : [])
~~~~
