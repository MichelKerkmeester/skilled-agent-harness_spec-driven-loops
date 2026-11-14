---
title: "Tasks: Phase 9: document-corrections"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "document corrections tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: document-corrections

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

**Task variables**: `PARENT` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop`. `PHASE` is this phase folder. `FIX` is commit `be1aebb9f3`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the five findings this child fixes (`PARENT/039-hop-dialog-goal-title/research/research.md`). Verify: `rg -n 'Binding rows|Phase 033 says|rebase sentence|stale rows|playbook' research/research.md` prints the section 6 and section 9 rows.
  - **Evidence:** sections 6 and 9 name the parent binding, the 033 status, the sk-git sentence, the 038 child 011 rows and the playbook cases. Section 9 ranks them 11, 12, 13, 17 and 23.
- [x] T002 Measure the 002 parent goal before the edit (`PARENT/goal.md`). Verify: `node .skilled/hooks/goal/bin/goal.cjs packet <PARENT> --workspace <worktree root>` prints the durable character count and the budget.
  - **Evidence:** `scratch/goal-002-parent.txt` records `packet_durable_chars=3993` and `packet_budget=ok` after the edit, and 22 missing binding rows under the recorded exception.
- [x] T003 Confirm the phase 033 state and its saved validation (`PARENT/033-research-remediation/spec.md`). Verify: `rg -n '^\| \*\*Status\*\*|^\| [1-9] \|' <033>/spec.md` prints Complete for the status and each row.
  - **Evidence:** the status and all nine rows read Complete. `scratch/validate-033.txt` holds ten `RESULT: PASSED` lines with exit 0.
- [x] T004 Confirm the sk-git sentence and its fixture copy (`.skilled/skills/sk-git/SKILL.md`). Verify: `rg -n 'A rebase keeps an id' .skilled/skills/sk-git/SKILL.md .skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert` prints the skill line and the fixture copy.
  - **Evidence:** the skill sentence is at line 322. The fixture copy keeps the old wording and is not in the commit stat.
- [x] T005 Confirm the two stale rows and the live evidence in 038 child 011 (`PARENT/038-goal-and-workflow-resume/011-permission-mode-carry`). Verify: `rg -n 'live checks|default' <011>/implementation-summary.md` prints the two updated limitation rows.
  - **Evidence:** rows 1 and 3 name `scratch/live-checks.md` and the wrapper test `a live default permission mode replaces the launch mode`, which is `skilled-loop-wrapper-model-effort.test.cjs:919`.
- [x] T006 Confirm each playbook case name exists once (`session-relaunch-claude.md` and `session-relaunch-pi-opencode.md`). Verify: `rg -c '<case name>' <test file>` prints 1 for every named case.
  - **Evidence:** `agent_settled`, the Pi mode case, the two OpenCode sub-agent cases and the title case each print once in their test file. The HS-8 block now uses `cp` at line 929 of the Claude playbook.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add binding rows 038 and 039 and shorten D1 and D7 (`PARENT/goal.md`). Verify: `rg -n '^\| 038 \||^\| 039 \|' <PARENT>/goal.md` prints both rows, and the budget command prints `packet_budget=ok`.
  - **Evidence:** the rows read `| 038 | \`038-goal-and-workflow-resume/goal.md\` |` and `| 039 | \`039-hop-dialog-goal-title/goal.md\` |`. `scratch/goal-002-parent.txt` shows 3,993 characters.
- [x] T008 Set phase 033 Complete and tick criteria 1, 2, 3 and 5 (`<033>/spec.md` and `<033>/goal.md`). Verify: the status row prints Complete and the goal prints four ticked boxes plus the open criterion 4.
  - **Evidence:** the nine phase rows all read Complete. Criterion 4 stays open because no `relaunch.log` line was saved. Criterion 5 cites 1026 of 1026 and 62 of 62 from `scratch/criterion-5-033.txt`.
- [x] T009 Correct the sk-git rebase sentence (`.skilled/skills/sk-git/SKILL.md`). Verify: `sed -n '322p' .skilled/skills/sk-git/SKILL.md` prints the new sentence.
  - **Evidence:** line 322 now says a rebase keeps an id only when the replayed message still carries one, and a replayed message without an id gets a fresh one.
- [x] T010 Rewrite limitation rows 1 and 3 of the 038 child 011 summary and its stale continuity fields (`<011>/implementation-summary.md`). Verify: `rg -n 'were recorded after the build|A live .default. mode is carried' <011>/implementation-summary.md` prints both rows.
  - **Evidence:** row 1 names the two live facts and the open bypass question. Row 3 names the wrapper test. `CHK-004` in the child tasks stays unticked because the live facts came after the source edit.
- [x] T011 Correct the two playbooks (`session-relaunch-claude.md` and `session-relaunch-pi-opencode.md`). Verify: `rg -n '^version:' <both files>` prints 1.0.23.0 and 1.0.22.0.
  - **Evidence:** the Claude playbook uses `cp` in HS-8 and names the `deferredAt` stamp. The Pi and OpenCode playbook names `agent_settled` and the four added cases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-measure the parent goal and record the check-goal result (`PARENT/goal.md`). Verify: `node .skilled/hooks/goal/bin/goal.cjs packet <PARENT>` prints `packet_durable_chars=3993` and `packet_budget=ok`.
  - **Evidence:** `scratch/goal-002-parent.txt:2` and `:3`. `check-goal.cjs` prints `RESULT: FAILED (4/5 checks)` with 22 missing rows, each under the exception for 012 to 032 and 037.
- [x] T013 Validate phase 033 and its nine children recursively (`<033>`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <033> --recursive --strict` exits 0 and prints `RESULT: PASSED` ten times.
  - **Evidence:** `scratch/validate-033.txt` holds ten `Summary: Errors: 0  Warnings: 0` and ten `RESULT: PASSED` lines.
- [x] T014 Record the suite and Pi counts for 033 criterion 5 (`<033>/goal.md`). Verify: the saved file prints `tests 1026`, `pass 1026` and `Tests  62 passed (62)`.
  - **Evidence:** `scratch/criterion-5-033.txt:4`, `:6` and `:17`. The counts are 1026 of 1026 against 868 before phase 001, and 62 of 62 against 54.
- [x] T015 Check that the commit changes documents only (`FIX`). Verify: `git show --stat be1aebb9f3` lists fifteen files, and `git show be1aebb9f3 | rg -c '^new file'` prints 3, the three scratch files.
  - **Evidence:** the stat lists two skills, two playbooks, seven packet documents, three derived JSON files and three scratch text files. None is product code or a test.
- [x] T016 Validate this phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <PHASE> --strict` prints `RESULT: PASSED`.
  - **Evidence:** recorded in `goal.md` section 4.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/goal-002-parent.txt`, `scratch/validate-033.txt` and `scratch/criterion-5-033.txt` hold the parent, validation and count evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The research that named the fixes**: `../research/research.md` sections 6 and 9
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T007 blocks the parent goal proof.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7
- [x] CHK-002 [P0] Technical approach defined in plan.md, with the evidence rule stated
- [x] CHK-003 [P1] The research finding behind each of the five fixes is named (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code or test changed: `git show --stat be1aebb9f3` lists no file under `.skilled/hooks/session-relaunch/lib`, `bin` or `tests`
- [x] CHK-011 [P0] The three derived JSON files match their documents after `repair-derived.cjs --apply`
- [x] CHK-012 [P1] Every corrected sentence cites a saved run, a commit or a test line
- [x] CHK-013 [P1] The sk-git fixture copy is unchanged, so a byte comparison still passes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-007 pass with their named evidence
- [x] CHK-021 [P0] The parent goal prints `packet_durable_chars=3993` and `packet_budget=ok`
- [x] CHK-022 [P1] The phase 033 recursive validation prints ten PASSED lines, exit 0
- [x] CHK-023 [P1] No failing-first test is claimed, because no code or test changed and parent D1 lets the document fixes share one child
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: the parent binding and 033 status are `matrix/evidence`, the sk-git sentence and 038 summary rows are `instance-only`, and the playbook names are `cross-consumer`
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'A rebase keeps an id' .skilled/skills/sk-git .skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert` lists the skill and the untouched fixture
- [x] CHK-FIX-003 [P0] Consumer inventory: the parent goal table is read by `check-goal.cjs`, the playbook cases are read by their test files, and the 033 status is read by the parent phase map
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: five document groups, each either corrected or verified unchanged
- [x] CHK-FIX-006 [P1] N/A: no test runs against process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to commit `be1aebb9f3`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the documents hold no credential
- [x] CHK-031 [P0] N/A: no input validation path changes
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same five fixes and the same commit
- [x] CHK-041 [P1] The corrected documents keep their template headings and anchors
- [x] CHK-042 [P2] The two playbooks carry the versions the commit gate set: 1.0.23.0 and 1.0.22.0
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The three evidence files live under `scratch/` only
- [x] CHK-051 [P1] No temporary file was left outside `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
