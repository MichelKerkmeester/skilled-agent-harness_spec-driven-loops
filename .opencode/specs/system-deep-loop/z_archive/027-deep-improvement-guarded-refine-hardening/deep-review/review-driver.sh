#!/usr/bin/env bash
# Spec 143 deep-review driver — ONE MiMo review iteration per call (sequential discipline).
# Usage: bash review-driver.sh <iteration 1..10>
# Output: findings-<k>.txt in this directory (P0/P1/P2 JSON lines + prose).
set -uo pipefail
K="${1:?iteration 1..10}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PUB="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
BARTER="/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter"
DI="$PUB/.opencode/skills/deep-improvement"
MODEL="${REVIEW_MODEL:-xiaomi/mimo-v2.5-pro}"   # MiMo 2.5 Pro per the goal directive

# Lens table: iteration -> focus + files. Lenses rotate across the full spec-143 delta.
case "$K" in
  1) LENS="loop.py correctness: phase logic, aggregation math, gap analysis, convergence"; FILES="$BARTER/Copywriter/_loop/loop.py" ;;
  2) LENS="concurrency + state: lock semantics, stale eviction, resume cache validity (cfg/HEAD guards), orphan detection, journal torn-line tolerance"; FILES="$BARTER/Copywriter/_loop/loop.py" ;;
  3) LENS="gates integrity: frozen-surface extraction edge cases (anchor matching, section boundaries), derive correctness, staleness pathspec symlink resolution"; FILES="$BARTER/Copywriter/_gates/gates.py $BARTER/Copywriter/_gates/derive.py" ;;
  4) LENS="gauntlet coverage: which attacks are missing? can any guard be bypassed in a way no attack tests?"; FILES="$BARTER/Copywriter/_loop/gauntlet.py $BARTER/Copywriter/_loop/loop.py" ;;
  5) LENS="run-benchmark changes: samples aggregation, deliverable contract, phantom gap, family gate — correctness + backward compatibility risks"; FILES="$DI/scripts/model-benchmark/run-benchmark.cjs" ;;
  6) LENS="loop-host + Lane D adapter: flag forwarding, contract validation, mode resolution, error paths"; FILES="$DI/scripts/shared/loop-host.cjs $DI/scripts/packaging-benchmark-refine/run-packaging-refine.cjs" ;;
  7) LENS="shared helpers: model-family heuristics (false positives/negatives), rubric-guard region extraction (evasions), extract-deliverable, fixture-lint"; FILES="$DI/scripts/shared/model-family.cjs $DI/scripts/shared/rubric-guard.cjs $DI/scripts/shared/extract-deliverable.cjs $DI/scripts/shared/fixture-lint.cjs" ;;
  8) LENS="promote-candidate rubric gate placement + regrade/calibrate correctness (parsing, kill-switch, agreement math)"; FILES="$DI/scripts/shared/promote-candidate.cjs $BARTER/Copywriter/benchmark/grader/regrade.py $BARTER/Copywriter/benchmark/grader/calibrate.py" ;;
  9) LENS="docs accuracy vs code: do the command, operator guide and conventions claim anything the code does not do?"; FILES="$PUB/.opencode/commands/deep/start-packaging-refine-loop.md $DI/references/packaging-benchmark-refine/operator_guide.md $DI/references/shared/heldout_and_gold_sets.md" ;;
  10) LENS="Barter deals port consistency: constants vs Copywriter original, DEAL floors/maxes, harness + grader prompt correctness for the deals domain"; FILES="$BARTER/Barter deals/_loop/loop.py $BARTER/Barter deals/_gates/gates.py $BARTER/Barter deals/benchmark/run.sh $BARTER/Barter deals/benchmark/grader/regrade.py" ;;
  *) echo "iteration 1..10" >&2; exit 2 ;;
esac

PROMPT="You are an adversarial senior code reviewer (iteration $K of 10, lens: $LENS).

READ these files completely:
$(for f in $FILES; do echo "- $f"; done)

Context: this is a guarded autonomous benchmark-and-refine system (spec 143). Its core invariants: the optimizer must never edit the rubric it is scored against; the grader must be a different model family than the proposer; promotion needs held-out non-regression inside an isolated git worktree; measurement gaps (n=0) are not failures; everything must clean up on kill.

Hunt for REAL defects through your lens: logic errors, race conditions, bypasses of the invariants, silent failure modes, incorrect math, path bugs, false assumptions. Do NOT report style nits or hypotheticals you cannot ground in the code.

Reply with ONLY findings, one per line, format:
P0|file|short title|one-line evidence (P0 = breaks an invariant or corrupts state; P1 = real bug, wrong result possible; P2 = robustness gap)
If you find nothing at a severity, omit it. End with: VERDICT: <n> findings."

AI_SESSION_CHILD=1 opencode run --model "$MODEL" --variant high --dir "$PUB" "$PROMPT" </dev/null > "$HERE/findings-$K.txt" 2>&1
echo "iteration $K done -> findings-$K.txt ($(grep -cE '^P[012]\|' "$HERE/findings-$K.txt" 2>/dev/null || echo 0) findings)"
