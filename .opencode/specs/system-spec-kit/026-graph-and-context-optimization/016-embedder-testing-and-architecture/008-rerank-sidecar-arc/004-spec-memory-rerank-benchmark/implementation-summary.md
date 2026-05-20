---
title: "Implementation Summary: spec-memory rerank A/B benchmark [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub for the spec-memory rerank A/B benchmark + report."
trigger_phrases:
  - "004 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Stub authored ahead of implementation"
    next_safe_action: "Begin Phase A fixture audit"
    blockers: []
    completion_state: "pre-implementation"
---
# Implementation Summary: spec-memory rerank A/B benchmark

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION.**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (pre-implementation) |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 004 of 5 — the evidence base for phase 005 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

(to fill after implementation)

Planned shape:

- `mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/` folder with sk-doc-compliant report
- 50-60 probe fixture (`rerank-ab-fixture.json`) combining cat-24/409 + 416/417/418 + 20-30 fresh paraphrase probes
- A/B harness scripts (`run_arm.sh`, `aggregate.py`, `generate_report.py`, `run-ab.sh`)
- Per-probe JSONL trail (≥300 rows for 50 probes × 2 arms × 3 runs)
- `benchmark_report.md` with explicit go/no-go for phase 005 promotion
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(to fill after implementation)

Planned shape:

- Phase A: fixture authoring (manual verification of gold doc IDs against current memory_index)
- Phase B: harness scripts in Python + bash
- Phase C: run benchmark n=5 per arm, aggregate, author report, document decision

The benchmark is the gate between "ship the sidecar as opt-in" (phase 005-HOLD path) and "promote Qwen as default" (phase 005-PROMOTE path). The evidence here directly drives the next phase's scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (planned): Author a fresh 50-60 probe fixture instead of reusing cat-24/409
**Decision:** Combine cat-24/409 + 416/417/418 playbook + fresh paraphrase probes for ~50-60 total.
**Rationale:** cat-24/409 alone (10 probes) is too small for paired statistical analysis. Reusing only existing fixtures biases toward queries that were already known-working. The fresh probes (designed against current arc-context like packets 010-012, embedder cascade, lease patterns) stress the reranker on contemporary content.

### D-002 (planned): Decision rule encoded in `generate_report.py`, not interpreted manually
**Decision:** The threshold-based PROMOTE/HOLD decision is computed automatically and printed in §8 RECOMMENDATIONS.
**Rationale:** Reduces analytic bias. The threshold rationale lives in the report; future readers see "PROMOTE because hit_rate_delta_pp = +8.2" or "HOLD because mrr_delta = +0.04 with overlapping CIs". Phase 005 reads the decision; phase 005's authors don't re-litigate it.

### D-003 (planned): Paired analysis (same fixtures across both arms) over independent-samples
**Decision:** Same probes run through both arms; paired t-test / paired bootstrap on per-probe metrics.
**Rationale:** Higher statistical power than independent samples for the same total fixture count. Detects per-probe improvements even when arm-level means are close.

### D-004 (planned): Snapshot memory_index at run start, reuse across both arms
**Decision:** Capture `memory_index` size + content hash; both arms run against the same snapshot.
**Rationale:** Eliminates index-drift as a confound. If the index changes mid-benchmark (which it would, given continuous saves in active sessions), the arms aren't comparing the same retrieval surface. Snapshot pinning makes the benchmark reproducible.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(to fill with actual results after the benchmark runs)

Planned verification commands:

```bash
# Strict validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark \
  --strict
# Expect: Exit 0

# Benchmark report sk-doc validation
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  --type readme \
  .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/benchmark_report.md
# Expect: PASS

# Per-probe row count check
wc -l .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/per-probe.jsonl
# Expect: ≥ 300 (50 fixtures × 2 arms × 3 runs)

# results.csv schema check
head -1 .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/results.csv
# Expect: arm, fixture_count, hit_rate, hit_rate_ci_lower, hit_rate_ci_upper, mrr_at_10, mrr_at_10_ci, p50_ms, p95_ms, p99_ms
```

The benchmark_report.md §9 REPRODUCIBILITY documents the full replay procedure (fixture hash + sidecar setup + arm toggles).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine after implementation)

Planned limitations:

1. **Single-machine measurement.** p95 latency reflects this specific hardware; cross-machine extrapolation is not reliable.
2. **50-60 probes is a small fixture.** Larger probe counts would reduce CI widths; trade-off is authoring effort + run time.
3. **No multi-language probes.** Fixture is English-only. Non-English queries are out of scope.
4. **`rerank-ab-fixture.json` is a frozen snapshot at run time.** If memory_index drifts substantially (e.g. after multiple weeks of saves), the gold doc IDs may go stale. The benchmark is a point-in-time measurement, not an ongoing regression suite.
5. **Decision thresholds are heuristic.** The +6pp hit-rate / +0.10 MRR / +400ms p95 thresholds reflect a judgment call about what's "worth promoting". A future operator may want stricter or looser thresholds; the rationale is documented for future re-tuning.
<!-- /ANCHOR:limitations -->
