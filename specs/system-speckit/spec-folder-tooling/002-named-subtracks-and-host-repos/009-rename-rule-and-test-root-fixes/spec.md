---
title: "Feature Specification: Phase 9: rename-rule-and-test-root-fixes"
description: "Phase 8 regrouped ten spec tracks into 39 sub-tracks, and its moves exposed dead live locators in historical spec documents. Two approved follow-ups update the rename rule and correct the repository-root calculation in two shell tests."
trigger_phrases:
  - "rename rule and test root fixes"
  - "phase 9 rename rule and test root fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: rename-rule-and-test-root-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/336-subtrack-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-track-subtrack-regrouping |
| **Successor** | None |
| **Handoff Criteria** | None: the approved follow-ups are implemented, the two shell tests report passing results and `check_changelog_shape.py` prints `PASS` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Sub-track gap fixes. Phase 8 regrouped ten spec tracks into 39 sub-tracks, and two follow-ups came from that work. The operator approved both on 2026-11-10.

**Scope Boundary**: The `Historical spec docs` row in section 2 of `rename-pattern.md`, the `REPO` path in two shell tests, the changelog entry and the system-spec-kit version.

**Dependencies**:
- Phase 8 moved the packets and exposed the dead live locators.
- The shell tests derive paths from `BASH_SOURCE`.

**Deliverables**:
- Permit moved-path updates only for live locators when the link check would fail, while preserving historical content.
- Add one `/..` to the `REPO` line in each affected shell test.
- Add the `2.12.45.0` changelog entry and raise the system-spec-kit version.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phase 8 moved 174 packets, and the rename rule prevented historical spec docs from updating live locator paths, so the repository markdown link check fails on dead paths. Two shell tests climbed only to `.skilled/`, which made one validator path missing and yielded zero counts while the graph containment test could not find its compiled parser.

### Purpose
Historical documents retain their content while live locators can follow moved paths, and both shell tests resolve paths from the repository root.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
N/A: The supplied facts include test result summaries but not exact command invocations or verbatim output. The results are recorded here as summaries.

`fingerprint-docset-generation.sh`: before, 4 passed and 3 failed. After, 7 passed and 0 failed. The four baseline passes were cases that expect 0.

`graph-metadata-write-containment.sh`: before, `SKIP: compiled parser absent` on every run. After, 7 passed and 0 failed, with one skipped case: `symlinked sibling-repo track, none present`.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Update the `Historical spec docs` row in `rename-pattern.md` with the approved live-locator exception.
- Add one `/..` to the `REPO` line in each of the two affected shell tests.
- Add `v2.12.45.0.md` and raise the system-spec-kit version to `2.12.45.0`.

### Out of Scope
- Changing the validator or test cases - the reported failures came from the scripts' repository-root paths.
- Changing other rename-rule rows - the approved wording applies only to `Historical spec docs`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/rename-pattern.md` | Modify | Update the `Historical spec docs` rule while preserving content |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/fingerprint-docset-generation.sh` | Modify | Add one `/..` to the `REPO` path |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-write-containment.sh` | Modify | Add one `/..` to the `REPO` path |
| `.skilled/skills/system-spec-kit/changelog/v2.12.45.0.md` | Create | Record the release changes |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Raise the version from `2.12.44.0` to `2.12.45.0` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No P0 blocker was assigned to this P2 follow-up | N/A: the packet priority is P2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Preserve historical spec content while allowing a moved path update only when it is a live locator and the link check would otherwise fail | The `Historical spec docs` row uses the approved wording |
| REQ-003 | Correct the repository-root calculation in both affected shell tests | The results recorded in Measured Behavior show both tests passing, with the stated skip for the graph containment test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The `Historical spec docs` row preserves content and permits a moved live locator update only when the link check would otherwise fail.
- **SC-002**: Both shell tests report the completed results recorded in Measured Behavior, and `check_changelog_shape.py` prints `PASS`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Repository markdown link check | Moved live locators remain reported as dead paths | Update only the moved live locator while preserving historical content |
| Risk | The exception could be read as permission to edit historical content | Med | Keep the rule explicit that content is preserved and only a live locator may be updated when the link check would fail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. Both follow-ups were approved on 2026-11-10.
<!-- /ANCHOR:questions -->

---


