---
title: "Plan: domain-tuned reranker fine-tune [template:level_1/plan.md]"
description: "Five-phase plan: data generation, fine-tune, eval, publish/flip, closeout. Multi-day effort."
trigger_phrases:
  - "010 fine-tune plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan scaffolded; execution gated"
    next_safe_action: "Wait for packets 008/009 verdicts"
    blockers:
      - "Packet 008 verdict pending"
      - "Packet 009 verdict pending"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: domain-tuned reranker fine-tune

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five phases. Total wall clock: 1-3 working days.

| Phase | What | Wall clock |
|-------|------|-----------|
| A | Data generation: synthetic queries + hard negatives | ~4-8 hours |
| B | Fine-tune base cross-encoder (1-3 epochs) | ~2-6 hours |
| C | Eval on 50-probe fixture | ~30 min |
| D | Publish artifact + decision rule + flip default (or HOLD) | ~1 hour |
| E | Arc parent update + commit | ~30 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

```
PROMOTE iff
  fine_tuned_hit_rate >= off_baseline_hit_rate + 0.02      (≥3 hits / 150)
  AND fine_tuned_p95_ms <= off_baseline_p95_ms + 500
  AND sidecar reach >= 0.95
  AND training/eval data shows no train/test leakage
  AND tests still green
ELSE HOLD (rerank stays default-off permanently for this corpus).
```

Auxiliary:
- License: base model + fine-tune both Apache-2.0 (no surprise licensing).
- Reproducibility: data-generation script + training script committed to the packet.
- Strict-validate exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Training data shape

```python
{
  "query": "where is the reranker config for cocoindex?",
  "positive_doc_id": "system-spec-kit/.../008-rerank-sidecar-arc/006/spec.md",
  "negative_doc_ids": [
    "system-spec-kit/.../008-rerank-sidecar-arc/004/spec.md",   # same arc, different phase
    "system-spec-kit/.../005-embedder-arc/.../spec.md",         # different arc
    "...",
  ],
  "split": "train" | "test"
}
```

Generated via:

1. For each indexed doc in `memory_index` (skip ones marked `drop`):
   - LLM prompt: "Generate 2-3 natural-language queries a developer might ask to find this doc."
   - Save (query, doc_id) pairs as positives.
2. For each positive, mine hard negatives:
   - Take docs with same `parent_id` (arc neighbors) — confusing because they look similar but aren't the answer.
   - Take docs with same `path_class` (`spec`, `plan`, etc.) — same template, different content.
3. 80/20 train/test split by doc_id (NOT by query) so a held-out doc never leaks into training.

### Fine-tune shape

```python
# Pseudocode
from sentence_transformers import CrossEncoder, InputExample
from sentence_transformers.cross_encoder.losses import MultipleNegativesRankingLoss

model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
train_examples = [InputExample(texts=[q, pos], label=1.0) for ...]
loss = MultipleNegativesRankingLoss(model)
model.fit(train_examples, epochs=2, learning_rate=2e-5)
model.save("spec-memory-reranker-v1")
```

### Serving shape

The fine-tuned artifact is added to the sidecar's allowlist via `RERANK_ALLOWED_MODELS`. Spec-memory's `cross-encoder.ts:54` config field is pointed at the new model name. Cocoindex unaffected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Data generation

1. Script: `scripts/generate_triples.py`. Reads `memory_index`, calls LLM for synthetic queries, mines hard negatives via graph-metadata edges.
2. Output: `data/train.jsonl`, `data/test.jsonl` (gitignored; reproducible).
3. Validation: assert no doc_id appears in both train + test.

### Phase B — Fine-tune

1. Script: `scripts/finetune.py`. Loads base model, runs `model.fit` for 1-3 epochs.
2. Output: `artifacts/spec-memory-reranker-v1/` (gitignored; published separately).
3. Validation: final eval-set loss < initial; loss curve descends.

### Phase C — Eval

1. Load the artifact into the multi-model sidecar via `RERANK_ALLOWED_MODELS` + `RERANK_MODEL_REVISIONS`.
2. Point `cross-encoder.ts:54` at the fine-tuned model name for the bench.
3. Run the same 50-probe A/B as packets 007/008/009.
4. Aggregate hit-rate + MRR + p95 + sidecar reach.

### Phase D — Decision

Per the gates. On PROMOTE: publish artifact (private or public), bake into sidecar default allowlist, flip `SPECKIT_CROSS_ENCODER` default to true, update spec-memory docs. On HOLD: document the failure as the definitive "rerank slot is non-load-bearing for this corpus" finding; remove the open question.

### Phase E — Closeout

Strict-validate; arc parent update (this is likely the final phase of arc 008); commit `feat(016/008/010): domain fine-tune — <PROMOTE|HOLD>`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Phase A: assertion in the generation script — `assert not (train_doc_ids & test_doc_ids)`.
- Phase B: training log + final loss values.
- Phase C: bench harness (reused from phase 004).
- Phase D: programmatic gate evaluation.

Reproducibility tests: re-running `generate_triples.py` with the same seed + corpus snapshot produces identical triples.

Rollback: revert `cross-encoder.ts:54` to ms-marco; revert `search-flags.ts` default; unpublish the artifact if private; sidecar allowlist stays (extra allowlisted model is harmless).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Spec-memory's indexed corpus (`memory_index` SQLite) — source data.
- LLM API for synthetic query generation (gpt-5.5 or similar).
- BGE or ColBERT-mini for hard-negative mining.
- Multi-model sidecar (`9349f5f4a`) — serves the fine-tuned artifact.
- Packets 008 + 009 verdicts — execution gated on both completing.
- HuggingFace Hub or local artifact registry — publish destination.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the fine-tune ships PROMOTE and a regression surfaces:

1. Revert `cross-encoder.ts:54` to the prior local-provider default.
2. Revert `search-flags.ts` SPECKIT_CROSS_ENCODER default to false.
3. Rebuild spec-memory TS.
4. Optionally remove the fine-tuned model from sidecar allowlist (`RERANK_ALLOWED_MODELS`).
5. The artifact itself stays in HF/local cache — re-pin a future operator if needed.

If fine-tune ships HOLD:

1. No source changes to revert.
2. Document the verdict; arc 008 closes (likely final).
3. Spec-memory's rerank slot is permanently non-load-bearing for this corpus.
<!-- /ANCHOR:rollback -->
