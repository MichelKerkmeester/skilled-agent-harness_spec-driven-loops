---
title: "Tasks: Phase 1: git-hook-review-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "git hook fix tasks"
  - "deepseek dispatch units"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: git-hook-review-fixes

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

- [x] T001 Create worktree 075 from origin/main `f8519088b9` and the phase child
- [x] T002 Provider pre-flight: `opencode-go/deepseek-v4.1-flash` listed, credentials present
- [x] T003 Probe git amend and cherry-pick behavior for the Commit-Id design
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each unit is one DeepSeek dispatch; the diff and tests are checked before the next.

- [x] T004 D01 trust block in the six hooks (finding 1)
- [x] T005 D02 trust opt-in in test fixtures; foreign-repo and opt-in tests (1)
- [x] T006 D03 ignore command-scope `skgit.contractDir` (9)
- [x] T007 D04 pre-push range and crash reporting (2, 5, 6)
- [x] T008 D05 Commit-Id owner with same author email and date is not a collision (3)
- [x] T009 D06 cherry-pick re-mint whatever the source; real cherry-pick test (4)
- [x] T010 D07 strip only forbidden keys, never line 1, report removals (10)
- [x] T011 D08 gate mirror-parity to the toolchain repo (7)
- [x] T012 D09 routing parity only with the guard and only for HEAD (8)
- [x] T013 D10 staged-blob comment hygiene, `-z`, one checker call (11, 19)
- [x] T014 D11 `#` line agreement between commit-msg and pre-push (13)
- [x] T015 D12 warn-only wording for the skill-metadata gate (12)
- [x] T016 D13 `skilled/v*` exemption comment and docs (14)
- [x] T017 D14 "each pushed ref's tip" wording (15)
- [x] T018 D15 gate the two foreign-repo warnings (16)
- [x] T019 D16 installer friendly error, stale refs (17)
- [x] T020 D17 doc drift and trust model docs (18)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Run every hook suite and node test from the final state
- [x] T022 Re-run the review's P0 reproduction against the new hooks
- [x] T023 Comment hygiene and alignment checks on changed files
- [x] T024 validate.sh --strict on this child and the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (P0 reproduction re-run, no planted code ran)
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` passes on every changed hook; `node --check` on changed `.mjs` (bash 3.2.57, all parse)
- [x] CHK-011 [P0] No new stderr output in a repository without the toolchain (pre-commit sections 43 and 46; pre-push routing case)
- [x] CHK-012 [P1] Validator crash reported apart from a rule failure (pre-push-message-contract section 14)
- [x] CHK-013 [P1] Code follows sk-code-opencode shell and JS standards (drift guards: 0 findings in changed files)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, 13 of 13 Met)
- [x] CHK-021 [P0] P0 reproduction re-run and blocked
- [x] CHK-022 [P1] Edge cases tested (worktree trust, URL push, unfetched remote tip, conflicted pick)
- [x] CHK-023 [P1] Error scenarios validated (broken contract, checker exit 3, missing scripts)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: 1 class-of-bug (all six hooks), 2/5/6 algorithmic, 3/4 algorithmic, 9 cross-consumer (validator and shell mirror), 10/13 cross-consumer (hook and pre-stamp validator), 7/8/16 class-of-bug, 11/19 cross-consumer (both pre-commit hooks), 12/14/15/17/18 instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: every file that sources or runs from `$SOURCE_ROOT` is one of the six global hooks, all carrying the trust block; commit-msg runs only from beside itself.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for message-contract.mjs exports: validate-message.mjs, git-message-gate.mjs (agent gate), the OpenCode and Pi transports; all node suites pass.
- [x] CHK-FIX-004 [P0] Trust check has adversarial tests: foreign clone, command-scope opt-in, worktree (source-root-selection sections 5 and 6).
- [x] CHK-FIX-005 [P1] Matrix axes listed: trust (own checkout, worktree, clone, env opt-in, local opt-in); push (update, merged-in, unfetched tip, URL, broken contract); cherry-pick (clean, continued).
- [x] CHK-FIX-006 [P1] Hostile env variant executed (`GIT_CONFIG_*` for the contract dir and for the trust key).
- [x] CHK-FIX-007 [P1] Evidence pinned to base `f8519088b9` plus the worktree 075 diff; the fix commit SHA is recorded at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No hook runs code from an untrusted tree
- [x] CHK-032 [P1] Trust opt-in read from local scope only (`git config --local`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry no ephemeral ids (comment hygiene: 0 findings)
- [x] CHK-042 [P2] Hook README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (all probes ran in the session scratchpad)
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---
