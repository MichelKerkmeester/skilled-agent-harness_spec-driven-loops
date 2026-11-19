---
title: "Tasks: Review P2 Fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review p2 fixes tasks"
  - "linear task marker tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Review P2 Fixes

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

`R` is `.skilled/skills/system-skill-advisor/runtime`. `H` is `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`. `VT` is the SC-002 vitest command in `spec.md`, run from `R`. `PY` is `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 python3 $R/tests/python/test_skill_advisor.py`, run from the repo root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline on the build branch (`$R/tests`). Verify: `VT` exits 0 with 488 passed and 1 skipped, and `PY` exits 0 with `Summary: pass=117, fail=0`.
- [x] T002 Rebuild the runtime so the dist hook matches source (`$R/dist`). Verify: `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add a red timing test on the 64K space-and-newline run, plus a leading-whitespace and a `\r\n` marker case (`$R/tests/legacy/advisor-prompt-policy.vitest.ts`). Verify: the timing test fails on main, at about 1.5 s against a 50 ms ceiling.
- [x] T004 Make `TASK_MARKER` linear as `(?:^|[.!?\n][^\S\n]*)(?:now|task)\s*:\s*` (`$R/lib/prompt-policy.ts`). Verify: T003 passes and all 24 fixture rows pass.
- [x] T005 Add the same timing check and cases to the Python harness, then make `_TASK_MARKER` linear with `_JS_SPACE_CHARS` minus `\n` (`$R/scripts/skill_advisor.py`, `$R/tests/python/test_skill_advisor.py`). Verify: the new check fails before the regex change, and after it `PY` prints `fail=0` with the new check passing under 500 ms.
- [x] T006 Add a red hook test: a pasted reply over 64 KiB, then `Now: Refactor the session store module` (`$R/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: on main the CLI brief builder receives text without the task line.
- [x] T007 Strip before the 64 KiB cut (`H`). Verify: T006 passes, and a prompt over 64 KiB with no pasted reply is cut exactly as before.
- [x] T008 Add red tests for `Claude replied: I used sk-doc to update the README. Now: thanks` through the hook and through `buildSkillAdvisorBrief`, plus a plain task naming `sk-doc` that must still fire (`$R/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, `$R/tests/legacy/advisor-brief-producer.vitest.ts`). Verify: both paste cases fire on main.
- [x] T009 Strip the prompt inside `skippedAdvisorResultFor` before it calls `shouldFireAdvisor`, the one fire decision both call sites share (`$R/lib/skill-advisor-brief.ts`). Verify: T008 passes, and `shouldFireAdvisor` is unchanged in `git diff -- $R/lib/prompt-policy.ts` apart from the T004 marker.
- [x] T010 Add a red test: a passing earned route with a failing stream, then a working one (`$R/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: on main the failed write still leaves a route receipt.
- [x] T011 Write the route receipt inside the deferred delivery commit, and at once when no commit is deferred (`H`). Verify: T010 passes, and the existing route-receipt block in the hook test passes.
- [x] T012 Add a red parser test with `"confidenceFloored": true` in the child's stdout and one without it (`$R/tests/subprocess-output-cap.vitest.ts`). Verify: on main the flag is missing from the result.
- [x] T013 Copy `confidenceFloored` in `parseRecommendations` when it is `true` (`$R/lib/subprocess.ts`). Verify: T012 passes.
- [x] T014 Add a red test: a held receipt and a floored weak follow-up on a turn with `lifecycle_event: 'compact'` (`$R/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: on main the turn is suppressed.
- [x] T015 Skip the receipt guard when `lifecycleEventFor(input)` names a boundary (`H`). Verify: T014 passes, and the same turn without the field is still suppressed.
- [x] T016 Remove the unreachable `{ effectiveEmitted: emitted }` arm of the crash catch (`H`). Verify: `rg -n ': \{ effectiveEmitted: emitted \};' H` prints nothing, the one `return { effectiveEmitted: emitted };` left is `applyDirectiveLifecycle`'s own fallback, and the crash-fallback tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Rebuild and run both suites (`$R`). Verify: the build exits 0, `VT` exits 0 with at least 488 passes plus the new tests, and `PY` exits 0 with `fail=0` and at least 117 passes.
- [x] T018 Rerun the measured-behavior commands from `spec.md` (`$R/dist/runtime/lib/prompt-policy.js`). Verify: TypeScript under 50 ms, Python under 500 ms, `two markers` still `"commit it"`, and the built `skippedAdvisorResultFor` returns `skipped` for the `sk-doc` paste and `null` for `Update the README with sk-doc conventions`.
- [x] T019 Check the parent goal's first criterion after the rebuild (`.skilled/bin/skill-advisor.cjs`). Verify: the pasted README prompt lists `sk-code` first.
- [x] T020 Record R1-P2-004 as accepted with fixture row `two-markers-in-user-task`, and each fix with its evidence (`implementation-summary.md`). Verify: `rg -n 'R1-P2-004' implementation-summary.md` prints one line naming the row.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: T018 and T019 printed the expected lines
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source findings**: `../review/review-report.md` section 3
<!-- /ANCHOR:cross-refs -->

---
