---
title: "Tasks: cap spec-memory rerank top-k [template:level_1/tasks.md]"
description: "Tasks for env override + bench + verdict."
trigger_phrases:
  - "008 cap top-k tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Execute T001"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cap spec-memory rerank top-k

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **Path-tag**: [P] PROMOTE-only, [B] both paths
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Add `SPECKIT_RERANK_LOCAL_MAX_DOCS` env read in cross-encoder.ts | `[x]` | grep |
| T002 | P0 | Pin `cross-encoder.ts:54` model to Qwen for this bench | `[x]` | grep |
| T003 | P0 | `npm run build` | `[x]` | exit 0 |
| T004 | P0 | Stop any running sidecar; start fresh with `RERANK_DEVICE=mps` | `[x]` | /health 200 |
| T005 | P0 | Warmup Qwen | `[x]` | status:warmed |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T006 | P0 | Create benchmark folder `benchmark-2026-05-21-cap-top-k/` | `[x]` | dir + fixture |
| T007 | P0 | Run Arm A (sidecar OFF) 3 × 50 | `[x]` | runs/arm-a-off.jsonl 150 rows |
| T008 | P0 | Run Arm B (Qwen-MPS, SPECKIT_RERANK_LOCAL_MAX_DOCS=10) 3 × 50 | `[x]` | runs/arm-b-cap10.jsonl 150 rows |
| T009 | P0 | Aggregate + apply gates | `[x]` | inline summary |
| T010 | P0 | Write benchmark_report.md | `[x]` | report present |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T011 | P0 [P] | Flip `PROVIDER_CONFIG.local.maxDocuments` to 10 default | `[ ]` | grep |
| T012 | P0 [P] | Flip `SPECKIT_CROSS_ENCODER` default to true | `[ ]` | grep |
| T013 | P0 [B] | Revert `cross-encoder.ts:54` to ms-marco | `[x]` | grep |
| T014 | P0 [B] | Rebuild spec-memory TS | `[x]` | exit 0 |
| T015 | P0 | Arc 008 parent: phase-map row 008 + status | `[x]` | diff |
| T016 | P0 | Fill implementation-summary.md | `[x]` | anchors present |
| T017 | P0 | Strict-validate packet + arc parent | `[x]` | exit 0/0 |
| T018 | P0 | Commit `feat(016/008/008): cap rerank top-k — <PROMOTE|HOLD>` | `[x]` | git log |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T018 with evidence. Path-tag respected (T011-T012 PROMOTE-only). Arc 008 closes again with 008 marked.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §4 REQ rows → T001..T018
- Predecessor `../007-spec-memory-mps-rerank-promotion/` — the MPS OOM that motivates this packet
- Reference: `mcp_server/lib/search/cross-encoder.ts:478` — provider cap site
<!-- /ANCHOR:cross-refs -->
