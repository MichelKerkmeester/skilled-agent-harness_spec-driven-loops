---
title: "Tasks: 022/007"
description: "9 tasks complete via cli-opencode dispatch."
trigger_phrases: ["022/007 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/016-code-graph-p1-config-extraction"
    last_updated_at: "2026-05-23T18:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks done via dispatch"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002273"
      session_id: "016-002-022-007-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["dispatch shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/007

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[T###]` id
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P0] Pre-dispatch checklist + investigation.
- [x] [T002] [P0] Compose dispatch prompt /tmp/007-prompt.md.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T003] [P1] Dispatch: opencode run --model deepseek/deepseek-v4-pro --variant high PID 63466.
- [x] [T004] [P1] config-defaults.ts created with CODE_GRAPH_DEFAULTS + parsePositiveInt.
- [x] [T005] [P1] 5 consumer imports wired (owner-lease, structural-indexer, apply-orchestrator, budget-allocator, indexer-types).
- [x] [T006] [P1] ENV_REFERENCE.md updated with 5 SPECKIT_CODE_GRAPH_* rows.
- [x] [T007] [P1] config-defaults.vitest.ts invariant test (15 assertions).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T008] [P0] typecheck:root exit 0.
- [x] [T009] [P0] 15/15 invariant test pass.
- [x] [T010] [P0] vitest: 58 pass, 1 pre-existing failure, 0 new failures.
- [x] [T011] [P0] CODE_GRAPH_DEFAULTS import count = 6 (1 decl + 5 consumer files).
- [x] [T012] [P0] Strict-validate phase 007 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
6 P1 + 10 P2 closed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R7 ↔ T008–T012
<!-- /ANCHOR:cross-refs -->
