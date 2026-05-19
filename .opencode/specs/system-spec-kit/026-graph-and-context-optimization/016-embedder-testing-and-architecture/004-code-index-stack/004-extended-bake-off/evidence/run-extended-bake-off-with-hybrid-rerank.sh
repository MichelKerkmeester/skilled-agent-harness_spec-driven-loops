#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Extended embedder bake-off harness — 016/006/004
# Mirrors 018/003 ad-hoc approach as a reusable script.
# ───────────────────────────────────────────────────────────────
# Usage: ./run-extended-bake-off.sh <candidate1> [candidate2 ...]
# Example: ./run-extended-bake-off.sh sbert/dunzhang/stella_en_400M_v5 sbert/nomic-ai/CodeRankEmbed
# ───────────────────────────────────────────────────────────────
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
FIXTURE="${FIXTURE_OVERRIDE:-$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json}"
OUT_CSV="${OUT_CSV_OVERRIDE:-$SCRIPT_DIR/cocoindex-embedder-comparison-with-hybrid-rerank.csv}"
OUT_JSONL="${OUT_JSONL_OVERRIDE:-$SCRIPT_DIR/cocoindex-embedder-comparison-with-hybrid-rerank.jsonl}"
RUNLOG="${RUNLOG_OVERRIDE:-$SCRIPT_DIR/runlog-with-hybrid-rerank.txt}"

# Canonical ccc binary — prefer the editable local venv install (production-truthful);
# fall back to whatever's on PATH. After 016/005/005-cocoindex-install-hygiene both pipx
# and local venv point at the same editable source so either should be safe; the local
# venv is the explicit pick to avoid PATH ordering drift.
CCC="${CCC:-$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc}"
if [ ! -x "$CCC" ]; then
  CCC="$(command -v ccc)"
fi

cd "$REPO_ROOT"

if [ ! -f "$FIXTURE" ]; then
  echo "FATAL: fixture not found at $FIXTURE" >&2
  exit 1
fi

# Initialize output files if not present
[ -f "$OUT_CSV" ] || echo "embedder,dim,n_pairs,total_hits,hit_rate,hit_easy,hit_medium,hit_hard,median_ms,p95_ms" > "$OUT_CSV"
[ -f "$RUNLOG" ] || true

log() {
  local msg="$1"
  local ts
  ts="$(date +%Y-%m-%dT%H:%M:%S%z)"
  echo "[$ts] $msg" | tee -a "$RUNLOG"
}

pre_pull() {
  local candidate="$1"
  local hf_name="${candidate#sbert/}"
  log "pre-pull start: $candidate"
  if $REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3 -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('$hf_name', trust_remote_code=True)" 2>&1 | tee -a "$RUNLOG" | tail -1 | grep -qi "error\|fail"; then
    log "pre-pull FAILED: $candidate"
    return 1
  fi
  log "pre-pull done: $candidate"
  return 0
}

run_candidate() {
  local candidate="$1"
  local candidate_start
  candidate_start=$(date +%s)
  log "candidate start: $candidate"

  # Pre-pull model (workaround for prior nomic/bge daemon-crash)
  if ! pre_pull "$candidate"; then
    log "candidate SKIPPED (pre-pull failed): $candidate"
    return 1
  fi

  # Set env + reset + reindex
  export COCOINDEX_CODE_EMBEDDING_MODEL="$candidate"
  log "reset: $candidate"
  if ! "$CCC" reset --force 2>&1 | tee -a "$RUNLOG" | tail -3; then
    log "reset FAILED: $candidate"
    return 1
  fi

  log "index start: $candidate"
  local idx_out
  if ! idx_out=$("$CCC" index 2>&1); then
    log "index FAILED: $candidate; rc=$?; stderr=$(echo "$idx_out" | tail -3)"
    return 1
  fi
  log "index complete: $candidate; tail='$(echo "$idx_out" | tail -5 | tr '\n' ' ')'"

  # Probe fixture pairs + record hits + latency.
  # Export CCC for the Python heredoc so per-probe `ccc search` uses the canonical binary
  # rather than re-resolving via PATH (which could land on a different ccc install).
  export CCC
  local probes
  probes=$($REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3 - "$FIXTURE" "$candidate" "$OUT_JSONL" <<'PYTHON'
import json
import os
import sys
import subprocess
import time
import re
from pathlib import Path

fixture_path = sys.argv[1]
candidate = sys.argv[2]
jsonl_path = sys.argv[3]
ccc_bin = os.environ.get("CCC", "ccc")
pairs = json.loads(open(fixture_path).read())

hits = 0
hits_by_difficulty = {"easy": 0, "medium": 0, "hard": 0}
latencies = []
MIRROR_PREFIXES = (".opencode/", ".claude/", ".codex/", ".gemini/")
TRAILING_PUNCTUATION = ",;.)]}"
QUOTE_CHARS = chr(96) + "'\""

def _clean_path_candidate(token: str) -> str:
    candidate = token.strip().strip(QUOTE_CHARS).strip()
    for _ in range(2):
        candidate = candidate.lstrip("([{").rstrip(TRAILING_PUNCTUATION).strip(QUOTE_CHARS).strip()
    candidate = re.sub(r":\d+(-\d+)?$", "", candidate)
    candidate = candidate.rstrip(TRAILING_PUNCTUATION).strip(QUOTE_CHARS).strip()
    candidate = re.sub(r":\d+(-\d+)?$", "", candidate)
    return candidate

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

for i, p in enumerate(pairs, 1):
    query = p["query"]
    expected = p.get("expected_source_path") or p.get("expected_path", "")
    difficulty = p.get("difficulty", "medium")

    t0 = time.monotonic()
    result = subprocess.run(
        [ccc_bin, "search", query, "--limit", "5"],
        capture_output=True, text=True, timeout=30,
    )
    latency_ms = int((time.monotonic() - t0) * 1000)
    latencies.append(latency_ms)

    top_paths = _extract_paths(result.stdout) if result.returncode == 0 else []

    # Normalize across mirror trees: .opencode/.claude/.codex/.gemini
    def norm(path):
        # strip mirror prefix
        for prefix in [".opencode/", ".claude/", ".codex/", ".gemini/"]:
            if path.startswith(prefix):
                path = path[len(prefix):]
                break
        # strip any remaining line-range suffix
        import re as _re2
        path = _re2.sub(r":\d+(-\d+)?$", "", path)
        return path

    top1 = top_paths[0] if top_paths else ""
    top_paths_normalized = [norm(p) for p in top_paths[:5]]  # top-5 hit semantics
    expected_norm = norm(expected) if expected else ""
    hit = (expected_norm in top_paths_normalized) if expected_norm else False
    if hit:
        hits += 1
        hits_by_difficulty[difficulty] = hits_by_difficulty.get(difficulty, 0) + 1

    # JSONL row per probe
    with open(jsonl_path, "a") as f:
        f.write(json.dumps({
            "embedder": candidate,
            "probe": i,
            "query": query,
            "expected": expected,
            "top1": top1,
            "hit": hit,
            "latency_ms": latency_ms,
            "difficulty": difficulty,
        }) + "\n")

# Emit summary
latencies.sort()
median = latencies[len(latencies)//2] if latencies else 0
p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0

import os
dim_map = {
    "sbert/dunzhang/stella_en_400M_v5": 1024,
    "sbert/nomic-ai/CodeRankEmbed": 768,
    "sbert/BAAI/bge-code-v1": 768,
    "sbert/jinaai/jina-embeddings-v2-base-code": 768,
    "sbert/google/embeddinggemma-300m": 768,
}
dim = dim_map.get(candidate, 0)

print(f"{candidate},{dim},{len(pairs)},{hits},{hits/len(pairs):.3f},{hits_by_difficulty.get('easy',0)},{hits_by_difficulty.get('medium',0)},{hits_by_difficulty.get('hard',0)},{median},{p95}")
PYTHON
)
  if [ -n "$probes" ]; then
    echo "$probes" >> "$OUT_CSV"
    log "probes done: $candidate; summary=$probes"
  fi

  local candidate_end
  candidate_end=$(date +%s)
  log "candidate done: $candidate; wall_s=$((candidate_end - candidate_start))"
  return 0
}

# Main loop
START_TS=$(date +%s)
log "benchmark start; candidates=$*"

for candidate in "$@"; do
  run_candidate "$candidate" || log "candidate marked failed: $candidate"
done

END_TS=$(date +%s)
log "benchmark complete; total_wall_s=$((END_TS - START_TS))"
log "results: CSV=$OUT_CSV JSONL=$OUT_JSONL RUNLOG=$RUNLOG"

# Restore baseline (jina-code) regardless of outcomes
log "restore: setting COCOINDEX_CODE_EMBEDDING_MODEL back to jina-code"
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/jinaai/jina-embeddings-v2-base-code"
"$CCC" reset --force 2>&1 | tail -3 | tee -a "$RUNLOG"
"$CCC" index 2>&1 | tail -5 | tee -a "$RUNLOG"
log "restore complete; CocoIndex back on jina-code baseline"
