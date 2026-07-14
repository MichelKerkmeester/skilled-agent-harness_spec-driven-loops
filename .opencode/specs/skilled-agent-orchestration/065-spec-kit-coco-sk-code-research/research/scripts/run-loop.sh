#!/usr/bin/env bash
# Run the deep-research loop: dispatch iterations 1..10 with convergence detection.
# Convergence: stop early if 2 consecutive iterations report 0 new P0/P1 findings.
set -euo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
cd "$REPO_ROOT"

SF=".opencode/specs/skilled-agent-orchestration/077-spec-kit-coco-sk-code-research"
RD="$SF/research"
DISPATCH="$RD/scripts/dispatch-iter.sh"
MAX_ITER=10
CONV_STREAK_THRESHOLD=2

START_ITER=${START_ITER:-1}
streak=0
last_p0p1=999

# Pre-populate streak from iter 1 result if resuming (P1=2 in iter 1 → streak=0)
if [[ $START_ITER -gt 1 ]]; then
  echo "RESUMING from iter $START_ITER (streak=0 from prior runs)"
fi

for N in $(seq $START_ITER $MAX_ITER); do
  NN=$(printf "%03d" "$N")
  echo "════════════════════════════════════════════════════════════════"
  echo "DISPATCH iteration $N at $(date -u +%H:%M:%SZ)"
  echo "════════════════════════════════════════════════════════════════"

  bash "$DISPATCH" "$N" || {
    echo "ITER $N FAILED — proceeding to next iteration anyway"
  }

  # Parse iteration narrative for P0/P1 finding count
  ITER_FILE="$RD/iterations/iteration-${NN}.md"
  if [[ -f "$ITER_FILE" ]]; then
    p0_count=$({ grep -cE '\[P0\]' "$ITER_FILE" || true; } | head -1 | tr -d ' \n')
    p1_count=$({ grep -cE '\[P1\]' "$ITER_FILE" || true; } | head -1 | tr -d ' \n')
    p0_count=${p0_count:-0}
    p1_count=${p1_count:-0}
    p0p1=$((p0_count + p1_count))
    echo "iter $N: P0=$p0_count P1=$p1_count (combined=$p0p1)"

    if [[ $p0p1 -eq 0 ]]; then
      streak=$((streak + 1))
      echo "streak of zero-new-findings: $streak"
    else
      streak=0
    fi

    if [[ $streak -ge $CONV_STREAK_THRESHOLD ]]; then
      echo "════════════════════════════════════════════════════════════════"
      echo "CONVERGED at iteration $N (streak=$streak >= $CONV_STREAK_THRESHOLD)"
      echo "════════════════════════════════════════════════════════════════"
      echo "{\"type\":\"event\",\"event\":\"converged\",\"atIteration\":${N},\"streak\":${streak},\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$RD/deep-research-state.jsonl"
      break
    fi
  else
    echo "iter $N: NO iteration-${NN}.md produced — counted as failure"
  fi
done

echo "════════════════════════════════════════════════════════════════"
echo "LOOP COMPLETE at $(date -u +%H:%M:%SZ)"
echo "Iterations completed: $(ls $RD/iterations/iteration-*.md 2>/dev/null | wc -l | tr -d ' ')"
echo "Total state log lines: $(wc -l < $RD/deep-research-state.jsonl | tr -d ' ')"
echo "════════════════════════════════════════════════════════════════"
