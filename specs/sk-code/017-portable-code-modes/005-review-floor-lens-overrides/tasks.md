---
title: "Tasks: Review floor, default lens and rule overrides"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review floor lens overrides tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Review floor, default lens and rule overrides

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/sk-code/sk-code-review`. `L` is `node --test .skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs`. `C` is `bash R/scripts/tests/check-rule-copies.test.sh`. The `HEAD` tree is `git archive HEAD` of the sk-code hub and `AGENTS.md`, unpacked into the session scratchpad, with the new test files copied in.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the canary and its suite. Verify: `node R/scripts/check-rule-copies.js` printed `OK: all rule invariants present (7 exact-string file(s) ...)`, exit 0; `C` printed 80 `PASS`, 0 `FAIL`, `All rule-canary test cases passed`, exit 0.
- [x] T002 Baseline the shared linter suite. Verify: `node --test shared/scripts/tests/check-rule-overrides.test.cjs` printed `tests 12`, `pass 12`, `fail 0`.
- [x] T003 Read the resolver's real CLI. Verify: `quality-gate.cjs --explain <files> --json` printed `USAGE: unknown argument --json`, exit 3; `--explain <files>` printed `code-quality-explain/v1`, exit 2, because JSON is the default format.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Mark floor and default lens with ids (`R/references/review-core.md` section 8, the four rule checklists). Verify: `L` case "every review checklist section cites its ids" passes.
- [x] T005 Fix the three P0 hints by the reach rule (`R/assets/code-quality-checklist.md` section 5, `R/assets/test-quality-checklist.md` sections 2 and 5). Verify: `grep -n "^- P0" R/assets/*.md` prints nothing.
- [x] T006 Reword the TODO rule and map it to the hygiene ids (`R/assets/code-quality-checklist.md` section 6, `review-core.md` section 8). Verify: `L` cases "the review TODO rule maps onto real hygiene ids" and "a hygiene id a repository disables in quality reaches review as a mapped id" pass.
- [x] T007 Label or neutralize the examples and scope the web items (security, code quality and fix completeness checklists). Verify: `rg -n -i "skilled|opencode|specs/|packet" R/assets` prints nothing.
- [x] T008 Replace `detect_surface_evidence` with the resolver step, candidates and the fileless rule (`R/SKILL.md`, `shared/references/stack-detection.md`). Verify: `rg -n detect_surface_evidence .skilled` prints only the historical `R/changelog/v1.7.0.0.md` line; the canary pins `quality-gate.cjs --explain <file> [<file>...]`.
- [x] T009 Define precedence, outcomes and the `Rule sources:` line (`review-core.md` section 8, `R/SKILL.md` sections 2 to 4). Verify: `C` case `shape_final_line_rule_sources` and `shape_findings_rule_sources` pass.
- [x] T010 Convert the SKILLED review handoffs into one override row (`sk-code-skilled/assets/checklists/universal-checklist.md`, the Python and shell quality standards). Verify: `check-rule-overrides.cjs` prints `1 rule override(s)`; `L` case "the SKILLED surface rows lint clean" passes.
- [x] T011 Write the new suite (`shared/scripts/tests/review-lens-overrides.test.cjs`). Verify: on the `HEAD` tree `pass 0`, `fail 6`, exit 1; on the changed tree `pass 6`, `fail 0`.
- [x] T012 Pin the floor ids, the line format and the resolver step (`R/scripts/check-rule-copies.js`, its suite, `rule-sources-valid.md`). Verify: the new suite on the `HEAD` canary fails 4 cases (`rule_sources_format_reworded`, `review_floor_id_dropped` and their output checks), exit 1; on the changed canary 87 `PASS`, exit 0.
- [x] T013 Build the fixture pair and a floor attempt (`scratch/fixtures/`, `scratch/show-explain.cjs`). Verify: each `--explain` exits 2 and the floor attempt's checklist reads `Refused`.
- [x] T014 Write the changelogs, step the carriers and sync Hermes. Verify: `validate_document.py --json` `"total_issues": 0` for all three; `parent-skill-check.cjs` prints `OK`; `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Filter deleted paths before `--explain` (`R/SKILL.md` step 3 and `resolvable_files`, the canary and its suite). Verify: `--explain README.md no-such-deleted.ts` exits 3 `FILE_NOT_FOUND`; the new case fails on the canary without the pin (87 `PASS`, 2 `FAIL`) and passes after.
- [x] T019 Reword the SKILLED TODO row to an owner and no ticket id (`universal-checklist.md`, `sk-code-skilled/changelog/v2.1.8.0.md`). Verify: `check-rule-overrides.cjs` prints `1 rule override(s)`.
- [x] T022 Drop ticket ids from the SKILLED TODO examples and rules (`sk-code-skilled` universal, Python and shell checklists, Python quality standards, shell overview reference). Verify: `rg -n "TICKET-|TODO\(" .skilled/skills/sk-code/sk-code-skilled` went from 4 `TICKET-123` lines to 0, and every `TODO(` example reads `TODO(username)`.
- [x] T020 Move over-mocking to the floor (`R/assets/test-quality-checklist.md` section 5, `review-core.md` lens table, the lens suite's exception match). Verify: lens suite `pass 6`, `fail 0`.
- [x] T021 Name the default changes in the review changelog's Upgrade section (`R/changelog/v1.9.5.0.md`). Verify: `validate_document.py --json` `"total_issues": 0`; voice scan 0 hard blockers.
- [x] T015 Rerun every suite from the final state. Verify: canary exit 0; `C` 89 `PASS`; shared suites `tests 18 pass 18 fail 0`; quality runner `tests 137 pass 137 fail 0`; sk-code-skilled `tests 36 pass 36 fail 0`.
- [x] T016 Run the quality gate over the worktree. Verify: `quality-gate.cjs --worktree` prints `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0`.
- [x] T017 Validate every changed doc. Verify: `validate_document.py --json` `"total_issues": 0` on all fourteen changed docs; `frontmatter-version.mjs gate` reports no failure.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The canary suite passes 89 of 89 and the shared suites 18 of 18
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-011 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `--explain` and the linter run from the worktree, T003 and T002.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files` on the four code files prints `gate=NO_BLOCKER_FOUND exit=0` after one comment was reworded for `hygiene.review-finding`.
- [x] CHK-011 [P0] No new warnings in the test output.
- [x] CHK-012 [P1] Error handling: the review pseudocode raises on an `--explain` exit other than 2, and the steps say to report it and fall back to the baseline.
- [x] CHK-013 [P1] Code follows the files' section headers and comment style, with no ephemeral labels in comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each new case fails before and passes after. Evidence: T011 and T012.
- [x] CHK-022 [P1] Edge cases: a floor row is refused and its checklist contributes nothing (`scratch/explain-floor-attempt.json`); a fileless review writes `Rule sources: none`.
- [x] CHK-023 [P1] The disabled-hygiene case builds its repository in a temporary folder and removes it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`, house rules and wrong severities across every review rule checklist.
- [x] CHK-FIX-002 [P0] Same-class producers: `grep -n "^- P0" R/assets/*.md` prints nothing after the fix; the remaining P0 copy is in the `@review` agent, which child 006 owns.
- [x] CHK-FIX-003 [P0] Consumers: both report checkers pass the `rule-sources-valid.md` fixture; `rg -n detect_surface_evidence .skilled` prints only the historical v1.7.0.0 changelog line.
- [x] CHK-FIX-004 [P0] The floor list is read from `rule-overrides.json` in the new suite, never copied.
- [x] CHK-FIX-005 [P1] Matrix: a no-comments repository, an opposite-rule repository and a floor attempt, each through `--explain`.
- [x] CHK-FIX-006 [P1] Process-wide state: none; the suite's temporary repository lives under the OS temp folder.
- [x] CHK-FIX-008 [P0] Deleted paths: the resolver step filters them with `--diff-filter=d` or a regular-file check, because one missing path stops the whole `--explain` call.
- [x] CHK-FIX-007 [P1] Evidence is against base `5b1e143ced` plus the uncommitted diff in worktree `248-review-floor-lens-overrides`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the quality gate's secrets check ran clean.
- [x] CHK-031 [P0] A row naming a floor id is refused, and review applies none of that checklist's rows. Evidence: `L` floor case.
- [x] CHK-032 [P1] No private skill is named in any tracked file this child wrote, and the `Rule sources:` line redacts a `local-*` segment.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files.
- [x] CHK-041 [P1] Test and canary comments state why each pin and case exists.
- [x] CHK-042 [P2] Changelog entries written for sk-code-review, sk-code-skilled and the sk-code hub.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary output and the `HEAD` tree lived in the session scratchpad.
- [x] CHK-051 [P1] `scratch/` holds the fixture repositories, their runner and its saved output, with absolute paths folded to `<repo>` and `<hub>`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
