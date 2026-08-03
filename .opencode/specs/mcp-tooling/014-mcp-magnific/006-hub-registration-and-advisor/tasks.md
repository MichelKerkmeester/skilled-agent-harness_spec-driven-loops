---
title: "Tasks: Register mcp-magnific in the hub and advisor"
description: "Atomic shared-hub registration, generation, routing, and advisor tasks."
trigger_phrases: ["magnific hub tasks", "magnific advisor tasks", "register mcp-magnific tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/006-hub-registration-and-advisor"
    last_updated_at: "2026-08-02T13:36:51Z"
    last_updated_by: "spec-author"
    recent_action: "Define registration task sequence"
    next_safe_action: "Wait for package validation"
    blockers: ["Phase 5 incomplete"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-006", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Register mcp-magnific in the hub and advisor

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

- [ ] T001 Inventory registry, router, hub docs, advisor metadata, smart routing, manifest, compiled route, and README
- [ ] T002 Freeze narrow Magnific aliases, vocabulary, tie-break position, and resources
- [ ] T003 [P] Confirm generator, freshness, advisor scan, and parent-check commands
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add canonical `mcp-magnific` registry and router entries
- [ ] T005 Update hub SKILL, description, graph identity, and smart-routing resources
- [ ] T006 Regenerate leaf projection and synchronize compiled-routing inputs
- [ ] T007 Update repository README and hub changelog as required
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Parse JSON and run parent-skill, route, manifest, and freshness checks
- [ ] T009 Run advisor recall and hub route probes including negative collision prompts
- [ ] T010 Diff existing mode entries for unintended changes and validate this child
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Advisor selects hub and hub selects mode for Magnific prompts
- [ ] Existing mode routing remains unchanged
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Package**: `.opencode/skills/mcp-tooling/mcp-magnific/`
<!-- /ANCHOR:cross-refs -->
