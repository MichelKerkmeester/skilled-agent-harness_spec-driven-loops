---
title: "Tasks: Magnific feature catalog and playbook"
description: "Current-state catalog and cost-aware scenario authoring tasks."
trigger_phrases: ["magnific catalog tasks", "magnific playbook tasks", "mcp-magnific scenario tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/005-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T13:36:50Z"
    last_updated_by: "spec-author"
    recent_action: "Define catalog task sequence"
    next_safe_action: "Wait for verified mode package"
    blockers: ["Phase 4 incomplete"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-005", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Magnific feature catalog and playbook

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read catalog/playbook doctrines and nearest transport examples
- [ ] T002 Extract verified current tools, cost classes, and mutation classes
- [ ] T003 [P] Define stable IDs and routing/holdout/negative scenario stages
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author catalog root and one evidence-backed card per verified capability
- [ ] T005 Author playbook execution policy with no-cost and paid waves
- [ ] T006 Author auth, balance/history, generation, editing, output, and failure scenarios where supported
- [ ] T007 Cross-link catalog and playbook with cost and mutation labels
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run catalog and document validators
- [ ] T009 Verify stable IDs, scenario fields, links, and explicit paid consent gates
- [ ] T010 Confirm no roadmap/marketing-only feature is presented as current and validate this child
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every entry maps to verified current behavior
- [ ] No-cost verification can run separately from paid smoke
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Mode package**: `.opencode/skills/mcp-tooling/mcp-magnific/`
<!-- /ANCHOR:cross-refs -->
