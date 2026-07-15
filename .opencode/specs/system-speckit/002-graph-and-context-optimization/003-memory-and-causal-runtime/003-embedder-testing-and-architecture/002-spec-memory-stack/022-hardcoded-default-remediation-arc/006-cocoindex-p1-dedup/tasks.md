---
title: "Tasks: 022/006 CocoIndex Python Dedup"
description: "8 tasks; all complete."
trigger_phrases: ["022/006 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup"
    last_updated_at: "2026-05-23T17:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002263"
      session_id: "016-002-022-006-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Tasks shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/006 CocoIndex Python Dedup

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[T###]` id | `[P#]` priority
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P0] Read config.py:20-30, indexer.py:35-45, reranker.py:37-45 to confirm pre-edit state.
- [x] [T002] [P0] Verify P2 rebuttals (settings.py:87 instance default, rerankers_jina_v3.py:54 used param).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T003] [P1] Add `_DEFAULT_RERANK_VIA_SIDECAR = True` constant + docstring to config.py:25-29.
- [x] [T004] [P1] config.py:775 Config.from_env: replace `True` literal with `_DEFAULT_RERANK_VIA_SIDECAR`.
- [x] [T005] [P1] indexer.py:38-40: replace inline CHUNK_* declarations with `from ..config.config import` aliases.
- [x] [T006] [P1] reranker.py:_rerank_via_sidecar_enabled: replace inline `True` return with lazy-imported `_DEFAULT_RERANK_VIA_SIDECAR`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T007] [P0] Python syntax check 3 files exit 0.
- [x] [T008] [P0] Ban-list: `^CHUNK_SIZE *=|^MIN_CHUNK_SIZE *=|^CHUNK_OVERLAP *=` in indexer.py → 0 hits.
- [x] [T009] [P0] `_DEFAULT_RERANK_VIA_SIDECAR` grep in cocoindex_code → 4 hits (1 decl + 3 uses).
- [x] [T010] [P0] Strict-validate phase 006 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
All P1 closed. P2 over-flags rebutted.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- spec.md R1–R6 ↔ T003–T010
- plan.md phases match
<!-- /ANCHOR:cross-refs -->
