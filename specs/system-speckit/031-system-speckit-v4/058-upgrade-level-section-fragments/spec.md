---
title: "Feature Specification: Phase 58: Upgrade-level section fragments"
description: "upgrade-level.sh built each level's additions from a line diff of two template renders, so an upgrade injected changed lines as well as new sections: a second frontmatter title, a second level marker, header-less table rows, and no executive summary at level 3."
trigger_phrases:
  - "upgrade level section fragments"
  - "upgrade-level stray lines"
  - "derive addendum fragment"
  - "level upgrade malformed docs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 58: Upgrade-level section fragments

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
| **Phase** | 58 of 62 |
| **Predecessor** | 057-continuity-reader-vocabulary-and-flow-lists |
| **Successor** | 059-phase-map-sync-normalization |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 58** of the system-spec-kit v4 specification, the third of the fix phases planned after phase 051 shipped. Upgrading phase 050 from level 1 to level 2 left its docs malformed, and they had to be rewritten by hand.

**Scope Boundary**: `upgrade-level.sh` and one new test. Packets upgraded earlier are not repaired.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-level.sh` works out what a level adds by rendering each document template at the old and the new level and keeping every line `diff` marks as new. A line that only changed between the two renders counts too, and so does anything above the first heading. On a level 1 packet upgraded to level 3, every document gains a second frontmatter `title:` line and a second level marker. spec.md also gains a stray `| **Level** |` row and two requirement tables with no header, and tasks.md gains a doubled divider. The section matcher also keeps the `## ` of an unnumbered heading in its key, so it never finds `## EXECUTIVE SUMMARY`, and a level 3 spec.md gets none.

### Purpose
An upgrade adds only whole sections the new level has and the packet lacks, and every upgraded document keeps one frontmatter block, one level marker and well-formed tables.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Derive each level's additions as whole `## ` sections, with their anchors and sub-headings, never as changed lines.
- One heading key that ignores a leading number whether or not the heading has one.
- A test that upgrades a fresh level 1 packet to levels 2 and 3 and checks the documents' shape.
- Found while verifying: a document the upgrade creates got its level marker inside its YAML frontmatter, and kept the template's placeholder identity. Both made a freshly upgraded packet fail strict validation, so both are fixed here.

### Out of Scope
- Repairing packets that were upgraded before this fix.
- The level 3 to 3+ path beyond what the shared functions change.
- Where the level 2 to 3 step inserts the executive summary relative to the metadata anchor; the level 3 template's own anchor layout is left as it is.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Modify | Section-level fragment derivation and one heading key |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-level-sections.vitest.ts` | Create | Upgrades a fresh packet and checks document shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An upgrade injects only whole new sections. | After level 1 to 2 and level 1 to 3, spec.md, plan.md and tasks.md each have one `title:` line, one level marker, no repeated heading, balanced anchors, no doubled divider and no header-less table. |
| REQ-002 | A level 3 spec gets its executive summary. | After level 1 to 3, spec.md has `## EXECUTIVE SUMMARY` once, and one RISK MATRIX and one USER STORIES heading. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Existing upgrade behavior holds. | `test-upgrade-level.sh` still passes 14 of 14. |
| REQ-004 | A freshly upgraded packet passes strict validation. | A level 1 packet upgraded to 2, and one upgraded to 3, each give `RESULT: PASSED`; created documents carry the packet's identity and their level marker below the H1. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new test passes, and fails against the previous script.
- **SC-002**: The existing shell test passes unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The callers strip leading comment lines from a fragment, which could drop an opening anchor | Medium | The test checks every anchor opens and closes once |
| Risk | The level 2 to 3 path cuts its suffix at `## 10. RISK MATRIX` | Medium | The level 3 case checks RISK MATRIX and USER STORIES land once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved the planner's recommendation on 2026-09-23.
<!-- /ANCHOR:questions -->

---
