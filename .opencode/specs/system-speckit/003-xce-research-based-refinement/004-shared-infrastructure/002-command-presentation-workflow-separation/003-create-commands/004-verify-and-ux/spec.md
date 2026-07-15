---
title: "Feature Specification: Create Commands - Verify and UX"
description: "Level 1 leaf phase for verify startup questions, dashboards, and results render consistently across claude and gpt-via-opencode, then complete family-specific presentation ux polish."
trigger_phrases:
  - "003-create-commands 004-verify-and-ux"
  - "create commands verify and ux"
  - "command presentation markdown"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/003-create-commands/004-verify-and-ux"
    last_updated_at: "2026-06-10T19:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified router references and presentation-contract coverage for create commands"
    next_safe_action: "Run strict validation and reference checks before reporting completion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-003-create-commands-004-verify-and-ux-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Status is Spec-Scaffolded / Planned; implementation has not started."
---
# Feature Specification: Create Commands - Verify and UX

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
Create Commands needs a scoped verify and ux phase so presentation extraction can proceed without mixing implementation, routing, and display-contract decisions.

### Purpose
Verify startup questions, dashboards, and results render consistently across Claude and GPT-via-opencode, then complete family-specific presentation UX polish.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cross-model adherence checks.
- Family-specific UX polish notes.
- Clean result-display verification evidence.
- Family command scope: `.opencode/commands/create/*.md` and the workflow asset YAML files those commands route to.


### Out of Scope
- Source-code changes.
- Command.md rewrites during scaffold.
- Workflow YAML edits during scaffold.
- Implementation work beyond the Planned scaffold.

### Files to Change
Planned future implementation scope; this scaffold only creates spec docs and metadata.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/create/*.md` | Future Review/Modify | Family command and workflow asset scope for this leaf |
| `.opencode/commands/create/assets/**/*.yaml` | Future Review/Modify | Family command and workflow asset scope for this leaf |
| `.opencode/commands/create/assets/**/*.yml` | Future Review/Modify | Family command and workflow asset scope for this leaf |
| Dedicated presentation Markdown files | Future Create/Modify | Presentation contracts for startup questions, dashboards, and results display |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | Preserve workflow behavior | Planned changes do not alter command routing semantics |
| R2 | Keep presentation contract explicit | Startup questions, dashboard layouts, and results-display rules are discoverable through Markdown presentation contracts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3 | Keep scope family-local | Work is limited to create commands command surfaces and their presentation contracts |
| R4 | Verify with strict spec validation | Leaf folder validates before implementation handoff |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The leaf has a clear implementation handoff for verify and ux.
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
