---
title: "Feature Specification: Spec folder lifecycle: root, location, tooling and write recipe"
description: "Tracks the canonical spec root, folder tooling, and authoring recipe across the spec folder lifecycle."
trigger_phrases:
  - "canonical spec root resolution"
  - "spec folder location policy"
  - "spec packet numbering and archive tooling"
  - "spec write recipe checks"
  - "track root packet listings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-spec-folder-lifecycle"
    last_updated_at: "2026-10-31T13:30:53Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-spec-folder-lifecycle"
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

# Feature Specification: Spec folder lifecycle: root, location, tooling and write recipe

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-07 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 029-spec-folder-lifecycle |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child validates on its own; the parent tracks them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec folders relied on inconsistent roots, resolution rules, numbering, track indexes, archive behavior, and authoring guidance. Resolver call sites disagreed on precedence, tooling could write outside the tree operators used, track lists and archive operations could diverge from the on-disk structure, and the write recipe did not match its hooks or the staged-set checks used in a shared workspace.

### Purpose
Together these phases establish a canonical-first root policy, make the root `specs/` tree the working location, align creation, numbering, archive and restore behavior with that tree, and make the write recipe match the commit and workspace checks authors actually use.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Unify spec-root resolution, canonicalize automatic writers, normalize readers, and retire the root alias.
- Evaluate the root spec-kit location and establish the canonical tree after checking tooling, runtime, gitignore, and reference implications.
- Align `create.sh`, `archive.sh`, packet numbering, and track-root lists with the canonical tree.
- Correct the write recipe's backfill argument, commit step, workspace guidance, and staged-set post-checks.

### Out of Scope
- Doctor command audits and environment setup.
- Spec-kit changes unrelated to root resolution, folder location, packet tooling, and the write recipe.

### Files to Change
Summary of the child phase folders and their changes.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-spec-root-resolution-hardening/` | Phase | 001-spec-root-resolution-hardening | Unify root resolution and canonicalize spec-folder readers and writers. |
| `002-relocate-specs-folder/` | Phase | 002-relocate-specs-folder | Establish the canonical root location after checking tooling and runtime implications. |
| `003-spec-folder-tooling/` | Phase | 003-spec-folder-tooling | Align creation, numbering, archive, restore, and track-root lists. |
| `004-write-recipe-fixes/` | Phase | 004-write-recipe-fixes | Make the write recipe match hooks, workspace rules, and staged-set checks. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-spec-root-resolution-hardening/` | Canonical-first root policy and writer normalization | Planned |
| 2 | `002-relocate-specs-folder/` | Establish the canonical root location | Complete — all 6 phases closed, T015 operator review confirmed 2026-08-08 |
| 3 | `003-spec-folder-tooling/` | Align packet creation, numbering, archiving, and track lists | Complete |
| 4 | `004-write-recipe-fixes/` | Correct recipe arguments, commit steps, and staged-set checks | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` to resume a specific child phase folder
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-spec-root-resolution-hardening | 002-relocate-specs-folder | 001-spec-root-resolution-hardening validates on its own | `validate.sh --strict` on 001-spec-root-resolution-hardening |
| 002-relocate-specs-folder | 003-spec-folder-tooling | 002-relocate-specs-folder validates on its own | `validate.sh --strict` on 002-relocate-specs-folder |
| 003-spec-folder-tooling | 004-write-recipe-fixes | 003-spec-folder-tooling validates on its own | `validate.sh --strict` on 003-spec-folder-tooling |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- `001-spec-root-resolution-hardening` remains planned.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the child folders for each phase's spec.md, plan.md, and tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for spec folder lifecycle: root, location, tooling and write recipe.
<!-- /ANCHOR:requirements -->
