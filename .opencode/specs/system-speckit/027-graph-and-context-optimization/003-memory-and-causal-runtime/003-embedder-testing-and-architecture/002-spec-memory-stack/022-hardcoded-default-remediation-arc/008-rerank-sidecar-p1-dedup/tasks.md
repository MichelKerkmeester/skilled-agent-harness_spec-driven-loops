---
title: "Tasks: 022/008"
description: "9 tasks complete."
trigger_phrases: ["022/008 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup"
    last_updated_at: "2026-05-23T17:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002283"
      session_id: "016-002-022-008-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Tasks shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/008 Rerank-Sidecar Default Consolidation

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[T###]` id | `[P#]` priority
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P0] Investigate 4 inline-duplicate sites: rerank_sidecar.py:49-54, ensure_rerank_sidecar.py:64+155, start.sh:43+73, ensure-rerank-sidecar.cjs:19+610.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T002] [P1] Write sidecar_defaults.py with DEFAULT_PORT=8765, DEFAULT_MODEL_NAME="Qwen/Qwen3-Reranker-0.6B", DEFAULT_MODEL_REVISION="e61197ed4..." + cross-language consumer documentation.
- [x] [T003] [P1] rerank_sidecar.py:49-54 swap inline literals → lazy import from sidecar_defaults.
- [x] [T004] [P1] ensure_rerank_sidecar.py:64 DEFAULT_PORT → import from sidecar_defaults.
- [x] [T005] [P1] ensure_rerank_sidecar.py:155 _canonical_config_hash → lazy-import DEFAULT_MODEL_NAME + DEFAULT_MODEL_REVISION.
- [x] [T006] [P1] start.sh:43,73 add cross-language sync comments.
- [x] [T007] [P1] ensure-rerank-sidecar.cjs:19,610 add cross-language sync comments.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T008] [P0] py_compile 3 Python files exit 0.
- [x] [T009] [P0] bash -n start.sh + use-model.sh exit 0.
- [x] [T010] [P0] node -c ensure-rerank-sidecar.cjs exit 0.
- [x] [T011] [P0] Cross-language sync comment count ≥ 4 (got 4).
- [x] [T012] [P0] sidecar_defaults import-site count = 9 (3 imports × 3 lines lazy try/except).
- [x] [T013] [P0] Strict-validate phase 008 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
4 P1 closed. 9 P2 over-flags rebutted (tuned constants, not drift).
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R6 ↔ T008–T013
<!-- /ANCHOR:cross-refs -->
