---
title: "Spec: domain-tuned reranker fine-tune for spec-memory corpus [template:level_1/spec.md]"
description: "Fine-tune a small cross-encoder (ms-marco-base or BGE-base) on (query, spec-doc) triples drawn from spec-memory's actual corpus. The 2026-05-21 ms-marco bench showed that off-the-shelf models trained on web passages reorder spec-memory's structured-markdown docs WORSE than positional fallback. A domain fine-tune is the most-expensive but only-untested-path to potentially unblock spec-memory's default-on flip. SCAFFOLD ONLY — execution gated on packets 008+009 outcomes AND a successful deep-research convergence."
trigger_phrases:
  - "010 domain fine-tune"
  - "spec-memory reranker fine-tune"
  - "cross-encoder fine-tune"
  - "domain-tuned reranker"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Superseded by 011/003"
    next_safe_action: "Use 011/003 instead"
    blockers:
      - "Superseded — do not execute"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: domain-tuned reranker fine-tune for spec-memory corpus

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffolded (execution deferred) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 010 of (now 10+) — last-resort follow-on |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four spec-memory rerank benchmarks have produced HOLD verdicts with distinct failure modes:

| Bench | Config | Failure mode |
|---|---|---|
| Phase 004 (2026-05-20) | CPU Qwen | per-call latency exceeds MCP rerank-gate timeout |
| 2026-05-20 re-run | CPU Qwen (post arc 008/006) | same; reproduced |
| 2026-05-21 ms-marco | CPU ms-marco | fast enough but hit-rate regresses by 6 vs OFF baseline (rank quality) |
| 2026-05-21 MPS-Qwen (packet 007) | MPS Qwen | OOM in Qwen attention at 50-doc batches; sidecar crashes |

Packet 008 + 009 attack the latency/memory side. **None of them address the rank-quality finding from the ms-marco run** — that ms-marco's ordering of structured-markdown docs is worse than positional fallback. If packets 008/009 still produce HOLD, the constraint is intrinsic model quality on this specific corpus, not the runtime.

### Purpose

If 008 + 009 don't clear the gates, the remaining unexplored hypothesis is "the right model for this corpus doesn't exist off-the-shelf." A domain fine-tune addresses that by training a small cross-encoder on `(query, spec-doc-positive, spec-doc-negative)` triples drawn from spec-memory's actual indexed content.

### Why this is scaffolded but not executed

Cost-benefit ordering:

1. Cheapest tests first: packet 008 (cap top_k), packet 009 (fp16 weights). Both are env-knob changes; ~45-60 min each.
2. Fine-tune is multi-day work (training data generation + training + eval + artifact publishing).
3. If either 008 or 009 PROMOTEs, this packet may not be needed.
4. If 008 + 009 both HOLD, this packet becomes the path of last resort.

The scaffold preserves the design + decision record so a future operator can execute without re-discovering the framing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (when executed)

- Generate ~5-10k training triples from spec-memory's indexed corpus:
  - Positives: LLM-generated paraphrased queries against each indexed doc.
  - Hard negatives: docs sharing the same arc/track/template but different content (use the existing graph-metadata.json's `parent_id` and `related_to` edges to find structural neighbors).
  - 80/20 train/test split by doc-id (held-out test docs never appear as positive OR negative in training).
- Fine-tune a base cross-encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2` or `BAAI/bge-reranker-base`) for 1-3 epochs.
- Evaluate the fine-tuned model on the existing 50-probe fixture (held-out — these probes are NOT in training).
- Compare to OFF baseline + ms-marco-CPU baseline (the prior ms-marco bench).
- If hit-rate beats OFF baseline by ≥3 hits AND p95 stays under +500ms (already easy with ms-marco-class models), publish the fine-tuned artifact to a private HF org or local cache; add to sidecar allowlist; flip spec-memory default.

### Out of Scope

- Training data labeling by humans (LLM-generated synthetic positives + structural negatives only).
- Multi-corpus fine-tune (this packet trains only on spec-memory docs; cocoindex's code corpus is separate).
- Larger base models (>500MB). The point is fast inference + small footprint on Apple Silicon.
- Reinforcement learning / preference tuning. Standard MarginMSE or contrastive loss is enough.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete during execution)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Training data generated: ≥5k triples, 80/20 train/test split | JSONL files exist; held-out test docs not in train |
| REQ-002 | Base model chosen with rationale (ms-marco-base or BGE-base) | Decision record entry; rationale ties to corpus + inference speed |
| REQ-003 | Fine-tune completes without OOM on Apple Silicon or single A100 | training log present; model artifact written |
| REQ-004 | Eval on 50-probe fixture: hit-rate Δ vs OFF baseline measured | `benchmark-202X-XX-XX-fine-tune/benchmark_report.md` records the delta |
| REQ-005 | If hit-rate beats OFF by ≥3 AND p95 stays ≤ +500ms: publish artifact + flip default | artifact published; default flip applied |
| REQ-006 | If gates fail: record verdict; rerank slot stays default-off permanently for this corpus | report + arc parent update |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Strict-validate exit 0 | post-execution |
| REQ-008 | Reproducibility: training script + data-generation script preserved in packet | `scripts/generate_triples.py`, `scripts/finetune.py` |
| REQ-009 | License: base model Apache-2.0; fine-tune carries the same license | NOTICE + LICENSE pointers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Training data generation produces ≥5k triples with no train/test leakage.
- **SC-002**: Base model + fine-tune completes; loss curve descends; final eval-set loss < initial.
- **SC-003**: Fine-tuned model evaluated on the 50-probe fixture; hit-rate vs OFF baseline recorded.
- **SC-004**: Gate-1 (hit-rate Δ ≥ +0.02) and gate-2 (p95 Δ ≤ +500 ms) both pass.
- **SC-005**: If gates pass: artifact published, sidecar allowlist updated, default-flipped in `search-flags.ts`.
- **SC-006**: If gates fail: rerank slot is documented as non-load-bearing for this corpus permanently.
- **SC-007**: Strict-validate exit 0 on this packet + arc 008 parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Synthetic queries paraphrase docs too closely (training-data leakage) | Medium | Model learns generation artifact instead of rank quality; overfits to LLM style | Diversify the prompt template; use multiple LLMs for query generation; reserve 20% of docs for held-out test |
| 5k triples too few — model doesn't learn the corpus structure | Medium | Eval flat or regresses | Aim for 10k triples; iterate the generation if loss plateaus too high |
| Fine-tune still doesn't beat positional fallback | Medium | "RRF-already-good" hypothesis confirmed; rerank stays default-off permanently | Honest data; document permanently and remove the open question from the arc |
| Maintenance cost of a custom artifact | Medium (recurring) | New doc categories drift the eval set | Pin the model version; revalidate on every major corpus change; publish under explicit semver |
| Cost of training (cloud GPU hour) | Low | $5-20 spend; trivial | Use Apple Silicon if possible (slower but free); cloud A100 ~$3/hour as backup |

Dependencies:

- Spec-memory's indexed corpus (live `memory_index` SQLite) — source for training data.
- A capable embedding model for hard-negative mining (BGE-base, ColBERT-mini, or similar).
- An LLM API for synthetic query generation (gpt-5.5 or similar).
- The multi-model sidecar (`9349f5f4a`) — load + serve the fine-tuned artifact via the existing /rerank endpoint.
- Packets 008 + 009 verdicts — execution gated on both completing HOLD.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Should this packet's training data be checked into the repo? Decision: NO. Training data is generated reproducibly from the current corpus; checking it in bloats the repo and freezes a stale snapshot. The script lives in the packet; the data is generated at execution time.
- **Q2**: Should the fine-tuned artifact be published to HuggingFace publicly? Decision: deferred to execution; depends on whether the corpus has anything sensitive. Likely local-only first.
- **Q3**: What's the prompt template for synthetic query generation? Decision: define during execution; should mimic real `memory_search` queries (natural-language, often paraphrased, not exact-token-match). Maybe sample real query logs if available.
- **Q4**: Should we also fine-tune on cocoindex's code corpus for symmetry? Out of scope for this packet; cocoindex's CPU-Qwen is already PROMOTE and not load-bearing for this decision. Could be a sibling packet (`011-cocoindex-rerank-finetune`) but only if cocoindex regresses for some reason.
- **Q5**: Is there a simpler unblock we haven't tested? Open. The deep-research dispatch on the 016 umbrella may surface one.
<!-- /ANCHOR:questions -->
