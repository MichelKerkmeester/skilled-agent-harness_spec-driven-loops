---
title: "Tasks: Phase 13: ux-and-alignment-pass"
description: "Ordered tasks for the engine fixes, the UX pass, the alignment and drift fixes, the deep-loop hardening, the handoff items and the review rounds, each with its verify command."
trigger_phrases:
  - "ux and alignment pass tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: ux-and-alignment-pass

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

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `W` is the worktree `/Users/michelkerkmeester/worktrees/public/506-ux-and-alignment-pass`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree and branch through sk-git (`W`). Verify: `git -C W branch --show-current` prints `worktrees/506-ux-and-alignment-pass`.
- [x] T002 Run the baseline gates on main (`scratch/` gate log). Verify: engine 362, guard 34, contract 9, lsa 76, ldoc 10, router-sync 56, route-validate 32 routes; drift guards exit 1 on the research-archive `post.sh`.
- [x] T003 Run `/local-skilled-alignment` on the doctor skill and commands, and `/local-doc-alignment` on the overlay layout. Verify: three run folders hold `findings.json`, 22, 22 and 31 raw findings.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 A Python cache is matched by path and kind, a stuck cache gives a NOTE, and the re-pin backup copies only removable caches (`E`). Verify: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` passes, commit `78f8792461a`.
- [x] T005 A directory entry changes a destination's shape in one apply, only `.env.example` is exempt from the secret refusal, and a retained README is documentation only (`E`, `references/overlays.md`, the phase 14 contract doc). Verify: `overlay-engine-shape-change.test.cjs` passes, commits `c2c2f2ab74a` and `9a95e0ff0f6`.
- [x] T006 A skill-root entry changes a replaced path's shape in one apply (`E`). Verify: 6 of 8 new tests failed before with EISDIR or no refusal, and all 422 engine tests pass, commit `299bf658411`.
- [x] T007 Engine refusals carry a why line and a quoted, rooted `Next:` line, first lines byte-identical, REGEN reported in status (`E`). Verify: `overlay-engine-ux.test.cjs` and `overlay-engine-next-lines.test.cjs` pass, commits `59d26c89f38` to `3076d1ec251` and `2f188045e55`.
- [x] T008 [P] Every other doctor script gets `Next:` lines (`.skilled/commands/doctor/scripts/`). Verify: the doctor suite passes, commits `95488ee32ff`, `8ab5e7306d3`, `7da86746b8a`.
- [x] T009 [P] Hook refusals get `Next:` lines: git hooks, spec gate, overlay guard and its adapters, validate-message (`.skilled/scripts/git-hooks/`, `.skilled/hooks/`). Verify: pre-commit 166, commit-msg 46, prepare-commit-msg 82, guard 34 pass, commits `60478830279`, `0eb54a8b678`, `8025a4663aa`, `2dd39dfe897`, `e3e885ebe50`.
- [x] T010 [P] Onboarding docs, the doctor skill, command assets, setup flows and playbooks follow one vocabulary (`.skilled/skills/system-skilled-doctor/`, `.skilled/commands/doctor/assets/`). Verify: `validate_document.py` passes on each changed doc, commits `25391f947a6` to `de2fa53e0d3`.
- [x] T011 [P] The drift guard skips archived deep-loop run scripts under specs (`verify_alignment_drift.py`). Verify: `run-all-drift-guards.sh` exits 0, commit `84d61dd6edf`.
- [x] T012 [P] The Pi default model is restored to the first enabled entry (`.pi/settings.json`). Verify: the executor-config vitest passes, commit `31ef87dfc7b`.
- [x] T013 [P] The deep-loop tests strip the caller's git and runtime env and find the repository root through git (`system-deep-loop` tests). Verify: `hermetic-env.vitest.ts` passes and the salvage-miss case passes, commit `5652a4bafe2`.
- [x] T014 [P] Overlay requests route to the doctor skill and not to sk-doc (`explicit.ts`). Verify: `overlay-request-routing.vitest.ts` and the advisor suite pass, commits `abe1b833b25`, `373ec7de88e`.
- [x] T015 Fix the operator-local alignment assets: nested-root scope lookup, the S16 row, the vibe kinds, and the git-folder write guard. Verify: the lsa suite passes; these files are gitignored, so no commit.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Review round 1 over `65751f8d61a..373ec7de88e`, two slices. Verify: both REQUESTED_CHANGES with 0 P0, 4 P1 and 8 P2, all fixed in `2f188045e55`, `9a95e0ff0f6`, `2dd39dfe897`, `e3e885ebe50`, `299bf658411`.
- [x] T017 Review rounds after round 1 until APPROVED with no P0 or P1. Verify: the final `Review status:` line reads APPROVED, recorded in `implementation-summary.md`. Evidence: engine round 9, hooks and code round 6, docs round 7, each `Review status: APPROVED`.
- [x] T018 Rebuild the trigger index and strict-validate the 007 parent. Verify: `generate-trigger-index.mjs --check` exits 0 and every folder prints `RESULT: PASSED`. Evidence: the index rebuild commit after this one, and 18 of 18 folders `RESULT: PASSED` on the merged main.
- [x] T019 Merge into local main with `--no-ff` and rerun every gate there. Verify: each gate is at or above its baseline. Evidence: merge `058e6091759`, gates in `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every gate on the merged main at or above its baseline, as recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked task keeps its committed work and is reported with the failing command, per the three-attempt rule in `goal.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-007 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: the serial engine queue in `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the handoff file was read at the start and before the final review.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint and syntax checks. Evidence: `bash -n` on each changed hook and `node --check` on each changed script exit 0.
- [x] CHK-011 [P0] Machine-token first lines are unchanged. Evidence: `overlay-engine-next-lines.test.cjs` asserts the first lines.
- [x] CHK-012 [P1] Every changed refusal says what happened, why and the exact next command. Evidence: the vocabulary in `scratch/`'s gate notes and the review rounds.
- [x] CHK-013 [P1] No spec path, phase number or finding id in a code comment. Evidence: `git diff 65751f8d61a..HEAD` grep for those patterns in added comment lines prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row of `acceptance-criteria.md` is `Met`.
- [x] CHK-021 [P0] Each behavior fix has a test that failed first. Evidence: the red runs named in the commit bodies.
- [x] CHK-022 [P1] Edge cases tested. Evidence: an unowned shape, an unreadable kill switch, a vendored subfolder root, a `.git/config` literal fix.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: invalid manifest JSON is named, and a REGEN pending makes `status` fail.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the classes in the review rounds of `implementation-summary.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: every `git restore` and `Next:` line in the hooks was grepped and checked against its condition.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed messages. Evidence: the engine, guard and contract suites, and the presentation files.
- [x] CHK-FIX-004 [P0] Path fixes include outside-root and link cases. Evidence: the git-folder write guard tests cover a nested clone, a gitfile, a link and the hooks folder.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: the shape-change tests cover file, folder and link in both directions for directory and skill-root entries.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. Evidence: `hermetic-env.vitest.ts` runs with `GIT_*` set.
- [x] CHK-FIX-007 [P1] Evidence pinned to SHAs. Evidence: every task above names its commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret is read. Evidence: only `.env.example` is exempt, matching the env secret guard.
- [x] CHK-031 [P0] An untrusted literal fix cannot write into a git folder. Evidence: the `.git/config` dry run prints `would_apply=0`.
- [x] CHK-032 [P1] Auth: N/A, no credential surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence: all three name the same seven requirements.
- [x] CHK-041 [P1] Code comments keep the durable why. Evidence: CHK-013.
- [x] CHK-042 [P2] The doctor README and `references/overlays.md` updated. Evidence: commit `25391f947a6`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only. Evidence: test fixtures live under `mktemp -d` and are removed.
- [x] CHK-051 [P1] Scratch cleaned before completion. Evidence: `git status --porcelain` on the merged main lists only another session's `.pi/settings.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->
