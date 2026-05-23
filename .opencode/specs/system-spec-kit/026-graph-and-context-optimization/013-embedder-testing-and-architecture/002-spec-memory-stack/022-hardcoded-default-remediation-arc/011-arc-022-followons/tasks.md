---
title: "Tasks: 022/011"
description: "13 tasks; 4 deferred."
trigger_phrases: ["022/011 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons"
    last_updated_at: "2026-05-23T18:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b13"
      session_id: "016-002-022-011-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Tasks shipped + deferred items documented"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- REVERTED: T004 (cli-codex dispatch) + T005 (memory + MEMORY.md index) REVERTED 2026-05-23 same-day per operator directive. Wrapper deleted, SKILL.md rule 5 reverted, memory repurposed as documentation-only. See implementation-summary.md §6 "Post-ship Reversion". -->

# Tasks: 022/011

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[~]` deferred | `[T###]` id
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P0] Plan-mode workflow: 3 Explore agents diagnose MCP-32000 + validator + opencode-idle-kill. Final plan written + approved via ExitPlanMode.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T002] [P0] Step 1: MCP recovery (kill orphans, clear stale state, rebuild, JSON copy).
- [x] [T003] [P0] Step 2: Validator 6-bug fix (matchAll /g flag x2, sbert/ prefix, / suffix regex, path resolution, wrapper normalization).
- [x] [T004] [P0] Step 3: cli-codex gpt-5.5 high fast dispatch shipped opencode-persistent + SKILL.md edit.
- [x] [T005] [P0] Step 3 main-agent: memory entry + MEMORY.md index.
- [x] [T006] [P0] Step 4a: RERANKER_CANONICAL voyage/cohere fill + TODO.
- [~] [T007] DEFERRED Step 4b: LANE_WEIGHTS_JSON structural (~90 min + bench-diff).
- [~] [T008] DEFERRED Step 4c: ENV_REFERENCE consistency pass.
- [~] [T009] DEFERRED Step 4d: validator pre-commit hook (blocked on llama-cpp canonical addition).
- [~] [T010] DEFERRED build-pipeline permanent JSON-copy fix (package.json postbuild).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T011] [P0] MCP launcher probe exits 0 with SPECKIT_IPC_SOCKET_DIR set.
- [x] [T012] [P0] Validator exits 1 on remaining drift; no longer flags Qwen3 or sbert/-wrapped names.
- [x] [T013] [P0] opencode-persistent --detect prints version + diagnosis + selected mode.
- [x] [T014] [P0] cli-opencode SKILL.md rule 5 contains "reactive-EOF" + opencode-persistent reference.
- [x] [T015] [P0] Memory entry exists + indexed in MEMORY.md.
- [x] [T016] [P0] system-spec-kit typecheck:root exit 0.
- [x] [T017] [P0] Strict-validate phase 011 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
4 active debts cleared. 4 deferred items captured in tasks + spec.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R9 ↔ T011–T017
<!-- /ANCHOR:cross-refs -->
