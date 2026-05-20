#!/usr/bin/env bash
# Sweep CocoIndex hybrid RRF parameters against the corrected Phase 2 fixture.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
CCC="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
PYTHON="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python3"
DEFAULT_PACKET_DIR="$SCRIPT_DIR/../../../017-hybrid-fusion-empirical-recalibration"
PACKET_DIR="${COCOINDEX_RRF_SWEEP_PACKET_DIR:-$DEFAULT_PACKET_DIR}"
if ! PACKET_DIR="$(cd "$PACKET_DIR" 2>/dev/null && pwd)"; then
  echo "FATAL: invalid COCOINDEX_RRF_SWEEP_PACKET_DIR" >&2
  exit 2
fi
CELLS_DIR="$PACKET_DIR/evidence/cells"
FIXTURE="${COCOINDEX_RRF_SWEEP_FIXTURE:-$SCRIPT_DIR/code-retrieval-fixture-corrected.json}"
BASELINE_COMPARISON="${COCOINDEX_RRF_SWEEP_BASELINE_COMPARISON:-$PACKET_DIR/../016-query-expansion-identifier-bridging/evidence/phase2-comparison-016-query-expansion.md}"
PICK_LANE="${COCOINDEX_RRF_SWEEP_PICK_LANE:-baseline-bge}"
RESUME=false
AGGREGATE_ONLY=false
CELL_LIMIT="${COCOINDEX_RRF_SWEEP_CELL_LIMIT:-0}"

usage() {
  cat <<'USAGE'
Usage: sweep-rrf.sh [--resume] [--aggregate-only] [--limit N]

Environment:
  COCOINDEX_RRF_SWEEP_K_VALUES='[30,60,90,120]'
  COCOINDEX_RRF_SWEEP_VEC_WEIGHTS='[0.5,0.7,0.9,1.0]'
  COCOINDEX_RRF_SWEEP_FTS_WEIGHTS='[0.3,0.5,0.7,0.9]'
  COCOINDEX_RRF_SWEEP_PICK_LANE=baseline-bge
  COCOINDEX_RRF_SWEEP_CELL_LIMIT=4
USAGE
}

die() {
  echo "FATAL: $*" >&2
  exit 2
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --resume)
      RESUME=true
      ;;
    --aggregate-only)
      AGGREGATE_ONLY=true
      ;;
    --limit)
      shift
      CELL_LIMIT="${1:-}"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "FATAL: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

mkdir -p "$CELLS_DIR"

log() {
  printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"
}

restart_daemon() {
  log "restarting ccc daemon for env-var pickup"
  "$CCC" daemon stop >/dev/null 2>&1 || true
  if "$CCC" daemon start >/dev/null 2>&1; then
    return 0
  fi
  "$CCC" daemon restart >/dev/null 2>&1 || true
}

aggregate() {
  "$PYTHON" "$SCRIPT_DIR/sweep-rrf.py" \
    --cells-dir "$CELLS_DIR" \
    --output "$PACKET_DIR/evidence/sweep-results.md" \
    --lane "$PICK_LANE" \
    --baseline-comparison "$BASELINE_COMPARISON"
}

case "$PICK_LANE" in
  baseline-bge|bge-path-class|jina-v3) ;;
  *) die "invalid COCOINDEX_RRF_SWEEP_PICK_LANE: $PICK_LANE" ;;
esac

if ! [[ "$CELL_LIMIT" =~ ^[0-9]+$ ]]; then
  die "COCOINDEX_RRF_SWEEP_CELL_LIMIT must be a non-negative integer"
fi

if [[ "$FIXTURE" == *".."* ]]; then
  die "COCOINDEX_RRF_SWEEP_FIXTURE must not contain path traversal"
fi
if [ ! -f "$FIXTURE" ]; then
  echo "FATAL: corrected fixture not found: $FIXTURE" >&2
  exit 1
fi
FIXTURE_REAL="$(cd "$(dirname "$FIXTURE")" && pwd)/$(basename "$FIXTURE")"
case "$FIXTURE_REAL" in
  "$REPO_ROOT"/*) ;;
  *) die "COCOINDEX_RRF_SWEEP_FIXTURE must resolve under repository root" ;;
esac

if [ "$AGGREGATE_ONLY" = true ]; then
  aggregate
  exit $?
fi

CELLS=()
while IFS= read -r _line; do
  CELLS+=("$_line")
done < <("$PYTHON" - "$SCRIPT_DIR/sweep-rrf.py" <<'PYTHON_GRID'
import importlib.util
import sys
from pathlib import Path

module_path = Path(sys.argv[1])
spec = importlib.util.spec_from_file_location("sweep_rrf", module_path)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
sys.modules["sweep_rrf"] = module
spec.loader.exec_module(module)
k_values, vec_weights, fts_weights = module.parse_grid_from_env()
for k in k_values:
    for vec in vec_weights:
        for fts in fts_weights:
            slug = f"K{module.slug_number(k)}-V{module.slug_number(vec)}-F{module.slug_number(fts)}"
            print(f"{k}\t{vec:g}\t{fts:g}\t{slug}")
PYTHON_GRID
)

if [ "${#CELLS[@]}" -eq 0 ]; then
  echo "FATAL: sweep grid produced zero cells" >&2
  exit 1
fi

ran=0
for row in "${CELLS[@]}"; do
  IFS=$'\t' read -r rrf_k vec_weight fts_weight slug <<< "$row"
  cell_json="$CELLS_DIR/cell-$slug.json"
  if [ "$RESUME" = true ] && [ -f "$cell_json" ]; then
    log "skip existing cell $slug"
    continue
  fi
  if [ "$CELL_LIMIT" != "0" ] && [ "$ran" -ge "$CELL_LIMIT" ]; then
    log "cell limit reached: $CELL_LIMIT"
    break
  fi

  output_tag="-rrf-$slug"
  comparison_output="$PACKET_DIR/evidence/cells/$slug-comparison.md"
  log "cell start $slug"

  export COCOINDEX_RRF_K="$rrf_k"
  export COCOINDEX_RRF_VEC_WEIGHT="$vec_weight"
  export COCOINDEX_RRF_FTS_WEIGHT="$fts_weight"
  export COCOINDEX_HYBRID_RRF_K="$rrf_k"
  export COCOINDEX_HYBRID_VECTOR_WEIGHT="$vec_weight"
  export COCOINDEX_HYBRID_FTS5_WEIGHT="$fts_weight"

  restart_daemon

  if FIXTURE_OVERRIDE="$FIXTURE" OUTPUT_TAG="$output_tag" COMPARISON_OUTPUT="$comparison_output" \
    bash "$SCRIPT_DIR/run-phase2-smoke.sh"; then
    "$PYTHON" - "$SCRIPT_DIR" "$output_tag" "$cell_json" "$rrf_k" "$vec_weight" "$fts_weight" "$FIXTURE" "$comparison_output" <<'PYTHON_CELL'
import datetime as dt
import json
import sys
from pathlib import Path

script_dir = Path(sys.argv[1])
output_tag = sys.argv[2]
cell_json = Path(sys.argv[3])
k = int(sys.argv[4])
vec = float(sys.argv[5])
fts = float(sys.argv[6])
fixture = sys.argv[7]
comparison = sys.argv[8]
lanes = {}
module_path = script_dir / "sweep-rrf.py"
import importlib.util
import sys as _sys
spec = importlib.util.spec_from_file_location("sweep_rrf", module_path)
module = importlib.util.module_from_spec(spec)
assert spec.loader is not None
_sys.modules["sweep_rrf"] = module
spec.loader.exec_module(module)
for lane in ["baseline-bge", "bge-path-class", "jina-v3"]:
    path = script_dir / f"{lane}{output_tag}.results.jsonl"
    if path.exists():
        lanes[lane] = module.summarize_results_jsonl(path)
cell_json.write_text(json.dumps({
    "status": "ok",
    "created_at": dt.datetime.now(dt.UTC).isoformat(),
    "cell": {"k": k, "vec_weight": vec, "fts_weight": fts},
    "fixture": fixture,
    "output_tag": output_tag,
    "comparison_output": comparison,
    "lanes": lanes,
}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"wrote {cell_json}")
PYTHON_CELL
  else
    "$PYTHON" - "$cell_json" "$rrf_k" "$vec_weight" "$fts_weight" "$FIXTURE" "$comparison_output" <<'PYTHON_ERROR'
import datetime as dt
import json
import sys
from pathlib import Path

cell_json = Path(sys.argv[1])
cell_json.write_text(json.dumps({
    "status": "error",
    "created_at": dt.datetime.now(dt.UTC).isoformat(),
    "cell": {"k": int(sys.argv[2]), "vec_weight": float(sys.argv[3]), "fts_weight": float(sys.argv[4])},
    "fixture": sys.argv[5],
    "comparison_output": sys.argv[6],
    "lanes": {},
}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
PYTHON_ERROR
  fi
  ran=$((ran + 1))
  log "cell end $slug"
done

aggregate
