---
title: "Implementation Plan: Phase 6 — bge-m3 Hybrid Evaluation"
description: "Evaluate bge-m3 dense + hybrid against EmbeddingGemma baseline on code retrieval. Eval-only; ship decision is the deliverable. Gated on 009."
trigger_phrases:
  - "006 plan bge-m3 eval"
  - "MRR NDCG harness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation"
    last_updated_at: "2026-05-12T22:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan filled; execution awaits 009"
    next_safe_action: "Build eval set once 009 ships"
    blockers:
      - "009 cocoindex IPC fix"
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140060c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-006-bge-m3-2026-05-12"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6 — bge-m3 Hybrid Evaluation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 (sentence-transformers for both models, sqlite-vec for KNN, RRF fusion via Reciprocal Rank Fusion) |
| **Framework** | Standalone harness in `006/scratch/run-eval.py`; uses cocoindex's query path post-009 |
| **Storage** | Three sqlite-vec DBs: existing target_sqlite.db (EmbeddingGemma-300m 768-dim), bge-m3-dense.sqlite (1024-dim), bge-m3-hybrid.sqlite (multi-vec) |
| **Testing** | Manual eval run; MRR@10 + NDCG@10 against hand-labeled set |

### Overview
Side-by-side eval. Build eval set, index 3 variants, compute metrics, decide. The plan keeps schema decisions out of scope — Phase 6 only measures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 009 cocoindex IPC fix shipped (search returns valid results)
- [ ] bge-m3 model cached or downloadable

### Definition of Done
- [ ] Eval set + 3 results files
- [ ] Decision recorded
- [ ] Strict validate exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Eval harness with strict separation: one DB per model variant; one set of queries; one scoring function. No production code touched in this packet.

### Key Components
- **Eval set (`scratch/eval-set.jsonl`)**: 40-60 lines, each `{"query": "...", "relevant_files": ["path/a", "path/b"]}`
- **Harness (`scratch/run-eval.py`)**: load model → encode docs → store in sqlite-vec → encode queries → KNN top 10 → score MRR + NDCG
- **Scorer**: standard `MRR@10 = mean(1/rank_of_first_relevant)`; `NDCG@10` with binary relevance

### Data Flow
Eval-set + 3 indexes → per-query top-10 retrieval → per-query score → mean across queries → decision matrix.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `006/scratch/eval-set.jsonl` | Eval ground truth | Create | ≥40 lines, validates as JSONL |
| `006/scratch/run-eval.py` | Scoring harness | Create | Runs end-to-end without errors |
| `006/scratch/results-*.json` | Per-model metrics | Create | Three files, each with MRR@10 + NDCG@10 + latency stats |
| Production sqlite-vec schema | Single 768-dim column | UNCHANGED in 006 (decision goes in implementation-summary) | n/a |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 009 ships before starting
- [ ] Cache bge-m3 model
- [ ] Build eval-set.jsonl (hand-label or synthesize)

### Phase 2: Run
- [ ] Index codebase with EmbeddingGemma (baseline already exists in target_sqlite.db post-009)
- [ ] Index codebase with bge-m3 dense
- [ ] Index codebase with bge-m3 hybrid (dense + sparse + colbert via RRF)
- [ ] Score each variant: MRR@10, NDCG@10, query p95 latency, index wall time

### Phase 3: Decide
- [ ] Compare deltas
- [ ] If hybrid bge-m3 beats EmbeddingGemma-dense by ≥5pp MRR@10 → recommend ship + open follow-on for schema work
- [ ] Otherwise → recommend status quo (stay on EmbeddingGemma-300m baseline)
- [ ] Document in implementation-summary
- [ ] Strict validate exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Full eval harness end-to-end | Python script in scratch/ |
| Manual | Spot-check 5-10 top-10 results per variant for face validity | Manual inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 009 cocoindex IPC fix | Internal | Pending | Hard blocker |
| bge-m3 model in HF | External | Green (HF has it) | snapshot_download will pull ~2GB |
| Hand-labeled eval set | Manual | Yellow | Fall back to synthetic if hand-labels exceed 4h budget |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Eval results show bge-m3 ≪ EmbeddingGemma-300m baseline, but a stakeholder still wants the schema change
- **Procedure**: Decision is documented; schema work is its own packet anyway. Nothing to roll back in 006.
<!-- /ANCHOR:rollback -->
