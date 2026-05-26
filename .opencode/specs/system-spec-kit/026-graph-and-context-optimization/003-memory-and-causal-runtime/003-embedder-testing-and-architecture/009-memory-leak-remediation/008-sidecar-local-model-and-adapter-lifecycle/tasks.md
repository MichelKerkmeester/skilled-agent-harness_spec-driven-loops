---
title: "Tasks: Sidecar, Local Model, and Adapter Lifecycle"
description: "Task list for Sidecar, Local Model, and Adapter Lifecycle."
trigger_phrases:
  - "sidecar-local-model-and-adapter-lifecycle"
  - "memory leak 8"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/008-sidecar-local-model-and-adapter-lifecycle"
    last_updated_at: "2026-05-22T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-phase-008-sidecar-and-adapter-lifecycle"
    next_safe_action: "implement-sidecar-ledger-adapter-close-and-rss-gate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0808080808080808080808080808080808080808080808080808080808080808"
      session_id: "009-memory-leak-remediation-008"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "This phase is scoped from remediation-map items #11, #12, and #13."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Sidecar, Local Model, and Adapter Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

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
## Phase 1: Setup

- [x] T001 Locate sidecar implementation stack and primary language (`.opencode/skills/system-rerank-sidecar/`).
- [x] T002 Read required source evidence and remediation-map items #11, #12, and #13 (`research/remediation-map.md`, source research packets).
- [x] T003 Validate concrete plan after replacing the generic template (`plan.md`).
- [x] T004 Validate concrete task list after replacing the generic template (`tasks.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `sidecar_ledger.py` with `add_sidecar_row`, `find_reusable_sidecar`, `reclaim_stale`, and `classify_sidecar_owner` (`.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`).
- [x] T006 Integrate ledger lookup and fresh row recording into the spawn path (`.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`).
- [x] T007 Add ledger tests for healthy reuse, unknown-owner refusal, stale exact-PID cleanup, EPERM, port-down-but-PID-alive, and config mismatch (`.opencode/skills/system-rerank-sidecar/tests/`).
- [x] T008 Add adapter close/RSS helper module with idempotent close protocol and fallback RSS delta gate (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/adapter_lifecycle.py`).
- [x] T009 Add `close()` to reranker adapters, fallback model adapters, HTTP sidecar adapter, and Jina adapter (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/`).
- [x] T010 Add cache cleanup helpers that close adapters before dropping `_ADAPTERS` refs (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`).
- [x] T011 Add tests for adapter close idempotence and nested client/fallback close (`.opencode/skills/mcp-coco-index/mcp_server/tests/`).
- [x] T012 Add tests for sidecar 5xx fallback RSS below/above threshold (`.opencode/skills/mcp-coco-index/mcp_server/tests/`).
- [x] T013 Extend CocoIndex registry close/remove/config-hash paths to close cached embedders before eviction (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registry.py` or related registry module).
- [x] T014 Prove config-hash embedder eviction or ref-count release with tests (`.opencode/skills/mcp-coco-index/mcp_server/tests/`).
- [x] T015 Confirm `Project.close()`/registry cleanup remains idempotent and cannot interleave with active work under the phase-006 active-work ordering (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`, lifecycle tests).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run targeted sidecar pytest for ledger lifecycle.
- [x] T017 Run targeted mcp-coco-index pytest for reranker/adapters/registry.
- [x] T018 Run Python compile checks for touched modules.
- [x] T019 Run OpenCode alignment verifier for touched `.opencode` surfaces.
- [x] T020 Fill `implementation-summary.md` with evidence, limitations, continuity, and `## Commit Handoff`.
- [x] T021 Update parent remediation map and parent arc phase map (`../001.../research/remediation-map.md`, `../spec.md`).
- [x] T022 Run strict validation for this phase and parent arc.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 and REQ-002 are complete.
- [x] SC-001 fixtures pass: healthy reuse, unknown-owner refusal, stale exact-PID cleanup, sidecar 5xx fallback RSS, adapter close idempotence.
- [x] SC-002 docs are updated with evidence and next handoff.
- [x] No destructive cleanup path lacks exact ownership proof.
- [x] Validation evidence is recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Remediation map**: `../001-research-synthesis-and-remediation-map/research/remediation-map.md`
- **Source packet 020**: `../001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/research.md`
- **Source packet 024**: `../001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/research.md`
<!-- /ANCHOR:cross-refs -->
