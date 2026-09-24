---
title: "Feature Specification: Phase 59: Phase-map sync normalization"
description: "The phase-map sync tool rewrote parent map rows that already agreed with their child, pasted a child's free-text note into the map, stopped silently at a blank line, and rewrote completion_pct in spec.md files no reader uses."
trigger_phrases:
  - "phase map sync normalization"
  - "sync phase map status"
  - "phase documentation map rows"
  - "completion pct report only"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 59: Phase-map sync normalization

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 59 of 62 |
| **Predecessor** | 058-upgrade-level-section-fragments |
| **Successor** | 060-save-resume-pointer-truth |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 59** of the system-spec-kit v4 specification, the fourth of the fix phases planned after phase 051 shipped. A dry run of the tool on the v4 parent proposed changes that were mostly wrong, so the tool is fixed here and the parent's own map is repaired by hand in a later phase.

**Scope Boundary**: `sync-phase-map-status.ts`, its test and its README entry. The tool is not run on any real parent.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run on the v4 parent, `sync-phase-map-status.ts` proposed 38 map-row changes. 35 of them only changed the status's case, because the tool compared the map cell and the child's status exactly. One copied a child's whole free-text status note into the map. The tool stopped reading the table at a blank line, so it never saw the rows after it and said nothing about them, or about children with no row at all. It also proposed rewriting `completion_pct` in 31 descendant `spec.md` files, although readers take completion from the implementation summary, so those writes would change fingerprints and nothing a reader uses.

### Purpose
The tool rewrites only rows that disagree with their child, writes a status rather than a note, says when it cannot see part of the table, and reports completion mismatches instead of writing them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Case-insensitive agreement, and agreement between completion words such as "Done" and "Complete", so the parent's own wording stays.
- Only the leading status from a child's status cell.
- Warnings for a blank line inside the table and for children with no row.
- `completion_pct` mismatches reported, never written.

### Out of Scope
- Running the tool on the v4 parent. Its map is repaired by hand in phase 062.
- The fixture folder, which the new tests do not need.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/sync-phase-map-status.ts` | Modify | Agreement check, leading status, warnings, report-only completion |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-phase-map-status.vitest.ts` | Modify | One test per change; two existing tests follow the report-only rule |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | The tool's entry says what it now does |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A row that already agrees is left alone. | A map row `complete` or `Done` against a child `Complete` produces no change. |
| REQ-002 | The map gets a status, not a note. | A child status `Complete (shipped in the v4 release)` turns a `Draft` row into `Complete`. |
| REQ-003 | completion_pct is never written. | Mismatches are returned and printed; no descendant `spec.md` changes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The tool says what it cannot see. | A blank line inside the table and a child with no row each produce a warning naming them. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test fails against the previous tool.
- **SC-002**: The suite passes and the CLI project typechecks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller relied on the tool writing completion_pct | Low | A repository search found no caller beyond its own test; two READMEs describe it |
| Risk | The leading-status rule cuts a status that contains punctuation | Low | Real statuses are one or two words; the cut happens only at a bracket, a colon, a semicolon, a comma, a period or a spaced dash |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved this fix as part of the planner's recommended plan.
<!-- /ANCHOR:questions -->

---
