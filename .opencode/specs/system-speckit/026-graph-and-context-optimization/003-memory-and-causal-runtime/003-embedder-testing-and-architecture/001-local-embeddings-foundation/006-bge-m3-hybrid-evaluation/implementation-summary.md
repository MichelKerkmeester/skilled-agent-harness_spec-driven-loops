---
title: "Implementation Summary: 014/006 bge-m3-hybrid-evaluation"
description: "(Scaffolded — pending 009 unblock.) Planning packet for the bge-m3 vs EmbeddingGemma retrieval-quality side-by-side eval. Decision matrix: ship sqlite-vec schema extension only if hybrid bge-m3 beats EmbeddingGemma-dense by ≥5pp MRR@10."
trigger_phrases:
  - "014/006 bge-m3 eval planned"
  - "MRR delta decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/006-bge-m3-hybrid-evaluation"
    last_updated_at: "2026-05-12T22:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Planning scaffold; 009 must ship first"
    next_safe_action: "Wait for 009; then T002-T010"
    blockers:
      - "009 cocoindex IPC fix"
    key_files:
      - "implementation-summary.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140060c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-006-bge-m3-2026-05-12"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-bge-m3-hybrid-evaluation |
| **Completed** | (pending — gated on 009) |
| **Level** | 1 |
| **Status** | Planned (25%) — packet docs filled, execution awaits 009 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

(Pending execution. Planning packet that defines the eval methodology, query-set construction approach, and ship/don't-ship decision threshold.)

The intent is a small-N (40-60 query) side-by-side comparison of three retrieval variants against this codebase, using MRR@10 + NDCG@10 as the primary metrics:

- **EmbeddingGemma-300m** (current Setup A baseline)
- **bge-m3 dense** (single-vector, 1024-dim)
- **bge-m3 hybrid** (dense + sparse + colbert combined via Reciprocal Rank Fusion)

Decision rule: ship the schema extension to support multi-vector retrieval only if hybrid bge-m3 wins by ≥5 percentage points MRR@10 over the EmbeddingGemma baseline. The 5pp threshold reflects "noticeable to a real user", not just statistical significance on a 50-query sample.

### Files Changed

(Pending. Expected change set:)

| File | Action | Purpose |
|------|--------|---------|
| `006/scratch/eval-set.jsonl` | (planned) Create | 40-60 hand-labeled or synthetic query / relevant-files pairs |
| `006/scratch/run-eval.py` | (planned) Create | Standalone Python harness: index → query → score |
| `006/scratch/results-*.json` | (planned) Create | Per-variant MRR@10 + NDCG@10 + latency stats |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(Pending. Will use a Python script in `scratch/`, calling sentence-transformers for both models and sqlite-vec for KNN. No production code changes in 006 — the schema decision is the deliverable, not the schema itself.)
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Eval-only packet; schema work belongs to a follow-on if 006 says "ship" | Keeps the decision honest: measure first, then build. A bundled "eval + ship" packet would have a strong sunk-cost pull toward shipping regardless of results. |
| 5pp MRR@10 threshold | Empirically the floor at which retrieval-quality wins are noticeable to actual users; below that the cost of schema redesign isn't justified. |
| Run on 40-60 queries, not 200+ | Diminishing returns past 50 queries on a single-codebase eval; cost of hand-labels grows fast. Report 95% CI and require a clean ≥5pp delta. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(Pending execution. Planned verification commands:)

| Check | Command | Result |
|-------|---------|--------|
| Eval set is valid JSONL | `python -c "import json; [json.loads(l) for l in open('scratch/eval-set.jsonl')]"` | (pending) |
| EmbeddingGemma baseline result file exists with MRR@10 | `jq '.mrr_at_10' scratch/results-embeddinggemma.json` | (pending) |
| bge-m3 dense result file exists with MRR@10 | `jq '.mrr_at_10' scratch/results-bge-m3-dense.json` | (pending) |
| bge-m3 hybrid result file exists with MRR@10 | `jq '.mrr_at_10' scratch/results-bge-m3-hybrid.json` | (pending) |
| Decision recorded with evidence | grep `recommend` in this implementation-summary | (pending) |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` | (pending — expect exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Gated on 009.** Cannot run the EmbeddingGemma baseline via cocoindex search until the msgspec truncation is fixed. Direct sqlite-vec KNN works (per 004 §Known Limitations 8) but it bypasses cocoindex's rerank/filter logic, so direct-vec numbers aren't comparable to production search.
2. **Small-N eval set.** 40-60 queries gives wide 95% CIs. A clean ≥5pp delta is required to ship; smaller deltas should not justify a schema change.
3. **Eval is in-distribution.** All queries come from this codebase's vocabulary. Generalization to a different codebase isn't measured.
4. **bge-m3 model not yet cached.** ~2GB download via snapshot_download is needed before T002.
5. **No latency-vs-quality tradeoff line.** A model that wins MRR@10 by 7pp but is 5× slower might still be wrong to ship. Latency stats will be captured but the decision rule above doesn't penalize them.
<!-- /ANCHOR:limitations -->
