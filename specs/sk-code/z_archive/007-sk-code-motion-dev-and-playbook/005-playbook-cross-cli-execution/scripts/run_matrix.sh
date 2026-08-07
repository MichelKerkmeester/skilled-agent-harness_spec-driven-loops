#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <scenario_manifest.csv>" >&2
  exit 2
fi

MANIFEST="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONCURRENCY_CAP="${CONCURRENCY_CAP:-5}"

if [[ ! -f "$MANIFEST" ]]; then
  echo "manifest not found: $MANIFEST" >&2
  exit 2
fi

running_jobs() {
  jobs -pr | wc -l | tr -d '[:space:]'
}

run_one() {
  local scenario_id="$1"
  local user_prompt="$2"
  local cli="$3"
  case "$cli" in
    codex) "${SCRIPT_DIR}/run_codex.sh" "$scenario_id" "$user_prompt" ;;
    copilot) "${SCRIPT_DIR}/run_copilot.sh" "$scenario_id" "$user_prompt" ;;
    gemini) "${SCRIPT_DIR}/run_gemini.sh" "$scenario_id" "$user_prompt" ;;
    opencode) "${SCRIPT_DIR}/run_opencode.sh" "$scenario_id" "$user_prompt" ;;
    *) echo "unknown CLI '${cli}' for ${scenario_id}" >&2; return 2 ;;
  esac
}

python3 - "$MANIFEST" <<'PY' | while IFS=$'\t' read -r scenario_id user_prompt cli_list; do
import csv, sys
from pathlib import Path
path = Path(sys.argv[1])
with path.open(newline="") as f:
    reader = csv.DictReader(f)
    required = {"SCENARIO_ID", "USER_PROMPT", "CLI_LIST"}
    missing = required - set(reader.fieldnames or [])
    if missing:
        raise SystemExit(f"missing columns: {sorted(missing)}")
    for row in reader:
        print(f"{row['SCENARIO_ID']}\t{row['USER_PROMPT']}\t{row['CLI_LIST']}")
PY
  IFS=',;| ' read -r -a clis <<<"$cli_list"
  for cli in "${clis[@]}"; do
    [[ -z "$cli" ]] && continue
    while [[ "$(running_jobs)" -ge "$CONCURRENCY_CAP" ]]; do
      sleep 1
    done
    run_one "$scenario_id" "$user_prompt" "$cli" &
  done
done

wait
