---
title: "Tasks: Memory Commands - Inventory and Extract"
description: "Completed task outline for memory commands inventory and extract."
trigger_phrases:
  - "memory commands inventory and extract tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/001-inventory-extract"
    last_updated_at: "2026-06-10T19:14:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Inventoried memory command routers and extracted presentation contracts"
    next_safe_action: "Use extraction evidence when adding future workflow YAML assets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-memory-commands-inventory-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Memory command workflow YAML assets were absent in this checkout; this was recorded as an out-of-scope asset gap."
---
# Tasks: Memory Commands - Inventory and Extract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 List every family command Markdown file (`.opencode/commands/memory/save.md`, `search.md`, `manage.md`, `learn.md`) [EVIDENCE: memory command glob returned four command files]
- [x] T002 List referenced workflow asset YAML files (`.opencode/commands/memory/assets/**/*.yaml`) [EVIDENCE: broad asset glob found no memory-owned YAML; routers report this gap without dangling references]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Identify inline startup-question blocks (`save.md`, `search.md`, `manage.md`, `learn.md`) [EVIDENCE: startup policies moved to `*_presentation.md`]
- [x] T004 [P] Identify inline dashboard layout blocks (`save.md`, `search.md`, `manage.md`, `learn.md`) [EVIDENCE: dashboard templates moved to presentation assets]
- [x] T005 [P] Identify inline results-display templates (`save.md`, `search.md`, `manage.md`, `learn.md`) [EVIDENCE: result and error templates moved to presentation assets]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Draft the extraction map for each command (`implementation-summary.md::what-built`) [EVIDENCE: command-to-presentation table records all four routers]
- [x] T007 Run strict validation for this leaf (`validate.sh --strict`) [EVIDENCE: see final validation output]
- [x] T008 Confirm implementation-summary.md exists for strict validation (`implementation-summary.md`) [EVIDENCE: summary updated with delivered state]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval [EVIDENCE: T001-T008 complete]
- [x] No blocked tasks remain [EVIDENCE: workflow YAML absence is reported as an out-of-scope asset gap, not a blocked in-scope edit]
- [x] Strict validation passes for this leaf [EVIDENCE: see final validation output]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
