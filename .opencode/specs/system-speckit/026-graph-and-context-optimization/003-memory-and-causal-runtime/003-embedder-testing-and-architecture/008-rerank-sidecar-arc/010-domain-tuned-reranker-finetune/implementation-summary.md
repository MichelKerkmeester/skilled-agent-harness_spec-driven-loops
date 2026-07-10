---
title: "Implementation Summary: domain-tuned reranker fine-tune [template:level_1/implementation-summary.md]"
description: "SCAFFOLD ONLY — execution deferred until packets 008+009 produce HOLD verdicts. This document is intentionally a stub; it will be filled when the packet executes."
trigger_phrases:
  - "010 fine-tune summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold-only spec authored; execution deferred"
    next_safe_action: "Block on packet 008/009 verdicts + deep-research convergence"
    blockers:
      - "Packet 008 verdict pending"
      - "Packet 009 verdict pending"
      - "Deep-research on 016 still incomplete"
    completion_state: "scaffold-only"
---
# Implementation Summary: domain-tuned reranker fine-tune

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SCAFFOLD ONLY.** Execution gated on the verdicts of packets 008 (cap top_k) and 009 (fp16 weights) AND the deep-research convergence on the 016 umbrella. If either of those produces PROMOTE, this packet may never execute. If both HOLD, this packet becomes the path of last resort.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffolded (execution deferred) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 010 — final candidate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet — this is the scaffold. When executed, this section will list the deliverables:

- `scripts/generate_triples.py` + `scripts/finetune.py` — reproducible training pipeline
- `data/train.jsonl` + `data/test.jsonl` — training/test splits (gitignored, reproducible)
- `artifacts/spec-memory-reranker-v1/` — fine-tuned model (gitignored, published separately)
- `benchmarks/benchmark-202X-XX-XX-fine-tune/` — eval evidence
- On PROMOTE: artifact published to HF or local registry; `cross-encoder.ts:54` repointed; `search-flags.ts` SPECKIT_CROSS_ENCODER default flipped
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(scaffold-only; filled during execution)

Planned sequence: Phase A (data gen) → Phase B (fine-tune) → Phase C (eval) → Phase D (decision) → Phase E (closeout).

Wall clock estimate: 1-3 working days.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Execution gated on 008 + 009 + deep-research outcomes
**Decision:** This packet does not execute until both packets 008 and 009 produce HOLD verdicts AND the deep-research dispatch on the 016 umbrella completes.
**Rationale:** Fine-tune is multi-day work. Cheaper experiments (cap top_k, fp16) might unblock the default flip first; if either PROMOTEs, the fine-tune is unnecessary cost. The deep-research may also surface a cheaper option I haven't considered.

### D-002 (scaffolded): Base model default = `cross-encoder/ms-marco-MiniLM-L-6-v2`
**Decision:** Fine-tune the smallest viable base first.
**Rationale:** ms-marco-base is 80 MB, fast on Apple Silicon, Apache-2.0. The 2026-05-21 ms-marco bench showed it doesn't help on this corpus AS-IS; a fine-tune is the targeted intervention for that specific gap. If ms-marco-fine-tune doesn't beat the OFF baseline, try BGE-base (600 MB) as a follow-on.

### D-003 (scaffolded): Synthetic query generation, not human labeling
**Decision:** LLM-generated paraphrased queries; no human labels.
**Rationale:** This is a solo-Mac single-user posture; the corpus and queries are also single-user. The fastest viable path is LLM-generated.

### D-004 (scaffolded): No public publish until quality is independently verified
**Decision:** First artifact stays local; if it clears the gates AND a second independent fixture confirms, then consider a public HF publish.
**Rationale:** Avoid putting a corpus-specific artifact on a public registry without independent quality evidence.

### D-005 (scaffolded): If this packet HOLDs, the rerank slot is permanently non-load-bearing
**Decision:** After this packet's verdict (PROMOTE or HOLD), spec-memory's rerank default is settled.
**Rationale:** Four prior benchmarks + cap top_k + fp16 + fine-tune covers the major hypotheses. Continuing further would be over-investment for a slot that may simply not add value on this corpus shape.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(filled during execution)

Planned commands:

```bash
# Phase A — training data
.venv/bin/python scripts/generate_triples.py --out data/ --n 5000

# Phase B — fine-tune
.venv/bin/python scripts/finetune.py --base cross-encoder/ms-marco-MiniLM-L-6-v2 \
  --train data/train.jsonl --test data/test.jsonl --out artifacts/spec-memory-reranker-v1/

# Phase C — eval
bash benchmark-2026-05-20-rerank-ab/scripts/run_arm.sh ... --arm B \
  --cross-encoder true --reranker-local true  # with cross-encoder.ts:54 pointing at the fine-tune

# Phase D-E
bash validate.sh .../010-domain-tuned-reranker-finetune --strict
git commit -m "feat(016/008/010): domain fine-tune — <PROMOTE|HOLD>"
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Synthetic queries** — LLM-generated queries may not match real user phrasing. If a query log becomes available later, augmenting training data with real queries would improve the fine-tune.
2. **Single corpus** — fine-tuned specifically on spec-memory's docs; cocoindex's code corpus would need its own fine-tune (out of scope).
3. **Single fixture** — eval on the same 50-probe set as packets 004/007/008/009. Independent fixture for confirmation would strengthen the verdict.
4. **No production traffic mirroring** — the bench is an offline eval; live spec-memory traffic may differ in query shape + frequency.
5. **Maintenance** — the fine-tune is corpus-pinned; major corpus drift requires re-training.
<!-- /ANCHOR:limitations -->
