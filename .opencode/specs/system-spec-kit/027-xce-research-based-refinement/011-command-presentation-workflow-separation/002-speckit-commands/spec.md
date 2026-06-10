---
title: "Feature Specification: Speckit Commands Presentation Workflow Separation (Phase Parent)"
description: "Family phase parent for extracting presentation contracts from speckit commands command routers into dedicated Markdown files."
trigger_phrases:
  - "speckit command presentation"
  - "speckit dashboards"
  - "speckit startup questions"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/002-speckit-commands"
    last_updated_at: "2026-06-10T19:51:18Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed speckit command router/presentation separation across four command files"
    next_safe_action: "Use the presentation Markdown assets for startup, dashboard, and result-display contract changes"
    blockers: []
    key_files:
      - "001-inventory-extract/spec.md"
      - "002-author-presentation-md/spec.md"
      - "003-router-rewire/spec.md"
      - "004-verify-and-ux/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-speckit-commands-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Presentation extraction format is Markdown."
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

# Feature Specification: Speckit Commands Presentation Workflow Separation (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Four leaf aspect phases validate independently before implementation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The speckit commands command family owns presentation instructions inline with routing instructions. That makes the display contract harder for assistants to find and follow, especially when command files are long or route through workflow assets.

### Purpose
Coordinate extraction for speckit commands commands so each command.md can become a thin router to its workflow asset plus a Markdown presentation contract for startup questions, dashboards, and results display.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Owned command scope: `.opencode/commands/speckit/*.md` and the workflow asset YAML files those commands route to.
- Uniform four-aspect nested map: inventory/extract, author presentation Markdown, router rewire, verify/UX.
- Presentation Markdown as the family display-contract source of truth.
- This family polishes presentation clarity for spec-kit command startup questions, progress dashboards, and completion/result displays without changing workflow behavior.

### Out of Scope
- Implementation during this scaffold.
- Rewriting command.md files during this scaffold.
- Editing workflow YAML files during this scaffold.
- Changing behavior or routing semantics.

### Files to Change
Future implementation scope for audit only. Per-leaf detail lives in the child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/commands/speckit/*.md` | Future Review/Modify | 001-003 | Inventory inline presentation and then thin-router rewiring |
| `.opencode/commands/speckit/assets/**/*.yaml` | Future Review/Modify | 001-003 | Inventory inline presentation and then thin-router rewiring |
| `.opencode/commands/speckit/assets/**/*.yml` | Future Review/Modify | 001-003 | Inventory inline presentation and then thin-router rewiring |
| Dedicated presentation Markdown files | Future Create | 002 | Startup-question, dashboard, and results-display source of truth |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-inventory-extract/ | Catalog every command Markdown file in the family, enumerate inline startup-question blocks, dashboard layouts, and results-display templates, and produce the extraction map for what moves out. | Completed |
| 2 | 002-author-presentation-md/ | Author dedicated Markdown presentation files that become the single source of truth for startup questions, dashboard templates, and results-display templates per command. | Completed |
| 3 | 003-router-rewire/ | Rewrite each command.md as a thin router that points to the workflow file and the presentation Markdown file, preserving behavior and leaving no presentation contract inline. | Completed |
| 4 | 004-verify-and-ux/ | Verify startup questions, dashboards, and results render consistently across Claude and GPT-via-opencode, then complete family-specific presentation UX polish. | Completed |

### Phase Transition Rules

- Each leaf MUST pass `validate.sh` independently before implementation begins.
- Leaf 001 produces the extraction map consumed by leaf 002.
- Leaf 002 produces presentation Markdown consumed by leaf 003.
- Leaf 004 verifies display adherence and family-specific UX polish.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-inventory-extract | 002-author-presentation-md | Prior aspect output is available for handoff | strict validation for 001-inventory-extract |
| 002-author-presentation-md | 003-router-rewire | Prior aspect output is available for handoff | strict validation for 002-author-presentation-md |
| 003-router-rewire | 004-verify-and-ux | Prior aspect output is available for handoff | strict validation for 003-router-rewire |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for scaffold. Leaf implementation may discover family-specific display-contract conflicts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent packet**: `../spec.md`.
- **Leaf phases**: See `001-inventory-extract/`, `002-author-presentation-md/`, `003-router-rewire/`, and `004-verify-and-ux/`.
- **Graph Metadata**: See `graph-metadata.json` for direct child edges.
