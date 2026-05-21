---
title: "Implementation Summary: cap spec-memory rerank top-k [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub. Will be filled with Phase C bench + verdict."
trigger_phrases:
  - "008 cap top-k summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/008-cap-rerank-top-k"
    last_updated_at: "2026-05-21T09:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Cap=10 bench HOLD; batch-size hypothesis falsified"
    next_safe_action: "Run packet 009 (fp16 weights) to test the orthogonal lever"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: cap spec-memory rerank top-k

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SHIPPED — HOLD.** The cap=10 bench reproduced (worsened) the MPS OOM from packet 007. Batch-size capping is NOT the unblock. The env override (`SPECKIT_RERANK_LOCAL_MAX_DOCS`) stays in `cross-encoder.ts:478` as a useful tunable.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Shipped — HOLD |
| **Created** | 2026-05-21 |
| **Shipped** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened) |
| **Position in arc** | Phase 008 of (now 10+) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `mcp_server/lib/search/cross-encoder.ts:478` — `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override added. When the env var is a positive integer, it caps the local-provider batch at that size via `Math.min(providerCap, parsed)`.
- `mcp_server/dist/lib/search/cross-encoder.js` — rebuilt artifact, env read present in compiled output.
- `benchmarks/benchmark-2026-05-21-cap-top-k/` — fixture + 2 arm runs (150 rows each) + `benchmark_report.md` documenting the HOLD verdict + the surprising OOM evidence (76 GiB and 135 GiB MTLBuffer allocations even with cap=10).
- Source revert at end: `cross-encoder.ts:54` restored from Qwen (which was pinned for the bench) back to `cross-encoder/ms-marco-MiniLM-L-6-v2`. The env override stays.

Original planned shape:

- `mcp_server/lib/search/cross-encoder.ts:478` — `SPECKIT_RERANK_LOCAL_MAX_DOCS` env override at the providerCap site
- `mcp_server/dist/lib/search/cross-encoder.js` — rebuilt artifact
- `benchmarks/benchmark-2026-05-21-cap-top-k/` — fixture + runs + benchmark_report.md
- On PROMOTE: `cross-encoder.ts:57` (local maxDocuments default flipped to 10) + `search-flags.ts` (SPECKIT_CROSS_ENCODER default flipped to true)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Phase A — env override**: edited `cross-encoder.ts:478` to read `SPECKIT_RERANK_LOCAL_MAX_DOCS` and apply `Math.min(providerCap, parsed)` for the local provider only.
2. **Phase B — sidecar restart**: stopped any running sidecar; started fresh with `RERANK_DEVICE=mps`; warmed Qwen. Confirmed `/health` showed Qwen loaded on MPS.
3. **Phase C — A/B**: pinned `cross-encoder.ts:54` to Qwen for the bench, rebuilt TS, ran Arm A (off) + Arm B (cap=10 + MPS) at 3 × 50 probes each. Bench ran in background; harness wrote `runs/arm-a-off.jsonl` and `runs/arm-b-cap10.jsonl`.
4. **Phase D — decision**: aggregated; all three gates failed:
   - Gate 1 (HR Δ ≥ +0.02): observed −0.013 → FAIL
   - Gate 2 (p95 Δ ≤ +500 ms): observed +9885 ms → FAIL
   - Gate 3 (sidecar reach ≥ 0.95): observed 0.147 → FAIL
5. **Phase E — closeout**: cross-encoder.ts:54 reverted to ms-marco; rebuilt TS; tasks marked; benchmark_report.md written; arc parent updated; strict-validate; commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Env override on `local` provider only
Cloud providers (Voyage / Cohere) don't hit Apple Silicon GPU memory limits; their `maxDocuments: 100` stays unchanged.

### D-002: Inline `Math.min(...)` instead of mutating the const
Cleaner — runtime override without mutating module-level config. The constant declaration in `PROVIDER_CONFIG.local` is now intentionally `const` and the override clamps it down via the new variable `providerCap`.

### D-003: Env override stays in source post-HOLD
The `SPECKIT_RERANK_LOCAL_MAX_DOCS` read is generally useful (operators with cost-per-document API quotas may want it). HOLD only reverts the model pin in `cross-encoder.ts:54`; the env-read addition stays.

### D-004: Batch-size hypothesis falsified
The MPS OOM at cap=10 was as bad as or WORSE than at cap=50 — 135 GiB allocations recorded at cap=10 vs 76 GiB at cap=50. Apple Silicon's MPS framework appears to reserve buffers for the full attention graph regardless of input batch size. The binding constraint is upstream of batch shape; smaller batches do not help.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Actual recorded outputs:

```text
Bench results (3 × 50 probes per arm):
  Arm A (sidecar OFF):       hits=54 hit_rate=0.360 p95=1130 ms scoring={'fallback': 150}
  Arm B (Qwen-MPS, cap=10):  hits=52 hit_rate=0.347 p95=11016 ms scoring={'cross-encoder': 22, 'fallback': 128}

Δ:
  hit-rate: -0.013 (-2 hits)
  p95:      +9885 ms
  reach:    0.147

Decision gates:
  Gate 1 (HR Δ ≥ +0.02):    FAIL
  Gate 2 (p95 Δ ≤ +500 ms): FAIL
  Gate 3 (reach ≥ 0.95):    FAIL

VERDICT: HOLD

Sidecar log post-bench:
  RuntimeError: Invalid buffer size: 135.24 GiB
  RuntimeError: MPS backend out of memory (MPS allocated: 13.95 GiB,
    other: 71.31 GiB, max: 88.13 GiB). Tried to allocate 17.81 GiB.
  failed assertion `Failed to allocate private MTLBuffer for size 76 GB'
  (sidecar process exits)
```

Original planned commands:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../008-cap-rerank-top-k --strict   # exit 0

grep "SPECKIT_RERANK_LOCAL_MAX_DOCS" .opencode/skills/system-spec-kit/mcp_server/dist/lib/search/cross-encoder.js
# expect: env read present in dist

SPECKIT_RERANK_LOCAL_MAX_DOCS=10 RERANK_DEVICE=mps \
  bash .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.sh \
  --fixture .../benchmark-2026-05-21-cap-top-k/rerank-ab-fixture.json \
  --out .../runs/arm-b-cap10.jsonl --arm B --runs 3 \
  --cross-encoder true --reranker-local true
# expect: 150 rows, scoring={'cross-encoder': N≥143}
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine post-execution)

1. Single batch-size value tested (10). Other values (5, 15, 20) not in scope; may be probed in a follow-on if the 10 result is borderline.
2. Single device (MPS). CPU at cap=10 not in scope (the CPU bench already cleared the per-call latency at small batches; the gate that fired was the cross-encoder.ts timeout, not memory).
3. Same fixture as packets 004/007 — small (50 probes).
<!-- /ANCHOR:limitations -->
