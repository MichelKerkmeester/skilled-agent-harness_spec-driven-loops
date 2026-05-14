#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PLAYBOOK="$ROOT/.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence"
EVIDENCE_DIR="$ROOT/_sandbox/24--local-llm-query-intelligence/evidence"
LOG_DIR="$EVIDENCE_DIR/per-scenario-logs-post-wave"
SUMMARY="$EVIDENCE_DIR/run-2026-05-14-post-wave.summary.tsv"
SCENARIO_TIMEOUT_SECONDS="${SCENARIO_TIMEOUT_SECONDS:-900}"

mkdir -p "$LOG_DIR"
printf "scenario\tverdict\tkey_metric\tdetail\n" > "$SUMMARY"

run_with_watchdog() {
  local log="$1"
  shift

  "$@" 2>&1 &
  local child_pid=$!
  local elapsed=0

  while kill -0 "$child_pid" 2>/dev/null; do
    if (( elapsed >= SCENARIO_TIMEOUT_SECONDS )); then
      printf "\nTIMEOUT: scenario exceeded %s seconds; terminating child %s\n" "$SCENARIO_TIMEOUT_SECONDS" "$child_pid" | tee -a "$log"
      kill "$child_pid" 2>/dev/null || true
      sleep 2
      kill -9 "$child_pid" 2>/dev/null || true
      wait "$child_pid" 2>/dev/null || true
      return 124
    fi
    sleep 5
    elapsed=$((elapsed + 5))
  done

  wait "$child_pid"
}

run_scenario() {
  local scenario_num="$1"
  local log="$LOG_DIR/${scenario_num}.log"

  local scenario_file
  scenario_file=$(ls "$PLAYBOOK"/${scenario_num}-*.md 2>/dev/null | head -1)
  if [[ -z "$scenario_file" ]]; then
    printf "%s\tSKIP\tNo playbook file found\tCould not glob %s/%s-*.md\n" "$scenario_num" "$PLAYBOOK" "$scenario_num" >> "$SUMMARY"
    return
  fi

  local prompt
  prompt=$(cat <<PROMPT
You are validating local-LLM memory substrate scenario ${scenario_num}.

1. Read $scenario_file
2. Execute its TEST EXECUTION steps using real spec_kit_memory MCP tools (memory_save, memory_search, memory_health, memory_causal_link, memory_causal_stats, memory_drift_why, memory_delete) and cocoindex_code MCP tools.
3. Apply pass/fail criteria from section 2 of the scenario.
4. Run CLEAN-UP if present.

Output: exactly 3 lines at the end:
VERDICT: PASS|PARTIAL|FAIL|SKIP
KEY_METRIC: <one observation>
DETAIL: <2-3 sentences>

Constraints:
- Stay on main, no commits.
- No SpawnAgent.
- No retentionPolicy="ephemeral" on memory_save (post-022 governance decouple).
- Do not modify scenario playbook files or substrate source.
PROMPT
)

  printf "=== Scenario %s ===\n" "$scenario_num" | tee "$log"
  run_with_watchdog "$log" \
    codex exec --skip-git-repo-check -m gpt-5.5 -c service_tier=fast -c model_reasoning_effort=high --sandbox workspace-write -C "$ROOT" "$prompt" </dev/null | tee -a "$log"
  local status=${PIPESTATUS[0]}

  if [[ "$status" -eq 124 ]]; then
    printf "VERDICT: FAIL\nKEY_METRIC: Scenario timed out\nDETAIL: Child codex exec exceeded %s seconds. Inspect %s.\n" "$SCENARIO_TIMEOUT_SECONDS" "$log" | tee -a "$log"
  elif [[ "$status" -ne 0 ]]; then
    printf "\nCHILD_EXIT_STATUS: %s\n" "$status" | tee -a "$log"
    if ! grep -q '^VERDICT:' "$log" && grep -q 'failed to initialize in-process app-server client' "$log"; then
      printf "VERDICT: FAIL\nKEY_METRIC: codex exec app-server initialization failed\nDETAIL: Child codex exec exited before reading the scenario because the in-process app-server client could not initialize under the current sandbox. Inspect %s.\n" "$log" | tee -a "$log"
    fi
  fi

  local verdict key_metric detail
  verdict="$(grep '^VERDICT:' "$log" | tail -1 | sed 's/^VERDICT:[[:space:]]*//')"
  key_metric="$(grep '^KEY_METRIC:' "$log" | tail -1 | sed 's/^KEY_METRIC:[[:space:]]*//')"
  detail="$(grep '^DETAIL:' "$log" | tail -1 | sed 's/^DETAIL:[[:space:]]*//')"

  if [[ -z "${verdict:-}" ]]; then
    verdict="FAIL"
    key_metric="Missing final VERDICT line"
    detail="The scenario runner did not produce a VERDICT line. Inspect $log."
  fi

  printf "%s\t%s\t%s\t%s\n" "$scenario_num" "$verdict" "${key_metric:-UNKNOWN}" "${detail:-UNKNOWN}" >> "$SUMMARY"
}

for n in 401 402 403 404 405 406 407 408 409 410 411 412 413 414 415; do
  run_scenario "$n"
done

cat "$SUMMARY"
