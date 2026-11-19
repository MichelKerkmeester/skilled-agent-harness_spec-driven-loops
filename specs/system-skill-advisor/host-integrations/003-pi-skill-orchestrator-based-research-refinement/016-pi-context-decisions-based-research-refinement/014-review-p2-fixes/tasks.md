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

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-ups

Reopened 2026-11-19. `D` is `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` and `V` is `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`.

- [ ] T021 Add a red DSH test: a turn whose notice is never appended leaves no route receipt, and a delivered turn leaves one (`hooks/tests/dsh-prompt-advisor.test.mjs`). Verify: the first case fails before T022.
- [ ] T022 Make `D` ask the handler to defer its receipts and commit them after the notice is appended (`D`). Verify: T021 passes and the existing DSH tests pass.
- [ ] T023 Add a red Vibe test: a turn that returns no brief leaves no route receipt, and a delivered turn leaves one (`runtime/tests/hooks/vibe-prompt-advisor.vitest.ts`). Verify: the first case fails before T024.
- [ ] T024 Make `V` defer its receipts and commit them only when it returns a brief (`V`). Verify: T023 passes and the existing Vibe tests pass.
- [ ] T025 Add a red Python case: a floored native row keeps `confidenceFloored` and an earned row gets none (`runtime/tests/python/test_skill_advisor.py`). Verify: it fails before T026.
- [ ] T026 Copy `confidenceFloored` in `_legacy_recommendations_from_native` when it is `True` (`runtime/scripts/skill_advisor.py`). Verify: T025 passes and `PY` prints `fail=0`.
- [ ] T027 Add a red launcher test for both threshold variables in `createChildEnv` (`.skilled/bin/`). Verify: it fails before T028.
- [ ] T028 Add `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` and `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` to `CHILD_ENV_ALLOWLIST` (`.skilled/bin/system-skill-advisor-launcher.cjs`). Verify: T027 passes.
- [ ] T029 Apply the 15 doc-run and 2 skilled-run literal fixes with `apply-fixes.cjs`, leaving out D-01, which T009 already fixed. Verify: `applied.json` lists 17 applied and 0 skipped, and each diff hunk matches its finding.
- [ ] T030 Write the remaining doc fixes: B-01, B-02, B-03, B-04, C-02, C-03, C-04 with BAT-01, X-01, L3-2, L2-3 and L4-1. Verify: each finding id has a row in `implementation-summary.md` naming the changed line.
- [ ] T031 Recheck N5 and X-02, and fix what the recheck shows. Verify: the summary records the recheck result.
- [ ] T032 Add the merged features' names to the skill's routing metadata (D-02). Verify: probes P01, P03 and P04 route to `system-skill-advisor`, and P02 and P05 route to it or to `sk-code`.
- [ ] T033 Recapture both routing corpus pins (A1). Verify: the routing-accuracy corpus gate exits 0.
- [ ] T034 Bump `SKILL.md` to 1.1.1.0, add `changelog/v1.1.1.0.md` and append the advisor work to the v4.1.0.0 Skill Advisor section (C-06, C-07). Verify: the version line and both entries exist.
- [ ] T035 Rebuild and run every suite: `VT`, `PY`, the DSH test, the Vibe test, the launcher test and the corpus gate. Verify: each exits 0.
- [ ] T036 Record each follow-up with its evidence (`implementation-summary.md`). Verify: every 015 and 016 finding id appears in it.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: T018 and T019 printed the expected lines
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source findings**: `../review/review-report.md` section 3
<!-- /ANCHOR:cross-refs -->

---
