---
title: "Tasks: fp16 cross-encoder weights on MPS [template:level_1/tasks.md]"
description: "Tasks for sidecar dtype handler + OOM smoke + bench + verdict."
trigger_phrases:
  - "009 fp16 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "T001"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: fp16 cross-encoder weights on MPS

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` open, `[!]` blocked. Path-tag `[P]` = PROMOTE-only, `[B]` = both paths.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Add `RERANK_TORCH_DTYPE` env handler in `rerank_sidecar.py:_load_model` | `[x]` | grep |
| T002 | P0 | Add `RERANK_TORCH_DTYPE` to start.sh env allowlist | `[x]` | grep |
| T003 | P0 | Python smoke: load Qwen with fp16; assert `model.dtype == torch.float16` | `[x]` | print output |
| T004 | P0 | Pin `cross-encoder.ts:54` to Qwen; rebuild TS | `[x]` | grep + npm run build exit 0 |
| T005 | P0 | Stop any running sidecar; start fresh with MPS+fp16 | `[x]` | /health 200 |
| T006 | P0 | Warmup Qwen | `[x]` | status:warmed |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T007 | P0 | 50-doc batch `/rerank` smoke (does it OOM?) | `[x]` | 200 + scores OR uvicorn log shows OOM |
| T008 | P0 | If OOM: record + skip to Phase D HOLD. Else: continue. | `[x]` | gate decision recorded |
| T009 | P0 | Create benchmark folder `benchmark-2026-05-21-fp16-rerank/` | `[x]` | dir + fixture |
| T010 | P0 | Run Arm A (sidecar OFF) 3 × 50 | `[x]` | arm-a-off.jsonl 150 rows |
| T011 | P0 | Run Arm B (MPS+fp16) 3 × 50 | `[x]` | arm-b-fp16.jsonl 150 rows |
| T012 | P0 | Aggregate + apply gates | `[x]` | inline summary |
| T013 | P0 | Write benchmark_report.md | `[x]` | report present |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T014 | P0 [P] | Flip `SPECKIT_CROSS_ENCODER` default to true | `[ ]` | grep |
| T015 | P0 [B] | Revert `cross-encoder.ts:54` to ms-marco | `[x]` | grep |
| T016 | P0 [B] | Rebuild spec-memory TS | `[x]` | exit 0 |
| T017 | P0 | Arc 008 parent: phase-map row 009 + status | `[x]` | grep |
| T018 | P0 | Fill implementation-summary.md | `[x]` | anchors present |
| T019 | P0 | Strict-validate packet + arc parent | `[x]` | exit 0/0 |
| T020 | P0 | Commit `feat(016/008/009): fp16 rerank — <PROMOTE|HOLD>` | `[x]` | git log |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T020 with evidence. Path-tag respected.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §4 REQ rows → T001..T020
- Predecessor `../007-spec-memory-mps-rerank-promotion/` — MPS OOM that motivates this packet
- Sibling `../008-cap-rerank-top-k/` — orthogonal lever (batch size); both can stack if individually fail
- Reference: `scripts/rerank_sidecar.py:_load_model` — patch site
<!-- /ANCHOR:cross-refs -->
