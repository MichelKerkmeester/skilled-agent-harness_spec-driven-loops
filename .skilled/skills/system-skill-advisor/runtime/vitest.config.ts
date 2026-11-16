// ───────────────────────────────────────────────────────────────
// MODULE: System Skill Advisor Vitest Config
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// The advisor keeps its durable health records under the system temp folder, where
// its health readers take every record as real use. A suite run gets a temp folder
// of its own, set before any worker starts so tests and the processes they spawn
// inherit it. POSIX reads TMPDIR and Windows reads TEMP then TMP, so all three point
// at it. The run removes it when node exits normally. A run killed by a signal runs
// no exit handler and leaves the folder under the system temp folder. A folder that
// cannot be made throws here, so no run falls back to the shared folder unnoticed.
const RUN_TMPDIR = mkdtempSync(path.join(tmpdir(), 'sav-'));
process.env.TMPDIR = RUN_TMPDIR;
process.env.TEMP = RUN_TMPDIR;
process.env.TMP = RUN_TMPDIR;
process.on('exit', () => {
  rmSync(RUN_TMPDIR, { recursive: true, force: true });
});

// A dispatched worker carries AI_SESSION_CHILD=1, and the brief renderer reads it
// when a caller names no child state, so an inherited flag would change what the
// tests expect. Each test that needs a child session sets the flag itself.
delete process.env.AI_SESSION_CHILD;

const TEST_TIMEOUT_MS = 30_000;
const TEARDOWN_TIMEOUT_MS = 1_000;
const INCLUDE_BENCHES = process.env.SPECKIT_RUN_BENCHES === 'true';
// The stress suites are excluded from the default run because they are slow, not
// because they are unwanted. Without a way to opt in they were unreachable: no
// script and no pattern selected them, so 21 files sat in the tree running never.
// Opting in REPLACES the default set rather than adding to it: these suites churn
// the daemon, its socket and its lease, and running them beside the ordinary
// suites fails a handful of those on shared state rather than on their own logic.
const INCLUDE_STRESS = process.env.SPECKIT_RUN_STRESS === 'true';

// A plain object export instead of vitest's defineConfig wrapper: the config is
// loaded by node's own module graph, where a bare `vitest` import resolves to
// whatever node_modules sits next to this file. CI's routing job runs the suites
// under a vitest pinned through npx, which can differ from the runtime's own
// vitest range, so importing from the package here could load a second vitest
// copy. defineConfig is an identity type-helper; dropping it changes nothing at
// runtime.
export default ({
  root: import.meta.dirname,
  test: {
    include: [
      ...(INCLUDE_STRESS ? ['stress-test/**/*.vitest.ts'] : ['tests/**/*.vitest.ts']),
      ...(INCLUDE_BENCHES ? ['bench/**/*.bench.ts'] : []),
    ],
    exclude: [
      'node_modules',
      'dist',
      ...(INCLUDE_BENCHES ? [] : ['bench/**/*.bench.ts']),
    ],
    setupFiles: [
      path.resolve(import.meta.dirname, '../../system-spec-kit/runtime/tests/_support/vitest-setup.ts'),
    ],
    fileParallelism: false,
    globals: true,
    environment: 'node',
    testTimeout: TEST_TIMEOUT_MS,
    teardownTimeout: TEARDOWN_TIMEOUT_MS,
    alias: {
      '@lib': path.resolve(import.meta.dirname, 'lib'),
    },
  },
});
