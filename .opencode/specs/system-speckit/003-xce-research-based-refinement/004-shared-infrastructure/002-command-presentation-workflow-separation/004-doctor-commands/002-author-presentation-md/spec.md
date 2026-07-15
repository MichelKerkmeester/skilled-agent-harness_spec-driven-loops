---
title: "Feature Specification: Doctor Commands - Author Presentation Markdown"
description: "Level 1 leaf phase for author dedicated markdown presentation files that become the single source of truth for startup questions, dashboard templates, and results-display templates per command."
trigger_phrases:
  - "004-doctor-commands 002-author-presentation-md"
  - "doctor commands author presentation markdown"
  - "command presentation markdown"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created doctor presentation Markdown files for router, MCP, and update command surfaces."
    next_safe_action: "Use the new presentation Markdown files for startup questions, dashboards, and results display."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-002-author-presentation-md-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation completed with workflow YAML kept reference-only."
---
# Feature Specification: Doctor Commands - Author Presentation Markdown

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Doctor Commands needs a scoped author presentation markdown phase so presentation extraction can proceed without mixing implementation, routing, and display-contract decisions.

### Purpose
Author dedicated Markdown presentation files that become the single source of truth for startup questions, dashboard templates, and results-display templates per command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Presentation Markdown file plan per command.
- Startup-question template sections.
- Dashboard and results-display template sections.
- Family command scope: `.opencode/commands/doctor/*.md`, legacy `doctor:*` command surfaces, and doctor workflow assets.


### Out of Scope
- Source-code changes.
- Workflow YAML edits.
- Out-of-family command changes.

### Files to Change
Completed implementation scope for this leaf.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/*.md` | Reviewed | Source presentation contracts extracted from command routers |
| `.opencode/commands/doctor:*.md` | Reviewed | No legacy command surfaces found |
| `.opencode/commands/doctor/assets/**/*.yaml` | Reviewed Only | Existing workflow YAML referenced, never edited |
| `.opencode/commands/doctor/assets/**/*.yml` | Reviewed Only | No workflow YAML edits performed |
| Dedicated presentation Markdown files | Created | Presentation contracts for startup questions, dashboards, and results display |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Preserve workflow behavior | Completed changes do not alter command routing semantics |
| R2 | Keep presentation contract explicit | Startup questions, dashboard layouts, and results-display rules are discoverable through Markdown presentation contracts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3 | Keep scope family-local | Work is limited to doctor commands command surfaces and their presentation contracts |
| R4 | Verify with strict spec validation | Leaf folder validates before implementation handoff |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The leaf has a clear implementation handoff for author presentation markdown.
- The leaf preserves the packet principle: thin command routers plus dedicated Markdown presentation contracts.
- Strict spec validation passes for this folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Complete command inventory | Missing commands could keep inline presentation hidden | Inventory every command path in the family before rewiring |
| Risk | Presentation/workflow boundary ambiguity | Router could retain display rules inline | Use explicit extraction map and no-inline-presentation checks |
| Risk | Model adherence drift | GPT-via-opencode may ignore display contracts | Verify startup/dashboard/results rendering across model surfaces |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for scaffold. Implementation may surface command-specific display edge cases.
<!-- /ANCHOR:questions -->
