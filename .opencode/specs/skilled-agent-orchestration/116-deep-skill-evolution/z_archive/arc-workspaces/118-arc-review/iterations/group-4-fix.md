# Group 4 Fix-Pack — Test Infrastructure

## Summary
4 findings closed: F-010, F-011, F-012, F-013.

## What Was Built
- `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` — added async `spawnCjs(...)`, env-aware `runScript(...)`, and exported `runtimeRoot`.
- `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` — 3 new error-path tests for exit codes 1, 2, and 3.
- `.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts` — 3 new error-path tests for exit codes 1, 2, and 3.
- `.opencode/skills/deep-loop-runtime/tests/integration/query-script.vitest.ts` — 3 new error-path tests for exit codes 1, 2, and 3.
- `.opencode/skills/deep-loop-runtime/tests/integration/status-script.vitest.ts` — 3 new error-path tests for exit codes 1, 2, and 3.
- `.opencode/skills/deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts` — 1 new overlapping-writer lock contention test.
- `.opencode/skills/deep-loop-runtime/tests/unit/spawn-cjs.vitest.ts` — 3 new independent helper tests for smoke, exit-code propagation, and timeout behavior.
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts` — 4 migrated v2 validator assertions replacing TODO fixtures.
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts` — 1 migrated convergence assertion for graphless fallback gate wiring.
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts` — 1 migrated graph assertion for candidate vocabulary edge handling.

New test cases: 22.

## Verification

Targeted vitest sweep:

```text
RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


Test Files  9 passed (9)
     Tests  41 passed (41)
  Start at  22:40:42
  Duration  5.77s (transform 44ms, setup 29ms, import 53ms, tests 5.00s, environment 0ms)
```

OpenCode alignment drift:

```text
[alignment-drift] PASS
Scanned files: 23
Findings: 0
Errors: 0
Warnings: 0
Violations: 0
```

## Commit Handoff

Suggested commit message:

```text
fix(118): Group 4 test infrastructure — F-010/F-011/F-012/F-013

- F-010 [P1] +12 error-path tests across 4 script .vitest.ts files
  (exit codes 1/2/3 per script)
- F-011 [P1] +1 overlapping-writer test in db-open-close.vitest.ts
  using DEEP_LOOP_SCRIPT_LOCK_HOLD_MS env var hook
- F-012 [P2] New tests/unit/spawn-cjs.vitest.ts smoke + exit-code +
  timeout coverage
- F-013 [P2] Migrated real assertions into 3 Phase B fixture tests

Targeted vitest sweep: PASS.

Co-Authored-By: GPT-5.5 via cli-codex (Group 4 deferred-test fix-pack)
```

Files (explicit paths for git add):

```text
.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts
.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts
.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts
.opencode/skills/deep-loop-runtime/tests/integration/query-script.vitest.ts
.opencode/skills/deep-loop-runtime/tests/integration/status-script.vitest.ts
.opencode/skills/deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts
.opencode/skills/deep-loop-runtime/tests/unit/spawn-cjs.vitest.ts
.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts
.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts
.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts
.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/iterations/group-4-fix.md
```
