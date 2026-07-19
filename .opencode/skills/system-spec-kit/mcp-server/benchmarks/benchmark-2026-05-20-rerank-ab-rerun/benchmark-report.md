---
title: "spec-memory rerank A/B re-run — 2026-05-20 post-arc-008-phase-006"
description: "Independent re-run of the phase 004 spec-memory rerank A/B benchmark on the SAME 50-probe fixture, asking: would default-on (SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true) be justified now that arc 008 has shipped the shared sidecar end-to-end? Verdict: HOLD stands. Sidecar degrades to fallback under spec-memory's load pattern; no quality lift; +9.9 s p95."
trigger_phrases:
  - "spec-memory rerank ab rerun"
  - "spec-memory default-on benchmark"
  - "speckit_cross_encoder verdict"
importance_tier: "important"
contextType: "reference"
---

# spec-memory rerank A/B re-run — 2026-05-20 post-arc-008-phase-006

Quick re-run of the phase 004 benchmark on the same 50-probe fixture, asking whether spec-memory should flip its default to `SPECKIT_CROSS_ENCODER=true`. Verdict matches phase 004: **HOLD**.

---

## 1. OVERVIEW

The user asked: "Why not make default on for spec memory — show me results with it enabled vs off." This is a fresh A/B on spec-memory's own corpus + fixture, run today against the current sidecar (post arc 008 phase 006 ship — same Qwen3-Reranker-0.6B, same `cross-encoder.ts:local` provider).

Phase 004 (the original benchmark) shipped HOLD because the sidecar degraded to fallback during sustained `memory_search` load. This re-run asks: does that still hold after arc 008 closed end-to-end? **Yes, it does.** Same shape, same verdict.

---

## 2. AGGREGATE RESULTS

3 runs × 50 probes = 150 rows per arm. Sidecar warmed before Arm B (one `POST /warmup` after start.sh).

| Arm | Config | Hits | Hit-rate | MRR | p50 (ms) | p95 (ms) | p99 (ms) | Scoring breakdown |
|---|---|---|---|---|---|---|---|---|
| A | `SPECKIT_CROSS_ENCODER=false`, `RERANKER_LOCAL=false` | 51 / 150 | 0.340 | 0.330 | 672 | 1152 | 2006 | 150 fallback |
| B | `SPECKIT_CROSS_ENCODER=true`, `RERANKER_LOCAL=true` (Qwen sidecar) | 50 / 150 | 0.333 | 0.323 | 977 | 11033 | 17359 | 34 cross-encoder + 116 fallback |
| **Δ (B − A)** |  | **−1 hits** | **−0.007** | **−0.007** | **+304** | **+9881** | **+15353** |  |

**Sidecar reach:** Arm B actually reached the cross-encoder on **34 / 150 = 22.7%** of probes. The other 77.3% degraded to positional fallback before the sidecar could respond.

---

## 3. METHODOLOGY

- **Fixture**: `rerank-ab-fixture.json` (50 probes, copy of phase 004's fixture — same provenance: cat-24/409, cat-13/416-418, plus 28 fresh probes authored against the current `memory_index`).
- **Harness**: phase 004's `run_arm.py` (unchanged) — spawns an MCP server child with the arm's env, issues `memory_search` over MCP, captures latency + result IDs + Stage-3 pipeline metadata.
- **Sidecar prep**: fresh `bash scripts/start.sh` + `POST /warmup` before Arm B; killed between arms is unnecessary (Arm A doesn't touch it).
- **Search args**: `limit=10`, `rerank=true`, `bypassCache=true`, `enableDedup=false`, `trackAccess=false` — same as phase 004.
- **Query timeout**: 180 s default (none observed timing out at this level).

The harness reads pipeline metadata to distinguish `cross-encoder` vs `fallback-sort` outcomes per probe.

---

## 4. INTERPRETATION

### Why no quality lift

Even when the sidecar DID get reached (34 / 150 calls), the cross-encoder didn't move the needle versus pure positional fallback. The candidates returned by Stage 1 + 2 are already close enough in this corpus that a cross-encoder rerank doesn't change the top-K membership.

This is the same observation phase 004 made on the original 5-run sweep: small local corpus + already-good Stage 1/2 ranking ⇒ cross-encoder rerank is marginal at best.

### Why so much latency

- 77% of Arm B probes degraded to fallback. That means the sidecar timed out or wasn't ready when memory_search expected the response.
- Of the calls that did reach the sidecar, mean response time was very high — Qwen-on-CPU is the bottleneck. Apple Silicon CPU does cross-encoder forward passes serialized through `asyncio.Lock`, and a single rerank call against the spec-memory candidate batch takes seconds.
- p95 of 11 s is dominated by the slow-tail probes where the sidecar responded but slowly.

### Why "wait for MPS tuning" is the right call

Cocoindex's PROMOTE worked because cocoindex calls the sidecar once per `ccc search` (no streaming, single batch). Spec-memory's `memory_search` has different cadence + different candidate counts, and the CPU forward pass is the bottleneck. Until the sidecar runs on Apple Silicon MPS or a quantized CPU build, spec-memory's load pattern can't be served fast enough to justify default-on. This is captured as the deferred `007-cpu-mps-tuning` packet.

---

## 5. RECOMMENDATIONS

**Decision: HOLD stands.** Default for spec-memory remains `SPECKIT_CROSS_ENCODER=false`.

Gate evaluation:

- ✗ Quality (≥+3 hits / +0.10 MRR): **fail** — −1 hits, −0.007 MRR.
- ✗ Latency (p95 Δ ≤ +500 ms): **fail** — +9881 ms.
- ✓ Test regressions: none.

For operators who want the rerank quality (e.g. for development inspection of result quality), the opt-in path works fine:

```bash
SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true ...
```

A future packet should:

1. Run the sidecar on Apple Silicon MPS (`RERANK_DEVICE=mps`) to drop per-probe latency by ~3–5×.
2. Consider a smaller cross-encoder for spec-memory's corpus shape (the existing arc-008-phase-005 SKILL.md notes ms-marco-MiniLM is appropriate when latency dominates).
3. Re-run this benchmark and re-evaluate the gate.

---

## 6. REPRODUCIBILITY

```bash
# 1) Start + warm sidecar
nohup bash .opencode/skills/system-rerank-sidecar/scripts/start.sh > /tmp/rerank-sidecar.log 2>&1 &
sleep 4
curl -sf -X POST http://127.0.0.1:8765/warmup

# 2) Build spec-memory TS
cd .opencode/skills/system-spec-kit/mcp-server && npm run build && cd -

# 3) Arm A (sidecar OFF)
bash .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-arm.sh \
  --fixture .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab-rerun/rerank-ab-fixture.json \
  --out .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab-rerun/runs/arm-a-off.jsonl \
  --arm A --runs 3 --cross-encoder false --reranker-local false

# 4) Arm B (sidecar ON)
bash .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-arm.sh \
  --fixture .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab-rerun/rerank-ab-fixture.json \
  --out .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab-rerun/runs/arm-b-sidecar.jsonl \
  --arm B --runs 3 --cross-encoder true --reranker-local true

# 5) Aggregate (one-shot Python — see commit message for inline script)
```

Outputs preserved at:

- `runs/arm-a-off.jsonl` — Arm A per-probe rows
- `runs/arm-b-sidecar.jsonl` — Arm B per-probe rows
- This report
