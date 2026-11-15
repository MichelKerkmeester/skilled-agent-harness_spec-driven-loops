---
title: "Tasks: Phase 2: history-core-relocation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "history core relocation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: history-core-relocation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Paths**: `R` is `.skilled/skills/system-spec-kit/runtime`. `H` is `.skilled/hooks/session-relaunch`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline test count (`R/tests/history-*.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts` prints `Test Files 13 passed (13)` and `Tests 191 passed (191)`.
- [ ] T002 Confirm the compiled CLI exists (`R/dist/hooks/lib/history/cli.js`). Verify: `ls .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js` prints the path.
- [ ] T003 List the CLI-path occurrences (`R/hooks/lib/history/lookup-offer.ts`, `R/tests/_support/history-fixtures.ts`, `R/tests/history-projection.vitest.ts`, `R/tests/history-locator-adapters.vitest.ts`, `R/tests/hook-session-start.vitest.ts`). Verify: `rg -n "runtime/dist/hooks/lib/history/cli\.js" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts .skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts .skilled/skills/system-spec-kit/runtime/tests/history-projection.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` prints 8 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the concern entry (`H/bin/history-lookup.mjs`). Verify: `node .skilled/hooks/session-relaunch/bin/history-lookup.mjs` prints `{"ok":false,"code":"invalid_usage"}` and exits 2.
- [ ] T005 Change the printed command constant (`R/hooks/lib/history/lookup-offer.ts`). Verify: `rg -n "HISTORY_LOOKUP_COMMAND =" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` prints `node .skilled/hooks/session-relaunch/bin/history-lookup.mjs`.
- [ ] T006 Make `lookupRunsFrom` prove the entry and the compiled core (`R/hooks/lib/history/lookup-offer.ts`). Verify: `rg -n "HISTORY_LOOKUP_CORE_PATH" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` prints at least one line.
- [ ] T007 Create both placeholders in the fixture (`R/tests/_support/history-fixtures.ts`). Verify: `rg -n "history-lookup\.mjs" .skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts` prints one line.
- [ ] T008 Change the CLI-path assertions in the three test files (`R/tests/history-projection.vitest.ts`, `R/tests/history-locator-adapters.vitest.ts`, `R/tests/hook-session-start.vitest.ts`). Verify: `rg -n "history-lookup\.mjs" .skilled/skills/system-spec-kit/runtime/tests/history-projection.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` prints 6 lines.
- [ ] T009 Add the entry test, including the withheld-core case (`H/tests/history-lookup-entry.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/history-lookup-entry.test.cjs` exits 0.
- [ ] T010 Update the core README CLI section (`R/hooks/lib/history/README.md`). Verify: `rg -n "history-lookup\.mjs" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` prints one line.
- [ ] T011 Update the concern README and the bin README (`H/README.md`, `H/bin/README.md`). Verify: `rg -n "history-lookup\.mjs" .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/bin/README.md` prints two lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Rerun the history suites at the baseline count (`R/tests/history-*.vitest.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts` prints `Test Files 13 passed (13)` and `Tests 191 passed (191)`.
- [ ] T013 Run the concern suite (`H/tests/*.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [ ] T014 Typecheck the runtime (`R/tsconfig.json`). Verify: `cd .skilled/skills/system-spec-kit/runtime && npx tsc --noEmit -p tsconfig.json` exits 0.
- [ ] T015 Confirm the importer count is unchanged (`R/hooks`, `R/tests`, `.opencode/plugins`). Verify: `rg -l "lib/history" .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/runtime/tests .opencode/plugins --glob '!**/dist/**' | wc -l` prints 24.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts` prints `Test Files 13 passed (13)` and `Tests 191 passed (191)`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
