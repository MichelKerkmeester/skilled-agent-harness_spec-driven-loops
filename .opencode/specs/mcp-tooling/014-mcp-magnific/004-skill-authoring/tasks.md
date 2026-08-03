---
title: "Tasks: Author the mcp-magnific mode package"
description: "Template-backed skill, reference, setup, example, and validation tasks for Magnific."
trigger_phrases: ["magnific skill tasks", "mcp-magnific authoring tasks", "magnific reference tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/004-skill-authoring"
    last_updated_at: "2026-08-02T13:36:49Z"
    last_updated_by: "spec-author"
    recent_action: "Define authoring task sequence"
    next_safe_action: "Wait for runtime discovery evidence"
    blockers: ["Phase 3 incomplete"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-004", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Author the mcp-magnific mode package

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

- [ ] T001 Read skill templates, architecture contract, and discovery fixture
- [ ] T002 Fix activation boundary, intent taxonomy, resources, and file inventory
- [ ] T003 [P] Map cost/mutation classes and `sk-design` pairing into executable rules
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `SKILL.md` with runtime discovery, confirmation, execution, and verification flow
- [ ] T005 Author README and install guide for official custom-connector/Code Mode setup
- [ ] T006 Author verified tool, cost/safety, output, and troubleshooting references
- [ ] T007 Author safe examples and initial changelog without unsupported names
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Resolve every resource-map and related-document path
- [ ] T009 Run nested package validator and representative router replay
- [ ] T010 Confirm no packet-local graph/description metadata and validate this child
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Another agent can operate the mode safely from package docs
- [ ] All claims are official, discovered, or explicitly UNKNOWN
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Runtime evidence**: `../003-mcp-runtime-integration/`
<!-- /ANCHOR:cross-refs -->
