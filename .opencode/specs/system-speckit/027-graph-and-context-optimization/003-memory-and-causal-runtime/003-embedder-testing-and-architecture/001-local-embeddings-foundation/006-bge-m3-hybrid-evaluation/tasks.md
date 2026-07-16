---
title: "Tasks: Phase 6 — bge-m3 Hybrid Evaluation"
description: "Task list for the bge-m3 vs EmbeddingGemma retrieval-quality eval. Execution gated on 009."
trigger_phrases:
  - "006 tasks bge-m3 eval"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation"
    last_updated_at: "2026-05-12T22:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks drafted; execution awaits 009"
    next_safe_action: "Start T001 once 009 ships"
    blockers:
      - "009 cocoindex IPC fix"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140060c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "014-006-bge-m3-2026-05-12"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6 — bge-m3 Hybrid Evaluation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [B] T001 Confirm 009 cocoindex IPC fix has shipped (search returns success=true)
- [ ] T002 Cache bge-m3 model via `snapshot_download` from venv
- [ ] T003 Build `scratch/eval-set.jsonl` with 40-60 hand-labeled queries (or synthetic fallback)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement `scratch/run-eval.py` (load model, index codebase, run queries, score MRR@10 + NDCG@10)
- [ ] T005 Run baseline: EmbeddingGemma-300m → `results-embeddinggemma.json`
- [ ] T006 Run bge-m3 dense → `results-bge-m3-dense.json`
- [ ] T007 Run bge-m3 hybrid (dense + sparse + colbert via RRF) → `results-bge-m3-hybrid.json`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare MRR@10 + NDCG@10 deltas; record in implementation-summary
- [ ] T009 Spot-check top-10 for 5-10 queries per variant; record face-validity observations
- [ ] T010 Decide ship/don't-ship based on ≥5pp MRR@10 delta threshold
- [ ] T011 Strict validate exits 0
- [ ] T012 If ship recommended: open follow-on packet for sqlite-vec schema extension
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] No `[B]` blocked tasks remaining (009 has shipped)
- [ ] Decision documented with evidence
- [ ] Strict validate exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../004-vec-store-rebuild/implementation-summary.md` (EmbeddingGemma baseline) + `../009-cocoindex-ipc-fix/implementation-summary.md` (working search)
- **Successor**: If `ship` → new sqlite-vec schema packet
<!-- /ANCHOR:cross-refs -->
