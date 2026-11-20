---
title: "Feature Specification: create.sh adds a row to an un-anchored parent phase map"
description: "create.sh --phase --parent appended a second PHASE DOCUMENTATION MAP to a parent whose map had no phase-map anchor. It now wraps that map in the anchor and adds the row to its table."
trigger_phrases:
  - "phase map unanchored append"
  - "duplicate phase documentation map"
  - "create sh parent phase map anchor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: create.sh adds a row to an un-anchored parent phase map

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
| **Created** | 2026-11-20 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-write-recipe-fixes |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the spec folder lifecycle parent, a follow-up to the packet creation work in `003-spec-folder-tooling/`.

**Scope Boundary**: The parent phase-map append branch of `create.sh` and its shell regression suite.

**Dependencies**:
- None

**Deliverables**:
- The un-anchored map fix in `create.sh` and one regression case in `test-phase-system.sh`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`create.sh --phase --parent` looked for the existing map only by its `phase-map` anchor comment. A parent written by hand has the `## Phase Documentation Map` heading and table without that anchor, so the scaffolder appended a second, template-shaped map at the end of the file. The agent that created the `015-reducer-test-focus-contract` child of the expansive depth mode parent had to fold that duplicate back by hand.

### Purpose
Adding a phase to a parent whose map has no anchor adds one row to the existing table and wraps the map in the anchor, so later appends take the anchored path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh   # new case, create.sh before the fix
  FAIL: Expected one map heading and one anchor pair, got 2 headings, 1 open and 1 close anchors
  FAIL: Expected '| 2 | 002-follow-up/ | Pending | [Phase 2 scope] |' directly after the existing row
  FAIL: Append added a handoff table to a hand-written map
  Results: 12 passed, 3 failed (of 15)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Detect an un-anchored map by the `## PHASE DOCUMENTATION MAP` heading, matched without regard to case as `sync-phase-map-status.ts` matches it
- Wrap that section in the `phase-map` anchor pair, closing it before the next level-2 heading, rule or anchor, or at the end of the file
- Order the new row's cells by the existing table's header, so a Phase, Folder, Status, Description table gets `Pending` in its Status column
- Add one regression case to `test-phase-system.sh`

### Out of Scope
- The anchored append path - it already adds rows correctly and is not changed
- The column order difference between the phase-parent template and `phase-definitions.md` §3 - a documentation question, not this defect

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Wrap an un-anchored map in the anchor and order new rows by its header |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` | Modify | Regression case for a hand-written, un-anchored map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An append to an un-anchored map leaves one map | `test-phase-system.sh` passes "Un-anchored map stays a single section and gains one phase-map anchor pair" |
| REQ-002 | The new row continues the existing table in its column order | `test-phase-system.sh` passes "Row lands under the last existing row with cells in the table's own column order" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The anchored append path is unchanged | The 12 existing cases in `test-phase-system.sh` still pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `bash tests/test-phase-system.sh` prints `Results: 15 passed, 0 failed (of 15)`
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The heading match in `sync-phase-map-status.ts` | The two tools would disagree on which section is the map | The new detection uses the same heading pattern |
| Risk | A heading with no table under it | Med | Detection requires a table row after the heading; without one the old append path still runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None
<!-- /ANCHOR:questions -->

---
