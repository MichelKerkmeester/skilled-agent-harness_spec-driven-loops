---
title: "Tasks: 018/001 CocoIndex swap"
description: "Task checklist for the CocoIndex embedder default flip + MPS auto-detect patch"
trigger_phrases: ["018/001 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018001"
      session_id: "018-001-cocoindex-swap-tasks"
      parent_session_id: "018-001-cocoindex-swap"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 018/001 CocoIndex swap

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

- [ ] T001 Verify PyTorch ≥ 2.11.0 with MPS available (`venv check`)
- [ ] T002 Verify sentence-transformers installed (`venv check`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Edit `_DEFAULT_MODEL` to `sbert/jinaai/jina-embeddings-v2-base-code` (`cocoindex_code/config.py`)
- [ ] T004 Add MPS branch to device resolution (`cocoindex_code/config.py`)
- [ ] T005 [P] Add vitest covering MPS branch (`tests/`)
- [ ] T006 First-time download jina-code via sentence-transformers
- [ ] T007 Trigger CocoIndex reindex via `cocoindex_refresh_index`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Capture reindex wall-clock + disk size (`evidence/swap-runbook.md`)
- [ ] T009 Smoke-test 3-5 CocoIndex queries
- [ ] T010 Smoke-test Code Graph bridge via `code_graph_context`
- [ ] T011 Strict-validate this packet
- [ ] T012 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 12 tasks marked `[x]`. Strict-validate PASSED. Reindex evidence captured. Smoke tests confirmed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Sibling: `../002-baseline-fixture/`, `../003-comparison-measure/`
<!-- /ANCHOR:cross-refs -->
