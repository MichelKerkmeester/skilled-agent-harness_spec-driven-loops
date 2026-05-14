#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
EVIDENCE_DIR="$ROOT/_sandbox/24--local-llm-query-intelligence/evidence"
LOG_DIR="$EVIDENCE_DIR/per-scenario-logs-post-032"
SUMMARY="$EVIDENCE_DIR/run-2026-05-14b-post-032.summary.tsv"
MODEL="opencode-go/kimi-k2.6"
VARIANT="high"

mkdir -p "$LOG_DIR"
printf "scenario\tverdict\tkey_metric\tdetail\n" > "$SUMMARY"

run_scenario() {
  local scenario="$1"
  local log="$LOG_DIR/${scenario}.log"
  local prompt

  prompt=$(cat <<PROMPT
You are validating local-LLM memory substrate scenario ${scenario}.
1. Glob \`.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/${scenario}-*.md\`
2. Read it
3. Execute its TEST EXECUTION steps using real MCP tools.
4. For save-heavy scenarios (401, 411-415): the scenarios warn against passing retentionPolicy:"ephemeral" -- follow that warning.
5. Apply pass/fail from section 2.
6. Run CLEAN-UP if present.

FINAL OUTPUT -- exactly 3 lines:
VERDICT: PASS|PARTIAL|FAIL|SKIP
KEY_METRIC: <one observation>
DETAIL: <2-3 sentences>
PROMPT
)

  echo "=== Scenario ${scenario} ===" | tee "$log"
  XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}" \
    opencode run --pure -m "$MODEL" --variant "$VARIANT" "$prompt" </dev/null 2>&1 | tee -a "$log"

  local verdict key_metric detail
  verdict="$(rg '^VERDICT:' "$log" | tail -1 | sed 's/^VERDICT:[[:space:]]*//')"
  key_metric="$(rg '^KEY_METRIC:' "$log" | tail -1 | sed 's/^KEY_METRIC:[[:space:]]*//')"
  detail="$(rg '^DETAIL:' "$log" | tail -1 | sed 's/^DETAIL:[[:space:]]*//')"

  if [[ -z "${verdict:-}" ]]; then
    verdict="FAIL"
    key_metric="Missing final VERDICT line"
    detail="The scenario runner did not produce the required three-line tail. Inspect ${log} for the raw dispatch output."
  fi

  printf "%s\t%s\t%s\t%s\n" "$scenario" "$verdict" "${key_metric:-UNKNOWN}" "${detail:-UNKNOWN}" >> "$SUMMARY"
}

for scenario in 401 402 403 404 405 406 407 408 409 410 411 412 413 414 415; do
  run_scenario "$scenario"
done

echo
echo "Summary:"
column -t -s $'\t' "$SUMMARY"
