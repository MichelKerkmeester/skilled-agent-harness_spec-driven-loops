---
title: "Tasks: Phase 43: label-finding-fixes"
description: "Ordered tasks for the three label-finding fixes: baselines, one worker brief per fix, suite reruns, the cross-family review and the closure gates."
trigger_phrases:
  - "label finding fixes tasks"
  - "stop rater gold fix tasks"
  - "goal verifier clamp fix tasks"
  - "goal lint model arm tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 43: label-finding-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline every suite a fix touches (S, from the repository root). Evidence: score-stop-rater 36 pass, goal-core 74, goal-slice 24, score-verifier-labeled-set 12, build-verifier-fixture 5, count-pi-goal-nudges 3, goal-pi 22, score-goal-lint 8, lint-goal-criteria 12, check-goal 16, template-parity 4, all 0 failing. The 003 scorer printed `clamp_defects: 11`
- [x] T002 Write one brief per fix (`build/fix/`, git-ignored). Evidence: `027.md`, `003.md` and `006a.md`, each naming its files, its change and its suites, with Gate 3 pre-resolved for the child worker
- [x] T003 [P] Create this phase and bind it (../goal.md, ../spec.md). Evidence: `create.sh --phase` wrote the scaffold, the parent gained binding row 043 and `goal.cjs packet` reads 3,999, `packet_budget=ok`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 027 gold and lineage filter (`score-stop-rater.cjs`, its vitest file, its catalog entry), Luna 6 max. Evidence: commit `55c33b363e`, suite 41 pass and 0 failing, census `sampled 25` with `no gold 72`
- [x] T005 [P] 003 evidence clamp (`goal-core.cjs`, `goal-core.test.cjs`, `score-verifier-labeled-set.test.cjs`, the goal README), SWE 2 max. Evidence: commit `5543f6861e`, goal-core 78 pass and the five other goal suites at their baselines, 0 failing
- [x] T006 006 Jev arm (`score-goal-lint.cjs`, `score-goal-lint.test.cjs`), Luna 6 max, brief `006a.md`. Evidence: commit `a5b3c462f3`, score-goal-lint 14 pass (8 before), the three neighboring suites unchanged at 12, 16 and 4, the default run byte-identical to HEAD
- [x] T007 006 Deem arm (the same two files), after T006. Evidence: score-goal-lint 21 pass with the stub `cli-deem` cases, plus a coverage stop for both backends after a 0-row `kill` showed up on the local server
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Document the 006 arms in the sk-create-goal docs that describe the scorer. Evidence: commit `eb4eb71881`, SWE 2 max, the session fixed three lines after it. `validate_document.py` 0 issues on the sk-create-goal README, scripts README, catalog entry and changelog v1.4.0.0. `sync-skills-hermes.cjs --check` PASS 72. sk-doc's activation manifest re-minted with `compiled-route-manifest.cjs refresh` and `compiled-route-status.cjs --hub sk-doc` fresh
- [x] T009 DeepSeek V4.1 Flash reviews of the three fixes. Evidence: three read-only rounds (1,731 s, 1,524 s, 1,117 s), each `VERDICT: FAIL` until its P0 and P1 were reproduced and fixed: round one in `5a7db2f019`, `0cd052bf47` and `9bb1781175`, round two in `2825bd105b` and `1093a8520c`, round three's one-word P1 in `1f5d472ef7`. Every P2 is recorded in `goal.md`'s log. No fourth review ran after `1f5d472ef7`; the session reproduced the P1 and reran every goal suite instead
- [x] T010 Closure: `repair-derived.cjs --apply`, `validate.sh --strict` on this phase and the parent, `check-goal.cjs` on both. `repair-derived.cjs --apply` repaired the phase and the parent. `validate.sh --strict` on this phase printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `--recursive` on the parent printed `RESULT: PASSED` for all 44 folders. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` on this phase, the parent and every child
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the review inputs were reproduced against the final state, and 027's census and 003's labeled set were rerun on real data
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: `spec.md` section 4, REQ-001 to REQ-007 with P0 and P1 tiers.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: `plan.md` sections 1 to 3, one brief per fix and the affected-surfaces table.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: `plan.md` section 6; Luna, SWE and DeepSeek each returned a result.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: `node --check` exits 0 on the three changed scripts and their test files, and `git diff --check` is clean before each commit.
- [x] CHK-011 [P0] No console errors or warnings Evidence: every changed suite runs with 0 failing: 027 vitest 59, goal-core 82, eight other goal suites, score-goal-lint 25 and its three neighbors.
- [x] CHK-012 [P1] Error handling implemented Evidence: 006 maps Jev exits 2, 3, 4 and 130 and a failed gate to one line each. 027's census reports a failed `git ls-files` and exits 2.
- [x] CHK-013 [P1] Code follows project patterns Evidence: each change sits in its owner file, uses that file's `spawnSync` and JSDoc idioms, and keeps no ephemeral id in a comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: AC-001 to AC-006 Met in `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete Evidence: every review input was reproduced against the final state, and 027's census and 003's labeled set were rerun on the real tree.
- [x] CHK-022 [P1] Edge cases tested Evidence: 0 asked questions, every call failing, `fail 0` and `0 failures`, a path with a space, a dotfile and the real tree's 16 MB tracked list.
- [x] CHK-023 [P1] Error scenarios validated Evidence: score-goal-lint's stub cases cover each gate skip line, a rejected key, a retried exit 4 and an interrupt.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: 027's gold and source rule are algorithmic, the clamp and the missing `fail` words are class-of-bug with the OpenCode copy as a cross-consumer, and 006's verdict on unmeasured rows is matrix/evidence.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg -n 'verifyGoalHeuristic' .skilled` and `rg -n 'VERIFIER_BLOCKING_PATTERN'` find goal-core and the OpenCode plugin copy, which stays out of scope and is recorded.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `findingSources` feeds only `deriveGold`, which `main` and the vitest file call. goal-core's verifier feeds the Pi, Cursor, Devin and Claude adapters, the fixture builder and the 003 scorer, each suite rerun.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: 027's `it.each` table covers delimiters, joined free text, prefixes, anchors, tracked and untracked space paths. goal-core's zero-count table covers `fail: 0`, `0 fail`, `fails=0`, `0 failures` and `failures: 0`.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: three fixes, three review rounds, nine goal suites, four 006 suites and one 027 suite, each with its count in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: score-goal-lint's tests put a stub `jev` and `cli-deem` first on `PATH` and assert no call without a switch. The unplanned `PATH=/usr/bin:/bin` run is logged as a deviation.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: each task and log row names its commit, from `55c33b363e` to `1f5d472ef7`, and the census comparison names `9bb1781175`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: a key-shape scan of `git diff 3943848cc5..HEAD` over `.skilled` and `.hermes` finds none, and no `.env` was opened.
- [x] CHK-031 [P0] Input validation implemented Evidence: `--jev` and `--deem` without `--out` exit 2. Non-string `sources` and `evidence` entries are skipped.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: the Jev arm runs only after `jev auth status` passes and passes Jev no secret. The Deem gate accepts only the local server.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: the closure pass set `spec.md` Status Complete, every task and acceptance row and the goal criteria from one recorded state.
- [x] CHK-041 [P1] Code comments adequate Evidence: JSDoc on `findingSources`, `deriveGold` and `verifyGoalHeuristic` states the new rules, and the pattern comment explains the zero-count guard.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: the goal README's verification paragraph, the sk-create-goal README and scripts README, and 027's catalog entry.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: briefs sit in the git-ignored `build/fix/`, worker output in the session scratchpad, and `git status` lists no untracked file.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: this phase has no `scratch/` folder, and the stray review output that landed in the worktree root was moved to the scratchpad.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-01. Every item is checked with its evidence at closure. The gate outputs are in `acceptance-criteria.md` AC-006, and the review outcomes are in `goal.md`'s log.
<!-- /ANCHOR:summary -->

---



