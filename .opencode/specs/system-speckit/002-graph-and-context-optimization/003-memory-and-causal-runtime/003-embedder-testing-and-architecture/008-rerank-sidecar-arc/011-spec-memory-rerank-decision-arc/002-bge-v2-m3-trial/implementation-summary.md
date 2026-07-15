---
title: "Implementation Summary: bge-reranker-v2-m3 trial [template:level_1/implementation-summary.md]"
description: "Phase C/D benchmark and verdict for bge-reranker-v2-m3."
trigger_phrases:
  - "011/002 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial"
    last_updated_at: "2026-05-21T14:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase C/D complete: bge-v2-m3 benchmark HOLD"
    next_safe_action: "Execute Phase 3 triple-gen with bge-v2-m3 baseline as the gate floor"
    blockers:
      - "bge-v2-m3 did not improve quality and exceeded latency/lifecycle gates"
    completion_state: "complete_hold"
---
# Implementation Summary: bge-reranker-v2-m3 trial

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE. Verdict: HOLD.** bge-v2-m3 matched the OFF quality baseline and failed the Phase 1 lift targets, the arc hit-rate gate, the p95 latency cap, and the post-run sidecar health gate.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete (HOLD; no source patch) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 012 of 013 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Warmup

Phase A/B had already added `BAAI/bge-reranker-v2-m3` to the sidecar allowlist and pinned the HuggingFace main revision:

```text
953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e
```

At Phase C start, the live sidecar on `localhost:8765` was healthy and already loaded:

```json
{"status":"ok","model_loaded":true,"model_name":"BAAI/bge-reranker-v2-m3","default_model":"BAAI/bge-reranker-v2-m3","allowed_models":["BAAI/bge-reranker-v2-m3"],"loaded_models":["BAAI/bge-reranker-v2-m3"],"queue_depth":0}
```

No extra warmup or model download was run in Phase C/D.

### Smoke Test

The Phase B smoke test had passed before this dispatch. For the benchmark replay, the first direct-handler probe confirmed:

```json
{"rerankApplied":true,"rerankProvider":"cross-encoder","durationMs":2891}
```

Because `cross-encoder.ts` still points at `cross-encoder/ms-marco-MiniLM-L-6-v2` until PROMOTE, the replay wrapped only localhost `/rerank` fetch bodies and set:

```json
{"model":"BAAI/bge-reranker-v2-m3"}
```

### Benchmark Results

The benchmark used the same 50-probe fixture as Phase 1:

```text
mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json
```

The normal JSON-RPC harness remains unsuitable in this sandbox because `daemon-ipc.sock` binding is blocked. The run used the same direct-handler replay approach as Phase 1 by importing `dist/handlers/memory-search.js` and calling `handleMemorySearch()`.

Evidence file:

```text
evidence/bge-v2-m3-bench-2026-05-21.json
```

Note: the replay printed all 50 probe metrics, then blocked on post-run `/health` before serializing handler payload rows. A bounded follow-up health probe returned `curl` exit `28` / HTTP `000`, so the evidence file records the observed per-probe console metrics and marks the post-run health timeout as part of the HOLD verdict.

| Metric | OFF baseline | bge-v2-m3 | Delta | Gate | Result |
|---|---:|---:|---:|---|---|
| Fixture probes | 50 | 50 | 0 | 50 | PASS |
| Hit-rate@5 | 0.12 | 0.12 | +0.00 | >= 0.18 | FAIL |
| NDCG@10 | 0.11 | 0.11 | +0.00 | diagnostic | n/a |
| Recall@5 | 0.12 | 0.12 | +0.00 | >= 0.17 | FAIL |
| Recall misses | 44 | 44 | 0 | <= 22 | FAIL |
| Ranking inversions | 0 | 0 | 0 | 0 | PASS |
| Empty results | 0 | 0 | 0 | 0 | PASS |
| p50 latency | 469.904 ms | 609.126 ms | +139.222 ms | diagnostic | n/a |
| p95 latency | 557.529 ms | 10591.245 ms | +10033.716 ms | <= 1057.529 ms | FAIL |
| Post-run sidecar health | ok | timeout | n/a | no crash/hang | FAIL |

Per-category breakdown:

| Category | Probes | Hit-rate@5 | Recall@5 | NDCG@10 | Zero-recall category |
|---|---:|---:|---:|---:|---|
| arc-context | 12 | 0.083 | 0.083 | 0.083 | no |
| paraphrase | 27 | 0.148 | 0.148 | 0.148 | no |
| terminology | 11 | 0.091 | 0.091 | 0.045 | no |

### Per-Probe Deltas vs OFF

| Probe | Category | Delta Hit@5 | Delta Recall@5 | Delta NDCG@10 |
|---|---|---:|---:|---:|
| fixture-001 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-002 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-003 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-004 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-005 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-006 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-007 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-008 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-009 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-010 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-011 | terminology | +0 | +0.000 | +0.000 |
| fixture-012 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-013 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-014 | terminology | +0 | +0.000 | +0.000 |
| fixture-015 | terminology | +0 | +0.000 | +0.000 |
| fixture-016 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-017 | terminology | +0 | +0.000 | +0.000 |
| fixture-018 | terminology | +0 | +0.000 | +0.000 |
| fixture-019 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-020 | terminology | +0 | +0.000 | +0.000 |
| fixture-021 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-022 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-023 | arc-context | +0 | +0.000 | +0.000 |
| fixture-024 | arc-context | +0 | +0.000 | +0.000 |
| fixture-025 | arc-context | +0 | +0.000 | +0.000 |
| fixture-026 | arc-context | +0 | +0.000 | +0.000 |
| fixture-027 | arc-context | +0 | +0.000 | +0.000 |
| fixture-028 | arc-context | +0 | +0.000 | +0.000 |
| fixture-029 | arc-context | +0 | +0.000 | +0.000 |
| fixture-030 | arc-context | +0 | +0.000 | +0.000 |
| fixture-031 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-032 | arc-context | +0 | +0.000 | +0.000 |
| fixture-033 | arc-context | +0 | +0.000 | +0.000 |
| fixture-034 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-035 | terminology | +0 | +0.000 | +0.000 |
| fixture-036 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-037 | terminology | +0 | +0.000 | +0.000 |
| fixture-038 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-039 | terminology | +0 | +0.000 | +0.000 |
| fixture-040 | arc-context | +0 | +0.000 | +0.000 |
| fixture-041 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-042 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-043 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-044 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-045 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-046 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-047 | paraphrase | +0 | +0.000 | +0.000 |
| fixture-048 | terminology | +0 | +0.000 | +0.000 |
| fixture-049 | terminology | +0 | +0.000 | +0.000 |
| fixture-050 | arc-context | +0 | +0.000 | +0.000 |

### Targets vs Achieved

| Target metric | Phase 1 measured | Phase 2 achieved | Outcome |
|---|---:|---:|---|
| Recall@5 (overall) | 0.12 | 0.12 | FAIL: needs >= 0.17 |
| Probe-level recall misses | 44/50 | 44/50 | FAIL: needs <= 22 |
| Ranking inversions in top-10 but outside top-5 | 0 | 0 | PASS |
| Empty results | 0 | 0 | PASS |

### Verdict

HOLD.

Phase 1 targets:

| Gate | Required | Achieved | Result |
|---|---:|---:|---|
| Recall@5 lift | >= 0.17 | 0.12 | FAIL |
| Recall misses | <= 22 | 44 | FAIL |
| Ranking inversions | 0 | 0 | PASS |

Arc invariant gates:

| Gate | Required | Achieved | Result |
|---|---:|---:|---|
| Hit-rate@5 | >= OFF + 0.06 = 0.18 | 0.12 | FAIL |
| p95 latency | <= OFF + 500 ms = 1057.529 ms | 10591.245 ms | FAIL |
| No OOM / no sidecar crash or hang | Sidecar remains healthy | Post-run `/health` timed out (`curl` exit 28) | FAIL |

Failure modes:

- Quality did not move: hit-rate@5, recall@5, NDCG@10, recall misses, and per-probe hit outcomes are identical to OFF.
- CPU p95 latency is `10033.716 ms` above OFF and `9533.716 ms` beyond the +500 ms cap.
- The sidecar stopped answering `/health` after the run, so lifecycle health is not acceptable for promotion.

No source patch was made. `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` remains on `cross-encoder/ms-marco-MiniLM-L-6-v2`.

### Live Verification

Not run. Live verification is PROMOTE-only, and this packet HOLDs.

### Commit Handoff

Modified paths:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/evidence/bge-v2-m3-bench-2026-05-21.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune/spec.md`

Source-code files modified: none.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex gpt-5.5 high fast, direct-handler replay, network=false for external downloads. The BGE weights were already cached and loaded in the sidecar before the run; only localhost sidecar calls were made.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: HOLD bge-v2-m3
**Rationale:** The model did not improve any quality metric over OFF and failed latency/lifecycle gates by a wide margin. Promotion would add operational risk without retrieval benefit.

### D-002: Leave `cross-encoder.ts` unchanged
**Rationale:** The local provider default changes only on PROMOTE. HOLD means Phase 3 gets the BGE baseline as a floor, not a shipped default.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pre-run health:

```bash
curl -sf http://localhost:8765/health
```

```json
{"status":"ok","model_loaded":true,"model_name":"BAAI/bge-reranker-v2-m3","default_model":"BAAI/bge-reranker-v2-m3","allowed_models":["BAAI/bge-reranker-v2-m3"],"loaded_models":["BAAI/bge-reranker-v2-m3"],"queue_depth":0}
```

Benchmark command shape:

```bash
SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true \
SPECKIT_SKIP_API_VALIDATION=true SPECKIT_RESPONSE_PROFILE_V1=false \
SPECKIT_INTENT_AUTO_PROFILE=false SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false \
SPECKIT_FILE_WATCHER=false MEMORY_DB_PATH="$PWD/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite" \
node --input-type=module <direct handleMemorySearch fixture replay>
```

Representative benchmark output:

```text
[bench] 1/50 fixture-001 hit5=false ndcg10=0.000 latency_ms=3473.526
[pipeline] Stage 3 failed, returning unranked results: Stage 3: Rerank timed out after 10000ms
[bench] 2/50 fixture-002 hit5=false ndcg10=0.000 latency_ms=10500.931
[bench] 50/50 fixture-050 hit5=false ndcg10=0.000 latency_ms=653.151
```

Post-run health:

```bash
curl --max-time 2 -s -w '\nHTTP_STATUS:%{http_code}\nCURL_EXIT:%{exitcode}\n' http://localhost:8765/health
```

```text
HTTP_STATUS:000
CURL_EXIT:28
```

Strict validation:

```text
Packet strict-validate: exit 0
Arc parent strict-validate: exit 0
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The sidecar was unresponsive after the benchmark, so post-run health is a failure signal rather than a clean teardown signal.
2. The evidence file preserves the Phase 1 stale `gold_memory_ids` caveat: 16 fixture ids are stale in the current `memory_index`.
3. The final evidence JSON is reconstructed from the completed replay's console metrics because the process blocked on post-run health before serializing rows. The HOLD verdict does not depend on close-call values; all failed gates are wide failures.
<!-- /ANCHOR:limitations -->
