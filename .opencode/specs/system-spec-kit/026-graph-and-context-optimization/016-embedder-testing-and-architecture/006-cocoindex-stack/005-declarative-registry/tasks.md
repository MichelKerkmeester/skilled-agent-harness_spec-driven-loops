---
title: "Tasks: 019/001 declarative registry"
description: "Task checklist for the embedder catalog module"
trigger_phrases: ["019/001 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/005-declarative-registry"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "registered_embedders.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019001"
      session_id: "019-001-declarative-registry-tasks"
      parent_session_id: "019-001-declarative-registry"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 019/001 declarative registry

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Survey HF for current model card metadata (dim, size, MPS-compat)
- [ ] T002 Decide YAML vs Python; default to Python module
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Define `EmbedderMetadata` dataclass (`cocoindex_code/registered_embedders.py`)
- [ ] T004 Populate MANIFESTS with 6 candidates
- [ ] T005 Implement `list_embedders()` / `get_embedder_metadata(name)` / `default_embedder()`
- [ ] T006 [P] Write `tests/test_registered_embedders.py` covering schema + default
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 pytest passes for new tests + full CocoIndex suite
- [ ] T008 Strict-validate this packet
- [ ] T009 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 9 tasks marked `[x]`. pytest 35+/35+ pass. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Consumer: `../002-install-guide-updates/`
- Analog: `../../016-embedder-testing-and-architecture/004-mxbai-swap-and-008-closure/` (the mk-spec-memory side)
<!-- /ANCHOR:cross-refs -->
