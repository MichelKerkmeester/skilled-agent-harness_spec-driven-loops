---
title: "Feature Specification: Changelog format, retrofit, release line and spacing"
description: "Defines narrative and spacing rules for skill changelogs and the Skilled release line."
trigger_phrases:
  - "changelog v4 narrative format"
  - "skill changelog retrofit"
  - "skilled framework release notes"
  - "changelog section spacing"
  - "searchable component changelogs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-056-changelog-system"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Changelog format, retrofit, release line and spacing

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 056-changelog-system |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog template prescribed machine-era tables and stale paths, and its workflow did not enforce the concise narrative style established by v4.0.0.0. Hundreds of skill changelog entries still used older formats, while changelogs lacked a separate Skilled release line and were hard to find. The prescribed section spacing also did not match the intended reading rhythm.

### Purpose
Produce concise why-first changelogs with enforced voice and omission rules. Bring skill histories into the current format while preserving shipped facts. Give the Skilled framework its own release line and improve changelog discovery. Apply consistent section spacing to entries and release notes.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the sk-create-changelog template and workflow for the v4 narrative style with voice and omission rules.
- Update skill changelog entries to the compact and expanded formats while keeping every shipped fact.
- Give the Skilled framework a separate release line and improve changelog discovery.
- Set section spacing for changelog entries and release notes.

### Out of Scope
- Changing the software features described by changelog entries.

### Files to Change
Each row identifies one child phase and its purpose.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| specs/sk-doc/document-standards/003-changelog-system/001-sk-create-changelog-v4-style/ | Phase | 001-sk-create-changelog-v4-style | Defines the narrative template and validation rules. |
| specs/sk-doc/document-standards/003-changelog-system/002-skill-changelog-retrofit/ | Phase | 002-skill-changelog-retrofit | Updates skill release histories to current changelog formats. |
| specs/sk-doc/document-standards/003-changelog-system/003-skilled-release-changelog/ | Phase | 003-skilled-release-changelog | Establishes a Skilled release line and searchable changelog metadata. |
| specs/sk-doc/document-standards/003-changelog-system/004-changelog-section-spacing/ | Phase | 004-changelog-section-spacing | Sets section spacing for entries and release notes. |
| specs/sk-doc/document-standards/003-changelog-system/005-concise-release-format/ | Phase | 005-concise-release-format | Bounds the expanded format and adds the changelog shape gate. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-sk-create-changelog-v4-style/` | Why-first changelog format and enforced voice rules | Complete |
| 2 | `002-skill-changelog-retrofit/` | Rewrite skill histories into compact and expanded formats | Complete |
| 3 | `003-skilled-release-changelog/` | Separate Skilled releases and improve changelog discovery | Complete |
| 4 | `004-changelog-section-spacing/` | Apply consistent spacing to entries and release notes | Complete |
| 5 | `005-concise-release-format/` | Bound the expanded format, model it on the v4.0.1.0 entry and block drafts that break its ceilings | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use /speckit:resume with the parent and child folder to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sk-create-changelog-v4-style | 002-skill-changelog-retrofit | 001-sk-create-changelog-v4-style validates on its own | validate.sh --strict on 001-sk-create-changelog-v4-style |
| 002-skill-changelog-retrofit | 003-skilled-release-changelog | 002-skill-changelog-retrofit validates on its own | validate.sh --strict on 002-skill-changelog-retrofit |
| 003-skilled-release-changelog | 004-changelog-section-spacing | 003-skilled-release-changelog validates on its own | validate.sh --strict on 003-skilled-release-changelog |
| 004-changelog-section-spacing | 005-concise-release-format | 004-changelog-section-spacing validates on its own | validate.sh --strict on 004-changelog-section-spacing |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See each child folder for its per-phase spec.md, plan.md and tasks.md.
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for changelog format, retrofit, release line and spacing.
<!-- /ANCHOR:requirements -->
