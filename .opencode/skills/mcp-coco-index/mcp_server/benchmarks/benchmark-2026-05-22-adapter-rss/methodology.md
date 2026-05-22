---
title: "Methodology: Adapter Resident-Memory RSS Benchmark"
description: "RSS slope methodology for arc 009 phase 012 successful-search and sidecar 5xx fallback paths."
trigger_phrases:
  - "adapter rss methodology"
  - "successful-search rss benchmark"
  - "sidecar 5xx fallback rss benchmark"
importance_tier: "important"
contextType: "reference"
---

# Methodology: Adapter Resident-Memory RSS Benchmark

## Scope

This benchmark measures resident-memory growth on the two paths left benchmark-gated by arc 009 phase 008:

1. `successful-search`: repeated `ccc search` calls against a representative fixture query.
2. `sidecar-5xx-fallback`: repeated `HttpSidecarRerankerAdapter.rerank()` calls where the sidecar HTTP layer returns `503` and CocoIndex falls back to the bundled adapter.

It does not fix memory growth. If either path exceeds the threshold, the fix belongs in a separate follow-on packet.

## Threshold

The severity threshold follows phase 008's fallback RSS gate:

- `threshold_mb`: 10 MB per 50 iterations.
- `rss_slope_mb_per_50 > threshold_mb`: `P1-escalate`.
- `rss_slope_mb_per_50 <= threshold_mb`: `P2-hold`.
- A sandbox/runtime blocker records `deferred-to-operator`; it is not evidence for P2 hold.

The default per-iteration threshold is therefore `0.2 MB/iter`.

## Snapshot Source

Both scripts share RSS snapshot, slope, IQR, confidence interval and blocked-payload handling through `bench_rss_core.py`. Both scripts call:

```bash
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js snapshot
```

The scripts retain the raw harness counters and compute RSS aggregates from the returned `processes[]` rows:

- `project_daemon_rss_bytes`: project daemon plus `ccc-daemon` rows.
- `expected_daemon_rss_bytes`: expected warm daemon rows, including rerank sidecars.
- `current_session_rss_bytes`: current script session rows.
- `measurement_rss_bytes`: the path-specific RSS used for the slope decision.

For `successful-search`, the decision RSS is project plus expected daemon RSS. For `sidecar-5xx-fallback`, the decision RSS is current-session RSS because the fallback adapter runs in the benchmark process.

## Statistics

Each script emits JSON with:

- `rss_slope_bytes_per_iter`
- `rss_slope_mb_per_50`
- `mean_delta_mb`
- `median_delta_mb`
- `iqr_mb`
- `peak_mb`
- `confidence_95_mb_per_iter`
- per-sample rows with RSS, wired memory, swap/compressor proxy, process counts, command status, and timestamps

Slope is ordinary least-squares regression over `(iteration, measurement_rss_bytes)`. The 95 percent confidence interval uses a normal approximation around the slope standard error. For small sample sizes, treat the interval as directional rather than publication-grade.

## Operator Runbook

Run from the repository root:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

cd .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss

python3 bench_successful_search_rss.py \
  --iterations 50 \
  --out /tmp/bench-search-rss.json

python3 bench_sidecar_5xx_fallback_rss.py \
  --iterations 50 \
  --out /tmp/bench-fallback-rss.json
```

If the fallback benchmark cannot load the bundled model because the sandbox has no network or model cache, rerun outside the sandbox in the normal operator shell. The sidecar HTTP 5xx condition itself is mocked intentionally; the resident-memory load should come from the real fallback adapter unless `--stub-fallback` is explicitly used for a smoke-only run.

## Expected JSON Shape

```json
{
  "schema_version": 1,
  "path": "successful-search",
  "status": "ok",
  "iterations": 50,
  "threshold_mb": 10.0,
  "rss_slope_bytes_per_iter": 0.0,
  "rss_slope_mb_per_50": 0.0,
  "mean_delta_mb": 0.0,
  "median_delta_mb": 0.0,
  "iqr_mb": 0.0,
  "peak_mb": 0.0,
  "confidence_95_mb_per_iter": [0.0, 0.0],
  "decision": "P2-hold",
  "samples": []
}
```
