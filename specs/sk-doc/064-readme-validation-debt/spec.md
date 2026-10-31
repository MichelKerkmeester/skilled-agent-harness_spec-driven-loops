---
title: "Feature Specification: README validation and reference debt"
description: "Resolves real README and changelog validation findings while correcting checker false positives."
trigger_phrases:
  - "readme audit debt"
  - "readme broken reference fixes"
  - "derived readme count checker"
  - "changelog prose validation"
  - "readme checker false positives"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/064-readme-validation-debt"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-064-readme-validation-debt"
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

# Feature Specification: README validation and reference debt

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 064-readme-validation-debt |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README and changelog audits reported broken references, template failures, count mismatches and prose findings about internal ids or test counts. Many root and hub README findings came from checkers reading slash commands, generic filenames and prose numbers as paths or counts, so the work had to distinguish actual drift from false positives before clearing the reported debt.

### Purpose
Fix each real README and changelog finding without losing facts. Correct systematic checker false positives at their source and record anything left open with its reason.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve real repo README and changelog audit findings and record findings that remain.
- Fix README reference and derived-count checkers so actual failures are corrected and false positives are handled at the source.

### Out of Scope
- Editing README or changelog content outside findings from the named audits.
- Changing checker behavior for issues outside README reference and derived-count checks.

### Files to Change
Each row identifies one child phase and its purpose.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| specs/sk-doc/064-readme-validation-debt/001-repo-doc-debt/ | Phase | 001-repo-doc-debt | Resolves README and changelog audit debt. |
| specs/sk-doc/064-readme-validation-debt/002-readme-reference-debt/ | Phase | 002-readme-reference-debt | Fixes real references and counts and corrects checker false positives. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-repo-doc-debt/` | Resolve README and changelog audit findings | Complete |
| 2 | `002-readme-reference-debt/` | Fix real README references and counts and checker false positives | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use /speckit:resume with the parent and child folder to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-repo-doc-debt | 002-readme-reference-debt | 001-repo-doc-debt validates on its own | validate.sh --strict on 001-repo-doc-debt |
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

- The phase parent tracks child phase folders for readme validation and reference debt.
<!-- /ANCHOR:requirements -->
