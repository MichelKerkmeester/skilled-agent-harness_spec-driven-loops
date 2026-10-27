---
title: "Tasks: sk-code-review follow-ups"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review mode followups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: sk-code-review follow-ups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Replay both workflow review prompts (`.skilled/bin/compiled-route.cjs`). Verify: the path-only prompt printed `single` with `sk-code-ci` alone before the fix.
- [x] T002 Capture the gate baseline (scratchpad `lane-d-baseline/`). Verify: compiled-route tests `# pass 94 # fail 0`, runtime mirror check already reporting one unrelated `.cursor` EXTRA.
- [x] T003 [P] Search for any code that computes the review cache key (`rg -n 'remote get-url|repo-ref'`). Verify: only `SKILL.md` and `references/pr-state-dedup.md` match, so the fallback is doc-only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Remove the duplicate `.github/workflows/` keyword (`hub-router.json`, `ROUTER.md`) and regenerate intent signals, the activation manifest and its twin, and the skill graph. Verify: `review .github/workflows/ci.yml` routes `surfaceBundle` `sk-code-review, sk-code-ci`.
- [x] T005 [P] Add the path-only regression test (`.skilled/bin/tests/compiled-route-surface-hint.test.cjs`). Verify: `node --test` passes the new case.
- [x] T006 [P] Compare Overall assessment with the status line (`scripts/check-review-final-line.js`), add `overall-contradicts-status.md` and three harness cases. Verify: the fixture exits 1 with the contradiction message and the harness passes.
- [x] T007 Add the `Quality gate evidence` header line and summary agreement rule (`SKILL.md`, valid fixtures, `README.md` example). Verify: `grep -n 'Quality gate evidence' SKILL.md` prints two lines.
- [x] T008 Document the no-remote fallback and pathspec scope (`SKILL.md` 9.1, `references/pr-state-dedup.md`). Verify: `validate_document.py` VALID.
- [x] T009 Document user-authored modes and add CR-028 (`SKILL.md` section 7, `manual-testing-playbook/user-authored-modes/`). Verify: the scenario's stage-two command prints `surfaceBundle sk-code-review,sk-code-security`.
- [x] T010 Add CR-025 to CR-027, run them live and render the report (`manual-testing-playbook/finding-accuracy/`, `benchmark/reports/2026-10-27--finding-accuracy--live/`). Verify: `render-report.cjs --check` matches all 7 files.
- [x] T011 Reword repository-bound examples (`SKILL.md`, `scripts/README.md`). Verify: `grep -c '\.skilled/'` prints 0 in both.
- [x] T012 Align the review agent and regenerate its mirrors (`.skilled/agents/review.md`, `.claude`, `.codex`, `.pi`, `.hermes`). Verify: `check-agent-mirror-sync.cjs --all` OK.
- [x] T013 Raise versions and write changelogs (sk-code-review v1.9.2.0, sk-code v3.9.2.0). Verify: both changelogs VALID as `--type changelog`.
- [x] T017 Add the reach calibration and reconcile the escalation rule (`references/review-core.md` section 2). Verify: `validate_document.py` VALID and `grep -n "Reach Calibration"` prints one heading.
- [x] T018 [P] Restate the rule in `SKILL.md`, `README.md` and `.skilled/agents/review.md` with its `.claude` copy, then regenerate the codex, pi and hermes copies. Verify: `check-agent-mirror-sync.cjs --all` OK, codex, pi, roster, runtime-mirror and hermes checks PASS.
- [x] T019 [P] Allow the NaN hardening note at P2 in the clean control (`manual-testing-playbook/finding-accuracy/clean-control.md`). Verify: the playbook validator reports `PASS package=sk-code/sk-code-review` with 0 violations.
- [x] T020 Rerun the three finding-accuracy scenarios three times each and the guard-removed variant once, and render the report (`benchmark/reports/2026-10-27--finding-accuracy-calibrated--live/`, `evidence/finding-accuracy-rerun/`). Verify: `render-report.cjs --check` matches all 7 files.
- [x] T021 Raise versions and write changelogs (sk-code-review v1.9.3.0, sk-code v3.9.4.0). Verify: both changelogs VALID.
- [x] T023 Accept a list marker and title case in the Overall assessment pattern (`scripts/check-review-final-line.js`), add `overall-contradicts-status-bulleted.md` and `overall-contradicts-status-title-case.md` and four harness cases. Verify: before the fix the harness printed `4 rule-canary test case(s) failed` with rc=1, after it `All rule-canary test cases passed` with rc=0.
- [x] T024 Run the review mode's bash suite in `.github/workflows/sk-code-script-tests.yml` and add `AGENTS.md` to both path filters. Verify: PyYAML parse shows the new step and `AGENTS.md` in both filters, `actionlint` rc=0, `check-gate-inputs.sh` prints `RESULT: PASSED`.
- [x] T025 Raise the sk-code-review version and write its changelog (v1.9.4.0), then sync the Hermes copies. Verify: `validate_document.py` reports 0 issues, `sync-skills-hermes.cjs` wrote 1 of 67 copies.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T014 Rerun the lane gate set from the final state (scratchpad `gates-lane-d.sh`). Verify: every leg rc=0 except the pre-existing `.cursor` mirror EXTRA.
- [x] T015 Reconcile the playbook scenario count (`manual-testing-playbook.md`). Verify: the playbook validator is VALID and the count is derived from the section 18 index, which lists 34 scenarios.
- [x] T016 Validate the packet (`validate.sh --strict`). Verify: `RESULT: PASSED`.
- [x] T022 Rerun the README manifest and verdict parity tests after `--write`, and validate the packet. Verify: both tests pass and `validate.sh --strict` prints `RESULT: PASSED`.
- [x] T026 Rerun the harness, the comment hygiene check and the packet validation from the final state. Verify: harness `All rule-canary test cases passed`, hygiene rc=0, `validate.sh --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md section 4 holds REQ-001 to REQ-008.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md sections 3 and FIX ADDENDUM name the scoring cause and each surface.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: pi on llmgateway answered the connectivity probe with OK before the live run.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: `node --check` on the checker printed nothing; hygiene over changed files reported 0 findings.
- [x] CHK-011 [P0] No console errors or warnings Evidence: The rule-canary harness and compiled-route tests ran without errors.
- [x] CHK-012 [P1] Error handling implemented Evidence: A placeholder Overall assessment and a missing one both pass, pinned by harness cases.
- [x] CHK-013 [P1] Code follows project patterns Evidence: The checker keeps the file's constants, section layout and failure-message style.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md rows are all Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: Three live reviews ran and CR-028's commands were run from the scenario file.
- [x] CHK-022 [P1] Edge cases tested Evidence: Placeholder and backticked Overall assessment cases pass; quality and fix prompts on a workflow path replayed.
- [x] CHK-023 [P1] Error scenarios validated Evidence: The contradictory fixture exits 1 with the named message.
- [x] CHK-024 [P0] A reworded contradicting summary fails the checker Evidence: `overall-contradicts-status-bulleted.md` and `overall-contradicts-status-title-case.md` exit 1 with the contradiction message; both exited 0 before the fix.
- [x] CHK-025 [P1] The review mode's suite runs in CI Evidence: `sk-code-script-tests.yml` step `Run the sk-code-review bash suite`; `actionlint` rc=0; `check-gate-inputs.sh` `RESULT: PASSED` with 0 failures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: Routing defect: class-of-bug (double-counted substring keyword).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg -c -F` shows no other duplicate path keyword in hub-router.json.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: Consumers replayed: review, quality and fix prompts, router-sync, intent signals, compiled-route tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: N/A: no path, parser or redaction code changed; the checker change has agree, contradict and placeholder cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: Axes: prompt kind (review, quality, fix) by phrasing (path, words). Five rows replayed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: N/A: no test reads process-wide state beyond the activation override the existing test already sets.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: Evidence pinned to the lane commits on worktrees/230-review-mode-followups.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets Evidence: No credential in any changed file.
- [x] CHK-031 [P0] Input validation implemented Evidence: N/A: no input boundary changed. The checker ignores values outside the three tokens.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: N/A: no auth code changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec, plan and tasks name the same files and checks.
- [x] CHK-041 [P1] Code comments adequate Evidence: The new checker loop carries one WHY comment with no ephemeral ids.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: sk-code-review README example and scripts README updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: Run evidence lives in evidence/, scratch holds only .gitkeep.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: scratch/ holds only .gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---



