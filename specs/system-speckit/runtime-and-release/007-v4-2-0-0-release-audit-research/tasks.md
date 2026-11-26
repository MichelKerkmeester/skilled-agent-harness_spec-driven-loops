---
title: "Tasks: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "v4 2 0 0 release audit research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.4 -->
# Tasks: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

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

`P` is `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research`. `C` is `.skilled/changelog/skilled/v4.2.0.0.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the window commit list (`$P/scratch/window-commits.txt`). Verify: `wc -l < $P/scratch/window-commits.txt` prints 1084.
- [x] T002 Freeze the recent packet list (`$P/scratch/recent-packets.txt`). Verify: `grep -vc '^#' $P/scratch/recent-packets.txt` prints 21.
- [x] T003 Preview both lineage commands (`$P/research/`). Verify: the `--dry-run` preview prints one command each for the `codex` and `devin` labels and writes nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the two-lineage fan-out (`$P/research/lineages/`). Verify: `ls $P/research/lineages/*/iterations/ | wc -l` prints a count above 2.
- [x] T005 Merge and synthesize the findings (`$P/research/research.md`). Verify: `test -f $P/research/research.md && echo ok` prints ok.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Re-check every reported finding in the repository (`$P/research/research.md`). Verify: each reported finding names the file read or command that confirmed it.
- [x] T008 Fix the case-sensitive `root/skilled` guard (`overlay-engine.cjs`). Verify: the new strict-writes test fails without the fix and passes with it.
- [x] T009 Restore the lost executable bits. Verify: `git ls-files -s` prints `100755` for the three files.
- [x] T010 Update `C` from `research/research.md`. Verify: `C` names M1 and the corrected install line.
- [x] T007 Validate the packet (`$P/spec.md`). Verify: `validate.sh $P --strict --quiet` prints `RESULT: PASSED`.
- [x] T011 Run the logic and features research and its independent verification (`$P/research/research.md`). Verify: `grep -c '^## ' $P/research/research.md` prints 12.
- [x] T012 [P] Group A: fix the deep-loop runtime findings (`fanout-run.cjs`, `fanout-merge.cjs`, `workflow-steps.cjs`, `deep-research.yaml`). Verify: the runtime suites pass and each new test fails without its fix.
- [x] T013 [P] Group B: fix the Claude Stop hook findings (`session-stop.ts`, `decision-record-writer.ts`). Verify: the hook and continuity suites pass and each new test fails without its fix.
- [x] T014 [P] Group C: fix the overlay engine findings (`overlay-engine.cjs`). Verify: the 12 overlay engine suites and the overlay contract suite pass.
- [x] T015 [P] Group D: fix the skill advisor findings (`skill_advisor.py`, the scorer). Verify: the advisor suite, the Python scorer tests and the routing corpora pass, with any moved corpus case named.
- [x] T016 [P] Group E: fix the operator UX findings (`create.sh`, `skilled-loop`, `worktree-naming.sh`). Verify: their suites pass and the scripts keep mode 100755.
- [x] T017 Review every group's diff and rerun its suites from the final state (`$P/implementation-summary.md`). Verify: each suite's before and after counts are recorded.
- [x] T018 Fill `$P/acceptance-criteria.md` and validate the packet. Verify: `validate.sh $P --strict` prints `RESULT: PASSED`.
- [x] T019 Count only trusted frontier nodes in the stop decision (`convergence.cjs`). Verify: `stop-decision.vitest.ts` passes 133 of 133 with the fix and fails 1 with the HEAD file.
- [x] T020 Rebuild the gitignored dists in the primary checkout. Verify: both builds exit 0 and `hook-session-stop.vitest.ts` passes 32 of 32.
- [x] T021 Add the fix pass to `C` and bring `$P/spec.md` section 9 to the fixed state. Verify: `check_changelog_shape.py` prints PASS and `validate_document.py` prints VALID.
- [x] T022 Update hono to a fixed version in the system-spec-kit and mcp-code-mode lockfiles. Verify: `npm ls hono` prints 4.13.22 in both, and the code-mode server answers `initialize` and lists its 8 tools.
- [x] T023 Merge Dependabot PR 108 into `main`. Verify: `gh pr view 108` prints MERGED, and the provisioning walk prints `0 failed`.
- [x] T024 Dismiss the 12 pip alerts whose `uv.lock` files are no longer tracked. Verify: each of alerts 1448 to 1459 reads `dismissed not_used`.
- [x] T025 Fix the three CI checks already failing on `main` (`pre-push.test.sh`, the README manifest, the spec-kit CLI shards). Verify: `pre-push.test.sh` passes 59 of 59 with `init.defaultBranch=master`, both sk-doc walk tests pass, and the spec-kit CLI project passes in full. The tag moves only after every workflow run on the pushed commit concludes `success`.
- [x] T026 Commit the packet state on `main` and create the fix worktree through `worktree-naming.sh create`. Verify: `git worktree list` shows the new `worktrees/NNN-` branch and provisioning prints `0 failed`.
- [x] T027 Give `compiled-route.cjs` a task file argument and replace every `<<'TASK'` example, the scaffold and the lockstep parity test. Verify: `rg -n --hidden "<<\s*['\"]?TASK" .skilled` prints nothing and the new CLI test passes.
- [x] T028 Signal and track a held fan-out child refused as `identity_unreadable` (`fanout-run.cjs`). Verify: the new test with `ps` stubbed to fail passes and fails with the old file.
- [x] T029 Pass the session id from the Pi advisor hook (`prompt-advisor.ts`). Verify: the new Pi hook test sees the receipt written.
- [x] T030 Count a terminator before a lowercase word as a sentence end (`thin-continuity-record.ts`). Verify: a `Ready. fine.` test is rejected and the version, filename and "e.g." cases still pass.
- [x] T031 Resolve a default-depth question only on answer evidence (`reduce-state.cjs`). Verify: the new reducer test leaves a focused but unanswered question open.
- [x] T032 Document the pre-push fail-open and fix the pre-commit uninstall line. Verify: `grep -n 'fail' .skilled/scripts/git-hooks/README.md` shows the sentence and `sed -n 13p .skilled/scripts/git-hooks/pre-commit` shows the installer command.
- [x] T033 Rerun every touched suite, add the fix pass to `C` and validate the packet. Verify: before and after counts are in `$P/implementation-summary.md` and `validate.sh $P --strict` prints `RESULT: PASSED`.
- [x] T034 Repoint the 24 skill-doc links and the three test paths that reach `specs/` through the removed `.skilled/specs` alias. Verify: `check-markdown-links.cjs` prints `0 broken`, `validate-playbook-package.cjs --strict` exits 0, and the deep-loop runtime and spec-kit CLI suites pass with no failure.
- [ ] T035 Merge worktree 547 into `main` with a merge commit, rebuild the gitignored dists, save continuity and push `main`. Verify: `git log origin/main -1` shows the merge and every workflow run on it concludes `success`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research/research.md` holds the verified findings
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-004 and REQ-005 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: the five fix groups in `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: worktree provisioning printed `10 installed, 6 built, 4 already present, 0 failed`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: `quality-gate.cjs --worktree --lines changed` reports 0 P0, 0 P1, 0 P2, exit 0.
- [x] CHK-011 [P0] No console errors or warnings Evidence: every touched suite exits 0 in the final-state rerun recorded in `implementation-summary.md`.
- [x] CHK-012 [P1] Error handling implemented Evidence: each refusal path prints its reason and a remedy, pinned by the tests in `acceptance-criteria.md`.
- [x] CHK-013 [P1] Code follows project patterns Evidence: each diff reuses the file's own helpers, for example `ownedDestinationShape`, `pathFold` and `commandOnlyMentioned`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row of `acceptance-criteria.md` reads Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: the orchestrator probed the reverse skill-root case by hand, found a regression and had it fixed, and ran the HEAD-swap check itself.
- [x] CHK-022 [P1] Edge cases tested Evidence: both case-and-shape directions, an inbox of only resolved questions, every JSON escape and an empty skill-graph database.
- [x] CHK-023 [P1] Error scenarios validated Evidence: a busy save lock, a failed consumed append, a failed scan and an unowned shape in the way each have a test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: `research/research.md` section 2 gives each finding a severity and class.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the option-B bug was fixed in both workflow YAMLs, and the case fold in the file, directory and skill-root plans.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the routing baseline was regenerated and its consumers `command-routing-slice` and `typed-on-stuck-serving` pass.
- [x] CHK-FIX-004 [P0] Security fixes include adversarial cases. Evidence: an unowned user file at the case-folded path is still refused, and a dotless-i spelling is never joined to a plain one.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: `acceptance-criteria.md` lists one row per finding.
- [x] CHK-FIX-006 [P1] Hostile env variant executed when needed. Evidence: win32 is faked in the fan-out stop tests, and a case-sensitive volume skips the fold tests.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or diff range. Evidence: the fix commits `9f332867143`, `980166a59a1`, `89cf65a4ed9`, `670760669bc`, `52e40216568` and `fb62867853f` on `worktrees/545-v4-2-audit-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: a grep of the added lines for key, secret, password and token finds only the fixture file name `api-token.js`.
- [x] CHK-031 [P0] Input validation implemented Evidence: stray words and unknown flags are refused, pinned by `overlay-engine-repin.test.cjs:920` and `overlay-engine-sync.test.cjs:635`.
- [x] CHK-032 [P1] Auth/authz working correctly Not applicable: no change touches an authentication or authorization path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: the Files to Change table in `spec.md` and the fix groups in `plan.md` name the scorer lane and both workflow YAMLs as built.
- [x] CHK-041 [P1] Code comments adequate Evidence: a grep of the added lines finds no finding, task or spec ids in comments, and the quality gate reports 0 open findings.
- [x] CHK-042 [P2] README updated when applicable Evidence: the feature-catalog pages `fanout-run.md`, `fanout-merge.md` and `cli-shim.md` and the handover doc `goal-carry-over.md` were updated. No README describes the changed behavior.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: worker scratch lives under the gitignored `.skilled/skills/.state/vibe-runs/`, and the packet `scratch/` holds only the frozen inputs.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: the worker scratch under `.skilled/skills/.state/vibe-runs/` is removed. The packet `scratch/` keeps only the frozen audit inputs on purpose.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->
