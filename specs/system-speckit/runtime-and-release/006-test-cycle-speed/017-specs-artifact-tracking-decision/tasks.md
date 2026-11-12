---
title: "Tasks: Phase 17: specs-artifact-tracking-decision"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "specs artifact tracking decision tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: specs-artifact-tracking-decision

<!-- SPECKIT_LEVEL: 1 -->

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

| Variable | Value |
|----------|-------|
| `P` | `specs/system-speckit/runtime-and-release/006-test-cycle-speed/017-specs-artifact-tracking-decision` |
| `V` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the inventory header with the branch, HEAD and date (`$P/scratch/artifact-inventory.md`). Verify: `rg -c '^\- \*\*(Branch|HEAD|Measured)\*\*:' $P/scratch/artifact-inventory.md` prints 3.
- [x] T002 Record the measurement script from `spec.md` verbatim under a `## Command` heading (`$P/scratch/artifact-inventory.md`). Verify: `rg -c 'cat-file --batch-check' $P/scratch/artifact-inventory.md` prints 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Fill the six measurement rows with a `Category`, `Path pattern`, `Files` and `Bytes` column for all tracked files, `specs/`, research, review, scratch and z_archive (`$P/scratch/artifact-inventory.md`). Verify: `rg -c '^\| (all tracked files|specs/|research|review|scratch|z_archive) \|' $P/scratch/artifact-inventory.md` prints 6.
- [x] T004 Add the union row and the overlap note that says the four patterns nest (`$P/scratch/artifact-inventory.md`). Verify: `rg -c '^\| union \|' $P/scratch/artifact-inventory.md` prints 1 and `rg -c '^\*\*Overlap\*\*:' $P/scratch/artifact-inventory.md` prints 1.
- [x] T005 Write three options — keep everything tracked, stop tracking new loop state, move archives out of the repository — each with `**Status**: Proposed` (`$P/decision-record.md`). Verify: `rg -c '^### Option' $P/decision-record.md` prints 3 and `rg -c '\*\*Status\*\*: Proposed' $P/decision-record.md` prints 3.
- [x] T006 Add the no-action section, the line that the phase stops catching no regression, and the operator as decider (`$P/decision-record.md`). Verify: `rg -c 'Delete, move and untrack nothing' $P/decision-record.md` prints 1, `rg -c 'stops catching no regression' $P/decision-record.md` prints 1 and `rg -c '\*\*Decider\*\*.*operator' $P/decision-record.md` prints 1.
- [x] T007 Point the decision record at the inventory instead of restating its numbers (`$P/decision-record.md`). Verify: `rg -c 'scratch/artifact-inventory.md' $P/decision-record.md` prints at least 1 and `rg -c '1665212310' $P/decision-record.md` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the measurement and confirm the inventory table matches this tree (`$P/scratch/artifact-inventory.md`). Verify: `git ls-files | wc -l` prints 134068 at HEAD `68c409e2aa`; a different value means the header's HEAD and date are updated before the numbers are quoted.
- [x] T009 Confirm no option has moved past Proposed (`$P/decision-record.md`). Verify: `rg -c '\*\*Status\*\*: (Accepted|Rejected)' $P/decision-record.md` prints 0.
- [x] T010 Confirm the phase changed no tracked file in this packet (`$P/spec.md`). Verify: `git diff --name-only -- $P` prints nothing.
- [x] T011 Validate the packet (`$P/tasks.md`). Verify: `$V $P --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/artifact-inventory.md` and `decision-record.md` exist, every option is `Proposed`, and no tracked file was deleted, moved or untracked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
- **Source research**: See `../007-test-and-ci-bloat-research/research/research.md` section 3 and question 5
<!-- /ANCHOR:cross-refs -->

---
