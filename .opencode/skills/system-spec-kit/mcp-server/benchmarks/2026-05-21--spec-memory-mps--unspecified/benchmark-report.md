---
title: "spec-memory rerank A/B — Qwen on MPS vs OFF — 2026-05-21"
description: "Phase 007 A/B benchmark testing whether RERANK_DEVICE=mps unblocks spec-memory's SPECKIT_CROSS_ENCODER default flip. Smoke confirmed Qwen-MPS at ~19x per-call speedup vs CPU, but the bench exposed MPS GPU out-of-memory on Qwen attention forwards under spec-memory's actual batch shape. Sidecar crashed mid-run. Verdict: HOLD."
trigger_phrases:
  - "spec-memory mps benchmark"
  - "007 mps ab"
  - "qwen mps oom"
importance_tier: "important"
contextType: "reference"
---

# spec-memory rerank A/B — Qwen on MPS vs OFF — 2026-05-21

Same 50-probe fixture, 3 runs × 50 probes, same harness as phase 004 and the 2026-05-20 re-run. The hypothesis tested: would `RERANK_DEVICE=mps` give Qwen enough per-call speedup to clear all three promotion gates? **Result: HOLD.** The hypothesis is partly right (per-call MPS is fast) and partly fatally wrong (MPS GPU memory cannot fit Qwen's attention forwards at spec-memory's batch shape).

---

## 1. OVERVIEW

Today's question: does Qwen3-Reranker-0.6B on Apple Silicon MPS clear spec-memory's promotion gates (≥+3 hits AND p95 Δ ≤ +500 ms AND ≥95 percent sidecar reach)?

The Phase A smoke said yes: a 3-document rerank returns in 155 ms on MPS vs 2950 ms on CPU. 19x speedup. Cold warmup also faster (3.6 s vs 5-10 s).

The Phase C bench said no: under 3 runs × 50 probes through `memory_search` (which sends 20-doc batches to Stage 3 rerank), the MPS sidecar runs out of GPU memory in Qwen's attention forwards, crashes mid-run, the MCP child falls back to bundled / positional scoring, and the bench reproduces the same shape as the prior CPU runs.

---

## 2. AGGREGATE RESULTS

3 runs × 50 probes = 150 rows per arm. Sidecar started with `RERANK_DEVICE=mps`, warmed before Arm B.

| Arm | Config | Hits | Hit-rate | p50 (ms) | **p95 (ms)** | Sidecar reach | Verdict |
|---|---|---|---|---|---|---|---|
| A | sidecar OFF | 51 / 150 | 0.340 | 660 | **1,111** | n/a | baseline |
| B v1 | Qwen-MPS, no env propagation | 49 / 150 | 0.327 | 907 | 11,020 | 21 % (31/150) | crashed mid-run |
| B v2 | Qwen-MPS, env exported through bench shell | 49 / 150 | 0.327 | 907 | 11,049 | 23 % (34/150) | crashed mid-run |
| **Δ (B v2 − A)** |  | **−2** | **−0.013** | **+247** | **+9,938** | **23 %** | |

Decision rule:

| Gate | Threshold | Observed | Pass |
|---|---|---|---|
| Hit-rate Δ | ≥ +0.02 | −0.013 | ❌ |
| p95 Δ | ≤ +500 ms | +9,938 ms | ❌ |
| Sidecar reach | ≥ 0.95 | 0.23 | ❌ |

**Verdict: HOLD.** All three gates fail.

---

## 3. METHODOLOGY

- **Fixture**: `rerank-ab-fixture.json` — same 50-probe set used by phase 004 (`benchmark-2026-05-20-rerank-ab/`) and the 2026-05-20 re-run.
- **Harness**: phase 004's `run_arm.py` (unchanged) — spawns MCP server child with the arm's env, issues `memory_search` over MCP, captures `rerank_provider`, `scoringMethod`, `latency_ms`, `hit_at_10`, `reciprocal_rank` per probe.
- **Sidecar**: started fresh with `RERANK_DEVICE=mps`, `POST /warmup` before Arm B. Multi-model sidecar v0.2.0 (commit `9349f5f4a`); single model loaded (Qwen) since spec-memory's `cross-encoder.ts:54` was pinned to Qwen for this bench, then reverted back to `cross-encoder/ms-marco-MiniLM-L-6-v2` after the HOLD verdict.
- **Search args**: `limit=10`, `rerank=true`, `bypassCache=true` — same as phase 004.
- **MCP child env**: `RERANK_DEVICE=mps` exported in the bench shell so it propagated to the MCP child via `os.environ.copy()` and to the sidecar via `bin/lib/ensure-rerank-sidecar.cjs` (which forwards `processObj.env` to the spawned bash process).

---

## 4. PHASE A SMOKE — MPS WORKS ON SMALL BATCHES

Single 3-document `/rerank` call against a fresh MPS sidecar:

```text
$ RERANK_DEVICE=mps bash .opencode/skills/system-rerank-sidecar/scripts/start.sh
$ time curl -X POST /warmup
{"status":"warmed", ...}
real    0m3.604s    # cold warmup, MPS

$ time curl -X POST /rerank -d '{"query":"banana fruit","documents":["dog","banana","airplane"]}'
{"results":[...], "latency_ms": 155}
real    0m0.163s    # per-call ~19x speedup vs CPU's 2950 ms
```

Smoke confirms: Qwen3-Reranker-0.6B loads on MPS, returns sigmoid-normalized scores, no fallback warnings, no errors. MPS device confirmed via `ps -E -p <pid>` showing `RERANK_DEVICE=mps` + `PYTORCH_ENABLE_MPS_FALLBACK=1`.

This is the data point that motivated the bench. If the smoke generalized to the bench, all three gates would have flipped.

---

## 5. PHASE C BENCH — MPS OOMS ON REAL BATCHES

Bench's actual workload sends 20-doc batches to Stage 3 rerank. Qwen's attention layer allocates buffers proportional to `(batch_size × seq_len)²` for the attention scores; at 20 docs × ~512 tokens, the buffer hits the MPS shared-memory ceiling on Apple Silicon.

Recovered from the uvicorn log:

```text
RuntimeError: MPS backend out of memory (MPS allocated: 20.17 GiB,
  other allocations: 71.31 GiB, max allowed: 88.13 GiB).
  Tried to allocate 213.55 MiB on shared pool.

failed assertion `Failed to allocate private MTLBuffer for size 76457536000'
```

After this crash:
- Sidecar process dies (`pgrep -f rerank_sidecar` returns empty).
- The MCP child's `ensure-rerank-sidecar.cjs` already attached at startup, so it doesn't re-spawn during the run; subsequent `/rerank` calls return connection errors.
- spec-memory's `memory_search` falls back to positional ordering for those probes (`scoringMethod: 'fallback'`, `rerank_provider: 'fallback-sort'`).
- The 23 percent of probes that DID reach the cross-encoder before the crash took mean 4111 ms each — the bench's 20-doc batch on MPS-Qwen is itself slow (per-batch ~3-5 s) even when not OOM'ing.

So MPS gives the per-call speedup advertised in the smoke, but the smoke was at 3-doc batch; the bench's 20-doc batch BOTH runs slower AND blows MPS memory.

---

## 6. FINDINGS

1. **Qwen3-Reranker-0.6B's attention forward exceeds Apple Silicon MPS memory for batches at spec-memory's load shape.** Not a "too slow" problem — a "doesn't fit" problem.
2. **Per-call MPS speedup is real on small batches** (3 docs at 155 ms vs CPU's 2950 ms). The benefit shrinks rapidly as batch size grows because `O(B² × L²)` attention buffers blow up.
3. **The 20-doc batch is set by spec-memory's `Stage 3 top_k` (`HIGH_TOP_K=20` in `hybrid-search.ts` or equivalent).** Capping it to 5-10 would test whether smaller batches stay under the MPS memory ceiling.
4. **The CPU bench's 21 percent sidecar reach rate has a different cause than MPS's.** CPU: per-call latency exceeds the MCP rerank-gate timeout. MPS: sidecar crashes after a few calls. Same observable hit rate, different mechanism.

---

## 7. CAVEATS

1. **Single device for sidecar.** The bench ran one sidecar with `RERANK_DEVICE=mps` for both arms. Per-model device assignment (e.g. MPS for spec-memory's preferred model, CPU for cocoindex's) was not in scope.
2. **No batch-size variation.** A natural follow-on is to cap `Stage 3 top_k` to 5-10 and re-run. That would test whether the OOM is the binding constraint vs whether per-call MPS speedup gets the gates over.
3. **No smaller-model-on-MPS test.** ms-marco-MiniLM-L-6-v2 (80 MB) and BGE-reranker-v2-m3 (600 MB) have smaller attention footprints; they may fit on MPS at the bench's batch size. Untested in this packet.
4. **`PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0` was not set.** Setting it disables the safety limit and may avoid the crash at the cost of system stability. Not pursued here.

---

## 8. RECOMMENDATIONS

**Decision: HOLD.** Default for spec-memory stays `SPECKIT_CROSS_ENCODER=false`. `cross-encoder.ts:54` reverted from Qwen back to `cross-encoder/ms-marco-MiniLM-L-6-v2` (the existing, tested local-provider default).

The follow-on candidates from this evidence, in order of cheapest-to-test:

- **Cap Stage 3 top_k** at 5-10 in the bench harness, repeat MPS run. If sidecar stays alive and hit-rate ≥ baseline, may justify a partial PROMOTE with a smaller `HIGH_TOP_K` default.
- **ms-marco on MPS** — same multi-model sidecar already supports it; just point `cross-encoder.ts:54` at it (already there) and re-bench. Smaller attention should fit comfortably.
- **Quantized Qwen** — Qwen3-Reranker-0.6B-Q4_K_M or similar (fp16 → int4) cuts memory ~3-4x. Requires a tokenizer + model swap + revalidation.
- **Domain fine-tune** — still the alternative-hypothesis path if the corpus-mismatch finding from the 2026-05-21 ms-marco run holds.

None of these are in scope for this packet. Packet 007 closes HOLD; arc 008 closes again.

---

## 9. REPRODUCIBILITY

```bash
# Pre-conditions: Qwen cached at e61197ed... revision; spec-memory build current.

# Start MPS sidecar
RERANK_DEVICE=mps nohup bash .opencode/skills/system-rerank-sidecar/scripts/start.sh > /tmp/rerank-sidecar.log 2>&1 &
sleep 4
curl -sf -X POST http://127.0.0.1:8765/warmup

# Pin spec-memory to Qwen for the duration of the bench, rebuild
sed -i.bak "s|cross-encoder/ms-marco-MiniLM-L-6-v2|Qwen/Qwen3-Reranker-0.6B|" \
  .opencode/skills/system-spec-kit/mcp-server/lib/search/cross-encoder.ts
(cd .opencode/skills/system-spec-kit/mcp-server && npm run build)

# Arm A
bash benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-arm.sh \
  --fixture .../rerank-ab-fixture.json \
  --out .../arm-a-off.jsonl \
  --arm A --runs 3 --cross-encoder false --reranker-local false

# Arm B (export RERANK_DEVICE=mps so it propagates to the MCP child)
RERANK_DEVICE=mps bash benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-arm.sh \
  --fixture .../rerank-ab-fixture.json \
  --out .../arm-b-mps.jsonl \
  --arm B --runs 3 --cross-encoder true --reranker-local true

# Check sidecar log for OOM
grep -iE "MPS|memory|MTLBuffer" /tmp/rerank-sidecar.log

# Revert cross-encoder.ts back to ms-marco after the HOLD verdict
mv .opencode/skills/system-spec-kit/mcp-server/lib/search/cross-encoder.ts.bak \
   .opencode/skills/system-spec-kit/mcp-server/lib/search/cross-encoder.ts
(cd .opencode/skills/system-spec-kit/mcp-server && npm run build)
```
