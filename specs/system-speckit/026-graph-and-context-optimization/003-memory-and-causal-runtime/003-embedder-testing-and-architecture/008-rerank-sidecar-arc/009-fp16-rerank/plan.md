---
title: "Plan: fp16 cross-encoder weights on MPS [template:level_1/plan.md]"
description: "Sidecar dtype env handler + bench."
trigger_phrases:
  - "009 fp16 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/009-fp16-rerank"
    last_updated_at: "2026-05-21T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Phase A: add dtype env handler"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: fp16 cross-encoder weights on MPS

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Wall clock |
|-------|------|-----------|
| A | Add dtype env handler in sidecar + start.sh allowlist | ~5 min |
| B | Restart sidecar with `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16` + warmup | ~5 min |
| C | 50-doc batch `/rerank` smoke (does it OOM?) | ~1 min |
| D | A/B bench (3 × 50 probes) | ~25 min |
| E | Decision + report + closeout | ~10 min |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Same as packets 007/008. PROMOTE iff hit-rate Δ ≥ +0.02 AND p95 Δ ≤ +500 ms AND sidecar reach ≥ 0.95 AND tests still green.

Additional gate: smoke OOM check before launching the full bench. If 50-doc smoke OOMs even with fp16, fail fast — record the OOM and HOLD without burning the bench's 25 min.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Edit `scripts/rerank_sidecar.py:_load_model`:

```python
DTYPE = os.environ.get("RERANK_TORCH_DTYPE", "").strip().lower()

def _load_model(model_name: str) -> CrossEncoder:
    kwargs: dict[str, Any] = {
        "trust_remote_code": True,
        "local_files_only": True,
    }
    revision = MODEL_REVISIONS.get(model_name)
    if revision: kwargs["revision"] = revision
    if DEVICE: kwargs["device"] = DEVICE
    if DTYPE in {"float16", "fp16", "half"}:
        import torch
        kwargs["model_kwargs"] = {"torch_dtype": torch.float16}
    elif DTYPE in {"bfloat16", "bf16"}:
        import torch
        kwargs["model_kwargs"] = {"torch_dtype": torch.bfloat16}
    return CrossEncoder(model_name, **kwargs)
```

Edit `scripts/start.sh` env allowlist to forward `RERANK_TORCH_DTYPE`.

No spec-memory TS change needed — the dtype is a sidecar-side concern; consumers don't care about precision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Env handler

1. Edit `scripts/rerank_sidecar.py:_load_model` per architecture sketch.
2. Add `RERANK_TORCH_DTYPE` to start.sh env allowlist (`${RERANK_TORCH_DTYPE:+RERANK_TORCH_DTYPE="$RERANK_TORCH_DTYPE"}`).
3. Smoke: `python -c "from scripts.rerank_sidecar import _load_model; print(_load_model('Qwen/Qwen3-Reranker-0.6B').model.dtype)"` should print `torch.float16` when env set.

### Phase B — Sidecar restart

1. Stop any running sidecar.
2. `RERANK_DEVICE=mps RERANK_TORCH_DTYPE=float16 bash scripts/start.sh`.
3. Warmup Qwen.
4. `/health` shows Qwen loaded.

### Phase C — Pre-bench OOM smoke

1. Construct a fake 50-doc payload (50 strings × ~200 chars each).
2. `POST /rerank` with the payload.
3. If 200 + sigmoid scores → proceed to Phase D.
4. If MPS OOM → record + HOLD without running the full bench.

### Phase D — A/B bench

1. Pin `cross-encoder.ts:54` to Qwen for the bench. Rebuild.
2. Arm A: sidecar OFF, 3 × 50 probes.
3. Arm B: sidecar ON via MPS+fp16, 3 × 50 probes.
4. Aggregate.

### Phase E — Decision + closeout

Per gates. On PROMOTE: flip `SPECKIT_CROSS_ENCODER` default to true (sidecar dtype default stays operator-controlled); revert `cross-encoder.ts:54` to ms-marco. On HOLD: revert source changes (env handler stays as a tunable), document failing gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Phase A: Python smoke for dtype.
- Phase B: `/health` returns Qwen loaded.
- Phase C: 50-doc smoke (the load shape that OOM'd in packet 007).
- Phase D: bench harness writes 150 rows per arm.
- Phase E: programmatic gate evaluation.

Rollback:
1. Stop sidecar; restart without RERANK_TORCH_DTYPE.
2. Revert source if PROMOTE was applied.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Multi-model sidecar (`9349f5f4a`).
- Phase 004 harness (reused).
- Qwen3-Reranker-0.6B local snapshot at pinned revision.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Stop sidecar.
2. `unset RERANK_TORCH_DTYPE`; restart on fp32.
3. If Phase E ships PROMOTE and regression surfaces, revert `search-flags.ts` default + rebuild.

Source changes localized to one Python file + start.sh + one TS const. All reversible via git checkout + rebuild.
<!-- /ANCHOR:rollback -->
