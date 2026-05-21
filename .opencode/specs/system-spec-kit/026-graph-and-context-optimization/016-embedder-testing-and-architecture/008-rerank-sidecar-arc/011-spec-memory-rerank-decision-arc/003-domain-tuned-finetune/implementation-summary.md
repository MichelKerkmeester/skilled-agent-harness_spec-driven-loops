---
title: "Implementation Summary: domain-tuned reranker fine-tune [template:level_1/implementation-summary.md]"
description: "Filled by cli-codex execution: §Phase A-F results, §Eval Results, §Verdict, §Commit Handoff. Supersedes 010 packet's intent with template-stripping refinement."
trigger_phrases:
  - "011/003 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored; supersedes 010"
    next_safe_action: "Cli-codex Phase A dispatch (gated on Phase 2 HOLD)"
    blockers:
      - "Phase 1 OFF_DEFICIENT required"
      - "Phase 2 HOLD required"
    completion_state: "scaffold-only"
---
# Implementation Summary: domain-tuned reranker fine-tune

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SCAFFOLD.** Path of last resort. Gated on Phases 1+2.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffold (gated) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 3 of 3 |
| **Supersedes** | `008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

To be filled. Expected sections:

- §Phase A: scripts skeleton + layout decision
- §Phase B: strip_templates() + tests + sample inspection
- §Phase C: triples count, train/test split numbers, sample inspection at milestones
- §Phase D: base model, hyperparams, training logs, best checkpoint NDCG
- §Phase E: eval results table (vs OFF, vs bge-v2-m3), anti-overfit-to-template gate result, verdict
- §Phase F (PROMOTE only): publish path, revision SHA, cross-encoder.ts patch, live verification
- §Commit Handoff: exact paths modified
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Expected: multiple cli-codex gpt-5.5 high fast dispatches, one per logical phase (A-F).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Supersede 010 with template-stripping refinement
**Rationale:** The 010 packet was structurally correct (synthetic triples + graph-metadata hard negatives) but missed the template-similarity shortcut that contrastive loss would exploit. Without template-stripping, the model trains to rank by scaffolding similarity (anchors, frontmatter, section headers) rather than content. The 011/003 spec adds the strip step + anti-overfit-to-template eval gate.

### D-002 (scaffolded): Gated on Phases 1+2
**Rationale:** Fine-tuning is multi-day. Phase 1 might close the arc entirely if OFF is acceptable. Phase 2 might close it with a working off-the-shelf model. Phase 3 only fires when both cheaper options fail.

### D-003 (scaffolded): Synthetic queries only, no human labeling
**Rationale:** Spec-memory's corpus is small enough (~1240 packets per descriptions.json count) that LLM-generated paraphrased queries at 4 per doc gives ~5000 triples. Human labeling is multi-week effort with marginal quality gain over a well-prompted LLM.

### D-004 (scaffolded): Local cache publishing default; HF private repo as follow-on
**Rationale:** Local cache is one-machine-only but eliminates HF auth + private-repo complexity. If the artifact later needs to ship across machines, an HF push is a separate follow-on.

### D-005 (scaffolded): Anti-overfit-to-template gate as a hard checkpoint
**Rationale:** The 50-probe fixture alone can't distinguish "ranks by content" from "ranks by scaffolding" because the fixture probes also share scaffolding with the corpus. The structural-neighbor eval set (unrelated content, same template) is the only way to catch template-overfit. Without this gate, a model could PROMOTE on the 50-probe fixture while being useless for real queries.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

To be filled. Expected commands:

```bash
# Phase B verification
cd .opencode/skills/system-rerank-sidecar
.venv/bin/python -m pytest scripts/finetune/tests/test_strip_templates.py

# Phase C verification
.venv/bin/python scripts/finetune/verify_split.py train.jsonl test.jsonl
# Expected: no packet_id appears in both

# Phase D training (long-running)
.venv/bin/python scripts/finetune/train.py --base ms-marco-MiniLM-L-6-v2 \
  --epochs 3 --batch 16 --lr 2e-5 \
  --train train.jsonl --test test.jsonl --output ./checkpoints/

# Phase E eval
.venv/bin/python scripts/finetune/eval_on_fixture.py \
  --model ./checkpoints/best/ --fixture <50-probe-path> \
  --output evidence/finetune-bench-<date>.json
.venv/bin/python scripts/finetune/eval_on_fixture.py \
  --model ./checkpoints/best/ --eval-set structural-neighbors.jsonl \
  --output evidence/anti-overfit-<date>.json

# Phase F (PROMOTE only) — live memory_search
# (via MCP, captured as snippets in this summary)

# Strict-validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../011-spec-memory-rerank-decision-arc --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Synthetic queries diverge from real user queries.** Mitigated by varied query styles + sample inspection, but residual distribution mismatch remains.
2. **Single base model trial.** If ms-marco-MiniLM fine-tune HOLDs, the spec doesn't escalate to bge-reranker-base by default — that's a follow-on packet.
3. **Local-cache artifact is one-machine-only.** Cross-machine sharing requires a follow-on HF push step.
4. **Anti-overfit-to-template gate threshold is TBD.** The threshold for "model should not rank structural neighbors as similar" is calibrated in Phase E; the spec only mandates that the gate exists, not the specific cutoff.
5. **HOLD verdict here closes the arc with a recommendation, not a fix.** If fine-tuning also fails, the conclusion is "spec-memory's corpus is intrinsically hard to rerank with current model families" — operator decides whether to accept OFF or escalate to a future arc (larger base model, different loss, multi-corpus joint training, etc.).
<!-- /ANCHOR:limitations -->
