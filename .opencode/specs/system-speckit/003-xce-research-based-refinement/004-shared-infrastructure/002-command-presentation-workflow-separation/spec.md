---
title: "Feature Specification: Command Presentation Workflow Separation (Phase Parent)"
description: "Phase parent for separating command workflow routing from Markdown presentation contracts across memory, speckit, create, and doctor command families."
trigger_phrases:
  - "command presentation workflow separation"
  - "thin command router presentation markdown"
  - "startup questions dashboard results template"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation"
    last_updated_at: "2026-06-11T02:15:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 4 command families shipped; deep-review CONDITIONAL remediated"
    next_safe_action: "None; phase complete and review-remediated"
    blockers: []
    key_files:
      - "001-memory-commands/spec.md"
      - "002-speckit-commands/spec.md"
      - "003-create-commands/spec.md"
      - "004-doctor-commands/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-028-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator locked presentation extraction format to Markdown."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X->Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md - these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Command Presentation Workflow Separation (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Family parents and leaf phases validate independently before implementation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Command files under `.opencode/commands/<group>/<name>.md` currently mix workflow logic with presentation contracts. Startup questions, dashboard layouts, and results-display templates are buried inline in large instruction files, so assistants may skip questions, improvise dashboards, or return cluttered results instead of following a reliable display contract.

### Purpose
Separate command workflow routing from display instructions by making each command Markdown file a thin router to its routing assets: a dedicated Markdown presentation file (always) plus the command's owned workflow file where one exists. Families with an existing workflow asset (for example speckit) route to both; families without one yet (for example memory) route to the presentation file and keep workflow routing inline behind a documented missing-upstream placeholder, never inventing a workflow YAML. The presentation file is the single source of truth for startup questions, dashboard layout, and results-display templates.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four command-family phase parents: memory, speckit, create, and doctor.
- Uniform four-aspect leaf map for each family: inventory/extract, author presentation Markdown, router rewire, verify/UX.
- Markdown as the locked presentation-contract format.
- Spec docs and metadata only in this scaffold.

### Out of Scope
- Source-code changes.
- Command Markdown rewrites during this scaffold.
- Workflow YAML edits during this scaffold.
- Package, lockfile, or dependency changes.

### Files to Change
Summary of aggregate future file scope for audit only. Per-family detail lives in family parents and leaf docs.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/commands/memory/*.md` | Future Modify | 001-memory-commands | Thin-router rewires and presentation extraction |
| `.opencode/commands/speckit/*.md` | Future Modify | 002-speckit-commands | Thin-router rewires and presentation extraction |
| `.opencode/commands/create/*.md` | Future Modify | 003-create-commands | Thin-router rewires and presentation extraction |
| `.opencode/commands/doctor/*.md` and `doctor:*` surfaces | Future Modify | 004-doctor-commands | Thin-router rewires and presentation extraction |
| Dedicated presentation Markdown files | Future Create | all families | Startup-question, dashboard, and results-display templates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-memory-commands/ | presentation extraction for memory command surfaces, especially startup-question and results-display contracts | Complete |
| 2 | 002-speckit-commands/ | presentation extraction for spec-kit planning, resume, implement, and completion command surfaces | Complete |
| 3 | 003-create-commands/ | presentation extraction for create-command scaffolding surfaces | Complete |
| 4 | 004-doctor-commands/ | presentation extraction for diagnostic and repair command surfaces | Complete |
| 5 | 005-deep-commands/ | presentation extraction for the deep loop command family (six mode-based commands) plus sk-doc command-standard alignment | Complete |

### Phase Transition Rules

- Each family parent MUST pass `validate.sh` independently before implementation begins.
- Each leaf phase MUST pass `validate.sh` independently before implementation begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-family]/[NNN-leaf]/` to resume a specific leaf.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-memory-commands | 002-speckit-commands | Family parent validates and its four leaf phases are scaffolded | strict validation for 001-memory-commands |
| 002-speckit-commands | 003-create-commands | Family parent validates and its four leaf phases are scaffolded | strict validation for 002-speckit-commands |
| 003-create-commands | 004-doctor-commands | Family parent validates and its four leaf phases are scaffolded | strict validation for 003-create-commands |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for scaffold. Implementation phases may discover command-specific display conflicts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Family children**: See `001-memory-commands/`, `002-speckit-commands/`, `003-create-commands/`, and `004-doctor-commands/`.
- **Graph Metadata**: See `graph-metadata.json` for direct child edges.
