---
title: "Implementation Summary: spec-memory rerank A/B benchmark [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub for the spec-memory rerank A/B benchmark + report."
trigger_phrases:
  - "004 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Benchmark complete; HOLD verdict documented"
    next_safe_action: "Phase 005 consumes benchmark_report.md Section 8"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: spec-memory rerank A/B benchmark

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE. Verdict: HOLD.**

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 004 of 5 — the evidence base for phase 005 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/` folder with sk-doc-compliant report.
- 50-probe fixture (`rerank-ab-fixture.json`) combining cat-24/409 + 416/417/418 + 28 fresh probes.
- A/B harness scripts: `run_arm.py`, `run_arm.sh`, `aggregate.py`, `generate_report.py`, `run-ab.sh`.
- Per-probe JSONL evidence: 500 rows total (50 probes × 2 arms × 5 runs).
- `benchmark_report.md` with explicit phase-005 `HOLD` verdict in Section 8.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Phase A: authored fixture and verified all 50 `gold_memory_ids` resolve in `memory_index`.
- Phase B: implemented a JSON-RPC harness that invokes the real `memory_search` MCP tool through `dist/context-server.js`.
- Phase C: ran n=5 per arm, aggregated metrics, generated the report, and documented the decision.

The benchmark is the gate between "ship the sidecar as opt-in" and "promote Qwen as default". The measured result is `HOLD`: the sidecar-enabled arm did not produce usable cross-encoder rows and degraded to fallback scoring.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Author a fresh 50-probe fixture instead of reusing cat-24/409
**Decision:** Combine cat-24/409 + 416/417/418 playbook + fresh paraphrase probes for ~50-60 total.
**Rationale:** cat-24/409 alone (10 probes) is too small for paired statistical analysis. Reusing only existing fixtures biases toward queries that were already known-working. The fresh probes (designed against current arc-context like packets 010-012, embedder cascade, lease patterns) stress the reranker on contemporary content.

### D-002: Decision rule encoded in `generate_report.py`, not interpreted manually
**Decision:** The threshold-based PROMOTE/HOLD decision is computed automatically and printed in §8 RECOMMENDATIONS.
**Rationale:** Reduces analytic bias. The threshold rationale lives in the report; future readers see "PROMOTE because hit_rate_delta_pp = +8.2" or "HOLD because mrr_delta = +0.04 with overlapping CIs". Phase 005 reads the decision; phase 005's authors don't re-litigate it.

### D-003: Paired analysis (same fixtures across both arms) over independent-samples
**Decision:** Same probes run through both arms; paired t-test / paired bootstrap on per-probe metrics.
**Rationale:** Higher statistical power than independent samples for the same total fixture count. Detects per-probe improvements even when arm-level means are close.

### D-004: Snapshot memory_index at run start, reuse across both arms
**Decision:** Capture `memory_index` size + content hash; both arms run against the same snapshot.
**Rationale:** Eliminates index-drift as a confound. If the index changes mid-benchmark (which it would, given continuous saves in active sessions), the arms aren't comparing the same retrieval surface. Snapshot pinning makes the benchmark reproducible.

### D-005: HOLD because the sidecar-enabled arm fell back
**Decision:** Document `HOLD` instead of promoting Qwen.
**Rationale:** Arm B warmed the sidecar, but the measured `memory_search` rows recorded 250/250 `scoringMethod=fallback`. The observed hit-rate delta was +0.4 pp, MRR delta +0.004, and p95 latency delta +9832.7 ms. That fails all promotion gates and indicates timeout/device tuning is needed before any future promotion attempt.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Benchmark evidence:

| Check | Result |
|---|---|
| Fixture size | 50 probes |
| Gold ID verification | 50/50 `gold_memory_ids` resolve |
| Arm A rows | 250 |
| Arm B rows | 250 |
| Combined rows | 500 |
| Hit-rate delta | +0.4 pp |
| MRR@10 delta | +0.004 |
| p95 latency delta | +9832.7 ms |
| Arm B scoring | 250/250 fallback rows |
| Verdict | HOLD |

Verification commands:

```bash
# Strict validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark \
  --strict
# Result: Exit 0

# Benchmark report sk-doc validation
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  --type readme \
  .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md
# Result: Exit 0

# Per-probe row count check
wc -l .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe.jsonl
# Result: 500

# results.csv schema check
head -1 .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/results.csv
# Result: required columns present
```

The benchmark_report.md §9 REPRODUCIBILITY documents the full replay procedure (fixture hash + sidecar setup + arm toggles).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Arm B did not isolate Qwen quality.** The sidecar-enabled path degraded to fallback; the result is a production-path HOLD, not an isolated cross-encoder quality score.
2. **Single-machine measurement.** p95 latency reflects this specific hardware and sidecar state; cross-machine extrapolation is not reliable.
3. **50 probes is a small fixture.** Larger probe counts would reduce CI widths; trade-off is authoring effort and run time.
4. **No multi-language probes.** Fixture is English-only. Non-English queries are out of scope.
5. **`rerank-ab-fixture.json` is a frozen snapshot at run time.** If memory_index drifts substantially, the gold doc IDs may go stale. The benchmark is a point-in-time measurement, not an ongoing regression suite.
6. **Sidecar process cleanup was blocked.** A post-run `/rerank` sanity check timed out while the sidecar was busy, and `kill 12014` returned operation not permitted inside the sandbox.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files modified:

- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/SOURCE.md`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/benchmark_report.md`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/results.csv`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe-arm-a.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/per-probe-arm-b.jsonl`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run-ab.sh`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.sh`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.py`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/aggregate.py`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/spec.md`

Decisions:

- Fixture composition: 10 cat-24/409 probes, 12 cat-13/416-418 probes, 28 fresh current-corpus probes.
- Decision rule result: HOLD.
- Rationale: +0.4 pp hit-rate, +0.004 MRR, +9832.7 ms p95, and 250/250 Arm B rows fell back.

Verification evidence:

- n=5 per arm completed: 250 rows per arm, 500 combined rows.
- `results.csv`: A hit_rate 0.340, B hit_rate 0.344, delta +0.4 pp; A MRR 0.330, B MRR 0.334, delta +0.004; p95 delta +9832.7 ms.
- sk-doc validate: exit 0.
- strict validate: exit 0.

Suggested commit subject:

```text
feat(016/008/004): spec-memory rerank A/B benchmark -- HOLD
```

Next steps:

- Phase 005 reads `benchmark_report.md` §8 and follows the HOLD path.
- Keep Qwen sidecar opt-in.
- Treat sidecar timeout/device tuning as prerequisite work before any future promotion attempt.

Spec folder:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark/
```
