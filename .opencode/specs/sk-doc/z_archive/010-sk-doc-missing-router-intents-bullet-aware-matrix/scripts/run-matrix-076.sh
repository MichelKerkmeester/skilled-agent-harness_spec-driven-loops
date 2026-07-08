#!/bin/bash
# run-matrix.sh — execute 45-cell test matrix (15 scenarios × 3 CLIs)
# Concurrency: 3 CLIs in parallel per scenario; scenarios sequential.
# Output: logs/<SD-ID>/{codex,copilot,opencode}.log + deltas/<cli>.jsonl

set -u

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PB="$REPO_ROOT/.opencode/skills/sk-doc/manual_testing_playbook"
PHASE2="$REPO_ROOT/.opencode/specs/sk-doc/z_archive/010-sk-doc-missing-router-intents-bullet-aware-matrix"
LOGS="$PHASE2/logs"
DELTAS="$PHASE2/deltas"

# Reset deltas
> "$DELTAS/codex.jsonl"
> "$DELTAS/copilot.jsonl"
> "$DELTAS/opencode.jsonl"

# Extract prompt from a scenario .md (content inside the FIRST ``` block under ## Setup)
extract_prompt() {
  local file="$1"
  awk '
    /^## Setup/ { in_setup=1; next }
    /^## Expected Behavior/ { in_setup=0; next }
    in_setup && /^```/ { in_block = !in_block; next }
    in_setup && in_block { print }
  ' "$file"
}

# Run one CLI dispatch and append delta
run_cli() {
  local cli="$1" id="$2" prompt="$3" log="$4"
  local start=$(date +%s)
  local exit_code=0
  case "$cli" in
    codex)
      echo "$prompt" | timeout 180 codex exec --sandbox workspace-write \
        -c service_tier="fast" -c model="gpt-5.5" -c model_reasoning_effort="high" - \
        > "$log" 2>&1 || exit_code=$?
      ;;
    copilot)
      timeout 180 copilot -p "$prompt" --model claude-opus-4.7 \
        --allow-all-tools --no-ask-user \
        > "$log" 2>&1 || exit_code=$?
      ;;
    opencode)
      timeout 180 opencode run --model opencode-go/deepseek-v4-pro \
        --agent general --variant high --format json \
        --dir "$REPO_ROOT" "$prompt" \
        > "$log" 2>&1 || exit_code=$?
      ;;
  esac
  local end=$(date +%s)
  local duration=$((end - start))

  # Extract tokens per CLI
  local tokens=0
  case "$cli" in
    codex)
      # codex emits "tokens used\n[indent]NN,NNN" — capture next-line digits via awk
      tokens=$(awk '/tokens used/ {getline; gsub(/[^0-9]/,""); if (length($0)) {print; exit}}' "$log" 2>/dev/null)
      tokens=${tokens:-0}
      ;;
    copilot)
      local up=$(grep -oE 'Tokens[^0-9]*↑[^0-9]*[0-9,.kKM]+' "$log" 2>/dev/null | tail -1 | grep -oE '[0-9,.kKM]+' | tail -1)
      local down=$(grep -oE '↓[^0-9]*[0-9,.kKM]+' "$log" 2>/dev/null | tail -1 | grep -oE '[0-9,.kKM]+' | tail -1)
      tokens="up=${up:-0},down=${down:-0}"
      ;;
    opencode)
      # opencode emits a JSONL stream mixed with stderr noise; filter to JSON lines first
      tokens=$(grep -E '^\{' "$log" 2>/dev/null | jq -r 'select(.type=="step_finish") | .part.tokens.total // empty' 2>/dev/null | awk '{s+=$1} END {print s+0}')
      tokens=${tokens:-0}
      ;;
  esac

  # Append delta JSONL
  printf '{"scenario":"%s","cli":"%s","exit":%d,"duration_s":%d,"tokens":"%s","timestamp":"%s"}\n' \
    "$id" "$cli" "$exit_code" "$duration" "$tokens" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    >> "$DELTAS/$cli.jsonl"

  echo "[$cli] $id: exit=$exit_code, ${duration}s, tokens=$tokens"
}

# Loop over 15 scenarios
TOTAL=0
for scenario_file in $(find "$PB" -path '*/01--intent-detection/00[45]-*.md' -type f | sort); do
  TOTAL=$((TOTAL + 1))
  id=$(grep -m1 '^id:' "$scenario_file" | awk '{print $2}')
  prompt=$(extract_prompt "$scenario_file")

  if [ -z "$prompt" ]; then
    echo "[SKIP] $id: empty prompt extracted"
    continue
  fi

  mkdir -p "$LOGS/$id"

  echo ""
  echo "=== [$TOTAL/15] Scenario $id ==="
  echo "Prompt (first 80 chars): $(echo "$prompt" | head -c 80)..."

  # Run 3 CLIs in parallel for this scenario
  run_cli codex    "$id" "$prompt" "$LOGS/$id/codex.log"    &
  PID_CODEX=$!
  run_cli copilot  "$id" "$prompt" "$LOGS/$id/copilot.log"  &
  PID_COPILOT=$!
  run_cli opencode "$id" "$prompt" "$LOGS/$id/opencode.log" &
  PID_OPENCODE=$!

  # Wait for all 3
  wait $PID_CODEX $PID_COPILOT $PID_OPENCODE
done

echo ""
echo "=== MATRIX COMPLETE ==="
echo "Total scenarios processed: $TOTAL"
echo "Codex deltas:    $(wc -l < "$DELTAS/codex.jsonl")"
echo "Copilot deltas:  $(wc -l < "$DELTAS/copilot.jsonl")"
echo "Opencode deltas: $(wc -l < "$DELTAS/opencode.jsonl")"
