---
title: "Implementation Plan: Doctor Commands - Inventory and Extract"
description: "Completed Level 1 implementation plan for doctor commands inventory and extract."
trigger_phrases:
  - "doctor commands inventory and extract plan"
  - "command presentation workflow plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed doctor command inventory and extraction map."
    next_safe_action: "Use the inventory as the source for presentation asset maintenance."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-001-inventory-extract-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation completed and workflow YAML remained reference-only."
---
# Implementation Plan: Doctor Commands - Inventory and Extract

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
This completed leaf cataloged every doctor command Markdown file, enumerated inline startup-question blocks, dashboard layouts, and results-display templates, and produced the extraction map used by the presentation assets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Command inventory for the family
- [x] Inline presentation-contract inventory
- [x] Extraction map from command.md sections to presentation Markdown files
- [x] Strict validation passes for this leaf
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
- [x] Completed; evidence: `speckit.md`, `mcp.md`, `update.md`, `_routes.yaml`, and all referenced `doctor_*.yaml` assets were read.

### Phase 2: Classify presentation content by startup questions, dashboard layout, and results display
- [x] Completed; evidence: startup prompts, setup dashboards, health dashboards, mid-run prompts, and result summaries were moved to the new presentation Markdown assets.

### Phase 3: Record the extraction map and confirm workflow behavior is out of scope
- [x] Completed; evidence: command routers now point to presentation Markdown and existing workflow YAML while YAML files remain untouched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This leaf and parent tree | `validate.sh --strict` |
| Presentation adherence | Startup/dashboard/results display | Claude and GPT-via-opencode command runs |
| Scope check | No source-code or workflow changes outside allowed files | Git diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Family command inventory | Internal | Completed | N/A |
| Presentation Markdown path convention | Internal | Completed | N/A |
| Cross-model verification access | Operational | Completed by static contract checks | Live command execution remains optional |
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
