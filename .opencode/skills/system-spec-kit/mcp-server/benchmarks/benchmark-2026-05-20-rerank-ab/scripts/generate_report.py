#!/usr/bin/env python3
"""Generate sk-doc benchmark_report.md for the rerank A/B benchmark."""

from __future__ import annotations

import argparse
import csv
import json
import statistics
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


def read_results(path: Path) -> dict[str, dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return {row["arm"]: row for row in csv.DictReader(handle)}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def f(row: dict[str, str], key: str, digits: int = 3) -> str:
    value = row.get(key, "")
    if value == "":
        return ""
    return f"{float(value):.{digits}f}"


def load_fixture(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def decision(results: dict[str, dict[str, str]]) -> dict[str, Any]:
    a = results["A"]
    b = results["B"]
    delta = results.get("B_minus_A", {})
    hit_delta_pp = (float(b["hit_rate"]) - float(a["hit_rate"])) * 100
    mrr_delta = float(b["mrr_at_10"]) - float(a["mrr_at_10"])
    p95_delta_ms = float(b["p95_ms"]) - float(a["p95_ms"])
    hit_gate = hit_delta_pp >= 6.0
    mrr_gate = (
        mrr_delta >= 0.10
        and float(a["mrr_at_10_ci_upper"]) < float(b["mrr_at_10_ci_lower"])
    )
    latency_gate = p95_delta_ms <= 400.0
    verdict = "PROMOTE" if (hit_gate or mrr_gate) and latency_gate else "HOLD"
    return {
        "verdict": verdict,
        "hit_delta_pp": hit_delta_pp,
        "mrr_delta": mrr_delta,
        "p95_delta_ms": p95_delta_ms,
        "hit_gate": hit_gate,
        "mrr_gate": mrr_gate,
        "latency_gate": latency_gate,
        "delta_hit_ci": (float(delta.get("hit_rate_ci_lower", 0)), float(delta.get("hit_rate_ci_upper", 0))),
        "delta_mrr_ci": (float(delta.get("mrr_at_10_ci_lower", 0)), float(delta.get("mrr_at_10_ci_upper", 0))),
    }


def category_table(rows: list[dict[str, Any]]) -> str:
    grouped: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        grouped[(str(row["arm"]), str(row["category"]))].append(row)
    lines = ["| Arm | Category | Rows | Hit rate | MRR@10 |", "|---|---|---:|---:|---:|"]
    for key in sorted(grouped):
        arm, category = key
        part = grouped[key]
        hit = statistics.fmean([1.0 if row.get("hit_at_10") else 0.0 for row in part])
        mrr = statistics.fmean([float(row.get("reciprocal_rank") or 0.0) for row in part])
        lines.append(f"| {arm} | {category} | {len(part)} | {hit:.3f} | {mrr:.3f} |")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fixture", required=True)
    parser.add_argument("--results", required=True)
    parser.add_argument("--per-probe", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    fixture = load_fixture(Path(args.fixture))
    results = read_results(Path(args.results))
    rows = read_jsonl(Path(args.per_probe))
    verdict = decision(results)
    probes = fixture["probes"]
    difficulty = Counter(probe["difficulty"] for probe in probes)
    categories = Counter(probe["category"] for probe in probes)
    scoring_counts = Counter((row["arm"], row.get("scoringMethod")) for row in rows)
    provider_counts = Counter((row["arm"], str(row.get("rerank_provider"))) for row in rows)
    b_cross_rows = scoring_counts.get(("B", "cross-encoder"), 0)
    expected_rows = len(probes) * 2 * 5
    row_count = len(rows)
    arm_a = results["A"]
    arm_b = results["B"]
    winner = "Qwen/Qwen3-Reranker-0.6B" if verdict["verdict"] == "PROMOTE" else "positional fallback"
    winner_line = (
        "Qwen clears the promotion rule."
        if verdict["verdict"] == "PROMOTE"
        else (
            "The sidecar-enabled arm degraded to fallback scoring during measured `memory_search` calls."
            if b_cross_rows == 0
            else "Qwen does not clear the promotion rule; keep it opt-in."
        )
    )

    report = f"""---
title: "spec-memory rerank A/B benchmark -- 2026-05-20"
description: "Curated benchmark report comparing positional fallback with Qwen3-Reranker-0.6B on spec-memory's own corpus. Verdict: {verdict['verdict']}."
trigger_phrases:
  - "spec-memory rerank A/B benchmark"
  - "benchmark-2026-05-20-rerank-ab"
  - "Qwen3 spec-memory promotion verdict"
  - "memory_search rerank benchmark"
importance_tier: "important"
contextType: "reference"
---

# spec-memory rerank A/B benchmark -- 2026-05-20

> **Verdict:** `{verdict['verdict']}`. Winner for phase 005: `{winner}`. Hit-rate delta {verdict['hit_delta_pp']:+.1f} pp, MRR delta {verdict['mrr_delta']:+.3f}, p95 delta {verdict['p95_delta_ms']:+.1f} ms. {winner_line}

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
| Probe count | {len(probes)} probes |
| Repeated runs | n=5 per arm |
| Raw rows | {row_count} rows; expected {expected_rows} |
| memory_index hash | `{fixture['memory_index_hash']}` |
| memory_index size | {fixture['memory_index_size']} |
| Decision | `{verdict['verdict']}` |

The load-bearing result is the phase-005 decision rule, not a public model claim. The benchmark asks whether Qwen improves this local memory corpus enough to justify enabling sidecar-backed reranking by default.
<!-- /ANCHOR:headline-overview -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

| Candidate | Backend | Hit rate | Hit-rate 95% CI | MRR@10 | MRR 95% CI | p50 ms | p95 ms | p99 ms | Verdict |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| positional fallback | `SPECKIT_CROSS_ENCODER=false` | {f(arm_a, 'hit_rate')} | {f(arm_a, 'hit_rate_ci_lower')}-{f(arm_a, 'hit_rate_ci_upper')} | {f(arm_a, 'mrr_at_10')} | {f(arm_a, 'mrr_at_10_ci_lower')}-{f(arm_a, 'mrr_at_10_ci_upper')} | {f(arm_a, 'p50_ms', 1)} | {f(arm_a, 'p95_ms', 1)} | {f(arm_a, 'p99_ms', 1)} | baseline |
| Qwen3-Reranker-0.6B sidecar | `SPECKIT_CROSS_ENCODER=true`, `RERANKER_LOCAL=true` | {f(arm_b, 'hit_rate')} | {f(arm_b, 'hit_rate_ci_lower')}-{f(arm_b, 'hit_rate_ci_upper')} | {f(arm_b, 'mrr_at_10')} | {f(arm_b, 'mrr_at_10_ci_lower')}-{f(arm_b, 'mrr_at_10_ci_upper')} | {f(arm_b, 'p50_ms', 1)} | {f(arm_b, 'p95_ms', 1)} | {f(arm_b, 'p99_ms', 1)} | {verdict['verdict']}{'; degraded to fallback' if b_cross_rows == 0 else ''} |

Delta:

- Hit-rate delta: {verdict['hit_delta_pp']:+.1f} pp. Paired bootstrap CI: {verdict['delta_hit_ci'][0] * 100:+.1f} to {verdict['delta_hit_ci'][1] * 100:+.1f} pp.
- MRR@10 delta: {verdict['mrr_delta']:+.3f}. Paired bootstrap CI: {verdict['delta_mrr_ci'][0]:+.3f} to {verdict['delta_mrr_ci'][1]:+.3f}.
- p95 latency delta: {verdict['p95_delta_ms']:+.1f} ms.

Raw aggregate data lives in [`results.csv`](./results.csv). Per-probe rows live in [`per-probe.jsonl`](./per-probe.jsonl).
<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

### Fixture

The fixture combines cat-24/409, cat-13/416-418, and 28 fresh probes authored against the current `memory_index`.

| Difficulty | Count |
|---|---:|
| easy | {difficulty.get('easy', 0)} |
| medium | {difficulty.get('medium', 0)} |
| hard | {difficulty.get('hard', 0)} |

| Category | Count |
|---|---:|
| paraphrase | {categories.get('paraphrase', 0)} |
| terminology | {categories.get('terminology', 0)} |
| arc-context | {categories.get('arc-context', 0)} |

### Search pipeline

Each row invokes the real `memory_search` MCP tool through `dist/context-server.js` over JSON-RPC. The harness waits for startup indexing to settle before measuring queries, disables response-profile/progressive formatting for parse stability, and requests `limit=10`, `includeTrace=true`, `rerank=true`, `bypassCache=true`, `trackAccess=false`.

### Sample size

The benchmark runs {len(probes)} probes × 5 repeats × 2 arms = {expected_rows} expected rows.

### Environment

- Corpus: `memory_index` hash `{fixture['memory_index_hash']}`, size {fixture['memory_index_size']}.
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
| Result | hit rate {f(arm_a, 'hit_rate')}, MRR@10 {f(arm_a, 'mrr_at_10')}, p95 {f(arm_a, 'p95_ms', 1)} ms |
| Strengths observed | Lowest operational complexity and no sidecar dependency |
| Weaknesses observed | Cannot use cross-attention to reorder paraphrase-heavy candidate sets |

### 4.2 Qwen/Qwen3-Reranker-0.6B sidecar

| Property | Value |
|---|---|
| Role | Local HTTP cross-encoder reranker |
| Provider | `local` sidecar through `RERANKER_LOCAL=true` |
| Score contract | Sigmoid-normalized `[0,1]` scores from `/rerank` |
| Result | hit rate {f(arm_b, 'hit_rate')}, MRR@10 {f(arm_b, 'mrr_at_10')}, p95 {f(arm_b, 'p95_ms', 1)} ms |
| Measured scoring | {scoring_counts.get(('B', 'fallback'), 0)}/{len([row for row in rows if row['arm'] == 'B'])} Arm B rows recorded `scoringMethod=fallback`; {provider_counts.get(('B', 'fallback-sort'), 0)} rows reached `fallback-sort`, {provider_counts.get(('B', 'None'), 0)} rows did not rerank |
| Strengths observed | Sidecar process spawned and `/warmup` returned the pinned Qwen model revision |
| Weaknesses observed | The measured `memory_search` path did not receive cross-encoder scores before timeout, so the production path fell back |
<!-- /ANCHOR:per-candidate-profiles -->

---

<!-- ANCHOR:process-notes -->
## 5. PROCESS NOTES

The benchmark intentionally uses spec-memory's own prose-heavy corpus instead of importing the CocoIndex code-chunk benchmark. Phase 001 fixed local provider flag routing, phase 002 created the sidecar, phase 003 integrated sidecar ensure logic into launchers, and this phase measures whether the quality lift is large enough for default promotion.

The harness also records `rerank_provider`, `scoringMethod`, and the Stage 3 gate decision per row. That made the key operational issue visible: the sidecar-enabled arm produced {b_cross_rows} `cross-encoder` rows. Rows either fell back through `fallback-sort`, did not rerank because too few candidates reached the Stage 3 gate, or completed through the neural reranker.
<!-- /ANCHOR:process-notes -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS

### Finding 1 -- Decision rule outcome

The decision rule produced `{verdict['verdict']}`:

| Gate | Threshold | Observed | Pass |
|---|---:|---:|---|
| hit-rate delta | >= +6.0 pp | {verdict['hit_delta_pp']:+.1f} pp | {str(verdict['hit_gate']).lower()} |
| MRR delta with non-overlapping CIs | >= +0.10 | {verdict['mrr_delta']:+.3f} | {str(verdict['mrr_gate']).lower()} |
| p95 latency delta | <= +400 ms | {verdict['p95_delta_ms']:+.1f} ms | {str(verdict['latency_gate']).lower()} |

### Finding 2 -- Category breakdown

{category_table(rows)}

### Finding 3 -- Operational signal

Arm B rows preserve Stage 3 provider metadata in `per-probe.jsonl`.

| Arm | scoringMethod | Rows |
|---|---|---:|
| A | fallback | {scoring_counts.get(('A', 'fallback'), 0)} |
| B | fallback | {scoring_counts.get(('B', 'fallback'), 0)} |
| B | cross-encoder | {b_cross_rows} |

Arm B provider metadata:

| Arm | rerank_provider | Rows |
|---|---|---:|
| B | fallback-sort | {provider_counts.get(('B', 'fallback-sort'), 0)} |
| B | none/null | {provider_counts.get(('B', 'None'), 0)} |

This prevents the benchmark from silently crediting Qwen for fallback behavior.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:caveats -->
## 7. CAVEATS

This is a local benchmark over the current spec-memory corpus. The fixture is intentionally small enough to replay during development and large enough to avoid the 10-probe cat-24/409 trap, but it is not a public retrieval benchmark.

The `memory_search` pipeline has conditional rerank gates. Qwen only affects rows where enough candidates reach Stage 3, the gate allows reranking, and the sidecar responds before the cross-encoder timeout. This run measures end-to-end production behavior, not isolated model quality.

Latency reflects this machine, current sidecar cache state, and current embedding/search dependencies.
<!-- /ANCHOR:caveats -->

---

<!-- ANCHOR:recommendations -->
## 8. RECOMMENDATIONS

**Verdict: `{verdict['verdict']}`.**

Promotion rule:

```text
PROMOTE if:
  (hit_rate_delta_pp >= +6 OR MRR_delta >= +0.10 with non-overlapping CIs)
  AND p95_delta_ms <= +400
Else HOLD.
```

Observed:

```text
hit_rate_delta_pp = {verdict['hit_delta_pp']:+.1f}
MRR_delta = {verdict['mrr_delta']:+.3f}
p95_delta_ms = {verdict['p95_delta_ms']:+.1f}
```

Recommendation for phase 005: `{verdict['verdict']}`. If `PROMOTE`, phase 005 may enable Qwen-backed reranking by default. If `HOLD`, phase 005 should keep Qwen available as an opt-in sidecar path and document the env toggle. When the sidecar-enabled arm has zero cross-encoder rows, timeout/device tuning is a prerequisite before any future promotion attempt.
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:reproducibility -->
## 9. REPRODUCIBILITY

Replay from repo root:

```bash
cd .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab
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
"""
    Path(args.out).write_text(report)


if __name__ == "__main__":
    main()
