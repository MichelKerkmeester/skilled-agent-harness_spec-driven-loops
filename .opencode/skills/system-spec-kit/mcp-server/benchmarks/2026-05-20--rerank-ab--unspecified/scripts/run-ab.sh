#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BENCH_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$BENCH_DIR/../../../../../.." && pwd)"
FIXTURE="$BENCH_DIR/rerank-ab-fixture.json"
SOURCE="$BENCH_DIR/SOURCE.md"
ARM_A="$BENCH_DIR/per-probe-arm-a.jsonl"
ARM_B="$BENCH_DIR/per-probe-arm-b.jsonl"
PER_PROBE="$BENCH_DIR/per-probe.jsonl"
RESULTS="$BENCH_DIR/results.csv"
REPORT="$BENCH_DIR/benchmark-report.md"
N_RUNS="${N_RUNS:-5}"

echo "[run-ab] Pre-clean rerank sidecar (best effort)"
pkill -f "system-rerank-sidecar" 2>/dev/null || true
pkill -f "uvicorn.*rerank" 2>/dev/null || true

echo "[run-ab] Settling spec-memory startup scan before snapshot"
python3 "$SCRIPT_DIR/run_arm.py" \
  --fixture "$FIXTURE" \
  --repo-root "$REPO_ROOT" \
  --cross-encoder false \
  --reranker-local false \
  --settle-only

echo "[run-ab] Refreshing fixture memory_index snapshot"
SNAPSHOT_JSON="$(python3 "$SCRIPT_DIR/run_arm.py" --fixture "$FIXTURE" --repo-root "$REPO_ROOT" --update-snapshot)"
export SNAPSHOT_JSON SOURCE
python3 - <<'PY'
import json
import os
from pathlib import Path

snapshot = json.loads(os.environ["SNAPSHOT_JSON"])
source = Path(os.environ["SOURCE"])
text = source.read_text()
start = text.index("Initial authoring snapshot:")
end = text.index("`scripts/run-ab.sh` refreshes", start)
replacement = f"""Run-time snapshot:

| Field | Value |
|---|---|
| Captured at | `{snapshot['captured_at']}` |
| memory_index size | `{snapshot['memory_index_size']}` |
| memory_index hash | `{snapshot['memory_index_hash']}` |
| Hash recipe | SHA-256 over sorted `id`, `spec_folder`, `file_path`, `content_hash`, `title`, `document_type` rows |

"""
source.write_text(text[:start] + replacement + text[end:])
PY

echo "[run-ab] Running arm A positional fallback, n=$N_RUNS"
python3 "$SCRIPT_DIR/run_arm.py" \
  --fixture "$FIXTURE" \
  --out "$ARM_A" \
  --arm A \
  --runs "$N_RUNS" \
  --repo-root "$REPO_ROOT" \
  --cross-encoder false \
  --reranker-local false

EXPECTED_ROWS=$(python3 - <<'PY' "$FIXTURE" "$N_RUNS"
import json
import sys
fixture = json.load(open(sys.argv[1]))
print(len(fixture["probes"]) * int(sys.argv[2]))
PY
)
ARM_A_ROWS=$(wc -l < "$ARM_A" | tr -d ' ')
if [ "$ARM_A_ROWS" -lt "$EXPECTED_ROWS" ]; then
  echo "[run-ab] Arm A row count too low: $ARM_A_ROWS < $EXPECTED_ROWS" >&2
  exit 1
fi

echo "[run-ab] Ensuring Qwen rerank sidecar"
(
  cd "$REPO_ROOT"
  SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true node - <<'NODE'
const { ensureRerankSidecar } = require('./.opencode/bin/lib/ensure-rerank-sidecar.cjs');
ensureRerankSidecar({ skipIfDisabled: false, healthTimeoutMs: 120000 })
  .then((result) => {
    console.log(JSON.stringify(result));
    if (result.fallback) process.exit(2);
  })
  .catch((error) => {
    console.error(error && error.stack ? error.stack : String(error));
    process.exit(1);
  });
NODE
)

echo "[run-ab] Warming sidecar"
python3 - <<'PY'
import json
import urllib.request
req = urllib.request.Request("http://127.0.0.1:8765/warmup", method="POST")
with urllib.request.urlopen(req, timeout=240) as response:
    print(response.read().decode())
PY

echo "[run-ab] Running arm B Qwen sidecar, n=$N_RUNS"
python3 "$SCRIPT_DIR/run_arm.py" \
  --fixture "$FIXTURE" \
  --out "$ARM_B" \
  --arm B \
  --runs "$N_RUNS" \
  --repo-root "$REPO_ROOT" \
  --cross-encoder true \
  --reranker-local true \
  --query-timeout 240

ARM_B_ROWS=$(wc -l < "$ARM_B" | tr -d ' ')
if [ "$ARM_B_ROWS" -lt "$EXPECTED_ROWS" ]; then
  echo "[run-ab] Arm B row count too low: $ARM_B_ROWS < $EXPECTED_ROWS" >&2
  exit 1
fi

python3 - <<'PY' "$ARM_A" "$ARM_B" "$PER_PROBE"
import sys
from pathlib import Path
out = Path(sys.argv[3])
with out.open("w", encoding="utf-8") as handle:
    for src in [Path(sys.argv[1]), Path(sys.argv[2])]:
        handle.write(src.read_text())
PY

echo "[run-ab] Aggregating"
python3 "$SCRIPT_DIR/aggregate.py" "$ARM_A" "$ARM_B" --out "$RESULTS"

echo "[run-ab] Generating report"
python3 "$SCRIPT_DIR/generate_report.py" \
  --fixture "$FIXTURE" \
  --results "$RESULTS" \
  --per-probe "$PER_PROBE" \
  --out "$REPORT"

echo "[run-ab] Done: $REPORT"
