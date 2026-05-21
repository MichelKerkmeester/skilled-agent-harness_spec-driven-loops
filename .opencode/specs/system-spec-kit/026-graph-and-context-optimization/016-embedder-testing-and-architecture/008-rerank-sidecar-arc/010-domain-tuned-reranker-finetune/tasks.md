---
title: "Tasks: domain-tuned reranker fine-tune [template:level_1/tasks.md]"
description: "Task breakdown for the multi-day fine-tune effort."
trigger_phrases:
  - "010 fine-tune tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Wait for 008+009 verdicts; if both HOLD, schedule execution"
    blockers:
      - "Packet 008 verdict pending"
      - "Packet 009 verdict pending"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: domain-tuned reranker fine-tune

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` open, `[!]` blocked. Path-tag `[P]` = PROMOTE-only, `[B]` = both.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Confirm packets 008 + 009 both HOLD (or one PROMOTE → this packet unnecessary) | `[!]` | gate evaluation |
| T002 | P0 | Choose base model: `cross-encoder/ms-marco-MiniLM-L-6-v2` (default) or `BAAI/bge-reranker-base` | `[ ]` | decision record |
| T003 | P0 | Confirm HuggingFace access tokens + private/public destination | `[ ]` | env documented |
| T004 | P0 | Write `scripts/generate_triples.py` (reads memory_index, calls LLM, mines negatives) | `[ ]` | script committed |
| T005 | P0 | Write `scripts/finetune.py` (sentence-transformers fit loop) | `[ ]` | script committed |
| T006 | P1 | Snapshot the `memory_index` SQLite for reproducibility | `[ ]` | snapshot path recorded |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T007 | P0 | Generate ≥5k triples; 80/20 train/test split | `[ ]` | data/train.jsonl + data/test.jsonl |
| T008 | P0 | Assert no train/test leakage | `[ ]` | assertion passes |
| T009 | P0 | Run fine-tune (1-3 epochs) on Apple Silicon or cloud A100 | `[ ]` | training log + final loss |
| T010 | P0 | Save artifact (`artifacts/spec-memory-reranker-v1/`) | `[ ]` | artifact files present |
| T011 | P0 | Load artifact into multi-model sidecar allowlist | `[ ]` | /health shows model in allowed_models |
| T012 | P0 | Eval on 50-probe fixture (3 × 50 probes Arm A + Arm B) | `[ ]` | runs/arm-a-off.jsonl + arm-b-finetune.jsonl 150 rows each |
| T013 | P0 | Aggregate + apply gates | `[ ]` | inline summary |
| T014 | P0 | Write benchmark_report.md | `[ ]` | report present |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T015 | P0 [P] | Publish artifact to HF or local registry | `[ ]` | URL + revision sha |
| T016 | P0 [P] | Update sidecar `RERANK_ALLOWED_MODELS` default to include fine-tune | `[ ]` | grep |
| T017 | P0 [P] | Flip `cross-encoder.ts:54` model to fine-tune | `[ ]` | grep |
| T018 | P0 [P] | Flip `SPECKIT_CROSS_ENCODER` default to true | `[ ]` | grep + tests |
| T019 | P0 [P] | Rebuild spec-memory TS | `[ ]` | exit 0 |
| T020 | P0 | Arc 008 parent: phase-map row 010 + status | `[ ]` | grep |
| T021 | P0 | Fill implementation-summary.md | `[ ]` | anchors present |
| T022 | P0 | Strict-validate packet + arc parent | `[ ]` | exit 0/0 |
| T023 | P0 | Commit `feat(016/008/010): domain fine-tune — <PROMOTE|HOLD>` | `[ ]` | git log |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T023 with evidence. Path-tag respected. Arc 008 closes (likely final).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §4 REQ rows → T001..T023
- Predecessor `../007-spec-memory-mps-rerank-promotion/` — MPS OOM
- Predecessor `../008-cap-rerank-top-k/` — cheaper unblock attempt
- Predecessor `../009-fp16-rerank/` — cheaper unblock attempt
- The 2026-05-21 ms-marco bench evidence (`benchmark-2026-05-21-rerank-ab-msmarco/`) — motivates this packet's "model wrong for corpus" hypothesis
- Reference: `mcp_server/database/context-index.sqlite` (memory_index table) — training data source
- Reference: `mcp_server/lib/search/cross-encoder.ts:54` — model field flips on PROMOTE
<!-- /ANCHOR:cross-refs -->
