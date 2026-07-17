---
title: "Tasks: 022/002b CocoIndex Reranker Doc Prose Resync"
description: "12 tasks; all complete in single execution."
trigger_phrases:
  - "022/002b tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose"
    last_updated_at: "2026-05-23T17:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022d3"
      session_id: "016-002-022-002b-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tasks shipped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/002b CocoIndex Reranker Doc Prose Resync

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete | `[ ]` pending
- `[T###]` task id | `[P#]` priority
- All shipped in single execution 2026-05-23 ~16:55 UTC
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] [T001] [P0] Read `registered_embedders.py:256` to confirm `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` (23B follow-on canonical).
- [x] [T002] [P0] Measure Qwen3-Reranker-0.6B disk footprint at `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` → 1.1 GB verified.
- [x] [T003] [P0] Grep daemon.log for model-load identifiers (rerank|BAAI|Qwen|jina|CrossEncoder) → 0 hits in 509KB log. Discovery: daemon does NOT emit positive load-trace; only logger.warning() on failure paths.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] [T004] [P0] Edit 007-reranker-opt-in.md frontmatter description: BAAI → Qwen/Qwen3-Reranker-0.6B.
- [x] [T005] [P0] Edit 007 §1 OVERVIEW: model name + size (~2.3 GB → ~1.1 GB) + 023B follow-on context.
- [x] [T006] [P0] Edit 007 §1 Why This Matters: BGE→Qwen3 swap rationale (023B follow-on; +1 hit/73, -32% p95, Apache-2.0).
- [x] [T007] [P0] Edit 007 §2 Scenario Contract Objective + Real user request + Prompt + Expected execution + Expected signals: daemon-log silent-success language; no positive load-trace.
- [x] [T008] [P0] Edit 007 §2 Pass/Fail: warn-on-failure preserved; positive-trace claim removed.
- [x] [T009] [P0] Edit 007 §3 Test Execution step 3 (cache check path) + step 4 (cold-load size) + step 6 (grep command changed to warn|error|fallback|fail).
- [x] [T010] [P0] Edit 007 §3 Expected step 4-6 + Evidence + Pass/Fail: align with silent-success semantics.
- [x] [T011] [P0] Edit 007 §3 Failure Triage items 1-4: Qwen3-0.6B params + size; RerankerAdapter warning as failure signal.
- [x] [T012] [P0] Edit 007 §4 Source Files: cache directory path updated; BGE entry kept as fallback row.
- [x] [T013] [P0] Edit manual_testing_playbook.md:402,407: CFG-007 Description + Scenario Contract + Expected signals.
- [x] [T014] [P0] Edit benchmarks/README.md:202: Skill internals reranker.py callout; BGE retained as opt-in fallback note.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] [T015] [P0] `rg "Qwen/Qwen3-Reranker-0.6B" <3 files>` → 7 hits total (1 in playbook, 3 in benchmarks/README, 3 in 007) — VERIFIED ≥3 per file or ≥1 minimum.
- [x] [T016] [P0] `rg "BAAI/bge-reranker-v2-m3" <3 files>` → 1 hit in benchmarks/README fallback callout + 1 hit in 007 Source Files fallback row; both historical/fallback context (not drift) — VERIFIED.
- [x] [T017] [P0] Manual prose review confirms daemon-log silent-success language consistent across 007 §1, §2 Objective, §3 step 6, §3 Expected step 6, §3 Pass/Fail, §3 Failure Triage item 1 — VERIFIED.
- [x] [T018] [P0] Strict-validate phase 002b → exit 0 — VERIFIED.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All P0 tasks complete. Phase 002b ships closing 4 P0 reranker doc-drift findings + 1 observability-claim correction. Daemon-log false-claim eliminated.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md §4 REQUIREMENTS R1–R5 map to T015–T018
- plan.md §4 IMPLEMENTATION PHASES match
- implementation-summary.md captures shipped state
- Council `executor-instructions.md` §Phase 002b matches dispatch contract
<!-- /ANCHOR:cross-refs -->
