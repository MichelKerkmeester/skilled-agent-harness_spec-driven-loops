---
title: "spec-memory rerank A/B benchmark -- 2026-05-20"
description: "Curated benchmark report comparing positional fallback with Qwen3-Reranker-0.6B on spec-memory's own corpus. Verdict: HOLD."
trigger_phrases:
  - "spec-memory rerank A/B benchmark"
  - "benchmark-2026-05-20-rerank-ab"
  - "Qwen3 spec-memory promotion verdict"
  - "memory_search rerank benchmark"
importance_tier: "important"
contextType: "reference"
---

# spec-memory rerank A/B benchmark -- 2026-05-20

> **Verdict:** `HOLD`. Winner for phase 005: `positional fallback`. Hit-rate delta +0.4 pp, MRR delta +0.004, p95 delta +9832.7 ms. The sidecar-enabled arm degraded to fallback scoring during measured `memory_search` calls, so Qwen does not clear the promotion rule.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. HEADLINE / OVERVIEW](#1--headline--overview)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
- [4. PER-CANDIDATE PROFILES](#4--per-candidate-profiles)
- [5. PROCESS NOTES](#5--process-notes)
- [6. FINDINGS](#6--findings)
- [7. CAVEATS](#7--caveats)
- [8. RECOMMENDATIONS](#8--recommendations)
- [9. REPRODUCIBILITY](#9--reproducibility)
- [10. RELATED RESOURCES](#10--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:headline-overview -->
## 1. HEADLINE / OVERVIEW

This report records phase 004 of the `008-rerank-sidecar-arc`: a direct `memory_search` A/B benchmark over spec-memory's own `memory_index` corpus.

Key measurement context:

| Field | Value |
|---|---|
| Date | 2026-05-20 |
| Fixture | `rerank-ab-fixture.json` |
| Probe count | 50 probes |
| Repeated runs | n=5 per arm |
| Raw rows | 500 rows; expected 500 |
| memory_index hash | `sha256:27063843a74a89517afb0b5aa1e5355ca4bf67053f7ea2d97656cb7a4964ba1b` |
| memory_index size | 8537 |
| Decision | `HOLD` |

The load-bearing result is the phase-005 decision rule, not a public model claim. The benchmark asks whether Qwen improves this local memory corpus enough to justify enabling sidecar-backed reranking by default.
<!-- /ANCHOR:headline-overview -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

| Candidate | Backend | Hit rate | Hit-rate 95% CI | MRR@10 | MRR 95% CI | p50 ms | p95 ms | p99 ms | Verdict |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| positional fallback | `SPECKIT_CROSS_ENCODER=false` | 0.340 | 0.284-0.401 | 0.330 | 0.272-0.388 | 777.1 | 1316.4 | 2949.5 | baseline |
| Qwen3-Reranker-0.6B sidecar | `SPECKIT_CROSS_ENCODER=true`, `RERANKER_LOCAL=true` | 0.344 | 0.288-0.405 | 0.334 | 0.276-0.394 | 973.0 | 11149.1 | 12626.7 | HOLD; degraded to fallback |

Delta:

- Hit-rate delta: +0.4 pp. Paired bootstrap CI: +0.0 to +1.2 pp.
- MRR@10 delta: +0.004. Paired bootstrap CI: +0.000 to +0.012.
- p95 latency delta: +9832.7 ms.

Raw aggregate data lives in [`results.csv`](./results.csv). Per-probe rows live in [`per-probe.jsonl`](./per-probe.jsonl).
<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

### Fixture

The fixture combines cat-24/409, cat-13/416-418, and 28 fresh probes authored against the current `memory_index`.

| Difficulty | Count |
|---|---:|
| easy | 11 |
| medium | 24 |
| hard | 15 |

| Category | Count |
|---|---:|
| paraphrase | 27 |
| terminology | 11 |
| arc-context | 12 |

### Search pipeline

Each row invokes the real `memory_search` MCP tool through `dist/context-server.js` over JSON-RPC. The harness waits for startup indexing to settle before measuring queries, disables response-profile/progressive formatting for parse stability, and requests `limit=10`, `includeTrace=true`, `rerank=true`, `bypassCache=true`, `trackAccess=false`.

### Sample size

The benchmark runs 50 probes × 5 repeats × 2 arms = 500 expected rows.

### Environment

- Corpus: `memory_index` hash `sha256:27063843a74a89517afb0b5aa1e5355ca4bf67053f7ea2d97656cb7a4964ba1b`, size 8537.
- Arm A: `SPECKIT_CROSS_ENCODER=false`.
- Arm B: `SPECKIT_CROSS_ENCODER=true`, `RERANKER_LOCAL=true`, local sidecar on `127.0.0.1:8765`.
- Sidecar model: `Qwen/Qwen3-Reranker-0.6B`.
<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:per-candidate-profiles -->
## 4. PER-CANDIDATE PROFILES

### 4.1 positional fallback

| Property | Value |
|---|---|
| Role | Baseline Stage 3 behavior when cross-encoder reranking is disabled |
| Provider | none |
| Scoring | Existing fused order without local Qwen inference |
| Result | hit rate 0.340, MRR@10 0.330, p95 1316.4 ms |
| Strengths observed | Lowest operational complexity and no sidecar dependency |
| Weaknesses observed | Cannot use cross-attention to reorder paraphrase-heavy candidate sets |

### 4.2 Qwen/Qwen3-Reranker-0.6B sidecar

| Property | Value |
|---|---|
| Role | Local HTTP cross-encoder reranker |
| Provider | `local` sidecar through `RERANKER_LOCAL=true` |
| Score contract | Sigmoid-normalized `[0,1]` scores from `/rerank` |
| Result | hit rate 0.344, MRR@10 0.334, p95 11149.1 ms |
| Measured scoring | 250/250 Arm B rows recorded `scoringMethod=fallback`; 232 rows reached `fallback-sort`, 18 rows did not rerank |
| Strengths observed | Sidecar process spawned and `/warmup` returned the pinned Qwen model revision |
| Weaknesses observed | The measured `memory_search` path did not receive cross-encoder scores before timeout, so the production path fell back |
<!-- /ANCHOR:per-candidate-profiles -->

---

<!-- ANCHOR:process-notes -->
## 5. PROCESS NOTES

The benchmark intentionally uses spec-memory's own prose-heavy corpus instead of importing the CocoIndex code-chunk benchmark. Phase 001 fixed local provider flag routing, phase 002 created the sidecar, phase 003 integrated sidecar ensure logic into launchers, and this phase measures whether the quality lift is large enough for default promotion.

The harness also records `rerank_provider`, `scoringMethod`, and the Stage 3 gate decision per row. That made the key operational issue visible: the sidecar-enabled arm did not produce any `cross-encoder` rows. It either fell back through `fallback-sort` after provider timeout or did not rerank because too few candidates reached the Stage 3 gate.
<!-- /ANCHOR:process-notes -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS

### Finding 1 -- Decision rule outcome

The decision rule produced `HOLD`:

| Gate | Threshold | Observed | Pass |
|---|---:|---:|---|
| hit-rate delta | >= +6.0 pp | +0.4 pp | false |
| MRR delta with non-overlapping CIs | >= +0.10 | +0.004 | false |
| p95 latency delta | <= +400 ms | +9832.7 ms | false |

### Finding 2 -- Category breakdown

| Arm | Category | Rows | Hit rate | MRR@10 |
|---|---|---:|---:|---:|
| A | arc-context | 60 | 0.000 | 0.000 |
| A | paraphrase | 135 | 0.444 | 0.444 |
| A | terminology | 55 | 0.455 | 0.409 |
| B | arc-context | 60 | 0.017 | 0.017 |
| B | paraphrase | 135 | 0.444 | 0.444 |
| B | terminology | 55 | 0.455 | 0.409 |

### Finding 3 -- Operational signal

Arm B rows preserve Stage 3 provider metadata in `per-probe.jsonl`. The observed distribution was:

| Arm | scoringMethod | Rows |
|---|---|---:|
| A | fallback | 250 |
| B | fallback | 250 |

Arm B provider metadata:

| Arm | rerank_provider | Rows |
|---|---|---:|
| B | fallback-sort | 232 |
| B | none/null | 18 |

This prevents the benchmark from silently crediting Qwen for fallback behavior. The sidecar spawned and warmed, but the `memory_search` path did not complete local reranker calls inside the cross-encoder timeout budget.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:caveats -->
## 7. CAVEATS

This is a local benchmark over the current spec-memory corpus. The fixture is intentionally small enough to replay during development and large enough to avoid the 10-probe cat-24/409 trap, but it is not a public retrieval benchmark.

The `memory_search` pipeline has conditional rerank gates. Qwen only affects rows where enough candidates reach Stage 3, the gate allows reranking, and the sidecar responds before the cross-encoder timeout. This run measured end-to-end production behavior and found the sidecar-enabled path degraded to fallback; it does not prove Qwen's isolated ranking quality on the fixture.

Post-run sanity check: a direct `/rerank` request with two toy documents timed out at 30 seconds while the sidecar was still busy, consistent with the Arm B fallback metadata. The sidecar process could not be terminated from the sandbox (`kill 12014` returned operation not permitted), so a clean same-port rerun was not possible inside this turn.

Latency reflects this machine, current sidecar cache state, and current embedding/search dependencies.
<!-- /ANCHOR:caveats -->

---

<!-- ANCHOR:recommendations -->
## 8. RECOMMENDATIONS

**Phase 005 verdict: `HOLD`.**

Promotion rule:

```text
PROMOTE if:
  (hit_rate_delta_pp >= +6 OR MRR_delta >= +0.10 with non-overlapping CIs)
  AND p95_delta_ms <= +400
Else HOLD.
```

Observed:

```text
hit_rate_delta_pp = +0.4
MRR_delta = +0.004
p95_delta_ms = +9832.7
```

Recommendation for phase 005: `HOLD`.

Do not promote Qwen-backed reranking as the spec-memory default from this run. Phase 005 should keep Qwen available as an opt-in sidecar path, document the env toggle, and treat cross-encoder timeout/device tuning as a prerequisite before any future promotion attempt.
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:reproducibility -->
## 9. REPRODUCIBILITY

Replay from repo root:

```bash
cd .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab
bash scripts/run-ab.sh
```

The orchestrator performs:

1. Startup-scan settle pass.
2. Snapshot refresh in `rerank-ab-fixture.json`.
3. Arm A with `SPECKIT_CROSS_ENCODER=false`, n=5.
4. Sidecar ensure and `/warmup`.
5. Arm B with `SPECKIT_CROSS_ENCODER=true`, `RERANKER_LOCAL=true`, n=5.
6. `aggregate.py`, then `generate_report.py`.
<!-- /ANCHOR:reproducibility -->

---

<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

- [`SOURCE.md`](./SOURCE.md) -- fixture provenance and spec-packet pointer.
- [`rerank-ab-fixture.json`](./rerank-ab-fixture.json) -- deterministic probe set.
- [`results.csv`](./results.csv) -- aggregate metrics.
- [`per-probe.jsonl`](./per-probe.jsonl) -- raw rows.
- Phase packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/`.
- Successor packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default/`.
<!-- /ANCHOR:related-resources -->
