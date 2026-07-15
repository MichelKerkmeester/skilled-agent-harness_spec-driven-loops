---
title: "Tasks: 022/005"
description: "8 tasks complete via cli-opencode dispatch."
trigger_phrases: ["022/005 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation"
    last_updated_at: "2026-05-23T18:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks done via dispatch"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002253"
      session_id: "016-002-022-005-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["dispatch shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/005

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[T###]` id
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P0] Pre-dispatch checklist (preflight + investigation + sk-prompt + CLEAR).
- [x] [T002] [P0] Compose dispatch prompt /tmp/005-prompt.md.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T003] [P1] Dispatch: opencode run --model deepseek/deepseek-v4-pro --variant high PID 37723.
- [x] [T004] [P1] registry.ts extension (RerankerProvider + RERANKER_CANONICAL + getRerankerFallback) — PASS.
- [x] [T005] [P1] providers/voyage.ts + providers/openai.ts — PASS.
- [x] [T006] [P1] auto-select.ts (VOYAGE_MODEL/OPENAI_MODEL/HF_LOCAL_MODEL/OLLAMA_PRIORITY) — PASS.
- [x] [T007] [P1] cross-encoder.ts PROVIDER_CONFIG.local — PASS.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T008] [P0] typecheck:root exit 0.
- [x] [T009] [P0] vitest: 678 pass, 3 pre-existing failures (DB fixtures, tool count, sidecar — unrelated).
- [x] [T010] [P0] Ban-list grep returns 0 hits in production paths.
- [x] [T011] [P0] Strict-validate phase 005 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
7 P1 closed. Bundle gate PASS.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R8 ↔ T003–T011
<!-- /ANCHOR:cross-refs -->
