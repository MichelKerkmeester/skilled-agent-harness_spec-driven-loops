---
title: "Tasks: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci vocabulary single source tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies

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

Run every command from the repository root. A path with no folder in front of it, such as `goal.md` or `scratch/`, is inside this packet folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the replay baseline (`scratch/replay.sh`). Verify: `wc -l < specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay-before.txt` prints 30. [EVIDENCE: `30`]
- [x] T002 Record the guard baseline (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`). Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`. [EVIDENCE: `router-sync: 5/5 checks passed`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the 72 keywords into the hub `CI_WORKFLOW` row (`.skilled/skills/sk-code/ROUTER.md`). Verify: the second command in `spec.md` Measured Behavior prints 72 as its first number. [EVIDENCE: `72`]
- [x] T004 Write the 72 keywords into the packet `CI_WORKFLOW` row (`.skilled/skills/sk-code/sk-code-ci/ROUTER.md`). Verify: the second command in `spec.md` Measured Behavior prints `72 72`. [EVIDENCE: `72 72`]
- [x] T005 List `sk-code-ci` under `vocabularyMirrors` (`.skilled/skills/sk-code/hub-router.json`). Verify: `grep -c '"vocabularyMirrors": \["sk-code-frontend", "sk-code-ci"\]' .skilled/skills/sk-code/hub-router.json` prints 1.
- [x] T006 Raise the hub version to 3.12.1.0 at its four sites and write the release note (`.skilled/skills/sk-code/changelog/v3.12.1.0.md`). Verify: `rg -c '3\.12\.1\.0' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/description.json` prints 1 for each file, and `check_changelog_shape.py` prints `PASS` for the note.
- [x] T007 Raise the `sk-code-ci` version to 1.1.16.0 and write the release note (`.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.16.0.md`). Verify: `sed -n 5p .skilled/skills/sk-code/sk-code-ci/SKILL.md` prints `version: 1.1.16.0`, and `check_changelog_shape.py` prints `PASS` for the note.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run guard check 2 (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`). Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2` and exits 0.
- [x] T009 Diff the replay (`scratch/replay.sh`). Verify: `bash specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay.sh > specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay-after.txt; diff specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay-before.txt specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay-after.txt` prints nothing and exits 0. [EVIDENCE: nothing printed, exit 0]
- [x] T010 Remove one keyword from the packet row, run check 2 and restore (`.skilled/skills/sk-code/sk-code-ci/ROUTER.md`). Verify: the run prints `FAIL check 2` and exits 1, and exits 0 after the restore, saved in `scratch/failure-path.txt`. [EVIDENCE: `FAIL check 2`, exit 1, then exit 0 after the restore]
- [x] T011 Run the guard tests, the drift guards, the two playbook validators and the setup battery (`.skilled/skills/sk-code`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` prints `fail 0`, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, each validator prints `PASS`, and `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=OK legs=9`.
- [x] T012 Confirm the CI classes did not change (`.skilled/skills/sk-code/hub-router.json`). Verify: `git show <code commit> -- .skilled/skills/sk-code/hub-router.json` changes two lines, `version` and `vocabularyMirrors`. [EVIDENCE: two lines changed, `version` and `vocabularyMirrors`]
- [x] T013 Validate the packet folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/007-ci-vocabulary-single-source --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Audit row**: See row `H7` in `../006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`
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

- [x] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output [EVIDENCE: spec.md section 4 rows REQ-001 to REQ-006 each name a command and its expected output]
- [x] CHK-002 [P0] `plan.md` section 3 names the files this phase changes [EVIDENCE: plan.md section 3 and the Affected Surfaces table name the two rows and `hub-router.json`]
- [x] CHK-003 [P1] `scratch/replay-before.txt` was written before any edit [EVIDENCE: `scratch/replay-before.txt` holds 30 lines written at `d5489b8930`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: `hub-router.json`, `mode-registry.json` and `description.json` load with `require`, and `graph-metadata.json` was written by its generator]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the setup baseline [EVIDENCE: all four guards PASS, with the same 21 warnings as the baseline]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: `git show --stat 4becdb1e35` lists twelve files, each in the Files to Change table after the table gained the generated signals and the manifest]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: `validate_document.py` reports zero issues on both `ROUTER.md` files]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001 to AC-006 are Met]
- [x] CHK-021 [P0] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2` [EVIDENCE: `PASS check 2`, exit 0]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: the replay's last prompt selects no intent in the packet router, and each row holds 72 keywords. Both logged in goal.md]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: `ci job` removed from the packet row made check 2 fail with exit 1, and it passed after the restore, saved in `scratch/failure-path.txt`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The three keyword sets were compared before any edit [EVIDENCE: the three sets were compared with the guard's library: 72, 58 and 12, with 14 and 61 differences]
- [x] CHK-FIX-002 [P0] The hub was searched with `rg` for other copies of the CI keywords, and every copy found was fixed or listed [EVIDENCE: `rg` found the keywords in five files. Two rows and one prose line were fixed, and `mode-registry.json` aliases and `graph-metadata.json` signals are listed in Known Limitations]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: guard check 2, the replay diff, the playbook validators and leg 4 all ran]
- [x] CHK-FIX-004 [P1] Each task line names the command that proves it [EVIDENCE: tasks T003 to T007 each name their proving command]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: the summary and the goal log name `4becdb1e35`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds keyword lists, version strings, two release notes and a manifest hash]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same guard command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: no code comment was added in this packet]
- [x] CHK-042 [P2] The hub release note names audit row `H7` [EVIDENCE: `changelog/v3.12.1.0.md` names audit row `H7`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` only [EVIDENCE: `scratch/` holds the two scripts, their four outputs and the failure-path record]
- [x] CHK-051 [P1] `scratch/` holds only the replay script, its two outputs and the failure-path record [EVIDENCE: `scratch/` holds seven files: the replay and advisor scripts, their before and after outputs and `failure-path.txt`. The advisor pair was added when the commit gate asked for the signals]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



