---
title: "Tasks: MCP-server inner directories (017 subtree 008 phase 002)"
description: "The MCP server contains non-Python directories whose names still use underscores, including runtime, bridge, stress, and test-support paths. They need semantic targets and intra-tree reference updates; leading and doubled underscores must never be converted mechanically."
trigger_phrases:
  - "mcp-server inner directories"
  - "matrix_runners rename"
  - "plugin_bridges rename"
  - "stress_test rename"
  - "kebab-case phase 002"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned MCP inner-directory tasks"
    next_safe_action: "Execute the semantic inner-directory map on the renamed package root"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: MCP-server inner directories

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

- [ ] T001 Read the phase 001 handoff and inventory all six inner-directory candidates.
- [ ] T002 Classify test support names against the actual Vitest and TypeScript contracts.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create semantic directory mappings and preserve explicit exemptions.
- [ ] T004 Rename permitted inner directories and update intra-tree globs and links.
- [ ] T005 Update test setup, stress commands, bridge references, and documentation diagrams.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Semantic map is complete — evidence: map and exemption ledger.
- [ ] T007 Verify: Intra-tree references resolve — evidence: config/glob/path audit.
- [ ] T008 Verify: Test discovery remains stable — evidence: default and stress discovery output.
- [ ] T009 Verify: Python and tool-mandated names are preserved — evidence: changed-path audit.
- [ ] T010 Verify: External leftovers are handed off — evidence: zero-unclassified disposition ledger.
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
- **Decision record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
