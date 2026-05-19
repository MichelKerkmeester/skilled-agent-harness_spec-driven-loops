#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Phase 2 Smoke Bench — 011 Rerank Model Fit Investigation
# ─────────────────────────────────────────────────────────────────
# 3 sequential lanes against the 8-probe subset (4 failures + 4 controls):
#   1. baseline-bge       : current BGE reranker, no boost (regression baseline)
#   2. bge-path-class     : same BGE model + COCOINDEX_RERANK_PATH_CLASS_BOOST=1
#   3. jina-v3            : throwaway jina-reranker-v3 adapter
#
# Embedder is PINNED to sbert/BAAI/bge-code-v1 across all 3 lanes — this is a
# reranker/path-role test, not an embedder test. The DB must already be indexed
# under bge-code-v1 (see plan §1 "background DB reset").
#
# Per-lane behavior:
#   - Kill the ccc daemon (clears _ADAPTERS singleton + reranker model cache)
#   - Set lane env vars (reranker model, boost flag, log path)
#   - Run probe loop (Python: ccc search per probe, capture top-5 + latency)
#   - Append per-probe JSONL via COCOINDEX_RERANK_LOG_PATH (rerank score log)
#   - Append per-probe results JSONL (hit/miss + latency)
#
# Output:
#   baseline-bge.results.jsonl         + baseline-bge.rerank-scores.jsonl
#   bge-path-class.results.jsonl       + bge-path-class.rerank-scores.jsonl
#   jina-v3.results.jsonl              + jina-v3.rerank-scores.jsonl
#   phase2-comparison.md               (final summary table)
# ─────────────────────────────────────────────────────────────────
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
FIXTURE="$SCRIPT_DIR/probe-subset.json"
CCC="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
PYTHON="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3"
RUNLOG="$SCRIPT_DIR/phase2-runlog.txt"

cd "$REPO_ROOT"

log() {
  local msg="$1"
  echo "[$(date +%H:%M:%S)] $msg" | tee -a "$RUNLOG"
}

if [ ! -f "$FIXTURE" ]; then
  echo "FATAL: probe subset fixture not found: $FIXTURE" >&2
  exit 1
fi

# Pinned embedder for all lanes (reranker/path-role test)
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/BAAI/bge-code-v1"
export COCOINDEX_HYBRID="true"
export COCOINDEX_RERANK="true"

kill_daemon() {
  log "killing ccc daemon (if any) to clear _ADAPTERS cache"
  pkill -f "ccc run-daemon" 2>/dev/null || true
  sleep 2
}

run_lane() {
  local lane_name="$1"
  local rerank_model="$2"
  local path_class_boost="$3"
  local adapter_override="$4"

  local lane_start
  lane_start=$(date +%s)
  log "=========================================="
  log "LANE START: $lane_name"
  log "  rerank_model=$rerank_model"
  log "  path_class_boost=$path_class_boost"
  log "  adapter=$adapter_override"

  # Set lane env vars
  export COCOINDEX_RERANK_MODEL="$rerank_model"
  if [ "$path_class_boost" = "1" ]; then
    export COCOINDEX_RERANK_PATH_CLASS_BOOST=1
    # Use defaults from config.py (_DEFAULT_PATH_CLASS_FACTORS)
    unset COCOINDEX_RERANK_PATH_CLASS_FACTORS
  else
    unset COCOINDEX_RERANK_PATH_CLASS_BOOST
  fi
  if [ -n "$adapter_override" ]; then
    export COCOINDEX_RERANK_ADAPTER="$adapter_override"
  else
    unset COCOINDEX_RERANK_ADAPTER
  fi

  # Per-lane output paths
  export COCOINDEX_RERANK_LOG_PATH="$SCRIPT_DIR/${lane_name}.rerank-scores.jsonl"
  local results_jsonl="$SCRIPT_DIR/${lane_name}.results.jsonl"
  : > "$COCOINDEX_RERANK_LOG_PATH"
  : > "$results_jsonl"

  # Kill daemon so the new reranker model takes effect
  kill_daemon

  # Run probe loop
  export CCC
  $PYTHON - "$FIXTURE" "$lane_name" "$results_jsonl" <<'PYTHON'
import json
import os
import re
import subprocess
import sys
import time

fixture_path = sys.argv[1]
lane = sys.argv[2]
results_jsonl = sys.argv[3]
ccc_bin = os.environ.get("CCC", "ccc")
pairs = json.loads(open(fixture_path).read())

hits = 0
latencies = []
per_probe = []

def _norm(path):
    for prefix in [".opencode/", ".claude/", ".codex/", ".gemini/"]:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break
    path = re.sub(r":\d+(-\d+)?$", "", path)
    return path

for p in pairs:
    probe_id = p["id"]
    query = p["query"]
    expected = p.get("expected_source_path", "")
    difficulty = p.get("difficulty", "medium")

    t0 = time.monotonic()
    result = subprocess.run(
        [ccc_bin, "search", query, "--limit", "5"],
        capture_output=True, text=True, timeout=60,
    )
    latency_ms = int((time.monotonic() - t0) * 1000)
    latencies.append(latency_ms)

    top_paths = []
    if result.returncode == 0:
        for line in result.stdout.splitlines():
            line = line.strip()
            if not line:
                continue
            for part in line.split():
                if "/" in part and "." in part.split("/")[-1]:
                    pp = re.sub(r":\d+(-\d+)?$", "", part).rstrip(",;:()")
                    if pp and pp not in top_paths:
                        top_paths.append(pp)

    top1 = top_paths[0] if top_paths else ""
    top5 = [_norm(p) for p in top_paths[:5]]
    expected_norm = _norm(expected) if expected else ""
    hit = (expected_norm in top5) if expected_norm else False
    if hit:
        hits += 1

    row = {
        "lane": lane,
        "probe_id": probe_id,
        "query": query,
        "expected": expected,
        "top1": top1,
        "top5": top5,
        "hit": hit,
        "latency_ms": latency_ms,
        "difficulty": difficulty,
    }
    per_probe.append(row)
    with open(results_jsonl, "a") as f:
        f.write(json.dumps(row) + "\n")

latencies.sort()
median = latencies[len(latencies)//2] if latencies else 0
p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0

print(f"lane={lane} hits={hits}/{len(pairs)} median_ms={median} p95_ms={p95}")
PYTHON

  local lane_end
  lane_end=$(date +%s)
  log "LANE END: $lane_name  wall_s=$((lane_end - lane_start))"
}

log "=========================================="
log "Phase 2 Smoke Bench starting"
log "Fixture: $FIXTURE (8 probes — 4 failures + 4 controls)"
log "Pinned embedder: $COCOINDEX_CODE_EMBEDDING_MODEL"
log "=========================================="

run_lane "baseline-bge"    "BAAI/bge-reranker-v2-m3"   "0" ""
run_lane "bge-path-class"  "BAAI/bge-reranker-v2-m3"   "1" ""
run_lane "jina-v3"         "jinaai/jina-reranker-v3"   "0" "jina_v3"

log "=========================================="
log "Phase 2 bench complete; running comparison synthesis"
log "=========================================="

$PYTHON - "$SCRIPT_DIR" <<'PYTHON_SUMMARY'
import json
import sys
from pathlib import Path

script_dir = Path(sys.argv[1])
lanes = ["baseline-bge", "bge-path-class", "jina-v3"]
FAILURES = {3, 10, 14, 18}
CONTROLS = {1, 5, 11, 16}

# Load per-lane results
lane_results = {}
for lane in lanes:
    fp = script_dir / f"{lane}.results.jsonl"
    if not fp.exists():
        lane_results[lane] = []
        continue
    rows = []
    with open(fp) as f:
        for line in f:
            if line.strip():
                rows.append(json.loads(line))
    lane_results[lane] = rows

def lane_probe_hit(lane: str, probe_id: int) -> str:
    for row in lane_results.get(lane, []):
        if row["probe_id"] == probe_id:
            return "✓" if row["hit"] else "✗"
    return "?"

def lane_latency(lane: str) -> dict:
    rows = lane_results.get(lane, [])
    if not rows:
        return {"median": 0, "p95": 0, "total_hits": 0, "n": 0}
    ls = sorted(r["latency_ms"] for r in rows)
    return {
        "median": ls[len(ls)//2],
        "p95": ls[int(len(ls) * 0.95)],
        "total_hits": sum(1 for r in rows if r["hit"]),
        "n": len(rows),
    }

# Verdict logic
baseline_failure_hits = {pid: lane_probe_hit("baseline-bge", pid) == "✓" for pid in FAILURES}
baseline_control_hits = {pid: lane_probe_hit("baseline-bge", pid) == "✓" for pid in CONTROLS}

def lane_failure_flips(lane: str) -> int:
    """Count probes where baseline missed AND this lane hits."""
    flips = 0
    for pid in FAILURES:
        baseline_miss = not baseline_failure_hits[pid]
        lane_hit = lane_probe_hit(lane, pid) == "✓"
        if baseline_miss and lane_hit:
            flips += 1
    return flips

def lane_control_regressions(lane: str) -> int:
    """Count controls where baseline hit AND this lane misses."""
    regressions = 0
    for pid in CONTROLS:
        baseline_hit = baseline_control_hits[pid]
        lane_miss = lane_probe_hit(lane, pid) == "✗"
        if baseline_hit and lane_miss:
            regressions += 1
    return regressions

# Build markdown
out = ["# Phase 2 Comparison — 011 Rerank Model Fit Investigation\n"]
out.append("## Per-probe hit/miss\n")
out.append("| Probe | Class | Difficulty | baseline-bge | bge-path-class | jina-v3 |")
out.append("|---:|---|---|:---:|:---:|:---:|")
for lane in lanes:
    pass  # header only

all_probes = []
for lane in lanes:
    for row in lane_results.get(lane, []):
        all_probes.append((row["probe_id"], row["difficulty"]))
all_probes = sorted(set(all_probes))

for pid, difficulty in all_probes:
    cls = "FAILURE" if pid in FAILURES else "control" if pid in CONTROLS else "?"
    cells = [lane_probe_hit(lane, pid) for lane in lanes]
    out.append(f"| {pid} | {cls} | {difficulty} | {cells[0]} | {cells[1]} | {cells[2]} |")
out.append("")

out.append("## Summary\n")
out.append("| Lane | Total hits | Failure flips (miss→hit) | Control regressions (hit→miss) | Median ms | p95 ms |")
out.append("|---|---:|---:|---:|---:|---:|")
for lane in lanes:
    stats = lane_latency(lane)
    flips = lane_failure_flips(lane) if lane != "baseline-bge" else 0
    regs = lane_control_regressions(lane) if lane != "baseline-bge" else 0
    out.append(f"| {lane} | {stats['total_hits']}/{stats['n']} | {flips} | {regs} | {stats['median']} | {stats['p95']} |")
out.append("")

out.append("## Verdict\n")
for lane in ["bge-path-class", "jina-v3"]:
    flips = lane_failure_flips(lane)
    regs = lane_control_regressions(lane)
    if flips >= 2 and regs == 0:
        verdict = "✅ **SHIPS** — ≥2 failure flips, 0 control regressions"
    elif flips >= 2:
        verdict = f"⚠️ **HOLDS** — {flips} failure flips but {regs} control regressions"
    elif flips == 1:
        verdict = f"⚠️ **HOLDS** — only {flips} failure flip"
    else:
        verdict = f"❌ **FAILS** — 0 failure flips"
    out.append(f"- **{lane}**: {verdict}")

out.append("")
out.append("## Phase 2 Bench Order Reminder\n")
out.append("Per 011/research/research-convergence.md — bench BGE+path-class FIRST as the production-shippable lane; jina-v3 INFORMS only (never ships from this throwaway). If jina-v3 dominates path-class, escalate to production jina-v3 adapter packet. If jina-v3 ties or loses, delete cocoindex_code/rerankers_jina_v3.py + tests/test_rerankers_jina_v3.py.\n")

output_path = script_dir / "phase2-comparison.md"
output_path.write_text("\n".join(out))
print(f"wrote {output_path}")
PYTHON_SUMMARY

log "=========================================="
log "Phase 2 done. Comparison: $SCRIPT_DIR/phase2-comparison.md"
log "=========================================="
