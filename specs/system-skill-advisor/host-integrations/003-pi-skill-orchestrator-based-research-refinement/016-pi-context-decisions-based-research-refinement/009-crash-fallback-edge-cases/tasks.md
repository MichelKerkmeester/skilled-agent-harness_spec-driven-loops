---
title: "Tasks: Crash-Fallback Edge Cases"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "crash fallback edge cases tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Crash-Fallback Edge Cases

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

`A` is `.skilled/skills/system-skill-advisor/`. `ENV` is `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`. Run every command from the repository root unless it says `from A/runtime/`.

- `FILE` is `npx vitest run tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, run from `A/runtime/`.
- `HOOKS` is `npx vitest run tests/hooks tests/parity`, run from `A/runtime/`.
- The eight tests and their names, the two helper names and the literal doc sentences are fixed in `plan.md` section 3. Every brief pastes them from there.

Luna leaves are T003 to T008 and T010 to T012, one change per brief, following `../delegation-strategy.md`. Every other task is the conductor's. Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Conductor: re-read the handler, its catch and both doc lines before editing (`A/hooks/claude/user-prompt-submit.ts`, `ENV`, `A/hooks/skill-advisor-hook.md`). Verify: `sed -n 313,317p A/hooks/claude/user-prompt-submit.ts` shows `const startedAt` and `const elapsed` before `try {`. `sed -n 469,492p` on the same file shows the catch with `renderAdvisorTimeoutFallback()` on `:486`. `rg -n "unless \`confidenceOnly\`" ENV` prints line 382, and `rg -n 'exception escapes' A/hooks/skill-advisor-hook.md` prints line 57. A shifted line halts the phase until the briefs are updated. Evidence: All anchors matched: `const startedAt` at `:313`, the catch at `:469` with `renderAdvisorTimeoutFallback()`, `ENV:382`, `skill-advisor-hook.md:57`.
- [x] T002 Conductor: record the baselines (`A/runtime/tests/`). Verify: `FILE` exits 0, and `HOOKS` exits 0 with its pass count. `tests/hooks` alone held 171 of 171 on 2026-11-18. Evidence: Measured on the HEAD copy of the test file, restored after: `FILE` 41/41, `HOOKS` 19 files 235/235.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Luna leaf: add the fifth `renderBrief` parameter to `runHookWithStore`, then tests 1 and 2, for setup wording and the skipped prompt (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` fails on exactly these two tests, and every existing test still passes. Evidence: Written with T004 to T006 in one leaf from one literal block; the combined red set is checked in T009.
- [x] T004 Luna leaf: add tests 3, 4 and 5, for directive dedup, the deferred receipt and the throwing store (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` fails on tests 1 to 4, and test 5 passes. Evidence: Test 5 passed throughout; tests 3 and 4 red.
- [x] T005 Luna leaf: add test 6, the policy observation under `pi` (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` also fails on test 6, with the crash record count at 0. Evidence: Test 6 red with `expected 0 to be greater than 0`.
- [x] T006 Luna leaf: add tests 7 and 8, the throwing clock (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` fails on exactly seven tests, numbers 1 to 4 and 6 to 8. The existing tests and test 5 pass. Evidence: `FILE` 7 failed and 42 passed: tests 1 to 4 and 6 to 8.
- [x] T007 [P] Luna leaf: replace the `confidenceOnly` sentence on line 382 with the literal text from `plan.md` section 3 (`ENV`). Verify: `rg -n "unless \`confidenceOnly\`" ENV` prints nothing. `rg -n 'skips only the uncertainty check' ENV` and `rg -n 'daemon starts' ENV` each print line 382. `git diff --numstat -- ENV` prints 1 added and 1 deleted line. Evidence: `unless` gone; `skips only the uncertainty check` and `daemon starts` both on line 382; numstat `1 1`.
- [x] T008 [P] Luna leaf: replace the last sentence of line 57 with the literal text from `plan.md` section 3 (`A/hooks/skill-advisor-hook.md`). Verify: `rg -n 'exception escapes' A/hooks/skill-advisor-hook.md` prints nothing. `rg -n 'outage fallback' A/hooks/skill-advisor-hook.md` prints line 57 alone. `git diff --numstat` on the file prints 1 added and 1 deleted line. Evidence: `exception escapes` gone; `outage fallback` on line 57 alone; numstat `1 1`.
- [x] T009 Conductor: confirm each red fails for its own reason (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: test 1 shows an outage head without `/doctor:setup`. Test 2 shows `Advisor: outage (fail_open)` where `Advisor: prompt skipped.` was expected. Tests 3 and 4 show the `Directives:` block on the repeat turn. Test 6 shows 0 records. Tests 7 and 8 show a rejection with `clock`. Test 5 passes. Evidence: Test 1 lost `/doctor:setup`; test 2 got the outage head for `Advisor: prompt skipped.`; tests 3 and 4 kept `Directives:` on the repeat; test 6 counted 0; tests 7 and 8 rejected with `Error: clock`; test 5 passed.
- [x] T010 Luna leaf: move the dedup block (`:396-432`) into `applyDirectiveLifecycle` and the delivery block (`:448-467`) into `finishAdvisorDelivery`, and call both from the normal path, with no behavior change. Update the moved comment as `plan.md` says (`A/hooks/claude/user-prompt-submit.ts`). Verify: `FILE` fails on the same seven tests as T009 and on nothing else, and `npm --prefix A/runtime run typecheck` exits 0. Evidence: Same seven red, typecheck exit 0; the leaf found no behavior change.
- [x] T011 Luna leaf: hoist `prompt`, `workspaceRoot`, `skippedResult` and `deliveryState` and replace `:313-314` with the guarded `elapsed`. Read the clock after the invalid-payload return (`A/hooks/claude/user-prompt-submit.ts`). Verify: tests 7 and 8 pass and `FILE` fails on exactly tests 1 to 4 and 6. The typecheck exits 0. Evidence: Tests 7 and 8 pass, `FILE` 5 failed (1 to 4 and 6), typecheck exit 0.
- [x] T012 Luna leaf: rewrite the catch to the literal text in `plan.md` section 3 (`A/hooks/claude/user-prompt-submit.ts`). Verify: `FILE` exits 0, and `rg -n 'renderAdvisorTimeoutFallback\(\)' A/hooks/claude/user-prompt-submit.ts` prints nothing. Evidence: `FILE` 49/49; `rg` printed nothing.
- [x] T020 Guard the catch's diagnostic call, added at build after the T012 leaf reported that `process.cwd()` in its arguments runs outside any try (`A/hooks/claude/user-prompt-submit.ts`, `A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: the test `returns the outage fallback when the clock and the working directory both throw` fails before the guard and passes after. Evidence: red with `Error: cwd`, 1 failed and 49 passed; green 50/50; typecheck exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Conductor: run the typecheck and the build (`A/runtime/`). Verify: `npm --prefix A/runtime run typecheck` exits 0, then `npm --prefix A/runtime run build` exits 0. Evidence: Typecheck and build exit 0.
- [x] T014 Conductor: run the hook and parity suites (`A/runtime/tests/`). Verify: `HOOKS` exits 0, with a pass count 8 above the T002 count. Evidence: `HOOKS` 19 files 244/244, the baseline 235 plus the 9 tests this phase added (8 planned, 1 from T020).
- [x] T015 Conductor: rerun the planning probe on the new build (`scratch/probe.mjs`). Verify: from `A/runtime/`, `node <this folder>/scratch/probe.mjs "$PWD/dist"` prints the setup hint on `(a)`, `Advisor: prompt skipped.` on `(b)`, `directives=false` on `(c) turn 2`, a crash record count equal to the timeout-path count on `(d)` and `(e) resolved` with the outage head. Evidence: `(a)` keeps the `/doctor:setup` hint, `(b)` prints `Advisor: prompt skipped.`, `(c) turn 2 directives=false`, `(d)` 2 crash records against 2, `(e) resolved` with the outage head.
- [x] T016 Conductor: confirm the diff holds only the four planned files (`git`). Verify: `git diff --stat -- A/hooks A/runtime/tests/hooks ENV` lists `user-prompt-submit.ts`, `skill-advisor-hook.md`, `claude-user-prompt-submit-hook.vitest.ts` and `ENV-REFERENCE.md` and nothing else. Evidence: The four planned files and nothing else.
- [x] T017 Conductor: check comment hygiene in the changed code (`A/hooks/`, `A/runtime/tests/hooks/`). Verify: `git diff -U0 -- A/hooks/claude A/runtime/tests/hooks | rg -n '^\+.*(R2|N1|016-|phase 0|finding)'` prints nothing and exits 1. Evidence: Printed nothing, exit 1.
- [x] T018 Conductor: read the catch once more against SC-002 (`A/hooks/claude/user-prompt-submit.ts`). Verify: in `sed -n` over the new catch, every call outside the nested try is `emitDiagnostic` and its arguments name only hoisted values and `elapsed()`. The innermost catch returns `{}`. Evidence: Outside the nested render try the catch calls only `emitDiagnostic`, now inside its own try; the innermost catch returns `{}`.
- [x] T019 Conductor: record the files, every red reason, the test counts, the probe output and the 004 amendment (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: Summary written; strict validation passed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `HOOKS` exits 0 with the eight new tests, and the doc checks in T007 and T008 print what they say
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source findings**: `tmp/p004-briefs/last-refute.txt` at the repository root
- **Amended decision**: `../004-crash-path-fallback/implementation-summary.md:80`
<!-- /ANCHOR:cross-refs -->

---
