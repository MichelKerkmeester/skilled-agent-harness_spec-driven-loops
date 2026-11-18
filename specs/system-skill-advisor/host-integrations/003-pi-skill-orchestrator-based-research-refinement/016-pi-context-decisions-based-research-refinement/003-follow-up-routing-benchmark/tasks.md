---
title: "Tasks: Follow-Up Routing Benchmark with Floor Counter"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "follow-up routing benchmark tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Follow-Up Routing Benchmark with Floor Counter

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

`A` is `.skilled/skills/system-skill-advisor/runtime/`. `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts`, run from `A`.

Tasks T009 to T014 run only when T008 records a ship decision. On any other decision they are marked `[x]` with the note "not built, rule said no guard".

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 002 and 004 are done, since this phase builds after both (`../002-pasted-context-stripping/tasks.md`, `../004-crash-path-fallback/tasks.md`). Verify: `grep -c '^- \[ \] T[0-9]' ../002-pasted-context-stripping/tasks.md ../004-crash-path-fallback/tasks.md` prints `:0` for both files.
- [ ] T002 Record a baseline bench run before any edit (`A/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints one `advisor-scorer-calibration` line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Count floored top-1 passes in the existing loop at `:201-219`, split by correct, wrong and work-intent, with the policy reason from `shouldFireAdvisor` called on phase 002's stripped text, not the raw prompt. Add the counts, `C` and the ids of the `C` rows to the log object at `:246-255` (`A/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and its `advisor-scorer-calibration` line holds the new count fields and the `C` row ids.
- [ ] T004 Add the nine follow-up pairs from `plan.md` section 3 as one constant array, with pairs 2 and 4 marked as negative controls (`A/bench/scorer-calibration.bench.ts`). Verify: `rg -c 'fix that too' A/bench/scorer-calibration.bench.ts` prints 2, for pair 1 and its pasted-reply form in pair 9.
- [ ] T005 Score each pair's task and follow-up with `scoreAdvisorPrompt`, and call `shouldFireAdvisor` on phase 002's stripped text. Compute `H` and `Hsame`, and print one `advisor-follow-up-routing` JSON line with each follow-up's full floored set (`A/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints that line with `N` equal to 9, an `H` value, an `Hsame` value and a floored set per pair.
- [ ] T006 Confirm no pinned value moved (`A/bench/scorer-calibration-baseline.json`, `A/lib/metrics.ts`). Verify: `git diff --stat -- A/bench/scorer-calibration-baseline.json A/lib/metrics.ts` prints nothing.
- [ ] T007 Check comment hygiene in the bench (`A/bench/`). Verify: `git diff -U0 -- A/bench | rg -n '^\+.*(R3|R5|N4|016-|phase 0)'` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Apply the decision rule in `spec.md` section 4, with the bar `H >= ceil(N / 2)`, which is `H >= 5` for nine pairs, and `C = 0`. Record `N`, `H`, `C`, the ids of the `C` rows, `Hsame` and the branch taken (`implementation-summary.md`). `Hsame` is reported only. Verify: `rg -n 'Decision rule outcome' implementation-summary.md` prints one line naming ship, over-suppresses or no guard.
- [ ] T009 Only on ship: add optional `confidenceFloored: z.literal(true)` to `AdvisorRecommendationSchema` (`A/schemas/advisor-tool-schemas.ts`). Verify: `npm --prefix A run typecheck` exits 0.
- [ ] T010 Only on ship: copy the flag in `publicRecommendation` beside `heldBelow` (`A/handlers/advisor-recommend.ts`). Verify: after `npm --prefix A run build`, `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt 'fix that too' --format json` shows `"confidenceFloored": true`.
- [ ] T011 Only on ship: carry the flag on `AdvisorRecommendation` and keep it in `recommendationFromCli` (`A/lib/subprocess.ts`, `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`). Verify: `npm --prefix A run typecheck` exits 0.
- [ ] T012 Only on ship: add the guard after the result is built and before the brief renders. It calls `shouldFireAdvisor` on phase 002's stripped text and returns the policy's existing skipped result, status `skipped` and freshness `unavailable`, built through the policy's existing skipped builder and never a hand-written literal. The builder is private, so export one helper from `runtime/lib/skill-advisor-brief.ts` that calls it with those two values (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts`). Verify: `npm --prefix A run typecheck` exits 0.
- [ ] T013 Only on ship: add one test with a guarded case and an unguarded case (`A/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). The guarded case asserts the `Advisor: prompt skipped.` head and the hygiene directive. Verify: `npx vitest run tests/hooks tests/schemas tests/handlers` from `A` exits 0, because `AdvisorRecommendationSchema` is strict, and the guarded case reads `Advisor: prompt skipped.` and `Comment hygiene [HARD BLOCK]`.
- [ ] T014 Only on ship: record that the OpenCode plugin does not get the guard (`implementation-summary.md`, Known Limitations). Verify: `rg -n 'OpenCode' implementation-summary.md` prints a line in that section.
- [ ] T015 Validate this phase (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `implementation-summary.md` quotes `N`, `H`, `C` and the `C` row ids from one `BENCH` run and names the branch of the rule taken
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/review-overengineering-opus-high.md`, Group 1 and "Where the plan is too small"
<!-- /ANCHOR:cross-refs -->

---
