# T014 verification evidence (orchestrator-run, worktree 015)

## RED-before (naive whole-predicate filter->reject adoption)
 FAIL  tests/unit/deep-review-rollback-gate.vitest.ts > rollback window > requires both minimums and excludes incomplete or abstained executions
 FAIL  tests/unit/deep-review-rollback-gate.vitest.ts > rollback window > does not count execution rows without matching authenticated evidence
 FAIL  tests/unit/deep-review-rollback-gate.vitest.ts > independent parity authentication > does not adopt the authenticated parity handoff exit status as authority
 Test Files  1 failed (1)
      Tests  3 failed | 81 passed (84)

## Negative control — new tests against UNFIXED lib (review)
 FAIL  tests/unit/deep-review-rollback-gate.vitest.ts > rollback window > rejects the evidence set when a rollback row violates its declared type
 FAIL  tests/unit/deep-review-rollback-gate.vitest.ts > rollback window > rejects an out-of-contract result while still counting legitimate unsuccessful rows
 Test Files  1 failed (1)
      Tests  2 failed | 32 passed | 52 skipped (86)

## Negative control — new tests against UNFIXED lib (research)
 FAIL  tests/unit/deep-research-rollback-gate.vitest.ts > rollback window > rejects the evidence set when a rollback row violates its declared type
 FAIL  tests/unit/deep-research-rollback-gate.vitest.ts > rollback window > rejects an out-of-contract result while still counting legitimate unsuccessful rows
 Test Files  1 failed (1)
      Tests  2 failed | 30 passed | 49 skipped (81)

## GREEN-after — review suite (84 original + 2 new)
 Test Files  1 passed (1)
      Tests  86 passed (86)
   Duration  58.31s (transform 732ms, setup 0ms, import 941ms, tests 57.24s, environment 0ms)

## tsc --noEmit
exit 0 (project TS 5.9.3 at system-spec-kit/node_modules/.bin/tsc)

## GREEN-after — research suite (79 original + 2 new)
 Test Files  1 passed (1)
      Tests  81 passed (81)
   Duration  946.28s (transform 575ms, setup 0ms, import 729ms, tests 945.45s, environment 0ms)
