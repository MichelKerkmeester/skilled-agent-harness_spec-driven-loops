---
title: "Tasks: Phase 44: deem-answer-shape-fix"
description: "Ordered tasks for the Deem answer-shape fix: baselines, two worker briefs in parallel, suite reruns, a check against the local server, docs, the cross-family review and the closure gates."
trigger_phrases:
  - "deem answer shape tasks"
  - "cli-deem translate fix tasks"
  - "judgment envelope depth tasks"
  - "deem score shape tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 44: deem-answer-shape-fix

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

- [x] T001 Baseline every suite a fix touches. Evidence: cli-deem 34 pass, score-stop-rater 59, completion-claim-audit 23, all 0 failing
- [x] T002 Trace the cause and its reach. Evidence: two local server calls give `noul` and `score` shapes the client does not read, and a parser sweep finds only 027 and 026 reading at the top level
- [x] T003 Write one brief per worker (`build/fix/044a.md`, `044b.md`, git-ignored), Gate 3 pre-resolved
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] `cli-deem` `translateAnswer` and its fake answers (`cli-deem.mjs`, `cli-deem.test.mjs`), Luna 6 max, brief `044a.md`. Evidence: commit `006994d12a`, then the review's `criteria` fix `ec3d3c1e7f`. Luna's sandbox refused loopback binds, so the session ran the suite: 39 pass (34 before), 0 failing
- [x] T005 [P] 027 and 026 parse depth and stubs (`score-stop-rater.cjs`, `score-stop-rater.vitest.ts`, `score-completion-claims.mjs`, `completion-claim-audit.vitest.ts`), SWE 2 max, brief `044b.md`. Evidence: commit `7180ff06b4`, with the session's float-score fix in 027's Jev arm. 027 vitest 61 (59 before), 026 vitest 24 (23 before), 0 failing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run `cli-deem noul`, `choice` and `score` against the local server. Evidence: `health`, `noul` 0.9707, `noul --value`, `choice` key `pay`, `score` 1.0983, `score --value` and a `run` batch with `criteria` (score 1.7875) each exit 0
- [x] T007 Update the cli-deem docs that describe the answer shape, add a changelog entry, and correct 043's record. Evidence: commit `1882e3f868`, SWE 2 max. `validate_document.py` exits 0 on every changed doc, the old-wording grep finds nothing, Hermes sync PASS 72, cli-classifier's manifest re-minted to `compiled-serving`
- [x] T008 One DeepSeek V4.1 Flash review of the changes. Evidence: 1,565 s, `VERDICT: FAIL` on 1 P1 and 3 P2. The P1 was reproduced and fixed in `ec3d3c1e7f`, with a test that fails on the old check. The P2s are in `goal.md`'s log
- [x] T009 Closure: `repair-derived.cjs --apply`, `validate.sh --strict` on this phase and the parent, `check-goal.cjs` on both. Evidence: `repair-derived.cjs --apply` ran on this phase and the parent. `validate.sh --strict --recursive` on the parent printed `RESULT: PASSED` with 0 errors and 0 warnings for all 45 folders, this phase among them, and `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` on the parent and every child
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the fixed client answered every question type and a `criteria` batch on the local server
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: `spec.md` section 4, REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: `plan.md` sections 1 to 3 and the affected-surfaces table.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: the local Deem server answered every call, and Luna, SWE and DeepSeek each returned.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: `node --check` exits 0 on the three changed scripts, and `git diff --check` is clean before each commit.
- [x] CHK-011 [P0] No console errors or warnings Evidence: cli-deem 39, 027 vitest 61 and 026 vitest 24 pass with 0 failing.
- [x] CHK-012 [P1] Error handling implemented Evidence: an answer out of range or in the old shape exits 1 in `cli-deem` with a named reason and is unmeasured in both scorers.
- [x] CHK-013 [P1] Code follows project patterns Evidence: each scorer reads `answers.answer` like the rest of the fleet, and no comment carries an ephemeral id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: AC-001 to AC-006 Met in `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete Evidence: `health`, `noul`, `choice`, `score`, both `--value` forms and a `criteria` batch against the local server, each exit 0.
- [x] CHK-022 [P1] Edge cases tested Evidence: `noul` 1.5, `score` 3 of three levels, the old `value` and `level` shapes, a float Jev score and a `criteria` batch.
- [x] CHK-023 [P1] Error scenarios validated Evidence: an old top-level answer stays unmeasured in 027 and 026, with a coverage stop and no verdict.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: the answer-shape mismatch is class-of-bug across a client and two scorers, and each stub that copied its own code's shape is test-isolation.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `git grep -nP "(parsed|result|json|body|answer)\??\.(score|noul|choice)(?![A-Za-z])"` over `.skilled` and `.opencode` finds only 027 and 026 above `answers.answer`, and the review repeated the sweep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: every `cli-deem` consumer reads `answers.answer`, the two `score` consumers round a float, and the cli-deem docs, playbook and Hermes copy were updated.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: parser cases for the old shapes, out-of-range numbers, a top-level-only body and the `criteria` alias.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: three readers by three question types, three suites and seven local calls, each in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: the scorer suites put stub `cli-deem` and `jev` first on `PATH`, and 026's suite runs the old shape behind `STUB_DEEM_TOP_LEVEL=1`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: each task names its commit, from `006994d12a` to `ec3d3c1e7f`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: a key-shape scan of `git diff 68b3546cb2..HEAD` over `.skilled` and `.hermes` finds none.
- [x] CHK-031 [P0] Input validation implemented Evidence: `noul` must be a finite number in [0, 1] and `score` a finite number from 0 to levels - 1.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: the client accepts only a loopback URL and the pinned model `deem-0.8-v1`, and no Jev call ran.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: the closure pass set `spec.md` Status Complete, every task and acceptance row and the goal criteria from one recorded state.
- [x] CHK-041 [P1] Code comments adequate Evidence: `translateAnswer`'s JSDoc, the `criteria` bound comment, 027's float comment and 026's `parseNoul` JSDoc state the shapes.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: the cli-deem README, SKILL.md, wire contract, catalog, playbook and changelog v0.1.2.0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: briefs sit in the git-ignored `build/fix/`, worker output in the session scratchpad, and `git status` lists no untracked file.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: this phase's `scratch/` holds only its `.gitkeep`, and the temporary HEAD worktree was removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02. Every item is checked with its evidence at closure. The gate outputs are in `acceptance-criteria.md` AC-006, and the review outcome is in `goal.md`'s log.
<!-- /ANCHOR:summary -->

---



