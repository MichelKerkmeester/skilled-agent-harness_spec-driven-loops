#!/usr/bin/env bash
# usage: run-other.sh <label>
set -uo pipefail
label="$1"; cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/220-relaunch-cancel-and-test-isolation
G="$(cd "$(dirname "$0")" && pwd)"
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts session-relaunch >"$G/$label-pi.txt" 2>&1; echo "pi vitest exit=$? $(grep -E 'Tests ' "$G/$label-pi.txt")"
node --test --test-reporter=tap .skilled/hooks/goal/bin/goal.test.cjs .skilled/hooks/goal/cursor/goal-cursor.test.mjs .skilled/hooks/goal/devin/goal-devin.test.mjs .skilled/hooks/goal/lib/goal-core.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/goal/pi/goal-pi.test.mjs >"$G/$label-goal.tap" 2>&1; echo "goal hooks exit=$? $(grep -E '^# (tests|pass|fail)' "$G/$label-goal.tap" | tr '\n' ' ')"
node --test --test-reporter=tap .opencode/plugins/tests/*.test.cjs >"$G/$label-plugins.tap" 2>&1; echo "plugins exit=$? $(grep -E '^# (tests|pass|fail)' "$G/$label-plugins.tap" | tr '\n' ' ')"
