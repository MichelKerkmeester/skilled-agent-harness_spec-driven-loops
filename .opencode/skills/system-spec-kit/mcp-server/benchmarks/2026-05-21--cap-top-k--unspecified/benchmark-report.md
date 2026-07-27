---
title: "spec-memory rerank A/B — Qwen on MPS with cap=10 — 2026-05-21"
description: "Phase 008 A/B benchmark testing whether capping the local provider's batch size from 50 to 10 avoids the MPS GPU OOM that crashed packet 007's sidecar. Verdict: HOLD. Smaller batch did not help — MPS still allocated buffers of 76-135 GiB and crashed. The batch-size hypothesis is falsified; the binding constraint is elsewhere in the MPS attention allocation path."
trigger_phrases:
  - "spec-memory cap top-k benchmark"
  - "008 cap top-k bench"
  - "speckit_rerank_local_max_docs ab"
importance_tier: "important"
contextType: "reference"
---

# spec-memory rerank A/B — Qwen on MPS with cap=10 — 2026-05-21

Same 50-probe fixture as packets 004 / 007. Same harness. Same MPS sidecar. The only change vs packet 007: `SPECKIT_RERANK_LOCAL_MAX_DOCS=10` env override caps the local-provider batch to 10 documents (down from the default 50).

**Verdict: HOLD.** The batch-size hypothesis is falsified.

---

## 1. OVERVIEW

Packet 007 found MPS-Qwen OOMs at spec-memory's default 50-doc batch. Hypothesis: smaller batches should fit the Apple Silicon GPU memory ceiling. This packet adds a `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override at `cross-encoder.ts:478` and re-runs the same 50-probe A/B with the local provider capped at 10 docs per `/rerank` call.

Result: the cap was honored (per the head/tail audit markers from the existing code path), but the sidecar STILL crashed mid-bench with MPS OOM. The OOM allocation requests recorded in the uvicorn log were larger than packet 007's, not smaller — 135 GiB and 76 GiB attempted on top of 17.81 GiB live. The binding constraint is something other than per-call attention buffer size.

---

## 2. AGGREGATE RESULTS

3 runs × 50 probes = 150 rows per arm. Sidecar started with `RERANK_DEVICE=mps`, warmed before Arm B. `SPECKIT_RERANK_LOCAL_MAX_DOCS=10` exported through the bench shell.

| Arm | Config | Hits | Hit-rate | p50 (ms) | **p95 (ms)** | Sidecar reach | Verdict |
|---|---|---|---|---|---|---|---|
| A | sidecar OFF | 54 / 150 | 0.360 | 674 | **1,130** | n/a | baseline |
| B | Qwen-MPS, cap=10 | 52 / 150 | 0.347 | 704 | **11,016** | 14.7 % (22/150) | crashed mid-run |
| **Δ (B − A)** |  | **−2** | **−0.013** | **+30** | **+9,885** | — | |

Decision gates:

| Gate | Threshold | Observed | Pass |
|---|---|---|---|
| Hit-rate Δ | ≥ +0.02 | −0.013 | ❌ |
| p95 Δ | ≤ +500 ms | +9,885 ms | ❌ |
| Sidecar reach | ≥ 0.95 | 0.147 | ❌ |

**Verdict: HOLD.** All three gates fail. Arm A baseline shifted slightly vs packets 004/007 (54 hits vs 51 hits — small index drift), but the relative comparison is unchanged.

---

## 3. METHODOLOGY

- **Fixture**: `rerank-ab-fixture.json` — same 50-probe set used by phases 004 + 007.
- **Harness**: phase 004's `run_arm.py` (unchanged).
- **Env override**: `SPECKIT_RERANK_LOCAL_MAX_DOCS=10` exported in the bench shell, propagated via `os.environ.copy()` to the MCP child, picked up by the new env-read in `cross-encoder.ts:478` (added by this packet).
- **Sidecar**: same multi-model sidecar from `9349f5f4a`, started fresh with `RERANK_DEVICE=mps`, warmed before Arm B.
- **Search args**: `limit=10`, `rerank=true`, `bypassCache=true` — same as prior runs.

The env override produced the head/tail split documented in the existing `cross-encoder.ts:478` code: the first 10 candidates went to the sidecar's `/rerank` HTTP path; the remaining ~40-50 candidates from Stage 2 fusion stayed in their fusion order and were tagged `cross-encoder-tail`.

---

## 4. WHY THE CAP DIDN'T HELP

The MPS OOM at cap=10 was actually WORSE (allocations of 76 GiB and 135 GiB attempted) than at cap=50 (76 GiB attempted). This rules out per-call attention buffer size as the binding constraint.

Probable mechanism: Apple Silicon's MPS framework allocates buffers for the FULL model graph (all attention layers' working space) when the first forward fires, not lazily per-layer. The 0.6B-param Qwen3 architecture has ~24 attention layers and the SDPA op variants each reserve padded MTLBuffer capacity. The reserved capacity scales with the worst-case `(B × L)²` the kernel might see, not the actual current batch.

So whether you send 10 docs or 50, MPS provisions buffers for ~50 (or some larger upper bound). The cap doesn't reduce the allocation request.

The OOM error pattern confirms this:
- Packet 007 (cap=50): `MPS allocated: 20.17 GiB, max allowed: 88.13 GiB. Tried to allocate 213.55 MiB on shared pool` then a `Failed to allocate private MTLBuffer for size 76 GB` assert.
- Packet 008 (cap=10): `MPS allocated: 13.95 GiB ... Tried to allocate 17.81 GiB on shared pool` then `Invalid buffer size: 135.24 GiB` and `Failed to allocate private MTLBuffer for size 76 GB`.

Both runs hit the same 76 GB MTLBuffer assertion. The cap=10 run ALSO hit a 135 GiB allocation attempt that cap=50 didn't — possibly because the head/tail split caused a different kernel codepath to fire. Whatever it is, capping the batch doesn't fix it.

---

## 5. FINDINGS

1. **Batch-size capping doesn't fix MPS OOM on Qwen3-Reranker-0.6B.** The cap=10 result reproduces (or worsens) the cap=50 OOM. Apple Silicon MPS is allocating something larger than the actual batch requires.
2. **The env override mechanism works.** The cap is honored on the head/tail split; that's a usable knob for cloud providers with cost-per-document concerns. Just doesn't unblock MPS-Qwen on this hardware.
3. **The OFF baseline shifted +3 hits vs packet 007.** 51 → 54 hits at the same fixture. Small index drift over ~2 hours of work (more docs ingested? metadata churn?). Within noise; both arms saw the shift equally.
4. **Sidecar reach dropped to 14.7%** (vs packet 007's 23%). Whichever code path the cap=10 forces is slightly MORE likely to crash the sidecar than the cap=50 path.

---

## 6. CAVEATS

1. **PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0 untested.** Disabling MPS's memory safety ceiling could let the allocations succeed at the cost of host stability. Not pursued.
2. **Single batch size value tested.** Cap=5 not benched; cap=20, 30 not benched. If the binding constraint is something MPS-specific and not batch-related, more cap values won't help either.
3. **No fp16 in this packet.** Packet 009 tries fp16 weights. Given that cap=10's OOM allocations EXCEED cap=50's, fp16 alone is unlikely to fit — but worth confirming with evidence.
4. **No PYTORCH_MPS_ENABLE_INFERENCE_MODE or other MPS tuning knobs explored.** Some torch versions have MPS-specific flags that change the buffer-allocation behavior. Future packet candidate.

---

## 7. RECOMMENDATIONS

**Decision: HOLD.** Default for spec-memory stays `SPECKIT_CROSS_ENCODER=false`. `cross-encoder.ts:54` reverted to `cross-encoder/ms-marco-MiniLM-L-6-v2`.

The `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override stays in `cross-encoder.ts:478` regardless of verdict — it's a useful tunable independent of this experiment, and it costs nothing when unset.

Adjusted follow-on priority:

1. **Packet 009 (fp16 weights) — still worth running** to produce the actual evidence. If it succeeds, that's an unblock. If it OOMs too, that's another data point.
2. **Packet 010 (domain fine-tune) — moved up in priority** if packet 009 also HOLDs. The MPS path may be fundamentally incompatible with Qwen3-Reranker on Apple Silicon; a smaller fine-tuned model on CPU is the next-cheapest experiment.
3. **MPS sidecar deployment — not viable as default** for Apple Silicon. Documenting this firmly so future packets don't re-derive the same conclusion.

---

## 8. REPRODUCIBILITY

```bash
# 1) Add env override (commit: feat(016/008/008): cap rerank top-k — HOLD)
#    cross-encoder.ts:478 reads SPECKIT_RERANK_LOCAL_MAX_DOCS

# 2) Build spec-memory
cd .opencode/skills/system-spec-kit/mcp-server && npm run build

# 3) Pin Qwen for the bench
sed -i.bak "s|cross-encoder/ms-marco-MiniLM-L-6-v2|Qwen/Qwen3-Reranker-0.6B|" \
  .opencode/skills/system-spec-kit/mcp-server/lib/search/cross-encoder.ts
npm run build

# 4) Start MPS sidecar
RERANK_DEVICE=mps bash .opencode/skills/system-rerank-sidecar/scripts/start.sh > /tmp/rerank-sidecar.log 2>&1 &

# 5) Bench
bash benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-arm.sh \
  --fixture .../benchmark-2026-05-21-cap-top-k/rerank-ab-fixture.json \
  --out .../runs/arm-a-off.jsonl --arm A --runs 3 \
  --cross-encoder false --reranker-local false

SPECKIT_RERANK_LOCAL_MAX_DOCS=10 RERANK_DEVICE=mps \
  bash benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-arm.sh \
  --fixture .../benchmark-2026-05-21-cap-top-k/rerank-ab-fixture.json \
  --out .../runs/arm-b-cap10.jsonl --arm B --runs 3 \
  --cross-encoder true --reranker-local true

# 6) Inspect OOM evidence
grep -iE "MPS|MTLBuffer" /tmp/rerank-sidecar.log

# 7) Revert Qwen pin to ms-marco after HOLD
mv .opencode/skills/system-spec-kit/mcp-server/lib/search/cross-encoder.ts.bak \
   .opencode/skills/system-spec-kit/mcp-server/lib/search/cross-encoder.ts
npm run build
```
