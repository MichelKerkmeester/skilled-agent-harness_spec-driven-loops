# Iteration 003 — Qwen3 Default Flip Soundness

## Hypotheses going in

The Qwen3-Reranker-0.6B default flip should have been implemented correctly with supporting evidence. Expected:
- DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B" in registered_embedders.py
- _DEFAULT_RERANK_MODEL in config.py resolves to Qwen
- ccc doctor --json reports pipeline.stage_2.name == "Qwen/Qwen3-Reranker-0.6B"
- ADR-027 exists and cites evidence
- Benchmark report documents the head-to-head
- 6 lane JSON files show n=3 each side with zero stddev

## Files / commands run

### DEFAULT_RERANKER_NAME verification
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py:256`

**Content:**
```python
DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"  # 023B follow-on: promoted over jina-v3 after 73-probe expanded-fixture bench (n=3, +1 hit/73, -32% p95, Apache-2.0)
```

**Result:** ✅ CORRECT

### _DEFAULT_RERANK_MODEL verification
**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:30`

**Content:**
```python
_DEFAULT_RERANK_MODEL = DEFAULT_RERANKER_NAME  # 023B empirical: Qwen3-0.6B beat jina-v3 on 73-probe expanded fixture (30/73 vs 29/73, -32% p95, Apache-2.0); jina-v3 retained as opt-in fallback
```

**Result:** ✅ CORRECT

### ccc doctor --json verification
**Command:**
```bash
cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/ccc doctor --json
```

**Result:** ✅ CORRECT
- pipeline.stage_2.name = "Qwen/Qwen3-Reranker-0.6B"
- CHECK-4 confirms active reranker is "Qwen/Qwen3-Reranker-0.6B" with license "apache-2.0"

### ADR-027 verification
**File:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md:1174-1190`

**Content:**
```markdown
## ADR-027: Reranker default flipped to Qwen3-Reranker-0.6B (2026-05-20)

**Context**: 023-deep-research-arc-blind-spots/007-fixture-calibration shipped a 73-probe expanded fixture and a calibration sweep harness. A reranker sub-sweep ran jinaai/jina-reranker-v3 (CC BY-NC 4.0, pre-2026-05-20 default) head-to-head against Qwen/Qwen3-Reranker-0.6B (Apache-2.0) at n=3 runs with zero stddev on both sides.

**Decision**: Default reranker flipped jinaai/jina-reranker-v3 -> Qwen/Qwen3-Reranker-0.6B as of 2026-05-20.

**Evidence**:

| Metric | jina-v3 | Qwen3-0.6B | Delta |
|---|---|---|---|
| Mean hits | 29.0/73 | 30.0/73 | +1 hit (+1.4pp) |
| Hit rate | 0.397 | 0.411 | +0.014 |
| p95 latency | 2905 ms | 1984 ms | -921 ms (-32%) |
| License | CC BY-NC 4.0 | Apache-2.0 | commercial-safe |
| RSS warm (full daemon) | 1145 MB | 1179 MB | +34 MB (+3%) |
| Stddev (hits, n=3) | 0 | 0 | zero |
```

**Result:** ✅ ADR-027 exists and cites evidence

### Benchmark report verification
**File:** `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/benchmark_report.md:62-72`

**Content:**
```markdown
| Reranker | Default status | License | Mean hits | Hit rate | p95 mean | Verdict |
|---|---|---|---:|---:|---:|:|
| `jinaai/jina-reranker-v3` | Old default | CC BY-NC 4.0 | 29.00/73 | 0.397 | 2905 ms | Superseded |
| **`Qwen/Qwen3-Reranker-0.6B`** | **New default** | **Apache-2.0** | **30.00/73** | **0.411** | **1984 ms** | **Promoted** |

Delta:
- Hits: +1/73 (+1.4 percentage points).
- p95 latency: -921 ms (-32%).
- License: non-commercial default removed from the default path.
- Stddev: zero for hits across n=3 on both lanes.
```

**Result:** ✅ Benchmark report documents the head-to-head

### Lane JSON files verification
**Files:**
- `.opencode/specs/.../007-fixture-calibration/evidence/runs/lane-reranker-jina-v3-run-1.json`
- `.opencode/specs/.../007-fixture-calibration/evidence/runs/lane-reranker-jina-v3-run-2.json`
- `.opencode/specs/.../007-fixture-calibration/evidence/runs/lane-reranker-jina-v3-run-3.json`
- `.opencode/specs/.../007-fixture-calibration/evidence/runs/lane-reranker-qwen3-0p6b-run-1.json`
- `.opencode/specs/.../007-fixture-calibration/evidence/runs/lane-reranker-qwen3-0p6b-run-2.json`
- `.opencode/specs/.../007-fixture-calibration/evidence/runs/lane-reranker-qwen3-0p6b-run-3.json`

**Actual JSON data:**

**jina-v3 runs:**
- Run 1: hits=14, hit_rate=0.1917808219178082, p95=4957ms
- Run 2: hits=29, hit_rate=0.3972602739726027, p95=2899ms
- Run 3: hits=29, hit_rate=0.3972602739726027, p95=2877ms

**Qwen3-0.6B runs:**
- Run 1: hits=30, hit_rate=0.410958904109589, p95=1957ms
- Run 2: hits=30, hit_rate=0.410958904109589, p95=2055ms
- Run 3: hits=30, hit_rate=0.410958904109589, p95=1941ms

**Calculated statistics:**
- jina-v3 hits: [14, 29, 29] → mean = 24.0, stddev = 8.49 (NOT zero!)
- jina-v3 p95: [4957, 2899, 2877] → mean = 3577.7ms (NOT 2905ms as claimed)
- Qwen hits: [30, 30, 30] → mean = 30.0, stddev = 0 (matches claim)
- Qwen p95: [1957, 2055, 1941] → mean = 1984.3ms (matches claim)

## Findings

### P1 — ADR-027 and benchmark report claim incorrect jina-v3 statistics (evidence mismatch)

**Evidence:**
- ADR-027 claims jina-v3 had "29.0/73 hits" with "Stddev (hits, n=3) = 0"
- Benchmark report claims jina-v3 had "29.00/73 hits" with "Stddev: zero for hits across n=3"
- Actual JSON data shows jina-v3 hits: [14, 29, 29] → mean = 24.0, stddev = 8.49
- Actual JSON data shows jina-v3 p95: [4957, 2899, 2877] → mean = 3577.7ms (not 2905ms as claimed)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/lane-reranker-jina-v3-run-1.json:11-12` shows hits=14 (not 29)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/lane-reranker-jina-v3-run-2.json:11-12` shows hits=29
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/lane-reranker-jina-v3-run-3.json:11-12` shows hits=29

**Analysis:** The ADR-027 and benchmark report claim jina-v3 had 29.0/73 hits with zero stddev, but the actual JSON evidence shows one run (run-1) had only 14 hits. The mean of [14, 29, 29] is 24.0, not 29.0. The stddev is 8.49, not zero. The p95 mean is 3577.7ms, not 2905ms as claimed.

The Qwen3-0.6B data is consistent: all 3 runs had exactly 30 hits with zero stddev, and the p95 mean of 1984.3ms matches the claimed 1984ms.

**Root cause:** The ADR-027 and benchmark report appear to have used incorrect statistics for jina-v3, possibly excluding run-1 (which had anomalously low 14 hits) or using only runs 2-3. This is a data integrity issue in the evidence documentation.

**Impact:** The claimed delta of "+1 hit (+1.4pp)" between jina-v3 (29.0) and Qwen (30.0) is incorrect. The actual delta is between jina-v3 mean (24.0) and Qwen mean (30.0), which is +6 hits (+8.2pp). However, given the high stddev (8.49) on jina-v3, the statistical significance is questionable. The jina-v3 run-1 anomaly (14 hits vs 29 in runs 2-3) suggests instability.

**Recommendation:** 
1. Investigate why jina-v3 run-1 had only 14 hits (was there a daemon issue, index corruption, or environment problem?)
2. Correct ADR-027 and benchmark report to reflect the actual JSON data, or exclude run-1 with justification if it was genuinely flawed
3. Re-run the jina-v3 lane to get stable n=3 data if run-1 was anomalous
4. Re-evaluate the default flip decision with corrected statistics

**Severity:** P1 — correctness/data integrity issue. The ADR and benchmark report documentation does not match the actual evidence, which calls into question the empirical basis for the default flip decision.

### INFO — Implementation correctness verified

**Evidence:**
- DEFAULT_RERANKER_NAME correctly set to "Qwen/Qwen3-Reranker-0.6B" in registered_embedders.py:256
- _DEFAULT_RERANK_MODEL correctly references DEFAULT_RERANKER_NAME in config.py:30
- ccc doctor --json correctly reports pipeline.stage_2.name = "Qwen/Qwen3-Reranker-0.6B"
- Qwen3-0.6B lane JSON data is consistent (30/30/30 hits, zero stddev)

**Severity:** INFO — no action needed on implementation, only documentation correction.

## Updates to review.md

Iteration 003 completed. Found P1 data integrity issue: ADR-027 and benchmark report claim incorrect jina-v3 statistics that don't match the actual JSON lane data. The claimed jina-v3 mean of 29.0 hits with zero stddev is incorrect; actual data shows [14, 29, 29] with mean 24.0 and stddev 8.49. Qwen3-0.6B data is consistent (30/30/30 hits, zero stddev). Implementation is correct, but the evidence documentation needs correction.

## NO-EARLY-STOP confirmation

Iteration 3 of 10 complete. Continuing to iteration 4.
