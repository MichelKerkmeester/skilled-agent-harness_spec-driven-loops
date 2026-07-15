---
title: "Tasks: spec-memory MPS rerank promotion candidate [template:level_1/tasks.md]"
description: "Task breakdown for packet 007 — MPS load smoke + A/B + decision."
trigger_phrases:
  - "007 mps tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Execute T001"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: spec-memory MPS rerank promotion candidate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag**: P0 (blocker), P1 (required), P2 (nice-to-have)
- **Path-tag**: [P] PROMOTE-only, [H] HOLD-only, [B] both paths
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Stop running sidecar; verify port 8765 free | `[x]` | pgrep empty |
| T002 | P0 | Start sidecar with `RERANK_DEVICE=mps` (Qwen default) | `[x]` | /health 200 |
| T003 | P0 | `POST /warmup` (default model = Qwen) | `[x]` | `status:warmed` returned |
| T004 | P0 | 3-doc smoke `POST /rerank` | `[x]` | 200 with bounded sigmoid scores, `latency_ms` recorded |
| T005 | P1 | Grep uvicorn log for MPS errors / fallback warnings | `[x]` | log noted; fallback ops listed |
| T006 | P0 | Create benchmark folder `benchmark-2026-05-21-spec-memory-mps/` | `[x]` | dir exists |
| T007 | P0 | Copy canonical 50-probe fixture | `[x]` | `rerank-ab-fixture.json` present |
| T008 | P0 | Verify `cross-encoder.ts:54` model is Qwen; edit + rebuild if not | `[x]` | grep + dist/ updated |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T009 | P0 | Run Arm A (sidecar OFF) 3 × 50 probes | `[x]` | `runs/arm-a-off.jsonl` 150 rows |
| T010 | P0 | Run Arm B (Qwen-MPS via sidecar) 3 × 50 probes | `[x]` | `runs/arm-b-mps.jsonl` 150 rows |
| T011 | P0 | Aggregate per-arm: hits, hit-rate, MRR, latencies, sidecar reach | `[x]` | inline Python summary |
| T012 | P0 | Apply 4-gate decision rule literally | `[x]` | per-gate pass/fail recorded |
| T013 | P0 | Write `benchmark_report.md` §1-§8 (phase 004 shape) | `[x]` | report present |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T014 | P0 [P] | Flip `cross-encoder.ts:54` to Qwen | `[ ]` | grep |
| T015 | P0 [P] | Flip `SPECKIT_CROSS_ENCODER` default to true in `search-flags.ts` | `[ ]` | grep + tests |
| T016 | P0 [P] | Rebuild spec-memory TS | `[ ]` | `npm run build` exit 0 |
| T017 | P0 | Arc 008 parent: phase-map row 007 + status | `[x]` | grep + git diff |
| T018 | P0 | Fill `implementation-summary.md` with actual results | `[x]` | anchors present, numbers inline |
| T019 | P0 | Strict-validate this packet + arc parent | `[x]` | exit 0/0 |
| T020 | P0 | Commit `feat(016/008/007): spec-memory mps rerank — <PROMOTE|HOLD>` | `[x]` | git log |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T020 with evidence. Path-tag respected (T014-T016 only on PROMOTE). Arc 008 closes again.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-010 mapping to T001..T020
- `plan.md` §4 Implementation Phases — Phase A-E mapping
- Predecessor `../004-spec-memory-rerank-benchmark/` — original CPU bench that gated HOLD
- Predecessor `../006-cocoindex-dedup-from-shared-sidecar/` — multi-model sidecar arrived here
- Reference: `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.py` — harness reused
- Reference: `mcp_server/lib/search/cross-encoder.ts:54` — model field flips on PROMOTE
- Reference: `mcp_server/lib/search/search-flags.ts` — `SPECKIT_CROSS_ENCODER` default flips on PROMOTE
<!-- /ANCHOR:cross-refs -->
