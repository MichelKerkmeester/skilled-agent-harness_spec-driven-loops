#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Rerank Matrix Bench — 018 Final Reranker Verdict
# ───────────────────────────────────────────────────────────────
# Runs one reranker lane per matrix cell and writes normalized per-run JSON
# artifacts for rerank-matrix-analyze.py.
#
# Usage:
#   bash rerank-matrix-bench.sh [--resume] [--lanes A,B,C,D] [--iterations N]
#
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments or benchmark failure

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
CCC="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
PYTHON="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python"
PACKET_DIR="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench"
RUNS_DIR="$PACKET_DIR/evidence/runs"
DAEMON_RESTART_LOCK="$RUNS_DIR/.daemon-restart.lock"
FIXTURE="${FIXTURE_OVERRIDE:-$SCRIPT_DIR/code-retrieval-fixture-corrected.json}"
ITERATIONS=3
LANE_FILTER="A,B,C,D"
RESUME=0

if [[ -f "$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_mxbai.py" ]]; then
  LANE_FILTER="A,B,C,D,E"
fi

log() {
  printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"
}

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --resume             Skip runs whose JSON already exists
  --lanes A,B,C,D      Comma-separated lane ids to run
  --iterations N       Iterations per lane (default: 3)
  -h, --help           Show this help

Environment:
  FIXTURE_OVERRIDE     Fixture JSON path

Examples:
  bash rerank-matrix-bench.sh --lanes A,B --iterations 1
  bash rerank-matrix-bench.sh --resume
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --resume)
      RESUME=1
      shift
      ;;
    --lanes)
      LANE_FILTER="${2:?--lanes requires a comma-separated value}"
      shift 2
      ;;
    --iterations)
      ITERATIONS="${2:?--iterations requires a numeric value}"
      if ! [[ "$ITERATIONS" =~ ^[1-9][0-9]*$ ]]; then
        echo "ERROR: --iterations must be a positive integer" >&2
        exit 1
      fi
      shift 2
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

if [[ ! -x "$CCC" ]]; then
  echo "ERROR: ccc executable not found: $CCC" >&2
  exit 1
fi

if [[ ! -x "$PYTHON" ]]; then
  echo "ERROR: python executable not found: $PYTHON" >&2
  exit 1
fi

if [[ ! -f "$FIXTURE" ]]; then
  echo "ERROR: fixture not found: $FIXTURE" >&2
  exit 1
fi

mkdir -p "$RUNS_DIR"
cd "$REPO_ROOT"

lane_enabled() {
  local lane_id="$1"
  [[ ",$LANE_FILTER," == *",$lane_id,"* ]]
}

restart_daemon() {
  local acquired=0
  for _attempt in {1..100}; do
    if mkdir "$DAEMON_RESTART_LOCK" 2>/dev/null; then
      acquired=1
      break
    fi
    sleep 0.1
  done
  if [[ "$acquired" -ne 1 ]]; then
    echo "ERROR: timed out waiting for daemon restart lock: $DAEMON_RESTART_LOCK" >&2
    return 1
  fi
  "$CCC" daemon stop >/dev/null 2>&1 || true
  rmdir "$DAEMON_RESTART_LOCK"
  # The installed CLI has no `daemon start`; the first `ccc search` auto-starts
  # the daemon with the env vars exported for this lane.
}

run_lane_iter() {
  local lane_id="$1"
  local lane_name="$2"
  local rerank_enabled="$3"
  local rerank_model="$4"
  local path_class_boost="$5"
  local adapter_override="$6"
  local iteration="$7"

  local output_json="$RUNS_DIR/lane${lane_id}-iter${iteration}.json"
  local result_jsonl="$RUNS_DIR/lane${lane_id}-iter${iteration}.results.jsonl"
  local scores_jsonl="$RUNS_DIR/lane${lane_id}-iter${iteration}.rerank-scores.jsonl"

  if [[ "$RESUME" -eq 1 && -s "$output_json" ]]; then
    log "SKIP lane ${lane_id} iter ${iteration}: $output_json exists"
    return 0
  fi

  log "RUN lane ${lane_id} iter ${iteration}: $lane_name"
  : > "$result_jsonl"
  : > "$scores_jsonl"

  export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/BAAI/bge-code-v1"
  export COCOINDEX_CODE_DIR="${COCOINDEX_CODE_DIR:-$REPO_ROOT/.cocoindex_code}"
  export COCOINDEX_HYBRID="true"
  export COCOINDEX_RERANK="$rerank_enabled"
  export COCOINDEX_RERANK_ENABLED="$rerank_enabled"
  export COCOINDEX_RERANK_LOG_PATH="$scores_jsonl"

  if [[ -n "$rerank_model" ]]; then
    export COCOINDEX_RERANK_MODEL="$rerank_model"
  else
    unset COCOINDEX_RERANK_MODEL
  fi

  if [[ "$path_class_boost" == "true" ]]; then
    export COCOINDEX_RERANK_PATH_CLASS_BOOST="true"
  else
    unset COCOINDEX_RERANK_PATH_CLASS_BOOST
  fi
  unset COCOINDEX_RERANK_PATH_CLASS_FACTORS

  if [[ -n "$adapter_override" ]]; then
    export COCOINDEX_RERANK_ADAPTER="$adapter_override"
  else
    unset COCOINDEX_RERANK_ADAPTER
  fi

  log "  stopping daemon so lane env is picked up on next search"
  restart_daemon

  "$PYTHON" - "$FIXTURE" "$lane_id" "$lane_name" "$iteration" "$result_jsonl" "$scores_jsonl" "$output_json" "$CCC" <<'PYTHON'
from __future__ import annotations

import json
import math
import os
import re
import statistics
import subprocess
import sys
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

fixture_path = Path(sys.argv[1])
lane_id = sys.argv[2]
lane_name = sys.argv[3]
iteration = int(sys.argv[4])
results_jsonl = Path(sys.argv[5])
scores_jsonl = Path(sys.argv[6])
output_json = Path(sys.argv[7])
ccc_bin = sys.argv[8]
pairs = json.loads(fixture_path.read_text(encoding="utf-8"))

MIRROR_PREFIXES = (".opencode/", ".claude/", ".codex/", ".gemini/")
TRAILING_PUNCTUATION = ",;.)]}"
QUOTE_CHARS = chr(96) + "'\""


def _clean_path_candidate(token: str) -> str:
    candidate = token.strip().strip(QUOTE_CHARS).strip()
    for _ in range(2):
        candidate = candidate.lstrip("([{").rstrip(TRAILING_PUNCTUATION).strip(QUOTE_CHARS).strip()
    candidate = re.sub(r":\d+(-\d+)?$", "", candidate)
    candidate = candidate.rstrip(TRAILING_PUNCTUATION).strip(QUOTE_CHARS).strip()
    return re.sub(r":\d+(-\d+)?$", "", candidate)


def _wrapper_paths(line: str) -> list[str]:
    paths: list[str] = []
    quote_class = re.escape(QUOTE_CHARS)
    for match in re.finditer(rf"\b(?:import|require)\(\s*([{quote_class}])([^{quote_class}]+)\1\s*\)?", line):
        paths.append(match.group(2))
    for match in re.finditer(rf"\bfrom\s+([{quote_class}])([^{quote_class}]+)\1", line):
        paths.append(match.group(2))
    return paths


def _candidate_exists(candidate: str) -> bool:
    if candidate.startswith(MIRROR_PREFIXES):
        return True
    return Path(candidate).exists()


def _extract_paths(stdout: str) -> list[str]:
    top_paths: list[str] = []
    for line in stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        for token in [*_wrapper_paths(line), *line.split()]:
            if "/" not in token or "." not in token.split("/")[-1]:
                continue
            candidate = _clean_path_candidate(token)
            if not candidate or "/" not in candidate or "." not in candidate.split("/")[-1]:
                continue
            if not _candidate_exists(candidate):
                continue
            if candidate not in top_paths:
                top_paths.append(candidate)
    return top_paths


def _norm(path: str) -> str:
    for prefix in MIRROR_PREFIXES:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break
    return re.sub(r":\d+(-\d+)?$", "", path)


def _percentile(values: list[int], percentile: float) -> int:
    if not values:
        return 0
    sorted_values = sorted(values)
    index = math.ceil((percentile / 100.0) * len(sorted_values)) - 1
    return sorted_values[max(0, min(index, len(sorted_values) - 1))]


def _daemon_rss_mb() -> float | None:
    try:
        pids = subprocess.run(
            ["pgrep", "-f", "ccc run-daemon"],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        )
    except Exception:
        return None
    rss_kb_total = 0
    found = False
    for pid in pids.stdout.split():
        try:
            rss = subprocess.run(
                ["ps", "-o", "rss=", "-p", pid],
                capture_output=True,
                text=True,
                timeout=3,
                check=False,
            )
            if rss.stdout.strip():
                rss_kb_total += int(rss.stdout.strip().split()[0])
                found = True
        except Exception:
            continue
    if not found:
        return None
    return round(rss_kb_total / 1024.0, 2)


started_at = datetime.now(UTC).isoformat()
latencies: list[int] = []
peak_rss_mb: float | None = _daemon_rss_mb()
per_probe: list[dict[str, Any]] = []

for probe in pairs:
    probe_id = probe["id"]
    query = probe["query"]
    expected = probe.get("expected_source_path", "")
    difficulty = probe.get("difficulty", "medium")

    t0 = time.monotonic()
    result = subprocess.run(
        [ccc_bin, "search", query, "--limit", "5"],
        capture_output=True,
        text=True,
        timeout=90,
        check=False,
    )
    latency_ms = int((time.monotonic() - t0) * 1000)
    rss_mb = _daemon_rss_mb()
    if rss_mb is not None:
        peak_rss_mb = rss_mb if peak_rss_mb is None else max(peak_rss_mb, rss_mb)
    latencies.append(latency_ms)

    top_paths = _extract_paths(result.stdout) if result.returncode == 0 else []
    top5 = [_norm(path) for path in top_paths[:5]]
    expected_norm = _norm(expected) if expected else ""
    hit = expected_norm in top5 if expected_norm else False
    row = {
        "lane_id": lane_id,
        "lane_name": lane_name,
        "iteration": iteration,
        "probe_id": probe_id,
        "query": query,
        "expected": expected,
        "expected_norm": expected_norm,
        "top1": top_paths[0] if top_paths else "",
        "top5": top5,
        "hit": hit,
        "latency_ms": latency_ms,
        "difficulty": difficulty,
        "returncode": result.returncode,
        "stderr": result.stderr.strip()[-1000:],
    }
    per_probe.append(row)
    with results_jsonl.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(row, sort_keys=True) + "\n")

hits = sum(1 for row in per_probe if row["hit"])
artifact = {
    "schema_version": 1,
    "lane_id": lane_id,
    "lane_name": lane_name,
    "iteration": iteration,
    "started_at": started_at,
    "completed_at": datetime.now(UTC).isoformat(),
    "success": all(row["returncode"] == 0 for row in per_probe),
    "fixture": str(fixture_path),
    "env": {
        "COCOINDEX_CODE_EMBEDDING_MODEL": os.environ.get("COCOINDEX_CODE_EMBEDDING_MODEL"),
        "COCOINDEX_HYBRID": os.environ.get("COCOINDEX_HYBRID"),
        "COCOINDEX_RERANK": os.environ.get("COCOINDEX_RERANK"),
        "COCOINDEX_RERANK_ENABLED": os.environ.get("COCOINDEX_RERANK_ENABLED"),
        "COCOINDEX_RERANK_MODEL": os.environ.get("COCOINDEX_RERANK_MODEL"),
        "COCOINDEX_RERANK_PATH_CLASS_BOOST": os.environ.get("COCOINDEX_RERANK_PATH_CLASS_BOOST"),
        "COCOINDEX_RERANK_ADAPTER": os.environ.get("COCOINDEX_RERANK_ADAPTER"),
    },
    "total_probes": len(per_probe),
    "hits": hits,
    "hit_rate": hits / len(per_probe) if per_probe else 0.0,
    "latency_ms": {
        "mean": round(statistics.fmean(latencies), 2) if latencies else 0.0,
        "p50": _percentile(latencies, 50),
        "p95": _percentile(latencies, 95),
        "p99": _percentile(latencies, 99),
    },
    "peak_rss_mb": peak_rss_mb,
    "per_probe": per_probe,
    "artifacts": {
        "results_jsonl": str(results_jsonl),
        "rerank_scores_jsonl": str(scores_jsonl),
    },
}
output_json.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"lane={lane_id} iter={iteration} hits={hits}/{len(per_probe)} p95_ms={artifact['latency_ms']['p95']} rss_mb={peak_rss_mb}")
if not artifact["success"]:
    sys.exit(1)
PYTHON
}

declare -a LANE_IDS=("A" "B" "C" "D")
if [[ -f "$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_mxbai.py" ]]; then
  LANE_IDS+=("E")
fi

lane_name_for() {
  case "$1" in
    A) printf '%s\n' "no-rerank-ablation" ;;
    B) printf '%s\n' "bge-baseline" ;;
    C) printf '%s\n' "bge-path-class" ;;
    D) printf '%s\n' "jina-v3" ;;
    E) printf '%s\n' "mxbai" ;;
    *) echo "ERROR: unknown lane: $1" >&2; return 1 ;;
  esac
}

lane_rerank_enabled_for() {
  case "$1" in
    A) printf '%s\n' "false" ;;
    B|C|D|E) printf '%s\n' "true" ;;
    *) echo "ERROR: unknown lane: $1" >&2; return 1 ;;
  esac
}

lane_model_for() {
  case "$1" in
    A) printf '\n' ;;
    B|C) printf '%s\n' "BAAI/bge-reranker-v2-m3" ;;
    D) printf '%s\n' "jinaai/jina-reranker-v3" ;;
    E) printf '%s\n' "mixedbread-ai/mxbai-rerank-base-v2" ;;
    *) echo "ERROR: unknown lane: $1" >&2; return 1 ;;
  esac
}

lane_boost_for() {
  case "$1" in
    C) printf '%s\n' "true" ;;
    A|B|D|E) printf '%s\n' "false" ;;
    *) echo "ERROR: unknown lane: $1" >&2; return 1 ;;
  esac
}

lane_adapter_for() {
  case "$1" in
    D) printf '%s\n' "jina_v3" ;;
    E) printf '%s\n' "mxbai" ;;
    A|B|C) printf '\n' ;;
    *) echo "ERROR: unknown lane: $1" >&2; return 1 ;;
  esac
}

log "Rerank matrix bench starting"
log "Fixture: $FIXTURE"
log "Runs dir: $RUNS_DIR"
log "Lanes: $LANE_FILTER; iterations: $ITERATIONS"

for lane_id in "${LANE_IDS[@]}"; do
  if ! lane_enabled "$lane_id"; then
    continue
  fi
  for iteration in $(seq 1 "$ITERATIONS"); do
    run_lane_iter \
      "$lane_id" \
      "$(lane_name_for "$lane_id")" \
      "$(lane_rerank_enabled_for "$lane_id")" \
      "$(lane_model_for "$lane_id")" \
      "$(lane_boost_for "$lane_id")" \
      "$(lane_adapter_for "$lane_id")" \
      "$iteration"
  done
done

log "Rerank matrix bench complete"
