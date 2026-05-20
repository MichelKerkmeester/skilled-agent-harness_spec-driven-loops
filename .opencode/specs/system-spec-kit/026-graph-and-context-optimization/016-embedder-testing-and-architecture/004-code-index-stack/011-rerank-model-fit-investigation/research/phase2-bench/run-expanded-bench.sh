#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# 023B Expanded Calibration Bench
# ───────────────────────────────────────────────────────────────
# Runs the expanded fixture across calibration perturbation lanes and writes:
#   runs/lane-<id>-run-<n>.json
#   expanded-calibration-summary.md
#   residual-miss-taxonomy.md for the selected best/default lane
#
# Expected wall time on this repo:
#   - one full run across default lanes: roughly 20 minutes
#   - --runs 3 confirmation: roughly 60 minutes
#
# Usage:
#   bash run-expanded-bench.sh [--runs 3] [--groups rrf,boost,topk,fusion] [--resume]
#
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments or benchmark failure

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
CCC="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
PYTHON="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python"
CALIBRATION="$SCRIPT_DIR/calibration_perturbation.py"
FIXTURE="${FIXTURE_OVERRIDE:-$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/code-retrieval-fixture-expanded-v2.json}"
PACKET_DIR="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration"
RUNS_DIR="$PACKET_DIR/evidence/runs"
RUNS=3
LANE_GROUPS="rrf,boost,topk,fusion"
RESUME=0

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --runs N                    Repetitions per lane (default: 3)
  --groups rrf,boost,topk     Comma-separated lane groups
  --resume                    Skip existing per-run JSON
  -h, --help                  Show this help

Environment:
  FIXTURE_OVERRIDE            Override expanded fixture path
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --runs)
      RUNS="${2:?--runs requires a value}"
      [[ "$RUNS" =~ ^[1-9][0-9]*$ ]] || { echo "ERROR: --runs must be positive integer" >&2; exit 1; }
      shift 2
      ;;
    --groups)
      LANE_GROUPS="${2:?--groups requires a value}"
      shift 2
      ;;
    --resume)
      RESUME=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

[[ -x "$CCC" ]] || { echo "ERROR: ccc executable not found: $CCC" >&2; exit 1; }
[[ -x "$PYTHON" ]] || { echo "ERROR: python executable not found: $PYTHON" >&2; exit 1; }
[[ -f "$FIXTURE" ]] || { echo "ERROR: fixture not found: $FIXTURE" >&2; exit 1; }

mkdir -p "$RUNS_DIR"
cd "$REPO_ROOT"

log() {
  printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"
}

group_enabled() {
  local group="$1"
  [[ ",$LANE_GROUPS," == *",$group,"* ]]
}

restart_daemon() {
  "$CCC" daemon stop >/dev/null 2>&1 || true
}

run_lane() {
  local lane_id="$1"
  local lane_name="$2"
  local run_no="$3"
  shift 3

  local output_json="$RUNS_DIR/lane-${lane_id}-run-${run_no}.json"
  if [[ "$RESUME" -eq 1 && -s "$output_json" ]]; then
    log "SKIP $lane_id run $run_no: existing JSON"
    return 0
  fi

  log "RUN $lane_id run $run_no: $lane_name"
  restart_daemon
  env "$@" "$PYTHON" - "$FIXTURE" "$lane_id" "$lane_name" "$run_no" "$output_json" "$CCC" <<'PYTHON'
from __future__ import annotations

import json
import os
import re
import statistics
import subprocess
import sys
import time
from datetime import UTC, datetime
from pathlib import Path

fixture = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
lane_id = sys.argv[2]
lane_name = sys.argv[3]
run_no = int(sys.argv[4])
output_json = Path(sys.argv[5])
ccc = sys.argv[6]

mirror_prefixes = (".opencode/", ".claude/", ".codex/", ".gemini/")


def norm(path: str) -> str:
    for prefix in mirror_prefixes:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break
    return re.sub(r":\d+(-\d+)?$", "", path)


def extract_paths(stdout: str) -> list[str]:
    paths: list[str] = []
    for line in stdout.splitlines():
        if not line.startswith("File: "):
            continue
        candidate = line.removeprefix("File: ").split(" ", 1)[0]
        candidate = re.sub(r":\d+(-\d+)?$", "", candidate)
        if candidate not in paths:
            paths.append(candidate)
    return paths


def percentile(values: list[int], pct: float) -> int:
    if not values:
        return 0
    ordered = sorted(values)
    index = max(0, min(len(ordered) - 1, int(round((pct / 100) * (len(ordered) - 1)))))
    return ordered[index]


started_at = datetime.now(UTC).isoformat()
per_probe = []
latencies: list[int] = []
for probe in fixture:
    t0 = time.monotonic()
    proc = subprocess.run(
        [ccc, "search", probe["query"], "--limit", "5"],
        capture_output=True,
        text=True,
        timeout=90,
        check=False,
    )
    latency_ms = int((time.monotonic() - t0) * 1000)
    latencies.append(latency_ms)
    top_paths = extract_paths(proc.stdout) if proc.returncode == 0 else []
    top5 = [norm(path) for path in top_paths[:5]]
    truth = {norm(path) for path in probe["truth_set"]}
    hit = bool(truth & set(top5))
    per_probe.append(
        {
            "probe_id": probe["id"],
            "query": probe["query"],
            "expected": probe["expected_source_path"],
            "top5": top5,
            "hit": hit,
            "latency_ms": latency_ms,
            "returncode": proc.returncode,
            "stderr": proc.stderr.strip()[-1000:],
            "diagnostics": {
                "vec_candidates_count": None,
                "fts_candidates_count": None,
                "overlap_count": None,
                "post_dedup_count": None,
                "rerank_input_count": None,
                "rerank_output_count": None,
                "boost_flip_count": None,
                "reranker_fallback_used": None,
                "reranker_fallback_reason": None,
            },
        }
    )

hits = sum(1 for row in per_probe if row["hit"])
artifact = {
    "schema_version": 2,
    "lane_id": lane_id,
    "lane_name": lane_name,
    "run": run_no,
    "started_at": started_at,
    "completed_at": datetime.now(UTC).isoformat(),
    "success": all(row["returncode"] == 0 for row in per_probe),
    "fixture": str(Path(sys.argv[1])),
    "env": {key: os.environ.get(key) for key in sorted(os.environ) if key.startswith("COCOINDEX_")},
    "total_probes": len(per_probe),
    "hits": hits,
    "hit_rate": hits / len(per_probe) if per_probe else 0.0,
    "latency_ms": {
        "mean": round(statistics.fmean(latencies), 2) if latencies else 0.0,
        "p50": percentile(latencies, 50),
        "p95": percentile(latencies, 95),
        "p99": percentile(latencies, 99),
    },
    "per_probe": per_probe,
}
output_json.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"lane={lane_id} run={run_no} hits={hits}/{len(per_probe)} p95_ms={artifact['latency_ms']['p95']}")
if not artifact["success"]:
    raise SystemExit(1)
PYTHON
}

export COCOINDEX_CODE_EMBEDDING_MODEL="${COCOINDEX_CODE_EMBEDDING_MODEL:-sbert/nomic-ai/CodeRankEmbed}"
export COCOINDEX_HYBRID="true"
export COCOINDEX_RERANK="true"
export COCOINDEX_RERANK_ENABLED="true"
export COCOINDEX_RERANK_MODEL="${COCOINDEX_RERANK_MODEL:-Qwen/Qwen3-Reranker-0.6B}"

for run_no in $(seq 1 "$RUNS"); do
  if group_enabled "rrf"; then
    for k in 10 30 60 100 150 300; do
      run_lane "rrf-k${k}" "RRF K=${k}" "$run_no" COCOINDEX_HYBRID_RRF_K="$k"
    done
  fi
  if group_enabled "boost"; then
    for path_boost in 0.005 0.01 0.02 0.05; do
      run_lane "boost-p${path_boost//./p}-c${path_boost//./p}" "boost path=${path_boost} canonical=${path_boost}" "$run_no" \
        COCOINDEX_HYBRID_PATH_CLASS_SHIFT="$path_boost" \
        COCOINDEX_HYBRID_CANONICAL_RESOURCE_BOOST="$path_boost"
    done
  fi
  if group_enabled "topk"; then
    for top_k in 5 10 20 40 80; do
      run_lane "topk-${top_k}" "rerank top_k=${top_k}" "$run_no" COCOINDEX_RERANK_TOP_K="$top_k"
    done
  fi
  if group_enabled "fusion"; then
    run_lane "fusion-rrf" "fusion RRF" "$run_no" COCOINDEX_FUSION_FORMULA="rrf"
    run_lane "fusion-combmnz" "fusion CombMNZ" "$run_no" COCOINDEX_FUSION_FORMULA="combmnz"
    run_lane "fusion-avg" "fusion equal average" "$run_no" COCOINDEX_FUSION_FORMULA="average"
  fi
  if group_enabled "reranker"; then
    run_lane "reranker-jina-v3" "reranker jinaai/jina-reranker-v3 (cc-by-nc-4.0)" "$run_no" COCOINDEX_RERANK_MODEL="jinaai/jina-reranker-v3"
    run_lane "reranker-qwen3-0p6b" "reranker Qwen/Qwen3-Reranker-0.6B (apache-2.0)" "$run_no" COCOINDEX_RERANK_MODEL="Qwen/Qwen3-Reranker-0.6B"
  fi
done

"$PYTHON" "$CALIBRATION" aggregate --runs-dir "$RUNS_DIR" --output "$PACKET_DIR/evidence/expanded-calibration-summary.md"
default_run="$(ls "$RUNS_DIR"/lane-rrf-k60-run-*.json 2>/dev/null | sort | head -1 || true)"
if [[ -n "$default_run" ]]; then
  "$PYTHON" "$CALIBRATION" taxonomy --fixture "$FIXTURE" --run "$default_run" --output "$PACKET_DIR/evidence/residual-miss-taxonomy.md"
fi

log "Expanded bench complete"
