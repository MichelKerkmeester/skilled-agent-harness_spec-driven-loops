#!/usr/bin/env bash
# usage: run-gate-all.sh <label>  - runs every gate once in a clean (loop-variables-dropped) environment
set -uo pipefail
label="$1"
repo=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/220-relaunch-cancel-and-test-isolation
G="$(cd "$(dirname "$0")" && pwd)"
cd "$repo"
clean=(env)
for v in $(env | sed -n 's/^\(SKILLED_LOOP_[A-Z_]*\)=.*/\1/p'); do clean+=(-u "$v"); done
clean+=(-u SESSION_RELAUNCH_GOAL -u SESSION_RELAUNCH_GOAL_PACKET -u AI_SESSION_CHILD)
"${clean[@]}" node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs >"$G/$label-relaunch.tap" 2>&1
echo "relaunch exit=$? $(grep -E '^# (tests|pass|fail)' "$G/$label-relaunch.tap" | tr '\n' ' ')"
"${clean[@]}" node --test --test-reporter=tap .opencode/plugins/tests/*.test.cjs >"$G/$label-plugins.tap" 2>&1
echo "plugins exit=$? $(grep -E '^# (tests|pass|fail)' "$G/$label-plugins.tap" | tr '\n' ' ')"
"${clean[@]}" node --test --test-reporter=tap .skilled/hooks/goal/bin/goal.test.cjs .skilled/hooks/goal/cursor/goal-cursor.test.mjs .skilled/hooks/goal/devin/goal-devin.test.mjs .skilled/hooks/goal/lib/goal-core.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/goal/pi/goal-pi.test.mjs .skilled/hooks/shared/hook-flags.test.cjs >"$G/$label-goal.tap" 2>&1
echo "goal+hook-flags exit=$? $(grep -E '^# (tests|pass|fail)' "$G/$label-goal.tap" | tr '\n' ' ')"
bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh >"$G/$label-rulecopies.txt" 2>&1
echo "rule-copies exit=$? $(tail -2 "$G/$label-rulecopies.txt" | tr '\n' ' ')"
