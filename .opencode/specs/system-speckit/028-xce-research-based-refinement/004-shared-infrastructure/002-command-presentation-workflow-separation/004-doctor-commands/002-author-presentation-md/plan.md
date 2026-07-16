---
title: "Implementation Plan: Doctor Commands - Author Presentation Markdown"
description: "Completed Level 1 implementation plan for doctor commands author presentation markdown."
trigger_phrases:
  - "doctor commands author presentation markdown plan"
  - "command presentation workflow plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Created dedicated doctor presentation Markdown files."
    next_safe_action: "Maintain startup, dashboard, and result display wording only in presentation Markdown assets."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-002-author-presentation-md-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation completed and workflow YAML remained reference-only."
---
# Implementation Plan: Doctor Commands - Author Presentation Markdown

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
This completed leaf authored dedicated Markdown presentation files that are the display source of truth for startup questions, dashboard templates, and results-display templates for the doctor command surfaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Presentation Markdown file plan per command
- [x] Startup-question template sections
- [x] Dashboard and results-display template sections
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

### Phase 1: Use the extraction map from phase 001 as source material
- [x] Completed; evidence: presentation assets are based on the extracted inline contracts from the three doctor command routers.

### Phase 2: Author one presentation Markdown contract per command or justified shared family surface
- [x] Completed; evidence: `doctor_speckit_presentation.md`, `doctor_mcp_presentation.md`, and `doctor_update_presentation.md` were created.

### Phase 3: Keep display contract in Markdown and leave workflow logic in the workflow asset
- [x] Completed; evidence: workflow YAML files were referenced only and not edited.
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
