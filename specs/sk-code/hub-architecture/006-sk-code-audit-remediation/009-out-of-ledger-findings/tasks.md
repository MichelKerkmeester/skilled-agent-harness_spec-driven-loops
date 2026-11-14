---
title: "Tasks: Phase 9: out-of-ledger-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "out of ledger findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: out-of-ledger-findings

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

Run every command from the repository root. A path with no folder in front of it, such as `goal.md` or `scratch/`, is inside this phase folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read each cited line and confirm the finding still holds (`spec.md`). Verify: the five commands in `spec.md` Measured Behavior print what that block shows. [EVIDENCE: the five commands printed what the Measured Behavior block shows, at `dee8838e83`]
- [x] T002 Record the guard baseline (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`). Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED`. [EVIDENCE: `all 4 guards PASSED`, 21 warnings]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Name the history-comment rule in place of the dropped id (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md`). Verify: `rg -c 'CHK-CMT' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md` prints nothing and exits 1.
- [x] T004 [P] Drop the id from the comment-rules sentence (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md`). Verify: `rg -c 'CHK-CMT' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md` prints nothing and exits 1.
- [x] T005 Rename `OpenCode system code` to `SKILLED system code` (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'OpenCode system code' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [x] T006 [P] Write the two guard paths so they resolve from the README's folder (`.skilled/skills/sk-code/sk-code-skilled/scripts/README.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/sk-code/sk-code-skilled/scripts/README.md` prints a `PASS` line with `unresolved=0`.
- [x] T007 [P] Add the two resolver tests to the test table (`.skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -c '^\| `scripts/tests/' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md` prints 9.
- [x] T008 [P] Remove the `lite` clause from the M-1 row (`.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/minimum-evidence-gate.md`). Verify: `rg -c 'depth alias maps' .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/minimum-evidence-gate.md` prints nothing and exits 1.
- [x] T009 [P] Rename `OpenCode` to `SKILLED` on three lines (`.skilled/skills/sk-code/sk-code-quality/README.md`). Verify: `rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1.
- [x] T010 Rename `OpenCode` to `SKILLED` in the language-files row of the load table (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'OpenCode' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints 1.
- [x] T011 Raise the `sk-code-skilled` version to 2.2.1.0 and write its release note (`.skilled/skills/sk-code/sk-code-skilled/changelog/v2.2.1.0.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-code/sk-code-skilled/changelog/v2.2.1.0.md` prints `PASS`, and `sed -n 5p .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints `version: 2.2.1.0`.
- [x] T012 Raise the `sk-code-review` version to 1.9.18.0 and write its release note (`.skilled/skills/sk-code/sk-code-review/changelog/v1.9.18.0.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-code/sk-code-review/changelog/v1.9.18.0.md` prints `PASS`, and `sed -n 5p .skilled/skills/sk-code/sk-code-review/SKILL.md` prints `version: 1.9.18.0`.
- [x] T013 Raise the `sk-code-quality` version to 1.13.21.0 and write its release note (`.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.21.0.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-code/sk-code-quality/changelog/v1.13.21.0.md` prints `PASS`, and `sed -n 5p .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints `version: 1.13.21.0`.
- [x] T014 Tick `CHK-012` of phase 002 with the operator's answer as evidence (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach/tasks.md`). Verify: `grep -c '^- \[ \] CHK-012' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach/tasks.md` prints 0. [EVIDENCE: the count is 0, and the P1 summary row reads 12/12]
- [x] T015 Get a second reading of when the MCP server checklist applies and record the comparison (`goal.md`). Verify: `grep -c 'MCP server checklist selector' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings/goal.md` prints 1 or more. [EVIDENCE: one row in the goal log compares the second reading with the selector]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Confirm no document cites the dropped id (`.skilled/skills/sk-code`). Verify: `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1.
- [x] T017 Run the packets' tests, the drift guards and the setup battery (`.skilled/skills/sk-code`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` and `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` print `fail 0`, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, and `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=OK legs=9`.
- [x] T018 Confirm the phase touched only its three packets (`.skilled/skills/sk-code`). Verify: `git show --stat <code commit>` lists only files under `sk-code-skilled/`, `sk-code-review/` and `sk-code-quality/`. [EVIDENCE: `git show --stat 7f35cb2db1` lists twelve files, all under the three packets]
- [x] T019 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Source findings**: See the `goal.md` logs of `../006-skilled-packet-fixes/`, `../007-review-packet-fixes/` and `../008-quality-packet-fixes/`
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

- [x] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output [EVIDENCE: spec.md section 4 rows REQ-001 to REQ-010 each name a command or a record and its expected state]
- [x] CHK-002 [P0] `plan.md` section 3 names the files this phase changes [EVIDENCE: plan.md section 3 and the Affected Surfaces table name the three packets and their documents]
- [x] CHK-003 [P1] The predecessor phase's handoff criteria are met [EVIDENCE: phase 008 closed in `6ebfbe6f1f`, and no `QL` row has a dash as its fix evidence]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: N/A: no JSON file changed in this phase. The commit hook re-minted both manifests with no diff]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline [EVIDENCE: all four guards PASS, with the same 21 warnings as the baseline]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: `git show --stat 7f35cb2db1` lists twelve files, all under the three packets. `002-frontend-reach/tasks.md` is in the docs commit and in the table]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: the changed documents keep their frontmatter and section order, and `validate_document.py` reports zero issues on five of them]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001 to AC-010 are Met]
- [x] CHK-021 [P0] `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1 [EVIDENCE: nothing printed, exit 1]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: every finding held, so the empty case did not arise. All eight documents changed in one commit. Both logged in goal.md]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: a dead path added to the scripts README made the reference check print `FAIL` and exit 1. The file was restored and the check exited 0, saved in `scratch/failure-path.txt`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding this phase owns was read at its cited line before its task started [EVIDENCE: each cited line was printed and read before the briefs were written]
- [x] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed [EVIDENCE: `rg` found the old id in two documents, both fixed, and in one benchmark report, a record that stays. It found `OpenCode` for the tree on two more lines of `sk-code-skilled/SKILL.md`, listed]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: the task verify commands, the packet tests, the drift guards and the playbook validators all ran]
- [x] CHK-FIX-004 [P1] Each task line names the command that proves its fix [EVIDENCE: tasks T003 to T013 each name their proving command]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: the summary and the goal log name `7f35cb2db1`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds prose, table rows, three release notes and version strings]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same validate.sh command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: no code comment was added in this phase]
- [x] CHK-042 [P2] Each packet release note names the documents this phase fixed [EVIDENCE: the three release notes name the documents fixed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` only [EVIDENCE: `scratch/failure-path.txt` is the only working file]
- [x] CHK-051 [P1] `scratch/` holds only files a later phase reads [EVIDENCE: `scratch/failure-path.txt` is the failure-path evidence the summary cites]
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



