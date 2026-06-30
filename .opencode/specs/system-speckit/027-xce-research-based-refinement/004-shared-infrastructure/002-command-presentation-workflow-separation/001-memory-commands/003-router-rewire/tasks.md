---
title: "Tasks: Memory Commands - Router Rewire"
description: "Completed task outline for memory commands router rewire."
trigger_phrases:
  - "memory commands router rewire tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/001-memory-commands/003-router-rewire"
    last_updated_at: "2026-06-10T19:14:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Slimmed memory command files into presentation-aware routers"
    next_safe_action: "Create workflow YAML assets in a separately scoped change if required"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-memory-commands-router-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Routers do not point to non-existent YAML assets; they report the missing asset gap explicitly."
---
# Tasks: Memory Commands - Router Rewire

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

- [x] T001 Define thin-router acceptance criteria (`.opencode/commands/memory/*.md`) [EVIDENCE: each router has routing assets, router contract, workflow routing, hard rules, and related commands]
- [x] T002 Map each command to workflow and presentation files (`.opencode/commands/memory/*.md`) [EVIDENCE: presentation assets exist; workflow YAML assets were absent and are reported instead of referenced]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Plan command.md rewrites without changing behavior (`save.md`, `search.md`, `manage.md`, `learn.md`) [EVIDENCE: routers preserve recognized modes and tool maps]
- [x] T004 [P] Plan inline-presentation removal checks (`.opencode/commands/memory/*.md`) [EVIDENCE: routers no longer contain multi-line display blocks]
- [x] T005 [P] Plan routing-preservation checks (`.opencode/commands/memory/*.md`) [EVIDENCE: each router points to its presentation asset and keeps workflow routing local pending YAML asset creation]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record rollback expectations for command.md rewires (`implementation-summary.md::limitations`) [EVIDENCE: restore command files from VCS if a future YAML asset appears]
- [x] T007 Run strict validation for this leaf (`validate.sh --strict`) [EVIDENCE: see final validation output]
- [x] T008 Confirm implementation-summary.md exists for strict validation (`implementation-summary.md`) [EVIDENCE: summary updated with delivered state]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval [EVIDENCE: T001-T008 complete]
- [x] No blocked tasks remain [EVIDENCE: missing YAML is outside allowed write scope and reported]
- [x] Strict validation passes for this leaf [EVIDENCE: see final validation output]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
