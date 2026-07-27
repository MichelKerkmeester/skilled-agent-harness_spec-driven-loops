---
title: "Feature Specification: design-interface changelog conformance"
description: "Audit the 2 files under design-interface/changelog/ against changelog-template.md §7; one file (v1.0.0.0-foundations.md) describes a different sk-design mode, not design-interface."
trigger_phrases:
  - "design-interface changelog conformance"
  - "changelog cross-mode contamination"
  - "foundations changelog entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/009-changelog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Confirmed v1.0.0.0-foundations.md documents a different mode's release"
    next_safe_action: "Confirm foundations mode-consolidation history, then decide disposition"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/changelog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface changelog conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `008-manual-testing-playbook` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`changelog/` holds exactly 2 files: `v1.0.0.0.md` (65 lines, titled "interface v1.0.0.0 - Data-backed and Claude Design parity", genuinely about `design-interface`) and `v1.0.0.0-foundations.md` (21 lines, titled "foundations v1.0.0.0 - Initial Release"). Reading the second in full: it describes "the static visual-system child in the `sk-design` family" with its own `SKILL.md`, its own `references/` under `color/`, `type/`, and `layout/`, and its own `feature-catalog/`/`manual-testing-playbook/` — none of which is `design-interface`'s changelog subject. This is not a template-format defect (both files use the correct 2-field frontmatter `changelog-template.md` §7 nested-packet convention implies); it is a file that documents a **different mode's** release sitting inside `design-interface`'s own `changelog/` directory. It corroborates the `foundations-*` residue hypothesis raised independently in `008-manual-testing-playbook`.

### Purpose
Confirm whether `foundations` was a standalone `sk-design` mode later consolidated into `design-interface` (its `references/foundations/{color,layout,type}/` subtree strongly suggests this), and if so, decide whether `v1.0.0.0-foundations.md` should move to wherever that consolidation's history is now tracked, be folded into `design-interface`'s own `v1.0.0.0.md` narrative, or be kept as-is with a documented rationale.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `changelog/v1.0.0.0.md`
- `changelog/v1.0.0.0-foundations.md`

### Out of Scope
- `references/`, `assets/`, `procedures/`, `corpus/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/` — sibling children (though `008-manual-testing-playbook` shares this same root-cause investigation for its own `foundations-*` finding — coordinate rather than duplicate the git-history search).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `changelog/v1.0.0.0.md` | Audit | Confirmed on-topic for `design-interface`; verify against `changelog-template.md` §7 nested-packet conventions |
| `changelog/v1.0.0.0-foundations.md` | Audit/Modify | Confirmed off-topic — documents a different mode's release; disposition pending root-cause confirmation and operator sign-off |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm the `foundations` mode-consolidation history | Root cause documented with evidence (shared with `008-manual-testing-playbook`'s investigation, not duplicated) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Disposition decided and applied for `v1.0.0.0-foundations.md` | Operator sign-off recorded before move/merge/delete |
| REQ-003 | `v1.0.0.0.md` confirmed conformant with `changelog-template.md` §7 | Verdict recorded |
| REQ-004 | Confirm no other file exists under `changelog/` beyond the 2 accounted for in scope | Fresh `find changelog -type f` matches the scope table |
| REQ-005 | If `v1.0.0.0-foundations.md` moves, confirm no other doc in `design-interface` links to it by its current path | `rg` for the filename repo-wide before any move |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `changelog/` contains only entries that document `design-interface`'s own releases, or the presence of `v1.0.0.0-foundations.md` has an explicit, operator-approved rationale for staying.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `008-manual-testing-playbook`'s parallel `foundations-*` investigation | Duplicated git-history research effort if not coordinated | Share the root-cause finding between both children rather than re-researching independently |
| Risk | Deleting `v1.0.0.0-foundations.md` without confirming where (or whether) that history is preserved elsewhere | Loss of the only record of the `foundations` mode's initial release | Confirm a landing spot (or explicit operator acceptance of removal) before deleting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where should `v1.0.0.0-foundations.md`'s content live if `foundations` was consolidated into `design-interface`: folded into `design-interface`'s own changelog narrative, moved to whatever packet now owns the consolidation history, or kept as a standalone historical record?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing template**: `.opencode/skills/sk-doc/shared/assets/changelog-template.md` §7
- **Related finding**: `../008-manual-testing-playbook/spec.md` (the `foundations-*` procedure-card-contract residue, same root-cause question)
