---
title: "Implementation Plan: Speckit Commands - Author Presentation Markdown"
description: "Planned Level 1 implementation handoff for speckit commands author presentation markdown."
trigger_phrases:
  - "speckit commands author presentation markdown plan"
  - "command presentation workflow plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/002-author-presentation-md"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Prepared Planned scaffold for strict validation"
    next_safe_action: "Implement this leaf after parent scope approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-speckit-commands-002-author-presentation-md-planned"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Implementation Plan: Speckit Commands - Author Presentation Markdown

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
This planned leaf handles author dedicated markdown presentation files that become the single source of truth for startup questions, dashboard templates, and results-display templates per command. It is scaffolded only; implementation will happen in a later session.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Presentation Markdown file plan per command
- [ ] Startup-question template sections
- [ ] Dashboard and results-display template sections
- [ ] Strict validation passes for this leaf
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
- [ ] Planned for implementation session

### Phase 2: Author one presentation Markdown contract per command or justified shared family surface
- [ ] Planned for implementation session

### Phase 3: Keep display contract in Markdown and leave workflow logic in the workflow asset
- [ ] Planned for implementation session
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
