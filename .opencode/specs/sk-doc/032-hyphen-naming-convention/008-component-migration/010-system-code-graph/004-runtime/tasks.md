---
title: "Tasks: system-code-graph runtime"
description: "Concrete tasks for the code-graph runtime inventory, conditional path rename, hook/library reference closure, and no-op evidence."
trigger_phrases:
  - "system-code-graph runtime tasks"
  - "code graph runtime rename tasks"
  - "freshness runtime audit tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime tasks"
    next_safe_action: "Begin pinned runtime inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The four current runtime files are already kebab-case; a verified no-rename result is valid."
---

# Tasks: system-code-graph runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory runtime/hooks/claude, runtime/hooks/codex, runtime/lib/code-graph, and every runtime basename
- [ ] T002 Separate already-compliant names, conditional candidates, path references, hook events, and identifiers
- [ ] T003 Freeze collision, syntax, behavior, and BASE discovery evidence
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Preserve the four current kebab-case runtime files, or rename any additional pinned in-scope candidate
- [ ] T005 Update affected hook, library, test, playbook, and documentation path values for any conditional target
- [ ] T006 Preserve hook events, environment keys, code identifiers, test IDs, and runtime behavior
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify zero unclassified runtime names and zero stale live old paths
- [ ] T008 Run Node syntax, freshness behavior, and runtime Vitest checks with BASE-equivalent discovery
- [ ] T009 Record a no-rename receipt or conditional map and hand off the result to the catalog/playbook phases
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->

