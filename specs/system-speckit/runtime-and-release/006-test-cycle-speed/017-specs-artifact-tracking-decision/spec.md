---
title: "Feature Specification: Phase 17: specs-artifact-tracking-decision"
description: "The repository tracks 88,151 files in research, review, scratch and archive folders under specs/, and every CI job checks them out. This phase measures that footprint per category and writes the options for the operator. It deletes, moves and untracks nothing."
trigger_phrases:
  - "specs artifact tracking decision"
  - "phase 17 specs artifact tracking decision"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: specs-artifact-tracking-decision

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-local-test-timing-profile |
| **Successor** | None |
| **Handoff Criteria** | `scratch/artifact-inventory.md` holds the per-category counts and bytes, and `decision-record.md` lists three options with `Status: Proposed` for the operator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: Measure the tracked footprint of loop-state folders under `specs/` and write the option record. No file outside this packet is written, and no tracked file is deleted, moved or untracked.

**Dependencies**:
- Phase 007's research found that every CI job checks out the whole tree and left the tracking policy as its question 5.
- `git` with `ls-files` and `cat-file`, present in this checkout.

**Deliverables**:
- `scratch/artifact-inventory.md`: file counts and bytes for the repository, `specs/` and the four loop-state folder kinds, with the union.
- `decision-record.md`: three options, each `Proposed`, and the operator's decision point.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository tracks 134,068 files holding 2,242,571,276 bytes, and 88,151 of the 113,819 tracked files under `specs/` sit in `research/`, `review/`, `scratch/` or `z_archive/` folders. Those four categories account for 1,665,212,310 of the 1,998,297,810 bytes under `specs/`, so every CI job pays to check out loop state that no test runner collects. No recorded decision says whether that state should stay tracked, which leaves the cost as an unexamined default.

### Purpose
Record the per-category footprint and put three explicit options in front of the operator, so the tracking policy becomes a decision with evidence instead of an accident.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Command run at `68c409e2aa` on `worktrees/350-test-ci-wait-cuts`, 2026-11-12:

```text
{
printf '| Row | Files | Bytes |\n|---|---:|---:|\n'
printf '| all tracked files | %s | %s |\n' "$(git ls-files | wc -l | tr -d ' ')" "$(git ls-files -s | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
printf '| specs/ | %s | %s |\n' "$(git ls-files -- 'specs/' | wc -l | tr -d ' ')" "$(git ls-files -s -- 'specs/' | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
for d in research review scratch z_archive; do
  printf '| specs/**/%s/ | %s | %s |\n' "$d" "$(git ls-files -- ":(glob)specs/**/$d/**" | wc -l | tr -d ' ')" "$(git ls-files -s -- ":(glob)specs/**/$d/**" | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
done
printf '| union of the four categories | %s | %s |\n' "$( { for d in research review scratch z_archive; do git ls-files -- ":(glob)specs/**/$d/**"; done; } | sort -u | wc -l | tr -d ' ')" "$( { for d in research review scratch z_archive; do git ls-files -s -- ":(glob)specs/**/$d/**"; done; } | sort -u -t "$(printf '\t')" -k2,2 | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
}
| Row | Files | Bytes |
|---|---:|---:|
| all tracked files | 134068 | 2242571276 |
| specs/ | 113819 | 1998297810 |
| specs/**/research/ | 24097 | 430836210 |
| specs/**/review/ | 14604 | 417580430 |
| specs/**/scratch/ | 33454 | 668349668 |
| specs/**/z_archive/ | 29531 | 592408599 |
| union of the four categories | 88151 | 1665212310 |

$ git ls-files -- ':(glob)specs/**/scratch/**' | rg '\.(test|spec|vitest)\.(ts|js|mjs|cjs|tsx)$|_test\.py$|test_.*\.py$|\.bats$|\.test\.sh$' | wc -l
91
$ git ls-files -- 'specs/' | rg '\.(test|spec|vitest)\.(ts|js|mjs|cjs|tsx)$|_test\.py$|test_.*\.py$|\.bats$|\.test\.sh$' | wc -l
111
```

The per-category rows overlap: a file inside `scratch/.../research/` appears in both rows, so the four rows total more than the union. The union row is the one to quote for checkout size.

Phase 007 recorded 88,003 such files and 89 of its 97 non-archived test-census matches under `scratch/`. This run measures 88,151 and 91 of 111, so the footprint grew in between. That no runner collects the 91 files is taken from phase 007 section 9, which did not re-check it; this phase reads the vitest configs and finds no `specs/` include, but it does not run a collection to prove the absence.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the tracked-file count and byte size for the repository, for `specs/`, and for each of `research/`, `review/`, `scratch/` and `z_archive/` under `specs/`.
- Record the union of the four categories and the overlap, so the table is not read as a sum.
- Write `decision-record.md` with three options — keep everything tracked, stop tracking new loop state, or move archives out of the repository — each marked `Proposed`.
- Record that this phase deletes, moves and untracks nothing, and that the operator decides.

### Out of Scope
- Deleting tracked files — the operator has not chosen an option, and history keeps a deletion.
- Moving archives out of the repository — the operator has not chosen an option, and the destination is unknown.
- Untracking files or adding ignore rules — the operator has not chosen an option, and it would change what every job checks out.
- Changing CI checkouts or workflows — phases 008 to 011 own the CI changes.
- Editing the test census or vitest configs — the 91 test-suffixed files the census matches are measured, not removed.

**Regression impact**: this change stops catching no regression. It changes no test, workflow, hook or source file; it records numbers and options, and deletes, moves and untracks nothing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/artifact-inventory.md` | Create | The measurement: one row per category with files and bytes, the union, the overlap note and the command |
| `decision-record.md` | Create | Three Proposed options, what each changes, what each costs, and the operator as decider |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `scratch/artifact-inventory.md` records files and bytes for all tracked files, `specs/`, and each of the four categories | `rg -c '^\| (all tracked files\|specs/\|research\|review\|scratch\|z_archive) \|'` on the file prints 6 |
| REQ-002 | The inventory records the union of the four categories and states that the rows overlap | `rg -c '^\| union \|'` prints 1 and `rg -c '^\*\*Overlap\*\*:'` prints 1 |
| REQ-003 | `decision-record.md` lists exactly three options, each with `Status: Proposed` | `rg -c '^### Option'` prints 3 and `rg -c '\*\*Status\*\*: Proposed'` prints 3 |
| REQ-004 | `decision-record.md` states that nothing is deleted, moved or untracked in this phase, and names the operator as decider | `rg -n 'Delete, move and untrack nothing'` prints one line and `rg -n '\*\*Decider\*\*.*operator'` prints one line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The inventory records the branch, HEAD commit and measurement date so the numbers can be reproduced | `rg -c '^\- \*\*(Branch\|HEAD\|Measured)\*\*:'` prints 3 |
| REQ-006 | The packet passes strict validation with no unfilled token | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict --quiet` prints `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/artifact-inventory.md` exists and its table holds six measured rows plus the union row, each with a files value and a bytes value.
- **SC-002**: `decision-record.md` exists, lists three options, and every option is `Proposed` with no option `Accepted`.
- **SC-003**: `git diff --name-only -- <packet>` prints nothing, so the phase changed no tracked file.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git ls-files` and `git cat-file` | No measurement can be taken | Record the command and the commit with the numbers; rerun the command rather than copying a figure |
| Risk | The numbers drift as other packets write under `specs/` | A reader treats a stale count as current | Record the branch, HEAD and date, and label every number as of that commit |
| Risk | The four category globs overlap | Per-category rows sum to more than the tree | Publish the union row and the overlap note beside them |
| Risk | A Proposed option is read as an approval | Work starts before the operator decides | Every option carries `Status: Proposed`, and the record names the operator as decider |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which option the operator chooses. Decision: deferred; all three stay `Proposed` and this phase implements none.
- Under option B, are existing tracked logs untracked later, or only new writes ignored? Decision: the record must state which before option B is acted on.
- Where do archives move under option C? Decision: UNKNOWN; the record names the destination as part of that option's cost.
<!-- /ANCHOR:questions -->

---
