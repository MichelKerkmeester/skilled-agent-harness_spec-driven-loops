---
title: "Tasks: Phase 1: finding-verification"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "finding verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: finding-verification

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

Run every command from the repository root. A path with no folder in front of it, such as `findings-ledger.md` or `scratch/`, is inside `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/` in phase 001 and inside this phase folder elsewhere.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the three raw reports are present (`scratch/`). Verify: `ls scratch/deepseek-sk-code-*.log | wc -l` prints 3.
- [ ] T002 Confirm the open row count before work starts (`findings-ledger.md`). Verify: `grep -c '| Unverified |' findings-ledger.md` prints 37.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Check rows `SK-02` to `SK-15` against the cited files and write each verdict and command (`findings-ledger.md`). Verify: `grep -c '^| SK-.*| Unverified |' findings-ledger.md` prints 0.
- [ ] T004 Check rows `RV-03` to `RV-13` against the cited files and write each verdict and command (`findings-ledger.md`). Verify: `grep -c '^| RV-.*| Unverified |' findings-ledger.md` prints 0.
- [ ] T005 Check rows `QL-03` to `QL-14`, except `QL-06`, against the cited files and write each verdict and command (`findings-ledger.md`). Verify: `grep -c '^| QL-.*| Unverified |' findings-ledger.md` prints 0.
- [ ] T006 Compare the motion reference sections with the four topic files and write the duplicated rule ids in row `F7` (`findings-ledger.md`). Verify: `grep -c '^| F7 .*| Unverified |' findings-ledger.md` prints 0.
- [ ] T007 Run every probe through the compiled router and save the output (`scratch/router-baseline.txt`). Verify: `grep -c '"action"' scratch/router-baseline.txt` prints 22.
- [ ] T008 Run the setup battery and the drift guards and save the output (`scratch/setup-baseline.txt`). Verify: `grep -c '^STATUS=' scratch/setup-baseline.txt` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Count the open rows (`findings-ledger.md`). Verify: `grep -c '| Unverified |' findings-ledger.md` prints 0.
- [ ] T010 Count the rows without evidence (`findings-ledger.md`). Verify: `grep -c '| TBD |' findings-ledger.md` prints 0.
- [ ] T011 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `grep -c '| Unverified |' findings-ledger.md` prints 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings ledger**: See `../001-finding-verification/findings-ledger.md`
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

- [ ] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] CHK-002 [P0] `plan.md` section 3 names the files this phase changes
- [ ] CHK-003 [P1] The predecessor phase's handoff criteria are met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"`
- [ ] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline
- [ ] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat`
- [ ] CHK-013 [P1] Changed documents keep their frontmatter and section order
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] CHK-021 [P0] `grep -c '| Unverified |' findings-ledger.md` prints 0
- [ ] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log
- [ ] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts
- [ ] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed
- [ ] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran
- [ ] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix
- [ ] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No changed file holds a credential or an environment value
- [ ] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command
- [ ] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id
- [ ] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files live in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds only files a later phase reads
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 0/10 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. Planning date 2026-11-14.
<!-- /ANCHOR:summary -->

---



