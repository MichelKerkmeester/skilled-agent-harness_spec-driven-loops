---
title: "Tasks: Shared and runtime (017 subtree 008 phase 007)"
description: "The shared/runtime part of system-spec-kit contains an underscore-bearing shared/mcp_server directory even though its TypeScript/shared-package surface can use kebab-case. This phase verifies the runtime tree, renames the permitted shared directory, updates its references, and preserves package manifests, tool names, generated databases, and Python package directories."
trigger_phrases:
  - "system-spec-kit shared runtime"
  - "shared/mcp_server rename"
  - "runtime path cleanup"
  - "kebab-case phase 007"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/007-shared-and-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned shared-runtime tasks"
    next_safe_action: "Execute the shared/mcp-server path closure after reference assets are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Shared and runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory shared and runtime candidates and package/data ownership.
- [ ] T002 Capture database metadata and path-reference baseline.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Apply the shared/mcp-server semantic map if permitted.
- [ ] T004 Rewrite active shared/runtime references.
- [ ] T005 Preserve database contents, modes, manifests, and tool names.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Inventory is complete — evidence: shared/runtime scan.
- [ ] T007 Verify: Permitted map is correct — evidence: semantic map and ownership check.
- [ ] T008 Verify: References resolve — evidence: path/import audit.
- [ ] T009 Verify: Database and exemptions are preserved — evidence: metadata and diff audit.
- [ ] T010 Verify: Handoff is clean — evidence: zero unknown old paths.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

