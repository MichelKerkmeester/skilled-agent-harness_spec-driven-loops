#!/usr/bin/env bash
# usage: run-gate.sh <set|unset|foreign> <label> [repo]
set -uo pipefail
mode="$1"; label="$2"; repo="${3:-/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/220-relaunch-cancel-and-test-isolation}"
out="$(cd "$(dirname "$0")" && pwd)/$label-$mode.tap"
cd "$repo"
clean=(env)
for v in $(env | sed -n 's/^\(SKILLED_LOOP_[A-Z_]*\)=.*/\1/p'); do clean+=(-u "$v"); done
clean+=(-u SESSION_RELAUNCH_GOAL -u SESSION_RELAUNCH_GOAL_PACKET -u AI_SESSION_CHILD)
case "$mode" in
  set)     cmd=(env) ;;
  unset)   cmd=("${clean[@]}") ;;
  foreign) cmd=("${clean[@]}" SKILLED_LOOP_ID=999999 SKILLED_LOOP_RUNTIME=pi SKILLED_LOOP_HOPS=7 SKILLED_LOOP_NAME=foreign SKILLED_LOOP_MODEL=other 'SKILLED_LOOP_MANUAL_TEMPLATE=skilled-loop pi --model other "[session-relaunch] claim and continue handoff @@HANDOFF@@"') ;;
esac
"${cmd[@]}" node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs >"$out" 2>&1
code=$?
echo "$mode $label exit=$code $(grep -E '^# (tests|pass|fail)' "$out" | tr '\n' ' ')"
