---
title: "Implementation Plan: Doctor Commands - Verify and UX"
description: "Completed Level 1 implementation plan for doctor commands verify and ux."
trigger_phrases:
  - "doctor commands verify and ux plan"
  - "command presentation workflow plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/004-doctor-commands/004-verify-and-ux"
    last_updated_at: "2026-06-10T20:07:37Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified doctor command presentation split, asset references, and validation path."
    next_safe_action: "Run final validations whenever future doctor presentation assets change."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-004-doctor-commands-004-verify-and-ux-completed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation completed and workflow YAML remained reference-only."
---
# Implementation Plan: Doctor Commands - Verify and UX

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
This completed leaf verified startup questions, dashboards, and results display contracts by ensuring routers load presentation assets before any visible output and by checking valid asset references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Cross-model adherence checks
- [x] Family-specific UX polish notes
- [x] Clean result-display verification evidence
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

### Phase 1: Define representative command invocations for Claude and GPT-via-opencode
- [x] Completed; evidence: presentation assets include startup, setup, dashboard, and result templates for `/doctor`, `/doctor:mcp`, and `/doctor:update`.

### Phase 2: Verify startup-question, dashboard, and result-display adherence
- [x] Completed; evidence: router docs direct assistants to load presentation assets before prompts, dashboards, and result summaries.

### Phase 3: Polish family-specific presentation UX without changing workflow semantics
- [x] Completed; evidence: presentation files provide compact ASCII-safe templates and workflow YAML files were not edited.
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
