---
title: "Implementation Plan: Memory Commands - Inventory and Extract"
description: "Planned Level 1 implementation handoff for memory commands inventory and extract."
trigger_phrases:
  - "memory commands inventory and extract plan"
  - "command presentation workflow plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/011-command-presentation-workflow-separation/001-memory-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T19:14:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Inventoried memory commands and extracted presentation sections"
    next_safe_action: "Use the extraction map in implementation-summary.md for future workflow-asset follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-001-memory-commands-001-inventory-extract-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Implementation Plan: Memory Commands - Inventory and Extract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command docs plus YAML workflow assets |
| **Framework** | OpenCode command/spec-kit documentation workflow |
| **Storage** | Files under `.opencode/commands/` and presentation Markdown paths chosen during implementation |
| **Testing** | Strict spec validation plus cross-model command-render checks |

### Overview
This planned leaf handles catalog every command markdown file in the family, enumerate inline startup-question blocks, dashboard layouts, and results-display templates, and produce the extraction map for what moves out. It is scaffolded only; implementation will happen in a later session.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Command inventory for the family (`save.md`, `search.md`, `manage.md`, `learn.md`)
- [x] Inline presentation-contract inventory (startup questions, dashboards, result templates)
- [x] Extraction map from command.md sections to presentation Markdown files (`implementation-summary.md::what-built`)
- [x] Strict validation passes for this leaf (see final verification output)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin command router plus dedicated Markdown presentation contract.

### Key Components
- **Command router**: command.md keeps invocation, routing, and pointers only.
- **Workflow asset**: existing YAML remains the source for workflow logic.
- **Presentation Markdown**: startup questions, dashboard layout, and results-display templates live outside command.md.

### Data Flow
1. User invokes a command.
2. command.md points the assistant to the workflow asset for behavior.
3. command.md points the assistant to presentation Markdown for display contract.
4. Assistant renders startup questions, dashboards, and results from the presentation file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read every command.md and referenced workflow asset in the family
- [x] Completed: four memory command routers and zero memory YAML assets found

### Phase 2: Classify presentation content by startup questions, dashboard layout, and results display
- [x] Completed: presentation blocks classified by command and moved to assets

### Phase 3: Record the extraction map and confirm workflow behavior is out of scope
- [x] Completed: extraction map recorded in implementation summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This leaf and parent tree | `validate.sh --strict` |
| Presentation adherence | Startup/dashboard/results display | Claude and GPT-via-opencode command runs |
| Scope check | No source-code or workflow changes outside planned files | Git diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Family command inventory | Internal | Planned | Cannot prove presentation extraction is complete |
| Presentation Markdown path convention | Internal | Planned | Routers cannot point to stable display contracts |
| Cross-model verification access | Operational | Planned | Cannot verify weaker-model display adherence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Implementation changes alter workflow behavior or leave presentation contracts split across command.md and presentation Markdown.
- **Procedure**:
  1. Revert the affected command.md changes.
  2. Restore the last valid presentation Markdown contract.
  3. Re-run family validation and cross-model render checks.
<!-- /ANCHOR:rollback -->
