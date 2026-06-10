---
title: "Feature Specification: Doctor Commands - Inventory and Extract"
description: "Level 1 leaf phase for catalog every command markdown file in the family, enumerate inline startup-question blocks, dashboard layouts, and results-display templates, and produce the extraction map for what moves out."
trigger_phrases:
  - "004-doctor-commands 001-inventory-extract"
  - "doctor commands inventory and extract"
  - "command presentation markdown"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Inventory completed"
    next_safe_action: "Use the extracted presentation map in the dedicated doctor presentation assets."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-001-inventory-extract-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation completed with workflow YAML kept reference-only."
---
# Feature Specification: Doctor Commands - Inventory and Extract

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
Doctor Commands needs a scoped inventory and extract phase so presentation extraction can proceed without mixing implementation, routing, and display-contract decisions.

### Purpose
Catalog every command Markdown file in the family, enumerate inline startup-question blocks, dashboard layouts, and results-display templates, and produce the extraction map for what moves out.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Command inventory for the family.
- Inline presentation-contract inventory.
- Extraction map from command.md sections to presentation Markdown files.
- Family command scope: `.opencode/commands/doctor/*.md`, legacy `doctor:*` command surfaces, and doctor workflow assets.


### Out of Scope
- Source-code changes.
- Workflow YAML edits.
- Out-of-family command changes.

### Files to Change
Completed implementation scope for this leaf.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/*.md` | Reviewed | Family command scope inventoried |
| `.opencode/commands/doctor:*.md` | Reviewed | No legacy command surfaces found |
| `.opencode/commands/doctor/assets/**/*.yaml` | Reviewed Only | Existing workflow YAML referenced, never edited |
| `.opencode/commands/doctor/assets/**/*.yml` | Reviewed Only | No workflow YAML edits performed |
| Dedicated presentation Markdown files | Mapped | Presentation contracts identified for startup questions, dashboards, and results display |
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

- The leaf has a clear implementation handoff for inventory and extract.
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
