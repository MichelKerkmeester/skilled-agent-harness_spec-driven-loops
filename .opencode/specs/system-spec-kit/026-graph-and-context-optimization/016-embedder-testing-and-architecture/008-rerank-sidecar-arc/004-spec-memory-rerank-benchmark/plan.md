---
title: "Implementation Plan: spec-memory rerank A/B benchmark [template:level_1/plan.md]"
description: "Three-phase plan: fixture authoring, harness implementation, run + report + decision."
trigger_phrases:
  - "004 plan rerank benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Benchmark complete; HOLD verdict documented"
    next_safe_action: "Phase 005 consumes benchmark_report.md Section 8"
    blockers: []
---
# Implementation Plan: spec-memory rerank A/B benchmark

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Author 50-probe fixture (extend cat-24/409 + import 416/417/418 + add 28 fresh paraphrase/current-corpus queries with verified gold docs) | Complete |
| **B** | Author harness script `scripts/run-ab.sh` that toggles `SPECKIT_CROSS_ENCODER` between runs and captures per-probe JSONL | Complete |
| **C** | Run benchmark n=5 per arm; analyze; author sk-doc-compliant `benchmark_report.md`; document decision | Complete — HOLD |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Strict validate 0/0 on this packet.
2. `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme <benchmark_report.md>` exits 0.
3. per-probe.jsonl has ≥3 rows per (fixture, arm) tuple — i.e., ≥300 rows for 50 fixtures × 2 arms × 3 runs.
4. results.csv columns include: arm, fixture_count, hit_rate, hit_rate_ci_lower, hit_rate_ci_upper, mrr_at_10, mrr_at_10_ci, p50_ms, p95_ms, p99_ms.
5. benchmark_report.md §8 RECOMMENDATIONS explicitly states the go/no-go for phase 005 promotion.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Fixture shape (`rerank-ab-fixture.json`)

```json
{
  "version": "1.0",
  "memory_index_hash": "sha256:...",
  "memory_index_size": 1234,
  "probes": [
    {
      "id": "fixture-001",
      "query": "how did we fix the sun_path overflow?",
      "gold_doc_ids": ["011-spec-md", "implementation-summary-011"],
      "difficulty": "medium",
      "category": "paraphrase"
    },
    ...
  ]
}
```

### Harness flow (`scripts/run-ab.sh`)

```bash
#!/bin/bash
# Arm A: positional fallback (no sidecar)
SPECKIT_CROSS_ENCODER=false N_RUNS=5 \
  bash run_arm.sh --fixture rerank-ab-fixture.json --out per-probe-arm-a.jsonl

# Arm B: Qwen via sidecar (ensure sidecar warm)
ensure_rerank_sidecar.sh
SPECKIT_CROSS_ENCODER=true N_RUNS=5 \
  bash run_arm.sh --fixture rerank-ab-fixture.json --out per-probe-arm-b.jsonl

# Aggregate
python3 scripts/aggregate.py per-probe-arm-{a,b}.jsonl > results.csv

# Generate report
python3 scripts/generate_report.py results.csv per-probe.jsonl > benchmark_report.md
```

### Per-probe record (one line of `per-probe.jsonl`)

```json
{
  "arm": "B",
  "run": 3,
  "fixture_id": "fixture-001",
  "query": "how did we fix the sun_path overflow?",
  "gold_doc_ids": ["011-spec-md"],
  "returned_doc_ids": ["011-spec-md", "012-spec-md", ...],
  "hit_at_10": true,
  "reciprocal_rank": 1.0,
  "rerank_used": true,
  "rerank_model": "Qwen/Qwen3-Reranker-0.6B",
  "latency_ms": 234,
  "ts": "2026-05-21T10:23:45Z"
}
```

### Decision rule (encoded in `generate_report.py`)

Compute:
- `hit_rate_delta_pp = (B.hit_rate - A.hit_rate) * 100`
- `mrr_delta = B.mrr_at_10 - A.mrr_at_10`
- `p95_delta_ms = B.p95_ms - A.p95_ms`
- 95% CIs via paired bootstrap (n=10000 resamples)

Auto-recommend "PROMOTE" if:
- `hit_rate_delta_pp ≥ +6` (i.e. +3/50), OR
- `mrr_delta ≥ +0.10` with non-overlapping CIs, AND
- `p95_delta_ms ≤ +400`

Else: "HOLD — ship sidecar as opt-in".
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Fixture
- Audit current cat-24/409 fixture (10 probes); verify gold doc IDs are still current
- Import 416/417/418 playbook queries (~20 probes)
- Author 20-30 fresh paraphrase queries covering: arc-related concepts (packets 010-012), embedder cascade, lease patterns, MCP-handshake-failure recovery
- For each fresh probe, verify gold doc ID(s) via manual memory_search
- Document the fixture taxonomy in SOURCE.md

### Phase B — Harness
- Author `scripts/run_arm.sh`: invokes memory_search via the MCP for each fixture, records per-probe JSONL
- Author `scripts/aggregate.py`: produces results.csv with arm-level stats
- Author `scripts/generate_report.py`: applies decision rule, emits sk-doc-compliant Markdown

### Phase C — Run + report
- Start phase 002 sidecar; warm with /warmup
- Run arm A (5 iterations)
- Run arm B (5 iterations)
- Aggregate; generate report
- Author/refine `benchmark_report.md` with findings + the decision
- Strict validate this packet
- Update arc parent: if PROMOTE, mark phase 005 as unblocked; if HOLD, mark phase 005 as "ship-sidecar-but-defaults-stay"
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Fixture validity | Each probe has ≥1 gold_doc_id present in current memory_index | All 50-60 probes pass |
| Determinism | Run arm A twice on the same memory_index hash | Per-probe results match within ±1 rank position |
| Sigmoid sanity | Arm-B scores from Qwen | All scores in `[0,1]` with reasonable spread |
| Latency separation | Arm B p95 > arm A p95 (reranker adds cost) | Sanity check; if not, something's wrong |
| sk-doc validate | `validate_document.py --type readme benchmark_report.md` | Exit 0 |
| Strict validate | `validate.sh --strict <packet>` | Exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: phases 001+002+003 must all land. The benchmark needs the routing fix + the sidecar + the auto-ensure helper to run arm B at all.
- **Sideways**: sk-doc benchmark template (post-packet 006, owned by sk-doc).
- **Downstream**: phase 005 reads this benchmark's `benchmark_report.md` §8 RECOMMENDATIONS to decide whether to flip the default model.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| Benchmark folder | `rm -rf .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/` |
| Fixture | Same — lives inside the benchmark folder |
| Scripts | Same |

Rollback is trivial: the benchmark is read-only and doesn't change any runtime code. Removing it just removes the evidence base; phase 005's promotion decision then has to rely on cocoindex's external benchmark (the cargo-cult risk this packet exists to mitigate).
<!-- /ANCHOR:rollback -->
